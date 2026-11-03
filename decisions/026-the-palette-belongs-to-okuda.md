# Decision 026: Remove the okuda-theme playbook — the palette belongs to the okuda silo

**Date:** 2026-11-03
**Status:** Accepted

---

## Context

`playbooks/okuda-theme-playbook.md` documented how the Okuda palette is applied to
two consumers in this repo — the Pi theme (`themes/okuda.json`) and the herdr
snippet (`herdr/okuda-theme.toml`). It was useful, and it is the reason the theme
exists.

It also declared itself primary:

> **Operational source of truth:** `themes/okuda.json` `vars` (this repo).
> **Aesthetic origin:** `../okuda/src/palettes/okuda.json` (the okuda silo).

That is a second, hand-edited source of truth for a palette whose owner is another
silo — and it inverts the direction of authority: the silo that *renders* the
palette is named the aesthetic origin, and the silo that *consumes* it is named
operational.

## The finding

Measured 2026-11-03, when the okuda silo opened `BRF-PAIR-DELIVERED` (deliver the
recommended ground/ink pair per host). The palette is expressed in three places
across two repos:

| place | what it is |
|---|---|
| `okuda/src/palettes/okuda.json` | the palette, as markdown roles the renderer can address |
| `cool-pi-extensions/themes/okuda.json` | the same structural hues, plus colours okuda's grammar cannot address |
| `cool-pi-extensions/herdr/okuda-theme.toml` | the herdr token mapping |

Two of the three are here, and both are hand-edited. A structural hue change has two
possible first edits, and the playbook named the wrong one. This is the parallel
store the okuda silo's `BRF-SURFACE-PAIR` names: *the line is whether a human ever
edits a hex by hand; if one does, it is a parallel store and it dies.*

The good news, and the reason this is a small decision: **all four ground hexes the
Pi theme introduced are already legal okuda grounds.** Measured with
`okuda/scripts/contrast.ts --surface`, each paired with the recommended ink
`#d6cfc4`:

| ground | ratio | verdict |
|---|---|---|
| `#1a1530` `indigo` | 11.4:1 | readable, navigable |
| `#2a2540` `indigoLift` | 9.5:1 | readable, navigable |
| `#1a2a20` `lcarsGreenBg` | 9.7:1 | readable, navigable |
| `#2a1a1a` `lcarsRedBg` | 10.8:1 | readable, navigable |

## Decision

**The palette's source of truth is the okuda silo.** The playbook is removed from
this repo.

- **What goes:** `playbooks/okuda-theme-playbook.md`.
- **What stays:** `themes/okuda.json` and `herdr/okuda-theme.toml`. They are
  *consumers* of the palette, not its source, and they remain this repo's
  deliverables.
- **What is preserved:** the colours okuda's markdown grammar cannot address, and
  both host token mappings, moved to the owner —
  `okuda/docs/2026-11-03-the-colours-the-grammar-cannot-address.md`.
- **Direction of sync, stated once:** a structural hue change starts in
  `okuda/src/palettes/okuda.json`, then propagates into this repo's two consumer
  files. Never the reverse.

`decisions/024-okuda-pi-theme-alert-trio.md` stands unchanged. The two-layer rule
(structural chrome in Okuda hues, semantic state in the LCARS alert trio) is this
repo's, and the alert trio is this repo's invention. okuda's palette carries no
alert trio because the viewer never signals tool state; that asymmetry is correct
and is not a drift to close.

## Alternatives Considered

| Alternative | Why Rejected |
|---|---|
| Keep the playbook and its declared direction | Two hand-edited sources of truth for one palette, with the named primary in the wrong silo. The drift would be silent, which is the failure mode all of the palette work exists to end |
| Move the playbook to the okuda silo wholesale | It is not one document. The palette table belongs there; the Pi and herdr token tables are host knowledge tied to artefacts that live here, and they go stale when separated from them. The okuda record keeps both tables **as a reference to this repo's files**, not as a second copy to edit |
| Delete the playbook and preserve nothing | Loses the colours and both mappings, and orphans two artefacts. `themes/okuda.json` is installed and in daily use |
| Rewrite the playbook to declare the okuda silo primary | Keeps a second copy of the palette table that must be re-synced on every hue change. Removing it removes the sync obligation |

## Consequences

- **One first edit.** A structural hue change starts in
  `okuda/src/palettes/okuda.json`; this repo's two files follow.
- **Two artefacts are documented by their owner.** `themes/okuda.json` and
  `herdr/okuda-theme.toml` keep their files; their *why* is in the okuda record.
- **The thinking ramp survives in the record** — seven perceptually-ordered steps,
  `off #445566 → min #7788aa → low #66ddff → med #ffcc99 → high #ffcc66 →
  xhigh #ffaa00 → max #ff9966`. It is a Pi token concern and is preserved with the
  mapping.
- **A live observation travels with the grounds.** All four pass the okuda contrast
  instrument, so this theme is a working precedent for per-host pair work rather
  than a parallel palette. Its `text` is empty: it owns a ground and inherits its
  ink — the half-owned pair the same instrument warns about.
- **`just registers` and `just check` are the gate** for the removal; both were run
  and both pass.

## Related

- `okuda/docs/2026-11-03-the-colours-the-grammar-cannot-address.md` — where the preserved knowledge lives.
- `okuda/briefs/2026-11-03-brief-pair-delivered.md` — the brief this serves.
- `okuda/.archive/briefs/2026-11-01-brief-surface-pair.md` — the settled position on the pair.
- `decisions/024-okuda-pi-theme-alert-trio.md` — the two-layer rule, unchanged.
- `themes/okuda.json`, `herdr/okuda-theme.toml` — this repo's two consumers.
