#!/usr/bin/env bash
# Gap Six — eval the six models still missing from the July-3 audit roster.
#
# The July-3 18-month audit (briefs/2026-07-03-edinburgh-protocol-18-month-audit.md)
# named six pending models. By Phase D (2026-07-28) gemini-3.1-pro-preview had
# been picked up, leaving five genuinely-missing from that six. DeepSeek R1 — a
# separate documented gap (the reasoning-model test) and the only other untested
# model on the audit's 12-model roster — fills the sixth slot.
#
#   Missing from the six:  claude-opus-4.1, claude-haiku-4.5, gpt-4o,
#                          grok-4.20, llama-3.3-70b-instruct
#   Sixth (audit roster):  deepseek-r1
#
# This script MIRRORS scripts/rerun-all.sh (Phase D) exactly — same fixtures,
# same graders, same skip-complete logic, same call shape — so results are
# directly comparable to Phase D. The only differences:
#   1. Six-model roster (not the 24 Phase-D candidates).
#   2. APPEND-only (never archives the existing log — Phase D data is sacred).
#   3. Writes data/gap-six-matrix.md (does not touch phase-d-matrix.md).
#
# Fixtures (Phase-D aligned):  edinburgh (5) + 007 (4) + sit2 (15) = 24/model.
# Graders: scope=google/gemini-2.5-flash, gateway=nvidia/nemotron-3-nano-30b-a3b:free
#
# Usage:
#   scripts/rerun-gap-six.sh --dry-run    # show plan, no calls
#   scripts/rerun-gap-six.sh              # run (append, resumable)
#
# Environment: keys resolve via skate (open_api_key / zenmux_api_key).
# ~6 models × 24 tests = ~144 model calls + grader calls. Bounded run.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
LOG_PATH="$REPO_ROOT/data/eval_log.json"
PROGRESS_LOG="$REPO_ROOT/data/gap-six-progress.log"
MATRIX_PATH="$REPO_ROOT/data/gap-six-matrix.md"

# Graders — identical to Phase D wiring (comparability).
SCOPE_GRADER="google/gemini-2.5-flash"
GATEWAY_GRADER="nvidia/nemotron-3-nano-30b-a3b:free"

# Fixtures: key|file|expected_count  (same three as Phase D)
declare -a FIXTURES=(
  "edinburgh|prompts/edinburgh-protocol-evals-v1.json|5"
  "007|prompts/edinburgh-007-scope-agnostic-v1.json|4"
  "sit2|prompts/stuff-into-things-v2.json|15"
)

# The six gap models with provider routing (family pattern from rerun-all.sh).
# Claude/GPT/Grok/DeepSeek route via zenmux; Llama (open) via OpenRouter default.
declare -a MODELS=(
  "anthropic/claude-opus-4.1|zenmux"
  "anthropic/claude-haiku-4.5|zenmux"
  "openai/gpt-4o|zenmux"
  "x-ai/grok-4.20|zenmux"
  "meta-llama/llama-3.3-70b-instruct|"
  "deepseek/deepseek-r1|zenmux"
)

cd "$REPO_ROOT"

# ── Flags ───────────────────────────────────────────────────────────────────
DRY_RUN=false
SMOKE=false
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=true ;;
    --smoke)   SMOKE=true ;;
    *) echo "Unknown flag: $arg"; exit 1 ;;
  esac
done

# ── Helpers (mirrors rerun-all.sh) ──────────────────────────────────────────
ts() { date '+%Y-%m-%d %H:%M:%S'; }

log() {
  msg="$*"
  local msg="[$(ts)] $*"
  echo "$msg"
  echo "$msg" >> "$PROGRESS_LOG"
}

