-- AlterTable
ALTER TABLE "banks" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" TEXT;

-- AlterTable
ALTER TABLE "purchase_order_items" ADD COLUMN     "tenantId" TEXT;

-- AlterTable
ALTER TABLE "stock_moves" ALTER COLUMN "qty" SET DATA TYPE DECIMAL(18,5);

-- CreateIndex
CREATE INDEX "purchase_order_items_tenantId_idx" ON "purchase_order_items"("tenantId");

-- AddForeignKey
ALTER TABLE "banks" ADD CONSTRAINT "banks_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
