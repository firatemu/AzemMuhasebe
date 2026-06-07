# PREMIUM FORM DIALOG PATTERN — Muhasebe

**Proje:** Muhasebe  
**Kapsam:** Çok alanlı ekle/düzenle formları için premium modal pattern  
**Stack:** shadcn/ui Dialog + Tailwind + lucide-react  
**Referans:** `PersonelFormDialog`, `MalzemeFormDialog`  
**Son Güncelleme:** 6 Haziran 2026

> **Taşınabilir AI rehberi (başka projeler için detaylı kopya):** [`docs/ai-guides/premium-form-dialog-pattern-portable.md`](../../docs/ai-guides/premium-form-dialog-pattern-portable.md)

> Liste sayfasından açılan, çok bölümlü ekle/düzenle formları bu pattern ile yazılır. Basit onay dialogları için `frontend-page-patterns.md` §14 kullanılır.

---

## 1. Ne Zaman Kullanılır?

```txt
✅ 8+ form alanı
✅ 3+ mantıksal bölüm (kimlik, iletişim, finansal vb.)
✅ Canlı özet / hesap kartı gösterilecek
✅ Liste sayfasından modal ile ekle/düzenle
✅ Desktop'ta sidebar + form iki kolon düzeni

❌ Tek alanlı onay/silme dialogu → ConfirmDialog pattern
❌ Tam sayfa form (/new route) → Form Sayfası Pattern (frontend-page-patterns §9)
❌ 3-4 alanlı basit popup → shadcn Dialog + tek Card yeterli
```

---

## 2. Referans Dosyalar

| Dosya | Rol |
|---|---|
| `panel-stage/client/src/app/(main)/hr/personel/components/PersonelFormDialog.tsx` | **Birincil referans** — sidebar özet, bölüm navigasyonu, canlı avatar |
| `panel-stage/client/src/app/(main)/stock/material-list/MalzemeFormDialog.tsx` | Alternatif referans — maliyet analizi sidebar |
| `panel-stage/client/src/components/ui/dialog.tsx` | Dialog altyapısı (`panelStyle`, `panelClassName`) |
| `panel-stage/client/src/app/globals.css` | Dialog animasyon kuralları (`dialog-panel`) |

Yeni form dialog yazarken önce `PersonelFormDialog.tsx` kopyalanıp modüle göre uyarlanır.

---

## 3. Dosya Yapısı

```txt
app/(main)/{modul}/{sayfa}/
  page.tsx                    → liste + open state + handleSave
  components/
    {Entity}FormDialog.tsx    → premium dialog (ayrı dosya)
```

```tsx
// page.tsx — dialog state
const [openDialog, setOpenDialog] = useState(false)
const [selected, setSelected] = useState<Entity | null>(null)

<EntityFormDialog
  open={openDialog}
  entity={selected}
  onSave={handleSave}
  onClose={() => { setOpenDialog(false); setSelected(null) }}
/>
```

Dialog mantığı `page.tsx` içine gömülmez; ayrı `*FormDialog.tsx` dosyasında tutulur.

---

## 4. Layout Anatomisi

```
┌─────────────────────────────────────────────────────────┐
│ HEADER — ikon + başlık + açıklama + kapat (X)           │
├──────────────┬──────────────────────────────────────────┤
│ SIDEBAR      │ FORM SCROLL ALANI                        │
│ (lg+, 280px) │                                          │
│              │  ┌─ Panel: Bölüm 1 ─────────────────┐   │
│ · Özet kart  │  │ FieldShell grid (md:grid-cols-2)  │   │
│ · Canlı KPI  │  └───────────────────────────────────┘   │
│ · Bölüm nav  │  ┌─ Panel: Bölüm 2 ─────────────────┐   │
│              │  └───────────────────────────────────┘   │
├──────────────┴──────────────────────────────────────────┤
│ FOOTER — zorunlu alan notu + İptal + Kaydet             │
└─────────────────────────────────────────────────────────┘
```

### 4.1 Header

```tsx
<DialogHeader className="shrink-0 border-b bg-muted/60 px-6 py-5">
  <div className="flex items-start justify-between gap-4">
    <div className="flex min-w-0 items-center gap-3.5">
      {/* Gradient ikon kutusu size-11 rounded-xl */}
      <div className="flex size-11 ..." style={{ background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)' }}>
        <UserPlus className="size-[22px]" />
      </div>
      <div>
        <DialogTitle className="text-lg font-bold">{isEdit ? 'Düzenle' : 'Yeni Ekle'}</DialogTitle>
        <DialogDescription className="text-xs">{/* canlı bağlam metni */}</DialogDescription>
      </div>
    </div>
    <Button variant="ghost" className="size-8 p-0" onClick={onClose}><X /></Button>
  </div>
</DialogHeader>
```

