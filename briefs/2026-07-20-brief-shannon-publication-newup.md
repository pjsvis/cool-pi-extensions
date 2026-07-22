# Brief: Shannon publication — newup handoff

**Date:** 2026-07-20
**Status:** In progress (newup point) — **companion scope converged** with PA Posts 3–4 per `briefs/2026-07-20-brief-publication-convergence.md` (Derrida cut, 2026-07-20). This brief's "remaining debt" is superseded by the convergence brief; the companion ToC there is the reconciled one.
**TD:** untracked — research strand (re-scopes td-bb0986)

## Context

Long session developed the "context window as a noisy channel" frame and produced two filed blog assets. Context window now heavy; newing up per the session-newup discipline — practising what we preach. This brief is the lossy compression; the raw transcript is the entropy and can be dropped.

## Ground truth — what exists

- `blog/2026-07-20-the-context-window-is-a-noisy-channel.md` — theory draft (~90%). Reframe, Shannon mapping (source/channel/capacity/rate-distortion/handoff-as-lossy-compression), what-it-predicts, where-it-strains, neighbours, chum titles.
- `blog/2026-07-20-shannon-context-window-bibliography.md` — narrativised bibliography, four piles (formalizers / channel framers / adjacent / parallel) + shoulders + verdict + chum titles. Done.
- Repo already implements the discipline: `scripts/gen-registers.ts` (self-describes as "Shannon-style structural checksum"), per-folder `register.jsonl` (path/title/description/sha/bytes/status), `debriefs/010-folder-registers.md` (Shannon/Derrida separation, systems-over-villains, generated-not-maintained).

## Decisions made this session

- **Publication structure: theory article + companion implementation piece.** Coupled, not hierarchical — theory cites companion as existence proof; companion cites theory as the *why*. Theory-without-practice = decorated Stuff (our own principle applied to ourselves).
- **Order B: write the companion first** (grounded in the reviewed docs), then revise the theory to point at it cleanly. Map after territory.
- **Arbitrage spine:** "cheaper sessions, lower variance, over anything else" — measurable where quality is contested. This is the organising frame, not just a chum title.
- **Three byproducts of newup, all free given orientation:** (1) context management (Shannon/rate-distortion), (2) explorability (register-as-enriched-checksum), (3) trajectory alignment (Derrida question carried by the report-back).
- **Derrida question extended** from procurement to trajectory. Sound — the question's structure (existential, before-the-fact, consideration-set-gating) defines it, not the object. Needs a line in the lexicon.
- **"Cool flex" of pointing readers to the repo:** yes, conditional on the stranger-test. The companion piece IS the visitor's onboarding doc. Don't point readers at the repo until the companion exists; once it does, the pointing is the strongest move in the publication.

## Remaining debt

1. **Fold five extensions into the theory draft:** arbitrage as spine; register-as-checksum / three-byproducts loop; Derrida-at-newup; recursive "repo is a longer-timescale agent" close; lexicon-extension note.
2. **Write the companion implementation piece** (`blog/2026-07-20-the-repo-is-a-longer-timescale-agent.md`). ToC: (a) the register anatomically — one entry, each field justified; (b) generated, not maintained — the 13-files-behind story, shared library, marker-delimited MANIFEST; (c) the gate — presence-blocking, sha-deferred, ship-the-bite-first; (d) newup orientation — the deterministic procedure; (e) report-back with the specificity bar — gap-surfacing as Derrida trigger; (f) two-level access demonstrated — a worked query; (g) locus tags as sync markers; (h) adopting it minimally — the stealable version. Test: an engineer reproduces the architecture by sundown.
3. **Lexicon extension** in `AGENTS.md`: add "the Derrida question → trajectory" as a cited use, so the term registry grows per its founding note.
4. **Pair titles on ship:** *The Context Window Is a Noisy Channel* (theory) / *The Repo Is a Longer-Timescale Agent* (practice).

## How to resume

New session: read this brief + the two blog files + `debriefs/010-folder-registers.md`. The conceptual state is fully captured here. Order B: review the docs (registers, `gen-registers.ts`, debrief 010), then write the companion.

## Locus

- `[LOC: blog/]` — the two filed assets.
- `[LOC: scripts/gen-registers.ts, scripts/register-lib.ts]` — generator + shared lib.
- `[LOC: debriefs/010-folder-registers.md]` — the repo's own prior articulation of the Shannon/Derrida separation.
- `[WAYPOINT: publication structure decided]` — theory + companion, coupled, order B.
