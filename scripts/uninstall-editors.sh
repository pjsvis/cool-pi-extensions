#!/usr/bin/env bash
# Uninstall non-spiceedit terminal editors (Homebrew formulas + manual amp).
# Dry-run by default; pass --yes to actually uninstall.
set -euo pipefail

DRY_RUN=1
[[ "${1:-}" == "--yes" ]] && DRY_RUN=0

# Homebrew formulas to remove (spiceedit is deliberately excluded).
BREW_EDITORS=(fresh-editor helix micro neovim)

# Manual installs (not tracked by Homebrew).
AMP_DIR="$HOME/.amp"
AMP_WRAPPER="$HOME/.local/bin/amp"

run() {
  if (( DRY_RUN )); then
    echo "[dry-run] $*"
  else
    echo "[run] $*"
    "$@"
  fi
}

echo "== Editor uninstall =="
echo "Keeping: spiceedit"
echo "Removing: ${BREW_EDITORS[*]}"
[[ -d "$AMP_DIR" || -f "$AMP_WRAPPER" ]] && echo "Removing: amp (manual)"
echo

# Membership check without a pipeline — `grep -q` under `pipefail` + a slow
# producer (brew) SIGPIPEs: grep exits on first match, brew gets SIGPIPE, and
# pipefail reports the pipeline as failed. Capture to a variable instead.
installed="$(brew list --formula)"

for formula in "${BREW_EDITORS[@]}"; do
  if grep -q "^${formula}$" <<<"$installed"; then
    run brew uninstall "$formula"
  else
    echo "skip: $formula not installed"
  fi
done

# amp — bash wrapper + its home dir (leave if either is missing).
if [[ -f "$AMP_WRAPPER" || -d "$AMP_DIR" ]]; then
  run rm -f "$AMP_WRAPPER"
  run rm -rf "$AMP_DIR"
else
  echo "skip: amp not installed"
fi

echo
if (( DRY_RUN )); then
  echo "Dry run complete — re-run with --yes to uninstall."
else
  echo "Done. Remaining editors: spiceedit"
fi
