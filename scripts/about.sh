#!/usr/bin/env bash
set -euo pipefail
glow -s ~/.config/glow/styles/fresh-high-contrast.json about.md 2>/dev/null || cat about.md
