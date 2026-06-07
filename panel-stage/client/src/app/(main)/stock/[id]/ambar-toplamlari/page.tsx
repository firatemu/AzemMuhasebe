'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from '@mui/x-data-grid';
import { trTR } from '@mui/x-data-grid/locales';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Boxes,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  Download,
  PackageOpen,
  RefreshCw,
  Search,
  SlidersHorizontal,
  TrendingDown,
  TrendingUp,
  Warehouse,
} from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { dataGridStyles } from '@/lib/datagrid-styles';
import { cn } from '@/lib/utils';
import {
  getProductStockSummary,
  getWarehouseProductStockHistory,
  type ProductStockSummary,
  type WarehouseStockSnapshot,
} from '@/services/warehouse.service';

type StockView = 'all' | 'positive' | 'zero' | 'negative';

const viewLabels: Record<StockView, string> = {
  all: 'Tümü',
  positive: 'Stokta',
  zero: 'Boş',
  negative: 'Negatif',
};

function toDateInputValue(date = new Date()): string {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 10);
}

function formatQuantity(value: number, unit = ''): string {
  const formatted = value.toLocaleString('tr-TR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return unit ? `${formatted} ${unit}` : formatted;
}

function formatDate(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function stockState(quantity: number): Exclude<StockView, 'all'> {
  if (quantity > 0) return 'positive';
  if (quantity < 0) return 'negative';
  return 'zero';
}

function statusBadgeClass(quantity: number): string {
  if (quantity > 0) {
    return 'border-[var(--income)] bg-[var(--income-muted)] text-[var(--income)]';
  }
  if (quantity < 0) {
    return 'border-[var(--expense)] bg-[var(--expense-muted)] text-[var(--expense)]';
  }
  return 'border-border bg-muted text-muted-foreground';
}

function quantityTextClass(quantity: number): string {
  if (quantity > 0) return 'text-[var(--income)]';
  if (quantity < 0) return 'text-[var(--expense)]';
  return 'text-muted-foreground';
}

function LoadingState() {
  return (
    <div className="flex min-h-[520px] items-center justify-center p-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex size-12 items-center justify-center rounded-lg border bg-card shadow-sm">
          <RefreshCw className="size-5 animate-spin text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-semibold">Ambar toplamları yükleniyor</p>
          <p className="text-xs text-muted-foreground">Ürün ve tarih bazlı stok görüntüsü hazırlanıyor.</p>
        </div>
      </div>
    </div>
  );
}

function EmptyRowsOverlay() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
      <div className="flex size-12 items-center justify-center rounded-lg border bg-muted">
        <PackageOpen className="size-5 text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm font-semibold">Ambar kaydı bulunamadı</p>
        <p className="mt-1 max-w-md text-xs text-muted-foreground">
          Seçilen tarihte bu malzeme için ambar toplamı yok veya filtreler sonucu daraltıyor.
        </p>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  tone?: 'default' | 'income' | 'expense' | 'warning' | 'info';
}

function MetricCard({ title, value, description, icon, tone = 'default' }: MetricCardProps) {
  const toneClass = {
    default: 'text-muted-foreground bg-muted border-border',
    income: 'text-[var(--income)] bg-[var(--income-muted)] border-[var(--income)]',
    expense: 'text-[var(--expense)] bg-[var(--expense-muted)] border-[var(--expense)]',
    warning: 'text-[var(--warning)] bg-[var(--warning-muted)] border-[var(--warning)]',
    info: 'text-[var(--info)] bg-[var(--info-muted)] border-[var(--info)]',
  }[tone];

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase text-muted-foreground">{title}</p>
            <p className="mt-2 truncate text-2xl font-semibold tabular-nums tracking-tight">
              {value}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          </div>
          <div className={cn('flex size-10 shrink-0 items-center justify-center rounded-lg border', toneClass)}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AmbarToplamlariPage() {
  const params = useParams();
  const router = useRouter();
  const productId = String(params.id ?? '');

  const [date, setDate] = useState<string>(toDateInputValue());
  const [product, setProduct] = useState<ProductStockSummary | null>(null);
  const [stockHistory, setStockHistory] = useState<WarehouseStockSnapshot[]>([]);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<StockView>('all');
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const loadData = useCallback(async () => {
    if (!productId) return;

    setDataLoading(true);
    setError(null);

    try {
      const [productData, warehouseData] = await Promise.all([
        getProductStockSummary(productId),
        getWarehouseProductStockHistory(productId, date),
      ]);

      setProduct(productData);
      setStockHistory(warehouseData);
    } catch (loadError) {
      console.error('Ambar toplamları yüklenemedi:', loadError);
      setError('Ambar toplamları yüklenemedi. Bağlantıyı ve yetkilerinizi kontrol edip tekrar deneyin.');
    } finally {
      setLoading(false);
      setDataLoading(false);
    }
  }, [date, productId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const totalQuantity = useMemo(
    () => stockHistory.reduce((total, warehouse) => total + warehouse.quantity, 0),
    [stockHistory],
  );

  const positiveCount = useMemo(
    () => stockHistory.filter((warehouse) => warehouse.quantity > 0).length,
    [stockHistory],
  );

  const zeroCount = useMemo(
    () => stockHistory.filter((warehouse) => warehouse.quantity === 0).length,
    [stockHistory],
  );

  const negativeCount = useMemo(
    () => stockHistory.filter((warehouse) => warehouse.quantity < 0).length,
    [stockHistory],
  );

  const maxAbsQuantity = useMemo(
    () => Math.max(...stockHistory.map((warehouse) => Math.abs(warehouse.quantity)), 0),
    [stockHistory],
  );

  const topWarehouses = useMemo(
    () =>
      [...stockHistory]
        .filter((warehouse) => warehouse.quantity !== 0)
        .sort((a, b) => Math.abs(b.quantity) - Math.abs(a.quantity))
        .slice(0, 5),
    [stockHistory],
  );

  const filteredRows = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('tr-TR');

    return stockHistory.filter((warehouse) => {
      const matchesQuery = query
        ? `${warehouse.code} ${warehouse.name}`.toLocaleLowerCase('tr-TR').includes(query)
        : true;
      const matchesView = view === 'all' ? true : stockState(warehouse.quantity) === view;

      return matchesQuery && matchesView;
    });
  }, [search, stockHistory, view]);

  const columns = useMemo<GridColDef<WarehouseStockSnapshot>[]>(
    () => [
      {
        field: 'code',
        headerName: 'Ambar',
        flex: 1.1,
        minWidth: 180,
        renderCell: (params: GridRenderCellParams<WarehouseStockSnapshot, string>) => (
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
              <Warehouse className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{params.row.name}</p>
              <p className="mt-0.5 text-xs font-medium tabular-nums text-muted-foreground">
                {params.value}
              </p>
            </div>
          </div>
        ),
      },
      {
        field: 'quantity',
        headerName: 'Miktar',
        flex: 0.9,
        minWidth: 160,
        align: 'right',
        headerAlign: 'right',
        renderCell: (params: GridRenderCellParams<WarehouseStockSnapshot, number>) => {
          const quantity = Number(params.value ?? 0);
          const Icon = quantity > 0 ? TrendingUp : quantity < 0 ? TrendingDown : Boxes;

          return (
            <div className="flex w-full items-center justify-end gap-2">
              <Icon className={cn('size-4', quantityTextClass(quantity))} />
              <span className={cn('font-semibold tabular-nums', quantityTextClass(quantity))}>
                {formatQuantity(quantity, product?.unit)}
              </span>
            </div>
          );
        },
      },
      {
        field: 'share',
        headerName: 'Dağılım',
        flex: 1,
        minWidth: 180,
        sortable: false,
        renderCell: (params: GridRenderCellParams<WarehouseStockSnapshot>) => {
          const quantity = params.row.quantity;
          const width = maxAbsQuantity > 0 ? Math.max((Math.abs(quantity) / maxAbsQuantity) * 100, 4) : 0;

          return (
            <div className="flex w-full items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    'h-full rounded-full',
                    quantity > 0
                      ? 'bg-[var(--income)]'
                      : quantity < 0
                        ? 'bg-[var(--expense)]'
                        : 'bg-muted-foreground/40',
                  )}
                  style={{ width: `${width}%` }}
                />
              </div>
              <span className="w-12 text-right text-xs tabular-nums text-muted-foreground">
                {maxAbsQuantity > 0 ? `${Math.round(width)}%` : '0%'}
              </span>
            </div>
          );
        },
      },
      {
        field: 'status',
        headerName: 'Durum',
        width: 130,
        sortable: false,
        renderCell: (params: GridRenderCellParams<WarehouseStockSnapshot>) => {
          const quantity = params.row.quantity;
          const label = quantity > 0 ? 'Stokta' : quantity < 0 ? 'Negatif' : 'Boş';

          return (
            <Badge variant="outline" className={cn('h-6 rounded-md', statusBadgeClass(quantity))}>
              {label}
            </Badge>
          );
        },
      },
    ],
    [maxAbsQuantity, product?.unit],
  );

  const handleExportCsv = useCallback(() => {
    const rows = filteredRows.length > 0 ? filteredRows : stockHistory;
    const csvRows = [
      ['Ambar Kodu', 'Ambar Adı', 'Miktar', 'Birim', 'Tarih'],
      ...rows.map((warehouse) => [
        warehouse.code,
        warehouse.name,
        String(warehouse.quantity).replace('.', ','),
        product?.unit ?? '',
        date,
      ]),
    ];

    const csv = csvRows
      .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(';'))
      .join('\n');

    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ambar-toplamlari-${product?.code ?? productId}-${date}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [date, filteredRows, product?.code, product?.unit, productId, stockHistory]);

  const handleCopySummary = useCallback(async () => {
    if (!product) return;

    const summary = [
      `Malzeme: ${product.code} - ${product.name}`,
      `Tarih: ${formatDate(date)}`,
      `Toplam: ${formatQuantity(totalQuantity, product.unit)}`,
      `Stokta olan ambar: ${positiveCount}`,
      `Boş ambar: ${zeroCount}`,
      `Negatif ambar: ${negativeCount}`,
    ].join('\n');

    await navigator.clipboard.writeText(summary);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }, [date, negativeCount, positiveCount, product, totalQuantity, zeroCount]);

  const health = negativeCount > 0
    ? {
        label: 'Düzeltme gerekli',
        description: 'Negatif stok görünen ambarlar var.',
        icon: AlertTriangle,
        className: 'text-[var(--expense)]',
      }
    : totalQuantity > 0
      ? {
          label: 'Dengeli görünüm',
          description: 'Negatif ambar bulunmuyor.',
          icon: CheckCircle2,
          className: 'text-[var(--income)]',
        }
      : {
          label: 'Stok yok',
          description: 'Seçili tarihte toplam stok sıfır.',
          icon: PackageOpen,
          className: 'text-muted-foreground',
        };

  const HealthIcon = health.icon;

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex flex-col gap-4 border-b pb-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <Link href="/stock/material-list" className="font-medium hover:text-foreground">
                Malzeme Listesi
              </Link>
              <span>/</span>
              <span className="text-foreground">Ambar Toplamları</span>
            </div>
            <div className="flex items-start gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => router.back()}
                aria-label="Geri dön"
              >
                <ArrowLeft className="size-4" />
              </Button>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-semibold tracking-tight">Ambar Toplamları</h1>
                  {product?.code ? (
                    <Badge variant="outline" className="rounded-md font-mono">
                      {product.code}
                    </Badge>
                  ) : null}
                </div>
                <p className="mt-1 max-w-3xl truncate text-sm text-muted-foreground">
                  {product?.name ?? 'Malzeme'} için seçili tarih sonundaki ambar bazlı stok dağılımı.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="outline" onClick={handleCopySummary} disabled={!product}>
              {copied ? <ClipboardCheck className="size-4" /> : <Copy className="size-4" />}
              {copied ? 'Kopyalandı' : 'Özeti Kopyala'}
            </Button>
            <Button type="button" variant="outline" onClick={handleExportCsv} disabled={stockHistory.length === 0}>
              <Download className="size-4" />
              CSV
            </Button>
            <Button type="button" onClick={() => void loadData()} disabled={dataLoading}>
              <RefreshCw className={cn('size-4', dataLoading && 'animate-spin')} />
              Yenile
            </Button>
          </div>
        </div>

        {error ? (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>Veri alınamadı</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Toplam Stok"
            value={formatQuantity(totalQuantity, product?.unit)}
            description={`${formatDate(date)} kapanış miktarı`}
            icon={<Boxes className="size-4" />}
            tone={totalQuantity > 0 ? 'income' : totalQuantity < 0 ? 'expense' : 'default'}
          />
          <MetricCard
            title="Stokta Ambar"
            value={positiveCount}
            description={`${stockHistory.length} ambar içinde pozitif stok`}
            icon={<TrendingUp className="size-4" />}
            tone="income"
          />
          <MetricCard
            title="Boş Ambar"
            value={zeroCount}
            description="Seçili tarihte sıfır görünen ambar"
            icon={<PackageOpen className="size-4" />}
            tone="default"
          />
          <MetricCard
            title="Negatif Ambar"
            value={negativeCount}
            description="Kontrol edilmesi gereken kayıt"
            icon={<AlertTriangle className="size-4" />}
            tone={negativeCount > 0 ? 'expense' : 'default'}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <Card className="overflow-hidden">
            <CardHeader className="border-b">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <CardTitle>Ambar Bazlı Stok Dağılımı</CardTitle>
                  <CardDescription>
                    Tarih, arama ve durum filtresine göre ambar toplamlarını inceleyin.
                  </CardDescription>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Ambar ara..."
                      className="w-full pl-8 sm:w-[220px]"
                    />
                  </div>
                  <div className="relative">
                    <CalendarDays className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="date"
                      value={date}
                      onChange={(event) => setDate(event.target.value)}
                      className="w-full pl-8 sm:w-[160px]"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                  <SlidersHorizontal className="size-3.5" />
                  Görünüm
                </div>
                {(Object.keys(viewLabels) as StockView[]).map((item) => (
                  <Button
                    key={item}
                    type="button"
                    variant={view === item ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setView(item)}
                  >
                    {viewLabels[item]}
                  </Button>
                ))}
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="h-[560px]">
                <DataGrid<WarehouseStockSnapshot>
                  rows={filteredRows}
                  columns={columns}
                  loading={dataLoading}
                  localeText={trTR.components.MuiDataGrid.defaultProps.localeText}
                  disableRowSelectionOnClick
                  getRowId={(row) => row.id}
                  rowHeight={64}
                  columnHeaderHeight={44}
                  pageSizeOptions={[25, 50, 100]}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 25 },
                    },
                    sorting: {
                      sortModel: [{ field: 'quantity', sort: 'desc' }],
                    },
                  }}
                  slots={{
                    noRowsOverlay: EmptyRowsOverlay,
                    noResultsOverlay: EmptyRowsOverlay,
                  }}
                  sx={{
                    ...dataGridStyles,
                    '& .MuiDataGrid-columnHeaderTitle': {
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      letterSpacing: 0,
                      textTransform: 'uppercase',
                    },
                    '& .MuiDataGrid-cell': {
                      borderBottom: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                    },
                    '& .MuiDataGrid-row:hover': {
                      backgroundColor: 'var(--muted)',
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <aside className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Malzeme Kartı</CardTitle>
                <CardDescription>Seçili stok için hızlı referans.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">Stok Kodu</p>
                  <p className="mt-1 font-mono text-sm font-semibold text-foreground">{product?.code || '-'}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">Stok Adı</p>
                  <p className="mt-1 text-sm font-medium leading-5">{product?.name || '-'}</p>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground">Birim</p>
                    <p className="mt-1 text-sm font-semibold">{product?.unit || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground">Sorgu</p>
                    <p className="mt-1 text-sm font-semibold">{formatDate(date)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle>Operasyon Durumu</CardTitle>
                    <CardDescription>Hızlı stok sağlığı sinyali.</CardDescription>
                  </div>
                  <HealthIcon className={cn('size-5', health.className)} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className={cn('text-lg font-semibold', health.className)}>{health.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{health.description}</p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg border bg-muted p-2">
                    <p className="text-lg font-semibold tabular-nums">{stockHistory.length}</p>
                    <p className="text-[11px] text-muted-foreground">Ambar</p>
                  </div>
                  <div className="rounded-lg border bg-[var(--income-muted)] p-2">
                    <p className="text-lg font-semibold tabular-nums text-[var(--income)]">{positiveCount}</p>
                    <p className="text-[11px] text-muted-foreground">Pozitif</p>
                  </div>
                  <div className="rounded-lg border bg-[var(--expense-muted)] p-2">
                    <p className="text-lg font-semibold tabular-nums text-[var(--expense)]">{negativeCount}</p>
                    <p className="text-[11px] text-muted-foreground">Negatif</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>En Yoğun Noktalar</CardTitle>
                <CardDescription>Miktar etkisine göre ilk 5 ambar.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {topWarehouses.length > 0 ? (
                  topWarehouses.map((warehouse) => {
                    const width = maxAbsQuantity > 0 ? (Math.abs(warehouse.quantity) / maxAbsQuantity) * 100 : 0;

                    return (
                      <div key={warehouse.id} className="space-y-1.5">
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{warehouse.name}</p>
                            <p className="text-xs tabular-nums text-muted-foreground">{warehouse.code}</p>
                          </div>
                          <p className={cn('shrink-0 text-sm font-semibold tabular-nums', quantityTextClass(warehouse.quantity))}>
                            {formatQuantity(warehouse.quantity, product?.unit)}
                          </p>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <div
                            className={cn(
                              'h-full rounded-full',
                              warehouse.quantity > 0 ? 'bg-[var(--income)]' : 'bg-[var(--expense)]',
                            )}
                            style={{ width: `${Math.max(width, 4)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex items-center gap-3 rounded-lg border bg-muted p-3">
                    <Activity className="size-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Dağılım gösterecek stok hareketi yok.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Alert>
              <CalendarDays className="size-4" />
              <AlertTitle>Tarih hesabı</AlertTitle>
              <AlertDescription>
                Miktarlar seçilen günün 23:59:59 kapanışına göre hesaplanır.
              </AlertDescription>
            </Alert>
          </aside>
        </div>
      </div>
    </div>
  );
}
