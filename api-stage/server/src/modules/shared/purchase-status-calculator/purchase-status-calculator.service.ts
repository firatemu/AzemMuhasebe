import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma.service';
import { OrderStatus, DeliveryNoteStatus } from '@prisma/client';

/**
 * Centralized service for recalculating status fields across the Purchase Workflow.
 * Status fields are NEVER set manually — they are always computed by this service.
 */
@Injectable()
export class PurchaseStatusCalculatorService {
    private readonly logger = new Logger(PurchaseStatusCalculatorService.name);

    constructor(private readonly prisma: PrismaService) { }

    /**
     * Recalculates and persists PurchaseOrder.status based on receivedQuantity
     * across all PurchaseOrderItems.
     */
    async recalculateOrderStatus(orderId: string, tenantId: string): Promise<void> {
        try {
            const items = await this.prisma.procurementOrderItem.findMany({
                where: { orderId },
            });

            let newStatus: OrderStatus;

            if (!items || items.length === 0) {
                newStatus = OrderStatus.PENDING;
            } else {
                const allPending = items.every((i) => ((i as any).receivedQuantity || 0) === 0);
                const allCompleted = items.every((i) => ((i as any).receivedQuantity || 0) >= Number(i.quantity));

                if (allPending) {
                    newStatus = OrderStatus.PENDING;
                } else if (allCompleted) {
                    newStatus = OrderStatus.COMPLETED;
                } else {
                    newStatus = OrderStatus.PARTIAL;
                }
            }

            await this.prisma.procurementOrder.update({
                where: { id: orderId, tenantId },
                data: { status: newStatus as any },
            });

            this.logger.log(`[PurchaseStatusCalculator] ProcurementOrder ${orderId} -> ${newStatus} (tenant: ${tenantId})`);
        } catch (err) {
            this.logger.error(
                `[PurchaseStatusCalculator] Failed to recalculate ProcurementOrder status for ${orderId}: ${err?.message}`,
                err?.stack,
            );
            throw new InternalServerErrorException('Status hesaplama sırasında bir hata oluştu (ProcurementOrder)');
        }
    }

    /**
     * Recalculates and persists each PurchaseOrderItem.status based on
     * receivedQuantity vs orderedQuantity.
     */
    async recalculateOrderItemStatuses(orderId: string, tenantId: string): Promise<void> {
        try {
            const items = await this.prisma.procurementOrderItem.findMany({
                where: { orderId },
            });

            if (!items || items.length === 0) return;

            const updates = items.map((item) => {
                let newStatus: 'PENDING' | 'PARTIAL' | 'COMPLETED';
                const received = (item as any).receivedQuantity || 0;
                const ordered = Number(item.quantity);

                if (received === 0) {
                    newStatus = 'PENDING';
                } else if (received >= ordered) {
                    newStatus = 'COMPLETED';
                } else {
                    newStatus = 'PARTIAL';
                }

                return (this.prisma.procurementOrderItem as any).update({
                    where: { id: item.id },
                    data: { status: newStatus as any },
                });
            });

            await this.prisma.$transaction(updates);

            this.logger.log(`[PurchaseStatusCalculator] ProcurementOrderItems recalculated for order ${orderId} (tenant: ${tenantId})`);
        } catch (err) {
            this.logger.error(
                `[PurchaseStatusCalculator] Failed to recalculate ProcurementOrderItem statuses for ${orderId}: ${err?.message}`,
                err?.stack,
            );
            throw new InternalServerErrorException('Status hesaplama sırasında bir hata oluştu (ProcurementOrderItem)');
        }
    }

    /**
     * Recalculates and persists PurchaseDeliveryNote.status based on
     * whether a non-cancelled invoice exists for this delivery note.
     */
    async recalculateDeliveryNoteStatus(deliveryNoteId: string, tenantId: string): Promise<void> {
        try {
            // Find First valid invoice for this delivery note
            const invoice = await this.prisma.invoice.findFirst({
                where: {
                    purchaseDeliveryNoteId: deliveryNoteId,
                    tenantId,
                    status: { not: 'CANCELLED' },
                    deletedAt: null
                },
            });

            // 1:1 mapping constraint
            const newStatus = invoice ? DeliveryNoteStatus.INVOICED : DeliveryNoteStatus.NOT_INVOICED;

            await this.prisma.purchaseDeliveryNote.update({
                where: { id: deliveryNoteId, tenantId },
                data: { status: newStatus },
            });

            this.logger.log(`[PurchaseStatusCalculator] PurchaseDeliveryNote ${deliveryNoteId} -> ${newStatus} (tenant: ${tenantId})`);
        } catch (err) {
            this.logger.error(
                `[PurchaseStatusCalculator] Failed to recalculate PurchaseDeliveryNote status for ${deliveryNoteId}: ${err?.message}`,
                err?.stack,
            );
            throw new InternalServerErrorException('Status hesaplama sırasında bir hata oluştu (PurchaseDeliveryNote)');
        }
    }

    /**
     * Convenience method: recalculates delivery note status, then
     * cascades to recalculate the source order status.
     */
    async recalculateCascade(deliveryNoteId: string, tenantId: string): Promise<void> {
        try {
            await this.recalculateDeliveryNoteStatus(deliveryNoteId, tenantId);

            const note = await this.prisma.purchaseDeliveryNote.findUnique({
                where: { id: deliveryNoteId },
                select: { sourceId: true },
            });

            if (note?.sourceId) {
                await this.recalculateOrderItemStatuses(note.sourceId, tenantId);
                await this.recalculateOrderStatus(note.sourceId, tenantId);
            }
        } catch (err) {
            // Don't rewrap if already InternalServerErrorException
            if ((err as any)?.status === 500) {
                throw err;
            }
            this.logger.error(
                `[PurchaseStatusCalculator] Cascade failed for DeliveryNote ${deliveryNoteId}: ${err?.message}`,
                err?.stack,
            );
            throw new InternalServerErrorException('Cascade status hesaplama sırasında bir hata oluştu');
        }
    }
}
