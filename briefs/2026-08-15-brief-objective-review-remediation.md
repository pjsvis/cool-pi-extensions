# brief: Objective review remediation — close the gap between shipped and committed

**Created:** 2026-08-15
**Status:** pending

## What

Address the findings of the 2026-08-15 objective project review. The eval lab is real and decision-driving; the gaps are (a) uncommitted work the briefs already claim as shipped, (b) known code-quality holes in the harness, (c) data-integrity artifacts that pollute verdicts, and (d) a protocol-release cluster documented but not deployed.

## Why

The repo's own standard — "a tool you have to supervise 100% of the time isn't an assistant" — applies to the harness. Verdicts drive model admission (kimi-k3 rejected, apfel killed at 1/5). If infra failures are recorded as behavioral fails and uncommitted code drifts from the docs, the gate's output is no longer trustworthy. The moat is eval discipline; the process stack is the excuse.

## How

1. **Commit the working tree** — tokenrouter exclusive branch
   (`providers.ts:548–564`), `--provider tokenrouter`, `--run-all` mode, plus
   the 08-15 briefs. The tokenrouter brief says "shipped"; make the tree agree
   with HEAD.

2. **Fix ungraded-as-fail** — replace the `gradingStatus === "api_error"` →
   `verdict: "fail"` default (`run.ts:321`) with a distinct `ungraded` verdict
   that the aggregator excludes, not counts. Re-flag the kimi-k3 EDI-005 row.

3. **Harden the harness** — stop `catch { /* ignore */ }` at the provider
   boundary (log reason into `gradingStatus`); add schema validation for
   `loadFixture`/`loadConfig` (drop `as EvalFixture` casts); deduplicate
   `runAllMode` against the main loop so timeouts count consistently.

4. **Data hygiene** — add a schema check to `readResults`/`getRunHistory` so
   malformed lines fail loudly; document or purge the instant-fail burst and the
   comma-joined 13-model run; backfill the missing probe metadata.

5. **Resolve the v1.2.0 cluster** — either deploy the machinery (IDENT.md,
   FLIGHT_RULES.md, Justify Engine) or park it. Six documents, one release, zero
   deployed artifacts is churn; the gate must be the next artifact.

6. **Tests** — commit the first unit tests for the watchdog and the verdict
   engine (the briefs reference them; none exist).

## Acceptance criteria

- `git status` clean; tokenrouter feature committed with a reference to the brief.

- `api_error` grades produce an `ungraded` verdict, never `fail`; aggregator
  excludes them; kimi-k3 row re-flagged.

- Malformed fixture/config/log lines fail loudly or are schema-validated.

- `runAllMode` and main loop share one code path for counting; timeouts
  consistent.

- v1.2.0 either deployed (IDENT.md + FLIGHT_RULES.md exist) or explicitly parked
  in a debrief.

- At least two committed tests (watchdog + verdict engine); `just check` passes.

## Out of scope

- The pi-mathematica-verify P1 epic (separate brief; do not conflate).

- jsonl-state-reducer implementation.

- Process-doc consolidation (pre-flight 01–06) beyond what the v1.2.0 resolution
  requires.

- Rewriting the harness or migrating to a new stack.
