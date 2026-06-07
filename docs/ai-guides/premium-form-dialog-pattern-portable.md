# Premium Form Dialog Pattern — Taşınabilir AI Uygulama Rehberi

**Versiyon:** 1.0  
**Kaynak proje:** Muhasebe ERP (Next.js + shadcn/ui + Base UI + Tailwind)  
**Orijinal kural dosyası:** `.cursor/rules/workflows/premium-form-dialog-pattern.md`  
**Amaç:** Bu belgeyi okuyan bir AI agent, aynı premium ekle/düzenle modal tasarımını **başka projelerde** sıfırdan veya mevcut formları dönüştürerek uygulayabilmelidir.

---

## 0. AI Agent İçin Özet Talimat

Bu pattern şunları üretir:

- Liste sayfasından açılan, **geniş, çok bölümlü** ekle/düzenle modalı
- **Sol sidebar** (desktop): canlı özet + KPI kartı + bölüm navigasyonu
- **Sağ alan**: kaydırılabilir form panelleri
- **Header**: gradient ikon + canlı başlık + X kapat
- **Footer**: zorunlu alan notu + İptal + gradient Kaydet

**Zorunlu teknik kararlar:**

1. Dialog boyutu `panelStyle` ile verilir — asla dış `style` ile değil
2. Form dialogları `modal="trap-focus"` kullanır (Select/combobox için)
3. Select dropdown z-index dialog üstünde olmalı (`z-[1100]` vs dialog `z-[1001]`)
4. Her `SelectValue` kullanıcıya **okunabilir etiket** gösterir — ham API kodu veya `true`/`__empty__` asla görünmez
5. Form dialog ayrı `{Entity}FormDialog.tsx` dosyasında; liste `page.tsx` içine gömülmez

---

## 1. Ne Zaman Kullanılır?

| Kullan | Kullanma |
|---|---|
| 8+ form alanı | Tek alanlı onay/silme |
| 3+ mantıksal bölüm | Tam sayfa form route (`/new`) |
| Canlı sidebar özeti / KPI | 3–4 alanlı basit popup |
| Liste → modal ekle/düzenle | Wizard / çok adımlı full-page flow |

---

## 2. Gerekli Teknoloji Yığını

Başka projede minimum gereksinimler:

| Katman | Tercih edilen | Alternatif |
|---|---|---|
| Framework | Next.js App Router + `'use client'` | React SPA |
| UI primitives | shadcn/ui (Base UI tabanlı) | Radix + custom wrapper (API farklı olabilir) |
| Stil | Tailwind CSS v3/v4 | CSS Modules (class isimlerini uyarla) |
| İkon | lucide-react | Heroicons vb. |
| Form state | `useState` + controlled inputs | react-hook-form + zod (Malzeme örneği) |

**Kullanılmaması gereken (yeni form dialog kodunda):**

- `@mui/material` Dialog, TextField, Select, Tabs
- Inline 400+ satırlık dialog `page.tsx` içinde

Liste tabloları için MUI DataGrid kalabilir; **form modal shadcn olmalı**.

---

## 3. Görsel Anatomi

```
┌──────────────────────────────────────────────────────────────────┐
│ HEADER  [gradient ikon]  Başlık + canlı açıklama            [X]  │
├─────────────────┬────────────────────────────────────────────────┤
│ SIDEBAR 280px   │ FORM SCROLL (flex-1, overflow-y-auto)          │
│ (lg+, gizli mobil)│                                               │
│                 │  ╭─ Panel: Kimlik ─────────────────────────╮  │
│ ┌─────────────┐ │  │  FieldShell │ FieldShell                 │  │
│ │ Özet kart   │ │  │  FieldShell (md:col-span-2)              │  │
│ │ avatar/badge│ │  ╰──────────────────────────────────────────╯  │
│ └─────────────┘ │  ╭─ Panel: Finans ──────────────────────────╮  │
│ ┌─────────────┐ │  │  ...                                      │  │
│ │ KPI kartı   │ │  ╰──────────────────────────────────────────╯  │
│ └─────────────┘ │                                               │
│ ┌─────────────┐ │                                               │
│ │ Bölümler nav│ │                                               │
│ └─────────────┘ │                                               │
│ ┌─────────────┐ │  (opsiyonel: İlişkiler / sayaç kartı)        │
│ │ İlişkiler   │ │                                               │
│ └─────────────┘ │                                               │
├─────────────────┴────────────────────────────────────────────────┤
│ FOOTER  Zorunlu alan notu                    [İptal] [Kaydet]  │
└──────────────────────────────────────────────────────────────────┘
```

