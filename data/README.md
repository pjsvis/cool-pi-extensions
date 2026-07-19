# Eval Data

This folder contains historical evaluation results for the Edinburgh Protocol eval system.

## Files

### eval_log.json
Append-only log of individual test results. Each line is a JSON object with:
- `runId`: UUID of the eval run this result belongs to
- `modelId`: Model identifier (e.g., "inception/mercury-2")
- `testId`: Test identifier (e.g., "EDI-001-SKEPTICISM")
- `passed`: Boolean verdict
- `gradingStatus`: "graded", "skipped", "api_error", "parse_error"
- `gradingModel`: Which grader model was used
- `trajectory`: Response length, duration, etc.
- `timestamp`: Unix timestamp of when test was run

### eval_runs.jsonl
Run metadata. Each line is a JSON object with:
- `runId`: UUID matching entries in eval_log.json
- `timestamp`: When the run started
- `fixture`: Which eval suite was used ("edinburgh" or "iq")
- `models`: Array of models evaluated
- `graderModel`: Which model was used for secondary grading
- `passedTests`: Count of passing tests
- `failedTests`: Count of failing tests
- `skippedTests`: Count of timeouts/skips
- `durationMs`: Total run time

### scoring_matrix.jsonl
Primed-vs-bare delta matrix for the scoring eval. Each line is a JSON object with:
- `condition`: "primed" (Edinburgh Protocol system prompt) or "bare" (minimal "You are a helpful assistant" prompt)
- `tag`: Model short name (e.g., "nemotron-nano")
- `model`: Full model identifier
- `tier`: "premium", "mid", "budget", "free", or "coding-plan"
- `cost`: Cost string
- `total`: Score out of maxTotal
- `maxTotal`: Maximum possible score (19)
- `scores`: Per-criterion score breakdown
- `totalTokens`: Token count for the response
- `ms`: Response latency in milliseconds
- `timestamp`: Unix epoch-millis when the eval was run
- `error`: Error message if the eval failed, otherwise null

The delta (primed − bare) measures whether the Edinburgh Protocol actually
changes model behavior. Zero or negative delta = ceremony, not anti-entropy.

## Principles

1. **Append-only**: Never delete entries, only add new ones
2. **Visible**: This folder is tracked in git, not .gitignored
3. **Persistent**: Results survive across machines/clones
4. **Historical**: All runs preserved for variance analysis

## Query Examples

```bash
# Get all runs for a specific model
cat data/eval_runs.jsonl | jq 'select(.models | contains(["inception/mercury-2"]))'

# Get variance over time
cat data/eval_runs.jsonl | jq '[.timestamp, .passedTests, .totalTests]'

# Get primed-vs-bare delta for all models in the latest matrix run
cat data/scoring_matrix.jsonl | jq -s 'group_by(.tag) | map({
  tag: .[0].tag,
  primed: ([.[] | select(.condition=="primed") | .total] | last),
  bare: ([.[] | select(.condition=="bare") | .total] | last)
}) | map(.delta = (.primed - .bare))'

# Get all test results for a specific run
cat data/eval_log.json | jq 'select(.runId == "UUID-HERE")'
```
