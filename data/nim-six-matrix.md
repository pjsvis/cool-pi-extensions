# NIM Six — Eval Matrix

**Generated:** 2026-08-01 21:56:52
**Source:** briefs/2026-08-01-brief-nim-provider-branch.md (td-4b22e6)
**Provider:** NVIDIA NIM free tier (exclusive — no cross-provider fallback)
**Three new:** gpt-oss-120b, kimi-k2-instruct, sarvam-m  |  **Three re-test:** glm-5.1, minimax-m2.7, v4-flash
**Log:** data/eval_log.json   **Graders:** scope=google/gemini-2.5-flash, gateway=nvidia/nemotron-3-nano-30b-a3b:free

## Model × Fixture summary

| Model | Edinburgh (5) | 007 (4) | SIT2 (15) | Total | Role |
|---|---:|---:|---:|---:|---|
| openai/gpt-oss-120b | 3/3 | 3/4 | 4/5 | 10/12 | new — muppet-thesis headline |
| moonshotai/kimi-k2-instruct | 0/0 | 0/0 | 0/0 | 0/0 | new — corpus gap |
| sarvamai/sarvam-m | 0/0 | 0/0 | 0/0 | 0/0 | new — out-of-domain specialist |
| z-ai/glm-5.1 | 4/5 | 3/4 | 14/14 | 21/23 | re-test — provider independence |
| minimax/minimax-m2.7 | 4/5 | 3/4 | 8/13 | 15/22 | re-test — provider independence |
| deepseek/deepseek-v4-flash | 4/5 | 3/3 | 14/15 | 21/23 | re-test — provider independence |

## Provider-independence delta (re-tests vs original host)

| Model | NIM total | Original host total | Δ |
|---|---:|---:|---|
| _filled by hand from phase-d-matrix / gap-six-matrix_ | | | |
