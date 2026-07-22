# Blog Post Planning: The Edinburgh Protocol Eval System

## The Two Posts

### Post 1: "The Muppet Filter"
**Subtitle:** *How we built a behavioral eval system to identify models that actually work*

**Type:** Technical methodology piece
**Audience:** Engineers, AI practitioners, model deployers
**Voice:** World-weary, systems-thinking, dry wit
**Length:** ~1,500 words

**Structure:**

1. **The Humble Beginning** (~200 words)
   - Last year: inference was cheap
   - Simple problem: identify muppet-substrates (models that ignore constraints)
   - The eval system was a filter, not a ranking
   - "Is this model a muppet? Yes/No."

2. **The Complication** (~300 words)
   - Inference gets expensive
   - Need inference arbitrage — get most reasoning per dollar
   - The eval system changes from filter to ranking
   - "Which models actually work?"

3. **The Methodology** (~400 words)
   - Substrate/Sleeve/Skin framework
   - Constraint-stack as latent space carving
   - pi-coding-agent (bare bones) = direct substrate access
   - The four trap tests explained simply

4. **The Results** (~300 words)
   - Summary table: Pass/Fail/Muppet
   - Key findings: NVIDIA free tier matches paid, Kimi K2.6 is top performer
   - The unexpected: benchmaxxing bar-stewards

5. **The Framework** (~200 words)
   - What this enables
   - How to use it
   - Link to repo for implementation

**Tone:** Technical but accessible. Explains methodology without exhaustive detail. Points to existing docs for the deep dive.

---

### Post 2: "Why Kimi K2.6 Hasn't Benchmaxxed"
**Subtitle:** *A meditation on model quality, benchmark gaming, and the difference between performance and competence*

**Type:** Opinion/analysis piece
**Audience:** General technical audience, AI watchers, curious practitioners
**Voice:** Edinburgh Protocol — world-weary, intellectually curious, dryly witty
**Length:** ~1,500 words

**Structure:**

1. **The Problem with Impressive Numbers** (~200 words)
   - Every model release: benchmark scores, leaderboard positions
   - The detection problem: you can't infer capability from scores
   - This is what the eval system attempts to do

2. **Kimi K2.6: The Numbers That Don't Add Up (In a Good Way)** (~200 words)
   - The 18/19 score is a different kind of high
   - The actual output: "revenge cartography" quote
   - This is output of a model with a stance, not a performer

3. **The Hypothesis That Was Wrong** (~300 words)
   - Original suspicion: benchmaxxing signature
   - The thinking trace experiment
   - Results: thinking enabled = more assertive (2.75×)
   - The interpretation: genuine capability, not performance anxiety

4. **The Jackson Pollock Problem** (~200 words)
   - Thinks well ✓
   - Good ideas ✓
   - Implementation: messy ✓
   - The drip painter metaphor

5. **Cursor's Validation** (~150 words)
   - Market signal: engineers with hands-on experience chose Kimi
   - Not based on benchmark scores

6. **The Muppet Substrate Angle** (~200 words)
   - Explains Substrate/Sleeve/Skin without going deep
   - Points to the mystery in the sleeve (context-initialization)
   - Muppet Filter as memorable framing

7. **Conclusion: A Model That Hasn't Sold Out** (~150 words)
   - 18/19 earned through genuine capability
   - The closing: "At this point Kimi K2.6 would be deep in the writing of a wacky thesis"
   - Meta-humor about verbosity as character, not bug

**Tone:** Opinionated, analytical, with the Edinburgh Protocol voice throughout. Self-aware about the meta-humor.

---

## Assets & References

### Existing Docs (do not repeat, reference)
- `docs/model-eval-q2-2026.md` — Raw eval results, methodology details
- `docs/edinburgh-protocol-evals.md` — Trap test specifications
- `docs/edinburgh-protocol.md` — The Protocol itself
- `docs/model-eval-bankruptcy.md` — The MiniMax/GLM critique (Attack of the Clones)
- `docs/the-information-arbitrage-stack.md` — Stack overview, philosophy

### New/Updated Docs
- `docs/why-kimi-k2.6-hasnt-benchmaxxed.md` — Draft, needs revision to follow arc
- `docs/model-eval-q2-2026.md` — Updated with Kimi results

### Eval Assets
- `scripts/eval.sh` — Eval facade
- `src/cli/pi-eval/` — Canonical eval CLI (consolidated from three engines)
- `src/extensions/edinburgh-evals/` — Thin port (shells out to CLI)
- `prompts/edinburgh-protocol-evals-v1.json` — Test fixture

