import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Inject, forwardRef } from '@nestjs/common';
import { Prisma, MovementType, PaymentMethod, CollectionType, BankAccountType } from '@prisma/client';
import { InvoiceStatus, InvoiceType } from '../invoice/invoice.enums';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaService } from '../../common/prisma.service';
import { TenantResolverService } from '../../common/services/tenant-resolver.service';
import { buildTenantWhereClause } from '../../common/utils/staging.util';
import { CodeTemplateService } from '../code-template/code-template.service';
import { ModuleType } from '../code-template/code-template.enums';
import { CreatePosSaleDto, DiscountType } from './dto/create-pos-sale.dto';
import { CreatePosSessionDto } from './dto/create-pos-session.dto';
import { ClosePosSessionDto } from './dto/close-pos-session.dto';
import { CreatePosReturnDto } from './dto/create-pos-return.dto';
import { InvoiceService } from '../invoice/invoice.service';
import { CollectionService } from '../collection/collection.service';
import { SalesAgentResponseDto } from './dto/sales-agent-response.dto';
import { CashboxService } from '../cashbox/cashbox.service';
export interface BarcodeProductResult {
  id: string;
  name: string;
  barcode: string | null;
  code: string | null;
  salePrice: string;   // Decimal as string
  vatRate: number;
  stock: number;   // from product_location_stock or default 0
  hasVariants: boolean;
  productVariants: { id: string; name: string; salePrice: string }[];
}

@Injectable()
export class PosService {
  constructor(
    private prisma: PrismaService,
    private tenantResolver: TenantResolverService,
    @Inject(forwardRef(() => CodeTemplateService))
    private codeTemplateService: CodeTemplateService,
    private invoiceService: InvoiceService,
    private collectionService: CollectionService,
    private cashboxService: CashboxService,
  ) { }

  /**
   * Create DRAFT invoice for POS cart
   */
  async createDraftSale(dto: CreatePosSaleDto, userId?: string) {
    const tenantId = await this.tenantResolver.resolveForCreate({ userId });
    if (!dto.accountId) {
      throw new BadRequestException('POS satışı için müşteri (cari) seçimi zorunludur.');
    }

    // Frontend fields mapping
    const effectiveSalesAgentId = dto.salesAgentId || dto.salespersonId;
    const effectiveNotes = dto.notes || dto.note;

    return this.prisma.$transaction(async (tx) => {
      // 1. Generate Invoice Number (Required for DB)
      const invoiceNo = await this.codeTemplateService.getNextCode(ModuleType.INVOICE_SALES);

      // 2. Calculate totals
      let subtotal = 0;
      let totalVat = 0;
      let totalItemDiscount = 0;

      const invoiceItems = dto.items.map(item => {
        // Gelen birim fiyat KDV dahil (brüt) kabul edilir.
        // Veritabanı ve muhasebe için KDV hariç (net) tutara dönüştürülür.
        const inclusivePrice = item.unitPrice;
        const exclusivePrice = inclusivePrice / (1 + item.vatRate / 100);

        const itemTotal = item.quantity * exclusivePrice;

        // Item-level discount calculation
        let itemDiscount = 0;
        const discountType = item.discountType || DiscountType.PCT;

        // Use discountValue if present, otherwise fallback to discountRate as percentage
        if (item.discountValue !== undefined && item.discountValue !== null) {
          if (discountType === DiscountType.PCT) {
            itemDiscount = itemTotal * (item.discountValue / 100);
          } else {
            // FIXED amount discount
            itemDiscount = Math.min(item.discountValue * item.quantity, itemTotal);
          }
        } else if (item.discountRate && item.discountRate > 0) {
          // Backward compatibility for discountRate
          itemDiscount = itemTotal * (item.discountRate / 100);
        }

        const itemVat = (itemTotal - itemDiscount) * (item.vatRate / 100);
        const itemAmount = itemTotal - itemDiscount + itemVat;

        subtotal += itemTotal;
        totalVat += itemVat;
        totalItemDiscount += itemDiscount;

        return {
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: new Decimal(exclusivePrice),
          vatRate: item.vatRate,
          vatAmount: new Decimal(itemVat),
          amount: new Decimal(itemAmount),
          discountRate: new Decimal(item.discountRate || (discountType === DiscountType.PCT ? (item.discountValue || 0) : 0)),
          discountAmount: new Decimal(itemDiscount),
          discountType: discountType as string, // Prisma expects string from schema
          tenantId,
        };
      });

      // 3. Calculate global discount
      let globalDiscount = 0;
      const gType = dto.globalDiscount?.type || dto.globalDiscountType || DiscountType.PCT;
      const gValue = dto.globalDiscount?.value ?? dto.globalDiscountValue ?? 0;

      const afterItemDisc = subtotal - totalItemDiscount;
      if (gValue > 0 && afterItemDisc > 0) {
        if (gType === DiscountType.PCT) {
          globalDiscount = afterItemDisc * (gValue / 100);
        } else {
          globalDiscount = Math.min(gValue, afterItemDisc);
        }
        // Proportionally reduce VAT for global discount
        const ratio = globalDiscount / afterItemDisc;
        totalVat = totalVat * (1 - ratio);
      }

      const totalDiscount = totalItemDiscount + globalDiscount;
      const grandTotal = subtotal - totalDiscount + totalVat;

      // 3.5 Resolve Warehouse (Required for Stock Movements)
      let finalWarehouseId = dto.warehouseId;
      if (!finalWarehouseId) {
        const defaultWarehouse = await tx.warehouse.findFirst({
          where: {
            ...buildTenantWhereClause(tenantId ?? undefined),
            isDefault: true,
            active: true,
          },
        });
        finalWarehouseId = defaultWarehouse?.id || undefined;
      }

      // 4. Create invoice in DRAFT status with items
      const invoice = await tx.invoice.create({
        data: {
          tenantId,
          accountId: dto.accountId!,
          salesAgentId: effectiveSalesAgentId || null,
          warehouseId: finalWarehouseId,
          invoiceType: InvoiceType.SALE as any,
          status: InvoiceStatus.DRAFT as any,
          invoiceNo: invoiceNo,
          totalAmount: new Decimal(subtotal),
          vatAmount: new Decimal(totalVat),
          discount: new Decimal(totalDiscount),
          globalDiscountType: gType as string,
          globalDiscountValue: gValue ? new Decimal(gValue) : null,
          grandTotal: new Decimal(grandTotal),
          payableAmount: new Decimal(grandTotal),
          currency: 'TRY',
          exchangeRate: new Decimal(1),
          createdBy: userId,
          updatedBy: userId,
          items: {
            create: invoiceItems,
          },
        } as any, // Cast to any because IDE might have stale Prisma types
      });

      return invoice;
    });
  }

