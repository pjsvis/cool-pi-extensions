// Zod schema for ~/.pi/agent/models.json — the single source of truth.
//
// Structure is validated here (does it parse?); policy is validated in
// store.validate() (does it make sense? — duplicate IDs, missing cost, etc.).
// The inferred types are re-exported from ../types.ts so every existing
// `import type { ... } from "./types"` keeps working.
//
// Derived from the real models.json + the prior hand-written interfaces in
// types.ts. Every Compat flag below is a real pi compat flag (not all appear
// in this operator's file, but all are valid). Underscore-prefixed fields
// (`_note`, `_launch`, `_squadron_note`) are operator annotations that pi
// passes through without consuming; they are typed explicitly so the schema
// recognises them, and every object uses .passthrough() so a *new*
// annotation field added by hand never breaks structural validation.

import { z } from "zod";

// ── Primitives & enums ─────────────────────────────────────────────

/** Input modality. Left extensible so pi can add more without a schema bump. */
export const InputModalitySchema = z.enum(["text", "image", "audio", "video"]);

/**
 * API transport / wire shape. Known values: "openai-completions",
 * "anthropic-messages". Kept as a free string so new transports don't
 * invalidate existing config.
 */
export const ApiKindSchema = z
  .string()
  .describe("API transport, e.g. openai-completions | anthropic-messages");

export const MaxTokensFieldSchema = z.enum([
  "max_completion_tokens",
  "max_tokens",
]);

export const ThinkingLevelSchema = z.enum([
  "off",
  "minimal",
  "low",
  "medium",
  "high",
  "xhigh",
]);
export type ThinkingLevel = z.infer<typeof ThinkingLevelSchema>;

export const ThinkingLevelMapSchema = z.record(
  ThinkingLevelSchema,
  z.string().nullable(),
);
export type ThinkingLevelMap = z.infer<typeof ThinkingLevelMapSchema>;

export const ThinkingFormatSchema = z.enum([
  "openai",
  "openrouter",
  "deepseek",
  "together",
  "zai",
  "qwen",
  "qwen-chat-template",
]);

/**
 * apiKey. Either a literal (e.g. "ollama") or a resolve sentinel of the form
 * `!skate get <key>` (see store.skateKeyName). Both forms validate here;
 * whether a sentinel actually resolves is a runtime/policy concern.
 */
export const ApiKeySchema = z.string();

// ── Cost (per-million-token, USD) ──────────────────────────────────

export const CostSchema = z
  .object({
    input: z.number().min(0),
    output: z.number().min(0),
    cacheRead: z.number().min(0),
    cacheWrite: z.number().min(0),
    _note: z.string().optional(),
  })
  .passthrough();
export type Cost = z.infer<typeof CostSchema>;

/** A Cost where every field (including the core four) is optional. */
export const PartialCostSchema = z
  .object({
    input: z.number().min(0).optional(),
    output: z.number().min(0).optional(),
    cacheRead: z.number().min(0).optional(),
    cacheWrite: z.number().min(0).optional(),
    _note: z.string().optional(),
  })
  .passthrough();

// ── Compat ─────────────────────────────────────────────────────────

export const CompatSchema = z
  .object({
    supportsStore: z.boolean().optional(),
    supportsDeveloperRole: z.boolean().optional(),
    supportsReasoningEffort: z.boolean().optional(),
    supportsUsageInStreaming: z.boolean().optional(),
    maxTokensField: MaxTokensFieldSchema.optional(),
    requiresToolResultName: z.boolean().optional(),
    requiresAssistantAfterToolResult: z.boolean().optional(),
    requiresThinkingAsText: z.boolean().optional(),
    requiresReasoningContentOnAssistantMessages: z.boolean().optional(),
    thinkingFormat: ThinkingFormatSchema.optional(),
    cacheControlFormat: z.literal("anthropic").optional(),
    supportsStrictMode: z.boolean().optional(),
    supportsLongCacheRetention: z.boolean().optional(),
    openRouterRouting: z.record(z.string(), z.unknown()).optional(),
    vercelGatewayRouting: z.record(z.string(), z.unknown()).optional(),
  })
  .passthrough();
export type Compat = z.infer<typeof CompatSchema>;

// ── Model ──────────────────────────────────────────────────────────

export const ModelSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().optional(),
    reasoning: z.boolean().optional(),
    input: z.array(InputModalitySchema).optional(),
    cost: CostSchema.optional(),
    contextWindow: z.number().int().positive().optional(),
    maxTokens: z.number().int().positive().optional(),
    api: ApiKindSchema.optional(),
    baseUrl: z.string().optional(),
    headers: z.record(z.string(), z.string()).optional(),
    thinkingLevelMap: ThinkingLevelMapSchema.optional(),
    compat: CompatSchema.optional(),
    // operator annotations / lifecycle (passed through, not consumed by pi)
    _launch: z.boolean().optional(),
    status: z.string().optional(), // e.g. "deprecated"
    _note: z.string().optional(),
  })
  .passthrough();
export type Model = z.infer<typeof ModelSchema>;

/**
 * Known top-level model keys, for typo-detection in store.validate().
 * Derived from the schema so it can never drift.
 */
export const MODEL_KEYS = new Set(Object.keys(ModelSchema.shape));

// ── ModelOverride ──────────────────────────────────────────────────
// Keyed by model id in ProviderConfig.modelOverrides. All fields optional.

export const ModelOverrideSchema = z
  .object({
    name: z.string().optional(),
    reasoning: z.boolean().optional(),
    input: z.array(InputModalitySchema).optional(),
    contextWindow: z.number().int().positive().optional(),
    maxTokens: z.number().int().positive().optional(),
    cost: PartialCostSchema.optional(),
    headers: z.record(z.string(), z.string()).optional(),
    compat: CompatSchema.optional(),
    _note: z.string().optional(),
  })
  .passthrough();
export type ModelOverride = z.infer<typeof ModelOverrideSchema>;

// ── Provider ───────────────────────────────────────────────────────

export const ProviderConfigSchema = z
  .object({
    baseUrl: z.string().optional(),
    api: ApiKindSchema.optional(),
    apiKey: ApiKeySchema.optional(),
    headers: z.record(z.string(), z.string()).optional(),
    authHeader: z.boolean().optional(),
    models: z.array(ModelSchema).optional(),
    modelOverrides: z.record(z.string(), ModelOverrideSchema).optional(),
    compat: CompatSchema.optional(),
    _squadron_note: z.string().optional(),
  })
  .passthrough();
export type ProviderConfig = z.infer<typeof ProviderConfigSchema>;

/**
 * Known top-level provider keys, for typo-detection in store.validate().
 */
export const PROVIDER_KEYS = new Set(Object.keys(ProviderConfigSchema.shape));

// ── Top level ──────────────────────────────────────────────────────

export const ModelsFileSchema = z.object({
  providers: z.record(z.string(), ProviderConfigSchema),
});
export type ModelsFile = z.infer<typeof ModelsFileSchema>;
