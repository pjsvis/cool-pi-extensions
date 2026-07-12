/**
 * pi-mathematica-verify — LaTeX → Wolfram Language translator (Phase 1)
 *
 * Handles the book's two frameworks (pob/briefs/2026-06-26-staved-finger*.md):
 *   A. Lagrangian index notation with Einstein summation
 *   B. Continuum matrix notation (pmatrix)
 *
 * Notation supported: indexed symbols (^/_), \text{} labels, derivative fractions
 * (\frac{\partial X}{\partial Y}), pmatrix, Einstein summation (count-2 dummy),
 * \dot{}/\ddot{} time derivatives, \mathcal{X}, \int ... d<var>, division (/),
 * \delta_{ij} -> KroneckerDelta, thin space \,, AND parenthesis-aware term
 * splitting with (A+B) groups (e.g. the isotropic elasticity expansion).
 *
 * NOT yet handled: function-call parens M(q) when the arg has no +/- (ambiguous
 * with multiplication — currently dropped as args), trig, \to limits.
 */

const GREEK: Record<string, string> = {
  tau: "τ", lambda: "λ", Phi: "Φ", phi: "φ", sigma: "σ", epsilon: "ε", varepsilon: "ε",
  delta: "δ", mu: "μ", omega: "ω", alpha: "α", psi: "ψ", Theta: "Θ", theta: "θ",
  eta: "η", nu: "ν", rho: "ρ", gamma: "γ", Gamma: "Γ",
};
const MATHCAL: Record<string, string> = { D: "𝒟" };

export const DIM = 3;

interface Index { name: string; pos: "up" | "down"; label: boolean }
interface Atom { wl: string; indices: Index[]; op: "*" | "/" }

function sym(name: string): string {
  if (name.startsWith("\\")) { const g = name.slice(1); return GREEK[g] ?? g; }
  return name;
}

function parseIndexContent(content: string, pos: "up" | "down"): Index[] {
  const tm = content.match(/^\\text\{(.*)\}$/);
  if (tm) return [{ name: tm[1], pos, label: true }];
  const out: Index[] = [];
  for (const ch of content) out.push({ name: ch, pos, label: false });
  return out;
}

function readBraces(s: string, j: number): { content: string; next: number } | null {
  if (s[j] !== "{") return null;
  j++;
  let depth = 1; let content = "";
  while (j < s.length && depth > 0) {
    if (s[j] === "{") depth++;
    else if (s[j] === "}") { depth--; if (depth === 0) break; }
    content += s[j]; j++;
  }
  j++;
  return { content, next: j };
}

function parseSymbol(s: string, i: number): { base: string; indices: Index[]; next: number } | null {
  let j = i; let raw = "";
  if (s[j] === "\\") {
    j++;
    while (j < s.length && /[A-Za-z]/.test(s[j])) { raw += s[j]; j++; }
    if (!raw) return null;
    raw = "\\" + raw;
  } else if (s[j] && /[A-Za-z]/.test(s[j])) { raw = s[j]; j++; }
  else return null;
  let base: string;
  if (raw === "\\mathcal") {
    const grp = readBraces(s, j);
    if (!grp) return null;
    base = MATHCAL[grp.content] ?? grp.content;
    j = grp.next;
  } else base = sym(raw);
  const isDelta = raw === "\\delta" || raw === "\\Delta";
  const indices: Index[] = [];
  while (j < s.length && (s[j] === "^" || s[j] === "_")) {
    const pos: "up" | "down" = s[j] === "^" ? "up" : "down"; j++;
    let content = "";
    if (s[j] === "{") { const g = readBraces(s, j); if (!g) break; content = g.content; j = g.next; }
    else if (s[j]) { content = s[j]; j++; }
    indices.push(...parseIndexContent(content, pos));
  }
  if (isDelta && indices.some((x) => !x.label)) base = "KroneckerDelta";
  return { base, indices, next: j };
}

function renderTensor(base: string, indices: Index[]): string {
  const t = indices.filter((x) => !x.label);
  return t.length ? `${base}[${t.map((x) => x.name).join(", ")}]` : base;
}
function renderEntry(base: string, indices: Index[]): string {
  const t = indices.filter((x) => !x.label);
  return base + t.map((x) => x.name).join("");
}

function parseDerivative(s: string, i: number): { atom: Atom; next: number } | null {
  const m = /^\\frac\{\\partial\s+(.*?)\}\{\\partial\s+(.*?)\}/.exec(s.slice(i));
  if (!m) return null;
  const baseP = parseSymbol(m[1], 0);
  const varP = parseSymbol(m[2], 0);
  if (!baseP || !varP) return null;
  const wl = `D[${renderTensor(baseP.base, baseP.indices)}, ${renderTensor(varP.base, varP.indices)}]`;
  return { atom: { wl, indices: [...baseP.indices, ...varP.indices], op: "*" }, next: i + m[0].length };
}

