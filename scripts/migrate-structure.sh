#!/bin/bash
# ═════════════════════════════════════════════════════════════════
# Oto Muhasebe Monorepo Structure Migration Script
# ═════════════════════════════════════════════════════════════════
# Purpose: Reorganize project into enterprise-grade monorepo layout
# Usage: ./migrate-structure.sh [--dry-run]
# ═════════════════════════════════════════════════════════════════

set -e  # Exit on error

# ── COLORS ────────────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ── FLAGS ───────────────────────────────────────────────────────────────────────────
DRY_RUN=false
if [ "$1" = "--dry-run" ]; then
    DRY_RUN=true
    echo -e "${YELLOW}[DRY-RUN MODE]${NC} No changes will be made. Showing what would happen..."
    echo ""
fi

# ── COUNTERS ─────────────────────────────────────────────────────────────────────
MOVED_FILES=0
CREATED_DIRS=0
SKIPPED_FILES=0
DELETED_FILES=0

# ── FUNCTIONS ─────────────────────────────────────────────────────────────────────

# Print colored message
log() {
    local level=$1
    shift
    local message="$@"
    
    case $level in
        MOVE)
            echo -e "${GREEN}[MOVE]${NC}   $message"
            ;;
        CREATE)
            echo -e "${BLUE}[CREATE]${NC} $message"
            ;;
        SKIP)
            echo -e "${YELLOW}[SKIP]${NC}   $message"
            ;;
        DELETE)
            echo -e "${RED}[DELETE]${NC} $message"
            ;;
        WARN)
            echo -e "${YELLOW}[WARN]${NC}   $message"
            ;;
        *)
            echo "$message"
            ;;
    esac
}

# Move file using git mv
git_move() {
    local src=$1
    local dst=$2
    
    if [ -e "$dst" ]; then
        SKIPPED_FILES=$((SKIPPED_FILES + 1))
        log SKIP "$src → $dst (destination exists)"
        return
    fi
    
    if [ "$DRY_RUN" = false ]; then
        git mv "$src" "$dst" 2>/dev/null || mv "$src" "$dst"
    fi
    
    MOVED_FILES=$((MOVED_FILES + 1))
    log MOVE "$src → $dst"
}

# Create directory
create_dir() {
    local dir=$1
    
    if [ -d "$dir" ]; then
        SKIPPED_FILES=$((SKIPPED_FILES + 1))
        log SKIP "$dir (already exists)"
        return
    fi
    
    if [ "$DRY_RUN" = false ]; then
        mkdir -p "$dir"
    fi
    
    CREATED_DIRS=$((CREATED_DIRS + 1))
    log CREATE "$dir/"
}

# Delete file/directory
delete_item() {
    local item=$1
    
    if [ "$DRY_RUN" = false ]; then
        rm -rf "$item"
    fi
    
    DELETED_FILES=$((DELETED_FILES + 1))
    log DELETE "$item"
}

# ── SAFETY CHECK ─────────────────────────────────────────────────────────────────
if [ ! -d ".git" ]; then
    echo -e "${RED}[ERROR]${NC} Must be run from project root (git repository)"
    exit 1
fi

if [ ! -f "docker-compose.yml" ]; then
    echo -e "${RED}[ERROR]${NC} Not in project root (docker-compose.yml not found)"
    exit 1
fi

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║  Oto Muhasebe Monorepo Structure Migration                    ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
if [ "$DRY_RUN" = true ]; then
    echo "Mode: DRY-RUN (no changes will be made)"
else
    echo "Mode: EXECUTE (changes will be made)"
fi
echo ""

# ── STEP 1: CREATE NEW DIRECTORIES ───────────────────────────────────────────────
echo "═══════════════════════════════════════════════════════════════════"
echo "Step 1: Creating new directories"
echo "═══════════════════════════════════════════════════════════════════"
echo ""

create_dir infra/docker
create_dir infra/caddy
create_dir infra/pgbouncer
create_dir infra/monitoring
create_dir infra/backup
create_dir envs
echo ""

# ── STEP 2: MOVE INFRASTRUCTURE FILES ────────────────────────────────────────────
echo "═══════════════════════════════════════════════════════════════════"
echo "Step 2: Moving infrastructure files to infra/"
echo "═══════════════════════════════════════════════════════════════════"
echo ""

