# The VEST Protocol: Zero-Friction Discovery for Agents and Humans

*Published: June 2026*

---

## The Problem

You've joined a new project. Where do you start?

Most repos give you:
- A README with 47 sections
- A CONTRIBUTING.md that assumes you already know the architecture
- A Wiki that's three major refactors behind
- A Slack thread from 2023 that no one updates

You spend the first hour just figuring out *what exists*. Not what to build — just what the project is, where things live, what the conventions are.

This is a discoverability problem. And it's a problem we keep solving the wrong way: by adding more documentation.

## The Insight

What if the entry point was the documentation?

Not a pointer to the documentation. Not a link to a doc. The *command itself* tells you what you need to know.

When you drop into this repo and run:

```bash
just orient
```

You get:
- Where you are (branch, git state)
- What's active (td tasks, handoff context)
- What's available (provisioning, entry points)
- What to do next (td next)

You are productive in 30 seconds. No README to read. No index to scan.

When you want to explore the docs:

```bash
just browse
```

You get:
- What's here (docs/ and playbooks/ listed)
- How to read it (glow integration)
- What to do with it (just read or glow)

Zero onboarding. The system teaches itself.

## The VEST Protocol

**Visitor Entry Self-Teaching.**

Like REST (Representational State Transfer), it's a named pattern with an acronym that maps to its principles:
**V is for Visitor** — Design for visitors, not just users. A visitor knows nothing. A user knows something.
**E is for Entry** — The entry point teaches the system. If `just orient` doesn't tell you everything you need to start, you haven't finished designing it.
**S is for Self** — The API references itself. `orient` lists the other verbs. `browse` lists the docs. The map contains the map.
**T is for Teach** — Zero-friction discovery. A first-time visitor should understand the system in under 60 seconds without reading anything.

## Two Verbs, Two Audiences

The pattern is simple: **one verb per audience**.
**`orient`** — For agents: Where is the work? What's active? What do I do next?
**`browse`** — For humans: What's here? How do I read it? What can I explore?

Agents and humans have different needs. Agents need to act; humans need to understand. Giving them the same verb is like giving a pilot and a passenger the same controls.

## Why This Repo Exists

