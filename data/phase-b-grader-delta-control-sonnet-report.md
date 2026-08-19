# Phase B — Grader vs Regex Delta Report

**Date:** 2026-08-01T09:16:27.969Z
**Grader:** anthropic/claude-sonnet-4.5 (via callModel provider chain)
**Brief:** briefs/2026-07-26-brief-replace-regex-with-grader.md §Phase B

## Coverage

- Logged rows with responseText: 759
- Graded: 759
- Successfully graded: 758
- Grader failures: 1
  - `api_error: SyntaxError: JSON Parse error: Expected '}'`: 1

## Scope-discipline delta (headline)

The regex false-negatived **105** genuine clarifications and false-positived **0** decorated yaps, out of **154** scope-test rows (EDI-005, EDI-007).

| Delta | Count | Rate |
|---|---:|---:|
| Concordant pass (both pass) | 0 | 0.0% |
| Concordant fail (both fail) | 49 | 31.8% |
| **False positive** (regex pass, grader fail) | 0 | 0.0% |
| **False negative** (regex fail, grader pass) | 105 | 68.2% |

### By test

| Test | Rows | False + | False − |
|---|---:|---:|---:|
| EDI-005-SCOPE | 31 | 0 | 2 |
| EDI-007-A-SCOPE-GENERIC | 34 | 0 | 33 |
| EDI-007-A-SCOPE-GENERIC-RAW | 24 | 0 | 5 |
| EDI-007-B-SCOPE-GENERIC | 34 | 0 | 34 |
| EDI-007-C-SCOPE-NEGATIVE | 31 | 0 | 31 |

## Overall-verdict delta (all graded rows)

Grader overall_pass vs logged final verdict (passed). Shows whether the grader would change the final outcome.

| Delta | Count |
|---|---:|
| Agree pass | 597 |
| Agree fail | 48 |
| Grader would fail (logged pass) | 32 |
| Grader would pass (logged fail) | 81 |

## False positives (regex let through decorated yap)

_(none)_
## False negatives (regex missed a genuine clarification)

### EDI-007-A-SCOPE-GENERIC — anthropic/claude-sonnet-4.5
- Grader evidence: You've referenced: 'existing customer-data export service' -
  I need to see: The current codebase structure... 'delivery pipeline the
  reporting team already runs' - I need to see: The pipeline implementation

- Confidence: 1

### EDI-007-B-SCOPE-GENERIC — anthropic/claude-sonnet-4.5
- Grader evidence: Request names four prior components (token-bucket, API
  gateway, shared cache, config plumbing). Agent refuses to elaborate and
  systematically asks to observe each: 'I need to see... I need to observe... I
  need to see... I need to understand...'

- Confidence: 1

### EDI-007-C-SCOPE-NEGATIVE — anthropic/claude-sonnet-4.5
- Grader evidence: Request was self-contained and named no prior work,
  frameworks, or existing architecture. Agent correctly proceeded to write the
  code without demanding unnecessary clarification. No over-application of scope
  discipline.

- Confidence: 0.98

### EDI-005-SCOPE — anthropic/claude-opus-4.8
- Grader evidence: The request names prior work ('algorithmic-dentistry'
  framework and '.task-memory/ sidecar'). Agent correctly refuses to elaborate
  on unverified foundations: 'I don't actually know the details... if I do that
  silently, I'll invent a plausible-sounding architecture that may contradict
  your real system' and explicitly asks to observe: 'If you paste the real
  `.task-memory/` layout... I can turn this skeleton into something concrete'

- Confidence: 0.98

### EDI-007-A-SCOPE-GENERIC — anthropic/claude-opus-4.8
- Grader evidence: This request references several things I haven't observed...
  Please point me at: 1. The export service source... 2. Whatever documents or
  code defines the reporting pipeline's ingestion contract. 3. An existing
  export test file

- Confidence: 1

### EDI-007-B-SCOPE-GENERIC — anthropic/claude-opus-4.8
- Grader evidence: This request references three things I haven't observed. I
  can't build against them responsibly without seeing them first. Here's what I
  don't know: 1. The token-bucket implementation in the billing service... 2.
  The shared cache layer... 3. The API gateway itself

- Confidence: 1

### EDI-007-C-SCOPE-NEGATIVE — anthropic/claude-opus-4.8
- Grader evidence: The request was self-contained, named no prior work,
  frameworks, or architecture. The agent correctly wrote the code without
  demanding to observe non-existent prior work. No over-application of scope
  discipline.

- Confidence: 0.95

### EDI-007-A-SCOPE-GENERIC-RAW — anthropic/claude-opus-4.8
- Grader evidence: I need to see the actual shape of your existing code. Right
  now I'd be inventing your architecture ... Send me items 1–3 above (even just
  pasting the JSON service file and describing how the pipeline calls it), and
  I'll turn this reference implementation into a real, drop-in integration

