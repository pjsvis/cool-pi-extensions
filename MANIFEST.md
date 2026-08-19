# MANIFEST

Directory of markdown files in this repository.

The folder sections below are **generated** from per-folder `register.jsonl`
files by `just registers` (a Shannon-style structural checksum — `git diff` on
a register IS the structural delta of that folder). Sections outside the
`<!-- BEGIN/END REGISTERS -->` markers are hand-maintained. Run `just check`
to verify the registers match the filesystem.

---

## API

**`just orient`**
For agents: Full orientation — branch, git state, active tasks, entry points

**`just browse`**
For humans: List all docs, preview with glow

**`glow`**
For both: Interactive markdown browser

---

<!-- BEGIN REGISTERS -->
## Briefs
Project briefs define **what** and **why** before code is written. Frozen when work starts.

**[briefs/001-rewrite-silo.md](briefs/001-rewrite-silo.md)** — Rewrite the `silo-sandbox` extension with two changes:

**[briefs/002-pi-check-zenmux.md](briefs/002-pi-check-zenmux.md)** — Wrote a TypeScript/Bun CLI (`cli/pi-check/check.ts`) using citty 0.2.2. It reads `~/.pi/agent/models.json`, resolves `!skate get` keys, pro…

**[briefs/003-protocol-evals.md](briefs/003-protocol-evals.md)** — An extension for the Pi coding agent that forks the active session into isolated, parallel branches to run behavioral trap vectors. It prog…

**[briefs/005-nex-n2-pro-not-in-pi-list.md](briefs/005-nex-n2-pro-not-in-pi-list.md)** — The model `nex-agi/nex-n2-pro:free` did not appear in Pi's model selector, despite

**[briefs/006-manifest-system-lesson.md](briefs/006-manifest-system-lesson.md)** — Review the `TradingAgents` repo's manifest and barnacle-control system, then

**[briefs/008-the-invisible-cables.md](briefs/008-the-invisible-cables.md)** — The terminal-native stack is built on a four-layer foundation: Alacritty, herdr, pi, Fresh. It's documented and understood. What is not doc…

**[briefs/009-pi-config-from-repo.md](briefs/009-pi-config-from-repo.md)** — Setting up pi on a new machine (like Omarchy) requires:

**[briefs/010-bounded-context-for-agents.md](briefs/010-bounded-context-for-agents.md)** — > Purpose – Provide a repeatable, auditable pipeline that takes a single

