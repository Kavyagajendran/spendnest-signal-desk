# SpendNest — Revenue Intelligence Inbox
**Recruitment Placement Technical Assessment**  
**Role:** Commercial Operations / Full-Stack Product & Engineering Placement  
**Context:** SpendNest / OXO Customer Interaction Dataset  
**Target Date:** 21 August 2026 (Asia/Kolkata)  
**Estimated Time Spent:** ~7 hours  

---

## 1. Project Overview & Objective

A sales manager receives calls, meeting records, transcripts, and automated notes from disparate systems. These records arrive out of order, some transcripts arrive late, and upstream labels (such as `is_conversation` or `is_connected`) frequently disagree with actual spoken content.

This application is a **Revenue Intelligence Inbox** that ingests raw interaction batches, enforces strict composite identity and revision idempotency rules, classifies conversations into four actionable destinations with verbatim evidence citations, preserves human manager routing overrides, and generates machine-readable export manifests.

---

## 2. Technology Stack & Architecture

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React, Recharts (responsive, light-themed SaaS workspace).
- **Data & Ingestion Engine:** Pure JavaScript service (`src/services/dataService.js`) enforcing:
  - Composite Identity: `(source_type, source_id)`.
  - Transactional Revision Ordering: Replaces payload on newer revisions; rejects older/duplicate revisions.
  - State Separation: Raw source payload is decoupled from human judgment so manual overrides persist across updates.
  - Browser Persistence: Automatic synchronization with versioned `localStorage`.
- **Testing:** Vitest automated test suite (`tests/replay.test.js`) verifying all 7 replay steps and contract invariants.
- **Export Packaging:** JSZip for browser-side ZIP packaging and Node export script (`scripts/generate_exports.js`).

---

## 3. Quickstart & Installation Instructions

### Prerequisites
- Node.js (v18+ or v22+)
- npm (v9+ or v10+)

### Setup & Run Commands

```bash
# 1. Install dependencies
npm install

# 2. Run automated contract replay tests
npm test

# 3. Start the local development server
npm run dev
```

The application will be live at: **`http://localhost:5173`**

### Pre-loaded State
By default, the application launches in the **final post-update state** (44 records, 18 transcripts). Reviewers can click **"Reset"** in the top header or navigate to the **"Replay Test Console"** to run the initial/update sequence from scratch.

---

## 4. Replay Test Verification (Mandatory Replay Contract)

You can reproduce and verify the replay test sequence in **two ways**:

### Option A: Automated CLI Test Suite (Recommended)
Run:
```bash
npm test
```
All 6 tests in `tests/replay.test.js` execute and verify:
1. `01_initial.json` ingests exactly 44 records and 17 transcripts.
2. Re-importing `01_initial.json` produces 0 duplicate records (count strictly 44).
3. Manual override on M07 persists.
4. `02_update.json` applies Revision 2 to M07, total records remain 44, usable transcripts grow to 18, and M07's manual override **survives intact**.
5. Repeat update is ignored as duplicate.
6. Older revisions (re-importing rev 1) cannot overwrite rev 2.

### Option B: Interactive In-App Test Console
1. Open the running app at `http://localhost:5173`.
2. Click **"Replay Test Console"** in the left sidebar.
3. Click the green button: **"Run Full 7-Step Replay Test"**.
4. Watch the live terminal execute all assertions with real-time green checkmarks.

---

## 5. The Three Most Important Findings (Evidence-Backed)

Every finding is anchored to an exact verbatim quote (calls) or 1-based turn number (meetings):

### Finding 1: Critical UI Data Persistence Defect in Customer Account (M07)
- **Source Reference:** Meeting M07 (`source_id: 4f304fff-fd40-5cfc-a366-0a134c445c2a`), **Turn 3**.
- **Exact Verbatim Citation:**  
  > *Team member A:* **"The field still shows the earlier wording. So the change is not appearing after you save, is that right?"**
- **Where It Influenced the Product:**  
  Routed immediately to **Customer Support Bug** with P1 Engineering escalation to the Core Web frontend team. Highlighted prominently on the Manager Dashboard and Daily Brief to prevent churn for high-value client Willowfield Trust.

### Finding 2: SDR Cold-Outreach Friction & Defensive Pitching (C01)
- **Source Reference:** Call C01 (`source_id: 2ec4404c-beee-5377-a63c-aab701da08ed`).
- **Exact Verbatim Citation:**  
  > *Pranav (Harborlight Advisory):* **"no, I asked why you have called me. Right, I wanted to understand whether a partnership might be relevant. I don't know how I ended up on your list. I didn't ask for this call, and I'm not interested."**
- **Where It Influenced the Product:**  
  Routed to **Sales Coaching**. Rep (Arun) pushed automated features without acknowledging prospect friction. Triggers a prescribed manager 1-on-1 coaching module on permission-based cold openers and graceful objection de-escalation.

