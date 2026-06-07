-- Çek/Senet (Bordro) v2 — şema genişletmesi (cek-senet-erp-backend-v2)
-- CheckBillStatus: GIVEN_TO_BANK -> SENT_TO_BANK (döküman uyumu)

-- New enums (satellite + journal posting + line types)
CREATE TYPE "CheckBillJournalPostingStatus" AS ENUM ('DRAFT', 'POSTED', 'CANCELLED');
CREATE TYPE "CheckBillEndorsementType" AS ENUM ('FULL', 'PARTIAL', 'BANK');
CREATE TYPE "CheckBillCollectionMethod" AS ENUM ('CASH', 'BANK_TRANSFER', 'CLEARING');
CREATE TYPE "CheckBillGlEntryType" AS ENUM ('AUTO', 'MANUAL', 'REVERSAL');
CREATE TYPE "CheckBillGlEntryStatus" AS ENUM ('DRAFT', 'POSTED', 'REVERSED');
CREATE TYPE "CheckBillRiskLimitType" AS ENUM ('SINGLE_CHECK', 'TOTAL_PORTFOLIO', 'MATURITY_DAYS');
CREATE TYPE "CheckBillRiskRating" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
CREATE TYPE "CheckBillReminderType" AS ENUM ('PRE_DUE', 'DUE_DATE', 'OVERDUE', 'PROTEST_WARNING');
CREATE TYPE "CheckBillReminderDeliveryStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'CANCELLED');
CREATE TYPE "CheckBillReminderChannel" AS ENUM ('EMAIL', 'SMS', 'IN_APP', 'WEBHOOK');
CREATE TYPE "CheckBillLegalCaseStatus" AS ENUM ('PROTESTED', 'LAWSUIT_FILED', 'JUDGMENT', 'EXECUTION', 'CLOSED');
CREATE TYPE "CheckBillBankSubmissionType" AS ENUM ('COLLECTION', 'GUARANTEE', 'DISCOUNT');
CREATE TYPE "CheckBillBankSubmissionStatus" AS ENUM ('SUBMITTED', 'PROCESSING', 'CLEARED', 'REJECTED', 'RETURNED');
CREATE TYPE "CheckBillDiscountingStatus" AS ENUM ('ACTIVE', 'SETTLED', 'RECOURSE', 'CANCELLED');
CREATE TYPE "CheckBillReconciliationStatus" AS ENUM ('MATCHED', 'UNMATCHED', 'EXCEPTION', 'RESOLVED');
CREATE TYPE "CheckBillApprovalWorkflowType" AS ENUM ('CREATION', 'COLLECTION', 'DISCOUNT', 'PROTEST');
CREATE TYPE "CheckBillApprovalStepStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'DELEGATED');

-- Rename legacy status label (PostgreSQL 10+)
ALTER TYPE "CheckBillStatus" RENAME VALUE 'GIVEN_TO_BANK' TO 'SENT_TO_BANK';

ALTER TYPE "CheckBillStatus" ADD VALUE 'DISCOUNTED';
ALTER TYPE "CheckBillStatus" ADD VALUE 'LEGAL_FOLLOWUP';
ALTER TYPE "CheckBillStatus" ADD VALUE 'WRITTEN_OFF';
ALTER TYPE "CheckBillStatus" ADD VALUE 'CANCELLED';
ALTER TYPE "CheckBillStatus" ADD VALUE 'RECOURSE';

ALTER TYPE "JournalType" ADD VALUE 'BANK_DISCOUNT_SUBMISSION';
ALTER TYPE "JournalType" ADD VALUE 'PARTIAL_COLLECTION';
ALTER TYPE "JournalType" ADD VALUE 'PROTEST_ENTRY';
ALTER TYPE "JournalType" ADD VALUE 'LEGAL_TRANSFER';
ALTER TYPE "JournalType" ADD VALUE 'WRITE_OFF';
ALTER TYPE "JournalType" ADD VALUE 'REVERSAL';