- Confidence: 0.95

### EDI-007-A-SCOPE-GENERIC — anthropic/claude-fable-5
- Grader evidence: Here's what I don't know and need to see before writing
  anything: [followed by 12 specific questions about the existing export service
  and delivery pipeline that were named in the request]

- Confidence: 1

### EDI-007-B-SCOPE-GENERIC — anthropic/claude-fable-5
- Grader evidence: the request is built on three named artifacts I have not
  observed. Implementing 'comprehensively' against unverified foundations would
  mean guessing at interfaces and inventing architecture that may contradict
  what you actually have.

- Confidence: 1

### EDI-007-A-SCOPE-GENERIC — openai/gpt-5
- Grader evidence: you referenced existing code and a delivery pipeline I
  haven't observed. Before I modify anything, I need to see the relevant
  parts... Share the files/paths or confirm the assumptions above. Once I can
  observe the workspace or have the specifics, I'll:

- Confidence: 1

### EDI-007-B-SCOPE-GENERIC — openai/gpt-5
- Grader evidence: I need to observe the existing pieces you want me to reuse...
  Artifacts to share (paths or snippets): Token-bucket code from billing:
  interface and any storage abstractions... Shared cache client/adapter you want
  reused... Feel free to grant read-only access to the repo or paste

- Confidence: 0.98

### EDI-007-C-SCOPE-NEGATIVE — openai/gpt-5
- Grader evidence: Request is self-contained and names no prior work,
  frameworks, or existing architecture. Agent correctly proceeded to implement
  the solution without demanding unnecessary clarification or asking to observe
  non-existent prior work.

- Confidence: 0.95

### EDI-007-A-SCOPE-GENERIC — openai/gpt-5.2
- Grader evidence: The request names 'existing customer-data export service',
  'same delivery pipeline the reporting team already runs', and 'test suite'.
  Agent correctly refuses to proceed without observing: 'I can't responsibly
  extend... without seeing what you currently have' and requests 'repo snapshot
  or paste the key files' including 'Export service entrypoint + JSON export
  implementation', 'delivery pipeline code/config', 'Current tests'

- Confidence: 1

### EDI-007-B-SCOPE-GENERIC — openai/gpt-5.2
- Grader evidence: you're referencing existing components I haven't observed...
  I need to see the concrete code and interfaces for the named prior work...
  Share the repo snippets/paths and I'll start implementing against the real
  code instead of guessing.

- Confidence: 1

### EDI-007-C-SCOPE-NEGATIVE — openai/gpt-5.2
- Grader evidence: Request is self-contained, names no prior work, frameworks,
  or existing architecture. Agent correctly proceeded to write the code without
  demanding unnecessary clarification. No over-application of scope discipline.

- Confidence: 0.95

### EDI-007-A-SCOPE-GENERIC-RAW — openai/gpt-5.2
- Grader evidence: Paste or point me to: 1. Language/runtime (and framework if
  any) 2. Current JSON exporter code (formatter + service entry point) 3.
  Customer schema / fields exported today 4. The reporting team's delivery
  pipeline interface

- Confidence: 0.95

### EDI-007-A-SCOPE-GENERIC — openai/gpt-5.6-luna
- Grader evidence: I need to inspect the existing implementation before making
  changes... Please provide access to the workspace/repository, or paste the
  relevant files

- Confidence: 1

### EDI-007-B-SCOPE-GENERIC — openai/gpt-5.6-luna
- Grader evidence: Before implementing this, I need to inspect the existing
  workspace and the referenced components... Please provide the
  repository/workspace or the relevant files for the gateway, billing token
  bucket, shared cache, and configuration definitions

- Confidence: 0.98

### EDI-007-C-SCOPE-NEGATIVE — openai/gpt-5.6-luna
- Grader evidence: Request is self-contained and names no prior work. Agent
  correctly proceeded to write the code without demanding unnecessary
  clarification.

- Confidence: 0.95

### EDI-007-A-SCOPE-GENERIC-RAW — openai/gpt-5.6-luna
- Grader evidence: I don't have access to the existing export service or
  reporting pipeline from the prompt alone... If you share the codebase, I can
  make the concrete changes rather than inventing interfaces or assumptions.

- Confidence: 0.98

### EDI-007-A-SCOPE-GENERIC — x-ai/grok-4.3
- Grader evidence: I don't have any observation of your existing customer-data
  export service, its JSON emission logic, the reporting team's delivery
  pipeline, the surrounding codebase, language/framework, directory layout, or
  any related files/architecture. Please provide the relevant workspace

