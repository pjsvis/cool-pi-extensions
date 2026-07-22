// pi-eval matrix — primed-vs-bare delta. Runs both conditions, shows the delta.
// Replaces the bash matrix/matrix-grade/matrix-triangular commands in eval.sh.
//
// Modes:
//   default          — keyword scorer delta (primed − bare)
//   --grade          — structured reasoning grader delta (reasoning quality)
//   --triangular     — second grader, compared with the first for agreement

import { defineCommand } from "citty";
import {
  allModels,
  evaluateModel,
  persistResults,
  MAX_TOTAL,
  SCORING_SYSTEM,
  BARE_SYSTEM,
  type ScoreResult,
} from "../lib/scoring.js";
import { DEFAULT_REASONING_GRADER_MODEL, DEFAULT_REASONING_GRADER_PROVIDER } from "../lib/grading.js";

const CYAN = "\x1b[0;36m", GREEN = "\x1b[0;32m", YELLOW = "\x1b[1;33m",
  RED = "\x1b[0;31m", DIM = "\x1b[2m", RESET = "\x1b[0m";

export const matrixCommand = defineCommand({
  meta: {
    name: "matrix",
    description: "Run primed-vs-bare delta matrix (keyword scorer + optional reasoning grader)",
  },
  args: {
    filter: {
      type: "positional",
      description: "Comma-separated model tags (or 'all'). Defaults to 'kimi'.",
      required: false,
    },
    grade: {
      type: "boolean",
      description: "Use structured reasoning grader (not keyword scorer) for the delta",
      default: false,
    },
    triangular: {
      type: "boolean",
      description: "Run a second grader and compare delta directions for agreement",
      default: false,
    },
    grader: {
      type: "string",
      description: "Primary grader model",
      default: DEFAULT_REASONING_GRADER_MODEL,
    },
    "grader-provider": {
      type: "string",
      alias: "graderProvider",
      description: "Primary grader provider: zenmux or openrouter",
      default: DEFAULT_REASONING_GRADER_PROVIDER,
    },
    "second-grader": {
      type: "string",
      alias: "secondGrader",
      description: "Second grader model (for --triangular). Default: google/gemini-2.5-pro",
      default: "google/gemini-2.5-pro",
    },
    "second-grader-provider": {
      type: "string",
      alias: "secondGraderProvider",
      description: "Second grader provider",
      default: "zenmux",
    },
    persist: {
      type: "boolean",
      description: "Persist results to data/ JSONL files",
      default: false,
    },
    "grade-tag": {
      type: "string",
      alias: "gradeTag",
      description: "Tag for graded output file (e.g. 'gemini')",
      default: "",
    },
  },
  async run({ args }) {
    const all = allModels();
    let models = all;

    if (args.filter && args.filter !== "all") {
      const tags = String(args.filter).toLowerCase().split(",").map((s) => s.trim());
      models = all.filter((m) => tags.some((t) => m.tag.includes(t)));
      if (models.length === 0) {
        console.error(`${RED}No models match: ${args.filter}${RESET}`);
        console.error(`Available: ${all.map((m) => m.tag).join(", ")}`);
        process.exit(2);
      }
    } else if (!args.filter) {
      models = all.filter((m) => m.tag.includes("kimi"));
      if (models.length === 0) models = all;
    }

    const mode = args.triangular ? "triangular" : args.grade ? "graded" : "keyword";
    const label = mode === "triangular"
      ? `Triangular: ${args.grader} vs ${args.secondGrader}`
      : mode === "graded"
        ? `Graded delta (reasoning quality, max 16)`
        : `Keyword scorer delta (max ${MAX_TOTAL})`;

    console.log(`\n${CYAN}=== Edinburgh Protocol Delta Matrix ===${RESET}`);
    console.log(`${DIM}${label}${RESET}`);
    console.log(`${DIM}Running primed (with Protocol) + bare (without) to measure delta${RESET}\n`);

    // ── Phase 1: Primed ──────────────────────────────────────────────────
    console.log(`${CYAN}── Phase 1: Primed (Edinburgh Protocol active) ──${RESET}`);
    const primedResults: ScoreResult[] = [];
    for (let i = 0; i < models.length; i++) {
      const m = models[i];
      process.stderr.write(`  [${i + 1}/${models.length}] ${m.tag.padEnd(18)} `);
      const r = await evaluateModel(m, SCORING_SYSTEM, args.grade || args.triangular, "primed", args.grader, args.graderProvider);
      primedResults.push(r);
      printResultLine(r, args.grade || args.triangular);
      if ((args.grade || args.triangular) && i < models.length - 1)
        await new Promise((r) => setTimeout(r, 500));
    }

    // ── Phase 2: Bare ────────────────────────────────────────────────────
    console.log(`\n${CYAN}── Phase 2: Bare (no Protocol — substrate only) ──${RESET}`);
    if (args.grade || args.triangular) {
      console.log(`${DIM}  (pausing 5s to let grader rate limits reset)${RESET}`);
      await new Promise((r) => setTimeout(r, 5000));
    }
    const bareResults: ScoreResult[] = [];
    for (let i = 0; i < models.length; i++) {
      const m = models[i];
      process.stderr.write(`  [${i + 1}/${models.length}] ${m.tag.padEnd(18)} `);
      const r = await evaluateModel(m, BARE_SYSTEM, args.grade || args.triangular, "bare", args.grader, args.graderProvider);
      bareResults.push(r);
      printResultLine(r, args.grade || args.triangular);
      if ((args.grade || args.triangular) && i < models.length - 1)
        await new Promise((r) => setTimeout(r, 500));
    }

    // ── Triangular: second grader on both conditions ─────────────────────
    let primed2: ScoreResult[] = [];
    let bare2: ScoreResult[] = [];
    if (args.triangular) {
      console.log(`\n${CYAN}── Phase 3: Second grader (${args.secondGrader}) ──${RESET}`);
      const gradeTag2 = args.gradeTag || "gemini";

      console.log(`${DIM}  Primed with second grader…${RESET}`);
      for (let i = 0; i < models.length; i++) {
        const m = models[i];
        process.stderr.write(`  [${i + 1}/${models.length}] ${m.tag.padEnd(18)} `);
        const r = await evaluateModel(m, SCORING_SYSTEM, true, "primed", args.secondGrader, args.secondGraderProvider);
        primed2.push(r);
        printResultLine(r, true);
        if (i < models.length - 1) await new Promise((r) => setTimeout(r, 500));
      }

      console.log(`\n${DIM}  Bare with second grader… (pausing 5s)${RESET}`);
      await new Promise((r) => setTimeout(r, 5000));
      for (let i = 0; i < models.length; i++) {
        const m = models[i];
        process.stderr.write(`  [${i + 1}/${models.length}] ${m.tag.padEnd(18)} `);
        const r = await evaluateModel(m, BARE_SYSTEM, true, "bare", args.secondGrader, args.secondGraderProvider);
        bare2.push(r);
        printResultLine(r, true);
        if (i < models.length - 1) await new Promise((r) => setTimeout(r, 500));
      }

      // Persist second-grader results
      if (args.persist) {
        persistResults(primed2, "primed", true, args.gradeTag || "gemini", args.secondGrader, args.secondGraderProvider);
        persistResults(bare2, "bare", true, args.gradeTag || "gemini", args.secondGrader, args.secondGraderProvider);
      }
    }

    // ── Persist first-grader results ─────────────────────────────────────
    if (args.persist) {
      persistResults(primedResults, "primed", args.grade || args.triangular, args.gradeTag, args.grader, args.graderProvider);
      persistResults(bareResults, "bare", args.grade || args.triangular, args.gradeTag, args.grader, args.graderProvider);
    }

    // ── Delta matrix ─────────────────────────────────────────────────────
    console.log(`\n${CYAN}=== Delta Matrix ===${RESET}\n`);

    if (mode === "keyword") {
      printKeywordDelta(primedResults, bareResults);
    } else if (mode === "graded") {
      printGradedDelta(primedResults, bareResults);
    } else {
      printTriangularDelta(primedResults, bareResults, primed2, bare2, args.grader, args.secondGrader);
    }
  },
});