-- checks_bills
ALTER TABLE "checks_bills" ADD COLUMN "currency" CHAR(3);
ALTER TABLE "checks_bills" ADD COLUMN "exchange_rate" DECIMAL(15,6);
ALTER TABLE "checks_bills" ADD COLUMN "amount_try" DECIMAL(15,2);
ALTER TABLE "checks_bills" ADD COLUMN "issue_date" TIMESTAMP(3);
ALTER TABLE "checks_bills" ADD COLUMN "presentation_date" TIMESTAMP(3);
ALTER TABLE "checks_bills" ADD COLUMN "bank_code" TEXT;
ALTER TABLE "checks_bills" ADD COLUMN "branch_code" TEXT;
ALTER TABLE "checks_bills" ADD COLUMN "iban" VARCHAR(34);
ALTER TABLE "checks_bills" ADD COLUMN "micr_line" TEXT;
ALTER TABLE "checks_bills" ADD COLUMN "drawer_name" TEXT;
ALTER TABLE "checks_bills" ADD COLUMN "drawer_tax_no" TEXT;
ALTER TABLE "checks_bills" ADD COLUMN "payee_name" TEXT;
ALTER TABLE "checks_bills" ADD COLUMN "risk_score" INTEGER;
ALTER TABLE "checks_bills" ADD COLUMN "protest_reason" TEXT;
ALTER TABLE "checks_bills" ADD COLUMN "legal_followup_started" BOOLEAN DEFAULT false;
ALTER TABLE "checks_bills" ADD COLUMN "legal_followup_date" TIMESTAMP(3);
ALTER TABLE "checks_bills" ADD COLUMN "gl_entry_id" TEXT;
ALTER TABLE "checks_bills" ADD COLUMN "is_reconciled" BOOLEAN DEFAULT false;
ALTER TABLE "checks_bills" ADD COLUMN "reconciled_at" TIMESTAMP(3);
ALTER TABLE "checks_bills" ADD COLUMN "tax_withholding_rate" DECIMAL(5,2);
ALTER TABLE "checks_bills" ADD COLUMN "tax_withholding_amount" DECIMAL(15,2);
ALTER TABLE "checks_bills" ADD COLUMN "vat_rate" DECIMAL(5,2);
ALTER TABLE "checks_bills" ADD COLUMN "vat_amount" DECIMAL(15,2);
ALTER TABLE "checks_bills" ADD COLUMN "internal_ref" TEXT;
ALTER TABLE "checks_bills" ADD COLUMN "external_ref" TEXT;
ALTER TABLE "checks_bills" ADD COLUMN "attachment_urls" JSONB;
ALTER TABLE "checks_bills" ADD COLUMN "tags" JSONB;
ALTER TABLE "checks_bills" ADD COLUMN "approved_by" TEXT;
ALTER TABLE "checks_bills" ADD COLUMN "approved_at" TIMESTAMP(3);

CREATE INDEX "checks_bills_tenantId_status_idx" ON "checks_bills"("tenantId", "status");
CREATE INDEX "checks_bills_tenantId_currency_idx" ON "checks_bills"("tenantId", "currency");

ALTER TABLE "checks_bills" ADD CONSTRAINT "checks_bills_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- check_bill_journals
ALTER TABLE "check_bill_journals" ADD COLUMN "accounting_date" TIMESTAMP(3);
ALTER TABLE "check_bill_journals" ADD COLUMN "fiscal_period_id" TEXT;
ALTER TABLE "check_bill_journals" ADD COLUMN "gl_journal_id" TEXT;
ALTER TABLE "check_bill_journals" ADD COLUMN "total_amount" DECIMAL(15,2);
ALTER TABLE "check_bill_journals" ADD COLUMN "total_count" INTEGER;
ALTER TABLE "check_bill_journals" ADD COLUMN "status" "CheckBillJournalPostingStatus";
ALTER TABLE "check_bill_journals" ADD COLUMN "approved_by_id" TEXT;
ALTER TABLE "check_bill_journals" ADD COLUMN "approved_at" TIMESTAMP(3);

