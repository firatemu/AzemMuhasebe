# FRONTEND PAGE PATTERNS — Muhasebe

**Proje:** Muhasebe  
**Kapsam:** Frontend sayfa ve bileşen patternleri  
**Stack:** Next.js App Router + TypeScript + Tailwind CSS + shadcn/ui + MUI X DataGrid  
**Sürüm:** v2
**Son Güncelleme:** 31 Mayıs 2026

> AI agent yeni bir frontend sayfası veya bileşeni yazarken bu dosyadaki şablonları referans alır. Bu dosya `DESIGN_SYSTEM.md`, `UI_COMPONENT_BOUNDARIES.md` ve `CODING_STANDARDS.md` ile birlikte okunmalıdır.

---

## 1. Temel Prensipler

```txt
✅ Modern SaaS hissi
✅ shadcn/ui bileşenleri
✅ Tailwind ile layout
✅ MUI X sadece DataGrid
✅ Grid sistemi ile yan yana alanlar
✅ Bol ama kontrollü whitespace
✅ Loading / empty / error state
✅ Permission-aware actions
✅ Kritik işlemlerde confirmation

❌ Bootstrap tarzı dikey form stack
❌ Her şeyi kutu içinde kutu içinde yapmak
❌ Mor / rastgele gradient
❌ Hardcode renk
❌ Yeni kodda @mui/material
```

---

## 2. Sayfa Üretim Öncesi Okuma Sırası

AI agent yeni sayfa üretmeden veya mevcut sayfayı polish etmeden önce şu kaynakları okur:

```txt
1. 00-PROJECT_IDENTITY.md
2. 03-DESIGN_SYSTEM.md
3. 04-UI_COMPONENT_BOUNDARIES.md
4. 02-CODING_STANDARDS.md veya 02-CODING_STANDARDS_FRONTEND.md
5. workflows/frontend-page-patterns.md
6. workflows/premium-form-dialog-pattern.md (çok alanlı form dialog ise)
7. İlgili mevcut sayfa/component dosyaları
```

## 3. Standart Sayfa Akışı

```tsx
<div className="p-4 md:p-6">
  <PageHeader />

  <div className="space-y-6">
    <KPICards />
    <Filters />
    <MainContent />
  </div>
</div>
```

Sıralama:

1. Breadcrumb
2. Sayfa başlığı
3. Açıklama
4. Aksiyon butonları
5. KPI kartları
6. Filtre/arama çubuğu
7. Ana içerik
8. Empty/loading/error state

---

## 4. PageHeader Pattern

```tsx
import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

interface PageHeaderProps {
  title: string
  description?: string
  breadcrumbs?: { label: string; href?: string }[]
  actions?: React.ReactNode
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 pb-6 md:flex-row md:items-start md:justify-between">
      <div className="space-y-1">
        {breadcrumbs && (
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((item, index) => (
                <BreadcrumbItem key={`${item.label}-${index}`}>
                  {item.href ? (
                    <BreadcrumbLink asChild>
                      <Link href={item.href}>{item.label}</Link>
                    </BreadcrumbLink>
                  ) : (
                    <span className="text-foreground">{item.label}</span>
                  )}
                  {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                </BreadcrumbItem>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}

        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>

        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </div>
  )
}
```

---

## 5. KPI Card Pattern

```tsx
import { TrendingDown, TrendingUp, Minus } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface KPICardProps {
  title: string
  value: string | number
  description?: string
  trend?: string
  trendDirection?: 'up' | 'down' | 'neutral'
  trendType?: 'income' | 'expense' | 'default'
  icon?: React.ReactNode
}

export function KPICard({
  title,
  value,
  description,
  trend,
  trendDirection = 'neutral',
  trendType = 'default',
  icon,
}: KPICardProps) {
  const trendColor = {
    income: 'text-[hsl(var(--income))]',
    expense: 'text-[hsl(var(--expense))]',
    default:
      trendDirection === 'up'
        ? 'text-[hsl(var(--income))]'
        : trendDirection === 'down'
          ? 'text-[hsl(var(--expense))]'
          : 'text-muted-foreground',
  }[trendType]

  const TrendIcon =
    trendDirection === 'up'
      ? TrendingUp
      : trendDirection === 'down'
        ? TrendingDown
        : Minus

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>

        <p className="mt-2 text-3xl font-bold tabular-nums">{value}</p>

        {(trend || description) && (
          <div className="mt-1 flex items-center gap-1">
            {trend && (
              <>
                <TrendIcon className={cn('h-3 w-3', trendColor)} />
                <span className={cn('text-xs font-medium', trendColor)}>
                  {trend}
                </span>
              </>
            )}
            {description && (
              <span className="text-xs text-muted-foreground">{description}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```

