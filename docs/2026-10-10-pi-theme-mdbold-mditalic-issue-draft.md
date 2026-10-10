# Issue draft — pi theme: add `mdBold` and `mdItalic` tokens

> Draft for submission to [`earendil-works/pi`](https://github.com/earendil-works/pi). Reviewed against pi 1.1.0 (release install, macOS 26 arm64). Filed here per the `docs/2026-07-09-td-autocheck-bug-issue-draft.md` precedent; **upstream posting is the operator's call** — it leaves the silo.

---

**Title:** Theme: add optional `mdBold` / `mdItalic` colour roles

**Environment:**
- pi: `1.1.0`
- Theme: `okuda` (`themes/okuda.json`), validated against the published schema

**Summary:**

The theme markdown token set is ten keys — `mdHeading`, `mdLink`, `mdLinkUrl`,
`mdCode`, `mdCodeBlock`, `mdCodeBlockBorder`, `mdQuote`, `mdQuoteBorder`, `mdHr`,
`mdListBullet`. Markdown `**bold**` and `*italic*` are not among them, so a theme
can colour every other markdown construct and not emphasis. A palette that treats
strong and emphasis as distinct roles has nowhere to put them.

**Evidence:**

- The schema accepts exactly ten `md*` keys and no more —
  `dist/modes/interactive/theme/theme-schema.json` (count verified: 10). No
  `mdBold`, `mdItalic`, `mdStrong`, or `mdEmphasis` appears anywhere in the
  pi 1.1.0 install.

- Bold and italic therefore render as ANSI attributes (SGR 1 and SGR 3) on the
  surrounding text colour. The renderer already treats inline ANSI as a boundary
  it must not disturb — `CHANGELOG.md`: *"The markdown renderer now preserves
  existing ANSI escape codes when they appear before inline elements."*

**Precedent — the project already ships both shapes:**

`scrollbarTrack` / `scrollbarThumb` were added as *optional* roles with
fallbacks (`muted` / `text`); `thinkingText` was added as a new role outright.
So the two forms this request needs — add a role, and add it optionally with a
fallback — are both already established in the theme contract.

**What I'd like:**

Two optional colour roles, `mdBold` and `mdItalic` (naming to match the `md*`
family; `mdStrong` / `mdEmphasis` equally fine). Optional so existing themes stay
valid and the renderer keeps today's SGR behaviour when a token is absent.

**Why not a workaround:**

An extension could post-process the rendered ANSI, but that injects colour into
the byte stream and fights the theme instead of extending it. The theme is the
right home for a colour role, and the changelog note above suggests the renderer
already works against that boundary.

**Scope note:**

If the token set is deliberately closed at ten to keep themes legible, that is a
fine answer — I'd just like to know, so the palette can *drop* the two roles
rather than carry them unused.

**Reproduction:**

1. Select a custom theme (`theme` setting).
2. Render an assistant message containing `**bold**` and `*italic*`.
3. Neither takes a colour from the theme's `colors` — there is no key to read.

---

Source: okuda silo (the palette's source of truth is
`okuda/src/palettes/okuda.json`; the theme lives here at `themes/okuda.json`).
