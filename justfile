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
    echo "  just read docs/visitor-journey.md   — guided tour (visiting agent)"
    echo "  just read docs/visitor-protocol.md  — VEST spec"
    echo ""
    echo "=== Optional constraints ==="
    echo "  just adopt-edinburgh — apply Edinburgh Protocol (normalize agents)"
    echo "  For visiting agents: just adopt-edinburgh → just orient"  

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

# ── Agent: constraints ────────────────────────────────────────────────────
# The Edinburgh Protocol is a constraint stack that normalizes agent behavior
# across different models. Hume's skepticism, Smith's systems thinking,
# Watt's pragmatism. Consistent results, less variance.
#
# Usage:
#   just adopt-edinburgh    → apply to local pi agent
#   just read prompts/edinburgh-protocol.md  → read the protocol

[group("agent")]
adopt-edinburgh:
    #!/usr/bin/env bash
    set -euo pipefail

    SOURCE="$(pwd)/prompts/edinburgh-protocol.md"
    TARGET="$HOME/.pi/agent/AGENTS.md"

    if [[ ! -f "$SOURCE" ]]; then
      echo "Error: prompts/edinburgh-protocol.md not found."
      echo "Run this from the cool-pi-extensions repo."
      exit 1
    fi

    # Backup existing AGENTS.md if it exists and isn't already the symlink
    if [[ -f "$TARGET" && ! -L "$TARGET" ]]; then
      cp "$TARGET" "$TARGET.bak"
      echo "Backed up existing AGENTS.md → AGENTS.md.bak"
    fi

    ln -sf "$SOURCE" "$TARGET"
    echo "Edinburgh Protocol adopted as system prompt."
    echo ""
    echo "Restart pi to activate. For visiting agents:"
    echo "  1. just adopt-edinburgh  (add constraint-stack)"
    echo "  2. just orient           (context-initialization)"

[group("agent")]
show-edinburgh:
    @glow -s ~/.config/glow/styles/fresh-high-contrast.json prompts/edinburgh-protocol.md

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
      echo "## glow tips (type glow --help)"
      echo "- glow docs/         → scope to folder"
      echo "- glow /docs          → filter includes folder name"
      echo "- just read help      → (you are here)"
      echo ""
      echo "## avoid context switching"
      echo "Fresh editor: CMD+P → glow preview of current buffer"
      echo "No tab switch needed. Stay in the editor."
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

# ── Dev environment ─────────────────────────────────────────────────────
# Spin up the full dev stack in herdr tabs: pi | fresh | glow | shell
# Usage: `just dev`
# Requires: herdr running, gum (optional), pi, fresh, glow installed

