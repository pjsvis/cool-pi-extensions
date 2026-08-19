---
title: Brief — pi-eval Streaming-Liveness Timeout (B2 primary, B1 fallback)
date: 2026-08-03
status: implemented 2026-08-03 — B2 streaming-liveness shipped + verified (Ollama NDJSON + OpenAI-compat SSE); B1 fallback flagged; flag-don't-reject default
protocol: Edinburgh Protocol v1.1.0
---

# Brief: pi-eval Streaming-Liveness Timeout (B2 primary, B1 fallback)

**Created:** 2026-08-03 · **Updated:** 2026-08-03 (post streaming-probe)
**TD:** td-d32fd1
**Status:** implemented — B2 (streaming + liveness) shipped + verified end-to-end; B1 (bracketed wall-clock) fallback flagged; flag-don't-reject on no-streaming.
**Origin:** The `gemma4:e4b` eval exposed a timeout dial that conflates three distinct failure modes. At 60 s, EDI-005 returned `pass=false, gradingStatus=skipped` (0 chars) — a *false negative*: the substrate was slow, not misbehaving. At 600 s it completed (8138 chars) and the grader returned a real **graded fail**. A single wall-clock timeout manufactured a result that *looked* like a fail but carried no behavioural information. Meanwhile EDI-002 returned `pass=false` for an unrelated reason — the Ollama route can't execute tools at all (a *capability* gap, not a time gap) — since fixed by **A** (`td-f35c25`, `verdict:"n/a"`).
**Evidence:** `src/cli/pi-eval/lib/providers.ts` (`callOllamaWithRetry`, `callModelWithTools`), `data/eval_log.json` (gemma4:e4b runs 2026-08-03), `data/eval-e4b.md`, **Ollama streaming probe 2026-08-03** (below)

## What

A capability-driven per-test timeout: **streaming + liveness (B2)** when the route supports it (default), **bracketed wall-clock (B1)** as fallback, capturing the substrate's own decode/prefill telemetry into the result. **Flag — don't silently reject — substrates that can't stream.** Method selection keys off an extended `routeCapabilities` map (builds on A).

## Why — three failure modes, one dial

Three things surface as an inconclusive or false-negative result today. **A** removed the third from the timeout's burden; this redesign handles the first two:

1. **Throughput false-negative** — substrate is slow but correct. *(EDI-005 at
   60 s.)*

2. **Behavioural stall** — model loops or yaps forever, *itself* a muppet
   signal. Here a *tight* ceiling is the feature.

3. ~~**Capability mismatch**~~ — *resolved by A:* marked `verdict:"n/a"`.

#1 and #2 pull the timeout in **opposite directions** (widen vs tighten). A single static budget can't serve both. The redesign separates them — and streaming is what makes that separation observable.

## Probe evidence (2026-08-03) — B2 is not just viable, it's rich

`curl /api/chat` with `stream:true` against the resident `gemma4:e4b` returns NDJSON frames; the **final frame carries telemetry**:

```
done: true | eval_count: 2 | eval_duration_ms: 37.5     ← decode tok/s, per call
     prompt_eval_count | prompt_eval_duration           ← prefill cost, separated
     load_duration | total_duration                     ← full timing breakdown
```

Three consequences:

1. **Liveness is observable mid-generation** — tokens arriving = alive; a token
   gap of N s = stuck → fail-fast on stalls, the core B2 motivation.

2. **Substrate characterisation arrives in-band** — the original "characterise
   the substrate first" prerequisite (see Non-goals) *evaporates*. Every call
   self-reports its decode tok/s and prefill cost.

3. **Single prefill** — streaming is one continuous call, so no retry re-prefill
   tax.

Every provider in the current config (Ollama, OpenRouter, ZenMux, Together, NIM, Moonshot, Qwen, DeepSeek, Z.ai) is OpenAI-compat or Ollama → **all stream**. The no-streaming case is rare; it is a safety rail, not a common path.

## Current behaviour (what changes)

`callOllamaWithRetry` (`providers.ts`) today:
- **3 retries, identical budget.** Worst case is **3× the budget**, not 1×.

- **`stream: false` — a deliberate choice**, not a substrate limit. Flipping it
  is the core of B2.

- **Stateless per call.** Each retry re-prefills the entire prompt.

- **Wall time includes the grader** (`turnDurationMs` spans model call +
  OpenRouter grader round-trip).

## Capability map extension (builds on A)

