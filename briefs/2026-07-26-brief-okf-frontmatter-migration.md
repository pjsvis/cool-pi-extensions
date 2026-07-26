---
type: brief
description: Migrate the six registered knowledge folders to OKF v0.2 frontmatter; freeze schema, type vocab, gate flip plan, and replace-vs-coexist.
status: in-progress
timestamp: 2026-07-26
td: td-7b6128
---

# Brief: OKF Frontmatter Migration — schema & decisions (Phase 0)

## What

Freeze, before any file is migrated, the decisions that govern the epic
`td-e4dcf4` (OKF frontmatter migration across the six registered knowledge
folders: `briefs`, `debriefs`, `decisions`, `playbooks`, `docs`,
`prompts`). This brief is the artifact the Phase 1 review gate checks
against. It is frozen when work starts; later phases cite it, they do not
re-litigate it. Deviations get recorded in the Phase 4 debrief, not folded
back into the brief.

The decisions: (0) OKF version target; (1) field set and required-levels;
(2) `description` vs `dek`; (3) `type` vocabulary per folder; (4)
gate-extension plan — how `check-manifest.ts` requires frontmatter
presence, folder-by-folder flip to blocking; (5) replace the prose
`Status`/`Date`/`TD` blocks with frontmatter, or coexist.

## Why

`register-lib.ts` is already frontmatter-aware (`parseFrontmatter` exists;
`extractTitle`/`extractStatus`/`extractDescription` check frontmatter first,
prose second), but the awareness is dormant: **1 of 125 registered `.md`
files starts with `---` frontmatter.** Every description in every
`register.jsonl` is auto-extracted prose — the first non-heading,
non-metadata line, clipped to 140 chars. That is noise, not signal: the
register's description column was designed to carry an authored one-liner
and instead carries whatever sentence happened to follow the H1.

The migration's purpose is not "add frontmatter." It is to make the
register's description column say something a human wrote. Frontmatter is
the mechanism; authored descriptions are the value. OKF conformance (`type`
required) is the discipline that forces the mechanism to land uniformly.
The register then becomes a deterministic function of authored metadata
rather than of prose archaeology.

This is the Shannon/Derrida line restated: the register checksums
*structure* (presence, `type`, `sha`); the authored `description` is
*substance* the operator writes and the register faithfully surfaces.
Substance was always the Derrida Question's wall; this migration does not
move the wall, it makes the operator stand on the right side of it.

## How

### Terminology — what OKF is

**OKF = Open Knowledge Format.** An open, vendor-neutral spec by Google
Cloud (Sam McVeety, Amir Hormati) that formalises Karpathy's LLM-wiki
pattern into "a directory of markdown files with YAML frontmatter." Two
versions matter:

- **v0.1** (announced 2026-06-12, [blog][okf-blog]) — six frontmatter
  fields: `type`, `title`, `description`, `resource`, `tags`, `timestamp`.
  Conformance: every `.md` has parseable frontmatter with a non-empty
  `type`. Everything else is producer-defined.
- **v0.2** ([SPEC.md][okf-spec], current) — supersedes v0.1. Makes
  provenance/trust/lifecycle first-class: `generated`/`verified` (trust),
  `sources` (provenance), `status`/`stale_after` (lifecycle), and the
  `Attested Computation` concept. **Breaking (§13.1):** `timestamp` is
  superseded by `generated.at`; the body `# Citations` list by `sources`.
  Conformance is unchanged: `type` required + parseable frontmatter (§11).

The spec's defining principle (both versions): *"OKF requires exactly one
thing of every concept: a type field. Everything else … is left to the
producer."* Type values are not registered centrally; producers pick
descriptive values and consumers tolerate unknowns.

[okf-blog]: https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing
[okf-spec]: https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md

### Decision 0 — Version target: v0.2, flat-field subset, trust fields deferred

**Target OKF v0.2** (the current spec; v0.1 is superseded). Adopt the
**flat-scalar subset** of v0.2 fields that relocates existing prose
metadata. **Defer v0.2's nested trust/provenance families** to a dedicated
follow-up epic.

The decisive constraint: `generated` (v0.2's replacement for `timestamp`)
is a nested object, and **`generated.by` is REQUIRED within `generated`
(§5.2)**. The repo's existing prose carries a date (`**Date:**`/
`**Created:**`/`**Saved:**`) but **no authorship record** for 125 files.
Adopting `generated` now would force inventing a `by` actor for every file
— a provenance-authoring project, not a metadata-relocation. It also
requires upgrading `parseFrontmatter` to parse nested YAML (the repo has no
YAML library and no `package.json`; the parser is a flat regex). Both costs
belong to a trust-system epic, not a hygiene migration.

