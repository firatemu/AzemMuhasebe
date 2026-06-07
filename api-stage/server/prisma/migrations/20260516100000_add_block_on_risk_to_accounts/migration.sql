-- Align accounts table with Prisma schema (risk management)
ALTER TABLE "accounts" ADD COLUMN IF NOT EXISTS "block_on_risk" BOOLEAN NOT NULL DEFAULT false;
