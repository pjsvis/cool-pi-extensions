# The Terminal-Native Stack

A coherent four-layer stack for AI-assisted development plus two infrastructure
layers for connectivity. Works identically on macOS, Linux, and Windows (via
WSL2). SSH-native — no browser, no Electron, no GUI required. Just a terminal.

## Stack overview

| Layer | Tool | Role | macOS | Linux | WSL2 |
|---|---|---|---|---|---|
| Networking | **TailScale** | WireGuard mesh — connect any device to any device | ✓ | ✓ | ✓ |
| Terminal | **Alacritty** | GPU rendering, font, clipboard | ✓ | ✓ | ✓ (native Windows + WSL) |
| Session multiplexing | **herdr** | Tab/session mgmt, daemon, agent orchestration | ✓ | ✓ | ✓ |
| AI agent | **pi** | LLM-driven code gen, tool use, Edinburgh Protocol | ✓ | ✓ | ✓ |
| Editor | **Fresh** | Fast terminal editor, plugin system, LSP | ✓ | ✓ | ✓ |
| Mobile SSH | **Echo** (iOS) | Ghostty engine, Mosh, Face ID, touch-optimized | iOS/iPadOS | — | — |

### Why this over VS Code Remote / JetBrains Gateway

- **Cross-platform, single code path.** macOS, Linux, and Windows (via WSL2) —
  same setup, same tools, same keybindings. No platform-specific configuration,
  no "works on Linux but not macOS" surprises.
- **WSL2 as first-class target.** Alacritty runs natively on Windows; connects
  to WSL2 for the Linux toolchain. herdr, pi, and Fresh run inside WSL2. The
  experience is identical to native Linux.
- **Zero GUI dependency.** Everything renders in the terminal. No X forwarding, no
  VNC, no Remote Desktop. Works over `ssh` from a phone, a tablet, a Chromebook,
  or a 15-year-old ThinkPad.
- **Session persistence.** herdr keeps pi and the editor alive across
  disconnections. SSH drops? Reconnect and you're exactly where you left off.
  No `tmux` required — herdr handles it natively.
- **Local rendering, remote execution.** Alacritty handles the pixels. Everything
  else runs on the remote machine. Latency only affects display, not compute.
- **No sync conflicts.** There is no local copy of the project. The editor opens
  files directly on the remote. The agent has direct filesystem access. No
  "remote file system" abstraction layer that breaks `git`, `find`, or shell
  scripts.

## The extension layer

Extensions bridge the tools, providing quality-of-life features for both agents
and users. They live in two runtimes:

### Pi extensions (TypeScript, pi SDK)

Run inside pi's Node.js runtime. Provide custom tools, slash commands, and
lifecycle hooks for the AI agent.

| Extension | Role |
|---|---|
| **silo** | Hard filesystem boundary — agent can't read/write outside the repo |
| **defuddle** | Fetch any webpage as clean Markdown (agent-accessible tool) |
| **edinburgh-evals** | Model behavioral gate — Protocol trap vectors against candidate models |

### Fresh plugins (TypeScript, QuickJS)

Run inside Fresh's sandboxed QuickJS runtime. Provide virtual buffers, overlays,
and external tool integration for the human user.

| Plugin | Role |
|---|---|
| **glow-preview** | Full-screen Glow-rendered markdown preview. Toggle with keybind, auto-refresh on save, ANSI-color-matched to Fresh's theme. |

### CLI tools

| Tool | Role |
|---|---|
| **pi-check** | Provider connectivity checker — probes every model provider's `/models` endpoint |
| **pi-models** | `models.json` manager — add/remove/list/validate providers and models |

## SSH workflow — a day in the life

```bash
# 1. Connect from anywhere — even a phone
#    TailScale gives your device a fixed IP on your private mesh
#    Echo on iOS gives you a beautiful terminal + Mosh for flaky connections

# 2. herdr picks up your previous session
#    pi is still running, Fresh is still open, buffers are intact

# 3. Ask pi to implement a feature
#    (in herdr tab 1 — pi session)
> implement user auth middleware

# 4. Pi writes code, runs tests, commits
#    Silo keeps it inside the project boundary

# 5. Review the output in Fresh
#    (in herdr tab 2 — editor)
#    Toggle glow-preview to read the updated README
#    Check the new tests, make edits

# 6. SSH drops — train tunnel, wifi blip, laptop lid
#    Reconnect. herdr restores everything.
#    pi is mid-sentence. Fresh has your unsaved changes.

# 7. Push and deploy from the terminal
#    No context switch. No "where was I?"
#    No GUI. No browser. Just text.
```

