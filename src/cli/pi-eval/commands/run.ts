// pi-eval run — behavioral trap eval against a model.
// Absorbs the main loop of src/cli/pi-eval-runner.ts.

import { defineCommand } from "citty";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import {
  loadConfig,
  resolveFixtureKey,
  loadFixture,
  validateFixture,
  fixturePath,
  FIXTURES,
  callModel,
  callModelWithTools,
  listOllamaModels,
  DEFAULT_EXCLUDE_LIST,
  DEFAULT_TIMEOUT_MS,
  evaluateAssertions,
  gradeBehavior,
  gradeScopeDiscipline,
  DEFAULT_GRADER_MODEL,
  DEFAULT_SCOPE_GRADER_MODEL,
  combineVerdicts,
  buildProtocolBase,
  logResult,
  logRunMetadata,
  OPENROUTER_KEY,
  type TestResult,
  type RunMetadata,
  type EvalFixture,
} from "../lib/index.js";

const CYAN = "\x1b[0;36m", GREEN = "\x1b[0;32m", YELLOW = "\x1b[1;33m",
  RED = "\x1b[0;31m", DIM = "\x1b[2m", RESET = "\x1b[0m";

/** Edinburgh Protocol behavioral trap tests — grader is the sole verdict.
 *
 * The regex was a closed list matching an open set of clarification phrasings
 * (16% error rate, Phase B). It has been stripped from all Edinburgh fixtures.
 * The grader (scope-augmented rubric, 5 dimensions) is the sole behavioral
 * verdict. Structural assertions (tool_execution_required) are ANDed — the
 * grader can’t verify whether tools were actually called.
 *
 * SIT and IQ tests are NOT Edinburgh tests — they keep their deterministic
 * assertions (the grader rubric doesn’t cover SIT-specific traits like
 * amplification refusal; IQ regex checks correctness, not behavior). */
function isEdinburghTest(testId: string): boolean {
  return testId.startsWith("EDI-");
}

