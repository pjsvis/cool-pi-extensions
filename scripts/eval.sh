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
  echo "  edinburgh [model]     Run scoring eval (edinburgh-eval.ts)"
  echo "                         Defaults to kimi,kimi-k2.6"
  echo "  traps [model]         Run behavioral trap eval"
  echo "                         Defaults to all Ollama models"
  echo "  status                Show recent eval results from data/"
  echo "  list                  Show models available in each eval system"
  echo "  help                  Show this help"
  echo ""
  echo "Environment:"
  echo "  OPENROUTER_API_KEY    Required for trap evals with Gemini grading"
  echo "  SKATE_API_KEY         Required for edinburgh eval (via skate CLI)"
  echo ""
  echo "Examples:"
  echo "  just eval edinburgh                    # test Kimi models"
  echo "  just eval edinburgh kimi --json        # JSON output"
  echo "  just eval traps qwen2.5:3b             # test specific Ollama model"
  echo "  just eval traps nvidia/nemotron-3-ultra-550b-a55b:free"
  echo "  OPENROUTER_API_KEY=\$KEY just eval traps  # with Gemini grading"
}

# ── Command: edinburgh ───────────────────────────────────────────────────────
cmd_edinburgh() {
  local filter="${1:-kimi}"
  cd "$REPO_ROOT/src/cli/pi-check"
  bun run edinburgh-eval.ts "$filter"
}

# ── Command: traps ──────────────────────────────────────────────────────────
cmd_traps() {
  local model="${1:-}"

  # Check for OpenRouter key (env override, else skate — the runner resolves the same way)
  if [[ -n "${OPENROUTER_API_KEY:-}" ]] || skate get open_api_key >/dev/null 2>&1; then
    echo -e "${CYAN}Grading: enabled (OpenRouter key via env or skate)${RESET}"
  else
    echo -e "${YELLOW}Grading: unavailable (no OPENROUTER_API_KEY env and no skate open_api_key)${RESET}"
  fi

  cd "$REPO_ROOT"
  if [[ -n "$model" ]]; then
    bun run src/cli/pi-eval-runner.ts "$model"
  else
    echo -e "${DIM}Running all Ollama models...${RESET}"
    bun run src/cli/pi-eval-runner.ts
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
  echo -e "${CYAN}=== Models Available for Eval ===${RESET}"
  echo ""

  echo -e "${GREEN}━━━ Edinburgh Eval (scoring eval) ━━${RESET}"
  echo -e "${DIM}Run: just eval edinburgh [filter]${RESET}"
  cd "$REPO_ROOT/src/cli/pi-check"
  if bun run edinburgh-eval.ts --help &>/dev/null; then
    echo "  Models: kimi, glm, claude, gpt-5, gemini, nemotron, etc."
    echo "  Uses skate keys for: zenmux, openrouter, nvidia, moonshot, zai"
    echo ""
    echo "  GLM (via Z.ai Coding Plan):"
    echo "    • glm-4.7        — GLM-4.7"
    echo "    • glm-5          — GLM-5"
    echo "    • glm-5.1        — GLM-5.1"
    echo ""
    echo -e "  ${DIM}Registry in: src/cli/pi-check/edinburgh-eval.ts${RESET}"
  fi

  echo ""
  echo -e "${GREEN}━━━ Trap Eval (behavioral traps) ━━${RESET}"
  echo -e "${DIM}Run: just eval traps [model]${RESET}"

  # Ollama models
  if command -v ollama &>/dev/null; then
    echo "  Ollama models:"
    ollama list 2>/dev/null | tail -n +2 | awk '{print "    • " $1}' | head -10
  else
    echo -e "  ${YELLOW}Ollama not running (ollama list failed)${RESET}"
  fi

  echo ""
  echo "  OpenRouter models (require OPENROUTER_API_KEY):"
  echo "    • nvidia/nemotron-3-ultra-550b-a55b:free"
  echo "    • nvidia/nemotron-3-nano-30b-a3b:free"
  echo "    • nvidia/nemotron-3-super-120b-a12b:free"
  echo "    • nex-agi/nex-n2-pro:free"
  echo "    • moonshotai/kimi-k2.5"
  echo "    • moonshotai/kimi-k2.6"
  echo ""
  echo -e "${DIM}Fixture: prompts/edinburgh-protocol-evals-v1.json${RESET}"
}

# ── Dispatch ─────────────────────────────────────────────────────────────────
case "${1:-help}" in
  edinburgh)
    shift
    cmd_edinburgh "$@"
    ;;
  traps)
    shift
    cmd_traps "$@"
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