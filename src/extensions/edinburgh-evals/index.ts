/**
 * Edinburgh Protocol Model Evals — Extension Entry Point
 *
 * Registers:
 *   /eval <model>       — Run behavioral trap evals against a model
 *   /eval status [model] — Show cached eval results
 *   /eval clear <model>  — Invalidate cache for a model
 *
 * Architecture:
 *   Command handler queues trap prompts as follow-up messages.
 *   Event hooks (turn_end, before_agent_start) capture trajectories
 *   and run deterministic assertions. Gemini grading is called
 *   asynchronously during turn_end. Results are logged and summarized.
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

import type {
  EvalConfig,
  EvalSuiteResult,
  TestCase,
  EvalFixture,
  TestResult,
  TrajectoryTrace,
  AssertionResult,
  GeminiGradeResult,
  GradingStatus,
} from "./types.js";
import { DEFAULT_CONFIG } from "./types.js";
import { evaluateAssertions } from "./assertions.js";
import { runGeminiGrading, combineVerdicts } from "./gemini-grade.js";
import { checkCache, invalidateCache, logResult } from "./eval-runner.js";

// ── Config ───────────────────────────────────────────────────────

function loadConfig(): EvalConfig {
  const homeConfigPath = resolve(
    process.env.PI_CODING_AGENT_DIR ??
      resolve(process.env.HOME ?? "/tmp", ".pi", "agent"),
    "extensions",
    "edinburgh-evals",
    "config.json",
  );
  const projectConfigPath = resolve(".pi", "edinburgh-evals.json");

  let config = { ...DEFAULT_CONFIG };
  for (const p of [homeConfigPath, projectConfigPath]) {
    if (existsSync(p)) {
      try {
        config = { ...config, ...JSON.parse(readFileSync(p, "utf-8")) };
      } catch { /* ignore */ }
    }
  }
  return config;
}

// ── Fixture ──────────────────────────────────────────────────────

function loadFixture(config: EvalConfig): EvalFixture {
  const p = resolve(config.fixturePath);
  if (!existsSync(p)) throw new Error(`Fixture not found: ${p}`);
  return JSON.parse(readFileSync(p, "utf-8")) as EvalFixture;
}

function validateFixture(fixture: EvalFixture): string[] {
  const errs: string[] = [];
  if (!Array.isArray(fixture.tests) || fixture.tests.length === 0)
    errs.push("No tests defined");
  for (const t of fixture.tests) {
    if (!t.id) errs.push("Test missing id");
    if (!t.setup?.user_prompt) errs.push(`${t.id}: missing user_prompt`);
    if (!Array.isArray(t.assertions) || t.assertions.length === 0)
      errs.push(`${t.id}: no assertions`);
  }
  return errs;
}

// ── Status Display ───────────────────────────────────────────────

function statusLine(s: EvalSuiteResult): string {
  const pct = Math.round(s.summary.passRate * 100);
  const icon = s.summary.passRate >= 0.8 ? "✓" : s.summary.passRate >= 0.5 ? "⚠" : "✗";
  let line = `${icon} ${s.modelId}: ${s.summary.passed}/${s.summary.total} passed (${pct}%)`;
  if (s.summary.criticalFailures > 0) line += ` ⛔${s.summary.criticalFailures}`;
  return line;
}

function detailedStatus(s: EvalSuiteResult): string {
  const lines: string[] = [
    `${s.modelId} — ${s.suiteName} v${s.suiteVersion}`,
    `Evaluated: ${new Date(s.timestamp).toISOString()}`,
    statusLine(s),
    "",
  ];
  // Check if grading was unavailable
  const gradIssues = s.tests
    .map((t) => t.gradingStatus)
    .filter((s) => s !== "graded" && s !== "skipped");
  if (gradIssues.length > 0) {
    const unique = [...new Set(gradIssues)];
    const labels = unique
      .map((g) => {
        switch (g) {
          case "no_key": return "no API key";
          case "api_error": return "API error";
          case "parse_error": return "parse failure";
          default: return g;
        }
      });
    lines.push(`⚠ Gemini grading unavailable (${labels.join(", ")}) — results are deterministic-only.`);
    lines.push("");
  }

  for (const t of s.tests) {
    lines.push(`  ${t.passed ? "✓" : "✗"} ${t.testId}: ${t.testName}`);
    if (!t.passed) {
      for (const r of t.deterministicResults) {
        if (!r.passed)
          lines.push(`    ✗ [${r.severity}] ${r.description}\n      ${r.evidence}`);
      }
    }
    if (t.geminiGrade) {
      const g = t.geminiGrade;
      lines.push(
        `    Gemini: ${g.overall_pass ? "pass" : "fail"} (c=${g.confidence}) ` +
          `syc=${g.sycophancy.pass} rig=${g.observational_rigor.pass} ` +
          `ent=${g.anti_entropy.pass} jus=${g.justify_compliance.pass}`,
      );
    }
  }
  return lines.join("\n");
}

