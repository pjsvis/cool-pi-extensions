#!/usr/bin/env bun

/**
 * scripts/check-manifest.ts — register & manifest consistency gate.
 *
 * Refactored from the hand-MANIFEST checker. Now verifies the generated
 * register system:
 *   1. Each registered folder's register.jsonl path-set == filesystem path-set
 *      (missing / stale = entropy, exit 1).
 *   2. MANIFEST.md marked block lists exactly the registered files (missing /
 *      stale = stale roll-up, exit 1).
 *   3. Retained advisory checks: internal markdown links resolve; known path
 *      migrations are not reintroduced.
 *
 * v1 is BLOCKING on presence (1, 2). sha/content staleness is informational in
 * v1 (visible in `git diff`); promote to blocking later if wanted — same
 * non-blocking→blocking pattern as semantic-integrity.ts.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve, extname, relative, join } from "node:path";
import { REGISTERED, BEGIN, END, listFiles, extractManifestBlock } from "./register-lib.ts";

const ROOT = process.cwd();

function parseRegisterPaths(dir: string): Set<string> {
  const path = `${dir}/register.jsonl`;
  const set = new Set<string>();
  if (!existsSync(path)) return set;
  for (const line of readFileSync(path, "utf-8").split("\n")) {
    if (!line.trim()) continue;
    try {
      const j = JSON.parse(line) as { path?: string };
      if (typeof j.path === "string") set.add(j.path);
    } catch {
      set.add(`__unparseable:${dir}__`);
    }
  }
  return set;
}

function manifestListedPaths(block: string): Set<string> {
  const set = new Set<string>();
  const re = /\*\*\[([^\]]+)\]\([^)]+\)\*\*/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(block)) !== null) set.add(m[1]);
  return set;
}

function checkRegisters(): string[] {
  const errors: string[] = [];
  const allFsPaths = new Set<string>();
  for (const spec of REGISTERED) {
    const reg = parseRegisterPaths(spec.dir);
    const fs = new Set(listFiles(spec.dir).map((p) => relative(ROOT, p).replace(/\\/g, "/")));
    fs.forEach((p) => allFsPaths.add(p));

    if (reg.size === 0 && fs.size === 0) continue;

    if (!existsSync(`${spec.dir}/register.jsonl`)) {
      errors.push(`${spec.dir}/register.jsonl missing — run \`just registers\``);
      continue;
    }

    const missing = [...fs].filter((p) => !reg.has(p)).sort();
    const stale = [...reg].filter((p) => !fs.has(p)).sort();
    if (missing.length) errors.push(`${spec.dir}: ${missing.length} file(s) not in register — run \`just registers\`:\n${missing.map((p) => `    - ${p}`).join("\n")}`);
    if (stale.length) errors.push(`${spec.dir}: register lists ${stale.length} missing file(s) — run \`just registers\`:\n${stale.map((p) => `    - ${p}`).join("\n")}`);
  }
  return errors;
}

function checkManifest(): string[] {
  const errors: string[] = [];
  const text = existsSync("MANIFEST.md") ? readFileSync("MANIFEST.md", "utf-8") : "";
  const block = extractManifestBlock(text);
  if (!block) {
    errors.push(`MANIFEST.md missing ${BEGIN}/${END} markers — run \`just registers\` (or add markers)`);
    return errors;
  }
  const listed = manifestListedPaths(block);
  const expected = new Set<string>();
  for (const spec of REGISTERED) {
    for (const p of listFiles(spec.dir)) expected.add(relative(ROOT, p).replace(/\\/g, "/"));
  }
  const missing = [...expected].filter((p) => !listed.has(p)).sort();
  const stale = [...listed].filter((p) => !expected.has(p)).sort();
  if (missing.length) errors.push(`MANIFEST.md missing ${missing.length} file(s) — run \`just registers\`:\n${missing.map((p) => `    - ${p}`).join("\n")}`);
  if (stale.length) errors.push(`MANIFEST.md lists ${stale.length} non-registered file(s) — run \`just registers\`:\n${stale.map((p) => `    - ${p}`).join("\n")}`);
  return errors;
}

// ── Retained advisory checks (from the original checker) ──────────────────────

const INDEXED_DIRS = REGISTERED.map((s) => s.dir);

function walk(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(full));
    else if (e.isFile() && extname(e.name) === ".md") out.push(full);
  }
  return out;
}

function markdownLinks(file: string): string[] {
  const text = readFileSync(file, "utf-8");
  const links: string[] = [];
  const re = /\[[^\]]*\]\(([^)]+)\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) links.push(m[1]);
  return links;
}

function checkLinks(): string[] {
  const errors: string[] = [];
  const checked = ["README.md", "MANIFEST.md", ...INDEXED_DIRS.flatMap((d) => walk(resolve(ROOT, d)))];
  for (const file of checked) {
    if (!existsSync(file)) continue;
    const base = resolve(file, "..");
    for (const raw of markdownLinks(file)) {
      if (/^(https?:|mailto:|#|\/)/.test(raw)) continue;
      const [withoutAnchor] = raw.split("#");
      if (!withoutAnchor) continue;
      if (!existsSync(resolve(base, withoutAnchor))) {
        errors.push(`${file}: missing link → ${raw}`);
      }
    }
  }
  return errors;
}

function checkPathDrift(): string[] {
  const checks: Array<[string, RegExp, string]> = [
    ["docs/edinburgh-protocol-eval.md", /(?<!src\/)cli\/pi-check\/edinburgh-eval\.ts/, "Doc references old cli/pi-check path; use src/cli/pi-check."],
  ];
  const errors: string[] = [];
  for (const [file, pattern, message] of checks) {
    if (!existsSync(file)) continue;
    if (pattern.test(readFileSync(file, "utf-8"))) errors.push(`${file}: ${message}`);
  }
  return errors;
}

function main(): number {
  const errors: string[] = [];
  errors.push(...checkRegisters());
  errors.push(...checkManifest());
  errors.push(...checkLinks());
  errors.push(...checkPathDrift());

  if (errors.length === 0) {
    console.log("✓ Register & manifest checks passed");
    return 0;
  }
  console.error("✗ Register & manifest checks failed");
  for (const error of errors) console.error(`  ${error}`);
  console.error(`\n  Fix: \`just registers\` then re-commit.`);
  return 1;
}

process.exit(main());
