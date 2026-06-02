import { defineCommand } from "citty";
import { load, validate } from "../store.js";

export default defineCommand({
  meta: {
    name: "validate",
    description: "Validate models.json for errors and warnings",
  },
  async run() {
    const data = load();
    const issues = validate(data);

    const errors = issues.filter((i) => i.level === "error");
    const warnings = issues.filter((i) => i.level === "warning");

    if (errors.length > 0) {
      console.log("ERRORS:");
      for (const e of errors) console.log(`  ❌  ${e.message}`);
    }
    if (warnings.length > 0) {
      console.log("WARNINGS:");
      for (const w of warnings) console.log(`  ⚠️   ${w.message}`);
    }

    if (errors.length === 0 && warnings.length === 0) {
      console.log("✅  models.json is valid.");
    } else if (errors.length === 0) {
      console.log("✅  No errors (warnings only — normal for local/Ollama models).");
    }

    if (errors.length > 0) process.exit(1);
  },
});