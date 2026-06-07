import {
    Injectable,
    NotFoundException,
    BadRequestException,
    Inject,
    forwardRef,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { TenantResolverService } from '../../common/services/tenant-resolver.service';
import { CreateAccountDto, UpdateAccountDto } from './dto';
import { CodeTemplateService } from '../code-template/code-template.service';
import { DeletionProtectionService } from '../../common/services/deletion-protection.service';
import { Prisma } from '@prisma/client';
import { buildTenantWhereClause } from '../../common/utils/staging.util';
import * as ExcelJS from 'exceljs';
import PdfPrinter from 'pdfmake';
import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { ModuleType } from '../code-template/code-template.enums';

@Injectable()
export class AccountService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly tenantResolver: TenantResolverService,
        @Inject(forwardRef(() => CodeTemplateService))
        private readonly codeTemplateService: CodeTemplateService,
        private readonly deletionProtection: DeletionProtectionService,
    ) { }

    async create(dto: CreateAccountDto) {
        const tenantId = await this.tenantResolver.resolveForCreate({ allowNull: true });

        let code = dto.code?.trim();
        if (!code || code.length === 0) {
            try {
                code = await this.codeTemplateService.getNextCode(ModuleType.CUSTOMER);
            } catch (error) {
                throw new BadRequestException(
                    'Account code must be provided or an automatic template must be defined',
                );
            }
        }

        if (!dto.title || !dto.title.trim()) {
            // Title validation is now optional at the DTO level.
            // We rely on the frontend check in NewCariDialog.tsx to handle this requirement.
            // If title is missing or empty, we allow the service to proceed (assuming business logic allows draft/implicit naming).
            // If strict validation is required here, re-enable the exception below:
            // throw new BadRequestException('Title cannot be empty');
        }

        const type = dto.type || 'CUSTOMER';
        const finalTenantId = (dto as any).tenantId ?? tenantId ?? undefined;

        const existing = await this.prisma.account.findFirst({
            where: {
                code,
                ...(finalTenantId ? { tenantId: finalTenantId } : {}),
            },
        });
        if (existing) {
            throw new BadRequestException('This account code is already in use');
        }

        const { contacts, addresses, banks, ...rest } = dto;

        const created = await this.prisma.account.create({
            data: {
                ...rest,
                code: code!,
                type: type as any,
                tenantId: finalTenantId,
                salesAgentId: (dto.salesAgentId && dto.salesAgentId.trim() !== '') ? dto.salesAgentId : null,
                contacts: contacts?.length ? {
                    create: contacts.map((c: any) => ({
                        ...c,
                    })),
                } : undefined,
                addresses: addresses?.length ? {
                    create: addresses.map((a: any) => ({
                        ...a,
                    })),
                } : undefined,
                banks: banks?.length ? {
                    create: banks.map((b: any) => ({
                        ...b,
                    })),
                } : undefined,
            } as any,
            include: {
                salesAgent: { select: { fullName: true } },
            },
        });

        // Update code template counter
        await this.codeTemplateService.saveLastCode(ModuleType.CUSTOMER, created.code);

        return {
            ...created,
            balance: Number(created.balance ?? 0),
            salesAgent: created.salesAgent ? { fullName: created.salesAgent.fullName } : null,
        };
    }

    async findAll(page = 1, limit = 50, search?: string, type?: string, isActive?: boolean) {
        const tenantId = await this.tenantResolver.resolveForQuery();
        const skip = (page - 1) * limit;

        const where: Prisma.AccountWhereInput = {
            ...buildTenantWhereClause(tenantId ?? undefined),
        };
        if (isActive !== undefined) where.isActive = isActive;

        if (search) {
            where.OR = [
                { code: { contains: search, mode: 'insensitive' } },
                { title: { contains: search, mode: 'insensitive' } },
                { taxNumber: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (type) {
            where.type = type as any;
        }

        const [accounts, total] = await Promise.all([
            this.prisma.account.findMany({
                where: {
                    ...where,
                    deletedAt: null,
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    salesAgent: {
                        select: {
                            fullName: true,
                        },
                    },
                    _count: {
                        select: {
                            accountMovements: true,
                        },
                    },
                },
            }),
            this.prisma.account.count({
                where: {
                    ...where,
                    deletedAt: null
                }
            }),
        ]);

        const data = accounts.map((account) => {
            const { salesAgent, balance, ...rest } = account as any;
            const b = Number(balance ?? 0);
            return {
                ...rest,
                balance: b,
                bakiye: b,
                cariKodu: account.code,
                unvan: account.title,
                movementCount: (account as any)._count?.accountMovements ?? 0,
                salesAgent: salesAgent?.fullName || '-',
            };
        });


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

    async getDebitCreditReport(query: any) {
        const tenantId = await this.tenantResolver.resolveForQuery();
        const { search, type, salesAgentId, status, page = 1, limit = 50 } = query;
        const skip = (page - 1) * limit;

        const where: Prisma.AccountWhereInput = {
            ...buildTenantWhereClause(tenantId ?? undefined),
        };

        if (salesAgentId) {
            where.salesAgentId = salesAgentId;
        }

        if (status) {
            if (status === 'DEBIT') {
                where.balance = { lt: 0 };
            } else if (status === 'CREDIT') {
                where.balance = { gt: 0 };
            } else if (status === 'ZERO') {
                where.balance = 0;
            }
        }

        if (search) {
            where.OR = [
                { code: { contains: search, mode: 'insensitive' } },
                { title: { contains: search, mode: 'insensitive' } },
                { taxNumber: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (type) {
            where.type = type;
        }

        const [accounts, total] = await Promise.all([
            this.prisma.account.findMany({
                where: {
                    ...where,
                    deletedAt: null,
                },
                skip,
                take: limit,
                orderBy: { balance: 'desc' },
                include: {
                    salesAgent: {
                        select: {
                            fullName: true,
                        },
                    },
                }
            }),
            this.prisma.account.count({
                where: {
                    ...where,
                    deletedAt: null
                }
            }),
        ]);

        const aggregates = await this.prisma.account.aggregate({
            where,
            _sum: {
                balance: true,
            },
            _count: {
                id: true
            }
        });

        const [totalDebitResult, totalCreditResult] = await Promise.all([
            this.prisma.account.aggregate({
                where: { ...where, balance: { gt: 0 } },
                _sum: { balance: true }
            }),
            this.prisma.account.aggregate({
                where: { ...where, balance: { lt: 0 } },
                _sum: { balance: true }
            })
        ]);

        const items = accounts.map((account) => {
            const { salesAgent, balance, ...rest } = account as any;
            const numBalance = Number(balance || 0);
            return {
                ...rest,
                balance: numBalance,
                debit: numBalance < 0 ? Math.abs(numBalance) : 0,
                credit: numBalance > 0 ? numBalance : 0,
                salesAgent: salesAgent?.fullName || '-',
            };
        });

        return {
            items,
            summary: {
                totalDebit: Math.abs(Number(totalCreditResult._sum.balance || 0)),
                totalCredit: Number(totalDebitResult._sum.balance || 0),
                netBalance: Number(aggregates._sum.balance || 0),
                count: aggregates._count.id,
            },
            meta: {
                total,
                page,
                limit,
                pageCount: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string) {
        const tenantId = await this.tenantResolver.resolveForQuery();
        const account = await this.prisma.account.findFirst({
            where: {
                id,
                ...(tenantId ? { tenantId } : {}),
                deletedAt: null,
            },
            include: {
                invoices: {
                    where: { deletedAt: null },
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
                collections: {
                    where: { deletedAt: null },
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
                accountMovements: {
                    where: {
                        deletedAt: null,
                        ...(tenantId ? { tenantId } : {}),
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 20,
                },
                contacts: true,
                addresses: true,
                banks: true,
            },
        });

        if (!account) {
            throw new NotFoundException('Account not found');
        }

        return account;
    }

    async update(id: string, dto: UpdateAccountDto) {
        const tenantId = await this.tenantResolver.resolveForQuery();

        // Ensure account belongs to tenant and is not deleted
        const existing = await this.prisma.account.findFirst({
            where: {
                id,
                ...(tenantId ? { tenantId } : {}),
                deletedAt: null
            }
        });

        if (!existing) {
            throw new NotFoundException('Account not found');
        }

        const { contacts, addresses, banks, ...rest } = dto;

        return this.prisma.account.update({
            where: { id },
            data: {
                ...rest,
                salesAgentId: (rest as any).salesAgentId === '' ? null : (rest as any).salesAgentId,
                contacts: contacts ? { deleteMany: {}, create: contacts } : undefined,
                addresses: addresses ? { deleteMany: {}, create: addresses } : undefined,
                banks: banks ? { deleteMany: {}, create: banks } : undefined,
            } as any,
        });
    }

    async remove(id: string) {
        const tenantId = await this.tenantResolver.resolveForQuery();
        if (!tenantId) throw new BadRequestException('Tenant ID not found');

        await this.deletionProtection.checkCariDeletion(id, tenantId);

        return this.prisma.account.delete({
            where: { id },
        });
    }

    async getMovements(accountId: string, page = 1, limit = 50) {
        const tenantId = await this.tenantResolver.resolveForQuery();
        const skip = (page - 1) * limit;

        const where: any = { accountId, deletedAt: null };
        if (tenantId) where.tenantId = tenantId;

        const [data, total] = await Promise.all([
            this.prisma.accountMovement.findMany({
                where,
                skip,
                take: limit,
                orderBy: [
                    { date: 'asc' },
                    { id: 'asc' },
                ],
                include: {
                    invoice: {
                        include: {
                            items: {
                                include: {
                                    product: {
                                        select: {
                                            name: true,
                                            code: true,
                                        }
                                    }
                                }
                            }
                        }
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
                }
            }),
            this.prisma.accountMovement.count({ where }),
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

    async exportDebitCreditReportExcel(query: any): Promise<Buffer> {
        const { items: accounts, summary } = await this.getDebitCreditReport({ ...query, limit: 10000 });

        const tenantId = await this.tenantResolver.resolveForQuery();
        const tenantSettings = await this.prisma.tenantSettings.findUnique({
            where: { tenantId: tenantId || '' },
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Debt Credit Report');

        worksheet.mergeCells('A1:G1');
        worksheet.getCell('A1').value = tenantSettings?.companyName || 'OTOMUHASEBE ERP';
        worksheet.getCell('A1').font = { size: 14, bold: true, color: { argb: 'FF1F2937' } };

        worksheet.mergeCells('A2:G2');
        worksheet.getCell('A2').value = 'DEBIT CREDIT STATUS REPORT';
        worksheet.getCell('A2').font = { size: 18, bold: true, color: { argb: 'FF8B5CF6' } };
        worksheet.getCell('A2').alignment = { horizontal: 'center' };

        worksheet.getCell('D4').value = 'Date:';
        worksheet.getCell('E4').value = new Date().toLocaleDateString('tr-TR');
        worksheet.getCell('D4').font = { bold: true };

        worksheet.getCell('A6').value = 'TOTAL DEBIT';
        worksheet.getCell('B6').value = Number(summary.totalDebit);
        worksheet.getCell('B6').numFmt = '#,##0.00 ₺';
        worksheet.getCell('B6').font = { bold: true, color: { argb: 'FFEF4444' } };

        worksheet.getCell('C6').value = 'TOTAL CREDIT';
        worksheet.getCell('D6').value = Number(summary.totalCredit);
        worksheet.getCell('D6').numFmt = '#,##0.00 ₺';
        worksheet.getCell('D6').font = { bold: true, color: { argb: 'FF10B981' } };

        worksheet.getCell('E6').value = 'NET BALANCE';
        worksheet.getCell('F6').value = Number(summary.netBalance);
        worksheet.getCell('F6').numFmt = '#,##0.00 ₺';
        worksheet.getCell('F6').font = { bold: true };

        const dataHeaderRow = worksheet.addRow([
            'Account Code',
            'Title',
            'Sales Agent',
            'Debt',
            'Credit',
            'Balance',
        ]);
        dataHeaderRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        dataHeaderRow.eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF8B5CF6' },
            };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
        });

        accounts.forEach((item, index) => {
            const balance = item.balance;
            const debt = balance > 0 ? balance : 0;
            const credit = balance < 0 ? Math.abs(balance) : 0;

            const row = worksheet.addRow([
                item.code,
                item.title,
                item.salesAgent?.fullName || '-',
                debt || null,
                credit || null,
                Math.abs(balance),
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
            });

            if (debt > 0) row.getCell(4).font = { color: { argb: 'FFEF4444' } };
            if (credit > 0) row.getCell(5).font = { color: { argb: 'FF10B981' } };
            row.getCell(6).font = { bold: true };
        });

        worksheet.columns = [
            { width: 15 },
            { width: 40 },
            { width: 20 },
            { width: 15 },
            { width: 15 },
            { width: 15 },
        ];

        const buffer = await workbook.xlsx.writeBuffer();
        return Buffer.from(buffer);
    }

    async exportDebitCreditReportPdf(query: any): Promise<Buffer> {
        const { items: accounts, summary } = await this.getDebitCreditReport({ ...query, limit: 10000 });

        const tenantId = await this.tenantResolver.resolveForQuery();
        const tenantSettings = await this.prisma.tenantSettings.findUnique({
            where: { tenantId: tenantId || '' },
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
                console.error('Logo error:', error);
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
            pageMargins: [40, 140, 40, 60],
            header: (currentPage) => ({
                margin: [40, 20, 40, 0],
                stack: [
                    {
                        columns: [
                            {
                                width: '*',
                                stack: [
                                    logoBase64 ? { image: logoBase64, width: 80, margin: [0, 0, 0, 10] as any } : { text: '' },
                                    { text: tenantSettings?.companyName || 'OTOMUHASEBE ERP', style: 'companyName' },
                                    {
                                        text: [
                                            tenantSettings?.address || '',
                                            tenantSettings?.district ? ` ${tenantSettings.district}` : '',
                                            tenantSettings?.city ? ` / ${tenantSettings.city}` : '',
                                            '\n',
                                            tenantSettings?.phone ? `Tel: ${tenantSettings.phone}` : '',
                                            tenantSettings?.email ? ` | Email: ${tenantSettings.email}` : '',
                                            tenantSettings?.website ? ` | Web: ${tenantSettings.website}` : '',
                                            '\n',
                                            tenantSettings?.taxOffice ? `Tax Office: ${tenantSettings.taxOffice}` : '',
                                            tenantSettings?.taxNumber ? ` | Tax No: ${tenantSettings.taxNumber}` : '',
                                            tenantSettings?.tcNo ? ` | National ID: ${tenantSettings.tcNo}` : '',
                                        ].filter(Boolean).join(''),
                                        style: 'companyAddress',
                                    },
                                ],
                            },
                            {
                                width: 'auto',
                                stack: [
                                    { text: 'DEBIT CREDIT REPORT', style: 'docTitle', alignment: 'right' },
                                    { text: `Date: ${new Date().toLocaleDateString('tr-TR')}`, style: 'docTag', alignment: 'right' },
                                    { text: `Page: ${currentPage}`, style: 'docTag', alignment: 'right', margin: [0, 2, 0, 0] },
                                ],
                            },
                        ],
                    },
                    {
                        canvas: [
                            {
                                type: 'line',
                                x1: 0, y1: 15,
                                x2: 515, y2: 15,
                                lineWidth: 1,
                                lineColor: '#1e293b',
                            },
                        ],
                    },
                ],
            }),
            content: [
                {
                    style: 'summarySection',
                    table: {
                        widths: ['*', '*', '*'],
                        body: [
                            [
                                {
                                    stack: [
                                        { text: 'TOTAL DEBT', style: 'summaryLabel' },
                                        { text: `${Number(summary.totalDebit).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL`, style: 'summaryValueDanger' }
                                    ],
                                    fillColor: '#fef2f2',
                                    padding: [10, 10, 10, 10] as any
                                },
                                {
                                    stack: [
                                        { text: 'TOTAL CREDIT', style: 'summaryLabel' },
                                        { text: `${Number(summary.totalCredit).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL`, style: 'summaryValueSuccess' }
                                    ],
                                    fillColor: '#f0fdf4',
                                    padding: [10, 10, 10, 10] as any
                                },
                                {
                                    stack: [
                                        { text: 'NET BALANCE', style: 'summaryLabel' },
                                        { text: `${Math.abs(Number(summary.netBalance)).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL ${summary.netBalance < 0 ? '(D)' : summary.netBalance > 0 ? '(C)' : ''}`, style: 'summaryValue' }
                                    ],
                                    fillColor: '#f3f4f6',
                                    padding: [10, 10, 10, 10] as any
                                }
                            ]
                        ]
                    },
                    layout: 'noBorders'
                },
                {
                    style: 'transactionTable',
                    table: {
                        headerRows: 1,
                        widths: ['auto', '*', '*', '*', '*', '*', 'auto'],
                        body: [
                            [
                                { text: 'ACCOUNT CODE', style: 'tableHeader' },
                                { text: 'TITLE', style: 'tableHeader' },
                                { text: 'SALES AGENT', style: 'tableHeader' },
                                { text: 'DEBT', style: 'tableHeader', alignment: 'right' },
                                { text: 'CREDIT', style: 'tableHeader', alignment: 'right' },
                                { text: 'BALANCE', style: 'tableHeader', alignment: 'right' },
                            ],
                            ...accounts.map((item) => {
                                const balance = item.balance;
                                const debt = balance < 0 ? Math.abs(balance) : 0;
                                const credit = balance > 0 ? balance : 0;
                                return [
                                    { text: item.code, style: 'tableCell' },
                                    { text: item.title, style: 'tableCell' },
                                    { text: item.salesAgent?.fullName || '-', style: 'tableCell' },
                                    { text: debt > 0 ? debt.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) : '-', style: 'tableCellDanger', alignment: 'right' },
                                    { text: credit > 0 ? credit.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) : '-', style: 'tableCellSuccess', alignment: 'right' },
                                    {
                                        text: `${Math.abs(balance).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ${balance < 0 ? '(D)' : balance > 0 ? '(C)' : ''}`,
                                        style: 'tableCellBold',
                                        alignment: 'right'
                                    },
                                ]
                            }),
                        ],
                    },
                    layout: {
                        fillColor: (rowIndex: number) => (rowIndex > 0 && rowIndex % 2 === 0) ? '#f9fafb' : null,
                        hLineWidth: (i: number) => 0.5,
                        vLineWidth: (i: number) => 0.5,
                        hLineColor: () => '#e5e7eb',
                        vLineColor: () => '#e5e7eb',
                    }
                } as any,
            ],
            footer: (currentPage: number, pageCount: number) => ({
                text: `Page ${currentPage} / ${pageCount} | Prepared by OTOMUHASEBE ERP.`,
                alignment: 'center',
                fontSize: 7,
                color: '#94a3b8',
                margin: [0, 20, 0, 0]
            }),
            styles: {
                companyName: { fontSize: 13, bold: true, color: '#0f172a', margin: [0, 0, 0, 2] },
                companyAddress: { fontSize: 8, color: '#64748b', lineHeight: 1.2 },
                docTitle: { fontSize: 18, bold: true, color: '#1e293b', margin: [0, 0, 0, 4] },
                docTag: { fontSize: 8, color: '#94a3b8' },
                summarySection: { margin: [0, 0, 0, 20] },
                summaryLabel: { fontSize: 7, bold: true, color: '#64748b', margin: [0, 0, 0, 4] },
                summaryValue: { fontSize: 12, bold: true, color: '#1e293b' },
                summaryValueSuccess: { fontSize: 12, bold: true, color: '#15803d' },
                summaryValueDanger: { fontSize: 12, bold: true, color: '#b91c1c' },
                transactionTable: { margin: [0, 0, 0, 0] },
                tableHeader: { fontSize: 8, bold: true, color: '#ffffff', fillColor: '#1e293b', margin: [0, 4, 0, 4] },
                tableCell: { fontSize: 8, color: '#334155', margin: [0, 4, 0, 4] },
                tableCellBold: { fontSize: 8, bold: true, color: '#0f172a', margin: [0, 4, 0, 4] },
                tableCellSuccess: { fontSize: 8, color: '#15803d', margin: [0, 4, 0, 4] },
                tableCellDanger: { fontSize: 8, color: '#b91c1c', margin: [0, 4, 0, 4] },
            },
            defaultStyle: { font: 'Roboto' },
        };

        return new Promise((resolve, reject) => {
            try {
                const pdfDoc = printer.createPdfKitDocument(docDefinition);
                const chunks: Buffer[] = [];
                pdfDoc.on('data', chunk => chunks.push(chunk));
                pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
                pdfDoc.on('error', reject);
                pdfDoc.end();
            } catch (error) {
                reject(error);
            }
        });
    }

    async getCreditLimitReport(query: any) {
        const tenantId = await this.tenantResolver.resolveForQuery();
        const search = query.search as string | undefined;
        const type = query.type as string | undefined;
        const salesAgentId =
            (query.salesAgentId as string | undefined) ||
            (query.satisElemaniId as string | undefined);
        const rawStatus = (query.status as string | undefined) || (query.durum as string | undefined);
        const status =
            rawStatus === 'LIMIT_ASILDI'
                ? 'LIMIT_EXCEEDED'
                : rawStatus === 'LIMIT_EXCEEDED' || rawStatus === 'NORMAL'
                  ? rawStatus
                  : undefined;
        const pageNum = Math.max(1, Number(query.page) || 1);
        const limitNum = Math.min(500, Math.max(1, Number(query.limit) || 50));

        const where: Prisma.AccountWhereInput = {
            ...buildTenantWhereClause(tenantId ?? undefined),
            deletedAt: null,
        };

        if (salesAgentId) {
            where.salesAgentId = salesAgentId;
        }

        if (search) {
            where.OR = [
                { code: { contains: search, mode: 'insensitive' } },
                { title: { contains: search, mode: 'insensitive' } },
                { taxNumber: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (type) {
            where.type = type as Prisma.EnumAccountTypeFilter;
        }

        const accounts = await this.prisma.account.findMany({
            where,
            orderBy: { title: 'asc' },
            include: {
                salesAgent: {
                    select: { fullName: true },
                },
            },
        });

        const mapRow = (item: (typeof accounts)[number]) => {
            const balance = Number(item.balance || 0);
            const creditLimit = Number(item.creditLimit || 0);
            const debt = balance > 0 ? balance : 0;
            const remainingLimit = creditLimit - debt;

            return {
                id: item.id,
                code: item.code,
                title: item.title,
                cariKodu: item.code,
                unvan: item.title,
                tip: item.type,
                balance,
                debt,
                riskLimit: creditLimit,
                creditLimit,
                remainingLimit,
                satisElemani: item.salesAgent?.fullName ?? null,
                salesAgent: item.salesAgent,
            };
        };

        let items = accounts.map(mapRow);

        if (status === 'LIMIT_EXCEEDED') {
            items = items.filter((item) => item.remainingLimit < 0);
        } else if (status === 'NORMAL') {
            items = items.filter((item) => item.remainingLimit >= 0);
        }

        const total = items.length;
        const skip = (pageNum - 1) * limitNum;
        const paginatedItems = items.slice(skip, skip + limitNum);

        const totalDebt = items.reduce((sum, item) => sum + item.debt, 0);
        const totalRiskLimit = items.reduce((sum, item) => sum + item.riskLimit, 0);
        const totalRemainingLimit = items.reduce((sum, item) => sum + item.remainingLimit, 0);

        return {
            items: paginatedItems,
            summary: {
                totalDebt,
                totalRiskLimit,
                totalCreditLimit: totalRiskLimit,
                totalRemainingLimit,
                count: total,
            },
            meta: {
                total,
                page: pageNum,
                limit: limitNum,
                pageCount: Math.max(1, Math.ceil(total / limitNum)),
            },
        };
    }

    async exportCreditLimitReportExcel(query: any): Promise<Buffer> {
        const { items: accounts, summary } = await this.getCreditLimitReport({ ...query, limit: 10000 });

        const tenantId = await this.tenantResolver.resolveForQuery();
        const tenantSettings = await this.prisma.tenantSettings.findUnique({
            where: { tenantId: tenantId || '' },
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Credit Limit Report');

        worksheet.mergeCells('A1:G1');
        worksheet.getCell('A1').value = tenantSettings?.companyName || 'OTOMUHASEBE ERP';
        worksheet.getCell('A1').font = { size: 14, bold: true, color: { argb: 'FF1F2937' } };

        worksheet.mergeCells('A2:G2');
        worksheet.getCell('A2').value = 'ACCOUNT CREDIT LIMIT REPORT';
        worksheet.getCell('A2').font = { size: 18, bold: true, color: { argb: 'FF8B5CF6' } };
        worksheet.getCell('A2').alignment = { horizontal: 'center' };

        worksheet.getCell('D4').value = 'Date:';
        worksheet.getCell('E4').value = new Date().toLocaleDateString('tr-TR');
        worksheet.getCell('D4').font = { bold: true };

        worksheet.getCell('A6').value = 'TOTAL CREDIT LIMIT';
        worksheet.getCell('B6').value = Number(summary.totalCreditLimit ?? summary.totalRiskLimit);
        worksheet.getCell('B6').numFmt = '#,##0.00 ₺';
        worksheet.getCell('B6').font = { bold: true, color: { argb: 'FF0284C7' } };

        worksheet.getCell('C6').value = 'TOTAL DEBT';
        worksheet.getCell('D6').value = Number(summary.totalDebt);
        worksheet.getCell('D6').numFmt = '#,##0.00 ₺';
        worksheet.getCell('D6').font = { bold: true, color: { argb: 'FFEF4444' } };

        worksheet.getCell('E6').value = 'TOTAL REMAINING LIMIT';
        worksheet.getCell('F6').value = Number(summary.totalRemainingLimit);
        worksheet.getCell('F6').numFmt = '#,##0.00 ₺';
        worksheet.getCell('F6').font = { bold: true };

        const dataHeaderRow = worksheet.addRow([
            'Account Code',
            'Title',
            'Sales Agent',
            'Credit Limit',
            'Current Debt',
            'Remaining Limit',
        ]);
        dataHeaderRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        dataHeaderRow.eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF8B5CF6' },
            };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
        });

        accounts.forEach((item, index) => {
            const row = worksheet.addRow([
                item.code,
                item.title,
                item.salesAgent?.fullName || '-',
                item.creditLimit,
                item.debt,
                item.remainingLimit,
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
            });

            row.getCell(4).font = { color: { argb: 'FF0284C7' } };
            if (item.debt > 0) row.getCell(5).font = { color: { argb: 'FFEF4444' } };
            if (item.remainingLimit < 0) {
                row.getCell(6).font = { bold: true, color: { argb: 'FFEF4444' } };
                row.getCell(6).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };
            } else {
                row.getCell(6).font = { bold: true, color: { argb: 'FF10B981' } };
            }
        });

        worksheet.columns = [
            { width: 15 },
            { width: 40 },
            { width: 20 },
            { width: 20 },
            { width: 20 },
        ];

        const buffer = await workbook.xlsx.writeBuffer();
        return Buffer.from(buffer);
    }

    async exportCreditLimitReportPdf(query: any): Promise<Buffer> {
        const { items: accounts, summary } = await this.getCreditLimitReport({ ...query, limit: 10000 });

        const tenantId = await this.tenantResolver.resolveForQuery();
        const tenantSettings = await this.prisma.tenantSettings.findUnique({
            where: { tenantId: tenantId || '' },
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
                console.error('Logo error:', error);
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
            pageMargins: [40, 140, 40, 60],
            header: (currentPage) => ({
                margin: [40, 20, 40, 0],
                stack: [
                    {
                        columns: [
                            {
                                width: '*',
                                stack: [
                                    logoBase64 ? { image: logoBase64, width: 80, margin: [0, 0, 0, 10] as any } : { text: '' },
                                    { text: tenantSettings?.companyName || 'OTOMUHASEBE ERP', style: 'companyName' },
                                    {
                                        text: [
                                            tenantSettings?.address || '',
                                            tenantSettings?.district ? ` ${tenantSettings.district}` : '',
                                            tenantSettings?.city ? ` / ${tenantSettings.city}` : '',
                                            '\n',
                                            tenantSettings?.phone ? `Tel: ${tenantSettings.phone}` : '',
                                            tenantSettings?.email ? ` | Email: ${tenantSettings.email}` : '',
                                            tenantSettings?.website ? ` | Web: ${tenantSettings.website}` : '',
                                            '\n',
                                            tenantSettings?.taxOffice ? `Tax Office: ${tenantSettings.taxOffice}` : '',
                                            tenantSettings?.taxNumber ? ` | Tax No: ${tenantSettings.taxNumber}` : '',
                                            tenantSettings?.tcNo ? ` | National ID: ${tenantSettings.tcNo}` : '',
                                        ].filter(Boolean).join(''),
                                        style: 'companyAddress',
                                    },
                                ],
                            },
                            {
                                width: 'auto',
                                stack: [
                                    { text: 'CREDIT LIMIT REPORT', style: 'docTitle', alignment: 'right' },
                                    { text: `Date: ${new Date().toLocaleDateString('tr-TR')}`, style: 'docTag', alignment: 'right', margin: [0, 2, 0, 0] },
                                    { text: `Page: ${currentPage}`, style: 'docTag', alignment: 'right', margin: [0, 2, 0, 0] },
                                ],
                            },
                        ],
                    },
                    {
                        canvas: [
                            {
                                type: 'line',
                                x1: 0, y1: 15,
                                x2: 515, y2: 15,
                                lineWidth: 1,
                                lineColor: '#1e293b',
                            },
                        ],
                    },
                ],
            }),
            content: [
                {
                    style: 'summarySection',
                    table: {
                        widths: ['*', '*', '*'],
                        body: [
                            [
                                {
                                    stack: [
                                        { text: 'TOTAL CREDIT LIMIT', style: 'summaryLabel' },
                                        { text: `${Number(summary.totalCreditLimit).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL`, style: 'summaryValueBlue' }
                                    ],
                                    fillColor: '#f0f9ff',
                                    padding: [10, 10, 10, 10] as any
                                },
                                {
                                    stack: [
                                        { text: 'TOTAL DEBT', style: 'summaryLabel' },
                                        { text: `${Number(summary.totalDebt).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL`, style: 'summaryValueDanger' }
                                    ],
                                    fillColor: '#fef2f2',
                                    padding: [10, 10, 10, 10] as any
                                },
                                {
                                    stack: [
                                        { text: 'TOTAL REMAINING LIMIT', style: 'summaryLabel' },
                                        { text: `${Number(summary.totalRemainingLimit).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL`, style: 'summaryValue' }
                                    ],
                                    fillColor: '#f3f4f6',
                                    padding: [10, 10, 10, 10] as any
                                }
                            ]
                        ]
                    },
                    layout: 'noBorders'
                },
                {
                    style: 'transactionTable',
                    table: {
                        headerRows: 1,
                        widths: ['auto', '*', '*', '*', '*', 'auto'],
                        body: [
                            [
                                { text: 'ACCOUNT CODE', style: 'tableHeader' },
                                { text: 'TITLE', style: 'tableHeader' },
                                { text: 'SALES AGENT', style: 'tableHeader' },
                                { text: 'CREDIT LIMIT', style: 'tableHeader', alignment: 'right' },
                                { text: 'DEBT', style: 'tableHeader', alignment: 'right' },
                                { text: 'REMAINING LIMIT', style: 'tableHeader', alignment: 'right' },
                            ],
                            ...accounts.map((item) => {
                                const isOverLimit = item.remainingLimit < 0;
                                return [
                                    { text: item.code, style: 'tableCell' },
                                    { text: item.title, style: 'tableCell' },
                                    { text: item.salesAgent?.fullName || '-', style: 'tableCell' },
                                    { text: Number(item.creditLimit) > 0 ? Number(item.creditLimit).toLocaleString('tr-TR', { minimumFractionDigits: 2 }) : '-', style: 'tableCellBlue', alignment: 'right' },
                                    { text: Number(item.debt) > 0 ? Number(item.debt).toLocaleString('tr-TR', { minimumFractionDigits: 2 }) : '-', style: 'tableCellDanger', alignment: 'right' },
                                    {
                                        text: `${item.remainingLimit.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL`,
                                        style: isOverLimit ? 'tableCellDangerBold' : 'tableCellSuccessBold',
                                        fillColor: isOverLimit ? '#fef2f2' : null,
                                        alignment: 'right'
                                    },
                                ]
                            }),
                        ],
                    },
                    layout: {
                        fillColor: (rowIndex: number) => (rowIndex > 0 && rowIndex % 2 === 0) ? '#f9fafb' : null,
                        hLineWidth: (i: number) => 0.5,
                        vLineWidth: (i: number) => 0.5,
                        hLineColor: () => '#e5e7eb',
                        vLineColor: () => '#e5e7eb',
                    }
                } as any,
            ],
            footer: (currentPage: number, pageCount: number) => ({
                text: `Page ${currentPage} / ${pageCount} | Prepared by OTOMUHASEBE ERP.`,
                alignment: 'center',
                fontSize: 7,
                color: '#94a3b8',
                margin: [0, 20, 0, 0]
            }),
            styles: {
                companyName: { fontSize: 13, bold: true, color: '#0f172a', margin: [0, 0, 0, 2] },
                companyAddress: { fontSize: 8, color: '#64748b', lineHeight: 1.2 },
                docTitle: { fontSize: 16, bold: true, color: '#1e293b', margin: [0, 0, 0, 4] },
                docTag: { fontSize: 8, color: '#94a3b8' },
                summarySection: { margin: [0, 0, 0, 20] },
                summaryLabel: { fontSize: 7, bold: true, color: '#64748b', margin: [0, 0, 0, 4] },
                summaryValue: { fontSize: 12, bold: true, color: '#1e293b' },
                summaryValueBlue: { fontSize: 12, bold: true, color: '#0284c7' },
                summaryValueSuccess: { fontSize: 12, bold: true, color: '#15803d' },
                summaryValueDanger: { fontSize: 12, bold: true, color: '#b91c1c' },
                transactionTable: { margin: [0, 0, 0, 0] },
                tableHeader: { fontSize: 8, bold: true, color: '#ffffff', fillColor: '#1e293b', margin: [0, 4, 0, 4] },
                tableCell: { fontSize: 8, color: '#334155', margin: [0, 4, 0, 4] },
                tableCellBold: { fontSize: 8, bold: true, color: '#0f172a', margin: [0, 4, 0, 4] },
                tableCellBlue: { fontSize: 8, color: '#0284c7', margin: [0, 4, 0, 4] },
                tableCellSuccessBold: { fontSize: 8, bold: true, color: '#15803d' },
                tableCellDanger: { fontSize: 8, color: '#b91c1c' },
                tableCellDangerBold: { fontSize: 8, bold: true, color: '#b91c1c' },
            },
            defaultStyle: { font: 'Roboto' },
        };

        return new Promise((resolve, reject) => {
            try {
                const pdfDoc = printer.createPdfKitDocument(docDefinition);
                const chunks: Buffer[] = [];
                pdfDoc.on('data', chunk => chunks.push(chunk));
                pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
                pdfDoc.on('error', reject);
                pdfDoc.end();
            } catch (error) {
                reject(error);
            }
        });
    }
}