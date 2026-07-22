# brief: Consolidate eval surface into a `pi-eval` CLI, reduce extension to a port

**Created:** 2026-07-22
**Status:** pending
**Protocol:** Edinburgh Protocol v1.1.0
**Supersedes:** extension design in `briefs/003-protocol-evals.md` (debrief `003`)

## What

Replace the `edinburgh-evals` pi extension (state machine + event hooks + in-session model switching) with an enhanced standalone `pi-eval` CLI as the canonical eval engine, and reduce the extension to a thin port that shells out to the CLI for the `/eval` slash command and `run_edinburgh_eval` LLM tool, plus a `model_select` advisory hook that reads the CLI's cache.

## Why

The eval surface has split into three engines with duplicated logic: the extension (~1,700 LOC, session-hijacking), the headless runner (`src/cli/pi-eval-runner.ts`, 1,243 LOC, where the real squadron work runs), and the scoring eval (`src/cli/pi-check/edinburgh-eval.ts`, 748 LOC). Two assertion engines, two grading paths, two log formats. The extension couples to pi's internal event shapes (`turn_start`, `message_update`, `assistantMessageEvent`) — the most upgrade-fragile surface in the repo — and mutates the live session mid-conversation, which is why nobody runs the squadron through it. The CLI already does ~90% of the work and more (multi-fixture, multi-provider fallback, resumable). Consolidate on the CLI; keep only the ergonomics the extension is genuinely good at.

## How

1. **Build `src/cli/pi-eval/`** — a citty CLI (`pi-eval <command>`), following the pi-check/pi-models convention. Subcommands:
   - `pi-eval run <model> [--fixture=edinburgh|iq|005b|sit|sit2] [--grader=...] [--skip-grading] [--timeout=N] [--provider=...]` — behavioral trap eval (absorbs `pi-eval-runner.ts`)
   - `pi-eval score <model> [--bare] [--grade] [--grader=...] [--grader-provider=...]` — alignment scoring (absorbs `edinburgh-eval.ts`)
   - `pi-eval matrix <model> [--grade|--triangular]` — primed/bare delta
   - `pi-eval status [model]` — read `data/eval_log.json` + `data/eval_runs.jsonl`
   - `pi-eval clear <model>` — invalidate cache
   - `pi-eval list` — available models + fixtures
   - `pi-eval fixtures` — list/validate fixtures
2. **Extract shared core** — assertions, Gemini/structured grading, fixture loading, logging — into `src/cli/pi-eval/lib/` modules imported by the subcommands. One assertion engine, one grading path, one log format (JSONL, append-only, `data/eval_log.json`).
3. **Reduce `src/extensions/edinburgh-evals/index.ts`** to ~100 LOC:
   - `/eval <model>` → shells out to `bun run src/cli/pi-eval/main.ts run <model>`, renders stdout
   - `run_edinburgh_eval` tool → same shell-out, returns CLI stdout as tool result
   - `model_select` hook → reads `data/eval_log.json` cache, warns on critical failures (no model switch, no state machine)
   - Delete: `eval-runner.ts`, `assertions.ts`, `gemini-grade.ts`, `types.ts` (logic moves to CLI lib)
4. **Migrate config** — `src/extensions/edinburgh-evals/config.json` → `src/cli/pi-eval/config.json` (or `.pi/pi-eval.json` project-local); fixture paths, grader model, cache TTL, log path.
5. **Update `scripts/eval.sh` + `justfile [eval]`** — route to `pi-eval` subcommands; keep `just eval <cmd>` facade for humans.
6. **Delete** `src/cli/pi-eval-runner.ts` and `src/cli/pi-check/edinburgh-eval.ts` once their logic is absorbed.

## Acceptance criteria

- [ ] `pi-eval run`, `score`, `matrix`, `status`, `clear`, `list`, `fixtures` subcommands all work via `just eval` and direct invocation
- [ ] One assertion engine, one grading path, one JSONL log format — no duplicated eval logic in the tree
- [ ] `src/extensions/edinburgh-evals/index.ts` is ≤150 LOC and contains no state machine, no `turn_*`/`message_update`/`tool_execution_*` event hooks, no `pi.setModel()` call
- [ ] `/eval <model>` slash command and `run_edinburgh_eval` LLM tool still work (shell out to CLI, render output)
- [ ] `model_select` advisory hook still warns on critical failures (reads CLI cache)
- [ ] Existing fixtures (`edinburgh`, `iq`, `005b`, `sit`, `sit2`) run unchanged through the new CLI
- [ ] `data/eval_log.json` format unchanged (no migration needed) or migration script provided
- [ ] `just eval status` shows the same information as before
- [ ] README + MANIFEST updated; debrief `003` cross-referenced
- [ ] `src/cli/pi-eval-runner.ts` and `src/cli/pi-check/edinburgh-eval.ts` deleted

## Out of scope

- Real-environment trajectory eval (model inside an actual pi subprocess with real tools/MVFS) — a future brief; current fixtures don't require it
- Parallel fork-based eval — parked since debrief 003; the CLI's sequential + resumable model is sufficient
- New fixtures or assertion types — consolidation only, no new test vectors
- The `data/eval_log.json` historical data migration — format stays stable
- IQ benchmark fixture redesign — carried as-is

## Approach chosen: B (CLI-first, thin extension port)

Alternatives considered: **A** (delete extension entirely — loses `run_edinburgh_eval` tool discoverability) and **C** (shared library, keep both — benchmaxxing the architecture, ~2.5 days for a feature almost no fixture uses). See session transcript for the full pros/cons + effort assessment. B is the Watt move: pragmatic improvement, one canonical engine, keep the ergonomics worth keeping.
