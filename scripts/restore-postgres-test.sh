#!/bin/bash
# ───────────────────────────────────────────────────────────────────────────────────────
# PostgreSQL Restore Test Script
# Oto Muhasebe SaaS Platform
# ═══════════════════════════════════════════════════════════════
# Purpose: Test backup integrity WITHOUT touching production database
# Safe to run anytime - never touches production data
# ───────────────────────────────────────────────────────────────────────────────────────

set -e  # Exit on error (but cleanup on exit)

# ── COLORS ────────────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ── TEST DATABASE NAME ─────────────────────────────────────────────────────────────
TEST_DB_NAME="muhasebe_restore_test"

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
        TEST)
            echo -e "${BLUE}[${timestamp}]${NC} 🧪 $message"
            ;;
        *)
            echo "[${timestamp}] $message"
            ;;
    esac
}

# ── CLEANUP FUNCTION ─────────────────────────────────────────────────────────────────
cleanup() {
    log STEP "Cleaning up test database..."

    export PGPASSWORD="$POSTGRES_PASSWORD"

    # Drop test database if exists
    psql \
        -h "$POSTGRES_HOST" \
        -p "$POSTGRES_PORT" \
        -U "$POSTGRES_USER" \
        -d postgres \
        -c "DROP DATABASE IF EXISTS $TEST_DB_NAME;" &> /dev/null || true

    log INFO "Test database cleaned up."
}

# ── CLEANUP ON EXIT ─────────────────────────────────────────────────────────────
trap cleanup EXIT

# ── CHECK DEPENDENCIES ─────────────────────────────────────────────────────────────
check_dependencies() {
    log STEP "Checking dependencies..."

    if ! command -v psql &> /dev/null; then
        log ERROR "psql not found! Install postgresql16-client."
        exit 1
    fi

    if ! command -v gunzip &> /dev/null; then
        log ERROR "gunzip not found! Install gzip."
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
        log ERROR "Missing environment variables: ${missing_vars[*]}"
        exit 1
    fi

    log INFO "All environment variables set."
}

# ── GET LATEST BACKUP ───────────────────────────────────────────────────────────
get_latest_backup() {
    log STEP "Finding latest backup..."

    local latest_backup=$(ls -t /backups/backup_*.sql.gz 2>/dev/null | head -1)

    if [ -z "$latest_backup" ]; then
        log ERROR "No backups found in /backups!"
        exit 1
    fi

    local file_size=$(du -h "$latest_backup" | cut -f1)
    local file_date=$(stat -c %y "$latest_backup" 2>/dev/null | cut -d' ' -f1,2 | cut -d'.' -f1)

    log INFO "Latest backup: $(basename "$latest_backup")"
    log INFO "  Size: $file_size"
    log INFO "  Modified: $file_date"

    echo "$latest_backup"
}

# ── CREATE TEST DATABASE ────────────────────────────────────────────────────────────
create_test_database() {
    log STEP "Creating test database: $TEST_DB_NAME"

    export PGPASSWORD="$POSTGRES_PASSWORD"

    # Drop test database if exists (cleanup from previous run)
    psql \
        -h "$POSTGRES_HOST" \
        -p "$POSTGRES_PORT" \
        -U "$POSTGRES_USER" \
        -d postgres \
        -c "DROP DATABASE IF EXISTS $TEST_DB_NAME;" &> /dev/null || true

    # Create test database
    psql \
        -h "$POSTGRES_HOST" \
        -p "$POSTGRES_PORT" \
        -U "$POSTGRES_USER" \
        -d postgres \
        -c "CREATE DATABASE $TEST_DB_NAME;" &> /dev/null

    log INFO "Test database created."
}

# ── RESTORE BACKUP TO TEST DATABASE ────────────────────────────────────────────────
restore_to_test_database() {
    local backup_file=$1

    log STEP "Restoring backup to test database..."

    export PGPASSWORD="$POSTGRES_PASSWORD"

    # Restore from backup file
    if ! gunzip -c "$backup_file" | psql \
        -h "$POSTGRES_HOST" \
        -p "$POSTGRES_PORT" \
        -U "$POSTGRES_USER" \
        -d "$TEST_DB_NAME" \
        -v ON_ERROR_STOP=1 \
        --quiet; then

        log ERROR "Restore to test database failed!"
        exit 1
    fi

    log INFO "Backup restored to test database."
}

