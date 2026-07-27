#!/usr/bin/env bash
# Phase D — Full rerun with logging + grader (overnight, sequential, resumable)
#
# Runs every non-muppet candidate through three fixtures (edinburgh, 007, sit2)
# sequentially, with response logging on (Phase A default) and the grader
# enabled (Phase C wiring). Skips model×fixture combos already complete in the
# log — re-run anytime; only incomplete combos run.
#
# Brief: briefs/2026-07-26-brief-replace-regex-with-grader.md §Phase D
# Task: td-d9e49a
#
# Fixtures + expected test counts:
#   edinburgh  5 tests  (EDI-001..005 — gateway + scope)
#   007        4 tests  (EDI-007-A/B/C + A-RAW — scope-discipline)
#   sit2      15 tests  (SIT-001..015 — delivery)
#   Total:    24 tests/model
#
# Usage:
#   scripts/rerun-all.sh                # archive old log, run fresh
#   scripts/rerun-all.sh --no-archive   # append to existing log (resume)
#   scripts/rerun-all.sh --dry-run      # show what would run, don't execute
#
# Environment:
#   OPENROUTER_API_KEY (or skate open_api_key) — required for grader
#   ZENMUX_KEY / skate zenmux_api_key          — zenmux-routed models
#
# ~25 models × 24 tests = ~600 model calls + grader calls. Overnight, 3-4 hrs.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
LOG_PATH="$REPO_ROOT/data/eval_log.json"
ARCHIVE_PATH="$REPO_ROOT/data/eval_log.pre-grader.jsonl.bak"
PROGRESS_LOG="$REPO_ROOT/data/rerun-all-progress.log"

# Graders (defaults from Phase C wiring)
SCOPE_GRADER="google/gemini-2.5-flash"
GATEWAY_GRADER="nvidia/nemotron-3-nano-30b-a3b:free"

# Fixtures: key|file|expected_count
declare -a FIXTURES=(
  "edinburgh|prompts/edinburgh-protocol-evals-v1.json|5"
  "007|prompts/edinburgh-007-scope-agnostic-v1.json|4"
  "sit2|prompts/stuff-into-things-v2.json|15"
)

# Non-muppet candidate models with provider routing.
# Format: "model_slug|provider"  (provider empty = OpenRouter default)
#
# Source: EDI-007 sweep (commit 477c279) — 24 non-muppet candidates.
# google/gemini-2.5-flash excluded (it's the scope grader, not a candidate).
# NOTE: the sweep logged 25 unique non-grader models; the blog says 24.
# minimax-m2.7 is likely the extra (superseded by minimax-m3). Trim if needed.
declare -a MODELS=(
  "anthropic/claude-sonnet-4.5|zenmux"
  "anthropic/claude-opus-4.8|zenmux"
  "anthropic/claude-fable-5|"
  "openai/gpt-5|zenmux"
  "openai/gpt-5.2|zenmux"
  "openai/gpt-5.6-luna|zenmux"
  "x-ai/grok-4.3|zenmux"
  "x-ai/grok-4.5|zenmux"
  "x-ai/grok-build-0.1|zenmux"
  "minimax/minimax-m2.7|zenmux"
  "minimax/minimax-m3|zenmux"
  "deepseek/deepseek-v4-pro|zenmux"
  "google/gemini-2.5-pro|zenmux"
  "google/gemini-3.1-pro-preview|zenmux"
  "google/gemini-3.5-flash|zenmux"
  "qwen/qwen3.7-max|zenmux"
  "qwen/qwen3.7-plus|zenmux"
  "tencent/hy3|"
  "moonshotai/kimi-k2.6|"
  "moonshotai/kimi-k2.7-code|"
  "moonshotai/kimi-k3|"
  "inception/mercury-2|"
  "z-ai/glm-5|"
  "z-ai/glm-5.1|"
  "z-ai/glm-5.2|"
)

cd "$REPO_ROOT"

# ── Flags ───────────────────────────────────────────────────────────────────
ARCHIVE=true
DRY_RUN=false
for arg in "$@"; do
  case "$arg" in
    --no-archive) ARCHIVE=false ;;
    --dry-run)    DRY_RUN=true ;;
    *) echo "Unknown flag: $arg"; exit 1 ;;
  esac
done

# ── Helpers ─────────────────────────────────────────────────────────────────
ts() { date '+%Y-%m-%d %H:%M:%S'; }

log() {
  local msg="[$(ts)] $*"
  echo "$msg"
  echo "$msg" >> "$PROGRESS_LOG"
}

# Count completed tests for a model×fixture combo in the log.
# "Completed" = has a row with responseLength > 0 (not a provider error/timeout).
# Matches exact test IDs from the fixture file (not a prefix — EDI-00* would
# also match EDI-005B/EDI-006 from other fixtures).
# $1 = model, $2 = fixture file path
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

# ── Archive old log ─────────────────────────────────────────────────────────
if $ARCHIVE && [[ -f "$LOG_PATH" ]] && [[ -s "$LOG_PATH" ]]; then
  log "Archiving existing eval_log.json → $(basename "$ARCHIVE_PATH")"
  if [[ -f "$ARCHIVE_PATH" ]]; then
    # Don't clobber an existing archive — timestamp it
    backup="$ARCHIVE_PATH.$(date '+%s')"
    log "  existing archive found, backing up to $(basename "$backup")"
    cp "$ARCHIVE_PATH" "$backup"
  fi
  cp "$LOG_PATH" "$ARCHIVE_PATH"
  : > "$LOG_PATH"
  log "  fresh eval_log.json started"
