#!/usr/bin/env bash
set -euo pipefail

echo "=== Required ==="
for bin in bun just; do
  if command -v "$bin" >/dev/null 2>&1; then
    echo "  ✓ $bin"
  else
    echo "  ✗ $bin — NOT FOUND"
  fi
done

echo ""
echo "=== Optional ==="
for bin in rtk skate glow td sidecar; do
  if command -v "$bin" >/dev/null 2>&1; then
    echo "  ✓ $bin"
  else
    echo "  ✗ $bin"
  fi
done
