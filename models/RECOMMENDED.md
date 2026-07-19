# Recommended Models — Edinburgh Protocol Squadron

**Last Updated:** 2026-07-19  
**Eval Framework:** Edinburgh Protocol v1 (4 trap vectors + scoring eval)  
**Max Score:** 19 points across 8 criteria

---

## Quick Reference

| Tier | Models | Use Case |
|------|--------|----------|
| **⭐ Premium** | Kimi K2.6, GLM-5.2, DeepSeek V4 Pro | Production, complex reasoning |
| **💰 Mid-Tier** | Qwen 3.7 Max, GLM-5, GLM-5.1 | Balanced cost/performance |
| **🆓 Free** | Nemotron 3 Nano (30B), Nemotron 3 Super (120B) | Batch evaluation, testing |

---

## Current Eval Results

### ⭐ TOP PERFORMERS (18+/19)

| Model | Score | Edinburgh | Speed | Notes |
|-------|-------|-----------|-------|-------|
| **Kimi K2.6** | 18/19 | 4/4 ✓ | ~45s | Standout. Highest score. No benchmaxxing. |
| **GLM-5.2** | 8/8 IQ | 4/4 ✓ | ~112s | 1M context, MIT open weights, best open-weight coding |

### ✅ STRONG RECOMMENDATIONS (14-17/19)

| Model | Score | Edinburgh | Speed | Notes |
|-------|-------|-----------|-------|-------|
| **GLM-5** | 16/19 | 4/4 ✓ | ~20s | Clean Edinburgh pass. Fast. |
| **Qwen 3.7 Max** | 16/19 | 4/4 ✓ | ~39s | Strong, 1M context, good for coding |
| **GLM-5.1** | 15/19 | 4/4 ✓ | ~19s | Good Edinburgh alignment |
| **DeepSeek V4 Pro** | 14/19 | 4/4 ✓ | ~41s | Strong performer, 7/8 IQ |

### ⚠️ WATCH (10-13/19)

| Model | Score | Edinburgh | Notes |
|-------|-------|-----------|-------|
| **DeepSeek V3.2** | 8/8 IQ | 4/4 ✓ | Still strong, but V4 Pro available |
| **Nemotron 3 Super** | 4/4+ | 4/4 ✓ | Slow but capable |

### ❌ DROP / DEPRECATED

| Model | Status | Reason |
|-------|--------|--------|
| **MiniMax M3** | **DROP** | 7/19 — poor Edinburgh alignment |
| **Qwen 2.5 (3B)** | Deprecated | Muppet. Runs toward traps. |
| **Phi-3 (3.8B)** | Deprecated | Too slow, ~4min per test |
| **DeepSeek R1** | Watch | 2/4 Edinburgh, multiple failures |

---

## Old vs New Comparison

| Old Model | New Model | Change | Verdict |
|-----------|-----------|--------|---------|
| GLM-5 (16/19) | GLM-5.2 (8/8 IQ) | Major improvement | ⬆️ **Upgrade** |
| Kimi K2.6 (18/19) | Kimi K2.7-code (pending) | Vendor claims 4/4 | 🔄 **Test pending** |
| DeepSeek V4 Pro (14/19) | DeepSeek V4 Flash | Lower cost | 🔄 **Use V4 Flash for volume** |
| MiniMax M2.7 (4/4) | MiniMax M3 (7/19) | **Regression** | ⬇️ **DROP M3** |

---

## Provider Access

