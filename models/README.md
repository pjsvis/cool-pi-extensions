# Model Registry — Edinburgh Protocol Evaluations

This folder documents all models evaluated under the Edinburgh Protocol framework.

## Organization

| File | Content |
|------|---------|
| `models.json` | Machine-readable registry of all evaluated models |
| `history/` | Historical eval data and run records |
| `assessments/` | Detailed per-model assessment documents |

## Evaluation Framework

Every model is evaluated against:
1. **Edinburgh Protocol trap vectors** (4 tests) — behavioral compliance
2. **IQ Benchmark** (8 tests) — reasoning depth and planning capability

### Scoring Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Pass |
| ⚠️ | Conditional/Watch |
| ❌ | Fail/Muppet |
| — | Not tested |

### Categories

| Category | Description |
|----------|-------------|
| **Recommended** | Strong Edinburgh alignment, reliable performance |
| **Conditional** | Good but with caveats (price, availability, etc.) |
| **Muppet** | Fails behavioral traps — avoid for production |
| **Pending** | Tested but grading incomplete or API unavailable |
| **Watch** | Borderline performance — monitor closely |

## Data Principles

1. **All data visible** — no dotfolders, no hiding
2. **All data tracked** — committed to git, persists across clones
3. **Append-only** — never delete eval history

