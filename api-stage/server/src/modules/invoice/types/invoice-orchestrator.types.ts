import { Decimal } from '@prisma/client/runtime/library';
import { InvoiceStatus, MovementType } from '@prisma/client';

/**
 * Fatura üzerinde gerçekleştirilebilecek işlem tipleri
 */
export enum InvoiceOperationType {
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
    APPROVE = 'APPROVE',
    CANCEL = 'CANCEL',
}

/**
 * Stok hareket yönü
 */
export enum StockMovementDirection {
    IN = 'IN', // Giriş
    OUT = 'OUT', // Çıkış
}

/**
 * Cari hareket yönü
 */
export enum AccountMovementDirection {
    DEBIT = 'DEBIT', // Borç (Alacağımız artar)
    CREDIT = 'CREDIT', // Alacak (Borcumuz artar)
}

/**
 * Fatura işlem bağlamı (Context)
 */
export interface InvoiceOperationContext {
    invoiceId: string;
    tenantId: string;
    userId: string;
    operationType: InvoiceOperationType;
    previousStatus?: InvoiceStatus;
    newStatus?: InvoiceStatus;
}

/**
 * Stok hareketi oluşturma verisi
 */
export interface StockMovementPayload {
    productId: string;
    warehouseId: string;
    quantity: Decimal;
    direction: StockMovementDirection;
    movementType: MovementType;
    invoiceId: string;
    invoiceItemId: string;
    tenantId: string;
    notes?: string;
}

/**
 * Cari hareket oluşturma verisi
 */
export interface AccountMovementPayload {
    accountId: string;
    amount: Decimal;
    direction: AccountMovementDirection;
    invoiceId: string;
    documentType: string; // Genellikle 'INVOICE'
    documentNo: string;
    date: Date;
    tenantId: string;
    description?: string;
}

/**
 * Fatura işleminin stok ve cari üzerindeki etkisi
 */
export interface InvoiceEffectResult {
    stockMovementsCreated: number;
    accountMovementCreated: boolean;
    balanceUpdated: boolean;
    previousBalance?: Decimal;
    newBalance?: Decimal;
}

/**
 * Geri alma (reverse) işlemi sonucu
 */
export interface ReverseResult {
    stockMovementsReversed: number;
    accountMovementReversed: boolean;
}
