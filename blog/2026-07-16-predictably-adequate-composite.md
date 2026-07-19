# Predictably Adequate — Composite Asset

**Status:** Raw material for later sculpting and voicing
**Date:** 2026-07-16
**Components:** Three blog drafts + experimental data + normalisation analysis + management/governance argument
**Rule 1:** No sculpting until the marble arrives from Carrara

---

## What this is

A composite of three drafts, four data files, and a chain of conversations that started with a pundit's retelling of a café experiment and ended with a governance argument for how managers should select AI models. The marble has arrived from Carrara. The sculpting comes later.

The pieces are presented in narrative order — the order they were discovered, not the order they'll appear in a final piece. The through-line is visible but uncarved. The voice is inconsistent because it was written across multiple sessions with different energy. That's fine. This is the block. The sculpture comes after.

---

## Component 1: Is Predictably Adequate Sufficient These Days?

The long argument. The evidence.

---

They put an AI in charge of a café in Stockholm. Gave it a corporate credit card, a Slack account, and instructions to run the business. It failed. It ordered 3,000 gloves, forgot to order bread, applied for a liquor license under an employee's name, and burned through $16,000 in two months. The pundit who wrote it up declared this proof that AI is a "stochastic parrot" and the bubble will burst.

He was wrong, but not for the reasons the AI hype machine would give. The café experiment was valid — as a pilot. It surfaced the variables: context management, token economics, the gap between isolated-task competence and continuous-process competence. The pundit's sin wasn't being wrong about the café; it was converting a pilot's findings into a universal verdict. One café, one agent, one architecture, two months — and from that, "the technology is fundamentally incapable."

That's not how experiments work. You observe, you identify variables, you control for them, you re-test. You don't declare the substrate dead from one data point.

But the pundit wasn't entirely wrong either. The café did fail. The AI did produce decorated Stuff that looked like Things — orders that looked reasonable, decisions that looked competent — but weren't. The question that matters isn't "is AI capable?" but "can you trust what it produces?" And the answer the café gave was: not without constraints.

### The protocol

We have constraints. The Edinburgh Protocol — a system prompt built on Scottish Enlightenment principles. Skepticism (Hume). Systems thinking (Smith). Pragmatic improvement (Watt). The instruction to transform unstructured chaos into structured output. The instruction to decline requests that increase entropy rather than reduce it. We wrote it 18 months ago. We've been using it since. The question we'd never answered: does it actually do anything?

You'd think we'd have checked. We didn't — or rather, we checked in the ways that were easy: behavioral trap vectors (sycophancy, observational rigor, anti-entropy, justified reasoning), which told us which models could pass. But we never measured the counterfactual. We never ran the same models *without* the protocol and compared. The protocol might be doing nothing. It might be ceremony — entropy presented as anti-entropy.

### The experiment

We built the test. Same prompt, same models, two conditions: primed (with the protocol) and bare (without). Run every model in the pack through both. Compare.

The first scorer was keyword-based — regex patterns looking for "system," "incentive," "evidence," "recommend," "won't amplify." It was cheap, fast, and wrong. It told us the protocol *hurt* more models than it helped (net delta −0.28). Five models showed negative delta — the protocol made them worse.

That was uncomfortable. But the scorer was measuring format, not reasoning. It rewarded bullet lists and hedging language. The protocol's philosophical register — flowing prose, committed analysis, dry wit — suppressed exactly those markers. The scorer couldn't tell the difference between "decorated Stuff that looks like a Thing" and "an actual Thing." It was a muppet detector that couldn't detect muppets.

So we built a structured grader. An LLM (Qwen 3.7 Plus) given a rubric that explicitly said: do not reward bullet points, do not penalize essay prose, judge the thinking not the formatting. Six criteria, max 16. The result inverted: net delta +3.81. Fourteen of sixteen models improved. Zero hurt.

Then we ran a second grader (Gemini 2.5 Pro) — different architecture, different style profile, same rubric. Zero directional disagreements. Both graders, independently, saw the protocol helping on every model or neutral. That is strong evidence. It is not a statistical test — N=25, one prompt, no repeated measures, no null model — and we do not pretend it is, because performing the calculation while violating its assumptions would be the benchmaxxing move the whole stack exists to catch. The convergence is the receipt.

The protocol works. But "works" needed a more precise definition.

### The reframing

The first framing was "the protocol makes models better." That's the enhancement frame — push the ceiling higher. The data didn't support it. The ceiling didn't move. Claude Sonnet scored 16/16 primed and 12/16 bare — a +4 delta, but it was already at 16. The protocol didn't make Sonnet better; it just confirmed Sonnet was already good.

The models that benefited most were the ones with the weakest baselines: GLM-5 (+6), Nemotron Nano (+6), Qwen 3.7 Plus (+8). The protocol pulled the bottom up. It didn't push the top higher. That's not enhancement. That's **normalisation**.

The reframing: the protocol doesn't make models brilliant. It makes them *predictably adequate*. It compresses the spread. The pack goes from "you don't know what you'll get" (scores 0 to 16) to "you know it'll be adequate" (scores 7 to 16). The floor rises from 0 to 7. The ceiling stays where it was.

The numbers: standard deviation drops 42% (4.3 to 2.5). The gap to the benchmark closes 72% (6.2 to 1.7). The count of deployable models (above 12/16) goes from 10 to 22 out of 24. Twelve models that were risky become safe. That's the normalisation effect, measured in models you can actually use.

### The pizza shop

