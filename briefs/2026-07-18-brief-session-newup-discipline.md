---
type: brief
id: session-newup-discipline
status: active
date: 2026-07-18
lesson_cost: $46
---

# Brief: Session Newup Discipline — the $46 Lesson

## What happened

A single session ran too long without a context reset. Every turn re-sent the
full conversation history to the model. Megabytes of accumulated transcript
were slung on every turn. The bill hit **$46**.

The session should have been newed up — `/clear` or a fresh session — roughly
**half a dozen times**. It wasn't.

## The systems problem (not the villain problem)

This is a structural incentive failure, not a memory lapse:

- **Quadratic cost.** A conversation of *n* turns, each re-sending the growing
  history, costs *O(n²)* in input tokens. A long session doesn't just get
  expensive at the end — it gets expensive *per turn* as it grows.
- **The agent has no skin in the game.** It never sees the bill. It will
  happily carry 200K tokens of barnacles into turn 201. Cost pressure lives
  entirely with the human.
- **Human memory is the wrong control.** "Remember to new up" is a rule
  enforced by the party least able to feel the marginal cost in the moment.

## The fix

Newup is not a memory test — it is a **phase boundary**. The discipline pairs
with the handoff mechanism that already exists:

1. **Work in bounded phases.** A phase is a logical unit of work, not a time
   interval.
2. **Handoff at the phase boundary.** `td handoff` captures the compressed
   state — ground truth, rejected hypotheses, remaining debt.
3. **New up.** Fresh context. The handoff is the seed; the megabytes are
   dropped.
4. **Resume from handoff.** The new session reads `td context` and continues.

This is the bounded-context idea (brief 010) applied to the session itself.
The locus tags (`[LOC:]` / `[WAYPOINT:]`) exist precisely so a fresh session
can navigate a long prior dialog — they were designed for this.

## Rule of thumb

If you've completed a logical unit of work **and** the context is feeling
heavy, new up. Half a dozen newups in a long session is not excessive — it is
the difference between *O(n²)* and *O(n)*. The handoff is the lossy
compression; the raw transcript is the entropy.

## What's left

- Surface this in `AGENTS.md` as an operational guideline (candidate for the
  Operational Guidelines section).
- The parked token-compaction-hook brief (2026-07-12) sketched an automated
  compaction pass at `td handoff`. This brief is the manual discipline that
  makes automation worth building — the $46 is the proof.
