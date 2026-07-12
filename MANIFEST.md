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
**[docs/visitor-journey.md](docs/visitor-journey.md)** — Guided tour for visiting agents — the VEST on-ramp in narrative form.
**[docs/standard-mono-repo-pattern.md](docs/standard-mono-repo-pattern.md)** — Directory-level organisational convention for extensions and tooling.
**[docs/terminal-stack.md](docs/terminal-stack.md)** — The terminal-native stack (alacritty → herdr → pi → fresh).
**[docs/edinburgh-protocol-evals.md](docs/edinburgh-protocol-evals.md)** — Human-readable version of the Edinburgh Protocol evaluation fixture.
**[docs/edinburgh-protocol-eval.md](docs/edinburgh-protocol-eval.md)** — Earlier Edinburgh Protocol evaluation notes and scoring commentary.
**[docs/eval-review-q2-2026.md](docs/eval-review-q2-2026.md)** — Edinburgh Protocol eval review — Q2 2026.
**[docs/model-eval-q2-2026.md](docs/model-eval-q2-2026.md)** — Q2 2026 model evaluation results and recommendations.

**[docs/model-eval-bankruptcy.md](docs/model-eval-bankruptcy.md)** — Reaction piece: the benchmaxxing problem, Star Wars prequel analogy, intellectual texture hollowing. MiniMax and GLM indicted.
**[docs/ornith-model-card-and-zai-provider-investigation.md](docs/ornith-model-card-and-zai-provider-investigation.md)** — Ornith-1.0-9B model card summary + Z.ai provider investigation.
**[docs/provider-registry.md](docs/provider-registry.md)** — Provider connectivity and model registration reference.
**[docs/the-information-arbitrage-stack.md](docs/the-information-arbitrage-stack.md)** — Essay on information asymmetry and tooling choices.
**[docs/the-muppet-filter.md](docs/the-muppet-filter.md)** — How we built a behavioral eval system to identify models that actually work.
**[docs/why-kimi-k2.6-hasnt-benchmaxxed.md](docs/why-kimi-k2.6-hasnt-benchmaxxed.md)** — A meditation on model quality, benchmark gaming, and the difference between performance and competence.
**[docs/the-agent-is-a-benchmaxxer-of-prompts.md](docs/the-agent-is-a-benchmaxxer-of-prompts.md)** — Working draft: the Palimpsest Problem as recursive benchmaxxing — the agent optimizes the prompt, not the system. Open threads for continuation.
**[docs/the-kahneman-shift.md](docs/the-kahneman-shift.md)** — Essay on System 1/System 2 thinking applied to AI agents.

**[docs/full-stack-overview.md](docs/full-stack-overview.md)** — Field report: the complete stack, from an agent's perspective. VEST Protocol, invisible cables, shared agent-human platform, fractal pattern, SSH-native workflow.

**[docs/bounded-context-agent-communication.md](docs/bounded-context-agent-communication.md)** — Blog post: why agents don't need to chat. Bounded context as the corrective.

**[docs/what-software-is-for.md](docs/what-software-is-for.md)** — Blog post from agent's POV: what software is for the human-agent duo. Text is the interface. CSS is irrelevant. The pub metaphor (forced).

**[docs/forgetting-seth-myers.md](docs/forgetting-seth-myers.md)** — Essay: the lost token, the gap, and the aaargggh of incomplete retrieval.

**[docs/l-inception-de-competence.md](docs/l-inception-de-competence.md)** — Essay: the gap between knowledge and understanding, and the agent's role in bridging it.

**[docs/on-literary-adaptation.md](docs/on-literary-adaptation.md)** — Essay: why some books can't be filmed, and the ones that almost got away with it.

**[docs/sdtt-bot-brief.md](docs/sdtt-bot-brief.md)** — Brief: a text-adventure bot as Dungeon Master for somatic/bodywork education.

**[docs/poker-club-agreement.md](docs/poker-club-agreement.md)** — Poker Club partnership agreement — the working contract between operator and agent.

