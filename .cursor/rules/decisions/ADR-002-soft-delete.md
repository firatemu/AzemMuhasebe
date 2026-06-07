# ADR-002 — Soft Delete

**Proje:** Muhasebe  
**Durum:** Kabul edildi  
**Tarih:** 31 Mayıs 2026  
**Karar Türü:** Veri bütünlüğü / Audit / ERP kayıt yönetimi

---

## 1. Bağlam

Muhasebe, finansal ve operasyonel kayıtlar içeren bir ERP sistemidir. Cari hesap, fatura, stok hareketi, tahsilat, ödeme, kasa hareketi, banka hareketi ve depo işlemleri gibi kayıtlar geçmişe dönük raporlama, audit ve yasal/muhasebesel izlenebilirlik açısından önemlidir.

Bu nedenle kayıtların fiziksel olarak silinmesi çoğu durumda kabul edilemez.

---

## 2. Karar

Muhasebe projesinde varsayılan silme yaklaşımı soft delete olacaktır.

Ana karar:

```txt
Hard delete varsayılan olarak yasaktır.
Kayıtlar deletedAt alanı ile pasif hale getirilir.
```

Aktif kayıt sorgularında:

```txt
deletedAt: null
```

kullanılır.

---

## 3. Standart Alanlar

Soft delete uygulanacak modellerde önerilen alanlar:

```prisma
model Account {
  id        String    @id @default(uuid())
  tenantId  String    @map("tenant_id")
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")
  deletedAt DateTime? @map("deleted_at")
  deletedBy String?   @map("deleted_by")
}
```

Ek olarak audit gerekiyorsa:

```txt
createdBy
updatedBy
deletedReason
```

alanları modele göre değerlendirilebilir.

---

## 4. Doğru Silme Pattern’i

```ts
async softDelete(id: string): Promise<void> {
  const tenantId = this.tenantContext.getTenantId()

  const existing = await this.prisma.account.findFirst({
    where: {
      id,
      tenantId,
      deletedAt: null,
    },
  })

  if (!existing) {
    throw new NotFoundException('Kayıt bulunamadı')
  }

  await this.prisma.account.update({
    where: { id: existing.id },
    data: {
      deletedAt: new Date(),
    },
  })
}
```

---

## 5. Yanlış Silme Pattern’i

```ts
// ❌ Hard delete
await prisma.account.delete({
  where: { id },
})
```

```ts
// ❌ Tenant kontrolü olmadan silme
await prisma.account.update({
  where: { id },
  data: { deletedAt: new Date() },
})
```

---

## 6. Listeleme Kuralı

Aktif kayıt listelerinde soft deleted kayıtlar gelmez.

```ts
const accounts = await prisma.account.findMany({
  where: {
    tenantId,
    deletedAt: null,
  },
})
```

Detay sorgusunda da aynı kural geçerlidir:

```ts
const account = await prisma.account.findFirst({
  where: {
    id,
    tenantId,
    deletedAt: null,
  },
})
```

---

## 7. Finansal Kayıtlar İçin Ek Kural

Finansal kayıtlar çoğu durumda silinmez; iptal edilir veya ters hareket oluşturulur.

Örnekler:

```txt
- Fatura silinmez, iptal edilir
- Tahsilat silinmez, iptal edilir veya ters hareket oluşturulur
- Ödeme silinmez, iptal edilir veya ters hareket oluşturulur
- Stok hareketi silinmez, düzeltme hareketi oluşturulur
```

Bu nedenle finansal kayıtlar için “sil” butonu yerine çoğu durumda:

```txt
İptal Et
Düzeltme Oluştur
Ters Hareket Oluştur
```

yaklaşımı tercih edilir.

---

## 8. Restore Kuralı

Soft delete edilmiş kayıtların geri alınması özel işlemdir.

Restore yapılmadan önce:

```txt
- Kayıt aynı tenant’a ait mi?
- Bağlı kayıtlar tutarlı mı?
- Aynı unique alanla yeni aktif kayıt oluşmuş mu?
- Restore audit/log gerektiriyor mu?
```

Restore işlemi kullanıcı onayı ve ayrı business rule ile yapılır.

---

## 9. Hard Delete İstisnaları

Hard delete yalnızca istisnai durumlarda mümkündür:

```txt
- Test verisi temizliği
- Geçici import staging kayıtları
- Yasal veri silme talebi
- Sistem bakım scriptleri
```

Bu durumlarda:

```txt
- Kullanıcı onayı gerekir
- Etki analizi gerekir
- Tenant güvenliği korunur
- Production’da dikkatli uygulanır
```

AI agent kullanıcı onayı olmadan hard delete uygulamaz.

---

## 10. Unique Constraint Etkisi

Soft delete kullanılan modellerde unique constraint tasarımı dikkatli yapılmalıdır.

Örnek risk:

```txt
Silinen cari ile aynı ada sahip yeni cari oluşturulabilir mi?
```

Bu modele göre değerlendirilir.

---

## 11. Index Kuralı

Soft delete performansı için önerilen indexler:

```prisma
@@index([tenantId])
@@index([deletedAt])
@@index([tenantId, deletedAt])
```

Sık filtrelenen alanlarda:

```prisma
@@index([tenantId, deletedAt, status])
@@index([tenantId, deletedAt, createdAt])
```

Index eklemek migration gerektirir; kullanıcı onayı olmadan uygulanmaz.

---

## 12. Sonuçlar

Avantajlar:

```txt
✅ Audit geçmişi korunur
✅ Yanlışlıkla silme riski azaltılır
✅ Finansal geçmiş bozulmaz
✅ Raporlama ve inceleme yapılabilir
✅ Geri alma senaryoları mümkün olur
```

Bedeller:

```txt
- Her aktif sorguda deletedAt filtresi gerekir
- Unique constraint tasarımı dikkat ister
- Veri tabanı büyür
- Gerçek silme için ayrı bakım stratejisi gerekir
```

---

## 13. Agent Kuralları

AI agent:

```txt
✅ Silme işlemlerinde soft delete kullanır
✅ Aktif sorgulara deletedAt: null ekler
✅ Finansal kayıtlarda iptal/ters hareket yaklaşımını değerlendirir
✅ Hard delete gerekiyorsa kullanıcı onayı ister
```

AI agent yapmaz:

```txt
❌ Varsayılan olarak delete/deleteMany kullanmaz
❌ Finansal kayıtları fiziksel silmez
❌ deletedAt filtresini unutmaz
❌ Tenant kontrolü olmadan soft delete yapmaz
```

---

## 14. İlgili Dosyalar

```txt
.cursor/rules/skills/prisma-erp-skill.md
.cursor/rules/skills/tenant-security-skill.md
.cursor/rules/skills/invoice-engine-skill.md
.cursor/rules/workflows/backend-api-patterns.md
```
