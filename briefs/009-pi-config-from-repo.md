# Brief: Pi Configuration from Repo

**Date:** 2026-06-12
**Status:** implemented

## Context

Setting up pi on a new machine (like Omarchy) requires:
1. `models.json` — provider endpoints and model configs
2. `auth.json` or `~/.skate_env` — API keys
3. `settings.json` — preferences (default model, thinking level, etc.)

Currently these are synced from the Mac. But there's a better pattern: keep a template in the repo, let the agent help configure it.

## The Pattern

**1. Template in repo:** `prompts/pi-models-example.md` — a documented `models.json` template showing all providers and their config structure.

**2. Agent prompt:** "Configure pi to use the models in `prompts/pi-models-example.md`. Get API keys from skate. Report which keys are missing or broken."

**3. Agent output:** A checklist of:
- Missing API keys (not in skate or auth.json)
- Invalid keys (API returns auth error)
- Working providers and models
- Any models that need configuration

## Benefits

- **Repo is the source of truth** — the template documents what's available
- **Agent can help** — instead of manual config, tell the agent "set this up"  
- **Surface missing keys early** — before trying to use a model, know if the key is there
- **Self-documenting** — the template has comments explaining each field

## Implementation

- `prompts/pi-models-example.md` — template `models.json` with provider configs
- `scripts/sync-pi-to-omarchy.sh` — syncs full config (still needed for extensions)
- `scripts/skate-to-omarchy.sh` — syncs secrets (still needed for API keys)

The template doesn't replace the sync scripts — it complements them. Use sync for full copy, use template for agent-assisted setup.

## Usage

On a new machine:
```bash
# Tell the agent
pi "Configure pi using the models from ~/cool-pi-extensions/prompts/pi-models-example.md. Get keys from ~/.skate_env. List any missing or broken keys."

# Or do it manually
cp prompts/pi-models-example.md ~/.pi/agent/models.json
# Then edit auth.json with keys from skate
```

## See Also

- `prompts/pi-models-example.md` — the template
- `scripts/sync-pi-to-omarchy.sh` — full config sync
- `scripts/skate-to-omarchy.sh` — secrets sync