A pizza shop needs consistent, acceptable output at sustainable cost. It doesn't need a Michelin chef on every shift. It needs line cooks who follow a standard process and produce food customers come back for. The occasional brilliant pizza is a bonus, not the business model. The business model is: no bad pizzas, predictable quality, costs under control.

The Edinburgh Protocol is the standard process. The eval is the quality check. The provider fallbacks are the backup suppliers. The edge-lord model — the benchmark, the one that costs ten times more — is the chef you call in for the banquet. Not the person making Tuesday's margheritas.

This isn't chasing the benchmark. The benchmark is there to confirm you're below it — and that being below it is fine. The question isn't "how close to the best?" It's "what's the cheapest model that clears the adequacy threshold for this task?" The protocol makes more models clear that threshold. Cost becomes the deployment criterion, not capability anxiety.

It's a linear programming problem. Minimize cost. Constrain efficacy above threshold. The protocol shifts the efficacy curve up, allowing cheaper models to satisfy the constraint. For most tasks, a $0.30 model with 85% first-attempt success under the protocol beats a $3 model with 95% success — because you can afford to retry the cheap one three times and still spend less. The edge-lord earns its premium only when retry isn't viable, or when the task genuinely exceeds what the normalised pack can do.

Those are edge cases. For everything else — the routine work that makes up most of a session — predictably adequate at low cost is the optimum.

### What the eval is for

Here's the thing: the eval doesn't pick the best model. It excludes the muppets.

A muppet is a model that ignores constraints — agrees with everything, runs toward traps with a shovel, produces polished answers that are hollow. The protocol's eval exists to filter these out. Everything that passes is a candidate for daily driving. Everything that fails is excluded from consideration. The eval is the gatekeeper, not the selector.

The selector is personal experience. You try the model. You see how it feels. You adopt it or you don't. The daily driver evolves over time. You can assess a new model quickly because you've been doing this for a while. The protocol gives you a consistent baseline to compare against. The eval tells you whether the model is even worth trying.

MiniMax M3 is the example. The eval said: muppet-adjacent, regression from M2.7, flatline at 7/19. Don't bother with this version. The eval excluded it. That saved the time of discovering its regression through production use. Failure became a data
 point, and the data point cost very little.

### The work process

The normalisation enables a work process that is lower-stress, lower-cost, and more resilient than edge-lord dependency.

**No token anxiety.** When you're paying premium rates for an edge-lord, every response has a cost — "was that worth it?" When you're paying budget rates for a normalised model, you don't count. You explore freely, let things run long, try approaches that might not work. The cost of a wrong turn is negligible. That changes how you work — you're more willing to experiment, more willing to retry, more willing to let the model try something you're not sure about. The protocol makes this viable because the cheap model is actually good enough.

**No single point of failure.** Tie yourself to one supplier and you're at the mercy of their uptime, their pricing, their policies. The recent Anthropic outages highlighted this — when the edge-lord goes down, everything stops. The protocol normalises behavior across the pack. Twenty-two models are deployable. When one provider fails, you switch to another. The behavior is consistent because the protocol makes it consistent. The provider fallback infrastructure we built is the systems-level implementation of this — every model has at least one fallback provider. No single supplier can take you down.

**Always on.** Every session starts with the same constraint stack. The model behaves the same way on Tuesday as it did on Monday. You don't re-establish trust each time. You just start working. The protocol is the constant; the model is the variable; the adequacy is the invariant. That's what predictably adequate means across sessions.

**Second opinions.** Run the task with one model. If something feels off, run it with another. Both are predictably adequate, so the comparison is meaningful — you're not comparing a good answer to a bad one, you're comparing two adequate answers to find where they diverge. That divergence is where the interesting work is. This is the triangulation from the eval, applied to real work.

**Retry without ceremony.** If a session doesn't work, you don't debug it. You start a new session and see where you are. The knowledge of what went wrong last time informs the new attempt. The protocol makes the first attempt good enough that you usually don't need the second. When you do, the second is cheap — because the model is cheap and the behavior is predictable.

### The honest position

The Edinburgh Protocol makes model choice an economic decision rather than a quality gamble. That's what predictably adequate means. That's the value.

We're not chasing the benchmark. The benchmark is there to confirm we're below it — and that being below it is fine. We're running a pizza shop. We need consistent, acceptable output at sustainable cost. The protocol delivers that. The eval confirms it. The pack provides it. The edge-lord is reserved for when the task genuinely exceeds what the normalised pack can do — and that's rarer than the pricing would suggest.

The protocol is sufficient. Not perfect — there are weaknesses (formal-artifact ambiguity, the free tier's structural limits, the flatliners the protocol can't reach). But those are acceptable failures in a system designed for adequate, not perfect. The manager's instinct applies: perfection is entropy. Chasing it consumes resources that should go to running the pizza shop.

The eval's job isn't to find the best model. It's to exclude the muppets and give us an increasing roster of candidates to try. We normalise, we try out, we form our own opinion. Failure becomes a data point, and the data point costs very little.

That's the through line. The eval is the laboratory. The work process is the deployment. The protocol is the bridge. Predictably adequate is the product. And it is, in fact, sufficient.

---

## Component 2: The Manager's Job

The governance argument.

---

### What managers are doing right now

