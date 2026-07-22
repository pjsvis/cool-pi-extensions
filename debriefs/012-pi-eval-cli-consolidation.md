# Debrief: 012 — pi-eval CLI consolidation

**Date:** 2026-07-22
**Status:** Complete
**Epic:** td-957871
**Brief:** [2026-07-22-brief-pi-eval-cli-consolidation.md](../briefs/2026-07-22-brief-pi-eval-cli-consolidation.md)
**Supersedes:** debrief 003 (extension design)

## What we built

Consolidated three eval engines (extension state machine, `pi-eval-runner.ts`, `edinburgh-eval.ts`) into one canonical `pi-eval` CLI at `src/cli/pi-eval/`. The extension was reduced from a 532-LOC session-hijacking state machine to a 116-LOC thin port that shells out to the CLI.

### The numbers

| Metric | Before | After | Delta |
|---|---|---|---|
| Extension `index.ts` | 532 LOC | 116 LOC | −78% |
| Extension engine files | 4 (39 KB) | 0 | deleted |
| `pi-eval-runner.ts` | 1,243 LOC | 0 | absorbed |
| `edinburgh-eval.ts` | 748 LOC | 0 | absorbed |
| `pi-eval` CLI (new) | — | 2,832 LOC | canonical |
| Eval engines | 3 (duplicated) | 1 | consolidated |
| Assertion engines | 2 | 1 | unified |
| Grading paths | 2 | 1 | unified |

### Architecture: CLI-first, thin extension port (Approach B)

The CLI is the canonical engine. The extension is a port — it provides ergonomics (slash command, LLM tool, advisory hook) without containing any eval logic.

```
src/cli/pi-eval/
├── lib/                    shared canonical engine
│   ├── types.ts            all interfaces
│   ├── fixtures.ts         registry, loading, validation (6 fixtures)
│   ├── config.ts           home + project config loader
│   ├── providers.ts        multi-provider calls + tool loop + fallbacks
│   ├── assertions.ts       deterministic engine (regex/tool/dot_parse)
│   ├── grading.ts          behavioral + reasoning graders + verdict combiner
│   ├── logging.ts          JSONL log, run metadata, cache, invalidation
│   ├── scoring.ts          keyword scorer + model registry + evaluateModel()
│   └── index.ts            barrel
├── commands/
│   ├── run.ts              behavioral trap eval
│   ├── score.ts            alignment scoring
│   ├── matrix.ts           primed/bare delta (--grade, --triangular)
│   ├── status.ts           cached results
│   ├── list.ts             available models
│   ├── fixtures.ts         list + validate
│   └── clear.ts            cache invalidation
├── main.ts                 citty subcommand router
└── config.json             migrated config

src/extensions/edinburgh-evals/
└── index.ts                116-LOC thin port (shells out to CLI)
```

## Architecture decisions that worked

### Multi-session discipline (4 newups)

The epic was decomposed into 4 tasks, each a bounded session with `td handoff` → `/clear` → resume from `td context`. Each session read the brief (frozen spec, 5 KB) + the prior handoff (compressed state), not the raw transcript. This kept cost O(n) in turns, not O(n²). Four sessions, four commits, four clean reviews.

### CLI as source of truth, extension as port

The CLI does the work; the extension provides discoverability. The `run_edinburgh_eval` LLM tool is how an agent discovers it can eval a model without the human remembering the CLI incantation. Worth 116 LOC. The `model_select` advisory hook reads `data/eval_log.json` directly — no subprocess latency on every model switch.

### Shared lib extracted first (task 1 was the load-bearer)

Extracting the shared lib (`types.ts`, `providers.ts`, `assertions.ts`, `grading.ts`, `logging.ts`) before building commands meant tasks 2–3 were additive, not restructive. The lib is the stable substrate; commands are thin wrappers.

### Matrix command in TypeScript, not bash

The original `matrix`/`matrix-grade`/`matrix-triangular` were ~300 lines of bash with `jq` queries. The replacement is 346 LOC of TypeScript that computes the delta in-process — no `jq` dependency, no temp files, no shell quoting issues. The `printf` helper handles ANSI-safe column alignment.

## Things we'd do differently

### The `run_edinburgh_eval` tool uses `--skip-grading`

The LLM-callable tool skips Gemini grading for speed (the agent gets deterministic results). A human running `/eval <model>` gets the full eval with grading. This is the right tradeoff for agent-in-the-loop, but it means the tool's results are a subset of the slash command's. If an agent needs the full graded eval, it should shell out directly.

### Config backward compat

The config loader checks both the old path (`extensions/edinburgh-evals/config.json`) and the new path (`extensions/pi-eval/config.json`). This is pragmatic but means two config locations exist. Task 4 could have removed the old config, but the symlinked extension still reads it. The migration is soft, not hard.

### Historical docs still reference old paths

Blog posts, eval reports, and decisions reference `edinburgh-eval.ts` and `pi-eval-runner.ts` as they existed at time of writing. These are historical records — updating them would rewrite history. The living docs (README, MANIFEST, eval.sh) are updated; the historical docs are not.

## Design principles validated

1. **CLI-first.** The CLI is the canonical engine. The extension is a port, not a parallel implementation. One assertion engine, one grading path, one log.

2. **No session hijacking.** The old extension switched the model mid-conversation and captured trajectory via event hooks. The new extension shells out — the eval runs in a subprocess, not in the user's session.

3. **Multi-session safety.** The brief was the frozen spec; handoffs were the compressed state. Four sessions, four newups, zero context overflow.

4. **Discoverability is anti-entropy.** The `run_edinburgh_eval` tool lets an agent self-trigger an eval. The `model_select` hook warns on critical failures. These are worth 116 LOC of port code.

## Files changed

| File | Change |
|---|---|
| `src/cli/pi-eval/` (new, 14 files) | Canonical eval engine — lib + commands + main |
| `src/extensions/edinburgh-evals/index.ts` | 532 → 116 LOC (thin port) |
| `src/extensions/edinburgh-evals/{eval-runner,assertions,gemini-grade,types}.ts` | Deleted (logic in CLI lib) |
| `src/cli/pi-eval-runner.ts` | Deleted (absorbed into `pi-eval run`) |
| `src/cli/pi-check/edinburgh-eval.ts` | Deleted (absorbed into `pi-eval score` + `matrix`) |
| `scripts/eval.sh` | Routes `edinburgh`/`traps`/`matrix*` to `pi-eval` CLI; dead bash functions removed |
| `README.md` | Updated extension + CLI sections |
| `MANIFEST.md` | Source section updated |

## Cross-references

- Brief: [2026-07-22-brief-pi-eval-cli-consolidation.md](../briefs/2026-07-22-brief-pi-eval-cli-consolidation.md)
- Prior debrief: [003-protocol-evals.md](003-protocol-evals.md) (original extension design)
- Epic: td-957871 (4 tasks, all closed)