# Docker compose files
git_move docker/compose/docker-compose.base.yml infra/docker/docker-compose.base.yml
git_move docker/compose/docker-compose.prod.yml infra/docker/docker-compose.prod.yml
git_move docker/compose/docker-compose.staging.yml infra/docker/docker-compose.staging.yml
git_move docker/compose/docker-compose.staging.dev.yml infra/docker/docker-compose.staging.dev.yml
git_move docker/compose/docker-compose.monitoring.yml infra/docker/docker-compose.monitoring.yml
git_move docker/compose/docker-compose.backup.yml infra/docker/docker-compose.backup.yml
git_move docker/compose/docker-compose.dev.yml infra/docker/docker-compose.dev.yml
git_move docker/compose/docker-compose.override.yml infra/docker/docker-compose.override.yml
git_move docker/compose/docker-compose.staging.ghcr.yml infra/docker/docker-compose.staging.ghcr.yml
git_move docker/compose/docker-compose.staging.pull.yml infra/docker/docker-compose.staging.pull.yml

# Caddy configs
git_move docker/caddy/Caddyfile infra/caddy/Caddyfile

# PgBouncer configs
git_move pgbouncer/pgbouncer.ini infra/pgbouncer/pgbouncer.ini
git_move pgbouncer/userlist.txt infra/pgbouncer/userlist.txt

# Monitoring configs
git_move monitoring/prometheus.yml infra/monitoring/prometheus.yml
if [ -d "monitoring/grafana" ]; then
    git_move monitoring/grafana infra/monitoring/grafana
fi

# Backup scripts
git_move backup/backup.sh infra/backup/backup.sh
git_move backup/restore.sh infra/backup/restore.sh
git_move backup/restore-test.sh infra/backup/restore-test.sh
git_move backup/Dockerfile infra/backup/Dockerfile
echo ""

# ── STEP 3: MOVE ENVIRONMENT FILES ───────────────────────────────────────────
echo "═══════════════════════════════════════════════════════════════════"
echo "Step 3: Moving environment file templates to envs/"
echo "═══════════════════════════════════════════════════════════════════"
echo ""

git_move .env.production.example envs/.env.production.example
git_move .env.staging.example envs/.env.staging.example
git_move .env.backup.example envs/.env.backup.example
git_move .env.monitoring.example envs/.env.monitoring.example
echo ""

# ── STEP 4: MOVE SCRIPTS ───────────────────────────────────────────────────
echo "═══════════════════════════════════════════════════════════════════"
echo "Step 4: Moving scripts to scripts/"
echo "═══════════════════════════════════════════════════════════════════"
echo ""

# Root scripts
git_move backup-full.sh scripts/backup-full.sh
git_move QUICK_START.sh scripts/QUICK_START.sh
git_move migrate-rls-services.sh scripts/migrate-rls-services.sh
git_move run_all_migrations.sh scripts/run_all_migrations.sh
git_move run_migrations_as_postgres.sh scripts/run_migrations_as_postgres.sh
git_move ecosystem.config.cjs scripts/ecosystem.config.cjs

# scripts/ directory scripts
git_move scripts/backup-all.sh scripts/backup-all.sh 2>/dev/null || true
git_move scripts/backup-database-from-remote.sh scripts/backup-database-from-remote.sh
git_move scripts/backup-database-server.sh scripts/backup-database-server.sh
git_move scripts/backup-database.sh scripts/backup-database.sh
git_move scripts/backup-minio.sh scripts/backup-minio.sh
git_move scripts/backup-uploads.sh scripts/backup-uploads.sh
git_move scripts/build-staging-local.sh scripts/build-staging-local.sh
git_move scripts/deploy-staging-to-server.sh scripts/deploy-staging-to-server.sh
git_move scripts/README-staging-deploy.md scripts/README-staging-deploy.md
git_move scripts/restore-database-remote.sh scripts/restore-database-remote.sh
git_move scripts/setup-secrets.sh scripts/setup-secrets.sh

# Delete duplicate backup-all.sh (from scripts/)
if [ -f "scripts/backup-all.sh" ] && [ -f "scripts/backup-full.sh" ]; then
    delete_item scripts/backup-all.sh
fi
echo ""

