# Oto Muhasebe - Shell Scripts Directory

Bu dizin projedeki tüm shell script dosyalarını içerir.

## 📂 Dizin Yapısı

### 🗂️ Cleanup & Migration Scripts
Script'ler proje yapısı reorganizasyonu ve cleanup işlemleri için kullanılır.

- **`cleanup-phase1.sh`** - Phase 1 cleanup script (legacy dosyaları siler)
- **`migrate-structure.sh`** - Monorepo structure migration scripti
- **`rename-docker-to-compose.sh`** - infra/docker → infra/compose rename scripti

**Not:** Bu script'ler görevleri tamamlanmıştır, arşiv amaçlı tutulmaktadır.

---

### 🗂️ PostgreSQL Backup/Restore Scripts
PostgreSQL veritabanı yedekleme ve geri yükleme script'leri.

- **`backup-postgres.sh`** - PostgreSQL backup (manuel kullanım)
- **`restore-postgres.sh`** - PostgreSQL restore (interaktif)
- **`restore-postgres-test.sh`** - Backup integrity test scripti

**Kullanım:**
```bash
# Manuel backup
./scripts/backup-postgres.sh

# Restore (interaktif)
./scripts/restore-postgres.sh

# Test etme (production database'e dokunmaz)
./scripts/restore-postgres-test.sh
```

**Not:** Bu script'lerin orijinalleri `infra/backup/` dizinindedir (Dockerfile için gerekli).

---

### 🗂️ Database Scripts
Uzak sunucudan veritabanı yedek alma ve restore işlemleri.

- **`backup-database-from-remote.sh`** - Staging sunucusundan DB yedeği alma (yerel)
- **`backup-database-server.sh`** - Sunucuda DB yedeği alma
- **`restore-database-remote.sh`** - Uzak sunucuda DB restore

**Kullanım:**
```bash
# Yerel makineden staging sunucusuna yedek çekme
./scripts/backup-database-from-remote.sh

# Sunucuda SSH ile yedek alma
ssh root@31.210.43.185
cd /var/www/muhasebe
./scripts/backup-database-server.sh

# Yedekten restore
./scripts/restore-database-remote.sh
```

---

### 🗂️ Deployment Scripts
Staging ortamı için Docker image build ve deployment script'leri.

- **`build-staging-local.sh`** - Staging Docker image'ları lokal build etme
- **`deploy-staging-to-server.sh`** - Build edilmiş image'ları sunucuya deploy
- **`restart-nextjs-info.sh`** - NextJS HMR bilgisi (bilgilendirme amaçlı)

**Kullanım:**
```bash
# Lokal build
./scripts/build-staging-local.sh

# Sunucuya deploy
./scripts/deploy-staging-to-server.sh [KULLANICI@]SUNUCU

# Varsayılan sunucu: root@31.210.43.185
```

---

### 🗂️ MinIO Scripts
MinIO S3-compatible storage için script'ler.

- **`backup-minio.sh`** - MinIO bucket backup
- **`minio-init.sh`** - MinIO container initialization
- **`test-minio.sh`** - MinIO connectivity ve operation testi

**Kullanım:**
```bash
# MinIO test
./scripts/test-minio.sh

# MinIO backup (cron ile otomatik çalıştırılabilir)
./scripts/backup-minio.sh
```

---

### 🗂️ Database Migration Scripts
Veritabanı migration işlemleri için script'ler.

