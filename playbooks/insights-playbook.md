# Playbook: Project Insights

## Purpose

A persistent, growing collection of small observations that don't fit in existing playbooks, don't justify their own playbook, but are worth capturing because:

- They represent lessons learned that could easily be forgotten
- They capture patterns too small to document formally but too useful to lose
- They serve as tribal knowledge for agents and humans who weren't there when the lesson was learned

This is the **scraps pile**. If it doesn't fit, it goes here until there's enough of it to deserve its own playbook.

## Format

Each insight is a short entry:
- **What happened** — the observation or lesson
- **Why it matters** — the principle or pattern
- **What to do** — actionable guidance

No enforced structure. Length varies. Add as you go.

---

## Insights

### Discoverable affordances — found when needed, not pushed in the face

**What happened:** glow-preview auto-refreshes on save. The `r` to force a refresh is discoverable exactly when needed — when auto-refresh doesn't fire, or when you're in a non-auto-refreshing buffer. The user learns it at the moment of need.

**Why it matters:** The VEST Protocol's "Teach" principle means zero-friction discovery. An affordance should be found by exploring the interface, not by reading onboarding docs. The discovery moment is proportional to the need.

**What to do:** Don't surface affordances that are covered by automation. Design the failure mode to teach the override. A new user should be able to use the basic features without reading anything.

---

### Infrastructure is invisible when it's working

**What happened:** td and sidecar are used 90% by agents. The human doesn't notice them until they fail. This is the signal — good infrastructure is used by machines, not pushed at humans.

**Why it matters:** If the human has to think about the infrastructure, it's not working well enough. td handles session continuity. sidecar handles oversight. The human supervises; the agents maintain the cables.

**What to do:** Design infrastructure for agents, not humans. Humans benefit from the results. The 90% agent-usage ratio is the metric.

---

### The fractal pattern — recursive structure, bounded contexts

**What happened:** The stack (terminal → session → worktree → agent → tools) is the same pattern at different scales. Each layer is a bounded context with a small surface area and observable state.

**Why it matters:** The system stays coherent because every layer respects the same boundaries. The human occupies the meta-layer (oversight without intrusion). The agent works in its slice (focus without needing to know the whole). Adding a new agent or worktree doesn't break anything because each context is isolated.

**What to do:** When adding a new component to the stack, ask: what layer does it live in? What are its boundaries? Does it need to know about other layers, or can it work in isolation?

---

### The window problem is a fake problem

**What happened:** Desktop window managers (macOS, Linux, Windows) differ wildly. The fix is not to pick the best one — it's to leave the OS window manager out of it entirely.

**Why it matters:** herdr + Alacritty give you platform-agnostic sessions. Everything works identically over SSH. The OS manages pixels; herdr manages context. This is the architectural insight that makes the stack SSH-native.

**What to do:** When evaluating a new tool for the stack, ask: does this require the OS window manager? If yes, it doesn't belong. Terminal-native only.

---

### ADR-first, implementation-second

**What happened:** ADR-001 (table rendering decision) was documented after the first table was converted, not before. Should have been the other way around.

**Why it matters:** Decisions documented before implementation set the standard. Decisions documented after are post-hoc rationalization. The ADR exists to force the decision before the work, not to record what was already done.

**What to do:** When you encounter a non-obvious decision, write the ADR first. `docs/decisions/ADR-NNN-name.md`. Then implement. If the decision changes mid-implementation, update the ADR.

---

### The code block test — shell commands in prose

**What happened:** Shell commands in documentation are easier to read as code blocks than as inline text with pipe characters. `curl -fsSL https://... | sh` is clearer as a code block than as `curl -fsSL https://... | sh` in inline prose.

**Why it matters:** Inline pipes in prose get confused with table separators. Code blocks are unambiguous. When documenting shell pipelines, use triple backticks.

**What to do:** In prose, use code blocks for any command that has pipes, redirects, or complex flags. Reserve inline code for short, single commands with no special characters.

---

### Just-enough documentation — the VEST test

**What happened:** When writing documentation for a new feature or pattern, apply the VEST test: does this entry point teach the next step? If `just orient` for this feature doesn't tell you what you need to start, the docs are incomplete.

**Why it matters:** The goal is zero-friction discovery. Not comprehensive documentation — just enough to get started. The rest follows from use.

**What to do:** After writing a doc, ask: if a new agent read only this, could they start work? If not, what's missing? The missing piece is usually "how do I start" rather than "what does it do."

---

### The Palimpsest Problem — old/new coexistence

