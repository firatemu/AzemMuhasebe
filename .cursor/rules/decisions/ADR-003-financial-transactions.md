# ADR-003 — Financial Transactions

**Proje:** Muhasebe  
**Durum:** Kabul edildi  
**Tarih:** 31 Mayıs 2026  
**Karar Türü:** Finansal veri bütünlüğü / Transaction yönetimi

---

## 1. Bağlam

Muhasebe projesinde fatura, cari hareket, stok hareketi, tahsilat, ödeme, kasa ve banka işlemleri birbirine bağlı finansal kayıtlar üretir.

Bu işlemlerden birinin eksik veya yarım kalması finansal veri bütünlüğünü bozar.

Örnek risk:

```txt
Fatura oluşur ama cari hareket oluşmaz.
Stok düşer ama fatura oluşmaz.
Tahsilat oluşur ama fatura durumu kapanmaz.
Cari bakiye değişir ama kasa/banka hareketi oluşmaz.
```

Bu nedenle finansal işlemler atomik transaction olarak ele alınmalıdır.

---

## 2. Karar

Finansal, stok veya cari bakiye etkileyen tüm işlemler database transaction içinde yapılacaktır.

Ana karar:

```txt
Ya tüm işlem başarıyla tamamlanır ya da tüm işlem rollback olur.
```

Kısmi işlem kabul edilmez.

---

## 3. Transaction Gerektiren İşlemler

Aşağıdaki işlemler transaction olmadan yapılmaz:

```txt
- Satış faturası oluşturma
- Alış faturası oluşturma
- Fatura iptal
- Fatura kalem değişikliği
- Tahsilat oluşturma
- Ödeme oluşturma
- Cari hareket oluşturma
- Stok hareketi oluşturma
- Depo transferi
- Kasa hareketi
- Banka hareketi
- Çek/senet durum değişikliği
- Stok sayım düzeltmesi
```

---

## 4. Fatura Transaction Zinciri

Fatura işlemi genellikle şu kayıtları birlikte üretir:

```txt
Invoice
  ├── InvoiceItem
  ├── AccountMovement
  └── ProductMovement
```

Satış faturası:

```txt
Invoice SALES
  ├── InvoiceItem
  ├── AccountMovement DEBIT
  └── ProductMovement EXIT
```

Alış faturası:

```txt
Invoice PURCHASE
  ├── InvoiceItem
  ├── AccountMovement
  └── ProductMovement ENTRY
```

Mevcut projedeki fatura tipi ve enum değerleri korunur; agent yeni enum uydurmaz.

---

## 5. Tahsilat Transaction Zinciri

Tahsilat işlemi genellikle şu kayıtları birlikte üretir:

```txt
Collection
  ├── InvoiceCollection
  ├── AccountMovement
  ├── CashboxMovement veya BankAccountMovement
  └── Invoice status update
```

Tahsilat sonrası fatura durumu yeniden hesaplanır:

```txt
paidAmount = 0              → OPEN
0 < paidAmount < grandTotal → PARTIALLY_PAID
paidAmount >= grandTotal    → CLOSED
```

---

## 6. Ödeme Transaction Zinciri

Ödeme işlemi genellikle şu kayıtları birlikte üretir:

```txt
Payment
  ├── PaymentInvoice / PaymentRelation
  ├── AccountMovement
  ├── CashboxMovement veya BankAccountMovement
  └── İlgili belge/borç durum update
```

Mevcut projedeki model isimleri farklıysa mevcut isimler korunur.

---

## 7. Stok Transaction Zinciri

Stok hareketi veya transfer işlemleri:

```txt
ProductLocationStock
  ├── Quantity update
  └── ProductMovement
```

Transfer işlemi:

```txt
Source Location decrement
Target Location increment
ProductMovement source
ProductMovement target
```

Bu kayıtlar aynı transaction içinde yapılır.

---

## 8. Prisma Transaction Pattern

Önerilen pattern:

```ts
await this.prisma.$transaction(
  async (tx) => {
    const invoice = await tx.invoice.create({
      data: {
        ...invoiceData,
        tenantId,
      },
    })

    await tx.invoiceItem.createMany({
      data: items.map((item) => ({
        ...item,
        invoiceId: invoice.id,
        tenantId,
      })),
    })

    await tx.accountMovement.create({
      data: {
        accountId: invoice.accountId,
        invoiceId: invoice.id,
        type: 'DEBIT',
        amount: invoice.total,
        tenantId,
      },
    })

    return invoice
  },
  { isolationLevel: 'Serializable' },
)
```

---

## 9. Isolation Level

Finansal işlemlerde tercih edilen isolation level:

```txt
Serializable
```

Neden?

