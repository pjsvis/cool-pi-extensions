---
title: The Context Window Is a Noisy Channel — A Narrativised Bibliography
dek: The arbitrage is cheaper sessions, lower variance, over anything else. Here is the literature that proves the mechanism, legitimates the regime, fishes nearby, or confirms the idea is ambient — each entry a decision, not a summary.
date: 2026-07-20
---

# A Narratisived Bibliography

*Companion to [The Context Window Is a Noisy Channel](2026-07-20-the-context-window-is-a-noisy-channel.md).*

The arbitrage this work serves: **cheaper sessions, lower variance, over anything else.** Not "better quality" — quality is contested and benchmarkable into meaninglessness; cost and variance are measurable and defensible. That is the edge, and the literature below either proves the mechanism that makes it real, legitimates the Shannon regime it lives in, fishes in adjacent waters, or confirms by parallel discovery that the idea is now ambient.

Each entry is a *decision* — what role it plays, whether it threatens or confirms the arbitrage — not a summary. Decisions over history, applied to the bibliography itself. The principle practised on the principle.

---

## Pile 1 — The formalizers (rate-distortion of compaction)

These are the ones that prove the mechanism. They are the strongest ground the arbitrage stands on.

### Colaco & Lahjouji — *What to Keep, What to Forget: A Rate–Distortion View of Memory Compaction in LLMs and Agents* (arXiv 2607.08032)

**What.** A survey that unifies KV-cache eviction, prompt pruning, architectural recurrence, and agent-memory consolidation under a single rate-distortion objective: minimize expected task distortion subject to a rate budget. The information-bottleneck form makes the trade literal — keep the bits of history that predict the answer, spend nothing on the rest. A Fano-backed lower bound (their Eq. 2) shows that below the task's information requirement every layer must err at a rate set by the same expression. Three first-class properties separate methods that fail from those that don't: reversibility (P-rev), query-conditioning (P-q), and fidelity profile (P-fid).

**Where it sits.** This is the closest in substance to the operating argument. It has the handoff-as-lossy-compression move formalized, the query-agnostic penalty named as H(Q), and a falsifiable prediction that repeated irreversible summarization compounds error super-linearly — the exact pathology the newup discipline exists to prevent. It even runs a reference experiment showing reversible retrieval dominates irreversible eviction at equal budget once memory is reused.

**Verdict.** Confirms and formalizes; does not threaten. The gap is one of *layer*: they frame compaction at the memory substrate (KV, prompt, agent store); we frame the *conversation itself* as the channel and newup as capacity management at the session level. Complementary, not competing. Read this first; it is the formal half of the argument.

### Girish et al. — *Fundamental Limits of Prompt Compression: A Rate-Distortion Framework for Black-Box Language Models* (arXiv 2407.15504, EPFL / UT Austin)

**What.** Casts black-box prompt compression as a linear program, derives the dual, and gives a geometric algorithm for the distortion-rate function. The headline empirical result: a query-aware, variable-rate scheme (LLMLingua-2 Dynamic) is the only method tested that beats the optimal *query-agnostic* strategy — by exactly the mutual-information gap between conditioning and not conditioning on the query.

**Where it sits.** The proof of the H(Q) gap, made operational. Variable-rate beats fixed-rate because easy queries can be compressed hard and hard queries lightly — which is precisely what a handoff does when it compresses dead history aggressively and load-bearing decisions near-losslessly.

**Verdict.** Sharpens the arbitrage. The RD-optimal operator is variable-rate and query-conditioned; the newup discipline is both, at session scale. Read alongside Colaco for the formal backbone.

### Kim — *Polynomial Context-Truncation Sensitivity… Sequential Wyner–Ziv Bounds for KV Cache Compression* (arXiv 2605.25085)

**What.** Formulates online KV-cache compression as sequential Wyner–Ziv source coding on the model's filtration, with the next-step query as decoder side information. Empirically finds that the next-token distribution's sensitivity to context truncation decays *polynomially* (TV ∝ w^−α, α ≈ 0.4–0.6), not geometrically — across four models and four domains. Derives window scaling Θ(ε^−1/α) for suffix-only policies, tight within that class.

**Where it sits.** Gives the *shape* of how fast context goes stale. Polynomial decay is the reason deployed sliding windows must be far larger than geometric-mixing intuition predicts — and the reason "compress before the cliff" is a quantitative discipline rather than a vibe.

