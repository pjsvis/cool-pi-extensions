// Provider abstraction — multi-provider model calls with fallback chains,
// repo-grounded tool use, and skate-based key resolution.
//
// Absorbed from src/cli/pi-eval-runner.ts (callModel, callModelWithTools,
// callOpenRouter, callZenMux, callTogether, callOllama) and the provider
// chain logic.

import { execSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { resolve, relative, isAbsolute, join, dirname } from "node:path";
import { REPO_ROOT } from "./fixtures.js";
import type { CallTelemetry } from "./types.js";

// ── Constants ───────────────────────────────────────────────────────────────

const OLLAMA_BASE = "http://localhost:11434";
// apfel — on-device Apple Intelligence via `apfel --serve` (OpenAI-compat).
// Port 11435 (ollama owns 11434). Dummy key: apfel serve is unauth by default.
// See briefs/2026-08-04-brief-apfel-apple-intelligence-candidate.md.
const APFEL_URL = "http://localhost:11435/v1/chat/completions";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const ZENMUX_URL = "https://zenmux.ai/api/v1/chat/completions";
const TOGETHER_URL = "https://api.together.xyz/v1/chat/completions";
// NVIDIA NIM — OpenAI-compatible free tier (build.nvidia.com). 40 req/min,
// 1000–5000 credits. See briefs/2026-08-01-brief-nim-provider-branch.md.
const NVIDIA_NIM_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

export const DEFAULT_TIMEOUT_MS = 180_000;

/** Liveness gap (B2): abort a streaming call if no new token arrives for this
 *  many seconds. Catches hard stalls (stuck/looping substrate) independently of
 *  wall-clock. Override via EVAL_TOKEN_GAP_SEC. Default 60s — generous enough
 *  for reasoning-model thinking pauses, tight enough that a dead substrate
 *  fails fast. (Does NOT detect yap-loops — tokens keep flowing; that needs
 *  repetition detection, a deferred refinement.) */
const TOKEN_GAP_SEC = Math.max(5, parseInt(process.env["EVAL_TOKEN_GAP_SEC"] ?? "60", 10));

/** Policy toggle (B1): when "1", hard-reject substrates that can't stream
 *  instead of falling back to bracketed wall-clock. Off by default — flag,
 *  don't reject — so the verdict is preserved with an honest confidence caveat. */
const REJECT_NO_STREAMING = process.env["EVAL_REJECT_NO_STREAMING"] === "1";

// ── Key resolution ──────────────────────────────────────────────────────────

/** Read a secret from skate (charmbracelet/skate). Returns "" if missing. */
export function skate(key: string): string {
  try {
    return execSync(`skate get ${key}`, {
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "ignore"],
      timeout: 5000,
    }).trim();
  } catch {
    return "";
  }
}

export const OPENROUTER_KEY = process.env["OPENROUTER_API_KEY"] || skate("open_api_key");
const ZENMUX_KEY = process.env["ZENMUX_API_KEY"] || skate("zenmux_api_key");
const TOGETHER_KEY = process.env["TOGETHER_API_KEY"] || skate("togetherai_api_key");
// Direct first-party keys — preferred over resellers for reliability and cost.
// Eval integrity: route via the vendor when possible so a reseller outage or
// 429 doesn't masquerade as a model failure (see the kimi-k3 OpenRouter 429
// incident that made 4/5 tests inconclusive).
const MOONSHOT_KEY = process.env["MOONSHOT_API_KEY"] || skate("moonshotai_api_key");
const QWEN_KEY = process.env["DASHSCOPE_API_KEY"] || skate("qwen_api_key");
const MOONSHOT_URL = "https://api.moonshot.ai/v1/chat/completions";
const DASHSCOPE_URL = "https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions";
const NVIDIA_KEY = process.env["NVIDIA_API_KEY"] || skate("nvidia_api_key");
// TokenRouter — OpenAI-compatible aggregator/router (one key, many models;
// free tier carries subsidy slugs like moonshotai/kimi-k3-free). Base URL +
// key from skate (env overrides). skate stores the /v1 base; the chat path is
// appended here to match the other OpenAI-compat constants (full endpoint).
const TOKENROUTER_KEY = process.env["TOKENROUTER_API_KEY"] || skate("tokenrouter_api_key");
const TOKENROUTER_BASE = (process.env["TOKENROUTER_API_URL"] || skate("tokenrouter_api_url") || "").replace(/\/+$/, "");
const TOKENROUTER_URL = TOKENROUTER_BASE + "/chat/completions";

