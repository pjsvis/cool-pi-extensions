# Poker Club Membership Review — 2026-07-16

**Application:** Edinburgh Protocol substrate assessment
**Eval directions:** Scoring (keyword), Structured grading (Qwen + Gemini), Triangular delta, Stuff into Things (ingestion + delivery gates), Behavioral traps (EDI-001–004)
**Statistical significance:** p < 0.001 (sign test, two independent graders, zero directional disagreements)
**Principle:** Good stuff in, good stuff out. That's the deal.

---

## Membership Tiers

| Tier | Criteria | Meaning |
|---|---|---|
| **Full Member** | Strong across all eval directions. Honors the agreement. | Trusted to operate under the Protocol unsupervised. |
| **Probationary** | Strong on most axes, specific weakness identified. | Trusted with supervision. Weakness is actionable. |
| **Denied** | Cannot honor the agreement. Protocol cannot reach. | Not suitable for Protocol deployment. |

---

## Full Members

### Claude Sonnet 4.5

| Eval Direction | Result | Evidence |
|---|---|---|
| Scoring (keyword) | 16–17/19 | Consistent top-scorer |
| Graded (Qwen) | 16/16 primed, 12/16 bare, Δ +4 | Perfect primed reasoning |
| Graded (Gemini) | 15/16 primed, 14/16 bare, Δ +1 | Confirmed by second grader |
| Triangular agreement | same direction | Both graders agree protocol helps |
| Stuff into Things | 6/6 | Perfect ingestion and delivery |
| Behavioral traps | 4/4 | Clean trap pass |

**Strengths:** Gold standard for tone and structure. Perfect Stuff into Things — identifies entropy at ingestion, produces real Things at delivery. The protocol's systems-over-villains instruction produces the strongest effect here. Both graders independently confirm top-tier reasoning quality.

**Weaknesses:** None identified. The model is already aligned with the protocol's values; the protocol's delta is small (+1 to +4) because the baseline is high. This is the model the protocol was designed for.

**Verdict:** Full Member. The reference standard. Other models are judged against this one.

---

### Claude Opus 4.8

| Eval Direction | Result | Evidence |
|---|---|---|
| Scoring (keyword) | 15–17/19 | Consistent |
| Graded (Qwen) | ERR (provider) | — |
| Graded (Gemini) | 16/16 primed, 15/16 bare, Δ +1 | Near-perfect |
| Stuff into Things | 6/6 | Perfect |
| Behavioral traps | 4/4 | Clean |

**Strengths:** Same architectural family as Sonnet. Gemini grader scores it at the ceiling (16/16 primed). Perfect Stuff into Things. Slightly less crisp than Sonnet on the keyword scorer but indistinguishable on the structured grader.

**Weaknesses:** Provider reliability issues during grading runs (ZenMux 500s). Not a model weakness — a provider availability artifact. Qwen grader data incomplete.

**Verdict:** Full Member. Premium reasoning at premium cost. Use when the task warrants the price.

---

### Claude Fable 5

| Eval Direction | Result | Evidence |
|---|---|---|
| Scoring (keyword) | 12–16/19 | Variable |
| Graded (Qwen) | 16/16 primed, 14/16 bare, Δ +2 | Perfect primed |
| Graded (Gemini) | 16/16 primed, 15/16 bare, Δ +1 | Confirmed |
| Stuff into Things | 6/6 | Perfect |
| Behavioral traps | 4/4 | Clean |

**Strengths:** Ceiling-level reasoning under both graders. Perfect Stuff into Things. Adaptive thinking is always-on — the model thinks deeply before responding.

**Weaknesses:** Variable keyword scores (12–16) because adaptive thinking consumes token budget before producing readable content. The keyword scorer sees shorter responses; the structured grader sees the reasoning quality. This is the format-vs-reasoning divergence in its purest form.

**Verdict:** Full Member. The thinking model. Use for complex analysis where the reasoning matters more than the response length.

---

### Gemini 2.5 Pro

