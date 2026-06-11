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

The model was already in Pi's **built-in registry** AND callable via API (eval
runner proved it). The actual reason for TUI invisibility:

**`~/.pi/agent/settings.json` → `enabledModels` is an explicit allowlist.**

Only 6 models were listed. `nex-agi/nex-n2-pro:free` was not in the list, so
the TUI selector filtered it out — even though `--list-models` showed it fine.

**Lesson:** `--list-models` bypasses the `enabledModels` filter. "Visible via CLI"
≠ "visible in TUI selector."

## Lessons

Documented in `playbooks/extensions.md` under **Pi Model Configuration — lessons learned**:

1. **Don't configure what's built-in.** Check `models.generated.js` first.
2. **`modelOverrides` only works for known built-in models.** Unknown IDs are
   silently ignored.
3. **`models` array on built-in providers merges custom models** — re-declaring
   built-in models may cause unexpected behavior.
4. **Eval runner bypasses the selector** — successful eval ≠ visible in UI.

## Action items

- [x] Add model to `settings.json.enabledModels` — fixed, model now visible
- [x] Revert the `models` array addition to `openrouter` — done
- [ ] Update playbook with `enabledModels` allowlist lesson — done in `playbooks/extensions.md`
- [ ] Consider a Pi UX improvement: warn when a model is in `models.json`
  but not in `enabledModels`, or show all models by default with a filter option