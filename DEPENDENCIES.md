# External dependencies

Extensions run inside pi's runtime and only need what pi provides.
CLI tools and optional integrations may need additional binaries on `PATH`.

## Required — CLI tools

| Tool | Needs | Install |
|---|---|---|
| `pi-models` | `bun` ≥1.3 | `flox activate` (or `brew install bun`) |
| `just` (task runner) | `just` | `flox activate` (or `brew install just`) |
| `td` (agent task memory) | `td` | `brew install td` (from `marcus/homebrew-tap`) |
| `sidecar` (user monitor) | `sidecar` | `brew install sidecar` (from `marcus/homebrew-tap`) |

## Required — extensions

| Extension | Needs | Install |
|---|---|---|
| *none — all extensions use only pi's built-in runtime* | — | — |

## Optional — integrations

| Integration | Needs | Install |
|---|---|---|
| rtk (token compression) | `rtk` binary | `brew install rtk` |
| skate (secret management) | `skate` binary | `brew install skate` |
| glow (markdown preview / `just help`) | `glow` binary | `brew install glow` |

## Adding a new dependency

1. If it's a **runtime dependency for an extension** (npm package, etc.), add it
   to that extension's `package.json` and run `npm install` in that directory.
   Pi resolves `node_modules/` next to extension files automatically.

2. If it's a **system binary needed by an extension at runtime**, add it to the
   "Required — extensions" table above and update the Flox hook to check for it.

5. If it's **opt-in** (like rtk, skate, or glow), list it under "Optional — integrations"
   and the Flox hook will warn if it's missing but won't block activation.

## Flox hook

`flox activate` checks that required binaries are present and warns about
missing optional ones. See `.flox/env/manifest.toml` → `[hook]`.

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