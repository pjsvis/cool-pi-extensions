// pi-eval fixtures — list + validate available eval fixtures.

import { defineCommand } from "citty";
import { listFixtures, validateFixture, loadFixture } from "../lib/index.js";

const CYAN = "\x1b[0;36m", GREEN = "\x1b[0;32m", RED = "\x1b[0;31m", DIM = "\x1b[2m", RESET = "\x1b[0m";

export const fixturesCommand = defineCommand({
  meta: {
    name: "fixtures",
    description: "List and validate available eval fixtures",
  },
  args: {
    validate: {
      type: "boolean",
      description: "Validate each fixture's structural integrity",
      default: false,
    },
  },
  async run({ args }) {
    const fixtures = listFixtures();

    console.log(`${CYAN}Available fixtures:${RESET}\n`);
    console.log(`  ${DIM}Key           Tests  Version  Suite${RESET}`);
    console.log(`  ${DIM}${"─".repeat(70)}${RESET}`);

    for (const f of fixtures) {
      const keyPadded = f.key.padEnd(14);
      const testCount = String(f.testCount).padStart(5);
      const version = f.version.padEnd(8);
      const valid = args.validate ? validateFixture(loadFixture(f.key)) : [];
      const statusIcon = f.testCount === 0
        ? `${RED}✗${RESET}`
        : args.validate && valid.length > 0
          ? `${RED}✗${RESET}`
          : `${GREEN}✓${RESET}`;
      console.log(`  ${statusIcon} ${keyPadded} ${testCount}  ${version} ${f.suiteName}`);
      if (args.validate && valid.length > 0) {
        for (const err of valid) console.log(`      ${RED}${err}${RESET}`);
      }
    }

    console.log(`\n${DIM}Use 'pi-eval run <model> --fixture=<key>' to run a fixture.${RESET}`);
  },
});
