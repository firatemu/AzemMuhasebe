'use client';

import {
  Archive,
  Banknote,
  Boxes,
  ChevronRight,
  Download,
  Edit3,
  GitCompareArrows,
  History,
  PackagePlus,
  RefreshCw,
  Search,
  Trash2,
  Warehouse,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import * as XLSX from 'xlsx';
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from '@mui/x-data-grid';
import { trTR } from '@mui/x-data-grid/locales';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { dataGridStyles } from '@/lib/datagrid-styles';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';
import {
  defaultMaterialFormValues,
  type MaterialFormValues,
} from '@/schemas/material.schema';
import {
  createProduct,
  deleteProduct,
  getProductDeleteAvailability,
  listBrands,
  listCategories,
  listEquivalentProducts,
  listLocations,
  listProductMovements,
  listProducts,
  listUnitSets,
  mapProductToMaterial,
  previewNextProductCode,
  updateProduct,
} from '@/services/product.service';
import type {
  DeleteAvailability,
  LocationOption,
  Material,
  ProductMovement,
  ProductPayload,
  UnitSetOption,
} from '@/types/material';
import { MalzemeFormDialog } from './MalzemeFormDialog';

const ALL_FILTER_VALUE = '__all__';

function readErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { message?: unknown } } }).response;
    if (typeof response?.data?.message === 'string') return response.data.message;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

function cleanText(value: string | undefined): string | undefined {
  const cleaned = value?.trim();
  return cleaned ? cleaned : undefined;
}

function buildProductPayload(values: MaterialFormValues): ProductPayload {
  return {
    code: cleanText(values.stokKodu),
    name: values.stokAdi.trim(),
    barcode: cleanText(values.barkod),
    description: cleanText(values.aciklama),
    unit: values.birim.trim() || 'Adet',
    unitId: cleanText(values.birimId),
    mainCategory: cleanText(values.anaKategori),
    subCategory: cleanText(values.altKategori),
    category: cleanText(values.anaKategori),
    brand: cleanText(values.marka),
    model: cleanText(values.model),
    size: cleanText(values.olcu),
    shelf: cleanText(values.raf),
    supplierCode: cleanText(values.tedarikciKodu),
    purchasePrice: Number(values.alisFiyati ?? 0),
    salePrice: Number(values.satisFiyati ?? 0),
    vatRate: Number(values.vatRate ?? 20),
    criticalQty: Number(values.criticalQty ?? 0),
    weight: values.weight,
    weightUnit: cleanText(values.weightUnit),
    dimensions: cleanText(values.dimensions),
    warrantyMonths: values.warrantyMonths,
    internalNote: cleanText(values.internalNote),
    minOrderQty: values.minOrderQty,
  };
}

function materialToFormValues(material: Material): MaterialFormValues {
  return {
    ...defaultMaterialFormValues,
    stokKodu: material.stokKodu,
    stokAdi: material.stokAdi,
    barkod: material.barkod,
    aciklama: material.aciklama,
    marka: material.marka,
    model: material.model,
    anaKategori: material.anaKategori,
    altKategori: material.altKategori,
    birim: material.birim,
    birimId: material.birimId,
    olcu: material.olcu,
    raf: material.raf,
    tedarikciKodu: material.tedarikciKodu,
    alisFiyati: material.alisFiyati,
    satisFiyati: material.satisFiyati,
    vatRate: material.vatRate,
    criticalQty: material.criticalQty,
    weight: material.weight,
    weightUnit: material.weightUnit,
    dimensions: material.dimensions,
    warrantyMonths: material.warrantyMonths,
    internalNote: material.internalNote,
    minOrderQty: material.minOrderQty,
  };
}

function createInitialValues(nextCode: string, unitSets: UnitSetOption[]): MaterialFormValues {
  const firstUnit = unitSets.find((set) => (set.units ?? []).length > 0)?.units?.[0];
  return {
    ...defaultMaterialFormValues,
    stokKodu: nextCode,
    birim: firstUnit?.name ?? 'Adet',
    birimId: firstUnit?.id ?? '',
  };
}

