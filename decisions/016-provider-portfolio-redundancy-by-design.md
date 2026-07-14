# Decision 016: Provider portfolio — redundancy-by-design

**Date:** 2026-07-12
**Status:** Accepted

## Context

ZenMux brought online as a supplemental provider (10 models), alongside retained directs (Z.ai, Moonshot, MiniMax, OpenRouter, NVIDIA). The operator's lived experience: Z.ai-direct GLM-5.2 is variable (`pi-check` showed it timing out this session), providers rate-limit and fail, and the operator's reflex is to **switch provider and continue**. Cross-provider freebies recur (nex-n2-pro:free, grok-4.5-free, glm-4.7-flash-free) and are worth grabbing. A consolidate-to-one-provider config was considered (the anti-entropy reflex) and rejected.

## Decision

Treat providers as a **portfolio**, diversified for failover and freebie capture — not a graph to be deduplicated. Multiple independent routes to the same model are **resilience, not entropy**. Specifically:

- **Supplement, don't consolidate.** ZenMux added alongside directs; no direct retired (yet). Consolidation is deferred until ZenMux proves reliable over time — *prove before you bet*.
- **The barnacle review (Decision 007) is the brake.** It prunes *expired promos* (freebies with expiry) and *dead routes*, but **preserves failover routes**. That distinction stops the portfolio from becoming the palimpsest.
- **The provider registry is generated, not hand-maintained** (`scripts/gen-provider-registry.ts`, `just registry`). Hand-maintenance caused the prior drift — the doc claimed a live zenmux provider that did not exist.

The anti-entropy principle applies *within* a provider (curate the model list) and to *config/doc hygiene* — not across cross-provider failover paths.

## Alternatives considered

- **Consolidate to ZenMux (one route per model).** Rejected — single point of failure; loses cross-provider freebies; loses switch-on-blocker resilience. Theoretically clean, empirically worse under flakiness.
- **Migrate GLM-5.2 off Z.ai to ZenMux only.** Rejected for the same reason — keeping the Z.ai direct route is the failover that survives a ZenMux outage (and vice versa). Both routes stay.

## Consequences

- **Easier:** a blocker on one provider no longer stops work (Z.ai timed out → ZenMux `glm-5.2` carries the route); freebies captured as they appear; new models (Gemini 3.x, GPT-5.6, Grok 4.5) reachable via one aggregator key.
- **Harder:** config-surface grows (per-route `compat` quirks differ); freebies expire (churn). Both managed by the barnacle review + the generated registry.
- **Cleanup landed this session:** `omlx` inline API key relocated to `!skate get open_api_key` (no secret in config); `docs/provider-registry.md` regenerated from live.

## References

- Live config: `~/.pi/agent/models.json` (zenmux provider, 10 models)
- Eval data (this session): `data/eval_log.json` — gpt-5.6-luna, grok-4.5, gemini-3.5-flash all 4/4 primed traps
- Decision 005 (squadron pruning — MiniMax M3 dropped; M2.7 is the ZenMux minimax, **not** M3)
- Decision 007 (barnacle review — the brake)
- Decision 013 (silo exception — models.json in-scope)

---

*Providers are a portfolio, not a dedup graph. Redundancy is resilience; the barnacle review is what keeps it from rot.*
