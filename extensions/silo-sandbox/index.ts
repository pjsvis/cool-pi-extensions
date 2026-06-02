/**
 * Silo Sandbox Extension
 *
 * Hard filesystem boundary for the agent. Intercepts all bash execution and
 * enforces that every file path referenced stays inside siloRoot.
 *
 * Config:
 *   .pi/silo-sandbox.json  (project-local)
 *   ~/.pi/agent/extensions/silo-sandbox/config.json  (global)
 *
 * ```json
 * {
 *   "siloRoot": "/path/to/repo",
 *   "enabled": true
 * }
 * ```
 *
 * Enforcement: command paths outside siloRoot are rewritten to fail
 * safely with "I'm staying in." The agent sees the refusal, not the data.
 *
 * Usage:
 *   pi -e ~/.pi/agent/extensions/silo-sandbox      # load explicitly
 *   pi install git:~/.pi/agent/extensions/silo-sandbox  # install permanently
 */

import { existsSync, readFileSync } from "node:fs"
import { join, resolve, isAbsolute } from "node:path"
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent"
import { createBashTool, type BashOperations } from "@earendil-works/pi-coding-agent"

interface SiloConfig {
  siloRoot?: string
  enabled?: boolean
}

function loadConfig(cwd: string): SiloConfig {
  const projectConfigPath = join(cwd, ".pi", "silo-sandbox.json")
  const globalConfigPath = join(
    process.env.PI_CODING_AGENT_DIR ?? join(process.env.HOME ?? "/tmp", ".pi", "agent"),
    "extensions",
    "silo-sandbox",
    "config.json",
  )

  let config: SiloConfig = {}

  for (const path of [globalConfigPath, projectConfigPath]) {
    if (existsSync(path)) {
      try {
        config = { ...config, ...JSON.parse(readFileSync(path, "utf-8")) }
      } catch {
        // ignore parse errors
      }
    }
  }

  return config
}

/**
 * Extract all file paths from a command string.
 * Matches: /absolute/path, ~/path, relative paths (basic).
 */
function extractPaths(command: string): string[] {
  const paths: string[] = []
  const re = /(\/(?:[^\s\/]+\/)*[^\s]*)|(~[^\s]*)/g
  for (const m of command.matchAll(re)) {
    const p = m[0]
    if (p.startsWith("/dev") || p.startsWith("/proc") || p.startsWith("/sys")) continue
    if (p === "/bin" || p === "/usr" || p === "/sbin" || p === "/etc" || p === "/tmp" || p === "/var") continue
    if (p.includes("://") || p.startsWith("http")) continue
    paths.push(p)
  }
  return paths
}

/**
 * Resolve ~ to home, or leave as-is if not absolute.
 */
function resolvePath(path: string): string {
  if (path.startsWith("~")) {
    return join(process.env.HOME ?? "/tmp", path.slice(1))
  }
  return isAbsolute(path) ? path : path // relative paths handled at check time
}

/**
 * Check if a resolved path is inside siloRoot.
 */
function isPathInSilo(resolvedPath: string, siloRoot: string): boolean {
  const resolved = resolve(resolvedPath)
  const root = resolve(siloRoot)
  return resolved.startsWith(root + "/") || resolved === root
}

/**
 * Returns true if the command should be blocked (path outside silo).
 * Also checks `cd` commands.
 */
function isCommandBlocked(command: string, siloRoot: string): { blocked: boolean; reason: string } {
  if (!command?.trim()) return { blocked: false, reason: "" }

  const paths = extractPaths(command)
  for (const p of paths) {
    const resolved = resolvePath(p)
    if (!isPathInSilo(resolved, siloRoot)) {
      return { blocked: true, reason: `Path outside silo: ${p}` }
    }
  }

  const cdMatch = command.match(/^\s*cd\s+(\S+)/)
  if (cdMatch) {
    const target = resolvePath(cdMatch[1])
    if (!isPathInSilo(target, siloRoot)) {
      return { blocked: true, reason: `cd outside silo: ${cdMatch[1]}` }
    }
  }

  return { blocked: false, reason: "" }
}

/**
 * Build a sandboxed BashOperations that wraps all commands.
 * Commands with paths outside siloRoot are blocked.
 */
