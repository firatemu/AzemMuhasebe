-- Make tenant_id nullable to support system-owned unit sets
ALTER TABLE "unit_sets" ALTER COLUMN "tenant_id" DROP NOT NULL;

-- Add isSystem guard column
ALTER TABLE "unit_sets" ADD COLUMN "is_system" BOOLEAN NOT NULL DEFAULT FALSE;

-- Add isDivisible column to units
ALTER TABLE "units" ADD COLUMN "is_divisible" BOOLEAN NOT NULL DEFAULT TRUE;
