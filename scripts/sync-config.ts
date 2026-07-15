#!/usr/bin/env bun
/**
 * Mirror the live pi config (~/.pi/agent/models.json) into the repo so the
 * provider/model config is captured in git — without committing secrets.
 *
 * GUARD: refuses to mirror if any provider apiKey is an inline secret.
 * Keys must be `!skate get <name>` refs (or local dummies like "ollama").
 * This is the safety net for the git-captured mirror (Decision 013: secrets
 * stay in skate, never in the repo).
 *
 * Usage: bun run scripts/sync-config.ts   (or: just sync-config)
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const SRC = join(homedir(), ".pi", "agent", "models.json");
const DST = "models/live-config.json";

if (!existsSync(SRC)) {
  console.error(`source not found: ${SRC}`);
  process.exit(1);
}

const raw = readFileSync(SRC, "utf-8");
const cfg = JSON.parse(raw);
const providers = Object.entries(cfg.providers ?? {});

// Guard 1 — semantic: every provider.apiKey must be a skate ref or local dummy.
const LOCAL_OK = new Set(["ollama", "llama", ""]);
const flagged: string[] = [];
for (const [name, p] of providers) {
  const k = (p as { apiKey?: unknown }).apiKey;
  if (k == null || k === "") continue;
  if (typeof k === "string" && k.startsWith("!skate ")) continue;
  if (LOCAL_OK.has(k as string)) continue;
  flagged.push(`${name}.apiKey`);
}
if (flagged.length) {
  console.error(`REFUSING to mirror — potential inline secret(s) in: ${flagged.join(", ")}`);
  console.error(`Relocate to "!skate get <name>" before syncing (Decision 013).`);
  process.exit(1);
}

// Guard 2 — raw regex: catch secrets anywhere unexpected.
const SECRET_RE = /sk-[A-Za-z0-9_-]{15,}|sk_or-[A-Za-z0-9_-]{15,}|sk-ant-[A-Za-z0-9_-]{15,}/;
if (SECRET_RE.test(raw)) {
  console.error("REFUSING to mirror — inline secret pattern (sk-…) found in the config text.");
  console.error("Find and relocate it to a `!skate get` ref before syncing.");
  process.exit(1);
}

writeFileSync(DST, raw);
console.log(`Mirrored ${SRC} → ${DST} (${providers.length} providers, secret-scan clean).`);
console.log("Run `just registry` too if the rendered provider-registry doc should track this snapshot.");
