/**
 * exportService.js
 * Generates machine-readable manifest (JSON and CSV) and downloadable ZIP export
 * conforming strictly to DATA_CONTRACT.md.
 */

import JSZip from 'jszip';

export function generateManifestJSON(records) {
  const manifest = records.map(r => {
    const filename = `${r.source_type}_${r.record_ref || r.source_id.slice(0, 8)}.json`;
    return {
      source_type: r.source_type,
      source_id: r.source_id,
      record_ref: r.record_ref || null,
      applied_revision: r.applied_revision,
      assigned_route: r.analysis.route,
      suggested_route: r.analysis.suggestedRoute,
      manual_override: r.analysis.isManualOverride,
      manual_route: r.analysis.manualRoute || null,
      review_state: r.analysis.reviewStatus,
      confidence: r.analysis.confidence,
      has_transcript: r.has_transcript,
      action_owner: r.analysis.owner || null,
      next_action: r.analysis.nextAction || null,
      output_path: `outputs/${r.analysis.route.toLowerCase().replace(/[^a-z0-9]/g, '_')}/${filename}`,
    };
  });

  return JSON.stringify({
    generated_at: new Date().toISOString(),
    local_activity_date: '2026-08-21 (Asia/Kolkata)',
    total_records: records.length,
    manifest_version: '1.0.0',
    records: manifest,
  }, null, 2);
}

export function generateManifestCSV(records) {
  const headers = [
    'source_type',
    'source_id',
    'record_ref',
    'applied_revision',
    'assigned_route',
    'suggested_route',
    'manual_override',
    'review_state',
    'confidence',
    'has_transcript',
    'action_owner',
    'output_path'
  ];

  const rows = records.map(r => {
    const filename = `${r.source_type}_${r.record_ref || r.source_id.slice(0, 8)}.json`;
    const outputPath = `outputs/${r.analysis.route.toLowerCase().replace(/[^a-z0-9]/g, '_')}/${filename}`;
    return [
      r.source_type,
      r.source_id,
      r.record_ref || '',
      r.applied_revision,
      `"${r.analysis.route}"`,
      `"${r.analysis.suggestedRoute}"`,
      r.analysis.isManualOverride ? 'true' : 'false',
      r.analysis.reviewStatus,
      r.analysis.confidence,
      r.has_transcript ? 'true' : 'false',
      `"${r.analysis.owner || ''}"`,
      `"${outputPath}"`
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Creates and triggers a download of a full ZIP bundle containing:
 * - manifest.json
 * - manifest.csv
 * - README_EXPORT.md
 * - outputs/ organized by routing category
 */
export async function downloadExportArchive(records) {
  const zip = new JSZip();

  // 1. Add Manifests
  const manifestJson = generateManifestJSON(records);
  const manifestCsv = generateManifestCSV(records);
  zip.file('manifest.json', manifestJson);
  zip.file('manifest.csv', manifestCsv);

  // 2. Add Export Documentation
  const readmeContent = `# SpendNest Revenue Intelligence Inbox — Export Archive
Generated: ${new Date().toISOString()}
Scope: All 44 Source Records (30 Calls, 14 Meetings)
Activity Date: 21 August 2026 (Asia/Kolkata)

## Directory Structure
- \`manifest.json\`: Machine-readable master metadata manifest.
- \`manifest.csv\`: Spreadsheet-ready CSV manifest.
- \`outputs/\`: Categorized conversation records and analytical outputs.
  - \`sales_coaching/\`: Transcripts and coaching notes.
  - \`deal_next_step/\`: Opportunities, pricing inquiries, next steps.
  - \`customer_support_bug/\`: Software defects and support roadblocks.
  - \`internal__vendor_note/\`: Infrastructure vendor evaluations and internal training.
  - \`review_required/\`: Unconnected calls, voicemails, or records awaiting human review.
`;
  zip.file('README_EXPORT.md', readmeContent);

  // 3. Add Individual Categorized Outputs
  records.forEach(r => {
    const routeFolder = r.analysis.route.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const filename = `${r.source_type}_${r.record_ref || r.source_id.slice(0, 8)}.json`;
    const outputData = {
      record_ref: r.record_ref,
      source_type: r.source_type,
      source_id: r.source_id,
      applied_revision: r.applied_revision,
      batch_id: r.batch_id,
      has_transcript: r.has_transcript,
      analysis: r.analysis,
      metadata: r.payload,
      transcript: r.source_type === 'call' ? r.payload?.transcript : r.transcript_payload,
    };
    zip.file(`outputs/${routeFolder}/${filename}`, JSON.stringify(outputData, null, 2));
  });

  // 4. Generate and download Blob
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `spendnest_inbox_export_${new Date().toISOString().slice(0, 10)}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
