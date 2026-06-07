# INVOICE ENGINE SKILL — Muhasebe

**Proje:** Muhasebe  
**Kapsam:** Fatura, cari hareket, stok hareketi, tahsilat/ödeme ve finansal transaction kuralları  
**Stack:** NestJS + Prisma + PostgreSQL  
**Son Güncelleme:** 31 Mayıs 2026

> Bu skill, Muhasebe projesinin finansal işlem güvenliği için kritik dosyadır. Fatura, cari, stok, tahsilat ve ödeme işlemleri veri bütünlüğü gerektirir. Kısmi işlem kabul edilmez.

---

## 1. Ne Zaman Okunur?

Bu skill şu görevlerde mutlaka okunur:

```txt
- Satış faturası oluşturma
- Alış faturası oluşturma
- Fatura güncelleme
- Fatura iptal
- Tahsilat işlemi
- Ödeme işlemi
- Cari hareket oluşturma
- Stok hareketi oluşturan fatura işlemi
- Fatura durum geçişleri
- Finansal rapor veya bakiye hesaplama
```

---

## 2. Ana İlke

Finansal işlemlerde atomiklik zorunludur.

```txt
Ya tüm işlem başarıyla tamamlanır ya da hiçbir parçası kalıcı olmaz.
```

Fatura oluşturma genellikle şu zinciri etkiler:

```txt
Invoice
  ├── InvoiceItem
  ├── ProductMovement
  └── AccountMovement
```

Bu zincir transaction dışında kurulmaz.

---

## 3. Fatura Yaşam Döngüsü

Önerilen durum akışı:

```txt
DRAFT
  ↓
PENDING
  ↓
OPEN
  ├── PARTIALLY_PAID
  ├── CLOSED
  └── CANCELLED
```

Mevcut projede farklı enum varsa mevcut enum korunur; agent yeni enum uydurmaz.

---

## 4. Transaction Zorunluluğu

Aşağıdaki işlemler transaction olmadan yapılmaz:

```txt
- Fatura oluşturma
- Fatura iptal
- Fatura kalemi değiştirme
- Tahsilat oluşturma
- Ödeme oluşturma
- Cari hareket oluşturma
- Stok hareketi oluşturma
- Depo çıkışı/girişi etkileyen fatura işlemi
```

---

## 5. Fatura Oluşturma Kuralları

Fatura oluşturulurken sıralama:

```txt
1. Tenant doğrula
2. DTO validation
3. Cari hesap kontrolü
4. Ürün/stok kontrolü
5. Fatura numarası üret
6. Transaction başlat
7. Invoice oluştur
8. InvoiceItem kayıtlarını oluştur
9. ProductMovement kayıtlarını oluştur
10. AccountMovement kaydı oluştur
11. Commit
12. Gerekirse event/log oluştur
```

Kurallar:

```txt
- tenantId her kayda yazılır
- Fatura kalemleri boş olamaz
- Toplamlar backend’de hesaplanır
- Frontend’den gelen total değere kör güvenilmez
- Cari hesap tenant’a ait olmalıdır
- Ürünler tenant’a ait olmalıdır
- Stok yetersizse işlem başlamadan veya transaction içinde hata verilmelidir
```

---

## 6. Toplam Hesaplama Kuralı

Finansal toplamlar backend’de otoritatif hesaplanır.

```txt
subtotal = quantity * unitPrice
discountTotal = iskonto toplamı
taxTotal = KDV toplamı
grandTotal = subtotal - discountTotal + taxTotal
```

Frontend total sadece ön izleme olabilir.

---

## 7. Stok Hareketi Kuralı

Satış faturası genellikle stok çıkışı oluşturur:

```txt
SALES invoice → ProductMovement EXIT
```

Alış faturası genellikle stok girişi oluşturur:

```txt
PURCHASE invoice → ProductMovement ENTRY
```

---

## 8. Cari Hareket Kuralı

Satış faturası cari borç oluşturur:

```txt
SALES invoice → AccountMovement DEBIT
```

Cari hareket transaction içinde oluşur ve backend hesaplanan invoice total ile uyumlu olur.

---

## 9. Fatura Güncelleme Kuralı

