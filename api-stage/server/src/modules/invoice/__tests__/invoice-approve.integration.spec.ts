import { InvoiceOrchestratorService } from '../services/invoice-orchestrator.service';
import { InvoiceStatus, MovementType } from '@prisma/client';
import { InvoiceType } from '../invoice.enums';
import { AccountMovementDirection, StockMovementDirection } from '../types/invoice-orchestrator.types';

describe('Invoice approve flow (integration)', () => {
    let orchestrator: InvoiceOrchestratorService;
    let mockPrisma: any;
    let mockStockEffect: any;
    let mockAccountEffect: any;
    let mockQueue: any;

    const tenantId = 'tenant-1';
    const userId = 'user-1';
    const accountId = 'account-1';
    const warehouseId = 'warehouse-1';
    const productId = 'product-1';

    function buildContext(invoiceId: string) {
        return {
            invoiceId,
            tenantId,
            userId,
            operationType: 'APPROVE' as any,
        };
    }

    function makeInvoice(overrides: any = {}) {
        return {
            id: 'invoice-1',
            invoiceNo: 'INV-2026-001',
            invoiceType: InvoiceType.SALE,
            tenantId,
            accountId,
            warehouseId,
            status: InvoiceStatus.OPEN,
            grandTotal: 1000,
            exchangeRate: 1,
            notes: 'Test invoice',
            items: [
                {
                    id: 'item-1',
                    productId,
                    quantity: 10,
                    unitPrice: 100,
                    unit: 'Adet',
                    product: {
                        id: productId,
                        name: 'Test Product',
                        unitRef: {
                            unitSet: {
                                units: [
                                    { name: 'Adet', isBaseUnit: true, conversionRate: 1 },
                                ],
                            },
                        },
                    },
                },
            ],
            account: {
                id: accountId,
                title: 'Test Account',
                balance: 0,
                creditLimit: 0,
            },
            ...overrides,
        };
    }

    beforeEach(() => {
        mockPrisma = {
            invoice: {
                findUnique: jest.fn(),
                update: jest.fn(),
            },
            invoiceLog: {
                create: jest.fn(),
            },
            productMovement: {
                count: jest.fn(),
                findMany: jest.fn(),
            },
            accountMovement: {
                count: jest.fn(),
                findMany: jest.fn(),
            },
            $transaction: jest.fn().mockImplementation((cb) => cb(mockPrisma)),
        };

        mockStockEffect = {
            applyStockEffects: jest.fn().mockResolvedValue([
                {
                    productId,
                    warehouseId,
                    quantity: { toNumber: () => 10 } as any,
                    direction: StockMovementDirection.OUT,
                    movementType: MovementType.SALE,
                    invoiceId: 'invoice-1',
                    invoiceItemId: 'item-1',
                    tenantId,
                },
            ]),
            reverseStockEffects: jest.fn().mockResolvedValue({ stockMovementsReversed: 1, accountMovementReversed: false }),
        };

        mockAccountEffect = {
            applyAccountEffect: jest.fn().mockResolvedValue({
                accountId,
                amount: { toNumber: () => 1000 } as any,
                direction: AccountMovementDirection.DEBIT,
                invoiceId: 'invoice-1',
                documentType: 'INVOICE',
                documentNo: 'INV-2026-001',
                date: new Date(),
                tenantId,
            }),
            reverseAccountEffect: jest.fn().mockResolvedValue({ stockMovementsReversed: 0, accountMovementReversed: true }),
        };

        mockQueue = {
            add: jest.fn(),
        };

        orchestrator = new InvoiceOrchestratorService(
            mockPrisma as any,
            mockStockEffect as any,
            mockAccountEffect as any,
            mockQueue as any
        );
    });

    describe('approveInvoice', () => {
        it('OPEN → APPROVED updates status, creates product movements and account movement', async () => {
            const invoice = makeInvoice({ status: InvoiceStatus.OPEN });
            mockPrisma.invoice.findUnique.mockResolvedValue(invoice);

            await orchestrator.approveInvoice('invoice-1', buildContext('invoice-1'));

            // Status must be APPROVED
            expect(mockPrisma.invoice.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { id: 'invoice-1' },
                    data: expect.objectContaining({ status: InvoiceStatus.APPROVED }),
                })
            );

            // Stock effect called once (1 item)
            expect(mockStockEffect.applyStockEffects).toHaveBeenCalledTimes(1);

            // Account effect called once (cari — not GL)
            expect(mockAccountEffect.applyAccountEffect).toHaveBeenCalledTimes(1);

            // Post-processing jobs enqueued
            expect(mockQueue.add).toHaveBeenCalledWith(
                'COSTING_RECALCULATE',
                expect.objectContaining({ invoiceId: 'invoice-1', tenantId }),
                expect.any(Object)
            );
            expect(mockQueue.add).toHaveBeenCalledWith(
                'RECONCILIATION_CHECK',
                expect.objectContaining({ invoiceId: 'invoice-1', tenantId }),
                expect.any(Object)
            );
        });

        it('already APPROVED invoice is idempotent', async () => {
            const invoice = makeInvoice({ status: InvoiceStatus.APPROVED });
            mockPrisma.invoice.findUnique.mockResolvedValue(invoice);

            await orchestrator.approveInvoice('invoice-1', buildContext('invoice-1'));

            // Should skip and NOT call effects
            expect(mockStockEffect.applyStockEffects).not.toHaveBeenCalled();
            expect(mockAccountEffect.applyAccountEffect).not.toHaveBeenCalled();
        });
    });

    describe('cancelInvoice', () => {
        it('APPROVED → CANCELLED reverses account effect (cari) and updates status', async () => {
            const invoice = makeInvoice({ status: InvoiceStatus.APPROVED });
            mockPrisma.invoice.findUnique.mockResolvedValue(invoice);

            await orchestrator.cancelInvoice('invoice-1', buildContext('invoice-1'), 'Test cancel');

            // Status must be CANCELLED
            expect(mockPrisma.invoice.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { id: 'invoice-1' },
                    data: expect.objectContaining({ status: InvoiceStatus.CANCELLED }),
                })
            );

            // Account effect (cari) reversed — applyAccountEffect called with CANCEL
            expect(mockAccountEffect.applyAccountEffect).toHaveBeenCalledWith(
                expect.objectContaining({ id: 'invoice-1' }),
                expect.any(Object),
                'CANCEL'
            );

            // NO stock reversal for SALE invoice (business rule: only return invoices reverse stock)
            expect(mockStockEffect.applyStockEffects).not.toHaveBeenCalled();
        });

        it('OPEN → CANCELLED does NOT call any effects (no prior stock/cari impact)', async () => {
            const invoice = makeInvoice({ status: InvoiceStatus.OPEN });
            mockPrisma.invoice.findUnique.mockResolvedValue(invoice);

            await orchestrator.cancelInvoice('invoice-1', buildContext('invoice-1'), 'Test cancel');

            // Status must still be CANCELLED
            expect(mockPrisma.invoice.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { id: 'invoice-1' },
                    data: expect.objectContaining({ status: InvoiceStatus.CANCELLED }),
                })
            );

            // No effects reversed for OPEN invoice (hasEffects = false)
            expect(mockAccountEffect.applyAccountEffect).not.toHaveBeenCalled();
            expect(mockStockEffect.applyStockEffects).not.toHaveBeenCalled();
        });

        it('already CANCELLED invoice is idempotent', async () => {
            const invoice = makeInvoice({ status: InvoiceStatus.CANCELLED });
            mockPrisma.invoice.findUnique.mockResolvedValue(invoice);

            await orchestrator.cancelInvoice('invoice-1', buildContext('invoice-1'), 'Test cancel');

            expect(mockAccountEffect.applyAccountEffect).not.toHaveBeenCalled();
            expect(mockStockEffect.applyStockEffects).not.toHaveBeenCalled();
        });
    });
});