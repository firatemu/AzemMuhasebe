# OtoMuhasebe Altyapı Dokümantasyonu

Bu dizin, OtoMuhasebe uygulamasının Docker konteynerleri için tüm yapılandırma dosyalarını içerir.

## 📁 Dizin Yapısı

```
infra/
├── compose/              # Docker Compose yapılandırma dosyaları
│   ├── docker-compose.base.yml      # Temel servisler (postgres, redis, minio, caddy)
│   ├── docker-compose.staging.yml   # Staging ortam servisleri (backend, panel)
│   ├── docker-compose.dev.yml       # Geliştirme ortamı
│   ├── docker-compose.prod.yml       # Prodüksiyon ortamı
│   └── .env.staging               # Staging ortam çevre değişkenleri
├── caddy/               # Caddy reverse proxy yapılandırması
├── pgbouncer/           # PgBouncer yapılandırması
├── data/                # Kalıcı veri depolama
│   └── postgres/        # PostgreSQL verileri
├── backup/              # Yedekleme script'leri
├── monitoring/          # Monitoring araçları (Prometheus, Grafana)
└── manage.sh            # Kolay yönetim script'i
```

## 🚀 Hızlı Başlangıç

### 1. Yönetim Script'i Kullanımı

En kolay yol, `manage.sh` script'ini kullanmaktır:

```bash
# Konteynerleri başlat
./manage.sh start

# Konteynerleri durdur
./manage.sh stop

# Konteynerleri yeniden başlat
./manage.sh restart

# Konteynerleri yeniden build et ve başlat
./manage.sh rebuild

# Durumu kontrol et
./manage.sh status

# Logları izle
./manage.sh logs backend      # Sadece backend logları
./manage.sh logs panel        # Sadece panel logları
./manage.sh logs              # Tüm konteyner logları
```

### 2. Manuel Kullanım

```bash
# Staging ortamını başlat
cd compose
docker compose -f docker-compose.staging.yml -f docker-compose.base.yml up -d

# Konteynerleri durdur
docker compose -f docker-compose.staging.yml -f docker-compose.base.yml down

# Konteynerleri yeniden build et
docker compose -f docker-compose.staging.yml -f docker-compose.base.yml up -d --build
```

## 🔄 Otomatik Başlatma (Systemd)

Tüm konteynerler `unless-stopped` restart policy ile konfigüre edilmiştir. Bu sayede:

1. **Docker Desktop başladığında**: Konteynerler otomatik olarak başlar
2. **Sunucu yeniden başladığında**: Docker servisi başladığında konteynerler otomatik olarak başlar
3. **El ile durdurulduğunda**: Konteynerler çalışmaya devam eder (sadece kapatmak için `docker stop` kullanılmalı)

### Systemd Service (Opsiyonel)

Ek olarak, bir systemd servisi oluşturabilirsiniz:

```bash
# /etc/systemd/system/muhasebe.service
[Unit]
Description=OtoMuhasebe Docker Containers
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/azem/projects/muhasebe/infra
ExecStart=/home/azem/projects/muhasebe/infra/manage.sh start
ExecStop=/home/azem/projects/muhasebe/infra/manage.sh stop
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Servisi aktifleştirin:
```bash
sudo systemctl enable muhasebe
sudo systemctl start muhasebe
```

## 🌐 Port Mapping

| Servis | Container Port | Host Port | URL |
|--------|---------------|-----------|-----|
| Panel (Next.js) | 3000 | 3010 | http://localhost:3010 |
| Backend (NestJS) | 3000 | 3020 | http://localhost:3020 |
| PostgreSQL | 5432 | 5433 | postgresql://postgres:pass@localhost:5433 |
| Redis | 6379 | 6379 | redis://localhost:6379 |
| MinIO API | 9000 | 9000 | http://localhost:9000 |
| MinIO Console | 9001 | 9001 | http://localhost:9001 |
| Caddy | 80, 443 | 80, 443 | http://localhost, https://localhost |

## 📊 Servis Durumu

Tüm servislerin durumu:

```bash
docker ps --filter "name=muhasebe_saas_"
```

Sağlık kontrolleri:
- Backend: `/api/health` endpoint'i üzerinden kontrol edilir
- PostgreSQL: `pg_isready` komutu ile kontrol edilir
- Redis: `redis-cli ping` komutu ile kontrol edilir
- MinIO: HTTP health check ile kontrol edilir

## 🔧 Çevre Değişkenleri

Çevre değişkenleri `compose/.env.staging` dosyasında tanımlıdır. Değişkenleri düzenlemek için:

```bash
cd compose
nano .env.staging
```

Önemli değişkenler:
- `DATABASE_URL`: PostgreSQL bağlantı bilgisi
- `REDIS_URL`: Redis bağlantı bilgisi
- `MINIO_ENDPOINT`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`: MinIO yapılandırması
- `JWT_SECRET`: JWT token imzalama anahtarı
- `CORS_ORIGINS`: İzin verilen origin'ler

## 🗄️ Veri Kalıcılığı

Tüm veriler kalıcı olarak saklanır:

- **PostgreSQL**: `data/postgres/` dizininde
- **Redis**: `redis_data` Docker volume'unda
- **Caddy**: `caddy_data` ve `caddy_config` Docker volume'larında
- **MinIO**: `/tmp/minio-data/` dizininde

## 📝 Yedekleme

Yedekleme script'leri `backup/` dizininde bulunur:

```bash
# PostgreSQL yedeği al
./backup/backup.sh

# Yedeği geri yükle
./backup/restore.sh backup-file.sql
```

## 🐛 Sorun Giderme

### Konteyner Başlamıyor

1. Logları kontrol et:
```bash
./manage.sh logs [servis-adı]
```

2. Docker disk alanını kontrol et:
```bash
docker system df
```

3. Docker temizle:
```bash
docker system prune -a
```

### Port Çakışması

Eğer port çakışması yaşanıyorsanız, docker-compose dosyasındaki port mapping'i değiştirin:

```yaml
ports:
  - "YENI_PORT:CONTAINER_PORT"
```

### Bağlantı Sorunları

Network'ün varlığını kontrol et:
```bash
docker network ls | grep muhasebe_saas_net
```

Network yoksa, create edin:
```bash
docker network create muhasebe_saas_net
```

## 🔄 Güncelleme

Konteynerleri güncellemek için:

```bash
# İmajları çek
docker compose pull

# Konteynerleri yeniden başlat
./manage.sh restart
```

Veya tam rebuild:
```bash
./manage.sh rebuild
```

## 📚 Ek Kaynaklar

- [Docker Compose Dokümantasyonu](https://docs.docker.com/compose/)
- [Dockerfile Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Next.js Docker Deployment](https://nextjs.org/docs/deployment)
- [NestJS Docker Deployment](https://docs.nestjs.com/recipes/docker)

## 🆘 Destek

Sorun yaşarsanız:
1. Logları kontrol edin: `./manage.sh logs`
2. Konteyner durumunu kontrol edin: `./manage.sh status`
3. GitHub issues sayfasına raporlayın