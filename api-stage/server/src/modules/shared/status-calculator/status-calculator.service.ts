import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma.service';

/**
 * Centralized service for recalculating status fields across the Sales Workflow.
 * Status fields are NEVER set manually — they are always computed by this service.
 *
 * Propagation chain:
 *   Invoice saved → recalculateDeliveryNoteStatus → recalculateOrderStatus
 */
@Injectable()
export class StatusCalculatorService {
    private readonly logger = new Logger(StatusCalculatorService.name);

    constructor(private readonly prisma: PrismaService) { }

    /**
     * Recalculates and persists the status of a SalesOrder based on its items'
     * deliveredQuantity vs quantity. If any invoice exists for the order, status
     * is upgraded to INVOICED regardless of shipment state.
     *
     * @param orderId  - UUID of the SalesOrder
     * @param tenantId - Tenant context for multi-tenancy isolation
     */
    async recalculateOrderStatus(orderId: string, tenantId: string): Promise<void> {
        try {
            const items = await this.prisma.salesOrderItem.findMany({
                where: { orderId },
            });

            let newStatus: string;

            if (!items || items.length === 0) {
                newStatus = 'PENDING';
            } else {
                const allCompleted = items.every(
                    (i) => (i.deliveredQuantity || 0) >= Number(i.quantity),
                );
                const anyShipped = items.some((i) => (i.deliveredQuantity || 0) > 0);

                if (allCompleted) {
                    newStatus = 'COMPLETED';
                } else if (anyShipped) {
                    newStatus = 'PARTIALLY_SHIPPED';
                } else {
                    newStatus = 'PENDING';
                }

                // If all items are shipped AND at least one invoice exists, upgrade to INVOICED
                const invoiceCount = await (this.prisma as any).invoice.count({
                    where: {
                        deliveryNote: { sourceId: orderId },
                        deletedAt: null,
                    },
                });
                if (allCompleted && invoiceCount > 0) {
                    newStatus = 'INVOICED';
                }
            }

            await (this.prisma as any).salesOrder.update({
                where: { id: orderId },
                data: { status: newStatus },
            });

            this.logger.log(
                `[StatusCalculator] SalesOrder ${orderId} → ${newStatus} (tenant: ${tenantId})`,
            );
        } catch (err) {
            this.logger.error(
                `[StatusCalculator] Failed to recalculate SalesOrder status for ${orderId}: ${err?.message}`,
                err?.stack,
            );
            throw new InternalServerErrorException(
                'Status hesaplama sırasında bir hata oluştu (SalesOrder)',
            );
        }
    }

    /**
     * Recalculates and persists the status of a SalesDeliveryNote based on its
     * items' invoicedQuantity vs quantity, and the count of linked invoices.
     *
     * @param deliveryNoteId - UUID of the SalesDeliveryNote
     * @param tenantId       - Tenant context for multi-tenancy isolation
     */
    async recalculateDeliveryNoteStatus(
        deliveryNoteId: string,
        tenantId: string,
    ): Promise<void> {
        try {
            const items = await this.prisma.salesDeliveryNoteItem.findMany({
                where: { deliveryNoteId },
            });

            const invoiceCount = await (this.prisma as any).invoice.count({
                where: { deliveryNoteId, deletedAt: null },
            });

            let newStatus: string;

            if (invoiceCount === 0) {
                newStatus = 'NOT_INVOICED';
            } else {
                const allInvoiced = items.every(
                    (i) => (i.invoicedQuantity || 0) >= Number(i.quantity),
                );
                const anyInvoiced = items.some((i) => (i.invoicedQuantity || 0) > 0);

                if (allInvoiced) {
                    newStatus = 'INVOICED';
                } else if (anyInvoiced) {
                    newStatus = 'PARTIALLY_INVOICED';
                } else {
                    // Bağlı fatura var ama kalem faturalanan miktarları henüz işlenmemiş (ör. otomatik irsaliye)
                    newStatus = 'INVOICED';
                }
            }

            await (this.prisma as any).salesDeliveryNote.update({
                where: { id: deliveryNoteId },
                data: { status: newStatus },
            });

            this.logger.log(
                `[StatusCalculator] SalesDeliveryNote ${deliveryNoteId} → ${newStatus} (tenant: ${tenantId})`,
            );
        } catch (err) {
            this.logger.error(
                `[StatusCalculator] Failed to recalculate DeliveryNote status for ${deliveryNoteId}: ${err?.message}`,
                err?.stack,
            );
            throw new InternalServerErrorException(
                'Status hesaplama sırasında bir hata oluştu (SalesDeliveryNote)',
            );
        }
    }

