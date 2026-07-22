# Playbook: terminal-stack

## Purpose

Pi-executable install playbook for the terminal-native development stack.
Give pi this URL and say "install the terminal stack for me." Pi reads the
playbook, detects the platform, and installs everything.

```
pi "install the terminal stack from https://raw.githubusercontent.com/pjsvis/cool-pi-extensions/main/playbooks/terminal-stack.md"
```

Every step is idempotent — pi checks if the tool is already installed before
attempting installation. No step should fail if re-run.

---

## Platform detection

Start by running `uname -s` to detect the platform:



**`Darwin`** — macOS → Homebrew (install if missing)
**`Linux`** — Linux → apt (Debian/Ubuntu) or detect
**`MINGW*` or `MSYS*`** — Windows (Git Bash / WSL) → winget or apt (inside WSL)

If on macOS and `brew` is not found, install Homebrew first:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

If on Linux and `apt` is available, use apt. If neither brew nor apt are
found, fall back to manual install instructions from each tool's website.

---

## Step 1: Node.js (prerequisite for pi)

Pi requires Node.js >= 22. Check first:

```bash
node --version
```

If Node >= 22 is not found, install via Homebrew (macOS) or NodeSource (Linux):

```bash
# macOS
brew install node

# Linux (NodeSource)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Verify: `node --version` should show v22.x or later.

---

## Step 2: Alacritty

```bash
# macOS
brew install --cask alacritty

# Linux
sudo apt install -y alacritty

# Windows
winget install Alacritty.Alacritty
```

Verify: `which alacritty` returns a path.

---

## Step 3: herdr

```bash
# macOS — Homebrew
brew install herdr

# macOS / Linux — installer script
curl -fsSL https://herdr.dev/install.sh | sh

# Linux — if apt has it (check first)
sudo apt install -y herdr 2>/dev/null || curl -fsSL https://herdr.dev/install.sh | sh
```

Verify: `which herdr` returns a path.

---

## Step 4: pi (coding agent)

```bash
npm install -g --ignore-scripts @earendil-works/pi-coding-agent
```

Verify: `which pi` returns a path. Run `pi --version` to confirm.

---

## Step 5: Fresh (editor)

```bash
# macOS
brew install fresh-editor

# Linux — check if available via package manager, otherwise:
# Fresh may need to be built from source or installed via cargo
# Check https://sinelaw.github.io/fresh/ for latest Linux instructions
```

Verify: `which fresh` returns a path.

---

## Step 6: Glow (markdown renderer)

```bash
# macOS
brew install glow

# Linux
sudo apt install -y glow
```

Verify: `which glow` returns a path. Run `glow --version` to confirm.

---

## Step 7: cool-pi-extensions

Clone the extension repo and set up symlinks:

```bash
# Clone if not already present
if [ ! -d ~/.pi/extensions ]; then
  git clone https://github.com/pjsvis/cool-pi-extensions.git ~/.pi/extensions
fi

# Symlink pi extensions into pi's extension directory
mkdir -p ~/.pi/agent/extensions
ln -sf ~/.pi/extensions/src/extensions/defuddle/defuddle.ts ~/.pi/agent/extensions/defuddle.ts
ln -sf ~/.pi/extensions/src/extensions/silo ~/.pi/agent/extensions/silo
ln -sf ~/.pi/extensions/src/extensions/edinburgh-evals ~/.pi/agent/extensions/edinburgh-evals

# Install CLI tools
cd ~/.pi/extensions/src/cli/pi-check && bun install && bun link
cd ~/.pi/extensions/src/cli/pi-models && bun install

# Set up the Edinburgh Protocol as the system prompt (optional)
ln -sf ~/.pi/extensions/prompts/edinburgh-protocol.md ~/.pi/agent/AGENTS.md
```

---

## Step 8: Smoke test

```bash
# Verify all tools are installed
which alacritty && echo "✓ alacritty"
which herdr && echo "✓ herdr"
which pi && echo "✓ pi"
which fresh && echo "✓ fresh"
which glow && echo "✓ glow"

# Verify pi extensions are linked
ls ~/.pi/agent/extensions/defuddle.ts && echo "✓ defuddle extension"
ls ~/.pi/agent/extensions/silo/index.ts && echo "✓ silo extension"
ls ~/.pi/agent/extensions/edinburgh-evals/index.ts && echo "✓ edinburgh-evals extension"

echo "All checks passed. The terminal stack is installed."
```

---

## Step 9: Instructions for the user

After installation, tell the user:

> The terminal stack is installed. Here's how to use it:
>
> **Start herdr** (session manager):
> ```
> herdr
> ```
>
> **In herdr, start pi** (coding agent):
> - Press `Ctrl+B` then `Shift+N` to create a workspace
> - Type `pi` and press Enter
> - Authenticate with `/login` or set an API key
>
> **Open Fresh** (editor):
> - Press `Ctrl+B` then `C` to create a new tab
> - Type `fresh` and press Enter
>
> **Keybindings:**
> - `Ctrl+B Q` — detach herdr (everything keeps running)
> - `Ctrl+B B` — toggle sidebar (see agent states)
> - `Ctrl+B V` — split pane vertically
> - `Ctrl+B C` — new tab
>
> The entire stack works over SSH. Connect from anywhere and `herdr` will
> restore your session.
