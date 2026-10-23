import React from 'react';
import {
  Compass,
  FileSearch,
  Archive,
  ScrollText,
  Download,
  Terminal,
  ShieldCheck,
  AlertTriangle,
  BarChart3,
} from 'lucide-react';

export default function Sidebar({ currentTab, setCurrentTab, pendingReviewCount, manualOverrideCount }) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Signal Desk',
      sublabel: 'Primary Decision Workspace',
      icon: Compass,
    },
    {
      id: 'insights',
      label: 'Activity & Analytics',
      sublabel: 'Volume, Routes & Coverage',
      icon: BarChart3,
    },
    {
      id: 'detail',
      label: 'Evidence Inspector',
      sublabel: '3-Pane Split Inspection',
      icon: FileSearch,
    },
    {
      id: 'inbox',
      label: 'Complete Archive',
      sublabel: '44 Source Records Table',
      icon: Archive,
    },
    {
      id: 'review',
      label: 'Attention Queue',
      sublabel: 'Triage & Uncertainty Queue',
      icon: AlertTriangle,
      badge: pendingReviewCount > 0 ? pendingReviewCount : null,
      badgeColor: 'bg-amber-100 text-amber-900 border border-amber-300',
    },
    {
      id: 'brief',
      label: 'Executive Daily Memo',
      sublabel: '21 August 2026 Briefing',
      icon: ScrollText,
    },
    {
      id: 'export',
      label: 'Export Manifests',
      sublabel: 'JSON / CSV & ZIP Export',
      icon: Download,
    },
    {
      id: 'replay',
      label: 'Contract QA & Replay',
      sublabel: '7-Step Contract Verifier',
      icon: Terminal,
      badge: 'Certified',
      badgeColor: 'bg-teal-900/60 text-teal-300 border border-teal-700',
    },
  ];

  return (
    <aside className="w-64 bg-[#141416] text-stone-300 flex flex-col shrink-0 min-h-[calc(100vh-61px)] border-r border-stone-800">
      {/* Scope Identifier */}
      <div className="p-4 border-b border-stone-800/80">
        <div className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest">
          Manager Workspace
        </div>
        <div className="text-xs font-serif text-stone-200 mt-0.5">
          SpendNest Commercial Ops
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="p-2.5 space-y-1 flex-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg transition-all flex items-center justify-between ${
                isActive
                  ? 'bg-stone-800/90 text-white shadow-sm ring-1 ring-stone-700/60'
                  : 'text-stone-400 hover:bg-stone-900/80 hover:text-stone-200'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-400' : 'text-stone-400'}`} />
                <div className="min-w-0">
                  <div className={`text-xs font-semibold truncate ${isActive ? 'text-white' : 'text-stone-300'}`}>
                    {item.label}
                  </div>
                  <div className="text-[10px] text-stone-500 truncate">
                    {item.sublabel}
                  </div>
                </div>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ml-1.5 ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Integrity & Audit Card */}
      <div className="p-3.5 m-2.5 rounded-lg bg-stone-900/70 border border-stone-800 text-xs space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-stone-400">Identity Mode:</span>
          <span className="font-mono text-[10px] text-teal-400 font-semibold">(type, id)</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-stone-400">Manual Overrides:</span>
          <span className="font-bold text-amber-300">{manualOverrideCount}</span>
        </div>
        <div className="text-[10px] text-stone-500 pt-1 border-t border-stone-800 leading-tight">
          Protected across Revision 2 updates and browser refreshes.
        </div>
      </div>
    </aside>
  );
}
