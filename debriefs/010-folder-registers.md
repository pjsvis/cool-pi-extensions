# Debrief: 010 — Auto-maintained JSONL folder registers

**Date:** 2026-07-19
**Status:** Complete
**TD:** td-0c8a0c
**Brief:** [briefs/2026-07-19-brief-folder-registers.md](../briefs/2026-07-19-brief-folder-registers.md)

## What we built

A generator (`scripts/gen-registers.ts` + shared `scripts/register-lib.ts`) emits a `register.jsonl` in each of the six process/content folders (briefs, debriefs, decisions, playbooks, docs, prompts) as a deterministic structural checksum, rolled up into a generated block of `MANIFEST.md` delimited by `<!-- BEGIN/END REGISTERS -->` markers (static API/Models/Source sections preserved verbatim). `scripts/check-manifest.ts` was refactored to verify register↔filesystem and MANIFEST↔registers, with the existing link-resolution and path-drift checks retained. Two `just` recipes: `just registers` (generate), `just check` (gate).

## Architecture decisions that worked

- **Shared library (`register-lib.ts`).** Generator and checker import the same `buildEntries`/`listFiles`/`renderManifestBlock`. They cannot drift apart — the one bug found (path normalisation) was a single fix, not a divergence.
- **Marker-delimited MANIFEST.** Generating only the marked block preserves the curated API/Models/Source sections that `just help`/`just browse` depend on, while auto-maintaining exactly the high-churn folder indexes that had drifted.
- **Deterministic output.** Sorted paths + stable field order → byte-identical across runs (verified by sha256). `git diff` on a committed register IS the structural delta, as designed.
- **Presence as the gate.** Blocking on path-set mismatch (missing/stale) is high-signal, low-noise: it catches add/remove/rename — the real entropy — without churning on every content edit.

## Things we'd do differently

- **The brief said "non-blocking first, flip to blocking once clean."** I implemented presence-blocking immediately. That deviation is the better call — presence is the high-value check and should bite from day one; the caution was over-applied. The genuinely-deferred part is *content/sha* enforcement, not presence. The brief is frozen; this debrief records the deviation.
- **The path-normalisation bug** (`listFiles` returns absolute paths; my first checker compared them to relative register paths) fired the gate on the very first run with 121 false "missing" reports. Caught immediately because the gate ran — dogfooding worked. A unit test or a dry-run mode would have caught it before the noisy output, but the cost was one edit.

## Design principles validated

- **Shannon/Derrida separation.** The register checksums *structure* (presence, path, sha); *substance* is explicitly the Derrida Question's wall. The register faithfully surfaced brief 002's internal mis-title ("debrief:" in a briefs/ file) — and correctly did nothing about it. That's a content item, not a structural one.
- **Generated, not hand-written.** The old `MANIFEST.md` was 13 files behind reality with a checker that didn't bite. A generated register cannot drift in content — only in freshness — and a blocking gate makes staleness loud. The entropy was a broken feedback loop, not a missing artifact. Systems over villains.
- **Replace, don't layer (Decision 009).** `check-manifest.ts` was refactored to key on registers, not on parsing markdown links out of a hand-maintained MANIFEST. No old/new coexistence.

## Files changed

| File | Purpose |
|---|---|
| `scripts/register-lib.ts` | Shared core: REGISTERED set, walk, buildEntries, renderers (new) |
| `scripts/gen-registers.ts` | Thin generator CLI → register.jsonl + MANIFEST block (new) |
| `scripts/check-manifest.ts` | Refactored: register↔fs + MANIFEST↔registers gate (modified) |
| `justfile` | `just registers` / `just check` recipes (modified) |
| `MANIFEST.md` | Restructured: markers + generated block; static sections preserved (modified) |
| `{briefs,debriefs,decisions,playbooks,docs,prompts}/register.jsonl` | The six registers (new) |

## Next steps

- **Content/sha enforcement (deferred).** `sha` is informational in v1 (visible in `git diff`, not enforced). Promote to blocking if content-level drift becomes a concern — same non-blocking→blocking pattern as `semantic-integrity.ts`.
- **Pre-existing phantom cluster.** `just popper` still reports the `just dev`/`just msgs-*` family and briefs referencing unbuilt scripts. That's `td-24b40f`, untouched by this movement — the next hygiene target.
- **Scope expansion (optional).** `blog`, `data`, `src`, `models` are excluded by design (content; git is their register). Add to `REGISTERED` if an index is ever wanted.