```txt
- Eş zamanlı işlem risklerini azaltır
- Stok/bakiye tutarlılığını güçlendirir
- Aynı belge veya bakiye üzerinde race condition riskini azaltır
```

Performans veya kilitlenme sorunları yaşanırsa isolation stratejisi ayrıca analiz edilir; agent kendiliğinden düşürmez.

---

## 10. Frontend Sınırı

Frontend:

```txt
✅ Form validasyonu yapabilir
✅ Ön toplam gösterebilir
✅ Kullanıcı onayı alabilir
✅ Confirmation dialog gösterebilir
```

Frontend:

```txt
❌ Nihai finansal toplam otoritesi değildir
❌ Cari hareket oluşturmaz
❌ Stok hareketi oluşturmaz
❌ Fatura durumunu tek başına belirlemez
❌ Transaction zincirini client tarafında yönetmez
```

Backend finansal otoritedir.

---

## 11. Toplam ve Decimal Kuralı

Finansal toplamlar backend’de hesaplanır.

```txt
subtotal
discountTotal
taxTotal
grandTotal
paidAmount
remainingAmount
```

Kurallar:

```txt
- Frontend total değerine kör güvenilmez
- Decimal hassasiyeti korunur
- Yuvarlama kuralları merkezi olmalıdır
- Vergi/iskonto hesapları backend’de doğrulanır
```

---

## 12. İptal / Ters Hareket Kuralı

Finansal kayıtlar çoğu durumda hard delete yapılmaz.

İptal veya düzeltme için:

```txt
- Status CANCELLED yapılır
- Ters hareket oluşturulur
- Stok hareketi terslenir
- Cari hareket terslenir
- Audit/log tutulur
```

Ödenmiş/kısmi ödenmiş faturaların iptali özel kural gerektirir.

Agent mevcut iş kuralını incelemeden iptal mantığı uydurmaz.

---

## 13. Idempotency Kuralı

Tekrarlanan işlem risklerinde idempotency gereklidir.

Örnekler:

```txt
- Ödeme callback tekrar geldi
- Tahsilat isteği çift gönderildi
- Kullanıcı submit butonuna iki kez bastı
- Dış entegrasyon aynı belgeyi tekrar gönderdi
```

Çözüm:

```txt
- Idempotency key
- Unique reference
- Existing transaction check
- Safe retry handling
```

---

## 14. Audit / Log

Kritik finansal işlemler loglanmalıdır:

```txt
- Fatura oluşturma
- Fatura iptal
- Tahsilat oluşturma
- Tahsilat iptal
- Ödeme oluşturma
- Ödeme iptal
- Cari hareket düzeltme
- Stok hareketi düzeltme
```

Log içinde hassas veri veya gereksiz kişisel bilgi yazılmaz.

---

## 15. Hata Yönetimi

Transaction içinde hata oluşursa işlem rollback olur.

Kullanıcıya güvenli mesaj döner:

```ts
throw new BadRequestException('Fatura oluşturulamadı')
throw new BadRequestException('Yetersiz stok')
throw new BadRequestException('Geçersiz ödeme tutarı')
```

Teknik detaylar loglanır; kullanıcıya stack trace dönmez.

---

## 16. Sonuçlar

Avantajlar:

```txt
✅ Finansal veri bütünlüğü korunur
✅ Kısmi işlem riski azalır
✅ Cari/stok/fatura zinciri tutarlı kalır
✅ Audit ve iptal senaryoları daha güvenli olur
```

Bedeller:

```txt
- Transaction kodları daha dikkat ister
- Eş zamanlı işlem ve lock yönetimi izlenmelidir
- Bazı işlemler performans açısından daha maliyetli olabilir
```

---

## 17. Agent Kuralları

AI agent:

```txt
✅ Finansal işlemde transaction kullanır
✅ TenantId tüm ilgili kayıtlara ekler
✅ AccountMovement/ProductMovement zincirini kontrol eder
✅ Frontend total değerine güvenmez
✅ İptal senaryosunu analiz eder
✅ Gerekirse kullanıcı onayı ister
```

AI agent yapmaz:

```txt
❌ Finansal işlemi transaction dışında yazmaz
❌ Fatura oluşturup cari hareketi atlamaz
❌ Stok hareketini unutmaz
❌ Hard delete ile finansal kayıt silmez
❌ Enum/status uydurmaz
❌ Client tarafını finansal otorite yapmaz
```

---

## 18. İlgili Dosyalar

```txt
.cursor/rules/skills/invoice-engine-skill.md
.cursor/rules/skills/prisma-erp-skill.md
.cursor/rules/skills/warehouse-stock-skill.md
.cursor/rules/skills/tenant-security-skill.md
.cursor/rules/context-map/module-context-map.md
```
