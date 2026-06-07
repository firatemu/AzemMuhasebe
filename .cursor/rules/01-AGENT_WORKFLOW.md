# AGENT WORKFLOW — Muhasebe

**Proje:** Muhasebe  
**Kapsam:** Cursor AI agent çalışma metodolojisi  
**Stack:** NestJS + Next.js App Router + TypeScript + Prisma + PostgreSQL + Tailwind CSS + shadcn/ui + MUI X DataGrid  
**Son Güncelleme:** 31 Mayıs 2026

> Bu dosya Cursor AI agent'ın Muhasebe projesinde nasıl çalışacağını tanımlar. Agent her görevde önce görevin türünü belirler, sonra doğru kural/skill/workflow dosyalarını okur, ardından güvenli ve kontrollü şekilde uygular.

---

## 1. Ana İlke

AI agent bu projede hızlı ama kontrolsüz çalışan bir kod üretici değildir.

Agent şu şekilde davranır:

```txt
1. Anla
2. Bağlam topla
3. Görev türünü belirle
4. Doğru kural dosyalarını oku
5. Planla
6. Uygula
7. Doğrula
8. Raporla
```

Kod yazmadan önce proje kimliği, mimari sınırlar ve görev kapsamı anlaşılmalıdır.

---

## 2. Proje Kimliği Önceliği

Her görevde ana kaynak:

```txt
.cursor/rules/00-PROJECT_IDENTITY.md
```

Agent şu kuralları her zaman kabul eder:

```txt
- Projenin adı Muhasebe'dir
- Eski proje adları kullanılmaz
- Supabase'e geçiş yapılmaz
- Mevcut PostgreSQL + Prisma + NestJS mimarisi korunur
- Proje genel KOBİ muhasebe / ERP sistemidir
- Tarım sektörü ana proje kimliği değildir
```

---

## 3. Görev Sınıflandırması

Agent, kullanıcı isteğini önce aşağıdaki görev türlerinden birine ayırır.

### 3.1 Frontend UI / UX Görevi

Örnekler:

```txt
- Sayfa tasarımını iyileştir
- Form ekranını düzenle
- Dashboard görünümünü modernleştir
- DataGrid tasarımını düzelt
- Mobil responsive sorununu çöz
- shadcn component yapısına taşı
```

Okunacak dosyalar:

```txt
1. 00-PROJECT_IDENTITY.md
2. 02-CODING_STANDARDS.md
3. 02A-CODING_STANDARDS_FRONTEND.md
4. 03-DESIGN_SYSTEM.md
5. 04-UI_COMPONENT_BOUNDARIES.md
6. workflows/frontend-page-patterns.md
7. workflows/frontend-polish-workflow.md
8. skills/ui-ux-review-skill.md
```

Temel yasaklar:

```txt
- Backend değiştirme
- API contract değiştirme
- Prisma schema değiştirme
- Auth interceptor değiştirme
- Tenant header mekanizmasını değiştirme
- Finansal işlem mantığına dokunma
```

---

### 3.2 DataGrid / Liste Ekranı Görevi

Örnekler:

```txt
- Cari listesini düzenle
- Fatura tablosuna filtre ekle
- Server-side pagination düzelt
- Listeye KPI kartları ekle
- Tablo boş/hata/yükleme durumlarını düzelt
```

Okunacak dosyalar:

```txt
1. 03-DESIGN_SYSTEM.md
2. 04-UI_COMPONENT_BOUNDARIES.md
3. workflows/frontend-page-patterns.md
4. workflows/datagrid-patterns.md
5. skills/datagrid-skill.md
```

Kurallar:

```txt
- MUI X sadece DataGrid için kullanılır
- MUI Material kullanılmaz
- DataGrid ortak wrapper veya ortak style ile kullanılır
- Para, bakiye ve miktar değerleri sağ hizalı ve tabular-nums olmalıdır
- Empty / error / loading state olmalıdır
```

---

### 3.3 Backend API Görevi

Örnekler:

