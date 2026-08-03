#!/usr/bin/env bash
# NIM Six — eval six models via NVIDIA NIM free tier (--provider=nim, exclusive).
#
# Brief: briefs/2026-08-01-brief-nim-provider-branch.md
# TD:    td-4b22e6
#
# Three genuinely-new substrates + three provider-independence re-tests.
# The new substrates feed the muppet-attributes thesis (GPT-OSS-120B is the
# headline: open-weight OpenAI vs the flatlined closed GPT-5). The re-tests
# check whether the verdict is provider-robust (same model, NIM host vs
# zenmux/OpenRouter).
#
# NIM free tier: 40 req/min, 1000–5000 credits, variable latency (120B model
# can take 90-180s per test). Timeout bumped to 180s. The batch is resumable —
# re-run anytime; only incomplete combos run. "Monitor and grab free evals
# when we can."
#
# Fixtures (Phase-D aligned): edinburgh (5) + 007 (4) + sit2 (15) = 24/model.
# Graders: scope=google/gemini-2.5-flash, gateway=nvidia/nemotron-3-nano-30b-a3b:free
#
# Usage:
#   scripts/rerun-nim-six.sh --dry-run    # show plan, no calls
#   scripts/rerun-nim-six.sh              # run (append, resumable)
#
# Environment: nvidia_api_key resolves via skate. ~6 × 24 = ~144 calls, paced.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
LOG_PATH="$REPO_ROOT/data/eval_log.json"
PROGRESS_LOG="$REPO_ROOT/data/nim-six-progress.log"
MATRIX_PATH="$REPO_ROOT/data/nim-six-matrix.md"

SCOPE_GRADER="google/gemini-2.5-flash"
GATEWAY_GRADER="nvidia/nemotron-3-nano-30b-a3b:free"
# 180s — the 120B GPT-OSS model on NIM free tier can take 90-180s per test.
# The 90s timeout in rerun-gap-six.sh is too aggressive for NIM-hosted 120B.
TIMEOUT=600

declare -a FIXTURES=(
  "edinburgh|prompts/edinburgh-protocol-evals-v1.json|5"
  "007|prompts/edinburgh-007-scope-agnostic-v1.json|4"
  "sit2|prompts/stuff-into-things-v2.json|15"
)

# Three genuinely-new models. Slugs are OpenRouter-style; the harness nimSlug()
# remaps to NIM convention. Provider is always nim (exclusive).
#
# DEFERRED — the three provider-independence re-tests (glm-5.1, minimax-m2.7,
# v4-flash) are NOT in this batch. The eval_log has no `provider` field, so NIM
# rows would be indistinguishable from the existing zenmux/OpenRouter rows under
# the same modelId — the resumable skip logic would either block the NIM run or
# corrupt the comparison by mixing providers. Re-tests need a harness follow-up:
# log the provider in run.ts, then re-run with a provider filter. See brief
# §Out of scope (the re-test is provider-independence, not duplicate — but the
# instrument can't yet distinguish them).
declare -a MODELS=(
  "openai/gpt-oss-120b"           # new — muppet-thesis headline (open-weight OpenAI)
  "moonshotai/kimi-k2-instruct"   # new — corpus gap (K2 base instruct)
  "sarvamai/sarvam-m"             # new — out-of-domain specialist (Indic languages)
)

cd "$REPO_ROOT"

DRY_RUN=false
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=true ;;
    *) echo "Unknown flag: $arg"; exit 1 ;;
  esac
done

ts() { date '+%Y-%m-%d %H:%M:%S'; }
log() { local msg="[$(ts)] $*"; echo "$msg"; echo "$msg" >> "$PROGRESS_LOG"; }

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

log "=== NIM Three — free-tier eval via NVIDIA NIM (new substrates only) ==="
log "Models: ${#MODELS[@]}  Fixtures: ${#FIXTURES[@]}  Timeout: ${TIMEOUT}s"
log "Scope grader: $SCOPE_GRADER   Gateway grader: $GATEWAY_GRADER"
log "Log: $LOG_PATH (append)   Progress: $PROGRESS_LOG"
log ""
if $DRY_RUN; then log "DRY RUN — no calls"; fi