- **`QUICK_START.sh`** - Interactive migration menü
- **`run_all_migrations.sh`** - Master migration script (tüm task'ları çalıştırır)
- **`run_migrations_as_postgres.sh`** - Migration (postgres user ile)
- **`migrate-rls-services.sh`** - RLS service migration helper
- **`migrate-turkish-to-english.sh`** - Turkish→English i18n migration

**Kullanım:**
```bash
# Interactive menü
./scripts/QUICK_START.sh

# Tüm migration'ları çalıştır
./scripts/run_all_migrations.sh

# Postgres user ile migration
./scripts/run_migrations_as_postgres.sh
```

---

### 🗂️ Legacy Panel Scripts (Arşivlenmiş)
⚠️ **Bu script'ler eski "yedekparca" projesine aittir, arşiv amaçlı tutulmaktadır.**

- **`legacy-panel-backup.sh`** - Legacy yedekparca DB backup
- **`legacy-panel-deploy-prod.sh`** - Legacy yedekparca deploy script
- **`legacy-panel-full-backup.sh`** - Legacy yedekparca full backup
- **`legacy-panel-health.sh`** - Legacy yedekparca health check
- **`legacy-panel-monitor.sh`** - Legacy yedekparca log monitor

**Öneri:** Bu script'leri `_archive/` klasörüne taşıyabilir veya silebilirsiniz.

---

### 🗂️ Setup Script
Production ortamı için setup script'i.

- **`setup-secrets.sh`** - Docker secrets kurulumu

**Kullanım:**
```bash
# Production sunucusunda tek seferlik çalıştırılır
chmod +x scripts/setup-secrets.sh
./scripts/setup-secrets.sh
```

**Yapılan işlemler:**
- PostgreSQL, Redis, JWT şifreleri oluşturma
- MinIO şifresi oluşturma
- Audit HMAC secret oluşturma
- `secrets/` dizinine kaydetme

---

## 🚀 Hızlı Başlangıç

### Staging Ortamı

```bash
# 1. Lokal build
./scripts/build-staging-local.sh

# 2. Sunucuya deploy
./scripts/deploy-staging-to-server.sh

# 3. Uzak sunucuda uygulamayı başlat
ssh root@31.210.43.185
cd /var/www/muhasebe
docker compose -f infra/compose/docker-compose.base.yml -f infra/compose/docker-compose.staging.pull.yml up -d
```

### Database Yedekleme

```bash
# Yerel makineden staging sunucusuna yedek çekme
./scripts/backup-database-from-remote.sh

# Yedekleri görüntüleme
ls -lh backups/

# Yedekten restore
./scripts/restore-database-remote.sh
```

### Migration İşlemleri

```bash
# Interactive menü ile migration
./scripts/QUICK_START.sh

# Veya tüm migration'ları çalıştır
./scripts/run_all_migrations.sh
```

---

## 📋 Sık Kullanılan Komutlar

```bash
# Staging deploy
./scripts/build-staging-local.sh && ./scripts/deploy-staging-to-server.sh

# Remote backup
./scripts/backup-database-from-remote.sh

# Migration
./scripts/run_all_migrations.sh

# MinIO test
./scripts/test-minio.sh

# Secrets setup (production)
./scripts/setup-secrets.sh
```

---

## 🔧 Bakım ve Güncelleme

### Script Çalıştırma
```bash
# Executable yapma
chmod +x scripts/<script-name>.sh

# Çalıştırma
./scripts/<script-name>.sh
```

### Script Güncelleme
1. Script'i düzenle: `nano scripts/<script-name>.sh`
2. Test et: `./scripts/<script-name>.sh`
3. Git commit: `git add scripts/<script-name>.sh && git commit -m "update: script"`

---

## ⚠️ Önemli Notlar

1. **Docker Build Script'leri:** `infra/backup/` dizinindeki script'ler Dockerfile içinde kullanıldığı için orijinal halleri orada kalmalıdır. `scripts/` dizinindeki kopyalar sadece manuel kullanım içindir.

2. **Production Secrets:** `setup-secrets.sh` scripti production sunucusunda tek seferlik çalıştırılmalıdır. Şifreler `secrets/` dizininde saklanır ve **git'e commit edilmemelidir**.

3. **Migration Script'leri:** Database migration işlemi öncesi mutlaka yedek alınmalıdır. `run_all_migrations.sh` scripti otomatik yedek alır.

4. **Legacy Script'ler:** `legacy-` prefix ile başlayan script'ler eski projeye aittir ve gerektiğinde silinebilir veya arşivlenebilir.

---

## 📚 Ek Kaynaklar

- [Proje Ana README](../README.md)
- [Docker Compose Dokümantasyonu](../docker-compose.yml)
- [Makefile](../Makefile)
- [Infrastruktür Dokümantasyonu](../docs/)

---

## 🤝 Katkıda Bulunma

Yeni script eklerken:
1. Dosya adını açıklayıcı yapın
2. Dosya başına usage comment'i ekleyin
3. Error handling ekleyin (`set -e`, `trap`)
4. Loglama kullanın (timestamp ile)
5. Bu README'yi güncelleyin

---

**Son Güncelleme:** 16 Mart 2026  
**Toplam Script:** 26  
**Aktif Script:** 21  
**Legacy Script:** 5