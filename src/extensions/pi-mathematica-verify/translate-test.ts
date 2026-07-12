/**
 * Phase 1 translator validation.
 * Real equations from pob/briefs/2026-06-26-staved-finger.md.
 * Run: bun run src/extensions/pi-mathematica-verify/translate-test.ts
 */
import { translate, freeIndices } from "./translator.ts";

interface Case { name: string; latex: string; expected: string }

const cases: Case[] = [
  {
    name: "Jacobian definition (Lagrangian)",
    latex: String.raw`J^i_a = \frac{\partial x^i}{\partial q^a}`,
    expected: "J[i, a] == D[x[i], q[a]]",
  },
  {
    name: "Pullback — Einstein summation (Lagrangian)",
    latex: String.raw`\tau_a = J^i_a F_i`,
    expected: "τ[a] == Sum[J[i, a]*F[i], {i, 1, 3}]",
  },
  {
    name: "d'Alembert — two summed terms (Lagrangian)",
    latex: String.raw`Q_a = J^i_a F_i + \lambda_i \frac{\partial \Phi^i}{\partial q^a}`,
    expected: "Q[a] == Sum[J[i, a]*F[i], {i, 1, 3}] + Sum[λ[i]*D[Φ[i], q[a]], {i, 1, 3}]",
  },
  {
    name: "Holonomic constraint with text-label args (Lagrangian)",
    latex: String.raw`\Phi^i(q^{\text{left}}, q^{\text{right}}) = 0`,
    expected: "Φ[i] == 0",
  },
  {
    name: "Cauchy stress matrix (Continuum)",
    latex: String.raw`\sigma^{ij} = \begin{pmatrix} \sigma^{11} & \sigma^{12} & \sigma^{13} \\ \sigma^{21} & \sigma^{22} & \sigma^{23} \\ \sigma^{31} & \sigma^{32} & \sigma^{33} \end{pmatrix}`,
    expected: "σ == {{σ11, σ12, σ13}, {σ21, σ22, σ23}, {σ31, σ32, σ33}}",
  },
  {
    name: "Constitutive relation — double Einstein summation",
    latex: String.raw`\sigma_{ij} = C_{ijkl}\,\varepsilon_{kl}`,
    expected: "σ[i, j] == Sum[Sum[C[i, j, k, l]*ε[k, l], {k, 1, 3}], {l, 1, 3}]",
  },
  {
    name: "Energy dissipation — integral + time derivative + double sum",
    latex: String.raw`\mathcal{D}=\int \sigma_{ij}\dot{\varepsilon}_{ij}\,dV`,
    expected: "𝒟 == Integrate[Sum[Sum[σ[i, j]*D[ε[i, j], t], {i, 1, 3}], {j, 1, 3}], V]",
  },
  {
    name: "Entropy production — time derivative + division",
    latex: String.raw`\dot{S} = \mathcal{D}/T`,
    expected: "D[S, t] == 𝒟/T",
  },
  {
    name: "Muscle work — volume-free integral",
    latex: String.raw`W = \int \tau\,d\theta`,
    expected: "W == Integrate[τ, θ]",
  },
  {
    name: "Isotropic elasticity — Kronecker delta + parenthesised group",
    latex: String.raw`C_{ijkl}=\lambda\delta_{ij}\delta_{kl}+\mu(\delta_{ik}\delta_{jl}+\delta_{il}\delta_{jk})`,
    expected: "C[i, j, k, l] == λ*KroneckerDelta[i, j]*KroneckerDelta[k, l] + μ*(KroneckerDelta[i, k]*KroneckerDelta[j, l] + KroneckerDelta[i, l]*KroneckerDelta[j, k])",
  },
];

const norm = (s: string) => s.replace(/\s+/g, " ").trim();

let pass = 0;
console.log("=== Phase 1 translator: real-equation validation ===\n");
for (const c of cases) {
  let actual: string;
  try {
    actual = translate(c.latex);
  } catch (e) {
    actual = `THREW: ${(e as Error).message}`;
  }
  const ok = norm(actual) === norm(c.expected);
  if (ok) pass++;
  console.log(`[${ok ? "PASS" : "FAIL"}] ${c.name}`);
  console.log(`  latex   : ${c.latex}`);
  console.log(`  expected: ${c.expected}`);
  console.log(`  actual  : ${actual}`);
  if (!c.name.includes("matrix")) {
    console.log(`  free idx: [${freeIndices(c.latex).join(", ")}]`);
  }
  console.log();
}
console.log(`${pass}/${cases.length} passed\n`);

// ---- Oracle notes ----
// WA-web (free) is a SINGLE-EXPRESSION NLU engine, not a WL kernel. Two limits hit:
//   1. Bare symbols get hijacked (J -> BesselJ, i -> imaginary I).
//   2. NO multi-statement WL: assignments + comparison return "doesn't understand".
//      (The earlier J/F pullback only "parsed" because WA mangled J into BesselJ.)
// => WA-web validates single self-contained expressions only. Multi-statement
//    identity checks (the pullback) need a real kernel: local Mathematica v10.0 or
//    the Cloud API runtime, where J/i are plain symbols and assignments work.
// The translator's symbolic output (J[i,a], F[i]) is correct WL for the kernel.

console.log("=== WA-web: single-expression definitional checks ===\n");
console.log("// [verified 2026-07-09] eigenvalues of uniaxial stress -> not all equal -> not hydrostatic");
console.log("Eigenvalues[{{-p,0,0},{0,0,0},{0,0,0}}]                  // -> {-p,0,0}\n");
console.log("// [verified 2026-07-09] deviatoric part -> non-zero -> not hydrostatic");
console.log("{{-p,0,0},{0,0,0},{0,0,0}} - Tr[{{-p,0,0},{0,0,0},{0,0,0}}]/3 * IdentityMatrix[3]\n");
console.log("// hydrostatic assertion, single expression (WA-safe): expected False");
console.log("{{-p,0,0},{0,0,0},{0,0,0}} == -p IdentityMatrix[3]\n");

console.log("=== Kernel-only (local v10.0 or Cloud API): multi-statement identity ===\n");
console.log("// Pullback: translator's Sum form == J^T F. Needs a real kernel (assignments).");
console.log("mat = {{1,2,3},{4,5,6},{7,8,9}}; vec = {2,3,5};");
console.log("Table[Sum[mat[[k,m]]*vec[[k]], {k,1,3}], {m,1,3}] == Transpose[mat].vec   // -> True");
