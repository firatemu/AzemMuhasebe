import { Injectable, BadRequestException } from '@nestjs/common';
import { CheckBillStatus, LogAction, Prisma } from '@prisma/client';
import { IJournalHandler, JournalHandlerContext } from './journal-handler.interface';
import { CreateCheckBillJournalDto } from '../dto/create-check-bill-journal.dto';
import { assertLegalTransition } from '../utils/status-transition.util';
import { AccountBalanceService } from '../../account-balance/account-balance.service';

@Injectable()
export class EndorsementHandler implements IJournalHandler {
    constructor(private readonly accountBalanceService: AccountBalanceService) { }

    async handle(dto: CreateCheckBillJournalDto, context: JournalHandlerContext): Promise<void> {
        const { tx, journalId, tenantId, performedById } = context;

        if (!dto.selectedDocumentIds || dto.selectedDocumentIds.length === 0) return;
        if (!dto.accountId) throw new BadRequestException('Ciro edilecek cari (accountId) zorunludur.');

        for (const checkBillId of dto.selectedDocumentIds) {
            const checkBill = await tx.checkBill.findFirst({
                where: { id: checkBillId, tenantId, deletedAt: null },
            });

            if (!checkBill) throw new BadRequestException(`Evrak bulunamadı: ${checkBillId}`);

            assertLegalTransition(checkBill.status, CheckBillStatus.ENDORSED);

            // Ciro sekans hesapla
            const existingCount = await tx.checkBillEndorsement.count({
                where: { checkBillId },
            });
            const sequence = existingCount + 1;

            await tx.checkBillEndorsement.create({
                data: {
                    tenantId,
                    checkBillId,
                    sequence,
                    fromAccountId: checkBill.currentHolderId ?? checkBill.accountId,
                    toAccountId: dto.accountId!,
                    endorsedAt: new Date(dto.date),
                    journalId,
                },
            });

            await tx.checkBill.update({
                where: { id: checkBillId },
                data: {
                    status: CheckBillStatus.ENDORSED,
                    currentHolderId: dto.accountId,
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
                    toStatus: CheckBillStatus.ENDORSED,
                    journalId,
                    performedById,
                    notes: `Ciro sırası: ${sequence}`,
                },
            });

            // Eski cariye ters kayıt (borç silindi)
            await tx.accountMovement.create({
                data: {
                    tenantId,
                    accountId: checkBill.currentHolderId ?? checkBill.accountId,
                    type: 'CREDIT',
                    amount: checkBill.amount,
                    balance: new Prisma.Decimal(0),
                    documentType: 'CHECK_EXIT',
                    documentNo: checkBill.checkNo || checkBill.id,
                    checkBillId: checkBillId,
                    date: dto.date ? new Date(dto.date) : new Date(),
                    notes: dto.notes || undefined,
                }
            });

            // Yeni cariye borç kaydı (ciro alan)
            await tx.accountMovement.create({
                data: {
                    tenantId,
                    accountId: dto.accountId,
                    type: 'DEBIT',
                    amount: checkBill.amount,
                    balance: new Prisma.Decimal(0),
                    documentType: 'CHECK_ENTRY',
                    documentNo: checkBill.checkNo || checkBill.id,
                    checkBillId: checkBillId,
                    date: dto.date ? new Date(dto.date) : new Date(),
                    notes: dto.notes || undefined,
                }
            });
        }

        // Bakiye güncelleme (eski ve yeni cariler için)
        for (const checkBillId of dto.selectedDocumentIds) {
            const checkBill = await tx.checkBill.findFirst({
                where: { id: checkBillId, tenantId, deletedAt: null },
                select: { currentHolderId: true, accountId: true },
            });
            if (checkBill) {
                const oldAccountId = checkBill.currentHolderId ?? checkBill.accountId;
                if (oldAccountId) {
                    await this.accountBalanceService.recalculateAccountBalance(oldAccountId, tx);
                }
            }
        }
        if (dto.accountId) {
            await this.accountBalanceService.recalculateAccountBalance(dto.accountId, tx);
        }
    }
}
