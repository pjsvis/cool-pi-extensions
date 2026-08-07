apfel v1.9.0 — Apple Intelligence from the command line

```bash
USAGE:
  apfel [OPTIONS] <prompt>       Send a single prompt
  apfel [OPTIONS] -- <prompt>    "--" ends options; prompt may start with "-"
  apfel -f <file> <prompt>       Attach file content to prompt
  apfel --chat                   Interactive conversation
  apfel --stream <prompt>        Stream a single response
  apfel --serve                  Start OpenAI-compatible HTTP server
  apfel --benchmark              Run internal performance benchmarks
  apfel --count-tokens <prompt>  Preflight token count (no inference)
  apfel completions <shell>      Print shell completions (bash, zsh, fish)

OPTIONS:
  -f, --file <path>         Attach file content to prompt (repeatable)
  -s, --system <text>       Set a system prompt
      --system-file <path>  Read system prompt from file
      --schema <path>       Constrain output to a JSON Schema file (guaranteed valid JSON)
      --messages <path|->   One-shot multi-turn: OpenAI messages JSON from file or stdin
      --code                Print only the code: first fenced block, or the bare
                            response when unfenced. Exit 7 on an empty response
  -o, --output <format>     Output format: plain, json [default: plain]
  -q, --quiet               Suppress non-essential output
      --no-color             Disable colored output
      --temperature <n>      Sampling temperature (e.g., 0.7); 0 = deterministic
      --top-p <n>            Nucleus sampling threshold in (0, 1] (e.g., 0.9)
      --seed <n>             Random seed for reproducible output
      --max-tokens <n>       Maximum response tokens
      --mcp <path|url>       Attach local or remote MCP tool server (repeatable)
      --mcp-token <token>    Bearer token for remote MCP servers (prefer APFEL_MCP_TOKEN env)
      --mcp-timeout <n>      MCP server timeout in seconds [default: 5]
      --permissive           Use permissive content guardrails
      --retry [n]            Enable retry with exponential backoff [default: 3 retries]
                             Ambiguous with a numeric prompt: `--retry 7` alone keeps
                             "7" as the prompt; use --retry=N to set the count unambiguously
      --model-info           Print model capabilities and exit
      --benchmark            Run internal performance benchmarks
      --count-tokens         Count tokens without calling the model
      --strict               With --count-tokens: exit 4 if over budget
      --update               Check for updates and upgrade via Homebrew
      --demos [dir]          Write the bundled demo scripts to dir [default: ./apfel-demos]
      --debug                Enable debug logging to stderr (all modes)
  -h, --help                Show this help
  -v, --version             Print version
      --release             Show detailed release and build info

CONTEXT OPTIONS:
      --context-strategy <s>  Context management strategy [default: newest-first]
                              newest-first, oldest-first, sliding-window,
                              summarize, strict (error on overflow)
      --context-max-turns <n> Max history turns (sliding-window only)
      --context-output-reserve <n>
                              Tokens reserved for output [default: 512]
      --context-status     Print chat context fill after each turn

SERVER OPTIONS:
      --serve                Start OpenAI-compatible HTTP server
      --port <number>        Server port [default: 11434]
      --host <address>       Bind address [default: 127.0.0.1]
      --cors                 Enable CORS headers for browser clients
      --allowed-origins <origins>
                             Add comma-separated origins to localhost defaults
      --no-origin-check      Disable origin checking (allow all origins)
      --token <secret>       Require Bearer token authentication
      --token-auto           Generate and print a random Bearer token
      --public-health        Keep /health unauthenticated on non-loopback binds
      --footgun              Disable all protections (--no-origin-check + --cors)
      --max-concurrent <n>   Max concurrent model requests [default: 5]


ENVIRONMENT:
  APFEL_SYSTEM_PROMPT       Default system prompt
  APFEL_MCP                 MCP server paths (comma-separated; colon accepted for local paths)
  APFEL_MCP_TIMEOUT         MCP timeout in seconds [default: 5]
  APFEL_MCP_TOKEN           Bearer token for remote MCP servers
  APFEL_HOST                Server bind address [default: 127.0.0.1]
  APFEL_PORT                Server port [default: 11434]
  APFEL_TOKEN               Bearer token for server authentication
  APFEL_TEMPERATURE         Default temperature
  APFEL_MAX_TOKENS          Default max tokens
  APFEL_CONTEXT_STRATEGY    Default context strategy
  APFEL_CONTEXT_MAX_TURNS   Max turns for sliding-window
  APFEL_CONTEXT_OUTPUT_RESERVE
                            Tokens reserved for output
  APFEL_DEBUG               Enable debug logging (same as --debug)
  APFEL_HISTFILE            Persist --chat history to this file (off by default)
  NO_COLOR                  Disable colored output (https://no-color.org)

EXIT CODES:
  0  Success
  1  Runtime error
  2  Usage error (bad flags)
  3  Guardrail blocked (content policy)
  4  Context overflow (input too long)
  5  Model unavailable (Apple Intelligence not enabled)
  6  Rate limited / busy
  130  Interrupted (Ctrl-C at the chat prompt)

EXAMPLES:
  apfel "What is the capital of Austria?"
  apfel --stream "Write a haiku about code"
  apfel -s "You are a pirate" --chat
  apfel --system-file prompt.txt "Analyze this"
  echo "Summarize this" | apfel
  apfel -f code.swift "Explain this code"
  apfel -f a.txt -f b.txt "Compare these files"
  cat README.md | apfel "Summarize this"
  apfel -o json "Translate to German: hello" | jq .content
  apfel --count-tokens -f README.md "Summarize this"
  apfel --count-tokens -o json "hello" | jq .
  APFEL_SYSTEM_PROMPT="Be brief" apfel "Explain TCP"
  apfel --serve --port 3000 --host 0.0.0.0 --cors
```
