import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { CostingService } from '../../costing/costing.service';
import { ReconciliationService } from '../services/reconciliation.service';
import { PrismaService } from '../../../common/prisma.service';

@Processor('invoice-effects')
export class InvoiceEffectsProcessor extends WorkerHost {
    private readonly logger = new Logger(InvoiceEffectsProcessor.name);

    constructor(
        private readonly costingService: CostingService,
        private readonly reconciliationService: ReconciliationService,
        private readonly prisma: PrismaService,
    ) {
        super();
        console.log('--- INVOICE EFFECTS PROCESSOR INITIALIZED (v2 - Path Fixed) ---');
    }

    async process(job: Job<any, any, string>): Promise<any> {
        const { invoiceId, tenantId } = job.data;

        switch (job.name) {
            case 'COSTING_RECALCULATE':
                return this.handleCostingRecalculate(invoiceId, tenantId);

            case 'RECONCILIATION_CHECK':
                return this.handleReconciliationCheck(invoiceId, tenantId);

            default:
                this.logger.warn(`Unknown job name: ${job.name}`);
                return null;
        }
    }

    private async handleCostingRecalculate(invoiceId: string, tenantId: string) {
        this.logger.log(`Processing costing recalculation for invoice: ${invoiceId}`);

        // Fatura kalemlerindeki benzersiz ürünleri bul
        const items = await this.prisma.invoiceItem.findMany({
            where: { invoiceId, tenantId },
            select: { productId: true },
            distinct: ['productId'],
        });

        for (const item of items) {
            try {
                await this.costingService.calculateWeightedAverageCost(item.productId);
                this.logger.log(`Costing updated for product: ${item.productId}`);
            } catch (error) {
                this.logger.error(`Costing failed for product ${item.productId}: ${error.message}`);
            }
        }
    }

    private async handleReconciliationCheck(invoiceId: string, tenantId: string) {
        this.logger.log(`Processing reconciliation check for invoice: ${invoiceId}`);

        try {
            const report = await this.reconciliationService.verifyInvoiceConsistency(invoiceId, tenantId);

            if (!report.isConsistent) {
                this.logger.warn(`Inconsistency detected in invoice ${invoiceId}: ${report.errors.join(', ')}`);

                // Eğer cari tutarı tutarsızsa, opsiyonel olarak bakiye onarımı tetiklenebilir
                // Şimdilik sadece logluyoruz.
            } else {
                this.logger.log(`Invoice ${invoiceId} is consistent.`);
            }

            return report;
        } catch (error) {
            this.logger.error(`Reconciliation check failed for invoice ${invoiceId}: ${error.message}`);
            throw error;
        }
    }
}
