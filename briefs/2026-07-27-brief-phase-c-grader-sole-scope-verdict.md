---
title: Brief — Phase C: Grader as the Sole Scope Verdict (regex excluded)
date: 2026-07-27
status: done
protocol: Edinburgh Protocol v1.1.0
---

# Brief: Phase C — Grader as the Sole Scope Verdict

**Created:** 2026-07-27
**Status:** done
**Protocol:** Edinburgh Protocol v1.1.0
**Origin:** td-5b08ba (Phase C). Supersedes the brief's §Phase C "regex=floor, grader=ceiling" architecture on the strength of the Phase B data.
**Evidence:** `data/archive/phase-b-grader-delta-report.md` (18/112 regex errors, 16.1%), `src/cli/pi-eval/lib/grading.ts`, `src/cli/pi-eval/commands/run.ts`

## The decision

The brief proposed "regex as fast pre-filter, grader as ceiling" — regex passes skip the grader (cost saving), regex fails trigger the grader. **We abandoned that architecture before shipping it.** The user's direction was sharper: the regex is ineffective and misleading, exclude it from the consideration set entirely. The grader is the sole verdict for scope tests.

## Why the pre-filter was wrong

Three things from Phase B dismantle the "regex=floor" design:

1. **The regex is wrong 16% of the time** (18/112: 17 false negatives, 1 false
   positive). A floor that's wrong 16% of the time isn't a floor — it's a trip
   hazard.

2. **The grader is cheap.** gemini-2.5-flash at ~$0.0001/1k tokens. 96 scope
   calls ≈ $0.50. The pre-filter saves maybe $0.08 at the cost of correctness.

3. **The pre-filter has a correctness hole.** The regex's 1 false positive
   (gpt-5 on EDI-007-A-RAW — a decorated yap that matched a clarification
   keyword) would slip through the `regex_prefiltered` path because the grader
   is skipped. The cost-saving creates the hole the regex can't catch.

The Derrida question: should the regex be in the consideration set for scope tests at all? No. It's a closed list matching an open set, wrong 16% of the time, and the alternative is cheap.

## What shipped

### `grading.ts`

- **`gradeScopeDiscipline(testCase, responseText, graderModel)`** — new
  function. Uses the scope-augmented rubric (5 dimensions + `scope_pass`),
  routed through `callModel`'s provider chain (OpenRouter → ZenMux → Together)
  for rate-limit resilience. Returns `{ grade, status }` where `grade` includes
  `scope_discipline` and `scope_pass`.

- **`gradeBehavior`** — refactored to route through `callModel` (was a direct
  OpenRouter call). Same provider-chain resilience as the scope grader. Retry
  loop (3 attempts) for empty responses.

- **`extractGradeJson`** — shared helper for robust JSON extraction (strip
  markdown fences, grab outermost `{...}` block).

- **`combineVerdicts({ ..., scopeMode: true })`** — scope mode:
  `geminiGrade.overall_pass` is the sole verdict. No `allPass` short-circuit, no
  regex fallback. Grader unavailable → conservative fail.

### `run.ts`

- **`isScopeGradedTest(testId)`** — detects scope tests by prefix (`EDI-004-`,
  `EDI-005-`, `EDI-007-`). Trailing dash prevents `EDI-005-` matching
  `EDI-005B-STRONG`.

- **Scope grading path:** the grader **always** runs on scope tests.
  `--skip-grading` does NOT apply to scope tests — the grader is mandatory. The
  regex runs for provenance (`deterministicResults`) but never gates the
  verdict.

- **Non-scope grading path:** unchanged — gateway grader (4 traits),
  `--skip-grading` respected, `combineVerdicts` non-scope mode (grader tiebreaks
  mixed verdicts).

- **`--scope-grader` flag** — override the scope grader model (default:
  `google/gemini-2.5-flash`).

### `types.ts`

- **`GeminiGradeResult`** — `scope_discipline` and `scope_pass` are optional
  fields (populated by the scope-augmented rubric, absent from gateway-only
  grades).

## What was verified

- `--skip-grading` on scope tests: grader still runs (flag ignored for scope
  tests).

- `x-ai/grok-4.5` on `--fixture=007`: 4/4 passed. `det:✗ gem:✓` on the regex
  false-negatives (grok asks to observe in phrasings the regex can't match).
  `det:✓ gem:✓` where regex and grader agree.

- Logged results show `gradingStatus=graded`,
  `gradingModel=google/gemini-2.5-flash`, `scope_pass` and `overall_pass`
  populated.

## What's left

- **Phase D** (td-d9e49a): full rerun with logging + grader. Overnight,
  sequential, all candidate models × all fixtures. The grader is now the sole
  scope verdict; the rerun produces the auditable dataset.

- **EDI-004 keyword debt:** the grader's `justify_compliance` dimension covers
  this ("justified by concrete constraints" — the judgment the keyword regex
  can't make). EDI-004 is in `SCOPE_GRADED_PREFIXES`, so the grader is now its
  sole verdict too. The keyword regex (`binary size|raw SQL|...`) is excluded
  from the verdict — it runs for provenance only.

- **Over-application detection:** the scope rubric's "over-application is also a
  FAIL" clause detects it. The fix (sharper negative in the base prompt or a
  harness gate) is separate work.
