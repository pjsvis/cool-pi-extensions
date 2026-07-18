---
title: Token Minimisation
dek: A long-running agent is not a long-running process. One costs O(n²). The other is just work. The manager's job is to know the difference — and the $46 session proves it.
date: 2026-07-18
---

# Token Minimisation

## The $46 session

Last week a single agent session cost **$46**. Nothing was on fire. No frontier model was being abused for vanity tasks. The work was ordinary — briefs, edits, commits. The bill was extraordinary.

The cause was structural, not spectacular: the session ran too long without a context reset. Every turn re-sent the full conversation history to the model. By the end, each turn was slinging megabytes of accumulated transcript — stale tool outputs, abandoned paragraphs, resolved questions that nobody needed anymore — just to ask the next question. The session should have been newed up half a dozen times. It wasn't.

That $46 is tuition. Here is what it bought.

## Long-running agents, not long-running processes

The instinct when you see a $46 bill is to缩短 the work — do less, stop early, break the project into smaller pieces. That instinct is half right, and the half it gets wrong is the expensive half.

There are two things that can be "long-running," and they have nothing in common:

- **A long-running process** is work that takes many steps — a migration, a documentation overhaul, a multi-phase eval. These are fine. They should run as long as they need to. You decompose them into epics and tasks with `td`, you document the decomposition, and you let the work proceed. The cost is linear in the work. No problem.

- **A long-running agent** is a single conversational session that never gets reset. This is the problem. Each turn re-sends the entire history. A conversation of *n* turns costs *O(n²)* in input tokens. A session that runs twice as long costs roughly **four times** as much, not twice. The marginal cost of every turn rises with the session length. Turn 200 costs what turn 1 cost plus 199 turns of barnacles.

The confusion between these two is what produces the $46. You think you're running a long-running process (fine, linear). You're actually running a long-running agent (quadratic, expensive). The fix is not to do less work. The fix is to stop carrying the barnacles.

## The phase boundary

The discipline is to treat a context reset as a **phase boundary**, not a memory test. At each boundary:

1. **Handoff.** `td handoff` captures the compressed state — the ground truth objective, the rejected hypotheses, the remaining debt. This is the lossy compression. The handoff keeps what the next session needs and drops what it doesn't.
2. **New up.** `/clear` or a fresh session. The megabytes are dropped. The meter resets.
3. **Resume.** The new session reads `td context` and continues from the handoff. The handoff is the seed. The raw transcript is the entropy.

Half a dozen newups in a long session is not excessive. It is the difference between *O(n²)* and *O(n)*. The work doesn't get shorter. The bill does.

## Why the agent won't save you

The agent has no skin in the game. It never sees the bill. It will cheerfully carry 200K tokens of stale transcript into turn 201, because the marginal cost is invisible to it. Cost pressure lives entirely with the human — and the human is the party least able to feel the marginal cost in the moment, because the human is thinking about the problem, not the meter.

This is why "remember to new up" is the wrong control. It's a rule enforced by human memory, which is the weakest enforcement mechanism available. The agent can't feel the cost, but the human can watch the meter. That's the management function.

## The manager's job, continued

In [The Manager's Job](2026-07-16-the-managers-job.md) the pitch was that managers should approve the model roster and exclude muppets. That's the procurement function. Token minimisation is the **operations function** — and it's the one that gives managers a reason to exist *after* the roster is set.

A manager who has approved a good roster, set sane defaults, and then gone back to sleep will still get a $46 invoice one day. The employees didn't do anything wrong. They used an approved model. They just let the session run. The manager's job is to notice the spike, diagnose it (long-running agent, not long-running process), and address it (bound the sessions, enforce handoffs). The $46 is not a problem. It's the reason the manager has a job. Without cost spikes, the management function is ceremonial. With them, it's operational.

This is the honest version of the pitch: **the manager exists to turn chip pan fires into pizza shops.** The eval system prevents the procurement fire (muppets, edge-lord pricing). The newup discipline prevents the operational fire (quadratic sessions). Both are management work. Both are cheap once you know to look. The expensive part is not knowing to look — and the $46 is what that costs.

## The argument, compressed

- Long-running processes: fine. Decompose with `td`. Linear cost.
- Long-running agents: expensive. New up at phase boundaries. Quadratic cost.
- The agent can't feel the cost. The human watches the meter.
- Cost spikes are not problems. They are the manager's reason for existing.
- $46 is tuition. The next session costs $4.

## Newup as problem-solving, not just cost control

There is a second reason to new up that has nothing to do with the meter, and
it is in some ways the stronger one.

A task that won't yield — the bug that reproduces in one session and not
another, the translator that passes every unit test but fails the integration,
the model that agrees with every correction and still produces the wrong
output — is the clearest signal to new up. Not to abandon the task. To attack
it with a clean slate.

The mechanism is simple: persist state with `td handoff`, new up, resume from
`td context`. The new session gets the relevant history in compressed form —
ground truth, rejected hypotheses, remaining debt — without the barnacles. The
locus tags in the handoff (`[LOC: file]` / `[WAYPOINT: milestone]`) tell the
fresh agent exactly which files and milestones matter, so it doesn't have to
re-derive the map from a wall of transcript.

A fresh context solves problems a stale one can't — not because the model is
smarter, but because it isn't drowning in its own discarded attempts. A
long-running agent accumulates dead ends. Every failed hypothesis it tried,
every wrong turn it took, is still in the context window, weighting the
attention mechanism toward the approaches that already didn't work. The model
literally can't forget what it already tried. A new session can. It starts
clean, reads the handoff (which records what was tried and rejected), and
approaches the problem from a direction that isn't anchored to the failures.

This is the win that's easy to miss. The $46 lesson is about cost. The
intractable-task lesson is about **capability**. Newing up doesn't just save
money — it restores the model's ability to solve the problem. The handoff is
the only thing that needs to survive. Everything else is entropy.

---

*Part of the [Edinburgh Protocol](https://github.com/pjsvis/cool-pi-extensions) series. The session-newup discipline is documented in the repo's `AGENTS.md`. The $46 lesson is in `briefs/2026-07-18-brief-session-newup-discipline.md`. Run it yourself. Watch your meter.*
