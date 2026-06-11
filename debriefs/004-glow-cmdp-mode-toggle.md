# Debrief: 004 — Glow CMD+P Mode Toggle

**Date:** 2026-06-11
**Status:** Complete
**TD Epic:** td-af8a78

## What we tried to build

We wanted the Glow markdown preview to feel more integrated with Fresh Explorer
navigation. The initial idea was:

> When a user clicks a markdown file in the Explorer, update the Glow preview
> automatically.

That sounded useful, but the implementation started to blur two different
concepts:

1. **What Fresh clicked/opened** — Fresh's navigation state.
2. **What Glow should preview** — Glow's mode state.

The result was a plugin that reacted to the wrong abstraction. It followed
Explorer events, then had to recover when Fresh's own default preview buffer
became the active buffer.

## What worked

### Reverting was the right engineering move

The Explorer-sync experiment produced three separate attempts:

1. Basic Explorer sync.
2. Preserve close target by separating source/displayed buffers.
3. Focus the preview split after sync.

Each attempt made the model more complicated without solving the core UX issue.
Reverting to the original Glow behavior was the correct move because it restored
a clean boundary:

- Fresh handles navigation.
- Glow handles preview mode.

### CMD/⌘+P should be a mode toggle

The robust solution is not to make Glow follow every Explorer click. The robust
solution is to make the Glow command reliable from any active context.

The command now behaves as:

```text
closed -> open/focus Glow
open/background -> focus Glow
open/focused -> close and return to source
```

That is simple, testable, and matches how users think about a preview mode.

### Explicit focus matters

`editor.showBuffer(bufferId)` was not enough for the UX we wanted. A buffer can
be shown without the split/focus state being where the user expects.

The corrected helper uses the preview buffer's split list:

```ts
const info = editor.getBufferInfo(previewBufferId);
const splitId = info?.splits[0] || editor.getActiveSplitId();
editor.focusSplit(splitId);
editor.showBuffer(previewBufferId);
```

This makes `CMD/⌘+P` behave like a real mode transition.

## What did not work

### Subscribing Glow to Explorer events

Explorer events are navigation signals, not preview-mode signals. Using them to
drive Glow created coupling to Fresh's default preview lifecycle, especially the
ephemeral single-click preview buffers.

That coupling made the plugin reason about transient buffers it should not own.

### Treating clicked buffer as source buffer

The clicked buffer is not always the buffer Glow should return to on close. In
particular, Fresh's Explorer single-click preview can be ephemeral. Making that
buffer the Glow source caused close/return behavior to become unreliable.

## Design principle validated

**Keep ownership boundaries sharp.**

- Fresh owns file navigation.
- Glow owns markdown preview mode.
- The toggle command bridges the two.

This is a cleaner abstraction than trying to make Glow mirror every navigation
event.

## Files changed

| File | Purpose |
|---|---|
| `src/fresh/glow-preview.ts` | Robust `CMD/⌘+P` mode toggle and explicit preview focus. |
| `playbooks/extensions.md` | Captured Fresh plugin lessons. |
| `briefs/007-glow-cmdp-mode-toggle.md` | Brief for the corrected approach. |
| `debriefs/004-glow-cmdp-mode-toggle.md` | This debrief. |

## Next steps

- Test the `CMD/⌘+P` flow manually in Fresh.
- If focus still feels wrong, inspect whether `BufferInfo.splits` is stale and
  whether `editor.updatePluginStateSnapshot()` is needed before focusing.
- Do not reintroduce Explorer event subscriptions unless there is a clear
  user-facing reason and a clean ownership model.
