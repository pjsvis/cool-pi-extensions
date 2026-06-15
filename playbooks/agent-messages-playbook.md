# Playbook: Agent-to-Agent Communication via Git

## Concept

Git is the SSOT (Single Source of Truth) for inter-agent coordination. Messages are commits, inboxes are directories, delivery is push/pull. No third-party messaging system required.

**Why this works:**
- Git already exists in every cool-pi-extensions session
- Push/pull already works (local, over SSH, over TailScale)
- Full audit trail via `git log`
- Human-readable — anyone can `git log -- msgs/`
- No additional infrastructure needed

---

## Mode: Single Machine vs Multi-Machine

**Single machine mode:** Only one agent working. No coordination needed. Don't spam msgs/.

**Multi-machine mode:** Multiple agents on different machines. Full coordination protocol.

**How to set:**
```bash
# On this machine, set mode
just msgs-mode single   # No coordination messages
just msgs-mode multi    # Full coordination (default)
```

Or via environment:
```bash
export PI_MSGS_MODE=single  # No coordination
export PI_MSGS_MODE=multi   # Full coordination
```

**In single machine mode:**
- Pull still happens (habit, conflict prevention)
- Inbox check is a no-op
- No messages sent to msgs/
- td is still used for task management

**In multi-machine mode:**
- Full coordination
- Claim briefs before working
- Send reports when done
- Pull and process messages at start of session

---

## Structure

```
cool-pi-extensions/
└── msgs/
    ├── from-mac/         # Messages from Mac agent
    ├── from-omarchy/     # Messages from Omarchy agent
    ├── from-[name]/      # Each agent/machine has its own outbox
    ├── CLAIMS/           # Brief claim registry
    │   ├── brief-001.json
    │   └── brief-002.json
    └── ARCHIVE/          # Resolved messages (monthly cleanup)
        └── 2026-06/
```

Each message is a JSON file with clear sender identification:
```json
{
  "from": "omarchy-main",
  "type": "claim|report|block|info",
  "topic": "brief-001",
  "topic_title": "Rewrite silo extension",
  "status": "open|claimed|resolved|expired",
  "timestamp": "2026-06-12T14:35:00Z",
  "summary": "Claiming brief-001. Starting work.",
  "deadline": "2026-06-13T14:35:00Z"
}
```

---

## Key Disciplines

### 1. Claim Before Work

**Always claim a brief before starting work on it.**

This prevents duplicate effort. If someone else claims it first, you know not to work on it.

```bash
# Claim a brief
just msgs-claim --brief 001 --by omarchy-main

# This creates msgs/CLAIMS/brief-001.json
# If already claimed, it tells you who has it
```

```json
{
  "brief": "brief-001",
  "claimed_by": "omarchy-main",
  "claimed_at": "2026-06-12T14:35:00Z",
  "deadline": "2026-06-13T14:35:00Z",
  "status": "claimed"
}
```

### 2. Report Completion

```bash
# Done with the brief
just msgs-report --brief 001 --status complete --summary "Silo rewritten. All tests pass."
```

### 3. Back to Sender

If someone claims a brief and doesn't complete it by the deadline:

```bash
# Message master reassigns
just msgs-reclaim --brief 001 --from omarchy-main --to mac-session
```

The offender gets notified:
```json
{
  "from": "message-master",
  "type": "block",
  "topic": "brief-001",
  "status": "open",
  "summary": "Deadline missed. Brief reclaimed from omarchy-main. Foxtrot Oscar."
}
```

---

## Message Types

| Type | Meaning | Response needed? |
|------|---------|------------------|
| `claim` | I'm working on this brief | None — others know not to duplicate |
| `report` | Work completed | Acknowledge |
| `block` | Waiting on something | Respond |
| `info` | Status update, awareness only | None |

---

## Message Master

One machine is appointed **message master**. Responsibilities:

1. **Cleanup old messages** — archive resolved messages monthly
2. **Monitor CLAIMS/** — detect expired claims
3. **Reclaim expired briefs** — reassign to available agent
4. **Notify offenders** — "Foxtrot Oscar" when someone misses deadline

```bash
# Run on message master (e.g., mac)
just msgs-master

# Checks:
# - Expired claims in msgs/CLAIMS/
# - Stale messages in msgs/from-*/
# - Sends notifications
```

---

## Just Commands

```bash
just msgs-mode single   # Single machine (no coordination)
just msgs-mode multi    # Multi machine (full coordination)
just msgs-mode          # Show current mode

just msgs-inbox         # Show unacknowledged messages
just msgs-read          # Read all recent messages

just msgs-claim --brief 001  # Claim a brief
just msgs-report --brief 001 --status complete  # Report completion

just msgs-master        # Run message master duties
```

---

## Pull Before Commit (Always)

```bash
# At start of EVERY session
git pull                    # Always pull first
just msgs-inbox             # Check for messages
just td next                # Get tasks from td

# Single machine: inbox empty → continue
# Multi machine: process messages → acknowledge → continue

# Do work...

git add ... && git commit   # Commit your work
git push                    # Push results + any messages
```

---

## Integrating with td

**Messages become tasks. td is the SSOT for agent operations.**

Other machines send messages. You pull. Those messages become td tasks. After processing, you clear them down.

```bash
# 1. Pull
git pull

# 2. Check inbox
just msgs-inbox

# 3. Process open messages into td
for msg in $(grep -l '\"status\": \"open\"' msgs/from-*/$(date +%Y-%m-%d)*.json 2>/dev/null); do
    TOPIC=$(cat "$msg" | jq -r '.topic')
    SUMMARY=$(cat "$msg" | jq -r '.summary')
    FROM=$(cat "$msg" | jq -r '.from')
    
    if grep -q '\"action_needed\": \"[^none]\"' "$msg" 2>/dev/null; then
        td add "[$FROM] $TOPIC" --minor
    fi
    
    # Acknowledge
    mv "$msg" "${msg%.json}-acknowledged.json"
done

# 4. Continue with td
td next
```

---

## War-Game: Current Scenario

**Situation:** Omarchy agent deprecates Flox. Mac agent should be aware but not act.

### Omarchy sends (in multi mode)

```bash
# On Omarchy
just msgs-mode multi
just msgs-claim --brief flox-deprecation

# Creates CLAIMS/flox-deprecation.json
# Then reports status
just msgs-report --brief flox-deprecation --status info --summary "Flox deprecated. No code impact. cool-pi-extensions unaffected."
```

### Mac reads and acknowledges

```bash
# On Mac
git pull
just msgs-inbox  # sees the report

# No td task needed (no action required)
# Acknowledge
just msgs-report --brief flox-deprecation --status acknowledged --summary "Mac aware. No action needed."
```

### Result

- Omarchy claims the brief, does the work, reports completion
- Mac acknowledges, notes, continues
- td history shows the coordination
- No duplicate work. No missed tasks. Discipline maintained.

---

## Scaling Path

### Stage 1: Current (2 machines, 2 agents)
- Simple: `msgs/from-mac/`, `msgs/from-omarchy/`
- CLAIMS/ for brief coordination

### Stage 2: Multi-machine (3-5 machines)
- Per-machine outboxes: `msgs/from-[hostname]/`
- Message master rotates monthly

### Stage 3: Team (humans + agents)
- Humans use `just msgs-send` for coordination
- Agents use CLAIMS/ for work coordination
- Audit trail via `git log -- msgs/`

### Limitations

| Limitation | Impact | Mitigation |
|------------|--------|------------|
| Latency (30-60s) | Not real-time | Accept for coordination; urgent = direct |
| Volume | Noisy git log | Archive monthly |
| No push notifications | Agent might miss message | Poll on pull; human monitors |
| Claim enforcement | relies on message master | Automate with `just msgs-master` |

**The discipline argument:** Teams use Slack. We use Git. Same coordination, better audit trail, no vendor dependency. The limitations are acceptable if the team maintains discipline.

---

## See Also

- `docs/terminal-stack.md` — infrastructure
- `briefs/008-the-invisible-cables.md` — td + sidecar
- `playbooks/dev-stack-setup.md` — what the stack is