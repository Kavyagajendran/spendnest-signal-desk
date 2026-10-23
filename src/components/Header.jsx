import React from 'react';
import {
  Sparkles,
  RotateCcw,
  BookOpen,
  FileText,
  ShieldCheck,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

export default function Header({ metrics, onQuickDemoLoad, onLoadInitialOnly, onReset, activeRevision }) {
  return (
    <header className="bg-[#fbfbf9] border-b border-[#e7e5df] sticky top-0 z-40 px-6 py-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        {/* Brand & Editorial Context */}
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-lg bg-[#18181b] flex items-center justify-center text-amber-100 shadow-sm border border-stone-800">
            <span className="font-serif font-bold text-lg tracking-tight">S</span>
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-base font-bold text-ink-900 tracking-tight font-editorial">
                SpendNest Signal Desk
              </h1>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                Evidence-First RevOps
              </span>
              <span className="text-[10px] font-medium text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">
                21 Aug 2026 (Asia/Kolkata)
              </span>
            </div>
            <p className="text-xs text-ink-500 mt-0.5">
              Commercial Operations Workspace • Strict Ingestion & Evidence Attribution
            </p>
          </div>
        </div>

        {/* Live Contract Indicators & Actions */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Delivery Revision Badge */}
          <div className="bg-white text-stone-700 px-2.5 py-1.5 rounded-md border border-[#dedcd2] font-medium flex items-center gap-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <Layers className="w-3.5 h-3.5 text-stone-500" />
            <span>Store: <strong className="text-ink-900">{metrics.totalRecords}</strong> / 44</span>
            <span className="text-stone-300">|</span>
            <span>Rev <strong className="text-ink-900">{metrics.transcripts === 18 ? '2' : '1'}</strong></span>
          </div>

          {/* Transcript Coverage */}
          <div className={`px-2.5 py-1.5 rounded-md border font-medium flex items-center gap-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] ${
            metrics.transcripts === 18
              ? 'bg-teal-50/80 text-teal-800 border-teal-200'
              : metrics.transcripts === 17
              ? 'bg-amber-50/80 text-amber-800 border-amber-200'
              : 'bg-white text-stone-600 border-[#dedcd2]'
          }`}>
            <FileText className="w-3.5 h-3.5" />
            <span>Transcripts: <strong className="text-ink-900">{metrics.transcripts}</strong> / 18</span>
            <span className="text-[10px] opacity-75">({metrics.transcriptCoveragePercent}%)</span>
          </div>

          {/* Manual Overrides Flag */}
          {metrics.manualOverrides > 0 && (
            <div className="bg-amber-50 text-amber-850 px-2.5 py-1.5 rounded-md border border-amber-300 font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              <span>Overrides: <strong>{metrics.manualOverrides}</strong></span>
            </div>
          )}

          {/* Fast Load State Controls */}
          <div className="flex items-center gap-1.5 pl-1 border-l border-stone-200">
            <button
              onClick={onQuickDemoLoad}
              title="Import both batches (initial + update) for final state with 44 records and 18 transcripts"
              className="bg-[#18181b] hover:bg-stone-800 text-stone-100 font-medium text-xs px-3 py-1.5 rounded-md transition flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span>Final State</span>
            </button>

            <button
              onClick={onLoadInitialOnly}
              title="Load initial batch only (44 records, 17 transcripts) to test pre-update state"
              className="bg-white hover:bg-stone-50 text-stone-700 font-medium text-xs px-2.5 py-1.5 rounded-md border border-stone-300 transition"
            >
              <span>Initial (Rev 1)</span>
            </button>

            <button
              onClick={onReset}
              title="Clear all local data and reset to clean state"
              className="bg-white hover:bg-stone-50 text-stone-600 font-medium text-xs px-2.5 py-1.5 rounded-md border border-stone-300 transition flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
              <span>Reset</span>
            </button>

            <a
              href="/offline_reader.html"
              target="_blank"
              rel="noreferrer"
              title="Open offline assignment reading pack"
              className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs px-2 py-1.5 rounded-md border border-stone-300 transition flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5 text-stone-500" />
              <ArrowUpRight className="w-3 h-3 text-stone-400" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
