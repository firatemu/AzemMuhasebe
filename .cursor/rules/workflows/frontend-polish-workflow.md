# FRONTEND POLISH WORKFLOW — Muhasebe

**Proje:** Muhasebe  
**Kapsam:** Mevcut frontend sayfalarını UI/UX, responsive, component kalitesi ve tasarım sistemi açısından iyileştirme akışı  
**Stack:** Next.js App Router + TypeScript + Tailwind CSS + shadcn/ui + MUI X DataGrid  
**Son Güncelleme:** 31 Mayıs 2026

> Bu workflow, çalışan ama görsel/UX kalitesi yetersiz olan frontend ekranlarını profesyonel seviyeye çıkarmak için kullanılır. Amaç sadece “çalışan ekran” değil; kurumsal, okunabilir, tutarlı ve güven veren bir kullanıcı deneyimi üretmektir.

---

## 1. Ne Zaman Kullanılır?

Bu workflow şu görevlerde kullanılır:

```txt
- Mevcut sayfanın tasarımını iyileştirme
- Form ekranını modernleştirme
- Liste/DataGrid ekranını düzenleme
- Dashboard görünümünü güçlendirme
- Mobil responsive sorunlarını düzeltme
- Loading / empty / error state ekleme
- shadcn/ui standardına taşıma
- MUI Material kullanımını kontrollü şekilde azaltma
- Sayfa düzenini DESIGN_SYSTEM.md’ye uygun hale getirme
```

Bu workflow şu görevler için kullanılmaz:

```txt
- Backend endpoint yazma
- Prisma schema değiştirme
- Migration oluşturma
- Auth/tenant altyapısı değiştirme
- Finansal transaction mantığı değiştirme
- API contract değiştirme
```

Bu tür ihtiyaçlar fark edilirse raporlanır, frontend polish görevi içinde uygulanmaz.

---

## 2. Zorunlu Okuma Sırası

Frontend polish görevinden önce agent şu dosyaları okur:

```txt
1. .cursor/rules/00-PROJECT_IDENTITY.md
2. .cursor/rules/01-AGENT_WORKFLOW.md
3. .cursor/rules/02-CODING_STANDARDS.md
4. .cursor/rules/02A-CODING_STANDARDS_FRONTEND.md
5. .cursor/rules/03-DESIGN_SYSTEM.md
6. .cursor/rules/04-UI_COMPONENT_BOUNDARIES.md
7. .cursor/rules/workflows/frontend-page-patterns.md
8. .cursor/rules/workflows/premium-form-dialog-pattern.md (form dialog polish ise)
9. İlgili mevcut sayfa/component dosyaları
```

DataGrid içeren ekranlarda ayrıca:

```txt
.cursor/rules/workflows/datagrid-patterns.md
```

---

## 3. Temel Sınır

Frontend polish görevi sırasında agent sadece aşağıdaki alanlarda değişiklik yapar:

```txt
✅ Layout
✅ UI component kullanımı
✅ Tailwind class düzeni
✅ shadcn/ui geçişi
✅ Form görsel düzeni
✅ DataGrid görünümü
✅ Loading / empty / error state
✅ Responsive davranış
✅ Kullanıcı metinleri
✅ Tooltip / açıklama / badge gibi UX iyileştirmeleri
✅ Permission-aware aksiyon görünürlüğü
```

Agent aşağıdakileri değiştirmez:

```txt
❌ Backend controller/service/dto
❌ Prisma schema/migration
❌ Auth interceptor
❌ Tenant header injection
❌ Token storage
❌ API base URL
❌ API response contract
❌ Finansal işlem mantığı
❌ Fatura/stok/cari transaction akışı
❌ Database ilişkileri
```

---

## 4. Çalışma Akışı

### 4.1 Sayfayı Anla

Agent önce ilgili ekranın amacını belirler:

```txt
- Bu ekran hangi kullanıcı için?
- Kullanıcı burada ne yapmak istiyor?
- Birincil aksiyon nedir?
- Kritik finansal bilgi var mı?
- DataGrid/list/form/dashboard yapısı var mı?
- Yetki gerektiren aksiyonlar var mı?
```

Örnek:

```txt
Cari listesi:
- Kullanıcı carileri arar, filtreler, detayına gider, yeni cari oluşturur
- Birincil aksiyon: Yeni Cari
- Kritik bilgiler: bakiye, alacak, borç
```

---

### 4.2 Mevcut Dosyaları İncele

Agent şunları bulur:

```txt
- Sayfa dosyası
- Modüle özel componentler
- Shared componentler
- Service dosyası
- Query key kullanımı
- Form schema dosyası
- DataGrid kolon tanımları
- Mevcut loading/error handling
```

Agent tüm projeyi okumaz; sadece ilgili bağlamı okur.

