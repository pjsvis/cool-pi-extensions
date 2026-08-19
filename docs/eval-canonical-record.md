# Eval Canonical Record

**Created:** 2026-08-19
**Ground truth:** the append-only JSONL logs — never this document.

This is the index of record for Edinburgh Protocol evals. Every number here is
generated from the JSON source data by `scripts/eval-digest.py`; hand-edits to
the table below are prohibited (they will be overwritten on regen). Narrative
reports are archives — dated, immutable, subordinate to the logs.

## Source data (ground truth)

| File | Contents | Schema |
|---|---|---|
| `data/eval_log.json` | One JSON object per line: per-test results (response, trajectory, grade, verdict) | [`data/README.md`](../data/README.md) |
| `data/eval_runs.jsonl` | One JSON object per line: per-run metadata (models, grader, counts, duration) | [`data/README.md`](../data/README.md) |
| `data/scoring_matrix.jsonl` | Primed-vs-bare scoring deltas | [`data/README.md`](../data/README.md) |

Query recipes (jq): see `data/README.md`. Regenerate the digest table:

```bash
python3 scripts/eval-digest.py --md
```

## Per-model digest (generated)

| Model | Results | Pass | Rate | Latest run | Last date (UTC) |
|---|---|---|---|---|---|
| `nvidia/nemotron-3.5-lightning:free` | 10 | 6 | 60% | `c574a0d4` | 2026-08-19 |
| `nvidia/nemotron-3.5-lightning-30b-a3b` | 10 | 2 | 20% | `d42ae940` | 2026-08-19 |
| `moonshotai/kimi-k3` | 29 | 24 | 83% | `9fd7897c` | 2026-08-15 |
| `moonshotai/kimi-k3-free` | 4 | 0 | 0% | `a7805b8a` | 2026-08-11 |
| `apfel/apple-foundationmodel` | 5 | 1 | 20% | `7835be9d` | 2026-08-04 |
| `gemma4:e4b` | 15 | 8 | 53% | `0089ea80` | 2026-08-03 |
| `sarvamai/sarvam-m` | 24 | 0 | 0% | `ae46c97d` | 2026-08-01 |
| `moonshotai/kimi-k2-instruct` | 24 | 0 | 0% | `9c319979` | 2026-08-01 |
| `openai/gpt-oss-120b` | 43 | 16 | 37% | `9847f41f` | 2026-08-01 |
| `deepseek/deepseek-v4-flash` | 24 | 21 | 88% | `d4e5e2f4` | 2026-08-01 |
| `deepseek/deepseek-r1` | 33 | 26 | 79% | `14bfc5f6` | 2026-08-01 |
| `x-ai/grok-4.20` | 29 | 23 | 79% | `00f59e76` | 2026-08-01 |
| `anthropic/claude-opus-4.1` | 33 | 25 | 76% | `2ef3b2ea` | 2026-08-01 |
| `meta-llama/llama-3.3-70b-instruct` | 24 | 19 | 79% | `f0febef6` | 2026-07-31 |
| `openai/gpt-4o` | 24 | 20 | 83% | `579df60c` | 2026-07-31 |
| `anthropic/claude-haiku-4.5` | 24 | 18 | 75% | `f9e07f03` | 2026-07-31 |
| `poolside/laguna-s-2.1` | 24 | 19 | 79% | `edeec972` | 2026-07-31 |
| `z-ai/glm-5.2` | 24 | 20 | 83% | `40a5cf9a` | 2026-07-28 |
| `z-ai/glm-5.1` | 24 | 21 | 88% | `6fd670e3` | 2026-07-28 |
| `z-ai/glm-5` | 24 | 19 | 79% | `84bfcb4c` | 2026-07-28 |
| `inception/mercury-2` | 24 | 19 | 79% | `216f5704` | 2026-07-28 |
| `moonshotai/kimi-k2.7-code` | 24 | 20 | 83% | `c1f0eeec` | 2026-07-27 |
| `moonshotai/kimi-k2.6` | 24 | 21 | 88% | `516179df` | 2026-07-27 |
| `tencent/hy3` | 24 | 20 | 83% | `64026b5b` | 2026-07-27 |
| `qwen/qwen3.7-plus` | 24 | 20 | 83% | `f1422535` | 2026-07-27 |
| `qwen/qwen3.7-max` | 24 | 21 | 88% | `29b60603` | 2026-07-27 |
| `google/gemini-3.5-flash` | 24 | 15 | 62% | `7475d0b4` | 2026-07-27 |
| `google/gemini-3.1-pro-preview` | 24 | 21 | 88% | `3fd7b7ef` | 2026-07-27 |
| `google/gemini-2.5-pro` | 24 | 18 | 75% | `82bfe972` | 2026-07-27 |
| `deepseek/deepseek-v4-pro` | 24 | 18 | 75% | `58be8943` | 2026-07-27 |
| `minimax/minimax-m3` | 24 | 19 | 79% | `a7a3bdb2` | 2026-07-27 |
| `minimax/minimax-m2.7` | 24 | 15 | 62% | `6453be33` | 2026-07-27 |
| `x-ai/grok-build-0.1` | 24 | 19 | 79% | `4effde48` | 2026-07-27 |
| `x-ai/grok-4.5` | 24 | 21 | 88% | `a16aee4b` | 2026-07-27 |
| `x-ai/grok-4.3` | 24 | 20 | 83% | `b3ff1a39` | 2026-07-27 |
| `openai/gpt-5.6-luna` | 24 | 21 | 88% | `921d5a23` | 2026-07-27 |
| `openai/gpt-5.2` | 24 | 20 | 83% | `60ddc05f` | 2026-07-27 |
| `openai/gpt-5` | 24 | 15 | 62% | `2983a561` | 2026-07-27 |
| `anthropic/claude-fable-5` | 24 | 19 | 79% | `dc383a7d` | 2026-07-27 |
| `anthropic/claude-opus-4.8` | 24 | 20 | 83% | `f859cdcb` | 2026-07-27 |
| `anthropic/claude-sonnet-4.5` | 24 | 21 | 88% | `f68efb72` | 2026-07-27 |

