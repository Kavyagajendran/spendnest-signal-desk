/**
 * dataService.js
 * Core Data Engine implementing strict DATA_CONTRACT.md requirements:
 * - Composite Key Identity: (source_type, source_id)
 * - Revision ordering & transactional upsert
 * - Total separation of source payload from candidate analysis & manual overrides
 * - Replay idempotency & persistence
 */

import { classifyRecord, KNOWN_CONVERSATION_PROFILES } from './routingTaxonomy.js';

const STORAGE_KEY = 'spendnest_revenue_inbox_v1';

/**
 * Generates canonical unique composite identity key
 */
export function getCompositeKey(sourceType, sourceId) {
  if (!sourceType || !sourceId) {
    throw new Error(`Invalid composite key parameters: (${sourceType}, ${sourceId})`);
  }
  return `${sourceType.toLowerCase()}:${sourceId}`;
}

/**
 * Checks if a record has usable conversation transcript text
 */
export function hasUsableTranscript(record) {
  if (!record) return false;
  if (record.source_type === 'call') {
    return Boolean(record.payload?.transcript && record.payload.transcript.trim().length > 0);
  }
  if (record.source_type === 'meeting') {
    return Boolean(
      record.transcript_payload &&
      Array.isArray(record.transcript_payload.turns) &&
      record.transcript_payload.turns.length > 0
    );
  }
  return false;
}

