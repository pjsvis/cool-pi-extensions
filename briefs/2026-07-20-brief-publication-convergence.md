# Brief: Publication convergence — the Derrida cut

**Date:** 2026-07-20
**Status:** Active — convergence decided and delineated
**Authority:** Decision 009 (no old/new coexistence); the Derrida question asked at newup
**Supersedes:** the three-way split implied by `briefs/2026-07-17-brief-predictably-adequate-series.md` (Posts 3–4) and `briefs/2026-07-20-brief-shannon-publication-newup.md` (companion)
**TD:** td-bb0986 (re-scoped — see below)

## The cut

The Derrida question — "should this even be in our consideration set?" — was asked at newup of the publication backlog. It bit. Three planned writings are **one unwritten document**:

- Predictably-adequate **Post 3** (*A Minimalist AI Tech Stack* — "the stack is the repo, the repo is the stack")
- Predictably-adequate **Post 4** (*An Effective Control Plane for Agents* — briefs, playbooks, ephemeral actors, reconstructable history)
- The Shannon **companion** (*The Repo Is a Longer-Timescale Agent*)

Read next to each other, Posts 3 and 4 *are* the companion, phrased as a series. Drafting them as three parallel tracks is the decorated-Stuff failure mode applied to a publication plan. The cut: collapse three into one. The series framing survives as a *reading order* over the converged spine; the *drafting* is one effort.

## The asset map (ground truth, as found)

| Layer | Asset | Status | Role |
|---|---|---|---|
| Theory | `blog/2026-07-20-the-context-window-is-a-noisy-channel.md` | ~90%, refined | The *why* — information-theoretic |
| Theory (prior) | `blog/2026-07-18-shannon-the-session-and-the-46.md` | earlier draft, **same dek** | **009 violation** — supersede |
| Theory (refs) | `blog/2026-07-20-shannon-context-window-bibliography.md` | done | Neighbours / shoulders |
| Evidence | `blog/2026-07-16-is-predictably-adequate-sufficient.md` | sculpted (Post 1) | Café + experiment + normalisation |
| Evidence (marble) | `blog/2026-07-16-predictably-adequate-composite.md` | raw, 8 components | Source for Post 1 + Post 2 |
| Quarry | `blog/2026-07-14-shannon-package-and-the-derrida-question.md` | raw dialog, 39KB | **Companion's raw material** — repo-as-channel, visitor-agent wodges |
| Practice | *unwritten* — the convergence target | — | **Post 3 + Post 4 + companion + visitor-minimum** |
| Bridge | *unwritten* (Post 2) | — | Governance: squadron, no-muppets, moat |

## The 009 violation to fix

`2026-07-18-shannon-the-session-and-the-46.md` and `2026-07-20-the-context-window-is-a-noisy-channel.md` are two versions of the same theory post (identical dek: "context window is a noisy channel... newup is the channel reset"). 07-20 is the refined version. Per Decision 009, old/new must not coexist.

**Action (recommended):** mark 07-18 superseded by 07-20 in a status header; pillage any unique 07-18 lines into 07-20; retain 07-18 for provenance only. *Not done in this turn* — line-level comparison deferred; flagged here so the coexistence doesn't persist silently.

## The converged spine

Four layers, two exist, two to write. Reading order top-down (theory → evidence → bridge → practice), but the *publication* order is bridge-then-practice once the existing layers are final:

1. **Theory** (exists): *The Context Window Is a Noisy Channel* — the why. Reconcile 07-18 first.
2. **Evidence** (exists): *Is Predictably Adequate Sufficient?* — the empirical floor.
3. **Bridge** (to write, was Post 2): the governance argument — squadron, no-muppets, moat question, Derrida-on-models. Source: composite components 6–8.
4. **Practice** (to write, **the convergence**): *The Repo Is a Longer-Timescale Agent* — was Posts 3+4 + companion + visitor-minimum. Source: 07-14 quarry + `debriefs/010-folder-registers.md` + `DEPENDENCIES.md` + `AGENTS.md`.

The theory cites the practice as existence proof; the practice cites the theory as the *why*. Coupled, not hierarchical — per the Shannon brief's original decision.

## The companion's structure (Posts 3–4 folded in)

