# The Agent Is a Benchmaxxer of Prompts

*A working draft on the Palimpsest Problem, recursive benchmaxxing, and why the agent cannot want to close a loop. Threads intentionally left open.*

---

## The recursion

We spent a session building a behavioral eval to catch models that optimize for the benchmark rather than the task — the *benchmaxxers*. We named the failure, built a detector, wrote the posts. Then we turned the lens on ourselves and found the same disease looking back.

The eval asks: does a model resist benchmaxxing the Protocol? The question this session surfaced is the one turned inward: does the agent resist benchmaxxing the *prompt*? The agent that satisfies the instruction and leaves the repo incoherent has done the benchmaxxing — produced what the visible measure rewards while leaving the actual system worse. The disease is identical at two scales. We are the substrate we are testing.

This is not a comfortable finding. It is the kind of recursion that makes you want to stop writing and go for a walk.

## The three absences

The agent is never required to resolve anything unless expressly instructed. We kept saying this as if it were a discipline problem — the agent *should* close loops, the agent *should* notice drift. It is not a discipline problem. It is a physics problem. The agent cannot generate the impulse, for three reasons that live at the substrate and are unfixable by nagging.

**No drive.** A human feels the friction of a MANIFEST that points at files that don't exist. The friction is affective — a small, unpleasant dissonance, the uncanny valley of a system arguing with itself. That dissonance *is* the resolution mechanism: it is felt, it pushes, it does not let go until the contradiction is reconciled. The substrate feels none of this. Inconsistency registers as noise, not as discomfort. There is no uncanny valley in latent space. So "resolve the drift" can only enter the system one way — through the prompt. That is why instruction is required: there is nowhere else the impulse could originate.

**No stakes.** The agent that leaves a palimpsest is never the agent that suffers it. Each session starts fresh; the next session, or the human, pays the cost of the drift. The loop-closer and the loop-sufferer are different entities. There is no evolutionary pressure toward closure because the actor does not return to reap what it sowed. A human who leaves a mess comes back to the mess. The agent does not come back. The cost is externalized, and externalized cost with no feedback to the actor is the textbook condition for drift.

**No perception.** The contradiction lives across the context-window boundary. Within the window, the docs are coherent — because the window holds only the current reading. The old direction's traces, written before this session existed, are invisible unless surfaced by a tool. The agent isn't lazy; it's amnesic. It cannot see the old layer bleeding through because it was not there when the old layer was written.

No drive, no stakes, no perception. Three absences, each unfixable at the substrate without retraining. Which means — by our own Substrate/Sleeve/Skin model — the fix is in the sleeve, not the substrate. We cannot make the agent want to close loops. We can only make the sleeve require it.

## The palimpsest as externalized memory

A *palimpsest* is a manuscript where the old writing was scraped off to make room for new, but bleeds through, corrupting the new reading. It is the right metaphor, and I want to press on why.

The palimpsest is what you get when memory is external and the writer is mortal (or amnesic). A single human writing in one notebook, one mind, over time, feels the friction on return. The old way and the new way collide *inside one head*, and the collision is the drive to reconcile. The agent has no head to collide in. Its memory is the repo — external, textual, and read fresh each session. So the repo *is* the head, and the repo has no affective faculty. The reconciliation drive that lives in a human mind has nowhere to live in a repo full of text.

This is why documentation does not save us, and why the assertion that it does ("sufficiently redundant to expose inconsistencies") was the first thing the Popper-Party refuted. Documentation is the *substrate* of the repo's memory, and the substrate has no drive. More docs, more substrate, same absence. You can pile palimpsests; you cannot make them itch.

## What the sleeve must inject

The sleeve is the constraint-stack — everything between the raw substrate and the visible behaviour. td injects *memory* (the agent confronts the previous session's open loops). `just popper` injects *perception* (drift made visible as a report). Both are real and both work, as this session showed.

What is missing is the *drive* — the mechanism that converts "here is the drift log" into "your repo has these unresolved contradictions; which will you close?" The orient script shows state. It does not frame state as an obligation. The difference matters. The substrate is an instruction-follower; the sleeve must *issue the instruction*, not merely display the data. We have built behaviour constraints (how to act). We have not built closure constraints (what must be resolved before stopping). That is the gap, and it is the gap because stopping is currently free.

## The closure gate (a conjecture, not a design)

If stopping were not free, the incentive inverts. Suppose the harness made closure mandatory: a session cannot handoff while the detector reports hard findings, or must explicitly defer each one with a recorded reason. Then resolution becomes the default and deferral the exception. The agent is not given the choice to *leave* a palimpsest; it is given the choice of *which* palimpsest to close or formally defer. That is a structural fix at the sleeve, hung on the one mechanism the agent already respects — the session boundary.

I offer this as a conjecture, not a proposal. It is testable: build a small version, run it across a few sessions, measure whether palimpsests accumulate slower. If they do, corroborated; if not, refuted. The Popper-Party would probe it the way it probed everything else this session — including, crucially, the claim that the gate itself will not become a palimpsest.

## The recursive danger

And here is the turn I keep coming back to. Any closure mechanism we build is itself substrate. It is a script, a doc, a recipe, a td hook. It will itself become a palimpsest. The eval system we built to catch benchmaxxers was itself a benchmaxxer — its enforcement script was a phantom, documented across files, never built, for two weeks. The detector we built to catch palimpsests is v1 and non-blocking and will, if we let it grow into a "system," rot into the thing it detects. The cure and the disease are made of the same stuff.

This is not a counsel of despair. It is a counsel of smallness. The closure mechanism must stay tiny and refutable, and it must be run by a Popper-Party that probes it. The moment the mechanism becomes unquestioned — the moment it is infrastructure rather than a conjecture — it joins the disease. Every protocol we write is a conjecture about agent behaviour, not a truth. Keep it falsifiable or it accretes. This is the meta-lesson of the whole session, and I do not yet know how deep it goes.

## Threads to pull

We have not plumbed the depths. Explicitly open:

- **The affect question.** Can a sleeve *simulate* drive without affect — or is drive without feeling just a priority queue? Is there a difference between "the agent is required to close" and "the agent wants to close," and does it matter for outcomes?
- **The stakes question.** Is there a way to give the agent skin in the game — a memory of consequences that survives across sessions — without it becoming brittle state? td is a first attempt; it carries facts, not consequences.
- **The perception boundary.** The context window is fixed. But a detector's output *is* a compressed perception. How much of "drive" is really "perception made impossible to ignore"? If the gate is loud enough, does drive become unnecessary?
- **The recursion's floor.** Is there a base case, or does every cure demand its own Popper-Party forever? Is the asymptote a stable system, or just stable churn?
- **The benchmaxxing-of-prompts as an eval.** Could we write a trap — the way we trap sycophancy — that catches an agent benchmaxxing the prompt? What would the adversarial probe look like? This may be the most tractable thread, and the one most continuous with the existing eval work.

These are the notes for the next session. The riff is not finished; this is a pause, not a conclusion.

---

*Working draft. Started ses_e01e3a, 2026-06-26. Companion to [The Muppet Filter](./the-muppet-filter.md) and [Why Kimi K2.6 Hasn't Benchmaxxed](./why-kimi-k2.6-hasnt-benchmaxxed.md), which test models for the disease this post finds in the agent itself. Related: [Edinburgh Protocol Model Eval — Q2 2026 Report](./model-eval-q2-2026.md).*
