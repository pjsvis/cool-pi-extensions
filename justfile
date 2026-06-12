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

# ── Constraints ──

[group("agent")]
adopt-edinburgh:
    @scripts/adopt-edinburgh.sh

[group("agent")]
show-edinburgh:
    @glow -s ~/.config/glow/styles/fresh-high-contrast.json prompts/edinburgh-protocol.md

# ── Hygiene ──

[group("hygiene")]
check:
    @bun run scripts/check-manifest.ts
