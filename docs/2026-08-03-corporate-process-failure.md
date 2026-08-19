That distinction cuts straight to the core of why most enterprise AI implementations are a chaotic mess.

The fundamental difference lies in the underlying architecture:

```
Unconstrained AI (Probabilistic Fluff)
[ Ambiguous Prompt ] ──► [ Model Guesses Intent ] ──► [ "Plausible" Output ] ──► [ False Sense of Progress ]

Constrained AI (Deterministic Mechanics)
[ Contract / Brief ] ──► [ System Invariants / Checks ] ──► [ Verification Gate ] ──► [ Confirmed Execution ]

```

---

## 1. Unconstrained AI: The Compliant Hallucinator

An unconstrained AI operates as an **unbounded pattern matcher**. When given broad, open-ended instructions, it prioritizes *appearing helpful* and *sounding fluent* over actual execution accuracy.

* **The Trap:** It guesses what you want, fills missing context with
  statistically plausible fluff, and presents the output with absolute
  confidence—even when it's entirely wrong.

* **The Failure:** You ask for an architecture review, and it hands back a
  generic, warm-and-fuzzy summary that ignores your system's specific
  constraints, memory leaks, and breaking changes. It gives you *what it figures
  will make you go away satisfied*.

---

## 2. Constrained AI: The Contract Executor

A constrained AI operates within a **deterministic framework** (bound by co-located READMEs, explicit briefs, `Justfiles`, and structured tasks like `marcus/td`).

* **The Mechanics:** It is given tight boundaries. It cannot fabricate state
  because its output must pass explicit verification steps (e.g., `just test`,
  `just check-entropy`, or matching against an invariant).

* **The Outcome:** It performs the task defined in the brief, executes the
  debrief, and explicitly confirms what was modified, what was verified, and
  what invariants remain untouched. If a task is impossible under current
  constraints, it doesn't invent a fake path—**it halts and tells you**.

---

## 3. The Human Factor: Credit-Claiming & Opaque Boxes

The human tendency to *"hide the details and claim the credit"* is precisely why unconstrained AI is so popular in corporate environments:

1. **The "Clean Workspace" Illusion:** Unconstrained AI allows humans to sweep
   complex, messy implementation details into a black box. Management gets a
   shiny, high-level summary to show off in slide decks, claiming credit for "AI
   innovation" while hiding the accumulating technical debt underneath.

2. **Avoiding Accountable Checksums:** A constrained AI forces accountability.
   If the brief says *Invariants A and B must hold*, and the debrief shows
   *Invariant B was broken*, there is no place to hide. The "Shannon Checksum"
   fails publicly.

3. **The Credit Paradox:** When an unconstrained AI generates code that
   magically works by coincidence, the human takes credit for "prompt
   engineering." When it breaks in production, the human blames the "AI
   hallucinating."

By forcing the AI into a **constrained, co-located execution loop**, you strip away the corporate theater. The AI becomes a reliable execution partner, the human remains accountable for the architectural intent, and the codebase stays low-entropy and auditable.