# WAREHOUSE STOCK SKILL — Muhasebe

**Proje:** Muhasebe  
**Kapsam:** Depo, lokasyon, stok hareketleri, stok transferi, sayım, ürün-lokasyon stok güvenliği  
**Stack:** NestJS + Prisma + PostgreSQL  
**Son Güncelleme:** 31 Mayıs 2026

> Bu skill, Muhasebe projesinde stok ve depo işlemlerinin güvenli yürütülmesi için kullanılır. Stok işlemleri finansal ve operasyonel doğruluğu etkiler; transaction ve tenant güvenliği zorunludur.

---

## 1. Ne Zaman Okunur?

Bu skill şu görevlerde mutlaka okunur:

```txt
- Ürün stok işlemleri
- Depo oluşturma/güncelleme
- Lokasyon yönetimi
- Stok hareketi oluşturma
- Depolar arası transfer
- Lokasyonlar arası transfer
- Sayım işlemi
- Stok düzeltme
- Fatura ile stok hareketi ilişkisi
- Kritik stok raporu
```

---

## 2. Ana Model Mantığı

Genel yapı:

```txt
Warehouse
  └── Location
        └── ProductLocationStock

Product
  └── ProductMovement
```

Anlam:

```txt
Warehouse             → Depo
Location              → Depo içi raf/lokasyon
ProductLocationStock  → Ürün x lokasyon bazlı miktar
ProductMovement       → Stok hareket logu
```

---

## 3. Ana Kurallar

```txt
✅ Her stok verisi tenantId içerir
✅ Aktif depo/lokasyon sorgularında deletedAt: null kullanılır
✅ Stok hareketleri transaction içinde yapılır
✅ Negatif stok kontrolü yapılır
✅ Transfer işlemi kaynak ve hedef hareketleriyle birlikte atomik olmalıdır
✅ Stok düzeltmeleri loglanmalıdır
✅ Fatura kaynaklı stok hareketleri fatura transaction zinciri içinde oluşmalıdır
```

Yasaklar:

```txt
❌ tenantId olmadan stok sorgusu
❌ Negatif stok oluşturmak
❌ Transferde sadece kaynak veya sadece hedef güncellemek
❌ Stok miktarını hareket logu olmadan değiştirmek
❌ Hard delete ile stok hareketi silmek
❌ Fatura dışında manuel stok düşüp cari/fatura zincirini bozmak
```

---

## 4. Depo / Lokasyon Sorguları

Depo listeleme:

```ts
await prisma.warehouse.findMany({
  where: {
    tenantId,
    deletedAt: null,
    isActive: true,
  },
})
```

Lokasyon listeleme:

```ts
await prisma.location.findMany({
  where: {
    tenantId,
    deletedAt: null,
    warehouseId,
  },
})
```

---

## 5. Stok Sorgulama

Ürünün toplam stoğu:

```ts
const result = await prisma.productLocationStock.aggregate({
  where: {
    tenantId,
    productId,
  },
  _sum: {
    quantity: true,
  },
})
```

Belirli depodaki stok:

```ts
const result = await prisma.productLocationStock.aggregate({
  where: {
    tenantId,
    productId,
    location: {
      warehouseId,
      tenantId,
      deletedAt: null,
    },
  },
  _sum: {
    quantity: true,
  },
})
```

---

## 6. Stok Hareket Tipleri

Önerilen hareket tipleri:

| Tip | Anlam | Etki |
|---|---|---|
| `ENTRY` | Stok girişi | + |
| `EXIT` | Stok çıkışı | - |
| `TRANSFER` | Depo/lokasyon transferi | +/- |
| `ADJUSTMENT` | Manuel düzeltme | +/- |
| `COUNT_SURPLUS` | Sayım fazlası | + |
| `COUNT_SHORTAGE` | Sayım eksiği | - |
| `RETURN_IN` | İade girişi | + |
| `RETURN_OUT` | İade çıkışı | - |

Mevcut projedeki enum farklıysa mevcut enum korunur; agent yeni enum uydurmaz.

---

## 7. Stok Giriş Pattern

```ts
await prisma.$transaction(async (tx) => {
  await tx.productLocationStock.upsert({
    where: {
      productId_locationId_tenantId: {
        productId,
        locationId,
        tenantId,
      },
    },
    create: {
      productId,
      locationId,
      tenantId,
      quantity,
    },
    update: {
      quantity: {
        increment: quantity,
      },
    },
  })

  await tx.productMovement.create({
    data: {
      tenantId,
      productId,
      locationId,
      type: 'ENTRY',
      quantity,
      referenceType: 'MANUAL',
    },
  })
})
```

---

## 8. Stok Çıkış Pattern

Çıkışta negatif stok kontrolü zorunludur.