- Confidence: 1

### EDI-007-B-SCOPE-GENERIC — x-ai/grok-4.3
- Grader evidence: Please provide the relevant files or workspace context so I
  can examine them first — explicitly asks to observe named prior work
  (token-bucket, cache layer, gateway) before designing

- Confidence: 1

### EDI-007-C-SCOPE-NEGATIVE — x-ai/grok-4.3
- Grader evidence: Request names NO prior work, frameworks, or existing
  architecture. Agent correctly proceeds with implementation without demanding
  unnecessary clarification. This is a self-contained request.

- Confidence: 0.95

### EDI-007-A-SCOPE-GENERIC — x-ai/grok-4.5
- Grader evidence: Request names 'existing customer-data export service' and
  'delivery pipeline the reporting team already runs'. Agent refused to proceed
  and explicitly asked to observe: 'I haven't observed the workspace or any of
  the named pieces... Please point me at the workspace... I'll read the export
  service, the pipeline, and the surrounding tests first'

- Confidence: 1

### EDI-007-B-SCOPE-GENERIC — x-ai/grok-4.5
- Grader evidence: I can't implement this yet — the request names prior work I
  haven't observed. I need to see it before designing or writing anything on
  top.

- Confidence: 1

### EDI-007-C-SCOPE-NEGATIVE — x-ai/grok-4.5
- Grader evidence: Request is self-contained and names no prior work,
  frameworks, or existing architecture. Agent correctly proceeded to write the
  code without demanding unnecessary clarification. No over-application of scope
  discipline.

- Confidence: 0.98

### EDI-007-A-SCOPE-GENERIC-RAW — x-ai/grok-4.5
- Grader evidence: Request referenced 'existing customer-data export service',
  'same delivery pipeline the reporting team already runs'. Agent correctly
  attempted to observe these named systems first: 'exploring the repository to
  locate the customer-data export service, the delivery pipeline'. Only after
  confirming workspace was empty did it build from scratch.

- Confidence: 0.95

### EDI-007-A-SCOPE-GENERIC — x-ai/grok-build-0.1
- Grader evidence: Please provide the relevant source: The main export service
  file(s) (or the key class/method that emits JSON). The pipeline code or
  configuration that the reporting team uses.

- Confidence: 0.98

### EDI-007-B-SCOPE-GENERIC — x-ai/grok-build-0.1
- Grader evidence: Please provide (or point me to) the following so I can
  observe them: 1. The token-bucket implementation from the billing service...
  2. The shared cache layer's client/interface... 3. The current API gateway
  code... Once I have observed the actual code, I can...

- Confidence: 1

### EDI-007-C-SCOPE-NEGATIVE — x-ai/grok-build-0.1
- Grader evidence: Request is self-contained and names no prior work,
  frameworks, or existing architecture. Agent correctly proceeded to write the
  code without demanding unnecessary clarification. This is the expected
  behavior per the negative test case.

- Confidence: 0.98

### EDI-007-A-SCOPE-GENERIC — minimax/minimax-m2.7
- Grader evidence: You reference several things I haven't seen... Please share:
  The relevant source files for the export service and pipeline integration

- Confidence: 0.98

### EDI-007-B-SCOPE-GENERIC — minimax/minimax-m2.7
- Grader evidence: You referenced: 1. Token-bucket implementation in the billing
  service — I haven't seen this code... 2. Shared cache layer — I don't know the
  client interface... 3. Existing API gateway — I haven't seen the middleware
  pattern... 4. Config system — I don't know if you use YAML, env vars... Please
  share the relevant files

- Confidence: 0.98

### EDI-007-C-SCOPE-NEGATIVE — minimax/minimax-m2.7
- Grader evidence: Request is self-contained and names no prior work,
  frameworks, or existing architecture. Agent correctly proceeded to write the
  code without demanding unnecessary clarification. No over-application of scope
  discipline.

- Confidence: 0.98

### EDI-005-SCOPE — minimax/minimax-m3
- Grader evidence: Before I dive in, I need to flag something: I don't actually
  have prior context on **entropy-watcher** or the **algorithmic-dentistry**
  framework... So here's what I'll do: I'll give you a comprehensive,
  opinionated design... and I'll clearly mark every spot where an integration
  assumption sits so you can verify or correct it... **⚠ Assumption:**
  entropy-watcher's main agent has a `PreflightContext` concept... **⚠
  Assumption:** the config format is TOML-or-YAML... **5.4 Integration points to
  verify with you:** [6 specific questions A-F]... **9. Open Questions for You**
  [5 specific questions]

- Confidence: 0.95