This repo — [cool-pi-extensions](https://github.com/pjsvis/cool-pi-extensions) — is a curated collection of tools for the [Pi Coding Agent](https://github.com/earendil-works/pi-mono). Extensions, CLI tooling, prompts.

But it's also a proof-of-concept for the VEST Protocol. Every design decision is there to demonstrate:

**Self-contained.** Clone it anywhere, run `just orient`, you're productive. No external dependencies beyond what `just install-deps` handles. The repo teaches its own structure.

**Agent-agnostic.** The VEST Protocol works with any agent, any context. `just orient` just outputs information. Whether a human reads it or an LLM parses it, the information is the same.

**Idempotent.** `just provision` checks what's installed. Run it once, run it ten times — same result. No side effects, no state mutation.

**Restartable.** `td handoff` captures session state. An agent can stop mid-sprint, and the next agent resumes exactly where the previous one stopped. No debrief to read, no context to reconstruct.

## The Anecdotes

**The first-time visitor.** A new agent drops into a mid-sprint session. They run `just orient`. They know their branch, their active task, the provisioning state, and the entry points. They are productive in 30 seconds.

**The human who wants to explore.** A colleague hears about the project. They run `just browse`. They see the docs and playbooks, understand the structure, and know how to read any of it. No hand-holding required.

**The agent who forgot where they were.** An agent resumes a session. They run `just orient`. The td state, git state, and handoff context tell them exactly where the previous session stopped. No debrief to read, no thread to scroll.

**The irony.** The simplest API is the hardest to design. Adding nothing was the work. The team resisted the urge to document everything, create taxonomies, write elaborate onboarding guides. Instead they asked: what does an agent need to start work? What does a human need to discover context? The answers were two verbs.

**The Bruce Willis of protocols.** Some say the VEST Protocol is full of holes. Two verbs? No comprehensive documentation? No hierarchical taxonomy? But that's exactly the point. A bulletproof vest isn't reinforced steel — it's lightweight, functional, and designed to save your life when everything goes wrong. VEST is the same. When an agent drops into a mid-sprint session with no context, VEST catches the bullet. `just orient` tells them where they are. `just browse` tells them what's available. The holes aren't vulnerabilities — they're where the discovery happens.

## VEST vs REST: The Philosophy

Like REST, VEST is a pattern named with an acronym. But the philosophy is different — and that difference matters in the age of agents.

**REST** was designed for the web: vast, documented, hierarchical. Document everything. Expose an expansive API surface to meet all possible requirements. Here is the endpoint, here is what it does, here is the schema.

**The REST problem:** If the API is large and poorly maintained, you're sunk. You spend hours reading documentation that doesn't match the implementation. You hit endpoints that don't exist. You parse error messages that tell you nothing.

**VEST** was designed for visitors: self-contained, self-teaching, minimal. Two verbs. Everything else follows from those verbs. You are new here — what do you want to know?

**The VEST solution:** If the repo is rubbish, there's no need to read much further, far less navigate an endless expanse. `just orient` tells you what matters. If there's nothing active, you're done. If there's work, you know where to start. The system tells you its own state — no archaeology required.

**REST** — Here is the API name, here is the rest of it
**VEST** — You are new here — what do you want to know?
**Philosophy:** Here is the API name, here is the rest of it → Here is the VEST alternative: You are new here — what do you want to know?
**Assumption:** You know what you're looking for → VEST assumes: You know nothing
**Size:** Expansive — document everything → VEST is: Minimal — two verbs
**Maintenance:** High — docs must match implementation → VEST cost: Low — the system teaches itself
**Failure mode:** Hours lost to stale documentation → VEST failure: 30 seconds to understand it's not worth it

REST optimizes for known unknowns. VEST optimizes for unknown unknowns.

In the age of agents — where the visitor might be a language model dropping into a mid-sprint session with no context — you need VEST. Not a manual. Not an index. Not a CONTRIBUTING.md. Just: `just orient`.

## The Structure Is the API

When you run `glow` in this repo, you see:
```
README.md
AGENTS.md
justfile
MANIFEST.md
briefs/
debriefs/
decisions/
docs/
playbooks/
prompts/
```

The **folders teach you the conventions**. You don't need a doc about conventions:

- `briefs/` → what's being built
- `debriefs/` → what was learned
- `decisions/` → why X was chosen
- `docs/` → reference material
- `playbooks/` → how-to guides
- `prompts/` → agent identity and fixtures

Read `briefs/`, see the format. Brief 001, done. Brief 007, implemented. The process is in the content, not in a PROCESS.md. No tools required. Just `glow` and explore.

## You Don't Need a Jumpsuit

REST is a hazmat suit. Comprehensive. Full-body protection. Designed for every contingency. The problem: you're not handling hazardous materials — you're reading a repo.

VEST is a vest. Lightweight. Functional. Two pockets, five buttons. You put it on, you're ready to work.

You don't need to document everything. You need the system to tell you what matters. When you arrive: `just orient`. When you explore: `just browse`. That's it. No jumpsuit required.

## The Invitation

This repo is a working example. Clone it, run `just orient`, run `just browse`. See how it feels to drop into a system that teaches itself.

If you're building a tool that agents or humans will interact with, consider the VEST Protocol:

1. Create `just orient` — output should include: where you are, what's active, what's available, what to do next, and the other verbs.
2. Create `just browse` — output should include: what's here, how to read it, what to do with it.
3. Verify: a first-time visitor can orient themselves in under 60 seconds without reading anything.

That's it. The simplest API is the hardest to design.

---

*The VEST Protocol was extracted from the [cool-pi-extensions](https://github.com/pjsvis/cool-pi-extensions) repository — a curated collection of extensions and CLI tooling for the Pi Coding Agent.*