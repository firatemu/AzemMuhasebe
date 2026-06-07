import { TenantResolverService } from '../../common/services/tenant-resolver.service';
import { Injectable, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateCheckBillDto, UpdateCheckBillDto } from './dto/create-check-bill.dto';
import { CheckBillActionDto } from './dto/check-bill-transaction.dto';
import { CheckBillFilterDto } from './dto/check-bill-filter.dto';
import * as ExcelJS from 'exceljs';
import {
    CheckBillStatus,
    PortfolioType,
    CashboxMovementType,
    BankMovementType,
    Prisma,
    DebitCredit,
    DocumentType,
} from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { buildTenantWhereClause } from '../../common/utils/staging.util';
import { assertLegalTransitionForPortfolio } from './utils/status-transition.util';
import { AccountBalanceService } from '../account-balance/account-balance.service';
import { CodeTemplateService } from '../code-template/code-template.service';
import { ModuleType } from '../code-template/code-template.enums';

@Injectable()
export class CheckBillService {
    private readonly logger = new Logger(CheckBillService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly tenantResolver: TenantResolverService,
        private readonly accountBalanceService: AccountBalanceService,
        private readonly codeTemplateService: CodeTemplateService,
    ) { }

    async findAll(filter: CheckBillFilterDto) {
        const tenantId = await this.tenantResolver.resolveForQuery();
        const take = filter.take ?? 200;
        const skip = filter.skip ?? 0;
        const orderField = filter.sortBy ?? 'dueDate';
        const orderDir = filter.sortOrder ?? 'asc';

        const search = filter.search?.trim();

        const where: Prisma.CheckBillWhereInput = {
            ...buildTenantWhereClause(tenantId ?? undefined),
            deletedAt: null,
            ...(filter.type && { type: filter.type }),
            ...(filter.portfolioType && { portfolioType: filter.portfolioType }),
            ...(filter.status && { status: filter.status }),
            ...(filter.accountId && { accountId: filter.accountId }),
            ...(filter.isProtested !== undefined && { isProtested: filter.isProtested }),
            ...(filter.dueDateFrom || filter.dueDateTo
                ? {
                    dueDate: {
                        ...(filter.dueDateFrom && { gte: new Date(filter.dueDateFrom) }),
                        ...(filter.dueDateTo && { lte: new Date(filter.dueDateTo) }),
                    },
                }
                : {}),
            ...(search
                ? {
                    OR: [
                        { checkNo: { contains: search, mode: 'insensitive' } },
                        { serialNo: { contains: search, mode: 'insensitive' } },
                        { notes: { contains: search, mode: 'insensitive' } },
                        { account: { title: { contains: search, mode: 'insensitive' } } },
                    ],
                }
                : {}),
        };

        const [items, total] = await Promise.all([
            this.prisma.checkBill.findMany({
                where,
                include: {
                    account: { select: { title: true, code: true } },
                },
                orderBy: { [orderField]: orderDir },
                skip,
                take,
            }),
            this.prisma.checkBill.count({ where }),
        ]);

        return { items, total, skip, take };
    }

    async findOne(id: string) {
        const tenantId = await this.tenantResolver.resolveForQuery();
        const checkBill = await this.prisma.checkBill.findFirst({
            where: {
                id,
                ...buildTenantWhereClause(tenantId ?? undefined),
            },
            include: {
                account: true,
                journalItems: {
                    include: { journal: true },
                },
                endorsements: { orderBy: { sequence: 'asc' } },
                collections: { orderBy: { collectionDate: 'desc' } },
            },
        });

        if (!checkBill || checkBill.deletedAt) {
            throw new NotFoundException('Document not found');
        }

        return checkBill;
    }

