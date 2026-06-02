# brief: Rewrite silo extension

**Created:** 2026-06-02
**TD:** td-8997b7
**Status:** pending

## What

Rewrite the `silo-sandbox` extension with two changes:

1. **Rename** to `silo` — shorter, ties into the Edinburgh Protocol's "SILO DISCIPLINE" clause. The agent already understands this concept.

2. **Use pi's built-in bash backend** — currently spawns raw `bash -c` subprocesses, which means commands can't see files written through pi's MVFS overlay. Replace with `createBashTool` using `createLocalBashOperations()`, layering the silo path-check on top.

## Why

- The raw `bash -c` approach breaks `cat`, `ls`, `git diff`, etc. for files the agent just wrote — the overlay filesystem is invisible.
- "silo-sandbox" → "silo" is four letters, one concept, zero confusion.

## How

In `index.ts`:

1. Import `createLocalBashOperations` from `@earendil-works/pi-coding-agent`
2. Replace `createSiloBashOps` (the hand-rolled spawn wrapper) with a thin layer that: wraps `createLocalBashOperations()`, runs the path check, and delegates to pi's built-in exec for clean commands
3. Remove the `node:child_process` spawn logic entirely
4. Rename directory `silo-sandbox` → `silo`, update `package.json` name, update `config.json` path references

## Acceptance criteria

- `pi --no-silo-sandbox` → `pi --no-silo` (or keep old flag as alias?)
- Extension directory: `extensions/silo/`
- Agent can `cat`/`ls`/`grep` files it just wrote while siloed
- Blocked paths still return "I'm staying in."
- `/silo-status` still works
- Config file path: `.pi/silo.json` (project) and `extensions/silo/config.json` (global)
- `herdr-agent-state` no longer needed? (It was auto-installed by herdr, not custom — check)
- README updated with new name and install instructions

## Out of scope

- Test suite (for now — can add later with pi's provider test framework)
- Video/audio input support