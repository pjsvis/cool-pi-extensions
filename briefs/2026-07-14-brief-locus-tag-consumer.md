# brief: Locus-tag consumer — per-section compaction at handoff

**Created:** 2026-07-14
**Status:** pending
**Protocol:** Edinburgh Protocol v1.1.0 (locus-tag directive)

## What

A compaction script that reads a session transcript sectioned by `[LOC:]` / `[WAYPOINT:]` tags (per the Protocol v1.1.0 directive), runs each section through a cheap commodity model, and emits a per-section **rejected-hypotheses + execution-state** block for the `td handoff` / review. This is the consumer that makes locus_tags earn their tokens — the missing half of the loop.

## Why

The Protocol v1.1.0 directive emits locus_tags for human navigation *now* and compaction-*readiness* later. The compaction value is unrealized without a consumer — this brief specifies it. It salvages the real kernel of the parked brief `2026-07-12-token-compaction-hook.md` (its §4.1 rejected-hypotheses feed) **without** its fabricated substrate (the `.td-memory/` branch-isolated multi-agent-memory edifice — parked as fantasy). Closes the half-built loop (Debrief 008's lesson). Per Decision 015, the compaction runs against the real transcript (the territory), not a fabricated memory store.

## How

`scripts/compact-handoff.ts` — invoked at `td handoff`:
1. Read the session transcript.
2. Split on `[LOC:]` / `[WAYPOINT:]` markers; if none, fall back to freeform (no ceremony forced).
3. Pass each section (+ raw transcript for context) to a cheap model (NVIDIA free tier, or the configured grader).
4. Emit the §4.41 schema per section: ground-truth objective · tested-and-rejected hypotheses (with `[LOC:]`/`[WAYPOINT:]` anchors) · discovered material constraints · execution state (status, verified artifacts, remaining debt).
5. Feed the structured summary to `td handoff` as the handoff payload (alongside the diff).

No `.td-memory/` directory, no branch isolation, no multi-agent memory — the transcript IS the territory. Anchors cite the tag that delimits the section.

## Acceptance criteria

- `td handoff` produces a **per-section** compaction (not freeform) when locus_tags are present in the transcript; falls back to freeform when absent.
- A reviewer / handoff-agent receives the rejected-hypotheses map alongside the diff — so it sees what was tried and discarded, not just the final change.
- Rejected approaches are located by their `[LOC:]` / `[WAYPOINT:]` anchor (the "location anchor" the parked brief's prompt template required).
- The compaction model is configurable (default: a free/cheap tier; overridable).

## Out of scope

- The `.td-memory/` branch-isolated substrate (parked — fabricated upstream; do not revive).
- The multi-agent-memory architecture (parked).
- A separate review-agent protocol — the compaction feeds the *existing* `td` review flow, it doesn't define a new one.
- General tool-calling support in `td` (not needed for compaction).
