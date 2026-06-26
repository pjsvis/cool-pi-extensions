# Decision 008: Deprecate Flox — DEPENDENCIES.md is the Dependency Surface

**Date:** 2026-06-26  
**Status:** Accepted  
**Review:** 2026-09-21 (quarterly barnacle review)

---

## Context

Flox was adopted to provide a reproducible, pinned development environment
(primarily `bun` for the CLI tools). In practice it never fit this repo's shape:

- **Greenfield bias.** Flox's value is a pinned multi-service graph for
  reproducible builds. This repo is markdown-heavy with a few Bun CLIs and
  TypeScript extensions that run inside pi's own runtime. The dependency
  surface is a short list of system binaries, not a service graph.
- **De-facto already gone.** The tracked `.flox/` content was four runtime
  *log* files committed by accident. The declarative manifest
  (`.flox/env/manifest.toml`) was never tracked and no longer exists on disk.
  A tool whose pinning file isn't in version control is doing no pinning.
- **A second layer beneath a working one.** DEPENDENCIES.md already documents
  the real dependency surface (`bun`, `just`, `gum`, `pi`, `td`, `sidecar`,
  optional `rtk`/`skate`/`glow`) with platform install paths. Flox became a
  redundant layer beneath an already-sufficient one — the accretion that
  Decisions 006 (MVAS) and 007 (barnacle review) exist to prevent.
- **Already scheduled.** Barnacle Report 001 (2026-06-21) listed "Check for
  Flox references (first item to remove)" for Q3. Decision 007 names Flox
  references as a canonical barnacle type. The deprecation was even exchanged
  between machines as the first real cross-machine coordination event (see
  `playbooks/agent-messages-playbook.md`). This record executes a decision
  already in the tray.

The deprecation also left a half-built replacement: `just install-deps` was
advertised in DEPENDENCIES.md, README, and several docs, but the recipe did
not exist. `scripts/provision.sh` existed but checked only 2 of 6 required
binaries, gave no install hints, and was wired to nothing. Removing Flox
without making the replacement real would swap "a tool that existed, poorly"
for "a markdown file pointing at a command that doesn't" — entropy inflation
dressed as reduction.

## Decision

**DEPENDENCIES.md is the single source of truth for external dependencies.**
Flox is removed. The one-command setup it nominally provided is delivered by
`just install-deps` (implemented in `scripts/install-deps.sh`), which checks
each required and optional binary against DEPENDENCIES.md and reports missing
binaries with platform-specific install hints. It exits non-zero if any
required binary is missing, so the failure is loud.

### Scope of removal
- **Removed:** tracked `.flox/log/*.log` runtime noise; the dead Flox guard in
  `scripts/check-manifest.ts` (checked a manifest that no longer exists); the
  README line claiming Flox provides `bun`; the stale `.gitignore` Flox
  comment (replaced by a blanket `.flox/` ignore).
- **Kept (audit trail, not dead code):** the Flox-deprecation passages in
  `docs/full-stack-overview.md` and `playbooks/agent-messages-playbook.md`,
  which narrate a real coordination event. Barnacle review removes dead code,
  not history.

### Canonical command
`just install-deps` is the single canonical command. The legacy `just
provision` references in docs have been updated to `just install-deps` rather
than maintained as an alias — one verb, not two.

## Alternatives Considered

### Alternative A: Keep Flox for new contributors
- **Pros:** Reproducible env on first clone.
- **Cons:** A second layer beneath DEPENDENCIES.md; the manifest isn't even
  tracked, so it provides no real reproducibility. Maintenance cost with no
  payoff. **Reject.**

### Alternative B: Remove Flox, leave `just install-deps` as a documented gap
- **Pros:** Smaller change.
- **Cons:** Swaps a poor tool for a phantom command — entropy inflation. The
  replacement must be real. **Reject.**

### Alternative C: Keep `just provision` as an alias alongside `just install-deps`
- **Pros:** No doc edits.
- **Cons:** Two names for one command is mild accretion — the thing 006/007
  exist to prevent. **Reject.**

**Chosen:** Remove Flox *and* implement `just install-deps` as the single
canonical command, so the replacement is functional in the same change.

## Consequences

### Positive
- One dependency surface (DEPENDENCIES.md), one checker (`just install-deps`).
- No redundant reproducible-build layer for a repo that doesn't need one.
- `just install-deps` now exists and fails loudly when required binaries are
  missing, where previously the command was a phantom.

### Negative
- No pinned, reproducible environment. **Acceptable:** the dependency surface
  is small and stable; `just install-deps` reports drift on demand.
- Contributors must install system binaries themselves per DEPENDENCIES.md.

## Implementation

- `scripts/install-deps.sh` checks required (`bun just gum pi td sidecar`) and
  optional (`rtk skate glow`) binaries; exits non-zero if any required binary
  is missing. Replaces the half-built `scripts/provision.sh`.
- `just install-deps` recipe wired to the script (new `setup` group).
- Phantom command references resolved: `just provision` → `just install-deps`
  in `docs/the-vest-protocol.md` and `playbooks/omarchy-setup-playbook.md`;
  README "Start here" `just install-stack` → `just install-deps`.
- A separate aspirational phantom (`just dev` — symlinks/config/extensions)
  is out of scope here and tracked separately.

## References

- MVAS principle: `decisions/006-minimal-viable-agent-stack.md`
- Barnacle review process: `decisions/007-barnacle-review-process.md`
- Barnacle Report 001: `docs/barnacle-reports/001-2026-06-21.md`
- Dependency surface: `DEPENDENCIES.md`
- Cross-machine deprecation event: `playbooks/agent-messages-playbook.md`
