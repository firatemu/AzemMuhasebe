-- Align sales_delivery_notes with Prisma schema
ALTER TABLE "sales_delivery_notes" ADD COLUMN IF NOT EXISTS "invoiceNos" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "sales_delivery_notes" ADD COLUMN IF NOT EXISTS "order_no_ref" TEXT;
