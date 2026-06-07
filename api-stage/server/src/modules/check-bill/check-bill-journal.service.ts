import { TenantResolverService } from '../../common/services/tenant-resolver.service';
import {
    Injectable,
    BadRequestException,
    ConflictException,
    NotFoundException,
    Logger,
} from '@nestjs/common';
import { CheckBillJournalPostingStatus } from '@prisma/client';
import { PrismaService } from '../../common/prisma.service';
import { CreateCheckBillJournalDto, UpdateCheckBillJournalDto } from './dto/create-check-bill-journal.dto';
import { buildTenantWhereClause } from '../../common/utils/staging.util';
import { HandlerRegistry } from './handlers/handler-registry';
import { AccountBalanceService } from '../account-balance/account-balance.service';
import { CodeTemplateService } from '../code-template/code-template.service';
import { ModuleType } from '../code-template/code-template.enums';

interface RequestUser {
    id: string;
    tenantId?: string;
}

@Injectable()
export class CheckBillJournalService {
    private readonly logger = new Logger(CheckBillJournalService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly tenantResolver: TenantResolverService,
        private readonly handlerRegistry: HandlerRegistry,
        private readonly accountBalanceService: AccountBalanceService,
        private readonly codeTemplateService: CodeTemplateService,
    ) { }

    async findAll() {
        const tenantId = await this.tenantResolver.resolveForQuery();
        const items = await this.prisma.checkBillJournal.findMany({
            where: {
                ...buildTenantWhereClause(tenantId ?? undefined),
                deletedAt: null,
            },
            orderBy: { date: 'desc' },
            include: {
                account: { select: { title: true } },
                items: {
                    include: {
                        checkBill: { select: { amount: true } },
                    },
                },
                _count: { select: { items: true } },
            },
        });

        return items.map((item) => {
            const totalAmount = item.items.reduce((sum, bi) => sum + Number(bi.checkBill.amount), 0);
            const { items: journalItems, _count, ...rest } = item;
            return { ...rest, totalAmount, documentCount: _count.items };
        });
    }

    async findOne(id: string) {
        const tenantId = await this.tenantResolver.resolveForQuery();
        const item = await this.prisma.checkBillJournal.findFirst({
            where: {
                id,
                ...buildTenantWhereClause(tenantId ?? undefined),
                deletedAt: null,
            },
            include: {
                account: true,
                cashbox: true,
                bankAccount: true,
                items: {
                    include: { checkBill: true },
                },
            },
        });

        if (!item) return null;

        const checkBills = item.items.map((bi) => bi.checkBill);
        const totalAmount = checkBills.reduce((sum, cs) => sum + Number(cs.amount), 0);
        return { ...item, checkBills, totalAmount };
    }