    async getUpcomingChecks(startDate: Date, endDate: Date) {
        console.log('[CheckBillService] getUpcomingChecks called with:', { startDate, endDate });
        const tenantId = await this.tenantResolver.resolveForQuery();
        console.log('[CheckBillService] getUpcomingChecks tenantId:', tenantId);
        /** String literals: SWC/Nest prod bundle’da enum referansları için güvenli */
        const upcomingStatuses: CheckBillStatus[] = ['IN_PORTFOLIO', 'SENT_TO_BANK'];
        return this.prisma.checkBill.findMany({
            where: {
                ...buildTenantWhereClause(tenantId ?? undefined),
                deletedAt: null,
                dueDate: { gte: startDate, lte: endDate },
                status: { in: upcomingStatuses },
            },
            include: { account: { select: { title: true, code: true } } },
            orderBy: { dueDate: 'asc' },
        });
    }

    async getEndorsements(checkBillId: string) {
        const tenantId = await this.tenantResolver.resolveForQuery();
        return this.prisma.checkBillEndorsement.findMany({
            where: {
                checkBillId,
                ...buildTenantWhereClause(tenantId ?? undefined),
            },
            orderBy: { sequence: 'asc' },
        });
    }

    async getCollectionHistory(checkBillId: string) {
        const tenantId = await this.tenantResolver.resolveForQuery();
        return this.prisma.checkBillCollection.findMany({
            where: {
                checkBillId,
                ...buildTenantWhereClause(tenantId ?? undefined),
            },
            orderBy: { collectionDate: 'desc' },
        });
    }

