# Pi Provider Registry
**Generated:** 2026-06-09  
**Source:** `~/.pi/agent/models.json`  
**Providers:** 9  
**Total models configured:** 41

---

## ollama

| Property | Value |
|---|---|
| Base URL | `http://127.0.0.1:11434/v1` |
| API | `openai-completions` |
| Auth | local |
| Key source | none (local) |

### Models (1)

| Model | Reasoning | Input | Context | Max Tokens | Cost (in/out per MTok) | Notes |
|---|---|---|---|---|---|---|
| `gemma4:e4b` | ✓ | text, image | 131,072 | ? | $?/$? | |

---

## llama

| Property | Value |
|---|---|
| Base URL | `http://127.0.0.1:1234/v1` |
| API | `openai-completions` |
| Auth | local |
| Key source | none (local) |

### Models (2)

| Model | Reasoning | Input | Context | Max Tokens | Cost (in/out per MTok) | Notes |
|---|---|---|---|---|---|---|
| `Gemma-4-E4B-It` | ✓ | text, image | 32,768 | 8,192 | $0/$0 | |
| `Qwen3.5-27B` | ✓ | text, image | 32,768 | 8,192 | $0/$0 | |

---

## omlx

| Property | Value |
|---|---|
| Base URL | `http://127.0.0.1:8000/v1` |
| API | `openai-completions` |
| Auth | Bearer |
| Key source | inline |

### Models (1)

| Model | Reasoning | Input | Context | Max Tokens | Cost (in/out per MTok) | Notes |
|---|---|---|---|---|---|---|
| `Qwen3-14B-4bit` | — | text | 32,768 | 32,768 | $0/$0 | |

---

## openrouter

| Property | Value |
|---|---|
| Base URL | `https://openrouter.ai/api/v1` |
| API | `—` |
| Auth | — |
| Key source | `!skate get open_api_key` |

### Model Overrides (11)

| Model ID | Reasoning | Input | Context | Max Tokens | Cost (in/out per MTok) | Notes |
|---|---|---|---|---|---|---|
| `deepseek/deepseek-v4-flash` | — | text | ? | ? | $0.2/$0.8 (cache: $0.05) | |
| `deepseek/deepseek-v4-pro` | — | text | ? | ? | $0.75/$2.5 (cache: $0.15) | |
| `minimax/minimax-m2.5` | — | text | ? | ? | $0.3/$1.2 (cache: $0.075) | |
| `minimax/minimax-m2.7` | — | text | ? | ? | $0.3/$1.2 (cache: $0.075) | |
| `nex-agi/nex-n2-pro:free` | ✓ | text, image | 262,144 | 32,768 | $0/$0 | Free on OpenRouter — two-week promo starting June 9, 2026 |
| `qwen/qwen3-coder-flash` | — | text | ? | ? | $0.2/$0.6 (cache: $0.05) | |
| `qwen/qwen3-coder-plus` | — | text | ? | ? | $0.2/$0.6 (cache: $0.05) | |
| `qwen/qwen3-max` | — | text | ? | ? | $0.8/$2.4 (cache: $0.2) | |
| `x-ai/grok-4.20` | ✓ | text | 131,072 | 32,768 | $3/$15 (cache: $0.3) | |
| `x-ai/grok-4.3` | ✓ | text | 131,072 | 32,768 | $3/$15 (cache: $0.3) | |
| `z-ai/glm-4.7` | — | text | ? | ? | $0.4/$1.5 (cache: $0.08) | |

---

## moonshot

| Property | Value |
|---|---|
| Base URL | `https://api.moonshot.ai/v1` |
| API | `openai-completions` |
| Auth | Bearer |
| Key source | `!skate get moonshotai_api_key` |

### Models (2)

| Model | Reasoning | Input | Context | Max Tokens | Cost (in/out per MTok) | Notes |
|---|---|---|---|---|---|---|
| `kimi-k2.6` | ✓ | text, image | 262,144 | 262,144 | $0.95/$4 (cache: $0.095) | |
| `kimi-k2.5` | ✓ | text, image | 262,144 | 262,144 | $0.6/$3 (cache: $0.06) | |

---

## minimax

| Property | Value |
|---|---|
| Base URL | `https://api.minimax.io/v1` |
| API | `openai-completions` |
| Auth | Bearer |
| Key source | `!skate get minimax_api_key` |

### Models (3)

