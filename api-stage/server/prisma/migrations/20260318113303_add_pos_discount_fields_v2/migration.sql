-- AlterTable
ALTER TABLE "invoice_items" ADD COLUMN     "discount_type" TEXT DEFAULT 'pct';

-- AlterTable
ALTER TABLE "invoices" ADD COLUMN     "global_discount_type" TEXT DEFAULT 'pct',
ADD COLUMN     "global_discount_value" DECIMAL(10,2) DEFAULT 0;

-- CreateIndex
CREATE INDEX "invoices_tenantId_account_id_status_idx" ON "invoices"("tenantId", "account_id", "status");

-- CreateIndex
CREATE INDEX "invoices_tenantId_date_status_idx" ON "invoices"("tenantId", "date", "status");
