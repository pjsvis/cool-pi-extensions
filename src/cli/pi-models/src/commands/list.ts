import { defineCommand } from "citty";
import { load, skateKeyName } from "../store.js";
import { resolveApiKey } from "../resolve.js";

export default defineCommand({
  meta: {
    name: "list",
    description: "List all providers and models in models.json",
  },
  args: {
    provider: {
      type: "positional",
      description: "Filter to a specific provider",
      required: false,
    },
  },
  async run({ args }) {
    const data = load();
    const target = args.provider as string | undefined;

    if (target && !data.providers[target]) {
      console.error(`Provider "${target}" not found.`);
      process.exit(1);
    }

    const entries = target
      ? [[target, data.providers[target]]] as const
      : Object.entries(data.providers);

    if (entries.length === 0) {
      console.log("No providers configured.");
      return;
    }

    for (const [name, cfg] of entries) {
      const keyName = skateKeyName(cfg.apiKey);
      const keyLabel = keyName ? `!skate get ${keyName}` : cfg.apiKey ?? "(not set)";

      console.log(`\n${name}`);
      console.log(`  baseUrl: ${cfg.baseUrl ?? "(not set)"}`);
      console.log(`  api:     ${cfg.api ?? "(not set)"}`);
      console.log(`  apiKey:  ${keyLabel}`);

      // Resolve and show the actual key value
      if (keyName) {
        const resolved = await resolveApiKey(`!skate get ${keyName}`);
        if (resolved) {
          console.log(`  keyVal:  ${resolved.slice(0, 12)}...${resolved.slice(-4)}`);
        }
      }

      if (cfg.models && cfg.models.length > 0) {
        console.log(`  models (${cfg.models.length}):`);
        for (const m of cfg.models) {
          const reasoning = m.reasoning ? "🧠" : "  ";
          const input = (m.input ?? ["text"]).join(",");
          const ctx = m.contextWindow
            ? `${Math.round(m.contextWindow / 1000)}K`
            : "?";
          const cost = m.cost
            ? `$${m.cost.input}/$${m.cost.output}`
            : "?/?";
          console.log(
            `    ${reasoning} ${m.id.padEnd(26)} ${cost.padEnd(16)} ctx=${ctx.padEnd(7)} in=${input}`,
          );
        }
      }

      if (cfg.modelOverrides && Object.keys(cfg.modelOverrides).length > 0) {
        console.log(
          `  overrides (${Object.keys(cfg.modelOverrides).length}):`,
        );
        for (const [id, override] of Object.entries(cfg.modelOverrides)) {
          const parts: string[] = [];
          if (override.name) parts.push(`name=${override.name}`);
          if (override.cost)
            parts.push(
              `cost=$${override.cost.input ?? "?"}/$${override.cost.output ?? "?"}`,
            );
          console.log(`    ${id}: ${parts.join(", ") || "(custom)"}`);
        }
      }
    }
  },
});