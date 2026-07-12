# Debrief: 009 — `pi-mathematica-verify` Phase 1: Translator + Registry

**Date:** 2026-07-12
**Session:** ses_7f8c0e (build) + ses_cbd63e (close-out)
**Status:** Phase 1 complete; ready for review
**TD Task:** td-1e3602
**Related:** epic `td-2456d5` · brief `briefs/2026-07-09-brief-mathematica-verify-extension.md` · decisions 010, 011

---

## What we built

The load-bearing piece of the `pi-mathematica-verify` harness — a LaTeX → Wolfram Language translator framework-aware enough to handle both the book's Lagrangian (Einstein-summation index) notation and its continuum (Cauchy/elasticity matrix) notation, plus a **lookup-first verification registry** that makes the curated spec authoritative and the parser a bootstrap/fallback.

The translator now round-trips 10/10 real equations drawn from the actual book source (`pob/briefs/2026-06-26-staved-finger.md` and `…-tensor-algebra.md`), covering both frameworks and every load-bearing notation feature: Einstein summation (single + double dummy), pmatrix environments, `\dot{}`/`\ddot{}` time derivatives, `\mathcal{}` script operators, `\frac{\partial X}{\partial Y}` derivative fractions, `\int ... d<var>` integrals, division, `\delta_{ij}` → `KroneckerDelta`, thin space `\,`, and paren-aware term splitting (the isotropic elasticity expansion `C_{ijkl} = λ δ_{ij}δ_{kl} + μ(δ_{ik}δ_{jl} + δ_{il}δ_{jk})` — the test that would have caught the buckling-context call I almost shipped).

The registry carries nine curated equations with stable `(file, line, nth)` keys — including three on a single line (102) disambiguated by ordinal. Lookup-first resolution: a hash match returns the curated WL + bound assertions; a hash mismatch returns `stale` (loud, never silent); a miss falls back to the parser (candidate, flagged `unverified`, awaiting human curation).

`bun run test:translator` → 10/10. `bun run test:registry` → 9/9 hits, multi-nth WORKING, drift detection WORKING, parser fallback WORKING.

## Architecture decisions that held

### Decision 010 — Decouple translator validation from API access
WL is a portable interchange format. The translator's *target* (Wolfram Language) is identical whether you evaluate it on free WA web, a local v10.0 kernel, or the Cloud API. Validating against any one validates the translator. We demonstrated this twice with free WA queries before any build effort:
- `Eigenvalues[{{-p,0,0},{0,0,0},{0,0,0}}]` → `{-p,0,0}` — falsifies the book's "pure hydrostatic compression" claim on the uniaxial config.
- `σ − (Tr[σ]/3)·I` → `{{-2p/3,0,0},{0,p/3,0},{0,0,p/3}}` — an independent falsification via the deviatoric decomposition, a *composite* expression (trace + scalar multiply + identity + subtraction), not a single named function.

The critical-path implication: Phase 1 (the highest-risk piece) runs in parallel with Phase 0 (the API-access gate). The translator consumes no API access; serial-gating it was pure sequencing overhead.

### Decision 011 — Lookup-first verification registry
Originally the translator *was* the verifier. Now the registry is the authoritative spec and the translator is the bootstrap/fallback. This is what separates "we wrote a translator once" from "we have a verification system that survives manuscript edits":

- **Curated** — an equation's WL and bound assertions live in `equations.jsonl`, not in the translator code. Humans own the verdict.
- **Drift-detected** — when the manuscript equation changes, the hash mismatches, the build gate fails, and a human must decide: re-translate, re-curate, or revert the manuscript. Stale entries never silently pass.
- **Multi-nth** — three equations on the same source line (102 of the tensor-algebra brief) keyed by ordinal, all resolved to three distinct registry entries. The locator scheme handles dense equations without inflating registry IDs.
- **Fallback** — unregistered equations get a parser-generated candidate WL, flagged `unverified`, ready for promotion. The path from bootstrap to curated is short and obvious.

### WA-web boundary (demonstrated, not assumed)
The earlier session's log correctly logged that WA web is not a WL kernel — it's a single-expression NLU engine. WA *mangled* `J` into `BesselJ` and the imaginary unit `i` into `I` (its own "Assuming i is the imaginary unit" prompt confirmed). It cannot evaluate multi-statement WL (assignments + comparison → "doesn't understand"). Therefore WA validates single self-contained definitional expressions only; multi-statement identity checks need a real kernel. The translator target (Wolfram Language) is portable across WA, local v10.0, and Cloud API; the *runtime* must be the latter two. This boundary is explicit and tested.

## Things we'd do differently

### The `index.ts` dangling reference
`package.json` originally declared `"pi": { "extensions": ["./index.ts"] }` against a file that does not exist. Phase 1's deliverable is translator + registry + tests, not the runtime extension hook. The honest state was one of two: (a) remove the field until Phase 3, or (b) ship a no-op stub that signals `phase1-only`. Chose (a) and added a `_phase1Status` annotation.

Future rule: **`package.json` should not promise modules that don't yet exist**, even in the same scaffold. A broken import path at module-load time fails loud and ugly; a missing file referenced from JSON metadata fails silent until someone tries to install.

### Two equations per registered entry is a thin slice
Nine curated entries from two book pages is technically over the 2–3 target, but the width is shallow: it covers Lagrangian index notation and continuum matrix notation, but not all chapters. Phase 4 (book build gate) will catch new patterns at scale and they'll land here in the registry. Realistic to expect 30-60% more notation edges during a 30-page sweep — `\to` limits, trig, function-call parens (`M(q)`), non-cartesian basis vectors, abstract index notation (xAct). The translator's gaps are honest and tracked; the registry's curator workflow makes each new entry a small, explicit promotion rather than a re-run-everything.