Genel kural:

```txt
DRAFT faturalar düzenlenebilir.
OPEN/PARTIALLY_PAID/CLOSED faturalar doğrudan düzenlenmez.
```

Açık veya ödenmiş fatura düzeltilecekse mevcut business modele göre iptal, düzeltme faturası veya ters hareket yaklaşımı uygulanır.

---

## 10. Fatura İptal Kuralı

Fatura iptali kritik işlemdir.

İptal öncesi kontrol:

```txt
- Fatura var mı?
- Tenant’a ait mi?
- Zaten iptal mi?
- Ödeme/tahsilat var mı?
- Stok hareketi terslenebilir mi?
- Cari hareket terslenebilir mi?
- Dönem kilidi var mı?
```

İptal transaction içinde yapılır.

---

## 11. Tahsilat Kuralı

Tahsilat cari bakiyeyi ve fatura ödeme durumunu etkiler.

Transaction içinde:

```txt
1. Collection oluştur
2. InvoiceCollection ilişkisi oluştur
3. CashboxMovement veya BankAccountMovement oluştur
4. AccountMovement oluştur
5. Invoice status güncelle
```

---

## 12. Ödeme Kuralı

Ödeme işlemleri de transaction gerektirir.

```txt
1. Payment oluştur
2. İlgili fatura/borç ilişkisi oluştur
3. CashboxMovement veya BankAccountMovement oluştur
4. AccountMovement oluştur
5. İlgili durum güncellenir
```

---

## 13. Durum Güncelleme Kuralı

```txt
paidAmount = 0              → OPEN
0 < paidAmount < grandTotal → PARTIALLY_PAID
paidAmount >= grandTotal    → CLOSED
```

İptal faturalar için ödeme işlemi yapılmaz.

---

## 14. Idempotency Kuralı

Ödeme, tahsilat veya dış entegrasyon işlemlerinde tekrar eden istek riski varsa idempotency uygulanmalıdır.

```txt
- Aynı ödeme iki kez işlenmemeli
- Aynı tahsilat iki kez oluşmamalı
- Entegrasyon callback tekrar gelirse güvenli karşılanmalı
```

---

## 15. Audit / Log Kuralı

Kritik finansal işlemler loglanmalıdır:

```txt
- Fatura oluşturma
- Fatura iptal
- Tahsilat oluşturma/iptal
- Ödeme oluşturma/iptal
- Cari hareket düzeltme
- Stok hareketi düzeltme
```

---

## 16. Frontend Sınırı

Frontend:

```txt
✅ Ön izleme yapabilir
✅ Form validation yapabilir
✅ Kullanıcı deneyimi sağlar
```

Frontend:

```txt
❌ Nihai finansal toplam otoritesi değildir
❌ Stok düşme işlemi yapmaz
❌ Cari hareket oluşturmaz
❌ Fatura durumunu tek başına belirlemez
```

---

## 17. Yasaklar

```txt
❌ Fatura oluşturup stok/cari hareket oluşturmamak
❌ Stok hareketi oluşturup cari hareketi atlamak
❌ Transaction dışında finansal kayıt oluşturmak
❌ Frontend total değerine kör güvenmek
❌ Ödenmiş faturayı kontrolsüz iptal etmek
❌ Tenant kontrolü olmadan fatura/cari/stok sorgulamak
❌ Hard delete ile finansal kayıt silmek
❌ Finansal enum/status uydurmak
```

---

## 18. AI Agent Kontrol Listesi

- [ ] İşlem finansal mı?
- [ ] Transaction kullanıldı mı?
- [ ] tenantId tüm kayıtlara yazıldı mı?
- [ ] Fatura tenant’a ait mi?
- [ ] Cari tenant’a ait mi?
- [ ] Ürünler tenant’a ait mi?
- [ ] Stok yeterliliği kontrol edildi mi?
- [ ] Toplam backend’de hesaplandı mı?
- [ ] AccountMovement oluştu mu?
- [ ] ProductMovement gerekiyorsa oluştu mu?
- [ ] İptal senaryosu güvenli mi?
- [ ] Ödeme/tahsilat varsa status doğru mu?
- [ ] Audit/log gerekli mi?
