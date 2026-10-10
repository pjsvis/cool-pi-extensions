# Decision 025: Remove the silo extension — a soft lexical boundary is false confidence

**Date:** 2026-10-10
**Status:** Accepted
**TD:** td-866140 (cross-silo seam message from the okuda silo)

---

## Context

`src/extensions/silo/` was a pi extension that wrapped the bash tool with a
lexical path check: any command whose *literal* arguments referenced a path
outside `siloRoot` returned "I'm staying in." It was installed globally at
`~/.pi/agent/extensions/silo` (a symlink into this repo) and was the enforcement
mechanism for Decision 013's Pi-config exception (`allowedPaths`).

It shipped with an honest-scope admission in `check.ts`: the boundary catches
cooperative accidents only, and does not withstand runtime-constructed paths,
symlinks, or tools that read implicit config. It carried its own escape hatch
(`--no-silo`) and a test suite (`check.test.ts`, 17 tests).

It also carried a defect that made it worse than nothing.

## The finding

`extractPaths` (`src/extensions/silo/check.ts`) used the unanchored regex:

```
/(\/(?:[^\s/]+\/)*[^\s]*)|(~[^\s]*)/g
```

Because it is unanchored, it matches at **any** `/` — including a slash inside a
relative path — and captures a phantom absolute fragment. Measured against the
pure functions before deletion (siloRoot = the repo root, no `allowedPaths`):

| Command | Extracted | Result |
|---|---|---|
| `ls src` | `[]` | allow |
| `ls src/` | `["/"]` | **BLOCK** |
| `cat src/vectors.ts` | `["/vectors.ts"]` | **BLOCK** |
| `echo a/b` | `["/b"]` | **BLOCK** |
| `grep -n foo src/extensions/silo/check.ts` | `["/extensions/silo/check.ts"]` | **BLOCK** |
| `rg "a/b" src` | `["/b\""]` | **BLOCK** |
| `ls <abs>/src` | `["<abs>/src"]` | allow |
| `git diff HEAD~3..HEAD` | `["~3..HEAD"]` | **BLOCK** |
| `cat /etc/passwd` | `["/etc/passwd"]` | BLOCK (intended) |

Two failures of contract:

1. **Inside-root relative paths were blocked.** Any relative path containing a
   slash — i.e. most file operations an agent performs — resolved outside the
   root. The advertised boundary blocked the normal path, not just the escape.
2. **`~` mid-token was read as `$HOME`.** `git diff HEAD~3..HEAD` was blocked,
   and `check.test.ts` *asserted that as correct*.

The tests covered `ls src` but not `ls src/`, so the false positive was
invisible to CI. The defect is a property of the shape, not of one regex: a
blocking lexical wrapper can only ever be a fuzzy guess, and adding tests to a
false-positive generator only makes the false positives tested.

## Decision

**Delete the extension. Do not patch it.**

- A soft lexical boundary is false confidence. Its own honest scope admits it
  cannot withstand adversarial input, and its tests *demonstrate* the
  runtime-constructed-path escape. A boundary that cannot hold the honest case
  and blocks the legitimate one is a tax with no security gain.

- The cooperative case it targeted is already covered by the Protocol's
  behavioural **SILO DISCIPLINE** — a cultural constraint, not a code jail.

- The designation lies about its referent. "silo" in the Protocol means a
  *semantic/repository* boundary, not a filesystem jail (Base Epistemic
  Attitude, clause 4). Two incompatible referents under one name.

If the feature is ever wanted again, it must be **rebuilt to the requirement,
not the regex**: either real OS-level containment (chroot / namespace /
container), or a **non-blocking warning** (a lexical check can only ever be a
fuzzy nudge), with relative-path cases in the tests.

## Alternatives considered

- **Patch the regex** (anchor tokens to whitespace/word boundaries, stop
  treating mid-token `~` as home). Rejected: it fixes the symptoms while
  preserving the false premise that a blocking lexical check is a boundary. The
  next unhandled path form would fail the same way.

- **Keep it disabled** (`{"enabled": false}`). Rejected as dead weight: an
  extension that does nothing on disk, still installed, still named "silo".

- **Keep it and document the limitation harder.** Rejected: the limitation is
  not a footnote, it is the mechanism — and the false positives block work.

## Consequences

- `src/extensions/silo/` (source + tests), the tracked global config
  `config.json`, and this repo's `.pi/silo.json` are removed. The operator
  removes the installed symlink and the `settings.json` entry separately.

- **Decision 013 reverts to policy-only.** `allowedPaths` no longer enforces
  anything; the Pi-config exception is carried by `AGENTS.md` and the ADR, as it
  was before the extension existed. This is the honest state for a rule no code
  can hold.

- `just test` is removed (its only subject was the silo suite).

- `README.md` no longer advertises the extension.

- **Positive:** one fewer parallel mechanism claiming a boundary it cannot hold;
  fewer moving parts between the agent and its tools; the false positives stop.

## References

- The finding, as relayed: okuda silo seam message, 2026-10-10 (`td-866140`).
  Independently reproduced here against the pure functions.
- `decisions/013-silo-exception-pi-config.md` — the exception the extension was
  built to enforce; now policy-only.
- `prompts/edinburgh-protocol.md` — SILO DISCIPLINE; Base Epistemic Attitude,
  clause 4 (a designation must not lie about its referent).
- Deleted: `src/extensions/silo/{index.ts,check.ts,check.test.ts,config.json,package.json}`.
