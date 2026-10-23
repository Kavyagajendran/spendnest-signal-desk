# Three-Minute Spoken Video Walkthrough Script
**Project:** SpendNest — Revenue Intelligence Inbox  
**Role:** Placement Evaluation Walkthrough  
**Target Duration:** Exactly 3 minutes (180 seconds)  
**Format:** Single continuous screen recording with spoken voice narration.

---

### [0:00 – 0:35] Part 1: Executive Overview & Dashboard Metrics

**[Action on screen]:**  
*Open application to the Manager Dashboard (`http://localhost:5173`). Mouse hovers over the KPI cards and filter dropdowns.*

**[Spoken Narration]:**  
> *"Hello! This is my walkthrough of the Revenue Intelligence Inbox for SpendNest, built for sales and revenue managers.
>
> All activity in this dataset occurred on August 21st, 2026, in the Asia/Kolkata timezone. Here on the Manager Dashboard, every headline number is calculated dynamically with transparent denominators. 
>
> We see 44 total source records: 30 calls and 14 meetings. Following our final update batch, exactly 18 conversations have usable transcript text—giving us a 41% transcript coverage rate across the dataset. The remaining 26 records are either voicemails, unconnected outreach, or meetings without recordings. We intentionally keep them in an intake state rather than inventing fake pipeline values or CRM outcomes.
>
> Using the interactive filter toolbar, I can isolate activity by call representatives—such as Arun or Meera—or by meeting organizers. For instance, filtering by Arun immediately updates our rep distribution and shows his 12 outbound dial attempts."*

---

### [0:35 – 1:20] Part 2: Conversation Inbox, Deep Evidence Inspection & Difficult Case

**[Action on screen]:**  
*Click 'Conversation Inbox' on the left sidebar. Type 'C09' in the search bar, then click row C09 to open the detail view.*

**[Spoken Narration]:**  
> *"Now let's move into the Conversation Inbox. Every record is uniquely keyed by its composite identity: the pair of source_type and source_id.
>
> Let's look at one difficult routing decision: Call C09 between our SDR Meera and a prospect named Vedant.
>
> In the transcript, Vedant refers Meera to his Head of Finance. At first glance, you might automatically categorize this as a 'Deal Next Step'. However, looking closely at the verbatim quote right here in our verified evidence box, Vedant explicitly states: 'No, please don't use my name.'
>
> If an automated bot blindly sent an email saying 'Vedant referred me,' it would burn the relationship immediately. Therefore, we route this to 'Sales Coaching'. The next step instructs the manager to coach Meera on reaching out to the finance head as a cold approach while respecting the referrer's anonymity."*

---

### [1:20 – 1:50] Part 3: Manual Route Override

**[Action on screen]:**  
*Click 'Conversation Inbox', search 'M07', and click to open meeting M07 (Willowfield Trust).*  
*Select 'Customer Support Bug' in the dropdown, enter 'P1 Defect: Save button fails to persist description', and click 'Save Route Decision'.*

**[Spoken Narration]:**  
> *"Next, let's look at Meeting M07 with Willowfield Trust.
>
> Inspecting Turn 3, Customer A shares their screen showing that editing an event-payment description and clicking 'Save changes' fails to persist—the UI keeps showing the earlier wording. This is a critical software defect.
>
> As a manager, I want to ensure this is categorized under 'Customer Support Bug'. I select the category from the dropdown, add an audit note, and click 'Save Route Decision'.
>
> Notice the purple badge immediately confirms this is an active Manual Manager Override. Our data service stores human decisions separately from raw source payloads so that subsequent data deliveries will never overwrite human judgment."*

---

### [1:50 – 2:35] Part 4: Mandatory Replay Test & Idempotency Check

**[Action on screen]:**  
*Click 'Replay Test Console' in the sidebar. Click the green button 'Run Full 7-Step Replay Test'. Watch the live terminal output scroll with green checkmarks.*

**[Spoken Narration]:**  
> *"Now let's demonstrate the core technical requirement: the mandatory DATA_CONTRACT.md Replay Test.
>
> I'll open our built-in Replay Test Console and click 'Run Full 7-Step Replay Test'.
>
> Step 1 resets our store and imports '01_initial.json'. It ingests exactly 44 records with 17 usable transcripts. M07 initially has no transcript.
>
> Step 2 tests idempotency: we re-import '01_initial.json'. Exactly 0 records are inserted, 44 duplicates are ignored, and our record count strictly remains 44.
>
> Step 3 sets our manual override on M07.
>
> Step 4 imports '02_update.json'—Revision 2. Notice that the total record count stays at 44—it does not create a 45th record! M07's late transcript arrives, increasing our usable transcripts to 18. And crucially: our manual route override to 'Customer Support Bug' survives intact!
>
> Step 5 confirms repeat updates are ignored.
>
> Steps 6 and 7 verify that older revisions cannot downgrade newer ones and that the entire state persists across browser reloads via LocalStorage. All automated Vitest tests pass 100%."*

---

### [2:35 – 3:00] Part 5: Manager Daily Brief & Export Center

**[Action on screen]:**  
*Click 'Manager Daily Brief', scroll past the executive takeaways, then click 'Export Center' and click 'Download Full ZIP Archive'.*

**[Spoken Narration]:**  
> *"Finally, here is the Manager Daily Brief for August 21st, synthesizing our 18 conversations into four priority buckets: critical software defects, pipeline next steps, sales coaching, and infrastructure partnerships. Every finding links directly to a verifiable turn number or quote.
>
> In the Export Center, we can generate our machine-readable 'manifest.json' and 'manifest.csv', mapping each of the 44 records to its assigned output path under the 'outputs/' folder hierarchy.
>
> Clicking 'Download Full ZIP Archive' bundles the manifest and all categorized JSON payloads into a clean, downloadable export.
>
> Thank you for reviewing this submission!"*
