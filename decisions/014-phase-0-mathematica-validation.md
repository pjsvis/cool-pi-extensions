# Decision 014: Phase 0 Mathematica validation — outcomes + recommendations

**Date:** 2026-07-12
**Status:** Accepted (research findings) — *user verification gate remains open*
**Review:** 2026-10-12 (quarterly barnacle review — 90 days from decision date)
**TD:** td-77403f

---

## Context

The `pi-mathematica-verify` harness (epic `td-2456d5`; Phase 1 `td-1e3602` complete per debrief 009) routes tensor-algebra claims through Wolfram Mathematica. Phase 0 was instituted as a **go/no-go gate** for Phases 2 (Cloud `APIFunction` deploy) and 5 (local `wolframscript` + xAct). The three questions:

1. Is Wolfram Cloud API access obtainable (with relevant permissions-key auth)?
2. Can a current Mathematica desktop app be downloaded?
3. Does the user's existing **v10.0** (2014) install need an upgrade for `wolframscript` CLI and Cloud tooling?

The v10.0 question was the load-bearing one: even if (1) and (2) are "yes", the existing kernel must be able to *bridge* to a modern Cloud-aware runtime; if it can't, Phase 5 dead-ends on Endpoint A regardless of how cheap the API is.

The user has been using Mathematica v10.0 since 2014. No active cloud subscription (per the brief). xAct (the third-party abstract-tensor package required for Phase 5) was a separate concern — runs on v10+ but has its own version compatibility story.

## Research

Each of the three questions was researched against current Wolfram documentation. Citations inline.

### Q1 — Wolfram Cloud API access: obtainable ✅

Multiple confirmed paths:

- **Wolfram Cloud Basic** — *free*. 5,000 Cloud Credits/month, 200 MB cloud storage, temporary deployments (60-day expiry on each cloud object). Restricted to **non-organizational use** (personal study, hobby, your own book). Source: <https://support.wolfram.com/53990>.
- **Cloud Credits purchase** — credits don't expire *as long as you maintain an eligible subscription*. Pricing tiers per <https://www.wolfram.com/cloud-credits/>: 50,000 = $15, 100,000 = $25, 1,000,000 = $180. *Caveat:* the per-call unit is "1 credit per 100 ms of computation", so the credit cost of a verification depends on the assertion's compute time — budget empirically, do not extrapolate from this table.
- **Wolfram|One Personal** — paid desktop + cloud combo ($/year, exact price obscured by marketing scrape but in the literature; requires Personal-Edition eligibility — hobbyist/non-professional).
- **`APIFunction` + `PermissionsKey`** — both documented and supported. *Important:* `PermissionsKey` is a Wolfram Language 11.0+ symbol (introduced 2016). A v10.0 desktop cannot parse `CloudDeploy[…, Permissions -> PermissionsKey["k"]…]` and cannot be the deployment host. Q1 is still "yes, obtainable" — the user upgrades the desktop (per Q3) and uses the modern symbol. Source: ref.wolfram.com/language/ref/PermissionsKey.html, ref.wolfram.com/language/workflow/DeployAnAPIThatUsesAPermissionsKey.html.

**Outcome for Q1:** yes, obtainable. Free tier (5K credits/month) is sufficient for an MVP of Phase 2; sustained use justifies credit purchase or a Wolfram|One Personal subscription. **The harness value (one verification per curated assertion) is well within 5K credits/month** for a 60-equation book sweep (≈ 300 verifications for a 60-equation × 5-assertion sweep).

### Q2 — Current Mathematica desktop app: downloadable ✅

