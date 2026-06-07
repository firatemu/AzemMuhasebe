-- Align sales/purchase order item tables with Prisma schema (discount + unit fields)

ALTER TABLE "sales_order_items"
  ADD COLUMN IF NOT EXISTS "discount_rate" DECIMAL(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "discount_amount" DECIMAL(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "discount_type" TEXT DEFAULT 'pct',
  ADD COLUMN IF NOT EXISTS "unit" TEXT;

ALTER TABLE "purchase_order_local_items"
  ADD COLUMN IF NOT EXISTS "discount_rate" DECIMAL(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "discount_amount" DECIMAL(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "discount_type" TEXT DEFAULT 'pct',
  ADD COLUMN IF NOT EXISTS "unit" TEXT;
