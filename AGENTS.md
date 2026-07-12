## MANDATORY: Use td for Task Management

Run td usage --new-session at conversation start (or after /clear). This tells you what to work on next.

Sessions are automatic (based on terminal/agent context). Optional:
- td session "name" to label the current session
- td session --new to force a new session in the same context

Use td usage -q after first read.

## Silo Exception: Pi Agent Config Files (Decision 013)

As the **sole, explicit exception** to the Edinburgh Protocol's SILO DISCIPLINE
("I'm staying in"), the agent operating in this repo MAY read and edit the
Pi agent configuration files `~/.pi/agent/models.json` and
`~/.pi/agent/settings.json` on the user's behalf. This repo's purpose is Pi
tooling/configuration, and managing Pi's providers and models requires
touching those files.

Narrow and exclusive — does NOT extend to:
- `~/.pi/agent/auth.json` or any credentials, tokens, or API keys
- skate secrets (`skate get` / `skate set`) — secrets remain the user's domain
- any other path outside the repo

Preferred mechanism for durable provider definitions: an in-repo Pi extension
(`pi.registerProvider()`, versioned). Use the `models.json` / `settings.json`
exception for runtime state extensions can't express (removing a built-in
provider, personal overrides, default-model selection).

Full rationale + enforcement-gap note: `decisions/013-silo-exception-pi-config.md`
