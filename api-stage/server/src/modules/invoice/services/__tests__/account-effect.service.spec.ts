import { AccountEffectService } from '../account-effect.service';
import { InvoiceType } from '../../invoice.enums';
import { AccountMovementDirection } from '../../types/invoice-orchestrator.types';
import { Decimal } from '@prisma/client/runtime/library';

describe('AccountEffectService', () => {
    let service: AccountEffectService;
    let mockPrisma: any;
    let mockSystemParams: any;

    beforeEach(() => {
        mockPrisma = {
            account: {
                findUnique: jest.fn(),
                update: jest.fn(),
            },
            accountMovement: {
                create: jest.fn(),
            },
        };

        mockSystemParams = {
            getParameterAsBoolean: jest.fn().mockResolvedValue(true),
        };

        service = new AccountEffectService(mockPrisma as any, mockSystemParams as any);
    });

    describe('applyAccountEffect', () => {
        it('should update balance and create movement for SALE APPROVE', async () => {
            const mockInvoice = {
                id: 'inv-1',
                tenantId: 'tenant-1',
                accountId: 'acc-1',
                invoiceType: InvoiceType.SALE,
                grandTotal: new Decimal(100),
                exchangeRate: new Decimal(1),
                invoiceNo: 'S-001',
            };

            const mockAccount = { id: 'acc-1', balance: new Decimal(500), creditLimit: new Decimal(1000) };
            mockPrisma.account.findUnique.mockResolvedValue(mockAccount);
            mockPrisma.account.update.mockResolvedValue({ ...mockAccount, balance: new Decimal(600) });

            const tx = mockPrisma; // Simulation as tx

            await service.applyAccountEffect(mockInvoice, tx as any, 'APPROVE');

            expect(tx.account.update).toHaveBeenCalledWith(expect.objectContaining({
                where: { id: 'acc-1' },
                data: { balance: { increment: expect.any(Decimal) } }
            }));

            expect(tx.accountMovement.create).toHaveBeenCalled();
        });

        it('should throw error if credit limit exceeded', async () => {
            const mockInvoice = {
                id: 'inv-1',
                accountId: 'acc-1',
                invoiceType: InvoiceType.SALE,
                grandTotal: new Decimal(2000),
                exchangeRate: new Decimal(1),
            };

            const mockAccount = { id: 'acc-1', balance: new Decimal(0), creditLimit: new Decimal(1000) };
            mockPrisma.account.findUnique.mockResolvedValue(mockAccount);

            const tx = mockPrisma;

            await expect(service.applyAccountEffect(mockInvoice, tx as any, 'APPROVE'))
                .rejects.toThrow('Credit limit exceeded');
        });
    });
});