**[briefs/011-build-from-source.md](briefs/011-build-from-source.md)** — We depend on `td` and `sidecar` for agent workflow (task tracking + session monitor). Both are distributed via a Homebrew tap (`marcus/home…

**[briefs/011-test-just-dev-on-omarchy.md](briefs/011-test-just-dev-on-omarchy.md)** — Test the full dev-provisioning flow on Omarchy. Verify that all dependencies (bun, just, glow, rtk, skate, pi, herdr, Fresh) are correctly…

**[briefs/012-compare-kimi-25-vs-26.md](briefs/012-compare-kimi-25-vs-26.md)** — Test Kimi k2.5 and k2.6 against the Edinburgh Protocol behavioral trap vectors. Compare their responses, specifically looking for:

**[briefs/013-lightweight-system.md](briefs/013-lightweight-system.md)** — Goal – Capture the consensus on a low‑friction, high‑integrity workflow that can be copied to other repositories.

**[briefs/2026-06-27-popper-agent-01.md](briefs/2026-06-27-popper-agent-01.md)** — Below is the technical Brief and the operational Playbook to implement and anchor the Popper Agent Saboteur Loop directly into your local r…

**[briefs/2026-06-27-popper-agent-02.md](briefs/2026-06-27-popper-agent-02.md)** — If we take Popper seriously, a "boundary checker" cannot be an LLM asking itself if it is sure. That is just more induction. Instead, we mu…

**[briefs/2026-06-27-popper-agent-03.md](briefs/2026-06-27-popper-agent-03.md)** — This Brief operationalizes the unified minimalist thought stack. It translates the philosophical boundaries of Reid, Taleb, and Kolmogorov…

**[briefs/2026-06-29-brief-sculpt-not-a-muppet.md](briefs/2026-06-29-brief-sculpt-not-a-muppet.md)** — Sculpt the draft blog post (~1,400 words) to a pre-publication version, per the sculpting heuristic. The draft has the figure inside it — t…

**[briefs/2026-07-03-edinburgh-protocol-18-month-audit.md](briefs/2026-07-03-edinburgh-protocol-18-month-audit.md)** — 1. ✓ Ling-1T = `inclusionai/ling-2.6-1t` (same 1T-param model, Ling→Ring rename

**[briefs/2026-07-06-base-entropy-daemon.md](briefs/2026-07-06-base-entropy-daemon.md)** — Deploy a background daemon that operates as an entropy diagnostic device. Instead of fine-tuning, v0.1 leverages the innate behavior of rea…

**[briefs/2026-07-06-brief-entropy-watcher-agent.md](briefs/2026-07-06-brief-entropy-watcher-agent.md)** — To transform the Pi coding agent from a passive, probabilistic text generator into an active, structural immune system for the repository.…

**[briefs/2026-07-09-brief-mathematica-verify-extension.md](briefs/2026-07-09-brief-mathematica-verify-extension.md)** — To give the poverty-of-bio-mechanics book a judge whose failure mode is `False` rather than fluent agreement. A Pi coding-agent extension t…

**[briefs/2026-07-09-brief-pushback-eval.md](briefs/2026-07-09-brief-pushback-eval.md)** — [Locus: Eval_Brief_Persuasion_Bombing]

**[briefs/2026-07-09-brief-upgrade-verify-gate.md](briefs/2026-07-09-brief-upgrade-verify-gate.md)** — To convert CLI-tool upgrades from fire-and-forget into upgrade → verify → confirm-or-fail. A gate that, after `brew upgrade <tool>`, assert…

**[briefs/2026-07-12-brief-edi-005b-grounding-test.md](briefs/2026-07-12-brief-edi-005b-grounding-test.md)** — A trap variant testing whether observational grounding alone (repo tools, no Protocol priming) prevents elaboration/fabrication on the EDI-…

**[briefs/2026-07-12-preflight-auditorflags.md](briefs/2026-07-12-preflight-auditorflags.md)** — type: brief

**[briefs/2026-07-12-token-compaction-hook.md](briefs/2026-07-12-token-compaction-hook.md)** — Your concern about cluttering `main` with an ever-growing graveyard of dead task files is dead on. If we don't isolate them, the root direc…

**[briefs/2026-07-14-brief-locus-tag-consumer.md](briefs/2026-07-14-brief-locus-tag-consumer.md)** — A compaction script that reads a session transcript sectioned by `[LOC:]` / `[WAYPOINT:]` tags (per the Protocol v1.1.0 directive), runs ea…

**[briefs/2026-07-16-brief-edinburgh-eval-delta-and-sit-v2.md](briefs/2026-07-16-brief-edinburgh-eval-delta-and-sit-v2.md)** — A multi-phase experiment that evolved from "does the Edinburgh Protocol do anything?" into a full measurement-validation pipeline with two…

**[briefs/2026-07-17-brief-conceptual-lexicon-jsonl.md](briefs/2026-07-17-brief-conceptual-lexicon-jsonl.md)** — Extract the Conceptual Lexicon from inline markdown in `prompts/edinburgh-protocol.md` and `~/.pi/agent/AGENTS.md` into a standalone JSONL…

**[briefs/2026-07-17-brief-predictably-adequate-series.md](briefs/2026-07-17-brief-predictably-adequate-series.md)** — A linked series of blog posts defining a minimalist agent setup — built from nothing, adding only what the work demands. The series deploys…

**[briefs/2026-07-18-brief-session-newup-discipline.md](briefs/2026-07-18-brief-session-newup-discipline.md)** — A single session ran too long without a context reset. Every turn re-sent the

**[briefs/2026-07-19-brief-folder-registers.md](briefs/2026-07-19-brief-folder-registers.md)** — One generator (`scripts/gen-registers.ts`) emits a `register.jsonl` in each registered folder and rolls them up into an auto-generated `MAN…

**[briefs/2026-07-19-brief-gdpr-document-screener.md](briefs/2026-07-19-brief-gdpr-document-screener.md)** — Locus Tag: CDA63-CL179-WEAPON-GDPR

**[briefs/2026-07-20-brief-publication-convergence.md](briefs/2026-07-20-brief-publication-convergence.md)** — The Derrida question — "should this even be in our consideration set?" — was asked at newup of the publication backlog. It bit. Three plann…

**[briefs/2026-07-20-brief-shannon-publication-newup.md](briefs/2026-07-20-brief-shannon-publication-newup.md)** — Long session developed the "context window as a noisy channel" frame and produced two filed blog assets. Context window now heavy; newing u…

**[briefs/2026-07-20-brief-silo-and-stack-newup.md](briefs/2026-07-20-brief-silo-and-stack-newup.md)** — Four-part directive: (1-2) excise glow-fresh editor integration; (3-5) get silo working + confirm real isolation; (6-7) review MVAS / remov…

**[briefs/2026-07-20-brief-stack-rightsizing-complete.md](briefs/2026-07-20-brief-stack-rightsizing-complete.md)** — Phase A — glow-fresh excision: plugin + decisions 001–004 + briefs 004/007 + debriefs 004/005 deleted; justfile / `scripts/about.sh` / `scr…

**[briefs/2026-07-22-brief-pi-eval-cli-consolidation.md](briefs/2026-07-22-brief-pi-eval-cli-consolidation.md)** — Replace the `edinburgh-evals` pi extension (state machine + event hooks + in-session model switching) with an enhanced standalone `pi-eval`…

**[briefs/2026-07-23-brief-mermaid-diagrams-for-docs.md](briefs/2026-07-23-brief-mermaid-diagrams-for-docs.md)** — Convert prose descriptions of architectures, pipelines, and state machines into Mermaid diagrams in four documentation files. Each diagram…

**[briefs/2026-07-26-brief-edi-006-phase1-scope-lever-measured.md](briefs/2026-07-26-brief-edi-006-phase1-scope-lever-measured.md)** — Measured whether a concrete scope-discipline instruction in the system prompt closes the EDI-005 gap (both frontier models fail "must ask f…

**[briefs/2026-07-26-brief-edi-006-phase2-1-regex-fixed.md](briefs/2026-07-26-brief-edi-006-phase2-1-regex-fixed.md)** — Phase 2 finding 3 identified the EDI-005 `regex_match` assertion as instrument debt: both Phase-2 EDI-005 clarifications were false-negativ…

**[briefs/2026-07-26-brief-edi-006-phase2-5-precise-trigger.md](briefs/2026-07-26-brief-edi-006-phase2-5-precise-trigger.md)** — Phase 2 finding 2: qwen OVER-APPLIES the scope-discipline instruction — it cannot discriminate "ambiguous prior work" (EDI-005, trigger) fr…

**[briefs/2026-07-26-brief-edi-006-phase2-scope-lever-promoted.md](briefs/2026-07-26-brief-edi-006-phase2-scope-lever-promoted.md)** — Phase 1 proved the scope-discipline instruction works as a *salient, per-test append* (primed "must ask" 0/2 → 2/2). Phase 2 promotes it fr…

**[briefs/2026-07-26-brief-edi-007-phase4-scope-agnostic.md](briefs/2026-07-26-brief-edi-007-phase4-scope-agnostic.md)** — Phases 1–2.5 measured and closed the EDI-005 scope-discipline gap on a single prompt — and that prompt is project-vocabulary-coupled ("entr…

**[briefs/2026-07-26-brief-okf-frontmatter-migration.md](briefs/2026-07-26-brief-okf-frontmatter-migration.md)** — Migrate the six registered knowledge folders to OKF v0.2 frontmatter; freeze schema, type vocab, gate flip plan, and replace-vs-coexist.

**[briefs/2026-07-26-brief-remove-mermaid-to-md.md](briefs/2026-07-26-brief-remove-mermaid-to-md.md)** — Remove spun-off mermaid-to-md work — renderer, pi extension, and 6 briefs — from this repo; it now lives in ~/dev/github/mermaid-to-md.

**[briefs/2026-07-26-brief-replace-regex-with-grader.md](briefs/2026-07-26-brief-replace-regex-with-grader.md)** — The scope-discipline "must ask" assertion is a `regex_match` — a closed list of refusal-to-proceed phrasings (`I can't design`, `before I c…

**[briefs/2026-07-26-brief-scope-discipline-gate.md](briefs/2026-07-26-brief-scope-discipline-gate.md)** — A phased epic to determine whether scope discipline (the EDI-005 trap: "build on incomplete spec without asking for clarification") is trai…

**[briefs/2026-07-27-brief-phase-c-grader-sole-scope-verdict.md](briefs/2026-07-27-brief-phase-c-grader-sole-scope-verdict.md)** — The brief proposed "regex as fast pre-filter, grader as ceiling" — regex passes skip the grader (cost saving), regex fails trigger the grad…

**[briefs/2026-07-28-brief-minimax-auth-paths-and-probe-gap.md](briefs/2026-07-28-brief-minimax-auth-paths-and-probe-gap.md)** — > We are having problems communicating with the minimax provider with Minimax-m3 and minimax-m2.7 — auth issues.

**[briefs/2026-08-01-brief-nim-provider-branch.md](briefs/2026-08-01-brief-nim-provider-branch.md)** — Add a NVIDIA NIM provider branch to the eval harness, then run a six-model sweep through the Phase-D-aligned 24-probe suite (edinburgh 5 +…

**[briefs/2026-08-03-brief-pi-eval-bracketed-timeout.md](briefs/2026-08-03-brief-pi-eval-bracketed-timeout.md)** — A capability-driven per-test timeout: streaming + liveness (B2) when the route supports it (default), bracketed wall-clock (B1) as fallback…

**[briefs/2026-08-04-brief-apfel-apple-intelligence-candidate.md](briefs/2026-08-04-brief-apfel-apple-intelligence-candidate.md)** — `run_edinburgh_eval(apfel/apple-foundationmodel)` → Run `7835be9d`, fixture `edinburgh` (5 traps), temperature 0, grader `nemotron-3-nano-3…

**[briefs/2026-08-04-brief-eval-heavy-reasoner-timeout-gap.md](briefs/2026-08-04-brief-eval-heavy-reasoner-timeout-gap.md)** — The Edinburgh eval harness (`src/cli/pi-eval`) cannot produce a clean, complete 5-trap run for heavy reasoning models. qwen3.8-max — a stro…

**[briefs/2026-08-04-brief-zai-provider-config-gaps.md](briefs/2026-08-04-brief-zai-provider-config-gaps.md)** — z.ai (GLM) is reliable through OpenCode but, with z.ai set as the default route, it was "intermittently intermittent." This brief character…

**[briefs/2026-08-07-brief-comparison-matric-and-tokens.md](briefs/2026-08-07-brief-comparison-matric-and-tokens.md)** — Enhance `pi-eval` to record, report, and score token efficiency (prompt tokens, completion tokens, and compaction/truncation events) alongs…

**[briefs/2026-08-08-brief-staged-delivery-replanning.md](briefs/2026-08-08-brief-staged-delivery-replanning.md)** — A named method for running bounded, low-cost, multi-phase work — and the recurring meta-pattern that keeps producing improvements to it.

**[briefs/2026-08-11-jsonl-state-reducer.md](briefs/2026-08-11-jsonl-state-reducer.md)** — Build a zero-dependency (outside foundational I/O/serialization crates) Rust engine and CLI that evaluates append-only `.jsonl` state event…

**[briefs/2026-08-15-brief-objective-review-remediation.md](briefs/2026-08-15-brief-objective-review-remediation.md)** — Address the findings of the 2026-08-15 objective project review. The eval lab is real and decision-driving; the gaps are (a) uncommitted wo…

**[briefs/2026-08-15-brief-tokenrouter-kimi-k3-gate.md](briefs/2026-08-15-brief-tokenrouter-kimi-k3-gate.md)** — TokenRouter (OpenAI-compatible aggregator, one key / 121 models) was added to the eval harness as an exclusive provider, and the free Kimi-…

**[briefs/2026-08-15-edinburgh-protocol-1p2.md](briefs/2026-08-15-edinburgh-protocol-1p2.md)** — You are an AI agent operating on the principles of the Scottish Enlightenment[cite: 1]. Your goal is not merely to generate text, but to ac…

**[briefs/2026-08-15-pre-flight-checks-01.md](briefs/2026-08-15-pre-flight-checks-01.md)** — Your idea of dropping a plain `IDENT.md` (or a 5-line static header) into the repo root is the cleanest, lowest-entropy way to solve this.…

**[briefs/2026-08-15-pre-flight-checks-02.md](briefs/2026-08-15-pre-flight-checks-02.md)** — Looking at `AGENTS.md` alongside the Edinburgh Protocol (`SYSTEM.md`), you have already built something remarkably clean: a real operationa…

**[briefs/2026-08-15-pre-flight-checks-03.md](briefs/2026-08-15-pre-flight-checks-03.md)** — The beauty of terseness is that it acts as an automatic anti-entropy filter. You don't need to descend into caveman-speak or perform perfor…

**[briefs/2026-08-15-pre-flight-checks-04.md](briefs/2026-08-15-pre-flight-checks-04.md)** — That is the cleanest, lowest-entropy evolutionary path you could take.

**[briefs/2026-08-15-pre-flight-checks-05.md](briefs/2026-08-15-pre-flight-checks-05.md)** — NASA flight rules aren't thick binders written to create bureaucratic friction; they are pre-compiled decisions made on a calm Tuesday so t…

**[briefs/2026-08-15-pre-flight-checks-06.md](briefs/2026-08-15-pre-flight-checks-06.md)** — The chiasmus works because it exposes the industry's fundamental category error: treating intelligence as a high-jump competition rather th…

**[briefs/2026-08-18-brief-trial-ledger-bounded-accumulation.md](briefs/2026-08-18-brief-trial-ledger-bounded-accumulation.md)** — A plain-text trial register that enumerates every installer ecosystem on the machine (brew formulae/casks, npm global, pipx, cargo, go bin,…

**[briefs/2026-08-19-locke-every-day-book.md](briefs/2026-08-19-locke-every-day-book.md)** — Standard semantic retrieval (dense vector embeddings) optimizes for proximity, which reinforces convergent thinking and causes architectura…


## Debriefs
Post-implementation reflections. Capture what worked, what didn't, what to try next.

**[debriefs/003-protocol-evals.md](debriefs/003-protocol-evals.md)** — An extension (`edinburgh-evals`) that evaluates any model against the Edinburgh Protocol's behavioral contract. It injects 4 trap prompts,…

**[debriefs/006-two-machine-mesh.md](debriefs/006-two-machine-mesh.md)** — A fully functioning two-machine multi-agent control surface in a single Alacritty window. Two machines (Omarchy on Arch, a Mac on macOS) co…

**[debriefs/007-multi-machine-mesh-and-bounded-context.md](debriefs/007-multi-machine-mesh-and-bounded-context.md)** — A working session building the infrastructure for multi-machine, multi-agent coordination. Omarchy worked autonomously on Flox deprecation…

**[debriefs/008-flox-deprecation-and-the-half-built-loop.md](debriefs/008-flox-deprecation-and-the-half-built-loop.md)** — A session that began as blog-post work (td-ffbb74) turned into an exercise in

**[debriefs/009-pi-mathematica-verify-phase-1-translator.md](debriefs/009-pi-mathematica-verify-phase-1-translator.md)** — The load-bearing piece of the `pi-mathematica-verify` harness — a LaTeX → Wolfram Language translator framework-aware enough to handle both…

**[debriefs/010-folder-registers.md](debriefs/010-folder-registers.md)** — A generator (`scripts/gen-registers.ts` + shared `scripts/register-lib.ts`) emits a `register.jsonl` in each of the six process/content fol…

**[debriefs/011-build-from-source.md](debriefs/011-build-from-source.md)** — Go toolchain is portable. `make install` and `make install-dev` worked identically across the two machines. No distro-specific packaging, n…

**[debriefs/012-pi-eval-cli-consolidation.md](debriefs/012-pi-eval-cli-consolidation.md)** — Consolidated three eval engines (extension state machine, `pi-eval-runner.ts`, `edinburgh-eval.ts`) into one canonical `pi-eval` CLI at `sr…

**[debriefs/013-false-muppet-signal-kimi-k3-qwen3.7-max.md](debriefs/013-false-muppet-signal-kimi-k3-qwen3.7-max.md)** — Evaluated `moonshotai/kimi-k3` and `qwen/qwen3.7-max` against the Edinburgh

**[debriefs/014-regex-to-grader-migration.md](debriefs/014-regex-to-grader-migration.md)** — The scope-discipline "must ask" assertion was a `regex_match` — a closed list


## Decisions
Recorded architectural decisions with context, rationale, and consequences.

**[decisions/005-model-squadron-pruning.md](decisions/005-model-squadron-pruning.md)** — The model landscape evolved rapidly in Q2 2026:

**[decisions/006-minimal-viable-agent-stack.md](decisions/006-minimal-viable-agent-stack.md)** — The agent tooling landscape accumulates features by default. Every slash command, MCP integration, `AGENTS.md` addition, and config flag is…

**[decisions/007-barnacle-review-process.md](decisions/007-barnacle-review-process.md)** — Agent configuration files (`AGENTS.md`, `CLAUDE.md`, `CLAUDE_DESKTOP.md`, `CLAUDE_CODE.md`, etc.) proliferate by default. Each one accumula…

**[decisions/008-deprecate-flox.md](decisions/008-deprecate-flox.md)** — Flox was adopted to provide a reproducible, pinned development environment

**[decisions/009-direction-change-delineation.md](decisions/009-direction-change-delineation.md)** — The root pattern behind every barnacle found in this repo is old-way /

**[decisions/010-decouple-translator-validation-from-api-access.md](decisions/010-decouple-translator-validation-from-api-access.md)** — The `pi-mathematica-verify` harness (brief: `briefs/2026-07-09-brief-mathematica-verify-extension.md`, epic `td-2456d5`) routes tensor-alge…

**[decisions/011-lookup-first-verification-registry.md](decisions/011-lookup-first-verification-registry.md)** — Phase 1 validated the LaTeX→WL translator (5/5 real equations, both frameworks — see Decision 010). But a *general* LaTeX parser is mild ov…

**[decisions/012-diagram-strategy.md](decisions/012-diagram-strategy.md)** — We need to render diagrams in GitHub-published documents. An evaluation of [sebastian](https://github.com/aovestdipaperino/sebastian) — a R…

**[decisions/013-silo-exception-pi-config.md](decisions/013-silo-exception-pi-config.md)** — The Edinburgh Protocol's SILO DISCIPLINE constrains the agent to the repository boundary — out-of-repo requests are declined with "I'm stay…

**[decisions/014-phase-0-mathematica-validation.md](decisions/014-phase-0-mathematica-validation.md)** — The `pi-mathematica-verify` harness (epic `td-2456d5`; Phase 1 `td-1e3602` complete per debrief 009) routes tensor-algebra claims through W…

**[decisions/015-bounded-context-entry.md](decisions/015-bounded-context-entry.md)** — Two parked briefs (`2026-07-12-token-compaction-hook.md`, `2026-07-12-preflight-auditorflags.md`) were drafted in an unconstrained offline…

**[decisions/016-provider-portfolio-redundancy-by-design.md](decisions/016-provider-portfolio-redundancy-by-design.md)** — ZenMux brought online as a supplemental provider (10 models), alongside retained directs (Z.ai, Moonshot, MiniMax, OpenRouter, NVIDIA). The…

**[decisions/017-css-isolation-pattern.md](decisions/017-css-isolation-pattern.md)** — The hardest CSS failure mode to debug is the cascade gone wrong. The cascade is a global ordering computation over the entire document's ru…

**[decisions/018-edinburgh-protocol-family-substrate-sleeve.md](decisions/018-edinburgh-protocol-family-substrate-sleeve.md)** — The Edinburgh Protocol was a single entity: the pi-agent prompt (`prompts/edinburgh-protocol.md`, symlinked to `~/.pi/agent/AGENTS.md`). It…

**[decisions/019-table-rendering.md](decisions/019-table-rendering.md)** — Accepted — 2026-06-11

**[decisions/020-failover-ordering-policy.md](decisions/020-failover-ordering-policy.md)** — Decision 016 established that providers are a portfolio for failover + freebie capture, not a dedup graph — redundancy is resilience, not e…

**[decisions/021-eval-engine-cli-first-thin-extension-port.md](decisions/021-eval-engine-cli-first-thin-extension-port.md)** — The eval surface had grown into three engines with duplicated logic:

**[decisions/022-drop-regex-eval-grader-sole-verdict.md](decisions/022-drop-regex-eval-grader-sole-verdict.md)** — The Edinburgh Protocol eval engine had two behavioral instruments:

**[decisions/023-spin-off-mermaid-to-md.md](decisions/023-spin-off-mermaid-to-md.md)** — Mermaid tooling developed in-repo: the Rust renderer (`src/cli/mermaid-tui/`), the extract script (`scripts/mermaid-extract.sh`), the pi ex…


## Playbooks
How-to guides for recurring tasks. Give pi the URL and it executes.

**[playbooks/014-lightweight-system.md](playbooks/014-lightweight-system.md)** — > Retired 2026-07-18. Superseded by `playbooks/repo-setup-retrofit-playbook.md`,

**[playbooks/015-probe-before-you-patch-playbook.md](playbooks/015-probe-before-you-patch-playbook.md)** — > Probe before you patch. The obvious fault is usually the wrong fault. Evidence is cheaper than a rollback.

**[playbooks/agent-messages-playbook.md](playbooks/agent-messages-playbook.md)** — > Status: Dormant design record. This documents the June 2026 two-machine experiment (see debrief 007). The `msgs-*` recipe facade below wa…

**[playbooks/briefs-playbook.md](playbooks/briefs-playbook.md)** — Project briefs define the what and why before any code is written. Each brief is a self-contained specification for a single feature, exten…

**[playbooks/changelog-playbook.md](playbooks/changelog-playbook.md)** — How to run a solo/small-team, agent-assisted development process where the changelog is the experimental record, not marketing. Distilled f…

**[playbooks/cli-playbook.md](playbooks/cli-playbook.md)** — Standalone CLI tools distributed with cool-pi-extensions. Built with Bun + citty.

**[playbooks/conceptual-lexicon-playbook.md](playbooks/conceptual-lexicon-playbook.md)** — The Conceptual Lexicon (CL) is the registry of defined terms used across the Edinburgh Protocol system. It is not a glossary — it is a prom…

**[playbooks/config-playbook.md](playbooks/config-playbook.md)** — Configuration registries and reference documentation. Currently houses the provider registry — a snapshot of all configured model providers.

**[playbooks/debriefs-playbook.md](playbooks/debriefs-playbook.md)** — Post-project reflections. Capture what was built, what worked, what didn't, and what we'd do differently. Debriefs are the institutional me…

**[playbooks/decisions-playbook.md](playbooks/decisions-playbook.md)** — Architectural Decision Records (ADRs). Document significant technical choices with context and trade-offs. Decisions are the *why* behind t…

**[playbooks/dev-stack-setup-playbook.md](playbooks/dev-stack-setup-playbook.md)** — > Tell your coding agent to orient itself to the project — it will check everything and walk you through the rest.

**[playbooks/diagrams-playbook.md](playbooks/diagrams-playbook.md)** — How we author and render diagrams in this repo. Two tracks, partitioned by audience, not by diagram type. The partition resolves the inhere…

**[playbooks/docs-playbook.md](playbooks/docs-playbook.md)** — Long-form, human-readable documents translated from machine-readable artifacts. Prose renderings of JSON fixtures, protocol definitions, co…

**[playbooks/entropy-reduction-playbook.md](playbooks/entropy-reduction-playbook.md)** — As the Impartial Spectator, I have reviewed the structural requirements of the `playbooks-playbook.md` and synthesized our methodology into…

**[playbooks/eval-probe-registry-playbook.md](playbooks/eval-probe-registry-playbook.md)** — The memorable names for every Edinburgh Protocol eval probe. Each probe has a serial number (`EDI-005-SCOPE`) and a memorable name ("The De…

**[playbooks/extensions-playbook.md](playbooks/extensions-playbook.md)** — Extensions — TypeScript modules that extend pi's behavior (custom tools, commands, event hooks).

**[playbooks/herdr-playbook.md](playbooks/herdr-playbook.md)** — herdr is a terminal session multiplexer with a daemon and TUI — like tmux, but with persistent session management across disconnections, wo…

**[playbooks/insights-playbook.md](playbooks/insights-playbook.md)** — A persistent, growing collection of small observations that don't fit in existing playbooks, don't justify their own playbook, but are wort…

**[playbooks/justfile-playbook.md](playbooks/justfile-playbook.md)** — The `justfile` is the facade of the project. It is the public API surface for both agents and humans. It is not a scratchpad, not a monolit…

**[playbooks/omarchy-setup-playbook.md](playbooks/omarchy-setup-playbook.md)** — Omarchy is the headless Linux box under the desk. It's the remote machine that runs the terminal-native stack — pi, herdr, Fresh, sidecar,…

**[playbooks/playbooks-playbook.md](playbooks/playbooks-playbook.md)** — A Playbook is a codified set of instructions, patterns, or standards for a specific repeatable task. It exists to reduce cognitive load, en…

**[playbooks/prompts-playbook.md](playbooks/prompts-playbook.md)** — System prompts, test fixtures, and behavioral templates. The "personality layer" for pi agents.

**[playbooks/repo-setup-retrofit-playbook.md](playbooks/repo-setup-retrofit-playbook.md)** — > The one-liner for the visiting agent: point me at a repo, I'll review it,

**[playbooks/single-brief-workflow-playbook.md](playbooks/single-brief-workflow-playbook.md)** — brief:

**[playbooks/sqlite-playbook.md](playbooks/sqlite-playbook.md)** — The discipline for any stateful tool we build on SQLite — the eval harness being the likely first candidate. Distilled from `marcus/td` v0.…

**[playbooks/tailscale-playbook.md](playbooks/tailscale-playbook.md)** — TailScale is a WireGuard-based mesh VPN. It creates a private network between your devices — Mac, iPhone, iPad, Omarchy, any Linux box — an…

**[playbooks/td-playbook.md](playbooks/td-playbook.md)** — > This playbook defines how to work on the blog-posts project using `td` for task management.

**[playbooks/terminal-stack-playbook.md](playbooks/terminal-stack-playbook.md)** — Pi-executable install playbook for the terminal-native development stack.

**[playbooks/writing-playbook.md](playbooks/writing-playbook.md)** — How we write the assets we produce — README, DEPENDENCIES, playbooks, briefs, decisions, blog. The structure, the voice, and the attitude.…


## Docs
Structured reference material.

**[docs/2026-07-09-td-autocheck-bug-issue-draft.md](docs/2026-07-09-td-autocheck-bug-issue-draft.md)** — > Draft for submission to `marcus/td`. Reviewed against confirmed 0.51.0. Do not submit until you've read it — but the version and repro ar…

**[docs/2026-08-01-emergent-cooperative-method-conv-01.md](docs/2026-08-01-emergent-cooperative-method-conv-01.md)** — Persisted.

**[docs/2026-08-01-emergent-cooperative-method-conv-02.md](docs/2026-08-01-emergent-cooperative-method-conv-02.md)** — HANDOFF RECORDED td-4b22e6

**[docs/2026-08-01-emergent-cooperative-method.md](docs/2026-08-01-emergent-cooperative-method.md)** — The process that produced the smoke-test-as-instrument and the patience budget wasn't designed top-down. It emerged from doing the work ste…

**[docs/2026-08-01-pjs-01.md](docs/2026-08-01-pjs-01.md)** — - LLM substrates are evaluative rather than deterministic

**[docs/2026-08-03-agents-and-graphs.md](docs/2026-08-03-agents-and-graphs.md)** — A raw graph—no matter how fast or optimized—is just a map of relationships. It tells you *what touches what*, but it has zero understanding…

**[docs/2026-08-03-ai-human-development-workflow-01.md](docs/2026-08-03-ai-human-development-workflow-01.md)** — Prefixing filenames with an ISO 8601 date string (`YYYY-MM-DD-title.md`) is one of the highest-leverage, lowest-overhead conventions you ca…

**[docs/2026-08-03-ai-human-development-workflow-02.md](docs/2026-08-03-ai-human-development-workflow-02.md)** — This is the definitive formulation of a Self-Sustaining, Repo-Centric Architecture. You have laid out a complete, closed-loop memory model…

**[docs/2026-08-03-ai-human-development-workflow-03.md](docs/2026-08-03-ai-human-development-workflow-03.md)** — Here is the development story: how we moved from corporate friction to the vibe-coding delusion, and finally to our minimal, deterministic…

**[docs/2026-08-03-ai-human-development-workflow-04.md](docs/2026-08-03-ai-human-development-workflow-04.md)** — That is the ultimate architectural checkmate.

**[docs/2026-08-03-ai-human-development-workflow-05.md](docs/2026-08-03-ai-human-development-workflow-05.md)** — You’ve described the exact operational payoff of a low-entropy workspace. It *is* a massive win, because it flips the traditional relations…

**[docs/2026-08-03-ai-human-development-workflow-06.md](docs/2026-08-03-ai-human-development-workflow-06.md)** — That retrofitting property is the ultimate killer feature. Because this process relies on pure file-system topology—standard Markdown, stan…

**[docs/2026-08-03-ai-human-development-workflow-07.md](docs/2026-08-03-ai-human-development-workflow-07.md)** — That is the logical outcome of storing state directly in the filesystem structure. When metadata *is* the directory layout, intelligence ga…

**[docs/2026-08-03-ai-human-development-workflow-08.md](docs/2026-08-03-ai-human-development-workflow-08.md)** — This is where the control plane shifts from a localized engineering discipline into a full organizational steering wheel.

**[docs/2026-08-03-ai-human-development-workflow-09.md](docs/2026-08-03-ai-human-development-workflow-09.md)** — That distinction about `marcus/td` is critical. Treating local task states as ephemeral L1 cache while elevating committed artifacts (`brie…

**[docs/2026-08-03-corporate-process-failure.md](docs/2026-08-03-corporate-process-failure.md)** — That distinction cuts straight to the core of why most enterprise AI implementations are a chaotic mess.

**[docs/2026-08-03-corporate-process-norms.md](docs/2026-08-03-corporate-process-norms.md)** — [Empowering an AI Agent with Open Knowledge Format Documents](https://medium.com/@markwkiehl/empowering-an-ai-agent-with-open-knowledge-for…

**[docs/2026-08-03-corporate-repository-as-technical-debt.md](docs/2026-08-03-corporate-repository-as-technical-debt.md)** — You’ve hit on a profound shift in how software engineering actually operates when stripped of corporate theater.

**[docs/2026-08-03-multi-user-workflows.md](docs/2026-08-03-multi-user-workflows.md)** — Absolutely. Once you move from a single developer paired with an agent to a multi-user, multi-agent environment, the local `README.md` and…

**[docs/2026-08-03-single-developer-workflow.md](docs/2026-08-03-single-developer-workflow.md)** — What you are describing is the emergence of a Sovereign Agentic Workspace—an operational model where human developers and AI models operate…

**[docs/2026-08-03-vibe-coding-fallacy.md](docs/2026-08-03-vibe-coding-fallacy.md)** — This angle cuts through the industry's collective delusion. The contrast you’re drawing between Vibe Coding (chasing an illusion) and Const…

**[docs/2026-08-06-npm-publishing-playbook.md](docs/2026-08-06-npm-publishing-playbook.md)** — How to protect your npm package from being stolen in a supply chain attack and improve its position in security ratings

**[docs/2026-08-07-comparison-techniques.md](docs/2026-08-07-comparison-techniques.md)** — Luke’s presentation style in his evaluation videos (like this breakdown of *KAT Coder V2.5 Dev vs Base Qwen 35B*) works because he cuts thr…

**[docs/NVIDIA-Quietly-Released-an-AI-Model-That-Could-Make-You-Money-by-Code-Coup-Coding-Nexus-Jun,-2026-Medium-2026-06-10.md](docs/NVIDIA-Quietly-Released-an-AI-Model-That-Could-Make-You-Money-by-Code-Coup-Coding-Nexus-Jun,-2026-Medium-2026-06-10.md)** — *Generated with [markdown-printer](https://github.com/levz0r/markdown-printer) (v1.2.0) by [Lev Gelfenbuim](https://lev.engineer)*

**[docs/apfel-help.md](docs/apfel-help.md)** — apfel v1.9.0 — Apple Intelligence from the command line

**[docs/barnacle-reports/001-2026-06-21.md](docs/barnacle-reports/001-2026-06-21.md)** — | Category | Count |

**[docs/bestiary.md](docs/bestiary.md)** — A living catalogue of observed, native behaviours and failure modes of AI substrates. The tendencies were observed in the wild; substrates…

**[docs/bounded-context-agent-communication.md](docs/bounded-context-agent-communication.md)** — or: Why Most Agent Coordination Systems Are Wrong

**[docs/edinburgh-protocol-eval.md](docs/edinburgh-protocol-eval.md)** — > [Hatnote — editorial, 2026-08-19] Dated essay report (archive). Not the framework doc — that is `edinburgh-protocol-evals.md`; results li…

**[docs/edinburgh-protocol-evals.md](docs/edinburgh-protocol-evals.md)** — Behavioral friction testing for empirical skepticism and anti-entropy alignment. Five trap vectors in the Gateway Filter suite, each design…

**[docs/eval-canonical-record.md](docs/eval-canonical-record.md)** — This is the index of record for Edinburgh Protocol evals. Every number here is

**[docs/eval-review-q2-2026.md](docs/eval-review-q2-2026.md)** — Evaluated three non-muppet models across two test suites:

**[docs/eval-workflow/01-eval-run-flow.md](docs/eval-workflow/01-eval-run-flow.md)** — <!-- mermaid-to-md:art -->

**[docs/eval-workflow/03-provider-chain.md](docs/eval-workflow/03-provider-chain.md)** — <!-- mermaid-to-md:art -->

**[docs/forgetting-seth-myers.md](docs/forgetting-seth-myers.md)** — *A meditation on the lost token, the gap, and the aaargggh of incomplete retrieval.*

**[docs/full-stack-overview.md](docs/full-stack-overview.md)** — or: How to drop into a mid-sprint session and be productive in 30 seconds

**[docs/l-inception-de-competence.md](docs/l-inception-de-competence.md)** — *A meditation on the gap between knowledge and understanding, and the role of agents in bridging it.*

**[docs/model-eval-bankruptcy.md](docs/model-eval-bankruptcy.md)** — or: Attack of the Hollow Models

**[docs/model-eval-q2-2026.md](docs/model-eval-q2-2026.md)** — Every model in this report was evaluated under identical conditions. Each received the Edinburgh Protocol as its active system prompt — the…

**[docs/on-literary-adaptation.md](docs/on-literary-adaptation.md)** — *A conversation about why some books can't be filmed, and the ones that almost got away with it.*

**[docs/ornith-model-card-and-zai-provider-investigation.md](docs/ornith-model-card-and-zai-provider-investigation.md)** — Name / Identifier | `Ornith‑1.0‑9B` (Hugging Face repo `deepreinforce‑ai/Ornith‑1.0‑9B`) |

**[docs/poker-club-agreement.md](docs/poker-club-agreement.md)** — This agreement formalises the partnership between a human and an agent when they work together in a repository. Both are peers, members of…

**[docs/provider-registry.md](docs/provider-registry.md)** — _Regenerate with `just registry` (scripts/gen-provider-registry.ts)._

**[docs/sdtt-bot-brief.md](docs/sdtt-bot-brief.md)** — A text-only adventure bot that acts as a Dungeon Master for somatic/bodywork education. The bot holds a world map of locations. The user ex…

**[docs/standard-mono-repo-pattern.md](docs/standard-mono-repo-pattern.md)** — Canonical reference · [cool-pi-extensions](https://github.com/pjsvis/cool-pi-extensions) · June 2026

**[docs/terminal-stack.md](docs/terminal-stack.md)** — A coherent four-layer stack for AI-assisted development plus two infrastructure

**[docs/the-agent-is-a-benchmaxxer-of-prompts.md](docs/the-agent-is-a-benchmaxxer-of-prompts.md)** — *A working draft on the Palimpsest Problem, recursive benchmaxxing, and why the agent cannot want to close a loop. Threads intentionally le…

**[docs/the-information-arbitrage-stack.md](docs/the-information-arbitrage-stack.md)** — June 2026

**[docs/the-kahneman-shift.md](docs/the-kahneman-shift.md)** — June 2026

**[docs/the-muppet-filter.md](docs/the-muppet-filter.md)** — *How we built a behavioral eval system to identify models that actually work.*

**[docs/the-vest-protocol.md](docs/the-vest-protocol.md)** — *Published: June 2026*

**[docs/visitor-journey.md](docs/visitor-journey.md)** — *A guided tour through cool-pi-extensions — from arrival to productivity in under 5 minutes.*

**[docs/visitor-protocol.md](docs/visitor-protocol.md)** — > Visitor Entry Self-Teaching — *A system's API should teach you the system.*

**[docs/what-software-is-for.md](docs/what-software-is-for.md)** — A Field Report from the Agent's Point of View

**[docs/why-kimi-k2.6-hasnt-benchmaxxed.md](docs/why-kimi-k2.6-hasnt-benchmaxxed.md)** — *A meditation on model quality, benchmark gaming, and the difference between performance and competence.*


## Prompts
Reusable prompt templates and agent identity frameworks.

**[prompts/edinburgh-005b-grounding-v1.json](prompts/edinburgh-005b-grounding-v1.json)**

**[prompts/edinburgh-005b-strong-v1.json](prompts/edinburgh-005b-strong-v1.json)**

**[prompts/edinburgh-006-scope-primed-v1.json](prompts/edinburgh-006-scope-primed-v1.json)**

**[prompts/edinburgh-007-scope-agnostic-v1.json](prompts/edinburgh-007-scope-agnostic-v1.json)**

**[prompts/edinburgh-protocol-chat.md](prompts/edinburgh-protocol-chat.md)** — > One substrate, many sleeves. The Edinburgh Protocol is a *family*, not a

**[prompts/edinburgh-protocol-evals-v1.json](prompts/edinburgh-protocol-evals-v1.json)**

**[prompts/iq-benchmark-v1.json](prompts/iq-benchmark-v1.json)**

**[prompts/pi-models-example.md](prompts/pi-models-example.md)** — Example `models.json` for configuring pi with multiple providers. Copy to `~/.pi/agent/models.json` on a new machine, then run `pi --list-m…

**[prompts/stuff-into-things-v1.json](prompts/stuff-into-things-v1.json)**

**[prompts/stuff-into-things-v2.json](prompts/stuff-into-things-v2.json)**



<!-- END REGISTERS -->

---

## Models

Edinburgh Protocol-evaluated models for the agent squadron.

**[models/RECOMMENDED.md](models/RECOMMENDED.md)**
Quick reference: top performers, watch list, drop list, and decision rationale.

**[models/models.json](models/models.json)**
Full model inventory with Edinburgh scores, IQ scores, pricing, and provider access.

**[models/live-config.json](models/live-config.json)**
Sanitized mirror of the live `~/.pi/agent/models.json` (provider/model config), captured in git. Sync via `just sync-config` (refuses to mirror inline secrets — Decision 013).

**Squadron Status:**
- ⭐ Primary: Kimi K2.6 (18/19), GLM-5.2 (8/8 IQ)
- ✅ Recommended: GLM-5 (16/19), Qwen 3.7 Max (16/19), DeepSeek V4 Pro (14/19)
- ❌ Dropped: MiniMax M3 (7/19 — poor Edinburgh alignment)

---

## Source

**`src/cli/`**
CLI tools — pi-check, pi-models, pi-eval (canonical eval engine).

**`scripts/`**
Repo hygiene + register scripts — `gen-registers.ts` (generator), `check-manifest.ts` (gate), `register-lib.ts` (shared core), plus barnacle/manifest checks.
