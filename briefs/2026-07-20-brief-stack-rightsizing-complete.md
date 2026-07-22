# Brief: Stack right-sizing — completion + newup (4 phases)

**Date:** 2026-07-20
**Status:** All 4 phases done; 2 tidy items handed off; newup point
**Supersedes:** `briefs/2026-07-20-brief-silo-and-stack-newup.md` (handed off B/C/D — now done)

## Done this session (all verified: `just check` + `just test` green)

**Phase A — glow-fresh excision:** plugin + decisions 001–004 + briefs 004/007 + debriefs 004/005 deleted; justfile / `scripts/about.sh` / `scripts/read.sh` unlinked from the `fresh-high-contrast` glow style (→ plain `glow`); README / about / docs / playbooks cleaned; terminal-stack-playbook Step 8 removed + renumbered. Trace sweep clean. Kept glow-the-CLI + Fresh-the-editor. *Lost:* debrief 005 visibility-patterns insight (glow-preview-illustrated) — worth re-deriving from another example.

**Phase B — silo fix:** extracted pure logic to `src/extensions/silo/check.ts` (cwd-aware, removed the `SYSTEM_EXACT` allow-list that let `/etc`/`/tmp` through, URL-strip so `curl` isn't false-flagged, bare-`..` detection); `index.ts` wired to it + docstring reframed "hard"→"soft"; `check.test.ts` pins 11 boundary vectors (all pass); `just test` target added; docs reframed. Verdict stood and is now honest: **SOFT boundary** — catches the cooperative agent's accidents, not adversaries (runtime-constructed paths, symlinks escape). Belt-and-braces over the behavioural SILO DISCIPLINE, not a replacement.

**Phase C — MVAS review:** one confirmed barnacle — **`gum`** (listed in DEPENDENCIES, checked by install-deps, used by *no* script; `fzf` does the picking but is unlisted). silo is the Derrida question; verdict: keep, as an honestly-described soft boundary.

**Phase D — SYSTEM.md:** Protocol moved to root `SYSTEM.md` (canonical first-party source); `prompts/edinburgh-protocol.md` → compat symlink to `../SYSTEM.md` (every ref resolves, incl. `~/.pi/agent/AGENTS.md` — nothing breaks); high-value refs updated (`adopt-edinburgh.sh`, justfile `show-edinburgh`, README); brief 2026-07-17 checklist marked done. Root is the container: `SYSTEM.md` (Protocol) + `DEPENDENCIES.md` (third-party) + `AGENTS.md` (repo boundary). The move was a *parked* decision (brief 2026-07-17 proposed it; Decision 018 deferred it for the symlink-break risk — resolved here via the compat symlink).

## Remaining (handed off — both low-risk, no breakage, ideal for a fresh context)

1. **gum→fzf swap:** remove `gum` from `DEPENDENCIES.md` + `scripts/install-deps.sh`; add `fzf` (used by `read.sh`/`browse.sh`). Confirmed unused. ~4 edits across 2 files.
2. **SYSTEM.md descriptive-ref tidy:** ~15 refs across decisions (006/007/013/015/018), briefs (013-lightweight-system), playbooks (terminal-stack/omarchy/repo-setup-retrofit/docs/014), `docs/barnacle-reports/001`, `blog/PROJECT.md`, `scripts/sync-pi-to-omarchy.sh` still say `prompts/edinburgh-protocol.md`. All *resolve* via the compat symlink (nothing broken); tidy to `SYSTEM.md` for full 009 cleanliness.

## How to resume

New session: `just orient` + read this brief. The 2 tidy items are independent and small. Repo is in a verified-clean state.

## Locus

- `[LOC: src/extensions/silo/]` — `check.ts`, `check.test.ts`, `index.ts` (Phase B).
- `[LOC: SYSTEM.md, prompts/edinburgh-protocol.md (symlink)]` — Phase D canonical move.
- `[WAYPOINT: 4-phase stack right-sizing complete]`
