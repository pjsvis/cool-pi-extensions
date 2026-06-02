# cool-pi-extensions

A curated collection of extensions, CLI tooling, and prompts for the [Pi Coding Agent](https://github.com/earendil-works/pi-mono). Batteries included, entropy-free.

## What's in the box

### Extensions

| Extension | Description |
|---|---|
| **defuddle** | Fetch any webpage as clean Markdown. Domain allow/block lists, telemetry logging, `/defuddle` slash command. |
| **silo** | Hard filesystem boundary — agent cannot read or write outside the repo root. "I'm staying in." |

### CLI tools

| Tool | Description |
|---|---|
| **pi-models** | Bun + [citty](https://github.com/unjs/citty) CLI for managing `~/.pi/agent/models.json`. Add, remove, list, and validate providers and models. |

### Prompts

| Prompt | Description |
|---|---|
| **Edinburgh Protocol** | Scottish Enlightenment agent identity — Hume's skepticism, Smith's systems thinking, Watt's pragmatism. |

### Canon

Permanent, linkable references at [pjs.weblog.lol/canon](https://pjs.weblog.lol/canon/). Also mirrored at [pjsvis.github.io/cool-pi-extensions/canon](https://pjsvis.github.io/cool-pi-extensions/canon/).

## Quick start

```bash
git clone https://github.com/pjsvis/cool-pi-extensions.git ~/.pi/extensions
cd ~/.pi/extensions
flox activate
```

### Activate extensions

```bash
mkdir -p ~/.pi/agent/extensions
ln -sf ~/.pi/extensions/extensions/defuddle/defuddle.ts ~/.pi/agent/extensions/defuddle.ts
cp -r ~/.pi/extensions/extensions/silo ~/.pi/agent/extensions/silo
```

### Set the system prompt (optional)

```bash
ln -sf ~/.pi/extensions/prompts/edinburgh-protocol.md ~/.pi/agent/AGENTS.md
```

## Extension details

### defuddle

Fetch any webpage as clean Markdown via the [defuddle.md](https://defuddle.md) API.

**Commands:** `/defuddle <url>`, `/defuddle allow <domain>`, `/defuddle list`, `/defuddle stats`

**Tool:** `defuddle` — callable by the agent during sessions.

### silo

Hard filesystem boundary. Uses pi's built-in local bash backend (`createLocalBashOperations`) so the agent sees the same environment and MVFS overlay as a normal session.

**Config:** `~/.pi/agent/extensions/silo/config.json` or `.pi/silo.json` (project-local):
```json
{ "siloRoot": "/path/to/repo", "enabled": true }
```

Escape hatch: `pi --no-silo`. Status: `/silo-status`.

### pi-models CLI

```bash
pi-models list
pi-models add zai glm-5.1 --reasoning --price 1.40/5.60 --context 200000 --max-tokens 131072
pi-models remove minimax MiniMax-M2.1
pi-models validate
```

## Writing your own extension

```typescript
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export default function (pi: ExtensionAPI) {
  pi.on("session_start", async (_event, ctx) => {
    ctx.ui.notify("Loaded!", "info");
  });
}
```

See [pi's extension docs](https://github.com/earendil-works/pi-mono/blob/main/docs/extensions.md) for the full API reference.

## Dependencies

[Flox](https://flox.dev) provides `bun` for the `pi-models` CLI. Extensions run inside pi's runtime and don't need Flox.

Optional: `rtk` (token compression), `skate` (secret management). See [DEPENDENCIES.md](DEPENDENCIES.md).

## License

MIT