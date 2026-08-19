# brief: trial-ledger — bounded accumulation across installer ecosystems

**Created:** 2026-08-18
**Status:** shipped — snapshot + review scripts live; td recurring task `td-d2f4cc` deferred to 2026-09-17; weekly launchd job loaded and verified. Review process **untested** — first real pass is the acceptance gate.
**Protocol:** Edinburgh Protocol v1.1.0
**Related:** lexicon: *stuff into things*, *predictably adequate*, *pizza shop* vs. *chip pan fire*; prior parked brief `2026-07-12-token-compaction-hook.md` (same "lightweight marker, no substrate" ethos)

## What

A plain-text trial register that enumerates every installer ecosystem on the machine (brew formulae/casks, npm global, pipx, cargo, go bin, `~/.local/bin`, bun bin, `/Applications`), tags new installs as `trial` with a first-seen date, and drives a monthly keep/cut/skip review. Lives in `~/.pi/trial-ledger/`. No daemon, no database.

## Why

The spice-edit failure mode: try a tool → it proves useless → it sits in a tap for six months because **nothing ever forces the keep/cut decision**. Installation is passive; removal is active — that asymmetry is the accumulation engine. The fix is not a "what's unused?" detector (Hume's Razor: atime/dependency signals on macOS APFS are unreliable, and building one is benchmaxxing on an unmeasurable metric). The fix is a **discard gate with expiry**: try freely, but every trial surfaces for review after 30 days. Bounded accumulation, not prevention — the goal is experimentation without guilt + cleanup without effort.

## How

Three parts, all plain shell:

1. **`snapshot.sh`** — enumerates 9 ecosystems, writes raw
   `snapshots/YYYY-MM-DD.tsv`, reconciles `state.tsv` (new → `trial`; vanished →
   `gone`). Idempotent. Runs weekly via launchd
   (`local.petersmith.trial-ledger-snapshot.plist`, Sunday 09:00) so the ledger
   stays fresh between reviews.

2. **`review.sh`** — surfaces `trial` items aged ≥ N days (default 30), walks
   keep/cut/skip per item, and **prints the correct uninstall command for
   whichever installer owns the item** (`brew uninstall` / `npm uninstall -g` /
   `cargo uninstall` / `pipx uninstall` / `rm -i`). That map is the whole point:
   the user never faces "which installer did I use?" Cut commands collect into a
   block, executed with one `y/N`. On exit, rolls the td task forward +30d.

3. **td task `td-d2f4cc`** ("Monthly trial-ledger review", label `trial-review`)
   — deferred, surfaces monthly, re-deferred by `review.sh` after each pass. The
   discipline anchor.

State columns: `ecosystem \t item \t first_seen \t status \t last_seen`. Status ∈ {`trial`, `keep`, `cut`, `gone`}. Skipped items stay `trial` and re-surface — no quiet decay.

## Acceptance criteria

- [x] snapshot enumerates all 9 ecosystems (496 items captured on first run)

- [x] snapshot reconciles state idempotently (second run marked 8 cuts as `gone`
  unprompted)

- [x] review.sh surfaces only trials ≥ threshold; prints per-ecosystem uninstall
  commands

- [x] review.sh rolls td task forward +30d on completion (verified: lookup uses
  `--deferred` + space-tolerant JSON regex)

- [x] weekly launchd job runs clean under launchd's real minimal environment
  (bash 5 path pinned, `OBJC_DISABLE_INITIALIZE_FORK_SAFETY=YES`, PATH set)

- [ ] **review.sh run end-to-end against real aged trials** — the open gate.
  First eligible items hit 30d around 2026-09-17. Run `review.sh 7` sooner to
  exercise the loop on week-old trials.

- [ ] first monthly pass completes and the task rolls forward as expected

## Out of scope

- **No "unused" detector** — atime/last-launched heuristics. Unmeasurable
  cleanly on macOS; would be entropy, not anti-entropy. Human judgment at the
  review is the only filter.

- **No auto-delete.** Cut commands print and ask `y/N`. The script sorts; the
  human executes.

- **No system-app filter** for `/Applications`. 152 entries include Apple's own
  — the user decides at review. Building a detector is the rabbit hole.

- **No database.** Plain TSV, diffable and greppable. A DB here is ceremony.

- **No daemon.** Weekly launchd job fires and exits. A long-running watcher is
  the chip-pan-fire path.

## Process notes (the reusable parts)

- **launchd's PATH is minimal** — `/usr/bin/env bash` resolves to system bash
  3.2 (no associative arrays), and brew's Ruby segfaults under fork without
  `OBJC_DISABLE_INITIALIZE_FORK_SAFETY=YES`. Any future launchd job calling
  brew/Apple-framework tools needs an explicit `EnvironmentVariables` block. Pin
  the bash 5 path (`/opt/local/bin/bash` here) in both shebang and plist.

- **The ledger proved itself on first run** — it caught today's 8 cuts (`cmux`,
  `spice-edit`, `node@22`, `the_silver_searcher`, etc.) as `gone` without being
  told. Capture works; nothing slips unseen.

- **td has no native recurring** — `--defer` + a label-lookup + roll-forward in
  the review script is the "sits there and waits" pattern. `td list --deferred`
  is required to surface deferred tasks; default `td list` hides them.