### Hash-based drift detection depends on stable LaTeX normalization
`normalizeLatex` strips `$…$` and collapses whitespace. That's enough for the current notebook, but a manuscript reconstructor that drops a `\,` thin space or restructures a fraction will hash-match spuriously. Tighten normalization if we see drift false-negatives during Phase 4.

## Design principles validated

### The translational tier is the right shape
Per Decision 010 (and the brief's "two backends, one tool surface"), the harness abstracts over (a) Wolfram Cloud and (b) local `wolframscript`. Phase 1 doesn't pick one — it produces portable WL. Phase 2 picks the Cloud; Phase 5 adds the local kernel. The translator's portability is the dividing line.

### MVAS test (decision 006): "does this reduce entropy?"
Yes. Translator: 5 equation patterns → one framework-aware LaTeX parser. Registry: one JSONL file, hash-based drift, multi-nth, parser fallback — replaces ad-hoc per-equation curation scripts that would have accumulated as barnacles. Nine registered equations with stable locators collapse to a single-source-of-truth lookup.

### No LLM in the verification path
The harness's whole point is a non-sycophantic judge. Mathemarica verifies; the LLM invokes the tool. The translator emits symbolic WL, never decisive prose. The system's failure mode is `False`, not fluent agreement. This was the theorem; Phase 1 preserved it.

### Systems over villains
The Wolfram Alpha ambiguity (`J → BesselJ`, `i → I`) wasn't a generator failure — it was a property of the engine surface. The correct response was *not* to insist on raw-symbol fidelity from WA, but to recognize the boundary, document it, and route anything that needs raw-symbol fidelity to a real kernel. WA validates single expressions; a real kernel validates identities. The translator outputs both.

## Files changed

| File | Change | Purpose |
|------|--------|---------|
| `src/extensions/pi-mathematica-verify/translator.ts` | +new (~280 lines) | LaTeX → WL; framework-aware; paren-aware term splitting; 10/10 against real equations |
| `src/extensions/pi-mathematica-verify/registry.ts` | +new (~80 lines) | Lookup-first resolve; hash-based drift detection; multi-nth; parser fallback; local-vs-kernel assertion split |
| `src/extensions/pi-mathematica-verify/equations.jsonl` | +new (9 entries) | Authoritative verification spec; seeded from 2 book pages |
| `src/extensions/pi-mathematica-verify/translate-test.ts` | +new | 10 real-equation cases; PASS/FAIL runnable via `bun run test:translator` |
| `src/extensions/pi-mathematica-verify/resolve-test.ts` | +new | Hits/multi-nth/drift/fallback runnable via `bun run test:registry` |
| `src/extensions/pi-mathematica-verify/package.json` | +new (revised) | Module marker; `_phase1Status` annotation; test scripts; `pi.extensions` removed until Phase 3 |
| `decisions/010-decouple-translator-validation-from-api-access.md` | +new | WL as portable interchange; WA oracle boundary established |
| `decisions/011-lookup-first-verification-registry.md` | +new | Registry authoritative; parser fallback; hash-drift |
| `briefs/2026-07-09-brief-mathematica-verify-extension.md` | +new | Phase 0–5 plan; architectural constraints; assertion library table |

## Open edges (carried into later phases)

| Gap | Where it'll bite | Phase |
|-----|------------------|-------|
| `\to` limits on `\int`, `\sum` | Limits on integrals/sums in tensor integral identities | Phase 4 (book sweep) |
| `\sin`, `\cos`, `…` trig | Anisotropic elasticity / wave-equation chapters | Phase 4 |
| Function-call parens `M(q)` | Multibody kinematics chapters | Phase 4 |
| `\varepsilon` -> `ε` correct (in GREEK now; was missing) | Already fixed during Phase 1 | — |
| `index.ts` runtime + `verify_equation` tool | Pi extension entry; backend selection | Phase 3 (`td-003ad8`) |
| `backends/cloud.ts` | Wolfram Cloud `APIFunction` client | Phase 2 (`td-6f4bd4`) |
| `backends/local.ts` + xAct bootstrap | Local kernel for abstract-tensor identities | Phase 5 (`td-1ef78c`) |
| `extractor.ts` (markdown walker) | Pre-Phase-4: harvest `$$…$$` and `$…$` into `(file, line, nth)` locators | Phase 4 prep |
| `reporter.ts` (build-gate report) | Aggregated Pass/Fail summary; non-zero exit on stale/False | Phase 4 |

## Next steps

- **`td-1e3602`** — submit for review (`td review`). Independent reviewer should rerun both test scripts to confirm 10/10 + 9/9.
- **`td-77403f`** — Phase 0 (API access validation; v10.0 upgrade decision). The remaining go/no-go gate for the local-kernel backend (Phase 5).
- **`td-6f4bd4`** — Phase 2: deploy the curated `APIFunction` assertion set; permissions key; the runtime that proves the translator against the real Cloud backend.
- **`td-003ad8`** — Phase 3: scaffold `index.ts`, `verify_equation` tool, backend selection. Add `pi.extensions` field to `package.json` only when the file exists.

---

*Phase 1's gate was: "if LaTeX→WL doesn't work cleanly on the book's notation, the plan stalls here." It doesn't. Ten out of ten. The translator is portable, the registry is authoritative, and the manifest drift is loud not silent. Watt's test passes: the steam engine turns.*
