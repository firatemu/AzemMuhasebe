import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma.service';
import { TransactionClient } from '../handlers/journal-handler.interface';
import { buildTenantWhereClause } from '../../../common/utils/staging.util';

interface CreateCollectionParams {
    tenantId: string;
    checkBillId: string;
    collectedAmount: number;
    collectionDate: Date;
    cashboxId?: string | null;
    bankAccountId?: string | null;
    journalId: string;
    createdById?: string;
}

@Injectable()
export class CheckBillCollectionService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Mevcut bir $transaction içinde tahsilat kaydı oluşturur.
     */
    async createRecord(tx: TransactionClient, params: CreateCollectionParams): Promise<void> {
        await tx.checkBillCollection.create({
            data: {
                tenantId: params.tenantId,
                checkBillId: params.checkBillId,
                collectedAmount: params.collectedAmount,
                collectionDate: params.collectionDate,
                cashboxId: params.cashboxId ?? null,
                bankAccountId: params.bankAccountId ?? null,
                journalId: params.journalId,
                createdById: params.createdById,
            },
        });
    }

    /**
     * Bir evrakın tüm tahsilat geçmişini döner (collectionDate DESC).
     */
    async getHistory(checkBillId: string, tenantId: string) {
        return this.prisma.checkBillCollection.findMany({
            where: {
                checkBillId,
                ...buildTenantWhereClause(tenantId),
            },
            orderBy: { collectionDate: 'desc' },
        });
    }
}
