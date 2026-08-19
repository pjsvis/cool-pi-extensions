That is the cleanest, lowest-entropy evolutionary path you could take.

Renaming at the exact moment a document outgrows its single-file bounds catches the problem at the point of lowest friction: **inbound reference count is still zero.**

---

### The 3-Stage Lifecycle Pattern

```
Stage 1: Atomic (Default)
└── foo.md

Stage 2: Linear Multi-Part (Direct split)
├── foo-01.md
└── foo-02.md

Stage 3: Indexed Series (When complexity demands a hub)
├── foo.md        <-- Index / Executive Manifest
├── foo-01.md
├── foo-02.md
└── foo-03.md

```

---

### Why This Works Operationally

* **Zero Premature Architecture:** You don't create an index file on day one
  when two chapters will do.

* **Deterministic Tooling:** Shell globs (`foo-*.md`), build scripts, and LLM
  context injections stay clean and predictable at Stage 2.

* **Natural Semantic Shift:** If you eventually promote the series to Stage 3 by
  adding `foo.md`, its role is unambiguous: it is the **Table of Contents and
  Map**, while the numbered siblings remain the **Territory**.

It gives you strict predictability without spending tokens or maintenance cycles on scaffolding you don't need yet.