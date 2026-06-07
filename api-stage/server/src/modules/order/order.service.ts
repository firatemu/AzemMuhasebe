import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { SalesOrderStatus, OrderType } from './order.enums';
import { DeliveryNoteStatus, DeliveryNoteSourceType } from '../sales-waybill/sales-waybill.enums';
import { Prisma, LogAction } from '@prisma/client';
import { PrismaService } from '../../common/prisma.service';
import { TenantResolverService } from '../../common/services/tenant-resolver.service';
import { buildTenantWhereClause } from '../../common/utils/staging.util';
import { CodeTemplateService } from '../code-template/code-template.service';
import { SalesWaybillService } from '../sales-waybill/sales-waybill.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UnitSetService } from '../unit-set/unit-set.service';
import { StatusCalculatorService } from '../shared/status-calculator/status-calculator.service';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private tenantResolver: TenantResolverService,
    @Inject(forwardRef(() => SalesWaybillService))
    private salesWaybillService: SalesWaybillService,
    private codeTemplateService: CodeTemplateService,
    private unitSetService: UnitSetService,
    private statusCalculator: StatusCalculatorService,
  ) { }

  private async createLog(
    orderId: string,
    actionType: LogAction,
    userId?: string,
    changes?: any,
    ipAddress?: string,
    userAgent?: string,
    tx?: Prisma.TransactionClient,
    tenantId?: string,
  ) {
    const prisma = tx || this.prisma;
    const resolvedTenantId = tenantId ?? await this.tenantResolver.resolveForQuery();
    await prisma.salesOrderLog.create({
      data: {
        orderId,
        userId,
        actionType,
        changes: changes ? JSON.stringify(changes) : null,
        ipAddress,
        userAgent,
        tenantId: resolvedTenantId ?? undefined,
      },
    });
  }

  async findAll(
    page = 1,
    limit = 50,
    orderType?: OrderType,
    search?: string,
    accountId?: string,
    status?: SalesOrderStatus,
  ) {
    const tenantId = await this.tenantResolver.resolveForQuery();
    const skip = (page - 1) * limit;

    const isProcurement = orderType === OrderType.PURCHASE;
    const model = isProcurement ? this.prisma.procurementOrder : this.prisma.salesOrder;

    const where: any = {
      deletedAt: null,
      ...buildTenantWhereClause(tenantId ?? undefined),
    };

    if (accountId) {
      where.accountId = accountId;
    }

    if (status) {
      where.status = status as any;
    }

    if (search) {
      where.OR = [
        { orderNo: { contains: search, mode: 'insensitive' } },
        { account: { title: { contains: search, mode: 'insensitive' } } },
        { account: { code: { contains: search, mode: 'insensitive' } } },
      ];
    }

    let data;
    try {
      data = await (model as any).findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          orderNo: true,
          date: true,
          dueDate: true,
          status: true,
          totalAmount: true,
          vatAmount: true,
          grandTotal: true,
          discount: true,
          notes: true,
          invoiceNo: true,
          deliveryNoteId: true,
          createdAt: true,
          updatedAt: true,
          account: {
            select: {
              id: true,
              code: true,
              title: true,
              type: true,
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
          deliveryNotes: {
            select: {
              id: true,
              deliveryNoteNo: true,
              invoiceNos: true,
            },
          },
          items: {
            select: {
              id: true,
              quantity: true,
              deliveredQuantity: true,
            },
          },
          deliveryNote: {
            select: {
              id: true,
              deliveryNoteNo: true,
            },
          },
          _count: {
            select: {
              items: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      const total = await (model as any).count({ where });

      const mappedData = data.map((item: any) => {
        const allInvoices = new Set<string>();
        if (item.invoiceNo) allInvoices.add(item.invoiceNo);

        item.deliveryNotes?.forEach((dn: any) => {
          if (dn.invoiceNos && Array.isArray(dn.invoiceNos)) {
            dn.invoiceNos.forEach((inv: string) => {
              if (inv) allInvoices.add(inv);
            });
          }
        });

        return {
          ...item,
          invoiceNos: Array.from(allInvoices),
        };
      });

      return {
        data: mappedData,
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      };
    } catch (error: any) {
      throw error;
    }
  }

  async findOne(id: string) {
    const tenantId = await this.tenantResolver.resolveForQuery();
    let order = await this.prisma.salesOrder.findFirst({
      where: {
        id,
        ...buildTenantWhereClause(tenantId ?? undefined),
        deletedAt: null,
      },
      include: {
        account: true,
        items: {
          include: {
            product: true,
          },
        },
        createdByUser: {
          select: { id: true, fullName: true, username: true },
        },
        logs: {
          include: {
            user: { select: { id: true, fullName: true, username: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    }) as any;

    if (!order) {
      order = await this.prisma.procurementOrder.findFirst({
        where: {
          id,
          ...buildTenantWhereClause(tenantId ?? undefined),
          deletedAt: null,
        },
        include: {
          account: true,
          items: {
            include: {
              product: true,
            },
          },
          createdByUser: {
            select: { id: true, fullName: true, username: true },
          },
          logs: {
            include: {
              user: { select: { id: true, fullName: true, username: true } },
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      }) as any;
    }

    if (!order) {
      throw new NotFoundException(`Order not found: ${id}`);
    }

    // Recalculate status without blocking the read response
    if (order.id && tenantId) {
      void this.statusCalculator
        .recalculateOrderStatus(order.id, String(tenantId))
        .catch((err) =>
          console.error('[OrderService] Recalculate order status failed:', err?.message),
        );
    }

    return order;
  }

  async create(
    createOrderDto: CreateOrderDto,
    userId?: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const { items, orderType, ...orderData } = createOrderDto;
    const isProcurement = orderType === OrderType.PURCHASE;
    const model = isProcurement ? this.prisma.procurementOrder : this.prisma.salesOrder;

    const tenantId = await this.tenantResolver.resolveForCreate({ userId });
    const finalTenantId = (orderData as any).tenantId || tenantId || undefined;

    const existingOrder = await (model as any).findFirst({
      where: {
        orderNo: orderData.orderNo,
        ...buildTenantWhereClause(finalTenantId),
      },
    });

    if (existingOrder) {
      throw new BadRequestException(
        `Order number already exists: ${orderData.orderNo}`,
      );
    }

    const account = await this.prisma.account.findFirst({
      where: {
        id: orderData.accountId,
        ...buildTenantWhereClause(finalTenantId),
      },
    });

    if (!account) {
      throw new NotFoundException(`Account not found: ${orderData.accountId}`);
    }

    // Validate quantities for unit divisibility
    const products = await this.prisma.product.findMany({
      where: { id: { in: items.map((i) => i.productId) } },
      select: { id: true, unitId: true },
    });

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (product?.unitId) {
        await this.unitSetService.validateQuantity(product.unitId, item.quantity);
      }
    }

    let totalAmount = new Prisma.Decimal(0);
    let vatAmount = new Prisma.Decimal(0);

    const itemsWithCalculations = items.map((item) => {
      const lineTotal = new Prisma.Decimal(item.quantity).mul(item.unitPrice);
      const lineVat = lineTotal.mul(item.vatRate).div(100);

      totalAmount = totalAmount.add(lineTotal);
      vatAmount = vatAmount.add(lineVat);

      const data: any = {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        vatRate: item.vatRate,
        vatAmount: lineVat,
      };

      if (item.discountRate != null) {
        data.discountRate = item.discountRate;
      }
      if (item.discountAmount != null) {
        data.discountAmount = item.discountAmount;
      }
      if (item.discountType) {
        data.discountType = item.discountType;
      }
      if (item.unit) {
        data.unit = item.unit;
      }

      if (isProcurement) {
        data.amount = lineTotal.add(lineVat);
      } else {
        data.totalAmount = lineTotal.add(lineVat);
      }

      return data;
    });

    const discount = new Prisma.Decimal(orderData.discount || 0);
    const grandTotal = totalAmount.add(vatAmount).sub(discount);

    return this.prisma.$transaction(async (prisma) => {
      const createData: any = {
        orderNo: orderData.orderNo,
        date: orderData.date ? new Date(orderData.date) : new Date(),
        accountId: orderData.accountId,
        tenantId: finalTenantId,
        totalAmount,
        vatAmount,
        grandTotal,
        discount,
        notes: orderData.notes,
        dueDate: orderData.dueDate ? new Date(orderData.dueDate) : null,
        status: orderData.status as any,
        createdBy: userId,
        items: {
          create: itemsWithCalculations,
        },
      };

      // Only add type for sales orders (procurement orders don't have type field)
      if (!isProcurement) {
        createData.type = orderType;
      }

      const order = await (prisma as any)[isProcurement ? 'procurementOrder' : 'salesOrder'].create({
        data: createData,
        include: {
          account: true,
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!isProcurement) {
        await this.createLog(
          order.id,
          LogAction.CREATE,
          userId,
          { order: orderData, items },
          ipAddress,
          userAgent,
          prisma,
          finalTenantId ?? undefined,
        );
      }

      // Recalculate status after creation
      if (order.id && finalTenantId) {
        await this.statusCalculator.recalculateOrderStatus(order.id, String(finalTenantId))
          .catch(err => console.error('[OrderService] Recalculate order status after create failed:', err?.message));
      }

      return order;
    });
  }

  async update(
    id: string,
    updateOrderDto: UpdateOrderDto,
    userId?: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const order = await this.findOne(id);

    if (order.status === 'INVOICED') {
      throw new BadRequestException('Invoiced order cannot be updated');
    }

    const { items, ...orderData } = updateOrderDto;
    const isProcurement = !('type' in order);
    const modelName = isProcurement ? 'procurementOrder' : 'salesOrder';
    const itemsModelName = isProcurement ? 'procurementOrderItem' : 'salesOrderItem';
    const { orderType, ...actualOrderData } = orderData;
    if (!isProcurement && orderType) {
      (actualOrderData as any).type = orderType;
    }

    if (!items) {
      const updated = await (this.prisma as any)[modelName].update({
        where: {
          id,
        },
        data: {
          ...actualOrderData,
          updatedBy: userId,
        },
      });

      if (!isProcurement) {
        await this.createLog(
          id,
          LogAction.UPDATE,
          userId,
          { changes: updateOrderDto },
          ipAddress,
          userAgent,
        );
      }

      return updated;
    }

    const productIds = items.map((i) => i.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, unitId: true },
    });

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (product?.unitId) {
        await this.unitSetService.validateQuantity(product.unitId, item.quantity);
      }
    }

    const tenantId = await this.tenantResolver.resolveForQuery();

    const updated = await this.prisma.$transaction(
      async (prisma) => {
      // 1. Fetch current items to perform sync
      const currentItems = await (prisma as any)[itemsModelName].findMany({
        where: { orderId: id },
      });

      let totalAmount = new Prisma.Decimal(0);
      let vatAmount = new Prisma.Decimal(0);
      const newItemsToCreate: any[] = [];
      const itemsToUpdate: { id: string; data: any }[] = [];
      const processedExistingItemIds = new Set<string>();

      // 2. Identify items to update or create
      for (const item of items) {
        const lineTotal = new Prisma.Decimal(item.quantity).mul(item.unitPrice);
        const lineVat = lineTotal.mul(item.vatRate).div(100);

        totalAmount = totalAmount.add(lineTotal);
        vatAmount = vatAmount.add(lineVat);

        // Try to match with an existing item that hasn't been processed yet
        const existingItem = currentItems.find(
          (ci) => ci.productId === item.productId && !processedExistingItemIds.has(ci.id)
        );

        const itemData: any = {
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          vatRate: item.vatRate,
          vatAmount: lineVat,
          discountRate: item.discountRate || 0,
          discountAmount: item.discountAmount || 0,
          discountType: item.discountType || 'pct',
          unit: item.unit,
        };

        if (isProcurement) {
          itemData.amount = lineTotal.add(lineVat);
        } else {
          itemData.totalAmount = lineTotal.add(lineVat);
        }

        if (existingItem) {
          // Validate: cannot reduce quantity below delivered amount
          if (Number(item.quantity) < Number(existingItem.deliveredQuantity || 0)) {
            throw new BadRequestException(
              `Ürün miktarı (${item.quantity}), sevk edilen miktardan (${existingItem.deliveredQuantity}) az olamaz.`
            );
          }

          itemsToUpdate.push({
            id: existingItem.id,
            data: itemData,
          });
          processedExistingItemIds.add(existingItem.id);
        } else {
          newItemsToCreate.push(itemData);
        }
      }

      // 3. Identify items to delete (those not in new list and not delivered)
      const itemIdsToDelete = currentItems
        .filter((ci) => !processedExistingItemIds.has(ci.id))
        .map((ci) => {
          if (Number(ci.deliveredQuantity || 0) > 0) {
            throw new BadRequestException(
              `Sevk işlemi yapılmış kalemler silinemez (Ürün ID: ${ci.productId}).`
            );
          }
          return ci.id;
        });

      // 4. Perform DB operations
      if (itemIdsToDelete.length > 0) {
        await (prisma as any)[itemsModelName].deleteMany({
          where: { id: { in: itemIdsToDelete } },
        });
      }

      await Promise.all(
        itemsToUpdate.map((update) =>
          (prisma as any)[itemsModelName].update({
            where: { id: update.id },
            data: update.data,
          }),
        ),
      );

      const discount = new Prisma.Decimal(orderData.discount ?? order.discount);
      const grandTotal = totalAmount.add(vatAmount).sub(discount);

      const updated = await (prisma as any)[modelName].update({
        where: {
          id,
        },
        data: {
          ...actualOrderData,
          totalAmount,
          vatAmount,
          grandTotal,
          discount,
          updatedBy: userId,
          items: {
            create: newItemsToCreate,
          },
        },
      });

      if (!isProcurement) {
        await this.createLog(
          id,
          LogAction.UPDATE,
          userId,
          { changes: updateOrderDto },
          ipAddress,
          userAgent,
          prisma,
          order.tenantId ?? undefined,
        );
      }

      return updated;
    },
      { timeout: 30_000 },
    );

    if (!isProcurement && id && tenantId) {
      await this.statusCalculator
        .recalculateOrderStatus(id, String(tenantId))
        .catch((err) =>
          console.error(
            '[OrderService] Recalculate order status after update failed:',
            err?.message,
          ),
        );
    }

    return updated;
  }

  async remove(
    id: string,
    userId?: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const order = await this.findOne(id);

    if (order.status === 'INVOICED') {
      throw new BadRequestException('Invoiced order cannot be deleted');
    }

    const isProcurement = !('deliveryNoteId' in order);
    const modelName = isProcurement ? 'procurementOrder' : 'salesOrder';

    await (this.prisma as any)[modelName].updateMany({
      where: {
        id,
        ...buildTenantWhereClause(order.tenantId ?? undefined),
      },
      data: {
        deletedAt: new Date(),
        deletedBy: userId,
      },
    });

    if (!isProcurement) {
      await this.createLog(id, LogAction.DELETE, userId, null, ipAddress, userAgent);
    }

    return { message: 'Order deleted' };
  }

  async restore(
    id: string,
    userId?: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const tenantId = await this.tenantResolver.resolveForQuery();
    let order = await this.prisma.salesOrder.findFirst({
      where: {
        id,
        ...buildTenantWhereClause(tenantId ?? undefined),
      },
    }) as any;
    let modelName = 'salesOrder';

    if (!order) {
      order = await this.prisma.procurementOrder.findFirst({
        where: {
          id,
          ...buildTenantWhereClause(tenantId ?? undefined),
        },
      }) as any;
      modelName = 'procurementOrder';
    }

    if (!order) {
      throw new NotFoundException(`Order not found: ${id}`);
    }

    if (!order.deletedAt) {
      throw new BadRequestException('Order is already active');
    }

    const restored = await (this.prisma as any)[modelName].updateMany({
      where: {
        id,
        ...buildTenantWhereClause(order.tenantId ?? undefined),
      },
      data: {
        deletedAt: null,
        deletedBy: null,
      },
    });

    if (modelName === 'salesOrder') {
      await this.createLog(id, LogAction.RESTORE, userId, null, ipAddress, userAgent);
    }

    return restored;
  }

  async changeStatus(
    id: string,
    status: SalesOrderStatus,
    userId?: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const order = await this.findOne(id);

    if (order.status === 'INVOICED') {
      throw new BadRequestException(
        'Invoiced order status cannot be changed',
      );
    }

    const isProcurement = !('deliveryNoteId' in order);
    const modelName = isProcurement ? 'procurementOrder' : 'salesOrder';

    const updated = await (this.prisma as any)[modelName].updateMany({
      where: {
        id,
        ...buildTenantWhereClause(order.tenantId ?? undefined),
      },
      data: {
        status,
        updatedBy: userId,
      },
    });

    if (!isProcurement) {
      await this.createLog(
        id,
        LogAction.UPDATE,
        userId,
        { oldStatus: order.status, newStatus: status },
        ipAddress,
        userAgent,
      );
    }

    return updated;
  }

  async cancel(
    id: string,
    userId?: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const result = await this.changeStatus(id, SalesOrderStatus.CANCELLED, userId, ipAddress, userAgent);

    // Recalculate status
    const tenantId = await this.tenantResolver.resolveForQuery();
    if (id && tenantId) {
      await this.statusCalculator.recalculateOrderStatus(id, String(tenantId))
        .catch(err => console.error('[OrderService] Recalculate order status after cancel failed:', err?.message));
    }

    return result;
  }

  async findDeleted(
    page = 1,
    limit = 50,
    orderType?: OrderType,
    search?: string,
  ) {
    const skip = (page - 1) * limit;
    const isProcurement = orderType === OrderType.PURCHASE;
    const modelName = isProcurement ? 'procurementOrder' : 'salesOrder';

    const tenantId = await this.tenantResolver.resolveForQuery();
    const where: any = {
      deletedAt: { not: null },
      ...buildTenantWhereClause(tenantId ?? undefined),
    };

    if (search) {
      where.OR = [
        { orderNo: { contains: search, mode: 'insensitive' } },
        { account: { title: { contains: search, mode: 'insensitive' } } },
        { account: { code: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [data, total] = await Promise.all([
      (this.prisma as any)[modelName].findMany({
        where,
        skip,
        take: limit,
        include: {
          account: {
            select: { id: true, code: true, title: true, type: true },
          },
          deletedByUser: {
            select: { id: true, fullName: true, username: true },
          },
          _count: {
            select: { items: true },
          },
        },
        orderBy: { deletedAt: 'desc' },
      }),
      (this.prisma as any)[modelName].count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async markInvoiced(
    id: string,
    invoiceNo: string,
    userId?: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const order = await this.findOne(id);

    if (order.status === 'INVOICED') {
      throw new BadRequestException('Order is already invoiced');
    }

    if (order.status === 'CANCELLED') {
      throw new BadRequestException('Cancelled order cannot be invoiced');
    }

    // Sevk oranı kontrolü - %100 sevk edilmemiş sipariş faturalandırılamaz
    if (order.items && order.items.length > 0) {
      const totalQuantity = order.items.reduce((sum: number, item: any) => sum + (Number(item.quantity) || 0), 0);
      const totalDelivered = order.items.reduce((sum: number, item: any) => sum + (Number(item.deliveredQuantity) || 0), 0);

      if (totalQuantity > 0) {
        const shipmentRatio = (totalDelivered / totalQuantity) * 100;
        if (shipmentRatio < 99.9) {
          throw new BadRequestException(
            `Sipariş %${shipmentRatio.toFixed(1)} sevk edilmiş. Faturalandırılabilmesi için tamamen sevk edilmelidir.`
          );
        }
      }
    }

    const isProcurement = !('deliveryNoteId' in order);
    const modelName = isProcurement ? 'procurementOrder' : 'salesOrder';

    const updated = await (this.prisma as any)[modelName].updateMany({
      where: {
        id,
        ...buildTenantWhereClause(order.tenantId ?? undefined),
      },
      data: {
        status: 'INVOICED',
        invoiceNo: isProcurement ? undefined : invoiceNo,
        updatedBy: userId,
      },
    });

    if (!isProcurement) {
      await this.createLog(
        id,
        LogAction.UPDATE,
        userId,
        { oldStatus: order.status, newStatus: 'INVOICED', invoiceNo },
        ipAddress,
        userAgent,
      );
    }

    // Recalculate status
    const tenantId = await this.tenantResolver.resolveForQuery();
    if (id && tenantId) {
      await this.statusCalculator.recalculateOrderStatus(id, String(tenantId))
        .catch(err => console.error('[OrderService] Recalculate order status after markInvoiced failed:', err?.message));
    }

    return updated;
  }

  async getPreparationDetails(id: string) {
    const order = await this.findOne(id);

    const itemsWithLocations = await Promise.all(
      order.items.map(async (item: any) => {
        const locations = await this.prisma.productLocationStock.findMany({
          where: {
            productId: item.productId,
            qtyOnHand: { gt: 0 },
            ...buildTenantWhereClause(order.tenantId ?? undefined),
          },
          include: {
            location: {
              include: {
                warehouse: true,
              },
            },
          },
          orderBy: {
            location: {
              code: 'asc',
            },
          },
        });

        return {
          ...item,
          locations,
        };
      }),
    );

    return {
      ...order,
      items: itemsWithLocations,
    };
  }

  async prepare(id: string, items: any[], userId?: string) {
    const order = await this.findOne(id);

    if (order.status !== 'PREPARING' && order.status !== 'PENDING') {
      throw new BadRequestException('Order is not in preparation status');
    }

    return this.prisma.$transaction(async (prisma) => {
      await (prisma as any).orderPicking.deleteMany({
        where: {
          orderId: id,
          ...buildTenantWhereClause(order.tenantId ?? undefined),
        },
      });

      const pickingData = items.map((item) => ({
        orderId: id,
        orderItemId: item.orderItemId,
        locationId: item.locationId,
        quantity: item.quantity,
        userId: userId,
      }));

      await (prisma as any).orderPicking.createMany({
        data: pickingData,
      });

      await (prisma as any).salesOrder.updateMany({
        where: {
          id,
          ...buildTenantWhereClause(order.tenantId ?? undefined),
        },
        data: { status: SalesOrderStatus.PREPARED },
      });

      return this.findOne(id);
    });
  }

  async ship(
    id: string,
    shippedItems: Array<{ itemId: string; shippedQuantity: number }>,
    userId?: string,
    ipAddress?: string,
    userAgent?: string,
    warehouseId?: string,
    notes?: string,
    deliveryNoteNo?: string,
  ) {
    const tenantId = await this.tenantResolver.resolveForQuery();
    const order = await this.prisma.salesOrder.findFirst({
      where: {
        id,
        ...buildTenantWhereClause(tenantId ?? undefined),
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order not found: ${id}`);
    }

    if (order.status === 'INVOICED' || order.status === 'CANCELLED') {
      throw new BadRequestException('Faturalanmış veya iptal edilmiş siparişler sevk edilemez');
    }

    // Validate quantities before transaction
    for (const shipItem of shippedItems) {
      const item = order.items.find((i) => i.id === shipItem.itemId);
      if (!item) {
        throw new NotFoundException(`Sipariş kalemi bulunamadı: ${shipItem.itemId}`);
      }
      const newDeliveredQuantity = (item.deliveredQuantity || 0) + shipItem.shippedQuantity;
      if (newDeliveredQuantity > Number(item.quantity)) {
        throw new BadRequestException(
          `${item.product.name} için sevk miktarı (${newDeliveredQuantity}) sipariş miktarını (${item.quantity}) aşamaz`,
        );
      }
    }

    // Generate delivery note number if not provided
    let finalDeliveryNoteNo = deliveryNoteNo;
    if (!finalDeliveryNoteNo) {
      try {
        const code = await this.codeTemplateService.getPreviewCode('SALES_WAYBILL' as any);
        finalDeliveryNoteNo = code;
      } catch {
        const year = new Date().getFullYear();
        const count = await this.prisma.salesDeliveryNote.count({
          where: { ...buildTenantWhereClause(order.tenantId ?? undefined) },
        });
        finalDeliveryNoteNo = `IRS-${year}-${String(count + 1).padStart(3, '0')}`;
      }
    }

    const result = await this.prisma.$transaction(async (prisma) => {
      let subtotal = new Prisma.Decimal(0);
      let totalVatAmount = new Prisma.Decimal(0);
      const deliveryNoteItems: any[] = [];

      for (const shipItem of shippedItems) {
        const item = order.items.find((i) => i.id === shipItem.itemId)!;
        const newDeliveredQuantity = (item.deliveredQuantity || 0) + shipItem.shippedQuantity;

        await (prisma as any).salesOrderItem.update({
          where: { id: item.id },
          data: { deliveredQuantity: newDeliveredQuantity },
        });

        const lineSubtotal = new Prisma.Decimal(shipItem.shippedQuantity).mul(item.unitPrice);
        const lineVat = lineSubtotal.mul(item.vatRate).div(100);
        const lineTotal = lineSubtotal.add(lineVat);

        subtotal = subtotal.add(lineSubtotal);
        totalVatAmount = totalVatAmount.add(lineVat);

        deliveryNoteItems.push({
          productId: item.productId,
          quantity: shipItem.shippedQuantity,
          unitPrice: item.unitPrice,
          vatRate: item.vatRate,
          vatAmount: lineVat,
          totalAmount: lineTotal,
          tenantId: order.tenantId ?? undefined,
        });
      }

      const grandTotal = subtotal.add(totalVatAmount);

      // Create SalesDeliveryNote automatically
      const deliveryNote = await (prisma as any).salesDeliveryNote.create({
        data: {
          deliveryNoteNo: finalDeliveryNoteNo,
          date: new Date(),
          tenantId: order.tenantId,
          accountId: order.accountId,
          warehouseId: warehouseId ?? null,
          sourceType: 'ORDER' as any,
          sourceId: order.id,
          status: 'NOT_INVOICED' as any,
          subtotal,
          vatAmount: totalVatAmount,
          grandTotal,
          discount: new Prisma.Decimal(0),
          notes: notes ?? `${order.orderNo} nolu siparişten sevk`,
          createdBy: userId,
          items: {
            create: deliveryNoteItems,
          },
        },
      });

      // Determine new order status
      const updatedItems = await (prisma as any).salesOrderItem.findMany({
        where: { orderId: id },
      });

      const allShipped = updatedItems.every(
        (k: any) => (k.deliveredQuantity || 0) >= Number(k.quantity),
      );
      const someShipped = updatedItems.some(
        (k: any) => (k.deliveredQuantity || 0) > 0,
      );

      let newStatus: SalesOrderStatus | undefined;
      if (allShipped) {
        newStatus = SalesOrderStatus.SHIPPED;
      } else if (someShipped) {
        newStatus = SalesOrderStatus.PARTIALLY_SHIPPED;
      }

      if (newStatus && order.status !== newStatus) {
        await (prisma as any).salesOrder.update({
          where: { id },
          data: { status: newStatus },
        });
      }

      await this.createLog(
        id,
        LogAction.UPDATE,
        userId,
        { shippedItems, deliveryNoteId: deliveryNote.id, deliveryNoteNo: finalDeliveryNoteNo },
        ipAddress,
        userAgent,
        prisma,
        order.tenantId ?? undefined,
      );

      // Return minimal data from transaction
      return {
        deliveryNoteId: deliveryNote.id,
        deliveryNoteNo: finalDeliveryNoteNo,
      };
    }, { timeout: 10000 });

    // Recalculate status cascade AFTER transaction commits
    if (id && tenantId) {
      await this.statusCalculator.recalculateOrderStatus(id, String(tenantId))
        .catch(err => console.error('[OrderService] Recalculate order status after ship failed:', err?.message));
    }

    // Fetch full order data AFTER transaction commits
    const updatedOrder = await this.findOne(id);
    return {
      ...updatedOrder,
      shipDeliveryNote: { id: result.deliveryNoteId, deliveryNoteNo: result.deliveryNoteNo },
    };
  }

  async createDeliveryNoteFromOrder(
    id: string,
    userId?: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const order = await this.findOne(id);
    if (!order) {
      throw new NotFoundException(`Sipariş bulunamadı: ${id}`);
    }

    const shippedItems = (order.items || [])
      .map((item: any) => ({
        itemId: item.id,
        shippedQuantity: Number(item.quantity) - (item.deliveredQuantity || 0),
      }))
      .filter((item: any) => item.shippedQuantity > 0);

    if (shippedItems.length === 0) {
      throw new BadRequestException('Sevk edilecek miktar kalmadı veya sipariş kapalı.');
    }

    const result = await this.ship(id, shippedItems, userId, ipAddress, userAgent);
    return {
      ...result,
      id: result.shipDeliveryNote?.id, // Frontend redirects to /sales-waybills/:id
    };
  }


  async findOrdersForInvoice(accountId?: string, search?: string, orderType: OrderType = OrderType.SALE) {
    const tenantId = await this.tenantResolver.resolveForQuery();
    const isProcurement = orderType === OrderType.PURCHASE;

    const where: any = {
      deletedAt: null,
      status: isProcurement ? { in: ['SIPARIS_VERILDI', 'SEVK_EDILDI', 'BEKLEMEDE', 'KISMI_SEVK'] } : { in: ['SHIPPED', 'PARTIALLY_SHIPPED'] },
      ...buildTenantWhereClause(tenantId ?? undefined),
    };

    if (accountId) {
      where.accountId = accountId;
    }

    if (search) {
      where.OR = [
        { orderNo: { contains: search, mode: 'insensitive' } },
        { account: { title: { contains: search, mode: 'insensitive' } } },
        { account: { code: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const model = isProcurement ? this.prisma.procurementOrder : this.prisma.salesOrder;
    const orders = await (model as any).findMany({
      where,
      include: {
        account: {
          select: { id: true, code: true, title: true },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });

    return {
      data: orders,
      total: orders.length,
    };
  }

  async findOrdersForDeliveryNote(accountId?: string, search?: string, orderType: OrderType = OrderType.SALE) {
    const tenantId = await this.tenantResolver.resolveForQuery();
    const isProcurement = orderType === OrderType.PURCHASE;

    const where: any = {
      deletedAt: null,
      status: isProcurement ? 'ONAYLANDI' : 'APPROVED',
      ...buildTenantWhereClause(tenantId ?? undefined),
    };

    if (accountId) {
      where.accountId = accountId;
    }

    if (search) {
      where.OR = [
        { orderNo: { contains: search, mode: 'insensitive' } },
        { account: { title: { contains: search, mode: 'insensitive' } } },
        { account: { code: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const model = isProcurement ? this.prisma.procurementOrder : this.prisma.salesOrder;
    const orders = await (model as any).findMany({
      where,
      include: {
        account: {
          select: { id: true, code: true, title: true },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });

    return {
      data: orders,
      total: orders.length,
    };
  }

  async getStats(
    orderType: OrderType = OrderType.SALE,
    startDate?: Date,
    endDate?: Date,
    status?: string,
    accountId?: string,
  ) {
    const tenantId = await this.tenantResolver.resolveForQuery();
    const isProcurement = orderType === OrderType.PURCHASE;
    const model = isProcurement ? this.prisma.procurementOrder : this.prisma.salesOrder;

    const baseWhere: any = {
      deletedAt: null,
      ...buildTenantWhereClause(tenantId ?? undefined),
    };

    if (accountId) {
      baseWhere.accountId = accountId;
    }

    if (status) {
      baseWhere.status = status;
    }

    // Monthly orders (current month)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const monthlyWhere = {
      ...baseWhere,
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    };

    const [monthlyOrders, pendingOrders, completedOrders] = await Promise.all([
      (model as any).aggregate({
        where: monthlyWhere,
        _count: { id: true },
        _sum: { grandTotal: true },
      }),
      (model as any).aggregate({
        where: {
          ...baseWhere,
          status: isProcurement ? 'PENDING' : SalesOrderStatus.PENDING,
        },
        _count: { id: true },
        _sum: { grandTotal: true },
      }),
      (model as any).aggregate({
        where: {
          ...baseWhere,
          status: isProcurement ? 'SHIPPED' : SalesOrderStatus.SHIPPED,
        },
        _count: { id: true },
        _sum: { grandTotal: true },
      }),
    ]);

    return {
      monthlyOrders: {
        totalAmount: Number(monthlyOrders._sum.grandTotal || 0),
        count: monthlyOrders._count.id,
      },
      pendingOrders: {
        totalAmount: Number(pendingOrders._sum.grandTotal || 0),
        count: pendingOrders._count.id,
      },
      completedOrders: {
        totalAmount: Number(completedOrders._sum.grandTotal || 0),
        count: completedOrders._count.id,
      },
    };
  }
}
