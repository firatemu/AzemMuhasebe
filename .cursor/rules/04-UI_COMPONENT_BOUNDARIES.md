# UI COMPONENT BOUNDARIES — Muhasebe

**Proje:** Muhasebe  
**Kapsam:** Frontend UI kütüphane sınırları  
**Stack:** Next.js App Router + TypeScript + Tailwind CSS + shadcn/ui + MUI X DataGrid  
**Sürüm:** v2
**Son Güncelleme:** 31 Mayıs 2026

> Bu dosya hangi UI kütüphanesinin nerede kullanılacağını kesin olarak tanımlar. AI agent bu sınırları ihlal etmez. “Belki MUI kullansam” diye düşünülmez; cevap bu dosyadadır.

---

## 1. Temel Karar

```txt
shadcn/ui     → Tüm UI bileşenleri
MUI X         → Sadece DataGrid ve DataGrid tipleri
lucide-react  → Tüm ikonlar
Tailwind CSS  → Tüm layout ve spacing
Sonner        → Toast / bildirim
```

Yeni kodda `@mui/material` kullanılmaz.

MUI X sadece DataGrid için izinlidir.

Bağımlılık eklemek gerekiyorsa agent kullanıcıdan onay almadan yeni paket kurmaz. Önce mevcut proje bağımlılıkları ve mevcut shadcn bileşenleri kontrol edilir.

---

## 2. UI Kütüphane Sorumlulukları

| Alan | Kullanılacak Sistem |
|---|---|
| Button | shadcn `Button` |
| Input | shadcn `Input` |
| Textarea | shadcn `Textarea` |
| Select | shadcn `Select` |
| Checkbox | shadcn `Checkbox` |
| Radio | shadcn `RadioGroup` |
| Switch | shadcn `Switch` |
| Slider | shadcn `Slider` |
| Form | React Hook Form + Zod + shadcn `Form` |
| Card | shadcn `Card` |
| Dialog / Modal | shadcn `Dialog` |
| Drawer / Yan panel | shadcn `Sheet` |
| Dropdown | shadcn `DropdownMenu` |
| Popover | shadcn `Popover` |
| Tooltip | shadcn `Tooltip` |
| Badge / Chip | shadcn `Badge` |
| Alert | shadcn `Alert` |
| Tabs | shadcn `Tabs` |
| Accordion | shadcn `Accordion` |
| Separator | shadcn `Separator` |
| Skeleton | shadcn `Skeleton` |
| Progress | shadcn `Progress` |
| Avatar | shadcn `Avatar` |
| Command palette | shadcn `Command` |
| Combobox | shadcn tabanlı Combobox |
| DatePicker | shadcn `Popover` + `Calendar` |
| Toast | `sonner` + `notify()` wrapper |
| Breadcrumb | shadcn `Breadcrumb` |
| DataGrid | MUI X `DataGrid` |

---

## 3. MUI X Kullanım Alanları

MUI X sadece DataGrid için kullanılır.

```ts
import {
  DataGrid,
  GridActionsCellItem,
  type GridColDef,
  type GridPaginationModel,
  type GridRowParams,
  type GridSortModel,
  type GridFilterModel,
  type GridRenderCellParams,
} from '@mui/x-data-grid'
```

### 3.1 İzin Verilen MUI X Kullanımları

```txt
✅ DataGrid
✅ GridColDef
✅ GridPaginationModel
✅ GridRowParams
✅ GridSortModel
✅ GridFilterModel
✅ GridRenderCellParams
✅ GridActionsCellItem
✅ DataGrid slots / overlays
```

### 3.2 Yasak MUI Material İmportları

Yeni kodda aşağıdaki importlar kullanılmaz:

```ts
// ❌ Yasak
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import Dialog from '@mui/material/Dialog'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
```

---

## 4. İkon Kuralı

Tüm ikonlarda `lucide-react` kullanılır.

```tsx
import {
  Plus,
  Pencil,
  Trash2,
  FileText,
  Users,
  Package,
  Search,
  Filter,
} from 'lucide-react'
```

MUI ikonları yeni kodda kullanılmaz.

DataGrid action içinde de ikon olarak `lucide-react` kullanılır:

```tsx
{
  field: 'actions',
  type: 'actions',
  width: 80,
  getActions: (params) => [
    <GridActionsCellItem
      icon={<Pencil className="h-4 w-4" />}
      label="Düzenle"
      onClick={() => router.push(`/accounts/${params.id}/edit`)}
    />,
  ],
}
```

```ts
// ❌ Yasak
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
```

---

## 5. Layout Kuralı

Layout için MUI `Box`, `Grid`, `Stack` kullanılmaz. Tailwind CSS kullanılır.

```tsx
// ❌ Yanlış
<Box sx={{ display: 'flex', gap: 2 }}>
  <Stack spacing={2}>
    ...
  </Stack>
</Box>

// ✅ Doğru
<div className="flex gap-4">
  <div className="space-y-2">
    ...
  </div>
</div>
```

Temel layout patternleri:

```txt
Flex:       flex items-center justify-between gap-4
Grid:       grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4
Spacing:    space-y-4 / space-y-6
Wrap:       flex flex-wrap items-center gap-3
```

---

## 6. DataGrid — shadcn Entegrasyon Kuralı

DataGrid tek başına çıplak kullanılmaz. Her zaman shadcn `Card` veya proje `DataTable` wrapper içinde yaşar.

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataGrid } from '@mui/x-data-grid'
import { dataGridStyles } from '@/lib/datagrid-styles'

export function AccountDataGrid({ rows, columns }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cari Listesi</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <DataGrid
          rows={rows}
          columns={columns}
          sx={dataGridStyles}
        />
      </CardContent>
    </Card>
  )
}
```

---

## 7. DataGrid Stil Kuralı

DataGrid stilleri her sayfada tekrar yazılmaz. Ortak dosyada tutulur:

```txt
src/lib/datagrid-styles.ts
```

Önerilen standart:

```ts
export const dataGridStyles = {
  border: 'none',
  fontFamily: 'inherit',
  fontSize: '0.875rem',

  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: 'hsl(var(--muted))',
    color: 'hsl(var(--muted-foreground))',
    fontSize: '0.75rem',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '1px solid hsl(var(--border))',
  },

  '& .MuiDataGrid-row': {
    borderBottom: '1px solid hsl(var(--border))',
    '&:hover': {
      backgroundColor: 'hsl(var(--muted))',
    },
    '&.Mui-selected': {
      backgroundColor: 'hsl(var(--accent))',
    },
  },

  '& .MuiDataGrid-cell': {
    borderBottom: 'none',
    color: 'hsl(var(--foreground))',
  },

  '& .MuiDataGrid-footerContainer': {
    borderTop: '1px solid hsl(var(--border))',
    backgroundColor: 'hsl(var(--background))',
  },

  '& .MuiDataGrid-overlay': {
    backgroundColor: 'hsl(var(--background))',
  },
}
```

---

## 8. DataGrid Hücreleri İçinde Bileşen Kuralı

DataGrid hücrelerinde MUI Material bileşeni kullanılmaz.

```tsx
// ✅ Doğru
{
  field: 'status',
  renderCell: (params) => <StatusBadge value={params.value} />
}

// ✅ Doğru
{
  field: 'amount',
  renderCell: (params) => (
    <span className="tabular-nums font-medium text-[hsl(var(--income))]">
      {formatCurrency(params.value)}
    </span>
  )
}

// ❌ Yanlış
{
  field: 'status',
  renderCell: (params) => <Chip label={params.value} color="success" />
}
```

---

## 9. Mevcut MUI Kodlarının Migration Kuralı

Mevcut MUI Material kodları toplu şekilde migrate edilmez.

Kademeli migration yapılır:

1. Yeni kodda MUI Material yazılmaz.
2. Mevcut bir dosyaya dokunuluyorsa sadece görev kapsamındaki UI bileşenleri shadcn’e dönüştürülür.
3. Migration sırasında business logic, API contract, auth interceptor, tenant header, token storage, servisler, query key yapısı ve veri akışı değiştirilmez.
4. Büyük ekran migrationları ayrı görev olarak planlanır.
5. Çalışan ekran migration sonrası tekrar test edilir.

Öncelik sırası:

```txt
1. Form bileşenleri
2. Dialog / Modal
3. Button
4. Chip / Badge
5. Alert / Snackbar
6. Layout bileşenleri
```

---

## 10. shadcn/ui Kullanım Kuralları

### 10.1 Bileşen Kurulum Protokolü

Bir shadcn bileşeni projede yoksa agent önce mevcut `components/ui` klasörünü kontrol eder.

Eksik bileşen gerekiyorsa:

```txt
1. Bileşenin gerçekten gerekli olduğunu açıkla
2. shadcn CLI ile eklenmesi gereken component adını belirt
3. Kullanıcı onayı olmadan yeni dependency veya component ekleme
4. Mevcut component varken yeniden icat etme
```

Örnek:

```bash
pnpm dlx shadcn@latest add dialog
pnpm dlx shadcn@latest add form
pnpm dlx shadcn@latest add select
```



- `components/ui` altındaki shadcn bileşenleri doğrudan değiştirilmez.
- Proje özel varyasyonlar `components/shared` altında wrapper olarak oluşturulur.
- shadcn bileşeni yeniden icat edilmez.
- Yeni component eklenmeden önce mevcut componentler kontrol edilir.
- `className` layout ve küçük varyasyonlar için kullanılabilir.
- Büyük varyasyonlar wrapper component olarak yazılır.

Örnek:

```tsx
// ✅ Doğru
<Button variant="outline" size="sm">
  İptal
