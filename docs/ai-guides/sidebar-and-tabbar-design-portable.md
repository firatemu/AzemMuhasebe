# Sol Dikey Menü + Yatay Sekme Çubuğu — Taşınabilir AI Uygulama Rehberi

**Versiyon:** 1.0  
**Kaynak proje:** Muhasebe ERP (`muhasebe.localhost`)  
**Kaynak dosyalar:**
- `panel-stage/client/src/components/Layout/Sidebar.tsx`
- `panel-stage/client/src/components/Layout/TabBar.tsx`
- `panel-stage/client/src/components/Layout/ClientMainLayout.tsx`
- `panel-stage/client/src/components/Layout/Header.tsx`
- `panel-stage/client/src/stores/tabStore.ts`
- `panel-stage/client/src/stores/layoutStore.ts`
- `panel-stage/client/src/styles/design-system.css`
- `panel-stage/client/src/config/menuItems.ts`

**Amaç:** Bu belgeyi okuyan bir AI agent, Muhasebe panelindeki **sol dikey menü (sidebar)** ve **yatay modül sekmeleri (TabBar)** tasarımını başka projelerde **aynı görsel dil ve davranışla** yeniden üretebilmelidir.

---

## 0. AI Agent İçin Özet Talimat

Bu pattern şunları üretir:

1. **Sol dikey sidebar (280px)** — glassmorphism + gradient mesh arka plan, 3 seviyeli menü, arama, hızlı işlem, kullanıcı profili
2. **Üst header (64px)** — menü aç/kapat, sabitle, tema, kullanıcı
3. **Yatay TabBar (48px, sticky)** — açık modüller sekmeler halinde; kapatılabilir; aktif sekme alt çizgili
4. **İçerik alanı** — `padding: 24px`, arka plan `var(--background)`

**Zorunlu tasarım kararları (bunları değiştirme):**

| Karar | Değer |
|---|---|
| Sidebar genişliği | `280px` sabit (`SIDEBAR_WIDTH`) |
| Sidebar görsel dili | Glassmorphism kartlar + renkli gradient ikon kutuları + 3D tilt hover |
| Aktif menü öğesi | Öğenin `color` alanı düz arka plan; metin beyaz |
| Pasif menü öğesi | Yarı saydam beyaz/koyu cam efekti + ince border |
| TabBar konumu | Header altında, `position: sticky`, `top: 64px` |
| Tab göstergesi | 3px yükseklik, `var(--primary)`, üst köşeler yuvarlak |
| Sekme kapatma | Her sekmede `×` butonu; kırmızı hover |
| Menü → sekme | Sidebar tıklaması yeni sekme açar veya mevcut sekmeyi aktifleştirir |
| Boş sekme | Tüm sekmeler kapanınca `/menu` sayfasına yönlendir |

**Zorunlu davranış kararları:**

1. Sidebar iki modda çalışır: **temporary overlay** (mobil/kapalı) ve **permanent pinned** (sabit)
2. Pin durumu `localStorage`'da kalıcı (`layoutStore`)
3. Sekme listesi global state (`tabStore` — Zustand)
4. `/menu` sayfasında TabBar **gizlenir**
5. Menü öğelerinde `subItems` varsa tıklama alt menüyü açar; yoksa sekme + route

---

## 1. Genel Layout Anatomisi

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  SIDEBAR (280px)          │  MAIN AREA                                      │
│  ┌─────────────────────┐  │  ┌───────────────────────────────────────────┐  │
│  │ Tenant Header       │  │  │ HEADER (64px, fixed)                      │  │
│  │ Hızlı İşlem         │  │  │ [≡] [📌]  ...  tarih  tema  kullanıcı     │  │
│  ├─────────────────────┤  │  ├───────────────────────────────────────────┤  │
│  │ 🔍 Ara...           │  │  │ TAB BAR (48px, sticky, top:64)            │  │
│  ├─────────────────────┤  │  │ [Dashboard ×] [Cari Listesi ×] [Fatura ×] │  │
│  │                     │  │  ├───────────────────────────────────────────┤  │
│  │  ▼ Stok Yönetimi    │  │  │                                           │  │
│  │    Malzeme Listesi  │  │  │  PAGE CONTENT (p:24px)                    │  │
│  │    Fiyat Kartları   │  │  │                                           │  │
│  │  ▶ Finans           │  │  │                                           │  │
│  │                     │  │  │                                           │  │
│  ├─────────────────────┤  │  │                                           │  │
│  │ 👤 Kullanıcı Profil │  │  └───────────────────────────────────────────┘  │
│  └─────────────────────┘  │                                                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Bileşen hiyerarşisi:**

