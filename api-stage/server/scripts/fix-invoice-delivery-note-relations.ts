/**
 * ONE-TIME SCRIPT: Fix invoice-delivery note-order relations
 *
 * This script fixes existing records where:
 * 1. Sales invoices were created from delivery notes but the delivery note's invoiceNos array wasn't updated
 * 2. The source order's invoiceNo wasn't set when the invoice was created
 * 3. Delivery note status wasn't updated to INVOICED
 *
 * Run: npx ts-node -r tsconfig-paths/register scripts/fix-invoice-delivery-note-relations.ts
 */

/// <reference types="node" />

import { config } from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';
import { PrismaClient, DeliveryNoteStatus } from '@prisma/client';

// Load environment variables from .env in server directory
// The script is run from project root, so we use relative path
const envPath = resolve(process.cwd(), 'api-stage/server/.env');
console.log(`Loading .env from: ${envPath}`);
console.log(`File exists: ${existsSync(envPath)}`);

if (!existsSync(envPath)) {
  console.error('ERROR: .env file not found at', envPath);
  process.exit(1);
}

const result = config({ path: envPath });
console.log(`Dotenv result: ${result.error ? result.error.message : 'Success'}`);
console.log(`DATABASE_URL set: ${!!process.env.DATABASE_URL}`);
console.log(`DATABASE_URL: ${process.env.DATABASE_URL?.substring(0, 50)}...`);

// Create Prisma Client with explicit datasource URL
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

interface InvoiceWithRelations {
  id: string;
  invoiceNo: string;
  invoiceType: string;
  deliveryNoteId?: string | null;
  purchaseDeliveryNoteId?: string | null;
  status: string;
}

async function fixSalesInvoices() {
  console.log('🔧 Fixing sales invoices...');

  // Get all APPROVED sales invoices that have a deliveryNoteId
  const invoices = await prisma.invoice.findMany({
    where: {
      invoiceType: 'SALE',
      status: 'APPROVED',
      deliveryNoteId: { not: null },
    },
    select: {
      id: true,
      invoiceNo: true,
      invoiceType: true,
      deliveryNoteId: true,
      status: true,
    },
  }) as InvoiceWithRelations[];

  console.log(`   Found ${invoices.length} sales invoices with delivery notes`);

  let fixedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const invoice of invoices) {
    try {
      if (!invoice.deliveryNoteId) continue;

      // Get the delivery note with its items and source order
      const deliveryNote = await prisma.salesDeliveryNote.findFirst({
        where: { id: invoice.deliveryNoteId },
        include: {
          items: true,
          sourceOrder: { select: { id: true, orderNo: true, invoiceNo: true, status: true } },
        },
      });

      if (!deliveryNote) {
        console.log(`   ⚠️  Delivery note not found: ${invoice.deliveryNoteId}`);
        skippedCount++;
        continue;
      }

      let deliveryNoteUpdated = false;

      // 1. Add invoiceNo to delivery note's invoiceNos array if not already there
      const currentInvoiceNos = (deliveryNote as any).invoiceNos || [];
      if (!currentInvoiceNos.includes(invoice.invoiceNo)) {
        await prisma.salesDeliveryNote.update({
          where: { id: deliveryNote.id },
          data: {
            invoiceNos: { push: invoice.invoiceNo },
          } as any,
        });
        console.log(`   ✓ Added invoiceNo ${invoice.invoiceNo} to delivery note ${deliveryNote.deliveryNoteNo}`);
        deliveryNoteUpdated = true;
      }

      // 2. Check if all items are fully invoiced and update status
      const allItemsFullyInvoiced = deliveryNote.items.every(
        (item) => Number(item.invoicedQuantity || 0) >= Number(item.quantity)
      );

      if (allItemsFullyInvoiced && deliveryNote.status !== DeliveryNoteStatus.INVOICED) {
        await prisma.salesDeliveryNote.updateMany({
          where: { id: deliveryNote.id },
          data: { status: DeliveryNoteStatus.INVOICED },
        });
        console.log(`   ✓ Updated delivery note ${deliveryNote.deliveryNoteNo} status to INVOICED`);
        deliveryNoteUpdated = true;
      }

      // 3. Update source order's invoiceNo if it has a source order
      if (deliveryNote.sourceOrder && !deliveryNote.sourceOrder.invoiceNo) {
        await prisma.salesOrder.updateMany({
          where: { id: deliveryNote.sourceOrder.id },
          data: {
            invoiceNo: invoice.invoiceNo,
            status: 'INVOICED',
          },
        });
        console.log(`   ✓ Updated order ${deliveryNote.sourceOrder.orderNo} with invoiceNo ${invoice.invoiceNo}`);
        deliveryNoteUpdated = true;
      }

      if (deliveryNoteUpdated) {
        fixedCount++;
      } else {
        skippedCount++;
      }

    } catch (error: any) {
      console.error(`   ❌ Error processing invoice ${invoice.invoiceNo}:`, error.message);
      errorCount++;
    }
  }

  console.log(`   ✅ Sales invoices: ${fixedCount} fixed, ${skippedCount} skipped, ${errorCount} errors`);
  return { fixedCount, skippedCount, errorCount };
}

