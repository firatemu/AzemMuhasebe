-- Tahsilat / Ödeme / Çapraz ödeme numara şablonları
ALTER TYPE "ModuleType" ADD VALUE IF NOT EXISTS 'COLLECTION_RECEIPT';
ALTER TYPE "ModuleType" ADD VALUE IF NOT EXISTS 'PAYMENT_RECEIPT';
ALTER TYPE "ModuleType" ADD VALUE IF NOT EXISTS 'CROSS_PAYMENT';

ALTER TABLE "collections" ADD COLUMN IF NOT EXISTS "document_no" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "collections_tenant_document_no_key"
  ON "collections" ("tenantId", "document_no")
  WHERE "document_no" IS NOT NULL;
