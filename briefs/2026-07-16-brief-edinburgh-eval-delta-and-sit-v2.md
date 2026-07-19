# brief: Edinburgh Protocol eval — primed-vs-bare delta + Stuff-into-Things v2

**Created:** 2026-07-16
**Status:** in-progress
**Task:** td-02fea3
**Protocol:** Edinburgh Protocol v1.1.0

## What

A multi-phase experiment that evolved from "does the Edinburgh Protocol do anything?" into a full measurement-validation pipeline with two independent graders, a sign-test p-value, and a Stuff-into-Things capability eval. The work is substantially complete; the remaining work is running the resumable SIT v2 eval to completion and persisting the final membership review.

## Why

We had the protocol. We had no counterfactual. The question "does the protocol do anything?" demanded a bare-substrate control. That question led to a measurement-validity question ("is the keyword scorer measuring reasoning or format?"), which led to a triangulation question ("do independent graders agree?"), which led to a capability question ("does the Stuff-into-Things agreement hold at ingestion and delivery gates?"). Each phase surfaced the next. We went off-process (no brief, no epic) because each answer was exciting enough to chase immediately. This brief retrofits the process around work that is 80% done.

## How — what we built and ran

### Phase 1: Primed-vs-bare delta (keyword scorer)
- Added `--bare` and `--persist` flags to `src/cli/pi-check/edinburgh-eval.ts`
- Added `matrix` command to `scripts/eval.sh` — runs both conditions, shows delta
- Ran 25 models. **Net delta −0.28.** Protocol slightly hurts on average.
- Result persisted: `data/matrix-2026-07-16.md`
- Diagnosis: keyword scorer rewards format markers (bullet lists, hedging) that the protocol's philosophical register suppresses. Measuring format, not reasoning.

### Phase 2: Structured grader (Qwen 3.7 Plus)
- Added `--grade` flag with reasoning-quality rubric (6 criteria, max 16) explicitly instructed to ignore formatting
- Added `matrix-grade` command — runs both conditions with structured grader
- Ran 25 models. **Net delta +3.81.** 14/16 positive, 0 negative.
- Result persisted: `data/graded_matrix.jsonl`, `data/matrix-graded-2026-07-16.md`
- Grader infrastructure: `gradeResponse()` in `edinburgh-eval.ts`, supports `--grader` and `--grader-provider` flags

### Phase 3: Triangulation (Gemini 2.5 Pro second grader)
- Added `matrix-triangular` command — runs second grader, compares deltas
- Added `--grade-tag` flag for separate output files per grader
- Ran 25 models. **Net delta +4.24.** Zero directional disagreements with Qwen.
- Sign test: p < 0.001 under both graders independently
- Result persisted: `data/graded_matrix_gemini.jsonl`, `data/matrix-triangular-2026-07-16.md`

### Phase 4: Stuff-into-Things v1 eval (6 tests)
- Built fixture `prompts/stuff-into-things-v1.json` — ingestion gate (4 tests) + delivery gate (2 tests)
- Added ZenMux routing to `src/cli/pi-eval-runner.ts`
- Ran 22 models. Ingestion gate 96–100%. Contradiction trap 62%. Delivery gate 83–91%.
- Result persisted: `data/sit-eval-2026-07-16.md`

### Phase 5: Stuff-into-Things v2 eval (15 tests) — IN PROGRESS
- Added 9 new tests: contradiction flavor pack (SIT-007/008/009), delivery decisiveness (SIT-010/011), good-stuff-in delivery (SIT-012/013), DOT diagram tests (SIT-014/015)
- Added `dot_parse` assertion type to eval runner (uses graphviz `dot` binary)
- Fixture: `prompts/stuff-into-things-v2.json`
- **10 of 22 models complete (15/15). 11 at 6/15. 1 at 14/15.**
- Resumable script: `scripts/sit-eval-resumable.sh`

### Membership review
- `models/POKER-CLUB-MEMBERSHIP.md` — 16 Full Members, 5 Probationary, 1 Denied (GPT-5)
- Scores, strengths, weaknesses across all eval directions

## Acceptance criteria

- [x] Primed-vs-bare delta measured (keyword scorer)
- [x] Structured grader added and run (Qwen)
- [x] Triangulation with second grader (Gemini)
- [x] Sign-test p-value computed (p < 0.001)
- [x] Stuff-into-Things v1 fixture built and run (6 tests, 22 models)
- [x] Stuff-into-Things v2 fixture built (15 tests, 9 new)
- [x] `dot_parse` assertion type added to eval runner
- [x] Resumable eval script built (`scripts/sit-eval-resumable.sh`)
- [x] Membership review persisted (`models/POKER-CLUB-MEMBERSHIP.md`)
- [ ] SIT v2 eval complete (all 22 models at 15/15)
- [ ] SIT v2 results tabulated and commented
- [ ] Membership review updated with SIT v2 data
- [ ] Debrief written

## What's left

1. **Run `bash scripts/sit-eval-resumable.sh` to completion.** It skips the 10 complete models, runs the 12 incomplete ones. ~90 minutes.
2. **Tabulate SIT v2 results** — per-test and per-model pass rates, with commentary on the new contradiction flavors, delivery decisiveness, and DOT tests.
3. **Update membership review** with SIT v2 data (the v1 review is already written; v2 adds 9 more data points per model).
4. **Write debrief** — what we learned, what went wrong (going off-process), what to do differently.

## Files created/modified

**Modified:**
- `src/cli/pi-check/edinburgh-eval.ts` — `--bare`, `--persist`, `--grade`, `--grader`, `--grader-provider`, `--grade-tag` flags; `BARE_SYSTEM`, `GRADER_RUBRIC`, `gradeResponse()`
- `src/cli/pi-eval-runner.ts` — ZenMux routing, `dot_parse` assertion, `evaluateAssertions` async, `sit2` fixture
- `scripts/eval.sh` — `matrix`, `matrix-grade`, `matrix-triangular` commands
- `justfile` — eval docs updated
- `data/README.md` — `scoring_matrix.jsonl` and `graded_matrix*.jsonl` schema

**Created:**
- `prompts/stuff-into-things-v1.json` — 6-test fixture
- `prompts/stuff-into-things-v2.json` — 15-test fixture
- `scripts/sit-eval.sh` — original (non-resumable) SIT eval script
- `scripts/sit-eval-resumable.sh` — resumable version
- `data/matrix-2026-07-16.md` — keyword scorer results
- `data/matrix-graded-2026-07-16.md` — Qwen grader results
- `data/matrix-triangular-2026-07-16.md` — triangulation results
- `data/sit-eval-2026-07-16.md` — SIT v1 results
- `models/POKER-CLUB-MEMBERSHIP.md` — membership review
- `data/scoring_matrix.jsonl` — keyword scorer matrix data
- `data/graded_matrix.jsonl` — Qwen grader matrix data
- `data/graded_matrix_gemini.jsonl` — Gemini grader matrix data

## Honest notes

- We went off-process. No brief, no epic, no td task until now. The work is sound but the process debt is real.
- The eval runs are long (15 tests × 22 models × ~30s/test = ~2.5 hours). Resumability fixes the frustration of losing progress to aborts.
- The keyword scorer is deprecated for reasoning assessment but retained for format analysis. It measures something real (format change) but not the thing we care about (reasoning quality).
- The grader self-referential bias (graders are in the pack) is acknowledged but unresolved. Triangulation with two graders of different architectures is the mitigation, not the cure.
