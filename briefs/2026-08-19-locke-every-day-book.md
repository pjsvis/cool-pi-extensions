# Project Brief: Lockean Memory Layer for AI Reasoning

## 1. Executive Summary

Standard semantic retrieval (dense vector embeddings) optimizes for proximity, which reinforces convergent thinking and causes architectural stagnation in autonomous agents. This project designs, implements, and benchmarks a **Lockean Collision Memory (LCM)** layer—a deterministic, low-dimensional hash indexing system with intentional, bounded collisions that forces lateral context synthesis during agent reasoning and problem-solving tasks.

---

## 2. Theoretical Architecture

<!-- mermaid-to-md:art -->
```text
               ┌─────────────────────────┐
               │ Incoming Memory / Log / │
               │          Task           │
               └────────────┬────────────┘
              ┌─────────────┴──────────────┐
              ▼                            ▼
┌──────────────────────────┐    ┌─────────────────────┐
│ Dense Embedding high-dim │    │ Lockean Hash Engine │
│          vector          │    │ deterministic hash  │
└─────────────┬────────────┘    └─────────┬───────────┘
              │                           │
              ▼                           ▼
  ┌───────────────────────┐   ┌───────────────────────┐
  │ Vector Store kNN high │   │ Discrete Grid Buckets │
  │       precision       │   │ collided context page │
  └───────────┬───────────┘   └───────────┬───────────┘
              └─────────────┬─────────────┘
                            ▼
                ┌──────────────────────┐
                │ Synthesis / Justify  │
                │ Agent forced lateral │
                └──────────────────────┘
```

```mmd
graph TD
    A[Incoming Memory / Log / Task] --> B[Dense Embedding<br/>high-dim vector]
    A --> C[Lockean Hash Engine<br/>deterministic hash]
    B --> D[Vector Store kNN<br/>high precision]
    C --> E[Discrete Grid Buckets<br/>collided context page]
    D --> F[Synthesis / Justify Agent<br/>forced lateral]
    E --> F
```

* **The Ingestion Unit:** Append-only memory blocks representing system tasks, architectural snippets, code modules, and error logs.
* **The Hash Function ($H$):** A deterministic, multi-attribute projection mapping items into a finite coordinate grid $G \in [1..N] \times [1..M]$.
* *Text / Code Heuristic:* $\text{Initial Token Class} \times \text{First Non-Trivial Operator/Vowel}$.
* *Vector Heuristic:* Low-dimensional Locality-Sensitive Hashing (LSH) or coarse quantized clusters (e.g., $k=64$).


* **Storage Allocation:** When coordinate $(X, Y)$ is targeted, the memory block is appended directly into that bucket's active "page" (max $k$ items per page before chaining), regardless of semantic overlap.
* **Retrieval Protocol:** In addition to top-$k$ nearest neighbors from the dense vector index, the system pulls the entire page of colliding items sharing the primary coordinate.

---

## 3. Core Objectives & Hypotheses

| ID | Hypothesis | Success Metric |
| --- | --- | --- |
| **H1** | **Lateral Problem Solving:** Forced collision context yields higher novelty scores in system design without degrading factual soundness. | $\ge 25\%$ increase in cross-domain solution transfer (measured by LLM-as-a-judge & rubric). |
| **H2** | **Entropy vs. Hallucination:** Collision-driven synthesis outperforms temperature scaling ($T > 0.7$) by maintaining valid syntax/structure while achieving similar or higher diversity. | Statistically significant reduction in runtime syntax/structural validation errors ($p < 0.05$). |
| **H3** | **Ingestion Efficiency:** Flat coordinate indexing incurs near-zero compute overhead compared to iterative clustering or graph-RAG updates. | $O(1)$ write latency ($\le 2\text{ ms}$ overhead per memory item). |

---

## 4. Experimental Setup

### Phase 1: Benchmark Dataset & Task Suite

1. **Corpus Construction:** Ingest a heterogeneous dataset containing:
* 150 System Design RFCs / Architecture decision records.
* 150 Classic Algorithms & Data Structures.
* 150 Real-world Post-Mortem Incident Reports across distributed systems.


2. **Evaluation Tasks:** 30 challenging architectural design prompts requiring lateral adaptation (e.g., *"Design an ultra-low latency cache invalidation engine inspired by biology/distributed sync"*).

### Phase 2: Test Arms

* **Arm A (Control - Baseline RAG):** Standard dense vector retrieval (top-$k$ cosine similarity) with $T=0.2$.
* **Arm B (Control - High Temp):** Standard dense vector retrieval with elevated exploration ($T=0.8$).
* **Arm C (Experimental - Pure Lockean):** Zero semantic retrieval; retrieval driven solely by Lockean coordinate matching.
* **Arm D (Experimental - Hybrid Dual-Stream):** Top-$k$ Semantic Matches + Co-located Lockean Collision Context evaluated through a verification/justification pass.

### Phase 3: Evaluation Rubric

*Scatter quadrant (novelty × soundness, arms A/B/D) — not a flowchart; not retro-convertible to Mermaid. Kept as authored.*

1. **Architectural Novelty (1–5):** Degree to which the solution leverages orthogonal mechanisms.
2. **Executability / Technical Soundness (1–5):** Absence of logical hallucinations or impossible interface assumptions.
3. **Synthesis Efficiency:** Token count spent in reasoning before converging on a valid architectural specification.

---

## 5. Implementation Roadmap

<!-- mermaid-to-md:art -->
```text

┌──────────────────────────┐    ┌──────────────────────────┐    ┌────────────────────┐    ┌─────────────────────┐
│ Week 1: Scaffolding hash │    │   Week 2: Integration    │    │ Week 3: Benchmarks │    │  Week 4: Synthesis  │
│   funcs, storage pages   ├───▶│ dual-stream RAG, prompts ├───▶│ evaluation matrix  ├───▶│ collision analysis, │
└──────────────────────────┘    └──────────────────────────┘    └────────────────────┘    │      packaging      │
                                                                                          └─────────────────────┘
```

```mmd
graph LR
    W1[Week 1: Scaffolding<br/>hash funcs, storage pages] --> W2[Week 2: Integration<br/>dual-stream RAG, prompts]
    W2 --> W3[Week 3: Benchmarks<br/>evaluation matrix]
    W3 --> W4[Week 4: Synthesis<br/>collision analysis, packaging]
```

1. **Sprint 1: Indexing Engine (Days 1–5)**
* Implement flat coordinate page store (`LockeIndex`) in Python/TypeScript.
* Define 3 candidate hash mappings (Lexical Locke, Structural AST Hash, Coarse LSH).


2. **Sprint 2: Agent Harness & Prompt Engine (Days 6–10)**
* Build the dual-stream context injection pipeline.
* Construct synthesis prompts instructing the LLM to reconcile collided entries with the primary objective.


3. **Sprint 3: Experiment Execution (Days 11–15)**
* Run automated evaluation across Arms A–D using an evaluation panel (e.g., dual-judge LLM consensus + static analysis check).


4. **Sprint 4: Analysis & Tooling (Days 16–20)**
* Determine optimal collision density ($k$ items per coordinate bucket).
* Deliver lightweight drop-in agent memory middleware.