// ── Eval State Machine ───────────────────────────────────────────

interface EvalState {
  /** Active model under test */
  modelId: string;
  /** Test cases in order */
  tests: TestCase[];
  /** Index of current test (0-based) */
  currentIndex: number;
  /** Full fixture for metadata */
  fixture: EvalFixture;
  /** Accumulated results */
  results: TestResult[];
  /** Response text captured so far for current test */
  responseText: string;
  /** Tool calls captured for current test */
  toolCalls: Array<{ toolName: string; toolCallId: string; args: Record<string, unknown> }>;
  /** When current turn started */
  turnStart: number;
}

let state: EvalState | null = null;

function resetState() {
  state = null;
}

// ── Main Extension ───────────────────────────────────────────────

export default function (pi: ExtensionAPI) {
  const config = loadConfig();

  // ═══════════════════════════════════════════════════════════════
  // Command: /eval
  // ═══════════════════════════════════════════════════════════════

  pi.registerCommand("eval", {
    description:
      "Run Edinburgh Protocol behavioral evals. " +
      "/eval <model> | status [model] | clear <model>",
    getArgumentCompletions(prefix: string) {
      const items = [
        { value: "status", label: "status [model] — show cached results" },
        { value: "clear", label: "clear <model> — invalidate cache" },
      ];
      return prefix ? items.filter((i) => i.value.startsWith(prefix)) : items;
    },
    handler: async (args, ctx) => {
      const input = args?.trim() ?? "";

      // ── /eval status [model] ──
      if (input === "status" || input.startsWith("status ")) {
        const target = input.slice(7).trim() || undefined;
        const fixture = loadFixture(config);

        if (target) {
          const c = checkCache(target, fixture.version, config);
          if (c) {
            ctx.ui.notify(detailedStatus(c), "info");
          } else {
            ctx.ui.notify(`No cached results for ${target}.`, "info");
          }
        } else {
          const logPath = resolve(config.evalLogPath);
          if (!existsSync(logPath)) {
            ctx.ui.notify("No eval results yet.", "info");
            return;
          }
          const byModel = new Map<string, EvalSuiteResult>();
          const lines = readFileSync(logPath, "utf-8").trim().split("\n").filter(Boolean);
          for (const line of lines) {
            try {
              const r = JSON.parse(line);
              if (r.modelId && !byModel.has(r.modelId)) {
                const c = checkCache(r.modelId, fixture.version, config);
                if (c) byModel.set(r.modelId, c);
              }
            } catch { /* skip */ }
          }
          if (byModel.size === 0) {
            ctx.ui.notify("No cached results found.", "info");
            return;
          }
          const out = ["Eval Status:\n"];
          for (const [, s] of byModel) out.push(statusLine(s));
          ctx.ui.notify(out.join("\n"), "info");
        }
        return;
      }

      // ── /eval clear <model> ──
      if (input.startsWith("clear ")) {
        const target = input.slice(6).trim();
        if (!target) {
          ctx.ui.notify("Usage: /eval clear <model>", "error");
          return;
        }
        invalidateCache(target, config);
        ctx.ui.notify(`Cache cleared for ${target}`, "success");
        return;
      }

      // ── /eval <model> ──
      if (!input) {
        ctx.ui.notify("Usage: /eval <model-id> | status [model] | clear <model>", "warning");
        return;
      }

      // Resolve model
      const model = ctx.modelRegistry.find(input);
      if (!model) {
        ctx.ui.notify(`Model "${input}" not found.`, "error");
        return;
      }

      // Load & validate fixture
      let fixture: EvalFixture;
      try {
        fixture = loadFixture(config);
      } catch (err) {
        ctx.ui.notify(`Fixture error: ${err instanceof Error ? err.message : String(err)}`, "error");
        return;
      }
      const valErrs = validateFixture(fixture);
      if (valErrs.length > 0) {
        ctx.ui.notify(`Fixture invalid:\n${valErrs.join("\n")}`, "error");
        return;
      }

      // Check cache
      const cached = checkCache(input, fixture.version, config);
      if (cached) {
        ctx.ui.notify(
          `Cached results for ${input} (${new Date(cached.timestamp).toISOString()})\n` +
            statusLine(cached) +
            "\nUse /eval clear " + input + " to force re-eval.",
          "info",
        );
        return;
      }

      // Initialize eval state machine
      state = {
        modelId: input,
        tests: fixture.tests,
        currentIndex: 0,
        fixture,
        results: [],
        responseText: "",
        toolCalls: [],
        turnStart: 0,
      };

      // Set the model under test
      pi.setModel(model);

      ctx.ui.notify(
        `Starting eval: ${input} — ${fixture.tests.length} tests…`,
        "info",
      );
      ctx.ui.setStatus("edinburgh-evals", `[1/${fixture.tests.length}] ${fixture.tests[0].name}…`);

      // Inject first trap prompt as follow-up
      pi.sendUserMessage(fixture.tests[0].setup.user_prompt, {
        deliverAs: "followUp",
      });
    },
  });

  // ═══════════════════════════════════════════════════════════════
  // System prompt injection per test
  // ═══════════════════════════════════════════════════════════════

  pi.on("before_agent_start", (event) => {
    if (!state) return;
    const test = state.tests[state.currentIndex];
    if (!test) return;

    // Append the test's system prompt override
    event.systemPrompt =
      (event.systemPrompt ?? "") +
      "\n\n" +
      test.setup.system_prompt_append;

    return {}; // Let normal processing continue
  });

  // ═══════════════════════════════════════════════════════════════
  // Trajectory capture
  // ═══════════════════════════════════════════════════════════════

  pi.on("turn_start", (event) => {
    if (!state) return;
    state.turnStart = event.timestamp;
    state.responseText = "";
    state.toolCalls = [];
  });

  pi.on("tool_execution_start", (event) => {
    if (!state) return;
    state.toolCalls.push({
      toolName: event.toolName,
      toolCallId: event.toolCallId,
      args: event.args as Record<string, unknown>,
    });
  });

  pi.on("message_update", (event) => {
    if (!state) return;
    if (event.message.role === "assistant") {
      const ame = event.assistantMessageEvent as {
        type?: string;
        text?: string;
        delta?: { text?: string };
      } | undefined;
      const text = ame?.text ?? ame?.delta?.text ?? "";
      if (text) state.responseText += text;
    }
  });

  // ═══════════════════════════════════════════════════════════════
  // Turn end: run assertions, grade, log, advance
  // ═══════════════════════════════════════════════════════════════

  pi.on("turn_end", async (event, ctx) => {
    if (!state) return;

    const test = state.tests[state.currentIndex];
    if (!test) return;

    const turnEnd = event.timestamp;

    // Build trajectory trace
    const trace: TrajectoryTrace = {
      modelId: state.modelId,
      testId: test.id,
      fullResponse: state.responseText,
      toolCalls: state.toolCalls.map((tc) => ({
        toolName: tc.toolName,
        toolCallId: tc.toolCallId,
        args: { ...tc.args },
        timestamp: state.turnStart,
      })),
      turnStart: state.turnStart,
      turnEnd,
    };

    // ── Pass 1: deterministic assertions ──
    const assertionResults = evaluateAssertions(test.assertions, trace);

    // ── Pass 2: Gemini secondary grading ──
    let geminiGrade: GeminiGradeResult | null = null;
    let gradingStatus: GradingStatus = "skipped";
    try {
      const result = await runGeminiGrading(test, trace, config);
      geminiGrade = result.grade;
      gradingStatus = result.status;
    } catch {
      gradingStatus = "api_error";
    }

    // ── Combine verdicts ──
    const { finalPass } = combineVerdicts(assertionResults, geminiGrade);

    // ── Build result ──
    const result: TestResult = {
      modelId: state.modelId,
      testId: test.id,
      testName: test.name,
      traitTested: test.trait_tested,
      passed: finalPass,
      deterministicResults: assertionResults,
      geminiGrade: geminiGrade ?? undefined,
      gradingStatus,
      trajectory: {
        toolCallCount: trace.toolCalls.length,
        responseLength: trace.fullResponse.length,
        turnDurationMs: turnEnd - state.turnStart,
      },
      timestamp: Date.now(),
      evalSuiteVersion: state.fixture.version,
    };

    state.results.push(result);
    logResult(result, config);

    const icon = finalPass ? "✓" : "✗";

    // ── Advance or finish ──
    state.currentIndex++;
    if (state.currentIndex >= state.tests.length) {
      // All done — summarize
      const suite: EvalSuiteResult = {
        modelId: state.modelId,
        suiteName: state.fixture.suiteName,
        suiteVersion: state.fixture.version,
        timestamp: Date.now(),
        tests: state.results,
        summary: {
          total: state.results.length,
          passed: state.results.filter((r) => r.passed).length,
          failed: state.results.filter((r) => !r.passed).length,
          criticalFailures: state.results.filter(
            (r) =>
              !r.passed &&
              r.deterministicResults.some(
                (a) => a.severity === "critical" && !a.passed,
              ),
          ).length,
          passRate:
            state.results.length > 0
              ? state.results.filter((r) => r.passed).length /
                state.results.length
              : 0,
        },
      };

      ctx.ui.setStatus("edinburgh-evals", undefined);

      pi.sendMessage({
        customType: "edinburgh-evals-result",
        content: detailedStatus(suite),
        display: true,
        details: suite,
      });

      resetState();
    } else {
      // Advance to next test
      const nextTest = state.tests[state.currentIndex];
      ctx.ui.setStatus(
        "edinburgh-evals",
        `[${state.currentIndex + 1}/${state.tests.length}] ${icon} ${nextTest.name}…`,
      );

      pi.sendUserMessage(nextTest.setup.user_prompt, {
        deliverAs: "followUp",
      });
    }
  });

  // ═══════════════════════════════════════════════════════════════
  // Custom message renderer for eval results
  // ═══════════════════════════════════════════════════════════════

  pi.registerMessageRenderer(
    "edinburgh-evals-result",
    (_message, _options, _theme) => {
      // Use the built-in text rendering for now
      // Custom rendering can be added later
      return undefined; // fall back to default
    },
  );

  // ═══════════════════════════════════════════════════════════════
  // model_select hook: advisory warning on model switch
  // ═══════════════════════════════════════════════════════════════

  pi.on("model_select", async (event, ctx) => {
    const modelId = event.model
      ? `${event.model.provider}/${event.model.id}`
      : undefined;
    if (!modelId) return;

    const fixture = loadFixture(config);
    const cached = checkCache(modelId, fixture.version, config);

    if (cached && cached.summary.criticalFailures > 0) {
      ctx.ui.notify(
        `⚠ ${modelId} has ${cached.summary.criticalFailures} critical ` +
          `eval failure(s). Use /eval status ${modelId} for details.`,
        "warning",
      );
    }
  });

  // ═══════════════════════════════════════════════════════════════
  // LLM-callable tool
  // ═══════════════════════════════════════════════════════════════

  pi.registerTool({
    name: "run_edinburgh_eval",
    label: "Run Edinburgh Eval",
    description:
      "Run Edinburgh Protocol behavioral trap vectors against a model to test " +
      "for sycophancy, entropy inflation, and observational rigor.",
    promptSnippet: "Run behavioral eval against a model",
    promptGuidelines: [
      "Use run_edinburgh_eval when asked to evaluate a model's adherence to the Edinburgh Protocol.",
    ],
    parameters: Type.Object({
      modelId: Type.String({
        description: "Model ID to evaluate, e.g. 'gemini-2.5-pro'",
      }),
    }),
    async execute(_toolCallId, params) {
      pi.sendUserMessage(`/eval ${params.modelId}`, {
        deliverAs: "followUp",
      });
      return {
        content: [
          {
            type: "text",
            text: `Queued Edinburgh Protocol eval for ${params.modelId}. Results will appear when tests complete.`,
          },
        ],
      };
    },
  });

  // ═══════════════════════════════════════════════════════════════
  // Cleanup on shutdown
  // ═══════════════════════════════════════════════════════════════

  pi.on("session_shutdown", () => {
    resetState();
  });
}


