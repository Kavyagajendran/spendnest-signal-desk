# SpendNest Signal Desk — Evidence-First RevOps Workspace
**Placement Assessment Presentation**  
**Role:** Commercial Operations / Product & Engineering Placement  
**Context:** SpendNest / OXO Customer Interaction Dataset  
**Activity Date:** 21 August 2026 (Asia/Kolkata)

---

## Slide 1: The Manager Problem & Three Evidence-Backed Findings

### The Core Manager Problem
Sales managers face fragmented interaction data arriving out-of-order, with late transcripts, unreliable upstream labels (`is_conversation` or `is_connected` diverging from reality), and no single source of truth for coaching vs. deal execution. Managers need a unified inbox that preserves human oversight and delivers verified, evidence-backed actions rather than speculative AI hallucinations.

### Three Evidence-Backed Findings

1. **Critical UI Data Persistence Defect in Customer Account (M07)**
   - **Evidence:** Meeting M07 (`4f304fff-fd40-5cfc-a366-0a134c445c2a`), Turn 3:  
     *Customer A & Team Member A:* *"The field still shows the earlier wording. So the change is not appearing after you save, is that right?"*
   - **Product Impact:** Routed to **Customer Support Bug** with P1 Engineering escalation to Core Web team. Prevents churn for high-value client Willowfield Trust.

2. **SDR Cold-Outreach Friction & Defensive Response (C01)**
   - **Evidence:** Call C01 (`2ec4404c-beee-5377-a63c-aab701da08ed`):  
     *Pranav (Harborlight Advisory):* *"no, I asked why you have called me... I didn't ask for this call, and I'm not interested."*
   - **Product Impact:** Routed to **Sales Coaching**. Rep (Arun) pushed automated features without acknowledging prospect friction. Triggers 1-on-1 coaching module on permission-based cold openers.

3. **Partnership Scope & Regulatory Misalignment (M01)**
   - **Evidence:** Meeting M01 (`cb5cecac-e68d-52b7-b10b-b0c748efc467`), Turn 1:  
     *Partner A:* *"My understanding was that you help people open bank accounts remotely. That is what I wanted to explore for the clients coming through Harborpath Advisory."*
   - **Product Impact:** Routed to **Deal Next Step (Qualification Risk)**. SpendNest is a corporate expense & spend platform, not a remote banking provider. Prevents misaligned commercial contracts.

---

## Slide 2: Distinctive Architecture & The 5 Primary Manager Questions

### The Concept: SpendNest Signal Desk
Built with a warm off-white editorial aesthetic (`#faf9f5`), deep ink typography, restrained teal/emerald indicators for confirmed data, amber for pending triage, and coral for critical exceptions.

### How the Workspace Answers the 5 Key Manager Questions:
1. **What happened on 21 August 2026?**  
   *Executive memo banner synthesizing 44 interactions (30 calls, 14 meetings) across 4 active SDRs and 7 organizers.*
2. **Which conversations need my attention?**  
   *Front-and-center Attention Queue prioritizing unconfirmed records, bugs, and coaching flags.*
3. **What evidence supports the important conclusions?**  
   *Primary evidence banners anchoring conclusions directly to 1-based turn numbers or verbatim quotes.*
4. **What action should I take next?**  
   *Prescribed actionable next steps with explicit owners (Engineering triage, 1-on-1 roleplay, pricing sheets).*
5. **Which records have changed since the last import?**  
   *Recent Changes Audit Log tracking Revision 2 arrival, late transcript unlocks, and preserved manual overrides.*

### Deliberately Excluded Features (Discipline & Compliance)
- **No Speculative Pipeline Dollar Totals:** No CRM deal table exists; fabricating "$500,000 Pipeline" violates `DATA_CONTRACT.md`.
- **No Unwarranted Cross-Rep Rankings:** 44 records represent a selected test extract, not an entire team performance day.
- **No Runtime Cloud LLM API Dependency:** Avoids paid accounts, token leakage, and non-deterministic grading behavior.

---

## Slide 3: 3-Pane Split Evidence Inspector & Routing Hierarchy

