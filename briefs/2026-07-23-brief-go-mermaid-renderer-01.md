# brief: mermaid-tui — terminal Mermaid renderer (Rust extraction + CLI)

**Created:** 2026-07-23
**Status:** pending
**Supersedes:** `2026-07-23-brief-go-mermaid-renderer-01.md` (the Go/LipGloss approach)
**Reference impl:** `2026-07-23-brief-go-mermaid-renderer-02.md` (5,238-line Rust source, embedded)

## What

Extract the xAI `mermaid.rs` renderer from its `ratatui` dependency, compile it as a standalone CLI (`mermaid-tui`), and test whether it renders Mermaid diagrams in the terminal cleanly. If it works, wrap it as a Pi extension. If it doesn't, abandon fast.

## Why

Agents produce Mermaid in markdown constantly. The only rendering path is a browser or a VSCode plugin. A terminal-native renderer — box-drawing characters, no GUI, no image pipeline — is a real gap. xAI already built it (5,238 lines of Rust, tested, working). The question is not "can we build this" but "can we extract and compile it in an afternoon."

The prior brief proposed porting to Go + LipGloss. That's a multi-week project — 5K lines of graph layout, edge routing, and Mermaid parsing. The fail-fast move is to compile the existing Rust first. LipGloss is a styling library, not a layout engine; the hard part (parsing, ranking, crossing minimisation, edge routing) has nothing to do with LipGloss and everything to do with the algorithms the Rust code already implements.

## How — fail-fast sequence

### Phase 0: Extract (the ratatui decoupling)

The ratatui coupling is shallow — ~30 lines of type imports and one function (`Canvas::to_lines`):

- `ratatui::style::{Style, Modifier}` → replace with an ANSI string or a simple style struct
- `ratatui::text::{Line, Span}` → replace with `String` (the `plain_lines` path already produces this)
- `Canvas::to_lines` → emit `plain_lines` with inline ANSI escapes based on the `Cls` enum

The parser, layout engine, edge routing, and canvas data structure (~5,000 of 5,238 lines) are pure Rust with no external dependency beyond `unicode-width`. The extraction is mechanical.

**Done when:** the file compiles with only `unicode-width` as an external crate, no `ratatui`.

### Phase 1: Compile + CLI

Build a `mermaid-tui` binary:
- Reads Mermaid source from stdin (or a file argument)
- Calls `render(src, styles, max_width)` with a default style + terminal width from `tput cols` or `COLUMNS`
- Prints `plain_lines` (with ANSI escapes) to stdout

```
echo 'graph TD\n  A --> B --> C' | mermaid-tui
```

**Done when:** `cargo build` produces a binary; the binary reads stdin and prints box-drawing art to stdout.

### Phase 2: Test rendering quality

Test with real Mermaid diagrams:
- 3-node `graph TD` and `flowchart LR` (the brief's acceptance criterion)
- 5-10 node graph with branches and back-edges
- A sequence diagram
- A state diagram
- Edge cases: empty input, unsupported syntax (should fall back to framed box)

**Done when:** TD and LR 3-node graphs render clean of alignment artifacts in a raw terminal (not a TUI — just stdout). This is the go/no-go gate.

### Phase 3: Pi extension bridge (only if Phase 2 passes)

Write a thin Pi extension that:
- Registers a `/mermaid` slash command or agent tool
- Intercepts Mermaid code blocks from the conversation
- Pipes them to the `mermaid-tui` binary via `exec`
- Renders the ANSI output in Pi's terminal

Same architecture as the eval consolidation: CLI is the engine, extension is the port.

**Done when:** `/mermaid` in a Pi session renders a diagram inline.

## Acceptance criteria

- [ ] `mermaid.rs` compiles without `ratatui` (only `unicode-width` dependency)
- [ ] `mermaid-tui` binary reads stdin, prints box-drawing art to stdout
- [ ] TD and LR 3-node graphs render clean of alignment artifacts in raw terminal
- [ ] Rendering executes in under 15ms (no external runtime — it's a compiled binary)
- [ ] Unsupported syntax falls back to a framed box, not a crash
- [ ] (Phase 3, gated) Pi extension renders Mermaid inline via `/mermaid`

## Out of scope

- Go/LipGloss port — parked as a future decision, gated on Phase 2 results
- Full Mermaid syntax coverage (the Rust code covers graph, flowchart, sequence, state, class, ER — that's enough)
- Interactive pan/zoom (Bubble Tea / ratatui TUI loop)
- Colour theme configuration (default styles are fine for the PoC)

## The Go question, answered

The prior brief asked "can we replicate the Rust in Go using LipGloss?" The answer is yes, but it's the wrong question. The right question is "is the product worth building?" — and the fastest way to answer that is to compile the existing Rust, not to port it. If the Rust binary proves the product, the Go port becomes a stylistic preference, not a necessity. If the Rust binary doesn't work (can't extract, renders terribly), the Go port won't work either — the failure mode is in the layout algorithms, not the rendering library.

LipGloss gives you styled strings and join operations. It does not give you graph layout, edge routing, or a canvas data structure. The 5K lines of Rust that do the hard work have no LipGloss equivalent. Porting them to Go means rewriting the algorithms, not calling a library. That's a multi-week project, not a 15-minute experiment.

The Go path is open if Phase 2 passes and we decide we want a Go binary for distribution or LipGloss for styling. But it's a choice, not a default.
