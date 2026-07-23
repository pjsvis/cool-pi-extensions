# brief: mermaid-extract — render Mermaid diagrams from markdown files

**Created:** 2026-07-23
**Status:** pending
**Depends on:** `mermaid-tui` binary (epic td-076e0a, complete)

## What

A thin shell script (`scripts/mermaid-extract.sh`) that extracts ` ```mermaid ` code blocks from a markdown file and pipes each one to the `mermaid-tui` binary for terminal rendering. Optionally renders a single block by index.

## Why

Mermaid diagrams live inside markdown files — fenced in ` ```mermaid ` blocks, surrounded by prose. The repo has diagrams in `briefs/`, `docs/`, `decisions/`, `blog/`. To view one today, you have to open the file, find the block, copy the source, and pipe it to `mermaid-tui`. That's friction.

The binary is a pure stdin → stdout renderer. Adding markdown parsing to it would conflate two concerns (Mermaid rendering and markdown extraction). The Unix-correct approach is a separate preprocessor that extracts the Mermaid and pipes it to the existing binary. Small tools, one job each, composed via pipes.

## How

1. Write `scripts/mermaid-extract.sh` — reads a markdown file, finds ` ```mermaid ` blocks, pipes each to `mermaid-tui`.
2. Add a `just mermaid FILE [BLOCK]` recipe to the justfile.
3. Test with a real markdown file containing Mermaid diagrams from the repo.

### Script behaviour

```
mermaid-extract.sh <file> [block-number]
```

- No block number: render all ` ```mermaid ` blocks in sequence, labelled "── Diagram N ──"
- Block number given: render only that block (1-indexed)
- No mermaid blocks found: print "No mermaid blocks found in <file>" to stderr, exit 0
- File not found: print error to stderr, exit 1

### Justfile recipe

```just
mermaid FILE BLOCK="":
    @scripts/mermaid-extract.sh {{ FILE }} {{ BLOCK }}
```

## Acceptance criteria

- [ ] `scripts/mermaid-extract.sh` extracts ` ```mermaid ` blocks from a markdown file
- [ ] `mermaid-extract.sh <file>` renders all blocks in sequence
- [ ] `mermaid-extract.sh <file> 2` renders only the second block
- [ ] No mermaid blocks → message to stderr, exit 0
- [ ] File not found → error to stderr, exit 1
- [ ] `just mermaid <file>` works via the justfile recipe
- [ ] Script is ≤30 lines of bash
- [ ] No rendering logic in the script — it only extracts and pipes

## Out of scope

- Mermaid syntax validation (the binary handles that — bad syntax renders as a fallback box)
- Writing rendered output to a file (stdout is the interface; `> file` works)
- Integration with the Pi extension (future brief, gated on actual use)
- Extraction from non-markdown formats (RST, AsciiDoc)
- Interactive block selection (fzf picker, etc.)
