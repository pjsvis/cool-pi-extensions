# The VEST Protocol

> **Visitor Entry Self-Teaching** — *A system's API should teach you the system.*

Like REST (Representational State Transfer), the VEST Protocol is a named pattern with an acronym that maps to its core principles. Where REST optimizes for state transfer across networks, VEST optimizes for zero-friction discovery across audiences.

## The Pattern

An API with **two verbs for two audiences**:

| Verb | Audience | Teaches |
|---|---|---|
| `orient` | Agents | Where is the work? What's active? What do I do next? |
| `browse` | Humans | What's here? How do I read it? What can I explore? |

The entry point is the documentation. No manual, no index, no onboarding doc. Just two commands, and from those two commands the entire context unfolds.

## The VEST Acronym

| Letter | Principle | What it means |
|---|---|---|
| **V** | Visitor | Design for visitors, not just users. A visitor knows nothing. A user knows something. |
| **E** | Entry | The entry point teaches the system. If `just orient` doesn't tell you everything you need to start, you haven't finished designing it. |
| **S** | Self | The API references itself. `orient` lists the other verbs. `browse` lists the docs. The map contains the map. |
| **T** | Teach | Zero-friction discovery. A first-time visitor should understand the system in under 60 seconds without reading anything. |

## Informal Spec

1. **Separate by audience, not by function.** Don't give agents and humans the same verbs — they have different needs. Agents need to act; humans need to understand.

2. **The entry point teaches the system.** `just orient` should tell you: where you are, what's active, what's available, what to do next. If it doesn't, you haven't finished designing it.

3. **Discovery is zero-friction.** A visitor arriving for the first time should be able to orient themselves in under 60 seconds without reading anything.

4. **One verb per audience.** Don't add more. If you need a third verb, you need a third audience, or you need to split the existing audiences.

5. **The system teaches itself.** The `orient` output should list the other verbs. `browse` should list the docs. The API references itself.

## Implementation in cool-pi-extensions

```bash
just orient    # Agent orientation — branch, git state, td tasks, provisioning, entry points
just browse    # Human doc browser — lists docs/ and playbooks/, points to glow
glow           # Interactive markdown browser — type alone for file picker
```

`just orient` produces:
```
Repo:   cool-pi-extensions
Branch: main

=== Git status ===
... (current branch state)

=== Agent tasks (td) ===
SESSION: ses_61dc04
... (active issues)

=== Provisioning ===
  ✓ bun  ✓ just  ✓ glow
  ✓ pi: 0.79.1

=== Entry points ===
  just about   — what this project is
  just help    — full repo index
  just orient  — current state (you are here)
  just browse  — human doc browser
```

`just browse` produces:
```
=== docs/ (reference) ===
  • docs/terminal-stack.md
  • docs/standard-mono-repo-pattern.md
  ...

=== playbooks/ (guides) ===
  • playbooks/dev-stack-setup.md
  • playbooks/extensions.md
  ...

→ just read <file>  to render any file with glow
→ glow             to browse interactively
```

## Anecdotes

**The first-time visitor.** A new agent drops into a mid-sprint session. They run `just orient`. They know their branch, their active task, the provisioning state, and the entry points. They are productive in 30 seconds.

**The human who wants to explore.** A colleague hears about the project. They run `just browse`. They see the docs and playbooks, understand the structure, and know how to read any of it. No hand-holding required.

**The agent who forgot where they were.** An agent resumes a session. They run `just orient`. The td state, git state, and handoff context tell them exactly where the previous session stopped. No debrief to read, no thread to scroll.

**The irony.** The simplest API is the hardest to design. Adding nothing was the work. The team resisted the urge to document everything, create taxonomies, write elaborate onboarding guides. Instead they asked: what does an agent need to start work? What does a human need to discover context? The answers were two verbs.

## VEST vs REST: The Philosophy

Like REST, VEST is a pattern named with an acronym. But the philosophy is different — and that difference matters in the age of agents.

**REST** was designed for the web: vast, documented, hierarchical. Document everything. Expose an expansive API surface to meet all possible requirements.

**VEST** was designed for visitors: self-contained, self-teaching, minimal. Two verbs. Everything else follows.

| | REST | VEST |
|---|---|---|
| Philosophy | Here is the API name, here is the rest of it | You are new here — what do you want to know? |
| Assumption | You know what you're looking for | You know nothing |
| Size | Expansive — document everything | Minimal — two verbs |
| Failure mode | Hours lost to stale documentation | 30 seconds to understand it's not worth it |

REST optimizes for known unknowns. VEST optimizes for unknown unknowns.

In the age of agents — where the visitor might be a language model dropping into a mid-sprint session with no context — you need VEST. Not a manual. Not an index. Just: `just orient`.

---

## Adding to a new project

1. Create `just orient` — output should include: where you are, what's active, what's available, what to do next, and the other verbs.
2. Create `just browse` — output should include: what's here, how to read it, what to do with it.
3. Verify: a first-time visitor can orient themselves in under 60 seconds without reading anything.

That's it. The simplest API is the hardest to design.