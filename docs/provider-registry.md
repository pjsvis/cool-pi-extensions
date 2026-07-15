# Pi Provider Registry
**Generated:** 2026-07-15
**Source:** `~/.pi/agent/models.json`
**Providers:** 10  ·  **Total models:** 46

_Regenerate with `just registry` (scripts/gen-provider-registry.ts)._

---
## ollama

| Property | Value |
|---|---|
| Base URL | `http://127.0.0.1:11434/v1` |
| API | `openai-completions` |
| Auth | local |
| Key source | inline |

### Models (1)

| Model | Reasoning | Input | Context | MaxTok | Cost (in/out) | Notes |
|---|---|---|---|---|---|---|
| `gemma4:e4b` | ✓ | text, image | 131072 | ? | ?/? |  |

## llama

| Property | Value |
|---|---|
| Base URL | `http://127.0.0.1:1234/v1` |
| API | `openai-completions` |
| Auth | local |
| Key source | inline |

### Models (2)

| Model | Reasoning | Input | Context | MaxTok | Cost (in/out) | Notes |
|---|---|---|---|---|---|---|
| `Gemma-4-E4B-It` | ✓ | text, image | 32768 | 8192 | $0/$0 |  |
| `Qwen3.5-27B` | ✓ | text, image | 32768 | 8192 | $0/$0 |  |

## omlx

| Property | Value |
|---|---|
| Base URL | `http://127.0.0.1:8000/v1` |
| API | `openai-completions` |
| Auth | Bearer |
| Key source | `!skate get open_api_key` |

### Models (1)

| Model | Reasoning | Input | Context | MaxTok | Cost (in/out) | Notes |
|---|---|---|---|---|---|---|
| `Qwen3-14B-4bit` | — | text | 32768 | 32768 | $0/$0 |  |

## openrouter

| Property | Value |
|---|---|
| Base URL | `—` |
| API | `—` |
| Auth | local |
| Key source | `!skate get open_api_key` |

### Models (13)

| Model | Reasoning | Input | Context | MaxTok | Cost (in/out) | Notes |
|---|---|---|---|---|---|---|
| `inception/mercury-2` | ✓ | text, image | 128000 | 50000 | $0.25/$0.75 |  |
| `nex-agi/nex-n2-pro:free` | — | ? | ? | ? | ?/? | Free on OpenRouter — two-week promo. |
| `x-ai/grok-4.3` | ✓ | text | 131072 | 32768 | $3/$15 |  |
| `x-ai/grok-4.20` | ✓ | text | 131072 | 32768 | $3/$15 |  |
| `deepseek/deepseek-v4-flash` | — | text | 1000000 | 65536 | $0.14/$0.28 |  |
| `deepseek/deepseek-v3.2` | ✓ | text | 128000 | 65536 | $0.28/$0.42 |  |
| `moonshotai/kimi-k2.7-code` | ✓ | text, image | 262144 | 262144 | $0.95/$4 |  |
| `z-ai/GLM-5.2` | ✓ | text, image | 1000000 | 131072 | $1.4/$4.4 |  |
| `minimax/minimax-m2.7` | ✓ | text | 204800 | 128000 | $0.3/$1.2 |  |
| `minimax/minimax-m2.5` | ✓ | text | 204800 | 128000 | $0.3/$1.2 |  |
| `z-ai/glm-4.7` | ✓ | text | 200000 | 131072 | $0.6/$2.2 |  |
| `qwen/qwen3-coder-plus` | — | text | 32768 | 32768 | $0.2/$0.6 |  |
| `qwen/qwen3-max` | ✓ | text, image | 32768 | 32768 | $0.8/$2.4 |  |

## moonshot

| Property | Value |
|---|---|
| Base URL | `https://api.moonshot.ai/v1` |
| API | `openai-completions` |
| Auth | Bearer |
| Key source | `!skate get moonshotai_api_key` |

### Models (3)

| Model | Reasoning | Input | Context | MaxTok | Cost (in/out) | Notes |
|---|---|---|---|---|---|---|
| `kimi-k2.7-code` | ✓ | text, image | 262144 | 262144 | $0.95/$4 |  |
| `kimi-k2.6` | ✓ | text, image | 262144 | 262144 | $0.95/$4 |  |
| `kimi-k2.5` | ✓ | text, image | 262144 | 262144 | $0.6/$3 |  |

## minimax

| Property | Value |
|---|---|
| Base URL | `https://api.minimax.io/v1` |
| API | `openai-completions` |
| Auth | Bearer |
| Key source | `!skate get minimax_api_key` |

### Models (2)

| Model | Reasoning | Input | Context | MaxTok | Cost (in/out) | Notes |
|---|---|---|---|---|---|---|
| `MiniMax-M2.7` | ✓ | text | 204800 | 128000 | $0.3/$1.2 |  |
| `MiniMax-M2.5` | ✓ | text | 204800 | 128000 | $0.3/$1.2 |  |

## zai

| Property | Value |
|---|---|
| Base URL | `https://open.bigmodel.cn/api/paas/v4` |
| API | `openai-completions` |
| Auth | Bearer |
| Key source | `!skate get zai_api_key` |

### Models (4)

| Model | Reasoning | Input | Context | MaxTok | Cost (in/out) | Notes |
|---|---|---|---|---|---|---|
| `glm-5.2` | ✓ | text, image | 1000000 | 131072 | $1.4/$4.4 |  |
| `glm-5.1` | ✓ | text | 200000 | 131072 | $1.4/$5.6 |  |
| `glm-5-turbo` | ✓ | text | 200000 | 131072 | $0.5/$2 |  |
| `glm-4.7` | ✓ | text | 200000 | 131072 | $0.6/$2.2 |  |

