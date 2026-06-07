# DEBUGGING GUIDE — Muhasebe

**Proje:** Muhasebe  
**Kapsam:** Hata ayıklama, kök neden analizi, frontend/backend/DataGrid/Prisma/tenant/debug akışları  
**Stack:** NestJS + Next.js App Router + TypeScript + Prisma + PostgreSQL + shadcn/ui + MUI X DataGrid  
**Son Güncelleme:** 31 Mayıs 2026

> Bu dosya Muhasebe projesinde hata çözümü sırasında izlenecek standart akışı tanımlar. Agent tahminle düzeltme yapmaz; önce hatayı okur, kök nedeni bulur, en küçük güvenli değişikliği uygular ve doğrular.

---

## 1. Ana Debug İlkesi

Debug görevi şu sırayla yapılır:

```txt
1. Hata mesajını oku
2. Hatanın türünü belirle
3. İlgili rule/skill/workflow dosyalarını oku
4. İlgili kod dosyalarını incele
5. Kök nedeni bul
6. En küçük güvenli düzeltmeyi yap
7. Test/doğrulama çalıştır
8. Değişiklikleri ve sonucu raporla
```

Yasak yaklaşım:

```txt
❌ Hata mesajını okumadan kod değiştirmek
❌ Büyük refactor ile küçük hatayı çözmeye çalışmak
❌ Frontend hatası bahanesiyle backend contract değiştirmek
❌ Tenant/auth/transaction gibi kritik alanları analizsiz değiştirmek
```

---

## 2. Debug Görevi Başlangıç Soruları

Agent hata çözmeden önce şu soruları yanıtlamalıdır:

```txt
- Hata frontend mi backend mi?
- Build-time mı runtime mı?
- TypeScript mi runtime exception mı?
- API response hatası mı?
- Network/CORS/auth/tenant hatası mı?
- Prisma/database hatası mı?
- DataGrid/rendering hatası mı?
- Form validation hatası mı?
- Finansal işlem veya transaction etkileniyor mu?
```

---

## 3. Zorunlu Okuma Haritası

Genel debug:

```txt
.cursor/rules/00-PROJECT_IDENTITY.md
.cursor/rules/01-AGENT_WORKFLOW.md
.cursor/rules/05-DEBUGGING_GUIDE.md
```

Frontend debug:

```txt
.cursor/rules/02A-CODING_STANDARDS_FRONTEND.md
.cursor/rules/03-DESIGN_SYSTEM.md
.cursor/rules/04-UI_COMPONENT_BOUNDARIES.md
.cursor/rules/workflows/frontend-polish-workflow.md
```

DataGrid debug:

```txt
.cursor/rules/workflows/datagrid-patterns.md
```

Backend debug:

```txt
.cursor/rules/02-CODING_STANDARDS.md
.cursor/rules/workflows/backend-api-patterns.md
.cursor/rules/skills/tenant-security-skill.md
.cursor/rules/skills/prisma-erp-skill.md
```

Finansal debug:

```txt
.cursor/rules/skills/invoice-engine-skill.md
.cursor/rules/decisions/ADR-003-financial-transactions.md
```

Stok/depo debug:

```txt
.cursor/rules/skills/warehouse-stock-skill.md
```

---

## 4. Frontend Debug Akışı

### 4.1 Belirtiler

```txt
- Sayfa boş açılıyor
- Component render olmuyor
- Hydration hatası
- Form submit olmuyor
- API verisi gelmiyor
- Loading takılı kalıyor
- Empty state görünmüyor
- Dialog/dropdown açılmıyor
- Responsive kırılıyor
- Console error var
```

### 4.2 Kontrol Sırası

```txt
1. Browser console hatası
2. Network tab / API response
3. React component boundary
4. use client gerekliliği
5. Hook kullanımı
6. Service çağrısı
7. Query key
8. Loading/error/empty state
9. Permission/role kontrolü
10. CSS/layout sorunu
```

### 4.3 Yaygın Hatalar

#### Gereksiz veya eksik `use client`

Hook kullanılan component client olmalıdır.

```tsx
'use client'

export function AccountListClient() {
  const [filters, setFilters] = useState({})
  return <div />
}
```

Ama tüm `page.tsx` gereksiz yere client yapılmaz.

#### API çağrısı component içine yazılmış

Yanlış:

```tsx
const response = await axios.get('/accounts')
```

Doğru:

```tsx
const { data } = useQuery({
  queryKey: QK.accounts.list(filters),
  queryFn: () => accountService.getAll(filters),
})
```

#### Error state yok

```tsx
if (error) return <ErrorState onRetry={refetch} />
```

---

## 5. DataGrid Debug Akışı

### 5.1 Belirtiler

