# ADR-001 — Tenant Isolation

**Proje:** Muhasebe  
**Durum:** Kabul edildi  
**Tarih:** 31 Mayıs 2026  
**Karar Türü:** Güvenlik / SaaS mimarisi

---

## 1. Bağlam

Muhasebe, çok kiracılı bir KOBİ muhasebe / ERP sistemidir. Birden fazla firma/tenant aynı uygulama ve veritabanı altyapısını kullanır. Bu nedenle her tenant’ın verisinin diğer tenant’lardan kesin şekilde izole edilmesi zorunludur.

Tenant izolasyonu sadece teknik tercih değil, ürünün temel güvenlik şartıdır.

---

## 2. Karar

Muhasebe projesinde tenant izolasyonu uygulama katmanında zorunlu kural olarak uygulanır.

Ana karar:

```txt
Her tenant/firma sadece kendi verisini görebilir, oluşturabilir, güncelleyebilir ve raporlayabilir.
```

Her tenant verisi içeren sorguda:

```txt
tenantId zorunludur.
```

Aktif kayıt sorgularında:

```txt
deletedAt: null zorunludur.
```

---

## 3. Uygulama Prensipleri

Backend tarafında:

```txt
- AuthGuard kullanılır
- TenantGuard kullanılır
- TenantContextService ile tenantId alınır
- tenantId DTO/body/query üzerinden güvenilerek alınmaz
- Service katmanı tenantId eklemekten sorumludur
- Prisma sorguları tenantId içerir
```

Frontend tarafında:

```txt
- Auth token gönderimi korunur
- Tenant seçimi/tenant context mekanizması korunur
- x-tenant-id header injection bozulmaz
- UI polish görevlerinde auth/tenant interceptor değiştirilmez
```

---

## 4. Doğru Örnek

```ts
const tenantId = this.tenantContext.getTenantId()

const accounts = await this.prisma.account.findMany({
  where: {
    tenantId,
    deletedAt: null,
  },
})
```

Detay sorgusu:

```ts
const account = await this.prisma.account.findFirst({
  where: {
    id,
    tenantId,
    deletedAt: null,
  },
})
```

---

## 5. Yanlış Örnek

```ts
// ❌ Tenant filtresi yok
const accounts = await this.prisma.account.findMany({
  where: {
    deletedAt: null,
  },
})
```

```ts
// ❌ Kullanıcıdan gelen tenantId’ye güveniliyor
const tenantId = dto.tenantId
```

```ts
// ❌ Tenant verisi id ile direkt çekiliyor
const account = await this.prisma.account.findUnique({
  where: { id },
})
```

---

## 6. Raw Query Kuralı

Raw query gerekiyorsa tenant filtresi zorunludur.

```ts
await prisma.$queryRaw`
  SELECT *
  FROM accounts
  WHERE tenant_id = ${tenantId}
    AND deleted_at IS NULL
`
```

`$queryRawUnsafe` kullanılmaz.

---

## 7. Export / Rapor / Aggregate Kuralı

Rapor, dashboard, KPI ve export sorguları da tenant izolasyonuna tabidir.

Yanlış:

```ts
await prisma.account.aggregate({
  _sum: { balance: true },
})
```

Doğru:

```ts
await prisma.account.aggregate({
  where: {
    tenantId,
    deletedAt: null,
  },
  _sum: {
    balance: true,
  },
})
```

---

## 8. Sonuçlar

Avantajlar:

```txt
✅ Cross-tenant veri sızıntısı riski azaltılır
✅ SaaS güvenliği tutarlı olur
✅ Rapor ve dashboard verileri tenant bazlı doğru hesaplanır
✅ Backend servislerinde güvenlik standardı oluşur
```

Bedeller:

```txt
- Her sorguda tenantId kontrolü gerekir
- Bazı query’ler daha uzun yazılır
- Agent her zaman tenant context’i düşünmelidir
```

---

## 9. Alternatifler

### 9.1 Ayrı Database Per Tenant

Değerlendirildi fakat şu aşamada tercih edilmedi.

Neden tercih edilmedi?

```txt
- Operasyon maliyeti yüksek
- Migration yönetimi zor
- Küçük/orta ölçekli SaaS için başlangıçta fazla karmaşık
```

### 9.2 PostgreSQL RLS Ana Güvenlik Modeli

İleride değerlendirilebilir. Ancak mevcut karar:

```txt
NestJS + Prisma uygulama katmanı tenant izolasyonu ana modeldir.
```

RLS ek güvenlik katmanı olarak ileride ayrı ADR ile değerlendirilebilir.

---

## 10. Agent Kuralları

AI agent:

```txt
✅ Tenant verisi içeren her sorguda tenantId kullanır
✅ Aktif kayıt sorgularında deletedAt: null ekler
✅ AuthGuard/TenantGuard yapısını korur
✅ Raw query’de tenant_id filtresi kullanır
✅ Frontend UI görevinde tenant/auth interceptor değiştirmez
```

AI agent yapmaz:

```txt
❌ tenantId’siz sorgu yazmaz
❌ tenantId’yi DTO/body/query’den güvenerek almaz
❌ findUnique({ id }) ile tenant verisine doğrudan erişmez
❌ Export/rapor sorgularında tenant filtresini unutmaz
```

---

## 11. İlgili Dosyalar

```txt
.cursor/rules/skills/tenant-security-skill.md
.cursor/rules/skills/prisma-erp-skill.md
.cursor/rules/workflows/backend-api-patterns.md
.cursor/rules/context-map/module-context-map.md
```
