# Playbook: herdr — Session Multiplexing

## What it is

herdr is a terminal session multiplexer with a daemon and TUI — like tmux, but with persistent session management across disconnections, workspace organization, and SSH-native design.

You connect to herdr. Herdr keeps everything alive. SSH drops, laptop lid closes, train enters a tunnel — reconnect and you're exactly where you left off.

This is the session layer of the terminal-native stack.

---

## Key concepts

**Workspaces** — named contexts for a project or task. Each workspace has its own tabs.

**Tabs** — terminal sessions inside a workspace. Each tab is a shell.

**Daemon** — herdr runs as a daemon. The session survives even when your SSH connection drops.

**TUI** — herdr has a terminal-native interface for managing workspaces, tabs, and sessions.

---

## Common operations

### Connect to a host and start herdr

```bash
# From your Mac
ssh user@omarchy

# On the remote, start herdr
herdr
```

### Create a workspace and tabs

```
# Inside herdr
Ctrl+B Shift+N  — create a new workspace
Ctrl+B c        — create a new tab in current workspace
Ctrl+B ,        — rename workspace
Ctrl+B n        — next workspace
Ctrl+B p        — previous workspace
```

### Typical layout for this stack

```
workspace: cool-pi-extensions
├── tab 1: pi (the agent)
├── tab 2: fresh (the editor)
├── tab 3: sidecar (the human's oversight layer)
└── tab 4: shell (auxiliary)
```

### Detach and leave everything running

```
Ctrl+B Q  — detach herdr (everything keeps running)
```

Reconnect with `herdr` and the session is restored.

### Navigate tabs within a workspace

```
Ctrl+B 1  — go to tab 1
Ctrl+B 2  — go to tab 2
Ctrl+B n  — next tab
Ctrl+B p  — previous tab
Ctrl+B l  — last tab
```

### Split panes (optional)

```
Ctrl+B v  — split vertically
Ctrl+B s  — split horizontally
```

---

## Session persistence

The key property: herdr keeps sessions alive across disconnections.

If your SSH connection drops:
1. Reconnect with `ssh user@omarchy`
2. Run `herdr`
3. Everything is exactly where it was — pi is mid-sentence, Fresh has unsaved changes, sidecar is running

This is why herdr is the session layer of the stack. The agent works in a persistent context. The human supervises in a persistent context. The network can fail; the work survives.

---

## Installation

```bash
# macOS
brew install herdr

# Linux
sudo apt install herdr  # or
curl -fsSL https://herdr.dev/install.sh | sh

# Verify
which herdr
```

Configure `~/.config/herdr/` for your preferred keybindings and themes.

---

## SSH integration

herdr is designed to run over SSH. Connect from anywhere:

```bash
ssh user@host
herdr
```

With TailScale, you can connect from any device on your private mesh:
```bash
ssh user@omarchy   # via TailScale hostname
```

---

## Tmux comparison

| | herdr | tmux |
|--|-------|------|
| Session persistence | ✓ daemon-based | ✓ with tmux server |
| TUI | native | native |
| SSH-native | designed for it | works |
| Workspaces | built-in | via windows + sessions |
| Configuration | `~/.config/herdr/` | `~/.tmux.conf` |
| Learning curve | low | medium |

Use herdr for the stack. Use tmux if you need it for other projects.

---

## See also

- [herdr.dev](https://herdr.dev)
- `playbooks/terminal-stack.md` — the full stack with herdr as the session layer
- `docs/terminal-stack.md` — architecture docs