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

| `uname -s` output | Platform | Package manager |
|---|---|---|
| `Darwin` | macOS | Homebrew (install if missing) |
| `Linux` | Linux | apt (Debian/Ubuntu) or detect |
| `MINGW*` or `MSYS*` | Windows (Git Bash / WSL) | winget or apt (inside WSL) |

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

### Step 6b: rtk (token killer — optional)

```bash
# macOS
brew install rtk

# macOS / Linux — installer script
curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh | sh
```

After install, integrate with pi:
```bash
rtk init -g --agent pi
```

This installs a pi extension that auto-rewrites shell commands through rtk's
filter, saving 60-90% of token consumption on common dev commands.

Verify: `which rtk` returns a path. Run `rtk --version` to confirm.

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
cd ~/.pi/extensions/src/cli/pi-check && npm install
cd ~/.pi/extensions/src/cli/pi-models && npm install

# Set up the Edinburgh Protocol as the system prompt (optional)
ln -sf ~/.pi/extensions/prompts/edinburgh-protocol.md ~/.pi/agent/AGENTS.md
```

---

## Step 8: Set up Glow preview plugin for Fresh

```bash
# Create Fresh plugin directory if missing
mkdir -p ~/.config/fresh/plugins

# Copy the glow-preview plugin from the repo
cp ~/.pi/extensions/src/fresh/glow-preview.ts ~/.config/fresh/plugins/glow-preview.ts

# Copy the ANSI-color-matched Glow style
mkdir -p ~/.config/glow/styles
cp ~/.pi/extensions/src/fresh/glow-preview.ts /dev/null  # placeholder, actual style is at:
# The style file needs to be written by pi. Use the style JSON from:
# https://raw.githubusercontent.com/pjsvis/cool-pi-extensions/main/src/fresh/glow-preview.ts
# Actually, the style is embedded in the plugin — pi should write it:

cat > ~/.config/glow/styles/fresh-high-contrast.json << 'STYLE_EOF'
{
  "document": {
    "color": "15",
    "background_color": "0",
    "margin": 1
  },
  "heading": {
    "color": "14",
    "bold": true
  },
  "h1": {
    "color": "11",
    "bold": true,
    "prefix": "\n",
    "suffix": "\n"
  },
  "h2": {
    "color": "14",
    "bold": true,
    "prefix": "\n"
  },
  "h3": {
    "color": "14",
    "bold": true,
    "prefix": "\n"
  },
  "h4": {
    "color": "12"
  },
  "h5": {
    "color": "12"
  },
  "h6": {
    "color": "8"
  },
  "block_quote": {
    "indent": 1,
    "indent_token": "│ ",
    "color": "8"
  },
  "paragraph": {},
  "text": {},
  "strong": {
    "bold": true
  },
  "emph": {
    "italic": true
  },
  "strikethrough": {
    "crossed_out": true,
    "color": "8"
  },
  "hr": {
    "color": "8",
    "format": "\n──────────\n"
  },
  "link": {
    "color": "12",
    "underline": true
  },
  "link_text": {
    "color": "14",
    "bold": true
  },
  "code": {
    "prefix": " ",
    "suffix": " ",
    "color": "10",
    "background_color": "0"
  },
  "code_block": {
    "color": "#FFFFFF",
    "margin": 0,
    "chroma": {
      "text": { "color": "#FFFFFF" },
      "comment": { "color": "#808080" },
      "keyword": { "color": "#00FFFF" },
      "keyword_type": { "color": "#FF00FF" },
      "name_function": { "color": "#FFFF00" },
      "name_class": { "color": "#00FFFF", "underline": true, "bold": true },
      "name_builtin": { "color": "#FFFF00" },
      "literal_string": { "color": "#00FF00" },
      "literal_number": { "color": "#ADD8E6" },
      "background": { "background_color": "#000000" }
    }
  }
}
STYLE_EOF
```

Note: the plugin references the style at an absolute path. If the user's
home directory is not `/Users/petersmith`, pi must update the path in
`glow-preview.ts` to match `$HOME/.config/glow/styles/fresh-high-contrast.json`.

---

## Step 9: Smoke test

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

# Verify Fresh plugin is installed
ls ~/.config/fresh/plugins/glow-preview.ts && echo "✓ glow-preview plugin"

# Verify Glow style is installed
ls ~/.config/glow/styles/fresh-high-contrast.json && echo "✓ glow style"

echo "All checks passed. The terminal stack is installed."
```

---

## Step 10: Instructions for the user

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
> **Glow preview in Fresh**:
> - Open a `.md` file in Fresh
> - Press `Ctrl+P` and type "Glow Preview"
> - Or bind it to a key: Edit → Keybinding Editor → search "Glow Preview"
>   → Add Binding → press `Ctrl+Shift+M`
>
> **Keybindings:**
> - `Ctrl+B Q` — detach herdr (everything keeps running)
> - `Ctrl+B B` — toggle sidebar (see agent states)
> - `Ctrl+B V` — split pane vertically
> - `Ctrl+B C` — new tab
> - In Fresh preview: `q` to close, `r` to refresh
>
> The entire stack works over SSH. Connect from anywhere and `herdr` will
> restore your session.