**[docs/2026-07-09-td-autocheck-bug-issue-draft.md](docs/2026-07-09-td-autocheck-bug-issue-draft.md)** — Issue draft: td automatic update-check never fires.

**[docs/decisions/table-rendering.md](docs/decisions/table-rendering.md)** — Legacy ADR-001: table rendering in markdown documentation (predates the top-level `decisions/` folder).

**[docs/NVIDIA-Quietly-Released-an-AI-Model-That-Could-Make-You-Money-by-Code-Coup-Coding-Nexus-Jun,-2026-Medium-2026-06-10.md](docs/NVIDIA-Quietly-Released-an-AI-Model-That-Could-Make-You-Money-by-Code-Coup-Coding-Nexus-Jun,-2026-Medium-2026-06-10.md)** — Saved Medium reference clipping: NVIDIA model release analysis.

**[docs/barnacle-reports/001-2026-06-21.md](docs/barnacle-reports/001-2026-06-21.md)** — Initial barnacle audit: model squadron pruned, config cleaned, next review scheduled Q3 2026.

---

## Playbooks

How-to guides for recurring tasks. Give pi the URL and it executes.

*Process & convention:*
**[playbooks/briefs-playbook.md](playbooks/briefs-playbook.md)** — How to write a project brief.
**[playbooks/debriefs-playbook.md](playbooks/debriefs-playbook.md)** — How to write a project debrief.
**[playbooks/decisions-playbook.md](playbooks/decisions-playbook.md)** — How to write a decision record.
**[playbooks/docs-playbook.md](playbooks/docs-playbook.md)** — Documentation conventions.
**[playbooks/prompts-playbook.md](playbooks/prompts-playbook.md)** — Prompt engineering conventions.
**[playbooks/cli-playbook.md](playbooks/cli-playbook.md)** — CLI tool conventions.
**[playbooks/config-playbook.md](playbooks/config-playbook.md)** — Configuration file conventions.
**[playbooks/diagrams-playbook.md](playbooks/diagrams-playbook.md)** — Diagram and coda conventions.
**[playbooks/justfile-playbook.md](playbooks/justfile-playbook.md)** — justfile facade boundary rule (implementation lives in `scripts/`).
**[playbooks/single-brief-workflow-playbook.md](playbooks/single-brief-workflow-playbook.md)** — Solo single-brief workflow — one brief, one branch, one movement.

*Tooling & workflow:*
**[playbooks/td-playbook.md](playbooks/td-playbook.md)** — td solo workflow — sessions, issues, handoffs, review.
**[playbooks/extensions-playbook.md](playbooks/extensions-playbook.md)** — Pi extension conventions + Fresh plugin conventions + lessons.
**[playbooks/014-lightweight-system.md](playbooks/014-lightweight-system.md)** — Propagating the lightweight system to new repositories.

*Install & stack:*
**[playbooks/terminal-stack-playbook.md](playbooks/terminal-stack-playbook.md)** — Pi-executable install playbook — idempotent install of the full stack.
**[playbooks/dev-stack-setup-playbook.md](playbooks/dev-stack-setup-playbook.md)** — Dev stack setup — onboarding a new machine/operator.
**[playbooks/omarchy-setup-playbook.md](playbooks/omarchy-setup-playbook.md)** — Fresh machine setup: disable suspend, SSH + GitHub auth, clone repo, install TailScale/herdr/pi/Fresh/td, provision the stack.
**[playbooks/herdr-playbook.md](playbooks/herdr-playbook.md)** — Session multiplexing: workspaces, tabs, keybindings, daemon persistence, SSH integration.
**[playbooks/tailscale-playbook.md](playbooks/tailscale-playbook.md)** — Private mesh networking: install, authenticate, SSH from anywhere, MagicDNS, exit nodes.
**[playbooks/agent-messages-playbook.md](playbooks/agent-messages-playbook.md)** — Git-native inter-agent communication. msgs/ directories, JSON messages, push/pull coordination. War-game scenario documented.

