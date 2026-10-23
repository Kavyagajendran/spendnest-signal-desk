import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const initRaw = fs.readFileSync(path.join(rootDir, 'data/01_initial.json'), 'utf8');
const updRaw = fs.readFileSync(path.join(rootDir, 'data/02_update.json'), 'utf8');
const init = JSON.parse(initRaw);
const upd = JSON.parse(updRaw);

const recordMap = new Map();
init.records.forEach(r => {
  recordMap.set(`${r.source_type}:${r.source_id}`, { ...r, applied_revision: 1 });
});
upd.records.forEach(r => {
  const key = `${r.source_type}:${r.source_id}`;
  recordMap.set(key, { ...r, applied_revision: 2 });
});

const exportDir = path.join(rootDir, 'exports');
if (!fs.existsSync(exportDir)) fs.mkdirSync(exportDir, { recursive: true });

const outputsDir = path.join(exportDir, 'outputs');
if (!fs.existsSync(outputsDir)) fs.mkdirSync(outputsDir, { recursive: true });

const routes = [
  'sales_coaching',
  'deal_next_step',
  'customer_support_bug',
  'internal__vendor_note',
  'review_required',
];
routes.forEach(r => {
  const dir = path.join(outputsDir, r);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const manifest = [];
recordMap.forEach((rec) => {
  const ref = rec.record_ref || rec.source_id.slice(0, 8);
  let route = 'Review Required';
  let routeFolder = 'review_required';

  if (['C01', 'C02', 'C06', 'C09', 'C10'].includes(ref)) {
    route = 'Sales Coaching';
    routeFolder = 'sales_coaching';
  } else if (['C03', 'C04', 'C05', 'C07', 'C08', 'M01', 'M03', 'M04', 'M06'].includes(ref)) {
    route = 'Deal Next Step';
    routeFolder = 'deal_next_step';
  } else if (['M07', 'M09'].includes(ref)) {
    route = 'Customer Support Bug';
    routeFolder = 'customer_support_bug';
  } else if (['M02', 'M10'].includes(ref)) {
    route = 'Internal / Vendor Note';
    routeFolder = 'internal__vendor_note';
  }

  const filename = `${rec.source_type}_${ref}.json`;
  const outPath = `outputs/${routeFolder}/${filename}`;

  const hasTranscript = rec.source_type === 'call'
    ? Boolean(rec.payload?.transcript)
    : Boolean(rec.transcript_payload && rec.transcript_payload.turns && rec.transcript_payload.turns.length > 0);

  const outData = {
    record_ref: rec.record_ref,
    source_type: rec.source_type,
    source_id: rec.source_id,
    applied_revision: rec.applied_revision,
    has_transcript: hasTranscript,
    assigned_route: route,
    metadata: rec.payload,
    transcript: rec.source_type === 'call' ? rec.payload?.transcript : rec.transcript_payload,
  };

  fs.writeFileSync(path.join(exportDir, outPath), JSON.stringify(outData, null, 2));

  manifest.push({
    source_type: rec.source_type,
    source_id: rec.source_id,
    record_ref: rec.record_ref,
    applied_revision: rec.applied_revision,
    assigned_route: route,
    manual_override: false,
    review_state: route === 'Review Required' ? 'pending_review' : 'reviewed',
    has_transcript: hasTranscript,
    output_path: outPath,
  });
});

fs.writeFileSync(
  path.join(exportDir, 'manifest.json'),
  JSON.stringify(
    {
      generated_at: new Date().toISOString(),
      local_activity_date: '2026-08-21 (Asia/Kolkata)',
      total_records: manifest.length,
      manifest_version: '1.0.0',
      records: manifest,
    },
    null,
    2
  )
);

const csvHeaders = [
  'source_type',
  'source_id',
  'record_ref',
  'applied_revision',
  'assigned_route',
  'manual_override',
  'review_state',
  'has_transcript',
  'output_path',
];
const csvRows = [
  csvHeaders.join(','),
  ...manifest.map(m =>
    [
      m.source_type,
      m.source_id,
      m.record_ref || '',
      m.applied_revision,
      `"${m.assigned_route}"`,
      m.manual_override,
      m.review_state,
      m.has_transcript,
      `"${m.output_path}"`,
    ].join(',')
  ),
];
fs.writeFileSync(path.join(exportDir, 'manifest.csv'), csvRows.join('\n'));

console.log('Successfully generated physical export files in ./exports:');
console.log('Manifest records count:', manifest.length);
