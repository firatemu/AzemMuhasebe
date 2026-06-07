# 📚 OtoMuhasebe - MCP & Skill Sistemi Özet Raporu

**Tarih:** 22 Mart 2026  
**Hazırlayan:** AI Agent Analysis System  
**Versiyon:** 1.0

---

## İçerik Özeti

Bu rapor, OtoMuhasebe projesindeki **referans belgeleri**, **MCP sunucularını** ve **skill yeteneklerini** inceleyerek oluşturulmuştur.

---

## 1. İNCELEDİĞİNİZ DOSYALAR

### 📄 AI_AGENT_KNOWLEDGE_BASE.md
**Durum:** ✅ Mevcut (1.299 satır)

Bu belge, AI ajanları için yaşayan bir teknik referanstır:

```
📋 İçerik Kategorileri:
├── Proje Özeti (POS, Fatura, Stok yönetimi)
├── Tech Stack (NestJS, Next.js, PostgreSQL, Redis, MinIO)
├── Mimari (Multi-tenant RLS, $transaction, middleware)
├── Klasör Yapısı (Backend 70+ modül, Frontend Next.js)
├── Docker Deployment (compose, networking, ports)
├── API Endpoints (/api/invoices, /api/pos, /api/accounts vb.)
├── Frontend Patterns (Zustand stores, TanStack Query)
├── POS Sistemi Detayları (UI bileşenleri, payment flow)
├── Kodlama Standartları (TypeScript, React, NestJS patterns)
└── Geliştirme Akışı (Setup, branching, deployment)
```

**Kişisel Not:** Bu belge **production AI agents** için optimize edilmiş, hallüsinasyon riski minimize edilmiş.

---

### 📊 OtoMuhasebe_Teknik_Rapor.docx.md
**Durum:** ✅ Mevcut (460 satır, profesyonel rapor formatında)

Kapsamlı teknik evaluasyon:

```
🔍 Fокус Alanları:
├── Technology Stack Matrix (Backend/Frontend/DevOps tablolar)
├── Sistem Mimarisi (Request flow, layer diagram)
├── Database Yapısı (144 Prisma model, 60+ enum, RLS)
├── Security & Auth (JWT, bcrypt, Helmet, rate limiting)
├── Transaction Management ($transaction 20+ location)
├── State Machines (WorkOrder referans kalitesi, Invoice gap)
├── Test Coverage (5 spec mevcut, altyapı eksik)
├── Bilinen Sorunlar (P1/P2/P3 aksiyon listesi)
├── ChatGPT Yanılgıları vs Gerçeklik Karşılaştırması
├── Production Deployment Checklist (23 madde)
└── AI Agent Profesyonel Prompt Template
```

**Önemli:** Bu rapor **ChatGPT'nin yaptığı hataları** düzeltmiştir:
- ❌ "$transaction yok" → ✅ "20+ yerde var"
- ❌ "Rate limiting yok" → ✅ "@nestjs/throttler aktif"
- ❌ "Test framework yok" → ✅ "Jest setup var, CLI command eksik"

---

## 2. MCP (Model Context Protocol) SERVİSLERİ

### 🌐 cursor-ide-browser
```
📍 Konumu: /home/azem/.cursor/projects/home-azem-projects-otomuhasebe/mcps/cursor-ide-browser/
Identifier: cursor-ide-browser
Durum: ✅ Kurulu ve hazır
```

**Yetenekler:**
- ✅ Web Automation (navigate, click, type, hover)
- ✅ Element Interaksiyon (querySelector, event firing)
- ✅ Form Doldurma (text input, select, checkbox)
- ✅ Screenshots & Profiling (CPU, network analysis)
- ✅ Canvas Rendering (HTML/SVG/Three.js)
- ✅ Tab Management & Dialog Handling

**Kullanım Senaryoları:**
```
1. Frontend UI Testleri: POS sayfası, invoice form, login
2. E2E Senaryolar: Tam satış akışı testi
3. Performance Analysis: Slow rendering detection
4. Cross-browser Testing: Responsive design kontrol
5. Visual Regression: Screenshot karşılaştırma
```

---

## 3. SKILL DOSYALARI (Yetenek Modülleri)

Sistemde **6 hazır skill dosyası** mevcuttur:

| # | Skill | Path | Amaç |
|---|-------|------|------|
| 1 | **create-rule** | ~/.cursor/skills-cursor/create-rule/SKILL.md | .cursor/rules/ dosya oluşturma |
| 2 | **create-skill** | ~/.cursor/skills-cursor/create-skill/SKILL.md | Yeni skill yazımı (bu belge gibi) |
| 3 | **update-cursor-settings** | ~/.cursor/skills-cursor/update-cursor-settings/SKILL.md | settings.json modifikasyonu |
| 4 | **migrate-to-skills** | ~/.cursor/skills-cursor/migrate-to-skills/SKILL.md | Eski format → skill formatı |
| 5 | **create-subagent** | ~/.cursor/skills-cursor/create-subagent/SKILL.md | Sub-agent orchestration |
| 6 | **shell** | ~/.cursor/skills-cursor/shell/SKILL.md | Shell command execution |

### 🎓 Skill Yazımı Best Practices

```markdown
SKILL.md Template:
---
name: lowercase-with-hyphens
description: Clear 3rd person description (WHAT + WHEN)
---

# Title

## Instructions
Step-by-step guidance

## Examples
Concrete use cases

## Resources
- reference.md (detailed docs)
- examples.md (sample outputs)
```

**Önemli Kurallar:**
- ✅ `name`: max 64 char, lowercase+hyphens
- ✅ `description`: Hem WHAT (ne yapar) hem WHEN (ne zaman) içermeli
- ✅ Body: max 500 satır (progressive disclosure)
- ✅ File references: Bir level derinliğinde

---

## 4. PROJE STANDARTLARI & KURALLARI

### 🎯 Always-Applied Workspace Rules

