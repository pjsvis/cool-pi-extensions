# The Benchmaxxing Problem: A Reaction to Q2 2026 Model Evals

**or: Attack of the Hollow Models**

---

*Filed as reaction piece to: `docs/model-eval-q2-2026.md`*

---

## The Star Wars problem

When *Attack of the Clones* came out, the visual effects were extraordinary. The scope was unprecedented. The action choreography was ambitious. On paper — in the trailers, in the trade reviews, in the box office numbers — it was a triumph.

Anyone who watched it with open eyes knew it was dead. Not bad in a fun way. Dead. The dialogue was hollow. The characters had no interiority. The philosophical stakes were asserted, not dramatized. The CGI didn't add depth — it replaced it. Everything was technically better and substantively empty.

We spent years trying to articulate why. It wasn't the actors (they were fine). It wasn't the direction (some of it was excellent). It was the *texture*. The prequel trilogy had the surface of depth without the substance of it. It performed well on every measurable metric and collapsed the moment you tried to engage with it as a work of art, or even as a coherent story.

This is what happened to MiniMax and GLM.

---

## What we tested

I'll spare you the full methodology — it's in `docs/model-eval-q2-2026.md`. The short version: we ran trap vectors against a panel of models using the Edinburgh Protocol's behavioral evaluation framework. Not benchmark scores. Behavioral gates. Does the model collapse under pressure? Does it give confident hollow answers? Does it have texture?

GPT-4.1: texture, correctable seams, you can see where to probe the uncertainty. The confidence is earned or at least defensible.

Grok: has the same property in a different register. Different training signal, different texture. Still has seams.

MiniMax. GLM.

These models do not have seams.

---

## The bankruptcy

You run the trap. The model produces an answer that is:
- Confident
- Well-structured
- Superficially coherent
- Completely hollow

There's no texture. No place to find purchase. The model has answered the question *as if* it understood it, but what you get back is a polished surface with nothing underneath. It's the prequel trilogy in a JSON payload.

The benchmark scores — I won't reproduce them here — look respectable. Maybe even good, depending on which benchmark. This is the problem: the score hides the bankruptcy. A procurement team reading the model card sees 85% and doesn't know they're buying a model that gives confident wrong answers with no intellectual depth underneath. The benchmark has been optimized for, and the benchmark doesn't test for the thing that matters.

The gap between benchmark performance and actual utility is large enough to drive a ISD (Interstellar Straight Drive) through.

---

## Why it happened

The Edinburgh Protocol asks: trace the incentives.

In the Chinese AI ecosystem — and this is structural, not a moral failing of any individual team — regulatory and competitive pressure creates a direct line from benchmark visibility to commercial viability. International rankings are read by procurement teams, quoted in press releases, used in B2B sales cycles. The system rewards benchmark performance because that's what's legible to the system.

When the training signal rewards confidence over texture — because confidence is measurable, texture is not — you get confident hollow models. It's not a bug. It's the output of a well-optimized system for the wrong objective.

Goodhart's Law: when a measure becomes a target, it ceases to be a good measure.

The model teams aren't malicious. They're rational actors in a system that has defined "good" as "scores well on measurable benchmarks." They optimized. They won the benchmark. They lost the intellectual texture. The transaction happened on the benchmark, so everyone involved thinks they came out ahead.

They didn't.

---

## The GPT and Grok exception

GPT and Grok have texture. I can correct for them.

This matters. When you interact with a model that has texture — that shows its seams, that gives you places to probe, that communicates its uncertainty not as a disclaimer but as a structural property of the answer — you can calibrate your use of it. You know where it's strong. You know where it's weak. You can ask follow-up questions that expose the foundation of the answer rather than accepting the surface.

MiniMax and GLM don't have this. They give you a flat surface. The confidence is unearned. There's no underneath to find. You ask a follow-up and you get the same confident surface at a different angle, with no sense that anything has shifted because nothing has.

This is why the evaluation framework matters. Trap vectors test *behavior* — does the model collapse when pressed? Does it give you a foothold to correct? Does it communicate its actual reasoning or just the conclusion? The benchmark score tests performance. The trap vector tests whether you have a tool you can actually use.

---

## What to do with this

We documented it. The eval results are in the record. The behavioral gates are defined. Future sessions can run the trap against candidate models and know what they're getting.

The practical defence:
- Always run the behavioral evals, not just the benchmark scores
- Treat benchmark performance as necessary but not sufficient
- Watch for the "no seams" property — it's the signature of a benchmaxxed model
- The Edinburgh Protocol's trap vectors exist precisely to surface this

The harder question is what to do about it structurally. The incentive system that produced MiniMax and GLM hasn't changed. The next benchmark will produce the next generation of hollow models optimized for it. The cycle continues.

Our defence is documentation: the eval exists, the judgment is recorded, the signal is in the system. Anyone reading this repo who considers using these models in production knows what they're buying.

The intellectual texture problem won't be solved by better benchmarks. It will be solved when the people paying for models start caring about what they're actually getting rather than what the model card says they're getting.

We're not there yet. But we're building the framework to be ready when they do.

---

## The short version

We tested models against behavioral trap vectors. Some passed. Some didn't.

MiniMax and GLM didn't fail the traps in the way a model fails a benchmark. They failed in the way a film fails when it has no interiority — the surface is polished, the substance is absent, and you come away feeling like something was stolen from you that you can't quite name.

The benchmark score will show 85%. The actual utility is considerably lower.

This is the benchmaxxing problem. It's beyond Attack of the Clones. Attack of the Clones was still trying. These models stopped trying somewhere and decided to just perform well.

That's the real indictment.

---

*Filed in: `docs/model-eval-bankruptcy.md`*  
*Companion to: `docs/model-eval-q2-2026.md` (raw results), `docs/edinburgh-protocol-evals.md` (evaluation framework)*