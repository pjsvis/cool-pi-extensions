#!/usr/bin/env bun
/**
 * audit-pi-config.ts — lint the Pi agent config directory (~/.pi/agent).
 *
 * This repo is the sole explicit owner of the Pi-config surface
 * (`decisions/013-silo-exception-pi-config.md`). That exception is a
 * permission; this script is the same exception applied as a gate.
 *
 * Three checks:
 *   1. every path in settings.json resolves — `skills`, `extensions`,
 *      `prompts`, `themes`, plus local entries in `packages`. Globs, `!`/`-`
 *      exclusions and `builtin:*` names are not paths and are skipped.
 *   2. every advertised skill has a live referent — the scan roots (user
 *      skills dir, `~/.agents/skills`, project `.agents/skills` to the repo
 *      root, and package `skills/`) are walked; broken symlinks are findings.
 *   3. no un-git'd backups (`*.bak`, `*.pre-*`, `*.ollama-*`, `*~`) in the
 *      agent directory, unless it is a git repository.
 *
 * Read-only. Exit code is 1 when any finding is reported, 0 when clean.
 *
 * Usage:
 *   bun run scripts/audit-pi-config.ts [--json] [--agent-dir PATH] [--cwd PATH]
 *   just pi-audit [--json]
 *
 * Origin: blandings seam message 2026-10-11 (td-5c11a2), which had removed 19
 * skill entries and 17 backups by hand and asked for a gate so the next tidy
 * is not required.
 */
