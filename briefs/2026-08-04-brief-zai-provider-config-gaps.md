---
title: Brief — z.ai (GLM) Provider Config: Transport-Sound, Control-Surface + Eval-Substrate Gaps
date: 2026-08-04
status: findings locked via live probe; fix directions specified; pending implementation decision
protocol: Edinburgh Protocol v1.1.0
---

# Brief: z.ai (GLM) Provider Config — Debugging Debrief + Fix Directions

**Created:** 2026-08-04
**Status:** findings locked by evidence (live HTTP probes + runtime probe); fix directions specified; pending the implementation decision.
**Origin:** Suspected z.ai config issues, used as a debugging-skills test case. The obvious hypothesis (baseUrl wrong) was **disproven** by evidence; the real issues are behavioural/structural, not connectivity.
**Evidence:** live HTTP probes against `api.z.ai` (coding + general endpoints), the Pi runtime probe (`pi --model zai/glm-5.2 --print`), `models/live-config.json`, `~/.pi/agent/models.json` (Decision 013 silo exception), `src/cli/pi-eval/lib/providers.ts`.

## The lesson learned (operator context)

z.ai (GLM) is **reliable through OpenCode** but, with z.ai set as the default route, it was **"intermittently intermittent."** This brief characterises *why* with evidence and separates the **transport** (sound) from the **control surface** (gapped). The leading hypothesis for the intermittency — stated to be verified, not asserted — is the **reasoning-budget burn** (Issue A): under a tight `max_tokens`, GLM sometimes empties out or runs long enough to trip a client timeout, and the coding-plan endpoint likely carries tighter rate limits than a general API key. OpenCode avoids both (large budgets, retry); a default client does not.

## The Humean move (method)

The instinct on "z.ai issues" is to assume the **baseUrl is wrong** — the obvious suspect, and a prior commit (`5ad42b5`, "zai baseUrl fix") implies it has been wrong before. That is the trap. The Edinburgh move is to **not assert without evidence**: probe *both* endpoints live and let the HTTP codes settle it.

They did — and the obvious hypothesis was **false**. The baseUrl is correct. The real issues only surfaced once the transport was proven good.

## Findings (each probe-verified)

| # | Claim | Evidence (2026-08-04 probe) |
|---|-------|------------------------------|
| ✅ | **baseUrl correct** (coding endpoint) | `…/api/coding/paas/v4/chat/completions` → **HTTP 200**; `…/api/paas/v4/…` (general) → **HTTP 429 "Insufficient balance or no resource package."** The key is coding-plan-only — reversing to general would 429. The prior "fix" was right for this key. |
| ✅ | **auth correct** | `Authorization: Bearer <key>` → 200; `pi --model zai/glm-5.2 --print "…pong"` → `pong` end-to-end. |
| ✅ | **`maxTokensField` correct** | `max_completion_tokens` honoured (200); `max_tokens` also accepted. |
| ⚠️ A | **glm-5.2 is a heavy reasoner** | "Reply with exactly: pong" burns **~100 reasoning tokens** by default. `max_tokens:60` → **`content:""`, `finish_reason:"length"`** (55/60 tokens were reasoning). |
| ⚠️ B | **reasoning-control field mismatch** | top-level **and** nested `reasoning_effort:"low"` → **~110 reasoning tokens, no reduction** (ignored). Only **`thinking:{type:"disabled"}`** → **0 reasoning tokens**, instant answer. Z.ai speaks `thinking`, not `reasoning_effort`. |
| ⚠️ C | **eval harness has no first-party z.ai route** | `providers.ts` has **zero** z.ai endpoint/key/chain entry (the only GLM ref is `nimSlug()`, a NIM slug remap). `z-ai/*` rides the OpenRouter/ZenMux relay. First-party routes exist for moonshot/dashscope/nim/together — **not** z.ai. |

Key: `skate get zai_api_key` is SET (49 chars). `zhipu_api_key` / `glm_api_key` empty.

## The three issues + fix directions

### Issue B — reasoning-control mismatch (SILENT FAILURE — highest priority)

Z.ai ignores OpenAI's `reasoning_effort` and speaks its own `thinking:{type:"enabled"|"disabled"}`. Any client sending the OpenAI convention gets a **HTTP 200 and zero effect** — the system reports success while the intent evaporates. This is **decorated rigour in wire form**: you believe you set `reasoning_effort:low`; the call succeeds; nothing changed. There is no compat lever in `models.json` to make Pi emit `thinking`, and the eval harness's `EVAL_REASONING_EFFORT` is silently dropped on this route. **Net: the operator currently cannot dial GLM reasoning down for cheap/fast calls — it runs at default (max) effort always.**