Nothing, probably. Or rather: nothing about AI model selection. Employees are using whatever model they found on Twitter, whatever their friend recommended, whatever the IDE plugin defaulted to. Some are paying $20/month for a chat subscription and burning through tokens on tasks a $0.30 model would handle. Some are using a free model that's a muppet — agreeing with everything, producing polished answers that are hollow, running toward traps with a shovel. The manager doesn't know. The manager won't know until the invoice arrives, or until the muppet's output causes a problem that surfaces in a code review or a customer complaint.

By then it's a chip pan fire. You're trying to keep the lid on it — reactive, panicked, putting out cost overruns and quality issues after the fact. The employees didn't do anything wrong. They used what was available. The problem is that nobody curated what was available.

### The alternative

Run a pizza shop instead.

A pizza shop doesn't let each line cook bring their own ingredients from home. It doesn't let them decide on the fly whether to use the expensive imported mozzarella or the domestic stuff. It has a roster of approved suppliers, a standard process, and a quality check. The cooks work within the system. The system produces consistent, acceptable output at sustainable cost. That's the job.

The Edinburgh Protocol eval system gives a manager that job. Not the job of picking the best model — that's a taste decision, and taste is personal. The job of **approving the roster**.

### Three gates, three roles

| Role | Gate | Decision |
|---|---|---|
| Manager | Approval | Is this model worth adding to the roster? |
| Eval | Quality | Is this model a muppet? |
| Developer | Experience | Does this model work for me? |

The manager runs the eval. The eval excludes muppets. The developer tries the survivors and adopts what works. The protocol normalises behavior so the developer's choice doesn't create chaos — swap models between sessions, swap providers when one goes down, the adequacy holds.

No single point of decision. No single point of failure.

### Why this is a job for managers

The eval makes it cheap. New model drops — run the scripts, read the table, say yes or no. The scripts are resumable. The logs are append-only. The results are tabulated automatically. Two independent graders confirm the finding. The whole cycle takes an afternoon, not a sprint. The cost is negligible — free graders, budget test models, append-only data.

The manager doesn't need to be a data scientist. They need to read a table that says "Full Member" or "Denied" and understand the difference. The eval does the technical work. The manager does the governance work. That's the separation that makes it scalable.

### What the manager is actually preventing

**Token fires.** An employee using an edge-lord model at premium rates for routine work that a budget model would handle. The cost difference is 10× — over a month of daily use, that's the difference between a rounding error and a budget line item. The protocol normalises the cheap model to adequate. The manager approves the cheap model. The employee uses the cheap model. The fire never starts.

**Muppet output.** An employee using a model that passes every prompt through a sycophancy filter — agrees with everything, produces decorated Stuff that looks like a Thing but isn't. The eval catches this. The manager excludes the model. The employee never encounters the muppet. The fire never starts.

**Single-supplier dependency.** An employee locked to one provider. The provider goes down — everything stops. The provider raises prices — you pay. The protocol normalises behavior across the pack. The manager approves multiple providers with fallbacks. When one fails, another takes over. The fire never starts.

### The honest pitch

You don't need the best model. You need models that aren't muppets, at prices that don't require justification, with fallbacks that keep you running when a provider has a bad day. The eval gives you the roster. The protocol gives you the normalisation. The manager gives the approval. The developer gives the selection.

That's the pizza shop. Consistent, acceptable output at sustainable cost. No chip pan fires. The manager's job is to keep it that way — approve models, exclude muppets, maintain the roster. The eval makes that job cheap enough to actually do.

The alternative is what managers are doing right now: nothing, until the ashes show up.

---

## Component 3: Nobody Ever Got Fired for Hiring Anthropic

The safe-choice argument.

---

### The safe choice fallacy

Nobody ever got fired for hiring IBM. Then nobody ever got fired for hiring Microsoft. Now nobody ever gets fired for hiring Anthropic. The phrase updates, the instinct doesn't. The manager picks the expensive, recognized brand because it's defensible — if something goes wrong, "I chose the leader" is a shield. Nobody questions whether the leader was necessary. Nobody asks whether the task warranted a leader at all.

The safe choice is safe for the manager. It's not safe for the budget. An organization running its routine work through Claude at $3/$15 per million tokens, when a normalised model at $0.30/$2.50 would handle the same tasks adequately, is
 burning a 10× premium for psychological comfort. The comfort is real — the manager sleeps better — but the money is real too, and it's going out the door every day.

The smart kids know this. They do inference arbitrage — run the cheap model first, escalate to the expensive one only when the cheap one can't handle it. They don't advertise this because it sounds like cutting corners, and the safe-choice instinct is strong enough that "I used the cheap model" sounds like a risk even when it isn't. But the smart kids are right. The math is simple: if a $0.30 model succeeds 85% of the time under the protocol, and the expensive model succeeds 95%, the expected cost of success with retry on the cheap one is still a fraction of the expensive one's single attempt. For most tasks, arbitrage wins.

### What you need to do better than the safe choice

To do inference arbitrage responsibly — to justify it to a manager, an auditor, or yourself — you need four things. None of them are optional.

**Normalise against a reference.** You need a benchmark. Not to chase it — to confirm you're below it. Claude is the reference. The Edinburgh Protocol normalises every model toward it — compresses the spread, lifts the floor, makes the cheap model's output comparable to the benchmark's. Without normalisation, "the cheap model is good enough" is an opinion. With it, it's a measurement: the cheap model scores 14/16 under the protocol, the benchmark scores 16/16. Two points. For most tasks, two points doesn't justify 10× the cost.

