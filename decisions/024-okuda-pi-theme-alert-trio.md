# Decision 024: Okuda Pi theme admits the LCARS alert trio

**Date:** 2026-08-26
**Status:** Accepted
**Executes:** the Okuda Pi theme (`themes/okuda.json`, installed as a local-path package)

## Context

The Okuda silo (`../okuda`) ships a six-hue palette — slate blue, amber, yellow,
cream, cyan, peach — plus dark indigo panels and three receding slates. That
palette is the identity layer: Michael Okuda's LCARS, high-contrast and
uncluttered.

Pi's theme schema requires 51 color tokens, including three Pi has that
Okuda-the-viewer never did: semantic **state** colors (`success`, `error`,
`warning`), a six-step **thinking-level ramp**, and **diff** added/removed. The
naive read of "few colours only" would force success and error into the amber
family — collapsing tool-run outcomes to a glance-indistinguishable wash.

## The decision

The "few colours" rule applies to the **structural chrome**, not the **status
layer**. The Okuda Pi theme is two layers:

1. **Structural chrome — pure Okuda.** Accent, borders, all 10 markdown tokens,
   panel backgrounds, syntax highlighting: only the six hues + indigo + slates.
   This is where the restraint holds and where it buys the LCARS look — amber
   accents on dark-indigo panels, slate structure, cream readouts.

2. **Semantic state — the LCARS alert trio, admitted explicitly.** `success` =
   soft green `#5FD9A0`, `error` = soft red `#FF6B6B`, `warning` = amber
   (already ours). Tool success/error backgrounds are near-black washes of those
   hues — they read as "indigo panel with a hint of state," not as new hues. The
   diff added/removed pair reuses the same green/red.

This is faithful to Okuda's *actual* work, not just the silo's preset. LCARS
screens used red for red alert, green for normal/secure, amber for caution — a
restrained structural palette **with** semantic state accents layered on top.
The discipline is "few structural colours"; state colors are a separate, small,
conventional vocabulary. The silo's `okuda.json` omits them only because
Okuda-the-viewer renders markdown and never needs to signal a tool's outcome —
not because the aesthetic rejects them.

## The thinking ramp

The six thinking-level borders map onto the existing cool→warm axis — cool
receding, warm prominent — all in-family, no seventh hue:

| Token | Hex | Hue |
|---|---|---|
| `thinkingOff` | `#445566` | dark slate |
| `thinkingMinimal` | `#7788AA` | mid slate |
| `thinkingLow` | `#66DDFF` | cyan |
| `thinkingMedium` | `#FFCC99` | cream |
| `thinkingHigh` | `#FFCC66` | yellow |
| `thinkingXhigh` | `#FFAA00` | amber |
| `thinkingMax` | `#FF9966` | peach |

This is the token set that most wanted a palette. Six perceptually-ordered steps
from dark slate to peach, drawn entirely from the structural hues — the place
the Okuda discipline solves a Pi problem rather than fighting it.

## Syntax highlighting

Collapsed to four structural families, no rainbow: `keyword`/`operator` = amber,
`function`/`type` = cool (cyan/slate-blue), `variable`/`string`/`number` = warm
(cream/yellow/peach), `comment`/`punctuation` = slate. Dracula-rainbow syntax is
the antithesis of LCARS; restraint here is on-brand.

## The rejected alternative

**Monochrome purity** — force every token into the six Okuda hues, no green/red.
Rejected because it sacrifices the *function* that justifies the aesthetic.
Okuda's screens read state instantly; a Pi theme where success and error are
both amber would be cargo-cult Okuda: the appearance of restraint without the
function that made the restraint good. State legibility is not optional in an
agent harness that runs tools and reports their outcomes.

## Boundary

The alert trio is the **only** extension to the structural palette. Any future
push to add a seventh structural hue, or to rainbow-fy syntax, is the losing
the plot case this ADR exists to defend against. Reversal requires a new ADR
that names the function the alert colors currently serve and explains how it
survives without them.