So the date is captured as **`timestamp` — a v0.1 legacy field explicitly
tolerated under v0.2** (§13.1: "Consumers MAY fall back to a legacy
`timestamp` when `generated` is absent"). This is v0.2-conformant (§11
conformance only requires `type`), needs no parser change, and relocates
the date without inventing provenance. The brief records `timestamp` as
**legacy-retained**, not final: a future "OKF v0.2 trust fields" epic
migrates `timestamp` → `generated.at` (with a real `by`) and adopts
`verified` for review gates. That migration is a genuine direction change
(trust system) with its own delineation — not the barnacle pattern, because
this brief never claims `timestamp` is the v0.2-idiomatic form.

This is **not** a Decision 009 (no old/new coexistence) violation.
`timestamp` is a v0.2-*sanctioned* legacy field, not a competing canonical
direction. There is one canonical metadata location (frontmatter) and one
target spec (v0.2); `timestamp` is a supported legacy form within it.

| v0.2 field / family | Status in this epic | Reason |
|---|---|---|
| `type` | **adopt, required** | v0.2's one binding requirement (§11) |
| `description` | **adopt, required** | repo tightening; v0.2 only recommends it |
| `resource` | **adopt, optional** | flat scalar; `docs/` imported articles carry `**Source:**` URLs |
| `status` | **adopt, optional** | v0.2 §5.4 field; values as-is; vocab reconciliation deferred (see Decision 1) |
| `timestamp` | **adopt, optional (legacy)** | v0.1 field, v0.2-tolerated (§13.1); date relocation without provenance |
| `title` | **omit** | H1 carries it; v0.2 lets consumers derive title from filename/H1 |
| `tags` | **defer** | folders are the primary taxonomy; a cross-cutting tag scheme is a separate substance decision |
| `generated` / `verified` | **defer** | nested; `generated.by` required (§5.2); needs parser upgrade + provenance authoring → trust-fields epic |
| `sources` | **defer** | nested provenance with credibility signals → trust-fields epic; lineage already expressed via markdown links (§5.1) |
| `stale_after` | **defer** | candidate for decisions' review dates (Decision 009: "Review: 2026-09-21") → trust-fields epic |
| `Attested Computation` + family | **out of scope** | this repo produces no attestable computations (that's `pi-mathematica-verify`'s territory, if any) |
| `okf_version` | **not adopted** | lives only in a bundle-root `index.md`; we have no `index.md` (register.jsonl is our index) |

### Decision 1 — Field set and required-levels

Building on Decision 0, the adopted frontmatter set:

| Field | Tier | Required | In register `Entry` | Source |
|-------|------|----------|---------------------|--------|
| `type` | OKF core | **yes (gate)** | yes — `type: string` | folder canonical token (Decision 3) |
| `description` | OKF core | **yes (gate)** | yes — replaces auto-extract | authored one-liner, ≤140 chars |
| `status` | OKF §5.4 lifecycle | no | yes — `status?: string` (already present) | prose `**Status:**`; values as-is |
| `timestamp` | OKF legacy (§13.1) | no | yes — `timestamp?: string` | ISO 8601 date or datetime; replaces `**Date:**`/`**Created:**`/`**Saved:**` |
| `resource` | OKF recommended | no | no — frontmatter-only | URI; `docs/` `**Source:**` URLs |
| `td` | repo-local auxiliary | no | no | task cross-ref (`td-xxxxx`); replaces `**TD:**`/`**TD Epic:**` |
| *(other)* | repo-local auxiliary | no | no | file-specific (e.g. `lesson_cost`); preserved as-is |

Required-level rationale:

- **`type` required** — non-negotiable; v0.2's one binding requirement (§11).
- **`description` required** — the migration has no point if it stays
  optional; the noise persists. v0.2 only *recommends* `description` (§4.1);
  requiring it is a **repo tightening** beyond the spec, justified because
  authored descriptions are the epic's entire value. The gate enforces
  presence; substance is the operator's job.
