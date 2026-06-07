import type { CariHareketForDetail } from './cariHareketDetail.shared';
import { normalizeEmbeddedInvoice, normalizeEmbeddedCheckBill } from './cariHareketDetail.shared';

export interface CariHareket extends CariHareketForDetail {}

export interface CariAccount {
  id: string;
  cariKodu: string;
  unvan: string;
  tip: string;
  vergiNo?: string;
  vergiDairesi?: string;
  telefon?: string;
  email?: string;
  bakiye: string;
  riskLimiti?: number;
  riskDurumu?: 'NORMAL' | 'RISKLI' | 'BLOKELI' | 'TAKIPTE';
  riskDurdurma?: boolean;
}

/** API Account (title, code) → UI alanları (unvan, cariKodu) */
export function normalizeAccount(raw: Record<string, unknown>): CariAccount {
  const unvan = String(raw.title ?? raw.unvan ?? raw.fullName ?? '').trim() || 'İsimsiz Cari';
  return {
    id: String(raw.id ?? ''),
    cariKodu: String(raw.code ?? raw.cariKodu ?? '-'),
    unvan,
    tip: String(raw.type ?? raw.tip ?? ''),
    vergiNo: (raw.taxNumber ?? raw.vergiNo) as string | undefined,
    vergiDairesi: (raw.taxOffice ?? raw.vergiDairesi) as string | undefined,
    telefon: (raw.phone ?? raw.telefon) as string | undefined,
    email: raw.email as string | undefined,
    bakiye:
      raw.balance != null
        ? String(raw.balance)
        : raw.bakiye != null
          ? String(raw.bakiye)
          : '0',
    riskLimiti: raw.riskLimiti as number | undefined,
    riskDurumu: raw.riskDurumu as CariAccount['riskDurumu'],
    riskDurdurma: raw.riskDurdurma as boolean | undefined,
  };
}

export type CariHareketMasterRow = CariHareket & { _rowType: 'master' };
export type CariHareketDetailRow = {
  id: string;
  _rowType: 'detail';
  _parentId: string;
  tarih: string;
  belgeTipi?: string;
  belgeNo?: string;
  aciklama: string;
};
export type CariHareketDisplayRow = CariHareketMasterRow | CariHareketDetailRow;

export const MASTER_COLUMN_COUNT = 8;
export const DETAIL_CELL_FIELD = '__expand__';
export const DETAIL_ROW_HEIGHT = 260;
export const DEFAULT_PAGE_SIZE = 25;

export function isDetailRow(row: CariHareketDisplayRow): row is CariHareketDetailRow {
  return row._rowType === 'detail';
}

export function formatMoney(amount: number, opts?: { signed?: boolean }) {
  const formatted = Math.abs(amount).toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  if (opts?.signed && amount < 0) return `-₺${formatted}`;
  return `₺${formatted}`;
}

export function getBelgeTipiLabel(belgeTipi?: string) {
  if (!belgeTipi) return '-';
  const map: Record<string, string> = {
    INVOICE: 'Fatura',
    COLLECTION: 'Tahsilat',
    PAYMENT: 'Ödeme',
    CHECK_PROMISSORY: 'Çek/Senet',
    CARRY_FORWARD: 'Devir',
    CORRECTION: 'Düzeltme',
    CHECK_ENTRY: 'Çek Girişi',
    CHECK_EXIT: 'Çek Çıkışı',
    RETURN: 'İade',
    HAVALE: 'Havale',
    CHECK_BILL: 'Çek/Senet',
    SATIS_FATURA: 'Satış Faturası',
    SATIN_ALMA_FATURA: 'Alış Faturası',
    SATIS_IRSALIYE: 'Satış İrsaliyesi',
    SATIN_ALMA_IRSALIYE: 'Satınalma İrsaliyesi',
    TAHSILAT: 'Tahsilat',
    ODEME: 'Ödeme',
    DEVIR: 'Devir',
  };
  return map[belgeTipi] ?? belgeTipi;
}

export function normalizeMovements(raw: unknown[]): CariHareket[] {
  return raw.map((m: Record<string, unknown>) => {
    const backendType = m?.type as string | undefined;
    const tip: CariHareket['tip'] =
      backendType === 'DEBIT' || backendType === 'BORC'
        ? 'BORC'
        : backendType === 'CREDIT' || backendType === 'ALACAK'
          ? 'ALACAK'
          : 'DEVIR';

    return {
      id: String(m?.id ?? Math.random().toString(36).slice(2)),
      tip,
      tutar:
        m?.amount != null
          ? String(m.amount)
          : m?.tutar != null
            ? String(m.tutar)
            : '0',
      bakiye:
        m?.balance != null
          ? String(m.balance)
          : m?.bakiye != null
            ? String(m.bakiye)
            : '0',
      belgeNo: String(m?.documentNo ?? m?.belgeNo ?? '-') || '-',
      belgeTipi: (m?.documentType ?? m?.belgeTipi) as string | undefined,
      tarih: String(m?.date ?? m?.tarih ?? new Date(0).toISOString()),
      aciklama: String(m?.notes ?? m?.aciklama ?? ''),
      invoiceId: (m?.invoiceId ?? (m?.invoice as Record<string, unknown>)?.id) as string | undefined,
      checkBillId: (m?.checkBillId ?? (m?.checkBill as Record<string, unknown>)?.id) as
        | string
        | undefined,
      invoice: normalizeEmbeddedInvoice(m?.invoice as Record<string, unknown> | undefined),
      checkBill: normalizeEmbeddedCheckBill(m?.checkBill as Record<string, unknown> | undefined),
    };
  });
}

export function filterByDateRange(
  items: CariHareket[],
  baslangic: string,
  bitis: string,
): CariHareket[] {
  if (!baslangic && !bitis) return items;
  return items.filter((h) => {
    const t = new Date(h.tarih).getTime();
    if (baslangic) {
      const start = new Date(baslangic);
      start.setHours(0, 0, 0, 0);
      if (t < start.getTime()) return false;
    }
    if (bitis) {
      const end = new Date(bitis);
      end.setHours(23, 59, 59, 999);
      if (t > end.getTime()) return false;
    }
    return true;
  });
}

export function computeTotals(items: CariHareket[]) {
  return items.reduce(
    (acc, h) => {
      const val = parseFloat(h.tutar) || 0;
      if (h.tip === 'BORC') acc.borc += val;
      else if (h.tip === 'ALACAK') acc.alacak += val;
      return acc;
    },
    { borc: 0, alacak: 0 },
  );
}
