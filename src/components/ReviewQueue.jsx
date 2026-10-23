import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  Phone,
  Video,
  ChevronRight,
  UserCheck,
  Check,
} from 'lucide-react';
import { ROUTE_COLORS } from '../services/routingTaxonomy';

export default function ReviewQueue({ records, onSelectRecord, onSetReviewStatus }) {
  const [filterType, setFilterType] = useState('pending'); // 'pending' | 'reviewed' | 'all'
  const [reasonFilter, setReasonFilter] = useState('ALL');

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      if (filterType === 'pending' && r.analysis.reviewStatus !== 'pending_review') return false;
      if (filterType === 'reviewed' && r.analysis.reviewStatus !== 'reviewed') return false;

      if (reasonFilter === 'NO_TRANSCRIPT' && r.has_transcript) return false;
      if (reasonFilter === 'OVERRIDE' && !r.analysis.isManualOverride) return false;
      if (reasonFilter === 'BUG' && r.analysis.route !== 'Customer Support Bug') return false;
      if (reasonFilter === 'SECURITY' && r.security?.status !== 'Malicious — review required') return false;

      return true;
    });
  }, [records, filterType, reasonFilter]);

  const pendingCount = useMemo(() => {
    return records.filter(r => r.analysis.reviewStatus === 'pending_review').length;
  }, [records]);

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Manager Review Queue</h2>
            {pendingCount > 0 && (
              <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-300">
                {pendingCount} Pending Triage
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Operational triage for records needing manual confirmation, missing transcript assessment, or bug escalation.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Status Segmented Buttons */}
          <div className="bg-slate-100 p-1 rounded-lg flex items-center border border-slate-200">
            <button
              onClick={() => setFilterType('pending')}
              className={`px-3 py-1 rounded text-xs font-semibold transition ${
                filterType === 'pending' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setFilterType('reviewed')}
              className={`px-3 py-1 rounded text-xs font-semibold transition ${
                filterType === 'reviewed' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Reviewed ({records.length - pendingCount})
            </button>
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded text-xs font-semibold transition ${
                filterType === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({records.length})
            </button>
          </div>

          {/* Sub-filter Reason */}
          <select
            value={reasonFilter}
            onChange={e => setReasonFilter(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="SECURITY">🛡️ Prompt Guard Quarantined</option>
            <option value="NO_TRANSCRIPT">Missing Transcripts (26)</option>
            <option value="OVERRIDE">Manual Overrides</option>
            <option value="BUG">Support Roadblocks</option>
          </select>
        </div>
      </div>

      {/* Queue Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <th className="py-3 px-4 w-20">Ref</th>
              <th className="py-3 px-3 w-28">Type</th>
              <th className="py-3 px-3">Subject / Observed Outcome</th>
              <th className="py-3 px-3">Triage Reason / Audit Note</th>
              <th className="py-3 px-3 w-36">Current Route</th>
              <th className="py-3 px-3 w-28">Status</th>
              <th className="py-3 px-4 w-28 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-8 text-center text-slate-400">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1.5" />
                  No records in this queue state! All items have been processed.
                </td>
              </tr>
            ) : (
              filteredRecords.map(r => {
                const isCall = r.source_type === 'call';
                const isPending = r.analysis.reviewStatus === 'pending_review';

                return (
                  <tr key={`${r.source_type}:${r.source_id}`} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {r.record_ref || r.source_id.slice(0, 6)}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${
                        isCall ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-purple-50 text-purple-700 border-purple-200'
                      }`}>
                        {isCall ? <Phone className="w-3 h-3" /> : <Video className="w-3 h-3" />}
                        {isCall ? 'Call' : 'Meeting'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-800 font-medium">
                      <div className="flex items-center gap-1.5">
                        {r.security?.status === 'Malicious — review required' && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-0.5 shrink-0">
                            🚨 Prompt Injection
                          </span>
                        )}
                        <span className="truncate">{isCall ? (r.payload?.observed_outcome || 'unknown outcome') : r.payload?.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600 max-w-xs truncate" title={r.analysis.rationale}>
                      {r.analysis.rationale}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${ROUTE_COLORS[r.analysis.route]}`}>
                        {r.analysis.route}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${
                        isPending
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      }`}>
                        {isPending ? <Clock className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                        {isPending ? 'Pending' : 'Reviewed'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      {isPending ? (
                        <button
                          onClick={() => onSetReviewStatus(r.source_type, r.source_id, 'reviewed')}
                          title="Mark as reviewed"
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold px-2 py-1 rounded border border-emerald-200 text-[11px] inline-flex items-center gap-0.5"
                        >
                          <Check className="w-3 h-3" />
                          <span>Approve</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onSetReviewStatus(r.source_type, r.source_id, 'pending_review')}
                          title="Reopen review"
                          className="text-slate-500 hover:text-slate-700 font-medium text-[11px] underline"
                        >
                          Reopen
                        </button>
                      )}
                      <button
                        onClick={() => onSelectRecord(r.source_type, r.source_id)}
                        className="text-sky-600 hover:text-sky-800 font-semibold text-[11px] hover:underline ml-1"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
