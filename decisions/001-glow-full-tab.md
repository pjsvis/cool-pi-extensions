# Decision: Full-tab preview over split pane for markdown rendering

**Date:** 2026-06-11
**Status:** decided

## Context

The Glow preview plugin initially opened in a horizontal split pane (40% height)
using `createVirtualBufferInSplit`. This showed the source and preview
simultaneously, following the VS Code / Obsidian split-pane pattern.

## Decision

Switch to `createVirtualBuffer` — a full-screen tab that replaces the current
split. Close with `q` or `Escape`, return to source buffer via `focusSplit`.

## Rationale

- **Markdown preview is a reading mode, not a reference mode.** When you
  preview, you're switching mental contexts — you don't need both visible
  simultaneously. The tab bar gives instant return via `q`.
- **Terminal width constraints.** At 80–120 columns, a 40% split gives
  ~15–20 lines for rendered output. Glow's strength is flowing text with
  syntax-highlighted code blocks — that needs breathing room.
- **Simpler lifecycle.** No split-ratio management, no panel-id reuse
  concerns, no "which split am I targeting" ambiguity. One buffer, one tab.

## Consequences

- Lost side-by-side comparison. To compare source and rendered output, you
  must toggle. Accepted as acceptable tradeoff for the reading-mode argument.
- Need to track `sourceSplitId` so `q` returns focus correctly.
- Custom close handler (`glow_preview_close`) required because `close_current_tab`
  doesn't reliably fire `buffer_closed` on virtual buffers.
