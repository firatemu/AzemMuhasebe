/**
 * Fix Missing Account Movements for Existing Invoices
 * 
 * Bu script, mevcut faturalar için eksik AccountMovement kayıtlarını oluşturur.
 * Bu, cari ekstrelerinde fatura hareketlerinin görünebilmesini sağlar.
 */

import { PrismaClient, DebitCredit } from '@prisma/client';

const prisma = new PrismaClient();

interface InvoiceData {
  id: string;
  invoiceNo: string;
  invoiceType: string;
  accountId: string;
  date: Date;
  grandTotal: any;
  status: string;
  tenantId: string;
}

async function getInvoicesWithoutMovements() {
  console.log('🔍 Faturalar taranıyor...');
  
  const invoices = await prisma.invoice.findMany({
    where: {
      status: 'APPROVED',
      deletedAt: null,
    },
    select: {
      id: true,
      invoiceNo: true,
      invoiceType: true,
      accountId: true,
      date: true,
      grandTotal: true,
      status: true,
      tenantId: true,
    },
  });

  console.log(`📊 Toplam ${invoices.length} fatura bulundu.`);

  const invoicesWithoutMovement: InvoiceData[] = [];

  for (const invoice of invoices) {
    const movement = await prisma.accountMovement.findFirst({
      where: {
        documentType: 'INVOICE',
        documentNo: invoice.invoiceNo,
        accountId: invoice.accountId,
      },
    });

    if (!movement) {
      invoicesWithoutMovement.push(invoice as InvoiceData);
      console.log(`❌ Eksik hareket: ${invoice.invoiceType} - ${invoice.invoiceNo}`);
    }
  }

  return invoicesWithoutMovement;
}

async function createMissingMovements() {
  try {
    const invoicesWithoutMovement = await getInvoicesWithoutMovements();

    if (invoicesWithoutMovement.length === 0) {
      console.log('✅ Tüm faturaların hareket kaydı mevcut!');
      return;
    }

    console.log(`\n📋 ${invoicesWithoutMovement.length} faturanın hareket kaydı oluşturulacak...`);

    let successCount = 0;
    let errorCount = 0;

    for (const invoice of invoicesWithoutMovement) {
      try {
        const account = await prisma.account.findUnique({
          where: { id: invoice.accountId },
          select: { balance: true },
        });

        if (!account) {
          console.error(`⚠️  Cari hesap bulunamadı: ${invoice.accountId}`);
          errorCount++;
          continue;
        }

        let movementType: DebitCredit;
        let description: string;
        let balanceUpdate: number;

        const currentBalance = Number(account.balance || 0);
        const grandTotal = Number(invoice.grandTotal);

        if (invoice.invoiceType === 'SALE') {
          movementType = 'DEBIT';
          description = `Sales Invoice: ${invoice.invoiceNo}`;
          balanceUpdate = currentBalance + grandTotal;
        } else if (invoice.invoiceType === 'SALES_RETURN') {
          movementType = 'CREDIT';
          description = `Sales Return Invoice: ${invoice.invoiceNo}`;
          balanceUpdate = currentBalance - grandTotal;
        } else if (invoice.invoiceType === 'PURCHASE') {
          movementType = 'CREDIT';
          description = `Purchase Invoice: ${invoice.invoiceNo}`;
          balanceUpdate = currentBalance - grandTotal;
        } else {
          movementType = 'DEBIT';
          description = `Purchase Return Invoice: ${invoice.invoiceNo}`;
          balanceUpdate = currentBalance + grandTotal;
        }

        await prisma.$transaction(async (tx) => {
          await tx.accountMovement.create({
            data: {
              accountId: invoice.accountId,
              tenantId: invoice.tenantId,
              type: movementType,
              amount: grandTotal,
              balance: balanceUpdate,
              documentType: 'INVOICE',
              documentNo: invoice.invoiceNo,
              date: invoice.date,
              notes: description,
            },
          });

          await tx.account.update({
            where: { id: invoice.accountId },
            data: { balance: balanceUpdate },
          });
        });

        console.log(`✅ ${invoice.invoiceType} - ${invoice.invoiceNo} için hareket oluşturuldu`);
        successCount++;
      } catch (error) {
        console.error(`❌ Hata (${invoice.invoiceNo}):`, error);
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 ÖZET');
    console.log('='.repeat(60));
    console.log(`✅ Başarılı: ${successCount}`);
    console.log(`❌ Hatalı:   ${errorCount}`);
    console.log(`📋 Toplam:   ${invoicesWithoutMovement.length}`);
    console.log('='.repeat(60));

    if (successCount > 0) {
      console.log('\n✅ Tüm işlemler başarıyla tamamlandı!');
      console.log('💡 Lütfen uygulamayı yeniden başlatın.');
    }
  } catch (error) {
    console.error('💥 Kritik hata:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createMissingMovements()
  .then(() => {
    console.log('\n✅ Script tamamlandı.');
  })
  .catch((error) => {
    console.error('\n❌ Script başarısız oldu:', error);
  });