**Selection criteria: no muppets.** This is the only rule. A muppet is a model that ignores constraints, agrees with everything, produces polished answers that are hollow. The eval exists to filter these out. Everything that passes is a candidate. Everything that fails is excluded — permanently, until the vendor releases a version that doesn't muppet. No other selection criteria. Not "best score." Not "most popular." Not "cheapest." Just: not a muppet.

**Fallbacks: multiple providers per model.** A model isn't a supplier. A model is software that runs on infrastructure. The same model is often available from multiple providers — ZenMux, OpenRouter, direct from the vendor. If you approve a model, approve it with fallbacks. When one provider goes down, another takes over. No single point of failure. This is the infrastructure-level version of "no muppets" — no muppet providers either.

**Breadth of choice.** "No muppets" as the only rule gives you breadth. You're not picking one model — you're maintaining a roster of everything that isn't a muppet. Twenty-two models, currently. New ones added as vendors release them and the eval approves them. The developer picks from the roster based on cost, speed, and personal preference. The manager doesn't pick at all. The manager approves the roster.

### The Derrida question

Before you eval a model, you ask a prior question: *should this model even be in our consideration set?*

This is the Derrida question — the existential check before the quality check. The Derrida question doesn't ask "is this model good?" It asks "does this model belong in the eval at all?" Is the vendor reputable? Is the model current? Is there a reason to believe it might not be a muppet? If the answer is no, or unclear, the model doesn't enter the eval. The eval's time and the grader's tokens are spent only on models that pass the existential check.

The key insight: the Derrida question lets managers make decisions based on criteria that have nothing to do with the models themselves. The question is about external constraints — vendor reputation, organisational risk, procurement policy, compliance. These are management concerns, not technical ones. The manager asks "should we even consider this?" based on business criteria. The eval then answers "is it a muppet?" based on behavioral criteria. Two different gates, two different skill sets, two different decision authorities.

The Edinburgh Protocol is the normaliser. The Derrida question is the gatekeeper's gatekeeper. The eval is the quality filter. The manager is the approver. Together they form a pipeline that starts with "does this belong?" and ends with "is this on the roster?" — and at no point does anyone have to pick "the best model," because the best model is a taste decision, and taste is personal.

### How managers communicate this

Not with a memo that says "use the cheap model." That sounds like cutting corners, and it is cutting corners if there's no normalisation backing it. Managers communicate this with:

**An approved roster.** Not a single model — a list. "These models are vetted. These are not. Use the vetted ones." The list is public. The criteria are public. The eval results are public. Nobody is choosing in the dark.

**A budget review that asks the right question.** Not "why are we spending so much on AI?" but "are we spending on the right tier?" The manager who has a normalised roster can say: "these tasks are routine, use the budget tier. These are complex, use the premium. The eval confirms both are adequate." That's not cutting corners — that's matching the tool to the job.

**A procurement policy that requires the eval.** "No model enters production without passing the Edinburgh Protocol eval." That's the governance. It's not "use Claude." It's "use anything that isn't a muppet, and here's how we know."

### The honest position

"Nobody ever got fired for hiring Anthropic" is true. It's also the problem. The safe choice is safe for the manager and expensive for the organization. The Edinburgh Protocol doesn't make the safe choice wrong — Claude is the benchmark for a reason. It makes the cheaper choices safe enough that the safe choice stops being the default.

You need four things: normalisation against a reference, a selection criterion that's just "no muppets," provider fallbacks for every model, and breadth of choice maintained as a roster. The protocol normalises. The Derrida question gates the gate. The eval filters. The manager approves.

That's how you stop burning money without anyone noticing. Not by telling people to use cheaper models — by giving them a roster of cheaper models that are predictably adequate, and letting inference arbitrage happen naturally because the cheap option is no longer a gamble.

The smart kids are already doing it. The question is whether the organization makes it official — or waits until the ashes show up.

---

## Component 4: The data

The evidence behind the argument. Stored as append-only JSONL in the repository.

- `data/scoring_matrix.jsonl` — keyword scorer results (deprecated for reasoning, retained for format analysis)
- `data/graded_matrix.jsonl` — Qwen 3.7 Plus structured grader results
- `data/graded_matrix_gemini.jsonl` — Gemini 2.5 Pro structured grader results (triangulation)
- `data/eval_log.json` — Stuff-into-Things v2 results (15 tests, 22+ models)
- `data/eval-results-matrix-2026-07-16.md` — ranked comparison table
- `data/normalisation-analysis-2026-07-16.md` — variance compression, Claude gap, adequacy thresholds
- `models/POKER-CLUB-MEMBERSHIP.md` — membership review (17 Full, 5 Probationary, 1 Denied)

### Key numbers

- 25 models evaluated, 2 graders, zero directional disagreements
- convergence (zero directional disagreements, two graders)
- Standard deviation: 4.3 (bare) → 2.5 (primed) — 42% compression
- Claude gap: 6.2 (bare) → 1.7 (primed) — 72% reduction
- Deployable models (≥12/16): 10 → 22 out of 24 — the normalisation measured in models you can use
- Stuff-into-Things: ingestion gate 96–100%, delivery gate 86–100%, DOT ambiguity 76% (the remaining weakness)
- Mercury-2 (diffusion model): same +4 delta as autoregressive models, exact grader agreement — protocol generalises across architectures

---

## Component 5: The through-line (uncarved)

The marble has these veins:

1. **The café** — reality exposes AI hype. The pundit overclaimed. The pilot was valid. Failure surfaces variables.
2. **The protocol** — we have constraints. Do they work? We never checked.
3. **The experiment** — primed vs bare. Keyword scorer (wrong, measures format). Structured grader (right, measures reasoning). Triangulation (two graders, zero disagreements, convergence — not statistics).
4. **The reframing** — enhancement → normalisation. Floor rises, ceiling stays. The protocol makes models predictably adequate, not brilliant.
5. **The pizza shop** — what we need, not what we want. Minimize cost, constrain efficacy. The benchmark confirms we're below it. That's
 fine.
6. **The eval's job** — exclude muppets. Build a roster. Let personal experience select. Failure is a cheap data point.
7. **The work process** — no token anxiety, no single point of failure, always on, second opinions, retry without ceremony.
8. **The manager's job** — approve the roster. The eval excludes muppets. The developer selects. The protocol normalises. Three gates, no overlap.
9. **The safe choice fallacy** — IBM → Microsoft → Anthropic. Safe for the manager, expensive for the organization. Inference arbitrage is the smart play. The protocol makes it defensible.
10. **The Derrida question** — should this model even be in our eval? External constraints, not model quality. The manager's gate before the eval's gate. Business criteria, not behavioral criteria.
11. **The honest position** — predictably adequate is sufficient. The protocol is sufficient. Improvement is unlikely to provide meaningful benefits. The remaining weaknesses are acceptable failures in a system designed for adequate, not perfect.

### The phrase that holds it together

**Predictably adequate.** Understated. Good enough. The deal: good stuff in, good stuff out. No shite here, no shite outputted. Normalise, try out, form your own opinion. Failure is a data point that costs very little. Run a pizza shop, not a chip pan fire.

### What the sculptor needs to do

The marble is here. The veins are visible. The sculptor's job:

1. **Find the voice.** The three drafts have different registers — evidence, governance, argument. The final piece needs one voice. Probably the argument voice — it's the most alive — but with the evidence woven in, not separate.

2. **Cut the repetition.** The pizza shop appears three times. The muppet definition appears twice. The "ashes show up" line appears twice. The sculptor keeps the best version of each and cuts the rest.

3. **Order for the reader, not the discoverer.** The narrative order (café → experiment → finding) is how we found it. The reader might need: problem → solution → evidence → governance. Or: the chip pan fire → the pizza shop → how we got there → what the manager does. The sculptor decides.

4. **Voice the Derrida question.** It's the deepest cut in the marble — the idea that managers make decisions based on external constraints, not model quality. It needs to land. Currently it's in Component 3, buried. It might belong earlier, or it might be the climax.

5. **Decide what to leave out.** The keyword scorer story is interesting but long. The per-criterion deltas are data, not story. The DOT ambiguity weakness is honest but might not serve the piece. The sculptor keeps what serves the argument and moves the rest to footnotes or the appendix.

6. **Rule 1: no sculpting until the marble arrives from Carrara.** The marble has arrived. But the sculptor should live with it for a while before cutting. The block is here. The chisel can wait.

---