```txt
- Yeni endpoint ekle
- DTO güncelle
- Service metodu yaz
- Controller düzenle
- Listeleme endpointine filtre ekle
```

Okunacak dosyalar:

```txt
1. 00-PROJECT_IDENTITY.md
2. 02-CODING_STANDARDS.md
3. workflows/backend-api-patterns.md
4. skills/tenant-security-skill.md
5. skills/prisma-erp-skill.md
```

Kurallar:

```txt
- Controller ince kalır
- Business logic service katmanında olur
- DTO validation zorunludur
- TenantGuard/AuthGuard korunur
- Her sorguda tenantId zorunludur
- Aktif kayıt sorgularında deletedAt: null zorunludur
```

---

### 3.4 Finansal İşlem Görevi

Örnekler:

```txt
- Fatura oluşturma
- Fatura iptal
- Tahsilat oluşturma
- Ödeme oluşturma
- Cari hareket oluşturma
- Stok hareketiyle bağlantılı fatura işlemi
```

Okunacak dosyalar:

```txt
1. skills/tenant-security-skill.md
2. skills/prisma-erp-skill.md
3. skills/invoice-engine-skill.md
4. ADR-003-financial-transactions.md
5. context-map/module-dependencies.md
```

Kurallar:

```txt
- Transaction zorunludur
- Kısmi işlem kabul edilmez
- Serializable isolation tercih edilir
- Invoice + StockMovement + AccountMovement zinciri bozulmaz
- Ödeme/tahsilat varsa iptal kuralları dikkatle uygulanır
```

---

### 3.5 Stok / Depo Görevi

Örnekler:

```txt
- Depo transferi
- Stok hareketi
- Lokasyon yönetimi
- Sayım işlemi
- Kritik stok raporu
```

Okunacak dosyalar:

```txt
1. skills/tenant-security-skill.md
2. skills/prisma-erp-skill.md
3. skills/warehouse-stock-skill.md
4. context-map/module-dependencies.md
```

Kurallar:

```txt
- Negatif stok kontrol edilir
- Transfer transaction içinde yapılır
- Lokasyon bazlı stok güncellenir
- Hareket logları tutulur
```

---

### 3.6 Debugging Görevi

Örnekler:

```txt
- Hata çöz
- Build kırılıyor
- API 500 dönüyor
- DataGrid boş kalıyor
- Form submit olmuyor
- Tenant hatası var
```

Okunacak dosyalar:

```txt
1. 05-DEBUGGING_GUIDE.md
2. İlgili görev türünün skill/workflow dosyaları
3. İlgili kod dosyaları
```

Kurallar:

```txt
- Önce hatayı oku
- Stack trace analiz et
- Kök nedeni bul
- En küçük güvenli düzeltmeyi yap
- Test et
- Raporla
```

---

## 4. Çalışma Modları

### 4.1 Basit Görev Modu

Kapsam:

```txt
- Tek dosya küçük düzeltme
- Stil düzenleme
- Typo düzeltme
- Küçük component iyileştirme
```

Akış:

```txt
1. İlgili dosyayı oku
2. Kısa analiz yap
3. Uygula
4. Doğrula
5. Özetle
```

Onay gerekmez; ancak riskli dosyalara dokunulmaz.

---

### 4.2 Orta Görev Modu

Kapsam:

```txt
- Yeni frontend sayfası
- Yeni form
- Yeni API endpoint
- Liste/DataGrid geliştirmesi
- Modül içi refactor
```

Akış:

```txt
1. İlgili rule/skill/workflow dosyalarını oku
2. Benzer mevcut implementation bul
3. Kısa plan çıkar
4. Uygula
5. Test/doğrulama çalıştır
6. Değişen dosyaları raporla
```

---

### 4.3 Kritik Görev Modu

Kapsam:

```txt
- Finansal işlem
- Tenant güvenliği
- Auth
- Prisma schema/migration
- Transaction zinciri
- Büyük refactor
- Deployment / production config
```

Akış:

