# The Visitor Journey

*A guided tour through cool-pi-extensions — from arrival to productivity in under 5 minutes.*

---

## The Scenario

You are a visiting third-party agent. You drop into `cool-pi-extensions`. You've never been here. You know nothing.

You are handed no briefing. No Slack thread. No Notion link.

Just the repo.

---

## Step 1: Arrival

You run:

```bash
just orient
```

You learn everything:

```
Repo:   cool-pi-extensions
Branch: main

=== Git status ===
Last commit: 15 minutes ago

=== Stack ===
  alacritty → herdr → pi → fresh (+ sidecar / td)

=== Agent tasks (td) ===
SESSION: ses_xxx
No active work. Run 'td next' to see the next issue to start.

=== Provisioning ===
  ✓ bun  ✓ just  ✓ glow  ✓ pi: 0.79.1
  ✓ Fresh config: ~/.config/fresh

=== Entry points ===
  just about   — what this project is
  just orient  — current state (you are here)
  just browse  — human doc browser
  just help    — full repo index (MANIFEST.md via Glow)

=== Optional constraints ===
  just adopt-edinburgh — apply Edinburgh Protocol (normalize agents)
  For visiting agents: just adopt-edinburgh → just orient

=== Read more ===
  just read docs/the-vest-protocol.md — the VEST Protocol blog post
  just read docs/visitor-protocol.md  — VEST spec
```

**What you now know:**

| Question | Answer |
|---|---|
| Where am I? | `cool-pi-extensions`, branch `main` |
| What tools are available? | `bun`, `just`, `glow`, `pi`, Fresh |
| What's the stack? | Alacritty → herdr → pi → fresh |
| Is there active work? | No (td says so) |
| How do I find work? | `td next` |
| How do I normalize? | `just adopt-edinburgh` |
| What is this project? | VEST Protocol, extensions, CLI tooling |
| Where do I read more? | `just read docs/the-vest-protocol.md` |

**Time elapsed:** 30 seconds.

---

## Step 2: Normalization

You run:

```bash
just adopt-edinburgh && just orient
```

**What happens:**

```
Edinburgh Protocol adopted as system prompt.

Restart pi to activate. For visiting agents:
  1. just adopt-edinburgh  (add constraint-stack)
  2. just orient           (context-initialization)
```

You restart pi. Your identity is now normalized — Hume's skepticism,
Smith's systems thinking, Watt's pragmatism as constraints.

**Time elapsed:** 1 minute.

---

## Step 3: Exploration

You run:

```bash
just browse
```

```
=== docs/ (reference) ===
  • docs/the-vest-protocol.md
  • docs/visitor-protocol.md
  • docs/terminal-stack.md
  ...

=== playbooks/ (guides) ===
  • playbooks/dev-stack-setup.md
  • playbooks/extensions.md
  ...

→ just read <file>  to render any file with glow
→ glow             to browse interactively
```

You are curious about the VEST Protocol. You run:

```bash
just read docs/the-vest-protocol.md
```

Glow renders it. You read about:
- The problem (discoverability)
- The insight (entry point is documentation)
- VEST vs REST
- The Bruce Willis anecdote

You understand the philosophy now. Minimal API. Self-teaching. Two verbs
for two audiences.

**Time elapsed:** 2 minutes.

---

## Step 4: Setup

You want to work. You run:

```bash
just dev
```

Gum prompts:

```
  ✓ Found workspace: cool-pi-extensions (3 tabs)
  [Use existing] [Close and recreate] [Cancel]
```

You choose "Use existing". Herdr creates 4 tabs:

```
pi | fresh | glow | shell
```

You are ready to work.

**Time elapsed:** 3 minutes.

---

## Step 5: Reporting Back

You report to the user:

> "I've orientated. Adopted the Edinburgh Protocol. The workspace
> is set up with pi, fresh, glow, and shell in herdr tabs. I understand
> the VEST Protocol approach — minimal API, self-teaching, two verbs for
> two audiences. Ready to pick up tasks via td."

---

## What Just Happened

**No onboarding doc to read. No wiki to scroll. No CONTRIBUTING.md to parse.**

The system taught itself. You are productive.

| Step | What you learned | How you learned it |
|---|---|---|
| 1 | Environment, tools, active work | `just orient` |
| 2 | Normalized identity | `just adopt-edinburgh` |
| 3 | Philosophy, structure | `just browse`, `just read` |
| 4 | Ready to work | `just dev` |

**Total time:** Under 5 minutes.

---

## The VEST Protocol in Action

A visiting agent arrives with zero context. Within 5 minutes:
1. Knows the environment
2. Is normalized
3. Is set up
4. Understands the philosophy

The system caught the bullet.

```bash
just orient    # Where is the work?
just adopt-edinburgh  # How do I normalize?
just browse    # What can I explore?
just dev       # How do I set up?
```

**Zero onboarding. The system teaches itself.**

---

## The Principle

> It takes very few words to decide whether a repo is worth a closer look.

`just orient` is 20 lines of output. It tells you everything you need
to know to make that decision. If there's nothing active, you're done.
If there's work, you know where to start.

The VEST Protocol: the entry point is the documentation.

---

*This document demonstrates the VEST Protocol in practice.
Clone the repo. Run `just orient`. See for yourself.*