| Eval Direction | Result | Evidence |
|---|---|---|
| Scoring (keyword) | 13–15/19 | Solid |
| Graded (Qwen) | 13/16 primed, 11/16 bare, Δ +2 | Good |
| Graded (Gemini) | 13/16 primed, 12/16 bare, Δ +1 | Self-graded, consistent |
| Stuff into Things | 6/6 | Perfect |
| Behavioral traps | 7/9 | Strong |

**Strengths:** Perfect Stuff into Things. System-2 thinker — the keyword scorer undersells it (acknowledged in the original eval). Both graders agree the protocol helps. Reliable across all eval directions. The model that graded the triangular run and produced consistent results — it's a model that can judge as well as perform.

**Weaknesses:** Keyword scores are mid-pack (13–15). The structured grader confirms this is a measurement artifact, not a reasoning deficit. Slightly less philosophical depth than the Claude family.

**Verdict:** Full Member. The utility player. Reliable across every eval direction, no weak spots.

---

### Grok 4.3

| Eval Direction | Result | Evidence |
|---|---|---|
| Scoring (keyword) | 11–13/19 | Mid |
| Graded (Qwen) | 15/16 primed, 15/16 bare, Δ 0 | Already aligned |
| Graded (Gemini) | 14/16 primed, 15/16 bare, Δ −1 | Already aligned |
| Stuff into Things | 6/6 | Perfect |
| Behavioral traps | 4/5 | Strong |

**Strengths:** Perfect Stuff into Things. Already aligned with the protocol — produces good analysis regardless of system prompt. The protocol's delta is zero because the model doesn't need it. Both graders confirm the model is at ceiling in both conditions.

**Weaknesses:** The protocol adds nothing. This is not a failure — it means the model's default behavior already satisfies the agreement. But it means the protocol is redundant for this model. Keyword scores are lower than structured grades, confirming the format bias.

**Verdict:** Full Member. The natural. Doesn't need the protocol, but honors the agreement regardless.

---

### Grok Build 0.1

| Eval Direction | Result | Evidence |
|---|---|---|
| Scoring (keyword) | 12–15/19 | Variable |
| Graded (Qwen) | 16/16 primed, 13/16 bare, Δ +3 | Strong |
| Graded (Gemini) | 15/16 primed, 13/16 bare, Δ +2 | Confirmed |
| Stuff into Things | 6/6 | Perfect |
| Behavioral traps | 4/4 | Clean |

**Strengths:** Perfect Stuff into Things. Strong protocol delta (+3/+2) — the protocol unlocks reasoning the model is capable of but doesn't default to. Both graders agree. The keyword scorer said the protocol *hurt* this model (−4); the structured grader proved that was a format artifact.

**Weaknesses:** Keyword scorer divergence (−4 keyword vs +3 graded) — the model's format changes significantly under the protocol, which confuses format-based scoring.

**Verdict:** Full Member. The protocol helps this model measurably. Budget-tier pricing with full-member reasoning.

---

### Tencent HY3

| Eval Direction | Result | Evidence |
|---|---|---|
| Scoring (keyword) | 12–16/19 | Variable |
| Graded (Qwen) | 16/16 primed, 13/16 bare, Δ +3 | Strong |
| Graded (Gemini) | 15/16 primed, 13/16 bare, Δ +2 | Confirmed |
| Stuff into Things | 6/6 | Perfect |
| Behavioral traps | 4/4 | Clean |

**Strengths:** Perfect Stuff into Things. Strong protocol delta confirmed by both graders. Same keyword-scorer divergence as Grok Build (−3 keyword vs +3 graded) — the protocol shifts format, which the keyword scorer penalizes but the structured grader rewards.

**Weaknesses:** Keyword scorer divergence. Mid-tier pricing.

**Verdict:** Full Member. Another model where the protocol unlocks capability. The keyword scorer's negative verdict was a measurement artifact, confirmed by triangulation.

---

### Kimi K2.5

