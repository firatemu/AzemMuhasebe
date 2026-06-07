import { CollectionService } from '../collection.service';
import { CollectionType, PaymentMethod } from '../collection.enums';

describe('CollectionService', () => {
  let service: CollectionService;
  let mockPrisma: any;
  let mockTenantResolver: any;
  let mockSystemParameter: any;
  let mockAccountBalance: any;
  let mockPaymentPlanHelper: any;
  let mockCodeTemplate: any;

  const mockAccount = {
    id: 'acc-1',
    tenantId: 'tenant-1',
    title: 'Test Account',
    balance: { toNumber: () => 1000 },
    creditLimit: 0,
    salesAgentId: 'agent-1',
  };

  const mockInvoice = {
    id: 'inv-1',
    tenantId: 'tenant-1',
    accountId: 'acc-1',
    status: 'APPROVED',
    invoiceType: 'SALE',
    grandTotal: { toNumber: () => 500 },
    paidAmount: { toNumber: () => 0 },
    deletedAt: null,
  };

  const mockCollection = {
    id: 'col-1',
    tenantId: 'tenant-1',
    accountId: 'acc-1',
    invoiceId: 'inv-1',
    type: 'COLLECTION',
    amount: 200,
    date: new Date(),
    paymentType: 'CASH',
    notes: null,
    createdBy: 'user-1',
    salesAgentId: 'agent-1',
    account: mockAccount,
    invoice: mockInvoice,
    cashbox: null,
    bankAccount: null,
    companyCreditCard: null,
  };

  beforeEach(() => {
    mockPrisma = {
      account: {
        findFirst: jest.fn(),
        updateMany: jest.fn(),
      },
      invoice: {
        findFirst: jest.fn(),
        updateMany: jest.fn(),
        findMany: jest.fn(),
      },
      cashbox: { findFirst: jest.fn() },
      collection: { create: jest.fn(), findFirst: jest.fn() },
      accountMovement: { create: jest.fn() },
      cashboxMovement: { create: jest.fn() },
      $transaction: jest.fn().mockImplementation((cb) => cb(mockPrisma)),
      invoiceCollection: { create: jest.fn() },
    };

    mockTenantResolver = {
      resolveForQuery: jest.fn().mockResolvedValue('tenant-1'),
      resolveForCreate: jest.fn().mockResolvedValue('tenant-1'),
    };

    mockSystemParameter = {
      getParameterAsBoolean: jest.fn().mockResolvedValue(false),
    };

    mockAccountBalance = {
      recalculateAccountBalance: jest.fn(),
    };

    mockPaymentPlanHelper = {
      markInstallmentsAsPaid: jest.fn(),
    };

    mockCodeTemplate = {
      getNextCode: jest.fn().mockResolvedValue('COL-001'),
    };

    service = new CollectionService(
      mockPrisma as any,
      mockSystemParameter as any,
      mockTenantResolver as any,
      mockAccountBalance as any,
      mockPaymentPlanHelper as any,
      mockCodeTemplate as any,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a collection linked to an invoice via invoiceCollection', async () => {
      mockPrisma.account.findFirst.mockResolvedValue(mockAccount);
      mockPrisma.invoice.findFirst.mockResolvedValue(mockInvoice);
      mockPrisma.cashbox.findFirst.mockResolvedValue(null);
      mockPrisma.collection.create.mockResolvedValue(mockCollection);
      mockPrisma.invoice.findMany.mockResolvedValue([]);
      mockPrisma.invoice.updateMany.mockResolvedValue({ count: 1 });

      const dto = {
        accountId: 'acc-1',
        invoiceId: 'inv-1',
        type: CollectionType.COLLECTION,
        amount: 200,
        paymentMethod: PaymentMethod.CASH,
      };

      const result = await service.create(dto, 'user-1');

      expect(result).toBeDefined();
      expect(result.id).toBe('col-1');
      expect(mockPrisma.collection.create).toHaveBeenCalled();
    });

    it('should reject when amount exceeds remaining invoice debt', async () => {
      const partiallyPaidInvoice = {
        id: 'inv-1',
        tenantId: 'tenant-1',
        accountId: 'acc-1',
        status: 'PARTIALLY_PAID',
        invoiceType: 'SALE',
        grandTotal: { toNumber: () => 500 },
        paidAmount: { toNumber: () => 100 },
        deletedAt: null,
      };

      mockPrisma.account.findFirst.mockResolvedValue(mockAccount);
      mockPrisma.invoice.findFirst.mockResolvedValue(partiallyPaidInvoice);
      mockPrisma.cashbox.findFirst.mockResolvedValue(null);
      mockPrisma.invoice.findMany.mockResolvedValue([partiallyPaidInvoice]);

      const dto = {
        accountId: 'acc-1',
        invoiceId: 'inv-1',
        type: CollectionType.COLLECTION,
        amount: 600,
        paymentMethod: PaymentMethod.CASH,
      };

      await expect(service.create(dto, 'user-1')).rejects.toThrow();
    });

    it('should throw NotFoundException when account does not exist', async () => {
      mockPrisma.account.findFirst.mockResolvedValue(null);

      const dto = {
        accountId: 'nonexistent',
        type: CollectionType.COLLECTION,
        amount: 100,
        paymentMethod: PaymentMethod.CASH,
      };

      await expect(service.create(dto, 'user-1')).rejects.toThrow('Account not found');
    });

    it('should throw NotFoundException when invoice does not exist', async () => {
      mockPrisma.account.findFirst.mockResolvedValue(mockAccount);
      mockPrisma.invoice.findFirst.mockResolvedValue(null);

      const dto = {
        accountId: 'acc-1',
        invoiceId: 'nonexistent',
        type: CollectionType.COLLECTION,
        amount: 100,
        paymentMethod: PaymentMethod.CASH,
      };

      await expect(service.create(dto, 'user-1')).rejects.toThrow('Invoice not found');
    });
  });
});