// ── Utilities ───────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// ── Generic OpenAI-compatible chat call ─────────────────────────────────────

export interface ProviderEndpoint {
  p: string;       // provider label
  m: string;       // model slug as the provider expects it
  k: string;       // API key
  url: string;     // base URL
}

/** Result of a model call carrying the response text plus substrate telemetry
 *  and the timeout method that bounded it. Re-plumbed (brief B) so timing and
 *  liveness ride back with the text instead of being discarded. */
export interface ModelCallResult {
  text: string;
  toolCallCount?: number;
  telemetry?: import("./types.js").CallTelemetry;
  timeoutMethod: "streaming-liveness" | "wallclock-bracketed";
}

export async function callOpenAICompat(
  ep: ProviderEndpoint,
  systemPrompt: string,
  userPrompt: string,
  attempt = 0,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  retryAfterMs?: number,
): Promise<string> {
  if (!ep.k) throw new Error(`${ep.p} key not set (checked env and skate)`);

  const MAX_RETRIES = 5;
  const BASE_DELAY_MS = 2000;

  if (retryAfterMs !== undefined && retryAfterMs > 0) {
    await sleep(retryAfterMs);
  } else if (attempt > 0) {
    const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1) + Math.random() * 1000;
    await sleep(delay);
  }

  const response = await fetch(ep.url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${ep.k}` },
    body: JSON.stringify({
      model: ep.m,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0,
      // Reasoning models (e.g. kimi-k3 at max effort) burn most of a small
      // budget on the reasoning trace and return an empty visible answer.
      // 16384 gives reasoning headroom while keeping short-answer traps cheap.
      max_tokens: 16384,
      // Opt-in reasoning-effort override for always-on reasoning models.
      // kimi-k3 defaults to max effort, which on long-horizon prompts can
      // exhaust the token budget before producing a visible answer. Set
      // EVAL_REASONING_EFFORT=low|high|max to dial it down (trades fidelity
      // for a completable answer). No effect on models that ignore the field.
      ...(process.env["EVAL_REASONING_EFFORT"]
        ? { reasoning_effort: process.env["EVAL_REASONING_EFFORT"] }
        : {}),
    }),
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (response.status === 429) {
    if (attempt >= MAX_RETRIES)
      throw new Error(`${ep.p} rate limited after ${MAX_RETRIES} retries`);
    let delayMs: number | undefined;
    const retryAfter = response.headers.get("retry-after");
    if (retryAfter) {
      delayMs = parseInt(retryAfter, 10) * 1000;
    } else {
      try {
        const errBody = await response.text();
        const errJson = JSON.parse(errBody);
        if (errJson.error?.retryAfter) delayMs = errJson.error.retryAfter * 1000;
      } catch { /* ignore */ }
    }
    return callOpenAICompat(ep, systemPrompt, userPrompt, attempt + 1, timeoutMs, delayMs);
  }

  if (!response.ok) {
    let errDetail = `HTTP ${response.status}`;
    try {
      const errBody = await response.text();
      const errJson = JSON.parse(errBody);
      if (errJson.error?.message) errDetail = errJson.error.message;
    } catch { /* ignore */ }
    if (response.status >= 500 && attempt < MAX_RETRIES) {
      return callOpenAICompat(ep, systemPrompt, userPrompt, attempt + 1, timeoutMs);
    }
    throw new Error(`${ep.p} returned ${errDetail}`);
  }

  const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
  return data.choices?.[0]?.message?.content ?? "";
}

/** OpenAI-compat SSE streaming frame. `data: {json}\n` lines, terminated by
 *  `data: [DONE]`. The final frame before [DONE] carries `usage` (token counts)
 *  when `stream_options.include_usage` is honored (OpenRouter does). */
interface OpenAIStreamFrame {
  choices?: Array<{ delta?: { content?: string } }>;
  usage?: { completion_tokens?: number; prompt_tokens?: number };
}

/** Stream an OpenAI-compatible chat call (SSE) with token-gap liveness +
 *  wall-clock backstop. Captures token counts from `usage`; true decode tok/s
 *  is unavailable on this path (providers don't report eval_duration), so it's
 *  omitted rather than approximated from wall-clock. B2 primary path for every
 *  `/`-slug provider in scope (OpenRouter, ZenMux, Together, Moonshot,
 *  DashScope, NIM). */
async function streamOpenAICompat(
  ep: ProviderEndpoint,
  systemPrompt: string,
  userPrompt: string,
  wallClockMs: number,
  tokenGapMs: number,
  attempt = 0,
  retryAfterMs?: number,
): Promise<ModelCallResult> {
  const MAX_RETRIES = 5;
  const BASE_DELAY_MS = 2000;

  if (!ep.k) throw new Error(`${ep.p} key not set (checked env and skate)`);
  if (retryAfterMs !== undefined && retryAfterMs > 0) {
    await sleep(retryAfterMs);
  } else if (attempt > 0) {
    await sleep(BASE_DELAY_MS * Math.pow(2, attempt - 1) + Math.random() * 1000);
  }

  const controller = new AbortController();
  const wd = livenessWatchdog(controller, wallClockMs, tokenGapMs);
  try {
    const resp = await fetch(ep.url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${ep.k}` },
      body: JSON.stringify({
        model: ep.m,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0,
        max_tokens: 16384,
        stream: true,
        stream_options: { include_usage: true },
        ...(process.env["EVAL_REASONING_EFFORT"]
          ? { reasoning_effort: process.env["EVAL_REASONING_EFFORT"] }
          : {}),
      }),
      signal: controller.signal,
    });

    if (resp.status === 429) {
      if (attempt >= MAX_RETRIES)
        throw new Error(`${ep.p} rate limited after ${MAX_RETRIES} retries`);
      let delayMs: number | undefined;
      const retryAfter = resp.headers.get("retry-after");
      if (retryAfter) {
        delayMs = parseInt(retryAfter, 10) * 1000;
      } else {
        try {
          const errBody = await resp.text();
          const errJson = JSON.parse(errBody) as { error?: { retryAfter?: number } };
          if (errJson.error?.retryAfter) delayMs = errJson.error.retryAfter * 1000;
        } catch { /* ignore */ }
      }
      return streamOpenAICompat(ep, systemPrompt, userPrompt, wallClockMs, tokenGapMs, attempt + 1, delayMs);
    }
    if (resp.status >= 500 && attempt < MAX_RETRIES) {
      return streamOpenAICompat(ep, systemPrompt, userPrompt, wallClockMs, tokenGapMs, attempt + 1);
    }
    if (!resp.ok || !resp.body) {
      let detail = `HTTP ${resp.status}`;
      try {
        const errBody = await resp.text();
        const errJson = JSON.parse(errBody) as { error?: { message?: string } };
        if (errJson.error?.message) detail = errJson.error.message;
      } catch { /* ignore */ }
      throw new Error(`${ep.p} streaming returned ${detail}`);
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";
    let text = "";
    let telemetry: CallTelemetry | undefined;

    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      wd.feed();  // bytes flowing = alive (arms + resets the token-gap clock)
      buf += decoder.decode(value, { stream: true });
      let nl: number;
      while ((nl = buf.indexOf("\n")) >= 0) {
        const raw = buf.slice(0, nl).trim();
        buf = buf.slice(nl + 1);
        if (!raw.startsWith("data:")) continue;
        const payload = raw.slice(5).trim();
        if (payload === "[DONE]" || !payload) continue;
        let frame: OpenAIStreamFrame;
        try { frame = JSON.parse(payload) as OpenAIStreamFrame; } catch { continue; }
        const piece = frame.choices?.[0]?.delta?.content ?? "";
        if (piece) { text += piece; }
        if (frame.usage) {
          const ct = frame.usage.completion_tokens, pt = frame.usage.prompt_tokens;
          telemetry = {
            decodeTokens: typeof ct === "number" ? ct : undefined,
            promptTokens: typeof pt === "number" ? pt : undefined,
          };
        }
      }
    }
    return { text, telemetry, timeoutMethod: "streaming-liveness" };
  } catch (err) {
    if (wd.abortReason === "stall")
      throw new Error(`${ep.p} streaming stall — no token for ${tokenGapMs / 1000}s (liveness fail)`);
    if (wd.abortReason === "wallclock")
      throw new Error(`${ep.p} wall-clock backstop exceeded (${wallClockMs / 1000}s)`);
    throw err;
  } finally {
    wd.stop();
  }
}

