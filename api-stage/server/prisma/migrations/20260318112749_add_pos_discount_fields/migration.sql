-- CreateEnum
CREATE TYPE "TenantType" AS ENUM ('INDIVIDUAL', 'CORPORATE');

-- CreateEnum
CREATE TYPE "LoanStatus" AS ENUM ('ACTIVE', 'CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CreditPlanStatus" AS ENUM ('PENDING', 'PAID', 'OVERDUE', 'PARTIALLY_PAID');

-- CreateEnum
CREATE TYPE "CostingMethod" AS ENUM ('WEIGHTED_AVERAGE', 'FIFO', 'LIFO', 'FEFO', 'STANDARD_COST');

-- CreateEnum
CREATE TYPE "JournalType" AS ENUM ('ENTRY_PAYROLL', 'EXIT_PAYROLL', 'CUSTOMER_DOCUMENT_ENTRY', 'CUSTOMER_DOCUMENT_EXIT', 'OWN_DOCUMENT_ENTRY', 'OWN_DOCUMENT_EXIT', 'BANK_COLLECTION_ENDORSEMENT', 'BANK_GUARANTEE_ENDORSEMENT', 'ACCOUNT_DOCUMENT_ENDORSEMENT', 'DEBIT_DOCUMENT_EXIT', 'RETURN_PAYROLL');

-- CreateEnum
CREATE TYPE "RiskStatus" AS ENUM ('NORMAL', 'RISKY', 'BLACK_LIST', 'IN_COLLECTION');

-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('DELIVERY', 'INVOICE', 'CENTER', 'BRANCH', 'WAREHOUSE', 'OTHER', 'SHIPMENT');

-- CreateEnum
CREATE TYPE "VehicleServiceStatus" AS ENUM ('WAITING', 'CUSTOMER_APPROVAL_PENDING', 'IN_PROGRESS', 'PART_WAITING', 'PARTS_SUPPLIED', 'VEHICLE_READY', 'COMPLETED');

-- CreateEnum
CREATE TYPE "TenantStatus" AS ENUM ('TRIAL', 'ACTIVE', 'SUSPENDED', 'CANCELLED', 'PURGED', 'EXPIRED', 'CHURNED', 'DELETED', 'PENDING');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('PENDING', 'TRIAL', 'ACTIVE', 'PAST_DUE', 'CANCELED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "BillingPeriod" AS ENUM ('MONTHLY', 'QUARTERLY', 'YEARLY', 'LIFETIME');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'REFUNDED', 'CANCELED');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN', 'USER', 'VIEWER', 'SUPPORT', 'MANAGER', 'TECHNICIAN', 'WORKSHOP_MANAGER', 'RECEPTION', 'SERVICE_MANAGER', 'PROCUREMENT', 'WAREHOUSE', 'ADVISOR', 'PARTS_MANAGER');

-- CreateEnum
CREATE TYPE "PriceCardType" AS ENUM ('SALE', 'PURCHASE', 'CAMPAIGN', 'LIST');

-- CreateEnum
CREATE TYPE "MovementType" AS ENUM ('ENTRY', 'EXIT', 'SALE', 'RETURN', 'CANCELLATION_ENTRY', 'CANCELLATION_EXIT', 'COUNT', 'COUNT_SURPLUS', 'COUNT_SHORTAGE');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('CUSTOMER', 'SUPPLIER', 'BOTH');

-- CreateEnum
CREATE TYPE "CompanyType" AS ENUM ('CORPORATE', 'INDIVIDUAL');

-- CreateEnum
CREATE TYPE "DebitCredit" AS ENUM ('DEBIT', 'CREDIT', 'CARRY_FORWARD');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('INVOICE', 'COLLECTION', 'PAYMENT', 'CHECK_PROMISSORY', 'CARRY_FORWARD', 'CORRECTION', 'CHECK_ENTRY', 'CHECK_EXIT', 'RETURN');

-- CreateEnum
CREATE TYPE "BankAccountType" AS ENUM ('DEMAND_DEPOSIT', 'LOAN', 'POS', 'COMPANY_CREDIT_CARD', 'TIME_DEPOSIT', 'INVESTMENT', 'GOLD', 'CURRENCY', 'OTHER');

-- CreateEnum
CREATE TYPE "BankMovementType" AS ENUM ('INCOMING', 'OUTGOING');

-- CreateEnum
CREATE TYPE "BankMovementSubType" AS ENUM ('INCOMING_TRANSFER', 'OUTGOING_TRANSFER', 'LOAN_USAGE', 'LOAN_PAYMENT', 'GUARANTEE_CHECK', 'GUARANTEE_PROMISSORY', 'POS_COLLECTION', 'CARD_EXPENSE', 'CARD_PAYMENT', 'TRANSFER', 'OTHER', 'LOAN_INSTALLMENT_PAYMENT');

-- CreateEnum
CREATE TYPE "LoanType" AS ENUM ('EQUAL_INSTALLMENT', 'REVOLVING');

-- CreateEnum
CREATE TYPE "CashboxType" AS ENUM ('CASH', 'POS', 'COMPANY_CREDIT_CARD', 'BANK', 'CHECK_PROMISSORY');

-- CreateEnum
CREATE TYPE "CashboxMovementType" AS ENUM ('COLLECTION', 'PAYMENT', 'INCOMING_TRANSFER', 'OUTGOING_TRANSFER', 'CREDIT_CARD', 'TRANSFER', 'CARRY_FORWARD', 'CHECK_RECEIVED', 'CHECK_GIVEN', 'PROMISSORY_RECEIVED', 'PROMISSORY_GIVEN', 'CHECK_COLLECTION', 'PROMISSORY_COLLECTION');

-- CreateEnum
CREATE TYPE "LogAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'STATUS_CHANGE', 'CANCELLATION', 'RESTORE', 'CONVERTED_TO_ORDER', 'EINVOICE_SENT', 'EINVOICE_SEND_ERROR', 'SHIPMENT', 'ENDORSEMENT');

-- CreateEnum
CREATE TYPE "InvoiceType" AS ENUM ('PURCHASE', 'SALE', 'SALES_RETURN', 'PURCHASE_RETURN');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'OPEN', 'CLOSED', 'PARTIALLY_PAID', 'APPROVED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "EInvoiceStatus" AS ENUM ('PENDING', 'SENT', 'ERROR', 'DRAFT');

-- CreateEnum
CREATE TYPE "CollectionType" AS ENUM ('COLLECTION', 'PAYMENT');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'CREDIT_CARD', 'BANK_TRANSFER', 'CHECK', 'PROMISSORY_NOTE', 'GIFT_CARD', 'LOAN_ACCOUNT');

-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('SALE', 'PURCHASE');

