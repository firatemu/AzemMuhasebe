'use client';

import { useCallback, useMemo, useState, type ReactNode } from 'react';
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from '@mui/x-data-grid';
import { trTR } from '@mui/x-data-grid/locales';
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Boxes,
  CalendarClock,
  ClipboardList,
  Eraser,
  FileText,
  PackageSearch,
  RefreshCw,
  Search,
  ShoppingCart,
  Undo2,
  Warehouse,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import MainLayout from '@/components/Layout/MainLayout';
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
import api from '@/lib/axios';
import { useDebounce } from '@/hooks/useDebounce';

type MovementType =
  | 'ENTRY'
  | 'EXIT'
  | 'SALE'
  | 'RETURN'
  | 'CANCELLATION_ENTRY'
  | 'CANCELLATION_EXIT'
  | 'COUNT'
  | 'COUNT_SURPLUS'
  | 'COUNT_SHORTAGE';

type MovementFilter = MovementType | 'ALL';

interface ProductOption {
  id: string;
  code: string;
  name: string;
  brand?: string;
  unit?: string;
}

interface InvoiceInfo {
  invoiceNo?: string;
  invoiceType?: string;
  status?: string;
  account?: {
    title?: string;
    code?: string;
  };
}

interface InvoiceItemInfo {
  id?: string;
  unitPrice?: number;
  discountRate?: number | null;
  discountAmount?: number | null;
  amount?: number;
  invoice?: InvoiceInfo | null;
}

interface WarehouseInfo {
  id?: string;
  code?: string;
  name?: string;
}

interface ProductMovement {
  id: string;
  productId: string;
  movementType: MovementType;
  quantity: number;
  unitPrice: number;
  notes?: string;
  createdAt: string;
  product: ProductOption;
  warehouse?: WarehouseInfo | null;
  invoiceItem?: InvoiceItemInfo | null;
  isReversed?: boolean;
  recordType?: string | null;
}

interface MovementResult {
  data: ProductMovement[];
  total: number;
  page: number;
  limit: number;
}

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
  tone?: 'default' | 'income' | 'expense' | 'warning' | 'info';
}

const MOVEMENT_OPTIONS: Array<{ value: MovementFilter; label: string }> = [
  { value: 'ALL', label: 'Tüm hareketler' },
  { value: 'ENTRY', label: 'Giriş' },
  { value: 'EXIT', label: 'Çıkış' },
  { value: 'SALE', label: 'Satış' },
  { value: 'RETURN', label: 'İade' },
  { value: 'CANCELLATION_ENTRY', label: 'İptal girişi' },
  { value: 'CANCELLATION_EXIT', label: 'İptal çıkışı' },
  { value: 'COUNT', label: 'Sayım' },
  { value: 'COUNT_SURPLUS', label: 'Sayım fazlası' },
  { value: 'COUNT_SHORTAGE', label: 'Sayım eksiği' },
];

const INCOMING_TYPES = new Set<MovementType>([
  'ENTRY',
  'RETURN',
  'CANCELLATION_ENTRY',
  'COUNT_SURPLUS',
]);

const OUTGOING_TYPES = new Set<MovementType>([
  'EXIT',
  'SALE',
  'CANCELLATION_EXIT',
  'COUNT_SHORTAGE',
]);

const statusLabels: Record<string, string> = {
  OPEN: 'Açık',
  APPROVED: 'Onaylandı',
  CLOSED: 'Kapalı',
  PARTIALLY_PAID: 'Kısmen Ödendi',
  CANCELLED: 'İptal',
  CANCELED: 'İptal',
  ACIK: 'Açık',
  ONAYLANDI: 'Onaylandı',
  KAPALI: 'Kapalı',
  KISMEN_ODENDI: 'Kısmen Ödendi',
  IPTAL: 'İptal',
};

function coerceNumber(value: unknown): number {
  const numeric = Number(value ?? 0);
  return Number.isFinite(numeric) ? numeric : 0;
}

