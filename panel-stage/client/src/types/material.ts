export type PriceCardType = 'SALE' | 'PURCHASE' | 'CAMPAIGN' | 'LIST';

export interface ProductPriceCard {
  id?: string;
  type: PriceCardType;
  price: number | string;
  vatRate?: number | string;
  currency?: string;
  isActive?: boolean;
  createdAt?: string;
}

export interface ApiProduct {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  unit: string;
  unitId?: string | null;
  vatRate?: number | string | null;
  criticalQty?: number | null;
  category?: string | null;
  mainCategory?: string | null;
  subCategory?: string | null;
  brand?: string | null;
  model?: string | null;
  size?: string | null;
  shelf?: string | null;
  barcode?: string | null;
  supplierCode?: string | null;
  weight?: number | string | null;
  weightUnit?: string | null;
  dimensions?: string | null;
  warrantyMonths?: number | null;
  internalNote?: string | null;
  minOrderQty?: number | null;
  quantity?: number | null;
  stokKodu?: string;
  stokAdi?: string;
  birim?: string;
  marka?: string | null;
  anaKategori?: string | null;
  altKategori?: string | null;
  raf?: string | null;
  alisFiyati?: number | string | null;
  satisFiyati?: number | string | null;
  purchasePrice?: number | string | null;
  salePrice?: number | string | null;
  priceCards?: ProductPriceCard[];
}

export interface Material {
  id: string;
  stokKodu: string;
  stokAdi: string;
  barkod: string;
  aciklama: string;
  marka: string;
  model: string;
  anaKategori: string;
  altKategori: string;
  birim: string;
  birimId: string;
  miktar: number;
  olcu: string;
  tedarikciKodu: string;
  raf: string;
  alisFiyati: number;
  satisFiyati: number;
  vatRate: number;
  criticalQty: number;
  weight?: number;
  weightUnit: string;
  dimensions: string;
  warrantyMonths?: number;
  internalNote: string;
  minOrderQty?: number;
}

export interface ProductListResponse {
  data: ApiProduct[];
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}

export interface ProductListParams {
  page?: number;
  limit?: number;
  search?: string;
  brand?: string;
  mainCategory?: string;
  subCategory?: string;
}

export interface ProductPayload {
  code?: string;
  name: string;
  description?: string;
  unit: string;
  unitId?: string;
  purchasePrice?: number;
  salePrice?: number;
  vatRate?: number;
  criticalQty?: number;
  category?: string;
  mainCategory?: string;
  subCategory?: string;
  brand?: string;
  model?: string;
  size?: string;
  shelf?: string;
  barcode?: string;
  supplierCode?: string;
  weight?: number;
  weightUnit?: string;
  dimensions?: string;
  warrantyMonths?: number;
  internalNote?: string;
  minOrderQty?: number;
}

export interface CategoryOption {
  mainCategory: string;
  subCategories?: string[];
}

export interface BrandOption {
  brandName?: string;
  name?: string;
}

export interface LocationOption {
  id: string;
  code: string;
  name: string;
  barcode?: string;
}

export interface UnitOption {
  id: string;
  name: string;
  code?: string;
}

export interface UnitSetOption {
  id: string;
  name: string;
  units?: UnitOption[];
}

export interface DeleteAvailability {
  canDelete: boolean;
  toplamHareketSayisi?: number;
}

export interface ProductMovement {
  id: string;
  createdAt?: string;
  movementType?: string;
  quantity?: number;
  invoiceItem?: {
    invoice?: {
      invoiceNo?: string;
      account?: {
        title?: string;
      };
    };
  };
  stockMove?: {
    moveNo?: string;
    targetWarehouse?: {
      name?: string;
    };
  };
}

export interface ProductMovementResult {
  data: ProductMovement[];
  total: number;
}
