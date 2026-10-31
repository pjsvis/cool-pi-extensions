// GENERATED FILE — do not edit.
//
// Source: machines/mac/secret-locations.json
// Regenerate: (cd ~/Dev/GitHub/machines && just guard-sync)
// Verified:   just seal-check (rule 4 fails when this copy is stale)
//
// A generated copy rather than a symlink: the guard must run standalone, and a
// link across a silo boundary is shared memory, which neither side owns.

export const PROTECTED_PATHS: { re: RegExp; what: string }[] = [
	{ re: new RegExp("\\.pi/agent/auth\\.json"), what: "pi's provider credentials" },
	{ re: new RegExp("Library/Application Support/charm/kv"), what: "the Skate store (plaintext at rest)" },
	{ re: new RegExp("\\.skate_env\\b"), what: "a plaintext store export" },
	{ re: new RegExp("\\.pi/scrub-backup"), what: "a scrub backup" },
	{ re: new RegExp("\\.config/[^\\s\"']*/(\\.env|\\.env\\.[^\\s\"']*)$|\\.config/[^\\s\"']*\\.env\\b"), what: "a .env replica" },
	{ re: new RegExp("\\.ssh/id_"), what: "an SSH private key" },
	{ re: new RegExp("\\.aws/credentials"), what: "AWS credentials" },
	{ re: new RegExp("\\.netrc\\b"), what: "netrc credentials" },
	{ re: new RegExp("\\.npmrc\\b"), what: "npm registry token" },
	{ re: new RegExp("\\.config/gh/hosts\\.yml"), what: "the GitHub CLI token" },
	{ re: new RegExp("\\.docker/config\\.json"), what: "Docker registry credentials" },
	{ re: new RegExp("\\.kube/config"), what: "kubeconfig credentials" },
];

export const PROTECTED_COMMANDS: { re: RegExp; what: string }[] = [
	{ re: new RegExp("\\bskate\\s+get\\b"), what: "reading a value out of the store" },
	{ re: new RegExp("\\bskate\\s+list\\b(?!\\s+(-\\w*k|--keys-only))"), what: "`skate list` without `-k` prints values" },
];