Reconciled ToC. The Post 3/4 conceptual frame leads; the repo's demonstrated machinery (from the Shannon brief's companion ToC) instantiates it; Post 4's control-plane is the behavior layer; the visitor-minimum closes as the stealable artifact.

1. **The claim** — the repo is a longer-timescale agent. Ephemeral actors, reconstructable history, no persistent state; the repo *is* the memory. (Post 4 frame.)
2. **The stack, built from nothing** — Pi (harness) / Protocol (normaliser) / squadron (deployment) / td (task DB) / repo-as-truth. Each added only as the work demanded. (Post 3.)
3. **The register anatomically** — one entry, each field justified. Shannon/Derrida separation: structure checksummed, substance walled. (Shannon ToC a; `debriefs/010`.)
4. **Generated, not maintained** — the 13-files-behind story; shared library; marker-delimited MANIFEST. (Shannon ToC b.)
5. **The gate** — presence-blocking, sha-deferred, ship-the-bite-first. (Shannon ToC c.)
6. **Newup as channel reset** — the deterministic procedure; ties back to the theory article. (Shannon ToC d.)
7. **Briefs, playbooks, ephemeral actors** — brief as context-init, playbook as ops guidance, agent as cook. (Post 4.)
8. **Two-level access + locus tags** — a worked query; sync markers as frame-sync words. (Shannon ToC f+g.)
9. **The visitor minimum** — substrate vs sleeve (Decision 018). The stealable kernel: *pi + the prompt + a repo*. Everything else is this repo's demonstration sleeve.
10. **Adopting it minimally** — the stealable version; the stranger-test. (Shannon ToC h.)

**Test (carried from the Shannon brief):** an engineer reproduces the architecture by sundown.

## The visitor minimum (the unifying frame)

The convergence's sharpest product. The Protocol's actual requirements, read from the prompt: silo (a *behavior*, not the extension), locus tags (text), lexicon (text), handoffs (a *discipline*; `td` automates, a markdown doc substitutes), plus the cognitive dispositions (zero tooling). The substrate is **pi + the prompt + a repo**. `just`/`gum`/`glow`/`skate`/`sidecar`/`bun` are this repo's sleeve, not the Protocol. Section 9 of the companion *is* the visitor doc — no separate `VISITOR.md` needed unless the companion grows too long to serve as a reader entry point.

## Re-scoped work (td-bb0986)

The "4-post series" task is re-scoped to the converged spine:

- **Post 1** — exists (`is-predictably-adequate-sufficient`). Sculpting pass optional.
- **Post 2 (bridge)** — still to write. Unchanged.
- **Posts 3 + 4** — **folded into the companion** (section 1–8 above). No longer separate posts.
- **Companion** — the convergence target; sections 1–10 above. Sculpt from 07-14 quarry + debrief 010.
- **Visitor minimum** — companion section 9, not a standalone doc (unless length forces a split).

Net: the series is a 4-layer reading order, not 4 independent drafts. Two layers exist; two to write; the heaviest write (companion) is a sculpting job over existing raw material, not a from-scratch effort.

## What this turn did not do

- **Did not write the companion.** Sculpting the 39KB 07-14 quarry is a long-running agent task — its own bounded phase, its own newup per the discipline. This brief is the cut and the spine; the write is the next phase.
- **Did not reconcile 07-18/07-20** line-by-line. Flagged the 009 violation; left the comparison as an action.
- **Did not write Post 2.** Unchanged scope; downstream of the companion.
- **Did not capture newup-triage in the lexicon.** Separate small action from the same riff; noted, not folded here.

## How to resume

Next session: read this brief + `blog/2026-07-14-shannon-package-and-the-derrida-question.md` (the quarry) + `debriefs/010-folder-registers.md` + the 07-20 theory draft. Order: reconcile 07-18 → sculpt the companion (sections 1–10) from the quarry → write Post 2. The companion is the leading edge.

## Locus

- `[LOC: blog/]` — the existing theory + evidence + quarry assets.
- `[LOC: briefs/2026-07-17, 2026-07-20-shannon]` — the two briefs this convergence supersedes.
- `[LOC: debriefs/010]` — the repo's own prior Shannon/Derrida articulation; the companion's substance.
- `[WAYPOINT: convergence cut made]` — three planned writings collapsed to one; spine fixed; 009 violation surfaced.