[group("dev")]
dev:
    #!/usr/bin/env bash
    set -euo pipefail

    REPO_CWD=$(pwd)
    REPO_NAME=$(basename "$REPO_CWD")

    echo "🚀 Dev stack for: $REPO_NAME"
    echo ""

    # Check herdr is running
    if ! herdr workspace list &>/dev/null; then
      echo "  ⚠ Herdr is not running."
      echo "  → Start herdr first: just open alacritty and type \`herdr\`"
      exit 1
    fi

    # Get workspaces
    WS_LIST=$(herdr workspace list 2>/dev/null)

    # Check if workspace with REPO_NAME exists
    EXISTING=$(echo "$WS_LIST" | jq -r ".result.workspaces[] | select(.label == \"$REPO_NAME\") | .workspace_id" 2>/dev/null)

    if [[ -n "$EXISTING" && "$EXISTING" != "null" ]]; then
      # Workspace exists — offer options
      TAB_COUNT=$(echo "$WS_LIST" | jq -r ".result.workspaces[] | select(.label == \"$REPO_NAME\") | .tab_count" 2>/dev/null || echo "0")
      WS_ID="$EXISTING"

      echo "  ✓ Found workspace: $REPO_NAME ($TAB_COUNT tabs)"

      if command -v gum &>/dev/null; then
        CHOICE=$(gum choose "Use existing" "Close and recreate" "Cancel" 2>/dev/null) || exit 0
      else
        echo ""
        read -p "  Use existing or recreate? [U/r/c] " confirm
        confirm=${confirm:-U}
        case "$confirm" in
          c|C) echo "Cancelled."; exit 0 ;;
          r|R) CHOICE="Close and recreate" ;;
          *) CHOICE="Use existing" ;;
        esac
      fi

      if [[ "$CHOICE" == "Close and recreate" ]]; then
        herdr workspace close "$WS_ID" 2>/dev/null || true
        echo "  ✓ Closed old workspace"
        unset EXISTING WS_ID
      fi
    fi

    # Create workspace if needed
    if [[ -z "$EXISTING" || "$EXISTING" == "null" ]]; then
      HERDR_OUT=$(herdr workspace create --cwd "$REPO_CWD" --label "$REPO_NAME" --no-focus 2>&1)
      if echo "$HERDR_OUT" | grep -q '"type":"workspace_created"'; then
        echo "  ✓ Created workspace: $REPO_NAME"
      else
        echo "  ⚠ Failed: $HERDR_OUT"
        exit 1
      fi
      sleep 0.5
      WS_ID=$(echo "$WS_LIST" | jq -r ".result.workspaces[] | select(.label == \"$REPO_NAME\") | .workspace_id" 2>/dev/null) || true

      if [[ -z "$WS_ID" || "$WS_ID" == "null" ]]; then
        echo "  ⚠ Could not find created workspace."
        exit 1
      fi
    fi

    # Create tabs if workspace is fresh (< 2 tabs)
    WS_LIST=$(herdr workspace list 2>/dev/null)  # Refresh after potential close
    TAB_COUNT=$(echo "$WS_LIST" | jq -r ".result.workspaces[] | select(.workspace_id == \"$WS_ID\") | .tab_count" 2>/dev/null || echo "0")

    if [[ "$TAB_COUNT" -lt 2 ]]; then
      for label in pi fresh glow shell; do
        TAB_OUT=$(herdr tab create --workspace "$WS_ID" --cwd "$REPO_CWD" --label "$label" --no-focus 2>&1)
        echo "$TAB_OUT" | grep -q '"type":"tab_created"' && echo "  ✓ Created tab: $label" || true
        sleep 0.2
      done
    else
      echo "  ✓ Workspace already has tabs — ready to use"
    fi

    echo ""
    echo "✓ Dev stack ready! Switch tabs and run:"
    echo ""
    echo "  Tab 'pi'    → \`pi\`"
    echo "  Tab 'fresh' → \`fresh\`"
    echo "  Tab 'glow'  → \`glow\`"
    echo "  Tab 'shell' → use it!"
    echo ""
    echo "  → \`just adopt-edinburgh && just orient\` to set up an agent"

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

# Sync skate secrets to Omarchy
sync-skate:
    SKATE_HOST=omarchy.local ./scripts/sync-skate-to-omarchy.sh

# Export skate keys to a script for Omarchy
skate-export:
    ./scripts/skate-to-omarchy.sh skate-omarchy-setup.sh

# Sync pi config to Omarchy
sync-pi:
    ./scripts/sync-pi-to-omarchy.sh

# Agent messaging via Git
msgs-inbox:
    @#!/bin/bash
    @echo "=== Unacknowledged messages ==="
    @git pull 2>/dev/null && grep -l '"status": "open"' msgs/from-*/{{date +%Y-%m-%d}}*.json 2>/dev/null | while read f; do echo "--- $$f ---"; cat "$$f" | jq -c '.summary, .topic, .from' 2>/dev/null || echo "(jq not available)"; done || echo "No messages today"

msgs-read:
    @#!/bin/bash
    @echo "=== Recent messages (last 24h) ==="
    @git log --oneline -- msgs/ --since "24 hours ago" 2>/dev/null || echo "No recent messages"

msgs-send:
    @#!/bin/bash
    @echo "Usage: just msgs-send to=OMARCHY topic=FLUX type=info summary='Your message'"
    @echo "Example: just msgs-send to=omarchy topic=task-x type=report summary='Done'"

# Agent messaging
msgs-inbox:
    @echo "Checking for open messages..." && git pull 2>/dev/null || true && ls msgs/from-*/ 2>/dev/null | head -20

msgs-send:
    @#!/bin/bash
    @set -e
    @FROM="${USER:-mac}"
    @TO="${TO:-omarchy}"
    @TOPIC="${TOPIC:-test}"
    @TYPE="${TYPE:-info}"
    @SUMMARY="${SUMMARY:-Test message}"
    @FILE="msgs/from-$${FROM}/$(date +%Y-%m-%d-%H%M)-$${TOPIC}.json"
    @mkdir -p "msgs/from-$${FROM}/"
    @echo "{\"from\":\"$${FROM}\",\"to\":\"$${TO}\",\"type\":\"$${TYPE}\",\"topic\":\"$${TOPIC}\",\"status\":\"open\",\"timestamp\":\"$$(date -Iseconds)\",\"summary\":\"$${SUMMARY}\"}" > "$$FILE"
    @echo "Message written to $$FILE"
    @echo "Commit with: git add msgs/from-$${FROM}/ && git commit -m 'msgs: $${TYPE} to $${TO} re $${TOPIC}'"

