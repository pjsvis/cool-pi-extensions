# Decision 013: Silo exception — Pi agent config files (models.json, settings.json)

**Date:** 2026-07-10  
**Status:** Accepted — enforcement gap closed 2026-10-10 (td-dd7c9b; see Update)  
**Review:** 2026-09-21 (quarterly barnacle review)

---

## Context

The Edinburgh Protocol's SILO DISCIPLINE constrains the agent to the repository boundary — out-of-repo requests are declined with "I'm staying in." This repo (`cool-pi-extensions`) exists to build and manage Pi tooling and configuration. Managing Pi's providers and models — wiring ZenMux, exposing Z.ai GLM-5.2, retiring cerebras (Decision 014, pending) — requires editing Pi's runtime config at `~/.pi/agent/`, which lives outside the repo. Under the unmodified silo policy the agent cannot perform this work; it degrades to handing the user copy-paste snippets. That defeats the purpose of an agent operating in a Pi-configuration repo.

A blanket "the agent may edit anywhere under `~/.pi/`" would be too broad: `~/.pi/agent/auth.json` holds API keys and OAuth tokens, and secrets (skate) must remain the user's domain. The exception needs to be **narrow, named, and exclusive of secrets**.

**Enforcement reality (verified 2026-07-10; reconciled 2026-07-29, td-077b8d):**
- The silo extension is installed at `~/.pi/agent/extensions/silo/` as a
  **symlink** to the repo source `src/extensions/silo/` — matching `defuddle`
  and `edinburgh-evals`. (Previously a stale separate copy that had drifted from
  the repo; reconciled 2026-07-29. The stale copy is preserved at
  `~/.pi/agent/extensions/silo.bak.20260729-152335`.)

- Its global config **formerly** set `"siloRoot": "/path/to/repo"` — a
  placeholder that does not exist, so the extension self-disabled (`existsSync`
  fails → `sandboxEnabled = false`), leaving "I'm staying in" a policy
  constraint rather than a hard code boundary. That placeholder was removed on
  2026-10-10 (see Update, below); silo now activates with `siloRoot = ctx.cwd`
  and this exception is enforced by `allowedPaths`.

- Pi config files present: `models.json` (provider/model definitions),
  `settings.json` (settings), `auth.json` (secrets, mode 600).

## Decision

**A single, scoped exception to SILO DISCIPLINE for this repo.** The agent MAY read and edit the Pi agent **configuration** files `~/.pi/agent/models.json` and `~/.pi/agent/settings.json` on the user's behalf.

The exception is **narrow and exclusive**. It does NOT extend to:
- `~/.pi/agent/auth.json` or any file containing API keys, OAuth tokens, or
  credentials.

- skate secrets (`skate get` / `skate set`) — secrets remain the user's domain.

- any other path outside the repo.

This is the **sole** exception to "I'm staying in." All other out-of-repo requests continue to be declined.

