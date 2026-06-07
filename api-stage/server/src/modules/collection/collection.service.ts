import { TenantResolverService } from '../../common/services/tenant-resolver.service';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { SystemParameterService } from '../system-parameter/system-parameter.service';
import { AccountBalanceService } from '../account-balance/account-balance.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { CreateCrossPaymentDto } from './dto/create-cross-payment.dto';
import { CollectionType, PaymentMethod } from './collection.enums';
import { CashboxMovementType } from '@prisma/client';
import { buildTenantWhereClause } from '../../common/utils/staging.util';
import { Prisma } from '@prisma/client';
import { PaymentPlanHelperService } from '../invoice/services/payment-plan-helper.service';
import { CodeTemplateService } from '../code-template/code-template.service';
import { ModuleType } from '../code-template/code-template.enums';

@Injectable()
export class CollectionService {
  constructor(
    private prisma: PrismaService,
    private systemParameterService: SystemParameterService,
    private readonly tenantResolver: TenantResolverService,
    private accountBalanceService: AccountBalanceService,
    private paymentPlanHelper: PaymentPlanHelperService,
    private codeTemplateService: CodeTemplateService,
  ) { }

  private async nextDocumentNo(type: CollectionType, crossPayment = false): Promise<string | undefined> {
    const module = crossPayment
      ? ModuleType.CROSS_PAYMENT
      : type === CollectionType.COLLECTION
        ? ModuleType.COLLECTION_RECEIPT
        : ModuleType.PAYMENT_RECEIPT;
    try {
      return await this.codeTemplateService.getNextCode(module);
    } catch {
      return undefined;
    }
  }

