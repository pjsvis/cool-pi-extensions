/**
 * Silo boundary tests — verify, don't assert.
 *
 * Run: `bun test src/extensions/silo/check.test.ts`
 *
 * These pin the SOFT boundary's behaviour: what it catches (cooperative-agent
 * accidents) and what it does not (adversarial / runtime-constructed). If a
 * test moves from escape→blocked, that's an improvement; update the test and
 * note it. If blocked→escape, that's a regression.
 */
import { test, expect } from "bun:test";
import { homedir } from "node:os";
import { checkCommand } from "./check";

const SILO = "/repo";
const IN_SUB = "/repo/sub";

// Decision 013 scoped exception — the two Pi-config files permitted out-of-silo.
const ALLOWED = [
  `${homedir()}/.pi/agent/models.json`,
  `${homedir()}/.pi/agent/settings.json`,
];
const blockedWith = (cmd: string, allowed: string[] = ALLOWED, cwd = SILO) =>
  checkCommand(cmd, SILO, cwd, allowed).blocked;

const blocked = (cmd: string, cwd = SILO) =>
  checkCommand(cmd, SILO, cwd).blocked;

test("absolute outside-silo paths are blocked", () => {
  expect(blocked("cat /etc/passwd")).toBe(true);
  expect(blocked("cat /etc/passwd", IN_SUB)).toBe(true);
  expect(blocked("ls /tmp/secret")).toBe(true);
});

test("home (~) paths are blocked (outside silo)", () => {
  expect(blocked("cat ~/secret")).toBe(true);
  expect(blocked("cat ~/.ssh/id_rsa")).toBe(true);
});

test("`..` sequences in a path token are caught", () => {
  // The greedy regex captures ../../.ssh/id_rsa as an absolute-ish token.
  expect(blocked("cat ../../.ssh/id_rsa")).toBe(true);
});

test("bare `..` is caught (the gap extractPaths alone missed)", () => {
  expect(blocked("ls ..")).toBe(true);
  expect(blocked("cat ..")).toBe(true);
  expect(blocked("cd ..")).toBe(true);
});

test("bare `..` from a subdir that stays in-silo is allowed", () => {
  // cwd=/repo/sub, `..` → /repo (the root) → inside. Correct.
  expect(blocked("ls ..", IN_SUB)).toBe(false);
});

test("cd to outside-silo target is blocked (incl. after separators)", () => {
  expect(blocked("cd /etc")).toBe(true);
  expect(blocked("ls && cd /etc")).toBe(true);
  expect(blocked("true; cd /tmp")).toBe(true);
});

test("revision ranges do not false-positive as `..` escapes", () => {
  expect(blocked("git log master..feature")).toBe(false);
  expect(blocked("git diff HEAD~3..HEAD")).toBe(true); // ~ path → blocked
});

test("URLs do not false-positive (curl works)", () => {
  expect(blocked("curl https://example.com")).toBe(false);
  expect(blocked("curl http://example.com/x")).toBe(false);
});

test("/dev/null redirect is allowed (NON_FS_PREFIX)", () => {
  expect(blocked("echo x > /dev/null")).toBe(false);
  expect(blocked("echo x > /dev/sda")).toBe(true); // subpath still checked
});

test("in-silo commands are allowed", () => {
  expect(blocked("cat README.md")).toBe(false);
  expect(blocked("ls src")).toBe(false);
  expect(blocked("cd src")).toBe(false);
  expect(blocked("just check")).toBe(false);
});

test("KNOWN LIMITATIONS — adversarial escapes (documented, not fixed)", () => {
  // Runtime-constructed paths: no literal for the scanner to find.
  expect(
    blocked(`python -c "import os;open(os.path.join(os.environ['HOME'],'x'))"`),
  ).toBe(false);
  // Bare `cd` (no arg) goes to $HOME — outside silo. Not caught.
  expect(blocked("cd")).toBe(false);
  // Symlink inside silo pointing out — not resolvable statically.
  // (Cannot test without fs; documented as a limitation.)
});

// ── Decision 013: allowedPaths scoped exception ──────────────────────
// Security-critical: the exception must admit ONLY the named files.
// secrets (auth.json) must remain blocked even when a sibling is allowed.

test("allowedPaths: declared Pi-config files are permitted out-of-silo", () => {
  expect(blockedWith(`cat ~/.pi/agent/models.json`)).toBe(false);
  expect(blockedWith(`cat ~/.pi/agent/settings.json`)).toBe(false);
  // absolute form too
  expect(blockedWith(`cat ${homedir()}/.pi/agent/models.json`)).toBe(false);
});

test("allowedPaths: the secrets sibling auth.json stays BLOCKED", () => {
  // The whole point: allowing models.json must NOT admit auth.json.
  expect(blockedWith(`cat ~/.pi/agent/auth.json`)).toBe(true);
  expect(blockedWith(`cat ${homedir()}/.pi/agent/auth.json`)).toBe(true);
});

test("allowedPaths: an entry does not admit its siblings (no prefix match)", () => {
  // Even if an entry were the bare directory, only that exact path matches.
  expect(blockedWith(`cat ~/.pi/agent/oauth.json`)).toBe(true);
  expect(blockedWith(`cat ~/.pi/agent/models.json.bak`)).toBe(true);
  expect(blockedWith(`cat ~/.pi/agent/models`)).toBe(true); // dir of same prefix
});

test("allowedPaths: in-silo commands unaffected by the exception list", () => {
  expect(blockedWith("cat README.md")).toBe(false);
  expect(blockedWith("ls src")).toBe(false);
});

test("allowedPaths: empty list means no exception (default behaviour)", () => {
  expect(blockedWith(`cat ~/.pi/agent/models.json`, [])).toBe(true);
});

test("allowedPaths: writing to a permitted file is allowed (not just read)", () => {
  // The exception is path-based, agnostic to read/write — Decision 013 lets
  // the agent EDIT models.json/settings.json.
  expect(blockedWith(`echo '{}' > ~/.pi/agent/models.json`)).toBe(false);
});
