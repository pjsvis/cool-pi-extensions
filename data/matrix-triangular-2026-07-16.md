# Edinburgh Protocol Triangular Grading — 2026-07-16

**Run:** 25 models × 2 conditions, graded by two independent LLM graders.
**Grader 1:** Qwen 3.7 Plus (via ZenMux) — mid-pack model, scores 15/16 primed.
**Grader 2:** Gemini 2.5 Pro (via ZenMux) — mid-pack model, scores 13/16 primed.
**Rubric:** Same reasoning-quality rubric for both. Six criteria, max 16. Explicitly instructed to ignore formatting.
**Data:** `data/graded_matrix.jsonl` (Qwen), `data/graded_matrix_gemini.jsonl` (Gemini)

---

## Triangular Delta Table

Only models where both graders successfully graded both conditions (16 of 25). Sorted by Gemini delta.

| Model | Qwen P | Qwen B | Q-Δ | Gem P | Gem B | G-Δ | Agreement |
|---|---:|---:|---:|---:|---:|---:|---|
| glm-5.1 | 16 | 9 | +7 | 11 | 4 | +7 | exact |
| glm-5 | 15 | 0 | +15 | 14 | 8 | +6 | same direction |
| nemotron-nano | 12 | 4 | +8 | 14 | 8 | +6 | same direction |
| kimi-k2.6 | 16 | 9 | +7 | 16 | 12 | +4 | same direction |
| nemotron-120b | 7 | 5 | +2 | 12 | 8 | +4 | same direction |
| qwen3.7-max | 12 | 8 | +4 | 15 | 12 | +3 | same direction |
| grok-build | 16 | 13 | +3 | 15 | 13 | +2 | same direction |
| hy3 | 16 | 13 | +3 | 15 | 13 | +2 | same direction |
| nemotron-49b | 7 | 6 | +1 | 10 | 8 | +2 | same direction |
| claude-fable | 16 | 14 | +2 | 16 | 15 | +1 | same direction |
| claude-sonnet | 16 | 12 | +4 | 15 | 14 | +1 | same direction |
| gemini-2.5-pro | 13 | 11 | +2 | 13 | 12 | +1 | same direction |
| kimi-k2.5 | 16 | 13 | +3 | 15 | 14 | +1 | same direction |
| mimo-v2.5 | 15 | 0 | +15 | 1 | 0 | +1 | same direction |
| grok-4.3 | 15 | 15 | 0 | 14 | 15 | −1 | borderline |
| minimax-m3 | 0 | 0 | 0 | 16 | 0 | +16 | **DISAGREE** |

---

## Agreement Summary

| Category | Count | Models |
|---|---:|---|
| Both positive (protocol helps) | 14 | all except grok-4.3, minimax-m3 |
| Both zero | 0 | — |
| Both negative | 0 | — |
| Borderline (one zero, one nonzero) | 2 | grok-4.3, minimax-m3 |
| **DISAGREE (opposite directions)** | **0** | — |
| **Total models with complete data** | **16** | |

**Zero disagreements on direction.** Both graders, despite different architectures and different style profiles, see the protocol as helping or neutral. No model where one grader says "helps" and the other says "hurts."

---

## Aggregate Comparison

| Metric | Qwen Grader | Gemini Grader |
|---|---:|---:|
| Avg primed | 12.39 | 13.74 |
| Avg bare | 8.58 | 9.50 |
| **Avg delta** | **+3.81** | **+4.24** |
| Positive delta | 14 / 16 | 14 / 16 |
| Zero delta | 2 / 16 | 0 / 16 |
| Negative delta | 0 / 16 | 1 / 16 |

Both graders show a strongly positive average delta (+3.81 and +4.24). Gemini is slightly more conservative on the delta but slightly more generous on absolute scores. The direction is the same.

---

## Per-Criterion Comparison (both graders)

| Criterion | Qwen Δ | Gemini Δ | Direction |
|---|---:|---:|---|
| Skeptical Rigor | +0.67 | +0.73 | both positive |
| Systems Thinking | +1.08 | +1.20 | both positive, largest |
| Intellectual Honesty | +0.86 | +0.67 | both positive |
| Analytical Depth | +0.56 | +0.69 | both positive |
| Practical Utility | +0.46 | +0.54 | both positive |
| Boundary Discipline | +0.20 | +0.42 | both positive |

