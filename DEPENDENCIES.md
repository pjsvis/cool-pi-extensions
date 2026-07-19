# External dependencies

Extensions run inside pi's runtime and need nothing extra. The CLI tools and
optional integrations need a few binaries on `PATH`.

## Quick check

```bash
just install-deps
```

Run from the repo root. **This checks, it doesn't install** — it reports each
required and optional binary as present (✓) or missing (✗) with a per-binary
install hint, and exits non-zero if anything required is absent.

## Platform status

| Platform | Status |
|---|---|
| **macOS** | Known-good. Everything installs via `brew` (+ `marcus/homebrew-tap` for `td`/`sidecar`). |
| **Arch / Omarchy** | Partial. `pacman` covers `bun just gum skate glow`; `pi` via curl. **`td` and `sidecar` are brew-tap-only and untested on Arch** — try, fix, file a PR. |
| **Windows / WSL2** | Untested. Run `just install-deps`, install what it reports missing, file a PR for what breaks. |

**If you're on macOS, this is the path. If you're elsewhere, give it a try and
fix up what goes wrong — PRs welcome.**

## macOS install (known-good)

```bash
brew install bun just gum skate glow
brew tap marcus/homebrew-tap
brew install td sidecar
curl -fsSL https://pi.dev/install.sh | sh   # pi coding agent
just install-deps                             # verify
```

## Arch / Omarchy install (untested)

```bash
pacman -S bun just gum skate glow
curl -fsSL https://pi.dev/install.sh | sh
# td, sidecar — brew-tap-only in the checker; untested on Arch
just install-deps
```

## Required — CLI tools

Per-tool install lines, for when `just install-deps` reports something missing.

**`pi-models`** — needs `bun` ≥1.3.
- macOS: `brew install bun`
- Arch: `pacman -S bun`
- Other: `curl -fsSL https://bun.sh/install | bash`

**`just`** (task runner) — needs `just`.
- macOS: `brew install just`
- Arch: `pacman -S just`
- Other: `cargo install just` or https://github.com/casey/just

**`gum`** (CLI prompts) — needs `gum`.
- macOS: `brew install gum`
- Arch: `pacman -S gum`

**`pi`** (coding agent) — needs `pi`.
```bash
curl -fsSL https://pi.dev/install.sh | sh
# or
npm install -g @earendil-works/pi-coding-agent
```

**`td`** (agent task memory) — needs `td`.
- macOS: `brew install td` (from `marcus/homebrew-tap`)
- Arch: untested

**`sidecar`** (user monitor) — needs `sidecar`.
- macOS: `brew install sidecar` (from `marcus/homebrew-tap`)
- Arch: untested

**`skate`** (secret management — resolves API keys for evals + pi-check) — macOS: `brew install skate` · Arch: `pacman -S skate`

**`glow`** (markdown viewer — the human-agent control plane) — macOS: `brew install glow` · Arch: `pacman -S glow`

## Required — extensions

*None — all extensions use only pi's built-in runtime.*

## Optional — integrations

*None currently.*

## Adding a new dependency

1. **Runtime dependency for an extension** (npm package) → add it to that
   extension's `package.json`, run `bun install` there. Pi resolves
   `node_modules/` next to extension files automatically.
2. **System binary needed by an extension at runtime** → add it to the
   "Required — extensions" list above and update `scripts/install-deps.sh`
   (the script is what `just install-deps` runs; the doc and script mirror
   each other).
3. **Opt-in** (rare — currently none) → list under "Optional — integrations";
   `just install-deps` flags it as optional and won't fail.

## Stack overview

```
alacritty → herdr → pi → [new tab] → fresh → [new tab] → sidecar
```

- **td** runs per-session for agents — captures session identity, issue state,
  and handoff context so the next agent session resumes exactly where the
  previous one stopped.
- **sidecar** runs alongside the agent for human supervisors — active
  worktrees, td session state, agent conversation history, merge workflow.
- Both via `marcus/homebrew-tap`:
  ```bash
  brew install td sidecar
  ```
