---
title: The Manager's Job
dek: Your employees are burning money on AI models you didn't approve, and you won't know until you see the ashes. Here's how to turn the chip pan fire into a pizza shop.
date: 2026-07-16
---

# The Manager's Job

## What managers are doing right now

Nothing, probably. Or rather: nothing about AI model selection. Employees are using whatever model they found on Twitter, whatever their friend recommended, whatever the IDE plugin defaulted to. Some are paying $20/month for a chat subscription and burning through tokens on tasks a $0.30 model would handle. Some are using a free model that's a muppet — agreeing with everything, producing polished answers that are hollow, running toward traps with a shovel. The manager doesn't know. The manager won't know until the invoice arrives, or until the muppet's output causes a problem that surfaces in a code review or a customer complaint.

By then it's a chip pan fire. You're trying to keep the lid on it — reactive, panicked, putting out cost overruns and quality issues after the fact. The employees didn't do anything wrong. They used what was available. The problem is that nobody curated what was available.

## The alternative

Run a pizza shop instead.

A pizza shop doesn't let each line cook bring their own ingredients from home. It doesn't let them decide on the fly whether to use the expensive imported mozzarella or the domestic stuff. It has a roster of approved suppliers, a standard process, and a quality check. The cooks work within the system. The system produces consistent, acceptable output at sustainable cost. That's the job.

The Edinburgh Protocol eval system gives a manager that job. Not the job of picking the best model — that's a taste decision, and taste is personal. The job of **approving the roster**.

## Three gates, three roles

| Role | Gate | Decision |
|---|---|---|
| Manager | Approval | Is this model worth adding to the roster? |
| Eval | Quality | Is this model a muppet? |
| Developer | Experience | Does this model work for me? |

The manager runs the eval. The eval excludes muppets. The developer tries the survivors and adopts what works. The protocol normalises behavior so the developer's choice doesn't create chaos — swap models between sessions, swap providers when one goes down, the adequacy holds.

No single point of decision. No single point of failure.

## Why this is a job for managers

The eval makes it cheap. New model drops — run the scripts, read the table, say yes or no. The scripts are resumable. The logs are append-only. The results are tabulated automatically. Two independent graders confirm the finding. A sign test gives a p-value. The whole cycle takes an afternoon, not a sprint. The cost is negligible — free graders, budget test models, append-only data.

The manager doesn't need to be a data scientist. They need to read a table that says "Full Member" or "Denied" and understand the difference. The eval does the technical work. The manager does the governance work. That's the separation that makes it scalable.

## What the manager is actually preventing

**Token fires.** An employee using an edge-lord model at $3/$15 for routine work that a $0.30 model would handle. The cost difference is 10× — over a month of daily use, that's the difference between a rounding error and a budget line item. The protocol normalises the cheap model to adequate. The manager approves the cheap model. The employee uses the cheap model. The fire never starts.

**Muppet output.** An employee using a model that passes every prompt through a sycophancy filter — agrees with everything, produces decorated Stuff that looks like a Thing but isn't. The eval catches this. The manager excludes the model. The employee never encounters the muppet. The fire never starts.

**Single-supplier dependency.** An employee locked to one provider. The provider goes down — everything stops. The provider raises prices — you pay. The protocol normalises behavior across the pack. The manager approves multiple providers with fallbacks. When one fails, another takes over. The fire never starts.

## The honest pitch

You don't need the best model. You need models that aren't muppets, at prices that don't require justification, with fallbacks that keep you running when a provider has a bad day. The eval gives you the roster. The protocol gives you the normalisation. The manager gives the approval. The developer gives the selection.

That's the pizza shop. Consistent, acceptable output at sustainable cost. No chip pan fires. The manager's job is to keep it that way — approve models, exclude muppets, maintain the roster. The eval makes that job cheap enough to actually do.

The alternative is what managers are doing right now: nothing, until the ashes show up.

---

*Part of the [Edinburgh Protocol](https://github.com/pjsvis/cool-pi-extensions) series. The eval system, results matrix, and normalisation analysis are in the repository. Run it yourself. Give your manager a job.*
