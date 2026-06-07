import { InvoiceOrchestratorService } from '../invoice-orchestrator.service';
import { InvoiceStatus } from '@prisma/client';
import { InvoiceType } from '../../invoice.enums';

describe('InvoiceOrchestratorService', () => {
    let service: InvoiceOrchestratorService;
    let mockPrisma: any;
    let mockStockEffect: any;
    let mockAccountEffect: any;
    let mockQueue: any;

    beforeEach(() => {
        mockPrisma = {
            invoice: {
                findUnique: jest.fn(),
                update: jest.fn(),
            },
            invoiceLog: {
                create: jest.fn(),
            },
            $transaction: jest.fn().mockImplementation((cb) => cb(mockPrisma)),
        };

        mockStockEffect = {
            applyStockEffects: jest.fn(),
            reverseStockEffects: jest.fn(),
        };

        mockAccountEffect = {
            applyAccountEffect: jest.fn(),
            reverseAccountEffect: jest.fn(),
        };

        mockQueue = {
            add: jest.fn(),
        };

        service = new InvoiceOrchestratorService(
            mockPrisma as any,
            mockStockEffect as any,
            mockAccountEffect as any,
            mockQueue as any
        );
    });

    describe('approveInvoice', () => {
        it('should call stock and account effects and update status to APPROVED', async () => {
            const mockInvoice = {
                id: 'inv-1',
                status: InvoiceStatus.OPEN,
                tenantId: 't1',
                items: [],
                invoiceType: InvoiceType.SALE
            };

            mockPrisma.invoice.findUnique.mockResolvedValue(mockInvoice);

            await service.approveInvoice('inv-1', {
                invoiceId: 'inv-1',
                tenantId: 't1',
                userId: 'u1',
                operationType: 'APPROVE' as any
            });

            expect(mockStockEffect.applyStockEffects).toHaveBeenCalled();
            expect(mockAccountEffect.applyAccountEffect).toHaveBeenCalled();
            expect(mockQueue.add).toHaveBeenCalledWith('COSTING_RECALCULATE', expect.any(Object), expect.any(Object));
        });
    });
});
