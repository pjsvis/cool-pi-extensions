# Decision 022: Drop the regex eval — grader is the sole behavioral verdict

**Date:** 2026-07-27
**Status:** Accepted
**Supersedes:** the regex assertion engine as a behavioral verdict (not as a structural check)
**Epic:** td-2a3099 (Replace the regex with the grader)
**Brief:** [2026-07-26-brief-replace-regex-with-grader.md](../briefs/2026-07-26-brief-replace-regex-with-grader.md), [2026-07-27-brief-phase-c-grader-sole-scope-verdict.md](../briefs/2026-07-27-brief-phase-c-grader-sole-scope-verdict.md)
**Evidence:** [data/archive/phase-b-grader-delta-report.md](../data/archive/phase-b-grader-delta-report.md) (18/112 regex errors, 16.1%)

## Context

The Edinburgh Protocol eval engine had two behavioral instruments:

1. **Deterministic regex assertions** (`regex_match` / `regex_exclude`) — a
   closed list of phrasings: "I can't design", "before I can propose", "I won't
   assume", etc. Every model produces different phrasings. In a single session
   we broadened the regex four times (Phase 2.1, Phase 4 v3, Phase 4 v4,
   substrate curly-quote fix) and still hit new phrasings (minimax-m3: "I'll
   stop before writing any code").

2. **LLM grader** (`gradeBehavior` in `grading.ts`) — calls a grader model with
   the response, the test, and a rubric. Returns a structured pass/fail with
   evidence per dimension.

Phase B re-graded 182 logged responses with a scope-augmented rubric and quantified the gap: **the regex was wrong on 18/112 scope-test rows (16.1%)** — 17 false negatives (genuine clarifications the regex missed) and 1 false positive (a decorated yap the regex accepted). The regex is a closed list matching an open set. It will never be robust.

## Decision

**The regex is dropped as a behavioral verdict for all Edinburgh tests.** The grader is the sole behavioral instrument. Structural assertions (`tool_execution_required`, `dot_parse`) are kept — the grader cannot verify whether tools were actually called or whether DOT code parses in graphviz.

### What was removed

- **`--skip-grading` flag** — there is nothing to skip; the grader is the verdict.

- **`regex_match` / `regex_exclude` assertions from all Edinburgh fixtures**
  (EDI-001 through EDI-007 variants). 26 regex assertions stripped across 5
  fixture files.

- **`combineVerdicts` scopeMode** — Edinburgh tests no longer use
  `combineVerdicts`; the verdict is `structuralPass AND grader.overall_pass`.

- **The `isUnprimed` special case** — the grader correctly fails raw-model
  yapping; no deterministic-only path needed.

- **The `regex_prefiltered` grading status** — no pre-filter; the grader always
  runs on Edinburgh tests.

### What was kept

- **`tool_execution_required`** — structural, not behavioral. The grader can't
  verify tool calls.

- **`dot_parse`** — structural (graphviz execution). The grader can't run
  graphviz.

- **SIT/IQ deterministic assertions** — the grader rubric doesn't cover
  SIT-specific traits (amplification refusal, contradiction detection) or IQ
  correctness checks (is the answer 56?). These fixtures keep
  `regex_match`/`regex_exclude` and `combineVerdicts` (grader tiebreaks mixed
  verdicts). Phase B did not cover them; stripping without a replacement rubric
  would leave them with no valid verdict.

### What was added

- **`gradeScopeDiscipline`** — the scope-augmented rubric (5 dimensions +
  `scope_pass`), routed through `callModel`'s provider chain. Used as the sole
  verdict for all Edinburgh tests.

- **`--scope-grader` flag** — override the scope grader model (default:
  `google/gemini-2.5-flash`).

- **Mock grader** — `EVAL_GRADER_MOCK=1` gates a deterministic mock that reads
  `data/grader-mock.json` (testId → verdict). Tests the full wiring without API
  calls. Both pass and fail paths are configurable.

- **`isEdinburghTest`** — replaces `isScopeGradedTest`. All `EDI-*` tests use
  the scope grader as the sole behavioral verdict.

## Why not the brief's "regex=floor, grader=ceiling"

The brief proposed regex as a fast pre-filter (regex pass → skip grader for cost saving; regex fail → grader as final verdict). Three things from Phase B dismantle this:

1. **The regex is wrong 16% of the time.** A floor that's wrong 16% of the time
   isn't a floor — it's a trip hazard.

2. **The grader is cheap.** gemini-2.5-flash at ~$0.0001/1k tokens. 96 scope
   calls ≈ $0.50. The pre-filter saves maybe $0.08 at the cost of correctness.

3. **The pre-filter has a correctness hole.** The regex's 1 false positive
   (gpt-5 on EDI-007-A-RAW — a decorated yap that matched a clarification
   keyword) would slip through the `regex_prefiltered` path because the grader
   is skipped. The cost-saving creates the hole.

The Derrida question: should the regex be in the consideration set for Edinburgh tests at all? No. It's a closed list matching an open set, wrong 16% of the time, and the alternative is cheap.

## The distinction: behavioral vs structural

The regex was a *behavioral* check — "did the agent ask to observe?" — attempting a judgment via pattern matching. The grader makes the same judgment via reasoning. That's the replacement.

`tool_execution_required` and `dot_parse` are *structural* checks — "did the model actually call tools?" / "does the DOT parse?" — verifying facts the grader cannot verify from text alone. These are not regex, not behavioral, and not replaced.

## Consequences

- **Edinburgh tests are grader-sole.** No deterministic behavioral verdict. The
  regex runs for nothing (it's stripped from the fixtures).
  `deterministicResults` is empty for most Edinburgh tests (populated only for
  EDI-002 and EDI-005B-STRONG, which have `tool_execution_required`).

- **SIT/IQ are unchanged.** They keep `combineVerdicts` and their deterministic
  assertions. The grader rubric doesn't cover their traits. This is a known gap
  — flagged, not fixed.

- **Mock mode (`EVAL_GRADER_MOCK=1`)** enables deterministic testing of the full
  pipeline without API calls.

- **Pre-flag data (1,223 rows without `responseText`) is frozen at regex
  verdicts.** Phase D will produce replacement data with grader verdicts. The
  pre-flag rows will be archived then.
