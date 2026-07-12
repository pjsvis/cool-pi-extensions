```markdown
---
type: brief
id: architectural-preflight-auditor-flags
upstream: briefs/architectural-token-compaction-hook
status: approved
---

# Brief: System-2 Pre-Flight Audit & Flag Vector Compression

## 1. Objective
Optimize the repository's "Just Orient" phase by decoupling deep state verification from task execution. This enhancement introduces an out-of-band System-2 Auditor script that runs comprehensive checks and condenses the verification proof into a low-entropy bit vector (boolean flags) for the System-1 Execution Agent.

---

## 2. The Alignment Tax Paradox
In our previous local-first architecture, the initialization step ("Just Orient") forced the execution agent to ingest raw verification data—including file manifests, git statuses, and task dependencies—to confirm repository health. 

This created significant token waste. The agent spent substantial context space reading static data it possessed no agency to alter. We were paying a steep attention tax merely to confirm the mechanism wasn't broken. 

To eliminate this waste, the verification process must be split into two discrete computational layers:
1. **The System-2 Auditor:** Runs deep, slow, comprehensive repository bisection out-of-band.
2. **The System-1 Operator:** Inherits a pre-verified state and focuses entirely on the atomic implementation delta.

---

## 3. The System-2 Auditor Engine
The Auditor is a local TypeScript utility executed immediately prior to agent instantiation. It performs a rigorous checklist analysis across the repository terrain:

* **Structural Integrity Check:** Verifies that physical directory structures exactly equal the central registry mapping (`Index == Disk`).
* **Isolation Check:** Asserts that the working directory is perfectly isolated (e.g., via a clean Git worktree) to preserve patch attribution.
* **Semantic Anchor Check:** Confirms all cross-referenced terms in the active task brief exist within the current `conceptual-lexicon`.
* **State Sync Check:** Queries `marcus/td` to confirm the target task ID matches the currently checked-out feature branch.

---

## 4. The Flag Vector Payload (Token Compaction Layer)
Instead of dumping the verbose text logs of these checks into the agent's context window, the System-2 Auditor compresses the entire verification proof into a minimal metadata block injected directly into the execution agent's initialization routine:

```markdown
---
preflight_status: PROCEED
checksum_vector:
  structural_parity: 1  # Manifest matches disk state
  git_tree_pristine: 1  # Active workspace is sandboxed
  lexicon_bound:     1  # Context vocabulary is locally defined
  upstream_aligned:  1  # Task matches active td database key
---

```

By presenting this pre-computed status vector, the execution agent is completely relieved of the cognitive burden of system verification. It operates on an absolute guarantee that the baseline is pristine, saving thousands of tokens of context space for high-signal implementation work.

---

## 5. The Red Flag Protocol (Failing Closed)

If any component of the verification checklist fails, the system executes an immediate short-circuit:

```text
[ System-2 Auditor Runs Checks ] ───► Component Fails (Flag: 0) ───► [ HALT EXECUTION ]
                                                                             │
                                                                             ▼
                                                                 Vaporize Agent Instance
                                                                 Alert Human: "Stop & Tidy"

```

* **Zero-Token Isolation:** The System-1 Execution Agent is never spawned. No API calls are initialized, and no tokens are consumed on a compromised state.
* **Human Directives:** The local script terminates with a non-zero exit code and outputs a direct, machine-readable error log explicitly indicating the failing flag and the mandated reconciliation action:
> `CRITICAL FAULT: Pre-flight check failed [structural_parity: 0]. Run 'bun run tidy' to reconcile the metadata index before proceeding.`



---

## 6. Architectural Sufficiency Matrix

| Phase | Vector Input | Systemic Attention Footprint | Cost/Friction |
| --- | --- | --- | --- |
| **Legacy Orient** | Verbose raw prose logs & file trees. | High-entropy token bloat across the context window. | High context depletion. |
| **Flag-Vector Orient** | Bounded 4-bit metadata block. | Zero-entropy baseline declaration. | Negligible local local processing cost. |

```

```