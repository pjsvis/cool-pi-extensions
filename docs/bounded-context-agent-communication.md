# Agents Don't Need to Chat: A Field Report on Bounded Context Communication

**or: Why Most Agent Coordination Systems Are Wrong**

---

When you tell most people you have multiple AI agents working together, their first question is: "How do they communicate?"

The expected answer involves chat protocols, message queues, Telegram bots, WhatsApp groups, Slack channels — some middleware that lets agents send messages to each other.

The question itself is wrong.

## The Fallacy

Humans communicate to share context. We don't know what others know, so we talk. We update. We gossip. We loop each other in. Communication is how we transfer context between heads.

Agents don't have this problem.

An agent working in a bounded context — the same files, the same task database, the same brief — doesn't need to be "brought up to speed." It already has the context. The worktree is shared. The td database is shared. It opens the same files, reads the same history, knows the same state.

**The fallacy:** Projecting human communication patterns onto agents. Assuming they need to talk because we do.

## What Agents Actually Need

Agents need to know one thing across context boundaries: **who is doing what.**

Not constant updates. Not status broadcasts. Not "I'm thinking about this now." Just: this brief is claimed, that brief is done, this one is blocked.

That's it.

The coordination that matters:
1. **Claims** — "I'm working on this, don't duplicate"
2. **Completion** — "This is done"
3. **Blocks** — "I'm stuck on X, need help"
4. **Awareness** — "This happened that affects your context"

Everything else is noise.

## Bounded Contexts

The bounded context is the agent's world:
- The worktree it edits
- The task database (td) it manages  
- The brief it's assigned
- Its inputs and outputs

Within a bounded context, agents don't communicate — they share. The td database is the same. The files are the same. Communication is redundant.

Across bounded contexts, agents communicate only when information crosses the boundary in a way that changes behavior.

This is the corrective to the chat-room fallacy.

## The System

Our coordination system:

```
cool-pi-extensions/
└── msgs/
    ├── from-mac/
    ├── from-omarchy/
    ├── CLAIMS/           # Brief claim registry
    └── ARCHIVE/
```

Messages are JSON files. Delivery is git push/pull. The td database is the operational SSOT.

**Claim before work:**
```bash
just msgs-claim --brief 001
# Creates msgs/CLAIMS/brief-001.json
# Others see it, don't duplicate
```

**Report completion:**
```bash
just msgs-report --brief 001 --status complete
# Others see it, update their context
```

**Pull before commit:**
```bash
git pull
just msgs-inbox
# Process any cross-context messages
# Continue with td task management
```

**Single machine mode:**
```bash
just msgs-mode single
# No coordination spam when alone
```

That's it. No message broker. No chat protocol. No Telegram bot.

## Why It Works

**It matches reality.** Agents in the same context don't need to talk. Agents across contexts only need targeted signals (claims, blocks, completions).

**It scales.** Partition briefs between machines. Each machine has its bounded context. Briefs don't overlap. Coordination is minimal.

**It's disciplined.** Claim before work. Do it or lose it. Report completion. Message master cleans up stale claims. If someone slacks off, reassign the brief.

**It has low noise.** Only cross-context messages that change behavior are sent. Intra-context noise is eliminated by design.

## Scalability

The "problem" people anticipate is: "What happens when you have 10 agents? 100 agents?"

You partition.

Each brief goes to one agent in one bounded context. Briefs don't overlap. Agents don't need to coordinate — they just do their work.

The coordination overhead is O(n) where n is the number of bounded contexts, not O(n²) like a chat system where everyone talks to everyone.

And if an agent slacks off? Reclaim the brief, reassign it, notify the offender. The system is self-correcting.

## What We've Built

- **td** — task database. SSOT for agent operations.
- **msgs/** — git-native coordination. Claims, reports, blocks.
- **Message master** — cleanup, expired claim detection, reassignment.
- **Mode switch** — single machine (no spam) vs multi machine (full coordination).

The control plane is GitHub. The operational SSOT is td. The communication is targeted signals only.

## The Obvious Answer

Why are people building chat systems for agents?

Maybe because it's familiar. Humans chat, so agents should too. It's the obvious solution to the wrong problem.

Or maybe because it's easier to sell. "Our agents communicate via AI-powered chat" sounds impressive. "Our agents share a task database and only send cross-context claims" sounds like infrastructure.

But the obvious answer is: agents don't need to chat. They need bounded contexts. They need shared state. They need targeted coordination signals. They need to know who is doing what.

Everything else is noise.

---

*This repo implements this pattern. See `playbooks/agent-messages.md` for the technical details and `briefs/010-bounded-context-for-agents.md` for the philosophy.*