# Debrief: 008 — Flox Deprecation and the Half-Built Loop

**Date:** 2026-06-26
**Session:** ses_e01e3a (Mac)
**Status:** Complete
**TD:** td-96f35f
**Related:** decisions/008-deprecate-flox.md · briefs/011 · debriefs/007

---

## What happened

A session that began as blog-post work (td-ffbb74) turned into an exercise in
closing a half-built loop. Orienting to the repo surfaced uncommitted churn
and a failing `just check`. Cleaning the churn revealed that Flox — already
marked for deprecation in barnacle report 001 and decision 007 — was de-facto
gone (no tracked manifest; only four accidentally-committed log files) but
its replacement was a phantom: `just install-deps` was advertised across six
files and never existed.

The work closed the loop in a single movement: decision record, removal of
the fluff, and a working `just install-deps` so the replacement was real,
not aspirational. Three coherent commits landed on a previously dirty tree.

This was the three-loop architecture (debrief 007) operating as designed:
- **Alpha-loop** — `blog/PROJECT.md` and `DEPENDENCIES.md` carried the
  imposed and induced requirements into the session.
- **Gamma-loop** — `td` kept the work on track, and — critically — forced a
  pause of the blog task to handle the flox work, then held the blog's
  state so it could resume.
- **Delta-loop** — this debrief and `decisions/008` persist the lesson in
  the repo, not in chat.

## The central lesson: half-built replacement loops

The defining failure mode of agent work is not starting things — it's
*finishing* them. The flox case was textbook: a decision was made (deprecate
flox), the narrative was written (it was even exchanged between machines as
a coordination event), the barnacle review scheduled the removal — and then
the replacement (`just install-deps`) was documented as if it existed while
the actual implementation (`scripts/provision.sh`) sat half-built, checking
2 of 6 required binaries, giving no hints, wired to nothing.

**The lesson:** removing a thing without making its replacement real is
entropy *inflation* dressed as reduction. You trade a poor tool for a
phantom command. The replacement must be functional in the same change that
removes the original. Filing the gap as a follow-up task is the failure
mode, not the mitigation — it is precisely how the gap persisted for two
weeks.

## Things that worked

### Closing the loop in one movement
Rather than "remove flox now, implement install-deps later," the work did
both. The Watt test (`just install-deps` exits 0) ran before the commit,
not after. A follow-up task for the implementation would have recreated the
exact barnacle being removed.

### Filed the out-of-scope barnacle rather than scope-creeping
The audit surfaced a *separate* phantom cluster — `just dev` and
`just msgs-*` (4-6 refs each, none defined in the justfile). Rather than
absorb it, it was filed as td-24b40f and explicitly excluded. The
self-discipline to not "fix one more thing" is what kept the change coherent.

### Kept the audit trail, removed the dead code
The flox-deprecation passages in `docs/full-stack-overview.md` and
`playbooks/agent-messages-playbook.md` were preserved — they narrate a real
coordination event. Barnacle review removes dead code, not history. Deleting
the story of "we deprecated flox" while writing a decision titled "we
deprecated flox" would have been incoherent.

### td held cross-context state
The blog task (td-ffbb74) was paused, logged, and held. Resumption requires
no context reconstruction — `td context td-ffbb74` returns the full state.
This is the gamma-loop's core value: continuity without a debrief-to-read.

## Things we'd do differently

### The phantom command should have been caught earlier
`just check` enforces manifest/link consistency but does *not* verify that
`just` recipes referenced in docs actually exist. A recipe-lint check
(grep docs for `just <recipe>`, assert each is defined in the justfile)
would have caught `just install-deps`, `just install-stack`, and the entire
`just dev`/`just msgs-*` cluster before they became barnacles. This is a
candidate for `scripts/check-manifest.ts` or a sibling checker. Filed as a
consideration, not yet a task.

### provision.sh should not have been committed half-built
The half-built script was the root cause. A script that checks 2 of 6
required binaries and gives no install hints is worse than no script — it
creates the impression of a working provision step. The honest state would
have been an empty stub with a clear TODO, making the gap visible.

## Design principles validated

### MVAS test (decision 006): "does this reduce entropy?"
Applied directly to reject Alternative B ("remove flox, leave install-deps
as a documented gap"). A documented gap is not entropy reduction. The test
held as a decision criterion.

### Systems over villains
The half-built loop was not a person's mistake — it was a *system* without
a close-out checkpoint. The fix is structural (recipe-lint), not
finger-pointing.

### Map vs. territory
The docs (the map) claimed `just install-deps` existed. The justfile (the
territory) had no such recipe. The session spent real effort reconciling
map to territory — and the lesson is that maps drift from territory by
default. Barnacle review is the reconciliation cadence.

## Files changed

| File | Change | Purpose |
|------|--------|---------|
| `decisions/008-deprecate-flox.md` | +new | ADR: deprecate flox, install-deps is the surface |
| `scripts/install-deps.sh` | +new | Real dependency checker; replaces provision.sh |
| `scripts/provision.sh` | -deleted | Half-built; replaced |
| `scripts/check-manifest.ts` | -guard | Removed dead Flox manifest check |
| `scripts/orient.sh` | M | Point provisioning at install-deps.sh |
| `justfile` | M | Add `install-deps` recipe (new `setup` group) |
| `.gitignore` | M | Ignore all `.flox/` (was: partial) |
| `README.md` | M | Remove Flox line; fix phantom command refs |
| `DEPENDENCIES.md` | (unchanged, now authoritative) | Already the source of truth |
| `MANIFEST.md` | M | List decision 008 |
| `docs/the-vest-protocol.md` | M | `just provision` → `just install-deps` |
| `playbooks/omarchy-setup-playbook.md` | M | `just provision` → `just install-deps` |
| `briefs/011-test-just-dev-on-omarchy.md` | M | Fix internal `just provision` inconsistency |
| `.flox/log/*.log` (4 files) | -deleted | Runtime noise, never should've been tracked |

## Next steps

- **td-24b40f** (P2) — Resolve the `just dev` / `just msgs-*` phantom cluster.
  Larger; may require implementing the messaging system or removing its docs.
- **td-a97f42** (P2) — Fix pre-existing MANIFEST drift (playbook renames + 37
  unlisted docs). Predates this session.
- **td-ffbb74** (P1) — Resume the Muppet Filter blog posts. State held in td;
  drafts intact in `docs/`.
- **Consider** a recipe-lint check to catch phantom `just` commands before
  they become barnacles. Not yet filed.

---

*The loop is closed. The replacement is real. The bar-stewards did not grind us down.*
