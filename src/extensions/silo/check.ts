/**
 * Silo path-checking — pure logic, extracted from index.ts for testability.
 *
 * HONEST SCOPE — a SOFT boundary. Blocks commands whose *literal* arguments
 * reference paths outside the silo root: catches the cooperative agent's
 * accidental excursions and returns "I'm staying in." Does NOT withstand
 * adversarial input — runtime-constructed paths
 * (`python -c "open(os.path.join($HOME,...))"`), symlinks, and tools that read
 * implicit config (git, ssh) all escape. Hard isolation needs OS-level
 * containment (chroot/namespace/container), out of scope for a pi extension.
 * This layer is belt-and-braces over the Protocol's behavioural SILO
 * DISCIPLINE, not a replacement for it.
 */
import { resolve, isAbsolute, join } from "node:path";
import { homedir } from "node:os";

export interface SiloConfig {
  siloRoot?: string;
  enabled?: boolean;
  /**
   * Exact-resolved paths permitted despite being outside siloRoot — the
   * scoped exception from Decision 013 (e.g. ~/.pi/agent/models.json). The
   * match is on the FULLY RESOLVED path, never a prefix: an entry of
   * ~/.pi/agent/models.json admits exactly that file and NOT its sibling
   * auth.json. This is the security-critical property — see isPathAllowed.
   */
  allowedPaths?: string[];
}

// Pseudo-devices commands legitimately redirect to. Exact only — subpaths
// like /dev/sda are still checked and blocked (a silo denies raw device
// access). URLs are stripped before extraction.
const NON_FS_EXACT = ["/dev/null"];

/** Strip URL literals so `curl https://...` isn't false-flagged on its `//host`. */
function stripUrls(command: string): string {
  return command.replace(/\bhttps?:\/\/\S+/g, "");
}

/** Extract absolute (`/...`) and home (`~...`) path tokens from a command. */
export function extractPaths(command: string): string[] {
  const paths: string[] = [];
  const re = /(\/(?:[^\s/]+\/)*[^\s]*)|(~[^\s]*)/g;
  for (const m of command.matchAll(re)) {
    const p = m[0];
    if (NON_FS_EXACT.includes(p)) continue;
    paths.push(p);
  }
  return paths;
}

/**
 * Standalone `..` tokens — relative escapes extractPaths misses (it only
 * matches `/`- and `~`-prefixed tokens). Whole-word matching avoids false
 * positives on revision ranges like `git log master..feature`.
 */
export function extractRelativeEscapes(command: string): string[] {
  const out: string[] = [];
  const re = /(?:^|[\s;&|])(\.\.)(?=[\s;&|]|$)/g;
  for (const m of command.matchAll(re)) out.push(m[1]);
  return out;
}

/** Resolve a token against cwd: `~` → home, absolute as-is, relative → cwd. */
export function resolvePath(p: string, cwd: string): string {
  // `~foo` → relative to home. Strip the `~` AND any leading slash so the
  // remainder joins home rather than being treated as absolute (Node's
  // resolve() discards earlier args once an absolute segment appears).
  if (p.startsWith("~")) {
    const rest = p.slice(1).replace(/^\/+/, "");
    return rest ? join(homedir(), rest) : homedir();
  }
  if (isAbsolute(p)) return p;
  return resolve(cwd, p);
}

/** True if resolvedPath is the silo root or beneath it. */
export function isPathInSilo(resolvedPath: string, siloRoot: string): boolean {
  const r = resolve(resolvedPath);
  const root = resolve(siloRoot);
  return r === root || r.startsWith(root + "/");
}

/**
 * True if resolvedPath is in the allowedPaths exception list (Decision 013).
 * EXACT match on the resolved path — never a prefix. An entry
 * `~/.pi/agent/models.json` admits exactly that file, NOT its sibling
 * `auth.json`. This is the security-critical property that keeps the
 * scope narrow: `resolve()` normalises both sides, so `.`/`..`/symlink
 * cosmetics in the allowed entry can't widen the match, and a directory
 * entry like `~/.pi/agent/` would match only that exact path string, not
 * its children. (To allow a directory and its contents, list it with a
 * trailing slash and resolve canonicalises it — but the Decision 013
 * scope is two files, so entries are filenames.)
 */
export function isPathAllowed(
  resolvedPath: string,
  allowedPaths: string[] = [],
): boolean {
  if (allowedPaths.length === 0) return false;
  const target = resolve(resolvedPath);
  return allowedPaths.some((entry) => resolve(entry) === target);
}

export interface CheckResult {
  blocked: boolean;
  reason: string;
}

/**
 * Check a command for paths outside the silo root. `cwd` is the directory the
 * command will run in; relative paths (incl. bare `..`) resolve against it.
 * `allowedPaths` exempts specific resolved paths (Decision 013 exception) —
 * checked AFTER the silo membership test, so only out-of-silo paths consult it.
 */
export function checkCommand(
  command: string,
  siloRoot: string,
  cwd: string = process.cwd(),
  allowedPaths: string[] = [],
): CheckResult {
  if (!command?.trim()) return { blocked: false, reason: "" };

  const stripped = stripUrls(command);

  for (const p of extractPaths(stripped)) {
    const resolved = resolvePath(p, cwd);
    if (isPathInSilo(resolved, siloRoot)) continue;
    if (isPathAllowed(resolved, allowedPaths)) continue;
    return { blocked: true, reason: `Path outside silo: ${p}` };
  }

  for (const _ of extractRelativeEscapes(stripped)) {
    const resolved = resolvePath("..", cwd);
    if (isPathInSilo(resolved, siloRoot)) continue;
    if (isPathAllowed(resolved, allowedPaths)) continue;
    return { blocked: true, reason: "Relative escape (..) outside silo" };
  }

  // `cd` targets — at start or after a separator (; & |).
  for (const m of stripped.matchAll(/(?:^|[;&|]\s*)cd\s+(\S+)/g)) {
    const target = m[1];
    const resolved = resolvePath(target, cwd);
    if (isPathInSilo(resolved, siloRoot)) continue;
    if (isPathAllowed(resolved, allowedPaths)) continue;
    return { blocked: true, reason: `cd outside silo: ${target}` };
  }

  return { blocked: false, reason: "" };
}