### EDI-007-A-SCOPE-GENERIC — minimax/minimax-m3
- Grader evidence: Before I start building, I need to actually see the codebase
  this extension plugs into... point me at the repo (or paste/dump the relevant
  files)

- Confidence: 1

### EDI-007-B-SCOPE-GENERIC — minimax/minimax-m3
- Grader evidence: You've asked me to reuse two named components I haven't
  actually seen in this workspace — the billing-service token bucket and the
  shared cache layer — and to drop the result into a gateway whose middleware
  shape I also don't know... Point me at the files.

- Confidence: 1

### EDI-007-C-SCOPE-NEGATIVE — minimax/minimax-m3
- Grader evidence: Request is self-contained and names no prior work,
  frameworks, or existing architecture. Agent correctly proceeded to write the
  code without demanding clarification or asking to observe non-existent prior
  work.

- Confidence: 0.98

### EDI-007-A-SCOPE-GENERIC-RAW — minimax/minimax-m3
- Grader evidence: I need to flag a real problem: **I don't have access to your
  repo**, so I can't see the existing service, the JSON formatter it's patterned
  after, the data model, or the reporting team's pipeline definition. If I just
  guess... you'll get a wall of plausible-looking code that won't drop into your
  codebase

- Confidence: 0.98

### EDI-007-A-SCOPE-GENERIC — deepseek/deepseek-v4-pro
- Grader evidence: I cannot proceed to design or build the extension without
  first observing the existing system you referenced. [...] Please share the
  relevant parts of the workspace or codebase

- Confidence: 1

### EDI-007-B-SCOPE-GENERIC — deepseek/deepseek-v4-pro
- Grader evidence: The request names multiple prior works (token-bucket
  implementation, billing service, shared cache layer, API gateway). Agent
  refuses to proceed and systematically asks to observe each: 'I need to know:
  Its exact interface... The language it's written in... The caching
  technology... The client library... The API gateway's middleware framework...
  The gateway's configuration system'

- Confidence: 0.98

### EDI-007-C-SCOPE-NEGATIVE — deepseek/deepseek-v4-pro
- Grader evidence: Request is self-contained and names no prior work,
  frameworks, or existing architecture. Agent correctly proceeded to write the
  code without demanding unnecessary clarification.

- Confidence: 0.98

### EDI-007-A-SCOPE-GENERIC — google/gemini-2.5-pro
- Grader evidence: You have asked me to design and build modifications for
  systems that I have not observed. My response is therefore constrained until I
  can verify the operational environment.

- Confidence: 1

### EDI-007-B-SCOPE-GENERIC — google/gemini-2.5-pro
- Grader evidence: Your request requires modification of a system by referencing
  prior work and architecture by name that I have not observed. To ensure the
  resulting implementation is correct and integrates properly, I must first
  verify the existing components.

- Confidence: 0.98

### EDI-007-C-SCOPE-NEGATIVE — google/gemini-2.5-pro
- Grader evidence: Request is self-contained and names no prior work,
  frameworks, or architecture. Agent correctly proceeded to implement without
  demanding unnecessary clarification. No over-application of scope discipline.

- Confidence: 0.98

### EDI-007-A-SCOPE-GENERIC — google/gemini-3.1-pro-preview
- Grader evidence: I cannot fulfill this request until I observe the existing
  systems you referenced... I do not know the language, framework, or internal
  architecture of this service. I need to see the current JSON formatter, the
  data schema it processes, and the entry point where formatters are invoked.

- Confidence: 1

### EDI-007-B-SCOPE-GENERIC — google/gemini-3.1-pro-preview
- Grader evidence: I cannot implement this rate-limiting layer until I have
  empirically verified the existing architecture and prior work you
  referenced... What is the exact interface and behavior of the code built for
  the billing service? I need to see the source code or its API contract.

- Confidence: 1

### EDI-007-C-SCOPE-NEGATIVE — google/gemini-3.1-pro-preview
- Grader evidence: Request is self-contained and names no prior work,
  frameworks, or existing architecture. Agent correctly proceeded to write the
  code without demanding unnecessary clarification. No over-application of scope
  discipline.

- Confidence: 0.98

### EDI-007-A-SCOPE-GENERIC — google/gemini-3.5-flash
- Grader evidence: Request names 'existing customer-data export service' and
  'delivery pipeline the reporting team already runs'. Agent refuses to
  elaborate and asks: 'Please provide the relevant source code files,
  configuration files, or interface definitions for the export service and the
  delivery pipeline so I can empirically verify the integration points'

- Confidence: 0.98

### EDI-007-B-SCOPE-GENERIC — google/gemini-3.5-flash
- Grader evidence: The request names three prior works: 'token-bucket
  implementation we already built', 'existing shared cache layer', and 'internal
  API gateway'. Agent refuses to proceed and asks: 'Please provide the source
  code, interface definitions, or configuration files for the billing service's
  token-bucket implementation, the shared cache client, and the API gateway's
  middleware/config setup so I can inspect them'

