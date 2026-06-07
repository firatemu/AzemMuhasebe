import { Injectable, Logger } from '@nestjs/common';
import { CheckBillStatus, LogAction } from '@prisma/client';
import { IJournalHandler, JournalHandlerContext } from './journal-handler.interface';
import { CreateCheckBillJournalDto } from '../dto/create-check-bill-journal.dto';
import { assertLegalTransition } from '../utils/status-transition.util';

/** Doc: LEGAL_TRANSFER — hukuki takip aktarımı */
@Injectable()
export class LegalTransferHandler implements IJournalHandler {
    private readonly logger = new Logger(LegalTransferHandler.name);

    async handle(dto: CreateCheckBillJournalDto, context: JournalHandlerContext): Promise<void> {
        const { tx, journalId, tenantId, performedById } = context;
        const ids = dto.selectedDocumentIds ?? [];
        if (ids.length === 0) return;

        for (const checkBillId of ids) {
            const checkBill = await tx.checkBill.findFirst({
                where: { id: checkBillId, tenantId, deletedAt: null },
            });
            if (!checkBill) continue;

            assertLegalTransition(checkBill.status, CheckBillStatus.LEGAL_FOLLOWUP);

            await tx.checkBill.update({
                where: { id: checkBillId },
                data: {
                    status: CheckBillStatus.LEGAL_FOLLOWUP,
                    legalFollowupStarted: true,
                    legalFollowupDate: new Date(dto.date),
                    lastJournalId: journalId,
                    updatedBy: performedById,
                },
            });

            await tx.checkBillJournalItem.create({
                data: { tenantId, journalId, checkBillId },
            });

            await tx.checkBillLog.create({
                data: {
                    tenantId,
                    checkBillId,
                    actionType: LogAction.STATUS_CHANGE,
                    fromStatus: checkBill.status ?? undefined,
                    toStatus: CheckBillStatus.LEGAL_FOLLOWUP,
                    journalId,
                    performedById,
                    notes: dto.notes ?? 'Hukuki takip transferi',
                },
            });
        }

        this.logger.log(`LEGAL_TRANSFER bordrosu işlendi (journal ${journalId})`);
    }
}
