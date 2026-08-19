---
type: brief
description: Remove spun-off mermaid-to-md work — renderer, pi extension, and 6 briefs — from this repo; it now lives in ~/dev/github/mermaid-to-md.
status: done — executed 2026-08-19 by decisions/023-spin-off-mermaid-to-md.md (the removal commit is the artifact; the brief's "decision 022" slot had been taken by the regex decision)
timestamp: 2026-07-26
td: td-ab3a97
---

# Brief: Remove spun-off mermaid-to-md work from this repo

## What

Remove the mermaid-to-md tooling, its planning briefs, and the mermaid-tui pi
extension from `cool-pi-extensions`. The work has been spun off into
`~/dev/github/mermaid-to-md`, distributed as an npm CLI package. This repo no
longer owns the renderer or the bake tool; the pi extension is **not
required** — the operator went with the npm CLI instead. This brief is frozen
when the removal work starts; the removal commit is the artifact.

## Why

The spinoff is complete: the new repo has the Rust renderer, the bake/inject
CLI, npm packaging (`install.sh` + `npm/`), and its own
`briefs`/`debriefs`/`decisions`. Leaving the tooling here is **old/new
coexistence** — the barnacle pattern Decision 009 exists to prevent. Two
copies of canonical tooling drift apart silently; one must go. The new repo
is canonical; this repo is the *consumer*.

This repo's `docs/` already carry **baked** mermaid art (committed plain
text). No renderer is needed at view time — that is the whole point of the
bake approach. For future regen, this repo invokes the external npm CLI; it
does not host the renderer.

The pi extension (`src/extensions/mermaid-tui/`, a thin wrapper that shelled
out to `src/cli/mermaid-tui/target/release/mermaid-tui`) is removed outright,
not re-pointed. The npm CLI replaced it; re-hosting the extension would
re-introduce the old/new split the spinoff resolved.

This is a Decision 009 direction change: it requires a decision record
delineating old/new/removed/retained, landed as one atomic commit. The flox
deprecation (`decisions/008`) is the precedent.

## Scope

### Remove (spun off — now canonical in `~/dev/github/mermaid-to-md`)

| Path | What |
|------|------|
| `src/cli/mermaid-tui/` | Rust renderer source (`Cargo.toml` + `src/`; `target/` build artifacts are already gitignored) |
| `src/extensions/mermaid-tui/` | pi extension (`/mermaid` + `render_mermaid`) — **not required**, npm CLI replaces it |
| `scripts/mermaid-extract.sh` | extract tool (moves with the spinoff per its brief) |
| `briefs/2026-07-23-brief-mermaid-to-md.md` | the bake tool design |
| `briefs/2026-07-23-brief-mermaid-to-md-spinoff.md` | the spinoff plan (executed) |
| `briefs/2026-07-23-brief-mermaid-extract.md` | extract tool design |
| `briefs/2026-07-23-brief-mermaid-live-preview.md` | parked live-preview design (the spinoff's future work) |
| `briefs/2026-07-23-brief-go-mermaid-renderer-01.md` | Go-renderer alternative (superseded by the Rust path that shipped) |
| `briefs/2026-07-23-brief-go-mermaid-renderer-02.md` | Go-renderer alternative (superseded) |

> The two root strays (`mermaid-to-md-demo.md`, `draft-message-to-simon-willison.md`)
> were already removed in the prior session — the new repo holds the evolved
> versions. Nothing to do here.

### Stay (this repo's own content and records)

- `briefs/2026-07-23-brief-mermaid-diagrams-for-docs.md` — record of *this*
  repo's diagram work (`td-3552ed`). Historical; stays.
- The baked mermaid diagrams in `docs/` — committed art (plain text). This
  repo's content. Untouched.
- `playbooks/diagrams-playbook.md` — this repo's diagram workflow. Stays, but
  **updated** to reference the external npm CLI.

### Update (dangling references after removal)

- `README.md` — remove/rewrite the `mermaid-tui` + `mermaid-to-md` references.
- `playbooks/diagrams-playbook.md` — point regen at the external `mermaid-to-md`
  npm CLI; no in-repo binary paths.
- Registers + `MANIFEST.md` — regenerate via `just registers` after the brief
  removal.

### Add (Decision 009 delineation)

- `decisions/022-spin-off-mermaid-to-md.md` — direction-change record: old
  direction (mermaid tooling in-repo), new direction (npm CLI from
  `~/dev/github/mermaid-to-md`), what is removed, what stays. Per Decision 009.

### td reconciliation

- `td-076e0a` (mermaid-tui epic, open) → **close** (work complete in the new repo).
- `td-3552ed` (diagrams in 4 docs, in_progress) → **close** if the committed
  diagram work is complete.
- `td-9f956f` (mermaid-tui CLI phase 1, open) → **close** (moved to the new repo).

## How

One atomic commit (Decision 009: no old/new coexistence) that:

1. `git rm`s the tooling + the 6 spun-off briefs;
2. adds `decisions/022-spin-off-mermaid-to-md.md`;
3. updates `README.md` + `playbooks/diagrams-playbook.md` to reference the
   external npm CLI;
4. regenerates registers (`just registers`);
5. `just check` green;
6. reconciles the three td tasks.

The baked diagrams in `docs/` are untouched — they are committed art, not
tooling.

## Acceptance criteria

- [ ] `src/cli/mermaid-tui/`, `src/extensions/mermaid-tui/`,
      `scripts/mermaid-extract.sh` removed.
- [ ] The 6 spun-off mermaid briefs removed; `brief-mermaid-diagrams-for-docs.md`
      stays.
- [ ] `decisions/022-spin-off-mermaid-to-md.md` records the delineation.
- [ ] `README.md` + `playbooks/diagrams-playbook.md` reference the external npm
      CLI; no dangling in-repo `src/cli/mermaid-tui` paths.
- [ ] `just registers` + `just check` green; registers reflect the removed briefs.
- [ ] `td-076e0a`, `td-3552ed`, `td-9f956f` closed with pointers to the new repo.
- [ ] Baked diagrams in `docs/` untouched.

## Out of scope

- Any work inside `~/dev/github/mermaid-to-md` — that is the new repo's domain.
- Re-adding a pi extension that wraps the npm CLI — explicitly not required;
  the operator chose the CLI.
- OKF frontmatter migration (separate epic, `td-e4dcf4`) — this removal just
  shrinks the `briefs/` set that Phase 2 (`td-813f48`) will migrate. **This
  removal should land before Phase 2** so Phase 2 does not migrate
  soon-to-be-removed briefs.
- The baked diagrams in `docs/` — they stay; regenerating them is a future
  edit, using the external CLI.

## Ordering

Land this removal **before** OKF Phase 2 (`td-813f48`, `briefs/` frontmatter
migration) — otherwise Phase 2 migrates briefs that are about to be deleted.
No hard td dependency; a sequencing note for the operator.
