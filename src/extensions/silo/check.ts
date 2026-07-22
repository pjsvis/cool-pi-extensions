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
import { resolve, isAbsolute } from "node:path";
import { homedir } from "node:os";

export interface SiloConfig {
  siloRoot?: string;
  enabled?: boolean;
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
  if (p.startsWith("~")) return resolve(homedir(), p.slice(1));
  if (isAbsolute(p)) return p;
  return resolve(cwd, p);
}

/** True if resolvedPath is the silo root or beneath it. */
export function isPathInSilo(resolvedPath: string, siloRoot: string): boolean {
  const r = resolve(resolvedPath);
  const root = resolve(siloRoot);
  return r === root || r.startsWith(root + "/");
}

export interface CheckResult {
  blocked: boolean;
  reason: string;
}

/**
 * Check a command for paths outside the silo root. `cwd` is the directory the
 * command will run in; relative paths (incl. bare `..`) resolve against it.
 */
export function checkCommand(
  command: string,
  siloRoot: string,
  cwd: string = process.cwd(),
): CheckResult {
  if (!command?.trim()) return { blocked: false, reason: "" };

  const stripped = stripUrls(command);

  for (const p of extractPaths(stripped)) {
    if (!isPathInSilo(resolvePath(p, cwd), siloRoot)) {
      return { blocked: true, reason: `Path outside silo: ${p}` };
    }
  }

  for (const _ of extractRelativeEscapes(stripped)) {
    if (!isPathInSilo(resolvePath("..", cwd), siloRoot)) {
      return { blocked: true, reason: `Relative escape (..) outside silo` };
    }
  }

  // `cd` targets — at start or after a separator (; & |).
  for (const m of stripped.matchAll(/(?:^|[;&|]\s*)cd\s+(\S+)/g)) {
    const target = m[1];
    if (!isPathInSilo(resolvePath(target, cwd), siloRoot)) {
      return { blocked: true, reason: `cd outside silo: ${target}` };
    }
  }

  return { blocked: false, reason: "" };
}
