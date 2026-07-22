#!/usr/bin/env bun
/**
 * pi-eval — Edinburgh Protocol eval CLI (canonical engine).
 *
 * Usage:
 *   pi-eval run <model> [--fixture=edinburgh] [--skip-grading] [--grader=...]
 *   pi-eval status [model] [--fixture=edinburgh]
 *   pi-eval list
 *   pi-eval fixtures [--validate]
 *   pi-eval clear <model>
 *
 * Subcommands score + matrix arrive in task 2 (briefs/2026-07-22-brief-pi-eval-cli-consolidation.md).
 */

import { defineCommand, runMain } from "citty";
import { runCommand } from "./commands/run.js";
import { statusCommand } from "./commands/status.js";
import { listCommand } from "./commands/list.js";
import { fixturesCommand } from "./commands/fixtures.js";
import { clearCommand } from "./commands/clear.js";

const main = defineCommand({
  meta: {
    name: "pi-eval",
    description: "Edinburgh Protocol eval CLI — behavioral trap vectors + alignment scoring",
    version: "1.0.0",
  },
  subCommands: {
    run: runCommand,
    status: statusCommand,
    list: listCommand,
    fixtures: fixturesCommand,
    clear: clearCommand,
  },
});

runMain(main);
