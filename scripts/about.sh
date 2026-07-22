#!/usr/bin/env bash
set -euo pipefail
glow about.md 2>/dev/null || cat about.md
