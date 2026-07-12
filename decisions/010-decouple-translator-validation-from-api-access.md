# Decision 010: Decouple translator validation from Cloud API access — WL as portable interchange

**Date:** 2026-07-09  
**Status:** Accepted  
**Review:** 2026-09-21 (quarterly barnacle review)

---

## Context

The `pi-mathematica-verify` harness (brief: `briefs/2026-07-09-brief-mathematica-verify-extension.md`, epic `td-2456d5`) routes tensor-algebra claims from a biomechanics book through Wolfram Mathematica for symbolic verification. Its original plan serialised the build: Phase 0 (validate Cloud API access + the v10.0 upgrade question) gated Phase 1 (the LaTeX→WL translator) — on the theory that no build effort should commit before access was confirmed.

Two probes against the **free Wolfram Alpha web UI** (no API, no install, no credits) tested the engine layer directly:

1. **`Eigenvalues[{{-p,0,0},{0,0,0},{0,0,0}}]`** → `{-p, 0, 0}`. Not all eigenvalues equal ⇒ **not hydrostatic**. This falsifies the book's "pure hydrostatic compression" claim (Error #1 from the book review) in a single computation.
2. **Deviatoric decomposition** `σ − (Tr[σ]/3)·I` → `{{-2p/3,0,0},{0,p/3,0},{0,0,p/3}}`. Non-zero ⇒ **not hydrostatic** — an independent confirmation via a *composite* tensor expression (trace + scalar multiply + identity + subtraction), not a single named function.

Both returned **exact symbolic** output, accepted Mathematica `{{...}}` matrix notation, and emitted derivable Wolfram Language code. The consumer engine handled both a definitional check and a multi-step tensor-algebra expression.

The decisive observation: **WL is a portable interchange format.** The translator's *target* (WL) is identical regardless of backend — WA web, local Mathematica v10.0, or the Cloud API. A translator that round-trips against any WL evaluator round-trips against all of them. Therefore the translator can be validated against a *free* oracle, independent of Cloud API access.

This also confirmed the harness's core thesis empirically: a symbolic engine returns numbers that silently contradict the manuscript, where an LLM reviewer is structurally inclined to praise plausible tensor prose. WA returned `{-p, 0, 0}` and said nothing else — a judge whose failure mode is `False`, not fluent agreement.

## Decision

**Decouple Phase 1 (translator) from Phase 0 (API access).** Validate the translator against free WL oracles — WA web (proven) and/or local Mathematica v10.0 — **in parallel** with Phase 0's access validation. Remove the serial gate (`td dep rm td-1e3602 td-77403f`, done).

- **Phase 1** (`td-1e3602`): unblocked. Oracle = WA web (primary) + local v10.0 (secondary). Starts now.
- **Phase 0** (`td-77403f`): still required, still the go/no-go for *access*, but no longer blocks the technical-risk investigation.
- **Phase 2** (`td-6f4bd4`, Cloud `APIFunction` deploy) and **Phase 5** (`td-1ef78c`, local kernel): remain gated on Phase 0, since they require actual API/kernel access.

**Rationale:** the translator is the go/no-go for the *technical* plan — if LaTeX→WL does not round-trip on the book's notation, the plan stalls regardless of access. Surfacing that risk now, in parallel with access work, shortens the critical path and prevents discovering a fatal translator flaw only after access is sorted. WL portability makes this safe: validation against WA web is a faithful proxy for the Cloud API target.

## Alternatives Considered

### Alternative A: Keep the serial gate (Phase 1 after Phase 0)
- **Pros:** Simpler; no build effort before access is confirmed.
- **Cons:** Defers discovering the real risk (the translator) until after access is sorted; wastes a parallelisable window; the translator consumes no API access, so the gate is pure sequencing overhead. **Reject.**

### Alternative B: Skip WA probes; build straight against the Cloud API
- **Pros:** Tests the exact runtime target.
- **Cons:** Requires Phase 0 first (not done); cannot start now; WA was free, needed no install, and already validated the engine layer empirically. **Reject for now** — WA was a sufficient cheap oracle; Phase 2 will validate against the real Cloud API.

### Alternative C: Use only local Mathematica v10.0 as oracle (skip WA)
- **Pros:** Full kernel; offline; no web dependency.
- **Cons:** v10.0 (2014) may lack newer functions; `wolframscript` CLI arrived circa v11.1 and may not bridge on v10.0; WA needed no install and worked immediately. **Keep v10.0 as a secondary oracle**; WA web primary for Phase 1.

**Chosen:** Parallel validation against WA web (primary) + local v10.0 (secondary), with Phase 2/5 still gated on Phase 0 access.

## Consequences

### Positive
- Critical path shortened: the highest-risk piece (translator) starts now, concurrently with access validation.
- Engine layer empirically validated before any build effort — consistent with MVAS's "prove empirical value before addition" (Decision 006).
- WL-as-portable-interchange principle established — reusable when the local-kernel backend (Phase 5) is built; the same translator targets both backends.
- The harness thesis (non-sycophantic symbolic judge) demonstrated concretely in two queries.

### Negative
- The translator is validated against WA web, not the exact Cloud API. **Acceptable:** WL portability keeps this low-risk; any divergence would be in backend-specific deployment functions (`CloudDeploy`, permissions keys), not in WL tensor syntax — and Phase 2 validates those against the real Cloud API.
- **WA web is a manual, interactive oracle — not automatable.** It is a *development-time* validation tool for Phase 1, not the harness's *runtime* backend. The runtime must use the Cloud API (Phase 2) or local kernel (Phase 5). This boundary is explicit: WA validates the translator; the API powers the harness.

## Implementation

- Dependency removed: `td dep rm td-1e3602 td-77403f` (Phase 1 no longer blocked by Phase 0). Confirmed: Phase 1 has no dependencies.
- Milestone logged: comments on epic `td-2456d5` and task `td-1e3602`.
- Phase 1 (`td-1e3602`) ready to start; oracle = WA web + local v10.0.
- Phase 2 (`td-6f4bd4`) and Phase 5 (`td-1ef78c`) remain gated on Phase 0 (`td-77403f`).

## References

- Brief: `briefs/2026-07-09-brief-mathematica-verify-extension.md`
- Epic: `td-2456d5`; Phase 1: `td-1e3602`; Phase 0: `td-77403f`
- MVAS principle (empirical value before addition): `decisions/006-minimal-viable-agent-stack.md`
- Barnacle review (quarterly): `decisions/007-barnacle-review-process.md`
- Harness thesis: LLM drafts → symbolic engine verifies → human adjudicates, in series (brief, §Mission)
