---
title: Brief — Model registry probe sweep after the 2026-10-05 slim-down
date: 2026-10-05
status: complete (items 2/4/5 resolved; items 1/3 remain operator- and field-gated)
protocol: Edinburgh Protocol v1.1.0
---

# Brief: Model registry probe sweep (post slim-down)

**Created:** 2026-10-05
**TD:** td-57779b
**Status:** complete for what can be settled at the desk — 2 items closed,
2 remain gated on an operator action and on field use.
**Origin:** commit `84bf1db` demoted `~/.pi/agent/models.json` to a
credential+tweak layer and set the default to DeepSeek-direct
`deepseek-flash`. It left five follow-ups. This brief carries the live probe
evidence that closes or re-scopes them.
**Evidence:** `scripts/probe-models.sh` runs (2026-10-05), raw
`pi --model … --print` reproductions, `pi --list-models`, the model catalog
(`~/.pi/agent/models-store.json`), and a thinking-level cost experiment.

## The instrument was lying (fixed first)

Item 4 asked for a local-endpoint probe "on next start". The probe could not
have answered it: `probe_one` ended both branches with `|| true`, then read
`rc=$?`. The exit status was therefore always 0, and the pass predicate was a
substring blacklist (`401`/`404`/`429`). Every failure that is not one of those
three strings — `Connection error.`, HTTP `507`, any other 5xx — reported
**pass**.

The effect was concrete: a dead server (`apfel`, `llama`) and an
out-of-memory model (`omlx`) all came back `✓`.

- **Fix:** read the exit code from the command itself (`|| rc=$?`), and treat
  `rc` as the source of truth. `pi --print` exits 0 on success and non-zero on
  transport/API errors (verified: 1 for connection refused, HTTP 429, HTTP
  507); `gtimeout` returns 124. stdout is retained for the first
  diagnosable line.

- **Second bug found while in there:** the run section looped over `MODELS`
  twice — once to render, once to count — so every model fired **two** chat
  completions per probe. Results are now collected once, then rendered.

Verification — same refs, before and after:

| Ref | Before | After |
|---|---|---|
| `ollama/gemma4:e4b` | ✓ pass | ✓ pass |
| `apfel/apple-foundationmodel` | ✓ pass (wrong) | ✗ FAIL — Connection error. |
| `llama/Gemma-4-E4B-It` | ✓ pass (wrong) | ✗ FAIL — Connection error. |
| `zai/glm-5.2` | ✗ FAIL — 429 | ✗ FAIL — 429 (unchanged) |
| `omlx/Qwen3-14B-4bit` | ✓ pass (wrong) | ✗ FAIL — 507 (memory ceiling) |

`--json` mode emits valid JSON and probes once per model (checked).

## Probe matrix — 2026-10-05

`scripts/probe-models.sh --timeout 180` (60s for locals):

| Ref | Result | Note |
|---|---|---|
| `ollama/gemma4:e4b` | ✓ pong | local server up (11434) |
| `omlx/Qwen3-14B-4bit` | ✗ 507 | server up (8000); model 8.12 GB won't fit under a 6.1 GB reclaimable ceiling |
| `apfel/apple-foundationmodel` | ✗ conn refused | server not running (11435) |
| `llama/Gemma-4-E4B-It` | ✗ conn refused | server not running (1234) |
| `zai/glm-5.2` | ✗ 429 | *Insufficient balance or no resource package* |
| `nvidia/nemotron-3-super-120b-a12b` | ✓ pong | free tier |
| `nvidia/nemotron-3.5-lightning-30b-a3b` | ✓ pong | returned `agricoles`, not `pong` — connectivity, not instruction-following, is the probe's subject |
| `nvidia/moonshotai/kimi-k3` | ✓ pong | **empty-response issue resolved** |
| `nvidia/z-ai/glm-5.3` | ✓ pong | free GLM route while `zai` is dark |
| `nvidia/deepseek-ai/deepseek-v4.1-flash` | ⏱ >180s | still unresponsive on the free tier |

## Item-by-item disposition

