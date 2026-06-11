# Decision: Glow toggle is a mode command, not an Explorer follower

**Date:** 2026-06-11
**Status:** decided

## Context

Fresh already provides a default file-explorer preview for single-click file
navigation. We considered making the Glow markdown preview follow Explorer
clicks so that selecting a markdown file would update the Glow preview
automatically.

That approach required Glow to subscribe to Fresh navigation/open events and to
distinguish Fresh's default preview buffers from the markdown source buffer Glow
should return to on close.

## Decision

Glow should not follow Explorer clicks.

Instead, the Glow toggle command (`Glow Preview: Toggle`, locally bound to
`CMD/⌘+P`) should be a robust mode command:

```text
Glow closed
  -> open Glow for the active buffer and focus the Glow split

Glow open, but not focused
  -> focus the Glow split

Glow open and focused
  -> close Glow and return to the original source split
```

Fresh owns navigation. Glow owns preview mode.

## Rationale

- **Ownership boundary**: Explorer navigation and markdown preview mode are
  different responsibilities. Mixing them made the plugin reason about Fresh's
  ephemeral preview buffers.
- **Cleaner UX**: Users can use Fresh's native Explorer behavior, then enter or
  exit Glow mode with a predictable command.
- **Simpler lifecycle**: The plugin only needs to track the source buffer/split
  it opened from and whether the Glow preview buffer currently exists.
- **Avoids transient-source bugs**: Fresh's single-click preview buffers can be
  ephemeral. They should not silently become Glow's close/return target.
- **Mode commands are easier to test**: The toggle has three states and does not
  depend on how the active buffer was reached.

## Consequences

- Glow will not automatically update when a user merely clicks another file in
  Explorer.
- To preview a newly selected markdown file, the user presses `CMD/⌘+P`.
- The command must explicitly focus the Glow split; `showBuffer` alone is not
  enough for reliable mode entry.
- The source buffer/split remains stable until Glow is closed, avoiding
  surprising return behavior.
