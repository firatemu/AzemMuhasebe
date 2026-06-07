import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { Prisma, InvoiceStatus } from '@prisma/client';
import { PrismaService } from '../../../common/prisma.service';
import { StockEffectService, InvoiceWithItems } from './stock-effect.service';
import { AccountEffectService } from './account-effect.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { InvoiceOperationType, InvoiceOperationContext } from '../types/invoice-orchestrator.types';
import { InvoiceType } from '../invoice.enums';
@Injectable()
export class InvoiceOrchestratorService {
    private readonly logger = new Logger(InvoiceOrchestratorService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly stockEffectService: StockEffectService,
        private readonly accountEffectService: AccountEffectService,
        @InjectQueue('invoice-effects') private readonly effectsQueue: Queue,
    ) { }

    /**
     * Faturayı onaylar ve etkilerini (stok/cari) uygular.
     */
    async approveInvoice(invoiceId: string, context: InvoiceOperationContext): Promise<void> {
        const invoice = await this.prisma.invoice.findUnique({
            where: { id: invoiceId, tenantId: context.tenantId },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                unitRef: {
                                    include: {
                                        unitSet: {
                                            include: { units: true }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                account: true
            }
        });

        if (!invoice) throw new BadRequestException('Invoice not found');
        if (invoice.status === InvoiceStatus.APPROVED) {
            this.logger.log(`Invoice ${invoiceId} is already approved. Skipping.`);
            return;
        }

        try {
            await this.prisma.$transaction(async (tx) => {
                // 1. Stok etkilerini uygula
                await this.stockEffectService.applyStockEffects(invoice as any, tx, 'APPROVE');

                // 2. Cari etkilerini uygula
                await this.accountEffectService.applyAccountEffect(invoice, tx, 'APPROVE');

                // 3. Fatura durumunu güncelle
                await tx.invoice.update({
                    where: { id: invoiceId },
                    data: {
                        status: InvoiceStatus.APPROVED,
                        updatedBy: context.userId,
                    }
                });

                // 4. Log yaz
                await tx.invoiceLog.create({
                    data: {
                        tenantId: context.tenantId,
                        invoiceId,
                        userId: context.userId,
                        actionType: 'APPROVE' as any,
                        changes: JSON.stringify({ previousStatus: invoice.status, newStatus: InvoiceStatus.APPROVED }),
                    }
                });
            });

            // İşlem sonrası asenkron görevleri kuyruğa ekle
            await this.addPostProcessingJobs(invoiceId, context.tenantId);

        } catch (error) {
            this.logger.error(`Approval failed for invoice ${invoiceId}: ${error.message}`, error.stack);
            throw error;
        }
    }

    /**
     * Faturayı iptal eder ve etkilerini (stok/cari) tersine çevirir.
     */
    async cancelInvoice(invoiceId: string, context: InvoiceOperationContext, reason?: string): Promise<void> {
        const invoice = await this.prisma.invoice.findUnique({
            where: { id: invoiceId, tenantId: context.tenantId },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                unitRef: {
                                    include: {
                                        unitSet: {
                                            include: { units: true }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                account: true
            }
        });

        if (!invoice) throw new BadRequestException('Invoice not found');
        if (invoice.status === InvoiceStatus.CANCELLED) {
            this.logger.log(`Invoice ${invoiceId} is already cancelled. Skipping.`);
            return;
        }

        // İş kuralı: Sadece APPROVED faturaların etkileri (stok/cari) ters çevrilir.
        // OPEN faturanın etkisi henüz yoktur.
        const hasEffects = invoice.status === InvoiceStatus.APPROVED;

        try {
            await this.prisma.$transaction(async (tx) => {
                if (hasEffects) {
                    // Cari etkisi her zaman ters çevrilir (CANCEL yönde kayıt atılır)
                    await this.accountEffectService.applyAccountEffect(invoice, tx, 'CANCEL');

                    // Stok etkisi: SADECE iade faturalarında (IADE) ters kayıt (stok düzeltme) yapılır.
                    // SATIS/ALIS faturalarında iptal anında stok hareketi oluşmaz (ERP kuralı).
                    const isReturnInvoice = [InvoiceType.SALES_RETURN, InvoiceType.PURCHASE_RETURN].includes(invoice.invoiceType as any);
                    if (isReturnInvoice) {
                        await this.stockEffectService.applyStockEffects(invoice as any, tx, 'CANCEL');
                    }
                }

                // Fatura durumunu güncelle
                await tx.invoice.update({
                    where: { id: invoiceId },
                    data: {
                        status: InvoiceStatus.CANCELLED,
                        updatedBy: context.userId,
                        notes: reason ? `${invoice.notes || ''}\nİptal Nedeni: ${reason}` : invoice.notes
                    }
                });

                await tx.invoiceLog.create({
                    data: {
                        tenantId: context.tenantId,
                        invoiceId,
                        userId: context.userId,
                        actionType: 'CANCEL' as any,
                        changes: JSON.stringify({ reason }),
                    }
                });
            });

            if (hasEffects) {
                await this.addPostProcessingJobs(invoiceId, context.tenantId);
            }

        } catch (error) {
            this.logger.error(`Cancellation failed for invoice ${invoiceId}: ${error.message}`, error.stack);
            throw error;
        }
    }

    /**
     * Fatura kalemleri güncellendiğinde etkileri senkronize eder.
     */
    async updateInvoiceItems(invoiceId: string, context: InvoiceOperationContext): Promise<void> {
        const tenantId = context.tenantId;

        try {
            await this.prisma.$transaction(async (tx) => {
                // 1. Mevcut stok etkilerini geri al (Reverse)
                await this.stockEffectService.reverseStockEffects(invoiceId, tenantId, tx);

                // 2. Mevcut cari etkilerini geri al (Reverse)
                await this.accountEffectService.reverseAccountEffect(invoiceId, tenantId, tx);

                // 3. Güncel fatura verisini al (Yeniden yükle)
                const updatedInvoice = await tx.invoice.findUnique({
                    where: { id: invoiceId, tenantId },
                    include: {
                        items: {
                            include: {
                                product: {
                                    include: {
                                        unitRef: {
                                            include: {
                                                unitSet: {
                                                    include: { units: true }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        account: true
                    }
                });

                if (!updatedInvoice) throw new Error('Invoice vanished during transaction');

                // 4. Yeni etkileri uygula (APPROVED ise)
                if (updatedInvoice.status === InvoiceStatus.APPROVED) {
                    await this.stockEffectService.applyStockEffects(updatedInvoice as any, tx, 'APPROVE');
                    await this.accountEffectService.applyAccountEffect(updatedInvoice, tx, 'APPROVE');
                }
            });

            await this.addPostProcessingJobs(invoiceId, tenantId);

        } catch (error) {
            this.logger.error(`Syncing effects failed for invoice ${invoiceId}: ${error.message}`, error.stack);
            throw error;
        }
    }

    /**
     * Kuyruklara iş ekler (Maliyet hesaplama ve mutabakat).
     */
    private async addPostProcessingJobs(invoiceId: string, tenantId: string): Promise<void> {
        await this.effectsQueue.add('COSTING_RECALCULATE', { invoiceId, tenantId }, {
            removeOnComplete: true,
            attempts: 3,
            backoff: { type: 'exponential', delay: 5000 }
        });

        await this.effectsQueue.add('RECONCILIATION_CHECK', { invoiceId, tenantId }, {
            removeOnComplete: true,
            delay: 10000 // Veritabanı tutarlılığını biraz bekleyip kontrol et
        });
    }
}
