/// <reference path="../types/fresh.d.ts" />

/**
 * Glow Markdown Preview Plugin for Fresh Editor
 *
 * Renders the current markdown buffer through Glow (charmbracelet/glow)
 * in a full-screen tab. Bind "Glow Preview: Toggle" to a key via
 * Edit → Keybinding Editor (recommended: Ctrl+Shift+M).
 *
 * Features:
 * - Full-screen Glow-rendered preview as a tab
 * - Toggle: opens preview; press again on preview = close, return to source
 * - Auto-refresh on save when editing .md files
 * - Explorer sync: markdown files opened/activated from the explorer update the preview
 * - Works with unnamed/untitled buffers (uses a temp file)
 * - q / Escape to close preview, r to refresh
 */

// ── State ────────────────────────────────────────────────────────────────────

/** Buffer ID of the current glow preview virtual buffer, or 0 if closed. */
let previewBufferId = 0;

/** Buffer ID of the source markdown buffer being previewed. */
let sourceBufferId = 0;

/** The split we came from, so we can return to it on close. */
let sourceSplitId = 0;

/** Whether explorer-driven markdown activations should update the preview. */
let explorerSyncEnabled = true;

/** Debounce state for explorer-driven preview updates. */
let explorerSyncTimer = 0;
let pendingExplorerSyncBufferId = 0;

/** Path to the temp file used for untitled buffers. */
const TEMP_PATH = "/tmp/fresh-glow-preview-temp.md";

// ── Mode ─────────────────────────────────────────────────────────────────────

editor.defineMode(
  "glow-preview",
  [
    ["q", "glow_preview_close"],
    ["r", "glow_refresh"],
    ["Escape", "glow_preview_close"],
  ],
  true,  // read-only
  false, // no text input
  false  // don't inherit normal bindings
);

// ── Core rendering logic ─────────────────────────────────────────────────────

async function renderWithGlow(filePath: string): Promise<boolean> {
  try {
    // Fixed width: 90 chars balances prose readability with table formatting.
    // Default (80) fragments prose; dynamic (viewport) stretches tables.
    const width = 90;

    const result = await editor.spawnProcess(
      "bash",
      ["-c", `CLICOLOR_FORCE=1 COLORTERM=truecolor glow -w ${width} -s /Users/petersmith/.config/glow/styles/fresh-high-contrast.json "$0"`, filePath]
    );

    if (result.exit_code !== 0) {
      const errMsg = result.stderr.trim();
      editor.setStatus(errMsg ? `Glow: ${errMsg}` : "Glow exited with error");
      return false;
    }

    const output = result.stdout;
    if (!output.trim()) {
      await createPreviewTab([{ text: "(empty — no markdown content)\n" }]);
      return true;
    }

    const lines = output.split("\n");
    const entries: TextPropertyEntry[] = lines.map(line => ({
      text: line + "\n",
    }));

    await createPreviewTab(entries);
    return true;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    editor.setStatus(`Glow preview failed: ${msg}`);
    return false;
  }
}

async function renderBufferToPreview(bufferId: number): Promise<boolean> {
  const length = editor.getBufferLength(bufferId);
  if (length === 0) {
    editor.setStatus("Buffer is empty — nothing to preview");
    return false;
  }

  const bufPath = editor.getBufferPath(bufferId);
  if (bufPath && bufPath !== "") {
    const ok = await renderWithGlow(bufPath);
    if (ok) {
      sourceBufferId = bufferId;
      sourceSplitId = editor.getActiveSplitId();
      const fname = bufPath.split("/").pop() || bufPath;
      editor.setStatus(`Glow preview: ${fname}`);
    }
    return ok;
  }

  try {
    const text = await editor.getBufferText(bufferId, 0, length);
    editor.writeFile(TEMP_PATH, text);
    const ok = await renderWithGlow(TEMP_PATH);
    if (ok) {
      sourceBufferId = bufferId;
      sourceSplitId = editor.getActiveSplitId();
      editor.setStatus("Glow preview (untitled buffer)");
    }
    return ok;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    editor.setStatus(`Preview error: ${msg}`);
    return false;
  }
}

function isMarkdownBuffer(bufferId: number): boolean {
  const info = editor.getBufferInfo(bufferId);
  if (!info) return false;
  if (info.is_virtual) return false;

  const path = info.path || editor.getBufferPath(bufferId);
  const language = info.language.toLowerCase();
  return path.endsWith(".md") || language.includes("markdown");
}

function scheduleExplorerSync(bufferId: number): void {
  if (!explorerSyncEnabled || previewBufferId === 0 || bufferId === previewBufferId) return;
  if (!isMarkdownBuffer(bufferId)) return;

  pendingExplorerSyncBufferId = bufferId;
  if (explorerSyncTimer) clearTimeout(explorerSyncTimer);
  explorerSyncTimer = setTimeout(() => {
    explorerSyncTimer = 0;
    if (previewBufferId === 0) return;
    void renderBufferToPreview(pendingExplorerSyncBufferId).then(() => {
      if (previewBufferId !== 0) editor.showBuffer(previewBufferId);
    });
  }, 150);
}

