import { ReconciliationService } from '../reconciliation.service';
import { InvoiceStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

describe('ReconciliationService', () => {
    let service: ReconciliationService;
    let mockPrisma: any;

    beforeEach(() => {
        mockPrisma = {
            invoice: {
                findUnique: jest.fn(),
                findMany: jest.fn(),
            },
            productMovement: {
                findMany: jest.fn(),
            },
            reconciliationLog: {
                create: jest.fn(),
            },
        };

        service = new ReconciliationService(mockPrisma as any);
    });

    describe('verifyInvoiceConsistency', () => {
        it('should return consistent: true when amounts and quantities match', async () => {
            const mockInvoice = {
                id: 'inv-1',
                status: InvoiceStatus.APPROVED,
                grandTotal: new Decimal(100),
                items: [{ id: 'item-1', productId: 'p1', quantity: 10 }],
                accountMovements: [{ amount: new Decimal(100), isReversed: false }]
            };

            mockPrisma.invoice.findUnique.mockResolvedValue(mockInvoice);
            mockPrisma.productMovement.findMany.mockResolvedValue([{ quantity: -10 }]); // Sale direction is negative in DB

            const result = await service.verifyInvoiceConsistency('inv-1', 't1');

            expect(result.isConsistent).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should return consistent: false when cari total is mismatch', async () => {
            const mockInvoice = {
                id: 'inv-1',
                status: InvoiceStatus.APPROVED,
                grandTotal: new Decimal(100),
                items: [],
                accountMovements: [{ amount: new Decimal(90), isReversed: false }]
            };

            mockPrisma.invoice.findUnique.mockResolvedValue(mockInvoice);

            const result = await service.verifyInvoiceConsistency('inv-1', 't1');

            expect(result.isConsistent).toBe(false);
            expect(
                result.errors.some((e) => typeof e === 'string' && e.includes('Cari tutar tutarsız')),
            ).toBe(true);
        });
    });
});
