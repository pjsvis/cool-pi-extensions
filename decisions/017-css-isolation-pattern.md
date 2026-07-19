# Decision 017: CSS isolation pattern — total isolation apart from custom properties

**Date:** 2026-07-17
**Status:** Accepted

## Context

The hardest CSS failure mode to debug is the cascade gone wrong. The cascade is a global ordering computation over the entire document's rule set, resolved per-element by origin, importance, specificity, source order, and (since 2023) layers and scope proximity. When it produces the wrong value on one element, the search space is "every rule in the document, in cascade order" — and the only diagnostic tools the browser gives you (DevTools computed-style panel) show you the *winner* but not, quickly, *why* in a way that scales to 200 rules. You are in a world of pain, and the usual reflex (add a more specific selector, add `!important`, add another override rule) makes the cascade *larger*, not smaller.

Two recent CSS primitives change the economics:

- **`all: revert`** (Baseline, ~2020) — resets every standard CSS property on an element to the user-agent (browser-default) cascade origin. One declaration, complete reset at the tag boundary.
- **`@scope`** (Baseline December 2025) — selector isolation: rules inside `@scope (root) to (limit) { ... }` only match within that subtree; the `to` clause sets a lower ("donut") boundary. `@scope` does *selector* isolation, not *style* isolation — inherited properties still bleed through. (CSSWG issue #11002 is open on adding true style isolation; until then `all: revert` is the mechanism for it.)

The key discovery, from building a markdown browser and PolyVis: **CSS custom properties (`--foo`) are *not* reset by `all: revert`** — per spec, `all` excludes custom properties. So a design token declared at `:root` (`--font-sans`, `--color-bg`, `--space-1`) inherits *through* an `all: revert` boundary into every isolated region. The isolation boundary is permeable to the design system and impermeable to the host page's cascade. That is the property that makes total isolation viable: you share the *tokens*, you isolate the *presentation*.

This connects to the bounded-context thesis (Decision 015): the cascade is the unbounded context, and `all: revert` + `@scope` is the bounded-context entry for CSS. The procedural analogue of bounded-context entry as default.

## Decision

Adopt **total isolation apart from custom properties** as the CSS pattern for bounded regions (embedded content, third-party components, layout panels) in web tools built in this stack. Concretely:

1. **Design tokens live on `:root` as custom properties.** `--font-sans`, `--color-bg`, `--space-1`, etc. These inherit through isolation boundaries. This is the shared substrate.
2. **Layout CSS lives outside the isolation boundaries.** The page shell holds the grid/flex; panels are children positioned as grid items by *un-isolated* layout CSS. A region cannot know about its siblings' sizes, so the layout container is not reset.
3. **Each bleed-risk region gets `@scope` + `all: revert` on its root.** `@scope (.region) { ... }` stops host selectors matching in; `all: revert` on the scope root stops inherited values getting in. Then re-apply a reset/base stylesheet and the region's own component CSS, consuming tokens via `var(--token)`.
4. **Procedural rule: when CSS breaks, isolate first.** Isolation is the first diagnostic, not the last resort. Temporarily isolating a region tests whether the bug is a cascade bleed (isolation fixes it) or a local rule (isolation doesn't, and you've narrowed the search to the box). This is a falsification move — the same shape as the Edinburgh Protocol eval (Wodge 5 of the Poker Club asset): the instrument that says "the cascade is fine" is the hypothesis, not the arbiter.
5. **Do not isolate reflexively where a softer tool suffices.** For stable, hand-authored regions with no bleed risk, **cascade layers** (`@layer reset, base, components;`) order the cascade without hard boundaries. The Watt test: does isolating this region yield a more stable system state, or just symmetry? Isolate where there's bleed; layer where there's just ordering. Isolate-first is a diagnostic, not a religion.

## Alternatives considered

- **BEM / naming conventions.** Rejected as the primary mechanism — relies on author discipline, doesn't stop inherited values bleeding, accretes naming ceremony. Viable as a supplement inside an isolated region, not as the boundary.
- **CSS Modules / build-time scoped styles.** Rejected for this stack — requires a build step, which breaks the no-build / script-tag aesthetic of the Alpine + Hono JSX SSR stack. The primitives (`all: revert`, `@scope`) are native CSS and need no build.
- **Shadow DOM for every region.** Rejected — Shadow DOM gives CSS isolation but forces *JS* isolation, which breaks SEO tools, document-level query selectors, and is overkill for content embedding (CSSWG issue #11002, joezappie comment). Reach for Shadow DOM only when you need JS isolation too.
- **`all: initial` instead of `all: revert`.** Rejected — `initial` resets to the property's spec initial value (`display: inline` for a `p`), losing the UA default (`display: block`). `revert` keeps UA defaults, which is the correct baseline for content embedding.
- **Tailwind scoped preflight plugin.** Rejected as the primary mechanism — solves the Tailwind-Preflight-vs-host-page collision but adds a dependency and a config layer. The native primitives do the same work. (The plugin is the right answer *if* you're already on Tailwind; we're not.)

## Consequences

**What became easier:**
- Cascade-bleed bugs collapse to "what's in this box" instead of "which of N rules won, and why." Debugging surface shrinks to the isolated region.
- Embedded content (markdown view, rendered CMS HTML, third-party widgets) renders with a known baseline regardless of host-page theme — the reset is the isolation.
- Design tokens stay shared without sharing presentation — `:root` is the single source of truth for tokens, isolated regions consume via `var()`.
- No build step, no framework, no naming convention — two native CSS primitives.

**What became harder:**
- The layout container must be kept outside the isolation boundaries — putting `all: revert` on the grid container breaks the grid. Discipline, not tooling, enforces this.
- After `all: revert`, you re-apply a base stylesheet inside the region before your component CSS. Order matters: reset, then base, then component.
- UA-default baselines differ slightly across browsers. For pixel-perfect work this matters; for content embedding (markdown, prose) it rarely does. Know which you're doing.
- `all: revert` with `!important` exists to defeat host-page `!important` rules but cascades the `!important` requirement into everything afterward. Reach for it only when the host page forces it, not by default (joezappie's trap in CSSWG #11002).

**Constraints this imposes:**
- Design tokens *must* be custom properties on `:root` (or an ancestor above the isolation boundary). Token values resolve via `var()` at use-site; they do not bleed as resolved values.
- Layout CSS and presentation CSS are separated by the boundary — they cannot live in the same isolated block.
- `@scope`'s lack of true style isolation is a *known* gap with an open spec issue, not a bug. `all: revert` on the scope root is the current mechanism for closing it.

## References

- MDN: [`all: revert`](https://developer.mozilla.org/en-US/docs/Web/CSS/all), [`@scope`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40scope)
- CSSWG issue [#11002 — Can we use `@scope` for style isolation?](https://github.com/w3c/csswg-drafts/issues/11002) (open; `@scope` is selector isolation, not style isolation)
- CSS Cascade Level 6 editor's draft: [§3.5 Scoping Styles](https://drafts.csswg.org/css-cascade-6/#scoped-styles)
- OddBird explainer: [CSS Scope Proposal & Explainer](https://css.oddbird.net/scope/explainer/) (Miriam Suzanne — donut scope, proximity, the `to` clause)
- Decision 015 (bounded-context entry as default — the architectural analogue)
- Decision 006 (minimal viable agent stack — constraint stack over feature accumulation; the same anti-ceremony logic applies to "isolate everything always")
- The Poker Club asset (`blog/2026-07-17-the-poker-club-sovereign-inference.md`, Wodge 5) — the instrument-indictment as diagnostic; isolate-first is the CSS-analogue falsification move

---

*The cascade is the unbounded context. Total isolation apart from custom properties is the bounded-context entry for CSS. When CSS breaks, isolate first — the isolation is the diagnostic, not the last resort.*
