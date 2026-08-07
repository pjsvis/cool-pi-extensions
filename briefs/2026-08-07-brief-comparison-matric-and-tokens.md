# Brief 014: Token Usage Tracking and Tabulated Evaluation Matrix (`pi-eval`)

**Date:** 2026-08-07

**Status:** Draft / Ready for Implementation

**Target Subsystem:** `src/cli/pi-eval` (`lib/types.ts`, `lib/providers.ts`, `lib/scoring.ts`, `commands/matrix.ts`)

---

## 1. Objective

Enhance `pi-eval` to record, report, and score **token efficiency** (prompt tokens, completion tokens, and compaction/truncation events) alongside functional accuracy. Update CLI outputs and exported matrix reports (`.md` / `.jsonl`) to use a front-loaded, Luke-style structured grid presentation.

---

## 2. Technical Scope

### A. Telemetry & Types (`lib/types.ts`)

Add a `TokenUsage` metadata block to execution results:

```typescript
export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  compactionEvents: number; // Truncation/context compaction occurrences
}

export interface EvalRunResult {
  // Existing fields...
  usage?: TokenUsage;
}

```

### B. Provider Extraction (`lib/providers.ts`)

Extract token usage from provider responses (OpenAI-compatible `usage` payloads, Anthropic headers/response blocks, Ollama/Llama.cpp stats). Aggregate usage across retry/repair loops and increment `compactionEvents` whenever an output-limit compaction is triggered.

### C. Scoring & Efficiency Metric (`lib/scoring.ts`)

Incorporate a **Token Efficiency Ratio** alongside functional pass rates:

* Functional Pass Score ($S$) vs. Total Tokens Used ($T$).
* Flag "Token Burners": Models that pass functional tests but consume an excessive token multiplier compared to the benchmark median.

---

## 3. Luke-Style Presentation Layout

Update `commands/matrix.ts` and generated evaluation markdown reports to follow a standardized, front-loaded structure.

### Layout Standard

#### 1. Runtime Environment Block

Always print execution context before tables:

```markdown
### Environment & Constraints
* **Backend / Provider:** Llama.cpp / Ollama / OpenRouter
* **Target Hardware:** RTX 2000 Ada (16GB VRAM) / 32GB System DDR4
* **Quantization / Cache:** IQ4NL / 8-bit KV Cache
* **Output / Timeout Cap:** 32k max output tokens / 120s

```

#### 2. Tabulated Results Matrix

Primary visual grid comparing model variants across core operational axes:

| Model / Harness | Prefill (t/s) | Decode (t/s) | Token Usage (In / Out / Total) | Repair Loops / Compacts | Pass Rate | Efficiency Score |
| --- | --- | --- | --- | --- | --- | --- |
| `Qwen 35B (IQ4NL)` | 309 | 41 | 52k / 12k / **64k** | 1 loop / 0 compacts | 98% | **High** |
| `KAT Coder 2.5` | 278 | 47 | 88k / 14k / **102k** | 4 loops / 2 compacts | 96% | **Low (Burner)** |

#### 3. Granular Context & Tool Diagnostic Breakdown

For context retrieval or agentic sandbox suites, render explicit sub-matrix breakdowns:

```markdown
#### Context Retrieval Depth (256k Haystack)
| Model | 0% Depth | 25% Depth | 50% Depth | 75% Depth | 100% Depth | Overall |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `Qwen 35B` | 100% | 33% | 100% | 66% | 66% | **73%** |
| `KAT Coder` | 100% | 100% | 100% | 100% | 100% | **100%** |

```

---

## 4. Verification & Acceptance Criteria

1. **Schema Integrity:** `pi-eval run` records `usage` in `data/eval_runs.jsonl`.


2. **Matrix Command Output:** `pi-eval matrix` renders the Runtime Environment Block and the summary table including token totals and loop counts.


3. **No Regressions:** Non-tokenized historical runs degrade gracefully in table views (render `N/A` for usage without crashing matrix generation).



---

Let me know if you'd like to adjust any of the field names or threshold calculations before saving this to `briefs/`!