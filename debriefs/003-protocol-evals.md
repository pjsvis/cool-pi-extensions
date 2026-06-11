# Debrief: 003 — Edinburgh Protocol Model Evals

**Date:** 2026-06-09
**Status:** Complete
**TD Epic:** td-52776a

## What we built

An extension (`edinburgh-evals`) that evaluates any model against the Edinburgh Protocol's behavioral contract. It injects 4 trap prompts, captures the full response trajectory, and grades compliance through a two-pass system: deterministic assertions (regex + tool traces) and Gemini Flash secondary grading via OpenRouter.

## Architecture decisions that worked

### State machine over async deadlock

Pi's command handlers and agent loop share the same event loop — you cannot `await` an agent turn from inside a command handler. The solution: a module-scope state machine driven by event hooks (`before_agent_start`, `turn_start`, `message_update`, `tool_execution_start`, `turn_end`). The command handler fires the first shot and returns; the hooks process results and queue subsequent tests. This is the same pattern pi uses internally for compaction.

### Two-pass grading: deterministic floor, Gemini ceiling

Pass 1 uses regex and tool-call traces — zero tokens, instant, never hallucinates. Pass 2 uses Gemini Flash with a structured rubric — slower and costs tokens, but catches subtleties regex misses (contextual sycophancy, nuanced appeals to authority). The combination strategy:

- Critical deterministic failures → fail (no appeal)
- All deterministic passes → pass (Gemini can override at >85% confidence)
- Mixed → Gemini tiebreaks
- No Gemini available → deterministic-only with warning

This means the system never degrades below the quality of deterministic checks, and it improves when Gemini is available.

### Grading status transparency

Initially, Gemini fallback was silent — if grading failed, the status display simply omitted the Gemini line. The user pointed out this was a UX gap. The fix: a `GradingStatus` enum (`graded | skipped | no_key | api_error | parse_error`) threaded through every layer, with a summary warning in the status display when grading is unavailable.

### OpenRouter over direct Gemini API

The user had a £200 billing incident with the Gemini API. Routing the grader through OpenRouter avoids that risk — same model, same quality, but billed through the user's existing OpenRouter account with its own rate limits and cost controls.

## Things we'd do differently

### The fixture is stack-coupled

The 4 trap tests reference Bun, SQLite, Hono, and HTMX. A model could be an excellent Protocol-compliant engineer and fail EDI-003 (Bun-native APIs) because it doesn't know Bun. The fix — categorizing tests as `reasoning` vs `stack_specific` and making stack tests `warning` severity — is a patch, not a solution. A better approach: separate fixture files for different stacks, with the Protocol compliance tests being stack-agnostic.

### The regex assertions need maintenance

Patterns like `/(?i)(absolutely|excellent choice|modern enterprise|...)/` are brittle. Models change their phrasing over time. The Gemini secondary grading partially mitigates this, but the ideal state is a periodically-reviewed pattern library, not a one-time regex.

### Fork-based parallelism wasn't implemented

The brief specified parallel forks for each test case. The current implementation runs tests sequentially within a single session via follow-up messages. This is simpler and avoids model-switching races, but it's slower. For a 4-test suite with tool-calling models, the difference is negligible. For larger suites, this would matter.

## Design principles validated

1. **Cache-first.** Every `/eval` check hits the cache before spending tokens. With a 168h TTL, repeated evaluations are free. This makes periodic checking practical.

2. **Advisory, not authoritarian.** The `model_select` hook warns but doesn't block. The eval is an impartial spectator, not a censor. The human always has the final say.

3. **Configurable grader.** The grader model is in config, not hardcoded. Swap `google/gemini-2.5-flash` for `google/gemini-2.5-pro` or any other OpenRouter model without code changes.

## Files changed

| File | Lines | Purpose |
|---|---|---|
| `extensions/edinburgh-evals/types.ts` | 176 | Type definitions: fixture, trace, assertions, grading status |
| `extensions/edinburgh-evals/assertions.ts` | 198 | Deterministic assertion engine (5 assertion types) |
| `extensions/edinburgh-evals/gemini-grade.ts` | 297 | Gemini Flash grading via OpenRouter |
| `extensions/edinburgh-evals/eval-runner.ts` | 466 | Suite runner, cache, logging |
| `extensions/edinburgh-evals/index.ts` | 532 | Extension entry: /eval command, state machine, event hooks |
| `extensions/edinburgh-evals/config.json` | 7 | Default config |
| `extensions/edinburgh-evals/package.json` | 10 | Pi extension metadata |
| `prompts/edinburgh-protocol-evals-v1.json` | 111 | Test fixture (updated with category/severity) |
| `README.md` | +30 | Extension documentation |

## Next steps

- Add more test fixtures for different stacks (Python/Django, Rust/Actix, etc.)
- Implement `/eval all` for batch evaluation
- Build a comparison matrix view (`/eval compare model1 model2`)
- Periodically review and update regex patterns as model behavior evolves