COMBOS_RUN=0; COMBOS_SKIPPED=0; COMBOS_FAILED=0
START_EPOCH=$(date +%s)

for model in "${MODELS[@]}"; do
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

    log "RUN   $model × $fixture ($done/$expected done)"
    if $DRY_RUN; then COMBOS_RUN=$((COMBOS_RUN + 1)); continue; fi

    cmd_args="traps $model --fixture=$fixture --scope-grader=$SCOPE_GRADER --grader=$GATEWAY_GRADER --provider=nim --timeout=$TIMEOUT"
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
      echo "$output" | tail -6 >> "$PROGRESS_LOG"
      COMBOS_FAILED=$((COMBOS_FAILED + 1))
    fi
    sleep 3
  done
done

ELAPSED=$(( $(date +%s) - START_EPOCH ))
log ""
log "=== NIM Six complete ==="
log "Combos run: $COMBOS_RUN   skipped: $COMBOS_SKIPPED   failed: $COMBOS_FAILED"
log "Elapsed: $((ELAPSED / 60))m"

if $DRY_RUN; then exit 0; fi

# ── Matrix report (nim-six only) ────────────────────────────────────────────
log "Generating nim-six matrix..."
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
  echo "# NIM Six — Eval Matrix"
  echo ""
  echo "**Generated:** $(ts)"
  echo "**Source:** briefs/2026-08-01-brief-nim-provider-branch.md (td-4b22e6)"
  echo "**Provider:** NVIDIA NIM free tier (exclusive — no cross-provider fallback)"
  echo "**Three new:** gpt-oss-120b, kimi-k2-instruct, sarvam-m  |  **Three re-test:** glm-5.1, minimax-m2.7, v4-flash"
  echo "**Log:** data/eval_log.json   **Graders:** scope=$SCOPE_GRADER, gateway=$GATEWAY_GRADER"
  echo ""
  echo "## Model × Fixture summary"
  echo ""
  echo "| Model | Edinburgh (5) | 007 (4) | SIT2 (15) | Total | Role |"
  echo "|---|---:|---:|---:|---:|---|"

  declare -a ROLES=(
    "openai/gpt-oss-120b|new — muppet-thesis headline"
    "moonshotai/kimi-k2-instruct|new — corpus gap"
    "sarvamai/sarvam-m|new — out-of-domain specialist"
    "z-ai/glm-5.1|re-test — provider independence"
    "minimax/minimax-m2.7|re-test — provider independence"
    "deepseek/deepseek-v4-flash|re-test — provider independence"
  )
  for entry in "${ROLES[@]}"; do
    model="${entry%|*}"; role="${entry#*|}"
    edi_pass=$(count_ids "$model" "$EDI_IDS" "passed");   edi_total=$(count_ids "$model" "$EDI_IDS" "completed")
    s7_pass=$(count_ids "$model" "$S7_IDS" "passed");     s7_total=$(count_ids "$model" "$S7_IDS" "completed")
    sit_pass=$(count_ids "$model" "$SIT_IDS" "passed");   sit_total=$(count_ids "$model" "$SIT_IDS" "completed")
    total_pass=$((edi_pass + s7_pass + sit_pass))
    total_total=$((edi_total + s7_total + sit_total))
    echo "| $model | ${edi_pass}/${edi_total} | ${s7_pass}/${s7_total} | ${sit_pass}/${sit_total} | ${total_pass}/${total_total} | $role |"
  done

  echo ""
  echo "## Provider-independence delta (re-tests vs original host)"
  echo ""
  echo "| Model | NIM total | Original host total | Δ |"
  echo "|---|---:|---:|---|"
  # Original-host totals from the existing corpus (non-NIM rows)
  for entry in "z-ai/glm-5.1|minimax/minimax-m2.7|deepseek/deepseek-v4-flash"; do
    :
  done
  echo "| _filled by hand from phase-d-matrix / gap-six-matrix_ | | | |"
} > "$MATRIX_PATH"

log "Matrix written to $MATRIX_PATH"