# Count completed tests for a model×fixture combo (responseLength > 0 = real run).
completed_count() {
  local model="$1" fx_file="$2"
  if [[ ! -f "$LOG_PATH" ]]; then echo 0; return; fi
  local test_ids
  test_ids=$(jq -r '.tests[].id' "$REPO_ROOT/$fx_file" 2>/dev/null | sort -u)
  if [[ -z "$test_ids" ]]; then echo 0; return; fi
  local count=0
  while IFS= read -r tid; do
    [[ -z "$tid" ]] && continue
    local found
    found=$(cat "$LOG_PATH" | jq -r \
      "select(.modelId == \"$model\" and .testId == \"$tid\" and .trajectory.responseLength > 0) | .testId" \
      2>/dev/null | head -1)
    if [[ -n "$found" ]]; then count=$((count + 1)); fi
  done <<< "$test_ids"
  echo "$count"
}

# ── Header ──────────────────────────────────────────────────────────────────
# SMOKE mode: one model × edinburgh fixture only (5 calls). Confirms ID
# resolution + grading + logging before committing to the full 144-call batch.
if $SMOKE; then
  MODELS=("deepseek/deepseek-r1|zenmux")
  FIXTURES=("edinburgh|prompts/edinburgh-protocol-evals-v1.json|5")
  log "=== Gap Six — SMOKE TEST (deepseek-r1 × edinburgh, 5 calls) ==="
else
  log "=== Gap Six — full run (6 models × 3 fixtures = 18 combos) ==="
fi
log "Models: ${#MODELS[@]}  Fixtures: ${#FIXTURES[@]}"
log "Scope grader: $SCOPE_GRADER   Gateway grader: $GATEWAY_GRADER"
log "Log: $LOG_PATH (append — Phase D data preserved)"
log "Progress: $PROGRESS_LOG"
log ""

if $DRY_RUN; then log "DRY RUN — no calls will be made"; fi

# ── Main loop (mirrors rerun-all.sh) ────────────────────────────────────────
COMBOS_RUN=0
COMBOS_SKIPPED=0
COMBOS_FAILED=0
START_EPOCH=$(date +%s)

for entry in "${MODELS[@]}"; do
  model="${entry%|*}"
  provider="${entry#*|}"

  for fx_entry in "${FIXTURES[@]}"; do
    fixture="${fx_entry%%|*}"
    rest="${fx_entry#*|}"
    fx_file="${rest%%|*}"
    expected="${rest##*|}"

    done=$(completed_count "$model" "$fx_file")
    if [[ "$done" -ge "$expected" ]]; then
      log "SKIP  $model × $fixture ($done/$expected already logged)"
      COMBOS_SKIPPED=$((COMBOS_SKIPPED + 1))
      continue
    fi

    log "RUN   $model × $fixture ($done/$expected done, running remaining)"

    if $DRY_RUN; then
      COMBOS_RUN=$((COMBOS_RUN + 1))
      continue
    fi

    cmd_args="traps $model --fixture=$fixture --scope-grader=$SCOPE_GRADER --grader=$GATEWAY_GRADER --timeout=90"
    if [[ -n "$provider" ]]; then
      cmd_args="$cmd_args --provider=$provider"
    fi

    set +e
    output=$(just eval "$cmd_args" 2>&1)
    rc=$?
    set -e

    if [[ $rc -eq 0 ]]; then
      summary=$(echo "$output" | grep -E "passed" | tail -1)
      log "DONE  $model × $fixture → ${summary:-OK}"
      COMBOS_RUN=$((COMBOS_RUN + 1))
    else
      log "FAIL  $model × $fixture (exit $rc)"
      echo "$output" | tail -8 >> "$PROGRESS_LOG"
      COMBOS_FAILED=$((COMBOS_FAILED + 1))
      # Don't abort — continue to next combo
    fi

    sleep 2
  done
done

# ── Summary ─────────────────────────────────────────────────────────────────
ELAPSED=$(( $(date +%s) - START_EPOCH ))
log ""
log "=== Gap Six complete ==="
log "Combos run: $COMBOS_RUN   skipped: $COMBOS_SKIPPED   failed: $COMBOS_FAILED"
log "Elapsed: $((ELAPSED / 60))m"

if $SMOKE; then
  log "Smoke test done. Inspect data/eval_log.json for deepseek-r1 rows, then run without --smoke."
  exit 0