### Finding 3: Channel Partnership Scope & Regulatory Misalignment (M01)
- **Source Reference:** Meeting M01 (`source_id: cb5cecac-e68d-52b7-b10b-b0c748efc467`), **Turn 1**.
- **Exact Verbatim Citation:**  
  > *Partner A:* **"My understanding was that you help people open bank accounts remotely. That is what I wanted to explore for the clients coming through Harborpath Advisory."**
- **Where It Influenced the Product:**  
  Routed to **Deal Next Step (Qualification Risk)**. SpendNest is a corporate expense & spend management platform, not a licensed banking institution offering remote bank accounts. Flagged to Sales Management to realign partnership collateral before scoping commercial agreements.

---

## 6. One Deliberately Rejected Decision

### The Rejected Alternative
Integrating runtime cloud LLM APIs (e.g. OpenAI GPT-4 / Claude live calls) for dynamic transcript summarization and synthetic deal probability scoring.

### Why It Was Rejected
1. **Self-Containment & Security:** Placement submissions must not require reviewers to configure external paid API keys or risk credential leakage.
2. **Replay Idempotency Violation:** Live LLM generation is inherently non-deterministic. Identical replay passes could produce diverging summaries or category routes, breaking automated verification.
3. **Data Integrity Prohibition:** The dataset contains no authoritative CRM deal value table or closed-won probabilities. Generating synthetic "$450,000 Pipeline Value" figures directly violates `DATA_CONTRACT.md`'s warning against inventing unestablished CRM links.

### The Accepted Trade-off
We engineered a transparent, deterministic routing and evidence-citation engine paired with pre-generated structured analysis, clear confidence scoring, and explicit manual review queues for edge cases.

---

## 7. Folder and Export Structure

Generated exports are organized in `exports/`:

```
exports/
├── manifest.json                 # Machine-readable master metadata manifest
├── manifest.csv                  # Spreadsheet-compatible CSV manifest
├── README_EXPORT.md              # Export package documentation
└── outputs/
    ├── sales_coaching/           # C01, C02, C06, C09, C10
    ├── deal_next_step/           # C03, C04, C05, C07, C08, M01, M03, M04, M06
    ├── customer_support_bug/     # M07 (Willowfield), M09 (Brookmint)
    ├── internal__vendor_note/    # M02 (LedgerBridge), M10 (Billing)
    └── review_required/          # B01-B20, M05, M08, M11-M14
```

Reviewers can generate the physical export on disk at any time by running:
```bash
node scripts/generate_exports.js
```
Or by clicking **"Download Full ZIP Archive"** in the in-app Export Center.

---

## 8. Placement Deliverables Index

- **Application Source Code:** `src/` (Components, Services, Styling)
- **Replay Tests:** `tests/replay.test.js`
- **5-Slide Presentation:** `presentation/SLIDES.md` and interactive viewer `presentation/slides.html`
- **Spoken Video Walkthrough Script:** `DEMO_SCRIPT.md` (3-minute timed script)
- **Pre-submission Verification Checklist:** `SUBMISSION_STATUS.md`
- **Original Offline Reading Pack:** `offline_reader.html` (accessible via app header)
- **Security & Prompt Guard Architecture:** `SECURITY_PROMPT_GUARD.md`

---

## 9. Meta Prompt Guard 2 (86M) Security Integration

As an optional security layer, the application integrates Meta's `meta-llama/llama-prompt-guard-2-86m` via Groq Cloud API to detect prompt injection and jailbreak attempts in customer transcripts before untrusted text reaches generative AI components.

### Core Guarantees:
1. **Security Classification Exclusively**: Never used for sales classification, summarization, or routing.
2. **Context Window Adherence**: Enforces the 512-token limit via overlapping multi-segment chunking ($\le 200$ words, 30-word sliding overlap).
3. **5 Standardized Security Statuses**: `Not scanned`, `Benign`, `Malicious — review required`, `Scan unavailable`, and `Scan incomplete`. Never defaults an unscanned transcript to benign.
4. **Automated Quarantine & Safe Review Gate**: Flags malicious content, isolates untrusted text from downstream AI, and provides a documented manager review authorization path.
5. **Contract Preservation**: Re-imports remain idempotent, composite identity `(source_type, source_id)` is preserved, and Revision 2 updates (e.g. M07 late transcript) invalidate stale security scans.
6. **Server-Side Credentials**: `GROQ_API_KEY` is kept in `.env` (gitignored) and processed via Vite server middleware (`/api/security/scan`), completely hidden from client code.

See [`SECURITY_PROMPT_GUARD.md`](./SECURITY_PROMPT_GUARD.md) for full architectural documentation.
