# TENANT SECURITY SKILL — Muhasebe

**Proje:** Muhasebe  
**Kapsam:** Çok kiracılı SaaS güvenliği, tenant izolasyonu, auth/tenant guard, frontend tenant header koruması  
**Stack:** NestJS + Prisma + PostgreSQL + Next.js  
**Son Güncelleme:** 31 Mayıs 2026

> Bu dosya Muhasebe projesinin en kritik güvenlik skill dosyasıdır. Tenant izolasyonu bozulursa tüm SaaS veri güvenliği bozulur. Agent tenant güvenliği konusunda varsayım yapmaz; her zaman bu dosyadaki kuralları uygular.

---

## 1. Ana Kural

Her tenant/firma sadece kendi verisini görebilir ve değiştirebilir.

```txt
Tenant izolasyonu opsiyonel değildir.
Her tenant verisi tenantId ile filtrelenir.
Cross-tenant veri erişimi kritik güvenlik ihlalidir.
```

---

## 2. Ne Zaman Okunur?

Bu skill şu görevlerde mutlaka okunur:

```txt
- Backend endpoint geliştirme
- Prisma query yazma
- Service metodu yazma
- Repository metodu yazma
- Auth / role / permission işlemleri
- Frontend API client düzenleme
- Tenant header veya interceptor ile ilgili görev
- Raporlama / dashboard query
- Export işlemleri
- Raw SQL / aggregate query
- Migration veya schema değişikliği
```

---

## 3. Mutlak Kurallar

```txt
✅ Her Prisma query tenantId içermelidir
✅ Aktif kayıt sorgularında deletedAt: null olmalıdır
✅ Controller seviyesinde AuthGuard + TenantGuard korunmalıdır
✅ TenantId body veya query param’dan güvenilerek alınmaz
✅ Tenant context backend altyapısından gelir
✅ Raw query içinde tenant_id filtresi zorunludur
✅ Include/join edilen ilişkilerde veri sızıntısı riski kontrol edilir
```

Yasaklar:

```txt
❌ tenantId olmadan findMany/findFirst/count/aggregate
❌ deletedAt filtresi olmadan aktif kayıt listeleme
❌ Kullanıcıdan gelen tenantId’ye doğrudan güvenmek
❌ Frontend UI görevi sırasında auth/tenant interceptor değiştirmek
❌ Export/rapor sorgularında tenant filtresini unutmak
❌ Raw SQL ile tüm tenant verisini çekmek
```

---

## 4. Backend Guard Standardı

Tenant verisi içeren controllerlarda guard yapısı korunur.

```ts
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard)
@Controller('accounts')
export class AccountController {}
```

Eğer projede role/permission guard varsa mevcut pattern korunur:

```ts
@UseGuards(JwtAuthGuard, TenantGuard, PermissionGuard)
@RequirePermission('account.create')
@Post()
async create(@Body() dto: CreateAccountDto) {
  return this.accountService.create(dto)
}
```

Agent yeni permission sistemi uydurmaz; mevcut yapıyı inceler.

---

## 5. TenantContext Kullanımı

Service katmanında tenantId merkezi tenant context üzerinden alınır.

```ts
@Injectable()
export class AccountService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  async findAll() {
    const tenantId = this.tenantContext.getTenantId()

    return this.prisma.account.findMany({
      where: {
        tenantId,
        deletedAt: null,
      },
    })
  }
}
```

TenantId DTO’dan alınmaz:

```ts
// ❌ Yanlış
export class CreateAccountDto {
  tenantId: string
  name: string
}
```

Doğru:

```ts
// ✅ DTO içinde tenantId yok
export class CreateAccountDto {
  name: string
}
```

```ts
// ✅ tenantId service içinde eklenir
return this.prisma.account.create({
  data: {
    ...dto,
    tenantId,
  },
})
```

---

## 6. Prisma Query Kuralları

### 6.1 findMany

```ts
await prisma.account.findMany({
  where: {
    tenantId,
    deletedAt: null,
  },
})
```

### 6.2 findFirst / findUnique

Tenant verisi içeren kayıtlarda `findFirst` + tenantId tercih edilir.

```ts
const account = await prisma.account.findFirst({
  where: {
    id,
    tenantId,
    deletedAt: null,
  },
})
```

`findUnique({ where: { id } })` tek başına kullanılmaz; tenant güvenliği atlanabilir.

İstisna: Prisma modelinde tenant-aware unique composite varsa kullanılabilir:

```ts
await prisma.account.findUnique({
  where: {
    id_tenantId: {
      id,
      tenantId,
    },
  },
})
```

---

## 7. Count / Aggregate Kuralları

