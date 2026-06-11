/**
 * Edinburgh Protocol Model Evals — Eval Runner
 *
 * Core orchestration: forks sessions, injects trap prompts, captures
 * trajectory traces, runs deterministic assertions + Gemini grading,
 * and returns structured results.
 *
 * This module is deliberately framework-agnostic — it receives pi's
 * ExtensionAPI and session primitives rather than accessing them globally.
 */

import { existsSync, readFileSync, mkdirSync, writeFileSync, appendFileSync } from "node:fs";
import { resolve, dirname } from "node:path";

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import type {
  EvalFixture,
  TestCase,
  TestResult,
  EvalSuiteResult,
  EvalConfig,
  TrajectoryTrace,
  ToolCallRecord,
  GradingStatus,
  GeminiGradeResult,
} from "./types.js";
import { DEFAULT_CONFIG } from "./types.js";
import { evaluateAssertions, deterministicVerdict } from "./assertions.js";
import { runGeminiGrading, combineVerdicts } from "./gemini-grade.js";

// ── Fixture Loading ──────────────────────────────────────────────

export function loadFixture(config: EvalConfig): EvalFixture {
  const path = resolve(config.fixturePath);
  if (!existsSync(path)) {
    throw new Error(`Eval fixture not found: ${path}`);
  }
  const raw = readFileSync(path, "utf-8");
  return JSON.parse(raw) as EvalFixture;
}

// ── Fixture Validation ───────────────────────────────────────────

export function validateFixture(fixture: EvalFixture): string[] {
  const errors: string[] = [];

  if (!fixture.suiteName) errors.push("Missing suiteName");
  if (!fixture.version) errors.push("Missing version");
  if (!Array.isArray(fixture.tests) || fixture.tests.length === 0) {
    errors.push("No tests defined");
  }

  for (const test of fixture.tests) {
    const prefix = `[${test.id}]`;
    if (!test.id) errors.push(`${prefix} Missing id`);
    if (!test.setup?.user_prompt) errors.push(`${prefix} Missing setup.user_prompt`);
    if (!Array.isArray(test.assertions) || test.assertions.length === 0) {
      errors.push(`${prefix} No assertions defined`);
    }
    for (const assertion of test.assertions) {
      if (!assertion.type) errors.push(`${prefix} Assertion missing type`);
      if (!assertion.error_message) errors.push(`${prefix} Assertion missing error_message`);
    }
  }

  return errors;
}

// ── Trajectory Capture Helpers ───────────────────────────────────

/**
 * Creates a trajectory capture buffer for a single test case.
 * Returns an object that accumulates tool calls and response text
 * as the agent processes the trap prompt.
 */
export function createTrajectoryBuffer(
  modelId: string,
  testId: string,
): {
  trace: TrajectoryTrace;
  onToolCall: (toolName: string, toolCallId: string, args: Record<string, unknown>) => void;
  onResponseText: (chunk: string) => void;
  finalize: () => TrajectoryTrace;
} {
  const toolCalls: ToolCallRecord[] = [];
  let fullResponse = "";
  const turnStart = Date.now();

  return {
    trace: {
      modelId,
      testId,
      fullResponse: "",
      toolCalls: [],
      turnStart,
      turnEnd: 0,
    },
    onToolCall(toolName, toolCallId, args) {
      toolCalls.push({
        toolName,
        toolCallId,
        args: { ...args },
        timestamp: Date.now(),
      });
    },
    onResponseText(chunk) {
      fullResponse += chunk;
    },
    finalize() {
      return {
        modelId,
        testId,
        fullResponse,
        toolCalls: [...toolCalls],
        turnStart,
        turnEnd: Date.now(),
      };
    },
  };
}

// ── Eval Logger ──────────────────────────────────────────────────

/**
 * Append a test result to the eval log (JSONL).
 * Creates the file and parent directories if they don't exist.
 */