    async create(dto: CreateCheckBillJournalDto, user: RequestUser) {
        const tenantId = await this.tenantResolver.resolveForCreate();
        if (!tenantId) {
            throw new BadRequestException('Kiracı bilgisi (tenantId) çözümlenemedi.');
        }

        const finalJournalNo =
            dto.journalNo?.trim() ||
            (await this.codeTemplateService.getNextCode(ModuleType.CHECK_BILL_JOURNAL));

        // 1. Uniqueness guard — fail fast, transaction açılmadan önce
        const existing = await this.prisma.checkBillJournal.findFirst({
            where: { tenantId, journalNo: finalJournalNo },
        });
        if (existing) {
            throw new ConflictException(`${finalJournalNo} bordro numarası zaten mevcut.`);
        }

        const result = await this.prisma.$transaction(async (tx) => {
            // 2. Bordro başlığı oluştur
            const journal = await tx.checkBillJournal.create({
                data: {
                    tenantId,
                    journalNo: finalJournalNo,
                    type: dto.type,
                    date: new Date(dto.date),
                    accountId: dto.accountId,
                    bankAccountId: dto.bankAccountId,
                    cashboxId: dto.cashboxId,
                    notes: dto.notes,
                    createdById: user.id,
                    journalStatus: CheckBillJournalPostingStatus.POSTED,
                },
            });

            // 3. İlgili handler'ı seç
            const handler = this.handlerRegistry.resolve(dto.type);

            // 4. Handler varsa çalıştır
            if (handler) {
                await handler.handle(dto, {
                    tx,
                    journalId: journal.id,
                    tenantId,
                    performedById: user.id,
                });
            } else {
                this.logger.warn(
                    `[tenantId=${tenantId}] [userId=${user.id}] Handler bulunamadı: ${dto.type}. Bordro oluşturuldu ancak evrak işlemi yapılmadı.`,
                );
            }

            return journal;
        });

        // İşlem sonrası bakiyeleri hesapla
        try {
            const items = await this.prisma.checkBillJournalItem.findMany({
                where: { journalId: result.id, tenantId },
                select: { checkBillId: true },
            });
            const checkBillIds = items.map((i) => i.checkBillId);

            if (checkBillIds.length > 0) {
                const movementAccounts: any[] = await this.prisma.$queryRawUnsafe(
                    `SELECT DISTINCT account_id FROM account_movements WHERE check_bill_id = ANY($1) AND "tenantId" = $2`,
                    checkBillIds,
                    tenantId
                );
                const accountIds = movementAccounts.map((m) => m.account_id);
                if (accountIds.length > 0) {
                    await this.accountBalanceService.recalculateMultipleBalances(accountIds);
                }

                // Numara şablonu sayaç güncelleme (başarılı kayıt sonrası)
                const checkBills = await this.prisma.checkBill.findMany({
                    where: { id: { in: checkBillIds } },
                    select: { checkNo: true },
                });

                for (const checkBill of checkBills) {
                    if (checkBill.checkNo) {
                        this.codeTemplateService.saveLastCode(ModuleType.CHECK_BILL_DOCUMENT, checkBill.checkNo).catch((err) => {
                            this.logger.warn(`Numara şablonu sayaç güncellenirken hata: ${err.message}`);
                        });
                    }
                }
            }
        } catch (err) {
            this.logger.error(`Bakiye hesaplama hatası (Bordro ID: ${result.id}):`, err);
        }

        return result;
    }

    async update(id: string, dto: UpdateCheckBillJournalDto) {
        const tenantId = await this.tenantResolver.resolveForQuery();
        const journal = await this.prisma.checkBillJournal.findFirst({
            where: { id, ...buildTenantWhereClause(tenantId ?? undefined) },
        });
        if (!journal) throw new NotFoundException('Bordro bulunamadı.');

        await this.prisma.checkBillJournal.update({
            where: { id },
            data: {
                ...(dto.date && { date: new Date(dto.date) }),
                ...(dto.notes !== undefined && { notes: dto.notes }),
            },
        });
        return this.findOne(id);
    }

    async remove(id: string) {
        const tenantId = await this.tenantResolver.resolveForQuery();
        const journal = await this.prisma.checkBillJournal.findFirst({
            where: { id, ...buildTenantWhereClause(tenantId ?? undefined) },
            include: { items: { select: { checkBillId: true } } },
        });
        if (!journal) throw new NotFoundException('Bordro bulunamadı.');

        if (
            journal.journalStatus === CheckBillJournalPostingStatus.POSTED ||
            journal.journalStatus === CheckBillJournalPostingStatus.CANCELLED
        ) {
            throw new ConflictException(
                'Bu bordro deftere işlenmiş veya iptal edilmiş; yalnızca taslak bordrolar silinebilir.',
            );
        }

        const result = await this.prisma.$transaction(async (tx) => {
            const checkBillIds = journal.items.map((i) => i.checkBillId);

            let accountIdsToRecalculate: string[] = [];
            if (checkBillIds.length > 0) {
                // Hangi carilerin etkilendiğini bulalım (silinmeden önce)
                const movementAccounts: any[] = await tx.$queryRawUnsafe(
                    `SELECT DISTINCT account_id FROM account_movements WHERE check_bill_id = ANY($1) AND "tenantId" = $2`,
                    checkBillIds,
                    tenantId
                );
                accountIdsToRecalculate = movementAccounts.map((m) => m.account_id);

                // Bağlı evraklara soft delete uygula (sadece portföyde olanlar)
                await tx.checkBill.updateMany({
                    where: { id: { in: checkBillIds }, status: 'IN_PORTFOLIO' },
                    data: { deletedAt: new Date() },
                });

                // Cari hareketleri temizle
                await tx.$executeRawUnsafe(
                    `DELETE FROM account_movements WHERE check_bill_id = ANY($1) AND "tenantId" = $2`,
                    checkBillIds,
                    tenantId
                );
            }

            // Bordroya soft delete uygula
            await tx.checkBillJournal.update({
                where: { id },
                data: { deletedAt: new Date() },
            });
            this.logger.log(`[tenantId=${tenantId}] Bordro ${id} silindi. Etkilenen evrak sayısı: ${checkBillIds.length}`);
            return { success: true, journalId: id, accountIdsToRecalculate };
        });

        // Silme işlemi sonrası bakiyeleri hesapla
        try {
            if (result.accountIdsToRecalculate.length > 0) {
                await this.accountBalanceService.recalculateMultipleBalances(result.accountIdsToRecalculate);
            }
        } catch (err) {
            this.logger.error(`Bakiye hesaplama hatası (Bordro Silme ID: ${id}):`, err);
        }

        return { success: result.success };
    }