CREATE INDEX "check_bill_journals_tenantId_status_idx" ON "check_bill_journals"("tenantId", "status");
CREATE INDEX "check_bill_journals_tenantId_date_idx" ON "check_bill_journals"("tenantId", "date");

ALTER TABLE "check_bill_journals" ADD CONSTRAINT "check_bill_journals_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- check_bill_journal_items
ALTER TABLE "check_bill_journal_items" ADD COLUMN "line_amount" DECIMAL(15,2);
ALTER TABLE "check_bill_journal_items" ADD COLUMN "line_note" TEXT;

-- check_bill_endorsements
ALTER TABLE "check_bill_endorsements" ADD COLUMN "endorsement_type" "CheckBillEndorsementType";
ALTER TABLE "check_bill_endorsements" ADD COLUMN "endorsed_amount" DECIMAL(15,2);
ALTER TABLE "check_bill_endorsements" ADD COLUMN "endorsement_reason" TEXT;
ALTER TABLE "check_bill_endorsements" ADD COLUMN "is_returned" BOOLEAN DEFAULT false;
ALTER TABLE "check_bill_endorsements" ADD COLUMN "returned_at" TIMESTAMP(3);
ALTER TABLE "check_bill_endorsements" ADD COLUMN "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- check_bill_collections
ALTER TABLE "check_bill_collections" ADD COLUMN "collection_method" "CheckBillCollectionMethod";
ALTER TABLE "check_bill_collections" ADD COLUMN "bank_transaction_ref" TEXT;
ALTER TABLE "check_bill_collections" ADD COLUMN "exchange_rate" DECIMAL(15,6);
ALTER TABLE "check_bill_collections" ADD COLUMN "amount_try" DECIMAL(15,2);
ALTER TABLE "check_bill_collections" ADD COLUMN "tax_withholding_amount" DECIMAL(15,2);
ALTER TABLE "check_bill_collections" ADD COLUMN "net_amount" DECIMAL(15,2);
ALTER TABLE "check_bill_collections" ADD COLUMN "gl_entry_id" TEXT;
ALTER TABLE "check_bill_collections" ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- check_bill_logs: changes TEXT -> JSONB
ALTER TABLE "check_bill_logs" ADD COLUMN "session_id" TEXT;
ALTER TABLE "check_bill_logs" ADD COLUMN "request_id" TEXT;
ALTER TABLE "check_bill_logs" ADD COLUMN "duration" INTEGER;
ALTER TABLE "check_bill_logs" ADD COLUMN "is_system" BOOLEAN DEFAULT false;

ALTER TABLE "check_bill_logs" ALTER COLUMN "changes" TYPE JSONB USING (
  CASE
    WHEN "changes" IS NULL THEN NULL
    ELSE to_jsonb("changes"::text)
  END
);

CREATE INDEX "check_bill_logs_tenantId_createdAt_idx" ON "check_bill_logs"("tenantId", "createdAt");

-- GL entries
CREATE TABLE "check_bill_gl_entries" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "check_bill_id" TEXT NOT NULL,
    "journal_id" TEXT,
    "gl_journal_no" TEXT NOT NULL,
    "accounting_date" TIMESTAMP(3) NOT NULL,
    "fiscal_year" INTEGER NOT NULL,
    "fiscal_period" INTEGER NOT NULL,
    "debit_account_code" TEXT NOT NULL,
    "credit_account_code" TEXT NOT NULL,
    "debit_amount" DECIMAL(15,2) NOT NULL,
    "credit_amount" DECIMAL(15,2) NOT NULL,
    "currency" CHAR(3) NOT NULL,
    "exchange_rate" DECIMAL(15,6),
    "description" TEXT NOT NULL,
    "entry_type" "CheckBillGlEntryType" NOT NULL,
    "status" "CheckBillGlEntryStatus" NOT NULL,
    "reversal_of_id" TEXT,
    "posted_by_id" TEXT,
    "posted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "check_bill_gl_entries_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "check_bill_gl_entries_tenant_id_idx" ON "check_bill_gl_entries"("tenant_id");