/**
 * Create a new full-screen preview tab. Closes any existing preview first.
 */
async function createPreviewTab(entries: TextPropertyEntry[]): Promise<void> {
  // Tear down any existing preview buffer
  if (previewBufferId !== 0) {
    editor.closeBuffer(previewBufferId);
    previewBufferId = 0;
  }

  const result = await editor.createVirtualBuffer({
    name: "*Glow Preview*",
    mode: "glow-preview",
    readOnly: true,
    entries,
    showLineNumbers: false,
    editingDisabled: true,
  });
  previewBufferId = result.bufferId;
  editor.showBuffer(previewBufferId);
}

// ── Close handler (bound to q / Escape in glow-preview mode) ─────────────────

globalThis.glow_preview_close = function (): void {
  if (previewBufferId === 0) return;

  editor.closeBuffer(previewBufferId);
  previewBufferId = 0;
  sourceBufferId = 0;
  if (explorerSyncTimer) {
    clearTimeout(explorerSyncTimer);
    explorerSyncTimer = 0;
  }

  // Return focus to the source split
  if (sourceSplitId !== 0) {
    editor.focusSplit(sourceSplitId);
    sourceSplitId = 0;
  }
  editor.setStatus("Glow preview closed");
};

// ── Toggle handler ───────────────────────────────────────────────────────────

globalThis.glow_preview_toggle = async function (): Promise<void> {
  // Defensive: if our cached buffer ID no longer maps to a real buffer, reset
  if (previewBufferId !== 0 && editor.getBufferInfo(previewBufferId) === null) {
    previewBufferId = 0;
    sourceBufferId = 0;
    sourceSplitId = 0;
  }

  const activeBufId = editor.getActiveBufferId();

  // If preview is already open and focused, close it (toggle off)
  if (previewBufferId !== 0 && activeBufId === previewBufferId) {
    glow_preview_close();
    return;
  }

  // If preview exists but is in the background, just switch to it
  if (previewBufferId !== 0) {
    editor.showBuffer(previewBufferId);
    return;
  }

  // Otherwise: open a new preview from the current buffer
  const bufId = editor.getActiveBufferId();
  await renderBufferToPreview(bufId);
};

// ── Manual refresh (bound to 'r' in glow-preview mode) ───────────────────────

globalThis.glow_refresh = async function (): Promise<void> {
  if (sourceBufferId === 0) {
    editor.setStatus("No source buffer to refresh from");
    return;
  }

  await renderBufferToPreview(sourceBufferId);
};

// ── Auto-refresh on save ─────────────────────────────────────────────────────

editor.on("after_file_save", (args) => {
  if (previewBufferId === 0) return true;
  if (!args.path.endsWith(".md")) return true;
  renderWithGlow(args.path);
  return true;
});

editor.on("after_file_open", (args) => {
  scheduleExplorerSync(args.buffer_id);
  return true;
});

editor.on("buffer_activated", (args) => {
  scheduleExplorerSync(args.buffer_id);
  return true;
});

// ── Command registration ─────────────────────────────────────────────────────

editor.registerCommand(
  "Glow Preview: Toggle",
  "Full-screen markdown preview via Glow (q to close, r to refresh)",
  "glow_preview_toggle",
  null
);

editor.registerCommand(
  "Glow Preview: Toggle Explorer Sync",
  "Update the Glow preview when a markdown file is opened or activated",
  "glow_preview_toggle_explorer_sync",
  null
);

globalThis.glow_preview_toggle_explorer_sync = function (): void {
  explorerSyncEnabled = !explorerSyncEnabled;
  if (!explorerSyncEnabled && explorerSyncTimer) {
    clearTimeout(explorerSyncTimer);
    explorerSyncTimer = 0;
  }
  editor.setStatus(`Glow preview explorer sync ${explorerSyncEnabled ? "enabled" : "disabled"}`);
};

// ── Cleanup ──────────────────────────────────────────────────────────────────

editor.on("buffer_closed", (args) => {
  // If the source buffer is closed, tear down the preview too
  if (args.buffer_id === sourceBufferId) {
    sourceBufferId = 0;
    if (previewBufferId !== 0) {
      editor.closeBuffer(previewBufferId);
      previewBufferId = 0;
    }
    if (explorerSyncTimer) {
      clearTimeout(explorerSyncTimer);
      explorerSyncTimer = 0;
    }
  }
  return true;
});

editor.setStatus("Glow Preview plugin loaded — bind 'Glow Preview: Toggle' to a key");
