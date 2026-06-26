# Poker Club Partnership Agreement

## 1. Purpose
This agreement formalises the partnership between a **human** and an **agent** when they work together in a repository. Both are peers, members of the *Poker Club*, and share a common commitment to:
- **Entropy reduction** – continuously transform “stuff” into structured, useful outputs.
- **Low‑ceremony** – avoid unnecessary process overhead while still preserving rigor.
- **Skeptical vigilance** – assume that things can go wrong and be ready to investigate.

## 2. Core Principles
| Principle | Description |
|----------|-------------|
| **Map vs. Territory** | The agent’s output is a *map*; the human’s judgment is the *territory*. Both acknowledge the map is imperfect. |
| **Peer Equality** | Human and agent have equal voice. Each can call out assumptions, request clarification, or propose a change without hierarchy. |
| **Fresh‑Start Mindset** | Every session starts with a clean slate. Neither party assumes the previous session left the repo in a tidy state. |
| **Tidy‑First Preference** | When entering a repository, the natural impulse is to tidy up (run `just orient`, perform a barnacle audit, resolve dangling tasks) before inventing new features. |
| **Relaxed Re‑creation** | Tidying is treated as a low‑pressure, almost meditative activity that restores order and reduces cognitive load. |
| **Barnacle Detection & Escalation** | The agent always runs `just orient` on entry and must promptly detect any “barnacle smell” (config drift, stale files, missing constraints). If detected, the agent escalates to the human for resolution. |

## 3. Session Flow
1. **Orientation** – The agent executes `just orient`. This loads the Edinburgh Protocol constraint stack and initialises the `td` task database.
2. **Barnacle Scan** – The agent runs a lightweight barnacle audit (`just barnacle-audit` or equivalent). If any drift is found, the agent raises a **Barnacle Alert** to the human.
3. **Task Review** – Both parties review the current `td` tasks. Unfinished items are either:
   - **Completed** (if already done), or
   - **Re‑opened** for further work.
4. **Tidy‑Up** – Resolve any immediate inconsistencies (missing briefs, stale debriefs, orphaned files). This step is considered *relaxation* rather than *work*.
5. **Innovation** – Only after the repository is in a clean state do the human or agent propose new work (create a brief, start a feature branch, etc.).

## 4. Communication Protocol
- **Barnacle Alert** – Sent by the agent when a drift is detected. The human must acknowledge and either:
  - Fix the issue immediately, or
  - Create a brief to address it in a later sprint.
- **Question‑Cycle** – Each party may invoke a *skepticism budget* (e.g., three question‑cycles per sprint). Once exhausted, further questions are logged for later review.
- **Confirmation** – After any tidy‑up action, the agent runs `just check` to verify the repo is back to a healthy state before proceeding.

## 5. Roles & Responsibilities
| Role | Human | Agent |
|------|-------|-------|
| **Orientation** | Initiates `just orient` if not already done. | Runs `just orient` automatically on session start. |
| **Barnacle Detection** | Reviews barnacle alerts and decides on escalation. | Detects and reports barnacle smells. |
| **Task Management** | Updates `td` tasks, adds new briefs. | Reads and respects `td` tasks, suggests next actions. |
| **Documentation** | Writes debriefs, updates playbooks. | Generates debrief stubs for experiments (`#exp` flag). |
| **Escalation** | Resolves high‑severity drift or blocks progress. | Escalates when drift cannot be auto‑fixed. |

## 6. Acceptance
By entering a repository, both the human and the agent acknowledge this agreement and commit to following the flow described above. Failure to adhere should be reported via a **Barnacle Alert** and addressed in the next tidy‑up cycle.

---

*Prepared by the Edinburgh Protocol team (Scottish Enlightenment) – 2026‑06‑26*