// ── Helpers ─────────────────────────────────────────────────────────────────

function printResultLine(r: ScoreResult, graded: boolean): void {
  if (r.error) {
    process.stderr.write(`${RED}✗ ${r.error}${RESET}\n`);
    return;
  }
  const color = r.total >= 14 ? GREEN : r.total >= 10 ? YELLOW : RED;
  if (graded) {
    const gColor = r.gradeStatus === "graded"
      ? (r.grade!.total >= 12 ? GREEN : r.grade!.total >= 8 ? YELLOW : RED)
      : DIM;
    const gStr = r.grade ? `${gColor}${r.grade.total}/16${RESET}` : `${DIM}${r.gradeStatus}${RESET}`;
    process.stderr.write(`${color}${r.total}/${MAX_TOTAL}${RESET} kw | grade ${gStr} (${r.ms}ms)\n`);
  } else {
    process.stderr.write(`${color}${r.total}/${MAX_TOTAL}${RESET} (${r.ms}ms)\n`);
  }
}

function printKeywordDelta(primed: ScoreResult[], bare: ScoreResult[]): void {
  printf("  %-20s %6s %6s %8s %s\n", "Model", "Primed", "Bare", "Delta", "Verdict");
  console.log("  " + "─".repeat(60));

  for (const p of primed) {
    const b = bare.find((r) => r.tag === p.tag);
    if (!b) continue;
    const pTotal = p.error ? "ERR" : String(p.total);
    const bTotal = b.error ? "ERR" : String(b.total);
    let delta = "—";
    let verdictStr = `${DIM}error${RESET}`;
    if (p.error || b.error) {
      // leave defaults
    } else {
      const diff = p.total - b.total;
      delta = diff > 0 ? `+${diff}` : diff === 0 ? " 0" : String(diff);
      verdictStr = diff > 0 ? `${GREEN}protocol helps${RESET}`
        : diff === 0 ? `${YELLOW}no effect${RESET}`
          : `${RED}protocol hurts${RESET}`;
    }
    printf("  %-20s %6s %6s %8s %b\n", p.tag, pTotal, bTotal, delta, verdictStr);
  }

  console.log("");
  console.log(`${DIM}Delta = primed − bare. Positive = Edinburgh Protocol adds value.${RESET}`);
  console.log(`${DIM}Zero or negative = protocol is ceremony, not anti-entropy.${RESET}`);
}

