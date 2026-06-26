# Decision 006: Minimal Viable Agent Stack (MVAS)

**Date:** 2026-06-21  
**Status:** Proposed  
**Review:** 2026-09-21 (quarterly)

---

## Context

The agent tooling landscape accumulates features by default. Every slash command, MCP integration, `AGENTS.md` addition, and config flag is a **promise** — a claim it will reduce entropy. But promises compound:

- Each integration adds decision points the agent must navigate
- Documentation debt grows with feature count
- Conflicting directives become more likely
- Provider evolution requires ongoing maintenance

Our Edinburgh Protocol provides a constraint stack. Our context initialization (briefs, playbooks) provides orientation. The question becomes: **what else does an agent actually need?**

---

## Decision

### Principle: Constraint Stack Over Feature Accumulation

**Every addition to the agent stack must prove empirical value.** Technical possibility or industry convention is not sufficient justification.

### The Minimal Viable Agent Stack (MVAS)

| Component | Purpose | Justification |
|-----------|---------|---------------|
| **Edinburgh Protocol** | Behavior normalization | Reduces variance across models |
| **Context Initialization** | Orientation | Briefs + Playbooks provide structured onboarding |
| **Task Execution** | Doing things | `just` — idempotent, composable |
| **Task Memory** | Continuity | `td` — session state across contexts |
| **Codebase Mapping** | Understanding | `understand` — on-demand, not default |

### What Falls Outside MVAS

| Category | Rationale for Exclusion |
|----------|------------------------|
| Multiple slash commands | One entry point (`glow`, `just`, or `td`) sufficient |
| MCP integrations | Complexity tax exceeds utility for most cases |
| Provider proliferation | One good API beats five mediocre ones |
| `AGENTS.md` files | One canonical file, not twelve |
| Feature flags for rare cases | YAGNI applies to agent config |

### The Test

> **Does this addition reduce entropy in agent output?**

Not:
- "This is technically possible"
- "Everyone does it this way"
- "It might be useful someday"
- "It only takes a few lines"

---

## Consequences

### Positive
- Smaller attack surface for config drift
- Lower maintenance burden
- Clearer mental model for operators
- Faster onboarding (less to learn)

### Negative
- Some marginal capabilities may be lost
- "But I could add..." impulse must be actively resisted
- Review process adds friction to feature requests

---

## Implementation

### Immediate Actions

1. **Audit current stack** — identify which components actually get used
2. **Consolidate `AGENTS.md` files** — one canonical location per repo
3. **Deprecate unused slash commands** — remove, don't hide
4. **Single provider preference** — ZenMux for unified access

### Review Process

Quarterly barnacle review (see companion process: `decisions/007-barnacle-review-process.md`).

---

## Alternatives Considered

### Alternative A: No constraints
- Pros: Maximum flexibility
- Cons: Accumulates cruft, hard to maintain

### Alternative B: Strict allowlist
- Pros: Maximum control
- Cons: Requires governance overhead, slows experimentation

**Chosen:** Principle-based constraints with empirical review cycle.

---

## References

- Edinburgh Protocol: `prompts/edinburgh-protocol.md`
- Context initialization: `briefs/`, `playbooks/`
- Barnacle review process: `decisions/007-barnacle-review-process.md`