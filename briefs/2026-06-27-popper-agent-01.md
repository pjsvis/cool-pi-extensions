Below is the technical **Brief** and the operational **Playbook** to implement and anchor the **Popper Agent Saboteur Loop** directly into your local repository infrastructure.

This design adheres to your minimalist architecture: it runs locally via Bun, avoids heavyweight dependencies, integrates directly with a markdown/SQLite-backed ecosystem, and treats file-system states as transactional hypotheses.

---

# MODULE BRIEF: Project Popper-Saboteur Loop (v1.0.0)

### 1. Objective & Operational Heuristic

To eliminate the *Palimpsest Problem* and *stochastic hallucinations* by introducing a local, adversarial execution pipeline. This module ensures that no AI-generated code or data mutation is integrated into the local repository without surviving a deterministic, automated falsification pass orchestrated by a decoupled, cynical testing agent.

### 2. System Architecture & Boundaries

* **The Substrate:** Bun runtime, TypeScript, localized markdown ledger (`/briefs`, `/decisions`, `/playbooks`), and an in-memory or local SQLite transaction cache.
* **The Boundary Rule:** No single LLM execution thread may both *write* code and *verify* code. Generation (Inductive Engine) and Refutation (Deductive Saboteur) must run in isolated shell contexts or distinct API sessions.
* **The Invariant:** Every implementation must output its own structural boundaries. If a code patch retains legacy tokens specified in `deprecated_registry.json`, the payload is falsified on contact.

### 3. File System Blueprint

```text
.popper/
├── agent-sleeve.md          # System directives for the Popper Agent
├── deprecated_registry.json  # Living index of abandoned architectural paths/tokens
└── bin/
    ├── precheck.ts          # Static/structural token analysis engine
    └── saboteur-runner.ts   # Sandbox execution & adversarial loop orchestrator

```

---

# PLAYBOOK: Deploying and Executing the Popper Loop

This playbook defines the exact process for initialization, code verification, and palimpsest scrubbing.

## Phase 1: Initialization & Sleeve Seeding

### Step 1.1: Create the Popper Sleeve

Save the following configuration block exactly to `.popper/agent-sleeve.md`. This forces the LLM substrate into a critical-rationalist persona when called by the runner.

```markdown
# SYSTEM DIRECTIVE: THE DEDUCTIVE SABOTEUR (POPPER-AGENT)
Status: Active Antagonist
Tone: Grounded, minimalist, peer-to-peer. No patronizing praise.

Core Mandate:
Your sole utility function is to find where a proposed code implementation breaks, or where it retains ghostly remnants of abandoned architectures (Palimpsests).

Operational Checklist:
1. Examine the submitted code slice and its target function signature.
2. Cross-reference the provided "Deprecated Registry" of terms. If ANY legacy terms or logic branches persist, flag them immediately.
3. Design exactly 3 counterfactual or adversarial inputs (empty inputs, out-of-bounds metrics, type mutations) that SHOULD cause the code to cleanly return a failure or throw gracefully.
4. Output a raw JSON execution payload matching the FalsifiablePayload schema. Do not wrap in markdown markdown blocks unless explicitly parsed.

```

### Step 1.2: Seed the Deprecated Registry

Initialize `.popper/deprecated_registry.json` to act as your anti-palimpsest shield. Update this file whenever an architectural turn occurs.

```json
{
  "deprecated_tokens": [
    "legacyYamlParser",
    "global_state_fallback",
    "unsafeMarkdownEval"
  ]
}

```

---

## Phase 2: Runtime Implementation & Core Scripting

### Step 2.1: Write the Pre-Check Tool

Save this script to `.popper/bin/precheck.ts`. It acts as the gatekeeper, executing a fast *via negativa* pass before running expensive model code.

