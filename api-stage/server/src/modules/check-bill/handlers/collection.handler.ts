import { Injectable, BadRequestException } from '@nestjs/common';
import { CheckBillStatus, AccountTransactionDirection, CashboxMovementType, BankMovementType, LogAction } from '@prisma/client';
import { IJournalHandler, JournalHandlerContext } from './journal-handler.interface';
import { CreateCheckBillJournalDto } from '../dto/create-check-bill-journal.dto';
import { assertLegalTransition } from '../utils/status-transition.util';

@Injectable()
export class CollectionHandler implements IJournalHandler {
    async handle(dto: CreateCheckBillJournalDto, context: JournalHandlerContext): Promise<void> {
        const { tx, journalId, tenantId, performedById } = context;

        const ids = dto.selectedDocumentIds ?? [];
        if (ids.length === 0) return;

        for (const checkBillId of ids) {
            const checkBill = await tx.checkBill.findFirst({
                where: { id: checkBillId, tenantId, deletedAt: null },
            });

            if (!checkBill) throw new BadRequestException(`Evrak bulunamadı: ${checkBillId}`);

            const transactionAmount = Number(dto['transactionAmount'] ?? checkBill.remainingAmount);
            const remaining = Number(checkBill.remainingAmount);

            if (transactionAmount <= 0 || transactionAmount > remaining) {
                throw new BadRequestException(
                    `Tahsilat tutarı (${transactionAmount}) geçersiz. Kalan tutar: ${remaining}`,
                );
            }

            const newRemaining = remaining - transactionAmount;

            // PortfolioType'a göre hedef statü belirle
            let newStatus: CheckBillStatus;
            if (newRemaining > 0) {
                newStatus = CheckBillStatus.PARTIAL_PAID;
            } else {
                newStatus = checkBill.portfolioType === 'DEBIT'
                    ? CheckBillStatus.PAID
                    : CheckBillStatus.COLLECTED;
            }

            assertLegalTransition(checkBill.status, newStatus);

            await tx.checkBill.update({
                where: { id: checkBillId },
                data: {
                    status: newStatus,
                    remainingAmount: newRemaining,
                    collectionDate: new Date(dto.date),
                    lastJournalId: journalId,
                    updatedBy: performedById,
                },
            });

            await tx.checkBillCollection.create({
                data: {
                    tenantId,
                    checkBillId,
                    collectedAmount: transactionAmount,
                    collectionDate: new Date(dto.date),
                    cashboxId: dto.cashboxId ?? null,
                    bankAccountId: dto.bankAccountId ?? null,
                    journalId,
                    createdById: performedById,
                },
            });

            if (dto.cashboxId) {
                await tx.cashboxMovement.create({
                    data: {
                        tenantId,
                        cashboxId: dto.cashboxId,
                        movementType: CashboxMovementType.COLLECTION,
                        amount: transactionAmount,
                        balance: 0,
                        notes: dto.notes ?? 'Evrak tahsilatı',
                        date: new Date(dto.date),
                        accountId: checkBill.accountId,
                        createdBy: performedById,
                    },
                });
            } else if (dto.bankAccountId) {
                await tx.bankAccountMovement.create({
                    data: {
                        tenantId,
                        bankAccountId: dto.bankAccountId,
                        movementType: BankMovementType.INCOMING,
                        amount: transactionAmount,
                        balance: 0,
                        notes: dto.notes ?? 'Evrak tahsilatı',
                        date: new Date(dto.date),
                        accountId: checkBill.accountId,
                    },
                });
            }

            await tx.checkBillJournalItem.create({
                data: { tenantId, journalId, checkBillId },
            });

            await tx.checkBillLog.create({
                data: {
                    tenantId,
                    checkBillId,
                    actionType: LogAction.STATUS_CHANGE,
                    fromStatus: checkBill.status ?? undefined,
                    toStatus: newStatus,
                    journalId,
                    performedById,
                    notes: `Tahsilat: ${transactionAmount} TL`,
                },
            });
        }
    }
}
