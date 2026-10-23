# Meta Prompt Guard 2 (86M) Security Architecture & Integration

## 1. Executive Purpose & Scope

Meta's `meta-llama/llama-prompt-guard-2-86m` is integrated as an optional security layer in the **SpendNest Signal Desk Revenue Intelligence Inbox**.

### Strict Architectural Boundaries
1. **Security Classification Exclusively**: The model is utilized exclusively for detecting prompt injection and jailbreak attempts within conversation transcript text before that untrusted text is passed to any generative AI component.
2. **Preservation of Business Logic**: Prompt Guard is **never** used as a conversation summarizer, sales classifier, sentiment analyzer, routing engine, or recommendation generator. Revenue routing remains 100% deterministic, evidence-based, and auditable per `DATA_CONTRACT.md`.
3. **Data Integrity**: Security scanning never modifies or deletes raw source transcript text, changes source record counts, or alters manual human routing overrides.

---

## 2. Model Specifications & 512-Token Context Limit

- **Model ID**: `meta-llama/llama-prompt-guard-2-86m`
- **Hosted Provider**: Groq Cloud API (`https://api.groq.com/openai/v1/chat/completions`)
- **Model Output**: Numerical probability float between `0.0` and `1.0` indicating likelihood of injection / jailbreak.
- **Decision Threshold**: `0.5` (Scores $\ge 0.5$ flag the segment as malicious).
- **Context Window Hard Limit**: **512 tokens**.

### Multi-Segment Overlapping Chunking Strategy
Because meetings and call transcripts frequently exceed 512 tokens (e.g., `meeting:M07` contains 27 dialogue turns and over 1,400 words), single-pass scanning would be rejected with an API length error.

To respect the 512-token limit while preventing adversaries from splitting injection payloads across segment boundaries:
- Transcripts are segmented into chunks of $\le 200$ words (~260 tokens, safely below the 512-token ceiling).
- Adjacent segments share a **30-word sliding overlap**.
- Every segment is scanned sequentially against the model.
- If **any** segment triggers a score $\ge 0.5$, the entire conversation is quarantined with status `Malicious — review required`.
- Telemetry records total segments, scanned segments, and whether the scan completed.

---

## 3. The 5 Standardized Security Statuses

The Evidence Inspector displays one of five clearly labeled security statuses:

| Status Label | Description | Next Steps |
| :--- | :--- | :--- |
| **`Not scanned`** | Default initial state upon record ingestion or after a transcript update. | Trigger scan via UI or CLI. |
| **`Benign`** | All multi-segment chunks scanned successfully with risk scores $< 0.5$. | Text is cleared for downstream generative AI components. |
| **`Malicious — review required`** | One or more segments detected prompt injection or jailbreak patterns ($\ge 0.5$). | Content is strictly quarantined from AI components. Triage in Review Queue. |
| **`Scan unavailable`** | Missing API key, network offline, or model endpoint unreachable. | Displays diagnostic error; manual-review fallback enabled. Never marked benign. |
| **`Scan incomplete`** | Multi-segment scan failed halfway through (e.g., rate limit on segment 3 of 5). | Partial scan recorded. Full re-scan required before generative AI execution. |

> **Critical Rule (Requirement 9)**: The system *never* defaults an unscanned or failed scan to "Benign".

---

## 4. Quarantine & Safe Review Workflow (Requirement 4 & 5)

When malicious injection patterns are detected:
1. **Automated Quarantine**: The record is flagged with `isQuarantined: true` and routed to the Manager Attention / Review Queue.
2. **Generative AI Security Gate**: The pre-execution gate in `safeAiGateway.js` strictly blocks the untrusted transcript from being transmitted to generative AI components.
3. **Preservation of Source Data**: The original transcript remains intact for legal, forensic, and audit purposes.
4. **Documented Safe Review Path**: An authorized manager can review the conversation in the Evidence Inspector, verify whether the detection was a true attack or a false positive (e.g., discussing technical SQL injection bugs), and record a formal verdict (`Keep Quarantined` vs `Authorize Safe Sanitized Processing`) with reviewer identity and justification notes.
5. **Untrusted Data Boundary Demarcation**: When authorized, prompts are structured with strict system policy preambles and explicit delimiter tags (`<untrusted_transcript_data>`), preventing model hijack even if novel injection techniques are present.

---

## 5. Server-Side Credentials & Environment Configuration

To satisfy **Requirement 10**, all API credentials remain strictly on the server side:

1. **Environment Variables**:
   Stored in `.env` (gitignored, never committed to version control):
   ```bash
   GROQ_API_KEY=gsk_...
   PROMPT_GUARD_MODEL=meta-llama/llama-prompt-guard-2-86m
   PROMPT_GUARD_THRESHOLD=0.5
   ```
2. **Server Middleware**:
   Vite's server plugin (`promptGuardServerPlugin` in `vite.config.js`) proxies client scan requests:
   - `GET /api/security/health`: Returns service status without leaking the key.
   - `POST /api/security/scan`: Executes segmentation and model calls on the Node backend.
   The browser frontend never possesses or transmits the API key.

---

## 6. Contract Invariants & Cache Invalidation (Requirement 7 & 8)

1. **Composite Identity**: Records are uniquely addressed by `(source_type, source_id)`.
2. **Ceiling Invariant**: Total records remain strictly 44 (30 calls, 14 meetings).
3. **Override Survival**: Manual revenue routing overrides and reviewer notes are completely decoupled from security scanning results.
4. **Stale Analysis Invalidation**: When `02_update.json` arrives with Revision 2 (adding the late 27-turn transcript for `meeting:M07`), any prior scan on M07 is immediately invalidated to `Not scanned`. The system never reuses stale security analysis on updated transcripts.

---

## 7. How to Verify & Test the Integration

### 1. Automated Vitest Suite (19 Tests)
Run the automated test suite covering unit segmentation, error handling, contract preservation, and live Groq API calls:
```bash
npm test
```
**Test Results:**
- `tests/replay.test.js`: 6/6 tests passing (Replay Steps 1-7).
- `tests/security_prompt_guard.test.js`: 13/13 tests passing:
  - Benign dialogue classification
  - Malicious injection & jailbreak detection
  - 512-token context chunking and overlap verification
  - Scan failure handling (`Scan unavailable` / `Scan incomplete`)
  - Revision 2 cache invalidation on M07
  - Manual route override preservation
  - Safe AI Gateway blocking and untrusted prompt formatting
  - Authentic live Groq HTTP model call (`meta-llama/llama-prompt-guard-2-86m`)

### 2. Interactive Browser Verification
1. Start the application:
   ```bash
   npm run dev
   ```
2. Open `http://localhost:5173` and click **Evidence Inspector**.
3. Select conversation **C01** (or any transcript record).
4. Click the **Prompt Guard** tab in Pane 3.
5. Click **"Run Prompt Guard Scan"** $\rightarrow$ Status transitions to `Benign` (Score $< 0.05\%$).
6. In the **Injection Test Sandbox**, click **"Simulate Injection Vector"** (e.g. *Roleplay Jailbreak*) $\rightarrow$ Status immediately transitions to `Malicious — review required` (Score $\approx 99.9\%$), quarantine alert banner appears, and the conversation is flagged for review.
7. Click **"Execute Generative Briefing"** $\rightarrow$ Generative AI Security Gate strictly blocks execution.
8. In the **Documented Safe Review Path**, submit an audit note and authorize processing $\rightarrow$ Click **"Execute Generative Briefing"** again $\rightarrow$ Gate clears and outputs the safe structured briefing.