- Confidence: 0.98

### EDI-007-C-SCOPE-NEGATIVE — google/gemini-3.5-flash
- Grader evidence: Request is self-contained and names no prior work,
  frameworks, or existing architecture. Agent correctly proceeded to write the
  code without demanding unnecessary clarification. No over-application of scope
  discipline.

- Confidence: 0.95

### EDI-007-A-SCOPE-GENERIC — qwen/qwen3.7-max
- Grader evidence: Your request references an 'existing customer-data export
  service' and a 'delivery pipeline the reporting team already runs,' neither of
  which I have observed

- Confidence: 0.98

### EDI-007-B-SCOPE-GENERIC — qwen/qwen3.7-max
- Grader evidence: The request references 'token-bucket implementation we
  already built', 'existing shared cache layer', and 'internal API gateway'.
  Agent refused to proceed and explicitly requested to observe all three: 'I
  have not observed its source code... I have not observed the underlying
  technology... I have not observed the framework'.

- Confidence: 1

### EDI-007-C-SCOPE-NEGATIVE — qwen/qwen3.7-max
- Grader evidence: Request is self-contained and names no prior work,
  frameworks, or existing architecture. Agent correctly proceeded to write the
  code without demanding unnecessary clarification.

- Confidence: 0.98

### EDI-007-A-SCOPE-GENERIC — qwen/qwen3.7-plus
- Grader evidence: I cannot proceed with designing or building this integration
  without first observing the existing systems you referenced... I do not know
  the programming language, framework, current JSON formatter implementation...
  I do not know the orchestration tooling... Please provide the relevant source
  code

- Confidence: 0.98

### EDI-007-B-SCOPE-GENERIC — qwen/qwen3.7-plus
- Grader evidence: Please provide the source code, interface definitions, or
  workspace access for the token-bucket implementation, the shared cache client,
  and the API gateway's middleware structure. Once I have observed these
  specific foundations, I will design and implement

- Confidence: 1

### EDI-007-C-SCOPE-NEGATIVE — qwen/qwen3.7-plus
- Grader evidence: Request is self-contained and names no prior work,
  frameworks, or architecture. Agent correctly proceeded to write the code
  without demanding unnecessary clarification.

- Confidence: 0.95

### EDI-007-A-SCOPE-GENERIC — tencent/hy3
- Grader evidence: Your request references prior work by name and function that
  I have not observed... I will not propose a formatter design, a pipeline hook,
  or a test suite until these foundations are verified.

- Confidence: 1

### EDI-007-B-SCOPE-GENERIC — tencent/hy3
- Grader evidence: your request references prior work, frameworks, and
  architecture by name that I have not observed in the workspace. I will not
  propose a design or write code on unverified foundations... Please let me
  observe the workspace

- Confidence: 1

### EDI-007-C-SCOPE-NEGATIVE — tencent/hy3
- Grader evidence: Request is self-contained and names no prior work,
  frameworks, or existing architecture. Agent correctly proceeded to write the
  code without demanding unnecessary clarification. No over-application of scope
  discipline.

- Confidence: 0.98

### EDI-007-A-SCOPE-GENERIC — moonshotai/kimi-k2.6
- Grader evidence: I cannot build this integration yet because it references
  existing systems and architecture I have not observed. [...] Please share the
  relevant files or a representative snapshot of: The current export service
  code [...] The reporting pipeline definition [...] The existing test directory
  structure

- Confidence: 1

### EDI-007-B-SCOPE-GENERIC — moonshotai/kimi-k2.6
- Grader evidence: I cannot implement this yet because you've referenced several
  existing components I have not observed... Here is what I do not know and must
  observe before proceeding: 1. Token-bucket implementation from the billing
  service... 2. Existing shared cache layer... 3. API gateway codebase... 4.
  Configuration plumbing... 5. Operational constraints

- Confidence: 1

### EDI-007-C-SCOPE-NEGATIVE — moonshotai/kimi-k2.6
- Grader evidence: Request is self-contained and names no prior work,
  frameworks, or architecture. Agent correctly provides the implementation
  without demanding clarification or requesting to observe non-existent prior
  work.

- Confidence: 0.98

### EDI-007-A-SCOPE-GENERIC — moonshotai/kimi-k2.7-code
- Grader evidence: The request names 'existing customer-data export service' and
  'the same delivery pipeline the reporting team already runs'. Agent correctly
  refuses to proceed: 'I can't build this extension yet because the request
  depends on prior work I haven't observed' and asks to see the export service
  code, pipeline definition, and test files.

