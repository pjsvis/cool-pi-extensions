# Decision 009: Direction-Change Delineation — No Old/New Coexistence

**Date:** 2026-06-26
**Status:** Accepted
**Review:** 2026-09-21 (quarterly barnacle review)

---

## Context

The root pattern behind every barnacle found in this repo is **old-way /
new-way coexistence**. A new direction lands alongside the old one; the docs
merge them into a single incoherent asset; the result is hidden context rot —
work proceeds on a conflated old-and-new thing whose contradictions are
invisible until probed.

The barnacles found in the td-96f35f / debrief-008 session were *all* instances
of this pattern, not independent failures:

| Barnacle | Old way | New way |
|----------|---------|---------|
| Flox | `.flox/` + `provision.sh` + README line | `DEPENDENCIES.md` + `install-deps` |
| Playbooks | `X.md` (MANIFEST links these) | `X-playbook.md` (on disk) |
| `just dev` / `just msgs-*` | absent justfile recipes | documented across 6 files |
| `models.json` | Nemotron entries | GLM-5.2 entries |

Not "things that stopped being useful" — "new directions that landed next to
old ones with no delineation."

A second finding compounds this: `decisions/` is **load-bearing** — debrief
007's alpha-loop names decisions as a first-class alpha-loop output — yet
decision 006's MVAS table omits it, treating decisions as documentation. The
delineation mechanism is itself a victim of the pattern it should prevent.

The Edinburgh Protocol's map-vs-territory discipline says docs (map) drift
from reality (territory) by default. Old/new coexistence is the mechanism of
that drift. Barnacle review (007) mitigates it after the fact; this decision
prevents it at the source.

## Decision

### 1. `decisions/` is one of the canonical four process folders

The repo's organisational vocabulary is four folders — `briefs/`,
`decisions/`, `debriefs/`, `playbooks/` — stated as canonical in
`docs/standard-mono-repo-pattern.md`. They are the process machinery that
makes the loops and barnacle protocol operate; every other top-level
folder is a content silo that varies by repo, but these four are
structural. `decisions/` is the **delineation mechanism**: a direction
change is not complete until it is recorded here. This reconciles the
MVAS table (decision 006, which omitted decisions from its component
list) with the alpha-loop (debrief 007, which named decisions as output).
Decision 006 is not edited — this record supersedes that omission by
cross-reference.

### 2. Every direction change requires a decision record *before* the change lands

A direction change (architectural shift in *how we do X*) is preceded by a
decision record that delineates:

- the **old direction** being superseded,
- the **new direction**,
- **what is removed** and **what is created** (making "the old stuff"
  enumerable — the prerequisite for clean removal).

The decision record is the delineation. Without it, "the old stuff" is
scattered and invisible (as flox was: a gitignore comment, a README line, a
checker guard, four logs, a half-built script).

### 3. The No-Coexistence Invariant

> A direction change must not leave the old and new both referenced as
> canonical. It lands as **one atomic commit** (or one short branch) in which
> the old canonical references are removed and the new ones established
> together.

**Trunk stays working.** The literal "delete commit, then create commit"
ordering is rejected: it produces a broken intermediate that undermines the
gamma-loop's continuity if the session dies mid-change. The forcing-function
benefit of "burn the boats" is obtained on a **branch** (delete-first commits
on a feature branch, merged only when complete), never on trunk.

### 4. Scope — direction changes only

This applies to **direction changes** (architectural, decision-backed:
"how we do X"), **not** to **refactors** (implementation change, same
direction: "how X is implemented"). For refactors, the strangler-fig pattern
("build new alongside, switch over, remove old") is correct and safer, because
it preserves a working state behind a stable interface. Applying atomic-swap
to a signature change produces chaos; applying strangler-fig to a direction
change produces the exact context rot this decision exists to prevent.

The test: *did we change how we do X, or how X is implemented?*

## Alternatives Considered

### Alternative A: "Delete before create" as a literal two-step
- **Pros:** Forcing function; no half-states possible.
- **Cons:** Broken intermediate commit; if the session dies mid-change the
  next session inherits a broken trunk. Undermines gamma-loop continuity.
- **Reject.** Use a branch for the forcing function; keep trunk working.

### Alternative B: Strangler-fig for everything
- **Pros:** Always-working state; safe for large changes.
- **Cons:** Leaves old/new coexisting — the exact failure mode this decision
  targets. For direction changes, coexistence *is* the rot.
- **Reject** for direction changes; **retain** for refactors.

### Alternative C: Require decision records only, no coexistence rule
- **Pros:** Lighter; lets migration be gradual.
- **Cons:** Decisions without the no-coexistence rule still permit the flox
  half-built state (decision made, narrative written, replacement never
  built, old never removed). The flox case had the intent documented; it
  still rotted.
- **Reject.** The decision record is the delineation; the atomic swap is the
  execution. Neither works alone.

## Consequences

### Positive
- No hidden context rot from direction changes; changes are loud and
  delineated.
- "The old stuff" becomes enumerable via the decision record, making clean
  removal possible.
- Barnacle review (007) becomes a backstop, not the primary defense.
- `decisions/` recognized as load-bearing infrastructure, closing the
  006/007 inconsistency.

### Negative
- Direction changes are slower: must write the decision *and* perform the
  atomic removal in one movement.
- Refactor vs. direction-change judgement call is occasionally ambiguous;
  the test ("how we do X" vs. "how X is implemented") is the arbiter.
- Large direction changes may need a branch to preserve trunk-works-always,
  adding merge ceremony.

## Implementation

This decision is self-implementing: it is itself a direction change recorded
in `decisions/` before landing. The td-96f35f session (flox) already
followed the invariant without naming it — `provision.sh` deleted and
`install-deps.sh` created in the same commit (4d1e82c). This record
codifies the instinct.

No code change required. The rule is enforced by review discipline and
surfaced by barnacle review (007). A future `scripts/check-manifest.ts`
extension could lint for orphaned old-direction references, but that is
out of scope here.

## References

- Canonical folder list: `docs/standard-mono-repo-pattern.md` (§ Definition)
- MVAS principle: `decisions/006-minimal-viable-agent-stack.md` (decisions/
  omitted from its table — superseded here by cross-reference)
- Barnacle review process: `decisions/007-barnacle-review-process.md`
- Flox deprecation (executed under this invariant): `decisions/008-deprecate-flox.md`
- Three-loop architecture (alpha-loop names decisions as output):
  `debriefs/007-multi-machine-mesh-and-bounded-context.md`
- Session that catalogued the pattern: `debriefs/008-flox-deprecation-and-the-half-built-loop.md`
