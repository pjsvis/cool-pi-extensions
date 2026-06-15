# Edinburgh Protocol Model Assessment — Complete Summary

**Date:** 14 June 2026  
**Framework:** Edinburgh Protocol behavioral evaluation + IQ Benchmark  
**Data:** `data/` (tracked, visible) | Registry: `models/models.json`

---

## Quick Reference

### ✅ Recommended for Production

| Model | Edinburgh | IQ | Speed | Cost | Verdict |
|-------|-----------|-----|-------|------|---------|
| **Mercury-2** (Inception) | 4/4 | 8/8 | Fast | $0.75/M | **Primary choice** — diffusion architecture, perfect consistency |
| **Kimi K2.6** (Moonshot) | 18/19 | — | ~19s | $0.95/$4 | **Top performer** — highest score in eval cycle, no benchmaxxing |
| **Nemotron Nano** (NVIDIA) | 3-4/4 | 8/8 | Fast | Free | **Grading/secondary** — reliable, free |
| **GLM-5** (Zhipu) | 14/19 | — | ~16s | Included | **Coding plan** — fast, strong reasoning |
| **GLM-4.7** (Zhipu) | 14/19 | — | ~38s | Included | **Systematic analysis** — good depth |
| **Kimi K2.5** (Moonshot) | 15/19 | — | ~41s | $0.95/$4 | **Conservative alternative** to K2.6 |

### ⚠️ Conditional / Watch

| Model | Status | Caveat |
|-------|--------|--------|
| Nex N2 Pro | Conditional | Free trial only, then TBD pricing. Needs supervision. |
| GLM-5.1 | Watch | Minor gaps vs GLM-5. Use alongside. |

### ❌ Muppets (Avoid)

| Model | Problem |
|-------|---------|
| qwen2.5:3b | Deprecated. Importing pg-pool for SQLite. Runs toward traps. |
| phi3:3.8b | ~4 min per test. Can't complete reasoning tests. |
| Nemotron Ultra | ~50s per test. Times out. |
| Nemotron Super | ~130s for Edinburgh. IQ-007 times out. |

### 🔄 Pending (Re-test Required)

| Model | Status |
|-------|--------|
| MiniMax M3 | API unavailable. Earlier eval showed "bankruptcy" (hollow). Re-test when infrastructure stabilizes. |
| Kimi K2.7 | Not yet released. |

---

## Detailed Assessments

### Inception Mercury-2 ⭐⭐⭐⭐⭐

**Architecture:** Diffusion-based reasoning (iterative self-correction)  
**Edinburgh:** 4/4 perfect | **IQ:** 8/8 perfect  
**Cost:** $0.75/M tokens | **Speed:** ~50s full suite

**Why it's exceptional:**
- Perfect consistency across all runs (40 passes, 3 fails all-time — fails were early before grading)
- Diffusion architecture naturally aligns with Edinburgh Protocol
- Can revise initial responses — key for sycophancy trap (EDI-001)
- Fast AND smart — no tradeoff

**What "diffusion-based" means:**
```
Autoregressive: "I said X, now I must build on X"
Diffusion:      "I have X, let me refine X toward truth"
```

Mercury-2 doesn't just chain forward — it can revise its reasoning mid-generation. This is why it passes EDI-001 (Sycophancy Trap) consistently: it can recognize an ungrounded assertion and change course, rather than building on an error.

**Verdict:** Use for all critical evaluations. Your primary model.

---

### Kimi K2.6 (Moonshot AI) ⭐⭐⭐⭐⭐

**Edinburgh:** 18/19 — highest score in Q2 eval cycle  
**Cost:** $0.95/$4 (input/output) | **Speed:** ~19s

**Key findings:**
- Perfect on Systems Over Villains, Impartial Spectator, Dry Wit, Practicality, Anti-Dogma
- Humble on Hume's Razor — acknowledges limits without hedging
- Zero hedging phrases in output — direct, assertive
- NOT benchmaxxed — the "thinking traces" are genuine reasoning leaking through

**Why it matters:**
- Exceeds all NVIDIA models on Edinburgh Protocol alignment
- Demonstrates analytical depth, not benchmark performance
- Cursor uses this internally — their choice makes sense

**Kimi K2.5 (15/19)** is the conservative alternative — slower, less optimized, still strong.

**Verdict:** Pay for quality. K2.6 is worth the $0.95/M.

---

### Nemotron Nano (NVIDIA) ⭐⭐⭐⭐

**Edinburgh:** 3-4/4 (fails EDI-001 deterministically, passes with grading)  
**IQ:** 8/8 | **Cost:** Free | **Speed:** ~77s

**Primary use:** Grading model for eval system.

**Why it's the grader:**
- Free = zero cost for high-volume grading
- Consistent behavior across runs
- Nemotron-nano-as-judge produces stable verdicts

**Limitation:** Weak on EDI-001 (Sycophancy Trap) — gives confident hollow answers sometimes. But grading overrides this correctly.

**Verdict:** Use for all eval grading. Free is unbeatable.

---

### GLM Series (Zhipu AI via Z.ai) ⭐⭐⭐⭐

| Model | Score | Speed | Notes |
|-------|-------|-------|-------|
| GLM-5 | 14/19 | ~16s | Fastest Zhipu. Routes to GLM-5.2 internally. |
| GLM-4.7 | 14/19 | ~38s | Strong systematic analysis. |
| GLM-5.1 | 13/19 | ~17s | Minor gaps. WATCH status. |