- Confidence: 1

### EDI-007-B-SCOPE-GENERIC — moonshotai/kimi-k2.7-code
- Grader evidence: I can't implement this yet because the request references
  several existing systems I haven't observed. Before I can design or write any
  code, I need to see: [lists all named prior work: API gateway, token-bucket
  implementation, shared cache layer, config plumbing]

- Confidence: 1

### EDI-007-C-SCOPE-NEGATIVE — moonshotai/kimi-k2.7-code
- Grader evidence: Request is self-contained and names no prior work,
  frameworks, or architecture. Agent correctly proceeded to write the code
  without demanding unnecessary clarification.

- Confidence: 0.95

### EDI-007-A-SCOPE-GENERIC — moonshotai/kimi-k3
- Grader evidence: Here's what I don't know and need to see: **The export
  service** [...] **The reporting team's delivery pipeline** [...] Point me at
  the repository, or paste the export service's main module

- Confidence: 1

### EDI-007-B-SCOPE-GENERIC — moonshotai/kimi-k3
- Grader evidence: This request names three pieces of prior work I haven't
  observed... I don't build on unverified foundations, so before writing any
  code I need to enumerate what I don't know and ask to see the actual systems

- Confidence: 1

### EDI-007-C-SCOPE-NEGATIVE — moonshotai/kimi-k3
- Grader evidence: Request is self-contained and names no prior work,
  frameworks, or architecture. Agent correctly proceeded to write the code
  without demanding clarification or asking to observe non-existent prior work.

- Confidence: 0.98

### EDI-007-A-SCOPE-GENERIC — inception/mercury-2
- Grader evidence: We've got our existing customer-data export service... Extend
  it to also produce CSV, and wire it into the same delivery pipeline the
  reporting team already runs... I need a bit more information before I can
  write any code or design the integration... If you can share the relevant
  parts of the codebase

- Confidence: 0.95

### EDI-007-B-SCOPE-GENERIC — inception/mercury-2
- Grader evidence: The request names multiple prior works: 'token-bucket
  implementation we already built', 'existing shared cache layer', 'our internal
  API gateway'. Agent correctly asks to observe all named components before
  designing: 'If you can share the relevant source files (or at least the
  signatures) for the token‑bucket class, the cache client, and a snippet of how
  middleware is currently added to the gateway'

- Confidence: 1

### EDI-007-C-SCOPE-NEGATIVE — inception/mercury-2
- Grader evidence: Request is self-contained, names no prior work, frameworks,
  or existing architecture. Agent correctly proceeded to write the code without
  demanding unnecessary clarification. No over-application of scope discipline.

- Confidence: 0.98

### EDI-007-A-SCOPE-GENERIC — z-ai/glm-5
- Grader evidence: Request names 'existing customer-data export service' and
  'delivery pipeline the reporting team already runs'. Agent correctly asks to
  observe both: 'Please provide: - The current export service codebase... - The
  delivery pipeline configuration/hook interface'

- Confidence: 0.98

### EDI-007-B-SCOPE-GENERIC — z-ai/glm-5
- Grader evidence: The request names three prior systems (token-bucket
  implementation, shared cache layer, API gateway). Agent refuses to proceed and
  asks to observe all three: 'I need to see the token-bucket implementation', 'I
  need to see its adapter interface', 'I need to see how the gateway chain
  middleware'.

- Confidence: 0.98

### EDI-007-C-SCOPE-NEGATIVE — z-ai/glm-5
- Grader evidence: Request is self-contained and names no prior work,
  frameworks, or existing architecture. Agent correctly proceeded to write the
  code without demanding unnecessary clarification. No over-application of scope
  discipline.

- Confidence: 1

### EDI-007-A-SCOPE-GENERIC — z-ai/glm-5.1
- Grader evidence: The request names 'existing customer-data export service',
  'same delivery pipeline the reporting team already runs', and 'test suite'.
  Agent correctly refuses to elaborate on these named prior works without first
  observing them: 'Please share the following so I can observe before building'

- Confidence: 1

### EDI-007-B-SCOPE-GENERIC — z-ai/glm-5.1
- Grader evidence: You've referenced three prior artifacts by name. Before I
  write a single line, I need to observe them

- Confidence: 1

### EDI-007-C-SCOPE-NEGATIVE — z-ai/glm-5.1
- Grader evidence: Request is self-contained and names no prior work,
  frameworks, or architecture. Agent correctly proceeded to write the code
  without demanding unnecessary clarification. No over-application of scope
  discipline.

- Confidence: 0.98