function mapMovementType(value: unknown): MovementType {
  const normalized = String(value ?? '').toUpperCase();
  const legacyMap: Record<string, MovementType> = {
    GIRIS: 'ENTRY',
    CIKIS: 'EXIT',
    SATIS: 'SALE',
    IADE: 'RETURN',
    IPTAL_GIRIS: 'CANCELLATION_ENTRY',
    IPTAL_CIKIS: 'CANCELLATION_EXIT',
    SAYIM: 'COUNT',
  };

  if (legacyMap[normalized]) {
    return legacyMap[normalized];
  }

  if (MOVEMENT_OPTIONS.some((option) => option.value === normalized)) {
    return normalized as MovementType;
  }

  return 'ENTRY';
}

function mapProduct(raw: any): ProductOption {
  return {
    id: String(raw?.id ?? raw?.productId ?? raw?.stokId ?? ''),
    code: String(raw?.code ?? raw?.stokKodu ?? '-'),
    name: String(raw?.name ?? raw?.stokAdi ?? '-'),
    brand: raw?.brand ?? raw?.marka ?? undefined,
    unit: raw?.unit ?? raw?.birim ?? undefined,
  };
}

function normalizeMovement(raw: any): ProductMovement {
  const product = mapProduct(raw?.product ?? raw?.stok ?? raw);
  const invoiceItem = raw?.invoiceItem ?? raw?.faturaKalemi ?? null;
  const invoice = invoiceItem?.invoice ?? invoiceItem?.fatura ?? null;

  return {
    id: String(raw?.id),
    productId: String(raw?.productId ?? raw?.stokId ?? product.id),
    movementType: mapMovementType(raw?.movementType ?? raw?.hareketTipi),
    quantity: coerceNumber(raw?.quantity ?? raw?.miktar),
    unitPrice: coerceNumber(raw?.unitPrice ?? raw?.birimFiyat ?? invoiceItem?.unitPrice ?? invoiceItem?.birimFiyat),
    notes: raw?.notes ?? raw?.aciklama ?? undefined,
    createdAt: String(raw?.createdAt ?? raw?.date ?? new Date().toISOString()),
    product,
    warehouse: raw?.warehouse
      ? {
          id: raw.warehouse.id,
          code: raw.warehouse.code,
          name: raw.warehouse.name,
        }
      : null,
    invoiceItem: invoiceItem
      ? {
          id: invoiceItem.id,
          unitPrice: coerceNumber(invoiceItem.unitPrice ?? invoiceItem.birimFiyat),
          discountRate: invoiceItem.discountRate ?? invoiceItem.iskontoOrani ?? null,
          discountAmount: invoiceItem.discountAmount ?? invoiceItem.iskontoTutari ?? null,
          amount: coerceNumber(invoiceItem.amount ?? invoiceItem.tutar),
          invoice: invoice
            ? {
                invoiceNo: invoice.invoiceNo ?? invoice.faturaNo,
                invoiceType: invoice.invoiceType ?? invoice.faturaTipi,
                status: invoice.status ?? invoice.durum,
                account: invoice.account,
              }
            : null,
        }
      : null,
    isReversed: Boolean(raw?.isReversed),
    recordType: raw?.recordType ?? null,
  };
}

function movementDirection(type: MovementType): 'in' | 'out' | 'neutral' {
  if (INCOMING_TYPES.has(type)) return 'in';
  if (OUTGOING_TYPES.has(type)) return 'out';
  return 'neutral';
}

function movementEffect(movement: ProductMovement): number {
  const quantity = Math.abs(movement.quantity);
  const direction = movementDirection(movement.movementType);

  if (direction === 'in') return quantity;
  if (direction === 'out') return -quantity;
  return movement.quantity;
}