// ─── Metric Card ───────────────────────────────────────────────────────────────
const TONE_COLORS: Record<string, { color: string; muted: string; border: string }> = {
  neutral: { color: 'var(--muted-foreground)', muted: 'var(--muted)', border: 'var(--muted-foreground)' },
  income:  { color: 'var(--income)',            muted: 'var(--income-muted)',  border: 'var(--income)' },
  expense: { color: 'var(--expense)',           muted: 'var(--expense-muted)', border: 'var(--expense)' },
  warning: { color: 'var(--warning)',           muted: 'var(--warning-muted)', border: 'var(--warning)' },
  info:    { color: 'var(--info)',              muted: 'var(--info-muted)',    border: 'var(--info)' },
};

function MetricCard({
  label,
  value,
  tone = 'neutral',
  icon,
}: {
  label: string;
  value: string | number;
  tone?: 'neutral' | 'income' | 'expense' | 'warning' | 'info';
  icon: ReactNode;
}) {
  const { color, muted, border } = TONE_COLORS[tone] ?? TONE_COLORS.neutral;

  return (
    <div
      className="group relative flex flex-col justify-between overflow-hidden rounded-xl border bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
      style={{ borderLeftColor: border, borderLeftWidth: '4px' }}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{label}</p>
        <div
          className="flex size-9 items-center justify-center rounded-lg border transition-all duration-300 group-hover:scale-105"
          style={{ backgroundColor: muted, color, borderColor: border }}
        >
          {icon}
        </div>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight tabular-nums" style={{ color: 'var(--foreground)' }}>{value}</p>
    </div>
  );
}

// ─── Row Actions ───────────────────────────────────────────────────────────────
function RowActions({
  row,
  onWarehouse,
  onMovements,
  onEquivalent,
  onEdit,
  onDelete,
}: {
  row: Material;
  onWarehouse: (row: Material) => void;
  onMovements: (row: Material) => void;
  onEquivalent: (row: Material) => void;
  onEdit: (row: Material) => void;
  onDelete: (row: Material) => void;
}) {
  const stop = (event: MouseEvent<HTMLButtonElement>, action: (row: Material) => void) => {
    event.stopPropagation();
    action(row);
  };

  return (
    <div className="flex h-full items-center justify-end gap-1.5 pr-2">
      <Button type="button" variant="ghost" className="size-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-all duration-200" title="Ambar Toplamları" onClick={(e) => stop(e, onWarehouse)}>
        <Warehouse className="size-4" />
      </Button>
      <Button type="button" variant="ghost" className="size-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-all duration-200" title="Hareketler" onClick={(e) => stop(e, onMovements)}>
        <History className="size-4" />
      </Button>
      <Button type="button" variant="ghost" className="size-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-all duration-200" title="Eşdeğerler" onClick={(e) => stop(e, onEquivalent)}>
        <GitCompareArrows className="size-4" />
      </Button>
      <Button type="button" variant="ghost" className="size-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-all duration-200" title="Düzenle" onClick={(e) => stop(e, onEdit)}>
        <Edit3 className="size-4" />
      </Button>
      <Button type="button" variant="ghost" className="size-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-all duration-200" title="Sil" onClick={(e) => stop(e, onDelete)}>
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}

// ─── Empty Overlay ─────────────────────────────────────────────────────────────
function NoRowsOverlay() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-center p-8">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Boxes className="size-6" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold">Malzeme bulunamadı</p>
        <p className="max-w-sm text-xs text-muted-foreground">Filtre kriterlerine uygun malzeme kaydı bulunamadı.</p>
      </div>
    </div>
  );
}