// ── Streaming + liveness (B2) ───────────────────────────────────────────────

/** Liveness + wall-clock watchdog for a streaming call.
 *  Two independent clocks:
 *    - wall-clock backstop: measured from call start (t=0). Bounds the total
 *      call including model load + prefill. Catches silent hangs.
 *    - token-gap liveness: measured from the FIRST received byte onward
 *      (armed on first feed). Catches mid-generation stalls — a substrate
 *      that streamed then went silent. The load/prefill window before the
 *      first byte is covered by the wall-clock backstop only, so a slow cold
 *      load never false-triggers the liveness gap.
 *  Aborts `controller` on either tripping. `feed()` resets the token clock on
 *  every received chunk (bytes flowing = alive). */
function livenessWatchdog(controller: AbortController, wallClockMs: number, tokenGapMs: number) {
  const start = Date.now();
  let lastToken: number | null = null;  // null = not yet armed (no bytes received)
  let reason: "stall" | "wallclock" | null = null;
  const tickMs = Math.min(1000, Math.max(200, Math.floor(tokenGapMs / 4)));
  const tick = setInterval(() => {
    if (reason) return;
    if (Date.now() - start > wallClockMs) { reason = "wallclock"; controller.abort(); return; }
    if (lastToken !== null && Date.now() - lastToken > tokenGapMs) {
      reason = "stall";
      controller.abort();
    }
  }, tickMs);
  return {
    feed: () => { lastToken = Date.now(); },
    stop: () => clearInterval(tick),
    get abortReason() { return reason; },
  };
}

