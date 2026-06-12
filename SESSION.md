# Session State — 2026-06-11

## Session Goal
Formalize and document VEST Protocol (Visitor Entry Self-Teaching) as an API design pattern.
Improve repo discoverability for agents and humans.

## What's Done ✓
- [x] Created VEST Protocol spec and documentation (`docs/visitor-protocol.md`, `docs/the-vest-protocol.md`, `docs/visitor-journey.md`)
- [x] Added `just orient` — Agent orientation with td, provisioning, entry points
- [x] Added `just browse` — Human doc browser listing docs/ and playbooks/
- [x] Added `just read` — fzf-powered with easter eggs (help, vest)
- [x] Added `just adopt-edinburgh` — Symlinks Edinburgh Protocol as system prompt
- [x] Added `just dev` — Interactive herdr workspace creation with gum/terminal prompts
- [x] Removed `canon/` folder and related playbooks (canon.md, writing.md)
- [x] Added gum as project dependency
- [x] Added visual `---` section dividers to README.md
- [x] **Decision: Convert tables to bold+description lists** — Documented in `docs/decisions/table-rendering.md`

## Current Branch
`main` at commit `ae3a760` (pushed to origin)

## What's Next
1. **Review other docs for table usage** — Check docs/the-vest-protocol.md, docs/visitor-journey.md, playbooks/*.md
2. **Test `just dev`** — On Omarchy box (TailScale mesh remote)
3. **Consider blog post** — Full stack overview (alacritty → herdr → pi → fresh + glow/td/sidecar)

## Context Notes
- **VEST Protocol named**: Visitor Entry Self-Teaching — matches REST acronym pattern
- **Workspace naming**: Uses `basename $(pwd)` — "cool-pi-extensions" not "dev-stack"
- **Easter eggs**: `just read help` shows cheat sheet, `just read vest` shows VEST intro
- **Table decision**: Convert all README tables to bold+description format (ADR-001)

## Key Files
- `justfile` — Primary API entry point
- `README.md` — Updated with lists, section dividers
- `docs/visitor-protocol.md` — VEST Protocol spec
- `docs/decisions/table-rendering.md` — ADR for table rendering decision
- `docs/visitor-journey.md` — Guided tour for visiting agents
- `docs/the-vest-protocol.md` — Blog post with philosophy

## Dependencies
- `gum` — For interactive prompts in `just dev`
- `glow` — Markdown rendering
- `fzf` — File picker in `just read`
- `just` — Task runner
- `just` — Dependency management and task running