# MODULE CONTEXT MAP — Muhasebe

**Proje:** Muhasebe  
**Kapsam:** Görev türüne göre okunacak Cursor rule, workflow, skill ve proje dosyaları haritası  
**Stack:** NestJS + Next.js App Router + Prisma + PostgreSQL + shadcn/ui + MUI X DataGrid  
**Son Güncelleme:** 31 Mayıs 2026

> Bu dosya AI agent’ın gereksiz tüm projeyi okumadan doğru bağlamı bulmasını sağlar. Agent her görevde önce görev türünü belirler, sonra bu haritaya göre ilgili dosyaları okur.

---

## 1. Ana Kullanım Kuralı

Agent her görevde şu sırayı izler:

```txt
1. Görev türünü belirle
2. Bu dosyadaki ilgili başlığı bul
3. Zorunlu rule/workflow/skill dosyalarını oku
4. İlgili mevcut implementation dosyalarını oku
5. Değişiklik planını mevcut pattern’e göre yap
```

Her görevde varsayılan ana dosya:

```txt
.cursor/rules/00-PROJECT_IDENTITY.md
```

---

## 2. Ortak Temel Dosyalar

Çoğu görevde okunacak ortak dosyalar:

```txt
.cursor/rules/00-PROJECT_IDENTITY.md
.cursor/rules/01-AGENT_WORKFLOW.md
.cursor/rules/02-CODING_STANDARDS.md
```

Frontend görevlerinde ek:

```txt
.cursor/rules/02A-CODING_STANDARDS_FRONTEND.md
.cursor/rules/03-DESIGN_SYSTEM.md
.cursor/rules/04-UI_COMPONENT_BOUNDARIES.md
```

Backend görevlerinde ek:

```txt
.cursor/rules/skills/tenant-security-skill.md
.cursor/rules/skills/prisma-erp-skill.md
```

---

## 3. Frontend Görev Haritası

### 3.1 Yeni Frontend Sayfası

Okunacak Cursor dosyaları:

```txt
.cursor/rules/00-PROJECT_IDENTITY.md
.cursor/rules/01-AGENT_WORKFLOW.md
.cursor/rules/02A-CODING_STANDARDS_FRONTEND.md
.cursor/rules/03-DESIGN_SYSTEM.md
.cursor/rules/04-UI_COMPONENT_BOUNDARIES.md
.cursor/rules/workflows/frontend-page-patterns.md
```

Okunacak proje dosyaları:

```txt
- İlgili route altındaki page.tsx
- Aynı modüldeki mevcut benzer sayfa
- components/shared/*
- components/{module}/*
- services/{module}.service.ts
- schemas/{module}.schema.ts
- types/{module}.ts
```

---

### 3.2 Frontend Polish / UI İyileştirme

Okunacak Cursor dosyaları:

```txt
.cursor/rules/02A-CODING_STANDARDS_FRONTEND.md
.cursor/rules/03-DESIGN_SYSTEM.md
.cursor/rules/04-UI_COMPONENT_BOUNDARIES.md
.cursor/rules/workflows/frontend-page-patterns.md
.cursor/rules/workflows/frontend-polish-workflow.md
```

Okunacak proje dosyaları:

```txt
- İlgili sayfa dosyası
- Sayfanın kullandığı componentler
- Shared UI componentler
- Mevcut layout/sidebar/header dosyaları
```

Yasak:

```txt
- Backend/API contract değiştirmek
- Auth/tenant interceptor değiştirmek
- Prisma schema değiştirmek
```

---

### 3.3 DataGrid / Liste Ekranı

Okunacak Cursor dosyaları:

```txt
.cursor/rules/02A-CODING_STANDARDS_FRONTEND.md
.cursor/rules/03-DESIGN_SYSTEM.md
.cursor/rules/04-UI_COMPONENT_BOUNDARIES.md
.cursor/rules/workflows/frontend-page-patterns.md
.cursor/rules/workflows/datagrid-patterns.md
```

Okunacak proje dosyaları:

```txt
- İlgili DataGrid componenti
- Kolon tanımı dosyası
- Filtre componenti
- Service dosyası
- Query key dosyası
- Formatter dosyası
```

