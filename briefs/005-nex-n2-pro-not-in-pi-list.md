# brief: Nex N2 Pro not visible in Pi model selector

**Created:** 2026-06-11
**Status:** complete (lesson documented)

## What

The model `nex-agi/nex-n2-pro:free` did not appear in Pi's model selector, despite
a prior Edinburgh Protocol eval having run successfully against it.

## What we did

1. Confirmed the model was in Pi's built-in registry (`models.generated.js`)
2. Confirmed the eval log (`.silo/eval_log.json`) showed successful calls via
   OpenRouter — so the model IS callable
3. Tried adding it to `modelOverrides` — silently ignored (unknown ID, per docs)
4. Tried adding it to `models` array under openrouter — still not visible
5. Documented the lessons in `playbooks/extensions.md`

## Root cause

The model is **already built-in** to pi. It should appear without any `models.json`
configuration. The actual reason for invisibility is unclear — may be a Pi UI
filter, auth state, or version mismatch. The eval runner uses the model directly
via API calls (bypassing the selector), so "works in eval" ≠ "visible in UI."

## Lessons

Documented in `playbooks/extensions.md` under **Pi Model Configuration — lessons learned**:

1. **Don't configure what's built-in.** Check `models.generated.js` first.
2. **`modelOverrides` only works for known built-in models.** Unknown IDs are
   silently ignored.
3. **`models` array on built-in providers merges custom models** — re-declaring
   built-in models may cause unexpected behavior.
4. **Eval runner bypasses the selector** — successful eval ≠ visible in UI.

## Action items

- [ ] Investigate why built-in `nex-n2-pro:free` isn't showing in selector
- [ ] Consider filing a Pi issue if this is a UI filtering bug
- [ ] Revert the `models` array addition to `openrouter` in `~/.pi/agent/models.json`
  (it was added speculatively and is not needed for a built-in model)