#!/bin/bash
# ───────────────────────────────────────────────────────────────────────────────────────
# PostgreSQL Interactive Restore Script
# Oto Muhasebe SaaS Platform
# ═══════════════════════════════════════════════════════════════
# Purpose: Restore PostgreSQL database from backup
# Usage: restore.sh [backup_filename]
#   - If filename given: restore that specific backup
#   - If no filename: list available backups and prompt user
# WARNING: This will OVERWRITE the current database!
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
            echo -e "${GREEN}[${timestamp}]${NC} $message"
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
        FATAL)
            echo -e "${RED}[${timestamp}]${NC} 💀 FATAL: $message"
            ;;
        *)
            echo "[${timestamp}] $message"
            ;;
    esac
}

# ── CHECK DEPENDENCIES ─────────────────────────────────────────────────────────────
check_dependencies() {
    log STEP "Checking dependencies..."

    if ! command -v psql &> /dev/null; then
        log FATAL "psql not found! Install postgresql16-client."
        exit 1
    fi

    if ! command -v gunzip &> /dev/null; then
        log FATAL "gunzip not found! Install gzip."
        exit 1
    fi

    log INFO "All dependencies found."
}

# ── CHECK ENVIRONMENT VARIABLES ────────────────────────────────────────────────────
check_env_vars() {
    log STEP "Checking environment variables..."

    local missing_vars=()

    [ -z "$POSTGRES_HOST" ] && missing_vars+=("POSTGRES_HOST")
    [ -z "$POSTGRES_PORT" ] && missing_vars+=("POSTGRES_PORT")
    [ -z "$POSTGRES_DB" ] && missing_vars+=("POSTGRES_DB")
    [ -z "$POSTGRES_USER" ] && missing_vars+=("POSTGRES_USER")
    [ -z "$POSTGRES_PASSWORD" ] && missing_vars+=("POSTGRES_PASSWORD")

    if [ ${#missing_vars[@]} -gt 0 ]; then
        log FATAL "Missing environment variables: ${missing_vars[*]}"
        exit 1
    fi

    log INFO "All environment variables set."
}

# ── LIST AVAILABLE BACKUPS ───────────────────────────────────────────────────────
list_backups() {
    echo ""
    log STEP "Available backups in /backups:"
    echo ""

    local backups=($(ls -t /backups/backup_*.sql.gz 2>/dev/null))

    if [ ${#backups[@]} -eq 0 ]; then
        log FATAL "No backups found in /backups!"
        exit 1
    fi

    # Print backups with numbers
    for i in "${!backups[@]}"; do
        local backup_file="${backups[$i]}"
        local file_size=$(du -h "$backup_file" | cut -f1)
        local file_date=$(stat -c %y "$backup_file" 2>/dev/null | cut -d' ' -f1,2 | cut -d'.' -f1)
        
        echo "  [$((i+1))] $(basename "$backup_file")"
        echo "       Size: $file_size | Modified: $file_date"
        echo ""
    done
}

# ── PROMPT USER FOR BACKUP ────────────────────────────────────────────────────────
prompt_for_backup() {
    local backups=($(ls -t /backups/backup_*.sql.gz 2>/dev/null))
    local num_backups=${#backups[@]}

    while true; do
        echo -n "Select backup to restore [1-$num_backups]: "
        read -r selection

        # Validate selection
        if [[ "$selection" =~ ^[0-9]+$ ]] && [ "$selection" -ge 1 ] && [ "$selection" -le "$num_backups" ]; then
            local index=$((selection-1))
            echo "${backups[$index]}"
            return
        else
            log WARN "Invalid selection. Please enter a number between 1 and $num_backups."
        fi
    done
}

# ── CONFIRM RESTORE ──────────────────────────────────────────────────────────────
confirm_restore() {
    local backup_file=$1

    echo ""
    log FATAL "⚠️  WARNING: This will OVERWRITE the current database!"
    log FATAL "⚠️  Database: $POSTGRES_DB"
    log FATAL "⚠️  Backup file: $(basename "$backup_file")"
    echo ""
    echo -n "Are you sure you want to proceed? Type 'yes' to confirm: "
    read -r confirmation

    if [ "$confirmation" != "yes" ]; then
        log WARN "Restore cancelled by user."
        exit 0
    fi

    echo ""
    log INFO "Restore confirmed. Proceeding..."
}

# ── DROP EXISTING CONNECTIONS ───────────────────────────────────────────────────
drop_connections() {
    log STEP "Dropping existing connections..."

    export PGPASSWORD="$POSTGRES_PASSWORD"

    # Drop all connections to the database
    psql \
        -h "$POSTGRES_HOST" \
        -p "$POSTGRES_PORT" \
        -U "$POSTGRES_USER" \
        -d postgres \
        -c "
            SELECT pg_terminate_backend(pid)
            FROM pg_stat_activity
            WHERE datname = '$POSTGRES_DB'
            AND pid <> pg_backend_pid();
        " &> /dev/null || true

    log INFO "Existing connections dropped."
}

# ── RESTORE DATABASE ───────────────────────────────────────────────────────────────
restore_database() {
    local backup_file=$1

    log STEP "Restoring database from backup..."

    export PGPASSWORD="$POSTGRES_PASSWORD"

    # Restore from backup file
    if ! gunzip -c "$backup_file" | psql \
        -h "$POSTGRES_HOST" \
        -p "$POSTGRES_PORT" \
        -U "$POSTGRES_USER" \
        -d "$POSTGRES_DB" \
        -v ON_ERROR_STOP=1 \
        --quiet; then

        log FATAL "Restore failed!"
        exit 1
    fi

    log INFO "Database restored successfully."
}

# ── VERIFY RESTORE ───────────────────────────────────────────────────────────────
verify_restore() {
    log STEP "Verifying restore..."

    export PGPASSWORD="$POSTGRES_PASSWORD"

    # Check if database is accessible
    if ! psql \
        -h "$POSTGRES_HOST" \
        -p "$POSTGRES_PORT" \
        -U "$POSTGRES_USER" \
        -d "$POSTGRES_DB" \
        -c "SELECT 1;" &> /dev/null; then

        log FATAL "Database is not accessible after restore!"
        exit 1
    fi

    # Get table count
    local table_count=$(psql \
        -h "$POSTGRES_HOST" \
        -p "$POSTGRES_PORT" \
        -U "$POSTGRES_USER" \
        -d "$POSTGRES_DB" \
        -t \
        -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | tr -d ' ')

    log INFO "Tables in database: $table_count"

    if [ "$table_count" -lt 100 ]; then
        log WARN "Table count is low (< 100). Verify restore integrity."
    fi

    log INFO "Restore verified successfully."
}

# ── MAIN FUNCTION ───────────────────────────────────────────────────────────────────
main() {
    echo ""
    echo "════════════════════════════════════════════════════════════════"
    echo "PostgreSQL Restore Service"
    echo "════════════════════════════════════════════════════════════════"
    echo ""

    # Get backup file from argument or prompt
    local backup_file=""

    if [ -n "$1" ]; then
        # Backup file provided as argument
        backup_file="/backups/$1"

        if [ ! -f "$backup_file" ]; then
            log FATAL "Backup file not found: $backup_file"
            exit 1
        fi

        log INFO "Backup file specified: $(basename "$backup_file")"
    else
        # No argument, prompt user
        list_backups
        backup_file=$(prompt_for_backup)
        log INFO "Backup file selected: $(basename "$backup_file")"
    fi

    echo ""

    # Step 1: Check dependencies
    check_dependencies
    echo ""

    # Step 2: Check environment variables
    check_env_vars
    echo ""

    # Step 3: Confirm restore
    confirm_restore "$backup_file"
    echo ""

    # Step 4: Drop existing connections
    drop_connections
    echo ""

    # Step 5: Restore database
    restore_database "$backup_file"
    echo ""

    # Step 6: Verify restore
    verify_restore
    echo ""

    # Print summary
    log INFO "Restore completed successfully!"
    echo ""
    echo "Restore Summary:"
    echo "  Backup file: $(basename "$backup_file")"
    echo "  Database: $POSTGRES_DB"
    echo "  Host: $POSTGRES_HOST:$POSTGRES_PORT"
    echo ""
    echo "⚠️  IMPORTANT: Verify data integrity in your application!"
    echo "════════════════════════════════════════════════════════════════"

    exit 0
}

# ───────────────────────────────────────────────────────────────────────────────────────
# RUN MAIN FUNCTION
# ───────────────────────────────────────────────────────────────────────────────────────
main "$@"