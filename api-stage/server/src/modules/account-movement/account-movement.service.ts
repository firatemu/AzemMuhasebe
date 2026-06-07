import { TenantResolverService } from '../../common/services/tenant-resolver.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateAccountMovementDto, StatementQueryDto, parseDetailIncludeFlags } from './dto';
import {
    DETAILED_STATEMENT_MAX_MOVEMENTS,
    collectCollectionIds,
    mapMovementToDetailed,
} from './detailed-statement.helper';
import {
    TR_STATEMENT,
    buildFirmaAdresMetni,
    buildTarihAraligiMetni,
    formatBakiyeYonu,
    formatParaTRY,
} from './statement-export-i18n.tr';
import { Prisma, DebitCredit } from '@prisma/client';
import * as ExcelJS from 'exceljs';
import PdfPrinter from 'pdfmake';
import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { buildTenantWhereClause } from '../../common/utils/staging.util';

@Injectable()
export class AccountMovementService {
    constructor(private prisma: PrismaService, private readonly tenantResolver: TenantResolverService) { }

    async create(dto: CreateAccountMovementDto) {
        const tenantId = await this.tenantResolver.resolveForQuery();
        const account = await this.prisma.account.findFirst({
            where: { id: dto.accountId, ...buildTenantWhereClause(tenantId ?? undefined) },
        });

        if (!account) {
            throw new NotFoundException('Account not found');
        }

        let nextBalance = Number(account.balance);

        if (dto.type === 'DEBIT') {
            nextBalance += Number(dto.amount);
        } else if (dto.type === 'CREDIT') {
            nextBalance -= Number(dto.amount);
        } else if (dto.type === 'CARRY_FORWARD' || dto.type === 'CARRY_FORWARD') {
            nextBalance = Number(dto.amount);
        }

        const movement = await this.prisma.$transaction(async (tx) => {
            const newMovement = await tx.accountMovement.create({
                data: {
                    accountId: dto.accountId,
                    tenantId: account.tenantId,
                    type: dto.type as DebitCredit,
                    amount: new Prisma.Decimal(dto.amount),
                    balance: new Prisma.Decimal(nextBalance),
                    documentType: dto.documentType,
                    documentNo: dto.documentNo,
                    date: dto.date ? new Date(dto.date) : new Date(),
                    notes: dto.notes?.trim() || '',
                },
                include: {
                    account: true,
                },
            });

            await tx.account.update({
                where: { id: dto.accountId },
                data: { balance: new Prisma.Decimal(nextBalance) },
            });

            return newMovement;
        });

        return movement;
    }

    async findAll(accountId: string, skip = 0, take = 100) {
        const tenantId = await this.tenantResolver.resolveForQuery();
        const [movements, total] = await Promise.all([
            this.prisma.accountMovement.findMany({
                where: { accountId, ...buildTenantWhereClause(tenantId ?? undefined) },
                include: { account: true },
                orderBy: { date: 'desc' },
                skip,
                take,
            }),
            this.prisma.accountMovement.count({ where: { accountId, ...buildTenantWhereClause(tenantId ?? undefined) } }),
        ]);

        return {
            data: movements,
            total,
        };
    }

    async getStatement(query: StatementQueryDto) {
        const tenantId = await this.tenantResolver.resolveForQuery();
        const where: any = { accountId: query.accountId, ...buildTenantWhereClause(tenantId ?? undefined) };

        if (query.startDate || query.endDate) {
            where.date = {};
            if (query.startDate) {
                where.date.gte = new Date(query.startDate);
            }
            if (query.endDate) {
                where.date.lte = new Date(query.endDate);
            }
        }

        const [account, movements] = await Promise.all([
            this.prisma.account.findFirst({
                where: { id: query.accountId, ...buildTenantWhereClause(tenantId ?? undefined) },
            }),
            this.prisma.accountMovement.findMany({
                where,
                orderBy: { date: 'asc' },
            }),
        ]);

        return {
            account,
            movements,
        };
    }

