-- Add installment count to collection records
ALTER TABLE "collections"
ADD COLUMN IF NOT EXISTS "installment_count" INTEGER;

-- Add installment count to invoice-collection payment links
ALTER TABLE "invoice_collections"
ADD COLUMN IF NOT EXISTS "installment_count" INTEGER;