**Fix directions (scoped):**
- **In-repo, eval harness (`providers.ts`):** when the resolved provider is z.ai, emit `thinking:{type:…}` from an env var (e.g. `EVAL_ZAI_THINKING=enabled|disabled`) instead of `reasoning_effort`. Cheap, lets the eval characterise GLM with reasoning on *and* off.
- **In-repo, Pi runtime (preferred mechanism per AGENTS.md):** a z.ai **pi extension** (`pi.registerProvider()`) that owns the request transform — emits `thinking`, sets the coding baseUrl, resolves `skate zai_api_key`, maps the slug. This is the durable home for z.ai-specific wire quirks; it keeps `models.json` free of vendor duct-tape.
- **Out-of-silo (pi core):** a generic compat field (e.g. `reasoningControl: "thinking"`) read by `provider-composer.js`. Cleanest long-term but requires a core change — file as a note, don't block on it.

### Issue C — eval can't characterise the operator's actual substrate

We just shipped B2 first-party telemetry (true decode tok/s, prefill ms — `briefs/2026-08-03-brief-pi-eval-bracketed-timeout.md`). It **cannot reach z.ai**: GLM evals ride the OpenRouter relay, so the harness measures *OpenRouter's* GLM, not the operator's (coding-plan key, coding-endpoint rate limits, real throughput). This is inconsistent with the first-party-direct principle (brief 2026-07-28: route via the vendor so a reseller blip doesn't masquerade as a model fault) and with the moonshot/dashscope/nim/together routes that *do* exist.

**Fix direction (in-repo, `providers.ts`):** mirror the moonshot/dashscope pattern —
```ts
const ZAI_KEY  = process.env["ZAI_API_KEY"] || skate("zai_api_key");
const ZAI_URL  = "https://api.z.ai/api/coding/paas/v4/chat/completions";
// in the callModel chain, before the OpenRouter fallback:
if (model.includes("glm") || model.startsWith("z-ai/")) {
  chain.push({ p: "zai", m: bareSlug(model), k: ZAI_KEY, url: ZAI_URL });
}
```
Combined with Issue B's `thinking` emitter, this lets B2 telemetry characterise the operator's real z.ai substrate at chosen reasoning effort. Flag-don't-reject if the key is absent (fall through to OpenRouter) — preserves coverage.

### Issue A — reasoning budget burn (root cause, model-inherent — not a config bug)

~100 reasoning tokens to emit "pong"; tight budgets empty out. This is what makes **B** matter (you *want* to disable reasoning for cheap calls) and is the leading candidate for the "intermittently intermittent" lived experience. For the eval (`max_tokens:16384`) it will not empty-out, but it is a latent cost/latency tax on every call.

**Fix direction:** none at config level (it is the model). Dissolves once Issue B lands — reasoning can be disabled when the task doesn't need it.

## Recommendation

1. **B first** (silent failure is the most Edinburgh-hostile mode — worse than an error). Short-term: the eval-harness `thinking` emitter. Medium-term: the z.ai pi extension (durable, keeps `models.json` clean).
2. **C next** (unlocks the B2 telemetry we just built against the real substrate; closes the first-party-direct inconsistency).
3. **A** mostly dissolves once B lands.
4. **Verify the intermittency hypothesis** before closing: probe the coding endpoint under load for rate-limit headers (`X-RateLimit-*`, 429 cadence), and confirm whether a default-small-`max_tokens` client is the empty-content victim.

## Non-goals

- The grader's own z.ai behaviour (separate concern; grader routes via its own model).
- OpenCode's z.ai path (reliable by report; out of scope — this brief is the Pi/eval config).
- Changing the coding-plan key to a general-API key (would 429 — the key is coding-only).

## Open questions

- Does z.ai honour `reasoning_effort` on the **general** `/paas/v4` endpoint (vs coding)? Untested — the key 429s there. If a general key is ever provisioned, re-probe.
- Rate-limit shape of the coding endpoint (requests/min, tokens/min) — needed to confirm/deny the intermittency hypothesis.
- Should the z.ai pi extension also own the `glm-*` → bare-slug mapping and the `max_completion_tokens` compat, retiring the `nimSlug()` GLM branch?
