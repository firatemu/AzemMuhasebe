import api from '@/lib/axios';
import type {
  ApiProduct,
  BrandOption,
  CategoryOption,
  DeleteAvailability,
  LocationOption,
  Material,
  ProductListParams,
  ProductListResponse,
  ProductMovementResult,
  ProductPayload,
  UnitSetOption,
} from '@/types/material';

const toNumber = (value: number | string | null | undefined, fallback = 0): number => {
  if (value === null || value === undefined || value === '') return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toText = (value: string | null | undefined): string => value?.trim() ?? '';

export const mapProductToMaterial = (product: ApiProduct): Material => {
  const purchasePriceCard = product.priceCards?.find((card) => card.type === 'PURCHASE');
  const salePriceCard = product.priceCards?.find((card) => card.type === 'SALE');

  return {
    id: product.id,
    stokKodu: product.stokKodu ?? product.code,
    stokAdi: product.stokAdi ?? product.name,
    barkod: toText(product.barcode),
    aciklama: toText(product.description),
    marka: toText(product.marka ?? product.brand),
    model: toText(product.model),
    anaKategori: toText(product.anaKategori ?? product.mainCategory),
    altKategori: toText(product.altKategori ?? product.subCategory),
    birim: product.birim ?? product.unit ?? 'Adet',
    birimId: toText(product.unitId),
    miktar: toNumber(product.quantity, 0),
    olcu: toText(product.size),
    tedarikciKodu: toText(product.supplierCode),
    raf: toText(product.raf ?? product.shelf),
    alisFiyati: toNumber(product.alisFiyati ?? product.purchasePrice ?? purchasePriceCard?.price, 0),
    satisFiyati: toNumber(product.satisFiyati ?? product.salePrice ?? salePriceCard?.price, 0),
    vatRate: toNumber(product.vatRate, 20),
    criticalQty: Math.max(0, Math.trunc(toNumber(product.criticalQty, 0))),
    weight: product.weight === null || product.weight === undefined ? undefined : toNumber(product.weight),
    weightUnit: toText(product.weightUnit) || 'kg',
    dimensions: toText(product.dimensions),
    warrantyMonths: product.warrantyMonths ?? undefined,
    internalNote: toText(product.internalNote),
    minOrderQty: product.minOrderQty ?? undefined,
  };
};

export async function listProducts(params: ProductListParams): Promise<ProductListResponse> {
  const response = await api.get<ProductListResponse>('/products', { params });
  return response.data;
}

export async function createProduct(payload: ProductPayload): Promise<ApiProduct> {
  const response = await api.post<ApiProduct>('/products', payload);
  return response.data;
}

export async function updateProduct(id: string, payload: ProductPayload): Promise<ApiProduct> {
  const response = await api.patch<ApiProduct>(`/products/${id}`, payload);
  return response.data;
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/products/${id}`);
}

export async function getProductDeleteAvailability(id: string): Promise<DeleteAvailability> {
  const response = await api.get<DeleteAvailability>(`/products/${id}/can-delete`);
  return response.data;
}

export async function previewNextProductCode(): Promise<string> {
  const response = await api.get<{ nextCode?: string }>('/code-templates/preview-code/PRODUCT');
  return response.data.nextCode ?? '';
}

export async function listCategories(): Promise<Record<string, string[]>> {
  const response = await api.get<CategoryOption[]>('/categories');
  return response.data.reduce<Record<string, string[]>>((acc, item) => {
    if (item.mainCategory) {
      acc[item.mainCategory] = item.subCategories ?? [];
    }
    return acc;
  }, {});
}

export async function listBrands(): Promise<string[]> {
  const response = await api.get<BrandOption[]>('/brand');
  return response.data
    .map((item) => item.brandName ?? item.name ?? '')
    .filter((name): name is string => Boolean(name))
    .sort((a, b) => a.localeCompare(b, 'tr'));
}

export async function listLocations(): Promise<LocationOption[]> {
  const response = await api.get<LocationOption[]>('/location');
  return Array.isArray(response.data) ? response.data : [];
}

export async function listUnitSets(): Promise<UnitSetOption[]> {
  const response = await api.get<UnitSetOption[]>('/unit-sets');
  return Array.isArray(response.data) ? response.data : [];
}

export async function listProductMovements(productId: string): Promise<ProductMovementResult> {
  const response = await api.get<{
    data?: ProductMovementResult['data'];
    meta?: { total?: number };
  }>('/product-movements', {
    params: {
      productId,
      limit: 100,
    },
  });

  return {
    data: response.data.data ?? [],
    total: response.data.meta?.total ?? 0,
  };
}

export async function listEquivalentProducts(productId: string): Promise<Material[]> {
  const response = await api.get<{ esdegerler?: ApiProduct[] }>(`/products/${productId}/esdegerler`);
  return (response.data.esdegerler ?? []).map(mapProductToMaterial);
}