- `showCloseButton={false}` — kapatma header'daki X ile yapılır
- Başlık/açıklama form verisine göre canlı güncellenir

### 4.2 Sidebar (desktop: `lg:flex`, mobil: gizli)

3 blok:

1. **Özet kart** — avatar/baş harf, ad, durum badge'leri, kod
2. **Canlı KPI kartı** — finansal/hesaplanan alanlar (maaş, marj, stok vb.)
3. **Bölüm navigasyonu** — scroll-to-section butonları

```tsx
<aside className="hidden shrink-0 overflow-y-auto border-r bg-muted/40 p-5 lg:flex lg:flex-col lg:gap-4">
  {/* özet + KPI + nav */}
</aside>
```

### 4.3 Form alanı

```tsx
<div ref={scrollRef} className="min-h-0 overflow-y-auto bg-background p-5 md:p-6 space-y-5">
  <Panel id="section-kimlik" title="Kimlik Bilgileri" icon={<BadgeCheck className="size-4" />}>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{/* FieldShell'ler */}</div>
  </Panel>
</div>
```

### 4.4 Footer

```tsx
<DialogFooter className="shrink-0 border-t bg-muted/40 px-6 py-4">
  <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
    <p className="hidden text-xs text-muted-foreground sm:block">Zorunlu alanlar: ...</p>
    <div className="flex flex-col-reverse gap-2 sm:flex-row">
      <Button type="button" variant="outline" onClick={onClose}>İptal</Button>
      <Button type="submit" disabled={!canSubmit} className="font-bold text-white" style={{ background: 'linear-gradient(...)' }}>
        Kaydet
      </Button>
    </div>
  </div>
</DialogFooter>
```

---

## 5. Yardımcı Bileşenler (dialog dosyası içinde private)

### FieldShell

```tsx
function FieldShell({ label, required, hint, children, className }) {
  return (
    <div className={cn('min-w-0 space-y-1.5', className)}>
      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label}{required ? <span className="ml-0.5 text-destructive">*</span> : null}
      </Label>
      {children}
      {hint ? <p className="text-[11px] font-medium text-muted-foreground">{hint}</p> : null}
    </div>
  )
}
```

### Panel

```tsx
function Panel({ id, title, icon, children, className }) {
  return (
    <section id={id} className={cn('scroll-mt-4 rounded-xl border bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md', className)}>
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex size-9 items-center justify-center rounded-lg border shadow-sm"
          style={{ background: 'color-mix(in srgb, var(--primary) 10%, transparent)', color: 'var(--primary)' }}>
          {icon}
        </div>
        <h3 className="text-sm font-bold tracking-tight">{title}</h3>
      </div>
      {children}
    </section>
  )
}
```

---

## 6. Dialog Boyutlandırma — KRİTİK

```tsx
// ✅ DOĞRU — boyut iç panele (panelStyle)
<DialogContent
  showCloseButton={false}
  panelClassName="max-w-none w-full"
  panelStyle={{
    width: 'min(calc(100vw - 2rem), 1080px)',
    height: 'min(92dvh, 820px)',
  }}
>

// ❌ YANLIŞ — style dış popup'a gider, dialog sol üst köşede kalır
<DialogContent style={{ width: 'min(100% - 2rem, 1080px)' }}>
```

| Prop | Hedef | Amaç |
|---|---|---|
| `panelStyle` | İç panel (`dialog-panel`) | width, height |
| `panelClassName` | İç panel | `max-w-none w-full` vb. |
| `style` | Dış overlay (`dialog-content`) | **Boyut verme** — sadece tam ekran flex center kalır |
| `className` | Dış overlay | nadiren gerekir |

Standart boyutlar:

```txt
Geniş formlar:  width min(calc(100vw - 2rem), 1080px)  height min(92dvh, 820px)
Orta formlar:   width min(calc(100vw - 2rem), 1040px)  height min(92dvh, 780px)
Küçük dialog:  panelClassName="max-w-md" (ConfirmDialog gibi)
```

---

## 6b. Select / Combobox — Dialog İçinde KRİTİK

shadcn `Select` dropdown'u `body`'e portal edilir. Dialog varsayılan `modal={true}` iken dış elemanlara tıklama engellenir → combobox açılmaz veya seçenekler tıklanamaz.

