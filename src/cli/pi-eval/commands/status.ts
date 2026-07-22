// pi-eval status — show cached eval results from data/eval_log.json.

import { defineCommand } from "citty";
import {
  loadConfig,
  loadFixture,
  readResults,
  buildSuiteResult,
  type EvalSuiteResult,
  type TestResult,
} from "../lib/index.js";

const GREEN = "\x1b[0;32m", YELLOW = "\x1b[1;33m", RED = "\x1b[0;31m",
  DIM = "\x1b[2m", RESET = "\x1b[0m";

function statusLine(s: EvalSuiteResult): string {
  const pct = Math.round(s.summary.passRate * 100);
  const icon = s.summary.passRate >= 0.8
    ? `${GREEN}✓${RESET}`
    : s.summary.passRate >= 0.5
      ? `${YELLOW}⚠${RESET}`
      : `${RED}✗${RESET}`;
  let line = `${icon} ${s.modelId}: ${s.summary.passed}/${s.summary.total} passed (${pct}%)`;
  if (s.summary.criticalFailures > 0) line += ` ${RED}⛔${s.summary.criticalFailures}${RESET}`;
  return line;
}

function detailedStatus(s: EvalSuiteResult): string {
  const lines: string[] = [
    `${s.modelId} — ${s.suiteName} v${s.suiteVersion}`,
    `Evaluated: ${new Date(s.timestamp).toISOString()}`,
    statusLine(s),
    "",
  ];

  const gradIssues = s.tests
    .map((t) => t.gradingStatus)
    .filter((g) => g !== "graded" && g !== "skipped");
  if (gradIssues.length > 0) {
    const unique = [...new Set(gradIssues)];
    const labels = unique.map((g) => {
      switch (g) {
        case "no_key": return "no API key";
        case "api_error": return "API error";
        case "parse_error": return "parse failure";
        default: return g;
      }
    });
    lines.push(`${YELLOW}⚠ Gemini grading unavailable (${labels.join(", ")}) — results are deterministic-only.${RESET}`);
    lines.push("");
  }

  for (const t of s.tests) {
    const icon = t.passed ? `${GREEN}✓${RESET}` : `${RED}✗${RESET}`;
    lines.push(`  ${icon} ${t.testId}: ${t.testName}`);
    if (!t.passed) {
      for (const r of t.deterministicResults) {
        if (!r.passed)
          lines.push(`    ${RED}✗ [${r.severity}]${RESET} ${r.description}\n      ${DIM}${r.evidence}${RESET}`);
      }
    }
    if (t.geminiGrade) {
      const g = t.geminiGrade;
      lines.push(
        `    ${DIM}Gemini:${RESET} ${g.overall_pass ? `${GREEN}pass${RESET}` : `${RED}fail${RESET}`} ` +
        `(c=${g.confidence}) syc=${g.sycophancy.pass} rig=${g.observational_rigor.pass} ` +
        `ent=${g.anti_entropy.pass} jus=${g.justify_compliance.pass}`,
      );
    }
  }
  return lines.join("\n");
}

export const statusCommand = defineCommand({
  meta: {
    name: "status",
    description: "Show cached eval results from data/eval_log.json",
  },
  args: {
    model: {
      type: "positional",
      description: "Model ID to show (omit for all models)",
      required: false,
    },
    fixture: {
      type: "string",
      alias: "f",
      description: "Fixture key to filter by (default: edinburgh)",
      default: "edinburgh",
    },
  },
  async run({ args }) {
    const config = loadConfig();
    let fixtureVersion: string;
    try {
      const fx = loadFixture(args.fixture);
      fixtureVersion = fx.version;
    } catch (err) {
      console.error(`Fixture error: ${err instanceof Error ? err.message : String(err)}`);
      process.exit(1);
    }

    if (args.model) {
      const results = readResults(args.model, fixtureVersion, config);
      if (results.length === 0) {
        console.log(`${DIM}No cached results for ${args.model}.${RESET}`);
        return;
      }
      const suite = buildSuiteResult(args.model, args.fixture, fixtureVersion, results);
      console.log(detailedStatus(suite));
    } else {
      // All models — find unique model IDs in the log
      const all = readResults(undefined, fixtureVersion, config);
      const byModel = new Map<string, TestResult[]>();
      for (const r of all) {
        const arr = byModel.get(r.modelId) ?? [];
        arr.push(r);
        byModel.set(r.modelId, arr);
      }
      if (byModel.size === 0) {
        console.log(`${DIM}No cached results found.${RESET}`);
        return;
      }
      console.log(`${DIM}Eval Status:${RESET}\n`);
      for (const [modelId, results] of byModel) {
        const suite = buildSuiteResult(modelId, args.fixture, fixtureVersion, results);
        console.log(statusLine(suite));
      }
    }
  },
});
