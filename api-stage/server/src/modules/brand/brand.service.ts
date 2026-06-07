import { TenantResolverService } from '../../common/services/tenant-resolver.service';
import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { buildTenantWhereClause } from '../../common/utils/staging.util';

@Injectable()
export class BrandService {
    constructor(private prisma: PrismaService, private readonly tenantResolver: TenantResolverService) { }

    private async tenantScope() {
        const tenantId = await this.tenantResolver.resolveForQuery();
        return buildTenantWhereClause(tenantId ?? undefined);
    }

    private async requireTenantId(): Promise<string> {
        const tenantId = await this.tenantResolver.resolveForCreate();
        if (!tenantId) {
            throw new BadRequestException(
                'Tenant bulunamadı. Lütfen tekrar giriş yapın veya x-tenant-id başlığını kontrol edin.',
            );
        }
        return tenantId;
    }

    private isPlaceholderProduct(p: { name?: string | null; isBrandOnly?: boolean | null }) {
        return (
            p.isBrandOnly === true ||
            (p.name?.includes('[Marka Tanımı]') ?? false) ||
            (p.name?.includes('[Brand Definition]') ?? false)
        );
    }

    /**
     * Fetch all brands (unique brands from products)
     * Includes placeholder records (with product count 0)
     */
    async findAll() {
        const tenantWhere = await this.tenantScope();
        const products = await this.prisma.product.findMany({
            where: {
                ...tenantWhere,
                brand: {
                    not: null,
                },
            },
            select: {
                brand: true,
                name: true,
                isBrandOnly: true,
            },
        });

        const allBrands = new Set<string>();
        const brandMap = new Map<string, number>();

        products.forEach((p) => {
            if (p.brand) {
                allBrands.add(p.brand);

                const isPlaceholder = this.isPlaceholderProduct(p);

                if (!isPlaceholder) {
                    const count = brandMap.get(p.brand) || 0;
                    brandMap.set(p.brand, count + 1);
                }
            }
        });

        const brands = Array.from(allBrands)
            .map((brandName) => ({
                brandName,
                productCount: brandMap.get(brandName) || 0,
            }))
            .sort((a, b) => a.brandName.localeCompare(b.brandName, 'tr'));

        return brands;
    }

    /**
     * Fetch a specific brand
     */
    async findOne(brandName: string) {
        const decodedBrandName = decodeURIComponent(brandName);
        const tenantWhere = await this.tenantScope();

        const productCount = await this.prisma.product.count({
            where: {
                ...tenantWhere,
                brand: decodedBrandName,
                NOT: {
                    OR: [
                        { isBrandOnly: true },
                        { name: { contains: '[Marka Tanımı]' } },
                        { name: { contains: '[Brand Definition]' } },
                    ],
                },
            },
        });

        const totalProductCount = await this.prisma.product.count({
            where: {
                ...tenantWhere,
                brand: decodedBrandName,
            },
        });

        if (totalProductCount === 0) {
            throw new NotFoundException(`Brand not found: ${decodedBrandName}`);
        }

        return {
            brandName: decodedBrandName,
            productCount,
        };
    }

    /**
     * Add a new brand - Creates a placeholder product record
     */
    async create(brandName: string) {
        if (!brandName || !brandName.trim()) {
            throw new BadRequestException('Brand name is required');
        }

        const trimmedBrandName = brandName.trim();
        const tenantId = await this.requireTenantId();
        const tenantWhere = await this.tenantScope();

        const existingProduct = await this.prisma.product.findFirst({
            where: {
                ...tenantWhere,
                brand: trimmedBrandName,
            },
        });

        if (existingProduct) {
            throw new BadRequestException(`Brand "${trimmedBrandName}" already exists`);
        }

        const timestamp = Date.now().toString().slice(-6);
        const code = `BRD-${trimmedBrandName.substring(0, 3).toUpperCase()}-${timestamp}`;

        try {
            const product = await this.prisma.product.create({
                data: {
                    tenantId,
                    code,
                    name: `[Brand Definition] ${trimmedBrandName}`,
                    unit: 'Adet',
                    priceCards: {
                        create: [
                            {
                                tenantId,
                                type: 'PURCHASE',
                                price: 0,
                                vatRate: 20,
                            },
                            {
                                tenantId,
                                type: 'SALE',
                                price: 0,
                                vatRate: 20,
                            }
                        ]
                    },
                    brand: trimmedBrandName,
                    isBrandOnly: true,
                    description:
                        'This record was created only for brand definition. It is not a real product.',
                },
            });

            return {
                message: `Brand "${trimmedBrandName}" added successfully`,
                brandName: trimmedBrandName,
                productCode: product.code,
            };
        } catch (error: any) {
            if (error.code === 'P2002') {
                const timestamp = Date.now().toString();
                const retryCode = `BRD-${trimmedBrandName.substring(0, 3).toUpperCase()}-${timestamp}`;

                const product = await this.prisma.product.create({
                    data: {
                        tenantId,
                        code: retryCode,
                        name: `[Brand Definition] ${trimmedBrandName}`,
                        unit: 'Adet',
                        priceCards: {
                            create: [
                                {
                                    tenantId,
                                    type: 'PURCHASE',
                                    price: 0,
                                    vatRate: 20,
                                },
                                {
                                    tenantId,
                                    type: 'SALE',
                                    price: 0,
                                    vatRate: 20,
                                }
                            ]
                        },
                        brand: trimmedBrandName,
                        isBrandOnly: true,
                        description:
                            'This record was created only for brand definition. It is not a real product.',
                    },
                });

                return {
                    message: `Brand "${trimmedBrandName}" added successfully`,
                    brandName: trimmedBrandName,
                    productCode: product.code,
                };
            }

            throw new BadRequestException(
                error?.message || 'An error occurred while adding the brand',
            );
        }
    }

