# Playbook: Changelog & Development Process (the Marcus Method)

## Purpose

How to run a solo/small-team, agent-assisted development process where the changelog is the experimental record, not marketing. Distilled from `marcus/td` (v0.44→v0.60) and `marcus/sidecar` (v0.98→v1.1) — two repos whose changelogs read like lab notebooks: wrong hypotheses recorded next to right ones, refuted theories kept as first-class knowledge.

The premise: a changelog written for the next maintainer (human or agent) is an anti-entropy instrument. A changelog written for a release tweet is decoration.

## The practices

### 1. Record the refuted hypothesis next to the fix

td v0.60.0's headline sync fix: *"The root cause was a peer replaying its own events from a cursor suffix, not the cross-peer delete race originally suspected."* The wrong diagnosis is in the permanent record, with the same weight as the right one. This is Hume applied to engineering: the ledger of refuted theories is half the knowledge, and re-litigating a settled root cause is the most expensive loop a solo project can run.

**Rule:** when the second hypothesis wins, the changelog names the first one and why it lost.

### 2. Second recurrence of a class = change the shape of the fix

td's pattern, repeated three times: bug fixed at a call site → recurs at a second call site → fix moves to the single funnel / global invariant (see `sqlite-playbook.md` §6, and the claim-release fix that survived three rounds of site-by-site patching before moving into the one mutation funnel every write passes through). The changelog says it outright: *"patching sites individually is how the bug survived three rounds."*

**Rule:** first occurrence — fix it. Second occurrence — stop, find the class, fix it where the class lives (a funnel, an invariant test, or deleting the surface entirely).

### 3. Fix the *class*, and when possible delete the surface

Sidecar's shells.json corruption: fixed not by better locking but by refusing to treat absence-as-death when discovery was partial. Sidecar's notes DB access: fixed by deleting in-process DB access in favour of td's public API. The recurring shape: *don't patch the race; remove the surface the race lives on.* That's the difference between a fix and an apology.

### 4. Name what failed; never count it

td v0.55: `TestPartitionRecovery` had been failing deterministically across three sessions while its assertion printed `alice has 24 lines, bob has 25 lines` — noise, dismissed as flake. Convergence failures now print the symmetric difference of the actual rows so the failing row names itself. A test that reports a count is a test that gets ignored.

**Rule:** every failure output must identify the specific thing that failed. `N failures` is a bug in the test harness.

### 5. Fail closed at the process edges

td v0.57's release tooling: `make release` fails on a missing changelog entry or non-green CI — "both were previously only things to remember." Tests are isolated from the developer's shell environment *by construction* (feature gates become function parameters, not ambient env), because the test that passes in CI and fails locally "is the inversion that costs the most trust."

**Rule:** anything that was "a thing to remember" becomes a machine check. A check that depends on the ambient environment isn't a check.

### 6. State the contract, including the break

td v0.55's stdout/stderr change is the model entry: the fix, the *reason* ("stdout is the command's result, stderr is everything said about the command"), the exact behavioural delta with a before/after shell transcript, the explicit **"This changes the contract for existing scripts"** warning naming the caller patterns that break, and the anti-pattern restated ("do not merge the streams with `2>&1` before parsing `--json`"). Breaking changes get their own documentation of the migration path.

**Rule:** a behavioural change ships with the caller's migration path, not just the maintainer's rationale.

### 7. Publish the known limitations

td v0.54 ships a **Known limitations** section: titles are still unsanitized, the monitor's activity feed isn't. What is *not* fixed is documented alongside what is — in the same release. This converts untracked debt into tracked debt and protects the next session from assuming more than was delivered.

**Rule:** every release entry may end with what it deliberately left broken, and why.

### 8. Attribution honesty in the process itself

td v0.54's `--reviewed-by` change was driven by an observed agent behaviour: models *balk* at being forced to write false review records, correctly, and the work stalls. The design response wasn't to force the attestation — it was to make the honest path the easy path (`--self-review` exists; `--reviewed-by` records truth; naming a reviewer who didn't review is documented as *worse* than an honest self-review because it reads as independent in the audit trail). The process is designed for the agents that actually run it, with honesty as the load-bearing element.

**Rule:** when your process participants are honest actors (human or model), design the record so honesty is cheap and forgery is visibly distinguishable. A process that forces false records will be quietly sabotaged by its best participants.

### 9. The changelog entry is the unit of work, not an afterthought

Every fix above reads as written-while-investigating: it carries the repro, the root cause, the mechanism, the guard, and the trade-off admitted in prose. Entries cite their tracking ids (`td-xxxxx`) and cross-reference the invariant test that now guards the class. The consequence: `make release` can *fail* on a missing entry, because the entry is the deliverable.

**Rule:** write the changelog entry at diagnosis, not at tag time. It's the compression of the investigation — the `td handoff` of the commit.

## Applying it here

Our briefs/debriefs system is the same species — compressed investigation records for future contexts. The deltas worth adopting from Marcus:

- **Refuted hypotheses belong in the record** — our briefs should name the wrong
  diagnosis that lost, not just the winner.

- **Second recurrence triggers shape-change** — our default should be
  funnel-or-invariant, not another site patch.

- **Known-limitations sections on our own deliverables** — what we left broken,
  stated at delivery.

- **Failure output names the failing thing** — applies to our eval harness first.

## Related

- `playbooks/sqlite-playbook.md` — the technical half of the same corpus

- `playbooks/briefs-playbook.md`, `playbooks/debriefs-playbook.md` — our native
  record-keeping instruments

- `briefs/011-build-from-source.md` — prior td-derived practice
