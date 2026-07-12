# Issue draft — td automatic update-check never fires

> Draft for submission to `marcus/td`. Reviewed against confirmed 0.51.0. Do not submit until you've read it — but the version and repro are airtight.

---

**Title:** Automatic update-check never fires; version cache only refreshes via explicit `td version`

**Environment:**
- td: `0.51.0` (Homebrew, `marcus/tap`)
- OS: macOS 15, arm64 (Tahoe)
- Install: `brew install marcus/tap/td`

**Summary:**

The version cache at `~/.config/td/version_cache.json` is only refreshed by the explicit `td version` command. Normal usage (`td status`, `td list`, `td create`, `td --version`, etc.) does not trigger any automatic update check. As a result, `hasUpdate` can report `false` with a stale `latestVersion` for months, and users are never prompted that a new release is available.

**Reproduction (confirmed on 0.51.0):**

1. `cat ~/.config/td/version_cache.json` — note `checkedAt` and `currentVersion`.
2. Run several normal commands: `td status`, `td list`, `td --version`.
3. Re-read the cache. `checkedAt` is unchanged.
4. Run `td version`.
5. Re-read the cache. `checkedAt` and `currentVersion` now update to the present.

**Observed evidence:**

My cache had been stuck since 2026-02-23:

```json
{
  "latestVersion": "v0.38.0",
  "currentVersion": "0.38.0",
  "checkedAt": "2026-02-23T11:30:46.139516Z",
  "hasUpdate": false
}
```

This persisted through 4+ months of daily use and two upgrades (`0.49.0` and `0.51.0`), always reporting `hasUpdate: false` with `latestVersion` `0.38.0` — so no update was ever surfaced. After running `td version` on `0.51.0`, the cache correctly updated to:

```json
{
  "latestVersion": "v0.51.0",
  "currentVersion": "0.51.0",
  "checkedAt": "2026-07-09T06:34:56.403581+01:00",
  "hasUpdate": false
}
```

**Expected:**

An automatic, periodic update check during normal usage so the cache (and any update prompt) reflects reality without requiring the user to remember `td version`.

**Actual:**

Only `td version` performs a check; no automatic check fires, so a stale `hasUpdate: false` can persist indefinitely.

**Impact:**

New releases go unnoticed. The `0.49.0` → `0.51.0` release (which fixes an `td epic create --description` flag bug) was not surfaced here; the upgrade was only applied manually after noticing the formula had advanced.

**Question:**

Is the automatic check intended to be periodic/throttled, and is there a config option to enable or tune it? If it is intended to fire during normal usage, it does not appear to be triggering on this setup.