    /**
     * Update brand - Changes the brand name across all associated products
     */
    async update(brandName: string, newBrandName: string) {
        const decodedBrandName = decodeURIComponent(brandName);
        const decodedNewBrandName = decodeURIComponent(newBrandName);
        const tenantWhere = await this.tenantScope();

        if (decodedBrandName === decodedNewBrandName) {
            throw new BadRequestException(
                'New brand name cannot be identical to the existing brand name',
            );
        }

        const productCount = await this.prisma.product.count({
            where: {
                ...tenantWhere,
                brand: decodedBrandName,
            },
        });

        if (productCount === 0) {
            throw new NotFoundException(`Brand not found: ${decodedBrandName}`);
        }

        const newBrandProductCount = await this.prisma.product.count({
            where: {
                ...tenantWhere,
                brand: decodedNewBrandName,
            },
        });

        if (newBrandProductCount > 0) {
            throw new BadRequestException(
                `Brand name "${decodedNewBrandName}" is already in use`,
            );
        }

        await this.prisma.product.updateMany({
            where: {
                ...tenantWhere,
                brand: decodedBrandName,
            },
            data: {
                brand: decodedNewBrandName,
            },
        });

        return {
            message: `Brand successfully updated from "${decodedBrandName}" to "${decodedNewBrandName}"`,
            oldBrandName: decodedBrandName,
            newBrandName: decodedNewBrandName,
            affectedProductCount: productCount,
        };
    }

    /**
     * Remove brand - Can only be removed if no real products are attached
     */
    async remove(brandName: string) {
        const decodedBrandName = decodeURIComponent(brandName);
        const tenantWhere = await this.tenantScope();

        const productCount = await this.prisma.product.count({
            where: {
                ...tenantWhere,
                brand: decodedBrandName,
                NOT: {
                    OR: [
                        { isBrandOnly: true },
                        { name: { contains: '[Marka Tanımı]' } },
                        { name: { contains: '[Brand Definition]' } },
                    ],
                },
            },
        });

        const totalProductCount = await this.prisma.product.count({
            where: {
                ...tenantWhere,
                brand: decodedBrandName,
            },
        });

        if (totalProductCount === 0) {
            throw new NotFoundException(`Brand not found: ${decodedBrandName}`);
        }

        if (productCount > 0) {
            throw new BadRequestException(
                `There are ${productCount} products attached to this brand. Brands with products cannot be deleted.`,
            );
        }

        const placeholderRecords = await this.prisma.product.findMany({
            where: {
                ...tenantWhere,
                brand: decodedBrandName,
                OR: [
                    { isBrandOnly: true },
                    { name: { contains: '[Marka Tanımı]' } },
                    { name: { contains: '[Brand Definition]' } },
                ],
            },
            select: { id: true },
        });

        if (placeholderRecords.length > 0) {
            await this.prisma.product.deleteMany({
                where: {
                    id: {
                        in: placeholderRecords.map((k) => k.id),
                    },
                },
            });
        }

        return {
            message: `Brand "${decodedBrandName}" removed successfully`,
            brandName: decodedBrandName,
            deletedPlaceholderCount: placeholderRecords.length,
        };
    }
}
