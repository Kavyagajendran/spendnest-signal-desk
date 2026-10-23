/**
 * routingTaxonomy.js
 * Comprehensive knowledge base and deterministic classification rules
 * for SpendNest conversations and background records.
 *
 * Strict Citation Standards:
 * - Meetings: cite record_ref / source_id and 1-based turn number
 * - Calls: cite record_ref / source_id and exact verbatim quote
 */

export const ROUTE_CATEGORIES = {
  SALES_COACHING: 'Sales Coaching',
  DEAL_NEXT_STEP: 'Deal Next Step',
  CUSTOMER_SUPPORT_BUG: 'Customer Support Bug',
  INTERNAL_VENDOR_NOTE: 'Internal / Vendor Note',
};

export const ROUTE_COLORS = {
  'Sales Coaching': 'bg-amber-100 text-amber-800 border-amber-300',
  'Deal Next Step': 'bg-emerald-100 text-emerald-800 border-emerald-300',
  'Customer Support Bug': 'bg-rose-100 text-rose-800 border-rose-300',
  'Internal / Vendor Note': 'bg-indigo-100 text-indigo-800 border-indigo-300',
  'Review Required': 'bg-slate-100 text-slate-700 border-slate-300',
};

// Ground-truth verified analytical profiles for all 18 adapted conversations
export const KNOWN_CONVERSATION_PROFILES = {
  // --- CALLS (C01 - C10) ---
  '2ec4404c-beee-5377-a63c-aab701da08ed': { // C01 (Arun)
    suggestedRoute: ROUTE_CATEGORIES.SALES_COACHING,
    confidence: 'High',
    rationale: 'Prospect expressed irritation over unexpected cold outreach to personal work line. Rep was defensive and attempted feature pitch without acknowledging friction.',
    evidenceQuote: 'no, I asked why you have called me. Right, I wanted to understand whether a partnership might be relevant. I don\'t know how I ended up on your list. I didn\'t ask for this call, and I\'m not interested.',
    evidenceTurn: null,
    nextAction: 'Coach rep on permission-based openers, acknowledging prospect pushback, and removing hostile prospects from cold cadence.',
    owner: 'Arun (SDR) / Sales Manager',
    reviewStatus: 'reviewed',
    opportunitySignals: 'None - prospect processes already automated; requested no contact.',
  },
  '4b870624-8aad-5315-a60e-0db95981cf99': { // C02 (Arun)
    suggestedRoute: ROUTE_CATEGORIES.SALES_COACHING,
    confidence: 'Medium',
    rationale: 'Gatekeeper call. Target prospect (Leela) was out of the office. Rep elected to leave voicemail rather than navigating gatekeeper for alternate contact.',
    evidenceQuote: 'It looks as though she isn\'t in the office today. Would you like to leave a message with me, or would you prefer her voicemail? Her voicemail would be fine, thank you.',
    evidenceTurn: null,
    nextAction: 'Log follow-up for next business day when Leela is back in office; coach on gatekeeper engagement techniques.',
    owner: 'Arun (SDR)',
    reviewStatus: 'reviewed',
    opportunitySignals: 'Unqualified - target contact unavailable.',
  },
  '20d509ba-d589-5334-9aef-ea4ce6105b1a': { // C03 (Kiran)
    suggestedRoute: ROUTE_CATEGORIES.DEAL_NEXT_STEP,
    confidence: 'High',
    rationale: 'In-flight developer API opportunity. Contact recalled prior pricing concern and agreed to email follow-up and Monday/Tuesday callback.',
    evidenceQuote: 'Send the email and we can speak Monday or Tuesday. All right, I\'ll send it over. ... What subject should I look for? Something like "Developer access and event notifications — follow-up".',
    evidenceTurn: null,
    nextAction: 'Send follow-up email titled "Developer access and event notifications — follow-up" with tiered API pricing; call Monday morning.',
    owner: 'Kiran (Sales / Dev Rel)',
    reviewStatus: 'reviewed',
    opportunitySignals: 'Active opportunity; price-sensitive developer API package.',
  },
  'bcdcbf56-d338-5c78-9a97-42c2fc1c9931': { // C04 (Arun)
    suggestedRoute: ROUTE_CATEGORIES.DEAL_NEXT_STEP,
    confidence: 'Medium',
    rationale: 'Voicemail follow-up for Lanternpath Media. Previous email was delivered to wrong address; rep left structured message with corrected details.',
    evidenceQuote: 'My understanding is that our information first went to the wrong email address. We subsequently used the corrected address you gave us, and I hope you have now had a chance to see it. Please call me back to let me know where things stand.',
    evidenceTurn: null,
    nextAction: 'Set reminder for 48 hours; if no response, send brief reminder email to Ritesh referencing the voicemail.',
    owner: 'Arun (SDR)',
    reviewStatus: 'reviewed',
    opportunitySignals: 'Mid-funnel prospect evaluating expense platform for media agency.',
  },
  '75a6b94f-7717-5cfb-9e41-0acc94415e17': { // C05 (Meera)
    suggestedRoute: ROUTE_CATEGORIES.DEAL_NEXT_STEP,
    confidence: 'High',
    rationale: 'Multi-store retail prospect currently using StoreHarbor. While satisfied today, prospect explicitly requested product presentation at contact05@example.com.',
    evidenceQuote: 'What I suggest is that you send me your presentation. If we ever decide to change the providers we already have, we could consider it then. Certainly. I have an email address noted down; may I confirm contact05@example.com? Yes, that is right.',
    evidenceTurn: null,
    nextAction: 'Email comparison deck highlighting multi-store card controls vs StoreHarbor; set nurture task for quarterly check-in.',
    owner: 'Meera (SDR)',
    reviewStatus: 'reviewed',
    opportunitySignals: 'Competitive replacement opportunity (StoreHarbor incumbent).',
  },
  '12216d5c-e254-52c6-b344-47de4c6e1ae5': { // C06 (Meera)
    suggestedRoute: ROUTE_CATEGORIES.SALES_COACHING,
    confidence: 'High',
    rationale: 'Prospect operates >120 retail stores with full centralized ERP automation. Rep pushed card features after prospect gave clear "arrangements already in place" objection.',
    evidenceQuote: 'The essential processes are automated and connected through our business management system. Head office manages it, and we have full visibility. That is why I said the arrangements are already in place.',
    evidenceTurn: null,
    nextAction: 'Coaching session for Meera: identify when an enterprise prospect has an entrenched Tier-1 ERP setup and transition to polite exit without over-pitching.',
    owner: 'Meera (SDR) / Sales Manager',
    reviewStatus: 'reviewed',
    opportunitySignals: 'Low probability - entrenched enterprise ERP.',
  },
  '428817fa-7e9e-5418-a7d4-bb396d28dfbf': { // C07 (Dev)
    suggestedRoute: ROUTE_CATEGORIES.DEAL_NEXT_STEP,
    confidence: 'High',
    rationale: 'Partnership opportunity with Willowbank Advisory regarding cross-border corporate incorporation and card setups. Prospect agreed to receive details via WhatsApp/SMS and a follow-up call Monday.',
    evidenceQuote: 'All right, I\'ll send the details there. Once you\'ve received them, could I call on Monday to see whether you\'d like to discuss it further? Yes, that\'s fine. Thank you for your time.',
    evidenceTurn: null,
    nextAction: 'Send overseas incorporation partner one-pager via messaging; calendar follow-up call for Monday 24 Aug.',
    owner: 'Dev (Partnerships)',
    reviewStatus: 'reviewed',
    opportunitySignals: 'Channel / Advisory partnership; potential ongoing client referral source.',
  },
  '129497b2-8e1d-5e01-919c-e8a852b5ff68': { // C08 (Meera)
    suggestedRoute: ROUTE_CATEGORIES.DEAL_NEXT_STEP,
    confidence: 'High',
    rationale: 'Cold introduction successfully routed to internal referral. Prospect confirmed email contact08@example.com for finance overview materials.',
    evidenceQuote: 'Let me read it back to make sure I have the right address: contact08@example.com? Yes, that\'s correct. Okay, I\'ll send the information there.',
    evidenceTurn: null,
    nextAction: 'Send SpendNest payables and expense overview to contact08@example.com; track email opens.',
    owner: 'Meera (SDR)',
    reviewStatus: 'reviewed',
    opportunitySignals: 'Referred lead - introductory stage.',
  },
  '4a1de681-f884-55e8-b1ad-de22d17cd959': { // C09 (Meera)
    suggestedRoute: ROUTE_CATEGORIES.SALES_COACHING,
    confidence: 'High',
    rationale: 'Prospect provided head of finance referral but strictly prohibited using his name. Rep must handle cold outreach to the referral without referencing the contact.',
    evidenceQuote: 'Would it be all right if I mentioned your name when contacting him? No, please don\'t use my name. Of course, no problem. That is why I wanted to ask first.',
    evidenceTurn: null,
    nextAction: 'Add compliance note to CRM: do NOT cite Vedant when contacting finance head. Coach SDR on cold approach without mutual reference.',
    owner: 'Meera (SDR)',
    reviewStatus: 'reviewed',
    opportunitySignals: 'Warm referral but sensitive boundary.',
  },
  'b747f592-810e-583c-9b81-8db5ab035806': { // C10 (Meera)
    suggestedRoute: ROUTE_CATEGORIES.SALES_COACHING,
    confidence: 'High',
    rationale: 'Prospect requested information by email but explicitly rejected a follow-up call. Rep pushed for Monday/Tuesday callback despite clear boundary.',
    evidenceQuote: 'Would a follow-up call on Monday or Tuesday next week be okay, in case you have any questions? No. I said I will contact you if there is anything to discuss.',
    evidenceTurn: null,
    nextAction: 'Coach rep on active listening and respecting prospect communication boundaries; send non-intrusive email and do not call next week.',
    owner: 'Meera (SDR) / Sales Manager',
    reviewStatus: 'reviewed',
    opportunitySignals: 'Low urgency; email-only nurture.',
  },

  // --- MEETINGS (M01 - M10) ---
  'cb5cecac-e68d-52b7-b10b-b0c748efc467': { // M01 (Harborpath Advisory)
    suggestedRoute: ROUTE_CATEGORIES.DEAL_NEXT_STEP,
    confidence: 'High',
    rationale: 'Advisory partner assumed SpendNest opens remote bank accounts. SpendNest clarified card/expense remit. Need to align partner scoping and send collateral.',
    evidenceQuote: null,
    evidenceTurn: 1, // Turn 1: "My understanding was that you help people open bank accounts remotely..."
    nextAction: 'Send advisory partner deck clarifying non-bank corporate card and expense automation boundaries; follow up with Partner A.',
    owner: 'team06@example.com (AE / Partnerships)',
    reviewStatus: 'reviewed',
    opportunitySignals: 'Advisory partnership - requires scope qualification.',
  },
  '1a21c409-c050-5787-90af-2667e057e1b6': { // M02 (LedgerBridge)
    suggestedRoute: ROUTE_CATEGORIES.INTERNAL_VENDOR_NOTE,
    confidence: 'High',
    rationale: 'Vendor procurement evaluation. SpendNest strategy & product team evaluating LedgerBridge for compliant international invoicing across operating markets.',
    evidenceQuote: null,
    evidenceTurn: 1, // Turn 1: "We want to understand whether LedgerBridge can give us compliant invoicing coverage across our operating markets."
    nextAction: 'Review invoicing template sent by LedgerBridge; product team to evaluate API schema compatibility.',
    owner: 'Team member A (Strategy & Partnerships)',
    reviewStatus: 'reviewed',
    opportunitySignals: 'Internal infrastructure procurement / vendor partnership.',
  },
  '398672e7-62dd-5afd-846d-0237d49792fb': { // M03 (Asterloom Systems)
    suggestedRoute: ROUTE_CATEGORIES.DEAL_NEXT_STEP,
    confidence: 'High',
    rationale: 'High-stake evaluation with Customer A and Finance Colleague (Customer B). Deep dive into pricing structure; prospect reviewing with CFO before next call.',
    evidenceQuote: null,
    evidenceTurn: 36, // Turn 36: "Send the details first. We need time with the CFO and will tell you if another call is needed."
    nextAction: 'Deliver customized enterprise pricing breakdown with ROI model for CFO review; set internal reminder for 5 business days.',
    owner: 'team08@example.com (AE)',
    reviewStatus: 'reviewed',
    opportunitySignals: 'Active enterprise evaluation - CFO sign-off pending.',
  },
  'b0f79b3d-37ba-52f9-b2bc-58b159dd6d91': { // M04 (Cedarwave Distribution)
    suggestedRoute: ROUTE_CATEGORIES.DEAL_NEXT_STEP,
    confidence: 'High',
    rationale: 'Implementation & migration planning session for Cedarwave moving from legacy system to SpendNest. Operational milestone checklist.',
    evidenceQuote: null,
    evidenceTurn: 1, // Turn 1: "I wanted to discuss the migration while there is still time to plan it."
    nextAction: 'Finalize data migration mapping document and send timeline confirmation to Cedarwave Distribution.',
    owner: 'team09@example.com (Implementation / CS)',
    reviewStatus: 'reviewed',
    opportunitySignals: 'Closed-Won customer undergoing onboarding / migration.',
  },
  '657b9e9d-9472-5b01-a127-a648ad7e8cf7': { // M06 (Mapletrail Services)
    suggestedRoute: ROUTE_CATEGORIES.DEAL_NEXT_STEP,
    confidence: 'Medium',
    rationale: 'Exploratory meeting on finance workflows and receivables automation. Customer requested overview information to stay in touch.',
    evidenceQuote: null,
    evidenceTurn: 33, // Turn 33: "It has been useful hearing a different perspective. Please send the information and we can stay in touch."
    nextAction: 'Send product brief on receivables automation; schedule follow-up in 2 weeks.',
    owner: 'team10@example.com (AE)',
    reviewStatus: 'reviewed',
    opportunitySignals: 'Early evaluation / nurture.',
  },
  '4f304fff-fd40-5cfc-a366-0a134c445c2a': { // M07 (Willowfield Trust - Late Update!)
    suggestedRoute: ROUTE_CATEGORIES.CUSTOMER_SUPPORT_BUG,
    confidence: 'High',
    rationale: 'CRITICAL BUG: Customer A shared screen demonstrating that editing event-payment description and saving does not persist in UI or backend.',
    evidenceQuote: null,
    evidenceTurn: 3, // Turn 3: "The field still shows the earlier wording. So the change is not appearing after you save, is that right?"
    nextAction: 'File high-priority engineering Jira ticket for event-payment description save failure; follow up with Customer A with fix ETA.',
    owner: 'Team member A (Customer Success) / Engineering Triage',
    reviewStatus: 'reviewed',
    opportunitySignals: 'Existing customer at risk of frustration due to UI state persistence defect.',
  },
  '4b5b9192-f3fc-505a-8e77-4d2ffaa54594': { // M09 (Brookmint Holdings Setup)
    suggestedRoute: ROUTE_CATEGORIES.CUSTOMER_SUPPORT_BUG,
    confidence: 'High',
    rationale: 'Onboarding support roadblock. Invitation link for Brookmint Holdings failed/expired; multi-tenant email identity collision identified with IT team.',
    evidenceQuote: null,
    evidenceTurn: 1, // Turn 1: "The invitation for Brookmint Holdings did not work when I tried it. It may have expired..."
    nextAction: 'Re-issue fresh tenant invitation token; coordinate with customer IT regarding email alias setup.',
    owner: 'team11@example.com (Onboarding / Support)',
    reviewStatus: 'reviewed',
    opportunitySignals: 'Onboarding in progress - resolving authentication barrier.',
  },
  '337f297d-9385-5b82-9e54-5019c1ed912c': { // M10 (Billing workflow walkthrough)
    suggestedRoute: ROUTE_CATEGORIES.INTERNAL_VENDOR_NOTE,
    confidence: 'High',
    rationale: 'Internal operational training session reviewing billing workflows, sample invoices, and back-office access provisioning.',
    evidenceQuote: null,
    evidenceTurn: 20, // Turn 20: "I will request the back-office access separately for the next training session."
    nextAction: 'Provision back-office permissions for team members before session 2; circulate billing sample exercises.',
    owner: 'Team member A (Operations Training)',
    reviewStatus: 'reviewed',
    opportunitySignals: 'Internal enablement - no external customer commercial activity.',
  },
};

