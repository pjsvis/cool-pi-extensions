# Brief: Sculpt "Not a Muppet, Just Intellectually Challenged" to Pre-Publication

**Date:** 2026-06-29
**Status:** Open
**Applies to:** `cool-pi-extensions/blog/not-a-muppet-just-intellectually-challenged.md`

## Objective

Sculpt the draft blog post (~1,400 words) to a pre-publication version, per the sculpting heuristic. The draft has the figure inside it — the third finding, the failures-as-palimpsest — and the material around it. The chisel work is subtraction: tighten the approach (findings one and two) so the reveal (finding three) arrives with force, and remove what isn't the figure, until what remains is one grain, no exposed joists.

## Context

The draft was written as a block — more than the figure needs, deliberately. It is a newer LLM substrate (the agent) evaluating its predecessors (Gemini, which wrote the source draft; Qwen-3.5-9B, which evaluated it). The scenario: the user ran a local-model eval on a Gemini-produced manifesto draft, corrected the eval's hallucinations, and asked the agent for an opinion. The agent's meta-eval of the eval is the spine of the piece.

The Edinburgh Protocol voice is the constraint-stack the draft was written under. The cool-pi-extensions repo is the home of the eval system (the muppet filter, the substrate/sleeve/skin framework, the four trap vectors). The piece connects that system to the memory-vs-documentation argument developed in the pob project the same day — the local model's hallucinated doubt about a real book is the counter-example that proves you cannot trust a reconstruction; only an artefact.

### Why sculpting, not outlining

The outline is the greenfield reflex — decide the figure, fill the shape, discard anything that doesn't fit the decision. The block inverts the order: produce more than the figure needs, then find the figure by removing what isn't it. The surplus is the medium the discovery lives in. The draft already contains connections (the MRI-scan distinction, the yap/voice frame, the self-application as Humean test) that an outline would not have predicted and would have discarded. Sculpting keeps them if they serve the figure; it removes them if they don't. The decision is made against the figure as it emerges, not against a figure decided in advance.

## The figure

The third finding is the figure: **the small model's failures are the palimpsest, made literal.** A model that merges two authors because it cannot keep them distinct is doing, in miniature, exactly what a memory-compressed agent session does at scale. The fix, in both cases, is documentation — the actual past, written at the time, auditable, not a reconstruction. This is where the piece's weight is, and it is the vein that connects to the session's whole argument (memory as the lossy channel, the artefact as authority, the yap as research, the voice as authorship).

The first two findings are the material around the figure — necessary approach, currently at slightly too much length and at MRI resolution (they signpost their own internal connections explicitly). The sculpture wants them to *hold* the third finding without *showing* how they hold it.

## What stays load-bearing (do not chisel away)

1. **The self-application.** The agent's claim to evaluate its predecessors honestly is falsifiable — "if I hallucinated a citation of my own, the claim would collapse." The agent flagged the suspect "Segalman-Stamenkovic" citation as suspect rather than asserting it. This is Hume's Razor applied to the meta-eval; it is what stops the piece being a brag. It is inside the wall; it stays.
2. **The closer.** "The yap is research; the voice is authorship; and the eval that tells you which is which is the only honest thing in the room." This is the surface the figure presents; the everything before it is the approach. Sculpt toward this reveal; it is the line the marble wants to expose.
3. **The three distinct failure kinds** (confident conflation, hallucinated doubt, suspected uncorrected fabrication) — these are the evidence the figure rests on. They stay, but their presentation tightens: the reader meets them as the figure's material, not as a labelled list.

## What to remove or tighten

- **The signposting.** "Three things, in ascending order of interest." "First:" "Second:" "Third —". These are the MRI labels. The sculpture lets the findings arrive in their order without announcing the order. The reader feels the ascent; the piece does not label it.
- **The approach's internal explanations.** Findings one and two currently explain *why* they matter as they present. The sculpture trusts the reader to feel the approach — tighten so the third arrives with force, not with its runway labelled.
- **The setup's length.** The opening (the man, the draft, the eval, the workshop) is necessary scene-setting but currently does more work than the figure needs. Tighten to the minimum that lands the scenario; the reader needs to know what happened, not be walked through every beat.
- **Cross-project vocabulary.** "Yap" and "voice" are pob's terms; the piece sits in cool-pi-extensions. If the terms travel, they need a one-clause gloss on first use so a reader of this blog alone is not stranded. If they don't travel cleanly, rephrase. The voice gate decides at the pass.

## Deliverables

1. **The sculpted pre-publication draft**, in the book's voice (Edinburgh Protocol — dry, world-weary, intellectually curious, no "we", no seminar register), one grain throughout, no exposed joists. Held in the same file, replacing the block.
2. **A voice-pass check** against the Edinburgh Protocol register (the constraint-stack the piece was written under). The single-voice gate applies: one processor, one pass, the seam test (read two adjacent paragraphs aloud; if you can hear the join, one was voiced differently).
3. **A rest, then a cold read.** The perturbation is measured in the rest, not the touch. Sculpt one pass, commit, rest, read cold, then the small touches the rest reveals. Touch, commit, rest: the sliver maps in the rest.

## Constraints

- **The sculpting heuristic applies.** Subtraction, not addition. The figure is inside the block; remove what isn't it. Do not add material; if the figure needs something the block doesn't have, that is a different brief.
- **The MRI-scan test applies.** Reveal the structure as a structure, not as an MRI scan. If the connections are labelled (first, therefore, however, which is to say), the piece is a diagram, not a figure — sculpt toward the reveal, not the signpost.
- **The single-voice gate applies.** One grain throughout, no grafts against the grain, no bits sticking out.
- **The Edinburgh Protocol applies.** Dry, world-weary, intellectually curious, dryly witty. No manic enthusiasm, no robotic platitudes. Hume's skepticism, Smith's systems thinking, Watt's pragmatism. The self-application stays as the Humean test; the piece does not sycophant about itself.
- **The perturbation process applies.** Sculpt, commit, rest, read cold. Do not over-sculpt in one sitting — the hand keeps finding things to fix because the hand wants to keep moving, not because the figure needs it.
- **One orientation.** Approach the figure from the same side throughout. No reordering into a structure that was not the drafting grain; the sculpture follows the grain the block already has.

## Verification

- The piece reads as figured, not diagrammed — no labelled connections, no MRI scan.
- The third finding arrives with force, held by the first two without the first two showing how they hold it.
- The self-application and the closer survive the chisel work.
- One grain throughout; the seam test passes on adjacent paragraphs.
- The Edinburgh Protocol voice holds — dry, no "we", no seminar register, no sycophancy about the author-substrate.
- A cold read, after a rest, confirms the figure is clearer than in the block. If the cold read finds the figure muddied, the sculpt over-worked; revert and touch less.
- `just build` succeeds (the file is in `blog/`, build-ignored, but confirm no syntax breakage).

## Related

- `cool-pi-extensions/blog/not-a-muppet-just-intellectually-challenged.md` — the block to sculpt
- `pob/conceptual-lexicon.jsonl` — `sculpting-heuristic` (the discipline this brief applies), `palimpsest`, `yap`, `perturbation-protocol`
- `pob/blog/the-palimpsest-and-the-plot.md` — the companion piece (has the memory-angle `todo:` flag)
- `pob/briefs/2026-06-29-brief-math-as-illustration.md` — the stance the eval's legitimacy-theatre reflex confirms
- `cool-pi-extensions/blog/PROJECT.md` — the blog plan (the muppet-filter posts this piece sits alongside)
- `cool-pi-extensions/debriefs/003-protocol-evals.md` — the eval system's architecture
