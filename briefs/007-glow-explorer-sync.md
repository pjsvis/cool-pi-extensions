# brief: Glow preview explorer sync

**Created:** 2026-06-11
**Status:** implemented

## What

Make the Glow markdown preview follow markdown files opened or activated from
Fresh's file explorer.

## Why

The current preview is excellent, but it is a manual toggle: open a markdown file,
press the Glow keybinding, read. If the user browses another markdown file in the
explorer while the preview is open, the preview stays stale until `r` or another
toggle.

Explorer sync turns the preview into a lightweight reading pane for markdown
navigation: click a markdown file, the Glow preview updates.

## How

Fresh exposes buffer lifecycle events that are sufficient for this:

- `after_file_open` — fires when a file is opened, including explorer-driven
  opens.
- `buffer_activated` — fires when the active buffer changes.
- `BufferInfo.is_preview` — marks explorer single-click preview buffers as
  ephemeral, but they are still real file-backed buffers and can be rendered.

The plugin now:

1. Keeps explorer sync enabled by default.
2. Subscribes to `after_file_open` and `buffer_activated`.
3. Debounces explorer-driven updates by 150ms.
4. Skips non-markdown buffers and the Glow preview buffer itself.
5. Re-renders the preview from the active markdown buffer without replacing the
   original source buffer/split used for close/return behavior.
6. Focuses the split that contains the Glow preview after sync, so `Ctrl+P`
   can toggle into/out of Glow mode without an extra click.
7. Provides `Glow Preview: Toggle Explorer Sync` to disable/enable the behavior.

## Acceptance criteria

- [x] Opening/activating a markdown file while Glow preview is open updates the
  preview.
- [x] Non-markdown files are ignored.
- [x] The Glow preview tab remains focused after explorer sync.
- [x] Explorer sync can be disabled via command palette.
- [x] Existing toggle, refresh, save-refresh, and untitled-buffer behavior still
  work.

## Risks / tradeoffs

- **Performance:** Glow rendering is not free. The 150ms debounce prevents rapid
  explorer clicks from spawning a render storm.
- **Surprise:** Some users may prefer the preview to stay pinned to the original
  file. The command palette toggle provides an escape hatch.
- **Ephemeral explorer previews:** Fresh marks single-click explorer opens as
  `is_preview`. We render them anyway because they are still file-backed buffers;
  if the user navigates away, `buffer_closed` tears the preview down as before.

## Files

| File | Purpose |
|---|---|
| `src/fresh/glow-preview.ts` | Explorer sync hooks, debounce, source/displayed buffer separation, and preview focus. |
| `briefs/007-glow-explorer-sync.md` | This brief. |