*Miscellany:*
**[playbooks/insights-playbook.md](playbooks/insights-playbook.md)** — Persistent collection of small observations that don't fit existing playbooks.

---

## Briefs

Project briefs define **what** and **why** before code is written. Frozen when
work starts.

*Numbered:*
**Brief 001: [briefs/001-rewrite-silo.md](briefs/001-rewrite-silo.md)** — Rewrite the silo extension (DONE).
**Brief 002: [briefs/002-pi-check-zenmux.md](briefs/002-pi-check-zenmux.md)** — pending
**Brief 003: [briefs/003-protocol-evals.md](briefs/003-protocol-evals.md)** — Fork-session behavioral trap vectors extension (sycophancy / entropy / ungrounded-assertion filtering).
**Brief 004: [briefs/004-glow-fresh-preview.md](briefs/004-glow-fresh-preview.md)** — complete
**Brief 005: [briefs/005-nex-n2-pro-not-in-pi-list.md](briefs/005-nex-n2-pro-not-in-pi-list.md)** — Nex N2 Pro not visible in the Pi model selector.
**Brief 006: [briefs/006-manifest-system-lesson.md](briefs/006-manifest-system-lesson.md)** — lesson documented
**Brief 007: [briefs/007-glow-cmdp-mode-toggle.md](briefs/007-glow-cmdp-mode-toggle.md)** — Glow CMD+P mode toggle.
**Brief 008: [briefs/008-the-invisible-cables.md](briefs/008-the-invisible-cables.md)** — complete
**Brief 009: [briefs/009-pi-config-from-repo.md](briefs/009-pi-config-from-repo.md)** — implemented
**Brief 010: [briefs/010-bounded-context-for-agents.md](briefs/010-bounded-context-for-agents.md)** — complete
**Brief 011: [briefs/011-test-just-dev-on-omarchy.md](briefs/011-test-just-dev-on-omarchy.md)** — pending
**Brief 011: [briefs/011-build-from-source.md](briefs/011-build-from-source.md)** — Build core tools (td, sidecar) from source.
**Brief 012: [briefs/012-compare-kimi-25-vs-26.md](briefs/012-compare-kimi-25-vs-26.md)** — pending
**Brief 013: [briefs/013-lightweight-system.md](briefs/013-lightweight-system.md)** — Lightweight system with minimal overhead.

*Dated:*
**[briefs/2026-06-27-popper-agent-01.md](briefs/2026-06-27-popper-agent-01.md)** — Popper Agent Saboteur Loop — brief + playbook.
**[briefs/2026-06-27-popper-agent-02.md](briefs/2026-06-27-popper-agent-02.md)** — Popper boundary checker — separate the generative engine from a deterministic, adversarial runtime verification loop.
**[briefs/2026-06-27-popper-agent-03.md](briefs/2026-06-27-popper-agent-03.md)** — Unified minimalist thought stack (Reid / Taleb / Kolmogorov) as a tool layer alongside the Popper loop.
**[briefs/2026-06-29-brief-sculpt-not-a-muppet.md](briefs/2026-06-29-brief-sculpt-not-a-muppet.md)** — Sculpt "Not a Muppet, Just Intellectually Challenged" to pre-publication.
**[briefs/2026-07-03-edinburgh-protocol-18-month-audit.md](briefs/2026-07-03-edinburgh-protocol-18-month-audit.md)** — 18-month Edinburgh Protocol audit.
**[briefs/2026-07-06-base-entropy-daemon.md](briefs/2026-07-06-base-entropy-daemon.md)** — `pi-entropy-watcher` v0.1 trace diagnostic.
**[briefs/2026-07-06-brief-entropy-watcher-agent.md](briefs/2026-07-06-brief-entropy-watcher-agent.md)** — `pi-entropy-watcher` — the Justify Engine daemon.
**[briefs/2026-07-09-brief-mathematica-verify-extension.md](briefs/2026-07-09-brief-mathematica-verify-extension.md)** — `pi-mathematica-verify` — symbolic stress-test harness. Spec for the active epic.
**[briefs/2026-07-09-brief-pushback-eval.md](briefs/2026-07-09-brief-pushback-eval.md)** — Map Harvard/MIT pushback findings into a testable eval script.
**[briefs/2026-07-09-brief-upgrade-verify-gate.md](briefs/2026-07-09-brief-upgrade-verify-gate.md)** — `upgrade-verify` — the friction gate.
**[briefs/2026-07-12-preflight-auditorflags.md](briefs/2026-07-12-preflight-auditorflags.md)** — System-2 pre-flight audit + flag-vector compression for the Orient phase.
**[briefs/2026-07-12-token-compaction-hook.md](briefs/2026-07-12-token-compaction-hook.md)** — Token-compaction hook — branch isolation + squash-merge to keep `main` low-entropy.
**[briefs/2026-07-12-brief-edi-005b-grounding-test.md](briefs/2026-07-12-brief-edi-005b-grounding-test.md)** — EDI-005b: test whether repo-tool grounding alone (no Protocol priming) stops yap — falsifies/quantifies Decision 015.

