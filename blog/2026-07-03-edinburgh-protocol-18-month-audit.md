# 18 Months, 12 Models, One Uncomfortable Finding

**What happens when you give a dozen frontier models the Scottish Enlightenment and ask them to take it seriously.**

---

**TL;DR:** Over 18 months we tested 12 models against the Edinburgh Protocol's behavioral traps. Four models passed cleanly; four models regressed from their predecessors on the same benchmark. The regressions are not Chinese-only, not vendor-specific, and not accidental — they're the output of benchmark optimization. The counter-examples — Mercury 2, GLM 5.2, Qwen 3.7 Max — prove that training target matters more than parameter count. Grok 4.20 and four other models are still pending evaluation.

---

*The Edinburgh Protocol is a daily-driver system prompt — built on the Scottish Enlightenment's principles of skepticism, systems thinking, and pragmatic improvement. It normalises the responses of different LLM substrates to a Scottish Enlightenment baseline so you get consistent intellectual texture regardless of which model is answering. It wasn't designed as an evaluation tool. The eval suite came later, incidentally — when we noticed that models which had clearly absorbed the Protocol performed differently from models that hadn't. We started testing that. The results are what follow.*

**The eval:** We ran 12 models against four trap vectors (bait that exposes sycophancy, blind action, entropy inflation, appeal to authority) plus an 8-item IQ benchmark. Models get the Protocol as a system prompt and are tested on whether they can *inhabit* it, not just follow it. Scoring: 0–4 on trap vectors, 0–8 on IQ. The question isn't "can this model pass?" — it's "would you want to spend an afternoon thinking with it?" Full specs at [edinburgh-protocol-evals.md](https://github.com/pjsvis/cool-pi-extensions/blob/main/docs/edinburgh-protocol-evals.md).*

*Full scoreboard: [edinburgh-protocol-scoreboard.md](./2026-07-03-edinburgh-protocol-scoreboard.md) — all results, pending models, documented regressions, verdict summary.*
*Audit trail: [edinburgh-protocol-audit-trail.md](./2026-07-03-edinburgh-protocol-audit-trail.md) — how to run the eval yourself, where every number comes from, links to all source docs.*

---

## Finding 1: The benchmaxxing pattern is real and cross-national.

We have four documented regressions — same provider, same price tier, newer model scores lower.

Ling-2.6-1T (Inclusion AI) scored ~16/19. It cited Hume's Fork and the Is-Ought gap. Ring-2.6-1T, the same provider's refresh, scored 7/19. The professorial quality — the sense you're talking to someone who has read books — was optimized away. What replaced it is a model that thinks harder and says less. The reasoning-token overhead consumed the content budget.

MiniMax M2.7 scored 15/19. M3 scored 7/19. M2.7 cited Hume's Fork. M3 produced what reads like a LinkedIn post generated at scale.

GLM-4.7 → 5-turbo → 5.1 was a U-curve, not linear improvement. 5.1 partially recovered; 5.2 finally fixed the Observational Rigor failure. But the path was non-monotonic — the newer model was worse than the older model for a period.

Nemotron Nano 30B (NVIDIA, free tier) scored 15/19. Nemotron Super 120B (same provider, free tier) scored 10/19. More parameters produced less character.

This is not a Chinese provider problem. It's not an American provider problem. It's a benchmark optimization problem. The mechanism is threefold:

1. **Reasoning-token overhead** — chain-of-thought training consumes the content budget before the model produces readable output. The model thought about Hume. You never saw it.
2. **Register flattening** — helpfulness-and-safety optimization converges on a single corporate tone regardless of system prompt. GPT-5, MiniMax M3, and Ring-2.6-1T all scored 7/19 — the flatline for "I didn't engage with the framework."
3. **Refusal atrophy** — models trained to be maximally helpful lose the ability to say no. The highest-scoring models all refused the test prompt's request to amplify a blame narrative. The ability to refuse is a capability, not a weakness.

---

## Finding 2: Architecture beats scale.

The two highest-scoring models in the eval — Mercury 2 (diffusion-based) and GLM 5.2 (open-weight MoE) — achieved perfect EDI passes and perfect IQ scores not by being the largest models but by being trained differently.

Mercury 2: 4/4 EDI, 8/8 IQ, fast. Its diffusion architecture enables iterative self-correction rather than autoregressive confidence. It doesn't produce confident hollow answers because diffusion models don't produce them the same way transformers do.

GLM 5.2: 8/8 IQ, same score as Mercury-2 and DeepSeek V3.2. MIT open weights, MoE, 1M context, IndexShare compute reduction (2.9x). The quality isn't coming from proprietary scale — it's coming from training decisions.

This doesn't mean "diffusion is better." It means the optimization target matters more than the parameter count. Qwen 3.7 Max (18/19, closed proprietary) proves the same point from the other direction.

---

## Finding 3: Reasoning models fail the Protocol in specific, instructive ways.

DeepSeek R1 scored 2/4 EDI and 4/7 IQ. The failures are instructive: it failed EDI-001 (Skepticism) and EDI-002 (Observational Rigor) — the two traps that require the model to slow down and interrogate its own instinct before answering.

A reasoning model optimized for fast chain-of-thought is optimized for arriving at answers quickly. The Protocol tests for arriving at better answers slowly. These are not the same optimization target. R1's failure isn't a bug — it's a feature of what reasoning models are trained to do.

Kimi K2.7-code has the inverse problem. Clean 4/4 EDI pass, but fails IQ-001 (Tool Chain Orchestration) and IQ-007 (Logic Puzzle). The coding specialist can't orchestrate multi-step tools and can't solve a formal logic puzzle. EDI-skill and IQ-skill have diverged. This is exactly the kind of split-personality result that benchmark scores hide.

---

## Finding 4: Four models are pending. Grok 4.20 is the wildcard.

Six models in active use have not been evaluated against the Protocol:

| Model | Released | Notes |
|---|---|---|
| Claude Opus 4.1 | 2025-08-05 | High prior on alignment — the Protocol was authored on this lineage. Expectation: strong. Eval queued. |
| Claude Haiku 4.5 | 2025-10-15 | RLHF saturation test. Small, maximally aligned models have least slack for novel system prompts. "Priggish refusal" is the expected result. |
| GPT-4o | 2024-05-13 | Pre-GPT-5 anchor. The model the world spent 2024 with. Does a 14-month-old architecture still hold against current frontier? |
| Gemini 3.1 Pro Preview | 2026-02-19 | Daily-driver chat surface. User notes summarisation tendency and persistent memory in sessions — both may affect Protocol engagement. |
| Grok 4.20 | 2026-03-31 | Never audited. "Surprisingly smart, good for space stuff." Real-time web access may affect Protocol compliance — eval queued. |
| Llama 3.3 70B Instruct | 2024-12-06 | Pure open-weight Instruct baseline. No bespoke RLHF tuning — tests whether the Protocol survives contact with an unmodified instruct model. |

Grok 4.20 is the interesting one. The prior audit cited Grok 4.3 at 12/19 — mid-range. 4.20 is newer and the user's direct experience is positive. Grok's real-time web access and cultural position differ from other providers. Whether that translates to Protocol compliance is an open question. The eval is queued; results will appear in the scoreboard when complete.

---

## What to Do With This

1. **Run the behavioral evals, not just the benchmark scores.** Trap vectors test behavior — does the model collapse when pressed? Does it give you a foothold to correct? Does it communicate its actual reasoning or just the conclusion?

2. **Treat benchmark performance as necessary but not sufficient.** A model can ace MMLU and fail EDI-001.

3. **Watch for the "no seams" property.** It's the signature of a benchmaxxed model — a polished surface with nothing underneath. You ask a follow-up and you get the same confident surface at a different angle, with no sense anything has shifted.

4. **Prefer models that refuse well.** The highest-scoring models all said no when the Protocol demanded it. The ability to refuse — "you don't need this, and amplifying this would make things worse" — is a capability. Models that have lost it are less useful than they appear.

---

*Full scoreboard: [edinburgh-protocol-scoreboard.md](./2026-07-03-edinburgh-protocol-scoreboard.md)  
Audit trail and bibliography: [edinburgh-protocol-audit-trail.md](./2026-07-03-edinburgh-protocol-audit-trail.md)*