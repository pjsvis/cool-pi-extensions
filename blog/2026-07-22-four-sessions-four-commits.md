---
title: Four Sessions, Four Commits
dek: The theory said new up at phase boundaries to keep cost O(n). The eval consolidation was the first epic run under the discipline start to finish — 4 tasks, 4 sessions, 4 commits, zero context overflow. Here is what the practice looks like when it works.
date: 2026-07-22
---

# Four Sessions, Four Commits

## tldr

The Edinburgh Protocol's session-newup discipline — handoff, `/clear`, resume
from compressed state — was applied to a real epic: consolidating three eval
engines into one canonical CLI. The epic decomposed into 4 tasks, each run in
a bounded session that read the brief and the prior handoff, never the raw
transcript. Four sessions, four commits, four clean reviews. The work took
~40 minutes of wall time. The theory said cost would be *O(n)* in turns. The
practice confirmed it. This is the worked example the theory was missing.

## content

### The epic

The eval surface had grown into three engines with duplicated logic: a
session-hijacking extension (~1,700 LOC), a headless runner (1,243 LOC), and
a scoring eval (748 LOC). Two assertion engines, two grading paths, two log
formats. The consolidation brief proposed a single canonical `pi-eval` CLI
with the extension reduced to a thin port — and identified four tasks with
clean phase boundaries:

```
        ┌─ task 2 (score/matrix) ─┐
task 1 ─┤                         ├─ task 4 (cleanup + debrief)
        └─ task 3 (extension port)┘
```

Task 1 was the load-bearer: extract the shared library before building
commands on top of it. Tasks 2 and 3 both depended on 1 but not on each other.
Task 4 swept up after both. The dependency graph was a DAG, not a chain — but
the work was sequential, not parallel, because tasks 2 and 3 both touched the
same CLI directory.

### The discipline

Each task was one session, run under the protocol's bounded-context rule:

1. **Start.** `td start <id>` — the session is recorded, the task's acceptance
   criteria are loaded.
2. **Work.** Read the brief (frozen spec, ~5 KB) + the prior handoff
   (compressed state). Never the raw transcript. Build to the acceptance
   criteria. Commit.
3. **Handoff.** `td handoff <id>` — capture what was done, what remains, the
   decisions made. This is the lossy compression. The handoff is the only
   thing that crosses the `/clear`.
4. **New up.** `/clear` — the megabytes are dropped. The meter resets.
5. **Resume.** The next session runs `td start <id>` and `td context <id>`,
   reads the brief + handoff, and continues. The handoff is the seed; the raw
   transcript is the entropy.

The brief was the frozen *what* and *why*. The handoff was the compressed
*where am I*. The locus tags in the handoff (`[LOC: phase]`,
`[WAYPOINT: milestone]`) told the fresh session which files and milestones
mattered, so it didn't have to re-derive the map from a wall of transcript.

### The four sessions

**Session 1 — CLI scaffold + shared lib (task 1, the load-bearer).**

The longest session. Read two large source files (1,243 + 748 LOC) and built
14 new files: the shared library (`types.ts`, `providers.ts`,
`assertions.ts`, `grading.ts`, `logging.ts`, `fixtures.ts`, `config.ts`) plus
five commands (`run`, `status`, `list`, `fixtures`, `clear`). Smoke-tested
with a free OpenRouter model. Committed. The handoff told session 2 exactly
where to find the `gradeReasoning()` function it would need — already in
`lib/grading.ts` — and what was left: the keyword scorer and model registry
still in the old file, not yet extracted.

**Session 2 — Score + matrix subcommands (task 2).**

Fresh context. Read the brief + handoff. Extracted the keyword scorer and
model registry into `lib/scoring.ts` (442 LOC). Built `score.ts` and
`matrix.ts` commands. Smoke-tested: `pi-eval score nemotron-nano` → 14/19;
`pi-eval matrix nemotron-nano` → +8 delta (protocol helps). Committed. The
handoff told session 3 to rewrite the extension to a thin port and delete the
engine files — logic was now in the CLI lib.

**Session 3 — Extension thin port (task 3).**

Fresh context. Read the brief + handoff. Rewrote the extension from 532 LOC
(state machine + 6 event hooks + `pi.setModel()`) to 116 LOC (shells out to
the CLI). Deleted four engine files. No state machine, no
`turn_*`/`message_update` hooks, no `pi.setModel()`. Only the `model_select`
advisory hook remained. Committed. The handoff told session 4 to delete the
old runners and file the debrief.

**Session 4 — Cleanup + debrief (task 4).**

Fresh context. Read the brief + handoff. Deleted `pi-eval-runner.ts` (1,243
LOC) and `edinburgh-eval.ts` (748 LOC). Updated `eval.sh` to route all
commands to the new CLI. Removed ~330 lines of dead bash. Updated README +
MANIFEST. Filed the debrief. `just check` passed. Committed. Epic closed.

### The numbers