Kullanım:

```tsx
<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
  <KPICard title="Toplam Cari" value={stats.total} />
  <KPICard title="Alacak" value={formatCurrency(stats.receivable)} trendType="income" />
  <KPICard title="Borç" value={formatCurrency(stats.payable)} trendType="expense" />
</div>
```

---

## 6. StatusBadge Pattern

```tsx
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const INVOICE_STATUS_MAP = {
  DRAFT: { label: 'Taslak', variant: 'secondary' as const },
  PENDING: { label: 'Beklemede', variant: 'outline' as const },
  OPEN: {
    label: 'Açık',
    className:
      'border-[hsl(var(--income))] bg-[hsl(var(--income-muted))] text-[hsl(var(--income))]',
  },
  PARTIALLY_PAID: {
    label: 'Kısmi Ödendi',
    className:
      'border-[hsl(var(--warning))] bg-[hsl(var(--warning-muted))] text-[hsl(var(--warning))]',
  },
  CLOSED: { label: 'Kapalı', variant: 'secondary' as const },
  CANCELLED: { label: 'İptal', variant: 'destructive' as const },
}

export function InvoiceStatusBadge({
  status,
}: {
  status: keyof typeof INVOICE_STATUS_MAP
}) {
  const config = INVOICE_STATUS_MAP[status]

  return (
    <Badge
      variant={config.variant}
      className={cn('text-xs', config.className)}
    >
      {config.label}
    </Badge>
  )
}
```

---

## 7. DataTable Wrapper Pattern

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

## 8. Liste Sayfası Pattern

```tsx
'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import type { GridPaginationModel } from '@mui/x-data-grid'

import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/shared/PageHeader'
import { KPICard } from '@/components/shared/KPICard'
import { AccountFilters } from '@/components/accounts/AccountFilters'
import { AccountDataGrid } from '@/components/accounts/AccountDataGrid'
import { accountService } from '@/services/account.service'
import { QK } from '@/lib/query-keys'
import { formatCurrency } from '@/lib/formatters'

export function AccountListClient() {
  const [filters, setFilters] = useState({})
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 25,
  })

  const queryParams = {
    ...filters,
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
  }

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: QK.accounts.list(queryParams),
    queryFn: () => accountService.getAll(queryParams),
  })

  return (
    <div className="p-4 md:p-6">
      <PageHeader
        title="Cari Listesi"
        description="Müşteri ve tedarikçi hesaplarını yönetin."
        breadcrumbs={[{ label: 'Cari Yönetimi' }, { label: 'Cariler' }]}
        actions={
          can('account.create') ? (
            <Button asChild>
              <Link href="/accounts/new">
                <Plus className="mr-2 h-4 w-4" />
                Yeni Cari
              </Link>
            </Button>
          ) : null
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <KPICard title="Toplam Cari" value={data?.stats?.total ?? 0} />
        <KPICard title="Aktif" value={data?.stats?.active ?? 0} />
        <KPICard
          title="Alacak"
          value={formatCurrency(data?.stats?.receivable ?? 0)}
          trendType="income"
        />
        <KPICard
          title="Borç"
          value={formatCurrency(data?.stats?.payable ?? 0)}
          trendType="expense"
        />
      </div>

      <AccountFilters onFilter={setFilters} className="mb-4" />

      <AccountDataGrid
        data={data}
        loading={isLoading}
        error={error}
        onRetry={refetch}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
    </div>
  )
}
```

---

## 9. Form Sayfası Pattern

```tsx
'use client'

import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/shared/PageHeader'
import { AccountForm } from '@/components/accounts/AccountForm'
import { accountService } from '@/services/account.service'
import { QK } from '@/lib/query-keys'
import { notify } from '@/lib/notify'
import { getApiErrorMessage } from '@/lib/api-error'
import type { CreateAccountFormData } from '@/schemas/account.schema'

export function AccountNewClient() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: accountService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QK.accounts.all })
      notify('Cari başarıyla oluşturuldu', 'success')
      router.push('/accounts')
    },
    onError: (error) => {
      notify(getApiErrorMessage(error), 'error')
    },
  })

  function handleSubmit(data: CreateAccountFormData): void {
    mutate(data)
  }

  return (
    <div className="p-4 md:p-6">
      <PageHeader
        title="Yeni Cari"
        description="Yeni müşteri veya tedarikçi hesabı oluşturun."
        breadcrumbs={[
          { label: 'Cariler', href: '/accounts' },
          { label: 'Yeni Cari' },
        ]}
      />

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Cari Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <AccountForm onSubmit={handleSubmit} isSubmitting={isPending} />
        </CardContent>
      </Card>
    </div>
  )
}
```

