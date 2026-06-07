/**
 * Onaylanmış faturaların (APPROVED, CLOSED, PARTIALLY_PAID) stok hareketlerini (StockMove) yeniden oluşturur.
 * Veri tutarsızlıklarını gidermek için "Delete and Rebuild" mantığını kullanır.
 * 
 * Kullanım:
 * Tüm onaylı faturalar: npx ts-node scripts/sync-stok-hareket.ts
 * Belirli bir fatura için: npx ts-node scripts/sync-stok-hareket.ts [invoiceId]
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const invoiceId = process.argv[2];

    const where: any = {
        deletedAt: null,
        status: { in: ['APPROVED', 'CLOSED', 'PARTIALLY_PAID'] }
    };
    if (invoiceId) {
        where.id = invoiceId;
        console.log(`Hedef fatura ID: ${invoiceId}`);
    } else {
        console.log('Tüm onaylı faturalar için stok hareketleri senkronize ediliyor...');
    }

    const invoices = await prisma.invoice.findMany({
        where,
        include: {
            items: true,
            deliveryNote: { select: { warehouseId: true } },
            purchaseDeliveryNote: { select: { warehouseId: true } }
        }
    });

    console.log(`Toplam ${invoices.length} fatura bulundu.`);

    // Varsayılan lokasyon
    const defaultLocation = await prisma.location.findFirst({
        where: { isDefault: true }
    }) || await prisma.location.findFirst({
        where: { name: 'GENEL' }
    }) || await prisma.location.findFirst();

    if (!defaultLocation) {
        console.error('Hata: Sistemde lokasyon bulunamadı. Lütfen önce lokasyon tanımlayın.');
        process.exit(1);
    }

    for (const invoice of invoices) {
        console.log(`[${invoice.tenantId}] İşleniyor: ${invoice.invoiceNo} (${invoice.id})...`);

        // Depo ID belirle (Kendi deposu yoksa irsaliyesinden al)
        const warehouseId = invoice.warehouseId ||
            invoice.deliveryNote?.warehouseId ||
            invoice.purchaseDeliveryNote?.warehouseId;

        if (!warehouseId) {
            console.warn(`   -> Uyarı: Fatura için depo ID bulunamadı. Atlanıyor.`);
            continue;
        }

        // 1. Mevcut hareketleri sil (Delete and Rebuild)
        const deleted = await prisma.stockMove.deleteMany({
            where: {
                refType: 'Invoice',
                refId: invoice.id,
                tenantId: invoice.tenantId
            }
        });
        console.log(`   -> Silinen eski hareket sayısı: ${deleted.count}`);

        // 2. Kalemler üzerinden yeniden oluştur
        let rebuiltCount = 0;
        for (const item of invoice.items) {
            if (!item.productId) continue;

            // MoveType Belirleme
            // SALE (Satış): Stok Azaltır (fromWarehouseId dolu)
            // PUT_AWAY (Giriş): Stok Artırır (toWarehouseId dolu)
            let moveType: 'SALE' | 'PUT_AWAY' = 'SALE';

            if (invoice.invoiceType === 'PURCHASE' || invoice.invoiceType === 'SALES_RETURN') {
                moveType = 'PUT_AWAY';
            } else if (invoice.invoiceType === 'SALE' || invoice.invoiceType === 'PURCHASE_RETURN') {
                moveType = 'SALE';
            }

            await prisma.stockMove.create({
                data: {
                    productId: item.productId,
                    fromWarehouseId: moveType === 'SALE' ? warehouseId : null,
                    fromLocationId: moveType === 'SALE' ? defaultLocation.id : null,
                    toWarehouseId: warehouseId,
                    toLocationId: defaultLocation.id,
                    qty: item.quantity,
                    moveType: moveType as any,
                    refType: 'Invoice',
                    refId: invoice.id,
                    tenantId: invoice.tenantId,
                    createdBy: invoice.createdBy || null,
                    note: `Sync Script: ${invoice.invoiceNo}`
                }
            });
            rebuiltCount++;
        }
        console.log(`   -> Yeniden oluşturulan hareket sayısı: ${rebuiltCount}`);
    }

    console.log('\nİşlem başarıyla tamamlandı.');
}

main()
    .catch((e) => {
        console.error('Hata oluştu:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