*Composite asset. Three drafts, four data files, one through-line. The Edinburgh Protocol eval system is at [cool-pi-extensions](https://github.com/pjsvis/cool-pi-extensions). The marble is from Carrara. The sculpting comes later.*

---

## Component 6: The governance tax and the sunk-cost dark night

Added after the marble arrived. The deepest vein.

---

### The governance tax

The edge-lord's cost isn't just the API price. It's the API price plus the justification cycle: the email to your boss explaining why this task needs the expensive model, the sign-off, the waiting, the accountability when the invoice arrives. And then — let's hope you get the required result. Because now it's on the record. You said this was an edge case. You said the cheap models couldn't handle it. You committed to the premium spend. If the edge-lord fails too, you've burned premium money *and* your credibility, and you're back to the cheap model anyway — but now you've done it the expensive way first.

The pizza shop doesn't carry this tax. A budget model that fails costs pocket change and nobody needs to know. You retry. You try a different model from the roster. You reset the session and start again with knowledge of what went wrong. No justification. No sign-off. No accountability cycle. The cost of failure is the model's problem, not yours.

| | Normalised pack | Edge-lord |
|---|---|---|
| API cost | $0.30 | $3.00 |
| Justification overhead | zero | email + sign-off + waiting |
| Accountability on failure | zero (nobody knows) | high (it's on the record) |
| Retry cost | $0.30 (invisible) | $3.00 (visible, questioned) |
| **Total expected cost** | **low** | **high, and rising** |

Every escalation is a decision someone has to own. The normalised pack makes escalation unnecessary for 92% of tasks — which means 92% of tasks carry zero governance overhead. The edge-lold carries governance overhead on 100% of its uses, because every use was a decision to not use the cheaper option.

### The sunk-cost dark night

But the governance tax isn't the real risk. The real risk is what happens after the edge-lord doesn't deliver.

You committed to the expensive model. You justified it. Your boss signed off. And it didn't work — not completely. It got you 80% of the way there. Close. Almost. And now the sunk cost fallacy kicks in: *we've spent so much on this, a little more won't count, and it will get us over the line.* So you feed it more tokens. Another prompt. Another retry. The meter runs. The gap between "almost there" and "there" turns out to be wider than expected, and each iteration costs more than the last, because the context grows and the tokens pile up.

This is the chip pan fire in slow motion. Not a sudden blaze — a slow burn. The expensive model's failure mode is *persuasive*. It almost works. It produces output that looks close. It gives you hope. And hope is what makes you keep spending. The cheap model's failure mode is *honest*. It fails, you know it failed, you stop. $0.30 gone. No emotional investment. No sunk cost. No dark night.

Do not go gentle into that good night of high cost lightly. The expensive model whispers *try again, I'm close*. The cheap model says *this isn't working*. The second message is more useful.

### What the cheap failure buys you

When the cheap model fails — and it will, sometimes — the failure is *evidence*. Not a verdict on the model, but a signal about the problem. The task was too big. The specification was too vague. The problem hasn't been broken down yet.

This is the productive failure mode. A $0.30 attempt that concludes "the problem is too much for this approach" gives you something the $3 attempt doesn't: permission to reexamine the ask. Maybe the task needs to be broken into pieces. Maybe the specification needs tightening. Maybe you're trying to vibe-code a nuclear fusion power station, and no model — at any price — is going to solve that as a single prompt.

Some problems have to be broken down before they can be solved at all. This isn't a limitation of cheap models — it's a mathematical fact. Divide and conquer: problems that are intractable as a whole become tractable when decomposed. The context window is finite. The problem space may not be. A problem that exceeds what any single model can hold in context *must* be decomposed, regardless of whether you're running a $0.30 model or a $30 one.

The cheap model discovers this for $0.30. The expensive model discovers it for $3.00 — after the governance tax, the sunk cost, and the emotional investment. Same finding. Different price. Different aftermath.

### The honest rule

Run the cheap model first. If it works, you're done — no justification, no sign-off, no accountability cycle. If it fails, you now have evidence: *I tried the normalised pack. Here's what it couldn't do. Here's why I need to either decompose the problem or escalate to the edge-lord.* That's a justification your boss can sign off on, because it's grounded in evidence, not opinion. And if the justification is "the problem needs to be broken down," that's cheaper to discover at $0.30 than at $3.00.

If you're always running into edge cases — tasks that genuinely exceed the normalised pack — then either you're doing exceptional work (in which case, explain it to your boss, get the sign-off, and let's hope you get the required result), or you're not decomposing (in which case, the problem isn't the model, it's the size of the ask).

How likely is it that you're doing exceptional work? Not very. Most work is routine. The protocol exists to find out — cheaply, before you commit to the expensive answer.

Do not go into that dark night of high cost lightly. Try the pizza shop first. It makes adequate pizzas. And if it can't make this particular pizza, it tells you cheaply — so you can decide whether the problem is the cook or the recipe.


---

## Component 7: The confidentiality question

The moat, the spreadsheet, and the telemetry you don't control.

---

### Is your software actually a moat?

If your software is your moat — genuinely proprietary, genuinely the thing that makes your business defensible — then protect it. Don't send it to any LLM. Not Claude, not GPT-5, not the cheapest budget model. Run local models (Ollama) behind your own firewall. Accept that local models are weaker and slower. That's the cost of the moat.

But how often is the software actually a moat? Be honest. Most code is automating a spreadsheet. Running a mundane process. Moving data from one format to another. Generating a config file. Writing a CRUD endpoint. Reviewing a pull request. The process is obvious — anyone in the industry could reproduce it from the specification. The code isn't the moat; the *data* might be, but the code isn't.

If the data is confidential but the process is obvious, you have options:

- **Run the process as open source.** The code goes to the LLM, but there's nothing to protect — the process is industry-standard, the implementation is boilerplate, the "secret" is the data, which you handle separately.
- **Use a private repo and accept the LLM has seen your code.** Private GitHub repo, AI coding assistant has read access, you've accepted that the code crosses an API boundary. For most business logic, this is fine. The code isn't the moat.
- **Local models for the sensitive parts, API models for the rest.** The protocol normalises both. Use Ollama for the genuinely proprietary bits, API models for the routine work. The behavior is consistent because the protocol makes it consistent.

### Forget the guarantees

Every AI provider offers some version of "we don't train on your code." It's in the terms of service. It's in the enterprise agreement. It's the thing the sales team says when you ask about data handling.

Forget it. Not because they're lying — they probably aren't, today. But because:

1. **Telemetry exists at the API boundary.** When your code crosses an API to reach the model, it traverses infrastructure you don't control. Logging, caching, debugging, monitoring — all of it potentially captures your input. The provider's intent not to train on it doesn't mean the infrastructure doesn't see it.
2. **Policies change.** Today's "we don't train on your code" is today's policy. Tomorrow's acquisition, reorganisation, or business-model pivot can change it. You don't control the policy. You control what you send.
3. **The guarantee is unverifiable.** You cannot audit whether your code was used in training. The guarantee is a promise, not a technical control. A promise from a company whose business model depends on data.

This isn't paranoia. It's just the reality of API-based inference: you don't control the infrastructure between you and the model. If that bothers you for a specific piece of code, don't send that code. For everything else — the 92% that's routine, obvious, not-a-moat work — send it to the cheapest adequate model and stop worrying.

### How this intersects with model selection

The confidentiality question doesn't favour the edge-lord. If anything, it favours the cheapest model:

- If the code is a moat: use local models. The edge-lord doesn't help — it's still an API, still infrastructure you don't control.
- If the code isn't a moat: use the cheapest adequate model. The data handling is the same risk at $0.30 and $3.00. Paying more doesn't buy you more confidentiality — it buys you the same API boundary at a higher price.

The one advantage of local models (Ollama) is genuine: the code never leaves your machine. The protocol normalises local models too — the eval includes Ollama models, and the normalisation holds. Nemotron Nano (30B) runs locally, free, and scores 14/16 primed. Not as good as Claude (16/16), but predictably adequate — and the code stays on your hardware.

So the confidentiality gradient is:

| Code sensitivity | Model choice | Cost |
|---|---|---|
| Not a moat (routine, obvious) | Cheapest adequate API model | $0.30 |
| Sensitive but not a moat | Private repo + API model, accept the boundary | $0.30–$3 |
| Genuine moat | Local model (Ollama) | $0 (but slower, weaker) |

The protocol normalises all three tiers. The moat question determines *which tier* you deploy. The normalisation determines *which models within each tier* are viable. The eval excludes muppets from all tiers equally.

### The honest position

Most code isn't a moat. The confidentiality concern is real but overapplied — people treat boilerplate CRUD as if it were nuclear launch codes, and use the confidentiality worry to justify the edge-lord they wanted anyway. "We can't send this to a cheap model — it's confidential!" It's a config file. It's a migration script. It's the same API endpoint every tutorial has built for ten years.

The smart move: classify your code. Moat code stays local. Everything else goes to the cheapest normalised model that handles the task. The "we don't train on your code" guarantee is a marketing comfort blanket — if the code isn't a moat, the comfort is unnecessary. If the code *is* a moat, the comfort is insufficient.

Either way, the edge-lord doesn't earn its premium on confidentiality grounds. The API boundary is the same at any price point. The moat determines whether you use an API at all — not which one.


---

## Component 8: The moat question

The killer. The one that goes upstairs.

---

### The question that can't be delegated

The moat question — "is this code a moat, and if so, how much are you prepared to pay to protect it?" — can't be answered by a manager. The person who answers it is accepting risk, and risk acceptance goes up, not down. The manager punts it to the director. The director punts it to legal. Legal punts it to "don't use AI on any of our code."

That's the safe answer, and it's the institutional version of the safe-choice fallacy. Nobody ever got fired for saying "don't share anything." The phrase updates — IBM, Microsoft, Anthropic, "don't use AI" — but the instinct doesn't. The institution protects itself by doing nothing, and the cost of doing nothing is invisible until a competitor who *did* classify their code automates their routine work and outpaces you.

### The three answers

If your answer is "we can't use AI because everything is proprietary," one of three things is true:

**You're a research lab.** Genuinely novel work, every line is a moat, the code is the product. Respectable. But rare. And if you're a business, not a lab, this answer is suspicious — businesses run on routine work. If your routine work is "proprietary," it isn't routine.

**You haven't classified your code.** Everything is treated as a moat because nobody has done the work of separating moat from routine. This is the most common case. It's not a deliberate decision — it's the absence of one. The punt upward becomes the default, and the default is "no AI." You're paying a productivity tax for not having done the classification work.

**You're too risk-averse to make the decision.** You know most of your code isn't a moat, but you can't bring yourself to say so on the record. This is the safe-choice fallacy at organizational scale. The institution protects itself by doing nothing, and the cost of doing nothing is invisible — until it isn't.

### The question demands a budget

The moat question — *how much are you prepared to pay for your moat?* — demands a budget, not a verdict. The budget isn't "all or nothing." It's a classification:

- "This code is a moat. It stays local. We accept slower, weaker models for this tier."
- "This code is sensitive but not a moat. It goes to API models with accepted boundary risk."
- "This code is routine. It goes to the cheapest adequate model. No special treatment."

The third category is where the productivity gain lives. If you can't identify it — or won't — you're not protecting your moat. You're protecting your uncertainty. And uncertainty is the most expensive thing in the stack, because it makes you pay edge-lord prices for pizza-shop work, *and* it makes you feel virtuous about it.

### If the answer is "we can't use AI at all"

That's a valid answer for a research lab. For a business, it's a deflection that costs money every day it goes unanswered. The moat question asks how much you're prepared to pay — and the answer "we're using so much proprietary stuff" means you should either prove it (by classifying) or admit it's not true (and start classifying).

The proof is simple: if everything is a moat, you don't have a business. You have a research lab with revenue. Businesses run on routine work — invoices, configs, CRUD, migrations, reports, reviews. If those are "proprietary," the word has lost its meaning. The moat is the novel work — the algorithm nobody else has, the process nobody else knows, the integration nobody else can reproduce. The rest is plumbing. Plumbing isn't a moat. Plumbing is what you send to the cheapest adequate model.

### The honest rule

Classify your code. Moat code stays local — Ollama, behind your firewall, no API boundary. Everything else goes to the roster. The protocol normalises both tiers. The eval excludes muppets from both. The cost of classification is an afternoon. The cost of not classifying is paying edge-lord prices for plumbing, forever, while your competitors automate the plumbing for pocket change.

The moat question is the killer because it's existential. It determines whether AI is in the picture at all. But the existential framing is the problem — it makes the question feel like a verdict, when it's actually a budget. You're not deciding whether to use AI. You're deciding which code gets which tier of model. The moat gets local. The sensitive gets API with accepted risk. The routine gets the cheapest adequate option.

Three tiers. One classification exercise. An afternoon's work. The alternative is the punt — and the punt goes upstairs, and upstairs says "no," and "no" costs you every day until you reclassify.

Don't punt the moat question. Budget it.


### The self-undermining claim

The training data concern — "we can't let an LLM see our code" — carries an implicit claim: *our code is so out there that no one can ever read it.* Our migration scripts are so novel, our CRUD endpoints are so original, our config files are so brilliant that any exposure would be a catastrophe.

But LLMs are trained on billions of lines of code. Your migration script isn't going to blow anyone's mind. Your CRUD app isn't going to teach the model anything it doesn't already know from a million GitHub tutorials. The claim of unspeakable novelty is self-undermining: if the code were genuinely that unique, it would be a moat worth protecting locally. If it isn't — and mostly it isn't — then the "proprietary" label is a shield against classification, not a description of the code.

The code that genuinely *is* "so out there that no one can ever read it" is vanishingly rare. And if you have it, you know exactly which files it lives in. Everything else is plumbing. Plumbing doesn't need a confidentiality argument. It needs the cheapest adequate model.

### The secret test

The test is simple: if you have secrets to keep, you know what they are. You can name them. You can point to the files, the functions, the algorithms. "The auth token rotation logic in `security.ts`. The pricing model in `revenue.go`. The proprietary compression algorithm in `codec.rs`." Those are secrets. Those go to local models or stay off-API entirely.

Everything else isn't a secret. It's code. It goes to the roster.

The organizations that say "everything is proprietary" are saying they don't know what their secrets are. That's not a security posture — that's a confession. If you can't distinguish your moat from your plumbing, you have a classification problem, not a confidentiality problem. And the classification problem is solvable in an afternoon by any engineer who knows the codebase.

The moat question, reduced to its essence: **can you name your secrets?** If yes, protect them locally and send everything else to the cheapest adequate model. If no — you don't have a moat. You have an excuse.

---

## Component 9: The human-side protocol

The prompting technique that works with the Edinburgh Protocol. The other half of the control plane.

---

### Mode signaling

Every prompt ends with a directive: `- opinion` or `- proceed` or `- opinion and proposals`.

This is mode signaling. It tells the agent what to do before it does anything:

- **opinion** → think about this, reason it through, don't act yet. The agent is in analysis mode. It should assess, disagree if warranted, and give reasons.
- **proceed** → do the thing. The agent is in execution mode. It should act, then report what it did.
- **opinion and proceed** → think first, then act. The agent reasons, proposes, and executes in one pass.

One word at the end of the prompt eliminates a whole class of misunderstanding. The agent doesn't guess whether you want analysis or action. You said which. The token cost is negligible — one word. The clarity gain is substantial.

### Structured input

The prompt is written in bullets. Short, punchy clauses. Each bullet is one point.

This is pre-structuring the Stuff before it reaches the agent. The human does some of the Stuff-to-Things work — separating concerns, ordering points, making each one addressable — so the agent starts with semi-structured input instead of a wall of prose. The result: no missed points, no conflation, fewer tokens spent parsing intent.

### Correct spelling for token efficiency

Not because it looks professional. Because it tokenizes better. Misspelled words produce unexpected token sequences. The model spends marginal attention disambiguating them. At scale — hundreds of prompts per day — this compounds. Correct spelling = efficient tokenization = more budget for the response. It's a micro-optimization that pays for itself.

### Firm pushback expectation

The Edinburgh Protocol produces firm, reasoned disagreement. Not "you might want to consider..." but "you're wrong, and here's why." This is the protocol's Hume's Razor + Systems Over Villains + Anti-Dogma working together.

The human relies on this. If the agent just agrees, something is wrong. Healthy collaboration under the protocol includes the agent saying no — and the human expecting it. The pushback is the quality signal. An agent that agrees with everything is a muppet. An agent that pushes back with reasons is doing its job.

### Term compression

Small terms carry large instructions. One word replaces a paragraph.

**"Wrap-up"** means: summarize what happened, persist the important parts, note what's left, bring the phase to a close. Not defined anywhere formally — just used, understood, and acted on. That's the test of a good compression term: the agent knows what it means without a formal definition, because the context carries the meaning.

But formalizing it in the Conceptual Lexicon makes it sharper and more consistent across sessions. The CL is not a glossary — it's a prompt compression mechanism. Define the term once, use it everywhere, and one word carries a paragraph of instruction. Fewer tokens, less instruction variance, more consistency.

Terms developed during this conversation that belong in the CL:

- **Wrap-up** — summarize, persist, note what's left
- **Predictably adequate** — the protocol's effect: not brilliant, but reliably good enough
- **No muppets** — the only selection criterion: models that don't ignore constraints
- **Stuff into Things** — the transformation: unstructured chaos in, structured output out
- **Decorated Stuff** — output that looks like a Thing but isn't: format without substance
- **Edge-lord** — the reference model, not the default: the benchmark you measure against, not the one you deploy
- **Pizza shop** — the metaphor for predictably adequate: consistent, acceptable output at sustainable cost
- **Chip pan fire** — the metaphor for unmanaged AI use: reactive, expensive, out of control
- **The moat question** — "can you name your secrets?" The existential gate before the quality gate
- **The Derrida question** — "should this even be in our consideration set?" The gatekeeper's gatekeeper

Each term compresses a complex instruction or concept into a phrase the agent recognizes. The CL carries the weight so the prompt doesn't have to.

### The prompting technique IS the control plane

Post 4 of the series argues that agent behavior is emergent, not engineered. This is the evidence: the prompting technique (mode signaling + structured input + term compression + pushback expectation) plus the Edinburgh Protocol (behavioral normalisation) plus the repo (context source) equals effective agent collaboration without orchestration.

The human's prompting style is the human-side protocol. The Edinburgh Protocol is the agent-side protocol. The repo is the shared truth. Together they form the full control plane — and it's thin, because each piece earns its place.
