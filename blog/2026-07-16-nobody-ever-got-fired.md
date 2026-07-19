---
title: Nobody Ever Got Fired for Hiring Anthropic
dek: The safe choice fallacy applied to AI models. Why inference arbitrage is the smart play, why managers default to the expensive brand, and why the Edinburgh Protocol's "no muppets" rule gives you the breadth to do better.
date: 2026-07-16
---

# Nobody Ever Got Fired for Hiring Anthropic

## The safe choice fallacy

Nobody ever got fired for hiring IBM. Then nobody ever got fired for hiring Microsoft. Now nobody ever gets fired for hiring Anthropic. The phrase updates, the instinct doesn't. The manager picks the expensive, recognized brand because it's defensible — if something goes wrong, "I chose the leader" is a shield. Nobody questions whether the leader was necessary. Nobody asks whether the task warranted a leader at all.

The safe choice is safe for the manager. It's not safe for the budget. An organization running its routine work through Claude at $3/$15 per million tokens, when a normalised model at $0.30/$2.50 would handle the same tasks adequately, is burning a 10× premium for psychological comfort. The comfort is real — the manager sleeps better — but the money is real too, and it's going out the door every day.

The smart kids know this. They do inference arbitrage — run the cheap model first, escalate to the expensive one only when the cheap one can't handle it. They don't advertise this because it sounds like cutting corners, and the safe-choice instinct is strong enough that "I used the cheap model" sounds like a risk even when it isn't. But the smart kids are right. The math is simple: if a $0.30 model succeeds 85% of the time under the protocol, and the expensive model succeeds 95%, the expected cost of success with retry on the cheap one is still a fraction of the expensive one's single attempt. For most tasks, arbitrage wins.

## What you need to do better than the safe choice

To do inference arbitrage responsibly — to justify it to a manager, a auditor, or yourself — you need four things. None of them are optional.

**Normalise against a reference.** You need a benchmark. Not to chase it — to confirm you're below it. Claude is the reference. The Edinburgh Protocol normalises every model toward it — compresses the spread, lifts the floor, makes the cheap model's output comparable to the benchmark's. Without normalisation, "the cheap model is good enough" is an opinion. With it, it's a measurement: the cheap model scores 14/16 under the protocol, the benchmark scores 16/16. Two points. For most tasks, two points doesn't justify 10× the cost.

**Selection criteria: no muppets.** This is the only rule. A muppet is a model that ignores constraints, agrees with everything, produces polished answers that are hollow. The eval exists to filter these out. Everything that passes is a candidate. Everything that fails is excluded — permanently, until the vendor releases a version that doesn't muppet. No other selection criteria. Not "best score." Not "most popular." Not "cheapest." Just: not a muppet.

**Fallbacks: multiple providers per model.** A model isn't a supplier. A model is software that runs on infrastructure. The same model is often available from multiple providers — ZenMux, OpenRouter, direct from the vendor. If you approve a model, approve it with fallbacks. When one provider goes down, another takes over. No single point of failure. This is the infrastructure-level version of "no muppets" — no muppet providers either.

**Breadth of choice.** "No muppets" as the only rule gives you breadth. You're not picking one model — you're maintaining a roster of everything that isn't a muppet. Twenty-two models, currently. New ones added as vendors release them and the eval approves them. The developer picks from the roster based on cost, speed, and personal preference. The manager doesn't pick at all. The manager approves the roster.

## The Derrida question

Before you eval a model, you ask a prior question: *should this model even be in our consideration set?*

This is the Derrida question — the same move applied to model selection that we apply to repositories. The Derrida question doesn't ask "is this model good?" It asks "does this model belong in the eval at all?" Is the vendor reputable? Is the model current? Is there a reason to believe it might not be a muppet? If the answer is no, or unclear, the model doesn't enter the eval. The eval's time and the grader's tokens are spent only on models that pass the existential check.

The Edinburgh Protocol is the normaliser. The Derrida question is the gatekeeper's gatekeeper. The eval is the quality filter. The manager is the approver. Together they form a pipeline that starts with "does this belong?" and ends with "is this on the roster?" — and at no point does anyone have to pick "the best model," because the best model is a taste decision, and taste is personal.

## How managers communicate this

Not with a memo that says "use the cheap model." That sounds like cutting corners, and it is cutting corners if there's no normalisation backing it. Managers communicate this with:

**An approved roster.** Not a single model — a list. "These models are vetted. These are not. Use the vetted ones." The list is public. The criteria are public. The eval results are public. Nobody is choosing in the dark.

**A budget review that asks the right question.** Not "why are we spending so much on AI?" but "are we spending on the right tier?" The manager who has a normalised roster can say: "these tasks are routine, use the budget tier. These are complex, use the premium. The eval confirms both are adequate." That's not cutting corners — that's matching the tool to the job.

**A procurement policy that requires the eval.** "No model enters production without passing the Edinburgh Protocol eval." That's the governance. It's not "use Claude." It's "use anything that isn't a muppet, and here's how we know."

## The honest position

"Nobody ever got fired for hiring Anthropic" is
 true. It's also the problem. The safe choice is safe for the manager and expensive for the organization. The Edinburgh Protocol doesn't make the safe choice wrong — Claude is the benchmark for a reason. It makes the cheaper choices safe enough that the safe choice stops being the default.

You need four things: normalisation against a reference, a selection criterion that's just "no muppets," provider fallbacks for every model, and breadth of choice maintained as a roster. The protocol normalises. The Derrida question gates the gate. The eval filters. The manager approves.

That's how you stop burning money without anyone noticing. Not by telling people to use cheaper models — by giving them a roster of cheaper models that are predictably adequate, and letting inference arbitrage happen naturally because the cheap option is no longer a gamble.

The smart kids are already doing it. The question is whether the organization makes it official — or waits until the ashes show up.

---

*Part of the [Edinburgh Protocol](https://github.com/pjsvis/cool-pi-extensions) series. The eval, the roster, and the normalisation analysis are in the repository. Run it yourself. Give your manager a defensible alternative to the safe choice.*