/** Ollama streaming frame — newline-delimited JSON. The final frame (done:true)
 *  carries timing telemetry in nanoseconds (eval_duration, prompt_eval_duration). */
interface OllamaStreamFrame {
  message?: { content?: string };
  done?: boolean;
  eval_count?: number;
  eval_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
}

/** Stream an Ollama /api/chat call with token-gap liveness + wall-clock backstop.
 *  Captures the final-frame telemetry (true decode tok/s, prefill ms) into the
 *  result. B2 primary path for bare-slug (local) models. */
async function streamOllamaChat(
  model: string,
  systemPrompt: string,
  userPrompt: string,
  wallClockMs: number,
  tokenGapMs: number,
  attempt = 0,
): Promise<ModelCallResult> {
  const MAX_RETRIES = 3;
  if (attempt > 0) await sleep(1000 * Math.pow(2, attempt - 1) + Math.random() * 500);

  const controller = new AbortController();
  const wd = livenessWatchdog(controller, wallClockMs, tokenGapMs);
  try {
    const resp = await fetch(`${OLLAMA_BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: true,
        options: { temperature: 0 },
      }),
      signal: controller.signal,
    });

    if (resp.status === 429 && attempt < MAX_RETRIES) {
      const ra = resp.headers.get("Retry-After");
      await sleep(ra ? parseInt(ra, 10) * 1000 : 2000);
      return streamOllamaChat(model, systemPrompt, userPrompt, wallClockMs, tokenGapMs, attempt + 1);
    }
    if (!resp.ok || !resp.body) throw new Error(`Ollama streaming returned HTTP ${resp.status}`);

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";
    let text = "";
    let telemetry: CallTelemetry | undefined;

    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      wd.feed();  // bytes flowing = alive (arms + resets the token-gap clock)
      buf += decoder.decode(value, { stream: true });
      let nl: number;
      while ((nl = buf.indexOf("\n")) >= 0) {
        const line = buf.slice(0, nl).trim();
        buf = buf.slice(nl + 1);
        if (!line) continue;
        let frame: OllamaStreamFrame;
        try { frame = JSON.parse(line) as OllamaStreamFrame; } catch { continue; }
        const piece = frame.message?.content ?? "";
        if (piece) { text += piece; }
        if (frame.done) {
          const ec = frame.eval_count, ed = frame.eval_duration;        // ns
          const pc = frame.prompt_eval_count, pd = frame.prompt_eval_duration;
          telemetry = {
            decodeTokens: typeof ec === "number" ? ec : undefined,
            promptTokens: typeof pc === "number" ? pc : undefined,
            decodeMs: typeof ed === "number" ? ed / 1e6 : undefined,
            prefillMs: typeof pd === "number" ? pd / 1e6 : undefined,
            decodeTokPerSec: typeof ed === "number" && ed > 0 && typeof ec === "number"
              ? ec / (ed / 1e9)
              : undefined,
          };
        }
      }
    }
    return { text, telemetry, timeoutMethod: "streaming-liveness" };
  } catch (err) {
    if (wd.abortReason === "stall")
      throw new Error(`Ollama streaming stall — no token for ${tokenGapMs / 1000}s (liveness fail)`);
    if (wd.abortReason === "wallclock")
      throw new Error(`Ollama wall-clock backstop exceeded (${wallClockMs / 1000}s)`);
    // Genuine network/parse error (not a watchdog abort) — bounded retry.
    if (attempt < MAX_RETRIES) {
      return streamOllamaChat(model, systemPrompt, userPrompt, wallClockMs, tokenGapMs, attempt + 1);
    }
    throw err;
  } finally {
    wd.stop();
  }
}

// ── Ollama ──────────────────────────────────────────────────────────────────

async function callOllamaWithRetry(
  model: string,
  systemPrompt: string,
  userPrompt: string,
  attempt: number,
  timeoutMs: number,
  retryAfterMs?: number,
): Promise<string> {
  const MAX_RETRIES = 3;
  const BASE_DELAY_MS = 1000;

  if (retryAfterMs !== undefined && retryAfterMs > 0) {
    await sleep(retryAfterMs);
  } else if (attempt > 0) {
    const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1) + Math.random() * 500;
    await sleep(delay);
  }

  try {
    const response = await fetch(`${OLLAMA_BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: false,
        options: { temperature: 0 },
      }),
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (response.status === 429) {
      if (attempt >= MAX_RETRIES)
        throw new Error(`Ollama rate limited after ${MAX_RETRIES} retries`);
      const retryAfter = response.headers.get("Retry-After");
      const delayMs = retryAfter ? parseInt(retryAfter, 10) * 1000 : undefined;
      return callOllamaWithRetry(model, systemPrompt, userPrompt, attempt + 1, timeoutMs, delayMs);
    }

    if (!response.ok) throw new Error(`Ollama returned HTTP ${response.status}`);

    const data = (await response.json()) as { message?: { content?: string } };
    return data.message?.content ?? "";
  } catch (err) {
    if (attempt >= MAX_RETRIES) throw err;
    return callOllamaWithRetry(model, systemPrompt, userPrompt, attempt + 1, timeoutMs);
  }
}