---

## 10. Detay Sayfası Pattern

```tsx
'use client'

import Link from 'next/link'
import { Pencil } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/PageHeader'
import { DetailSkeleton } from '@/components/shared/DetailSkeleton'
import { ErrorState } from '@/components/shared/ErrorState'
import { accountService } from '@/services/account.service'
import { QK } from '@/lib/query-keys'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/formatters'

export function AccountDetailClient({ id }: { id: string }) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: QK.accounts.detail(id),
    queryFn: () => accountService.getById(id),
  })

  if (isLoading) return <DetailSkeleton />
  if (error) return <ErrorState onRetry={refetch} />
  if (!data) return null

  return (
    <div className="p-4 md:p-6">
      <PageHeader
        title={data.name}
        breadcrumbs={[
          { label: 'Cariler', href: '/accounts' },
          { label: data.name },
        ]}
        actions={
          can('account.update') ? (
            <Button variant="outline" asChild>
              <Link href={`/accounts/${id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Düzenle
              </Link>
            </Button>
          ) : null
        }
      />

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Bakiye</CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={cn(
                'text-3xl font-bold tabular-nums',
                data.balance >= 0
                  ? 'text-[hsl(var(--income))]'
                  : 'text-[hsl(var(--expense))]',
              )}
            >
              {formatCurrency(data.balance)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="movements" className="mt-6">
        <TabsList>
          <TabsTrigger value="movements">Hareketler</TabsTrigger>
          <TabsTrigger value="invoices">Faturalar</TabsTrigger>
        </TabsList>

        <TabsContent value="movements">
          <AccountMovementsDataGrid accountId={id} />
        </TabsContent>

        <TabsContent value="invoices">
          <AccountInvoicesDataGrid accountId={id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

---

## 11. Filter / Search Bar Pattern

```tsx
'use client'

import { useState } from 'react'
import { Search, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface AccountFilters {
  search?: string
  type?: string
}

interface AccountFiltersProps {
  onFilter: (filters: AccountFilters) => void
  className?: string
}

export function AccountFilters({ onFilter, className }: AccountFiltersProps) {
  const [search, setSearch] = useState('')
  const [type, setType] = useState<string | undefined>()

  const hasFilters = Boolean(search || type)

  function applyFilters(): void {
    onFilter({ search: search || undefined, type })
  }

  function handleReset(): void {
    setSearch('')
    setType(undefined)
    onFilter({})
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      <div className="relative min-w-[200px] max-w-sm flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Ara..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="pl-9"
        />
      </div>

      <Select value={type} onValueChange={setType}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Cari Türü" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="CUSTOMER">Müşteri</SelectItem>
          <SelectItem value="SUPPLIER">Tedarikçi</SelectItem>
          <SelectItem value="BOTH">Her İkisi</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" onClick={applyFilters}>
        Filtrele
      </Button>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={handleReset}>
          <X className="mr-1 h-4 w-4" />
          Temizle
        </Button>
      )}
    </div>
  )
}
```

---

## 12. Empty State Pattern

```tsx
import { FileX } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  title?: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({
  title = 'Kayıt bulunamadı',
  description = 'Henüz kayıt eklenmemiş.',
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <FileX className="mb-4 h-12 w-12 text-muted-foreground/40" />
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>

      {action && (
        <Button className="mt-4" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}
```

---

## 13. Error State Pattern

```tsx
import { AlertCircle } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
}

export function ErrorState({
  title = 'Bir hata oluştu',
  description = 'Veriler yüklenirken bir sorun oluştu.',
  onRetry,
}: ErrorStateProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span>{description}</span>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            Tekrar dene
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}
```

---

## 14. Confirmation Dialog Pattern

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  isPending?: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Onayla',
  cancelLabel = 'İptal',
  destructive,
  isPending,
  onOpenChange,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={destructive ? 'destructive' : 'default'}
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? 'İşleniyor...' : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

Kritik işlemler bu pattern olmadan uygulanmaz.

> **Çok alanlı ekle/düzenle formları** için ayrı pattern: `workflows/premium-form-dialog-pattern.md`  
> Referans: `PersonelFormDialog.tsx`, `MalzemeFormDialog.tsx`

---

## 15. Bulk Action Toolbar Pattern

```tsx
interface BulkActionToolbarProps {
  selectedCount: number
  onClear: () => void
  children?: React.ReactNode
}

export function BulkActionToolbar({
  selectedCount,
  onClear,
  children,
}: BulkActionToolbarProps) {
  if (selectedCount === 0) return null

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-muted/50 px-4 py-3">
      <p className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{selectedCount}</span> kayıt seçildi
      </p>

      <div className="flex items-center gap-2">
        {children}
        <Button variant="ghost" size="sm" onClick={onClear}>
          Seçimi temizle
        </Button>
      </div>
    </div>
  )
}
```

---

## 16. Master-Detail Pattern

Desktop ekranlarda liste ve detay yan yana gösterilebilir. Mobilde tek kolon kullanılır.

```tsx
<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
  <DataTable ... />
  <Card>
    <CardHeader>
      <CardTitle>Seçili Kayıt</CardTitle>
    </CardHeader>
    <CardContent>
      <SelectedRecordDetail />
    </CardContent>
  </Card>
</div>
```

---

## 17. Dashboard Pattern

Dashboard ekranlarında bilgi hiyerarşisi:

1. Genel finansal özet
2. Kritik uyarılar
3. Son işlemler
4. Grafikler
5. Bekleyen görevler

```tsx
<div className="p-4 md:p-6">
  <PageHeader
    title="Dashboard"
    description="İşletmenizin genel finansal durumunu takip edin."
  />

  <div className="space-y-6">
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <KPICard title="Toplam Alacak" value={formatCurrency(receivable)} trendType="income" />
      <KPICard title="Toplam Borç" value={formatCurrency(payable)} trendType="expense" />
      <KPICard title="Bugünkü Tahsilat" value={formatCurrency(todayCollections)} />
      <KPICard title="Açık Fatura" value={openInvoiceCount} />
    </div>

    <div className="grid gap-6 lg:grid-cols-2">
      <Card />
      <Card />
    </div>
  </div>
</div>
```

---

## 18. Navigation Pattern

```tsx
<Button asChild>
  <Link href="/accounts/new">
    <Plus className="mr-2 h-4 w-4" />
    Yeni Cari
  </Link>
</Button>

<Button variant="outline" size="sm" asChild>
  <Link href={`/accounts/${id}/edit`}>
    <Pencil className="mr-2 h-4 w-4" />
    Düzenle
  </Link>
</Button>

<Button variant="ghost" onClick={() => router.back()}>
  Geri
</Button>
```

---

## 19. Sidebar Active Item Pattern

```tsx
className={cn(
  'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
  isActive
    ? 'bg-primary text-primary-foreground'
    : 'text-muted-foreground hover:bg-accent hover:text-foreground',
)}
```

---

## 20. Responsive Kurallar

```txt
Mobil:
- Tek kolon
- p-4
- Aksiyonlar wrap
- Filtreler alt alta veya wrap

Tablet:
- 2 kolon grid
- p-6
- Filtreler yan yana

Desktop:
- 3-4 kolon grid
- Sidebar + içerik
- Master-detail mümkün
```

---

## 21. Permission Helper Notu

Örneklerde kullanılan `can()` helper mevcut projedeki gerçek permission mekanizmasına göre uyarlanır. Eğer projede permission helper yoksa agent yeni güvenlik modeli uydurmaz; mevcut auth/permission yapısını inceler ve ona uygun kullanır.

## 22. AI Agent Sayfa Üretim Kontrol Listesi

- [ ] PageHeader var mı?
- [ ] Breadcrumb gerekli ise var mı?
- [ ] Primary action net mi?
- [ ] KPI alanı gerekiyorsa maksimum 4 kart mı?
- [ ] Filtre / arama alanı kullanılabilir mi?
- [ ] DataGrid wrapper kullanıldı mı?
- [ ] Loading state var mı?
- [ ] Empty state var mı?
- [ ] Error state var mı?
- [ ] Kritik işlemler confirmation dialog ile korunuyor mu?
- [ ] Yetki gerektiren butonlarda permission kontrolü var mı?
- [ ] Mobil görünüm tek kolon ve kullanılabilir mi?
- [ ] Hardcode renk yok mu?
- [ ] MUI Material kullanılmadı mı?
- [ ] Çok alanlı form dialog gerekiyorsa `premium-form-dialog-pattern.md` uygulandı mı?
