// Config loader — home + project-local overrides, merged onto defaults.

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { DEFAULT_CONFIG, type EvalConfig } from "./types.js";
import { REPO_ROOT, DEFAULT_FIXTURE } from "./fixtures.js";

/** Load config from home + project, merged onto defaults. */
export function loadConfig(overrides: Partial<EvalConfig> = {}): EvalConfig {
  const piAgentDir = process.env.PI_CODING_AGENT_DIR ??
    resolve(process.env.HOME ?? "/tmp", ".pi", "agent");

  const homeConfigPath = resolve(piAgentDir, "extensions", "edinburgh-evals", "config.json");
  // New canonical location (after migration):
  const cliConfigPath = resolve(piAgentDir, "extensions", "pi-eval", "config.json");
  const projectConfigPath = resolve(REPO_ROOT, ".pi", "pi-eval.json");

  let config = { ...DEFAULT_CONFIG, ...overrides };
  for (const p of [homeConfigPath, cliConfigPath, projectConfigPath]) {
    if (existsSync(p)) {
      try {
        config = { ...config, ...JSON.parse(readFileSync(p, "utf-8")) };
      } catch {
        /* ignore malformed */
      }
    }
  }
  return config;
}

/** Resolve a fixture key against config (config.fixturePath is a path, not a key). */
export function resolveFixtureKey(fixtureArg?: string): string {
  return fixtureArg && fixtureArg.trim() ? fixtureArg.trim() : DEFAULT_FIXTURE;
}
