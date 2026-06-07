# ───────────────────────────────────────────────────────────────────────────────────────
# PostgreSQL Backup Service Dockerfile
# Oto Muhasebe SaaS Platform
# ═══════════════════════════════════════════════════════════════
# Base: Alpine 3.19 (lightweight, ~150MB)
# Purpose: Automated PostgreSQL backup with cron scheduling
# ───────────────────────────────────────────────────────────────────────────────────────

FROM alpine:3.19

# ── INSTALL PACKAGES ─────────────────────────────────────────────────────────────────
# postgresql16-client: pg_dump and psql for database backup/restore
# dcron: Lightweight cron daemon for Alpine (busybox cron is insufficient)
# bash: Shell for backup/restore scripts
# gzip: Compression for backup files
# curl: HTTP client for MinIO download/upload
# mc: MinIO Client for S3-compatible storage upload
RUN apk add --no-cache \
    postgresql16-client \
    dcron \
    bash \
    gzip \
    curl \
    mc

# ── COPY SCRIPTS ─────────────────────────────────────────────────────────────────────
# backup.sh: Automated backup script (triggered by cron)
# restore.sh: Interactive restore script (manual execution)
COPY backup.sh /usr/local/bin/backup.sh
COPY restore.sh /usr/local/bin/restore.sh
COPY restore-test.sh /usr/local/bin/restore-test.sh

# ── MAKE SCRIPTS EXECUTABLE ─────────────────────────────────────────────────────────
RUN chmod +x /usr/local/bin/backup.sh \
    /usr/local/bin/restore.sh \
    /usr/local/bin/restore-test.sh

# ── CREATE BACKUP DIRECTORY ──────────────────────────────────────────────────────────
# Local backup storage directory
# Bind mounted from host: ./backups/postgres
RUN mkdir -p /backups

# ── ENTRYPOINT SCRIPT ────────────────────────────────────────────────────────────────
# Purpose: Set up cron job and start dcron in foreground
# - Creates cron job from BACKUP_SCHEDULE environment variable
# - Runs initial backup on container start (optional, configurable)
# - Starts dcron daemon in foreground
RUN echo '#!/bin/sh' > /entrypoint.sh && \
    echo 'set -e' >> /entrypoint.sh && \
    echo '' >> /entrypoint.sh && \
    echo '# Create cron job from environment variable' >> /entrypoint.sh && \
    echo 'echo "${BACKUP_SCHEDULE:-30 23 * * *} /usr/local/bin/backup.sh >> /var/log/cron.log 2>&1" | crontab -' >> /entrypoint.sh && \
    echo '' >> /entrypoint.sh && \
    echo '# Print cron job for debugging' >> /entrypoint.sh && \
    echo 'echo "Cron job:"' >> /entrypoint.sh && \
    echo 'crontab -l' >> /entrypoint.sh && \
    echo '' >> /entrypoint.sh && \
    echo '# Run initial backup on container start' >> /entrypoint.sh && \
    echo 'if [ "${RUN_INITIAL_BACKUP:-true}" = "true" ]; then' >> /entrypoint.sh && \
    echo '  echo "[ENTRYPOINT] Running initial backup..."' >> /entrypoint.sh && \
    echo '  /usr/local/bin/backup.sh' >> /entrypoint.sh && \
    echo 'else' >> /entrypoint.sh && \
    echo '  echo "[ENTRYPOINT] Skipping initial backup (RUN_INITIAL_BACKUP=false)"' >> /entrypoint.sh && \
    echo 'fi' >> /entrypoint.sh && \
    echo '' >> /entrypoint.sh && \
    echo '# Start dcron in foreground' >> /entrypoint.sh && \
    echo 'echo "[ENTRYPOINT] Starting dcron daemon..."' >> /entrypoint.sh && \
    echo 'echo "[ENTRYPOINT] Schedule: ${BACKUP_SCHEDULE:-30 23 * * *}"' >> /entrypoint.sh && \
    echo 'echo "[ENTRYPOINT] Retention: ${BACKUP_RETENTION_DAYS:-7} days"' >> /entrypoint.sh && \
    echo 'echo "[ENTRYPOINT] Local storage: /backups"' >> /entrypoint.sh && \
    echo 'echo "[ENTRYPOINT] MinIO endpoint: ${MINIO_ENDPOINT:-not configured}"' >> /entrypoint.sh && \
    echo 'echo "[ENTRYPOINT] Backup container is running..."' >> /entrypoint.sh && \
    echo '' >> /entrypoint.sh && \
    echo '# Start cron daemon in foreground' >> /entrypoint.sh && \
    echo 'crond -f -l 2' >> /entrypoint.sh && \
    chmod +x /entrypoint.sh

# ── SET ENTRYPOINT ───────────────────────────────────────────────────────────────────
ENTRYPOINT ["/entrypoint.sh"]

# ── DEFAULT ENVIRONMENT VARIABLES ─────────────────────────────────────────────────────
# BACKUP_SCHEDULE: Cron schedule (minute hour day month weekday)
# Example: "30 23 * * *" (every day at 23:30)
ENV BACKUP_SCHEDULE="30 23 * * *"

# BACKUP_RETENTION_DAYS: Number of days to keep backups locally
ENV BACKUP_RETENTION_DAYS=7

# RUN_INITIAL_BACKUP: Run backup immediately on container start (true/false)
ENV RUN_INITIAL_BACKUP=true

# ── VOLUMES ─────────────────────────────────────────────────────────────────────────
# /backups: Local backup storage (bind mounted from host)
VOLUME /backups

# ── HEALTHCHECK ───────────────────────────────────────────────────────────────────────
# Check if cron daemon is running
HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=30s \
    CMD pgrep crond || exit 1

# ───────────────────────────────────────────────────────────────────────────────────────
# USAGE
# ───────────────────────────────────────────────────────────────────────────────────────
#
# Build image:
#   docker build -t muhasebe-backup:latest backup/
#
# Run container (manual):
#   docker run --rm \
#     -e POSTGRES_HOST=postgres \
#     -e POSTGRES_PASSWORD=password \
#     -e BACKUP_SCHEDULE="30 23 * * *" \
#     muhasebe-backup:latest
#
# Run via docker-compose:
#   docker compose -f docker-compose.backup.yml up -d backup
#
# Trigger manual backup:
#   docker compose -f docker-compose.backup.yml exec backup /usr/local/bin/backup.sh
#
# Restore from backup:
#   docker compose -f docker-compose.backup.yml exec backup /usr/local/bin/restore.sh backup_2026-03-13_23-30-01.sql.gz
#
# Run restore test:
#   docker compose -f docker-compose.backup.yml exec backup /usr/local/bin/restore-test.sh
#
# ───────────────────────────────────────────────────────────────────────────────────────