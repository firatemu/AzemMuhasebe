# Yeni Satış Faturası Form Sayfası — Taşınabilir AI Uygulama Rehberi

**Versiyon:** 1.0  
**Kaynak URL:** `https://muhasebe.localhost/invoice/sales/yeni`  
**Kaynak dosyalar:**
- `panel-stage/client/src/app/(main)/invoice/sales/yeni/page.tsx` (`SatisFaturaForm`)
- `panel-stage/client/src/components/Form/DocumentItemTable.tsx`
- `panel-stage/client/src/app/globals.css` (`.form-control-textfield`, token'lar)
- `panel-stage/client/src/styles/design-system.css` (gölge, radius referansları)
- `panel-stage/client/src/stores/invoiceDraftStore.ts`
- `panel-stage/client/src/stores/tabStore.ts`

**Aynı pattern'i kullanan sayfalar (referans):**
- `invoice/purchase/yeni` — Satın alma faturası
- `invoice/return/sales/yeni` — Satış iade faturası
- `sales-delivery-note/yeni` — Satış irsaliyesi
- `purchase-delivery-note/yeni` — Satın alma irsaliyesi
- `orders/sales/yeni` — Satış siparişi

**Amaç:** Bu belgeyi okuyan bir AI agent, Muhasebe ERP'deki **Yeni Satış Faturası** sayfasının tasarımını ve davranışını başka projelerde **aynı görsel dil ve UX ile** yeniden üretebilmelidir.

---

## 0. AI Agent İçin Özet Talimat

Bu sayfa bir **tam sayfa belge formu** (document form page) pattern'idir. Modal değil; `MainLayout` içinde tek bir premium kartta tüm form yer alır.

**Üretilecek yapı:**

1. **Sayfa başlığı** — ikon kutusu + başlık + alt açıklama (kart dışında)
2. **Premium form kartı** — üst accent çizgisi, gölge, hover lift
3. **Genel bilgiler** — responsive grid + cari autocomplete (tam genişlik)
4. **Kalemler bölümü** — barkod + taksit butonu + `DocumentItemTable`
5. **Genel iskonto** — sağa hizalı iki alan
6. **Özet + notlar** — yan yana; özet kartı sticky (desktop)
7. **Aksiyon butonları** — Taslak + Kaydet (sağ alt)

**Zorunlu tasarım kararları:**

| Karar | Değer |
|---|---|
| Sayfa accent rengi | `var(--chart-3)` — ikon, barkod, toplam tutar, badge |
| Form kart üst çizgi | `3px solid var(--primary)` |
| Form kart padding | `24px` (`p: 3`) |
| Form alanları class | `form-control-textfield`, `form-control-select` |
| Kalemler tablosu max yükseklik | `400px`, sticky header |
| Özet kartı border-radius | `var(--radius-lg)` (20px) |
| Genel toplam font | `1.4rem`, `fontWeight: 900`, `var(--chart-3)` |
| Primary kaydet butonu | `var(--primary)` bg, hover `translateY(-2px)` |
| Mobil breakpoint | MUI `md` (960px) — tab gizlenir, kart layout dikey |

**Zorunlu davranış kararları:**

1. Yeni sayfa açılınca `tabStore`'a sekme eklenir (`invoice-sales-yeni`)
2. Form verisi `invoiceDraftStore`'da otomatik persist edilir (edit modda değil)
3. Cari seçilince vade tarihi otomatik hesaplanır (`vadeSuresi` gün ekleme)
4. Barkod Enter ile kalem ekler veya miktar artırır
5. Kayıt sonrası sekme kapanır, liste sayfasına yönlendirilir
6. Onaylı (`APPROVED`) faturada tüm alanlar disabled

---

## 1. Sayfa Anatomisi

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  PAGE HEADER (kart dışı)                                                    │
│  ┌────┐  Yeni Satış Faturası                                                 │
│  │ 🧾 │  Satışlerinizi profesyonelce faturalandirin                         │
│  └────┘                                                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  PREMIUM FORM CARD (Paper)                                                  │
│  ═══════════════════════════════════  ← 3px primary top border              │
│                                                                             │
│  ┌─ Tab: Genel Bilgiler ───────────────────────────────────────────────┐   │
│  │ [Fatura No] [Tarih] [Vade] [Ambar]                                   │   │
│  │ [Cari Seçiniz ——————————————————————————————————————————]           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ── KALEMLER ──────────────────────────────────────────────────────────     │
│  [🔍 Barkod Okut]  [Taksit Planı (badge)]                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Fatura Kalemleri                    [Seçilenleri Sil] [+ Satır Ekle]│   │
│  │ ┌─────────────────────────────────────────────────────────────────┐ │   │
│  │ │ ☑ │ Stok │ Miktar │ Birim │ Fiyat │ KDV │ İsk │ Toplam        │ │   │
│  │ │ ☐ │ ...  │   1    │ ADET  │ 100   │ 20  │ 0   │ ₺120,00       │ │   │
│  │ └─────────────────────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│                              [Genel İskonto %] [Genel İskonto ₺]          │
│                                                                             │
│  ┌─ Açıklama ─────────────┐  ┌─ Fatura Özeti (sticky) ────────────────┐   │
│  │ Notlar...              │  │ [KDV DAHİL]                           │   │
│  │                        │  │ Ara Toplam: ₺...                      │   │
│  │                        │  │ Genel Toplam: ₺... (büyük, chart-3)   │   │
│  └────────────────────────┘  └───────────────────────────────────────┘   │
│                                                                             │
│                          [Taslak Olarak Kaydet]  [Kaydet]                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Bileşen hiyerarşisi:**

```
MainLayout
└── SatisFaturaForm
    ├── Page Header (Box)
    ├── Paper.premium-form-card (Stack spacing=3)
    │   ├── Alert (ambar yoksa)
    │   ├── Tabs → TabPanel "Genel Bilgiler" (desktop)
    │   ├── Kalemler Section
    │   │   ├── Section header (icon + uppercase label + Divider)
    │   │   ├── Barcode + Taksit Planı toolbar
    │   │   └── DocumentItemTable
    │   ├── Genel İskonto (flex-end)
    │   ├── Özet + Açıklama (row/col responsive)
    │   └── Action Buttons (flex-end)
    ├── Dialog (Ödeme Planı)
    └── Snackbar
```

---

## 2. Tasarım Token'ları

Kaynak: `globals.css` + `design-system.css`. Sayfa bu CSS değişkenlerini kullanır.

### Temel renkler

```css
--background: oklch(1 0 0);           /* sayfa arka planı */
--foreground: oklch(0.145 0 0);       /* ana metin */
--card: oklch(1 0 0);                 /* form kartı */
--muted: oklch(0.97 0 0);             /* tablo header, hover */
--muted-foreground: oklch(0.556 0 0); /* ikincil metin */
--primary: oklch(0.205 0 0);          /* accent border, kaydet butonu */
--primary-foreground: oklch(0.985 0 0);
--primary-hover: /* design-system: #312E81 veya theme override */
--destructive: oklch(0.577 0.245 27.325);
--border: oklch(0.922 0 0);
--ring: oklch(0.708 0 0);             /* focus ring */
--input: oklch(0.922 0 0);            /* input arka planı */
```

### Sayfa accent (chart-3)

Bu sayfada vurgu rengi `--chart-3` kullanılır (ikon kutusu, barkod, toplam, badge):

```css
--chart-3: oklch(0.439 0 0);   /* light — koyu gri-yeşil ton */
--chart-1: oklch(0.87 0 0);    /* özet gradient ikinci ton */
--chart-2: oklch(0.556 0 0);   /* çoklu iskonto toggle aktif */
```

### Durum renkleri (stok chip, iskonto)

```css
--success: var(--income);       /* stok yeterli */
--warning: oklch(0.76 0.16 75); /* stok düşük (<10) */
--destructive: ...              /* stok yok, iskonto negatif */
```

### Spacing & radius

```css
--radius: 0.625rem;    /* 10px — genel */
--radius-md: 0.625rem; /* ikon kutusu */
--radius-lg: 1.25rem;  /* 20px — özet kartı */
--shadow-xs: 0 1px 2px rgba(0,0,0,0.05);
--shadow-sm: 0 1px 3px rgba(0,0,0,0.1);
--shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);
--shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1);
```

---

## 3. Sayfa Başlığı (Page Header)

Kartın **dışında**, üstte yer alır.

```
┌────┐  Yeni Satış Faturası
│ 🧾 │  Satışlerinizi profesyonelce faturalandirin
└────┘
```

| Öğe | Spesifikasyon |
|---|---|
| Container margin-bottom | `24px` desktop (`mb: 3`), `16px` mobil (`mb: 2`) |
| Layout | `flex row`, `alignItems: center`, `gap: 20px` (2.5) |
| Mobil layout | `flex column`, `alignItems: flex-start` |

**İkon kutusu (48×48):**

```tsx
{
  width: 48,
  height: 48,
  borderRadius: 'var(--radius-md)',
  bgcolor: 'color-mix(in srgb, var(--chart-3) 12%, transparent)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s ease',
  '&:hover': {
    bgcolor: 'color-mix(in srgb, var(--chart-3) 18%, transparent)',
    transform: 'scale(1.03)',
  },
}
// İkon: Receipt, fontSize: 24, color: var(--chart-3)
```

**Başlık metni:**

| Öğe | Değer |
|---|---|
| Variant | `h5` |
| fontWeight | `700` |
| color | `var(--foreground)` |
| letterSpacing | `-0.01em` |
| Edit modda metin | `Satış Faturası Düzenle` |

**Alt açıklama:**

| Öğe | Değer |
|---|---|
| Variant | `body2` |
| color | `var(--muted-foreground)` |
| margin-top | `2px` (0.25) |
| Metin | `Satışlerinizi profesyonelce faturalandirin` |

---

## 4. Premium Form Kartı

Ana form container'ı — tüm içerik bu kartın içinde.

```tsx
<Paper
  className="premium-form-card"
  sx={{
    p: 3,                              // 24px
    borderRadius: 'var(--radius)',     // 10-16px
    boxShadow: 'var(--shadow-md)',
    bgcolor: 'var(--card)',
    borderTop: '3px solid var(--primary)',  // ÜST ACCENT — zorunlu
    transition: 'all 0.2s ease',
    '&:hover': {
      boxShadow: 'var(--shadow-lg)',
      transform: 'translateY(-2px)',   // Hover lift efekti
    },
  }}
>
  <Stack spacing={3}>  {/* Bölümler arası 24px */}
    ...
  </Stack>
</Paper>
```

**Kritik:** Üstteki `3px solid var(--primary)` çizgi bu pattern'in imza detayıdır. Kaldırılmamalı.

İç bölümler `Stack spacing={3}` ile 24px aralıklıdır.

---

## 5. Genel Bilgiler Bölümü

### 5.1 Desktop — Tab arayüzü

Mobil dışında MUI `Tabs` ile "Genel Bilgiler" sekmesi gösterilir:

```tsx
<Tabs
  value={tabValue}
  onChange={(_, v) => setTabValue(v)}
  sx={{
    '& .MuiTab-root': {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '1rem',
    },
  }}
>
  <Tab icon={<Description />} label="Genel Bilgiler" iconPosition="start" />
</Tabs>
```

Tab container: `borderBottom: 1px solid divider`, `mb: 1`.

`TabPanel`: `hidden={value !== index}`, içerik `pt: 2`.

### 5.2 Mobil

Tab gizlenir; yerine:

```tsx
<Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'var(--foreground)' }}>
  Genel Bilgiler
</Typography>
```

### 5.3 Form grid (üst alanlar)

```tsx
<Box sx={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: 2,  // 16px
}}>
  {/* Fatura No, Tarih, Vade, Ambar */}
</Box>
```

| Alan | Tip | Class | Notlar |
|---|---|---|---|
| Fatura No | TextField | `form-control-textfield` | `required` |
| Tarih | TextField `type="date"` | `form-control-textfield` | `InputLabelProps={{ shrink: true }}` |
| Vade | TextField `type="date"` | `form-control-textfield` | Cari seçiminde otomatik |
| Ambar | Select / FormControl | `form-control-select` | `required` |

### 5.4 Cari seçimi (tam genişlik)

Grid'in altında, `mt: 2` ile:

```tsx
<Autocomplete
  fullWidth
  options={cariler}
  getOptionLabel={o => `${o.cariKodu} - ${o.unvan}`}
  renderInput={p => <TextField {...p} className="form-control-textfield" label="Cari Seçiniz" required />}
/>
```

**Cari → vade otomasyonu:**
```ts
if (nv?.vadeSuresi && formData.tarih) {
  const tarih = new Date(formData.tarih);
  tarih.setDate(tarih.getDate() + nv.vadeSuresi);
  setFormData(p => ({ ...p, cariId: nv.id, vade: tarih.toISOString().split('T')[0] }));
}
```

### 5.5 Form control stilleri (globals.css)

Tüm TextField ve Select'lere **mutlaka** class ver:

**`.form-control-textfield`:**
```css
.MuiOutlinedInput-root {
  background-color: var(--input);
}
fieldset { border-color: var(--border); }
:hover fieldset { border-color: var(--ring); }
.Mui-focused fieldset {
  border-color: var(--ring);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--ring) 15%, transparent);
}
.MuiInputLabel-root {
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--muted-foreground);
}
```

**`.form-control-select`:** Aynı kurallar + select-specific disabled stilleri.

---

## 6. Kalemler Bölümü

### 6.1 Bölüm başlığı (section header)

```tsx
<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, pt: 1 }}>
  <Description sx={{ fontSize: 18, color: 'var(--chart-3)' }} />
  <Typography
    variant="caption"
    fontWeight={600}
    sx={{
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      color: 'var(--muted-foreground)',
      fontSize: '0.7rem',
    }}
  >
    Kalemler
  </Typography>
</Box>
<Divider sx={{ mb: 2, borderColor: 'var(--border)' }} />
```

Pattern: **ikon + UPPERCASE küçük label + divider**. Bu başlık stili tüm alt bölümlerde tekrarlanır.

### 6.2 Barkod + Taksit toolbar

```
[🔍 Barkod Okut        ]  [💳 Taksit Planı (3)]
```

**Barkod alanı:**

| Özellik | Değer |
|---|---|
| className | `barcode-scanner-input` |
| size | `small` |
| width | `260px` |
| label | `Barkod Okut` |
| startAdornment | `QrCodeScanner`, color `var(--chart-3)` |
| Enter davranışı | `handleBarcodeSubmit` — stok bulursa ekle/artır |
| Focus ring | `box-shadow: 0 0 0 2px color-mix(in srgb, var(--ring) 15%, transparent)` |

**Taksit Planı butonu:**

```tsx
<Button
  variant="outlined"
  size="small"
  startIcon={<AccountBalanceWallet />}
  sx={{
    textTransform: 'none',
    fontWeight: 600,
    borderColor: 'var(--border)',
    color: 'var(--foreground)',
    borderRadius: 'var(--radius)',
    px: 2,
    '&:hover': {
      borderColor: 'var(--ring)',
      transform: 'translateY(-1px)',
      boxShadow: 'var(--shadow-sm)',
    },
  }}
>
  Taksit Planı
  {/* Badge — plan varsa */}
  <Box component="span" sx={{
    ml: 1, px: 1, py: 0.25,
    borderRadius: '20px',
    bgcolor: 'var(--chart-3)',
    color: 'white',
    fontSize: '0.7rem',
    fontWeight: 700,
  }}>
    {odemePlani.length}
  </Box>
</Button>
```

Toolbar: `display: flex`, `gap: 2`, `flexWrap: wrap`, `mb: 3`.

---

## 7. DocumentItemTable (Fatura Kalemleri Tablosu)

Paylaşılan bileşen: `components/Form/DocumentItemTable.tsx`

### 7.1 Üst bar

```
Fatura Kalemleri                    [Seçilenleri Sil (2)]  [+ Satır Ekle]
```

| Öğe | Stil |
|---|---|
| Başlık | `variant="h6"`, `fontWeight="bold"` |
| Seçilenleri Sil | `variant="outlined"`, `color="error"`, `size="small"`, `startIcon={<Delete />}` |
| + Satır Ekle | `variant="contained"`, gradient bg: `linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)`, `boxShadow: var(--shadow-md)` |

### 7.2 Desktop tablo

```tsx
<TableContainer
  component={Paper}
  variant="outlined"
  sx={{
    maxHeight: 400,
    borderRadius: 'var(--radius)',
    borderColor: 'var(--border)',
    bgcolor: 'var(--card)',
    overflowX: 'auto',
  }}
>
  <Table stickyHeader size="small" sx={{ minWidth: 1300, tableLayout: 'auto' }}>
```

**Tablo header satırı:**

```css
bgcolor: var(--muted)
fontWeight: 600-700
color: var(--muted-foreground) /* stok kolonu */
color: var(--foreground)       /* sayısal kolonlar */
```

**Kolonlar (sıra):**

| # | Kolon | minWidth |
|---|---|---|
| 1 | Checkbox | 50px |
| 2 | Stok Adı / Ürün (Autocomplete) | 405px |
| 3 | Miktar | 120px |
| 4 | Birim | 120px |
| 5 | Birim Fiyat (+ hesap makinesi 🧮) | 170px |
| 6 | KDV % | 100px |
| 7 | Ç.İ. (çoklu iskonto toggle) | 60px |
| 8 | İsk. Oran % | 100px |
| 9 | İsk. Tutar | 130px |
| 10 | Toplam (sağa hizalı, bold) | 110px |

**Satır stilleri:**

```css
bgcolor: var(--background)
border-bottom: 1px solid var(--border)
:hover { bgcolor: var(--muted) }
selected row: MUI selected state
```

**Stok Autocomplete dropdown öğesi:**

```
Stok Adı                    [Stok: 45]  ← renkli chip
Kod: ABC123 | Barkod: 869...
```

Stok chip renkleri:
- `miktar <= 0` → `var(--destructive)`
- `miktar < 10` → `var(--warning)`
- diğer → `var(--success)`

Chip stili: `height: 20`, `fontSize: 0.7rem`, `bgcolor: color-mix(10%)`, `border: 1px solid {color}`

**Özel fiyat badge:** Birim fiyat alanında `Chip label="Özel Fiyat"`, `color="warning"`, absolute `top: -12, right: -10`

**Hesap makinesi:** Birim fiyat alanında 🧮 butonu; `+`, `-`, `*`, `/` tuşları popover açar.

**Çoklu iskonto toggle:**
- Kapalı: `ToggleOff`, renk `var(--muted-foreground)`
- Açık: `ToggleOn`, renk `var(--chart-2)`
- Açıkken iskonto alanı `10+5` formül formatı kabul eder

**Boş tablo mesajı:** `colSpan={10}`, `py: 4`, `color: var(--muted-foreground)`, "Henüz kalem eklenmedi."

### 7.3 Mobil görünüm

`useMediaQuery(theme.breakpoints.down('md'))` → kart listesi (`MobileItemCard`):

```tsx
<Paper variant="outlined" sx={{
  p: 1.5, mb: 1.5,
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border)',
  bgcolor: 'var(--card)',
}}>
```

Her kart üstünde **Satır Toplamı** (bold, `var(--primary)`), altında 2 sütunlu grid alanlar.

### 7.4 Number input kuralı

Tüm sayı alanlarında spinner gizlenir:

```ts
const numberInputSx = {
  '& input[type=number]': { MozAppearance: 'textfield' },
  '& input[type=number]::-webkit-outer-spin-button': { WebkitAppearance: 'none', margin: 0 },
  '& input[type=number]::-webkit-inner-spin-button': { WebkitAppearance: 'none', margin: 0 },
};
```

---

## 8. Genel İskonto Alanları

Sağa hizalı, yan yana:

```tsx
<Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
  <TextField label="Genel İskonto %" type="number" sx={{ width: { xs: '100%', sm: '200px' } }} />
  <TextField label="Genel İskonto (₺)" type="number" sx={{ width: { xs: '100%', sm: '200px' } } } />
</Box>
```

Oran ↔ tutar birbirine bağlı hesaplanır (ara toplam üzerinden).

---

## 9. Fatura Özeti + Açıklama (Alt Bölüm)

### 9.1 Layout

```tsx
<Box sx={{
  display: 'flex',
  flexDirection: isMobile ? 'column' : 'row',
  gap: 2,
  alignItems: 'stretch',
}}>
  <Box sx={{ flex: 1 }}>{/* Açıklama TextField multiline rows=2 */}</Box>
  <Paper className="fatura-ozeti-card" sx={{ flex: 1, ... }}>{/* Özet */}</Paper>
</Box>
```

### 9.2 Fatura Özeti kartı

```tsx
<Paper
  className="fatura-ozeti-card"
  variant="outlined"
  sx={{
    p: isMobile ? 2.5 : 3,
    bgcolor: 'var(--card)',
    borderRadius: 'var(--radius-lg)',       // 20px
    border: '1px solid var(--border)',
    background: 'linear-gradient(135deg,
      color-mix(in srgb, var(--chart-3) 4%, var(--card)) 0%,
      color-mix(in srgb, var(--chart-1) 4%, var(--card)) 100%)',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.2s ease',
    '&:hover': {
      boxShadow: 'var(--shadow-md)',
      transform: 'translateY(-1px)',
    },
    // Desktop sticky:
    position: 'sticky',
    top: 16,
    alignSelf: 'flex-start',
  }}
>
```

**KDV Dahil badge (sağ üst köşe):**

```tsx
<Box sx={{
  position: 'absolute',
  top: 12, right: 12,
  px: 1.5, py: 0.5,
  borderRadius: '20px',
  bgcolor: 'color-mix(in srgb, var(--chart-3) 12%, transparent)',
  border: '1px solid color-mix(in srgb, var(--chart-3) 25%, transparent)',
}}>
  <Typography sx={{
    fontWeight: 600,
    color: 'var(--chart-3)',
    fontSize: '0.65rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  }}>
    KDV Dahil
  </Typography>
</Box>
```

**Özet satırları (2 sütun desktop):**

| Satır | Stil |
|---|---|
| Ara Toplam | muted label + `fontWeight: 600` değer |
| Malzeme İndirimleri | değer > 0 ise `color: error.main`, `- ` prefix |
| Genel İskonto | aynı negatif stil |
| KDV Toplamı | normal |
| Toplam İndirim | negatif stil |
| **Genel Toplam** | `variant="h5"`, `fontWeight: 900`, `fontSize: 1.4rem`, `color: var(--chart-3)`, `letterSpacing: -0.02em` |

Satırlar arası: `display: flex`, `justifyContent: space-between`, `mb: 1`.  
Genel toplam öncesi: `Divider`, `my: 1.5`.

**Para formatı:**
```ts
new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount)
```

---

## 10. Aksiyon Butonları (Footer)

Sağ alt, `justifyContent: flex-end`:

```
                    [Taslak Olarak Kaydet]  [Kaydet]
```

| Buton | Variant | Görünürlük | Stil |
|---|---|---|---|
| Taslak Olarak Kaydet | `outlined` | `durum !== 'APPROVED'` | border `var(--border)`, hover `translateY(-1px)` |
| Kaydet / Güncelle | `contained` | her zaman | bg `var(--primary)`, hover `translateY(-2px)`, `shadow-lg` |

**Ortak buton kuralları:**
```css
textTransform: none
fontWeight: 600
borderRadius: var(--radius)
minWidth: 160px (desktop), 100% (mobil)
size: large
startIcon: <Save /> veya <CircularProgress size={20} />
```

**Onaylı fatura:** Kaydet butonu `bgcolor: var(--muted)`, disabled.

**Mobil:** `flexDirection: column-reverse` — primary buton altta.

**className'ler:** `btn-save-draft`, `btn-save-primary` (test/override için).

---

## 11. Ödeme Planı Dialogu

Secondary dialog — taksit planı yönetimi.

```tsx
<Dialog
  maxWidth="md"
  fullWidth
  PaperProps={{ sx: { borderRadius: 'var(--radius-lg)', overflow: 'hidden' } }}
>
```

**DialogTitle (gradient header):**

```tsx
<DialogTitle sx={{
  pb: 1,
  display: 'flex',
  alignItems: 'center',
  gap: 1.5,
  borderBottom: '1px solid var(--border)',
  background: 'linear-gradient(135deg,
    color-mix(in srgb, var(--chart-3) 8%, var(--card)) 0%,
    color-mix(in srgb, var(--chart-1) 5%, var(--card)) 100%)',
}}>
  {/* 36×36 ikon kutusu + başlık + alt açıklama */}
</DialogTitle>
```

**Hızlı taksit chip'leri:** `2, 3, 6, 9, 12 Ay` — `borderRadius: 20px`, hover `borderColor: var(--chart-3)`.

**DialogActions:** `borderTop: 1px solid var(--border)`, sağda Kapat (contained), solda Temizle (error outlined).

---

## 12. State & Davranış

### 12.1 Form state

```ts
interface InvoiceDraft {
  faturaNo: string;
  faturaTipi: 'SALE';
  cariId: string;
  warehouseId: string;
  tarih: string;          // ISO date YYYY-MM-DD
  vade: string;
  durum: 'DRAFT' | 'APPROVED';
  genelIskontoOran: number;
  genelIskontoTutar: number;
  aciklama: string;
  satisElemaniId: string;
  kalemler: DocumentItem[];
  eScenario: string;
  eInvoiceType: string;
  gonderimSekli: string;
  odemePlani: OdemePlaniItem[];
}
```

### 12.2 Draft persist

```ts
// invoiceDraftStore — yalnızca yeni fatura modunda
useEffect(() => {
  if (!editFaturaId) updateDraft('sales', formData);
}, [formData]);
```

### 12.3 Tab entegrasyonu

```ts
addTab({ id: 'invoice-sales-yeni', label: 'Yeni Satış Faturası', path: '/invoice/sales/yeni' });
setActiveTab('invoice-sales-yeni');
// Kayıt sonrası:
removeTab('invoice-sales-yeni');
router.push('/invoice/sales');
```

### 12.4 Toplam hesaplama

```ts
totals = {
  araToplam,        // Σ(miktar × birimFiyat)
  kalemIskonto,     // Σ(iskontoTutar)
  genelIskonto,     // formData.genelIskontoTutar
  toplamIskonto,    // kalemIskonto + genelIskonto
  toplamKdv,        // Σ(net × kdvOrani/100)
  genelToplam,      // (araToplam - iskontolar) + toplamKdv
}
```

### 12.5 Disabled kuralı

```ts
const isLocked = !!editFaturaId && formData.durum === 'APPROVED';
// Tüm input, tablo, barkod, butonlar: disabled={isLocked}
```

### 12.6 Loading state

```tsx
if (loading) return (
  <MainLayout>
    <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
      <CircularProgress />
    </Box>
  </MainLayout>
);
```

### 12.7 Snackbar

```tsx
<Snackbar autoHideDuration={6000}>
  <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
</Snackbar>
```

---

## 13. Responsive Kurallar

| Breakpoint | Davranış |
|---|---|
| `md` ve üzeri | Tab görünür, özet sticky, butonlar yatay, grid 4 kolon |
| `md` altı | Tab gizli, başlık dikey, özet altında, butonlar fullWidth column-reverse |
| Tablo | Desktop: scrollable table; Mobil: card list |
| Genel iskonto | Mobilde `width: 100%` |

MUI hook:
```ts
const isMobile = useMediaQuery(theme.breakpoints.down('md'));
```

---

## 14. Başka Projede Uygulama — Checklist

### Adım 1: Altyapı
- [ ] CSS token'ları (`globals.css` eşdeğeri)
- [ ] `.form-control-textfield` ve `.form-control-select` class'ları
- [ ] `DocumentItemTable` veya eşdeğer kalem tablosu bileşeni
- [ ] `invoiceDraftStore` / form draft persist (opsiyonel ama önerilir)
- [ ] `tabStore` entegrasyonu

### Adım 2: Sayfa iskeleti
- [ ] `MainLayout` wrapper
- [ ] Page header (48px ikon + h5 başlık + body2 alt metin)
- [ ] `Paper.premium-form-card` (3px top border + hover lift)
- [ ] `Stack spacing={3}` iç bölümleme

### Adım 3: Form alanları
- [ ] Responsive grid `repeat(auto-fit, minmax(200px, 1fr))`
- [ ] Cari Autocomplete tam genişlik
- [ ] Tüm alanlara `form-control-*` class
- [ ] Date input'larda `InputLabelProps={{ shrink: true }}`

### Adım 4: Kalemler
- [ ] Section header (ikon + UPPERCASE + divider)
- [ ] Barkod input (260px, QrCodeScanner icon)
- [ ] DocumentItemTable (sticky header, maxHeight 400)
- [ ] Gradient "+ Satır Ekle" butonu

### Adım 5: Özet & aksiyonlar
- [ ] Genel iskonto sağa hizalı
- [ ] Fatura özeti gradient kart + KDV Dahil badge + sticky
- [ ] Genel toplam büyük `chart-3` renk
- [ ] Taslak + Kaydet butonları sağ alt

### Adım 6: Davranış
- [ ] Barkod Enter ile kalem ekleme
- [ ] Cari vade otomasyonu
- [ ] Draft auto-save
- [ ] Tab açma/kapama
- [ ] Snackbar feedback
- [ ] Onaylı belge kilitleme

### Adım 7: Doğrulama
- [ ] Form kartında 3px üst primary çizgi var mı?
- [ ] Hover'da kart `translateY(-2px)` kalkıyor mu?
- [ ] İkon kutusu `chart-3` %12 mix arka plan mı?
- [ ] Tablo header `var(--muted)` arka planlı mı?
- [ ] Genel toplam `1.4rem / 900 / chart-3` mi?
- [ ] Mobilde tablo kart listesine dönüşüyor mu?

---

## 15. Minimum Kod Şablonu

```tsx
export function DocumentFormPage() {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <MainLayout>
      {/* Page Header */}
      <Box sx={{ mb: isMobile ? 2 : 3 }}>
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: 2.5 }}>
          <Box sx={{
            width: 48, height: 48, borderRadius: 'var(--radius-md)',
            bgcolor: 'color-mix(in srgb, var(--chart-3) 12%, transparent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Receipt sx={{ fontSize: 24, color: 'var(--chart-3)' }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={700} sx={{ color: 'var(--foreground)', letterSpacing: '-0.01em' }}>
              Yeni Satış Faturası
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--muted-foreground)', mt: 0.25 }}>
              Satışlerinizi profesyonelce faturalandirin
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Premium Form Card */}
      <Paper className="premium-form-card" sx={{
        p: 3, borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-md)',
        bgcolor: 'var(--card)', borderTop: '3px solid var(--primary)',
        transition: 'all 0.2s ease',
        '&:hover': { boxShadow: 'var(--shadow-lg)', transform: 'translateY(-2px)' },
      }}>
        <Stack spacing={3}>
          {/* Genel Bilgiler grid + Cari */}
          {/* Kalemler section + DocumentItemTable */}
          {/* Genel İskonto */}
          {/* Özet + Açıklama */}
          {/* Action buttons */}
        </Stack>
      </Paper>
    </MainLayout>
  );
}
```

---

## 16. Yapılmaması Gerekenler

| ❌ Yapma | ✅ Bunun yerine |
|---|---|
| Formu modal/dialog içinde aç | Tam sayfa `MainLayout` içinde kart |
| Düz beyaz kart, gölgesiz | `premium-form-card` + top accent + hover lift |
| Primary renk her yerde | Sayfa accent olarak `chart-3`, primary sadece border ve kaydet |
| Tabloya maxHeight vermemek | `maxHeight: 400`, `stickyHeader` |
| Label'ları normal case bırakmak | `form-control-*` ile uppercase küçük label |
| Mobilde tablo sıkıştırmak | `MobileItemCard` listesine geç |
| Genel toplamı küçük font | `1.4rem`, `fontWeight: 900`, `chart-3` |
| İptal butonu koymak | Bu sayfada iptal yok; sadece Taslak + Kaydet |
| Number input spinner bırakmak | `numberInputSx` ile gizle |
| Özet kartını static bırakmak | Desktop'ta `sticky top: 16` |

---

## 17. Sayfa Bazlı Özelleştirme Tablosu

Aynı pattern farklı belge türlerinde şu alanlarla özelleştirilir:

| Alan | Satış Faturası | Satın Alma Faturası | İrsaliye |
|---|---|---|---|
| İkon | `Receipt` | `Receipt` | `LocalShipping` |
| Accent renk | `chart-3` | `chart-3` | modüle göre |
| Başlık | Yeni Satış Faturası | Yeni Satın Alma Faturası | Yeni Satış İrsaliyesi |
| Cari label | Cari Seçiniz | Tedarikçi Seçiniz | Cari/Tedarikçi |
| Tab id | `invoice-sales-yeni` | `invoice-purchase-yeni` | `sales-delivery-note-yeni` |
| Draft key | `sales` | `purchase` | `deliveryNote` |

Görsel yapı, spacing, kart stili, tablo ve özet kartı **değişmez**.

---

## 18. Referans Ölçü Tablosu

| Bileşen | Ölçü |
|---|---|
| Page header ikon kutusu | 48×48px |
| Page header ikon | 24px |
| Form kart padding | 24px |
| Form kart top border | 3px |
| Bölümler arası gap (Stack) | 24px |
| Form grid gap | 16px |
| Form grid min column | 200px |
| Barkod input genişlik | 260px |
| Section label font | 0.7rem, uppercase, 0.08em spacing |
| Tablo max height | 400px |
| Tablo min width | 1300px |
| Özet kart border-radius | 20px (`--radius-lg`) |
| Özet sticky top | 16px |
| Genel toplam font | 1.4rem / 900 |
| Kaydet buton min-width | 160px |
| Dialog border-radius | 20px (`--radius-lg`) |
| Mobil breakpoint | 960px (`md`) |

---

*Bu belge `muhasebe.localhost/invoice/sales/yeni` sayfasının premium belge formu tasarımının birebir taşınması için hazırlanmıştır. Yeni belge türü eklerken görsel iskeleti koruyup yalnızca alan adları, ikon ve accent rengini modüle göre uyarlayın.*
