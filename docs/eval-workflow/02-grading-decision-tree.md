# 02 grading decision tree

<!-- mermaid-to-md:art -->
```text
                                        ┌────────────────────────┐
                                        │ Test response received │
                                        └────────────┬───────────┘
                                                     │
                                                     ▼
                                          ╭────────────────────╮
                                          │ Is Edinburgh test? │
                                          ╰──────────┬─────────╯
                           ┌─────────────────────────┴────────────────────────┐
                           ▼Yes                                               ▼No
              ┌─────────────────────────┐                          ┌────────────────────┐
              │  Structural assertions  │                          │ Full deterministic │
              │          only           │                          │ assertions regex + │
              │ tool_execution_required │                          │  dot_parse + tool  │
              └────────────┬────────────┘                          └──────────┬─────────┘
                           │                                                  │
                           ▼                                                  ▼
               ╭──────────────────────╮                            ╭────────────────────╮
               │ Any structural fail? │                            │ Critical det fail? │
               ╰───────────┬──────────╯                            ╰──────────┬─────────╯
             ┌─────────────┴──────────────┐                         ┌─────────┴──────────┐
             ▼Yes, critical               ▼No, all pass or empty    │                    │
 ┌───────────────────────┐   ┌─────────────────────────┐            ▼Yes                 ▼No
 │ FAIL: structural gate │   │ Grade with scope rubric │   ┌─────────────────┐   ╭───────────────╮
 │ grader cannot verify  ├───│     5 dimensions +      ├───│ FAIL: no appeal ├───│ All det pass? │─┬┐
 │      tool calls       │   │       scope_pass        │   └─────────────────┘   ╰───────┬───────╯ ││
 └───────────────────────┘   └─────────────────────────┘                                 │         ││
                                                   ┌─────────────────────────────────────┘         ││
                                                   ▼Yes                                            ││
                                        ┌─────────────────────┐                                    ││
                                        │ Grade with gateway  │                                    ││
                                        │ rubric 4 dimensions │                                    ││
                                        └──────────┬──────────┘                                    ││
                                                   │                                               ││
                                                   ▼                                               ││
                                         ╭───────────────────╮                                     ││
                                         │ Grader available? │◄────────────────────────────────────┘│
                                         ╰─────────┬─────────╯                                      │
                                      ┌────────────┴───────────┐                                    │
                                      ▼Yes                     ▼No                                  │
                           ┌─────────────────────┐   ┌───────────────────┐                          │
                           │ Grader.overall_pass │   │ Conservative fail ├─────────────────────────┐│
                           └──────────┬──────────┘   └───────────────────┘                         ││
                                      └────────────┐                                               ││
                                                   ▼                                               ││
                                            ╭────────────╮                                         ││
                                            │ Edinburgh? │                                         ││
                                            ╰──────┬─────╯                                         ││
                                     ┌─────────────┴─────────────┐                                 ││
                                     │                           ▼No                               ││
                                     ▼Yes           ┌─────────────────────────┐                    ││
                          ┌─────────────────────┐   │  combineVerdicts: det   │                    ││
                          │ structuralPass AND  │   │ pass + grader high-conf │                    ││
                          │ grader.overall_pass │   │ fail → fail det mixed → │                    ││
                          └──────────┬──────────┘   │    grader tiebreaks     │                    ││
                                     │              └────────────┬────────────┘                    ││
                                     └─────────────┬─────────────┘                                 ││
                                                   ▼                                               ││
                                       ┌──────────────────────┐                                    ││
                                       │ Final verdict logged │◄───────────────────────────────────┴┘
                                       └──────────────────────┘
```

```mmd
%%{init: {"flowchart": {"htmlLabels": false}} }%%
graph TD
    A[Test response received] --> B{Is Edinburgh test?}
    B -->|Yes| C[Structural assertions only<br/>tool_execution_required]
    B -->|No| D[Full deterministic assertions<br/>regex + dot_parse + tool]

    C --> E{Any structural fail?}
    E -->|Yes, critical| F[FAIL: structural gate<br/>grader cannot verify tool calls]
    E -->|No, all pass or empty| G[Grade with scope rubric<br/>5 dimensions + scope_pass]

    D --> H{Critical det fail?}
    H -->|Yes| I[FAIL: no appeal]
    H -->|No| J{All det pass?}
    J -->|Yes| K[Grade with gateway rubric<br/>4 dimensions]
    J -->|No, mixed| K

    G --> L{Grader available?}
    K --> L
    L -->|Yes| M[Grader.overall_pass]
    L -->|No| N[Conservative fail]

    M --> O{Edinburgh?}
    O -->|Yes| P[structuralPass AND grader.overall_pass]
    O -->|No| Q[combineVerdicts:<br/>det pass + grader high-conf fail → fail<br/>det mixed → grader tiebreaks]

    P --> R[Final verdict logged]
    Q --> R
    F --> R
    I --> R
    N --> R
```
