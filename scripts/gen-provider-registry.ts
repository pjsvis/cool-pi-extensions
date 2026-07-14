#!/usr/bin/env bun
/**
 * Regenerate docs/provider-registry.md from the live ~/.pi/agent/models.json.
 *
 * The provider-registry doc was hand-maintained and drifted (it claimed a live
 * zenmux provider that did not exist — a palimpsest). This generator is the
 * durable fix: the doc is always a faithful projection of the config.
 *
 * Usage: bun run scripts/gen-provider-registry.ts   (or: just registry)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const CFG = join(homedir(), ".pi", "agent", "models.json");
const OUT = "docs/provider-registry.md";

type Model = Record<string, any>;
const cfg = JSON.parse(readFileSync(CFG, "utf-8"));
const providers = Object.entries(cfg.providers ?? {}) as [string, any][];

const fmtCost = (m: Model): string => {
  const c = m.cost;
  if (!c) return "?/?";
  const r = (v: any) => (v == null ? "?" : String(v));
  return `$${r(c.input)}/$${r(c.output)}`;
};
const fmtList = (v: any): string => (Array.isArray(v) ? v.join(", ") : v == null ? "?" : String(v));
const note = (m: Model): string => (m._note ? String(m._note).replace(/\|/g, "\\|") : "");

const sections: string[] = [];
let total = 0;

for (const [name, p] of providers) {
  const models: Model[] = [...(p.models ?? [])];
  for (const [id, m] of Object.entries(p.modelOverrides ?? {})) {
    (m as Model).id = id;
    models.push(m as Model);
  }
  total += models.length;

  const keySrc = p.apiKey ? `\`!skate …\` resolved` : "local";
  const keyDisplay = typeof p.apiKey === "string" && p.apiKey.startsWith("!skate")
    ? `\`${p.apiKey}\``
    : (p.apiKey ? "inline" : "local");

  sections.push(`## ${name}`, "");
  sections.push("| Property | Value |", "|---|---|");
  sections.push(`| Base URL | \`${p.baseUrl ?? "—"}\` |`);
  sections.push(`| API | \`${p.api ?? "—"}\` |`);
  sections.push(`| Auth | ${p.authHeader ? "Bearer" : "local"} |`);
  sections.push(`| Key source | ${keyDisplay} |`);
  sections.push("");
  if (models.length === 0) {
    sections.push("_(no models)_", "");
    continue;
  }
  sections.push(`### Models (${models.length})`, "");
  sections.push("| Model | Reasoning | Input | Context | MaxTok | Cost (in/out) | Notes |");
  sections.push("|---|---|---|---|---|---|---|");
  for (const m of models) {
    const r = m.reasoning ? "✓" : "—";
    sections.push(
      `| \`${m.id ?? m.name ?? "?"}\` | ${r} | ${fmtList(m.input)} | ${m.contextWindow ?? "?"} | ${m.maxTokens ?? "?"} | ${fmtCost(m)} | ${note(m)} |`,
    );
  }
  sections.push("");
}

const head = [
  "# Pi Provider Registry",
  `**Generated:** ${new Date().toISOString().slice(0, 10)}`,
  `**Source:** \`~/.pi/agent/models.json\``,
  `**Providers:** ${providers.length}  ·  **Total models:** ${total}`,
  "",
  "_Regenerate with `just registry` (scripts/gen-provider-registry.ts)._",
  "",
  "---",
  "",
].join("\n");

writeFileSync(OUT, head + sections.join("\n") + "\n");
console.log(`Wrote ${OUT}: ${providers.length} providers, ${total} models.`);
