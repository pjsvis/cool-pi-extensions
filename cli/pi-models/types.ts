/** Per-million-token cost. All values in USD. */
export interface Cost {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
}

export interface Compat {
  supportsStore?: boolean;
  supportsDeveloperRole?: boolean;
  supportsReasoningEffort?: boolean;
  supportsUsageInStreaming?: boolean;
  maxTokensField?: "max_completion_tokens" | "max_tokens";
  requiresToolResultName?: boolean;
  requiresAssistantAfterToolResult?: boolean;
  requiresThinkingAsText?: boolean;
  requiresReasoningContentOnAssistantMessages?: boolean;
  thinkingFormat?:
    | "openai"
    | "openrouter"
    | "deepseek"
    | "together"
    | "zai"
    | "qwen"
    | "qwen-chat-template";
  cacheControlFormat?: "anthropic";
  supportsStrictMode?: boolean;
  supportsLongCacheRetention?: boolean;
  openRouterRouting?: Record<string, unknown>;
  vercelGatewayRouting?: Record<string, unknown>;
  [key: string]: unknown;
}

export type ThinkingLevel = "off" | "minimal" | "low" | "medium" | "high" | "xhigh";
export type ThinkingLevelMap = Partial<Record<ThinkingLevel, string | null>>;

export interface Model {
  id: string;
  name?: string;
  reasoning?: boolean;
  input?: ("text" | "image")[];
  cost?: Cost;
  contextWindow?: number;
  maxTokens?: number;
  api?: string;
  baseUrl?: string;
  headers?: Record<string, string>;
  thinkingLevelMap?: ThinkingLevelMap;
  compat?: Compat;
  [key: string]: unknown;
}

export type ModelOverride = Partial<
  Pick<Model, "name" | "reasoning" | "input" | "contextWindow" | "maxTokens"> & {
    cost: Partial<Cost>;
    headers: Record<string, string>;
    compat: Compat;
  }
>;

export interface ProviderConfig {
  baseUrl?: string;
  api?: string;
  apiKey?: string;
  headers?: Record<string, string>;
  authHeader?: boolean;
  models?: Model[];
  modelOverrides?: Record<string, ModelOverride>;
  compat?: Compat;
  [key: string]: unknown;
}

export interface ModelsFile {
  providers: Record<string, ProviderConfig>;
}
