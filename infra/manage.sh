#!/bin/bash

# Muhasebe konteyner yönetimi (yalnızca muhasebe_net — AzemTarim bağımlılığı yok)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_DIR="$SCRIPT_DIR/compose"
COMPOSE_PROJECT="muhasebe"
ENV_FILE="$COMPOSE_DIR/.env.staging"
COMPOSE=(docker compose --project-name "$COMPOSE_PROJECT" --env-file "$ENV_FILE" -f docker-compose.dev.yml)

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

show_status() {
    log_info "Konteyner durumu:"
    docker ps --filter "name=muhasebe_" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
}

# Eski / yanlış compose projesinden kalan backend konteynerini temizle
ensure_backend_container() {
    if ! docker ps -a --format '{{.Names}}' | grep -qx muhasebe_backend; then
        return 0
    fi
    local proj
    proj=$(docker inspect muhasebe_backend --format '{{index .Config.Labels "com.docker.compose.project"}}' 2>/dev/null || true)
    if [ "$proj" != "$COMPOSE_PROJECT" ]; then
        log_warn "muhasebe_backend farklı projede ($proj); yeniden oluşturulacak."
        docker rm -f muhasebe_backend 2>/dev/null || true
    fi
}

start_caddy() {
    log_info "Caddy başlatılıyor (muhasebe_caddy)..."
    cd "$COMPOSE_DIR"
    "${COMPOSE[@]}" up -d caddy
}

start_containers() {
    log_info "Konteynerler başlatılıyor..."
    cd "$COMPOSE_DIR"
    ensure_backend_container
    "${COMPOSE[@]}" up -d
    log_info "Konteynerler başarıyla başlatıldı!"
    log_info "Panel:  https://muhasebe.localhost  (veya http://127.0.0.1:3140)"
    log_info "API:    https://api.muhasebe.localhost  (veya http://127.0.0.1:3120/api/health)"
    show_status
}

stop_containers() {
    log_info "Konteynerler durduruluyor..."
    cd "$COMPOSE_DIR"
    "${COMPOSE[@]}" down
    log_info "Konteynerler durduruldu."
}

restart_containers() {
    log_info "Konteynerler yeniden başlatılıyor..."
    cd "$COMPOSE_DIR"
    "${COMPOSE[@]}" restart
    show_status
}

rebuild_containers() {
    log_info "Konteynerler yeniden build ediliyor..."
    cd "$COMPOSE_DIR"
    ensure_backend_container
    "${COMPOSE[@]}" up -d --build
    log_info "Build tamamlandı."
    show_status
}

rebuild_backend() {
    log_info "Backend imajı build ediliyor..."
    cd "$COMPOSE_DIR"
    ensure_backend_container
    "${COMPOSE[@]}" build backend
    "${COMPOSE[@]}" up -d --no-deps --force-recreate backend
    log_info "Backend hazır olana kadar bekleniyor..."
    local i=0
    while [ $i -lt 60 ]; do
        if curl -sf http://localhost:3120/api/health >/dev/null 2>&1; then
            log_info "Backend hazır (health OK)."
            break
        fi
        sleep 2
        i=$((i + 1))
    done
    if [ $i -ge 60 ]; then
        log_warn "Health check zaman aşımı — ./manage.sh logs backend"
    fi
    show_status
}

show_logs() {
    local service=$1
    if [ -z "$service" ]; then
        cd "$COMPOSE_DIR"
        "${COMPOSE[@]}" logs -f --tail=100
    else
        docker logs -f --tail=100 "muhasebe_${service}"
    fi
}

show_help() {
    cat << EOF
Muhasebe konteyner yönetimi

Kullanım: ./manage.sh [KOMUT]

Komutlar:
    start           Tüm servisleri başlat (postgres, redis, minio, backend, panel, caddy)
    start-caddy     Sadece Caddy reverse proxy
    stop            Tüm servisleri durdur
    restart         Yeniden başlat
    rebuild         Tüm imajları build et ve başlat
    rebuild-backend Sadece API imajını build et ve yeniden başlat
    status          Durum
    logs [servis]   Loglar (backend, panel, caddy, postgres, redis, minio)
    help            Bu mesaj

Örnek: ./manage.sh rebuild-backend
EOF
}

case "$1" in
    start) start_containers ;;
    start-caddy) start_caddy ;;
    stop) stop_containers ;;
    restart) restart_containers ;;
    rebuild) rebuild_containers ;;
    rebuild-backend) rebuild_backend ;;
    status) show_status ;;
    logs) show_logs "$2" ;;
    help|--help|-h) show_help ;;
    *)
        log_error "Geçersiz komut: $1"
        show_help
        exit 1
        ;;
esac