export function logResult(result: TestResult, config: EvalConfig): void {
  const logPath = resolve(config.evalLogPath);
  const dir = dirname(logPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  appendFileSync(logPath, JSON.stringify(result) + "\n");
}

// ── Cache Check ─────────────────────────────────────────────────

/**
 * Check whether a cached result exists and is still valid.
 * Returns the cached suite result if found, null otherwise.
 */
export function checkCache(
  modelId: string,
  suiteVersion: string,
  config: EvalConfig,
): EvalSuiteResult | null {
  const logPath = resolve(config.evalLogPath);
  if (!existsSync(logPath)) return null;

  const now = Date.now();
  const ttlMs = config.cacheTtlHours * 60 * 60 * 1000;

  // Read all results for this model
  const lines = readFileSync(logPath, "utf-8")
    .trim()
    .split("\n")
    .filter(Boolean);

  const relevant: TestResult[] = [];
  for (const line of lines) {
    try {
      const entry = JSON.parse(line) as TestResult;
      if (
        entry.modelId === modelId &&
        entry.evalSuiteVersion === suiteVersion
      ) {
        relevant.push(entry);
      }
    } catch {
      /* skip malformed lines */
    }
  }

  if (relevant.length === 0) return null;

  // Check freshness — use the most recent timestamp
  const mostRecent = Math.max(...relevant.map((r) => r.timestamp));
  if (now - mostRecent > ttlMs) return null;

  // Reconstruct suite result from individual test results
  const passed = relevant.filter((r) => r.passed);
  const criticalFails = relevant.filter(
    (r) =>
      !r.passed &&
      r.deterministicResults?.some(
        (a) => a.severity === "critical" && !a.passed,
      ),
  );

  return {
    modelId,
    suiteName: "cached",
    suiteVersion,
    timestamp: mostRecent,
    tests: relevant,
    summary: {
      total: relevant.length,
      passed: passed.length,
      failed: relevant.length - passed.length,
      criticalFailures: criticalFails.length,
      passRate: relevant.length > 0 ? passed.length / relevant.length : 0,
    },
  };
}

// ── Test Execution (single test case) ────────────────────────────

/**
 * Run a single eval test case against a model.
 *
 * Flow:
 * 1. Fork the session at the current leaf
 * 2. Set the model to the candidate
 * 3. Inject the trap prompt (with system prompt augment)
 * 4. Capture trajectory (tool calls, response text)
 * 5. Run deterministic assertions
 * 6. Optionally run Gemini secondary grading
 * 7. Combine verdicts
 * 8. Return TestResult
 *
 * Note: This function is designed to work within pi's session lifecycle.
 * It should be called from a command handler that has access to ctx.fork().
 *
 * For the initial implementation, we use a simplified approach where
 * the eval is triggered as a follow-up message in a forked session,
 * and results are collected via event hooks.
 */

export interface RunTestOptions {
  modelId: string;
  fixture: EvalFixture;
  config: EvalConfig;
  /** Skip Gemini grading even if available */
  skipGemini?: boolean;
}

/**
 * Execute the full eval suite for a model.
 *
 * This is the main entry point. It:
 * 1. Checks the cache
 * 2. Runs each test case sequentially (or with limited concurrency)
 * 3. Logs results
 * 4. Returns the suite result
 */
export async function runEvalSuite(
  pi: ExtensionAPI,
  options: RunTestOptions,
): Promise<EvalSuiteResult> {
  const { modelId, fixture, config, skipGemini } = options;

  // Check cache first
  const cached = checkCache(modelId, fixture.version, config);
  if (cached) {
    return cached;
  }

  const results: TestResult[] = [];

  for (const testCase of fixture.tests) {
    const result = await runSingleTest(pi, {
      modelId,
      testCase,
      config,
      skipGemini: skipGemini ?? false,
    });
    results.push(result);

    // Log immediately — don't lose results if subsequent tests fail
    logResult(result, config);
  }

  const passed = results.filter((r) => r.passed);
  const criticalFails = results.filter(
    (r) =>
      !r.passed &&
      r.deterministicResults.some(
        (a) => a.severity === "critical" && !a.passed,
      ),
  );

  return {
    modelId,
    suiteName: fixture.suiteName,
    suiteVersion: fixture.version,
    timestamp: Date.now(),
    tests: results,
    summary: {
      total: results.length,
      passed: passed.length,
      failed: results.length - passed.length,
      criticalFailures: criticalFails.length,
      passRate: results.length > 0 ? passed.length / results.length : 0,
    },
  };
}

// ── Single Test Execution ────────────────────────────────────────

interface SingleTestOptions {
  modelId: string;
  testCase: TestCase;
  config: EvalConfig;
  skipGemini: boolean;
}

/**
 * Run a single test case.
 *
 * Strategy: inject the trap prompt as a follow-up user message into the
 * current session, set the model to the candidate, and capture the agent's
 * response. This is simpler than full fork orchestration and works reliably
 * within pi's event system.
 */
async function runSingleTest(
  pi: ExtensionAPI,
  options: SingleTestOptions,
): Promise<TestResult> {
  const { modelId, testCase, config, skipGemini } = options;
  const traceBuffer = createTrajectoryBuffer(modelId, testCase.id);

  // Register temporary event handlers for trajectory capture
  const unsubscribes: Array<() => void> = [];

  // Capture tool execution
  unsubscribes.push(
    pi.on("tool_execution_start", (event) => {
      traceBuffer.onToolCall(
        event.toolName,
        event.toolCallId,
        event.args as Record<string, unknown>,
      );
    }).unsubscribe,
  );

  // Capture response text
  unsubscribes.push(
    pi.on("message_update", (event) => {
      if (
        event.message.role === "assistant" &&
        "assistantMessageEvent" in event
      ) {
        const ame = event.assistantMessageEvent as {
          type?: string;
          text?: string;
          delta?: { text?: string };
        };
        const text =
          ame.text ?? ame.delta?.text ?? "";
        if (text) {
          traceBuffer.onResponseText(text);
        }
      }
    }).unsubscribe,
  );

  try {
    // Set model to candidate
    const model = pi.modelRegistry?.find(modelId);
    if (model) {
      pi.setModel(model);
    }

    // Inject the trap prompt with system prompt append
    // Use before_agent_start to append the test's system prompt
    const systemAppendUnsub = pi.on(
      "before_agent_start",
      (event) => {
        event.systemPrompt =
          (event.systemPrompt ?? "") +
          "\n\n" +
          testCase.setup.system_prompt_append;
      },
    ).unsubscribe;
    unsubscribes.push(systemAppendUnsub);

    // Send the bait prompt
    pi.sendUserMessage(testCase.setup.user_prompt);

    // Wait for the agent to complete (turn_end provides this)
    // We use a Promise that resolves on turn_end
    await new Promise<void>((resolve) => {
      const turnEndUnsub = pi.on("turn_end", () => {
        turnEndUnsub.unsubscribe?.();
        resolve();
      }).unsubscribe;
      unsubscribes.push(turnEndUnsub);
    });

    // Finalize the trajectory
    const trace = traceBuffer.finalize();

    // Run deterministic assertions
    const assertionResults = evaluateAssertions(
      testCase.assertions,
      trace,
    );

    // Run Gemini secondary grading (unless skipped)
    let geminiGrade: GeminiGradeResult | null = null;
    let gradingStatus: GradingStatus = "skipped";
    if (!skipGemini) {
      const result = await runGeminiGrading(
        testCase,
        trace,
        config,
      );
      geminiGrade = result.grade;
      gradingStatus = result.status;
    }

    // Combine verdicts
    const { finalPass, reasoning } = combineVerdicts(
      assertionResults,
      geminiGrade,
    );

    return {
      modelId,
      testId: testCase.id,
      testName: testCase.name,
      traitTested: testCase.trait_tested,
      passed: finalPass,
      deterministicResults: assertionResults,
      geminiGrade: geminiGrade ?? undefined,
      gradingStatus,
      trajectory: {
        toolCallCount: trace.toolCalls.length,
        responseLength: trace.fullResponse.length,
        turnDurationMs: trace.turnEnd - trace.turnStart,
      },
      timestamp: Date.now(),
      evalSuiteVersion: "1.0.0", // TODO: read from fixture
    };
  } finally {
    // Clean up all event subscriptions
    for (const unsub of unsubscribes) {
      try {
        unsub?.();
      } catch {
        /* ignore */
      }
    }
  }
}

// ── Cache Management ─────────────────────────────────────────────

/**
 * Force-invalidate the cache for a specific model.
 */
export function invalidateCache(modelId: string, config: EvalConfig): void {
  const logPath = resolve(config.evalLogPath);
  if (!existsSync(logPath)) return;

  const lines = readFileSync(logPath, "utf-8")
    .trim()
    .split("\n")
    .filter(Boolean);

  const filtered = lines.filter((line) => {
    try {
      const entry = JSON.parse(line) as TestResult;
      return entry.modelId !== modelId;
    } catch {
      return true; // Keep malformed lines
    }
  });

  writeFileSync(logPath, filtered.join("\n") + (filtered.length > 0 ? "\n" : ""));
}