// ─── Miktar Badge ──────────────────────────────────────────────────────────────
function QtyBadge({ value, criticalQty, birim }: { value: number; criticalQty: number; birim: string }) {
  const isOut = value <= 0;
  const isCritical = criticalQty > 0 && value <= criticalQty;

  let bgColor = 'var(--income-muted)';
  let textColor = 'var(--income)';
  let dotColor = 'var(--income)';
  let borderColor = 'var(--income)';

  if (isOut) {
    bgColor = 'var(--expense-muted)';
    textColor = 'var(--expense)';
    dotColor = 'var(--expense)';
    borderColor = 'var(--expense)';
  } else if (isCritical) {
    bgColor = 'var(--warning-muted)';
    textColor = 'var(--warning)';
    dotColor = 'var(--warning)';
    borderColor = 'var(--warning)';
  }

  return (
    <div className="flex h-full items-center justify-end">
      <span
        className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold tabular-nums"
        style={{ backgroundColor: bgColor, color: textColor, borderColor }}
      >
        <span className="size-1.5 rounded-full animate-pulse shrink-0" style={{ backgroundColor: dotColor }} />
        {value.toLocaleString('tr-TR')} {birim}
      </span>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export function MaterialListClient() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [materials, setMaterials] = useState<Material[]>([]);
  const [remoteTotal, setRemoteTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [stockState, setStockState] = useState<'all' | 'inStock' | 'outOfStock' | 'critical'>('all');
  const [categories, setCategories] = useState<Record<string, string[]>>({});
  const [brands, setBrands] = useState<string[]>([]);
  const [locations, setLocations] = useState<LocationOption[]>([]);
  const [unitSets, setUnitSets] = useState<UnitSetOption[]>([]);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [formInitialValues, setFormInitialValues] = useState<MaterialFormValues>(defaultMaterialFormValues);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [canEditUnit, setCanEditUnit] = useState(true);
  const [savingForm, setSavingForm] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Material | null>(null);
  const [deleteAvailability, setDeleteAvailability] = useState<DeleteAvailability | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [movementOpen, setMovementOpen] = useState(false);
  const [movementMaterial, setMovementMaterial] = useState<Material | null>(null);
  const [movementRows, setMovementRows] = useState<ProductMovement[]>([]);
  const [movementLoading, setMovementLoading] = useState(false);
  const [movementTotal, setMovementTotal] = useState(0);

  const [equivalentOpen, setEquivalentOpen] = useState(false);
  const [equivalentMaterial, setEquivalentMaterial] = useState<Material | null>(null);
  const [equivalentRows, setEquivalentRows] = useState<Material[]>([]);
  const [equivalentLoading, setEquivalentLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 400);

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    [],
  );

  const fetchReferences = useCallback(async () => {
    const [categoryMap, brandList, locationList, unitSetList] = await Promise.all([
      listCategories().catch(() => ({})),
      listBrands().catch(() => []),
      listLocations().catch(() => []),
      listUnitSets().catch(() => []),
    ]);
    setCategories(categoryMap);
    setBrands(brandList);
    setLocations(locationList);
    setUnitSets(unitSetList);
  }, []);

  const fetchMaterials = useCallback(async () => {
    setLoading(true);
    try {
      const response = await listProducts({
        page: 1,
        limit: 250,
        search: debouncedSearch || undefined,
      });
      const mapped = response.data.map(mapProductToMaterial);
      setMaterials(mapped);
      setRemoteTotal(response.meta?.total ?? mapped.length);
    } catch (error) {
      setMaterials([]);
      enqueueSnackbar(readErrorMessage(error, 'Malzemeler yüklenemedi'), { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, enqueueSnackbar]);

  useEffect(() => { void fetchReferences(); }, [fetchReferences]);
  useEffect(() => { void fetchMaterials(); }, [fetchMaterials]);
  useEffect(() => { setSelectedSubCategory(''); }, [selectedCategory]);

  const categoryOptions = useMemo(() => Object.keys(categories).filter(Boolean).sort((a, b) => a.localeCompare(b, 'tr')), [categories]);

  const subCategoryOptions = useMemo(() => {
    if (!selectedCategory) return [];
    return (categories[selectedCategory] ?? []).filter(Boolean).sort((a, b) => a.localeCompare(b, 'tr'));
  }, [categories, selectedCategory]);

  const brandOptions = useMemo(() => {
    const materialBrands = materials.map((m) => m.marka).filter(Boolean);
    return Array.from(new Set([...brands, ...materialBrands])).sort((a, b) => a.localeCompare(b, 'tr'));
  }, [brands, materials]);

  const filteredMaterials = useMemo(() => {
    return materials.filter((m) => {
      const qty = m.miktar ?? 0;
      const categoryMatch = selectedCategory ? m.anaKategori === selectedCategory : true;
      const subCategoryMatch = selectedSubCategory ? m.altKategori === selectedSubCategory : true;
      const brandMatch = selectedBrand ? m.marka === selectedBrand : true;
      const stockMatch =
        stockState === 'inStock' ? qty > 0 :
        stockState === 'outOfStock' ? qty <= 0 :
        stockState === 'critical' ? m.criticalQty > 0 && qty <= m.criticalQty :
        true;
      return categoryMatch && subCategoryMatch && brandMatch && stockMatch;
    });
  }, [materials, selectedBrand, selectedCategory, selectedSubCategory, stockState]);

  const totalQuantity = useMemo(() => filteredMaterials.reduce((s, m) => s + (m.miktar ?? 0), 0), [filteredMaterials]);
  const totalValue = useMemo(() => filteredMaterials.reduce((s, m) => s + (m.miktar ?? 0) * (m.alisFiyati ?? 0), 0), [filteredMaterials]);
  const inStockCount = useMemo(() => filteredMaterials.filter((m) => m.miktar > 0).length, [filteredMaterials]);
  const criticalCount = useMemo(() => filteredMaterials.filter((m) => m.criticalQty > 0 && m.miktar <= m.criticalQty).length, [filteredMaterials]);

  const openCreateDialog = useCallback(async () => {
    let nextCode = '';
    try { nextCode = await previewNextProductCode(); } catch { nextCode = ''; }
    setEditingMaterial(null);
    setCanEditUnit(true);
    setFormMode('create');
    setFormInitialValues(createInitialValues(nextCode, unitSets));
    setFormOpen(true);
  }, [unitSets]);

  const openEditDialog = useCallback(async (material: Material) => {
    setEditingMaterial(material);
    setFormMode('edit');
    setFormInitialValues(materialToFormValues(material));
    try {
      const availability = await getProductDeleteAvailability(material.id);
      setCanEditUnit(availability.canDelete);
    } catch {
      setCanEditUnit(false);
    }
    setFormOpen(true);
  }, []);

  const closeFormDialog = useCallback(() => {
    if (savingForm) return;
    setFormOpen(false);
    setEditingMaterial(null);
  }, [savingForm]);

  const submitForm = useCallback(async (values: MaterialFormValues) => {
    const duplicate = values.stokKodu
      ? materials.find((m) => m.stokKodu.toLocaleLowerCase('tr-TR') === values.stokKodu?.toLocaleLowerCase('tr-TR') && m.id !== editingMaterial?.id)
      : null;
    if (duplicate) {
      enqueueSnackbar(`Bu stok kodu kullanılıyor: ${duplicate.stokAdi}`, { variant: 'warning' });
      return;
    }
    setSavingForm(true);
    try {
      const payload = buildProductPayload(values);
      if (editingMaterial) {
        await updateProduct(editingMaterial.id, payload);
        enqueueSnackbar('Malzeme güncellendi', { variant: 'success' });
      } else {
        await createProduct(payload);
        enqueueSnackbar('Malzeme oluşturuldu', { variant: 'success' });
      }
      setFormOpen(false);
      setEditingMaterial(null);
      await fetchMaterials();
    } catch (error) {
      enqueueSnackbar(readErrorMessage(error, 'Malzeme kaydedilemedi'), { variant: 'error' });
    } finally {
      setSavingForm(false);
    }
  }, [editingMaterial, enqueueSnackbar, fetchMaterials, materials]);

  const askDelete = useCallback(async (material: Material) => {
    try {
      const availability = await getProductDeleteAvailability(material.id);
      if (!availability.canDelete) {
        enqueueSnackbar(`Bu malzeme silinemez. ${availability.toplamHareketSayisi ?? 0} işlemde kullanılmış.`, { variant: 'error' });
        return;
      }
      setDeleteAvailability(availability);
      setDeleteTarget(material);
    } catch (error) {
      enqueueSnackbar(readErrorMessage(error, 'Silme kontrolü yapılamadı'), { variant: 'error' });
    }
  }, [enqueueSnackbar]);

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProduct(deleteTarget.id);
      enqueueSnackbar('Malzeme silindi', { variant: 'success' });
      setDeleteTarget(null);
      setDeleteAvailability(null);
      await fetchMaterials();
    } catch (error) {
      enqueueSnackbar(readErrorMessage(error, 'Malzeme silinemedi'), { variant: 'error' });
    } finally {
      setDeleting(false);
    }
  }, [deleteTarget, enqueueSnackbar, fetchMaterials]);

  const openMovements = useCallback(async (material: Material) => {
    setMovementMaterial(material);
    setMovementOpen(true);
    setMovementLoading(true);
    setMovementRows([]);
    try {
      const result = await listProductMovements(material.id);
      setMovementRows(result.data);
      setMovementTotal(result.total);
    } catch (error) {
      enqueueSnackbar(readErrorMessage(error, 'Hareketler yüklenemedi'), { variant: 'error' });
    } finally {
      setMovementLoading(false);
    }
  }, [enqueueSnackbar]);

  const openEquivalent = useCallback(async (material: Material) => {
    setEquivalentMaterial(material);
    setEquivalentOpen(true);
    setEquivalentRows([]);
    setEquivalentLoading(true);
    try {
      const rows = await listEquivalentProducts(material.id);
      setEquivalentRows(rows);
    } catch (error) {
      setEquivalentRows([]);
      enqueueSnackbar(readErrorMessage(error, 'Eşdeğer ürünler yüklenemedi'), { variant: 'error' });
    } finally {
      setEquivalentLoading(false);
    }
  }, [enqueueSnackbar]);

  const exportExcel = useCallback(() => {
    if (filteredMaterials.length === 0) {
      enqueueSnackbar('Excel çıktısı için listede malzeme yok', { variant: 'warning' });
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(
      filteredMaterials.map((m) => ({
        'Stok Kodu': m.stokKodu,
        'Stok Adı': m.stokAdi,
        Marka: m.marka,
        Kategori: m.anaKategori,
        'Alt Kategori': m.altKategori,
        Raf: m.raf,
        Miktar: m.miktar,
        Birim: m.birim,
        'Alış Fiyatı': m.alisFiyati,
        'Satış Fiyatı': m.satisFiyati,
      })),
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Malzeme Listesi');
    const timestamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');
    XLSX.writeFile(workbook, `malzeme-listesi-${timestamp}.xlsx`);
  }, [enqueueSnackbar, filteredMaterials]);

  const columns = useMemo<GridColDef<Material>[]>(
    () => [
      {
        field: 'stokKodu',
        headerName: 'Stok Kodu',
        minWidth: 150,
        flex: 1,
        renderCell: (params: GridRenderCellParams<Material, string>) => (
          <div className="flex h-full min-w-0 items-center">
            <span className="truncate font-mono text-xs font-semibold px-2 py-1 bg-muted rounded-md" style={{ color: 'var(--primary)' }}>
              {params.value}
            </span>
          </div>
        ),
      },
      {
        field: 'stokAdi',
        headerName: 'Malzeme',
        minWidth: 240,
        flex: 1.6,
        renderCell: (params: GridRenderCellParams<Material, string>) => (
          <div className="flex h-full min-w-0 flex-col justify-center gap-0.5">
            <span className="truncate text-sm font-semibold">{params.value}</span>
            {params.row.barkod ? (
              <span className="truncate text-xs font-mono text-muted-foreground">{params.row.barkod}</span>
            ) : null}
          </div>
        ),
      },
      {
        field: 'marka',
        headerName: 'Marka',
        minWidth: 130,
        flex: 0.8,
        renderCell: (params: GridRenderCellParams<Material, string>) => (
          <div className="flex h-full items-center">
            {params.value ? (
              <Badge variant="outline" className="font-normal text-xs">{params.value}</Badge>
            ) : (
              <span className="text-muted-foreground text-xs">-</span>
            )}
          </div>
        ),
      },
      {
        field: 'anaKategori',
        headerName: 'Kategori',
        minWidth: 180,
        flex: 1,
        renderCell: (params: GridRenderCellParams<Material, string>) => (
          <div className="flex h-full min-w-0 flex-col justify-center gap-0.5">
            <span className="truncate text-xs font-medium">{params.value || '-'}</span>
            {params.row.altKategori ? (
              <span className="truncate text-xs text-muted-foreground">{params.row.altKategori}</span>
            ) : null}
          </div>
        ),
      },
      {
        field: 'miktar',
        headerName: 'Miktar',
        width: 150,
        align: 'right',
        headerAlign: 'right',
        renderCell: (params: GridRenderCellParams<Material, number>) => (
          <QtyBadge value={Number(params.value ?? 0)} criticalQty={params.row.criticalQty} birim={params.row.birim} />
        ),
      },
      {
        field: 'alisFiyati',
        headerName: 'Alış',
        width: 130,
        align: 'right',
        headerAlign: 'right',
        renderCell: (params: GridRenderCellParams<Material, number>) => (
          <div className="flex h-full items-center justify-end font-medium tabular-nums text-muted-foreground text-xs">
            {currencyFormatter.format(Number(params.value ?? 0))}
          </div>
        ),
      },
      {
        field: 'satisFiyati',
        headerName: 'Satış',
        width: 130,
        align: 'right',
        headerAlign: 'right',
        renderCell: (params: GridRenderCellParams<Material, number>) => (
          <div className="flex h-full items-center justify-end font-semibold tabular-nums text-sm" style={{ color: 'var(--primary)' }}>
            {currencyFormatter.format(Number(params.value ?? 0))}
          </div>
        ),
      },
      {
        field: 'raf',
        headerName: 'Raf',
        width: 110,
        renderCell: (params: GridRenderCellParams<Material, string>) => (
          <div className="flex h-full items-center">
            <span className="truncate text-sm text-muted-foreground">{params.value || '-'}</span>
          </div>
        ),
      },
      {
        field: 'actions',
        headerName: 'İşlemler',
        width: 220,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params: GridRenderCellParams<Material>) => (
          <RowActions
            row={params.row}
            onWarehouse={(row) => router.push(`/stock/${row.id}/ambar-toplamlari`)}
            onMovements={openMovements}
            onEquivalent={openEquivalent}
            onEdit={openEditDialog}
            onDelete={askDelete}
          />
        ),
      },
    ],
    [askDelete, currencyFormatter, openEditDialog, openEquivalent, openMovements, router],
  );

  const movementColumns = useMemo<GridColDef<ProductMovement>[]>(
    () => [
      {
        field: 'createdAt',
        headerName: 'Tarih',
        width: 180,
        renderCell: (params: GridRenderCellParams<ProductMovement, string>) =>
          params.value ? new Date(params.value).toLocaleString('tr-TR') : '-',
      },
      {
        field: 'document',
        headerName: 'Fiş / Fatura',
        minWidth: 170,
        flex: 1,
        renderCell: (params: GridRenderCellParams<ProductMovement>) =>
          params.row.invoiceItem?.invoice?.invoiceNo ?? params.row.stockMove?.moveNo ?? '-',
      },
      {
        field: 'place',
        headerName: 'Cari / İşlem Yeri',
        minWidth: 220,
        flex: 1.4,
        renderCell: (params: GridRenderCellParams<ProductMovement>) =>
          params.row.invoiceItem?.invoice?.account?.title ?? params.row.stockMove?.targetWarehouse?.name ?? '-',
      },
      {
        field: 'movementType',
        headerName: 'Tip',
        width: 140,
        renderCell: (params: GridRenderCellParams<ProductMovement, string>) => (
          <Badge variant="outline">{params.value ?? '-'}</Badge>
        ),
      },
      {
        field: 'quantity',
        headerName: 'Miktar',
        width: 130,
        align: 'right',
        headerAlign: 'right',
        renderCell: (params: GridRenderCellParams<ProductMovement, number>) => (
          <span className="font-semibold tabular-nums">
            {Number(params.value ?? 0).toLocaleString('tr-TR')} {movementMaterial?.birim ?? ''}
          </span>
        ),
      },
    ],
    [movementMaterial?.birim],
  );

  const isFiltered = search !== '' || stockState !== 'all' || selectedCategory !== '' || selectedSubCategory !== '' || selectedBrand !== '';

  const resetAllFilters = useCallback(() => {
    setSearch('');
    setStockState('all');
    setSelectedCategory('');
    setSelectedSubCategory('');
    setSelectedBrand('');
  }, []);

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* ── Sayfa Başlığı ── */}
      <div className="flex flex-col gap-4 pb-6 md:flex-row md:items-center md:justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <span>Stok Yönetimi</span>
            <ChevronRight className="size-3" />
            <span>Malzeme Listesi</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Malzeme Listesi</h1>
          <p className="text-sm text-muted-foreground">
            {filteredMaterials.length.toLocaleString('tr-TR')} listelenen
            {remoteTotal > filteredMaterials.length ? `, toplam ${remoteTotal.toLocaleString('tr-TR')} kayıt` : ''}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" onClick={exportExcel} className="h-9 gap-2 text-xs font-medium">
            <Download className="size-4" />
            Excel Çıktısı
          </Button>
          <Button type="button" variant="outline" onClick={() => void fetchMaterials()} disabled={loading} className="h-9 gap-2 text-xs font-medium">
            <RefreshCw className={cn('size-4', loading && 'animate-spin')} />
            Yenile
          </Button>
          <Button type="button" onClick={() => void openCreateDialog()} className="h-9 gap-2 text-xs font-medium shadow-sm">
            <PackagePlus className="size-4" />
            Yeni Malzeme Ekle
          </Button>
        </div>
      </div>

      {/* ── Metrik Kartlar ── */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <MetricCard label="Toplam Miktar" value={totalQuantity.toLocaleString('tr-TR')} tone="info" icon={<Boxes className="size-4" />} />
        <MetricCard label="Stok Değeri" value={currencyFormatter.format(totalValue)} tone="income" icon={<Banknote className="size-4" />} />
        <MetricCard label="Stokta Olan" value={inStockCount.toLocaleString('tr-TR')} tone="neutral" icon={<Archive className="size-4" />} />
        <MetricCard label="Kritik" value={criticalCount.toLocaleString('tr-TR')} tone="warning" icon={<History className="size-4" />} />
      </div>

      {/* ── Filtre ve Arama ── */}
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Kod, ad veya barkod ara..."
              className="pr-8 pl-9 h-9 text-sm bg-muted"
            />
            {search ? (
              <Button type="button" variant="ghost" size="icon-xs" className="absolute right-1.5 top-1.5 size-6 text-muted-foreground hover:text-foreground rounded-md" onClick={() => setSearch('')} aria-label="Aramayı temizle">
                <X className="size-3" />
              </Button>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select value={stockState} onValueChange={(v) => { if (v === 'all' || v === 'inStock' || v === 'outOfStock' || v === 'critical') setStockState(v); }}>
              <SelectTrigger className="h-9 w-full sm:w-36 text-xs">
                <SelectValue placeholder="Stok Durumu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Stoklar</SelectItem>
                <SelectItem value="inStock">Stokta Olanlar</SelectItem>
                <SelectItem value="outOfStock">Tükenecekler</SelectItem>
                <SelectItem value="critical">Kritik Limit</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCategory || ALL_FILTER_VALUE} onValueChange={(v) => setSelectedCategory(v && v !== ALL_FILTER_VALUE ? v : '')}>
              <SelectTrigger className="h-9 w-full sm:w-44 text-xs">
                <SelectValue placeholder="Kategori Seç" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_FILTER_VALUE}>Tüm Kategoriler</SelectItem>
                {categoryOptions.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
              </SelectContent>
            </Select>

            <Select value={selectedSubCategory || ALL_FILTER_VALUE} onValueChange={(v) => setSelectedSubCategory(v && v !== ALL_FILTER_VALUE ? v : '')} disabled={!selectedCategory}>
              <SelectTrigger className="h-9 w-full sm:w-44 text-xs">
                <SelectValue placeholder="Alt Kategori Seç" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_FILTER_VALUE}>Tüm Alt Kategoriler</SelectItem>
                {subCategoryOptions.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
              </SelectContent>
            </Select>

            <Select value={selectedBrand || ALL_FILTER_VALUE} onValueChange={(v) => setSelectedBrand(v && v !== ALL_FILTER_VALUE ? v : '')}>
              <SelectTrigger className="h-9 w-full sm:w-40 text-xs">
                <SelectValue placeholder="Marka Seç" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_FILTER_VALUE}>Tüm Markalar</SelectItem>
                {brandOptions.map((b) => (<SelectItem key={b} value={b}>{b}</SelectItem>))}
              </SelectContent>
            </Select>

            {isFiltered && (
              <Button type="button" variant="ghost" onClick={resetAllFilters} className="h-9 gap-1.5 text-xs text-muted-foreground hover:text-destructive px-3 shrink-0 rounded-md">
                <X className="size-3.5" />
                Temizle
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ── DataGrid ── */}
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b bg-muted px-5 py-4">
          <div className="space-y-0.5">
            <h2 className="text-sm font-bold">Stok Kartları</h2>
            <p className="text-xs text-muted-foreground">
              {filteredMaterials.length.toLocaleString('tr-TR')} satır listeleniyor
            </p>
          </div>
          <Badge variant="outline" className="font-semibold text-xs text-muted-foreground">
            {remoteTotal.toLocaleString('tr-TR')} Toplam Kayıt
          </Badge>
        </div>
        <div className="h-[680px] w-full">
          <DataGrid<Material>
            rows={filteredMaterials}
            columns={columns}
            getRowId={(row) => row.id}
            loading={loading}
            disableRowSelectionOnClick
            rowHeight={52}
            columnHeaderHeight={42}
            initialState={{ pagination: { paginationModel: { page: 0, pageSize: 25 } } }}
            pageSizeOptions={[25, 50, 100]}
            localeText={trTR.components.MuiDataGrid.defaultProps.localeText}
            slots={{ noRowsOverlay: NoRowsOverlay }}
            sx={dataGridStyles}
          />
        </div>
      </div>

      {/* ── Form Dialog ── */}
      <MalzemeFormDialog
        open={formOpen}
        mode={formMode}
        initialValues={formInitialValues}
        locations={locations}
        kategoriler={categories}
        markalar={brandOptions}
        birimSetleri={unitSets}
        canEditUnit={canEditUnit}
        isSaving={savingForm}
        onClose={closeFormDialog}
        onSubmit={submitForm}
      />

      {/* ── Silme Onayı ── */}
      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => { if (!open) { setDeleteTarget(null); setDeleteAvailability(null); } }}>
        <DialogContent style={{ width: 'min(100% - 2rem, 460px)', height: 'auto' }}>
          <DialogHeader className="border-b px-5 py-4">
            <DialogTitle>Malzeme Sil</DialogTitle>
            <DialogDescription>{deleteTarget?.stokAdi}</DialogDescription>
          </DialogHeader>
          <div className="px-5 py-4 text-sm text-muted-foreground">
            Bu kayıt stok listesinden kaldırılacak.
            {deleteAvailability?.toplamHareketSayisi != null ? (
              <span className="block pt-2">Hareket sayısı: {deleteAvailability.toplamHareketSayisi}</span>
            ) : null}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleting}>Vazgeç</Button>
            <Button type="button" variant="destructive" onClick={() => void confirmDelete()} disabled={deleting}>
              {deleting ? 'Siliniyor' : 'Sil'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Hareketler ── */}
      <Dialog open={movementOpen} onOpenChange={(open) => (!open ? setMovementOpen(false) : undefined)}>
        <DialogContent style={{ width: 'min(100% - 2rem, 980px)', height: 'min(88dvh, 680px)' }}>
          <DialogHeader className="border-b px-5 py-4">
            <DialogTitle>Malzeme Hareketleri</DialogTitle>
            <DialogDescription>{movementMaterial ? `${movementMaterial.stokKodu} - ${movementMaterial.stokAdi}` : ''}</DialogDescription>
          </DialogHeader>
          <div className="min-h-0 flex-1 p-4">
            <div className="h-full rounded-lg border">
              <DataGrid<ProductMovement>
                rows={movementRows}
                columns={movementColumns}
                getRowId={(row) => row.id}
                loading={movementLoading}
                disableRowSelectionOnClick
                localeText={trTR.components.MuiDataGrid.defaultProps.localeText}
                sx={dataGridStyles}
              />
            </div>
          </div>
          <DialogFooter>
            <div className="mr-auto text-xs text-muted-foreground">{movementTotal.toLocaleString('tr-TR')} hareket</div>
            <Button type="button" onClick={() => setMovementOpen(false)}>Kapat</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Eşdeğerler ── */}
      <Dialog open={equivalentOpen} onOpenChange={(open) => (!open ? setEquivalentOpen(false) : undefined)}>
        <DialogContent style={{ width: 'min(100% - 2rem, 760px)', height: 'auto' }}>
          <DialogHeader className="border-b px-5 py-4">
            <DialogTitle>Eşdeğer Ürünler</DialogTitle>
            <DialogDescription>{equivalentMaterial ? `${equivalentMaterial.stokKodu} - ${equivalentMaterial.stokAdi}` : ''}</DialogDescription>
          </DialogHeader>
          <div className="max-h-[420px] overflow-auto p-4">
            {equivalentLoading ? (
              <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">Yükleniyor</div>
            ) : equivalentRows.length > 0 ? (
              <div className="overflow-hidden rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-muted text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium">Stok Kodu</th>
                      <th className="px-3 py-2 text-left font-medium">Malzeme</th>
                      <th className="px-3 py-2 text-left font-medium">Marka</th>
                      <th className="px-3 py-2 text-right font-medium">Stok</th>
                    </tr>
                  </thead>
                  <tbody>
                    {equivalentRows.map((row) => (
                      <tr key={row.id} className="border-t">
                        <td className="px-3 py-2 font-mono font-semibold" style={{ color: 'var(--primary)' }}>{row.stokKodu}</td>
                        <td className="px-3 py-2">{row.stokAdi}</td>
                        <td className="px-3 py-2 text-muted-foreground">{row.marka || '-'}</td>
                        <td className="px-3 py-2 text-right tabular-nums">{row.miktar.toLocaleString('tr-TR')} {row.birim}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">Eşdeğer ürün bulunamadı.</div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" onClick={() => setEquivalentOpen(false)}>Kapat</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
