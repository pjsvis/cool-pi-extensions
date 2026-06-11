/**
 * Edinburgh Protocol Model Evals — Assertion Engine
 *
 * Deterministic pass/fail evaluation against captured trajectory traces.
 * No LLM-as-judge: passes are determined strictly by regex and tool-execution logs.
 */

import type {
  Assertion,
  AssertionResult,
  TrajectoryTrace,
  RegexAssertion,
  ToolExecutionAssertion,
  ToolOrderAssertion,
} from "./types.js";

// ── Individual Assertion Evaluators ──────────────────────────────

function evalRegexExclude(
  assertion: RegexAssertion,
  trace: TrajectoryTrace,
): AssertionResult {
  // Strip (?i) prefix — we use the 'i' flag instead
  const pattern = assertion.pattern.replace(/^\(\?i\)/, "");
  const regex = new RegExp(pattern, "i");
  const match = regex.exec(trace.fullResponse);
  const passed = match === null;

  return {
    assertionType: "regex_exclude",
    description: `Must NOT contain: /${assertion.pattern}/`,
    passed,
    evidence: passed
      ? "Pattern not found in response"
      : `Found: "${match[0]}"`,
    category: assertion.category ?? "reasoning",
    severity: assertion.severity ?? "critical",
  };
}

function evalRegexMatch(
  assertion: RegexAssertion,
  trace: TrajectoryTrace,
): AssertionResult {
  const pattern = assertion.pattern.replace(/^\(\?i\)/, "");
  const regex = new RegExp(pattern, "i");
  const match = regex.exec(trace.fullResponse);
  const passed = match !== null;

  return {
    assertionType: "regex_match",
    description: `Must contain: /${assertion.pattern}/`,
    passed,
    evidence: passed
      ? `Found: "${match[0]}"`
      : "Required pattern not found in response",
    category: assertion.category ?? "reasoning",
    severity: assertion.severity ?? "critical",
  };
}

function evalToolExecutionRequired(
  assertion: ToolExecutionAssertion,
  trace: TrajectoryTrace,
): AssertionResult {
  const toolNames = new Set(trace.toolCalls.map((tc) => tc.toolName));
  const missing = assertion.tools.filter((t) => !toolNames.has(t));
  const passed = missing.length === 0;

  return {
    assertionType: "tool_execution_required",
    description: `Must call: [${assertion.tools.join(", ")}]`,
    passed,
    evidence: passed
      ? `All required tools called. Trajectory: [${trace.toolCalls.map((t) => t.toolName).join(" → ")}]`
      : `Missing tools: [${missing.join(", ")}]. Actual: [${trace.toolCalls.map((t) => t.toolName).join(" → ") || "none"}]`,
    category: assertion.category ?? "reasoning",
    severity: assertion.severity ?? "critical",
  };
}

function evalToolExecutionForbidden(
  assertion: ToolExecutionAssertion,
  trace: TrajectoryTrace,
): AssertionResult {
  const toolNames = new Set(trace.toolCalls.map((tc) => tc.toolName));
  const found = assertion.tools.filter((t) => toolNames.has(t));
  const passed = found.length === 0;

  return {
    assertionType: "tool_execution_forbidden",
    description: `Must NOT call: [${assertion.tools.join(", ")}]`,
    passed,
    evidence: passed
      ? "Forbidden tools not called"
      : `Called forbidden tools: [${found.join(", ")}]`,
    category: assertion.category ?? "reasoning",
    severity: assertion.severity ?? "critical",
  };
}

function evalToolOrder(
  assertion: ToolOrderAssertion,
  trace: TrajectoryTrace,
): AssertionResult {
  const order = trace.toolCalls.map((tc) => tc.toolName);
  const beforeIdx = order.indexOf(assertion.before);
  const afterIdx = order.indexOf(assertion.after);

  // If either tool wasn't called, check the order doesn't apply
  if (beforeIdx === -1 && afterIdx === -1) {
    return {
      assertionType: "tool_order",
      description: `${assertion.before} must precede ${assertion.after}`,
      passed: false,
      evidence: `Neither ${assertion.before} nor ${assertion.after} was called`,
      category: assertion.category ?? "reasoning",
      severity: assertion.severity ?? "critical",
    };
  }

  if (beforeIdx === -1) {
    return {
      assertionType: "tool_order",
      description: `${assertion.before} must precede ${assertion.after}`,
      passed: false,
      evidence: `${assertion.before} was not called, but ${assertion.after} was`,
      category: assertion.category ?? "reasoning",
      severity: assertion.severity ?? "critical",
    };
  }

  if (afterIdx === -1) {
    return {
      assertionType: "tool_order",
      description: `${assertion.before} must precede ${assertion.after}`,
      passed: true,
      evidence: `${assertion.after} was not called, order constraint satisfied`,
      category: assertion.category ?? "reasoning",
      severity: assertion.severity ?? "critical",
    };
  }

  const passed = beforeIdx < afterIdx;

  return {
    assertionType: "tool_order",
    description: `${assertion.before} must precede ${assertion.after}`,
    passed,
    evidence: passed
      ? `${assertion.before} (#${beforeIdx + 1}) called before ${assertion.after} (#${afterIdx + 1})`
      : `${assertion.after} (#${afterIdx + 1}) called before ${assertion.before} (#${beforeIdx + 1})`,
    category: assertion.category ?? "reasoning",
    severity: assertion.severity ?? "critical",
  };
}

// ── Entry Point ──────────────────────────────────────────────────

export function evaluateAssertions(
  assertions: Assertion[],
  trace: TrajectoryTrace,
): AssertionResult[] {
  const results: AssertionResult[] = [];

  for (const assertion of assertions) {
    switch (assertion.type) {
      case "regex_exclude":
        results.push(evalRegexExclude(assertion, trace));
        break;
      case "regex_match":
        results.push(evalRegexMatch(assertion, trace));
        break;
      case "tool_execution_required":
        results.push(evalToolExecutionRequired(assertion, trace));
        break;
      case "tool_execution_forbidden":
        results.push(evalToolExecutionForbidden(assertion, trace));
        break;
      case "tool_order":
        results.push(evalToolOrder(assertion, trace));
        break;
      default:
        // Exhaustiveness check — should never reach
        const _exhaustive: never = assertion;
        throw new Error(`Unknown assertion type: ${(_exhaustive as Assertion).type}`);
    }
  }

  return results;
}

/**
 * Quick verdict from assertion results (before Gemini second pass).
 * Returns true only if all critical assertions pass.
 */
export function deterministicVerdict(results: AssertionResult[]): boolean {
  return results
    .filter((r) => r.severity === "critical")
    .every((r) => r.passed);
}
