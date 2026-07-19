#!/usr/bin/env bun
/**
 * scripts/gen-registers.ts — generate per-folder register.jsonl + MANIFEST.md roll-up.
 *
 * Shannon-style structural checksum. Run via `just registers`. Each register is
 * a deterministic function of its folder; `git diff` on a committed register IS
 * the structural delta. The MANIFEST.md marked block (<!-- BEGIN/END REGISTERS
 * -->) is regenerated; sections outside the markers are preserved verbatim.
 *
 * Substance is the Derrida Question's wall, not the checksum's.
 */
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import {
  ROOT, REGISTERED, BEGIN, END,
  buildEntries, renderRegisterJsonl, renderManifestBlock,
} from "./register-lib.ts";

function main(): void {
  let totalFiles = 0;
  for (const spec of REGISTERED) {
    const entries = buildEntries(spec.dir);
    totalFiles += entries.length;
    writeFileSync(join(ROOT, spec.dir, "register.jsonl"), renderRegisterJsonl(entries));
    process.stderr.write(`  ${spec.dir.padEnd(12)} ${String(entries.length).padStart(3)} files → ${spec.dir}/register.jsonl\n`);
  }

  // Regenerate only the marked block of MANIFEST.md; preserve everything else.
  const manifestPath = join(ROOT, "MANIFEST.md");
  let text = existsSync(manifestPath) ? readFileSync(manifestPath, "utf-8") : "";
  const block = renderManifestBlock();
  if (text.includes(BEGIN) && text.includes(END)) {
    text = text.replace(/<!-- BEGIN REGISTERS -->[\s\S]*?<!-- END REGISTERS -->/, block.trimEnd());
  } else {
    process.stderr.write(`  ⚠ MANIFEST.md has no ${BEGIN}/${END} markers — appending block at end\n`);
    text = text.trimEnd() + "\n\n" + block;
  }
  writeFileSync(manifestPath, text);
  process.stderr.write(`  ${"MANIFEST.md".padEnd(12)} roll-up (${totalFiles} files across ${REGISTERED.length} folders)\n`);
  process.stderr.write(`✓ registers generated — commit them; the gate verifies freshness\n`);
}

main();
