# Pi Models Configuration

## Purpose

Example `models.json` for configuring pi with multiple providers. Copy to `~/.pi/agent/models.json` on a new machine, then run `pi --list-models` to see what's available.

## Getting API Keys

API keys are stored in `skate`. On a new machine, sync secrets with:

```bash
bash scripts/sync-skate-to-omarchy.sh
source ~/.skate_env
```

Then set keys in `auth.json` or as environment variables.

## Template

```json
{
  "providers": {
    "ollama": {
      "api": "openai-completions",
      "apiKey": "ollama",
      "baseUrl": "http://127.0.0.1:11434/v1",
      "models": [
        {
          "id": "gemma4:e4b",
          "reasoning": true,
          "input": ["text", "image"],
          "contextWindow": 131072
        }
      ]
    },
    "openrouter": {
      "api": "openai-completions",
      "apiKey": "${OPENROUTER_API_KEY}",
      "baseUrl": "https://openrouter.ai/api/v1",
      "models": [
        {
          "id": "minimax/m2.7",
          "reasoning": false,
          "input": ["text"],
          "contextWindow": 32768
        },
        {
          "id": "google/gemini-2.5-pro",
          "reasoning": true,
          "input": ["text", "image"],
          "contextWindow": 32768
        },
        {
          "id": "x-ai/grok-3",
          "reasoning": true,
          "input": ["text"],
          "contextWindow": 131072
        }
      ]
    },
    "openai": {
      "api": "openai-completions",
      "apiKey": "${OPENAI_API_KEY}",
      "baseUrl": "https://api.openai.com/v1",
      "models": [
        {
          "id": "gpt-4.1",
          "reasoning": false,
          "input": ["text", "image"],
          "contextWindow": 128000
        }
      ]
    },
    "anthropic": {
      "api": "anthropic-completions",
      "apiKey": "${ANTHROPIC_API_KEY}",
      "baseUrl": "https://api.anthropic.com/v1",
      "models": [
        {
          "id": "claude-opus-4-5",
          "reasoning": false,
          "input": ["text", "image"],
          "contextWindow": 200000
        }
      ]
    }
  }
}
```

## Quick Setup Script

```bash
# On a new machine, after syncing skate:
cd ~/cool-pi-extensions

# Copy template
cp prompts/pi-models-example.md ~/.pi/agent/models.json

# Set API keys from skate (if not in auth.json)
export OPENAI_API_KEY=$(skate get openai_api_key 2>/dev/null)
export ANTHROPIC_API_KEY=$(skate get anthropic_api_key 2>/dev/null)
export OPENROUTER_API_KEY=$(skate get openrouter_api_key 2>/dev/null)

# Or edit auth.json directly
nano ~/.pi/agent/auth.json

# Verify
pi --list-models
```

## Adding a New Provider

1. Add the provider block to `models.json`
2. Get the API key from skate: `skate get <provider>_api_key`
3. Add to `auth.json` or set as environment variable
4. Run `pi --list-models` to verify

## See Also

- `scripts/sync-pi-to-omarchy.sh` — sync full pi config from Mac
- `scripts/skate-to-omarchy.sh` — sync secrets from Mac
- `playbooks/omarchy-setup.md` — fresh machine setup