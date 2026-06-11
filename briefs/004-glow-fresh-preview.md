# brief: Glow markdown preview for Fresh editor

**Created:** 2026-06-11
**TD:** td-9469c0
**Status:** complete

## What

A Fresh editor plugin that renders the current markdown buffer through Glow (the Charmbracelet CLI renderer) in a split pane, invoked by a keybinding.

## Why

Fresh lacks a built-in markdown preview. Glow is already installed and produces excellent terminal-native rendered output. Wiring them together via Fresh's plugin API gives us a live preview with zero new dependencies — just `spawnProcess` + virtual buffer display. The split-pane preview pattern is well-trodden (VS Code, Obsidian) and fits Fresh's plugin architecture cleanly.

## How

**Plugin file:** `~/.config/fresh/plugins/glow-preview.ts`

1. **Keybinding:** Register a command with a mnemonic key combo (proposal: `Ctrl+Shift+M` or `Cmd+Shift+M` on macOS) that fires the preview.
2. **Capture buffer:** Read the active buffer's full text via `getBufferText`.
3. **Pipe through Glow:** `spawnProcess("glow", ["-s", "dark", "-"], null)` with the buffer text on stdin. `-s dark` matches Fresh's high-contrast theme; make it configurable later.
4. **Display output:** `createVirtualBufferInSplit` with `panel_id: "glow-preview"` so repeated invocations update the existing pane rather than spawning new splits. Custom mode with at least `q` to close and `r` to refresh.
5. **Refresh on save:** Hook `buffer_save` event — if path ends in `.md`, re-fetch and re-render.
6. **Error handling:** Non-zero exit codes surface Glow's stderr in the status bar. Empty buffers produce a polite "nothing to preview" message.

## Acceptance criteria

- `Ctrl+Shift+M` (or equivalent) opens a vertical/horizontal split showing Glow-rendered Markdown for the current buffer
- Repeated invocation updates the same preview pane, doesn't spawn new splits
- Preview pane has a custom mode with `q` (close) and `r` (manual refresh)
- Saving a `.md` buffer auto-refreshes the preview
- Works for untitled buffers (no file path required — render whatever's in the buffer)
- Graceful failure when Glow isn't installed or buffer is empty

## Out of scope

- Configurable themes/styles (use `dark` hardcoded for v1)
- Scroll-sync between source and preview
- Live preview on keystroke (save-triggered only)
- Image rendering
- Non-markdown file previews

## Done — implemented 2026-06-11

### Files

| File | Purpose |
|---|---|
| `~/.config/fresh/plugins/glow-preview.ts` | Plugin — toggle, render, refresh, cleanup |
| `~/.config/glow/styles/fresh-high-contrast.json` | Glamour style matching Fresh high-contrast theme via ANSI color numbers |

### How it works

1. Plugin registers `"Glow Preview: Toggle"` in the Command Palette
2. User binds it to a key (Edit → Keybinding Editor, e.g. `Ctrl+Shift+M`)
3. On invocation: reads buffer text, runs `glow -s <style.json> <file>` via `spawnProcess`
4. Glow is wrapped in `bash -c 'CLICOLOR_FORCE=1 COLORTERM=truecolor ...' ` to force color output despite non-TTY stdout
5. Glow's ANSI-colored output is split into lines and fed to `createVirtualBuffer` as a full-screen tab
6. Custom mode `glow-preview` binds `q`/`Escape` → close + return to source, `r` → refresh
7. `after_file_save` hook auto-refreshes the preview when the source `.md` is saved
8. Untitled buffers are written to `/tmp/fresh-glow-preview-temp.md` and previewed from there

### Color matching approach

Fresh's high-contrast theme uses ratatui named colors (Cyan, Yellow, LightBlue, etc.)
which map to ANSI palette slots 0–15. The Glamour style JSON uses the same ANSI
slot numbers for markdown structure elements (headings, body, links, code).
Code block syntax highlighting (chroma) still uses hex — chroma doesn't accept
ANSI numbers — so code colors are approximate but close.
