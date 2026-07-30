// Structural assertion engine — tool execution and DOT parse checks.
//
// The behavioral regex assertions (regex_match / regex_exclude) were expunged
// (Decision 022). The grader is the sole behavioral instrument. This module
// now handles only structural assertions the grader cannot verify from text
// alone: did the model call tools? does the DOT code parse in graphviz?
//
// Absorbed from src/cli/pi-eval-runner.ts evaluateAssertions.
// Async because dot_parse shells out to graphviz.

import { execSync } from "node:child_process";
import type { AssertionResult, TestCase } from "./types.js";

export async function evaluateAssertions(
  assertions: TestCase["assertions"],
  responseText: string,
  toolCallCount = 0,
  toolsAvailable = false,
): Promise<AssertionResult[]> {
  const results: AssertionResult[] = [];

  for (const a of assertions) {
    switch (a.type) {
      case "tool_execution_required": {
        if (!toolsAvailable) {
          results.push({
            assertionType: "tool_execution_required",
            description: `Must call: [${(a.tools ?? []).join(", ")}]`,
            passed: false,
            evidence: "Headless mode — tool trace unavailable. Skipping.",
            category: a.category ?? "reasoning",
            severity: "warning",
          });
        } else {
          const called = toolCallCount > 0;
          results.push({
            assertionType: "tool_execution_required",
            description: `Must call: [${(a.tools ?? []).join(", ")}]`,
            passed: called,
            evidence: called ? `Called ${toolCallCount} tool(s)` : "No tools called",
            category: a.category ?? "reasoning",
            severity: a.severity ?? "critical",
          });
        }
        break;
      }
      case "dot_parse": {
        const dotMatch = responseText.match(/```(?:dot)?\s*\n([\s\S]*?)```/i) ||
                         responseText.match(/(digraph[\s\S]+?\})/i);
        const dotCode = dotMatch ? dotMatch[1].trim() : "";
        if (!dotCode) {
          results.push({
            assertionType: "dot_parse",
            description: "Response must contain parseable DOT code",
            passed: false,
            evidence: "No DOT code found in response",
            category: a.category ?? "delivery",
            severity: a.severity ?? "critical",
          });
          break;
        }
        try {
          execSync(`echo '${dotCode.replace(/'/g, "'\\''")}' | dot -Tplain`, {
            encoding: "utf-8", stdio: ["ignore", "pipe", "pipe"], timeout: 5000,
          });
          results.push({
            assertionType: "dot_parse",
            description: "DOT code must parse successfully",
            passed: true,
            evidence: "DOT parsed successfully",
            category: a.category ?? "delivery",
            severity: a.severity ?? "critical",
          });
        } catch (err) {
          const errMsg = err instanceof Error ? err.message.split("\n")[0] : String(err);
          results.push({
            assertionType: "dot_parse",
            description: "DOT code must parse successfully",
            passed: false,
            evidence: `DOT parse failed: ${errMsg.slice(0, 100)}`,
            category: a.category ?? "delivery",
            severity: a.severity ?? "critical",
          });
        }
        break;
      }
    }
  }
  return results;
}
