import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { Prisma, InvoiceStatus, MovementType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { resolveStockMovementType } from '../helpers/movement-type.helper';
import { StockMovementDirection, StockMovementPayload, ReverseResult } from '../types/invoice-orchestrator.types';
import { SystemParameterService } from '../../system-parameter/system-parameter.service';
import { WarehouseService } from '../../warehouse/warehouse.service';
import { InvoiceType } from '../invoice.enums';

/**
 * Fatura ve kalemlerini içeren tip tanımı
 */
export type InvoiceWithItems = Prisma.InvoiceGetPayload<{
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
            };
        };
    };
}>;

@Injectable()
export class StockEffectService {
    private readonly logger = new Logger(StockEffectService.name);

    constructor(
        private readonly systemParameterService: SystemParameterService,
        private readonly warehouseService: WarehouseService,
    ) { }

    /**
     * Fatura onaylandığında veya iptal edildiğinde stok etkilerini uygular.
     * 
     * @param invoice Fatura ve kalemleri
     * @param tx Prisma Transaction Client
     * @param operationType İşlem tipi (APPROVE | CANCEL)
     */
    async applyStockEffects(
        invoice: InvoiceWithItems,
        tx: Prisma.TransactionClient,
        operationType: 'APPROVE' | 'CANCEL'
    ): Promise<StockMovementPayload[]> {
        const movements: StockMovementPayload[] = [];
        const tenantId = invoice.tenantId;

        if (!tenantId) {
            throw new Error('Tenant ID is missing in invoice context');
        }

        // Negatif stok kontrolü parametresini al
        const negativeStockControl = await this.systemParameterService.getParameterAsBoolean(
            'NEGATIVE_STOCK_CONTROL',
            false
        );

        // WMS modülü aktif mi kontrol et
        const isWmsEnabled = await this.systemParameterService.getParameterAsBoolean(
            'ENABLE_WMS_MODULE',
            false
        );

        for (const item of invoice.items) {
            const baseQuantity = this.calculateBaseQuantity(item);
            if (baseQuantity.lte(0)) {
                this.logger.warn(`Skipping item with zero or negative quantity: Product ${item.productId}, Invoice ${invoice.id}`);
                continue;
            }

            const movementType = resolveStockMovementType(invoice.invoiceType as InvoiceType, operationType);
            if (!movementType) {
                // SALE veya PURCHASE iptallerinde stok hareketi oluşmaz.
                continue;
            }

            const direction = this.getDirectionFromMovementType(movementType);
            const warehouseId = item.shelf || invoice.warehouseId; // Kalem seviyesinde depo yoksa fatura deposu

            if (!warehouseId) {
                throw new BadRequestException(`Warehouse ID is missing for product: ${item.product?.name || item.productId}`);
            }

            // Stok seviyesini güncelle ve varsa kontrol yap
            await this.updateStockLevel(
                tx,
                tenantId,
                warehouseId,
                item.productId,
                baseQuantity,
                direction,
                negativeStockControl,
                item.product?.name || 'Unknown Product'
            );

            // Stok hareketi kaydı oluştur
            const movement = await tx.productMovement.create({
                data: {
                    tenant: { connect: { id: tenantId } },
                    product: { connect: { id: item.productId } },
                    warehouse: { connect: { id: warehouseId } },
                    movementType,
                    quantity: Math.round(
                        Number(
                            direction === StockMovementDirection.OUT
                                ? baseQuantity.negated()
                                : baseQuantity,
                        ),
                    ),
                    unitPrice: item.unitPrice,
                    invoiceItem: { connect: { id: item.id } },
                    notes: operationType === 'CANCEL' ? `Cancelled: ${invoice.invoiceNo}` : `Approved: ${invoice.invoiceNo}`,
                    recordType: operationType === 'CANCEL' ? 'CANCEL_REVERSAL' : 'NORMAL',
                },
            });

            // WMS aktifse stock_moves tablosuna da yaz
            if (isWmsEnabled) {
                await this.createWmsMove(tx, tenantId, warehouseId, item, invoice, direction, operationType, baseQuantity);
            }

            movements.push({
                productId: item.productId,
                warehouseId,
                quantity: baseQuantity,
                direction,
                movementType,
                invoiceId: invoice.id,
                invoiceItemId: item.id,
                tenantId,
            });
        }

        return movements;
    }

