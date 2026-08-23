# cool-pi-extensions — facade only. Implementation lives in scripts/.
# See playbooks/justfile-playbook.md for the boundary rule.

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
    @glow MANIFEST.md 2>/dev/null || cat MANIFEST.md

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
    @glow SYSTEM.md

# ── Edinburgh Protocol Eval ──────────────────────────────────────────────
# pi-eval is the canonical engine (src/cli/pi-eval). Reading results:
#   just results              — per-model digest table (all models, latest)
#   just results <model>      — latest-run per-test breakdown
#   just results run <id>     — full run detail (grades, evidence, preview)
#   just suite                — the trap-suite documentation (EDI-001…007)
# Running evals: just eval <cmd> — see `just eval help` (scripts/eval.sh)

[group("eval")]
results *ARGS="":
    @python3 scripts/eval-digest.py {{ ARGS }}

[group("eval")]
suite:
    @glow docs/edinburgh-protocol-evals.md 2>/dev/null || cat docs/edinburgh-protocol-evals.md

[group("eval")]
eval ARGS="":
    @scripts/eval.sh {{ ARGS }}

# ── Hygiene ──

# Generate per-folder register.jsonl + MANIFEST.md roll-up (the structural checksum).
[group("hygiene")]
registers:
    @bun run scripts/gen-registers.ts

# Verify registers match the filesystem + manifest is fresh (the gate).
[group("hygiene")]
check:
    @bun run scripts/check-manifest.ts

# Live model probe — sends a real chat completion through `pi` for each
# enabledModel. Catches auth.json staleness, baseUrl/api collisions, and
# per-model header issues that pi-check (which hits /models and bypasses
# auth.json) cannot. Pass model refs as args to probe a subset.
[group("hygiene")]
probe *args="":
    @scripts/probe-models.sh {{args}}

# Run extension tests (silo boundary verification).
[group("hygiene")]
test:
    @bun test src/extensions/silo/

[group("hygiene")]
popper:
    @bun run scripts/semantic-integrity.ts

[group("hygiene")]
registry:
    @bun run scripts/gen-provider-registry.ts

[group("hygiene")]
sync-config:
    @bun run scripts/sync-config.ts

# ── Editors ──

# Remove non-spiceedit terminal editors (fresh-editor, helix, micro, neovim, amp).
# Dry-run by default; pass --yes to actually uninstall.
[group("setup")]
uninstall-editors FLAGS="":
    @scripts/uninstall-editors.sh {{ FLAGS }}

# ── Mermaid ────────────────────────────────────────────────────────────────
# Thin facade over the external npm CLI (repo ~/Dev/GitHub/mermaid-to-md,
# symlinked on PATH; Decision 023 — no in-repo renderer).
#
# Usage:
#   just mermaid docs/architecture.md        — (re)bake art from ```mmd blocks, in place
#   just mermaid --verify docs/architecture.md — drift check (exit 1 if stale)

[group("mermaid")]
mermaid *ARGS:
    @mermaid-to-md {{ ARGS }}