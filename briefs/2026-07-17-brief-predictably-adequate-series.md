# brief: Predictably Adequate — A Minimalist Agent Setup Series

**Created:** 2026-07-17
**Status:** pending
**Task:** (to be created)
**Protocol:** Edinburgh Protocol v1.1.0
**Repo:** Developed in cool-pi-extensions, lifted to blog-posts when ready

## What

A linked series of blog posts defining a minimalist agent setup — built from nothing, adding only what the work demands. The series deploys the findings of the Edinburgh Protocol eval (normalisation, predictably adequate, no muppets) as a practical agent infrastructure.

Four posts, each adding one layer:

1. **Is Predictably Adequate Sufficient?** (already drafted as composite — the evidence)
2. **Normalising Agents with the Edinburgh Protocol** (the bridge — model selection, the squadron, governance)
3. **A Minimalist AI Tech Stack** (the infrastructure — Pi, td, repo-as-truth)
4. **An Effective Control Plane for Agents** (the behavior — briefs, playbooks, ephemeral actors)

## Why

The eval work proved the protocol normalises cheap models to adequate (p < 0.001, two independent graders, zero directional disagreements). The composite piece (`blog/2026-07-16-predictably-adequate-composite.md`, 475 lines, 8 components) gathers the evidence — café, experiment, normalisation, pizza shop, governance, moat question.

But the evidence stops at "here's what we found." The series shows how to use what we found. The through-line: evidence, normalisation, deployment, behavior. Each post adds one layer, each layer justified by the one below it. Nothing speculative.

The series is different from every other agent framework writeup because it starts from observed evidence, not from an architecture thesis. The architecture emerges from the findings. "Start from nothing, add only what the work demands" is the James Watt principle — pragmatic improvement, not speculative engineering.

## How — the four posts

### Post 1: Is Predictably Adequate Sufficient? (composite, ready for sculpting)

The evidence. Already drafted as the composite piece. Covers:

- The café experiment (pilot that surfaced variables)
- The Edinburgh Protocol (constraints we'd never validated)
- The experiment (primed vs bare, keyword scorer wrong, structured grader right, triangulation confirmed, p < 0.001)
- The reframing (enhancement to normalisation, floor rises, ceiling stays)
- The pizza shop (what we need, not what we want)
- The governance tax and sunk-cost dark night
- The confidentiality question and the moat question
- The safe-choice fallacy (IBM to Microsoft to Anthropic)

Source material: `blog/2026-07-16-predictably-adequate-composite.md`. Needs sculpting — find the voice, cut repetition, order for reader, voice the Derrida question. Rule 1: no sculpting until the marble arrives. Marble has arrived.

### Post 2: Normalising Agents with the Edinburgh Protocol

The bridge from evidence to deployment. Covers:

- The normalisation finding (variance compresses 42%, Claude gap closes 72%, 22/24 models deployable)
- The squadron of models (the roster, not the single pick)
- Provider fallbacks (no single point of failure — every model has at least one fallback)
- The "no muppets" rule (the only selection criterion — eval excludes, personal experience selects)
- The Derrida question applied to model selection ("should this model even be in our eval?")
- The manager's job (approve the roster, not pick the model)
- The governance tax (edge-lord carries justification overhead the cheap model doesn't)
- The moat question (classify your code — moat stays local, plumbing goes to the roster)
- The secret test (can you name your secrets? If not, you don't have a moat, you have an excuse)

Source material: the composite's governance components + the eval results matrix + the normalisation analysis. This post is the argument for *why* the minimalist stack works — because the protocol makes cheap models viable.

### Post 3: A Minimalist AI Tech Stack

The infrastructure. Built from nothing, adding only what the work demands. Covers:

- **Pi as the harness.** Empty sleeve — fill it with the protocol, the model, the tools. The harness doesn't impose an agent architecture; it carries whatever you put in it. Configurable, not opinionated.
- **The Edinburgh Protocol as the normaliser.** The system prompt that makes cheap models behave predictably. Not agent infrastructure — behavioral normalisation. The agent behavior emerges from the protocol + context, not from orchestration.
- **Claude as reference, not requirement.** The benchmark that confirms the cheap model is good enough. Not the default deployment. The model you reserve for edge cases.
- **The squadron as deployment.** The roster of vetted models. Not one model — a pack. Swap between them. Failover between providers. The protocol makes behavior consistent across swaps.
- **td as task database.** `td` tracks work across sessions. Agents read it to know what to do. Humans read it to know what was done. The task database is the bridge between ephemeral agents and persistent state.
- **The repo as single source of truth.** Briefs, decisions, debriefs — the repo contains its own history. Reconstructable. No external memory store needed. The repo IS the memory.
- **The "start from nothing" principle.** Each piece was added because the work demanded it, not because a framework said so. The stack is thin because it only contains what's justified.

Source material: the repo itself (AGENTS.md, playbooks, briefs, decisions, justfile, td configuration). This post is *demonstrated* by the repo it's written in — the stack is the repo, the repo is the stack.

### Post 4: An Effective Control Plane for Agents

The behavior. How agents work without heavy orchestration. Covers:

- **Briefs as context initialisation.** A brief is a structured document that tells an agent what to do, why, and how. The agent reads the brief, picks up the context, does the work. No prompt engineering gymnastics — the brief IS the prompt, structured and persistent.
- **Playbooks as operational guidance.** Playbooks encode how things are done in this repo — conventions, standards, tooling. The agent reads the playbook and follows the pattern. No inline instructions repeated every session — the playbook persists.
- **Agents as ephemeral actors.** They arrive, they read the repo (briefs, playbooks, decisions, debriefs, td tasks), they do the work, they leave. No persistent agent state. The state lives in the repo, not in the agent. The agent is the cook; the repo is the recipe and the kitchen.
- **"The agents seem to pick up on what is required without too much direction."** This is the finding. The normalised model, given the right context (repo structure, briefs, playbooks, td tasks), picks up on the work without explicit orchestration. The protocol normalises behavior; the repo provides context; the agent does the rest. No agent framework needed — just a harness (Pi), a normaliser (the protocol), and a truth source (the repo).
- **The reconstructable history.** A repo's history can be reconstructed from its briefs (what was intended), decisions (what was chosen and why), and debriefs (what happened). The git log shows the diff. The briefs/decisions/debriefs show the reasoning. Together they form a complete record — not because someone maintained an external knowledge base, but because the repo's own documents are the knowledge base.
- **No persistent agent state.** This is the key architectural decision. The agent doesn't remember between sessions — it reads the repo and picks up where the last agent left off. The protocol makes this work because every session starts with the same constraint stack. The agent behaves the same way on Tuesday as on Monday. You don't need persistent memory when the behavior is normalised and the context is in the repo.

Source material: the repo's own briefs, playbooks, decisions, debriefs. This post is demonstrated by the agent that wrote it — operating under the protocol, reading the repo, doing the work, leaving no trace except the work itself.

## Acceptance criteria

- [ ] Post 1 sculpted from composite (voice found, repetition cut, ordered for reader, Derrida question voiced)
- [ ] Post 2 drafted (governance argument as bridge to deployment)
- [ ] Post 3 drafted (minimalist stack — Pi, protocol, td, repo-as-truth)
- [ ] Post 4 drafted (control plane — briefs, playbooks, ephemeral actors, reconstructable history)
- [ ] Series has a consistent voice across all four posts
- [ ] Each post stands alone but links to the others
- [ ] Composite piece lifted to blog-posts repo when ready
- [ ] All four posts lifted to blog-posts repo when complete

## Notes

- The series is developed in cool-pi-extensions
 (where the evidence and the stack live) and lifted to blog-posts when ready for publication.
- The repo IS the demonstration. Post 3 (the stack) and Post 4 (the control plane) are about the repo they're written in. The stack is the repo. The repo is the stack.
- Post 1 (the evidence) is the marble — it needs sculpting, not rewriting. The composite piece has 8 components and 475 lines. The sculptor's notes are in the composite (Component 5: the through-line, uncarved). The sculptor should live with the marble before cutting.
- Post 2 (the bridge) draws from the governance components of the composite (Components 6-8) plus the eval data files. It's the argument that makes the stack defensible.
- Post 3 (the stack) is the most practical — it's the "how to build this" post. It should be concrete: here's Pi, here's the protocol, here's td, here's the repo structure. Not abstract — demonstrated.
- Post 4 (the control plane) is the most subtle — it argues that agent behavior is emergent, not engineered. The evidence is the repo itself and the agents that have worked in it. The argument is: you don't need orchestration when you have normalisation + context.
