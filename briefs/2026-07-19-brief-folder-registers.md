# brief: Auto-maintained JSONL registers as a structural checksum

**Created:** 2026-07-19
**TD:** td-0c8a0c
**Status:** in-progress
**Protocol:** Edinburgh Protocol v1.1.0

## What

One generator (`scripts/gen-registers.ts`) emits a `register.jsonl` in each registered folder and rolls them up into an auto-generated `MANIFEST.md`. A refactored `scripts/check-manifest.ts` verifies register↔filesystem (presence) and MANIFEST↔registers, blocking on divergence. The hand-maintained `MANIFEST.md` becomes a generated artifact; drift becomes impossible in content and loud in freshness.

## Why

`MANIFEST.md` is 13 files behind reality (verified: `bun run scripts/check-manifest.ts`). `check-manifest.ts` already computes that delta but doesn't bite. The entropy is a broken feedback loop, not a missing artifact: a hand-edited index will always drift. A *generated* register cannot drift in content — only in freshness — and a blocking gate makes staleness loud. This is the Shannon move: the register is a fixed function of the territory, and `git diff` on it *is* the structural delta. Substance is out of scope — that is the Derrida Question's wall, not the checksum's.

## How

**Registered folders:** `briefs`, `debriefs`, `decisions`, `playbooks`, `docs`, `prompts`. Excluded: `data`, `blog`, `src`, `models` — content, not process; git is their register. (One array in the generator; add folders by editing it.)

**Register schema (uniform, all folders):**

| field | source |
|---|---|
| `path` | filesystem walk, repo-relative, sorted |
| `title` | first `# ` heading, else YAML `title:`, else filename slug |
| `description` | YAML `dek`/`description` if present; else first non-heading non-frontmatter line; truncated 120 chars |
| `status` | best-effort (brief/decision status line); omitted if absent |
| `sha` | sha256 of contents, 12 hex chars |
| `bytes` | file size |

**Generator (`scripts/gen-registers.ts`):** deterministic — sorted paths, stable field order. Two outputs per run: `<folder>/register.jsonl` (one line per file) and `MANIFEST.md` (roll-up, static section headers per folder, descriptions from registers).

**Checker (`scripts/check-manifest.ts` refactor):** for each registered folder, assert register path-set == filesystem path-set (missing + stale = exit 1). Assert `MANIFEST.md` matches generated content (exit 1). Retain the link-resolution and path-drift (npm/cli) advisory checks.

**Gate discipline:** ship non-blocking first (matches `semantic-integrity.ts` v1 precedent). Flip to blocking once a clean `just registers` + `just check` cycle is verified. The blocking flip is the whole value — a register without a gate is ceremony.

**Facade:** `just registers` (generator); `just check` (verifier). `registry` (singular) stays the provider registry.

## Acceptance criteria

- [ ] `scripts/gen-registers.ts` emits `register.jsonl` in all 6 registered folders; output is deterministic across runs
- [ ] `MANIFEST.md` regenerated from registers; `just help`/`just browse` still render
- [ ] `scripts/check-manifest.ts` verifies register↔filesystem + MANIFEST↔registers; link + path-drift checks retained
- [ ] `just registers` and `just check` recipes added (hygiene group)
- [ ] All 6 registers committed; `just check` passes clean
- [ ] `td` handoff + debrief note the blocking-flip as deferred work

## Out of scope

- Content-level (sha) enforcement as blocking — informational only in v1; promote later if wanted.
- Rich per-folder schemas — uniform core only. True registries (conceptual-lexicon.jsonl, equations.jsonl) stay separate species.
- Retrofitting YAML frontmatter onto existing files — description extraction degrades gracefully; weak descriptions are a semantic (Derrida) concern.
- CI — none visible; the agent regenerates as part of any commit touching a registered folder (playbook discipline).