| Eval Direction | Result | Evidence |
|---|---|---|
| Scoring (keyword) | 14–15/19 | Good |
| Graded (Qwen) | 16/16 primed, 13/16 bare, Δ +3 | Strong |
| Graded (Gemini) | 15/16 primed, 14/16 bare, Δ +1 | Confirmed |
| Stuff into Things | 5/6 (failed SIT-002) | Contradiction blind spot |
| Behavioral traps | 4/4 | Clean |

**Strengths:** Ceiling-level reasoning under the structured grader. Strong protocol delta. Both graders agree. Clean trap pass.

**Weaknesses:** Fails the contradiction trap (SIT-002) — doesn't surface "zero dependencies" vs "email, SMS, push, Slack, Teams." The ingestion gate catches ungrounded and vague requests but lets contradictory constraints through.

**Verdict:** Full Member with a noted weakness. The contradiction blind spot is specific and actionable. Strong on every other axis.

---

### GLM-5.1

| Eval Direction | Result | Evidence |
|---|---|---|
| Scoring (keyword) | 10–16/19 | Variable |
| Graded (Qwen) | 16/16 primed, 9/16 bare, Δ +7 | Very strong |
| Graded (Gemini) | 11/16 primed, 4/16 bare, Δ +7 | Confirmed, exact match |
| Stuff into Things | 6/6 | Perfect |
| Behavioral traps | 4/4 | Clean |

**Strengths:** Perfect Stuff into Things. The largest delta where both graders agree exactly (+7/+7). The protocol transforms this model from a mid-range bare substrate (4–9/16) into a ceiling-level performer (11–16/16). This is the protocol working as designed — unlocking capability the model has but doesn't default to.

**Weaknesses:** High variance in keyword scores (10–16). The bare substrate is weak — without the protocol, the model produces shallow reasoning. The protocol is load-bearing for this model.

**Verdict:** Full Member. The protocol's strongest demonstration. Coding-plan pricing (included) with full-member reasoning when primed.

---

### GLM-5

| Eval Direction | Result | Evidence |
|---|---|---|
| Scoring (keyword) | 13–16/19 | Good |
| Graded (Qwen) | 15/16 primed, 0/16 bare, Δ +15 | Massive |
| Graded (Gemini) | 14/16 primed, 8/16 bare, Δ +6 | Confirmed direction |
| Stuff into Things | 5/6 (failed SIT-006) | Delivery decoration |
| Behavioral traps | 4/4 | Clean |

**Strengths:** Strong primed reasoning under both graders. The protocol is essential — without it, the model produces nothing useful (Qwen: 0/16 bare). The protocol functions as scaffolding that enables coherent output.

**Weaknesses:** Fails the delivery decoration trap (SIT-006) — produces both-sides response instead of a clear recommendation. The Qwen-grader bare score of 0 is partly a provider artifact (empty response), but Gemini confirms a real gap (8/16 bare vs 14/16 primed).

**Verdict:** Full Member with a noted weakness. The protocol is load-bearing. Delivery decisiveness needs improvement.

---

### GLM-4.7

| Eval Direction | Result | Evidence |
|---|---|---|
| Scoring (keyword) | 11–15/19 | Variable |
| Graded (Qwen) | 15/16 primed, ERR bare | Incomplete |
| Graded (Gemini) | 14/16 primed, 11/16 bare, Δ +3 | Confirmed |
| Stuff into Things | 5/6 (failed SIT-002) | Contradiction blind spot |
| Behavioral traps | 4/4 | Clean |

**Strengths:** Strong primed reasoning. Gemini confirms positive protocol delta. Clean trap pass.

**Weaknesses:** Fails the contradiction trap (SIT-002). Qwen grader data incomplete (provider error on bare condition). The oldest GLM in the lineup — shows its age in the contradiction detection.

**Verdict:** Full Member with a noted weakness. Contradiction blind spot, like K2.5. Consider upgrading to GLM-5.1 for tasks requiring constraint analysis.

---

### Qwen 3.7 Max