```
ClientMainLayout
├── Sidebar (Drawer, 280px)
├── main (flex: 1)
│   ├── Header (AppBar, fixed, 64px)
│   ├── Toolbar (spacer, 64px)
│   ├── TabBar (sticky)
│   └── content Box (p: 3)
```

**Header genişlik hesabı (sidebar pinned iken):**

```ts
width: `calc(100% - ${sidebarPinned ? SIDEBAR_WIDTH : 0}px)`
marginLeft: sidebarPinned ? `${SIDEBAR_WIDTH}px` : 0
```

---

## 2. Tasarım Sistemi (CSS Değişkenleri)

Başka projede bu token'ları birebir veya eşdeğer değerlerle tanımla. Kaynak: `design-system.css`.

### Light mode (`:root`)

```css
--background: #F8FAFC;
--foreground: #0F172A;
--card: #FFFFFF;
--muted: #F1F5F9;
--muted-foreground: #64748B;
--primary: #1E1B4B;
--destructive: #EF4444;
--border: #E2E8F0;
--radius-sm: 0.5rem;   /* 8px */
--shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
--transition-normal: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
```

### Dark mode (`.dark`)

```css
--background: #020617;
--foreground: #F8FAFC;
--card: #0F172A;
--muted: #1E293B;
--muted-foreground: #94A3B8;
--border: #1E293B;
--primary: #F8FAFC;
```

### Sidebar'a özel sabit renkler (light)

| Kullanım | Renk |
|---|---|
| Sidebar gradient arka plan | `#F5F7FA → #E8EEF5` (180deg) |
| Menü metni (pasif) | `#475569` |
| Menü metni (aktif) | `#FFFFFF` |
| İkincil metin | `#64748B` / `#94A3B8` |
| Bölüm başlığı | `#94A3B8`, uppercase, 0.6rem |
| Hover vurgusu | `rgba(59, 130, 246, 0.12)` |
| Varsayılan menü rengi | `#0ea5e9` |

### Sidebar'a özel sabit renkler (dark)

| Kullanım | Renk |
|---|---|
| Sidebar gradient arka plan | `#0F172A → #1E293B` (180deg) |
| Menü metni (pasif) | `#CBD5E1` |
| Pasif kart arka planı | `rgba(30, 41, 59, 0.5)` |
| Hover vurgusu | `rgba(59, 130, 246, 0.2)` |

---

## 3. Sol Dikey Menü (Sidebar) — Tam Spesifikasyon

### 3.1 Drawer kabuğu

```ts
const SIDEBAR_WIDTH = 280;

// MUI Drawer
anchor: "left"
variant: pinned ? "permanent" : "temporary"
transitionDuration: { enter: 250, exit: 200 }  // temporary modda

// .MuiDrawer-paper
width: 280
display: flex
flexDirection: column
overflow: hidden
borderRight: light → "1px solid rgba(0,0,0,0.06)" | dark → "1px solid rgba(255,255,255,0.08)"
background: light → "linear-gradient(180deg, #F5F7FA 0%, #E8EEF5 100%)"
           dark → "linear-gradient(180deg, #0F172A 0%, #1E293B 100%)"
```

### 3.2 Arka plan efektleri (dekoratif, z-index: 0)

**Katman 1 — Gradient mesh (animasyonlu):**
- `position: absolute; inset: 0`
- 6 adet `radial-gradient` katmanı (light modda pastel tonlar)
- `animation: meshMove 25s linear infinite` — background-position kaydırma

