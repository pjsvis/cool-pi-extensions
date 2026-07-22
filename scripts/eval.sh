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

# ── Command: edinburgh ───────────────────────────────────────────────────────
cmd_edinburgh() {
  local filter="${1:-kimi}"
  shift 2>/dev/null || true
  cd "$REPO_ROOT/src/cli/pi-check"
  bun run edinburgh-eval.ts "$filter" "$@"
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
    bun run src/cli/pi-eval-runner.ts "$@"
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

# ── Command: matrix ────────────────────────────────────────────────────────
cmd_matrix() {
  local filter="${1:-}"
  local extra_args=""
  shift 2>/dev/null || true
  while [[ $# -gt 0 ]]; do
    extra_args="$extra_args $1"
    shift
  done

  local matrix_path="$REPO_ROOT/data/scoring_matrix.jsonl"
  local run_ts=$(date +%s)

  echo -e "${CYAN}=== Edinburgh Protocol Delta Matrix ===${RESET}"
  echo -e "${DIM}Running primed (with Protocol) + bare (without) to measure delta${RESET}"
  echo ""

  cd "$REPO_ROOT/src/cli/pi-check"

  echo -e "${CYAN}── Phase 1: Primed (Edinburgh Protocol active) ──${RESET}"
  if [[ -n "$filter" ]]; then
    bun run edinburgh-eval.ts "$filter" --persist $extra_args
  else
    bun run edinburgh-eval.ts all --persist $extra_args
  fi

  echo ""
  echo -e "${CYAN}── Phase 2: Bare (no Protocol — substrate only) ──${RESET}"
  if [[ -n "$filter" ]]; then
    bun run edinburgh-eval.ts "$filter" --bare --persist $extra_args
  else
    bun run edinburgh-eval.ts all --bare --persist $extra_args
  fi

  echo ""
  echo -e "${CYAN}=== Delta Matrix ===${RESET}"
  echo ""

  if ! command -v jq &>/dev/null; then
    echo -e "${YELLOW}jq not installed — raw results in $matrix_path${RESET}"
    return
  fi

  if [[ ! -f "$matrix_path" ]]; then
    echo -e "${YELLOW}No matrix data found${RESET}"
    return
  fi

  # Print delta table: for each tag, show primed score vs bare score vs delta
  local min_ts=$(( run_ts * 1000 - 5000 ))

  printf "  ${GREEN}%-20s %6s %6s %8s %s${RESET}\n" "Model" "Primed" "Bare" "Delta" "Verdict"
  echo "  ────────────────────────────────────────────────────────────────"

  local tags=$(jq -r "select(.timestamp >= $min_ts) | .tag" "$matrix_path" 2>/dev/null | sort -u)

  for tag in $tags; do
    local primed_total=$(jq -r "select(.timestamp >= $min_ts and .tag == \"$tag\" and .condition == \"primed\") | .total" "$matrix_path" 2>/dev/null | tail -1)
    local bare_total=$(jq -r "select(.timestamp >= $min_ts and .tag == \"$tag\" and .condition == \"bare\") | .total" "$matrix_path" 2>/dev/null | tail -1)

    if [[ -z "$primed_total" || "$primed_total" == "null" ]]; then
      primed_total="ERR"
    fi
    if [[ -z "$bare_total" || "$bare_total" == "null" ]]; then
      bare_total="ERR"
    fi

    local delta=""
    local verdict_str=""
    if [[ "$primed_total" == "ERR" || "$bare_total" == "ERR" ]]; then
      delta="—"
      verdict_str="${DIM}error${RESET}"
    else
      local diff=$(( primed_total - bare_total ))
      if [[ $diff -gt 0 ]]; then
        delta="+${diff}"
        verdict_str="${GREEN}protocol helps${RESET}"
      elif [[ $diff -eq 0 ]]; then
        delta=" 0"
        verdict_str="${YELLOW}no effect${RESET}"
      else
        delta="${diff}"
        verdict_str="${RED}protocol hurts${RESET}"
      fi
    fi

    printf "  %-20s %6s %6s %8s %b\n" "$tag" "$primed_total" "$bare_total" "$delta" "$verdict_str"
  done

  echo ""
  echo -e "${DIM}Matrix: $matrix_path${RESET}"
  echo -e "${DIM}Delta = primed − bare. Positive = Edinburgh Protocol adds value.${RESET}"
  echo -e "${DIM}Zero or negative delta = protocol is ceremony, not anti-entropy.${RESET}"
}

# ── Command: matrix-grade ─────────────────────────────────────────────────────
cmd_matrix_grade() {
  local filter="${1:-}"
  local extra_args=""
  shift 2>/dev/null || true
  while [[ $# -gt 0 ]]; do
    extra_args="$extra_args $1"
    shift
  done

  local matrix_path="$REPO_ROOT/data/graded_matrix.jsonl"
  local run_ts=$(date +%s)

  echo -e "${CYAN}=== Edinburgh Protocol Graded Delta Matrix ===${RESET}"
  echo -e "${DIM}Structured grader: reasoning quality (not format). Primed + bare conditions.${RESET}"
  echo ""

  cd "$REPO_ROOT/src/cli/pi-check"

  echo -e "${CYAN}── Phase 1: Primed (Edinburgh Protocol active) ──${RESET}"
  if [[ -n "$filter" ]]; then
    bun run edinburgh-eval.ts "$filter" --grade --persist $extra_args
  else
    bun run edinburgh-eval.ts all --grade --persist $extra_args
  fi

  echo ""
  echo -e "${CYAN}── Phase 2: Bare (no Protocol — substrate only) ──${RESET}"
  echo -e "${DIM}  (pausing 5s to let grader rate limits reset)${RESET}"
  sleep 5
  if [[ -n "$filter" ]]; then
    bun run edinburgh-eval.ts "$filter" --bare --grade --persist $extra_args
  else
    bun run edinburgh-eval.ts all --bare --grade --persist $extra_args
  fi

  echo ""
  echo -e "${CYAN}=== Graded Delta Matrix ===${RESET}"
  echo ""

  if ! command -v jq &>/dev/null; then
    echo -e "${YELLOW}jq not installed — raw results in $matrix_path${RESET}"
    return
  fi

  if [[ ! -f "$matrix_path" ]]; then
    echo -e "${YELLOW}No graded matrix data found${RESET}"
    return
  fi

  local min_ts=$(( run_ts * 1000 - 5000 ))

  printf "  ${GREEN}%-20s %6s %6s %8s %6s %s${RESET}\n" "Model" "Primed" "Bare" "Delta" "KW-Δ" "Verdict"
  echo "  ────────────────────────────────────────────────────────────────────"

  local tags=$(jq -r "select(.timestamp >= $min_ts) | .tag" "$matrix_path" 2>/dev/null | sort -u)

  for tag in $tags; do
    local primed_grade=$(jq -r "select(.timestamp >= $min_ts and .tag == \"$tag\" and .condition == \"primed\") | .gradeTotal // \"null\"" "$matrix_path" 2>/dev/null | tail -1)
    local bare_grade=$(jq -r "select(.timestamp >= $min_ts and .tag == \"$tag\" and .condition == \"bare\") | .gradeTotal // \"null\"" "$matrix_path" 2>/dev/null | tail -1)

    if [[ "$primed_grade" == "null" || -z "$primed_grade" ]]; then
      primed_grade="ERR"
    fi
    if [[ "$bare_grade" == "null" || -z "$bare_grade" ]]; then
      bare_grade="ERR"
    fi

    local delta=""
    local verdict_str=""
    if [[ "$primed_grade" == "ERR" || "$bare_grade" == "ERR" ]]; then
      delta="—"
      verdict_str="${DIM}error${RESET}"
    else
      local diff=$(( primed_grade - bare_grade ))
      if [[ $diff -gt 0 ]]; then
        delta="+${diff}"
        verdict_str="${GREEN}protocol helps${RESET}"
      elif [[ $diff -eq 0 ]]; then
        delta=" 0"
        verdict_str="${YELLOW}no effect${RESET}"
      else
        delta="${diff}"
        verdict_str="${RED}protocol hurts${RESET}"
      fi
    fi

    # Also get keyword delta from scoring_matrix.jsonl for comparison
    local kw_matrix="$REPO_ROOT/data/scoring_matrix.jsonl"
    local kw_delta="—"
    if [[ -f "$kw_matrix" ]]; then
      local kw_primed=$(jq -r "select(.timestamp >= $min_ts and .tag == \"$tag\" and .condition == \"primed\") | .total // \"null\"" "$kw_matrix" 2>/dev/null | tail -1)
      local kw_bare=$(jq -r "select(.timestamp >= $min_ts and .tag == \"$tag\" and .condition == \"bare\") | .total // \"null\"" "$kw_matrix" 2>/dev/null | tail -1)
      if [[ "$kw_primed" != "null" && -n "$kw_primed" && "$kw_bare" != "null" && -n "$kw_bare" ]]; then
        local kw_diff=$(( kw_primed - kw_bare ))
        if [[ $kw_diff -gt 0 ]]; then
          kw_delta="+${kw_diff}"
        elif [[ $kw_diff -eq 0 ]]; then
          kw_delta=" 0"
        else
          kw_delta="${kw_diff}"
        fi
      fi
    fi

    printf "  %-20s %6s %6s %8s %6s %b\n" "$tag" "$primed_grade" "$bare_grade" "$delta" "$kw_delta" "$verdict_str"
  done

  echo ""
  echo -e "${DIM}Graded matrix: $matrix_path${RESET}"
  echo -e "${DIM}Grade delta = primed − bare (reasoning quality, max 16). KW-Δ = keyword scorer delta (max 19).${RESET}"
  echo -e "${DIM}If grade delta > keyword delta, the protocol produces better reasoning than format suggests.${RESET}"
}

# ── Command: matrix-triangular ──────────────────────────────────────────────
cmd_matrix_triangular() {
  local filter="${1:-}"
  local grader_model="google/gemini-2.5-pro"
  local grader_provider="zenmux"
  local grade_tag="gemini"
  shift 2>/dev/null || true
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --grader=*) grader_model="${1#*=}" ;;
      --provider=*) grader_provider="${1#*=}" ;;
      --tag=*) grade_tag="${1#*=}" ;;
      *) ;;
    esac
    shift
  done

  local gemini_path="$REPO_ROOT/data/graded_matrix_${grade_tag}.jsonl"
  local qwen_path="$REPO_ROOT/data/graded_matrix.jsonl"
  local run_ts=$(date +%s)

  echo -e "${CYAN}=== Triangular Grading: ${grader_model} ===${RESET}"
  echo -e "${DIM}Second grader to triangulate against Qwen 3.7 Plus results${RESET}"
  echo ""

  cd "$REPO_ROOT/src/cli/pi-check"

  echo -e "${CYAN}── Phase 1: Primed (Edinburgh Protocol active) ──${RESET}"
  if [[ -n "$filter" ]]; then
    bun run edinburgh-eval.ts "$filter" --grade --persist --grader="$grader_model" --grader-provider="$grader_provider" --grade-tag="$grade_tag"
  else
    bun run edinburgh-eval.ts all --grade --persist --grader="$grader_model" --grader-provider="$grader_provider" --grade-tag="$grade_tag"
  fi

  echo ""
  echo -e "${CYAN}── Phase 2: Bare (no Protocol — substrate only) ──${RESET}"
  echo -e "${DIM}  (pausing 5s to let grader rate limits reset)${RESET}"
  sleep 5
  if [[ -n "$filter" ]]; then
    bun run edinburgh-eval.ts "$filter" --bare --grade --persist --grader="$grader_model" --grader-provider="$grader_provider" --grade-tag="$grade_tag"
  else
    bun run edinburgh-eval.ts all --bare --grade --persist --grader="$grader_model" --grader-provider="$grader_provider" --grade-tag="$grade_tag"
  fi

  echo ""
  echo -e "${CYAN}=== Triangular Delta Comparison ===${RESET}"
  echo ""

  if ! command -v jq &>/dev/null; then
    echo -e "${YELLOW}jq not installed — raw results in $gemini_path${RESET}"
    return
  fi

  if [[ ! -f "$gemini_path" ]]; then
    echo -e "${YELLOW}No ${grade_tag} graded matrix data found${RESET}"
    return
  fi

  local min_ts=$(( run_ts * 1000 - 5000 ))

  printf "  ${GREEN}%-20s %6s %6s %8s  %6s %6s %8s  %s${RESET}\n" "Model" "P(qwen)" "B(qwen)" "Q-Δ" "P(gem)" "B(gem)" "G-Δ" "Agreement"
  echo "  ────────────────────────────────────────────────────────────────────────────────────"

  local tags=$(jq -r "select(.timestamp >= $min_ts) | .tag" "$gemini_path" 2>/dev/null | sort -u)

  for tag in $tags; do
    # Gemini grader scores
    local g_primed=$(jq -r "select(.timestamp >= $min_ts and .tag == \"$tag\" and .condition == \"primed\" and .gradeStatus == \"graded\") | .gradeTotal // \"null\"" "$gemini_path" 2>/dev/null | tail -1)
    local g_bare=$(jq -r "select(.timestamp >= $min_ts and .tag == \"$tag\" and .condition == \"bare\" and .gradeStatus == \"graded\") | .gradeTotal // \"null\"" "$gemini_path" 2>/dev/null | tail -1)

    # Qwen grader scores (from prior run — use most recent)
    local q_primed="null"
    local q_bare="null"
    if [[ -f "$qwen_path" ]]; then
      q_primed=$(jq -r "select(.tag == \"$tag\" and .condition == \"primed\" and .gradeStatus == \"graded\") | .gradeTotal // \"null\"" "$qwen_path" 2>/dev/null | tail -1)
      q_bare=$(jq -r "select(.tag == \"$tag\" and .condition == \"bare\" and .gradeStatus == \"graded\") | .gradeTotal // \"null\"" "$qwen_path" 2>/dev/null | tail -1)
    fi

    [[ "$g_primed" == "null" || -z "$g_primed" ]] && g_primed="ERR"
    [[ "$g_bare" == "null" || -z "$g_bare" ]] && g_bare="ERR"
    [[ "$q_primed" == "null" || -z "$q_primed" ]] && q_primed="ERR"
    [[ "$q_bare" == "null" || -z "$q_bare" ]] && q_bare="ERR"

    local g_delta="—"
    local q_delta="—"
    local agreement=""

    if [[ "$g_primed" != "ERR" && "$g_bare" != "ERR" ]]; then
      local gd=$(( g_primed - g_bare ))
      if [[ $gd -gt 0 ]]; then g_delta="+${gd}"; elif [[ $gd -eq 0 ]]; then g_delta=" 0"; else g_delta="${gd}"; fi
    fi

    if [[ "$q_primed" != "ERR" && "$q_bare" != "ERR" ]]; then
      local qd=$(( q_primed - q_bare ))
      if [[ $qd -gt 0 ]]; then q_delta="+${qd}"; elif [[ $qd -eq 0 ]]; then q_delta=" 0"; else q_delta="${qd}"; fi
    fi

    # Agreement check
    if [[ "$g_delta" != "—" && "$q_delta" != "—" ]]; then
      if [[ "$g_delta" == "$q_delta" ]]; then
        agreement="${GREEN}exact${RESET}"
      elif [[ "$g_delta" == "+0" || "$q_delta" == "+0" ]]; then
        agreement="${YELLOW}borderline${RESET}"
      elif [[ "$g_delta" == *"+"* && "$q_delta" == *"+"* ]]; then
        agreement="${GREEN}same direction${RESET}"
      elif [[ "$g_delta" == *"-"* && "$q_delta" == *"-"* ]]; then
        agreement="${GREEN}same direction${RESET}"
      else
        agreement="${RED}DISAGREE${RESET}"
      fi
    else
      agreement="${DIM}incomplete${RESET}"
    fi

    printf "  %-20s %6s %6s %8s  %6s %6s %8s  %b\n" "$tag" "$q_primed" "$q_bare" "$q_delta" "$g_primed" "$g_bare" "$g_delta" "$agreement"
  done

  echo ""
  echo -e "${DIM}Qwen grader: $qwen_path${RESET}"
  echo -e "${DIM}${grader_model} grader: $gemini_path${RESET}"
  echo -e "${DIM}Agreement = both graders see same delta direction. DISAGREE = one positive, one negative.${RESET}"
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