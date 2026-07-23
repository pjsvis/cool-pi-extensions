#!/usr/bin/env bash
# mermaid-extract — extract ```mermaid blocks from markdown, render via mermaid-tui
# Usage: mermaid-extract.sh <file> [block-number]
set -euo pipefail
BIN="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/src/cli/mermaid-tui/target/release/mermaid-tui"
file="${1:?Usage: mermaid-extract.sh <file> [block-number]}"
block_filter="${2:-}"
[[ ! -f "$file" ]] && { echo "Error: not found: $file" >&2; exit 1; }
[[ ! -x "$BIN" ]] && { echo "Error: build first: cd src/cli/mermaid-tui && cargo build --release" >&2; exit 1; }

FENCE='```mermaid'
current=0; in_mermaid=false; buffer=""
while IFS= read -r line; do
  if [[ "$line" == "$FENCE"* ]]; then in_mermaid=true; buffer=""; current=$((current + 1)); continue; fi
  if $in_mermaid && [[ "$line" == '```' ]]; then
    in_mermaid=false
    if [[ -z "$block_filter" || "$block_filter" == "$current" ]]; then
      echo "── Diagram $current ──"; printf '%s' "$buffer" | "$BIN"; echo ""
    fi
    buffer=""; continue
  fi
  $in_mermaid && buffer="${buffer}${line}"$'\n'
done < "$file"
if (( $current == 0 )); then echo "No mermaid blocks found in $file" >&2; fi
