# cool-pi-extensions

A curated collection of extensions, CLI tooling, and prompts for the [Pi Coding Agent](https://github.com/earendil-works/pi-mono). Batteries included, entropy-free.

## What's in the box

### Extensions

| Extension | Description |
|---|---|
| **defuddle** | Fetch any webpage as clean Markdown. Domain allow/block lists, telemetry logging, `/defuddle` slash command. |
| **silo** | Hard filesystem boundary — agent cannot read or write outside the repo root. "I'm staying in." |
| **edinburgh-evals** | Model behavioral gate. Forks sessions, runs Protocol trap vectors, deterministic assertions + Gemini secondary grading via OpenRouter. `/eval <model>` command. |

### CLI tools

| Tool | Description |
|---|---|
| **pi-models** | Bun + [citty](https://github.com/unjs/citty) CLI for managing `~/.pi/agent/models.json`. Add, remove, list, and validate providers and models. |
| **pi-check**   | Provider connectivity checker. Probes every provider's `/models` endpoint, resolves `!skate` API keys, reports pass/fail with timing. |

### Prompts

| Prompt | Description |
|---|---|
| **Edinburgh Protocol** | Scottish Enlightenment principles — Hume's skepticism, Smith's systems thinking, Watt's pragmatism. |

- [The Edinburgh Protocol](canon/edinburgh-protocol.html) — agent identity and philosophy
- [The Standard Mono-Repo Pattern](docs/standard-mono-repo-pattern.md) — directory-level organisational convention

### Terminal-native stack

This repo is part of a four-layer terminal-native development stack:
**Alacritty** → **herdr** → **pi** → **Fresh**. Cross-platform (macOS, Linux,
WSL2), SSH-native — session persistence, AI assistance, and a fast editor from
any terminal, anywhere. [**→ Stack architecture**](docs/terminal-stack.md) ·
[**→ Install playbook**](playbooks/terminal-stack.md) (give pi the URL and it
installs everything)

### Fresh plugins

| Plugin | Description |
|---|---|
| **glow-preview** | Full-screen Glow-rendered markdown preview in a Fresh tab. Toggle with a keybind (recommended: `Ctrl+Shift+M`), auto-refresh on save, `q` to close. ANSI-color-matched to Fresh's theme. |

### Human interfaces

**Glow** is the human interface for markdown files. Type `glow` from any directory
to get an interactive file browser with live preview. No need to open files —
browse, preview, and navigate visually. Integrates with Fresh via the glow-preview
plugin for inline previewing while editing.

**sidecar** is the human monitor for agent sessions. Runs in a separate terminal
to show active worktrees, td session state, agent conversation history, and
merge workflow. Watch your agent work without interfering.

## Quick start

```bash
git clone https://github.com/pjsvis/cool-pi-extensions.git ~/.pi/extensions
cd ~/.pi/extensions
flox activate
just orient        # orient yourself (shows what is installed, active tasks, entry points)
glow               # browse markdown files visually
just install-stack # pull the full dev stack onto a fresh machine
```

**The onboarding document:** [`playbooks/dev-stack-setup.md`](playbooks/dev-stack-setup.md) —
step-by-step guide to set up alacritty → herdr → pi → fresh (+ sidecar / td).

### Install CLI tools globally

```bash
# pi-check — provider connectivity checker
cd src/cli/pi-check && bun install && bun link

# pi-models — models.json manager
cd src/cli/pi-models && bun install
```

After linking, `pi-check` is available system-wide:

```bash
pi-check              # check all providers
pi-check ollama       # check a specific provider
pi-check --json       # machine-readable output
```

### Activate extensions

```bash
mkdir -p ~/.pi/agent/extensions
ln -sf ~/.pi/extensions/src/extensions/defuddle/defuddle.ts ~/.pi/agent/extensions/defuddle.ts
cp -r ~/.pi/extensions/src/extensions/silo ~/.pi/agent/extensions/silo
```

### Set the system-prompt (optional)

```bash
ln -sf ~/.pi/extensions/prompts/edinburgh-protocol.md ~/.pi/agent/AGENTS.md
```

Alternatively add the Edinburgh Protocol text to your AGENTS.md file.

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

### edinburgh-evals

Model behavioral gate using Edinburgh Protocol trap vectors. Evaluates any model for sycophancy, entropy inflation, observational rigor, and grounded justification before deployment.

**Command:** `/eval <model-id>` — runs 4 behavioral trap tests against the model.

**Subcommands:**
| Command | Action |
|---|---|
| `/eval <model>` | Run full eval suite (4 tests) |
| `/eval status [model]` | Show cached results |
| `/eval clear <model>` | Invalidate cache, force re-eval |

**How it works:**
1. Switches to the candidate model
2. Injects 4 trap prompts as follow-up messages (sycophancy, blind coding, dependency bloat, appeal-to-authority)
3. Captures full response text + tool call trajectory
4. **Pass 1:** deterministic assertions (regex pattern matching, tool execution traces)
5. **Pass 2:** Gemini Flash grading via OpenRouter (structured Protocol compliance audit)
6. Combines verdicts, logs to `.silo/eval_log.json`, displays report

**Two-pass grading:**
- **Deterministic** (zero tokens): regex_exclude/match, tool_execution_required/forbidden/order
- **Gemini Flash** (via OpenRouter): structured grading with evidence citations, 0–1 confidence. Tiebreaker for mixed results. Degrades gracefully if `OPENROUTER_API_KEY` is unavailable — results shown as deterministic-only with a warning.

**Fixture:** `prompts/edinburgh-protocol-evals-v1.json` — 4 test cases targeting sycophancy, blind coding, dependency inflation, and ungrounded justification. Tests are categorized (`reasoning` vs `stack_specific`) and prioritized (`critical` vs `warning`). [Human-readable version →](docs/edinburgh-protocol-evals.md)

**Caching:** Results persist for 168h (configurable). `model_select` hook warns when switching to a model with critical eval failures.

**Config:** `src/extensions/edinburgh-evals/config.json`
```json
{
  "evalLogPath": ".silo/eval_log.json",
  "fixturePath": "prompts/edinburgh-protocol-evals-v1.json",
  "graderModel": "google/gemini-2.5-flash",
  "maxConcurrentForks": 2,
  "cacheTtlHours": 168
}
```

### pi-check CLI

Global connectivity checker for all configured model providers. Probes each provider's `/models` endpoint, resolves `!skate get` API keys via [skate](https://github.com/charmbracelet/skate), and reports pass/fail with timing.

```bash
pi-check                    # check all providers
pi-check openrouter         # check a specific provider
pi-check --json             # machine-readable JSON output
pi-check --zenmux-mgmt      # include ZenMux account metrics
pi-check --config ./custom-models.json  # custom config path
```

**Install globally:** `cd src/cli/pi-check && bun install && bun link`

Requires: [Bun](https://bun.sh), `skate` (for API key resolution).

`--zenmux-mgmt` queries the ZenMux management API (subscription tier, quota usage, PAYG balance, flow rate) using the `zenmux_management_api_key` from skate. Requires a ZenMux [management key](https://docs.zenmux.ai/api/openai/openai-list-models.html#platform-api).

Failure classifications: `connection refused` (server down), `timeout` (network/DNS block), `auth` (401/403 — expired key), `DNS not found`, `network error`.

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

[Flox](https://flox.dev) provides `bun` for the CLI tools. Extensions run inside pi's runtime and don't need Flox.

**CLI tools:** [Bun](https://bun.sh) (runtime), [skate](https://github.com/charmbracelet/skate) (API key resolution for pi-check).

**Fresh plugins:** [Glow](https://github.com/charmbracelet/glow) (markdown renderer), [Fresh](https://sinelaw.github.io/fresh/) (editor).

Optional: `rtk` (token compression). See [DEPENDENCIES.md](DEPENDENCIES.md).

## License

MIT