---

### 4.3 UI/UX Sorunlarını Listele

Kod yazmadan önce kısa bir sorun listesi çıkarılır.

Kontrol başlıkları:

```txt
- Görsel hiyerarşi
- Sayfa başlığı / breadcrumb / action düzeni
- KPI kartları
- Filtre ve arama alanı
- Form düzeni
- DataGrid okunabilirliği
- Empty/loading/error state
- Responsive davranış
- Permission-aware aksiyonlar
- Kritik işlem confirmation
- Renk ve token kullanımı
- shadcn/MUI sınır uyumu
```

Örnek sorun listesi:

```txt
1. Sayfada PageHeader yok
2. Filtre alanı Card içinde fazla kalabalık
3. DataGrid empty state yok
4. Para değerleri sağ hizalı değil
5. Mobilde aksiyon butonları sıkışıyor
```

---

### 4.4 Tasarım Planı Oluştur

Agent kısa bir uygulama planı çıkarır:

```txt
1. PageHeader eklenecek
2. KPI kartları grid düzenine alınacak
3. Filtre alanı responsive flex-wrap yapılacak
4. DataGrid shared wrapper ile kullanılacak
5. Empty/error/loading state eklenecek
6. MUI Material componentleri shadcn ile değiştirilecek
```

Küçük görevlerde uzun plan gerekmez; fakat riskli veya çok dosyalı görevlerde plan yazılmalıdır.

---

### 4.5 Uygula

Uygulama sırasında şu prensipler korunur:

```txt
- Değişiklik küçük ve odaklı olmalı
- Mevcut business logic korunmalı
- Mevcut servis çağrıları korunmalı
- Mevcut API contract korunmalı
- Gereksiz dosya taşıma yapılmamalı
- Yeni dependency eklenmemeli
- Mevcut component varsa yeniden yazılmamalı
```

---

### 4.6 Doğrula

Agent mümkünse şu kontrolleri yapar:

```txt
- TypeScript kontrolü
- Lint
- Build
- Browser/Playwright görsel kontrol
- Mobil görünüm
- Console hatası
- DataGrid pagination/filter
- Form submit
- Empty/loading/error state
```

Komutlar package.json içinde varsa çalıştırılır:

```bash
pnpm lint
pnpm type-check
pnpm build
```

Komut yoksa agent bunu raporda belirtir.

---

## 5. Browser / Playwright MCP Kullanımı

Browser/Playwright MCP varsa frontend polish görevinde öncelikli olarak kullanılır.

Kontrol edilecekler:

```txt
- Sayfa açılıyor mu?
- Console error var mı?
- Network error var mı?
- Desktop görünüm düzgün mü?
- Mobil görünüm düzgün mü?
- Butonlar tıklanabilir mi?
- Form alanları kullanılabilir mi?
- Tablo taşma yapıyor mu?
- Modal/dropdown doğru çalışıyor mu?
```

MCP yoksa agent kod ve mevcut pattern üzerinden manuel değerlendirme yapar.

---

## 6. UI Kalite Checklist

Her frontend polish görevi sonunda şu maddeler kontrol edilir:

### Sayfa Yapısı

- [ ] PageHeader var mı?
- [ ] Breadcrumb gerekiyorsa var mı?
- [ ] Sayfa açıklaması anlaşılır mı?
- [ ] Birincil aksiyon net mi?
- [ ] Aksiyon butonları responsive mi?

### Tasarım Sistemi

- [ ] Hardcode renk kullanılmadı mı?
- [ ] Semantic tokenlar kullanıldı mı?
- [ ] `tabular-nums` finansal değerlerde var mı?
- [ ] Boşluk ve grid sistemi tutarlı mı?
- [ ] Koyu tema bozulmayacak şekilde yazıldı mı?

### Component Sınırları

- [ ] Yeni `@mui/material` importu yok mu?
- [ ] Yeni MUI icon importu yok mu?
- [ ] shadcn/ui ana component sistemi korundu mu?
- [ ] MUI X sadece DataGrid için mi kullanıldı?
- [ ] Layout Tailwind ile mi yapıldı?

### DataGrid

- [ ] Ortak DataTable/DataGrid wrapper kullanıldı mı?
- [ ] Loading state var mı?
- [ ] Empty state var mı?
- [ ] Error state var mı?
- [ ] Pagination doğru mu?
- [ ] Para/miktar kolonları sağ hizalı mı?
- [ ] Action column permission-aware mı?

### Form

- [ ] React Hook Form + Zod kullanılıyor mu?
- [ ] shadcn Form bileşenleri kullanılıyor mu?
- [ ] Validation mesajları Türkçe mi?
- [ ] Submit loading state var mı?
- [ ] İptal/geri davranışı net mi?

### Responsive