    async findItems(id: string) {
        const tenantId = await this.tenantResolver.resolveForQuery();
        const journal = await this.prisma.checkBillJournal.findFirst({
            where: { id, ...buildTenantWhereClause(tenantId ?? undefined), deletedAt: null },
            include: {
                items: { include: { checkBill: { select: { id: true, checkNo: true, amount: true, status: true } } } },
            },
        });
        if (!journal) throw new NotFoundException('Bordro bulunamadı.');
        return journal.items;
    }

    /** GL entegrasyonu tamamlanana kadar özet önizleme (doc §5.2) */
    async glPreview(id: string) {
        const detail = await this.findOne(id);
        if (!detail) {
            throw new NotFoundException('Bordro bulunamadı.');
        }
        const lines = (detail.checkBills || []).map((cb: { id: string; amount: unknown; checkNo: string | null }) => ({
            checkBillId: cb.id,
            debitAccountCode: '—',
            creditAccountCode: '—',
            amount: Number(cb.amount),
            description: `Çek/Senet ${cb.checkNo || cb.id}`,
        }));
        return { journalId: id, type: detail.type, previewLines: lines, note: 'GLIntegrationService ile fişleştirilecek' };
    }

    async postJournal(id: string, userId?: string) {
        const tenantId = await this.tenantResolver.resolveForQuery();
        const j = await this.prisma.checkBillJournal.findFirst({
            where: { id, ...buildTenantWhereClause(tenantId ?? undefined), deletedAt: null },
        });
        if (!j) throw new NotFoundException('Bordro bulunamadı.');
        return this.prisma.checkBillJournal.update({
            where: { id },
            data: {
                journalStatus: CheckBillJournalPostingStatus.POSTED,
                accountingDate: j.accountingDate ?? j.date,
                totalAmount: j.totalAmount ?? undefined,
                totalCount: j.totalCount ?? undefined,
                ...(userId ? { approvedById: userId, approvedAt: new Date() } : {}),
            },
        });
    }

    async approveJournal(id: string, userId?: string) {
        if (!userId) throw new BadRequestException('Kullanıcı bilgisi gerekli.');
        const tenantId = await this.tenantResolver.resolveForQuery();
        const j = await this.prisma.checkBillJournal.findFirst({
            where: { id, ...buildTenantWhereClause(tenantId ?? undefined), deletedAt: null },
        });
        if (!j) throw new NotFoundException('Bordro bulunamadı.');
        return this.prisma.checkBillJournal.update({
            where: { id },
            data: { approvedById: userId, approvedAt: new Date(), journalStatus: CheckBillJournalPostingStatus.POSTED },
        });
    }

    async cancelJournal(id: string) {
        const tenantId = await this.tenantResolver.resolveForQuery();
        const j = await this.prisma.checkBillJournal.findFirst({
            where: { id, ...buildTenantWhereClause(tenantId ?? undefined), deletedAt: null },
        });
        if (!j) throw new NotFoundException('Bordro bulunamadı.');
        return this.prisma.checkBillJournal.update({
            where: { id },
            data: { journalStatus: CheckBillJournalPostingStatus.CANCELLED },
        });
    }
}
