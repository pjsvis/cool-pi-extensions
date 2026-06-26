# Brief 013 – Lightweight System with Minimal Overhead

**Goal** – Capture the consensus on a low‑friction, high‑integrity workflow that can be copied to other repositories.

---

## 1. Core Loops (the “alpha‑gamma‑delta” triad)

| Loop | Purpose | Artifact | Location |
|------|---------|----------|----------|
| **Alpha‑loop** | Create a *brief* that records *what* and *why* before any code is written. | Brief document | `briefs/` (e.g., `briefs/002‑pi‑check‑zenmux.md`) |
| **Gamma‑loop** | Keep tasks visible and ordered. | td task entry | `.todos/` (managed by the `td` CLI) |
| **Delta‑loop** | Persist *lessons‑learned* after implementation. | Debrief document | `debriefs/` (e.g., `debriefs/007‑multi‑machine‑mesh‑and‑bounded‑context.md`) |

These loops guarantee **Conceptual Entropy Reduction** – each step adds structure before chaos can accumulate.

---

## 2. Guardrails

- **Edinburgh Protocol** – Constraint stack (Hume, Smith, Watt) that forces agents to be skeptical, system‑oriented, and to treat outputs as *maps*.
- **Barnacle Protocol** – Periodic drift audit (`docs/barnacle‑reports/`) that removes stale configuration and enforces the “no‑mcp, no‑fluff” rule.
- **Popper Party** – Every claim must be falsifiable; a *Popperian* section describes the experiment to test the claim.

---

## 3. Lightweight Additions (the “minimal overhead” upgrades)

1. **Experiment flag** – Prefix a commit/message with `#exp`. A post‑run hook automatically creates a debrief stub, allowing rapid prototyping without breaking the delta‑loop.
2. **Semantic CI check** – Extend the existing `just check` pipeline with a step that runs a short suite of Popper‑Party falsifiability tests on each PR. Failing tests block merge until the experiment is either fixed or the claim is removed.
3. **Skepticism budget** – Allocate a fixed number of “question‑cycles” per sprint (e.g., 3). Once exhausted, the next change proceeds with a “trust‑but‑verify” stance; a debrief later validates the outcome. This prevents analysis‑paralysis while preserving healthy doubt.

---

## 4. Benefits

- **Speed** – The core loops are lightweight; the added guardrails are automated and optional for throw‑away experiments.
- **Reliability** – Continuous monitoring (Barnacle, CI) catches drift before it becomes a failure.
- **Scalability** – New agents can `just orient` and inherit the same constraints without manual onboarding.

---

## 5. Next Steps for Adoption

1. Copy the `briefs/`, `debriefs/`, `docs/barnacle-reports/`, and `playbooks/` directories into the target repo.
2. Add the `just check` CI step and the *semantic integrity* step (see `playbooks/014‑lightweight‑system.md`).
3. Symlink the Edinburgh Protocol prompt to `AGENTS.md` (or copy `prompts/edinburgh-protocol.md`).
4. Run `just orient` in the new repo to initialise the td session and generate the first task entry.
5. Use the `#exp` flag for quick experiments; the system will auto‑generate a debrief stub.

---

**Prepared by** – The Edinburgh Protocol team (Scottish Enlightenment) – 2026‑06‑26