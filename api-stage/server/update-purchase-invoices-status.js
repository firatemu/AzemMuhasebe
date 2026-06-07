const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updatePurchaseInvoicesStatus() {
  try {
    console.log('Satın alma faturalarının durumu güncelleniyor...');

    // Satın alma faturalarını bul (PURCHASE tipi)
    const purchaseInvoices = await prisma.invoice.findMany({
      where: {
        faturaTipi: 'PURCHASE',
        durum: 'DRAFT' // Sadece taslak olanları güncelle
      },
      select: {
        id: true,
        faturaNo: true,
        durum: true,
      }
    });

    console.log(`${purchaseInvoices.length} adet taslak satın alma faturası bulundu.`);

    if (purchaseInvoices.length === 0) {
      console.log('Güncellenecek taslak fatura bulunamadı.');
      return;
    }

    // Faturaları güncelle
    for (const fatura of purchaseInvoices) {
      await prisma.invoice.update({
        where: { id: fatura.id },
        data: { durum: 'APPROVED' }
      });
      console.log(`✅ Fatura ${fatura.faturaNo} (ID: ${fatura.id}) durumu güncellendi: ${fatura.durum} -> APPROVED`);
    }

    console.log(`\n✅ Toplam ${purchaseInvoices.length} adet satın alma faturası başarıyla güncellendi!`);
  } catch (error) {
    console.error('❌ Hata oluştu:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Script'i çalıştır
updatePurchaseInvoicesStatus()
  .then(() => {
    console.log('\n🎉 İşlem tamamlandı!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 İşlem başarısız:', error);
    process.exit(1);
  });