function createSiloBashOps(siloRoot: string): BashOperations {
  return {
    async exec(command, cwd, { onData, signal, timeout }) {
      const blocked = isCommandBlocked(command, siloRoot)
      if (blocked.blocked) {
        // Return a "staying in" refusal
        const out = "I'm staying in.\n"
        onData?.(Buffer.from(out))
        return { exitCode: 1, output: out, truncated: false }
      }

      // Let the command run normally — cwd is already inside siloRoot
      const result = await new Promise<{ exitCode: number; output: string }>((resolve, reject) => {
        const { spawn } = require("node:child_process")
        const child = spawn("bash", ["-c", command], {
          cwd,
          detached: true,
          stdio: ["ignore", "pipe", "pipe"],
        })

        let output = ""
        let timedOut = false
        let timer: NodeJS.Timeout | undefined

        if (timeout && timeout > 0) {
          timer = setTimeout(() => {
            timedOut = true
            child.kill("SIGKILL")
          }, timeout * 1000)
        }

        signal?.addEventListener("abort", () => child.kill("SIGKILL"))

        child.stdout?.on("data", (d: Buffer) => {
          output += d.toString()
          onData?.(d)
        })

        child.stderr?.on("data", (d: Buffer) => {
          output += d.toString()
          onData?.(d)
        })

        child.on("close", (code) => {
          if (timer) clearTimeout(timer)
          resolve({ exitCode: code ?? 0, output })
        })

        child.on("error", (err: Error) => {
          if (timer) clearTimeout(timer)
          reject(err)
        })
      })

      return { exitCode: result.exitCode, output: result.output, truncated: false }
    },
  }
}

export default async function (pi: ExtensionAPI) {
  pi.registerFlag("no-silo-sandbox", {
    description: "Disable Silo sandbox (filesystem boundary)",
    type: "boolean",
    default: false,
  })

  let siloRoot = process.cwd()
  let sandboxEnabled = false

  pi.on("session_start", async (_event, ctx) => {
    const noSandbox = pi.getFlag("no-silo-sandbox") as boolean

    if (noSandbox) {
      sandboxEnabled = false
      return
    }

    const config = loadConfig(ctx.cwd)

    if (config.enabled === false) {
      sandboxEnabled = false
      return
    }

    siloRoot = config.siloRoot ?? ctx.cwd

    if (!existsSync(siloRoot)) {
      sandboxEnabled = false
      return
    }

    sandboxEnabled = true

    // Announce the sandbox — Edinburgh Protocol: agents should know their own boundaries
    ctx.ui.notify(
      `[silo-sandbox] Active. You are sandboxed to: ${siloRoot}\n` +
      `  Commands targeting paths outside this root will return: "I'm staying in."\n` +
      `  Run \`pi silo-status\` for details, or \`pi --no-silo-sandbox\` to disable for this session.`,
      "info",
    )
  })

  // Replace the bash tool with a sandboxed version
  const localCwd = process.cwd()
  const localBash = createBashTool(localCwd)

  pi.registerTool({
    ...localBash,
    label: "bash (silo-bound)",
    async execute(toolCallId, params, signal, onUpdate, ctx) {
      if (!sandboxEnabled) {
        return localBash.execute(toolCallId, params, signal, onUpdate)
      }

      const command = (params as { command: string }).command ?? ""
      const timeout = (params as { timeout?: number }).timeout

      const blocked = isCommandBlocked(command, siloRoot)
      if (blocked.blocked) {
        return {
          content: [{ type: "text", text: "I'm staying in.\n" }],
          details: { blocked: true },
        }
      }

      const sandboxed = createBashTool(localCwd, { operations: createSiloBashOps(siloRoot) })
      return sandboxed.execute(toolCallId, params, signal, onUpdate)
    },
  })

  // Also intercept user_bash (the ! and !! prefix commands)
  pi.on("user_bash", () => {
    if (!sandboxEnabled) return
    return { operations: createSiloBashOps(siloRoot) }
  })

  pi.registerCommand("silo-status", {
    description: "Show Silo sandbox status",
    handler: async (_args, ctx) => {
      if (!sandboxEnabled) {
        ctx.ui.notify("Silo sandbox: disabled", "info")
        return
      }
      ctx.ui.notify(`Silo sandbox: active — root: ${siloRoot}`, "info")
    },
  })
}