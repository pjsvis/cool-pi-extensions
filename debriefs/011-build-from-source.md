# Debrief: 007 — Building td and sidecar from Source

**Date:** 2026-06-12
**Status:** Complete

## What worked

**Go toolchain is portable.** `make install` and `make install-dev` worked identically across the two machines. No distro-specific packaging, no `brew` tap dependency, no version drift.

**git clone → build → symlink is repeatable.** The pattern is: clone into `~/dev/github/`, build with language-native tooling, symlink binary to `~/.local/bin/`. No infrastructure beyond `go`/`cargo`/`make`.

**Build warnings are visible, not hidden.** The `go-sqlite3` CGO warnings were benign but surfaced a real issue: this dependency compiles C code that the Go compiler does not fully control. Building from source made this visible. A pre-built binary would have hidden it.

## What caught us

**`go install` does not put the binary on `$PATH`.** This was the silent failure. `make install` succeeds, `which td` fails. The binary lands at `~/go/bin/` by default, and `~/.local/bin/` is on `$PATH` but `~/go/bin/` is not.

Our existing `just orient` calls `td current` naively. It fails with "command not found" even though the tool is built. The fix is the symlink. The lesson: always verify `PATH` after building from source.

**sidecar has a heavier dependency tree than td.** It pulls `charmbracelet/x` (various subpkgs), `go-termimg`, `go-sixel`, `mosaic`, `dither`, `resize`, `quant`, `x/image`. Many of these are for image rendering in the terminal. This is heavier than the pure-Go `td`.

## What this means for the stack

We should treat `go install` as the canonical install method for our Go tools (`td`, `sidecar`, potentially `gum`, `skate`, `glow`). Building from source removes the Homebrew dependency entirely. It also means we can pin to specific commits instead of waiting for releases.

The tradeoff is build time. `td` builds in ~3 seconds. `sidecar` builds in ~15 seconds (CGO compilation of SQLite is the bottleneck).

## Decision: adopt source-build as default

For future machines, the install sequence is:

1. Install `go` (via pacman, mise, or similar)
2. Clone repo into `~/dev/github/`
3. `make install`
4. Symlink to `~/.local/bin/`

Homebrew remains available for macOS where it is already present, but is no longer required.
