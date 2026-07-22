# Brief: Stack right-sizing — glow excision + silo verdict (newup handoff)

**Date:** 2026-07-20
**Status:** Phase A complete; silo assessed; remaining program handed off
**Authority:** Decision 006 (MVAS), 009 (no old/new coexistence)

## What happened this session

Four-part directive: (1-2) excise glow-fresh editor integration; (3-5) get silo working + confirm real isolation; (6-7) review MVAS / removal candidates; (8-11) create SYSTEM.md as the Protocol container. Phase A done; silo assessed; B-fix/C/D handed off.

## Phase A — glow-fresh excision: COMPLETE

Removed all traces of the glow-preview Fresh plugin. **Kept:** glow-the-CLI (powers `just read`/`browse`/`help`) and Fresh-the-editor (the human's editor in the stack).

- **Code:** `src/fresh/glow-preview.ts` deleted; `src/fresh/` dir removed.
- **Rationale:** decisions 001–004, briefs 004+007, debriefs 004+005 deleted.
- **Wiring:** justfile (`help`, `show-edinburgh`), `scripts/about.sh`, `scripts/read.sh` — the `fresh-high-contrast` glow style unlinked → plain `glow`.
- **Docs:** README, about, `docs/terminal-stack.md`, `docs/full-stack-overview.md`, `playbooks/{extensions,terminal-stack,omarchy-setup,dev-stack-setup,insights}-playbook.md` — all glow-preview sections removed; terminal-stack-playbook Step 8 deleted + steps renumbered.
- **Verification:** `just check` green; final trace sweep clean (no `glow-preview`/`fresh-high-contrast`/`Fresh plugin`/`glow-fresh`). Registers regenerated (126→118 files).
- **Lost insight (flagged):** debrief 005 "visibility-patterns" + its insights-playbook entry were 100% glow-preview-illustrated; deleted per "all trace." The principle — *don't surface affordances covered by automation; design the failure mode to teach the override* — is worth re-deriving from a different example.
- **Style file:** `~/.config/glow/styles/fresh-high-contrast.json` is no longer installed by any playbook or referenced by any script. `just help`/`show-edinburgh`/`about`/`read`/`browse` now use plain `glow` (default style) — minor visual change.

## Phase B — silo verdict: SOFT BOUNDARY, NOT HARD ISOLATION

Empirically confirmed by replicating `extractPaths`/`checkCommand` from `src/extensions/silo/index.ts` against escape vectors:

| Command | Result | Why |
|---|---|---|
| `cat /etc/passwd` | BLOCKED | absolute path extracted + checked |
| `cat ../../.ssh/id_rsa` | BLOCKED | regex's greedy `[^\s]*` tail catches `..` → `/../.ssh/id_rsa` → outside silo |
| `cat ~/secret` | BLOCKED | `~` path extracted |
| `ls ..` | **ESCAPE** | bare relative ref, no `/`/`~` token → not extracted |
| `cat /etc` (exact) | **ESCAPE** | `SYSTEM_EXACT` allowlist skips it |
| `ls /tmp` (exact) | **ESCAPE** | `SYSTEM_EXACT` allowlist skips it |
| `python -c "open(os.path.join($HOME,'.ssh','id_rsa'))"` | **ESCAPE** | runtime-constructed path, no literal |

**Verdict:** silo catches naive literal-path excursions (the cooperative agent's accidents) but fails on bare relative refs, `SYSTEM_EXACT` paths, and any runtime-constructed path. It is a **soft boundary / accident-catcher**, not hard isolation. The "hard filesystem boundary" naming (README, about, extension docstring) **overclaims**. True hard isolation needs OS-level mechanisms (chroot/namespace/container) — likely out of scope for a pi extension.

For the Protocol's purpose (belt-and-braces over the behavioral SILO DISCIPLINE), a soft boundary is a legitimate role — but it must be *honestly described*. The current naming is the defect, not the softness itself.

**Fix scope (next phase):**
1. **Reframe** the naming: "hard" → "soft" / "intent-enforcing" in README, about, silo docstring. Be honest about what it catches and what it doesn't.
2. **Tighten cheap gaps:** resolve relative paths against cwd — `exec(command, cwd, options)` already has cwd; pass it to `checkCommand`. Reconsider `SYSTEM_EXACT` (a silo should DENY `/etc`, `/tmp`, not allow them).
3. **Test:** add escape-vector tests so the boundary is *verified, not asserted* — the Derrida question applied to silo itself.

## Remaining program (subsequent phases)

- **Phase C — MVAS review (Decision 006):** now that glow-fresh is gone, review the minimal viable stack. The silo reframing feeds this: an honestly-described soft boundary may suffice for the Protocol's belt-and-braces role — or may prompt the Derrida question ("is silo even worth it as a separate tool, given the Protocol already enforces silo behaviorally?"). Candidates: anything in DEPENDENCIES.md not earning its place.
- **Phase D — SYSTEM.md:** create as the Protocol's container (first-party substrate), with DEPENDENCIES.md as third-party deps. **Resolve the relationship with `prompts/edinburgh-protocol.md`** (currently the canonical source, symlinked to `~/.pi/agent/AGENTS.md`) — per Decision 009, SYSTEM.md and `prompts/edinburgh-protocol.md` must not coexist as competing sources; one canonical location.

## How to resume

New session: read this brief + `src/extensions/silo/index.ts` + Decision 006. Order: silo fix (reframe + tighten + test) → MVAS review → SYSTEM.md. The silo fix is the leading edge.

## Locus

- `[LOC: src/extensions/silo/index.ts]` — the extension under assessment.
- `[LOC: decisions/006-minimal-viable-agent-stack.md]` — MVAS authority for Phase C.
- `[LOC: prompts/edinburgh-protocol.md]` — the Protocol SYSTEM.md must reconcile with, for Phase D.
- `[WAYPOINT: glow excised; silo verdict fixed]`