```txt
- DataGrid boş görünüyor
- Pagination çalışmıyor
- Filtre çalışmıyor
- Kolonlar sıkışıyor
- Row click action ile çakışıyor
- Loading bitmiyor
- total row sayısı yanlış
- Sayfa değişince veri gelmiyor
```

### 5.2 Kontrol Sırası

```txt
1. rows array gerçekten dolu mu?
2. Her row için id var mı?
3. getRowId gerekiyor mu?
4. rowCount doğru mu?
5. paginationModel 0-based mi?
6. Backend page 1-based mi?
7. Query key pagination/filter içeriyor mu?
8. API response { data, total, page, limit } formatında mı?
9. loading prop doğru mu?
10. Empty/error overlay var mı?
```

### 5.3 Yaygın Hatalar

#### Backend page ile DataGrid page karışıklığı

DataGrid page 0-based:

```tsx
page: paginationModel.page + 1
```

Backend page 1-based:

```ts
skip: (page - 1) * limit
```

#### Row id yok

```tsx
<DataGrid getRowId={(row) => row.id} />
```

#### rowCount eksik

Server pagination’da:

```tsx
rowCount={data?.total ?? 0}
```

#### autoHeight kaynaklı layout zıplaması

Varsayılan:

```tsx
<div className="min-h-[520px]">
  <DataGrid ... />
</div>
```

---

## 6. Backend API Debug Akışı

### 6.1 Belirtiler

```txt
- API 400 / 401 / 403 / 404 / 500 dönüyor
- Validation hatası
- Tenant hatası
- Veri listelenmiyor
- Yanlış tenant verisi geliyor
- Pagination yanlış
- Endpoint frontend beklentisini karşılamıyor
```

### 6.2 Kontrol Sırası

```txt
1. Controller route doğru mu?
2. Guard yapısı doğru mu?
3. DTO validation doğru mu?
4. Query/body parametreleri doğru parse ediliyor mu?
5. Service tenantId alıyor mu?
6. Prisma where içinde tenantId var mı?
7. Aktif kayıtlarda deletedAt: null var mı?
8. Pagination skip/take doğru mu?
9. Error handling doğru mu?
10. Response format frontend beklentisiyle uyumlu mu?
```

### 6.3 Yaygın Hatalar

#### Query param number parse edilmemiş

DTO’da:

```ts
@Type(() => Number)
@IsInt()
@Min(1)
page?: number = 1
```

#### tenantId eksik

```ts
where: {
  tenantId,
  deletedAt: null,
}
```

#### findUnique tenant bypass riski

Yanlış:

```ts
await prisma.account.findUnique({ where: { id } })
```

Doğru:

```ts
await prisma.account.findFirst({
  where: { id, tenantId, deletedAt: null },
})
```

---

## 7. Prisma / Database Debug Akışı

### 7.1 Belirtiler

```txt
- Prisma validation error
- Unique constraint hatası
- Foreign key hatası
- Transaction rollback
- Decimal/number hatası
- Migration hatası
- N+1 performans sorunu
```

### 7.2 Kontrol Sırası

```txt
1. Model alan adı doğru mu?
2. DTO ile Prisma model uyuşuyor mu?
3. Required field eksik mi?
4. tenantId eklenmiş mi?
5. Relation connect/create doğru mu?
6. Decimal değer doğru tipte mi?
7. Unique constraint çakışıyor mu?
8. Transaction içinde gerekli tüm kayıtlar var mı?
```

### 7.3 Unique Constraint Hatası

Önce mevcut kayıt kontrol edilir:

```ts
const existing = await prisma.account.findFirst({
  where: {
    tenantId,
    deletedAt: null,
    name: dto.name,
  },
})

if (existing) {
  throw new ConflictException('Bu cari hesap zaten mevcut')
}
```

### 7.4 Migration Hatası

Migration kullanıcı onayı gerektirir. Agent otomatik migration oluşturmaz.

Kontrol:

```txt
- Schema değişikliği gerçekten gerekli mi?
- Veri kaybı var mı?
- Rollback planı var mı?
- Staging/dry-run mümkün mü?
```

---

## 8. Tenant / Auth Debug Akışı

### 8.1 Belirtiler

```txt
- 401 Unauthorized
- 403 Forbidden
- Tenant not found
- Kullanıcı veri göremiyor
- Yanlış firma verisi görünüyor
- Frontend request header eksik
```

### 8.2 Kontrol Sırası

Backend:

```txt
1. JwtAuthGuard çalışıyor mu?
2. TenantGuard çalışıyor mu?
3. TenantContextService tenantId üretiyor mu?
4. Service tenantContext.getTenantId() kullanıyor mu?
5. Query tenantId içeriyor mu?
```

Frontend:

```txt
1. Token var mı?
2. Tenant seçili mi?
3. x-tenant-id header gidiyor mu?
4. API base URL doğru mu?
5. Refresh/logout akışı bozulmuş mu?
```