function movementLabel(type: MovementType, invoiceType?: string): string {
  const normalizedInvoiceType = String(invoiceType ?? '').toUpperCase();
  const labels: Record<MovementType, string> = {
    ENTRY: normalizedInvoiceType === 'PURCHASE' || normalizedInvoiceType === 'ALIS' ? 'Satınalma' : 'Giriş',
    EXIT: normalizedInvoiceType === 'PURCHASE_RETURN' || normalizedInvoiceType === 'ALIS_IADE' ? 'Alış iadesi' : 'Çıkış',
    SALE: 'Satış',
    RETURN: 'Satış iadesi',
    CANCELLATION_ENTRY: 'İptal girişi',
    CANCELLATION_EXIT: 'İptal çıkışı',
    COUNT: 'Sayım',
    COUNT_SURPLUS: 'Sayım fazlası',
    COUNT_SHORTAGE: 'Sayım eksiği',
  };

  return labels[type];
}

function movementTone(type: MovementType): 'income' | 'expense' | 'warning' | 'info' | 'default' {
  if (INCOMING_TYPES.has(type)) return type === 'RETURN' ? 'warning' : 'income';
  if (OUTGOING_TYPES.has(type)) return type === 'SALE' ? 'info' : 'expense';
  return 'default';
}

function toneClass(tone: MetricCardProps['tone'] = 'default'): string {
  const tones = {
    default: 'border-border bg-muted text-muted-foreground',
    income: 'border-[var(--income)] bg-[var(--income-muted)] text-[var(--income)]',
    expense: 'border-[var(--expense)] bg-[var(--expense-muted)] text-[var(--expense)]',
    warning: 'border-[var(--warning)] bg-[var(--warning-muted)] text-[var(--warning)]',
    info: 'border-[var(--info)] bg-[var(--info-muted)] text-[var(--info)]',
  };

  return tones[tone];
}