  /**
   * Complete sale transaction using central services
   */
  async completeSale(invoiceId: string, payments: any[], userId?: string, cashboxId?: string) {
    const tenantId = await this.tenantResolver.resolveForQuery({ userId });

    return this.prisma.$transaction(async (tx) => {
      const prisma = tx as Prisma.TransactionClient;

      // 1. Fetch the invoice
      const invoice = await prisma.invoice.findFirst({
        where: {
          id: invoiceId,
          ...buildTenantWhereClause(tenantId ?? undefined),
        },
        include: { items: true },
      });

      if (!invoice) {
        throw new NotFoundException('Satış kaydı bulunamadı');
      }

      if (invoice.status !== InvoiceStatus.DRAFT && invoice.status !== InvoiceStatus.OPEN) {
        throw new BadRequestException('Bu satış zaten tamamlanmış veya geçersiz durumda');
      }

      // 2. Status guard and Payment validation
      const grandTotal = Number(invoice.grandTotal);
      const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

      if (totalPaid > grandTotal + 0.01) {
        throw new BadRequestException(`Ödeme tutarı (${totalPaid.toFixed(2)}) fatura toplamını (${grandTotal.toFixed(2)}) aşamaz.`);
      }

      // 3. Update Invoice to APPROVED (triggers stock EXIT + account DEBIT)
      await this.invoiceService.changeStatus(
        invoiceId,
        InvoiceStatus.APPROVED,
        userId,
        undefined,
        undefined,
        prisma,
      );

      // 4. Process Payments (Collections via CollectionService)
      let totalCollected = 0;
      for (const payment of payments) {
        if (payment.paymentMethod === PaymentMethod.LOAN_ACCOUNT) {
          totalCollected += payment.amount;
          continue;
        }

        let resolvedCashboxId: string | null = payment.cashboxId || cashboxId || null;
        let resolvedBankAccountId: string | null = payment.bankAccountId || null;

        if (payment.paymentMethod === PaymentMethod.CASH) {
          let retailCashbox = await this.cashboxService.getRetailCashbox();

          // Fallback: If no isRetail marked, look for code "PK"
          if (!retailCashbox) {
            retailCashbox = await prisma.cashbox.findFirst({
              where: {
                code: 'PK',
                ...buildTenantWhereClause(tenantId ?? undefined, true),
                isActive: true,
              }
            });
          }

          if (!retailCashbox) {
            throw new BadRequestException('Lütfen "PK" kodlu bir kasa veya "Perakende Satış Kasası" olarak işaretlenmiş bir kasa tanımlayınız.');
          }
          resolvedCashboxId = retailCashbox.id;
        }

        if (payment.paymentMethod === PaymentMethod.CREDIT_CARD || payment.paymentMethod === PaymentMethod.BANK_TRANSFER) {
          if (!resolvedBankAccountId) {
            throw new BadRequestException('Banka hesabi secimi zorunludur.');
          }

          const bankAccount = await prisma.bankAccount.findFirst({
            where: {
              id: resolvedBankAccountId,
              ...buildTenantWhereClause(tenantId ?? undefined, true),
            },
            select: { id: true, type: true, isActive: true },
          });

          if (!bankAccount || !bankAccount.isActive) {
            throw new BadRequestException('Gecerli ve aktif bir banka hesabi seciniz.');
          }

          if (payment.paymentMethod === PaymentMethod.CREDIT_CARD && bankAccount.type !== BankAccountType.POS) {
            throw new BadRequestException('Kredi karti odemesi icin POS Hesabi seciniz.');
          }

          if (payment.paymentMethod === PaymentMethod.BANK_TRANSFER && bankAccount.type !== BankAccountType.DEMAND_DEPOSIT) {
            throw new BadRequestException('Banka havalesi icin Vadesiz Hesap seciniz.');
          }
        }

        await this.collectionService.create(
          {
            accountId: invoice.accountId,
            invoiceId: invoice.id,
            type: CollectionType.COLLECTION as any,
            amount: payment.amount,
            date: new Date().toISOString(),
            paymentMethod: payment.paymentMethod as any,
            cashboxId: resolvedCashboxId,
            bankAccountId: resolvedBankAccountId,
            companyCreditCardId: payment.companyCreditCardId || null,
            installmentCount: payment.installmentCount ?? null,
            notes: `POS Satış Tahsilatı: ${invoice.invoiceNo}`,
          } as any,
          userId!,
          prisma,
        );
        totalCollected += payment.amount;
      }

      // 5. Determine final status
      let finalStatus: InvoiceStatus;
      if (Math.abs(totalCollected - grandTotal) < 0.01) {
        finalStatus = InvoiceStatus.CLOSED;
      } else if (totalCollected > 0) {
        finalStatus = InvoiceStatus.PARTIALLY_PAID;
      } else {
        finalStatus = InvoiceStatus.APPROVED;
      }

      // Update invoice: final status + paidAmount
      await prisma.invoice.update({
        where: { id: invoiceId },
        data: {
          status: finalStatus as any,
          paidAmount: new Decimal(totalCollected),
          updatedBy: userId,
        },
      });

      // 6. Final Audit Log
      await prisma.invoiceLog.create({
        data: {
          tenantId: tenantId!,
          invoiceId: invoiceId,
          userId,
          actionType: 'STATUS_CHANGE',
          changes: JSON.stringify({ oldStatus: invoice.status, newStatus: finalStatus }),
        },
      });

      return {
        invoiceId,
        invoiceNumber: invoice.invoiceNo,
        grandTotal: grandTotal.toString(),
        paidAmount: totalCollected.toString(),
        status: finalStatus,
      };
    });
  }