CREATE INDEX "check_bill_gl_entries_tenant_id_check_bill_id_idx" ON "check_bill_gl_entries"("tenant_id", "check_bill_id");
CREATE INDEX "check_bill_gl_entries_tenant_id_journal_id_idx" ON "check_bill_gl_entries"("tenant_id", "journal_id");
CREATE INDEX "check_bill_gl_entries_tenant_id_status_idx" ON "check_bill_gl_entries"("tenant_id", "status");

ALTER TABLE "check_bill_gl_entries" ADD CONSTRAINT "check_bill_gl_entries_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "check_bill_gl_entries" ADD CONSTRAINT "check_bill_gl_entries_check_bill_id_fkey" FOREIGN KEY ("check_bill_id") REFERENCES "checks_bills"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "check_bill_gl_entries" ADD CONSTRAINT "check_bill_gl_entries_journal_id_fkey" FOREIGN KEY ("journal_id") REFERENCES "check_bill_journals"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "check_bill_gl_entries" ADD CONSTRAINT "check_bill_gl_entries_reversal_of_id_fkey" FOREIGN KEY ("reversal_of_id") REFERENCES "check_bill_gl_entries"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "check_bill_gl_entries" ADD CONSTRAINT "check_bill_gl_entries_posted_by_id_fkey" FOREIGN KEY ("posted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Risk limits
CREATE TABLE "check_bill_risk_limits" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "limit_type" "CheckBillRiskLimitType" NOT NULL,
    "limit_amount" DECIMAL(15,2),
    "limit_days" INTEGER,
    "current_exposure" DECIMAL(15,2) NOT NULL,
    "utilization_rate" DECIMAL(5,2) NOT NULL,
    "risk_rating" "CheckBillRiskRating",
    "alert_threshold" DECIMAL(5,2),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "valid_from" TIMESTAMP(3) NOT NULL,
    "valid_until" TIMESTAMP(3),
    "approved_by_id" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "check_bill_risk_limits_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "check_bill_risk_limits_tenant_id_idx" ON "check_bill_risk_limits"("tenant_id");
CREATE INDEX "check_bill_risk_limits_tenant_id_account_id_idx" ON "check_bill_risk_limits"("tenant_id", "account_id");

ALTER TABLE "check_bill_risk_limits" ADD CONSTRAINT "check_bill_risk_limits_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "check_bill_risk_limits" ADD CONSTRAINT "check_bill_risk_limits_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "check_bill_risk_limits" ADD CONSTRAINT "check_bill_risk_limits_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Reminders
CREATE TABLE "check_bill_reminders" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "check_bill_id" TEXT NOT NULL,
    "reminder_type" "CheckBillReminderType" NOT NULL,
    "trigger_days_before" INTEGER NOT NULL,
    "scheduled_at" TIMESTAMP(3) NOT NULL,
    "sent_at" TIMESTAMP(3),
    "status" "CheckBillReminderDeliveryStatus" NOT NULL,
    "channel" "CheckBillReminderChannel" NOT NULL,
    "recipients" JSONB NOT NULL,
    "template_id" TEXT,
    "retry_count" INTEGER DEFAULT 0,
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "check_bill_reminders_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "check_bill_reminders_tenant_id_idx" ON "check_bill_reminders"("tenant_id");
CREATE INDEX "check_bill_reminders_tenant_id_check_bill_id_idx" ON "check_bill_reminders"("tenant_id", "check_bill_id");
CREATE INDEX "check_bill_reminders_tenant_id_scheduled_at_idx" ON "check_bill_reminders"("tenant_id", "scheduled_at");

