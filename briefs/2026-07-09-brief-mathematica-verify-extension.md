# `pi-mathematica-verify` (The Symbolic Stress-Test Harness)

## Mission Statement

To give the poverty-of-bio-mechanics book a judge whose failure mode is `False` rather than fluent agreement. A Pi coding-agent extension that exposes a `verify_equation` tool the LLM can call mid-edit, routing tensor-algebra claims through Wolfram Mathematica for symbolic verification before they ship into the manuscript.

The LLM proposes and drafts; Mathematica verifies; the human adjudicates disagreements. The two run in series, never in parallel.

## Status (2026-07-09)

- **Phase 1 gate passed** (Decision 010): translator validated 5/5 real equations across both frameworks (Lagrangian Einstein summation; continuum pmatrix). Engine layer confirmed via free WA probes.
- **Decision 011 — lookup-first registry implemented**: `equations.jsonl` (authoritative spec: equation → WL + bound assertions) + `registry.ts` (lookup by file+line, hash-based drift detection, parser fallback, local-vs-kernel assertion split). The translator is now bootstrap/fallback; the registry is source of truth. 5/5 hits, drift detection working, parser fallback working.
- **Open:** Phase 0 (API access / v10.0 upgrade) still gates Phases 2 & 5. Translator 10/10 — `\dot{}`/`\ddot{}`, `\int … dV`, `\mathcal{}`, division, double summation, and parenthesised groups (isotropic elasticity expansion) all handled; remaining: `\to` limits, trig, `M(q)` function-call parens. Registry curated to 9 equations, keyed `(file, line, nth)` (line 102 holds 3).

## Motivation (Concrete, Not Aspirational)

A single one-page treatment from the book was reviewed against its own tensor algebra. Two load-bearing errors surfaced:

1. **Uniaxial ↔ Hydrostatic conflation.** A configuration explicitly described as "σ¹¹ dominant, off-diagonals → 0" was claimed to produce "pure hydrostatic compression." Hydrostatic requires σᵢʲ = −p·δᵢʲ (isotropic); the described state is uniaxial. Direct contradiction.
2. **Bending-as-shear.** A transverse end-load was claimed to "maximize off-diagonal shear σ¹²." Bending dominates the *normal* stress σ¹¹ = −My/I; transverse shear is a secondary term. The argument pointed at the wrong tensor component.

Both are *definitional* errors — exactly the class a symbolic engine catches in one call and an LLM reviewer is structurally inclined to praise past. Thirty pages of tensor algebra at this density implies dozens of latent errors of the same flavour. Manual review will not scale.

**Engine-layer validation (2026-07-09, Decision 010):** both errors were independently reproduced with free Wolfram Alpha queries. `Eigenvalues[diag(-p,0,0)]` → `{-p,0,0}` (not all equal ⇒ not hydrostatic), and the deviatoric decomposition → `{{-2p/3,0,0},{0,p/3,0},{0,0,p/3}}` (non-zero ⇒ not hydrostatic). The consumer engine handles definitional and composite tensor checks with exact symbolic output; the Cloud API (strictly more capable) will do so trivially.

## Architectural Constraints (The Silo)

* **Local-first where it matters.** The Pi extension is TypeScript, project-local (`.pi/extensions/`), carrying its own `package.json` + `node_modules` via the `with-deps` pattern.
* **Verification engine is Mathematica, not an LLM.** The whole point is a judge that is not impressed by prose. No LLM is permitted in the verification path — only as the drafter that invokes the tool.
* **Two execution backends, one tool surface.** The `verify_equation` tool must abstract over (a) the Wolfram Cloud API and (b) a local `wolframscript` kernel, selected by configuration. Phase 1 targets the Cloud; Phase 2 adds the local kernel for abstract-tensor work the Cloud cannot do.
* **Books are the source of truth.** Equations live in markdown/LaTeX. The harness must extract and translate them; it must not require the author to maintain a parallel Mathematica manuscript.

## The Two Backends (The Fork That Determines Scope)

### Backend A — Wolfram Cloud API (Phase 1)

* Deploy a curated `APIFunction` set via `CloudDeploy[... , Permissions -> PermissionsKey["..."]]`.
* Call as a plain HTTP GET/POST with `?_key=...`. Auth is a permissions key — no OAuth dance for the deployed-API path.
* **Capability ceiling:** a bare Wolfram Language kernel. Fine for *concrete matrix representations* and *definitional* checks. **Cannot** do abstract symbolic tensor algebra with implicit Einstein summation and index symmetries — that needs the xAct suite (xTensor/xCoba), a third-party add-on absent from the Cloud kernel.
* Cost: per-call Cloud Credits and latency. Acceptable for a curated assertion library; not for blanket re-derivation.

