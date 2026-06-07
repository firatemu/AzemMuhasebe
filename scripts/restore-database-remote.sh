#!/usr/bin/env bash
# Uzak sunucuda PostgreSQL restore (backup önce sunucuya kopyalanmış olmalı)
# Kullanım (uzak sunucuda): cd /var/www/muhasebe && ./scripts/restore-database-remote.sh
# veya: ssh root@31.210.43.185 "cd /var/www/muhasebe && bash -s" < scripts/restore-database-remote.sh

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
BACKUPS_DIR="${PROJECT_ROOT}/backups"
CONTAINER_NAME="muhasebe-postgres"

cd "$PROJECT_ROOT"
mkdir -p "$BACKUPS_DIR"

# En son SQL yedeğini bul (backups/*.sql veya backups/staging_full_*/*.sql)
DB_BACKUP=$(ls backups/muhasebe_stage_*.sql 2>/dev/null | tail -1)
if [[ -z "$DB_BACKUP" ]]; then
  DB_BACKUP=$(ls backups/staging_full_*/muhasebe_stage_*.sql 2>/dev/null | tail -1)
fi

if [[ -z "$DB_BACKUP" || ! -f "$DB_BACKUP" ]]; then
  echo "Hata: backups/ içinde muhasebe_stage_*.sql bulunamadı."
  echo "Önce yedeği sunucuya kopyalayın: scp backups/muhasebe_stage_*.sql root@31.210.43.185:/var/www/muhasebe/backups/"
  exit 1
fi

if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  echo "PostgreSQL container çalışmıyor. Önce base compose ile başlatın:"
  echo "  docker compose -f docker/compose/docker-compose.base.yml up -d postgres"
  exit 1
fi

echo "Restore edilecek yedek: $DB_BACKUP"
docker exec -i "$CONTAINER_NAME" psql -U postgres -d postgres -c "DROP DATABASE IF EXISTS muhasebe_stage;"
docker exec -i "$CONTAINER_NAME" psql -U postgres -d postgres -c "CREATE DATABASE muhasebe_stage;"
docker exec -i "$CONTAINER_NAME" psql -U postgres -d muhasebe_stage < "$DB_BACKUP"
echo "PostgreSQL restore tamamlandı."
