/**
 * The guard's own controls. A gate is not trusted until it fails on the thing it
 * exists to stop AND passes on the benign neighbour — the first version of this
 * one let a bare `env` through while blocking `env | wc -l`, which is exactly
 * backwards.
 */
import { findHit } from "./index.ts";

let failures = 0;
const check = (label: string, got: string | null, want: boolean) => {
	const ok = want ? got !== null : got === null;
	if (!ok) failures++;
	console.log(`${ok ? "PASS" : "FAIL"}  ${label}${got ? ` -> ${got}` : ""}`);
};

// Must block
check("read the credentials file", findHit(`read {"path":"/Users/x/.pi/agent/auth.json"}`), true);
check("read a .env replica", findHit(`read {"path":"/Users/x/.config/PAI/.env"}`), true);
check("the store's directory", findHit(`bash {"command":"ls ~/Library/Application Support/charm/kv/default"}`), true);
check("skate get", findHit(`bash {"command":"skate get openai_api_key"}`), true);
check("skate list without -k", findHit(`bash {"command":"skate list"}`), true);
check("bare env", findHit(`bash {"command":"env"}`), true);
check("env piped into grep", findHit(`bash {"command":"env | grep OPENAI"}`), true);
check("printenv of one variable", findHit(`bash {"command":"printenv OPENAI_API_KEY"}`), true);
check("ssh private key", findHit(`read {"path":"/Users/x/.ssh/id_ed25519"}`), true);

// Must pass
check("an ordinary file", findHit(`read {"path":"/Users/x/Dev/GitHub/machines/README.md"}`), false);
check("skate list -k (names only)", findHit(`bash {"command":"skate list -k"}`), false);
check("env counted, not printed", findHit(`bash {"command":"env | wc -l"}`), false);
check("env names only", findHit(`bash {"command":"env | cut -d= -f1"}`), false);
check("grep for a word", findHit(`grep {"pattern":"secret","path":"/Users/x/docs"}`), false);

console.log(failures ? `\n${failures} control(s) failed` : "\nguard controls pass");
process.exit(failures ? 1 : 0);
