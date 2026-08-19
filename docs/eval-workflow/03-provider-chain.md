# 3 provider chain

<!-- mermaid-to-md:art -->
```text
     ┌───────────────────┐
     │ callModel: slug + │
     │      prompts      │
     └─────────┬─────────┘
               │
               ▼
       ╭──────────────╮
       │ Slug routing │
       ╰───────┬──────╯
               │
               ▼
 ┌──────────────────────────┐
 │ Pick provider: Moonshot  │
 │ / DashScope / OpenRouter │
 │         / Ollama         │
 └─────────────┬────────────┘
               │
               ▼
         ╭──────────╮
         │ Success? │◄───────────────────────────┐
         ╰─────┬────╯                            │
      ┌────────┴───────┐                         │
      ▼yes             ▼no: 429/500              │
 ┌────────┐   ╭────────────────╮                 │
 │ Return │   │ Next in chain? │                 │
 └────────┘   ╰────────┬───────╯                 │
           ┌───────────┴────────────┐            │
           ▼yes                     ▼no          │
 ┌───────────────────┐  ┌──────────────────────┐ │
 │ Next: ZenMux then │  │ Throw: all providers │ │
 │     Together      ├──│        failed        │─┘
 └───────────────────┘  └──────────────────────┘
```

```mmd
%%{init: {"flowchart": {"htmlLabels": false}} }%%
graph TD
    A[callModel: slug + prompts] --> B{Slug routing}
    B --> C[Pick provider:<br/>Moonshot / DashScope /<br/>OpenRouter / Ollama]
    C --> D{Success?}
    D -->|yes| E[Return]
    D -->|no: 429/500| F{Next in chain?}
    F -->|yes| G[Next: ZenMux then Together]
    G --> D
    F -->|no| H[Throw: all providers failed]
```