- **`status` optional** — not every folder has a meaningful lifecycle
  (`docs/`, `prompts/` largely don't). Extracted when present. **Status
  vocabulary reconciliation is explicitly out of scope** (see below).
- **`timestamp` optional** — some docs are living documents with no
  meaningful single timestamp (e.g. `docs/bestiary.md`). Forcing one
  produces fiction. Extracted when present; ISO 8601. The one existing
  frontmatter file uses `date`; Phase 2 migrates `date` → `timestamp` (no
  alias kept — one file, one phase, not worth a shim).
- **`resource` optional, frontmatter-only** — not surfaced in the register
  (a URL per row would bloat it). Phase 3 populates it for `docs/` from
  `**Source:**` lines.

**Status vocabulary conflict (deferred).** v0.2 §5.4 defines `status` as
`draft | stable | deprecated` (absent ⇒ `stable`) — a *consumption-readiness*
axis. The repo's current values (`Complete`, `in-progress`, `Accepted`,
`Proposed`, `done`, `parked`) are *workflow* states — a different axis.
This epic **relocates** the existing values into `status` without
reconciling them to v0.2's vocab. The result is conformant (§11 does not
enforce the §5.4 vocabulary; producers MAY extend), but semantically uses a
spec field for a non-spec axis. Reconciliation — whether to map
(in-progress→draft, Complete/Accepted→stable, parked→deprecated), split into
two fields (`status` + `workflow`), or keep as-is — is a **substance
decision for a later record**, deliberately out of scope here. The register
keeps keying on `status` (no rename, no churn).

`title` is **skipped**. v0.2 recommends it but lets consumers derive a
title from the filename; our H1 already carries it and the extractor falls
back to H1. Adding `title` to frontmatter would duplicate the H1 — entropy.

### Decision 2 — `description` vs `dek`

**Canonical field: `description`** — the v0.2-recommended field name (§4.1).
The extractor is flipped to prefer `description` over `dek`.

`dek` is **retained as a read-only alias**, ordered *after* `description`:

```ts
if (fm.description) return clip(fm.description);
if (fm.dek) return clip(fm.dek);   // alias: blog/ convention; blog is unregistered
// prose fallback — removed in Phase 4
```

Rationale: `dek` is live in `blog/` (12+ files), but `blog/` is **excluded**
from registers ("content, not process; git is their register"). Zero
registered files currently use `dek`. Dropping `dek` entirely (the pure
Decision 009 read) would pre-commit an unregistered, out-of-scope folder to
a future migration. Keeping it as a one-line fallback, demoted below the
canonical name, costs nothing and leaves `blog/` untouched. If `blog/` is
ever registered (debrief 010 flags it as optional scope expansion), its
migration swaps `dek` → `description` then; the alias is removed at that
point or at Phase 4 review, whichever comes first.

This is the one place this epic keeps an old name alongside the new. It is
a read-only alias for an *unregistered* folder's convention, not a
coexistence of canonical references — Decision 009's invariant (no old and
new both referenced as canonical) is not violated: `description` is the
canonical name; `dek` is a tolerance.

### Decision 3 — `type` vocabulary per folder

**Lowercase singular, matching the folder name.** One token per folder,
1:1 with the directory:

| Folder | `type` value |
|--------|--------------|
| `briefs/` | `brief` |
| `debriefs/` | `debrief` |
| `decisions/` | `decision` |
| `playbooks/` | `playbook` |
| `docs/` | `doc` |
| `prompts/` | `prompt` |

Rationale: v0.2 §4.1 — *"Type values are not registered centrally. Producers
SHOULD pick values that are descriptive and self-explanatory; consumers
MUST tolerate unknown types gracefully."* Our per-folder tokens are a
producer choice the spec explicitly permits. Lowercase matches the one
existing frontmatter instance (`type: brief` in
`briefs/2026-07-18-brief-session-newup-discipline.md`); lowercase is the
YAML convention for classification tokens; 1:1 with the folder name is
zero-ambiguity and lets the gate assert `type === canonicalType(dir)`. The
alternatives offer nothing the path doesn't already carry — a capitalized
`Brief` diverges from the existing instance for no gain; a flatter scheme
(all `type: doc`) discards the folder signal that is already load-bearing
in the path and in every playbook.

### Decision 4 — Gate-extension plan (folder-by-folder flip)

`check-manifest.ts` gains one new check and one new enable-list. The flip is
one array edit per phase.

**New enable-list** (top of `check-manifest.ts`):