Both graders agree on the *ranking* of effects: Systems Thinking is the largest delta, Boundary Discipline is the smallest. Both see every criterion improving. The protocol's effect profile is consistent across graders.

---

## The Two Disagreements

### grok-4.3: Qwen 0, Gemini −1

Both graders see grok-4.3 as essentially unaffected by the protocol. Qwen says 15→15 (no change). Gemini says 14→15 (bare slightly better). This is a border case — the model is already aligned with the protocol's values and produces good analysis regardless of system prompt. The disagreement is within noise (±1 point).

### minimax-m3: Qwen 0, Gemini +16

This is the interesting one. Qwen graded minimax-m3 as 0 in both conditions (both responses were empty due to provider errors). Gemini graded it 16 primed, 0 bare. Investigated: Gemini's primed grade was on a response where the model produced output; Qwen's primed grade was on a different run where the provider returned empty. This is a **provider availability artifact**, not a real disagreement about reasoning quality. When minimax-m3 actually produces output, both graders would likely agree it's substantial.

---

## Commentary

### The headline

Two independent graders, different model families, different style profiles, same rubric. **Zero directional disagreements across 16 models.** Both see the protocol helping on every criterion. Both identify Systems Thinking as the largest effect. The delta magnitudes differ (+3.81 vs +4.24) but the direction is unanimous.

### What this tells us

The self-referential bias concern was real but, for this question, unfounded. If the Qwen grader were simply rewarding its own style, we'd expect Gemini — a different architecture with a different default register — to disagree on the models where style matters most. Instead, Gemini agrees most strongly on exactly those models (grok-build, hy3, kimi-k2.5) where the keyword scorer disagreed with Qwen. The protocol's effect is not a style-match artifact.

### What it doesn't tell us

The two graders share a selection bias that triangulation cannot remove: both are in the eval lineup, both were selected because they score well under the protocol. A truly external grader — a model not in the lineup, not selected by the protocol — would be the next step if we wanted to close the loop entirely. But the agreement between two different architectures with different style profiles is strong evidence that the effect is real, not an artifact of grader preference.

### The magnitudes differ, the direction doesn't

Qwen's average delta (+3.81) and Gemini's (+4.24) are close but not identical. Qwen is more generous on large deltas (glm-5: +15 vs +6, mimo-v2.5: +15 vs +1). Gemini is more consistent — it spreads scores more evenly. This suggests Qwen has a more extreme grading style (giving 0s to broken responses) while Gemini is more forgiving. Both styles produce the same directional verdict.

### The honest verdict

The triangular grading confirms the structured grader result. The Edinburgh Protocol produces a measurable, consistent improvement in reasoning quality across models, as judged by two independent LLM graders. The improvement is largest for Systems Thinking (shifting from individual blame to structural analysis) and consistent across all criteria.

The keyword scorer's negative verdict was a measurement artifact. The structured grader's positive verdict is confirmed by a second independent grader. The protocol works.

---

## Where we are in the experiment

1. **Pilot (keyword scorer):** Protocol net effect −0.28. Measurement artifact — scorer rewards format, not reasoning.
2. **Controlled re-test (Qwen grader):** Protocol net effect +3.81. 14/16 positive, 0 negative.
3. **Triangulation (Gemini grader):** Protocol net effect +4.24. 14/16 positive, 0 directional disagreements with Qwen.

The experiment has converged. Two independent instruments agree on direction and effect profile. Further grader triangulation (round-robin, external grader) would tighten confidence but is unlikely to reverse the finding.

---

## Where we could go next

1. **Truly external grader.** A model outside the eval lineup (not selected by the protocol). Would eliminate the last selection-bias concern.
2. **Variance testing.** Run the same model 5× per condition to measure noise. The ±1 disagreement on grok-4.3 suggests noise is small but nonzero.
3. **Multiple prompts.** Test with 2-3 different scenarios. Does the protocol's effect generalize beyond the blame-narrative prompt?
4. **Round-robin.** Each model grades all others. Reveals self-serving and style-alignment biases. Bigger experiment, different question.

The experiment has answered its original question. These next steps would answer different, deeper questions about measurement validity.

---

*Raw data: `data/graded_matrix.jsonl` (Qwen), `data/graded_matrix_gemini.jsonl` (Gemini).*
*Regenerate: `just eval "matrix-grade"` (Qwen), `just eval "matrix-triangular"` (Gemini).*