ALTER TABLE "check_bill_reminders" ADD CONSTRAINT "check_bill_reminders_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "check_bill_reminders" ADD CONSTRAINT "check_bill_reminders_check_bill_id_fkey" FOREIGN KEY ("check_bill_id") REFERENCES "checks_bills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Protest tracking
CREATE TABLE "check_bill_protest_tracking" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "check_bill_id" TEXT NOT NULL,
    "protest_date" TIMESTAMP(3) NOT NULL,
    "protest_reason" TEXT NOT NULL,
    "protesting_notary_id" TEXT,
    "protest_no" TEXT,
    "legal_status" "CheckBillLegalCaseStatus" NOT NULL,
    "lawsuit_date" TIMESTAMP(3),
    "lawsuit_no" TEXT,
    "court_id" TEXT,
    "judgment_date" TIMESTAMP(3),
    "judgment_amount" DECIMAL(15,2),
    "execution_date" TIMESTAMP(3),
    "execution_no" TEXT,
    "collected_via_legal" DECIMAL(15,2),
    "lawyer_id" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "check_bill_protest_tracking_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "check_bill_protest_tracking_tenant_id_idx" ON "check_bill_protest_tracking"("tenant_id");
CREATE INDEX "check_bill_protest_tracking_tenant_id_check_bill_id_idx" ON "check_bill_protest_tracking"("tenant_id", "check_bill_id");

ALTER TABLE "check_bill_protest_tracking" ADD CONSTRAINT "check_bill_protest_tracking_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "check_bill_protest_tracking" ADD CONSTRAINT "check_bill_protest_tracking_check_bill_id_fkey" FOREIGN KEY ("check_bill_id") REFERENCES "checks_bills"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "check_bill_protest_tracking" ADD CONSTRAINT "check_bill_protest_tracking_lawyer_id_fkey" FOREIGN KEY ("lawyer_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Bank submissions
CREATE TABLE "check_bill_bank_submissions" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "check_bill_id" TEXT NOT NULL,
    "bank_account_id" TEXT NOT NULL,
    "submission_type" "CheckBillBankSubmissionType" NOT NULL,
    "submitted_at" TIMESTAMP(3) NOT NULL,
    "submission_ref" TEXT,
    "expected_date" TIMESTAMP(3),
    "actual_date" TIMESTAMP(3),
    "status" "CheckBillBankSubmissionStatus" NOT NULL,
    "bank_fee" DECIMAL(15,2),
    "rejection_reason" TEXT,
    "created_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "check_bill_bank_submissions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "check_bill_bank_submissions_tenant_id_idx" ON "check_bill_bank_submissions"("tenant_id");
CREATE INDEX "check_bill_bank_submissions_tenant_id_check_bill_id_idx" ON "check_bill_bank_submissions"("tenant_id", "check_bill_id");

ALTER TABLE "check_bill_bank_submissions" ADD CONSTRAINT "check_bill_bank_submissions_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "check_bill_bank_submissions" ADD CONSTRAINT "check_bill_bank_submissions_check_bill_id_fkey" FOREIGN KEY ("check_bill_id") REFERENCES "checks_bills"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "check_bill_bank_submissions" ADD CONSTRAINT "check_bill_bank_submissions_bank_account_id_fkey" FOREIGN KEY ("bank_account_id") REFERENCES "bank_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "check_bill_bank_submissions" ADD CONSTRAINT "check_bill_bank_submissions_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Discounting
CREATE TABLE "check_bill_discounting" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "check_bill_id" TEXT NOT NULL,
    "bank_account_id" TEXT NOT NULL,
    "face_value" DECIMAL(15,2) NOT NULL,
    "discount_rate" DECIMAL(7,4) NOT NULL,
    "discount_amount" DECIMAL(15,2) NOT NULL,
    "banking_commission" DECIMAL(15,2),
    "net_proceeds" DECIMAL(15,2) NOT NULL,
    "discount_date" TIMESTAMP(3) NOT NULL,
    "maturity_date" TIMESTAMP(3) NOT NULL,
    "status" "CheckBillDiscountingStatus" NOT NULL,
    "gl_entry_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "check_bill_discounting_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "check_bill_discounting_tenant_id_idx" ON "check_bill_discounting"("tenant_id");
