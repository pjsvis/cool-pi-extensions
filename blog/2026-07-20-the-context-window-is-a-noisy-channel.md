---
title: The Context Window Is a Noisy Channel
dek: On every turn the entire transcript is re-sent through a finite-capacity channel. Shannon said what happens next — and the newup discipline is just keeping the source rate under the capacity before reliable transmission fails.
date: 2026-07-20
---

# The Context Window Is a Noisy Channel

## The reframe

The context window is a noisy channel of finite capacity, and on every turn the entire transcript is re-sent through it. Say that sentence to anyone who's read Shannon and the rest follows in about thirty seconds — obvious in retrospect, which is the signature of a frame that's actually doing work.

## The mapping

Shannon's 1948 picture: a source, a transmitter, a channel, a receiver. The source produces a message with entropy H — the irreducible information, the surprise per symbol, what you couldn't have predicted. The channel has capacity C. The noisy-channel coding theorem: transmit reliably below C, unreliably above it. The source-coding theorem: you can't losslessly compress below H; natural language runs roughly half-redundant, which is why you can drop half a sentence and still reconstruct it.

Lay the LLM session over that:

- **The conversation is the source.** Its Shannon entropy — the actual load-bearing information — is tiny next to its byte count. Most of a long transcript is redundancy: re-sent context, abandoned branches, pleasantries, the same constraint stated four times. Useful on first pass (it's what lets the model tolerate noise), pure cost on every subsequent pass.

- **The context window is the channel**, with finite capacity C — attention budget, not just token slots. Every turn re-transmits the whole source, so the source rate isn't fixed; it *grows* with the session. This is the O(n²) cost pathology, and it's also the capacity pathology: as the transcript swells, R climbs toward C, and the theorem says what happens at the boundary — reliable reconstruction degrades. The model doesn't get dumber near the top of its context. The channel gets over-driven.

- **The handoff is lossy compression at a chosen distortion.** Source coding forbids beating H losslessly. Rate-distortion theory says: tolerate distortion D, compress to R(D). The handoff accepts distortion — raw transcript, exact phrasings, dead branches gone — in exchange for a much lower rate. And it's *optimal* compression at that distortion, not a failure: you pay exactly for the loss you accepted. The Edinburgh claim, sharpened: the *decisions* are the low-distortion region (preserve near-losslessly); the *history* is the high-redundancy region (compress aggressively). That's the precise form of "decisions, not history."

- **Enough context** is the Shannon question, now answerable: the minimum compressed message M such that I(M; decisions) — the mutual information between your context and the load-bearing state — is sufficient to reconstruct those decisions at acceptable distortion. Not a token count. A mutual-information condition. Five hundred lines of handoff that's high-mutual-information with the decisions beats fifty thousand tokens of transcript that isn't. *Structure, not volume* is the Shannon-rigorous version of the slogan. Stuff-into-Things is source coding.

## What it predicts

Two things, both observed.

One: the pathologies are asymmetric because the failure modes sit on opposite sides of the channel. Too little context is R too low for the distortion you need — the receiver can't reconstruct, output is wrong, caught in review. Loud. Too much context is R approaching C — reliable transmission degrades, cost bleeds, the model quietly elides detail. Quiet. The intuition "more is safer" assumes context = signal. Shannon's correction: context = signal + noise, and once you're near capacity the marginal token is mostly noise. The $46 lesson is a capacity-exceeding event, diagnosed in retrospect, exactly as the theorem would predict.

Two: the fix has the right *shape*. Newup isn't forgetting — it's adaptive re-encoding. You re-compress to near-H *before* R crosses C, while still in the reliable regime, rather than letting the buffer overflow. That's how you'd engineer any system against a hard capacity limit: compress at intervals, don't wait for the cliff. The locus tags are the sync markers — cheap overhead, high recovery value, the frame-sync words that let the next receiver lock onto phase boundaries without re-parsing the stream.

This also names what *predictably adequate* actually is, in Shannon terms. The discipline doesn't raise C — the ceiling, the model's raw ability, stays. It raises the *operating reliability below C* by keeping R comfortably under it. Variance compresses because you stop flirting with the R > C cliff where behavior goes erratic. The floor rises because you stop living near it. Same machine, better-engineered operating point.

## Where it strains

Shannon built the theory for a wire from A to B; an LLM context window isn't strictly a transmission channel, it's a working memory re-read each turn. The bridge is that this re-reading *is* a re-transmission — the whole context is re-processed — which makes the channel framing load-bearing rather than decorative. The model isn't a clean decoder; it's a stochastic predictor, and the reliable/unreliable threshold isn't sharp the way the theorem is. I'm using entropy and rate in the engineering sense (as people do when they say "the information content of this file"), not proving a theorem. The honest claim: Shannon's frame *describes* the regime, *predicts the direction* of the pathology, and *justifies the shape* of the fix. An explanatory isomorphism, not a derivation. To claim more would be decorated Stuff.

## Neighbours in the wild

This frame is not novel — it is an idea whose time has come, and the wild has been arriving at it from several directions. The honest accounting, because the sculpting should engage with these rather than pretend to invent them:

- **"LLMs as Noisy Channels: A Shannon Perspective on Model Capacity and Scaling Laws"** (Ouyang et al., ICML 2026) models the LLM as a Shannon-Hartley channel, mapping parameters to bandwidth and tokens to signal. The closest frame in spirit — but it operates on *training* (scaling laws, catastrophic overtraining, quantization degradation), not on the inference-time operating regime of re-sending the transcript every turn.

- **"What to Keep, What to Forget: A Rate–Distortion View of Memory Compaction in LLMs and Agents"** (Colaco & Lahjouji) is the closest in substance. It unifies KV-cache, prompt, architectural, and agent-memory compaction under one rate-distortion objective, derives a data-processing lower bound, and names reversibility and query-conditioning as the properties that decide method quality. It even predicts that repeated irreversible summarization compounds error super-linearly. The handoff-as-lossy-compression move is essentially theirs, formalized. What this piece adds is the *channel-capacity* framing of the conversation itself (not the memory layer) and the operational newup discipline as keeping R under C.

- **"Fundamental Limits of Prompt Compression: A Rate-Distortion Framework"** (Girish et al., EPFL/UT Austin) proves the query-aware vs query-agnostic mutual-information gap empirically — the cleanest confirmation that conditioning on the query shifts the accuracy-ratio curve by H(Q), exactly the quantity the survey above charges for not knowing the query.

- **"Forget BIT, It is All about TOKEN: Towards Semantic Information Theory for LLMs"** (Bai, Huawei) models the LLM as a discrete-time channel with feedback and state, using directed information and rate-distortion across pretraining, post-training, and inference — a theoretical backbone for the whole field.

- **"Polynomial Context-Truncation Sensitivity… Sequential Wyner–Ziv Bounds for KV Cache Compression"** (Kim) casts KV-cache compression as sequential Wyner–Ziv source coding and finds polynomial (not geometric) truncation sensitivity — the channel-decay structure under the compaction frame.

- **"Channel Capacity. Why Every Model Has a Ceiling"** (Eleventh Hour Enthusiast, Medium) is the popular-press cousin: context windows as capacity limits, attention as a learned solution to the bottleneck. Closer to the Tishby information-bottleneck line than to the operating-regime argument here.

- **"Hallucinations in Noisy Channels"** (Goldman, working doc) independently runs the training-as-source-coding / inference-as-channel-coding duality, with P(hallucination) ∝ exp(ΔS). A parallel independent articulation.

The honest summary: the information-theoretic mapping is shared ground, arrived at independently and recently. What is specific to this piece is the *operating-regime* synthesis — the re-send-every-turn observation turned into the explanatory frame for session degradation, the newup discipline read as adaptive re-encoding before R crosses C, and the link to *predictably adequate* as engineering for the floor rather than the ceiling. The pieces are in the wild; the assembly into a management discipline is ours.

## Titles

Since the clickbait was asked for — the frame does the work, the title just points at it:

- "Claude is a noisy channel (Shannon knew in 1948)"
- "What Shannon would say about Claude's $46 habit"
- "The context window is a telephone wire"
- "Why your LLM forgets: a 1948 explanation"
- "Bounded context isn't a vibe — it's channel capacity"

The first is the truest; the last is the one a working engineer clicks.

---

*Part of the [Edinburgh Protocol](https://github.com/pjsvis/cool-pi-extensions) series. The session-newup discipline is documented in the repo's `AGENTS.md`; the $46 lesson is in `blog/2026-07-18-token-minimisation.md`. The Shannon frame is not original — see "Neighbours in the wild" above — but the assembly into an operating discipline is. Run it yourself. Watch your meter.*
