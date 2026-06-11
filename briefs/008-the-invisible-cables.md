# Brief: The Invisible Cables — td, sidecar, and the fractal stack

**Date:** 2026-06-11
**TD:** td-677cc0 (follow-up)
**Status:** complete

## Context

The terminal-native stack is built on a four-layer foundation: Alacritty, herdr, pi, Fresh. It's documented and understood. What is not documented — what no one talks about — is the *fifth layer*: the observability and continuity infrastructure that holds everything together.

**td** and **sidecar** are the invisible cables.

They are 90% used by agents. The human doesn't notice them because they work. That's the point.

## What the tools do

### td — the agent's memory

td tracks:
- Session identity and issue state
- What was done, what remains, what's blocked
- Handoff context so the next agent session resumes exactly where the previous one stopped

An agent calls `td handoff` before stopping. The next agent calls `td start` and knows everything. No debrief to read, no context to reconstruct.

**This is not a nice-to-have. This is how the system survives mid-sprint interruptions.** SSH drops, laptop lid closes, context window hits limit — td means the work doesn't fall through the cracks.

### sidecar — the human's window into the fractal

sidecar shows:
- Active worktrees and branches across all sessions
- td session state and issue progress
- Agent conversation history
- Merge workflow and dependency graph

For the human, sidecar is the escape hatch from the agent's constrained view. The agent works in its silo (silo extension). The human opens sidecar and sees the whole picture — all agents, all worktrees, all dependencies — without interfering with any of them.

## The fractal pattern

The stack is not a linear pipeline. It's a fractal:

```
Terminal (Alacritty)
  └── Session (herdr)
       └── Worktree (git worktree + td session)
            └── Agent (pi + silo)
                 └── Tools (td, sidecar, extensions)
```

Each layer is the same pattern at a different scale:
- **Small surface area.** Each context is bounded. The agent can't escape its silo. The worktree is isolated. The session has a clear purpose.
- **Clear boundaries.** Worktrees don't share filesystems. Sessions don't share terminal state. Agents don't share memory.
- **Observable state.** td captures what happened. sidecar shows what's happening. The human can see all layers simultaneously.

**The human occupies the meta-layer.** They can drop into any tab, any worktree, any agent's context — but they don't need to. sidecar shows them enough to supervise without interfering.

**The agent works in its slice.** It sees its worktree, its td session, its silo boundary. It doesn't need to know about the other worktrees or the human's view.

This is the fractal: recursive structure, consistent pattern, bounded contexts at every level.

## Why the cables are invisible

Good infrastructure is invisible. You don't think about the plumbing until it breaks.

td and sidecar work so well that the human doesn't notice them. The agent is already using them correctly — that's the design. The agent calls `td handoff` without being told. The human opens sidecar and sees everything. The system stays coherent because every layer respects the same boundaries.

**The 90% agent usage is the signal.** When infrastructure is used almost entirely by machines, the machines are doing their job. The human's job is not to manage the infrastructure — it's to supervise the agents who manage it.

The human notices when something breaks: a missing handoff, a lost session, a task that fell through the cracks. When nothing breaks, the human assumes the agents are just working well. They don't see the cables.

That's the goal. The cables should stay invisible.

## The lesson

**Design infrastructure for agents, not humans.** Humans benefit from the results. Agents depend on the structure. If the infrastructure is good enough for agents, humans won't need to think about it.

This is not "invisible computing." It's "invisible scaffolding." The structure holds everything up. You only see it when it fails.

For this stack:
- **td** is the agent's working memory and handoff protocol
- **sidecar** is the human's oversight layer — observable without intrusive
- Both are used primarily by agents, which is why they work so well
- Both are part of the fractal — small, bounded, recursive

The stack would collapse without them. They are the invisible cables. The human doesn't see them. That's how you know they're working.

## What this means for the stack documentation

The stack docs describe the visible layers: Alacritty, herdr, pi, Fresh. Extensions are documented. Playbooks cover how to use them.

**td and sidecar are mentioned but not explained.** They should be elevated to first-class status in the architecture docs. Not as "optional monitoring tools" but as the continuity and observability infrastructure that makes everything else resilient.

Specifically:
- `docs/terminal-stack.md` should name them explicitly in the stack overview
- `AGENTS.md` should reference them as required infrastructure (not optional)
- The fractal pattern should be documented so the architecture is legible

The invisible cables should be visible enough that someone reading the docs understands why the system doesn't fall apart when SSH drops.

---

## References

- [herdr](https://herdr.dev) — session multiplexing, tab management, daemon
- [td](https://github.com/marcusjensen/homebrew-tap) — structured session and issue tracking for agents (`brew install td`)
- [sidecar](https://github.com/marcusjensen/homebrew-tap) — TUI for watching agent progress and worktrees (`brew install sidecar`)