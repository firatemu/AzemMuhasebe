# PRISMA ERP SKILL — Muhasebe

**Proje:** Muhasebe  
**Kapsam:** Prisma ORM kullanım kuralları, ERP veri bütünlüğü, migration güvenliği, transaction, soft delete, N+1 önleme  
**Stack:** Prisma + PostgreSQL + NestJS  
**Son Güncelleme:** 31 Mayıs 2026

> Bu skill, Muhasebe projesinde Prisma ile güvenli ve tutarlı veri erişimi sağlamak için kullanılır. Prisma query yazılan her backend görevinde tenant güvenliği ve soft delete kuralları birlikte uygulanır.

---

## 1. Ne Zaman Okunur?

Bu skill şu görevlerde mutlaka okunur:

```txt
- Prisma query yazma
- Service metodu geliştirme
- Yeni model ilişkisi kullanma
- Migration planlama
- Transaction yazma
- Rapor/aggregate query
- Stok/fatura/cari hareket işlemleri
- Raw SQL kullanımı
- Performans/N+1 düzeltmesi
```

---

## 2. Ana Kurallar

```txt
✅ tenantId her tenant verisi sorgusunda zorunludur
✅ Aktif kayıt sorgularında deletedAt: null zorunludur
✅ Hard delete varsayılan olarak yasaktır
✅ Finansal/stok/cari işlemler transaction içinde yapılır
✅ Raw query son çaredir
✅ N+1 sorgu paterni önlenir
✅ Migration kullanıcı onayı olmadan oluşturulmaz
```

Yasaklar:

```txt
❌ tenantId olmadan findMany/count/aggregate
❌ findUnique({ id }) ile tenant verisine doğrudan erişim
❌ Hard delete
❌ Transaction gerektiren işlemi ayrı ayrı query’lerle yapmak
❌ Raw SQL’de tenant_id filtresini unutmak
❌ Büyük veriyi client’a çekip uygulamada filtrelemek
```

---

## 3. Standart Model Alanları

Tenant verisi içeren modellerde temel alanlar:

```prisma
model Account {
  id        String    @id @default(uuid())
  tenantId  String    @map("tenant_id")
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")
  deletedAt DateTime? @map("deleted_at")
  deletedBy String?   @map("deleted_by")

  @@index([tenantId])
  @@index([deletedAt])
  @@index([tenantId, deletedAt])
}
```

Yeni model eklenirken tenantId, createdAt, updatedAt ve deletedAt gerekliliği değerlendirilir.

---

## 4. Query Pattern

### 4.1 Listeleme

```ts
const accounts = await prisma.account.findMany({
  where: {
    tenantId,
    deletedAt: null,
  },
  orderBy: {
    createdAt: 'desc',
  },
})
```

### 4.2 Detay

```ts
const account = await prisma.account.findFirst({
  where: {
    id,
    tenantId,
    deletedAt: null,
  },
})
```

### 4.3 Count / Aggregate

```ts
const total = await prisma.account.count({
  where: {
    tenantId,
    deletedAt: null,
  },
})
```

```ts
const result = await prisma.account.aggregate({
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

## 5. findUnique Kullanımı

Tenant verisi içeren modellerde tek başına `findUnique({ where: { id } })` kullanılmaz.

Yanlış:

```ts
await prisma.invoice.findUnique({
  where: { id },
})
```

Doğru:

```ts
await prisma.invoice.findFirst({
  where: {
    id,
    tenantId,
    deletedAt: null,
  },
})
```

İstisna: schema içinde tenant-aware composite unique varsa kullanılabilir.

---

## 6. Pagination Pattern

```ts
const page = filter.page ?? 1
const limit = filter.limit ?? 25
const skip = (page - 1) * limit

const [data, total] = await Promise.all([
  prisma.account.findMany({
    where,
    skip,
    take: limit,
    orderBy,
  }),
  prisma.account.count({ where }),
])