Confirmed via the Personal Edition FAQ (<https://www.wolfram.com/mathematica/pricing/personal/>):

- Requires a **Wolfram ID** (free to create at account.wolfram.com).
- Download delivers a `.dmg` for macOS — drag to `/Applications`, run installer. **Mac-specific:** the WolframScript piece lives in a separate `Extras.pkg` bundled in the download; the standalone runtime is launched as `Mathematica.app`. (For v11.1+, WolframScript was packaged with the system, but `Extras.pkg` is still the Mac-specific delivery mechanism for browser plugins; the standalone `WolframScript_<ver>_MAC.dmg` from `wolfram.com/wolframscript/` is the cleanest bridge).
- Latest Wolfram Language: **15.x** (visible in `wolframscript` REPL examples: "Wolfram 15.0.0 Kernel for Mac OS X ARM").
- Personal Edition is for "hobbyists, enthusiasts" — non-professional, non-academic. The book's author fits this profile.

**Outcome for Q2:** yes, downloadable. Personal Edition eligibility is the gate the user must self-attest.

### Q3 — v10.0 upgrade decision: **mandatory** upgrade ⬆️

The decisive points:

- `wolframscript` was **introduced in Wolfram Language 11.0 (2016)** and **documented to ship with 11.1+**. v10.0 (2014) **predates `wolframscript` by two years**. There is no `wolframscript` binary for v10.0. Source: <https://reference.wolfram.com/language/ref/program/wolframscript.html> ("Introduced in 2016 (11.0)|Updated in 2020 (12.2)"); <https://blog.wolfram.com/2017/05/17/wolframscript-run-your-code-from-anywhere/> ("WolframScript comes packaged with Version 11.1 of Mathematica").
- A current Cloud can be accessed from a v10.0 desktop *only* via `URLFetch`/HTTP, not via `wolframscript -cloud`. Sub-optimal but legal; we'd lose the script-as-API pattern that makes Phase 5 clean.
- xAct compatibility story is the catch:
  - **Current xAct:** 1.3.0 (Dec 29, 2025). Requires Mathematica 9+ for related packages. Source: <https://xact.es/download.html>.
  - **Known bug:** xAct 1.3.0 has documented incompatibilities with **Mathematica 14.3+** — `Commutator` / `Anticommutator` symbol collisions. Workaround exists (`Unprotect[Commutator, Anticommutator]; ClearAll[Commutator, Anticommutator]; Remove[Commutator, Anticommutator]; << xAct\`xTensor\` << xAct\`xCoba\``), but it's brittle.
  - **Stable pairing:** xAct 1.2.0 (October 2021, predecessor of the current version) on Mathematica 13.x or 14.0/14.1 — broadly reported as the cleanest combination in literature.

**Outcome for Q3:** v10.0 must upgrade. Recommended pairing:

| Target | Cost | xAct pairing | Notes |
|--------|------|--------------|-------|
| **Mathematica 14.x + xAct 1.2.0** | Personal subscription $/$year | Stable | Best risk-adjusted choice. Modern enough for wolframscript and the current Cloud tooling. The 14.3+ collision is xAct-1.3.0-specific (a `Commutator`/`Anticommutator` symbol-collision when 1.3.0 is loaded on 14.3+); sticking with **xAct 1.2.0** sidesteps it on any 14.x. |
| **Mathematica 13.x + xAct 1.2.0** | Same | Stable | Conservative. Fine if the user wants zero xAct risk. |
| **Mathematica 15.x + xAct 1.3.0** | Same | Workaround required | Bleeding edge. The `Unprotect[Commutator, Anticommutator]; ClearAll[…]; Remove[…]` shim is documented but ugly. Reserve for users who need the very latest Language features. |
| **Stay on v10.0** | $0 | n/a (no xAct pairing mission) | **REJECTED** — no `wolframscript`, no script-as-API pattern, Phase 5 dead-ends. |

## Recommendation matrix

| Question | Outcome | Action | Owner |
|----------|---------|--------|-------|
| 1. Cloud API | obtainable | Sign up for Wolfram Cloud Basic (free) | user |
| 2. Local app | downloadable | Download via Wolfram ID; confirm Personal-Edition eligibility | user |
| 3. v10.0 → upgrade | **mandatory** | Upgrade to **Mathematica 14.x** OR **13.x**; pair with **xAct 1.2.0** (not 1.3.0) | user |
| 4. APIFunction + PermissionsKey | documented in current docs | Phase 2 build can use `CloudDeploy[APIFunction[…], Permissions -> PermissionsKey["k"] -> "Execute"]` exactly as the brief specifies | implementer |
| 5. wolframscript on Mac | comes with workbook install or standalone | Download `WolframScript_<ver>_MAC.dmg` from `wolfram.com/wolframscript/` if `Extras.pkg` doesn't surface the binary | user |
| 6. xAct download | free, `xact.es/download.html` | `tar xzf xAct_1.2.0.tgz -C ~/Library/Mathematica/Applications/` (creates `~/Library/Mathematica/Applications/xAct/`) | user |
| 7. Cloud Credits baseline | 5,000/month is fine for MVP | Calibrate empirically — log actual credit usage during the first book sweep before committing to a paid tier | user |
| 8. Bridge from v10.0 to Cloud | NOT recommended | Skip it — upgrade is mandatory anyway | n/a |

## Phase gate status

**Phase 2 (`td-6f4bd4`):** can begin once the user confirms:
- Wolfram Cloud Basic account created (or paid plan chosen).
- Cloud Credentials in hand (a `CloudCredentials[..]` or a `_key=` PermissionsKey for the deployed assertion set).

**Phase 5 (`td-1ef78c`):** can begin once the user confirms:
- Desktop Mathematica **13.x or 14.x** is installed and `wolframscript -code 1+1` returns `2`.
- `xAct 1.2.0` is unpacked into `~/Library/Mathematica/Applications/xAct/` and `<< xAct\`xTensor\`; << xAct\`xCoba\`` (in a fresh kernel; backticks inside the package names are required) loads cleanly without `Commutator`/`Anticommutator` symbol errors.

Both gates are *user-side provisioning*. There is no implementation work left in Phase 0 — the decision encodes the answers. Recommend the user tick the boxes; the implementation work can start immediately on confirmation.

## Why this decision now, not later

The previous session identified Phase 0's "v10.0 currency" as the question to resolve up front ("12 years old. CLI bridge and Cloud tooling may force an upgrade. Resolve in Phase 0"). Decision 010 decoupled *translator validation* from access (so Phase 1 could proceed in parallel); this decision couples *Phase 2/5 commencement* to access provisioning. Going further (into the actual APIFunction deploy or local-kernel script bridge) without this resolution would consume build effort against a kernel that cannot host the bridge. Watt's test: do not turn the steam engine until the boiler is sized.

## Risks & open observations

- **Personal-Edition eligibility** — the user must self-attest the "hobbyist, enthusiast" criterion. They do not run a business off this work as of session date, but a future change in circumstance would invalidate this.
- **`Wolfram ID` vs `Mathematica license`** — a Wolfram ID is required either way; the *license* is what gives you compute access. Phase 0 requires both.
- **xAct 1.2.0 vs 1.3.0** — xAct 1.2.0 is the conservative choice. If Phase 5 reveals xAct 1.3.0-era features are required (e.g., a tensor operation that's only in current xAct), bumping to 1.3.0 + the workaround is acceptable; otherwise stay on 1.2.0.
- **Cloud Basic "non-organizational use"** — fine for the book's verification, but if the work ever becomes a published research tool, the user must graduate to a paid plan. Distinct from the verifier itself, which is a personal drafting aid.
- **`wolframscript` on Mac vs Linux/Windows** — Mac `Extras.pkg` is documented; Linux/Windows ship `wolframscript` with the system installer. If Phase 5 ever moves off Mac, the bridge paths diverge. Phase 1 testing on Mac is the simplest path.

## References

- Brief: `briefs/2026-07-09-brief-mathematica-verify-extension.md` (Phase 0 row in the build phases table; Backend B version-risk paragraph)
- Decision 010: translator validation decoupled from API access
- Decision 011: lookup-first verification registry
- Cloud Basic restrictions: <https://support.wolfram.com/53990>
- Cloud Credits pricing: <https://www.wolfram.com/cloud-credits/>
- WolframScript reference: <https://reference.wolfram.com/language/ref/program/wolframscript.html>
- wolframscript history: <https://blog.wolfram.com/2017/05/17/wolframscript-run-your-code-from-anywhere/>
- APIFunction reference: <https://reference.wolframcloud.com/language/ref/APIFunction.html>
- PermissionsKey reference: <https://reference.wolfram.com/language/ref/PermissionsKey.html>
- Permissions workflow: <https://reference.wolfram.com/language/workflow/DeployAnAPIThatUsesAPermissionsKey.html>
- xAct download: <https://xact.es/download.html>
- Mathematica Personal pricing: <https://www.wolfram.com/mathematica/pricing/personal/>
- xAct ↔ Mathematica 14.3 incompatibility: <https://groups.google.com/g/xAct/c/u0SBo0WJIts>

---

*The Phase 0 gate swings. Map ≠ territory still — the user must confirm they actually have a Wolfram ID with the right skin on it. But there is no further research to do; everything else is provisioning.*
