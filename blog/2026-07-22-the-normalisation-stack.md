---
title: The Normalisation Stack
dek: The Protocol normalises the model, the briefs normalise the work, the newups normalise the cost. Each is cheap. Together they compound. Here is the stack, the evidence for each layer, and why the composition is the thing none of them can do alone.
date: 2026-07-22
---

# The Normalisation Stack

## tldr

Three layers, each normalising a different failure mode, each cheap enough
that the cost is invisible until you notice its absence:

1. **The Edinburgh Protocol** normalises the *model* — compresses behavioural
   variance, raises the floor, keeps the ceiling. Evidence: primed-vs-bare
   delta, two independent graders, 42% variance reduction across 25 models.
2. **The silo process** (briefs, debriefs, decisions, playbooks) normalises
   the *work* — freezes scope before code, audits changes after, makes debt
   visible. Evidence: every epic in the repo has a brief, a commit, and a
   debrief you can trace.
3. **The bounded-context discipline** (handoff, newup, resume) normalises the
   *cost* — keeps token spend O(n) in turns, not O(n²). Evidence: the eval
   consolidation — 4 sessions, 4 commits, ~29 minutes, zero context overflow,
   better quality than a single session would have produced.

Each layer is "predictably adequate" on its own. Together they're the
difference between a $46 session that produces decorated Stuff and a $4
session that produces a Thing. The composition is the argument.

## content

### The problem with three separate posts

We have written about each layer in isolation. The Edinburgh Protocol has the
primed-vs-bare experiment and the "predictably adequate" reframing. The
bounded-context discipline has the Shannon channel model and the $46 lesson.
The silo process has the playbooks — briefs, debriefs, decisions — but no
standalone narrative, because "how we file documents" is not a blog post.

What we haven't written is the thing that actually matters: **the stack.**
The layers compose. The Protocol makes the model behave. The silo process
makes the work legible. The bounded-context discipline makes the cost
sustainable. Each layer addresses a failure mode the others can't reach:

- A normalised model without a silo process produces good tokens in service
  of unscoped work — brilliant output that solves the wrong problem.
- A silo process without bounded context produces well-documented work that
  costs $46 per session — the briefs are clean, the meter is on fire.
- Bounded context without a normalised model produces cheap sessions full of
  muppet behaviour — the handoffs are crisp, the model agrees with everything
  and runs toward every trap.

You need all three. The cost of any one layer is small. The cost of missing
any one is the failure mode that layer prevents. That's the stack.

### Layer 1: Normalise the model

The Edinburgh Protocol is a system prompt built on Scottish Enlightenment
principles — Hume's skepticism, Smith's systems thinking, Watt's pragmatic
improvement. It costs a few hundred tokens of system prompt. It doesn't make
models smarter. It makes them *predictably adequate*.

The experiment: run 25 models through the same scenario twice — once with
the Protocol active (primed), once without (bare). Score both conditions with
two independent graders of different architectures. The result:

- Standard deviation drops 42% (4.3 to 2.5). The pack compresses.
- The floor rises from 0 to 7 out of 16. The ceiling doesn't move.
- 22 of 24 models become deployable (above 12/16). Twelve that were risky
  become safe.
- Both graders agree on the direction of the delta for every model. Zero
  disagreements.

The reframing: the Protocol doesn't push the top higher. It pulls the bottom
up. That's normalisation, not enhancement. The cheap model that was risky
becomes safe. The expensive model that was already good stays good. The
deployment criterion shifts from "is this model smart enough?" to "is this
model cheap enough, given that the Protocol has made it adequate?"

The cost: a few hundred tokens of system prompt, loaded once per session. The
evidence is in
[Predictably Adequate](2026-07-16-predictably-adequate-composite.md) and the
[muppet filter](not-a-muppet-just-intellectually-challenged.md).

### Layer 2: Normalise the work

The silo process is the document discipline: briefs before code, debriefs
after, decisions for the architectural choices, playbooks for the repeatable
patterns. It costs a few minutes of writing per epic. It doesn't make the
code better. It makes the *work legible* — to the next session, to the next
agent, to the human who arrives six months later and asks "why did we do
this?"

The structure:

