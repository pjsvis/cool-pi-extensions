#!/usr/bin/env bash
set -euo pipefail
echo "=== docs/ (reference) ==="
ls docs/*.md 2>/dev/null | while read f; do
  echo "  • $f"
done
echo ""
echo "=== playbooks/ (guides) ==="
ls playbooks/*.md 2>/dev/null | while read f; do
  echo "  • $f"
done
echo ""
echo "→ just read <file>  to render any file with glow"
echo "→ glow              to browse interactively"