    async processAction(dto: CheckBillActionDto, userId: string) {
        const tenantId = await this.tenantResolver.resolveForQuery();

        const result = await this.prisma.$transaction(async (tx) => {
            const checkBill = await tx.checkBill.findFirst({
                where: { id: dto.checkBillId, ...buildTenantWhereClause(tenantId ?? undefined), deletedAt: null },
            });
            if (!checkBill) throw new NotFoundException('Document not found');

            assertLegalTransitionForPortfolio(checkBill.status, dto.newStatus, checkBill.portfolioType);

            const movementTenantId = checkBill.tenantId || tenantId;
            if (!movementTenantId) throw new Error('Tenant ID çözümlenemedi');

            const isDebit = checkBill.portfolioType === PortfolioType.DEBIT;
            const txAmount = Number(dto.transactionAmount ?? 0);

            // ── 1. Kalan Tutar Hesabı ─────────────────────────────────────────────────
            let newRemainingAmount = checkBill.remainingAmount;

            if (dto.newStatus === CheckBillStatus.COLLECTED || dto.newStatus === CheckBillStatus.PAID) {
                const calculated = Number(checkBill.remainingAmount) - txAmount;
                newRemainingAmount = new Decimal(Math.max(0, calculated));
            } else if (dto.newStatus === CheckBillStatus.PARTIAL_PAID) {
                const calculated = Number(checkBill.remainingAmount) - txAmount;
                newRemainingAmount = new Decimal(Math.max(0, calculated));
            } else if (dto.newStatus === CheckBillStatus.RETURNED) {
                newRemainingAmount = checkBill.amount; // orijinal tutara dön
            } else if (
                dto.newStatus === CheckBillStatus.WRITTEN_OFF ||
                dto.newStatus === CheckBillStatus.CANCELLED
            ) {
                newRemainingAmount = new Decimal(0);
            }
            // ENDORSED, IN_BANK_COLLECTION, IN_BANK_GUARANTEE, WITHOUT_COVERAGE, PROTESTED → tutar değişmez

            await tx.checkBill.updateMany({
                where: { id: dto.checkBillId, ...buildTenantWhereClause(tenantId ?? undefined) },
                data: { status: dto.newStatus, remainingAmount: newRemainingAmount, updatedBy: userId },
            });

            const updated = await tx.checkBill.findFirst({
                where: { id: dto.checkBillId, ...buildTenantWhereClause(tenantId ?? undefined) },
            });

            // ── 2. Aksiyon Bazlı Hareketler ──────────────────────────────────────────

            // ── 2a. Bankaya Tahsilata / Teminata Ver → Hareket Yok ──────────────────
            if (
                dto.newStatus === CheckBillStatus.IN_BANK_COLLECTION ||
                dto.newStatus === CheckBillStatus.IN_BANK_GUARANTEE
            ) {
                // Finansal hareket oluşturulmaz ancak BankSubmission kaydı eklenir
                if (dto.bankAccountId) {
                    const submissionType = dto.newStatus === CheckBillStatus.IN_BANK_COLLECTION
                        ? 'COLLECTION'
                        : 'GUARANTEE';
                    await tx.checkBillBankSubmission.create({
                        data: {
                            tenantId: movementTenantId,
                            checkBillId: checkBill.id,
                            bankAccountId: dto.bankAccountId,
                            submissionType,
                            submittedAt: new Date(dto.date),
                            status: 'SUBMITTED',
                            createdById: userId,
                        }
                    });
                }
            }

            // ── 2b. Ciro Et → Hedef Cari Bakiyesi Hareket Görür ─────────────────────
            else if (dto.newStatus === CheckBillStatus.ENDORSED) {
                if (dto.toAccountId) {
                    // Cari Hareket (Ekstre için)
                    await tx.accountMovement.create({
                        data: {
                            tenantId: movementTenantId,
                            accountId: dto.toAccountId,
                            type: DebitCredit.DEBIT, // Biz ona verdik, borcumuz azaldı (veya alacağımız arttı)
                            amount: checkBill.amount,
                            balance: 0,
                            documentType: DocumentType.CHECK_EXIT,
                            documentNo: checkBill.checkNo || checkBill.id,
                            date: new Date(dto.date),
                            notes: dto.notes || '',
                            checkBillId: checkBill.id,
                        },
                    });

                    await this.accountBalanceService.recalculateAccountBalance(dto.toAccountId, tx);
                }
            }

            // ── 2c. Tahsilat / Ödeme (COLLECTED, PARTIAL_PAID, PAID) ─────────────────
            else if (
                dto.newStatus === CheckBillStatus.COLLECTED ||
                dto.newStatus === CheckBillStatus.PARTIAL_PAID ||
                dto.newStatus === CheckBillStatus.PAID
            ) {
                const method = dto.paymentMethod ?? 'ELDEN';

                // Kasa hareketi
                if (method === 'KASA' && dto.cashboxId) {
                    const cashbox = await tx.cashbox.findFirst({
                        where: { id: dto.cashboxId, ...buildTenantWhereClause(movementTenantId) },
                        select: { balance: true }
                    });
                    if (cashbox) {
                        const movementType = isDebit ? CashboxMovementType.PAYMENT : CashboxMovementType.COLLECTION;
                        const delta = isDebit ? -txAmount : txAmount;
                        const newBalance = cashbox.balance.toNumber() + delta;

                        await tx.cashboxMovement.create({
                            data: {
                                tenantId: movementTenantId,
                                cashboxId: dto.cashboxId,
                                movementType,
                                amount: txAmount,
                                balance: newBalance,
                                notes: dto.notes || (isDebit ? 'Evrak Ödemesi' : 'Evrak Tahsilatı'),
                                date: new Date(dto.date),
                                accountId: checkBill.accountId,
                                documentType: 'CHECK_BILL',
                                documentNo: checkBill.id,
                                createdBy: userId,
                            },
                        });

                        await tx.cashbox.updateMany({
                            where: { id: dto.cashboxId, ...buildTenantWhereClause(movementTenantId) },
                            data: { balance: newBalance }
                        });
                    }
                }

                // Banka hareketi
                if (method === 'BANKA' && dto.bankAccountId) {
                    const bankAccount = await tx.bankAccount.findFirst({
                        where: { id: dto.bankAccountId, ...buildTenantWhereClause(movementTenantId) },
                        select: { balance: true }
                    });
                    if (bankAccount) {
                        const movementType = isDebit ? BankMovementType.OUTGOING : BankMovementType.INCOMING;
                        const delta = isDebit ? -txAmount : txAmount;
                        const newBalance = bankAccount.balance.toNumber() + delta;

                        await tx.bankAccountMovement.create({
                            data: {
                                tenantId: movementTenantId,
                                bankAccountId: dto.bankAccountId,
                                movementType,
                                amount: new Prisma.Decimal(txAmount),
                                balance: new Prisma.Decimal(newBalance),
                                notes: dto.notes || (isDebit ? 'Evrak Ödemesi' : 'Evrak Tahsilatı'),
                                date: new Date(dto.date),
                                accountId: checkBill.accountId,
                                referenceNo: checkBill.checkNo || checkBill.id,
                            },
                        });

                        await tx.bankAccount.updateMany({
                            where: { id: dto.bankAccountId, ...buildTenantWhereClause(movementTenantId) },
                            data: { balance: newBalance }
                        });
                    }
                }

                // Tahsilat Geçmişine (CheckBillCollection) kayıt atıyoruz
                await tx.checkBillCollection.create({
                    data: {
                        tenantId: movementTenantId,
                        checkBillId: checkBill.id,
                        collectedAmount: new Prisma.Decimal(txAmount),
                        collectionDate: new Date(dto.date),
                        collectionMethod: dto.paymentMethod === 'KASA' ? 'CASH' : 'BANK_TRANSFER',
                        journalId: 'ghost-journal',
                        createdById: userId,
                    },
                });
            }

            // ── 2d. İade (RETURNED) → Hareket Oluştur ─────────────────────────────
            else if (dto.newStatus === CheckBillStatus.RETURNED) {
                // Giriş hareketinin tersini oluşturarak bakiyeyi eski haline getir
                // CREDIT (Customer check) idi -> İade (Debit) olmalı
                // DEBIT (Company check) idi -> İade (Credit) olmalı
                const movType = checkBill.portfolioType === PortfolioType.CREDIT ? DebitCredit.DEBIT : DebitCredit.CREDIT;

                await tx.accountMovement.create({
                    data: {
                        tenantId: movementTenantId,
                        accountId: checkBill.accountId,
                        type: movType,
                        amount: checkBill.amount,
                        balance: 0,
                        documentType: DocumentType.RETURN,
                        documentNo: checkBill.checkNo || checkBill.id,
                        date: new Date(dto.date),
                        notes: dto.notes || '',
                        checkBillId: checkBill.id,
                    },
                });
            }

            this.logger.log(
                `[tenantId=${tenantId}] [userId=${userId}] Evrak ${checkBill.id}: ${checkBill.status} → ${dto.newStatus} | yöntem: ${dto.paymentMethod ?? '-'}`,
            );

            const needsRecalc =
                dto.newStatus === CheckBillStatus.COLLECTED ||
                dto.newStatus === CheckBillStatus.PARTIAL_PAID ||
                dto.newStatus === CheckBillStatus.PAID ||
                dto.newStatus === CheckBillStatus.ENDORSED ||
                dto.newStatus === CheckBillStatus.RETURNED;

            return { updated, recalcAccountId: needsRecalc ? checkBill.accountId : null };
        });

        if (result.recalcAccountId) {
            await this.accountBalanceService.recalculateAccountBalance(result.recalcAccountId);
        }

        return result.updated;
    }

