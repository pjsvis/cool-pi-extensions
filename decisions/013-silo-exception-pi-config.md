# Decision 013: Silo exception — Pi agent config files (models.json, settings.json)

**Date:** 2026-07-10  
**Status:** Accepted  
**Review:** 2026-09-21 (quarterly barnacle review)

---

## Context

The Edinburgh Protocol's SILO DISCIPLINE constrains the agent to the repository boundary — out-of-repo requests are declined with "I'm staying in." This repo (`cool-pi-extensions`) exists to build and manage Pi tooling and configuration. Managing Pi's providers and models — wiring ZenMux, exposing Z.ai GLM-5.2, retiring cerebras (Decision 014, pending) — requires editing Pi's runtime config at `~/.pi/agent/`, which lives outside the repo. Under the unmodified silo policy the agent cannot perform this work; it degrades to handing the user copy-paste snippets. That defeats the purpose of an agent operating in a Pi-configuration repo.

A blanket "the agent may edit anywhere under `~/.pi/`" would be too broad: `~/.pi/agent/auth.json` holds API keys and OAuth tokens, and secrets (skate) must remain the user's domain. The exception needs to be **narrow, named, and exclusive of secrets**.

**Enforcement reality (verified 2026-07-10):**
- The silo extension is installed at `~/.pi/agent/extensions/silo/` as a **separate copy** — not symlinked from the repo source, unlike `defuddle` and `edinburgh-evals`.
- Its global config sets `"siloRoot": "/path/to/repo"` — a placeholder that does not exist, so the extension **self-disables** (`existsSync` fails → `sandboxEnabled = false`). Silo is therefore **not currently enforcing**; "I'm staying in" is a policy constraint, not a hard code boundary, in this repo today.
- Pi config files present: `models.json` (provider/model definitions), `settings.json` (settings), `auth.json` (secrets, mode 600).

## Decision

**A single, scoped exception to SILO DISCIPLINE for this repo.** The agent MAY read and edit the Pi agent **configuration** files `~/.pi/agent/models.json` and `~/.pi/agent/settings.json` on the user's behalf.

The exception is **narrow and exclusive**. It does NOT extend to:
- `~/.pi/agent/auth.json` or any file containing API keys, OAuth tokens, or credentials.
- skate secrets (`skate get` / `skate set`) — secrets remain the user's domain.
- any other path outside the repo.

This is the **sole** exception to "I'm staying in." All other out-of-repo requests continue to be declined.

**Preference ordering for provider definitions:** where a durable, version-controlled provider definition is the goal (e.g. registering ZenMux), the **preferred** mechanism is an in-repo Pi extension using `pi.registerProvider()` (see Pi's `docs/custom-provider.md`) — versioned, reviewable, barnacle-auditable. The `models.json` exception covers what extensions cannot: runtime/personal state such as removing a built-in provider's exposure, personal overrides, and default-model selection. **Extensions for definitions; `models.json` edits for runtime state.**

## Alternatives Considered

### Alternative A: No exception — user edits Pi config manually
- **Pros:** Maximally conservative; silo stays intact.
- **Cons:** Defeats the purpose of an agent in a Pi-configuration repo; reduces the agent to a snippet-generator for the exact work the repo exists to do. **Reject.**

### Alternative B: Blanket exception for all of `~/.pi/`
- **Pros:** Simple; no enumeration.
- **Cons:** Co-mingles secrets (`auth.json`, skate); a broad hole in the boundary. Violates the secrets-stay-user's-domain principle. **Reject.**

### Alternative C: In-repo extensions only, never edit `models.json`
- **Pros:** Everything version-controlled; silo never breached.
- **Cons:** Extensions cannot express all runtime state — removing a built-in provider, personal overrides, default-model selection still require `models.json` / `settings.json`. Partial. **Adopt extensions as the preferred path for definitions**, but keep the `models.json` / `settings.json` exception for runtime state.

**Chosen:** Scoped exception for `models.json` + `settings.json` only; secrets excluded; extensions preferred for durable definitions.

## Consequences

### Positive
- The agent can manage Pi config end-to-end (provider wiring, model exposure, cerebras retirement — Decision 014) without degrading to copy-paste handoffs.
- The exception is named and bounded — auditable at quarterly barnacle review.
- Secrets boundary preserved: `auth.json` and skate remain out of scope.

### Negative
- A deliberate, narrow hole in the silo. **Mitigated by:** two-file scope, explicit secrets exclusion, documented here and in `AGENTS.md`.
- **Enforcement gap (current):** because silo is inactive today (placeholder `siloRoot`), this exception is policy-only. If silo is later activated with a real `siloRoot`, the extension will hard-block `~/.pi/agent/` — the exception would become unenforceable. Closing this requires an `allowedPaths` mechanism in the silo extension (see Implementation).

## Implementation

- **`AGENTS.md`** — exception clause added (loaded into every session's context). This is the operative "explicit in the repo" surface.
- **This ADR** — full rationale, scope, and enforcement-gap record.
- **Enforcement follow-up (pending, not done):** add an `allowedPaths` field to the silo extension (`src/extensions/silo/index.ts`) permitting `~/.pi/agent/models.json` and `~/.pi/agent/settings.json`, and make the **active** extension pick it up. Caveat: the active silo is a **separate installed copy**, not the repo source — so the change must be applied to the installed copy, or the installed copy replaced with a symlink to the repo source (as `defuddle` / `edinburgh-evals` already are). Security-relevant; do it deliberately, not silently.

## References

- Edinburgh Protocol — SILO DISCIPLINE (`prompts/edinburgh-protocol.md`; global `~/.pi/agent/AGENTS.md`)
- Silo extension: `src/extensions/silo/index.ts` (source); installed at `~/.pi/agent/extensions/silo/` (separate copy)
- Pi custom-provider docs: `docs/custom-provider.md` (`pi.registerProvider()`)
- Decision 014 (pending) — model/provider wiring this exception enables: Z.ai primary, cerebras retired, ZenMux wired
