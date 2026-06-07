import { Injectable } from '@nestjs/common';
import { CheckBillStatus, LogAction, Prisma } from '@prisma/client';
import { IJournalHandler, JournalHandlerContext } from './journal-handler.interface';
import { CreateCheckBillJournalDto } from '../dto/create-check-bill-journal.dto';
import { AccountBalanceService } from '../../account-balance/account-balance.service';

@Injectable()
export class CreditEntryHandler implements IJournalHandler {
    constructor(private readonly accountBalanceService: AccountBalanceService) { }

    async handle(dto: CreateCheckBillJournalDto, context: JournalHandlerContext): Promise<void> {
        const { tx, journalId, tenantId, performedById } = context;

        if (!dto.newDocuments || dto.newDocuments.length === 0) return;

        for (const docDto of dto.newDocuments) {
            const checkBill = await tx.checkBill.create({
                data: {
                    tenantId,
                    type: docDto.type,
                    portfolioType: 'CREDIT',
                    accountId: dto.accountId!,
                    amount: docDto.amount,
                    remainingAmount: docDto.amount,
                    dueDate: new Date(docDto.dueDate),
                    bank: docDto.bank,
                    branch: docDto.branch,
                    accountNo: docDto.accountNo,
                    checkNo: docDto.checkNo,
                    status: CheckBillStatus.IN_PORTFOLIO,
                    notes: docDto.notes,
                    currentHolderId: dto.accountId,
                    lastJournalId: journalId,
                },
            });

            await tx.checkBillJournalItem.create({
                data: { tenantId, journalId, checkBillId: checkBill.id },
            });

            await tx.checkBillLog.create({
                data: {
                    tenantId,
                    checkBillId: checkBill.id,
                    actionType: LogAction.CREATE,
                    fromStatus: null,
                    toStatus: CheckBillStatus.IN_PORTFOLIO,
                    journalId,
                    performedById,
                    notes: 'Müşteri evrak girişi',
                },
            });

            await tx.accountMovement.create({
                data: {
                    tenantId,
                    accountId: checkBill.accountId,
                    type: 'DEBIT',
                    amount: checkBill.amount,
                    balance: new Prisma.Decimal(0),
                    documentType: 'CHECK_ENTRY',
                    documentNo: checkBill.checkNo || checkBill.id,
                    checkBillId: checkBill.id,
                    date: dto.date ? new Date(dto.date) : new Date(),
                    notes: dto.notes || undefined,
                }
            });
        }

        // Bakiye güncelleme
        if (dto.accountId) {
            await this.accountBalanceService.recalculateAccountBalance(dto.accountId, tx);
        }
    }
}
