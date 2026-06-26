# Playbook 014 – Propagating the Lightweight System to New Repositories

**Audience** – Engineers, AI agents, and maintainers who want to adopt the low‑overhead, high‑integrity workflow described in Brief 013.

---

## Prerequisites

1. **Git** – repository access to the target repo.
2. **just** – the task runner used by the Pi ecosystem.
3. **td** – installed (comes with the Pi tooling).
4. **CI platform** – GitHub Actions, GitLab CI, or similar (to run `just check`).

---

## Step‑by‑Step Adoption

| # | Action | Command / File | Description |
|---|--------|----------------|-------------|
| 1 | **Clone the repo** | `git clone <repo‑url> && cd <repo>` | Work in a clean checkout. |
| 2 | **Create required folders** | `mkdir -p briefs debriefs docs/barnacle-reports playbooks` | Align with the folder layout used by the source repo. |
| 3 | **Copy core artefacts** | `cp -r /Users/petersmith/Dev/GitHub/cool-pi-extensions/briefs/* briefs/`<br>`cp -r /Users/petersmith/Dev/GitHub/cool-pi-extensions/debriefs/* debriefs/`<br>`cp -r /Users/petersmith/Dev/GitHub/cool-pi-extensions/docs/barnacle-reports/* docs/barnacle-reports/`<br>`cp -r /Users/petersmith/Dev/GitHub/cool-pi-extensions/playbooks/* playbooks/` | Bring over the template docs, briefs, debriefs, and existing playbooks. |
| 4 | **Add the Edinburgh Protocol prompt** | `ln -sf /Users/petersmith/Dev/GitHub/cool-pi-extensions/prompts/edinburgh-protocol.md AGENTS.md` | Guarantees the constraint stack is loaded for every session. |
| 5 | **Install the `just` check** | `just install-deps && just check` | Verifies that the CI‑compatible `just check` script is present and passes. |
| 6 | **Configure CI for semantic integrity** | Add the following step to your CI workflow (example for GitHub Actions):
```yaml
- name: Semantic Integrity (Popper Party)
  run: |
    just check
    ./scripts/semantic‑integrity.sh   # runs Popper‑Party falsifiability tests
```
The script should fail the job if any PR lacks a `## Popper Experiment` section for production‑code changes. |
| 7 | **Enable the experiment flag** | Add a Git hook (`.git/hooks/commit-msg`) that detects `#exp` and creates a stub debrief:
```bash
#!/usr/bin/env bash
if grep -q "#exp" "$1"; then
  BRIEF="debriefs/$(date +%Y%m%d%H%M%S)-exp.md"
  cat <<EOF > "$BRIEF"
# Debrief – Experiment $(date)

## Popper Experiment

*What is being tested?*
*How will we falsify it?*

EOF
fi
```
Make it executable (`chmod +x .git/hooks/commit-msg`). |
| 8 | **Set a skepticism budget** | Add a simple JSON config file `config/skepticism.json`:
```json
{
  "budget": 3,
  "reset": "sprint"
}
```
Your agents can read this file and decrement the counter after each “question‑cycle”. |
| 9 | **Run orientation** | `just orient` | Initializes the td session, creates the first task entry, and prints the current constraint stack. |
|10 | **Validate the workflow** | Create a tiny feature branch, add a brief (`briefs/015‑demo‑feature.md`), run `td add <task>`, push a PR, and verify that the CI runs both `just check` and the semantic integrity step. |

---

## Ongoing Maintenance

- **Barnacle audit** – Run `just barnacle-audit` (or the script in `scripts/barnacle-audit.sh`) at least once per sprint.
- **Popper Party updates** – When a new claim is added, ensure the corresponding experiment section is present; the CI will enforce this.
- **Skepticism budget reset** – Reset the counter at the start of each sprint (e.g., via a CI job or a manual `td reset` command).

---

## Benefits Recap

- **Minimal ceremony** – Only a few files and a couple of CI steps.
- **High integrity** – Continuous monitoring, falsifiable claims, and a disciplined guardrail.
- **Scalable** – New repos get the same structure by copying this playbook; agents can `just orient` and start working immediately.

---

**Prepared by** – The Edinburgh Protocol team (Scottish Enlightenment) – 2026‑06‑26