# ADR-001: Table Rendering in Markdown Documentation

## Status
**Accepted** — 2026-06-11

## Context
This repository uses markdown for both human-readable documentation (via `glow`) and agent-accessible content (via `just read`). Tables are a common markdown feature but present rendering challenges:

1. **Blank rows break tables** — Markdown requires continuous pipe characters. Adding blank lines for "air" creates parseable empty rows, not visual breathing room.
2. **Horizontal `---` dividers** work for section separation but don't solve per-row spacing.
3. **Tables vs lists** — Tables are compact and scannable but lose visual hierarchy when dense.

## Decision
Convert documentation tables to **bold + description lists** with natural line breaks between items.

### Format
```markdown
**Item name**
Description text. Can span multiple lines if needed.

**Another item**
Another description.
```

### Rationale
- Bold creates visual anchor (equivalent to table header)
- Description follows naturally (equivalent to table cell)
- Blank lines between items create breathing room
- No table parsing issues
- Renders cleanly in `glow` with high-contrast theme
- Both humans and agents can parse easily

## Implications
1. **docs/the-vest-protocol.md** — May need review if it contains tables
2. **docs/visitor-journey.md** — May need review if it contains tables
3. **playbooks/*.md** — May need review for table usage
4. **Future contributors** — Should use bold+description format, not markdown tables

## Exceptions
- Tables are acceptable in **code blocks** showing example data structures
- Tables are acceptable for **comparison matrices** with 3+ columns
- If a table is the only clear way to show data, note the trade-off in review

## Alternatives Considered
1. **Empty cells `| |`** — Breaks table visually (empty row appears)
2. **Keep tables, accept density** — `---` section dividers help but don't solve per-row air
3. **Convert to definition lists** — Similar to chosen approach, but less familiar syntax