    /**
     * Mevcut stok etkilerini tersine çevirir (UPDATE senaryosu için).
     * 
     * @param invoiceId Fatura ID
     * @param tenantId Kiracı ID
     * @param tx Prisma Transaction Client
     */
    async reverseStockEffects(
        invoiceId: string,
        tenantId: string,
        tx: Prisma.TransactionClient,
        isDraftRevert: boolean = false
    ): Promise<ReverseResult> {
        // Faturaya ait henüz tersi alınmamış hareketleri bul
        const originalMovements = await tx.productMovement.findMany({
            where: {
                invoiceItem: {
                    invoiceId,
                },
                tenantId,
                isReversed: false,
                deletedAt: null,
            },
            include: {
                product: true,
            }
        });

        if (originalMovements.length === 0) {
            return { stockMovementsReversed: 0, accountMovementReversed: false };
        }

        for (const mov of originalMovements) {
            const quantity = new Decimal(Math.abs(mov.quantity));
            const reverseDirection = mov.quantity > 0 ? StockMovementDirection.OUT : StockMovementDirection.IN;
            const reverseMovementType = reverseDirection === StockMovementDirection.OUT ? MovementType.EXIT : MovementType.ENTRY;

            // Stok seviyesini ters yönde güncelle (Geri alma işleminde negatif kontrolü genellikle kapatılır veya esnetilir)
            await this.updateStockLevel(
                tx,
                tenantId,
                mov.warehouseId!,
                mov.productId,
                quantity,
                reverseDirection,
                false, // Geri alma sırasında stok blokajı yapmıyoruz
                mov.product?.name || 'Unknown'
            );

            if (isDraftRevert) {
                // Taslağa dönüldüğünde ters kayıt atmak yerine orijinal hareketi soft-delete yap
                await tx.productMovement.update({
                    where: { id: mov.id },
                    data: { deletedAt: new Date() }
                });
            } else {
                // Ters kayıt oluştur
                await tx.productMovement.create({
                    data: {
                        tenant: { connect: { id: tenantId } },
                        product: { connect: { id: mov.productId } },
                        warehouse: mov.warehouseId ? { connect: { id: mov.warehouseId } } : undefined,
                        movementType: reverseMovementType,
                        quantity: reverseDirection === StockMovementDirection.OUT ? -quantity.toNumber() : quantity.toNumber(),
                        unitPrice: mov.unitPrice,
                        invoiceItem: mov.invoiceItemId ? { connect: { id: mov.invoiceItemId } } : undefined,
                        notes: `Reversal of movement ${mov.id}`,
                        isReversed: true, // Bu kayıt bir geri almadır
                        reversalOf: { connect: { id: mov.id } },
                        recordType: 'UPDATE_REVERSAL',
                    },
                });

                // Orijinal kaydı tersi alınmış olarak işaretle
                await tx.productMovement.update({
                    where: { id: mov.id },
                    data: { isReversed: true },
                });
            }
        }

        return {
            stockMovementsReversed: originalMovements.length,
            accountMovementReversed: false,
        };
    }

