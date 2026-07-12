# Ornith‑1.0‑9B Model Card Summary

**Name / Identifier** | `Ornith‑1.0‑9B` (Hugging Face repo `deepreinforce‑ai/Ornith‑1.0‑9B`) |
|---|---|
**License** | MIT (globally accessible, no regional restrictions) |
**Architecture** | `qwen35` – dense 9 B‑parameter model (≈19 GB bf16, 9.53 GB Q8_0) |
**Quantisation** | Q8_0 (8‑bit) – fits comfortably on a single 80 GB GPU |
**Capabilities** | Completion, tool‑calling (OpenAI‑style `tool_calls`), chain‑of‑thought reasoning (`<think>…</think>`) |
**Context Window** | 262 144 tokens (256 K) – “large‑context” ready |
**Benchmarks (selected)** | • Terminal‑Bench 2.1 (Terminus‑2) – 43.1 % (vs 21.3 % for Qwen‑3.5‑9B) |
| • SWE‑Bench Verified – 69.4 % (vs 53.2 % for Qwen‑3.5‑9B) |
| • Claw‑Eval Avg – 63.1 % (vs 53.2 % for Qwen‑3.5‑9B) |
**Typical Use Cases** | Agentic coding, tool‑driven code generation, long‑context reasoning |
**Serving Recipes** | • **vLLM** – `vllm serve deepreinforce-ai/Ornith-1.0-9B …` (tensor‑parallel = 1 for a single GPU) |
| • **SGLang** – `python -m sglang.launch_server …` |
| • **Transformers** – `AutoModelForCausalLM.from_pretrained(..., dtype="auto", device_map="auto")` |
**Quick‑Start (Python, OpenAI‑compatible)**
```python
from openai import OpenAI
client = OpenAI(base_url="http://localhost:8000/v1", api_key="EMPTY")
resp = client.chat.completions.create(
    model="Ornith-1.0-9B",
    messages=[{"role":"user","content":"Write a one‑line Python lambda that squares a number."}],
    temperature=0.6, top_p=0.95, max_tokens=1024)
)
print(resp.choices[0].message.content)
```
**Citation**
```bibtex
@misc{ornith_9b,
    title = {{Ornith‑1.0‑9B}: Agentic Coding, Open to All},
    url = {https://deep-reinforce.com/ornith_1_0.html},
    author = {{DeepReinforce Team}},
    year = {2026}
}
```
---

# ZAi GLM Provider – Current State & Reliability (June 2026)

| Aspect | Findings |
|---|---|
| **Model Availability** | GLM‑5.2 (including the “Fast via Wafer” variant) is now listed on the **standard OpenAI‑compatible API** (`https://api.z.ai/api/paas/v4`) as of **14 Jun 2026** (see PR #727). The Coding‑Plan endpoint (`https://api.z.ai/api/coding/paas/v4`) also serves it. |
| **Pricing** | Still **unpublished** – the catalog marks `pricing_status: unknown`. No public token‑price row for GLM‑5.2 yet. |
| **Performance** | Vercel’s AI Gateway reports **2× higher throughput** for “GLM 5.2 Fast via Wafer” (≈170 tok/s small‑context, ≈200 tok/s large‑context). |
| **Feature Set** | 1 M token context window, reasoning effort levels (`off`, `low`, `high`, `max`), tool‑calling, image understanding (via `glm‑4.6v`). |
| **Known Issues (community)** | 1. **Variant exposure** – early Opencode releases only exposed `glm‑5.2` without the `high`/`max` effort toggles; users reported “model not listed” after `opencode models --refresh`. |
| 2. **Coding‑Plan vs. General API** – confusion over which base URL to use; explicit regional choices (`zai‑coding‑global`, `zai‑global`) sometimes required. |
| 3. **Tool‑call JSON quirks** – historic GLM‑5 series had parsing bugs; the Fast‑via‑Wafer build appears to have fixed them, but older `glm‑5.1` still shows occasional malformed `tool_call` payloads. |
| **Stability** | Provider’s **uptime** is reported as “green” on the Vercel AI Gateway dashboard; no major outages in the last month. The main friction is configuration drift rather than outright service failure. |
| **Alternatives** | • **OpenAI GPT‑4‑Turbo** – mature, transparent pricing, 1 M context. |
| • **Anthropic Claude 3.5‑Sonnet** – strong reasoning, tool‑calling, stable API. |
| • **Local Qwen‑3.5‑9B Q8_0** – already installed, no network latency. |
| • **Mistral‑Large‑2** – open‑source, 30 B‑dense, comparable coding performance. |

**Practical take‑away**
- For the **fastest GLM‑5.2** in heavy tool‑driven coding, point your client at `zai/glm-5.2-fast` via Vercel AI Gateway (or the standard ZAi endpoint) and enjoy ~200 tok/s throughput.
- For **steady reliability** with fewer moving parts, stick to the **standard GLM‑5.2** (`zai/glm-5.2`) and explicitly set the `reasoningEffort` (`high` or `max`).
- If you encounter the “model not listed” symptom, run `opencode models --refresh` **after** you have added the variant block to your `opencode.json` (see the ZAi docs for the snippet).
- When pricing is opaque or you prefer a guaranteed‑no‑surprise bill, fall back to OpenAI or Anthropic; they also support 1 M context and tool‑calling with well‑published rates.