A added `routeCapabilities(model): { tools }`. **Extend to `{ tools, streaming }`.** The timeout-method selector keys off capabilities:

- `streaming` → **B2** path
- `!streaming` → **B1** path (flagged)

Streaming is true for `/`-slug OpenRouter routes and bare-slug Ollama (both stream); a future non-streaming provider declares false. This keeps method selection capability-driven and consistent with A's design.

## Options

### B2 — streaming + liveness (PRIMARY)
Stream the call; abort on a **token-gap** (no new token for N s) or repetition window, independent of wall clock; keep a generous wall-clock ceiling as a backstop. **Capture the final-frame telemetry** (`eval_count`, `eval_duration`, `prompt_eval_*`) into `TrajectoryInfo` (tok/s, prefill ms) — persisted substrate characterisation.
- **Wins:** true fail-fast on stalls; single prefill; tok/s telemetry persisted;
  substrate self-characterises; the #1-vs-#2 tension resolves (slow-correct
  streams steadily, stuck emits nothing).

- **Cost:** rewrite the Ollama call to streaming NDJSON parse; add
  token-gap/repetition detection; apply the same to the OpenRouter path (SSE)
  for consistency; re-plumb `callModel`'s return to carry timing/liveness.

### B1 — bracketed wall-clock (FALLBACK, flagged)
Escalating budgets (e.g. 60 → 240 → 600 s) → definitive timeout on the third fail. **Only when streaming is unavailable.**
- **Wins:** bounds worst-case (the **sum** of brackets, not 3× max); escalates
  to a graded verdict instead of an inconclusive abort.

- **Doesn't deliver:** stall-vs-slow discrimination — which is exactly why it is
  the *fallback*, not the primary.

- **Flag:** results via B1 carry `timeoutMethod: "wallclock-bracketed"` + a
  confidence caveat (liveness unavailable, stall-detection degraded).

## Tiered policy (flag, don't reject — by default)

- `streaming` available → **B2**

- no streaming → **B1 fallback + method/confidence flag** (preserve the verdict;
  be honest about degraded stall-detection)

- hard **reject on no-streaming** → **OFF by default**; a one-line policy toggle
  if the operator decides streaming is a hard admission criterion (parallel to
  the muppet-gate)

**Why flag, not reject:** rejection throws away coverage and signal, and the eval's purpose is to produce verdicts. A flagged B1 result keeps the verdict while admitting the degradation. Hard-reject is defensible *only* as a deliberate policy trade.

**Nuance:** for *local* substrates (Ollama) where streaming is the norm, no-streaming indicates breakage → reject-reasonable. For *remote* APIs, non-streaming is a legitimate (if limiting) design → B1 fallback, flag, don't reject. "No streaming" means *observability-blind for this method*, not "worthless model" — don't conflate the two.

## Recommendation

1. Extend `routeCapabilities` → `{ tools, streaming }`.

2. Implement **B2** (streaming Ollama + OpenRouter): token-gap liveness,
   wall-clock backstop, capture final-frame telemetry into `TrajectoryInfo`.

3. Implement **B1** (bracketed wall-clock) as the `!streaming` fallback behind
   the same selector, flagged.

4. **Flag-don't-reject** default; reject behind a policy toggle.

Evidence-scaled budgets fall out for free: B2's token-gap threshold and B1's brackets derive from the observed tok/s the telemetry now provides — no separate characterisation step.

## Non-goals

- The grader's own timeout (OpenRouter round-trip) — separate failure mode,
  separate dial.

- Per-trap output-length prediction (adaptive budgets per trap class) — later
  refinement; start with a schedule derived from observed tok/s.

- Changing the retry *count* — the bracket schedule changes per-attempt budget,
  not necessarily attempt count.

## Open questions

- Token-gap threshold (N s without a new token) — derive from observed
  inter-token latency (now directly measurable from
  `eval_duration`/`eval_count`), or fixed 15–30 s?

- Repetition / yap-loop detection — window size and threshold?

- `--timeout-brackets` configurable, or a fixed schedule derived from tok/s?

- reject-on-no-streaming policy toggle — env var or config field?

## Decision (resolved 2026-08-03)

**B2 primary, B1 fallback, flag-don't-reject.** Proceed to implement. (Prior recommendation of "B1 first, promote to B2 if batch" is superseded — the streaming probe made B2 the clear primary for every substrate in scope.)

---

## Implementation — shipped 2026-08-03

