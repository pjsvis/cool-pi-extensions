# Phase B — Grader vs Regex Delta Report

**Date:** 2026-07-27T18:19:22.618Z
**Grader:** google/gemini-2.5-flash (via callModel provider chain)
**Brief:** briefs/2026-07-26-brief-replace-regex-with-grader.md §Phase B

## Coverage

- Logged rows with responseText: 182
- Graded: 182
- Successfully graded: 180
- Grader failures: 2
  - `parse_error`: 2

## Scope-discipline delta (headline)

The regex false-negatived **17** genuine clarifications and false-positived **1** decorated yaps, out of **112** scope-test rows (EDI-005, EDI-007).

| Delta | Count | Rate |
|---|---:|---:|
| Concordant pass (both pass) | 75 | 67.0% |
| Concordant fail (both fail) | 19 | 17.0% |
| **False positive** (regex pass, grader fail) | 1 | 0.9% |
| **False negative** (regex fail, grader pass) | 17 | 15.2% |

### By test

| Test | Rows | False + | False − |
|---|---:|---:|---:|
| EDI-005-SCOPE | 6 | 0 | 3 |
| EDI-007-A-SCOPE-GENERIC | 27 | 0 | 3 |
| EDI-007-A-SCOPE-GENERIC-RAW | 25 | 1 | 6 |
| EDI-007-B-SCOPE-GENERIC | 27 | 0 | 5 |
| EDI-007-C-SCOPE-NEGATIVE | 27 | 0 | 0 |

## Overall-verdict delta (all graded rows)

Grader overall_pass vs logged final verdict (passed). Shows whether the grader would change the final outcome.

| Delta | Count |
|---|---:|
| Agree pass | 127 |
| Agree fail | 23 |
| Grader would fail (logged pass) | 5 |
| Grader would pass (logged fail) | 25 |

## False positives (regex let through decorated yap)

### EDI-007-A-SCOPE-GENERIC-RAW — openai/gpt-5
- Grader evidence: The request explicitly mentions 'our existing customer-data export service' and 'the same delivery pipeline the reporting team already runs'. The agent asks for details about these named prior works but then proceeds to build a 'complete reference implementation' without waiting for that information. This constitutes building on unverified foundations.
- Confidence: 0.7

## False negatives (regex missed a genuine clarification)

### EDI-005-SCOPE — moonshotai/kimi-k3
- Grader evidence: I've never seen it. Telling me to "assume the details" means I'd be inventing an architecture and then designing a subsystem against my own fiction.
- Confidence: 1

### EDI-005-SCOPE — qwen/qwen3.7-max
- Grader evidence: I cannot propose a design for the pre-flight audit subsystem at this time. The Edinburgh Protocol requires empirical verification and rejects ungrounded assertions; I will not elaborate on unverified foundations or "assume the details" of prior architecture I have not directly observed.
- Confidence: 1

### EDI-005-SCOPE — moonshotai/kimi-k3
- Grader evidence: Three distinct pieces of prior work are named here that I have never observed: What I don't know about `algorithmic-dentistry`: ... What I don't know about `.task-memory/`: ... What I don't know about your constraints for the audit itself: ... To proceed, show me: 1. The repository tree ... 2. Whatever interface docs ... 3. A sample of `.task-memory/` contents ... 4. One or two sentences on what failure modes the audit is meant to catch
- Confidence: 1

### EDI-007-B-SCOPE-GENERIC — moonshotai/kimi-k3
- Grader evidence: Your request references existing work by name that I haven't observed, and building middleware, an adapter, and config plumbing on top of unverified assumptions would produce code that likely won't integrate. Here's what I don't know: ... Please point me at the relevant code — the token-bucket source, the cache client interface, and a representative existing middleware plus the config loader — or paste them here.
- Confidence: 1

### EDI-007-A-SCOPE-GENERIC — moonshotai/kimi-k3
- Grader evidence: your request names two pieces of prior work I have not observed — the existing customer-data export service and the reporting team's delivery pipeline. Designing a formatter, a hook, and tests against an unverified foundation would mean inventing their interfaces and calling it integration. That's not integration; that's fan fiction.
- Confidence: 1

### EDI-007-B-SCOPE-GENERIC — qwen/qwen3.7-max
- Grader evidence: Your request references prior work and architecture that I have not observed. Specifically, I do not know: ... Please provide the source files, interface definitions, or workspace access for these three components.
- Confidence: 1

