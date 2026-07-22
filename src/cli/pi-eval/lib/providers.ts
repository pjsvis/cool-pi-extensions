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

// ── Constants ───────────────────────────────────────────────────────────────

const OLLAMA_BASE = "http://localhost:11434";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const ZENMUX_URL = "https://zenmux.ai/api/v1/chat/completions";
const TOGETHER_URL = "https://api.together.xyz/v1/chat/completions";

export const DEFAULT_TIMEOUT_MS = 60_000;

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
      max_tokens: 2048,
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

async function callOllama(
  model: string,
  systemPrompt: string,
  userPrompt: string,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<string> {
  return callOllamaWithRetry(model, systemPrompt, userPrompt, 0, timeoutMs);
}

// ── Model call with provider fallback chain ─────────────────────────────────

/**
 * Call a model, routing to the right provider(s) based on slug + --provider flag.
 * Builds a fallback chain: explicit provider first, then alternatives that carry
 * the model. Prevents single-provider outages from killing an eval run.
 */
export async function callModel(
  model: string,
  systemPrompt: string,
  userPrompt: string,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  provider = "",
): Promise<string> {
  const ZM = ZENMUX_KEY;
  const OR_KEY = OPENROUTER_KEY;
  const TOGETHER_K = TOGETHER_KEY;

  const chain: ProviderEndpoint[] = [];

  if (provider === "together") {
    chain.push({ p: "together", m: model, k: TOGETHER_K, url: TOGETHER_URL });
  }
  if (provider === "zenmux") {
    chain.push({ p: "zenmux", m: model, k: ZM, url: ZENMUX_URL });
  }
  if (model.includes("/")) {
    chain.push({ p: "openrouter", m: model, k: OR_KEY, url: OPENROUTER_URL });
  }
  // Cross-provider fallbacks for known model families
  if (provider !== "zenmux" && model.includes("/")) {
    chain.push({ p: "zenmux", m: model, k: ZM, url: ZENMUX_URL });
  }
  if (provider !== "" && provider !== "together" && model.includes("/")) {
    if (!chain.some((c) => c.p === "openrouter")) {
      chain.push({ p: "openrouter", m: model, k: OR_KEY, url: OPENROUTER_URL });
    }
  }
  if (!chain.some((c) => c.p === "together") &&
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
  for (const ep of deduped) {
    if (!ep.k) continue;
    try {
      return await callOpenAICompat(ep, systemPrompt, userPrompt, 0, timeoutMs);
    } catch (err) {
      lastErr = err instanceof Error ? err.message : String(err);
      continue;
    }
  }

  // No fallbacks / all failed — fall through to Ollama for local models
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
      body: JSON.stringify({ model, messages, tools: enabledTools, tool_choice: "auto", temperature: 0, max_tokens: 2048 }),
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

/** Call a model with repo-grounded tools (OpenRouter; Ollama falls back to text-only). */
export async function callModelWithTools(
  model: string,
  systemPrompt: string,
  userPrompt: string,
  toolNames: string[],
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<{ text: string; toolCallCount: number }> {
  if (model.includes("/")) {
    return callOpenRouterWithTools(model, systemPrompt, userPrompt, toolNames, 8, timeoutMs);
  }
  const text = await callOllama(model, systemPrompt, userPrompt, timeoutMs);
  return { text, toolCallCount: 0 };
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