    async create(dto: CreateCheckBillDto, checkBillJournalId?: string, createdByUserId?: string) {
        const tenantId = await this.tenantResolver.resolveForCreate();
        if (!tenantId) throw new BadRequestException('Kiracı bilgisi bulunamadı.');

        const checkBill = await this.prisma.$transaction(async (tx) => {
            const cb = await tx.checkBill.create({
                data: {
                    tenantId: (dto as { tenantId?: string }).tenantId || tenantId || undefined,
                    type: dto.type,
                    portfolioType: dto.portfolioType,
                    amount: dto.amount,
                    remainingAmount: dto.amount,
                    dueDate: new Date(dto.dueDate),
                    issueDate: dto.issueDate ? new Date(dto.issueDate) : null,
                    accountId: dto.accountId,
                    bank: dto.bank,
                    branch: dto.branch,
                    accountNo: dto.accountNo,
                    checkNo: dto.checkNo,
                    serialNo: dto.serialNo,
                    status: CheckBillStatus.IN_PORTFOLIO,
                    notes: dto.notes,
                    lastJournalId: checkBillJournalId,
                    createdBy: createdByUserId,
                },
            });

            // ── Account Movement (Cari Hareket) Oluştur ─────────────────────────
            // CREDIT -> Biz çek aldık -> Cari borçlanır (CREDIT movement)
            // DEBIT -> Biz çek verdik -> Cari alacaklanır (DEBIT movement)
            if (dto.accountId) {
                const movType = dto.portfolioType === PortfolioType.CREDIT ? DebitCredit.CREDIT : DebitCredit.DEBIT;
                const docType = dto.portfolioType === PortfolioType.CREDIT ? DocumentType.CHECK_ENTRY : DocumentType.CHECK_EXIT;

                await tx.accountMovement.create({
                    data: {
                        tenantId: (cb.tenantId || tenantId) as string,
                        accountId: cb.accountId,
                        type: movType,
                        amount: cb.amount,
                        balance: 0, // Recalculate sonrasında güncellenecek
                        documentType: docType,
                        documentNo: cb.checkNo || cb.id,
                        date: new Date(),
                        notes: cb.notes || '',
                        checkBillId: cb.id,
                    },
                });

                // Bakiye güncelleme (tx içinde yapılmalı)
                await this.accountBalanceService.recalculateAccountBalance(cb.accountId, tx);
            }

            return cb;
        });

        // Numara şablonu sayaç güncelleme (başarılı kayıt sonrası)
        if (dto.checkNo) {
            this.codeTemplateService.saveLastCode(ModuleType.CHECK_BILL_DOCUMENT, dto.checkNo).catch((err) => {
                this.logger.warn(`Numara şablonu sayaç güncellenirken hata: ${err.message}`);
            });
        }

        return checkBill;
    }

