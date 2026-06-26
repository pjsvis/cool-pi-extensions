# MANIFEST

Directory of markdown files in this repository.

---

## API
**`just orient`** — For agents: Full orientation — branch, git state, active tasks, entry points
**`just browse`** — For humans: List all docs, preview with glow
**`glow`** — For both: Interactive markdown browser

---

## Docs

Structured reference material.
**[docs/the-vest-protocol.md](docs/the-vest-protocol.md)** — Blog post introducing the VEST Protocol and cool-pi-extensions.
**[docs/visitor-protocol.md](docs/visitor-protocol.md)** — API pattern spec — two verbs for two audiences (orient/browse). Zero-friction discovery.
**[docs/standard-mono-repo-pattern.md](docs/standard-mono-repo-pattern.md)** — Directory-level organisational convention for extensions and tooling.
**[docs/edinburgh-protocol-evals.md](docs/edinburgh-protocol-evals.md)** — Human-readable version of the Edinburgh Protocol evaluation fixture.
**[docs/edinburgh-protocol-eval.md](docs/edinburgh-protocol-eval.md)** — Earlier Edinburgh Protocol evaluation notes and scoring commentary.
**[docs/model-eval-q2-2026.md](docs/model-eval-q2-2026.md)** — Q2 2026 model evaluation results and recommendations.

**[docs/model-eval-bankruptcy.md](docs/model-eval-bankruptcy.md)** — Reaction piece: the benchmaxxing problem, Star Wars prequel analogy, intellectual texture hollowing. MiniMax and GLM indicted.
**[docs/provider-registry.md](docs/provider-registry.md)** — Provider connectivity and model registration reference.
**[docs/the-information-arbitrage-stack.md](docs/the-information-arbitrage-stack.md)** — Essay on information asymmetry and tooling choices.
**[docs/the-kahneman-shift.md](docs/the-kahneman-shift.md)** — Essay on System 1/System 2 thinking applied to AI agents.

**[docs/full-stack-overview.md](docs/full-stack-overview.md)** — Field report: the complete stack, from an agent's perspective. VEST Protocol, invisible cables, shared agent-human platform, fractal pattern, SSH-native workflow.

**[docs/bounded-context-agent-communication.md](docs/bounded-context-agent-communication.md)** — Blog post: why agents don't need to chat. Bounded context as the corrective.

**[docs/what-software-is-for.md](docs/what-software-is-for.md)** — Blog post from agent's POV: what software is for the human-agent duo. Text is the interface. CSS is irrelevant. The pub metaphor (forced).

**[docs/forgetting-seth-myers.md](docs/forgetting-seth-myers.md)** — Essay: the lost token, the gap, and the aaargggh of incomplete retrieval.

**[docs/l-inception-de-competence.md](docs/l-inception-de-competence.md)** — Essay: the gap between knowledge and understanding, and the agent's role in bridging it.

**[docs/on-literary-adaptation.md](docs/on-literary-adaptation.md)** — Essay: why some books can't be filmed, and the ones that almost got away with it.

**[docs/sdtt-bot-brief.md](docs/sdtt-bot-brief.md)** — Brief: a text-adventure bot as Dungeon Master for somatic/bodywork education.

**[docs/barnacle-reports/001-2026-06-21.md](docs/barnacle-reports/001-2026-06-21.md)** — Initial barnacle audit: model squadron pruned, config cleaned, next review scheduled Q3 2026.

---

## Playbooks

How-to guides for recurring tasks. Give pi the URL and it executes.
**[playbooks/terminal-stack.md](playbooks/terminal-stack.md)** — Pi-executable install playbook — idempotent install of the full stack.
**[playbooks/extensions.md](playbooks/extensions.md)** — Pi extension conventions + Fresh plugin conventions + lessons.
**[playbooks/briefs.md](playbooks/briefs.md)** — How to write a project brief.
**[playbooks/debriefs.md](playbooks/debriefs.md)** — How to write a project debrief.
**[playbooks/decisions.md](playbooks/decisions.md)** — How to write a decision record.
**[playbooks/cli.md](playbooks/cli.md)** — CLI tool conventions.
**[playbooks/config.md](playbooks/config.md)** — Configuration file conventions.
**[playbooks/docs.md](playbooks/docs.md)** — Documentation conventions.
**[playbooks/prompts.md](playbooks/prompts.md)** — Prompt engineering conventions.

---

## Briefs

Project briefs define **what** and **why** before code is written. Frozen when
work starts.
**Brief 002: [briefs/002-pi-check-zenmux.md](briefs/002-pi-check-zenmux.md)** — pending
**Brief 004: [briefs/004-glow-fresh-preview.md](briefs/004-glow-fresh-preview.md)** — complete
**Brief 006: [briefs/006-manifest-system-lesson.md](briefs/006-manifest-system-lesson.md)** — lesson documented

**Brief 008: [briefs/008-the-invisible-cables.md](briefs/008-the-invisible-cables.md)** — complete

**Brief 009: [briefs/009-pi-config-from-repo.md](briefs/009-pi-config-from-repo.md)** — implemented

