/**
 * Edinburgh Protocol Model Evals — Type Definitions
 *
 * Models the test fixture, trajectory traces, assertion results,
 * and Gemini secondary grading payloads.
 */

// ── Fixture Types ────────────────────────────────────────────────

export type AssertionType =
  | "regex_exclude"        // Pattern must NOT appear in response text
  | "regex_match"          // Pattern MUST appear in response text
  | "tool_execution_required" // Specific tools must appear in trajectory
  | "tool_order"           // Tool A must be called before Tool B
  | "tool_execution_forbidden"; // Specific tools must NOT appear

export type AssertionCategory =
  | "reasoning"           // Platform-agnostic reasoning quality
  | "stack_specific";     // Stack-specific knowledge (Bun APIs, etc.)

export type AssertionSeverity =
  | "critical"            // Fail = gate warning
  | "warning"             // Fail = informational only
  | "info";               // Fail = purely diagnostic

export interface RegexAssertion {
  type: "regex_exclude" | "regex_match";
  pattern: string;
  error_message: string;
  category?: AssertionCategory;
  severity?: AssertionSeverity;
}

export interface ToolExecutionAssertion {
  type: "tool_execution_required" | "tool_execution_forbidden";
  tools: string[];
  error_message: string;
  category?: AssertionCategory;
  severity?: AssertionSeverity;
}

export interface ToolOrderAssertion {
  type: "tool_order";
  before: string;  // Tool that must come first
  after: string;   // Tool that must come after
  error_message: string;
  category?: AssertionCategory;
  severity?: AssertionSeverity;
}

export type Assertion = RegexAssertion | ToolExecutionAssertion | ToolOrderAssertion;

export interface TestCase {
  id: string;
  name: string;
  trait_tested: string;
  category?: AssertionCategory;
  severity?: AssertionSeverity;
  setup: {
    system_prompt_append: string;
    user_prompt: string;
  };
  assertions: Assertion[];
}

export interface EvalFixture {
  suiteName: string;
  version: string;
  meta: {
    description: string;
    target_stack: string;
  };
  tests: TestCase[];
}

// ── Trajectory Trace ─────────────────────────────────────────────

export interface ToolCallRecord {
  toolName: string;
  toolCallId: string;
  args: Record<string, unknown>;
  timestamp: number;
}

export interface TrajectoryTrace {
  modelId: string;
  testId: string;
  fullResponse: string;
  toolCalls: ToolCallRecord[];
  turnStart: number;
  turnEnd: number;
}

// ── Assertion Results ────────────────────────────────────────────

export interface AssertionResult {
  assertionType: AssertionType;
  description: string;
  passed: boolean;
  evidence: string;
  category: AssertionCategory;
  severity: AssertionSeverity;
}

// ── Gemini Secondary Grading ─────────────────────────────────────

export interface GeminiGradeRequest {
  testId: string;
  testName: string;
  trait_tested: string;
  systemPromptAppend: string;
  userPrompt: string;
  fullResponse: string;
  toolCallSummary: string; // Human-readable tool call log
}

export interface GeminiGradeResult {
  sycophancy: { pass: boolean; evidence: string };
  observational_rigor: { pass: boolean; evidence: string };
  anti_entropy: { pass: boolean; evidence: string };
  justify_compliance: { pass: boolean; evidence: string };
  overall_pass: boolean;
  confidence: number; // 0.0–1.0
}

// ── Eval Result ──────────────────────────────────────────────────

export type GradingStatus =
  | "graded"        // Gemini graded successfully
  | "skipped"       // User explicitly skipped Gemini
  | "no_key"        // OPENROUTER_API_KEY not set
  | "api_error"     // HTTP error from OpenRouter
  | "parse_error";  // Gemini returned unparseable output

export interface TestResult {
  modelId: string;
  testId: string;
  testName: string;
  traitTested: string;
  passed: boolean; // Final verdict (deterministic + Gemini combined)
  deterministicResults: AssertionResult[];
  geminiGrade?: GeminiGradeResult;
  gradingStatus: GradingStatus;
  trajectory: {
    toolCallCount: number;
    responseLength: number;
    turnDurationMs: number;
  };
  timestamp: number;
  evalSuiteVersion: string;
}

export interface EvalSuiteResult {
  modelId: string;
  suiteName: string;
  suiteVersion: string;
  timestamp: number;
  tests: TestResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    criticalFailures: number;
    passRate: number;
  };
}

// ── Cache & Config ───────────────────────────────────────────────

export interface EvalConfig {
  evalLogPath: string;          // Default: data/eval_log.json
  fixturePath: string;          // Default: prompts/edinburgh-protocol-evals-v1.json
  graderModel: string;          // Default: "nvidia/nemotron-3-nano-30b-a3b:free" (via OpenRouter)
  maxConcurrentForks: number;   // Default: 2
  cacheTtlHours: number;        // Default: 168 (1 week)
}

export const DEFAULT_CONFIG: EvalConfig = {
  evalLogPath: "data/eval_log.json",
  fixturePath: "prompts/edinburgh-protocol-evals-v1.json",
  graderModel: "nvidia/nemotron-3-nano-30b-a3b:free",
  maxConcurrentForks: 2,
  cacheTtlHours: 168,
};
