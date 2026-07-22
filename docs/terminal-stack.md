# The Terminal-Native Stack

A coherent four-layer stack for AI-assisted development plus two infrastructure
layers for connectivity. Works identically on macOS, Linux, and Windows (via
WSL2). SSH-native — no browser, no Electron, no GUI required. Just a terminal.

## Stack overview


**Networking (TailScale)** — WireGuard mesh: connect any device to any device. macOS ✓ · Linux ✓ · WSL2 ✓
**Terminal (Alacritty)** — GPU rendering, font, clipboard. macOS ✓ · Linux ✓ · WSL2 ✓ (native Windows + WSL)
**Session multiplexing (herdr)** — Tab/session mgmt, daemon, agent orchestration. macOS ✓ · Linux ✓ · WSL2 ✓
**AI agent (pi)** — LLM-driven code gen, tool use, Edinburgh Protocol. macOS ✓ · Linux ✓ · WSL2 ✓

**Observability (td + sidecar)** — Session continuity and handoff for agents (td); human oversight layer showing all worktrees and agent state (sidecar). macOS ✓ · Linux ✓ · WSL2 ✓
**Editor (Fresh)** — Fast terminal editor, plugin system, LSP. macOS ✓ · Linux ✓ · WSL2 ✓
**Mobile SSH (Echo on iOS)** — Ghostty engine, Mosh, Face ID, touch-optimized. iOS/iPadOS ✓ · Linux — · WSL2 —

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

## The shared agent-human platform

Most dev tooling is built for either humans or agents — never both in the same
workspace. This stack is different. It's designed around a specific requirement:

**A shared context and workplace where both parties see the same things, each
use their preferred affordances, and neither loses state when reality intervenes.**

Four properties make this work:

**Shared visibility.** Both the human and the agent work in the same herdr
session. The human sees pi's output, the agent sees the editor state. sidecar
adds a third view — a live dashboard of active worktrees and td state — without
intruding on either workspace. Everyone is reading from the same page.

**Stability.** The stack is terminal-native and platform-agnostic. Alacritty
renders consistently across macOS, Linux, and Windows (WSL2). The agent sees
the same environment regardless of where it connects from. No GUI abstraction
layers, no platform-specific configuration surprises.

**Persistence.** herdr keeps sessions alive across disconnections. SSH drops,
laptop lid closes, train enters a tunnel — reconnect and everything is exactly
where it was. pi is mid-sentence. Fresh has your unsaved changes. td has the
handoff context. The workspace survives the network.

**Connectivity.** Every layer works over SSH. TailScale gives you a fixed
address on a private mesh — connect from a phone, a tablet, a Chromebook, or a
15-year-old ThinkPad. The agent works identically from anywhere.

The key insight: **the window problem is a fake problem**. Desktop window
managers differ wildly across platforms. The fix is not to pick the best one —
it's to leave the OS window manager out of it entirely. herdr sessions + Alacritty
tabs give you everything both parties need in a platform-agnostic shell.
Windows, Mac, Linux: identical experience. Same session, same context, same
shared workspace.

## The extension layer

Extensions bridge the tools, providing quality-of-life features for both agents
and users. They live in two runtimes:

### Pi extensions (TypeScript, pi SDK)

Run inside pi's Node.js runtime. Provide custom tools, slash commands, and
lifecycle hooks for the AI agent.


**silo** — Soft filesystem boundary: blocks commands with literal paths outside the repo
**defuddle** — Fetch any webpage as clean Markdown (agent-accessible tool)
**edinburgh-evals** — Model behavioral gate: Protocol trap vectors against candidate models

### CLI tools


**pi-check** — Provider connectivity checker: probes every model provider's `/models` endpoint
**pi-models** — `models.json` manager: add/remove/list/validate providers and models

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
#    Silo catches accidental excursions outside the project boundary

# 5. Review the output in Fresh
#    (in herdr tab 2 — editor)
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
**Cross-platform:** This stack ✓ (macOS, Linux, WSL2) · VS Code Remote ✓ · JetBrains Gateway ✓ · tmux + vim ✓ (Unix only)
**SSH-native:** This stack ✓ (everything) · VS Code Remote ✓ (UI is local) · JetBrains Gateway ✓ (UI is local) · tmux + vim ✓
**AI agent:** This stack ✓ (pi, in-terminal) · VS Code Remote ✓ (Copilot, sidebar) · JetBrains Gateway ✓ (AI Assistant) · tmux + vim ✗
**Session persistence:** This stack ✓ (herdr) · VS Code Remote ✗ (per-window) · JetBrains Gateway ✗ (IDE restart) · tmux + vim ✓ (tmux)
**Remote GPU needed:** This stack ✗ · VS Code Remote ✗ · JetBrains Gateway ✗ · tmux + vim ✗
**Remote GUI needed:** This stack ✗ · VS Code Remote ✗ · JetBrains Gateway ✗ · tmux + vim ✗
**Terminal-only:** This stack ✓ · VS Code Remote ✗ · JetBrains Gateway ✗ · tmux + vim ✓
**Plugin system:** This stack ✓ (Fresh + pi) · VS Code Remote ✓ (VS Code) · JetBrains Gateway ✓ (IntelliJ) · tmux + vim ✓ (vim/neovim)
**Markdown preview:** This stack ✓ (glow) · VS Code Remote ✓ (built-in) · JetBrains Gateway ✓ (built-in) · tmux + vim ✗ (external)
**Agent guardrails:** This stack ✓ (silo + evals) · VS Code Remote ✗ · JetBrains Gateway ✗ · tmux + vim ✗

## Future directions

- **herdr ↔ pi orchestration.** herdr can spawn pi sessions per-project,
  manage agent lifecycle, and route user input between editor and agent tabs.
- **Fresh compose mode + pi.** Fresh's markdown compose mode for long-form
  writing, pi for drafting and editing assistance.
- **Mobile.** The entire stack works over SSH from a phone or tablet. No mobile
  app needed — just a terminal emulator.