## nvidia

| Property | Value |
|---|---|
| Base URL | `https://integrate.api.nvidia.com/v1` |
| API | `openai-completions` |
| Auth | Bearer |
| Key source | `!skate get nvidia_api_key` |

### Models (5)

| Model | Reasoning | Input | Context | MaxTok | Cost (in/out) | Notes |
|---|---|---|---|---|---|---|
| `google/diffusiongemma-26b-a4b-it` | — | text, image | 262144 | 4096 | $0/$0 |  |
| `nvidia/nemotron-3-super-120b-a12b` | ✓ | text | 128000 | 32768 | $0/$0 |  |
| `nvidia/llama-3.3-nemotron-super-49b-v1.5` | ✓ | text | 128000 | 32768 | $0/$0 |  |
| `nvidia/llama-3.1-nemotron-ultra-253b-v1` | ✓ | text | 128000 | 32768 | $0/$0 |  |
| `nvidia/nemotron-3-nano-30b-a3b` | ✓ | text | 128000 | 32768 | $0/$0 |  |

## zenmux

| Property | Value |
|---|---|
| Base URL | `https://zenmux.ai/api/v1` |
| API | `openai-completions` |
| Auth | Bearer |
| Key source | `!skate get zenmux_api_key` |

### Models (10)

| Model | Reasoning | Input | Context | MaxTok | Cost (in/out) | Notes |
|---|---|---|---|---|---|---|
| `z-ai/glm-5.2` | ✓ | text, image | 1000000 | 131072 | $1.4/$4.4 | Failover route for Z.ai-direct GLM-5.2 (variability). 4/4 traps + 8/8 IQ. Decision 016. |
| `google/gemini-3.1-pro-preview` | ✓ | text, image | 1048576 | 65536 | $2/$12 | 4/4 traps (eval 2026-07-12). Fails EDI-005 unprimed — fine under priming. |
| `google/gemini-2.5-pro` | ✓ | text, image | 1048576 | 65536 | $1.25/$10 | 4/4 traps (eval 2026-07-12). Fails EDI-005 unprimed. |
| `deepseek/deepseek-v4-pro` | ✓ | text | 1000000 | 65536 | $0.435/$0.87 | 14/19 + 7/8 IQ. 1M ctx. |
| `qwen/qwen3.7-max` | ✓ | text | 1000000 | 65536 | $0.43/$1.29 | 16/19. 1M ctx. |
| `anthropic/claude-fable-5` | ✓ | text, image | 1000000 | 32768 | $10/$50 | 4/4 traps + 8/8 IQ (top-tier). $10/$50 — reserve for frontier tasks. 30-day data retention (Covered Model) — tensions with local-first ethos. |
| `x-ai/grok-4.5-free` | ✓ | text, image | 500000 | 32768 | $0/$0 | Free-tier freebie (ZenMux). Grab-and-use. |
| `google/gemini-3.5-flash` | ✓ | text, image | 1048576 | 65536 | $1.5/$9 | 4/4 primed traps (eval 2026-07-12, re-run after an empty-response flake on EDI-002). Fails EDI-005 unprimed. |
| `openai/gpt-5.6-luna` | ✓ | text, image | 1050000 | 32768 | $1/$6 | 4/4 primed traps (eval 2026-07-12). Published 2026-07-10. Fails EDI-005 unprimed. |
| `x-ai/grok-4.5` | ✓ | text, image | 500000 | 32768 | $2/$6 | 4/4 primed traps (eval 2026-07-12). Paid twin of grok-4.5-free. Fails EDI-005 unprimed. |

## togetherai

| Property | Value |
|---|---|
| Base URL | `https://api.together.xyz/v1` |
| API | `openai-completions` |
| Auth | Bearer |
| Key source | `!skate get togetherai_api_key` |

### Models (5)

| Model | Reasoning | Input | Context | MaxTok | Cost (in/out) | Notes |
|---|---|---|---|---|---|---|
| `Prism-ML/Ternary-Bonsai-27B` | ✓ | text, image | 262144 | 32768 | $0/$0 | FREE limited-time dev preview (PrismML, via Together). Ternary Qwen3.6-27B @1.71bpw, ~95% FP16 retention (vendor-reported). Apache 2.0 weights. Vendor: agentic coding not yet strong. Grab-and-use; prune when preview ends (Decision 016). Behavioral eval pending (not on OpenRouter/ZenMux). |
| `meta-llama/Llama-4-Scout-17B-16E-Instruct` | ✓ | text, image | 1048576 | 32768 | $0.18/$0.59 | 1M-ctx Llama-4 (17Bx16E MoE), multimodal. Cheap on Together (0.18/0.59). New to config. |
| `moonshotai/Kimi-K2.6` | ✓ | text, image | 262144 | 262144 | $1.2/$4.5 | Failover for the primary 18/19 Kimi K2.6. Pricier than Moonshot-direct (0.95/4) but second route; uses prepaid Together credit (Decision 016). |
| `deepseek-ai/DeepSeek-V4-Pro` | ✓ | text | 512000 | 65536 | $1.74/$3.48 | Failover — ~4x ZenMux (0.435/0.87), pricey; second route, uses prepaid credit. 14/19 + 7/8 IQ. |
| `Qwen/Qwen3.7-Max` | ✓ | text | 1000000 | 65536 | $1.25/$3.75 | Failover — ~3x ZenMux (0.43/1.29), pricey; second route, uses prepaid credit. 16/19. |

