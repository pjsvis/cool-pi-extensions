# 03 provider chain

<!-- mermaid-to-md:art -->
```text
                                       ┌─────────────────────────┐
                                       │ callModel: model slug + │
                                       │         prompts         │
                                       └────────────┬────────────┘
                                                    │
                                                    ▼
                                            ╭──────────────╮
                                            │ Slug routing │
                                            ╰───────┬──────╯
          ┌─────────────────────────┬───────────────┴──────────────┬─────────────────────────────┐
          ▼kimi/moonshot            ▼qwen                          │                             │
 ┌─────────────────┐  ┌──────────────────────────┐                 ▼org/model slug               ▼local model, no slash
 │ Moonshot direct │  │     DashScope direct     │   ┌──────────────────────────┐   ┌────────────────────────┐
 │ api.moonshot.ai │  │ dashscope-intl.aliyuncs. │   │ OpenRouter openrouter.ai │   │ Ollama localhost:11434 ├───────────┐
 └────────┬────────┘  │           com            │   └─────────────┬────────────┘   └────────────────────────┘           │
          │           └─────────────┬────────────┘                 │                                                     │
          └─────────────────────────┴──────────────────────┬───────┘                                                     │
                                                           ▼                                                             │
                                                     ╭──────────╮                                                        │
                                                     │ Success? │◄───────────────────────────────────────────────────────┼┐
                                                     ╰─────┬────╯                                                        ││
                                                ┌──────────┴─────────┐                                                   ││
                                                ▼Yes                 ▼No: 429/500                                        ││
                                       ┌─────────────────┐  ╭────────────────╮                                           ││
                                       │ Return or throw │◄─│ Next in chain? │───────────────────────────────────────────┘│
                                       └─────────────────┘  ╰────────┬───────╯                                            │
                                                       ┌─────────────┴─────────────┐                                      │
                                                       ▼Yes                        ▼No                                    │
                                          ┌────────────────────────┐   ┌──────────────────────┐                           │
                                          │ Next provider ZenMux → │   │ Throw: all providers │                           │
                                          │        Together        ├───│        failed        │───────────────────────────┘
                                          └────────────────────────┘   └──────────────────────┘
```

```mmd
%%{init: {"flowchart": {"htmlLabels": false}} }%%
graph TD
    A[callModel: model slug + prompts] --> B{Slug routing}
    B -->|kimi/moonshot| C[Moonshot direct<br/>api.moonshot.ai]
    B -->|qwen| D[DashScope direct<br/>dashscope-intl.aliyuncs.com]
    B -->|org/model slug| E[OpenRouter<br/>openrouter.ai]
    B -->|local model, no slash| F[Ollama<br/>localhost:11434]

    C --> G{Success?}
    D --> G
    E --> G
    F --> H[Return or throw]

    G -->|Yes| H
    G -->|No: 429/500| I{Next in chain?}
    I -->|Yes| J[Next provider<br/>ZenMux → Together]
    I -->|No| K[Throw: all providers failed]
    J --> G
```
