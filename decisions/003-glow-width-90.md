# Decision: Hardcode Glow width at 90 chars

**Date:** 2026-06-11
**Status:** decided

## Context

Glow's default width (66–80 chars, from either the `glow.yml` config or terminal
auto-detection) produced uncomfortably narrow prose output. Dynamic width
(from `editor.getScreenSize()`) broke table formatting — markdown tables with
fixed-width columns get stretched to unreadable sparse columns when the viewport
is wide.

The tradeoff: prose needs width (~90–100 chars for comfortable reading); tables
break at width (140 chars produces comically sparse columns). There is no single
width that makes both perfect.

## Decision

Hardcode width at **90 chars** after a bisect experiment. Default (~80) was too
narrow for prose. Dynamic viewport width (~140) stretched tables. 90 was the
highest width where table formatting remained acceptable.

## Rationale

- **Bisect experiment:** Tested 80 (too narrow), 140 (tables broken), then
  bisected: 100 (approaching table-break), 90 (sweet spot), 110 (tables start
  to spread). The table benchmark line "Flox provides bun..." wraps at 90
  without fragmenting.
- **Prose readability:** 90 chars is within the 65–100 char range that
  typographic research considers optimal for reading comfort.
- **Simplicity over dynamism.** A hardcoded value is one fewer moving part than
  a `getScreenSize()` call. It's also testable — the output looks the same
  every time.

## Consequences

- The Glow command is now `glow -w 90` instead of `glow -w $(term_width)`.
- If Fresh's viewport width changes significantly (e.g., a 4K display at full
  terminal width), the preview width won't adapt. Accepted as acceptable
  tradeoff — the width is a reading comfort decision, not a layout decision.
- The value is documented in the plugin source with a comment explaining the
  bisect experiment.