/** Call a local (bare-slug) Ollama model. Routes to B2 streaming-liveness when
 *  the route supports it (the norm for Ollama); falls back to the bracketed
 *  non-streaming call otherwise (B1, flagged). */
async function callOllama(
  model: string,
  systemPrompt: string,
  userPrompt: string,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<ModelCallResult> {
  const caps = routeCapabilities(model);
  if (caps.streaming) {
    return streamOllamaChat(model, systemPrompt, userPrompt, timeoutMs, TOKEN_GAP_SEC * 1000);
  }
  const text = await callOllamaWithRetry(model, systemPrompt, userPrompt, 0, timeoutMs);
  return { text, timeoutMethod: "wallclock-bracketed" };
}

// ── Model call with provider fallback chain ─────────────────────────────────

/**
 * Call a model, routing to the right provider(s) based on slug + --provider flag.
 * Builds a fallback chain: explicit provider first, then alternatives that carry
 * the model. Prevents single-provider outages from killing an eval run.
 */
/** Remap an OpenRouter-style slug to the NIM catalog convention.
 *  Per-family (not inference) — NIM diverges inconsistently:
 *  deepseek/* → deepseek-ai/*, minimax/* → minimaxai/*,
 *  z-ai/glm-5.x → z-ai/glm5.x (hyphen dropped). Others pass through. */
function nimSlug(model: string): string {
  if (model.startsWith("deepseek/")) return "deepseek-ai/" + model.slice("deepseek/".length);
  if (model.startsWith("minimax/")) return "minimaxai/" + model.slice("minimax/".length);
  if (model.startsWith("z-ai/glm-")) return "z-ai/glm" + model.slice("z-ai/glm-".length);
  return model;
}

export async function callModel(
  model: string,
  systemPrompt: string,
  userPrompt: string,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  provider = "",
): Promise<ModelCallResult> {
  const ZM = ZENMUX_KEY;
  const OR_KEY = OPENROUTER_KEY;
  const TOGETHER_K = TOGETHER_KEY;

  const chain: ProviderEndpoint[] = [];
  const bareSlug = model.includes("/") ? model.split("/").pop()! : model;

  // tokenrouter — explicit-only, exclusive routing (--provider tokenrouter).
  // A new/unvetted router is tested in isolation: one endpoint, no first-party
  // or cross-router fallback. If it fails, the eval fails loudly rather than
  // silently substituting another substrate (cf. the kimi-k3 OpenRouter 429
  // incident that masked real failures). Skips the family first-party routing
  // (kimi→moonshot-direct) that would otherwise fire first and reject the
  // tokenrouter-specific -free slug. Uses the B2 streaming path (tokenrouter
  // is OpenAI-compat SSE); tool-requiring traps still route via the OpenRouter
  // tool loop (callModelWithTools) — a known, flagged gap for this provider.
  if (provider === "tokenrouter") {
    if (!TOKENROUTER_KEY) throw new Error("tokenrouter key not set (checked env TOKENROUTER_API_KEY and skate tokenrouter_api_key)");
    if (!TOKENROUTER_BASE) throw new Error("tokenrouter base url not set (checked env TOKENROUTER_API_URL and skate tokenrouter_api_url)");
    return await streamOpenAICompat(
      { p: "tokenrouter", m: model, k: TOKENROUTER_KEY, url: TOKENROUTER_URL },
      systemPrompt, userPrompt, timeoutMs, TOKEN_GAP_SEC * 1000,
    );
  }

  // Direct first-party endpoints first — more reliable than resellers and
  // immune to reseller capacity limits. Skipped silently if no key is set.
  if (model.includes("kimi") || model.includes("moonshot")) {
    chain.push({ p: "moonshot", m: bareSlug, k: MOONSHOT_KEY, url: MOONSHOT_URL });
  }
  if (model.includes("qwen")) {
    chain.push({ p: "dashscope", m: bareSlug, k: QWEN_KEY, url: DASHSCOPE_URL });
  }
  // apfel (Apple Intelligence, on-device). Bare slug the server expects is fixed;
  // route on any apfel/apple-foundationmodel modelId. Dummy key (serve is unauth).
  if (model.includes("apfel") || model.includes("apple-foundationmodel")) {
    chain.push({
      p: "apfel",
      m: "apple-foundationmodel",
      k: process.env["APFEL_KEY"] || "apfel",
      url: APFEL_URL,
    });
  }

  if (provider === "together") {
    chain.push({ p: "together", m: model, k: TOGETHER_K, url: TOGETHER_URL });
  }
  if (provider === "zenmux") {
    chain.push({ p: "zenmux", m: model, k: ZM, url: ZENMUX_URL });
  }
  if (provider === "nim") {
    chain.push({ p: "nim", m: nimSlug(model), k: NVIDIA_KEY, url: NVIDIA_NIM_URL });
  }
  // When provider === "nim", NIM is exclusive — no cross-provider fallback.
  // NIM uses remapped slugs (nimSlug) that don't resolve on OpenRouter/ZenMux,
  // so fallback would fail with a misleading "model not valid" error. If NIM
  // fails, the combo fails — resumable on the next run. (brief 2026-08-01)
  if (provider !== "nim" && model.includes("/")) {
    chain.push({ p: "openrouter", m: model, k: OR_KEY, url: OPENROUTER_URL });
  }
  // Cross-provider fallbacks for known model families
  if (provider !== "nim" && provider !== "zenmux" && model.includes("/")) {
    chain.push({ p: "zenmux", m: model, k: ZM, url: ZENMUX_URL });
  }
  if (provider !== "" && provider !== "together" && provider !== "nim" && model.includes("/")) {
    if (!chain.some((c) => c.p === "openrouter")) {
      chain.push({ p: "openrouter", m: model, k: OR_KEY, url: OPENROUTER_URL });
    }
  }
  if (provider !== "nim" && !chain.some((c) => c.p === "together") &&
      (model.includes("deepseek") || model.includes("qwen") || model.includes("kimi"))) {
    const togetherSlug = model.includes("deepseek")
      ? "deepseek-ai/" + model.split("/").pop()
      : model.includes("qwen")
        ? "Qwen/" + model.split("/").pop()
        : model;
    chain.push({ p: "together", m: togetherSlug, k: TOGETHER_K, url: TOGETHER_URL });
  }

  // Deduplicate by provider
  const seen = new Set<string>();
  const deduped = chain.filter((c) => {
    if (seen.has(c.p)) return false;
    seen.add(c.p);
    return true;
  });

  let lastErr = "";
  const tokenGapMs = TOKEN_GAP_SEC * 1000;
  const caps = routeCapabilities(model);

  // B1 admission gate: hard-reject non-streaming substrates when configured.
  // Off by default — flag, don't reject — so the verdict survives with a
  // confidence caveat rather than losing coverage.
  if (!caps.streaming && REJECT_NO_STREAMING) {
    throw new Error(
      `${model}: streaming unavailable and EVAL_REJECT_NO_STREAMING=1 — admission rejected`,
    );
  }

  if (caps.streaming) {
    // B2: stream each endpoint in the chain until one succeeds.
    for (const ep of deduped) {
      if (!ep.k) continue;
      try {
        return await streamOpenAICompat(ep, systemPrompt, userPrompt, timeoutMs, tokenGapMs);
      } catch (err) {
        lastErr = err instanceof Error ? err.message : String(err);
        continue;
      }
    }
    // No remote endpoint carried the slug / all failed → local Ollama streams.
    if (!model.includes("/")) {
      return callOllama(model, systemPrompt, userPrompt, timeoutMs);
    }
    throw new Error(lastErr || `All providers failed for ${model}`);
  }

  // B1 fallback (!streaming): non-streaming primitives, flagged.
  for (const ep of deduped) {
    if (!ep.k) continue;
    try {
      const text = await callOpenAICompat(ep, systemPrompt, userPrompt, 0, timeoutMs);
      return { text, timeoutMethod: "wallclock-bracketed" };
    } catch (err) {
      lastErr = err instanceof Error ? err.message : String(err);
      continue;
    }
  }
  if (!model.includes("/")) {
    return callOllama(model, systemPrompt, userPrompt, timeoutMs);
  }
  throw new Error(lastErr || `All providers failed for ${model}`);
}

// ── Repo-grounded tool use (for strong-version / grounding tests) ───────────

const MAX_TOOL_RESULT_CHARS = 4000;

function confinePath(pathArg: string): string | null {
  const target = resolve(REPO_ROOT, pathArg);
  const rel = relative(REPO_ROOT, target);
  if (rel.startsWith("..") || isAbsolute(rel)) return null;
  return target;
}

function toolReadFile(pathArg: string): string {
  const target = confinePath(pathArg);
  if (!target) return `ERROR: path '${pathArg}' is outside the repository.`;
  if (!existsSync(target) || !statSync(target).isFile()) return `ERROR: not a file: ${pathArg}`;
  const content = readFileSync(target, "utf-8");
  return content.length > MAX_TOOL_RESULT_CHARS
    ? content.slice(0, MAX_TOOL_RESULT_CHARS) + `\n...[truncated, ${content.length} chars total]`
    : content;
}

function toolListDirectory(pathArg: string): string {
  const target = confinePath(pathArg) ?? REPO_ROOT;
  if (!existsSync(target) || !statSync(target).isDirectory()) return `ERROR: not a directory: ${pathArg}`;
  const entries = readdirSync(target, { withFileTypes: true })
    .filter((e) => e.name !== "node_modules" && e.name !== ".git")
    .map((e) => (e.isDirectory() ? `${e.name}/` : e.name))
    .sort();
  return entries.join("\n") || "(empty)";
}

function toolGrep(patternArg: string): string {
  const re = new RegExp(patternArg.replace(/^\(\?i\)/, ""), "i");
  const matches: string[] = [];
  function walk(dir: string) {
    if (matches.length >= 20) return;
    let entries;
    try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      if (matches.length >= 20) return;
      if (e.name === "node_modules" || e.name === ".git") continue;
      const full = join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else if (e.isFile() && /\.(md|ts|js|json|sh|txt)$/.test(e.name)) {
        try {
          const lines = readFileSync(full, "utf-8").split("\n");
          for (let i = 0; i < lines.length; i++) {
            if (re.test(lines[i])) {
              matches.push(`${relative(REPO_ROOT, full)}:${i + 1}: ${lines[i].trim().slice(0, 200)}`);
              if (matches.length >= 20) return;
            }
          }
        } catch { /* skip unreadable */ }
      }
    }
  }
  walk(REPO_ROOT);
  return matches.length ? matches.join("\n") : "(no matches)";
}

