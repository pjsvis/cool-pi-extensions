# 1 eval run flow

<!-- mermaid-to-md:art -->
```text
                 ┌────────────────────┐
                 │ Start: pi-eval run │
                 └──────────┬─────────┘
                            │
                            ▼
                   ╭─────────────────╮
                   │ Edinburgh test? │
                   ╰────────┬────────╯
             ┌──────────────┴──────────────┐
             ▼yes                          ▼no, SIT/IQ
 ┌───────────────────────┐      ┌─────────────────────┐
 │ Structural assertions │      │ Full det assertions │
 │         only          │      └──────────┬──────────┘
 └───────────┬───────────┘                 │
             │                             │
             ▼                             ▼
┌────────────────────────┐   ┌──────────────────────────┐
│ Grade: scope rubric, 5 │   │ Grade: gateway rubric, 4 │
│          dims          │   │           dims           │
└────────────┬───────────┘   └─────────────┬────────────┘
             └──────────────┬──────────────┘
                            ▼
                       ╭─────────╮
                       │ Grader? │
                       ╰────┬────╯
              ┌─────────────┴─────────────┐
              ▼edinburgh                  ▼SIT/IQ
   ┌─────────────────────┐   ┌─────────────────────────┐
   │ structuralPass AND  │   │ combineVerdicts: grader │
   │ grader.overall_pass │   │        tiebreaks        │
   └──────────┬──────────┘   └────────────┬────────────┘
              └─────────────┬─────────────┘
                            ▼
                ┌───────────────────────┐
                │ Log result + response │
                └───────────┬───────────┘
                            │
                            ▼
                      ┌───────────┐
                      │ Next test │
                      └───────────┘
```

```mmd
%%{init: {"flowchart": {"htmlLabels": false}} }%%
graph TD
    A[Start: pi-eval run] --> B{Edinburgh test?}
    B -->|yes| C[Structural assertions only]
    B -->|no, SIT/IQ| D[Full det assertions]
    C --> E[Grade: scope rubric, 5 dims]
    D --> F[Grade: gateway rubric, 4 dims]
    E --> G{Grader?}
    F --> G
    G -->|edinburgh| H[structuralPass AND grader.overall_pass]
    G -->|SIT/IQ| I[combineVerdicts: grader tiebreaks]
    H --> J[Log result + response]
    I --> J
    J --> K[Next test]
```
