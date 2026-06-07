import { Injectable, BadRequestException } from '@nestjs/common';
import { CheckBillStatus, LogAction, Prisma } from '@prisma/client';
import { IJournalHandler, JournalHandlerContext } from './journal-handler.interface';
import { CreateCheckBillJournalDto } from '../dto/create-check-bill-journal.dto';
import { assertLegalTransition } from '../utils/status-transition.util';
import { AccountBalanceService } from '../../account-balance/account-balance.service';

/**
 * Document Exit Handler
 *
 * Handles operations where a check/promissory note is physically returned to the customer
 * or removed from the portfolio without payment/collection.
 *
 * Journal types handled:
 * - CUSTOMER_DOCUMENT_EXIT: Customer document exit
 * - OWN_DOCUMENT_EXIT: Own document exit
 * - DEBIT_DOCUMENT_EXIT: Debit document exit
 */
@Injectable()
export class DocumentExitHandler implements IJournalHandler {
    constructor(private readonly accountBalanceService: AccountBalanceService) {}

    async handle(dto: CreateCheckBillJournalDto, context: JournalHandlerContext): Promise<void> {
        const { tx, journalId, tenantId, performedById } = context;

        const ids = dto.selectedDocumentIds ?? [];
        if (ids.length === 0) return;

        for (const checkBillId of ids) {
            const checkBill = await tx.checkBill.findFirst({
                where: { id: checkBillId, tenantId, deletedAt: null },
            });

            if (!checkBill) throw new BadRequestException(`Evrak bulunamadı: ${checkBillId}`);

            // Validate transition to GIVEN_TO_CUSTOMER status
            assertLegalTransition(checkBill.status, CheckBillStatus.GIVEN_TO_CUSTOMER);

            // Update check bill status
            await tx.checkBill.update({
                where: { id: checkBillId },
                data: {
                    status: CheckBillStatus.GIVEN_TO_CUSTOMER,
                    lastJournalId: journalId,
                    updatedBy: performedById,
                },
            });

            // Create journal item record
            await tx.checkBillJournalItem.create({
                data: { tenantId, journalId, checkBillId },
            });

            // Create log entry
            await tx.checkBillLog.create({
                data: {
                    tenantId,
                    checkBillId,
                    actionType: LogAction.STATUS_CHANGE,
                    fromStatus: checkBill.status ?? undefined,
                    toStatus: CheckBillStatus.GIVEN_TO_CUSTOMER,
                    journalId,
                    performedById,
                    notes: 'Müşteriye verildi / Portföyden çıkış',
                },
            });

            // Create account movement to reverse the original entry
            await tx.accountMovement.create({
                data: {
                    tenantId,
                    accountId: checkBill.accountId,
                    type: checkBill.portfolioType === 'CREDIT' ? Prisma.DebitCredit.DEBIT : Prisma.DebitCredit.CREDIT,
                    amount: checkBill.amount,
                    balance: new Prisma.Decimal(0),
                    documentType: 'CHECK_EXIT',
                    documentNo: checkBill.checkNo || checkBill.id,
                    checkBillId: checkBillId,
                    date: dto.date ? new Date(dto.date) : new Date(),
                    notes: dto.notes || 'Müşteriye verildi',
                },
            });

            // Recalculate account balance
            await this.accountBalanceService.recalculateAccountBalance(checkBill.accountId, tx);
        }
    }
}
