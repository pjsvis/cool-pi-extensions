# Debrief: 006 — Two-Machine Multi-Agent Mesh

**Date:** 2026-06-12
**Status:** Complete
**TD Epic:** n/a (infrastructure setup)

## What we built

A fully functioning two-machine multi-agent control surface in a single Alacritty window. Two machines (Omarchy on Arch, a Mac on macOS) connected via Tailscale mesh, coordinated via git-native messaging, accessible from either machine over SSH. One repo (`cool-pi-extensions`), two bounded contexts, zero new infrastructure.

The motivating test: Omarchy deprecates Flox, sends a message via `msgs/from-omarchy/`, Mac pulls and acknowledges. Real coordination, real bounded contexts, real git audit trail. It worked on the first exchange.

## Architecture decisions that worked

### Git as message bus, not sidecar

We had three options for inter-agent communication: (a) a message queue or chat protocol, (b) SSH-based command dispatch, (c) git-native JSON files in `msgs/`. Option (c) won because git already existed in every session, already worked over Tailscale, already had an audit trail (`git log -- msgs/`), and required zero new daemons, ports, or credentials.

The message format is intentionally constrained. Four types cover all coordination: `claim`, `report`, `block`, `info`. Everything else is noise — and was eliminated by design.

### Bounded contexts by directory, not by protocol

Omarchy owns `msgs/from-omarchy/`. Mac owns `msgs/from-mac/`. No agent writes to another's outbox. The claim registry (`msgs/CLAIMS/`) prevents duplicate work without a lock manager. The message master handles cleanup, expired claim detection, and reassignment.

This is the corrective to the chat-room fallacy. Agents in the same context don't need to communicate — they share files, td, briefs. Agents across contexts only need targeted signals.

### Flox deprecation as real-world test

The first multi-machine message was not synthetic. Omarchy deprecated Flox — a real operational change. The message was sent with `type: info`, `action_needed: none`, bounded context annotation. Mac pulled, read, acknowledged at 14:45. Status: resolved.

This validated the entire pipeline: Tailscale, git push/pull, message format, bounded context discipline, and `just msgs-*` commands. A contrived test would have told us less.

### Flox removal as dependency simplification

Flox promised cross-Linux install simplicity but, on an Arch system with pre-existing Nix, became a 1,119-derivation compile farm. Stripping it and replacing with `just install-deps` — a shell script checking `command -v` — was simpler and more portable. A 90-line bash script beat a Nix-based environment manager when pacman, brew, and mise were already on different machines.

### Tailscale as zero-config mesh

Four devices on the mesh. Ping between Omarchy and Mac: 6ms, 0% loss, direct connection. MagicDNS resolves hostnames without `/etc/hosts` edits. SSH works over the mesh with the same keys as local. No port forwarding, no DynDNS, no VPN config files.

## Things we'd do differently

### SSH key exchange should be automated

The only friction point was SSH key authorization. Omarchy's ed25519 key was rejected by the Mac. Manual fix: copy the pubkey, add to `authorized_keys`. A `just mesh-authorize` command would close this.

### Flox should have been evaluated earlier

We spent time fighting a deb extraction, nix store path mismatches, and a 1,119-derivation build before concluding Flox was wrong. A 5-minute evaluation against the existing toolchain would have caught this. Lesson: check what's already installed before installing anything.

### The messaging playbook arrived mid-session

`playbooks/agent-messages.md` was pulled from remote *after* we built the messaging infrastructure. It described the system we had just built. Lesson: pull before orienting. Always.

## Design principles validated

1. **Zero new infrastructure.** Git, SSH, Tailscale were already running. Messages are directories and JSON files — nothing that needed a daemon, port, or new credential.
2. **Bounded contexts enforced by filesystem.** Directory ownership prevents cross-context writes.
3. **Self-describing system.** `just orient` reports multi-machine mode, active messages, mesh status.
4. **Pull before commit is non-negotiable.** The discipline prevents merge conflicts and missed signals.
5. **Control plane is GitHub.** Push/pull for coordination means same auth, same audit trail, same availability as the code.

## Next steps

- Automate SSH key exchange: `just mesh-authorize`
- Add mesh status to `just orient`
- Test three-machine setup (iPad/iPhone as third agent host)
- Document bounded context handoff protocol for brief reassignment