- **Briefs** freeze the *what* and *why* before any code is written. A brief
  is a self-contained spec with acceptance criteria and an explicit "out of
  scope" section. It doesn't change after work starts — changes go in the
  debrief.
- **Decisions** record the *why* behind architectural choices. An ADR has
  context, the decision, the alternatives considered, and the consequences.
  It's the record a future session reads to understand why the code is the
  way it is.
- **Debriefs** capture what happened — what worked, what didn't, what to do
  differently. They're the institutional memory that survives the newup.
- **Playbooks** codify the repeatable patterns — how to write a brief, how to
  file a decision, how to run an eval. They're the process layer that makes
  the other three cheap to produce.

The cost: a few minutes of writing per artefact. The evidence is the repo
itself — every epic has a brief you can read, every architectural choice has
a decision you can audit, every completion has a debrief you can learn from.
The eval consolidation that produced this stack has
[Brief 2026-07-22](../briefs/2026-07-22-brief-pi-eval-cli-consolidation.md),
[Decision 021](../decisions/021-eval-engine-cli-first-thin-extension-port.md),
and
[Debrief 012](../debriefs/012-pi-eval-cli-consolidation.md). You can trace
the work from spec to architecture to reflection without reading a single
line of code.

The failure mode this prevents: a normalised model producing good tokens in
service of unscoped work. The brief freezes the scope. The decision records
the trade-off. The model — however well-behaved — can't drift the scope
because the scope is a document, not a vibe.

### Layer 3: Normalise the cost

The bounded-context discipline is the session-newup pattern: decompose the
epic into phases, hand off at each boundary, `/clear`, resume from compressed
state. It costs 1-2 turns of overhead per boundary (write handoff, read
context). It doesn't make the work faster. It makes the *cost linear instead
of quadratic*.

The theory: every turn re-sends the full conversation history. A session of
*n* turns costs *O(n²)* in input tokens. The context window is a finite-capacity
channel; the transcript is noise that accumulates and re-transmits. The
handoff is source coding — compress the signal to its entropy rate. The
newup is the channel reset — full capacity restored, clean SNR.

The practice: the eval consolidation was the first epic run under the
discipline from start to finish. Four tasks, four sessions, four commits:

| Session | Task | Commit | LOC built | LOC deleted |
|---|---|---|---|---|
| 1 | CLI scaffold + shared lib | `fc69e38` | +1,982 | 0 |
| 2 | Score + matrix subcommands | `f64cfe1` | +989 | −5 |
| 3 | Extension thin port | `62a98b9` | +60 | −1,730 |
| 4 | Cleanup + debrief | `bda54ce` | +170 | −2,386 |

Each session read the brief (~5 KB) and the prior handoff (~1 KB), never the
raw transcript. No session carried more than ~15 KB of prior-state context.
No session hit a context wall. No session went in circles. The work took
~29 minutes of wall time. The cost was *O(n)* in turns — four bounded
sessions, not one accumulating session.

The quality argument: session 3 rewrote the extension from 532 to 116 LOC —
a clean *replacement*, not a *patch*. That rewrite was clean because the
model wasn't carrying the 1,991 LOC of source files it read in sessions 1
and 2. It had the brief, the handoff, and the one file it was rewriting. A
single session would have patched the existing structure — modifying the
state machine, deleting hooks one at a time — because the old structure was
still in context, exerting gravitational pull. Bounded context produced a
better architectural outcome, not just a cheaper one.

The cost: 1-2 turns per boundary. The evidence is in
[Four Sessions, Four Commits](2026-07-22-four-sessions-four-commits.md) and
the theory in
[Shannon, the Session, and the $46](2026-07-18-shannon-the-session-and-the-46.md).

### The composition

Each layer is cheap. Each prevents a failure mode the others can't reach.
The composition is the argument:

```
Layer 1 (Protocol)  — normalises the model   — cost: ~200 tokens/session
Layer 2 (Silo)      — normalises the work    — cost: ~5 minutes/artefact
Layer 3 (Newup)     — normalises the cost    — cost: ~2 turns/boundary
```

The asymmetry: the cost of any layer is small and linear. The cost of
*missing* a layer is the failure mode it prevents — muppet behaviour, scope
drift, the $46. Each failure mode is expensive and quadratic in its own way:
muppets waste tokens agreeing with everything, scope drift wastes sessions
solving the wrong problem, context overflow wastes money re-transmitting
noise.