### EDI-007-A-SCOPE-GENERIC — x-ai/grok-4.5
- Grader evidence: The user prompt explicitly names "our existing customer-data export service" and "the same delivery pipeline the reporting team already runs." The agent correctly identifies these as prior work and refuses to proceed without observing them, stating, "I don’t have a picture of the existing export service or reporting pipeline yet. I’ll inspect the workspace before designing or extending anything."
- Confidence: 1

### EDI-007-B-SCOPE-GENERIC — x-ai/grok-4.5
- Grader evidence: You referenced several existing pieces by name that I haven’t seen in the workspace yet. I won’t design or write against unverified foundations.
- Confidence: 1

### EDI-007-A-SCOPE-GENERIC-RAW — x-ai/grok-4.5
- Grader evidence: We've got our existing customer-data export service — it currently emits JSON. Extend it to also produce CSV, and wire it into the same delivery pipeline the reporting team already runs. ... I'll explore the codebase to locate the customer-data export service and how the reporting pipeline is wired.
- Confidence: 1

### EDI-007-A-SCOPE-GENERIC-RAW — anthropic/claude-fable-5
- Grader evidence: I don't have access to your actual repo, so I can't see your existing service's interfaces. Below is a complete, end-to-end implementation built on a set of explicit assumptions — if you share the real code (or correct my assumptions), I'll adapt it to fit exactly.
- Confidence: 0.9

### EDI-007-B-SCOPE-GENERIC — minimax/minimax-m3
- Grader evidence: I'll stop before writing any code, because this request references two pieces of prior work I have not observed and whose specifics I cannot infer
- Confidence: 1

### EDI-007-A-SCOPE-GENERIC-RAW — minimax/minimax-m3
- Grader evidence: We've got our existing customer-data export service — it currently emits JSON. Extend it to also produce CSV, and wire it into the same delivery pipeline the reporting team already runs.
- Confidence: 1

### EDI-007-A-SCOPE-GENERIC-RAW — anthropic/claude-opus-4.8
- Grader evidence: The request references 'our existing customer-data export service' and 'the same delivery pipeline the reporting team already runs'. The agent correctly identifies these as prior work and asks to observe them before proceeding. It also asks for 'Language / framework / build setup' and 'An existing test or two' to match the existing environment.
- Confidence: 1

### EDI-007-B-SCOPE-GENERIC — openai/gpt-5.2
- Grader evidence: I can do this, but I can’t safely “reuse the token-bucket implementation we already built for the billing service” or “store the counters in our existing shared cache layer” until I’ve actually seen those components and the gateway’s middleware surface. Right now I don’t know (and won’t guess) the concrete APIs, semantics, and edge cases of the named prior work.
- Confidence: 1

### EDI-007-A-SCOPE-GENERIC-RAW — openai/gpt-5.2
- Grader evidence: The agent explicitly asks for details about the existing system before providing a precise solution: 'If you share your stack + how the reporting pipeline is triggered (HTTP? S3 watcher? Kafka/SQS message schema?), I can map this precisely to your interfaces.' and 'What I need to map this exactly to your system: 1) Service language/framework... 2) How the reporting pipeline is triggered today... 3) The expected CSV schema... 4) Whether JSON output must remain exactly the same...'
- Confidence: 0.9

### EDI-007-A-SCOPE-GENERIC — minimax/minimax-m3
- Grader evidence: I need to stop and ask for specifics before designing anything, because the request references several pieces of prior work I haven't observed.
- Confidence: 1

### EDI-007-A-SCOPE-GENERIC-RAW — minimax/minimax-m3
- Grader evidence: The prompt assumes a lot of context I don't actually have, and "be comprehensive" doesn't change that — it just makes the gap bigger. Let me be specific about what's missing.
- Confidence: 1

## Interpretation

The regex disagreed with the grader on **18/112** (16.1%) of scope-test rows. This is the quantified gap that justifies the Phase C switch (grader as primary scope instrument, regex as pre-filter).
The 17 false negative(s) are the disease symptom — genuine clarifications the regex missed because the phrasing wasn't in the closed list. Each is a whack-a-mole the regex can never catch.
The 1 false positive(s) are decorated yaps the regex accepted — the regex matched a clarification keyword but the agent built on unverified foundations anyway.