Proje **11 ana rule dosyası** içerir (.cursor/rules/*.mdc):

```
├── testing-strategy.mdc        # Jest, Prisma mocks, E2E
├── agents.mdc                  # Agent orchestration
├── typescript-style.mdc        # NestJS, Next.js typing
├── api-design.mdc              # DTOs, REST compliance, tenant isolation
├── ui-premium-design.mdc       # Design tokens, micro-animations
├── database-expert.mdc         # Prisma patterns, RLS, soft delete
├── architecture-decisions.mdc  # ADR format
├── git-agent-workflow.mdc      # Conventional commits
├── error-diagnostics.mdc       # Exception handling
├── security-audit.mdc          # Tenant isolation, JWT, input sanitization
├── research-first.mdc          # No assumptions, deep discovery
├── performance-vitals.mdc      # Pagination, indexing, caching
├── erp-core-logic.mdc          # FIFO, weighted average, transactions
└── AGENTS.md                   # UI/Styling/POS standartları (2+ sayfası)
```

### 📋 Backend İçin Zorunlu Kontroller

```typescript
// ✅ YAPILMASI GEREKEN:

// 1. tenantId ZORUNLU
const users = await this.prisma.user.findMany({
  where: { tenantId, deletedAt: null }  // ← HER ZAMAN
});

// 2. Multi-table işlemlerde $transaction
await this.prisma.$transaction(async (tx) => {
  await tx.invoice.create({...});
  await tx.accountMovement.create({...});
  await tx.stockMovement.create({...});
});

// 3. Doğru error handling
if (!found) throw new NotFoundException('Item not found');
if (exists) throw new ConflictException('Already exists');

// 4. Logger kullanımı
this.logger.log('Operation completed', { tenantId, userId });
```

### 🎨 Frontend İçin Zorunlu Kontroller

```typescript
// ✅ CSS Tokens (hardcode HEX YASAK!)
<Box sx={{
  background: 'var(--card)',        // ✅ Token
  border: '1px solid var(--border)', // ✅ Token
  color: 'var(--foreground)'        // ✅ Token
}}>

// ✅ Responsive Design (xs dahil)
<Grid2 container size={{ xs: 12, sm: 6, md: 4 }}>

// ✅ Zustand for state
const { cartItems, addItem } = usePosStore();

// ✅ TanStack Query for fetching
const { data, isLoading } = useQuery({
  queryKey: ['invoices', filters],
  queryFn: () => fetchInvoices(filters)
});

// ✅ Error handling
try {
  await api.post('/items', data);
  toast.success('Created');
} catch (error) {
  toast.error(error.response?.data?.message);
}
```

---

## 5. KRİTİK SORUNLAR & EKSIKLER

### 🔴 P1 - ACIL (Haftası içinde çöz)

| # | Sorun | Etki | Çözüm |
|---|-------|------|-------|
| 1 | Invoice state machine yok VALID_STATUS_TRANSITIONS | CANCELLED → APPROVED mümkün (veri hata) | WorkOrder pattern'ı kopyala |
| 2 | MinIO /tmp/minio-data (ephemeral) | Container restart'ta logolar kaybolur | Volume: ./infra/data/minio |
| 3 | next.config.ts: ignoreBuildErrors=true | TypeScript hataları production'a gider | false yapıp test et |

### 🟡 P2 - ÖNEMLİ (Bu hafta)

| # | Sorun | Etki | Çözüm |
|---|-------|------|-------|
| 1 | getNextCode() $transaction dışında | Race condition (POS/invoice) | Sequence yap veya atomic al |
| 2 | Test altyapısı setup'ı yok | Mevcut 5 spec çalıştırılamıyor | jest.config.ts, package.json |
| 3 | BullMQ retry/dead letter yok | Redis crash'te işler kaybolur | Konfigürasyon ekle |

---

## 6. HIZLI REFERANS TABLOSU

### Teknoloji Stack Versiyonları
```
BACKEND:
├── NestJS 11.1.8
├── TypeScript 5.9.3
├── Prisma 6.18.0
├── PostgreSQL 16 Alpine
├── Redis 7 Alpine
└── Node 20 Alpine

FRONTEND:
├── Next.js 16.0.1
├── React 19.2.0
├── MUI 7.3.7
├── Zustand 5.0.8
├── TanStack Query 5.90.6
└── Node 20
```

### Port Mappings
```
Frontend (Next.js):        3010 (ext) → 3000 (int)
Backend (NestJS):          3020 (ext) → 3000 (int)
PostgreSQL:                5433 (ext) → 5432 (int)
Redis:                     6379 (internal only)
MinIO API:                 9000 | Console: 9001
Caddy (Reverse Proxy):     80, 443
```

### Komut Hızlı Erişim
```bash
# Start everything
cd infra/compose
docker compose -f docker-compose.staging.yml up -d

# View logs
docker logs otomuhasebe_saas_backend -f

# Database studio
npx prisma studio

# Seed data
docker exec otomuhasebe_saas_backend npm run seed

# SSH into backend
docker exec -it otomuhasebe_saas_backend bash
```

---

## 7. ENTEGRASYON HARITASI

```
┌─────────────────────────────────────────────────────────────┐
│                      OTOMUHASEBE SaaS                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Frontend (Next.js)                Backend (NestJS)         │
│  ├─ Auth Pages             ↔       ├─ JWT Auth             │
│  ├─ Invoice Forms                  ├─ 70+ Modules          │
│  ├─ POS Screen                     ├─ Prisma ORM           │
│  └─ Reports/Dashboard              └─ $transaction Logic   │
│                                                               │
│         ↓                                    ↓                │
│                                                               │
│  ┌──────────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │ PostgreSQL   │  │  Redis   │  │  MinIO   │  │ İyzico  │ │
│  │ (Primary DB) │  │ (Session)│  │(Storage) │  │(Payment)│ │
│  │ RLS Active   │  │  Queue   │  │ S3-compat│  │ SaaS    │ │
│  └──────────────┘  └──────────┘  └──────────┘  └─────────┘ │
│                                                               │
│  BullMQ Background Jobs:                                     │
│  ├─ PDF Generation (pdfmake)                                │
│  ├─ Email Notifications (nodemailer)                        │
│  ├─ Excel Export (exceljs)                                  │
│  └─ E-Fatura Integration (GİB ready)                        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. PROJEYLE ÇALIŞMA KILAVUZu

### Yeni Feature Ekleme Akışı

```mermaid
1. Gereksinimleri oku
   ↓
2. AI_AGENT_KNOWLEDGE_BASE.md → Mimari anla
   ↓
3. AGENTS.md → UI standartları kontrol
   ↓
4. .cursor/rules/ → Kodlama kuralları gözden geçir
   ↓
5. Backend Feature
   ├─ Prisma schema update (tenantId, soft delete)
   ├─ Migration: npx prisma migrate dev --name feature_name
   ├─ Service: $transaction ile multi-table işlemler
   ├─ Controller: DTO validation, auth guard
   └─ Test: .spec.ts dosya yaz
   ↓
6. Frontend Feature
   ├─ Zustand store (state management)
   ├─ TanStack Query (fetching, caching)
   ├─ MUI Components (responsive, tokens)
   └─ Error boundary, loading states
   ↓
7. Docker test
   ├─ docker compose rebuild
   ├─ API test (Swagger /api-docs)
   └─ UI test (localhost:3010)
   ↓
8. Commit: git commit -m "feat: description"
```

### Bug Çözme Akışı

```
1. Error message oku
2. Docker logs: docker logs otomuhasebe_saas_backend
3. OtoMuhasebe_Teknik_Rapor.md → Bilinen sorunlar
4. Mevcut spec'leri çalıştır
5. State machine kurallarını doğrula
6. Denetim: tenantId, $transaction, error handling
7. Test: Scenario oluştur ve tekrarla
```

---

## 9. DOKÜMANTASYON KALİTE RAPORU

| Metrik | Skor | Detay |
|--------|------|-------|
| **Bütünlük** | 9/10 | Sistem bileşenleri tamamen kapsamlı |
| **Güncellik** | 8/10 | 19 Mart 2026 tarihli, V2 optimizasyonu |
| **Kullanılabilirlik** | 9/10 | Yapılandırılmış nav, quick reference |
| **Teknik Derinlik** | 9/10 | RLS, $transaction, state machines detaylı |
| **Kodlama Örnekleri** | 8/10 | Pattern'lar var, E2E test örneği az |
| **Maintenance** | 7/10 | Manual update gerekli, otomasyonsuz |

**Yapılacak Iyileştirmeler:**
- [ ] E2E test örnekleri ekle (Playwright)
- [ ] Database query optimization guide'ı yaz
- [ ] Performance profiling runbook
- [ ] Disaster recovery procedure
- [ ] Automated documentation update (CI/CD)

---

## 10. SONUÇ & ÖNERİLER

### ✨ Proje Güçlü Yönleri
- ✅ **Multi-tenant Security:** 3-katman (app, middleware, RLS)
- ✅ **Enterprise-Grade Backend:** 144 model, $transaction patterns
- ✅ **Modern Frontend:** Next.js + MUI + Zustand
- ✅ **Comprehensive Rules:** 11+ rule dosyası, AI optimization
- ✅ **Production Ready:** Docker, Caddy, SSL terraform

### 🎯 Tavsiyeler
1. **P1 Sorunları Çöz:** Invoice state machine, MinIO, next.config
2. **Test Altyapısını Kur:** jest.config.ts, CI/CD hooks
3. **Belgeleri Otomatikleştir:** API docs sync, schema exports
4. **Skill Kütüphanesini Genişlet:** Proje-özel workflow skills
5. **Monitoring Ekle:** Error tracking, performance monitoring

### 🚀 İlk 24 Saatlik Aksiyon
```
HOUR 1-2: P1 sorunları oku, neden-etki anla
HOUR 3-4: Invoice state machine fix (2 saat)
HOUR 5-6: MinIO volume düzelt (30 min)
HOUR 7-8: Test setup kur (jest.config.ts)
HOUR 9-24: P2 sorunları ve yeni features
```

---

## 📚 Referanslar

| Belge | Satır | Kapsam |
|-------|-------|--------|
| AI_AGENT_KNOWLEDGE_BASE.md | 1,299 | Teknik referans, best practices |
| OtoMuhasebe_Teknik_Rapor.md | 460 | Evaluasyon, sorunlar, checklist |
| AGENTS.md | 500+ | UI/Styling standards, POS spec |
| .cursor/rules/ | 11 files | Coding standards |
| MCP: cursor-ide-browser | - | Web automation, UI testing |
| 6 Skill Files | - | Yetenek modülleri |

---

## 📞 Hızlı İletişim

**Acil Sorular:**
- TenantId kontrolü → `.cursor/rules/security-audit.mdc`
- UI renkleri → `AGENTS.md` bölüm 1
- Transaction pattern → `OtoMuhasebe_Teknik_Rapor.md` bölüm 7
- POS özellikleri → `AI_AGENT_KNOWLEDGE_BASE.md` bölüm 9

---

**Son Güncelleme:** 22 Mart 2026  
**Hazırlandı:** AI Agent Analysis System  
**Durum:** ✅ Hazır - Proje Geliştirme İçin Kullanılabilir
