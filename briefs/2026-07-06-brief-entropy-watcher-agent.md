# `pi-entropy-watcher` (The Justify Engine Daemon)

## Mission Statement

To transform the Pi coding agent from a passive, probabilistic text generator into an active, structural immune system for the repository. The Entropy Watcher runs locally as a background daemon, monitoring file changes, mapping logical load paths via the Edinburgh Protocol, and alerting the user only when the architecture or reasoning threatens to collapse.

## Architectural Constraints (The Silo)

* **Local-First:** No external cloud dependencies for memory or state.
* **Engine:** Built in TypeScript, executed via Bun.
* **Inference:** Connects to a local 14B reasoning model (e.g., DeepSeek R1 Distill or Qwen 3.5) running on Apple Silicon.
* **State:** All diagnostic history is logged to a local SQLite database (`entropy_logs.db`).

## Operational Flow

### 1. Ingestion (The Debounced File Watcher)

The daemon relies on a highly constrained, debounced file watcher. It does not evaluate mid-sentence or mid-function.

* **Trigger:** Uses Bun's `fs.watch` to monitor the active directory.
* **Debounce:** Implements a 30-second delay after the last keystroke/save before triggering an evaluation.
* **Diffing:** Extracts only the delta (what actually changed) to keep the inference context lean and fast.

### 2. Evaluation (The Tensegrity Check)

The diff is wrapped in a strict Edinburgh Protocol system prompt and piped to the local reasoning model. The model is forced to evaluate the diff across two metrics:

* **The Implicit Metric (The Panic Token Count):** The script measures the length of the model's `<think>` block. A clean, logical diff generates a concise internal trace. A messy, ungrounded diff forces the model into a massive, multi-step attempt to resolve the contradictions. Token count = raw entropy.
* **The Explicit Metric (The Diagnostic JSON):** The model returns a structured JSON payload scoring the diff on:
* `axiomatic_drift`: (0-100) Violations of project rules or local-first principles.
* `empirical_grounding`: (0-100) Reliance on hallucinations or obsolete metaphors.
* `ontological_consistency`: (0-100) Mixing system metaphors or breaking scope.



### 3. Interjection (The Alert System)

The daemon calculates the final **Spike Score** by combining the JSON metrics and the token multiplier.

* **Score < 30 (Stable):** Silent log to SQLite. No interruption.
* **Score 30 - 70 (Drift):** Passive terminal UI color change.
* **Score > 70 (Redline):** Active terminal interruption. The daemon prints the diagnostic report and forces the user to resolve or explicitly override the structural leak.

## Core TypeScript Modules to Scaffold

| Module | Purpose |
| --- | --- |
| `watcher.ts` | Handles the Bun `fs.watch` loops, debounce logic, and diff extraction. |
| `evaluator.ts` | Manages the API call to the local model, captures the `<think>` block length, and parses the JSON. |
| `scorer.ts` | The math engine. Calculates the final Spike Score and determines the alert tier. |
| `interjector.ts` | The terminal UI layer. Handles silent logging, passive indicators, and active interruptions. |

---

This gives you a tight, deterministic framework to start building the daemon. It avoids bloat and keeps the entire operation strictly within the bounds of your existing Resonance/Pi setup.