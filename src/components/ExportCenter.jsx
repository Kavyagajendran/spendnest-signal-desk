import React, { useState } from 'react';
import {
  Download,
  FileJson,
  FileSpreadsheet,
  Archive,
  CheckCircle2,
  FolderTree,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import {
  generateManifestJSON,
  generateManifestCSV,
  downloadExportArchive,
} from '../services/exportService';

export default function ExportCenter({ records }) {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('json');

  const manifestJSON = React.useMemo(() => generateManifestJSON(records), [records]);
  const manifestCSV = React.useMemo(() => generateManifestCSV(records), [records]);

  const handleDownloadZip = async () => {
    try {
      setDownloading(true);
      await downloadExportArchive(records);
    } catch (err) {
      alert(`Export generation failed: ${err.message}`);
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadSingle = (type) => {
    const content = type === 'json' ? manifestJSON : manifestCSV;
    const filename = `manifest.${type}`;
    const blob = new Blob([content], { type: type === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    const content = selectedFormat === 'json' ? manifestJSON : manifestCSV;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Export Center & Manifest Generator</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Produces machine-readable outputs and complete archive strictly following DATA_CONTRACT.md specifications.
          </p>
        </div>

        {/* Big Action Button */}
        <button
          onClick={handleDownloadZip}
          disabled={downloading}
          className="bg-sky-600 hover:bg-sky-700 disabled:bg-sky-300 text-white font-semibold text-xs px-4 py-2 rounded-lg shadow-sm transition flex items-center gap-2 self-start md:self-auto"
        >
          <Archive className="w-4 h-4" />
          <span>{downloading ? 'Compiling Archive...' : 'Download Full ZIP Archive (.zip)'}</span>
        </button>
      </div>

      {/* Package Contents & Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Master Manifest */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="p-2 w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
            <FileJson className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">manifest.json & manifest.csv</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Machine-readable manifests tracking composite keys, applied revisions, assigned routes, and override flags.
          </p>
          <div className="pt-2 flex gap-2">
            <button
              onClick={() => handleDownloadSingle('json')}
              className="text-xs text-sky-600 font-semibold hover:underline flex items-center gap-1"
            >
              <Download className="w-3 h-3" /> JSON Manifest
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => handleDownloadSingle('csv')}
              className="text-xs text-sky-600 font-semibold hover:underline flex items-center gap-1"
            >
              <Download className="w-3 h-3" /> CSV Manifest
            </button>
          </div>
        </div>

        {/* Card 2: Organized Folder Tree */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="p-2 w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FolderTree className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Categorized Outputs Tree</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Exports 44 separate JSON interaction payloads categorized into structured subfolders under <code className="bg-slate-100 text-slate-700 px-1 rounded">outputs/</code>.
          </p>
          <div className="text-[11px] text-slate-400 font-mono">
            /outputs/[route_name]/[type]_[ref].json
          </div>
        </div>

        {/* Card 3: Integrity Guarantee */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="p-2 w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Replay & Integrity Standard</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Guarantees idempotent exports. Relative file paths inside the archive point only to active, existing generated files.
          </p>
          <div className="text-[11px] text-purple-700 font-semibold">
            {records.length} of 44 records verified active
          </div>
        </div>
      </div>

      {/* Manifest Live Preview Inspector */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Live Manifest Inspection</h3>
            <p className="text-xs text-slate-500">Preview generated manifest before downloading</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-slate-100 p-1 rounded-lg flex items-center text-xs">
              <button
                onClick={() => setSelectedFormat('json')}
                className={`px-2.5 py-1 rounded font-semibold transition ${
                  selectedFormat === 'json' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                JSON Preview
              </button>
              <button
                onClick={() => setSelectedFormat('csv')}
                className={`px-2.5 py-1 rounded font-semibold transition ${
                  selectedFormat === 'csv' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                CSV Preview
              </button>
            </div>

            <button
              onClick={handleCopy}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-2.5 py-1.5 rounded-lg border border-slate-300 transition flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Code Box */}
        <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs text-slate-200 max-h-96 overflow-y-auto leading-relaxed">
          <pre>{selectedFormat === 'json' ? manifestJSON : manifestCSV}</pre>
        </div>
      </div>
    </div>
  );
}