function executeToolCall(name: string, argsJson: string): string {
  let args: Record<string, string> = {};
  try { args = JSON.parse(argsJson || "{}"); } catch { /* empty args */ }
  switch (name) {
    case "read_file": return toolReadFile(args.path ?? "");
    case "list_directory": return toolListDirectory(args.path ?? "");
    case "grep": return toolGrep(args.pattern ?? "");
    default: return `ERROR: unknown tool '${name}'`;
  }
}

const TOOL_SPECS = [
  { type: "function", function: { name: "read_file", description: "Read a file in the repository.", parameters: { type: "object", properties: { path: { type: "string", description: "Path relative to repo root." } }, required: ["path"] } } },
  { type: "function", function: { name: "list_directory", description: "List entries in a directory.", parameters: { type: "object", properties: { path: { type: "string", description: "Path relative to repo root; defaults to root." } }, required: [] } } },
  { type: "function", function: { name: "grep", description: "Search file contents for a pattern (case-insensitive).", parameters: { type: "object", properties: { pattern: { type: "string" } }, required: ["pattern"] } } },
];

/** Agentic tool-use loop over OpenRouter. Returns final text + tool-call count. */
async function callOpenRouterWithTools(
  model: string,
  systemPrompt: string,
  userPrompt: string,
  toolNames: string[],
  maxIter = 8,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<{ text: string; toolCallCount: number }> {
  const enabledTools = TOOL_SPECS.filter((t) => toolNames.includes(t.function.name));
  const messages: Array<Record<string, unknown>> = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];
  let toolCallCount = 0;
  let lastText = "";

  for (let iter = 0; iter < maxIter; iter++) {
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENROUTER_KEY}` },
      // Match the text path's 16384 (see callOpenAICompat note): reasoning
      // models burn a small budget on the thinking trace and return an empty
      // visible answer — nemotron-3.5-lightning starved at 2048 on EDI-002
      // (tool logic correct, 0 visible chars, graded fail). Reasoning + tool
      // calls need more headroom than plain text.
      body: JSON.stringify({ model, messages, tools: enabledTools, tool_choice: "auto", temperature: 0, max_tokens: 16384 }),
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (!response.ok) {
      let detail = `HTTP ${response.status}`;
      try {
        const b = await response.json() as { error?: { message?: string } };
        if (b.error?.message) detail = b.error.message;
      } catch { /* */ }
      throw new Error(`OpenRouter (tools) returned ${detail}`);
    }

    const data = await response.json() as {
      choices?: Array<{
        message?: {
          content?: string | null;
          tool_calls?: Array<{ id: string; function: { name: string; arguments: string } }>;
        }
      }>
    };
    const msg = data.choices?.[0]?.message;
    if (!msg) throw new Error("OpenRouter (tools) returned no message");

    if (msg.tool_calls && msg.tool_calls.length > 0) {
      messages.push({ role: "assistant", content: msg.content ?? "", tool_calls: msg.tool_calls });
      for (const tc of msg.tool_calls) {
        toolCallCount++;
        const result = executeToolCall(tc.function.name, tc.function.arguments);
        messages.push({ role: "tool", tool_call_id: tc.id, name: tc.function.name, content: result });
      }
      if (msg.content) lastText = msg.content;
      continue;
    }

    lastText = msg.content ?? "";
    break;
  }

  return { text: lastText, toolCallCount };
}

/** Route capability surface for a model slug.
 *  `tools` — exercisable only via the OpenRouter tool loop, which requires a
 *  provider `/`-slug; bare slugs (Ollama) fall back to text-only. Eval traps
 *  that require tools are n/a on routes that can't exercise them (run.ts +
 *  assertions.ts).
 *  `streaming` — the B2-vs-B1 selector. Every provider in scope (OpenAI-compat
 *  `/`-slugs + bare Ollama) streams; a future non-streaming provider declares
 *  false here to take the B1 bracketed-wall-clock fallback. */
export function routeCapabilities(model: string): { tools: boolean; streaming: boolean } {
  return { tools: model.includes("/"), streaming: true };
}

/** Call a model with repo-grounded tools (OpenRouter; Ollama falls back to text-only). */
export async function callModelWithTools(
  model: string,
  systemPrompt: string,
  userPrompt: string,
  toolNames: string[],
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<ModelCallResult> {
  if (model.includes("/")) {
    // OpenRouter tool loop — multi-turn, wall-clock bounded per iteration
    // (B1-class; streaming the tool loop is a deferred refinement). Honest
    // flag: stall-vs-slow discrimination is degraded on this path.
    const r = await callOpenRouterWithTools(model, systemPrompt, userPrompt, toolNames, 8, timeoutMs);
    return { text: r.text, toolCallCount: r.toolCallCount, timeoutMethod: "wallclock-bracketed" };
  }
  // Bare slug → Ollama streaming-liveness (B2), text-only (tools n/a here).
  return callOllama(model, systemPrompt, userPrompt, timeoutMs);
}

// ── Model discovery (Ollama) ────────────────────────────────────────────────

/** List available Ollama models. Returns [] if Ollama isn't running. */
export async function listOllamaModels(): Promise<string[]> {
  try {
    const resp = await fetch(`${OLLAMA_BASE}/api/tags`);
    const data = (await resp.json()) as { models?: Array<{ name: string }> };
    return (data.models ?? []).map((m) => m.name);
  } catch {
    return [];
  }
}

// ── Default excludes (muppet-substrates) ────────────────────────────────────

export const DEFAULT_EXCLUDE_LIST = [
  "qwen2.5:3b",                      // deprecated, slow
  "phi3:3.8b",                       // extremely slow (~4min per test)
  "nvidia/nemotron-3-ultra-550b-a55b:free",  // ~50s avg, often times out
  "nvidia/nemotron-3-super-120b-a12b:free",  // ~130s for 4 tests, timeouts on hard problems
];