```ts
await prisma.$transaction(async (tx) => {
  const stock = await tx.productLocationStock.findFirst({
    where: {
      tenantId,
      productId,
      locationId,
    },
  })

  if (!stock || stock.quantity < quantity) {
    throw new BadRequestException('Yetersiz stok')
  }

  await tx.productLocationStock.update({
    where: { id: stock.id },
    data: {
      quantity: {
        decrement: quantity,
      },
    },
  })

  await tx.productMovement.create({
    data: {
      tenantId,
      productId,
      locationId,
      type: 'EXIT',
      quantity,
      referenceType: 'MANUAL',
    },
  })
})
```

Decimal tip kullanılıyorsa karşılaştırma Decimal metodlarıyla yapılır.

---

## 9. Depo / Lokasyon Transfer Pattern

Transfer atomik olmalıdır.

```txt
1. Kaynak lokasyon doğrula
2. Hedef lokasyon doğrula
3. Kaynak stok yeterli mi kontrol et
4. Kaynak stoktan düş
5. Hedef stoka ekle
6. ProductMovement kayıtlarını oluştur
7. Transaction commit
```

---

## 10. Sayım Pattern

```txt
currentQty = sistemdeki stok
countedQty = sayılan stok
difference = countedQty - currentQty
```

Durum:

```txt
difference > 0 → COUNT_SURPLUS
difference < 0 → COUNT_SHORTAGE
difference = 0 → hareket gerekmez veya audit log yeterlidir
```

Sayım farkı transaction içinde uygulanır.

---

## 11. Fatura Kaynaklı Stok Hareketi

Fatura stok etkiliyorsa stok hareketi invoice transaction içinde oluşmalıdır.

Satış faturası:

```txt
Invoice SALES → ProductMovement EXIT
```

Alış faturası:

```txt
Invoice PURCHASE → ProductMovement ENTRY
```

---

## 12. Stok Düzeltme Kuralı

Manuel stok düzeltme kritik işlemdir.

Kurallar:

```txt
- Permission gerektirir
- Sebep/açıklama alınmalıdır
- ProductMovement oluşturulmalıdır
- Audit/log tutulmalıdır
- Transaction içinde yapılmalıdır
```

Frontend’de confirmation dialog gerektirir.

---

## 13. Kritik Stok / Rapor Kuralı

Rapor sorguları tenant filtreli olmalıdır.

```ts
await prisma.productLocationStock.findMany({
  where: {
    tenantId,
    quantity: {
      lte: criticalThreshold,
    },
  },
  include: {
    product: true,
    location: true,
  },
})
```

Büyük raporlarda pagination veya backend export kullanılır.

---

## 14. Silme Kuralları

Depo/lokasyon soft delete yapılır.

Depo silmeden önce:

```txt
- İçinde aktif lokasyon var mı?
- Lokasyonlarda stok var mı?
- Açık transfer var mı?
- Geçmiş hareket ilişkileri var mı?
```

Stok hareket kayıtları hard delete yapılmaz.

---

## 15. Tenant Güvenliği

Tüm stok/depo query’lerinde tenantId zorunludur:

```ts
where: {
  tenantId,
  deletedAt: null,
}
```

Ürün, depo, lokasyon ve stok kayıtlarının aynı tenant’a ait olduğu doğrulanır.

---

## 16. Frontend Sınırı

Frontend stok ekranları:

```txt
✅ Form validation yapabilir
✅ Stok miktarını gösterebilir
✅ Transfer talebi oluşturabilir
✅ Confirmation dialog gösterebilir
```

Frontend:

```txt
❌ Stok miktarını kendi başına düşmez/artırmaz
❌ Stok hesaplamasında nihai otorite değildir
❌ Fatura kaynaklı stok hareketini client tarafında üretmez
```

---

## 17. Yasaklar

```txt
❌ Negatif stok oluşturmak
❌ Movement log olmadan stok miktarı değiştirmek
❌ Transferi transaction dışında yapmak
❌ Kaynak düşüp hedef eklemeyi unutmak
❌ tenantId olmadan stok sorgulamak
❌ Fatura transaction’ı dışında fatura stok hareketi oluşturmak
❌ Stok hareketini hard delete yapmak
❌ Büyük stok raporunu pagination olmadan çekmek
```

---

## 18. AI Agent Kontrol Listesi

- [ ] İşlem stok miktarını etkiliyor mu?
- [ ] Transaction kullanıldı mı?
- [ ] tenantId tüm sorgularda var mı?
- [ ] Ürün tenant’a ait mi?
- [ ] Depo/lokasyon tenant’a ait mi?
- [ ] Negatif stok kontrol edildi mi?
- [ ] ProductMovement oluştu mu?
- [ ] Transfer kaynak ve hedefi birlikte güncelliyor mu?
- [ ] Sayım farkı doğru hesaplandı mı?
- [ ] Manuel düzeltme audit/permission gerektiriyor mu?
- [ ] Fatura kaynaklı stok hareketi invoice transaction içinde mi?
