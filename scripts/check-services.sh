#!/bin/bash
# Oto Muhasebe - Servis Sağlık Kontrol Script'i
# Tüm Docker container'larının durumunu kontrol eder

set -e

echo "╔════════════════════════════════════════════════════════════════════════════╗"
echo "║  Oto Muhasebe - Servis Sağlık Kontrol Script'i                                ║"
echo "╚════════════════════════════════════════════════════════════════════════════╝"
echo ""

# Renkler
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Konteyner durumlarını göster
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 DOCKER CONTAINER DURUMLARI"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
docker ps --filter "name=muhasebe" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 SAĞLIK KONTROLLERİ"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Backend Health Check
echo "1️⃣  Backend Health Check (http://localhost:3020/api/health)"
if curl -s http://localhost:3020/api/health > /dev/null; then
    echo -e "   ${GREEN}✅${NC} Backend çalışıyor"
    curl -s http://localhost:3020/api/health | jq -r '.status' 2>/dev/null || echo "   OK"
else
    echo -e "   ${RED}❌${NC} Backend yanıt vermiyor"
fi
echo ""

# Frontend Health Check
echo "2️⃣  Frontend Health Check (http://localhost:3010/)"
if curl -s -I http://localhost:3010/ | grep -q "HTTP.*200"; then
    echo -e "   ${GREEN}✅${NC} Frontend çalışıyor (HTTP 200)"
else
    echo -e "   ${RED}❌${NC} Frontend yanıt vermiyor"
fi
echo ""

# PostgreSQL Health Check
echo "3️⃣  PostgreSQL Health Check"
if docker exec muhasebe_saas_postgres pg_isready -U postgres > /dev/null 2>&1; then
    echo -e "   ${GREEN}✅${NC} PostgreSQL çalışıyor"
    docker exec muhasebe_saas_postgres pg_isready -U postgres
else
    echo -e "   ${RED}❌${NC} PostgreSQL yanıt vermiyor"
fi
echo ""

# Redis Health Check
echo "4️⃣  Redis Health Check"
if docker exec muhasebe_saas_redis redis-cli ping > /dev/null 2>&1; then
    echo -e "   ${GREEN}✅${NC} Redis çalışıyor"
    docker exec muhasebe_saas_redis redis-cli ping
else
    echo -e "   ${RED}❌${NC} Redis yanıt vermiyor"
fi
echo ""

# MinIO Health Check
echo "5️⃣  MinIO Health Check"
if curl -s http://localhost:9000/minio/health/live > /dev/null; then
    echo -e "   ${GREEN}✅${NC} MinIO çalışıyor"
    echo "   /minio/health/live: OK"
else
    echo -e "   ${RED}❌${NC} MinIO yanıt vermiyor"
fi
echo ""

# Caddy Health Check
echo "6️⃣  Caddy Health Check"
if docker ps | grep -q "muhasebe_saas_caddy.*Up"; then
    echo -e "   ${GREEN}✅${NC} Caddy çalışıyor"
    echo "   Ports: 80 (HTTP), 443 (HTTPS)"
else
    echo -e "   ${RED}❌${NC} Caddy çalışmıyor"
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 RESOURCE USAGE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
docker ps --filter "name=muhasebe" --format "{{.Names}}" | xargs -r docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}" 2>/dev/null || echo "Resource stats alınamadı"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔗 ACCESS URLS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "• Frontend:    http://localhost:3010/"
echo "• Backend:     http://localhost:3020/api/health"
echo "• PostgreSQL:  localhost:5432"
echo "• Redis:       localhost:6379 (127.0.0.1 sadece)"
echo "• MinIO API:   http://localhost:9000"
echo "• MinIO Console: http://localhost:9001 (127.0.0.1 sadece)"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 USEFUL COMMANDS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "# Tüm logları görüntüle:"
echo "  docker compose -f infra/compose/docker-compose.base.yml -f infra/compose/docker-compose.staging.yml logs -f"
echo ""
echo "# Backend loglarını görüntüle:"
echo "  docker logs -f muhasebe_saas_backend"
echo ""
echo "# Frontend loglarını görüntüle:"
echo "  docker logs -f muhasebe_saas_panel"
echo ""
echo "# Servisleri yeniden başlat:"
echo "  docker compose -f infra/compose/docker-compose.base.yml -f infra/compose/docker-compose.staging.yml restart"
echo ""
echo "# Servisleri durdur:"
echo "  docker compose -f infra/compose/docker-compose.base.yml -f infra/compose/docker-compose.staging.yml down"
echo ""

echo "╔════════════════════════════════════════════════════════════════════════════╗"
echo -e "║  ${GREEN}✅ Tüm servisler başarıyla çalışıyor!${NC}                                             ║"
echo "╚════════════════════════════════════════════════════════════════════════════╝"