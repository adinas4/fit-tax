#!/usr/bin/env bash
# =========================================================================
# Backup database + uploaded images for FIT-TAX Cakrawala Sinergi.
# =========================================================================
# Run manually or via cron:
#   0 3 * * * cd /var/www/fittax && bash scripts/backup.sh >> logs/backup.log 2>&1
#
# Keeps the last 30 days of backups. Backups land in ./backups/.
# -------------------------------------------------------------------------
set -euo pipefail
cd "$(dirname "$0")/.."

mkdir -p backups logs

STAMP=$(date +%F-%H%M)
FILE="backups/fittax-${STAMP}.tar.gz"

echo "[$(date)] Backing up to ${FILE}..."

# Always back up the database file.
TARGETS=("db/custom.db")

# Back up the uploads directory if UPLOADS_DIR is set, else public/uploads.
UPLOADS="${UPLOADS_DIR:-public/uploads}"
if [ -d "$UPLOADS" ]; then
  TARGETS+=("$UPLOADS")
fi

tar -czf "$FILE" "${TARGETS[@]}"

echo "[$(date)] Done. Size: $(du -h "$FILE" | cut -f1)"

# Prune backups older than 30 days.
find backups/ -name "fittax-*.tar.gz" -mtime +30 -delete 2>/dev/null || true
echo "[$(date)] Pruned backups older than 30 days."