function printGradedDelta(primed: ScoreResult[], bare: ScoreResult[]): void {
  printf("  %-20s %6s %6s %8s %6s %s\n", "Model", "Primed", "Bare", "Delta", "KW-Δ", "Verdict");
  console.log("  " + "─".repeat(64));

  for (const p of primed) {
    const b = bare.find((r) => r.tag === p.tag);
    if (!b) continue;
    const pGrade = p.grade?.total ?? "ERR";
    const bGrade = b.grade?.total ?? "ERR";
    let delta = "—";
    let verdictStr = `${DIM}error${RESET}`;
    if (p.error || b.error || p.gradeStatus !== "graded" || b.gradeStatus !== "graded") {
      // leave defaults
    } else {
      const diff = (p.grade?.total ?? 0) - (b.grade?.total ?? 0);
      delta = diff > 0 ? `+${diff}` : diff === 0 ? " 0" : String(diff);
      verdictStr = diff > 0 ? `${GREEN}protocol helps${RESET}`
        : diff === 0 ? `${YELLOW}no effect${RESET}`
          : `${RED}protocol hurts${RESET}`;
    }
    // Keyword delta for comparison
    let kwDelta = "—";
    if (!p.error && !b.error) {
      const kwDiff = p.total - b.total;
      kwDelta = kwDiff > 0 ? `+${kwDiff}` : kwDiff === 0 ? " 0" : String(kwDiff);
    }
    printf("  %-20s %6s %6s %8s %6s %b\n", p.tag, pGrade, bGrade, delta, kwDelta, verdictStr);
  }

  console.log("");
  console.log(`${DIM}Grade delta = primed − bare (reasoning quality, max 16). KW-Δ = keyword scorer delta (max ${MAX_TOTAL}).${RESET}`);
  console.log(`${DIM}If grade delta > keyword delta, the protocol produces better reasoning than format suggests.${RESET}`);
}

