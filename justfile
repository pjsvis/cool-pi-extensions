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
# Usage: `just orient` (or say "orient me" to the agent)

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
    echo "=== Stack ==="
    echo "  alacritty → herdr → pi → fresh (+ sidecar / td)"
    echo ""
    echo "=== Agent tasks (td) ==="
    td current 2>/dev/null || echo "  (td not available)"
    echo ""
    echo "=== Provisioning ==="
    just provision 2>/dev/null | grep -E "^[ ✓✗]" || true
    echo ""
    echo "=== Entry points ==="
    echo "  just about   — what this project is"
    echo "  just orient  — current state (you are here)"
    echo "  just browse  — human doc browser"
    echo "  just help    — full repo index (MANIFEST.md via Glow)"
    echo ""
    echo "=== Read more ==="
    echo "  just read docs/the-vest-protocol.md — the VEST Protocol blog post"
    echo "  just read docs/visitor-protocol.md  — VEST spec"  

# One-liner summary of the project. What it is, what stack it uses.
# Usage: `just about`
[group("meta")]
about:
    @echo "cool-pi-extensions"
    @echo ""
    @echo "A curated collection of extensions, CLI tooling, prompts,"
    @echo "and Fresh editor plugins for the terminal-native development stack."
    @echo ""
    @echo "Stack: alacritty → herdr → pi → fresh (+ sidecar / td)"
    @echo ""
    @echo "The one-liner: tell your coding agent to orient itself to the project."
    @echo "It will check everything and walk you through the rest."
    @echo ""
    @echo "just install-stack — pull the full dev stack onto a fresh machine"
    @echo "just provision    — check what is already installed"
    @echo "just orient      — current state (you are here)"
    @echo "just browse      — human doc browser"
    @echo "just help        — full repo index (MANIFEST.md via Glow)"
    @echo "just read playbooks/dev-stack-setup.md — full dev stack guide"

# Full repo index. Renders MANIFEST.md through Glow for humans.
# Usage: `just help` (also: type `glow` anywhere for interactive markdown browser)
[group("meta")]
help:
    @glow -s ~/.config/glow/styles/fresh-high-contrast.json MANIFEST.md 2>/dev/null || cat MANIFEST.md

# ── Manifest hygiene ────────────────────────────────────────────────────────
# Ensures docs/playbooks index matches filesystem. Run after major changes.
# Usage: `just check-manifest`

[group("manifest")]
check-manifest:
    bun scripts/check-manifest.ts

# ── Task management (td) ──────────────────────────────────────────────────
# td tracks agent session state, issues, and handoffs.
# Run `just td-new` at the start of every agent session.

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

# ── Human: browse docs ──────────────────────────────────────────────────
# List all available docs with glow preview. For humans browsing the repo.
# Usage: `just browse`

