import { Injectable, NotFoundException } from '@nestjs/common';
import {
    CheckBillGlEntryStatus,
    CheckBillGlEntryType,
} from '@prisma/client';
import { PrismaService } from '../../../common/prisma.service';
import { TenantResolverService } from '../../../common/services/tenant-resolver.service';
import { buildTenantWhereClause } from '../../../common/utils/staging.util';

/**
 * Doc §6.2 — çek/senet GL satırları. Hesap kodları ileride tenant şablonundan beslenecek.
 */
@Injectable()
export class GlIntegrationService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly tenantResolver: TenantResolverService,
    ) {}

    async listByCheckBill(checkBillId: string) {
        const tenantId = await this.tenantResolver.resolveForQuery();
        const cb = await this.prisma.checkBill.findFirst({
            where: { id: checkBillId, ...buildTenantWhereClause(tenantId ?? undefined), deletedAt: null },
        });
        if (!cb) throw new NotFoundException('Evrak bulunamadı.');
        const tid = cb.tenantId ?? tenantId;
        if (!tid) return [];
        return this.prisma.checkBillGlEntry.findMany({
            where: { checkBillId, tenantId: tid },
            orderBy: { accountingDate: 'desc' },
        });
    }

    /** Taslak GL satırı — muhasebe onayı sonrası POSTED yapılabilir */
    async createDraftLine(input: {
        checkBillId: string;
        journalId?: string | null;
        debitAccountCode: string;
        creditAccountCode: string;
        amount: number;
        description: string;
        currency?: string;
    }) {
        const tenantId = await this.tenantResolver.resolveForCreate();
        if (!tenantId) {
            throw new NotFoundException('Kiracı çözümlenemedi');
        }
        const cb = await this.prisma.checkBill.findFirst({
            where: { id: input.checkBillId, ...buildTenantWhereClause(tenantId), deletedAt: null },
        });
        if (!cb) throw new NotFoundException('Evrak bulunamadı.');
        const now = new Date();
        const amt = input.amount;
        return this.prisma.checkBillGlEntry.create({
            data: {
                tenantId,
                checkBillId: input.checkBillId,
                journalId: input.journalId ?? undefined,
                glJournalNo: `CB-GL-${now.getTime()}`,
                accountingDate: now,
                fiscalYear: now.getFullYear(),
                fiscalPeriod: now.getMonth() + 1,
                debitAccountCode: input.debitAccountCode,
                creditAccountCode: input.creditAccountCode,
                debitAmount: amt,
                creditAmount: amt,
                currency: (input.currency || cb.currency || 'TRY').slice(0, 3),
                exchangeRate: cb.exchangeRate ?? undefined,
                description: input.description,
                entryType: CheckBillGlEntryType.AUTO,
                status: CheckBillGlEntryStatus.DRAFT,
            },
        });
    }
}