**Zorunlu:**

```tsx
<Dialog open={open} modal="trap-focus" onOpenChange={(v) => !v && onClose()}>
```

- `modal="trap-focus"`: focus dialog içinde kalır, portaled Select/Popover tıklanabilir
- Onay dialogları (`ConfirmDialog`) için `modal={true}` kalabilir — içinde Select yoksa

Select/Popover z-index dialog üstünde olmalı (`select.tsx` / `popover.tsx` → `z-[1100]`, dialog → `z-[1001]`).

**Onay dialogu vs form dialogu:**

| Dialog tipi | `modal` |
|---|---|
| Premium form (Select var) | `"trap-focus"` |
| Silme / onay (Select yok) | `true` (varsayılan) |

---

`globals.css` — animasyon **iç panele** uygulanır, dış overlay flex center kalır:

```css
[data-slot="dialog-content"][data-open] [data-slot="dialog-panel"] {
  animation: dialogZoomIn 150ms ...;
}
/* scale(0.95→1) — translate(-50%,-50%) KULLANMA (flex center ile çakışır) */
```

`dialog.tsx` iç panel: `data-slot="dialog-panel"`

---

## 8. Form State Pattern

```tsx
// 1. Tip + default değerler
export interface EntityFormValues { ... }
const defaultFormValues: EntityFormValues = { ... }

// 2. API/entity → form map
function buildFormValues(entity: Partial<EntityFormValues> | null): EntityFormValues { ... }

// 3. Form → API submit map
function prepareSubmitData(formData: EntityFormValues) { ... }

// 4. open değişince reset
useEffect(() => {
  if (open) setFormData(buildFormValues(entity))
}, [open, entity])
```

Select alanları için `@/lib/select-utils` kullan. Base UI Select, `SelectValue` boş bırakılırsa ham `value` string'ini gösterir (`true`, `MUSTERI`, `__empty__` vb.) — **tüm metinler Türkçe olmalı**.

### Opsiyonel (boş) Select

Sentinel değer (`EMPTY_SELECT_VALUE`) yalnızca Select `value` prop'unda kalır; kullanıcıya **asla** `__empty__` gösterilmez.

```tsx
import {
  EMPTY_SELECT_VALUE,
  fromOptionalSelectValue,
  optionalSelectLabel,
  toOptionalSelectValue,
} from '@/lib/select-utils'

<SelectValue placeholder="Seçiniz">
  {optionalSelectLabel(toOptionalSelectValue(formData.satisElemaniId), {
    emptyLabel: 'Seçilmedi',
    resolveLabel: (id) => options.find((o) => o.id === id)?.label,
  })}
</SelectValue>
```

### Enum / sabit listeli Select (Türkçe etiket)

Internal kod (`MUSTERI`, `NORMAL`) ile görünen metin (`Müşteri`, `Normal`) ayrılır:

```tsx
import { enumSelectLabel } from '@/lib/select-utils'

const TIP_LABELS: Record<string, string> = {
  MUSTERI: 'Müşteri',
  TEDARIKCI: 'Tedarikçi',
  HER_IKISI: 'Her İkisi',
}

<Select value={formData.tip} onValueChange={(v) => onChange('tip', v ?? 'MUSTERI')}>
  <SelectTrigger className="h-9 w-full">
    <SelectValue>{enumSelectLabel(formData.tip, TIP_LABELS)}</SelectValue>
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="MUSTERI">Müşteri</SelectItem>
    ...
  </SelectContent>
</Select>
```

### Boolean durum (Aktif / Pasif)

`true` / `false` Select value **kullanma** — trigger'da `true` yazar.

```tsx
import {
  AKTIF_SELECT_VALUE,
  PASIF_SELECT_VALUE,
  aktifSelectValueToBoolean,
  booleanToAktifSelectValue,
  enumSelectLabel,
} from '@/lib/select-utils'

const AKTIF_LABELS = {
  [AKTIF_SELECT_VALUE]: 'Aktif',
  [PASIF_SELECT_VALUE]: 'Pasif',
}

<Select
  value={booleanToAktifSelectValue(formData.aktif)}
  onValueChange={(v) => onChange('aktif', aktifSelectValueToBoolean(v))}
>
  <SelectValue>{enumSelectLabel(booleanToAktifSelectValue(formData.aktif), AKTIF_LABELS)}</SelectValue>
  ...
</Select>
```

