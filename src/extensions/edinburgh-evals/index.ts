/**
 * Edinburgh Protocol Model Evals — Thin Port
 *
 * A port over the pi-eval CLI (src/cli/pi-eval/main.ts). The CLI is the
 * canonical eval engine; this extension provides in-session ergonomics:
 *   /eval <model> | status [model] | clear <model>
 *   run_edinburgh_eval tool
 *   model_select advisory hook
 *
 * No state machine, no event hooks, no pi.setModel(). The CLI does the work.
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { execSync } from "node:child_process";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

const CLI_PATH = resolve(process.cwd(), "src/cli/pi-eval/main.ts");
const LOG_PATH = resolve(process.cwd(), "data/eval_log.json");

/** Run a pi-eval subcommand and return stdout. */
function runCli(...args: string[]): string {
  try {
    return execSync(`bun run ${CLI_PATH} ${args.join(" ")}`, {
      encoding: "utf-8", stdio: ["ignore", "pipe", "pipe"],
      timeout: 300_000, cwd: process.cwd(),
    }).trim();
  } catch (err) {
    const stderr = err instanceof Error && "stderr" in err
      ? String((err as { stderr: string }).stderr).trim() : "";
    return `Error: ${err instanceof Error ? err.message : String(err)}${stderr ? `\n${stderr}` : ""}`;
  }
}

/** Count critical eval failures for a model in the log. */
function countCriticalFailures(modelId: string): number {
  if (!existsSync(LOG_PATH)) return 0;
  let critical = 0;
  try {
    for (const line of readFileSync(LOG_PATH, "utf-8").trim().split("\n").filter(Boolean)) {
      const r = JSON.parse(line);
      if (r.modelId !== modelId) continue;
      if (Array.isArray(r.deterministicResults))
        for (const a of r.deterministicResults)
          if (a.severity === "critical" && !a.passed) critical++;
    }
  } catch { /* */ }
  return critical;
}

export default function (pi: ExtensionAPI) {
  // ── /eval command — shell out to pi-eval CLI ───────────────────────────
  pi.registerCommand("eval", {
    description: "Run Edinburgh Protocol behavioral evals. /eval <model> | status [model] | clear <model>",
    getArgumentCompletions(prefix: string) {
      const items = [
        { value: "status", label: "status [model] — show cached results" },
        { value: "clear", label: "clear <model> — invalidate cache" },
      ];
      return prefix ? items.filter((i) => i.value.startsWith(prefix)) : items;
    },
    handler: async (args, ctx) => {
      const input = args?.trim() ?? "";
      if (!input) {
        ctx.ui.notify("Usage: /eval <model-id> | status [model] | clear <model>", "warning");
        return;
      }
      let cliArgs: string[];
      if (input === "status" || input.startsWith("status ")) {
        cliArgs = ["status", ...(input.slice(7).trim() ? [input.slice(7).trim()] : [])];
      } else if (input.startsWith("clear ")) {
        const target = input.slice(6).trim();
        if (!target) { ctx.ui.notify("Usage: /eval clear <model>", "error"); return; }
        cliArgs = ["clear", target];
      } else {
        ctx.ui.notify(`Running eval: ${input}…`, "info");
        ctx.ui.setStatus("edinburgh-evals", `evaluating ${input}…`);
        cliArgs = ["run", input];
      }
      const output = runCli(...cliArgs);
      ctx.ui.setStatus("edinburgh-evals", undefined);
      ctx.ui.notify(output, "info");
    },
  });

  // ── model_select advisory hook — warn on critical failures ─────────────
  pi.on("model_select", async (event, ctx) => {
    const modelId = event.model ? `${event.model.provider}/${event.model.id}` : undefined;
    if (!modelId) return;
    const critical = countCriticalFailures(modelId);
    if (critical > 0) {
      ctx.ui.notify(
        `⚠ ${modelId} has ${critical} critical eval failure(s). Use /eval status ${modelId} for details.`,
        "warning",
      );
    }
  });

  // ── LLM-callable tool ──────────────────────────────────────────────────
  pi.registerTool({
    name: "run_edinburgh_eval",
    label: "Run Edinburgh Eval",
    description:
      "Run Edinburgh Protocol behavioral trap vectors against a model to test " +
      "for sycophancy, entropy inflation, and observational rigor.",
    promptSnippet: "Run behavioral eval against a model",
    promptGuidelines: ["Use run_edinburgh_eval when asked to evaluate a model's adherence to the Edinburgh Protocol."],
    parameters: Type.Object({
      modelId: Type.String({ description: "Model ID to evaluate, e.g. 'gemini-2.5-pro'" }),
    }),
    async execute(_toolCallId, params) {
      return { content: [{ type: "text", text: runCli("run", params.modelId, "--skip-grading") }] };
    },
  });
}
