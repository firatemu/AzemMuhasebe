import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { TenantResolverService } from '../../common/services/tenant-resolver.service';
import { buildTenantWhereClause } from '../../common/utils/staging.util';
import { Prisma } from '@prisma/client';
import * as ExcelJS from 'exceljs';

@Injectable()
export class PriceCardExportService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly tenantResolver: TenantResolverService,
    ) { }

    async generateExcel(
        type?: string,
        status?: string,
        search?: string,
    ): Promise<Buffer> {
        const tenantId = await this.tenantResolver.resolveForQuery();

        const where: any = {
            ...buildTenantWhereClause(tenantId ?? undefined),
        };

        if (type) where.type = type;
        if (status) {
            where.isActive = status === 'ACTIVE';
        }

        if (search) {
            where.OR = [
                { product: { code: { contains: search, mode: 'insensitive' } } },
                { product: { name: { contains: search, mode: 'insensitive' } } },
            ];
        }

        const cards = await this.prisma.priceCard.findMany({
            where,
            include: {
                product: { select: { code: true, name: true, brand: true } },
            },
            orderBy: { createdAt: 'desc' },
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Fiyat Kartları');

        const statusLabels: Record<string, string> = {
            true: 'Aktif',
            false: 'Pasif',
        };

        const typeLabels: Record<string, string> = {
            SALE: 'Satış',
            PURCHASE: 'Alış',
            CAMPAIGN: 'Kampanya',
            LIST: 'Liste',
        };

        worksheet.columns = [
            { header: 'Stok Kodu', key: 'code', width: 20 },
            { header: 'Stok Adı', key: 'name', width: 35 },
            { header: 'Marka', key: 'brand', width: 15 },
            { header: 'Tip', key: 'type', width: 12 },
            { header: 'Fiyat (KDV Hariç)', key: 'price', width: 18 },
            { header: 'Döviz', key: 'currency', width: 10 },
            { header: 'KDV %', key: 'vatRate', width: 10 },
            { header: 'Min. Miktar', key: 'minQuantity', width: 12 },
            { header: 'Geçerlilik Başlangıç', key: 'effectiveFrom', width: 20 },
            { header: 'Geçerlilik Bitiş', key: 'effectiveTo', width: 20 },
            { header: 'Durum', key: 'status', width: 12 },
            { header: 'Not', key: 'note', width: 30 },
        ];

        // Style header row
        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF1976D2' },
        };
        headerRow.alignment = { horizontal: 'center' };

        // Add data
        cards.forEach((c) => {
            worksheet.addRow({
                code: c.product?.code || '',
                name: c.product?.name || '',
                brand: c.product?.brand || '',
                type: typeLabels[c.type] || c.type,
                price: Number(c.price),
                currency: c.currency,
                vatRate: Number(c.vatRate),
                minQuantity: Number(c.minQuantity),
                effectiveFrom: c.effectiveFrom ? new Date(c.effectiveFrom).toLocaleDateString('tr-TR') : '',
                effectiveTo: c.effectiveTo ? new Date(c.effectiveTo).toLocaleDateString('tr-TR') : 'Süresiz',
                status: statusLabels[String(c.isActive)],
                note: c.note || '',
            });
        });

        // Number formatting
        worksheet.getColumn('price').numFmt = '#,##0.00';
        worksheet.getColumn('vatRate').numFmt = '0"%"';

        const buffer = await workbook.xlsx.writeBuffer();
        return Buffer.from(buffer);
    }
}