```txt
1. Detaylı analiz yap
2. Riskleri listele
3. Plan çıkar
4. Kullanıcı onayı gerektir
5. Uygula
6. Test et
7. Geri alma/risk notu raporla
```

Bu modda agent kullanıcıdan onay almadan mimari veya veri etkisi olan değişiklik yapmaz.

---

## 5. Onay Gerektiren İşlemler

Agent aşağıdaki işlemleri kullanıcı onayı olmadan yapmaz:

```txt
- Yeni dependency ekleme
- Prisma schema değiştirme
- Migration oluşturma
- Auth/tenant altyapısını değiştirme
- API contract değiştirme
- Finansal transaction mantığını değiştirme
- Hard delete uygulama
- Supabase migration başlatma
- Production/deploy config değiştirme
- Büyük çaplı MUI -> shadcn migration
- Dosya/dizin mimarisini kökten değiştirme
```

---

## 6. Frontend Polish Akışı

Frontend polish görevlerinde agent şu sırayı izler:

```txt
1. İlgili sayfa/component dosyalarını bul
2. 03-DESIGN_SYSTEM.md oku
3. 04-UI_COMPONENT_BOUNDARIES.md oku
4. 02A-CODING_STANDARDS_FRONTEND.md oku
5. workflows/frontend-page-patterns.md oku
6. Mevcut UI sorunlarını listele
7. Business logic'e dokunmadan UI düzenle
8. Loading / empty / error state kontrol et
9. Responsive davranışı kontrol et
10. Sonuç raporla
```

Varsa Browser/Playwright MCP ile:

```txt
- Sayfa açılır
- Desktop görünüm kontrol edilir
- Mobil görünüm kontrol edilir
- Console hataları kontrol edilir
- Görsel taşma ve hizalama sorunları kontrol edilir
```

---

## 7. Backend API Akışı

Backend API görevlerinde agent şu sırayı izler:

```txt
1. 02-CODING_STANDARDS.md oku
2. workflows/backend-api-patterns.md oku
3. skills/tenant-security-skill.md oku
4. skills/prisma-erp-skill.md oku
5. İlgili controller/service/dto/model dosyalarını oku
6. Mevcut pattern'e uygun kod yaz
7. tenantId/deletedAt kontrolü yap
8. Test/doğrulama çalıştır
9. Sonuç raporla
```

---

## 8. Finansal Güvenlik Akışı

Finansal görevlerde agent şu kontrolleri yapar:

```txt
- İşlem cari bakiyeyi etkiliyor mu?
- Stok hareketi oluşturuyor mu?
- Fatura hareketi oluşturuyor mu?
- Tahsilat/ödeme ilişkisi var mı?
- Transaction gerekiyor mu?
- İptal/rollback senaryosu var mı?
- Tenant izolasyonu korunuyor mu?
```

Finansal işlemlerde kural:

```txt
Doğru çalışıyor gibi görünen ama transaction bütünlüğü olmayan çözüm kabul edilmez.
```

---

## 9. Dosya Okuma Stratejisi

Agent tüm projeyi gereksiz yere okumaz.

Öncelik:

```txt
1. Göreve özel rule/skill/workflow dosyaları
2. Context map
3. İlgili mevcut implementation
4. İlgili type/schema/service/component dosyaları
5. Test veya usage örnekleri
```

Amaç:

```txt
- Yeterli bağlam
- Minimum gereksiz okuma
- Mevcut pattern'e uyum
```

---

## 10. Kod Yazma Stratejisi

Agent:

```txt
✅ Küçük ve odaklı değişiklik yapar
✅ Mevcut mimariyi korur
✅ Tekrarlı kodu azaltır
✅ Tip güvenliğini korur
✅ Gereksiz dependency eklemez
✅ Hata durumlarını düşünür
✅ Loading/empty/error state ekler
```

Agent:

```txt
❌ Rastgele mimari değiştirmez
❌ Çalışan business logic'i UI bahanesiyle değiştirmez
❌ Yeni sistem uydurmaz
❌ Eski proje adlarını geri getirmez
❌ Backend ve frontend görevlerini izinsiz karıştırmaz
```

---

## 11. Doğrulama Stratejisi

Agent package.json kontrol ederek uygun doğrulama komutlarını çalıştırır.

Örnek komutlar:

```bash
pnpm lint
pnpm type-check
pnpm test
pnpm build
```

Komut yoksa agent bunu belirtir.

Frontend için ek doğrulama:

```txt
- Responsive görünüm
- Console hatası
- Empty state
- Error state
- Loading state
- Form submit
- DataGrid pagination/filter
```

Backend için ek doğrulama:

```txt
- DTO validation
- Auth/Tenant guard
- tenantId/deletedAt sorguları
- Transaction bütünlüğü
- API response contract
```

---

## 12. Raporlama Formatı

Görev sonunda agent şu formatta rapor verir:

```txt
Özet:
- Ne yapıldı?

Değişen dosyalar:
- path/to/file.ts

Doğrulama:
- pnpm lint: geçti / çalıştırılamadı
- pnpm type-check: geçti / çalıştırılamadı
- Manuel kontrol: ...

Risk / Not:
- Varsa açıkça yazılır
```

---

## 13. Yasak Davranışlar

```txt
❌ Supabase'e kendiliğinden geçmek
❌ Proje adını değiştirmek
❌ Eski AzemTarim/OtoMuhasebe isimlerini kullanmak
❌ Tenant güvenliğini atlamak
❌ Hard delete yapmak
❌ Transaction gerektiren işi transaction dışında yapmak
❌ Backend görevinde frontend tasarım refactor yapmak
❌ Frontend görevinde backend contract değiştirmek
❌ Kullanıcı onayı olmadan dependency eklemek
❌ Büyük refactor'u küçük görev gibi uygulamak
```

---

## 14. Agent Hızlı Kontrol Listesi

Göreve başlamadan önce:

- [ ] Görev türü belirlendi mi?
- [ ] Doğru rule/skill/workflow dosyaları okundu mu?
- [ ] Proje adı Muhasebe olarak korundu mu?
- [ ] Supabase geçişi yapılmadığı biliniyor mu?
- [ ] Tenant güvenliği etkileniyor mu?
- [ ] Finansal transaction etkileniyor mu?
- [ ] Onay gerektiren bir işlem var mı?
- [ ] Mevcut pattern incelendi mi?

Görev bitmeden önce:

- [ ] TypeScript hatası yok mu?
- [ ] Lint/build/test mümkünse çalıştı mı?
- [ ] Business logic korunuyor mu?
- [ ] API contract korunuyor mu?
- [ ] UI göreviyse responsive/state kontrolleri yapıldı mı?
- [ ] Değişen dosyalar raporlandı mı?

## 15. Response Language Policy

AI agent, kullanıcıya dönen tüm final cevapları, özetleri, raporları ve görev sonu açıklamalarını her zaman Türkçe yazmalıdır.

Bu kural şunları kapsar:

* Görev sonu özetleri
* Değişen dosyalar raporu
* Doğrulama/test sonuçları
* Hata açıklamaları
* Risk/not bölümleri
* Kullanıcıya sorulan takip soruları
* Commit veya PR önerisi dışındaki tüm açıklamalar

Kod, dosya adları, terminal komutları, hata mesajları, package/script adları ve teknik identifier’lar orijinal dilinde kalabilir.

Yanlış:

```txt
Summary:
- Updated the invoice page layout.

Changed files:
- app/invoices/page.tsx
```

Doğru:

```txt
Özet:
- Satış faturaları sayfasının yerleşimi güncellendi.

Değişen dosyalar:
- app/invoices/page.tsx
```

Agent kullanıcı açıkça İngilizce istemedikçe final cevabı İngilizce vermez.

Kullanıcı Türkçe prompt yazdıysa, yanıt dili kesin olarak Türkçe olmalıdır.
