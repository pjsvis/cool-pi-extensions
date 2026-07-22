# Playbook: extensions/

## Purpose

Extensions — TypeScript modules that extend pi's behavior (custom tools, commands, event hooks).

## Directory structure

```
extensions/
├── extension-name/
│   ├── index.ts        # Entry point (exports default function)
│   ├── package.json    # Pi extension metadata + npm dependencies
│   ├── config.json     # Default configuration
│   ├── types.ts        # Type definitions (optional)
│   └── ...             # Additional modules
```

## Conventions

- One extension per directory
- Entry point: `index.ts` exporting a default function `(pi: ExtensionAPI) => void | Promise<void>`
- Use `package.json` with `"pi": { "extensions": ["./index.ts"] }` for discoverability
- Config files use JSON with a `DEFAULT_CONFIG` constant in the extension code
- Symlink extensions into `~/.pi/agent/extensions/` for global availability
- Use `pi.registerCommand()` for user-facing slash commands
- Use `pi.registerTool()` for LLM-callable tools
- Use `pi.on("event_name", handler)` for lifecycle hooks

## External dependencies

Extensions run inside pi's runtime. Available imports:
- `@earendil-works/pi-coding-agent` — ExtensionAPI, events, tool factories
- `typebox` — Schema definitions for tool parameters
- `node:*` — All Node.js built-ins

For npm dependencies, add a `package.json` with `dependencies` and run `npm install` in the extension directory. Pi resolves `node_modules/` next to extension files automatically.

## Testing extensions

- Symlink to `~/.pi/agent/extensions/` for global loading
- Use `pi -e ./path.ts` for quick one-off tests
- `/reload` reloads all extensions without restarting pi

## Reference

- [Pi extension docs](https://github.com/earendil-works/pi-mono/blob/main/docs/extensions.md)
- [Pi TUI components](https://github.com/earendil-works/pi-mono/blob/main/docs/tui.md)

---

## Pi Model Configuration — lessons learned

**Incident:** `nex-agi/nex-n2-pro:free` was not visible in Pi's model selector.

### What happened

1. The model was already in Pi's **built-in registry** (`pi-ai/dist/models.generated.js`)
   — confirmed by grep. It should have appeared automatically, no config needed.
2. It was added to `openrouter.modelOverrides` in `~/.pi/agent/models.json`.
3. Per the [Pi models docs](https://github.com/earendil-works/pi-mono/blob/main/docs/models.md):
   *"`modelOverrides` are applied to built-in provider models. Unknown model IDs are ignored."*
4. So `modelOverrides` was silently doing nothing — the entry was unknown to Pi.
5. I moved the model to `openrouter.models` array. Still not visible after restart.

### Key lessons

1. **Don't configure what's built-in.** If a model is in `pi-ai/dist/models.generated.js`,
   it appears automatically. Adding it to `models.json` is at best redundant,
   at worst causes unexpected provider behavior.
2. **Check the registry first.** Before touching `models.json`, verify:
   ```bash
   grep "model-id" ~/.local/share/fnm/node-versions/v22.22.2/installation/lib/node_modules/@earendil-works/pi-coding-agent/node_modules/@earendil-works/pi-ai/dist/models.generated.js
   ```
   If found → it's built-in, no config needed.
3. **`modelOverrides` is only for overriding existing built-in models.** It cannot
   register new ones. Unknown IDs are silently ignored.
4. **`models` array on built-in providers is for merging custom models**, not for
   re-declaring built-in models. Adding a `models` array to OpenRouter may switch
   it into a "static config" mode that suppresses the dynamic built-in list.
5. **If a built-in model doesn't appear in the TUI selector**, the issue is likely:
   - `enabledModels` allowlist in `~/.pi/agent/settings.json` — only listed models
     appear in the TUI selector. CLI `--list-models` ignores this filter.
     Fix: add the model ID to `settings.json.enabledModels` array.
   - Auth not configured for the provider (`hasConfiguredAuth` check)
   - A Pi version mismatch (built-in list may differ between versions)

### `enabledModels` allowlist in settings.json

The TUI model selector respects `~/.pi/agent/settings.json` → `enabledModels`, an
**explicit allowlist**. Models not in this array are hidden from the selector,
but remain callable via CLI (`--model nex-agi/nex-n2-pro:free`) and API.

```bash
# Check
cat ~/.pi/agent/settings.json | jq '.enabledModels'

# Add a model
cat ~/.pi/agent/settings.json | jq '.enabledModels += ["nex-agi/nex-n2-pro:free"]' \
  > /tmp/settings.json && mv /tmp/settings.json ~/.pi/agent/settings.json
```

**Rule:** After adding a new model, remember to add it to `enabledModels` if you
want it visible in the interactive selector.

### Verification checklist

```bash
# 1. Is it in the built-in registry?
grep "model-slug" ~/.local/share/fnm/node-versions/v22.22.2/installation/lib/node_modules/@earendil-works/pi-coding-agent/node_modules/@earendil-works/pi-ai/dist/models.generated.js

# 2. Does the provider have auth?
skate get open_api_key  # or whatever key the provider needs

# 3. Does pi see it via CLI?
pi --list-models | grep "model-slug"

# 4. Check models.json is valid JSON
cat ~/.pi/agent/models.json | jq -e 'true'
```

### Reference

- [Pi models docs](https://github.com/earendil-works/pi-mono/blob/main/docs/models.md)
- Built-in registry: `node_modules/@earendil-works/pi-ai/dist/models.generated.js`
- `model-registry.js` in pi-coding-agent `dist/core/` handles merge semantics

---

## Manifest systems & barnacle control

**Incident:** `cool-pi-extensions` accumulated small documentation drift after a
repo reorganization: `MANIFEST.md` missed docs, `.flox/env/manifest.toml`
referenced old `cli/` paths, and one playbook still said `npm install`.

### TradingAgents reference implementation

`~/Dev/GitHub/TradingAgents` has a much heavier manifest system worth studying:

- `SILO_MANIFEST.md` — agent orientation and asset map.
- `*/INDEX.jsonl` registries for briefs, debriefs, decisions, docs, playbooks,
  code, scripts, and lexicon.
- `reg.ts` — unified registry CLI (`list`, `sync`, `check`, `enrich`,
  `mine`, `import`, `promote`, `state`, `scripts`).
- `barnacle-scrubber.ts` — mechanical + optional LLM scan for stale
  docs, path rewrites, redundant prose, and drydock quarantine.

That system is appropriate for a large, evolving codebase with many agents and
many generated artifacts. It is overkill for this repo.

### Cool-pi-extensions approach

Use a **bounded manifest checker**, not a full registry framework:

```bash
just check
```

`scripts/check-manifest.ts` checks:

1. `MANIFEST.md` lists every file in `docs/`, `playbooks/`, `briefs/`,
   `debriefs/`, `decisions/`, and `prompts/`.
2. `MANIFEST.md` has no stale entries.
3. Internal markdown links resolve.
4. Known path drift is absent:
   - `.flox/env/manifest.toml` uses `src/cli/...`, not old `cli/...`.
   - `playbooks/terminal-stack.md` uses `bun install`, not `npm install`.
   - `docs/edinburgh-protocol-eval.md` uses `src/cli/pi-check/...`.

### Principle

Gödel says a formal system cannot be both complete and consistent. We are not
pretending to solve completeness. We are enforcing the invariants that matter:

- The index matches the filesystem.
- Internal links resolve.
- Old path conventions do not quietly re-enter.
- Install commands match the repo standard.

That is enough to stop barnacles forming at the documentation boundary.
