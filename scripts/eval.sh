#!/usr/bin/env bash
# Edinburgh Protocol Eval - unified facade
# Routes to the correct eval engine based on command

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
LOG_PATH="$REPO_ROOT/data/eval_log.json"

# ── Color codes ─────────────────────────────────────────────────────────────
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
DIM='\033[2m'
RESET='\033[0m'

# ── Usage ───────────────────────────────────────────────────────────────────
usage() {
  echo "Edinburgh Protocol Eval - unified CLI"
  echo ""
  echo "Usage: just eval <command> [args...]"
  echo ""
  echo "Commands:"
  echo "  edinburgh [model]     Run scoring eval (pi-eval score)"
  echo "                         Defaults to kimi,kimi-k2.6"
  echo "  traps [model]         Run behavioral trap eval"
  echo "                         Defaults to all Ollama models"
  echo "  status                Show recent eval results from data/"
  echo "  matrix [model]        Run scoring eval in both primed + bare conditions, show delta"
  echo "  matrix-grade [model]  Run structured grader on both conditions, show reasoning-quality delta"
  echo "  matrix-triangular [m] Run second grader (Gemini 2.5 Pro) and compare deltas with Qwen grader"
  echo "  list                  Show models available in each eval system"
  echo "  help                  Show this help"
  echo "  pi <subcmd> [args]   Route to the new pi-eval CLI (run/status/list/fixtures/clear)"
  echo ""
  echo "Environment:"
  echo "  OPENROUTER_API_KEY    Required for trap evals with Gemini grading"
  echo "  SKATE_API_KEY         Required for edinburgh eval (via skate CLI)"
  echo ""
  echo "Examples:"
  echo "  just eval edinburgh                    # test Kimi models"
  echo "  just eval edinburgh kimi --json        # JSON output"
  echo "  just eval edinburgh kimi --bare        # bare-substrate control (no Protocol)"
  echo "  just eval matrix kimi                  # run both conditions, show delta"
  echo "  just eval traps qwen2.5:3b             # test specific Ollama model"
  echo "  just eval traps nvidia/nemotron-3-ultra-550b-a55b:free"
  echo "  OPENROUTER_API_KEY=\$KEY just eval traps  # with Gemini grading"
}

# ── Command: edinburgh (route to pi-eval score) ──────────────────────────────
cmd_edinburgh() {
  local filter="${1:-kimi}"
  shift 2>/dev/null || true
  cd "$REPO_ROOT"
  bun run src/cli/pi-eval/main.ts score "$filter" "$@"
}

# ── Command: traps (route to pi-eval run) ───────────────────────────────────
cmd_traps() {
  local model="${1:-}"
  cd "$REPO_ROOT"
  if [[ -n "$model" ]]; then
    bun run src/cli/pi-eval/main.ts run "$@"
  else
    echo -e "${DIM}Running all Ollama models...${RESET}"
    bun run src/cli/pi-eval/main.ts run
  fi
}