  /**
   * Create return transaction with ACID guarantees
   */
  async createReturn(dto: CreatePosReturnDto, userId?: string) {
    const tenantId = await this.tenantResolver.resolveForCreate({ userId });

    const originalInvoice = await this.prisma.invoice.findFirst({
      where: {
        id: dto.originalInvoiceId,
        ...buildTenantWhereClause(tenantId ?? undefined),
        deletedAt: null,
      },
      include: {
        items: true,
        account: true,
      },
    });

    if (!originalInvoice) {
      throw new NotFoundException('Orijinal fatura bulunamadı');
    }

    return this.prisma.$transaction(async (tx) => {
      // Generate invoice number
      const invoiceNumber = await this.codeTemplateService.getNextCode(ModuleType.INVOICE_SALES);

      // Create return invoice
      const returnInvoice = await tx.invoice.create({
        data: {
          tenantId,
          accountId: originalInvoice.accountId,
          invoiceType: InvoiceType.SALES_RETURN,
          status: InvoiceStatus.DRAFT as any,
          invoiceNo: invoiceNumber,
          totalAmount: new Decimal(dto.totalAmount),
          vatAmount: new Decimal(0),
          discount: new Decimal(0),
          grandTotal: new Decimal(dto.totalAmount),
          payableAmount: new Decimal(dto.totalAmount),
          paidAmount: new Decimal(0),
          currency: 'TRY',
          exchangeRate: new Decimal(1),
          notes: (dto.notes || '') + ' [İade orijinal fatura: ' + dto.originalInvoiceId + ']',
          createdBy: userId,
          updatedBy: userId,
          items: {
            create: dto.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: new Decimal(item.unitPrice),
              vatRate: item.vatRate,
              vatAmount: new Decimal(0),
              amount: new Decimal(item.quantity * item.unitPrice),
              discountRate: new Decimal(0),
              discountAmount: new Decimal(0),
              tenantId,
            })),
          },
        },
      });

