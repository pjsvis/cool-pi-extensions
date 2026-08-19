---
title: Brief — MiniMax provider: two auth-path bugs and the probe gap
date: 2026-07-28
status: partial (Fix #2 landed; Fix #1 is operator-run)
protocol: Edinburgh Protocol v1.1.0
---

# Brief: MiniMax provider — two auth-path bugs and the probe gap

**Created:** 2026-07-28
**Status:** partial — Fix #2 landed in `models.json`; Fix #1 is a one-command operator fix on `auth.json` (outside the silo).
**Protocol:** Edinburgh Protocol v1.1.0
**Origin:** user report — auth issues communicating with `minimax/MiniMax-M3` and `minimax/MiniMax-M2.7`.
**Evidence:** live `curl` against `api.minimax.io` (both `/v1` and `/anthropic`), `pi --model … --print` reproductions, `~/.pi/agent/auth.json` byte-level inspection, `provider-composer.js` source.

## The report

> We are having problems communicating with the minimax provider with Minimax-m3 and minimax-m2.7 — auth issues.

Two distinct failure modes, one per symptom. Both reproduce deterministically. The credential itself is valid throughout — the failures are in Pi's resolution and configuration layers.

## Bug #1 — 401 auth: stale stored credential with leading whitespace  *(the "auth issue")*

**Symptom:** `pi --model minimax/MiniMax-M2.7 --print "say pong"` →
```
401: {"type":"authorized_error","message":"login fail: Please carry the API secret key in the 'Authorization' field of the request header (1004)","http_code":"401"}
```

**Root cause:** The stored credential in `~/.pi/agent/auth.json` (`minimax.key`, 716 bytes) is the **valid key with two leading whitespace characters** (`'  eyJh…'`). The correct key in skate (`minimax_api_key`, 714 bytes) has no whitespace.

Pi's credential resolver (`composeApiKeyAuth.resolve` in `provider-composer.js`) checks the **stored credential first** and never falls through to the `!skate get minimax_api_key` config in `models.json`. The OpenAI SDK then sends `Authorization: Bearer   eyJ…` (leading spaces) → MiniMax's `/v1` endpoint rejects with 1004.

The Anthropic endpoint (`/anthropic`, `x-api-key` header) **tolerates** the whitespace — which is why `pi auth`'s connectivity check didn't flag it and the bug hid until a real chat completion was attempted.

**Proof:**
| Key | Endpoint | Header | Result |
|---|---|---|---|
| `auth.json` raw (716, leading spaces) | `/v1/chat/completions` | `Authorization: Bearer` | **401** |
| `auth.json` stripped (714) | `/v1/chat/completions` | `Authorization: Bearer` | **200** |
| `auth.json` raw | `/anthropic/v1/messages` | `x-api-key` | **200** (tolerant) |
| skate `minimax_api_key` (714) | `/v1/chat/completions` | `Authorization: Bearer` | **200** |

**Fix (operator — `auth.json` is outside the silo):**
```bash
tmp=$(mktemp) && jq '.minimax.key |= .strip' ~/.pi/agent/auth.json > "$tmp" \
  && mv "$tmp" ~/.pi/agent/auth.json && chmod 600 ~/.pi/agent/auth.json
```
Or re-run `pi auth login --provider minimax` and paste `$(skate get minimax_api_key)` carefully.

## Bug #2 — 404 on `minimax/MiniMax-M3`: baseUrl/api collision  *(fixed)*

**Symptom:** `pi --model minimax/MiniMax-M3 --print "say pong"` → `404 404 page not found`

**Root cause:** The `minimax` block in `models.json` sets a provider-level `baseUrl: https://api.minimax.io/v1` (for the OpenAI-completions endpoint used by M2.7/M2.5). Per `applyModelsJson` in `provider-composer.js:112`, that override is applied to **all** built-in minimax models — including the built-in `MiniMax-M3` and `MiniMax-M2.7-highspeed`, which use the **Anthropic Messages API** at `api.minimax.io/anthropic`. The Anthropic SDK then posts to `api.minimax.io/v1/v1/messages` (double `v1`) → **404**.

**Proof:** `curl https://api.minimax.io/v1/v1/messages` → 404. `curl https://api.minimax.io/anthropic/v1/messages` (correct path, `x-api-key`) → 200.

**Fix applied:** added a `MiniMax-M3` entry to the `minimax` provider's `models[]` in `models.json`. Same-id overrides the built-in anthropic variant; the model now resolves to the OpenAI `/v1` endpoint. M3 is confirmed working on `/v1/chat/completions` (HTTP 200). Updated `_squadron_note`.

**`MiniMax-M2.7-highspeed`** is the same class of bug (built-in anthropic model dragged to `/v1`). It is **not** in `enabledModels` and cannot be removed from the built-in catalog via `models.json` (Pi has no `disabledModels` mechanism — only the `enabledModels` whitelist). Per the user's direction to "drop" it: it stays absent from `enabledModels` and is documented as known-broken-if-addressed. No action needed; it cannot be selected via the model picker.

## The probe gap (why this wasn't caught earlier)

The existing `pi-check` (`src/cli/pi-check/check.ts`, brief 002) probes each provider's **`/models` list endpoint** and resolves keys via `!skate get` from `models.json`. This bypasses two things:

1. **`auth.json` credential precedence.** `pi-check` never reads `auth.json`, so
   it sent the valid skate key and passed — while the real runtime sent the
   stale stored key and failed.

2. **Per-model baseUrl + API mapping.** Hitting `/models` doesn't exercise the
   chat-completion path, so the `v1/v1/messages` collision was invisible.

The `/models` endpoint is also auth-tolerant in ways chat completions are not (the Anthropic endpoint tolerated the whitespace; the list endpoint may similarly be more permissive). A list-endpoint probe is a necessary-but-insufficient check: it catches network/DNS/expired-key failures, not credential-format or routing failures.

## What shipped

### `scripts/probe-models.sh` — live model probe

Sends a real `pi --model <ref> --print "Reply with exactly: pong"` for each model in `settings.json` `enabledModels` (or explicit args), with a per-model timeout. Reports pass/fail/timeout with the first error line.

This exercises the **real runtime path**: `auth.json` credential precedence, per-model `baseUrl`, API mapping, and compat flags. It catches the failure classes `pi-check` cannot:
- stale / whitespace-corrupted stored credentials
- `baseUrl`/`api` collisions between built-in and overridden models
- per-model auth-header requirements (Bearer vs `x-api-key`)

Wired into the justfile as `just probe [model refs…]`.

**Current probe output (post Fix #2, pre Fix #1):**
```
✗ zai/glm-5.2              FAIL — 429: Usage limit reached for 5 hour
✓ opencode/minimax-m2.7    pong
✓ openrouter/deepseek/deepseek-v4-pro   pong
✓ openrouter/qwen/qwen3.6-plus          pong
✓ openrouter/inception/mercury-2        pong
```
The `zai/glm-5.2` 429 is the **first problematic provider** (Decision 016 documents Z.ai-direct variability; the probe now surfaces it automatically instead of discovering it mid-task).

### `models.json` — MiniMax-M3 override

Added `MiniMax-M3` to `minimax.models[]` (OpenAI `/v1`, 512K context, image input). Overrides the built-in anthropic-endpoint variant. Updated `_squadron_note`.

## Verification matrix

| Path | Before | After Fix #2 | After Fix #1 (expected) |
|---|---|---|---|
| `minimax/MiniMax-M2.7` | 401 | 401 | ✅ 200 |
| `minimax/MiniMax-M3` | 404 | 401 | ✅ 200 |
| `minimax/MiniMax-M2.7-highspeed` | 404 | 404 (built-in, not overridden, not enabled) | 404 — documented, not in picker |
| `opencode/minimax-m2.7` | ✅ | ✅ | ✅ |
| `opencode/minimax-m3` | ✅ | ✅ | ✅ |

The `opencode/minimax-*` path works throughout — it uses the OpenCode Zen gateway with its own valid stored `sk-Ppk…` key, independent of the direct MiniMax credential. It is the zero-config workaround while Fix #1 is pending.

## Left

1. **Operator: run the `jq .strip` command** to fix `auth.json` — unblocks all
   `minimax/*` calls.

2. **Adopt `just probe` as a pre-task gate** (or at least after provider/model
   config changes). The cost is one minimal completion per enabled model
   (~$0.001); the value is catching this class of failure before it blocks real
   work.

3. Consider whether `pi-check` should be extended to read `auth.json` and do a
   chat-completion probe — or whether `probe-models.sh` subsumes it. The two are
   complementary for now: `pi-check` is fast and catches network/DNS;
   `probe-models.sh` is slower and catches the rest.
