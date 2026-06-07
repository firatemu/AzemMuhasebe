# DESIGN SYSTEM — Muhasebe

**Proje:** Muhasebe  
**Kapsam:** Çok kiracılı KOBİ muhasebe / ERP arayüz standardı  
**Stack:** Next.js App Router + TypeScript + Tailwind CSS + shadcn/ui + MUI X DataGrid  
**Sürüm:** v2
**Son Güncelleme:** 31 Mayıs 2026

> Bu dosya Muhasebe projesinin görsel kimliğini, tasarım tokenlarını ve UI kalite standardını tanımlar. AI agent her frontend görevi öncesinde bu dosyayı okur. Hiçbir renk, spacing, tipografi veya bileşen stili kafadan icat edilmez.

---

## 1. Tasarım Kimliği

Muhasebe, KOBİ işletmeleri için geliştirilen modern, güvenilir ve operasyon odaklı bir muhasebe / ERP sistemidir.

Arayüz dili:

- Kurumsal
- Sade
- Güven veren
- Hızlı okunabilir
- Veri yoğun ekranlarda yorucu olmayan
- Modern SaaS hissine sahip
- Türkçe kullanıcı deneyimine uygun

Referans kalite seviyesi:

- Linear / Vercel / Stripe tarzı temiz SaaS dili
- Modern ERP / dashboard kullanılabilirliği
- Finansal işlemler için net görsel hiyerarşi
- Klasik Bootstrap/admin panel görünümünden uzak

Eski proje adları, eski marka adları ve sektör-spesifik eski bağlamlar yeni UI metinlerinde kullanılmaz. Projenin tek adı **Muhasebe** olarak kabul edilir. Sektör-spesifik özellikler varsa yalnızca açıkça istenen modül kapsamında ele alınır.

---

## 2. Tema Sistemi

### 2.0 Kaynak Sırası

Frontend tasarım görevi başlamadan önce AI agent şu dosyaları bu sırayla okur:

```txt
1. 00-PROJECT_IDENTITY.md
2. 03-DESIGN_SYSTEM.md
3. 04-UI_COMPONENT_BOUNDARIES.md
4. 02-CODING_STANDARDS.md veya 02-CODING_STANDARDS_FRONTEND.md
5. workflows/frontend-page-patterns.md
```

Bu dosyalardan biri diğerini geçersiz kılıyorsa, en özel dosya önceliklidir. UI kütüphanesi seçimi için nihai kaynak `04-UI_COMPONENT_BOUNDARIES.md` dosyasıdır.


Proje açık ve koyu tema destekler. Tema yönetimi `next-themes` ile yapılır. shadcn/ui CSS variables sistemi kullanılır.

### 2.1 Tema Prensipleri

- Renkler hardcode yazılmaz.
- `text-blue-500`, `bg-gray-100`, `border-red-300` gibi doğrudan Tailwind renkleri kullanılmaz.
- Her zaman semantic token kullanılır:
  - `text-primary`
  - `text-muted-foreground`
  - `bg-background`
  - `border`
  - `text-destructive`
  - `text-[hsl(var(--income))]`
  - `text-[hsl(var(--expense))]`
- MUI X DataGrid `sx` stilleri de CSS variables ile tema sistemine bağlanır.
- Inline style ile renk verilmez.

---

## 3. globals.css Tema Tokenları

