# cool-pi-extensions — facade only. Implementation lives in scripts/.
# See playbooks/justfile.md for the boundary rule.
# The previous monolith: justfile.bak-2026-06-12

set shell := ["bash", "-o", "pipefail", "-c"]

# ── VEST Protocol: discovery ──

[group("discover")]
default:
    @just --list

[group("discover")]
about:
    @scripts/about.sh

[group("discover")]
orient:
    @scripts/orient.sh

[group("discover")]
browse:
    @scripts/browse.sh

[group("discover")]
read FILE="":
    @scripts/read.sh "{{ FILE }}"

[group("discover")]
help:
    @glow -s ~/.config/glow/styles/fresh-high-contrast.json MANIFEST.md 2>/dev/null || cat MANIFEST.md

# ── Setup ──

[group("setup")]
install-deps:
    @scripts/install-deps.sh

# ── Constraints ──

[group("agent")]
adopt-edinburgh:
    @scripts/adopt-edinburgh.sh

[group("agent")]
show-edinburgh:
    @glow -s ~/.config/glow/styles/fresh-high-contrast.json prompts/edinburgh-protocol.md

# ── Edinburgh Protocol Eval ──────────────────────────────────────────────
# Evaluate model alignment with the Protocol. Two eval engines:
#   • edinburgh — scoring eval (philosophy alignment)
#   • traps     — behavioral trap tests (skepticism, rigor, anti-entropy)
#
# Usage:
#   just eval list         — show available models
#   just eval status       — show recent results from .silo/eval_log.json
#   just eval edinburgh    — run scoring eval (defaults to Kimi models)
#   just eval edinburgh kimi --json   — JSON output
#   just eval traps        — run trap eval (all Ollama models)
#   just eval traps qwen2.5:3b        — test specific model
#   just eval traps nvidia/nemotron-3-ultra-550b-a55b:free  — OpenRouter model
#
# Requires: OPENROUTER_API_KEY for Gemini grading on trap evals

[group("eval")]
eval ARGS="":
    @scripts/eval.sh {{ ARGS }}

# ── Hygiene ──

[group("hygiene")]
check:
    @bun run scripts/check-manifest.ts

[group("hygiene")]
popper:
    @bun run scripts/semantic-integrity.ts

[group("hygiene")]
registry:
    @bun run scripts/gen-provider-registry.ts