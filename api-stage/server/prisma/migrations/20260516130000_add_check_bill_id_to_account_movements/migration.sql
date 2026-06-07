-- Align account_movements with Prisma schema (check/bill linkage)
ALTER TABLE "account_movements" ADD COLUMN IF NOT EXISTS "check_bill_id" TEXT;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'account_movements_check_bill_id_fkey'
  ) THEN
    ALTER TABLE "account_movements"
      ADD CONSTRAINT "account_movements_check_bill_id_fkey"
      FOREIGN KEY ("check_bill_id") REFERENCES "checks_bills"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
