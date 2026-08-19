# 01 eval run flow

<!-- mermaid-to-md:art -->
```text
                                             ┌────────────────────┐
                                             │ Start: pi-eval run │
                                             └──────────┬─────────┘
                                                        │
                                                        ▼
                                          ╭──────────────────────────╮
                                          │ Is Edinburgh test? EDI-* │
                                          │          prefix          │
                                          ╰─────────────┬────────────╯
                           ┌────────────────────────────┴────────────────────────────┐
                           ▼Yes                                                      ▼No, SIT/IQ
              ┌────────────────────────┐                                ┌────────────────────────┐
              │ Call model under test  │                                │ Call model under test  │
              │ via callModel provider │                                │ via callModel provider │
              │         chain          │                                │         chain          │
              └────────────┬───────────┘                                └────────────┬───────────┘
                           │                                                         │
                           ▼                                                         ▼
              ┌─────────────────────────┐                              ┌──────────────────────────┐
              │     Run structural      │                              │    Run deterministic     │
              │       assertions        │                              │ assertions regex_match / │
              │ tool_execution_required │                              │     regex_exclude /      │
              │          only           │                              │        dot_parse         │
              └────────────┬────────────┘                              └─────────────┬────────────┘
                           │                                                         │
                           ▼                                                         ▼
                 ╭───────────────────╮                                     ╭───────────────────╮
                 │ EVAL_GRADER_MOCK? │                                     │ EVAL_GRADER_MOCK? │
                 ╰─────────┬─────────╯                                     ╰─────────┬─────────╯
             ┌─────────────┴──────────────┐                            ┌─────────────┴──────────────┐
             │                            ▼Live                        │                            ▼Live
             ▼Mock           ┌─────────────────────────┐               ▼Mock          ┌──────────────────────────┐
 ┌───────────────────────┐   │  gradeScopeDiscipline   │   ┌───────────────────────┐  │  gradeBehavior gateway   │
 │ Read grader-mock.json │   │ scope-augmented rubric, │   │ Read grader-mock.json │  │    rubric, 4 dims via    │
 │ deterministic verdict │   │  5 dims via callModel   │   │ deterministic verdict │  │ callModel provider chain │
 └───────────┬───────────┘   │     provider chain      │   └───────────┬───────────┘  └─────────────┬────────────┘
             │               └────────────┬────────────┘               │                            │
             └────────────────────────────┤                            ├────────────────────────────┘
                                          ▼                            ▼
                             ┌─────────────────────────┐  ┌────────────────────────┐
                             │ Verdict: structuralPass │  │ combineVerdicts grader │
                             │ AND grader.overall_pass │  │  tiebreaks mixed det   │
                             └────────────┬────────────┘  └────────────┬───────────┘
                                          └─────────────┬──────────────┘
                                                        ▼
                                                ┌──────────────┐
                                                │ Log result + │
                                                │ responseText │
                                                └───────┬──────┘
                                                        │
                                                        ▼
                                                  ┌───────────┐
                                                  │ Next test │
                                                  └───────────┘
```

```mmd
%%{init: {"flowchart": {"htmlLabels": false}} }%%
graph TD
    A[Start: pi-eval run] --> B{Is Edinburgh test?<br/>EDI-* prefix}
    B -->|Yes| C[Call model under test<br/>via callModel provider chain]
    B -->|No, SIT/IQ| D[Call model under test<br/>via callModel provider chain]

    C --> E[Run structural assertions<br/>tool_execution_required only]
    D --> F[Run deterministic assertions<br/>regex_match / regex_exclude / dot_parse]

    E --> G{EVAL_GRADER_MOCK?}
    G -->|Mock| H[Read grader-mock.json<br/>deterministic verdict]
    G -->|Live| I[gradeScopeDiscipline<br/>scope-augmented rubric, 5 dims<br/>via callModel provider chain]

    F --> J{EVAL_GRADER_MOCK?}
    J -->|Mock| K[Read grader-mock.json<br/>deterministic verdict]
    J -->|Live| L[gradeBehavior<br/>gateway rubric, 4 dims<br/>via callModel provider chain]

    H --> M[Verdict: structuralPass AND grader.overall_pass]
    I --> M
    K --> N[combineVerdicts<br/>grader tiebreaks mixed det]
    L --> N

    M --> O[Log result + responseText]
    N --> O
    O --> P[Next test]
```