return { data, total, page, limit }
```

Kurallar:

```txt
- page backend tarafında 1-based
- limit maksimum 100
- count query aynı where filtresini kullanır
- Büyük veri client’a çekilip slice yapılmaz
```

---

## 7. Search / Filter Pattern

```ts
const where = {
  tenantId,
  deletedAt: null,
  ...(filter.search
    ? {
        OR: [
          { name: { contains: filter.search, mode: 'insensitive' as const } },
          { code: { contains: filter.search, mode: 'insensitive' as const } },
        ],
      }
    : {}),
  ...(filter.status ? { status: filter.status } : {}),
}
```

---

## 8. Sorting Pattern

Sorting alanları allowlist ile sınırlandırılır. Kullanıcıdan gelen sortBy doğrudan orderBy içine koyulmaz.

```ts
const allowedSortFields = ['createdAt', 'name', 'code', 'total'] as const
```

---

## 9. Include / Select Pattern

Gereksiz veri çekilmez. İhtiyaç varsa `select` tercih edilir.

```ts
const invoices = await prisma.invoice.findMany({
  where: {
    tenantId,
    deletedAt: null,
  },
  select: {
    id: true,
    invoiceNo: true,
    total: true,
    status: true,
    account: {
      select: {
        id: true,
        name: true,
      },
    },
  },
})
```

---

## 10. N+1 Önleme

Yanlış:

```ts
const invoices = await prisma.invoice.findMany({ where })

for (const invoice of invoices) {
  const account = await prisma.account.findFirst({
    where: { id: invoice.accountId, tenantId },
  })
}
```

Doğru:

```ts
const invoices = await prisma.invoice.findMany({
  where,
  include: {
    account: true,
  },
})
```

---

## 11. Transaction Pattern

Transaction gerektiren işlemler:

```txt
- Fatura oluşturma
- Fatura iptal
- Tahsilat
- Ödeme
- Stok hareketi
- Depo transferi
- Cari bakiye etkileyen işlem
- Çek/senet durum değişikliği
```

Finansal işlemlerde `Serializable` tercih edilir.

---

## 12. Soft Delete Pattern

Hard delete yasaktır.

```ts
await prisma.account.update({
  where: { id: existing.id },
  data: {
    deletedAt: new Date(),
  },
})
```

Aktif kayıt sorgularında:

```ts
where: {
  tenantId,
  deletedAt: null,
}
```

---

## 13. Raw Query Pattern

Raw query son çaredir.

```ts
await prisma.$queryRaw`
  SELECT *
  FROM accounts
  WHERE tenant_id = ${tenantId}
    AND deleted_at IS NULL
`
```

Yasak:

```ts
await prisma.$queryRawUnsafe(`
  SELECT * FROM accounts WHERE name = '${search}'
`)
```

---

## 14. Decimal / Money Kuralı

Finansal değerlerde floating point hatalarından kaçınılır.

```txt
- Para alanları Decimal olarak ele alınır
- Number ile rastgele hesap yapılmaz
- Yuvarlama kuralları merkezi olmalıdır
- Vergi, iskonto, toplam hesapları backend’de otoritatif yapılır
```

---

## 15. Migration Kuralı

Migration kullanıcı onayı olmadan oluşturulmaz.

Migration öncesi agent şunları raporlar:

```txt
- Hangi model değişiyor?
- Veri kaybı riski var mı?
- Index/unique constraint değişiyor mu?
- Mevcut veriye etkisi var mı?
- Rollback planı var mı?
```

---

## 16. Index / Performance Kuralı

Sık kullanılan filtrelerde index düşünülür:

```prisma
@@index([tenantId])
@@index([deletedAt])
@@index([tenantId, deletedAt])
@@index([tenantId, status])
@@index([tenantId, createdAt])
```

Index eklemek migration gerektirir; kullanıcı onayı olmadan uygulanmaz.

---

## 17. ERP İlişki Zincirleri

Fatura zinciri:

```txt
Invoice
  ├── InvoiceItem
  ├── ProductMovement
  └── AccountMovement
```

Stok zinciri:

```txt
Product
  ├── ProductMovement
  ├── ProductLocationStock
  └── Warehouse / Location
```

Cari zinciri:

```txt
Account
  ├── AccountMovement
  ├── Invoice
  ├── Collection
  └── Payment
```

Bu zincirler bozulmaz.

---

## 18. AI Agent Kontrol Listesi

- [ ] tenantId tüm sorgularda var mı?
- [ ] deletedAt aktif sorgularda var mı?
- [ ] findUnique güvenli mi?
- [ ] Hard delete yapılmadı mı?
- [ ] Transaction gerekiyorsa kullanıldı mı?
- [ ] Raw query tenant_id içeriyor mu?
- [ ] N+1 riski var mı?
- [ ] Büyük veri client’a çekiliyor mu?
- [ ] Sorting allowlist ile mi?
- [ ] Migration kullanıcı onayı gerektiriyor mu?
- [ ] Finansal değerlerde Decimal hassasiyeti korundu mu?