# ── Command: status ──────────────────────────────────────────────────────────
cmd_status() {
  echo -e "${CYAN}=== Edinburgh Protocol Eval Status ===${RESET}"
  echo ""
  
  if [[ ! -f "$LOG_PATH" ]]; then
    echo -e "${YELLOW}No eval results found (no data/eval_log.json)${RESET}"
    echo "Run: just eval edinburgh  or  just eval traps"
    return
  fi
  
  echo -e "${GREEN}Model                     Score  Pass/Total  Last Run${RESET}"
  echo "─────────────────────────────────────────────────────────"
  
  # Quick summary using grep and simple parsing
  if command -v jq &>/dev/null; then
    # Get unique model/test counts
    local total_entries=$(jq -s 'length' "$LOG_PATH" 2>/dev/null)
    local unique_models=$(jq -r '.modelId' "$LOG_PATH" 2>/dev/null | sort -u | wc -l | tr -d ' ')
    local passed_count=$(jq -r 'select(.passed==true)' "$LOG_PATH" 2>/dev/null | wc -l | tr -d ' ')
    
    echo -e "  ${DIM}Total entries: $total_entries | Models: $unique_models | Passed: $passed_count${RESET}"
    echo ""
    
    # Show latest per model using jq. Data is JSONL; schema: modelId, testName, passed, timestamp (epoch-ms).
    jq -s -r '[.[] | {model: .modelId, passed: .passed, ts: .timestamp}] |
           group_by(.model) |
           map({model: .[0].model, passed: ([.[].passed] | map(if . then 1 else 0 end) | add), total: length, ts: (map(.ts) | max)}) |
           sort_by(.ts) | reverse | .[:15][] | "\(.model)\t\(.passed)/\(.total)\t\(.ts)"' "$LOG_PATH" 2>/dev/null | while IFS=$'\t' read -r model score ts; do
      if [[ -n "$model" && "$model" != "null" ]]; then
        # timestamp is epoch-millis; convert to date+minute
        if [[ "$ts" =~ ^[0-9]+$ ]]; then
          date=$(date -r "$((ts/1000))" "+%Y-%m-%d %H:%M" 2>/dev/null || echo "$ts")
        else
          date="${ts:0:16}"
          [[ -z "$date" ]] && date="unknown"
        fi
        printf "  %-30s %-6s %s\n" "$model" "$score" "$date"
      fi
    done
  else
    echo -e "  ${YELLOW}jq not installed — showing raw log tail${RESET}"
    echo ""
    tail -5 "$LOG_PATH" | while IFS= read -r line; do
      model=$(echo "$line" | grep -o '"modelId":"[^"]*"' | cut -d'"' -f4)
      test=$(echo "$line" | grep -o '"testId":"[^"]*"' | cut -d'"' -f4)
      passed=$(echo "$line" | grep -o '"passed":[^,]*' | cut -d':' -f2)
      echo "  $model | $test | passed=$passed"
    done
  fi
  
  echo ""
  echo -e "${DIM}Log: $LOG_PATH${RESET}"
  echo -e "${DIM}Run 'just eval traps' or 'just eval edinburgh' for new results${RESET}"
}


# ── Command: list ────────────────────────────────────────────────────────────
cmd_list() {
  cd "$REPO_ROOT"
  bun run src/cli/pi-eval/main.ts list
  echo ""
  echo -e "${DIM}Scoring eval models: kimi, glm, claude, gpt-5, gemini, nemotron, etc.${RESET}"
  echo -e "${DIM}Run: just eval edinburgh [filter]  or  just eval 'pi score [filter]'${RESET}"
  echo -e "${DIM}Registry in: src/cli/pi-eval/lib/scoring.ts${RESET}"
}

# ── Command: pi (route to new pi-eval CLI) ─────────────────────────────────
cmd_pi() {
  cd "$REPO_ROOT"
  bun run src/cli/pi-eval/main.ts "$@"
}

# ── Dispatch ─────────────────────────────────────────────────────────────────
case "${1:-help}" in
  pi)
    shift
    cmd_pi "$@"
    ;;
  edinburgh)
    shift
    cmd_edinburgh "$@"
    ;;
  traps)
    shift
    cmd_traps "$@"
    ;;
  matrix-triangular)
    shift
    cd "$REPO_ROOT" && bun run src/cli/pi-eval/main.ts matrix "$@" --triangular
    ;;
  matrix-grade)
    shift
    cd "$REPO_ROOT" && bun run src/cli/pi-eval/main.ts matrix "$@" --grade
    ;;
  matrix)
    shift
    cd "$REPO_ROOT" && bun run src/cli/pi-eval/main.ts matrix "$@"
    ;;
  status)
    cmd_status
    ;;
  list)
    cmd_list
    ;;
  help|--help|-h|"")
    usage
    ;;
  *)
    echo -e "${RED}Unknown command: $1${RESET}"
    echo ""
    usage
    exit 1
    ;;
esac