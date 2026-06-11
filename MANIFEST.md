# MANIFEST

Directory of markdown files in this repository.

---

## API

| Command | Audience | What it does |
|---|---|---|
| `just orient` | Agents | Full orientation — branch, git state, active tasks, entry points |
| `just browse` | Humans | List all docs, preview with glow |
| `glow` | Both | Interactive markdown browser |

---

## Docs

Structured reference material.

| File | Description |
|---|---|
| [docs/the-vest-protocol.md](docs/the-vest-protocol.md) | Blog post introducing the VEST Protocol and cool-pi-extensions. |
| [docs/visitor-journey.md](docs/visitor-journey.md) | Guided tour — visiting agent walks through orientation in under 5 minutes. |
| [docs/visitor-protocol.md](docs/visitor-protocol.md) | API pattern spec — two verbs for two audiences (orient/browse). Zero-friction discovery. |
| [docs/terminal-stack.md](docs/terminal-stack.md) | Stack architecture — Alacritty, herdr, pi, Fresh. SSH workflow, cross-platform. |
| [docs/standard-mono-repo-pattern.md](docs/standard-mono-repo-pattern.md) | Directory-level organisational convention for extensions and tooling. |
| [docs/edinburgh-protocol-evals.md](docs/edinburgh-protocol-evals.md) | Human-readable version of the Edinburgh Protocol evaluation fixture. |
| [docs/edinburgh-protocol-eval.md](docs/edinburgh-protocol-eval.md) | Earlier Edinburgh Protocol evaluation notes and scoring commentary. |
| [docs/model-eval-q2-2026.md](docs/model-eval-q2-2026.md) | Q2 2026 model evaluation results and recommendations. |
| [docs/provider-registry.md](docs/provider-registry.md) | Provider connectivity and model registration reference. |
| [docs/the-information-arbitrage-stack.md](docs/the-information-arbitrage-stack.md) | Essay on information asymmetry and tooling choices. |
| [docs/the-kahneman-shift.md](docs/the-kahneman-shift.md) | Essay on System 1/System 2 thinking applied to AI agents. |

---

## Playbooks

How-to guides for recurring tasks. Give pi the URL and it executes.

| File | Description |
|---|---|
| [playbooks/dev-stack-setup.md](playbooks/dev-stack-setup.md) | Full dev stack setup guide — alacritty → herdr → pi → fresh (+ sidecar / td). |
| [playbooks/terminal-stack.md](playbooks/terminal-stack.md) | Pi-executable install playbook — idempotent install of the full stack. |
| [playbooks/extensions.md](playbooks/extensions.md) | Pi extension conventions + Fresh plugin conventions + lessons. |
| [playbooks/briefs.md](playbooks/briefs.md) | How to write a project brief. |
| [playbooks/debriefs.md](playbooks/debriefs.md) | How to write a project debrief. |
| [playbooks/decisions.md](playbooks/decisions.md) | How to write a decision record. |
| [playbooks/cli.md](playbooks/cli.md) | CLI tool conventions. |
| [playbooks/config.md](playbooks/config.md) | Configuration file conventions. |
| [playbooks/docs.md](playbooks/docs.md) | Documentation conventions. |
| [playbooks/prompts.md](playbooks/prompts.md) | Prompt engineering conventions. |

---

## Briefs

Project briefs define **what** and **why** before code is written. Frozen when
work starts.

| # | File | Status |
|---|---|---|
| 001 | [briefs/001-rewrite-silo.md](briefs/001-rewrite-silo.md) | done |
| 002 | [briefs/002-pi-check-zenmux.md](briefs/002-pi-check-zenmux.md) | pending |
| 003 | [briefs/003-protocol-evals.md](briefs/003-protocol-evals.md) | pending |
| 004 | [briefs/004-glow-fresh-preview.md](briefs/004-glow-fresh-preview.md) | complete |
| 005 | [briefs/005-nex-n2-pro-not-in-pi-list.md](briefs/005-nex-n2-pro-not-in-pi-list.md) | lesson documented |
| 006 | [briefs/006-manifest-system-lesson.md](briefs/006-manifest-system-lesson.md) | lesson documented |
| 007 | [briefs/007-glow-cmdp-mode-toggle.md](briefs/007-glow-cmdp-mode-toggle.md) | implemented |

---

## Debriefs

Post-implementation reflections. Capture what worked, what didn't, what to try
next.

| # | File | Description |
|---|---|---|
| 003 | [debriefs/003-protocol-evals.md](debriefs/003-protocol-evals.md) | Edinburgh Protocol evals implementation retrospective. |
| 004 | [debriefs/004-glow-cmdp-mode-toggle.md](debriefs/004-glow-cmdp-mode-toggle.md) | Glow CMD/⌘+P mode-toggle retrospective. |

---

## Decisions

Recorded architectural decisions with context, rationale, and consequences.

| # | File | Description |
|---|---|---|
| 001 | [decisions/001-glow-full-tab.md](decisions/001-glow-full-tab.md) | Full-tab preview over split pane for markdown rendering. |
| 002 | [decisions/002-ansi-color-numbers.md](decisions/002-ansi-color-numbers.md) | ANSI color numbers over hex for Glamour theme matching. |
| 003 | [decisions/003-glow-width-90.md](decisions/003-glow-width-90.md) | Hardcode Glow width at 90 chars after bisect experiment. |
| 004 | [decisions/004-glow-cmdp-mode-command.md](decisions/004-glow-cmdp-mode-command.md) | Glow toggle is a mode command, not an Explorer follower. |

---

## Prompts

Reusable prompt templates and agent identity frameworks.

| File | Description |
|---|---|
| [prompts/edinburgh-protocol.md](prompts/edinburgh-protocol.md) | Scottish Enlightenment agent identity — Hume's skepticism, Smith's systems thinking, Watt's pragmatism. |
| [prompts/edinburgh-protocol-evals-v1.json](prompts/edinburgh-protocol-evals-v1.json) | Behavioral trap vectors — sycophancy, blind coding, dependency bloat, ungrounded justification. |

---

## Source

| Directory | Description |
|---|---|
| [src/extensions/](src/extensions/) | Pi extensions — defuddle, silo, edinburgh-evals. |
| [src/cli/](src/cli/) | CLI tools — pi-check, pi-models. |
| [src/fresh/](src/fresh/) | Fresh editor plugins — glow-preview. |
| [scripts/](scripts/) | Lightweight repo hygiene scripts — manifest/barnacle checks. |