#!/bin/bash
# sync-skate-to-omarchy.sh
# Sync skate secrets from local Mac to Omarchy via SSH

set -e

# Configuration — edit these
OMARCHY_HOST="${SKATE_HOST:-omarchy.local}"
OMARCHY_USER="${SKATE_USER:-${USER:-peter}}"

# Skate data file (it's a shell export file)
SKATE_SRC="${HOME}/.skate_env"

usage() {
    echo "Usage: $(basename $0) [options]"
    echo ""
    echo "Options:"
    echo "  -h, --host     Omarchy host (default: omarchy.local)"
    echo "  -u, --user     Username on Omarchy (default: ${USER})"
    echo "  -d, --dry-run  Show what would be copied without copying"
    echo "  --help         Show this help"
    exit 1
}

# Parse args
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--host)      OMARCHY_HOST="$2"; shift 2 ;;
        -u|--user)      OMARCHY_USER="$2"; shift 2 ;;
        -d|--dry-run)   DRY_RUN=1; shift ;;
        --help)         usage ;;
        *)              echo "Unknown: $1"; usage ;;
    esac
done

echo "=== Skate sync to Omarchy ==="
echo "Host:  ${OMARCHY_HOST}"
echo "User:  ${OMARCHY_USER}"
echo ""

# Check source exists
if [ ! -f "$SKATE_SRC" ]; then
    echo "ERROR: Skate file not found at $SKATE_SRC"
    exit 1
fi

# Show keys (without values)
echo "[1/3] Local skate keys:"
grep -v "^export $" "$SKATE_SRC" | grep "^export " | sed 's/export \([^=]*\)=.*/  \1/' | sort
KEY_COUNT=$(grep -c "^export [^=]*=" "$SKATE_SRC" || echo "0")
echo "  ($KEY_COUNT keys)"
echo ""

# Dry run
if [ "${DRY_RUN:-}" = "1" ]; then
    echo "[DRY RUN] Would copy $SKATE_SRC to ${OMARCHY_USER}@${OMARCHY_HOST}:${SKATE_SRC}"
    exit 0
fi

# Sync
echo "[2/3] Copying to Omarchy..."
scp "$SKATE_SRC" "${OMARCHY_USER}@${OMARCHY_HOST}:${SKATE_SRC}.tmp"

# Backup existing on Omarchy, then install
ssh "${OMARCHY_USER}@${OMARCHY_HOST}" "
    [ -f ~/.skate_env ] && cp ~/.skate_env ~/.skate_env.backup-\$(date +%Y%m%d-%H%M%S)
    mv ${SKATE_SRC}.tmp ${SKATE_SRC}
    chmod 600 ${SKATE_SRC}
    echo 'Installed. Keys:'
    grep '^export [^=]*=' ${SKATE_SRC} | sed 's/export \([^=]*\)=.*/  \1/'
"

echo ""
echo "[3/3] Verifying on Omarchy..."
ssh "${OMARCHY_USER}@${OMARCHY_HOST}" "grep -c '^export [^=]*=' ~/.skate_env" | xargs echo "  Omarchy has" keys

echo ""
echo "=== Done ==="
echo "On Omarchy, secrets are available as shell exports:"
echo "  source ~/.skate_env"
echo "  echo \$github_pat  # should show your PAT"