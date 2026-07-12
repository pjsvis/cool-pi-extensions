# Decision 011: Lookup-first verification registry — WL as curated, parser as fallback

**Date:** 2026-07-09  
**Status:** Accepted  
**Review:** 2026-09-21 (quarterly barnacle review)

---

## Context

Phase 1 validated the LaTeX→WL translator (5/5 real equations, both frameworks — see Decision 010). But a *general* LaTeX parser is mild over-engineering for the actual problem: the book is a **closed corpus** (~30 pages, a finite set of equations). What's needed is deterministic, per-equation verification of *these* equations, not general parsing.

Two adjacent facts sharpened this:

1. **The translator produces WL but doesn't know which assertions apply.** The Cauchy matrix wants `[hydrostaticQ, uniaxialQ, symmetricQ]`; the pullback wants `[contractEqual vs JᵀF]`. Assertions must be *bound* to equations somewhere. The translator is the wrong place.
2. **Phase 4 needs `equation → status` to gate the book build.** That data structure *is* a registry. Building it now pulls Phase 4's structure forward and lets Phases 1–3 populate it — entropy *reduction*, not accretion (Decision 006).

The WA-web oracle ceiling (Decision 010) also nudged this direction: the registry stores the *full* WL per equation (multi-statement included), so the **kernel** runs it at runtime and WA-web's single-expression limit becomes irrelevant. The free oracle stays a development-time spot-checker.

## Decision

**Lookup-first verification via a curated registry.** `equations.jsonl` is the authoritative verification spec. Resolution precedence:

1. **Lookup by `(file, line)`.** If an entry exists:
   - **Hash match** (manuscript LaTeX hash == curated hash) → run the entry's bound assertions; curated WL/assertions win.
   - **Hash mismatch** → **STALE** (drift). Loud failure — the build gate fails; never silent.
2. **Miss** (no entry at that `(file, line)`) → **parser fallback**: `translate()` produces a *candidate* WL, flagged `unverified`, for human promotion into the registry.

The parser is the **bootstrap and fallback**, not the source of truth. "Lookup first" ≠ "lookup only."

**Schema** (strict — Decision 007; no free-form dump):

```
{ id, file, line, framework, latex, latexHash, wl, assertions[], status, lastVerified }
status ∈ {pass, fail, unverified, stale}
```

`latexHash` is computed on load from the normalized LaTeX (stored `latex` is the human-readable source of truth for the hash).

**Assertion execution split:**
- **Local (no kernel):** `indexConsistencyQ` — free-index match, computable from the translator's parse. Runs immediately.
- **Kernel-dependent:** `symmetricQ`, `contractEqual`, `hydrostaticQ`, `uniaxialQ`, … — defer to the Phase 2/3 backend (Cloud API / local kernel). The registry *binds* them; the backend *runs* them.

## Alternatives Considered

### Alternative A: Parser-only (no registry)
- **Pros:** General; one system.
- **Cons:** Fragile on notation edge cases; no deterministic per-equation spec; nowhere to bind assertions; over-engineering for a closed corpus (Decision 006). **Reject.**

### Alternative B: Registry-only (retire the parser)
- **Pros:** Maximal determinism.
- **Cons:** Every new equation blocks on manual curation; no bootstrap from unregistered equations. **Reject** — keep the parser as fallback.

### Alternative C: Registry without drift detection
- **Pros:** Simpler.
- **Cons:** Silent rot — the author edits an equation; the registry verifies the *old* one and ships the *new*. This is exactly the silent-failure mode the harness exists to prevent. **Reject.** The hash check is non-negotiable.

**Chosen:** Lookup-first registry with hash-based drift detection; parser as fallback; local vs kernel assertion split.

## Consequences

### Positive
- Deterministic verification of curated equations (no parser edge cases on known equations).
- Assertions bound to equations at the right granularity.
- The registry *is* the Phase 4 build-gate report — one structure, populated across phases.
- Parser stays useful as bootstrap and safety net for new/uncurated equations.
- Drift is loud (hash mismatch → `stale` → gate fails), never silent.
- WA-web ceiling moot at runtime: the kernel runs the registry's full WL.

### Negative
- The registry must be curated and kept in sync. **Mitigated:** drift-hash makes divergence loud; curation *is* the verification work (you can't verify without specifying what to check), not overhead.
- Kernel-dependent assertions still need the Phase 2 backend — the registry binds them but doesn't execute them yet.
- Two systems (parser + registry). **Mitigated:** clear precedence — registry authoritative, parser fallback-only.

## Implementation

- `equations.jsonl` — seeded with the 5 equations from `pob/briefs/2026-06-26-staved-finger.md` (lines 15, 21, 29, 33, 43), with framework, WL, and bound assertions.
- `registry.ts` — `Equation` schema, `loadRegistry`, `normalizeLatex`, `hashLatex`, `resolve` (lookup-first + drift), `runLocalAssertions`.
- `translator.ts` — added `indexConsistent()` for the local `indexConsistencyQ` check.
- `resolve-test.ts` — demo: 5/5 registry hits; drift detection **WORKING** (`x^i`→`y^i` → `stale`); parser fallback **WORKING** (novel `A_a = B^i_a C_i` → `A[a] == Sum[B[i, a]*C[i], {i, 1, 3}]`). `indexConsistencyQ=true` for all Lagrangian entries; `contractEqual`/`symmetricQ` → `needs-kernel`.
- Run: `bun run src/extensions/pi-mathematica-verify/resolve-test.ts`.

## References

- Brief: `briefs/2026-07-09-brief-mathematica-verify-extension.md`
- Decision 010 (WA-web oracle ceiling; registry holds full WL for the kernel)
- Decision 006 (MVAS — empirical value over feature accumulation; closed corpus)
- Decision 007 (barnacle review — strict schema, no free-form dump)
- Epic `td-2456d5`; Phase 1 `td-1e3602`
