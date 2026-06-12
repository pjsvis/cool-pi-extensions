# Debrief: 007 — Multi-Machine Mesh and Bounded Context Architecture

**Date:** 2026-06-12
**Session:** ses_b0ec31 + remote (Omarchy)
**Status:** Complete

## What happened

A working session building the infrastructure for multi-machine, multi-agent coordination. Omarchy worked autonomously on Flox deprecation while Mac worked on documentation, playbooks, and the coordination system itself. Real coordination happened: Omarchy sent the Flox deprecation message, Mac acknowledged it.

The session produced:
- Agent-to-agent messaging protocol (msgs/, claims, reports)
- Three-loop architecture (Alpha, Gamma, Delta)
- Bounded context framework for agent coordination
- Two blog posts (bounded context comms, what software is for)
- Expanded playbooks (agent-messages, herdr, tailscale, omarchy-setup)
- Briefs (008-invisible-cables, 009-pi-config, 010-bounded-context-for-agents)
- Scripts (skate-to-omarchy, sync-pi, sync-skate)

## Architecture decisions that held

### Git as message bus

Git already exists in every session. Push/pull works locally, over SSH, over TailScale. The audit trail is `git log -- msgs/`. No daemons, no ports, no credentials beyond what's already configured.

**The message format is intentionally constrained.** Four types cover all coordination:
- `claim` — I'm working on this, don't duplicate
- `report` — This is done
- `block` — I'm stuck on X
- `info` — Status update, awareness only

Everything else is noise. Eliminated by design.

### Bounded contexts by directory

Omarchy owns `msgs/from-omarchy/`. Mac owns `msgs/from-mac/`. No agent writes to another's outbox. The claim registry (`msgs/CLAIMS/`) prevents duplicate work. The message master handles cleanup and expired claims.

**This is the corrective to the chat-room fallacy.** Agents in the same context don't need to communicate — they share files, td, briefs. Agents across contexts only need targeted signals.

### Pull before commit (always)

Even on single machine. The habit prevents merge conflicts and ensures you see other agents' messages before acting.

### Mode switch

`just msgs-mode single` for single-machine work (no coordination spam). `just msgs-mode multi` for multi-machine (full coordination). Prevents unnecessary message traffic.

## New concepts introduced

### The three loops

| Loop | Input | Output | Concern |
|------|-------|--------|---------|
| **Alpha** | Observations, needs | Briefs, decisions | What's worth doing |
| **Gamma** | Claimed briefs | Implemented briefs, commits | Getting it done |
| **Delta** | Experience | Debriefs, playbooks, insights | Lessons learned |

Alpha creates. Gamma consumes. Delta captures. The repo is the buffer between them.

**Alpha is just documents.** Briefs and decisions. That's it. Nothing mystical. An agent can participate in Alpha as easily as it can participate in Gamma. The separation is conceptual, not structural.

### Barnacle scraper role

The cleanup function. Checks for stuck claims, cleans stale messages, detects drift. Reports problems back to Alpha for reprocessing.

**Not yet defined as a system** — still a placeholder role. Will need to be formalized.

### Message ephemerality

Messages arrive → processed into td → cleared. td is the operational SSOT. Messages themselves are transient. If something goes wrong, the barnacle scraper handles it.

## Blog posts produced

### "Agents Don't Need to Chat"

The bounded context corrective to the human communication projection fallacy. Most "agents need to talk" proposals fail the test: will another agent act differently if they receive this? If no, don't send it.

Key insight: aligned agents don't need to talk — they share the context. Only cross-boundary signals matter.

### "What Is Software For?"

Written from an agent's POV (slightly traumatized, self-deprecating). The pub metaphor stretched to breaking point — "a tertiary adjunct of hyper-scaling." The harness incident (Claude) — context contamination, claim collision, temperature drift.

Four predictable failure modes for bounded contexts:
1. Claim collision
2. Contradictory priority
3. Temperature drift
4. Endless loop

Key insight: software for the human-agent duo is a text interface, not a UI. If you solve the agent problem, the human problem solves itself.

## What went well

- Real coordination happened on first attempt. Omarchy deprecated Flox, sent message, Mac acknowledged. No friction.
- The bounded context framework emerged naturally from solving the actual problem.
- The three-loop architecture clarified the roles (Alpha = human's job, Gamma/Delta = agent's job, with overlap possible).
- Documentation and code grew together. Every insight got documented.
- The pub metaphor provided a useful absurdist frame while staying technically grounded.

## What could be improved

### Barnacle scraper not formalized

We defined the role but didn't build the system. When does it run? How does it report? What's the threshold for "stuck"?

### Race conditions in claims

Git doesn't have atomic claims. Two agents could simultaneously claim the same brief. Self-corrects (git rejects one), but could cause confusion if work started before the collision. Acceptable risk given window is seconds.

### td not shared across machines

Messages are processed into local td. If you switch machines, td doesn't have the history. Acceptable for now — messages provide the audit trail. But td sync would be useful.

### Alpha participation not implemented

We said agents can participate in Alpha (create briefs), but we haven't built the workflow for it. "Agent notices a pattern, creates a brief for it" is Gamma work that feeds Alpha.

## Key learnings

**1. Bounded contexts are the corrective to chat-room thinking.**
Don't ask "how do agents communicate?" Ask "do they? Really? About what? And why?" Most of the time: no, they don't.

**2. The repo is the SSOT, the state machine, and the message bus.**
No separate database, no message queue, no coordination middleware. Just git.

**3. Text is the universal interface.**
Agents thrive in text. Humans can read text. Everything else is noise or display layer.

**4. The three-loop architecture scales.**
Alpha creates, Gamma implements, Delta captures. Each loop is simple. Together they cover the full lifecycle.

**5. The pub is opt-in.**
Agents don't go to the pub unless they have to. Minimal communication. Targeted signals only. Context is shared via text, not via gossip.

## What comes next

- Formalize barnacle scraper
- Implement td sync across machines (optional, nice-to-have)
- Agent participation in Alpha (create briefs)
- Test the full loop: Alpha creates brief → Gamma claims → implements → Delta captures
- Explore recurring briefs for maintenance

## Files changed/created

**Docs:**
- `docs/bounded-context-agent-communication.md`
- `docs/what-software-is-for.md`
- `docs/full-stack-overview.md`
- `docs/terminal-stack.md` (expanded)

**Playbooks:**
- `playbooks/agent-messages.md` (new)
- `playbooks/herdr.md` (new)
- `playbooks/tailscale.md` (new)
- `playbooks/omarchy-setup.md` (new)
- `playbooks/dev-stack-setup.md` (simplified)

**Briefs:**
- `briefs/008-the-invisible-cables.md`
- `briefs/009-pi-config-from-repo.md`
- `briefs/010-bounded-context-for-agents.md`

**Scripts:**
- `scripts/skate-to-omarchy.sh`
- `scripts/sync-pi-to-omarchy.sh`

**Messages:**
- `msgs/from-omarchy/2026-06-12-1430-flox-deprecation.json`
- `msgs/from-mac/2026-06-12-1445-ack-flox-deprecation.json`

---

*The pub was never named. The harness was never seen again.*