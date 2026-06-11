/**
 * Silo Extension
 *
 * Hard filesystem boundary for the Pi agent. Intercepts all bash execution and
 * enforces that every file path referenced stays inside the silo root.
 *
 * Config (project overrides global):
 *   .pi/silo.json                      (project-local)
 *   ~/.pi/agent/extensions/silo/config.json  (global)
 *
 * ```json
 * { "siloRoot": "/path/to/repo", "enabled": true }
 * ```
 *
 * Enforcement: commands with paths outside siloRoot return "I'm staying in."
 * Clean commands are delegated to pi's built-in local bash backend, so the
 * agent sees the same environment and filesystem overlay as a normal session.
 *
 * Usage:
 *   pi --no-silo            disable for this session
 *   /silo-status            show current state
 */

import { existsSync, readFileSync } from "node:fs";
import { join, resolve, isAbsolute } from "node:path";
import {
  createBashTool,
  createLocalBashOperations,
  type BashOperations,
} from "@earendil-works/pi-coding-agent";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

// ── Config ────────────────────────────────────────────────────────

interface SiloConfig {
  siloRoot?: string;
  enabled?: boolean;
}

function loadConfig(cwd: string): SiloConfig {
  const projectPath = join(cwd, ".pi", "silo.json");
  const globalPath = join(
    process.env.PI_CODING_AGENT_DIR ??
      join(process.env.HOME ?? "/tmp", ".pi", "agent"),
    "extensions",
    "silo",
    "config.json",
  );

  let config: SiloConfig = {};
  for (const path of [globalPath, projectPath]) {
    if (existsSync(path)) {
      try {
        config = { ...config, ...JSON.parse(readFileSync(path, "utf-8")) };
      } catch { /* ignore malformed JSON */ }
    }
  }
  return config;
}

// Also load old `silo-sandbox` paths for backwards compatibility
function loadLegacyConfig(cwd: string): SiloConfig {
  const legacyProject = join(cwd, ".pi", "silo-sandbox.json");
  const legacyGlobal = join(
    process.env.PI_CODING_AGENT_DIR ??
      join(process.env.HOME ?? "/tmp", ".pi", "agent"),
    "extensions",
    "silo-sandbox",
    "config.json",
  );

  let config: SiloConfig = {};
  for (const path of [legacyGlobal, legacyProject]) {
    if (existsSync(path)) {
      try {
        config = { ...config, ...JSON.parse(readFileSync(path, "utf-8")) };
      } catch { /* ignore */ }
    }
  }
  return config;
}

// ── Path checking ─────────────────────────────────────────────────

const SYSTEM_PREFIXES = [
  "/dev/", "/proc/", "/sys/", "http://", "https://",
];
const SYSTEM_EXACT = ["/bin", "/usr", "/sbin", "/etc", "/tmp", "/var"];

function extractPaths(command: string): string[] {
  const paths: string[] = [];
  const re = /(\/(?:[^\s/]+\/)*[^\s]*)|(~[^\s]*)/g;
  for (const m of command.matchAll(re)) {
    const p = m[0];
    if (p.includes("://")) continue;
    if (SYSTEM_PREFIXES.some((pfx) => p.startsWith(pfx))) continue;
    if (SYSTEM_EXACT.includes(p)) continue;
    paths.push(p);
  }
  return paths;
}

function resolvePath(p: string): string {
  if (p.startsWith("~")) {
    return join(process.env.HOME ?? "/tmp", p.slice(1));
  }
  return isAbsolute(p) ? p : p;
}

function isPathInSilo(resolvedPath: string, siloRoot: string): boolean {
  const r = resolve(resolvedPath);
  const root = resolve(siloRoot);
  return r === root || r.startsWith(root + "/");
}

function checkCommand(
  command: string,
  siloRoot: string,
): { blocked: boolean; reason: string } {
  if (!command?.trim()) return { blocked: false, reason: "" };

  // Check paths in command
  for (const p of extractPaths(command)) {
    if (!isPathInSilo(resolvePath(p), siloRoot)) {
      return { blocked: true, reason: `Path outside silo: ${p}` };
    }
  }

  // Check cd targets
  const cdMatch = command.match(/^\s*cd\s+(\S+)/);
  if (cdMatch) {
    const target = resolvePath(cdMatch[1]);
    if (!isPathInSilo(target, siloRoot)) {
      return { blocked: true, reason: `cd outside silo: ${cdMatch[1]}` };
    }
  }

  return { blocked: false, reason: "" };
}