</Button>

// ✅ Doğru
<StatusBadge status="OPEN" />

// ❌ Yanlış
<button className="rounded bg-blue-600 px-4 py-2 text-white">
  Kaydet
</button>
```

---

## 11. Bildirim Sistemi

Toast bildirimleri sadece `sonner` ve proje `notify()` wrapper ile yapılır.

```ts
import { notify } from '@/lib/notify'

notify('Kayıt oluşturuldu', 'success')
notify('Bir hata oluştu', 'error')
```

Sayfa içinde doğrudan `toast.success()` kullanmak yerine wrapper tercih edilir. Böylece mesaj dili, süre ve davranış tek yerden yönetilir.

---

## 12. Dialog / Confirmation Kuralı

Kritik işlemler tek tıkla uygulanmaz.

Confirmation dialog gerektiren işlemler:

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

Bu işlemlerde shadcn `Dialog` kullanılır. MUI Dialog kullanılmaz.

---

## 13. Permission-Aware UI Kuralı

Yetki gerektiren aksiyonlar permission kontrolü olmadan gösterilmez.

```tsx
{can('account.create') && (
  <Button asChild>
    <Link href="/accounts/new">Yeni Cari</Link>
  </Button>
)}
```

Kritik aksiyonlarda hem frontend permission kontrolü hem backend authorization gereklidir. Frontend kontrolü güvenlik mekanizması değil, kullanıcı deneyimi katmanıdır.

---

## 14. Yasaklar

```txt
❌ Yeni kodda @mui/material kullanmak
❌ Yeni kodda MUI ikonları kullanmak
❌ Layout için Box/Grid/Stack kullanmak
❌ shadcn component varken özel HTML buton/input yazmak
❌ DataGrid’i çıplak ve stylesız kullanmak
❌ Inline style ile renk vermek
❌ Hardcode Tailwind renkleri kullanmak
❌ MUI + shadcn karışımıyla aynı işlevi iki farklı component sistemiyle yazmak
```

---

## 15. Backend ve Güvenlik Sınırı

Frontend UI görevi sırasında şu dosyalar veya davranışlar değiştirilmez:

```txt
- Backend controller/service/dto dosyaları
- Prisma schema veya migration dosyaları
- Auth interceptor
- Tenant header injection
- Token storage
- API base URL
- Finansal işlem mantığı
- Fatura/stok/cari transaction akışları
```

Eksik endpoint veya backend ihtiyaçları fark edilirse kod değiştirilmez; raporlanır.

## 16. AI Agent Kontrol Listesi

Frontend dosyası düzenlendikten sonra agent şunları kontrol eder:

- [ ] Yeni `@mui/material` importu var mı?
- [ ] Yeni MUI icon importu var mı?
- [ ] Layout Tailwind ile mi yapılmış?
- [ ] UI bileşenleri shadcn’den mi geliyor?
- [ ] DataGrid sadece MUI X’ten mi geliyor?
- [ ] DataGrid ortak style wrapper kullanıyor mu?
- [ ] Toast işlemleri `notify()` ile mi yapılıyor?
- [ ] Kritik aksiyonlar confirmation dialog ile korunuyor mu?
- [ ] Permission gerektiren butonlar kontrol ediliyor mu?
