import { Injectable } from '@nestjs/common';
import { MovementType, PriceCardType, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

/**
 * ERP malzeme kartı için stok (hareket bazlı net) ve liste/satış fiyatı (fiyat kartı) metrikleri.
 */
@Injectable()
export class ErpProductLiveMetricsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Malzeme listesi (`ProductService.findAll`) ile aynı hareket mantığı.
   */
  async computeNetQuantitiesFromMovements(
    tenantId: string,
    productIds: string[],
  ): Promise<Map<string, number>> {
    const qtyByProduct = new Map<string, number>();
    if (productIds.length === 0) return qtyByProduct;

    const CHUNK = 400;
    for (let i = 0; i < productIds.length; i += CHUNK) {
      const chunk = productIds.slice(i, i + CHUNK);
      const movements = await this.prisma.productMovement.findMany({
        where: {
          productId: { in: chunk },
          product: { tenantId },
        },
        include: {
          invoiceItem: { include: { invoice: { select: { status: true } } } },
        },
      });
      for (const hareket of movements) {
        if (
          (hareket as { invoiceItem?: { invoice?: { status?: string } } })
            .invoiceItem?.invoice?.status === 'CANCELLED'
        ) {
          continue;
        }
        const pid = hareket.productId;
        let delta = 0;
        if (
          hareket.movementType === MovementType.ENTRY ||
          hareket.movementType === MovementType.COUNT_SURPLUS ||
          hareket.movementType === MovementType.RETURN ||
          hareket.movementType === MovementType.CANCELLATION_ENTRY
        ) {
          delta = hareket.quantity;
        } else if (
          hareket.movementType === MovementType.EXIT ||
          hareket.movementType === MovementType.SALE ||
          hareket.movementType === MovementType.COUNT_SHORTAGE ||
          hareket.movementType === MovementType.CANCELLATION_EXIT
        ) {
          delta = -hareket.quantity;
        } else {
          continue;
        }
        qtyByProduct.set(pid, (qtyByProduct.get(pid) ?? 0) + delta);
      }
    }
    return qtyByProduct;
  }

  /**
   * Aktif LIST / SALE fiyat kartından ürün başına liste birim fiyatı (en güncel).
   */
  async getListUnitPricesByProductIds(
    tenantId: string,
    productIds: string[],
  ): Promise<Map<string, number>> {
    const map = new Map<string, number>();
    if (productIds.length === 0) return map;

    const cards = await this.prisma.priceCard.findMany({
      where: {
        tenantId,
        productId: { in: productIds },
        isActive: true,
        type: { in: [PriceCardType.LIST, PriceCardType.SALE] },
      },
      orderBy: { updatedAt: 'desc' },
    });

    for (const c of cards) {
      if (!map.has(c.productId)) {
        map.set(c.productId, Number(c.price));
      }
    }
    return map;
  }

  async getDefaultWarehouse(tenantId: string): Promise<{
    id: string;
    name: string;
  } | null> {
    return this.prisma.warehouse.findFirst({
      where: { tenantId, active: true },
      orderBy: [{ isDefault: 'desc' }, { code: 'asc' }],
      select: { id: true, name: true },
    });
  }

  buildLiveStockSnapshot(
    netQty: number,
    warehouse: { id: string; name: string } | null,
  ): Array<{
    warehouseId: string;
    warehouseName: string;
    quantity: Prisma.Decimal;
    isAvailable: boolean;
    displayOrder: number;
  }> {
    const qty = new Prisma.Decimal(netQty);
    const w = warehouse;
    return [
      {
        warehouseId: w?.id ?? 'live-aggregate',
        warehouseName: w?.name ?? 'Toplam',
        quantity: qty,
        isAvailable: netQty > 0,
        displayOrder: 0,
      },
    ];
  }
}
