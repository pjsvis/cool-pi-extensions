/**
 * Registry demo: lookup-first resolution + drift + parser fallback + multi-nth.
 * Run: bun run src/extensions/pi-mathematica-verify/resolve-test.ts
 */
import { loadRegistry, resolve, runLocalAssertions, hashLatex } from "./registry.ts";

const reg = loadRegistry();
console.log(`=== Registry loaded: ${reg.length} equations ===\n`);

console.log("--- 1. Lookup-first for each curated equation (expect registry hit, not stale) ---");
for (const e of reg) {
  const r = resolve(reg, e.file, e.line, e.nth, e.latex);
  const local = runLocalAssertions(e.latex, r.assertions);
  console.log(`[${r.source}${r.stale ? " STALE" : ""}] ${e.id} (line ${e.line}, nth ${e.nth})`);
  console.log(`  wl       : ${r.wl}`);
  console.log(`  assertions: ${JSON.stringify(r.assertions)} -> ${JSON.stringify(local)}`);
  console.log();
}

console.log("--- 2. Multi-equation-per-line: line 102 has 3 equations (nth 0/1/2) ---");
const taFile = "pob/briefs/2026-06-26-staved-finger-tensor-algebra.md";
for (const nth of [0, 1, 2]) {
  const entry = reg.find((e) => e.file === taFile && e.line === 102 && e.nth === nth)!;
  const r = resolve(reg, taFile, 102, nth, entry.latex);
  console.log(`  nth ${nth}: ${entry.id} -> ${r.wl}`);
}
console.log();

console.log("--- 3. Drift simulation: author edits tensor-algebra#1 (x^i -> y^i), same loc ---");
const e1 = reg.find((e) => e.id === "tensor-algebra#1")!;
const drifted = "\\sigma_{ij} = C_{ijkl}\\,\\varepsilon_{kl}"; // unchanged — control
const driftedBad = "\\sigma_{ij} = C_{ijkl}\\,\\psi_{kl}"; // eps -> psi: drift
const rCtrl = resolve(reg, e1.file, e1.line, e1.nth, drifted);
const rDrift = resolve(reg, e1.file, e1.line, e1.nth, driftedBad);
console.log(`control (unchanged): stale=${rCtrl.stale}`);
console.log(`drifted (eps->psi):  stale=${rDrift.stale}  ${rDrift.stale ? "DRIFT DETECTED" : "BUG"}`);
console.log();

console.log("--- 4. Miss: unregistered equation -> parser fallback (bootstrap) ---");
const novel = "A_a = B^i_a C_i";
const r3 = resolve(reg, "pob/briefs/some-other.md", 999, 0, novel);
console.log(`input  : ${novel}`);
console.log(`source : ${r3.source}  status: ${r3.status}`);
console.log(`wl     : ${r3.wl}\n`);

console.log("--- Summary ---");
const hits = reg.filter((e) => resolve(reg, e.file, e.line, e.nth, e.latex).source === "registry" && !resolve(reg, e.file, e.line, e.nth, e.latex).stale).length;
console.log(`registry hits: ${hits}/${reg.length}`);
console.log(`multi-nth line 102: 3 distinct entries resolved -> ${reg.filter((e) => e.line === 102).length === 3 ? "WORKING" : "BUG"}`);
console.log(`drift detection: ${rDrift.stale ? "WORKING" : "BROKEN"}`);
console.log(`parser fallback: ${r3.source === "parser-fallback" ? "WORKING" : "BROKEN"}`);