### Mobile access: Echo + TailScale

For iPhone and iPad, **Echo** ($2.99, one-time purchase) provides a native SSH
and Mosh client built on the Ghostty engine. It includes:

- **Face ID + Keychain** for passwordless auth
- **Mosh** for resilience on flaky mobile connections
- **A custom keyboard toolbar** with quick-access terminal symbols
- **Full iPad multitasking** — Split View, Stage Manager, hardware keyboard

Combined with **TailScale**'s mesh networking, your iPhone has a fixed IP on
your private network. You SSH directly to your development machine without
port forwarding, jump hosts, or complex SSH config. Echo connects, TailScale
routes, herdr restores. Three tools, zero friction.

## Local-first design

The stack doesn't *require* SSH to shine. All four tools run identically on
macOS, Linux, and under WSL2. The SSH path is a strict superset:

- **Local:** Alacritty → herdr → pi + Fresh (all on one machine)
- **Remote:** Alacritty → ssh → herdr → pi + Fresh (on remote)
- **WSL2:** Alacritty (Windows) → WSL2 → herdr → pi + Fresh (inside WSL2)

No configuration changes between modes. No "works locally, breaks remotely."
The editor doesn't care where the filesystem is. The agent doesn't care where
the CPU is.

## Architecture principles

1. **Terminal is the platform.** The terminal emulator is the only UI surface.
   No web views, no sidecar GUIs, no popup dialogs. Everything is text and
   ANSI escape sequences.

2. **Filesystem is the database.** Files, not APIs. git, not a proprietary sync
   protocol. The editor opens real files on a real filesystem. Tools read real
   config from `~/.config/`.

3. **Composability over integration.** Tools communicate through the filesystem
   and stdin/stdout, not through bespoke IPC protocols. Glow doesn't need to
   know about Fresh. Fresh doesn't need to know about pi. They share a terminal
   and a filesystem, and that's enough.

4. **SSH as universal remote.** No custom protocol, no agent, no daemon — just
   SSH. If you can `ssh` to it, you can run the full stack on it.

## Comparison matrix

| | This stack | VS Code Remote | JetBrains Gateway | tmux + vim |
|---|---|---|---|---|
| **Cross-platform** | ✓ (macOS, Linux, WSL2) | ✓ | ✓ | ✓ (Unix only) |
| **SSH-native** | ✓ (everything) | ✓ (UI is local) | ✓ (UI is local) | ✓ |
| **AI agent** | ✓ (pi, in-terminal) | ✓ (Copilot, sidebar) | ✓ (AI Assistant) | ✗ |
| **Session persistence** | ✓ (herdr) | ✗ (per-window) | ✗ (IDE restart) | ✓ (tmux) |
| **Remote GPU needed** | ✗ | ✗ | ✗ | ✗ |
| **Remote GUI needed** | ✗ | ✗ | ✗ | ✗ |
| **Terminal-only** | ✓ | ✗ | ✗ | ✓ |
| **Plugin system** | ✓ (Fresh + pi) | ✓ (VS Code) | ✓ (IntelliJ) | ✓ (vim/neovim) |
| **Markdown preview** | ✓ (glow-preview) | ✓ (built-in) | ✓ (built-in) | ✗ (external) |
| **Agent guardrails** | ✓ (silo + evals) | ✗ | ✗ | ✗ |

## Future directions

- **herdr ↔ pi orchestration.** herdr can spawn pi sessions per-project,
  manage agent lifecycle, and route user input between editor and agent tabs.
- **Fresh compose mode + pi.** Fresh's markdown compose mode for long-form
  writing, pi for drafting and editing assistance.
- **Additional Fresh plugins.** Git blame overlays, file diffs, LSP-aware
  navigation — expanding the editor into IDE territory without leaving the
  terminal.
- **Mobile.** The entire stack works over SSH from a phone or tablet. No mobile
  app needed — just a terminal emulator.