**Verdict.** Confirms with exponents. The polynomial (not exponential) tail is load-bearing: it says you can't rely on context "fading naturally," you must actively re-encode. A useful corrective to anyone who still thinks a long window is a substitute for a handoff.

---

## Pile 2 — The channel framers (LLM-as-noisy-channel)

These legitimate the Shannon regime. They confirm the maths applies — to a different problem than ours, which is why they don't collide with the arbitrage.

### Ouyang et al. — *LLMs as Noisy Channels: A Shannon Perspective on Model Capacity and Scaling Laws* (arXiv 2605.23901, ICML 2026, ByteDance / UVA / Berkeley)

**What.** Maps model parameters to channel bandwidth and training tokens to signal power via the Shannon–Hartley theorem, deriving a "Shannon Scaling Law" that unifies monotonic scaling with the U-shaped degradation seen in catastrophic overtraining and quantization. Extrapolates 1.7× beyond its fitting range where OpenAI and Chinchilla laws collapse.

**Where it sits.** The channel frame, but pointed at *training* — capacity of the model as a representation, not capacity of the context window as a transmission channel per turn. Same mathematics; different substrate.

**Verdict.** Confirms Shannon is the right language for LLMs in general. Does not touch the inference operating regime or the newup discipline. Adjacent and reputable; cite it to establish that "LLM as noisy channel" is not a metaphor the field rejects.

### Bai (Huawei) — *Forget BIT, It is All about TOKEN: Towards Semantic Information Theory for LLMs* (arXiv 2511.01202)

**What.** A theoretical backbone: the LLM as a discrete-time channel with feedback and state, with the token (not the bit) as the fundamental unit. Directed rate-distortion for pretraining, directed rate-reward for RLHF post-training, semantic information flow as a sub-martingale for inference. The Transformer is derived as a special case of a general autoregressive-LLM definition; ELBO, generalization bounds, and Gardner memory-capacity results follow.

**Where it sits.** This is the heavy machinery that makes the channel-with-feedback framing mathematically legitimate for autoregressive models — which is exactly the bridge that addresses the "where it strains" caveat in the parent piece. The re-send-every-turn structure is a channel *with feedback*; Bai proves that's a well-posed object.

**Verdict.** Legitimates the regime; does not operationalize. Read it to satisfy the theorist who objects that a context window isn't a wire. The answer is that it's a channel with feedback and state, and that's been formal.

---

## Pile 3 — Adjacent mechanism (fishing nearby)

These work the same machinery on neighbouring substrates. Useful for vocabulary and cautionary tales; not direct evidence for the arbitrage.

### Wang et al. — *QUITO-X: A New Perspective on Context Compression from the Information Bottleneck Theory* (arXiv 2408.10497)

**What.** Applies Tishby's information bottleneck to token-level context compression, deriving mutual information as the selection objective and proving it equivalent to maximizing the likelihood of the compressed output. Cross-attention as a cheap MI proxy.

**Where it sits.** A single mechanism — which tokens to keep — under the IB objective.

**Verdict.** Confirms MI is the right quantity for *what to keep*. Narrow but correct. Useful for the "enough context = sufficient mutual information with the decisions" claim.

### de Andrade, Harell & Bajić — *Rate-Distortion Optimization for Transformer Inference* (arXiv 2601.22002)

**What.** Rate-distortion for compressing *intermediate representations* transmitted between devices in split inference. Introduces the V-entropy gap — the distance between the rate a codec achieves and the entropy of the target, set by the modeler's computational limits — with PAC bounds via Rademacher complexity. Finds rate *increases* with depth.

**Where it sits.** RD for transmission of activations, not for context compaction. Same toolbox, different substrate.

**Verdict.** Adjacent. The V-entropy gap is the useful borrowing: it explains why a handoff can't hit Shannon's H exactly — the compressor (the summarizer, or you) is computationally bounded, so the achievable rate sits above entropy. A honest limit on the discipline, not a threat to it.

### Guo et al. — *When Less is More: The LLM Scaling Paradox in Context Compression* (arXiv 2602.09789)

**What.** Documents a size-fidelity paradox: larger compressor models produce less faithful reconstructions despite lower training loss. Two failure modes — knowledge overwriting (priors replace source facts) and semantic drift (paraphrase over verbatim). Mechanism: effective rank and conditional entropy *rise* with scale, opening room for prior intrusion.