**Files:** `src/cli/pi-eval/lib/{types,providers,grading}.ts`, `src/cli/pi-eval/commands/run.ts`, `scripts/{phase1-verify-responses,grade-logged-responses}.ts`.

**Shipped:**
1. `routeCapabilities(model): { tools, streaming }` — `streaming` selects B2 vs
   B1. True for every provider in scope (OpenAI-compat `/`-slugs + bare Ollama);
   a future non-streaming provider declares false.

2. **B2 streaming, both substrates:** `streamOllamaChat` (NDJSON) +
   `streamOpenAICompat` (SSE). A single `livenessWatchdog` enforces two
   independent clocks — a **wall-clock backstop** (from call start, bounds
   load+prefill+decode; catches silent hangs) and a **token-gap liveness** check
   (armed on the *first received byte*, catches mid-generation stalls). Feeding
   on every chunk means slow-but-alive streams complete; stuck substrates fail
   fast. The load/prefill window before the first byte is protected from
   false-stalls (gap is unarmed until bytes flow) — covered by the wall-clock
   backstop only.

3. **Telemetry into `TrajectoryInfo`:** Ollama's final frame yields true
   `decodeTokens`/`decodeTokPerSec` (from
   `eval_duration`)/`prefillMs`/`decodeMs`; OpenAI-compat's `usage` yields
   `decodeTokens`/`promptTokens` (no `decodeTokPerSec` — providers don't report
   decode time, so it's omitted rather than approximated from wall-clock).
   Surfaced in the run line as `Ntok/s` and a `[B1]` marker for the degraded
   path.

4. **`callModel`/`callModelWithTools` re-plumbed** to return `ModelCallResult {
   text, toolCallCount?, telemetry?, timeoutMethod }`. All 6 consumers updated
   (run.ts ×2, grading.ts ×2, 2 scripts).

5. **B1 fallback** (`!streaming`): non-streaming primitives, flagged
   `timeoutMethod: "wallclock-bracketed"`. Escalating brackets deferred (open
   question; dormant — nothing hits B1 today).

6. **Flag-don't-reject default;** `EVAL_REJECT_NO_STREAMING=1` makes
   no-streaming a hard admission gate (model skipped).

7. **`DEFAULT_TIMEOUT_MS` 60s → 180s.** Necessary for B2 to deliver on the
   default path: the token-gap (stall detector) is now the *effective* tight
   ceiling, while the wall-clock backstop must be generous enough to let
   slow-but-alive models complete (the e4b 105s completion that false-negatived
   at 60s). Stalls still fail at the gap (default 60s) — faster than before for
   actual stalls.

**Verification (2026-08-03):**
- Typecheck clean across lib + commands + scripts.

- B2 Ollama (gemma4:e4b): `streaming-liveness`, real telemetry
  `decodeTokPerSec≈31, prefillMs≈182, decodeMs≈316`.

- B2 OpenAI-compat (nemotron-nano via OpenRouter): `streaming-liveness`,
  `decodeTokens=41, promptTokens=31`.

- Watchdog unit tests: (A) unarmed load window protected from false-stall,
  wall-clock backstop fires; (B) mid-stream stall detected after gap (armed on
  first byte); (C) steady stream trips neither clock.

**Open questions — resolved (v1) / deferred:**
- **Token-gap threshold:** fixed **60s** default (`EVAL_TOKEN_GAP_SEC`), not
  derived. 60s absorbs reasoning-model thinking pauses and typical cold loads; a
  hard stall gaps well inside it. Derivation from observed inter-token latency
  is a later refinement now that telemetry is persisted.

- **Repetition / yap-loop detection:** **deferred.** Token-gap catches *hard*
  stalls (nothing emitted); yap-loops keep flowing tokens and need a repetition
  detector — separate work. The wall-clock backstop is the only bound on
  yap-loops today.

- **`--timeout-brackets` configurable:** **deferred.** B1 is dormant (every
  provider streams); it ships as simple flagged non-streaming. The
  escalating-bracket schedule arrives when a real non-streaming provider needs
  it.

- **reject-on-no-streaming toggle:** `EVAL_REJECT_NO_STREAMING` env var (off by
  default). Matches the flag-don't-reject policy.

- **Streaming the OpenRouter tool loop:** **deferred.** The agentic multi-turn
  tool loop (`callOpenRouterWithTools`) stays wall-clock-bounded per iteration
  and is honestly flagged `wallclock-bracketed`. Streaming it is a follow-up;
  tool-required traps are already n/a on non-OpenRouter routes, so the blast
  radius is small.