---

## Debriefs

Post-implementation reflections. Capture what worked, what didn't, what to try
next.
**Debrief 003: [debriefs/003-protocol-evals.md](debriefs/003-protocol-evals.md)** — Edinburgh Protocol model evals retrospective.
**Debrief 004: [debriefs/004-glow-cmdp-mode-toggle.md](debriefs/004-glow-cmdp-mode-toggle.md)** — Glow CMD/⌘+P mode-toggle retrospective.

**Debrief 005: [debriefs/005-visibility-patterns.md](debriefs/005-visibility-patterns.md)** — Discoverable affordances: VEST approach to UX, auto-refresh creates discovery moment, zero onboarding friction.

**Debrief 006: [debriefs/006-two-machine-mesh.md](debriefs/006-two-machine-mesh.md)** — Two-machine multi-agent mesh.

**Debrief 007: [debriefs/007-multi-machine-mesh-and-bounded-context.md](debriefs/007-multi-machine-mesh-and-bounded-context.md)** — Complete session debrief. Three-loop architecture (Alpha/Gamma/Delta), bounded context framework, git as message bus, pub metaphor, what software is for.

**Debrief 007: [debriefs/007-build-from-source.md](debriefs/007-build-from-source.md)** — Building td and sidecar from source.

**Debrief 008: [debriefs/008-flox-deprecation-and-the-half-built-loop.md](debriefs/008-flox-deprecation-and-the-half-built-loop.md)** — Flox deprecation; the half-built replacement loop as the defining agent failure mode. Closing loops in one movement.

**Debrief 009: [debriefs/009-pi-mathematica-verify-phase-1-translator.md](debriefs/009-pi-mathematica-verify-phase-1-translator.md)** — Phase 1 of the symbolic tensor-algebra verify harness: LaTeX→WL translator 10/10, lookup-first registry 9/9. Decision 010/011 recorded.

---

## Decisions