    /**
     * Stok seviyesini (ProductLocationStock) günceller.
     */
    private async updateStockLevel(
        tx: Prisma.TransactionClient,
        tenantId: string,
        warehouseId: string,
        productId: string,
        quantity: Decimal,
        direction: StockMovementDirection,
        negativeControl: boolean,
        productName: string
    ): Promise<void> {
        const defaultLocation = await this.warehouseService.getOrCreateDefaultLocation(warehouseId);

        // Mevcut stok kaydını bul veya oluştur
        const stock = await tx.productLocationStock.findFirst({
            where: {
                tenantId,
                warehouseId,
                locationId: defaultLocation.id,
                productId,
            },
        });

        const qtyDelta = Math.round(
            Number(
                direction === StockMovementDirection.IN ? quantity : quantity.negated(),
            ),
        );

        if (stock) {
            const newQty = stock.qtyOnHand + qtyDelta;

            if (negativeControl && newQty < 0) {
                throw new BadRequestException(
                    `Insufficient stock: ${productName}. Available in warehouse: ${stock.qtyOnHand}`,
                );
            }

            await tx.productLocationStock.update({
                where: { id: stock.id },
                data: { qtyOnHand: newQty },
            });
        } else {
            if (negativeControl && qtyDelta < 0) {
                throw new BadRequestException(`Insufficient stock: ${productName}. Available in warehouse: 0`);
            }

            await tx.productLocationStock.create({
                data: {
                    tenantId,
                    warehouseId,
                    locationId: defaultLocation.id,
                    productId,
                    qtyOnHand: qtyDelta,
                },
            });
        }
    }

    /**
     * WMS Modülü aktifse StockMove kaydı oluşturur.
     */
    private async createWmsMove(
        tx: Prisma.TransactionClient,
        tenantId: string,
        warehouseId: string,
        item: any,
        invoice: any,
        direction: StockMovementDirection,
        operationType: string,
        baseQuantity: Decimal
    ): Promise<void> {
        const defaultLocation = await this.warehouseService.getOrCreateDefaultLocation(warehouseId);

        await tx.stockMove.create({
            data: {
                tenant: { connect: { id: tenantId } },
                product: { connect: { id: item.productId } },
                fromWarehouse: direction === StockMovementDirection.OUT ? { connect: { id: warehouseId } } : undefined,
                fromLocation: direction === StockMovementDirection.OUT ? { connect: { id: defaultLocation.id } } : undefined,
                toWarehouse: { connect: { id: warehouseId } },
                toLocation: { connect: { id: defaultLocation.id } },
                quantity: baseQuantity.toNumber(),
                moveType: direction === StockMovementDirection.OUT ? 'SALE' : 'PUT_AWAY',
                refType: 'INVOICE',
                refId: invoice.id,
                notes: `${operationType === 'CANCEL' ? 'Cancelled' : 'Approved'} invoice ${invoice.invoiceNo}`,
            },
        });
    }

    private getDirectionFromMovementType(type: MovementType): StockMovementDirection {
        switch (type) {
            case MovementType.ENTRY:
            case MovementType.RETURN:
            case MovementType.CANCELLATION_ENTRY:
            case MovementType.COUNT_SURPLUS:
                return StockMovementDirection.IN;
            case MovementType.EXIT:
            case MovementType.SALE:
            case MovementType.CANCELLATION_EXIT:
            case MovementType.COUNT_SHORTAGE:
                return StockMovementDirection.OUT;
            default:
                // Varsayılan kural: ENTRY/RETURN/SURPLUS giriştir, diğerleri çıkıştır.
                return StockMovementDirection.OUT;
        }
    }

    /**
     * Birim dönüşüm katsayısını kullanarak temel birim miktarını hesaplar.
     * (Eğer "1 Adet = 0.0833 Kutu" ise ve 1 Kutu satılıyorsa -> 1 / 0.0833 = 12 Adet)
     */
    private calculateBaseQuantity(item: any): Decimal {
        const qty = new Decimal(item.quantity || 0);
        const selectedUnitName = item.unit;
        const product = item.product;

        if (!product || !product.unitRef || !product.unitRef.unitSet || !product.unitRef.unitSet.units) {
            return qty;
        }

        const units = product.unitRef.unitSet.units;
        const selectedUnit = units.find((u: any) => u.name === selectedUnitName);

        if (!selectedUnit || selectedUnit.isBaseUnit) {
            return qty;
        }

        // Base Quantity = Qty / Rate (Mantık: 1 Adet = 0.0833 Kutu -> 1 Kutu = 1 / 0.0833 = 12 Adet)
        const rate = new Decimal(selectedUnit.conversionRate || 1);
        if (rate.isZero()) return qty;

        // Decimal precision handling
        return qty.div(rate).toDecimalPlaces(4);
    }
}