Backend pagination/filter gerekiyorsa ek:

```txt
.cursor/rules/workflows/backend-api-patterns.md
.cursor/rules/skills/tenant-security-skill.md
```

---

### 3.4 Form Ekranı

Okunacak Cursor dosyaları:

```txt
.cursor/rules/02A-CODING_STANDARDS_FRONTEND.md
.cursor/rules/03-DESIGN_SYSTEM.md
.cursor/rules/04-UI_COMPONENT_BOUNDARIES.md
.cursor/rules/workflows/frontend-page-patterns.md
```

Okunacak proje dosyaları:

```txt
- Form componenti
- Zod schema dosyası
- Service dosyası
- create/edit page dosyaları
- notify/api-error helpers
```

Kurallar:

```txt
- React Hook Form + Zod + shadcn Form
- Türkçe validation mesajları
- Submit loading state
- Error handling
- Permission-aware action
```

---

### 3.5 Dashboard Ekranı

Okunacak Cursor dosyaları:

```txt
.cursor/rules/03-DESIGN_SYSTEM.md
.cursor/rules/04-UI_COMPONENT_BOUNDARIES.md
.cursor/rules/workflows/frontend-page-patterns.md
.cursor/rules/workflows/frontend-polish-workflow.md
```

Okunacak proje dosyaları:

```txt
- Dashboard page/component
- KPI card component
- Chart/report components
- Dashboard service
- Formatter utils
```

Backend aggregate gerekiyorsa ek:

```txt
.cursor/rules/skills/tenant-security-skill.md
.cursor/rules/skills/prisma-erp-skill.md
.cursor/rules/workflows/backend-api-patterns.md
```

---

## 4. Backend Görev Haritası

### 4.1 Yeni API Endpoint

Okunacak Cursor dosyaları:

```txt
.cursor/rules/00-PROJECT_IDENTITY.md
.cursor/rules/01-AGENT_WORKFLOW.md
.cursor/rules/02-CODING_STANDARDS.md
.cursor/rules/workflows/backend-api-patterns.md
.cursor/rules/skills/tenant-security-skill.md
.cursor/rules/skills/prisma-erp-skill.md
```

Okunacak proje dosyaları:

```txt
- İlgili module.controller.ts
- İlgili module.service.ts
- İlgili dto klasörü
- prisma/schema.prisma ilgili model
- Benzer mevcut endpoint implementasyonu
```

---

### 4.2 Backend Liste / Pagination / Filter

Okunacak Cursor dosyaları:

```txt
.cursor/rules/workflows/backend-api-patterns.md
.cursor/rules/skills/tenant-security-skill.md
.cursor/rules/skills/prisma-erp-skill.md
```

Okunacak proje dosyaları:

```txt
- filter DTO
- service findAll metodu
- controller list endpointi
- frontend service/dataGrid beklentisi
```

Kurallar:

```txt
- Backend page 1-based
- limit max 100
- tenantId zorunlu
- deletedAt: null zorunlu
- sortBy allowlist
```

---

### 4.3 Backend Validation / DTO

Okunacak Cursor dosyaları:

```txt
.cursor/rules/02-CODING_STANDARDS.md
.cursor/rules/workflows/backend-api-patterns.md
```

Okunacak proje dosyaları:

```txt
- create dto
- update dto
- filter dto
- controller body/query kullanımı
- mevcut validation pipe ayarları
```

---

## 5. Finansal Modül Haritası

### 5.1 Fatura

Okunacak Cursor dosyaları:

```txt
.cursor/rules/skills/tenant-security-skill.md
.cursor/rules/skills/prisma-erp-skill.md
.cursor/rules/skills/invoice-engine-skill.md
.cursor/rules/decisions/ADR-003-financial-transactions.md
```

Okunacak proje dosyaları:

```txt
- invoice.controller.ts
- invoice.service.ts
- invoice dto dosyaları
- prisma/schema.prisma Invoice modeli
- InvoiceItem modeli
- AccountMovement modeli
- ProductMovement modeli
```

Kritik zincir:

```txt
Invoice
  ├── InvoiceItem
  ├── AccountMovement
  └── ProductMovement
```

---