| Model | Reasoning | Input | Context | Max Tokens | Cost (in/out per MTok) | Notes |
|---|---|---|---|---|---|---|
| `MiniMax-M3` | ✓ | text, image | 1,000,000 | 512,000 | $0.6/$2.4 (cache: $0.12) | |
| `MiniMax-M2.7` | ✓ | text | 204,800 | 128,000 | $0.3/$1.2 (cache: $0.06) | |
| `MiniMax-M2.5` | ✓ | text | 204,800 | 128,000 | $0.3/$1.2 (cache: $0.06) | |

---

## zenmux

| Property | Value |
|---|---|
| Base URL | `https://zenmux.ai/api/v1` |
| API | `openai-completions` |
| Auth | Bearer |
| Key source | `!skate get zenmux_api_key` |

### Models (14)

| Model | Reasoning | Input | Context | Max Tokens | Cost (in/out per MTok) | Notes |
|---|---|---|---|---|---|---|
| `anthropic/claude-sonnet-4.5` | ✓ | text, image | 200,000 | 32,768 | $3/$15 (cache: $0.3) | |
| `anthropic/claude-opus-4.8` | ✓ | text, image | 200,000 | 32,768 | $5/$25 (cache: $0.5) | |
| `google/gemini-2.5-pro` | ✓ | text, image | 1,048,576 | 65,536 | $1.25/$10 (cache: $0.125) | |
| `google/gemini-2.5-flash` | ✓ | text, image | 1,048,576 | 65,536 | $0.3/$2.5 (cache: $0.03) | |
| `openai/gpt-5` | ✓ | text, image | 272,000 | 128,000 | $1.25/$10 (cache: $0.125) | |
| `qwen/qwen3.7-plus` | ✓ | text, image | 131,072 | 32,768 | $0.4/$1.6 (cache: $0.04) | |
| `qwen/qwen3.7-max` | ✓ | text | 1,000,000 | 65,536 | $1.25/$3.75 (cache: $0.125) | |
| `minimax/minimax-m3` | ✓ | text, image | 512,000 | 131,072 | $0.3/$1.2 (cache: $0.06) | 50% off special offer (check ZenMux console) |
| `x-ai/grok-build-0.1` | — | text, image | 256,000 | 32,768 | $1/$2 (cache: $0.2) | |
| `x-ai/grok-4.3` | — | text, image | 1,000,000 | 32,768 | $1.25/$2.5 (cache: $0.2) | |
| `deepseek/deepseek-v4-pro` | ✓ | text | 1,000,000 | 65,536 | $0.443/$0.887 (cache: $0.004) | |
| `baidu/ernie-5.1` | ✓ | text | 128,000 | 32,768 | $0.588/$2.646 (cache: $0.059) | |
| `inclusionai/ring-2.6-1t` | ✓ | text | 262,144 | 65,536 | $0.3/$2.5 (cache: $0.06) | |
| `xiaomi/mimo-v2.5-pro` | ✓ | text | 1,048,576 | 65,536 | $0.44/$0.88 (cache: $0.004) | |

---

## zai

| Property | Value |
|---|---|
| Base URL | `https://open.bigmodel.cn/api/paas/v4` |
| API | `openai-completions` |
| Auth | Bearer |
| Key source | `!skate get zai_api_key` |

### Models (3)

| Model | Reasoning | Input | Context | Max Tokens | Cost (in/out per MTok) | Notes |
|---|---|---|---|---|---|---|
| `glm-5.1` | ✓ | text | 200,000 | 131,072 | $1.4/$5.6 (cache: $0.28) | |
| `glm-5-turbo` | ✓ | text | 200,000 | 131,072 | $0.5/$2 (cache: $0.1) | |
| `glm-4.7` | ✓ | text | 200,000 | 131,072 | $0.6/$2.2 (cache: $0.12) | |

---

## nvidia

| Property | Value |
|---|---|
| Base URL | `https://integrate.api.nvidia.com/v1` |
| API | `openai-completions` |
| Auth | Bearer |
| Key source | `!skate get nvidia_api_key` |

### Models (4)

| Model | Reasoning | Input | Context | Max Tokens | Cost (in/out per MTok) | Notes |
|---|---|---|---|---|---|---|
| `nvidia/nemotron-3-super-120b-a12b` | ✓ | text | 128,000 | 32,768 | $0/$0 | NVIDIA NIM free tier |
| `nvidia/llama-3.3-nemotron-super-49b-v1.5` | ✓ | text | 128,000 | 32,768 | $0/$0 | NVIDIA NIM free tier |
| `nvidia/llama-3.1-nemotron-ultra-253b-v1` | ✓ | text | 128,000 | 32,768 | $0/$0 | NVIDIA NIM free tier |
| `nvidia/nemotron-3-nano-30b-a3b` | ✓ | text | 128,000 | 32,768 | $0/$0 | NVIDIA NIM free tier — fast & lightweight |

---

