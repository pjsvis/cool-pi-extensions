# Decision 023: Spin off mermaid-to-md — this repo is the consumer

**Date:** 2026-08-19
**Status:** Accepted
**Executes:** `briefs/2026-07-26-brief-remove-mermaid-to-md.md` (status: done — this decision + the removal commit are the artifact)
**Direction change:** per Decision 009 (no old/new coexistence)
**Note:** the executing brief called this decision "022"; that slot was taken by the regex-drop decision (2026-07-27) while the removal was pending. This record is 023.

## Old direction

Mermaid tooling developed in-repo: the Rust renderer (`src/cli/mermaid-tui/`), the extract script (`scripts/mermaid-extract.sh`), the pi extension (`src/extensions/mermaid-tui/`), and six planning briefs.

## New direction

The tooling was spun off to `~/Dev/GitHub/mermaid-to-md` and distributed as an npm CLI (`mermaid-to-md`, symlinked at `~/.local/bin/mermaid-to-md`). The new repo owns the renderer, the bake/inject/verify CLI, npm packaging, and its own briefs/debriefs/decisions. Its `--inject` and `--verify` modes (the old "Phase 2, gated on demand") also shipped.

This repo is the **consumer**: committed baked art is viewable without any renderer; regeneration invokes the external CLI. No in-repo renderer, no in-repo extension.

## Delineation

| Fate | Path |
|---|---|
| Removed (canonical in the new repo) | `src/cli/mermaid-tui/`, `src/extensions/mermaid-tui/`, `scripts/mermaid-extract.sh`, the six `2026-07-23` mermaid briefs (to-md, spinoff, extract, live-preview, go-renderer-01/02) |
| Retained (this repo's content) | baked diagrams in `docs/` + `briefs/` (committed plain text), `briefs/2026-07-23-brief-mermaid-diagrams-for-docs.md` (this repo's diagram-work record), `playbooks/diagrams-playbook.md` (updated) |
| Updated | `README.md`, `playbooks/diagrams-playbook.md`, `justfile` (mermaid recipe removed with its script) |

The pi extension is **not** re-hosted: the operator chose the npm CLI; re-adding a wrapper would re-introduce the old/new split this decision resolves.

## td reconciliation

- `td-076e0a` (mermaid-tui epic) — closed: complete in the new repo.
- `td-9f956f` (CLI Phase 1) — closed: moved with the spinoff.
- `td-3552ed` — already absent from the register.
