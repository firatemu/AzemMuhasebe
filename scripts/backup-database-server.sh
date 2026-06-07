#!/usr/bin/env bash
# Sunucuda veritabanı yedeği (staging PostgreSQL)
# Kullanım (sunucuda SSH ile): cd /var/www/muhasebe && bash scripts/backup-database-server.sh
# Veya proje yoksa: mkdir -p /var/www/muhasebe/backups && docker exec muhasebe-postgres pg_dump -U postgres --no-owner --no-acl muhasebe_stage -F p > /var/www/muhasebe/backups/muhasebe_stage_$(date +%Y%m%d_%H%M%S).sql

set -e
CONTAINER_NAME="muhasebe-postgres"
DB_NAME="muhasebe_stage"
# Sunucuda proje genelde bu dizinde
PROJECT_ROOT="${PROJECT_ROOT:-/var/www/muhasebe}"
BACKUPS_DIR="$PROJECT_ROOT/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUPS_DIR/muhasebe_stage_${TIMESTAMP}.sql"

mkdir -p "$BACKUPS_DIR"

if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  echo "Hata: PostgreSQL container ($CONTAINER_NAME) çalışmıyor."
  exit 1
fi

echo "Yedek alınıyor: $BACKUP_FILE"
docker exec "$CONTAINER_NAME" pg_dump -U postgres --no-owner --no-acl "$DB_NAME" -F p > "$BACKUP_FILE"

if [[ -s "$BACKUP_FILE" ]]; then
  echo "Yedek tamamlandı. Boyut: $(du -h "$BACKUP_FILE" | cut -f1)"
else
  echo "Hata: Yedek dosyası boş."
  exit 1
fi
