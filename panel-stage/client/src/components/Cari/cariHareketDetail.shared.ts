import type { GridColDef } from '@mui/x-data-grid';

export interface InvoiceItem {
  id: string;
  product?: { name: string; code: string };
  quantity: number;
  unitPrice: string | number;
  vatRate: number;
  vatAmount?: string | number;
  amount: string | number;
  unit?: string;
}

export interface InvoiceDetail {
  id: string;
  invoiceNo: string;
  invoiceType: string;
  date: string;
  totalAmount: string | number;
  vatAmount: string | number;
  grandTotal: string | number;
  currency: string;
  notes?: string;
  status: string;
  items?: InvoiceItem[];
}

export interface CariHareketForDetail {
  id: string;
  tip: 'BORC' | 'ALACAK' | 'DEVIR';
  tutar: string;
  bakiye: string;
  belgeTipi?: string;
  belgeNo?: string;
  tarih: string;
  aciklama: string;
  invoiceId?: string;
  checkBillId?: string;
  invoice?: InvoiceDetail;
  checkBill?: {
    id: string;
    type?: string;
    checkNo?: string;
    serialNo?: string;
    amount?: string | number;
    dueDate?: string;
    status?: string;
    bank?: string;
    portfolioType?: string;
  };
}

export type DetailKind = 'invoice' | 'collection' | 'check' | 'generic';

export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function formatDetailCurrency(val: string | number, currency = 'TRY') {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency }).format(Number(val));
}

export function getInvoiceTypeLabel(type: string) {
  switch (type) {
    case 'SALE':
    case 'SATIS':
      return 'Satış Faturası';
    case 'PURCHASE':
    case 'ALIS':
      return 'Alış Faturası';
    case 'SALES_RETURN':
    case 'SATIS_IADE':
      return 'Satış İade Faturası';
    case 'PURCHASE_RETURN':
    case 'ALIS_IADE':
      return 'Alış İade Faturası';
    default:
      return type;
  }
}

export function getCollectionTypeLabel(type?: string) {
  if (type === 'PAYMENT') return 'Ödeme';
  if (type === 'COLLECTION') return 'Tahsilat';
  return type || '-';
}

export function getPaymentMethodLabel(method?: string) {
  const map: Record<string, string> = {
    CASH: 'Nakit',
    CREDIT_CARD: 'Kredi Kartı',
    BANK_TRANSFER: 'Banka Transferi',
    CHECK: 'Çek',
    PROMISSORY_NOTE: 'Senet',
    GIFT_CARD: 'Hediye Kartı',
    LOAN_ACCOUNT: 'Alacak Hesabı',
  };
  return method ? map[method] || method : '-';
}

export function getCheckTypeLabel(type?: string) {
  if (type === 'CHECK') return 'Çek';
  if (type === 'PROMISSORY') return 'Senet';
  return type || '-';
}

export function resolveDetailKind(h: CariHareketForDetail): DetailKind {
  if (h.belgeTipi === 'INVOICE' || h.invoiceId || h.invoice) return 'invoice';
  if (
    h.belgeTipi === 'COLLECTION' ||
    h.belgeTipi === 'PAYMENT' ||
    h.belgeTipi === 'TAHSILAT' ||
    h.belgeTipi === 'ODEME' ||
    (h.belgeNo && UUID_RE.test(h.belgeNo) && !h.invoiceId && !h.checkBillId)
  ) {
    return 'collection';
  }
  if (
    h.checkBillId ||
    h.checkBill ||
    ['CHECK_ENTRY', 'CHECK_EXIT', 'CHECK_PROMISSORY', 'CHECK_BILL', 'RETURN'].includes(
      h.belgeTipi || '',
    )
  ) {
    return 'check';
  }
  return 'generic';
}