```css
@layer base {
  :root {
    /* Background */
    --background: 0 0% 100%;
    --foreground: 222 47% 11%;

    /* Card */
    --card: 0 0% 100%;
    --card-foreground: 222 47% 11%;

    /* Popover */
    --popover: 0 0% 100%;
    --popover-foreground: 222 47% 11%;

    /* Primary */
    --primary: 221 83% 53%;
    --primary-foreground: 0 0% 100%;

    /* Secondary */
    --secondary: 210 40% 96%;
    --secondary-foreground: 222 47% 11%;

    /* Muted */
    --muted: 210 40% 96%;
    --muted-foreground: 215 16% 47%;

    /* Accent */
    --accent: 210 40% 96%;
    --accent-foreground: 222 47% 11%;

    /* Destructive */
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;

    /* Border / Input / Ring */
    --border: 214 32% 91%;
    --input: 214 32% 91%;
    --ring: 221 83% 53%;

    /* Border Radius */
    --radius: 0.5rem;

    /* Semantic — Finans */
    --income: 142 71% 45%;
    --income-foreground: 0 0% 100%;
    --income-muted: 142 71% 95%;

    --expense: 0 84% 60%;
    --expense-foreground: 0 0% 100%;
    --expense-muted: 0 84% 95%;

    --neutral: 215 16% 47%;
    --neutral-muted: 210 40% 96%;

    /* Semantic — Warning / Info */
    --warning: 38 92% 50%;
    --warning-foreground: 222 47% 11%;
    --warning-muted: 48 96% 89%;

    --info: 199 89% 48%;
    --info-foreground: 0 0% 100%;
    --info-muted: 199 89% 94%;
  }

  .dark {
    /* Background */
    --background: 222 47% 7%;
    --foreground: 210 40% 98%;

    /* Card */
    --card: 222 47% 10%;
    --card-foreground: 210 40% 98%;

    /* Popover */
    --popover: 222 47% 10%;
    --popover-foreground: 210 40% 98%;

    /* Primary */
    --primary: 217 91% 60%;
    --primary-foreground: 0 0% 100%;

    /* Secondary */
    --secondary: 217 33% 17%;
    --secondary-foreground: 210 40% 98%;

    /* Muted */
    --muted: 217 33% 17%;
    --muted-foreground: 215 20% 65%;

    /* Accent */
    --accent: 217 33% 17%;
    --accent-foreground: 210 40% 98%;

    /* Destructive */
    --destructive: 0 72% 51%;
    --destructive-foreground: 0 0% 100%;

    /* Border / Input / Ring */
    --border: 217 33% 17%;
    --input: 217 33% 17%;
    --ring: 217 91% 60%;

    /* Semantic — Finans */
    --income: 142 71% 45%;
    --income-foreground: 0 0% 100%;
    --income-muted: 142 71% 10%;

    --expense: 0 72% 51%;
    --expense-foreground: 0 0% 100%;
    --expense-muted: 0 72% 10%;

    --neutral: 215 20% 65%;
    --neutral-muted: 217 33% 17%;

    --warning: 38 92% 50%;
    --warning-foreground: 222 47% 11%;
    --warning-muted: 38 92% 13%;

    --info: 199 89% 48%;
    --info-foreground: 0 0% 100%;
    --info-muted: 199 89% 13%;
  }
}
```

---

## 4. Tipografi

### 4.1 Font

```css
--font-sans: 'Inter', system-ui, sans-serif;
```

Varsayılan font `font-sans` olmalıdır.

### 4.2 Tipografi Ölçeği

| Kullanım | Class |
|---|---|
| Sayfa başlığı | `text-2xl font-semibold tracking-tight` |
| Bölüm başlığı | `text-lg font-semibold` |
| Kart başlığı | `text-sm font-medium` |
| Genel metin | `text-sm` |
| Yardımcı metin | `text-xs text-muted-foreground` |
| KPI rakamı | `text-3xl font-bold tabular-nums` |
| Finans rakamı | `text-sm font-medium tabular-nums` |
| Tablo hücre metni | `text-sm` |
| Tablo başlığı | `text-xs font-medium uppercase tracking-wide` |

### 4.3 Sayısal Değer Kuralı

Para, stok, miktar, oran, adet ve bakiye gibi tüm sayısal değerlerde `tabular-nums` kullanılır.

```tsx
<span className="tabular-nums font-medium">
  {formatCurrency(amount)}
</span>
```

---

## 5. Spacing & Layout

### 5.1 Standart Boşluklar

| Kullanım | Class |
|---|---|
| Sayfa dış padding | `p-6` |
| Mobil sayfa padding | `p-4 md:p-6` |
| Bölümler arası | `space-y-6` |
| Kart içi padding | `p-4` veya `p-6` |
| Form alanları arası | `space-y-4` |
| Grid gap | `gap-4` veya `gap-6` |
| Sayfa başlığı alt boşluk | `pb-6` |
| Filtre alanı alt boşluk | `mb-4` |
| KPI alanı alt boşluk | `mb-6` |

### 5.2 Standart Sayfa Akışı

