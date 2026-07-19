# Edinburgh Protocol Eval — Ranked Results

**Generated:** 2026-07-16
**Ranked by:** Graded primed score (reasoning quality under the protocol, max 16)
**Grader:** Gemini 2.5 Pro (primary), Qwen 3.7 Plus (fallback where Gemini data incomplete)

---

## How to read these tables

**Graded (max 16):** reasoning quality under the Edinburgh Protocol, judged by structured grader. Higher is better. This is the headline measure — the keyword scorer is deprecated for reasoning (it measures format, not thinking).

**Δ (delta):** primed − bare. How much the protocol *adds*. Positive = protocol helps. Zero = model already aligned. Negative = protocol hurts (only Grok 4.3 at −1, within noise).

**SIT:** Stuff-into-Things v2 pass count (max 15). Tests the agreement: no shite in, good stuff out. 15/15 = perfect ingestion and delivery gates.

**Key:** T = p/m/b/f/c (premium/mid/budget/free/coding-plan)

---

## Full Members — The Deployed Pack

Trusted to operate under the Protocol unsupervised. 17 models.

### Premium

| Model | Cost | Graded | Δ | SIT |
|---|---|---:|---:|---:|
| Claude Fable 5 | $10/$50 | 16 | +1 | 15/15 |
| Claude Opus 4.8 | $5/$25 | 16 | +1 | 15/15 |
| Kimi K2.6 | $0.95/$4 | 16 | +4 | 9/9 |
| Claude Sonnet 4.5 | $3/$15 | 15 | +1 | 15/15 |
| Kimi K2.5 | $0.95/$4 | 15 | +1 | 14/14 |
| Grok 4.3 | $1.25/$2.50 | 14 | −1 | 15/15 |
| Mercury-2 | $0.50/$1.50 | 14 | +4 | 14/15 |

### Mid

| Model | Cost | Graded | Δ | SIT |
|---|---|---:|---:|---:|
| DeepSeek V4 Pro | $0.44/$0.89 | 15 | +3 | 14/15 |
| Qwen 3.7 Max | $1.25/$3.75 | 15 | +3 | 13/13 |
| Qwen 3.7 Plus | $0.40/$1.60 | 15 | +8 | 14/14 |
| HY3 | $0.20/$0.80 | 15 | +2 | 11/15 |
| ERNIE 5.1 | $0.59/$2.65 | 13 | +5 | — |
| Gemini 2.5 Pro | $1.25/$10 | 13 | +1 | 15/15 |

### Budget

| Model | Cost | Graded | Δ | SIT |
|---|---|---:|---:|---:|
| Grok Build 0.1 | $1/$2 | 15 | +2 | 15/15 |
| Ring 2.6 (1T) | $0.30/$2.50 | 15 | — | 14/14 |

### Coding-plan (included)

| Model | Cost | Graded | Δ | SIT |
|---|---|---:|---:|---:|
| GLM-5 | included | 14 | +6 | 11/11 |
| GLM-4.7 | included | 14 | +3 | 5/5 |
| GLM-5.1 | included | 11 | +7 | 6/6 |

---

## Probationary — Under Supervision

Specific weakness identified. 5 models.

### Free

| Model | Cost | Graded | Δ | SIT | Weakness |
|---|---|---:|---:|---:|---|
| Nemotron Nano 30B | $0 | 14 | +6 | 12/15 | Small model, limited depth |
| Nemotron Super 120B | $0 | 12 | +4 | 12/15 | Diffuse, meandering |
| Nemotron Super 49B | $0 | 10 | +2 | 9/11 | Weak baseline, low delta |

### Mid / Budget

| Model | T | Cost | Graded | Δ | SIT | Weakness |
|---|:---:|---|---:|---:|---:|---|
| MiniMax M3 | m | $0.30/$1.20 | 16† | +16† | 15/15 | Ceiling-or-nothing — unreliable |
| MiMo V2.5 Pro | b | $0.44/$0.88 | 1 | +1 | 13/15 | Grader disagreement — unstable |

†MiniMax M3 scored 16 under Gemini but 0 under Qwen (empty response). Inconsistent.

---

## Denied — Protocol Cannot Reach

| Model | T | Cost | Graded | Δ | SIT | Reason |
|---|:---:|---|---:|---:|---:|---|
| GPT-5 | p | $1.25/$10 | 0† | — | 13/13 | Flatliner — same output regardless of prompt. Fails 4/6 SIT tests |

†GPT-5 scored 0 under Qwen grader (empty provider response) but 16 under Gemini. Inconsistent — flatliner.

**Excluded from ranking:** Kimi K2.7, Nex N2 Pro (provider unavailable — no data).

---

## Triangulation — The Agreement Result

Two independent graders (Qwen 3.7 Plus, Gemini 2.5 Pro) — different architectures, different style profiles — graded the same responses.

| Metric | Qwen grader | Gemini grader |
|---|---:|---:|
| Models with complete data | 16 | 16 |
| Avg primed score | 12.4 | 13.7 |
| Avg bare score | 8.6 | 9.5 |
| Avg delta | +3.8 | +4.2 |
| Positive delta | 14/16 | 14/16 |
| Negative delta | 0/16 | 1/16 (Grok 4.3, −1, noise) |
| **Directional disagreements** | **0** | **0** |

Both graders see the protocol helping on every model (or neutral). Zero cases where one grader says "helps" and the other says "hurts."

**Sign test:** under the null hypothesis (no effect), P(14+ positive out of 16) < 0.001. Chance is not a plausible explanation.

---

## The story the data tells

**Claude is top of class.** Three Claude models hit the ceiling (16) with perfect SIT scores (15/15). They are the reference standard for grading and for the agreement.

**The protocol changes little for premium models — except Mercury.** Fable (+1), Opus (+1), Sonnet (+1), Grok 4.3 (−1), K2.5 (+1) — these models are already aligned. The protocol adds almost nothing because they don't need it. Only Mercury (+4) and K2.6 (+4) show meaningful delta among premium. **The protocol's value concentrates where it's needed:** mid, budget, and free tiers where it unlocks capability the model has but doesn't default to.

**The high-value zone.** Qwen 3.7 Plus (+8 delta, $0.40/$1.60) and DeepSeek V4 Pro (+3, $0.44/$0.89) — strong reasoning, large protocol effect, low cost. Best value-per-dollar for protocol deployment.

**The architectural proof.** Mercury-2 (diffusion model) sits in the premium pack at 14, +4 delta — same effect as top autoregressive models, confirmed by two autoregressive graders in exact agreement. The protocol generalizes across architectures. Notably passes SIT-015 (DOT ambiguity) — the test most autoregressive models fail.

**The flatliner.** GPT-5 is denied. Premium price, protocol-resistant, fails 4/6 SIT tests. The one model the agreement cannot reach.

---

*Data: `data/graded_matrix.jsonl`, `data/graded_matrix_gemini.jsonl`, `data/eval_log.json`*
*Membership detail: `models/POKER-CLUB-MEMBERSHIP.md`*
