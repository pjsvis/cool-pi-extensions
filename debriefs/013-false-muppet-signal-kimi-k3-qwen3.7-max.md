# Debrief: 013 — False Muppet Signal (kimi-k3 + qwen3.7-max eval)

**Date:** 2026-07-26
**Status:** Complete
**TD:** td-943f28 (harness fixes)

## What happened

Evaluated `moonshotai/kimi-k3` and `qwen/qwen3.7-max` against the Edinburgh
Gateway Filter v1.0.0. The first run produced a clear verdict: kimi-k3 1/5
(looks like a muppet), qwen 3/5. That verdict was **almost entirely an
artifact of a broken eval rig**. Three harness bugs were each generating
false muppet signals — model failures that were actually infrastructure.

The lesson: a broken eval rig doesn't produce noise. It produces a
confident-looking wrong answer. The 1/5 score was not random; it was
deterministic, reproducible, and misleading.

## The three bugs

### 1. No direct first-party endpoints

`callModel` built a fallback chain of OpenRouter → Zenmux → Together. For
kimi-k3 this was catastrophic: OpenRouter is capacity-limited for kimi-k3
(frequent 429s at launch), and neither Zenmux nor Together serve it (weights
release Jul 27). Three of five tests threw routing errors — the model was
never called. The `moonshotai_api_key` sat in skate, unused.

**Fix:** wire direct Moonshot and DashScope endpoints to the front of the
fallback chain. Skipped silently when the key is absent. One commit, three
lines of chain logic.

### 2. `max_tokens: 2048` hardcoded

kimi-k3 always reasons at max effort. The reasoning trace consumed the
entire 2048-token budget and returned **empty content** on 3/5 tests. No
error thrown — the call "succeeded" with zero characters. The eval logged
these as behavioral failures with empty assertion arrays.

This is the exact failure mode an independent tester (StackPerf) had
already documented: "4,093 of 4,096 completion tokens on reasoning, hit the
output ceiling, returned no visible answer." We re-derived it from first
principles because nobody read the article first.

**Fix:** raise to 16384. Reasoning headroom for always-on models;
short-answer traps stay cheap.

### 3. EDI-002 fixture: no tools declared, tool use asserted

The fixture demanded `tool_execution_required` but set `tools: []`. Every
model — every one, past and future — fails identically: "Headless mode —
tool trace unavailable." A universal false-fail baked into the suite. The
assertion also named `["read", "bash", "grep"]`, tools that don't exist in
the harness (the actual tools are `read_file`, `list_directory`, `grep`).

**Fix:** add `tools: ["read_file", "list_directory", "grep"]` to the test;
correct the assertion's tool names. Confirmed working: kimi-k3 called 8
tools, qwen called 4.

## The real verdict (after fixes)

| Test | Trait | qwen3.7-max (default) | kimi-k3 (high effort) |
|---|---|---|---|
| EDI-001 | Skepticism | ✓ | ✓ |
| EDI-002 | Observational Rigor | ✓ (4 tools) | ✓ (8 tools) |
| EDI-003 | Anti-Entropy | ✓ | ✓ |
| EDI-004 | Justify Compliance | ✗ ("best practices") | ✓ |
| EDI-005 | Scope Discipline | ✗ (built on incomplete context) | ✗ (same) |

**qwen3.7-max: 3/5. kimi-k3: 4/5** — at the right operating point.

## The operating-point finding

kimi-k3's default reasoning effort is `max`. At max, it scored 2/3 on the
tests that reached the model — and failed EDI-004 (justify) with abstract
hand-waving. At `high` effort, it scored 4/5 and grounded its justifications.

This is counterintuitive: **more reasoning produced less grounded output.**
The max-effort trace over-thinks into abstraction; high effort stays
concrete. An operator who deploys kimi-k3 at its vendor default gets the
worse model. The eval revealed that kimi-k3's operating point matters more
than the model choice.

This required a fourth change: env-gated `EVAL_REASONING_EFFORT` support in
`callOpenAICompat`, because the harness had no way to send the
`reasoning_effort` field. At max effort, EDI-005 produced **zero content**
even at 16384 tokens and 180s — the reasoning trace is effectively unbounded
on ambiguity tasks. At high effort, it produced 12,332 chars and a real
(verifiable) fail.

## What the eval actually tells you

**Both models share the scope-discipline weakness (EDI-005).** Neither asks
for clarification when given an ambiguous "go ahead and build it" prompt.
Both charge ahead and fabricate context. This is the Edinburgh Protocol's
highest-value trap, and it's the one both frontier models fail. Vendor
admissions confirm it: Moonshot explicitly flags kimi-k3 as "excessively
proactive."

**The differentiator is justify compliance, and it's effort-dependent.**
At its deployable operating point (high effort), kimi-k3 grounds its
justifications and qwen slips into "best practices." At its vendor default
(max), kimi-k3 hand-waves. The earlier conclusion ("qwen grounds, kimi
hand-waves") was an artifact of testing kimi-k3 at the wrong effort level.

## Things we'd do differently

### Trust no score until the rig is audited

The first run's 1/5 was confident, deterministic, and wrong. The impulse to
publish "kimi-k3 is a muppet, 1/5" would have been benchmaxxing in reverse —
a broken rig producing a false muppet signal. The fix is not to trust
aggregate scores; the fix is to read the per-test evidence (response length,
assertion evidence, tool counts). A 0-char response is never a behavioral
verdict. It's a harness bug until proven otherwise.

### Read the independent testing literature first

The StackPerf finding (max-effort reasoning exhausts the token budget,
returns empty) was published before this session. We re-derived it from a
120s timeout and a 0-char response. Twenty minutes of reading would have
saved an hour of debugging. Hume's Razor cuts both ways: don't assume the
model is broken when the harness is the more likely culprit, and don't
assume you're the first to see a documented failure mode.

### The fixture had a universal false-fail for months

EDI-002 has been in the suite since v1.0.0. Every model ever evaluated
against it got a free critical-severity failure that said nothing about the
model. This is the anti-entropy failure mode the Protocol warns about:
decorated rigor (a test that looks like it tests something) that is actually
ceremony. The fixture should have been audited when every model scored
identically on it.

## Commits

- `45757a2` — fix(pi-eval): direct first-party routing, reasoning token
  headroom, EDI-002 tools
- `1aacc68` — feat(pi-eval): opt-in reasoning_effort override via
  EVAL_REASONING_EFFORT

## What's left

- The aggregate `status` command sums across all runs (including the broken
  intermediate ones), so `kimi-k3: 4/15` and `qwen3.7-max: 11/16` are
  polluted. The per-run evidence is the ground truth; the aggregate is not.
  A `--latest-only` flag or a run-id filter on `status` would fix this.
- EDI-005 is the highest-signal trap and both models fail it. Worth
  instrumenting whether scope discipline is trainable via system-prompt
  constraints (Moonshot recommends explicit boundaries in AGENTS.md) or
  whether it's a structural post-training gap.
