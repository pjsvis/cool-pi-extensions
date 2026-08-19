# brief: Staged Delivery with Replanning — and the Derrida-as-Probe pattern that produced it

**Created:** 2026-08-08
**Status:** active — method codified from existing practice; meta-pattern named
**Protocol:** Edinburgh Protocol v1.1.0
**Related:** `briefs/010-bounded-context-for-agents.md`, `decisions/015-bounded-context-entry.md`, `briefs/2026-07-14-brief-locus-tag-consumer.md`, AGENTS.md §"Bounded Tasks & Session Newup Discipline"; lexicon: *the Derrida question*, *predictably adequate*, *the moat question*, *benchmaxxing*, *no muppets*

## What

A named method for running bounded, low-cost, multi-phase work — and the recurring meta-pattern that keeps producing improvements to it.

**The method — staged delivery with replanning.** Take a brief (the *why* + rejected paths — the taste layer) and convert it to a phased `td` epic (the *what* + *next* — the tactic layer). Execute one task per fresh `/new` session. Each `td` task carries: a **gate** (the external "done" condition), a **token estimate**, and **references** to the brief/epic and any sibling tasks it depends on. At each phase boundary — each `/new` — re-derive the dependency graph from current `td` territory (`td context` / handoff), not from the brief's prediction. If the territory mismatches what the epic assumed, route *back* to brief/epic revision; do not press forward into a stale plan.

It is *not* "agile waterfall." It is **staged delivery with replanning**: waterfall for the dependency ordering, agile for per-task content on arrival, one-task-per-session for cost, no ceremony.

**The meta-pattern — Derrida-as-probe.** We regularly ask the Derrida question ("should this even be in our consideration set?") of some novel piece of external kit. The value of the exercise is *not* adopting the kit. It is that the questioning surfaces ways to tighten our existing process. **The kit is the probe, not the prize.** This brief is itself the artifact of one such cycle — the kit was `PrimeIntellect-ai/prime-agent`.

## Why

**Cost.** One task per `/new` is the literal mechanism that breaks O(n²) context growth — the meter that climbs faster than the work. Staged delivery is the same discipline as bounded context (`010`) and session-newup (AGENTS.md), unified and made explicit. There is no separate "autonomy budget" to engineer: bounded context *is* the budget.

**The prime-agent comparison (the probe, this cycle).** prime-agent is a pi derivative adding a self-improving "Continual Harness" (`/refine`), persistent goals, daemon-backed background sessions, heartbeats, and bounded autonomous mode. The Derrida question, asked honestly, answers *no* for a HIL shop:

- The self-improving harness optimises session-local reward — *benchmaxxing at
  the meta-layer*. It learns to flatter the task, not to serve the operator. The
  taste layer (briefs, lexicon, rejected paths) cannot be derived from any
  signal the trajectory exposes; it stays HIL because that is the only place it
  can live.

- Daemon continuity removes the human from the loop — a liability, not a
  feature, when the human *is* the impartial spectator the automated loop cannot
  manufacture.

- The genuinely interesting part — the Recursive Language Model (persistent
  IPython, sub-LLMs as function calls, answer-as-variable) — is orthogonal to
  the harness and is not a free win. Their own ablations show it *helps*
  long-context / token-heavy work (DeepDive, Oolong) and *hurts* simple tasks
  (math-python). The scaffold taxes everything that doesn't need delegation.

**The recurring move.** Each time we run this probe we don't import the kit — we tighten the substrate we already own. prime-agent's `/refine` is the automated analogue of our manual brief discipline; recognising that consolidated briefs, `td`, and `/new` into one named method. The probe paid for itself without the procurement.

## How

**Decompose (its own phase; highest leverage).** Brief → phased `td` epic, in its own session, behind its own gate: does the epic cover the brief's intent? are the rejected paths still rejected? Don't fold this into "task 0" — decomposition quality sets the ceiling for everything downstream.

**Per task, set:**
- A **gate** — the external "done" condition (tests pass, diff reviewed, file
  exists). "Done" means "a gate passed," never "the model said so." (Cf.
  prime-agent's honest caveat: a passed gate checks only what that gate
  verifies.)

- A **token estimate** — a guess, deliberately rough. The value is not forecast
  accuracy; it is (a) forcing task-sizing before execution, which catches "this
  is three tasks" early, and (b) the *running error* (actual vs estimated) tunes
  decomposition granularity. If estimates keep blowing, phases are too coarse.
  Log it.

- **References** — to the brief, the epic, and any sibling task it depends on.

**Execute** one task per `/new`. Keep sessions bounded; the cost discipline *is* the phase discipline.

**At each phase boundary**, before the next task: re-derive the dependency graph from `td` territory. The brief is the intent; `td context` is the territory. Trust the territory.

**Replan trigger** (named, or "agile" silently becomes "waterfall"): when `td context` for the next task does not match the territory the epic assumed, route back to brief/epic revision. Do not execute a stale plan because replanning feels like overhead.

**Calibration — read the next task against these five axes; phase granularity, gate density, and replan frequency fall out:**

1. **Task novelty** — novel work wants thinner phases and more replanning;
   familiar work runs longer between gates.

2. **Coupling density** — tightly-coupled changes need finer decomposition and
   harder boundary re-derivation; independent work batches.

3. **Reversibility** — throwaway output permits coarse phases;
   architecture-committing output demands finer gates.

4. **Cost sensitivity** — the reason the discipline exists. Relax the constraint
   and the edifice loosens.

5. **Model trust on this class of work** — the *no-muppets* filter applied
   per-task. High-trust tasks roam further before a gate.

This is what "it depends" means once you've named what it depends on. Unqualified, "it depends" is a shrug; against these five, it is a spec.

## Acceptance / adoption criteria

- The method is **named and citable** — future briefs and decisions reference
  "staged delivery with replanning" rather than re-deriving it.

- The **five axes** are the read-before-decomposing checklist for any new epic.

- The **replan trigger** is a recognised phase-boundary action, not an ad-hoc
  decision.

- **Token actual-vs-estimated** is logged (td note, log, or field) so
  decomposition granularity self-tunes.

- The **Derrida-as-probe** pattern is recognised as a deliberate, repeatable
  move: when we evaluate external kit, the deliverable is the
  tightened-own-process brief, whether or not the kit is adopted.

## Out of scope

- **Importing prime-agent's machinery** — daemon-backed sessions, heartbeats,
  autonomous mode, `/refine`. The Derrida question answered *no*; do not
  re-litigate without new territory.

- **An auto-curating harness.** The taste layer stays HIL. The mechanical half
  (skill / subagent-spec proposals at session end) is a possible future
  extension, but the *accept* decision stays human — that is the
  impartial-spectator seat.

- **A universal workflow.** The method is deliberately "it depends," calibrated
  by the five axes. Codifying a single fixed pipeline would be dogma — the thing
  the Protocol exists to refuse.