**Sidebar blok sırası (önerilen):**

1. Özet kart (avatar/baş harf, ad, badge'ler)
2. Canlı KPI kartı (hesaplanan değerler)
3. **Bölümler** navigasyonu
4. **İlişkiler** / ilişkili kayıt sayaçları (varsa — Cari: yetkili, adres, banka)

---

## 4. Tasarım Dili ve Token'lar

### 4.1 Renkler

| Kullanım | Değer |
|---|---|
| Header/Footer arka plan | `bg-muted/60`, `bg-muted/40` |
| Sidebar arka plan | `bg-muted/40` + `border-r` |
| Panel arka plan | `bg-card` + `border` + `rounded-xl` + `shadow-sm` |
| Primary gradient (ikon, Kaydet) | `linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)` |
| Panel ikon kutusu | `color-mix(in srgb, var(--primary) 10%, transparent)` |
| Aktif badge (yeşil) | `var(--income)` — yoksa `text-emerald-600` |
| Özet kart gradient | `linear-gradient(145deg, color-mix(in srgb, var(--primary) 6%, var(--card)) 0%, var(--card) 55%)` |

Başka projede `--primary`, `--card`, `--muted-foreground`, `--destructive` shadcn CSS değişkenleri tanımlı olmalı.

### 4.2 Tipografi

| Eleman | Class |
|---|---|
| Dialog başlık | `text-lg font-bold tracking-tight` |
| Dialog açıklama | `text-xs font-medium text-muted-foreground truncate` |
| Field label | `text-xs font-bold uppercase tracking-wider text-muted-foreground` |
| Field hint | `text-[11px] font-medium text-muted-foreground` |
| Panel başlık | `text-sm font-bold tracking-tight` |
| Sidebar KPI label | `text-xs font-bold uppercase tracking-wider` |
| Bölüm nav buton | `text-xs font-semibold` |
| Tabular sayılar | `tabular-nums` |

### 4.3 Boyutlar

| Eleman | Boyut |
|---|---|
| Header ikon kutusu | `size-11 rounded-xl` |
| Panel section ikon | `size-9 rounded-lg` |
| Avatar (sidebar) | `size-14 rounded-2xl` |
| Input / Select trigger | `h-9 w-full` |
| Footer/Header buton | `h-9 px-5` (Kaydet `px-6 font-bold`) |
| Sidebar genişlik | `280px` → `lg:grid-cols-[280px_1fr]` |
| Dialog genişlik | `min(calc(100vw - 2rem), 1080px)` |
| Dialog yükseklik | `min(92dvh, 820px)` |

---

## 5. Z-Index Katman Tablosu

Portaled Select/Popover dialog ile çakışmaması için:

| Katman | z-index | Dosya |
|---|---|---|
| Dialog overlay | `z-[1000]` | `dialog.tsx` |
| Dialog content (flex center) | `z-[1001]` | `dialog.tsx` |
| Select / Popover dropdown | `z-[1100]` | `select.tsx`, `popover.tsx` |

---

## 6. Altyapı Dosyaları (Başka Projeye Taşınacak)

### 6.1 `dialog.tsx` — İki Katmanlı Popup

**Kritik mimari:** Dış katman tam ekran flex center; iç katman gerçek panel.

```tsx
function DialogContent({ panelClassName, panelStyle, showCloseButton = true, children, ...props }) {
  return (
    <DialogPortal>
      <DialogOverlay />  {/* z-[1000] */}
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className="fixed inset-0 z-[1001] flex items-center justify-center p-4"
        {...props}
      >
        <div
          data-slot="dialog-panel"
          className={cn(
            "relative flex max-h-[90dvh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-popover shadow-2xl ring-1 ring-foreground/10",
            panelClassName,
          )}
          style={panelStyle}
        >
          {children}
          {showCloseButton && (/* varsayılan X */)}
        </div>
      </DialogPrimitive.Popup>
    </DialogPortal>
  )
}
```

**Prop hedefleri:**

| Prop | Hedef DOM | Kullanım |
|---|---|---|
| `panelStyle` | `[data-slot="dialog-panel"]` | width, height |
| `panelClassName` | `[data-slot="dialog-panel"]` | `max-w-none w-full` |
| `style` | dış popup | **BOYUT VERME** |
| `className` | dış popup | nadiren |

**Yanlış kullanım sonucu:** Dialog sol üst köşede kalır (flex center bozulur).

### 6.2 `globals.css` — Animasyon

Animasyon **iç panele** uygulanır; `translate(-50%,-50%)` **kullanılmaz** (flex center ile çakışır).

```css
[data-slot="dialog-content"][data-open] [data-slot="dialog-panel"] {
  animation: dialogZoomIn 150ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

[data-slot="dialog-content"][data-closed] [data-slot="dialog-panel"] {
  animation: dialogZoomOut 100ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes dialogZoomIn {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
}

@keyframes dialogZoomOut {
  from { opacity: 1; transform: scale(1); }
  to   { opacity: 0; transform: scale(0.95); }
}
```

### 6.3 `select-utils.ts` — Tam Kod (Projeye Kopyala)

```typescript
/** Internal sentinel — Select boş değer için. UI'da ASLA gösterilmez. */
export const EMPTY_SELECT_VALUE = '__empty__';

export function toOptionalSelectValue(value: string | null | undefined): string {
  return value?.trim() ? value : EMPTY_SELECT_VALUE;
}

export function fromOptionalSelectValue(value: string | null | undefined): string {
  if (!value || value === EMPTY_SELECT_VALUE) return '';
  return value;
}

/** Enum/API kodunu kullanıcı etiketine çevirir (MUSTERI → Müşteri). */
export function enumSelectLabel(
  value: string | null | undefined,
  labels: Record<string, string>,
): string {
  if (value == null || value === '') return '';
  return labels[value] ?? value;
}

/** Boolean durum — true/false Select value KULLANMA. */
export const AKTIF_SELECT_VALUE = 'AKTIF';
export const PASIF_SELECT_VALUE = 'PASIF';

export function booleanToAktifSelectValue(aktif: boolean): string {
  return aktif ? AKTIF_SELECT_VALUE : PASIF_SELECT_VALUE;
}

export function aktifSelectValueToBoolean(value: string | null | undefined): boolean {
  return value === AKTIF_SELECT_VALUE;
}

export function optionalSelectLabel(
  value: string,
  options: {
    emptyLabel?: string;
    resolveLabel?: (value: string) => string | undefined;
  } = {},
): string | null {
  if (!value || value === EMPTY_SELECT_VALUE) return options.emptyLabel ?? null;
  return options.resolveLabel?.(value) ?? value;
}
```

### 6.4 Select z-index (`select.tsx`)

```tsx
<SelectPrimitive.Positioner className="isolate z-[1100]">
  <SelectPrimitive.Popup className="relative isolate z-[1100] ..." />
</SelectPrimitive.Positioner>
```

---

## 7. Dosya ve Klasör Yapısı

```txt
src/
  app/.../liste/
    page.tsx                         # open state, API çağrıları, snackbar
    components/
      {Entity}FormDialog.tsx         # premium UI (bu pattern)
  components/ui/
    dialog.tsx
    select.tsx
    input.tsx
    ...
  lib/
    select-utils.ts
    utils.ts                         # cn()
```

**Wrapper / container pattern:**

```tsx
// NewEntityDialog.tsx — ince sarmalayıcı (API, fetch, payload)
export default function NewEntityDialog({ open, onClose, onSuccess }) {
  const [formData, setFormData] = useState(defaultValues);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) initForm(); // kod önizleme, reset vb.
  }, [open]);

  const handleSubmit = async () => {
    const payload = preparePayload(formData);
    await api.post('/entity', payload);
    onSuccess();
    onClose();
  };

  return (
    <EntityFormDialog
      open={open}
      mode="create"
      formData={formData}
      isSaving={loading}
      onClose={onClose}
      onSubmit={handleSubmit}
      onChange={(field, value) => setFormData((p) => ({ ...p, [field]: value }))}
    />
  );
}
```

UI (`EntityFormDialog`) ile veri/API (`NewEntityDialog` + `preparePayload.ts`) **ayrılır**.

---

## 8. Props Arayüzü Şablonu

```tsx
export interface EntityFormDialogProps {
  open: boolean;
  mode: 'create' | 'edit';
  formData: EntityFormValues;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onChange: (field: keyof EntityFormValues | string, value: unknown) => void;
  // modüle özel:
  // options?: Option[];
  // onCityChange?: (city: string) => void;
}
```

---

## 9. Form State Pattern

```tsx
// 1. Tip
export interface EntityFormValues { ... }

// 2. Varsayılan
const defaultFormValues: EntityFormValues = { ... };

// 3. API → form
function buildFormValues(entity: Partial<EntityFormValues> | null): EntityFormValues {
  if (!entity) return { ...defaultFormValues };
  return { ...defaultFormValues, ...entity };
}

// 4. Form → API (ayrı dosya: prepareEntityPayload.ts)
function preparePayload(data: EntityFormValues): ApiPayload | null {
  if (!data.requiredField?.trim()) return null;
  return { apiField: data.formField, ... };
}

// 5. Dialog açılınca reset
useEffect(() => {
  if (open) setFormData(buildFormValues(entity));
}, [open, entity]);
```

**Submit guard:**

```tsx
const canSubmit = Boolean(formData.unvan?.trim()); // zorunlu alanlar
// form onSubmit: if (!canSubmit) return;
// Button: disabled={isSaving || !canSubmit}
```

---

## 10. Yardımcı Bileşenler (Dialog Dosyası İçinde Private)

### 10.1 FieldShell

```tsx
function FieldShell({ label, required, hint, error, children, className }) {
  return (
    <div className={cn('min-w-0 space-y-1.5', className)}>
      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label}
        {required ? <span className="ml-0.5 text-destructive">*</span> : null}
      </Label>
      {children}
      {hint ? <p className="text-[11px] font-medium text-muted-foreground">{hint}</p> : null}
      {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
    </div>
  );
}
```

Geniş alanlar: `className="md:col-span-2"`

### 10.2 Panel

```tsx
function Panel({ id, title, icon, children, className }) {
  return (
    <section
      id={id}
      className={cn(
        'scroll-mt-4 rounded-xl border bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md',
        className,
      )}
    >
      <div className="mb-4 flex items-center gap-2.5">
        <div
          className="flex size-9 items-center justify-center rounded-lg border shadow-sm"
          style={{
            background: 'color-mix(in srgb, var(--primary) 10%, transparent)',
            color: 'var(--primary)',
            borderColor: 'color-mix(in srgb, var(--primary) 15%, transparent)',
          }}
        >
          {icon}
        </div>
        <h3 className="text-sm font-bold tracking-tight">{title}</h3>
      </div>
      {children}
    </section>
  );
}
```

---

## 11. Bölüm Navigasyonu

```tsx
const SECTIONS = [
  { id: 'section-genel', label: 'Genel', icon: BadgeCheck },
  { id: 'section-finans', label: 'Finans', icon: Wallet },
  // ...
] as const;

const scrollRef = useRef<HTMLDivElement>(null);
const [activeSection, setActiveSection] = useState(SECTIONS[0].id);

const scrollToSection = useCallback((sectionId: string) => {
  setActiveSection(sectionId);
  scrollRef.current
    ?.querySelector<HTMLElement>(`#${sectionId}`)
    ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}, []);
