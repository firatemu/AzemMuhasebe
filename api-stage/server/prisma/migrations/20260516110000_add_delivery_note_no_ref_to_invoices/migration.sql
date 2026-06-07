-- Align invoices table with Prisma schema
ALTER TABLE "invoices" ADD COLUMN IF NOT EXISTS "delivery_note_no_ref" TEXT;
