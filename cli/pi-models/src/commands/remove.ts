import { defineCommand } from "citty";
import { load, save } from "../store.js";

export default defineCommand({
  meta: {
    name: "remove",
    description: "Remove a model from a provider",
  },
  args: {
    provider: {
      type: "positional",
      description: "Provider name",
      required: true,
    },
    model: {
      type: "positional",
      description: "Model ID to remove",
      required: true,
    },
  },
  async run({ args }) {
    const data = load();
    const cfg = data.providers[args.provider as string];

    if (!cfg) {
      console.error(`Provider "${args.provider}" not found.`);
      process.exit(1);
    }
    if (!cfg.models?.some((m) => m.id === args.model)) {
      console.error(`Model "${args.model}" not found in provider "${args.provider}".`);
      process.exit(1);
    }

    cfg.models = cfg.models.filter((m) => m.id !== args.model);

    // Remove empty provider (unless it has overrides)
    const hasOverrides =
      cfg.modelOverrides && Object.keys(cfg.modelOverrides).length > 0;
    if ((!cfg.models || cfg.models.length === 0) && !hasOverrides) {
      delete data.providers[args.provider as string];
      console.log(
        `Removed "${args.model}" and deleted empty provider "${args.provider}".`,
      );
    } else {
      console.log(`Removed "${args.model}" from provider "${args.provider}".`);
    }

    save(data);
  },
});