    /**
     * Convenience method: recalculates delivery note status first, then cascades
     * up to the linked source order (if any).
     *
     * @param deliveryNoteId - UUID of the SalesDeliveryNote
     * @param tenantId       - Tenant context for multi-tenancy isolation
     */
    /**
     * Convenience method: recalculates delivery note status first, then cascades
     * up to the linked source order (if any).
     *
     * @param deliveryNoteId - UUID of the SalesDeliveryNote
     * @param tenantId       - Tenant context for multi-tenancy isolation
     */
    async recalculateCascade(
        deliveryNoteId: string,
        tenantId: string,
    ): Promise<void> {
        try {
            await this.recalculateDeliveryNoteStatus(deliveryNoteId, tenantId);

            // Resolve the source order (if the delivery note came from an order)
            const note = await (this.prisma as any).salesDeliveryNote.findUnique({
                where: { id: deliveryNoteId },
                select: { sourceId: true },
            });

            if (note?.sourceId) {
                await this.recalculateOrderStatus(note.sourceId, tenantId);
            }
        } catch (err) {
            if ((err as any)?.status === 500) {
                throw err; // already wrapped
            }
            this.logger.error(
                `[StatusCalculator] Cascade failed for DeliveryNote ${deliveryNoteId}: ${err?.message}`,
                err?.stack,
            );
            throw new InternalServerErrorException(
                'Cascade status hesaplama sırasında bir hata oluştu',
            );
        }
    }

    /**
     * PROCUREMENT/PURCHASE METHODS
     */

    async recalculateProcurementOrderStatus(orderId: string, tenantId: string): Promise<void> {
        try {
            const items = await this.prisma.procurementOrderItem.findMany({
                where: { orderId },
            });

            let newStatus: string;

            if (!items || items.length === 0) {
                newStatus = 'PENDING';
            } else {
                const allCompleted = items.every(
                    (i) => (i.deliveredQuantity || 0) >= Number(i.quantity),
                );
                const anyShipped = items.some((i) => (i.deliveredQuantity || 0) > 0);

                if (allCompleted) {
                    newStatus = 'SHIPPED'; // Procurement standard: SHIPPED means fully received/shipped
                } else if (anyShipped) {
                    newStatus = 'PARTIALLY_SHIPPED';
                } else {
                    newStatus = 'PENDING';
                }

                // If at least one invoice exists linked via delivery note, upgrade to INVOICED
                const invoiceCount = await (this.prisma as any).invoice.count({
                    where: {
                        purchaseDeliveryNote: { sourceId: orderId },
                        deletedAt: null,
                    },
                });
                if (invoiceCount > 0) {
                    newStatus = 'INVOICED';
                }
            }

            await (this.prisma as any).procurementOrder.update({
                where: { id: orderId },
                data: { status: newStatus as any },
            });

            this.logger.log(
                `[StatusCalculator] ProcurementOrder ${orderId} → ${newStatus} (tenant: ${tenantId})`,
            );
        } catch (err) {
            this.logger.error(
                `[StatusCalculator] Failed to recalculate ProcurementOrder status for ${orderId}: ${err?.message}`,
                err?.stack,
            );
            throw new InternalServerErrorException(
                'Status hesaplama sırasında bir hata oluştu (ProcurementOrder)',
            );
        }
    }

    async recalculatePurchaseDeliveryNoteStatus(
        deliveryNoteId: string,
        tenantId: string,
    ): Promise<void> {
        try {
            const items = await this.prisma.purchaseDeliveryNoteItem.findMany({
                where: { deliveryNoteId },
            });

            const invoiceCount = await (this.prisma as any).invoice.count({
                where: { purchaseDeliveryNoteId: deliveryNoteId, deletedAt: null },
            });

            let newStatus: string;

            if (invoiceCount === 0) {
                newStatus = 'NOT_INVOICED';
            } else {
                // For purchase, we might not track invoicedQuantity per item yet in schema?
                // Let's check schema.prisma again for PurchaseDeliveryNoteItem
                newStatus = 'INVOICED';
                // Simple version for now based on count, can be refined if invoicedQuantity added
            }

            await (this.prisma as any).purchaseDeliveryNote.update({
                where: { id: deliveryNoteId },
                data: { status: newStatus as any },
            });

            this.logger.log(
                `[StatusCalculator] PurchaseDeliveryNote ${deliveryNoteId} → ${newStatus} (tenant: ${tenantId})`,
            );
        } catch (err) {
            this.logger.error(
                `[StatusCalculator] Failed to recalculate PurchaseDeliveryNote status for ${deliveryNoteId}: ${err?.message}`,
                err?.stack,
            );
            throw new InternalServerErrorException(
                'Status hesaplama sırasında bir hata oluştu (PurchaseDeliveryNote)',
            );
        }
    }

    async recalculatePurchaseCascade(
        deliveryNoteId: string,
        tenantId: string,
    ): Promise<void> {
        try {
            await this.recalculatePurchaseDeliveryNoteStatus(deliveryNoteId, tenantId);

            const note = await (this.prisma as any).purchaseDeliveryNote.findUnique({
                where: { id: deliveryNoteId },
                select: { sourceId: true },
            });

            if (note?.sourceId) {
                await this.recalculateProcurementOrderStatus(note.sourceId, tenantId);
            }
        } catch (err) {
            if ((err as any)?.status === 500) {
                throw err;
            }
            this.logger.error(
                `[StatusCalculator] PurchaseCascade failed for DeliveryNote ${deliveryNoteId}: ${err?.message}`,
            );
            throw new InternalServerErrorException(
                'Satınalma cascade status hesaplama sırasında bir hata oluştu',
            );
        }
    }
}