```txt
Sayfa Header
  ├─ Breadcrumb
  ├─ Başlık
  ├─ Açıklama
  └─ Birincil aksiyonlar

KPI Kartları
Filtre / Arama Alanı
Ana İçerik
  ├─ DataGrid
  ├─ Form
  ├─ Detay kartları
  └─ Tab içerikleri
```

---

## 6. Responsive Standartları

| Alan | Mobil | Tablet | Desktop |
|---|---|---|---|
| KPI Kartları | `grid-cols-2` | `md:grid-cols-4` | `lg:grid-cols-4` |
| Form Alanları | `grid-cols-1` | `md:grid-cols-2` | `lg:grid-cols-2/3` |
| Dashboard Kartları | `grid-cols-1` | `md:grid-cols-2` | `lg:grid-cols-4` |
| Filtreler | Alt alta / wrap | Yan yana | Yan yana |
| Master-detail | Tek kolon | Tek kolon | Yan yana |
| Sidebar | Sheet / drawer | Sabit veya collapse | Sabit |

Mobilde minimum dokunma alanı 44px olmalıdır.

---

## 7. Renk Kullanım Kuralları

### 7.1 Semantic Finans Renkleri

| Durum | Token | Kullanım |
|---|---|---|
| Gelir / Giriş / Pozitif | `--income` | Tahsilat, stok girişi, pozitif bakiye |
| Gider / Çıkış / Negatif | `--expense` | Ödeme, stok çıkışı, negatif bakiye |
| Beklemede / Taslak | `--neutral` | Nötr durumlar |
| Uyarı | `--warning` | Risk, limit, bekleyen işlem |
| Bilgi | `--info` | Bilgilendirme mesajları |
| Hata | `--destructive` | Hata ve tehlikeli aksiyonlar |

### 7.2 Yasaklar

```txt
❌ text-green-500
❌ text-red-500
❌ text-blue-600
❌ bg-gray-100
❌ border-gray-200
❌ inline style renk
❌ rastgele gradient
❌ mor renk paleti
```

Doğru kullanım:

```tsx
<span className="text-[hsl(var(--income))]">Tahsilat</span>
<span className="text-[hsl(var(--expense))]">Ödeme</span>
<div className="bg-muted text-muted-foreground" />
```

---

## 8. Border Radius

```txt
Kartlar:       rounded-lg
Modal/Dialog:  rounded-lg
Button/Input:  rounded-md
Badge:         rounded-sm
Avatar:        rounded-full
```

`--radius` ana değişken olarak korunur.

---

## 9. Shadow & Border

| Kullanım | Class |
|---|---|
| Kart | `shadow-sm` |
| Dropdown / Popover | `shadow-md` |
| Modal | `shadow-lg` |
| Koyu tema ayrımı | `border` öncelikli |

ERP ekranlarında aşırı gölge kullanılmaz. Veri yoğun ekranlarda gölge yerine border ve spacing tercih edilir.

---

## 10. Focus & Accessibility

- Tüm interaktif bileşenler klavye ile erişilebilir olmalıdır.
- Focus ring kaldırılmaz.
- `focus-visible:ring-2 focus-visible:ring-ring` pattern korunur.
- Butonlarda ikon varsa metin veya erişilebilir `aria-label` bulunur.
- Sadece renk ile anlam verilmez; ikon, metin veya badge etiketi de kullanılmalıdır.
- Form hata mesajları `FormMessage` ile gösterilir.

---

## 11. Z-Index Standardı

| Katman | Öneri |
|---|---|
| Header / sticky toolbar | `z-30` |
| Sidebar | `z-40` |
| Dropdown / Popover | shadcn default |
| Dialog / Modal | shadcn default |
| Toast | Sonner default |

Rastgele `z-[9999]` kullanılmaz.

---

## 12. Badge / Durum Renkleri

Tüm durum rozetleri `shadcn/ui Badge` ile yapılır.

### 12.1 Fatura Durumları

| Durum | Görünüm |
|---|---|
| `DRAFT` | `variant="secondary"` |
| `PENDING` | `variant="outline"` |
| `OPEN` | `--income` tabanlı custom class |
| `PARTIALLY_PAID` | `--warning` tabanlı custom class |
| `CLOSED` | `variant="secondary"` |
| `CANCELLED` | `variant="destructive"` |

### 12.2 Stok Hareketleri