### 5.2 Tahsilat

Okunacak Cursor dosyaları:

```txt
.cursor/rules/skills/tenant-security-skill.md
.cursor/rules/skills/prisma-erp-skill.md
.cursor/rules/skills/invoice-engine-skill.md
.cursor/rules/decisions/ADR-003-financial-transactions.md
```

Okunacak proje dosyaları:

```txt
- collection.service.ts
- collection.controller.ts
- Collection modeli
- InvoiceCollection modeli
- AccountMovement modeli
- CashboxMovement / BankAccountMovement modeli
```

---

### 5.3 Ödeme

Okunacak Cursor dosyaları:

```txt
.cursor/rules/skills/tenant-security-skill.md
.cursor/rules/skills/prisma-erp-skill.md
.cursor/rules/skills/invoice-engine-skill.md
.cursor/rules/decisions/ADR-003-financial-transactions.md
```

Okunacak proje dosyaları:

```txt
- payment.service.ts
- payment.controller.ts
- Payment modeli
- AccountMovement modeli
- CashboxMovement / BankAccountMovement modeli
```

---

### 5.4 Cari Hesap / Cari Hareket

Okunacak Cursor dosyaları:

```txt
.cursor/rules/skills/tenant-security-skill.md
.cursor/rules/skills/prisma-erp-skill.md
.cursor/rules/skills/invoice-engine-skill.md
```

Okunacak proje dosyaları:

```txt
- account.service.ts
- account.controller.ts
- account-movement.service.ts
- Account modeli
- AccountMovement modeli
```

---

## 6. Stok / Depo Modül Haritası

### 6.1 Ürün / Stok

Okunacak Cursor dosyaları:

```txt
.cursor/rules/skills/tenant-security-skill.md
.cursor/rules/skills/prisma-erp-skill.md
.cursor/rules/skills/warehouse-stock-skill.md
```

Okunacak proje dosyaları:

```txt
- product.service.ts
- product.controller.ts
- product-movement.service.ts
- Product modeli
- ProductMovement modeli
- ProductLocationStock modeli
```

---

### 6.2 Depo / Lokasyon

Okunacak Cursor dosyaları:

```txt
.cursor/rules/skills/tenant-security-skill.md
.cursor/rules/skills/prisma-erp-skill.md
.cursor/rules/skills/warehouse-stock-skill.md
```

Okunacak proje dosyaları:

```txt
- warehouse.service.ts
- warehouse.controller.ts
- location.service.ts
- Warehouse modeli
- Location modeli
- ProductLocationStock modeli
```

---

### 6.3 Depo Transferi

Okunacak Cursor dosyaları:

```txt
.cursor/rules/skills/tenant-security-skill.md
.cursor/rules/skills/prisma-erp-skill.md
.cursor/rules/skills/warehouse-stock-skill.md
.cursor/rules/decisions/ADR-003-financial-transactions.md
```

Okunacak proje dosyaları:

```txt
- warehouse-transfer.service.ts
- WarehouseTransfer modeli
- ProductLocationStock modeli
- ProductMovement modeli
```

Kritik kural:

```txt
Transfer transaction içinde yapılır.
Kaynak ve hedef birlikte güncellenir.
```

---

## 7. Auth / Permission Görev Haritası

Okunacak Cursor dosyaları:

```txt
.cursor/rules/00-PROJECT_IDENTITY.md
.cursor/rules/01-AGENT_WORKFLOW.md
.cursor/rules/02-CODING_STANDARDS.md
.cursor/rules/skills/tenant-security-skill.md
```

Okunacak proje dosyaları:

```txt
- auth module
- guards
- decorators
- permission/role service
- frontend auth provider
- api client interceptor
```

Kritik kural:

```txt
Auth/tenant altyapısı kritik görevdir.
Kullanıcı onayı olmadan değiştirilmez.
```

---

## 8. Debugging Görev Haritası

Okunacak Cursor dosyaları:

```txt
.cursor/rules/05-DEBUGGING_GUIDE.md
.cursor/rules/01-AGENT_WORKFLOW.md
```

Görev türüne göre ek dosya:

