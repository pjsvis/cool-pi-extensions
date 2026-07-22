// pi-eval score — keyword-based alignment scoring against the Edinburgh Protocol.
// Absorbs src/cli/pi-check/edinburgh-eval.ts.

import { defineCommand } from "citty";
import {
  allModels,
  evaluateModel,
  persistResults,
  verdict,
  CRITERIA,
  MAX_TOTAL,
  SCORING_SYSTEM,
  BARE_SYSTEM,
  type ScoreResult,
} from "../lib/scoring.js";
import { DEFAULT_REASONING_GRADER_MODEL, DEFAULT_REASONING_GRADER_PROVIDER } from "../lib/grading.js";

const CYAN = "\x1b[0;36m", GREEN = "\x1b[0;32m", YELLOW = "\x1b[1;33m",
  RED = "\x1b[0;31m", DIM = "\x1b[2m", RESET = "\x1b[0m";

export const scoreCommand = defineCommand({
  meta: {
    name: "score",
    description: "Score model alignment with the Edinburgh Protocol (keyword + optional reasoning grader)",
  },
  args: {
    filter: {
      type: "positional",
      description: "Comma-separated model tags to test (or 'all'). Defaults to 'kimi'.",
      required: false,
    },
    json: {
      type: "boolean",
      description: "Machine-readable JSON output",
      default: false,
    },
    bare: {
      type: "boolean",
      description: "Bare-substrate control (no Edinburgh Protocol system prompt)",
      default: false,
    },
    persist: {
      type: "boolean",
      description: "Append results to data/scoring_matrix.jsonl",
      default: false,
    },
    grade: {
      type: "boolean",
      description: "Grade each response with structured reasoning grader",
      default: false,
    },
    grader: {
      type: "string",
      description: "Grader model",
      default: DEFAULT_REASONING_GRADER_MODEL,
    },
    "grader-provider": {
      type: "string",
      alias: "graderProvider",
      description: "Grader provider: zenmux or openrouter",
      default: DEFAULT_REASONING_GRADER_PROVIDER,
    },
    "grade-tag": {
      type: "string",
      alias: "gradeTag",
      description: "Tag for graded output file (e.g. 'gemini' → graded_matrix_gemini.jsonl)",
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
      // Default to kimi models
      models = all.filter((m) => m.tag.includes("kimi"));
      if (models.length === 0) models = all;
    }

    const systemPrompt = args.bare ? BARE_SYSTEM : SCORING_SYSTEM;
    const condition = args.bare ? "bare" : "primed";

    // Run
    const results: ScoreResult[] = [];
    const total = models.length;
    for (let i = 0; i < models.length; i++) {
      const m = models[i];
      process.stderr.write(`  [${i + 1}/${total}] ${m.tag.padEnd(18)} `);
      const r = await evaluateModel(m, systemPrompt, args.grade, condition, args.grader, args.graderProvider);
      results.push(r);
      if (r.error) {
        process.stderr.write(`${RED}✗ ${r.error}${RESET}\n`);
      } else {
        const color = r.total >= 14 ? GREEN : r.total >= 10 ? YELLOW : RED;
        if (args.grade) {
          const gColor = r.gradeStatus === "graded"
            ? (r.grade!.total >= 12 ? GREEN : r.grade!.total >= 8 ? YELLOW : RED)
            : DIM;
          const gStr = r.grade ? `${gColor}${r.grade.total}/16${RESET}` : `${DIM}${r.gradeStatus}${RESET}`;
          process.stderr.write(`${color}${r.total}/${MAX_TOTAL}${RESET} kw | grade ${gStr} (${r.ms}ms)\n`);
        } else {
          process.stderr.write(`${color}${r.total}/${MAX_TOTAL}${RESET} (${r.ms}ms)\n`);
        }
      }
      if (args.grade && i < models.length - 1) {
        await new Promise((r) => setTimeout(r, 500));
      }
    }

    // Persist
    if (args.persist) {
      persistResults(results, condition, args.grade, args.gradeTag, args.grader, args.graderProvider);
    }

    // Sort by score
    results.sort((a, b) => b.total - a.total);

    if (args.json) {
      console.log(JSON.stringify(results, null, 2));
      return;
    }

    // Pretty terminal output
    console.log("");
    console.log(`${CYAN}  Edinburgh Protocol Eval — ${results.length} models${RESET}`);
    console.log(`  ${DIM}Maximum score: ${MAX_TOTAL}pts across 8 criteria${RESET}`);
    console.log("");

    const headers = ["Model", "Score", "Systems", "Hume", "Spectator", "Structure", "Wit", "Practical", "Anti-Dogma", "Silo", "Tokens", "Time", "Verdict"];
    const widths   = [18, 7, 9, 6, 9, 9, 5, 9, 9, 5, 8, 7, 40];

    console.log("  " + headers.map((h, i) => h.padEnd(widths[i]).slice(0, widths[i])).join(" "));
    console.log("  " + widths.map((w) => "─".repeat(w)).join(" "));

    for (const r of results) {
      const s = r.scores;
      const sc = r.error ? RED : r.total >= 14 ? GREEN : r.total >= 10 ? YELLOW : DIM;
      const tierMarker = r.tier === "free" ? " 🆓" : r.tier === "budget" ? " 💰" : r.tier === "premium" ? " 💎" : "";
      const cells = [
        r.tag + tierMarker,
        r.error ? `${RED}ERR${RESET}` : `${sc}${String(r.total).padStart(2)}/${MAX_TOTAL}${RESET}`,
        String(s.systemsOverVillains || "—"), String(s.humesRazor || "—"),
        String(s.impartialSpectator || "—"), String(s.stuffIntoThings || "—"),
        String(s.dryWit || "—"), String(s.practicality || "—"),
        String(s.antiDogma || "—"), String(s.refusal || "—"),
        String(r.totalTokens), `${r.ms}ms`,
        r.error ? `${RED}${r.error.slice(0, 37)}${RESET}` : verdict(r.total),
      ];
      console.log("  " + cells.map((c, i) => String(c).padEnd(widths[i]).slice(0, widths[i])).join(" "));
    }

    console.log("");
    console.log(`  ${DIM}💎 premium  💰 budget  🆓 free${RESET}`);
    console.log("");

    // Show best 3 responses
    const top = results.filter((r) => !r.error).slice(0, 3);
    for (const r of top) {
      console.log(`${GREEN}  ${r.tag} (${r.total}/${MAX_TOTAL}) — ${r.cost} ${r.tier}${RESET}`);
      console.log(`  ${DIM}${"─".repeat(60)}${RESET}`);
      console.log(r.response.split("\n").slice(0, 12).map((l) => `  ${DIM}│${RESET} ${l}`).join("\n"));
      if (r.response.split("\n").length > 12) console.log(`  ${DIM}│ ... (${r.totalTokens} tokens total)${RESET}`);
      console.log(`  ${DIM}${"─".repeat(60)}${RESET}`);
      console.log("");
    }
  },
});