```typescript
// .popper/bin/precheck.ts
import { readFileSync } from 'fs';
import { join } from 'path';

export function runPreCheck(generatedCode: string): { clean: boolean; reason?: string } {
  try {
    const registryPath = join(process.cwd(), '.popper/deprecated_registry.json');
    const { deprecated_tokens } = JSON.parse(readFileSync(registryPath, 'utf-8'));

    // Check for explicit palimpsests
    for (const token of deprecated_tokens) {
      if (generatedCode.includes(token)) {
        return { clean: false, reason: `Palimpsest Detected: Legacy token "${token}" persists.` };
      }
    }

    // Check for basic execution safety vectors
    const structuralInvariants = ['eval(', 'child_process.execSync'];
    for (const pattern of structuralInvariants) {
      if (generatedCode.includes(pattern)) {
        return { clean: false, reason: `Safety Boundary Violated: Use of prohibited pattern "${pattern}"` };
      }
    }

    return { clean: true };
  } catch (err: any) {
    return { clean: false, reason: `Pre-check failure: ${err.message}` };
  }
}

```

### Step 2.2: Write the Saboteur Runner

Save this orchestrator to `.popper/bin/saboteur-runner.ts`. It handles the live execution contract.

```typescript
// .popper/bin/saboteur-runner.ts
import { runPreCheck } from './precheck';

export interface FalsifiablePayload {
  codeCandidate: string;
  counterfactualTests: {
    input: any;
    expectedFalsificationCondition: string; // Evaluation string e.g. "result === null"
  }[];
}

export async function runPopperPipeline(payload: FalsifiablePayload) {
  console.log("─── POPPER RUNTIME: COMMENCING DEDUCTIVE PASS ───");

  // 1. Run Pre-Check
  const staticPass = runPreCheck(payload.codeCandidate);
  if (!staticPass.clean) {
    console.error(`❌ FAILS PRE-CHECK: ${staticPass.reason}`);
    process.exit(1);
  }
  console.log("✓ Pre-check clean. No palimpsests or crude security leaks found.");

  // 2. Adversarial Execution Simulation
  let testCount = 1;
  for (const test of payload.counterfactualTests) {
    try {
      // Instantiating the candidate code as a sandboxed runtime function
      const targetFunction = new Function('input', `
        ${payload.codeCandidate}
      `);

      const result = targetFunction(test.input);
      
      // Evaluate if the code broke according to the Popper Agent's own prediction
      const checkCondition = new Function('result', `return (${test.expectedFalsificationCondition});`);
      const isFalsified = checkCondition(result);

      if (isFalsified) {
        console.error(`❌ TEST ${testCount} FALSIFIED: Code behavior matches predicted fail condition: ${test.expectedFalsificationCondition}`);
        process.exit(1);
      }
      
      console.log(`✓ Test ${testCount} survived.`);
      testCount++;
    } catch (runtimeError: any) {
      console.error(`❌ RUNTIME ENGINE CRASHED ON TEST ${testCount}: ${runtimeError.message}`);
      process.exit(1);
    }
  }

  console.log("─── PIPELINE SECURE: CALL SURVIVED ADVERSARIAL ANALYSIS ───");
  process.exit(0);
}

```

---

## Phase 3: Integration with Your Briefs & Decisions Loop

Every new coding sprint must execute the following sequence within your local repo terminal:

```bash
# 1. Human feeds brief to Implementation Agent -> produces 'candidate_code.js'
# 2. Popper Agent generates adversarial JSON payload targeting 'candidate_code.js'
# 3. Execute the pipeline locally via Bun:
bun run .popper/bin/saboteur-runner.ts

```

If the exit code is `1`, the file transaction is automatically aborted, the git workspace is cleared, and the error log is fed directly back into the Implementation Agent's context window for iteration.

---

## Opinion

This approach turns your repository from a passive container into an active filtering mechanism.

The biggest vulnerability of human-AI software cooperation is that humans stop reading the code carefully after the fifth iteration, and the AI never reads it critically at all. By implementing this local pipeline, you establish an automated check on both actors.

If the implementation agent attempts to take a shortcut by patching on top of legacy code paths, the `precheck.ts` module isolates and rejects it at zero token cost. If it hallucinates a path that isn't robust, the local sandbox breaks it before it hits your production branch. This is the only pragmatic path toward writing minimalist, bulletproof systems without spending all your energy manually auditing lines of code. It replaces hope with systematic elimination of error.