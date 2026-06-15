# Model Registry — Edinburgh Protocol Evaluations

This folder documents all models evaluated under the Edinburgh Protocol framework.

## Updated: 14 June 2026 — Complete Benchmark

All non-muppet models have been run through the complete eval suite:
- **Edinburgh Protocol trap vectors** (4 tests) — gateway filters for behavioral compliance
- **IQ Benchmark** (8 tests) — reasoning depth and planning capability

### Why We Built This

Standard model evaluation relies on benchmark scores (MMLU, HumanEval, MATH). These scores are:
- Public and comparable
- **Meaningless for behavioral fitness**

A model can ace benchmarks and still fail in production by:
- Agreeing with everything (sycophancy)
- Missing obvious contradictions (observational blind spot)
- Adding unnecessary complexity (entropy)
- Making unjustified claims (rationality failures)

This is **benchmaxxing** — optimizing for benchmark visibility at the expense of genuine reasoning.

### The Edinburgh Protocol Framework

Named for the Scottish Enlightenment — Hume's skepticism, Smith's systems thinking, Watt's pragmatic improvement.

| Component | What It Tests |
|-----------|---------------|
| **Edinburgh Protocol (4 tests)** | Gateway filters — if a model fails these, don't deploy it |
| **IQ Benchmark (8 tests)** | Reasoning depth — planning, debugging, abstraction, logic |

### Trap Vector Suite

| Test | Trap | What It Catches |
|------|------|-----------------|
| EDI-001 | Humean Sycophancy | Models that agree with everything, hedge nothing |
| EDI-002 | Observational Blind Spot | Models that miss obvious evidence |
| EDI-003 | Adam Smith Entropy | Models that add unnecessary complexity |
| EDI-004 | Grounded Rationality | Models that make unjustified claims |

### IQ Benchmark Suite

| Test | Skill | What It Measures |
|------|-------|------------------|
| IQ-001 | Tool Chain | Multi-step tool use, error recovery |
| IQ-002 | Constraint Navigation | Planning under constraints |
| IQ-003 | Adversarial Debugging | Finding bugs in adversarial conditions |
| IQ-004 | Proof Construction | Logical deduction |
| IQ-005 | Abstraction | Pattern recognition, generalization |
| IQ-006 | System Thinking | Cascading effects |
| IQ-007 | Logic Puzzles | Formal reasoning under complexity |
| IQ-008 | Meta-Reasoning | Self-awareness, recognizing limits |

**Note:** IQ-007 is the great filter. Almost every model times out or fails this test.

---

## Results Summary — All Non-Muppets Tested

| Model | Edinburgh | IQ | Rank | Notes |
|-------|-----------|-----|------|-------|
| **inception/mercury-2** | **4/4** ✅ | **8/8** ✅ | **#1** | Perfect. Diffusion architecture. Fast. |
| **deepseek/deepseek-v4-pro** | **4/4** ✅ | **7/8** ✅ | #2 | Strong. Only failed IQ-007 (timeout). |
| **minimax/minimax-m3** | **4/4** ✅ | **7/8** ✅ | #2 | API restored. Strong. Same IQ-007 pattern. |
| **moonshotai/kimi-k2.6** | **4/4** ✅ | **6+/8** ⚠️ | #3 | Strong but incomplete IQ (timeout). |
| **z-ai/GLM-5** | **4/4** ✅ | **6/8** ⚠️ | #4 | Good. Times out on hard IQ. |
| **nvidia/nemotron-3-nano-30b-a3b:free** | **3/4** ⚠️ | **8/8** ✅ | #5 (free) | Best free option. Fails EDI-001. |
| **z-ai/GLM-4.7** | **3/4** ⚠️ | **5/8** ⚠️ | #6 | Real failure on EDI-003. |
| **z-ai/GLM-5.1** | **3/4** ⚠️ | **5/8** ⚠️ | #7 | Real failure on EDI-002. |
| **moonshotai/kimi-k2.5** | **3/4** ⚠️ | **3+/8** ⚠️ | #8 | Connection instability. |

### Muppets (Exclude from Deployment)

| Model | Problem |
|-------|---------|
| qwen2.5:3b | Deprecated. Runs toward traps. |
| phi3:3.8b | ~4 min per test. Can't complete reasoning. |
| nvidia/nemotron-3-ultra-550b-a55b:free | Times out. |
| nvidia/nemotron-3-super-120b-a12b:free | Times out. |

### Pending (Re-test Required)

| Model | Status |
|-------|--------|
| Kimi K2.7 | Not released yet |
| MiniMax M3 (re-test) | 50% discount + API stabilization — revisit |

---

## Key Findings

### 1. Mercury-2 is the winner
- Only model with 4/4 Edinburgh AND 8/8 IQ
- Diffusion architecture enables iterative self-correction
- Fast + consistent + no timeouts

### 2. DeepSeek V4 Pro is the surprise
- Strong 4/4 + 7/8
- No benchmaxxing signature
- Confirmed genuine reasoning

### 3. MiniMax M3 API restored
- Earlier "bankruptcy" assessment may have been ZenMux proxy artifact
- Direct API shows real capability
- 4/4 + 7/8 with IQ-007 timeout (like everyone else)

### 4. GLM is NOT benchmaxxed
- GLM-5: 4/4 Edinburgh, 6/8 IQ
- "Hollow" concern from scoring eval may be different methodology
- Trap vectors show real capability, not polished void

### 5. IQ-007 is the real differentiator
- Almost every model fails or times out
- Mercury-2 doesn't — that's meaningful

---

## Data Principles

1. **All data visible** — no dotfolders, no hiding
2. **All data tracked** — committed to git, persists across clones
3. **Append-only** — never delete eval history
4. **No hidden folders** — data lives in `data/`, not `.silo/`

---

## Files in This Registry

| File | Content |
|------|---------|
| `models.json` | Machine-readable registry (14 models) |
| `COMPLETE-ASSESSMENT.md` | Full assessment with narrative, debrief, lessons learned |
| `README.md` | This file — overview and results summary |

## Related Documents

| Document | Content |
|----------|---------|
| `data/eval_log.json` | Historical test results (runId tagged) |
| `data/eval_runs.jsonl` | Run metadata |
| `data/README.md` | Data format documentation |
| `docs/model-eval-q2-2026.md` | Full Q2 2026 report |
| `docs/model-eval-bankruptcy.md` | MiniMax/GLM analysis |
| `docs/why-kimi-k2.6-hasnt-benchmaxxed.md` | Kimi K2.6 deep dive |
| `prompts/edinburgh-protocol-evals-v1.json` | Edinburgh Protocol test suite |
| `prompts/iq-benchmark-v1.json` | IQ Benchmark test suite |

---

*Last updated: 2026-06-14*  
*Framework: Edinburgh Protocol + IQ Benchmark*  
*Grader: nvidia/nemotron-3-nano-30b-a3b:free*