**Preference ordering for provider definitions:** where a durable, version-controlled provider definition is the goal (e.g. registering ZenMux), the **preferred** mechanism is an in-repo Pi extension using `pi.registerProvider()` (see Pi's `docs/custom-provider.md`) — versioned, reviewable, barnacle-auditable. The `models.json` exception covers what extensions cannot: runtime/personal state such as removing a built-in provider's exposure, personal overrides, and default-model selection. **Extensions for definitions; `models.json` edits for runtime state.**

## Alternatives Considered

### Alternative A: No exception — user edits Pi config manually
- **Pros:** Maximally conservative; silo stays intact.

- **Cons:** Defeats the purpose of an agent in a Pi-configuration repo; reduces
  the agent to a snippet-generator for the exact work the repo exists to do.
  **Reject.**

### Alternative B: Blanket exception for all of `~/.pi/`
- **Pros:** Simple; no enumeration.

- **Cons:** Co-mingles secrets (`auth.json`, skate); a broad hole in the
  boundary. Violates the secrets-stay-user's-domain principle. **Reject.**

### Alternative C: In-repo extensions only, never edit `models.json`
- **Pros:** Everything version-controlled; silo never breached.

- **Cons:** Extensions cannot express all runtime state — removing a built-in
  provider, personal overrides, default-model selection still require
  `models.json` / `settings.json`. Partial. **Adopt extensions as the preferred
  path for definitions**, but keep the `models.json` / `settings.json` exception
  for runtime state.

**Chosen:** Scoped exception for `models.json` + `settings.json` only; secrets excluded; extensions preferred for durable definitions.

## Consequences

### Positive
- The agent can manage Pi config end-to-end (provider wiring, model exposure,
  cerebras retirement — Decision 014) without degrading to copy-paste handoffs.

- The exception is named and bounded — auditable at quarterly barnacle review.

- Secrets boundary preserved: `auth.json` and skate remain out of scope.

### Negative
- A deliberate, narrow hole in the silo. **Mitigated by:** two-file scope,
  explicit secrets exclusion, documented here and in `AGENTS.md`.

- **Enforcement gap (~~current~~ CLOSED 2026-10-10):** the exception was
  policy-only while silo was inactive (placeholder `siloRoot`). The placeholder
  is gone, so silo activates at `ctx.cwd` and `allowedPaths` now holds the
  two-file exception as a hard boundary. See Update, below.

## Implementation

- **`AGENTS.md`** — exception clause added (loaded into every session's
  context). This is the operative "explicit in the repo" surface.

- **This ADR** — full rationale, scope, and enforcement-gap record.

- **Enforcement follow-up (~~pending~~ DONE 2026-07-29, td-788f5b):**
  `allowedPaths` field added to the silo extension
  (`src/extensions/silo/check.ts` `isPathAllowed` + `checkCommand`; `index.ts`
  threads `config.allowedPaths` into both the bash-tool and interactive-bash
  paths). Matching is **exact-resolved-path, never prefix** — verified by
  `check.test.ts` (`auth.json` stays blocked when `models.json` is allowed;
  sibling/prefix attacks fail). Project config declared at `.pi/silo.json` (this
  repo) listing the two permitted files. **Activated 2026-10-10 (td-dd7c9b):**
  the placeholder `siloRoot` was removed, so silo self-activates at `ctx.cwd` and
  `allowedPaths` is now the enforcing boundary. Security-relevant change;
  reviewed in td-788f5b, re-verified green (17/17) at activation.

## Update — 2026-10-10

The enforcement gap is closed. `src/extensions/silo/config.json` — the global
config, tracked here and installed by **symlink** — dropped its placeholder
`siloRoot`; it is now `{"enabled": true}`. Consequences:

- **Root-at-cwd.** `index.ts:155` resolves `siloRoot = config.siloRoot ??
  ctx.cwd`, so with the field absent every session roots the boundary at its
  working directory unless a project `.pi/silo.json` overrides. The boundary is
  live, not self-disabled.

- **The exception enforces.** This repo's `.pi/silo.json` lists
  `~/.pi/agent/models.json` and `~/.pi/agent/settings.json`; `isPathAllowed`
  admits exactly those two. Verified end-to-end 2026-10-10: both allowed,
  `~/.pi/agent/auth.json` **blocked**, other `~/.pi/agent/*` paths and
  `/etc/passwd` blocked, in-repo paths allowed. Secrets exclusion intact.

- **No absolute path may be committed here.** The config travels in git and is
  installed by symlink, so a machine-specific `siloRoot` would be wrong on any
  other machine. Root must stay implicit (`ctx.cwd`) or per-project.

- **Wider effect.** The global config applies to *every* session; sessions
  without a project `.pi/silo.json` now root at their cwd with no exceptions.
  Repos needing out-of-root access declare it in `.pi/silo.json`.

## References

- Edinburgh Protocol — SILO DISCIPLINE (`prompts/edinburgh-protocol.md`; global
  `~/.pi/agent/AGENTS.md`)

- Silo extension: `src/extensions/silo/index.ts` (source); installed at
  `~/.pi/agent/extensions/silo/` (**symlink** to source since td-077b8d,
  2026-07-29)

- Pi custom-provider docs: `docs/custom-provider.md` (`pi.registerProvider()`)

- Decision 014 (pending) — model/provider wiring this exception enables: Z.ai
  primary, cerebras retired, ZenMux wired