    async update(id: string, dto: UpdateCheckBillDto) {
        const tenantId = await this.tenantResolver.resolveForQuery();

        const existing = await this.prisma.checkBill.findFirst({
            where: { id, ...buildTenantWhereClause(tenantId ?? undefined) },
        });

        if (!existing) {
            throw new Error('Evrak bulunamadı');
        }

        const dataToUpdate: any = {
            checkNo: dto.checkNo,
            dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
            issueDate: dto.issueDate ? new Date(dto.issueDate) : undefined,
            bank: dto.bank,
            branch: dto.branch,
            accountNo: dto.accountNo,
            notes: dto.notes,
        };

        if (dto.amount !== undefined) {
            dataToUpdate.amount = dto.amount;
            const collected = Number(existing.amount) - Number(existing.remainingAmount);
            dataToUpdate.remainingAmount = dto.amount - collected;

            // Ilgili tum AccountMovement'lerin tutarlarini guncelle (Raw SQL ile stale client'i asalim)
            await this.prisma.$executeRawUnsafe(
                `UPDATE account_movements SET amount = $1, document_no = $2 WHERE check_bill_id = $3 AND "tenantId" = $4`,
                dto.amount,
                dto.checkNo || existing.checkNo || '—',
                id,
                tenantId
            );
        }

        await this.prisma.checkBill.updateMany({
            where: { id, ...buildTenantWhereClause(tenantId ?? undefined) },
            data: dataToUpdate,
        });

        // Bakiyeleri tekrar hesapla (Raw SQL ile)
        const movements: any[] = await this.prisma.$queryRawUnsafe(
            `SELECT account_id FROM account_movements WHERE check_bill_id = $1 AND "tenantId" = $2`,
            id,
            tenantId
        );
        const accountIdsToRecalculate = movements.map(m => m.account_id);
        if (accountIdsToRecalculate.length > 0) {
            await this.accountBalanceService.recalculateMultipleBalances(accountIdsToRecalculate);
        }

        return this.findOne(id);
    }

