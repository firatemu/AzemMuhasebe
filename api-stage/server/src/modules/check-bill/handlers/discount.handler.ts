import { Injectable, BadRequestException } from '@nestjs/common';
import { CheckBillStatus, LogAction } from '@prisma/client';
import { IJournalHandler, JournalHandlerContext } from './journal-handler.interface';
import { CreateCheckBillJournalDto } from '../dto/create-check-bill-journal.dto';
import { assertLegalTransition } from '../utils/status-transition.util';

/** Doc: BANK_DISCOUNT_SUBMISSION — bankaya iskonto tevdi */
@Injectable()
export class DiscountHandler implements IJournalHandler {
    async handle(dto: CreateCheckBillJournalDto, context: JournalHandlerContext): Promise<void> {
        const { tx, journalId, tenantId, performedById } = context;
        const ids = dto.selectedDocumentIds ?? [];
        if (ids.length === 0) return;

        for (const checkBillId of ids) {
            const checkBill = await tx.checkBill.findFirst({
                where: { id: checkBillId, tenantId, deletedAt: null },
            });
            if (!checkBill) throw new BadRequestException(`Evrak bulunamadı: ${checkBillId}`);

            assertLegalTransition(checkBill.status, CheckBillStatus.DISCOUNTED);

            await tx.checkBill.update({
                where: { id: checkBillId },
                data: {
                    status: CheckBillStatus.DISCOUNTED,
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
                    toStatus: CheckBillStatus.DISCOUNTED,
                    journalId,
                    performedById,
                    notes: dto.notes ?? 'İskonto (banka tevdi)',
                },
            });
        }
    }
}