// ── Sandboxed operations (wraps pi's built-in backend) ────────────

function createSiloBashOps(
  inner: BashOperations,
  siloRoot: string,
): BashOperations {
  return {
    async exec(command, cwd, options) {
      const blocked = checkCommand(command, siloRoot);
      if (blocked.blocked) {
        const msg = "I'm staying in.\n";
        options.onData(Buffer.from(msg));
        return { exitCode: 1 };
      }
      return inner.exec(command, cwd, options);
    },
  };
}

// ── Extension entry point ─────────────────────────────────────────

export default async function (pi: ExtensionAPI) {
  // Register flag (both new and old name for backwards compat)
  pi.registerFlag("no-silo", {
    description: "Disable Silo sandbox (filesystem boundary)",
    type: "boolean",
    default: false,
  });

  let siloRoot = process.cwd();
  let sandboxEnabled = false;

  // ── Session start ──

  pi.on("session_start", async (_event, ctx) => {
    const disabled =
      (pi.getFlag("no-silo") as boolean) ||
      (pi.getFlag("no-silo-sandbox") as boolean);

    if (disabled) {
      sandboxEnabled = false;
      return;
    }

    // Load new config first, fall back to legacy paths
    let config = loadConfig(ctx.cwd);
    if (!config.siloRoot && config.enabled === undefined) {
      config = loadLegacyConfig(ctx.cwd);
    }

    if (config.enabled === false) {
      sandboxEnabled = false;
      return;
    }

    siloRoot = config.siloRoot ?? ctx.cwd;

    if (!existsSync(siloRoot)) {
      sandboxEnabled = false;
      ctx.ui.notify(
        `[silo] Silo root does not exist: ${siloRoot}. Silo disabled.`,
        "warning",
      );
      return;
    }

    sandboxEnabled = true;

    ctx.ui.notify(
      `[silo] Active. Sandboxed to: ${siloRoot}\n` +
        `  Commands outside this root will return: "I'm staying in."\n` +
        `  Use /silo-status for details, or --no-silo to disable.`,
      "info",
    );
  });

  // ── Replace bash tool ──

  const localBash = createBashTool(process.cwd());

  pi.registerTool({
    ...localBash,
    label: "bash (silo-bound)",
    async execute(toolCallId, params, signal, onUpdate, ctx) {
      if (!sandboxEnabled) {
        return localBash.execute(toolCallId, params, signal, onUpdate);
      }

      const command = (params as { command: string }).command ?? "";
      const timeout = (params as { timeout?: number }).timeout;

      const blocked = checkCommand(command, siloRoot);
      if (blocked.blocked) {
        return {
          content: [{ type: "text", text: "I'm staying in.\n" }],
          details: { blocked: true, reason: blocked.reason },
        };
      }

      // Use pi's built-in local bash operations — this preserves the
      // MVFS overlay, session env, and all standard shell behaviour.
      const inner = createLocalBashOperations();
      const sandboxed = createBashTool(
        process.cwd(),
        { operations: createSiloBashOps(inner, siloRoot) },
      );
      return sandboxed.execute(toolCallId, params, signal, onUpdate);
    },
  });

  // ── Intercept interactive bash (! and !!) ──

  pi.on("user_bash", () => {
    if (!sandboxEnabled) return;
    const inner = createLocalBashOperations();
    return { operations: createSiloBashOps(inner, siloRoot) };
  });

  // ── Status command ──

  pi.registerCommand("silo-status", {
    description: "Show Silo sandbox status",
    handler: async (_args, ctx) => {
      if (!sandboxEnabled) {
        ctx.ui.notify("[silo] Disabled", "info");
        return;
      }
      ctx.ui.notify(
        `[silo] Active — root: ${siloRoot}`,
        "info",
      );
    },
  });
}