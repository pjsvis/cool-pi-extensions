# Decision 012: Diagram strategy — mermaid-native for publication, DOT for inspection

**Date:** 2026-07-10  
**Status:** Accepted  
**Review:** 2026-09-21 (quarterly barnacle review)

---

## Context

We need to render diagrams in GitHub-published documents. An evaluation of [sebastian](https://github.com/aovestdipaperino/sebastian) — a Rust port of mermaid.js, byte-for-byte identical to `mmdc` 11.15.0 — prompted a requirements pass that produced four baselines:

1. We do **not** need any mermaid-only diagram types (sequence, gantt, gitGraph, pie, sankey, treemap, kanban, …).
2. We **do** need Graphviz-grade layout for large/dense graphs.
3. We **must** include diagrams in GitHub documents (GitHub renders ```mermaid blocks natively).
4. **Alternative:** a graphviz→SVG pipeline for publishing to GitHub.

Two findings shaped the decision:

- **sebastian's unique value doesn't map to our needs.** Its differentiators are the mermaid-only types (req 1 says we don't need them) and browser-free mermaid rendering (which produces the *same dagre layout* GitHub already uses, just offline — it does not upgrade layout quality, so it cannot satisfy req 2). Under these requirements sebastian is cleanly out.
- **Reqs 2 and 3 conflict on the overlap.** GitHub renders mermaid via mermaid.js, which lays out graph-shaped diagrams (flowchart, state, class, ER) with **dagre** — a JS reimplementation of a *subset* of `dot`'s algorithms. So authoring a graph as a GitHub-native mermaid block means accepting dagre layout, *not* Graphviz layout. The two requirements cannot both hold for the same diagram.

Actual usage settled the conflict: the main cases are **simple box drawings and simple state machines** (small graphs, where dagre is perfectly adequate), while **large/dense graphs are the exception, used for analysis rather than publication.** That split — by *audience*, not by type — dissolves the contradiction: publication diagrams accept dagre's adequacy; analysis diagrams earn Graphviz's quality.

## Decision

**A two-track diagram strategy, partitioned by audience.**

### Track 1 — Publication (mermaid-native)
Simple box drawings and state machines, authored in the mermaid DSL inside `.md` files, rendered natively by GitHub. Layout = dagre (acceptable for small graphs). No local pipeline, no committed SVG. The `.md` source is the artifact.

### Track 2 — Analysis (DOT, ephemeral SVG)
Large/dense graphs (e.g. understand-* knowledge-graph output), authored in DOT, rendered to SVG locally with `dot -Tsvg` for inspection. **DOT source is committed; the SVG is ephemeral — gitignored, never checked in.** The audience is the author/agent, transiently; GitHub readers see the DOT source as text, which is acceptable because these are analysis artifacts, not publication.

**sebastian is not adopted.** Publication uses GitHub's renderer (not a local one); analysis uses Graphviz (not mermaid). sebastian serves neither track.

## Alternatives Considered

### Alternative A: sebastian as the renderer
- **Pros:** Pure-Rust, wasm-able, no browser; byte-exact to `mmdc`.
- **Cons:** Byte-exactness is environment-conditional (Trebuchet MS + a specific Chrome `getBBox` regime) and solves a problem we don't have — we don't need to *match* `mmdc`, we need to *publish* and to *inspect*. Its layout is dagre, not Graphviz, so it fails req 2. Its mermaid-only types are unneeded (req 1). **Reject.**

### Alternative B: graphviz→SVG committed for *all* diagrams
- **Pros:** Graphviz layout everywhere; deterministic.
- **Cons:** Pipeline maintenance, SVG diff noise in review, source no longer readable as a diagram in rendered Markdown, regen-on-edit discipline — all for small graphs where dagre is already fine. Overkill. **Reject** for the common case; reserve for Track 2.

### Alternative C: mermaid-only for everything
- **Pros:** Zero pipeline; readable source; GitHub-native.
- **Cons:** dagre layout visibly fails on large/dense graphs. The analysis track genuinely needs `dot`. **Reject** for Track 2.

### Alternative D: sebastian for byte-exact offline mermaid
- **Pros:** Deterministic offline mermaid rendering.
- **Cons:** Determinism is conditional (see A); and we have no requirement to reproduce `mmdc` bytes — GitHub's renderer is our publication target, `dot` is our inspection target. **Reject.**

**Chosen:** Two tracks — mermaid-native (publication) + DOT-with-ephemeral-SVG (analysis). sebastian not adopted.

## Consequences

### Positive
- **Minimal dependency surface:** `dot` (local, inspection only) + GitHub's built-in mermaid renderer (publication). No sebastian, no `mmdc`, no Chromium, no wasm, no font-coupling regime to maintain.
- **Ephemeral SVG sidesteps the entire determinism/font-fidelity problem.** Because Track-2 SVGs are never committed, never diffed, never reproduced across machines, it doesn't matter that `dot`'s output varies with installed fonts. Render, look, discard.
- **Each track uses the right tool for its audience:** readability and zero-pipeline for publication; layout quality for analysis.
- **Committed Track-2 artifact is text** (DOT source) — stable, reviewable, diffable.

### Negative
- **Large/dense diagrams appear as raw DOT text to GitHub readers** (not rendered). Acceptable because they are analysis artifacts, not publication — but the boundary must stay conscious (see exception rule in the playbook).
- **Two authoring formats** (mermaid DSL + DOT) — mild cognitive overhead. Mitigated: clear partition by purpose, not by whim.
- **Committed DOT has no renderer validating it** (unlike mermaid blocks, which GitHub checks). Mitigation: a `check-dot` syntax-validation step, documented in the playbook, to be wired when the first DOT file lands.

## Implementation

- **Operational procedure:** `playbooks/diagrams-playbook.md` — authoring how-to per track, escalation rule, the exception boundary, and the justfile/gitignore scaffolding.
- **No tooling wired yet.** Track 2 currently has no inputs (no `.dot` files in the repo). Wiring justfile targets (`inspect-dot`, `check-dot`) and the `.gitignore` entry is **deferred until the first DOT diagram lands** — building scaffolding before any input exists would violate MVAS (Decision 006) and the "don't build the pipeline speculatively" principle this decision relies on. The playbook documents the procedure so it is ready when needed.
- **Exception boundary (stated now, enforced always):** DOT SVGs are never committed by default. A publication-worthy DOT diagram is either re-authored small in mermaid, or receives a deliberate one-off committed-SVG override (`git add -f`) with a comment naming the exception. Fuzzy "sometimes we commit SVGs" is the entropy this rule exists to prevent.

## References

- sebastian (evaluated, not adopted): https://github.com/aovestdipaperino/sebastian
- Playbook: `playbooks/diagrams-playbook.md`
- Decision 006 (MVAS — empirical value before addition; don't build speculatively)
- Decision 007 (barnacle review — quarterly)