    async exportExcel(query: StatementQueryDto): Promise<Buffer> {
        const { account, movements } = await this.getStatement(query);

        if (!account) {
            throw new NotFoundException('Account not found');
        }

        const tenantSettings = await this.prisma.tenantSettings.findUnique({
            where: { tenantId: account.tenantId || '' },
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(TR_STATEMENT.sheetName);

        worksheet.mergeCells('A1:F1');
        worksheet.getCell('A1').value = tenantSettings?.companyName || 'OTOMUHASEBE ERP';
        worksheet.getCell('A1').font = { size: 14, bold: true, color: { argb: 'FF1F2937' } };

        worksheet.mergeCells('A2:F2');
        worksheet.getCell('A2').value = TR_STATEMENT.title;
        worksheet.getCell('A2').font = { size: 18, bold: true, color: { argb: 'FF527575' } };
        worksheet.getCell('A2').alignment = { horizontal: 'center' };

        const periodText = buildTarihAraligiMetni(query.startDate, query.endDate);
        if (periodText) {
            worksheet.mergeCells('A3:F3');
            worksheet.getCell('A3').value = periodText;
            worksheet.getCell('A3').alignment = { horizontal: 'center' };
        }

        worksheet.getCell('A4').value = `${TR_STATEMENT.cariUnvan}:`;
        worksheet.getCell('B4').value = (account as any).title;
        worksheet.getCell('A4').font = { bold: true };

        worksheet.getCell('A5').value = `${TR_STATEMENT.cariKodu}:`;
        worksheet.getCell('B5').value = (account as any).code;
        worksheet.getCell('A5').font = { bold: true };

        worksheet.getCell('D4').value = `${TR_STATEMENT.tarih}:`;
        worksheet.getCell('E4').value = new Date().toLocaleDateString('tr-TR');
        worksheet.getCell('D4').font = { bold: true };

        if ((account as any).taxNumber) {
            worksheet.getCell('A6').value = `${TR_STATEMENT.vergiDairesiNo}:`;
            worksheet.getCell('B6').value = `${(account as any).taxOffice || ''} / ${(account as any).taxNumber}`;
            worksheet.getCell('A6').font = { bold: true };
        }

        const totalDebt = movements
            .filter((h) => h.type === 'DEBIT')
            .reduce((sum, h) => sum + Number(h.amount), 0);
        const totalCredit = movements
            .filter((h) => h.type === 'CREDIT')
            .reduce((sum, h) => sum + Number(h.amount), 0);

        worksheet.getCell('A8').value = TR_STATEMENT.toplamBorc;
        worksheet.getCell('B8').value = totalDebt;
        worksheet.getCell('B8').numFmt = '#,##0.00 ₺';
        worksheet.getCell('B8').font = { bold: true, color: { argb: 'FFEF4444' } };

        worksheet.getCell('C8').value = TR_STATEMENT.toplamAlacak;
        worksheet.getCell('D8').value = totalCredit;
        worksheet.getCell('D8').numFmt = '#,##0.00 ₺';
        worksheet.getCell('D8').font = { bold: true, color: { argb: 'FF10B981' } };

        worksheet.getCell('E8').value = TR_STATEMENT.netBakiye;
        worksheet.getCell('F8').value = Number((account as any).balance);
        worksheet.getCell('F8').numFmt = '#,##0.00 ₺';
        worksheet.getCell('F8').font = { bold: true };

        worksheet.addRow([]);
        const dataHeaderRow = worksheet.addRow([
            TR_STATEMENT.tarih,
            TR_STATEMENT.belgeNo,
            TR_STATEMENT.aciklama,
            TR_STATEMENT.borc,
            TR_STATEMENT.alacak,
            TR_STATEMENT.bakiye,
        ]);

        dataHeaderRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        dataHeaderRow.eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF527575' },
            };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };
        });

        movements.forEach((movement, index) => {
            const row = worksheet.addRow([
                new Date(movement.date).toLocaleDateString('tr-TR'),
                movement.documentNo || '-',
                movement.notes,
                movement.type === 'DEBIT' ? Number(movement.amount) : null,
                movement.type === 'CREDIT' ? Number(movement.amount) : null,
                Number(movement.balance),
            ]);

            row.eachCell((cell, colNumber) => {
                if (colNumber >= 4) {
                    cell.numFmt = '#,##0.00 ₺';
                }
                cell.alignment = { vertical: 'middle' };
                if (index % 2 === 0) {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFF9FAFB' },
                    };
                }
                cell.border = {
                    top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
                    left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
                    bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
                    right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
                };
            });

            if (movement.type === 'DEBIT') row.getCell(4).font = { color: { argb: 'FFEF4444' } };
            if (movement.type === 'CREDIT') row.getCell(5).font = { color: { argb: 'FF10B981' } };
            row.getCell(6).font = { bold: true };
        });

        worksheet.columns = [
            { width: 15 },
            { width: 15 },
            { width: 50 },
            { width: 15 },
            { width: 15 },
            { width: 15 },
        ];

        const buffer = await workbook.xlsx.writeBuffer();
        return Buffer.from(buffer);
    }

    async exportPdf(query: StatementQueryDto): Promise<Buffer> {
        const { account, movements } = await this.getStatement(query);

        if (!account) {
            throw new NotFoundException('Account not found');
        }

        const tenantSettings = await this.prisma.tenantSettings.findUnique({
            where: { tenantId: account.tenantId || '' },
        });

        let logoBase64: string | null = null;
        if (tenantSettings?.logoUrl) {
            try {
                if (tenantSettings.logoUrl.startsWith('/api/uploads/')) {
                    const fileName = tenantSettings.logoUrl.replace('/api/uploads/', '');
                    const filePath = path.join(process.cwd(), 'uploads', fileName);
                    if (fs.existsSync(filePath)) {
                        const buffer = fs.readFileSync(filePath);
                        const ext = path.extname(fileName).toLowerCase().replace('.', '');
                        logoBase64 = `data:image/${ext === 'jpg' ? 'jpeg' : ext};base64,${buffer.toString('base64')}`;
                    }
                } else if (tenantSettings.logoUrl.startsWith('data:image')) {
                    logoBase64 = tenantSettings.logoUrl;
                } else {
                    const response = await axios.get(tenantSettings.logoUrl, { responseType: 'arraybuffer' });
                    const buffer = Buffer.from(response.data, 'binary');
                    const ext = path.extname(tenantSettings.logoUrl).toLowerCase().replace('.', '') || 'png';
                    logoBase64 = `data:image/${ext === 'jpg' ? 'jpeg' : ext};base64,${buffer.toString('base64')}`;
                }
            } catch (error) {
                console.error('Error loading logo:', error);
            }
        }

        const vfs = require('pdfmake/build/vfs_fonts.js');
        const fonts = {
            Roboto: {
                normal: Buffer.from(vfs['Roboto-Regular.ttf'], 'base64'),
                bold: Buffer.from(
                    vfs['Roboto-Medium.ttf'] || vfs['Roboto-Regular.ttf'],
                    'base64',
                ),
                italics: Buffer.from(
                    vfs['Roboto-Italic.ttf'] || vfs['Roboto-Regular.ttf'],
                    'base64',
                ),
            },
        };

        const printer = new PdfPrinter(fonts);

        const totalDebt = movements
            .filter((h) => h.type === 'DEBIT')
            .reduce((sum, h) => sum + Number(h.amount), 0);
        const totalCredit = movements
            .filter((h) => h.type === 'CREDIT')
            .reduce((sum, h) => sum + Number(h.amount), 0);
        const netBalance = Number((account as any).balance);
        const periodText = buildTarihAraligiMetni(query.startDate, query.endDate);
        const olusturmaTarihi = new Date().toLocaleString('tr-TR');

        const docDefinition: TDocumentDefinitions = {
            pageSize: 'A4',
            pageMargins: [40, 140, 40, 60],
            header: {
                margin: [40, 20, 40, 0],
                columns: [
                    {
                        width: '*',
                        stack: [
                            logoBase64
                                ? {
                                    image: logoBase64,
                                    width: 120,
                                    margin: [0, 0, 0, 10],
                                }
                                : { text: '' },
                            {
                                text: tenantSettings?.companyName || 'OTOMUHASEBE ERP',
                                style: 'companyName',
                            },
                            {
                                text: buildFirmaAdresMetni(tenantSettings),
                                style: 'companyAddress',
                            },
                        ],
                    },
                    {
                        width: 'auto',
                        stack: [
                            { text: TR_STATEMENT.title, style: 'docTitle', alignment: 'right' },
                            ...(periodText
                                ? [{ text: periodText, style: 'docDate', alignment: 'right' }]
                                : []),
                            {
                                text: `${TR_STATEMENT.tarih}: ${new Date().toLocaleDateString('tr-TR')}`,
                                style: 'docDate',
                                alignment: 'right',
                            },
                        ],
                    },
                ],
            },
            content: [
                {
                    style: 'customerBox',
                    table: {
                        widths: ['auto', '*', 'auto', 'auto'],
                        body: [
                            [
                                { text: `${TR_STATEMENT.cariUnvan}:`, style: 'labelBold', border: [false, false, false, false] },
                                { text: (account as any).title, style: 'customerName', border: [false, false, false, false] },
                                { text: `${TR_STATEMENT.cariKodu}:`, style: 'labelBold', border: [false, false, false, false] },
                                { text: (account as any).code, style: 'value', border: [false, false, false, false] },
                            ],
                            [
                                { text: `${TR_STATEMENT.vergiDairesiNo}:`, style: 'labelBold', border: [false, false, false, false] },
                                {
                                    text: (account as any).taxNumber ? `${(account as any).taxOffice || ''} / ${(account as any).taxNumber}` : '-',
                                    style: 'value',
                                    border: [false, false, false, false]
                                },
                                { text: `${TR_STATEMENT.bakiye}:`, style: 'labelBold', border: [false, false, false, false] },
                                {
                                    text: `${formatParaTRY(netBalance)} (${formatBakiyeYonu(netBalance)})`,
                                    style: netBalance < 0 ? 'valueDanger' : netBalance > 0 ? 'valueSuccess' : 'value',
                                    border: [false, false, false, false]
                                }
                            ],
                        ],
                    },
                    layout: 'noBorders',
                },

                {
                    style: 'summaryTable',
                    table: {
                        widths: ['*', '*', '*'],
                        body: [
                            [
                                { text: TR_STATEMENT.toplamBorc, style: 'summaryHeader', alignment: 'center', fillColor: '#fef2f2' },
                                { text: TR_STATEMENT.toplamAlacak, style: 'summaryHeader', alignment: 'center', fillColor: '#f0fdf4' },
                                { text: TR_STATEMENT.netBakiye, style: 'summaryHeader', alignment: 'center', fillColor: '#f3f4f6' },
                            ],
                            [
                                { text: formatParaTRY(totalDebt), style: 'summaryValueDanger', alignment: 'center' },
                                { text: formatParaTRY(totalCredit), style: 'summaryValueSuccess', alignment: 'center' },
                                { text: `${formatParaTRY(netBalance)} (${formatBakiyeYonu(netBalance)})`, style: 'summaryValueBold', alignment: 'center' },
                            ],
                        ],
                    },
                    layout: {
                        hLineWidth: (i: number) => (i === 0 || i === 2) ? 1 : 0,
                        vLineWidth: (i: number) => (i === 0 || i === 3) ? 1 : 1,
                        hLineColor: (i: number) => '#e5e7eb',
                        vLineColor: (i: number) => '#e5e7eb',
                    }
                },

                {
                    style: 'transactionTable',
                    table: {
                        headerRows: 1,
                        widths: ['auto', 'auto', '*', 'auto', 'auto', 'auto'],
                        body: [
                            [
                                { text: TR_STATEMENT.tarih, style: 'tableHeader' },
                                { text: TR_STATEMENT.belgeNo, style: 'tableHeader' },
                                { text: TR_STATEMENT.aciklama, style: 'tableHeader' },
                                { text: TR_STATEMENT.borc, style: 'tableHeader', alignment: 'right' },
                                { text: TR_STATEMENT.alacak, style: 'tableHeader', alignment: 'right' },
                                { text: TR_STATEMENT.bakiye, style: 'tableHeader', alignment: 'right' },
                            ],
                            ...movements.map((h, index) => [
                                { text: new Date(h.date).toLocaleDateString('tr-TR'), style: 'tableCell' },
                                { text: h.documentNo || '-', style: 'tableCell' },
                                { text: h.notes, style: 'tableCell' },
                                {
                                    text: h.type === 'DEBIT' ? Number(h.amount).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '',
                                    style: 'tableCellDanger',
                                    alignment: 'right',
                                },
                                {
                                    text: h.type === 'CREDIT' ? Number(h.amount).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '',
                                    style: 'tableCellSuccess',
                                    alignment: 'right',
                                },
                                {
                                    text: Number(h.balance).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                                    style: 'tableCellBold',
                                    alignment: 'right'
                                },
                            ]),
                        ],
                    },
                    layout: {
                        fillColor: (rowIndex: number) => {
                            return (rowIndex > 0 && rowIndex % 2 === 0) ? '#f9fafb' : null;
                        },
                        hLineWidth: (i: number, node: any) => {
                            return (i === 0 || i === node.table.body.length) ? 1 : 1;
                        },
                        vLineWidth: (i: number, node: any) => {
                            return (i === 0 || i === node.table.widths.length) ? 1 : 1;
                        },
                        hLineColor: (i: number) => '#e5e7eb',
                        vLineColor: (i: number) => '#e5e7eb',
                    }
                } as any,
            ],
            footer: (currentPage: number, pageCount: number) => ({
                margin: [40, 0, 40, 0],
                columns: [
                    {
                        width: '*',
                        text: `${TR_STATEMENT.olusturmaNotu} ${olusturmaTarihi} tarihinde oluşturulmuştur.`,
                        fontSize: 7,
                        color: '#9ca3af',
                    },
                    {
                        width: 'auto',
                        text: `${TR_STATEMENT.sayfa} ${currentPage} / ${pageCount}`,
                        fontSize: 8,
                        color: '#6b7280',
                        alignment: 'right',
                    },
                ],
            }),
            styles: {
                companyName: {
                    fontSize: 16,
                    bold: true,
                    color: '#111827',
                    margin: [0, 0, 0, 2],
                },
                companyAddress: {
                    fontSize: 8,
                    color: '#4b5563',
                    lineHeight: 1.2,
                },
                docTitle: {
                    fontSize: 18,
                    bold: true,
                    color: '#527575',
                    margin: [0, 0, 0, 2],
                },
                docDate: {
                    fontSize: 9,
                    color: '#6b7280',
                },
                customerBox: {
                    margin: [0, 0, 0, 20],
                },
                labelBold: {
                    fontSize: 8,
                    bold: true,
                    color: '#6b7280',
                    margin: [0, 2, 0, 2],
                },
                customerName: {
                    fontSize: 10,
                    bold: true,
                    color: '#111827',
                    margin: [0, 2, 0, 2],
                },
                value: {
                    fontSize: 9,
                    color: '#111827',
                    margin: [0, 2, 0, 2],
                },
                valueSuccess: {
                    fontSize: 9,
                    bold: true,
                    color: '#059669',
                    margin: [0, 2, 0, 2],
                },
                valueDanger: {
                    fontSize: 9,
                    bold: true,
                    color: '#dc2626',
                    margin: [0, 2, 0, 2],
                },
                summaryTable: {
                    margin: [0, 0, 0, 20],
                },
                summaryHeader: {
                    fontSize: 8,
                    bold: true,
                    color: '#374151',
                    margin: [0, 5, 0, 5],
                },
                summaryValueSuccess: {
                    fontSize: 10,
                    bold: true,
                    color: '#059669',
                    margin: [0, 5, 0, 5],
                },
                summaryValueDanger: {
                    fontSize: 10,
                    bold: true,
                    color: '#dc2626',
                    margin: [0, 5, 0, 5],
                },
                summaryValueBold: {
                    fontSize: 10,
                    bold: true,
                    color: '#111827',
                    margin: [0, 5, 0, 5],
                },
                transactionTable: {
                    margin: [0, 0, 0, 0],
                },
                tableHeader: {
                    fontSize: 8,
                    bold: true,
                    color: '#ffffff',
                    fillColor: '#527575',
                    margin: [0, 5, 0, 5],
                },
                tableCell: {
                    fontSize: 8,
                    color: '#374151',
                    margin: [0, 5, 0, 5],
                },
                tableCellBold: {
                    fontSize: 8,
                    bold: true,
                    color: '#111827',
                    margin: [0, 5, 0, 5],
                },
                tableCellSuccess: {
                    fontSize: 8,
                    color: '#059669',
                    margin: [0, 5, 0, 5],
                },
                tableCellDanger: {
                    fontSize: 8,
                    color: '#dc2626',
                    margin: [0, 5, 0, 5],
                },
            },
            defaultStyle: {
                font: 'Roboto',
            },
        };

        return new Promise((resolve, reject) => {
            try {
                const pdfDoc = printer.createPdfKitDocument(docDefinition);
                const chunks: Buffer[] = [];

                pdfDoc.on('data', (chunk) => chunks.push(chunk));
                pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
                pdfDoc.on('error', reject);

                pdfDoc.end();
            } catch (error) {
                reject(error);
            }
        });
    }

    private async loadDetailedStatementData(
        query: StatementQueryDto,
        includeQuery?: { invoiceLines?: string; collections?: string; checks?: string },
    ) {
        const tenantId = await this.tenantResolver.resolveForQuery();
        const flags = parseDetailIncludeFlags(includeQuery ?? {});

        const where: any = {
            accountId: query.accountId,
            deletedAt: null,
            ...buildTenantWhereClause(tenantId ?? undefined),
        };

        if (query.startDate || query.endDate) {
            where.date = {};
            if (query.startDate) where.date.gte = new Date(query.startDate);
            if (query.endDate) {
                const end = new Date(query.endDate);
                end.setHours(23, 59, 59, 999);
                where.date.lte = end;
            }
        }

        const [account, movements, total] = await Promise.all([
            this.prisma.account.findFirst({
                where: { id: query.accountId, ...buildTenantWhereClause(tenantId ?? undefined) },
            }),
            this.prisma.accountMovement.findMany({
                where,
                orderBy: [{ date: 'asc' }, { id: 'asc' }],
                take: DETAILED_STATEMENT_MAX_MOVEMENTS + 1,
                include: {
                    invoice: {
                        include: {
                            items: {
                                include: {
                                    product: { select: { name: true, code: true } },
                                },
                            },
                        },
                    },
                    checkBill: {
                        select: {
                            id: true,
                            type: true,
                            checkNo: true,
                            serialNo: true,
                            amount: true,
                            dueDate: true,
                            status: true,
                            bank: true,
                            portfolioType: true,
                        },
                    },
                },
            }),
            this.prisma.accountMovement.count({ where }),
        ]);

        if (!account) {
            throw new NotFoundException('Account not found');
        }

        if (total > DETAILED_STATEMENT_MAX_MOVEMENTS) {
            throw new BadRequestException(
                `Detaylı ekstre en fazla ${DETAILED_STATEMENT_MAX_MOVEMENTS} hareket için oluşturulabilir. Seçili aralıkta ${total} hareket var; tarih aralığını daraltın.`,
            );
        }

        const collectionIds = flags.collections ? collectCollectionIds(movements) : [];
        const collections =
            collectionIds.length > 0
                ? await this.prisma.collection.findMany({
                      where: {
                          id: { in: collectionIds },
                          ...buildTenantWhereClause(tenantId ?? undefined),
                      },
                      include: {
                          cashbox: { select: { name: true } },
                          bankAccount: { select: { name: true } },
                          invoice: { select: { invoiceNo: true } },
                      },
                  })
                : [];

        const collectionMap = new Map(collections.map((c) => [c.id, c]));
        const detailedMovements = movements.map((m) =>
            mapMovementToDetailed(m, collectionMap, flags),
        );

        const totalDebit = movements
            .filter((h) => h.type === 'DEBIT')
            .reduce((sum, h) => sum + Number(h.amount), 0);
        const totalCredit = movements
            .filter((h) => h.type === 'CREDIT')
            .reduce((sum, h) => sum + Number(h.amount), 0);

        return {
            account,
            flags,
            movements: detailedMovements,
            summary: {
                totalDebit,
                totalCredit,
                netBalance: Number(account.balance),
                movementCount: movements.length,
            },
        };
    }

    async getDetailedStatement(
        query: StatementQueryDto,
        includeQuery?: { invoiceLines?: string; collections?: string; checks?: string },
    ) {
        const { account, movements, summary } = await this.loadDetailedStatementData(
            query,
            includeQuery,
        );

        return {
            account: {
                id: account.id,
                code: account.code,
                title: account.title,
                taxNumber: account.taxNumber,
                taxOffice: account.taxOffice,
                balance: Number(account.balance),
            },
            summary,
            movements,
        };
    }

    async exportDetailedExcel(
        query: StatementQueryDto,
        includeQuery?: { invoiceLines?: string; collections?: string; checks?: string },
    ): Promise<Buffer> {
        const { account, movements, summary } = await this.loadDetailedStatementData(
            query,
            includeQuery,
        );

        const tenantSettings = await this.prisma.tenantSettings.findUnique({
            where: { tenantId: account.tenantId || '' },
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Detaylı Cari Ekstre');

        worksheet.mergeCells('A1:G1');
        worksheet.getCell('A1').value = tenantSettings?.companyName || 'OTOMUHASEBE ERP';
        worksheet.getCell('A1').font = { size: 14, bold: true };

        worksheet.mergeCells('A2:G2');
        worksheet.getCell('A2').value = 'DETAYLI CARİ HESAP EKSTRESİ';
        worksheet.getCell('A2').font = { size: 16, bold: true, color: { argb: 'FF527575' } };
        worksheet.getCell('A2').alignment = { horizontal: 'center' };

        worksheet.getCell('A4').value = 'Cari:';
        worksheet.getCell('B4').value = account.title;
        worksheet.getCell('A5').value = 'Cari Kodu:';
        worksheet.getCell('B5').value = account.code;

        worksheet.getCell('A7').value = 'Toplam Borç';
        worksheet.getCell('B7').value = summary.totalDebit;
        worksheet.getCell('B7').numFmt = '#,##0.00 ₺';
        worksheet.getCell('D7').value = 'Toplam Alacak';
        worksheet.getCell('E7').value = summary.totalCredit;
        worksheet.getCell('E7').numFmt = '#,##0.00 ₺';

        const addHeaderStyle = (row: ExcelJS.Row) => {
            row.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            row.eachCell((cell) => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF527575' },
                };
            });
        };

        for (const mov of movements) {
            const masterRow = worksheet.addRow([
                new Date(mov.date).toLocaleDateString('tr-TR'),
                mov.documentTypeLabel,
                mov.documentNo || '-',
                mov.notes || '',
                mov.type === 'DEBIT' ? mov.amount : null,
                mov.type === 'CREDIT' ? mov.amount : null,
                mov.balance,
            ]);
            masterRow.font = { bold: true };
            masterRow.eachCell((cell, col) => {
                if (col >= 5) cell.numFmt = '#,##0.00 ₺';
            });

            if (mov.invoice?.items?.length) {
                const subHeader = worksheet.addRow([
                    '',
                    'Stok Kodu',
                    'Ürün',
                    'Miktar',
                    'Birim Fiyat',
                    'KDV %',
                    'Toplam',
                ]);
                addHeaderStyle(subHeader);
                for (const item of mov.invoice.items) {
                    const r = worksheet.addRow([
                        '',
                        item.productCode,
                        item.productName,
                        `${item.quantity} ${item.unit}`,
                        item.unitPrice,
                        item.vatRate,
                        item.amount,
                    ]);
                    r.getCell(5).numFmt = '#,##0.00 ₺';
                    r.getCell(7).numFmt = '#,##0.00 ₺';
                }
                worksheet.addRow([
                    '',
                    '',
                    '',
                    '',
                    'Ara Toplam',
                    '',
                    mov.invoice.totalAmount,
                ]);
                worksheet.addRow(['', '', '', '', 'KDV', '', mov.invoice.vatAmount]);
                worksheet.addRow(['', '', '', '', 'Genel Toplam', '', mov.invoice.grandTotal]);
            } else if (mov.collection) {
                const rows: [string, string][] = [
                    ['İşlem Türü', mov.collection.typeLabel],
                    ['Belge No', mov.collection.documentNo || '-'],
                    ['Tarih', new Date(mov.collection.date).toLocaleDateString('tr-TR')],
                    ['Tutar', mov.collection.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) + ' ₺'],
                    ['Ödeme Yöntemi', mov.collection.paymentTypeLabel],
                    ['Kasa / Banka', mov.collection.cashboxOrBank],
                ];
                if (mov.collection.linkedInvoiceNo) {
                    rows.push(['Bağlı Fatura', mov.collection.linkedInvoiceNo]);
                }
                for (const [label, value] of rows) {
                    worksheet.addRow(['', label, value]);
                }
            } else if (mov.checkBill) {
                const rows: [string, string][] = [
                    ['Evrak Türü', mov.checkBill.typeLabel],
                    ['Çek / Seri No', mov.checkBill.checkNo || mov.checkBill.serialNo || '-'],
                    [
                        'Vade',
                        mov.checkBill.dueDate
                            ? new Date(mov.checkBill.dueDate).toLocaleDateString('tr-TR')
                            : '-',
                    ],
                    ['Tutar', mov.checkBill.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) + ' ₺'],
                    ['Banka', mov.checkBill.bank || '-'],
                    ['Durum', mov.checkBill.status || '-'],
                ];
                for (const [label, value] of rows) {
                    worksheet.addRow(['', label, value]);
                }
            } else if (mov.genericFields?.length) {
                for (const f of mov.genericFields) {
                    worksheet.addRow(['', f.label, f.value]);
                }
            }

            worksheet.addRow([]);
        }

        worksheet.columns = [
            { width: 14 },
            { width: 18 },
            { width: 28 },
            { width: 36 },
            { width: 14 },
            { width: 14 },
            { width: 14 },
        ];

        const buffer = await workbook.xlsx.writeBuffer();
        return Buffer.from(buffer);
    }

    async exportDetailedPdf(
        query: StatementQueryDto,
        includeQuery?: { invoiceLines?: string; collections?: string; checks?: string },
    ): Promise<Buffer> {
        const { account, movements, summary } = await this.loadDetailedStatementData(
            query,
            includeQuery,
        );

        const tenantSettings = await this.prisma.tenantSettings.findUnique({
            where: { tenantId: account.tenantId || '' },
        });

        const periodText = buildTarihAraligiMetni(query.startDate, query.endDate);
        const olusturmaTarihi = new Date().toLocaleString('tr-TR');

        const contentBlocks: any[] = [
            {
                table: {
                    widths: ['auto', '*', 'auto', 'auto'],
                    body: [
                        [
                            { text: `${TR_STATEMENT.cariUnvan}:`, style: 'labelBold', border: [false, false, false, false] },
                            { text: account.title, style: 'customerName', border: [false, false, false, false] },
                            { text: `${TR_STATEMENT.cariKodu}:`, style: 'labelBold', border: [false, false, false, false] },
                            { text: account.code, border: [false, false, false, false] },
                        ],
                    ],
                },
                layout: 'noBorders',
                margin: [0, 0, 0, 8],
            },
            ...(periodText ? [{ text: periodText, style: 'docDate', margin: [0, 0, 0, 6] }] : []),
            {
                table: {
                    widths: ['*', '*', '*'],
                    body: [
                        [
                            { text: TR_STATEMENT.toplamBorc, style: 'summaryHeader', alignment: 'center', fillColor: '#fef2f2' },
                            { text: TR_STATEMENT.toplamAlacak, style: 'summaryHeader', alignment: 'center', fillColor: '#f0fdf4' },
                            { text: TR_STATEMENT.netBakiye, style: 'summaryHeader', alignment: 'center', fillColor: '#f3f4f6' },
                        ],
                        [
                            { text: formatParaTRY(summary.totalDebit), alignment: 'center', color: '#dc2626', bold: true },
                            { text: formatParaTRY(summary.totalCredit), alignment: 'center', color: '#059669', bold: true },
                            { text: formatParaTRY(summary.netBalance), alignment: 'center', bold: true },
                        ],
                    ],
                },
                margin: [0, 0, 0, 12],
            },
        ];

        for (const mov of movements) {
            contentBlocks.push({
                table: {
                    widths: ['auto', 'auto', '*', 'auto', 'auto', 'auto'],
                    body: [
                        [
                            { text: 'Tarih', style: 'tableHeader' },
                            { text: 'Tip', style: 'tableHeader' },
                            { text: 'Açıklama', style: 'tableHeader' },
                            { text: 'Borç', style: 'tableHeader', alignment: 'right' },
                            { text: 'Alacak', style: 'tableHeader', alignment: 'right' },
                            { text: 'Bakiye', style: 'tableHeader', alignment: 'right' },
                        ],
                        [
                            new Date(mov.date).toLocaleDateString('tr-TR'),
                            mov.documentTypeLabel,
                            `${mov.documentNo || ''} ${mov.notes || ''}`.trim(),
                            mov.type === 'DEBIT'
                                ? mov.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })
                                : '',
                            mov.type === 'CREDIT'
                                ? mov.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })
                                : '',
                            mov.balance.toLocaleString('tr-TR', { minimumFractionDigits: 2 }),
                        ],
                    ],
                },
                layout: 'lightHorizontalLines',
                margin: [0, 8, 0, 4],
            });

            if (mov.invoice?.items?.length) {
                contentBlocks.push({
                    table: {
                        headerRows: 1,
                        widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto'],
                        body: [
                            [
                                { text: 'Kod', style: 'tableHeader' },
                                { text: 'Ürün', style: 'tableHeader' },
                                { text: 'Miktar', style: 'tableHeader' },
                                { text: 'Birim Fiyat', style: 'tableHeader' },
                                { text: 'KDV', style: 'tableHeader' },
                                { text: 'Toplam', style: 'tableHeader' },
                            ],
                            ...mov.invoice.items.map((item) => [
                                item.productCode,
                                item.productName,
                                `${item.quantity} ${item.unit}`,
                                item.unitPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 }),
                                `%${item.vatRate}`,
                                item.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 }),
                            ]),
                        ],
                    },
                    layout: 'lightHorizontalLines',
                    margin: [0, 0, 0, 8],
                });
            } else if (mov.collection) {
                contentBlocks.push({
                    ul: [
                        `İşlem: ${mov.collection.typeLabel}`,
                        `Tutar: ${mov.collection.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺`,
                        `Ödeme: ${mov.collection.paymentTypeLabel}`,
                        `Kasa/Banka: ${mov.collection.cashboxOrBank}`,
                        ...(mov.collection.linkedInvoiceNo
                            ? [`Fatura: ${mov.collection.linkedInvoiceNo}`]
                            : []),
                    ],
                    margin: [0, 0, 0, 8],
                });
            } else if (mov.checkBill) {
                contentBlocks.push({
                    ul: [
                        `Evrak: ${mov.checkBill.typeLabel}`,
                        `No: ${mov.checkBill.checkNo || mov.checkBill.serialNo || '-'}`,
                        `Tutar: ${mov.checkBill.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺`,
                        `Banka: ${mov.checkBill.bank || '-'}`,
                    ],
                    margin: [0, 0, 0, 8],
                });
            }
        }

        const vfs = require('pdfmake/build/vfs_fonts.js');
        const fonts = {
            Roboto: {
                normal: Buffer.from(vfs['Roboto-Regular.ttf'], 'base64'),
                bold: Buffer.from(vfs['Roboto-Medium.ttf'] || vfs['Roboto-Regular.ttf'], 'base64'),
                italics: Buffer.from(vfs['Roboto-Italic.ttf'] || vfs['Roboto-Regular.ttf'], 'base64'),
            },
        };
        const printer = new PdfPrinter(fonts);

        const docDefinition: TDocumentDefinitions = {
            pageSize: 'A4',
            pageMargins: [40, 80, 40, 50],
            header: {
                margin: [40, 16, 40, 0],
                columns: [
                    {
                        width: '*',
                        stack: [
                            { text: tenantSettings?.companyName || 'OTOMUHASEBE ERP', style: 'companyName' },
                            { text: buildFirmaAdresMetni(tenantSettings), style: 'companyAddress' },
                        ],
                    },
                    {
                        width: 'auto',
                        stack: [
                            { text: TR_STATEMENT.detailedTitle, style: 'docTitle', alignment: 'right' },
                            {
                                text: `${TR_STATEMENT.tarih}: ${new Date().toLocaleDateString('tr-TR')}`,
                                style: 'docDate',
                                alignment: 'right',
                            },
                        ],
                    },
                ],
            },
            content: contentBlocks,
            footer: (currentPage: number, pageCount: number) => ({
                margin: [40, 0, 40, 0],
                columns: [
                    {
                        width: '*',
                        text: `${TR_STATEMENT.olusturmaNotu} ${olusturmaTarihi} tarihinde oluşturulmuştur.`,
                        fontSize: 7,
                        color: '#9ca3af',
                    },
                    {
                        width: 'auto',
                        text: `${TR_STATEMENT.sayfa} ${currentPage} / ${pageCount}`,
                        fontSize: 8,
                        color: '#6b7280',
                        alignment: 'right',
                    },
                ],
            }),
            styles: {
                companyName: { fontSize: 14, bold: true, color: '#111827' },
                companyAddress: { fontSize: 8, color: '#4b5563', lineHeight: 1.2 },
                docTitle: { fontSize: 16, bold: true, color: '#527575' },
                docDate: { fontSize: 9, color: '#6b7280' },
                labelBold: { fontSize: 8, bold: true, color: '#6b7280' },
                customerName: { fontSize: 10, bold: true },
                summaryHeader: { fontSize: 8, bold: true, color: '#374151' },
                tableHeader: {
                    fontSize: 8,
                    bold: true,
                    color: '#ffffff',
                    fillColor: '#527575',
                },
            },
            defaultStyle: { font: 'Roboto', fontSize: 9 },
        };

        return new Promise((resolve, reject) => {
            try {
                const pdfDoc = printer.createPdfKitDocument(docDefinition);
                const chunks: Buffer[] = [];
                pdfDoc.on('data', (chunk) => chunks.push(chunk));
                pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
                pdfDoc.on('error', reject);
                pdfDoc.end();
            } catch (error) {
                reject(error);
            }
        });
    }

    async delete(id: string) {
        const tenantId = await this.tenantResolver.resolveForQuery();
        const movement = await this.prisma.accountMovement.findFirst({
            where: { id, ...buildTenantWhereClause(tenantId ?? undefined) },
        });

        if (!movement) {
            throw new NotFoundException('Movement record not found');
        }

        const account = await this.prisma.account.findFirst({
            where: { id: movement.accountId, ...buildTenantWhereClause(tenantId ?? undefined) },
        });

        if (!account) {
            throw new NotFoundException('Account not found');
        }

        let nextBalance = Number(account.balance);

        if (movement.type === 'DEBIT') {
            nextBalance -= Number(movement.amount);
        } else if (movement.type === 'CREDIT') {
            nextBalance += Number(movement.amount);
        }

        await this.prisma.$transaction(async (tx) => {
            await tx.accountMovement.delete({
                where: { id },
            });

            await tx.account.update({
                where: { id: movement.accountId },
                data: { balance: new Prisma.Decimal(nextBalance) },
            });
        });

        return { message: 'Movement record deleted and balance updated' };
    }
}
