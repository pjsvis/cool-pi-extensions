# Playbook: config/

## Purpose

Configuration registries and reference documentation. Currently houses the provider registry — a snapshot of all configured model providers.

## Directory structure

```
config/
├── provider-registry.md     # Current provider/model snapshot
└── ...
```

## Provider registry

Generated from `~/.pi/agent/models.json`. Documents:
- All configured providers with base URLs, API types, auth methods
- All models per provider with capabilities, costs, context windows
- API key sources (environment variables, skate, config files)

**Generation:** Manual for now. Run pi with `--list-models` and format the output.

## Conventions

- Configuration files in this directory are **documentation**, not runtime config
- Runtime config lives in `~/.pi/agent/settings.json` and extension `config.json` files
- Regenerate the provider registry after significant provider changes
- Include generation date in the file header
