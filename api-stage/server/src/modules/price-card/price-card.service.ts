import { PrismaService } from '../../common/prisma.service';
import { CreatePriceCardDto, PriceType } from './dto/create-price-card.dto';
import { FindAllPriceCardsDto, FindPriceCardsDto } from './dto/find-price-cards.dto';
import { BulkUpdatePriceCardDto } from './dto/bulk-update-price-card.dto';
import { TenantResolverService } from '../../common/services/tenant-resolver.service';
import { ProductService } from '../product/product.service';
import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { buildTenantWhereClause } from '../../common/utils/staging.util';

@Injectable()
export class PriceCardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantResolver: TenantResolverService,
    @Inject(forwardRef(() => ProductService))
    private readonly productService: ProductService,
  ) { }

  async create(createDto: CreatePriceCardDto, userId?: string) {
    const {
      productId,
      priceType = PriceType.SALE,
      price,
      salePrice,
      currency = 'TRY',
      effectiveFrom,
      effectiveTo,
      notes,
      vatRate = 20,
      minQuantity = 1,
      priceIncludesVat = false,
    } = createDto;

    let finalPrice = price ?? salePrice;

    // KDV dahil fiyattan KDV hariç fiyatı hesapla
    if (priceIncludesVat && finalPrice && vatRate) {
      finalPrice = finalPrice / (1 + vatRate / 100);
    }

    const tenantId = await this.tenantResolver.resolveForCreate({ allowNull: true });

    return this.prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({ where: { id: productId } });
      if (!product) {
        throw new NotFoundException('Stock record not found');
      }

      // Kategori veya marka tanımcısı olan placeholder'lara fiyat kartı oluşturulamaz
      if (product.isCategoryOnly === true || (product as any).isBrandOnly === true) {
        throw new BadRequestException(
          'Kategori veya marka tanımları için fiyat kartı oluşturulamaz. Lütfen gerçek bir ürün seçin.',
        );
      }

      const priceCard = await tx.priceCard.create({
        data: {
          tenantId: tenantId as string,
          productId,
          type: priceType as any,
          price: finalPrice,
          currency,
          effectiveFrom: effectiveFrom ? new Date(effectiveFrom) : undefined,
          effectiveTo: effectiveTo ? new Date(effectiveTo) : undefined,
          vatRate,
          minQuantity,
          note: notes || undefined,
          createdBy: userId,
          updatedBy: userId,
          isActive: true, // New cards are active by default
        } as any,
      });

      return priceCard;
    });
  }

  async findAll(query: FindAllPriceCardsDto) {
    const { page = 1, limit = 10, type, q, status, startDate, endDate } = query;
    const skip = (page - 1) * limit;
    const tenantId = await this.tenantResolver.resolveForQuery();

    const where: any = {
      ...buildTenantWhereClause(tenantId ?? undefined),
      ...(type && { type }),
      // Kategori ve marka placeholder ürünlere ait fiyat kartlarını gizle
      product: {
        isCategoryOnly: { not: true },
        isBrandOnly: { not: true },
      },
    };

    if (status === 'ACTIVE') {
      where.isActive = true;
    } else if (status === 'EXPIRED') {
      where.isActive = true;
      where.effectiveTo = { lt: new Date() };
    } else if (status === 'PASSIVE') {
      where.isActive = false;
    }

    if (q) {
      where.product = {
        ...where.product,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { code: { contains: q, mode: 'insensitive' } },
        ],
      };
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    const [items, total] = await Promise.all([
      this.prisma.priceCard.findMany({
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
            },
          },
          createdByUser: {
            select: {
              id: true,
              fullName: true,
            },
          },
        },
      }),
      this.prisma.priceCard.count({ where }),
    ]);

    return {
      data: items.map((item: any) => ({
        ...item,
        salePrice: item.price,
        priceType: item.type,
        notes: item.note,
        status: !item.isActive ? 'PASSIVE' : (item.effectiveTo && new Date(item.effectiveTo) < new Date() ? 'EXPIRED' : 'ACTIVE'),
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    try {
      const tenantId = await this.tenantResolver.resolveForQuery();
      console.log('[findOne] Looking for price card:', { id, tenantId });

      const item = await this.prisma.priceCard.findFirst({
        where: {
          id,
          ...buildTenantWhereClause(tenantId ?? undefined),
        },
        include: {
          product: {
            select: {
              id: true,
              code: true,
              name: true,
            },
          },
        },
      }) as any;

      if (!item) {
        console.log('[findOne] Price card not found:', { id });
        throw new NotFoundException('Price card not found');
      }

      console.log('[findOne] Price card found:', { id, itemId: item.id });

      return {
        ...item,
        salePrice: item.price,
        priceType: item.type,
        notes: item.note,
        status: item.isActive ? 'ACTIVE' : 'PASSIVE',
      };
    } catch (error) {
      console.error('[findOne] Error:', error);
      throw error;
    }
  }

  async update(id: string, updateDto: any, userId?: string) {
    try {
      const tenantId = await this.tenantResolver.resolveForQuery();
      console.log('[update] Updating price card:', { id, updateDto });
      const {
        priceType,
        notes,
        salePrice,
        price,
        status,
        effectiveFrom,
        effectiveTo,
        vatRate,
        minQuantity,
        currency,
        priceIncludesVat,
      } = updateDto;

      let finalPrice = price ?? salePrice;

      // KDV dahil fiyattan KDV hariç fiyatı hesapla
      if (priceIncludesVat && finalPrice !== undefined && vatRate !== undefined) {
        finalPrice = finalPrice / (1 + vatRate / 100);
      }

      const isActive = status === 'ACTIVE' ? true : status === 'PASSIVE' ? false : (status === 'EXPIRED' ? false : undefined);

      const data: any = {
        updatedBy: userId,
      };

      if (priceType) data.type = priceType;
      if (notes !== undefined) data.note = notes;
      if (finalPrice !== undefined) data.price = finalPrice;
      if (isActive !== undefined) data.isActive = isActive;
      if (currency) data.currency = currency;
      if (vatRate !== undefined) data.vatRate = Number(vatRate);
      if (minQuantity !== undefined) data.minQuantity = Number(minQuantity);

      if (effectiveFrom !== undefined) {
        data.effectiveFrom = effectiveFrom ? new Date(effectiveFrom) : null;
      }
      if (effectiveTo !== undefined) {
        data.effectiveTo = effectiveTo ? new Date(effectiveTo) : null;
      }

      console.log('[update] Data to update:', data);

      const result = await this.prisma.priceCard.update({
        where: {
          id,
          ...buildTenantWhereClause(tenantId ?? undefined),
        },
        data,
      });

      console.log('[update] Update successful:', { id });
      return result;
    } catch (error: any) {
      console.error('[update] Error:', error);
      throw error;
    }
  }

  async remove(id: string) {
    const tenantId = await this.tenantResolver.resolveForQuery();
    return this.prisma.priceCard.delete({
      where: {
        id,
        ...buildTenantWhereClause(tenantId ?? undefined),
      },
    });
  }

  async findByStok(productId: string, query: FindPriceCardsDto) {
    const tenantId = await this.tenantResolver.resolveForQuery();
    const type = query.type ?? PriceType.SALE;
    return this.prisma.priceCard.findMany({
      where: {
        ...buildTenantWhereClause(tenantId ?? undefined),
        productId,
        type,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        createdByUser: {
          select: {
            id: true,
            fullName: true,
            username: true,
          },
        },
      },
    });
  }

  async findLatest(productId: string, type: PriceType = PriceType.SALE) {
    const tenantId = await this.tenantResolver.resolveForQuery();
    return this.prisma.priceCard.findFirst({
      where: {
        ...buildTenantWhereClause(tenantId ?? undefined),
        productId,
        type,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async bulkUpdatePrices(dto: BulkUpdatePriceCardDto, userId?: string) {
    const { marka, anaKategori, altKategori, adjustmentType, adjustmentValue, note, basePriceType } = dto;
    const tenantId = await this.tenantResolver.resolveForCreate({ allowNull: true });

    // 1. Filtreye uyan ürünleri getir
    const result = await this.productService.findAll(1, 10000, undefined, undefined, marka, anaKategori, altKategori);
    const products = result.data;

    if (!products || products.length === 0) {
      return {
        message: 'Filtreye uygun ürün bulunamadı.',
        count: 0,
      };
    }

    const effectiveFrom = new Date();
    const basePriceLabel = basePriceType === 'SALE' ? 'Mevcut Satış' : 'Son Satınalma';
    const finalNote = note || `Toplu fiyat güncellemesi (${basePriceLabel} fiy. üzerinden ${adjustmentType === 'percentage' ? `%${adjustmentValue}` : `+${adjustmentValue} TRY`})`;

    let successCount = 0;
    let skippedCount = 0;
    const batchSize = 200;

    // Ürünleri batch'lere bölerek işle
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);

      await this.prisma.$transaction(async (tx) => {
        for (const product of batch) {
          let basePrice = basePriceType === 'SALE' ? (product.satisFiyati || 0) : ((product as any).sonAlisFiyati || 0);

          if (basePrice <= 0) {
            skippedCount++;
            continue;
          }

          const newPrice = adjustmentType === 'percentage'
            ? Number((basePrice * (1 + adjustmentValue / 100)).toFixed(2))
            : Number((basePrice + adjustmentValue).toFixed(2));

          if (newPrice <= 0) {
            skippedCount++;
            continue;
          }

          await tx.priceCard.create({
            data: {
              tenantId: tenantId as string,
              productId: product.id,
              type: PriceType.SALE,
              price: newPrice,
              currency: 'TRY',
              effectiveFrom,
              note: finalNote,
              createdBy: userId,
              updatedBy: userId,
              isActive: true,
            } as any,
          });
          successCount++;
        }
      }, {
        timeout: 30000, // 30 saniye timeout (batch başına)
      });
    }

    return {
      message: 'Toplu fiyat güncellemesi tamamlandı.',
      totalProcessed: products.length,
      successCount,
      skippedCount,
    };
  }
}