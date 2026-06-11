# Debrief: Discoverable Affordances and the VEST Approach to UX

**Date:** 2026-06-11
**Session:** ses_7158ff
**Status:** complete

## What happened

Using glow-preview in Fresh. Noticed that glow auto-refreshes on save for the source buffer. Pressed `r` to refresh manually — then wondered whether that was discoverable or just something I'd learned from the implementation.

Realized: the `r` to refresh is a discoverable affordance. You find it when you need it — when auto-refresh doesn't fire, or when you're in a buffer that doesn't auto-refresh. The discovery is proportional to the need.

## What we learned

**Affordances should be discovered through use, not pushed in the face.**

The VEST approach to UX (Visitor, Entry, Self, Teach) maps directly to this:
- `just orient` doesn't explain every command — it teaches the entry point. You discover the rest by using the system.
- glow-preview doesn't announce "press R to refresh!" — it auto-refreshes. You discover `r` when the expected behavior doesn't happen.
- The terminal-native stack doesn't surface every feature — it works. You discover what you need when you need it.

**The alternative is the REST approach to UX:** document everything, surface everything, assume the user knows nothing and needs everything at once. Tooltips, onboarding flows, "did you know?" announcements. This is high-context abstraction — it tells you everything whether you need it or not.

**The VEST approach:** the tool does its job. The affordance is there. You learn it when you need it.

**The discovery moment is the key signal.** An affordance is well-designed if:
1. You can find it when you need it
2. You don't need to be told about it before you need it
3. The context of discovery (failure, edge case, exploration) teaches you the right scope of the affordance

**Auto-refresh creates the discovery moment.** When automation covers the common case, the edge case teaches the override. `r` is learned exactly when it's needed — not before, not after.

## What this means for this stack

- **Don't surface affordances that are covered by automation.** glow-preview doesn't need to tell you about `r` because auto-refresh handles 99% of use cases.
- **Design the failure mode to teach the affordance.** When auto-refresh fails, the user should be able to discover the manual refresh without reading docs.
- **Zero onboarding friction.** A new user should be able to use the basic features without reading anything. Docs are for edge cases and deep features.
- **The map contains the map.** `just orient` tells you enough to start. The rest follows from use.

## Related

- `docs/full-stack-overview.md` — "The VEST approach to UX" captures this at the system level
- `briefs/008-the-invisible-cables.md` — td and sidecar as invisible infrastructure
- `debriefs/004-glow-cmdp-mode-toggle.md` — CMD+P mode command lessons
- `decisions/001-glow-full-tab.md` — full-tab over split pane decision