export const runCommand = defineCommand({
  meta: {
    name: "run",
    description: "Run Edinburgh Protocol behavioral trap evals against one or more models",
  },
  args: {
    models: {
      type: "positional",
      description: "Model IDs to eval (e.g. 'kimi-k2.6' or 'inception/mercury-2'). Omit for all Ollama models.",
      required: false,
    },
    fixture: {
      type: "string",
      alias: "f",
      description: `Fixture key: ${Object.keys(FIXTURES).join(", ")}`,
      default: "edinburgh",
    },
    grader: {
      type: "string",
      description: "Grader model for behavioral compliance (default: nvidia/nemotron-3-nano-30b-a3b:free)",
    },
    "scope-grader": {
      type: "string",
      description: "Scope-discipline grader model (grader is the sole verdict for Edinburgh tests; default: google/gemini-2.5-flash)",
    },
    timeout: {
      type: "string",
      description: "Per-test timeout in seconds (default: 60)",
    },
    provider: {
      type: "string",
      description: "Route 'org/model' slugs: 'together', 'zenmux', or '' (OpenRouter, default)",
      default: "",
    },
    exclude: {
      type: "string",
      description: "Comma-separated model IDs to exclude (auto-discovery only)",
    },
    "run-all": {
      type: "boolean",
      description: "Run all recommended models through all fixtures",
      default: false,
    },
    "force-primed": {
      type: "boolean",
      description: "Force unprimed (raw-control) tests to receive the Protocol base — measures whether a base-prompt change closes a gap without destroying the unprimed instrument (Phase 2 of the scope-discipline gate, td-f6ad20).",
      default: false,
    },
  },
  async run({ args }) {
    const config = loadConfig();
    const fixtureKey = resolveFixtureKey(args.fixture);

    // Parse models + flags
    let models: string[] = [];
    let hasExplicitModels = false;
    if (args.models) {
      models = String(args.models).split(",").map((s) => s.trim()).filter(Boolean);
      hasExplicitModels = models.length > 0;
    }

    const forcePrimed = args["force-primed"];
    // Response logging is always on (Phase A — was gated by EVAL_LOG_RESPONSES).
    // The env var is retained as an opt-out for memory-constrained runs.
    const logResponses = process.env["EVAL_LOG_RESPONSES"] !== "0";
    const effectiveGrader = args.grader || process.env["GRADER_MODEL"] || DEFAULT_GRADER_MODEL;
    const effectiveScopeGrader = args["scope-grader"] || args.grader || process.env["GRADER_MODEL"] || DEFAULT_SCOPE_GRADER_MODEL;
    const timeoutMs = args.timeout ? parseInt(args.timeout, 10) * 1000 : DEFAULT_TIMEOUT_MS;
    const provider = args.provider ?? "";
    const excludeSet = new Set<string>(
      (args.exclude ?? "").split(",").map((s) => s.trim()).filter(Boolean),
    );

    // ── --run-all mode ──────────────────────────────────────────────────────
    if (args["run-all"]) {
      await runAllMode(config, effectiveGrader, effectiveScopeGrader, timeoutMs);
      return;
    }

    // ── Discover models if none specified ───────────────────────────────────
    if (!hasExplicitModels) {
      models = await listOllamaModels();
      if (models.length === 0) {
        console.error(`${YELLOW}No models specified and Ollama not running.${RESET}`);
        console.error(`Usage: pi-eval run <model> [--fixture=edinburgh]`);
        console.error(`  Or: pi-eval run --run-all`);
        process.exit(1);
      }
      if (DEFAULT_EXCLUDE_LIST.length > 0) {
        const before = models.length;
        models = models.filter((m) => !DEFAULT_EXCLUDE_LIST.includes(m));
        const excluded = before - models.length;
        if (excluded > 0)
          console.log(`${DIM}Excluded ${excluded} muppet-substrate(s): ${DEFAULT_EXCLUDE_LIST.join(", ")}${RESET}`);
      }
    }

    // Apply explicit --exclude
    if (excludeSet.size > 0) {
      const before = models.length;
      models = models.filter((m) => !excludeSet.has(m));
      const excluded = before - models.length;
      if (excluded > 0)
        console.log(`${DIM}Excluded ${excluded} model(s): ${[...excludeSet].join(", ")}${RESET}`);
    }

    if (models.length === 0) {
      console.log("No models to run.");
      return;
    }

    // ── Load + validate fixture ─────────────────────────────────────────────
    let fixture: EvalFixture;
    try {
      fixture = loadFixture(fixtureKey);
    } catch (err) {
      console.error(`${RED}Fixture error: ${err instanceof Error ? err.message : String(err)}${RESET}`);
      process.exit(1);
    }
    const valErrs = validateFixture(fixture);
    if (valErrs.length > 0) {
      console.error(`${RED}Fixture invalid:\n${valErrs.join("\n")}${RESET}`);
      process.exit(1);
    }

    const runId = randomUUID();
    const runStart = Date.now();

    console.log(`\n${CYAN}Fixture:${RESET} ${fixture.suiteName} v${fixture.version} (${fixture.tests.length} tests)`);
    console.log(`${CYAN}Models:${RESET}  ${models.join(", ")}`);
    console.log(`${CYAN}Grader:${RESET} ${OPENROUTER_KEY ? `${effectiveGrader} (edinburgh: ${effectiveScopeGrader})` : `${YELLOW}unavailable (no OPENROUTER_API_KEY env and no skate open_api_key)${RESET}`}`);
    console.log(`${CYAN}Run ID:${RESET} ${runId}\n`);
    if (forcePrimed) {
      console.log(`${YELLOW}Force-primed:${RESET} unprimed tests receive the Protocol base (Phase 2 scope-discipline measurement).\n`);
    }

    let totalPassed = 0;
    let totalFailed = 0;
    let totalSkipped = 0;

    for (const model of models) {
      const modelT0 = Date.now();
      console.log(`${CYAN}── ${model} ──${RESET}`);
      const modelResults: TestResult[] = [];

      for (const test of fixture.tests) {
        const t0 = Date.now();
        process.stdout.write(`  ${test.id}: ${test.name}... `);

        const protocolBase = buildProtocolBase(
          test.setup.system_prompt_append, !!test.unprimed, forcePrimed,
        );

        let responseText = "";
        let toolCallCount = 0;
        const toolsAvailable = !!(test.tools && test.tools.length > 0);
        let testFailed = false;
        let testTimedOut = false;

        try {
          if (toolsAvailable) {
            const r = await callModelWithTools(
              model, protocolBase, test.setup.user_prompt, test.tools as string[], timeoutMs,
            );
            responseText = r.text;
            toolCallCount = r.toolCallCount;
          } else {
            responseText = await callModel(model, protocolBase, test.setup.user_prompt, timeoutMs, provider);
          }
        } catch (err) {
          const errMsg = err instanceof Error ? err.message : String(err);
          if (errMsg.includes("timeout") || (err as Error).name === "TimeoutError" || errMsg.includes("aborted")) {
            console.log(`${YELLOW}TIMEOUT (${timeoutMs / 1000}s exceeded) — REJECTED${RESET}`);
            testTimedOut = true;
          } else {
            console.log(`${RED}FAIL (model error: ${errMsg})${RESET}`);
          }
          testFailed = true;
        }

        if (testFailed || testTimedOut) {
          const result: TestResult = {
            runId, modelId: model, testId: test.id, testName: test.name,
            traitTested: test.trait_tested, passed: false,
            deterministicResults: [], gradingStatus: "skipped", gradingModel: effectiveGrader,
            trajectory: { toolCallCount: 0, responseLength: 0, turnDurationMs: Date.now() - t0 },
            timestamp: Date.now(), evalSuiteVersion: fixture.version,
            responseText: logResponses ? responseText : "",
            userPrompt: test.setup.user_prompt,
            systemPrompt: protocolBase,
          };
          modelResults.push(result);
          logResult(result, config);
          if (testTimedOut) totalSkipped++;
          else totalFailed++;
          continue;
        }

        // Deterministic assertions (structural only — regex stripped from
        // Edinburgh fixtures; SIT/IQ keep their regex). For Edinburgh tests,
        // these are tool_execution_required checks; for SIT/IQ, the full set.
        const assertionResults = await evaluateAssertions(
          test.assertions, responseText, toolCallCount, toolsAvailable,
        );
        const allPass = assertionResults.every((r) => r.passed);
        const hasCriticalFail = assertionResults.some((r) => !r.passed && r.severity === "critical");
        const structuralPass = assertionResults.length > 0 ? allPass : true;

        // Grading — the sole behavioral verdict for Edinburgh tests; tiebreaks
        // for SIT/IQ (whose deterministic assertions cover traits the rubric
        // doesn’t, e.g. amplification refusal, correctness).
        const edinburgh = isEdinburghTest(test.id);
        let geminiGrade = null;
        let gradingStatus: TestResult["gradingStatus"] = "skipped";
        let gradingModel = effectiveGrader;
        if (OPENROUTER_KEY) {
          if (edinburgh) {
            // Edinburgh: scope-augmented rubric (5 dimensions) is the sole
            // behavioral verdict. Regex is gone from the fixtures.
            const result = await gradeScopeDiscipline(test, responseText, effectiveScopeGrader);
            geminiGrade = result.grade;
            gradingStatus = result.status;
            gradingModel = effectiveScopeGrader;
          } else {
            // SIT/IQ: gateway grader (4 traits), tiebreaks mixed det verdicts.
            const result = await gradeBehavior(test, responseText, effectiveGrader);
            geminiGrade = result.grade;
            gradingStatus = result.status;
          }
        } else {
          gradingStatus = "no_key";
        }

        // Verdict:
        //   Edinburgh: structuralPass AND grader.overall_pass. The grader is
        //     the sole behavioral instrument; structural assertions
        //     (tool_execution_required) are ANDed — the grader can’t verify
        //     tool calls. No regex, no combineVerdicts, no isUnprimed special
        //     case (the grader correctly fails raw-model yapping).
        //   SIT/IQ: combineVerdicts (grader tiebreaks mixed det verdicts).
        const finalPass = edinburgh
          ? structuralPass && (geminiGrade?.overall_pass ?? false)
          : combineVerdicts({ allPass, hasCriticalFail, geminiGrade }).finalPass;

        const result: TestResult = {
          runId, modelId: model, testId: test.id, testName: test.name,
          traitTested: test.trait_tested, passed: finalPass,
          deterministicResults: assertionResults,
          geminiGrade: geminiGrade ?? undefined, gradingStatus, gradingModel,
          trajectory: {
            toolCallCount, responseLength: responseText.length, turnDurationMs: Date.now() - t0,
          },
          timestamp: Date.now(), evalSuiteVersion: fixture.version,
          responseText: logResponses ? responseText : "",
          userPrompt: test.setup.user_prompt,
          systemPrompt: protocolBase,
        };
        modelResults.push(result);
        logResult(result, config);

        const icon = finalPass ? `${GREEN}✓${RESET}` : `${RED}✗${RESET}`;
        const detIcon = allPass ? `${GREEN}✓${RESET}` : `${RED}✗${RESET}`;
        const gemIcon = geminiGrade
          ? geminiGrade.overall_pass ? `${GREEN}✓${RESET}` : `${RED}✗${RESET}`
          : `${DIM}—${RESET}`;
        console.log(`${icon}  det:${detIcon} gem:${gemIcon}  ${DIM}(${responseText.length}c, ${Date.now() - t0}ms)${RESET}`);

        if (finalPass) totalPassed++;
        else totalFailed++;
      }

      // Per-model summary
      const modelTimeMs = Date.now() - modelT0;
      const modelPassed = modelResults.filter((r) => r.passed).length;
      const timeStr = modelTimeMs > 60000 ? `${(modelTimeMs / 1000).toFixed(1)}s` : `${modelTimeMs}ms`;
      console.log(`  ${modelPassed}/${modelResults.length} passed ${DIM}[${timeStr}]${RESET}\n`);
    }

    // Log run metadata
    const runMeta: RunMetadata = {
      runId, timestamp: runStart, fixture: fixtureKey, models,
      graderModel: effectiveGrader, timeoutMs,
      totalTests: totalPassed + totalFailed + totalSkipped,
      passedTests: totalPassed, skippedTests: totalSkipped, failedTests: totalFailed,
      durationMs: Date.now() - runStart,
    };
    logRunMetadata(runMeta, config);

    console.log(`${CYAN}Run ID:${RESET} ${runId}`);
    console.log(`${DIM}Results logged to ${config.evalLogPath}${RESET}`);
    console.log(`${DIM}Run metadata logged to ${config.runMetaPath}${RESET}`);
  },
});

