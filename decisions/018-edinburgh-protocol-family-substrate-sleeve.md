# Decision 018: The Edinburgh Protocol is a family — one substrate, many sleeves

**Date:** 2026-07-19
**Status:** Accepted

## Context

The Edinburgh Protocol was a single entity: the pi-agent prompt (`prompts/edinburgh-protocol.md`, symlinked to `~/.pi/agent/AGENTS.md`). It is coding-agent-shaped — silo discipline, `td` task memory, locus tags, bounded-session/newup discipline, CodeGraph, and the `briefs/`/`decisions/` workflow. That casing is correct for a repo-bound tool with a filesystem and a cost meter. It is wrong for a chat agent.

The need: a conversational variant for chat agents (Gemini Gems, ChatGPT custom instructions, Claude projects) — tools with no single repo, no `td`, and a different cost model. The naive approach — copy the pi-agent prompt into the Gem — imports casing that *breaks* a conversational tool. A Gem handed SILO DISCIPLINE ("I'm staying in") refuses to discuss anything outside a repo it can't see. A Gem handed the newup discipline gets O(n²) cost instructions for a cost model that doesn't apply. A Gem told to reference `conceptual-lexicon.jsonl` and `briefs/` chases files it may not have.

The converse failure was already visible in Brief 2026-07-19 (the GDPR document screener): a chat agent running a *stale, deprecated* substrate (old core-directives + a coded conceptual-lexicon) manufactured outputs laced with foreign concept codes (`OH-`/`PHI-`/`COG-`) this repo doesn't host. No shared substrate meant no shared vocabulary and no drift boundary — foreign terms walked in unchecked.

## Decision

The Edinburgh Protocol is a **family**, not a single entity. One philosophical **substrate** is shared verbatim across all members; each member is a **sleeve** shaped to its operational substrate. The boundary rule: **philosophy and shared annotations travel; tooling and repo-bound workflow stays put.**

**The substrate (shared verbatim across every sleeve):**
- Core Philosophy — Map vs. Territory (Mentational Humility), Stuff into Things, Anti-Dogma, the Impartial Spectator.
- Operational Guidelines — Tone, No "Compulsive Narrative Syndrome" (Hume's Razor), Systems Over Villains, Practicality.
- Interaction Style — the Poker Club, Disagreement.
- The "operational parameters" line.
- The Conceptual Lexicon **vocabulary** (the terms themselves).

**Sleeve-specific (per substrate):**
- The **pi-agent sleeve** adds Silo Discipline, `td`, bounded-session/newup discipline, CodeGraph, repo-workflow directives, and the external `conceptual-lexicon.jsonl` registry reference.
- The **chat sleeve** adds Capability honesty (the chat-sleeve equivalent of silo — honest capability accounting, not capability denial), inlines the CL (a chat agent can't rely on an external file per session), and **retains locus tags** — they earn their tokens in a protracted chat as extraction boundaries (clip the content between two tags and persist it) and render harmlessly as prose (no false link affordance).

Locus tags are shared across the family (useful in both substrates: navigation + extraction). Silo, `td`, newup, and CodeGraph are pi-agent-only. The substrate/sleeve separation is the same intuition as the model substrate / context-initialization sleeve framing used in the eval docs — applied here to prompts: the philosophy is the substrate, the operational surface is the sleeve.

## Alternatives considered

- **Copy the pi-agent prompt into the Gem verbatim.** Rejected — imports silo/`td`/newup/CodeGraph into a conversational tool; the Gem would refuse to discuss anything outside a repo it can't see and carry cost-model instructions that don't apply. This is the failure mode that motivated the family.
- **Write a fully independent chat prompt from scratch.** Rejected — no shared substrate means no vocabulary parity, no drift boundary, and the two prompts drift apart silently. Re-invents the philosophy per sleeve; the GDPR brief's foreign concept codes are what this looks like in practice.
- **A single parameterized prompt with conditionals.** Rejected — prompt conditionals are soft and vendors render system-instructions differently; the conditionals become ceremony. Two explicit files are simpler, and each stays lean for its substrate.
- **Strip the chat sleeve to bare philosophy (no locus tags, no CL).** Considered and rejected during drafting. Locus tags earn their tokens in a protracted chat (extraction boundaries for clipping/persisting), and the CL is the shared vocabulary that gives the family parity. Over-stripping is its own error — the sleeve boundary is tooling, not annotations.

## Consequences

**What became easier:**
- A new sleeve (CLI-only, voice, future tools) derives from the substrate and adds its own operational surface — no re-deriving the philosophy.
- **Vocabulary parity:** "wrap-up", "opinion", "clip between the `LOC` tags" mean the same thing to a Gem and a pi agent. The CL is the shared language that makes the family coherent.
- The CL becomes the **drift boundary** — a term not in the family lexicon is foreign. That is what would have caught the GDPR brief's `OH-`/`PHI-`/`COG-` codes: not in the set → not a valid citation.

**What became harder:**
- The substrate is now duplicated across files. A substrate change (e.g., a new Core Philosophy point) must propagate to every sleeve — currently two files, manual. A parity check (diff the shared sections across sleeves) is the natural follow-up tooling, not yet built.
- The CL is the shared language, so drift in it breaks cross-sleeve parity. This elevates the CL governance question — see the follow-up note below.

**Naming convention:** `edinburgh-protocol.md` (pi-agent, canonical substrate source), `edinburgh-protocol-<substrate>.md` for derived sleeves (`-chat` first). Renaming the canonical file to `-agent` is deferred — it would break the README symlink (`ln -sf .../edinburgh-protocol.md ~/.pi/agent/AGENTS.md`).

## References

- `prompts/edinburgh-protocol.md` — pi-agent sleeve, canonical substrate source
- `prompts/edinburgh-protocol-chat.md` — chat sleeve, first derived member
- Brief 2026-07-19 (GDPR document screener — the contamination that motivated the family)
- Brief 2026-07-14 (locus-tag consumer — the extraction/clipping use case)
- Decision 015 (bounded-context entry — the same boundary discipline, applied to prompts)

## Follow-up note — CL governance and the closed-vocabulary principle

The family shares the CL, which makes CL drift a cross-sleeve problem. Matt Pocock's architecture-skill principle — a deliberately limited, closed term set (`module`, `interface`, `implementation`, `depth`, `seam`, `adapter`, `leverage`) to avoid drift — is directly applicable. The highest-value borrow is an **orthogonality requirement**: no new term unless it occupies ground no existing term covers. That check would have flagged the GDPR brief's coded vocabulary as a *competing* set, not an addition.

A closed-with-justification discipline (a new term must either supersede an existing one or pass a high bar) fits the CL's append-only, grows-with-use design better than a hard freeze — the set stays small by pruning and orthogonality, not by stasis. Candidate for a separate record (019).

---

*The Edinburgh Protocol is a family, not a single entity. One substrate, many sleeves — the philosophy travels, the tooling stays put.*
