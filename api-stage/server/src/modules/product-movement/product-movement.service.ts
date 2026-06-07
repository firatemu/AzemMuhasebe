import { buildTenantWhereClause } from '../../common/utils/staging.util';
import { TenantResolverService } from '../../common/services/tenant-resolver.service';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { MovementType } from './product-movement.controller';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductMovementService {
  constructor(private prisma: PrismaService, private readonly tenantResolver: TenantResolverService) { }

  async findAll(
    page = 1,
    limit = 100,
    productId?: string,
    movementType?: MovementType,
    tenantId?: string,
  ) {
    const skip = (page - 1) * limit;

    const resolvedTenantId = await this.tenantResolver.resolveForQuery();
    const where: Prisma.ProductMovementWhereInput = {
      ...buildTenantWhereClause(tenantId || resolvedTenantId || undefined),
    };

    if (productId) {
      where.productId = productId;
    }

    if (movementType) {
      where.movementType = movementType as any;
    }

    const [data, total] = await Promise.all([
      this.prisma.productMovement.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          product: {
            select: {
              id: true,
              code: true,
              name: true,
              brand: true,
              unit: true,
            },
          },
          warehouse: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
          invoiceItem: {
            select: {
              id: true,
              unitPrice: true,
              discountRate: true,
              discountAmount: true,
              amount: true,
              invoice: {
                select: {
                  invoiceNo: true,
                  invoiceType: true,
                  status: true,
                  account: {
                    select: {
                      title: true,
                      code: true,
                    },
                  },
                },
              },
            },
          },
        },
      }),
      this.prisma.productMovement.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
