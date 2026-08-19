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

### List spacing (loose when items wrap or nest)

Blank lines between list items earn their keep when items **wrap at render
or nest in source** — they disambiguate item boundaries for both the reader
(air between a wrapped item's continuation lines and the next bullet) and
the author/editor (continuation content doesn't mis-attribute to the wrong
item). For items short enough to fit one render line, the `- ` marker
already marks the boundary, so loose only adds air without clarity.

- **Items that wrap at render → loose.** The trigger is render-wrap, not
  source-line-count: a 200-char item is one source line but three render
  lines in Glow at 80 cols, and the wrapped lines run into the next bullet
  without air to sever them. Since render width varies (terminal, GitHub,
  phone), the practical proxy is length — items longer than the column
  target wrap somewhere.

- **Source multi-line or nested items → loose.** Same boundary job, in source
  for the parser and the editor.

- **Items that fit one render line → tight is fine.** Loose is harmless but
  not required; don't cargo-cult air where the marker already disambiguates.

Apply per-list for consistency: if any item in a list wraps, loosen the whole
list. This refines ADR-001's "blank lines create breathing room" principle
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

- You're tempted to duplicate what the JSON already says — add context or don't
  bother
