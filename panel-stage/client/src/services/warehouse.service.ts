import api from '@/lib/axios';

interface ApiProductStockSummary {
  id: string;
  code?: string;
  name?: string;
  unit?: string;
  stokKodu?: string;
  stokAdi?: string;
  birim?: string;
}

interface ApiWarehouseStockSnapshot {
  id: string;
  code?: string;
  name?: string;
  quantity?: number | string | null;
}

export interface ProductStockSummary {
  id: string;
  code: string;
  name: string;
  unit: string;
}

export interface WarehouseStockSnapshot {
  id: string;
  code: string;
  name: string;
  quantity: number;
}

const toNumber = (value: number | string | null | undefined): number => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

export async function getProductStockSummary(productId: string): Promise<ProductStockSummary> {
  const response = await api.get<ApiProductStockSummary>(`/products/${productId}`);
  const product = response.data;

  return {
    id: product.id,
    code: product.stokKodu ?? product.code ?? '',
    name: product.stokAdi ?? product.name ?? '',
    unit: product.birim ?? product.unit ?? 'Adet',
  };
}

export async function getWarehouseProductStockHistory(
  productId: string,
  date: string,
): Promise<WarehouseStockSnapshot[]> {
  const response = await api.get<ApiWarehouseStockSnapshot[]>(
    `/warehouses/product/${productId}/stock-history`,
    { params: { date } },
  );

  return (response.data ?? []).map((item) => ({
    id: item.id,
    code: item.code ?? '-',
    name: item.name ?? '-',
    quantity: toNumber(item.quantity),
  }));
}