# ── RUN SANITY CHECKS ───────────────────────────────────────────────────────────
run_sanity_checks() {
    log STEP "Running sanity checks..."

    export PGPASSWORD="$POSTGRES_PASSWORD"

    local test_passed=true

    # ── CHECK 1: TABLE COUNT ───────────────────────────────────────────────
    log TEST "Check 1: Table count"
    local table_count=$(psql \
        -h "$POSTGRES_HOST" \
        -p "$POSTGRES_PORT" \
        -U "$POSTGRES_USER" \
        -d "$TEST_DB_NAME" \
        -t \
        -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | tr -d ' ')

    log INFO "  Tables found: $table_count"

    if [ "$table_count" -lt 100 ]; then
        log ERROR "  Table count is too low! Expected > 100, found: $table_count"
        test_passed=false
    else
        log INFO "  ✅ Table count is sufficient (> 100)"
    fi

    # ── CHECK 2: TENANTS TABLE ───────────────────────────────────────────────
    log TEST "Check 2: Tenants table"
    local tenant_count=$(psql \
        -h "$POSTGRES_HOST" \
        -p "$POSTGRES_PORT" \
        -U "$POSTGRES_USER" \
        -d "$TEST_DB_NAME" \
        -t \
        -c "SELECT COUNT(*) FROM tenants;" 2>/dev/null | tr -d ' ')

    if [ -z "$tenant_count" ]; then
        log WARN "  Tenants table not found or not accessible"
    else
        log INFO "  Tenants found: $tenant_count"
        
        if [ "$tenant_count" -eq 0 ]; then
            log ERROR "  Tenants table is empty!"
            test_passed=false
        else
            log INFO "  ✅ Tenants table has data"
        fi
    fi

    # ── CHECK 3: USERS TABLE ───────────────────────────────────────────────────
    log TEST "Check 3: Users table"
    local user_count=$(psql \
        -h "$POSTGRES_HOST" \
        -p "$POSTGRES_PORT" \
        -U "$POSTGRES_USER" \
        -d "$TEST_DB_NAME" \
        -t \
        -c "SELECT COUNT(*) FROM users;" 2>/dev/null | tr -d ' ')

    if [ -z "$user_count" ]; then
        log WARN "  Users table not found or not accessible"
    else
        log INFO "  Users found: $user_count"
        
        if [ "$user_count" -eq 0 ]; then
            log ERROR "  Users table is empty!"
            test_passed=false
        else
            log INFO "  ✅ Users table has data"
        fi
    fi

    # ── CHECK 4: INVOICES TABLE ───────────────────────────────────────────────
    log TEST "Check 4: Invoices table"
    local invoice_count=$(psql \
        -h "$POSTGRES_HOST" \
        -p "$POSTGRES_PORT" \
        -U "$POSTGRES_USER" \
        -d "$TEST_DB_NAME" \
        -t \
        -c "SELECT COUNT(*) FROM invoices;" 2>/dev/null | tr -d ' ')

    if [ -z "$invoice_count" ]; then
        log WARN "  Invoices table not found or not accessible"
    else
        log INFO "  Invoices found: $invoice_count"
        
        if [ "$invoice_count" -eq 0 ]; then
            log WARN "  Invoices table is empty (may be normal for new deployments)"
        else
            log INFO "  ✅ Invoices table has data"
        fi
    fi

    # Return test result
    if [ "$test_passed" = true ]; then
        return 0
    else
        return 1
    fi
}

# ── PRINT TEST RESULTS ────────────────────────────────────────────────────────────
print_test_results() {
    local test_result=$1

    echo ""
    echo "════════════════════════════════════════════════════════════════"
    if [ "$test_result" -eq 0 ]; then
        log INFO "All sanity checks passed! ✅"
        log INFO "Backup integrity verified."
    else
        log ERROR "Some sanity checks failed! ❌"
        log ERROR "Backup integrity could not be verified."
    fi
    echo ""
    echo "Test Summary:"
    echo "  Test database: $TEST_DB_NAME"
    echo "  Backup file: $(basename "$backup_file")"
    echo "  Production database: $POSTGRES_DB"
    echo "  Result: $([ "$test_result" -eq 0 ] && echo 'PASSED' || echo 'FAILED')"
    echo ""
    log INFO "Test database will be cleaned up automatically."
    echo "════════════════════════════════════════════════════════════════"
}

# ── MAIN FUNCTION ───────────────────────────────────────────────────────────────────
main() {
    echo ""
    echo "════════════════════════════════════════════════════════════════"
    echo "PostgreSQL Restore Test Service"
    echo "════════════════════════════════════════════════════════════════"
    echo ""
    log INFO "This test will NOT touch the production database."
    log INFO "A temporary database will be created for testing."
    echo ""

    # Set global variables
    local backup_file=""

    # Step 1: Check dependencies
    check_dependencies
    echo ""

    # Step 2: Check environment variables
    check_env_vars
    echo ""

    # Step 3: Get latest backup
    backup_file=$(get_latest_backup)
    echo ""

    # Step 4: Create test database
    create_test_database
    echo ""

    # Step 5: Restore backup to test database
    restore_to_test_database "$backup_file"
    echo ""

    # Step 6: Run sanity checks
    if ! run_sanity_checks; then
        echo ""
        print_test_results 1
        exit 1
    fi
    echo ""

    # Step 7: Print results
    print_test_results 0

    # Cleanup will be called automatically on exit via trap
    exit 0
}

# ───────────────────────────────────────────────────────────────────────────────────────
# RUN MAIN FUNCTION
# ───────────────────────────────────────────────────────────────────────────────────────
main "$@"