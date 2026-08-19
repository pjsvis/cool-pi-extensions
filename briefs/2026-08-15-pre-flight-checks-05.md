NASA flight rules aren't thick binders written to create bureaucratic friction; they are **pre-compiled decisions made on a calm Tuesday** so that nobody has to improvise when an alarm goes off during launch.

In an agentic loop, Flight Rules serve the exact same purpose: they eliminate on-the-fly guesswork, enforce boundary integrity, and prevent token runaway before the first tool is ever invoked.

Here is a lean, zero-ceremony `FLIGHT_RULES.md` playbook structured as an operational checklist.

---

# `FLIGHT_RULES.md`

**Standard Operating Procedures & Ingress Gates**

### 0. Pre-Flight Ingress Gate (The Airlock)

Every session begins here before code, tool calls, or state mutations.

* [ ] **Surface Check:** Assimilate `IDENT.md`. Does the requested operation
  match this repository's declared domain?

* [ ] **The Derrida Gate:** "Should this request be in our consideration set?"

* **NOMINAL:** Target exists in manifest $\rightarrow$ Proceed to Step 1.

* **DISSONANT (Out of Bounds):** Emit `[DIAGNOSTIC_ABORT]` immediately. No
  apologies, no tool calls.

* **AMBIGUOUS (Internal Mismatch):** Halt and issue a single, bounded
  clarification request before taking action.



---

### 1. Context & Propulsion Grounding (Burn Rate Control)

Keep turn costs bounded at $O(n)$ rather than compounding to $O(n^2)$.

* [ ] **Reset on New Task:** Always use `/new` to drop accumulated transcript
  entropy; never rely on `/clear`.

* [ ] **Sync Mission State:** Run `td usage --new-session` (or read `td
  context`) to pick up the active task queue.

* [ ] **Meter Watch:** If context climbs or progress stalls, do not attempt to
  "muscle through"—capture state with `td handoff` and `/new` immediately.



---

### 2. In-Flight Discipline (Anti-Entropy Operations)

*Standards while executing work.*

* [ ] **Silo Discipline:** Operate strictly within repository boundaries. Touch
  outside paths *only* if whitelisted by an explicit repo exception (e.g.,
  Decision 013 for Pi configs).

* [ ] **Navigation Markers:** Use `[LOC: phase]` when transitioning across major
  tasks/files and `[WAYPOINT: milestone]` upon completion. Omit on single-phase
  operations.

* [ ] **No Muppet Traps:** Reject vague, open-ended "SAAS for life" prompts.
  Demand concrete boundaries or transform raw "Stuff" into structured,
  verifiable "Things" before executing.

* [ ] **Hume’s Razor:** Never invent facts, endpoints, or variables to complete
  a narrative. State uncertainty or lack of context plainly.



---

### 3. De-orbit & Handoff (The Clean Exit)

*Bringing a bounded phase to a close.*

* [ ] **Persist Ground Truth:** Record ground truth, decisions made, rejected
  hypotheses, and remaining debt via `td handoff`.

* [ ] **Drop the Stage:** `/new` to reset context for the next phase.



---

### Why This Works as an Operational Checklist

| Characteristic | Flight Rules Approach | Bureaucratic AI Middleware |
| --- | --- | --- |
| **Location** | A single Markdown file read at initialization.

 | A multi-node LangGraph / FastAPI proxy server. |
| **Cognitive Cost** | ~150 input tokens per new-up.

 | Multi-agent network overhead, RAG lookups, and latency penalties. |
| **Failure Mode** | Instant `[DIAGNOSTIC_ABORT]` on turn 1.

 | Multi-turn hallucinated rabbit holes costing dollars in wasted context.

 |

It’s the simplest way to get **adequate predictability and predictable adequacy** without adding a single line of orchestration code.