[group("human")]
browse:
    #!/usr/bin/env bash
    set -euo pipefail
    echo "=== docs/ (reference) ==="
    ls docs/*.md 2>/dev/null | while read f; do
      fname=$(basename "$f" .md)
      echo "  • $f"
    done
    echo ""
    echo "=== playbooks/ (guides) ==="
    ls playbooks/*.md 2>/dev/null | while read f; do
      fname=$(basename "$f" .md)
      echo "  • $f"
    done
    echo ""
    echo "→ just read <file>  to render any file with glow"
    echo "→ glow             to browse interactively"

# ── Docs: render with Glow ─────────────────────────────────────────────────
# Glow is the human interface for markdown.
# Usage:
#   just read              → fzf picker, fuzzy find, glow render
#   just read <file>       → direct render (skip fzf)
#   just read docs/        → fzf restricted to docs/
#   just read playbooks/   → fzf restricted to playbooks/
#   just read help         → easter egg: the help they actually need

[group("docs")]
read FILE="":
    #!/usr/bin/env bash
    set -euo pipefail

    # Easter eggs — because devs don't RTFM until they have to
    if [[ "{{FILE}}" == "help" ]]; then
      echo "# 🐣 you found the easter egg"
      echo ""
      echo "## just read — the cheat sheet"
      echo "- no args → fzf picker (fuzzy find, enter to glow)"
      echo "- \<file\> → direct glow render"
      echo "- docs/ → fzf scoped to docs/"
      echo "- playbooks/ → fzf scoped to playbooks/"
      echo "- help → this (because you didn't read the comment)"
      echo "- vest → easter egg within an easter egg"
      echo ""
      echo "## hotkeys in fzf"
      echo "- ↑↓ navigate | Enter select | Ctrl+C abort | Ctrl+/ fuzzy search"
      echo ""
      echo "## pro tip"
      echo "\`glow\` (no args) opens the interactive browser."
      echo "\`just orient\` tells you where you are."
      echo ""
      echo "now go build something."
      echo ""
      echo "*— the VEST Protocol*"
      exit 0
    fi

    if [[ "{{FILE}}" == "vest" ]]; then
      echo "# 🦺 you found the vest"
      echo ""
      echo "> VEST = Visitor Entry Self-Teaching"
      echo ""
      echo "Two verbs. Two audiences. Zero friction."
      echo ""
      echo "- \`just orient\` → agents"
      echo "- \`just browse\` → humans"
      echo "- \`glow\` → both"
      echo ""
      echo "## the philosophy"
      echo ""
      echo "You don't need a hazmat suit."
      echo "You need a vest."
      echo ""
      echo "Lightweight. Functional."
      echo "You put it on, you're ready to work."
      echo ""
      echo "## learn more"
      echo "\`just read docs/the-vest-protocol.md\`"
      echo "\`just read docs/visitor-protocol.md\`"
      echo ""
      echo "*— cool-pi-extensions*"
      exit 0
    fi

    # Direct file given — render it
    if [[ -n "{{FILE}}" && "{{FILE}}" != "" ]]; then
      if [[ -f "{{FILE}}" ]]; then
        glow -s ~/.config/glow/styles/fresh-high-contrast.json "{{FILE}}"
      else
        # Scoped search — look in docs/ or playbooks/
        SCOPE="{{FILE}}"
        if [[ "$SCOPE" == "docs/" ]]; then
          SELECTED=$(find docs -name "*.md" | fzf --preview 'glow -s ~/.config/glow/styles/fresh-high-contrast.json {}' --preview-window=right:60%)
        elif [[ "$SCOPE" == "playbooks/" ]]; then
          SELECTED=$(find playbooks -name "*.md" | fzf --preview 'glow -s ~/.config/glow/styles/fresh-high-contrast.json {}' --preview-window=right:60%')
        else
          SELECTED=$(find . -name "*.md" ! -path "./node_modules/*" | fzf --preview 'glow -s ~/.config/glow/styles/fresh-high-contrast.json {}' --preview-window=right:60%' --query "{{FILE}}")
        fi
        if [[ -n "$SELECTED" ]]; then
          glow -s ~/.config/glow/styles/fresh-high-contrast.json "$SELECTED"
        fi
      fi
      exit 0
    fi

    # No args — fzf picker
    echo "📖 pick a file to glow..."
    SELECTED=$(find . -name "*.md" ! -path "./node_modules/*" ! -path "./.git/*" | \
      fzf --preview 'glow -s ~/.config/glow/styles/fresh-high-contrast.json {}' \
         --preview-window=right:60% \
         --header="VEST Protocol: just read <file> for direct, just read docs/ to scope, help for cheat sheet" \
         --bind="ctrl-h:change-preview(glow -s ~/.config/glow/styles/fresh-high-contrast.json {1} 2>/dev/null || echo 'preview unavailable')" \
         --bind="?:toggle-preview" \
         --height=80%)

    if [[ -n "$SELECTED" ]]; then
      glow -s ~/.config/glow/styles/fresh-high-contrast.json "$SELECTED"
    else
      echo "cancelled. try 'just browse' to list files."
    fi

# ── Provisioning ────────────────────────────────────────────────────
# Check what tools are installed. Run `just provision` anytime to verify.

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

# ── Full stack install ───────────────────────────────────────────────────
# Dial in the complete dev stack from a fresh machine.
# Run this once; subsequent runs just verify.
# Usage: `just install-stack`

[group("provision")]
install-stack:
    #!/usr/bin/env bash
    set -euo pipefail
    echo "=== cool-pi-extensions: full stack install ==="
    echo ""
    echo "--- Core terminals ---"
    brew install alacritty herdr
    echo ""
    echo "--- Task/agent memory (td) and monitor (sidecar) ---"
    brew tap marcus/homebrew-tap
    brew install td sidecar
    echo ""
    echo "--- pi coding agent ---"
    npm install -g @mariozechner/pi-coding-agent
    echo ""
    echo "--- Just task runner + bun runtime ---"
    brew install just bun
    echo ""
    echo "--- Optional: token compression, secrets, markdown preview ---"
    brew install rtk skate glow
    echo ""
    echo "--- Fresh editor (download from getfresh.dev) ---"
    echo "  → Download from https://getfresh.dev"
    echo ""
    echo "--- Clone cool-pi-extensions ---"
    echo "  git clone https://github.com/pjsvis/cool-pi-extensions.git"
    echo "  cd cool-pi-extensions && flox activate"
    echo ""
    echo "Done. Run 'just orient' to verify your environment."
