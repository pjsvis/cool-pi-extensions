#!/usr/bin/env bash
# Resumable Stuff-into-Things v2 eval — skips models that already have all 15 tests
# Assumes models do not change underneath us. Re-run anytime; only incomplete models run.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
GRADER="qwen/qwen3.7-plus"
LOG_PATH="$REPO_ROOT/data/eval_log.json"
EXPECTED=15  # SIT-001 through SIT-015

# All pack models with provider routing
# Format: "model_slug|provider"  (provider empty = OpenRouter default)
declare -a MODELS=(
  "anthropic/claude-sonnet-4.5|zenmux"
  "anthropic/claude-opus-4.8|zenmux"
  "anthropic/claude-fable-5|"
  "openai/gpt-5|zenmux"
  "x-ai/grok-4.3|zenmux"
  "x-ai/grok-build-0.1|zenmux"
  "minimax/minimax-m3|zenmux"
  "deepseek/deepseek-v4-pro|zenmux"
  "google/gemini-2.5-pro|zenmux"
  "qwen/qwen3.7-max|zenmux"
  "qwen/qwen3.7-plus|zenmux"
  "xiaomi/mimo-v2.5-pro|zenmux"
  "inclusionai/ring-2.6-1t|zenmux"
  "tencent/hy3|"
  "moonshotai/kimi-k2.5|"
  "moonshotai/kimi-k2.6|"
  "z-ai/glm-4.7|"
  "z-ai/glm-5|"
  "z-ai/glm-5.1|"
  "nvidia/nemotron-3-super-120b-a12b:free|"
  "nvidia/nemotron-3-nano-30b-a3b:free|"
  "nvidia/llama-3.3-nemotron-super-49b-v1.5|"
  "inception/mercury-2|"
)

cd "$REPO_ROOT"

echo "=== Stuff-into-Things v2 Eval (resumable) ==="
echo "Fixture: prompts/stuff-into-things-v2.json (15 tests)"
echo "Grader: $GRADER"
echo "Log: $LOG_PATH"
echo ""

TOTAL=0
SKIPPED=0
RUN=0

for entry in "${MODELS[@]}"; do
  model="${entry%|*}"
  provider="${entry#*|}"
  TOTAL=$((TOTAL + 1))

  # Count completed tests for this model in the log
  # Only count tests with actual responses (responseLength > 0) — skip provider errors
  if [[ -f "$LOG_PATH" ]]; then
    count=$(cat "$LOG_PATH" | jq -r "select(.modelId == \"$model\" and (.testId | startswith(\"SIT\")) and .trajectory.responseLength > 0) | .testId" 2>/dev/null | sort -u | wc -l | tr -d ' ')
  else
    count=0
  fi

  if [[ "$count" -ge "$EXPECTED" ]]; then
    echo "── $model ($provider) — SKIP ($count/$EXPECTED complete) ──"
    SKIPPED=$((SKIPPED + 1))
    continue
  fi

  echo "── $model ($provider) — RUN ($count/$EXPECTED, need $((EXPECTED - count)) more) ──"
  RUN=$((RUN + 1))
  if [[ -n "$provider" ]]; then
    just eval "traps $model --fixture=sit2 --provider=$provider --grader=$GRADER" 2>&1 | grep -E "passed|FAIL" | tail -1
  else
    just eval "traps $model --fixture=sit2 --grader=$GRADER" 2>&1 | grep -E "passed|FAIL" | tail -1
  fi
  echo ""
done

echo "=== Summary ==="
echo "Total models: $TOTAL"
echo "Skipped (complete): $SKIPPED"
echo "Run this pass: $RUN"
echo "See data/eval_log.json for full results"