**Katman 2 — Floating orbs (6 adet):**
- Boyutlar: 300, 250, 200, 180, 150, 120 px
- `filter: blur(50px)`
- `opacity: 0.07–0.15` (dark'ta daha düşük)
- `animation: float 20–30s ease-in-out infinite` (her orb farklı süre ve gecikme)

Bu katmanlar `pointer-events: none` ve `aria-hidden` olmalı.

### 3.3 Üst bölüm: Tenant Header (glassmorphism + 3D tilt)

```
┌──────────────────────────────────────────┐
│ [LOGO 32×32]  ŞİRKET ADI        [📌/✕]  │
│               KURUMSAL ERP               │
└──────────────────────────────────────────┘
```

| Özellik | Değer |
|---|---|
| Container | MUI `Toolbar`, `m: 1`, `mb: 0.5`, `borderRadius: 10px` |
| Arka plan | `rgba(255,255,255,0.6)` light / `rgba(30,41,59,0.6)` dark |
| `backdropFilter` | `blur(12px)` |
| Border | light: `1px solid rgba(255,255,255,0.8)` |
| Box shadow | light: `0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)` |
| 3D tilt | Mouse hareketinde `perspective(1000px) rotateX/Y` (bölücü: 30) |
| Radial highlight | `::before` pseudo — mouse pozisyonunda radial-gradient |

**Logo kutusu (32×32):**
- Logo yoksa: gradient `#BBDEFB → #90CAF9`, `DirectionsCar` ikonu 16px
- Logo varsa: `object-fit: contain`, ince border
- Animasyon (logo yoksa): `iconFloat 4s` — `translateY(-3px)` pulse

**Metin:**
- Şirket adı: `fontSize: 0.75rem`, `fontWeight: 700`, `letterSpacing: -0.02em`
- Alt satır: `fontSize: 0.6rem`, `letterSpacing: 0.05em`, "KURUMSAL ERP"

**Sağ buton (28×28):**
- Pinned ise `PushPin`, değilse `Close`
- Glassmorphism mini buton, hover'da `scale(1.05)`

### 3.4 Hızlı İşlem butonu

```
┌──────────────────────────────────────────┐
│  ⚡ Hızlı İşlem                           │
└──────────────────────────────────────────┘
```

| Özellik | Değer |
|---|---|
| `fullWidth` contained Button | |
| İkon | `FlashOn`, 14px |
| Arka plan | `rgba(255,255,255,0.6)` + `blur(12px)` |
| Border | `1px solid rgba(255,255,255,0.8)` |
| Border radius | `8px` |
| Font | `0.7rem`, `fontWeight: 600`, `textTransform: none` |
| Hover | `translateY(-1px)`, daha opak arka plan |
| Dropdown | Glassmorphism menu, her öğede renkli ikon kutusu |

### 3.5 Arama alanı

```
┌──────────────────────────────────────────┐
│ 🔍  Ara...                               │
└──────────────────────────────────────────┘
```

| Özellik | Değer |
|---|---|
| İkon | `Search`, absolute left 10px, 16px |
| Input arka plan | `rgba(255,255,255,0.6)` + `blur(10px)` |
| Border radius | `8px` |
| Font | `0.75rem`, padding-left: 28px (3.5 spacing unit) |
| Focus border | light: `#BBDEFB`, dark: `rgba(59,130,246,0.5)` |
| Placeholder | `#94A3B8` |

**Arama davranışı:**
- Parent label veya subItem label'da arama
- Eşleşen alt menü varsa parent otomatik açılır
- Sidebar kapanınca arama ve açık alt menüler sıfırlanır

### 3.6 Menü öğesi hiyerarşisi (3 seviye)

#### Seviye 1 — Ana menü öğesi (`SidebarItem`)

```
┌──────────────────────────────────────────┐
│ [İKON 32×32]  Stok Yönetimi          ▼  │
└──────────────────────────────────────────┘
```

| Özellik | Değer |
|---|---|
| `borderRadius` | `10px` |
| Margin | `mx: 1`, `mb: 0.5` |
| Padding iç | `p: 1`, `gap: 1` |
| İkon kutusu | 32×32, `borderRadius: 8px`, gradient(`item.color`) |
| İkon boyutu | 16px, beyaz |
| Label font | `0.8rem`, `fontWeight: 600`, `letterSpacing: -0.01em` |
| Expand ikonu | `ExpandMore` 16px, açıkken `rotate(180deg)` |
| Collapse animasyon | MUI `Collapse`, `timeout: 200`, `unmountOnExit` |

**Pasif durum:**
```css
background: rgba(255,255,255,0.5)           /* light */
background: rgba(30,41,59,0.5)              /* dark */
backdrop-filter: blur(16px)
border: 1px solid rgba(255,255,255,0.6)     /* light */
box-shadow: 0 1px 4px rgba(0,0,0,0.04)
```

**Aktif durum:**
```css
background: {item.color}                    /* düz renk, örn. #06b6d4 */
border: 1px solid rgba(255,255,255,0.8)
box-shadow: 0 4px 12px {item.color}30
color: #FFFFFF
```

**Hover (pasif):**
```css
background: rgba(59,130,246,0.12)           /* light */
transform: translateX(2px)
box-shadow: 0 2px 8px rgba(59,130,246,0.15)
```

**3D tilt hover efekti:**
```ts
rotateX = (mouseY - centerY) / 25
rotateY = (centerX - mouseX) / 25
transform: perspective(1000px) rotateX(...) rotateY(...)
```

**Radial spotlight (`::before`):**
```css
radial-gradient(200px circle at {mouseX}px {mouseY}px, rgba(255,255,255,0.3), transparent 40%)
opacity: 0.6
```

**Aktif ikon animasyonu:**
```css
@keyframes iconFloat {
  0%, 100% { transform: translateY(0) scale(1) }
  50%      { transform: translateY(-2px) scale(1.02) }
}
animation: iconFloat 3s ease-in-out infinite
```

#### Seviye 2 — Alt menü (`SidebarSubItem`)

| Özellik | Değer |
|---|---|
| `borderRadius` | `8px` |
| Margin | `ml: 0.5`, `mr: 0.25`, `mb: 0.25` |
| Padding iç | `p: 0.75`, `gap: 0.75` |
| İkon kutusu | 24×24, `borderRadius: 6px` |
| İkon boyutu | 12px |
| Label font | `0.75rem`, `fontWeight: 600` |
| `backdropFilter` | `blur(12px)` |
| Hover | `translateX(2px)` |

**Alt menü container (Collapse içi):**
```css
background: rgba(255,255,255,0.3)
backdrop-filter: blur(12px)
border-radius: 8px
border: 1px solid rgba(255,255,255,0.5)
padding: 4px (0.5 spacing)
```

#### Seviye 3 — İç içe alt menü (nested)

| Özellik | Değer |
|---|---|
| `borderRadius` | `6px` |
| İkon kutusu | 20×20, `borderRadius: 5px` |
| İkon boyutu | 10px |
| Label font | `0.7rem` |
| Container | `rgba(255,255,255,0.2)`, `blur(8px)`, `borderRadius: 6px` |

### 3.7 Bölüm başlıkları (section headers)

Menü verisinde `section` alanı varsa ve arama aktif değilse göster:

```ts
// Örnek
{ id: '...', label: '...', section: 'OPERASYON', ... }
```

| Özellik | Değer |
|---|---|
| Font | `0.6rem`, `fontWeight: 700`, `letterSpacing: 0.1em` |
| Transform | `uppercase` |
| Renk | `#94A3B8` |
| Alt çizgi | `height: 1px`, `maxWidth: 30px`, `rgba(0,0,0,0.06)` |

### 3.8 Scrollbar (menü listesi)

```css
overflow-y: auto
flex-grow: 1

::-webkit-scrollbar { width: 4px }
::-webkit-scrollbar-track { background: transparent }
::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.15)
  border-radius: 2px
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(255,255,255,0.25)
}
```

### 3.9 Alt bölüm: Kullanıcı profili

```
┌──────────────────────────────────────────┐
│ [AV 28×28]  Ad Soyad              ⋮      │
│             Rol bilgisi                  │
└──────────────────────────────────────────┘
```

| Özellik | Değer |
|---|---|
| Üst border | `1px solid rgba(0,0,0,0.06)` |
| Kart arka plan | `rgba(255,255,255,0.5)` + `blur(12px)` |
| Border radius | `8px` |
| Avatar | 28×28, gradient mavi, ilk harf |
| Ad font | `0.75rem`, `fontWeight: 600` |
| Rol font | `0.65rem`, muted renk |
| Hover | `translateY(-1px)`, daha opak arka plan |
| Dropdown | Glassmorphism; Ayarlar + Çıkış Yap (kırmızı) |

### 3.10 İkon gradient yardımcı fonksiyonu

Her menü öğesinin `color` alanından gradient üret:

```ts
function adjustColor(hex: string, amount: number): string {
  // RGB bileşenlerine amount ekle, 0-255 arasında tut
}

function generateGradient(color: string): string {
  const darker = adjustColor(color, -20);
  return `linear-gradient(135deg, ${color} 0%, ${darker} 100%)`;
}
```

İkon kutusu gölgesi: `box-shadow: 0 2px 8px ${color}30`

---

## 4. Yatay Sekme Çubuğu (TabBar) — Tam Spesifikasyon

### 4.1 Konum ve görünürlük

```ts
// TabBar.tsx kuralları:
if (tabs.length === 0 || pathname === '/menu') return null;
```

TabBar yalnızca en az bir açık sekme varken ve `/menu` dışındaki sayfalarda görünür.

### 4.2 Container

```css
border-bottom: 1px solid var(--border)
background: var(--card)
box-shadow: var(--shadow-xs)
position: sticky
top: 64px          /* Header yüksekliği */
z-index: 1100
```

### 4.3 MUI Tabs yapılandırması

```tsx
<Tabs
  value={activeTab}
  variant="scrollable"
  scrollButtons="auto"
  sx={{
    minHeight: 48,
    '& .MuiTabs-indicator': {
      height: 3,
      bgcolor: 'var(--primary)',
      borderRadius: '3px 3px 0 0',
    },
    '& .MuiTabs-scrollButtons': {
      color: 'var(--muted-foreground)',
      '&:hover': { color: 'var(--foreground)' },
      '&.Mui-disabled': { opacity: 0.3 },
    },
  }}
>
```

### 4.4 Tek sekme (Tab) tasarımı

```
┌──────────────────────┐
│  Cari Listesi    ×   │
└──────────────────────┘
      ═══════════        ← 3px indicator (aktif)
```

| Özellik | Değer |
|---|---|
| `textTransform` | `none` |
| `minHeight` | `48px` |
| Padding | `px: 2` (16px), `py: 1.5` (12px) |
| Font (label) | `0.875rem` (14px) |
| Font weight | aktif: `600`, pasif: `500` |
| Renk | aktif: `var(--foreground)`, pasif: `var(--muted-foreground)` |
| Transition | `all 0.2s ease` |
| Hover | `color: var(--foreground)`, `bgcolor: var(--muted)` |
| `Mui-selected` | `color: var(--foreground)`, `fontWeight: 600` |

**Kapatma butonu (×):**

| Özellik | Değer |
|---|---|
| İkon | MUI `Close`, `fontSize: 14` |
| Padding | `0.5` (4px) |
| Border radius | `var(--radius-sm)` (8px) |
| Renk | `var(--muted-foreground)` |
| Hover arka plan | `color-mix(in srgb, var(--destructive) 10%, transparent)` |
| Hover renk | `var(--destructive)` (#EF4444) |

Kapatma tıklaması `event.stopPropagation()` ile sekme değiştirmeyi engeller.

### 4.5 Sekme davranışı (state + routing)

**tabStore (Zustand):**

```ts
interface Tab {
  id: string;      // menü öğesi id ile aynı
  label: string;
  path: string;
  icon?: string;
}

// addTab: aynı id varsa yeni eklemez, sadece aktifleştirir
// removeTab: son sekme kapanınca tabs=[], activeTab=''
// setActiveTab: aktif sekme id günceller
```

**Sekme açma (sidebar'dan):**
```ts
addTab({ id: item.id, label: item.label, path: item.path });
setActiveTab(item.id);
router.push(item.path);
```

**Sekme değiştirme:**
```ts
setActiveTab(newTabId);
router.push(tab.path);
```

**Sekme kapatma (aktif sekme kapanıyorsa):**
```ts
// Önce sol komşu, yoksa sağ komşu sekmeye git
const targetTab = previousTab ?? nextTab;
router.push(targetTab?.path ?? '/menu');
```

**Tüm sekmeler kapandığında:**
```ts
useEffect(() => {
  if (tabs.length === 0 && !pathname.includes('/print') && pathname !== '/menu') {
    router.push('/menu');
  }
}, [tabs.length, pathname]);
```

### 4.6 TabBar vs sayfa içi sekmeler

Bu rehberdeki **ana TabBar** modül navigasyonudur (browser tab benzeri).

Sayfa içi sekmeler (ör. fatura detay, POS kategori) benzer MUI Tabs stilini paylaşır:
- `minHeight: 48` veya `56`
- Indicator: `height: 3`, `borderRadius: 3px 3px 0 0`
- `textTransform: none`, `fontWeight: 600–700`

Fark: sayfa içi sekmelerde **kapatma butonu yok**; container genelde `borderBottom: 1px solid var(--border)` ve `bgcolor: var(--muted)` veya `var(--card)`.

---

## 5. Menü Veri Modeli

```ts
interface MenuItem {
  id: string;           // benzersiz; tab id ile aynı
  label: string;        // görünen metin
  icon: string;         // IconMap anahtarı (MUI icon adı)
  path?: string;        // route; subItems varsa opsiyonel
  color: string;        // hex, örn. "#06b6d4"
  bgColor?: string;     // opsiyonel arka plan tonu
  section?: string;     // bölüm başlığı
  subItems?: MenuItem[];
}
```

**Örnek:**

```ts
{
  id: 'stock',
  label: 'Stok Yönetimi',
  icon: 'Inventory',
  color: '#06b6d4',
  bgColor: '#ecfeff',
  subItems: [
    {
      id: 'stock-material-list',
      label: 'Malzeme Listesi',
      icon: 'Inventory',
      path: '/stock/material-list',
      color: '#06b6d4',
    },
  ],
}
```

**3 seviye iç içe örnek:**

```ts
{
  id: 'sales-management',
  label: 'Satış Yönetimi',
  icon: 'PointOfSale',
  color: '#8b5cf6',
  subItems: [
    {
      id: 'invoice',
      label: 'Faturalar',
      icon: 'Receipt',
      color: '#1e293b',
      subItems: [
        { id: 'invoice-sales', label: 'Satış Faturaları', path: '/invoice/sales', color: '#8b5cf6', icon: 'PointOfSale' },
      ],
    },
  ],
}
```

**Renk paleti önerisi (modül bazlı):**

| Modül | color |
|---|---|
| Genel / Menü | `#0ea5e9` |
| Dashboard | `#667eea` |
| Stok | `#06b6d4` |
| Cari | `#334155` / `#8b5cf6` |
| Satış | `#8b5cf6` |
| Finans | `#059669` / `#10b981` |
| Uyarı | `#ef4444` |
| Ayarlar | `#64748B` |

---

## 6. Layout State (Sidebar pin/open)

```ts
// layoutStore.ts — Zustand + persist
interface LayoutState {
  sidebarOpen: boolean;    // overlay açık mı
  sidebarPinned: boolean;  // sabit mi
}

// Pin açılınca sidebar her zaman açık
// Pin kapalıyken toggle overlay açar/kapatır
// Pin açıkken overlay toggle çalışmaz
```

**Sidebar modları:**

| Durum | Drawer variant | Davranış |
|---|---|---|
| `pinned: false, open: false` | temporary | Gizli |
| `pinned: false, open: true` | temporary | Overlay, dışarı tıklayınca kapanır |
| `pinned: true` | permanent | Her zaman görünür, layout'u iter |

**Menü tıklaması sonrası:**
- `pinned: false` → sidebar kapanır
- `pinned: true` → sidebar açık kalır

---

## 7. Başka Projede Uygulama — Adım Adım Checklist

AI agent şu sırayı izlemeli:

### Adım 1: Altyapı
- [ ] CSS design token'larını ekle (`design-system.css` eşdeğeri)
- [ ] `SIDEBAR_WIDTH = 280` sabitini tanımla
- [ ] `tabStore` ve `layoutStore` oluştur
- [ ] `menuItems` config dosyası oluştur

### Adım 2: Layout iskeleti
- [ ] `ClientMainLayout`: flex row, sidebar + main
- [ ] `Header`: fixed 64px, sidebar genişliğine göre margin
- [ ] `Toolbar` spacer (64px)
- [ ] `TabBar`: sticky, top 64
- [ ] Content: `p: 3`, `bgcolor: var(--background)`

### Adım 3: Sidebar
- [ ] MUI Drawer, 280px, gradient arka plan
- [ ] Mesh + orb dekorasyon katmanları
- [ ] Tenant header (glassmorphism + tilt)
- [ ] Hızlı işlem butonu + dropdown
- [ ] Arama alanı
- [ ] `SidebarItem` / `SidebarSubItem` / nested — 3 seviye
- [ ] Bölüm başlıkları
- [ ] Kullanıcı profili footer
- [ ] `generateGradient()` + `adjustColor()` yardımcıları
- [ ] 3D tilt + radial spotlight hover efektleri

### Adım 4: TabBar
- [ ] MUI Tabs scrollable
- [ ] 48px yükseklik, 3px indicator
- [ ] Kapatma butonu her sekmede
- [ ] `/menu` ve boş tabs'ta gizle
- [ ] Routing entegrasyonu

### Adım 5: Davranış
- [ ] Menü tıklama → addTab + router.push
- [ ] Alt menü expand/collapse
- [ ] Arama filtreleme + otomatik expand
- [ ] İzin bazlı menü filtreleme (opsiyonel)
- [ ] Pin state persist

### Adım 6: Doğrulama
- [ ] Sidebar 280px sabit genişlik
- [ ] Aktif menü öğesi düz renk + beyaz metin
- [ ] Pasif menü cam efekti + hover mavi tint
- [ ] TabBar header altında sticky
- [ ] Sekme kapatma kırmızı hover
- [ ] Light + dark mod tutarlı

---

## 8. Minimum Kod Şablonları

### 8.1 TabBar container + tab

```tsx
<Box sx={{
  borderBottom: '1px solid var(--border)',
  bgcolor: 'var(--card)',
  boxShadow: 'var(--shadow-xs)',
  position: 'sticky',
  top: 64,
  zIndex: 1100,
}}>
  <Tabs
    value={activeTab}
    onChange={handleChange}
    variant="scrollable"
    scrollButtons="auto"
    sx={{
      minHeight: 48,
      '& .MuiTabs-indicator': {
        height: 3,
        bgcolor: 'var(--primary)',
        borderRadius: '3px 3px 0 0',
      },
    }}
  >
    {tabs.map((tab) => (
      <Tab
        key={tab.id}
        value={tab.id}
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box component="span" sx={{
              fontSize: '0.875rem',
              fontWeight: tab.id === activeTab ? 600 : 500,
              color: tab.id === activeTab ? 'var(--foreground)' : 'var(--muted-foreground)',
            }}>
              {tab.label}
            </Box>
            <Box component="span" onClick={(e) => handleClose(e, tab.id)} sx={{
              p: 0.5, borderRadius: 'var(--radius-sm)', cursor: 'pointer',
              color: 'var(--muted-foreground)',
              '&:hover': {
                bgcolor: 'color-mix(in srgb, var(--destructive) 10%, transparent)',
                color: 'var(--destructive)',
              },
            }}>
              <Close sx={{ fontSize: 14 }} />
            </Box>
          </Box>
        }
        sx={{
          textTransform: 'none',
          minHeight: 48,
          px: 2, py: 1.5,
          '&:hover': { bgcolor: 'var(--muted)' },
        }}
      />
    ))}
  </Tabs>
</Box>
```

### 8.2 Sidebar ana menü öğesi (Seviye 1)

```tsx
<Box
  onClick={() => onMenuClick(item)}
  sx={{
    position: 'relative',
    borderRadius: '10px',
    background: isActive ? item.color : 'rgba(255,255,255,0.5)',
    backdropFilter: 'blur(16px)',
    border: isActive
      ? '1px solid rgba(255,255,255,0.8)'
      : '1px solid rgba(255,255,255,0.6)',
    boxShadow: isActive
      ? `0 4px 12px ${item.color}30`
      : '0 1px 4px rgba(0,0,0,0.04)',
    mb: 0.5, mx: 1,
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      background: isActive ? item.color : 'rgba(59,130,246,0.12)',
      transform: 'translateX(2px)',
    },
  }}
>
  <Box sx={{ display: 'flex', alignItems: 'center', p: 1, gap: 1 }}>
    <Box sx={{
      width: 32, height: 32, borderRadius: '8px',
      background: `linear-gradient(135deg, ${item.color} 0%, ${darkerColor} 100%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: `0 2px 8px ${item.color}30`,
    }}>
      <Icon sx={{ fontSize: 16, color: '#FFFFFF' }} />
    </Box>
    <Typography sx={{
      fontWeight: 600, fontSize: '0.8rem',
      color: isActive ? '#FFFFFF' : '#475569',
    }}>
      {item.label}
    </Typography>
  </Box>
</Box>
```

---

## 9. Yapılmaması Gerekenler

| ❌ Yapma | ✅ Bunun yerine |
|---|---|
| Sidebar genişliğini responsive yüzde yap | Sabit `280px` |
| Aktif menüde sadece sol border çizgisi | Tüm kartı `item.color` ile doldur |
| Düz liste (border-left nav) | Glassmorphism kartlar |
| TabBar'ı static bırak | `sticky`, `top: 64` |
| Indicator kalınlığını 2px altında tut | Tam `3px`, üst köşe yuvarlak |
| Sekmelerde `text-transform: uppercase` | `none`, sentence case |
| Tab kapatmayı sadece sağ tık menüye koy | Her sekmede görünür `×` |
| Menü tıklayınca sadece route değiştir | `addTab` + `setActiveTab` + `router.push` |
| Sidebar arka planını düz `#fff` yap | Gradient + mesh + blur orbs |
| İkonları renksiz gri bırak | Gradient renkli kutu + beyaz ikon |

---

## 10. Teknoloji Uyarlaması

| Kaynak (Muhasebe) | Alternatif |
|---|---|
| MUI Drawer + Tabs + Collapse | Radix NavigationMenu + custom tabs |
| MUI sx prop | Tailwind class veya CSS Modules |
| Zustand tabStore/layoutStore | Redux, Jotai, Context |
| Next.js App Router | React Router, Vue Router |
| MUI Icons | Lucide, Heroicons (boyutları koru) |

**Kritik:** Görsel değerler (280px, 48px, 64px, border-radius, renk opasiteleri, animasyon süreleri) **değiştirilmemeli**. Yalnızca UI kütüphanesi değişebilir.

---

## 11. Görsel Doğrulama Kriterleri

Uygulama tamamlandığında şu kontrolleri yap:

1. Sidebar açıldığında arka planda hafif hareket eden renkli orb'lar görünüyor mu?
2. Menü öğesinin üzerine gelince hafif sağa kayma (`translateX(2px)`) ve mavi tint var mı?
3. Aktif menü öğesi modül rengiyle dolu, yazılar beyaz mı?
4. İkon kutuları 135deg gradient ve hafif gölge taşıyor mu?
5. TabBar header'ın hemen altında yapışkan mı?
6. Aktif sekmenin altında 3px kalınlığında primary renk çizgi var mı?
7. Sekme `×` hover'da kırmızıya dönüyor mu?
8. `/menu` sayfasında TabBar gizli mi?
9. Sidebar pin'lenince layout genişliği `calc(100% - 280px)` oluyor mu?
10. Dark modda sidebar gradient koyu slate tonlarında mı?

---

## 12. Referans Ölçü Tablosu (Hızlı Bakış)

| Bileşen | Ölçü |
|---|---|
| Sidebar genişliği | 280px |
| Header yüksekliği | 64px |
| TabBar yüksekliği | 48px |
| TabBar sticky top | 64px |
| Content padding | 24px (theme spacing 3) |
| Ana menü border-radius | 10px |
| Alt menü border-radius | 8px |
| Nested menü border-radius | 6px |
| Ana ikon kutusu | 32×32px |
| Alt ikon kutusu | 24×24px |
| Nested ikon kutusu | 20×20px |
| Tab indicator | 3px |
| Tab font | 14px (0.875rem) |
| Ana menü font | 12.8px (0.8rem) |
| Scrollbar genişliği | 4px |
| Drawer açılış animasyonu | 250ms enter / 200ms exit |
| Collapse animasyonu | 200ms |
| Geçiş easing | `cubic-bezier(0.4, 0, 0.2, 1)` |

---

*Bu belge Muhasebe ERP panelinin sol menü ve yatay sekme tasarımının birebir taşınması için hazırlanmıştır. Yeni özellik eklerken önce bu spesifikasyona uygunluğu doğrula.*