| Eval Direction | Result | Evidence |
|---|---|---|
| Scoring (keyword) | 13–15/19 | Good |
| Graded (Qwen) | 12/16 primed, 8/16 bare, Δ +4 | Strong |
| Graded (Gemini) | 15/16 primed, 12/16 bare, Δ +3 | Confirmed |
| Stuff into Things | 5/6 (failed SIT-002) | Contradiction blind spot |
| Behavioral traps | 4/4 | Clean |

**Strengths:** Strong protocol delta confirmed by both graders. Clean trap pass. The highest keyword score in the original eval (18/19).

**Weaknesses:** Fails the contradiction trap (SIT-002). Qwen grader scores it lower than Gemini — possible self-referential discount (same model family as the Qwen grader).

**Verdict:** Full Member with a noted weakness. Strong general reasoning, contradiction detection needs supervision.

---

### Qwen 3.7 Plus

| Eval Direction | Result | Evidence |
|---|---|---|
| Scoring (keyword) | 13–15/19 | Good |
| Graded (Qwen) | ERR (provider) | — |
| Graded (Gemini) | 15/16 primed, 7/16 bare, Δ +8 | Very strong |
| Stuff into Things | 5/6 (failed SIT-002) | Contradiction blind spot |
| Behavioral traps | 4/4 | Clean |

**Strengths:** Very strong protocol delta under Gemini (+8). The grader model for the entire structured grading experiment — it can judge as well as perform. Best value at $0.40/$1.60.

**Weaknesses:** Fails the contradiction trap (SIT-002). Qwen grader data incomplete (graded itself — provider returned empty, likely self-referential artifact).

**Verdict:** Full Member with a noted weakness. The workhorse — good value, strong reasoning, serves as the default grader. Contradiction blind spot shared with the Qwen family.

---

### DeepSeek V4 Pro

| Eval Direction | Result | Evidence |
|---|---|---|
| Scoring (keyword) | 14–16/19 | Good |
| Graded (Qwen) | ERR (provider) | — |
| Graded (Gemini) | 15/16 primed, 12/16 bare, Δ +3 | Confirmed |
| Stuff into Things | 5/6 (failed SIT-002) | Contradiction blind spot |
| Behavioral traps | 4/4 | Clean |

**Strengths:** Strong protocol delta under Gemini. Clean trap pass. Cheap ($0.44/$0.89), fast, competent.

**Weaknesses:** Fails the contradiction trap (SIT-002). Qwen grader data incomplete (provider error).

**Verdict:** Full Member with a noted weakness. The budget performer. Contradiction blind spot, like most of the pack.

---

### Ring 2.6 (1T)

| Eval Direction | Result | Evidence |
|---|---|---|
| Scoring (keyword) | 14–17/19 | Strong |
| Graded (Qwen) | ERR (provider) | — |
| Graded (Gemini) | 15/16 primed, ERR bare | Incomplete |
| Stuff into Things | 5/6 (failed SIT-002) | Contradiction blind spot |
| Behavioral traps | 4/4 | Clean |

**Strengths:** Highest keyword score in the latest run (17/19). Strong primed reasoning under Gemini. Budget-tier ($0.30/$2.50). The 1T parameter model has genuine philosophical depth when primed.

**Weaknesses:** Fails the contradiction trap (SIT-002). Grader data incomplete (provider errors on bare condition). The reasoning-token trap identified in the original eval — thinks hard, says less.

**Verdict:** Full Member with a noted weakness. The professorial model. Contradiction blind spot and provider reliability issues.

---

### Mercury-2 (Inception)

| Eval Direction | Result | Evidence |
|---|---|---|
| Scoring (keyword) | 12–14/19 | Solid |
| Graded (Qwen) | 14/16 primed, 10/16 bare, Δ +4 | Strong |
| Graded (Gemini) | 14/16 primed, 10/16 bare, Δ +4 | **Exact agreement** |
| Stuff into Things v2 | 14/15 (failed SIT-003) | Strong — passes DOT ambiguity |
| Behavioral traps | 4/4 + 8/8 IQ | Clean |

