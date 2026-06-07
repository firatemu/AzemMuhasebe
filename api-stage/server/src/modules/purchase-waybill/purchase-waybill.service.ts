// CHANGED: createDeliveryNote, updateDeliveryNote, cancelDeliveryNote
// REASON: purchase workflow status automation v2
import {

  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { TenantResolverService } from '../../common/services/tenant-resolver.service';
import { buildTenantWhereClause } from '../../common/utils/staging.util';
import { CodeTemplateService } from '../code-template/code-template.service';
import { CreatePurchaseWaybillDto } from './dto/create-purchase-waybill.dto';
import { UpdatePurchaseWaybillDto } from './dto/update-purchase-waybill.dto';
import { FilterPurchaseWaybillDto } from './dto/filter-purchase-waybill.dto';
import { DeliveryNoteSourceType, DeliveryNoteStatus, Prisma, LogAction } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

import { StatusCalculatorService } from '../shared/status-calculator/status-calculator.service';
import { PurchaseStatusCalculatorService } from '../shared/purchase-status-calculator/purchase-status-calculator.service';

@Injectable()
export class PurchaseWaybillService {
  constructor(
    private prisma: PrismaService,
    private tenantResolver: TenantResolverService,
    private codeTemplateService: CodeTemplateService,
    private statusCalculator: StatusCalculatorService,
    private purchaseStatusCalculator: PurchaseStatusCalculatorService,
  ) { }

  private async createLog(
    deliveryNoteId: string,
    actionType: LogAction,
    userId?: string,
    changes?: any,
    ipAddress?: string,
    userAgent?: string,
    tx?: Prisma.TransactionClient,
  ) {
    const prisma = tx || this.prisma;
    await prisma.purchaseDeliveryNoteLog.create({
      data: {
        deliveryNoteId,
        userId,
        actionType,
        changes: changes ? JSON.stringify(changes) : null,
        ipAddress,
        userAgent,
      },
    });
  }

  async findAll(filterDto: FilterPurchaseWaybillDto) {
    const tenantId = await this.tenantResolver.resolveForQuery();
    const page = filterDto.page ? parseInt(filterDto.page, 10) : 1;
    const limit = filterDto.limit ? parseInt(filterDto.limit, 10) : 50;
    const skip = (page - 1) * limit;

    const where: Prisma.PurchaseDeliveryNoteWhereInput = {
      deletedAt: null,
      ...buildTenantWhereClause(tenantId ?? undefined),
    };

    if (filterDto.status) {
      where.status = filterDto.status;
    }

    if (filterDto.accountId) {
      where.accountId = filterDto.accountId;
    }

    if (filterDto.search) {
      where.OR = [
        { deliveryNoteNo: { contains: filterDto.search, mode: 'insensitive' } },
        { account: { title: { contains: filterDto.search, mode: 'insensitive' } } },
        { account: { code: { contains: filterDto.search, mode: 'insensitive' } } },
      ];
    }

    if (filterDto.startDate && filterDto.endDate) {
      where.date = {
        gte: new Date(filterDto.startDate),
        lte: new Date(filterDto.endDate),
      };
    } else if (filterDto.startDate) {
      where.date = {
        gte: new Date(filterDto.startDate),
      };
    } else if (filterDto.endDate) {
      where.date = {
        lte: new Date(filterDto.endDate),
      };
    }

    const [data, total] = await Promise.all([
      this.prisma.purchaseDeliveryNote.findMany({
        where,
        skip,
        take: limit,
        include: {
          account: {
            select: {
              id: true,
              code: true,
              title: true,
              type: true,
            },
          },
          warehouse: {
            select: {
              id: true,
              name: true,
            },
          },
          sourceOrder: {
            select: {
              id: true,
              orderNo: true,
            },
          },
          createdByUser: {
            select: {
              id: true,
              fullName: true,
              username: true,
            },
          },
          invoice: {
            select: {
              id: true,
              invoiceNo: true,
              deletedAt: true,
            },
          },
          _count: {
            select: {
              items: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.purchaseDeliveryNote.count({ where }),
    ]);

    const mappedData = data.map(item => ({
      ...item,
      irsaliyeNo: item.deliveryNoteNo,
      irsaliyeTarihi: item.date,
      durum: item.status,
      genelToplam: item.grandTotal ? Number(item.grandTotal) : 0,
      subtotal: item.subtotal ? Number(item.subtotal) : 0,
      grandTotal: item.grandTotal ? Number(item.grandTotal) : 0,
      discount: item.discount ? Number(item.discount) : 0,
      vatAmount: item.vatAmount ? Number(item.vatAmount) : 0,
      invoiceNos:
        item.invoice && !item.invoice.deletedAt
          ? [item.invoice.invoiceNo]
          : [],
      account: item.account ? {
        ...item.account,
        accountCode: item.account.code,
      } : null,
    }));

    return {
      data: mappedData,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const deliveryNote = await this.prisma.purchaseDeliveryNote.findUnique({
      where: { id },
      include: {
        account: true,
        warehouse: true,
        sourceOrder: {
          include: {
            account: {
              select: {
                id: true,
                code: true,
                title: true,
              },
            },
          },
        },
        items: {
          include: {
            product: true,
          },
        },
        invoice: {
          select: {
            id: true,
            invoiceNo: true,
            date: true,
            deletedAt: true,
          },
        },
        createdByUser: {
          select: {
            id: true,
            fullName: true,
            username: true,
          },
        },
        updatedByUser: {
          select: {
            id: true,
            fullName: true,
            username: true,
          },
        },
      },
    });

    if (!deliveryNote) {
      throw new NotFoundException(`Waybill not found: ${id}`);
    }

    const faturalar =
      deliveryNote.invoice && !deliveryNote.invoice.deletedAt
        ? [
            {
              id: deliveryNote.invoice.id,
              faturaNo: deliveryNote.invoice.invoiceNo,
              tarih: deliveryNote.invoice.date,
            },
          ]
        : [];

    return {
      ...(deliveryNote as any),
      irsaliyeNo: deliveryNote.deliveryNoteNo,
      irsaliyeTarihi: deliveryNote.date,
      durum: deliveryNote.status,
      genelToplam: deliveryNote.grandTotal ? Number(deliveryNote.grandTotal) : 0,
      toplamTutar: deliveryNote.subtotal ? Number(deliveryNote.subtotal) : 0,
      subtotal: deliveryNote.subtotal ? Number(deliveryNote.subtotal) : 0,
      grandTotal: deliveryNote.grandTotal ? Number(deliveryNote.grandTotal) : 0,
      discount: deliveryNote.discount ? Number(deliveryNote.discount) : 0,
      vatAmount: deliveryNote.vatAmount ? Number(deliveryNote.vatAmount) : 0,
      iskonto: deliveryNote.discount ? Number(deliveryNote.discount) : 0,
      kdvTutar: deliveryNote.vatAmount ? Number(deliveryNote.vatAmount) : 0,
      aciklama: deliveryNote.notes,
      invoiceNos: faturalar.map((f) => f.faturaNo),

      cari: deliveryNote.account
        ? {
            id: deliveryNote.account.id,
            cariKodu: deliveryNote.account.code,
            unvan: deliveryNote.account.title,
            tip: (deliveryNote.account as any).type || 'Tedarikçi',
          }
        : null,

      kalemler: (deliveryNote.items || []).map((item: any) => ({
        id: item.id,
        stokId: item.productId,
        stok: item.product
          ? {
              id: item.product.id,
              stokKodu: item.product.code,
              stokAdi: item.product.name,
              birim: item.product.unit || null,
            }
          : null,
        birim: item.product?.unit || null,
        miktar: Number(item.quantity),
        birimFiyat: Number(item.unitPrice),
        kdvOrani: Number(item.vatRate),
        kdvTutar: Number(item.vatAmount),
        tutar: Number(item.totalAmount) - Number(item.vatAmount),
      })),

      kaynakTip:
        deliveryNote.sourceType === 'ORDER'
          ? 'SIPARIS'
          : deliveryNote.sourceType === 'INVOICE_AUTOMATIC'
            ? 'FATURA_OTOMATIK'
            : 'DOGRUDAN',
      kaynakSiparis: deliveryNote.sourceOrder
        ? {
            id: deliveryNote.sourceOrder.id,
            siparisNo: deliveryNote.sourceOrder.orderNo,
          }
        : null,

      faturalar,

      account: deliveryNote.account
        ? {
            ...(deliveryNote.account as any),
            accountCode: deliveryNote.account.code,
          }
        : null,
      warehouse: deliveryNote.warehouse,
      items: deliveryNote.items,
      invoice: deliveryNote.invoice,
    };
  }

  async getPendingByAccount(accountId: string) {
    const tenantId = await this.tenantResolver.resolveForQuery();

    const pendingNotes = await this.prisma.purchaseDeliveryNote.findMany({
      where: {
        accountId,
        status: 'NOT_INVOICED',
        deletedAt: null,
        ...buildTenantWhereClause(tenantId ?? undefined),
      },
      include: {
        account: {
          select: { id: true, code: true, title: true },
        },
        items: {
          include: {
            product: { select: { id: true, name: true, code: true } },
          },
        },
        sourceOrder: {
          select: { id: true, orderNo: true },
        },
      },
      orderBy: { date: 'desc' },
    });

    return pendingNotes;
  }

  async create(
    createDto: CreatePurchaseWaybillDto,
    userId?: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const { items, ...deliveryNoteData } = createDto;

    const tenantId = await this.tenantResolver.resolveForCreate({ userId });

    const validItems = items.filter(i => i.productId && i.productId.trim() !== '');
    if (validItems.length === 0) {
      throw new BadRequestException('At least one item must be added');
    }

    const existingWaybill = await this.prisma.purchaseDeliveryNote.findFirst({
      where: {
        deliveryNoteNo: deliveryNoteData.deliveryNoteNo,
        ...buildTenantWhereClause(tenantId ?? undefined),
      },
    });

    if (existingWaybill) {
      throw new BadRequestException(
        `Waybill number already exists: ${deliveryNoteData.deliveryNoteNo}`,
      );
    }

    // Account check
    const account = await this.prisma.account.findUnique({
      where: { id: deliveryNoteData.accountId },
    });

    if (!account) {
      throw new NotFoundException(`Account not found: ${deliveryNoteData.accountId}`);
    }

    // Order check (if sourceType: ORDER)
    if (deliveryNoteData.sourceType === DeliveryNoteSourceType.ORDER && deliveryNoteData.sourceId) {
      const order = await this.prisma.procurementOrder.findUnique({
        where: { id: deliveryNoteData.sourceId },
      });

      if (!order) {
        throw new NotFoundException(`Order not found: ${deliveryNoteData.sourceId}`);
      }
    }

    // Calculate item amounts
    let subtotal = 0;
    let vatAmount = 0;

    const itemsWithCalculations = validItems.map((item) => {
      const totalAmount = item.quantity * item.unitPrice;
      const itemVat = (totalAmount * item.vatRate) / 100;

      subtotal += totalAmount;
      vatAmount += itemVat;

      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        vatRate: item.vatRate,
        totalAmount,
        vatAmount: itemVat,
      };
    });

    const discount = deliveryNoteData.discount || 0;
    subtotal -= discount;
    const grandTotal = subtotal + vatAmount;

    // Create deliveryNote and items with transaction
    return this.prisma.$transaction(async (prisma) => {
      const deliveryNote = await prisma.purchaseDeliveryNote.create({
        data: {
          ...deliveryNoteData,
          ...(tenantId != null && { tenantId }),
          subtotal: new Decimal(subtotal),
          vatAmount: new Decimal(vatAmount),
          grandTotal: new Decimal(grandTotal),
          discount: new Decimal(discount),
          status: deliveryNoteData.status || DeliveryNoteStatus.NOT_INVOICED,
          createdBy: userId,
          items: {
            create: itemsWithCalculations.map(k => ({
              productId: k.productId,
              quantity: k.quantity,
              unitPrice: new Decimal(k.unitPrice),
              totalAmount: new Decimal(k.totalAmount),
              vatAmount: new Decimal(k.vatAmount),
              vatRate: k.vatRate,
            })),
          },
        },
        include: {
          account: true,
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      // Create stock movement (when product added)
      for (const item of itemsWithCalculations) {
        await prisma.productMovement.create({
          data: {
            ...(tenantId != null && { tenantId }),
            productId: item.productId,
            movementType: 'ENTRY',
            quantity: item.quantity,
            unitPrice: new Decimal(item.unitPrice),
            warehouseId: (deliveryNoteData as any).warehouseId || null,
            notes: `Purchase delivery note: ${deliveryNoteData.deliveryNoteNo}`,
          },
        });
      }

      // Link deliveryNoteId to Order (if sourceType: ORDER)
      if (deliveryNoteData.sourceType === DeliveryNoteSourceType.ORDER && deliveryNoteData.sourceId) {
        await prisma.procurementOrder.update({
          where: { id: deliveryNoteData.sourceId },
          data: {
            deliveryNoteId: deliveryNote.id,
          },
        });
      }

      // Create audit log
      await this.createLog(
        deliveryNote.id,
        LogAction.CREATE,
        userId,
        { deliveryNote: deliveryNoteData, items },
        ipAddress,
        userAgent,
        prisma,
      );

      return deliveryNote;
    }).then(async (result) => {
      // After transaction: recalculate status
      const tenantId = await this.tenantResolver.resolveForQuery();
      if (result.id && tenantId) {
        await this.purchaseStatusCalculator.recalculateCascade(result.id, String(tenantId))
          .catch(err => console.error('[PurchaseWaybill] recalculateCascade after create failed:', err?.message));

        // Also update the source order orderNo on the waybill if applicable
        if (result.sourceType === DeliveryNoteSourceType.ORDER && result.sourceId) {
          const order = await this.prisma.procurementOrder.findUnique({ where: { id: result.sourceId } });
          if (order && (order as any).orderNo) {
            await (this.prisma.purchaseDeliveryNote as any).update({
              where: { id: result.id },
              data: { orderNo: (order as any).orderNo }
            });
          }
        }
      }
      return result;
    });
  }

  async update(
    id: string,
    updateDto: UpdatePurchaseWaybillDto,
    userId?: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const existingWaybill = await this.prisma.purchaseDeliveryNote.findUnique({
      where: { id },
      include: {
        items: true,
        invoice: true,
      },
    });

    if (!existingWaybill) {
      throw new NotFoundException(`Waybill not found: ${id}`);
    }

    // Invoiced waybill cannot be updated
    if (existingWaybill.status === DeliveryNoteStatus.INVOICED) {
      throw new BadRequestException('Invoiced waybill cannot be updated');
    }

    // Waybill linked to invoice cannot be updated
    if (existingWaybill.invoice) {
      throw new BadRequestException('Waybill linked to invoice cannot be updated');
    }

    const { items, ...deliveryNoteData } = updateDto;

    // Update with transaction
    return this.prisma.$transaction(async (prisma) => {
      // If items are being updated
      if (items && items.length > 0) {
        // Mevcut itemsi sil
        await prisma.purchaseDeliveryNoteItem.deleteMany({
          where: { deliveryNoteId: id },
        });

        // Add new items and calculate amounts
        let subtotal = 0;
        let vatAmount = 0;

        const validItems = items.filter(i => i.productId && i.productId.trim() !== '');

        if (validItems.length === 0) {
          throw new BadRequestException('At least one item must be added');
        }

        const itemsWithCalculations = validItems.map((item) => {
          const totalAmount = item.quantity * item.unitPrice;
          const itemVat = (totalAmount * item.vatRate) / 100;

          subtotal += totalAmount;
          vatAmount += itemVat;

          return {
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            vatRate: item.vatRate,
            totalAmount,
            vatAmount: itemVat,
          };
        });

        const discount = deliveryNoteData.discount ?? existingWaybill.discount.toNumber();
        subtotal -= discount;
        const grandTotal = subtotal + vatAmount;

        // EKSIK: Eski ProductMovement kayıtlarını sil (not içerenleri baz alarak)
        await prisma.productMovement.deleteMany({
          where: { notes: { contains: existingWaybill.deliveryNoteNo } }
        });

        await prisma.purchaseDeliveryNoteItem.createMany({
          data: itemsWithCalculations.map(k => ({
            productId: k.productId,
            quantity: k.quantity,
            deliveryNoteId: id,
            unitPrice: new Decimal(k.unitPrice),
            totalAmount: new Decimal(k.totalAmount),
            vatAmount: new Decimal(k.vatAmount),
            vatRate: k.vatRate,
          })),
        });

        // YENI: Güncellenmiş kalemlere göre yeni ProductMovement kayıtları oluştur
        const tenantIdForMovement = await this.tenantResolver.resolveForQuery();
        await prisma.productMovement.createMany({
          data: itemsWithCalculations.map(k => ({
            ...(tenantIdForMovement && { tenantId: tenantIdForMovement }),
            productId: k.productId,
            movementType: 'ENTRY',
            quantity: k.quantity,
            unitPrice: new Decimal(k.unitPrice),
            warehouseId: (deliveryNoteData as any).warehouseId || existingWaybill.warehouseId || null,
            notes: `Purchase delivery note: ${existingWaybill.deliveryNoteNo}`,
          }))
        });

        // Update waybill amounts
        await prisma.purchaseDeliveryNote.update({
          where: { id },
          data: {
            ...deliveryNoteData,
            subtotal: new Decimal(subtotal),
            vatAmount: new Decimal(vatAmount),
            grandTotal: new Decimal(grandTotal),
            discount: new Decimal(discount),
            updatedBy: userId,
          },
        });
      } else {
        // Only deliveryNote info is being updated
        const discount = deliveryNoteData.discount ?? existingWaybill.discount.toNumber();
        const subtotal = existingWaybill.subtotal.toNumber() - discount + existingWaybill.discount.toNumber();
        const grandTotal = subtotal + existingWaybill.vatAmount.toNumber();

        await prisma.purchaseDeliveryNote.update({
          where: { id },
          data: {
            ...deliveryNoteData,
            subtotal: new Decimal(subtotal),
            vatAmount: existingWaybill.vatAmount,
            grandTotal: new Decimal(grandTotal),
            discount: new Decimal(discount),
            updatedBy: userId,
          },
        });
      }

      const updatedWaybill = await prisma.purchaseDeliveryNote.findUnique({
        where: { id },
        include: {
          account: true,
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      // Create audit log
      await this.createLog(
        id,
        LogAction.UPDATE,
        userId,
        { updateDto, oldData: existingWaybill },
        ipAddress,
        userAgent,
        prisma,
      );

      return updatedWaybill;
    }).then(async (result) => {
      // After transaction: recalculate status
      const tenantId = await this.tenantResolver.resolveForQuery();
      if (id && tenantId) {
        await this.purchaseStatusCalculator.recalculateCascade(id, String(tenantId))
          .catch(err => console.error('[PurchaseWaybill] recalculateCascade after update failed:', err?.message));
      }
      return result;
    });
  }

  async remove(
    id: string,
    userId?: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const deliveryNote = await this.prisma.purchaseDeliveryNote.findUnique({
      where: { id },
      include: {
        invoice: true,
      },
    });

    if (!deliveryNote) {
      throw new NotFoundException(`Waybill not found: ${id}`);
    }

    // Invoiced waybill cannot be deleted
    if (deliveryNote.status === DeliveryNoteStatus.INVOICED) {
      throw new BadRequestException('Invoiced waybill cannot be deleted');
    }

    // Waybill linked to invoice cannot be deleted
    if (deliveryNote.invoice) {
      throw new BadRequestException('Waybill linked to invoice cannot be deleted');
    }

    return this.prisma.$transaction(async (prisma) => {
      // Soft delete
      await prisma.purchaseDeliveryNote.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          deletedBy: userId,
        },
      });

      // EKSIK: İrsaliyeye bağlı ProductMovement kayıtlarını (not'a göre bularak) null/iptal yap
      await prisma.productMovement.updateMany({
        where: { notes: { contains: deliveryNote.deliveryNoteNo } },
        data: {
          deletedAt: new Date(),
          deletedBy: userId,
        }
      });

      // Sipariş'ten deliveryNoteId'yi kaldır
      if (deliveryNote.sourceType === DeliveryNoteSourceType.ORDER && deliveryNote.sourceId) {
        await prisma.procurementOrder.update({
          where: { id: deliveryNote.sourceId },
          data: {
            deliveryNoteId: null,
          },
        });
      }

      // Create audit log
      await this.createLog(
        id,
        LogAction.DELETE,
        userId,
        { deliveryNote },
        ipAddress,
        userAgent,
        prisma,
      );
    }).then(async () => {
      // After transaction: recalculate status for the order
      const tenantId = await this.tenantResolver.resolveForQuery();
      if (deliveryNote.sourceId && tenantId) {
        await this.purchaseStatusCalculator.recalculateOrderStatus(deliveryNote.sourceId, String(tenantId))
          .catch(err => console.error('[PurchaseWaybill] recalculateOrderStatus after remove failed:', err?.message));
      }
    });
  }

  async getStats() {
    const tenantId = await this.tenantResolver.resolveForQuery();
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const baseWhere: Prisma.PurchaseDeliveryNoteWhereInput = {
      deletedAt: null,
      ...buildTenantWhereClause(tenantId ?? undefined),
    };

    // Monthly total (all approved/not deleted)
    const monthlyStats = await this.prisma.purchaseDeliveryNote.aggregate({
      where: {
        ...baseWhere,
        date: { gte: startOfMonth },
      },
      _sum: { grandTotal: true },
      _count: true,
    });

    // Pending Invoicing (NOT_INVOICED)
    const pendingStats = await this.prisma.purchaseDeliveryNote.aggregate({
      where: {
        ...baseWhere,
        status: DeliveryNoteStatus.NOT_INVOICED,
      },
      _sum: { grandTotal: true },
      _count: true,
    });

    // Invoiced (INVOICED)
    const invoicedStats = await this.prisma.purchaseDeliveryNote.aggregate({
      where: {
        ...baseWhere,
        status: DeliveryNoteStatus.INVOICED,
      },
      _sum: { grandTotal: true },
      _count: true,
    });

    return {
      monthlyNotes: {
        totalAmount: monthlyStats._sum.grandTotal ? monthlyStats._sum.grandTotal.toNumber() : 0,
        count: monthlyStats._count || 0,
      },
      pendingInvoicing: {
        totalAmount: pendingStats._sum.grandTotal ? pendingStats._sum.grandTotal.toNumber() : 0,
        count: pendingStats._count || 0,
      },
      invoicedNotes: {
        totalAmount: invoicedStats._sum.grandTotal ? invoicedStats._sum.grandTotal.toNumber() : 0,
        count: invoicedStats._count || 0,
      },
    };
  }
}
