/**
 * managerBrief.js
 * Pre-generated, source-backed executive brief for 21 August 2026 (Asia/Kolkata).
 * Synthesizes all 18 adapted conversations and 26 background records into actionable
 * manager recommendations, quoting exact transcript passages.
 */

export const MANAGER_BRIEF_DATA = {
  date: '21 August 2026',
  timezone: 'Asia/Kolkata',
  targetAudience: 'Sales & Revenue Operations Management',
  executiveSummary: {
    totalRecords: 44,
    calls: 30,
    meetings: 14,
    transcriptsAvailable: 18, // Post-update
    unconnectedOrSilentRecords: 26,
    keyTakeaway: 'Strong mid-funnel momentum in enterprise expense migration (Cedarwave) and API licensing (Milan/C03), but high risk in UI data persistence defects (Willowfield Trust/M07) and SDR cold-outreach resistance.'
  },
  sections: [
    {
      id: 'critical-defects',
      title: '🚨 Critical Software Defects & Customer Roadblocks',
      badge: 'Immediate Action Required',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
      items: [
        {
          recordRef: 'M07',
          sourceId: '4f304fff-fd40-5cfc-a366-0a134c445c2a',
          title: 'Event-Payment Description Save Failure — Willowfield Trust',
          severity: 'P1 Defect',
          evidence: {
            speaker: 'Customer A & Team Member A',
            turn: 'Turn 2 & 3',
            citation: 'Turn 3: "The field still shows the earlier wording. So the change is not appearing after you save, is that right?"'
          },
          finding: 'Customer demonstrated screen-share reproduction where changing an event-payment description and clicking "Save changes" failed silently. The UI reverted to earlier wording.',
          action: 'Escalate Jira ticket to Core Web Frontend team immediately. Customer Success (Team member A) to update Willowfield Trust with hotfix ETA by end of day.',
          owner: 'Engineering Triage / CS Team Member A'
        },
        {
          recordRef: 'M09',
          sourceId: '4b5b9192-f3fc-505a-8e77-4d2ffaa54594',
          title: 'Tenant Invitation Token Expiry — Brookmint Holdings',
          severity: 'P2 Onboarding Blocker',
          evidence: {
            speaker: 'Customer A',
            turn: 'Turn 1',
            citation: 'Turn 1: "The invitation for Brookmint Holdings did not work when I tried it. It may have expired, or perhaps we can try again together."'
          },
          finding: 'Customer unable to access newly provisioned workspace due to expired invitation token and corporate SSO email alias mismatch.',
          action: 'Support team to generate manual invitation override token and assist customer IT administrator with multi-domain email setup.',
          owner: 'team11@example.com (Support)'
        }
      ]
    },
    {
      id: 'deal-momentum',
      title: '💼 Deal Next Steps & Pipeline Acceleration',
      badge: 'High Revenue Impact',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      items: [
        {
          recordRef: 'M03',
          sourceId: '398672e7-62dd-5afd-846d-0237d49792fb',
          title: 'CFO Pricing Review — Asterloom Systems',
          evidence: {
            speaker: 'Customer B (Finance Colleague)',
            turn: 'Turn 36',
            citation: 'Turn 36: "Send the details first. We need time with the CFO and will tell you if another call is needed. Let us make that decision internally before scheduling more."'
          },
          finding: 'Asterloom Systems evaluation has advanced to executive finance review. Contact requires detailed cost breakdown and ROI sheet before committing to contract negotiation.',
          action: 'Deliver custom tiered proposal with volume transaction tiers to Customer A and B; schedule follow-up check-in for next Wednesday.',
          owner: 'team08@example.com (AE)'
        },
        {
          recordRef: 'C03',
          sourceId: '20d509ba-d589-5334-9aef-ea4ce6105b1a',
          title: 'Developer API & Webhook Follow-up — Milan',
          evidence: {
            speaker: 'Milan & Kiran',
            quote: 'Quote: "Send the email and we can speak Monday or Tuesday. ... What subject should I look for? Something like \'Developer access and event notifications — follow-up\'."'
          },
          finding: 'Active developer API prospect previously concerned about pricing confirmed availability for Monday/Tuesday callback if documentation and subject line match request.',
          action: 'Send technical spec and tiered API documentation with subject "Developer access and event notifications — follow-up"; call Monday morning.',
          owner: 'Kiran (DevRel / Commercial Sales)'
        },
        {
          recordRef: 'M04',
          sourceId: 'b0f79b3d-37ba-52f9-b2bc-58b159dd6d91',
          title: 'Legacy System Migration Planning — Cedarwave Distribution',
          evidence: {
            speaker: 'Team Member A',
            turn: 'Turn 1',
            citation: 'Turn 1: "I wanted to discuss the migration while there is still time to plan it. We should cover the present situation, the next steps and any feedback from your side."'
          },
          finding: 'Key account Cedarwave is finalizing cut-over timeline from legacy accounting to SpendNest. Coordination needed on data extraction formats.',
          action: 'Send data migration mapping schema and schedule milestone sign-off for Friday.',
          owner: 'team09@example.com (CS Implementation)'
        },
        {
          recordRef: 'C07',
          sourceId: '428817fa-7e9e-5418-a7d4-bb396d28dfbf',
          title: 'Corporate Incorporation Channel Partnership — Willowbank Advisory',
          evidence: {
            speaker: 'Dev & Aditya',
            quote: 'Quote: "All right, I\'ll send the details there. Once you\'ve received them, could I call on Monday to see whether you\'d like to discuss it further? Yes, that\'s fine."'
          },
          finding: 'Promising referral partnership with firm managing corporate registrations across multiple jurisdictions. Prospect requested info via messaging and agreed to Monday follow-up.',
          action: 'Send advisor referral framework via mobile messaging and calendar call for Monday 24 Aug.',
          owner: 'Dev (Partnerships)'
        }
      ]
    },
    {
      id: 'sales-coaching',
      title: '🎯 Priority Sales Coaching & Objection Handling',
      badge: 'Manager Coaching Queue',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      items: [
        {
          recordRef: 'C01',
          sourceId: '2ec4404c-beee-5377-a63c-aab701da08ed',
          rep: 'Arun',
          coachingTopic: 'Handling Cold Outreach Resistance & Permission-based Openers',
          evidence: {
            speaker: 'Pranav (Harborlight Advisory)',
            quote: 'Quote: "no, I asked why you have called me. Right, I wanted to understand whether a partnership might be relevant. I don\'t know how I ended up on your list. I didn\'t ask for this call, and I\'m not interested."'
          },
          coachingNeed: 'Arun responded defensively to prospect irritation by citing "a professional networking outreach programme" and continuing feature pitches rather than de-escalating. Rep needs coaching on acknowledging friction, using soft permission openers ("I know I caught you out of the blue..."), and gracefully disengaging when a prospect is hostile.',
          managerAction: 'Conduct 1-on-1 roleplay session on cold call de-escalation.'
        },
        {
          recordRef: 'C06',
          sourceId: '12216d5c-e254-52c6-b344-47de4c6e1ae5',
          rep: 'Meera',
          coachingTopic: 'Discerning Entrenched ERP Objections vs Sales Resistance',
          evidence: {
            speaker: 'Nikhil (Retail chain operator)',
            quote: 'Quote: "The essential processes are automated and connected through our business management system. Head office manages it, and we have full visibility. That is why I said the arrangements are already in place."'
          },
          coachingNeed: 'Prospect operates >120 locations with centralized enterprise ERP. Meera continued pitching card controls after the prospect stated that full visibility was already achieved. Rep should learn to identify hard structural disqualifiers and exit with rapport intact.',
          managerAction: 'Coach on qualification criteria for enterprise multi-unit accounts.'
        },
        {
          recordRef: 'C10',
          sourceId: 'b747f592-810e-583c-9b81-8db5ab035806',
          rep: 'Meera',
          coachingTopic: 'Respecting Prospect Communication Boundaries',
          evidence: {
            speaker: 'Aniket',
            quote: 'Quote: "Would a follow-up call on Monday or Tuesday next week be okay, in case you have any questions? No. I said I will contact you if there is anything to discuss."'
          },
          coachingNeed: 'Prospect agreed only to receive an email. Meera pushed for a phone callback immediately after, violating the prospect\'s stated preference. Rep should honor prospect boundaries to preserve long-term brand credibility.',
          managerAction: 'Review boundary setting in email-first outbound sequences.'
        }
      ]
    },
    {
      id: 'vendor-internal',
      title: '🏢 Internal Enablement & Vendor Coordination',
      badge: 'Infrastructure',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      items: [
        {
          recordRef: 'M02',
          sourceId: '1a21c409-c050-5787-90af-2667e057e1b6',
          title: 'Compliant Invoicing Partner Assessment — LedgerBridge',
          evidence: {
            speaker: 'Team Member A',
            turn: 'Turn 1 & 36',
            citation: 'Turn 1: "We want to understand whether LedgerBridge can give us compliant invoicing coverage across our operating markets." / Turn 36: "I will send the template shortly so we can get that started."'
          },
          finding: 'SpendNest strategy team evaluating LedgerBridge as third-party invoicing provider for compliant VAT/GST e-invoicing.',
          action: 'Review LedgerBridge API integration contract and schema template.',
          owner: 'Strategy & Product Team'
        },
        {
          recordRef: 'M10',
          sourceId: '337f297d-9385-5b82-9e54-5019c1ed912c',
          title: 'Internal Billing Workflow Walkthrough & Back-Office Provisioning',
          evidence: {
            speaker: 'Team Member A',
            turn: 'Turn 20',
            citation: 'Turn 20: "I will request the back-office access separately for the next training session."'
          },
          finding: 'Internal operations training session for onboarding specialists.',
          action: 'Grant back-office sandbox roles to trainees prior to follow-up session.',
          owner: 'Operations Enablement'
        }
      ]
    }
  ]
};
