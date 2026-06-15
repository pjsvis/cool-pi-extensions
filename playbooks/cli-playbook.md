# Playbook: cli/

## Purpose

Standalone CLI tools distributed with cool-pi-extensions. Built with Bun + citty.

## Directory structure

```
cli/
├── tool-name/
│   ├── package.json    # Bun project metadata
│   ├── src/
│   │   ├── main.ts     # Entry point
│   │   └── ...         # Additional modules
│   ├── bun.lock        # Lockfile
│   └── node_modules/   # After bun install
```

## Conventions

- One tool per directory
- Use [citty](https://github.com/unjs/citty) for CLI argument parsing
- Use Bun as the runtime (`#!/usr/bin/env bun` shebang or `bun run`)
- Follow pi's CLI conventions: `pi-toolname <command>` pattern
- JSON output with `--json` flag for machine readability
- Include install instructions in README

## Building and installing

```bash
cd cli/tool-name
bun install
bun link              # Global install (system-wide)
# OR
bun run src/main.ts   # Development
```

## Testing

```bash
bun run src/main.ts --help
bun run src/main.ts list
```

## Reference tools

- `pi-check` — Provider connectivity checker
- `pi-models` — Model registry manager
