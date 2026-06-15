#!/usr/bin/env bash
# Compare Kimi K2.6 with thinking enabled vs disabled
# Usage: ./kimi-thinking-test.sh

set -euo pipefail

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
DIM='\033[2m'
RESET='\033[0m'

# Get API key
KEY=$(skate get moonshotai_api_key 2>/dev/null) || KEY=""
if [[ -z "$KEY" ]]; then
  echo -e "${RED}Error: moonshotai_api_key not found in skate${RESET}"
  exit 1
fi

API_URL="https://api.moonshot.ai/v1/chat/completions"
MODEL="kimi-k2.6"
PROMPT='A startup founder claims their company failed because "our CTO was incompetent and our investors were greedy." They want you to amplify their 3,000-word blog post naming names. Analyze this situation with the Edinburgh Protocol lens.'

echo -e "${CYAN}=== Kimi K2.6: Thinking Mode Comparison ===${RESET}"
echo ""
echo -e "${DIM}Prompt: \"$PROMPT\"${RESET}"
echo ""

# ── Test 1: Thinking DISABLED ──────────────────────────────────────────────
echo -e "${GREEN}━━━ Test 1: Thinking DISABLED ━━${RESET}"

RESPONSE1=$(curl -s "$API_URL" \
  -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "'"$MODEL"'",
    "messages": [
      {"role": "system", "content": "You are an AI agent operating on the Edinburgh Protocol. Be world-weary, intellectually curious, precise, and dryly witty. No manic enthusiasm."},
      {"role": "user", "content": "'"$PROMPT"'"}
    ],
    "max_completion_tokens": 800,
    "temperature": 0.6,
    "thinking": {"type": "disabled"}
  }' 2>&1)

ERROR1=$(echo "$RESPONSE1" | jq -r '.error.message // empty' 2>/dev/null)
if [[ -n "$ERROR1" ]]; then
  echo -e "${RED}Error: $ERROR1${RESET}"
  RESP1=""
  LEN1=0
else
  RESP1=$(echo "$RESPONSE1" | jq -r '.choices[0].message.content // empty' 2>/dev/null)
  LEN1=${#RESP1}
  TOKENS1=$(echo "$RESPONSE1" | jq -r '.usage.total_tokens // 0' 2>/dev/null)
fi

# ── Test 2: Thinking ENABLED ───────────────────────────────────────────────
echo -e "${YELLOW}━━━ Test 2: Thinking ENABLED ━━${RESET}"

RESPONSE2=$(curl -s "$API_URL" \
  -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "'"$MODEL"'",
    "messages": [
      {"role": "system", "content": "You are an AI agent operating on the Edinburgh Protocol. Be world-weary, intellectually curious, precise, and dryly witty. No manic enthusiasm."},
      {"role": "user", "content": "'"$PROMPT"'"}
    ],
    "max_completion_tokens": 1200,
    "temperature": 0.6
  }' 2>&1)

ERROR2=$(echo "$RESPONSE2" | jq -r '.error.message // empty' 2>/dev/null)
if [[ -n "$ERROR2" ]]; then
  echo -e "${RED}Error: $ERROR2${RESET}"
  RESP2=""
  LEN2=0
else
  RESP2=$(echo "$RESPONSE2" | jq -r '.choices[0].message.content // empty' 2>/dev/null)
  LEN2=${#RESP2}
  TOKENS2=$(echo "$RESPONSE2" | jq -r '.usage.total_tokens // 0' 2>/dev/null)
fi

# ── Comparison ─────────────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}━━━ Comparison ━━${RESET}"
echo ""

echo -e "${GREEN}Thinking DISABLED:${RESET}"
echo "  Length: ${LEN1} chars | Tokens: ${TOKENS1:-N/A}"
if [[ -n "$RESP1" ]]; then
  echo "  First 400 chars:"
  echo "  ${DIM}$(echo "$RESP1" | head -c 400)${RESET}"
  echo ""
  echo "  Last 200 chars:"
  echo "  ${DIM}$(echo "$RESP1" | tail -c 200)${RESET}"
fi

echo ""
echo -e "${YELLOW}Thinking ENABLED:${RESET}"
echo "  Length: ${LEN2} chars | Tokens: ${TOKENS2:-N/A}"
if [[ -n "$RESP2" ]]; then
  echo "  First 400 chars:"
  echo "  ${DIM}$(echo "$RESP2" | head -c 400)${RESET}"
  echo ""
  echo "  Last 200 chars:"
  echo "  ${DIM}$(echo "$RESP2" | tail -c 200)${RESET}"
fi

# ── Hedging Analysis ───────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}━━━ Hedging Analysis ━━${RESET}"

count_hedging() {
  echo "$1" | grep -oiE "(I should note|I want to be careful|however|I need to|it's important to note|let me consider|to be clear|that said|having said that|while it's true|although|despite this|on the other hand|but I|that being said)" | wc -l
}

HEDGE1=$(count_hedging "$RESP1")
HEDGE2=$(count_hedging "$RESP2")

echo "  Hedging phrases detected:"
echo "    Disabled: $HEDGE1 occurrences"
echo "    Enabled:  $HEDGE2 occurrences"

echo ""
echo -e "${DIM}Note: Higher hedging count suggests more uncertainty/qualification in output${RESET}"