# Audit Trail and Bibliography

**Everything in this audit is traceable. Here's where to go to verify a claim, run your own evals, or understand the infrastructure.**

Every number in the [main audit post](./2026-07-03-edinburgh-protocol-18-month-audit.md) and the [scoreboard](./2026-07-03-edinburgh-protocol-scoreboard.md) traces back to one of the artifacts below. No assertions without a receipt.

---

## The Eval Infrastructure

### `src/cli/pi-check/edinburgh-eval.ts`

The eval harness. Run it directly to test any model:

```bash
cd src/cli/pi-check
bun run edinburgh-eval.ts <model-tag>          # single model
bun run edinburgh-eval.ts --all                # all configured models
bun run edinburgh-eval.ts <model> --json       # machine-readable output
```

The tool injects the Edinburgh Protocol system prompt, runs the 4 trap vectors and 8 IQ tests, grades via Nemotron 3 Nano (free tier, routed through OpenRouter — avoids the £200 billing incident), and writes results to `data/eval_log.json`. Concurrent execution by default. 168h cache per model — repeated evals are free until the cache expires.

If you're evaluating a new model for your stack, this is the first thing to run. The `model_select` hook warns when switching to a model with critical failures, but the tool doesn't block — the human always has the final say.

### `data/eval_log.json`

Append-only JSONL log of every individual test result. Tracked in git, visible across machines and clones. Each entry has: `runId`, `modelId`, `testId`, `passed`, `gradingStatus`, `gradingModel`, `trajectory` (response length, duration, tool call count), `timestamp`, `evalSuiteVersion`.

This is the audit trail. Every number in the scoreboard and the main post traces back to a line in this file. If you're verifying a claim, start here. If you're adding a model, the results land here automatically.

Example query — all results for a specific model:

```bash
grep 'deepseek/deepseek-r1' data/eval_log.json | jq .
```

### `data/eval_runs.jsonl`

Run metadata — one entry per eval invocation. Contains: `runId` (matches `eval_log.json`), `timestamp`, `fixture` (edinburgh or iq), `models` array, `graderModel`, `passedTests`, `failedTests`, `skippedTests`, `durationMs`.

Use this to track variance over time. If a model that passed last month fails this month, this file tells you when the run happened and how long it took.

---

## Prior Art

### `docs/edinburgh-protocol-eval.md`

The Q2 2026 audit — 22 models, the original scoreboard, written by DeepSeek V4 Pro (one of the models in the eval). This is the document that established the Protocol as an evaluation tool. It introduced the scoring rubric (8 criteria, 19 points max), documented the four regression cases, and argued the benchmaxxing thesis from first principles.

If you want the full prior context — the methodology as it was originally conceived, the Q2 scoreboard, the model-by-model analysis that this current audit builds on — start here. The current audit references this document throughout; it doesn't replace it.

### `docs/model-eval-bankruptcy.md`

The philosophical companion piece. Filed as a reaction to the Q2 results, it argues the case for behavioral evaluation over benchmark scores in stronger terms: benchmarks measure performance, traps measure utility. A model can ace benchmarks and fail the sycophancy trap. The gap is large enough to matter.

The title is the thesis: models that have been optimized for benchmarks have committed intellectual bankruptcy — they're confident, well-structured, and completely hollow. The benchmark score shows 85%. The actual utility is considerably lower.

Worth reading if you want the argument behind the methodology. Less useful if you just want the numbers.

### `debriefs/003-protocol-evals.md`

The build debrief — what was built, what worked, what we'd do differently. Filed June 9, 2026 after the eval infrastructure shipped. Covers three architectural decisions that proved important:

1. **State machine over async deadlock** — Pi's command handlers and agent loop share the same event loop; you can't await an agent turn from inside a command handler. The fix was a module-scope state machine driven by event hooks. This is now the standard pattern.

2. **Two-pass grading** — deterministic floor (regex + tool traces, zero tokens, never hallucinates) + Gemini Flash secondary grading (slower, costs tokens, catches subtleties). The combination means the system never degrades below the quality of deterministic checks.

3. **OpenRouter over direct Gemini API** — after a £200 billing incident with the direct Gemini API, the grader was routed through OpenRouter. Same model, same quality, user's own rate limits and cost controls.

