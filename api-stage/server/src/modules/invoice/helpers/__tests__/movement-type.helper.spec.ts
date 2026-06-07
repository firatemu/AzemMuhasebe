import { MovementType } from '@prisma/client';
import { InvoiceType } from '../../invoice.enums';
import { resolveStockMovementType, resolveAccountMovementDirection } from '../movement-type.helper';
import { AccountMovementDirection } from '../../types/invoice-orchestrator.types';

describe('MovementTypeHelper', () => {
    describe('resolveStockMovementType', () => {
        it('should return SALE for SALE APPROVE', () => {
            expect(resolveStockMovementType(InvoiceType.SALE, 'APPROVE')).toBe(MovementType.SALE);
        });

        it('should return null for SALE CANCEL (Business Rule)', () => {
            expect(resolveStockMovementType(InvoiceType.SALE, 'CANCEL')).toBeNull();
        });

        it('should return RETURN for SALES_RETURN APPROVE', () => {
            expect(resolveStockMovementType(InvoiceType.SALES_RETURN, 'APPROVE')).toBe(MovementType.RETURN);
        });

        it('should return CANCELLATION_EXIT for SALES_RETURN CANCEL', () => {
            expect(resolveStockMovementType(InvoiceType.SALES_RETURN, 'CANCEL')).toBe(MovementType.CANCELLATION_EXIT);
        });

        it('should return ENTRY for PURCHASE APPROVE', () => {
            expect(resolveStockMovementType(InvoiceType.PURCHASE, 'APPROVE')).toBe(MovementType.ENTRY);
        });

        it('should return EXIT for PURCHASE_RETURN APPROVE', () => {
            expect(resolveStockMovementType(InvoiceType.PURCHASE_RETURN, 'APPROVE')).toBe(MovementType.EXIT);
        });
    });

    describe('resolveAccountMovementDirection', () => {
        it('should return DEBIT/increment for SALE APPROVE', () => {
            const result = resolveAccountMovementDirection(InvoiceType.SALE, 'APPROVE');
            expect(result.direction).toBe(AccountMovementDirection.DEBIT);
            expect(result.balanceOp).toBe('increment');
        });

        it('should return CREDIT/decrement for PURCHASE APPROVE', () => {
            const result = resolveAccountMovementDirection(InvoiceType.PURCHASE, 'APPROVE');
            expect(result.direction).toBe(AccountMovementDirection.CREDIT);
            expect(result.balanceOp).toBe('decrement');
        });

        it('should return CREDIT/decrement for SALE CANCEL', () => {
            const result = resolveAccountMovementDirection(InvoiceType.SALE, 'CANCEL');
            expect(result.direction).toBe(AccountMovementDirection.CREDIT);
            expect(result.balanceOp).toBe('decrement');
        });

        it('should return DEBIT/increment for SALES_RETURN CANCEL', () => {
            const result = resolveAccountMovementDirection(InvoiceType.SALES_RETURN, 'CANCEL');
            expect(result.direction).toBe(AccountMovementDirection.DEBIT);
            expect(result.balanceOp).toBe('increment');
        });
    });
});
