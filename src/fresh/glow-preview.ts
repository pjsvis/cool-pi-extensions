/// <reference path="../types/fresh.d.ts" />

/**
 * Glow Markdown Preview Plugin for Fresh Editor
 *
 * Renders the current markdown buffer through Glow (charmbracelet/glow)
 * in a full-screen tab. Bind "Glow Preview: Toggle" to a key via
 * Edit → Keybinding Editor (current local binding: CMD/⌘+P).
 *
 * Features:
 * - Full-screen Glow-rendered preview as a tab
 * - Toggle: opens preview; press again on preview = close, return to source
 * - Toggle is a mode command: focused preview closes, background preview focuses
 * - Auto-refresh on save when editing .md files
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

/** Path to the temp file used for untitled buffers. */
const TEMP_PATH = "/tmp/fresh-glow-preview-temp.md";

function focusPreviewBuffer(): void {
  if (previewBufferId === 0) return;

  const info = editor.getBufferInfo(previewBufferId);
  const splitId = info?.splits[0] || editor.getActiveSplitId();
  if (splitId !== 0) {
    editor.focusSplit(splitId);
  }
  editor.showBuffer(previewBufferId);
}

async function openPreviewFromBuffer(bufferId: number): Promise<boolean> {
  if (bufferId === 0) {
    editor.setStatus("No active buffer to preview");
    return false;
  }

  const length = editor.getBufferLength(bufferId);
  if (length === 0) {
    editor.setStatus("Buffer is empty — nothing to preview");
    return false;
  }

  const bufPath = editor.getBufferPath(bufferId);
  let ok = false;

  if (bufPath && bufPath !== "") {
    ok = await renderWithGlow(bufPath);
    if (ok) {
      const fname = bufPath.split("/").pop() || bufPath;
      editor.setStatus(`Glow preview: ${fname}`);
    }
  } else {
    try {
      const text = await editor.getBufferText(bufferId, 0, length);
      editor.writeFile(TEMP_PATH, text);
      ok = await renderWithGlow(TEMP_PATH);
      if (ok) {
        editor.setStatus("Glow preview (untitled buffer)");
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      editor.setStatus(`Preview error: ${msg}`);
    }
  }

  if (ok) {
    sourceBufferId = bufferId;
    sourceSplitId = editor.getActiveSplitId();
  }

  return ok;
}

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
}

// ── Close handler (bound to q / Escape in glow-preview mode) ─────────────────

globalThis.glow_preview_close = function (): void {
  if (previewBufferId === 0) return;

  editor.closeBuffer(previewBufferId);
  previewBufferId = 0;
  sourceBufferId = 0;

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

  // Preview exists but we're on a different tab — close old and preview current instead.
  if (previewBufferId !== 0) {
    editor.closeBuffer(previewBufferId);
    previewBufferId = 0;
    sourceBufferId = 0;
    // Fall through to open a new preview for the current buffer
  }

  // Otherwise: open a new preview from the current buffer and focus it.
  const bufId = editor.getActiveBufferId();
  const ok = await openPreviewFromBuffer(bufId);
  if (ok && previewBufferId !== 0) {
    focusPreviewBuffer();
  }
};

// ── Manual refresh (bound to 'r' in glow-preview mode) ───────────────────────

globalThis.glow_refresh = async function (): Promise<void> {
  if (sourceBufferId === 0) {
    editor.setStatus("No source buffer to refresh from");
    return;
  }

  const bufPath = editor.getBufferPath(sourceBufferId);
  if (bufPath && bufPath !== "") {
    await renderWithGlow(bufPath);
    editor.setStatus("Preview refreshed");
  } else {
    const length = editor.getBufferLength(sourceBufferId);
    const text = await editor.getBufferText(sourceBufferId, 0, length);
    editor.writeFile(TEMP_PATH, text);
    await renderWithGlow(TEMP_PATH);
    editor.setStatus("Preview refreshed (untitled)");
  }
};

// ── Auto-refresh on save ─────────────────────────────────────────────────────

editor.on("after_file_save", (args) => {
  if (previewBufferId === 0) return true;
  if (!args.path.endsWith(".md")) return true;
  renderWithGlow(args.path);
  return true;
});

// ── Command registration ─────────────────────────────────────────────────────

editor.registerCommand(
  "Glow Preview: Toggle",
  "Enter/exit Glow preview mode (CMD/⌘+P locally); q/Esc also closes from preview",
  "glow_preview_toggle",
  null
);

// ── Cleanup ──────────────────────────────────────────────────────────────────

editor.on("buffer_closed", (args) => {
  // If the source buffer is closed, tear down the preview too
  if (args.buffer_id === sourceBufferId) {
    sourceBufferId = 0;
    if (previewBufferId !== 0) {
      editor.closeBuffer(previewBufferId);
      previewBufferId = 0;
    }
  }
  return true;
});

editor.setStatus("Glow Preview plugin loaded — bind 'Glow Preview: Toggle' to a key");
