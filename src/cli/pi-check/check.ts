#!/usr/bin/env bun
/**
 * pi-check — connectivity checker for Pi Coding Agent model providers.
 *
 * Reads ~/.pi/agent/models.json, resolves API keys, and probes each
 * provider's /models endpoint. Reports pass/fail with diagnostic detail.
 *
 * Usage:
 *   pi-check                     # check all providers
 *   pi-check ollama              # check a specific provider
 *   pi-check --json              # machine-readable output
 *   pi-check --zenmux-mgmt       # include ZenMux management metrics
 *   pi-check --config ./custom.json
 */

import { defineCommand, runMain } from "citty";
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { homedir } from "node:os";
import { resolve } from "node:path";

// ── Types ───────────────────────────────────────────────────────────────────

interface ModelEntry {
  id: string;
  name?: string;
  [key: string]: unknown;
}

interface ProviderConfig {
  baseUrl?: string;
  api?: string;
  apiKey?: string;
  authHeader?: boolean;
  models?: ModelEntry[];
  modelOverrides?: Record<string, unknown>;
}

interface ModelsJson {
  providers: Record<string, ProviderConfig>;
}

interface Provider {
  name: string;
  baseUrl: string;
  apiKey: string;
  resolvedKey: string;
}

type CheckStatus = "pass" | "fail" | "skip";

interface CheckResult {
  provider: string;
  status: CheckStatus;
  httpCode: number | null;
  modelCount: number | null;
  error: string | null;
  detail: string;
  ms: number;
}

interface ZenMuxSubscription {
  plan: { tier: string; amount_usd: number; interval: string };
  account_status: string;
  quota_5_hour: { max_flows: number; used_flows: number; remaining_flows: number; usage_percentage: number };
  quota_7_day: { max_flows: number; used_flows: number; remaining_flows: number; usage_percentage: number };
}

interface ZenMuxBalance {
  currency: string;
  total_credits: number;
  top_up_credits: number;
  bonus_credits: number;
}

interface ZenMuxFlowRate {
  base_usd_per_flow: number;
  effective_usd_per_flow: number;
}

interface ZenMuxMgmt {
  subscription: ZenMuxSubscription | null;
  balance: ZenMuxBalance | null;
  flowRate: ZenMuxFlowRate | null;
  error: string | null;
}

// ── Constants ───────────────────────────────────────────────────────────────

const MODELS_PATH = resolve(homedir(), ".pi/agent/models.json");

const GREEN  = "\x1b[0;32m";
const RED    = "\x1b[0;31m";
const YELLOW = "\x1b[1;33m";
const CYAN   = "\x1b[0;36m";
const DIM    = "\x1b[2m";
const RESET  = "\x1b[0m";

const OPENROUTER_BASE = "https://openrouter.ai/api/v1";
const ZENMUX_MGMT_BASE = "https://zenmux.ai/api/v1/management";

// ── Helpers ─────────────────────────────────────────────────────────────────

function resolveKey(raw: string): string {
  if (!raw) return "";
  const m = raw.match(/^!skate get (.+)$/);
  if (!m) return raw;
  try {
    const key = execSync(`skate get ${m[1]}`, {
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "ignore"],
      timeout: 5000,
    }).trim();
    return key || "";
  } catch {
    return "";
  }
}

function loadModels(path: string): ModelsJson | null {
  try {
    const raw = readFileSync(path, "utf-8");
    return JSON.parse(raw) as ModelsJson;
  } catch {
    return null;
  }
}

function extractProviders(data: ModelsJson): Provider[] {
  const providers: Provider[] = [];
  for (const [name, cfg] of Object.entries(data.providers)) {
    const baseUrl = cfg.baseUrl ?? (name === "openrouter" ? OPENROUTER_BASE : "");
    if (!baseUrl) continue;
    const rawKey = cfg.apiKey ?? "";
    const resolvedKey = resolveKey(rawKey);
    providers.push({ name, baseUrl, apiKey: rawKey, resolvedKey });
  }
  return providers;
}

function buildRequest(provider: Provider): [string, RequestInit] {
  const url = `${provider.baseUrl}/models`;
  const headers: Record<string, string> = {};
  const isLocal = ["ollama", "llama"].includes(provider.resolvedKey);
  if (provider.resolvedKey && !isLocal) {
    headers["Authorization"] = `Bearer ${provider.resolvedKey}`;
  }
  return [url, { method: "GET", headers, signal: AbortSignal.timeout(12_000) }];
}

function parseModelCount(body: string): number | null {
  try {
    const data = JSON.parse(body);
    if (Array.isArray(data.data)) return data.data.length;
    if (Array.isArray(data.models)) return data.models.length;
    if (Array.isArray(data)) return data.length;
    if (data.object === "list" && data.data === null) return 0;
    return null;
  } catch {
    return null;
  }
}