function parseDotted(s: string, i: number): { atom: Atom; next: number } | null {
  const m = /^\\(ddot|dot)\{/.exec(s.slice(i));
  if (!m) return null;
  const order = m[1] === "ddot" ? 2 : 1;
  let j = i + m[0].length;
  const grp = readBraces(s, j - 1);
  if (!grp) return null;
  j = grp.next;
  const base = sym(grp.content.startsWith("\\") ? grp.content : "\\" + grp.content);
  const indices: Index[] = [];
  while (j < s.length && (s[j] === "^" || s[j] === "_")) {
    const pos: "up" | "down" = s[j] === "^" ? "up" : "down"; j++;
    let content = "";
    if (s[j] === "{") { const g = readBraces(s, j); if (!g) break; content = g.content; j = g.next; }
    else if (s[j]) { content = s[j]; j++; }
    indices.push(...parseIndexContent(content, pos));
  }
  const inner = renderTensor(base, indices);
  const wl = order === 1 ? `D[${inner}, t]` : `D[${inner}, {t, 2}]`;
  return { atom: { wl, indices, op: "*" }, next: j };
}

/** Does `s` contain a + or - at top level (depth 0 over () and {})? */
function topLevelHasOp(s: string): boolean {
  let depth = 0;
  for (const c of s) {
    if (c === "(" || c === "{") depth++;
    else if (c === ")" || c === "}") depth--;
    else if (depth === 0 && (c === "+" || c === "-")) return true;
  }
  return false;
}

/** Drop function-call args (parens with no top-level +/-); keep (A+B) groups. */
function stripArgs(s: string): string {
  let out = ""; let i = 0;
  while (i < s.length) {
    if (s[i] === "(") {
      let depth = 1; let j = i + 1; let content = "";
      while (j < s.length && depth > 0) {
        if (s[j] === "(") depth++;
        else if (s[j] === ")") { depth--; if (depth === 0) break; }
        content += s[j]; j++;
      }
      if (topLevelHasOp(content)) out += "(" + content + ")"; // keep group
      i = j + 1;
    } else { out += s[i]; i++; }
  }
  return out.trim();
}

/** Split into top-level terms on + / - (depth-aware over () and {}). */
function splitTerms(s: string): string[] {
  const terms: string[] = []; let cur = ""; let depth = 0;
  for (let k = 0; k < s.length; k++) {
    const c = s[k];
    if (c === "(" || c === "{") { depth++; cur += c; continue; }
    if (c === ")" || c === "}") { depth--; cur += c; continue; }
    if (depth === 0 && (c === "+" || c === "-") && cur.trim() !== "") {
      terms.push(cur.trim()); cur = c === "-" ? "-" : "";
    } else cur += c;
  }
  if (cur.trim()) terms.push(cur.trim());
  return terms;
}

function parseTerm(termStr: string): Atom[] {
  const s = termStr.replace(/\\cdot/g, "*").replace(/\s+/g, " ").trim();
  const atoms: Atom[] = []; let i = 0; let pendingOp: "*" | "/" = "*";
  while (i < s.length) {
    const c = s[i];
    if (c === " " || c === "*") { i++; continue; }
    if (c === "/") { pendingOp = "/"; i++; continue; }
    if (c === "(") {
      const grp = parseGroup(s, i);
      if (grp) { atoms.push({ ...grp.atom, op: pendingOp }); pendingOp = "*"; i = grp.next; continue; }
      i++; continue;
    }
    const dotted = parseDotted(s, i);
    if (dotted) { atoms.push({ ...dotted.atom, op: pendingOp }); pendingOp = "*"; i = dotted.next; continue; }
    const deriv = parseDerivative(s, i);
    if (deriv) { atoms.push({ ...deriv.atom, op: pendingOp }); pendingOp = "*"; i = deriv.next; continue; }
    const symP = parseSymbol(s, i);
    if (symP) { atoms.push({ wl: renderTensor(symP.base, symP.indices), indices: symP.indices, op: pendingOp }); pendingOp = "*"; i = symP.next; continue; }
    i++;
  }
  return atoms;
}

/** Parse a (A + B) group: returns an atom whose indices are the group's FREE set. */
function parseGroup(s: string, i: number): { atom: Atom; next: number } | null {
  if (s[i] !== "(") return null;
  let j = i + 1; let depth = 1; let content = "";
  while (j < s.length && depth > 0) {
    if (s[j] === "(") depth++;
    else if (s[j] === ")") { depth--; if (depth === 0) break; }
    content += s[j]; j++;
  }
  if (depth !== 0) return null;
  j++;
  const subs = splitTerms(content).map(renderTermString);
  const wl = "(" + subs.map((r) => r.wl).join(" + ").replace(/\+ -/g, "- ") + ")";
  const freeSet = new Set<string>();
  for (const r of subs) for (const f of r.free) freeSet.add(f);
  const indices: Index[] = [...freeSet].map((name) => ({ name, pos: "down" as const, label: false }));
  return { atom: { wl, indices, op: "*" }, next: j };
}

function classifyIndices(indices: Index[]): { dummies: string[]; free: string[] } {
  const counts = new Map<string, number>();
  for (const idx of indices) { if (idx.label) continue; counts.set(idx.name, (counts.get(idx.name) ?? 0) + 1); }
  const dummies: string[] = []; const free: string[] = [];
  for (const [name, n] of counts) { if (n === 2) dummies.push(name); else if (n === 1) free.push(name); }
  return { dummies, free };
}

function renderTerm(atoms: Atom[]): { wl: string; free: string[] } {
  if (atoms.length === 0) return { wl: "", free: [] };
  let product = atoms[0].wl;
  for (let k = 1; k < atoms.length; k++) product += atoms[k].op + atoms[k].wl;
  const { dummies, free } = classifyIndices(atoms.flatMap((a) => a.indices));
  let out = product;
  for (const d of dummies) out = `Sum[${out}, {${d}, 1, ${DIM}}]`;
  return { wl: out, free };
}

/** Render a single term string (with optional leading sign) -> {wl, free}. */
function renderTermString(termStr: string): { wl: string; free: string[] } {
  const t = termStr.trim();
  if (!t) return { wl: "", free: [] };
  const sign = t.startsWith("-") ? "-" : "";
  const body = t.replace(/^[+-]/, "").trim();
  const atoms = parseTerm(body);
  if (atoms.length === 0) return { wl: sign + body, free: [] };
  const r = renderTerm(atoms);
  return { wl: sign + r.wl, free: r.free };
}

function translateIndexEquation(latex: string): string {
  const noArgs = stripArgs(latex);
  const [lhsRaw, ...rhsParts] = noArgs.split("=");
  const rhsRaw = rhsParts.join("=").trim();
  const lhsWl = renderTermString(lhsRaw).wl || lhsRaw.trim();

  const intM = /^\\int\s+(.*?)\s+d(\\[A-Za-z]+|[A-Za-z])\s*$/.exec(rhsRaw);
  if (intM) {
    const v = sym(intM[2].startsWith("\\") ? intM[2] : "\\" + intM[2]);
    const bodyWl = renderTerm(parseTerm(intM[1])).wl;
    return `${lhsWl} == Integrate[${bodyWl}, ${v}]`;
  }

  const renderedTerms = splitTerms(rhsRaw).map(renderTermString).map((r) => r.wl).filter((w) => w);
  return `${lhsWl} == ${renderedTerms.join(" + ").replace(/\+ -/g, "- ")}`;
}

function translateMatrixEquation(latex: string): string {
  const m = latex.match(/^(.*?)=.*?\\begin\{pmatrix\}([\s\S]*?)\\end\{pmatrix\}/);
  if (!m) throw new Error("No pmatrix found");
  const lhsP = parseSymbol(m[1].trim(), 0);
  const lhs = lhsP ? lhsP.base : m[1].trim();
  const rows = m[2].split("\\\\").map((r) => r.trim()).filter(Boolean);
  const wlRows = rows.map((row) => {
    const cells = row.split("&").map((c) => c.trim());
    return `{${cells.map((c) => { const p = parseSymbol(c, 0); return p ? renderEntry(p.base, p.indices) : c; }).join(", ")}}`;
  });
  return `${lhs} == {${wlRows.join(", ")}}`;
}

export function translate(latex: string): string {
  let l = latex.trim().replace(/^\${1,2}/, "").replace(/\${1,2}$/, "").trim();
  l = l.replace(/\\,/g, " ");
  if (l.includes("\\begin{pmatrix}")) return translateMatrixEquation(l);
  return translateIndexEquation(l);
}

export function freeIndices(latex: string): string[] {
  const l = latex.replace(/^\${1,2}/, "").replace(/\${1,2}$/, "").replace(/\\,/g, " ").trim();
  const noArgs = stripArgs(l);
  const [lhsRaw, ...rhsParts] = noArgs.split("=");
  const rhsRaw = rhsParts.join("=").trim();
  const lhsFree = renderTermString(lhsRaw).free;
  const rhsFree = new Set<string>();
  for (const term of splitTerms(rhsRaw)) for (const f of renderTermString(term).free) rhsFree.add(f);
  return [...new Set([...lhsFree, ...rhsFree])];
}

export function indexConsistent(latex: string): boolean {
  const l = latex.replace(/^\${1,2}/, "").replace(/\${1,2}$/, "").replace(/\\,/g, " ").trim();
  const noArgs = stripArgs(l);
  const eq = noArgs.split("=");
  if (eq.length < 2) return true;
  const lhsRaw = eq[0];
  const rhsRaw = eq.slice(1).join("=").trim();
  const lhsFree = new Set(renderTermString(lhsRaw).free);
  const rhsFree = new Set<string>();
  let rhsHasAtoms = false;
  for (const term of splitTerms(rhsRaw)) {
    const body = term.replace(/^[+-]/, "").trim();
    if (parseTerm(body).length > 0) { rhsHasAtoms = true; for (const f of renderTermString(term).free) rhsFree.add(f); }
  }
  if (!rhsHasAtoms) return true;
  if (lhsFree.size !== rhsFree.size) return false;
  return [...lhsFree].every((x) => rhsFree.has(x));
}
