import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Insights from './components/Insights';
import Inbox from './components/Inbox';
import ConversationDetail from './components/ConversationDetail';
import ReviewQueue from './components/ReviewQueue';
import ManagerBrief from './components/ManagerBrief';
import ExportCenter from './components/ExportCenter';
import ReplayConsole from './components/ReplayConsole';

import { dataStore } from './services/dataService';
import { ROUTE_CATEGORIES } from './services/routingTaxonomy';
import { requestPromptGuardScan } from './services/securityService';

import initialBatch from '../data/01_initial.json';
import updateBatch from '../data/02_update.json';

export default function App() {
  const [records, setRecords] = useState([]);
  const [recentChanges, setRecentChanges] = useState([]);
  const [metrics, setMetrics] = useState({
    totalRecords: 0,
    calls: 0,
    meetings: 0,
    transcripts: 0,
    transcriptCoveragePercent: 0,
    manualOverrides: 0,
    pendingReview: 0,
    reviewed: 0,
    repActivity: {},
    routeDistribution: {},
  });
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [selectedRecordId, setSelectedRecordId] = useState(null); // { type, id }

  const syncState = useCallback(() => {
    const all = dataStore.getAllRecords();
    setRecords(all);
    setMetrics(dataStore.getMetrics());
    setRecentChanges(dataStore.getRecentChanges());
  }, []);

  // Initialize store: if empty, load both batches so app opens in final state by default!
  useEffect(() => {
    if (dataStore.getRecordCount() === 0) {
      dataStore.ingestBatch(initialBatch);
      dataStore.ingestBatch(updateBatch);
    }
    syncState();
  }, [syncState]);

  // Record selection handler
  const handleSelectRecord = (sourceType, sourceId) => {
    setSelectedRecordId({ type: sourceType, id: sourceId });
    setCurrentTab('detail');
  };

  // Route override handler
  const handleSetManualRoute = (sourceType, sourceId, route, notes) => {
    dataStore.setManualRoute(sourceType, sourceId, route, notes);
    syncState();
  };

  // Reset override handler
  const handleResetManualRoute = (sourceType, sourceId) => {
    dataStore.resetManualRoute(sourceType, sourceId);
    syncState();
  };

  // Review status handler
  const handleSetReviewStatus = (sourceType, sourceId, status) => {
    dataStore.setReviewStatus(sourceType, sourceId, status);
    syncState();
  };

  // Prompt Guard Security Scan handler (Requirement 1 & 10)
  const handleSecurityScan = async (sourceType, sourceId, simulatedVectorText = null) => {
    const rec = dataStore.getRecord(sourceType, sourceId);
    if (!rec) return null;
    const scanResult = await requestPromptGuardScan(rec, simulatedVectorText);
    dataStore.setSecurityScanResult(sourceType, sourceId, scanResult);
    syncState();
    return scanResult;
  };

  // Safe Review Authorization handler (Requirement 4)
  const handleSafeReviewAuthorization = (sourceType, sourceId, safeReviewData) => {
    dataStore.setSafeReviewAuthorization(sourceType, sourceId, safeReviewData);
    syncState();
  };

  // Quick Demo Load (imports both batches)
  const handleQuickDemoLoad = () => {
    dataStore.clear();
    dataStore.ingestBatch(initialBatch);
    dataStore.ingestBatch(updateBatch);
    syncState();
    setSelectedRecordId(null);
  };

  // Load Initial Batch Only (pre-update state)
  const handleLoadInitialOnly = () => {
    dataStore.clear();
    dataStore.ingestBatch(initialBatch);
    syncState();
    setSelectedRecordId(null);
  };

  // Clean Reset
  const handleReset = () => {
    if (window.confirm('Reset all records to a clean empty state? You can reload the demo anytime.')) {
      dataStore.clear();
      syncState();
      setSelectedRecordId(null);
    }
  };

  // Replay Console Specific Test Functions
  const handleRunCleanReset = () => {
    dataStore.clear();
    syncState();
  };

  const handleRunInitialImport = () => {
    const res = dataStore.ingestBatch(initialBatch);
    syncState();
    return res;
  };

  const handleRunDuplicateImport = () => {
    const res = dataStore.ingestBatch(initialBatch);
    syncState();
    return res;
  };

  const handleRunManualOverrideM07 = () => {
    const m07Id = '4f304fff-fd40-5cfc-a366-0a134c445c2a';
    const rec = dataStore.setManualRoute(
      'meeting',
      m07Id,
      ROUTE_CATEGORIES.CUSTOMER_SUPPORT_BUG,
      'Replay test manual override before update'
    );
    syncState();
    return rec;
  };

  const handleRunUpdateImport = () => {
    const res = dataStore.ingestBatch(updateBatch);
    syncState();
    return res;
  };

  const handleRunRepeatUpdate = () => {
    const res = dataStore.ingestBatch(updateBatch);
    syncState();
    return res;
  };

  // Current active record for Detail view
  const currentRecord = selectedRecordId
    ? dataStore.getRecord(selectedRecordId.type, selectedRecordId.id)
    : (records.find(r => r.source_id === '4f304fff-fd40-5cfc-a366-0a134c445c2a') || records[0] || null);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f5] font-sans text-ink-900 antialiased selection:bg-teal-100 selection:text-teal-900">
      {/* Global Application Header */}
      <Header
        metrics={metrics}
        onQuickDemoLoad={handleQuickDemoLoad}
        onLoadInitialOnly={handleLoadInitialOnly}
        onReset={handleReset}
      />

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Navigation Sidebar */}
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          pendingReviewCount={metrics.pendingReview}
          manualOverrideCount={metrics.manualOverrides}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl">
          {currentTab === 'dashboard' && (
            <Dashboard
              records={records}
              metrics={metrics}
              recentChanges={recentChanges}
              onSelectRecord={handleSelectRecord}
              onNavigateTab={setCurrentTab}
              onSetReviewStatus={handleSetReviewStatus}
            />
          )}

          {currentTab === 'insights' && (
            <Insights
              records={records}
              metrics={metrics}
              onSelectRecord={handleSelectRecord}
            />
          )}

          {currentTab === 'detail' && (
            <ConversationDetail
              record={currentRecord}
              allRecords={records}
              onSelectRecord={handleSelectRecord}
              onSetManualRoute={handleSetManualRoute}
              onResetManualRoute={handleResetManualRoute}
              onSetReviewStatus={handleSetReviewStatus}
              onSecurityScan={handleSecurityScan}
              onSafeReviewAuthorization={handleSafeReviewAuthorization}
            />
          )}

          {currentTab === 'inbox' && (
            <Inbox
              records={records}
              onSelectRecord={handleSelectRecord}
            />
          )}

          {currentTab === 'review' && (
            <ReviewQueue
              records={records}
              onSelectRecord={handleSelectRecord}
              onSetReviewStatus={handleSetReviewStatus}
            />
          )}

          {currentTab === 'brief' && (
            <ManagerBrief
              onSelectRecord={handleSelectRecord}
            />
          )}

          {currentTab === 'export' && (
            <ExportCenter
              records={records}
            />
          )}

          {currentTab === 'replay' && (
            <ReplayConsole
              records={records}
              metrics={metrics}
              onRunCleanReset={handleRunCleanReset}
              onRunInitialImport={handleRunInitialImport}
              onRunDuplicateImport={handleRunDuplicateImport}
              onRunManualOverrideM07={handleRunManualOverrideM07}
              onRunUpdateImport={handleRunUpdateImport}
              onRunRepeatUpdate={handleRunRepeatUpdate}
            />
          )}
        </main>
      </div>
    </div>
  );
}