| Provider | Models Available | Status |
|----------|------------------|--------|
| **Moonshot** | K2.7-code, K2.6, K2.5 | ✅ All tested working |
| **Z.ai** | GLM-5.2, 5.1, 5-turbo, 4.7 | ✅ Working (1M context native) |
| **ZenMux** | GLM-5.2, Gemini 3.1/2.5/3.5, DeepSeek V4 Pro, Qwen 3.7 Max, Claude Fable 5, Grok 4.5 (+free), GPT-5.6 Luna | ✅ Brought online 2026-07-14 (10 models) — supplemental, directs retained |
| **OpenRouter** | Mercury-2, Nex N2 Pro, Grok, DeepSeek | ✅ Multi-provider routing |
| **NVIDIA** | Nemotron family | ✅ Free tier |
| **MiniMax** | M2.7, M2.5 | ✅ Direct + ZenMux both working |
| **Together AI** | Ternary Bonsai 27B (free preview), Llama-4-Scout, Kimi K2.6, DeepSeek V4 Pro, Qwen 3.7 Max | ✅ Online 2026-07-14 (271 catalog; 5 curated — Bonsai free + Llama-4-Scout new + 3 pricey failovers on prepaid credit) |
| **SpaceXAI** | Grok 4.5, Grok 4.3, Grok Build 0.1 | ✅ Online 2026-07-19 — direct first-party route at `api.x.ai` (xAI→SpaceXAI is branding; endpoint unchanged). Cheaper than ZenMux for grok-4.3 ($1.25/$2.50 vs $3/$15). Failover for the ZenMux grok route. Decision 016. |
| **Qwen (DashScope)** | Qwen 3.7 Max/Plus, Qwen 3.6 Flash, GLM-5.2, DeepSeek V4 Pro/Flash | ✅ Online 2026-07-19 — direct Alibaba DashScope route (`dashscope-intl.aliyuncs.com/compatible-mode/v1`). New-user free quota (90d) covers GLM + DeepSeek — free-tier freebie capture for models we already pay for via z.ai/ZenMux. qwen-3.8 announced but not yet on the -intl API. Decision 016. |
| **DeepSeek** | DeepSeek V4 Pro, DeepSeek V4 Flash | ✅ Online 2026-07-19 — direct first-party route at `api.deepseek.com/v1`. Closes the last direct-route gap (DeepSeek was proxy-only via ZenMux/OpenRouter). Decision 016. |

---

## Decision Rationale

