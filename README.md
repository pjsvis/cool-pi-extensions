# cool-pi-extensions

A curated collection of extensions, CLI tooling, and prompts for the [Pi Coding Agent](https://github.com/earendil-works/pi-mono). Batteries included, entropy-free.

## What's in the box

### Extensions

| Extension | Description |
|---|---|
| **defuddle** | Fetch any webpage as clean Markdown. Domain allow/block lists, telemetry logging, `/defuddle` slash command. |
| **silo-sandbox** | Hard filesystem boundary — agent cannot read or write outside the repo root. "I'm staying in." |
| **herdr-agent-state** | Reports pi agent state (idle / working / blocked) to [herdr](https://herdr.io) for visual indicators. |

### CLI tools

| Tool | Description |
|---|---|
| **pi-models** | Bun + [citty](https://github.com/unjs/citty) CLI for managing `~/.pi/agent/models.json`. Add, remove, list, and validate providers and models. No more hand-editing JSON. |

### Prompts

| Prompt | Description |
|---|---|
| **Edinburgh Protocol** | Scottish Enlightenment agent identity — Hume's skepticism, Smith's systems thinking, Watt's pragmatism. Grounds the agent in empirical reasoning and conceptual entropy reduction. |

## Quick start

### 1. Clone

```bash
git clone https://github.com/petersmith/cool-pi-extensions.git ~/.pi/extensions
```

### 2. Activate Flox environment (CLI tools)

The `pi-models` CLI requires `bun`. Flox provides it without polluting your system PATH:

```bash
cd ~/.pi/extensions
flox activate

# Now you can run:
pi-models list
pi-models add minimax MiniMax-M3 --reasoning --price 0.60/2.40 --context 1000000 --max-tokens 512000
pi-models validate
```

If you prefer not to use Flox, install `bun` globally and add the CLI to your PATH:

```bash
ln -sf ~/.pi/extensions/cli/pi-models/src/main.ts ~/.local/bin/pi-models
chmod +x ~/.local/bin/pi-models
```

### 3. Activate extensions

Extensions are auto-discovered from `~/.pi/agent/extensions/`. Symlink them in:

```bash
mkdir -p ~/.pi/agent/extensions

# Symlink each extension (pi follows symlinks — tested and confirmed)
ln -sf ~/.pi/extensions/extensions/defuddle/defuddle.ts ~/.pi/agent/extensions/defuddle.ts
ln -sf ~/.pi/extensions/extensions/herdr-agent-state/herdr-agent-state.ts ~/.pi/agent/extensions/herdr-agent-state.ts
cp -r ~/.pi/extensions/extensions/silo-sandbox ~/.pi/agent/extensions/silo-sandbox
```

The silo-sandbox extension is a directory extension (has `package.json` + `index.ts`) so it needs to be copied rather than symlinked as a single file. Pi will auto-discover it on next start.

### 4. Set the system prompt (optional)

```bash
ln -sf ~/.pi/extensions/prompts/edinburgh-protocol.md ~/.pi/agent/AGENTS.md
```

Or use `--system-prompt`:

```bash
pi --system-prompt ~/.pi/extensions/prompts/edinburgh-protocol.md
```

## Extension details

### defuddle

Fetch any webpage as clean Markdown via the [defuddle.md](https://defuddle.md) API. Strips ads, navigation, cookie banners — returns only article content.

**Slash commands:**
- `/defuddle <url>` — Fetch a webpage
- `/defuddle allow <domain>` — Whitelist a domain that's normally blocked
- `/defuddle list` — Show current blacklist/whitelist
- `/defuddle stats` — Fetch success rates by domain

**Tool:** Registered as `defuddle` — callable by the agent during sessions.

**Telemetry:** All fetches are logged to `~/.pi/defuddle-log.jsonl` for debugging.

### silo-sandbox

Hard boundary: the agent cannot read, write, or execute anything outside the repository root. Every `bash` command is intercepted and path-checked.

**Config** (`~/.pi/agent/extensions/silo-sandbox/config.json`):
```json
{
  "siloRoot": "/path/to/repo",
  "enabled": true
}
```

When a command references a path outside `siloRoot`, the agent sees `Refused: "...". I'm staying in.` No data leakage.

### herdr-agent-state

Pings [herdr](https://herdr.io) via Unix socket whenever the agent changes state. Requires `herdr` running in the parent session. No config — auto-detects via `HERDR_PANE_ID` environment variable.

### pi-models CLI

```bash
# List all providers and their models
pi-models list
pi-models list minimax

# Add a new model
pi-models add zai glm-5.1 \
  --name "GLM-5.1" \
  --reasoning \
  --price 1.40/5.60 \
  --context 200000 \
  --max-tokens 131072 \
  --compat.supportsDeveloperRole false \
  --compat.maxTokensField max_completion_tokens

# Add a new provider with API key from 1Password/skate
pi-models add openai gpt-5.5 \
  --reasoning \
  --price 5.00/30.00 \
  --context 200000 \
  --max-tokens 128000 \
  --base-url https://api.openai.com/v1 \
  --api-key '!skate get openai_api_key'

# Remove a model (auto-cleans empty providers)
pi-models remove minimax MiniMax-M2.1

# Validate models.json
pi-models validate
```

## Writing your own extension

See [pi's extension docs](https://github.com/earendil-works/pi-mono/blob/main/docs/extensions.md) for the full API reference. Quick template:

```typescript
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export default function (pi: ExtensionAPI) {
  pi.on("session_start", async (_event, ctx) => {
    ctx.ui.notify("My extension loaded!", "info");
  });

  pi.registerCommand("my-cmd", {
    description: "Does my bidding",
    handler: async (args, ctx) => {
      ctx.ui.notify(`Args: ${args}`, "info");
    },
  });
}
```

## Dependencies

This repo uses [Flox](https://flox.dev) for reproducible tooling. `flox activate` gives you `bun` for the `pi-models` CLI. Extensions themselves run inside pi's runtime and don't need Flox.

If you don't use Flox: install `bun` globally and the extensions will still work — Flox is just a convenience layer.

## License

MIT