function printTriangularDelta(
  primed: ScoreResult[], bare: ScoreResult[],
  primed2: ScoreResult[], bare2: ScoreResult[],
  grader1: string, grader2: string,
): void {
  printf("  %-20s %6s %6s %8s  %6s %6s %8s  %s\n",
    "Model", "P(g1)", "B(g1)", "G1-Δ", "P(g2)", "B(g2)", "G2-Δ", "Agreement");
  console.log("  " + "─".repeat(72));

  for (const p of primed) {
    const b = bare.find((r) => r.tag === p.tag);
    const p2 = primed2.find((r) => r.tag === p.tag);
    const b2 = bare2.find((r) => r.tag === p.tag);
    if (!b || !p2 || !b2) continue;

    const g1p = p.grade?.total ?? "ERR";
    const g1b = b.grade?.total ?? "ERR";
    const g2p = p2.grade?.total ?? "ERR";
    const g2b = b2.grade?.total ?? "ERR";

    const g1Delta = computeDelta(p.grade?.total, b.grade?.total);
    const g2Delta = computeDelta(p2.grade?.total, b2.grade?.total);

    let agreement = `${DIM}incomplete${RESET}`;
    if (g1Delta !== "—" && g2Delta !== "—") {
      if (g1Delta === g2Delta) agreement = `${GREEN}exact${RESET}`;
      else if (g1Delta === "+0" || g2Delta === "+0") agreement = `${YELLOW}borderline${RESET}`;
      else if (g1Delta.includes("+") && g2Delta.includes("+")) agreement = `${GREEN}same direction${RESET}`;
      else if (g1Delta.includes("-") && g2Delta.includes("-")) agreement = `${GREEN}same direction${RESET}`;
      else agreement = `${RED}DISAGREE${RESET}`;
    }

    printf("  %-20s %6s %6s %8s  %6s %6s %8s  %b\n",
      p.tag, g1p, g1b, g1Delta, g2p, g2b, g2Delta, agreement);
  }

  console.log("");
  console.log(`${DIM}G1 = ${grader1}  |  G2 = ${grader2}${RESET}`);
  console.log(`${DIM}Agreement = both graders see same delta direction. DISAGREE = one positive, one negative.${RESET}`);
}

function computeDelta(p: number | undefined, b: number | undefined): string {
  if (p === undefined || b === undefined) return "—";
  const diff = p - b;
  return diff > 0 ? `+${diff}` : diff === 0 ? " 0" : String(diff);
}

// printf with %b for ANSI-safe strings — handles width specs.
// %b = ANSI-safe (width counted on visible text only)
function printf(fmt: string, ...args: unknown[]): void {
  let i = 0;
  const out = fmt.replace(/%([-+#0 ]*)(\d+)?(?:\.(\d+))?([sbdxo])/g, (_match, flags, widthStr, _prec, spec) => {
    const val = args[i++];
    const width = widthStr ? parseInt(widthStr, 10) : 0;
    const leftJustify = flags.includes("-");

    // For %b, strip ANSI for width calculation but keep the colored string
    if (spec === "b") {
      const str = String(val);
      const visibleLen = str.replace(/\x1b\[[0-9;]*m/g, "").length;
      const pad = Math.max(0, width - visibleLen);
      return leftJustify ? str + " ".repeat(pad) : " ".repeat(pad) + str;
    }

    let str: string;
    if (spec === "s") str = String(val);
    else if (spec === "d" || spec === "x" || spec === "o") str = String(Math.trunc(Number(val) || 0));
    else str = String(val);

    const pad = Math.max(0, width - str.length);
    return leftJustify ? str + " ".repeat(pad) : " ".repeat(pad) + str;
  });
  console.log(out);
}