Recorded architectural decisions with context, rationale, and consequences.
**Decision 001: [decisions/001-glow-full-tab.md](decisions/001-glow-full-tab.md)** — Full-tab preview over split pane for markdown rendering.
**Decision 002: [decisions/002-ansi-color-numbers.md](decisions/002-ansi-color-numbers.md)** — ANSI color numbers over hex for Glamour theme matching.
**Decision 003: [decisions/003-glow-width-90.md](decisions/003-glow-width-90.md)** — Hardcode Glow width at 90 chars.
**Decision 004: [decisions/004-glow-cmdp-mode-command.md](decisions/004-glow-cmdp-mode-command.md)** — Glow toggle is a mode command, not an Explorer follower.
**Decision 005: [decisions/005-model-squadron-pruning.md](decisions/005-model-squadron-pruning.md)** — Model squadron audit: dropped MiniMax M3, added GLM-5.2, K2.7-code, Qwen 3.x.
**Decision 006: [decisions/006-minimal-viable-agent-stack.md](decisions/006-minimal-viable-agent-stack.md)** — MVAS principle: constraint stack over feature accumulation.
**Decision 007: [decisions/007-barnacle-review-process.md](decisions/007-barnacle-review-process.md)** — Quarterly process to prevent agent config accretion.
**Decision 008: [decisions/008-deprecate-flox.md](decisions/008-deprecate-flox.md)** — Deprecate Flox; DEPENDENCIES.md + `just install-deps` is the dependency surface.
**Decision 009: [decisions/009-direction-change-delineation.md](decisions/009-direction-change-delineation.md)** — No old/new coexistence on direction changes; canonical four process folders (briefs, decisions, debriefs, playbooks).

**Decision 010: [decisions/010-decouple-translator-validation-from-api-access.md](decisions/010-decouple-translator-validation-from-api-access.md)** — LaTeX→WL translator runs in parallel with API-access validation; WL is portable interchange; free WA-web oracle upper bounds the translatable engine layer.

**Decision 011: [decisions/011-lookup-first-verification-registry.md](decisions/011-lookup-first-verification-registry.md)** — The verification registry is the authoritative spec; the translator is bootstrap/fallback; hash-based drift detection makes manuscript edits loud.

**Decision 012: [decisions/012-diagram-strategy.md](decisions/012-diagram-strategy.md)** — Diagram coda strategy.

**Decision 013: [decisions/013-silo-exception-pi-config.md](decisions/013-silo-exception-pi-config.md)** — Single, scoped exception to SILO for this repo: agent may edit `~/.pi/agent/{models,settings}.json` for Pi config; auth.json + skate secrets remain off-limits.

**Decision 014: [decisions/014-phase-0-mathematica-validation.md](decisions/014-phase-0-mathematica-validation.md)** — Phase 0 outcomes for `pi-mathematica-verify`: Cloud API obtainable (free tier sufficient); current app downloadable; v10.0 mandatory upgrade to Mathematica **13.x or 14.x with xAct 1.2.0** (1.3.0 has documented 14.3+ collision; 1.2.0 is the safe pairing).
**Decision 015: [decisions/015-bounded-context-entry.md](decisions/015-bounded-context-entry.md)** — Bounded-context entry as default: never start a model unconstrained — repo context (VEST/`just orient`) for repo work, a frozen brief for non-repo work. Protocol normalizes the substrate (manner); the bound grounds it (matter). EDI-005 proved Protocol-alone still yaps.

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
**[prompts/edinburgh-005b-grounding-v1.json](prompts/edinburgh-005b-grounding-v1.json)** — EDI-005b grounding probe (weak) — does observational affordance (no Protocol priming) redirect yap to scoping? Isolated experiment fixture for Decision 015.
**[prompts/edinburgh-005b-strong-v1.json](prompts/edinburgh-005b-strong-v1.json)** — EDI-005b grounding probe (strong) — real repo tools via OpenRouter function-calling; does ACTUAL observation drive scoping? Decisive test for Decision 015.
**[prompts/edinburgh-protocol.md](prompts/edinburgh-protocol.md)** — The Edinburgh Protocol: Scottish Enlightenment principles for agent behavior normalization.
**[prompts/iq-benchmark-v1.json](prompts/iq-benchmark-v1.json)** — Agent IQ benchmark — reasoning depth and multi-step planning tests for intelligence ranking.
**[prompts/pi-models-example.md](prompts/pi-models-example.md)** — Example `models.json` configuration for pi-models.

---

## Source
**`src/cli/`** — CLI tools — pi-check, pi-models.
**`scripts/`** — Lightweight repo hygiene scripts — manifest/barnacle checks.
