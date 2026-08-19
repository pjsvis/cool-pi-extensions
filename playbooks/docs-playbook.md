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
- Describe the *why*, not just the *what* — the JSON says what the trap tests; the doc says why it works
- Include usage instructions where relevant
- Link back to the machine-readable source
- Keep the narrative voice consistent with the Edinburgh Protocol: precise, dryly witty, anti-bloat

### List spacing (loose only when it pays)

Blank lines between list items earn their keep when items **wrap or nest** —
they disambiguate item boundaries in source for both the CommonMark parser
and the human reader, and they keep nested/continuation content from
mis-attributing to the wrong item. For single-line bullets the `- ` marker
already marks the boundary, so the blank line only adds air without clarity.

- **Multi-line or nested items → loose** (blank line between each item). This
  is the rule's load-bearing case — without the blank line, a wrapped
  continuation line reads as part of the previous item.
- **Single-line items → tight is fine** (no blank line). Loose is harmless but
  not required; don't cargo-cult air where the marker already disambiguates.

This refines ADR-001's "blank lines create breathing room" principle
(`decisions/019`): the breathing room matters where structure is ambiguous,
not everywhere.

## When to create a docs/ file

- A JSON fixture has behavioral complexity that benefits from explanation
- A configuration schema has semantic meaning beyond its fields
- A protocol definition deserves a walkthrough for new readers
- The machine-readable form is correct but unreadable

## When not to

- The JSON is self-documenting and simple (a flat list of models, a config file)
- The artifact is already prose (AGENTS.md, playbooks)
- You're tempted to duplicate what the JSON already says — add context or don't bother