# ── STEP 5: MOVE DOCUMENTATION ───────────────────────────────────────────
echo "═══════════════════════════════════════════════════════════════════"
echo "Step 5: Moving documentation to docs/"
echo "═══════════════════════════════════════════════════════════════════"
echo ""

# Root documentation
git_move DATABASE_SCHEMA_COMPLETE.md docs/DATABASE_SCHEMA_COMPLETE.md
git_move AI_FIX_PROMPT.md docs/AI_FIX_PROMPT.md
git_move all_tables.txt docs/all_tables.txt
git_move muhasebe_db_migration_prompt.md docs/muhasebe_db_migration_prompt.md
git_move muhasebe_standardisation_prompt.md docs/muhasebe_standardisation_prompt.md
git_move RLS_SERVICE_MIGRATION_COMPLETION_REPORT.md docs/RLS_SERVICE_MIGRATION_COMPLETION_REPORT.md
git_move rls_middleware_example.ts docs/rls_middleware_example.ts

# Documentation from docker/compose/
git_move docker/compose/PRODUCTION_DEPLOYMENT_GUIDE.md docs/PRODUCTION_DEPLOYMENT_GUIDE.md
git_move docker/compose/MONITORING_DEPLOYMENT_GUIDE.md docs/MONITORING_DEPLOYMENT_GUIDE.md
git_move docker/compose/CADDY_MONITORING_CONFIG.md docs/CADDY_MONITORING_CONFIG.md
git_move docker/compose/README.dev.md docs/README.dev.md
echo ""

# ── STEP 6: CLEANUP OLD DIRECTORIES ───────────────────────────────────────
echo "═══════════════════════════════════════════════════════════════════"
echo "Step 6: Cleaning up old directories"
echo "═══════════════════════════════════════════════════════════════════"
echo ""

# Remove old directories (if empty)
for dir in docker/compose docker/caddy docker backup pgbouncer monitoring; do
    if [ -d "$dir" ] && [ -z "$(ls -A $dir 2>/dev/null)" ]; then
        delete_item "$dir"
    fi
done
echo ""

# ── STEP 7: WARN ABOUT LEGACY ARCHIVE ───────────────────────────────────────
echo "═══════════════════════════════════════════════════════════════════"
echo "Step 7: Legacy archive handling"
echo "═══════════════════════════════════════════════════════════════════"
echo ""

if [ -d "_legacy_archive" ]; then
    log WARN "_legacy_archive/ → Move to separate repository manually!"
    log WARN "Do NOT include _legacy_archive/ in new structure"
    echo ""
    echo "  ⚠️  _legacy_archive/ directory was not moved."
    echo "  ⚠️  Please move it to a separate archive repository."
    echo "  ⚠️  Example: git archive --format tar.gz --output legacy-archive.tar.gz _legacy_archive"
    echo ""
fi

# ── SUMMARY ─────────────────────────────────────────────────────────────────────
echo "═══════════════════════════════════════════════════════════════════"
echo "Migration Summary"
echo "═══════════════════════════════════════════════════════════════════"
echo ""
echo "📊 Statistics:"
echo "  Files moved:   $MOVED_FILES"
echo "  Dirs created:  $CREATED_DIRS"
echo "  Files deleted: $DELETED_FILES"
echo "  Items skipped: $SKIPPED_FILES"
echo ""

if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}[DRY-RUN MODE]${NC} No changes were made."
    echo ""
    echo "To execute migration, run:"
    echo "  ./migrate-structure.sh"
else
    echo -e "${GREEN}[SUCCESS]${NC} Migration completed!"
    echo ""
    echo "📝 Next steps:"
    echo "  1. Update .gitignore with new paths"
    echo "  2. Update docker-compose.yml path references"
    echo "  3. Update Makefile path references"
    echo "  4. Delete nginx/ directory (unused)"
    echo "  5. Delete tmp/, build.log, dist-staging-images/ (if any)"
    echo "  6. Delete secrets/ directory (CRITICAL SECURITY!)"
    echo "  7. Delete docker/compose/*.bak-* backup files"
    echo "  8. Commit changes: git commit -m 'chore: reorganize to enterprise monorepo'"
    echo ""
fi

echo "═══════════════════════════════════════════════════════════════════"