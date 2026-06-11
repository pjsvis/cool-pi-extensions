# cool-pi-extensions task runner
# Requires: just (https://github.com/casey/just), td
# See: playbooks/extensions.md, MANIFEST.md

set shell := ["bash", "-o", "pipefail", "-c"]

# Default: list all available recipes
default:
    @just --list

# ── Agent: Session orientation ─────────────────────────────────────────────
# Run at session start to orient the agent. Shows branch, git state,
# in-flight tasks, and key repo entry points.

[group("meta")]
orient:
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
    echo "=== Active tasks ==="
    td current 2>/dev/null || echo "  (td not available)"
    echo ""
    echo "=== Entry points ==="
    echo "  just about   — what this project is"
    echo "  just help    — full repo index (MANIFEST.md)"
    echo "  just orient  — current state (you are here)"

# What this project is
[group("meta")]
about:
    @echo "cool-pi-extensions"
    @echo ""
    @echo "A curated collection of extensions, CLI tooling, prompts,"
    @echo "and Fresh editor plugins for the terminal-native development stack."
    @echo ""
    @echo "Stack: TailScale → Alacritty → herdr → pi → Fresh → Echo"
    @echo "Docs:  MANIFEST.md"
    @echo "Blog:  The Harness-Harness · Terminal Stack · Silo Manifesto"
    @echo ""
    @echo "just orient — current state"
    @echo "just help   — full index"

# Full repo index (MANIFEST.md rendered with Glow)
[group("meta")]
help:
    @glow -s ~/.config/glow/styles/fresh-high-contrast.json MANIFEST.md 2>/dev/null || cat MANIFEST.md

# ── Manifest hygiene ────────────────────────────────────────────────────────

[group("manifest")]
check-manifest:
    bun scripts/check-manifest.ts

# ── Task management (td) ──────────────────────────────────────────────────

[group("td")]
td-new:
    td usage --new-session

[group("td")]
td-status:
    td current
    td ws current

[group("td")]
td-next:
    td next

[group("td")]
td-context ID:
    td context {{ ID }}

# ── Docs: render with Glow ─────────────────────────────────────────────────

[group("docs")]
read FILE="MANIFEST.md":
    glow -s ~/.config/glow/styles/fresh-high-contrast.json {{ FILE }}

[group("docs")]
read-stack:
    just read docs/terminal-stack.md

# ── Provisioning ────────────────────────────────────────────────────

[group("provision")]
provision:
    @just check-deps && just check-pi && just check-fresh && just check-install-brew

[group("provision")]
check-deps:
    #!/usr/bin/env bash
    set -euo pipefail
    echo "=== Required tools ==="
    for bin in bun just; do
      if command -v "$bin" >/dev/null 2>&1; then
        echo "  ✓ $bin"
      else
        echo "  ✗ $bin — NOT FOUND"
      fi
    done
    echo ""
    echo "=== Optional tools ==="
    for bin in rtk skate glow; do
      if command -v "$bin" >/dev/null 2>&1; then
        echo "  ✓ $bin"
      else
        echo "  ✗ $bin — not installed (brew install $bin)"
      fi
    done

[group("provision")]
check-pi:
    #!/usr/bin/env bash
    set -euo pipefail
    echo ""
    echo "=== pi ==="
    if command -v pi >/dev/null 2>&1; then
      ver=$(pi --version 2>/dev/null || echo "unknown")
      echo "  ✓ pi: $ver"
    else
      echo "  ✗ pi not on PATH"
      echo "  → npm install -g @mariozechner/pi-coding-agent"
    fi

[group("provision")]
check-fresh:
    #!/usr/bin/env bash
    set -euo pipefail
    echo ""
    echo "=== Fresh editor ==="
    if [ -d ~/.config/fresh ]; then
      plugins=$(ls ~/.config/fresh/plugins/*.ts 2>/dev/null | wc -l | tr -d ' ')
      echo "  ✓ Fresh config: ~/.config/fresh ($plugins plugin(s))"
    else
      echo "  ✗ Fresh config not found at ~/.config/fresh"
    fi

[group("provision")]
check-install-brew:
    #!/usr/bin/env bash
    set -euo pipefail
    echo ""
    echo "=== Brew-installed optional tools ==="
    for bin in rtk skate glow; do
      if command -v "$bin" >/dev/null 2>&1; then
        echo "  ✓ $bin"
      else
        echo "  ✗ $bin — brew install $bin"
      fi
    done

[group("provision")]
install-brew:
    #!/usr/bin/env bash
    set -euo pipefail
    echo "Installing optional brew dependencies..."
    brew install rtk skate glow
