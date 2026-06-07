import { Injectable, Logger } from '@nestjs/common';
import { Prisma, InvoiceStatus, DebitCredit } from '@prisma/client';
import { PrismaService } from '../../../common/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

export interface ReconciliationReport {
    invoiceId: string;
    isConsistent: boolean;
    errors: string[];
    details: {
        invoiceTotal: Decimal;
        accountMovementAmount: Decimal;
        itemConsistency: Array<{
            productId: string;
            invoiceQty: number;
            movementQty: number;
            isConsistent: boolean;
        }>;
    };
}

@Injectable()
export class ReconciliationService {
    private readonly logger = new Logger(ReconciliationService.name);

    constructor(private readonly prisma: PrismaService) { }

    /**
     * Belirli bir faturanın stok ve cari hareketleri ile tutarlılığını kontrol eder.
     */
    async verifyInvoiceConsistency(invoiceId: string, tenantId: string): Promise<ReconciliationReport> {
        const invoice = await this.prisma.invoice.findUnique({
            where: { id: invoiceId, tenantId },
            include: {
                items: true,
                accountMovements: {
                    where: { isReversed: false, deletedAt: null }
                }
            }
        });

        if (!invoice) {
            throw new Error('Invoice not found');
        }

        const errors: string[] = [];
        const report: ReconciliationReport = {
            invoiceId,
            isConsistent: true,
            errors: [],
            details: {
                invoiceTotal: new Decimal(invoice.grandTotal),
                accountMovementAmount: new Decimal(0),
                itemConsistency: []
            }
        };

        // 1. Durum Kontrolü
        if (invoice.status === InvoiceStatus.OPEN || invoice.status === InvoiceStatus.DRAFT) {
            // Açık faturaların hareketi olması beklenmez
            const hasAccountMovements = invoice.accountMovements.length > 0;
            if (hasAccountMovements) {
                errors.push('OPEN/DRAFT faturanın cari hareketi mevcut (Tutarsız)');
            }
            return { ...report, isConsistent: errors.length === 0, errors };
        }

        // 2. Cari Tutarlılık Kontrolü (APPROVED/CANCELLED için)
        const expectedCariAmount = new Decimal(invoice.grandTotal);
        const actualCariAmount = invoice.accountMovements.reduce(
            (acc, mov) => acc.add(new Decimal(mov.amount)),
            new Decimal(0)
        );

        report.details.accountMovementAmount = actualCariAmount;

        if (!expectedCariAmount.equals(actualCariAmount)) {
            errors.push(`Cari tutar tutarsız: Beklenen ${expectedCariAmount}, Gerçekleşen ${actualCariAmount}`);
        }

        // 3. Stok Tutarlılık Kontrolü (Kalem bazlı)
        for (const item of invoice.items) {
            const movements = await this.prisma.productMovement.findMany({
                where: {
                    invoiceItemId: item.id,
                    isReversed: false,
                    deletedAt: null
                }
            });

            const totalMovedQty = movements.reduce(
                (acc, mov) => acc + Math.abs(mov.quantity),
                0
            );

            const isConsistent = totalMovedQty === item.quantity;
            report.details.itemConsistency.push({
                productId: item.productId,
                invoiceQty: item.quantity,
                movementQty: totalMovedQty,
                isConsistent
            });

            if (!isConsistent) {
                errors.push(`Stok miktarı tutarsız: Ürün ${item.productId}, Fatura ${item.quantity}, Hareket ${totalMovedQty}`);
            }
        }

        report.isConsistent = errors.length === 0;
        report.errors = errors;

        // Mutabakat günlüğü yaz
        await this.prisma.reconciliationLog.create({
            data: {
                tenantId,
                invoiceId,
                checkType: 'INVOICE',
                isConsistent: report.isConsistent,
                discrepancyData: report.isConsistent ? null : (report as any),
            }
        });

        return report;
    }

    /**
     * Bir kiracının tüm onaylı faturalarını tarar ve mutabakat raporu oluşturur.
     */
    async runFullTenantReconciliation(tenantId: string): Promise<any> {
        const approvedInvoices = await this.prisma.invoice.findMany({
            where: {
                tenantId,
                status: InvoiceStatus.APPROVED,
                deletedAt: null
            },
            select: { id: true }
        });

        this.logger.log(`Starting full reconciliation for tenant ${tenantId}. Found ${approvedInvoices.length} invoices.`);

        let inconsistentCount = 0;
        for (const inv of approvedInvoices) {
            const report = await this.verifyInvoiceConsistency(inv.id, tenantId);
            if (!report.isConsistent) inconsistentCount++;
        }

        return {
            totalChecked: approvedInvoices.length,
            inconsistentCount,
            scanFinishedAt: new Date()
        };
    }

    /**
     * Hatalı cari bakiyesini hareketlerden yola çıkarak onarır.
     * [!] Kritik İşlem: Sadece Admin veya Sistem yetkisiyle çalışmalıdır.
     */
    async repairAccountBalance(accountId: string, tenantId: string): Promise<{ previousBalance: Decimal; newBalance: Decimal }> {
        const account = await this.prisma.account.findUnique({
            where: { id: accountId }
        });

        if (!account) throw new Error('Account not found');

        // Tüm (silinmemiş ve tersi alınmamış) hareketleri topla
        const movements = await this.prisma.accountMovement.findMany({
            where: { accountId, tenantId, deletedAt: null, isReversed: false }
        });

        let calculatedBalance = new Decimal(0);
        for (const mov of movements) {
            const exchangeRate = new Decimal(1); // Normalde invoice/document üzerinden kur çekilmeli
            // Basitleştirilmiş: DEBIT (+), CREDIT (-)
            if (mov.type === DebitCredit.DEBIT) {
                calculatedBalance = calculatedBalance.add(new Decimal(mov.amount).mul(exchangeRate));
            } else {
                calculatedBalance = calculatedBalance.sub(new Decimal(mov.amount).mul(exchangeRate));
            }
        }

        const previousBalance = new Decimal(account.balance);

        if (!previousBalance.equals(calculatedBalance)) {
            await this.prisma.account.update({
                where: { id: accountId },
                data: { balance: calculatedBalance }
            });

            await this.prisma.reconciliationLog.create({
                data: {
                    tenantId,
                    accountId,
                    checkType: 'ACCOUNT',
                    isConsistent: false,
                    discrepancyData: { previousBalance, newBalance: calculatedBalance, note: 'Balance repaired' } as any
                }
            });
        }

        return { previousBalance, newBalance: calculatedBalance };
    }
}
