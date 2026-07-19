# External dependencies

## tldr

macOS — one block, done:

```bash
brew install bun just gum skate glow
brew tap marcus/homebrew-tap && brew install td sidecar
curl -fsSL https://pi.dev/install.sh | sh
just install-deps     # verify everything's present
```

Not on a Mac? Jump to the [Appendix — speculative map](#appendix-speculative-map). It's untested, and we won't pretend otherwise.

---

## Quick check

```bash
just install-deps
```

Checks each required binary as present (✓) or missing (✗) with an install hint; exits non-zero if anything's absent. **This checks, it doesn't install.** Run it from the repo root.

---

## Adding a new dependency

1. **Runtime dependency for an extension** (npm package) → add to that extension's `package.json`, `bun install` there. Pi resolves `node_modules/` next to extension files automatically.
2. **System binary needed by an extension at runtime** → add it to the toolkit below AND to `scripts/install-deps.sh` (the script is what `just install-deps` runs; doc and script mirror each other).
3. **Opt-in** (rare — currently none) → list under a new "Optional" section; `just install-deps` flags it optional and won't fail.

---

## Stack overview

```
alacritty → herdr → pi → [new tab] → fresh → [new tab] → sidecar
```

- **td** runs per-session for agents — session identity, issue state, handoff context.
- **sidecar** runs alongside for human supervisors — worktrees, td state, conversation history, merge workflow.
- Both via `marcus/homebrew-tap`: `brew install td sidecar`.

---

## The toolkit (narrativised)

Extensions run inside pi's runtime and need nothing extra. The tools below are the ones that earn their place — each is here because it removes a specific friction, not because it's popular. If one stops earning its place, it gets cut (the barnacle review, Decision 007).

**bun** — the JavaScript runtime that doesn't make you wait. pi's extensions and CLI tools are TypeScript; bun runs them with no config and no compile step. *We use it because a runtime that makes you wait is a tax on every command.* `brew install bun`

**just** — a task runner that reads like a Makefile and means what it says. Every entry point into this repo — `just orient`, `just browse`, `just install-deps`, `just check` — is a just target. *We use it because a discoverable command beats a remembered one.* `brew install just`

**gum** — shell prompts without a TUI framework. Powers the pickers in `just browse` and `just read`. *We use it because a script should be able to ask a question without becoming a program.* `brew install gum`

**skate** — secret storage that reads from the shell. Every provider API key in this repo resolves through `skate get` — pi-check, the eval runner, the whole provider layer. *We use it because API keys belong in a vault, not in a `.env` someone commits by accident.* `brew install skate`

**glow** — the markdown viewer, and the shared control plane. The agent writes markdown (briefs, decisions, debriefs, playbooks); the human reads it with glow. `just read`, `just browse`, `just help` all render through it. *We use it because "can I see the results?" is half the work — and the results are markdown.* `brew install glow`

**pi** — the coding agent itself; the substrate everything else runs on. *We use it because without it nothing else here has a job.* `curl -fsSL https://pi.dev/install.sh | sh`

**td** — agent task memory. Tracks session state, issues, and handoffs so a fresh session resumes where the last one stopped. *We use it because agent ephemerality without memory is amnesia, and amnesia isn't a workflow.* `brew install td` (from `marcus/homebrew-tap`)

**sidecar** — the human monitor. Runs alongside the agent to surface worktrees, td state, conversation history, merge workflow. *We use it because watching the agent work is how you catch it before it goes wrong.* `brew install sidecar` (from `marcus/homebrew-tap`)

---

## Appendix: speculative map

We've tested on macOS. We have **not** tested on Arch, Omarchy, or Windows/WSL2. What follows is a best guess at the terrain, not a verified path. If you try it and something breaks, fix it and file a PR — that's how the map becomes territory.

### Arch / Omarchy (untested)

`pacman` covers bun, just, gum, skate, glow:

```bash
pacman -S bun just gum skate glow
curl -fsSL https://pi.dev/install.sh | sh
# td, sidecar — brew-tap-only; untested on Arch. Try brew-on-Linux or build from source.
just install-deps
```

### Windows / WSL2 (untested)

No guidance. We don't ship Windows instructions because we can't verify them, and unverified instructions waste your context window with speculation. Run `just install-deps` under WSL2, install what it reports missing, file a PR for what breaks.