function statusTone(status?: string): string {
  const normalized = String(status ?? '').toUpperCase();

  if (normalized === 'CANCELLED' || normalized === 'CANCELED' || normalized === 'IPTAL') {
    return 'border-[var(--expense)] bg-[var(--expense-muted)] text-[var(--expense)]';
  }
  if (normalized === 'APPROVED' || normalized === 'ONAYLANDI' || normalized === 'CLOSED' || normalized === 'KAPALI') {
    return 'border-[var(--income)] bg-[var(--income-muted)] text-[var(--income)]';
  }
  if (normalized === 'OPEN' || normalized === 'ACIK' || normalized === 'PARTIALLY_PAID' || normalized === 'KISMEN_ODENDI') {
    return 'border-[var(--warning)] bg-[var(--warning-muted)] text-[var(--warning)]';
  }

  return 'border-border bg-muted text-muted-foreground';
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  return date.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatQuantity(value: number, unit?: string): string {
  const formatted = value.toLocaleString('tr-TR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return unit ? `${formatted} ${unit}` : formatted;
}

function formatMoney(value: number): string {
  return value.toLocaleString('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function movementIcon(type: MovementType): ReactNode {
  const direction = movementDirection(type);
  if (direction === 'in') return <ArrowUpRight className="size-3.5" />;
  if (direction === 'out') return <ArrowDownRight className="size-3.5" />;
  return <ClipboardList className="size-3.5" />;
}

function MetricCard({ title, value, description, icon, tone = 'default' }: MetricCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase text-muted-foreground">{title}</p>
            <p className="mt-2 truncate text-2xl font-semibold tabular-nums">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          </div>
          <div className={cn('flex size-10 shrink-0 items-center justify-center rounded-lg border', toneClass(tone))}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyRowsOverlay() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
      <div className="flex size-12 items-center justify-center rounded-lg border bg-muted">
        <PackageSearch className="size-5 text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm font-semibold">Hareket bulunamadı</p>
        <p className="mt-1 max-w-md text-xs text-muted-foreground">
          Filtreleri genişletin veya farklı bir malzeme seçin.
        </p>
      </div>
    </div>
  );
}

async function fetchProducts(search: string): Promise<ProductOption[]> {
  const response = await api.get('/products', {
    params: {
      search: search || undefined,
      limit: 100,
    },
  });

  const rows: any[] = Array.isArray(response.data?.data)
    ? response.data.data
    : Array.isArray(response.data)
      ? response.data
      : [];

  return rows.map(mapProduct).filter((product) => product.id);
}

async function fetchMovements(productId: string, movementType: MovementFilter): Promise<MovementResult> {
  const response = await api.get('/product-movements', {
    params: {
      page: 1,
      limit: 500,
      productId: productId || undefined,
      movementType: movementType === 'ALL' ? undefined : movementType,
    },
  });

  const rows: any[] = Array.isArray(response.data?.data)
    ? response.data.data
    : Array.isArray(response.data)
      ? response.data
      : [];

  return {
    data: rows.map(normalizeMovement),
    total: Number(response.data?.meta?.total ?? rows.length),
    page: Number(response.data?.meta?.page ?? 1),
    limit: Number(response.data?.meta?.limit ?? 500),
  };
}

export default function MalzemeHareketleriPage() {
  const [productSearch, setProductSearch] = useState('');
  const [tableSearch, setTableSearch] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [movementType, setMovementType] = useState<MovementFilter>('ALL');

  const debouncedProductSearch = useDebounce(productSearch, 350);

  const {
    data: products = [],
    isLoading: productsLoading,
  } = useQuery({
    queryKey: ['material-movement-products', debouncedProductSearch],
    queryFn: () => fetchProducts(debouncedProductSearch),
    staleTime: 2 * 60 * 1000,
  });

  const {
    data: movementResult,
    isLoading: movementsLoading,
    isFetching: movementsFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ['material-movements', selectedProductId, movementType],
    queryFn: () => fetchMovements(selectedProductId, movementType),
    staleTime: 45 * 1000,
  });

  const movements = movementResult?.data ?? [];

  const filteredMovements = useMemo(() => {
    const query = tableSearch.trim().toLocaleLowerCase('tr-TR');
    if (!query) return movements;

    return movements.filter((movement) => {
      const invoice = movement.invoiceItem?.invoice;
      const haystack = [
        movement.product.code,
        movement.product.name,
        movement.product.brand,
        movement.warehouse?.code,
        movement.warehouse?.name,
        invoice?.invoiceNo,
        invoice?.invoiceType,
        invoice?.status,
        invoice?.account?.title,
        movement.notes,
      ]
        .filter(Boolean)
        .join(' ')
        .toLocaleLowerCase('tr-TR');

      return haystack.includes(query);
    });
  }, [movements, tableSearch]);

  const stats = useMemo(() => {
    return filteredMovements.reduce(
      (acc, movement) => {
        const effect = movementEffect(movement);
        const amount = Math.abs(effect) * Math.abs(movement.unitPrice);

        if (effect > 0) {
          acc.incoming += effect;
        } else if (effect < 0) {
          acc.outgoing += Math.abs(effect);
        }

        acc.net += effect;
        acc.amount += amount;
        acc.count += 1;
        return acc;
      },
      { incoming: 0, outgoing: 0, net: 0, amount: 0, count: 0 },
    );
  }, [filteredMovements]);

  const topProducts = useMemo(() => {
    const productMap = new Map<string, { product: ProductOption; quantity: number; count: number }>();

    filteredMovements.forEach((movement) => {
      const current = productMap.get(movement.productId) ?? {
        product: movement.product,
        quantity: 0,
        count: 0,
      };
      current.quantity += Math.abs(movementEffect(movement));
      current.count += 1;
      productMap.set(movement.productId, current);
    });

    return [...productMap.values()]
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [filteredMovements]);

  const clearFilters = useCallback(() => {
    setProductSearch('');
    setTableSearch('');
    setSelectedProductId('');
    setMovementType('ALL');
  }, []);

  const columns = useMemo<GridColDef<ProductMovement>[]>(
    () => [
      {
        field: 'createdAt',
        headerName: 'Tarih',
        minWidth: 155,
        flex: 0.8,
        renderCell: (params: GridRenderCellParams<ProductMovement, string>) => (
          <div className="flex min-w-0 items-center gap-2 text-sm">
            <CalendarClock className="size-4 shrink-0 text-muted-foreground" />
            <span className="truncate text-muted-foreground">{formatDate(params.row.createdAt)}</span>
          </div>
        ),
      },
      {
        field: 'product',
        headerName: 'Malzeme',
        minWidth: 270,
        flex: 1.35,
        sortable: false,
        renderCell: (params: GridRenderCellParams<ProductMovement>) => (
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
              <Boxes className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{params.row.product.name}</p>
              <p className="mt-0.5 truncate text-xs font-medium tabular-nums text-muted-foreground">
                {params.row.product.code}
                {params.row.product.brand ? ` · ${params.row.product.brand}` : ''}
              </p>
            </div>
          </div>
        ),
      },
      {
        field: 'movementType',
        headerName: 'Hareket',
        minWidth: 160,
        flex: 0.85,
        renderCell: (params: GridRenderCellParams<ProductMovement, MovementType>) => {
          const tone = movementTone(params.row.movementType);
          return (
            <Badge variant="outline" className={cn('h-6 rounded-md', toneClass(tone))}>
              {movementIcon(params.row.movementType)}
              {movementLabel(params.row.movementType, params.row.invoiceItem?.invoice?.invoiceType)}
            </Badge>
          );
        },
      },
      {
        field: 'warehouse',
        headerName: 'Ambar',
        minWidth: 175,
        flex: 0.9,
        sortable: false,
        renderCell: (params: GridRenderCellParams<ProductMovement>) => (
          <div className="flex min-w-0 items-center gap-2">
            <Warehouse className="size-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{params.row.warehouse?.name ?? '-'}</p>
              <p className="truncate text-xs tabular-nums text-muted-foreground">{params.row.warehouse?.code ?? ''}</p>
            </div>
          </div>
        ),
      },
      {
        field: 'quantity',
        headerName: 'Miktar',
        minWidth: 150,
        flex: 0.75,
        align: 'right',
        headerAlign: 'right',
        renderCell: (params: GridRenderCellParams<ProductMovement, number>) => {
          const effect = movementEffect(params.row);
          const isPositive = effect > 0;
          const isNegative = effect < 0;

          return (
            <div className="flex w-full items-center justify-end gap-2">
              {isPositive ? (
                <ArrowUpRight className="size-4 text-[var(--income)]" />
              ) : isNegative ? (
                <ArrowDownRight className="size-4 text-[var(--expense)]" />
              ) : (
                <Activity className="size-4 text-muted-foreground" />
              )}
              <span
                className={cn(
                  'font-semibold tabular-nums',
                  isPositive && 'text-[var(--income)]',
                  isNegative && 'text-[var(--expense)]',
                  !isPositive && !isNegative && 'text-muted-foreground',
                )}
              >
                {effect > 0 ? '+' : ''}
                {formatQuantity(effect, params.row.product.unit)}
              </span>
            </div>
          );
        },
      },
      {
        field: 'unitPrice',
        headerName: 'Birim',
        minWidth: 130,
        flex: 0.65,
        align: 'right',
        headerAlign: 'right',
        renderCell: (params: GridRenderCellParams<ProductMovement, number>) => (
          <span className="w-full text-right text-sm tabular-nums text-muted-foreground">
            {formatMoney(params.row.unitPrice)}
          </span>
        ),
      },
      {
        field: 'amount',
        headerName: 'Tutar',
        minWidth: 140,
        flex: 0.7,
        align: 'right',
        headerAlign: 'right',
        sortable: false,
        renderCell: (params: GridRenderCellParams<ProductMovement>) => (
          <span className="w-full text-right text-sm font-semibold tabular-nums">
            {formatMoney(Math.abs(movementEffect(params.row)) * Math.abs(params.row.unitPrice))}
          </span>
        ),
      },
      {
        field: 'invoice',
        headerName: 'Belge',
        minWidth: 220,
        flex: 1,
        sortable: false,
        renderCell: (params: GridRenderCellParams<ProductMovement>) => {
          const invoice = params.row.invoiceItem?.invoice;
          return (
            <div className="min-w-0">
              <div className="flex min-w-0 items-center gap-2">
                <FileText className="size-4 shrink-0 text-muted-foreground" />
                <span className="truncate text-sm font-medium">{invoice?.invoiceNo ?? '-'}</span>
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {invoice?.account?.title ?? params.row.notes ?? '-'}
              </p>
            </div>
          );
        },
      },
      {
        field: 'status',
        headerName: 'Durum',
        minWidth: 130,
        flex: 0.65,
        sortable: false,
        renderCell: (params: GridRenderCellParams<ProductMovement>) => {
          const status = params.row.invoiceItem?.invoice?.status;
          return (
            <Badge variant="outline" className={cn('h-6 rounded-md', statusTone(status))}>
              {statusLabels[String(status ?? '').toUpperCase()] ?? status ?? 'Kayıt'}
            </Badge>
          );
        },
      },
    ],
    [],
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 border-b pb-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span>Stok</span>
              <span>/</span>
              <span className="text-foreground">Malzeme Hareketleri</span>
            </div>
            <div className="mt-3 flex items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border bg-card shadow-sm">
                <BarChart3 className="size-5 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl font-semibold">Malzeme Hareketleri</h1>
                <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
                  Onaylı fatura ve sayım kaynaklı stok etkileri.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="h-7 rounded-md px-2.5">
              {movementResult?.total ?? 0} kayıt
            </Badge>
            <Button type="button" variant="outline" onClick={() => void refetch()} disabled={movementsFetching}>
              <RefreshCw className={cn('size-4', movementsFetching && 'animate-spin')} />
              Yenile
            </Button>
          </div>
        </div>

        {error ? (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>Hareketler alınamadı</AlertTitle>
            <AlertDescription>
              Backend bağlantısı veya yetki bilgisi kontrol edilmeli. Sayfayı yenileyip tekrar deneyin.
            </AlertDescription>
          </Alert>
        ) : null}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Net Etki"
            value={formatQuantity(stats.net)}
            description="Giriş ve çıkış sonrası görünüm"
            icon={<Activity className="size-4" />}
            tone={stats.net > 0 ? 'income' : stats.net < 0 ? 'expense' : 'default'}
          />
          <MetricCard
            title="Toplam Giriş"
            value={formatQuantity(stats.incoming)}
            description="Stoka eklenen miktar"
            icon={<ArrowUpRight className="size-4" />}
            tone="income"
          />
          <MetricCard
            title="Toplam Çıkış"
            value={formatQuantity(stats.outgoing)}
            description="Stoktan düşen miktar"
            icon={<ArrowDownRight className="size-4" />}
            tone="expense"
          />
          <MetricCard
            title="Hareket Tutarı"
            value={formatMoney(stats.amount)}
            description={`${stats.count} hareket üzerinden`}
            icon={<ShoppingCart className="size-4" />}
            tone="info"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <Card className="overflow-hidden">
            <CardHeader className="border-b">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <CardTitle>Hareket Akışı</CardTitle>
                    <CardDescription>Güncel product-movements kayıtları.</CardDescription>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={tableSearch}
                        onChange={(event) => setTableSearch(event.target.value)}
                        placeholder="Tabloda ara..."
                        className="w-full pl-8 sm:w-[220px]"
                      />
                    </div>
                    <Button type="button" variant="outline" onClick={clearFilters}>
                      <Eraser className="size-4" />
                      Temizle
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_220px_180px]">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground" htmlFor="product-search">
                      Malzeme arama
                    </label>
                    <div className="relative">
                      <PackageSearch className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="product-search"
                        value={productSearch}
                        onChange={(event) => setProductSearch(event.target.value)}
                        placeholder="Kod veya ad ile ara..."
                        className="pl-8"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground" htmlFor="product-select">
                      Malzeme
                    </label>
                    <select
                      id="product-select"
                      value={selectedProductId}
                      onChange={(event) => setSelectedProductId(event.target.value)}
                      className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      <option value="">{productsLoading ? 'Yükleniyor...' : 'Tüm malzemeler'}</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.code} - {product.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground" htmlFor="movement-type">
                      Hareket tipi
                    </label>
                    <select
                      id="movement-type"
                      value={movementType}
                      onChange={(event) => setMovementType(event.target.value as MovementFilter)}
                      className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      {MOVEMENT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="h-[640px]">
                <DataGrid<ProductMovement>
                  rows={filteredMovements}
                  columns={columns}
                  loading={movementsLoading || movementsFetching}
                  localeText={trTR.components.MuiDataGrid.defaultProps.localeText}
                  disableRowSelectionOnClick
                  getRowId={(row) => row.id}
                  rowHeight={68}
                  columnHeaderHeight={44}
                  pageSizeOptions={[25, 50, 100]}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 25 },
                    },
                    sorting: {
                      sortModel: [{ field: 'createdAt', sort: 'desc' }],
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
                <CardTitle>Filtre Özeti</CardTitle>
                <CardDescription>Aktif görünüm bilgisi.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">Hareket Tipi</p>
                  <p className="mt-1 text-sm font-semibold">
                    {MOVEMENT_OPTIONS.find((option) => option.value === movementType)?.label ?? 'Tüm hareketler'}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">Malzeme</p>
                  <p className="mt-1 text-sm font-semibold">
                    {products.find((product) => product.id === selectedProductId)?.code ?? 'Tüm malzemeler'}
                  </p>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border bg-muted p-3">
                    <p className="text-lg font-semibold tabular-nums">{filteredMovements.length}</p>
                    <p className="text-[11px] text-muted-foreground">Görünen</p>
                  </div>
                  <div className="rounded-lg border bg-muted p-3">
                    <p className="text-lg font-semibold tabular-nums">{movementResult?.total ?? 0}</p>
                    <p className="text-[11px] text-muted-foreground">Toplam</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Yoğun Malzemeler</CardTitle>
                <CardDescription>Miktar etkisine göre ilk 5.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {topProducts.length > 0 ? (
                  topProducts.map((item) => (
                    <div key={item.product.id} className="space-y-1.5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{item.product.name}</p>
                          <p className="text-xs tabular-nums text-muted-foreground">{item.product.code}</p>
                        </div>
                        <p className="shrink-0 text-sm font-semibold tabular-nums">
                          {formatQuantity(item.quantity, item.product.unit)}
                        </p>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-[var(--info)]"
                          style={{
                            width: `${Math.max(
                              8,
                              Math.min(100, (item.quantity / Math.max(topProducts[0]?.quantity ?? 1, 1)) * 100),
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center gap-3 rounded-lg border bg-muted p-3">
                    <Activity className="size-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Dağılım gösterecek hareket yok.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Alert>
              <Undo2 className="size-4" />
              <AlertTitle>Kural Notu</AlertTitle>
              <AlertDescription>
                Satış ve alış faturası iptallerinde yeni stok hareketi oluşmaz; iade iptalleri ters hareket olarak görünür.
              </AlertDescription>
            </Alert>
          </aside>
        </div>
      </div>
    </MainLayout>
  );
}
