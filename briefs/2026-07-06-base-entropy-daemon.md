# Project Brief: `pi-entropy-watcher` (v0.1 Trace Diagnostic)

## Core Objective

Deploy a background daemon that operates as an entropy diagnostic device. Instead of fine-tuning, v0.1 leverages the innate behavior of reasoning models (like DeepSeek R1 Distill): mapping logical load paths in `<think>` blocks. We measure the volume of the model's internal monologue to detect systemic contradictions.

## The Operational Mechanics

1. **Ingestion:** A lightweight Bun process uses `fs.watch` to monitor the active directory. It debounces file saves to prevent thrashing.
2. **The Tensegrity Check:** When a file changes, the delta is pushed to a local inference endpoint. The system prompt forces the model to apply the Edinburgh Protocol and output its reasoning in a `<think>` block.
3. **The Trace Heuristic:** We ignore the model's final summary. We extract the `<think>` block and measure its character count.
* *Low Entropy (< 500 chars):* The logic is grounded. Silent pass.
* *High Entropy (> 1500 chars):* The model is attempting to reconcile ungrounded assumptions or structural contradictions.


4. **Interjection:** If the trace crosses the panic threshold, the daemon logs the event and throws a terminal alert.

---

## The Codebase

### 1. `evaluator.ts` (The Trace Engine)

This module handles the call to the local model (assuming a standard local API like Ollama on port 11434) and extracts the heuristic data.

```typescript
// evaluator.ts
const LOCAL_LLM_URL = "http://localhost:11434/api/generate";
const MODEL_NAME = "deepseek-r1:14b"; // Swap for whatever reasoning substrate is active

const SYSTEM_PROMPT = `
You are an Entropy Observer applying the Edinburgh Protocol.
Analyze the provided text.
You MUST start your response with a <think> block.
Inside the <think> block, perform a structural tensegrity check:
1. Identify ungrounded assumptions.
2. Trace the logical load path.
3. Flag any contradictions.
Keep the trace brief if the logic is sound. Expand the trace if you encounter structural contradictions.
Output a final summary after the think block.
`;

export async function evaluateEntropy(fileContent: string, fileName: string) {
  console.log(`[Watcher] Pushing ${fileName} to inference...`);

  try {
    const response = await fetch(LOCAL_LLM_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL_NAME,
        prompt: `${SYSTEM_PROMPT}\n\nTarget File: ${fileName}\n\nContent:\n${fileContent}`,
        stream: false,
      }),
    });

    const data = await response.json();
    const output = data.response;

    // Extract the <think> block
    const thinkMatch = output.match(/<think>([\s\S]*?)<\/think>/);
    const thinkTrace = thinkMatch ? thinkMatch[1].trim() : "";
    const traceLength = thinkTrace.length;

    analyzeSpike(fileName, traceLength, thinkTrace);

  } catch (error) {
    console.error(`[Watcher] Inference connection failed: ${error}`);
  }
}

function analyzeSpike(fileName: string, traceLength: number, trace: string) {
  const THRESHOLD = 1500; // Character count indicating structural panic

  if (traceLength < 500) {
    console.log(`[Stable] ${fileName} (Trace length: ${traceLength}) - Logic grounded.`);
  } else if (traceLength >= 500 && traceLength < THRESHOLD) {
    console.log(`[Drift] ${fileName} (Trace length: ${traceLength}) - Minor assumptions detected.`);
  } else {
    console.log(`\n⚠️  ENTROPY SPIKE DETECTED in ${fileName} ⚠️`);
    console.log(`Model required ${traceLength} chars to reconcile contradictions.`);
    console.log(`--- Trace Excerpt ---`);
    // Output the first 300 chars of the panic trace for context
    console.log(`${trace.substring(0, 300)}...\n`);
  }
}

```

### 2. `watcher.ts` (The Ingestion Daemon)

This is the entry point. It uses Bun's native, blisteringly fast `fs.watch` and a simple debounce mechanism to queue evaluations.

```typescript
// watcher.ts
import { watch } from "fs";
import { evaluateEntropy } from "./evaluator.ts";

const TARGET_DIR = process.cwd();
const DEBOUNCE_MS = 10000; // Wait 10 seconds after last save before evaluating

let timeout: Timer | null = null;
const pendingFiles = new Set<string>();

console.log(`[Entropy Watcher] Monitoring ${TARGET_DIR} for structural drift...`);

watch(TARGET_DIR, { recursive: true }, (event, filename) => {
  if (!filename || filename.startsWith(".") || filename.endsWith(".db")) return;

  // Add file to the queue
  pendingFiles.add(filename);

  // Reset the debounce timer
  if (timeout) clearTimeout(timeout);

  timeout = setTimeout(() => {
    processQueue();
  }, DEBOUNCE_MS);
});

async function processQueue() {
  const filesToProcess = Array.from(pendingFiles);
  pendingFiles.clear();

  for (const file of filesToProcess) {
    try {
      const content = await Bun.file(file).text();
      // Skip empty files or massive binaries
      if (content.trim().length === 0 || content.length > 50000) continue; 
      
      await evaluateEntropy(content, file);
    } catch (e) {
      console.error(`[Watcher] Could not read ${file}`);
    }
  }
}

```

Running `bun run watcher.ts` spins up the daemon. It sits quietly, grabbing the diffs, forcing the local model to trace the load paths, and flagging the exact moment the logic breaks down. We let this run for a few weeks to gather the baseline data, and we'll immediately know if the trace heuristic holds up in practice.