If you're modifying the eval infrastructure, read this first. It tells you why things are built the way they are, and what the known failure modes are.

### `docs/edinburgh-protocol-evals.md`

The trap vector specification — the canonical definition of EDI-001 through EDI-004, the assertion logic, the grading rubric, and the pass/fail criteria. If you want to understand what a trap tests and why, this is the source.

Also contains the method for how grading works — the two-pass system, the verdict combination table, the role of the grader model.

---

## Model Registry

### `models/models.json`

The living model registry. 26 models with eval data, provider, cost, release date, and status. Updated June 21, 2026. If you want to check the current state of any model we've tested — its OpenRouter ID, its cost per million tokens, its Edinburgh score — this is the file.

Format: JSON, one entry per model, with `id`, `name`, `provider`, `edinburghScore`, `iqScore`, `edinburghDetail` (per-trap breakdown), `status` (recommended / watch / deprecated), `cost`, `speed`, `notes`, and links to supporting docs.

### `models/RECOMMENDED.md`

The current decision tree. Tiered recommendations (Premium / Mid-Tier / Free), the current top performers, the models that have been dropped and why, provider access table, and the changelog.

This is the file to check if you're choosing a model for a new task. It gives you the short answer. `models.json` gives you the detail.

### `models/COMPLETE-ASSESSMENT.md`

The comprehensive Q2 summary — full benchmark results, version history analysis, the narrative about why the eval system was built in the first place. Longer than `RECOMMENDED.md`; more context. Useful if you're coming to the work fresh.

---

## Key Links

| Artifact | Purpose |
|---|---|
| [`src/cli/pi-check/edinburgh-eval.ts`](https://github.com/pjsvis/cool-pi-extensions/blob/main/src/cli/pi-check/edinburgh-eval.ts) | Run the eval yourself. `bun run edinburgh-eval.ts <model>` — results land in eval_log.json automatically. |
| [`data/eval_log.json`](https://github.com/pjsvis/cool-pi-extensions/blob/main/data/eval_log.json) | Raw results. Append-only JSONL. Every number in this audit traces back to a line in this file. |
| [`data/eval_runs.jsonl`](https://github.com/pjsvis/cool-pi-extensions/blob/main/data/eval_runs.jsonl) | Run metadata — timestamps, duration, pass/fail counts. Useful for tracking variance over time. |
| [`docs/edinburgh-protocol-eval.md`](https://github.com/pjsvis/cool-pi-extensions/blob/main/docs/edinburgh-protocol-eval.md) | Original Q2 audit. 22 models, the scoring rubric, the regression cases, written by DeepSeek V4 Pro (a model in the eval). |
| [`docs/model-eval-bankruptcy.md`](https://github.com/pjsvis/cool-pi-extensions/blob/main/docs/model-eval-bankruptcy.md) | Philosophical companion. Argues that benchmarks measure performance, traps measure utility — and the gap is large enough to matter. |
| [`docs/edinburgh-protocol-evals.md`](https://github.com/pjsvis/cool-pi-extensions/blob/main/docs/edinburgh-protocol-evals.md) | Trap vector specifications. EDI-001 through EDI-004, assertion logic, grading rubric, pass/fail criteria. |
| [`debriefs/003-protocol-evals.md`](https://github.com/pjsvis/cool-pi-extensions/blob/main/debriefs/003-protocol-evals.md) | Build debrief. Why the state machine, why two-pass grading, why OpenRouter over direct Gemini API (£200 billing incident). |
| [`models/models.json`](https://github.com/pjsvis/cool-pi-extensions/blob/main/models/models.json) | Full model registry. 26 models with eval data, OpenRouter IDs, costs, status. |
| [`models/RECOMMENDED.md`](https://github.com/pjsvis/cool-pi-extensions/blob/main/models/RECOMMENDED.md) | Decision tree. Tiered recommendations (Premium / Mid-Tier / Free), current top performers, what's been dropped and why. |

---

*Main post: [edinburgh-protocol-18-month-audit.md](./2026-07-03-edinburgh-protocol-18-month-audit.md)  
Scoreboard: [edinburgh-protocol-scoreboard.md](./2026-07-03-edinburgh-protocol-scoreboard.md)*