```txt
Frontend hata → frontend polish/page patterns
DataGrid hata → datagrid patterns
Backend hata → backend-api-patterns + tenant/prisma skills
Finansal hata → invoice-engine + ADR-003
Stok hata → warehouse-stock-skill
```

Okunacak proje kaynakları:

```txt
- Hata logu
- Stack trace
- İlgili dosya
- Son değişiklikler
- package.json scripts
```

---

## 9. MCP Kullanım Haritası

MCP dosyası:

```txt
.cursor/rules/06-MCP_USAGE_GUIDE.md
```

Frontend test:

```txt
Playwright / Browser MCP
```

Güncel dokümantasyon:

```txt
Context7 MCP
```

Git/PR kontrol:

```txt
GitHub MCP
```

Figma:

```txt
Hazır Figma tasarımı yoksa zorunlu değildir.
```

---

## 10. Module Dependency Graph Özeti

### 10.1 Finansal Zincir

```txt
Invoice
  ├── InvoiceItem
  ├── AccountMovement
  ├── ProductMovement
  └── InvoiceCollection
        └── Collection
              ├── CashboxMovement
              └── BankAccountMovement
```

### 10.2 Stok Zinciri

```txt
Product
  ├── ProductMovement
  ├── ProductLocationStock
  │     └── Location
  │           └── Warehouse
  └── InvoiceItem
```

### 10.3 Cari Zinciri

```txt
Account
  ├── AccountMovement
  ├── Invoice
  ├── Collection
  ├── Payment
  └── CheckBill
```

### 10.4 İK Zinciri

```txt
Employee
  ├── SalaryPlan
  ├── SalaryPayment
  ├── Advance
  └── LeaveRequest
```

---

## 11. Dosya Bulunamazsa Ne Yapılır?

Agent aranan dosyayı bulamazsa:

```txt
1. Benzer isimli dosyaları arar
2. Module klasörlerini kontrol eder
3. schema.prisma içindeki modeli inceler
4. Mevcut route veya service patternini bulur
5. Yine bulunamazsa kullanıcıya raporlar
```

Agent dosya yok diye rastgele yeni mimari oluşturmaz.

---

## 12. Çakışma Durumunda Öncelik

Çakışma varsa öncelik sırası:

```txt
1. 00-PROJECT_IDENTITY.md
2. 01-AGENT_WORKFLOW.md
3. Göreve özel skill dosyası
4. Göreve özel workflow dosyası
5. 02-CODING_STANDARDS.md
6. Mevcut kod patterni
```

Frontend UI kütüphane çakışması:

```txt
04-UI_COMPONENT_BOUNDARIES.md nihai kaynaktır.
```

Tenant/güvenlik çakışması:

```txt
skills/tenant-security-skill.md nihai kaynaktır.
```

Finansal transaction çakışması:

```txt
ADR-003-financial-transactions.md nihai kaynaktır.
```

---

## 13. AI Agent Hızlı Görev Eşleştirme

| Görev | Öncelikli Dosyalar |
|---|---|
| Frontend polish | design system + component boundaries + frontend polish |
| Yeni frontend sayfası | frontend standards + frontend page patterns |
| DataGrid | datagrid patterns |
| Backend endpoint | backend api patterns + tenant + prisma |
| Prisma query | tenant + prisma skill |
| Fatura | invoice engine + ADR-003 |
| Tahsilat/ödeme | invoice engine + ADR-003 |
| Stok/depo | warehouse-stock skill |
| Auth/tenant | tenant-security skill |
| Debugging | debugging guide + ilgili skill |
| MCP kullanımı | MCP usage guide |

---

## 14. AI Agent Kontrol Listesi

- [ ] Görev türü doğru belirlendi mi?
- [ ] İlgili rule/workflow/skill dosyaları okundu mu?
- [ ] Gereksiz tüm proje taraması yapılmadı mı?
- [ ] Mevcut implementation örneği bulundu mu?
- [ ] Tenant/finansal/stok etkisi varsa doğru skill okundu mu?
- [ ] Frontend görevinde backend’e dokunulmadı mı?
- [ ] Backend görevinde UI refactor yapılmadı mı?
- [ ] Eksik dosya varsa rastgele mimari üretilmedi mi?
