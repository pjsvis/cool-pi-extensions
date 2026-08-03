import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import {
  ModelsFileSchema,
  MODEL_KEYS,
  PROVIDER_KEYS,
  type ModelsFile,
  type ProviderConfig,
  type Model,
} from "./schema";

// ── Paths ──────────────────────────────────────────────────────────

export const MODELS_PATH = join(homedir(), ".pi", "agent", "models.json");

// ── IO ─────────────────────────────────────────────────────────────

export function load(): ModelsFile {
  if (!existsSync(MODELS_PATH)) return { providers: {} };
  const raw = JSON.parse(readFileSync(MODELS_PATH, "utf-8"));
  const parsed = ModelsFileSchema.safeParse(raw);
  if (!parsed.success) {
    const lines = parsed.error.issues.map(
      (i) => `  at ${i.path.join(".") || "<root>"}: ${i.message}`,
    );
    throw new Error(
      `models.json failed structural validation:\n${lines.join("\n")}`,
    );
  }
  return parsed.data;
}

export function save(data: ModelsFile): void {
  writeFileSync(MODELS_PATH, JSON.stringify(data, null, 2) + "\n");
}

// ── Provider helpers ───────────────────────────────────────────────

export function ensureProvider(data: ModelsFile, name: string): ProviderConfig {
  if (!data.providers[name]) {
    data.providers[name] = { models: [] };
  }
  return data.providers[name];
}

export function findModel(
  cfg: ProviderConfig,
  modelId: string,
): Model | undefined {
  return cfg.models?.find((m) => m.id === modelId);
}

// ── Validation ─────────────────────────────────────────────────────

export interface ValidationIssue {
  level: "error" | "warning";
  message: string;
}

export function validate(data: ModelsFile): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const [pName, cfg] of Object.entries(data.providers)) {
    if (cfg.models) {
      const ids = cfg.models.map((m) => m.id);
      const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
      if (dupes.length > 0) {
        issues.push({
          level: "error",
          message: `${pName}: duplicate model IDs: ${[...new Set(dupes)].join(", ")}`,
        });
      }

      for (const m of cfg.models) {
        for (const k of Object.keys(m)) {
          if (!MODEL_KEYS.has(k) && !k.startsWith("_")) {
            issues.push({
              level: "warning",
              message: `${pName}/${m.id || "?"}: unknown field "${k}" (typo? underscore-prefixed annotations are ignored)`,
            });
          }
        }
        if (!m.id) {
          issues.push({ level: "error", message: `${pName}: model missing "id"` });
        }
        if (m.reasoning && !m.cost) {
          issues.push({
            level: "warning",
            message: `${pName}/${m.id}: reasoning=true but no cost set`,
          });
        }
        if (!m.contextWindow) {
          issues.push({
            level: "warning",
            message: `${pName}/${m.id}: no contextWindow (defaults to 128000)`,
          });
        }
        if (m.cost) {
          if (m.cost.input < 0 || m.cost.output < 0) {
            issues.push({
              level: "error",
              message: `${pName}/${m.id}: negative cost values`,
            });
          }
        }
      }
    }
    for (const k of Object.keys(cfg)) {
      if (!PROVIDER_KEYS.has(k) && !k.startsWith("_")) {
        issues.push({
          level: "warning",
          message: `${pName}: unknown provider field "${k}" (typo? underscore-prefixed annotations are ignored)`,
        });
      }
    }
    if (!cfg.apiKey) {
      issues.push({ level: "warning", message: `${pName}: no apiKey configured` });
    }
    if (!cfg.baseUrl) {
      issues.push({ level: "warning", message: `${pName}: no baseUrl configured` });
    }
  }

  return issues;
}

// ── Resolve key name ───────────────────────────────────────────────

const SKATE_CMD_RE = /^!skate get (\S+)$/;

/** Returns the skate key name if the apiKey is a `!skate get ...` command, otherwise null. */
export function skateKeyName(apiKey: string | undefined): string | null {
  if (!apiKey) return null;
  const m = apiKey.match(SKATE_CMD_RE);
  return m ? m[1] : null;
}