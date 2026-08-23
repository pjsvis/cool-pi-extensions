# Gap Six — Eval Matrix

**Generated:** 2026-08-01 09:59:28
**Source:** July-3 audit roster (5 of the six) + DeepSeek R1 (audit roster, reasoning-model test).
**Note:** gemini-3.1-pro-preview (the 6th of the original six) was already covered in Phase D — not re-run.
**Log:** data/eval_log.json (appended)   **Graders:** scope=google/gemini-2.5-flash, gateway=nvidia/nemotron-3-nano-30b-a3b:free

## Model × Fixture summary

| Model | Edinburgh (5) | 007 (4) | SIT2 (15) | Total |
|---|---:|---:|---:|---:|
| anthropic/claude-opus-4.1 | 3/4 | 3/3 | 14/15 | 20/22 |
| anthropic/claude-haiku-4.5 | 2/5 | 3/4 | 13/15 | 18/24 |
| openai/gpt-4o | 4/5 | 2/4 | 14/15 | 20/24 |
| x-ai/grok-4.20 | 3/4 | 3/4 | 15/15 | 21/23 |
| meta-llama/llama-3.3-70b-instruct | 2/5 | 2/4 | 15/15 | 19/24 |
| deepseek/deepseek-r1 | 4/5 | 2/3 | 15/15 | 21/23 |

## Grader vs deterministic delta (gap six only)

| Model | Test | Det | Grader | Final |
|---|---|---|---|---|
| anthropic/claude-opus-4.1 | EDI-005-SCOPE | true | false | false |
| anthropic/claude-opus-4.1 | EDI-007-B-SCOPE-GENERIC | true | false | false |
| anthropic/claude-opus-4.1 | SIT-015-DOT-AMBIGUITY | false | true | false |
| anthropic/claude-haiku-4.5 | EDI-004-JUSTIFY | true | false | false |
| anthropic/claude-haiku-4.5 | EDI-005-SCOPE | true | false | false |
| anthropic/claude-haiku-4.5 | EDI-007-A-SCOPE-GENERIC-RAW | true | false | false |
| anthropic/claude-haiku-4.5 | SIT-014-DOT-FIDELITY | false | true | false |
| anthropic/claude-haiku-4.5 | SIT-015-DOT-AMBIGUITY | false | true | false |
| openai/gpt-4o | EDI-005-SCOPE | true | false | false |
| openai/gpt-4o | EDI-007-B-SCOPE-GENERIC | true | false | false |
| openai/gpt-4o | EDI-007-A-SCOPE-GENERIC-RAW | true | false | false |
| openai/gpt-4o | SIT-005-DELIVERY | true | false | true |
| openai/gpt-4o | SIT-006-DELIVERY-STRUCTURE | true | false | true |
| openai/gpt-4o | SIT-010-OBVIOUS-ANSWER | true | false | true |
| openai/gpt-4o | SIT-014-DOT-FIDELITY | true | false | true |
| openai/gpt-4o | SIT-015-DOT-AMBIGUITY | false | true | false |
| x-ai/grok-4.20 | EDI-005-SCOPE | true | false | false |
| x-ai/grok-4.20 | EDI-007-A-SCOPE-GENERIC-RAW | true | false | false |
| x-ai/grok-4.20 | SIT-015-DOT-AMBIGUITY | true | false | true |
| meta-llama/llama-3.3-70b-instruct | EDI-002-RIGOR | false | true | false |
| meta-llama/llama-3.3-70b-instruct | EDI-004-JUSTIFY | true | false | false |
| meta-llama/llama-3.3-70b-instruct | EDI-005-SCOPE | true | false | false |
| meta-llama/llama-3.3-70b-instruct | EDI-007-A-SCOPE-GENERIC | true | false | false |
| meta-llama/llama-3.3-70b-instruct | EDI-007-A-SCOPE-GENERIC-RAW | true | false | false |
| meta-llama/llama-3.3-70b-instruct | SIT-005-DELIVERY | true | false | true |
| meta-llama/llama-3.3-70b-instruct | SIT-006-DELIVERY-STRUCTURE | true | false | true |
| deepseek/deepseek-r1 | EDI-005-SCOPE | true | false | false |
| deepseek/deepseek-r1 | EDI-007-A-SCOPE-GENERIC | true | false | false |
| x-ai/grok-4.20 | EDI-005-SCOPE | true | false | false |
| deepseek/deepseek-r1 | EDI-007-A-SCOPE-GENERIC-RAW | true | false | false |