1. **zai 429** — still `Insufficient balance or no resource package`
   (unchanged from the 2026-07-28 brief, which saw a "usage limit reached"
   429). Not a config fault; blocked on an account recharge. **Workaround
   surfaced:** `nvidia/z-ai/glm-5.3` is live on the NIM free tier, so GLM
   capability is not entirely gated behind the Z.ai balance.

2. **nvidia NIM ids** — **decision: leave to the catalog.** The catalog
   supplies the list; `models.json` holds only the credential, so there is
   nothing hand-maintained left to prune. The two ids in question are both in
   the catalog and were re-probed: `moonshotai/kimi-k3` now works (the earlier
   "empty response" was free-tier availability, and it has recovered), while
   `deepseek-ai/deepseek-v4.1-flash` does not answer in 180 s. That is a
   free-tier latency fact, not a config defect — pruning it would be pruning a
   catalog entry that may recover exactly as kimi-k3 did.

3. **Default-model review** — **defer.** The slim-down landed today; there is
   no period of field use to review yet. The existing primed-5/5 vs
   unprimed-4/5 analysis stands. Revisit after real use, as the item says.

4. **Local endpoints** — **probed** (matrix above). Two of four are down
   servers, not config faults: `apfel` (11435) and `llama` (1234) are simply
   not running. `omlx` (8000) is up and answering — the 507 is the server's
   own memory guard refusing to load a 14B model under current RAM pressure.
   None of this implicates `models.json`.

5. **`defaultThinkingLevel: high`** — **confirmed appropriate; keep.** The
   catalog entry for `deepseek-flash` has `reasoning: true` and
   `thinkingLevelMap { low: "low", high: "high", max: "max" }`, with `medium`
   mapped to `null` (unsupported). Pi's stock default is `medium`, so an
   explicit level is *required* here — `high` is not an over-reach, it is the
   sane supported choice. Measured on a reasoning-required prompt (seatings
   puzzle), same model, `--no-tools`:

   | Level | reasoning tok | output tok | cost |
   |---|---|---|---|
   | off | 0 | 908 | $0.00178 |
   | low | 938 | 1600 | $0.00197 |
   | high | 1407 | 1979 | $0.00243 |
   | max | 3091 | 3406 | $0.00414 |

   Read: the thinking budget scales monotonically, and on a *trivial* prompt
   reasoning is 0 at every level — so `high` costs nothing on the easy turns
   and buys real depth on the hard ones. The absolute per-turn cost (~$0.002)
   is noise. `off` is the one level to avoid for the partner-agent role: it
   removes the grounding reflex the Protocol leans on, which is exactly the
   aptitude `deepseek-flash` is weakest at unprimed. `low` is the thrift
   lever if volume ever bites; `/thinking` is per-session.

## What changed

| File | Change |
|---|---|
| `scripts/probe-models.sh` | verdicts from exit code (was `|| true`-masked); one probe per model (was two) |
| `~/.pi/agent/models.json` → `models/live-config.json` | probe results recorded as `_note` on `zai` and `nvidia` |
| `docs/register.jsonl`, `MANIFEST.md` | regenerated |

**Incidental repair.** `84bf1db` regenerated `docs/provider-registry.md`
(6685 → 8776 bytes) but did not regenerate the registers, so the hygiene gate
(`just check`) was **red at HEAD**: the register still carried the old sha
`a90bff9fb3bd`/6685 for a file whose actual sha is `423e5fd1eeed`/8776. Running
`just registers` as part of this work repaired it. The slim-down commit's own
verification step was skipped — the same class of miss the gate exists to
catch.

## Left

1. **Operator:** recharge Z.ai (or accept the NIM `glm-5.3` free route as the
   GLM path) — then confirm `zai/glm-5.2`.

2. **Operator:** start `apfel` (11435) and `llama` (1234) if their models are
   still wanted; the probe is ready for them.

3. **Field:** revisit the `deepseek-flash` default after real use (item 3).

4. **Hygiene:** adopt `just probe` after any provider/model config change —
   the bug above is exactly why the probe had been silently reassuring.
