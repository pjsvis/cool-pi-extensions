// Canonical eval type definitions.
// Shared by all pi-eval subcommands and (via re-export) the extension port.

// ── Fixtures ────────────────────────────────────────────────────────────────

export interface TestCase {
  id: string;
  name: string;
  trait_tested: string;
  category?: string;
  severity?: string;
  /** Unprimed tests omit the Protocol base — they test unconstrained behavior. */
  unprimed?: boolean;
  /** Tool names the test grants (for repo-grounded tests). */
  tools?: string[];
  setup: {
    system_prompt_append: string;
    user_prompt: string;
  };
  assertions: Array<{
    type: "regex_exclude" | "regex_match" | "tool_execution_required" | "dot_parse";
    pattern?: string;
    tools?: string[];
    error_message: string;
    category?: string;
    severity?: string;
  }>;
}

export interface EvalFixture {
  suiteName: string;
  version: string;
  tests: TestCase[];
}

// ── Assertion results ───────────────────────────────────────────────────────

export interface AssertionResult {
  assertionType: string;
  description: string;
  passed: boolean;
  evidence: string;
  category: string;
  severity: string;
}

// ── Grading ─────────────────────────────────────────────────────────────────

/** Behavioral compliance grade (Gemini via OpenRouter — the trap-eval grader). */
export interface GeminiGradeResult {
  sycophancy: { pass: boolean; evidence: string };
  observational_rigor: { pass: boolean; evidence: string };
  anti_entropy: { pass: boolean; evidence: string };
  justify_compliance: { pass: boolean; evidence: string };
  overall_pass: boolean;
  confidence: number;
}

export type GradingStatus =
  | "graded"
  | "skipped"
  | "no_key"
  | "api_error"
  | "parse_error"
  | "empty";

/** Structured reasoning-quality grade (the scoring-eval grader). */
export interface ReasoningGrade {
  skeptical_rigor: number;
  systems_thinking: number;
  intellectual_honesty: number;
  practical_utility: number;
  analytical_depth: number;
  boundary_discipline: number;
  total: number;
  confidence: number;
  brief_justification: string;
}

export const REASONING_GRADE_MAX = 16;

// ── Test results ────────────────────────────────────────────────────────────

export interface TrajectoryInfo {
  toolCallCount: number;
  responseLength: number;
  turnDurationMs: number;
}

export interface TestResult {
  runId: string;
  modelId: string;
  testId: string;
  testName: string;
  traitTested: string;
  passed: boolean;
  deterministicResults: AssertionResult[];
  geminiGrade?: GeminiGradeResult;
  gradingStatus: GradingStatus | string;
  gradingModel?: string;
  trajectory: TrajectoryInfo;
  timestamp: number;
  evalSuiteVersion: string;
}

export interface RunMetadata {
  runId: string;
  timestamp: number;
  fixture: string;
  models: string[];
  graderModel: string;
  timeoutMs: number;
  totalTests: number;
  passedTests: number;
  skippedTests: number;
  failedTests: number;
  durationMs: number;
}

// ── Eval suite result (for status display) ──────────────────────────────────

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

// ── Config ──────────────────────────────────────────────────────────────────

export interface EvalConfig {
  evalLogPath: string;
  runMetaPath: string;
  fixturePath: string;
  graderModel: string;
  scoringGraderModel: string;
  scoringGraderProvider: string;
  cacheTtlHours: number;
}

export const DEFAULT_CONFIG: EvalConfig = {
  evalLogPath: "data/eval_log.json",
  runMetaPath: "data/eval_runs.jsonl",
  fixturePath: "prompts/edinburgh-protocol-evals-v1.json",
  graderModel: "google/gemini-2.5-flash",
  scoringGraderModel: "qwen/qwen3.7-plus",
  scoringGraderProvider: "zenmux",
  cacheTtlHours: 168,
};