| Session | Task | Commit | LOC built | LOC deleted | Wall time |
|---|---|---|---|---|---|
| 1 | CLI scaffold + lib | `fc69e38` | +1,982 | 0 | ~15 min |
| 2 | Score + matrix | `f64cfe1` | +989 | −5 | ~6 min |
| 3 | Extension port | `62a98b9` | +60 | −1,730 | ~3 min |
| 4 | Cleanup + debrief | `bda54ce` | +170 | −2,386 | ~5 min |
| **Total** | | | **+3,201** | **−4,121** | **~29 min** |

Net: −920 LOC across the epic. One canonical engine replaced three duplicated
ones. The extension went from 532 to 116 LOC. No session carried the prior
session's transcript. Each session's context was the brief (~5 KB) + one
handoff (~1 KB) + the files it was touching.

### What made it work

**The brief was frozen.** Every session read the same spec for the *what* and
*why*. No session re-derived the approach. The brief was written before task 1
started and never changed. The handoff was the only thing that varied — it
carried the *where am I* that the brief couldn't know.

**The dependency graph was explicit.** The `td` issues had `--depends-on`
flags. Session 2 couldn't start until session 1 committed the shared lib.
Session 4 couldn't start until sessions 2 and 3 were both closed. The DAG
wasn't advisory — `td` enforced it.

**The handoffs were structured.** Each handoff had `--done` (what was
completed), `--remaining` (what's left), `--decision` (choices made), and a
`-m` message (the narrative for the next session). The fresh session didn't
have to parse a wall of transcript to find the state — it was pre-parsed.

**The acceptance criteria were verifiable.** Each task had a checklist:
"pi-eval run reproduces a known result," "index.ts ≤150 LOC with no state
machine," "just check passes." The session knew when it was done. No
ambiguity, no scope creep.

**The load-bearer was task 1.** Extracting the shared library first meant
tasks 2–3 were additive — they built on a stable substrate, not on a moving
target. If task 1 had stalled, the handoff would have let a fresh session
pick it up clean. It didn't stall. But the safety net was there.

### What the theory predicted, and what happened

The theory (from [Shannon, the Session, and the $46](2026-07-18-shannon-the-session-and-the-46.md))
says: each turn re-sends the full history. Cost is *O(n²)* in turns. New up
at phase boundaries to keep it *O(n)*. The handoff is source coding; the
newup is the channel reset.

What happened: four sessions, each with a small context (brief + handoff +
working files). No session carried more than ~15 KB of prior-state context.
No session hit a context wall. No session went in circles or forgot what the
prior session had decided. The model in each session was decoding a clean
channel with a known preamble (the locus tags in the handoff).

The counterfactual — running all four tasks in one session — would have
re-sent the full transcript on every turn. By task 3, the session would have
been slinging 50+ KB of accumulated transcript: two large source files read
in task 1, 14 new files built in task 1, the scoring eval read in task 2, the
extension read in task 3. The SNR would have collapsed. The model would have
started "going in circles" — not because it's dumb, but because the channel
was full of correlated noise from its own prior attempts. The $46 lesson,
miniaturised.

The discipline didn't make the work faster. It made the cost linear instead
of quadratic. The work took the same number of turns. The turns just didn't
compound.

## narrativised-bibliography

The theory this case study validates was developed in
[Shannon, the Session, and the $46](2026-07-18-shannon-the-session-and-the-46.md)
— the context window as a noisy channel, the handoff as source coding, the
newup as channel reset. That post and this one are a pair: the theory there is
untestable without the practice here. The companion piece,
[Token Minimisation](2026-07-18-token-minimisation.md), is the operational
manual — the phase boundary, the handoff, the manager's job. It explains *why*
the discipline exists. This case study explains *what it looks like*.

The bounded-session discipline itself is codified in the repo's `AGENTS.md`
under "Bounded Tasks & Session Newup Discipline," and it references the
$46 lesson (`briefs/2026-07-18-brief-session-newup-discipline.md`) as its
origin. The discipline was retrofitted after the $46 incident; this epic was
the first one run under it from the start. The `td` task manager
(`marcus/td` on Homebrew) provided the infrastructure — issues with
dependency DAGs, structured handoffs, session tracking, and review/approve
workflow. Without `td`, the handoff would be a pasted block of text; with it,
the handoff is a queryable artifact that survives the `/clear`.

The eval consolidation itself is documented in
[Decision 021](../decisions/021-eval-engine-cli-first-thin-extension-port.md)
(the architecture) and
[Debrief 012](../debriefs/012-pi-eval-cli-consolidation.md) (the reflection).
The brief that froze the spec before any code was written is at
`briefs/2026-07-22-brief-pi-eval-cli-consolidation.md`. The four commits are
`fc69e38`, `f64cfe1`, `62a98b9`, `bda54ce` — one per session, one per task.

---

*Part of the [Edinburgh Protocol](https://github.com/pjsvis/cool-pi-extensions)
series. The theory is in [Shannon, the Session, and the $46](2026-07-18-shannon-the-session-and-the-46.md).
The manual is in [Token Minimisation](2026-07-18-token-minimisation.md).
This is the worked example.*