---

## The Narrative Arc (Shared)

```
Act I: Humble Beginning
  ↓
Act II: Complication (inference expensive)
  ↓
Act III: Unexpected Discovery (benchmaxxing bar-stewards)
  ↓
Act IV: Kimi Revision (thinks well, messy implementation)
  ↓
Act V: Meta-Moment (wacky thesis closing)
```

Both posts share this arc but emphasize different parts:
- Post 1 emphasizes Acts I-III (methodology, results, unexpected)
- Post 2 emphasizes Acts III-V (benchmaxxing discovery, Kimi critique, wacky thesis)

---

## What to Avoid (Jackson Pollock Syndrome)

**Don't:**
- Repeat methodology in both posts (reference, don't replicate)
- Go deep on trap test specifications (link to existing docs)
- Explain the Edinburgh Protocol from scratch (assume familiarity)
- Add new technical content that should be in docs

**Do:**
- Tell the story differently in each post
- Let each post have its own voice emphasis
- Point to assets, don't reproduce them
- End Post 1 with "use the framework"
- End Post 2 with the wacky thesis line

---

## Publishing Checklist

- [x] Review and revise `why-kimi-k2.6-hasnt-benchmaxxed.md` (Post 2 draft)
- [x] Draft `the-muppet-filter.md` (Post 1)
- [x] Verify all cross-links work
- [x] Check tone consistency across both posts
- [x] Add canonical link to `model-eval-q2-2026.md`
- [x] Ensure `scripts/eval.sh` works as demo (`just eval status`)
- [ ] Add any missing eval results to `data/eval_log.json` (data/eval_log.json has 327 entries across 23 models; no gaps identified — deferred)

### Session notes (ses_e01e3a)
- The eval demo was broken: `scripts/eval.sh` read `.silo/eval_log.json` (deleted) against an obsolete schema. Fixed in this session — `just eval status` now reads `data/eval_log.json` and renders a grouped per-model summary.
- Broader `.silo/` → `data/` reference cleanup across ~15 files filed as td-7846e0.
- Posts reviewed against the planned arcs above; tone consistent (Edinburgh voice throughout, bar-stewards/Pollock metaphors land differently per post per the shared arc).

### Session notes (ses_e4c0fa) — the newup-discipline riff

Three insights from the eval consolidation epic (td-957871), which was the first
epic run under the session-newup discipline from start to finish:

1. **Proactive newup > reactive newup.** The $46 lesson said "watch the meter,
   new up when it hurts." The eval consolidation showed a better pattern:
   decompose the epic into phases *before work starts*, each phase is a newup
   boundary by design. The boundaries are structural, not behavioural. You
   can't forget to new up because the task definition *is* the newup schedule.
   This eliminates the "remember to new up" problem — the weakest enforcement
   mechanism (human vigilance) is replaced by the strongest (structural design).

2. **The asymmetry favours over-newup.** Too many newups = 1-2 turns of
   overhead per boundary (handoff + context load). Too few = O(n²) token
   compounding, SNR collapse, the $46. The ratio is roughly 1000:1 (a
   unnecessary newup costs ~2K tokens; a missed one costs ~$46). When the
   downside of one direction is "mild overhead" and the other is "expensive
   failure," the optimal strategy is to err hard toward more boundaries.
   Worst case is we new up too often. No biggie.

3. **Bounded context improves quality, not just cost.** Session 3 rewrote the
   extension from 532 to 116 LOC — a clean rewrite, not a patch. That rewrite
   was clean *because* the model wasn't carrying the 1,243 + 748 LOC of source
   files from session 1, or the 14 files it built, or the scoring eval from
   session 2. It had the brief (spec), the handoff (state), and the one file
   it was rewriting. A single session would have *patched* the extension —
   modifying the state machine, deleting hooks one at a time — because the old
   structure was still in context. Instead it *replaced* the extension, because
   the old implementation wasn't in context. Bounded context produced a better
   architectural outcome, not just a cheaper one. Less token cost, better
   quality results, lower risk. The triple win.

These insights are documented in `blog/2026-07-22-four-sessions-four-commits.md`
and codified in `decisions/021-eval-engine-cli-first-thin-extension-port.md`.
The theory posts (`Shannon, the Session, and the $46` + `Token Minimisation`)
established the reactive discipline. The eval consolidation established the
proactive pattern: design the newup boundaries into the epic decomposition.