**Kurallar:**
- Her `SelectValue` içinde Türkçe metin verilir (`enumSelectLabel`, `optionalSelectLabel` veya doğrudan string)
- `SelectItem` metni ile `SelectValue` metni tutarlı olmalı
- API/internal kod map'i `prepareSubmitData` / `prepareCariPayload` içinde kalır; UI'da İngilizce kod gösterilmez
- Sidebar özet badge'leri de aynı `*_LABELS` map'lerinden türetilir

---

## 9. Bölüm Navigasyonu

```tsx
const SECTIONS = [
  { id: 'section-kimlik', label: 'Kimlik', icon: BadgeCheck },
  ...
] as const

const scrollToSection = (sectionId: string) => {
  setActiveSection(sectionId)
  scrollRef.current?.querySelector(`#${sectionId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
```

Her `Panel`'e `id="section-..."` ve `scroll-mt-4` verilir.

---

## 10. Canlı Sidebar Özetleri

Form state'ten türetilir; ayrı state tutulmaz:

```tsx
const fullName = [formData.ad, formData.soyad].filter(Boolean).join(' ')
const initials = `${formData.ad.charAt(0) || '?'}${formData.soyad.charAt(0) || ''}`.toUpperCase()
const totalComp = Number(formData.maas || 0) + Number(formData.prim || 0)
```

Sidebar KPI kartı form değiştikçe anlık güncellenir.

---

## 11. UI Kütüphanesi Sınırları

```txt
✅ shadcn: Dialog, Input, Select, Textarea, Label, Button, Badge, Separator
✅ lucide-react ikonlar
✅ Tailwind layout

❌ @mui/material Dialog / TextField / Select (yeni kod)
❌ Inline MUI form dialog
```

Liste sayfası DataGrid için MUI X kullanılabilir; form dialog shadcn olmalı.

---

## 12. Responsive

| Breakpoint | Davranış |
|---|---|
| `< lg` | Sidebar gizli, form tam genişlik scroll |
| `≥ lg` | `grid-cols-[280px_1fr]` sidebar + form |
| Mobil | Footer butonları stack, header tek satır truncate |

Form grid: `grid-cols-1 md:grid-cols-2`, geniş alanlar `md:col-span-2`

---

## 13. Yeni Dialog Kontrol Listesi

- [ ] Ayrı `{Entity}FormDialog.tsx` dosyası oluşturuldu
- [ ] shadcn Dialog kullanıldı (MUI Dialog değil)
- [ ] `panelStyle` ile boyut verildi (`style` ile değil)
- [ ] `showCloseButton={false}` + header X butonu
- [ ] Header: gradient ikon + canlı başlık/açıklama
- [ ] Sidebar: özet kart + KPI + bölüm nav (lg+)
- [ ] Form: `Panel` + `FieldShell` + grid layout
- [ ] Footer: zorunlu alan notu + İptal + gradient Kaydet
- [ ] `buildFormValues` / `prepareSubmitData` ayrımı
- [ ] `open` değişince form reset
- [ ] Submit disabled koşulu (`canSubmit`)
- [ ] Mobil scroll ve footer düzgün
- [ ] Tüm Select'lerde `SelectValue` Türkçe etiket gösterir (`enumSelectLabel` / `optionalSelectLabel`)
- [ ] Boolean durum alanları `AKTIF`/`PASIF` sentinel kullanır (`true`/`false` value yok)
- [ ] `modal="trap-focus"` kullanıldı (Select/combobox içeren form dialogları)

---

## 14. Hızlı Şablon

```tsx
'use client'

export default function EntityFormDialog({ open, entity, onSave, onClose }) {
  return (
    <Dialog open={open} modal="trap-focus" onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        showCloseButton={false}
        panelClassName="max-w-none w-full"
        panelStyle={{ width: 'min(calc(100vw - 2rem), 1080px)', height: 'min(92dvh, 820px)' }}
      >
        <form className="flex h-full min-h-0 flex-col" onSubmit={handleSubmit}>
          <DialogHeader className="shrink-0 border-b bg-muted/60 px-6 py-5">{/* ... */}</DialogHeader>
          <div className="grid min-h-0 flex-1 overflow-hidden lg:grid-cols-[280px_1fr]">
            <aside className="hidden lg:flex ...">{/* sidebar */}</aside>
            <div ref={scrollRef} className="min-h-0 overflow-y-auto p-5 md:p-6 space-y-5">{/* panels */}</div>
          </div>
          <DialogFooter className="shrink-0 border-t bg-muted/40 px-6 py-4">{/* ... */}</DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```
