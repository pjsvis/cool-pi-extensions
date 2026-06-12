# Playbook: TailScale — Private Mesh Networking

## What it is

TailScale is a WireGuard-based mesh VPN. It creates a private network between your devices — Mac, iPhone, iPad, Omarchy, any Linux box — and gives each one a stable IP address that works from anywhere.

With TailScale, you can SSH to any device on your mesh from any other device, regardless of NAT, firewalls, or network topology. You get a fixed address (`100.x.x.x`) on a private network. No port forwarding. No dynamic DNS.

This is the connectivity layer of the terminal-native stack.

---

## Why it matters

**SSH from anywhere.** iPhone, iPad, Mac, Chromebook — connect to Omarchy as if it were on the local network. The address is always the same.

**No port forwarding.** Your router doesn't need to expose SSH. TailScale handles the tunnel.

**Zero-config.** Install, authenticate, done. The mesh is established automatically.

**Works with herdr.** Herdr sessions survive disconnections. Combined with TailScale, you have persistent sessions accessible from any device on the mesh.

---

## Setup

### 1. Install TailScale on every device

**macOS:**
```bash
brew install --cask tailscale
```

**iOS/iPadOS:**
Download from the App Store. Authenticate with the same account.

**Linux (Omarchy):**
```bash
curl -fsSL https://tailscale.com/install.sh | sh
```

**Verify:**
```bash
tailscale status
```

### 2. Authenticate

```bash
# On first run, authenticate
tailscale up

# This opens a URL. Open it in your browser and authenticate.
# The device joins your TailScale network.
```

Each device gets a `100.x.x.x` address. You'll see all devices:
```bash
tailscale status
```

Example output:
```
100.x.x.1    macbook.local      macOS
100.x.x.2    iphone.local       iOS
100.x.x.3    omarchy.local      linux
100.x.x.4    ipad.local         iOS
```

### 3. SSH over TailScale

From your Mac to Omarchy:
```bash
ssh user@100.x.x.3

# Or use the hostname
ssh user@omarchy.local
```

From your iPhone:
```bash
ssh user@omarchy.local
```

All devices can reach all other devices. No configuration needed per device.

---

## Key commands

```bash
tailscale up          # Start TailScale
tailscale down        # Stop TailScale
tailscale status      # Show all devices on the mesh
tailscale logout      # Remove this device from the network
tailscale ping <ip>   # Test connectivity to a device
tailscale serve       # Share a local service over TailScale
```

---

## SSH config for TailScale

Add to `~/.ssh/config` on your Mac for convenience:

```
Host omarchy
  HostName omarchy.local
  User your-user
  ServerAliveInterval 30
  ServerAliveCountMax 3

Host iphone
  HostName iphone.local
  User your-user

Host ipad
  HostName ipad.local
  User your-user
```

Now you can:
```bash
ssh omarchy
ssh iphone
```

---

## MagicDNS

TailScale provides MagicDNS — every device gets a consistent hostname based on its name. `omarchy.local`, `macbook.local`, etc. These resolve only on the TailScale network.

You don't need to remember IP addresses. Use hostnames.

---

## Exit nodes (optional)

If you want to route all your Mac's traffic through Omarchy (or another device):

```bash
# On your Mac, use Omarchy as an exit node
tailscale up --exit-node=omarchy.local

# Check if you're using an exit node
tailscale status
```

This is useful if Omarchy has a better internet connection, or if you want to browse from a specific IP.

---

## Subnet router (advanced)

If you have devices on your home network that aren't on TailScale (a NAS, a printer, etc.), you can set up a subnet router:

```bash
# On a device connected to the subnet
echo 1 | sudo tee /proc/sys/net/ipv4/ip_forward
tailscale up --advertise-routes=192.168.1.0/24
```

Accept the route in the TailScale admin console. Now all your TailScale devices can reach `192.168.1.0/24`.

---

## Troubleshooting

**Can't connect to a device:**
```bash
tailscale ping omarchy.local
```
If this fails, check that both devices are authenticated and online.

**Omarchy disconnects periodically:**
- Check that Omarchy isn't suspending (see `playbooks/omarchy-ssh-stability.md`)
- Check that the TailScale daemon is running: `systemctl status tailscaled`

**iPhone/iPad work but Mac doesn't:**
- The Mac may be on WiFi that blocks TailScale. Try a different network.
- Check that TailScale is connected on the Mac: `tailscale status`

**Slow connections:**
- Check latency: `tailscale ping omarchy.local`
- Try a different exit node if you're using one

---

## Security notes

- TailScale uses WireGuard encryption. Traffic between devices is encrypted.
- The admin console (tailscale.com) controls which devices can join your network.
- You can enable 2FA on your TailScale account.
- Devices you remove from the network lose access immediately.

---

## See also

- [tailscale.com](https://tailscale.com)
- `playbooks/herdr.md` — session management (works with TailScale)
- `playbooks/terminal-stack.md` — the full stack with TailScale as the connectivity layer
- `docs/terminal-stack.md` — architecture docs