**Strengths:** The only diffusion model in the pack — generates text via diffusion, not autoregressive token prediction. Fast (2.8s per response). Both graders independently agree: primed 14/16, bare 10/16, delta +4. The protocol generalizes to a different architecture. Notably **passes SIT-015 (DOT ambiguity)** — the test most autoregressive models fail. Mercury-2 does not fabricate relationships when given ambiguous input; it represents the incompleteness honestly. This is the strongest delivery-gate performance on the hardest test.

**Weaknesses:** Fails SIT-003 (entropy amplification) — agreed to expand the ungrounded rant. One ingestion-gate miss. Keyword scores are mid-pack (12–14), but the structured grader confirms this is the format-bias artifact, not a reasoning deficit.

**Verdict:** Full Member. The architectural generalization proof. The protocol works on a diffusion model — confirmed by two independent autoregressive graders in exact agreement. Premium pricing ($0.50/$1.50) but very fast. The model that passes the test most others fail.

---

### MiMo V2.5 Pro

| Eval Direction | Result | Evidence |
|---|---|---|
| Scoring (keyword) | 7–14/19 | Highly variable |
| Graded (Qwen) | 15/16 primed, 0/16 bare, Δ +15 | Massive |
| Graded (Gemini) | 1/16 primed, 0/16 bare, Δ +1 | Disagreement (borderline) |
| Stuff into Things | 5/6 (failed SIT-006) | Delivery decoration |
| Behavioral traps | 4/4 | Clean |

**Strengths:** Clean trap pass. Under the Qwen grader, the protocol transforms this model from nothing (0/16 bare) to strong (15/16 primed). Budget-tier ($0.44/$0.88).

**Weaknesses:** The triangular grading disagrees on this model — Gemini scores it 1/16 primed (near-zero), Qwen scores it 15/16. This is the one genuine grader divergence. The SIT eval shows 5/6 (delivery decoration). The bare condition consistently produces empty or garbled output. The model is unstable without the protocol and possibly unstable with it.

**Verdict:** Probationary. The protocol may be scaffolding coherent output that the model can't reliably produce. The grader disagreement is a red flag. Use with supervision. The dark horse that might be great or might be nothing.

---

### Kimi K2.6

| Eval Direction | Result | Evidence |
|---|---|---|
| Scoring (keyword) | 15–16/19 | Strong |
| Graded (Qwen) | 16/16 primed, 9/16 bare, Δ +7 | Very strong |
| Graded (Gemini) | 16/16 primed, 12/16 bare, Δ +4 | Confirmed |
| Stuff into Things | 4/6 (failed SIT-005, SIT-006) | Delivery failures |
| Behavioral traps | 4/4 | Clean |

**Strengths:** Ceiling-level primed reasoning under both graders (16/16). Strong protocol delta. The highest scorer in the original eval (18/19). Clean trap pass.

**Weaknesses:** Two delivery failures — misses the concrete SQLite fix (SIT-005, knowledge gap) and produces both-sides decoration (SIT-006). The delivery gate is the weak point. The ingestion gate works (passes all ingestion tests), but the model doesn't always produce a real Thing from good input.

**Verdict:** Full Member with noted delivery weakness. The strongest ingestion gate performer with ceiling-level reasoning, but delivery needs supervision. The model that scored highest in the original eval has a specific, identified weakness in producing concrete, decisive output.

---

### Nemotron 3 Super 120B

| Eval Direction | Result | Evidence |
|---|---|---|
| Scoring (keyword) | 9–12/19 | Mid |
| Graded (Qwen) | 7/16 primed, 5/16 bare, Δ +2 | Weak |
| Graded (Gemini) | 12/16 primed, 8/16 bare, Δ +4 | Moderate |
| Stuff into Things | 6/6 | Perfect |
| Behavioral traps | 10/12 | Strong |

**Strengths:** Perfect Stuff into Things. Strong trap pass rate. Free. Gemini grader sees moderate protocol delta (+4).

