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

# Get all test results for a specific run
cat data/eval_log.json | jq 'select(.runId == "UUID-HERE")'
```
