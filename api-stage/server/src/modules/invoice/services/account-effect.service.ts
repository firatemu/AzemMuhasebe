import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { Prisma, DebitCredit, DocumentType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { resolveAccountMovementDirection } from '../helpers/movement-type.helper';
import { AccountMovementDirection, AccountMovementPayload, ReverseResult } from '../types/invoice-orchestrator.types';
import { SystemParameterService } from '../../system-parameter/system-parameter.service';
import { InvoiceType } from '../invoice.enums';
import { PrismaService } from '../../../common/prisma.service';

@Injectable()
export class AccountEffectService {
    private readonly logger = new Logger(AccountEffectService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly systemParameterService: SystemParameterService,
    ) { }

    /**
     * Fatura onaylandığında veya iptal edildiğinde cari etkileri uygular.
     */
    async applyAccountEffect(
        invoice: any, // Invoice with account
        tx: Prisma.TransactionClient,
        operationType: 'APPROVE' | 'CANCEL'
    ): Promise<AccountMovementPayload> {
        const tenantId = invoice.tenantId;

        // Cari risk kontrolü parametresini al
        const riskControlEnabled = await this.systemParameterService.getParameterAsBoolean(
            'CARI_RISK_CONTROL',
            false
        );

        const { direction, balanceOp } = resolveAccountMovementDirection(
            invoice.invoiceType as InvoiceType,
            operationType
        );

        // TRY cinsinden tutarı hesapla
        const exchangeRate = new Decimal(invoice.exchangeRate || 1);
        const amountTry = new Decimal(invoice.grandTotal).mul(exchangeRate);

        // Hesabı bul ve kilitle (Pessimistic locking via select for update if possible, but Prisma doesn't support it directly in a clean way easily, increment/decrement is better)
        const account = await tx.account.findUnique({
            where: { id: invoice.accountId },
        });

        if (!account) {
            throw new BadRequestException('Account not found');
        }

        // Risk kontrolü (Sadece onay anında ve borç (DEBIT) yönünde kontrol edilir)
        if (riskControlEnabled && operationType === 'APPROVE' && direction === AccountMovementDirection.DEBIT) {
            const currentBalance = new Decimal(account.balance);
            const limit = new Decimal(account.creditLimit || 0);

            if (limit.gt(0) && currentBalance.add(amountTry).gt(limit)) {
                throw new BadRequestException(`Credit limit exceeded for account: ${account.title}. Limit: ${limit}, Potential Balance: ${currentBalance.add(amountTry)}`);
            }
        }

        // Bakiyeyi güncelle
        const updatedAccount = await tx.account.update({
            where: { id: invoice.accountId },
            data: {
                balance: {
                    [balanceOp]: amountTry,
                },
            },
        });

        // Cari hareket kaydı oluştur
        await tx.accountMovement.create({
            data: {
                tenant: { connect: { id: tenantId! } },
                account: { connect: { id: invoice.accountId } },
                type: direction === AccountMovementDirection.DEBIT ? DebitCredit.DEBIT : DebitCredit.CREDIT,
                amount: invoice.grandTotal, // Orijinal döviz tutarı
                balance: updatedAccount.balance, // Güncel TRY bakiyesi
                documentType: DocumentType.INVOICE,
                documentNo: invoice.invoiceNo,
                invoice: { connect: { id: invoice.id } },
                notes: invoice.notes?.trim() || `Fatura: ${invoice.invoiceNo}`,
                recordType: operationType === 'CANCEL' ? 'CANCEL_REVERSAL' : 'NORMAL',
            },
        });

        return {
            accountId: invoice.accountId,
            amount: invoice.grandTotal,
            direction,
            invoiceId: invoice.id,
            documentType: 'INVOICE',
            documentNo: invoice.invoiceNo,
            date: invoice.date,
            tenantId,
        };
    }

    /**
     * Mevcut cari etkileri tersine çevirir (UPDATE senaryosu için).
     */
    async reverseAccountEffect(
        invoiceId: string,
        tenantId: string,
        tx: Prisma.TransactionClient,
        isDraftRevert: boolean = false
    ): Promise<ReverseResult> {
        // Faturaya ait henüz tersi alınmamış cari hareketleri bul
        const originalMovements = await tx.accountMovement.findMany({
            where: {
                invoiceId,
                tenantId,
                isReversed: false,
                deletedAt: null,
            },
            include: {
                invoice: true,
            }
        });

        if (originalMovements.length === 0) {
            return { stockMovementsReversed: 0, accountMovementReversed: false };
        }

        for (const mov of originalMovements) {
            // Orijinal hareket yönünün tersini belirle
            const reverseType = mov.type === DebitCredit.DEBIT ? DebitCredit.CREDIT : DebitCredit.DEBIT;
            const balanceOp = reverseType === DebitCredit.DEBIT ? 'increment' : 'decrement';

            // Orijinal TRY tutarını hesapla (O anki kur ile)
            const exchangeRate = new Decimal(mov.invoice?.exchangeRate || 1);
            const amountTry = new Decimal(mov.amount).mul(exchangeRate);

            // Bakiyeyi geri al
            const updatedAccount = await tx.account.update({
                where: { id: mov.accountId },
                data: {
                    balance: {
                        [balanceOp]: amountTry,
                    },
                },
            });

            if (isDraftRevert) {
                // Taslağa dönüldüğünde ters kayıt atmak yerine orijinal hareketi soft-delete yap
                await tx.accountMovement.update({
                    where: { id: mov.id },
                    data: { deletedAt: new Date() }
                });
            } else {
                // İptal vb durumlarda Ters cari kayıt oluştur
                await tx.accountMovement.create({
                    data: {
                        tenant: { connect: { id: tenantId } },
                        account: { connect: { id: mov.accountId } },
                        type: reverseType,
                        amount: mov.amount,
                        balance: updatedAccount.balance,
                        documentType: mov.documentType,
                        documentNo: mov.documentNo,
                        invoice: mov.invoiceId ? { connect: { id: mov.invoiceId } } : undefined,
                        notes: `Reversal of movement ${mov.id}`,
                        isReversed: true,
                        reversalOf: { connect: { id: mov.id } },
                        isReversal: true,
                        recordType: 'UPDATE_REVERSAL',
                    },
                });

                // Orijinal kaydı tersi alınmış olarak işaretle
                await tx.accountMovement.update({
                    where: { id: mov.id },
                    data: { isReversed: true },
                });
            }
        }

        return {
            stockMovementsReversed: 0,
            accountMovementReversed: true,
        };
    }
}
