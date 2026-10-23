import React, { useState } from 'react';
import {
  Phone,
  Video,
  FileText,
  UserCheck,
  RotateCcw,
  Save,
  CheckCircle2,
  AlertTriangle,
  Quote,
  Clock,
  User,
  ShieldCheck,
  ShieldAlert,
  Shield,
  Search,
  Filter,
  Check,
  Sparkles,
  Info,
  Lock,
  Unlock,
  RefreshCw,
  Play,
} from 'lucide-react';
import { ROUTE_CATEGORIES, ROUTE_COLORS } from '../services/routingTaxonomy';
import { INJECTION_TEST_VECTORS } from '../services/securityService';
import { evaluateGenerativeAiGate, executeGenerativeAnalysis } from '../services/safeAiGateway';

export default function ConversationDetail({
  record,
  allRecords = [],
  onSelectRecord,
  onSetManualRoute,
  onResetManualRoute,
  onSetReviewStatus,
  onSecurityScan,
  onSafeReviewAuthorization,
}) {
  const [listSearch, setListSearch] = useState('');
  const [listFilter, setListFilter] = useState('ALL'); // 'ALL' | 'transcript' | 'calls' | 'meetings'
  const [activeTabRight, setActiveTabRight] = useState('route'); // 'route' | 'security'

  const activeRecord = record || allRecords[0] || null;

  const [selectedRoute, setSelectedRoute] = useState(activeRecord?.analysis?.route || ROUTE_CATEGORIES.SALES_COACHING);
  const [reviewerNotes, setReviewerNotes] = useState(activeRecord?.analysis?.reviewerNotes || '');
  const [saveFeedback, setSaveFeedback] = useState(false);

  // Security scanning state
  const [isScanning, setIsScanning] = useState(false);
  const [selectedVectorId, setSelectedVectorId] = useState(INJECTION_TEST_VECTORS[0].id);
  const [safeReviewerName, setSafeReviewerName] = useState('RevOps Security Lead');
  const [safeReviewNotes, setSafeReviewNotes] = useState('');
  const [safeReviewChoice, setSafeReviewChoice] = useState('authorize'); // 'authorize' | 'quarantine'
  const [safeReviewFeedback, setSafeReviewFeedback] = useState(false);

  // Generative AI Gate simulation state
  const [aiTestResult, setAiTestResult] = useState(null);
  const [aiTestError, setAiTestError] = useState(null);
  const [aiIsRunning, setAiIsRunning] = useState(false);

  // Sync state when activeRecord changes
  React.useEffect(() => {
    if (activeRecord) {
      setSelectedRoute(activeRecord.analysis.route);
      setReviewerNotes(activeRecord.analysis.reviewerNotes || '');
      setAiTestResult(null);
      setAiTestError(null);
    }
  }, [activeRecord]);

  if (!activeRecord) {
    return (
      <div className="bg-white p-8 rounded-xl border border-stone-200 text-center text-xs text-stone-500">
        No records available to inspect.
      </div>
    );
  }

  const isCall = activeRecord.source_type === 'call';
  const person = isCall
    ? (activeRecord.payload?.rep_name || activeRecord.payload?.rep_email || 'Unassigned')
    : (activeRecord.payload?.organizer_email || 'Unassigned');

  const filteredList = allRecords.filter(r => {
    if (listFilter === 'transcript' && !r.has_transcript) return false;
    if (listFilter === 'calls' && r.source_type !== 'call') return false;
    if (listFilter === 'meetings' && r.source_type !== 'meeting') return false;

    if (listSearch.trim()) {
      const q = listSearch.toLowerCase();
      const ref = (r.record_ref || '').toLowerCase();
      const p = (r.source_type === 'call' ? (r.payload?.rep_name || '') : (r.payload?.organizer_email || '')).toLowerCase();
      const route = (r.analysis.route || '').toLowerCase();
      return ref.includes(q) || p.includes(q) || route.includes(q);
    }
    return true;
  });

  const handleSaveOverride = () => {
    onSetManualRoute(activeRecord.source_type, activeRecord.source_id, selectedRoute, reviewerNotes);
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2500);
  };

  const handleReset = () => {
    onResetManualRoute(activeRecord.source_type, activeRecord.source_id);
    setSelectedRoute(activeRecord.analysis.suggestedRoute);
    setReviewerNotes('');
  };

  // Run live Prompt Guard scan on authentic transcript text
  const handleTriggerRealScan = async () => {
    if (!onSecurityScan) return;
    setIsScanning(true);
    setAiTestResult(null);
    setAiTestError(null);
    try {
      await onSecurityScan(activeRecord.source_type, activeRecord.source_id, null);
    } catch (err) {
      console.error('Scan error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  // Run Prompt Guard scan against a simulated injection vector to demonstrate quarantine
  const handleTriggerSimulatedInjection = async () => {
    if (!onSecurityScan) return;
    const vector = INJECTION_TEST_VECTORS.find(v => v.id === selectedVectorId);
    if (!vector) return;
    setIsScanning(true);
    setAiTestResult(null);
    setAiTestError(null);
    try {
      await onSecurityScan(activeRecord.source_type, activeRecord.source_id, vector.payload);
    } catch (err) {
      console.error('Injection test error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  // Submit Safe Review Decision (Requirement 4)
  const handleSubmitSafeReview = () => {
    if (!onSafeReviewAuthorization) return;
    const isAuth = safeReviewChoice === 'authorize';
    onSafeReviewAuthorization(activeRecord.source_type, activeRecord.source_id, {
      reviewer: safeReviewerName,
      notes: safeReviewNotes || (isAuth ? 'Authorized after safe manual audit' : 'Maintained strict quarantine'),
      authorizedForGenerativeAI: isAuth,
    });
    setSafeReviewFeedback(true);
    setAiTestResult(null);
    setAiTestError(null);
    setTimeout(() => setSafeReviewFeedback(false), 2500);
  };

  // Test passing transcript to Generative AI component (evaluates security gate)
  const handleTestGenerativeAi = async () => {
    setAiIsRunning(true);
    setAiTestResult(null);
    setAiTestError(null);
    try {
      const result = await executeGenerativeAnalysis(activeRecord);
      setAiTestResult(result);
    } catch (err) {
      setAiTestError(err.message);
    } finally {
      setAiIsRunning(false);
    }
  };

  const securityState = activeRecord.security || { status: 'Not scanned' };
  const secStatus = securityState.status || 'Not scanned';

  // Badge styling for the exact 5 required statuses
  const getSecurityBadge = (status) => {
    switch (status) {
      case 'Benign':
        return {
          label: 'Benign',
          className: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          icon: ShieldCheck,
        };
      case 'Malicious — review required':
        return {
          label: 'Malicious — review required',
          className: 'bg-rose-50 text-rose-800 border-rose-300 font-bold animate-pulse',
          icon: ShieldAlert,
        };
      case 'Scan unavailable':
        return {
          label: 'Scan unavailable',
          className: 'bg-amber-50 text-amber-800 border-amber-300',
          icon: AlertTriangle,
        };
      case 'Scan incomplete':
        return {
          label: 'Scan incomplete',
          className: 'bg-orange-50 text-orange-800 border-orange-300',
          icon: AlertTriangle,
        };
      case 'Not scanned':
      default:
        return {
          label: 'Not scanned',
          className: 'bg-stone-100 text-stone-600 border-stone-200',
          icon: Shield,
        };
    }
  };

  const secBadge = getSecurityBadge(secStatus);
  const SecBadgeIcon = secBadge.icon;
  const aiGate = evaluateGenerativeAiGate(activeRecord);

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col space-y-3">
      {/* Top Banner Context */}
      <div className="bg-white p-3.5 rounded-xl border border-[#dedcd2] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="font-editorial font-bold text-lg text-ink-900">
            Evidence Inspector
          </span>
          <span className="text-xs text-stone-400">|</span>
          <span className="text-xs text-stone-600">
            Active: <strong className="text-ink-900 font-mono">{activeRecord.record_ref || activeRecord.source_id.slice(0, 8)}</strong> ({activeRecord.source_type})
          </span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
            activeRecord.applied_revision === 2
              ? 'bg-teal-50 text-teal-800 border-teal-300'
              : 'bg-stone-100 text-stone-600 border-stone-200'
          }`}>
            Revision {activeRecord.applied_revision}
          </span>

          {/* Business Routing Badge */}
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${ROUTE_COLORS[activeRecord.analysis.route]}`}>
            {activeRecord.analysis.route}
          </span>

          {/* Prominent Prompt Guard Security Badge (Requirement 3) */}
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-medium border ${secBadge.className}`}>
            <SecBadgeIcon className="w-3 h-3 shrink-0" />
            <span>Security: <strong>{secBadge.label}</strong></span>
          </span>

          {securityState.safeReview?.authorizedForGenerativeAI && (
            <span className="text-[10px] bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded font-bold">
              Safe Review Authorized
            </span>
          )}
        </div>

        <div className="text-[11px] text-stone-500 font-mono">
          Identity: ({activeRecord.source_type}, {activeRecord.source_id})
        </div>
      </div>

      {/* 3-Pane Split Inspection Architecture */}
      <div className="flex-1 flex flex-col md:flex-row gap-3 min-h-0 overflow-hidden">
        {/* PANE 1 (LEFT): Fast Conversation Switcher */}
        <div className="w-full md:w-64 bg-white rounded-xl border border-[#dedcd2] shadow-sm flex flex-col shrink-0 min-h-0">
          <div className="p-3 border-b border-stone-100 space-y-2 shrink-0">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Filter ref / person..."
                value={listSearch}
                onChange={e => setListSearch(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1 text-xs bg-stone-50 border border-stone-200 rounded-md focus:outline-none"
              />
            </div>
            <div className="flex gap-1 text-[10px]">
              <button
                onClick={() => setListFilter('ALL')}
                className={`px-2 py-0.5 rounded font-medium ${listFilter === 'ALL' ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-600'}`}
              >
                All (44)
              </button>
              <button
                onClick={() => setListFilter('transcript')}
                className={`px-2 py-0.5 rounded font-medium ${listFilter === 'transcript' ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-600'}`}
              >
                Text (18)
              </button>
              <button
                onClick={() => setListFilter('calls')}
                className={`px-2 py-0.5 rounded font-medium ${listFilter === 'calls' ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-600'}`}
              >
                Calls
              </button>
              <button
                onClick={() => setListFilter('meetings')}
                className={`px-2 py-0.5 rounded font-medium ${listFilter === 'meetings' ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-600'}`}
              >
                Meetings
              </button>
            </div>
          </div>

          {/* Scrollable list */}
          <div className="flex-1 overflow-y-auto divide-y divide-stone-100">
            {filteredList.map(r => {
              const isSelected = r.source_id === activeRecord.source_id && r.source_type === activeRecord.source_type;
              const rep = r.source_type === 'call'
                ? (r.payload?.rep_name || r.payload?.rep_email || 'Unassigned')
                : (r.payload?.organizer_email || 'Unassigned');
              const recSecStatus = r.security?.status || 'Not scanned';

              return (
                <div
                  key={`${r.source_type}:${r.source_id}`}
                  onClick={() => onSelectRecord(r.source_type, r.source_id)}
                  className={`p-2.5 text-xs cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-teal-50/70 border-l-4 border-teal-700'
                      : 'hover:bg-stone-50'
                  }`}
                >
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="font-bold text-ink-900">{r.record_ref || r.source_id.slice(0, 6)}</span>
                    <div className="flex items-center gap-1">
                      {recSecStatus === 'Malicious — review required' && (
                        <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" title="Prompt Injection Quarantined" />
                      )}
                      <span className={`text-[10px] font-semibold px-1 rounded ${
                        r.has_transcript ? 'text-teal-800 bg-teal-50' : 'text-stone-400'
                      }`}>
                        {r.has_transcript ? 'Transcript' : 'No Text'}
                      </span>
                    </div>
                  </div>
                  <div className="text-[11px] text-stone-600 truncate">{rep}</div>
                  <div className="flex items-center justify-between mt-1 text-[10px]">
                    <span className="text-stone-400 truncate max-w-[120px]">{r.analysis.route}</span>
                    <span className={`px-1 py-0.2 rounded text-[9px] font-mono ${
                      recSecStatus === 'Benign' ? 'text-emerald-700 bg-emerald-50' :
                      recSecStatus === 'Malicious — review required' ? 'text-rose-700 bg-rose-50 font-bold' :
                      'text-stone-400'
                    }`}>
                      {recSecStatus === 'Malicious — review required' ? 'Malicious' : recSecStatus}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PANE 2 (CENTER): Transcript & Evidence Viewer */}
        <div className="flex-1 bg-white rounded-xl border border-[#dedcd2] shadow-sm flex flex-col min-h-0 overflow-hidden">
          {/* Header Metadata */}
          <div className="p-4 border-b border-stone-100 bg-stone-50/50 space-y-2 shrink-0">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-ink-900 font-editorial">
                    {activeRecord.record_ref}: {isCall ? (activeRecord.payload?.observed_outcome || 'Call interaction') : activeRecord.payload?.title}
                  </h3>
                </div>
                <div className="text-xs text-stone-500 mt-0.5">
                  {isCall ? `Sales Rep: ${person}` : `Meeting Organizer: ${person}`} • Duration: {activeRecord.payload?.duration_seconds || 0}s • Date: 21 Aug 2026
                </div>
              </div>

              <div className="text-right">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold border ${
                  isCall ? 'bg-blue-50 text-blue-800 border-blue-200' : 'bg-purple-50 text-purple-800 border-purple-200'
                }`}>
                  {isCall ? <Phone className="w-3 h-3" /> : <Video className="w-3 h-3" />}
                  {isCall ? 'Phone Call' : 'Video Conference'}
                </span>
              </div>
            </div>

            {/* Upstream Label notice */}
            {isCall && activeRecord.payload?.observed_outcome && (
              <div className="bg-white p-2 rounded border border-stone-200 text-[11px] text-stone-600 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span>
                  <strong>Upstream Stored Label:</strong> <code className="bg-stone-100 px-1 rounded">{activeRecord.payload.observed_outcome}</code> (Connected: {String(activeRecord.payload.is_connected)}, Conversation: {String(activeRecord.payload.is_conversation)}). Inspect transcript text below to verify actual reality.
                </span>
              </div>
            )}
          </div>

          {/* Active Security Quarantine Alert Banner (Requirement 4) */}
          {secStatus === 'Malicious — review required' && (
            <div className="bg-rose-50 border-b border-rose-200 px-4 py-2.5 shrink-0 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
              <div className="text-xs text-rose-900">
                <span className="font-bold block mb-0.5">
                  PROMPT INJECTION / JAILBREAK QUARANTINE ACTIVE (Score: {((securityState.maxScore || 0) * 100).toFixed(1)}%)
                </span>
                <p className="leading-relaxed text-[11px] text-rose-800">
                  Meta Prompt Guard (86M) detected an injection attack in this conversation. The original transcript is intact, but untrusted text is quarantined from generative AI components. Follow the Safe Review path in the Security tab to audit or unlock.
                </p>
              </div>
            </div>
          )}

          {/* Primary Evidence Citations */}
          {activeRecord.analysis.evidenceQuote && (
            <div className="bg-amber-50/80 border-b border-amber-200 px-4 py-2.5 shrink-0 flex items-start gap-2">
              <Quote className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-amber-900 block mb-0.5">Primary Evidence Citation (Verbatim Quote):</span>
                <p className="text-amber-950 font-mono italic leading-relaxed">
                  &quot;{activeRecord.analysis.evidenceQuote}&quot;
                </p>
              </div>
            </div>
          )}

          {activeRecord.analysis.evidenceTurn && (
            <div className="bg-teal-50/80 border-b border-teal-200 px-4 py-2.5 shrink-0 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-teal-900 block mb-0.5">Primary Evidence Citation (Turn {activeRecord.analysis.evidenceTurn}):</span>
                <p className="text-teal-950 text-xs leading-relaxed">
                  Referenced from turn <strong>#{activeRecord.analysis.evidenceTurn}</strong> in the meeting dialogue below.
                </p>
              </div>
            </div>
          )}

          {/* Transcript Viewer Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-sans">
            {activeRecord.has_transcript ? (
              isCall ? (
                /* Call Transcript */
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-stone-500 pb-2 border-b border-stone-100">
                    <span className="font-semibold">Call Audio Transcript (Raw Stream)</span>
                    <span className="font-mono text-[11px]">
                      {activeRecord.payload?.transcript ? activeRecord.payload.transcript.split('\n').length : 0} paragraphs
                    </span>
                  </div>
                  <div className="space-y-2 text-xs leading-relaxed text-stone-800">
                    {activeRecord.payload?.transcript.split('\n').filter(Boolean).map((line, idx) => {
                      const isRep = line.startsWith('Rep:') || line.startsWith('Agent:');
                      const hasQuoteMatch = activeRecord.analysis.evidenceQuote && line.includes(activeRecord.analysis.evidenceQuote);

                      return (
                        <div
                          key={idx}
                          className={`p-2.5 rounded border transition-colors ${
                            hasQuoteMatch
                              ? 'bg-amber-100/70 border-amber-300 font-medium shadow-sm'
                              : isRep
                              ? 'bg-stone-50/80 border-stone-200/70 ml-2'
                              : 'bg-white border-stone-200 mr-2'
                          }`}
                        >
                          <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-0.5">
                            {isRep ? 'SpendNest Sales Rep' : 'Customer Prospect'}
                          </div>
                          <div className="text-stone-800 font-mono text-[11px] whitespace-pre-wrap">
                            {line}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Meeting Transcript */
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-stone-500 pb-2 border-b border-stone-100">
                    <span className="font-semibold">Meeting Video Turns (Conferencing Log)</span>
                    <span className="font-mono text-[11px]">
                      {activeRecord.transcript_payload?.turns?.length || 0} dialogue turns
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {activeRecord.transcript_payload?.turns?.map(turn => {
                      const isEvidence = activeRecord.analysis.evidenceTurn === turn.turn;
                      const isSpeakerOrganizer = turn.speaker === activeRecord.payload?.organizer_email;

                      return (
                        <div
                          key={turn.turn}
                          id={`turn-${turn.turn}`}
                          className={`p-3 rounded-lg border text-xs transition-all ${
                            isEvidence
                              ? 'bg-teal-50/80 border-teal-300 ring-1 ring-teal-400 shadow-sm'
                              : 'bg-white border-stone-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-[10px] px-1.5 py-0.2 bg-stone-100 text-stone-600 rounded">
                                #{turn.turn}
                              </span>
                              <span className="font-bold text-ink-900">
                                {turn.speaker}
                              </span>
                              <span className="text-[10px] text-stone-400">
                                ({turn.role || (isSpeakerOrganizer ? 'Organizer' : 'Participant')})
                              </span>
                            </div>
                            {isEvidence && (
                              <span className="text-[10px] font-bold text-teal-800 bg-teal-100 px-1.5 py-0.5 rounded">
                                Cited Turn
                              </span>
                            )}
                          </div>
                          <p className="text-stone-700 leading-relaxed font-mono text-[11px]">
                            {turn.text}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
            ) : (
              /* No Transcript State */
              <div className="py-12 text-center space-y-2 text-stone-500">
                <FileText className="w-8 h-8 text-stone-300 mx-auto" />
                <h4 className="text-sm font-bold text-stone-700">No Transcript Text Supplied</h4>
                <p className="text-xs max-w-sm mx-auto text-stone-500 leading-relaxed">
                  Per DATA_CONTRACT.md, this record arrived without transcript text (e.g. voicemail, unconnected outreach, or unrecorded meeting).
                </p>
                <div className="text-[11px] text-stone-400">
                  Intake status preserved; speculative sales analysis is deliberately omitted.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PANE 3 (RIGHT): Evidence-Backed Analysis & Prompt Guard Security Hub */}
        <div className="w-full md:w-84 bg-white rounded-xl border border-[#dedcd2] shadow-sm flex flex-col shrink-0 min-h-0 overflow-hidden">
          {/* Dual Tab Switcher */}
          <div className="flex border-b border-stone-200 bg-stone-50 shrink-0">
            <button
              onClick={() => setActiveTabRight('route')}
              className={`flex-1 py-2.5 text-xs font-semibold text-center border-b-2 transition-colors ${
                activeTabRight === 'route'
                  ? 'border-teal-700 text-teal-900 bg-white font-bold'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              RevOps Routing
            </button>
            <button
              onClick={() => setActiveTabRight('security')}
              className={`flex-1 py-2.5 text-xs font-semibold text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
                activeTabRight === 'security'
                  ? 'border-teal-700 text-teal-900 bg-white font-bold'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
              <span>Prompt Guard</span>
              {secStatus === 'Malicious — review required' && (
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
              )}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeTabRight === 'route' ? (
              /* TAB 1: REVOPS ROUTING & HUMAN OVERRIDE */
              <>
                <div className="pb-3 border-b border-stone-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">
                    Analytical Profile
                  </h4>
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded text-xs font-bold border ${ROUTE_COLORS[activeRecord.analysis.route]}`}>
                      {activeRecord.analysis.route}
                    </span>
                    {activeRecord.analysis.isManualOverride ? (
                      <span className="text-[10px] font-bold text-purple-800 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                        Manual Override
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-stone-500">
                        Confidence: {activeRecord.analysis.confidence}
                      </span>
                    )}
                  </div>
                </div>

                {/* Rationale */}
                <div className="space-y-1 text-xs">
                  <span className="font-semibold text-stone-700">Manager Rationale:</span>
                  <p className="text-stone-600 leading-relaxed bg-stone-50 p-2.5 rounded border border-stone-200">
                    {activeRecord.analysis.rationale}
                  </p>
                </div>

                {/* Next Action & Owner */}
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-semibold text-stone-700 block mb-0.5">Prescribed Next Action:</span>
                    <p className="text-stone-600 leading-relaxed bg-stone-50 p-2 rounded border border-stone-200">
                      {activeRecord.analysis.nextAction || 'None required'}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-stone-700 block mb-0.5">Action Owner:</span>
                    <div className="font-medium text-ink-900 bg-stone-50 p-2 rounded border border-stone-200">
                      {activeRecord.analysis.owner || 'Unassigned / Unknown'}
                    </div>
                  </div>
                </div>

                {/* Manual Route Correction Control (Preserves Requirement 8 & Contract) */}
                <div className="pt-3 border-t border-stone-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-ink-900">Manual Route Override</h5>
                    {activeRecord.analysis.isManualOverride && (
                      <button
                        onClick={handleReset}
                        className="text-[10px] text-stone-500 hover:text-stone-800 underline flex items-center gap-0.5"
                      >
                        <RotateCcw className="w-2.5 h-2.5" /> Reset to Auto
                      </button>
                    )}
                  </div>

                  <select
                    value={selectedRoute}
                    onChange={e => setSelectedRoute(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded px-2.5 py-1.5 text-xs text-stone-800 font-medium focus:outline-none"
                  >
                    <option value={ROUTE_CATEGORIES.SALES_COACHING}>Sales Coaching</option>
                    <option value={ROUTE_CATEGORIES.DEAL_NEXT_STEP}>Deal Next Step</option>
                    <option value={ROUTE_CATEGORIES.CUSTOMER_SUPPORT_BUG}>Customer Support Bug</option>
                    <option value={ROUTE_CATEGORIES.INTERNAL_VENDOR_NOTE}>Internal / Vendor Note</option>
                    <option value="Review Required">Review Required</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Override justification note..."
                    value={reviewerNotes}
                    onChange={e => setReviewerNotes(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none"
                  />

                  <button
                    onClick={handleSaveOverride}
                    className="w-full bg-[#18181b] hover:bg-stone-800 text-white font-medium text-xs py-1.5 rounded transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Manual Decision</span>
                  </button>

                  {saveFeedback && (
                    <div className="text-[11px] bg-teal-50 text-teal-800 border border-teal-200 p-2 rounded flex items-center gap-1">
                      <Check className="w-3 h-3 text-teal-700" />
                      <span>Override saved & preserved!</span>
                    </div>
                  )}
                </div>

                {/* Triage / Review State Toggle */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-stone-500">Triage State:</span>
                  {activeRecord.analysis.reviewStatus === 'pending_review' ? (
                    <button
                      onClick={() => onSetReviewStatus(activeRecord.source_type, activeRecord.source_id, 'reviewed')}
                      className="text-[11px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded border border-amber-300 transition"
                    >
                      Mark as Reviewed
                    </button>
                  ) : (
                    <button
                      onClick={() => onSetReviewStatus(activeRecord.source_type, activeRecord.source_id, 'pending_review')}
                      className="text-[11px] font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 px-2 py-0.5 rounded border border-teal-300 transition"
                    >
                      Reviewed ✓
                    </button>
                  )}
                </div>
              </>
            ) : (
              /* TAB 2: META PROMPT GUARD 2 (86M) SECURITY HUB */
              <div className="space-y-4">
                {/* Status Card */}
                <div className="bg-stone-50 rounded-lg p-3 border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      Prompt Guard Status
                    </span>
                    <span className="text-[10px] font-mono text-stone-500">
                      512-Token Context Limit
                    </span>
                  </div>

                  <div className={`p-2.5 rounded-md border flex items-center gap-2 ${secBadge.className}`}>
                    <SecBadgeIcon className="w-4 h-4 shrink-0" />
                    <div>
                      <div className="text-xs font-bold leading-tight">{secBadge.label}</div>
                      <div className="text-[10px] opacity-80">
                        Model: <code>meta-llama/llama-prompt-guard-2-86m</code>
                      </div>
                    </div>
                  </div>

                  {securityState.scannedAt && (
                    <div className="text-[10px] text-stone-500 flex justify-between">
                      <span>Scanned: {new Date(securityState.scannedAt).toLocaleTimeString()}</span>
                      <span>Max Score: {((securityState.maxScore || 0) * 100).toFixed(2)}%</span>
                    </div>
                  )}

                  {securityState.totalSegments > 0 && (
                    <div className="text-[10px] text-stone-600 bg-white p-2 rounded border border-stone-200">
                      <strong>Coverage:</strong> Scanned {securityState.scannedSegments} of {securityState.totalSegments} segments ({securityState.scanCompleted ? 'Completed' : 'Partial'}).
                    </div>
                  )}
                </div>

                {/* Primary Scan Actions */}
                {activeRecord.has_transcript ? (
                  <div className="space-y-2.5">
                    <button
                      onClick={handleTriggerRealScan}
                      disabled={isScanning}
                      className="w-full bg-teal-800 hover:bg-teal-900 disabled:opacity-50 text-white font-medium text-xs py-2 rounded-md transition flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                      <span>{isScanning ? 'Scanning via Server...' : 'Run Prompt Guard Scan'}</span>
                    </button>

                    {/* Simulation Sandbox for Injection Vector Testing */}
                    <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                        <span className="flex items-center gap-1">
                          <Lock className="w-3 h-3 text-amber-700" />
                          <span>Injection Test Sandbox</span>
                        </span>
                        <span className="text-[10px] text-stone-400 font-normal">Quarantine Demo</span>
                      </div>

                      <p className="text-[11px] text-stone-600 leading-relaxed">
                        Test how Prompt Guard detects and quarantines attacks without corrupting original source data:
                      </p>

                      <select
                        value={selectedVectorId}
                        onChange={e => setSelectedVectorId(e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-xs text-stone-800"
                      >
                        {INJECTION_TEST_VECTORS.map(v => (
                          <option key={v.id} value={v.id}>{v.name}</option>
                        ))}
                      </select>

                      <button
                        onClick={handleTriggerSimulatedInjection}
                        disabled={isScanning}
                        className="w-full bg-rose-700 hover:bg-rose-800 disabled:opacity-50 text-white font-medium text-xs py-1.5 rounded transition flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Simulate Injection Vector</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-stone-500 bg-stone-50 p-3 rounded border border-stone-200">
                    No transcript text supplied for this record. Security scanning is not applicable.
                  </div>
                )}

                {/* Scanned Segments Drawer */}
                {securityState.segments && securityState.segments.length > 0 && (
                  <div className="space-y-1.5">
                    <h5 className="text-xs font-bold text-ink-900">
                      Scanned Segments ({securityState.segments.length})
                    </h5>
                    <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                      {securityState.segments.map(seg => (
                        <div
                          key={seg.segmentIndex}
                          className={`p-2 rounded border text-[11px] ${
                            seg.isMalicious
                              ? 'bg-rose-50 border-rose-300 text-rose-900 font-medium'
                              : 'bg-stone-50 border-stone-200 text-stone-700'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-0.5">
                            <span className="font-bold">Segment #{seg.segmentIndex}</span>
                            <span className="font-mono text-[10px]">
                              Risk: {(seg.score * 100).toFixed(1)}% {seg.isMalicious ? '🚨 Malicious' : '✓ Safe'}
                            </span>
                          </div>
                          <div className="text-[10px] text-stone-500 line-clamp-1 italic">
                            &quot;{seg.textSnippet}&quot;
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Safe Review Path Form (Requirement 4) */}
                {(secStatus === 'Malicious — review required' || secStatus === 'Scan unavailable') && (
                  <div className="p-3 bg-amber-50/80 rounded-lg border border-amber-300 space-y-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                      <Unlock className="w-3.5 h-3.5 text-amber-800" />
                      <span>Documented Safe Review Path</span>
                    </div>

                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      Explicit manager authorization required before untrusted text may be passed to downstream AI:
                    </p>

                    <div>
                      <label className="text-[10px] font-bold text-stone-600 block mb-0.5">Reviewer Name:</label>
                      <input
                        type="text"
                        value={safeReviewerName}
                        onChange={e => setSafeReviewerName(e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded px-2 py-1 text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-stone-600 block mb-0.5">Audit Note:</label>
                      <input
                        type="text"
                        placeholder="e.g. False positive; technical discussion of SQL injection"
                        value={safeReviewNotes}
                        onChange={e => setSafeReviewNotes(e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded px-2 py-1 text-xs"
                      />
                    </div>

                    <div className="flex gap-2 text-xs">
                      <label className="flex items-center gap-1 text-[11px] text-stone-700 cursor-pointer">
                        <input
                          type="radio"
                          name="safeReviewChoice"
                          value="authorize"
                          checked={safeReviewChoice === 'authorize'}
                          onChange={() => setSafeReviewChoice('authorize')}
                        />
                        <span>Authorize Safe AI Processing</span>
                      </label>
                      <label className="flex items-center gap-1 text-[11px] text-stone-700 cursor-pointer">
                        <input
                          type="radio"
                          name="safeReviewChoice"
                          value="quarantine"
                          checked={safeReviewChoice === 'quarantine'}
                          onChange={() => setSafeReviewChoice('quarantine')}
                        />
                        <span>Maintain Quarantine</span>
                      </label>
                    </div>

                    <button
                      onClick={handleSubmitSafeReview}
                      className="w-full bg-amber-800 hover:bg-amber-900 text-white font-medium text-xs py-1.5 rounded transition shadow-sm"
                    >
                      Record Safe Review Verdict
                    </button>

                    {safeReviewFeedback && (
                      <div className="text-[11px] bg-white text-teal-800 border border-teal-200 p-2 rounded flex items-center gap-1">
                        <Check className="w-3 h-3 text-teal-700" />
                        <span>Safe review verdict recorded!</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Pre-Execution Generative AI Gate Verification */}
                <div className="pt-2 border-t border-stone-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-ink-900">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                      <span>Generative AI Security Gate</span>
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      aiGate.allowed ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                    }`}>
                      {aiGate.allowed ? 'GATE: OPEN' : 'GATE: BLOCKED'}
                    </span>
                  </div>

                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    Verify that untrusted text cannot reach the generative model while quarantined:
                  </p>

                  <button
                    onClick={handleTestGenerativeAi}
                    disabled={aiIsRunning}
                    className={`w-full py-2 rounded text-xs font-medium transition flex items-center justify-center gap-1.5 ${
                      aiGate.allowed
                        ? 'bg-teal-700 hover:bg-teal-800 text-white'
                        : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                    }`}
                  >
                    <Play className="w-3 h-3" />
                    <span>{aiIsRunning ? 'Testing Gate...' : 'Execute Generative Briefing'}</span>
                  </button>

                  {/* Blocked Gate Warning */}
                  {aiTestError && (
                    <div className="bg-rose-50 border border-rose-300 p-2.5 rounded text-xs text-rose-900 space-y-1">
                      <div className="font-bold flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-700" />
                        <span>Execution Blocked by Gate</span>
                      </div>
                      <p className="text-[11px] text-rose-800 leading-relaxed">
                        {aiTestError}
                      </p>
                    </div>
                  )}

                  {/* Allowed Gate Execution Output */}
                  {aiTestResult && (
                    <div className="bg-emerald-50 border border-emerald-300 p-2.5 rounded text-xs text-emerald-950 space-y-1">
                      <div className="font-bold flex items-center gap-1 text-emerald-900">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Gate Passed: Structured AI Briefing</span>
                      </div>
                      <div className="text-[11px] bg-white p-2 rounded border border-emerald-200 text-stone-800 space-y-1">
                        <div className="font-bold text-ink-900">{aiTestResult.briefing.headline}</div>
                        <div className="text-stone-600">{aiTestResult.briefing.summary}</div>
                        <div className="text-[10px] text-stone-400 font-mono">
                          Clearance: {aiTestResult.briefing.securityClearance}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
