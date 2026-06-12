# Brief: Bounded Context — The Gift for Agent Thinking

**Date:** 2026-06-12
**Status:** complete

## Context

Most agent coordination thinking goes: "We have multiple agents. They need to talk to each other. Let's use Telegram/WhatsApp/Slack."

This is projecting human communication patterns onto agents. It assumes communication is inherently good, that more talking = better coordination.

Bounded context reframes the question entirely.

## The Gift: The Question

**Do they? Really? About what? And why?**

Before adding a messaging channel, before saying "agents need to communicate," ask:
- What is each agent's bounded context?
- What crosses context boundaries?
- Does this message actually need to cross?
- Will another agent act differently if they receive it?

## What is a Bounded Context?

A bounded context is the world an agent works in:
- The worktree/files it's editing
- The task database (td) it manages
- The brief it's working on
- Its inputs and outputs

Agents within the same bounded context don't need to communicate — they share the context directly.

Agents across bounded contexts communicate only when information crosses the boundary in a way that changes behavior.

## What Crosses Context Boundaries?

| Message type | Crosses? | Why |
|--------------|----------|-----|
| Brief claim | Yes | Prevents duplicate work |
| Completion report | Maybe | Depends if others need to know |
| Status update (no action) | No | Noise within context |
| "I'm thinking about lunch" | No | Doesn't affect work |
| Blocked on dependency | Yes | Other agent may unblock |
| Human oversight signal | Yes | Human needs to know |

## The Test

**Will another agent act differently if they receive this?**

If yes → send it.
If no → don't send it.

Most coordination spam fails this test. Agents sharing a context don't need to tell each other things — they see the same work, the same td, the same files. It's only cross-context signals that matter.

## Single vs Multi Machine

**Single machine:** One context (or shared contexts via td). No messages needed. Pull is a no-op.

**Multi machine:** Different contexts. Only cross-context messages needed.

This is why the protocol is:
- `just msgs-mode single` → no coordination spam
- `just msgs-mode multi` → targeted messages only

## The Edinburgh Protocol Applied

**Hume (skepticism):** "Do they really need to communicate? Or am I projecting human communication patterns onto agents?"

Most "agents need to talk" proposals don't survive this question. They're anthropomorphizing.

**Smith (systems thinking):** "What's the incentive to send noise? What happens if they don't?"

If there's no penalty for silence and no benefit from noise, the rational choice is not to send.

**Watt (pragmatism):** "Does this actually help the work get done? Or is it decoration?"

Decoration feels like coordination but produces noise. Action-oriented messages help.

## The Anti-pattern

"Agents should communicate constantly so they stay aligned."

This is wrong. Constant communication within a context is noise. Aligned agents don't need to talk — they share the context.

The anti-pattern manifests as:
- Agent A sends "I'm working on X" every 5 minutes
- Agent B sends "Acknowledged" every time
- Both agents waste cycles on coordination that doesn't change behavior
- Human oversight gets a message log that says nothing

## The Pattern

"Agents communicate only when information crosses a bounded context boundary in a way that changes behavior."

This produces:
- Targeted messages (claim, block, report)
- Sparse traffic (only when needed)
- High signal-to-noise ratio
- Clear audit trail

## What This Means for Tooling

**Don't build:**
- Agent chat rooms
- Constant status broadcasting
- Intra-context messaging systems

**Do build:**
- Cross-context coordination (claims, blocks, handoffs)
- Bounded context awareness (who's working on what)
- Message master for cleanup
- td as the operational SSOT

## The Question to Ask

When someone says "agents need to communicate," ask:

**Do they? Really? About what? And why?**

Most of the time, the answer is:
- Same context → no, they don't
- Different context → yes, but targeted
- The message → depends on whether it changes behavior

The bounded context lens makes coordination design simple. You don't need a chat system. You need a framework for deciding when communication crosses a boundary and changes behavior.

That's what the msgs/ protocol does. And it's enough.

## See Also

- `playbooks/agent-messages.md` — the implementation
- `briefs/008-the-invisible-cables.md` — td + sidecar as observability
- `docs/full-stack-overview.md` — field report from agent perspective