    async remove(id: string) {
        const tenantId = await this.tenantResolver.resolveForQuery();
        return this.prisma.checkBill.updateMany({
            where: { id, ...buildTenantWhereClause(tenantId ?? undefined) },
            data: { deletedAt: new Date() },
        });
    }

    async getStatsSummary() {
        const tenantId = await this.tenantResolver.resolveForQuery();
        const base = { ...buildTenantWhereClause(tenantId ?? undefined), deletedAt: null };
        const [byStatus, byType, byPortfolio, sumRemaining] = await Promise.all([
            this.prisma.checkBill.groupBy({ by: ['status'], where: base, _count: { _all: true } }),
            this.prisma.checkBill.groupBy({ by: ['type'], where: base, _count: { _all: true } }),
            this.prisma.checkBill.groupBy({ by: ['portfolioType'], where: base, _count: { _all: true } }),
            this.prisma.checkBill.aggregate({ where: base, _sum: { remainingAmount: true, amount: true } }),
        ]);
        return {
            byStatus,
            byType,
            byPortfolio,
            totalFaceAmount: sumRemaining._sum.amount,
            totalRemainingAmount: sumRemaining._sum.remainingAmount,
        };
    }

    async getStatsAging() {
        const tenantId = await this.tenantResolver.resolveForQuery();
        const base = { ...buildTenantWhereClause(tenantId ?? undefined), deletedAt: null };
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const d30 = new Date(today);
        d30.setDate(d30.getDate() + 30);
        const d60 = new Date(today);
        d60.setDate(d60.getDate() + 60);
        const d90 = new Date(today);
        d90.setDate(d90.getDate() + 90);

        const [overdue, bucket0_30, bucket31_60, bucket61_90, bucket90p] = await Promise.all([
            this.prisma.checkBill.aggregate({
                where: { ...base, dueDate: { lt: today } },
                _sum: { remainingAmount: true },
                _count: true,
            }),
            this.prisma.checkBill.aggregate({
                where: { ...base, dueDate: { gte: today, lte: d30 } },
                _sum: { remainingAmount: true },
                _count: true,
            }),
            this.prisma.checkBill.aggregate({
                where: { ...base, dueDate: { gt: d30, lte: d60 } },
                _sum: { remainingAmount: true },
                _count: true,
            }),
            this.prisma.checkBill.aggregate({
                where: { ...base, dueDate: { gt: d60, lte: d90 } },
                _sum: { remainingAmount: true },
                _count: true,
            }),
            this.prisma.checkBill.aggregate({
                where: { ...base, dueDate: { gt: d90 } },
                _sum: { remainingAmount: true },
                _count: true,
            }),
        ]);

        return {
            overdue,
            upcoming0to30Days: bucket0_30,
            upcoming31to60Days: bucket31_60,
            upcoming61to90Days: bucket61_90,
            upcoming90PlusDays: bucket90p,
        };
    }

    /** Önümüzdeki 90 gün: vade tarihine göre kalan tutar tahmini */
    async getStatsCashflow() {
        const tenantId = await this.tenantResolver.resolveForQuery();
        const base = { ...buildTenantWhereClause(tenantId ?? undefined), deletedAt: null };
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setDate(end.getDate() + 90);
        const rows = await this.prisma.checkBill.groupBy({
            by: ['dueDate'],
            where: {
                ...base,
                dueDate: { gte: start, lte: end },
                status: {
                    notIn: [
                        CheckBillStatus.COLLECTED,
                        CheckBillStatus.PAID,
                        CheckBillStatus.WRITTEN_OFF,
                        CheckBillStatus.CANCELLED,
                    ],
                },
            },
            _sum: { remainingAmount: true },
        });
        return { from: start, to: end, byDueDate: rows };
    }