### Backend B — Local `wolframscript` Kernel (Phase 2)

* Shell out to a local Mathematica install with xAct loaded. Full symbolic tensor algebra: abstract indices, symmetries, contractions, coordinate transforms.
* No per-call cost; fast offline iteration; the only path to verifying *identities*, not just *matrix instances*.
* **Version risk to resolve up front:** the user holds Wolfram Mathematica Personal **v10.0** (2014), no active subscription. `wolframscript` arrived circa v11.1; current Cloud API and kernel features have moved on. xAct runs on v10+, but the CLI bridge and Cloud tooling may require an upgrade. **Assumption for this spec:** API access is obtainable and a current app can be downloaded. This assumption must be validated before Phase 2 build — it is a go/no-go gate, not a footnote.

## Operational Flow

### 1. Extraction

A markdown walker scans book pages, harvesting `$$ ... $$` and inline `$ ... $` math blocks. Each is paired with its surrounding claim sentence (the prose making an assertion about the equation) and a stable locator (file + line).

### 2. Resolution (lookup-first — Decision 011)

Each extracted equation is matched against the registry (`equations.jsonl`) by `(file, line)`:
- **Hit, hash match** → the curated WL and bound assertions win. Run them.
- **Hit, hash mismatch** → **STALE** (drift): the manuscript equation changed since curation. Loud failure — the build gate fails; never silent.
- **Miss** → **parser fallback**: `translate()` produces a *candidate* WL, flagged `unverified`, for human promotion into the registry.

The registry is the authoritative verification spec; the parser is the bootstrap and safety net for uncurated equations.

### 3. Translation (parser fallback / bootstrap)

LaTeX → Wolfram Language, domain-specific to the book's notation. Runs only on misses (or to bootstrap new registry entries). Validated 5/5 on both frameworks (Decision 010). The remaining notation (`\dot{}`/`\ddot{}`, `\int … dV`, elasticity-tensor expansion, `\to` limits) is being extended for broader curation.

### 4. Assertion

Each equation's bound assertions (stored in the registry) execute in two tiers:
- **Local (no kernel):** `indexConsistencyQ` — computable from the parse; runs immediately.
- **Kernel-dependent:** `symmetricQ`, `contractEqual`, `hydrostaticQ`, … — dispatched to the backend.

### 5. Verification

Kernel-dependent assertions are dispatched to the active backend (Cloud or local). Result, counterexample, and simplification are returned to the tool caller.

### 6. Reporting

Inline result to the LLM (Pass/Fail + evidence). Aggregated mode walks all equations, reads registry `status`, and emits a report; intended to gate the book build (fail on any `False` or `stale`).

## The Translator Layer (Engineering Risk Centre)

This is not solved by `ToExpression[..., TeXForm]`. Mathematica parses `\sigma_{ij}` to `Subscript[σ, i j]` — a *display* form, not a tensor with index structure. Implicit Einstein summation does not exist; contractions must be explicit `TensorContract`/`Sum`. The book also mixes two frameworks needing *different* translation rules:

* **Discrete Lagrangian mechanics** — generalized coords $q^a$, Jacobians $J^i{}_a$, Lagrange multipliers $\lambda_i$. Translate to explicit vectors/matrices.
* **Continuum fields** — Cauchy $\sigma^{ij}$, constitutive $C_{ijkl}$, strain. Translate to explicit arrays (Cloud) or abstract indexed symbols with declared symmetries (local kernel + xAct).

The translator is a small, explicit mapping from *this book's* LaTeX conventions to concrete WL. Nobody ships it. Per Decision 011, it is the **bootstrap and fallback** (runs on registry misses); the registry is the authoritative source of truth. It was validated against 5 real equations before any extension wiring — the load-bearing piece and the go/no-go for the plan, which **passed** (Decision 010).

## The Assertion Library (Phase 1 — Definitional Checks)

Each is a WL one-liner. All are matrix-representation checks the Cloud API runs trivially. These alone would have caught both motivating errors.

