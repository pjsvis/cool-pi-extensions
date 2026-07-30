#!/usr/bin/env bash
# probe-models.sh — live model probe for Pi Coding Agent.
#
# Sends a minimal chat completion through `pi --model <ref> --print`
# for each model in settings.json `enabledModels` (or args), and reports
# pass/fail with the HTTP-level error if any.
#
# Unlike pi-check (which hits the /models list endpoint and resolves keys
# via `!skate get`, bypassing auth.json), this exercises the REAL runtime
# path: auth.json credential precedence, per-model baseUrl, API mapping,
# and compat flags. It catches the failure classes pi-check cannot:
#   - stale/whitespace-corrupted stored credentials (auth.json)
#   - baseUrl/api collisions between built-in and overridden models
#   - per-model auth-header requirements (Bearer vs x-api-key)
#
# Usage:
#   scripts/probe-models.sh                  # probe all enabledModels
#   scripts/probe-models.sh minimax/MiniMax-M3 opencode/minimax-m3  # probe specific
#   scripts/probe-models.sh --json           # machine-readable output
#   scripts/probe-models.sh --timeout 30     # per-model timeout in seconds (default 20)
#
# Exit code: number of failed models (capped at 1 for shell compatibility).

set -euo pipefail

SETTINGS="${PI_SETTINGS:-$HOME/.pi/agent/settings.json}"
TIMEOUT=20
JSON=false
EXPLICIT_MODELS=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    --json) JSON=true; shift ;;
    --timeout) TIMEOUT="${2:?--timeout requires a value}"; shift 2 ;;
    --timeout=*) TIMEOUT="${1#*=}"; shift ;;
    --*) echo "unknown flag: $1" >&2; exit 2 ;;
    *) EXPLICIT_MODELS+=("$1"); shift ;;
  esac
done

# Resolve models to probe
if [[ ${#EXPLICIT_MODELS[@]} -gt 0 ]]; then
  MODELS=("${EXPLICIT_MODELS[@]}")
else
  if [[ ! -f "$SETTINGS" ]]; then
    echo "settings not found: $SETTINGS" >&2; exit 2
  fi
  MODELS=()
  while IFS= read -r line; do
    [[ -n "$line" ]] && MODELS+=("$line")
  done < <(python3 -c "
import json
s=json.load(open('$SETTINGS'))
for m in s.get('enabledModels',[]): print(m)
" 2>/dev/null)
  if [[ ${#MODELS[@]} -eq 0 ]]; then
    echo "no enabledModels in $SETTINGS" >&2; exit 2
  fi
fi

# Colors
if [[ -t 1 && "$JSON" == false ]]; then
  G=$'\033[0;32m' R=$'\033[0;31m' Y=$'\033[1;33m' C=$'\033[0;36m' D=$'\033[2m' X=$'\033[0m'
else
  G='' R='' Y='' C='' D='' X=''
fi

probe_one() {
  local ref="$1"
  local out rc
  # gtimeout if available, else bare (rely on pi's own behaviour)
  if command -v gtimeout >/dev/null 2>&1; then
    out=$(gtimeout "$TIMEOUT" pi --model "$ref" --print "Reply with exactly: pong" 2>&1) || true
  else
    out=$(pi --model "$ref" --print "Reply with exactly: pong" 2>&1) || true
  fi
  rc=$?
  # pi --print exits non-zero on API errors; capture the first meaningful line
  local first_line
  first_line=$(printf '%s\n' "$out" | head -1)
  if [[ $rc -eq 0 && -n "$out" && "$out" != *"401"* && "$out" != *"404"* && "$out" != *"429"* ]]; then
    printf '%s\x1f%s\x1f%s\n' "$ref" "pass" "$first_line"
  elif [[ $rc -eq 124 ]]; then
    printf '%s\x1f%s\x1f%s\n' "$ref" "timeout" "exceeded ${TIMEOUT}s"
  else
    printf '%s\x1f%s\x1f%s\n' "$ref" "fail" "$first_line"
  fi
}

# ── Run ─────────────────────────────────────────────────────────────────────

if [[ "$JSON" == true ]]; then
  echo '{"results":['
  first=true
  for ref in "${MODELS[@]}"; do
    IFS=$'\x1f' read -r r status detail <<< "$(probe_one "$ref")"
    $first || echo ","
    first=false
    printf '  {"ref":%s,"status":%s,"detail":%s}' \
      "$(python3 -c "import json,sys;print(json.dumps(sys.argv[1]))" "$r")" \
      "$(python3 -c "import json,sys;print(json.dumps(sys.argv[1]))" "$status")" \
      "$(python3 -c "import json,sys;print(json.dumps(sys.argv[1]))" "$detail")"
  done
  echo
  echo ']}'
else
  echo ""
  echo "${C}  Probe — Live Model Connectivity${X}"
  echo "${D}  (pi --model <ref> --print, ${TIMEOUT}s timeout each)${X}"
  echo ""
fi

passed=0; failed=0; timedout=0
for ref in "${MODELS[@]}"; do
  IFS=$'\x1f' read -r r status detail <<< "$(probe_one "$ref")"
  case "$status" in
    pass)
      passed=$((passed+1))
      [[ "$JSON" == false ]] && echo "  ${G}✓${X} ${ref}  ${D}${detail}${X}"
      ;;
    timeout)
      timedout=$((timedout+1))
      [[ "$JSON" == false ]] && echo "  ${Y}⏱${X} ${ref}  ${Y}TIMEOUT${X} ${D}(${detail})${X}"
      ;;
    *)
      failed=$((failed+1))
      [[ "$JSON" == false ]] && echo "  ${R}✗${X} ${ref}  ${R}FAIL${X} ${D}— ${detail}${X}"
      ;;
  esac
done

if [[ "$JSON" == false ]]; then
  echo ""
  echo "  ${G}${passed} passed${X}  ${R}${failed} failed${X}  ${Y}${timedout} timeout${X}  ${D}${#MODELS[@]} total${X}"
  echo ""
fi

[[ $failed -gt 0 || $timedout -gt 0 ]] && exit 1
exit 0