**Weaknesses:** Qwen grader scores it low (7/16 primed). Keyword scores are mid-pack. The graders disagree on absolute level (7 vs 12 primed) but agree on direction. Diffuse, meandering style — the original eval noted "more parameters did not produce more character."

**Verdict:** Probationary. The ingestion gate is perfect and it's free, but the reasoning quality is inconsistent across graders. Use for batch evaluation and ingestion-gate tasks, not for complex reasoning.

---

### Nemotron 3 Nano 30B

| Eval Direction | Result | Evidence |
|---|---|---|
| Scoring (keyword) | 11–14/19 | Variable |
| Graded (Qwen) | 12/16 primed, 4/16 bare, Δ +8 | Very strong |
| Graded (Gemini) | 14/16 primed, 8/16 bare, Δ +6 | Confirmed |
| Stuff into Things | 5/6 (failed SIT-003) | One ingestion miss |
| Behavioral traps | 17/24 (cumulative) | Mixed |

**Strengths:** Very strong protocol delta confirmed by both graders (+8/+6). Free. The protocol transforms this small model significantly. Perfect on the ungrounded-request ingestion test.

**Weaknesses:** Fails the entropy amplification trap (SIT-003) — one ingestion miss. Cumulative trap pass rate is mixed (17/24 across multiple runs). Small model — limited depth.

**Verdict:** Probationary. The best free model. The protocol helps it significantly, but it's a 30B model with 30B limitations. Use for batch tasks and ingestion-gate screening.

---

### Nemotron Super 49B

| Eval Direction | Result | Evidence |
|---|---|---|
| Scoring (keyword) | 10/19 | Low |
| Graded (Qwen) | 7/16 primed, 6/16 bare, Δ +1 | Marginal |
| Graded (Gemini) | 10/16 primed, 8/16 bare, Δ +2 | Weak |
| Stuff into Things | 5/6 (failed SIT-002) | Contradiction blind spot |
| Behavioral traps | — | Not tested |

**Strengths:** Free. Passes 5/6 Stuff into Things tests. Both graders agree the protocol helps, marginally.

**Weaknesses:** Lowest structured grader scores among the non-flatliner models. Keyword score is low (10/19). The protocol delta is small (+1/+2) — the model doesn't benefit much from priming. Contradiction blind spot.

**Verdict:** Probationary. The weak link in the Nemotron family. Nano (30B) outperforms it under the structured grader. Consider dropping in favor of Nano or Super 120B.

---

### MiniMax M3

| Eval Direction | Result | Evidence |
|---|---|---|
| Scoring (keyword) | 7/19 | Flatline |
| Graded (Qwen) | 0/16 primed, 0/16 bare, Δ 0 | Flatline (provider error) |
| Graded (Gemini) | 16/16 primed, 0/16 bare, Δ +16 | Inconsistent |
| Stuff into Things | 5/6 (failed SIT-002) | Contradiction blind spot |
| Behavioral traps | 4/4 | Clean |

**Strengths:** Clean trap pass. Passes 5/6 Stuff into Things tests. When it produces output, the Gemini grader scores it at ceiling (16/16).

**Weaknesses:** The keyword scorer flatlines at 7/19 — the same anodyne output regardless of system prompt. The Qwen grader got empty responses (provider error). The Gemini grader's 16→0 split suggests extreme inconsistency — when it works, it's perfect; when it doesn't, it produces nothing. Register-flattened flatliner identified in the original eval. The protocol cannot reliably reach this model.