```ts
// Folders whose .md files must carry OKF v0.2 frontmatter (type + description).
// Grows one folder per phase; Phase 4 removes the list (all six required).
const FRONTMATTER_REQUIRED = ["debriefs"];   // Phase 1
```

**New check** (`checkFrontmatter()`):

For each folder in `FRONTMATTER_REQUIRED`, for each `.md` file (`.md` only —
`prompts/*.json` fixtures are excluded; they keep their own JSON field
extraction), verify:

1. the file starts with `---` frontmatter (parseable by `parseFrontmatter`);
2. frontmatter contains a non-empty `type` — **this is the v0.2 §11 conformance check**;
3. frontmatter contains `description` — **this is the repo tightening beyond v0.2**;
4. `type` value equals the folder's canonical token (Decision 3).

Errors (exit 1, same pattern as `checkRegisters`):

```
debriefs/003-protocol-evals.md: missing frontmatter — run migration
debriefs/003-protocol-evals.md: frontmatter missing required field 'type'
debriefs/003-protocol-evals.md: frontmatter missing required field 'description'
debriefs/003-protocol-evals.md: type 'Debrief' should be 'debrief'
```

Note the tier split in the errors: `type`-missing is an OKF **conformance**
failure; `description`-missing is a **repo policy** failure (v0.2 would
accept the file). Keeping the distinction in the message keeps the gate
honest about which rule is biting.

**Phase progression of `FRONTMATTER_REQUIRED`:**

| Phase | Folders required | Also this phase |
|-------|------------------|-----------------|
| 1 (pilot, `debriefs/`) | `["debriefs"]` | add `type`/`timestamp` to `Entry` + extractors; add `extractResource`; flip `description` > `dek` order; migrate 8 debrief files; regen register |
| 2 (load-bearing) | `+ ["decisions", "briefs"]` | migrate `decisions/` (17) + `briefs/` (44); migrate the one existing `date`→`timestamp` |
| 3 (remaining) | `+ ["docs", "playbooks", "prompts"]` | migrate `docs/` (28, populate `resource` from `**Source:**`) + `playbooks/` (25) + `prompts/` (.md only, 3) |
| 4 (close-out) | list removed — all six required | remove prose fallback from `register-lib.ts`; review `dek` alias; update playbooks; debrief |

Each phase is one array edit + the file migrations + `just registers`. The
gate bites on the migrated folder from the moment the array includes it.
This is the same non-blocking→blocking pattern `debrief 010` endorsed for
content/sha enforcement — presence first, folder-by-folder, committed
close-out.

### Decision 5 — Replace vs coexist (the Decision 009 read)

**Per-file: replace, atomically.** When a file is migrated, frontmatter is
added **and** the prose `**Date:**`/`**Status:**`/`**TD:**` block is removed
in the same edit. No file ever carries both. This is the invariant that
keeps the migration honest — a half-migrated file is a barnacle (Decision
009: old/new coexistence).

**Repo-level during migration: coexist with a committed close-out.**
`register-lib.ts` keeps its prose fallback (`extractStatus` regex,
`extractDescription` prose scan) for unmigrated folders until Phase 4. This
is a **transition shim**, not canonical coexistence: the canonical metadata
location is frontmatter from Phase 1 onward; the prose scan is a read-only
fallback for folders not yet flipped. Phase 4 removes the fallback — that
is the committed delineation. Removing it earlier would break trunk
(unmigrated folders would lose description extraction).

This matches the pattern `debrief 010` already endorsed: the genuinely
deferred part is the fallback removal (Phase 4), not the per-file
replacement (Phase 1). The brief for the registers epic said "non-blocking
first, flip to blocking once clean"; the debrief recorded that
presence-blocking was implemented immediately because presence is the
high-value check. The same applies here: per-file replacement bites from
Phase 1; the fallback is the deferred part, with Phase 4 as the
no-coexistence close-out.

### `register-lib.ts` changes (landed in Phase 1, stable thereafter)

All adopted fields are **flat scalars** — no parser upgrade needed (the
repo has no YAML library; `parseFrontmatter` is a flat regex and stays so).
The v0.2 nested families are deferred precisely so this stays true.

1. **`Entry` interface** — add `type: string` (required) and `timestamp?: string` (optional). New construction order, so the JSONL stays deterministic and the diff is readable:

   ```
   path, type, title, description, status?, timestamp?, sha, bytes
   ```

   (Identity → lifecycle → checksum. Current order is `path, title, description, sha, bytes, status?`; the regrouping is a one-time churn accepted in Phase 1.)

