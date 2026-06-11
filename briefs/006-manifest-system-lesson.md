# brief: Lightweight manifest system lesson

**Created:** 2026-06-11
**Status:** lesson documented

## What

Review the `TradingAgents` repo's manifest and barnacle-control system, then
decide whether a lightweight version belongs in `cool-pi-extensions`.

## Why

`cool-pi-extensions` has already accumulated small consistency drift:

- `MANIFEST.md` missed three docs
- `.flox/env/manifest.toml` still referenced the old `cli/pi-models` path
- `playbooks/terminal-stack.md` used `npm install` after the project standard
  moved to `bun install`
- A doc referenced `cli/pi-check/edinburgh-eval.ts` after the move to `src/cli/`

These are not architectural failures. They are barnacles: small barnacles, but
barnacles nonetheless.

## TradingAgents findings

`TradingAgents` has a much more formal system:

1. **`SILO_MANIFEST.md`** — single orientation document for agents.
2. **`*/INDEX.jsonl` registries** — briefs, debriefs, decisions, docs, playbooks,
   code, scripts, lexicon.
3. **`scripts/reg.ts`** — unified registry CLI (`list`, `sync`, `check`, `enrich`,
   `mine`, `import`, `promote`, `state`, `scripts`).
4. **`scripts/reg-sync.ts`** — compares disk files against JSONL indexes.
5. **`scripts/reg-check.ts`** — validates JSONL schema.
6. **`scripts/barnacle-scrubber.ts`** — mechanical + optional LLM scan for stale
   docs, path rewrites, redundant prose, and drydock quarantine.

The system is impressive, but too heavy for this repo. `cool-pi-extensions` is a
documentation/playbook repo with a small amount of source. We need the *habit*,
not the whole apparatus.

## Decision

Adopt a **bounded manifest checker**, not a full registry framework.

### Implemented

- `scripts/check-manifest.ts`
  - Ensures `MANIFEST.md` lists every file in:
    - `docs/`
    - `playbooks/`
    - `briefs/`
    - `debriefs/`
    - `decisions/`
    - `prompts/`
  - Flags stale manifest entries.
  - Checks internal markdown links resolve.
  - Checks known path drift:
    - `.flox/env/manifest.toml` must use `src/cli/...`
    - `playbooks/terminal-stack.md` must use `bun install`
    - `docs/edinburgh-protocol-eval.md` must use `src/cli/pi-check/...`
- `just check-manifest`
- Updated `MANIFEST.md` with missing docs.
- Fixed `.flox/env/manifest.toml` and `.flox/env/manifest.lock`.
- Fixed `playbooks/terminal-stack.md`.
- Fixed `docs/edinburgh-protocol-eval.md`.

## Principle

Gödel says a formal system cannot be both complete and consistent. We are not
pretending to solve completeness. We are closing the loop on the invariants we
actually care about:

- The index matches the filesystem.
- Internal links resolve.
- Old path conventions do not quietly re-enter.
- Install commands match the repo standard.

That is enough to stop barnacles forming at the documentation boundary.

## Follow-up

- Run `just check-manifest` after documentation changes.
- Add new path-drift checks only when a real migration happens.
- Do **not** import TradingAgents' full registry machinery here unless this repo
  grows into a much larger codebase.
