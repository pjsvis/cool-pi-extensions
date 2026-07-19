/**
 * scripts/register-lib.ts — shared core for the folder-register system.
 *
 * Both the generator (gen-registers.ts) and the verifier (check-manifest.ts)
 * import from here so they cannot drift apart. A register is a deterministic
 * function of its folder; `git diff` on a committed register IS the structural
 * delta. Substance is the Derrida Question's wall, not the checksum's.
 *
 * Registered folders (edit REGISTERED to add one): briefs, debriefs, decisions,
 * playbooks, docs, prompts. Excluded: data, blog, src, models — content, not
 * process; git is their register.
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, relative, extname, basename } from "node:path";
import { createHash } from "node:crypto";

export const ROOT = process.cwd();

export const REGISTERED = [
  { dir: "briefs", title: "Briefs", blurb: "Project briefs define **what** and **why** before code is written. Frozen when work starts." },
  { dir: "debriefs", title: "Debriefs", blurb: "Post-implementation reflections. Capture what worked, what didn't, what to try next." },
  { dir: "decisions", title: "Decisions", blurb: "Recorded architectural decisions with context, rationale, and consequences." },
  { dir: "playbooks", title: "Playbooks", blurb: "How-to guides for recurring tasks. Give pi the URL and it executes." },
  { dir: "docs", title: "Docs", blurb: "Structured reference material." },
  { dir: "prompts", title: "Prompts", blurb: "Reusable prompt templates and agent identity frameworks." },
] as const;

export const BEGIN = "<!-- BEGIN REGISTERS -->";
export const END = "<!-- END REGISTERS -->";

export function extensionsFor(dir: string): string[] {
  // prompts/ also indexes .json fixtures; everywhere else is markdown only.
  // .jsonl (incl. register.jsonl itself) is deliberately never registered.
  return dir === "prompts" ? [".md", ".json"] : [".md"];
}

export interface Entry {
  path: string;
  title: string;
  description: string;
  status?: string;
  sha: string;
  bytes: number;
}

/** Recursively list registered files under `dir`, sorted (deterministic order). */
export function listFiles(dir: string): string[] {
  const absDir = join(ROOT, dir);
  if (!existsSync(absDir)) return [];
  const exts = extensionsFor(dir);
  const out: string[] = [];
  const walk = (d: string) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const full = join(d, e.name);
      if (e.isDirectory()) walk(full);
      else if (e.isFile() && exts.includes(extname(e.name))) out.push(full);
    }
  };
  walk(absDir);
  return out.sort();
}

function parseFrontmatter(text: string): { fm: Record<string, string>; body: string } {
  const fm: Record<string, string> = {};
  let body = text;
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (m) {
    for (const line of m[1].split(/\r?\n/)) {
      const mm = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
      if (mm) fm[mm[1].toLowerCase()] = mm[2].replace(/^["']|["']$/g, "").trim();
    }
    body = text.slice(m[0].length);
  }
  return { fm, body };
}

function clip(s: string, n = 140): string {
  const t = s.trim().replace(/\s+/g, " ");
  return t.length <= n ? t : t.slice(0, n - 1).trimEnd() + "…";
}

function extractTitle(text: string, fallback: string, isJson: boolean): string {
  if (isJson) {
    try {
      const j = JSON.parse(text) as Record<string, unknown>;
      const t = j["title"] ?? j["name"] ?? j["fixture_name"];
      if (typeof t === "string") return t;
    } catch { /* fall through */ }
    return fallback;
  }
  const { fm, body } = parseFrontmatter(text);
  if (fm.title) return fm.title;
  const h1 = body.match(/^#\s+(.+)$/m);
  return h1 ? h1[1].trim() : fallback;
}

function extractStatus(text: string): string | undefined {
  const { fm, body } = parseFrontmatter(text);
  if (fm.status) return fm.status;
  const m = body.match(/^\*\*Status:\*\*\s*(.+)$/m);
  return m ? m[1].trim() : undefined;
}

function extractDescription(text: string, isJson: boolean): string {
  if (isJson) {
    try {
      const j = JSON.parse(text) as Record<string, unknown>;
      const d = j["description"] ?? j["dek"];
      if (typeof d === "string") return clip(d);
    } catch { /* fall through */ }
    return "";
  }
  const { fm, body } = parseFrontmatter(text);
  if (fm.dek) return clip(fm.dek);
  if (fm.description) return clip(fm.description);
  for (const raw of body.split(/\r?\n/)) {
    const t = raw.trim();
    if (!t) continue;
    if (t.startsWith("#")) continue;            // headings
    if (t.startsWith("---")) continue;          // rules
    if (/^\*\*[\w /-]+:\*\*/.test(t)) continue; // **Field:** value metadata
    if (t.startsWith("```")) continue;          // fence start
    return clip(t.replace(/\*\*/g, ""));
  }
  return "";
}

/** Build the deterministic Entry[] for one folder (reads files fresh). */
export function buildEntries(dir: string): Entry[] {
  const isJson = (p: string) => extname(p) === ".json";
  return listFiles(dir).map((abs) => {
    const buf = readFileSync(abs);
    const text = buf.toString("utf-8");
    const rel = relative(ROOT, abs).replaceAll("\\", "/");
    const entry: Entry = {
      path: rel,
      title: extractTitle(text, basename(abs, extname(abs)), isJson(abs)),
      description: extractDescription(text, isJson(abs)),
      sha: createHash("sha256").update(buf).digest("hex").slice(0, 12),
      bytes: buf.length,
    };
    if (!isJson(abs)) {
      const status = extractStatus(text);
      if (status) entry.status = status;
    }
    return entry;
  });
}

/** Render an Entry[] as register.jsonl (sorted input → deterministic output). */
export function renderRegisterJsonl(entries: Entry[]): string {
  return entries.map((e) => JSON.stringify(e)).join("\n") + "\n";
}

/** Render one folder as a MANIFEST.md section. */
export function manifestSection(spec: { title: string; blurb: string }, entries: Entry[]): string {
  const lines = [`## ${spec.title}`, spec.blurb, ""];
  for (const e of entries) {
    const d = e.description ? ` — ${e.description}` : "";
    lines.push(`**[${e.path}](${e.path})**${d}`);
  }
  return lines.join("\n") + "\n";
}

/** The full generated block (markers inclusive) for MANIFEST.md. */
export function renderManifestBlock(): string {
  const sections = REGISTERED.map((spec) =>
    manifestSection(spec, buildEntries(spec.dir)),
  );
  return [BEGIN, ...sections, "", END].join("\n") + "\n";
}

/** Extract the marked block from MANIFEST.md text, or null if unmarked. */
export function extractManifestBlock(text: string): string | null {
  const m = text.match(/<!-- BEGIN REGISTERS -->[\s\S]*?<!-- END REGISTERS -->/);
  return m ? m[0] : null;
}
