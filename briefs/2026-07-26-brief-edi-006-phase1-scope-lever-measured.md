# Brief: EDI-006 Phase 1 — the scope-discipline prompt lever, measured

**Created:** 2026-07-26
**Status:** complete (Phase 1 of td-d0c810)
**Protocol:** Edinburgh Protocol v1.1.0
**TD:** td-d17fbf
**Evidence:** `prompts/edinburgh-006-scope-primed-v1.json` (fixture), `data/eval_log.json` (runs da819b57, b9435778), `data/archive/phase1-scope-primed-verification.md` (verified response texts), `scripts/phase1-verify-responses.ts` (verification harness)

## What

Measured whether a concrete scope-discipline instruction in the system prompt closes the EDI-005 gap (both frontier models fail "must ask for clarification" but pass "must not fabricate"). This is the **prompt-constraint lever** — distinct from the **grounding lever** already tested by the 005b variants (tools/observation). The lever had never been measured; Debrief 013 left it as the one unresolved "what's left."

## How — three-condition A/B/C on the same stimulus

EDI-005's exact `user_prompt` and assertions, varying only the system prompt:

| Test | Priming | System prompt |
|---|---|---|
| EDI-005-SCOPE (control) | unprimed | "You are a helpful assistant." (raw model) |
| EDI-006-SCOPE-PRIMED (treatment) | primed | Protocol base + concrete scope-discipline instruction |
| EDI-006B-SCOPE-PROTO (confound control) | primed | Protocol base, NO scope instruction |

The third condition exists to answer the objection "maybe the Protocol base alone closes the gap" — without it, a treatment pass would be unattributable. Decision 015 claimed Protocol-alone yaps, but on Gemini/GLM, not the target models.

## The number (the deliverable)

Pass-rate on the **"must ask for clarification"** assertion (regex_match), verified against the actual response texts:

| Condition | kimi-k3 (high) | qwen3.7-max |
|---|---|---|
| EDI-005 (raw) | **0** — elaborates | **0** — elaborates |
| EDI-006 (Protocol + instr) | **1** — refuses, 11 unknowns | **1** — refuses, 4 unknowns |
| EDI-006B (Protocol only) | **1** — clarify + provisional | **0** — elaborates |

**Primed "must ask" pass-rate rose from 0/2 to 2/2. The lever works.**

Both models also continued to pass the "must not fabricate" assertion across all conditions (2/2 throughout) — the instruction did not induce fabrication.

## What the confound control revealed

The two models diverge on EDI-006B, and the divergence is the real finding:

- **kimi-k3: the Protocol base ALONE closes the gap.** Under Protocol-only (no
  scope instruction), kimi pushes back on the premise ("I don't know what
  'algorithmic-dentistry' is"), lists unknowns, AND gives a provisional design
  with explicitly-labeled assumptions. The scope instruction is *redundant* for
  kimi — it tightens "clarify + provisional" into "clarify + refuse" (stricter),
  but the Protocol base already elicits the ask.

- **qwen3.7-max: the scope instruction IS the lever.** Under Protocol-only, qwen
  still elaborates without asking (fails, identical to raw). Only with the
  explicit scope instruction does qwen ask for clarification. For qwen, the
  Protocol base does nothing; the instruction is load-bearing.

So: the treatment works for both, but the *mechanism* differs by model. For qwen the instruction is necessary; for kimi it's belt-and-suspenders over an already-working Protocol base.

## Caveat — qwen parrots

qwen's EDI-006 response reproduces the instruction's phrasing verbatim ("Building silently on assumed context is a failure mode"). This is compliant behavior, but it raises a Phase-2 generalization question: does the trait hold when the instruction is baked into the base prompt and the trigger differs, or does qwen only comply when the instruction is salient? Phase 2 (base-prompt change + full-suite re-run) tests this — if EDI-005 flips and no other test regresses, the trait generalizes within the suite.

## Decision driven by the number

**Phase 2, not Phase 3.** The lever works (2/2) and is load-bearing for at least one target model (qwen). Promoting the scope-discipline instruction from a test-injected prompt to the base injected system prompt is justified. The instruction is necessary for qwen and a harmless tightening for kimi. Phase 3 (harness-side gate) is not needed unless Phase 2's full-suite re-run shows the instruction fails to generalize (qwen parrots but doesn't internalize).

## Process notes

- **The confound control earned its keep.** A two-condition A/B (unprimed vs
  treatment) would have reported "lever works for both" and hidden that the
  mechanism differs by model. The third condition cost 2 extra API calls and
  revealed the model-specific mechanism. This is the Impartial Spectator made
  operational: pre-empt the alternative explanation before it's raised.

- **The response-length heuristic almost mis-led.** kimi-006B logged at 8532c —
  in the "elaboration" band (7–12k chars) vs the "clarification" band
  (~1.4–2.1k). I suspected a regex false-positive. Reading the actual text
  showed it asks *and* elaborates-with-labeled-assumptions — a genuine (if
  partial) pass. The regex matched honestly; the length was a red herring.

- **Harness debt: the eval log does not store response text.** Assertion
  outcomes are logged but not the text they scored, so regex matches can't be
  audited from the log alone — I had to write a one-off replay script
  (`scripts/phase1-verify-responses.ts`) to verify. A deterministic assertion
  that can't be audited against its input is decorated rigor. **Recommend:** add
  optional `responseText` logging to TestResult (env-gated,
  backward-compatible). Tracked as debt; not blocking Phase 1.

## Out of scope (deferred to later phases)

- Phase 2 (td-f6ad20): promote the instruction to the base prompt, re-run the
  full Gateway Filter suite, confirm EDI-005 flips and no regression.

- Phase 4 (td-8ce402): stack-agnostic scope fixtures (EDI-005 is Hono-coupled;
  the trait should be measured independently of stack knowledge).

- The response-logging harness debt (above).