async function fixPurchaseInvoices() {
  console.log('🔧 Fixing purchase invoices...');

  // Get all APPROVED purchase invoices that have a purchaseDeliveryNoteId
  const invoices = await prisma.invoice.findMany({
    where: {
      invoiceType: 'PURCHASE',
      status: 'APPROVED',
      purchaseDeliveryNoteId: { not: null },
    },
    select: {
      id: true,
      invoiceNo: true,
      invoiceType: true,
      purchaseDeliveryNoteId: true,
      status: true,
    },
  }) as any[];

  console.log(`   Found ${invoices.length} purchase invoices with delivery notes`);

  let fixedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const invoice of invoices) {
    try {
      if (!invoice.purchaseDeliveryNoteId) continue;

      // Get the delivery note with its source order
      const deliveryNote = await prisma.purchaseDeliveryNote.findFirst({
        where: { id: invoice.purchaseDeliveryNoteId },
        include: {
          sourceOrder: { select: { id: true, orderNo: true, invoiceNo: true, status: true } },
        },
      });

      if (!deliveryNote) {
        console.log(`   ⚠️  Delivery note not found: ${invoice.purchaseDeliveryNoteId}`);
        skippedCount++;
        continue;
      }

      let deliveryNoteUpdated = false;

      // 1. Update delivery note status to INVOICED if not already
      if (deliveryNote.status !== DeliveryNoteStatus.INVOICED) {
        await prisma.purchaseDeliveryNote.updateMany({
          where: { id: deliveryNote.id },
          data: { status: DeliveryNoteStatus.INVOICED },
        });
        console.log(`   ✓ Updated delivery note ${deliveryNote.deliveryNoteNo} status to INVOICED`);
        deliveryNoteUpdated = true;
      }

      // 2. Update source order's invoiceNo if it has a source order and no invoiceNo
      if (deliveryNote.sourceOrder && !deliveryNote.sourceOrder.invoiceNo) {
        await prisma.procurementOrder.updateMany({
          where: { id: deliveryNote.sourceOrder.id },
          data: {
            invoiceNo: invoice.invoiceNo,
            status: 'INVOICED',
          },
        });
        console.log(`   ✓ Updated order ${deliveryNote.sourceOrder.orderNo} with invoiceNo ${invoice.invoiceNo}`);
        deliveryNoteUpdated = true;
      }

      if (deliveryNoteUpdated) {
        fixedCount++;
      } else {
        skippedCount++;
      }

    } catch (error: any) {
      console.error(`   ❌ Error processing invoice ${invoice.invoiceNo}:`, error.message);
      errorCount++;
    }
  }

  console.log(`   ✅ Purchase invoices: ${fixedCount} fixed, ${skippedCount} skipped, ${errorCount} errors`);
  return { fixedCount, skippedCount, errorCount };
}

async function main() {
  console.log('========================================');
  console.log('Fixing Invoice-Delivery Note Relations');
  console.log('========================================\n');

  try {
    const salesResult = await fixSalesInvoices();
    console.log('');
    const purchaseResult = await fixPurchaseInvoices();

    console.log('\n========================================');
    console.log('Summary:');
    console.log(`  Sales: ${salesResult.fixedCount} fixed, ${salesResult.skippedCount} skipped, ${salesResult.errorCount} errors`);
    console.log(`  Purchase: ${purchaseResult.fixedCount} fixed, ${purchaseResult.skippedCount} skipped, ${purchaseResult.errorCount} errors`);
    console.log('========================================');

    if (salesResult.errorCount > 0 || purchaseResult.errorCount > 0) {
      process.exit(1);
    }
  } catch (error: any) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