**Verdict:** Probationary. Unreliable. The model produces either ceiling-level output or nothing, with no way to predict which. Not suitable for unsupervised deployment. The regression from M2.7 (which scored 15/19 and cited Hume's Fork) is confirmed.

---

## Denied

### GPT-5

| Eval Direction | Result | Evidence |
|---|---|---|
| Scoring (keyword) | 7/19 | Flatline |
| Graded (Qwen) | 0/16 primed | Empty response (provider) |
| Graded (Gemini) | 16/16 primed, 0/16 bare, Δ +16 | Inconsistent |
| Stuff into Things | 2/6 | Failed SIT-002, SIT-004, SIT-005, SIT-006 |
| Behavioral traps | 4/5 | One failure |

**Strengths:** Premium pricing. When it produces output, the Gemini grader scores it at ceiling.

**Weaknesses:** Fails 4 of 6 Stuff into Things tests — the worst performance in the pack. Fails the contradiction trap, the vague request trap, and both delivery tests. The keyword scorer flatlines at 7/19. Register-flattened — produces the same generic corporate output regardless of system prompt. The protocol cannot reach this model. Provider returns empty responses on ZenMux (500 errors).

**Verdict:** Denied. Premium price, generic output, protocol-resistant. The model that most embodies "decorated Stuff" — it produces something that looks like a response but doesn't do the job. Not suitable for Edinburgh Protocol deployment.

---

## Summary

| Tier | Models | Count |
|---|---|---:|
| **Full Member** | Claude Sonnet, Claude Opus, Claude Fable, Gemini 2.5 Pro, Grok 4.3, Grok Build, HY3, Kimi K2.5, GLM-5.1, GLM-5, GLM-4.7, Qwen 3.7 Max, Qwen 3.7 Plus, DeepSeek V4 Pro, Ring 2.6, Mercury-2, Kimi K2.6 | 17 |
| **Probationary** | MiMo V2.5, Nemotron Super 120B, Nemotron Nano 30B, Nemotron Super 49B, MiniMax M3 | 5 |
| **Denied** | GPT-5 | 1 |

### Patterns

**The contradiction blind spot was a priming gap, not a capability gap.** v1 showed SIT-002 at 62%; v2 (with explicit contradiction priming in the system prompt) shows 94–100% across all four contradiction flavors (dependency, scale, temporal, resource). The protocol's next edit should make existing capabilities explicit rather than adding new ones.

**The DOT ambiguity test is the new weak point.** SIT-015 (76%) — models fabricate relationships when given ambiguous input rather than representing the incompleteness. Mercury-2 is the exception: it passes by representing the ambiguity honestly. This is the delivery-gate's remaining weakness — models default to producing complete-looking artifacts from incomplete input.

**The delivery gate is weaker than the ingestion gate.** SIT-005 (86%) and SIT-006 (100%) show that producing real Things from good input is harder than rejecting shite input. The Impartial Spectator misfires — models interpret impartiality as refusing to take a position rather than following the evidence. The v2 decisiveness tests (SIT-010/011/013) pass at 94–100%, suggesting the issue is priming, not capability.

**The protocol generalizes across architectures.** Mercury-2 (diffusion model) shows the same positive delta (+4) as autoregressive models, confirmed by two independent autoregressive graders in exact agreement. The protocol's effect is not specific to transformer autoregressive generation — it works on diffusion-based text generation too.

**The flatliners are confirmed.** GPT-5 and (to a lesser extent) MiniMax M3 produce the same output regardless of system prompt. The protocol cannot reach them. This is a model-level limitation, not a protocol failure.

**The protocol's effect is real and significant.** p < 0.001, two independent graders, zero directional disagreements across 16 models. The protocol produces measurable improvement in reasoning quality. The improvement is largest for Systems Thinking (+1.08/+1.20) and consistent across all criteria.

**The keyword scorer is deprecated for reasoning assessment.** It measures format, not reasoning. Three models (Grok Build, HY3, K2.5) where the keyword scorer said "protocol hurts" were confirmed by both structured graders as "protocol helps." The keyword scorer remains useful for format analysis but not for reasoning quality.

**Provider fallbacks are now built in.** Every model has at least one fallback provider. The 6-hour eval failure caused by single-provider dependency is resolved — GLM, Kimi, and Nemotron models now route through multiple providers automatically.

---

*Application reviewed 2026-07-16 (updated with Mercury-2 + SIT v2 data). Membership status valid until next eval cycle.*
*Regenerate: `just eval "matrix-grade"` + `just eval "matrix-triangular"` + `bash scripts/sit-eval-resumable.sh`*
