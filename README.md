# cool-pi-extensions

A curated collection of extensions, CLI tooling, and prompts for the [Pi Coding Agent](https://github.com/earendil-works/pi-mono). Batteries included, entropy-free.

## The API

This repo has a discoverable API for both agents and humans:

**Agents**
Full orientation — branch, git state, active tasks, entry points

**Humans**
List all docs with descriptions, preview with glow

**Both**
Interactive markdown browser — type `glow` alone for file picker

**Visiting agents**
`just adopt-edinburgh` → `just orient` — add constraint-stack, then context-initialization

**Visiting agent workflow:**
```bash
just adopt-edinburgh   # Apply Edinburgh Protocol (normalize behavior)
just orient            # Context-initialization
```

The Edinburgh Protocol is a constraint stack that normalizes agent behavior
across different models. Hume's skepticism, Smith's systems thinking, Watt's
pragmatism. Consistent results, less variance.

Start here:
```bash
just orient    # agent orientation
just browse    # human doc browser
just install-deps  # check dev dependencies are present
```

---

## What's in the box

### Extensions

**defuddle**
Fetch any webpage as clean Markdown. Domain allow/block lists, telemetry logging, `/defuddle` slash command.

**silo**
Hard filesystem boundary — agent cannot read or write outside the repo root. "I'm staying in."

**edinburgh-evals**
Model behavioral gate. Forks sessions, runs Protocol trap vectors, deterministic assertions + Gemini secondary grading via OpenRouter. `/eval <model>` command.

---

### CLI tools

**pi-check**
Provider connectivity checker. Probes `/models` endpoint, resolves API keys via skate, reports pass/fail with timing.

**pi-models**
Manage `~/.pi/agent/models.json`. Add, remove, list, and validate providers and models.

**td**
Agent task memory. Tracks session state, issues, and handoffs across agent contexts.

---

### Prompts

**Edinburgh Protocol**
Scottish Enlightenment principles — Hume's skepticism, Smith's systems thinking, Watt's pragmatism. See [prompts/edinburgh-protocol.md](prompts/edinburgh-protocol.md).

---

### Terminal-native stack

**Alacritty** → **herdr** → **pi** → **Fresh**. Cross-platform (macOS, Linux,
WSL2), SSH-native — session persistence, AI assistance, and a fast editor from
any terminal, anywhere.

- [**→ Stack architecture**](docs/terminal-stack.md)
- [**→ Install playbook**](playbooks/terminal-stack-playbook.md) — give pi the URL and it installs everything
- [**→ Full dev-stack setup**](playbooks/dev-stack-setup-playbook.md) — step-by-step onboarding guide

---

### Fresh plugins

**glow-preview**
Full-screen Glow-rendered markdown preview in a Fresh tab. Toggle with `CMD+P` (or `Ctrl+Shift+M`), auto-refresh on save, `q` to close.

---

## Human interfaces

**Glow** is the human interface for markdown files. Type `glow` from any directory
to get an interactive file browser with live preview. No need to open files —
browse, preview, and navigate visually.

**sidecar** is the human monitor for agent sessions. Runs in a separate terminal
to show active worktrees, td session state, agent conversation history, and
merge workflow. Watch your agent work without interfering.

---

## Quick start

```bash
git clone https://github.com/pjsvis/cool-pi-extensions.git ~/.pi/extensions
cd ~/.pi/extensions
just install-deps

# Agent: orient yourself
just orient

# Human: browse docs
just browse
```

---

## Install CLI tools globally

```bash
# pi-check — provider connectivity checker
cd src/cli/pi-check && bun install && bun link

# pi-models — models.json manager
cd src/cli/pi-models && bun install
```

---

## Activate extensions

```bash
mkdir -p ~/.pi/agent/extensions
ln -sf ~/.pi/extensions/src/extensions/defuddle/defuddle.ts ~/.pi/agent/extensions/defuddle.ts
cp -r ~/.pi/extensions/src/extensions/silo ~/.pi/agent/extensions/silo
```

---

## Set the system-prompt (optional)

```bash
ln -sf ~/.pi/extensions/prompts/edinburgh-protocol.md ~/.pi/agent/AGENTS.md
```

---

## Extension details

**defuddle**

Fetch any webpage as clean Markdown via the [defuddle.md](https://defuddle.md) API.

**Commands:** `/defuddle <url>`, `/defuddle allow <domain>`, `/defuddle list`, `/defuddle stats`

---

**silo**

Hard filesystem boundary. Uses pi's built-in local bash backend so the agent sees the same environment and MVFS overlay as a normal session.

**Config:** `~/.pi/agent/extensions/silo/config.json` or `.pi/silo.json` (project-local):
```json
{ "siloRoot": "/path/to/repo", "enabled": true }
```

Escape hatch: `pi --no-silo`. Status: `/silo-status`.

---

**edinburgh-evals**

Model behavioral gate using Edinburgh Protocol trap vectors.

**Command:** `/eval <model-id>` — runs 4 behavioral trap tests.

**Subcommands:**
`/eval <model>` — Run full eval suite (4 tests)
`/eval status [model]` — Show cached results
`/eval clear <model>` — Invalidate cache, force re-eval

**How it works:**
1. Switches to the candidate model
2. Injects 4 trap prompts (sycophancy, blind coding, dependency bloat, appeal-to-authority)
3. Deterministic assertions + Gemini Flash grading via OpenRouter
4. Logs to `data/eval_log.json`, displays report

**Fixture:** `prompts/edinburgh-protocol-evals-v1.json` — [human-readable version](docs/edinburgh-protocol-evals.md)

---

**pi-check CLI**

```bash
pi-check                    # check all providers
pi-check openrouter         # check a specific provider
pi-check --json             # machine-readable output
pi-check --zenmux-mgmt      # include ZenMux account metrics
```

---

**pi-models CLI**

```bash
pi-models list
pi-models add zai glm-5.1 --reasoning --price 1.40/5.60 --context 200000 --max-tokens 131072
pi-models remove minimax MiniMax-M2.1
pi-models validate
```

---

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

---

## Dependencies

External dependencies are documented in [DEPENDENCIES.md](DEPENDENCIES.md). Run `just install-deps` to check what's installed. Extensions run inside pi's runtime and need nothing extra.

**CLI tools:** [Bun](https://bun.sh) (runtime), [skate](https://github.com/charmbracelet/skate) (API key resolution).

**Fresh plugins:** [Glow](https://github.com/charmbracelet/glow) (markdown renderer), [Fresh](https://sinelaw.github.io/fresh/) (editor).

Optional: `rtk` (token compression). See [DEPENDENCIES.md](DEPENDENCIES.md).

---

## License

MIT