# Playbook: Dev Stack Setup

## The one-liner

> Tell your coding agent to orient itself to the project — it will check everything and walk you through the rest.

---

## What it is

A herdr space configured for AI-assisted development. One active agent with a set of tabs.

```
herdr session: cool-pi-extensions
├── tab 1: pi (the agent)
├── tab 2: fresh (the editor)
├── tab 3: sidecar (the human's oversight layer)
└── tab 4: shell (auxiliary)
```

**pi** runs in the agent layer with Edinburgh Protocol identity. It reads `AGENTS.md` and `just orient` to understand the project context. It has td for session continuity and silo for filesystem boundaries.

**fresh** is the editor. It opens files directly on the remote. It has a glow-preview plugin for full-screen markdown rendering.

**sidecar** is the human's view. It shows active worktrees, td state, agent conversation history, merge status. The human can watch the agent work without interfering.

**herdr** keeps the session alive across disconnections. SSH drops, laptop lid closes, context window hits limit — reconnect and everything is exactly where it was. pi is mid-sentence. Fresh has unsaved changes. td has the handoff context.

---

## Setup

```bash
flox activate
just dev
```

`flox activate` handles the toolchain. `just dev` handles the rest — symlinks, config, extensions.

---

## Key files

**`justfile`** — Task runner  
**`AGENTS.md`** — Agent instructions  
**`MANIFEST.md`** — Repo index  
**`playbooks/insights.md`** — Project insights