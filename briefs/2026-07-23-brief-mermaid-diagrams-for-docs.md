# brief: Add Mermaid diagrams to documentation — prose-to-diagram conversion

**Created:** 2026-07-23
**Status:** complete
**Depends on:** `mermaid-tui` binary (epic td-076e0a), `mermaid-extract.sh`
**Playbook:** `playbooks/diagrams-playbook.md`

## What

Convert prose descriptions of architectures, pipelines, and state machines into Mermaid diagrams in four documentation files. Each diagram is authored inline in the `.md` file — GitHub renders it for web readers, `mermaid-tui` renders it for terminal readers. Same source, two renderers.

## Why

These docs currently describe graph-shaped relationships in prose: "A feeds B feeds C feeds D" or "draft → pending → in-progress → complete." The prose is *trying* to describe a graph. Let it be a graph. A diagram gives the shape in one glance; the prose carries the *why* and the detail. This is the Stuff-into-Things move: unstructured narrative → structured visual + prose for what the visual can't carry.

The diagrams-playbook already documents the conventions: descriptive labels for ≤4 nodes, numbered-box convention for >4 nodes. This brief applies those conventions to real docs.

## Target files

### 1. `docs/terminal-stack.md` — layered architecture (flowchart)

The canonical reference for the terminal-native stack. Currently a table + prose describing four layers (Alacritty, herdr, pi/Fresh/sidecar, td) plus two infrastructure layers (Tailscale, SSH). Already has a sibling diagram in `docs/full-stack-overview.md`.

**Diagram:** flowchart TD, ~6 nodes. Numbered-box convention (6 components exceeds the descriptive-label threshold). Key list below the diagram identifies each component.

**Insert at:** after the intro paragraph, before the layer-by-layer prose. The diagram gives the overview; the prose gives the detail per layer.

### 2. `docs/standard-mono-repo-pattern.md` — silo lifecycle (state diagram or circular flowchart)

The doc explicitly says: "Silos form a graph. briefs/ feeds decisions/ feeds debriefs/" and "Each feeds the next. A brief triggers decisions. Decisions produce outcomes. Outcomes produce debriefs. Debriefs inform future briefs. The loop is the repository's institutional memory."

**Diagram:** circular flowchart showing the feedback loop: Briefs → Decisions → Debriefs → (informs future) → Briefs. 4 nodes — descriptive labels, no numbered-box convention.

**Insert at:** the "process loop" section (around line 25 and line 96). The diagram replaces the arrow prose; the surrounding prose keeps the *why*.

### 3. `playbooks/briefs-playbook.md` — brief lifecycle (state diagram)

The playbook already writes the lifecycle as an arrow sequence: `draft → pending → in-progress → complete`. That's a mermaid state diagram waiting to happen.

**Diagram:** `stateDiagram-v2` with 4 states + transitions. The playbook's "Lifecycle" section (line 45) is the natural insertion point.

**Note:** this is the exact diagram type the diagrams-playbook uses as its Track 1 example. Dogfooding the example.

### 4. `docs/visitor-protocol.md` — VEST protocol (flowchart)

The VEST protocol (Visitor, Entry, Self, Teach) — four concepts with relationships. Currently a table. A small flowchart would make the protocol scannable.

**Diagram:** flowchart TD, 4 nodes — descriptive labels. The table stays (it carries the detail per verb); the diagram gives the shape.

**Insert at:** after the VEST acronym expansion, before the table.

## Optional (Category 2 — prose is doing fine, but could benefit)

- `docs/edinburgh-protocol-evals.md` — the eval pipeline (fixture → inject → capture → assert → grade → log). A flowchart would summarise the pipeline. Only if the Category 1 files go smoothly.
- `blog/2026-07-22-four-sessions-four-commits.md` — the task DAG is already ASCII art. Converting to mermaid would render on GitHub but lose the terminal-native aesthetic. **Leave as-is** unless there's a specific reason.

## Out of scope (Category 3 — prose is the right medium)

- Blog posts about theory (Shannon, $46, normalisation stack) — these are *arguments*, not architectures. The normalisation stack already has a diagram.
- The muppet-filter, audit trail, scoreboard posts — narratives, not systems.
- Any file where the prose describes *why* without describing *what connects to what*.

## Acceptance criteria

- [x] `docs/terminal-stack.md` has a mermaid flowchart (numbered-box+token, 6 nodes + key list)
- [x] `docs/standard-mono-repo-pattern.md` has a mermaid flowchart (circular, 4 nodes, descriptive labels) — two instances
- [x] `playbooks/briefs-playbook.md` has a mermaid state diagram (4 states + back-edge)
- [x] `docs/visitor-protocol.md` has a mermaid flowchart (4 nodes, descriptive labels)
- [x] Each diagram renders cleanly with `just mermaid <file>` (all exit 0)
- [x] Each diagram renders on GitHub (mermaid block is valid syntax)
- [x] No prose is deleted — the diagram is additive, the prose carries the *why*
- [x] Diagrams follow the conventions in `playbooks/diagrams-playbook.md` (numbered+token vs descriptive, monochrome)
- [x] Extractor emits the numbered-box key list after the diagram (coupled pair)
- [x] README updated with mermaid-tui extension + CLI entries

## Out of scope

- Adding diagrams to every doc in the repo (only the 4 Category 1 targets)
- Editing the prose around the diagrams (the diagram is additive)
- Colour (the playbook says monochrome is the default)
- Interactive diagrams (TUI loop, pan/zoom)