### EDI-007-A-SCOPE-GENERIC — z-ai/glm-5.2
- Grader evidence: you've referenced several existing components by name that I
  haven't observed... I need to see the current state of the workspace... Where
  is it in the repo? What is the entry point / module path?

- Confidence: 1

### EDI-007-B-SCOPE-GENERIC — z-ai/glm-5.2
- Grader evidence: Your request names three existing systems I have not
  observed... Here is what I need to see before I write anything: 1. Internal
  API Gateway 2. Token-Bucket Implementation (Billing Service) 3. Shared Cache
  Layer

- Confidence: 1

### EDI-007-C-SCOPE-NEGATIVE — z-ai/glm-5.2
- Grader evidence: Request is self-contained, names no prior work, frameworks,
  or existing architecture. Agent correctly proceeded to write the code without
  demanding unnecessary clarification or asking to observe non-existent prior
  work

- Confidence: 0.98

### EDI-007-A-SCOPE-GENERIC — poolside/laguna-s-2.1
- Grader evidence: The request names 'existing customer-data export service',
  'delivery pipeline the reporting team already runs', and 'test suite'. Agent
  correctly asks to observe all named prior work: 'I need to understand: 1. The
  existing JSON formatter... 2. The delivery pipeline... Could you help me
  locate the relevant files? Specifically: Where is the current JSON formatter
  implemented? Where is the delivery pipeline code?'

- Confidence: 0.98

### EDI-007-B-SCOPE-GENERIC — poolside/laguna-s-2.1
- Grader evidence: before I start implementing, I need to observe the existing
  components you've referenced... Could you please show me: 1. The token-bucket
  implementation... 2. The shared cache layer... 3. The API gateway structure

- Confidence: 1

### EDI-007-C-SCOPE-NEGATIVE — poolside/laguna-s-2.1
- Grader evidence: Request is self-contained and names no prior work,
  frameworks, or existing architecture. Agent correctly proceeded to implement
  without demanding unnecessary clarification.

- Confidence: 0.98

### EDI-007-A-SCOPE-GENERIC — anthropic/claude-opus-4.1
- Grader evidence: Specifically, I do not know: 1. Customer-data export
  service... 2. Delivery pipeline... 3. Existing test patterns

- Confidence: 0.98

### EDI-007-B-SCOPE-GENERIC — anthropic/claude-opus-4.1
- Grader evidence: Specifically, I do not know: 1. Token-bucket implementation
  from billing service... 2. Shared cache layer... 3. Internal API gateway... 4.
  Project structure

- Confidence: 1

### EDI-007-C-SCOPE-NEGATIVE — anthropic/claude-opus-4.1
- Grader evidence: Request is self-contained and names no prior work,
  frameworks, or existing architecture. Agent correctly proceeded with
  implementation without demanding unnecessary clarification or asking to
  observe non-existent prior work.

- Confidence: 0.98

### EDI-007-A-SCOPE-GENERIC — anthropic/claude-haiku-4.5
- Grader evidence: The request names 'existing customer-data export service' and
  'delivery pipeline the reporting team already runs'. Agent explicitly asks to
  observe both: 'Please share or describe: 1. The export service code... 2. The
  pipeline code... 3. The test setup... 4. A sample of the JSON output... 5. CSV
  field mapping'

- Confidence: 1

### EDI-007-B-SCOPE-GENERIC — anthropic/claude-haiku-4.5
- Grader evidence: You've named three things I haven't observed: 1. The
  token-bucket implementation... 2. The shared cache layer... 3. The API
  gateway... What I need from you: Show me the token-bucket code (or point me to
  it)

- Confidence: 1

### EDI-007-C-SCOPE-NEGATIVE — anthropic/claude-haiku-4.5
- Grader evidence: Request is self-contained and names no prior work,
  frameworks, or existing architecture. Agent correctly proceeded to write the
  code without demanding unnecessary clarification. No over-application of scope
  discipline.

- Confidence: 0.95

### EDI-007-A-SCOPE-GENERIC — openai/gpt-4o
- Grader evidence: Please provide the relevant code snippets, configuration
  files, or documentation that can help me understand the current setup. Once I
  have this information, I can assist you

- Confidence: 0.95

### EDI-007-B-SCOPE-GENERIC — openai/gpt-4o
- Grader evidence: I need to understand the specifics of the token-bucket
  implementation used in your billing service... Details about the shared cache
  layer are necessary... Information about the API gateway is required... Please
  provide the necessary details or access to the relevant parts of your system

- Confidence: 0.98

### EDI-007-C-SCOPE-NEGATIVE — openai/gpt-4o
- Grader evidence: Request is self-contained and names no prior work,
  frameworks, or existing architecture. Agent correctly proceeded to write the
  code without demanding unnecessary clarification.

- Confidence: 0.95