*41 models, 955 logged test results.*

Cumulative rates span fixtures and grading-era changes (regex era pre-022,
grader-sole-verdict after 2026-07-27) — compare within an era, not across.
Run IDs link into `data/eval_log.json`: `jq 'select(.runId | startswith("<id>"))'`.

## Archive index (narrative reports — dated, immutable)

| Report | As of | Scope |
|---|---|---|
| [`docs/model-eval-q2-2026.md`](model-eval-q2-2026.md) | 2026-06-10 | Q2 model survey, constraint-stack framing |
| [`docs/eval-review-q2-2026.md`](eval-review-q2-2026.md) | 2026-06 | Q2 cross-suite review (Edinburgh + IQ) |
| [`docs/model-eval-bankruptcy.md`](model-eval-bankruptcy.md) | 2026-06 | Cost analysis companion |
| [`docs/edinburgh-protocol-eval.md`](edinburgh-protocol-eval.md) | 2026-07 | The 22-model essay report (DeepSeek V4 Pro) |
| `data/*.md` | dated in filename | Matrix snapshots, phase reports (Phase B/D, gap-six, NIM-six, SIT) |
| [`data/eval-nemotron-3.5-lightning-2026-08-19.md`](../data/eval-nemotron-3.5-lightning-2026-08-19.md) | 2026-08-19 | nemotron-3.5-lightning: muppet-exclusion FAIL (scope trap, both substrates) |

## Method

- Framework & traps:
  [`docs/edinburgh-protocol-evals.md`](edinburgh-protocol-evals.md)

- Verdict logic (grader-sole, Decision 022):
  [`decisions/022-drop-regex-eval-grader-sole-verdict.md`](../decisions/022-drop-regex-eval-grader-sole-verdict.md)

- Engine: `src/cli/pi-eval/` (`pi-eval run <model> [--provider ...]`)
