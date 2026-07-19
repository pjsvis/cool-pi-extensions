#!/usr/bin/env bash
# Run the Stuff-into-Things fixture across the Edinburgh Protocol pack
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
GRADER="qwen/qwen3.7-plus"

# Models grouped by provider
# ZenMux models (use --provider=zenmux)
ZENMUX_MODELS=(
  "anthropic/claude-sonnet-4.5"
  "anthropic/claude-opus-4.8"
  "openai/gpt-5"
  "x-ai/grok-4.3"
  "minimax/minimax-m3"
  "deepseek/deepseek-v4-pro"
  "google/gemini-2.5-pro"
  "qwen/qwen3.7-max"
  "qwen/qwen3.7-plus"
  "xiaomi/mimo-v2.5-pro"
  "inclusionai/ring-2.6-1t"
  "x-ai/grok-build-0.1"
)

# OpenRouter models (default routing, org/model slugs)
OR_MODELS=(
  "anthropic/claude-fable-5"
  "tencent/hy3"
  "moonshotai/kimi-k2.5"
  "moonshotai/kimi-k2.6"
  "z-ai/glm-4.7"
  "z-ai/glm-5"
  "z-ai/glm-5.1"
  "nvidia/nemotron-3-super-120b-a12b:free"
  "nvidia/nemotron-3-nano-30b-a3b:free"
  "nvidia/llama-3.3-nemotron-super-49b-v1.5"
)

cd "$REPO_ROOT"

echo "=== Stuff-into-Things Eval v2 — Edinburgh Protocol Pack ==="
echo "Fixture: prompts/stuff-into-things-v2.json (15 tests)"
echo "Grader: $GRADER"
echo ""

TOTAL=0
PASSED=0
for model in "${ZENMUX_MODELS[@]}" "${OR_MODELS[@]}"; do
  TOTAL=$((TOTAL + 1))
  if [[ "${ZENMUX_MODELS[@]}" == *"$model"* ]]; then
    provider="zenmux"
  else
    provider=""
  fi

  echo "── $model ($provider) ──"
  if just eval "traps $model --fixture=sit2 --provider=$provider --grader=$GRADER" 2>&1 | grep -E "passed|FAIL" | tail -1; then
    :
  fi
  echo ""
done

echo "=== Summary ==="
echo "Models tested: $TOTAL"
echo "See data/eval_log.json for full results"
