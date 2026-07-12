/**
 * pi-mathematica-verify — lookup-first verification registry.
 *
 * The registry is the authoritative spec: {equation -> WL + bound assertions}.
 * Resolution is LOOKUP-FIRST: a manuscript equation is matched by (file, line);
 * if present and its hash matches the curated LaTeX, the curated WL/assertions win.
 * If absent, the parser produces a candidate (flagged unverified) for human promotion.
 * If present but the manuscript LaTeX hash differs from the curated hash, the entry
 * is STALE (drift) — loud failure, never silent.
 *
 * The parser is the bootstrap/fallback, not the source of truth. See Decision 011.
 */
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { translate, indexConsistent } from "./translator.ts";

export type Framework = "lagrangian" | "continuum";
export type Status = "pass" | "fail" | "unverified" | "stale";

export interface Equation {
  id: string;
  file: string;
  line: number;
  nth: number; // equation ordinal on that line (0-based) — disambiguates >1 per line
  framework: Framework;
  latex: string;
  latexHash: string; // computed on load from normalized latex
  wl: string;
  assertions: string[];
  status: Status;
  lastVerified: string | null;
}

const REGISTRY_PATH = new URL("./equations.jsonl", import.meta.url);

export function normalizeLatex(s: string): string {
  return s.replace(/^\${1,2}/, "").replace(/\${1,2}$/, "").replace(/\s+/g, " ").trim();
}

export function hashLatex(s: string): string {
  return createHash("sha256").update(normalizeLatex(s)).digest("hex").slice(0, 16);
}

interface RawEntry {
  id: string; file: string; line: number; nth?: number; framework: Framework;
  latex: string; wl: string; assertions: string[];
  status: Status; lastVerified: string | null;
}

export function loadRegistry(path: string = REGISTRY_PATH.pathname): Equation[] {
  const text = readFileSync(path, "utf-8");
  return text.split("\n").filter((l) => l.trim()).map((l) => {
    const r = JSON.parse(l) as RawEntry;
    return { ...r, nth: r.nth ?? 0, latexHash: hashLatex(r.latex) };
  });
}

export interface ResolveResult {
  source: "registry" | "parser-fallback";
  stale: boolean;
  wl: string;
  assertions: string[];
  status: Status;
  id?: string;
}

/** Lookup-first resolve: match by (file, line, nth); drift via LaTeX hash. */
export function resolve(reg: Equation[], file: string, line: number, nth: number, latex: string): ResolveResult {
  const entry = reg.find((e) => e.file === file && e.line === line && e.nth === nth);
  if (entry) {
    const stale = hashLatex(latex) !== entry.latexHash;
    return {
      source: "registry",
      stale,
      wl: entry.wl,
      assertions: entry.assertions,
      status: stale ? "stale" : entry.status,
      id: entry.id,
    };
  }
  return { source: "parser-fallback", stale: false, wl: translate(latex), assertions: [], status: "unverified" };
}

/** Local (no-kernel) assertions. Kernel-dependent ones return "needs-kernel". */
export function runLocalAssertions(latex: string, assertions: string[]): Record<string, boolean | "needs-kernel"> {
  const out: Record<string, boolean | "needs-kernel"> = {};
  for (const a of assertions) {
    if (a === "indexConsistencyQ") out[a] = indexConsistent(latex);
    else out[a] = "needs-kernel"; // symmetricQ, contractEqual, hydrostaticQ, ...
  }
  return out;
}
