# brief: Glow CMD+P mode toggle

**Created:** 2026-06-11
**Status:** implemented

## What

Make Fresh's Glow markdown preview behave as a robust mode toggle under the
local `CMD/⌘+P` binding.

## Why

The earlier attempt tried to make Glow follow Fresh Explorer clicks. That mixed
two responsibilities:

- Fresh owns file navigation and its default preview behavior.
- Glow owns a reading/preview mode.

The result was confusion between the buffer clicked in Explorer and the buffer
Glow should treat as its source.

The cleaner solution is to make the Glow toggle command robust regardless of how
the active buffer was reached.

## How

`Glow Preview: Toggle` now implements a simple mode state machine:

```text
Glow closed
  -> open Glow for the active buffer and focus the Glow split

Glow open, but not focused
  -> focus the Glow split

Glow open and focused
  -> close Glow and return to the original source split
```

Implementation details:

- Added `openPreviewFromBuffer(bufferId)` to open/render from the active buffer.
- Added `focusPreviewBuffer()` to focus the split containing the Glow preview.
- `glow_preview_toggle` now uses the mode state machine instead of trying to
  infer intent from Explorer events.
- The local Fresh keybinding remains `CMD/⌘+P` (`super+p`) in
  `~/.config/fresh/config.json`, with `"when": "global"` so the app handles it
  before panel-specific bindings.

## Acceptance criteria

- [x] Pressing `CMD/⌘+P` from a markdown/source buffer opens Glow preview.
- [x] Pressing `CMD/⌘+P` while Glow is focused closes it and returns to source.
- [x] Pressing `CMD/⌘+P` while Glow exists in the background focuses it.
- [x] Glow no longer subscribes to Explorer click/open events.
- [x] Existing `q`/`Escape` close and `r` refresh behavior remains intact.

## Files

| File | Purpose |
|---|---|
| `src/fresh/glow-preview.ts` | Robust Glow mode toggle. |
| `playbooks/extensions.md` | Lessons captured for Fresh plugin work. |
| `debriefs/004-glow-cmdp-mode-toggle.md` | Retrospective on the failed Explorer-sync approach and corrected model. |
