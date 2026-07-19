# Model Choice

Use-case map. The graded eval clusters **11 models at 16/16** — it's a "no muppets"
gate, not a fine rank. Among graduates, choose by **task + cost + experience**,
not by score alone.

## Default (your daily drivers)

- **Kimi K2.6** — 16/16 · $0.95/$4 · fast (~45s). The proven all-rounder.
- **GLM-5.2** — 16/16 · $1.4/$4.4 · 1M ctx, vision, MIT weights. Long-context + coding.

## Get out more — pick by task

| Task | Model | Cost |
|---|---|---|
| 1M context, cheap | **Qwen 3.7 Plus** | $0.40/$1.60 |
| Cheap volume / batch | **DeepSeek V4 Flash** | $0.14/$0.28 |
| Cheap + strong (surprise) | **Ring 2.6** | $0.30/$2.50 |
| Underrated workhorse | **DeepSeek V4 Pro** | $0.44/$0.89 |
| Coding (open-weight) | **Grok Build 0.1** | $1/$2 |
| Hardest frontier | **Claude Opus** | $5/$25 |
| Vision / multimodal | **Grok 4.5** / Qwen 3.7 Plus | $2/$6 · $0.40/$1.60 |
| Free tier (grab-and-use) | **Grok 4.5 Free** (zenmux) / qwen free-tier GLM·DeepSeek | $0 |

## Avoid (failed the gate)

MiniMax M3 (0/16) · Ernie 5.1 (6/16) · Nemotron 120B/49B (7/16) · GPT-5 (0/16 — refused the eval scenario; frontier, but test on real tasks before trusting).

## The rule

The score is the **admission gate**. Among the 16/16 graduates, **your task is the
selector** — the score can't tell you which one writes the code you like. Try one
new model per session; that's how Ring 2.6 and DeepSeek V4 Pro got found.

---

Full eval table + provider routes: [RECOMMENDED.md](RECOMMENDED.md) · Failover ordering: [Decision 019](../decisions/019-failover-ordering-policy.md).
