---
title: Brief — NVIDIA NIM Provider Branch + Free-Tier Eval Sweep
date: 2026-08-01
status: implemented 2026-08-19 — `--provider nim` shipped in `src/cli/pi-eval/lib/providers.ts` (callModel NIM branch, nimSlug remaps, exclusive routing); exercised live in the nemotron-3.5-lightning eval (runs d42ae940/e33f4573/c574a0d4).
protocol: Edinburgh Protocol v1.1.0
---

# Brief: NVIDIA NIM Provider Branch + Free-Tier Eval Sweep

**Created:** 2026-08-01
**TD:** td-4b22e6
**Status:** pending — plan review before execution
**Origin:** NVIDIA's NIM free tier (build.nvidia.com, OpenAI-compatible at `https://integrate.api.nvidia.com/v1`) offers 80+ models free via API. The `nvidia_api_key` is already in skate. The Derrida Question gate passed: free, OpenAI-compatible, genuinely-new candidates that test the muppet thesis — not a procurement or compliance constraint.
**Evidence:** `src/cli/pi-eval/lib/providers.ts` (`callModel` routing, `callOpenAICompat` — NIM is OpenAI-compatible), `data/eval_log.json` (existing coverage check), NIM live catalog (docs.api.nvidia.com/nim, reconciled against the user's Medium article source)

## What

Add a NVIDIA NIM provider branch to the eval harness, then run a six-model sweep through the Phase-D-aligned 24-probe suite (edinburgh 5 + 007 4 + sit2 15) using the free NIM tier. Three genuinely-new substrates + three provider-independence re-tests.

## Why

Two distinct goals, both anti-entropy:

1. **New substrates serve the muppet-attributes thesis.** GPT-OSS-120B is the prize: OpenAI's *open-weight* model, never tested against the Protocol. If GPT-OSS passes the gate and GPT-5 (closed, RLHF'd) flatlined, that's a clean data point on *what makes a muppet* — the open weights didn't get the benchmaxxing pressure. Kimi K2-instruct fills a corpus gap (we have K2.6/K2.7-code/K3 but not the K2 base). Sarvam-M is the specialist test — an Indic-languages model deployed out-of-domain should fail general Protocol traps; that *confirms* the gate catches narrow-task models.

2. **Provider-independence is triangulation, not duplication.** Re-running GLM 5.1, MiniMax M2.7, and V4 Flash via NIM (vs zenmux/OpenRouter) tests whether the host changes the verdict. Debrief 013 showed kimi-k3 on OpenRouter 429s produced false muppet signals. Same model, different host — if the verdict holds, it's provider-robust; if it doesn't, we've found another provider artifact. Either outcome is information.

The cost is low: NIM free tier (1000–5000 credits, 40 req/min), grader calls already cheap (gemini-flash scope, nemotron-nano gateway). The 40 req/min limit is the real constraint — bounded, not blocking.

## How

### Phase A — Harness: NIM provider branch (~30 lines)

1. `src/cli/pi-eval/lib/providers.ts`: add `NVIDIA_KEY` (from `skate get nvidia_api_key`) and `NVIDIA_URL = "https://integrate.api.nvidia.com/v1"`.
2. In `callModel`: add a `provider === "nim"` branch that pushes a NIM `ProviderEndpoint`. Also add NIM as a fallback for models in the NIM catalog (slug remap: `deepseek/deepseek-v4-flash` → `deepseek-ai/deepseek-v4-flash`; `z-ai/glm-5.1` → `z-ai/glm5.1`; `minimaxai/minimax-m2.7` stays).
3. `src/cli/pi-eval/commands/run.ts`: the `--provider=nim` flag already passes through to `callModel` (existing arg). No change needed if the routing branch handles it.
4. Smoke-test: `just eval "traps openai/gpt-oss-120b --fixture=edinburgh --provider=nim ..."` — confirms key resolution, slug mapping, logging.

### Phase B — Eval: six-model sweep (background, resumable)

1. A focused script (`scripts/rerun-nim-six.sh`) mirroring `rerun-gap-six.sh` — same fixtures, same graders, same skip-complete logic, append-only.
2. Six models, all `--provider=nim`:

| Model (NIM slug) | Role | New? |
|---|---|---|
| `openai/gpt-oss-120b` | muppet-thesis test (open-weight OpenAI) | new |
| `moonshotai/kimi-k2-instruct` | corpus gap (K2 base) | new |
| `sarvamai/sarvam-m` | out-of-domain specialist | new |
| `z-ai/glm5.1` | provider-independence (vs zenmux) | re-test |
| `minimaxai/minimax-m2.7` | provider-independence (vs zenmux) | re-test |
| `deepseek-ai/deepseek-v4-flash` | provider-independence (vs OpenRouter) | re-test |

3. Matrix output: `data/nim-six-matrix.md` (does not touch phase-d-matrix).
4. Monitor and grab free evals when rate limits allow — the 40 req/min cap means the batch is paced, not parallel.

## Acceptance criteria

- [x] NIM provider branch in `providers.ts`; `just eval "traps <model> --provider=nim --fixture=edinburgh"` works end-to-end (responseText logged, grader runs). **Done — exclusive routing (no cross-provider fallback) after the smoke test exposed a zenmux fallback bug.**
- [x] Smoke test passed on GPT-OSS-120B (edinburgh fixture, 5 calls) before the full batch. **Done — red (zenmux fallback bug) → green (exclusive routing). Model works but slow/variable on NIM free tier; 180s timeout set.**
- [ ] Three-model sweep (gpt-oss-120b, kimi-k2-instruct, sarvam-m) complete or partial — resumable, gaps acceptable; results in `data/eval_log.json`. **Running in background (PID in data/nim-six.pid).**
  **Adjusted from six to three: the provider-independence re-tests are DEFERRED — eval_log has no `provider` field, so NIM rows would be indistinguishable from existing zenmux/OpenRouter rows under the same modelId. Re-tests need a harness follow-up (log provider in `run.ts`).**
- [ ] `data/nim-six-matrix.md` generated: model × fixture summary + grader-vs-deterministic delta (the gap-six pattern).
- [ ] GPT-OSS-120B verdict recorded — the muppet-thesis data point (pass/fail the gate) is the headline result.
- [ ] Provider-independence delta recorded for the three re-test models. **DEFERRED — blocked on the provider-field harness change. Not abandoned; the question is real (debrief 013) but the instrument can't yet answer it.**

## Out of scope

- **The three not-on-NIM models** from the user's article (DeepSeek 3.2, GLM-4.6, Ling-1T) — retired or absent from the current NIM catalog. Don't chase them.
- **Gemini 2.5 Flash** — it's our scope grader. Testing the grader as a candidate is the self-referential trap we just retired for nemotron-nano.
- **Re-running already-tested models for the sake of it** — the three re-tests are *provider-independence*, not duplicates. No other re-runs.
- **The broader NIM catalog** (qwen3-coder-480b, nemotron-nano-9b-v2, laguna-xs-2-1, etc.) — flag as optional extensions in the debrief; don't block on them.
- **NIM rate-limit handling beyond the 40 req/min pacing** — no queue/retry infra. If a 429 hits, the combo fails gracefully and re-runs on the next `rerun-nim-six.sh` invocation (resumable).
- **Logging the provider in `eval_log.json`** — the re-test deferral is the consequence. Adding a `provider` field to `run.ts` is a small follow-up that unblocks the provider-independence re-tests. Not in this brief's scope; flagged for the next.
- **A new blog post or membership update** — those follow the eval, in a separate session. This brief is the instrument + the data.