function classifyError(err: unknown): string {
  const msg = String(err);
  if (msg.includes("aborted") || msg.includes("timeout")) return "timeout";
  if (msg.includes("Connection refused") || msg.includes("ECONNREFUSED")) return "connection refused";
  if (msg.includes("ENOTFOUND") || msg.includes("getaddrinfo")) return "DNS not found";
  if (msg.includes("certificate") || msg.includes("SSL")) return "SSL error";
  return "network error";
}

async function checkOne(provider: Provider): Promise<CheckResult> {
  const start = performance.now();

  if (!provider.resolvedKey && provider.apiKey && provider.apiKey.startsWith("!skate get")) {
    return {
      provider: provider.name, status: "skip", httpCode: null,
      modelCount: null, error: null, detail: "no API key resolved",
      ms: Math.round(performance.now() - start),
    };
  }

  const [url, init] = buildRequest(provider);

  try {
    const res = await fetch(url, init);
    const elapsed = Math.round(performance.now() - start);
    const body = await res.text();

    if (res.ok) {
      return {
        provider: provider.name, status: "pass", httpCode: res.status,
        modelCount: parseModelCount(body), error: null, detail: "", ms: elapsed,
      };
    }

    if (res.status === 401 || res.status === 403) {
      return {
        provider: provider.name, status: "fail", httpCode: res.status,
        modelCount: null, error: "auth", detail: "API key rejected or expired", ms: elapsed,
      };
    }

    return {
      provider: provider.name, status: "fail", httpCode: res.status,
      modelCount: null, error: `HTTP ${res.status}`, detail: body.slice(0, 200), ms: elapsed,
    };
  } catch (err) {
    const elapsed = Math.round(performance.now() - start);
    return {
      provider: provider.name, status: "fail", httpCode: null,
      modelCount: null, error: classifyError(err),
      detail: String(err).split("\n")[0], ms: elapsed,
    };
  }
}

function formatLine(r: CheckResult): string {
  const name = r.provider.padEnd(14);
  switch (r.status) {
    case "pass": {
      const models = r.modelCount != null ? `${r.modelCount} model(s)` : "responding";
      return `  ${GREEN}✓${RESET} ${name} ${GREEN}OK${RESET} ${DIM}(${r.ms}ms, ${models})${RESET}`;
    }
    case "skip":
      return `  ${YELLOW}○${RESET} ${name} ${YELLOW}SKIPPED${RESET} ${DIM}(${r.detail})${RESET}`;
    case "fail": {
      const detail = r.error ? ` — ${r.error}` : "";
      const extra = r.detail && r.detail !== r.error ? `\n       ${DIM}${r.detail}${RESET}` : "";
      return `  ${RED}✗${RESET} ${name} ${RED}FAIL${RESET}${detail}${extra}`;
    }
  }
}

// ── ZenMux management ───────────────────────────────────────────────────────

async function fetchZenMuxMgmt(apiKey: string): Promise<ZenMuxMgmt> {
  const headers = { Authorization: `Bearer ${apiKey}` };
  const opts = { headers, signal: AbortSignal.timeout(10_000) };

  const result: ZenMuxMgmt = { subscription: null, balance: null, flowRate: null, error: null };

  try {
    const [subRes, balRes, flowRes] = await Promise.all([
      fetch(`${ZENMUX_MGMT_BASE}/subscription/detail`, opts),
      fetch(`${ZENMUX_MGMT_BASE}/payg/balance`, opts),
      fetch(`${ZENMUX_MGMT_BASE}/flow_rate`, opts),
    ]);

    if (subRes.ok) {
      const d = (await subRes.json()) as { success: boolean; data: ZenMuxSubscription };
      if (d.success) result.subscription = d.data;
    }
    if (balRes.ok) {
      const d = (await balRes.json()) as { success: boolean; data: ZenMuxBalance };
      if (d.success) result.balance = d.data;
    }
    if (flowRes.ok) {
      const d = (await flowRes.json()) as { success: boolean; data: ZenMuxFlowRate };
      if (d.success) result.flowRate = d.data;
    }
  } catch (err) {
    result.error = classifyError(err);
  }

  return result;
}