- [ ] Mobilde tek kolon davranışı var mı?
- [ ] Filtreler wrap oluyor mu?
- [ ] Butonlar sıkışmıyor mu?
- [ ] DataGrid container taşması kontrol edildi mi?
- [ ] Dokunma alanları yeterli mi?

### Güvenlik / İş Mantığı

- [ ] Backend/API contract değişmedi mi?
- [ ] Auth/tenant interceptor değişmedi mi?
- [ ] Permission gerektiren aksiyonlar kontrol ediliyor mu?
- [ ] Kritik işlemler confirmation dialog ile korunuyor mu?
- [ ] Finansal işlem mantığına dokunulmadı mı?

---

## 7. shadcn Migration Kuralı

Mevcut MUI Material kodları toplu şekilde migrate edilmez.

Kademeli yaklaşım:

```txt
1. Yeni kodda MUI Material yazılmaz
2. Dokunulan dosyada görev kapsamındaki MUI UI bileşenleri shadcn’e taşınır
3. Business logic değiştirilmez
4. API/service/query yapısı değiştirilmez
5. Büyük migration ayrı görev olarak planlanır
```

Öncelik sırası:

```txt
1. Button
2. TextField/Input
3. Select
4. Dialog
5. Chip/Badge
6. Alert/Snackbar
7. Layout bileşenleri
```

---

## 8. Empty / Loading / Error State Standardı

Her veri çeken ekran şu üç state’i düşünmelidir:

```txt
- Loading
- Empty
- Error
```

Örnek:

```tsx
if (isLoading) return <ListSkeleton />
if (error) return <ErrorState onRetry={refetch} />
if (!data?.data?.length) return <EmptyState />
```

DataGrid içinde overlay kullanılabilir:

```tsx
<DataGrid
  slots={{
    noRowsOverlay: () => (
      <EmptyState
        title="Kayıt bulunamadı"
        description="Henüz kayıt eklenmemiş veya filtrelerinize uygun sonuç yok."
      />
    ),
    noResultsOverlay: () => (
      <EmptyState
        title="Sonuç bulunamadı"
        description="Arama kriterlerinizi değiştirerek tekrar deneyin."
      />
    ),
  }}
/>
```

---

## 9. Permission-Aware UI

Yetki gerektiren butonlar ve aksiyonlar kontrolsüz gösterilmez.

Örnek:

```tsx
{can('account.create') && (
  <Button asChild>
    <Link href="/accounts/new">Yeni Cari</Link>
  </Button>
)}
```

Not:

```txt
- Frontend permission kontrolü UX katmanıdır
- Backend authorization asıl güvenlik katmanıdır
- Eğer projede can() helper yoksa agent yeni permission sistemi uydurmaz
- Mevcut auth/role/permission yapısı incelenir
```

---

## 10. Kritik İşlem Confirmation

Aşağıdaki işlemler tek tıkla uygulanmaz:

```txt
- Kayıt silme
- Fatura iptal
- Tahsilat iptal
- Ödeme iptal
- Stok hareketi düzeltme
- Cari bakiye etkileyen işlem
- Çek/senet durum değişikliği
- Toplu işlem
```

Bu işlemler için `ConfirmDialog` veya mevcut proje confirmation pattern’i kullanılır.

---

## 11. Raporlama Formatı

Frontend polish görevi tamamlanınca agent şu formatta rapor verir:

```txt
Özet:
- Sayfanın hangi alanları iyileştirildi?

UI/UX İyileştirmeleri:
- PageHeader eklendi
- Filtre alanı responsive hale getirildi
- DataGrid empty state eklendi

Değişen Dosyalar:
- app/(dashboard)/accounts/page.tsx
- components/accounts/AccountDataGrid.tsx

Doğrulama:
- pnpm lint: geçti / çalıştırılamadı
- pnpm type-check: geçti / çalıştırılamadı
- Browser kontrol: yapıldı / yapılamadı

Notlar:
- Eksik backend endpoint varsa burada belirtilir
```

---

## 12. Yasaklar

```txt
❌ Frontend polish sırasında backend yazmak
❌ API contract değiştirmek
❌ Prisma schema/migration değiştirmek
❌ Auth/tenant interceptor değiştirmek
❌ Yeni dependency eklemek
❌ Tüm sayfayı gereksiz 'use client' yapmak
❌ Hardcode renk kullanmak
❌ MUI Material ile yeni UI yazmak
❌ Büyük migration’ı küçük polish görevi gibi yapmak
```

---

## 13. Hızlı Komut

Kullanıcı şu tarz kısa istek verebilir:

```txt
Bu sayfayı frontend polish workflow’a göre profesyonel hale getir.
```

Agent bu durumda otomatik olarak bu dosyayı ve ilgili frontend rule dosyalarını okuyarak ilerler.
