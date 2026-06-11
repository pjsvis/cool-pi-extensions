# Playbook: extensions/

## Purpose

Extensions and plugins — TypeScript modules that extend pi's behavior (custom tools, commands, event hooks) or Fresh editor's behavior (virtual buffers, overlays, external tool integration).

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

## Fresh Editor Plugins

Fresh editor plugins (distinct from pi SDK extensions) run in a sandboxed QuickJS
environment inside the Fresh terminal editor. They use the global `editor` object
for all I/O: buffer operations, process spawning, virtual buffers, overlays, and
event hooks.

### Directory structure

```
~/.config/fresh/
├── plugins/
│   ├── my-plugin.ts          # Plugin entry point
│   └── lib/                  # Shared plugin libraries (optional)
├── types/
│   └── fresh.d.ts            # TypeScript API surface (auto-generated)
└── config.json               # Fresh configuration
```

### Conventions

- One `.ts` file per plugin in `~/.config/fresh/plugins/`
- Include `/// <reference path="../types/fresh.d.ts" />` at the top for type safety
- Use `editor.registerCommand()` to expose actions in the Command Palette (`Ctrl+P`)
- Keybindings are configured separately: **Edit → Keybinding Editor** in Fresh
- Use `editor.defineMode()` for custom keybinding contexts (e.g., preview panels)
- Virtual buffers get custom modes with `q` (close) and `r` (refresh) conventions
- State lives in module-level variables (persists across function calls but not
  editor sessions)

### Plugin lifecycle

1. Plugin `.ts` file is transpiled (via oxc) and executed in QuickJS on startup
2. `editor.registerCommand()`, `editor.defineMode()`, `editor.on()` run at load time
3. Command handlers must be attached to `globalThis` (editor calls them by name)
4. State cleanup: subscribe to `buffer_closed` to tear down when source/preview
   buffers close

### Key API patterns

| Task | API |
|---|---|
| Register a command | `editor.registerCommand(name, desc, handlerName, context)` |
| Open a virtual buffer (full tab) | `editor.createVirtualBuffer({ name, mode, readOnly, entries })` |
| Open a virtual buffer (split pane) | `editor.createVirtualBufferInSplit({ name, mode, ratio, direction, panelId, entries })` |
| Run an external command | `editor.spawnProcess(cmd, args, cwd)` → `ProcessHandle<SpawnResult>` |
| Read buffer content | `editor.getBufferText(bufferId, start, end)` → `Promise<string>` |
| Define custom mode | `editor.defineMode(name, [[key, action], ...], readOnly)` |
| Subscribe to events | `editor.on("after_file_save" \| "buffer_closed" \| ..., handler)` |

### External tool integration pattern

Fresh plugins can shell out to CLI tools via `spawnProcess`. Key considerations:

1. **Non-TTY color**: Many CLI renderers (Glow, bat, etc.) detect non-TTY stdout
   and strip ANSI colors. Use `bash -c 'CLICOLOR_FORCE=1 COLORTERM=truecolor cmd'`
   as a wrapper to force color output.
2. **Color palette matching**: When the tool supports ANSI color numbers (0–15)
   instead of hex, use those — they map to the same terminal palette slots that
   ratatui (Fresh's rendering engine) uses, producing visually identical colors.
3. **Hex fallback for code blocks**: Glamour's chroma syntax highlighter requires
   hex colors; ANSI numbers aren't accepted. Accept the slight mismatch for code
   syntax coloring.
4. **State defense**: After any external buffer close (user presses `q`),
   validate cached buffer IDs with `editor.getBufferInfo(id)` before acting on
   them. Built-in actions like `close_current_tab` may not reliably trigger
   `buffer_closed` on virtual buffers.
5. **Untitled buffers**: Write buffer content to a temp file (`/tmp/...`) and
   point the external tool at the temp file.

### Glow Preview Plugin — lessons learned

The `glow-preview.ts` plugin (brief `004-glow-fresh-preview.md`) revealed
several patterns worth preserving:

- **Full-tab > split for reading modes**. Markdown preview is a reading context
  shift, not a side-by-side reference. `createVirtualBuffer` (opens as a tab)
  gives the output room to breathe; `q`/`Escape` returns to the source instantly.
- **Own the close lifecycle**. Binding `q` to a custom `glow_preview_close`
  handler that explicitly zeros out state is more reliable than delegating to
  `close_current_tab` (which may not fire `buffer_closed` for virtual buffers).
- **Toggle needs three states**: preview focused → close it; preview in
  background → switch to it; no preview → open one. The middle state prevents
  duplicate previews when the user tabs away and presses the shortcut again.
- **Temp file for untitled buffers**: `editor.writeFile("/tmp/...", content)`
  then point Glow at the temp file. No stdin piping complexity.
- **Auto-refresh on save**: `editor.on("after_file_save", ...)` refreshes the
  preview. Guard with `previewBufferId !== 0` to avoid work when the preview
  isn't open.

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