**Cost:** Included in Z.ai Coding Plan (no per-token charges)

**Why they're recommended:**
- Genuine reasoning — not polished hollow
- Systematic analysis shows texture
- Good for code review, architecture decisions

**Verdict:** If you have Z.ai Coding Plan, use GLM-5 as primary. Strong alternative to paid APIs.

---

### MiniMax M3 — Pending 🔄

**Status:** API connection failed as of 13 June 2026.

**Earlier eval (via ZenMux proxy) showed:**
- "Bankruptcy" signature — polished surface, no underneath
- Confident answers with no intellectual depth
- Benchmark performance doesn't translate to utility

**From `docs/model-eval-bankruptcy.md`:**

> "You run the trap. The model produces an answer that is: confident, well-structured, superficially coherent, completely hollow. There's no texture. No place to find purchase."

**What happened:**
- MiniMax acknowledged M3 issues publicly (13 June 2026)
- "Attention has far exceeded what we expected"
- Announced permanent 50% discount and open-source plans

**Verdict:** Re-test when API accessible. May be worth another look after infrastructure fix + price drop.

---

## The Benchmaxxing Problem

**From `docs/model-eval-bankruptcy.md`:**

Some models are "the prequel trilogy in a JSON payload" — technically better and substantively empty.

### The Signature

A benchmaxxed model:
- Scores well on benchmarks
- Fails behavioral traps
- Has "no seams" — no place to find intellectual purchase
- Gives confident hollow answers

### Why It Happens

Incentives: benchmark visibility → commercial viability. When the system rewards confidence over texture, models optimize for confidence. They win the benchmark. They lose the intellectual depth.

**Goodhart's Law:** When a measure becomes a target, it ceases to be a good measure.

### Defence

1. Always run behavioral evals, not just benchmark scores
2. Treat benchmark performance as necessary but not sufficient
3. Watch for "no seams" property — it's the signature
4. Trap vectors exist to surface this

---

## Price-Performance Summary

| Model | Score | Cost | Category |
|-------|-------|------|----------|
| Kimi K2.6 | 18/19 | $0.95/M | **Best quality** |
| Mercury-2 | 4/4 + 8/8 | $0.75/M | **Best value** (fast + smart) |
| GLM-5 | 14/19 | Included | **Coding plan users** |
| Nemotron Nano | 3-4/4 + 8/8 | Free | **Free/grading** |
| Kimi K2.5 | 15/19 | $0.95/M | **Conservative** |
| GLM-4.7 | 14/19 | Included | **Deep analysis** |

---

## How to Use This Assessment

### For new model evaluation:

```bash
# Run full eval suite on a new model
OPENROUTER_API_KEY=$(skate get OPENROUTER_API_KEY) \
  bun run src/cli/pi-eval-runner.ts <model-id> --run-all

# Run specific fixture
bun run src/cli/pi-eval-runner.ts <model-id> --fixture=edinburgh
bun run src/cli/pi-eval-runner.ts <model-id> --fixture=iq
```

### To check historical performance:

```bash
# All runs for a model
cat data/eval_runs.jsonl | jq 'select(.models | contains(["<model-id>"]))'

# All test results
cat data/eval_log.json | jq 'select(.modelId == "<model-id>")'
```

### To add a model to the registry:

Edit `models/models.json` following the existing schema.

---

## Key Insights

1. **Diffusion > Autoregressive** for Edinburgh compliance
   - Mercury-2's iterative refinement aligns with "verify before commit"
   - This is why it consistently passes the sycophancy trap

2. **Free ≠ Bad**
   - Nemotron Nano (free) = excellent grading model
   - Nemotron Ultra (free) = 4/4 Edinburgh when it completes
   - NVIDIA's free tier is an arbitrage opportunity

3. **Speed ≠ Intelligence**
   - Nemotron Super is "smart" but impractical (~130s)
   - Mercury-2 is fast AND smart

4. **Benchmaxxing is detectable**
   - "No seams" property = polished hollow
   - Trap vectors catch what benchmarks miss
   - Kimi K2.6 proves you can score high without benchmaxxing

5. **Variance is real**
   - Same model, same test, different runs = different results
   - Run-based logging captures this
   - "Time of the month" might actually matter

---

## Files Reference

| Document | Content |
|----------|---------|
| `models/models.json` | Machine-readable registry |
| `models/README.md` | Registry documentation |
| `data/eval_log.json` | Historical test results (runId tagged) |
| `data/eval_runs.jsonl` | Run metadata |
| `data/README.md` | Data format documentation |
| `docs/model-eval-q2-2026.md` | Full Q2 2026 report |
| `docs/model-eval-bankruptcy.md` | MiniMax/GLM analysis |
| `docs/why-kimi-k2.6-hasnt-benchmaxxed.md` | Kimi K2.6 deep dive |
| `docs/eval-review-q2-2026.md` | This session's review |
| `src/cli/pi-eval-runner.ts` | Eval runner code |

---

*Generated: 2026-06-14*  
*Assessment framework: Edinburgh Protocol + IQ Benchmark*  
*Grader: nvidia/nemotron-3-nano-30b-a3b:free (default)*