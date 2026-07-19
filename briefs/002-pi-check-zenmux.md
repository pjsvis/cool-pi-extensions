# brief: pi-check CLI + ZenMux provider

**Session:** 2026-06-09
**TD:** (untracked — infrastructure session)
**Status:** done

## What we did

### pi-check: provider connectivity checker

Wrote a TypeScript/Bun CLI (`cli/pi-check/check.ts`) using citty 0.2.2. It reads `~/.pi/agent/models.json`, resolves `!skate get` keys, probes every provider's `/models` endpoint concurrently, and reports pass/fail with timing and diagnostic detail.

**Key features:**
- Concurrent checks (8 providers in ~2s total)
- Precise failure classification: `connection refused`, `timeout`, `DNS not found`, `auth` (401/403), `network error`
- `!skate get <name>` key resolution via `execSync` to skate CLI
- `--json` machine-readable output with full diagnostic objects
- `--config <path>` for custom models.json locations
- `pi-check <provider>` single-provider filter
- `--zenmux-mgmt` queries ZenMux management API (subscription tier, quota usage, PAYG balance, flow rate) using `zenmux_management_api_key` from skate
- Global install via `bun link`

**Output:**
```
✓ ollama         OK (12ms, 0 model(s))
✗ llama          FAIL — connection refused
✓ omlx           OK (9ms, 2 model(s))
✓ openrouter     OK (312ms, 341 model(s))
✓ moonshot       OK (497ms, 9 model(s))
✓ minimax        OK (3s, 8 model(s))
✓ zenmux         OK (519ms, 131 model(s))
✓ zai            OK (1.5s, 7 model(s))

7 passed  1 failed  0 skipped  8 total
```

### ZenMux provider

Added `zenmux` to models.json with 14 models across 9 providers:

| Model | Cost (in/out $/MTok) | Context |
|---|---|---|
| anthropic/claude-sonnet-4.5 | 3 / 15 | 200K |
| anthropic/claude-opus-4.8 | 5 / 25 | 200K |
| google/gemini-2.5-pro | 1.25 / 10 | 1M |
| google/gemini-2.5-flash | 0.30 / 2.50 | 1M |
| openai/gpt-5 | 1.25 / 10 | 272K |
| qwen/qwen3.7-plus | 0.40 / 1.60 | 131K |
| qwen/qwen3.7-max | 1.25 / 3.75 | 1M |
| minimax/minimax-m3 | 0.30 / 1.20 | 512K |
| x-ai/grok-build-0.1 | 1 / 2 | 256K |
| x-ai/grok-4.3 | 1.25 / 2.50 | 1M |
| deepseek/deepseek-v4-pro | 0.44 / 0.89 | 1M |
| baidu/ernie-5.1 | 0.59 / 2.65 | 128K |
| inclusionai/ring-2.6-1t | 0.30 / 2.50 | 262K |
| xiaomi/mimo-v2.5-pro | 0.44 / 0.88 | 1M |

**Not added:** `zenmux/auto` (requires `model_routing_config` param), `qwen/qwen3.5-max` (deprecated on ZenMux).

### Model audit findings

- **llama** — server not running on port 1234; connection refused
- **zai** — TCP-level block via Alibaba Cloud WAF (`open.bigmodel.cn`); periodic, got lucky with a pass window. GLM models accessible via OpenRouter (`z-ai/glm-4.7`)
- **moonshot** — confirmed working despite initial `Invalid Authentication` false alarm
- **Kimi K2.6 reasoning quirk** — model pushes output into `reasoning_content` before `content`; needs adequate `maxTokens` budget or reasoning disabled for short prompts

### Files changed

| File | Change |
|---|---|
| `cli/pi-check/check.ts` | New — main CLI |
| `cli/pi-check/package.json` | New — Bun project with citty 0.2.2 |
| `~/.pi/agent/models.json` | Added `zenmux` provider with 14 models |
| `README.md` | Added pi-check section, ZenMux docs, global install instructions |
| `.gitignore` | Added `cli/pi-check/node_modules/` |

## Known gaps

- `llama` provider needs server startup (probably `llama-server` on port 1234)
- `zai` direct API blocked; fallback to OpenRouter's `z-ai/glm-*` models
- ZenMux management API needs separate key; regular API key won't work with mgmt endpoints
- pi-check help shows camelCase `--zenmuxMgmt` flag (citty auto-generates); could alias to `--zenmux-mgmt`

## Next

- Start `td-8997b7` (rewrite silo extension)
- Consider adding `--no-color` flag to pi-check
- Monitor ZenMux special offers manually via web console
