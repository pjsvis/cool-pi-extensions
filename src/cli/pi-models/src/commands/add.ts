import { defineCommand } from "citty";
import { load, ensureProvider, findModel, save } from "../store.js";
import { resolveApiKey } from "../resolve.js";

const COMPAT_FLAG_RE = /^compat\.(.+)$/;

function parseCompat(rawFlags: Record<string, string | boolean>): Record<string, unknown> | undefined {
  const compat: Record<string, unknown> = {};
  let hasAny = false;

  for (const [key, val] of Object.entries(rawFlags)) {
    const m = key.match(COMPAT_FLAG_RE);
    if (!m) continue;
    hasAny = true;

    const compatKey = m[1];
    if (val === "true") compat[compatKey] = true;
    else if (val === "false") compat[compatKey] = false;
    else if (!isNaN(Number(val))) compat[compatKey] = Number(val);
    else compat[compatKey] = val;
  }

  return hasAny ? compat : undefined;
}

export default defineCommand({
  meta: {
    name: "add",
    description: "Add a model to a provider (creates provider if needed)",
  },
  args: {
    provider: {
      type: "positional",
      description: "Provider name (e.g. minimax)",
      required: true,
    },
    model: {
      type: "positional",
      description: "Model ID (e.g. MiniMax-M3)",
      required: true,
    },
    name: {
      type: "string",
      description: "Display name (defaults to model ID)",
      required: false,
    },
    reasoning: {
      type: "boolean",
      description: "Model supports extended thinking",
      default: false,
    },
    "no-reasoning": {
      type: "boolean",
      description: "Explicitly disable reasoning",
      default: false,
    },
    input: {
      type: "string",
      description: "Input types: text or text+image",
      default: "text",
    },
    price: {
      type: "string",
      description: "Cost: input/output per million tokens (e.g. 0.60/3.00)",
    },
    cache: {
      type: "string",
      description: "Cache cost: read/write per million tokens (e.g. 0.06/0.30)",
    },
    context: {
      type: "string",
      description: "Context window in tokens (e.g. 200000)",
    },
    "max-tokens": {
      type: "string",
      description: "Max output tokens",
    },
    "base-url": {
      type: "string",
      description: "Provider base URL (only needed once per provider)",
    },
    "api-key": {
      type: "string",
      description: 'API key: literal, $ENV_VAR, or !command (e.g. "!skate get minimax_api_key")',
    },
    api: {
      type: "string",
      description: "API type (default: openai-completions)",
    },
    ...Object.fromEntries(
      [
        "supportsDeveloperRole",
        "supportsReasoningEffort",
        "supportsUsageInStreaming",
        "requiresToolResultName",
        "requiresAssistantAfterToolResult",
        "requiresThinkingAsText",
        "requiresReasoningContentOnAssistantMessages",
        "supportsStrictMode",
        "supportsLongCacheRetention",
        "supportsStore",
      ].map((k) => [`compat.${k}`, { type: "string", description: `Compat: ${k}`, required: false }]),
    ),
    "compat.maxTokensField": {
      type: "string",
      description: 'Compat: maxTokensField (max_completion_tokens or max_tokens)',
    },
    "compat.thinkingFormat": {
      type: "string",
      description: "Compat: thinkingFormat (deepseek, qwen, openrouter, together, zai)",
    },
    "compat.cacheControlFormat": {
      type: "string",
      description: "Compat: cacheControlFormat (anthropic)",
    },
  } as const,
  async run({ args }) {
    const data = load();
    const cfg = ensureProvider(data, args.provider);

    if (findModel(cfg, args.model as string)) {
      console.error(`Model "${args.model}" already exists in provider "${args.provider}".`);
      process.exit(1);
    }

    // Provider-level fields (set only if provided)
    if (args["base-url"]) cfg.baseUrl = args["base-url"] as string;
    if (args["api-key"]) cfg.apiKey = args["api-key"] as string;
    if (args["api"]) cfg.api = args["api"] as string;

    // Build model
    const id = args.model as string;
    const reasoning = args["no-reasoning"] ? false : args.reasoning ? true : undefined;

    const inputRaw = (args.input as string) ?? "text";
    const input: ("text" | "image")[] =
      inputRaw === "text+image" ? ["text", "image"] : ["text"];

    let cost;
    if (args.price) {
      const [inStr, outStr] = (args.price as string).split("/");
      const cacheRaw = args.cache as string | undefined;
      const [cr, cw] = cacheRaw ? cacheRaw.split("/") : [undefined, undefined];
      cost = {
        input: parseFloat(inStr),
        output: parseFloat(outStr),
        cacheRead: cr ? parseFloat(cr) : parseFloat(inStr) * 0.1,
        cacheWrite: cw ? parseFloat(cw) : parseFloat(inStr) * 0.25,
      };
    }

    const contextWindow = args.context ? parseInt(args.context as string) : undefined;
    const maxTokens = args["max-tokens"] ? parseInt(args["max-tokens"] as string) : undefined;
    const compat = parseCompat(args as Record<string, string | boolean>);

    const model: Record<string, unknown> = { id };
    if (args.name) model.name = args.name;
    if (reasoning !== undefined) model.reasoning = reasoning;
    model.input = input;
    if (cost) model.cost = cost;
    if (contextWindow) model.contextWindow = contextWindow;
    if (maxTokens) model.maxTokens = maxTokens;
    if (compat) model.compat = compat;

    if (!cfg.models) cfg.models = [];
    cfg.models.push(model as any);
    save(data);

    console.log(`Added ${id} to provider "${args.provider}".`);
    console.log(`Provider "${args.provider}" now has ${cfg.models.length} model(s).`);

    // Show resolved key once
    if (cfg.apiKey?.startsWith("!")) {
      try {
        const resolved = await resolveApiKey(cfg.apiKey);
        if (resolved) {
          console.log(`Key resolves: ${resolved.slice(0, 12)}...${resolved.slice(-4)}`);
        }
      } catch {
        console.log(`Key: could not resolve — command may require auth session.`);
      }
    }
  },
});