-- CreateEnum
CREATE TYPE "SalesOrderStatus" AS ENUM ('PENDING', 'PREPARING', 'PREPARED', 'SHIPPED', 'PARTIALLY_SHIPPED', 'INVOICED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "QuoteType" AS ENUM ('SALE', 'PURCHASE');

-- CreateEnum
CREATE TYPE "QuoteStatus" AS ENUM ('OFFERED', 'APPROVED', 'REJECTED', 'CONVERTED_TO_ORDER');

-- CreateEnum
CREATE TYPE "StocktakeType" AS ENUM ('PRODUCT_BASED', 'SHELF_BASED');

-- CreateEnum
CREATE TYPE "StocktakeStatus" AS ENUM ('DRAFT', 'COMPLETED', 'APPROVED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "StockMoveType" AS ENUM ('PUT_AWAY', 'TRANSFER', 'PICKING', 'ADJUSTMENT', 'SALE', 'RETURN', 'DAMAGE');

-- CreateEnum
CREATE TYPE "TransferType" AS ENUM ('INCOMING', 'OUTGOING');

-- CreateEnum
CREATE TYPE "CheckBillType" AS ENUM ('CHECK', 'PROMISSORY');

-- CreateEnum
CREATE TYPE "PortfolioType" AS ENUM ('CREDIT', 'DEBIT');

-- CreateEnum
CREATE TYPE "CheckBillStatus" AS ENUM ('IN_PORTFOLIO', 'UNPAID', 'GIVEN_TO_BANK', 'COLLECTED', 'PAID', 'ENDORSED', 'RETURNED', 'WITHOUT_COVERAGE', 'IN_BANK_COLLECTION', 'IN_BANK_GUARANTEE');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'NOT_SPECIFIED');

-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('SINGLE', 'MARRIED');

-- CreateEnum
CREATE TYPE "EmployeePaymentType" AS ENUM ('ENTITLEMENT', 'SALARY', 'ADVANCE', 'BONUS', 'DEDUCTION', 'ALLOCATION', 'ALLOCATION_RETURN');

-- CreateEnum
CREATE TYPE "ModuleType" AS ENUM ('WAREHOUSE', 'CASHBOX', 'PERSONNEL', 'PRODUCT', 'CUSTOMER', 'INVOICE_SALES', 'INVOICE_PURCHASE', 'ORDER_SALES', 'ORDER_PURCHASE', 'INVENTORY_COUNT', 'QUOTE', 'DELIVERY_NOTE_SALES', 'DELIVERY_NOTE_PURCHASE', 'WAREHOUSE_TRANSFER', 'TECHNICIAN', 'WORK_ORDER', 'SERVICE_INVOICE');

-- CreateEnum
CREATE TYPE "DeliveryNoteSourceType" AS ENUM ('ORDER', 'DIRECT', 'INVOICE_AUTOMATIC');

-- CreateEnum
CREATE TYPE "DeliveryNoteStatus" AS ENUM ('NOT_INVOICED', 'INVOICED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PARTIAL', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "OrderItemStatus" AS ENUM ('PENDING', 'PARTIAL', 'COMPLETED');

-- CreateEnum
CREATE TYPE "SimpleOrderStatus" AS ENUM ('AWAITING_APPROVAL', 'APPROVED', 'ORDER_PLACED', 'INVOICED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PurchaseOrderLocalStatus" AS ENUM ('PENDING', 'PREPARING', 'PREPARED', 'SHIPPED', 'PARTIALLY_SHIPPED', 'ORDER_PLACED', 'INVOICED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "LicenseType" AS ENUM ('BASE_PLAN', 'MODULE');

-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "WorkOrderStatus" AS ENUM ('WAITING_DIAGNOSIS', 'PENDING_APPROVAL', 'APPROVED_IN_PROGRESS', 'PART_WAITING', 'PARTS_SUPPLIED', 'VEHICLE_READY', 'INVOICED_CLOSED', 'CLOSED_WITHOUT_INVOICE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PartWorkflowStatus" AS ENUM ('NOT_STARTED', 'PARTS_SUPPLIED_DIRECT', 'PARTS_PENDING', 'PARTIALLY_SUPPLIED', 'ALL_PARTS_SUPPLIED');

-- CreateEnum
CREATE TYPE "VehicleWorkflowStatus" AS ENUM ('WAITING', 'IN_PROGRESS', 'READY', 'DELIVERED');

-- CreateEnum
CREATE TYPE "PartRequestStatus" AS ENUM ('REQUESTED', 'SUPPLIED', 'USED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "WorkOrderItemType" AS ENUM ('LABOR', 'PART');

-- CreateEnum
CREATE TYPE "InventoryTransactionType" AS ENUM ('DEDUCTION', 'RETURN');

-- CreateEnum
CREATE TYPE "TransferStatus" AS ENUM ('PREPARING', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SalaryStatus" AS ENUM ('UNPAID', 'PARTIALLY_PAID', 'FULLY_PAID', 'PENDING');

-- CreateEnum
CREATE TYPE "AdvanceStatus" AS ENUM ('OPEN', 'PARTIAL', 'CLOSED');

-- CreateEnum
CREATE TYPE "VehicleExpenseType" AS ENUM ('FUEL', 'MAINTENANCE', 'INSPECTION', 'TRAFFIC_INSURANCE', 'CASCO', 'PENALTY', 'HGS_OGS', 'PARKING', 'CAR_WASH', 'OTHER');

-- CreateEnum
CREATE TYPE "PosSessionStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "CouponDiscountType" AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT');

-- CreateEnum
CREATE TYPE "EInvoiceScenario" AS ENUM ('TICARIFATURA', 'TEMELFATURA', 'IHRACAT');

-- CreateEnum
CREATE TYPE "LeaveStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "OvertimeType" AS ENUM ('WEEKDAY', 'WEEKEND', 'PUBLIC_HOLIDAY');

-- CreateEnum
CREATE TYPE "OvertimeStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'PAID');

-- CreateEnum
CREATE TYPE "AssetCondition" AS ENUM ('GOOD', 'DAMAGED', 'LOST', 'RETURNED');

-- CreateEnum
CREATE TYPE "PerformanceStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'ACKNOWLEDGED', 'CLOSED');

-- CreateEnum
CREATE TYPE "MaintenanceType" AS ENUM ('PERIODIC', 'PREVENTIVE', 'PREDICTIVE', 'CORRECTIVE');

-- CreateTable
CREATE TABLE "tenants" (
    "id" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subdomain" TEXT,
    "domain" TEXT,
    "status" "TenantStatus" NOT NULL DEFAULT 'TRIAL',
    "cancelledAt" TIMESTAMP(3),
    "purgedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantType" "TenantType" NOT NULL DEFAULT 'CORPORATE',

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_settings" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "companyName" TEXT,
    "taxNumber" TEXT,
    "address" TEXT,
    "logoUrl" TEXT,
    "features" JSONB,
    "limits" JSONB,
    "timezone" TEXT NOT NULL DEFAULT 'Europe/Istanbul',
    "locale" TEXT NOT NULL DEFAULT 'tr-TR',
    "currency" TEXT NOT NULL DEFAULT 'TRY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "city" TEXT,
    "companyType" TEXT DEFAULT 'COMPANY',
    "country" TEXT,
    "district" TEXT,
    "email" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "mersisNo" TEXT,
    "neighborhood" TEXT,
    "phone" TEXT,
    "postalCode" TEXT,
    "taxOffice" TEXT,
    "tcNo" TEXT,
    "website" TEXT,

    CONSTRAINT "tenant_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plans" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'TRY',
    "billingPeriod" "BillingPeriod" NOT NULL DEFAULT 'MONTHLY',
    "trialDays" INTEGER NOT NULL DEFAULT 0,
    "baseUserLimit" INTEGER NOT NULL DEFAULT 1,
    "features" JSONB,
    "limits" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPopular" BOOLEAN NOT NULL DEFAULT false,
    "isBasePlan" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'TRIAL',
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) NOT NULL,
    "trialEndsAt" TIMESTAMP(3),
    "canceledAt" TIMESTAMP(3),
    "nextBillingDate" TIMESTAMP(3),
    "lastBillingDate" TIMESTAMP(3),
    "autoRenew" BOOLEAN NOT NULL DEFAULT true,
    "iyzicoSubscriptionRef" TEXT,
    "additionalUsers" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reconciliation_logs" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "invoice_id" TEXT,
    "account_id" TEXT,
    "product_id" TEXT,
    "check_type" TEXT NOT NULL,
    "is_consistent" BOOLEAN NOT NULL,
    "discrepancy_data" JSONB,
    "checked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "checked_by" TEXT,

    CONSTRAINT "reconciliation_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'TRY',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "iyzicoPaymentId" TEXT,
    "iyzicoToken" TEXT,
    "conversationId" TEXT,
    "invoiceNumber" TEXT,
    "invoiceUrl" TEXT,
    "paidAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "refundedAt" TIMESTAMP(3),
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "paymentMethod" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "tenantId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resource" TEXT,
    "resourceId" TEXT,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "fullName" TEXT NOT NULL,
    "phone" TEXT,
    "avatarUrl" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "department" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "refreshToken" TEXT,
    "tokenVersion" INTEGER NOT NULL DEFAULT 0,
    "tenantId" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "roleId" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "refreshToken" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "unit_text" TEXT NOT NULL,
    "critical_qty" INTEGER NOT NULL DEFAULT 0,
    "category_text" TEXT,
    "main_category" TEXT,
    "sub_category" TEXT,
    "brand_text" TEXT,
    "model" TEXT,
    "oem" TEXT,
    "shelf" TEXT,
    "barcode" TEXT,
    "supplier_code" TEXT,
    "equivalency_group_id" TEXT,
    "vehicle_brand" TEXT,
    "vehicle_model" TEXT,
    "vehicle_engine_size" TEXT,
    "vehicle_fuel_type" TEXT,
    "is_category_only" BOOLEAN DEFAULT false,
    "is_brand_only" BOOLEAN DEFAULT false,
    "weight" DECIMAL(12,4),
    "weight_unit" TEXT,
    "dimensions" TEXT,
    "country_of_origin" TEXT,
    "warranty_months" INTEGER,
    "internal_note" TEXT,
    "min_order_qty" INTEGER,
    "lead_time_days" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "unit_id" TEXT,
    "vat_rate" INTEGER NOT NULL DEFAULT 20,
    "brand_id" TEXT,
    "category_id" TEXT,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brands" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "logo_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "parent_id" TEXT,
    "level" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_vehicle_compatibilities" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "vehicle_brand" TEXT NOT NULL,
    "vehicle_model" TEXT,
    "vehicle_engine_size" TEXT,
    "vehicle_fuel_type" TEXT,
    "year_from" INTEGER,
    "year_to" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_vehicle_compatibilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price_cards" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "type" "PriceCardType" NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'TRY',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "effective_from" TIMESTAMP(3),
    "effective_to" TIMESTAMP(3),
    "vat_rate" DECIMAL(5,2) NOT NULL DEFAULT 20,
    "min_quantity" DECIMAL(12,2) NOT NULL DEFAULT 1,
    "note" TEXT,
    "created_by" TEXT,
    "updated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "price_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_cost_history" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "cost" DECIMAL(12,4) NOT NULL,
    "method" TEXT NOT NULL DEFAULT 'WEIGHTED_AVERAGE',
    "computed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "brand" TEXT,
    "main_category" TEXT,
    "sub_category" TEXT,
    "note" TEXT,
    "tenantId" TEXT,

    CONSTRAINT "stock_cost_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equivalency_groups" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "equivalency_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_equivalents" (
    "id" TEXT NOT NULL,
    "product1_id" TEXT NOT NULL,
    "product2_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tenantId" TEXT,

    CONSTRAINT "product_equivalents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_movements" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "movement_type" "MovementType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "warehouseId" TEXT,
    "invoice_item_id" TEXT,
    "tenantId" TEXT,
    "deleted_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "is_reversed" BOOLEAN NOT NULL DEFAULT false,
    "reversal_of_id" TEXT,
    "record_type" TEXT,

    CONSTRAINT "product_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "AccountType" NOT NULL,
    "company_type" "CompanyType" DEFAULT 'CORPORATE',
    "tax_number" TEXT,
    "tax_office" TEXT,
    "national_id" TEXT,
    "full_name" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "country" TEXT DEFAULT 'Turkey',
    "city" TEXT,
    "district" TEXT,
    "address" TEXT,
    "contact_name" TEXT,
    "balance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "payment_term_days" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "updated_by" TEXT,
    "sales_agent_id" TEXT,
    "credit_limit" DECIMAL(12,2),
    "credit_status" "RiskStatus" DEFAULT 'NORMAL',
    "collateral_amount" DECIMAL(12,2),
    "sector" TEXT,
    "custom_code1" TEXT,
    "custom_code2" TEXT,
    "website" TEXT,
    "fax" TEXT,
    "due_days" INTEGER,
    "currency" TEXT,
    "bank_info" TEXT,
    "price_list_id" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_contacts" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "title" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "extension" TEXT,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT,

    CONSTRAINT "account_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_addresses" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "AddressType" NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT,
    "district" TEXT,
    "postal_code" TEXT,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT,

    CONSTRAINT "account_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_banks" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "bank_name" TEXT NOT NULL,
    "branch_name" TEXT,
    "branch_code" TEXT,
    "account_no" TEXT,
    "iban" TEXT NOT NULL,
    "currency" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT,

    CONSTRAINT "account_banks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_movements" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "type" "DebitCredit" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "balance" DECIMAL(12,2) NOT NULL,
    "document_type" "DocumentType",
    "document_no" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,
    "deleted_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "invoice_id" TEXT,
    "is_reversed" BOOLEAN NOT NULL DEFAULT false,
    "reversal_of_id" TEXT,
    "is_reversal" BOOLEAN NOT NULL DEFAULT false,
    "record_type" TEXT,

    CONSTRAINT "account_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cashboxes" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "tenantId" TEXT,
    "name" TEXT NOT NULL,
    "type" "CashboxType" NOT NULL,
    "balance" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_retail" BOOLEAN NOT NULL DEFAULT false,
    "warehouse_id" TEXT,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,

    CONSTRAINT "cashboxes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banks" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "name" TEXT NOT NULL,
    "branch" TEXT,
    "city" TEXT,
    "contact_name" TEXT,
    "phone" TEXT,
    "logo" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_accounts" (
    "id" TEXT NOT NULL,
    "bank_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT,
    "account_no" TEXT,
    "iban" TEXT,
    "type" "BankAccountType" NOT NULL,
    "balance" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "commission_rate" DECIMAL(5,2),
    "credit_limit" DECIMAL(15,2),
    "used_credit_limit" DECIMAL(15,2),
    "card_limit" DECIMAL(15,2),
    "statement_day" INTEGER,
    "payment_due_day" INTEGER,
    "terminal_no" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT,

    CONSTRAINT "bank_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_account_movements" (
    "id" TEXT NOT NULL,
    "bank_account_id" TEXT NOT NULL,
    "movement_type" "BankMovementType" NOT NULL,
    "movement_sub_type" "BankMovementSubType",
    "amount" DECIMAL(15,2) NOT NULL,
    "commission_rate" DECIMAL(5,2),
    "commission_amount" DECIMAL(15,2),
    "net_amount" DECIMAL(15,2),
    "balance" DECIMAL(15,2) NOT NULL,
    "notes" TEXT,
    "reference_no" TEXT,
    "account_id" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tenant_id" TEXT,
    "deleted_by" TEXT,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "bank_account_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_loans" (
    "id" TEXT NOT NULL,
    "bank_account_id" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "total_repayment" DECIMAL(15,2) NOT NULL,
    "total_interest" DECIMAL(15,2) NOT NULL,
    "installment_count" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "loan_type" "LoanType" NOT NULL DEFAULT 'EQUAL_INSTALLMENT',
    "status" "LoanStatus" NOT NULL DEFAULT 'ACTIVE',
    "annual_interest_rate" DECIMAL(5,2),
    "payment_frequency" INTEGER NOT NULL DEFAULT 1,
    "tenantId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bank_loans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_loan_plans" (
    "id" TEXT NOT NULL,
    "loan_id" TEXT NOT NULL,
    "installment_no" INTEGER NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "paid_amount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "status" "CreditPlanStatus" NOT NULL DEFAULT 'PENDING',
    "tenantId" TEXT,

    CONSTRAINT "bank_loan_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_credit_cards" (
    "id" TEXT NOT NULL,
    "cashbox_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bank_name" TEXT NOT NULL,
    "card_type" TEXT,
    "last_four_digits" TEXT,
    "credit_limit" DECIMAL(15,2),
    "balance" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "statement_date" TIMESTAMP(3),
    "payment_due_date" TIMESTAMP(3),
    "tenantId" TEXT,

    CONSTRAINT "company_credit_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_credit_card_movements" (
    "id" TEXT NOT NULL,
    "card_id" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "balance" DECIMAL(15,2) NOT NULL,
    "notes" TEXT,
    "account_id" TEXT,
    "reference_no" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tenantId" TEXT,

    CONSTRAINT "company_credit_card_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cashbox_movements" (
    "id" TEXT NOT NULL,
    "cashbox_id" TEXT NOT NULL,
    "movement_type" "CashboxMovementType" NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "commission_amount" DECIMAL(15,2),
    "bsmv_amount" DECIMAL(15,2),
    "net_amount" DECIMAL(15,2),
    "balance" DECIMAL(15,2) NOT NULL,
    "document_type" TEXT,
    "document_no" TEXT,
    "account_id" TEXT,
    "notes" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_transferred" BOOLEAN NOT NULL DEFAULT false,
    "transfer_date" TIMESTAMP(3),
    "created_by" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "tenant_id" TEXT,

    CONSTRAINT "cashbox_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL,
    "invoice_no" TEXT NOT NULL,
    "invoice_type" "InvoiceType" NOT NULL,
    "tenantId" TEXT,
    "account_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "due_date" TIMESTAMP(3),
    "discount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(12,2) NOT NULL,
    "vat_amount" DECIMAL(12,2) NOT NULL,
    "sct_total" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "withholding_total" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "grand_total" DECIMAL(12,2) NOT NULL,
    "foreign_total" DECIMAL(12,2),
    "currency" TEXT NOT NULL DEFAULT 'TRY',
    "exchange_rate" DECIMAL(10,4) NOT NULL DEFAULT 1,
    "notes" TEXT,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'OPEN',
    "payable_amount" DECIMAL(12,2),
    "paid_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "order_no" TEXT,
    "purchase_order_id" TEXT,
    "procurement_order_id" TEXT,
    "delivery_note_id" TEXT,
    "purchase_delivery_note_id" TEXT,
    "einvoice_status" "EInvoiceStatus" DEFAULT 'PENDING',
    "einvoice_ettn" TEXT,
    "e_scenario" TEXT,
    "e_invoice_type" TEXT,
    "gib_alias" TEXT,
    "delivery_method" TEXT,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sales_agent_id" TEXT,
    "warehouse_id" TEXT,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_logs" (
    "id" TEXT NOT NULL,
    "invoice_id" TEXT NOT NULL,
    "user_id" TEXT,
    "action_type" "LogAction" NOT NULL,
    "changes" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tenantId" TEXT,

    CONSTRAINT "invoice_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_items" (
    "id" TEXT NOT NULL,
    "invoice_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "vat_rate" INTEGER NOT NULL,
    "vat_amount" DECIMAL(10,2) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "discount_rate" DECIMAL(10,2) DEFAULT 0,
    "discount_amount" DECIMAL(10,2) DEFAULT 0,
    "withholding_code" TEXT,
    "withholding_rate" DECIMAL(5,2),
    "sct_rate" DECIMAL(5,2),
    "sct_amount" DECIMAL(10,2),
    "vat_exemption_reason" TEXT,
    "unit" TEXT,
    "shelf" TEXT,
    "purchase_order_item_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tenantId" TEXT,

    CONSTRAINT "invoice_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_payment_plans" (
    "id" TEXT NOT NULL,
    "invoice_id" TEXT NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "payment_type" TEXT,
    "notes" TEXT,
    "is_paid" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT,

    CONSTRAINT "invoice_payment_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collections" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "invoice_id" TEXT,
    "service_invoice_id" TEXT,
    "type" "CollectionType" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payment_type" "PaymentMethod" NOT NULL,
    "cashbox_id" TEXT,
    "bank_account_id" TEXT,
    "company_credit_card_id" TEXT,
    "notes" TEXT,
    "created_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sales_agent_id" TEXT,

    CONSTRAINT "collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_collections" (
    "id" TEXT NOT NULL,
    "invoice_id" TEXT NOT NULL,
    "collection_id" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tenantId" TEXT,

    CONSTRAINT "invoice_collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "einvoice_xml" (
    "id" TEXT NOT NULL,
    "invoice_id" TEXT NOT NULL,
    "xml_data" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT,

    CONSTRAINT "einvoice_xml_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_orders" (
    "id" TEXT NOT NULL,
    "order_no" TEXT NOT NULL,
    "type" "OrderType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tenantId" TEXT,
    "account_id" TEXT NOT NULL,
    "status" "SalesOrderStatus" NOT NULL DEFAULT 'PENDING',
    "total_amount" DECIMAL(12,2) NOT NULL,
    "vat_amount" DECIMAL(12,2) NOT NULL,
    "grand_total" DECIMAL(12,2) NOT NULL,
    "discount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "due_date" TIMESTAMP(3),
    "invoice_no" TEXT,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deliveryNoteId" TEXT,

    CONSTRAINT "sales_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_order_items" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "order_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "vat_rate" INTEGER NOT NULL,
    "vat_amount" DECIMAL(10,2) NOT NULL,
    "total_amount" DECIMAL(12,2) NOT NULL,
    "delivered_quantity" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sales_order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_order_logs" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "user_id" TEXT,
    "action_type" "LogAction" NOT NULL,
    "changes" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tenantId" TEXT,

    CONSTRAINT "sales_order_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_pickings" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "order_item_id" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "picked_by" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tenantId" TEXT,

    CONSTRAINT "order_pickings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_delivery_notes" (
    "id" TEXT NOT NULL,
    "delivery_note_no" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tenantId" TEXT,
    "account_id" TEXT NOT NULL,
    "warehouse_id" TEXT,
    "source_type" "DeliveryNoteSourceType" NOT NULL,
    "source_id" TEXT,
    "status" "DeliveryNoteStatus" NOT NULL DEFAULT 'NOT_INVOICED',
    "total_amount" DECIMAL(12,2) NOT NULL,
    "vat_amount" DECIMAL(12,2) NOT NULL,
    "grand_total" DECIMAL(12,2) NOT NULL,
    "discount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sales_delivery_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_delivery_note_items" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "delivery_note_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "vat_rate" INTEGER NOT NULL,
    "vat_amount" DECIMAL(10,2) NOT NULL,
    "total_amount" DECIMAL(12,2) NOT NULL,
    "invoiced_quantity" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sales_delivery_note_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_delivery_note_logs" (
    "id" TEXT NOT NULL,
    "delivery_note_id" TEXT NOT NULL,
    "user_id" TEXT,
    "action_type" "LogAction" NOT NULL,
    "changes" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tenantId" TEXT,

    CONSTRAINT "sales_delivery_note_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quotes" (
    "id" TEXT NOT NULL,
    "quote_no" TEXT NOT NULL,
    "tenantId" TEXT,
    "quote_type" "QuoteType" NOT NULL,
    "account_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valid_until" TIMESTAMP(3),
    "discount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(12,2) NOT NULL,
    "vat_amount" DECIMAL(12,2) NOT NULL,
    "grand_total" DECIMAL(12,2) NOT NULL,
    "notes" TEXT,
    "status" "QuoteStatus" NOT NULL DEFAULT 'OFFERED',
    "order_id" TEXT,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quote_items" (
    "id" TEXT NOT NULL,
    "quote_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "vat_rate" INTEGER NOT NULL,
    "vat_amount" DECIMAL(10,2) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "discount_rate" DECIMAL(5,2),
    "discount_amount" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tenantId" TEXT,

    CONSTRAINT "quote_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quote_logs" (
    "id" TEXT NOT NULL,
    "quote_id" TEXT NOT NULL,
    "user_id" TEXT,
    "action_type" "LogAction" NOT NULL,
    "changes" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tenantId" TEXT,

    CONSTRAINT "quote_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stocktakes" (
    "id" TEXT NOT NULL,
    "stocktake_no" TEXT NOT NULL,
    "tenantId" TEXT,
    "stocktake_type" "StocktakeType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "StocktakeStatus" NOT NULL DEFAULT 'DRAFT',
    "notes" TEXT,
    "created_by" TEXT,
    "updated_by" TEXT,
    "approved_by" TEXT,
    "approval_date" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stocktakes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stocktake_items" (
    "id" TEXT NOT NULL,
    "stocktake_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "location_id" TEXT,
    "system_quantity" INTEGER NOT NULL,
    "counted_quantity" INTEGER NOT NULL,
    "difference" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tenantId" TEXT,

    CONSTRAINT "stocktake_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shelves" (
    "id" TEXT NOT NULL,
    "warehouse_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT,

    CONSTRAINT "shelves_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_shelves" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "shelf_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT,

    CONSTRAINT "product_shelves_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouses" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "tenantId" TEXT,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "address" TEXT,
    "phone" TEXT,
    "manager" TEXT,
    "manager_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "warehouses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouse_stock_thresholds" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "warehouse_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "min_qty" INTEGER NOT NULL DEFAULT 0,
    "max_qty" INTEGER,
    "reorder_qty" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "warehouse_stock_thresholds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_costing_configs" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "method" "CostingMethod" NOT NULL DEFAULT 'WEIGHTED_AVERAGE',
    "standard_cost" DECIMAL(12,4),
    "effective_from" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_costing_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_lots" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "warehouse_id" TEXT,
    "lot_number" TEXT NOT NULL,
    "serial_number" TEXT,
    "expiry_date" TIMESTAMP(3),
    "manufactured_date" TIMESTAMP(3),
    "quantity" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_lots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "layer" INTEGER NOT NULL,
    "corridor" TEXT NOT NULL,
    "side" INTEGER NOT NULL,
    "section" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "barcode" TEXT NOT NULL,
    "name" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_barcodes" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "barcode" TEXT NOT NULL,
    "symbology" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT,

    CONSTRAINT "product_barcodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_location_stocks" (
    "id" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "qtyOnHand" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT,

    CONSTRAINT "product_location_stocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_moves" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "fromWarehouseId" TEXT,
    "fromLocationId" TEXT,
    "toWarehouseId" TEXT NOT NULL,
    "toLocationId" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,
    "moveType" "StockMoveType" NOT NULL,
    "refType" TEXT,
    "refId" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "tenantId" TEXT,

    CONSTRAINT "stock_moves_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expense_categories" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expense_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expenses" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "notes" TEXT,
    "amount" DECIMAL(10,2) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payment_type" "PaymentMethod" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_transfers" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "transfer_type" "TransferType" NOT NULL,
    "cashbox_id" TEXT,
    "account_id" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "reference_no" TEXT,
    "sender" TEXT,
    "receiver" TEXT,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "bank_account_id" TEXT,

    CONSTRAINT "bank_transfers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deleted_bank_transfers" (
    "id" TEXT NOT NULL,
    "original_id" TEXT NOT NULL,
    "transfer_type" "TransferType" NOT NULL,
    "cashbox_id" TEXT NOT NULL,
    "cashbox_name" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "account_name" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "tenant_id" TEXT,
    "reference_no" TEXT,
    "sender" TEXT,
    "receiver" TEXT,
    "original_created_by" TEXT,
    "original_updated_by" TEXT,
    "original_created_at" TIMESTAMP(3) NOT NULL,
    "original_updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_by" TEXT,
    "deleted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delete_reason" TEXT,

    CONSTRAINT "deleted_bank_transfers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_transfer_logs" (
    "id" TEXT NOT NULL,
    "bank_transfer_id" TEXT NOT NULL,
    "user_id" TEXT,
    "action_type" "LogAction" NOT NULL,
    "changes" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tenant_id" TEXT,

    CONSTRAINT "bank_transfer_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "check_bill_journals" (
    "id" TEXT NOT NULL,
    "journal_no" TEXT NOT NULL,
    "type" "JournalType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "account_id" TEXT,
    "notes" TEXT,
    "tenantId" TEXT,
    "created_by_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "bank_account_id" TEXT,

    CONSTRAINT "check_bill_journals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "check_bill_journal_items" (
    "id" TEXT NOT NULL,
    "journal_id" TEXT NOT NULL,
    "check_bill_id" TEXT NOT NULL,
    "tenantId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "check_bill_journal_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checks_bills" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "type" "CheckBillType" NOT NULL,
    "portfolio_type" "PortfolioType" NOT NULL,
    "account_id" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "remaining_amount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "due_date" TIMESTAMP(3) NOT NULL,
    "bank" TEXT,
    "branch" TEXT,
    "account_no" TEXT,
    "check_no" TEXT,
    "serial_no" TEXT,
    "status" "CheckBillStatus",
    "collection_date" TIMESTAMP(3),
    "collection_cashbox_id" TEXT,
    "is_endorsed" BOOLEAN NOT NULL DEFAULT false,
    "endorsement_date" TIMESTAMP(3),
    "endorsed_to" TEXT,
    "notes" TEXT,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "last_journal_id" TEXT,

    CONSTRAINT "checks_bills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deleted_checks_bills" (
    "id" TEXT NOT NULL,
    "original_id" TEXT NOT NULL,
    "type" "CheckBillType" NOT NULL,
    "portfolio_type" "PortfolioType" NOT NULL,
    "account_id" TEXT NOT NULL,
    "account_name" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "bank" TEXT,
    "branch" TEXT,
    "account_no" TEXT,
    "check_no" TEXT,
    "serial_no" TEXT,
    "status" "CheckBillStatus" NOT NULL,
    "collection_date" TIMESTAMP(3),
    "collection_cashbox_id" TEXT,
    "is_endorsed" BOOLEAN NOT NULL,
    "endorsement_date" TIMESTAMP(3),
    "endorsed_to" TEXT,
    "notes" TEXT,
    "original_created_by" TEXT,
    "original_updated_by" TEXT,
    "original_created_at" TIMESTAMP(3) NOT NULL,
    "original_updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_by" TEXT,
    "deleted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delete_reason" TEXT,
    "tenantId" TEXT,

    CONSTRAINT "deleted_checks_bills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "check_bill_logs" (
    "id" TEXT NOT NULL,
    "check_bill_id" TEXT NOT NULL,
    "user_id" TEXT,
    "action_type" "LogAction" NOT NULL,
    "changes" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tenantId" TEXT,

    CONSTRAINT "check_bill_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" TEXT NOT NULL,
    "employee_code" TEXT NOT NULL,
    "tenantId" TEXT,
    "identity_number" TEXT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3),
    "gender" "Gender",
    "marital_status" "MaritalStatus",
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "city" TEXT,
    "district" TEXT,
    "position" TEXT,
    "department" TEXT,
    "department_id" TEXT,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "salary" DECIMAL(10,2),
    "salary_day" INTEGER,
    "social_security_no" TEXT,
    "iban" TEXT,
    "balance" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "created_by" TEXT,
    "updated_by" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "bonus" DECIMAL(10,2),

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_payments" (
    "id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "type" "EmployeePaymentType" NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "period" TEXT,
    "notes" TEXT,
    "cashbox_id" TEXT,
    "created_by" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tenantId" TEXT,

    CONSTRAINT "employee_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "code_templates" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "module" "ModuleType" NOT NULL,
    "name" TEXT NOT NULL,
    "prefix" TEXT NOT NULL,
    "digitCount" INTEGER NOT NULL DEFAULT 3,
    "currentValue" INTEGER NOT NULL DEFAULT 0,
    "includeYear" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "code_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_catalog" (
    "id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "engine_volume" TEXT NOT NULL,
    "fuel_type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicle_catalog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_orders" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "tenantId" TEXT,
    "supplier_id" TEXT NOT NULL,
    "order_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expected_delivery_date" TIMESTAMP(3),
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "total_amount" DECIMAL(12,2) NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchase_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_order_items" (
    "id" TEXT NOT NULL,
    "purchase_order_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "ordered_quantity" INTEGER NOT NULL,
    "received_quantity" INTEGER NOT NULL DEFAULT 0,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "status" "OrderItemStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "purchase_order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "simple_orders" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "company_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" "SimpleOrderStatus" NOT NULL DEFAULT 'AWAITING_APPROVAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "supplied_quantity" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "simple_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procurement_orders" (
    "id" TEXT NOT NULL,
    "order_no" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tenantId" TEXT,
    "account_id" TEXT NOT NULL,
    "status" "PurchaseOrderLocalStatus" NOT NULL DEFAULT 'PENDING',
    "total_amount" DECIMAL(12,2) NOT NULL,
    "vat_amount" DECIMAL(12,2) NOT NULL,
    "grand_total" DECIMAL(12,2) NOT NULL,
    "discount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "due_date" TIMESTAMP(3),
    "invoice_no" TEXT,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deliveryNoteId" TEXT,

    CONSTRAINT "procurement_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_order_local_items" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "delivered_quantity" INTEGER NOT NULL DEFAULT 0,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "vat_rate" INTEGER NOT NULL,
    "vat_amount" DECIMAL(10,2) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "purchase_order_local_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_order_local_logs" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "user_id" TEXT,
    "action_type" "LogAction" NOT NULL,
    "changes" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tenantId" TEXT,

    CONSTRAINT "purchase_order_local_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_delivery_notes" (
    "id" TEXT NOT NULL,
    "delivery_note_no" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tenantId" TEXT,
    "account_id" TEXT NOT NULL,
    "warehouse_id" TEXT,
    "source_type" "DeliveryNoteSourceType" NOT NULL,
    "source_id" TEXT,
    "status" "DeliveryNoteStatus" NOT NULL DEFAULT 'NOT_INVOICED',
    "total_amount" DECIMAL(12,2) NOT NULL,
    "vat_amount" DECIMAL(12,2) NOT NULL,
    "grand_total" DECIMAL(12,2) NOT NULL,
    "discount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchase_delivery_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_delivery_note_items" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "delivery_note_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "vat_rate" INTEGER NOT NULL,
    "vat_amount" DECIMAL(10,2) NOT NULL,
    "total_amount" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchase_delivery_note_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_delivery_note_logs" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "delivery_note_id" TEXT NOT NULL,
    "user_id" TEXT,
    "action_type" "LogAction" NOT NULL,
    "changes" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "purchase_delivery_note_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modules" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'TRY',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "module_licenses" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "module_licenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_licenses" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "licenseType" "LicenseType" NOT NULL,
    "moduleId" TEXT,
    "assignedBy" TEXT,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),
    "revokedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_licenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invitations" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "invitedBy" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "acceptedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hizli_tokens" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "loginHash" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hizli_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "einvoice_inbox" (
    "id" SERIAL NOT NULL,
    "ettn" TEXT NOT NULL,
    "senderVkn" TEXT NOT NULL,
    "senderTitle" TEXT NOT NULL,
    "invoiceNo" TEXT,
    "invoiceDate" TIMESTAMP(3),
    "rawXml" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tenant_id" TEXT,
    "matched_invoice_id" TEXT,
    "scenario" VARCHAR(50),
    "receiver_vkn" VARCHAR(11),
    "status" VARCHAR(20) NOT NULL DEFAULT 'UNPROCESSED',
    "processed_at" TIMESTAMP(3),
    "processed_by" TEXT,

    CONSTRAINT "einvoice_inbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_vehicles" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "account_id" TEXT NOT NULL,
    "plate" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER,
    "chassis_no" TEXT,
    "engine_power" INTEGER,
    "engine_size" TEXT,
    "fuel_type" TEXT,
    "transmission" TEXT,
    "color" TEXT,
    "registration_date" TIMESTAMP(3),
    "registration_no" TEXT,
    "registration_owner" TEXT,
    "mileage" INTEGER,
    "notes" TEXT,
    "service_status" "VehicleServiceStatus",
    "vehicle_catalog_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_orders" (
    "id" TEXT NOT NULL,
    "workOrderNo" TEXT NOT NULL,
    "tenantId" TEXT,
    "status" "WorkOrderStatus" NOT NULL DEFAULT 'WAITING_DIAGNOSIS',
    "partWorkflowStatus" "PartWorkflowStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "vehicleWorkflowStatus" "VehicleWorkflowStatus" NOT NULL DEFAULT 'WAITING',
    "customerVehicleId" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "technicianId" TEXT,
    "description" TEXT,
    "diagnosisNotes" TEXT,
    "supplyResponseNotes" TEXT,
    "estimatedCompletionDate" TIMESTAMP(3),
    "actualCompletionDate" TIMESTAMP(3),
    "totalLaborCost" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalPartsCost" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "taxAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "grandTotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,
    "updated_by" TEXT,
    "service_template_id" TEXT,

    CONSTRAINT "work_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_order_activities" (
    "id" TEXT NOT NULL,
    "workOrderId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "userId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tenantId" TEXT,

    CONSTRAINT "work_order_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_order_items" (
    "id" TEXT NOT NULL,
    "workOrderId" TEXT NOT NULL,
    "type" "WorkOrderItemType" NOT NULL,
    "description" TEXT NOT NULL,
    "product_id" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPrice" DECIMAL(12,2) NOT NULL,
    "taxRate" INTEGER NOT NULL DEFAULT 20,
    "taxAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalPrice" DECIMAL(12,2) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT,

    CONSTRAINT "work_order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "part_requests" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "workOrderId" TEXT NOT NULL,
    "requestedBy" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "product_id" TEXT,
    "requestedQty" INTEGER NOT NULL DEFAULT 1,
    "suppliedQty" INTEGER,
    "status" "PartRequestStatus" NOT NULL DEFAULT 'REQUESTED',
    "version" INTEGER NOT NULL DEFAULT 1,
    "suppliedBy" TEXT,
    "suppliedAt" TIMESTAMP(3),
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "part_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_transactions" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "partRequestId" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "warehouseId" TEXT,
    "quantity" INTEGER NOT NULL,
    "transactionType" "InventoryTransactionType" NOT NULL DEFAULT 'DEDUCTION',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_invoices" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "invoiceNo" TEXT NOT NULL,
    "workOrderId" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3),
    "subtotal" DECIMAL(12,2) NOT NULL,
    "taxAmount" DECIMAL(12,2) NOT NULL,
    "grandTotal" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'TRY',
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journal_entries" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "referenceType" TEXT NOT NULL,
    "referenceId" TEXT NOT NULL,
    "serviceInvoiceId" TEXT,
    "entryDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,

    CONSTRAINT "journal_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journal_entry_lines" (
    "id" TEXT NOT NULL,
    "journalEntryId" TEXT NOT NULL,
    "accountCode" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "debit" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "credit" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "description" TEXT,
    "tenantId" TEXT,

    CONSTRAINT "journal_entry_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_credit_card_reminders" (
    "id" TEXT NOT NULL,
    "card_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT,

    CONSTRAINT "company_credit_card_reminders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_profit" (
    "id" TEXT NOT NULL,
    "invoice_id" TEXT NOT NULL,
    "invoice_item_id" TEXT,
    "product_id" TEXT NOT NULL,
    "tenantId" TEXT,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "unit_cost" DECIMAL(12,4) NOT NULL,
    "total_sales_amount" DECIMAL(12,2) NOT NULL,
    "total_cost" DECIMAL(12,2) NOT NULL,
    "profit" DECIMAL(12,2) NOT NULL,
    "profit_rate" DECIMAL(10,2) NOT NULL,
    "computed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoice_profit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "postal_codes" (
    "id" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "postal_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_parameters" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_parameters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouse_critical_stocks" (
    "id" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "criticalQty" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT,

    CONSTRAINT "warehouse_critical_stocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouse_transfer_items" (
    "id" TEXT NOT NULL,
    "transferId" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "fromLocationId" TEXT,
    "toLocationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tenantId" TEXT,

    CONSTRAINT "warehouse_transfer_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouse_transfer_logs" (
    "id" TEXT NOT NULL,
    "transferId" TEXT NOT NULL,
    "userId" TEXT,
    "actionType" "LogAction" NOT NULL,
    "changes" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tenantId" TEXT,

    CONSTRAINT "warehouse_transfer_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouse_transfers" (
    "id" TEXT NOT NULL,
    "transferNo" TEXT NOT NULL,
    "tenantId" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fromWarehouseId" TEXT NOT NULL,
    "toWarehouseId" TEXT NOT NULL,
    "status" "TransferStatus" NOT NULL DEFAULT 'PREPARING',
    "driverName" TEXT,
    "vehiclePlate" TEXT,
    "notes" TEXT,
    "prepared_by_id" TEXT,
    "approved_by_id" TEXT,
    "received_by_id" TEXT,
    "shipping_date" TIMESTAMP(3),
    "delivery_date" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "warehouse_transfers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price_lists" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tenantId" TEXT,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "price_lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price_list_items" (
    "id" TEXT NOT NULL,
    "price_list_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "discount_rate" DECIMAL(5,2) DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT,

    CONSTRAINT "price_list_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salary_plans" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "employee_id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "salary" DECIMAL(10,2) NOT NULL,
    "bonus" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(10,2) NOT NULL,
    "status" "SalaryStatus" NOT NULL DEFAULT 'UNPAID',
    "paid_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "remaining_amount" DECIMAL(10,2) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted_by" TEXT,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "salary_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salary_payments" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "employee_id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "total_amount" DECIMAL(12,2) NOT NULL,
    "payment_date" TIMESTAMP(3),
    "status" "SalaryStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "created_by" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted_by" TEXT,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "salary_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salary_payment_details" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "salary_payment_id" TEXT NOT NULL,
    "cashbox_id" TEXT,
    "bank_account_id" TEXT,
    "amount" DECIMAL(12,2) NOT NULL,
    "payment_method" "PaymentMethod" NOT NULL,
    "reference_no" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "salary_payment_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "advances" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "employee_id" TEXT NOT NULL,
    "cashbox_id" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DECIMAL(12,2) NOT NULL,
    "settled_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "remaining_amount" DECIMAL(12,2) NOT NULL,
    "notes" TEXT,
    "status" "AdvanceStatus" NOT NULL DEFAULT 'OPEN',
    "created_by" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "advances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "advance_settlements" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "advance_id" TEXT NOT NULL,
    "salary_plan_id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,

    CONSTRAINT "advance_settlements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_agents" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "tenantId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sales_agents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isSystemRole" BOOLEAN NOT NULL DEFAULT false,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_purge_audits" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "adminEmail" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "deletedFiles" INTEGER NOT NULL DEFAULT 0,
    "errors" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tenant_purge_audits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_vehicles" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "plate" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER,
    "chassis_no" TEXT,
    "engine_no" TEXT,
    "registration_date" TIMESTAMP(3),
    "vehicle_type" TEXT,
    "fuel_type" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "assigned_employee_id" TEXT,
    "registration_image_url" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "company_vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_expenses" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "vehicleId" TEXT NOT NULL,
    "expense_type" "VehicleExpenseType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DECIMAL(12,2) NOT NULL,
    "notes" TEXT,
    "document_no" TEXT,
    "mileage" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "vehicle_expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unit_sets" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "unit_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "units" (
    "id" TEXT NOT NULL,
    "unit_set_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "conversion_rate" DECIMAL(12,4) NOT NULL DEFAULT 1,
    "is_base_unit" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pos_payments" (
    "id" TEXT NOT NULL,
    "invoice_id" TEXT NOT NULL,
    "payment_method" "PaymentMethod" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "change" DECIMAL(12,2),
    "gift_card_id" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT,
    "created_by" TEXT,
    "updated_by" TEXT,

    CONSTRAINT "pos_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pos_sessions" (
    "id" TEXT NOT NULL,
    "session_no" TEXT NOT NULL,
    "cashier_id" TEXT NOT NULL,
    "cashbox_id" TEXT NOT NULL,
    "opening_amount" DECIMAL(12,2) NOT NULL,
    "closing_amount" DECIMAL(12,2),
    "closing_notes" TEXT,
    "status" "PosSessionStatus" NOT NULL,
    "opened_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closed_at" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT,
    "created_by" TEXT,
    "updated_by" TEXT,

    CONSTRAINT "pos_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_usage_metrics" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "metric_date" DATE NOT NULL,
    "api_call_count" INTEGER NOT NULL DEFAULT 0,
    "storage_bytes" BIGINT NOT NULL DEFAULT 0,
    "active_users" INTEGER NOT NULL DEFAULT 0,
    "invoice_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_usage_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature_flags" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "flag_key" TEXT NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT false,
    "payload" JSONB,
    "enabled_at" TIMESTAMP(3),
    "disabled_at" TIMESTAMP(3),
    "enabled_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feature_flags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_keys" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "key_hash" TEXT NOT NULL,
    "key_prefix" TEXT NOT NULL,
    "scopes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "last_used_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "revoked_at" TIMESTAMP(3),
    "revoked_by" TEXT,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhook_endpoints" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "events" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "secret" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "failure_count" INTEGER NOT NULL DEFAULT 0,
    "last_triggered" TIMESTAMP(3),
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "webhook_endpoints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupons" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "discount_type" "CouponDiscountType" NOT NULL,
    "discount_value" DECIMAL(12,4) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'TRY',
    "max_uses" INTEGER,
    "used_count" INTEGER NOT NULL DEFAULT 0,
    "valid_from" TIMESTAMP(3),
    "valid_until" TIMESTAMP(3),
    "applicable_plans" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT,

    CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupon_redemptions" (
    "id" TEXT NOT NULL,
    "coupon_id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "subscription_id" TEXT,
    "redeemed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "discount_applied" DECIMAL(12,4) NOT NULL,

    CONSTRAINT "coupon_redemptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_onboardings" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "steps" JSONB NOT NULL DEFAULT '{}',
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_onboardings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "einvoice_sends" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "invoice_id" TEXT NOT NULL,
    "ettn" TEXT NOT NULL,
    "scenario" "EInvoiceScenario" NOT NULL,
    "profile_id" TEXT NOT NULL DEFAULT 'TR1.2',
    "sender_alias" TEXT NOT NULL,
    "receiver_alias" TEXT,
    "receiver_vkn" TEXT NOT NULL,
    "xml_content" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "sent_at" TIMESTAMP(3),
    "response_code" TEXT,
    "response_description" TEXT,
    "response_xml" TEXT,
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "last_retry_at" TIMESTAMP(3),
    "error_detail" TEXT,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "einvoice_sends_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "einvoice_tenant_configs" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "is_einvoice_user" BOOLEAN NOT NULL DEFAULT false,
    "is_earsiv_user" BOOLEAN NOT NULL DEFAULT false,
    "integration_vkn" TEXT,
    "sender_alias" TEXT,
    "api_username" TEXT,
    "api_password_hash" TEXT,
    "test_mode" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "einvoice_tenant_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "manager_id" TEXT,
    "parent_id" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leave_types" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "is_paid" BOOLEAN NOT NULL DEFAULT true,
    "default_days" INTEGER,
    "carry_over" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leave_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leave_requests" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "leave_type_id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "total_days" DECIMAL(5,1) NOT NULL,
    "reason" TEXT,
    "status" "LeaveStatus" NOT NULL DEFAULT 'PENDING',
    "approved_by_id" TEXT,
    "approved_at" TIMESTAMP(3),
    "rejected_by_id" TEXT,
    "rejected_at" TIMESTAMP(3),
    "rejection_note" TEXT,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leave_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "overtime_records" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "hours" DECIMAL(5,2) NOT NULL,
    "overtime_type" "OvertimeType" NOT NULL,
    "rate" DECIMAL(5,2) NOT NULL DEFAULT 1.5,
    "amount" DECIMAL(12,2),
    "status" "OvertimeStatus" NOT NULL DEFAULT 'PENDING',
    "approved_by_id" TEXT,
    "approved_at" TIMESTAMP(3),
    "notes" TEXT,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "overtime_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_assignments" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "asset_name" TEXT NOT NULL,
    "asset_code" TEXT,
    "serial_number" TEXT,
    "description" TEXT,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "returned_at" TIMESTAMP(3),
    "condition" "AssetCondition" NOT NULL DEFAULT 'GOOD',
    "notes" TEXT,
    "assigned_by" TEXT,
    "returned_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "asset_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "performance_reviews" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "reviewer_id" TEXT NOT NULL,
    "period_start" TIMESTAMP(3) NOT NULL,
    "period_end" TIMESTAMP(3) NOT NULL,
    "overall_score" DECIMAL(3,1),
    "goals" JSONB,
    "strengths" TEXT,
    "improvements" TEXT,
    "manager_notes" TEXT,
    "status" "PerformanceStatus" NOT NULL DEFAULT 'DRAFT',
    "submitted_at" TIMESTAMP(3),
    "acknowledged_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "performance_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_templates" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "estimated_hours" DECIMAL(6,2),
    "labor_cost" DECIMAL(12,2),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "items" JSONB,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_order_warranties" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "work_order_id" TEXT NOT NULL,
    "warranty_type" TEXT NOT NULL DEFAULT 'LABOR',
    "valid_until" TIMESTAMP(3) NOT NULL,
    "mileage_limit" INTEGER,
    "description" TEXT,
    "terms" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_order_warranties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "preventive_maintenances" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "vehicle_id" TEXT,
    "customer_vehicle_id" TEXT,
    "maintenance_type" "MaintenanceType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "interval_days" INTEGER,
    "interval_mileage" INTEGER,
    "last_performed_at" TIMESTAMP(3),
    "last_mileage" INTEGER,
    "next_due_at" TIMESTAMP(3),
    "next_mileage" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "preventive_maintenances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "technician_metrics" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "technician_id" TEXT NOT NULL,
    "period_start" TIMESTAMP(3) NOT NULL,
    "period_end" TIMESTAMP(3) NOT NULL,
    "total_work_orders" INTEGER NOT NULL DEFAULT 0,
    "completed_work_orders" INTEGER NOT NULL DEFAULT 0,
    "avg_completion_hours" DECIMAL(8,2) NOT NULL DEFAULT 0,
    "rework_count" INTEGER NOT NULL DEFAULT 0,
    "customer_satisfaction" DECIMAL(3,1),
    "revenue_generated" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "parts_efficiency" DECIMAL(5,2),
    "on_time_delivery_rate" DECIMAL(5,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "technician_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenants_uuid_key" ON "tenants"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_subdomain_key" ON "tenants"("subdomain");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_domain_key" ON "tenants"("domain");

-- CreateIndex
CREATE INDEX "tenants_subdomain_idx" ON "tenants"("subdomain");

-- CreateIndex
CREATE INDEX "tenants_domain_idx" ON "tenants"("domain");

-- CreateIndex
CREATE INDEX "tenants_status_idx" ON "tenants"("status");

-- CreateIndex
CREATE INDEX "tenants_createdAt_idx" ON "tenants"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_settings_tenantId_key" ON "tenant_settings"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "plans_slug_key" ON "plans"("slug");

-- CreateIndex
CREATE INDEX "plans_slug_idx" ON "plans"("slug");

-- CreateIndex
CREATE INDEX "plans_isActive_idx" ON "plans"("isActive");

-- CreateIndex
CREATE INDEX "plans_isBasePlan_idx" ON "plans"("isBasePlan");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_tenantId_key" ON "subscriptions"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_iyzicoSubscriptionRef_key" ON "subscriptions"("iyzicoSubscriptionRef");

-- CreateIndex
CREATE INDEX "subscriptions_tenantId_idx" ON "subscriptions"("tenantId");

-- CreateIndex
CREATE INDEX "subscriptions_planId_idx" ON "subscriptions"("planId");

-- CreateIndex
CREATE INDEX "subscriptions_status_idx" ON "subscriptions"("status");

-- CreateIndex
CREATE INDEX "subscriptions_endDate_idx" ON "subscriptions"("endDate");

-- CreateIndex
CREATE INDEX "subscriptions_nextBillingDate_idx" ON "subscriptions"("nextBillingDate");

-- CreateIndex
CREATE INDEX "reconciliation_logs_tenant_id_idx" ON "reconciliation_logs"("tenant_id");

-- CreateIndex
CREATE INDEX "reconciliation_logs_invoice_id_idx" ON "reconciliation_logs"("invoice_id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_iyzicoPaymentId_key" ON "payments"("iyzicoPaymentId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_iyzicoToken_key" ON "payments"("iyzicoToken");

-- CreateIndex
CREATE UNIQUE INDEX "payments_conversationId_key" ON "payments"("conversationId");

-- CreateIndex
CREATE INDEX "payments_subscriptionId_idx" ON "payments"("subscriptionId");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- CreateIndex
CREATE INDEX "payments_iyzicoPaymentId_idx" ON "payments"("iyzicoPaymentId");

-- CreateIndex
CREATE INDEX "payments_conversationId_idx" ON "payments"("conversationId");

-- CreateIndex
CREATE INDEX "payments_createdAt_idx" ON "payments"("createdAt");

-- CreateIndex
CREATE INDEX "payments_tenantId_idx" ON "payments"("tenantId");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_tenantId_idx" ON "audit_logs"("tenantId");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "users_uuid_key" ON "users"("uuid");

-- CreateIndex
CREATE INDEX "users_tenantId_idx" ON "users"("tenantId");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_tenantId_key" ON "users"("email", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_refreshToken_key" ON "sessions"("refreshToken");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");

-- CreateIndex
CREATE INDEX "sessions_token_idx" ON "sessions"("token");

-- CreateIndex
CREATE INDEX "sessions_refreshToken_idx" ON "sessions"("refreshToken");

-- CreateIndex
CREATE INDEX "sessions_expiresAt_idx" ON "sessions"("expiresAt");

-- CreateIndex
CREATE INDEX "products_tenantId_idx" ON "products"("tenantId");

-- CreateIndex
CREATE INDEX "products_tenantId_code_idx" ON "products"("tenantId", "code");

-- CreateIndex
CREATE INDEX "products_tenantId_barcode_idx" ON "products"("tenantId", "barcode");

-- CreateIndex
CREATE INDEX "products_brand_id_idx" ON "products"("brand_id");

-- CreateIndex
CREATE INDEX "products_category_id_idx" ON "products"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "products_code_tenantId_key" ON "products"("code", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "products_barcode_tenantId_key" ON "products"("barcode", "tenantId");

-- CreateIndex
CREATE INDEX "brands_tenant_id_idx" ON "brands"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "brands_tenant_id_name_key" ON "brands"("tenant_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "brands_tenant_id_slug_key" ON "brands"("tenant_id", "slug");

-- CreateIndex
CREATE INDEX "categories_tenant_id_idx" ON "categories"("tenant_id");

-- CreateIndex
CREATE INDEX "categories_parent_id_idx" ON "categories"("parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "categories_tenant_id_slug_key" ON "categories"("tenant_id", "slug");

-- CreateIndex
CREATE INDEX "product_vehicle_compatibilities_tenant_id_idx" ON "product_vehicle_compatibilities"("tenant_id");

-- CreateIndex
CREATE INDEX "product_vehicle_compatibilities_product_id_idx" ON "product_vehicle_compatibilities"("product_id");

-- CreateIndex
CREATE INDEX "product_vehicle_compatibilities_tenant_id_vehicle_brand_veh_idx" ON "product_vehicle_compatibilities"("tenant_id", "vehicle_brand", "vehicle_model");

-- CreateIndex
CREATE INDEX "price_cards_tenant_id_idx" ON "price_cards"("tenant_id");

-- CreateIndex
CREATE INDEX "price_cards_product_id_type_created_at_idx" ON "price_cards"("product_id", "type", "created_at");

-- CreateIndex
CREATE INDEX "stock_cost_history_product_id_computed_at_idx" ON "stock_cost_history"("product_id", "computed_at");

-- CreateIndex
CREATE INDEX "stock_cost_history_tenantId_idx" ON "stock_cost_history"("tenantId");

-- CreateIndex
CREATE INDEX "equivalency_groups_tenantId_idx" ON "equivalency_groups"("tenantId");

-- CreateIndex
CREATE INDEX "product_equivalents_tenantId_idx" ON "product_equivalents"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "product_equivalents_product1_id_product2_id_key" ON "product_equivalents"("product1_id", "product2_id");

-- CreateIndex
CREATE INDEX "product_movements_tenantId_idx" ON "product_movements"("tenantId");

-- CreateIndex
CREATE INDEX "product_movements_invoice_item_id_idx" ON "product_movements"("invoice_item_id");

-- CreateIndex
CREATE INDEX "product_movements_is_reversed_idx" ON "product_movements"("is_reversed");

-- CreateIndex
CREATE INDEX "accounts_tenantId_idx" ON "accounts"("tenantId");

-- CreateIndex
CREATE INDEX "accounts_tenantId_code_idx" ON "accounts"("tenantId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_code_tenantId_key" ON "accounts"("code", "tenantId");

-- CreateIndex
CREATE INDEX "account_contacts_account_id_idx" ON "account_contacts"("account_id");

-- CreateIndex
CREATE INDEX "account_contacts_tenantId_idx" ON "account_contacts"("tenantId");

-- CreateIndex
CREATE INDEX "account_addresses_account_id_idx" ON "account_addresses"("account_id");

-- CreateIndex
CREATE INDEX "account_addresses_tenantId_idx" ON "account_addresses"("tenantId");

-- CreateIndex
CREATE INDEX "account_banks_account_id_idx" ON "account_banks"("account_id");

-- CreateIndex
CREATE INDEX "account_banks_tenantId_idx" ON "account_banks"("tenantId");

-- CreateIndex
CREATE INDEX "account_movements_tenantId_idx" ON "account_movements"("tenantId");

-- CreateIndex
CREATE INDEX "account_movements_account_id_date_idx" ON "account_movements"("account_id", "date");

-- CreateIndex
CREATE INDEX "account_movements_invoice_id_is_reversed_idx" ON "account_movements"("invoice_id", "is_reversed");

-- CreateIndex
CREATE INDEX "cashboxes_tenantId_idx" ON "cashboxes"("tenantId");

-- CreateIndex
CREATE INDEX "cashboxes_tenantId_code_idx" ON "cashboxes"("tenantId", "code");

-- CreateIndex
CREATE INDEX "cashboxes_type_idx" ON "cashboxes"("type");

-- CreateIndex
CREATE INDEX "cashboxes_is_active_idx" ON "cashboxes"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "cashboxes_code_tenantId_key" ON "cashboxes"("code", "tenantId");

-- CreateIndex
CREATE INDEX "banks_tenantId_idx" ON "banks"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "bank_accounts_code_key" ON "bank_accounts"("code");

-- CreateIndex
CREATE INDEX "bank_accounts_bank_id_idx" ON "bank_accounts"("bank_id");

-- CreateIndex
CREATE INDEX "bank_accounts_type_idx" ON "bank_accounts"("type");

-- CreateIndex
CREATE INDEX "bank_accounts_tenantId_idx" ON "bank_accounts"("tenantId");

-- CreateIndex
CREATE INDEX "bank_account_movements_bank_account_id_date_idx" ON "bank_account_movements"("bank_account_id", "date");

-- CreateIndex
CREATE INDEX "bank_account_movements_movement_type_idx" ON "bank_account_movements"("movement_type");

-- CreateIndex
CREATE INDEX "bank_account_movements_tenant_id_idx" ON "bank_account_movements"("tenant_id");

-- CreateIndex
CREATE INDEX "bank_loans_bank_account_id_idx" ON "bank_loans"("bank_account_id");

-- CreateIndex
CREATE INDEX "bank_loans_tenantId_idx" ON "bank_loans"("tenantId");

-- CreateIndex
CREATE INDEX "bank_loan_plans_loan_id_idx" ON "bank_loan_plans"("loan_id");

-- CreateIndex
CREATE INDEX "bank_loan_plans_tenantId_idx" ON "bank_loan_plans"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "company_credit_cards_code_key" ON "company_credit_cards"("code");

-- CreateIndex
CREATE INDEX "company_credit_cards_cashbox_id_idx" ON "company_credit_cards"("cashbox_id");

-- CreateIndex
CREATE INDEX "company_credit_cards_tenantId_idx" ON "company_credit_cards"("tenantId");

-- CreateIndex
CREATE INDEX "company_credit_card_movements_card_id_date_idx" ON "company_credit_card_movements"("card_id", "date");

-- CreateIndex
CREATE INDEX "company_credit_card_movements_tenantId_idx" ON "company_credit_card_movements"("tenantId");

-- CreateIndex
CREATE INDEX "cashbox_movements_cashbox_id_date_idx" ON "cashbox_movements"("cashbox_id", "date");

-- CreateIndex
CREATE INDEX "cashbox_movements_account_id_idx" ON "cashbox_movements"("account_id");

-- CreateIndex
CREATE INDEX "cashbox_movements_is_transferred_idx" ON "cashbox_movements"("is_transferred");

-- CreateIndex
CREATE INDEX "cashbox_movements_tenant_id_idx" ON "cashbox_movements"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_purchase_order_id_key" ON "invoices"("purchase_order_id");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_procurement_order_id_key" ON "invoices"("procurement_order_id");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_purchase_delivery_note_id_key" ON "invoices"("purchase_delivery_note_id");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_einvoice_ettn_key" ON "invoices"("einvoice_ettn");

-- CreateIndex
CREATE INDEX "invoices_tenantId_idx" ON "invoices"("tenantId");

-- CreateIndex
CREATE INDEX "invoices_tenantId_invoice_type_idx" ON "invoices"("tenantId", "invoice_type");

-- CreateIndex
CREATE INDEX "invoices_tenantId_status_idx" ON "invoices"("tenantId", "status");

-- CreateIndex
CREATE INDEX "invoices_tenantId_date_idx" ON "invoices"("tenantId", "date");

-- CreateIndex
CREATE INDEX "invoices_account_id_idx" ON "invoices"("account_id");

-- CreateIndex
CREATE INDEX "invoices_status_idx" ON "invoices"("status");

-- CreateIndex
CREATE INDEX "invoices_delivery_note_id_idx" ON "invoices"("delivery_note_id");

-- CreateIndex
CREATE INDEX "invoices_warehouse_id_idx" ON "invoices"("warehouse_id");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoice_no_tenantId_key" ON "invoices"("invoice_no", "tenantId");

-- CreateIndex
CREATE INDEX "invoice_logs_invoice_id_idx" ON "invoice_logs"("invoice_id");

-- CreateIndex
CREATE INDEX "invoice_logs_user_id_idx" ON "invoice_logs"("user_id");

-- CreateIndex
CREATE INDEX "invoice_logs_tenantId_idx" ON "invoice_logs"("tenantId");

-- CreateIndex
CREATE INDEX "invoice_items_invoice_id_idx" ON "invoice_items"("invoice_id");

-- CreateIndex
CREATE INDEX "invoice_items_product_id_idx" ON "invoice_items"("product_id");

-- CreateIndex
CREATE INDEX "invoice_items_tenantId_idx" ON "invoice_items"("tenantId");

-- CreateIndex
CREATE INDEX "invoice_payment_plans_invoice_id_idx" ON "invoice_payment_plans"("invoice_id");

-- CreateIndex
CREATE INDEX "invoice_payment_plans_tenantId_idx" ON "invoice_payment_plans"("tenantId");

-- CreateIndex
CREATE INDEX "collections_tenantId_idx" ON "collections"("tenantId");

-- CreateIndex
CREATE INDEX "collections_tenantId_deleted_at_idx" ON "collections"("tenantId", "deleted_at");

-- CreateIndex
CREATE INDEX "collections_tenantId_date_idx" ON "collections"("tenantId", "date");

-- CreateIndex
CREATE INDEX "invoice_collections_tenantId_idx" ON "invoice_collections"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "invoice_collections_invoice_id_collection_id_key" ON "invoice_collections"("invoice_id", "collection_id");

-- CreateIndex
CREATE UNIQUE INDEX "einvoice_xml_invoice_id_key" ON "einvoice_xml"("invoice_id");

-- CreateIndex
CREATE INDEX "einvoice_xml_tenantId_idx" ON "einvoice_xml"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "sales_orders_deliveryNoteId_key" ON "sales_orders"("deliveryNoteId");

-- CreateIndex
CREATE INDEX "sales_orders_account_id_idx" ON "sales_orders"("account_id");

-- CreateIndex
CREATE INDEX "sales_orders_date_idx" ON "sales_orders"("date");

-- CreateIndex
CREATE INDEX "sales_orders_order_no_idx" ON "sales_orders"("order_no");

-- CreateIndex
CREATE INDEX "sales_orders_status_idx" ON "sales_orders"("status");

-- CreateIndex
CREATE INDEX "sales_orders_tenantId_idx" ON "sales_orders"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "sales_orders_order_no_tenantId_key" ON "sales_orders"("order_no", "tenantId");

-- CreateIndex
CREATE INDEX "sales_order_items_order_id_idx" ON "sales_order_items"("order_id");

-- CreateIndex
CREATE INDEX "sales_order_items_product_id_idx" ON "sales_order_items"("product_id");

-- CreateIndex
CREATE INDEX "sales_order_items_tenantId_idx" ON "sales_order_items"("tenantId");

-- CreateIndex
CREATE INDEX "sales_order_logs_order_id_idx" ON "sales_order_logs"("order_id");

-- CreateIndex
CREATE INDEX "sales_order_logs_user_id_idx" ON "sales_order_logs"("user_id");

-- CreateIndex
CREATE INDEX "sales_order_logs_tenantId_idx" ON "sales_order_logs"("tenantId");

-- CreateIndex
CREATE INDEX "order_pickings_order_id_idx" ON "order_pickings"("order_id");

-- CreateIndex
CREATE INDEX "order_pickings_order_item_id_idx" ON "order_pickings"("order_item_id");

-- CreateIndex
CREATE INDEX "order_pickings_location_id_idx" ON "order_pickings"("location_id");

-- CreateIndex
CREATE INDEX "order_pickings_tenantId_idx" ON "order_pickings"("tenantId");

-- CreateIndex
CREATE INDEX "sales_delivery_notes_tenantId_idx" ON "sales_delivery_notes"("tenantId");

-- CreateIndex
CREATE INDEX "sales_delivery_notes_delivery_note_no_idx" ON "sales_delivery_notes"("delivery_note_no");

-- CreateIndex
CREATE INDEX "sales_delivery_notes_date_idx" ON "sales_delivery_notes"("date");

-- CreateIndex
CREATE INDEX "sales_delivery_notes_account_id_idx" ON "sales_delivery_notes"("account_id");

-- CreateIndex
CREATE INDEX "sales_delivery_notes_status_idx" ON "sales_delivery_notes"("status");

-- CreateIndex
CREATE INDEX "sales_delivery_notes_source_id_idx" ON "sales_delivery_notes"("source_id");

-- CreateIndex
CREATE UNIQUE INDEX "sales_delivery_notes_delivery_note_no_tenantId_key" ON "sales_delivery_notes"("delivery_note_no", "tenantId");

-- CreateIndex
CREATE INDEX "sales_delivery_note_items_delivery_note_id_idx" ON "sales_delivery_note_items"("delivery_note_id");

-- CreateIndex
CREATE INDEX "sales_delivery_note_items_product_id_idx" ON "sales_delivery_note_items"("product_id");

-- CreateIndex
CREATE INDEX "sales_delivery_note_items_tenantId_idx" ON "sales_delivery_note_items"("tenantId");

-- CreateIndex
CREATE INDEX "sales_delivery_note_logs_delivery_note_id_idx" ON "sales_delivery_note_logs"("delivery_note_id");

-- CreateIndex
CREATE INDEX "sales_delivery_note_logs_user_id_idx" ON "sales_delivery_note_logs"("user_id");

-- CreateIndex
CREATE INDEX "sales_delivery_note_logs_tenantId_idx" ON "sales_delivery_note_logs"("tenantId");

-- CreateIndex
CREATE INDEX "quotes_tenantId_idx" ON "quotes"("tenantId");

-- CreateIndex
CREATE INDEX "quotes_tenantId_quote_no_idx" ON "quotes"("tenantId", "quote_no");

-- CreateIndex
CREATE UNIQUE INDEX "quotes_quote_no_tenantId_key" ON "quotes"("quote_no", "tenantId");

-- CreateIndex
CREATE INDEX "quote_items_tenantId_idx" ON "quote_items"("tenantId");

-- CreateIndex
CREATE INDEX "quote_logs_quote_id_idx" ON "quote_logs"("quote_id");

-- CreateIndex
CREATE INDEX "quote_logs_user_id_idx" ON "quote_logs"("user_id");

-- CreateIndex
CREATE INDEX "quote_logs_tenantId_idx" ON "quote_logs"("tenantId");

-- CreateIndex
CREATE INDEX "stocktakes_tenantId_idx" ON "stocktakes"("tenantId");

-- CreateIndex
CREATE INDEX "stocktakes_tenantId_stocktake_no_idx" ON "stocktakes"("tenantId", "stocktake_no");

-- CreateIndex
CREATE UNIQUE INDEX "stocktakes_stocktake_no_tenantId_key" ON "stocktakes"("stocktake_no", "tenantId");

-- CreateIndex
CREATE INDEX "stocktake_items_stocktake_id_idx" ON "stocktake_items"("stocktake_id");

-- CreateIndex
CREATE INDEX "stocktake_items_product_id_idx" ON "stocktake_items"("product_id");

-- CreateIndex
CREATE INDEX "stocktake_items_location_id_idx" ON "stocktake_items"("location_id");

-- CreateIndex
CREATE INDEX "stocktake_items_tenantId_idx" ON "stocktake_items"("tenantId");

-- CreateIndex
CREATE INDEX "shelves_tenantId_idx" ON "shelves"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "shelves_warehouse_id_code_key" ON "shelves"("warehouse_id", "code");

-- CreateIndex
CREATE INDEX "product_shelves_tenantId_idx" ON "product_shelves"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "product_shelves_product_id_shelf_id_key" ON "product_shelves"("product_id", "shelf_id");

-- CreateIndex
CREATE INDEX "warehouses_tenantId_idx" ON "warehouses"("tenantId");

-- CreateIndex
CREATE INDEX "warehouses_tenantId_code_idx" ON "warehouses"("tenantId", "code");

-- CreateIndex
CREATE INDEX "warehouses_manager_id_idx" ON "warehouses"("manager_id");

-- CreateIndex
CREATE UNIQUE INDEX "warehouses_code_tenantId_key" ON "warehouses"("code", "tenantId");

-- CreateIndex
CREATE INDEX "warehouse_stock_thresholds_tenant_id_idx" ON "warehouse_stock_thresholds"("tenant_id");

-- CreateIndex
CREATE INDEX "warehouse_stock_thresholds_warehouse_id_idx" ON "warehouse_stock_thresholds"("warehouse_id");

-- CreateIndex
CREATE INDEX "warehouse_stock_thresholds_product_id_idx" ON "warehouse_stock_thresholds"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "warehouse_stock_thresholds_tenant_id_warehouse_id_product_i_key" ON "warehouse_stock_thresholds"("tenant_id", "warehouse_id", "product_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_costing_configs_product_id_key" ON "product_costing_configs"("product_id");

-- CreateIndex
CREATE INDEX "product_costing_configs_tenant_id_idx" ON "product_costing_configs"("tenant_id");

-- CreateIndex
CREATE INDEX "product_lots_tenant_id_idx" ON "product_lots"("tenant_id");

-- CreateIndex
CREATE INDEX "product_lots_product_id_idx" ON "product_lots"("product_id");

-- CreateIndex
CREATE INDEX "product_lots_warehouse_id_idx" ON "product_lots"("warehouse_id");

-- CreateIndex
CREATE INDEX "product_lots_expiry_date_idx" ON "product_lots"("expiry_date");

-- CreateIndex
CREATE UNIQUE INDEX "product_lots_tenant_id_lot_number_product_id_key" ON "product_lots"("tenant_id", "lot_number", "product_id");

-- CreateIndex
CREATE UNIQUE INDEX "locations_code_key" ON "locations"("code");

-- CreateIndex
CREATE UNIQUE INDEX "locations_barcode_key" ON "locations"("barcode");

-- CreateIndex
CREATE INDEX "locations_warehouseId_idx" ON "locations"("warehouseId");

-- CreateIndex
CREATE INDEX "locations_code_idx" ON "locations"("code");

-- CreateIndex
CREATE INDEX "locations_barcode_idx" ON "locations"("barcode");

-- CreateIndex
CREATE INDEX "locations_tenantId_idx" ON "locations"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "locations_warehouseId_code_key" ON "locations"("warehouseId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "product_barcodes_barcode_key" ON "product_barcodes"("barcode");

-- CreateIndex
CREATE INDEX "product_barcodes_productId_idx" ON "product_barcodes"("productId");

-- CreateIndex
CREATE INDEX "product_barcodes_barcode_idx" ON "product_barcodes"("barcode");

-- CreateIndex
CREATE INDEX "product_barcodes_tenantId_idx" ON "product_barcodes"("tenantId");

-- CreateIndex
CREATE INDEX "product_location_stocks_warehouseId_idx" ON "product_location_stocks"("warehouseId");

-- CreateIndex
CREATE INDEX "product_location_stocks_locationId_idx" ON "product_location_stocks"("locationId");

-- CreateIndex
CREATE INDEX "product_location_stocks_productId_idx" ON "product_location_stocks"("productId");

-- CreateIndex
CREATE INDEX "product_location_stocks_tenantId_idx" ON "product_location_stocks"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "product_location_stocks_warehouseId_locationId_productId_key" ON "product_location_stocks"("warehouseId", "locationId", "productId");

-- CreateIndex
CREATE INDEX "stock_moves_productId_idx" ON "stock_moves"("productId");

-- CreateIndex
CREATE INDEX "stock_moves_fromWarehouseId_fromLocationId_idx" ON "stock_moves"("fromWarehouseId", "fromLocationId");

-- CreateIndex
CREATE INDEX "stock_moves_toWarehouseId_toLocationId_idx" ON "stock_moves"("toWarehouseId", "toLocationId");

-- CreateIndex
CREATE INDEX "stock_moves_moveType_idx" ON "stock_moves"("moveType");

-- CreateIndex
CREATE INDEX "stock_moves_createdAt_idx" ON "stock_moves"("createdAt");

-- CreateIndex
CREATE INDEX "stock_moves_refType_refId_idx" ON "stock_moves"("refType", "refId");

-- CreateIndex
CREATE INDEX "stock_moves_tenantId_idx" ON "stock_moves"("tenantId");

-- CreateIndex
CREATE INDEX "expense_categories_tenantId_idx" ON "expense_categories"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "expense_categories_tenantId_name_key" ON "expense_categories"("tenantId", "name");

-- CreateIndex
CREATE INDEX "expenses_tenantId_idx" ON "expenses"("tenantId");

-- CreateIndex
CREATE INDEX "expenses_tenantId_date_idx" ON "expenses"("tenantId", "date");

-- CreateIndex
CREATE INDEX "bank_transfers_tenantId_idx" ON "bank_transfers"("tenantId");

-- CreateIndex
CREATE INDEX "bank_transfers_tenantId_date_idx" ON "bank_transfers"("tenantId", "date");

-- CreateIndex
CREATE INDEX "bank_transfers_cashbox_id_idx" ON "bank_transfers"("cashbox_id");

-- CreateIndex
CREATE INDEX "bank_transfers_account_id_idx" ON "bank_transfers"("account_id");

-- CreateIndex
CREATE INDEX "bank_transfers_date_idx" ON "bank_transfers"("date");

-- CreateIndex
CREATE INDEX "bank_transfers_transfer_type_idx" ON "bank_transfers"("transfer_type");

-- CreateIndex
CREATE INDEX "deleted_bank_transfers_original_id_idx" ON "deleted_bank_transfers"("original_id");

-- CreateIndex
CREATE INDEX "deleted_bank_transfers_deleted_at_idx" ON "deleted_bank_transfers"("deleted_at");

-- CreateIndex
CREATE INDEX "deleted_bank_transfers_cashbox_id_idx" ON "deleted_bank_transfers"("cashbox_id");

-- CreateIndex
CREATE INDEX "deleted_bank_transfers_account_id_idx" ON "deleted_bank_transfers"("account_id");

-- CreateIndex
CREATE INDEX "bank_transfer_logs_bank_transfer_id_idx" ON "bank_transfer_logs"("bank_transfer_id");

-- CreateIndex
CREATE INDEX "bank_transfer_logs_user_id_idx" ON "bank_transfer_logs"("user_id");

-- CreateIndex
CREATE INDEX "check_bill_journal_items_journal_id_idx" ON "check_bill_journal_items"("journal_id");

-- CreateIndex
CREATE INDEX "check_bill_journal_items_check_bill_id_idx" ON "check_bill_journal_items"("check_bill_id");

-- CreateIndex
CREATE INDEX "check_bill_journal_items_tenantId_idx" ON "check_bill_journal_items"("tenantId");

-- CreateIndex
CREATE INDEX "checks_bills_tenantId_idx" ON "checks_bills"("tenantId");

-- CreateIndex
CREATE INDEX "checks_bills_tenantId_due_date_idx" ON "checks_bills"("tenantId", "due_date");

-- CreateIndex
CREATE INDEX "checks_bills_account_id_idx" ON "checks_bills"("account_id");

-- CreateIndex
CREATE INDEX "checks_bills_due_date_idx" ON "checks_bills"("due_date");

-- CreateIndex
CREATE INDEX "checks_bills_status_idx" ON "checks_bills"("status");

-- CreateIndex
CREATE INDEX "checks_bills_type_idx" ON "checks_bills"("type");

-- CreateIndex
CREATE INDEX "checks_bills_portfolio_type_idx" ON "checks_bills"("portfolio_type");

-- CreateIndex
CREATE INDEX "deleted_checks_bills_original_id_idx" ON "deleted_checks_bills"("original_id");

-- CreateIndex
CREATE INDEX "deleted_checks_bills_deleted_at_idx" ON "deleted_checks_bills"("deleted_at");

-- CreateIndex
CREATE INDEX "deleted_checks_bills_account_id_idx" ON "deleted_checks_bills"("account_id");

-- CreateIndex
CREATE INDEX "deleted_checks_bills_tenantId_idx" ON "deleted_checks_bills"("tenantId");

-- CreateIndex
CREATE INDEX "check_bill_logs_check_bill_id_idx" ON "check_bill_logs"("check_bill_id");

-- CreateIndex
CREATE INDEX "check_bill_logs_user_id_idx" ON "check_bill_logs"("user_id");

-- CreateIndex
CREATE INDEX "check_bill_logs_tenantId_idx" ON "check_bill_logs"("tenantId");

-- CreateIndex
CREATE INDEX "employees_tenantId_idx" ON "employees"("tenantId");

-- CreateIndex
CREATE INDEX "employees_tenantId_employee_code_idx" ON "employees"("tenantId", "employee_code");

-- CreateIndex
CREATE INDEX "employees_is_active_idx" ON "employees"("is_active");

-- CreateIndex
CREATE INDEX "employees_department_idx" ON "employees"("department");

-- CreateIndex
CREATE UNIQUE INDEX "employees_employee_code_tenantId_key" ON "employees"("employee_code", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "employees_identity_number_tenantId_key" ON "employees"("identity_number", "tenantId");

-- CreateIndex
CREATE INDEX "employee_payments_employee_id_idx" ON "employee_payments"("employee_id");

-- CreateIndex
CREATE INDEX "employee_payments_date_idx" ON "employee_payments"("date");

-- CreateIndex
CREATE INDEX "employee_payments_type_idx" ON "employee_payments"("type");

-- CreateIndex
CREATE INDEX "employee_payments_tenantId_idx" ON "employee_payments"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "code_templates_module_tenantId_key" ON "code_templates"("module", "tenantId");

-- CreateIndex
CREATE INDEX "vehicle_catalog_brand_idx" ON "vehicle_catalog"("brand");

-- CreateIndex
CREATE INDEX "vehicle_catalog_model_idx" ON "vehicle_catalog"("model");

-- CreateIndex
CREATE INDEX "vehicle_catalog_fuel_type_idx" ON "vehicle_catalog"("fuel_type");

-- CreateIndex
CREATE UNIQUE INDEX "vehicle_catalog_brand_model_engine_volume_fuel_type_key" ON "vehicle_catalog"("brand", "model", "engine_volume", "fuel_type");

-- CreateIndex
CREATE INDEX "purchase_orders_tenantId_idx" ON "purchase_orders"("tenantId");

-- CreateIndex
CREATE INDEX "purchase_orders_tenantId_orderNumber_idx" ON "purchase_orders"("tenantId", "orderNumber");

-- CreateIndex
CREATE INDEX "purchase_orders_supplier_id_idx" ON "purchase_orders"("supplier_id");

-- CreateIndex
CREATE INDEX "purchase_orders_status_idx" ON "purchase_orders"("status");

-- CreateIndex
CREATE INDEX "purchase_orders_order_date_idx" ON "purchase_orders"("order_date");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_orders_orderNumber_tenantId_key" ON "purchase_orders"("orderNumber", "tenantId");

-- CreateIndex
CREATE INDEX "purchase_order_items_purchase_order_id_idx" ON "purchase_order_items"("purchase_order_id");

-- CreateIndex
CREATE INDEX "purchase_order_items_product_id_idx" ON "purchase_order_items"("product_id");

-- CreateIndex
CREATE INDEX "simple_orders_tenantId_idx" ON "simple_orders"("tenantId");

-- CreateIndex
CREATE INDEX "simple_orders_tenantId_company_id_idx" ON "simple_orders"("tenantId", "company_id");

-- CreateIndex
CREATE INDEX "simple_orders_tenantId_product_id_idx" ON "simple_orders"("tenantId", "product_id");

-- CreateIndex
CREATE INDEX "simple_orders_company_id_idx" ON "simple_orders"("company_id");

-- CreateIndex
CREATE INDEX "simple_orders_product_id_idx" ON "simple_orders"("product_id");

-- CreateIndex
CREATE INDEX "simple_orders_status_idx" ON "simple_orders"("status");

-- CreateIndex
CREATE INDEX "simple_orders_createdAt_idx" ON "simple_orders"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "procurement_orders_deliveryNoteId_key" ON "procurement_orders"("deliveryNoteId");

-- CreateIndex
CREATE INDEX "procurement_orders_account_id_idx" ON "procurement_orders"("account_id");

-- CreateIndex
CREATE INDEX "procurement_orders_date_idx" ON "procurement_orders"("date");

-- CreateIndex
CREATE INDEX "procurement_orders_order_no_idx" ON "procurement_orders"("order_no");

-- CreateIndex
CREATE INDEX "procurement_orders_status_idx" ON "procurement_orders"("status");

-- CreateIndex
CREATE INDEX "procurement_orders_tenantId_idx" ON "procurement_orders"("tenantId");

-- CreateIndex
CREATE INDEX "purchase_order_local_items_order_id_idx" ON "purchase_order_local_items"("order_id");

-- CreateIndex
CREATE INDEX "purchase_order_local_items_product_id_idx" ON "purchase_order_local_items"("product_id");

-- CreateIndex
CREATE INDEX "purchase_order_local_logs_order_id_idx" ON "purchase_order_local_logs"("order_id");

-- CreateIndex
CREATE INDEX "purchase_order_local_logs_user_id_idx" ON "purchase_order_local_logs"("user_id");

-- CreateIndex
CREATE INDEX "purchase_order_local_logs_tenantId_idx" ON "purchase_order_local_logs"("tenantId");

-- CreateIndex
CREATE INDEX "purchase_delivery_notes_tenantId_idx" ON "purchase_delivery_notes"("tenantId");

-- CreateIndex
CREATE INDEX "purchase_delivery_notes_date_idx" ON "purchase_delivery_notes"("date");

-- CreateIndex
CREATE INDEX "purchase_delivery_notes_account_id_idx" ON "purchase_delivery_notes"("account_id");

-- CreateIndex
CREATE INDEX "purchase_delivery_notes_status_idx" ON "purchase_delivery_notes"("status");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_delivery_notes_delivery_note_no_tenantId_key" ON "purchase_delivery_notes"("delivery_note_no", "tenantId");

-- CreateIndex
CREATE INDEX "purchase_delivery_note_items_delivery_note_id_idx" ON "purchase_delivery_note_items"("delivery_note_id");

-- CreateIndex
CREATE INDEX "purchase_delivery_note_items_product_id_idx" ON "purchase_delivery_note_items"("product_id");

-- CreateIndex
CREATE INDEX "purchase_delivery_note_items_tenantId_idx" ON "purchase_delivery_note_items"("tenantId");

-- CreateIndex
CREATE INDEX "purchase_delivery_note_logs_delivery_note_id_idx" ON "purchase_delivery_note_logs"("delivery_note_id");

-- CreateIndex
CREATE INDEX "purchase_delivery_note_logs_user_id_idx" ON "purchase_delivery_note_logs"("user_id");

-- CreateIndex
CREATE INDEX "purchase_delivery_note_logs_tenantId_idx" ON "purchase_delivery_note_logs"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "modules_slug_key" ON "modules"("slug");

-- CreateIndex
CREATE INDEX "modules_slug_idx" ON "modules"("slug");

-- CreateIndex
CREATE INDEX "modules_isActive_idx" ON "modules"("isActive");

-- CreateIndex
CREATE INDEX "module_licenses_subscriptionId_idx" ON "module_licenses"("subscriptionId");

-- CreateIndex
CREATE INDEX "module_licenses_moduleId_idx" ON "module_licenses"("moduleId");

-- CreateIndex
CREATE INDEX "user_licenses_userId_idx" ON "user_licenses"("userId");

-- CreateIndex
CREATE INDEX "user_licenses_moduleId_idx" ON "user_licenses"("moduleId");

-- CreateIndex
CREATE INDEX "user_licenses_licenseType_idx" ON "user_licenses"("licenseType");

-- CreateIndex
CREATE UNIQUE INDEX "user_licenses_userId_licenseType_moduleId_key" ON "user_licenses"("userId", "licenseType", "moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "invitations_token_key" ON "invitations"("token");

-- CreateIndex
CREATE INDEX "invitations_email_idx" ON "invitations"("email");

-- CreateIndex
CREATE INDEX "invitations_tenantId_idx" ON "invitations"("tenantId");

-- CreateIndex
CREATE INDEX "invitations_token_idx" ON "invitations"("token");

-- CreateIndex
CREATE INDEX "invitations_status_idx" ON "invitations"("status");

-- CreateIndex
CREATE INDEX "hizli_tokens_expiresAt_idx" ON "hizli_tokens"("expiresAt");

-- CreateIndex
CREATE INDEX "hizli_tokens_loginHash_idx" ON "hizli_tokens"("loginHash");

-- CreateIndex
CREATE UNIQUE INDEX "einvoice_inbox_ettn_key" ON "einvoice_inbox"("ettn");

-- CreateIndex
CREATE INDEX "einvoice_inbox_senderVkn_idx" ON "einvoice_inbox"("senderVkn");

-- CreateIndex
CREATE INDEX "einvoice_inbox_createdAt_idx" ON "einvoice_inbox"("createdAt");

-- CreateIndex
CREATE INDEX "einvoice_inbox_tenant_id_idx" ON "einvoice_inbox"("tenant_id");

-- CreateIndex
CREATE INDEX "einvoice_inbox_matched_invoice_id_idx" ON "einvoice_inbox"("matched_invoice_id");

-- CreateIndex
CREATE INDEX "einvoice_inbox_status_idx" ON "einvoice_inbox"("status");

-- CreateIndex
CREATE INDEX "customer_vehicles_tenantId_idx" ON "customer_vehicles"("tenantId");

-- CreateIndex
CREATE INDEX "customer_vehicles_account_id_idx" ON "customer_vehicles"("account_id");

-- CreateIndex
CREATE INDEX "customer_vehicles_service_status_idx" ON "customer_vehicles"("service_status");

-- CreateIndex
CREATE INDEX "customer_vehicles_vehicle_catalog_id_idx" ON "customer_vehicles"("vehicle_catalog_id");

-- CreateIndex
CREATE UNIQUE INDEX "customer_vehicles_plate_tenantId_key" ON "customer_vehicles"("plate", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "customer_vehicles_chassis_no_tenantId_key" ON "customer_vehicles"("chassis_no", "tenantId");

-- CreateIndex
CREATE INDEX "work_orders_tenantId_idx" ON "work_orders"("tenantId");

-- CreateIndex
CREATE INDEX "work_orders_status_idx" ON "work_orders"("status");

-- CreateIndex
CREATE INDEX "work_orders_createdAt_idx" ON "work_orders"("createdAt");

-- CreateIndex
CREATE INDEX "work_orders_account_id_idx" ON "work_orders"("account_id");

-- CreateIndex
CREATE INDEX "work_orders_technicianId_idx" ON "work_orders"("technicianId");

-- CreateIndex
CREATE INDEX "work_orders_service_template_id_idx" ON "work_orders"("service_template_id");

-- CreateIndex
CREATE UNIQUE INDEX "work_orders_workOrderNo_tenantId_key" ON "work_orders"("workOrderNo", "tenantId");

-- CreateIndex
CREATE INDEX "work_order_activities_workOrderId_idx" ON "work_order_activities"("workOrderId");

-- CreateIndex
CREATE INDEX "work_order_activities_workOrderId_createdAt_idx" ON "work_order_activities"("workOrderId", "createdAt");

-- CreateIndex
CREATE INDEX "work_order_activities_tenantId_idx" ON "work_order_activities"("tenantId");

-- CreateIndex
CREATE INDEX "work_order_items_workOrderId_idx" ON "work_order_items"("workOrderId");

-- CreateIndex
CREATE INDEX "work_order_items_product_id_idx" ON "work_order_items"("product_id");

-- CreateIndex
CREATE INDEX "work_order_items_tenantId_idx" ON "work_order_items"("tenantId");

-- CreateIndex
CREATE INDEX "part_requests_tenantId_idx" ON "part_requests"("tenantId");

-- CreateIndex
CREATE INDEX "part_requests_workOrderId_idx" ON "part_requests"("workOrderId");

-- CreateIndex
CREATE INDEX "part_requests_status_idx" ON "part_requests"("status");

-- CreateIndex
CREATE INDEX "inventory_transactions_tenantId_idx" ON "inventory_transactions"("tenantId");

-- CreateIndex
CREATE INDEX "inventory_transactions_partRequestId_idx" ON "inventory_transactions"("partRequestId");

-- CreateIndex
CREATE INDEX "inventory_transactions_product_id_idx" ON "inventory_transactions"("product_id");

-- CreateIndex
CREATE INDEX "inventory_transactions_tenantId_createdAt_idx" ON "inventory_transactions"("tenantId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "service_invoices_workOrderId_key" ON "service_invoices"("workOrderId");

-- CreateIndex
CREATE INDEX "service_invoices_tenantId_idx" ON "service_invoices"("tenantId");

-- CreateIndex
CREATE INDEX "service_invoices_issueDate_idx" ON "service_invoices"("issueDate");

-- CreateIndex
CREATE INDEX "service_invoices_account_id_idx" ON "service_invoices"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "service_invoices_invoiceNo_tenantId_key" ON "service_invoices"("invoiceNo", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "journal_entries_serviceInvoiceId_key" ON "journal_entries"("serviceInvoiceId");

-- CreateIndex
CREATE INDEX "journal_entries_tenantId_idx" ON "journal_entries"("tenantId");

-- CreateIndex
CREATE INDEX "journal_entries_tenantId_referenceType_referenceId_idx" ON "journal_entries"("tenantId", "referenceType", "referenceId");

-- CreateIndex
CREATE INDEX "journal_entries_entryDate_idx" ON "journal_entries"("entryDate");

-- CreateIndex
CREATE INDEX "journal_entry_lines_journalEntryId_idx" ON "journal_entry_lines"("journalEntryId");

-- CreateIndex
CREATE INDEX "journal_entry_lines_tenantId_idx" ON "journal_entry_lines"("tenantId");

-- CreateIndex
CREATE INDEX "company_credit_card_reminders_day_is_active_idx" ON "company_credit_card_reminders"("day", "is_active");

-- CreateIndex
CREATE INDEX "company_credit_card_reminders_card_id_idx" ON "company_credit_card_reminders"("card_id");

-- CreateIndex
CREATE INDEX "company_credit_card_reminders_tenantId_idx" ON "company_credit_card_reminders"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "company_credit_card_reminders_card_id_type_key" ON "company_credit_card_reminders"("card_id", "type");

-- CreateIndex
CREATE INDEX "invoice_profit_invoice_id_idx" ON "invoice_profit"("invoice_id");

-- CreateIndex
CREATE INDEX "invoice_profit_invoice_item_id_idx" ON "invoice_profit"("invoice_item_id");

-- CreateIndex
CREATE INDEX "invoice_profit_product_id_idx" ON "invoice_profit"("product_id");

-- CreateIndex
CREATE INDEX "invoice_profit_tenantId_invoice_id_idx" ON "invoice_profit"("tenantId", "invoice_id");

-- CreateIndex
CREATE INDEX "postal_codes_city_district_idx" ON "postal_codes"("city", "district");

-- CreateIndex
CREATE INDEX "postal_codes_city_district_neighborhood_idx" ON "postal_codes"("city", "district", "neighborhood");

-- CreateIndex
CREATE INDEX "postal_codes_city_idx" ON "postal_codes"("city");

-- CreateIndex
CREATE INDEX "postal_codes_district_idx" ON "postal_codes"("district");

-- CreateIndex
CREATE INDEX "postal_codes_neighborhood_idx" ON "postal_codes"("neighborhood");

-- CreateIndex
CREATE INDEX "postal_codes_postalCode_idx" ON "postal_codes"("postalCode");

-- CreateIndex
CREATE UNIQUE INDEX "postal_codes_city_district_neighborhood_key" ON "postal_codes"("city", "district", "neighborhood");

-- CreateIndex
CREATE INDEX "system_parameters_category_idx" ON "system_parameters"("category");

-- CreateIndex
CREATE INDEX "system_parameters_tenantId_idx" ON "system_parameters"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "system_parameters_tenantId_key_key" ON "system_parameters"("tenantId", "key");

-- CreateIndex
CREATE INDEX "warehouse_critical_stocks_productId_idx" ON "warehouse_critical_stocks"("productId");

-- CreateIndex
CREATE INDEX "warehouse_critical_stocks_warehouseId_idx" ON "warehouse_critical_stocks"("warehouseId");

-- CreateIndex
CREATE INDEX "warehouse_critical_stocks_tenantId_idx" ON "warehouse_critical_stocks"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "warehouse_critical_stocks_warehouseId_productId_key" ON "warehouse_critical_stocks"("warehouseId", "productId");

-- CreateIndex
CREATE INDEX "warehouse_transfer_items_product_id_idx" ON "warehouse_transfer_items"("product_id");

-- CreateIndex
CREATE INDEX "warehouse_transfer_items_transferId_idx" ON "warehouse_transfer_items"("transferId");

-- CreateIndex
CREATE INDEX "warehouse_transfer_items_tenantId_idx" ON "warehouse_transfer_items"("tenantId");

-- CreateIndex
CREATE INDEX "warehouse_transfer_logs_transferId_idx" ON "warehouse_transfer_logs"("transferId");

-- CreateIndex
CREATE INDEX "warehouse_transfer_logs_userId_idx" ON "warehouse_transfer_logs"("userId");

-- CreateIndex
CREATE INDEX "warehouse_transfer_logs_tenantId_idx" ON "warehouse_transfer_logs"("tenantId");

-- CreateIndex
CREATE INDEX "warehouse_transfers_fromWarehouseId_idx" ON "warehouse_transfers"("fromWarehouseId");

-- CreateIndex
CREATE INDEX "warehouse_transfers_tenantId_status_idx" ON "warehouse_transfers"("tenantId", "status");

-- CreateIndex
CREATE INDEX "warehouse_transfers_tenantId_idx" ON "warehouse_transfers"("tenantId");

-- CreateIndex
CREATE INDEX "warehouse_transfers_toWarehouseId_idx" ON "warehouse_transfers"("toWarehouseId");

-- CreateIndex
CREATE UNIQUE INDEX "warehouse_transfers_transferNo_tenantId_key" ON "warehouse_transfers"("transferNo", "tenantId");

-- CreateIndex
CREATE INDEX "price_lists_tenantId_idx" ON "price_lists"("tenantId");

-- CreateIndex
CREATE INDEX "price_list_items_product_id_idx" ON "price_list_items"("product_id");

-- CreateIndex
CREATE INDEX "price_list_items_tenantId_idx" ON "price_list_items"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "price_list_items_price_list_id_product_id_key" ON "price_list_items"("price_list_id", "product_id");

-- CreateIndex
CREATE INDEX "salary_plans_tenantId_idx" ON "salary_plans"("tenantId");

-- CreateIndex
CREATE INDEX "salary_plans_employee_id_year_idx" ON "salary_plans"("employee_id", "year");

-- CreateIndex
CREATE INDEX "salary_plans_status_idx" ON "salary_plans"("status");

-- CreateIndex
CREATE INDEX "salary_plans_year_month_idx" ON "salary_plans"("year", "month");

-- CreateIndex
CREATE UNIQUE INDEX "salary_plans_employee_id_year_month_key" ON "salary_plans"("employee_id", "year", "month");

-- CreateIndex
CREATE INDEX "salary_payments_tenantId_idx" ON "salary_payments"("tenantId");

-- CreateIndex
CREATE INDEX "salary_payments_employee_id_idx" ON "salary_payments"("employee_id");

-- CreateIndex
CREATE INDEX "salary_payments_plan_id_idx" ON "salary_payments"("plan_id");

-- CreateIndex
CREATE INDEX "salary_payment_details_tenantId_idx" ON "salary_payment_details"("tenantId");

-- CreateIndex
CREATE INDEX "salary_payment_details_salary_payment_id_idx" ON "salary_payment_details"("salary_payment_id");

-- CreateIndex
CREATE INDEX "salary_payment_details_cashbox_id_idx" ON "salary_payment_details"("cashbox_id");

-- CreateIndex
CREATE INDEX "salary_payment_details_bank_account_id_idx" ON "salary_payment_details"("bank_account_id");

-- CreateIndex
CREATE INDEX "advances_tenantId_idx" ON "advances"("tenantId");

-- CreateIndex
CREATE INDEX "advances_employee_id_idx" ON "advances"("employee_id");

-- CreateIndex
CREATE INDEX "advances_date_idx" ON "advances"("date");

-- CreateIndex
CREATE INDEX "advance_settlements_tenantId_idx" ON "advance_settlements"("tenantId");

-- CreateIndex
CREATE INDEX "advance_settlements_advance_id_idx" ON "advance_settlements"("advance_id");

-- CreateIndex
CREATE INDEX "advance_settlements_salary_plan_id_idx" ON "advance_settlements"("salary_plan_id");

-- CreateIndex
CREATE INDEX "sales_agents_tenantId_idx" ON "sales_agents"("tenantId");

-- CreateIndex
CREATE INDEX "roles_tenantId_idx" ON "roles"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "roles_tenantId_name_key" ON "roles"("tenantId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_module_action_key" ON "permissions"("module", "action");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_roleId_permissionId_key" ON "role_permissions"("roleId", "permissionId");

-- CreateIndex
CREATE INDEX "tenant_purge_audits_tenantId_idx" ON "tenant_purge_audits"("tenantId");

-- CreateIndex
CREATE INDEX "tenant_purge_audits_adminId_idx" ON "tenant_purge_audits"("adminId");

-- CreateIndex
CREATE INDEX "tenant_purge_audits_createdAt_idx" ON "tenant_purge_audits"("createdAt");

-- CreateIndex
CREATE INDEX "company_vehicles_tenantId_idx" ON "company_vehicles"("tenantId");

-- CreateIndex
CREATE INDEX "company_vehicles_assigned_employee_id_idx" ON "company_vehicles"("assigned_employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "company_vehicles_plate_tenantId_key" ON "company_vehicles"("plate", "tenantId");

-- CreateIndex
CREATE INDEX "vehicle_expenses_tenantId_idx" ON "vehicle_expenses"("tenantId");

-- CreateIndex
CREATE INDEX "vehicle_expenses_vehicleId_idx" ON "vehicle_expenses"("vehicleId");

-- CreateIndex
CREATE INDEX "vehicle_expenses_date_idx" ON "vehicle_expenses"("date");

-- CreateIndex
CREATE INDEX "unit_sets_tenant_id_idx" ON "unit_sets"("tenant_id");

-- CreateIndex
CREATE INDEX "units_unit_set_id_idx" ON "units"("unit_set_id");

-- CreateIndex
CREATE INDEX "pos_payments_tenantId_idx" ON "pos_payments"("tenantId");

-- CreateIndex
CREATE INDEX "pos_payments_invoice_id_idx" ON "pos_payments"("invoice_id");

-- CreateIndex
CREATE INDEX "pos_sessions_tenantId_idx" ON "pos_sessions"("tenantId");

-- CreateIndex
CREATE INDEX "pos_sessions_cashier_id_idx" ON "pos_sessions"("cashier_id");

-- CreateIndex
CREATE INDEX "pos_sessions_status_idx" ON "pos_sessions"("status");

-- CreateIndex
CREATE UNIQUE INDEX "pos_sessions_session_no_tenantId_key" ON "pos_sessions"("session_no", "tenantId");

-- CreateIndex
CREATE INDEX "tenant_usage_metrics_tenant_id_idx" ON "tenant_usage_metrics"("tenant_id");

-- CreateIndex
CREATE INDEX "tenant_usage_metrics_metric_date_idx" ON "tenant_usage_metrics"("metric_date");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_usage_metrics_tenant_id_metric_date_key" ON "tenant_usage_metrics"("tenant_id", "metric_date");

-- CreateIndex
CREATE INDEX "feature_flags_tenant_id_idx" ON "feature_flags"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "feature_flags_tenant_id_flag_key_key" ON "feature_flags"("tenant_id", "flag_key");

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_key_hash_key" ON "api_keys"("key_hash");

-- CreateIndex
CREATE INDEX "api_keys_tenant_id_idx" ON "api_keys"("tenant_id");

-- CreateIndex
CREATE INDEX "api_keys_key_prefix_idx" ON "api_keys"("key_prefix");

-- CreateIndex
CREATE INDEX "webhook_endpoints_tenant_id_idx" ON "webhook_endpoints"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "coupons_code_key" ON "coupons"("code");

-- CreateIndex
CREATE INDEX "coupons_code_idx" ON "coupons"("code");

-- CreateIndex
CREATE INDEX "coupons_is_active_idx" ON "coupons"("is_active");

-- CreateIndex
CREATE INDEX "coupons_tenantId_idx" ON "coupons"("tenantId");

-- CreateIndex
CREATE INDEX "coupon_redemptions_tenant_id_idx" ON "coupon_redemptions"("tenant_id");

-- CreateIndex
CREATE INDEX "coupon_redemptions_coupon_id_idx" ON "coupon_redemptions"("coupon_id");

-- CreateIndex
CREATE UNIQUE INDEX "coupon_redemptions_coupon_id_tenant_id_key" ON "coupon_redemptions"("coupon_id", "tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_onboardings_tenant_id_key" ON "tenant_onboardings"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "einvoice_sends_invoice_id_key" ON "einvoice_sends"("invoice_id");

-- CreateIndex
CREATE UNIQUE INDEX "einvoice_sends_ettn_key" ON "einvoice_sends"("ettn");

-- CreateIndex
CREATE INDEX "einvoice_sends_tenant_id_idx" ON "einvoice_sends"("tenant_id");

-- CreateIndex
CREATE INDEX "einvoice_sends_ettn_idx" ON "einvoice_sends"("ettn");

-- CreateIndex
CREATE INDEX "einvoice_sends_status_idx" ON "einvoice_sends"("status");

-- CreateIndex
CREATE INDEX "einvoice_sends_sent_at_idx" ON "einvoice_sends"("sent_at");

-- CreateIndex
CREATE UNIQUE INDEX "einvoice_tenant_configs_tenant_id_key" ON "einvoice_tenant_configs"("tenant_id");

-- CreateIndex
CREATE INDEX "departments_tenant_id_idx" ON "departments"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "departments_tenant_id_name_key" ON "departments"("tenant_id", "name");

-- CreateIndex
CREATE INDEX "leave_types_tenant_id_idx" ON "leave_types"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "leave_types_tenant_id_code_key" ON "leave_types"("tenant_id", "code");

-- CreateIndex
CREATE INDEX "leave_requests_tenant_id_idx" ON "leave_requests"("tenant_id");

-- CreateIndex
CREATE INDEX "leave_requests_employee_id_idx" ON "leave_requests"("employee_id");

-- CreateIndex
CREATE INDEX "leave_requests_status_idx" ON "leave_requests"("status");

-- CreateIndex
CREATE INDEX "leave_requests_start_date_end_date_idx" ON "leave_requests"("start_date", "end_date");

-- CreateIndex
CREATE INDEX "overtime_records_tenant_id_idx" ON "overtime_records"("tenant_id");

-- CreateIndex
CREATE INDEX "overtime_records_employee_id_idx" ON "overtime_records"("employee_id");

-- CreateIndex
CREATE INDEX "overtime_records_date_idx" ON "overtime_records"("date");

-- CreateIndex
CREATE INDEX "asset_assignments_tenant_id_idx" ON "asset_assignments"("tenant_id");

-- CreateIndex
CREATE INDEX "asset_assignments_employee_id_idx" ON "asset_assignments"("employee_id");

-- CreateIndex
CREATE INDEX "performance_reviews_tenant_id_idx" ON "performance_reviews"("tenant_id");

-- CreateIndex
CREATE INDEX "performance_reviews_employee_id_idx" ON "performance_reviews"("employee_id");

-- CreateIndex
CREATE INDEX "performance_reviews_period_start_period_end_idx" ON "performance_reviews"("period_start", "period_end");

-- CreateIndex
CREATE INDEX "service_templates_tenant_id_idx" ON "service_templates"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "service_templates_tenant_id_name_key" ON "service_templates"("tenant_id", "name");

-- CreateIndex
CREATE INDEX "work_order_warranties_tenant_id_idx" ON "work_order_warranties"("tenant_id");

-- CreateIndex
CREATE INDEX "work_order_warranties_work_order_id_idx" ON "work_order_warranties"("work_order_id");

-- CreateIndex
CREATE INDEX "work_order_warranties_valid_until_idx" ON "work_order_warranties"("valid_until");

-- CreateIndex
CREATE INDEX "preventive_maintenances_tenant_id_idx" ON "preventive_maintenances"("tenant_id");

-- CreateIndex
CREATE INDEX "preventive_maintenances_vehicle_id_idx" ON "preventive_maintenances"("vehicle_id");

-- CreateIndex
CREATE INDEX "preventive_maintenances_next_due_at_idx" ON "preventive_maintenances"("next_due_at");

-- CreateIndex
CREATE INDEX "technician_metrics_tenant_id_idx" ON "technician_metrics"("tenant_id");

-- CreateIndex
CREATE INDEX "technician_metrics_technician_id_idx" ON "technician_metrics"("technician_id");

-- CreateIndex
CREATE UNIQUE INDEX "technician_metrics_technician_id_period_start_period_end_key" ON "technician_metrics"("technician_id", "period_start", "period_end");

-- AddForeignKey
ALTER TABLE "tenant_settings" ADD CONSTRAINT "tenant_settings_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_equivalency_group_id_fkey" FOREIGN KEY ("equivalency_group_id") REFERENCES "equivalency_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brands" ADD CONSTRAINT "brands_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_vehicle_compatibilities" ADD CONSTRAINT "product_vehicle_compatibilities_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_vehicle_compatibilities" ADD CONSTRAINT "product_vehicle_compatibilities_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_cards" ADD CONSTRAINT "price_cards_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_cards" ADD CONSTRAINT "price_cards_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_cards" ADD CONSTRAINT "price_cards_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_cards" ADD CONSTRAINT "price_cards_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_cost_history" ADD CONSTRAINT "stock_cost_history_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equivalency_groups" ADD CONSTRAINT "equivalency_groups_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_equivalents" ADD CONSTRAINT "product_equivalents_product1_id_fkey" FOREIGN KEY ("product1_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_equivalents" ADD CONSTRAINT "product_equivalents_product2_id_fkey" FOREIGN KEY ("product2_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_movements" ADD CONSTRAINT "product_movements_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_movements" ADD CONSTRAINT "product_movements_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_movements" ADD CONSTRAINT "product_movements_invoice_item_id_fkey" FOREIGN KEY ("invoice_item_id") REFERENCES "invoice_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_movements" ADD CONSTRAINT "product_movements_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_movements" ADD CONSTRAINT "product_movements_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_movements" ADD CONSTRAINT "product_movements_reversal_of_id_fkey" FOREIGN KEY ("reversal_of_id") REFERENCES "product_movements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_sales_agent_id_fkey" FOREIGN KEY ("sales_agent_id") REFERENCES "sales_agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_price_list_id_fkey" FOREIGN KEY ("price_list_id") REFERENCES "price_lists"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_contacts" ADD CONSTRAINT "account_contacts_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_addresses" ADD CONSTRAINT "account_addresses_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_banks" ADD CONSTRAINT "account_banks_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_movements" ADD CONSTRAINT "account_movements_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_movements" ADD CONSTRAINT "account_movements_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_movements" ADD CONSTRAINT "account_movements_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_movements" ADD CONSTRAINT "account_movements_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cashboxes" ADD CONSTRAINT "cashboxes_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cashboxes" ADD CONSTRAINT "cashboxes_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cashboxes" ADD CONSTRAINT "cashboxes_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cashboxes" ADD CONSTRAINT "cashboxes_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banks" ADD CONSTRAINT "banks_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_bank_id_fkey" FOREIGN KEY ("bank_id") REFERENCES "banks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_account_movements" ADD CONSTRAINT "bank_account_movements_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_account_movements" ADD CONSTRAINT "bank_account_movements_bank_account_id_fkey" FOREIGN KEY ("bank_account_id") REFERENCES "bank_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_account_movements" ADD CONSTRAINT "bank_account_movements_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_account_movements" ADD CONSTRAINT "bank_account_movements_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_loans" ADD CONSTRAINT "bank_loans_bank_account_id_fkey" FOREIGN KEY ("bank_account_id") REFERENCES "bank_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_loans" ADD CONSTRAINT "bank_loans_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_loan_plans" ADD CONSTRAINT "bank_loan_plans_loan_id_fkey" FOREIGN KEY ("loan_id") REFERENCES "bank_loans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_loan_plans" ADD CONSTRAINT "bank_loan_plans_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_credit_cards" ADD CONSTRAINT "company_credit_cards_cashbox_id_fkey" FOREIGN KEY ("cashbox_id") REFERENCES "cashboxes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_credit_card_movements" ADD CONSTRAINT "company_credit_card_movements_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_credit_card_movements" ADD CONSTRAINT "company_credit_card_movements_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "company_credit_cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cashbox_movements" ADD CONSTRAINT "cashbox_movements_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cashbox_movements" ADD CONSTRAINT "cashbox_movements_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cashbox_movements" ADD CONSTRAINT "cashbox_movements_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cashbox_movements" ADD CONSTRAINT "cashbox_movements_cashbox_id_fkey" FOREIGN KEY ("cashbox_id") REFERENCES "cashboxes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cashbox_movements" ADD CONSTRAINT "cashbox_movements_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_delivery_note_id_fkey" FOREIGN KEY ("delivery_note_id") REFERENCES "sales_delivery_notes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_purchase_order_id_fkey" FOREIGN KEY ("purchase_order_id") REFERENCES "purchase_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_purchase_delivery_note_id_fkey" FOREIGN KEY ("purchase_delivery_note_id") REFERENCES "purchase_delivery_notes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_procurement_order_id_fkey" FOREIGN KEY ("procurement_order_id") REFERENCES "procurement_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_sales_agent_id_fkey" FOREIGN KEY ("sales_agent_id") REFERENCES "sales_agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_logs" ADD CONSTRAINT "invoice_logs_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_logs" ADD CONSTRAINT "invoice_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_purchase_order_item_id_fkey" FOREIGN KEY ("purchase_order_item_id") REFERENCES "purchase_order_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_payment_plans" ADD CONSTRAINT "invoice_payment_plans_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_bank_account_id_fkey" FOREIGN KEY ("bank_account_id") REFERENCES "bank_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_service_invoice_id_fkey" FOREIGN KEY ("service_invoice_id") REFERENCES "service_invoices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_company_credit_card_id_fkey" FOREIGN KEY ("company_credit_card_id") REFERENCES "company_credit_cards"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_cashbox_id_fkey" FOREIGN KEY ("cashbox_id") REFERENCES "cashboxes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_sales_agent_id_fkey" FOREIGN KEY ("sales_agent_id") REFERENCES "sales_agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_collections" ADD CONSTRAINT "invoice_collections_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_collections" ADD CONSTRAINT "invoice_collections_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_collections" ADD CONSTRAINT "invoice_collections_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "einvoice_xml" ADD CONSTRAINT "einvoice_xml_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_orders" ADD CONSTRAINT "sales_orders_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_orders" ADD CONSTRAINT "sales_orders_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_orders" ADD CONSTRAINT "sales_orders_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_orders" ADD CONSTRAINT "sales_orders_deliveryNoteId_fkey" FOREIGN KEY ("deliveryNoteId") REFERENCES "sales_delivery_notes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_orders" ADD CONSTRAINT "sales_orders_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_orders" ADD CONSTRAINT "sales_orders_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_order_items" ADD CONSTRAINT "sales_order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "sales_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_order_items" ADD CONSTRAINT "sales_order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_order_logs" ADD CONSTRAINT "sales_order_logs_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "sales_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_order_logs" ADD CONSTRAINT "sales_order_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_pickings" ADD CONSTRAINT "order_pickings_picked_by_fkey" FOREIGN KEY ("picked_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_pickings" ADD CONSTRAINT "order_pickings_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_pickings" ADD CONSTRAINT "order_pickings_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "sales_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_pickings" ADD CONSTRAINT "order_pickings_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "sales_order_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_delivery_notes" ADD CONSTRAINT "sales_delivery_notes_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_delivery_notes" ADD CONSTRAINT "sales_delivery_notes_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_delivery_notes" ADD CONSTRAINT "sales_delivery_notes_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_delivery_notes" ADD CONSTRAINT "sales_delivery_notes_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_delivery_notes" ADD CONSTRAINT "sales_delivery_notes_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_delivery_notes" ADD CONSTRAINT "sales_delivery_notes_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_delivery_notes" ADD CONSTRAINT "sales_delivery_notes_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "sales_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_delivery_note_items" ADD CONSTRAINT "sales_delivery_note_items_delivery_note_id_fkey" FOREIGN KEY ("delivery_note_id") REFERENCES "sales_delivery_notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_delivery_note_items" ADD CONSTRAINT "sales_delivery_note_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_delivery_note_logs" ADD CONSTRAINT "sales_delivery_note_logs_delivery_note_id_fkey" FOREIGN KEY ("delivery_note_id") REFERENCES "sales_delivery_notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_delivery_note_logs" ADD CONSTRAINT "sales_delivery_note_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "sales_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quote_items" ADD CONSTRAINT "quote_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quote_items" ADD CONSTRAINT "quote_items_quote_id_fkey" FOREIGN KEY ("quote_id") REFERENCES "quotes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quote_logs" ADD CONSTRAINT "quote_logs_quote_id_fkey" FOREIGN KEY ("quote_id") REFERENCES "quotes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quote_logs" ADD CONSTRAINT "quote_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocktakes" ADD CONSTRAINT "stocktakes_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocktakes" ADD CONSTRAINT "stocktakes_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocktakes" ADD CONSTRAINT "stocktakes_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocktakes" ADD CONSTRAINT "stocktakes_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocktake_items" ADD CONSTRAINT "stocktake_items_stocktake_id_fkey" FOREIGN KEY ("stocktake_id") REFERENCES "stocktakes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocktake_items" ADD CONSTRAINT "stocktake_items_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocktake_items" ADD CONSTRAINT "stocktake_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shelves" ADD CONSTRAINT "shelves_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_shelves" ADD CONSTRAINT "product_shelves_shelf_id_fkey" FOREIGN KEY ("shelf_id") REFERENCES "shelves"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_shelves" ADD CONSTRAINT "product_shelves_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_stock_thresholds" ADD CONSTRAINT "warehouse_stock_thresholds_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_stock_thresholds" ADD CONSTRAINT "warehouse_stock_thresholds_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_stock_thresholds" ADD CONSTRAINT "warehouse_stock_thresholds_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_costing_configs" ADD CONSTRAINT "product_costing_configs_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_costing_configs" ADD CONSTRAINT "product_costing_configs_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_lots" ADD CONSTRAINT "product_lots_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_lots" ADD CONSTRAINT "product_lots_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_lots" ADD CONSTRAINT "product_lots_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_barcodes" ADD CONSTRAINT "product_barcodes_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_location_stocks" ADD CONSTRAINT "product_location_stocks_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_location_stocks" ADD CONSTRAINT "product_location_stocks_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_location_stocks" ADD CONSTRAINT "product_location_stocks_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_moves" ADD CONSTRAINT "stock_moves_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_moves" ADD CONSTRAINT "stock_moves_fromLocationId_fkey" FOREIGN KEY ("fromLocationId") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_moves" ADD CONSTRAINT "stock_moves_fromWarehouseId_fkey" FOREIGN KEY ("fromWarehouseId") REFERENCES "warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_moves" ADD CONSTRAINT "stock_moves_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_moves" ADD CONSTRAINT "stock_moves_toLocationId_fkey" FOREIGN KEY ("toLocationId") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_moves" ADD CONSTRAINT "stock_moves_toWarehouseId_fkey" FOREIGN KEY ("toWarehouseId") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense_categories" ADD CONSTRAINT "expense_categories_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "expense_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_transfers" ADD CONSTRAINT "bank_transfers_cashbox_id_fkey" FOREIGN KEY ("cashbox_id") REFERENCES "cashboxes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_transfers" ADD CONSTRAINT "bank_transfers_bank_account_id_fkey" FOREIGN KEY ("bank_account_id") REFERENCES "bank_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_transfers" ADD CONSTRAINT "bank_transfers_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_transfers" ADD CONSTRAINT "bank_transfers_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_transfers" ADD CONSTRAINT "bank_transfers_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_transfers" ADD CONSTRAINT "bank_transfers_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_transfers" ADD CONSTRAINT "bank_transfers_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deleted_bank_transfers" ADD CONSTRAINT "deleted_bank_transfers_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deleted_bank_transfers" ADD CONSTRAINT "deleted_bank_transfers_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_transfer_logs" ADD CONSTRAINT "bank_transfer_logs_bank_transfer_id_fkey" FOREIGN KEY ("bank_transfer_id") REFERENCES "bank_transfers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_transfer_logs" ADD CONSTRAINT "bank_transfer_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_transfer_logs" ADD CONSTRAINT "bank_transfer_logs_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_bill_journals" ADD CONSTRAINT "check_bill_journals_bank_account_id_fkey" FOREIGN KEY ("bank_account_id") REFERENCES "bank_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_bill_journals" ADD CONSTRAINT "check_bill_journals_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_bill_journals" ADD CONSTRAINT "check_bill_journals_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_bill_journals" ADD CONSTRAINT "check_bill_journals_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_bill_journal_items" ADD CONSTRAINT "check_bill_journal_items_journal_id_fkey" FOREIGN KEY ("journal_id") REFERENCES "check_bill_journals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_bill_journal_items" ADD CONSTRAINT "check_bill_journal_items_check_bill_id_fkey" FOREIGN KEY ("check_bill_id") REFERENCES "checks_bills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_bill_journal_items" ADD CONSTRAINT "check_bill_journal_items_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checks_bills" ADD CONSTRAINT "checks_bills_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checks_bills" ADD CONSTRAINT "checks_bills_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checks_bills" ADD CONSTRAINT "checks_bills_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checks_bills" ADD CONSTRAINT "checks_bills_collection_cashbox_id_fkey" FOREIGN KEY ("collection_cashbox_id") REFERENCES "cashboxes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checks_bills" ADD CONSTRAINT "checks_bills_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checks_bills" ADD CONSTRAINT "checks_bills_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checks_bills" ADD CONSTRAINT "checks_bills_last_journal_id_fkey" FOREIGN KEY ("last_journal_id") REFERENCES "check_bill_journals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deleted_checks_bills" ADD CONSTRAINT "deleted_checks_bills_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_bill_logs" ADD CONSTRAINT "check_bill_logs_check_bill_id_fkey" FOREIGN KEY ("check_bill_id") REFERENCES "checks_bills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_bill_logs" ADD CONSTRAINT "check_bill_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_payments" ADD CONSTRAINT "employee_payments_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_payments" ADD CONSTRAINT "employee_payments_cashbox_id_fkey" FOREIGN KEY ("cashbox_id") REFERENCES "cashboxes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_payments" ADD CONSTRAINT "employee_payments_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "code_templates" ADD CONSTRAINT "code_templates_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order_items" ADD CONSTRAINT "purchase_order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order_items" ADD CONSTRAINT "purchase_order_items_purchase_order_id_fkey" FOREIGN KEY ("purchase_order_id") REFERENCES "purchase_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simple_orders" ADD CONSTRAINT "simple_orders_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simple_orders" ADD CONSTRAINT "simple_orders_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simple_orders" ADD CONSTRAINT "simple_orders_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement_orders" ADD CONSTRAINT "procurement_orders_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement_orders" ADD CONSTRAINT "procurement_orders_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement_orders" ADD CONSTRAINT "procurement_orders_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement_orders" ADD CONSTRAINT "procurement_orders_deliveryNoteId_fkey" FOREIGN KEY ("deliveryNoteId") REFERENCES "purchase_delivery_notes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement_orders" ADD CONSTRAINT "procurement_orders_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement_orders" ADD CONSTRAINT "procurement_orders_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order_local_items" ADD CONSTRAINT "purchase_order_local_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "procurement_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order_local_items" ADD CONSTRAINT "purchase_order_local_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order_local_logs" ADD CONSTRAINT "purchase_order_local_logs_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "procurement_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order_local_logs" ADD CONSTRAINT "purchase_order_local_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_delivery_notes" ADD CONSTRAINT "purchase_delivery_notes_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_delivery_notes" ADD CONSTRAINT "purchase_delivery_notes_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_delivery_notes" ADD CONSTRAINT "purchase_delivery_notes_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_delivery_notes" ADD CONSTRAINT "purchase_delivery_notes_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_delivery_notes" ADD CONSTRAINT "purchase_delivery_notes_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "procurement_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_delivery_notes" ADD CONSTRAINT "purchase_delivery_notes_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_delivery_notes" ADD CONSTRAINT "purchase_delivery_notes_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_delivery_note_items" ADD CONSTRAINT "purchase_delivery_note_items_delivery_note_id_fkey" FOREIGN KEY ("delivery_note_id") REFERENCES "purchase_delivery_notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_delivery_note_items" ADD CONSTRAINT "purchase_delivery_note_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_delivery_note_logs" ADD CONSTRAINT "purchase_delivery_note_logs_delivery_note_id_fkey" FOREIGN KEY ("delivery_note_id") REFERENCES "purchase_delivery_notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_delivery_note_logs" ADD CONSTRAINT "purchase_delivery_note_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "module_licenses" ADD CONSTRAINT "module_licenses_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "modules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "module_licenses" ADD CONSTRAINT "module_licenses_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_licenses" ADD CONSTRAINT "user_licenses_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "modules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_licenses" ADD CONSTRAINT "user_licenses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "einvoice_inbox" ADD CONSTRAINT "einvoice_inbox_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "einvoice_inbox" ADD CONSTRAINT "einvoice_inbox_matched_invoice_id_fkey" FOREIGN KEY ("matched_invoice_id") REFERENCES "invoices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "einvoice_inbox" ADD CONSTRAINT "einvoice_inbox_processed_by_fkey" FOREIGN KEY ("processed_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_vehicles" ADD CONSTRAINT "customer_vehicles_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_vehicles" ADD CONSTRAINT "customer_vehicles_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_customerVehicleId_fkey" FOREIGN KEY ("customerVehicleId") REFERENCES "customer_vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_service_template_id_fkey" FOREIGN KEY ("service_template_id") REFERENCES "service_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_order_activities" ADD CONSTRAINT "work_order_activities_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "work_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_order_activities" ADD CONSTRAINT "work_order_activities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_order_items" ADD CONSTRAINT "work_order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_order_items" ADD CONSTRAINT "work_order_items_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "work_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "part_requests" ADD CONSTRAINT "part_requests_requestedBy_fkey" FOREIGN KEY ("requestedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "part_requests" ADD CONSTRAINT "part_requests_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "part_requests" ADD CONSTRAINT "part_requests_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "work_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "part_requests" ADD CONSTRAINT "part_requests_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_transactions" ADD CONSTRAINT "inventory_transactions_partRequestId_fkey" FOREIGN KEY ("partRequestId") REFERENCES "part_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_transactions" ADD CONSTRAINT "inventory_transactions_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_transactions" ADD CONSTRAINT "inventory_transactions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_transactions" ADD CONSTRAINT "inventory_transactions_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_invoices" ADD CONSTRAINT "service_invoices_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_invoices" ADD CONSTRAINT "service_invoices_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_invoices" ADD CONSTRAINT "service_invoices_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_invoices" ADD CONSTRAINT "service_invoices_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "work_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_serviceInvoiceId_fkey" FOREIGN KEY ("serviceInvoiceId") REFERENCES "service_invoices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_entry_lines" ADD CONSTRAINT "journal_entry_lines_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES "journal_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_credit_card_reminders" ADD CONSTRAINT "company_credit_card_reminders_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "company_credit_cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_profit" ADD CONSTRAINT "invoice_profit_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_profit" ADD CONSTRAINT "invoice_profit_invoice_item_id_fkey" FOREIGN KEY ("invoice_item_id") REFERENCES "invoice_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_profit" ADD CONSTRAINT "invoice_profit_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_profit" ADD CONSTRAINT "invoice_profit_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_parameters" ADD CONSTRAINT "system_parameters_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_critical_stocks" ADD CONSTRAINT "warehouse_critical_stocks_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_critical_stocks" ADD CONSTRAINT "warehouse_critical_stocks_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_transfer_items" ADD CONSTRAINT "warehouse_transfer_items_fromLocationId_fkey" FOREIGN KEY ("fromLocationId") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_transfer_items" ADD CONSTRAINT "warehouse_transfer_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_transfer_items" ADD CONSTRAINT "warehouse_transfer_items_toLocationId_fkey" FOREIGN KEY ("toLocationId") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_transfer_items" ADD CONSTRAINT "warehouse_transfer_items_transferId_fkey" FOREIGN KEY ("transferId") REFERENCES "warehouse_transfers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_transfer_logs" ADD CONSTRAINT "warehouse_transfer_logs_transferId_fkey" FOREIGN KEY ("transferId") REFERENCES "warehouse_transfers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_transfer_logs" ADD CONSTRAINT "warehouse_transfer_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_transfers" ADD CONSTRAINT "warehouse_transfers_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_transfers" ADD CONSTRAINT "warehouse_transfers_deletedBy_fkey" FOREIGN KEY ("deletedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_transfers" ADD CONSTRAINT "warehouse_transfers_fromWarehouseId_fkey" FOREIGN KEY ("fromWarehouseId") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_transfers" ADD CONSTRAINT "warehouse_transfers_prepared_by_id_fkey" FOREIGN KEY ("prepared_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_transfers" ADD CONSTRAINT "warehouse_transfers_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_transfers" ADD CONSTRAINT "warehouse_transfers_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_transfers" ADD CONSTRAINT "warehouse_transfers_received_by_id_fkey" FOREIGN KEY ("received_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_transfers" ADD CONSTRAINT "warehouse_transfers_toWarehouseId_fkey" FOREIGN KEY ("toWarehouseId") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_transfers" ADD CONSTRAINT "warehouse_transfers_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_lists" ADD CONSTRAINT "price_lists_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_list_items" ADD CONSTRAINT "price_list_items_price_list_id_fkey" FOREIGN KEY ("price_list_id") REFERENCES "price_lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_list_items" ADD CONSTRAINT "price_list_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary_plans" ADD CONSTRAINT "salary_plans_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary_plans" ADD CONSTRAINT "salary_plans_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary_plans" ADD CONSTRAINT "salary_plans_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary_payments" ADD CONSTRAINT "salary_payments_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary_payments" ADD CONSTRAINT "salary_payments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary_payments" ADD CONSTRAINT "salary_payments_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary_payments" ADD CONSTRAINT "salary_payments_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "salary_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary_payments" ADD CONSTRAINT "salary_payments_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary_payment_details" ADD CONSTRAINT "salary_payment_details_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary_payment_details" ADD CONSTRAINT "salary_payment_details_salary_payment_id_fkey" FOREIGN KEY ("salary_payment_id") REFERENCES "salary_payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary_payment_details" ADD CONSTRAINT "salary_payment_details_cashbox_id_fkey" FOREIGN KEY ("cashbox_id") REFERENCES "cashboxes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary_payment_details" ADD CONSTRAINT "salary_payment_details_bank_account_id_fkey" FOREIGN KEY ("bank_account_id") REFERENCES "bank_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advances" ADD CONSTRAINT "advances_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advances" ADD CONSTRAINT "advances_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advances" ADD CONSTRAINT "advances_cashbox_id_fkey" FOREIGN KEY ("cashbox_id") REFERENCES "cashboxes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advances" ADD CONSTRAINT "advances_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advance_settlements" ADD CONSTRAINT "advance_settlements_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advance_settlements" ADD CONSTRAINT "advance_settlements_advance_id_fkey" FOREIGN KEY ("advance_id") REFERENCES "advances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advance_settlements" ADD CONSTRAINT "advance_settlements_salary_plan_id_fkey" FOREIGN KEY ("salary_plan_id") REFERENCES "salary_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_agents" ADD CONSTRAINT "sales_agents_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_purge_audits" ADD CONSTRAINT "tenant_purge_audits_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_vehicles" ADD CONSTRAINT "company_vehicles_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_vehicles" ADD CONSTRAINT "company_vehicles_assigned_employee_id_fkey" FOREIGN KEY ("assigned_employee_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_expenses" ADD CONSTRAINT "vehicle_expenses_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_expenses" ADD CONSTRAINT "vehicle_expenses_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "company_vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unit_sets" ADD CONSTRAINT "unit_sets_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "units" ADD CONSTRAINT "units_unit_set_id_fkey" FOREIGN KEY ("unit_set_id") REFERENCES "unit_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pos_payments" ADD CONSTRAINT "pos_payments_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pos_payments" ADD CONSTRAINT "pos_payments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pos_sessions" ADD CONSTRAINT "pos_sessions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_usage_metrics" ADD CONSTRAINT "tenant_usage_metrics_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feature_flags" ADD CONSTRAINT "feature_flags_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feature_flags" ADD CONSTRAINT "feature_flags_enabled_by_fkey" FOREIGN KEY ("enabled_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_revoked_by_fkey" FOREIGN KEY ("revoked_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webhook_endpoints" ADD CONSTRAINT "webhook_endpoints_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webhook_endpoints" ADD CONSTRAINT "webhook_endpoints_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupon_redemptions" ADD CONSTRAINT "coupon_redemptions_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "coupons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupon_redemptions" ADD CONSTRAINT "coupon_redemptions_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_onboardings" ADD CONSTRAINT "tenant_onboardings_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "einvoice_sends" ADD CONSTRAINT "einvoice_sends_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "einvoice_sends" ADD CONSTRAINT "einvoice_sends_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "einvoice_sends" ADD CONSTRAINT "einvoice_sends_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "einvoice_tenant_configs" ADD CONSTRAINT "einvoice_tenant_configs_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_types" ADD CONSTRAINT "leave_types_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_leave_type_id_fkey" FOREIGN KEY ("leave_type_id") REFERENCES "leave_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_rejected_by_id_fkey" FOREIGN KEY ("rejected_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "overtime_records" ADD CONSTRAINT "overtime_records_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "overtime_records" ADD CONSTRAINT "overtime_records_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "overtime_records" ADD CONSTRAINT "overtime_records_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "overtime_records" ADD CONSTRAINT "overtime_records_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_assignments" ADD CONSTRAINT "asset_assignments_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_assignments" ADD CONSTRAINT "asset_assignments_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_assignments" ADD CONSTRAINT "asset_assignments_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_assignments" ADD CONSTRAINT "asset_assignments_returned_by_fkey" FOREIGN KEY ("returned_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "performance_reviews" ADD CONSTRAINT "performance_reviews_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "performance_reviews" ADD CONSTRAINT "performance_reviews_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "performance_reviews" ADD CONSTRAINT "performance_reviews_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_templates" ADD CONSTRAINT "service_templates_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_templates" ADD CONSTRAINT "service_templates_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_order_warranties" ADD CONSTRAINT "work_order_warranties_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_order_warranties" ADD CONSTRAINT "work_order_warranties_work_order_id_fkey" FOREIGN KEY ("work_order_id") REFERENCES "work_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_order_warranties" ADD CONSTRAINT "work_order_warranties_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preventive_maintenances" ADD CONSTRAINT "preventive_maintenances_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preventive_maintenances" ADD CONSTRAINT "preventive_maintenances_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "company_vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preventive_maintenances" ADD CONSTRAINT "preventive_maintenances_customer_vehicle_id_fkey" FOREIGN KEY ("customer_vehicle_id") REFERENCES "customer_vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preventive_maintenances" ADD CONSTRAINT "preventive_maintenances_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "technician_metrics" ADD CONSTRAINT "technician_metrics_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "technician_metrics" ADD CONSTRAINT "technician_metrics_technician_id_fkey" FOREIGN KEY ("technician_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
