# cool-pi-extensions

A curated collection of extensions, CLI tooling, prompts, and editor plugins for the terminal-native development stack.

## The one-liner

Tell your coding agent to orient itself to the project. It will check everything and walk you through the rest.

## The stack

```
alacritty → herdr → pi → fresh (+ sidecar / td)
```

## Entry points

| Command | What it does | Audience |
|---------|-------------|----------|
| `just orient` | Full agent orientation — git, tasks, entry points | Agents |
| `just about` | This page — what the project is | Humans |
| `just browse` | List all docs and playbooks | Humans |
| `just read X` | Render any markdown file with glow | Both |
| `just help` | Full repo index (MANIFEST.md) | Both |

## What's in the box

**Extensions** — TypeScript modules for the Pi coding agent: defuddle, silo, edinburgh-evals.

**CLI tools** — Bun-powered utilities: pi-check, pi-models.

**Prompts** — Edinburgh Protocol constraint stack for normalizing agent behavior.

**Fresh plugins** — glow-preview for in-editor markdown rendering.

**Playbooks** — How-to guides for recurring tasks. Give pi the URL and it executes.

## Explore

Run `just browse` to see all docs and playbooks.
Run `just read` (no args) for an interactive picker.

For the full index: `just help`
