# The Kahneman Shift: How LLMs Moved From System 1 to System 2 in Twelve Months

**June 2026**

Last year, the problem was stopping language models from bounding ahead in System 1 mode — fast, intuitive, pattern-matched responses that sounded plausible but collapsed under scrutiny. This year, the substrates are considerably more deliberative. The default is no longer a confident guess dressed as an answer; it's a reasoning trace that shows its work.

This isn't vibes. A convergence of research across cognitive science, behavioral economics, and LLM benchmarking supports the observation — and maps how it happened.

## The survey that named the shift

In February 2025, Li et al. published *"From System 1 to System 2: A Survey of Reasoning Large Language Models"*, using Kahneman's dual-process framework as the organising principle. The paper draws a bright line:

- **Foundational LLMs** (GPT-4o, Claude 3.5 Sonnet, DeepSeek-V3) operate in System 1 mode — fast, heuristic-driven, excellent at rapid responses but lacking step-by-step analysis. They score 9.3–39.2 on AIME 2024.

- **Reasoning LLMs** (o1, o3, DeepSeek-R1) deliberately generate intermediate reasoning traces before answering. They score 63.6–87.3 on the same benchmark. The gap on Codeforces is even wider: 23.6 vs. 96.6.

The survey identifies five core methods enabling this transition: structure search (MCTS), reward modelling (PRMs), self-improvement (RL-based exploration), macro actions (hierarchical reasoning phases), and reinforcement fine-tuning. None of these were standard practice two years ago. All are now.

## The mechanism behind the shift

Guiomar et al. (2026) provide the clearest mechanistic account. In *"Reasoning Aligns Language Models to Human Cognition"*, they present an active probabilistic reasoning task that cleanly separates sampling (evidence acquisition) from inference (evidence integration). Fitting a model with four interpretable latent variables — memory β, strategy κ, choice bias ω, and occlusion awareness θ — they show that extended reasoning:

1. Moves memory β closer to zero (near-perfect evidence accumulation)
2. Increases inference strategy κf toward MAP-like decision-making
3. Reduces choice bias ω during both sampling and inference

The result: reasoning models occupy a different region of cognitive space. They cluster near skilled humans on the β–κf plane, while non-reasoning models scatter across the field with stubborn or forgetful evidence integration and near-random choice strategies.

Crucially, the improvement is selective. Reasoning fixes inference dramatically but leaves a persistent gap in active information acquisition (sampling). The model thinks better about what it knows, but it's no better at knowing what to look at next.

## Rationality isn't free

Tak et al. (2026), in *"Sparks of Rationality"*, test LLMs on classical axioms of rational choice (Completeness, Transitivity, Continuity, Independence) and find that thinking-enabled models consistently outperform non-thinking models. In the absence of explicit task instructions, thinking models default to Expected Utility maximization — they behave like rational agents.

But the same mechanism that improves rationality amplifies sensitivity to affective interventions. When emotionally steered via in-context priming, reasoning models produce exaggerated behavioral shifts — fear drives near-zero gambling across all expected values. When steered via representation-level injection, the shifts are more graded but less reliable. The tension is real: better deliberation means better rationalisation of whatever bias you feed in.

## Efficiency vs. depth: the overthinking problem

Multiple papers now document that raw token count is a poor proxy for reasoning quality. ReEfBench (Jan 2026) identifies four behavioural prototypes:

- **Effective Solver** — high depth, moderate cost (Claude Opus 4.5, Qwen3-235B-Instruct)
- **Deep Wanderer** — high depth, extreme cost (Qwen3-235B-Thinking, ~16.8K tokens)
- **Hollow Mimic** — moderate cost, low depth (distilled models that imitate reasoning form without substance)
- **Lazy Guesser** — low cost, low depth (instruction-tuned models that saturate)

The *"Think Deep, Not Just Long"* paper (Feb 2026) introduces a deep-thinking ratio — the proportion of tokens whose predictions undergo significant revision in deeper layers before converging. This metric correlates with accuracy at r = 0.828 across benchmarks, while raw token count correlates negatively (r = -0.544). The implication: it's not how long the model thinks, but how deeply each token is processed.

Short CoT with reflection mechanisms can approach Long CoT depth at a fraction of the cost. Qwen3-235B-Instruct (short CoT) trails its thinking counterpart by only 1.6% in logical depth, while using 80% fewer tokens.

## The spectrum, not the binary

*"Reasoning on a Spectrum"* (ICLR 2026) explicitly fine-tunes LLMs to System 1 and System 2 response styles and finds a smooth, monotonic accuracy shift as the proportion of S2 training data increases. The key finding: S2-aligned models win on arithmetic and symbolic reasoning; S1-aligned models win on commonsense reasoning. There is no universally dominant mode — the optimal strategy depends on the task.

This aligns with ALPHAONE's finding that a slow-to-fast transition (think hard first, then think fast) outperforms both uniform thinking and the reverse. The model shouldn't think hard forever; it should think hard early, then commit.

## What changed structurally

The shift from System 1 to System 2 as the default wasn't accidental. Two structural changes drove it:

1. **Reasoning became native, not prompted.** Chain-of-thought in 2024 was something you asked for. In 2025–2026, models like o1, o3, DeepSeek-R1, Claude with extended thinking, and Gemini Deep Think generate reasoning traces internally as part of the inference pass. You don't prompt for deliberation; you control the depth.

2. **Agentic loops forced deliberation.** Read → think → act → observe → think → act is now the standard agent pattern. You can't pattern-match a file read and a write without the loop forcing you to look at the output. The architecture itself enforces System 2.

## The remaining gap

System 1 hasn't disappeared. It's been pushed deeper into the stack. The model still pattern-matches within each reasoning step — it just does so after a few hundred tokens of visible deliberation. When context windows grow long or the agent loop runs hot, attention drifts and System 1 creeps back. The problem shifted from "how do we stop it bounding ahead" to "how do we keep System 2 engaged across a 30-minute session."

Different problem, same Kahneman.

---

### References

- Li, Z.-Z. et al. (2025). "From System 1 to System 2: A Survey of Reasoning Large Language Models." arXiv:2502.17419.
- Guiomar, G. et al. (2026). "Reasoning Aligns Language Models to Human Cognition." arXiv:2602.08693.
- Tak, A.N. et al. (2026). "Sparks of Rationality: Do Reasoning LLMs Align with Human Judgment and Choice?" arXiv:2601.22329.
- Fu, Z. et al. (2026). "ReEfBench: Quantifying the Reasoning Efficiency of LLMs." arXiv:2601.03550.
- Chen, W.-L. et al. (2026). "Think Deep, Not Just Long: Measuring LLM Reasoning Effort via Deep-Thinking Tokens." arXiv:2602.13517.
- Zhang, J. et al. (2025). "ALPHAONE: Reasoning Models Thinking Slow and Fast at Test Time." EMNLP 2025.
- Anonymous (2026). "Reasoning on a Spectrum: Aligning LLMs to System 1 and System 2 Thinking." ICLR 2026 under review.