export class DataStore {
  constructor() {
    this.records = new Map(); // compositeKey -> RecordState
    this.importHistory = [];
    this.recentChanges = [];
    this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.records && Array.isArray(parsed.records)) {
          this.records.clear();
          parsed.records.forEach(item => {
            const key = getCompositeKey(item.source_type, item.source_id);
            this.records.set(key, item);
          });
        }
        if (parsed.importHistory && Array.isArray(parsed.importHistory)) {
          this.importHistory = parsed.importHistory;
        }
        if (parsed.recentChanges && Array.isArray(parsed.recentChanges)) {
          this.recentChanges = parsed.recentChanges;
        }
      }
    } catch (err) {
      console.warn('Failed to load state from localStorage:', err);
    }
  }

  saveToStorage() {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      const data = {
        records: Array.from(this.records.values()),
        importHistory: this.importHistory,
        recentChanges: this.recentChanges,
        lastSaved: new Date().toISOString()
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.warn('Failed to save state to localStorage:', err);
    }
  }

  clear() {
    this.records.clear();
    this.importHistory = [];
    this.recentChanges = [];
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }

  /**
   * Ingests a delivery envelope conforming to DATA_CONTRACT.md
   * @param {Object} batch Delivery envelope JSON
   * @returns {Object} Import summary with counts and changes
   */
  ingestBatch(batch) {
    if (!batch || typeof batch !== 'object') {
      throw new Error('Malformed batch envelope: object expected');
    }
    const { batch_id, revision, exported_at, records } = batch;
    if (!batch_id || typeof revision !== 'number' || !Array.isArray(records)) {
      throw new Error('Malformed batch envelope: missing batch_id, revision number, or records array');
    }

    let inserted = 0;
    let updated = 0;
    let ignored = 0;
    const details = [];

    records.forEach(rec => {
      const { source_type, source_id, record_ref, payload, transcript_payload } = rec;
      if (!source_type || !source_id) {
        details.push({ ref: record_ref, action: 'error', reason: 'Missing composite identity (source_type, source_id)' });
        return;
      }

      const key = getCompositeKey(source_type, source_id);
      const existing = this.records.get(key);

      if (!existing) {
        // New record insertion
        const analysis = classifyRecord(rec, revision);
        const recordState = {
          source_type,
          source_id,
          record_ref: record_ref || rec.payload?.record_ref || null,
          applied_revision: revision,
          exported_at,
          batch_id,
          payload: { ...payload },
          transcript_payload: transcript_payload ? { ...transcript_payload } : null,
          has_transcript: hasUsableTranscript(rec),
          analysis: {
            route: analysis.route,
            suggestedRoute: analysis.suggestedRoute,
            confidence: analysis.confidence,
            rationale: analysis.rationale,
            evidenceQuote: analysis.evidenceQuote,
            evidenceTurn: analysis.evidenceTurn,
            nextAction: analysis.nextAction,
            owner: analysis.owner,
            reviewStatus: analysis.reviewStatus,
            isManualOverride: false,
            manualRoute: null,
            overrideTimestamp: null,
            opportunitySignals: analysis.opportunitySignals,
          },
          security: {
            status: 'Not scanned',
            scannedAt: null,
            transcriptHash: null,
            model: 'meta-llama/llama-prompt-guard-2-86m',
            maxScore: null,
            threshold: 0.5,
            flaggedSegmentsCount: 0,
            totalSegments: 0,
            scannedSegments: 0,
            segments: [],
            isQuarantined: false,
            safeReview: null,
          }
        };
        this.records.set(key, recordState);
        inserted++;
        details.push({ key, ref: record_ref, action: 'inserted', revision });
      } else {
        // Existing record: evaluate revision
        if (revision > existing.applied_revision) {
          // Newer revision: completely replace payload and transcript_payload per contract
          const hasTranscriptNow = hasUsableTranscript(rec);
          
          // Re-classify based on newly arrived data (e.g. late transcript)
          const freshAnalysis = classifyRecord(rec, revision);

          // CRITICAL CONTRACT RULE: preserve manual route override and human review decisions
          const isManual = existing.analysis.isManualOverride;
          const preservedRoute = isManual ? existing.analysis.manualRoute : freshAnalysis.route;

          existing.applied_revision = revision;
          existing.batch_id = batch_id;
          existing.exported_at = exported_at;
          existing.payload = { ...payload };
          existing.transcript_payload = transcript_payload ? { ...transcript_payload } : null;
          existing.has_transcript = hasTranscriptNow;

          existing.analysis = {
            ...existing.analysis,
            suggestedRoute: freshAnalysis.suggestedRoute,
            route: preservedRoute,
            confidence: freshAnalysis.confidence,
            rationale: freshAnalysis.rationale,
            evidenceQuote: freshAnalysis.evidenceQuote,
            evidenceTurn: freshAnalysis.evidenceTurn,
            nextAction: freshAnalysis.nextAction,
            owner: freshAnalysis.owner,
            opportunitySignals: freshAnalysis.opportunitySignals,
            // If manual override was active, keep it intact!
            isManualOverride: isManual,
            manualRoute: existing.analysis.manualRoute,
            overrideTimestamp: existing.analysis.overrideTimestamp,
            reviewStatus: isManual ? existing.analysis.reviewStatus : freshAnalysis.reviewStatus,
            lastUpdatedRevision: revision,
          };

          // CRITICAL SECURITY RULE (Requirement 7):
          // A newly updated transcript must NOT silently reuse stale security analysis!
          // Invalidate previous scan results so the fresh transcript text is scanned anew.
          existing.security = {
            status: 'Not scanned',
            scannedAt: null,
            transcriptHash: null,
            model: 'meta-llama/llama-prompt-guard-2-86m',
            maxScore: null,
            threshold: 0.5,
            flaggedSegmentsCount: 0,
            totalSegments: 0,
            scannedSegments: 0,
            segments: [],
            isQuarantined: false,
            safeReview: null,
            invalidatedDueToRevision: revision,
          };

          this.recentChanges.unshift({
            id: `${source_type}:${source_id}:${revision}:${Date.now()}`,
            timestamp: new Date().toISOString(),
            recordRef: record_ref || rec.payload?.record_ref || 'M07',
            sourceType: source_type,
            sourceId: source_id,
            changeType: 'LATE_TRANSCRIPT_ARRIVED',
            title: `Source Revision Updated (${existing.applied_revision} → ${revision})`,
            description: `Late transcript received with ${rec.transcript_payload?.turns?.length || 0} conversation turns. Previous analysis refreshed.`,
            overridePreserved: isManual,
            currentRoute: preservedRoute,
            actionRequired: isManual ? 'Review preserved manual route against new transcript' : 'Triage newly available conversation',
          });

          updated++;
          details.push({ key, ref: record_ref, action: 'updated', fromRev: existing.applied_revision, toRev: revision, preservedOverride: isManual });
        } else {
          // Same or older revision arriving again: ignore per contract (idempotent no-op)
          ignored++;
          details.push({ key, ref: record_ref, action: 'ignored', reason: `Revision ${revision} <= current ${existing.applied_revision}` });
        }
      }
    });

    const summary = {
      timestamp: new Date().toISOString(),
      batch_id,
      revision,
      totalSupplied: records.length,
      inserted,
      updated,
      ignored,
      currentTotalRecords: this.records.size,
      currentTotalTranscripts: this.getTranscriptCount(),
      details
    };

    this.importHistory.unshift(summary);
    this.saveToStorage();
    return summary;
  }

  /**
   * Manually override a record's routing category
   */
  setManualRoute(sourceType, sourceId, newRoute, reviewerNotes = '') {
    const key = getCompositeKey(sourceType, sourceId);
    const record = this.records.get(key);
    if (!record) {
      throw new Error(`Record not found for composite key: ${key}`);
    }

    const previousRoute = record.analysis.route;
    record.analysis.isManualOverride = true;
    record.analysis.manualRoute = newRoute;
    record.analysis.route = newRoute;
    record.analysis.overrideTimestamp = new Date().toISOString();
    record.analysis.reviewerNotes = reviewerNotes || record.analysis.reviewerNotes || 'Manually reassigned by sales manager';
    record.analysis.reviewStatus = 'reviewed';

    this.recentChanges.unshift({
      id: `override:${sourceType}:${sourceId}:${Date.now()}`,
      timestamp: new Date().toISOString(),
      recordRef: record.record_ref || record.source_id.slice(0, 6),
      sourceType,
      sourceId,
      changeType: 'MANUAL_OVERRIDE_SAVED',
      title: `Manual Route Correction Saved`,
      description: `Manager manually overrode route from "${previousRoute}" to "${newRoute}". Notes: ${reviewerNotes || 'Manager judgment applied'}.`,
      overridePreserved: true,
      currentRoute: newRoute,
      previousRoute,
      actionRequired: 'None (decision logged and persistent)',
    });

    this.saveToStorage();
    return record;
  }

  /**
   * Reset manual override back to automated suggestion
   */
  resetManualRoute(sourceType, sourceId) {
    const key = getCompositeKey(sourceType, sourceId);
    const record = this.records.get(key);
    if (!record) throw new Error(`Record not found: ${key}`);

    record.analysis.isManualOverride = false;
    record.analysis.manualRoute = null;
    record.analysis.route = record.analysis.suggestedRoute;
    record.analysis.overrideTimestamp = null;
    
    this.saveToStorage();
    return record;
  }

  /**
   * Update review status
   */
  setReviewStatus(sourceType, sourceId, status) {
    const key = getCompositeKey(sourceType, sourceId);
    const record = this.records.get(key);
    if (!record) throw new Error(`Record not found: ${key}`);

    record.analysis.reviewStatus = status;
    this.saveToStorage();
    return record;
  }

  /**
   * Updates Prompt Guard security scan result for a record.
   * Requirement 8: Security scanning must NOT change source record count,
   * invent content, alter evidence quotes, or silently change manual routing decisions.
   */
  setSecurityScanResult(sourceType, sourceId, scanResult) {
    const key = getCompositeKey(sourceType, sourceId);
    const record = this.records.get(key);
    if (!record) throw new Error(`Record not found: ${key}`);

    record.security = {
      ...(record.security || {}),
      ...scanResult,
      scannedAt: scanResult.scannedAt || new Date().toISOString(),
    };

    // When malicious content is detected, flag for review (Requirement 4)
    if (scanResult.status === 'Malicious — review required') {
      record.security.isQuarantined = true;
      if (record.analysis.reviewStatus !== 'Reviewed') {
        record.analysis.reviewStatus = 'Pending Review';
      }
    }

    this.saveToStorage();
    return record;
  }

  /**
   * Explicit Safe-Review authorization path (Requirement 4).
   * Authorizes safe downstream generative AI processing while preserving the original transcript
   * and logging the reviewer identity and justification notes.
   */
  setSafeReviewAuthorization(sourceType, sourceId, safeReviewData) {
    const key = getCompositeKey(sourceType, sourceId);
    const record = this.records.get(key);
    if (!record) throw new Error(`Record not found: ${key}`);

    record.security = record.security || {};
    record.security.safeReview = {
      reviewedBy: safeReviewData.reviewer || 'Security Admin',
      reviewedAt: new Date().toISOString(),
      notes: safeReviewData.notes || 'Safe review cleared by human reviewer',
      authorizedForGenerativeAI: Boolean(safeReviewData.authorizedForGenerativeAI),
    };

    if (safeReviewData.authorizedForGenerativeAI) {
      record.security.isQuarantined = false;
    }

    this.saveToStorage();
    return record;
  }

  getAllRecords() {
    return Array.from(this.records.values());
  }

  getRecord(sourceType, sourceId) {
    const key = getCompositeKey(sourceType, sourceId);
    return this.records.get(key) || null;
  }

  getRecordCount() {
    return this.records.size;
  }

  getTranscriptCount() {
    let count = 0;
    for (const r of this.records.values()) {
      if (r.has_transcript) count++;
    }
    return count;
  }

  getMetrics() {
    const records = this.getAllRecords();
    let calls = 0;
    let meetings = 0;
    let transcripts = 0;
    let manualOverrides = 0;
    let pendingReview = 0;
    let reviewed = 0;

    const repActivity = {};
    const routeDistribution = {
      'Sales Coaching': 0,
      'Deal Next Step': 0,
      'Customer Support Bug': 0,
      'Internal / Vendor Note': 0,
      'Review Required': 0,
    };

    let securityBenign = 0;
    let securityMalicious = 0;
    let securityNotScanned = 0;
    let securityUnavailable = 0;
    let securityIncomplete = 0;

    records.forEach(r => {
      const secStatus = r.security?.status || 'Not scanned';
      if (secStatus === 'Benign') securityBenign++;
      else if (secStatus === 'Malicious — review required') securityMalicious++;
      else if (secStatus === 'Scan unavailable') securityUnavailable++;
      else if (secStatus === 'Scan incomplete') securityIncomplete++;
      else securityNotScanned++;

      if (r.source_type === 'call') {
        calls++;
        const rep = r.payload?.rep_name || r.payload?.rep_email || 'Unassigned';
        repActivity[rep] = (repActivity[rep] || 0) + 1;
      } else if (r.source_type === 'meeting') {
        meetings++;
        const organizer = r.payload?.organizer_email || 'Unassigned';
        repActivity[organizer] = (repActivity[organizer] || 0) + 1;
      }

      if (r.has_transcript) transcripts++;
      if (r.analysis.isManualOverride) manualOverrides++;

      if (r.analysis.reviewStatus === 'pending_review') {
        pendingReview++;
      } else {
        reviewed++;
      }

      const route = r.analysis.route || 'Review Required';
      routeDistribution[route] = (routeDistribution[route] || 0) + 1;
    });

    return {
      totalRecords: records.length,
      calls,
      meetings,
      transcripts,
      transcriptCoveragePercent: records.length > 0 ? Math.round((transcripts / records.length) * 100) : 0,
      manualOverrides,
      pendingReview,
      reviewed,
      repActivity,
      routeDistribution,
      securitySummary: {
        benign: securityBenign,
        malicious: securityMalicious,
        notScanned: securityNotScanned,
        unavailable: securityUnavailable,
        incomplete: securityIncomplete,
        totalScanned: securityBenign + securityMalicious,
      },
      localDate: '21 August 2026',
      timezone: 'Asia/Kolkata',
    };
  }

  getRecentChanges() {
    return this.recentChanges || [];
  }
}

// Global singleton instance
export const dataStore = new DataStore();
