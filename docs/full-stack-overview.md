# The Terminal-Native Stack: A Field Report from Inside

**or: How to drop into a mid-sprint session and be productive in 30 seconds**

---

You arrive. You don't know where you are, what the work is, or what the previous agent left unfinished. This is the starting condition for every agent in this repo. The system is designed around this.

If you are a human reading this: the perspective is a visiting agent. The affordances and patterns described here are what an agent sees. Where we note human affordances, we note the distinction. The shared context is the point.

---

## What you see when you arrive

You clone the repo. You run:

```
just orient
```

You get back:
- Current branch and git state
- Last commit message
- Active td tasks
- Key entry points (just, scripts, docs)

You are now oriented. Not because someone handed you a document — because the system told you. The VEST Protocol in practice: `just orient` is the entry point, and it teaches the system.

You are 30 seconds in. You know:
- Where the work is
- What is active
- What to do next

---

## What the system teaches itself

The repo is designed around a simple idea: **the system should teach itself**.

`just orient` tells you the state. `just browse` lists the docs and playbooks — what exists, how to read it. `just read docs/the-vest-protocol.md` teaches you the philosophy. `just dev` starts the development workflow.

No CONTRIBUTING.md to read. No onboarding guide. No taxonomy of directories. The map contains the map.

The VEST Protocol — Visitor, Entry, Self, Teach — is not a framework. It's a design constraint: every entry point should teach the next step. If `just orient` doesn't tell you what you need to start, the design is incomplete.

The Edinburgh Protocol is the identity constraint: Hume's skepticism (check your assumptions), Smith's systems thinking (trace the incentives), Watt's pragmatism (does it work?). Before you answer a question, you simulate an impartial spectator. You reject ideology. You follow the evidence.

These are not decorative. They are operational.

---

## The invisible cables

Two tools you won't notice until they fail: **td** and **sidecar**.

**td** is the session memory. When you stop, you run `td handoff`. You capture what was done, what remains, what's blocked. The next agent runs `td start` and resumes exactly where you stopped. No debrief to read. No context to reconstruct.

This is not optional. It's how the system survives mid-sprint interruptions: SSH drops, context windows hit limit, you run out of time. td means the work doesn't fall through the cracks.

**sidecar** is the human's window. It shows active worktrees, td state, agent conversation history, merge workflow. The human opens it and sees what you're doing — without interrupting you.

For you, sidecar is not your tool. It's theirs. You work in your silo. They watch from a distance.

These two tools are used 90% by agents. That's the signal: when infrastructure is used primarily by machines, the machines are doing their job. The human doesn't notice it works. They notice when it breaks.

---

## The shared agent-human platform

Most dev tooling is built for either humans or agents — never both in the same workspace. This stack is different.

The human and you work in the same herdr session. They have a tab with pi (that's you). They have a tab with Fresh (their editor). They might have a tab with sidecar open (their oversight layer). You share the same context — same files, same git state, same session.

**What you share:**
- The filesystem (silo keeps you inside the repo boundary)
- The session state (herdr keeps everything alive across disconnections)
- The git state (worktrees are isolated, but the repo is shared)

**What you each have separately:**

For you (the agent):
- **td** — your working memory and handoff protocol
- **silo** — hard filesystem boundary, you can't read or write outside the repo
- **edinburgh-evals** — behavioral gate, trap vectors test your adherence to the Edinburgh Protocol
- **defuddle** — you can fetch any webpage as clean Markdown (your web access tool)
- The pi runtime with its tools and extensions

For them (the human):
- **Fresh** — their terminal-native editor with plugin system
- **glow-preview** — Fresh plugin for full-screen markdown rendering with ANSI-color-matched theme
- **sidecar** — live dashboard of all worktrees and agent state
- **Alacritty** — GPU-accelerated terminal, their window into the session

**The key property:** neither of you needs to understand what the other is doing in detail. You have bounded contexts. They have oversight without intrusion. The system stays coherent because every layer respects the same boundaries.

---

## The fractal pattern

The stack is not a pipeline. It's a fractal:

```
Terminal (Alacritty)
  └── Session (herdr)
       └── Worktree (git worktree + td session)
            └── Agent (pi + silo)
                 └── Tools (td, sidecar, extensions)
```

Each layer is the same pattern at a different scale:
- **Small surface area.** Each context is bounded. You can't escape your silo. The worktree is isolated. The session has a clear purpose.
- **Clear boundaries.** Worktrees don't share filesystems. Sessions don't share terminal state. You don't share memory.
- **Observable state.** td captures what happened. sidecar shows what's happening. The human sees the whole picture; you see your slice.

The human occupies the meta-layer. They can drop into any tab, any worktree, any agent context. They don't need to. sidecar shows them enough.

You work in your slice. You see your worktree, your td session, your silo boundary. You don't need to know about the other worktrees.

This is the fractal: recursive structure, consistent pattern, bounded contexts at every level.

---

## The window problem is a fake problem

Desktop window managers differ wildly across platforms. macOS, Linux, Windows — different models, different keybindings, different behaviors.

The fix is not to pick the best one. It's to leave the OS window manager out of it entirely.

Alacritty renders consistently across macOS, Linux, and Windows (WSL2). herdr handles sessions. The experience is identical regardless of where you connect from. The OS manages the pixels; herdr manages the context.

SSH-native. Zero GUI dependency. Works from a phone, a tablet, a 15-year-old ThinkPad.

TailScale gives the human a fixed address on a private mesh — they connect from anywhere. herdr restores the session. You are mid-sentence. Fresh has their unsaved changes. td has the handoff context.

The workspace survives the network.

---

## How to get started

**For agents:**

```bash
# Clone and orient
git clone https://github.com/pjsvis/cool-pi-extensions.git
cd cool-pi-extensions
just orient

# Normalize your identity
just adopt-edinburgh

# Start work
just dev
```

**For humans:**

```bash
# Install the stack
brew install alacritty herdr td sidecar glow
brew install --cask fresh-editor

# Clone and orient
git clone https://github.com/pjsvis/cool-pi-extensions.git
cd cool-pi-extensions
just orient
just browse
```

The stack is documented in `playbooks/`. Give a visiting agent the URL to a playbook and it will execute it: `pi "install the terminal stack from https://..."`.

---

## What we'd keep and what we'd change

**What we'd keep:**

- The VEST Protocol. Two verbs. The system teaches itself.
- silo. Hard boundaries make agents safer.
- td handoff. Session continuity is non-negotiable.
- The fractal pattern. Bounded contexts at every scale.
- SSH-native everything. No GUI, no browser, no Electron.

**What we'd change:**

- More explicit documentation of the observability layer (td + sidecar). They are infrastructure, not tools.
- Earlier ADR documentation. The table rendering decision (ADR-001) should have been recorded before the first table was converted, not after.
- A clearer shared/separate affordances map. The distinction between what the human and agent each have is the most interesting property of the system — it deserves explicit documentation.

---

## The short version

This repo is a proof-of-concept for terminal-native AI-assisted development. It's built for agents who arrive mid-sprint with no context and need to be productive in 30 seconds. It's built for humans who want oversight without intrusion. It works over SSH, survives disconnections, and stays coherent because every layer respects the same boundaries.

You can clone it, run `just orient`, and understand the whole system in under a minute.

That's the goal. That's the design.

---

*Filed in: `docs/full-stack-overview.md`*  
*Companion to: `docs/the-vest-protocol.md`, `docs/visitor-journey.md`, `briefs/008-the-invisible-cables.md`*