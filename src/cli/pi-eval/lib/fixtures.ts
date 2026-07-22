// Fixture registry, loading, validation.
// Available fixtures mapped to paths relative to repo root.

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { EvalFixture } from "./types.js";

/** Repo root — resolved from this file's location (src/cli/pi-eval/lib/). */
export const REPO_ROOT = resolve(import.meta.dir, "..", "..", "..", "..");

/** Available fixture keys → paths (relative to repo root). */
export const FIXTURES: Record<string, string> = {
  edinburgh: "prompts/edinburgh-protocol-evals-v1.json",
  iq: "prompts/iq-benchmark-v1.json",
  "005b": "prompts/edinburgh-005b-grounding-v1.json",
  "005b-strong": "prompts/edinburgh-005b-strong-v1.json",
  sit: "prompts/stuff-into-things-v1.json",
  sit2: "prompts/stuff-into-things-v2.json",
};

export const DEFAULT_FIXTURE = "edinburgh";

/** Resolve a fixture key to an absolute path. */
export function fixturePath(key: string = DEFAULT_FIXTURE): string {
  const rel = FIXTURES[key];
  if (!rel) {
    throw new Error(
      `Unknown fixture '${key}'. Available: ${Object.keys(FIXTURES).join(", ")}`,
    );
  }
  return resolve(REPO_ROOT, rel);
}

/** Load and parse a fixture by key. */
export function loadFixture(key: string = DEFAULT_FIXTURE): EvalFixture {
  const p = fixturePath(key);
  if (!existsSync(p)) throw new Error(`Fixture not found: ${p}`);
  return JSON.parse(readFileSync(p, "utf-8")) as EvalFixture;
}

/** Validate a fixture's structural integrity. Returns error messages (empty = valid). */
export function validateFixture(fixture: EvalFixture): string[] {
  const errs: string[] = [];
  if (!Array.isArray(fixture.tests) || fixture.tests.length === 0)
    errs.push("No tests defined");
  for (const t of fixture.tests) {
    if (!t.id) errs.push("Test missing id");
    if (!t.setup?.user_prompt) errs.push(`${t.id}: missing user_prompt`);
    if (!Array.isArray(t.assertions) || t.assertions.length === 0)
      errs.push(`${t.id}: no assertions`);
  }
  return errs;
}

/** List available fixtures with their test counts. */
export function listFixtures(): Array<{ key: string; path: string; suiteName: string; version: string; testCount: number }> {
  const out: Array<{ key: string; path: string; suiteName: string; version: string; testCount: number }> = [];
  for (const [key, rel] of Object.entries(FIXTURES)) {
    const abs = resolve(REPO_ROOT, rel);
    try {
      if (!existsSync(abs)) {
        out.push({ key, path: rel, suiteName: "(not found)", version: "?", testCount: 0 });
        continue;
      }
      const fx = JSON.parse(readFileSync(abs, "utf-8")) as EvalFixture;
      out.push({
        key,
        path: rel,
        suiteName: fx.suiteName,
        version: fx.version,
        testCount: fx.tests.length,
      });
    } catch {
      out.push({ key, path: rel, suiteName: "(parse error)", version: "?", testCount: 0 });
    }
  }
  return out;
}
