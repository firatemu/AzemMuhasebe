#!/bin/bash
# ───────────────────────────────────────────────────────────────────────────────────────
# PostgreSQL Automated Backup Script
# Oto Muhasebe SaaS Platform
# ═══════════════════════════════════════════════════════════════
# Purpose: Scheduled backup of PostgreSQL database
# Triggers: Cron (via dcron) or manual execution
# Storage: Local (/backups) + MinIO (off-site)
# ───────────────────────────────────────────────────────────────────────────────────────

set -e  # Exit on error

# ── COLORS ────────────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ── LOGGING FUNCTION ─────────────────────────────────────────────────────────────────
log() {
    local level=$1
    shift
    local message="$@"
    local timestamp=$(date +"%Y-%m-%d %H:%M:%S")

    case $level in
        INFO)
            echo -e "${GREEN}[${timestamp}]${NC} ✅ $message"
            ;;
        WARN)
            echo -e "${YELLOW}[${timestamp}]${NC} ⚠️  $message"
            ;;
        ERROR)
            echo -e "${RED}[${timestamp}]${NC} ❌ $message"
            ;;
        STEP)
            echo -e "${BLUE}[${timestamp}]${NC} 🔧 $message"
            ;;
        *)
            echo "[${timestamp}] $message"
            ;;
    esac
}

# ── CHECK DEPENDENCIES ─────────────────────────────────────────────────────────────
check_dependencies() {
    log STEP "Checking dependencies..."

    if ! command -v pg_dump &> /dev/null; then
        log ERROR "pg_dump not found! Install postgresql16-client."
        exit 1
    fi

    if ! command -v mc &> /dev/null; then
        log ERROR "mc (MinIO Client) not found! Install mc."
        exit 1
    fi

    if ! command -v gzip &> /dev/null; then
        log ERROR "gzip not found! Install gzip."
        exit 1
    fi

    log INFO "All dependencies found."
}

