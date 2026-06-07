-- Align account_movements.notes with Prisma schema (optional field)
ALTER TABLE "account_movements" ALTER COLUMN "notes" DROP NOT NULL;
