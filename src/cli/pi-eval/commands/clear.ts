// pi-eval clear — invalidate cached eval results for a model.

import { defineCommand } from "citty";
import { loadConfig, invalidateCache } from "../lib/index.js";

const GREEN = "\x1b[0;32m", YELLOW = "\x1b[1;33m", RESET = "\x1b[0m";

export const clearCommand = defineCommand({
  meta: {
    name: "clear",
    description: "Invalidate cached eval results for a model",
  },
  args: {
    model: {
      type: "positional",
      description: "Model ID to clear from cache",
      required: true,
    },
  },
  async run({ args }) {
    const config = loadConfig();
    const removed = invalidateCache(args.model, config);
    if (removed > 0) {
      console.log(`${GREEN}✓${RESET} Cleared ${removed} cached result(s) for ${args.model}`);
    } else {
      console.log(`${YELLOW}No cached results for ${args.model}.${RESET}`);
    }
  },
});
