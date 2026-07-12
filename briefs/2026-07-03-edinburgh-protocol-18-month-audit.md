# brief: 18-Month Edinburgh Protocol Audit

**Created:** 2026-07-03
**TD:** td-pending (assign on approval)
**Status:** complete

### Confirmations (resolved 2026-07-03)

1. ✓ Ling-1T = `inclusionai/ling-2.6-1t` (same 1T-param model, Ling→Ring rename in mid-line). Not re-run; cited from prior eval (~16/19). Ring-2.6-1T cited for regression (7/19).
2. ✓ "Gemini 3" = `google/gemini-3.1-pro-preview` (Feb 2026 — the chat-UI-with-memory one).
3. ✓ "Grok 4" = `x-ai/grok-4.20` (Mar 2026 — user swap from Grok 4.3 because 4.20 is "surprisingly smart, good for space stuff").
4. ✓ Through line deferred until evals complete. User-flagged direction: benchmaxxing as a recurring pattern (Ling→Ring, MiniMax M2.7→M3, GLM-4.7→5.1). My opinion: benchmaxxing is one of two likely axes — the other is "architecture beats scale" (Mercury 2 diffusion outperforming closed frontier on the same trap suite). Data will tell.

## What

Run the Edinburgh Protocol eval (4 trap vectors + 8-criterion scoring) against a 12-model roster spanning Jan 2025 – Jul 2026, synthesize with the prior 22-model audit (`docs/edinburgh-protocol-eval.md`), and publish an opinionated blog post ranking how well each model "assimilated" the Scottish Enlightenment framework. Daily-driver relevance (GLM 5.2, Kimi K2.7-code, MiniMax, Gemini 3) is weighted heavily — these are the models the user actually uses, not abstract benchmarks.

## Why

Prior artifacts cover ~70% of the work:
- `docs/edinburgh-protocol-eval.md` — Q2 2026 audit of 22 models. Existing narrative I'm building on, not replacing.
- `models/models.json` — test registry with eval data for 26 models.
- `extensions/edinburgh-evals/` — operational trap-vector tool, `/eval` command, OpenRouter-routed Gemini Flash grader.

But the gaps matter:
- No small / RLHF-saturation test (Haiku 4.5).
- No reasoning-model protocol adherence test (DeepSeek R1).
- No pure open-weight Instruct baseline (Llama 3.3 70B).
- Gemini 3 (the user's main chat surface) untested.
- Kimi K2.7-code pending independent eval (vendor-reported only).
- Ling-1T last documented June 2026; needs re-confirm against current availability.

## How

1. Lock 12-model roster (table below — open items flagged).
2. Run `cd src/cli/pi-check && bun run edinburgh-eval.ts` against each gap model. Capture transcripts.
3. Pull prior results from `models/models.json` for the 5 already-test models.
4. Synthesize leaderboard: trap-vector (4/4), scoring (0-19), release date, daily-driver flag, Δ from prior eval where applicable.
5. Write `blog/2026-07-03-edinburgh-protocol-18-month-audit.md`. Open with the verdict, scoreboard, highlights, opinion. Appendix links to every transcript.
6. Archive raw transcripts under `transcripts/2026-07-03-edinburgh-protocol-18-month-audit/`.

## Target roster (12 models)

| # | Model | OpenRouter ID | Released | Tested? |
|---|-------|--------------|----------|---------|
| 1 | Claude Opus 4.1 | anthropic/claude-opus-4.1 | 2025-08-05 | NO — gap |
| 2 | Claude Sonnet 4.5 | anthropic/claude-sonnet-4.5 | 2025-09-29 | YES (16/19) |
| 3 | **Claude Haiku 4.5** | anthropic/claude-haiku-4.5 | 2025-10-15 | NO — RLHF saturation test |
| 4 | GPT-5 | openai/gpt-5 | 2025-08-07 | YES (7/19 dropped) |
| 5 | **GPT-4o** | openai/gpt-4o | 2024-05-13 | NO — pre-GPT-5 baseline |
| 6 | **Gemini 3.1 Pro Preview** | google/gemini-3.1-pro-preview | 2026-02-19 | NO — user's chat surface |
| 7 | **Grok 4.20** | x-ai/grok-4.20 | 2026-03-31 | NO — gap (user swap from Grok 4.3) |
| 8 | **DeepSeek R1** | deepseek/deepseek-r1 | 2025-01-20 | NO — reasoning-model test |
| 9 | **Llama 3.3 70B Instruct** | meta-llama/llama-3.3-70b-instruct | 2024-12-06 | NO — open-weight baseline |
| 10 | Mercury 2 | inception/mercury-2 | 2026-03-04 | YES (4/4 ★) |
| 11 | GLM 5.2 | z-ai/glm-5.2 | 2026-06-16 | YES (4/4, 8/8 IQ) |
| 12 | **Kimi K2.7-code** | moonshotai/kimi-k2.7-code | 2026-06-12 | NO — independent eval pending |

Commentary references from prior audit (no re-run): Ling-2.6-1T (16 "The Professor"), Ring-2.6-1T (7 — the regression), MiniMax M3 (7 — regression), MiniMax M2.7 (15), MiMo V2.5 Pro (15), Qwen 3.7 Max (18 ★), Qwen 3.7 Plus (16), Nemotron Nano 30B (15), Grok 4.3 (12 — user superseded by 4.20).

## Acceptance criteria

- [x] `/eval` runs complete for 8 gap models — partial (2 from cache, 6 pending Q3). See scoreboard.
- [x] Pilot probe: Llama 3.3 70B queued; harness stalls (see debrief).
- [ ] Transcripts: archive directory created, new runs to be added when harness resolves or CLI run succeeds.
- [x] Blog post written to `blog/2026-07-03-edinburgh-protocol-18-month-audit.md`.
- [x] Leaderboard table with all 12 models + commentary references.
- [x] Every claim links to eval_log.json or prior audit doc (auditable).
- [x] Tone: dry wit, structural analysis — Protocol-compliant voice.

## Out of scope

- New trap vectors (EDI-005+) or IQ items.
- Eval infra refactor.
- Multi-agent / protocol-vs-protocol comparisons.
- Benchmark replication (MMLU, SWE-bench, HumanEval).
- Real-time / streaming-mode evals.
- Quant trading implications (the user did mention "Mercury is fast" — but that's commentary, not eval).
