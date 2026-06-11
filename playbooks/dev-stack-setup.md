# Playbook: Dev Stack Setup

## The one-liner

> Tell your coding agent to orient itself to the project — it will check everything and walk you through the rest.

---

## What this stack is

```
alacritty → herdr → pi → [new tab] → fresh → [new tab] → sidecar
```



**Terminal layer:** Alacritty — GPU-accelerated terminal emulator
**Connection layer:** herdr — SSH config and session management
**Agent layer:** pi — Coding agent with Edinburgh Protocol identity
**Editor layer:** Fresh — Terminal-native code editor
**Monitor layer:** sidecar — TUI for watching agent progress and worktrees
**Task memory layer:** td — Structured session and issue tracking for agents

td is for **agents**. sidecar is for **you** — the human supervising the agents.

---

## Step-by-step setup

### 1. Alacritty

```bash
brew install alacritty
```

Configure `~/.config/alacritty.toml` for your display and font preferences.

### 2. herdr

```bash
brew install herdr
```

Set up your SSH hosts and connection profiles. herdr manages your SSH config so you don't have to.

### 3. pi (the agent)

```bash
npm install -g @mariozechner/pi-coding-agent
```

Authenticate with your provider(s):
```bash
skate set open_api_key <key>
```

When your agent starts, it reads `AGENTS.md` and `just orient` to understand the project context.

### 4. Fresh (editor)

Download from [getfresh.dev](https://getfresh.dev) and install.

Configure your keybindings. Recommended:
- `CMD+P` → `Glow Preview: Toggle` (markdown preview)
- `Ctrl+Shift+M` → same (backup)

Install the Glow plugin:
```bash
ln -s /path/to/cool-pi-extensions/src/fresh/glow-preview.ts ~/.config/fresh/plugins/glow-preview.ts
```

### 5. sidecar (monitor)

```bash
brew install sidecar
```

sidecar runs alongside your agent session. It shows:
- Active worktrees and branches
- td session and issue state
- Agent conversation history
- Worktree diffs and merge status

You can watch your agent work without interfering.

### 6. td (task memory)

```bash
brew install td
```

td runs per-session. At the start of every agent context window:
```bash
td usage --new-session
```

Your agent logs progress, decisions, and blockers to td. The next agent session resumes exactly where the previous one stopped.

---

## The orient pattern

When an agent (or you) runs:
```bash
just orient
```

It reports:
- Current git branch and state
- Last commit
- Active td tasks
- Key entry points

For a new agent joining the project, `just orient` and `just help` are the two commands that matter.

---

## Provisioning check

Run at any time:
```bash
just provision
```

Checks:
- `bun`, `just` (required)
- `rtk`, `skate`, `glow` (optional)
- `pi` availability
- Fresh config presence

Flox also runs this check on `flox activate`.

---

## Typical workflow

```
# Terminal 1 — agent
alacritty
herdr connect <host>
pi

# Inside pi, before context ends
td handoff <issue-id> --done "..." --remaining "..."

# Terminal 2 — monitoring (optional)
alacritty
sidecar
```

Or inside pi, open a new tab (`Ctrl+T` in Fresh) and run Fresh + sidecar there.

---

## Key files in this repo


**`justfile`** — Task runner: `just provision`, `just orient`, `just help`
**`AGENTS.md`** — Agent instructions: Edinburgh Protocol + project context
**`MANIFEST.md`** — Full repo index
**`playbooks/dev-stack-setup.md`** — This guide
**`DEPENDENCIES.md`** — Tool dependency reference