#!/usr/bin/env bash
set -euo pipefail

# Dependency checker for cool-pi-extensions.
# Mirrors DEPENDENCIES.md — the single source of truth for external deps.
# See decisions/008-deprecate-flox.md for why this replaces Flox.
#
# Exits non-zero if any required binary is missing.

required_missing=0

echo "=== Required ==="
for entry in \
  "bun|brew install bun (macOS) · pacman -S bun (Arch)" \
  "just|brew install just (macOS) · pacman -S just (Arch)" \
  "gum|brew install gum (macOS) · pacman -S gum (Arch)" \
  "pi|curl -fsSL https://pi.dev/install.sh | sh" \
  "td|brew install td  (marcus/homebrew-tap)" \
  "sidecar|brew install sidecar  (marcus/homebrew-tap)"; do
  bin="${entry%%|*}"
  hint="${entry#*|}"
  if command -v "$bin" >/dev/null 2>&1; then
    printf "  ✓ %s\n" "$bin"
  else
    printf "  ✗ %s — %s\n" "$bin" "$hint"
    required_missing=1
  fi
done

echo ""
echo "=== Optional ==="
for entry in \
  "rtk|brew install rtk" \
  "skate|brew install skate (macOS) · pacman -S skate (Arch)" \
  "glow|brew install glow (macOS) · pacman -S glow (Arch)"; do
  bin="${entry%%|*}"
  hint="${entry#*|}"
  if command -v "$bin" >/dev/null 2>&1; then
    printf "  ✓ %s\n" "$bin"
  else
    printf "  · %s — %s\n" "$bin" "$hint"
  fi
done

echo ""
if [ "$required_missing" -eq 0 ]; then
  echo "✓ All required dependencies present"
else
  echo "✗ Required dependencies missing — install above, then re-run: just install-deps"
  exit 1
fi
