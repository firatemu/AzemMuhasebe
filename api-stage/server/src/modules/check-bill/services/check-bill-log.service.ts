import { Injectable } from '@nestjs/common';
import { CheckBillStatus, LogAction } from '@prisma/client';
import { TransactionClient } from '../handlers/journal-handler.interface';

interface WriteLogParams {
    checkBillId: string;
    fromStatus: CheckBillStatus | null;
    toStatus: CheckBillStatus;
    journalId: string;
    performedById: string;
    tenantId: string;
    notes?: string;
}

@Injectable()
export class CheckBillLogService {
    /**
     * Mevcut bir $transaction içinde çağrılmalıdır.
     * Kendi transaction'ını AÇMAZ.
     */
    async write(tx: TransactionClient, params: WriteLogParams): Promise<void> {
        await tx.checkBillLog.create({
            data: {
                tenantId: params.tenantId,
                checkBillId: params.checkBillId,
                actionType: LogAction.STATUS_CHANGE,
                fromStatus: params.fromStatus ?? undefined,
                toStatus: params.toStatus,
                journalId: params.journalId,
                performedById: params.performedById,
                notes: params.notes,
            },
        });
    }
}
