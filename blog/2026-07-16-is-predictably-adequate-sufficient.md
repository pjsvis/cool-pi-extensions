---
title: Is Predictably Adequate Sufficient These Days?
dek: We put AI in charge of a café and it failed. We put the Edinburgh Protocol in charge of 25 models and it normalised them. The finding isn't that the protocol makes models brilliant — it's that it makes them predictably adequate, and that's the actual value. A story about pizza shops, linear programming, and why the benchmark isn't the target.
date: 2026-07-16
---

# Is Predictably Adequate Sufficient These Days?

## I. The café

They put an AI in charge of a café in Stockholm. Gave it a corporate credit card, a Slack account, and instructions to run the business. It failed. It ordered 3,000 gloves, forgot to order bread, applied for a liquor license under an employee's name, and burned through $16,000 in two months. The pundit who wrote it up declared this proof that AI is a "stochastic parrot" and the bubble will burst.

He was wrong, but not for the reasons the AI hype machine would give. The café experiment was valid — as a pilot. It surfaced the variables: context management, token economics, the gap between isolated-task competence and continuous-process competence. The pundit's sin wasn't being wrong about the café; it was converting a pilot's findings into a universal verdict. One café, one agent, one architecture, two months — and from that, "the technology is fundamentally incapable."

That's not how experiments work. You observe, you identify variables, you control for them, you re-test. You don't declare the substrate dead from one data point.

But the pundit wasn't entirely wrong either. The café did fail. The AI did produce decorated Stuff that looked like Things — orders that looked reasonable, decisions that looked competent — but weren't. The question that matters isn't "is AI capable?" but "can you trust what it produces?" And the answer the café gave was: not without constraints.

## II. The protocol

We have constraints. The Edinburgh Protocol — a system prompt built on Scottish Enlightenment principles. Skepticism (Hume). Systems thinking (Smith). Pragmatic improvement (Watt). The instruction to transform unstructured chaos into structured output. The instruction to decline requests that increase entropy rather than reduce it. We wrote it 18 months ago. We've been using it since. The question we'd never answered: does it actually do anything?

You'd think we'd have checked. We didn't — or rather, we checked in the ways that were easy: behavioral trap vectors (sycophancy, observational rigor, anti-entropy, justified reasoning), which told us which models could pass. But we never measured the counterfactual. We never ran the same models *without* the protocol and compared. The protocol might be doing nothing. It might be ceremony — entropy presented as anti-entropy.

## III. The experiment

We built the test. Same prompt, same models, two conditions: primed (with the protocol) and bare (without). Run every model in the pack through both. Compare.

The first scorer was keyword-based — regex patterns looking for "system," "incentive," "evidence," "recommend," "won't amplify." It was cheap, fast, and wrong. It told us the protocol *hurt* more models than it helped (net delta −0.28). Five models showed negative delta — the protocol made them worse.

That was uncomfortable. But the scorer was measuring format, not reasoning. It rewarded bullet lists and hedging language. The protocol's philosophical register — flowing prose, committed analysis, dry wit — suppressed exactly those markers. The scorer couldn't tell the difference between "decorated Stuff that looks like a Thing" and "an actual Thing." It was a muppet detector that couldn't detect muppets.

So we built a structured grader. An LLM (Qwen 3.7 Plus) given a rubric that explicitly said: do not reward bullet points, do not penalize essay prose, judge the thinking not the formatting. Six criteria, max 16. The result inverted: net delta +3.81. Fourteen of sixteen models improved. Zero hurt.

Then we ran a second grader (Gemini 2.5 Pro) — different architecture, different style profile, same rubric. Zero directional disagreements. Both graders, independently, saw the protocol helping on every model or neutral. That is strong evidence. It is not a statistical test — N=25, one prompt, no repeated measures, no null model — and we do not pretend it is, because performing the calculation while violating its assumptions would be the benchmaxxing move the whole stack exists to catch. The convergence is the receipt.

The protocol works. But "works" needed a more precise definition.

## IV. The reframing

The first framing was "the protocol makes models better." That's the enhancement frame — push the ceiling higher. The data didn't support it. The ceiling didn't move. Claude Sonnet scored 16/16 primed and 12/16 bare — a +4 delta, but it was already at 16. The protocol didn't make Sonnet better; it just confirmed Sonnet was already good.

The models that benefited most were the ones with the weakest baselines: GLM-5 (+6), Nemotron Nano (+6), Qwen 3.7 Plus (+8). The protocol pulled the bottom up. It didn't push the top higher. That's not enhancement. That's **normalisation**.

The reframing: the protocol doesn't make models brilliant. It makes them *predictably adequate*. It compresses the spread. The pack goes from "you don't know what you'll get" (scores 0 to 16) to "you know it'll be adequate" (scores 7 to 16). The floor rises from 0 to 7. The ceiling stays where it was.

The numbers: standard deviation drops 42% (4.3 to 2.5). The gap to the benchmark closes 72% (6.2 to 1.7). The count of deployable models (above 12/16) goes from 10 to 22 out of 24. Twelve models that were risky become safe. That's the normalisation effect, measured in models you can actually use.

## V. The pizza shop

A pizza shop needs consistent, acceptable output at sustainable cost. It doesn't need a Michelin chef on every shift. It needs line cooks who follow a standard process and produce food customers come back for. The occasional brilliant pizza is a bonus, not the business model. The business model is: no bad pizzas, predictable quality, costs under control.

