#!/usr/bin/env bash
set -euo pipefail

branch=$(git symbolic-ref --short HEAD 2>/dev/null || git rev-parse --short HEAD)
echo "Repo:   cool-pi-extensions"
echo "Branch: $branch"
echo ""
echo "=== Git status ==="
git status --short | head -20
echo ""
last=$(git log -1 --format="%cr · %s" 2>/dev/null || echo "unknown")
echo "Last commit: $last"
echo ""
echo "=== Stack ==="
echo "  alacritty → herdr → pi → fresh (+ sidecar / td)"
echo ""
echo "=== Agent tasks (td) ==="
td current 2>/dev/null || echo "  (td not available)"
echo ""
echo "=== Provisioning ==="
scripts/provision.sh 2>/dev/null | grep -E "^[ ✓✗]" || true
echo ""
echo "=== Entry points ==="
echo "  just about   — what this project is"
echo "  just orient  — current state (you are here)"
echo "  just browse  — human doc browser"
echo "  just help    — full repo index (MANIFEST.md via Glow)"
echo "  just read    — pick a file to glow"
echo ""
echo "=== Optional ==="
echo "  just adopt-edinburgh — apply Edinburgh Protocol (normalize agents)"
