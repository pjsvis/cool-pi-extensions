# cool-pi-extensions

A curated collection of extensions, CLI tooling, and prompts for the [Pi Coding Agent](https://github.com/earendil-works/pi-mono). Batteries included, entropy-free.

## Quick start

**macOS (known-good):**

```bash
git clone https://github.com/pjsvis/cool-pi-extensions.git ~/.pi/extensions
cd ~/.pi/extensions
brew install bun just gum skate glow
brew tap marcus/homebrew-tap && brew install td sidecar
curl -fsSL https://pi.dev/install.sh | sh   # pi coding agent
just install-deps     # verify everything's present
just orient           # agent orientation
just browse           # human doc browser
```

**Other platforms (Linux/Arch, WSL2 — untested):** clone, run `just install-deps`,
install what it reports missing, and file a PR for anything that breaks.
Per-tool install lines: [DEPENDENCIES.md](DEPENDENCIES.md).

---

The **Edinburgh Protocol** is the constraint stack that normalizes agent behavior
across models — Hume's skepticism, Smith's systems thinking, Watt's pragmatism.
Consistent results, less variance. See [SYSTEM.md](SYSTEM.md) — the Protocol is this repo's first-party operating prompt; third-party deps live in [DEPENDENCIES.md](DEPENDENCIES.md).

---

## What's in the box

### Extensions

**defuddle**
Fetch any webpage as clean Markdown. Domain allow/block lists, telemetry logging, `/defuddle` slash command.

**silo**
Soft filesystem boundary — blocks commands with literal paths outside the repo root. Catches accidental excursions; not hard isolation (see extension docs). "I'm staying in."

**edinburgh-evals**
Model behavioral gate. Thin port over the `pi-eval` CLI — `/eval <model>` command, `run_edinburgh_eval` LLM tool, `model_select` advisory hook. The CLI is the canonical eval engine (`src/cli/pi-eval/`).

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
Scottish Enlightenment principles — Hume's skepticism, Smith's systems thinking, Watt's pragmatism. See [SYSTEM.md](SYSTEM.md).

---

### Terminal-native stack

**Alacritty** → **herdr** → **pi** → **Fresh**. Cross-platform (macOS, Linux,
WSL2), SSH-native — session persistence, AI assistance, and a fast editor from
any terminal, anywhere.

- [**→ Stack architecture**](docs/terminal-stack.md)
- [**→ Install playbook**](playbooks/terminal-stack-playbook.md) — give pi the URL and it installs everything
- [**→ Full dev-stack setup**](playbooks/dev-stack-setup-playbook.md) — step-by-step onboarding guide

---

## Human interfaces

**Glow** is the human interface for markdown files. Type `glow` from any directory
to get an interactive file browser with live preview. No need to open files —
browse, preview, and navigate visually.

**sidecar** is the human monitor for agent sessions. Runs in a separate terminal
to show active worktrees, td session state, agent conversation history, and
merge workflow. Watch your agent work without interfering.

---

## Discoverable interface

A small surface for agents and humans:

- **Agents:** `just orient` — full orientation (branch, git state, active tasks, entry points).
- **Humans:** `just browse` — list all docs with descriptions, preview with glow.
- **Both:** type `glow` alone for an interactive markdown file picker.
- **Visiting agents:** `just adopt-edinburgh` applies the Protocol's constraint stack, then `just orient` initialises context:

```bash
just adopt-edinburgh   # apply Edinburgh Protocol (normalize behavior)
just orient            # context-initialization
```

---

## Detailed setup

### Install CLI tools globally

```bash
# pi-check — provider connectivity checker
cd src/cli/pi-check && bun install && bun link

# pi-models — models.json manager
cd src/cli/pi-models && bun install
```

### Activate extensions

```bash
mkdir -p ~/.pi/agent/extensions
ln -sf ~/.pi/extensions/src/extensions/defuddle/defuddle.ts ~/.pi/agent/extensions/defuddle.ts
cp -r ~/.pi/extensions/src/extensions/silo ~/.pi/agent/extensions/silo
```

### Set the system-prompt (optional)

```bash
ln -sf ~/.pi/extensions/SYSTEM.md ~/.pi/agent/AGENTS.md
```

---

## Extension details

**defuddle**

Fetch any webpage as clean Markdown via the [defuddle.md](https://defuddle.md) API.

**Commands:** `/defuddle <url>`, `/defuddle allow <domain>`, `/defuddle list`, `/defuddle stats`

---

**silo**

Soft filesystem boundary. Blocks commands whose literal arguments reference paths outside the repo root — catches the cooperative agent's accidental excursions. Does not withstand adversarial input (runtime-constructed paths, symlinks). Uses pi's built-in local bash backend so the agent sees the same environment and MVFS overlay as a normal session. Boundary behaviour verified by `bun test src/extensions/silo/`.

**Config:** `~/.pi/agent/extensions/silo/config.json` or `.pi/silo.json` (project-local):
```json
{ "siloRoot": "/path/to/repo", "enabled": true }
```

Escape hatch: `pi --no-silo`. Status: `/silo-status`.

---

**edinburgh-evals**

Model behavioral gate — thin port over the `pi-eval` CLI. The extension provides in-session ergonomics; the CLI is the canonical eval engine.

**Command:** `/eval <model-id>` — runs behavioral trap tests.

**Subcommands:**
`/eval <model>` — Run full eval suite
`/eval status [model]` — Show cached results
`/eval clear <model>` — Invalidate cache, force re-eval

**How it works:**
The extension shells out to `pi-eval run <model>`, which calls the model via OpenRouter/Ollama, runs deterministic assertions + optional Gemini grading, logs to `data/eval_log.json`, and renders the report. No session hijacking — the CLI does the work.

**Fixture:** `prompts/edinburgh-protocol-evals-v1.json` — [human-readable version](docs/edinburgh-protocol-evals.md)

**pi-eval CLI** (canonical eval engine):

```bash
just eval "pi run <model> --fixture=edinburgh"          # behavioral trap eval
just eval "pi score <model> --grade"                    # alignment scoring
just eval "pi matrix <model> --grade --triangular"      # primed/bare delta
just eval "pi status [model]"                           # cached results
just eval "pi fixtures --validate"                      # list + validate fixtures
```

See [CLI tools](#cli-tools) below for the full `just eval` facade.

---

**pi-check CLI**

```bash
pi-check                    # check all providers
pi-check openrouter         # check a specific provider
pi-check --json             # machine-readable output
pi-check --zenmux-mgmt      # include ZenMux account metrics
```

---

**pi-eval CLI**

```bash
just eval "pi run <model> --fixture=edinburgh"      # behavioral trap eval
just eval "pi score <model> --grade"                # alignment scoring + reasoning grader
just eval "pi matrix <model> --triangular"          # primed/bare delta (two graders)
just eval "pi status [model]"                       # cached results
just eval "pi fixtures --validate"                  # list + validate fixtures
just eval "pi list"                                 # available models
just eval "pi clear <model>"                        # invalidate cache
```

Canonical eval engine at `src/cli/pi-eval/` — one assertion engine, one grading path, one JSONL log. The `edinburgh-evals` extension is a thin port over this CLI.

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

---

## License

MIT
