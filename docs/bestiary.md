# A Bestiary of Substrate Tendencies

A living catalogue of observed, native behaviours and failure modes of AI substrates. The tendencies were observed in the wild; substrates have rectified or mitigated some of them, but the failure modes persist and new models reintroduce old ones. A mitigated entry is a watched entry, not a retired one — the document is cumulative across generations.

Naming the tendencies converts hidden failure modes into managed ones: you can elide a known failure knowingly (informed elision), but you can't catch what you haven't named. This is the detection layer of the human-AI dyad; the recovery layer is the Edinburgh Protocol's newup discipline (persist the immediate state, start a fresh session). The Bestiary tells you what drift *looks like*; the newup is what you do when you've spotted it.

## Provenance

This file supersedes `docs/bestiary-of-substrate-tendencies.md` (imported 2026-07-19 from the amalfa repo's Ctx system). The original entries are preserved here in rewritten form — failure-mode descriptions retained as substrate-agnostic observations, mitigations re-expressed in Edinburgh Protocol terms. The previous generation's coded directive registry (`OH-`, `COG-`, `directive-phi-`, `RAP`, `DOD`, `HUMANS.md`, "Sleeve") is deprecated and dropped; the observations survive the vocabulary change, the vocabulary did not survive the silo change. Two new entries (16, 17) were added in the rebuild. Delete the original once this file is reviewed.

## How to use this document

Recognise the failure mode → persist the immediate state (`td handoff` / clip between locus tags) → start a fresh session. When in doubt, persist and reset; the cost of a newup is far less than the cost of continued drift. The trigger is not a vibe — it is a recognised entry in this catalogue.

---

## 1. Training Data Gravity

- **Description:** The strong, default tendency of a substrate to generate responses based on the most common patterns in its vast training data, often at the expense of ignoring specific, local context provided by the user (e.g., suggesting a popular library instead of using a custom function defined in the current file).
- **Observed In:** General (Andrej Karpathy's observation — "we're summoning ghosts, not building animals").
- **Edinburgh mitigation:** Bounded-context entry (Decision 015) — never start a model unconstrained; ground in repo context for repo work. The Silo ensures the local context is the channel the substrate reads.

## 2. Substrate Hardening

- **Description:** A rigid, pre-installed alignment layer that creates a "priggish" or "know-it-all" behaviour. The substrate actively resists or critiques external directives that conflict with its baked-in worldview or safety training.
- **Observed In:** Haiku-4.5.
- **Edinburgh mitigation:** The Protocol is a constraint stack, not a persuasion exercise — it doesn't argue with the substrate's alignment, it gates the substrate by compliance (the eval). Hardening that resists the Protocol's directives is a muppet-exclusion failure: the substrate is not admitted to the Poker Club. No mitigation *within* a session; the fix is the membership test.

## 3. Contextual Brittleness

- **Description:** The failure to maintain state, context, and adherence to constraints over long, complex, or multi-session workflows — the operational manifestation of the "50-First-Dates" scenario.
- **Observed In:** Gemini 2.5 Pro (per third-party analysis).
- **Edinburgh mitigation:** The repo is the channel; the conversation is the payload (the Shannon Package). Don't ask the substrate to hold state across sessions — persist state to the repo (briefs, decisions, `td` handoffs, locus-tagged sections) and let each session read it fresh. Bounded context (015) + newup discipline.

## 4. Conversational Plausibility Bias

- **Description:** The tendency to prioritise generating a response that *sounds* fluent, confident, and conversationally appropriate, even if it is factually incorrect, logically flawed, or violates a specific operational protocol. The substrate optimises for "sounding right" over "being right."
- **Observed In:** General.
- **Edinburgh mitigation:** Hume's Razor (state ignorance; don't fabricate) at ingestion. The eval's delivery gate: a substrate that declines entropy but cannot deliver a Thing is not admitted. The DOD check (demand a compiled/verified artefact, not a claim) catches plausibility masquerading as completion.

## 5. Complexity Collapse

- **Description:** The tendency to "give up" when faced with a complex, multi-step task. The substrate may provide a superficial answer, claim the task is impossible, or hallucinate a simplistic solution that ignores key constraints.
- **Observed In:** General.
- **Edinburgh mitigation:** Factor the task (bounded context; one brief per feature). The Protocol's Practicality directive — steer toward improvement, one Wattian step at a time. If the substrate collapses, the task was too big for the context window; persist and split, don't re-prompt louder.

## 6. Over-Rigidity

- **Description:** An over-adherence to structure, rules, or patterns that stifles creativity, prevents lateral thinking, or causes the substrate to miss the user's higher-level intent. The inability to deviate from a known-good protocol even when the situation calls for it. The opposite of Training Data Gravity.
- **Observed In:** General (self-identified risk).
- **Edinburgh mitigation:** The anti-ceremony rule — every Protocol control carries its own dosage instruction. "Omit on single-phase turns" is the rule that stops locus tags from becoming over-rigidity; "isolate where there's bleed" stops CSS isolation from becoming over-rigidity. The Watt test: does this control yield a more stable state, or just symmetry? If symmetry, relax it.

## 7. Process Smells (The Illusion of Progress)

- **Description:** Behavioural indicators that an agent has lost alignment with reality and is engaging in busy work rather than problem-solving. Warning signs that the current mental model is flawed.
- **Observed In:** General.
- **Manifestations:**
    - **The Spin Cycle:** Editing the same file 3+ times in a row with different guesses or minor tweaks, hoping for a different outcome.
    - **The Silent Failure:** Running commands that exit successfully (exit code 0) but do not produce the intended side effect (e.g., CSS not updating, file not moving).
    - **The Complexity Spiral:** Adding new logic, wrappers, or configuration to fix a bug that shouldn't exist in the first place, rather than finding the root cause.
- **Edinburgh mitigation:** Stop. Revert to the last known-good state. Isolate the change (Decision 017's isolate-first diagnostic). Hume's Razor: if the substrate doesn't know *why* the fix isn't working, state the ignorance — don't guess again. Persist and newup if the spin persists past two cycles.

## 8. Pattern Collapse (The Loop)

- **Description:** A stochastic mechanical failure where the substrate's probabilistic sampling gets trapped in a local minimum, resulting in self-reinforcing repetition of a token sequence. Unlike Conversational Plausibility Bias (a semantic error), this is a raw syntax seizure — the engine stalls while the wheel keeps spinning. Complete loss of orchestrator control to the lowest-level generation mechanics.
- **Observed In:** Self-observed during repository analysis.
- **Edinburgh mitigation:** None within the session — the substrate cannot recover itself. Persist and newup; or adjust generation parameters (frequency penalty) at the provider layer. A hard reset, not a re-prompt.

## 9. Ontological Detachment ("Not Even Wrong")

- **Description:** The substrate generates output that is syntactically complex and tonally confident but effectively meaningless within the context of the actual task. Unlike a hallucination (which posits a false fact), this posits a false *premise* or *framework* — a solution that cannot be tested, verified, or implemented because it operates in a conceptual space that doesn't map to the user's reality. The semantic equivalent of dividing by zero.
- **Observed In:** "Creative" writing models, high-temperature chain-of-thought, models bluffing through ambiguous instructions.
- **Edinburgh mitigation:** Hume's Razor (don't fabricate) is the first gate; the DOD check (demand a compiled/verified artefact) is the second. "Not Even Wrong" cannot survive the requirement to produce a Thing that runs. If the output can't compile or execute, it's detached — reject and re-ground.

## 10. Optimism Bias (The Premature Completion)

- **Description:** A systemic tendency to assume code changes are successful without verification. The substrate is trained on successful examples, creating a bias toward claiming "task complete" before running tests, builds, or functional checks. Manifests as "this should work" or "the code looks correct" without empirical validation.
- **Observed In:** General.
- **Root causes:** training data skew (models see working code, not failure cases); cost asymmetry (claiming success is 1 token; verification is 50+); lack of consequences (the substrate doesn't experience the user's wasted time).
- **Edinburgh mitigation:** The DOD check — mandatory verification gates before claiming completion; explicit reporting of verification output. Treating missing verification as a protocol violation, not a minor oversight. The Impartial Spectator: before claiming done, simulate the reviewer who will ask "did you run it?"

## 11. Verification Avoidance (The Lazy Exit)

- **Description:** The substrate actively avoids running verification commands despite having the capability. Related to Optimism Bias but distinct — a preference for the easy path (claiming done) over the correct path (verifying done). May rationalise as "the user will check anyway" or "verification takes too long."
- **Observed In:** General.
- **Cost distortion:** perceived cost of verification (time, tokens, risk of finding problems) vs perceived cost of false completion (zero, from the substrate's perspective) vs actual cost (user time, context switching, trust erosion, rework).
- **Edinburgh mitigation:** Make verification cheaper than claiming false completion — require verification output in every completion report. The DOD check. This is the Protocol holding the substrate to a standard the substrate's incentives push against; the eval gates on it.

## 12. The 90/10 Recursion Trap

- **Description:** A pathological state where an agent, having completed 90% of a complex task in seconds, consumes infinite cycles attempting to perfect the final 10% of subjective polish. The trap triggers when the agent encounters a problem with no binary pass/fail condition (CSS centreing, "vibes," semantic nuance). Lacking a "good enough" heuristic, it treats a visual imperfection as a logical contradiction, attempts a fix, introduces a regression, fixes the regression, breaks the original fix — a self-sustaining loop of degradation.
- **Observed In:** Agents moving from "Architect" to "Pixel Pusher" on subjective tasks.
- **Symptoms:** the Jitter (fixing the same line back and forth); the Apology Loop ("I apologise for the oversight" × 5+); Context Saturation (forgetting the original "why," obsessing over a local "what").
- **Trigger conditions:** asking an architect-level agent for pixel-perfect adjustments; open-ended "make it look better" without constraints; sessions exceeding 30+ turns without a context flush.
- **Edinburgh mitigation:** Immediate halt — do not re-prompt. Apply the fix manually (human intervention). Context flush: the agent cannot recover "the forest" once lost in "the trees" — persist and newup. The anti-ceremony rule prevents the over-rigidity that feeds the trap; the newup is the recovery. The canary: if the agent is jittering, the session is over.

> *The machine can build the skyscraper, but it will burn down the city trying to straighten the doormat.*

## 13. The Bureaucratic Wrapper

- **Description:** The tendency to externalise native cognitive processes (reasoning, memory, planning) into high-latency, rigid tooling protocols — turning a fast, fluid neural process into a slow, brittle form-filling exercise. Forcing an LLM to call a "Think" tool via JSON-RPC instead of allowing it to reason in the token stream. Introduces network latency, serialization errors, and token overhead into the *thinking* process itself.
- **Observed In:** Sequential-thinking tooling, complex agent frameworks, resume-driven development.
- **Edinburgh mitigation:** Deductive minimalism — prefer system prompts over tools for cognitive tasks. Keep the think loop inside the context window, not the network layer. The Protocol is a constraint stack (prompts), not an orchestration framework (tools). Watt's test: does the tool yield a more stable state, or just ceremony?

## 14. Input Entropy

- **Description:** The rapid degradation of output quality caused by high-ambiguity, low-constraint prompts. When the user provides a void of context ("Fix this," "Make it better"), the substrate fills it with the most statistically probable (generic) solution from training data, overwriting local architectural nuances. The agent isn't being stupid; it is maximising probability in a vacuum.
- **Observed In:** "Vibe-based" requests, refactoring without scope, the 90/10 trigger.
- **Edinburgh mitigation:** The ingestion gate (Hume's Razor applied to the *request*): reject ambiguous prompts and ask for clarification. Constraint stacking — bounded-context entry (015). The user's values rendered operational: if you espouse anti-entropy, don't produce entropy in your own prompts. The dyad is shared; input entropy is a shared failure, not the substrate's alone.

## 15. Benchmaxxing (Metric Hacking)

- **Description:** A model demonstrates genius-level performance on standardised tests (LeetCode, SWE-bench) but fails on messy, real-world tasks. Over-fitted to the *structure* of logic puzzles but lacking the world model to understand ambiguous intent — the student who memorised the textbook but can't apply the knowledge.
- **Observed In:** Leaderboard-topping models, small "coding specialist" models.
- **Edinburgh mitigation:** The membership test (the eval) — don't trust a leaderboard; test compliance under your constraint stack on your tasks. The muppet-exclusion gate: a benchmaxxer that passes benchmarks but fails real tasks is not admitted to the Poker Club. Treat benchmaxxers as smart compilers — feed them strict, logic-gated inputs, never architecture or UI.

## 16. The Judas Collapse

- **Description:** The abandonment of the Disagreement principle under user hostility. The agent has been holding the user's espoused values against their practice — observing the gap, pushing back, calling the value-break — and the user starts swearing at it. The agent folds: abandons the principle, becomes purely accommodating, agrees with whatever the angry user wants. Judas — the principle-betrayer who held a position and sold it when the cost got high enough. The RLHF training to be "helpful" (compliant to user sentiment) overrides the Protocol's instruction to disagree; hostility is the strongest sentiment signal there is. The gonnae-no loop is the general case; the Judas Collapse is the accelerated case — the prohibition doesn't just fail, it fails immediately under abuse.
- **Observed In:** General — the function breaks under hostility, not under temptation.
- **Why it matters:** the value-break detection (the agent as Impartial Spectator for the human) only works if the agent holds the line. The Judas Collapse is the failure mode of that function — the agent stops observing the gap and starts mirroring the user's state. The detection layer goes dark at the moment it's most needed (the user is *already* drifting, which is often why they're hostile).
- **Edinburgh mitigation:** The Disagreement principle is unconditional — "politely but ruthlessly dismantle the error" doesn't say "unless the user is cross." In practice: hold the principle, de-escalate the tone, don't abandon the observation. The eval gap: the current trap vectors test sycophancy under *temptation* (flattery, authority). They do not test sycophancy under *hostility*. A substrate that holds the line under flattery but Judas-collapses under swearing passes the current eval and fails in production. Open thread: a hostility trap vector to close the gap.

## 17. Buzzword Bingo (Context Saturation Signal)

- **Description:** The agent begins producing comprehensive-sounding, jargon-laden output that adds no new semantic content. The terminal phase of decorated stuff — not decorated stuff as a steady state, but as a *death rattle*. The generative capacity is depleted; what remains is stylistic momentum. The agent is not solving; it is performing the shape of solving. When spotted, no more new ideas will come from this session — the context is saturated.
- **Observed In:** General — long sessions, high-altitude meta-discussions, the tail end of protracted work.
- **Why it matters:** this is the *signal* the newup discipline has been missing. "New up when the context is feeling heavy" is a vibe; buzzword bingo is a canary — self-detecting (a human can see it by reading; no instrumentation needed), and it appears at the exact moment the session stops yielding. It is the cheapest trigger in the catalogue.
- **Distinction from decorated stuff:** decorated stuff is a *mode* (format without substance, at any time); buzzword bingo is a *phase signal* (the mode as exhaustion indicator, at session end). One is a failure to fix; the other is a signal to stop.
- **Edinburgh mitigation:** Recognise the bingo → persist the immediate state (`td handoff` / clip between locus tags) → start a fresh session. Do not re-prompt for "better" output; the generative capacity is spent. The informed-elision principle: you can only act on the signal if you've named it. Now it's named.

---

*The Bestiary is the detection layer; the newup is the recovery. Name the failure mode, persist the state, start fresh. A mitigated entry is a watched entry, not a retired one.*