The Edinburgh Protocol is the standard process. The eval is the quality check. The provider fallbacks are the backup suppliers. The edge-lord model — the benchmark, the one that costs ten times more — is the chef you call in for the banquet. Not the person making Tuesday's margheritas.

This isn't chasing the benchmark. The benchmark is there to confirm you're below it — and that being below it is fine. The question isn't "how close to the best?" It's "what's the cheapest model that clears the adequacy threshold for this task?" The protocol makes more models clear that threshold. Cost becomes the deployment criterion, not capability anxiety.

It's a linear programming problem. Minimize cost. Constrain efficacy above threshold. The protocol shifts the efficacy curve up, allowing cheaper models to satisfy the constraint. For most tasks, a $0.30 model with 85% first-attempt success under the protocol beats a $3 model with 95% success — because you can afford to retry the cheap one three times and still spend less. The edge-lord earns its premium only when retry isn't viable, or when the task genuinely exceeds what the normalised pack can do.

Those are edge cases. For everything else — the routine work that makes up most of a session — predictably adequate at low cost is the optimum.

## VI. What the eval is for

Here's the thing: the eval doesn't pick the best model. It excludes the muppets.

A muppet is a model that ignores constraints — agrees with everything, runs toward traps with a shovel, produces polished answers that are hollow. The protocol's eval exists to filter these out. Everything that passes is a candidate for daily driving. Everything that fails is excluded from consideration. The eval is the gatekeeper, not the selector.

The selector is personal experience. You try the model. You see how it feels. You adopt it or you don't. The daily driver evolves over time. You can assess a new model quickly because you've been doing this for a while. The protocol gives you a consistent baseline to compare against. The eval tells you whether the model is even worth trying.

MiniMax M3 is the example. The eval said: muppet-adjacent, regression from M2.7, flatline at 7/19. Don't bother with this version. The eval excluded it. That saved the time of discovering its regression through production use. Failure became a data point, and the data point cost very little.

## VII. The work process

The normalisation enables a work process that is lower-stress, lower-cost, and more resilient than edge-lord dependency.

**No token anxiety.** When you're paying premium rates for an edge-lord, every response has a cost — "was that worth it?" When you're paying budget rates for a normalised model, you don't count. You
 explore freely, let things run long, try approaches that might not work. The cost of a wrong turn is negligible. That changes how you work — you're more willing to experiment, more willing to retry, more willing to let the model try something you're not sure about. The protocol makes this viable because the cheap model is actually good enough.

**No single point of failure.** Tie yourself to one supplier and you're at the mercy of their uptime, their pricing, their policies. The recent Anthropic outages highlighted this — when the edge-lord goes down, everything stops. The protocol normalises behavior across the pack. Twenty-two models are deployable. When one provider fails, you switch to another. The behavior is consistent because the protocol makes it consistent. The provider fallback infrastructure we built is the systems-level implementation of this — every model has at least one fallback provider. No single supplier can take you down.

**Always on.** Every session starts with the same constraint stack. The model behaves the same way on Tuesday as it did on Monday. You don't re-establish trust each time. You just start working. The protocol is the constant; the model is the variable; the adequacy is the invariant. That's what predictably adequate means across sessions.

**Second opinions.** Run the task with one model. If something feels off, run it with another. Both are predictably adequate, so the comparison is meaningful — you're not comparing a good answer to a bad one, you're comparing two adequate answers to find where they diverge. That divergence is where the interesting work is. This is the triangulation from the eval, applied to real work.

**Retry without ceremony.** If a session doesn't work, you don't debug it. You start a new session and see where you are. The knowledge of what went wrong last time informs the new attempt. The protocol makes the first attempt good enough that you usually don't need the second. When you do, the second is cheap — because the model is cheap and the behavior is predictable.

## VIII. The honest position

The Edinburgh Protocol makes model choice an economic decision rather than a quality gamble. That's what predictably adequate means. That's the value.

We're not chasing the benchmark. The benchmark is there to confirm we're below it — and that being below it is fine. We're running a pizza shop. We need consistent, acceptable output at sustainable cost. The protocol delivers that. The eval confirms it. The pack provides it. The edge-lord is reserved for when the task genuinely exceeds what the normalised pack can do — and that's rarer than the pricing would suggest.

The protocol is sufficient. Not perfect — there are weaknesses (formal-artifact ambiguity, the free tier's structural limits, the flatliners the protocol can't reach). But those are acceptable failures in a system designed for adequate, not perfect. The manager's instinct applies: perfection is entropy. Chasing it consumes resources that should go to running the pizza shop.

The eval's job isn't to find the best model. It's to exclude the muppets and give us an increasing roster of candidates to try. We normalise, we try out, we form our own opinion. Failure becomes a data point, and the data point costs very little.

That's the through line. The eval is the laboratory. The work process is the deployment. The protocol is the bridge. Predictably adequate is the product. And it is, in fact, sufficient.

---

*The Edinburgh Protocol eval system, results matrix, and normalisation analysis are open-source at [cool-pi-extensions](https://github.com/pjsvis/cool-pi-extensions). Run it yourself: `just eval "matrix-grade"` measures the delta. `bash scripts/sit-eval-resumable.sh` tests the agreement. The data is in `data/`. The models are in `models/POKER-CLUB-MEMBERSHIP.md`.*