```

Nav buton active state:

```tsx
className={cn(
  'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs font-semibold transition-all',
  activeSection === id
    ? 'bg-primary/10 text-primary shadow-sm'
    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
)}
```

---

## 12. Canlı Sidebar — Form State'ten Türet

Ayrı state **tutulmaz**; form değiştikçe sidebar güncellenir.

```tsx
// Personel örneği
const fullName = [formData.ad, formData.soyad].filter(Boolean).join(' ').trim();
const initials = `${formData.ad.charAt(0) || '?'}${formData.soyad.charAt(0) || ''}`.toUpperCase();
const totalComp = Number(formData.maas || 0) + Number(formData.prim || 0);

// Malzeme örneği — marj
const margin = salePrice - costPrice;
const marginRate = salePrice > 0 ? (margin / salePrice) * 100 : 0;

// Cari örneği — ilişki sayaçları
const yetkililer = formData.yetkililer ?? [];
const ekAdresler = formData.ekAdresler ?? [];
const bankalar = formData.tedarikciBankalar ?? [];
```

Para formatı (TR):

```tsx
function formatMoney(value: number) {
  return value.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
```

---

## 13. Select / Combobox — Kritik Kurallar

### 13.1 Dialog modal modu

```tsx
<Dialog open={open} modal="trap-focus" onOpenChange={(v) => !v && onClose()}>
```

| `modal` | Davranış |
|---|---|
| `true` (varsayılan) | Dış tıklama engelli → portaled Select **çalışmaz** |
| `"trap-focus"` | Focus dialog içinde; portaled dropdown tıklanabilir |
| `false` | Tam serbest — form dialog için önerilmez |

### 13.2 SelectValue her zaman dolu etiket gösterir

Base UI / shadcn Select, `SelectValue` boş bırakılırsa ham `value` string'ini yazar.

| Yanlış value | Kullanıcıya görünen |
|---|---|
| `true` | `true` |
| `MUSTERI` | `MUSTERI` |
| `__empty__` | `__empty__` |

**Enum select:**

```tsx
const TIP_LABELS = { MUSTERI: 'Müşteri', TEDARIKCI: 'Tedarikçi' };

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

**Opsiyonel (boş) select:**

```tsx
<Select value={toOptionalSelectValue(formData.refId)} onValueChange={(v) => onChange('refId', fromOptionalSelectValue(v))}>
  <SelectValue placeholder="Seçiniz">
    {optionalSelectLabel(toOptionalSelectValue(formData.refId), {
      emptyLabel: 'Seçilmedi',
      resolveLabel: (id) => options.find((o) => o.id === id)?.label,
    })}
  </SelectValue>
  ...
</Select>
```

**Boolean Aktif/Pasif:**

```tsx
<Select
  value={booleanToAktifSelectValue(formData.aktif)}
  onValueChange={(v) => onChange('aktif', aktifSelectValueToBoolean(v))}
>
  <SelectValue>{enumSelectLabel(booleanToAktifSelectValue(formData.aktif), AKTIF_LABELS)}</SelectValue>
  <SelectItem value={AKTIF_SELECT_VALUE}>Aktif</SelectItem>
  <SelectItem value={PASIF_SELECT_VALUE}>Pasif</SelectItem>
</Select>
```

**Kural:** `SelectItem` metni = `SelectValue` metni = sidebar badge metni (aynı `*_LABELS` map).

---

## 14. Dinamik Liste Blokları (Yetkili, Adres, Banka)

Pattern:

```tsx
<div className="mt-5 flex items-center justify-between">
  <p className="text-sm font-bold text-primary">Ek Yetkililer</p>
  <Button type="button" variant="outline" size="sm" className="h-8 gap-1" onClick={addItem}>
    <Plus className="size-3.5" /> Kişi Ekle
  </Button>
</div>

{items.length === 0 ? (
  <p className="mt-3 rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground">
    Henüz ek yetkili eklenmemiş.
  </p>
) : (
  <div className="mt-3 space-y-3">
    {items.map((item, index) => (
      <div key={index} className="relative rounded-xl border bg-muted/20 p-4">
        <Button type="button" variant="ghost" size="icon-sm"
          className="absolute right-2 top-2 text-destructive" onClick={() => remove(index)}>
          <Trash2 className="size-4" />
        </Button>
        {/* alanlar grid md:grid-cols-2 */}
      </div>
    ))}
  </div>
)}
```

---

## 15. Responsive Davranış

| Breakpoint | Davranış |
|---|---|
| `< lg` (1024px) | Sidebar gizli (`hidden lg:flex`) |
| `≥ lg` | `grid-cols-[280px_1fr]` |
| Mobil footer | `flex-col-reverse` — Kaydet üstte |
| Form grid | `grid-cols-1 md:grid-cols-2` |

Ana flex zinciri (scroll için zorunlu):

```tsx
<form className="flex h-full min-h-0 flex-col">
  <DialogHeader className="shrink-0" />
  <div className="grid min-h-0 flex-1 overflow-hidden lg:grid-cols-[280px_1fr]">
    <aside className="hidden shrink-0 overflow-y-auto ... lg:flex" />
    <div ref={scrollRef} className="min-h-0 overflow-y-auto ..." />
  </div>
  <DialogFooter className="shrink-0" />
</form>
```

---

## 16. Tam Şablon (Kopyala-Yapıştır Başlangıç)

```tsx
'use client';

import { useCallback, useRef, useState, type ReactNode, type FormEvent } from 'react';
import { BadgeCheck, UserPlus, Wallet, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const SECTIONS = [
  { id: 'section-kimlik', label: 'Kimlik', icon: BadgeCheck },
  { id: 'section-finans', label: 'Finans', icon: Wallet },
] as const;

interface EntityFormValues {
  name: string;
  code: string;
}

const defaultValues: EntityFormValues = { name: '', code: '' };

function FieldShell({ label, required, children, className }: {
  label: string; required?: boolean; children: ReactNode; className?: string;
}) {
  return (
    <div className={cn('min-w-0 space-y-1.5', className)}>
      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label}{required ? <span className="ml-0.5 text-destructive">*</span> : null}
      </Label>
      {children}
    </div>
  );
}

function Panel({ id, title, icon, children }: { id: string; title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-4 rounded-xl border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex size-9 items-center justify-center rounded-lg border shadow-sm"
          style={{ background: 'color-mix(in srgb, var(--primary) 10%, transparent)', color: 'var(--primary)' }}>
          {icon}
        </div>
        <h3 className="text-sm font-bold tracking-tight">{title}</h3>
      </div>
      {children}
    </section>
  );
}

export interface EntityFormDialogProps {
  open: boolean;
  mode: 'create' | 'edit';
  formData: EntityFormValues;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onChange: (field: keyof EntityFormValues, value: unknown) => void;
}

export default function EntityFormDialog({
  open, mode, formData, isSaving, onClose, onSubmit, onChange,
}: EntityFormDialogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const canSubmit = formData.name.trim().length > 0;

  const scrollToSection = useCallback((id: string) => {
    setActiveSection(id);
    scrollRef.current?.querySelector<HTMLElement>(`#${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit || isSaving) return;
    onSubmit();
  };

  return (
    <Dialog open={open} modal="trap-focus" onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        showCloseButton={false}
        panelClassName="max-w-none w-full"
        panelStyle={{ width: 'min(calc(100vw - 2rem), 1080px)', height: 'min(92dvh, 820px)' }}
      >
        <form className="flex h-full min-h-0 flex-col" onSubmit={handleSubmit}>
          <DialogHeader className="shrink-0 border-b bg-muted/60 px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3.5">
                <div className="flex size-11 items-center justify-center rounded-xl shadow-md"
                  style={{ background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)', color: '#fff' }}>
                  <UserPlus className="size-[22px]" />
                </div>
                <div className="min-w-0">
                  <DialogTitle className="text-lg font-bold">
                    {mode === 'create' ? 'Yeni Kayıt' : 'Kayıt Düzenle'}
                  </DialogTitle>
                  <DialogDescription className="truncate text-xs text-muted-foreground">
                    {formData.name || 'Formu doldurun'}
                  </DialogDescription>
                </div>
              </div>
              <Button type="button" variant="ghost" className="size-8 p-0" onClick={onClose} aria-label="Kapat">
                <X className="size-[18px]" />
              </Button>
            </div>
          </DialogHeader>

          <div className="grid min-h-0 flex-1 overflow-hidden lg:grid-cols-[280px_1fr]">
            <aside className="hidden shrink-0 overflow-y-auto border-r bg-muted/40 p-5 lg:flex lg:flex-col lg:gap-4">
              {/* Özet kart */}
              <div className="rounded-xl border bg-card p-4 shadow-sm">
                <p className="truncate text-sm font-bold">{formData.name || 'Yeni Kayıt'}</p>
                <Badge variant="outline" className="mt-2 font-mono text-[10px]">
                  {formData.code || 'OTOMATİK KOD'}
                </Badge>
              </div>
              {/* Bölüm nav */}
              <nav className="rounded-xl border bg-card p-2 shadow-sm">
                <p className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Bölümler</p>
                {SECTIONS.map(({ id, label, icon: Icon }) => (
                  <button key={id} type="button" onClick={() => scrollToSection(id)}
                    className={cn('flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold',
                      activeSection === id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted')}>
                    <Icon className="size-3.5" />{label}
                  </button>
                ))}
              </nav>
            </aside>

            <div ref={scrollRef} className="min-h-0 overflow-y-auto bg-background p-5 md:p-6 space-y-5">
              <Panel id="section-kimlik" title="Kimlik" icon={<BadgeCheck className="size-4" />}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FieldShell label="Ad" required>
                    <Input className="h-9" value={formData.name}
                      onChange={(e) => onChange('name', e.target.value)} />
                  </FieldShell>
                </div>
              </Panel>
            </div>
          </div>

          <DialogFooter className="shrink-0 border-t bg-muted/40 px-6 py-4">
            <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="hidden text-xs text-muted-foreground sm:block">Zorunlu alan: Ad</p>
              <div className="flex flex-col-reverse gap-2 sm:flex-row">
                <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>İptal</Button>
                <Button type="submit" disabled={isSaving || !canSubmit} className="font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)' }}>
                  {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

---

## 17. Bilinen Hatalar ve Çözümler

| Belirti | Sebep | Çözüm |
|---|---|---|
| Dialog sol üst köşede | Boyut dış `style`'a verildi | `panelStyle` kullan |
| Combobox tıklanmıyor | `modal={true}` + portaled Select | `modal="trap-focus"` |
| Dropdown görünmüyor | z-index düşük | Select `z-[1100]` |
| Select'te `true` / `MUSTERI` yazıyor | Boş `SelectValue` | `enumSelectLabel` veya explicit children |
| Select'te `__empty__` yazıyor | Sentinel UI'da | `optionalSelectLabel` |
| Form scroll olmuyor | `min-h-0` / `overflow-hidden` eksik | §15 flex zincirini uygula |
| Animasyon kaydırıyor | `translate(-50%,-50%)` + flex center | Sadece `scale` animasyonu |

---

## 18. MUI'den Dönüşüm Adımları

1. `page.tsx` içindeki inline MUI `<Dialog>` + `<Tabs>` bloğunu sil
2. `{Entity}FormDialog.tsx` oluştur (PersonelFormDialog referans al)
3. MUI `TextField` → shadcn `Input` / `Textarea`
4. MUI `Select` + `MenuItem` → shadcn `Select` + `SelectItem` + Türkçe `SelectValue`
5. MUI `DialogActions` → `DialogFooter` + shadcn `Button`
6. State ve API çağrılarını ince wrapper'da bırak
7. `preparePayload.ts` ayrı dosyaya taşı

---

## 19. Muhasebe Referans Implementasyonları

| Entity | UI dosyası | Wrapper | Payload |
|---|---|---|---|
| Personel | `hr/personel/components/PersonelFormDialog.tsx` | `page.tsx` | inline / page |
| Malzeme | `stock/material-list/MalzemeFormDialog.tsx` | `page.tsx` | zod schema |
| Cari | `components/cari/CariFormDialog.tsx` | `NewCariDialog.tsx` | `prepareCariPayload.ts` |

**En iyi kopyalama sırası:** PersonelFormDialog → modüle uyarla → CariFormDialog (dinamik listeler için).

---

## 20. Yeni Proje Adaptasyon Checklist

### Altyapı
- [ ] shadcn Dialog kurulu ve iki katmanlı (`panelStyle` destekli)
- [ ] `globals.css` dialog-panel animasyonları
- [ ] `select-utils.ts` kopyalandı
- [ ] Select/Popover `z-[1100]`

### Dialog bileşeni
- [ ] Ayrı `{Entity}FormDialog.tsx`
- [ ] `modal="trap-focus"`
- [ ] `panelStyle` boyutları
- [ ] `showCloseButton={false}` + header X
- [ ] Header gradient ikon + canlı açıklama
- [ ] Sidebar: özet + KPI + bölüm nav
- [ ] Form: Panel + FieldShell + grid
- [ ] Footer: zorunlu not + İptal + gradient Kaydet

### Veri katmanı
- [ ] `buildFormValues` / `preparePayload` ayrımı
- [ ] `open` değişince form reset
- [ ] `canSubmit` guard

### Select / i18n
- [ ] Tüm `SelectValue` Türkçe etiket
- [ ] Boolean → `AKTIF`/`PASIF`
- [ ] Opsiyonel → `EMPTY_SELECT_VALUE` + `optionalSelectLabel`
- [ ] Sidebar badge'ler aynı label map'lerden

### Responsive
- [ ] Mobil sidebar gizli
- [ ] `min-h-0` scroll zinciri
- [ ] Footer stack mobilde

---

## 21. AI Agent Uygulama Sırası (Adım Adım)

Yeni bir `{Entity}FormDialog` istendiğinde:

1. **Analiz:** Kaç bölüm, zorunlu alanlar, sidebar KPI ne gösterecek?
2. **SECTIONS** dizisini tanımla (id, label, icon)
3. **`*_LABELS` map'lerini** tanımla (enum → görünen metin)
4. `FieldShell` + `Panel` private helper'ları kopyala
5. Dialog iskeletini §16 şablonundan başlat
6. Header: modül ikonu + create/edit başlık + canlı description
7. Sidebar özet kartını form alanlarından türet
8. KPI kartını hesaplanabilir alanlardan türet
9. Her bölüm için `Panel` + `md:grid-cols-2` grid
10. Tüm Select'lere Türkçe `SelectValue` ekle
11. Dinamik listeler varsa §14 pattern
12. Wrapper + `preparePayload` yaz
13. Checklist §20'yi doğrula

---

*Bu belge Muhasebe projesindeki production implementasyonlarından türetilmiştir. Başka projede shadcn/Radix sürüm farkları olabilir; §17 hata tablosu ve §6 altyapı bölümü bu farkları kapatmak içindir.*