Dashboard, rapor ve KPI sorgularında tenantId unutulmamalıdır.

```ts
const totalReceivable = await prisma.account.aggregate({
  where: {
    tenantId,
    deletedAt: null,
    balance: { gt: 0 },
  },
  _sum: {
    balance: true,
  },
})
```

Yanlış:

```ts
// ❌ Tüm tenantların toplamını döndürür
await prisma.account.aggregate({
  _sum: { balance: true },
})
```

---

## 8. Include / Relation Güvenliği

Include edilen ilişkilerde sızıntı riski kontrol edilir.

```ts
const invoice = await prisma.invoice.findFirst({
  where: {
    id,
    tenantId,
    deletedAt: null,
  },
  include: {
    account: true,
    items: {
      where: {
        tenantId,
        deletedAt: null,
      },
    },
  },
})
```

---

## 9. Raw Query Kuralları

Raw query son çaredir. Kullanılacaksa tenant filtresi zorunludur.

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
// ❌ SQL injection ve tenant sızıntısı riski
await prisma.$queryRawUnsafe(`
  SELECT * FROM accounts WHERE name = '${search}'
`)
```

Kurallar:

```txt
- $queryRaw tercih edilir
- Parametre binding kullanılır
- $queryRawUnsafe kullanılmaz
- tenant_id filtresi zorunludur
- deleted_at filtresi aktif kayıtlar için zorunludur
```

---

## 10. Soft Delete ile Tenant Güvenliği

Silinen kayıtlar aktif listelerde görünmez.

```ts
where: {
  tenantId,
  deletedAt: null,
}
```

Soft delete işlemi:

```ts
await prisma.account.update({
  where: { id: existing.id },
  data: {
    deletedAt: new Date(),
  },
})
```

Silmeden önce kayıt tenantId ile bulunur.

---

## 11. Frontend Tenant/Auth Koruması

Frontend UI görevi sırasında şu davranışlar değiştirilmez:

```txt
- API client base URL
- Auth token gönderimi
- x-tenant-id header injection
- Refresh token akışı
- Logout akışı
- Token storage
- Tenant seçimi / tenant context mekanizması
```

Frontend polish görevi sırasında bu dosyalara dokunulmaz. Eğer sorun fark edilirse ayrı güvenlik görevi olarak raporlanır.

---

## 12. Export ve Rapor Güvenliği

Export ve rapor endpointleri tenant izolasyonuna uymalıdır.

```ts
async exportAccounts(filter: FilterAccountDto) {
  const tenantId = this.tenantContext.getTenantId()

  return this.prisma.account.findMany({
    where: {
      tenantId,
      deletedAt: null,
      ...this.buildFilter(filter),
    },
  })
}
```

Yasak:

```txt
❌ Export için tüm veriyi çekmek
❌ tenantId’siz rapor aggregate yazmak
❌ Frontend’de tüm kayıtları çekip export etmek
```

---

## 13. Background Job / Queue Tenant Kuralı

Queue/job işlemlerinde tenantId job payload içinde açık ve güvenli şekilde taşınmalıdır.

```ts
await queue.add('export-accounts', {
  tenantId,
  requestedBy: userId,
  filter,
})
```

Job içinde tenantId zorunlu doğrulanır.

---

## 14. Cache Tenant Kuralı

Cache key tenantId içermelidir.

```ts
const key = `tenant:${tenantId}:accounts:list:${hashFilter(filter)}`
```

Yanlış:

```ts
// ❌ Tenant sızıntısı riski
const key = `accounts:list:${hashFilter(filter)}`
```

---

## 15. Test / Review Kontrolü

Tenant güvenliği etkileyen değişikliklerde agent şu kontrolleri yapar:

- [ ] Controller AuthGuard + TenantGuard kullanıyor mu?
- [ ] Service tenantContext.getTenantId() kullanıyor mu?
- [ ] Tüm findMany/findFirst/count/aggregate sorgularında tenantId var mı?
- [ ] Aktif kayıt sorgularında deletedAt: null var mı?
- [ ] Raw query tenant_id içeriyor mu?
- [ ] Export/rapor endpointlerinde tenant filtresi var mı?
- [ ] Frontend tenant/auth interceptor değiştirilmedi mi?
- [ ] Cache key varsa tenantId içeriyor mu?
- [ ] Queue job varsa tenantId taşıyor mu?

---

## 16. Kritik Uyarı

Tenant güvenliği konusunda belirsizlik varsa agent kod yazmayı durdurur ve raporlar.

```txt
Tenant izolasyonu tahminle çözülmez.
Mevcut proje pattern’i incelenir.
Gerekirse kullanıcıdan onay istenir.
```
