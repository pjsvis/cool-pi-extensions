# Decision 019: Failover ordering — freebie → cheapest → direct → expensive

**Date:** 2026-07-19
**Status:** Accepted
**Supersedes:** none (codifies Decision 016's portfolio principle into an ordering rule)

## Context

Decision 016 established that providers are a portfolio for failover + freebie capture, not a dedup graph — redundancy is resilience, not entropy. But it did not specify the *ordering* of routes for a given model family. With three direct providers added in one session (SpaceXAI, Qwen/DashScope, DeepSeek), the portfolio now carries 2–3 routes for most families, and the ordering question became unavoidable.

Two empirical findings drove this decision:

1. **Direct is not always cheaper.** Qwen 3.7 Max direct (DashScope) is $2.50/$7.50; the ZenMux proxy is $0.43/$1.29 — ~5× cheaper. A reflexive "direct first" rule would route the expensive option. The direct qwen route earns its place via the free-tier GLM/DeepSeek freebies and qwen3.7-plus (which ZenMux doesn't carry), not as the cheap 3.7-max route.
2. **Free-tier freebies are zero-cost until quota.** qwen's GLM-5.2/DeepSeek and zenmux's grok-4.5-free are pure freebie capture (Decision 016). They should be exhausted before paid routes.

## Decision

For each model family, order routes by effective cost: **free-tier freebie → cheapest reliable → direct (failover) → expensive proxy (desperation).**

Ordering is by cost, not by "direct vs proxy." Direct routes are failover/alternatives, not automatic primaries. Concretely (2026-07-19 snapshot):

| Family | Primary → last |
|---|---|
| GLM-5.2 | qwen-free → zai → zenmux |
| DeepSeek V4 Pro | qwen-free → zenmux → deepseek-direct |
| DeepSeek V4 Flash | qwen-free → openrouter |
| Qwen 3.7 Max | zenmux → together → qwen-direct |
| Qwen 3.7 Plus | zenmux → qwen-direct |
| Grok 4.5 | zenmux-free → spacexai → zenmux-paid |
| Grok 4.3 | spacexai → zenmux |
| Kimi K2.6 | moonshot → zenmux → openrouter |

The eval's fallback chains (`src/cli/pi-check/edinburgh-eval.ts`) are wired to this ordering, with free-tier freebies omitted from eval primaries (quota risk mid-sweep) but available as live-config routes.

## Consequences

- **A "direct" provider is not a mandate to make it primary.** Adding a direct route adds failover + freebie capture; the cheapest route stays primary even if it's a proxy.
- **Stale expensive proxies get pruned.** The openrouter grok-4.3 $3/$15 override was dropped — superseded by spacexai direct ($1.25/$2.50). The barnacle review (Decision 007) re-checks this.
- **Free-tier quotas are finite** (qwen: 90-day new-user quota; zenmux free models: plan-bound). When a freebie exhausts, ordering auto-falls to the next route — no config change needed (the eval's fallback chain handles it; live-config routes remain).
- **Pricing inversions must be re-checked at each barnacle review.** The Qwen 3.7 Max inversion (proxy 5× cheaper than direct) could flip if either provider changes pricing. Don't let a stale "direct is cheaper" assumption freeze a bad primary.
