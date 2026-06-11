# MANIFEST

Directory of markdown files in this repository. No code indexing — just
documentation, playbooks, briefs, debriefs, and decisions.

---

## Docs

Structured reference material. Start here for architectural context.

| File | Description |
|---|---|
| [docs/terminal-stack.md](docs/terminal-stack.md) | Stack architecture — six-layer terminal-native toolchain (TailScale, Alacritty, herdr, pi, Fresh, Echo). SSH workflow, cross-platform matrix, comparison with VS Code/JetBrains/tmux. |
| [docs/standard-mono-repo-pattern.md](docs/standard-mono-repo-pattern.md) | Directory-level organisational convention for pi extensions and tooling. |
| [docs/edinburgh-protocol-evals.md](docs/edinburgh-protocol-evals.md) | Human-readable version of the Edinburgh Protocol evaluation fixture. |
| [docs/provider-registry.md](docs/provider-registry.md) | Provider connectivity and model registration reference. |
| [docs/the-information-arbitrage-stack.md](docs/the-information-arbitrage-stack.md) | Essay on information asymmetry and tooling choices. |
| [docs/the-kahneman-shift.md](docs/the-kahneman-shift.md) | Essay on System 1/System 2 thinking applied to AI agents. |

### External articles

Blog drafts in the [blog-posts](https://github.com/pjsvis/blog-posts) repo:

| Title | File | Description |
|---|---|---|
| The Harness-Harness | `_drafts/2026-06-11-harness-harness.md` | Why we need scaffolding for our scaffolding. Blackadder tone. |
| Terminal-native stack | `_drafts/2026-06-11-terminal-native-stack.md` | Toolchain justification — layer by layer, "tt" naming wars, AngularJS flashbacks. |
| The Silo Manifesto | `_drafts/2026-06-11-silo-manifesto.md` | Methodology — briefs, debriefs, td, Edinburgh Protocol, silo boundary. |

---

## Playbooks

How-to guides for recurring tasks. Give pi the URL and it executes.

| File | Description |
|---|---|
| [playbooks/terminal-stack.md](playbooks/terminal-stack.md) | Pi-executable install playbook — idempotent install of the full stack. |
| [playbooks/extensions.md](playbooks/extensions.md) | Pi extension conventions + Fresh plugin conventions + Glow + Pi model config lessons. |
| [playbooks/briefs.md](playbooks/briefs.md) | How to write a project brief. |
| [playbooks/debriefs.md](playbooks/debriefs.md) | How to write a project debrief. |
| [playbooks/decisions.md](playbooks/decisions.md) | How to write a decision record. |
| [playbooks/canon.md](playbooks/canon.md) | Canon publishing conventions. |
| [playbooks/cli.md](playbooks/cli.md) | CLI tool conventions. |
| [playbooks/config.md](playbooks/config.md) | Configuration file conventions. |
| [playbooks/docs.md](playbooks/docs.md) | Documentation conventions. |
| [playbooks/prompts.md](playbooks/prompts.md) | Prompt engineering conventions. |
| [playbooks/writing.md](playbooks/writing.md) | Writing conventions for the repo. |

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

---

## Debriefs

Post-implementation reflections. Capture what worked, what didn't, what to try
next.

| # | File | Description |
|---|---|---|
| 003 | [debriefs/003-protocol-evals.md](debriefs/003-protocol-evals.md) | Edinburgh Protocol evals implementation retrospective. |

---

## Decisions

Recorded architectural decisions with context, rationale, and consequences.

| # | File | Description |
|---|---|---|
| 001 | [decisions/001-glow-full-tab.md](decisions/001-glow-full-tab.md) | Full-tab preview over split pane for markdown rendering. |
| 002 | [decisions/002-ansi-color-numbers.md](decisions/002-ansi-color-numbers.md) | ANSI color numbers over hex for Glamour theme matching. |
| 003 | [decisions/003-glow-width-90.md](decisions/003-glow-width-90.md) | Hardcode Glow width at 90 chars after bisect experiment. |

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
