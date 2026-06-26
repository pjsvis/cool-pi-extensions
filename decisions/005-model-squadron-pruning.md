# Decision 005: Model Squadron Pruning — June 2026

**Date:** 2026-06-21  
**Status:** Accepted  
**Deciders:** Pi Agent (via Edinburgh Protocol evaluation)

---

## Context

The model landscape evolved rapidly in Q2 2026:
- GLM-5.2 released (June 13) — 8/8 IQ, 1M context, MIT open weights
- Kimi K2.7-code released (June 12) — open-weight coding model
- DeepSeek V4 family available
- MiniMax M3 evaluation shows regression from M2.7

We needed to audit our squadron against current evals and prune accordingly.

---

## Decision

### 1. DROP: MiniMax M3

**Rationale:**
- Edinburgh Protocol eval: 7/19 (poor alignment)
- Failed "Systems Over Villains" trap vector
- Earlier "bankruptcy" assessment was not measurement noise — eval confirms poor fit
- M2.7 remains strong at 4/4 Edinburgh

**Action:** Remove M3 from active rotation. Keep M2.7.

### 2. ADD: GLM-5.2 (Z.ai)

**Rationale:**
- 8/8 IQ — same as Mercury-2 (best performer)
- 4/4 Edinburgh trap vectors
- 1M context with IndexShare (2.9x compute reduction)
- MIT open weights
- Best open-weight coding model (Terminal-Bench 2.1: 81.0 vs Claude Opus 4.8: 85.0)

**Action:** Add to zai provider config with 1M context variant.

### 3. ADD: Kimi K2.7-code (Moonshot)

**Rationale:**
- Vendor-reported 4/4 Edinburgh
- 30% fewer thinking tokens vs K2.6
- Open-weight (Modified MIT license)
- Lower inference cost for agentic workflows

**Action:** Add to moonshot provider config. Test independently before full deployment.

### 4. ADD: DeepSeek V4 Flash (OpenRouter)

**Rationale:**
- Default DeepSeek model
- Lower cost than V4 Pro ($0.14/$0.28 vs $0.75/$2.50)
- Good for high-volume work

**Action:** Add to openrouter modelOverrides.

### 5. ADD: Qwen 3.x family

**Rationale:**
- Qwen 3 Max: 1M context, strong reasoning
- Qwen 3.7 Max/Plus: Available via ZenMux
- Deprecate Qwen 2.5 3B (local) — muppet behavior confirmed

**Action:** Add Qwen 3 Max, Qwen 3 Coder Plus, Qwen 3.7 Max/Plus.

### 6. KEEP: Kimi K2.6 (Primary Moonshot)

**Rationale:**
- 18/19 Edinburgh — highest scorer in squadron
- Proven in production
- K2.7-code claims are vendor-reported only (VentureBeat: "benchmarks don't check out")

**Action:** K2.6 remains primary. K2.7-code on probation.

---

## Consequences

### Positive
- Squadron now has clear tier: Premium (K2.6, GLM-5.2), Mid (GLM-5, Qwen 3.7 Max, DS V4 Pro), Free (Nemotron)
- Drop decision eliminates poor Edinburgh performer
- New models fill capability gaps (1M context, open-weight)

### Negative
- MiniMax M3 removal may affect users who preferred M3 over M2.7
- K2.7-code needs independent evaluation before full confidence

---

## Alternatives Considered

### Alternative A: Keep all models
- Pros: Maximum flexibility
- Cons: Confusing squadron with unclear recommendations

### Alternative B: Aggressive pruning (keep only top 5)
- Pros: Simple decision tree
- Cons: Loses redundancy, cost optimization options

**Chosen:** Balanced approach — clear tiers with documented rationale.

---

## Verification

Run `bun run edinburgh-eval.ts` to verify any future additions before adding to squadron.

**Minimum threshold:** 14/19 Edinburgh OR 4/4 trap vectors.

---

## References

- Edinburgh Protocol eval suite: `prompts/edinburgh-protocol-evals-v1.json`
- Eval runner: `src/cli/pi-check/edinburgh-eval.ts`
- Recommended models: `models/RECOMMENDED.md`