**Where it sits.** The anti-scaling result, at the *model* level. More capacity ≠ more fidelity.

**Verdict.** Sharpens the arbitrage from an unexpected direction. If bigger models are worse at faithful compression, then "throw a bigger model at it" is the wrong move on two counts — cost and fidelity. The disciplined answer is a cleaner context, not a larger compressor. Reach for the handoff, not the frontier model.

---

## Pile 4 — Parallel discovery & popularization

These confirm the idea is ambient. They are the evidence of convergence.

### Eleventh Hour Enthusiast — *Channel Capacity. Why Every Model Has a Ceiling* (Medium, May 2026)

**What.** A five-part popular series, "Shannon's Blueprints," applying channel capacity, the information bottleneck, and the data-processing inequality to neural networks. Context windows as bandwidth constraints; attention as a learned allocation of limited capacity.

**Where it sits.** The popular-press cousin, Tishby-flavoured. Accessible, correct, light on operational consequence.

**Verdict.** The readability benchmark. If the parent piece isn't clearer and more useful than this, it isn't earning its keep. It is the bar to clear.

### Goldman — *Hallucinations in Noisy Channels* (GitHub working document, v1.2.2, 2025–26)

**What.** An independent, single-author working framework that runs the same source-coding/channel-coding duality: training as compression, inference as transmission (the LLM as "teacher"). Models hallucination as relaxation toward a maximum-entropy form prior, P(hallucination) ∝ exp(S_form − S_knowledge), with a free-energy analogy F = E − T·S. Six failure mechanisms, twenty-six testable predictions. Explicitly marked a year from stable.

**Where it sits.** Parallel independent discovery of the duality, aimed at hallucination rather than session management. The thermodynamic lens (temperature, free energy) is a different metaphor for overlapping phenomena.

**Verdict.** Convergence evidence. When two efforts land on source-coding-for-training / channel-coding-for-inference from different starting points (hallucination vs. session cost), the duality is ambient, not invented. Cite as proof the frame is in the air; don't compete with it on the thermodynamic angle, which is Goldman's.

---

## The shoulders

Everything above stands on two.

**Shannon (1948)** — *A Mathematical Theory of Communication.* The wellspring. Source coding, channel coding, rate-distortion (the 1959 sequel). Every entry drinks here.

**Tishby, Pereira & Bialek (1999); Tishby & Zaslavsky (2015)** — the information bottleneck principle. The rate-distortion-for-representations move that Colaco, QUITO-X, and the Medium series all extend. The bridge between Shannon and deep learning.

---

## The verdict — and where the moat actually is

Read together, the piles say this: the information-theoretic mapping is **shared ground, arrived at independently and recently.** The formalizers (Colaco, Girish, Kim) prove the compaction mechanism and the query-conditioning gap. The channel framers (Ouyang, Bai) legitimate the regime. The adjacent work (QUITO-X, de Andrade, *When Less is More*) supplies vocabulary and cautionary limits. The parallel discoverers (Goldman; the Medium series) confirm the idea is ambient.

What **no entry in the search** assembles is the *operating discipline*: the re-send-every-turn observation turned into the explanatory frame for session degradation, the newup read as adaptive re-encoding before the source rate crosses capacity, and the whole thing tied to a cost-and-variance arbitrage — *cheaper sessions, lower variance, over anything else.* The frame is not the moat; the frame is ambient. The practice is the moat. This bibliography exists to make that distinction honest, so the sculpting can engage with the neighbours rather than pretend to invent them.

---

## Chum-the-waters titles

The arbitrage framing lets the bait go harder. The earlier titles pointed at the frame; these point at the edge.

- "The only arbitrage left is cheaper sessions"
- "Shannon's $46 theorem"
- "Your agent forgets. That's the edge."
- "Bounded context is the last moat"
- "Lower variance, lower cost — a 1948 arbitrage"

The first is the chummiest; the last is the one a quant clicks.

---

*Part of the [Edinburgh Protocol](https://github.com/pjsvis/cool-pi-extensions) series. Companion to [The Context Window Is a Noisy Channel](2026-07-20-the-context-window-is-a-noisy-channel.md). The arbitrage is cheaper sessions, lower variance, over anything else; the literature confirms the mechanism and legitimate the regime; the operating discipline is the moat.*
