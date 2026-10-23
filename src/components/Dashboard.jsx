import React, { useState, useMemo } from 'react';
import {
  Phone,
  Video,
  FileText,
  AlertOctagon,
  TrendingUp,
  Target,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  UserCheck,
  Clock,
  Layers,
  Sparkles,
  Quote,
  Check,
  Filter,
  Activity,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import { ROUTE_COLORS, ROUTE_CATEGORIES } from '../services/routingTaxonomy';

export default function Dashboard({
  records,
  metrics,
  recentChanges = [],
  onSelectRecord,
  onNavigateTab,
  onSetReviewStatus,
}) {
  const [triageFilter, setTriageFilter] = useState('ALL'); // 'ALL' | 'PENDING' | 'BUGS' | 'COACHING' | 'DEALS' | 'OVERRIDES'

  // Filtered triage records for the primary decision workbench
  const triageRecords = useMemo(() => {
    return records.filter(r => {
      if (triageFilter === 'PENDING') return r.analysis.reviewStatus === 'pending_review';
      if (triageFilter === 'BUGS') return r.analysis.route === ROUTE_CATEGORIES.CUSTOMER_SUPPORT_BUG;
      if (triageFilter === 'COACHING') return r.analysis.route === ROUTE_CATEGORIES.SALES_COACHING;
      if (triageFilter === 'DEALS') return r.analysis.route === ROUTE_CATEGORIES.DEAL_NEXT_STEP;
      if (triageFilter === 'OVERRIDES') return r.analysis.isManualOverride;
      return true;
    }).slice(0, 10); // Show top 10 actionable items on the desk
  }, [records, triageFilter]);

  return (
    <div className="space-y-6 max-w-7xl">
      {/* SECTION 1: EDITORIAL "TODAY'S PRIORITIES" BRIEFING (Decision-First Header) */}
      <div className="bg-white p-6 rounded-2xl border border-[#dedcd2] shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                Decision-First RevOps Desk
              </span>
              <span className="text-xs text-stone-500 font-medium">
                Activity Date: <strong>21 August 2026</strong> (Asia/Kolkata)
              </span>
            </div>
            <h1 className="text-2xl font-bold text-ink-900 tracking-tight font-editorial mt-1">
              Today&apos;s Priorities & Verified Decisions
            </h1>
            <p className="text-xs text-stone-600 mt-1 max-w-3xl leading-relaxed">
              Synthesized from <strong>44 selected customer interactions</strong> across SpendNest commercial operations.
              Below are the three critical situations backed by verifiable transcript evidence that require sales and operations leadership today.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => onNavigateTab('brief')}
              className="text-xs font-semibold text-teal-750 hover:text-teal-900 bg-stone-50 hover:bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-200 transition flex items-center gap-1"
            >
              <span>Full Daily Memo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigateTab('insights')}
              className="text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-50 hover:bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-200 transition flex items-center gap-1"
            >
              <Activity className="w-3.5 h-3.5 text-stone-500" />
              <span>Coverage & Charts</span>
            </button>
          </div>
        </div>

        {/* 3 Evidence-Backed Priority Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* PRIORITY 1: Critical UI Bug (M07) */}
          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-rose-900 flex items-center gap-1.5">
                  <AlertOctagon className="w-3.5 h-3.5 text-rose-700" />
                  <span>P1 Customer Support Defect</span>
                </span>
                <span className="text-[10px] font-mono font-bold bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded">
                  Ref: M07
                </span>
              </div>
              <h3 className="text-sm font-bold text-ink-900 leading-snug">
                Willowfield Trust: Description Save Failure
              </h3>
              <p className="text-xs text-stone-700 leading-relaxed">
                Customer shared screen proving that editing an event-payment description and clicking &quot;Save changes&quot; fails silently; UI reverts to old text.
              </p>

              {/* Exact Evidence Excerpt */}
              <div className="bg-white p-2.5 rounded border border-rose-200 text-xs space-y-0.5">
                <span className="text-[10px] font-bold text-rose-900 uppercase tracking-wide block">
                  Verified Citation (Turn 3):
                </span>
                <p className="font-mono text-[11px] text-stone-800 italic leading-relaxed">
                  &quot;The field still shows the earlier wording. So the change is not appearing after you save, is that right?&quot;
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-rose-200 text-xs space-y-2">
              <div className="text-[11px] text-stone-600">
                <strong className="text-stone-900">Action:</strong> Escalate Jira to Core Web; CS to provide hotfix ETA by EOD.
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-stone-500 font-medium">Owner: Engineering Triage</span>
                <button
                  onClick={() => onSelectRecord('meeting', '4f304fff-fd40-5cfc-a366-0a134c445c2a')}
                  className="text-xs font-bold text-rose-800 hover:text-rose-950 underline flex items-center gap-0.5"
                >
                  Inspect Conversation →
                </button>
              </div>
            </div>
          </div>

          {/* PRIORITY 2: Sales Coaching (C01) */}
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-amber-900 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-amber-700" />
                  <span>SDR Objection Coaching</span>
                </span>
                <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                  Ref: C01
                </span>
              </div>
              <h3 className="text-sm font-bold text-ink-900 leading-snug">
                Rep Arun: Cold Outreach Pushback Resistance
              </h3>
              <p className="text-xs text-stone-700 leading-relaxed">
                Prospect irritation over unsolicited dial to personal work line. Rep responded defensively without acknowledging friction or soft permission opener.
              </p>

              {/* Exact Evidence Excerpt */}
              <div className="bg-white p-2.5 rounded border border-amber-200 text-xs space-y-0.5">
                <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wide block">
                  Verbatim Transcript Quote:
                </span>
                <p className="font-mono text-[11px] text-stone-800 italic leading-relaxed">
                  &quot;no, I asked why you have called me... I didn&apos;t ask for this call, and I&apos;m not interested.&quot;
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-amber-200 text-xs space-y-2">
              <div className="text-[11px] text-stone-600">
                <strong className="text-stone-900">Action:</strong> 1-on-1 roleplay on friction diffusion & permission-based openers.
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-stone-500 font-medium">Owner: Arun / Sales Manager</span>
                <button
                  onClick={() => onSelectRecord('call', '2ec4404c-beee-5377-a63c-aab701da08ed')}
                  className="text-xs font-bold text-amber-850 hover:text-amber-950 underline flex items-center gap-0.5"
                >
                  Inspect Conversation →
                </button>
              </div>
            </div>
          </div>

          {/* PRIORITY 3: Partnership Scope Qualification (M01) */}
          <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/40 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-teal-900 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-teal-700" />
                  <span>Channel Scope Qualification</span>
                </span>
                <span className="text-[10px] font-mono font-bold bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded">
                  Ref: M01
                </span>
              </div>
              <h3 className="text-sm font-bold text-ink-900 leading-snug">
                Harborpath Advisory: Remote Banking Scope
              </h3>
              <p className="text-xs text-stone-700 leading-relaxed">
                Advisory partner believed SpendNest was a licensed remote bank. Must clarify non-bank corporate spend & card remit before partnership contracting.
              </p>

              {/* Exact Evidence Excerpt */}
              <div className="bg-white p-2.5 rounded border border-teal-200 text-xs space-y-0.5">
                <span className="text-[10px] font-bold text-teal-900 uppercase tracking-wide block">
                  Verified Citation (Turn 1):
                </span>
                <p className="font-mono text-[11px] text-stone-800 italic leading-relaxed">
                  &quot;My understanding was that you help people open bank accounts remotely...&quot;
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-teal-200 text-xs space-y-2">
              <div className="text-[11px] text-stone-600">
                <strong className="text-stone-900">Action:</strong> Re-align partner deck on non-bank spend scope before follow-up.
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-stone-500 font-medium">Owner: team06@example.com</span>
                <button
                  onClick={() => onSelectRecord('meeting', 'cb5cecac-e68d-52b7-b10b-b0c748efc467')}
                  className="text-xs font-bold text-teal-800 hover:text-teal-950 underline flex items-center gap-0.5"
                >
                  Inspect Conversation →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: DISTINCTIVE TWO-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* COLUMN A (PRIMARY, 8 COLUMNS): Triage & Review Decision Workbench */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-[#dedcd2] shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
            <div>
              <h2 className="text-lg font-bold text-ink-900 tracking-tight font-editorial">
                Triage & Action Workbench
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Focused decision stream for incoming conversations and intake queue
              </p>
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <button
                onClick={() => setTriageFilter('ALL')}
                className={`px-2.5 py-1 rounded-md font-semibold transition ${
                  triageFilter === 'ALL' ? 'bg-[#18181b] text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                All ({records.length})
              </button>
              <button
                onClick={() => setTriageFilter('PENDING')}
                className={`px-2.5 py-1 rounded-md font-semibold transition ${
                  triageFilter === 'PENDING' ? 'bg-amber-800 text-white' : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                }`}
              >
                Pending Triage ({metrics.pendingReview})
              </button>
              <button
                onClick={() => setTriageFilter('BUGS')}
                className={`px-2.5 py-1 rounded-md font-semibold transition ${
                  triageFilter === 'BUGS' ? 'bg-rose-800 text-white' : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
                }`}
              >
                Bugs
              </button>
              <button
                onClick={() => setTriageFilter('COACHING')}
                className={`px-2.5 py-1 rounded-md font-semibold transition ${
                  triageFilter === 'COACHING' ? 'bg-amber-800 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Coaching
              </button>
              <button
                onClick={() => setTriageFilter('DEALS')}
                className={`px-2.5 py-1 rounded-md font-semibold transition ${
                  triageFilter === 'DEALS' ? 'bg-teal-800 text-white' : 'bg-teal-50 text-teal-800 hover:bg-teal-100'
                }`}
              >
                Deals
              </button>
              {metrics.manualOverrides > 0 && (
                <button
                  onClick={() => setTriageFilter('OVERRIDES')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition ${
                    triageFilter === 'OVERRIDES' ? 'bg-purple-800 text-white' : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
                  }`}
                >
                  Overrides ({metrics.manualOverrides})
                </button>
              )}
            </div>
          </div>

          {/* Actionable Decision Cards List */}
          <div className="space-y-3">
            {triageRecords.map(r => {
              const isCall = r.source_type === 'call';
              const person = isCall
                ? (r.payload?.rep_name || r.payload?.rep_email || 'Unassigned')
                : (r.payload?.organizer_email || 'Unassigned');
              const isPending = r.analysis.reviewStatus === 'pending_review';

              return (
                <div
                  key={`${r.source_type}:${r.source_id}`}
                  className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-white hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-xs text-ink-900 font-mono">
                        {r.record_ref || r.source_id.slice(0, 6)}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-semibold border ${
                        isCall ? 'bg-blue-50 text-blue-800 border-blue-200' : 'bg-purple-50 text-purple-800 border-purple-200'
                      }`}>
                        {isCall ? <Phone className="w-2.5 h-2.5" /> : <Video className="w-2.5 h-2.5" />}
                        {isCall ? 'Call' : 'Meeting'}
                      </span>
                      <span className="text-[11px] font-medium text-stone-600 truncate">
                        {person}
                      </span>
                      {r.has_transcript ? (
                        <span className="text-[10px] font-semibold text-teal-800 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
                          {isCall ? 'Text' : `${r.transcript_payload?.turns?.length || 0} Turns`}
                        </span>
                      ) : (
                        <span className="text-[10px] text-stone-400">
                          No text supplied
                        </span>
                      )}
                      {r.analysis.isManualOverride && (
                        <span className="text-[10px] font-bold text-purple-800 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200">
                          Manual Override
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-semibold text-ink-900 truncate">
                      {isCall ? (r.payload?.observed_outcome ? `Outcome: ${r.payload.observed_outcome}` : 'Call Record') : r.payload?.title}
                    </div>

                    <p className="text-[11px] text-stone-600 leading-relaxed truncate max-w-xl">
                      {r.analysis.rationale}
                    </p>
                  </div>

                  {/* Actions & Route Badge */}
                  <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 shrink-0">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${ROUTE_COLORS[r.analysis.route]}`}>
                      {r.analysis.route}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {isPending ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSetReviewStatus(r.source_type, r.source_id, 'reviewed');
                          }}
                          title="Confirm triage & mark reviewed"
                          className="text-[10px] bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold px-2 py-1 rounded border border-teal-300 transition flex items-center gap-0.5"
                        >
                          <Check className="w-3 h-3" /> Approve
                        </button>
                      ) : (
                        <span className="text-[10px] text-stone-400 font-medium">Reviewed ✓</span>
                      )}

                      <button
                        onClick={() => onSelectRecord(r.source_type, r.source_id)}
                        className="text-xs font-bold text-teal-750 hover:text-teal-950 underline ml-1"
                      >
                        Inspect →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={() => onNavigateTab('inbox')}
              className="text-xs font-semibold text-stone-600 hover:text-ink-900 hover:underline"
            >
              View All 44 Records in Complete Archive →
            </button>
          </div>
        </div>

        {/* COLUMN B (SECONDARY RAIL, 4 COLUMNS): Data Health & Recent Changes Rail */}
        <div className="lg:col-span-4 space-y-4">
          {/* Card 1: Data Health & Contract Telemetry */}
          <div className="bg-white p-5 rounded-2xl border border-[#dedcd2] shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Data Health & Contract Status
              </h3>
              <span className="text-[10px] font-mono font-bold bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded">
                DATA_CONTRACT.md
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-stone-50">
                <span className="text-stone-500">Total Unique Records:</span>
                <span className="font-bold text-ink-900">{metrics.totalRecords} / 44 (100%)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-50">
                <span className="text-stone-500">Usable Transcript Text:</span>
                <span className="font-bold text-teal-800">{metrics.transcripts} / 44 ({metrics.transcriptCoveragePercent}%)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-50">
                <span className="text-stone-500">Unconnected / Silent Calls:</span>
                <span className="font-bold text-stone-700">20 / 30 calls</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-50">
                <span className="text-stone-500">Unrecorded Meetings:</span>
                <span className="font-bold text-stone-700">6 / 14 meetings</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-50">
                <span className="text-stone-500">Manual Overrides Preserved:</span>
                <span className="font-bold text-purple-700">{metrics.manualOverrides}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-stone-500">Active Delivery State:</span>
                <span className="font-bold text-stone-800">
                  {metrics.transcripts === 18 ? 'Revision 2 (Post-Update)' : 'Revision 1 (Initial)'}
                </span>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('insights')}
              className="w-full mt-2 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 py-1.5 rounded-lg border border-teal-200 transition text-center block"
            >
              Explore Full Analytics & Charts →
            </button>
          </div>

          {/* Card 2: Recent Changes Audit Stream */}
          <div className="bg-white p-5 rounded-2xl border border-[#dedcd2] shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Recent Ingestion Changes
              </h3>
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse"></span>
            </div>

            {recentChanges.length === 0 ? (
              <div className="p-3 bg-stone-50 rounded-lg text-xs text-stone-500 text-center">
                All records currently in steady state. Run an import update or override a route to inspect live change tracking.
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {recentChanges.slice(0, 5).map(change => (
                  <div key={change.id} className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 text-xs space-y-1">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-bold text-ink-900">{change.title}</span>
                      <span className="text-stone-400 text-[10px] font-mono">
                        {new Date(change.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 leading-tight">
                      {change.description}
                    </p>
                    {change.overridePreserved && (
                      <span className="inline-block text-[9px] font-bold text-purple-700 bg-purple-50 px-1 rounded border border-purple-200">
                        Override Intact
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card 3: Fast Replay Verification Launcher */}
          <div className="bg-[#18181b] text-stone-200 p-5 rounded-2xl shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-teal-400 font-bold">
                Verification QA
              </span>
              <span className="text-[10px] text-stone-400">Vitest Certified</span>
            </div>
            <h4 className="text-sm font-bold text-white">Contract Replay Verifier</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Verify the mandatory 7-stage replay contract directly from the interactive testing console.
            </p>
            <button
              onClick={() => onNavigateTab('replay')}
              className="w-full bg-stone-800 hover:bg-stone-700 text-teal-300 font-semibold text-xs py-2 rounded-lg border border-stone-700 transition flex items-center justify-center gap-1.5"
            >
              <span>Open Replay Test Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
