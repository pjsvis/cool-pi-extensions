// pi-eval list — show models available for eval (Ollama + recommended).

import { defineCommand } from "citty";
import { listOllamaModels, DEFAULT_EXCLUDE_LIST } from "../lib/index.js";

const CYAN = "\x1b[0;36m", DIM = "\x1b[2m", GREEN = "\x1b[0;32m", RESET = "\x1b[0m";

const RECOMMENDED = [
  "inception/mercury-2",
  "nvidia/nemotron-3-nano-30b-a3b:free",
];

export const listCommand = defineCommand({
  meta: {
    name: "list",
    description: "Show models available for eval",
  },
  args: {},
  async run() {
    console.log(`${CYAN}Recommended for eval:${RESET}`);
    for (const m of RECOMMENDED) console.log(`  ${GREEN}•${RESET} ${m}`);

    console.log(`\n${CYAN}Ollama models:${RESET}`);
    const ollama = await listOllamaModels();
    if (ollama.length === 0) {
      console.log(`  ${DIM}(Ollama not running or no models)${RESET}`);
    } else {
      for (const m of ollama) console.log(`  ${m}`);
    }

    if (DEFAULT_EXCLUDE_LIST.length > 0) {
      console.log(`\n${CYAN}Default excludes (muppet-substrates):${RESET}`);
      for (const m of DEFAULT_EXCLUDE_LIST) console.log(`  ${DIM}${m}${RESET}`);
    }

    console.log(`\n${DIM}OpenRouter/ZenMux models are referenced by org/model slug (e.g. 'inception/mercury-2').${RESET}`);
    console.log(`${DIM}Use 'pi-eval run <model> --fixture=<key>' to eval a specific model.${RESET}`);
  },
});
