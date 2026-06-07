/*
  Warnings:

  - A unique constraint covering the columns `[tenantId,journal_no]` on the table `check_bill_journals` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "AccountTransactionSourceType" AS ENUM ('CHECK_BILL_JOURNAL', 'CHECK_BILL_ACTION');

-- CreateEnum
CREATE TYPE "AccountTransactionDirection" AS ENUM ('CREDIT', 'DEBIT');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "CheckBillStatus" ADD VALUE 'PARTIAL_PAID';
ALTER TYPE "CheckBillStatus" ADD VALUE 'PROTESTED';

-- AlterTable
ALTER TABLE "check_bill_journals" ADD COLUMN     "cashbox_id" TEXT;

-- AlterTable
ALTER TABLE "check_bill_logs" ADD COLUMN     "from_status" "CheckBillStatus",
ADD COLUMN     "journal_id" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "performed_by_id" TEXT,
ADD COLUMN     "to_status" "CheckBillStatus";

-- AlterTable
ALTER TABLE "checks_bills" ADD COLUMN     "current_holder_id" TEXT,
ADD COLUMN     "is_protested" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "protested_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "check_bill_endorsements" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "check_bill_id" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "from_account_id" TEXT NOT NULL,
    "to_account_id" TEXT NOT NULL,
    "endorsed_at" TIMESTAMP(3) NOT NULL,
    "journal_id" TEXT NOT NULL,

    CONSTRAINT "check_bill_endorsements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "check_bill_collections" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "check_bill_id" TEXT NOT NULL,
    "collected_amount" DECIMAL(15,2) NOT NULL,
    "collection_date" TIMESTAMP(3) NOT NULL,
    "cashbox_id" TEXT,
    "bank_account_id" TEXT,
    "journal_id" TEXT NOT NULL,
    "created_by_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "check_bill_collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_transactions" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "account_id" TEXT NOT NULL,
    "source_type" "AccountTransactionSourceType" NOT NULL,
    "source_id" TEXT NOT NULL,
    "direction" "AccountTransactionDirection" NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "account_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "check_bill_endorsements_check_bill_id_idx" ON "check_bill_endorsements"("check_bill_id");

-- CreateIndex
CREATE INDEX "check_bill_endorsements_tenantId_idx" ON "check_bill_endorsements"("tenantId");

-- CreateIndex
CREATE INDEX "check_bill_collections_check_bill_id_idx" ON "check_bill_collections"("check_bill_id");

-- CreateIndex
CREATE INDEX "check_bill_collections_tenantId_idx" ON "check_bill_collections"("tenantId");

-- CreateIndex
CREATE INDEX "account_transactions_account_id_idx" ON "account_transactions"("account_id");

-- CreateIndex
CREATE INDEX "account_transactions_tenantId_idx" ON "account_transactions"("tenantId");

-- CreateIndex
CREATE INDEX "account_transactions_source_type_source_id_idx" ON "account_transactions"("source_type", "source_id");

-- CreateIndex
CREATE UNIQUE INDEX "check_bill_journals_tenantId_journal_no_key" ON "check_bill_journals"("tenantId", "journal_no");

-- AddForeignKey
ALTER TABLE "check_bill_journals" ADD CONSTRAINT "check_bill_journals_cashbox_id_fkey" FOREIGN KEY ("cashbox_id") REFERENCES "cashboxes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checks_bills" ADD CONSTRAINT "checks_bills_current_holder_id_fkey" FOREIGN KEY ("current_holder_id") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_bill_logs" ADD CONSTRAINT "check_bill_logs_journal_id_fkey" FOREIGN KEY ("journal_id") REFERENCES "check_bill_journals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_bill_logs" ADD CONSTRAINT "check_bill_logs_performed_by_id_fkey" FOREIGN KEY ("performed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_bill_endorsements" ADD CONSTRAINT "check_bill_endorsements_check_bill_id_fkey" FOREIGN KEY ("check_bill_id") REFERENCES "checks_bills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_bill_endorsements" ADD CONSTRAINT "check_bill_endorsements_from_account_id_fkey" FOREIGN KEY ("from_account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_bill_endorsements" ADD CONSTRAINT "check_bill_endorsements_to_account_id_fkey" FOREIGN KEY ("to_account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_bill_endorsements" ADD CONSTRAINT "check_bill_endorsements_journal_id_fkey" FOREIGN KEY ("journal_id") REFERENCES "check_bill_journals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_bill_endorsements" ADD CONSTRAINT "check_bill_endorsements_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_bill_collections" ADD CONSTRAINT "check_bill_collections_check_bill_id_fkey" FOREIGN KEY ("check_bill_id") REFERENCES "checks_bills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_bill_collections" ADD CONSTRAINT "check_bill_collections_cashbox_id_fkey" FOREIGN KEY ("cashbox_id") REFERENCES "cashboxes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_bill_collections" ADD CONSTRAINT "check_bill_collections_bank_account_id_fkey" FOREIGN KEY ("bank_account_id") REFERENCES "bank_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_bill_collections" ADD CONSTRAINT "check_bill_collections_journal_id_fkey" FOREIGN KEY ("journal_id") REFERENCES "check_bill_journals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_bill_collections" ADD CONSTRAINT "check_bill_collections_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_bill_collections" ADD CONSTRAINT "check_bill_collections_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_transactions" ADD CONSTRAINT "account_transactions_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_transactions" ADD CONSTRAINT "account_transactions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