    async getOverdue() {
        console.log('[CheckBillService] getOverdue called');
        const tenantId = await this.tenantResolver.resolveForQuery();
        console.log('[CheckBillService] getOverdue tenantId:', tenantId);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const excluded: CheckBillStatus[] = ['COLLECTED', 'PAID', 'WRITTEN_OFF', 'CANCELLED'];
        return this.prisma.checkBill.findMany({
            where: {
                ...buildTenantWhereClause(tenantId ?? undefined),
                deletedAt: null,
                dueDate: { lt: today },
                status: { notIn: excluded },
            },
            include: { account: { select: { title: true, code: true } } },
            orderBy: { dueDate: 'asc' },
        });
    }

    async getAtRisk(minScore = 70) {
        console.log('[CheckBillService] getAtRisk called with minScore:', minScore);
        const tenantId = await this.tenantResolver.resolveForQuery();
        console.log('[CheckBillService] getAtRisk tenantId:', tenantId);
        return this.prisma.checkBill.findMany({
            where: {
                ...buildTenantWhereClause(tenantId ?? undefined),
                deletedAt: null,
                riskScore: { gte: minScore },
            },
            include: { account: { select: { title: true, code: true } } },
            orderBy: [{ riskScore: 'desc' }, { dueDate: 'asc' }],
        });
    }

    async getTimeline(id: string) {
        const tenantId = await this.tenantResolver.resolveForQuery();
        const checkBill = await this.prisma.checkBill.findFirst({
            where: { id, ...buildTenantWhereClause(tenantId ?? undefined), deletedAt: null },
        });
        if (!checkBill) {
            throw new NotFoundException('Document not found');
        }
        const [logs, endorsements, collections] = await Promise.all([
            this.prisma.checkBillLog.findMany({
                where: { checkBillId: id, ...buildTenantWhereClause(tenantId ?? undefined) },
                orderBy: { createdAt: 'asc' },
                include: { performedBy: { select: { fullName: true } } },
            }),
            this.prisma.checkBillEndorsement.findMany({
                where: { checkBillId: id, ...buildTenantWhereClause(tenantId ?? undefined) },
                orderBy: { sequence: 'asc' },
            }),
            this.prisma.checkBillCollection.findMany({
                where: { checkBillId: id, ...buildTenantWhereClause(tenantId ?? undefined) },
                orderBy: { collectionDate: 'asc' },
            }),
        ]);

        type Ev = { at: string; kind: string; title: string; payload?: Record<string, unknown> };
        const events: Ev[] = [];
        for (const l of logs) {
            events.push({
                at: l.createdAt.toISOString(),
                kind: 'LOG',
                title: l.actionType,
                payload: {
                    fromStatus: l.fromStatus,
                    toStatus: l.toStatus,
                    notes: l.notes,
                    by: l.performedBy?.fullName,
                },
            });
        }
        for (const e of endorsements) {
            events.push({
                at: e.endorsedAt.toISOString(),
                kind: 'ENDORSEMENT',
                title: `Ciro #${e.sequence}`,
                payload: { fromAccountId: e.fromAccountId, toAccountId: e.toAccountId },
            });
        }
        for (const c of collections) {
            events.push({
                at: c.collectionDate.toISOString(),
                kind: 'COLLECTION',
                title: 'Tahsilat',
                payload: { amount: c.collectedAmount, method: c.collectionMethod },
            });
        }
        events.sort((a, b) => a.at.localeCompare(b.at));
        return { checkBillId: id, events };
    }

    async getGlEntriesForCheckBill(id: string) {
        const tenantId = await this.tenantResolver.resolveForQuery();
        const checkBill = await this.prisma.checkBill.findFirst({
            where: { id, ...buildTenantWhereClause(tenantId ?? undefined), deletedAt: null },
        });
        if (!checkBill) {
            throw new NotFoundException('Document not found');
        }
        const tid = checkBill.tenantId ?? tenantId ?? undefined;
        if (!tid) {
            return [];
        }
        return this.prisma.checkBillGlEntry.findMany({
            where: { checkBillId: id, tenantId: tid },
            orderBy: { accountingDate: 'desc' },
        });
    }

