// Logging + cache — append-only JSONL result log, run metadata, cache reads.
// Absorbed from src/cli/pi-eval-runner.ts (logResult, logRunMetadata, getRunHistory).

import { existsSync, readFileSync, appendFileSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { REPO_ROOT } from "./fixtures.js";
import type { EvalConfig, RunMetadata, TestResult, EvalSuiteResult } from "./types.js";

// ── Path resolution ─────────────────────────────────────────────────────────

function absPath(relOrAbs: string): string {
  return isAbsolute(relOrAbs) ? relOrAbs : resolve(REPO_ROOT, relOrAbs);
}
function isAbsolute(p: string): boolean {
  return p.startsWith("/") || (/^[A-Za-z]:[\\/]/.test(p) && process.platform === "win32");
}

// ── Logging ─────────────────────────────────────────────────────────────────

export function logResult(result: TestResult, config: EvalConfig): void {
  const p = absPath(config.evalLogPath);
  const dir = dirname(p);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  appendFileSync(p, JSON.stringify(result) + "\n");
}

export function logRunMetadata(meta: RunMetadata, config: EvalConfig): void {
  const p = absPath(config.runMetaPath);
  const dir = dirname(p);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  appendFileSync(p, JSON.stringify(meta) + "\n");
}

// ── Cache reads ─────────────────────────────────────────────────────────────

/** Read all results from the log for a given model + fixture version. */
export function readResults(
  modelId?: string,
  evalSuiteVersion?: string,
  config?: EvalConfig,
): TestResult[] {
  const p = absPath(config?.evalLogPath ?? "data/eval_log.json");
  if (!existsSync(p)) return [];
  const lines = readFileSync(p, "utf-8").trim().split("\n").filter(Boolean);
  const results: TestResult[] = [];
  for (const line of lines) {
    try {
      const r = JSON.parse(line) as TestResult;
      if (modelId && r.modelId !== modelId) continue;
      if (evalSuiteVersion && r.evalSuiteVersion !== evalSuiteVersion) continue;
      results.push(r);
    } catch { /* skip */ }
  }
  return results;
}

/** Get historical run metadata, optionally filtered by model. */
export function getRunHistory(modelId?: string, limit = 10, config?: EvalConfig): RunMetadata[] {
  const p = absPath(config?.runMetaPath ?? "data/eval_runs.jsonl");
  if (!existsSync(p)) return [];
  const lines = readFileSync(p, "utf-8").trim().split("\n").filter(Boolean);
  const runs: RunMetadata[] = [];
  for (const line of lines) {
    try {
      const meta = JSON.parse(line) as RunMetadata;
      if (!modelId || meta.models.includes(modelId)) runs.push(meta);
    } catch { /* skip */ }
  }
  return runs.slice(-limit);
}

/** Get all test results for a specific run. */
export function getRunResults(runId: string, config?: EvalConfig): TestResult[] {
  const p = absPath(config?.evalLogPath ?? "data/eval_log.json");
  if (!existsSync(p)) return [];
  const lines = readFileSync(p, "utf-8").trim().split("\n").filter(Boolean);
  const results: TestResult[] = [];
  for (const line of lines) {
    try {
      const r = JSON.parse(line) as TestResult;
      if (r.runId === runId) results.push(r);
    } catch { /* skip */ }
  }
  return results;
}

// ── Suite result construction (for status display) ──────────────────────────

/** Build an EvalSuiteResult from cached results for a model + fixture version. */
export function buildSuiteResult(
  modelId: string,
  suiteName: string,
  suiteVersion: string,
  results: TestResult[],
): EvalSuiteResult {
  const passed = results.filter((r) => r.passed).length;
  const criticalFailures = results.filter(
    (r) =>
      !r.passed &&
      r.deterministicResults.some((a) => a.severity === "critical" && !a.passed),
  ).length;
  return {
    modelId,
    suiteName,
    suiteVersion,
    timestamp: results.length > 0 ? Math.max(...results.map((r) => r.timestamp)) : Date.now(),
    tests: results,
    summary: {
      total: results.length,
      passed,
      failed: results.length - passed,
      criticalFailures,
      passRate: results.length > 0 ? passed / results.length : 0,
    },
  };
}

// ── Cache invalidation ──────────────────────────────────────────────────────

/**
 * Invalidate cached results for a model by removing matching lines from the log.
 * Returns the count removed.
 */
export function invalidateCache(modelId: string, config: EvalConfig): number {
  const p = absPath(config.evalLogPath);
  if (!existsSync(p)) return 0;
  const lines = readFileSync(p, "utf-8").trim().split("\n").filter(Boolean);
  let removed = 0;
  const kept: string[] = [];
  for (const line of lines) {
    try {
      const r = JSON.parse(line) as TestResult;
      if (r.modelId === modelId) {
        removed++;
        continue;
      }
    } catch { /* keep malformed lines */ }
    kept.push(line);
  }
  if (removed > 0) {
    writeFileSync(p, kept.join("\n") + (kept.length > 0 ? "\n" : ""));
  }
  return removed;
}