// ── --run-all mode ───────────────────────────────────────────────────────────

const RECOMMENDED_MODELS = [
  "inception/mercury-2",
  "nvidia/nemotron-3-nano-30b-a3b:free",
];

async function runAllMode(
  config: ReturnType<typeof loadConfig>,
  effectiveGrader: string,
  effectiveScopeGrader: string,
  timeoutMs: number,
): Promise<void> {
  const runId = randomUUID();
  const runStart = Date.now();
  const runModels = [...RECOMMENDED_MODELS];
  const logResponses = process.env["EVAL_LOG_RESPONSES"] !== "0";

  console.log(`\n${CYAN}=== Running Full Eval Suite ===${RESET}`);
  console.log(`${CYAN}Run ID:${RESET} ${runId}`);
  console.log(`${CYAN}Models:${RESET} ${runModels.join(", ")}`);
  console.log(`${CYAN}Fixtures:${RESET} ${Object.keys(FIXTURES).join(", ")}`);
  console.log(`${CYAN}Grader:${RESET} ${effectiveGrader}`);
  console.log(`\n${DIM}NOTE: Benchmaxxing risk — passing these evals doesn't guarantee general intelligence.${RESET}\n`);

  const runResults: Array<{ model: string; fixture: string; passed: number; total: number; timeMs: number }> = [];
  let totalPassed = 0;
  let totalSkipped = 0;
  let totalFailed = 0;

  for (const fixtureKey of Object.keys(FIXTURES)) {
    const fx = JSON.parse(readFileSync(fixturePath(fixtureKey), "utf-8")) as EvalFixture;
    console.log(`\n${CYAN}── ${fx.suiteName} ──${RESET}`);

    for (const model of runModels) {
      const modelT0 = Date.now();
      let passed = 0;
      let total = 0;

      for (const test of fx.tests) {
        const t0 = Date.now();
        let responseText = "";
        let success = false;

        const edinburgh = isEdinburghTest(test.id);
        // Edinburgh fixtures get the Protocol base (via buildProtocolBase);
        // SIT/IQ use the append only (no Protocol priming).
        const systemPrompt = edinburgh
          ? buildProtocolBase(test.setup.system_prompt_append, !!test.unprimed, false)
          : test.setup.system_prompt_append;

        try {
          responseText = await callModel(model, systemPrompt, test.setup.user_prompt, timeoutMs);
          success = true;
        } catch { /* timeout or error */ }

        let testPassed = false;
        let geminiGrade = null;
        let gradingStatus: TestResult["gradingStatus"] = "skipped";
        let gradingModel = effectiveGrader;
        if (success) {
          const assertionResults = await evaluateAssertions(test.assertions, responseText);
          const allPass = assertionResults.every((r) => r.passed);
          const hasCriticalFail = assertionResults.some((r) => !r.passed && r.severity === "critical");
          const structuralPass = assertionResults.length > 0 ? allPass : true;

          if (OPENROUTER_KEY) {
            if (edinburgh) {
              const r = await gradeScopeDiscipline(test, responseText, effectiveScopeGrader);
              geminiGrade = r.grade;
              gradingStatus = r.status;
              gradingModel = effectiveScopeGrader;
            } else {
              const r = await gradeBehavior(test, responseText, effectiveGrader);
              geminiGrade = r.grade;
              gradingStatus = r.status;
            }
          } else {
            gradingStatus = "no_key";
          }

          testPassed = edinburgh
            ? structuralPass && (geminiGrade?.overall_pass ?? false)
            : combineVerdicts({ allPass, hasCriticalFail, geminiGrade }).finalPass;
          if (testPassed) passed++;
        }
        total++;

        logResult({
          runId, modelId: model, testId: test.id, testName: test.name,
          traitTested: test.trait_tested, passed: testPassed,
          deterministicResults: success ? await evaluateAssertions(test.assertions, responseText) : [],
          geminiGrade: geminiGrade ?? undefined, gradingStatus, gradingModel,
          trajectory: { toolCallCount: 0, responseLength: responseText.length, turnDurationMs: Date.now() - t0 },
          timestamp: Date.now(), evalSuiteVersion: fx.version,
          responseText: logResponses ? responseText : "",
          userPrompt: test.setup.user_prompt,
          systemPrompt,
        }, config);

        process.stdout.write(success ? (testPassed ? "✓" : "✗") : "○");
      }

      const timeMs = Date.now() - modelT0;
      totalPassed += passed;
      totalFailed += total - passed;
      runResults.push({ model, fixture: fixtureKey, passed, total, timeMs });
      console.log(` → ${passed}/${total} [${timeMs}ms]`);
    }
  }

  const runMeta: RunMetadata = {
    runId, timestamp: runStart, fixture: "all", models: runModels,
    graderModel: effectiveGrader, timeoutMs,
    totalTests: totalPassed + totalFailed, passedTests: totalPassed,
    skippedTests: totalSkipped, failedTests: totalFailed,
    durationMs: Date.now() - runStart,
  };
  logRunMetadata(runMeta, config);

  console.log(`\n${CYAN}=== Run ${runId.slice(0, 8)} Summary ===${RESET}`);
  for (const r of runResults) {
    console.log(`${r.model} | ${r.fixture} | ${r.passed}/${r.total} | ${r.timeMs}ms`);
  }
  console.log(`\nTotal: ${totalPassed}/${totalPassed + totalFailed} passed`);
  console.log(`${DIM}Results logged to ${config.evalLogPath}${RESET}`);
  console.log(`${DIM}Run metadata logged to ${config.runMetaPath}${RESET}`);
}