# ── CHECK ENVIRONMENT VARIABLES ────────────────────────────────────────────────────
check_env_vars() {
    log STEP "Checking environment variables..."

    local missing_vars=()

    # Required variables
    [ -z "$POSTGRES_HOST" ] && missing_vars+=("POSTGRES_HOST")
    [ -z "$POSTGRES_PORT" ] && missing_vars+=("POSTGRES_PORT")
    [ -z "$POSTGRES_DB" ] && missing_vars+=("POSTGRES_DB")
    [ -z "$POSTGRES_USER" ] && missing_vars+=("POSTGRES_USER")
    [ -z "$POSTGRES_PASSWORD" ] && missing_vars+=("POSTGRES_PASSWORD")
    [ -z "$BACKUP_RETENTION_DAYS" ] && missing_vars+=("BACKUP_RETENTION_DAYS")

    # MinIO variables (optional but recommended)
    if [ -z "$MINIO_ENDPOINT" ]; then
        log WARN "MINIO_ENDPOINT not set. Skipping MinIO upload."
    fi

    if [ -n "$MINIO_ENDPOINT" ] && [ -z "$MINIO_ACCESS_KEY" ]; then
        missing_vars+=("MINIO_ACCESS_KEY")
    fi

    if [ -n "$MINIO_ENDPOINT" ] && [ -z "$MINIO_SECRET_KEY" ]; then
        missing_vars+=("MINIO_SECRET_KEY")
    fi

    if [ -n "$MINIO_ENDPOINT" ] && [ -z "$MINIO_BUCKET" ]; then
        missing_vars+=("MINIO_BUCKET")
    fi

    if [ ${#missing_vars[@]} -gt 0 ]; then
        log ERROR "Missing environment variables: ${missing_vars[*]}"
        exit 1
    fi

    log INFO "All required environment variables set."
}

# ── CONFIGURE MinIO ─────────────────────────────────────────────────────────────
configure_minio() {
    if [ -z "$MINIO_ENDPOINT" ]; then
        log WARN "MinIO not configured. Skipping upload."
        return 0
    fi

    log STEP "Configuring MinIO..."

    # Configure MinIO alias
    mc alias set minio "$MINIO_ENDPOINT" "$MINIO_ACCESS_KEY" "$MINIO_SECRET_KEY" --api S3v4

    # Check if bucket exists
    if mc ls "minio/$MINIO_BUCKET" &> /dev/null; then
        log INFO "MinIO bucket exists: $MINIO_BUCKET"
    else
        log WARN "MinIO bucket does not exist: $MINIO_BUCKET"
        log WARN "Create bucket manually: mc mb minio/$MINIO_BUCKET"
        log WARN "Or: docker exec minio mc mb minio/$MINIO_BUCKET"
        log WARN "Skipping MinIO upload."
        return 0
    fi

    log INFO "MinIO configured successfully."
}

# ── RUN BACKUP ────────────────────────────────────────────────────────────────────
run_backup() {
    log STEP "Starting backup process..."

    # Generate timestamped filename
    local filename="backup_$(date +%Y-%m-%d_%H-%M-%S).sql.gz"
    local filepath="/backups/$filename"

    log INFO "Backup file: $filename"

    # Export PGPASSWORD for pg_dump
    export PGPASSWORD="$POSTGRES_PASSWORD"

    # Run pg_dump with gzip compression
    log STEP "Running pg_dump..."
    if ! pg_dump \
        -h "$POSTGRES_HOST" \
        -p "$POSTGRES_PORT" \
        -U "$POSTGRES_USER" \
        -d "$POSTGRES_DB" \
        --no-owner \
        --no-acl \
        --clean \
        --if-exists \
        2>&1 | gzip > "$filepath"; then

        log ERROR "pg_dump failed!"
        rm -f "$filepath"
        exit 1
    fi

    # Verify backup file is not empty
    if [ ! -s "$filepath" ]; then
        log ERROR "Backup file is empty!"
        rm -f "$filepath"
        exit 1
    fi

    # Get file size
    local filesize=$(du -h "$filepath" | cut -f1)
    log INFO "Backup created: $filename (Size: $filesize)"
}

# ── UPLOAD TO MinIO ───────────────────────────────────────────────────────────────
upload_to_minio() {
    if [ -z "$MINIO_ENDPOINT" ]; then
        log WARN "MinIO not configured. Skipping upload."
        return 0
    fi

    log STEP "Uploading to MinIO..."

    local filename=$(basename "$filepath")

    # Upload to MinIO
    if ! mc cp "$filepath" "minio/$MINIO_BUCKET/$filename" &> /dev/null; then
        log ERROR "MinIO upload failed!"
        log WARN "Backup saved locally: $filepath"
        log WARN "MinIO upload failed (non-fatal)"
        return 2
    fi

    log INFO "Uploaded to MinIO: minio/$MINIO_BUCKET/$filename"
}

# ── CLEAN OLD BACKUPS ──────────────────────────────────────────────────────────────
cleanup_old_backups() {
    log STEP "Cleaning up old backups..."

    local retention_days=${BACKUP_RETENTION_DAYS:-7}

    # Find and delete backups older than retention period
    local deleted_count=$(find /backups -name "backup_*.sql.gz" -mtime +$retention_days -delete -print | wc -l)

    if [ "$deleted_count" -gt 0 ]; then
        log INFO "Deleted $deleted_count old backup(s) (older than $retention_days days)"
    else
        log INFO "No old backups to delete."
    fi
}

# ── PRINT SUMMARY ─────────────────────────────────────────────────────────────────
print_summary() {
    local filename=$(basename "$filepath")

    echo ""
    log INFO "Backup completed successfully!"
    echo ""
    echo "Backup Details:"
    echo "  Filename: $filename"
    echo "  Path: $filepath"
    echo "  Size: $(du -h "$filepath" | cut -f1)"
    echo "  Retention: ${BACKUP_RETENTION_DAYS:-7} days"
    echo ""
    if [ -n "$MINIO_ENDPOINT" ]; then
        echo "MinIO:"
        echo "  Bucket: $MINIO_BUCKET"
        echo "  Path: minio/$MINIO_BUCKET/$filename"
        echo ""
    fi
}

# ── MAIN FUNCTION ───────────────────────────────────────────────────────────────────
main() {
    echo ""
    echo "════════════════════════════════════════════════════════════════"
    echo "PostgreSQL Backup Service"
    echo "════════════════════════════════════════════════════════════════"
    echo ""

    # Set global filepath variable
    local filepath=""

    # Step 1: Check dependencies
    check_dependencies
    echo ""

    # Step 2: Check environment variables
    check_env_vars
    echo ""

    # Step 3: Configure MinIO (if configured)
    configure_minio
    echo ""

    # Step 4: Run backup
    run_backup
    echo ""

    # Step 5: Upload to MinIO (if configured)
    local minio_exit_code=0
    if [ -n "$MINIO_ENDPOINT" ]; then
        upload_to_minio
        minio_exit_code=$?
        echo ""
    fi

    # Step 6: Clean old backups
    cleanup_old_backups
    echo ""

    # Step 7: Print summary
    print_summary

    # Exit with appropriate code
    if [ "$minio_exit_code" -eq 2 ]; then
        echo ""
        log WARN "Backup saved locally, but MinIO upload failed (non-fatal)."
        exit 2
    fi

    echo "════════════════════════════════════════════════════════════════"
    exit 0
}

# ───────────────────────────────────────────────────────────────────────────────────────
# RUN MAIN FUNCTION
# ───────────────────────────────────────────────────────────────────────────────────────
main "$@"