# Brief 011: Build Core Tools from Source

**Date:** 2026-06-12
**Status:** Complete
**Machines:** Omarchy (Arch), Mac (macOS)

## Context

We depend on `td` and `sidecar` for agent workflow (task tracking + session monitor). Both are distributed via a Homebrew tap (`marcus/homebrew-tap`), but `brew` is not universally available — Omarchy has no `brew`.

The traditional fix is "install brew, then brew install." But this introduces a package manager dependency for a single tool. On a system that already has `go`, `cargo`, and `make`, this is unnecessary coupling.

## Decision

Build `td` and `sidecar` from source. Clone the repos, `make install`, symlink into `$HOME/.local/bin`.

## Rationale

| Factor | Package Manager | Build from Source |
|--------|-----------------|-------------------|
| External deps | brew tap, macOS/Linux packaging | Go toolchain (already needed) |
| Supply chain surface | brew install → binary → system | Git clone → `go install` → `$GOBIN` |
| Portability | Fragile across distros | Works anywhere Go works |
| Version control | Fixed to tap releases | Can pin to any commit |
| C compiler warning visibility | Hidden in released binary | Visible at build time |

## What We Did

### td (Go)

```bash
cd /home/pjs/dev/github
git clone https://github.com/marcus/td.git
cd td
make install          # go install -ldflags "-X main.Version=v0.46.0-1-g138b0a1" .
```

**Result:** Clean build. Binary at `~/go/bin/td`.

**Issue:** `go install` puts the binary at `$(go env GOPATH)/bin`, which is not on `$PATH` by default. The justfile's `td current` call silently failed with "command not found" even though the build succeeded.

**Fix:** Symlink to a directory already on `$PATH`:
```bash
ln -sf $(go env GOPATH)/bin/td ~/.local/bin/td
```

### sidecar (Go)

```bash
cd /home/pjs/dev/github/sidecar
make install-dev      # go install -ldflags "-X main.Version=v0.85.0" ./cmd/sidecar
```

**Result:** Build succeeded with C compiler warnings from the SQLite dependency:

```
sqlite3-binding.c: In function 'sqlite3ShadowTableName':
  warning: assignment discards 'const' qualifier from pointer target type
sqlite3-binding.c: In function 'unistrFunc':
  warning: assignment discards 'const' qualifier from pointer target type
```

These are from `github.com/mattn/go-sqlite3`, a CGO wrapper. The warnings are benign (upstream library issue, not our code), but they are the kind of noise that a pre-built binary hides.

**Fix:** Same symlink pattern.
```bash
ln -sf $(go env GOPATH)/bin/sidecar ~/.local/bin/sidecar
```

## Pattern

For any Go or Rust tool:

```bash
cd ~/dev/github
git clone https://github.com/OWNER/REPO.git
cd REPO

# Go
make install          # or: go install .

# Rust
cargo install --path .

# Link
ln -sf $(go env GOPATH)/bin/TOOL ~/.local/bin/TOOL
# or
cargo install --path . --root ~/.local
```

## Candidates for future source builds

| Tool | Language | Current install | Source repo |
|------|----------|-----------------|-------------|
| just | Rust | pacman/brew | casey/just |
| gum | Go | brew | charmbracelet/gum |
| rtk | Rust | brew | (unknown) |
| skate | Go | pacman/brew | charmbracelet/skate |
| glow | Go | pacman/brew | charmbracelet/glow |
| alacritty | Rust | pacman/AUR | alacritty/alacritty |

## Open Questions

- Should `just install-deps` build `just` itself from source? (Bootstrapping problem — you'd need `just` to run the recipe.)
- Should we maintain a `~/dev/github/` convention as the build farm?
- For Go tools with heavy CGO deps (sqlite3), should we prefer pure-Go alternatives where available?