  async create(dto: CreateCollectionDto, userId: string, tx?: Prisma.TransactionClient) {
    const cashboxId = (!dto.cashboxId || dto.cashboxId === 'null' || dto.cashboxId === 'undefined' || dto.cashboxId.trim() === '') ? null : dto.cashboxId;
    const bankAccountId = (!dto.bankAccountId || dto.bankAccountId === 'null' || dto.bankAccountId === 'undefined' || dto.bankAccountId.trim() === '') ? null : dto.bankAccountId;
    const companyCreditCardId = (!dto.companyCreditCardId || dto.companyCreditCardId === 'null' || dto.companyCreditCardId === 'undefined' || dto.companyCreditCardId.trim() === '') ? null : dto.companyCreditCardId;

    const tenantId = await this.tenantResolver.resolveForQuery({ userId });
    const account = await this.prisma.account.findFirst({
      where: {
        id: dto.accountId,
        ...buildTenantWhereClause(tenantId ?? undefined),
      },
      select: { id: true, salesAgentId: true, tenantId: true }
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (dto.invoiceId) {
      const invoice = await this.prisma.invoice.findFirst({
        where: {
          id: dto.invoiceId,
          ...buildTenantWhereClause(tenantId ?? undefined),
        },
      });

      if (!invoice) {
        throw new NotFoundException('Invoice not found');
      }
    }

    if (dto.serviceInvoiceId) {
      const serviceInvoice = await this.prisma.serviceInvoice.findFirst({
        where: {
          id: dto.serviceInvoiceId,
          ...buildTenantWhereClause(tenantId ?? undefined),
        },
      });
      if (!serviceInvoice) {
        throw new NotFoundException('Service invoice not found');
      }
    }

    if (cashboxId) {
      const cashbox = await this.prisma.cashbox.findFirst({
        where: {
          id: cashboxId,
          ...buildTenantWhereClause(tenantId ?? undefined),
        },
      });

      if (!cashbox) {
        throw new NotFoundException('Cashbox not found');
      }

      if (!cashbox.isActive) {
        throw new BadRequestException('Selected cashbox is not active');
      }
    }

    if (dto.type === 'PAYMENT') {
      const riskControlEnabled = await this.systemParameterService.getParameterAsBoolean(
        'CARI_RISK_CONTROL',
        false,
      );

      if (riskControlEnabled) {
        const accountWithRisk = await this.prisma.account.findFirst({
          where: {
            id: dto.accountId,
            ...buildTenantWhereClause(tenantId ?? undefined),
          },
          select: { balance: true, creditLimit: true, title: true },
        });

        const creditLimit = accountWithRisk?.creditLimit
          ? Number(accountWithRisk.creditLimit)
          : 0;

        if (creditLimit > 0) {
          const currentBalance = Number(accountWithRisk?.balance || 0);
          const newBalance = currentBalance + dto.amount;

          if (newBalance > creditLimit) {
            throw new BadRequestException(`Risk limit exceeded!`);
          }
        }
      }
    }

    const finalTenantId = account?.tenantId || tenantId || undefined;

    const executeWork = async (tx: Prisma.TransactionClient) => {
      const documentNo = await this.nextDocumentNo(dto.type);
      const collectionData: any = {
        tenantId: finalTenantId!,
        accountId: dto.accountId,
        invoiceId: dto.invoiceId,
        serviceInvoiceId: dto.serviceInvoiceId,
        type: dto.type,
        amount: dto.amount,
        date: dto.date ? new Date(dto.date) : new Date(),
        paymentType: dto.paymentMethod,
        cashboxId: cashboxId,
        bankAccountId: bankAccountId,
        companyCreditCardId: companyCreditCardId,
        notes: dto.notes,
        createdBy: userId,
        salesAgentId: dto.salesAgentId || account?.salesAgentId,
        ...(documentNo ? { documentNo } : {}),
      };
      if (dto.installmentCount !== undefined && dto.installmentCount !== null) {
        collectionData.installmentCount = dto.installmentCount;
      }

      let collection: any;
      try {
        collection = await tx.collection.create({
          data: collectionData,
          include: {
            account: true,
            cashbox: true,
            invoice: true,
            bankAccount: true,
            companyCreditCard: true,
          },
        });
      } catch (error) {
        if (!this.isUnknownInstallmentCountError(error)) {
          throw error;
        }
        delete collectionData.installmentCount;
        collection = await tx.collection.create({
          data: collectionData,
          include: {
            account: true,
            cashbox: true,
            invoice: true,
            bankAccount: true,
            companyCreditCard: true,
          },
        });
      }

      if (!dto.serviceInvoiceId) {
        await this.applyFIFO(
          tx,
          collection.id,
          dto.accountId,
          dto.type,
          dto.amount,
          finalTenantId!,
          dto.installmentCount,
        );
      }

      const accountRecord = await tx.account.findFirst({
        where: {
          id: dto.accountId,
          ...buildTenantWhereClause(finalTenantId),
        },
        select: { balance: true },
      });

      const accountBalanceDelta = dto.type === 'COLLECTION' ? -dto.amount : dto.amount;
      const newAccountBalance = accountRecord!.balance.toNumber() + accountBalanceDelta;

      await tx.accountMovement.create({
        data: {
          tenantId: finalTenantId!,
          accountId: dto.accountId,
          type: dto.type === 'COLLECTION' ? 'CREDIT' : 'DEBIT',
          amount: dto.amount as any,
          balance: newAccountBalance as any,
          notes: dto.notes || `${dto.paymentMethod} ${dto.type.toLowerCase()}`,
          documentType: 'COLLECTION',
          documentNo: collection.id,
          date: dto.date ? new Date(dto.date) : new Date(),
        },
      });

      await tx.account.updateMany({
        where: {
          id: dto.accountId,
          ...buildTenantWhereClause(finalTenantId),
        },
        data: { balance: newAccountBalance },
      });

      if (dto.cashboxId) {
        const movementType: CashboxMovementType = dto.type === 'COLLECTION' ? 'COLLECTION' : 'PAYMENT';
        const cashbox = await tx.cashbox.findFirst({
          where: {
            id: dto.cashboxId,
            ...buildTenantWhereClause(finalTenantId),
          },
          select: { balance: true },
        });

        const cashboxBalanceDelta = dto.type === 'COLLECTION' ? dto.amount : -dto.amount;
        const newCashboxBalance = cashbox!.balance.toNumber() + cashboxBalanceDelta;

        await tx.cashboxMovement.create({
          data: {
            tenantId: finalTenantId!,
            cashboxId: dto.cashboxId,
            movementType: movementType,
            amount: dto.amount,
            balance: newCashboxBalance,
            documentType: 'COLLECTION',
            documentNo: collection.id,
            accountId: dto.accountId,
            notes: dto.notes,
            date: dto.date ? new Date(dto.date) : new Date(),
            createdBy: userId,
          },
        });

        await tx.cashbox.updateMany({
          where: {
            id: dto.cashboxId,
            ...buildTenantWhereClause(finalTenantId),
          },
          data: { balance: newCashboxBalance },
        });
      }

      // Recalculate account balance after processing movements
      await this.accountBalanceService.recalculateAccountBalance(dto.accountId, tx);

      return collection;
    };

    if (tx) {
      return executeWork(tx);
    }

    return await this.prisma.$transaction(async (prisma) => {
      return executeWork(prisma as Prisma.TransactionClient);
    });
  }

  async createCrossPayment(dto: CreateCrossPaymentDto, userId: string) {
    if (dto.collectionAccountId === dto.paymentAccountId) {
      throw new BadRequestException('Collection and payment accounts must be different');
    }

    const tenantId = await this.tenantResolver.resolveForQuery({ userId });
    const collectionAccount = await this.prisma.account.findFirst({
      where: {
        id: dto.collectionAccountId,
        ...buildTenantWhereClause(tenantId ?? undefined),
      },
    });

    if (!collectionAccount) {
      throw new NotFoundException('Collection account not found');
    }

    const paymentAccount = await this.prisma.account.findFirst({
      where: {
        id: dto.paymentAccountId,
        ...buildTenantWhereClause(tenantId ?? undefined),
      },
    });

    if (!paymentAccount) {
      throw new NotFoundException('Payment account not found');
    }

    return await this.prisma.$transaction(async (tx) => {
      const date = dto.date ? new Date(dto.date) : new Date();
      const notes = dto.notes || `Cross payment: ${collectionAccount.title} -> ${paymentAccount.title}`;
      const paymentMethod = dto.paymentMethod || 'CREDIT_CARD';

      const finalTenantId = collectionAccount.tenantId || tenantId || undefined;
      const documentNo = await this.nextDocumentNo(CollectionType.COLLECTION, true);

      const collection = await tx.collection.create({
        data: {
          tenantId: finalTenantId!,
          accountId: dto.collectionAccountId,
          type: 'COLLECTION',
          amount: dto.amount,
          date,
          paymentType: paymentMethod,
          notes: notes,
          createdBy: userId,
          ...(documentNo ? { documentNo } : {}),
        },
      });

      const payment = await tx.collection.create({
        data: {
          tenantId: finalTenantId!,
          accountId: dto.paymentAccountId,
          type: 'PAYMENT',
          amount: dto.amount,
          date,
          paymentType: paymentMethod,
          notes: notes,
          createdBy: userId,
          ...(documentNo ? { documentNo: `${documentNo}-O` } : {}),
        },
      });

      await this.applyFIFO(tx, collection.id, dto.collectionAccountId, CollectionType.COLLECTION, dto.amount, finalTenantId!);
      await this.applyFIFO(tx, payment.id, dto.paymentAccountId, CollectionType.PAYMENT, dto.amount, finalTenantId!);

      const collectionAccountBefore = await tx.account.findFirst({
        where: {
          id: dto.collectionAccountId,
          ...buildTenantWhereClause(finalTenantId),
        },
        select: { balance: true },
      });
      const collectionAccountNewBalance = collectionAccountBefore!.balance.toNumber() - dto.amount;
      await tx.account.updateMany({
        where: {
          id: dto.collectionAccountId,
          ...buildTenantWhereClause(finalTenantId),
        },
        data: { balance: collectionAccountNewBalance },
      });

      const paymentAccountBefore = await tx.account.findFirst({
        where: {
          id: dto.paymentAccountId,
          ...buildTenantWhereClause(finalTenantId),
        },
        select: { balance: true },
      });
      const paymentAccountNewBalance = paymentAccountBefore!.balance.toNumber() + dto.amount;
      await tx.account.updateMany({
        where: {
          id: dto.paymentAccountId,
          ...buildTenantWhereClause(finalTenantId),
        },
        data: { balance: paymentAccountNewBalance },
      });

      await tx.accountMovement.create({
        data: {
          tenantId: finalTenantId!,
          accountId: dto.collectionAccountId,
          type: 'CREDIT',
          amount: dto.amount as any,
          balance: collectionAccountNewBalance as any,
          notes,
          documentType: 'COLLECTION',
          documentNo: collection.id,
          date,
        },
      });

      await tx.accountMovement.create({
        data: {
          tenantId: finalTenantId!,
          accountId: dto.paymentAccountId,
          type: 'DEBIT',
          amount: dto.amount as any,
          balance: paymentAccountNewBalance as any,
          notes,
          documentType: 'COLLECTION',
          documentNo: payment.id,
          date,
        },
      });

      // Recalculate account balances for both accounts
      await this.accountBalanceService.recalculateAccountBalance(dto.collectionAccountId, tx);
      await this.accountBalanceService.recalculateAccountBalance(dto.paymentAccountId, tx);

      return { collection, payment };
    });
  }

  async findAll(
    page = 1,
    limit = 50,
    type?: CollectionType,
    paymentMethod?: PaymentMethod,
    accountId?: string,
    startDate?: string,
    endDate?: string,
    cashboxId?: string,
    bankAccountId?: string,
    companyCreditCardId?: string,
  ) {
    const tenantId = await this.tenantResolver.resolveForQuery();
    const skip = (page - 1) * limit;
    const where: any = {
      deletedAt: null,
      ...buildTenantWhereClause(tenantId ?? undefined),
      OR: [
        { invoiceId: null },
        { invoice: { deletedAt: null } }
      ]
    };

    if (type) where.type = type;
    if (paymentMethod) where.paymentType = paymentMethod;
    if (accountId) where.accountId = accountId;
    if (cashboxId) where.cashboxId = cashboxId;
    if (bankAccountId) where.bankAccountId = bankAccountId;
    if (companyCreditCardId) where.companyCreditCardId = companyCreditCardId;

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) {
        // Include the full end day (23:59:59.999) for date-only filters.
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        where.date.lte = endOfDay;
      }
    }

    const [data, total] = await Promise.all([
      this.prisma.collection.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
        include: {
          account: true,
          cashbox: true,
          bankAccount: true,
          companyCreditCard: true,
          invoice: true,
        },
      }),
      this.prisma.collection.count({ where }),
    ]);

    return {
      data: data.map(item => ({
        ...item,
        cari: item.account ? {
          ...item.account,
          cariKodu: item.account.code,
          unvan: item.account.title,
          bakiye: Number(item.account.balance || 0),
        } : null,
      })),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };

  }

  async findOne(id: string) {
    const tenantId = await this.tenantResolver.resolveForQuery();
    const data = await this.prisma.collection.findFirst({
      where: {
        id,
        deletedAt: null,
        ...buildTenantWhereClause(tenantId ?? undefined),
      },
      include: { account: true, cashbox: true, invoice: true },
    });

    if (!data) throw new NotFoundException('Collection record not found');

    const movement = await this.prisma.accountMovement.findFirst({
      where: {
        documentType: 'COLLECTION',
        documentNo: id,
        accountId: data.accountId,
        ...buildTenantWhereClause(tenantId ?? undefined),
      },
      select: { balance: true },
    });

    return { ...data, remainingBalance: movement?.balance || 0 };
  }

  async getStats() {
    const today = new Date();
    const tenantId = await this.tenantResolver.resolveForQuery();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const baseWhere = {
      deletedAt: null,
      ...buildTenantWhereClause(tenantId ?? undefined),
      OR: [{ invoiceId: null }, { invoice: { deletedAt: null } }]
    };

    const [tCollection, tOdeme, aCollection, aOdeme, nCollection, kCollection] = await Promise.all([
      this.prisma.collection.aggregate({ where: { ...baseWhere, type: 'COLLECTION' }, _sum: { amount: true } }),
      this.prisma.collection.aggregate({ where: { ...baseWhere, type: 'PAYMENT' }, _sum: { amount: true } }),
      this.prisma.collection.aggregate({ where: { ...baseWhere, type: 'COLLECTION', date: { gte: startOfMonth } }, _sum: { amount: true } }),
      this.prisma.collection.aggregate({ where: { ...baseWhere, type: 'PAYMENT', date: { gte: startOfMonth } }, _sum: { amount: true } }),
      this.prisma.collection.aggregate({ where: { ...baseWhere, type: 'COLLECTION', paymentType: 'CASH' }, _sum: { amount: true } }),
      this.prisma.collection.aggregate({ where: { ...baseWhere, type: 'COLLECTION', paymentType: 'CREDIT_CARD' }, _sum: { amount: true } }),
    ]);

    return {
      totalCollection: tCollection._sum.amount || 0,
      totalPayment: tOdeme._sum.amount || 0,
      monthlyCollection: aCollection._sum.amount || 0,
      monthlyPayment: aOdeme._sum.amount || 0,
      cashCollection: nCollection._sum.amount || 0,
      creditCardCollection: kCollection._sum.amount || 0,
    };
  }

  async delete(id: string) {
    const data = await this.findOne(id);

    return await this.prisma.$transaction(async (tx) => {
      const balanceChange = data.type === 'COLLECTION' ? (data.amount as any) : -(data.amount as any);
      await tx.account.updateMany({
        where: {
          id: data.accountId,
          ...buildTenantWhereClause(data.tenantId ?? undefined),
        },
        data: { balance: { increment: balanceChange } },
      });

      if (data.cashboxId) {
        const cashboxBalanceChange = data.type === 'COLLECTION' ? -(data.amount as any) : (data.amount as any);
        await tx.cashbox.updateMany({
          where: {
            id: data.cashboxId,
            ...buildTenantWhereClause(data.tenantId ?? undefined),
          },
          data: { balance: { increment: cashboxBalanceChange } },
        });
        await tx.cashboxMovement.deleteMany({
          where: {
            documentType: 'COLLECTION',
            documentNo: id,
            ...buildTenantWhereClause(data.tenantId ?? undefined),
          },
        });
      }

      await tx.accountMovement.deleteMany({
        where: {
          documentType: 'COLLECTION',
          documentNo: id,
          ...buildTenantWhereClause(data.tenantId ?? undefined),
        },
      });
      await tx.collection.updateMany({
        where: {
          id,
          ...buildTenantWhereClause(data.tenantId ?? undefined),
        },
        data: { deletedAt: new Date() },
      });

      // Recalculate account balance after deletion
      await this.accountBalanceService.recalculateAccountBalance(data.accountId, tx);

      return { message: 'Collection record deleted' };
    });
  }

  private async applyFIFO(
    tx: any,
    collectionId: string,
    accountId: string,
    type: CollectionType,
    amount: number,
    tenantId: string,
    installmentCount?: number,
  ) {
    const invoiceType = type === 'COLLECTION' ? 'SALE' : 'PURCHASE';
    // const returnType = type === 'COLLECTION' ? 'SALES_RETURN' : 'PURCHASE_RETURN'; // İadeler borç gibi taranmamalı

    const invoices = await tx.invoice.findMany({
      where: {
        accountId,
        invoiceType: invoiceType, // Sadece ana borç faturaları
        status: { in: ['APPROVED', 'PARTIALLY_PAID'] },
        deletedAt: null,
        ...buildTenantWhereClause(tenantId ?? undefined),
      },
      orderBy: [{ date: 'asc' }, { createdAt: 'asc' }],
    });

    if (invoices.length === 0) return;

    let remainingAmount = amount;
    for (const invoice of invoices) {
      if (remainingAmount <= 0) break;
      const invoiceTotal = invoice.grandTotal.toNumber();
      const invoicePaid = invoice.paidAmount?.toNumber() || 0;
      const invoiceRemaining = Math.max(0, invoiceTotal - invoicePaid);
      if (invoiceRemaining <= 0) continue;

      const paymentAmount = Math.min(remainingAmount, invoiceRemaining);
      const invoiceCollectionData: any = {
        tenantId: invoice.tenantId,
        invoiceId: invoice.id,
        collectionId: collectionId,
        amount: paymentAmount,
      };
      if (installmentCount !== undefined && installmentCount !== null) {
        invoiceCollectionData.installmentCount = installmentCount;
      }

      try {
        await tx.invoiceCollection.create({
          data: invoiceCollectionData,
        });
      } catch (error) {
        if (!this.isUnknownInstallmentCountError(error)) {
          throw error;
        }
        delete invoiceCollectionData.installmentCount;
        await tx.invoiceCollection.create({
          data: invoiceCollectionData,
        });
      }

      const newPaid = invoicePaid + paymentAmount;
      const newPayable = Math.max(0, invoiceTotal - newPaid);
      let newStatus = invoice.status;
      if (newPayable <= 0.01) newStatus = 'CLOSED';
      else if (newPaid > 0.01) newStatus = 'PARTIALLY_PAID';
      else newStatus = 'APPROVED';

      await tx.invoice.updateMany({
        where: {
          id: invoice.id,
          ...buildTenantWhereClause(invoice.tenantId ?? undefined),
        },
        data: {
          paidAmount: newPaid,
          payableAmount: newPayable,
          status: newStatus
        },
      });

      // Payment plan taksitlerini güncelle
      await this.paymentPlanHelper.markInstallmentsAsPaid(
        invoice.id,
        paymentAmount,
        invoice.tenantId,
        tx
      );

      remainingAmount -= paymentAmount;
    }
  }

  private isUnknownInstallmentCountError(error: unknown): boolean {
    if (!error || typeof error !== 'object') return false;
    const msg = (error as any)?.message;
    return typeof msg === 'string'
      && msg.includes('Unknown argument `installmentCount`');
  }
}