    async getDocuments(id: string) {
        const row = await this.findOne(id);
        return {
            checkBillId: id,
            attachmentUrls: row.attachmentUrls,
            tags: row.tags,
            internalRef: row.internalRef,
            externalRef: row.externalRef,
        };
    }

    async bulkSoftDelete(checkBillIds: string[], deletedBy: string) {
        const tenantId = await this.tenantResolver.resolveForQuery();
        if (checkBillIds.length === 0) {
            return { ok: true, affected: 0 };
        }

        // Tahsil edilmiş veya ödemesi yapılmış evraklar silinemez
        const { BadRequestException } = await import('@nestjs/common');
        const blocked = await this.prisma.checkBill.findMany({
            where: {
                id: { in: checkBillIds },
                ...buildTenantWhereClause(tenantId ?? undefined),
                deletedAt: null,
                status: { in: [CheckBillStatus.COLLECTED, CheckBillStatus.PAID] },
            },
            select: { id: true, checkNo: true, status: true },
        });

        if (blocked.length > 0) {
            const nos = blocked.map((b) => b.checkNo || b.id).join(', ');
            throw new BadRequestException(
                `Tahsil edilmiş veya ödemesi yapılmış evraklar silinemez: ${nos}`,
            );
        }

        const res = await this.prisma.checkBill.updateMany({
            where: {
                id: { in: checkBillIds },
                ...buildTenantWhereClause(tenantId ?? undefined),
                deletedAt: null,
            },
            data: { deletedAt: new Date(), deletedBy },
        });
        return { ok: true, affected: res.count };
    }

    /** Excel (XLSX) formatında export; büyük listeler için take yüksek */
    async exportExcel(filter: CheckBillFilterDto): Promise<Buffer> {
        const { items } = await this.findAll({
            ...filter,
            take: Math.min(filter.take ?? 10_000, 50_000),
            skip: filter.skip ?? 0,
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Çek Senet Listesi');

        // Column headers
        worksheet.columns = [
            { header: 'Çek/Senet No', key: 'checkNo', width: 20 },
            { header: 'Cari Kod', key: 'accountCode', width: 15 },
            { header: 'Cari Ünvan', key: 'accountTitle', width: 30 },
            { header: 'Banka', key: 'bank', width: 20 },
            { header: 'Vade Tarihi', key: 'dueDate', width: 15 },
            { header: 'Tutar', key: 'amount', width: 15 },
            { header: 'Kalan Tutar', key: 'remainingAmount', width: 15 },
            { header: 'Durum', key: 'status', width: 15 },
            { header: 'Portföy Tipi', key: 'portfolioType', width: 12 },
        ];

        // Header style
        worksheet.getRow(1).font = { bold: true, size: 11 };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE0E0E0' },
        };

        // Data rows
        items.forEach((r) => {
            worksheet.addRow({
                checkNo: r.checkNo || '',
                accountCode: (r as { account?: { code?: string } }).account?.code || '',
                accountTitle: (r as { account?: { title?: string } }).account?.title || '',
                bank: r.bank || '',
                dueDate: r.dueDate instanceof Date ? r.dueDate.toISOString().split('T')[0] : String(r.dueDate),
                amount: r.amount ? Number(r.amount) : 0,
                remainingAmount: r.remainingAmount ? Number(r.remainingAmount) : 0,
                status: r.status,
                portfolioType: r.portfolioType,
            });
        });

        // Format amount columns
        ['F', 'G'].forEach((col) => {
            worksheet.getColumn(col).numFmt = '#,##0.00';
        });

        return workbook.xlsx.writeBuffer() as Promise<Buffer>;
    }
}