export function normalizeEmbeddedInvoice(raw: Record<string, unknown> | undefined): InvoiceDetail | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const items = Array.isArray(raw.items)
    ? raw.items.map((item: Record<string, unknown>) => {
        const product = item.product as Record<string, unknown> | undefined;
        return {
          id: String(item.id ?? ''),
          product: product
            ? { name: String(product.name ?? ''), code: String(product.code ?? '') }
            : undefined,
          quantity: Number(item.quantity ?? 0),
          unitPrice: item.unitPrice != null ? String(item.unitPrice) : '0',
          vatRate: Number(item.vatRate ?? 0),
          vatAmount: item.vatAmount != null ? String(item.vatAmount) : undefined,
          amount: item.amount != null ? String(item.amount) : '0',
          unit: item.unit as string | undefined,
        };
      })
    : undefined;

  return {
    id: String(raw.id ?? ''),
    invoiceNo: String(raw.invoiceNo ?? ''),
    invoiceType: String(raw.invoiceType ?? ''),
    date: String(raw.date ?? ''),
    totalAmount: raw.totalAmount != null ? String(raw.totalAmount) : '0',
    vatAmount: raw.vatAmount != null ? String(raw.vatAmount) : '0',
    grandTotal: raw.grandTotal != null ? String(raw.grandTotal) : '0',
    currency: String(raw.currency ?? 'TRY'),
    notes: raw.notes as string | undefined,
    status: String(raw.status ?? ''),
    items,
  };
}

export function normalizeEmbeddedCheckBill(
  raw: Record<string, unknown> | undefined,
): CariHareketForDetail['checkBill'] | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  return {
    id: String(raw.id ?? ''),
    type: raw.type as string | undefined,
    checkNo: raw.checkNo as string | undefined,
    serialNo: raw.serialNo as string | undefined,
    amount: raw.amount != null ? String(raw.amount) : undefined,
    dueDate: raw.dueDate ? String(raw.dueDate) : undefined,
    status: raw.status as string | undefined,
    bank: raw.bank as string | undefined,
    portfolioType: raw.portfolioType as string | undefined,
  };
}

export const invoiceDetailColumns: GridColDef[] = [
  { field: 'productCode', headerName: 'Stok Kodu', width: 120 },
  { field: 'productName', headerName: 'Ürün / Hizmet', flex: 1, minWidth: 200 },
  {
    field: 'quantity',
    headerName: 'Miktar',
    width: 110,
    align: 'right',
    headerAlign: 'right',
    valueFormatter: (value, row) => `${value} ${row.unit || 'Adet'}`,
  },
  {
    field: 'unitPrice',
    headerName: 'Birim Fiyat',
    width: 120,
    align: 'right',
    headerAlign: 'right',
    valueFormatter: (value) => formatDetailCurrency(value as number),
  },
  {
    field: 'vatRate',
    headerName: 'KDV %',
    width: 80,
    align: 'right',
    headerAlign: 'right',
    valueFormatter: (value) => `%${value}`,
  },
  {
    field: 'amount',
    headerName: 'Toplam',
    width: 120,
    align: 'right',
    headerAlign: 'right',
    valueFormatter: (value) => formatDetailCurrency(value as number),
  },
];

export const keyValueDetailColumns: GridColDef[] = [
  { field: 'alan', headerName: 'Alan', width: 200 },
  { field: 'deger', headerName: 'Değer', flex: 1, minWidth: 240 },
];

export function buildInvoiceDetailRows(invoice: InvoiceDetail) {
  return (invoice.items ?? []).map((item) => ({
    id: item.id,
    productCode: item.product?.code ?? '-',
    productName: item.product?.name ?? '-',
    quantity: item.quantity,
    unit: item.unit || 'Adet',
    unitPrice: Number(item.unitPrice),
    vatRate: item.vatRate,
    amount: Number(item.amount),
  }));
}

export function buildInvoiceSubtitle(invoice: InvoiceDetail) {
  return `${getInvoiceTypeLabel(invoice.invoiceType)} · Ara: ${formatDetailCurrency(invoice.totalAmount, invoice.currency)} · KDV: ${formatDetailCurrency(invoice.vatAmount, invoice.currency)} · Genel: ${formatDetailCurrency(invoice.grandTotal, invoice.currency)}`;
}

