## MANDATORY: Use td for Task Management

Run td usage --new-session at conversation start (or after /clear). This tells you what to work on next.

Sessions are automatic (based on terminal/agent context). Optional:
- td session "name" to label the current session
- td session --new to force a new session in the same context

Use td usage -q after first read.

## Silo Exception: Pi Agent Config Files (Decision 013)

As the **sole, explicit exception** to the Edinburgh Protocol's SILO DISCIPLINE
("I'm staying in"), the agent operating in this repo MAY read and edit the
Pi agent configuration files `~/.pi/agent/models.json` and
`~/.pi/agent/settings.json` on the user's behalf. This repo's purpose is Pi
tooling/configuration, and managing Pi's providers and models requires
touching those files.

Narrow and exclusive — does NOT extend to:
- `~/.pi/agent/auth.json` or any credentials, tokens, or API keys
- skate secrets (`skate get` / `skate set`) — secrets remain the user's domain
- any other path outside the repo

Preferred mechanism for durable provider definitions: an in-repo Pi extension
(`pi.registerProvider()`, versioned). Use the `models.json` / `settings.json`
exception for runtime state extensions can't express (removing a built-in
provider, personal overrides, default-model selection).

Full rationale + enforcement-gap note: `decisions/013-silo-exception-pi-config.md`

## Bounded Tasks & Session Newup Discipline

This repo treats **long-running processes** and **long-running agents** as
different problems:

- **Long-running processes are fine.** Decompose them into epics and tasks
  with `td`. Document the decomposition. The work runs as long as it needs to.
- **Long-running agents are expensive.** Every turn re-sends the full
  conversation history. Cost grows *O(n²)* in turns — a session that runs
  twice as long costs roughly four times as much, not twice. Megabytes of
  accumulated transcript get slung on every turn.

### The discipline

Work in **bounded phases**. At a phase boundary:

1. `td handoff` — capture compressed state (ground truth, rejected
   hypotheses, remaining debt). The handoff is the lossy compression.
2. **New up** — `/clear` or a fresh session. Drop the megabytes.
3. Resume from `td context`. The handoff is the seed; the raw transcript is
   the entropy.

Half a dozen newups in a long session is not excessive — it is the difference
   between *O(n²)* and *O(n)*.

### When to new up

- You've completed a logical unit of work, **and** the context is feeling heavy.
- The meter in Pi is climbing faster than the work is progressing.
- You're about to shift to a different file or concern (a `[LOC:]` boundary).

The agent cannot feel the cost — it has no skin in the game. The human watches
the meter. This is a management function, not a memory test: identify cost
spikes and address them by bounding the session. See
`briefs/2026-07-18-brief-session-newup-discipline.md` (the $46 lesson) and
`blog/2026-07-18-token-minimisation.md`.
