import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Phone,
  Video,
  FileText,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';
import { ROUTE_COLORS } from '../services/routingTaxonomy';

export default function Inbox({ records, onSelectRecord }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSourceType, setFilterSourceType] = useState('ALL');
  const [filterRoute, setFilterRoute] = useState('ALL');
  const [filterTranscript, setFilterTranscript] = useState('ALL');
  const [filterReviewStatus, setFilterReviewStatus] = useState('ALL');
  const [filterOverride, setFilterOverride] = useState('ALL');
  const [sortBy, setSortBy] = useState('ref');

  // Filter logic
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      // Search term filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const ref = (r.record_ref || '').toLowerCase();
        const id = r.source_id.toLowerCase();
        const person = (r.source_type === 'call'
          ? (r.payload?.rep_name || r.payload?.rep_email || '')
          : (r.payload?.organizer_email || '')).toLowerCase();
        const titleOrOutcome = (r.source_type === 'call'
          ? (r.payload?.observed_outcome || '')
          : (r.payload?.title || '')).toLowerCase();
        const route = (r.analysis.route || '').toLowerCase();

        if (
          !ref.includes(query) &&
          !id.includes(query) &&
          !person.includes(query) &&
          !titleOrOutcome.includes(query) &&
          !route.includes(query)
        ) {
          return false;
        }
      }

      // Source type
      if (filterSourceType !== 'ALL' && r.source_type !== filterSourceType) return false;

      // Route
      if (filterRoute !== 'ALL' && r.analysis.route !== filterRoute) return false;

      // Transcript availability
      if (filterTranscript === 'YES' && !r.has_transcript) return false;
      if (filterTranscript === 'NO' && r.has_transcript) return false;

      // Review status
      if (filterReviewStatus !== 'ALL' && r.analysis.reviewStatus !== filterReviewStatus) return false;

      // Manual override
      if (filterOverride === 'YES' && !r.analysis.isManualOverride) return false;
      if (filterOverride === 'NO' && r.analysis.isManualOverride) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'ref') {
        return (a.record_ref || '').localeCompare(b.record_ref || '');
      }
      if (sortBy === 'type') {
        return a.source_type.localeCompare(b.source_type);
      }
      if (sortBy === 'route') {
        return (a.analysis.route || '').localeCompare(b.analysis.route || '');
      }
      if (sortBy === 'revision') {
        return b.applied_revision - a.applied_revision;
      }
      return 0;
    });
  }, [records, searchTerm, filterSourceType, filterRoute, filterTranscript, filterReviewStatus, filterOverride, sortBy]);

  return (
    <div className="space-y-4">
      {/* Top Bar: Search and Summary */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Conversation Inbox</h2>
          <p className="text-xs text-slate-500">
            Showing <strong className="text-slate-800">{filteredRecords.length}</strong> of {records.length} records • All activity 21 August 2026
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search ref (e.g. C01, M07), person, title..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 text-slate-800"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-2 text-xs">
        <div className="flex items-center space-x-1 text-slate-500 font-semibold mr-1">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters:</span>
        </div>

        {/* Source Type */}
        <select
          value={filterSourceType}
          onChange={e => setFilterSourceType(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-700 font-medium"
        >
          <option value="ALL">All Types</option>
          <option value="call">Calls Only</option>
          <option value="meeting">Meetings Only</option>
        </select>

        {/* Routing Category */}
        <select
          value={filterRoute}
          onChange={e => setFilterRoute(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-700 font-medium"
        >
          <option value="ALL">All Routes</option>
          <option value="Sales Coaching">Sales Coaching</option>
          <option value="Deal Next Step">Deal Next Step</option>
          <option value="Customer Support Bug">Customer Support Bug</option>
          <option value="Internal / Vendor Note">Internal / Vendor Note</option>
          <option value="Review Required">Review Required</option>
        </select>

        {/* Transcript Available */}
        <select
          value={filterTranscript}
          onChange={e => setFilterTranscript(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-700 font-medium"
        >
          <option value="ALL">All Transcript States</option>
          <option value="YES">Usable Text Present</option>
          <option value="NO">No Transcript Text</option>
        </select>

        {/* Review Status */}
        <select
          value={filterReviewStatus}
          onChange={e => setFilterReviewStatus(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-700 font-medium"
        >
          <option value="ALL">All Review States</option>
          <option value="pending_review">Pending Review</option>
          <option value="reviewed">Reviewed</option>
        </select>

        {/* Override */}
        <select
          value={filterOverride}
          onChange={e => setFilterOverride(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-700 font-medium"
        >
          <option value="ALL">All Decisions</option>
          <option value="YES">Manual Overrides Only</option>
          <option value="NO">Automated Only</option>
        </select>

        {/* Sort */}
        <div className="ml-auto flex items-center space-x-1.5">
          <span className="text-slate-400">Sort:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-700 font-medium"
          >
            <option value="ref">Record Ref (C01, M01...)</option>
            <option value="type">Source Type</option>
            <option value="route">Route Category</option>
            <option value="revision">Revision (Newest first)</option>
          </select>
        </div>
      </div>

      {/* Table of Records */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-3 w-16">Ref</th>
                <th className="py-3 px-3 w-24">Type</th>
                <th className="py-3 px-3">Rep / Organizer</th>
                <th className="py-3 px-3">Topic / Upstream Outcome</th>
                <th className="py-3 px-3 w-28">Transcript</th>
                <th className="py-3 px-3">Assigned Route</th>
                <th className="py-3 px-3 w-24">Decision</th>
                <th className="py-3 px-3 w-20">Rev</th>
                <th className="py-3 px-3 w-16 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-8 text-center text-slate-400">
                    No records match the selected search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords.map(r => {
                  const isCall = r.source_type === 'call';
                  const person = isCall
                    ? (r.payload?.rep_name || r.payload?.rep_email || 'Unassigned')
                    : (r.payload?.organizer_email || 'Unassigned');
                  const topicOrOutcome = isCall
                    ? (r.payload?.observed_outcome || 'unknown outcome')
                    : (r.payload?.title || 'No Title');
                  const routeStyle = ROUTE_COLORS[r.analysis.route] || 'bg-slate-100 text-slate-700 border-slate-300';

                  return (
                    <tr
                      key={`${r.source_type}:${r.source_id}`}
                      onClick={() => onSelectRecord(r.source_type, r.source_id)}
                      className="hover:bg-sky-50/60 cursor-pointer transition-colors group"
                    >
                      {/* Ref */}
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        {r.record_ref || r.source_id.slice(0, 6)}
                      </td>

                      {/* Type Badge */}
                      <td className="py-2.5 px-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${
                          isCall
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-purple-50 text-purple-700 border-purple-200'
                        }`}>
                          {isCall ? <Phone className="w-3 h-3" /> : <Video className="w-3 h-3" />}
                          {isCall ? 'Call' : 'Meeting'}
                        </span>
                      </td>

                      {/* Person */}
                      <td className="py-2.5 px-3 text-slate-800 font-medium">
                        {person}
                      </td>

                      {/* Topic / Outcome */}
                      <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate" title={topicOrOutcome}>
                        {topicOrOutcome}
                      </td>

                      {/* Transcript Presence */}
                      <td className="py-2.5 px-3">
                        {r.has_transcript ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <FileText className="w-3 h-3" />
                            {isCall ? 'Text' : `${r.transcript_payload?.turns?.length || 0} Turns`}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                            No Text
                          </span>
                        )}
                      </td>

                      {/* Assigned Route */}
                      <td className="py-2.5 px-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${routeStyle}`}>
                          {r.analysis.route}
                        </span>
                      </td>

                      {/* Decision Type */}
                      <td className="py-2.5 px-3">
                        {r.analysis.isManualOverride ? (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-300">
                            <UserCheck className="w-3 h-3" /> Override
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">
                            Auto
                          </span>
                        )}
                      </td>

                      {/* Applied Revision */}
                      <td className="py-2.5 px-3">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                          r.applied_revision === 2
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          Rev {r.applied_revision}
                        </span>
                      </td>

                      {/* Action Chevron */}
                      <td className="py-2.5 px-3 text-right">
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 inline transition-colors" />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
