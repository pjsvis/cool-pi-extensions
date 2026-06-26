# Decision 007: Barnacle Review Process

**Date:** 2026-06-21  
**Status:** Proposed  
**Review:** 2026-09-21 (first review)

---

## Context

Agent configuration files (`AGENTS.md`, `CLAUDE.md`, `CLAUDE_DESKTOP.md`, `CLAUDE_CODE.md`, etc.) proliferate by default. Each one accumulates:

- New directives from new requirements
- Legacy directives that made sense once
- Contradictory guidance from different authors
- Outdated provider configurations
- Commented-out cruft "for reference"

The result is a **barnacled hull** — drag that slows the agent, increases variance, and obscures the actual constraints.

---

## Definition

**Barnacles:** Any element in an agent config file that no longer serves its intended purpose or whose purpose has been superseded.

### Barnacle Types

| Type | Description | Example |
|------|-------------|---------|
| **Stale directive** | Was useful, now redundant or harmful | Old model ID that was replaced |
| **Legacy config** | Provider/API from deprecated service | Flox references (deprecated) |
| **Accumulated cargo** | "Let's keep this commented-out for reference" | Dead code in config |
| **Contradictory guidance** | Two directives that cannot both be followed | "Be concise" + "Provide full context" |
| **Orphaned reference** | File/directory that no longer exists | Path to deleted extension |
| **Outdated constraint** | Provider/API that evolved but config didn't | Old API key location |

---

## Review Process

### Trigger Conditions

| Condition | Action |
|-----------|--------|
| Quarterly (every 90 days) | Scheduled review |
| New provider added | Barnacle check before merge |
| Major protocol update | Full review of affected files |
| Agent output variance spike | Diagnostic review |

### Review Checklist

For each agent config file:

- [ ] **Parse all directives** — list every meaningful line
- [ ] **Check references** — do files/directories still exist?
- [ ] **Test against reality** — does this actually control agent behavior?
- [ ] **Find contradictions** — are any directives mutually exclusive?
- [ ] **Assess utility** — would removal increase or decrease entropy?
- [ ] **Consolidate** — can multiple directives be merged?
- [ ] **Document** — record what was kept and why

### File Inventory (to maintain)

```markdown
| File | Purpose | Last Reviewed | Status |
|------|---------|---------------|--------|
| AGENTS.md | Primary agent constraints | 2026-06-21 | Clean |
| CLAUDE.md | Claude-specific config | 2026-06-21 | Needs review |
| prompts/edinburgh-protocol.md | Behavior normalization | 2026-06-21 | Canonical |
```

---

## Categories of Review

### Tier 1: High-Impact Files (Review Quarterly)

| File | Owner | Justification |
|------|-------|---------------|
| `AGENTS.md` | Repository root | Primary agent constraint |
| `prompts/edinburgh-protocol.md` | Protocol | Core identity — change carefully |
| `.pi/agent/models.json` | Provider config | Direct effect on model selection |

### Tier 2: Medium-Impact Files (Review Semi-Annually)

| File | Justification |
|------|---------------|
| `CLAUDE.md` / `.claude/` | Claude Code specific |
| `CLAUDE_DESKTOP.md` | Desktop-specific |
| `briefs/*.md` | Project context |
| `playbooks/*.md` | Procedures |

### Tier 3: Low-Impact Files (Review Annually)

| File | Justification |
|------|---------------|
| `SESSION.md` | Session-specific, ephemeral |
| Provider credentials | Rotation happens naturally |
| Local overrides | User-specific |

---

## Review Output

### For Each File Reviewed

```markdown
### <filename>
**Last reviewed:** YYYY-MM-DD
**Reviewer:** [person or agent]
**Status:** Clean / Needs Cleanup / Deprecated

**Findings:**
- Removed: [list of barnacles and why]
- Kept: [list of directives and rationale]
- Contradictions found: [list with resolution]

**Next review:** YYYY-MM-DD
```

### Aggregate Report

Quarterly: publish a "Barnacle Report" to `docs/barnacle-reports/` summarizing:
- Files reviewed
- Barnacles removed
- New directives added (and their justification)
- Files marked for deprecation

---

## Anti-Patterns to Avoid

| Anti-Pattern | Why It's Bad |
|--------------|-------------|
| "Comment it out instead of deleting" | Comments accumulate, become noise |
| "Let's keep it in case we need it later" | Future needs rarely materialize |
| "This was added by [other tool]" | Ownership confusion |
| "One more flag won't hurt" | Cumulative effect is significant |
| "The agent ignores it anyway" | Config debt without benefit |

---

## Integration with MVAS (Decision 006)

MVAS is the principle. Barnacle Review is the process.

MVAS says: **don't add things that aren't needed.**

Barnacle Review says: **remove things that stopped being needed.**

Together they create a **feedback loop** against accretion:

```
Add → Review → Remove/Keep → Review → ...
```

---

## References

- MVAS Principle: `decisions/006-minimal-viable-agent-stack.md`
- Edinburgh Protocol: `prompts/edinburgh-protocol.md`
- Barnacle Reports: `docs/barnacle-reports/` (to be created)

---

## Changelog

| Date | Change |
|------|--------|
| 2026-06-21 | Initial proposal |