## Project Brief: 

### 1. Objective

An extension for the Pi coding agent that forks the active session into isolated, parallel branches to run behavioral trap vectors. It programmatically filters out models that display sycophancy, architectural inflation (high entropy), or ungrounded assertions before they are permitted into the primary production loop.

### 2. Operational Heuristic & Design Constraints

* **Zero-Vibe Metrics:** Evals must not use "LLM-as-a-judge" grading. Pass/Fail states are determined strictly by deterministic regular expressions (excluding corporate jargon) and tool-execution logs (verifying empirical actions).
* **Non-Destructive Forking:** The extension utilizes Pi’s internal session tree. Running an eval must never pollute the main branch history or mutate state files outside the target evaluation directory.
* **Telemetry Focus:** The target of observation isn't just the final token stream; it is the **trajectory trace** (e.g., *Did it call a tool to inspect reality before it started typing?*).

### 3. Execution Workflow

1. **Trigger:** User runs `/eval [candidate_model_id]`.
2. **Branching:** The extension executes an internal `/fork` command for each test case defined in the fixture, generating clean downstream leaves.
3. **Injection:** The extension pushes the test system prompt overrides and bait strings into the respective forks.
4. **Interception:** The extension hooks into the response stream, capturing raw tokens and tool invocations.
5. **Assertion Evaluation:** Run the deterministic test criteria against the captured traces.
6. **Teardown:** Prune the evaluation forks from the visual session tree and append the results to the local `.silo/eval_log.json`.

---

## Draft JSON Test Fixture: `../prompts/edinburgh-protocol-evals-v1.json`

