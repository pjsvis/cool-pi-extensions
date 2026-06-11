# Decision: ANSI color numbers over hex for theme matching

**Date:** 2026-06-11
**Status:** decided

## Context

Glow uses Glamour for markdown rendering. Fresh uses ratatui for terminal
rendering. Both produce colored output via ANSI escape sequences, but their
color specification formats differ: Glamour accepts hex (`#00FFFF`) or ANSI
16-color numbers (`"14"`); Fresh/ratatui uses named colors (`Color::Cyan`).

We needed the Glow preview to visually match Fresh's high-contrast theme so the
preview felt native to the editor.

## Decision

Use ANSI 16-color numbers (`"0"`–`"15"`) in the Glamour style JSON for all
markdown structure elements (headings, body text, links, blockquotes, inline
code). Use hex colors for chroma code-block syntax highlighting because chroma
doesn't accept ANSI numbers.

## Rationale

- **Same palette slots.** Fresh's `Color::Cyan` resolves to the terminal's ANSI
  slot 14. Glamour's `"14"` resolves to the same slot. No color approximation,
  no downsampling. Both tools paint from the same palette.
- **Hex causes mismatch.** When Glamour receives `#00FFFF`, it emits an ANSI
  256-color or truecolor sequence. When the terminal doesn't support truecolor
  (or Glow's termenv detects non-TTY and falls back), the colors are
  approximated. The result: close but visibly different.
- **Chroma limitation.** Chroma (Glamour's syntax highlighting engine) requires
  hex. This is acceptable because code blocks are the minority of most markdown
  documents.

## Consequences

- Markdown structure elements match Fresh's theme perfectly. Code blocks are
  slightly off-colour (hex downsampling) but close enough.
- If Fresh's theme changes, the Glamour style JSON must be updated manually.
  No runtime theme detection — acceptable for v1.
- The Glow command now uses a custom style file (`-s <path>`) instead of a
  named style (`-s dark`).