| Assertion | Returns `True` when | Catches |
| --- | --- | --- |
| `hydrostaticQ[σ]` | `σ == -p IdentityMatrix[3]` | Uniaxial↔hydrostatic conflation (Error #1) |
| `uniaxialQ[σ]` | exactly one nonzero diagonal | Stress-state mislabeling |
| `isotropicQ[σ]` | `σ == σ[[1,1]] IdentityMatrix[3]` | Isotropic/deviatoric confusion |
| `deviatoricQ[σ]` | `Tr[σ] == 0` (trace-free) | Deviator mislabeling |
| `symmetricQ[σ]` | `σ == Transpose[σ]` | Angular-momentum conservation violations |
| `antisymmetricQ[σ]` | `σ == -Transpose[σ]` | Rotation-field errors |
| `indexConsistencyQ[lhs,rhs]` | free indices match in rank and count | Rank/index errors |
| `contractEqual[a,b]` | `TensorContract` of both sides agrees | Identity violations |
| `reduceTo[expr,assumptions]` | expression simplifies to expected form under known limits (small strain, hydrostatic, etc.) | Limit-case drift |

Phase 2 (local kernel + xAct) extends this to abstract-index identity verification and coordinate-invariance checks.

## Build Phases

| Phase | Deliverable | Gate |
| --- | --- | --- |
| 0 | Validate assumptions: confirm API access obtainable; confirm local-app download path; resolve v10.0 upgrade question. | Go/no-go for Phase 2. |
| 1 | Translator layer, validated against 2–3 real book equations (incl. the two error passages). | If LaTeX→WL doesn't work cleanly on the book's notation, the plan stalls here. |
| 2 | Deployed Cloud `APIFunction` assertion set + permissions key. | Cloud returns `True`/`False` for a known-bad and known-good input. |
| 3 | Pi extension: `verify_equation` tool, Cloud backend, inline reporting. | LLM calls the tool mid-edit and gets a Pass/Fail. |
| 4 | Markdown walker + aggregated report; wire into book build as a gate. | Full-book sweep surfaces the two known errors. |
| 5 | Local `wolframscript` backend + xAct for abstract-tensor identities. | Phase-2 capability; identity-level verification. |

*Per Decision 011, a lookup-first registry (`equations.jsonl` + `registry.ts`) threads through Phases 1/2/4 — the authoritative spec (equation → WL + bound assertions), parser as fallback, hash-based drift detection. Phase 1's translator gate is **passed** (5/5, both frameworks). Phase 0 (API access) remains the gate for Phases 2 & 5.*

## Risks & Open Questions

* **v10.0 currency.** 12 years old. CLI bridge and Cloud tooling may force an upgrade. Resolve in Phase 0.
* **Translator fidelity.** The highest-variance piece. Two equations of each framework must round-trip before commitment.
* **LLM-in-verification-path temptation.** Must be refused. The harness's value is a non-sycophantic judge; routing verification through an LLM collapses it back to the failure mode it exists to prevent.
* **Cost/latency of blanket Cloud sweeps.** Curated assertions are cheap; unbounded re-derivation is not. Scope the assertion library deliberately.

## Core TypeScript Modules to Scaffold

| Module | Purpose |
| --- | --- |
| `index.ts` | Extension entry; registers `verify_equation` tool; backend selection by config. |
| `translator.ts` | LaTeX → WL mapping, framework-aware (Lagrangian vs continuum). Bootstrap/fallback per Decision 011. |
| `registry.ts` | Lookup-first resolver: load `equations.jsonl`, match by (file,line), drift via hash, parser fallback, local-vs-kernel assertion split. |
| `equations.jsonl` | The authoritative registry: {id, file, line, latex, hash, framework, wl, assertions, status}. Seeds Phase 4's build-gate report. |
| `backends/cloud.ts` | Wolfram Cloud `APIFunction` client (permissions-key auth, `fetch`, `ctx.signal`). |
| `backends/local.ts` | `wolframscript` shell-out backend (Phase 2; xAct bootstrap). |
| `assertions.ts` | The curated assertion library (table above) as a registry. |
| `extractor.ts` | Markdown math-block walker; pairs equations with claim sentences; stable IDs. |
| `reporter.ts` | Inline tool results + aggregated sweep report; build-gate exit codes. |

## References

- Decision 010 — Decouple translator validation from API access (WA-web oracle ceiling; WL as portable interchange): `decisions/010-decouple-translator-validation-from-api-access.md`
- Decision 011 — Lookup-first verification registry (registry authoritative, parser fallback, drift hash): `decisions/011-lookup-first-verification-registry.md`
- Epic `td-2456d5`; Phase 1 `td-1e3602`
- Book source of the two errors: `pob/briefs/2026-06-26-staved-finger.md`
