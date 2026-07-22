#!/usr/bin/env bash
set -euo pipefail

SOURCE="$(pwd)/SYSTEM.md"
TARGET="$HOME/.pi/agent/AGENTS.md"

if [[ ! -f "$SOURCE" ]]; then
  echo "Error: SYSTEM.md not found."
  exit 1
fi

if [[ -f "$TARGET" && ! -L "$TARGET" ]]; then
  cp "$TARGET" "$TARGET.bak"
  echo "Backed up existing AGENTS.md → AGENTS.md.bak"
fi

ln -sf "$SOURCE" "$TARGET"
echo "Edinburgh Protocol adopted as system prompt."
echo "Restart pi to activate."