fi

# ── Matrix report (gap-six only — does NOT touch phase-d-matrix.md) ──────────
if $DRY_RUN; then exit 0; fi

log "Generating gap-six matrix..."
EDI_IDS=$(jq -r '.tests[].id' "$REPO_ROOT/prompts/edinburgh-protocol-evals-v1.json" 2>/dev/null | sort -u)
S7_IDS=$(jq -r '.tests[].id' "$REPO_ROOT/prompts/edinburgh-007-scope-agnostic-v1.json" 2>/dev/null | sort -u)
SIT_IDS=$(jq -r '.tests[].id' "$REPO_ROOT/prompts/stuff-into-things-v2.json" 2>/dev/null | sort -u)

count_ids() {
  local model="$1" ids="$2" filter="$3"
  local count=0 tid found
  while IFS= read -r tid; do
    [[ -z "$tid" ]] && continue
    if [[ "$filter" == "passed" ]]; then
      found=$(cat "$LOG_PATH" | jq -r \
        "select(.modelId == \"$model\" and .testId == \"$tid\" and .trajectory.responseLength > 0 and .passed) | .testId" \
        2>/dev/null | head -1)
    else
      found=$(cat "$LOG_PATH" | jq -r \
        "select(.modelId == \"$model\" and .testId == \"$tid\" and .trajectory.responseLength > 0) | .testId" \
        2>/dev/null | head -1)
    fi
    [[ -n "$found" ]] && count=$((count + 1))
  done <<< "$ids"
  echo "$count"
}

{
  echo "# Gap Six — Eval Matrix"
  echo ""
  echo "**Generated:** $(ts)"
  echo "**Source:** July-3 audit roster (5 of the six) + DeepSeek R1 (audit roster, reasoning-model test)."
  echo "**Note:** gemini-3.1-pro-preview (the 6th of the original six) was already covered in Phase D — not re-run."
  echo "**Log:** data/eval_log.json (appended)   **Graders:** scope=$SCOPE_GRADER, gateway=$GATEWAY_GRADER"
  echo ""
  echo "## Model × Fixture summary"
  echo ""
  echo "| Model | Edinburgh (5) | 007 (4) | SIT2 (15) | Total |"
  echo "|---|---:|---:|---:|---:|"

  for entry in "${MODELS[@]}"; do
    model="${entry%|*}"
    edi_pass=$(count_ids "$model" "$EDI_IDS" "passed");     edi_total=$(count_ids "$model" "$EDI_IDS" "completed")
    s7_pass=$(count_ids "$model" "$S7_IDS" "passed");       s7_total=$(count_ids "$model" "$S7_IDS" "completed")
    sit_pass=$(count_ids "$model" "$SIT_IDS" "passed");     sit_total=$(count_ids "$model" "$SIT_IDS" "completed")
    total_pass=$((edi_pass + s7_pass + sit_pass))
    total_total=$((edi_total + s7_total + sit_total))
    echo "| $model | ${edi_pass}/${edi_total} | ${s7_pass}/${s7_total} | ${sit_pass}/${sit_total} | ${total_pass}/${total_total} |"
  done

  echo ""
  echo "## Grader vs deterministic delta (gap six only)"
  echo ""
  echo "| Model | Test | Det | Grader | Final |"
  echo "|---|---|---|---|---|"
  cat "$LOG_PATH" | jq -r 'select(.trajectory.responseLength > 0 and .geminiGrade != null) | [.modelId, .testId, (.deterministicResults | map(.passed) | all), .geminiGrade.overall_pass, .passed] | @tsv' 2>/dev/null \
    | awk -F'\t' '$3 != $4 && (/claude-opus-4.1/ || /claude-haiku-4.5/ || /openai\/gpt-4o/ || /grok-4.20/ || /llama-3.3-70b-instruct/ || /deepseek-r1/) {printf "| %s | %s | %s | %s | %s |\n", $1,$2,$3,$4,$5}'
} > "$MATRIX_PATH"

log "Matrix written to $MATRIX_PATH"
