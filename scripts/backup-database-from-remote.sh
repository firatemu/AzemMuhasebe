#!/usr/bin/env bash
# Uzak sunucudan (31.210.43.185) veritabanı yedeğini alır ve LOCAL proje backups/ klasörüne kaydeder.
# Kullanım (yerel makinede): ./scripts/backup-database-from-remote.sh
# Gereksinim: Yerel makineden ssh root@31.210.43.185 erişimi olmalı.

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
BACKUPS_DIR="$PROJECT_ROOT/backups"
REMOTE_HOST="${REMOTE_HOST:-root@31.210.43.185}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
OUTPUT_FILE="$BACKUPS_DIR/muhasebe_stage_${TIMESTAMP}.sql"

mkdir -p "$BACKUPS_DIR"

echo "Sunucudan yedek alınıyor: $REMOTE_HOST -> $OUTPUT_FILE"
ssh -o ConnectTimeout=15 "$REMOTE_HOST" "docker exec muhasebe-postgres pg_dump -U postgres --no-owner --no-acl muhasebe_stage -F p" > "$OUTPUT_FILE"

if [[ -s "$OUTPUT_FILE" ]]; then
  echo "Yedek yerel sunucuya kaydedildi: $OUTPUT_FILE"
  echo "Boyut: $(du -h "$OUTPUT_FILE" | cut -f1)"
else
  echo "Hata: Yedek dosyası boş. SSH ve container erişimini kontrol edin."
  exit 1
fi
