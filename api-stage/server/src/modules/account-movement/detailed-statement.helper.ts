import type { AccountMovement, Collection, Invoice, InvoiceItem, Product } from '@prisma/client';

export const DETAILED_STATEMENT_MAX_MOVEMENTS = 500;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type DetailKind = 'invoice' | 'collection' | 'check' | 'generic';

export interface DetailIncludeFlags {
    invoiceLines: boolean;
    collections: boolean;
    checks: boolean;
}

type CheckBillSummary = {
    id: string;
    type: string;
    checkNo?: string | null;
    serialNo?: string | null;
    amount: unknown;
    dueDate?: Date | null;
    status?: string | null;
    bank?: string | null;
};

type MovementWithRelations = AccountMovement & {
    invoice?: (Invoice & {
        items?: (InvoiceItem & { product?: Pick<Product, 'name' | 'code'> | null })[];
    }) | null;
    checkBill?: CheckBillSummary | null;
};

export function resolveDetailKind(m: Pick<AccountMovement, 'documentType' | 'documentNo' | 'invoiceId' | 'checkBillId'> & {
    invoice?: unknown;
    checkBill?: unknown;
}): DetailKind {
    if (m.documentType === 'INVOICE' || m.invoiceId || m.invoice) return 'invoice';
    if (
        m.documentType === 'COLLECTION' ||
        m.documentType === 'PAYMENT' ||
        (m.documentNo && UUID_RE.test(m.documentNo) && !m.invoiceId && !m.checkBillId)
    ) {
        return 'collection';
    }
    if (
        m.checkBillId ||
        m.checkBill ||
        ['CHECK_ENTRY', 'CHECK_EXIT', 'CHECK_PROMISSORY', 'RETURN'].includes(m.documentType || '')
    ) {
        return 'check';
    }
    return 'generic';
}

export function getDocumentTypeLabel(documentType?: string | null): string {
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
    };
    return documentType ? map[documentType] ?? documentType : '-';
}

export function getInvoiceTypeLabel(type: string): string {
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

export interface DetailedMovementDto {
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
        date: string;
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
        id: string;
        type: string;
        typeLabel: string;
        documentNo: string | null;
        date: string;
        amount: number;
        paymentType: string;
        paymentTypeLabel: string;
        cashboxOrBank: string;
        linkedInvoiceNo: string | null;
        notes: string | null;
    };
    checkBill?: {
        id: string;
        type: string;
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

function getCollectionTypeLabel(type?: string) {
    if (type === 'PAYMENT') return 'Ödeme';
    if (type === 'COLLECTION') return 'Tahsilat';
    return type || '-';
}

function getPaymentMethodLabel(method?: string) {
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

function getCheckTypeLabel(type?: string) {
    if (type === 'CHECK') return 'Çek';
    if (type === 'PROMISSORY') return 'Senet';
    return type || '-';
}

function mapInvoice(
    invoice: NonNullable<MovementWithRelations['invoice']>,
): DetailedMovementDto['invoice'] {
    return {
        id: invoice.id,
        invoiceNo: invoice.invoiceNo,
        invoiceType: invoice.invoiceType,
        invoiceTypeLabel: getInvoiceTypeLabel(invoice.invoiceType),
        date: invoice.date.toISOString(),
        totalAmount: Number(invoice.totalAmount),
        vatAmount: Number(invoice.vatAmount),
        grandTotal: Number(invoice.grandTotal),
        currency: invoice.currency,
        items: (invoice.items ?? []).map((item) => ({
            id: item.id,
            productCode: item.product?.code ?? '-',
            productName: item.product?.name ?? '-',
            quantity: Number(item.quantity),
            unit: item.unit || 'Adet',
            unitPrice: Number(item.unitPrice),
            vatRate: Number(item.vatRate),
            amount: Number(item.amount),
        })),
    };
}

function mapCollection(
    col: Collection & {
        cashbox?: { name: string } | null;
        bankAccount?: { name: string } | null;
        invoice?: { invoiceNo: string } | null;
    },
): DetailedMovementDto['collection'] {
    return {
        id: col.id,
        type: col.type,
        typeLabel: getCollectionTypeLabel(col.type),
        documentNo: col.documentNo ?? col.id,
        date: col.date.toISOString(),
        amount: Number(col.amount),
        paymentType: col.paymentType,
        paymentTypeLabel: getPaymentMethodLabel(col.paymentType),
        cashboxOrBank: col.cashbox?.name || col.bankAccount?.name || '-',
        linkedInvoiceNo: col.invoice?.invoiceNo ?? null,
        notes: col.notes,
    };
}

function mapCheckBill(check: CheckBillSummary): DetailedMovementDto['checkBill'] {
    return {
        id: check.id,
        type: check.type,
        typeLabel: getCheckTypeLabel(check.type),
        checkNo: check.checkNo,
        serialNo: check.serialNo,
        dueDate: check.dueDate ? check.dueDate.toISOString() : null,
        amount: Number(check.amount),
        bank: check.bank,
        status: check.status,
    };
}

export function mapMovementToDetailed(
    m: MovementWithRelations,
    collectionMap: Map<string, Collection & { cashbox?: { name: string } | null; bankAccount?: { name: string } | null; invoice?: { invoiceNo: string } | null }>,
    flags: DetailIncludeFlags,
): DetailedMovementDto {
    const kind = resolveDetailKind(m);
    const base: DetailedMovementDto = {
        id: m.id,
        date: m.date.toISOString(),
        type: m.type,
        amount: Number(m.amount),
        balance: Number(m.balance),
        documentType: m.documentType,
        documentTypeLabel: getDocumentTypeLabel(m.documentType),
        documentNo: m.documentNo,
        notes: m.notes,
        detailKind: kind,
    };

    if (kind === 'invoice' && flags.invoiceLines && m.invoice) {
        base.invoice = mapInvoice(m.invoice);
    } else if (kind === 'collection' && flags.collections) {
        const colId = m.documentNo && UUID_RE.test(m.documentNo) ? m.documentNo : null;
        const col = colId ? collectionMap.get(colId) : undefined;
        if (col) base.collection = mapCollection(col);
    } else if (kind === 'check' && flags.checks && m.checkBill) {
        base.checkBill = mapCheckBill(m.checkBill);
    } else if (kind === 'generic') {
        base.genericFields = [
            { label: 'Belge Tipi', value: getDocumentTypeLabel(m.documentType) },
            { label: 'Belge No', value: m.documentNo || '-' },
            { label: 'Açıklama', value: m.notes || '-' },
            { label: 'Tutar', value: Number(m.amount).toLocaleString('tr-TR', { minimumFractionDigits: 2 }) + ' ₺' },
        ];
    }

    return base;
}

export function collectCollectionIds(movements: MovementWithRelations[]): string[] {
    const ids = new Set<string>();
    for (const m of movements) {
        if (resolveDetailKind(m) !== 'collection') continue;
        if (m.documentNo && UUID_RE.test(m.documentNo)) ids.add(m.documentNo);
    }
    return [...ids];
}
