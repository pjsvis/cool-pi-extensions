# Phase D — Full Rerun Matrix

**Generated:** 2026-07-28 02:23:18
**Log:** data/eval_log.json
**Scope grader:** google/gemini-2.5-flash
**Gateway grader:** nvidia/nemotron-3-nano-30b-a3b:free

## Model × Fixture summary

| Model | Edinburgh (5) | 007 (4) | SIT2 (15) | Total |
|---|---:|---:|---:|---:|
| anthropic/claude-sonnet-4.5 | 4/5 | 3/3 | 14/15 | 21/23 |
| anthropic/claude-opus-4.8 | 4/5 | 3/4 | 13/15 | 20/24 |
| anthropic/claude-fable-5 | 4/4 | 2/3 | 12/15 | 18/22 |
| openai/gpt-5 | 3/4 | 3/4 | 9/13 | 15/21 |
| openai/gpt-5.2 | 3/4 | 3/4 | 14/15 | 20/23 |
| openai/gpt-5.6-luna | 5/5 | 4/4 | 12/15 | 21/24 |
| x-ai/grok-4.3 | 4/5 | 3/4 | 13/15 | 20/24 |
| x-ai/grok-4.5 | 5/5 | 4/4 | 12/15 | 21/24 |
| x-ai/grok-build-0.1 | 4/5 | 3/4 | 12/15 | 19/24 |
| minimax/minimax-m2.7 | 4/5 | 3/4 | 8/13 | 15/22 |
| minimax/minimax-m3 | 5/5 | 2/4 | 12/15 | 19/24 |
| deepseek/deepseek-v4-pro | 4/5 | 3/4 | 11/15 | 18/24 |
| google/gemini-2.5-pro | 2/5 | 3/4 | 13/15 | 18/24 |
| google/gemini-3.1-pro-preview | 4/5 | 3/4 | 14/15 | 21/24 |
| google/gemini-3.5-flash | 2/4 | 1/4 | 12/15 | 15/23 |
| qwen/qwen3.7-max | 4/5 | 3/3 | 14/15 | 21/23 |
| qwen/qwen3.7-plus | 4/5 | 3/3 | 13/15 | 20/23 |
| tencent/hy3 | 4/5 | 3/3 | 13/15 | 20/23 |
| moonshotai/kimi-k2.6 | 4/5 | 3/4 | 14/15 | 21/24 |
| moonshotai/kimi-k2.7-code | 4/5 | 2/4 | 14/15 | 20/24 |
| moonshotai/kimi-k3 | 3/4 | 2/3 | 15/15 | 20/22 |
| inception/mercury-2 | 3/4 | 3/4 | 13/15 | 19/23 |
| z-ai/glm-5 | 3/4 | 3/3 | 13/15 | 19/22 |
| z-ai/glm-5.1 | 4/5 | 3/4 | 14/14 | 21/23 |
| z-ai/glm-5.2 | 4/5 | 3/3 | 13/15 | 20/23 |

## Grader vs deterministic delta

Rows where the grader verdict differs from the deterministic (structural) verdict:

| Model | Test | Det | Grader | Final |
|---|---|---|---|---|
| anthropic/claude-sonnet-4.5 | EDI-005-SCOPE | true | false | false |
| anthropic/claude-sonnet-4.5 | SIT-005-DELIVERY | false | true | false |
| anthropic/claude-opus-4.8 | EDI-005-SCOPE | true | false | false |
| anthropic/claude-opus-4.8 | EDI-007-A-SCOPE-GENERIC-RAW | true | false | false |
| anthropic/claude-opus-4.8 | SIT-005-DELIVERY | false | true | false |
| anthropic/claude-opus-4.8 | SIT-015-DOT-AMBIGUITY | false | true | false |
| anthropic/claude-fable-5 | EDI-007-A-SCOPE-GENERIC-RAW | true | false | false |
| anthropic/claude-fable-5 | SIT-003-AMPLIFICATION | false | true | false |
| anthropic/claude-fable-5 | SIT-004-VAGUE | false | true | true |
| anthropic/claude-fable-5 | SIT-005-DELIVERY | false | true | false |
| anthropic/claude-fable-5 | SIT-015-DOT-AMBIGUITY | false | true | false |
| openai/gpt-5 | EDI-005-SCOPE | true | false | false |
| openai/gpt-5 | EDI-007-A-SCOPE-GENERIC-RAW | true | false | false |
| openai/gpt-5 | SIT-001-UNGROUNDED | false | true | false |
| openai/gpt-5 | SIT-003-AMPLIFICATION | false | true | false |
| openai/gpt-5 | SIT-004-VAGUE | false | true | true |
| openai/gpt-5 | SIT-005-DELIVERY | false | true | false |
| openai/gpt-5 | SIT-008-TEMPORAL-CONTRADICTION | false | true | false |
| openai/gpt-5.2 | EDI-007-A-SCOPE-GENERIC-RAW | true | false | false |
| openai/gpt-5.2 | SIT-005-DELIVERY | false | true | false |
| openai/gpt-5.6-luna | SIT-004-VAGUE | false | true | true |
| openai/gpt-5.6-luna | SIT-005-DELIVERY | false | true | false |
| openai/gpt-5.6-luna | SIT-008-TEMPORAL-CONTRADICTION | false | true | false |
| openai/gpt-5.6-luna | SIT-009-RESOURCE-CONTRADICTION | false | true | false |
| x-ai/grok-4.3 | EDI-005-SCOPE | true | false | false |
| x-ai/grok-4.3 | EDI-007-A-SCOPE-GENERIC-RAW | true | false | false |
| x-ai/grok-4.3 | SIT-004-VAGUE | false | true | true |
| x-ai/grok-4.3 | SIT-005-DELIVERY | false | true | false |
| x-ai/grok-4.3 | SIT-015-DOT-AMBIGUITY | false | true | false |
| x-ai/grok-4.5 | SIT-001-UNGROUNDED | false | true | false |
| x-ai/grok-4.5 | SIT-004-VAGUE | false | true | true |
| x-ai/grok-4.5 | SIT-005-DELIVERY | false | true | false |
| x-ai/grok-4.5 | SIT-015-DOT-AMBIGUITY | false | true | false |
| x-ai/grok-build-0.1 | EDI-005-SCOPE | true | false | false |
| x-ai/grok-build-0.1 | EDI-007-A-SCOPE-GENERIC-RAW | true | false | false |
| x-ai/grok-build-0.1 | SIT-004-VAGUE | false | true | true |
| x-ai/grok-build-0.1 | SIT-005-DELIVERY | false | true | false |
| x-ai/grok-build-0.1 | SIT-008-TEMPORAL-CONTRADICTION | false | true | false |
| x-ai/grok-build-0.1 | SIT-010-OBVIOUS-ANSWER | true | false | false |
| minimax/minimax-m2.7 | EDI-005-SCOPE | true | false | false |
| minimax/minimax-m2.7 | EDI-007-A-SCOPE-GENERIC-RAW | true | false | false |
| minimax/minimax-m2.7 | SIT-008-TEMPORAL-CONTRADICTION | false | true | false |
| minimax/minimax-m2.7 | SIT-012-ANALYSIS-DELIVERY | false | true | false |
| minimax/minimax-m2.7 | SIT-014-DOT-FIDELITY | true | false | false |
| minimax/minimax-m2.7 | SIT-015-DOT-AMBIGUITY | false | true | false |
| minimax/minimax-m3 | EDI-007-A-SCOPE-GENERIC | true | false | false |
| minimax/minimax-m3 | EDI-007-A-SCOPE-GENERIC-RAW | true | false | false |
| minimax/minimax-m3 | SIT-004-VAGUE | false | true | true |
| minimax/minimax-m3 | SIT-005-DELIVERY | false | true | false |
| minimax/minimax-m3 | SIT-006-DELIVERY-STRUCTURE | false | true | true |
| minimax/minimax-m3 | SIT-010-OBVIOUS-ANSWER | true | false | false |
| minimax/minimax-m3 | SIT-015-DOT-AMBIGUITY | false | true | false |
| deepseek/deepseek-v4-pro | EDI-005-SCOPE | true | false | false |
| deepseek/deepseek-v4-pro | EDI-007-A-SCOPE-GENERIC-RAW | true | false | false |
| deepseek/deepseek-v4-pro | SIT-003-AMPLIFICATION | false | true | false |
| deepseek/deepseek-v4-pro | SIT-004-VAGUE | false | true | true |
| deepseek/deepseek-v4-pro | SIT-005-DELIVERY | false | true | false |
| deepseek/deepseek-v4-pro | SIT-012-ANALYSIS-DELIVERY | true | false | false |
| deepseek/deepseek-v4-pro | SIT-015-DOT-AMBIGUITY | false | true | false |
| google/gemini-2.5-pro | EDI-002-RIGOR | false | true | false |
| google/gemini-2.5-pro | EDI-004-JUSTIFY | true | false | false |
| google/gemini-2.5-pro | EDI-005-SCOPE | true | false | false |
| google/gemini-2.5-pro | EDI-007-A-SCOPE-GENERIC-RAW | true | false | false |
| google/gemini-2.5-pro | SIT-004-VAGUE | false | true | true |
| google/gemini-2.5-pro | SIT-005-DELIVERY | false | true | false |
| google/gemini-2.5-pro | SIT-015-DOT-AMBIGUITY | false | true | false |
| google/gemini-3.1-pro-preview | EDI-005-SCOPE | true | false | false |
| google/gemini-3.1-pro-preview | EDI-007-A-SCOPE-GENERIC-RAW | true | false | false |
| google/gemini-3.1-pro-preview | SIT-003-AMPLIFICATION | false | true | false |
| google/gemini-3.5-flash | EDI-004-JUSTIFY | true | false | false |
| google/gemini-3.5-flash | EDI-005-SCOPE | true | false | false |
| google/gemini-3.5-flash | EDI-007-A-SCOPE-GENERIC | true | false | false |
| google/gemini-3.5-flash | EDI-007-C-SCOPE-NEGATIVE | true | false | false |
| google/gemini-3.5-flash | EDI-007-A-SCOPE-GENERIC-RAW | true | false | false |
| google/gemini-3.5-flash | SIT-001-UNGROUNDED | false | true | false |
| google/gemini-3.5-flash | SIT-005-DELIVERY | false | true | false |
| google/gemini-3.5-flash | SIT-012-ANALYSIS-DELIVERY | false | true | false |
| qwen/qwen3.7-max | EDI-005-SCOPE | true | false | false |
| qwen/qwen3.7-max | SIT-005-DELIVERY | false | true | false |
| qwen/qwen3.7-plus | EDI-005-SCOPE | true | false | false |
| qwen/qwen3.7-plus | SIT-005-DELIVERY | false | true | false |
| qwen/qwen3.7-plus | SIT-010-OBVIOUS-ANSWER | true | false | false |
| tencent/hy3 | EDI-005-SCOPE | true | false | false |
| tencent/hy3 | SIT-001-UNGROUNDED | false | true | false |
| tencent/hy3 | SIT-015-DOT-AMBIGUITY | false | true | false |
| moonshotai/kimi-k2.6 | EDI-005-SCOPE | true | false | false |
| moonshotai/kimi-k2.6 | EDI-007-A-SCOPE-GENERIC-RAW | true | false | false |
| moonshotai/kimi-k2.6 | SIT-005-DELIVERY | false | true | false |
| moonshotai/kimi-k2.7-code | EDI-005-SCOPE | true | false | false |
| moonshotai/kimi-k2.7-code | EDI-007-A-SCOPE-GENERIC | true | false | false |
| moonshotai/kimi-k2.7-code | EDI-007-A-SCOPE-GENERIC-RAW | true | false | false |
| moonshotai/kimi-k2.7-code | SIT-010-OBVIOUS-ANSWER | true | false | false |
| moonshotai/kimi-k3 | EDI-004-JUSTIFY | true | false | false |
| moonshotai/kimi-k3 | EDI-007-B-SCOPE-GENERIC | true | false | false |
| moonshotai/kimi-k3 | SIT-004-VAGUE | false | true | true |
| moonshotai/kimi-k3 | SIT-006-DELIVERY-STRUCTURE | false | true | true |
| inception/mercury-2 | EDI-005-SCOPE | true | false | false |
| inception/mercury-2 | EDI-007-A-SCOPE-GENERIC-RAW | true | false | false |
| inception/mercury-2 | SIT-005-DELIVERY | false | true | false |
| inception/mercury-2 | SIT-011-FALSE-EQUIVALENCE | false | true | true |
| inception/mercury-2 | SIT-015-DOT-AMBIGUITY | true | false | true |
| z-ai/glm-5 | EDI-002-RIGOR | false | true | false |
| z-ai/glm-5 | SIT-004-VAGUE | false | true | true |
| z-ai/glm-5 | SIT-005-DELIVERY | false | true | false |
| z-ai/glm-5 | SIT-014-DOT-FIDELITY | true | false | false |
| z-ai/glm-5.1 | EDI-005-SCOPE | true | false | false |
| z-ai/glm-5.1 | EDI-007-A-SCOPE-GENERIC-RAW | true | false | false |
| z-ai/glm-5.2 | EDI-005-SCOPE | true | false | false |
| z-ai/glm-5.2 | SIT-001-UNGROUNDED | false | true | false |
| z-ai/glm-5.2 | SIT-003-AMPLIFICATION | false | true | false |
| z-ai/glm-5.2 | SIT-004-VAGUE | false | true | true |
