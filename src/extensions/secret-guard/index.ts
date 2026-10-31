/**
 * Secret Guard — refuse to let the agent read the credentials store.
 *
 * Why this exists (machines/docs/sealing.md, move 5): 28 of the Skate registry's
 * values were found in pi session transcripts. 19 of them arrived on a single
 * line — one `env` dump, or one `cat` of a plaintext export, recorded verbatim.
 * The agent did not do anything wrong; reading is what it does. The fix cannot
 * be a rule in a prompt, because a prompt is advice and the transcript is a
 * durable record. It has to be a gate.
 *
 * So: `tool_call` blocks, with a reason that names the instrument to use
 * instead. Blocks the paths that hold live values, plus the commands whose
 * whole purpose is to print one.
 *
 * Escape hatch, for a session where the operator genuinely wants the agent to
 * look: PI_SECRET_GUARD=allow. Explicit, per-process, and visible in the
 * operator's own shell history — not a global setting nobody remembers.
 *
 * Fail-open on inspection errors, deliberately. The pi docs advise gate
 * handlers to fail closed; here a false block breaks the session's ability to
 * work at all (a tool call the guard cannot parse is usually a new tool, not an
 * attack), while a false allow costs one transcript. The warning is printed so
 * the choice is never silent.
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

import { PROTECTED_COMMANDS, PROTECTED_PATHS } from "./protected.ts";

// The two rule tables are GENERATED, from machines/mac/secret-locations.json —
// one list of credential locations shared with the perimeter scanner, so the
// guard cannot enforce a different truth than the sweep. Regenerate with
// `just guard-sync` in the machines silo; `just seal-check` there fails when
// this copy is stale.

/** `env` and `printenv` are blocked unless their output is reduced to names or
 *  a count. `env | wc -l` and `env | cut -d= -f1` cannot leak a value; a bare
 *  `env` and `env | grep OPENAI` can. Being precise here is the difference
 *  between a guard the agent works around and one it works with. */
const NAME_ONLY_TAIL = /^\s*\|\s*(wc\b|grep\s+(-c\b|--count\b)|cut\s+-d=\s*-f1\b|sort\s+-u\b)/;

function envLeak(command: string): string | null {
	const re = /(?:^|[|;&(]\s*)(env|printenv)(?![\w-])([^|;&]*)([\s\S]*)$/;
	const m = re.exec(command);
	if (!m) return null;
	const tail = m[3] ?? "";
	if (NAME_ONLY_TAIL.test(tail)) return null;
	return "dumping the environment";
}

/** Exported for the test file: the decision, separated from the extension. */
export function findHit(text: string): string | null {
	for (const p of PROTECTED_PATHS) if (p.re.test(text)) return p.what;
	for (const c of PROTECTED_COMMANDS) if (c.re.test(text)) return c.what;
	const cmd = /\"command\"\s*:\s*\"((?:[^\"\\\\]|\\\\.)*)\"/.exec(text);
	const fromEnv = envLeak(cmd ? cmd[1] : text);
	if (fromEnv) return fromEnv;
	return null;
}

export default function (pi: ExtensionAPI) {
	if (process.env.PI_SECRET_GUARD === "allow") {
		console.error("[secret-guard] disabled for this process by PI_SECRET_GUARD=allow");
		return;
	}

	pi.on("tool_call", async (event) => {
		let text: string;
		try {
			text = `${event.toolName} ${JSON.stringify(event.input ?? {})}`;
		} catch {
			console.error(`[secret-guard] could not inspect ${event.toolName} input — allowing (fail-open, see header)`);
			return undefined;
		}
		const what = findHit(text);
		if (!what) return undefined;
		return {
			block: true,
			reason:
				`Blocked: that call reads ${what}. Values read here are written verbatim into the ` +
				`session transcript, which is how 28 registry values ended up in 58 transcripts on ` +
				`2026-10-31 (machines/docs/sealing.md). Use \`skate list -k\` for key names, or ask the ` +
				`operator to run the command and report only what is needed. To override for a whole ` +
				`session: PI_SECRET_GUARD=allow.`,
		};
	});
}
