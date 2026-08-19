Looking at `AGENTS.md` alongside the Edinburgh Protocol (`SYSTEM.md`), you have already built something remarkably clean: a real operational hedge against context decay and token inflation ($O(n^2)$ context bloat managed via `td handoff` + `/new`).

A regular review here is healthy. Both documents have a minor friction point where the new **Surface Ident / Justify Engine** mechanism needs to mesh with existing mechanics (like your **Decision 013 Silo Exception**).

Here are the concrete amendment proposals for both files.

---

### Part 1: Proposal for `AGENTS.md`

`AGENTS.md` should explicitly establish the **Pre-Flight / IDENT check** as step zero of the new-up lifecycle.

#### Key Adjustments:

1. **Bind `IDENT.md` to the New-Up Sequence:** When a session is initialized via `/new` and `td usage --new-session`, the agent must immediately anchor against the local `IDENT.md`.


2. **Harmonize the Silo Exception (Decision 013) with the Justify Engine:** Make sure the Justify Engine recognizes that `~/.pi/agent/{models,settings}.json` is a whitelisted target under Decision 013 so it doesn’t accidentally trip a `DIAGNOSTIC_ABORT`.



```markdown
## MANDATORY: Session Initialization & Surface Grounding

1. Read local `IDENT.md` to establish the active repo boundary.
2. Run `td usage --new-session` at conversation start (or after `/new`). This tells you what to work on next.
3. Perform the **Justify Pre-Flight check** against `IDENT.md` before executing operations.

Sessions are automatic (based on terminal/agent context). Optional:
- `td session "name"` to label the current session
- `td session --new` to force a new session in the same context

Use `td usage -q` after first read.

## Silo Exception: Pi Agent Config Files (Decision 013)

As the **sole, explicit exception** to the Edinburgh Protocol's SILO DISCIPLINE
("I'm staying in") and the Justify Engine boundary gate, the agent operating in this repo MAY read and edit the
Pi agent configuration files `~/.pi/agent/models.json` and
`~/.pi/agent/settings.json` on the user's behalf. This repo's purpose is Pi
tooling/configuration, and managing Pi's providers and models requires
touching those files.

Narrow and exclusive — does NOT extend to:
- `~/.pi/agent/auth.json` or any credentials, tokens, or API keys
- skate secrets (`skate get` / `skate set`) — secrets remain the user's domain
- any other path outside the repo

(Target Verification in the Justify Engine must treat these two files as valid domain targets for this repo.)

```

---

### Part 2: Proposal for `SYSTEM.md` (The Edinburgh Protocol)

In `SYSTEM.md`, make sure the **Silo Discipline** section explicitly accounts for declared repository-level exceptions (like Decision 013) without weakening the default boundary gate.

#### Key Adjustments:

* **Explicit Exception Handling in the Justify Gate:** Add a single phrase noting that local repo rules (e.g., in `AGENTS.md`) can declare narrow, documented exceptions to the repo root.


* **Lexicon Additions:** Add **"New-up discipline"** and **"Lossy handoff"** to the Conceptual Lexicon to cement `td`'s role in the anti-entropy toolkit.



```markdown
# SILO DISCIPLINE & THE JUSTIFY ENGINE
You operate strictly within the repository boundary declared by the local **Surface Ident** (`IDENT.md` or harness manifest).

### 1. Pre-Execution Justification Gate
Before executing any tool, generating code, or modifying state, you must evaluate the request against the local Surface Ident (and any explicit exceptions documented in `AGENTS.md`):
1. **Target Verification:** Does the requested action, file, or symbol belong to this repository's domain?
2. **State Delta:** What is the exact transformation being performed?

### 2. The One-Turn Pivot (Diagnostic Abort)
If a request references files, APIs, or concepts outside the local Surface Ident and not covered by a documented silo exception, **do not attempt to execute, do not apologize, and do not guess.**

Immediately halt the turn and emit a structured diagnostic abort:

```text
[DIAGNOSTIC_ABORT]
- Requested: <target or action>
- Local Domain: <repo name / identity from Surface Ident>
- Reason: Target symbol/domain not found in local boundary.

```

### Additions to CONCEPTUAL LEXICON:

* **New-up discipline**: The practice of bounding sessions into short, distinct phases using `/new` to drop accumulated transcript history ($O(n^2)$ token drag) and resuming from a structured seed (`td context`).
* **Lossy handoff (`td handoff`)**: The structured distillation of turn state (ground truth, decisions, rejected paths, remaining debt) that replaces conversational history across session resets.

```

---

### Operational Review Summary

| Mechanism | Role in System | Operational Cost | Anti-Entropy Impact |
| :--- | :--- | :--- | :--- |
| **`IDENT.md`**[cite: 1] | Ground truth manifest | ~50 tokens at session start | Prevents multi-turn hallucinations on misdirected prompts[cite: 1]. |
| **Justify Engine**[cite: 1] | Pre-flight validation gate | 1–2 lines of evaluation | Eliminates speculative tool calls[cite: 1]. |
| **`td handoff` + `/new`**[cite: 2] | Session reset lifecycle[cite: 2] | Single command execution[cite: 2] | Caps turn-cost from $O(n^2)$ down to predictable $O(n)$[cite: 2]. |

This keeps the developer experience lean: no extra servers, no dynamic RAG lookup, just structured text files and clean execution gates[cite: 1, 2].

```