export function buildCollectionDetailRows(
  collection: Record<string, unknown>,
  getBelgeTipiLabel: (belgeTipi?: string) => string,
  hareketBelgeTipi?: string,
) {
  const linkedInvoice = collection.invoice as { invoiceNo?: string } | undefined;
  const cashbox = collection.cashbox as { name?: string } | undefined;
  const bankAccount = collection.bankAccount as { name?: string } | undefined;
  return [
    { id: 'type', alan: 'İşlem Türü', deger: getCollectionTypeLabel(collection.type as string) },
    { id: 'doc', alan: 'Belge No', deger: String(collection.documentNo || '-') },
    {
      id: 'date',
      alan: 'Tarih',
      deger: collection.date
        ? new Date(collection.date as string).toLocaleDateString('tr-TR')
        : '-',
    },
    {
      id: 'amount',
      alan: 'Tutar',
      deger:
        collection.amount != null
          ? formatDetailCurrency(collection.amount as string | number)
          : '-',
    },
    { id: 'pay', alan: 'Ödeme Yöntemi', deger: getPaymentMethodLabel(collection.paymentType as string) },
    {
      id: 'acc',
      alan: 'Kasa / Banka',
      deger: cashbox?.name || bankAccount?.name || '-',
    },
    ...(linkedInvoice?.invoiceNo
      ? [{ id: 'inv', alan: 'Bağlı Fatura', deger: linkedInvoice.invoiceNo }]
      : []),
    ...(collection.notes ? [{ id: 'notes', alan: 'Not', deger: String(collection.notes) }] : []),
  ];
}

export function buildCheckDetailRows(checkBill: Record<string, unknown>) {
  return [
    { id: 'type', alan: 'Evrak Türü', deger: getCheckTypeLabel(checkBill.type as string) },
    {
      id: 'no',
      alan: 'Çek / Seri No',
      deger: String(checkBill.checkNo || checkBill.serialNo || '-'),
    },
    {
      id: 'due',
      alan: 'Vade',
      deger: checkBill.dueDate
        ? new Date(checkBill.dueDate as string).toLocaleDateString('tr-TR')
        : '-',
    },
    {
      id: 'amount',
      alan: 'Tutar',
      deger:
        checkBill.amount != null
          ? formatDetailCurrency(checkBill.amount as string | number)
          : '-',
    },
    { id: 'bank', alan: 'Banka', deger: String(checkBill.bank || '-') },
    { id: 'status', alan: 'Durum', deger: String(checkBill.status || '-') },
  ];
}

export function buildGenericDetailRows(
  hareket: CariHareketForDetail,
  getBelgeTipiLabel: (belgeTipi?: string) => string,
) {
  return [
    { id: 'tip', alan: 'Belge Tipi', deger: getBelgeTipiLabel(hareket.belgeTipi) },
    { id: 'no', alan: 'Belge No', deger: hareket.belgeNo || '-' },
    { id: 'acik', alan: 'Açıklama', deger: hareket.aciklama || '-' },
    { id: 'tutar', alan: 'Tutar', deger: formatDetailCurrency(hareket.tutar) },
    { id: 'bakiye', alan: 'Bakiye', deger: formatDetailCurrency(hareket.bakiye) },
  ];
}

export function getDetailPanelTitle(
  hareket: CariHareketForDetail | null,
  kind: DetailKind | null,
  getBelgeTipiLabel: (belgeTipi?: string) => string,
) {
  if (!hareket) return 'İşlem Detayı';
  if (kind === 'invoice') {
    return `Fatura Kalemleri — ${hareket.belgeNo || hareket.invoice?.invoiceNo || ''}`;
  }
  if (kind === 'collection') return `${getBelgeTipiLabel(hareket.belgeTipi)} Detayı`;
  if (kind === 'check') return `Çek / Senet Detayı — ${hareket.belgeNo || ''}`;
  return `Hareket Detayı — ${hareket.belgeNo || ''}`;
}