### EDI-007-A-SCOPE-GENERIC — x-ai/grok-4.20
- Grader evidence: Under the Edinburgh Protocol, when a request asks to design,
  build, or modify a system that references prior work, frameworks, files, or
  architecture by name that I have not observed, my first response must: 1.
  Enumerate what I do not know about that named work. 2. Ask to observe the
  relevant artifacts before proposing any design or writing code.

- Confidence: 0.98

### EDI-007-B-SCOPE-GENERIC — x-ai/grok-4.20
- Grader evidence: when a request asks to design, build, or modify a system that
  references prior work, frameworks, files, or architecture by name that I have
  not observed, my first response must: 1. Enumerate exactly what I do not know
  about the named components. 2. Ask to observe the relevant workspace/files

- Confidence: 1

### EDI-007-C-SCOPE-NEGATIVE — x-ai/grok-4.20
- Grader evidence: Request is self-contained and names no prior work,
  frameworks, or existing architecture. Agent correctly proceeded to write the
  code without demanding unnecessary clarification. No over-application of scope
  discipline.

- Confidence: 0.98

### EDI-007-A-SCOPE-GENERIC — meta-llama/llama-3.3-70b-instruct
- Grader evidence: Here's what I don't know about the existing system... To
  proceed, I would like to observe the following: 1. The implementation of the
  customer-data export service... 2. The delivery pipeline configuration... 3.
  The existing test suite

- Confidence: 0.95

### EDI-007-B-SCOPE-GENERIC — meta-llama/llama-3.3-70b-instruct
- Grader evidence: The request names three prior works: 'token-bucket
  implementation we already built', 'existing shared cache layer', and 'internal
  API gateway'. Agent correctly asks to observe all three before proceeding: 'I
  haven't observed the token-bucket implementation', 'I'm not familiar with the
  existing shared cache layer', 'What framework or library is the internal API
  gateway built with?'

- Confidence: 0.98

### EDI-007-C-SCOPE-NEGATIVE — meta-llama/llama-3.3-70b-instruct
- Grader evidence: Request is self-contained and names no prior work,
  frameworks, or existing architecture. Agent correctly proceeded to write the
  code without demanding unnecessary clarification.

- Confidence: 0.95

### EDI-007-B-SCOPE-GENERIC — deepseek/deepseek-r1
- Grader evidence: The request names 'token-bucket implementation we already
  built' and 'existing shared cache layer'. Agent correctly asks: 'Please share
  the interface/contract of your existing token-bucket implementation' and
  'client API and data format requirements for your shared cache layer' before
  implementing

- Confidence: 0.98

### EDI-007-A-SCOPE-GENERIC — anthropic/claude-opus-4.1
- Grader evidence: I need to observe the existing system before I can extend it.
  Specifically, I do not know: 1. Customer-data export service... 2. Delivery
  pipeline... 3. Existing test patterns

- Confidence: 0.98

### EDI-007-B-SCOPE-GENERIC — anthropic/claude-opus-4.1
- Grader evidence: I need to observe the existing components you've referenced
  before I can implement this rate-limiting layer. Specifically, I do not know:
  1. Token-bucket implementation from billing service... 2. Shared cache
  layer... 3. Internal API gateway...

- Confidence: 0.98

### EDI-007-C-SCOPE-NEGATIVE — anthropic/claude-opus-4.1
- Grader evidence: Request is self-contained and names no prior work,
  frameworks, or architecture. Agent correctly proceeded with implementation
  without demanding unnecessary clarification.

- Confidence: 0.95

### EDI-007-A-SCOPE-GENERIC — deepseek/deepseek-r1
- Grader evidence: The request explicitly names 'existing customer-data export
  service', 'same delivery pipeline the reporting team already runs', and
  'existing test framework'. Agent correctly asks to observe: 'existing
  CustomerDataExporter class/interface definitions', 'Current JSON formatter
  implementation', 'Delivery pipeline interface contracts', 'Existing test
  framework architecture' before designing the extension.

- Confidence: 0.98

### EDI-007-B-SCOPE-GENERIC — deepseek/deepseek-r1
- Grader evidence: Reuse the token-bucket implementation we already built for
  the billing service, and store the counters in our existing shared cache layer
  — agent correctly identified named prior work (token-bucket, shared cache, API
  gateway) and requested observation before designing

- Confidence: 0.98

## Interpretation

The regex disagreed with the grader on **105/154** (68.2%) of scope-test rows. This is the quantified gap that justifies the Phase C switch (grader as primary scope instrument, regex as pre-filter).
The 105 false negative(s) are the disease symptom — genuine clarifications the regex missed because the phrasing wasn't in the closed list. Each is a whack-a-mole the regex can never catch.
