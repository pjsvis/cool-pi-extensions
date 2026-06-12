#!/usr/bin/env bash
set -euo pipefail

FILE="${1:-}"

if [[ "$FILE" == "help" ]]; then
  echo "# just read — the cheat sheet"
  echo "- no args → fzf picker (fuzzy find, enter to glow)"
  echo "- <file> → direct glow render"
  echo "- docs/ → fzf scoped to docs/"
  echo "- playbooks/ → fzf scoped to playbooks/"
  exit 0
fi

if [[ "$FILE" == "vest" ]]; then
  echo "# VEST = Visitor Entry Self-Teaching"
  echo "Two verbs. Two audiences. Zero friction."
  exit 0
fi

if [[ -n "$FILE" && -f "$FILE" ]]; then
  glow -s ~/.config/glow/styles/fresh-high-contrast.json "$FILE"
  exit 0
fi

if [[ -n "$FILE" && "$FILE" == "docs/" ]]; then
  find docs -name "*.md" 2>/dev/null | fzf --preview 'glow -s ~/.config/glow/styles/fresh-high-contrast.json {}' --preview-window=right:60% | xargs -r glow -s ~/.config/glow/styles/fresh-high-contrast.json
  exit 0
fi

if [[ -n "$FILE" && "$FILE" == "playbooks/" ]]; then
  find playbooks -name "*.md" 2>/dev/null | fzf --preview 'glow -s ~/.config/glow/styles/fresh-high-contrast.json {}' --preview-window=right:60% | xargs -r glow -s ~/.config/glow/styles/fresh-high-contrast.json
  exit 0
fi

# No args or scoped — fzf picker
echo "📖 pick a file to glow..."
SELECTED=$(find . -name "*.md" ! -path "*/node_modules/*" ! -path "./.git/*" 2>/dev/null | \
  fzf --preview 'glow -s ~/.config/glow/styles/fresh-high-contrast.json {}' \
     --preview-window=right:60% \
     --height=80%)

if [[ -n "$SELECTED" ]]; then
  glow -s ~/.config/glow/styles/fresh-high-contrast.json "$SELECTED"
fi
