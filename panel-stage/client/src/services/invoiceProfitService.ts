import axios from '@/lib/axios';

export interface ProfitByInvoiceResponse {
  fatura: {
    id: string;
    faturaNo: string;
    tarih: string;
    cari: {
      id: string;
      cariKodu: string;
      unvan: string;
    };
    toplamSatisTutari: number;
    toplamMaliyet: number;
    toplamKar: number;
    karOrani: number;
  };
  kalemler: Array<{
    id: string;
    faturaKalemiId: string | null;
    stok: {
      id: string;
      stokKodu: string;
      stokAdi: string;
    } | null;
    miktar: number;
    birimFiyat: number;
    birimMaliyet: number;
    toplamSatisTutari: number;
    toplamMaliyet: number;
    kar: number;
    karOrani: number;
  }>;
}

export interface ProfitByProductItem {
  stok: {
    id: string;
    stokKodu: string;
    stokAdi: string;
  };
  toplamMiktar: number;
  toplamSatisTutari: number;
  toplamMaliyet: number;
  toplamKar: number;
  karOrani: number;
  faturalar: Array<{
    faturaId: string;
    faturaNo: string;
    tarih: string;
    cari: {
      id: string;
      unvan: string;
    };
    miktar: number;
    satisTutari: number;
    maliyet: number;
    kar: number;
  }>;
}

export interface ProfitListItem {
  fatura: {
    id: string;
    faturaNo: string;
    tarih: string;
    cari: {
      id: string;
      cariKodu: string;
      unvan: string;
    };
    durum: string;
  };
  toplamSatisTutari: number;
  toplamMaliyet: number;
  toplamKar: number;
  karOrani: number;
}

export interface ProfitDetailItem {
  id: string;
  stok: {
    id: string;
    stokKodu: string;
    stokAdi: string;
  } | null;
  miktar: number;
  birimFiyat: number;
  birimMaliyet: number;
  toplamSatisTutari: number;
  toplamMaliyet: number;
  kar: number;
  karOrani: number;
}

export interface GetProfitQuery {
  stokId?: string;
  startDate?: string;
  endDate?: string;
  accountId?: string;
  status?: string;
}

/**
 * Fatura bazlı kar bilgisi
 */
export async function getProfitByInvoice(
  faturaId: string,
): Promise<ProfitByInvoiceResponse> {
  const response = await axios.get(`/invoice-profits/by-invoice/${faturaId}`);
  return response.data;
}

/**
 * Ürün bazlı kar bilgisi
 */
export async function getProfitByProduct(
  filters?: GetProfitQuery,
): Promise<ProfitByProductItem[]> {
  const response = await axios.get('/invoice-profits/by-product', {
    params: filters,
  });
  // Handle API response format - extract data array if present
  if (response.data && typeof response.data === 'object' && 'data' in response.data) {
    return response.data.data || [];
  }
  return response.data || [];
}

/**
 * Fatura bazlı karlılık listesi
 */
export async function getProfitList(
  filters?: GetProfitQuery,
): Promise<ProfitListItem[]> {
  const response = await axios.get('/invoice-profits/list', {
    params: filters,
  });
  // Handle API response format - extract data array if present
  if (response.data && typeof response.data === 'object' && 'data' in response.data) {
    return response.data.data || [];
  }
  return response.data || [];
}

/**
 * Fatura detay kar bilgileri (master-detail için)
 */
export async function getProfitDetail(
  faturaId: string,
): Promise<ProfitDetailItem[]> {
  const response = await axios.get(`/invoice-profits/detail/${faturaId}`);
  // Handle API response format - extract data array if present
  if (response.data && typeof response.data === 'object' && 'data' in response.data) {
    return response.data.data || [];
  }
  return response.data || [];
}

/**
 * Fatura karını yeniden hesapla
 */
export async function recalculateProfit(
  faturaId: string,
): Promise<{ message: string }> {
  const response = await axios.post(`/invoice-profits/recalculate/${faturaId}`);
  return response.data;
}
