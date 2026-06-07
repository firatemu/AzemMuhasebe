/**
 * Cari hesapların (Account) hareketlerini (AccountMovement) baz alarak bakiyelerini yeniden hesaplar.
 * Hareketlerdeki balance alanını ve Account tablosundaki balance değerini günceller.
 * 
 * Kullanım:
 * Tüm cariler için: npx ts-node scripts/recalculate-cari-bakiyeler.ts
 * Belirli bir cari için: npx ts-node scripts/recalculate-cari-bakiyeler.ts [accountId]
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const accountId = process.argv[2];

    const where: any = { deletedAt: null };
    if (accountId) {
        where.id = accountId;
        console.log(`Hedef cari ID: ${accountId}`);
    } else {
        console.log('Tüm cariler için bakiye hesaplanıyor...');
    }

    const accounts = await prisma.account.findMany({
        where,
        select: { id: true, code: true, title: true, tenantId: true }
    });

    console.log(`Toplam ${accounts.length} cari bulundu.`);

    for (const account of accounts) {
        console.log(`[${account.tenantId}] İşleniyor: ${account.title} (${account.code})...`);

        // Hareketleri tarih ve oluşturulma zamanına göre getir
        const movements = await prisma.accountMovement.findMany({
            where: {
                accountId: account.id,
                deletedAt: null,
            },
            orderBy: [
                { date: 'asc' },
                { createdAt: 'asc' }
            ],
        });

        let runningBalance = 0;
        for (const movement of movements) {
            const amount = Number(movement.amount);
            if (movement.type === 'DEBIT') {
                runningBalance += amount;
            } else {
                runningBalance -= amount;
            }

            // Hareket üzerindeki bakiye bilgisini güncelle
            await prisma.accountMovement.update({
                where: { id: movement.id },
                data: { balance: runningBalance },
            });
        }

        // Cari kartı üzerindeki ana bakiye bilgisini güncelle
        await prisma.account.update({
            where: { id: account.id },
            data: { balance: runningBalance },
        });

        console.log(`   -> Tamamlandı. Hareket Sayısı: ${movements.length}, Yeni Bakiye: ${runningBalance.toFixed(2)}`);
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
