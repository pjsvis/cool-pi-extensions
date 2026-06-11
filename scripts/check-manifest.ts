#!/usr/bin/env bun

/**
 * Lightweight manifest consistency checker.
 *
 * Checks that the human-facing documentation index stays aligned with reality:
 * - MANIFEST.md lists every file in docs/, playbooks/, briefs/, debriefs/,
 *   decisions/, and prompts/.
 * - MANIFEST.md does not list missing files.
 * - Markdown links within checked docs resolve to real files.
 * - Known path migrations are not reintroduced.
 *
 * This intentionally stays small. It is a barnacle scraper for the repo's
 * documentation surface, not a second build system.
 */

import { existsSync, readdirSync, readFileSync } from "node:fs"
import { extname, join, relative, resolve } from "node:path"

const ROOT = process.cwd()
const MANIFEST = "MANIFEST.md"
const INDEXED_DIRS = ["docs", "playbooks", "briefs", "debriefs", "decisions", "prompts"]
const CHECKED_DOCS = [
  "README.md",
  "MANIFEST.md",
  ...INDEXED_DIRS.flatMap((dir) => walk(join(ROOT, dir)).filter((p) => extname(p) === ".md")),
]

function rel(path: string): string {
  return relative(ROOT, path).replaceAll("\\", "/")
}

function walk(dir: string): string[] {
  if (!existsSync(dir)) return []

  const files: string[] = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...walk(fullPath))
    } else if (entry.isFile()) {
      files.push(rel(fullPath))
    }
  }
  return files
}

function manifestLinks(): Set<string> {
  const text = readFileSync(MANIFEST, "utf-8")
  const links = new Set<string>()
  const re = /\((docs|playbooks|briefs|debriefs|decisions|prompts)\/[^)\s]+\)/g
  let match: RegExpExecArray | null
  while ((match = re.exec(text)) !== null) {
    links.add(match[0].slice(1, -1))
  }
  return links
}

function indexedFiles(): Set<string> {
  const files = new Set<string>()
  for (const dir of INDEXED_DIRS) {
    for (const file of walk(join(ROOT, dir))) {
      if (file.endsWith(".md") || file.endsWith(".json")) files.add(file)
    }
  }
  return files
}

function markdownLinks(file: string): string[] {
  const text = readFileSync(file, "utf-8")
  const links: string[] = []
  const re = /\[[^\]]*\]\(([^)]+)\)/g
  let match: RegExpExecArray | null
  while ((match = re.exec(text)) !== null) {
    links.push(match[1])
  }
  return links
}

function checkLinks(): string[] {
  const errors: string[] = []

  for (const file of CHECKED_DOCS) {
    const base = resolve(ROOT, file, "..")
    for (const raw of markdownLinks(file)) {
      if (/^(https?:|mailto:|#|\/)/.test(raw)) continue

      const [withoutAnchor] = raw.split("#")
      if (!withoutAnchor) continue

      const target = resolve(base, withoutAnchor)
      if (!existsSync(target)) {
        errors.push(`${file}: missing link → ${raw}`)
      }
    }
  }

  return errors
}

function checkPathDrift(): string[] {
  const checks: Array<[string, RegExp, string]> = [
    [
      ".flox/env/manifest.toml",
      /\$PWD\/cli\//,
      "Flox hook still points at old cli/ path; use src/cli/ after repo reorg.",
    ],
    [
      "playbooks/terminal-stack.md",
      /src\/cli\/[^\n]*\bnpm install\b/,
      "CLI install playbook uses npm install; this project standard is bun install.",
    ],
    [
      "docs/edinburgh-protocol-eval.md",
      /(?<!src\/)cli\/pi-check\/edinburgh-eval\.ts/,
      "Doc references old cli/pi-check path; use src/cli/pi-check.",
    ],
  ]

  const errors: string[] = []
  for (const [file, pattern, message] of checks) {
    if (!existsSync(file)) continue
    const text = readFileSync(file, "utf-8")
    if (pattern.test(text)) errors.push(`${file}: ${message}`)
  }
  return errors
}

function main(): number {
  const errors: string[] = []

  const manifest = manifestLinks()
  const actual = indexedFiles()

  const missingFromManifest = [...actual].filter((file) => !manifest.has(file)).sort()
  const staleInManifest = [...manifest].filter((file) => !actual.has(file)).sort()

  if (missingFromManifest.length > 0) {
    errors.push(`MANIFEST.md missing ${missingFromManifest.length} file(s):`)
    for (const file of missingFromManifest) errors.push(`  - ${file}`)
  }

  if (staleInManifest.length > 0) {
    errors.push(`MANIFEST.md lists ${staleInManifest.length} missing file(s):`)
    for (const file of staleInManifest) errors.push(`  - ${file}`)
  }

  errors.push(...checkLinks())
  errors.push(...checkPathDrift())

  if (errors.length === 0) {
    console.log("✓ Manifest checks passed")
    return 0
  }

  console.error("✗ Manifest checks failed")
  for (const error of errors) console.error(`  ${error}`)
  return 1
}

process.exit(main())
