# Playbook: docs/

## Purpose

Long-form, human-readable documents translated from machine-readable artifacts. Prose renderings of JSON fixtures, protocol definitions, configuration schemas — anything the agent reads as structured data that a human would benefit from reading as narrative.

`docs/` is the **translation layer** between machine formats and human comprehension.

## Relationship to other silos

**`prompts/edinburgh-protocol-evals-v1.json`**
JSON format, consumed by extension runtime

**`docs/edinburgh-protocol-evals.md`**
Markdown prose, optimized for human readers

**`prompts/edinburgh-protocol.md`**
Markdown (system prompt format), read by agent + human

**`prompts/edinburgh-protocol.md`**
Markdown, serves as agent identity under Edinburgh Protocol

The JSON fixture is a runtime dependency — the extension reads it directly. The Markdown in `docs/` is a companion document: same content, but structured for reading rather than parsing.

## Conventions

- One `.md` file per artifact (not per version — version the filename if needed)

- Describe the *why*, not just the *what* — the JSON says what the trap tests;
  the doc says why it works

- Include usage instructions where relevant

- Link back to the machine-readable source

- Keep the narrative voice consistent with the Edinburgh Protocol: precise,
  dryly witty, anti-bloat

### List spacing (loosen numbered lists; bullets stay tight)

Two rules, split by axis.

**Soft-wrap by length (both types):** any list item >80 cols is soft-wrapped
at word boundaries so no line exceeds the terminal (`scripts/softwrap-lists.py`).
This is the 80-col discipline — applies to bullets and numbered lists alike.

**Loosen by type:**

1. **Numbered lists → loose** (blank line between items). A numbered list is a
   guided tour: the reader processes step 1, then step 2. The blank line gives
   the rhythm a sequence deserves, even when items are short.

2. **Bullets → tight.** A bullet list is a scannable set, not a sequence;
   compact is the point. The `- ` marker disambiguates the boundary even when an
   item wraps (the continuation indent makes the marker pop at the left margin),
   so wrapped bullets don't need air. Exception: nested bullets or
   multi-paragraph items loosen for *structure*, not rhythm.

This supersedes the earlier "wrap → spacer" rule: the loosen trigger is type
(numbered), not length. Wrapping bullets are tight-but-wrapped — readable,
because the marker is the boundary. The boundary-disambiguation argument that
drove the length-based rule turned out to be moot for bullets (the marker
already does that job); it was only ever real for *nested* structure.

## When to create a docs/ file

- A JSON fixture has behavioral complexity that benefits from explanation
- A configuration schema has semantic meaning beyond its fields
- A protocol definition deserves a walkthrough for new readers
- The machine-readable form is correct but unreadable

## When not to

- The JSON is self-documenting and simple (a flat list of models, a config file)

- The artifact is already prose (AGENTS.md, playbooks)

- You're tempted to duplicate what the JSON already says — add context or don't
  bother
