# External dependencies

Extensions run inside pi's runtime and only need what pi provides.
CLI tools and optional integrations may need additional binaries on `PATH`.

## Required — CLI tools

**`pi-models`** — Needs: `bun` ≥1.3. Install: `bun` is available via most package managers:
- Arch: `pacman -S bun`
- macOS: `brew install bun`
- Other: `curl -fsSL https://bun.sh/install | bash`

**`just` (task runner)** — Needs: `just`. Install:
- Arch: `pacman -S just`
- macOS: `brew install just`
- Other: `cargo install just` or see https://github.com/casey/just

**`gum` (CLI prompts)** — Needs: `gum`. Install:
- Arch: `pacman -S gum`
- macOS: `brew install gum`

**`pi` (coding agent)** — Needs: `pi`. Install:
```bash
curl -fsSL https://pi.dev/install.sh | sh
# or
npm install -g @earendil-works/pi-coding-agent
```

**`td` (agent task memory)** — Needs: `td`. Install: `brew install td` (from `marcus/homebrew-tap`)

**`sidecar` (user monitor)** — Needs: `sidecar`. Install: `brew install sidecar` (from `marcus/homebrew-tap`)

## Required — extensions

**Extensions:** *none — all extensions use only pi's built-in runtime*

## Optional — integrations

**rtk (token compression)** — Needs: `rtk` binary. Install: `brew install rtk`

**skate (secret management)** — Needs: `skate` binary. Install:
- Arch: `pacman -S skate`
- macOS: `brew install skate`

**glow (markdown preview / `just help`)** — Needs: `glow` binary. Install:
- Arch: `pacman -S glow`
- macOS: `brew install glow`

## One-command setup

```bash
just install-deps
```

Checks each required and optional binary, reports what's missing, and provides
platform-specific install instructions. Run from the repo root.

## Adding a new dependency

1. If it's a **runtime dependency for an extension** (npm package, etc.), add it
   to that extension's `package.json` and run `bun install` in that directory.
   Pi resolves `node_modules/` next to extension files automatically.

2. If it's a **system binary needed by an extension at runtime**, add it to the
   "Required — extensions" table above and update `just install-deps` to check for it.

3. If it's **opt-in** (like rtk, skate, or glow), list it under "Optional — integrations"
   and `just install-deps` will flag it as optional but won't fail.

## Stack overview

```
alacritty → herdr → pi → [new tab] → fresh → [new tab] → sidecar
```

- **td** runs per-session for agents. It captures session identity, issue state,
  and handoff context so the next agent session resumes exactly where the
  previous one stopped.
- **sidecar** runs alongside the agent for human supervisors. It shows active
  worktrees, td session state, agent conversation history, and merge workflow
  in a TUI.
- Both are installed via `marcus/homebrew-tap`:
  ```bash
  brew install td sidecar
  ```