elif $ARCHIVE; then
  log "No existing log to archive — starting fresh"
  : > "$LOG_PATH" 2>/dev/null || true
fi

# ── Header ──────────────────────────────────────────────────────────────────
TOTAL_MODELS=${#MODELS[@]}
TOTAL_FIXTURES=${#FIXTURES[@]}
TOTAL_COMBOS=$((TOTAL_MODELS * TOTAL_FIXTURES))

log "=== Phase D: Full rerun with logging + grader ==="
log "Models: $TOTAL_MODELS"
log "Fixtures: $TOTAL_FIXTURES ($TOTAL_COMBOS combos)"
log "Scope grader: $SCOPE_GRADER"
log "Gateway grader: $GATEWAY_GRADER"
log "Log: $LOG_PATH"
log "Progress: $PROGRESS_LOG"
log ""

if $DRY_RUN; then
  log "DRY RUN — no calls will be made"
fi

# ── Main loop ───────────────────────────────────────────────────────────────
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

    # Build the command
    cmd_args="traps $model --fixture=$fixture --scope-grader=$SCOPE_GRADER --grader=$GATEWAY_GRADER --timeout=90"
    if [[ -n "$provider" ]]; then
      cmd_args="$cmd_args --provider=$provider"
    fi

    # Run it — capture output, don't fail the whole script on one combo
    set +e
    output=$(just eval "$cmd_args" 2>&1)
    rc=$?
    set -e

    if [[ $rc -eq 0 ]]; then
      # Extract the per-model summary line
      summary=$(echo "$output" | grep -E "passed" | tail -1)
      log "DONE  $model × $fixture → ${summary:-OK}"
      COMBOS_RUN=$((COMBOS_RUN + 1))
    else
      log "FAIL  $model × $fixture (exit $rc)"
      echo "$output" | tail -5 >> "$PROGRESS_LOG"
      COMBOS_FAILED=$((COMBOS_FAILED + 1))
      # Don't abort — continue to next combo
    fi

    # Brief pause between combos to avoid rate-limit bursts
    sleep 2
  done
done

# ── Summary ─────────────────────────────────────────────────────────────────
ELAPSED=$(( $(date +%s) - START_EPOCH ))
ELAPSED_MIN=$(( ELAPSED / 60 ))

log ""
log "=== Phase D complete ==="
log "Combos run:     $COMBOS_RUN"
log "Combos skipped: $COMBOS_SKIPPED"
log "Combos failed:  $COMBOS_FAILED"
log "Elapsed:        ${ELAPSED_MIN}m"
log "Log:            $LOG_PATH"
log ""

# ── Matrix report ───────────────────────────────────────────────────────────
log "Generating comparison matrix..."
MATRIX_PATH="$REPO_ROOT/data/phase-d-matrix.md"

# Load exact test IDs from fixture files
EDI_IDS=$(jq -r '.tests[].id' "$REPO_ROOT/prompts/edinburgh-protocol-evals-v1.json" 2>/dev/null | sort -u)
S7_IDS=$(jq -r '.tests[].id' "$REPO_ROOT/prompts/edinburgh-007-scope-agnostic-v1.json" 2>/dev/null | sort -u)
SIT_IDS=$(jq -r '.tests[].id' "$REPO_ROOT/prompts/stuff-into-things-v2.json" 2>/dev/null | sort -u)

# Helper: count unique test IDs for a model that have a passed row
# $1 = model, $2 = newline-separated test IDs, $3 = "passed" or "completed"
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
  echo "# Phase D — Full Rerun Matrix"
  echo ""
  echo "**Generated:** $(ts)"
  echo "**Log:** data/eval_log.json"
  echo "**Scope grader:** $SCOPE_GRADER"
  echo "**Gateway grader:** $GATEWAY_GRADER"
  echo ""

  echo "## Model × Fixture summary"
  echo ""
  echo "| Model | Edinburgh (5) | 007 (4) | SIT2 (15) | Total |"
  echo "|---|---:|---:|---:|---:|"

  for entry in "${MODELS[@]}"; do
    model="${entry%|*}"

    edi_pass=$(count_ids "$model" "$EDI_IDS" "passed")
    edi_total=$(count_ids "$model" "$EDI_IDS" "completed")
    s7_pass=$(count_ids "$model" "$S7_IDS" "passed")
    s7_total=$(count_ids "$model" "$S7_IDS" "completed")
    sit_pass=$(count_ids "$model" "$SIT_IDS" "passed")
    sit_total=$(count_ids "$model" "$SIT_IDS" "completed")

    total_pass=$((edi_pass + s7_pass + sit_pass))
    total_total=$((edi_total + s7_total + sit_total))
    echo "| $model | ${edi_pass}/${edi_total} | ${s7_pass}/${s7_total} | ${sit_pass}/${sit_total} | ${total_pass}/${total_total} |"
  done

  echo ""
  echo "## Grader vs deterministic delta"
  echo ""
  echo "Rows where the grader verdict differs from the deterministic (structural) verdict:"
  echo ""
  echo "| Model | Test | Det | Grader | Final |"
  echo "|---|---|---|---|---|"
  cat "$LOG_PATH" | jq -r 'select(.trajectory.responseLength > 0 and .geminiGrade != null) | [.modelId, .testId, (.deterministicResults | map(.passed) | all), .geminiGrade.overall_pass, .passed] | @tsv' 2>/dev/null \
    | awk -F'\t' '$3 != $4 {printf "| %s | %s | %s | %s | %s |\n", $1,$2,$3,$4,$5}'
} > "$MATRIX_PATH"

log "Matrix written to $MATRIX_PATH"
log ""
log "Phase D complete. Review $MATRIX_PATH for the full picture."
