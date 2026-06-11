# Playbook: canon/

## Purpose

Permanent, linkable reference documents. The "source of truth" for concepts, protocols, and specifications. Hosted at `pjs.weblog.lol/canon/` and mirrored on GitHub Pages.

## Directory structure

```
canon/
├── index.html               # Canon index page
├── topic-name.html          # Individual canon pages
└── style.css                # Shared styles (if any)
```

## Conventions

- Static HTML files, no build step
- Use [new.css](https://newcss.net) for clean default styling
- Include canonical URL in `<head>`: `<link rel="canonical" href="https://pjs.weblog.lol/canon/topic-name">`
- Each page is self-contained — no JavaScript dependency
- Footer includes license and repository link

## Publishing

1. Commit to `main`
2. GitHub Pages deploys from `/canon` directory
3. weblog.lol mirrors: manual or automated via the `weblog` CLI

## Adding a new canon page

1. Create `canon/topic-name.html`
2. Follow the format of existing pages (header, body, footer)
3. Add entry to `canon/index.html`
4. Deploy

## Reference

- [Edinburgh Protocol](https://pjs.weblog.lol/canon/edinburgh-protocol.html)
- [GitHub Pages mirror](https://pjsvis.github.io/cool-pi-extensions/canon/)