import { existsSync, lstatSync, readdirSync, readFileSync, readlinkSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { homedir } from "node:os";
import { dirname, isAbsolute, join, resolve } from "node:path";

// ── args ──────────────────────────────────────────────────────────

const argv = process.argv.slice(2);
const JSON_OUT = argv.includes("--json");
const argVal = (name: string): string | undefined => {
  const i = argv.indexOf(name);
  return i >= 0 ? argv[i + 1] : undefined;
};
const HOME = homedir();
const AGENT_DIR = resolve(
  argVal("--agent-dir") ?? process.env.PI_CODING_AGENT_DIR ?? join(HOME, ".pi", "agent"),
);
const CWD = resolve(argVal("--cwd") ?? process.cwd());

// ── helpers ───────────────────────────────────────────────────────

interface Finding {
  check: "settings" | "skills" | "backups";
  subject: string;
  detail: string;
}

/** `~`-expand, then resolve relative entries against `base`. */
function expand(p: string, base: string): string {
  if (p === "~") return HOME;
  if (p.startsWith("~/")) return join(HOME, p.slice(2));
  if (isAbsolute(p)) return p;
  return resolve(base, p);
}

function readJson(path: string): Record<string, unknown> | undefined {
  try {
    return JSON.parse(readFileSync(path, "utf-8")) as Record<string, unknown>;
  } catch {
    return undefined;
  }
}

/** A settings entry is a filesystem path unless it is a glob, an exclusion, or a builtin name. */
function isPathEntry(raw: string): boolean {
  if (raw.startsWith("builtin:")) return false;
  if (raw.startsWith("!") || raw.startsWith("-")) return false;
  const body = raw.startsWith("+") ? raw.slice(1) : raw;
  if (!body) return false;
  return !/[*?[\]]/.test(body);
}

/** Directories from `start` up to and including the repo root (or the fs root). */
function ancestorDirs(start: string): string[] {
  const out: string[] = [];
  let dir = start;
  for (;;) {
    out.push(dir);
    if (existsSync(join(dir, ".git"))) break;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return out;
}

function isGitRepo(dir: string): boolean {
  try {
    return (
      execFileSync("git", ["-C", dir, "rev-parse", "--is-inside-work-tree"], {
        stdio: ["ignore", "pipe", "ignore"],
      })
        .toString()
        .trim() === "true"
    );
  } catch {
    return false;
  }
}

// ── check 1 — settings.json paths resolve ─────────────────────────

const PATH_KEYS = ["skills", "extensions", "prompts", "themes"] as const;

function checkSettings(settings: Record<string, unknown> | undefined): Finding[] {
  const findings: Finding[] = [];
  if (!settings) {
    return [{ check: "settings", subject: "settings.json", detail: "missing or unparseable" }];
  }
  for (const key of PATH_KEYS) {
    const entries = settings[key];
    if (!Array.isArray(entries)) continue;
    for (const raw of entries) {
      if (typeof raw !== "string" || !isPathEntry(raw)) continue;
      const target = expand(raw.startsWith("+") ? raw.slice(1) : raw, AGENT_DIR);
      if (!existsSync(target)) {
        findings.push({ check: "settings", subject: `${key}: ${raw}`, detail: `no referent (${target})` });
      }
    }
  }
  // packages: npm:/git:/https: specs are not local paths; local paths are checked.
  if (Array.isArray(settings["packages"])) {
    for (const raw of settings["packages"]) {
      if (typeof raw !== "string" || /^(npm:|git:|github:|https?:)/.test(raw)) continue;
      const target = expand(raw, AGENT_DIR);
      if (!existsSync(target)) {
        findings.push({ check: "settings", subject: `packages: ${raw}`, detail: `no referent (${target})` });
      }
    }
  }
  return findings;
}

// ── check 2 — every advertised skill has a live referent ──────────

function skillRoots(settings: Record<string, unknown> | undefined): string[] {
  const roots = new Set<string>();
  roots.add(join(AGENT_DIR, "skills")); // user skills dir
  roots.add(join(HOME, ".agents", "skills")); // Agent Skills location
  for (const dir of ancestorDirs(CWD)) roots.add(join(dir, ".agents", "skills")); // project, to repo root

  // skills declared directly in settings.json (directories become roots)
  const declared = settings?.["skills"];
  if (Array.isArray(declared)) {
    for (const raw of declared) {
      if (typeof raw !== "string") continue;
      if (raw.startsWith("!") || raw.startsWith("builtin:")) continue;
      const body = raw.replace(/^[+-]/, "");
      if (/[*?[\]]/.test(body)) continue;
      const target = expand(body, AGENT_DIR);
      if (existsSync(target) && statSync(target).isDirectory()) roots.add(target);
    }
  }
  // package skills: npm installs under <agent>/npm/node_modules, local packages in place
  if (Array.isArray(settings?.["packages"])) {
    for (const raw of settings["packages"]) {
      if (typeof raw !== "string") continue;
      if (raw.startsWith("npm:")) {
        roots.add(join(AGENT_DIR, "npm", "node_modules", raw.slice(4), "skills"));
      } else if (!/^(git:|github:|https?:)/.test(raw)) {
        roots.add(join(expand(raw, AGENT_DIR), "skills"));
      }
    }
  }
  return [...roots];
}

function walkSkills(dir: string, findings: Finding[], seen: Set<string>): void {
  if (seen.has(dir) || !existsSync(dir)) return;
  seen.add(dir);
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    const full = join(dir, e.name);
    let lst;
    try {
      lst = lstatSync(full);
    } catch {
      continue;
    }
    if (lst.isSymbolicLink()) {
      if (!existsSync(full)) {
        let target = "?";
        try {
          target = readlinkSync(full);
        } catch {
          /* keep placeholder */
        }
        findings.push({ check: "skills", subject: full, detail: `broken symlink -> ${target}` });
      } else if (statSync(full).isDirectory()) {
        walkSkills(full, findings, seen); // symlinked skill dir: still discover nested skills
      }
      continue;
    }
    if (lst.isDirectory()) walkSkills(full, findings, seen);
  }
}

function checkSkills(settings: Record<string, unknown> | undefined): { findings: Finding[]; roots: string[] } {
  const roots = skillRoots(settings);
  const findings: Finding[] = [];
  const seen = new Set<string>();
  for (const root of roots) walkSkills(root, findings, seen);
  return { findings, roots };
}

// ── check 3 — no un-git'd backups ─────────────────────────────────

const BACKUP_RE = /(\.bak($|[-.])|\.pre-[^/]*$|\.ollama-|~$)/;

function checkBackups(): Finding[] {
  const findings: Finding[] = [];
  if (isGitRepo(AGENT_DIR)) return findings; // versioned — backups are a choice, not a defect
  let entries;
  try {
    entries = readdirSync(AGENT_DIR, { withFileTypes: true });
  } catch {
    return findings;
  }
  for (const e of entries) {
    if (BACKUP_RE.test(e.name)) {
      findings.push({
        check: "backups",
        subject: join(AGENT_DIR, e.name),
        detail: "un-git'd backup (git is the memory; a .bak is a copy no gate checks)",
      });
    }
  }
  return findings;
}

// ── run ───────────────────────────────────────────────────────────

const settings = readJson(join(AGENT_DIR, "settings.json"));
const settingsFindings = checkSettings(settings);
const { findings: skillFindings, roots } = checkSkills(settings);
const backupFindings = checkBackups();
const findings = [...settingsFindings, ...skillFindings, ...backupFindings];
const repo = isGitRepo(AGENT_DIR);

if (JSON_OUT) {
  console.log(
    JSON.stringify(
      { agentDir: AGENT_DIR, gitRepo: repo, skillRoots: roots, findings, clean: findings.length === 0 },
      null,
      2,
    ),
  );
} else {
  const C = process.stdout.isTTY
    ? { g: "\x1b[32m", r: "\x1b[31m", y: "\x1b[33m", d: "\x1b[2m", x: "\x1b[0m" }
    : { g: "", r: "", y: "", d: "", x: "" };
  const section = (title: string, items: Finding[]) => {
    console.log(`\n  ${title}`);
    if (items.length === 0) {
      console.log(`    ${C.g}✓${C.x} ${C.d}clean${C.x}`);
    } else {
      for (const f of items) console.log(`    ${C.r}✗${C.x} ${f.subject}  ${C.d}— ${f.detail}${C.x}`);
    }
  };
  console.log(`\n  ${C.d}Pi agent config audit — ${AGENT_DIR}${C.x}`);
  section("1. settings.json paths resolve", settingsFindings);
  section(`2. skills have live referents ${C.d}(${roots.length} roots)${C.x}`, skillFindings);
  section(`3. no un-git'd backups ${C.d}(${repo ? "git repo — skipped" : "not a git repo"})${C.x}`, backupFindings);
  console.log(
    `\n  ${findings.length === 0 ? C.g + "clean" : C.r + findings.length + " finding(s)"}${C.x}  ${C.d}(${roots.join(", ")})${C.x}\n`,
  );
}

process.exit(findings.length > 0 ? 1 : 0);
