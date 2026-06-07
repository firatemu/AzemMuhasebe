import { Injectable, BadRequestException } from '@nestjs/common';
import { CheckBillStatus, LogAction, DebitCredit, DocumentType, Prisma } from '@prisma/client';
import { IJournalHandler, JournalHandlerContext } from './journal-handler.interface';
import { CreateCheckBillJournalDto } from '../dto/create-check-bill-journal.dto';
import { assertLegalTransition } from '../utils/status-transition.util';
import { AccountBalanceService } from '../../account-balance/account-balance.service';

@Injectable()
export class ReturnHandler implements IJournalHandler {
    constructor(private readonly accountBalanceService: AccountBalanceService) { }

    async handle(dto: CreateCheckBillJournalDto, context: JournalHandlerContext): Promise<void> {
        const { tx, journalId, tenantId, performedById } = context;

        const ids = dto.selectedDocumentIds ?? [];
        if (ids.length === 0) return;

        let lastAccountId: string | null = null;

        for (const checkBillId of ids) {
            const checkBill = await tx.checkBill.findFirst({
                where: { id: checkBillId, tenantId, deletedAt: null },
            });

            if (!checkBill) throw new BadRequestException(`Evrak bulunamadı: ${checkBillId}`);

            assertLegalTransition(checkBill.status, CheckBillStatus.RETURNED);
            lastAccountId = checkBill.accountId;

            await tx.checkBill.update({
                where: { id: checkBillId },
                data: {
                    status: CheckBillStatus.RETURNED,
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
                    toStatus: CheckBillStatus.RETURNED,
                    journalId,
                    performedById,
                    notes: 'Evrak iade edildi',
                },
            });

            // Account Movement:
            // Eğer evrak Müşteri Evrakı ise (CREDIT) -> iade edince müşteri bize tekrar borçlanır -> DEBIT
            // Eğer evrak Kendi Evrakımız ise (DEBIT) -> iade gelince tedarikçiye borcumuz tekrar artar -> CREDIT
            const movementType = checkBill.portfolioType === 'CREDIT' ? DebitCredit.DEBIT : DebitCredit.CREDIT;

            await tx.accountMovement.create({
                data: {
                    tenantId,
                    accountId: checkBill.accountId,
                    type: movementType,
                    amount: checkBill.amount,
                    balance: new Prisma.Decimal(0),
                    documentType: DocumentType.RETURN,
                    documentNo: checkBill.checkNo || checkBill.serialNo || '-',
                    checkBillId,
                    date: dto.date ? new Date(dto.date) : new Date(),
                    notes: dto.notes || 'Evrak İade Edildi'
                }
            });
        }

        // Bakiye güncelleme
        if (lastAccountId) {
            await this.accountBalanceService.recalculateAccountBalance(lastAccountId, tx);
        }
    }
}
