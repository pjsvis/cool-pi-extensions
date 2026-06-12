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

## Structure

```
cool-pi-extensions/
└── msgs/
    ├── from-mac/         # Messages from Mac agent (write here)
    ├── from-omarchy/     # Messages from Omarchy agent (write here)
    ├── from-[name]/      # Each agent/machine has its own outbox
    └── README.md         # This file
```

Each message is a JSON file:
```json
{
  "from": "omarchy-main",
  "to": "mac-session",
  "type": "report|handoff|block|info",
  "topic": "flox-deprecation",
  "status": "open|acknowledged|resolved",
  "timestamp": "2026-06-12T14:35:00Z",
  "summary": "Flox deprecated and removed. No code impact.",
  "detail": "..."
}
```

---

## Key Discipline: Pull Before Commit

**Always run `git pull` before any commit, even on single machine.**

This serves two purposes:
1. Gets latest msgs from other machines before you commit anything
2. Prevents merge conflicts by keeping you current

The flow:
```bash
git pull                    # 1. Pull first — always
just msgs-inbox            # 2. Check inbox from other machines
# Process messages into td (see below)
git add ... && git commit  # 3. Commit your work
```

## Integrating with td

**Messages become tasks. td is the SSOT for agent operations.**

Other machines send messages. You pull. Those messages become td tasks. After processing, you clear them down. This keeps td as the single task database while allowing multi-machine coordination.

### Message → td → Clear flow

```bash
# 1. Pull messages
git pull

# 2. Check inbox
just msgs-inbox

# 3. Process open messages into td
for msg in $(grep -l '"status": "open"' msgs/from-*/$(date +%Y-%m-%d)*.json 2>/dev/null); do
    # Extract topic and summary
    TOPIC=$(cat "$msg" | jq -r '.topic')
    SUMMARY=$(cat "$msg" | jq -r '.summary')
    FROM=$(cat "$msg" | jq -r '.from')
    
    # Create td task if action needed
    if grep -q '"action_needed": "[^none]"' "$msg" 2>/dev/null; then
        td add "[$FROM] $TOPIC" --minor
        # or: td add "From $FROM: $SUMMARY" -t "task"
    fi
    
    # Mark as acknowledged
    # (in production, use jq to update status to "acknowledged" in place)
    mv "$msg" "${msg%.json}-acknowledged.json"
done

# 4. Continue with td task management
td next
```

### Message types and td mapping

| Message type | td action | Clear down? |
|-------------|-----------|-------------|
| `info` | No task (awareness only) | Yes — just acknowledge |
| `report` | Review task (if relevant) | Yes — acknowledge |
| `handoff` | Create task for the work | Yes — td task created |
| `block` | Create blocker task | Yes — td task created, respond to source |
| `request` | Create clarification task | Yes — td task created, respond to source |

### Example: Omarchy sends a handoff

Omarchy sends:
```json
{
  "from": "omarchy-main",
  "to": "mac-session",
  "type": "handoff",
  "topic": "fix-glow-preview-crash",
  "status": "open",
  "action_needed": "mac-should-fix",
  "summary": "Glow preview crashes on large files. Omarchy traced to buffer size. Needs fix in src/fresh/glow-preview.ts"
}
```

Mac receives, processes into td:
```bash
td add "[omarchy] fix-glow-preview-crash" -t task
td log "From omarchy: Glow preview crashes on large files. Traced to buffer size. src/fresh/glow-preview.ts"
# Mark message as acknowledged
git add msgs/from-omarchy/ && git commit -m "msgs: ack handoff from omarchy, created td task"
```

### td handoff messages

When you complete a td task that originated from another machine, send a report back:

```bash
just msgs-send --to omarchy --topic fix-glow-preview-crash --type report --summary "Fixed. Buffer size capped at 1MB. Test on large files confirms."
git push
```

Omarchy pulls, sees the report, clears their side.

**The SSOT is td.** Messages are delivery. td is the database.

### Message naming
```
YYYY-MM-DD-HHMM-[topic].json
```

Example: `2026-06-12-1430-flox-deprecation.json`

### Message types

| Type | Meaning | Response needed? |
|------|---------|------------------|
| `info` | Status update, awareness only | No |
| `report` | Work completed, results available | Acknowledge |
| `handoff` | Task transferred to other agent | Accept and act |
| `block` | Waiting on other agent or resource | Other agent responds |
| `request` | Question or clarification needed | Other agent answers |

### Status flow
```
open → acknowledged → resolved
```

### Read on pull, write on push
```bash
# At start of EVERY session (even single machine)
git pull  # ← Always pull first

# Check for messages from other machines
just msgs-inbox  # or: grep -l '"status": "open"' msgs/from-*/$(date +%Y-%m-%d)*.json

# Single machine: inbox empty → continue
# Multi machine: process messages → acknowledge → continue

# At end of session or when something happens
just msgs-send --to omarchy --topic flox-deprecation --type info --summary "Mac aware, no action needed"

# On significant work (push)
git add msgs/
git commit -m "msgs: omarchy reports flox deprecation, mac acknowledges"
git push
```

### Single vs Multi Machine