### 3-Pane High-Efficiency Inspection Layout
- **Left Pane:** Fast Conversation Switcher with real-time text/filter chips.
- **Center Pane:** Rich Transcript Viewer displaying 1-based turn numbers, speaker tags, and highlighted evidence citations.
- **Right Pane:** Analytical Profile & Action Hub, displaying the active route, rationale, next steps, manual route override dropdown with justification note, and triage review toggles.

### Routing Taxonomy & Output Structure
```
exports/
├── manifest.json                 # Machine-readable master audit log
├── manifest.csv                  # Spreadsheet-compatible CSV manifest
├── README_EXPORT.md              # Export specification & checksums
└── outputs/
    ├── sales_coaching/           # C01, C02, C06, C09, C10
    ├── deal_next_step/           # C03, C04, C05, C07, C08, M01, M03, M04, M06
    ├── customer_support_bug/     # M07 (Willowfield), M09 (Brookmint)
    ├── internal__vendor_note/    # M02 (LedgerBridge), M10 (Billing)
    └── review_required/          # B01-B20, M05, M08, M11-M14
```

### The Difficult Case: C09 (Meera & Vedant)
- **The Dilemma:** Prospect provided a valuable referral to the Head of Finance, but explicitly commanded: *"No, please don't use my name."*
- **Resolution:** Classified as **Sales Coaching** rather than automated outreach. The SDR must be coached on executing cold outreach to the referred stakeholder without compromising the referrer's anonymity.

---

## Slide 4: Data Validation, Idempotency & Replay Invariants

### Replay Verification Matrix (`tests/replay.test.js`)

| Replay Step | Action | Expected Invariant | Actual System Behavior | Status |
|---|---|---|---|---|
| **Step 1: Initial Import** | Ingest `01_initial.json` | 44 unique records, 17 usable transcripts | 44 records, 17 transcripts | **PASS ✓** |
| **Step 2: Duplicate Replay** | Re-import `01_initial.json` | 0 duplicate insertions, count stays 44 | 0 inserted, 44 ignored, total 44 | **PASS ✓** |
| **Step 3: Manual Override** | Re-route M07 to Support Bug | Override flag saved, persists in store | `isManualOverride: true` | **PASS ✓** |
| **Step 4: Update Batch** | Ingest `02_update.json` | Count remains 44, transcripts -> 18, override preserved | 44 records, 18 transcripts, override intact | **PASS ✓** |
| **Step 5: Repeat Update** | Re-import `02_update.json` | Idempotent no-op; 1 ignored, count 44 | 1 ignored, total 44, transcripts 18 | **PASS ✓** |
| **Step 6: Older Rev Reject** | Re-import `01_initial.json` | Revision 1 cannot downgrade Revision 2 | 44 ignored, M07 remains Rev 2 | **PASS ✓** |
| **Step 7: Storage Persistence** | Reload browser / application | In-memory + LocalStorage integrity | All 44 records & overrides restored | **PASS ✓** |

**Automated Test Suite:** 6/6 tests passing in Vitest (`tests/replay.test.js`).

---

## Slide 5: Trade-offs, One Rejected Decision & Future Roadmap

### The Deliberately Rejected Decision
- **Rejected Approach:** Dynamic LLM runtime classification using external APIs (e.g. OpenAI / Gemini live calls).
- **Why Rejected:** 
  1. Leaks credentials and violates test self-containment rules.
  2. Introduces non-deterministic hallucination risks during recruiter replay checks.
  3. Threatens idempotency: identical runs could produce divergent category labels.
- **Trade-off Accepted:** Built a transparent, deterministic knowledge-engine paired with human manual override capabilities and full audit trails.

### AI & Assistant Tooling Usage
- AI coding assistants were leveraged for rapid scaffolding, automated test generation, and comprehensive transcript citation extraction. All extracted turn citations and quotes were verified against raw source JSON.

### Future Enhancements (Platform Scale)
1. **CRM Bi-Directional Webhooks:** Real-time push of coaching flags and bugs to HubSpot/Salesforce and Jira.
2. **Automated Redial Cadences:** Smart sequencing for the 20 unconnected calls based on time zone and prior dial history.
3. **Speaker Separation & Audio Diarization:** Native audio waveform playback for call records when raw media is provided.
