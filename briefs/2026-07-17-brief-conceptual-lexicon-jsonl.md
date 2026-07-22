# brief: Conceptual Lexicon as JSONL

**Created:** 2026-07-17
**Status:** pending
**Task:** (to be created)
**Protocol:** Edinburgh Protocol v1.1.0

## What

Extract the Conceptual Lexicon from inline markdown in `prompts/edinburgh-protocol.md` and `~/.pi/agent/AGENTS.md` into a standalone JSONL file at the repo root (`conceptual-lexicon.jsonl`). Move the Edinburgh Protocol to `SYSTEM.md` at the repo root. The repo then contains everything: `SYSTEM.md` (the protocol), `AGENTS.md` (the boundary), `conceptual-lexicon.jsonl` (the terms).

## Why

The CL currently lives as prose in two places — the protocol prompt and the agent AGENTS.md. This has three problems:

1. **Duplication.** The same terms are defined in two files. Edits must be made in both. Drift is inevitable.
2. **Not machine-readable.** Scripts that want to check whether a cited term resolves (the "semantic anchor" the preflight audit checks against) have to parse markdown prose. JSONL is parseable with `jq`.
3. **Not append-only.** Adding a term means editing a markdown block. JSONL is append-only — new terms are new lines, no rewriting.

The user noted earlier: "our first edit will likely be to convert the conceptual lexicon to JSONL and put it in a separate file." This is that edit.

## How

### File: `conceptual-lexicon.jsonl` (repo root)

The CL lives at the repo root, alongside `SYSTEM.md` and `AGENTS.md`. It is a primary component — not data. The `data/` directory is for eval results and logs. The CL is configuration.

Each line is a JSON object. Schema (based on the JSON Schema pattern used in `ctx-cli-dev/silo_barley/schema.json` — adapt to CL requirements):

```json
{
  "term": "wrap-up",
  "definition": "Summarize what happened, persist the important parts, note what's left, bring the phase to a close.",
  "category": "instruction-compression",
  "compresses": "summarize + persist + note remaining + close phase",
  "cited_in": ["briefs", "prompts", "playbooks"],
  "created": "2026-07-16",
  "protocol_version": "1.1.0",
  "notes": "One-word compression for a multi-step closing instruction. Test of validity: the agent knows what it means without a formal definition."
}
```

### Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `term` | string | yes | The term as it appears in prompts/briefs |
| `definition` | string | yes | Full definition |
| `category` | string | yes | `instruction-compression` / `metaphor` / `concept` / `measurement` / `gate` |
| `compresses` | string | no | What the term replaces (the paragraph of instruction it saves) |
| `cited_in` | array | no | Where the term is used: `briefs`, `prompts`, `playbooks`, `evals` |
| `created` | string | yes | ISO date when added |
| `protocol_version` | string | yes | Protocol version when added |
| `notes` | string | no | Additional context, test of validity, prior art |

### Initial terms (migrate from current CL)

Migrate the 10 existing terms from the inline CL:
1. Locus tags
2. Wrap-up
3. Predictably adequate
4. No muppets
5. Stuff into Things
6. Edge-lord
7. Pizza shop / chip pan fire
8. The moat question
9. The Derrida question
10. Decorated Stuff

### Reference from protocol prompt

Move the Edinburgh Protocol to `SYSTEM.md` at the repo root. This is the system prompt — the file an agent reads first. Currently it lives at `prompts/edinburgh-protocol.md`. Moving it to root makes it a primary component, visible alongside `AGENTS.md`.

Replace the inline CL in `SYSTEM.md` and `~/.pi/agent/AGENTS.md` with a reference:

```markdown
# CONCEPTUAL LEXICON
The registry of defined terms. Cited terms in briefs/evals should resolve here.
See `conceptual-lexicon.jsonl` at the repo root for the full registry. Founded 2026-07-14.
```

The repo now contains everything: `SYSTEM.md` (the protocol), `AGENTS.md` (the boundary), `conceptual-lexicon.jsonl` (the terms). No external references needed. The repo IS the config.

### Query interface

```bash
# Look up a term
cat conceptual-lexicon.jsonl | jq 'select(.term == "wrap-up")'

# List all terms
cat conceptual-lexicon.jsonl | jq -r '.term' | sort

# Check if a cited term resolves
cat conceptual-lexicon.jsonl | jq -r 'select(.term == "frobnitz") | .term'  # empty = not found

# Terms by category
cat conceptual-lexicon.jsonl | jq 'select(.category == "metaphor")'
```

## Acceptance criteria

- [ ] `conceptual-lexicon.jsonl` created at repo root with all 10 existing terms
- [ ] JSONL is valid (each line parses as JSON)
- [ ] Schema documented (either inline or as `conceptual-lexicon.schema.json` at root)
- [x] `SYSTEM.md` created at repo root (2026-07-20): Protocol text moved to `SYSTEM.md`; `prompts/edinburgh-protocol.md` is now a compat symlink → `../SYSTEM.md` (all existing refs resolve, incl. `~/.pi/agent/AGENTS.md`). High-value refs updated (adopt-edinburgh, justfile, README); descriptive-ref tidy across decisions/briefs/playbooks pending (low-risk, no breakage — all resolve via the symlink).
- [ ] `SYSTEM.md` CL section replaced with reference to `conceptual-lexicon.jsonl`
- [ ] `~/.pi/agent/AGENTS.md` CL section replaced with reference to `conceptual-lexicon.jsonl`
- [ ] Query examples work (jq can search/filter from repo root)
- [ ] Playbook created (`playbooks/conceptual-lexicon-playbook.md`)

## Notes

- The schema pattern follows the JSON Schema convention used in `ctx-cli-dev/silo_barley/schema.json` — adapt for CL requirements (different fields, different validation rules).
- The JSONL file is append-only. New terms are new lines. No rewriting existing entries — version them instead (add a new line with updated definition, mark old as superseded).
- The CL is the prompt compression mechanism. Terms that don't compress (one word doesn't replace a paragraph) don't belong in the CL — they belong in a glossary. The CL is not a glossary.
- Anti-ceremony: don't add terms that aren't cited. A term in the CL that nobody uses is entropy.