/** API detaylı ekstre hareketi */
export interface DetailedStatementMovement {
  id: string;
  date: string;
  type: string;
  amount: number;
  balance: number;
  documentType: string | null;
  documentTypeLabel: string;
  documentNo: string | null;
  notes: string | null;
  detailKind: DetailKind;
  invoice?: {
    id: string;
    invoiceNo: string;
    invoiceType: string;
    invoiceTypeLabel: string;
    totalAmount: number;
    vatAmount: number;
    grandTotal: number;
    currency: string;
    items: Array<{
      id: string;
      productCode: string;
      productName: string;
      quantity: number;
      unit: string;
      unitPrice: number;
      vatRate: number;
      amount: number;
    }>;
  };
  collection?: {
    typeLabel: string;
    documentNo: string | null;
    date: string;
    amount: number;
    paymentTypeLabel: string;
    cashboxOrBank: string;
    linkedInvoiceNo: string | null;
    notes: string | null;
  };
  checkBill?: {
    typeLabel: string;
    checkNo: string | null;
    serialNo: string | null;
    dueDate: string | null;
    amount: number;
    bank: string | null;
    status: string | null;
  };
  genericFields?: Array<{ label: string; value: string }>;
}

export function buildKeyValueRowsFromGenericFields(
  fields: Array<{ label: string; value: string }>,
) {
  return fields.map((f, i) => ({ id: `g-${i}`, alan: f.label, deger: f.value }));
}

export function buildKeyValueRowsFromCollectionApi(mov: DetailedStatementMovement) {
  if (!mov.collection) return [];
  const c = mov.collection;
  const rows = [
    { id: 'type', alan: 'İşlem Türü', deger: c.typeLabel },
    { id: 'doc', alan: 'Belge No', deger: c.documentNo || '-' },
    { id: 'date', alan: 'Tarih', deger: new Date(c.date).toLocaleDateString('tr-TR') },
    { id: 'amount', alan: 'Tutar', deger: formatDetailCurrency(c.amount) },
    { id: 'pay', alan: 'Ödeme Yöntemi', deger: c.paymentTypeLabel },
    { id: 'acc', alan: 'Kasa / Banka', deger: c.cashboxOrBank },
  ];
  if (c.linkedInvoiceNo) {
    rows.push({ id: 'inv', alan: 'Bağlı Fatura', deger: c.linkedInvoiceNo });
  }
  if (c.notes) rows.push({ id: 'notes', alan: 'Not', deger: c.notes });
  return rows;
}

export function buildKeyValueRowsFromCheckApi(mov: DetailedStatementMovement) {
  if (!mov.checkBill) return [];
  const c = mov.checkBill;
  return [
    { id: 'type', alan: 'Evrak Türü', deger: c.typeLabel },
    { id: 'no', alan: 'Çek / Seri No', deger: c.checkNo || c.serialNo || '-' },
    {
      id: 'due',
      alan: 'Vade',
      deger: c.dueDate ? new Date(c.dueDate).toLocaleDateString('tr-TR') : '-',
    },
    { id: 'amount', alan: 'Tutar', deger: formatDetailCurrency(c.amount) },
    { id: 'bank', alan: 'Banka', deger: c.bank || '-' },
    { id: 'status', alan: 'Durum', deger: c.status || '-' },
  ];
}

export function buildInvoiceRowsFromApi(mov: DetailedStatementMovement) {
  if (!mov.invoice?.items) return [];
  return mov.invoice.items.map((item) => ({
    id: item.id,
    productCode: item.productCode,
    productName: item.productName,
    quantity: item.quantity,
    unit: item.unit,
    unitPrice: item.unitPrice,
    vatRate: item.vatRate,
    amount: item.amount,
  }));
}

export function buildInvoiceSubtitleFromApi(mov: DetailedStatementMovement) {
  if (!mov.invoice) return '';
  const inv = mov.invoice;
  return `${inv.invoiceTypeLabel} · Ara: ${formatDetailCurrency(inv.totalAmount, inv.currency)} · KDV: ${formatDetailCurrency(inv.vatAmount, inv.currency)} · Genel: ${formatDetailCurrency(inv.grandTotal, inv.currency)}`;
}
