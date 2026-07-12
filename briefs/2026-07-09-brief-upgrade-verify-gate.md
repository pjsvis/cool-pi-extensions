# `upgrade-verify` (The Friction Gate)

## Mission Statement

To convert CLI-tool upgrades from fire-and-forget into upgrade → verify → confirm-or-fail. A gate that, after `brew upgrade <tool>`, asserts the binary actually changed to the expected version and still passes a tool-specific smoke canary — failing loud on any mismatch. This is the friction that makes "upgrades usually go wrong" stop being true.

Born from a real incident: a `td` upgrade was believed complete but the binary was still 0.49.0 (formula pulled, `brew upgrade` never run), unnoticed for weeks because td's automatic update-check is broken. The gate exists so that belief and territory can never diverge silently again.

## Architectural Constraints (The Silo)

* **Dependency-light by necessity.** A tool that exists to catch upgrade/dependency problems must not itself be a dependency hazard. Implemented in **POSIX shell**, zero runtime deps beyond `brew`, `jq`, and the tools under test. Not TS/Bun, not Python — ironic as that is for this repo, the gate must be the one thing that cannot break because of an upgrade.
* **External authority for "expected".** The desired version is derived live from `brew info --json=v2` (`stable` field), never hardcoded. When a new release lands, the gate knows the target without an edit.
* **Never silently succeed.** Every run ends in either `VERIFIED <tool> <version>` or a non-zero exit with specifics. No quiet pass.
* **Canaries must be side-effect-clean.** Any smoke test that mutates state (e.g., creating a throwaway td issue) cleans up via a `trap`, even on failure. Throwaways carry an obvious marker title.
* **Canary registry, not a monolith.** Each tool's smoke is an isolated script under `canaries/`. Adding a tool = adding one file + one registry entry.

## Operational Flow

### 1. Pre-snapshot

Record the installed version: `tool --version` (parsed) and `brew info --json=v2` `installed` version.

### 2. Apply

`brew upgrade <tool>`. (Later: `brew bundle upgrade` for fleet-wide, tied to the Brewfile spec — P2.)

### 3. Post-snapshot + assert

Re-read installed version. Assert `post == brew stable`. Three outcomes, all explicit:
- `post == stable` and `post != pre` → upgraded cleanly. Continue.
- `post == stable` and `post == pre` → already current. Report "current", still run smoke.
- `post != stable` → **FAIL loud.** Drift between binary and formula.

### 4. Smoke canary

Dispatch to `canaries/<tool>.sh`. The canary returns non-zero on any failure. Each canary is responsible for its own cleanup.

### 5. Report

Single block: `pre → post`, expected stable, canary result, overall verdict. Exit code reflects verdict. Designed to be read by a human *and* gated on by `just`/CI.

## The Canary Registry

| Tool | Canary | Why this canary |
| --- | --- | --- |
| `td` | Create a throwaway epic with `--description` + `--labels`, assert it succeeds, then `td delete` it; run `td status`; run `td version` (refreshes the broken auto-check cache as a pragmatic workaround until the upstream bug is fixed). | The `--description` path was broken on 0.49.0 and fixed on 0.51.0 — a perfect regression canary. `td version` refresh compensates for the auto-check bug (P4). |
| `sidecar` | `sidecar --version`; a minimal non-destructive invocation (TBD against sidecar's safe commands). | Confirms the binary runs post-upgrade. Lighter canary; sidecar has no known regression to trap for. |

New tools: add `canaries/<tool>.sh` exporting a `smoke()` function, register in the dispatch table. A tool with no canary fails the gate with `NO CANARY` — friction forbids silent skips.

## Build Phases

| Phase | Deliverable | Gate |
| --- | --- | --- |
| 1 | `scripts/verify-upgrade` shell entry: pre/upgrade/post/assert/report; `canaries/td.sh` with the throwaway-epic round-trip + cleanup trap; `just verify-upgrade td` target. | Replaying the 0.49.0 state would fail the canary (epic create errors); on 0.51.0 it passes and cleans up. |
| 2 | `canaries/sidecar.sh`; register sidecar. | `just verify-upgrade sidecar` verifies 0.86.0 end-to-end. |
| 3 | `just verify-upgrade-all` iterating a Brewfile (ties to P2 — the declarative registry). Asserts every declared tool is at spec and smoke-clean. | A deliberate version downgrade on one tool fails the gate with the exact drift. |

## Risks & Open Questions

* **Canary side effects.** The td canary creates then deletes an issue. Must use an unmistakable marker title (`zzz-verify-upgrade-<epoch>`), verify deletion in the `trap`, and never run against a board where `zzz-*` is meaningful. Deletion is soft-delete (`td delete`); acceptable.
* **Version parsing fragility.** `brew info --json=v2` wraps tap-prefixed names (`marcus/tap/td`). The extractor must normalise. Validate against `td`, `sidecar`, and one cask before trusting it.
* **`jq` dependency.** ubiquitous on macOS dev machines but technically a dep. Confirm present; if absent, gate fails loud with a clear install hint rather than silently misbehaving.
* **Scope discipline.** This gate verifies "did the upgrade take and does the tool still work" — *not* "is our whole fleet in spec." The latter is P2 (Brewfile). P3 closes the immediate gap; P2 closes the structural one. Don't let P3 creep into fleet management.

## Core Modules to Scaffold

| Module | Purpose |
| --- | --- |
| `scripts/verify-upgrade` | Shell entry. Args: `<tool>`. Orchestrates pre/upgrade/post/assert/smoke/report. Exit code = verdict. |
| `scripts/lib/brew-version.sh` | Extract installed + stable version from `brew info --json=v2`; normalise tap prefixes. |
| `scripts/canaries/td.sh` | td smoke: throwaway epic create/delete round-trip (cleanup trap), `td status`, `td version` cache refresh. |
| `scripts/canaries/sidecar.sh` | sidecar smoke: version + minimal safe invocation. |
| `justfile` | Targets: `verify-upgrade TOOL`, `verify-upgrade-all` (Phase 3). |