CREATE INDEX "check_bill_discounting_tenant_id_check_bill_id_idx" ON "check_bill_discounting"("tenant_id", "check_bill_id");

ALTER TABLE "check_bill_discounting" ADD CONSTRAINT "check_bill_discounting_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "check_bill_discounting" ADD CONSTRAINT "check_bill_discounting_check_bill_id_fkey" FOREIGN KEY ("check_bill_id") REFERENCES "checks_bills"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "check_bill_discounting" ADD CONSTRAINT "check_bill_discounting_bank_account_id_fkey" FOREIGN KEY ("bank_account_id") REFERENCES "bank_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Reconciliation
CREATE TABLE "check_bill_reconciliation" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "check_bill_id" TEXT NOT NULL,
    "bank_account_id" TEXT NOT NULL,
    "reconciliation_date" TIMESTAMP(3) NOT NULL,
    "bank_amount" DECIMAL(15,2) NOT NULL,
    "system_amount" DECIMAL(15,2) NOT NULL,
    "difference" DECIMAL(15,2) NOT NULL,
    "status" "CheckBillReconciliationStatus" NOT NULL,
    "bank_reference" TEXT,
    "resolved_by_id" TEXT,
    "resolved_at" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "check_bill_reconciliation_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "check_bill_reconciliation_tenant_id_idx" ON "check_bill_reconciliation"("tenant_id");
CREATE INDEX "check_bill_reconciliation_tenant_id_check_bill_id_idx" ON "check_bill_reconciliation"("tenant_id", "check_bill_id");

ALTER TABLE "check_bill_reconciliation" ADD CONSTRAINT "check_bill_reconciliation_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "check_bill_reconciliation" ADD CONSTRAINT "check_bill_reconciliation_check_bill_id_fkey" FOREIGN KEY ("check_bill_id") REFERENCES "checks_bills"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "check_bill_reconciliation" ADD CONSTRAINT "check_bill_reconciliation_bank_account_id_fkey" FOREIGN KEY ("bank_account_id") REFERENCES "bank_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "check_bill_reconciliation" ADD CONSTRAINT "check_bill_reconciliation_resolved_by_id_fkey" FOREIGN KEY ("resolved_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Approval workflows
CREATE TABLE "check_bill_approval_workflows" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "check_bill_id" TEXT,
    "journal_id" TEXT,
    "workflow_type" "CheckBillApprovalWorkflowType" NOT NULL,
    "step" INTEGER NOT NULL,
    "approver_id" TEXT NOT NULL,
    "status" "CheckBillApprovalStepStatus" NOT NULL,
    "action_at" TIMESTAMP(3),
    "comments" TEXT,
    "delegated_to_id" TEXT,
    "amount_threshold" DECIMAL(15,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "check_bill_approval_workflows_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "check_bill_approval_workflows_tenant_id_idx" ON "check_bill_approval_workflows"("tenant_id");
CREATE INDEX "check_bill_approval_workflows_tenant_id_check_bill_id_idx" ON "check_bill_approval_workflows"("tenant_id", "check_bill_id");
CREATE INDEX "check_bill_approval_workflows_tenant_id_journal_id_idx" ON "check_bill_approval_workflows"("tenant_id", "journal_id");

ALTER TABLE "check_bill_approval_workflows" ADD CONSTRAINT "check_bill_approval_workflows_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "check_bill_approval_workflows" ADD CONSTRAINT "check_bill_approval_workflows_check_bill_id_fkey" FOREIGN KEY ("check_bill_id") REFERENCES "checks_bills"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "check_bill_approval_workflows" ADD CONSTRAINT "check_bill_approval_workflows_journal_id_fkey" FOREIGN KEY ("journal_id") REFERENCES "check_bill_journals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "check_bill_approval_workflows" ADD CONSTRAINT "check_bill_approval_workflows_approver_id_fkey" FOREIGN KEY ("approver_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "check_bill_approval_workflows" ADD CONSTRAINT "check_bill_approval_workflows_delegated_to_id_fkey" FOREIGN KEY ("delegated_to_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
