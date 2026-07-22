# Decision 021: Eval engine — CLI-first, thin extension port

**Date:** 2026-07-22
**Status:** Accepted
**Supersedes:** debrief 003 (extension as session-hijacking state machine)
**Epic:** td-957871
**Brief:** [2026-07-22-brief-pi-eval-cli-consolidation.md](../briefs/2026-07-22-brief-pi-eval-cli-consolidation.md)
**Debrief:** [012-pi-eval-cli-consolidation.md](../debriefs/012-pi-eval-cli-consolidation.md)

## Context

The eval surface had grown into three engines with duplicated logic:

1. **Extension** (`src/extensions/edinburgh-evals/`, ~1,700 LOC across 5 files) — a state machine that hijacked the live pi session: switched the model mid-conversation, injected trap prompts as follow-ups, captured trajectory via `turn_start`/`message_update`/`tool_execution_start`/`turn_end` event hooks, ran deterministic assertions + Gemini grading, and logged results. Coupled to pi's internal event shapes — the most upgrade-fragile surface in the repo.

2. **Headless runner** (`src/cli/pi-eval-runner.ts`, 1,243 LOC) — called Ollama/OpenRouter/Together/ZenMux directly via `fetch`; inlined assertion engine + Gemini grading; multi-fixture, multi-provider fallback, resumable, `--run-all`. This is where the real squadron work ran (SIT v1/v2, the matrix experiments, the membership review).

3. **Scoring eval** (`src/cli/pi-check/edinburgh-eval.ts`, 748 LOC) — single-scenario keyword scorer + structured reasoning grader; `--bare`/`--grade`/`--grader` flags. Its own model registry, its own provider call logic, its own persistence format.

Two assertion engines, two grading paths, two log formats. The extension's session-hijacking design meant nobody ran the squadron through it — the CLI carried ~90% of the actual work, but the extension held the ergonomics (slash command, LLM tool, advisory hook).

## Decision

**CLI-first, thin extension port (Approach B).** The `pi-eval` CLI (`src/cli/pi-eval/`) is the canonical eval engine. The extension is a ~116-LOC port that shells out to it — no state machine, no event hooks, no `pi.setModel()`.

The CLI contains one of everything: one assertion engine (`lib/assertions.ts`), one grading path (`lib/grading.ts`), one JSONL log (`data/eval_log.json`), one provider abstraction (`lib/providers.ts`), one model registry (`lib/scoring.ts`). Commands are thin wrappers: `run`, `score`, `matrix`, `status`, `list`, `fixtures`, `clear`.

The extension retains three things worth keeping:
- `/eval <model>` slash command → shells out to `pi-eval run`
- `run_edinburgh_eval` LLM tool → shells out with `--skip-grading` (discoverability for agents)
- `model_select` advisory hook → reads `data/eval_log.json` directly, warns on critical failures (no subprocess on every model switch)

### Sub-decisions

- **Grader default:** `nvidia/nemotron-3-nano-30b-a3b:free` (free, reliable) — matches the headless runner, not the extension's original `google/gemini-2.5-flash`. The extension config had a £200 billing incident in its history (debrief 003); the free grader eliminates that risk.
- **`REPO_ROOT` from `import.meta.dir`:** the CLI resolves its repo root from its own file location, not from `process.cwd()`. No cwd dependency — the CLI works from any directory.
- **Matrix in TypeScript, not bash:** the original `matrix`/`matrix-grade`/`matrix-triangular` were ~300 lines of bash with `jq` queries. Replaced with 346 LOC of TypeScript that computes the delta in-process — no `jq` dependency, no temp files, no shell quoting issues.
- **Model registry in `lib/scoring.ts`, not `lib/providers.ts`:** the scoring eval uses short tags (`kimi-k2.6`, `glm-5`) with per-model provider fallback chains — a different abstraction from the trap-eval's `org/model` slug routing. Keeping them separate avoids conflating the two.
- **`run_edinburgh_eval` tool uses `--skip-grading`:** the agent gets deterministic results fast; a human running `/eval <model>` gets the full graded eval. The tool is for the "no muppets" gate, not for deep analysis.

## Alternatives considered

- **A — CLI-only, delete the extension.** Maximum entropy reduction — one engine, no extension at all. Rejected because it loses the `run_edinburgh_eval` LLM tool — the agent's discovery path to self-triggering an eval. Discoverability is an anti-entropy property; worth 116 LOC of port code.

- **C — Shared library, keep both.** Extract assertions/grading into a shared module imported by both extension and CLI. Most effort (~2.5 days), least payoff. The extension's "real environment" advantage (evaluating a model *inside pi's actual runtime* with real tools/MVFS) is largely theoretical for current fixtures — they're text-response traps. And you keep the session-pollution problem. Benchmaxxing the architecture.

## Consequences

**Easier:**
- One assertion engine, one grading path, one log format — no duplication.
- No session hijacking — evals run in a subprocess, not in the user's conversation.
- No coupling to pi's internal event shapes (`turn_start`, `message_update`, `assistantMessageEvent`) — the extension's upgrade-fragility is gone.
- The CLI is testable and runnable outside pi (`just eval "pi run <model>"`).
- Multi-session decomposition worked cleanly: 4 tasks, 4 newups, each session read the brief + handoff, not the raw transcript. O(n) cost, not O(n²).

**Harder:**
- The extension's `run_edinburgh_eval` tool returns deterministic-only results (`--skip-grading`). An agent needing the full graded eval must shell out directly.
- Config backward compat: the config loader checks both old (`extensions/edinburgh-evals/config.json`) and new (`extensions/pi-eval/config.json`) paths. Two config locations exist — soft migration, not hard.
- Historical docs (blog posts, eval reports, decisions) still reference `edinburgh-eval.ts` and `pi-eval-runner.ts` as they existed at time of writing. These are records, not living docs — updating them would rewrite history. The living docs (README, MANIFEST, eval.sh) are updated.

**Closed off:**
- Real-environment trajectory eval (model inside an actual pi subprocess with real tools/MVFS) is explicitly out of scope. The current fixture set doesn't require it. If a future fixture needs it, the right design is a fresh pi subprocess per model — a future brief, not this one.
