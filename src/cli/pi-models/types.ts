// Type surface for models.json.
//
// The Zod schema in ./src/schema is the single source of truth; these are
// type-only re-exports so every existing `import type { ... } from "./types"`
// keeps resolving. Add new fields to the schema, not here.
export type {
  ModelsFile,
  ProviderConfig,
  Model,
  ModelOverride,
  Cost,
  Compat,
  ThinkingLevel,
  ThinkingLevelMap,
} from "./src/schema";
