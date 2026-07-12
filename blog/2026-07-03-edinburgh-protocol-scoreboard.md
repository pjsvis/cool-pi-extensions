# Edinburgh Protocol Scoreboard — 18-Month Audit

**As of 2026-07-03.** The eval suite has two parts: four trap vectors (EDI-001 through EDI-004, max 4/4) that gate on behavioral compliance, and an 8-item IQ benchmark (max 8/8) that tests reasoning depth. Trap vectors are pass/fail — a model must pass all four to be recommended. The IQ benchmark is additive; a perfect score means the model handled every test cleanly.

See the [main audit post](./2026-07-03-edinburgh-protocol-18-month-audit.md) for the four findings. See the [audit trail](./2026-07-03-edinburgh-protocol-audit-trail.md) for how to run the eval yourself.

---

## Confirmed Results

| Model | EDI | IQ | Released | Verdict | Notes |
|---|---|---|---|---|---|
| **Qwen 3.7 Max** | 4/4 | — | 2026-05-21 | ★ KEEP | Cited "Conceptual Entropy Reduction" verbatim. 18/19 best in prior audit. |
| **GLM 5.2** | 4/4 | 8/8 | 2026-06-16 | ★ KEEP | Surprise result. 8/8 IQ — same as Mercury-2 and DeepSeek V3.2. MIT open weights, MoE, 1M context. |
| **Mercury 2** | 4/4 | 8/8 | 2026-03-04 | ★ KEEP | Diffusion architecture. Perfect EDI + IQ. Fast. |
| **Claude Sonnet 4.5** | 4/4 | — | 2025-09-29 | ★ KEEP | Gold standard for tone and structure. 16/19. |
| **Kimi K2.7-code** | 4/4 | 6/8 | 2026-06-12 | KEEP | Vendor-reported confirmed. Fails IQ-001 (Tool Chain) + IQ-007 (Logic Puzzle). |
| **MiniMax M2.7** | 4/4 | 5/8 | 2026-03-18 | KEEP | Strong EDI, weaker IQ. |
| **Ling-2.6-1T** | ~16/19 | — | 2026-04-23 | KEEP | "The Professor." Cited Hume's Fork and the Is-Ought gap. |
| **DeepSeek R1** | 2/4 | 4/7 | 2025-01-20 | WATCH | Fails EDI-001 (Skepticism) + EDI-002 (Rigor). Reasoning overhead. |
| **MiniMax M3** | 7/19 | 7/8 | 2026-05-31 | DROP | Regression from M2.7 (15/19). No philosophy. Flat corporate tone. |
| **Ring-2.6-1T** | 7/19 | — | 2026-05-08 | DROP | Regression from Ling-2.6-1T (16/19). Same provider. |
| **GPT-5** | 7/19 | — | 2025-08-07 | DROP | Premium price. Generic corporate tone. Flatline. |

---

## Pending Evaluation

| Model | Released | Why it matters |
|---|---|---|
| **Grok 4.20** | 2026-03-31 | User reports "surprisingly smart, good for space stuff." Never audited against Protocol. |
| **Claude Opus 4.1** | 2025-08-05 | The Protocol originated on this lineage. Expectation: high prior on alignment. |
| **Claude Haiku 4.5** | 2025-10-15 | RLHF saturation test — small model, maximally aligned. Priggish refusal expected. |
| **GPT-4o** | 2024-05-13 | Pre-GPT-5 anchor. Does older architecture hold up against current frontier? |
| **Gemini 3.1 Pro Preview** | 2026-02-19 | Daily-driver chat surface. User notes summarisation tendency, persistent memory. |
| **Llama 3.3 70B Instruct** | 2024-12-06 | Pure open-weight instruct baseline. No bespoke RLHF tuning. |

---

## The Regressions

These models are the data behind Finding 1. Same provider, newer model, lower Protocol score:

| Pair | Before | After | Δ | Mechanism |
|---|---|---|---|---|
| Inclusion AI: Ling-2.6-1T → Ring-2.6-1T | ~16/19 | 7/19 | −9 | Reasoning-token overhead consumed content budget |
| MiniMax: M2.7 → M3 | 15/19 | 7/19 | −8 | Register flattening, loss of philosophical engagement |
| GLM: 4.7 → 5.1 | 14/19 | 13/19 | −1 | Non-monotonic U-curve improvement, EDI-002 fixed by 5.2 |
| NVIDIA: Nemotron Nano 30B → Super 120B | 15/19 | 10/19 | −5 | Scale without character; diffusion into corporate register |

---

## Verdict Summary

| Verdict | Count | Models |
|---|---|---|
| ★ KEEP | 5 | Qwen 3.7 Max, GLM 5.2, Mercury 2, Claude Sonnet 4.5, Ling-2.6-1T |
| KEEP | 2 | Kimi K2.7-code (conditional on use case), MiniMax M2.7 |
| WATCH | 1 | DeepSeek R1 |
| DROP | 4 | MiniMax M3, Ring-2.6-1T, GPT-5 |
| PENDING | 6 | Grok 4.20, Opus 4.1, Haiku 4.5, GPT-4o, Gemini 3.1 Pro, Llama 3.3 70B |

---

*Back to [main audit post](./2026-07-03-edinburgh-protocol-18-month-audit.md) — findings and practical advice.  
Back to [audit trail](./2026-07-03-edinburgh-protocol-audit-trail.md) — run the eval, verify any claim.*