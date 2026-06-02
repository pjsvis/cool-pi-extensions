import { execSync } from "node:child_process";

/**
 * Resolve an apiKey value from models.json.
 * Handles:
 *   - `!command` — executes command and returns stdout
 *   - `$ENV_VAR` or `${ENV_VAR}` — interpolates environment
 *   - literal value returned as-is
 *
 * Timeout: 5 seconds to avoid hanging on slow commands.
 */
export async function resolveApiKey(value: string | undefined): Promise<string | null> {
  if (!value) return null;

  // Shell command
  if (value.startsWith("!")) {
    return execSync(value.slice(1), {
      encoding: "utf-8",
      timeout: 5_000,
    }).trim();
  }

  // Environment variable interpolation
  return value.replace(/\$\{?(\w+)\}?/g, (_, name) => {
    return process.env[name] ?? "";
  });
}