Frontend polish görevinde auth/tenant interceptor değiştirilmez. Sorun varsa ayrı güvenlik görevi olarak raporlanır.

---

## 9. Finansal Debug Akışı

### 9.1 Belirtiler

```txt
- Fatura oluşuyor ama cari hareket oluşmuyor
- Stok düşmüyor
- Tahsilat sonrası fatura kapanmıyor
- Bakiye yanlış
- İptal sonrası hareketler terslenmiyor
- Kısmi işlem kalıyor
```

### 9.2 Kontrol Sırası

```txt
1. İşlem transaction içinde mi?
2. Invoice oluşuyor mu?
3. InvoiceItem oluşuyor mu?
4. AccountMovement oluşuyor mu?
5. ProductMovement gerekiyorsa oluşuyor mu?
6. Tahsilat/ödeme ilişkisi doğru mu?
7. Status hesaplaması doğru mu?
8. İptal senaryosu ters hareket oluşturuyor mu?
9. Decimal/rounding hatası var mı?
```

Kural:

```txt
Finansal debug sırasında kısmi düzeltme yapılmaz.
Tüm işlem zinciri analiz edilir.
```

---

## 10. Stok / Depo Debug Akışı

### 10.1 Belirtiler

```txt
- Stok negatif oluyor
- Transferde kaynak düşüyor hedef artmıyor
- Sayım farkı yanlış
- Fatura stok düşmüyor
- Depo/lokasyon yanlış hesaplanıyor
```

### 10.2 Kontrol Sırası

```txt
1. Product tenant’a ait mi?
2. Warehouse/location tenant’a ait mi?
3. ProductLocationStock var mı?
4. Negatif stok kontrolü var mı?
5. ProductMovement oluşturuluyor mu?
6. Transfer transaction içinde mi?
7. Kaynak ve hedef birlikte güncelleniyor mu?
8. Fatura kaynaklı hareket invoice transaction içinde mi?
```

---

## 11. Build / TypeScript Debug Akışı

### 11.1 Kontrol Komutları

Önce package.json kontrol edilir.

```bash
pnpm lint
pnpm type-check
pnpm build
pnpm test
```

Agent komutun var olduğunu varsaymaz.

### 11.2 Yaygın TypeScript Hataları

```txt
- any kullanımı
- Nullable alan kontrolsüz kullanımı
- API response type uyuşmazlığı
- DataGrid row type uyuşmazlığı
- Zod schema type uyuşmazlığı
- Prisma generated type güncel değil
```

---

## 12. MCP Destekli Debug

Browser/Playwright MCP varsa frontend debug’da kullanılır:

```txt
- Sayfayı aç
- Console error kontrol et
- Network error kontrol et
- Desktop görünüm kontrol et
- Mobil görünüm kontrol et
- Form submit dene
- Dialog/dropdown kontrol et
- DataGrid pagination/filter kontrol et
```

Context7 MCP varsa güncel dokümantasyon için kullanılır:

```txt
- Next.js App Router
- shadcn/ui
- MUI X DataGrid
- TanStack Query
- React Hook Form
- Zod
- Prisma
- NestJS
```

---

## 13. Debug Sırasında Yasaklar

```txt
❌ Hata kaynağı bulunmadan refactor yapmak
❌ Çalışan API contract’ı değiştirmek
❌ Frontend hatasını backend’i değiştirerek gizlemek
❌ Tenant/auth güvenliğini geçici kapatmak
❌ Transaction’ı kaldırarak hatayı çözmek
❌ TypeScript hatasını any ile susturmak
❌ Validation’ı kaldırmak
❌ Kullanıcı onayı olmadan migration oluşturmak
```

---

## 14. Raporlama Formatı

Debug sonunda agent şu formatı kullanır:

```txt
Kök Neden:
- Hatanın asıl sebebi

Yapılan Düzeltme:
- Ne değiştirildi?

Değişen Dosyalar:
- path/to/file.ts

Doğrulama:
- pnpm lint: geçti / çalıştırılamadı
- pnpm type-check: geçti / çalıştırılamadı
- Manuel test: ...

Risk / Not:
- Varsa ek riskler
```

---

## 15. AI Agent Debug Kontrol Listesi

- [ ] Hata mesajı okundu mu?
- [ ] Hata türü belirlendi mi?
- [ ] İlgili rule/skill/workflow dosyası okundu mu?
- [ ] Kök neden bulundu mu?
- [ ] En küçük güvenli düzeltme yapıldı mı?
- [ ] Tenant/auth etkisi kontrol edildi mi?
- [ ] Finansal transaction etkisi kontrol edildi mi?
- [ ] TypeScript any ile susturulmadı mı?
- [ ] Doğrulama komutları çalıştırıldı mı?
- [ ] Sonuç açıkça raporlandı mı?