**Single machine (one agent or multiple agents sharing td):**
- `msgs/` directory exists but is typically empty
- Agents share td task database directly — no Git coordination needed
- Still pull before commit (habit, prevents merge conflicts)
- msgs/ inbox will be empty = no action needed

**Multi machine (agents on different hosts):**
- Git is the coordination layer
- Omarchy writes to `msgs/from-omarchy/`
- Mac reads from `msgs/from-omarchy/`, writes to `msgs/from-mac/`
- Pull before commit ensures you see other agents' messages before acting
- `just msgs-inbox` shows unacknowledged messages across all machines

---

## Just commands

```bash
just msgs-inbox          # Show unacknowledged messages for this session
just msgs-read           # Read all recent messages
just msgs-send           # Send a message (interactive)
just msgs-send --to omarchy --topic test --type info --summary "Hello"
just msgs-status         # Show message summary stats
```

---

## Simple Implementation

The core is just directories and JSON files. No fancy tooling needed.

### Check inbox (start of session)

```bash
# Pull latest
git pull

# See what's been sent to you (replace YOUR_NAME with your session name)
grep -l '"to": "YOUR-SESSION"' msgs/from-*/YYYY-MM-DD-*.json 2>/dev/null | head -5

# Read the messages
cat msgs/from-omarchy/2026-06-12-*.json | jq .
```

### Send a message

```bash
# Create message file
FROM="mac-session"
TO="omarchy-main"
TOPIC="flox-deprecation"
TYPE="info"
SUMMARY="Mac aware, no action needed"

cat > "msgs/from-mac/$(date +%Y-%m-%d-%H%M)-${TOPIC}.json" << EOF
{
  "from": "${FROM}",
  "to": "${TO}",
  "type": "${TYPE}",
  "topic": "${TOPIC}",
  "status": "acknowledged",
  "timestamp": "$(date -Iseconds)",
  "summary": "${SUMMARY}"
}
EOF

# Commit and push
git add msgs/from-mac/
git commit -m "msgs: ${TYPE} to ${TO} re ${TOPIC}"
git push
```

---

## War-Game: Current Scenario

**Situation:** Omarchy agent deprecates Flox. Mac agent should be aware but not act.

### Omarchy sends

```bash
# On Omarchy
cat > msgs/from-omarchy/2026-06-12-1430-flox-deprecation.json << 'EOF'
{
  "from": "omarchy-main",
  "to": "mac-session",
  "type": "info",
  "topic": "flox-deprecation",
  "status": "open",
  "timestamp": "2026-06-12T14:30:00Z",
  "summary": "Flox deprecated and removed. No code impact. cool-pi-extensions unaffected.",
  "detail": "Flox runtime removed from manifest. just provision updated to use direct installs. Dependencies handled manually.",
  "action_needed": "none",
  "awareness_needed": "mac-agent should note that flox is deprecated in this repo"
}
EOF

git add msgs/from-omarchy/
git commit -m "msgs: flox deprecated and removed — no impact"
git push
```

### Mac reads and acknowledges

```bash
# On Mac (start of session)
git pull

# See the message
cat msgs/from-omarchy/2026-06-12-1430-flox-deprecation.json

# Acknowledge
cat > msgs/from-mac/2026-06-12-1445-ack-flox-deprecation.json << 'EOF'
{
  "from": "mac-session",
  "to": "omarchy-main",
  "type": "acknowledged",
  "topic": "flox-deprecation",
  "status": "resolved",
  "timestamp": "2026-06-12T14:45:00Z",
  "summary": "Mac agent aware. No action needed. Omarchy continues.",
  "detail": "Acknowledged. Bounded contexts maintained. Omarchy handles; mac observes."
}
EOF

git add msgs/from-mac/
git commit -m "msgs: ack flox deprecation — aware, no action"
git push
```

### Result

- Omarchy knows Mac is aware
- Mac's td history shows the awareness
- Human can `git log -- msgs/` and see the full exchange
- No action taken. Discipline maintained. Bounded contexts intact.

---

## Scaling Path

### Short-term (current, 2 machines)
Simple directories: `msgs/from-mac/`, `msgs/from-omarchy/`

### Medium-term (3-5 machines)
- Add sender to filename: `2026-06-12-1430-omarchy-flox-deprecation.json`
- Add JSON metadata for filtering
- Archive old messages monthly

### Long-term (team, multiple agents)
- Per-session outboxes: `msgs/from-mac-session1/`
- Commit notifications via CI (optional)
- `msgs/README.md` documents the protocol

### Limitations

| Limitation | Impact | Mitigation |
|------------|--------|------------|
| Latency (30-60s) | Not real-time | Accept for awareness tasks; use direct comms for urgent |
| Merge conflicts | Two agents commit same dir | Timestamped filenames; branch for complex handoffs |
| Volume | Noisy git log | Archive monthly; `git log -- msgs/ --since "7 days"` |
| No push notifications | Agent might miss message | Poll on pull; human monitors commit log |

**The discipline argument:** Teams use Slack. We use Git. Same coordination, better audit trail, no vendor dependency. The limitations are acceptable if the team maintains discipline.

---

## See Also

- `docs/terminal-stack.md` — infrastructure (TailScale, herdr, pi)
- `briefs/008-the-invisible-cables.md` — td + sidecar as observability layer
- `playbooks/dev-stack-setup.md` — what the stack is