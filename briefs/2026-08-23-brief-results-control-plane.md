# brief: results control plane — operationalise eval data

**Created:** 2026-08-23
**Status:** proposed
**Protocol:** Edinburgh Protocol v1.1.0
**Related:** td-6beccf (in review — canonical regen + digest drill-down; this brief extends its deliverables); registers pattern (`just registers` / `just check`); lexicon: *stuff into things*

## What

Three deliverables + one rename:

1. **`data/results/`** — a generated folder: `index.md` plus one file per
   model (`<slug>.md`, slug derived deterministically from `modelId`).
   A pure function of `data/eval_log.json` + `data/eval_runs.jsonl`.
   Committed to git (data principles: visible, persistent).

2. **Two new recipes.**
   - `just results-gen` — regenerates the folder. Implemented as a write-dir
     mode on `scripts/eval-digest.py` (reuse the table/model/run renderers;
     the read interface never touches the JSONL sources, and a generated-dir
     writer keeps that true).
   - `just results-browse` — `cd data/results && glow`. Glow's no-arg mode is
     an interactive markdown file browser: the human control plane. The agent
     keeps `just results <model>` stdout (greppable, pipeable). Same
     substrate, two projections.

3. **justfile restructure.** Two sections: `[group("user")]` — consumption
   (`default`, `about`, `orient`, `browse`, `read`, `help`, `results`,
   `results-browse`, `suite`, `show-edinburgh`) and `[group("agent")]` —
   production (`eval`, `registers`, `check`, `probe`, `test`, `popper`,
   `registry`, `install-deps`, `adopt-edinburgh`). Every recipe gets a terse
   description, under one line (3–6 words). Drop the sub-group names
   (`discover`/`setup`/`hygiene`/`eval`); `just --list` then shows exactly
   two audiences.

4. **Rename:** `data/eval_log.json` → `eval_log.jsonl`. The file is JSON
   Lines; the extension lies. One-time scripted move + reference updates
   (`eval-digest.py`, `eval.sh`, sit-eval scripts, canonical record,
   data README). July-era scripts that only reference it in an echo may be
   archive candidates instead of edit candidates — prefer archiving.

## Why

- **Shared referent.** "The kimi-k3 results" currently means a digest
  invocation, a canonical-record row, or one of five narrative reports.
  After: one canonical file per model, addressable by both parties. Glow
  makes the tree browsable for the human; the folder makes it addressable
  for the agent. Naming convergence is the point — same topic, same file,
  no confusion.
- **Idempotent by construction, not aspiration.** The folder is derived,
  never hand-edited. Delete it, regen, zero diff. This is the
  generate-verify-commit discipline already proven by registers/MANIFEST,
  applied to eval data.
- **Restartable.** Every step is a pure function of append-only ground
  truth. Crash mid-regen? Run it again.

## How

- **Slug rule:** `modelId` → lowercase, non `[a-z0-9.-]` → `-`, strip
  repeats, `.md`. `moonshotai/kimi-k3` → `moonshotai-kimi-k3.md`. Collision
  check in gen: two modelIds mapping to one slug aborts loudly (fail, don't
  silently merge).
- **Determinism rules:** no wall-clock anywhere in generated output. Dates
  derive from data timestamps only. Stable sort order (modelId). This is
  what makes the zero-diff acceptance test possible.
- **Regen hooks:** tail of `eval.sh` (after log append + canonical splice)
  and a freshness gate in `just check` (stale folder fails check, same as
  manifest drift). Manual `just results-gen` always available.
- **Index content:** the digest table (same renderer as canonical record)
  plus a narratives section linking `../eval-<model>-<date>.md`. Narrative
  reports stay where they are — append-only means don't move them.
- **Citation convention:** `docs/eval-canonical-record.md` remains the
  citation target for cross-model claims; `data/results/<slug>.md` for
  per-model claims (it carries runId → ground truth). The index is
  navigation, not a second canonical. One canonical spliced doc, one
  browsable folder; cite the doc, browse the folder.

## Acceptance criteria

- [ ] `rm -rf data/results && just results-gen` → zero git diff, run twice
- [ ] no wall-clock in generated output; stable across regens
- [ ] slug collision aborts loudly (test with a synthetic collision)
- [ ] `just results-browse` opens glow on the folder; narratives reachable
      from index
- [ ] `just check` fails on a stale results folder; passes after regen
- [ ] eval run leaves folder fresh (eval.sh tail hook)
- [ ] `just --list` shows two groups; every recipe described, under one line
- [ ] rename complete: no dangling `eval_log.json` references in live files
- [ ] registers + manifest green

## Open details

- **Glow recursion:** verify whether glow's browser enters subdirectories.
  If not, `cd data && glow` shows narratives at top level and results/ as a
  directory entry — pick browse root after testing.
- **td sequencing:** td-6beccf is in review and overlaps (results recipes).
  Review it first, or fold its review into this work's review. Don't build
  on an unreviewed base.

## Opinion (recorded)

Endorse. This is the registers pattern applied to eval data, and glow as
control plane is the right cheap move — one TUI, zero new infrastructure,
a place for the human to stand. Three amendments, all folded into the design
above:

1. **Derived, not source.** The folder's authority is zero; the JSONL is
   everything. That inverts the usual "results document" failure (a doc that
   drifts from data and becomes the de-facto lie). Zero-diff regen is the
   test that keeps it honest.
2. **Split projections, not people.** User/agent sections are a reading
   order for `just --list`, not a permission system. Most recipes serve
   both; don't duplicate per audience. The genuine split is projection:
   glow for eyes, stdout for pipes.
3. **One canonical.** The temptation is to make the index The Document.
   Resist. Canonical record for citations, folder for browsing, narratives
   for judgement. Three artifacts, three jobs, one ground truth.
