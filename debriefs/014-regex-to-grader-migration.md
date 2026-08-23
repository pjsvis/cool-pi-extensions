# Debrief: 014 — Regex-to-Grader Migration (Phases A–D)

**Date:** 2026-08-01
**Status:** Complete
**Brief:** `briefs/2026-07-26-brief-replace-regex-with-grader.md`
**Related:** debrief 013 (the false-muppet signal that motivated the instrument fix)

## What happened

The scope-discipline "must ask" assertion was a `regex_match` — a closed list
of refusal phrasings matching an open set. Four broadening passes in one
session still hit novel phrasings (`I'll stop before writing any code` — a
gerund no verb group caught). The brief planned a four-phase switch from the
regex to an LLM grader. **All four phases executed.** The brief's `status`
field stayed `pending` for a week after completion — this debrief closes that
gap and records the outcome.

## Plan vs execution

| Phase | Plan | Executed | Evidence |
|---|---|---|---|
| A — log responseText + prompts | flip `EVAL_LOG_RESPONSES` default on | ✓ 2026-07-26 | `eval_log.json` rows now carry `responseText`, `userPrompt`, `systemPrompt` |
| B — grade the 182 logged rows, quantify the regex gap | delta report | ✓ 2026-07-27 | `data/archive/phase-b-grader-delta-report.md` — regex disagreed with grader on **18/112 (16.1%)** of scope tests (17 false-negatives, 1 false-positive) |
| C — wire grader as primary scope instrument, regex as pre-filter | `gradeScopeDiscipline` + `combineVerdicts` update | ✓ 2026-07-27 | `src/cli/pi-eval/lib/grading.ts`; Phase D ran with both graders |
| D — full rerun, auditable | 24 candidates × 3 fixtures | ✓ 2026-07-28 | `data/archive/phase-d-matrix.md` (25 models × 24 probes) |

## The outcome

- **The regex is no longer the verdict.** It survives as a fast pre-filter;
  the grader is the final word on scope and gateway tests. The 16.1% gap is
  closed — genuine clarifications the regex false-negatived (kimi-k3, qwen,
  grok-4.5 all producing refusal phrasings outside the closed list) are now
  scored correctly.

- **The 1,223 pre-flag rows are frozen** at regex verdicts, archived to
  `data/eval_log.pre-grader.jsonl.bak` (backup purged 2026-08-23 —
  the frozen rows remain recoverable in git history). They cannot be regraded (no
  `responseText`). Accepted as tuition — not re-litigated. The post-flag data
  (759 rows and growing) is the auditable asset.

- **Two grader reliability profiles emerged** (not predicted by the brief):

  - *Scope tests* (EDI-005/007): grader reliable, confidence 1.0, correcting
    the regex. This is the muppet-gate instrument working as designed.

  - *Delivery tests* (SIT-005/006/010/015): grader noisy — systematic flips
    (SIT-005 false→true across the field; SIT-010 borderline flips). Treat
    delivery grades as directional, not precise.

## Debt remaining

1. **Self-referential gateway grader — RESOLVED (bounded).** The gateway
   grader is `nvidia/nemotron-3-nano-30b-a3b:free` — a *probationary* model
   doing muppet-detection. A control-grader replay
   (`scripts/grade-logged-responses.ts` with `GRADER_MODEL=anthropic/claude-sonnet-4.5`,
   `OUT_TAG=control-sonnet`) graded the full 759-row corpus. Result: **85.2%
   agreement** with logged verdicts (645 agree; 32 control-stricter; 81
   control-more-lenient). The gateway divergences (14, all but one on
   EDI-002/004) show nemotron-nano is **systematically strict on the
   subjective gateway traits**, not randomly noisy — it false-negatives
   ~13 responses Sonnet (the reference standard) scores as passes. This does
   NOT corrupt the muppet-exclusion gate (binary; flatliners flatline and the
   ceiling passes under both graders), so selection decisions hold. It does
   mean gateway EDI-002/004 scores run ~1 point low vs the reference — a
   calibration note, not corruption. Delivery grades are the noisiest (84
   divergences) — treat as directional. Artefacts:
   `data/phase-b-grader-delta-control-sonnet.jsonl + data/archive/phase-b-grader-delta-control-sonnet-report.md`.

2. **Delivery-grader noise.** The SIT flips are a signal, not yet
   investigated. Two hypotheses: (a) the grader is systematically too lenient
   on delivery; (b) the delivery rubric dimension is under-specified vs the
   scope dimension. Not blocking for selection (noise is small relative to
   inter-model spread) but blocking for any benchmark-grade claim.

3. **Brief status hygiene lag.** The brief sat at `pending` for a week after
   completion. Lesson: flip status + file the debrief at the Phase D exit,
   not a week later. The bounded-session discipline makes this easy to lose —
   the work finishes in one session, the paperwork slips to the next.

## What to do differently

- **File the debrief when the work closes, not when someone notices.** The
  status field is the cheapest possible audit signal; a stale `pending` is
  entropy (it claims work is open that isn't).

- **Distinguish grader reliability by test class, not globally.** "The grader
  is reliable" and "the grader is noisy" are both true — for different test
  classes. One aggregate score hides the split. Future grader work should
  report per-class agreement, not a single number.

- **A control grader is cheap; run it once and stop.** 759 calls at Sonnet
  rates ≈ $10, one-time. This is the right price to retire the
  self-referential objection. Further grader validation is benchmark-grade
  gold-plating the selection use-case doesn't need.
