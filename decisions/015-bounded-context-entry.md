# Decision 015: Bounded-context entry as default — repo or brief, never unconstrained

**Date:** 2026-07-12
**Status:** Accepted
**Review:** 2027-01-12 (six months — a workflow principle; revisit once EDI-005b quantifies it)

## Context

Two parked briefs (`2026-07-12-token-compaction-hook.md`, `2026-07-12-preflight-auditorflags.md`) were drafted in an unconstrained offline dialog and exhibited entropy inflation + fabricated provenance (an `upstream: briefs/stylistic-algorithmic-dentistry` that does not exist). The new trap EDI-005 (commit `6f20337`) proved the decisive point empirically: **Protocol priming alone does not prevent yap.** Run unprimed on an open-ended ask, Gemini 3.1 Pro, Gemini 2.5 Pro, and GLM-5.2 *all* failed — fabricating comprehensive architectures on fictitious foundations, GLM-5.2 hardest (7715c). The Edinburgh Protocol normalizes the substrate (the *manner* of map-making); it cannot supply the *matter*. Yap is what happens when a normalized map has no territory to be checked against.

In parallel, the operator shifted workflow: questions previously asked in unconstrained chat are now asked by dropping into a herdr tab in the repo and using the existing context. Practice and the eval data converge on the same principle.

## Decision

Adopt **bounded-context entry as the default start mode.** Never start a model unconstrained. Two bounds:

1. **Repo context** (via `just orient` / VEST) for repo-domain work — the model observes real files, git state, and td state; fabrication is caught against the territory.
2. **A frozen brief** (What / Why / Out-of-scope) for pre-repo or non-repo work — explicit scope bounds substitute for the repo's territory.

The Edinburgh Protocol and the bounded context are complementary axes: normalization (manner) × grounding (matter). Together they reach Q4 (repo-focused mode). Neither alone is sufficient — EDI-005 proved Protocol-without-context still yaps; repo-without-Protocol drifts in manner (locality bias, untested — see EDI-005b).

## Alternatives considered

- **Protocol-only (Q2).** Rejected — EDI-005 shows it yaps on open-ended asks.
- **Model swap to escape yap.** Rejected — GLM-5.2 yapped hardest; the yap is context-induced, not model-specific.
- **Repo-only, no Protocol (Q3).** Partial — has territory but drifts in manner; carries locality-bias risk. Falsifiable; EDI-005b (brief to follow) tests whether grounding-alone suffices or both axes are required.

## Consequences

- **Easier:** yap prevented at the source; fabrication caught against territory; the two parked briefs would not have been fantasy if drafted in-repo (the model would have seen `main`-only, no branch-per-task, no `.task-memory/`).
- **Harder:** a bounded-but-repo-free channel must be preserved for genuine greenfield work — bounded by a brief, not by the repo. Locality bias: a grounded model can over-conform to the repo's *present* state and reproduce its assumptions; the Protocol's Anti-Dogma applies to repo conventions too, not just external ideology. Not every question is a repo question — forcing greenfield thought into a repo frame is the opposite failure.
- **Testable:** EDI-005b quantifies whether grounding-alone (Q3) works or both axes (Q4) are mandatory.

## References

- EDI-005: `prompts/edinburgh-protocol-evals-v1.json`; human-readable `docs/edinburgh-protocol-evals.md`
- Brief for the test: `briefs/2026-07-12-brief-edi-005b-grounding-test.md`
- Parked briefs: `briefs/2026-07-12-token-compaction-hook.md`, `briefs/2026-07-12-preflight-auditorflags.md`
- Bounded context (agent comms): `docs/bounded-context-agent-communication.md`, Brief 010
- VEST (entry/orient): `docs/visitor-protocol.md`
- Working draft: `docs/the-agent-is-a-benchmaxxer-of-prompts.md`
- Session commits: `1c18ce3` (briefs parked), `6f20337` (EDI-005 + det-only verdict)

---

*Map vs. territory is the Protocol's first principle. This decision makes it operational: never let the map float free of any territory — the repo's, or a brief's.*
