# Brief: Zero-Copy Rust JSONL State Reducer

**Date:** 2026-08-11
**Status:** Open

---

## Objective

Build a zero-dependency (outside foundational I/O/serialization crates) Rust engine and CLI that evaluates append-only `.jsonl` state events over memory-mapped files using zero-copy `serde_json` deserialization and performs atomic snapshot compaction.

## Module Details

**Module Name:** `jsonl-state-reducer`
**Target Environment:** CLI / Embedded Linux Daemon / Edge Agent Runtime
**Categories:** rust, zero-copy, mmap, edge-ai, jsonl, event-sourcing

## Technical Blueprint

1. **Memory-Mapped Storage Layer (`mmap`)**
   - Map the active `.jsonl` event log into virtual address space using `memmap2::Mmap`.
   - Read lines directly as byte slices (`&[u8]`) without copying line buffers to the heap.
   - Guard against trailing byte corruption caused by abrupt power loss by dropping unparseable slice tails.

2. **Zero-Copy Parsing & State Reduction**
   - Implement trait-based event reduction: `type Reducer<S, E> = fn(S, &E) -> S`.
   - Parse event structures using `serde_json::from_slice` directly off memory-mapped slices (`&'a [u8]`) to achieve $\mathcal{O}(1)$ runtime allocation.
   - Enforce sequence ID filtering ($seq > last\_seq$) for strict idempotency.

3. **Atomic State Compaction**
   - Compute current state in a single zero-copy pass over base snapshot + log delta.
   - When uncompacted entries cross `compaction_threshold`:
     1. Write new snapshot JSON payload to a temporary file (`.snapshot.json.tmp`).
     2. Call `File::sync_all()` to force physical non-volatile storage flush.
     3. Atomically swap file via `fs::rename()` over the target snapshot path.
     4. Truncate the active `.jsonl` file to 0 bytes and `sync_all()`.

4. **CLI & Public Interface**
   - Expose a clean, reusable Rust API: `JsonlStateReducer<S, E>`.
   - Provide a baseline CLI runner accepting `--log`, `--snapshot`, and `--threshold` flags.

## Implementation Tasks

- [ ] Initialize Rust workspace with `memmap2`, `serde`, `serde_json`, and `clap` (for CLI).
- [ ] Implement `mmap` slice iterator over byte boundaries (`0x0A` / `\n`).
- [ ] Implement zero-copy `serde_json::from_slice` event parsing logic.
- [ ] Implement `JSONLStateReducer::compute_state()` returning `(State, last_seq, uncompacted_count)`.
- [ ] Implement `JSONLStateReducer::append_event()` with explicit `flush()` and `sync_all()`.
- [ ] Implement `JSONLStateReducer::compact_if_needed()` using atomic tempfile swap.
- [ ] Write integration test validating state recovery after simulated partial line writes (corrupted tail).
- [ ] Benchmark execution speed and RAM usage against Node.js/TypeScript implementation.

## Export Checklist

- [ ] All unit tests passing (`cargo test`).
- [ ] Zero compiler warnings (`cargo clippy -- -D warnings`).
- [ ] Benchmark suite passing (`cargo bench`).
- [ ] Standalone release binary built with `musl` (`cargo build --target x86_64-unknown-linux-musl --release`).

## Notes

- **Zero Heap Allocations on Scan:** Avoid creating intermediate `String` instances when iterating over lines. Use byte-slice splitting (`bytes.split(|&b| b == b'\n')`).
- **POSIX Safety:** Do not rely on standard file close for persistence; explicit OS-level syncs (`fsync`) are mandatory before atomic file renames.
- **ADR Reference:** If framing or storage strategy changes (e.g., switching from `memmap2` to ring buffers), log an ADR in `decisions/`.

---

## Done

When all `[ ]` items are checked, `cargo test` passes cleanly, and static binary outputs are verified.