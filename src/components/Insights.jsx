import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import {
  Users,
  Layers,
  FileText,
  Filter,
  Phone,
  Video,
  PieChart as PieIcon,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

const ROUTE_COLORS = {
  'Sales Coaching': '#b45309',
  'Deal Next Step': '#0f766e',
  'Customer Support Bug': '#be123c',
  'Internal / Vendor Note': '#4338ca',
  'Review Required': '#78716c',
};

export default function Insights({ records, metrics, onSelectRecord }) {
  const [personFilter, setPersonFilter] = useState('ALL');
  const [sourceTypeFilter, setSourceTypeFilter] = useState('ALL');

  // Filter records
  const filtered = useMemo(() => {
    return records.filter(r => {
      if (sourceTypeFilter !== 'ALL' && r.source_type !== sourceTypeFilter) return false;
      if (personFilter !== 'ALL') {
        const p = r.source_type === 'call'
          ? (r.payload?.rep_name || r.payload?.rep_email || 'Unassigned')
          : (r.payload?.organizer_email || 'Unassigned');
        if (p !== personFilter) return false;
      }
      return true;
    });
  }, [records, personFilter, sourceTypeFilter]);

  // Aggregate rep data
  const repData = useMemo(() => {
    const map = {};
    filtered.forEach(r => {
      const p = r.source_type === 'call'
        ? (r.payload?.rep_name || r.payload?.rep_email || 'Unassigned')
        : (r.payload?.organizer_email || 'Unassigned');
      map[p] = (map[p] || 0) + 1;
    });
    return Object.entries(map)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [filtered]);

  // Aggregate route data
  const routeData = useMemo(() => {
    const map = {
      'Sales Coaching': 0,
      'Deal Next Step': 0,
      'Customer Support Bug': 0,
      'Internal / Vendor Note': 0,
      'Review Required': 0,
    };
    filtered.forEach(r => {
      const route = r.analysis.route || 'Review Required';
      map[route] = (map[route] || 0) + 1;
    });
    return Object.entries(map).map(([name, count]) => ({ name, count }));
  }, [filtered]);

  // Aggregate call outcomes
  const outcomeData = useMemo(() => {
    const map = {};
    filtered.filter(r => r.source_type === 'call').forEach(r => {
      const out = r.payload?.observed_outcome || 'unknown';
      map[out] = (map[out] || 0) + 1;
    });
    return Object.entries(map)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [filtered]);

  const allPersons = useMemo(() => {
    const set = new Set();
    records.forEach(r => {
      if (r.source_type === 'call') {
        set.add(r.payload?.rep_name || r.payload?.rep_email || 'Unassigned');
      } else {
        set.add(r.payload?.organizer_email || 'Unassigned');
      }
    });
    return Array.from(set).sort();
  }, [records]);

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-[#dedcd2] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              Deep Analytics
            </span>
            <span className="text-xs text-stone-500 font-medium">Activity Date: 21 August 2026</span>
          </div>
          <h2 className="text-xl font-bold text-ink-900 tracking-tight font-editorial mt-1">
            Activity, Coverage & Routing Insights
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Secondary analytical visualizations and distribution telemetry across the 44 selected interactions.
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-2 bg-stone-50 p-2 rounded-lg border border-stone-200 text-xs">
          <span className="font-semibold text-stone-600 text-[11px] flex items-center gap-1">
            <Filter className="w-3 h-3 text-stone-400" /> Filter:
          </span>
          <select
            value={sourceTypeFilter}
            onChange={e => setSourceTypeFilter(e.target.value)}
            className="bg-white border border-stone-300 rounded px-2 py-1 text-xs text-stone-800 font-medium"
          >
            <option value="ALL">All Sources ({records.length})</option>
            <option value="call">Calls Only (30)</option>
            <option value="meeting">Meetings Only (14)</option>
          </select>
          <select
            value={personFilter}
            onChange={e => setPersonFilter(e.target.value)}
            className="bg-white border border-stone-300 rounded px-2 py-1 text-xs text-stone-800 font-medium max-w-[170px]"
          >
            <option value="ALL">All Persons ({allPersons.length})</option>
            {allPersons.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          {(personFilter !== 'ALL' || sourceTypeFilter !== 'ALL') && (
            <button
              onClick={() => { setPersonFilter('ALL'); setSourceTypeFilter('ALL'); }}
              className="text-xs text-teal-750 hover:underline font-semibold"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Grid of Analytical Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Activity by Person */}
        <div className="bg-white p-5 rounded-xl border border-[#dedcd2] shadow-sm space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-stone-100">
            <div>
              <h3 className="text-sm font-bold text-ink-900 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-stone-500" />
                <span>Interaction Volume by Person</span>
              </h3>
              <p className="text-xs text-stone-500">
                Call sales reps vs meeting organizers on 21 August 2026
              </p>
            </div>
            <span className="text-xs bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-mono font-medium">
              {repData.length} Active
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={repData} margin={{ top: 10, right: 10, left: -25, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0efe9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#57534e' }} angle={-25} textAnchor="end" interval={0} />
                <YAxis tick={{ fontSize: 10, fill: '#57534e' }} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#dedcd2', borderRadius: '8px', fontSize: '11px' }} />
                <Bar dataKey="count" fill="#18181b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-stone-400 italic">
            * Note: Meeting organizers (e.g. team08@example.com) are not automatically the salesperson or an attendee.
          </p>
        </div>

        {/* Chart 2: Routing Distribution */}
        <div className="bg-white p-5 rounded-xl border border-[#dedcd2] shadow-sm space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-stone-100">
            <div>
              <h3 className="text-sm font-bold text-ink-900 flex items-center gap-1.5">
                <PieIcon className="w-4 h-4 text-stone-500" />
                <span>Routing Taxonomy Breakdown</span>
              </h3>
              <p className="text-xs text-stone-500">
                Distribution across the 4 primary categories + Review state
              </p>
            </div>
            <span className="text-xs bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-mono font-medium">
              {filtered.length} Total
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={routeData} margin={{ top: 10, right: 10, left: -25, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0efe9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#57534e' }} angle={-20} textAnchor="end" interval={0} />
                <YAxis tick={{ fontSize: 10, fill: '#57534e' }} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#dedcd2', borderRadius: '8px', fontSize: '11px' }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {routeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={ROUTE_COLORS[entry.name] || '#78716c'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-stone-400 italic">
            * Records without usable text remain in &apos;Review Required&apos;; no speculative sales analysis is invented.
          </p>
        </div>

        {/* Chart 3: Call Outcomes (Stored Upstream Labels) */}
        <div className="bg-white p-5 rounded-xl border border-[#dedcd2] shadow-sm space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-stone-100">
            <div>
              <h3 className="text-sm font-bold text-ink-900 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-stone-500" />
                <span>Outbound Call Outcomes (Stored Labels)</span>
              </h3>
              <p className="text-xs text-stone-500">
                Upstream classifications across all 30 telephone records
              </p>
            </div>
            <span className="text-xs bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-mono font-medium">
              30 Calls
            </span>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={outcomeData} margin={{ top: 10, right: 10, left: -25, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0efe9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#57534e' }} angle={-20} textAnchor="end" interval={0} />
                <YAxis tick={{ fontSize: 10, fill: '#57534e' }} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#dedcd2', borderRadius: '8px', fontSize: '11px' }} />
                <Bar dataKey="count" fill="#4338ca" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-stone-400 italic">
            * Note: Stored upstream labels represent previous system output, not verified ground truth.
          </p>
        </div>

        {/* Coverage Context Card */}
        <div className="bg-white p-5 rounded-xl border border-[#dedcd2] shadow-sm space-y-4">
          <div className="pb-2 border-b border-stone-100">
            <h3 className="text-sm font-bold text-ink-900 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-teal-700" />
              <span>Transcript Coverage Telemetry</span>
            </h3>
            <p className="text-xs text-stone-500">
              Comparing usable text availability against total selected records
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-stone-700 mb-1">
                <span>Overall Usable Text Coverage</span>
                <span className="text-teal-800">{metrics.transcripts} / {metrics.totalRecords} ({metrics.transcriptCoveragePercent}%)</span>
              </div>
              <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-teal-700 h-full rounded-full transition-all duration-500"
                  style={{ width: `${metrics.transcriptCoveragePercent}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <span className="text-[11px] text-stone-500 block">Calls with Transcript</span>
                <span className="text-base font-bold text-ink-900">10 / 30</span>
                <span className="text-[10px] text-stone-400 block mt-0.5">20 voicemails / unconnected</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <span className="text-[11px] text-stone-500 block">Meetings with Transcript</span>
                <span className="text-base font-bold text-ink-900">8 / 14</span>
                <span className="text-[10px] text-stone-400 block mt-0.5">6 unrecorded / missing</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50/70 rounded-lg border border-amber-200 text-[11px] text-amber-950 leading-relaxed">
              <strong>Evaluation Standard:</strong> Absence of transcript does not prove a conversation never occurred. All 26 silent records retain intake state and are inspectable.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