function formatZenMuxMgmt(mgmt: ZenMuxMgmt): string {
  const lines: string[] = [];
  lines.push("");
  lines.push(`  ${CYAN}ZenMux Account${RESET}`);

  if (mgmt.error) {
    lines.push(`  ${RED}✗${RESET} Management API error: ${mgmt.error}`);
    return lines.join("\n");
  }

  const { subscription: sub, balance: bal, flowRate: flow } = mgmt;

  if (sub) {
    const tier = sub.plan.tier;
    const price = sub.plan.amount_usd > 0 ? ` — \$${sub.plan.amount_usd}/${sub.plan.interval}` : "";
    lines.push(`  Plan:     ${CYAN}${tier}${RESET}${price}`);
    const q5 = sub.quota_5_hour;
    const q7 = sub.quota_7_day;
    const q5Pct = (q5.usage_percentage * 100).toFixed(1);
    const q7Pct = (q7.usage_percentage * 100).toFixed(1);
    const q5Warn = q5.usage_percentage > 0.8 ? RED : q5.usage_percentage > 0.5 ? YELLOW : GREEN;
    const q7Warn = q7.usage_percentage > 0.8 ? RED : q7.usage_percentage > 0.5 ? YELLOW : GREEN;
    lines.push(`  Quota 5h: ${q5Warn}${q5.used_flows}/${q5.max_flows} flows (${q5Pct}%)${RESET}`);
    lines.push(`  Quota 7d: ${q7Warn}${q7.used_flows}/${q7.max_flows} flows (${q7Pct}%)${RESET}`);
  }

  if (flow) {
    lines.push(`  Flow:     \$${flow.effective_usd_per_flow}/flow${DIM} (base \$${flow.base_usd_per_flow})${RESET}`);
  }

  if (bal) {
    const total = bal.total_credits.toFixed(2);
    const bonus = bal.bonus_credits > 0 ? ` ${DIM}(bonus: \$${bal.bonus_credits.toFixed(2)})${RESET}` : "";
    const balWarn = bal.total_credits < 1 ? RED : bal.total_credits < 5 ? YELLOW : GREEN;
    lines.push(`  Balance:  ${balWarn}\$${total}${RESET}${bonus}`);
  }

  if (!sub && !bal && !flow) {
    lines.push(`  ${YELLOW}No management data returned (check API key scope)${RESET}`);
  }

  return lines.join("\n");
}

// ── CLI ─────────────────────────────────────────────────────────────────────

const mainCmd = defineCommand({
  meta: {
    name: "pi-check",
    description: "Check connectivity for Pi Coding Agent model providers",
  },
  args: {
    provider: {
      type: "positional",
      description: "Specific provider to check (omit for all)",
      required: false,
    },
    json: {
      type: "boolean",
      description: "Output machine-readable JSON",
      default: false,
    },
    config: {
      type: "string",
      description: "Path to models.json (default: ~/.pi/agent/models.json)",
      default: MODELS_PATH,
    },
    zenmuxMgmt: {
      type: "boolean",
      description: "Also query ZenMux management API (subscription, balance, quotas)",
      default: false,
    },
  },
  async run({ args }) {
    const configPath = args.config as string;

    const data = loadModels(configPath);
    if (!data) {
      console.error(`${RED}Error:${RESET} Cannot read or parse ${configPath}`);
      process.exit(2);
    }

    let providers = extractProviders(data);

    if (args.provider) {
      const name = args.provider as string;
      providers = providers.filter((p) => p.name.toLowerCase() === name.toLowerCase());
      if (providers.length === 0) {
        console.error(`${RED}Error:${RESET} Provider "${name}" not found in ${configPath}`);
        console.error(`\n  Available: ${Object.keys(data.providers).join(", ")}`);
        process.exit(2);
      }
    }

    // Provider checks
    const results = await Promise.all(providers.map(checkOne));

    // ZenMux management (if flag set)
    let zenMuxMgmt: ZenMuxMgmt | null = null;
    if (args.zenmuxMgmt) {
      const mgmtKey = resolveKey("!skate get zenmux_management_api_key");
      if (mgmtKey) {
        zenMuxMgmt = await fetchZenMuxMgmt(mgmtKey);
      }
    }

    // ── Output ────────────────────────────────────────────────────────

    if (args.json) {
      const output: Record<string, unknown> = { providers: results };
      if (zenMuxMgmt) output.zenmux_mgmt = zenMuxMgmt;
      console.log(JSON.stringify(output, null, 2));
      process.exit(results.some((r) => r.status === "fail") ? 1 : 0);
    }

    console.log("");
    console.log(`${CYAN}  Pi Check — Provider Connectivity${RESET}`);
    console.log(`  ${DIM}Config: ${configPath}${RESET}`);
    console.log("");

    for (const r of results) {
      console.log(formatLine(r));
    }

    const passed = results.filter((r) => r.status === "pass").length;
    const failed = results.filter((r) => r.status === "fail").length;
    const skipped = results.filter((r) => r.status === "skip").length;

    console.log("");
    console.log(
      `  ${GREEN}${passed} passed${RESET}  ${RED}${failed} failed${RESET}  ${YELLOW}${skipped} skipped${RESET}  ${DIM}${results.length} total${RESET}`
    );

    if (zenMuxMgmt) {
      console.log(formatZenMuxMgmt(zenMuxMgmt));
    }

    console.log("");

    process.exit(failed > 0 ? 1 : 0);
  },
});

runMain(mainCmd);