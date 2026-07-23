/**
 * mermaid-tui — Terminal Mermaid renderer (Pi extension port)
 *
 * Thin port over the mermaid-tui Rust binary (src/cli/mermaid-tui/).
 * The binary is the canonical renderer; this extension provides:
 *   /mermaid <source>   — render Mermaid diagram in the terminal
 *   render_mermaid      — LLM-callable tool for agent discoverability
 *
 * No rendering logic in the extension. The binary does the work.
 */

import { resolve } from "node:path";
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

/** Resolve the mermaid-tui binary path relative to cwd (repo root). */
function binaryPath(): string {
  return resolve(process.cwd(), "src/cli/mermaid-tui/target/release/mermaid-tui");
}

/** Render Mermaid source via the binary. Returns ANSI art string. */
function renderMermaid(source: string): string {
  const bin = binaryPath();
  if (!existsSync(bin)) {
    return `Error: mermaid-tui binary not found at ${bin}\nBuild it: cd src/cli/mermaid-tui && cargo build --release`;
  }
  try {
    return execSync(bin, {
      encoding: "utf-8",
      input: source,
      stdio: ["pipe", "pipe", "pipe"],
      timeout: 10_000,
      cwd: process.cwd(),
      env: { ...process.env, COLUMNS: process.env.COLUMNS ?? "80" },
    }).trim();
  } catch (err) {
    const stderr = err instanceof Error && "stderr" in err
      ? String((err as { stderr: string }).stderr).trim() : "";
    return `Error: ${err instanceof Error ? err.message : String(err)}${stderr ? `\n${stderr}` : ""}`;
  }
}

export default function (pi: ExtensionAPI) {
  // ── /mermaid command — render Mermaid in the terminal ──────────────────
  pi.registerCommand("mermaid", {
    description: "Render a Mermaid diagram in the terminal. /mermaid <graph TD\n A --> B>",
    handler: async (args, ctx) => {
      const input = args?.trim() ?? "";
      if (!input) {
        ctx.ui.notify(
          "Usage: /mermaid <mermaid-source>\nExample: /mermaid graph TD\n  A --> B --> C",
          "warning",
        );
        return;
      }
      const output = renderMermaid(input);
      if (output.startsWith("Error:")) {
        ctx.ui.notify(output, "error");
      } else if (output) {
        ctx.ui.notify(output, "info");
      } else {
        ctx.ui.notify("(empty output — check your Mermaid syntax)", "warning");
      }
    },
  });

  // ── LLM-callable tool — agent discoverability ──────────────────────────
  pi.registerTool({
    name: "render_mermaid",
    label: "Render Mermaid Diagram",
    description:
      "Render a Mermaid diagram as Unicode box-drawing art in the terminal. " +
      "Use when the user asks to render, display, or preview a Mermaid diagram. " +
      "Supports graph/flowchart, sequenceDiagram, stateDiagram, classDiagram, erDiagram.",
    promptSnippet: "Render a Mermaid diagram in the terminal",
    promptGuidelines: [
      "Use render_mermaid when the user asks to display or preview a Mermaid diagram.",
      "Pass the raw Mermaid source (e.g. 'graph TD\\n  A --> B --> C').",
    ],
    parameters: Type.Object({
      source: Type.String({
        description: "Raw Mermaid diagram source (e.g. 'graph TD\\n  A --> B --> C')",
      }),
    }),
    async execute(_toolCallId, params) {
      const output = renderMermaid(params.source);
      return { content: [{ type: "text", text: output || "(empty output)" }] };
    },
  });
}