# Agent messaging modes and commands
msgs-mode:
    @#!/bin/bash
    @MODE="${1:-}"
    @if [ -z "$MODE" ]; then
    @    current=$(cat .msgs-mode 2>/dev/null || echo "multi")
    @    echo "Current mode: $current"
    @    echo "Usage: just msgs-mode [single|multi]"
    @elif [ "$MODE" = "single" ] || [ "$MODE" = "multi" ]; then
    @    echo "$MODE" > .msgs-mode
    @    echo "Mode set to: $MODE"
    @else
    @    echo "Invalid mode. Use: just msgs-mode [single|multi]"
    @fi

msgs-inbox:
    @#!/bin/bash
    @MODE=$(cat .msgs-mode 2>/dev/null || echo "multi")
    @if [ "$MODE" = "single" ]; then
    @    echo "Single machine mode — no messages to process"
    @    exit 0
    @fi
    @echo "=== Inbox ===" && git pull 2>/dev/null && grep -l '"status": "open"' msgs/from-*/$(date +%Y-%m-%d)*.json 2>/dev/null | while read f; do echo "--- $f ---"; jq -r '.from, .topic, .summary' "$f" 2>/dev/null || cat "$f"; done || echo "No open messages"

msgs-claim:
    @#!/bin/bash
    @BRIEF="${BRIEF:-}"
    @BY="${BY:-$USER}"
    @if [ -z "$BRIEF" ]; then echo "Usage: just msgs-claim BRIEF=001"; exit 1; fi
    @mkdir -p msgs/CLAIMS
    @if [ -f "msgs/CLAIMS/brief-$BRIEF.json" ]; then
    @    current=$(jq -r '.claimed_by' msgs/CLAIMS/brief-$BRIEF.json)
    @    echo "Brief $BRIEF already claimed by $current"
    @else
    @    echo "{\"brief\":\"$BRIEF\",\"claimed_by\":\"$BY\",\"claimed_at\":\"$(date -Iseconds)\",\"status\":\"claimed\"}" > msgs/CLAIMS/brief-$BRIEF.json
    @    git add msgs/CLAIMS/ && git commit -m "msgs: $BY claims brief-$BRIEF"
    @    echo "Claimed brief-$BRIEF by $BY"
    @fi

msgs-report:
    @#!/bin/bash
    @BRIEF="${BRIEF:-}"
    @STATUS="${STATUS:-info}"
    @SUMMARY="${SUMMARY:-}"
    @if [ -z "$BRIEF" ]; then echo "Usage: just msgs-report BRIEF=001 STATUS=complete SUMMARY='Done'"; exit 1; fi
    @mkdir -p "msgs/from-$USER/"
    @echo "{\"from\":\"$USER\",\"type\":\"report\",\"topic\":\"brief-$BRIEF\",\"status\":\"$STATUS\",\"timestamp\":\"$(date -Iseconds)\",\"summary\":\"$SUMMARY\"}" > "msgs/from-$USER/$(date +%Y-%m-%d-%H%M)-brief-$BRIEF.json"
    @git add "msgs/from-$USER/" && git commit -m "msgs: $USER reports brief-$BRIEF $STATUS"
    @echo "Report sent: brief-$BRIEF $STATUS"

msgs-master:
    @#!/bin/bash
    @echo "=== Message Master ===" && echo "" && echo "Checking CLAIMS/" && ls msgs/CLAIMS/ 2>/dev/null || echo "No claims" && echo "" && echo "Checking for expired claims..." && grep -l '"deadline"' msgs/CLAIMS/*.json 2>/dev/null | while read f; do deadline=$(jq -r '.deadline' "$f" 2>/dev/null); if [ "$(date -d "$deadline" +%s)" -lt "$(date +%s)" ]; then echo "EXPIRED: $f"; fi; done || echo "No expired claims" && echo "" && echo "Run 'just msgs-cleanup' to archive old messages"
