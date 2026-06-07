import { MovementType } from '@prisma/client';
import { InvoiceType } from '../invoice.enums';
import { AccountMovementDirection } from '../types/invoice-orchestrator.types';

/**
 * Fatura tipi ve işlem tipine göre stok hareket türünü belirler.
 * 
 * @param invoiceType Fatura tipi (SALE, PURCHASE, vb.)
 * @param operationType İşlem tipi (APPROVE, CANCEL)
 * @returns MovementType veya null (SALE/PURCHASE iptallerinde stok hareketi oluşmaz)
 */
export function resolveStockMovementType(
    invoiceType: InvoiceType,
    operationType: 'APPROVE' | 'CANCEL'
): MovementType | null {
    if (operationType === 'APPROVE') {
        switch (invoiceType) {
            case InvoiceType.SALE:
                return MovementType.SALE;
            case InvoiceType.PURCHASE:
                return MovementType.ENTRY;
            case InvoiceType.SALES_RETURN:
                return MovementType.RETURN;
            case InvoiceType.PURCHASE_RETURN:
                return MovementType.EXIT;
            default:
                throw new Error(`Unknown invoice type: ${invoiceType}`);
        }
    }

    if (operationType === 'CANCEL') {
        switch (invoiceType) {
            case InvoiceType.SALE:
            case InvoiceType.PURCHASE:
                // SATIS ve ALIS fatura iptallerinde stok kaydı oluşmaz (iş kuralı).
                return null;
            case InvoiceType.SALES_RETURN:
                // SATIS_IADE iptali stoktan çıkış (iptal çıkışı) gerektirir.
                return MovementType.CANCELLATION_EXIT;
            case InvoiceType.PURCHASE_RETURN:
                // ALIS_IADE iptali stoka giriş (iptal girişi) gerektirir.
                return MovementType.CANCELLATION_ENTRY;
            default:
                throw new Error(`Unknown invoice type: ${invoiceType}`);
        }
    }

    throw new Error(`Unknown operation type: ${operationType}`);
}

/**
 * Fatura tipi ve işlem tipine göre cari hareket yönünü ve bakiye operasyonunu belirler.
 * 
 * @param invoiceType Fatura tipi
 * @param operationType İşlem tipi
 * @returns Cari hareket yönü ve bakiye operasyonu (increment/decrement)
 */
export function resolveAccountMovementDirection(
    invoiceType: InvoiceType,
    operationType: 'APPROVE' | 'CANCEL'
): { direction: AccountMovementDirection; balanceOp: 'increment' | 'decrement' } {
    if (operationType === 'APPROVE') {
        switch (invoiceType) {
            case InvoiceType.SALE:
                return { direction: AccountMovementDirection.DEBIT, balanceOp: 'increment' };
            case InvoiceType.PURCHASE:
                return { direction: AccountMovementDirection.CREDIT, balanceOp: 'decrement' };
            case InvoiceType.SALES_RETURN:
                return { direction: AccountMovementDirection.CREDIT, balanceOp: 'decrement' };
            case InvoiceType.PURCHASE_RETURN:
                return { direction: AccountMovementDirection.DEBIT, balanceOp: 'increment' };
            default:
                throw new Error(`Unknown invoice type: ${invoiceType}`);
        }
    }

    if (operationType === 'CANCEL') {
        switch (invoiceType) {
            case InvoiceType.SALE:
                // Satış iptali -> Borcu azalt (Alacak yaz)
                return { direction: AccountMovementDirection.CREDIT, balanceOp: 'decrement' };
            case InvoiceType.PURCHASE:
                // Alış iptali -> Borcu arttır (Borç yaz) veya ödemeyi azalt
                return { direction: AccountMovementDirection.DEBIT, balanceOp: 'increment' };
            case InvoiceType.SALES_RETURN:
                // Satış iade iptali -> Borcu arttır (Borç yaz)
                return { direction: AccountMovementDirection.DEBIT, balanceOp: 'increment' };
            case InvoiceType.PURCHASE_RETURN:
                // Alış iade iptali -> Alacak yaz (Bakiyeyi azalt)
                return { direction: AccountMovementDirection.CREDIT, balanceOp: 'decrement' };
            default:
                throw new Error(`Unknown invoice type: ${invoiceType}`);
        }
    }

    throw new Error(`Unknown operation type: ${operationType}`);
}