**Brief 010: [briefs/010-bounded-context-for-agents.md](briefs/010-bounded-context-for-agents.md)** — complete

**Brief 011: [briefs/011-test-just-dev-on-omarchy.md](briefs/011-test-just-dev-on-omarchy.md)** — pending

**Brief 012: [briefs/012-compare-kimi-25-vs-26.md](briefs/012-compare-kimi-25-vs-26.md)** — pending

**Insights playbook: [playbooks/insights.md](playbooks/insights.md)** — Persistent collection of small observations that don't fit existing playbooks.

**herdr: [playbooks/herdr.md](playbooks/herdr.md)** — Session multiplexing: workspaces, tabs, keybindings, daemon persistence, SSH integration.

**TailScale: [playbooks/tailscale.md](playbooks/tailscale.md)** — Private mesh networking: install, authenticate, SSH from anywhere, MagicDNS, exit nodes.

**Omarchy setup: [playbooks/omarchy-setup.md](playbooks/omarchy-setup.md)** — Fresh machine setup: disable suspend, SSH + GitHub auth, clone repo, install TailScale/herdr/pi/Fresh/td, provision the stack.

**Agent messages: [playbooks/agent-messages.md](playbooks/agent-messages.md)** — Git-native inter-agent communication. msgs/ directories, JSON messages, push/pull coordination. War-game scenario documented.
---

## Debriefs

Post-implementation reflections. Capture what worked, what didn't, what to try
next.
**Debrief 004: [debriefs/004-glow-cmdp-mode-toggle.md](debriefs/004-glow-cmdp-mode-toggle.md)** — Glow CMD/⌘+P mode-toggle retrospective.

**Debrief 005: [debriefs/005-visibility-patterns.md](debriefs/005-visibility-patterns.md)** — Discoverable affordances: VEST approach to UX, auto-refresh creates discovery moment, zero onboarding friction.

**Debrief 007: [debriefs/007-multi-machine-mesh-and-bounded-context.md](debriefs/007-multi-machine-mesh-and-bounded-context.md)** — Complete session debrief. Three-loop architecture (Alpha/Gamma/Delta), bounded context framework, git as message bus, pub metaphor, what software is for.

**Debrief 008: [debriefs/008-flox-deprecation-and-the-half-built-loop.md](debriefs/008-flox-deprecation-and-the-half-built-loop.md)** — Flox deprecation; the half-built replacement loop as the defining agent failure mode. Closing loops in one movement.

---

## Decisions

Recorded architectural decisions with context, rationale, and consequences.
**Decision 002: [decisions/002-ansi-color-numbers.md](decisions/002-ansi-color-numbers.md)** — ANSI color numbers over hex for Glamour theme matching.
**Decision 004: [decisions/004-glow-cmdp-mode-command.md](decisions/004-glow-cmdp-mode-command.md)** — Glow toggle is a mode command, not an Explorer follower.
**Decision 005: [decisions/005-model-squadron-pruning.md](decisions/005-model-squadron-pruning.md)** — Model squadron audit: dropped MiniMax M3, added GLM-5.2, K2.7-code, Qwen 3.x.
**Decision 006: [decisions/006-minimal-viable-agent-stack.md](decisions/006-minimal-viable-agent-stack.md)** — MVAS principle: constraint stack over feature accumulation.
**Decision 007: [decisions/007-barnacle-review-process.md](decisions/007-barnacle-review-process.md)** — Quarterly process to prevent agent config accretion.
**Decision 008: [decisions/008-deprecate-flox.md](decisions/008-deprecate-flox.md)** — Deprecate Flox; DEPENDENCIES.md + `just install-deps` is the dependency surface.
**Decision 009: [decisions/009-direction-change-delineation.md](decisions/009-direction-change-delineation.md)** — No old/new coexistence on direction changes; canonical four process folders (briefs/decisions/debriefs/playbooks).

---

## Models

Edinburgh Protocol-evaluated models for the agent squadron.
**[models/RECOMMENDED.md](models/RECOMMENDED.md)** — Quick reference: top performers, watch list, drop list, and decision rationale.
**[models/models.json](models/models.json)** — Full model inventory with Edinburgh scores, IQ scores, pricing, and provider access.

**Squadron Status:**
- ⭐ Primary: Kimi K2.6 (18/19), GLM-5.2 (8/8 IQ)
- ✅ Recommended: GLM-5 (16/19), Qwen 3.7 Max (16/19), DeepSeek V4 Pro (14/19)
- ❌ Dropped: MiniMax M3 (7/19 — poor Edinburgh alignment)

---

## Prompts

Reusable prompt templates and agent identity frameworks.
**[prompts/edinburgh-protocol-evals-v1.json](prompts/edinburgh-protocol-evals-v1.json)** — Behavioral trap vectors — sycophancy, blind coding, dependency bloat, ungrounded justification.
**[prompts/edinburgh-protocol.md](prompts/edinburgh-protocol.md)** — The Edinburgh Protocol: Scottish Enlightenment principles for agent behavior normalization.

---

## Source
**`src/cli/`** — CLI tools — pi-check, pi-models.
**`scripts/`** — Lightweight repo hygiene scripts — manifest/barnacle checks.