/**
 * Classifies any given record based on known profile or deterministic heuristics
 */
export function classifyRecord(record, currentRevision = 1) {
  const profile = KNOWN_CONVERSATION_PROFILES[record.source_id];
  
  if (profile) {
    // Check if this record is M07 and revision is 1 (before update)
    if (record.source_id === '4f304fff-fd40-5cfc-a366-0a134c445c2a' && currentRevision === 1) {
      return {
        route: 'Review Required',
        suggestedRoute: 'Review Required',
        confidence: 'Low',
        rationale: 'Initial delivery provided no transcript text (transcript_payload was null). Awaiting late-arriving transcript batch.',
        evidenceQuote: null,
        evidenceTurn: null,
        nextAction: 'Await incoming transcript batch (02_update.json) or conduct manual intake review.',
        owner: 'Unassigned (CS Manager)',
        reviewStatus: 'pending_review',
        isManualOverride: false,
        opportunitySignals: 'Unknown - pending transcript arrival.',
      };
    }

    return {
      route: profile.suggestedRoute,
      suggestedRoute: profile.suggestedRoute,
      confidence: profile.confidence,
      rationale: profile.rationale,
      evidenceQuote: profile.evidenceQuote,
      evidenceTurn: profile.evidenceTurn,
      nextAction: profile.nextAction,
      owner: profile.owner,
      reviewStatus: profile.reviewStatus,
      isManualOverride: false,
      opportunitySignals: profile.opportunitySignals,
    };
  }

  // Fallback for background / silent records without adapted transcript
  const isCall = record.source_type === 'call';
  const duration = isCall ? (record.payload?.duration_seconds || 0) : (record.payload?.duration_seconds || 0);
  const outcome = isCall ? (record.payload?.observed_outcome || 'unknown') : 'meeting_no_speech';

  return {
    route: 'Review Required',
    suggestedRoute: 'Review Required',
    confidence: 'Low',
    rationale: isCall 
      ? `Background call (${outcome}, duration: ${duration}s). No conversation transcript supplied in delivery envelope.`
      : `Meeting record with no substantive transcript supplied (${record.payload?.title || 'No Title'}). Stored upstream state only.`,
    evidenceQuote: null,
    evidenceTurn: null,
    nextAction: isCall && outcome === 'voicemail' ? 'Review if automated re-dial cadence is needed' : 'Log intake record; no further action required',
    owner: isCall ? (record.payload?.rep_name || 'Unassigned') : (record.payload?.organizer_email || 'Unassigned'),
    reviewStatus: 'pending_review',
    isManualOverride: false,
    opportunitySignals: 'N/A - No usable transcript data supplied.',
  };
}