      // Approve return (processes stock and balance back)
      await this.invoiceService.changeStatus(
        returnInvoice.id,
        InvoiceStatus.APPROVED,
        userId,
        undefined,
        undefined,
        tx as any,
      );

      // Create refund payment if not LOAN_ACCOUNT
      if (dto.paymentMethod !== PaymentMethod.LOAN_ACCOUNT) {
        await this.collectionService.create(
          {
            accountId: originalInvoice.accountId,
            invoiceId: returnInvoice.id,
            type: CollectionType.PAYMENT as any,
            amount: dto.totalAmount,
            date: new Date().toISOString(),
            paymentMethod: dto.paymentMethod as any,
            notes: `İade Ödemesi: ${invoiceNumber}`,
          } as any,
          userId!,
          tx as any,
        );
      }

      return {
        id: returnInvoice.id,
        invoiceNo: returnInvoice.invoiceNo,
        status: 'SUCCESS',
      };
    });
  }

  /**
   * Create POS cashier session
   */
  async createSession(dto: CreatePosSessionDto, userId?: string) {
    const tenantId = await this.tenantResolver.resolveForCreate({ userId });

    // Generate session number
    const sessionNo = await this.codeTemplateService.getNextCode(ModuleType.POS_CONSOLE);

    return this.prisma.posSession.create({
      data: {
        tenantId,
        cashierId: dto.cashierId,
        cashboxId: dto.cashboxId,
        openingAmount: new Decimal(dto.openingAmount),
        status: 'OPEN',
        sessionNo,
        createdBy: userId,
        updatedBy: userId,
      },
    });
  }

  /**
   * Close POS cashier session
   */
  async closeSession(sessionId: string, dto: ClosePosSessionDto, userId?: string) {
    const tenantId = await this.tenantResolver.resolveForQuery();

    const session = await this.prisma.posSession.findFirst({
      where: {
        id: sessionId,
        ...buildTenantWhereClause(tenantId ?? undefined),
      },
    });

    if (!session) {
      throw new NotFoundException('Oturum bulunamadı');
    }

    if (session.status !== 'OPEN') {
      throw new BadRequestException('Sadece açık oturumlar kapatılabilir');
    }

    return this.prisma.posSession.updateMany({
      where: {
        id: sessionId,
        ...buildTenantWhereClause(tenantId ?? undefined),
      },
      data: {
        closingAmount: new Decimal(dto.closingAmount),
        closingNotes: dto.closingNotes,
        status: 'CLOSED',
        closedAt: new Date(),
        updatedBy: userId,
      },
    });
  }

  /**
   * Searches for products by barcode or product code.
   * Returns all fields needed for the POS cart (price, VAT, stock, variants).
   */
  /**
   * Searches for products by barcode or product code.
   * Returns all fields needed for the POS cart (price, VAT, stock, variants).
   */
  async getProductsByBarcode(
    barcode: string,
    tenantId?: string,
  ): Promise<BarcodeProductResult[]> {
    const resolvedTenantId =
      tenantId ?? (await this.tenantResolver.resolveForQuery());

    const products = await this.prisma.product.findMany({
      where: {
        ...buildTenantWhereClause(resolvedTenantId ?? undefined),
        deletedAt: null,
        OR: [
          { barcode: { equals: barcode, mode: 'insensitive' } },
          { code: { equals: barcode, mode: 'insensitive' } },
          {
            productBarcodes: {
              some: {
                barcode: { equals: barcode, mode: 'insensitive' },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        barcode: true,
        code: true,
        vatRate: true,
        priceCards: {
          where: {
            type: 'SALE',
            isActive: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        productLocationStocks: {
          where: {
            ...buildTenantWhereClause(resolvedTenantId ?? undefined),
          },
          select: { qtyOnHand: true },
        },
      },
    });

    return products.map(p => {
      const salePrice = (p as any).priceCards?.length > 0 ? (p as any).priceCards[0].price.toString() : '0';
      const totalStock = (p as any).productLocationStocks?.reduce((sum: number, s: any) => sum + (s.qtyOnHand || 0), 0) || 0;

      return {
        id: p.id,
        name: p.name,
        barcode: p.barcode,
        code: p.code,
        salePrice,
        vatRate: p.vatRate ?? 20,
        stock: totalStock,
        hasVariants: false,
        productVariants: [],
      };
    });
  }

  /**
   * Returns active sales agents for the current tenant.
   * Used by the POS frontend SelectorBox for salesperson selection.
   */
  async getSalesAgents(search?: string): Promise<SalesAgentResponseDto[]> {
    const tenantId = await this.tenantResolver.resolveForQuery();

    const agents = await this.prisma.salesAgent.findMany({
      where: {
        ...buildTenantWhereClause(tenantId ?? undefined),
        isActive: true,
        ...(search && search.trim().length > 0
          ? {
            fullName: {
              contains: search.trim(),
              mode: 'insensitive',
            },
          }
          : {}),
      },
      select: {
        id: true,
        fullName: true,
        phone: true,
        email: true,
        isActive: true,
      },
      orderBy: { fullName: 'asc' },
      take: 20,
    });

    return agents.map(SalesAgentResponseDto.fromPrisma);
  }

  /**
   * Get active carts (DRAFT/OPEN invoices) for a cashier
   */
  async getActiveCarts(cashierId?: string) {
    const tenantId = await this.tenantResolver.resolveForQuery();

    return this.prisma.invoice.findMany({
      where: {
        ...buildTenantWhereClause(tenantId ?? undefined),
        invoiceType: InvoiceType.SALE,
        status: { in: [InvoiceStatus.DRAFT, InvoiceStatus.OPEN] },
        deletedAt: null,
        createdBy: cashierId,
      },
      include: {
        items: { include: { product: true } },
        account: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Delete draft cart
   */
  async deleteDraftCart(invoiceId: string, userId?: string) {
    const tenantId = await this.tenantResolver.resolveForQuery();

    const invoice = await this.prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        ...buildTenantWhereClause(tenantId ?? undefined),
        deletedAt: null,
      },
    });

    if (!invoice) {
      throw new NotFoundException('Fatura bulunamadı');
    }

    if (invoice.status !== InvoiceStatus.DRAFT && invoice.status !== InvoiceStatus.OPEN) {
      throw new BadRequestException('Sadece taslak faturalar silinebilir');
    }

    return this.prisma.invoice.updateMany({
      where: {
        id: invoiceId,
        ...buildTenantWhereClause(tenantId ?? undefined),
      },
      data: {
        deletedAt: new Date(),
        deletedBy: userId,
      },
    });
  }

  async getRetailCashbox() {
    return this.cashboxService.getRetailCashbox();
  }

  async getBankAccountsByType(type: BankAccountType) {
    const tenantId = await this.tenantResolver.resolveForQuery();

    const whereClause: Prisma.BankAccountWhereInput = {
      type,
      isActive: true,
    };

    // Some legacy accounts may have null tenantId on bank_accounts.
    // In that case, fall back to the parent bank's tenant ownership.
    if (tenantId) {
      whereClause.OR = [
        { tenantId },
        { tenantId: null, bank: { tenantId } },
      ];
    }

    return this.prisma.bankAccount.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        accountNo: true,
        iban: true,
        type: true,
        bank: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [{ bank: { name: 'asc' } }, { name: 'asc' }],
    });
  }
}
