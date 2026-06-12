#!/bin/bash
# sync-pi-to-omarchy.sh
# Sync pi configuration from local Mac to Omarchy

set -e

OMARCHY_HOST="${SKATE_HOST:-omarchy.local}"
OMARCHY_USER="${SKATE_USER:-${USER:-peter}}"

PI_DIR="${HOME}/.pi/agent"
TEMP_DIR="/tmp/pi-sync-$$"

usage() {
    echo "Usage: $(basename $0) [options]"
    echo ""
    echo "Syncs: settings.json, models.json, extensions/, AGENTS.md"
    echo "Excludes: auth.json (contains API keys - sync separately if needed)"
    echo ""
    echo "Options:"
    echo "  -h, --host     Omarchy host (default: omarchy.local)"
    echo "  -u, --user     Username on Omarchy (default: ${USER})"
    echo "  -d, --dry-run  Show what would be synced"
    echo "  --help         Show this help"
    exit 1
}

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--host)      OMARCHY_HOST="$2"; shift 2 ;;
        -u|--user)      OMARCHY_USER="$2"; shift 2 ;;
        -d|--dry-run)   DRY_RUN=1; shift ;;
        --help)         usage ;;
        *)              echo "Unknown: $1"; usage ;;
    esac
done

echo "=== Pi config sync to Omarchy ==="
echo "Host:  ${OMARCHY_HOST}"
echo "User:  ${OMARCHY_USER}"
echo ""

# Check source
if [ ! -d "$PI_DIR" ]; then
    echo "ERROR: $PI_DIR not found"
    exit 1
fi

# Create temp dir
mkdir -p "$TEMP_DIR"

# Copy files we want
echo "[1/4] Copying config files..."
cp "$PI_DIR/settings.json" "$TEMP_DIR/"
cp "$PI_DIR/models.json" "$TEMP_DIR/"
cp "$PI_DIR/auth.json" "$TEMP_DIR/"

echo "  settings.json: $(wc -c < "$TEMP_DIR/settings.json") bytes"
echo "  models.json: $(wc -c < "$TEMP_DIR/models.json") bytes"
echo "  auth.json: $(wc -c < "$TEMP_DIR/auth.json") bytes (API keys)"

# Copy extensions directory
echo ""
echo "[2/4] Copying extensions..."
if [ -d "$PI_DIR/extensions" ]; then
    cp -r "$PI_DIR/extensions" "$TEMP_DIR/"
    echo "  extensions: $(ls "$TEMP_DIR/extensions/" | wc -l) items"
else
    echo "  (no extensions dir)"
fi

# AGENTS.md
echo ""
echo "[3/4] AGENTS.md..."
# Don't copy the symlink - we'll create a new one on Omarchy pointing to the repo
echo "# Will be symlinked to: cool-pi-extensions/prompts/edinburgh-protocol.md"
echo "  (will create symlink on Omarchy)"

# Show what we're syncing
echo ""
echo "[4/4] Summary..."
echo "Files to sync:"
ls -la "$TEMP_DIR/"
echo ""
echo "Extensions:"
[ -d "$TEMP_DIR/extensions" ] && ls "$TEMP_DIR/extensions/" || echo "  (none)"
echo ""
echo "Excluded:"
echo "  *.bak files"

# Dry run
if [ "${DRY_RUN:-}" = "1" ]; then
    echo ""
    echo "[DRY RUN] Would copy to ${OMARCHY_USER}@${OMARCHY_HOST}"
    rm -rf "$TEMP_DIR"
    exit 0
fi

# Sync
echo ""
echo "[SYNCING] Copying to Omarchy..."
rsync -avz "$TEMP_DIR/" "${OMARCHY_USER}@${OMARCHY_HOST}:${PI_DIR}/" 2>/dev/null || \
scp -r "$TEMP_DIR/"* "${OMARCHY_USER}@${OMARCHY_HOST}:${PI_DIR}/"

echo ""
echo "[CREATING SYMLINKS] On Omarchy..."

ssh "${OMARCHY_USER}@${OMARCHY_HOST}" "
    # Create extensions dir if needed
    mkdir -p ~/.pi/agent/extensions
    
    # Link AGENTS.md to the repo
    cd ~/cool-pi-extensions
    ln -sf prompts/edinburgh-protocol.md ~/.pi/agent/AGENTS.md
    
    echo 'AGENTS.md linked to cool-pi-extensions/prompts/edinburgh-protocol.md'
    
    # Show what was copied
    echo ''
    echo 'Config files:'
    ls -la ~/.pi/agent/settings.json ~/.pi/agent/models.json 2>/dev/null || echo '  (not found)'
    
    echo ''
    echo 'Extensions:'
    ls ~/.pi/agent/extensions/ 2>/dev/null || echo '  (none)'
"

# Cleanup
rm -rf "$TEMP_DIR"

echo ""
echo "=== Done ==="
echo "On Omarchy, verify with:"
echo "  ls ~/.pi/agent/"
echo "  pi --list-models | head -10"