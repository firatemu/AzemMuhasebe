# DATAGRID PATTERNS — Muhasebe

**Proje:** Muhasebe  
**Kapsam:** MUI X DataGrid kullanım standardı, tablo/listeler, server-side pagination/filter/sort, DataGrid + shadcn entegrasyonu  
**Stack:** Next.js App Router + TypeScript + Tailwind CSS + shadcn/ui + MUI X DataGrid  
**Son Güncelleme:** 31 Mayıs 2026

> Bu dosya Muhasebe projesinde DataGrid kullanılan tüm liste ekranları için standartları tanımlar. MUI X sadece DataGrid için kullanılır; diğer UI bileşenleri shadcn/ui ve Tailwind ile yazılır.

---

## 1. Ne Zaman Kullanılır?

Bu workflow şu ekranlarda kullanılır:

```txt
- Cari listesi
- Fatura listesi
- Stok hareketleri
- Ürün listesi
- Depo listesi
- Tahsilat / ödeme listesi
- Çek / senet listesi
- Personel listesi
- Rapor detay listeleri
- Audit / işlem hareketleri
```

Basit küçük listeler için DataGrid zorunlu değildir. Fakat pagination, filtre, sıralama, çok kolonlu veri veya yoğun operasyon varsa DataGrid tercih edilir.

---

## 2. Zorunlu Okuma Sırası

DataGrid görevi başlamadan önce agent şu dosyaları okur:

```txt
1. .cursor/rules/00-PROJECT_IDENTITY.md
2. .cursor/rules/02A-CODING_STANDARDS_FRONTEND.md
3. .cursor/rules/03-DESIGN_SYSTEM.md
4. .cursor/rules/04-UI_COMPONENT_BOUNDARIES.md
5. .cursor/rules/workflows/frontend-page-patterns.md
6. .cursor/rules/workflows/datagrid-patterns.md
7. İlgili mevcut sayfa/component dosyaları
```

Backend filtre veya pagination ihtiyacı varsa ayrıca:

```txt
.cursor/rules/workflows/backend-api-patterns.md
.cursor/rules/skills/tenant-security-skill.md
```

Frontend görevi içinde backend endpoint yazılmaz; eksik ihtiyaç raporlanır.

---

## 3. Temel Kütüphane Sınırı

```txt
MUI X DataGrid → izinli
MUI Material   → yasak
MUI Icons      → yasak
shadcn/ui      → DataGrid dışındaki UI
lucide-react   → tüm ikonlar
Tailwind CSS   → layout
```

Doğru import:

```tsx
import {
  DataGrid,
  GridActionsCellItem,
  type GridColDef,
  type GridPaginationModel,
  type GridRowParams,
  type GridSortModel,
  type GridFilterModel,
} from '@mui/x-data-grid'
```

Yanlış import:

```tsx
// ❌ Yasak
import { Box, Button, Chip, Stack, Typography } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
```

---

## 4. DataGrid Dosya Yapısı

Önerilen modül yapısı:

```txt
/components/accounts/
  AccountDataGrid.tsx
  AccountFilters.tsx
  AccountColumns.tsx        # opsiyonel
  AccountBulkActions.tsx    # opsiyonel
```

Ortak wrapper:

```txt
/components/shared/DataTable.tsx
/lib/datagrid-styles.ts
```

---

## 5. Ortak DataGrid Style

DataGrid stilleri tek yerde tutulur:

```txt
src/lib/datagrid-styles.ts
```

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

  '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus': {
    outline: 'none',
  },

  '& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-cell:focus-within': {
    outline: '2px solid hsl(var(--ring))',
    outlineOffset: '-2px',
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

## 6. Ortak DataTable Wrapper

DataGrid çıplak kullanılmaz. shadcn `Card` içinde veya ortak `DataTable` wrapper ile kullanılır.

```tsx
'use client'

import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
  type GridRowParams,
} from '@mui/x-data-grid'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/shared/EmptyState'
import { dataGridStyles } from '@/lib/datagrid-styles'

interface DataTableProps<T extends { id: string | number }> {
  title?: string
  rows: T[]
  columns: GridColDef<T>[]
  loading?: boolean
  totalRows?: number
  paginationModel: GridPaginationModel
  onPaginationModelChange: (model: GridPaginationModel) => void
  onRowClick?: (params: GridRowParams<T>) => void
  toolbar?: React.ReactNode
  getRowId?: (row: T) => string | number
}

export function DataTable<T extends { id: string | number }>({
  title,
  rows,
  columns,
  loading,
  totalRows,
  paginationModel,
  onPaginationModelChange,
  onRowClick,
  toolbar,
  getRowId,
}: DataTableProps<T>) {
  return (
    <Card>
      {title && (
        <CardHeader className="pb-0">
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
      )}

      {toolbar && <div className="border-b px-6 py-3">{toolbar}</div>}

      <CardContent className="p-0">
        <div className="min-h-[520px]">
          <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            rowCount={totalRows ?? rows.length}
            paginationModel={paginationModel}
            onPaginationModelChange={onPaginationModelChange}
            paginationMode={totalRows !== undefined ? 'server' : 'client'}
            pageSizeOptions={[25, 50, 100]}
            onRowClick={onRowClick}
            disableRowSelectionOnClick
            getRowId={getRowId}
            sx={dataGridStyles}
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
        </div>
      </CardContent>
    </Card>
  )
}
```

---

## 7. DataGrid Height Kuralı

`autoHeight` varsayılan olarak kullanılmaz.

Tercih edilen yaklaşım:

```tsx
<div className="min-h-[520px]">
  <DataGrid ... />
</div>
```

Neden?

```txt
- Çok az veri olduğunda ekran zıplamaz
- Empty state daha düzgün görünür
- Liste ekranlarında tutarlı yükseklik sağlar
- Dashboard ve detay ekranlarında layout stabil kalır
```

Özel küçük tablolar için istisna yapılabilir; ancak agent bunu gerekçelendirmelidir.

---

## 8. Pagination Standardı

Varsayılan pagination:

```txt
pageSizeOptions: [25, 50, 100]
default pageSize: 25
server page index: 1-based
DataGrid page index: 0-based
```

Frontend dönüşümü:

```tsx
const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
  page: 0,
  pageSize: 25,
})

const params = {
  page: paginationModel.page + 1,
  limit: paginationModel.pageSize,
}
```

DataGrid:

```tsx
<DataGrid
  paginationMode="server"
  paginationModel={paginationModel}
  onPaginationModelChange={setPaginationModel}
  rowCount={data?.total ?? 0}
  pageSizeOptions={[25, 50, 100]}
/>
```

Backend response standardı:

```ts
interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}
```

---

## 9. Sorting Standardı

Sorting backend destekliyorsa server-side kullanılır.

```tsx
const [sortModel, setSortModel] = useState<GridSortModel>([])

const params = {
  sortBy: sortModel[0]?.field,
  sortOrder: sortModel[0]?.sort,
}

<DataGrid
  sortingMode="server"
  sortModel={sortModel}
  onSortModelChange={setSortModel}
/>
```

Kurallar:

```txt
- Backend desteklemiyorsa fake server-side sorting yazılmaz
- Eksik backend sorting ihtiyacı raporlanır
- Finansal kolonlarda doğru numeric sort gereklidir
```

---

## 10. Filtering Standardı

Basit filtreler DataGrid filter panel yerine sayfa üstündeki shadcn filtre alanlarıyla yapılır.

Örnek:

```txt
- Arama inputu
- Durum select
- Tarih aralığı
- Cari türü
- Stok durumu
```

DataGrid internal filter sadece gelişmiş kullanımda tercih edilir.

Filter component:

```tsx
<AccountFilters onFilter={setFilters} className="mb-4" />
```

Query params:

```tsx
const queryParams = {
  ...filters,
  page: paginationModel.page + 1,
  limit: paginationModel.pageSize,
}
```

Kurallar:

```txt
- Filtre state URL ile senkronize edilebilir
- Boş filtreler API’ye gönderilmez
- Search input debounce ile backend’i yormaz
- Debounce süresi 300–500ms aralığında olmalıdır
```

---

## 11. Kolon Tanımlama Standardı

```tsx
import type { GridColDef } from '@mui/x-data-grid'
import { Pencil, Trash2 } from 'lucide-react'

import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import type { Account } from '@/types/account'

export const accountColumns: GridColDef<Account>[] = [
  {
    field: 'code',
    headerName: 'Kod',
    width: 120,
  },
  {
    field: 'name',
    headerName: 'Cari Adı',
    flex: 1,
    minWidth: 220,
  },
  {
    field: 'type',
    headerName: 'Tür',
    width: 140,
    renderCell: (params) => <StatusBadge value={params.value} />,
  },
  {
    field: 'balance',
    headerName: 'Bakiye',
    width: 160,
    align: 'right',
    headerAlign: 'right',
    renderCell: (params) => (
      <span
        className={cn(
          'tabular-nums font-medium',
          params.value >= 0
            ? 'text-[hsl(var(--income))]'
            : 'text-[hsl(var(--expense))]',
        )}
      >
        {formatCurrency(params.value)}
      </span>
    ),
  },
  {
    field: 'createdAt',
    headerName: 'Tarih',
    width: 140,
    renderCell: (params) => formatDate(params.value),
  },
]
```

---

## 12. Finansal Kolon Kuralları

Para, bakiye, tutar, miktar ve oran kolonları:

```txt
- Sağ hizalı olmalı
- tabular-nums kullanılmalı
- formatCurrency veya ilgili formatter kullanılmalı
- Negatif/pozitif anlam varsa semantic renk kullanılmalı
- Raw number doğrudan gösterilmemeli
```

Örnek:

```tsx
{
  field: 'amount',
  headerName: 'Tutar',
  width: 160,
  align: 'right',
  headerAlign: 'right',
  renderCell: (params) => (
    <span className="tabular-nums font-medium">
      {formatCurrency(params.value)}
    </span>
  ),
}
```

---

## 13. Status Badge Kuralı

Durum hücrelerinde düz string gösterilmez. `StatusBadge` veya ilgili modül badge componenti kullanılır.

```tsx
{
  field: 'status',
  headerName: 'Durum',
  width: 140,
  renderCell: (params) => <InvoiceStatusBadge status={params.value} />,
}
```

Badge metinleri Türkçe olmalıdır:

```txt
DRAFT → Taslak
PENDING → Beklemede
OPEN → Açık
PARTIALLY_PAID → Kısmi Ödendi
CLOSED → Kapalı
CANCELLED → İptal
```

---

## 14. Action Column Standardı

Action column en sağda olmalıdır.

```tsx
{
  field: 'actions',
  type: 'actions',
  headerName: '',
  width: 80,
  sortable: false,
  filterable: false,
  disableColumnMenu: true,
  getActions: (params) => [
    <GridActionsCellItem
      key="edit"
      icon={<Pencil className="h-4 w-4" />}
      label="Düzenle"
      onClick={() => router.push(`/accounts/${params.id}/edit`)}
    />,
  ],
}
```

Kurallar:

```txt
- MUI icon kullanılmaz
- lucide-react kullanılır
- Kritik aksiyonlar confirmation dialog açar
- Permission kontrolü yapılır
```

Permission örneği:

```tsx
getActions: (params) => {
  const actions = []

  if (can('account.update')) {
    actions.push(
      <GridActionsCellItem
        key="edit"
        icon={<Pencil className="h-4 w-4" />}
        label="Düzenle"
        onClick={() => router.push(`/accounts/${params.id}/edit`)}
      />,
    )
  }

  if (can('account.delete')) {
    actions.push(
      <GridActionsCellItem
        key="delete"
        icon={<Trash2 className="h-4 w-4" />}
        label="Sil"
        onClick={() => openDeleteDialog(params.row)}
      />,
    )
  }

  return actions
}
```

Eğer projede `can()` helper yoksa agent yeni permission sistemi uydurmaz; mevcut auth/role yapısını inceler.

---

## 15. Row Click Kuralı

Satıra tıklama detay sayfasına yönlendirebilir.

```tsx
onRowClick={(params) => router.push(`/accounts/${params.id}`)}
```

Ancak action butonlarına tıklanınca row click tetiklenmemelidir. Gerekirse event propagation kontrol edilir.

```tsx
onClick={(event) => {
  event.stopPropagation()
  openDeleteDialog(params.row)
}}
```

---

## 16. Selection / Bulk Action Standardı

Toplu işlem varsa selection aktif edilir.

```tsx
const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([])

<DataGrid
  checkboxSelection
  rowSelectionModel={rowSelectionModel}
  onRowSelectionModelChange={setRowSelectionModel}
/>
```

Bulk action toolbar:

```tsx
{rowSelectionModel.length > 0 && (
  <BulkActionToolbar
    selectedCount={rowSelectionModel.length}
    onClear={() => setRowSelectionModel([])}
  >
    <Button variant="outline" size="sm">
      Dışa Aktar
    </Button>
  </BulkActionToolbar>
)}
```

Kritik toplu işlemler confirmation dialog ister.

---

## 17. Loading State

DataGrid’in kendi `loading` prop’u kullanılmalıdır.

```tsx
<DataGrid
  loading={isLoading}
  rows={data?.data ?? []}
/>
```

Sayfa seviyesinde ilk yükleme için skeleton kullanılabilir:

```tsx
if (isLoading && !data) {
  return <ListSkeleton />
}
```

---

## 18. Empty / No Results State

DataGrid overlay kullanılmalıdır.

```tsx
slots={{
  noRowsOverlay: () => (
    <EmptyState
      title="Kayıt bulunamadı"
      description="Henüz kayıt eklenmemiş."
    />
  ),
  noResultsOverlay: () => (
    <EmptyState
      title="Sonuç bulunamadı"
      description="Arama kriterlerinizi değiştirerek tekrar deneyin."
    />
  ),
}}
```

---

## 19. Error State

DataGrid error state dış wrapper’da ele alınır.

```tsx
if (error) {
  return (
    <ErrorState
      description="Liste yüklenirken bir hata oluştu."
      onRetry={refetch}
    />
  )
}
```

---

## 20. Toolbar Standardı

Toolbar shadcn ve Tailwind ile yazılır. MUI Toolbar componentleri kullanılmaz.

```tsx
function AccountGridToolbar({ onExport }: { onExport: () => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground">
        Cari kayıtlarını görüntüleyin ve filtreleyin.
      </p>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onExport}>
          Dışa Aktar
        </Button>
      </div>
    </div>
  )
}
```

---

## 21. Export Kuralı

Export işlemi varsa:

```txt
- Backend export endpoint’i varsa kullanılır
- Frontend’de tüm dataset varmış gibi davranılmaz
- Sadece ekrandaki sayfayı export etmek ile tüm kayıtları export etmek ayrıdır
- Büyük export işlemleri backend üzerinden yapılmalıdır
```

Eksik export endpoint varsa frontend içinde fake çözüm üretilmez; ihtiyaç raporlanır.

---

## 22. Responsive Davranış

DataGrid mobilde doğal olarak geniş olabilir. Bu yüzden container taşma kontrolü yapılır.

```tsx
<div className="w-full overflow-x-auto">
  <DataTable ... />
</div>
```

Kurallar:

```txt
- Mobilde tablo sıkışırsa kolon minWidth değerleri korunur
- Gereksiz kolonlar mobilde gizlenebilir
- Kritik kolonlar görünür kalmalıdır
- Action column erişilebilir olmalıdır
```

Kolon visibility gerekiyorsa kontrollü kullanılabilir.

---

## 23. Performans Kuralları

```txt
- Server-side pagination tercih edilir
- Büyük dataset client’a çekilmez
- Gereksiz renderCell fonksiyonları ağırlaştırılmaz
- Kolon tanımları mümkünse component dışında veya useMemo ile tutulur
- Debounce olmadan her keypress API çağrısı yapılmaz
```

Örnek:

```tsx
const columns = useMemo<GridColDef<Account>[]>(
  () => createAccountColumns({ router, can, openDeleteDialog }),
  [router, can, openDeleteDialog],
)
```

---

## 24. Backend Contract Beklentisi

Liste endpointleri tercihen şu yapıyı döner:

```ts
interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}
```

Query param standardı:

```txt
page
limit
search
sortBy
sortOrder
status
dateFrom
dateTo
```

Backend desteklemeyen parametre frontend’den gönderilmez.

---

## 25. Yasaklar

```txt
❌ @mui/material kullanmak
❌ MUI icon kullanmak
❌ DataGrid içine MUI Chip/Button koymak
❌ Raw number para değeri göstermek
❌ Pagination olmadan büyük dataset çekmek
❌ Backend desteklemeyen filter/sort parametresi uydurmak
❌ Empty/error/loading state olmadan tablo bırakmak
❌ Kritik action’ı confirmation olmadan çalıştırmak
❌ Permission kontrolsüz action göstermek
❌ autoHeight’i varsayılan yapmak
```

---

## 26. AI Agent Kontrol Listesi

- [ ] MUI X sadece DataGrid için mi kullanıldı?
- [ ] MUI Material importu yok mu?
- [ ] MUI icon importu yok mu?
- [ ] DataGrid ortak wrapper veya ortak style kullanıyor mu?
- [ ] Server-side pagination gerekiyorsa doğru bağlandı mı?
- [ ] Page index dönüşümü doğru mu?
- [ ] Empty/no results overlay var mı?
- [ ] Error state var mı?
- [ ] Loading state var mı?
- [ ] Finansal kolonlar sağ hizalı mı?
- [ ] Para değerlerinde formatCurrency kullanıldı mı?
- [ ] `tabular-nums` kullanıldı mı?
- [ ] Status string yerine badge kullanıldı mı?
- [ ] Action column permission-aware mı?
- [ ] Kritik action confirmation dialog açıyor mu?
- [ ] Responsive taşma kontrol edildi mi?
- [ ] Backend contract gereksiz değiştirilmedi mi?