2. **`extractType(text, dir)`** — new. Returns `fm.type` or `undefined`. The gate enforces presence and correctness; the extractor reads.

3. **`extractDescription`** — flip order: `fm.description` first, `fm.dek` second (Decision 2), prose third (removed Phase 4).

4. **`extractTimestamp(text)`** — new. Returns `fm.timestamp` or `undefined`. No `date` alias (Decision 1).

5. **`extractResource(text)`** — new. Returns `fm.resource` or `undefined`. Frontmatter-only (not in `Entry`), but extracted so Phase 3 can verify `docs/` source URLs migrated correctly.

6. **`buildEntries`** — populate `entry.type` and `entry.timestamp`.

`check-manifest.ts` changes: the `checkFrontmatter()` function and
`FRONTMATTER_REQUIRED` list above. No other checks touched.

### `.json` fixtures in `prompts/`

Six `.json` files in `prompts/` are registered (`extensionsFor` returns
`.md` + `.json` for `prompts/`). JSON cannot carry YAML frontmatter. The
frontmatter gate is `.md`-only. `type` is not enforced on JSON fixtures;
they keep their existing `extractTitle`/`extractDescription` JSON paths
(title/name/fixture_name; description/dek). When `prompts/` is flipped in
Phase 3, only its three `.md` files are gated. This is stated here so Phase
3 doesn't rediscover it.

## Acceptance criteria

- [ ] This brief is frozen (status `in-progress`, committed) before Phase 1
      work begins. ← the artifact the review gate checks against.
- [ ] The version target (v0.2, flat subset, trust fields deferred) and the
      five decisions are cited, not re-litigated, in Phases 1–4.
- [ ] Phase 1 lands `Entry.type` + `Entry.timestamp?`, the extractor flips,
      `extractResource`, and `checkFrontmatter()` with
      `FRONTMATTER_REQUIRED = ["debriefs"]` — **with no parser upgrade**
      (all adopted fields flat).
- [ ] After Phase 1, every line in `debriefs/register.jsonl` has an authored
      `description` (no auto-extracted prose) and a `type: "debrief"`. This
      is the success metric for the pilot.
- [ ] Phase 4 removes the prose fallback from `register-lib.ts` and the
      `FRONTMATTER_REQUIRED` list (all six required by default). No
      per-file prose/​frontmatter coexistence survives.

## Out of scope

- **v0.2 trust/provenance/attestation families** (`generated`, `verified`,
  `sources`, `stale_after`, `Attested Computation`) — a dedicated
  trust-fields epic; requires a parser upgrade and provenance authoring.
- **`timestamp` → `generated.at` migration** — deferred to that same epic;
  `timestamp` is legacy-retained here under v0.2 §13.1.
- **`tags` adoption** — folders are the taxonomy; a cross-cutting tag scheme
  is a separate substance decision.
- **Standardising `status` values** to v0.2's `draft|stable|deprecated`
  vocab — substance, not structure; later decision record (Decision 1).
- **`blog/` migration** — excluded folder; `dek` alias kept to avoid
  pre-committing it.
- **OKF `index.md`/`log.md` reserved filenames** — not adopted
  (`register.jsonl` is our structural index; `log.md` has no analogue).
  Compatible with v0.2 (both are optional).
- **Enforcing `description` substance** (is it a good one-liner?) — the
  gate enforces presence; quality is the operator's, surfaced by the
  register, adjudicated by the Derrida Question. Same wall as ever.

## Phasing (maps to td tasks)

| Phase | td task | Folder(s) | Gate flip | Review |
|-------|---------|-----------|-----------|--------|
| 0 | `td-7b6128` (this brief) | — | — | brief frozen |
| 1 | `td-49c61d` | `debriefs/` | `["debriefs"]` | **human review gate** → blocks Phase 2 |
| 2 | `td-813f48` | `decisions/`, `briefs/` | `+ decisions, briefs` | — |
| 3 | `td-47d3cc` | `docs/`, `playbooks/`, `prompts/` (.md) | `+ docs, playbooks, prompts` | — |
| 4 | `td-c64631` | close-out | all six (list removed) | debrief |

New up between phases per the session-newup discipline (`td handoff` →
`/new` → resume from `td context`). The locus tags in the handoff carry
the phase boundary.
