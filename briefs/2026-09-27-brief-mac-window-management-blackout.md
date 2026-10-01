# brief: mac window management blackout — one window manager, zero confounds

**Created:** 2026-09-27
**Status:** executed (user-space verified clean; root-side Karabiner daemons pending owner password) — phase 2 (AeroSpace tuning) unstarted
**Protocol:** Edinburgh Protocol v1.1.0
**Related:** trial-ledger brief (2026-08-18, same blackout-then-reassess pattern applied to *installer ecosystems*; this applies it to *running utilities*); lexicon: *systems not villains*, *the moat question*, *pizza shop*

## What

2026-09-27: surveyed every auto-launching utility on the machine, then disabled
all of them except AeroSpace, to establish a clean baseline for window
management. Survey first, then act — the mechanisms differed per app
(old-style login items, launchd user agents, launchd system daemons,
brew services, SMAppService), so a single lever didn't exist.

### The survey finding

**Four window managers were running simultaneously** — AeroSpace,
BetterSnapTool, Loop, and AutoRaise — each intercepting keyboard events and
repositioning windows with no knowledge of the others. "Mac window management
is rubbish" was a misdiagnosis: the platform was running a committee of
overlapping utilities and getting blamed for the committee. Systems failure,
not vendor villainy.

### Actions taken (all reversible; see matrix)

| Utility | Mechanism | Action | Verified |
|---|---|---|---|
| Raycast | login item | item deleted, app quit, 0 processes | ✓ |
| Karabiner-Elements (user) | 7 launchd agents | `launchctl disable gui/501/...` all, booted out — persists across reboot | ✓ all => disabled |
| BetterSnapTool | login item | deleted, quit | ✓ |
| Loop | login item | deleted, quit | ✓ |
| AutoRaise | brew service | `brew services stop` | ✓ |
| Wispr Flow | login item + swift-helper relauncher | deleted, quit, killed relauncher | ✓ |
| Antinote | login item | deleted, quit | ✓ |
| BetterTouchTool | none (already inert) | no-op | ✓ |
| Google Drive, ProtonVPN | login items | **kept** — infrastructure, not utilities under test | ✓ |
| Stats | SMAppService (CLI-unreachable) | flagged for manual toggle in System Settings | ✗ manual |
| AeroSpace | running, untouched | — | ✓ alive |

### Leftovers for the owner (password required)

1. Karabiner root daemons still run (system domain, PIDs at survey time
   830/831):

   ```bash
   sudo launchctl disable system/org.pqrs.service.daemon.Karabiner-Core-Service
   sudo launchctl disable system/org.pqrs.service.daemon.Karabiner-VirtualHIDDevice-Daemon
   sudo launchctl bootout system/org.pqrs.service.daemon.Karabiner-Core-Service
   sudo launchctl bootout system/org.pqrs.service.daemon.Karabiner-VirtualHIDDevice-Daemon
   ```

   The DriverKit keyboard extension stays loaded but inert — `systemextensionsctl
   uninstall` is a reinstall-level hammer; not needed for an experiment.
2. Stats: flip off in System Settings → General → Login Items if present.
3. AeroSpace: verify *Launch at login* is ticked — the whole system now
   depends on it starting. **No `~/.aerospace.toml` exists**; it runs pure
   defaults.

## Re-enable matrix

| Utility | Command / path |
|---|---|
| Raycast | open app (reinstalls its own login item) or System Settings → Login Items |
| Karabiner (user) | `launchctl enable gui/501/org.pqrs.service.agent.<label>` ×7, then open app |
| Karabiner (root) | `sudo launchctl enable system/org.pqrs.service.daemon.<label>` ×2 |
| BetterSnapTool / Loop / Wispr Flow / Antinote | System Settings → Login Items |
| AutoRaise | `brew services start autoraise` |

## Why

- **Single-variable experiment.** "What does each utility bring to the
  party?" is answerable only from a clean baseline. Four overlapping window
  managers is a four-way confound; Aerospace solo, one week, then
  re-enable one utility per day, is a controlled experiment.
- **Falsifiable predictions, recorded in advance** (Popper discipline —
  predictions written *before* the test):
  - **Karabiner**: moat *if* complex remaps (hyper key, home-row mods,
    device-specific rules) are in daily use. If `karabiner.json` is a
    caps-lock-to-esc remap, macOS does that natively — chainsaw for butter.
  - **Raycast**: moat = clipboard history + snippets + window switching.
    Test: does Spotlight cover actual usage? Prediction: two features
    heavily used, missed for a week.
  - **Loop / BetterSnapTool / AutoRaise**: predicted nothing AeroSpace
    doesn't do. Duplicative before Aerospace arrived. Not expected back.
  - **Wispr Flow**: dictation died with it. No overlap with AeroSpace;
    predicted first re-enable if dictation is in daily use.
- **Cost transparency.** Utilities at 100% CPU-time-equivalent attention
  (login items) that deliver near-zero marginal value are the chip pan fire,
  not the pizza shop: reactive, expensive, invisible until it burns.

## How (phase 2 — decently usable system)

1. Write `~/.aerospace.toml` — tuned workspaces, not defaults. Priority
   order: workspaces that match actual working patterns (comms / browser /
   code / terminal), then per-app auto-assignment, then mode keybindings.
2. One week solo. Note friction in a plain file; friction defines what, if
   anything, earns a re-enable.
3. Re-enable protocol: one utility per day, gap between, friction log
   before and after. Utilities that fail the moat question stay off.
4. Only after window management is settled (predictably adequate, not
   aspirational): **phase 3 — the AI working surface** — herdr (project
   panes / session management), gloam, and pi as the interlocking surface.
   Sequencing is deliberate: a working *surface* needs a stable *frame*;
   window chaos under the AI surface would confound its own evaluation.

## Status log

- 2026-09-27: survey + user-space blackout executed and verified; brief
  written. Root-side Karabiner + Stats toggle pending owner. Phase 2
  unstarted.
