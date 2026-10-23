import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { DataStore, getCompositeKey, hasUsableTranscript } from '../src/services/dataService.js';
import { ROUTE_CATEGORIES } from '../src/services/routingTaxonomy.js';

describe('DATA_CONTRACT.md Replay & Ingestion Test Suite', () => {
  let store;
  let initialBatch;
  let updateBatch;

  beforeEach(() => {
    store = new DataStore();
    store.clear();

    const initialRaw = fs.readFileSync(path.resolve(__dirname, '../data/01_initial.json'), 'utf8');
    const updateRaw = fs.readFileSync(path.resolve(__dirname, '../data/02_update.json'), 'utf8');
    initialBatch = JSON.parse(initialRaw);
    updateBatch = JSON.parse(updateRaw);
  });

  it('TEST 1: Initial Import produces exactly 44 records and 17 transcripts', () => {
    const summary = store.ingestBatch(initialBatch);

    expect(store.getRecordCount()).toBe(44);
    expect(summary.inserted).toBe(44);
    expect(summary.updated).toBe(0);
    expect(summary.ignored).toBe(0);

    const metrics = store.getMetrics();
    expect(metrics.totalRecords).toBe(44);
    expect(metrics.calls).toBe(30);
    expect(metrics.meetings).toBe(14);
    expect(metrics.transcripts).toBe(17);

    // Verify M07 is initially present without transcript turns
    const m07 = store.getRecord('meeting', '4f304fff-fd40-5cfc-a366-0a134c445c2a');
    expect(m07).toBeDefined();
    expect(m07.applied_revision).toBe(1);
    expect(m07.has_transcript).toBe(false);
  });

  it('TEST 2: Duplicate Import does not duplicate records or inflate counts', () => {
    store.ingestBatch(initialBatch);
    expect(store.getRecordCount()).toBe(44);

    // Re-import initial batch (replaying identical batch)
    const summary2 = store.ingestBatch(initialBatch);
    expect(store.getRecordCount()).toBe(44);
    expect(summary2.inserted).toBe(0);
    expect(summary2.updated).toBe(0);
    expect(summary2.ignored).toBe(44);

    // Re-import with reversed record order
    const reversedBatch = {
      ...initialBatch,
      records: [...initialBatch.records].reverse()
    };
    const summary3 = store.ingestBatch(reversedBatch);
    expect(store.getRecordCount()).toBe(44);
    expect(summary3.ignored).toBe(44);
    expect(store.getTranscriptCount()).toBe(17);
  });

  it('TEST 3: Manual route override persists and is flagged accurately', () => {
    store.ingestBatch(initialBatch);

    const m07Key = { type: 'meeting', id: '4f304fff-fd40-5cfc-a366-0a134c445c2a' };
    const updatedRec = store.setManualRoute(
      m07Key.type,
      m07Key.id,
      ROUTE_CATEGORIES.CUSTOMER_SUPPORT_BUG,
      'Manager manual triage: investigating payment description defect'
    );

    expect(updatedRec.analysis.isManualOverride).toBe(true);
    expect(updatedRec.analysis.route).toBe(ROUTE_CATEGORIES.CUSTOMER_SUPPORT_BUG);
    expect(updatedRec.analysis.manualRoute).toBe(ROUTE_CATEGORIES.CUSTOMER_SUPPORT_BUG);
    expect(updatedRec.analysis.reviewStatus).toBe('reviewed');
  });

  it('TEST 4 & 5: Update batch applies Revision 2, unlocks M07 transcript, and PRESERVES manual override', () => {
    // 1. Initial import
    store.ingestBatch(initialBatch);
    expect(store.getRecordCount()).toBe(44);
    expect(store.getTranscriptCount()).toBe(17);

    // 2. Set manual override on M07 to Customer Support Bug
    const m07Id = '4f304fff-fd40-5cfc-a366-0a134c445c2a';
    store.setManualRoute(
      'meeting',
      m07Id,
      ROUTE_CATEGORIES.CUSTOMER_SUPPORT_BUG,
      'Explicit manager override before late transcript arrived'
    );

    // 3. Ingest Update Batch (02_update.json, rev 2)
    const updateSummary = store.ingestBatch(updateBatch);
    expect(updateSummary.inserted).toBe(0);
    expect(updateSummary.updated).toBe(1);

    // Invariants check after update
    expect(store.getRecordCount()).toBe(44); // Must remain 44, not 45!
    expect(store.getTranscriptCount()).toBe(18); // Transcripts increase to 18!

    // Verify M07 state
    const m07 = store.getRecord('meeting', m07Id);
    expect(m07).toBeDefined();
    expect(m07.applied_revision).toBe(2);
    expect(m07.has_transcript).toBe(true);
    expect(m07.transcript_payload.turns.length).toBe(27);

    // CRITICAL INVARIANT: Manual override must survive!
    expect(m07.analysis.isManualOverride).toBe(true);
    expect(m07.analysis.route).toBe(ROUTE_CATEGORIES.CUSTOMER_SUPPORT_BUG);
    expect(m07.analysis.manualRoute).toBe(ROUTE_CATEGORIES.CUSTOMER_SUPPORT_BUG);

    // 4. Repeat Update (Re-importing 02_update.json)
    const repeatUpdateSummary = store.ingestBatch(updateBatch);
    expect(repeatUpdateSummary.ignored).toBe(1);
    expect(store.getRecordCount()).toBe(44);
    expect(store.getTranscriptCount()).toBe(18);
    expect(m07.analysis.isManualOverride).toBe(true);
  });

  it('TEST 6: Older revision rejection (01_initial re-imported after 02_update cannot downgrade M07)', () => {
    store.ingestBatch(initialBatch);
    store.ingestBatch(updateBatch);

    const m07AfterUpdate = store.getRecord('meeting', '4f304fff-fd40-5cfc-a366-0a134c445c2a');
    expect(m07AfterUpdate.applied_revision).toBe(2);
    expect(m07AfterUpdate.has_transcript).toBe(true);

    // Re-import initial batch (rev 1)
    const reInitialSummary = store.ingestBatch(initialBatch);
    expect(reInitialSummary.ignored).toBe(44);

    const m07AfterReInitial = store.getRecord('meeting', '4f304fff-fd40-5cfc-a366-0a134c445c2a');
    expect(m07AfterReInitial.applied_revision).toBe(2);
    expect(m07AfterReInitial.has_transcript).toBe(true);
    expect(m07AfterReInitial.transcript_payload.turns.length).toBe(27);
    expect(store.getRecordCount()).toBe(44);
    expect(store.getTranscriptCount()).toBe(18);
  });

  it('TEST 7: Composite identity key enforces uniqueness and prevents aliasing', () => {
    expect(getCompositeKey('call', '1234')).toBe('call:1234');
    expect(getCompositeKey('meeting', '1234')).toBe('meeting:1234');
    expect(getCompositeKey('call', '1234')).not.toBe(getCompositeKey('meeting', '1234'));

    expect(() => getCompositeKey('', '1234')).toThrow();
    expect(() => getCompositeKey('call', null)).toThrow();
  });
});