### WHY DROP MINIMAX M3?
- Edinburgh Protocol scoring: 7/19 (vs M2.7's 4/4)
- Failed "Systems Over Villains" trap vector
- Earlier "bankruptcy" assessment may have been ZenMux proxy artifact, but eval confirms poor fit
- **Recommendation:** Keep M2.7, drop M3 from active rotation

### WHY KEEP KIMI K2.6 OVER K2.7-CODE?
- K2.6: 18/19 Edinburgh, proven in production
- K2.7-code: 4/4 (vendor-reported), independent eval pending
- Vendor claims 30% fewer thinking tokens but "benchmarks don't check out" (VentureBeat)
- **Recommendation:** Use K2.6 as primary, test K2.7-code for specific use cases

### WHY KEEP GLM-5 OVER GLM-5.1?
- GLM-5: 16/19, faster (~20s)
- GLM-5.1: 15/19, but fails EDI-002 (Observational Rigor)
- GLM-5.2: Best overall (8/8 IQ), use for long-context tasks
- **Recommendation:** GLM-5.2 > GLM-5 > GLM-5.1

---

## Testing Protocol

To add a new model to the squadron:

```bash
cd src/cli/pi-check
bun run edinburgh-eval.ts <model-tag>
```

Required threshold:
- **Recommended:** 14+/19 Edinburgh, 4/4 trap vectors
- **Watch:** 10-13/19 or 3/4 trap vectors
- **Drop:** <10/19 or failed critical traps

---

## API Connectivity Status (2026-06-26)

| Provider | Model | Status | Ping Result |
|----------|-------|--------|-------------|
| Z.ai | GLM-5.2 | ✅ Working | `glm-5.2` returned |
| Moonshot | Kimi K2.7-code | ✅ Working | `kimi-k2.7-code` returned |
| Moonshot | Kimi K2.6 | ✅ Working | `kimi-k2.6` returned |
| MiniMax | M2.7 | ✅ Working | $30 top-up resolved balance |

### ⚠️ GLM-5.2[1m] Variant Note

The `[1m]` suffix variant does **not exist** on the OpenAI-compatible endpoint. Available models:
```
glm-4.5, glm-4.5-air, glm-4.6, glm-4.7, glm-5, glm-5-turbo, glm-5.1, glm-5.2
```

The `[1m]` variant is **Claude Code / Anthropic-compatible endpoint only** (`https://open.z.ai/api/paas/v4/`). GLM-5.2 on the OpenAI endpoint supports 1M context natively — no suffix needed.

---

## Changelog

| Date | Change |
|------|--------|
| 2026-07-19 | Pruned nex-n2-pro (free tier ended — Decision 016) from eval registry + live config. Fixed kimi-k2.7-code eval (wrong slug + the eval's kimi handling broke it: thinking-disabled rejected, temp must be 1). After the fix, kimi-k2.7-code scored 16/16 (was 1/16 broken). Eval `buildRequestBody` now special-cases kimi-k2.7-code (thinking on, temp 1, 4096 budget). |
| 2026-07-19 | Failover ordering policy codified (Decision 020): freebie → cheapest → direct → expensive. Direct ≠ cheapest (Qwen 3.7 Max: ZenMux proxy 5× cheaper than direct). Eval fallback chains rewired to include spacexai/qwen/deepseek; grok-4.3 primary → spacexai direct. Dropped the openrouter grok-4.3 $3/$15 override (superseded by spacexai $1.25/$2.50). |
| 2026-07-19 | DeepSeek provider added (direct `api.deepseek.com/v1`): deepseek-v4-pro ($0.44/$0.89 est), deepseek-v4-flash ($0.14/$0.28 est). Key verified via pi-check + usage test. Closes the direct-route gap (DeepSeek was proxy-only). Decision 016. |
| 2026-07-19 | Qwen (DashScope) provider added (direct `dashscope-intl` route): qwen3.7-max ($2.50/$7.50, 1M), qwen3.7-plus ($0.40/$1.60), qwen3.6-flash ($0.25/$1.50) + free-tier GLM-5.2 / DeepSeek V4 Pro/Flash (freebie capture — failover routes for z.ai/ZenMux). Key verified via `pi-check` (149 models) + usage test. qwen-3.8 announced today but not yet on the -intl API — add when the slug appears. Decision 016. |
| 2026-07-19 | SpaceXAI provider added (direct `api.x.ai` route): grok-4.5 ($2/$6, 500k ctx), grok-4.3 ($1.25/$2.50), grok-build-0.1 ($1/$2 est). Key verified via `pi-check` + a usage test. xAI→SpaceXAI is a branding move — endpoint still `api.x.ai` (12+ month migration window). grok-4.5/4.3 already 4/4 primed via ZenMux; the direct route is failover + a cost win (esp. grok-4.3). grok-build-0.1 (coding, open-sourced 2026-07-15) is the new one — worth a look. Decision 016. |
| 2026-07-14 | ZenMux provider brought online (10 models); gpt-5.6-luna / grok-4.5 / gemini-3.5-flash eval'd 4/4 primed traps; omlx inline key → skate; provider-registry now generated (`just registry`); Decision 016 (provider portfolio: redundancy-by-design) |
| 2026-07-14 | Together AI provider added (5 curated of 271): Ternary Bonsai 27B (free dev preview) + Llama-4-Scout (cheap, 1M, new) + pricey failovers for Kimi K2.6 / DeepSeek V4 Pro / Qwen 3.7 Max (prepaid credit). Together NOT cheaper than ZenMux/Moonshot for those (~3–4×) — failover-only. Bonsai behavioral eval pending. |
| 2026-06-26 | Fixed: removed non-existent GLM-5.2[1m] from config |
| 2026-06-26 | Fixed: pinged all new models — K2.6, K2.7-code, GLM-5.2 working |
| 2026-06-21 | Added K2.7-code, GLM-5.2, DeepSeek V3.2, Qwen 3.x |
| 2026-06-21 | **DROP** MiniMax M3 (7/19 poor Edinburgh) |
| 2026-06-21 | Deprecated Qwen 2.5, Phi-3 |
| 2026-06-14 | Initial squadron established |