| Durum | Görünüm |
|---|---|
| `ENTRY` | `--income` |
| `EXIT` | `--expense` |
| `TRANSFER` | `variant="outline"` |
| `ADJUSTMENT` | `variant="secondary"` |
| `COUNT_SURPLUS` | `--income` |
| `COUNT_SHORTAGE` | `--expense` |

---

## 13. KPI Kartları

Her liste sayfasında maksimum 4 ana KPI kartı bulunur. Daha fazla metrik gerekiyorsa ayrı dashboard veya detay bölümü kullanılır.

KPI kartları:

- Başlık kısa olmalı
- Değer büyük ve okunabilir olmalı
- Sayısal değerlerde `tabular-nums`
- Trend varsa semantic renk kullanılmalı
- Kartlar mobilde 2 kolon, desktopta 4 kolon olmalı

```tsx
<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
  <KPICard title="Toplam Fatura" value={formatCurrency(total)} />
  <KPICard title="Tahsilat" value={formatCurrency(collections)} trendType="income" />
</div>
```

---

## 14. İkon Sistemi

Tüm ikonlarda `lucide-react` kullanılır.

```tsx
import { FileText, Users, Package, Search, Plus } from 'lucide-react'
```

MUI ikonları yeni kodda kullanılmaz. DataGrid action hücrelerinde `GridActionsCellItem` kullanılabilir; ancak `icon` prop’una yine `lucide-react` ikonu verilir.

---

## 15. Animasyon

ERP uygulaması animasyon showcase değildir. Animasyonlar sade ve işlevsel olmalıdır.

İzin verilenler:

```txt
transition-colors
transition-opacity
duration-200
animate-pulse
```

Kaçınılacaklar:

```txt
❌ Aşırı hareketli giriş animasyonları
❌ Her kartta hover scale
❌ Dashboard’da dikkat dağıtan animasyonlar
❌ Rastgele Framer Motion kullanımı
```

---

## 16. Veri Yoğun Ekran Yoğunluğu

Muhasebe ekranları veri yoğundur. Bu nedenle:

- Çok büyük boşluklarla veri okunabilirliği bozulmaz.
- Tablo satırları kompakt ama okunabilir olmalıdır.
- KPI ve filtre alanları ekranı gereksiz kaplamamalıdır.
- Ana aksiyonlar net görünmelidir.
- Kritik finansal değerler sağ hizalı gösterilmelidir.

---

## 17. Yasak Tasarım Yaklaşımları

```txt
❌ Bootstrap benzeri dikey form yığınları
❌ Her şeyi Card içine koyup görsel hiyerarşi kurmamak
❌ Inline style ile renk vermek
❌ Rastgele Tailwind renkleri
❌ MUI Material bileşenleriyle yeni ekran yazmak
❌ MUI ikonları kullanmak
❌ Mor/gradient ağırlıklı tasarım
❌ Gereksiz animasyon
❌ Mobil görünümü sonradan düşünmek
```

---

## 18. Kurumsal UI Kalite Eşiği

Bir ekran sadece çalışıyor diye tamamlanmış sayılmaz. Aşağıdaki kalite eşiği sağlanmalıdır:

```txt
- İlk bakışta ekranın amacı anlaşılmalı
- Birincil aksiyon net görünmeli
- Finansal değerler hizalı ve okunabilir olmalı
- Filtreler kolay kullanılmalı
- Tablo boş/hata/yükleme durumları düzgün görünmeli
- Mobil görünüm kırılmamalı
- Yetki gerektiren aksiyonlar kontrol edilmeli
- Kritik işlemler tek tıkla çalışmamalı
```

## 19. AI Agent Kontrol Listesi

Frontend görevi tamamlanmadan önce agent şunları kontrol eder:

- [ ] Semantic renkler kullanıldı mı?
- [ ] Hardcode renk yok mu?
- [ ] shadcn/ui ana bileşen sistemi korundu mu?
- [ ] MUI sadece DataGrid için kullanıldı mı?
- [ ] Responsive davranış doğru mu?
- [ ] Mobilde dokunma alanları yeterli mi?
- [ ] Loading / empty / error state var mı?
- [ ] Finansal değerler `tabular-nums` ile gösterildi mi?
- [ ] Yetki gerektiren aksiyonlarda permission kontrolü var mı?
- [ ] Kritik işlemler confirmation dialog ile korunuyor mu?