**What happened:** Every barnacle found in the td-96f35f session was a new
direction that landed next to the old one with no delineation — a deprecated
tool whose replacement was a phantom command, a renamed file whose old name
the index still linked, a `just` recipe documented across six files but never
defined. The docs merged old and new into a single incoherent asset, and work
proceeded on a conflated thing. A *palimpsest* is a manuscript where the old
writing was scraped off to make room for new writing but bleeds through,
corrupting the reading. That is the mechanism.

**Why it matters:** This is the mechanism behind "context rot," not the
symptom. Redundant documentation exposes *some* of these inconsistencies, and
investigating those *sometimes* reveals deeper deviations — running a
Popper-Party on that very assertion exposed a phantom enforcement script
referenced in a playbook but never built. "Sufficiently" is the wrong word:
redundancy catches the surface, not the depth. The avoidance is structural —
record direction changes in `decisions/` before landing them, and remove the
old canonical references in the same atomic commit that establishes the new
(decision 009).

**What to do:** When a doc references something that doesn't exist,
investigate but don't obsess — most hits are surface, a few are the tip of a
palimpsest. Run `just popper` (`scripts/semantic-integrity.ts`) as the
detector: it surfaces candidate phantom `just` recipes (warnings) and broken
script references (failures). Hold a Popper-Party — a deliberate refutation
session against the repo's own meta-assertions — when a claim collides with
the records, not on a fixed schedule. Triggered parties beat scheduled ones;
scheduled parties risk becoming the ceremony they were meant to prevent.

---

### Flue — watching brief (a deployed/sandboxed-agent framework)

**What happened:** Reviewed [withastro/flue](https://github.com/withastro/flue) — "the sandbox agent framework," a TypeScript agent *harness* (explicitly "not another SDK"). Distinct niche: deployed, event-driven, sandboxed autonomous agents — the Claude Code/Codex model made deployable. Features: sandbox (secure fs/container for real work), durable execution (survive restarts), channels (Slack/Teams/Discord/GitHub events), subagents, skills (`SKILL.md`), MCP, observability (OTel/Braintrust/Sentry), deploy to Workers/CI/Daytona/Render.

**Why it matters:** It overlaps our primary harness, pi (skills, sessions, tools, silo are the same concepts), and does *not* cover Mastra's role (RAG, evals, app/UI integration, model-routing breadth) — so it neither replaces pi nor substitutes for Mastra. Its genuine value is on an axis we don't currently operate: **deployed, event-driven, sandboxed agents.** Notably, Flue's sandbox *is* a structured bounded context — the territory of Decision 015 — so it aligns philosophically (real tools ground the agent; the strong EDI-005b result argues *for* the sandbox model), but only on the deployed axis. The sharpest reframe: Flue's feature list is *verbatim* an enterprise/corporate deployed-agent checklist (sandbox for safety, durable for restarts, channels for ticketing/chat, observability for audit, deploy to controlled compute). In a personal/terminal-native stack (`alacritty→herdr→pi`) none of that is needed; in a corporate setting all of it is. No immediate application presents itself; adopting speculatively is entropy (Decision 006).

**What to do:** Watching brief — track, don't adopt. The revisit trigger is a concrete corporate/deployed-agent need: a silo-style agent that must be *deployed and event-driven* (e.g., GitHub/Slack-triggered, working in a bounded sandbox, surviving restarts). Locally, pi+silo already does bounded-context agents; Flue is the deployed version of that pattern. Revisit at barnacle reviews (next: Q3 2026). Maturity caveat: brand-new (withastro), expect churn; README is marketing-grade — verify sandbox/durable mechanics before betting. If ever evaluated seriously, run a Flue-harness agent through the Edinburgh trap suite (EDI-005/005b) — the eval can grade the framework's own agent behavior.

Add an insight when:
- It's a lesson learned that could easily be forgotten
- It doesn't fit any existing playbook
- It doesn't justify its own playbook (too small, too specific)
- It's worth persisting for future agents and humans

Don't add:
- Decision records (those go in `decisions/`)
- Project briefs or debriefs (those go in `briefs/` or `debriefs/`)
- Tutorial content (that goes in the relevant playbook or doc)
- Things that are already documented elsewhere

If in doubt: add it. We can sort it later.

---

## Related

- `briefs/008-the-invisible-cables.md` — td, sidecar, fractal stack
- `debriefs/005-visibility-patterns.md` — discoverable affordances lesson
- `docs/decisions/table-rendering.md` — ADR-001
- `docs/the-vest-protocol.md` — VEST Protocol philosophy
- `docs/full-stack-overview.md` — field report from the agent's perspective