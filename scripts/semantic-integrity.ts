#!/usr/bin/env bun
/**
 * scripts/semantic-integrity.ts — the Popper-Party detector.
 *
 * Complements check-manifest.ts. The manifest checker verifies that markdown
 * links resolve to files; this catches promises that live in prose and code
 * fences — `just <recipe>` invocations and `scripts/<file>` paths mentioned in
 * docs but not backed by reality.
 *
 * Calibration is "investigate, don't obsess" (Palimpsest Problem; debrief 008):
 *   HARD — a referenced scripts/<file> that does not exist is a broken promise.
 *          Higher signal than recipe heuristics, but still surfaced for triage.
 *   SOFT — a `just <recipe>` not defined in the justfile is a candidate phantom.
 *          Lower signal; English usage can appear in code fences.
 *
 * v1 is NON-BLOCKING: both classes print findings, exit 0. The repo carries
 * known pre-existing phantoms (the msgs/dev/reg cluster); a red gate would be
 * ignored. Once that cluster resolves, promote HARD to exit 1. Decision and
 * debrief records are excluded from both checks — they legitimately mention
 * former phantoms as history.
 *
 * Piecemeal by design — extend, don't rewrite.
 * See playbooks/insights-playbook.md (Palimpsest Problem) and
 * decisions/009-direction-change-delineation.md.
 */
import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const ROOT = process.cwd();

function trackedMarkdown(): string[] {
  const r = spawnSync("git", ["ls-files", "-z"], { encoding: "utf-8" });
  if (r.status !== 0 || !r.stdout) return [];
  return r.stdout
    .split("\0")
    .filter(Boolean)
    .filter((f) => f.endsWith(".md"))
    .filter((f) => !f.includes("/node_modules/"))
    .filter((f) => !f.startsWith("msgs/"));
}

function definedRecipes(): Set<string> {
  if (!existsSync("justfile")) return new Set();
  const set = new Set<string>();
  for (const line of readFileSync("justfile", "utf-8").split("\n")) {
    if (line.includes(":=")) continue; // assignment, not a recipe
    const m = line.match(/^([a-zA-Z_][\w-]*)\b.*:$/);
    if (m) set.add(m[1]);
  }
  return set;
}

const recipes = definedRecipes();
const hard: string[] = [];
const soft: string[] = [];

const scriptPathRe = /scripts\/[A-Za-z0-9_./-]+\.(?:sh|ts|js|mjs|cjs|py)/g;
const justRe = /just\s+([a-zA-Z_][\w-]*)/g;

// SOFT check excludes historical process records (they mention former phantoms).
const isHistorical = (f: string) =>
  f.startsWith("decisions/") || f.startsWith("debriefs/");

for (const file of trackedMarkdown()) {
  if (!existsSync(file)) continue;
  if (isHistorical(file)) continue; // process records describe history, not live usage
  const lines = readFileSync(file, "utf-8").split("\n");
  let inFence = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }

    // HARD: script paths mentioned anywhere must exist on disk.
    scriptPathRe.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = scriptPathRe.exec(line)) !== null) {
      if (!existsSync(resolve(ROOT, m[0]))) {
        hard.push(`${file}:${i + 1}: missing script -> ${m[0]}`);
      }
    }

    // SOFT: `just <recipe>` in fences, backtick spans, or shell-prompt lines.
    const consider =
      inFence || /`just\s+/.test(line) || /^\s*[$#]\s*just\s/.test(line);
    if (!consider) continue;
    justRe.lastIndex = 0;
    while ((m = justRe.exec(line)) !== null) {
      if (!recipes.has(m[1])) {
        soft.push(`${file}:${i + 1}: 'just ${m[1]}' not in justfile`);
      }
    }
  }
}

if (hard.length) {
  console.log("⚠ broken script references (investigate):");
  for (const h of hard) console.log(`  ${h}`);
  console.log();
}
if (soft.length) {
  console.log("⚠ candidate phantom recipes (investigate, don't obsess):");
  for (const s of soft) console.log(`  ${s}`);
  console.log();
}
if (!hard.length && !soft.length) {
  console.log("✓ semantic integrity ok");
} else {
  console.log(`ℹ non-blocking v1: ${hard.length} hard, ${soft.length} soft — promote HARD to exit 1 once the phantom cluster clears`);
}
process.exit(0);
