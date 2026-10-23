import React from 'react';
import {
  FileText,
  Calendar,
  AlertOctagon,
  TrendingUp,
  Target,
  ShieldCheck,
  Building,
  Quote,
  Printer,
  Copy,
  Check,
  ArrowRight,
} from 'lucide-react';
import { MANAGER_BRIEF_DATA } from '../services/managerBrief';

export default function ManagerBrief({ onSelectRecord }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    const text = JSON.stringify(MANAGER_BRIEF_DATA, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Brief Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
              Official Briefing
            </span>
            <span className="text-xs text-slate-400">SpendNest Commercial Operations</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Manager Daily Revenue Intelligence Brief</h2>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Activity Window: <strong>21 August 2026 (Asia/Kolkata)</strong> • Scope: All 44 Source Interactions</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3 py-1.5 rounded-lg border border-slate-300 transition flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied JSON!' : 'Copy Summary'}</span>
          </button>
          <button
            onClick={() => window.print()}
            className="text-xs bg-sky-600 hover:bg-sky-700 text-white font-medium px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Executive Summary Card */}
      <div className="bg-gradient-to-r from-sky-900 to-slate-900 text-white p-5 rounded-xl shadow-md space-y-3">
        <h3 className="text-xs font-semibold text-sky-300 uppercase tracking-wider">
          Executive Synthesis (21 August 2026)
        </h3>
        <p className="text-sm leading-relaxed text-slate-100 font-medium">
          {MANAGER_BRIEF_DATA.executiveSummary.keyTakeaway}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-700/60 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Evaluated Records</span>
            <span className="font-bold text-white text-sm">44 Total (30 Calls, 14 Mtgs)</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Transcript Coverage</span>
            <span className="font-bold text-emerald-400 text-sm">18 Usable Transcripts</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Unconnected / Silent</span>
            <span className="font-bold text-slate-300 text-sm">26 Logged Intakes</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Action Ownership</span>
            <span className="font-bold text-amber-300 text-sm">100% Citable Claims</span>
          </div>
        </div>
      </div>

      {/* Section 1: Critical Software Defects & Customer Roadblocks */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <AlertOctagon className="w-5 h-5 text-rose-600" />
            <h3 className="text-base font-bold text-slate-900">Critical Software Defects & Customer Roadblocks</h3>
          </div>
          <span className="text-xs bg-rose-100 text-rose-800 font-semibold px-2 py-0.5 rounded border border-rose-300">
            P1 Escalations
          </span>
        </div>

        <div className="space-y-4">
          {MANAGER_BRIEF_DATA.sections[0].items.map(item => (
            <div key={item.sourceId} className="p-4 rounded-lg border border-rose-200 bg-rose-50/40 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-slate-900">{item.recordRef}: {item.title}</span>
                  <span className="text-[10px] bg-rose-200 text-rose-900 font-bold px-1.5 py-0.5 rounded">
                    {item.severity}
                  </span>
                </div>
                <button
                  onClick={() => onSelectRecord('meeting', item.sourceId)}
                  className="text-xs text-rose-700 hover:text-rose-900 font-semibold inline-flex items-center gap-1 hover:underline self-start sm:self-auto"
                >
                  Inspect Transcript <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Exact Evidence Citation Box */}
              <div className="bg-white p-3 rounded border border-rose-200 text-xs space-y-1">
                <div className="font-bold text-rose-900 flex items-center gap-1.5">
                  <Quote className="w-3.5 h-3.5" />
                  <span>Exact Verified Evidence ({item.evidence.turn})</span>
                </div>
                <p className="font-mono text-slate-700 italic pl-1">
                  {item.evidence.citation}
                </p>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                <strong className="text-slate-900">Manager Finding:</strong> {item.finding}
              </p>

              <div className="text-xs text-slate-800 pt-2 border-t border-rose-200/70 flex flex-col sm:flex-row sm:justify-between gap-1">
                <div>
                  <strong className="text-slate-900">Prescribed Action:</strong> {item.action}
                </div>
                <div className="text-rose-950 font-semibold shrink-0">
                  Owner: {item.owner}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Deal Momentum & Pipeline Acceleration */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">Deal Next Steps & Pipeline Acceleration</h3>
          </div>
          <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded border border-emerald-300">
            Commercial Focus
          </span>
        </div>

        <div className="space-y-4">
          {MANAGER_BRIEF_DATA.sections[1].items.map(item => (
            <div key={item.sourceId} className="p-4 rounded-lg border border-emerald-200 bg-emerald-50/40 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-slate-900">{item.recordRef}: {item.title}</span>
                </div>
                <button
                  onClick={() => onSelectRecord(item.recordRef.startsWith('C') ? 'call' : 'meeting', item.sourceId)}
                  className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold inline-flex items-center gap-1 hover:underline self-start sm:self-auto"
                >
                  Inspect Evidence <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Exact Evidence Citation Box */}
              <div className="bg-white p-3 rounded border border-emerald-200 text-xs space-y-1">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <Quote className="w-3.5 h-3.5" />
                  <span>Exact Verified Evidence ({item.evidence.turn || 'Call Quote'})</span>
                </div>
                <p className="font-mono text-slate-700 italic pl-1">
                  {item.evidence.citation || item.evidence.quote}
                </p>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                <strong className="text-slate-900">Manager Finding:</strong> {item.finding}
              </p>

              <div className="text-xs text-slate-800 pt-2 border-t border-emerald-200/70 flex flex-col sm:flex-row sm:justify-between gap-1">
                <div>
                  <strong className="text-slate-900">Next Step:</strong> {item.action}
                </div>
                <div className="text-emerald-950 font-semibold shrink-0">
                  Owner: {item.owner}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Priority Sales Coaching & Objection Handling */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-slate-900">Priority Sales Coaching & Objection Handling</h3>
          </div>
          <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded border border-amber-300">
            Rep Development
          </span>
        </div>

        <div className="space-y-4">
          {MANAGER_BRIEF_DATA.sections[2].items.map(item => (
            <div key={item.sourceId} className="p-4 rounded-lg border border-amber-200 bg-amber-50/40 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-slate-900">{item.recordRef} (Rep: {item.rep}): {item.coachingTopic}</span>
                </div>
                <button
                  onClick={() => onSelectRecord('call', item.sourceId)}
                  className="text-xs text-amber-800 hover:text-amber-950 font-semibold inline-flex items-center gap-1 hover:underline self-start sm:self-auto"
                >
                  Inspect Call <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Exact Evidence Citation Box */}
              <div className="bg-white p-3 rounded border border-amber-200 text-xs space-y-1">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <Quote className="w-3.5 h-3.5" />
                  <span>Verbatim Transcript Passage</span>
                </div>
                <p className="font-mono text-slate-700 italic pl-1">
                  {item.evidence.quote}
                </p>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                <strong className="text-slate-900">Coaching Need:</strong> {item.coachingNeed}
              </p>

              <div className="text-xs text-slate-800 pt-2 border-t border-amber-200/70">
                <strong className="text-slate-900">Manager Coaching Prescription:</strong> {item.managerAction}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: Internal Enablement & Infrastructure Coordination */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Building className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">Internal Enablement & Infrastructure Partnerships</h3>
          </div>
          <span className="text-xs bg-indigo-100 text-indigo-800 font-semibold px-2 py-0.5 rounded border border-indigo-300">
            Infrastructure
          </span>
        </div>

        <div className="space-y-4">
          {MANAGER_BRIEF_DATA.sections[3].items.map(item => (
            <div key={item.sourceId} className="p-4 rounded-lg border border-indigo-200 bg-indigo-50/40 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-bold text-sm text-slate-900">{item.recordRef}: {item.title}</span>
                <button
                  onClick={() => onSelectRecord('meeting', item.sourceId)}
                  className="text-xs text-indigo-700 hover:text-indigo-900 font-semibold inline-flex items-center gap-1 hover:underline"
                >
                  Inspect Meeting <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="bg-white p-3 rounded border border-indigo-200 text-xs space-y-1">
                <div className="font-bold text-indigo-900 flex items-center gap-1.5">
                  <Quote className="w-3.5 h-3.5" />
                  <span>Exact Evidence Citation</span>
                </div>
                <p className="font-mono text-slate-700 italic pl-1">
                  {item.evidence.citation}
                </p>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                <strong className="text-slate-900">Manager Finding:</strong> {item.finding}
              </p>

              <div className="text-xs text-slate-800 pt-2 border-t border-indigo-200/70 flex justify-between">
                <span><strong className="text-slate-900">Action:</strong> {item.action}</span>
                <span className="font-semibold text-indigo-950">Owner: {item.owner}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
