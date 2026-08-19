# Playbook: SQLite Management (the td Corpus)

## Purpose

The discipline for any stateful tool we build on SQLite — the eval harness being the likely first candidate. Distilled from `marcus/td` v0.44.0→v0.60.0 (2026-04→2026-08), one of the best-documented SQLite hardening arcs in the wild. td is a single-user, local, agent-driven task database: mixed process lifetimes (long-lived embedded monitor in sidecar + bursty short-lived CLI calls) writing one file. That topology generated every classic failure — and every fix below is proven, not theoretical.

The meta-principle first: **measure which failure mode you actually own, then buy immunity to that one and rent nothing else.** td's workload had no throughput problem and a weekly corruption problem, so its whole arc *removes* concurrency (one connection, one writer, one journal mode, one lock) until the observed failure becomes structurally impossible. Conventional wisdom optimizes for the failure the documentation warns about. Marcus optimized for the failure he had.

## The principles

| # | Principle | td provenance |
|---|---|---|
| 1 | One connection opener is policy | v0.44 — `OpenSQLite` |
| 2 | Sell an API, not a file | v0.58 + sidecar 1.0 — `pkg/notes` |
| 3 | Best practices are hypotheses about someone else's workload | v0.59 — WAL removed |
| 4 | Prevent / tolerate / repair / test — all four, every time | v0.51.2 — timestamp corruption |
| 5 | Enable constraints *after* cleaning the data | v0.44 — FK enforcement |
| 6 | Invariant tests, not call-site tests | v0.55/v0.56 — `TestActionLogReconstructsEveryIssue` |
| 7 | Lock economics: one acquisition, guarded writes | v0.55 — the claim sweep |
| 8 | Classify failures; never discard silently | v0.60 — `sync_skipped_events` |

### 1. One connection opener is policy, not convenience

Every database open — CLI, API server, event store, snapshot store — goes through one function that applies the pragmas (`busy_timeout`, `synchronous`, `foreign_keys`) and pins `MaxOpenConns=1`. Connection configuration is not a per-call-site concern: the moment two paths open the same file differently, you have two databases pretending to be one.

**Rule:** one opener, one write funnel, no exceptions — including for embedders.

### 2. If a second consumer needs your database, sell it an API, not a file

Sidecar's Notes plugin originally held its own connection to `issues.db`. The eventual fix: td published a public `pkg/notes` API (v0.58) that routes through the *same* `withWriteLock` + audit-log funnel as the CLI, and sidecar deleted its direct database access entirely (sidecar 1.0). A shared database file is an undocumented ABI; every new opener is a new conspirator against the invariant. This is single-writer implemented as **topology, not convention**.

**Rule:** embedders get a library API that shares the write path. Never hand out the file path.

### 3. Best-practice recommendations are hypotheses about someone else's workload

WAL is what every blog post prescribes. It corrupted td's database five times in two days — modernc's pure-Go driver couldn't coordinate WAL shared memory across mixed connection lifetimes, producing 0-byte `-wal` files and `database disk image is malformed`. The fix was not tighter locking discipline; it was **deleting the unearned feature**: TRUNCATE rollback-journal mode, which has no `-shm`/`-wal` surface to race on. The lost reader-concurrency was throughput td never used; the corruption was a failure td had daily.

You cannot architect your way out of a broken driver layer. Empirical root cause → mechanical fix.

**Rule:** when "recommended" and "observed" disagree, trust the observation. Ask what the recommendation assumes that your workload doesn't have.

### 4. Prevent, tolerate, repair, test — all four, every time

The v0.51.2 timestamp corruption fix is the model:
- **Prevent** — open the DB with the canonical serialization format
  (`_time_format` DSN param) so writes round-trip.

- **Tolerate** — a lenient scanner degrades gracefully (fall back to a safe
  default) instead of failing the whole lookup when it meets a legacy value.

- **Repair** — an idempotent migration normalizes already-corrupted rows,
  reaching even server-side databases on open. Non-idempotent repair is a second
  corruption event, because migrations in the wild run more than once.

- **Test** — round-trip regression so the class can't recur silently.

Most fixes ship one of the four. Ship all four.

### 5. Enable constraints after cleaning the data

td declared ~12 FK relationships but never enforced them. When enforcement landed (v0.44), the migration first cleaned pre-existing orphan rows, *then* enabled constraints, *then* added schema-level `ON DELETE CASCADE`. Otherwise the schema change wedges on arrival.

**Rule:** the sequence is repair → constrain → verify. Never constrain onto dirty data.

### 6. Global invariant tests, not call-site tests

The same class of bug — a row written without its audit-log entry — was fixed once, recurred at a second producer, and only *stayed* fixed when the test changed shape: drive a broad stream of ordinary mutations, then assert **every row in every syncable table has its create-style log entry**. A per-site test only catches the producers someone remembered to check. An invariant test catches the one you didn't.

**Rule:** second recurrence of a class = stop patching sites. Write the invariant test and (usually) collapse the paths into one funnel so there's nothing left to forget.

### 7. Lock economics: one acquisition, guarded writes

An 800-row sweep took the write lock four times per issue and held it 11 seconds, starving concurrent writers into spurious timeouts. Reworked: one transaction, one lock acquisition, 0.3s. Each release wrote with `WHERE id = ? AND status = ? AND holder = ?` — a compare-and-swap in SQL — so a row that moved between selection and write was skipped and reported, never blindly reverted.

**Rule:** take the lock once per batch, not once per row. Every select-then-write carries a guard on the write. Select-then-write without a guard is a race with a delay.

### 8. Classify failures; never discard silently

Sync events are partitioned: **transient** (lock contention, I/O, timeout) → roll back and retry; **permanent** (constraint violation, unknown entity, undecodable payload) → quarantine and advance. Unrecognized errors default to **transient** — stall loudly rather than skip silently. Every skipped event is recorded in `sync_skipped_events` with its sequence number, payload, and error, surfaced in `td sync status`. The alternative (drop and advance the cursor) was a peer diverging forever with a clean conscience.

**Rule:** default to the loud failure. Anything you skip gets a durable record with enough context to replay the decision.

## Local verification (2026-08-19)

On this machine (`cool-pi-extensions/.todos/`): `issues.db-journal` present, zero `-wal`/`-shm` sidecars — rollback-journal mode confirmed live via td 0.60.0 (CLI) and sidecar 1.1.0 (embedded). Both surfaces share the one write funnel.

## Related

- `playbooks/td-playbook.md` — using td

- `playbooks/changelog-playbook.md` — Marcus's development-process discipline,
  the other half of what the td corpus teaches
