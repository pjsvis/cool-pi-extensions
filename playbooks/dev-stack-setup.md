# Playbook: Dev Stack Setup

## The one-liner

> Tell your coding agent to orient itself to the project — it will check everything and walk you through the rest.

---

## Setup

```bash
flox activate
just dev
```

`flox activate` handles the toolchain pre-reqs (bun, just, glow, rtk, skate, pi). `just dev` handles the rest — symlinks, config, extensions, everything else the repo needs to work.

Run both. You're done.

---

## What this stack is

```
alacritty → herdr → pi → [new tab] → fresh → [new tab] → sidecar
```

**Terminal:** Alacritty  
**Session:** herdr  
**Agent:** pi (Edinburgh Protocol)  
**Editor:** Fresh  
**Monitor:** sidecar  
**Memory:** td (per-session, agent-facing)

sidecar is for **you** — the human supervising. td is for **agents** — session continuity and handoff.

---

## Provisioning check

```bash
just provision
```

Run any time to verify the toolchain is complete. `flox activate` also runs this check on activation.

---

## The orient pattern

When an agent (or you) runs:
```bash
just orient
```

It reports: branch, git state, active td tasks, key entry points.

For a new agent, `just orient` and `just help` are the two commands that matter. The system teaches itself.

---

## Typical workflow

```
# Agent session
alacritty
herdr connect <host>
pi

# Before context ends
td handoff <issue-id> --done "..." --remaining "..."

# Human monitoring (optional)
sidecar
```

Or inside pi, open a new tab (`Ctrl+T` in Fresh) and run Fresh + sidecar there.

---

## Key files

**`justfile`** — Task runner  
**`AGENTS.md`** — Agent instructions  
**`MANIFEST.md`** — Repo index  
**`DEPENDENCIES.md`** — Tool reference  
**`playbooks/insights.md`** — Project insights