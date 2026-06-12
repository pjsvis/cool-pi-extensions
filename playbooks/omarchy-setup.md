# Playbook: Omarchy Setup

## What is Omarchy?

Omarchy is the headless Linux box under the desk. It's the remote machine that runs the terminal-native stack — pi, herdr, Fresh, sidecar, td.

You SSH in from your Mac (or iPhone/iPad) and work there. It's always on, always connected via TailScale, always running the agent session.

---

## Fresh machine — what to do first

### 1. Disable suspend

A headless machine under a desk should never sleep:

```bash
sudo systemctl mask sleep.target suspend.target hibernate.target
```

Verify:
```bash
systemctl status sleep.target
# Should show: "Loaded: masked"
```

### 2. Update the system

```bash
sudo apt update && sudo apt upgrade -y
```

### 3. Install core tools

```bash
# Essential
sudo apt install -y git curl build-essential

# Node.js (required for pi)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
node --version  # should be v22.x
npm --version
```

---

## SSH setup

### Generate SSH key

```bash
ssh-keygen -t ed25519 -C "omarchy@cool-pi-extensions"
# Press Enter to accept default location (~/.ssh/id_ed25519)
# Add a passphrase (recommended)
```

### Add public key to GitHub

```bash
cat ~/.ssh/id_ed25519.pub
```

Copy the output. On github.com:
- Go to Settings → SSH and GPG keys → New SSH key
- Paste the public key
- Give it a title like "Omarchy"

### Test SSH to GitHub

```bash
ssh -T git@github.com
# Should say: "Hi [username]! You've successfully authenticated..."
```

If you get "Permission denied (public key)":
- Check that you added the *public* key (`.pub` file) to GitHub, not the private key
- Check file permissions: `chmod 600 ~/.ssh/id_ed25519`
- Run `ssh -vT git@github.com` to see what's happening

---

## Clone the repo

```bash
cd ~
git clone https://github.com/pjsvis/cool-pi-extensions.git
cd cool-pi-extensions
```

---

## Install TailScale

TailScale gives you a stable address on your private mesh:

```bash
# Install
curl -fsSL https://tailscale.com/install.sh | sh

# Authenticate
sudo tailscale up

# This will print a URL. Open it in your browser to authenticate.
# The machine joins your TailScale network and gets a 100.x.x.x address.

# Verify
tailscale status
# You should see all your devices
```

Now you can SSH to Omarchy via `ssh user@omarchy.local` from any device on your TailScale network.

---

## Install herdr

```bash
# Linux
curl -fsSL https://herdr.dev/install.sh | sh

# or
sudo apt install herdr

# Verify
which herdr
```

Configure SSH config for herdr-style connections:
```bash
# Add to ~/.ssh/config on your Mac
# Host omarchy
#   HostName omarchy.local
#   User your-user
#   ServerAliveInterval 30
```

---

## Install td (agent task memory)

```bash
# From marcus/homebrew-tap (macOS) or check for Linux options
# If not available via apt, check:
# https://github.com/marcusjensen/homebrew-tap

# Alternative: use npm if td has a Node package
npm install -g td-cli  # check if this exists

# Verify
which td
```

---

## Install pi (the agent)

```bash
npm install -g @mariozechner/pi-coding-agent

# Authenticate with your provider
# (depends on your auth setup — skate, env vars, etc.)

# Verify
which pi
pi --version
```

---

## Install Fresh (editor)

Download from [getfresh.dev](https://getfresh.dev) and install:
```bash
# Check the website for Linux install instructions
# Fresh may need to be built from source or installed via cargo
```

Install the glow-preview plugin:
```bash
mkdir -p ~/.config/fresh/plugins
ln -s ~/cool-pi-extensions/src/fresh/glow-preview.ts ~/.config/fresh/plugins/glow-preview.ts
```

---

## Install glow (markdown preview)

```bash
sudo apt install glow
# or
brew install glow  # if you have brew on Linux
```

---

## Provision the repo

```bash
cd ~/cool-pi-extensions

# Check what's installed
just provision

# Install what's missing
just dev  # or individual just tasks

# Verify
just orient
```

`just orient` should report the current branch, git state, active td tasks, and entry points. You're ready.

---

## First session workflow

From your Mac:
```bash
ssh user@omarchy.local

# On Omarchy, start herdr
herdr

# In herdr, create the stack tabs:
# tab 1: pi
# tab 2: fresh
# tab 3: sidecar (if you want to watch)
# tab 4: shell

# In tab 1, start pi
pi

# Work
```

---

## Troubleshooting

### SSH connection drops

**Suspend issue:** If Omarchy disconnects periodically, it might be suspending:
```bash
sudo systemctl mask sleep.target suspend.target hibernate.target
```

**Network issue:** Check TailScale connectivity:
```bash
tailscale status
tailscale ping omarchy.local
```

### GitHub auth fails

**Permission denied (public key):**
```bash
# Check that the key is being offered
ssh -vT git@github.com 2>&1 | grep -E 'Offering|Authentications'

# Reload ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Verify permissions
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub
```

### just commands not found

```bash
# Install just
curl --proto '=https' --tlsv1.2 -sSf https://just.systems/install.sh | bash -s -- --to /usr/local/bin

# Verify
which just
just --version
```

---

## See also

- `playbooks/herdr.md` — herdr keybindings and session management
- `playbooks/tailscale.md` — TailScale setup and troubleshooting
- `playbooks/dev-stack-setup.md` — what the stack is and how to configure it
- `docs/terminal-stack.md` — architecture overview