# Playbook: okuda-theme — Okuda theming across the stack

## Purpose

How we apply the Okuda palette across the terminal stack. Currently two
consumers — **Pi** (a theme package) and **herdr** (config overrides) — one
palette, one discipline. This is the *how*; the *why* for the alert-trio
decision is `decisions/024-okuda-pi-theme-alert-trio.md`.

The Okuda palette is six structural hues plus indigo panels and receding
slates, with an explicit LCARS alert trio layered for semantic state. The
discipline is "few structural colours"; state colours are a separate, small,
conventional vocabulary (red alert, green secure, amber caution) — exactly what
Michael Okuda's LCARS actually used.

## The palette

**Operational source of truth:** `themes/okuda.json` `vars` (this repo). It is
the most complete expression — structural hues *and* the alert trio — and it's
in-repo, so no cross-silo friction when tweaking.

**Aesthetic origin:** `../okuda/src/palettes/okuda.json` (the okuda silo). It
holds the structural hues only — no alerts, because the viewer never signals
tool state. Sync structural-hue changes *from* it when the silo's identity
moves; the alert trio lives here.

| Var | Hex | Layer | Role |
|---|---|---|---|
| `slateBlue` | `#99ccff` | structural | headings, section markers, workspace names |
| `amber` | `#ffaa00` | structural | primary accent, LCARS label fill |
| `yellow` | `#ffcc66` | structural | warm data |
| `cream` | `#ffcc99` | structural | readouts, code text |
| `cyan` | `#66ddff` | structural | navigation, links, unseen notifications |
| `peach` | `#ff9966` | structural | secondary navigation, interrupted/warning |
| `indigo` | `#1a1530` | structural | panels (the LCARS code-panel affordance) |
| `indigoLift` | `#2a2540` | structural | selected/hover surfaces |
| `slateDark` | `#445566` | structural | receding — separators, dim |
| `slateMid` | `#7788aa` | structural | receding — muted text |
| `slateBlueBorder` | `#5e8bbf` | structural | borders |
| `lcarsGreen` | `#5fd9a0` | **state** | success, idle/done |
| `lcarsRed` | `#ff6b6b` | **state** | error, needs attention |
| `black` | `#000000` | structural | on-amber label fill only |

## The two-layer rule (ADR 024)

1. **Structural chrome → Okuda hues only.** Accent, borders, panels, all
   markdown tokens, syntax highlighting: six hues + indigo + slates. This is
   where "few colours" holds and where the LCARS look comes from.
2. **Semantic state → LCARS alert trio.** `success`/`error`/`warning` (and
   herdr's `green`/`red`/`yellow`). Never force state into the amber family —
   that collapses tool-run outcomes to a glance-indistinguishable wash and
   sacrifices the function that justifies the aesthetic.

Reversing the boundary (adding a seventh structural hue, or rainbow syntax) is
the "losing the plot" case ADR 024 exists to defend against.

## Drift — the thing to watch

The palette is expressed in three places. Edit in the right order:

1. `themes/okuda.json` → `vars` (operational source of truth, this repo).
2. `themes/okuda.json` → `colors` (Pi token mapping — usually only if a token
   re-maps, not if a hue changes).
3. `herdr/okuda-theme.toml` (herdr snippet — re-derives hex from `vars`).

When the **okuda silo's** structural palette moves, sync *into* `vars` first,
then propagate down. The alert trio is this repo's invention; it does not exist
upstream — don't look for it there.

## Pi theme

**File:** `themes/okuda.json`. Installed as a local-path package
(`packages` in `~/.pi/agent/settings.json`); Pi discovers it and hot-reloads on
edit. Select via `/settings` → `okuda` (already the default).

**Structure:** `vars` holds the palette; `colors` maps 51 Pi tokens to vars or
inline hex. `text` stays `""` (terminal default); cream is reserved for
readouts, not the reading surface.

**Edit-test loop:**
1. Tweak a `vars` value (or a `colors` mapping).
2. Save — Pi reloads the active theme automatically; no restart.
3. Exercise the surface: a tool success + error (alert trio), a diff
   (green/red), a code block (indigo panel + cream), a markdown doc
   (headings/links/lists), and crank the thinking level (the cool→warm ramp).

**The thinking ramp** is the token set that most wanted a palette — six
perceptually-ordered steps, cool→warm, all in-family:
`off #445566 → min #7788aa → low #66ddff → med #ffcc99 → high #ffcc66 →
xhigh #ffaa00 → max #ff9966`.

**Validation:** `python3` JSON-parse + the 51-required-token audit against the
schema (see the turn that built the theme). `just check` does not validate
themes — run the audit manually after structural changes.

## herdr theme

herdr has **no custom theme files** — only named built-ins + a
`[theme.custom]` override block in `~/.config/herdr/config.toml`. So the
deliverable is a versioned snippet, not a discoverable file.

**Snippet:** `herdr/okuda-theme.toml` (this repo). Paste the `[theme]` +
`[theme.custom]` block into `~/.config/herdr/config.toml`, then
`herdr server reload-config` (or global menu → reload config).

**Base:** `kanagawa` (dark indigo, harmonises with our panels so
un-overridden tokens stay in-family). `terminal` (host ANSI) is the neutral
alternative.

**herdr's 17 custom tokens → Okuda mapping** (full table in the snippet):

| herdr token | Okuda var | Notes |
|---|---|---|
| `accent` | `amber` | primary accent |
| `panel_bg` / `sidebar_bg` | `indigo` | the LCARS panel |
| `surface0` / `surface1` | `indigoLift` | selected / hover |
| `surface_dim` | `slateDark` | separators, recedes |
| `overlay0` / `overlay1` | `slateMid` / `slateBlueBorder` | secondary text |
| `subtext0` / `mauve` | `slateBlue` | workspace names, git branch |
| `blue` | `cyan` | unseen notifications |
| `green` / `teal` | `lcarsGreen` | idle/done |
| `yellow` | `yellow` | busy/running |
| `red` | `lcarsRed` | needs attention |
| `peach` | `peach` | interrupted/warning |

`text` is deliberately **unset** — inherit kanagawa's light text rather than
risk a clash. Set it only if you want to force a reading-surface colour.

## Tweaking checklist

- [ ] Hue change → edit `themes/okuda.json` `vars` first.
- [ ] Propagate the same hex to `herdr/okuda-theme.toml`.
- [ ] If the okuda silo moved the structural palette, sync *from* it into
      `vars` (don't invent here).
- [ ] Pi: save and exercise the surfaces above (hot-reload, no restart).
- [ ] herdr: paste if the snippet changed, then `herdr server reload-config`.
- [ ] Structural↔state boundary shift (e.g. admitting a new alert colour) →
      update ADR 024 first; the playbook follows the decision, not vice-versa.
- [ ] `just registers` + `just check` if you touched this playbook or the
      decisions register.

## Silo note

herdr's live config (`~/.config/herdr/config.toml`) is outside this repo and
outside the Decision 013 silo exception (which covers only
`~/.pi/agent/models.json` / `settings.json`). The snippet stays versioned here;
applying it to the live config is a human one-liner. The repo does not reach
into `~/.config/herdr/`.