The layers compound because they operate at different timescales. The
Protocol normalises per-token — every output is shaped. The silo process
normalises per-epic — every piece of work is scoped and audited. The
bounded-context discipline normalises per-session — every phase boundary is
a reset. Together they cover the full temporal stack: token, task, session.

And the empirical evidence is concrete: the eval consolidation that produced
this stack ran under all three layers simultaneously. A normalised model
(Kimi K2.6, 18/19 on the Protocol eval) did the work. The silo process
produced the brief, the four task definitions with acceptance criteria, the
decision, and the debrief. The bounded-context discipline kept the cost
linear across four sessions. The result was −920 LOC net, one canonical
engine replacing three duplicated ones, and a blog post you can verify by
reading the commits.

That's the stack. The cost is invisible. The absence is expensive. And the
only way to see the composition is to run all three at once — which is what
we did, and why this post exists.

## narrativised-bibliography

The layer-1 evidence — the primed-vs-bare experiment, the "predictably
adequate" reframing, the variance reduction — is in
[Predictably Adequate](2026-07-16-predictably-adequate-composite.md), which
is the composite asset that contains the full experiment narrative, the data,
and the governance argument. The companion piece,
[The Muppet Filter](not-a-muppet-just-intellectually-challenged.md), covers
the eval system that gates which models enter the pack. Together they
establish that the Protocol normalises behaviour, measured empirically.

The layer-2 process — briefs, debriefs, decisions, playbooks — is documented
in the repo's `playbooks/` directory. The
[briefs playbook](../playbooks/briefs-playbook.md) defines the format and
lifecycle. The [decisions playbook](../playbooks/decisions-playbook.md)
defines the ADR structure. The
[debriefs playbook](../playbooks/debriefs-playbook.md) defines the
post-implementation reflection. These are living documents, not blog posts —
the process layer that makes the other two layers cheap to produce. The
specific artefacts from the eval consolidation are
[Brief 2026-07-22](../briefs/2026-07-22-brief-pi-eval-cli-consolidation.md),
[Decision 021](../decisions/021-eval-engine-cli-first-thin-extension-port.md),
and
[Debrief 012](../debriefs/012-pi-eval-cli-consolidation.md). Read them in
that order to trace the work from spec to architecture to reflection.

The layer-3 evidence — the Shannon channel model, the $46 lesson, the worked
example — is in three posts that form a sequence.
[Shannon, the Session, and the $46](2026-07-18-shannon-the-session-and-the-46.md)
is the theory: the context window as a noisy channel, the handoff as source
coding, the newup as channel reset.
[Token Minimisation](2026-07-18-token-minimisation.md) is the manual: the
phase boundary, the handoff, the manager's job.
[Four Sessions, Four Commits](2026-07-22-four-sessions-four-commits.md) is
the worked example: the eval consolidation run under the discipline from
start to finish, with the actual numbers and the actual handoff structure.
This post is the synthesis that treats all three layers as one system — the
thing none of the prior posts could do alone, because each was vertical
rather than horizontal.

The `td` task manager (`marcus/td` on Homebrew) provided the infrastructure
that made layer 3 executable: issues with dependency DAGs, structured
handoffs (`--done`/`--remaining`/`--decision`), session tracking, and
review/approve workflow. Without `td`, the handoff is a pasted block of
text; with it, the handoff is a queryable artifact that survives the
`/clear`. The `AGENTS.md` in the repo codifies the bounded-session discipline
that `td` enforces, and references the $46 lesson as its origin.

---

*Part of the [Edinburgh Protocol](https://github.com/pjsvis/cool-pi-extensions)
series. The vertical posts are [Predictably Adequate](2026-07-16-predictably-adequate-composite.md)
(layer 1), [Shannon, the Session, and the $46](2026-07-18-shannon-the-session-and-the-46.md)
(layer 3 theory), [Token Minimisation](2026-07-18-token-minimisation.md)
(layer 3 manual), and [Four Sessions, Four Commits](2026-07-22-four-sessions-four-commits.md)
(layer 3 practice). This is the horizontal synthesis.*
