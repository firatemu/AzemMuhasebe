--
-- PostgreSQL database dump
--

\restrict xQb6EJOwmevcNW935EJO9b43fUmznVrwSnYHnfoLgVLT0Oal4WcVzWLetZuI0na

-- Dumped from database version 16.13
-- Dumped by pg_dump version 16.13

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: AccountTransactionDirection; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AccountTransactionDirection" AS ENUM (
    'CREDIT',
    'DEBIT'
);


ALTER TYPE public."AccountTransactionDirection" OWNER TO postgres;

--
-- Name: AccountTransactionSourceType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AccountTransactionSourceType" AS ENUM (
    'CHECK_BILL_JOURNAL',
    'CHECK_BILL_ACTION'
);


ALTER TYPE public."AccountTransactionSourceType" OWNER TO postgres;

--
-- Name: AccountType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AccountType" AS ENUM (
    'CUSTOMER',
    'SUPPLIER',
    'BOTH'
);


ALTER TYPE public."AccountType" OWNER TO postgres;

--
-- Name: AddressType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AddressType" AS ENUM (
    'DELIVERY',
    'INVOICE',
    'CENTER',
    'BRANCH',
    'WAREHOUSE',
    'OTHER',
    'SHIPMENT'
);


ALTER TYPE public."AddressType" OWNER TO postgres;

--
-- Name: AdvanceStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AdvanceStatus" AS ENUM (
    'OPEN',
    'PARTIAL',
    'CLOSED'
);


ALTER TYPE public."AdvanceStatus" OWNER TO postgres;

--
-- Name: AssetCondition; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AssetCondition" AS ENUM (
    'GOOD',
    'DAMAGED',
    'LOST',
    'RETURNED'
);


ALTER TYPE public."AssetCondition" OWNER TO postgres;

--
-- Name: B2BAdType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."B2BAdType" AS ENUM (
    'HOMEPAGE_BANNER',
    'LOGIN_POPUP'
);


ALTER TYPE public."B2BAdType" OWNER TO postgres;

--
-- Name: B2BDiscountType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."B2BDiscountType" AS ENUM (
    'CUSTOMER_CLASS',
    'BRAND',
    'CATEGORY',
    'PRODUCT_LIST'
);


ALTER TYPE public."B2BDiscountType" OWNER TO postgres;

--
-- Name: B2BErpAdapter; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."B2BErpAdapter" AS ENUM (
    'OTOMUHASEBE',
    'LOGO',
    'MIKRO'
);


ALTER TYPE public."B2BErpAdapter" OWNER TO postgres;

--
-- Name: B2BMovementType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."B2BMovementType" AS ENUM (
    'INVOICE',
    'PAYMENT',
    'RETURN',
    'OTHER'
);


ALTER TYPE public."B2BMovementType" OWNER TO postgres;

--
-- Name: B2BNotificationType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."B2BNotificationType" AS ENUM (
    'ORDER_RECEIVED',
    'ORDER_APPROVED',
    'ORDER_REJECTED'
);


ALTER TYPE public."B2BNotificationType" OWNER TO postgres;

--
-- Name: B2BOrderApprovalMode; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."B2BOrderApprovalMode" AS ENUM (
    'MANUAL',
    'AUTO'
);


ALTER TYPE public."B2BOrderApprovalMode" OWNER TO postgres;

--
-- Name: B2BOrderPlacedBy; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."B2BOrderPlacedBy" AS ENUM (
    'CUSTOMER',
    'SALESPERSON'
);


ALTER TYPE public."B2BOrderPlacedBy" OWNER TO postgres;

--
-- Name: B2BOrderStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."B2BOrderStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED',
    'EXPORTED_TO_ERP',
    'CANCELLED'
);


ALTER TYPE public."B2BOrderStatus" OWNER TO postgres;

--
-- Name: B2BSyncStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."B2BSyncStatus" AS ENUM (
    'RUNNING',
    'SUCCESS',
    'FAILED'
);


ALTER TYPE public."B2BSyncStatus" OWNER TO postgres;

--
-- Name: B2BSyncType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."B2BSyncType" AS ENUM (
    'PRODUCTS',
    'PRICES',
    'STOCK',
    'ACCOUNT_MOVEMENTS',
    'FULL'
);


ALTER TYPE public."B2BSyncType" OWNER TO postgres;

--
-- Name: B2BWarehouseDisplayMode; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."B2BWarehouseDisplayMode" AS ENUM (
    'INDIVIDUAL',
    'COMBINED'
);


ALTER TYPE public."B2BWarehouseDisplayMode" OWNER TO postgres;

--
-- Name: BankAccountType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."BankAccountType" AS ENUM (
    'DEMAND_DEPOSIT',
    'LOAN',
    'POS',
    'COMPANY_CREDIT_CARD',
    'TIME_DEPOSIT',
    'INVESTMENT',
    'GOLD',
    'CURRENCY',
    'OTHER'
);


ALTER TYPE public."BankAccountType" OWNER TO postgres;

--
-- Name: BankMovementSubType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."BankMovementSubType" AS ENUM (
    'INCOMING_TRANSFER',
    'OUTGOING_TRANSFER',
    'LOAN_USAGE',
    'LOAN_PAYMENT',
    'GUARANTEE_CHECK',
    'GUARANTEE_PROMISSORY',
    'POS_COLLECTION',
    'CARD_EXPENSE',
    'CARD_PAYMENT',
    'TRANSFER',
    'OTHER',
    'LOAN_INSTALLMENT_PAYMENT'
);


ALTER TYPE public."BankMovementSubType" OWNER TO postgres;

--
-- Name: BankMovementType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."BankMovementType" AS ENUM (
    'INCOMING',
    'OUTGOING'
);


ALTER TYPE public."BankMovementType" OWNER TO postgres;

--
-- Name: BillingPeriod; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."BillingPeriod" AS ENUM (
    'MONTHLY',
    'QUARTERLY',
    'YEARLY',
    'LIFETIME'
);


ALTER TYPE public."BillingPeriod" OWNER TO postgres;

--
-- Name: CashboxMovementType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CashboxMovementType" AS ENUM (
    'COLLECTION',
    'PAYMENT',
    'INCOMING_TRANSFER',
    'OUTGOING_TRANSFER',
    'CREDIT_CARD',
    'TRANSFER',
    'CARRY_FORWARD',
    'CHECK_RECEIVED',
    'CHECK_GIVEN',
    'PROMISSORY_RECEIVED',
    'PROMISSORY_GIVEN',
    'CHECK_COLLECTION',
    'PROMISSORY_COLLECTION'
);


ALTER TYPE public."CashboxMovementType" OWNER TO postgres;

--
-- Name: CashboxType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CashboxType" AS ENUM (
    'CASH',
    'POS',
    'COMPANY_CREDIT_CARD',
    'BANK',
    'CHECK_PROMISSORY'
);


ALTER TYPE public."CashboxType" OWNER TO postgres;

--
-- Name: CheckBillApprovalStepStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CheckBillApprovalStepStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED',
    'DELEGATED'
);


ALTER TYPE public."CheckBillApprovalStepStatus" OWNER TO postgres;

--
-- Name: CheckBillApprovalWorkflowType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CheckBillApprovalWorkflowType" AS ENUM (
    'CREATION',
    'COLLECTION',
    'DISCOUNT',
    'PROTEST'
);


ALTER TYPE public."CheckBillApprovalWorkflowType" OWNER TO postgres;

--
-- Name: CheckBillBankSubmissionStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CheckBillBankSubmissionStatus" AS ENUM (
    'SUBMITTED',
    'PROCESSING',
    'CLEARED',
    'REJECTED',
    'RETURNED'
);


ALTER TYPE public."CheckBillBankSubmissionStatus" OWNER TO postgres;

--
-- Name: CheckBillBankSubmissionType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CheckBillBankSubmissionType" AS ENUM (
    'COLLECTION',
    'GUARANTEE',
    'DISCOUNT'
);


ALTER TYPE public."CheckBillBankSubmissionType" OWNER TO postgres;

--
-- Name: CheckBillCollectionMethod; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CheckBillCollectionMethod" AS ENUM (
    'CASH',
    'BANK_TRANSFER',
    'CLEARING'
);


ALTER TYPE public."CheckBillCollectionMethod" OWNER TO postgres;

--
-- Name: CheckBillDiscountingStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CheckBillDiscountingStatus" AS ENUM (
    'ACTIVE',
    'SETTLED',
    'RECOURSE',
    'CANCELLED'
);


ALTER TYPE public."CheckBillDiscountingStatus" OWNER TO postgres;

--
-- Name: CheckBillEndorsementType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CheckBillEndorsementType" AS ENUM (
    'FULL',
    'PARTIAL',
    'BANK'
);


ALTER TYPE public."CheckBillEndorsementType" OWNER TO postgres;

--
-- Name: CheckBillGlEntryStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CheckBillGlEntryStatus" AS ENUM (
    'DRAFT',
    'POSTED',
    'REVERSED'
);


ALTER TYPE public."CheckBillGlEntryStatus" OWNER TO postgres;

--
-- Name: CheckBillGlEntryType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CheckBillGlEntryType" AS ENUM (
    'AUTO',
    'MANUAL',
    'REVERSAL'
);


ALTER TYPE public."CheckBillGlEntryType" OWNER TO postgres;

--
-- Name: CheckBillJournalPostingStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CheckBillJournalPostingStatus" AS ENUM (
    'DRAFT',
    'POSTED',
    'CANCELLED'
);


ALTER TYPE public."CheckBillJournalPostingStatus" OWNER TO postgres;

--
-- Name: CheckBillLegalCaseStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CheckBillLegalCaseStatus" AS ENUM (
    'PROTESTED',
    'LAWSUIT_FILED',
    'JUDGMENT',
    'EXECUTION',
    'CLOSED'
);


ALTER TYPE public."CheckBillLegalCaseStatus" OWNER TO postgres;

--
-- Name: CheckBillReconciliationStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CheckBillReconciliationStatus" AS ENUM (
    'MATCHED',
    'UNMATCHED',
    'EXCEPTION',
    'RESOLVED'
);


ALTER TYPE public."CheckBillReconciliationStatus" OWNER TO postgres;

--
-- Name: CheckBillReminderChannel; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CheckBillReminderChannel" AS ENUM (
    'EMAIL',
    'SMS',
    'IN_APP',
    'WEBHOOK'
);


ALTER TYPE public."CheckBillReminderChannel" OWNER TO postgres;

--
-- Name: CheckBillReminderDeliveryStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CheckBillReminderDeliveryStatus" AS ENUM (
    'PENDING',
    'SENT',
    'FAILED',
    'CANCELLED'
);


ALTER TYPE public."CheckBillReminderDeliveryStatus" OWNER TO postgres;

--
-- Name: CheckBillReminderType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CheckBillReminderType" AS ENUM (
    'PRE_DUE',
    'DUE_DATE',
    'OVERDUE',
    'PROTEST_WARNING'
);


ALTER TYPE public."CheckBillReminderType" OWNER TO postgres;

--
-- Name: CheckBillRiskLimitType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CheckBillRiskLimitType" AS ENUM (
    'SINGLE_CHECK',
    'TOTAL_PORTFOLIO',
    'MATURITY_DAYS'
);


ALTER TYPE public."CheckBillRiskLimitType" OWNER TO postgres;

--
-- Name: CheckBillRiskRating; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CheckBillRiskRating" AS ENUM (
    'LOW',
    'MEDIUM',
    'HIGH',
    'CRITICAL'
);


ALTER TYPE public."CheckBillRiskRating" OWNER TO postgres;

--
-- Name: CheckBillStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CheckBillStatus" AS ENUM (
    'IN_PORTFOLIO',
    'UNPAID',
    'SENT_TO_BANK',
    'COLLECTED',
    'PAID',
    'ENDORSED',
    'RETURNED',
    'WITHOUT_COVERAGE',
    'IN_BANK_COLLECTION',
    'IN_BANK_GUARANTEE',
    'PARTIAL_PAID',
    'PROTESTED',
    'DISCOUNTED',
    'LEGAL_FOLLOWUP',
    'WRITTEN_OFF',
    'CANCELLED',
    'RECOURSE',
    'GIVEN_TO_CUSTOMER'
);


ALTER TYPE public."CheckBillStatus" OWNER TO postgres;

--
-- Name: CheckBillType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CheckBillType" AS ENUM (
    'CHECK',
    'PROMISSORY'
);


ALTER TYPE public."CheckBillType" OWNER TO postgres;

--
-- Name: CollectionType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CollectionType" AS ENUM (
    'COLLECTION',
    'PAYMENT'
);


ALTER TYPE public."CollectionType" OWNER TO postgres;

--
-- Name: CompanyType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CompanyType" AS ENUM (
    'CORPORATE',
    'INDIVIDUAL'
);


ALTER TYPE public."CompanyType" OWNER TO postgres;

--
-- Name: CostingMethod; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CostingMethod" AS ENUM (
    'WEIGHTED_AVERAGE',
    'FIFO',
    'LIFO',
    'FEFO',
    'STANDARD_COST'
);


ALTER TYPE public."CostingMethod" OWNER TO postgres;

--
-- Name: CouponDiscountType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CouponDiscountType" AS ENUM (
    'PERCENTAGE',
    'FIXED_AMOUNT'
);


ALTER TYPE public."CouponDiscountType" OWNER TO postgres;

--
-- Name: CreditPlanStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CreditPlanStatus" AS ENUM (
    'PENDING',
    'PAID',
    'OVERDUE',
    'PARTIALLY_PAID'
);


ALTER TYPE public."CreditPlanStatus" OWNER TO postgres;

--
-- Name: DebitCredit; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."DebitCredit" AS ENUM (
    'DEBIT',
    'CREDIT',
    'CARRY_FORWARD'
);


ALTER TYPE public."DebitCredit" OWNER TO postgres;

--
-- Name: DeliveryNoteSourceType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."DeliveryNoteSourceType" AS ENUM (
    'ORDER',
    'DIRECT',
    'INVOICE_AUTOMATIC'
);


ALTER TYPE public."DeliveryNoteSourceType" OWNER TO postgres;

--
-- Name: DeliveryNoteStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."DeliveryNoteStatus" AS ENUM (
    'NOT_INVOICED',
    'INVOICED',
    'PARTIALLY_INVOICED',
    'CANCELLED',
    'TESLIM_EDILDI',
    'BEKLEMEDE',
    'FATURAYA_BAGLANDI',
    'IPTAL'
);


ALTER TYPE public."DeliveryNoteStatus" OWNER TO postgres;

--
-- Name: DocumentType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."DocumentType" AS ENUM (
    'INVOICE',
    'COLLECTION',
    'PAYMENT',
    'CHECK_PROMISSORY',
    'CARRY_FORWARD',
    'CORRECTION',
    'CHECK_ENTRY',
    'CHECK_EXIT',
    'RETURN'
);


ALTER TYPE public."DocumentType" OWNER TO postgres;

--
-- Name: EInvoiceScenario; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."EInvoiceScenario" AS ENUM (
    'TICARIFATURA',
    'TEMELFATURA',
    'IHRACAT'
);


ALTER TYPE public."EInvoiceScenario" OWNER TO postgres;

--
-- Name: EInvoiceStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."EInvoiceStatus" AS ENUM (
    'PENDING',
    'SENT',
    'ERROR',
    'DRAFT'
);


ALTER TYPE public."EInvoiceStatus" OWNER TO postgres;

--
-- Name: EmployeePaymentType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."EmployeePaymentType" AS ENUM (
    'ENTITLEMENT',
    'SALARY',
    'ADVANCE',
    'BONUS',
    'DEDUCTION',
    'ALLOCATION',
    'ALLOCATION_RETURN'
);


ALTER TYPE public."EmployeePaymentType" OWNER TO postgres;

--
-- Name: Gender; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Gender" AS ENUM (
    'MALE',
    'FEMALE',
    'NOT_SPECIFIED'
);


ALTER TYPE public."Gender" OWNER TO postgres;

--
-- Name: InventoryTransactionType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."InventoryTransactionType" AS ENUM (
    'DEDUCTION',
    'RETURN'
);


ALTER TYPE public."InventoryTransactionType" OWNER TO postgres;

--
-- Name: InvitationStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."InvitationStatus" AS ENUM (
    'PENDING',
    'ACCEPTED',
    'EXPIRED',
    'CANCELLED'
);


ALTER TYPE public."InvitationStatus" OWNER TO postgres;

--
-- Name: InvoiceStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."InvoiceStatus" AS ENUM (
    'DRAFT',
    'OPEN',
    'CLOSED',
    'PARTIALLY_PAID',
    'APPROVED',
    'CANCELLED',
    'PENDING'
);


ALTER TYPE public."InvoiceStatus" OWNER TO postgres;

--
-- Name: InvoiceType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."InvoiceType" AS ENUM (
    'PURCHASE',
    'SALE',
    'SALES_RETURN',
    'PURCHASE_RETURN'
);


ALTER TYPE public."InvoiceType" OWNER TO postgres;

--
-- Name: JournalType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."JournalType" AS ENUM (
    'ENTRY_PAYROLL',
    'EXIT_PAYROLL',
    'CUSTOMER_DOCUMENT_ENTRY',
    'CUSTOMER_DOCUMENT_EXIT',
    'OWN_DOCUMENT_ENTRY',
    'OWN_DOCUMENT_EXIT',
    'BANK_COLLECTION_ENDORSEMENT',
    'BANK_GUARANTEE_ENDORSEMENT',
    'ACCOUNT_DOCUMENT_ENDORSEMENT',
    'DEBIT_DOCUMENT_EXIT',
    'RETURN_PAYROLL',
    'BANK_DISCOUNT_SUBMISSION',
    'PARTIAL_COLLECTION',
    'PROTEST_ENTRY',
    'LEGAL_TRANSFER',
    'WRITE_OFF',
    'REVERSAL',
    'RETURN_FROM_BANK'
);


ALTER TYPE public."JournalType" OWNER TO postgres;

--
-- Name: LeaveStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."LeaveStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED',
    'CANCELLED'
);


ALTER TYPE public."LeaveStatus" OWNER TO postgres;

--
-- Name: LicenseType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."LicenseType" AS ENUM (
    'BASE_PLAN',
    'MODULE'
);


ALTER TYPE public."LicenseType" OWNER TO postgres;

--
-- Name: LoanStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."LoanStatus" AS ENUM (
    'ACTIVE',
    'CLOSED',
    'CANCELLED'
);


ALTER TYPE public."LoanStatus" OWNER TO postgres;

--
-- Name: LoanType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."LoanType" AS ENUM (
    'EQUAL_INSTALLMENT',
    'REVOLVING'
);


ALTER TYPE public."LoanType" OWNER TO postgres;

--
-- Name: LogAction; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."LogAction" AS ENUM (
    'CREATE',
    'UPDATE',
    'DELETE',
    'STATUS_CHANGE',
    'CANCELLATION',
    'RESTORE',
    'CONVERTED_TO_ORDER',
    'EINVOICE_SENT',
    'EINVOICE_SEND_ERROR',
    'SHIPMENT',
    'ENDORSEMENT'
);


ALTER TYPE public."LogAction" OWNER TO postgres;

--
-- Name: MaintenanceType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."MaintenanceType" AS ENUM (
    'PERIODIC',
    'PREVENTIVE',
    'PREDICTIVE',
    'CORRECTIVE'
);


ALTER TYPE public."MaintenanceType" OWNER TO postgres;

--
-- Name: MaritalStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."MaritalStatus" AS ENUM (
    'SINGLE',
    'MARRIED'
);


ALTER TYPE public."MaritalStatus" OWNER TO postgres;

--
-- Name: ModuleType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ModuleType" AS ENUM (
    'WAREHOUSE',
    'CASHBOX',
    'PERSONNEL',
    'PRODUCT',
    'CUSTOMER',
    'INVOICE_SALES',
    'INVOICE_PURCHASE',
    'ORDER_SALES',
    'ORDER_PURCHASE',
    'INVENTORY_COUNT',
    'QUOTE',
    'DELIVERY_NOTE_SALES',
    'DELIVERY_NOTE_PURCHASE',
    'WAREHOUSE_TRANSFER',
    'TECHNICIAN',
    'WORK_ORDER',
    'SERVICE_INVOICE',
    'CHECK_BILL_JOURNAL',
    'CHECK_BILL_DOCUMENT'
);


ALTER TYPE public."ModuleType" OWNER TO postgres;

--
-- Name: MovementType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."MovementType" AS ENUM (
    'ENTRY',
    'EXIT',
    'SALE',
    'RETURN',
    'CANCELLATION_ENTRY',
    'CANCELLATION_EXIT',
    'COUNT',
    'COUNT_SURPLUS',
    'COUNT_SHORTAGE'
);


ALTER TYPE public."MovementType" OWNER TO postgres;

--
-- Name: OrderItemStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."OrderItemStatus" AS ENUM (
    'PENDING',
    'PARTIAL',
    'COMPLETED'
);


ALTER TYPE public."OrderItemStatus" OWNER TO postgres;

--
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'PENDING',
    'PARTIAL',
    'COMPLETED',
    'CANCELLED'
);


ALTER TYPE public."OrderStatus" OWNER TO postgres;

--
-- Name: OrderType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."OrderType" AS ENUM (
    'SALE',
    'PURCHASE'
);


ALTER TYPE public."OrderType" OWNER TO postgres;

--
-- Name: OvertimeStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."OvertimeStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED',
    'PAID'
);


ALTER TYPE public."OvertimeStatus" OWNER TO postgres;

--
-- Name: OvertimeType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."OvertimeType" AS ENUM (
    'WEEKDAY',
    'WEEKEND',
    'PUBLIC_HOLIDAY'
);


ALTER TYPE public."OvertimeType" OWNER TO postgres;

--
-- Name: PartRequestStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PartRequestStatus" AS ENUM (
    'REQUESTED',
    'SUPPLIED',
    'USED',
    'CANCELLED'
);


ALTER TYPE public."PartRequestStatus" OWNER TO postgres;

--
-- Name: PartWorkflowStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PartWorkflowStatus" AS ENUM (
    'NOT_STARTED',
    'PARTS_SUPPLIED_DIRECT',
    'PARTS_PENDING',
    'PARTIALLY_SUPPLIED',
    'ALL_PARTS_SUPPLIED'
);


ALTER TYPE public."PartWorkflowStatus" OWNER TO postgres;

--
-- Name: PaymentMethod; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PaymentMethod" AS ENUM (
    'CASH',
    'CREDIT_CARD',
    'BANK_TRANSFER',
    'CHECK',
    'PROMISSORY_NOTE',
    'GIFT_CARD',
    'LOAN_ACCOUNT'
);


ALTER TYPE public."PaymentMethod" OWNER TO postgres;

--
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'PENDING',
    'PROCESSING',
    'SUCCESS',
    'FAILED',
    'REFUNDED',
    'CANCELED'
);


ALTER TYPE public."PaymentStatus" OWNER TO postgres;

--
-- Name: PerformanceStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PerformanceStatus" AS ENUM (
    'DRAFT',
    'SUBMITTED',
    'ACKNOWLEDGED',
    'CLOSED'
);


ALTER TYPE public."PerformanceStatus" OWNER TO postgres;

--
-- Name: PortfolioType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PortfolioType" AS ENUM (
    'CREDIT',
    'DEBIT'
);


ALTER TYPE public."PortfolioType" OWNER TO postgres;

--
-- Name: PosSessionStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PosSessionStatus" AS ENUM (
    'OPEN',
    'CLOSED'
);


ALTER TYPE public."PosSessionStatus" OWNER TO postgres;

--
-- Name: PriceCardType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PriceCardType" AS ENUM (
    'SALE',
    'PURCHASE',
    'CAMPAIGN',
    'LIST'
);


ALTER TYPE public."PriceCardType" OWNER TO postgres;

--
-- Name: PurchaseOrderLocalStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PurchaseOrderLocalStatus" AS ENUM (
    'PENDING',
    'PREPARING',
    'PREPARED',
    'SHIPPED',
    'PARTIALLY_SHIPPED',
    'ORDER_PLACED',
    'INVOICED',
    'CANCELLED',
    'PARTIAL',
    'COMPLETED'
);


ALTER TYPE public."PurchaseOrderLocalStatus" OWNER TO postgres;

--
-- Name: QuoteStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."QuoteStatus" AS ENUM (
    'OFFERED',
    'APPROVED',
    'REJECTED',
    'CONVERTED_TO_ORDER'
);


ALTER TYPE public."QuoteStatus" OWNER TO postgres;

--
-- Name: QuoteType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."QuoteType" AS ENUM (
    'SALE',
    'PURCHASE'
);


ALTER TYPE public."QuoteType" OWNER TO postgres;

--
-- Name: RiskStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."RiskStatus" AS ENUM (
    'NORMAL',
    'RISKY',
    'BLACK_LIST',
    'IN_COLLECTION'
);


ALTER TYPE public."RiskStatus" OWNER TO postgres;

--
-- Name: SalaryStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."SalaryStatus" AS ENUM (
    'UNPAID',
    'PARTIALLY_PAID',
    'FULLY_PAID',
    'PENDING'
);


ALTER TYPE public."SalaryStatus" OWNER TO postgres;

--
-- Name: SalesOrderStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."SalesOrderStatus" AS ENUM (
    'PENDING',
    'PREPARING',
    'PREPARED',
    'SHIPPED',
    'PARTIALLY_SHIPPED',
    'INVOICED',
    'CANCELLED',
    'COMPLETED'
);


ALTER TYPE public."SalesOrderStatus" OWNER TO postgres;

--
-- Name: SimpleOrderStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."SimpleOrderStatus" AS ENUM (
    'AWAITING_APPROVAL',
    'APPROVED',
    'ORDER_PLACED',
    'INVOICED',
    'CANCELLED'
);


ALTER TYPE public."SimpleOrderStatus" OWNER TO postgres;

--
-- Name: StockMoveType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."StockMoveType" AS ENUM (
    'PUT_AWAY',
    'TRANSFER',
    'PICKING',
    'ADJUSTMENT',
    'SALE',
    'RETURN',
    'DAMAGE'
);


ALTER TYPE public."StockMoveType" OWNER TO postgres;

--
-- Name: StocktakeStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."StocktakeStatus" AS ENUM (
    'DRAFT',
    'COMPLETED',
    'APPROVED',
    'CANCELLED'
);


ALTER TYPE public."StocktakeStatus" OWNER TO postgres;

--
-- Name: StocktakeType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."StocktakeType" AS ENUM (
    'PRODUCT_BASED',
    'SHELF_BASED'
);


ALTER TYPE public."StocktakeType" OWNER TO postgres;

--
-- Name: SubscriptionStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."SubscriptionStatus" AS ENUM (
    'PENDING',
    'TRIAL',
    'ACTIVE',
    'PAST_DUE',
    'CANCELED',
    'EXPIRED'
);


ALTER TYPE public."SubscriptionStatus" OWNER TO postgres;

--
-- Name: TenantStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TenantStatus" AS ENUM (
    'TRIAL',
    'ACTIVE',
    'SUSPENDED',
    'CANCELLED',
    'PURGED',
    'EXPIRED',
    'CHURNED',
    'DELETED',
    'PENDING'
);


ALTER TYPE public."TenantStatus" OWNER TO postgres;

--
-- Name: TenantType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TenantType" AS ENUM (
    'INDIVIDUAL',
    'CORPORATE'
);


ALTER TYPE public."TenantType" OWNER TO postgres;

--
-- Name: TransferStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TransferStatus" AS ENUM (
    'PREPARING',
    'IN_TRANSIT',
    'COMPLETED',
    'CANCELLED'
);


ALTER TYPE public."TransferStatus" OWNER TO postgres;

--
-- Name: TransferType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TransferType" AS ENUM (
    'INCOMING',
    'OUTGOING'
);


ALTER TYPE public."TransferType" OWNER TO postgres;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UserRole" AS ENUM (
    'SUPER_ADMIN',
    'TENANT_ADMIN',
    'ADMIN',
    'USER',
    'VIEWER',
    'SUPPORT',
    'MANAGER',
    'TECHNICIAN',
    'WORKSHOP_MANAGER',
    'RECEPTION',
    'SERVICE_MANAGER',
    'PROCUREMENT',
    'WAREHOUSE',
    'ADVISOR',
    'PARTS_MANAGER'
);


ALTER TYPE public."UserRole" OWNER TO postgres;

--
-- Name: UserStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UserStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'SUSPENDED',
    'PENDING_VERIFICATION'
);


ALTER TYPE public."UserStatus" OWNER TO postgres;

--
-- Name: VehicleExpenseType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."VehicleExpenseType" AS ENUM (
    'FUEL',
    'MAINTENANCE',
    'INSPECTION',
    'TRAFFIC_INSURANCE',
    'CASCO',
    'PENALTY',
    'HGS_OGS',
    'PARKING',
    'CAR_WASH',
    'OTHER'
);


ALTER TYPE public."VehicleExpenseType" OWNER TO postgres;

--
-- Name: VehicleServiceStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."VehicleServiceStatus" AS ENUM (
    'WAITING',
    'CUSTOMER_APPROVAL_PENDING',
    'IN_PROGRESS',
    'PART_WAITING',
    'PARTS_SUPPLIED',
    'VEHICLE_READY',
    'COMPLETED'
);


ALTER TYPE public."VehicleServiceStatus" OWNER TO postgres;

--
-- Name: VehicleWorkflowStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."VehicleWorkflowStatus" AS ENUM (
    'WAITING',
    'IN_PROGRESS',
    'READY',
    'DELIVERED'
);


ALTER TYPE public."VehicleWorkflowStatus" OWNER TO postgres;

--
-- Name: WorkOrderItemType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."WorkOrderItemType" AS ENUM (
    'LABOR',
    'PART'
);


ALTER TYPE public."WorkOrderItemType" OWNER TO postgres;

--
-- Name: WorkOrderStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."WorkOrderStatus" AS ENUM (
    'WAITING_DIAGNOSIS',
    'PENDING_APPROVAL',
    'APPROVED_IN_PROGRESS',
    'PART_WAITING',
    'PARTS_SUPPLIED',
    'VEHICLE_READY',
    'INVOICED_CLOSED',
    'CLOSED_WITHOUT_INVOICE',
    'CANCELLED'
);


ALTER TYPE public."WorkOrderStatus" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: account_addresses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account_addresses (
    id text NOT NULL,
    account_id text NOT NULL,
    title text NOT NULL,
    type public."AddressType" NOT NULL,
    address text NOT NULL,
    city text,
    district text,
    postal_code text,
    is_default boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "tenantId" text
);


ALTER TABLE public.account_addresses OWNER TO postgres;

--
-- Name: account_banks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account_banks (
    id text NOT NULL,
    account_id text NOT NULL,
    bank_name text NOT NULL,
    branch_name text,
    branch_code text,
    account_no text,
    iban text NOT NULL,
    currency text,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "tenantId" text
);


ALTER TABLE public.account_banks OWNER TO postgres;

--
-- Name: account_contacts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account_contacts (
    id text NOT NULL,
    account_id text NOT NULL,
    full_name text NOT NULL,
    title text,
    phone text,
    email text,
    extension text,
    is_default boolean DEFAULT false NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "tenantId" text
);


ALTER TABLE public.account_contacts OWNER TO postgres;

--
-- Name: account_movements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account_movements (
    id text NOT NULL,
    account_id text NOT NULL,
    type public."DebitCredit" NOT NULL,
    amount numeric(12,2) NOT NULL,
    balance numeric(12,2) NOT NULL,
    document_type public."DocumentType",
    document_no text,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "tenantId" text NOT NULL,
    deleted_by text,
    deleted_at timestamp(3) without time zone,
    invoice_id text,
    is_reversed boolean DEFAULT false NOT NULL,
    reversal_of_id text,
    is_reversal boolean DEFAULT false NOT NULL,
    record_type text,
    check_bill_id text
);


ALTER TABLE public.account_movements OWNER TO postgres;

--
-- Name: account_transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account_transactions (
    id text NOT NULL,
    "tenantId" text,
    account_id text NOT NULL,
    source_type public."AccountTransactionSourceType" NOT NULL,
    source_id text NOT NULL,
    direction public."AccountTransactionDirection" NOT NULL,
    amount numeric(15,2) NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.account_transactions OWNER TO postgres;

--
-- Name: accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.accounts (
    id text NOT NULL,
    code text NOT NULL,
    "tenantId" text NOT NULL,
    title text NOT NULL,
    type public."AccountType" NOT NULL,
    company_type public."CompanyType" DEFAULT 'CORPORATE'::public."CompanyType",
    tax_number text,
    tax_office text,
    national_id text,
    full_name text,
    phone text,
    email text,
    country text DEFAULT 'Turkey'::text,
    city text,
    district text,
    address text,
    contact_name text,
    balance numeric(12,2) DEFAULT 0 NOT NULL,
    payment_term_days integer,
    is_active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    deleted_by text,
    deleted_at timestamp(3) without time zone,
    updated_by text,
    sales_agent_id text,
    credit_limit numeric(12,2),
    credit_status public."RiskStatus" DEFAULT 'NORMAL'::public."RiskStatus",
    collateral_amount numeric(12,2),
    sector text,
    custom_code1 text,
    custom_code2 text,
    website text,
    fax text,
    due_days integer,
    currency text,
    bank_info text,
    price_list_id text,
    efatura_gonderici_birim text,
    efatura_posta_kutusu text,
    block_on_risk boolean DEFAULT false NOT NULL
);


ALTER TABLE public.accounts OWNER TO postgres;

--
-- Name: advance_settlements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.advance_settlements (
    id text NOT NULL,
    "tenantId" text,
    advance_id text NOT NULL,
    salary_plan_id text NOT NULL,
    amount numeric(10,2) NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    description text
);


ALTER TABLE public.advance_settlements OWNER TO postgres;

--
-- Name: advances; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.advances (
    id text NOT NULL,
    "tenantId" text,
    employee_id text NOT NULL,
    cashbox_id text,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    amount numeric(12,2) NOT NULL,
    settled_amount numeric(12,2) DEFAULT 0 NOT NULL,
    remaining_amount numeric(12,2) NOT NULL,
    notes text,
    status public."AdvanceStatus" DEFAULT 'OPEN'::public."AdvanceStatus" NOT NULL,
    created_by text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.advances OWNER TO postgres;

--
-- Name: api_keys; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_keys (
    id text NOT NULL,
    tenant_id text NOT NULL,
    name text NOT NULL,
    key_hash text NOT NULL,
    key_prefix text NOT NULL,
    scopes text[] DEFAULT ARRAY[]::text[],
    last_used_at timestamp(3) without time zone,
    expires_at timestamp(3) without time zone,
    revoked_at timestamp(3) without time zone,
    revoked_by text,
    created_by text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.api_keys OWNER TO postgres;

--
-- Name: asset_assignments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset_assignments (
    id text NOT NULL,
    tenant_id text NOT NULL,
    employee_id text NOT NULL,
    asset_name text NOT NULL,
    asset_code text,
    serial_number text,
    description text,
    assigned_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    returned_at timestamp(3) without time zone,
    condition public."AssetCondition" DEFAULT 'GOOD'::public."AssetCondition" NOT NULL,
    notes text,
    assigned_by text,
    returned_by text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.asset_assignments OWNER TO postgres;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id text NOT NULL,
    "userId" text,
    "tenantId" text NOT NULL,
    action text NOT NULL,
    resource text,
    "resourceId" text,
    metadata jsonb,
    "ipAddress" text,
    "userAgent" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- Name: b2b_account_movements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.b2b_account_movements (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "erpMovementId" text NOT NULL,
    "customerId" text NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    type public."B2BMovementType" NOT NULL,
    description text,
    debit numeric(12,2) DEFAULT 0 NOT NULL,
    credit numeric(12,2) DEFAULT 0 NOT NULL,
    balance numeric(12,2) NOT NULL,
    "erpInvoiceNo" text,
    "dueDate" timestamp(3) without time zone,
    "isPastDue" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.b2b_account_movements OWNER TO postgres;

--
-- Name: b2b_advertisements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.b2b_advertisements (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    type public."B2BAdType" NOT NULL,
    "imageUrl" text NOT NULL,
    "linkUrl" text,
    "displayOrder" integer DEFAULT 0 NOT NULL,
    "startsAt" timestamp(3) without time zone,
    "endsAt" timestamp(3) without time zone,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.b2b_advertisements OWNER TO postgres;

--
-- Name: b2b_cart_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.b2b_cart_items (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "cartId" text NOT NULL,
    "productId" text NOT NULL,
    quantity integer NOT NULL,
    "addedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.b2b_cart_items OWNER TO postgres;

--
-- Name: b2b_carts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.b2b_carts (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "customerId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.b2b_carts OWNER TO postgres;

--
-- Name: b2b_customer_classes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.b2b_customer_classes (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    "discountRate" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.b2b_customer_classes OWNER TO postgres;

--
-- Name: b2b_customers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.b2b_customers (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "erpNum" text,
    "erpAccountId" text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    "passwordHash" text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "customerClassId" text,
    "discountGroupId" text,
    "vatDays" integer DEFAULT 30 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "lastLoginAt" timestamp(3) without time zone,
    city text,
    district text,
    "canUseVirtualPos" boolean DEFAULT true NOT NULL,
    "blockOrderOnRisk" boolean DEFAULT false NOT NULL,
    "customerGrade" text
);


ALTER TABLE public.b2b_customers OWNER TO postgres;

--
-- Name: b2b_delivery_methods; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.b2b_delivery_methods (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "displayOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.b2b_delivery_methods OWNER TO postgres;

--
-- Name: b2b_discount_groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.b2b_discount_groups (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.b2b_discount_groups OWNER TO postgres;

--
-- Name: b2b_discounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.b2b_discounts (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    type public."B2BDiscountType" NOT NULL,
    "targetValue" text NOT NULL,
    "discountRate" numeric(5,2) NOT NULL,
    "startsAt" timestamp(3) without time zone,
    "endsAt" timestamp(3) without time zone,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.b2b_discounts OWNER TO postgres;

--
-- Name: b2b_domains; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.b2b_domains (
    id text NOT NULL,
    domain text NOT NULL,
    "tenantId" text NOT NULL,
    "isVerified" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.b2b_domains OWNER TO postgres;

--
-- Name: b2b_licenses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.b2b_licenses (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "maxB2BCustomers" integer DEFAULT '-1'::integer NOT NULL,
    "expiresAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.b2b_licenses OWNER TO postgres;

--
-- Name: b2b_notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.b2b_notifications (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "customerId" text NOT NULL,
    type public."B2BNotificationType" NOT NULL,
    message text NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    "orderId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.b2b_notifications OWNER TO postgres;

--
-- Name: b2b_order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.b2b_order_items (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "orderId" text NOT NULL,
    "productId" text NOT NULL,
    "stockCode" text NOT NULL,
    "productName" text NOT NULL,
    quantity integer NOT NULL,
    "listPrice" numeric(12,2) NOT NULL,
    "customerClassDiscount" numeric(12,2) DEFAULT 0 NOT NULL,
    "campaignDiscount" numeric(12,2) DEFAULT 0 NOT NULL,
    "finalPrice" numeric(12,2) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.b2b_order_items OWNER TO postgres;

--
-- Name: b2b_orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.b2b_orders (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "orderNumber" text NOT NULL,
    "customerId" text NOT NULL,
    "salespersonId" text,
    "placedBy" public."B2BOrderPlacedBy" NOT NULL,
    "placedByLabel" text,
    status public."B2BOrderStatus" DEFAULT 'PENDING'::public."B2BOrderStatus" NOT NULL,
    "deliveryBranchId" text,
    "deliveryBranchName" text,
    "deliveryMethodId" text NOT NULL,
    note text,
    "totalListPrice" numeric(14,2) NOT NULL,
    "totalDiscountAmount" numeric(14,2) NOT NULL,
    "totalFinalPrice" numeric(14,2) NOT NULL,
    "erpOrderId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.b2b_orders OWNER TO postgres;

--
-- Name: b2b_products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.b2b_products (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "erpProductId" text NOT NULL,
    "stockCode" text NOT NULL,
    name text NOT NULL,
    description text,
    brand text,
    category text,
    "oemCode" text,
    "supplierCode" text,
    unit text,
    "erpListPrice" numeric(12,2) NOT NULL,
    "erpCreatedAt" timestamp(3) without time zone,
    "erpUpdatedAt" timestamp(3) without time zone,
    "isVisibleInB2B" boolean DEFAULT true NOT NULL,
    "minOrderQuantity" integer DEFAULT 1 NOT NULL,
    "imageUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.b2b_products OWNER TO postgres;

--
-- Name: b2b_salesperson_customers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.b2b_salesperson_customers (
    "salespersonId" text NOT NULL,
    "customerId" text NOT NULL,
    "assignedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.b2b_salesperson_customers OWNER TO postgres;

--
-- Name: b2b_salespersons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.b2b_salespersons (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    "passwordHash" text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "canViewAllCustomers" boolean DEFAULT false NOT NULL,
    "canViewAllReports" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.b2b_salespersons OWNER TO postgres;

--
-- Name: b2b_stocks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.b2b_stocks (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "productId" text NOT NULL,
    "warehouseId" text NOT NULL,
    "warehouseName" text NOT NULL,
    "isAvailable" boolean DEFAULT true NOT NULL,
    quantity numeric(12,2) DEFAULT 0 NOT NULL,
    "displayOrder" integer DEFAULT 0 NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.b2b_stocks OWNER TO postgres;

--
-- Name: b2b_sync_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.b2b_sync_logs (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "syncType" public."B2BSyncType" NOT NULL,
    status public."B2BSyncStatus" NOT NULL,
    "startedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "finishedAt" timestamp(3) without time zone,
    "recordsProcessed" integer DEFAULT 0 NOT NULL,
    "recordsAdded" integer DEFAULT 0 NOT NULL,
    "recordsUpdated" integer DEFAULT 0 NOT NULL,
    "errorMessage" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.b2b_sync_logs OWNER TO postgres;

--
-- Name: b2b_sync_loops; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.b2b_sync_loops (
    id text NOT NULL,
    tenant_id text NOT NULL,
    sync_type public."B2BSyncType" NOT NULL,
    last_run_at timestamp(3) without time zone,
    last_user_id text
);


ALTER TABLE public.b2b_sync_loops OWNER TO postgres;

--
-- Name: b2b_tenant_configs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.b2b_tenant_configs (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "schemaName" text NOT NULL,
    domain text,
    "erpAdapterType" public."B2BErpAdapter" NOT NULL,
    "erpConnectionString" text,
    "lastSyncedAt" timestamp(3) without time zone,
    "lastSyncRequestedAt" timestamp(3) without time zone,
    "syncIntervalMinutes" integer DEFAULT 60 NOT NULL,
    "orderApprovalMode" public."B2BOrderApprovalMode" DEFAULT 'MANUAL'::public."B2BOrderApprovalMode" NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.b2b_tenant_configs OWNER TO postgres;

--
-- Name: b2b_warehouse_configs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.b2b_warehouse_configs (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "warehouseId" text NOT NULL,
    "warehouseName" text NOT NULL,
    "displayMode" public."B2BWarehouseDisplayMode" DEFAULT 'INDIVIDUAL'::public."B2BWarehouseDisplayMode" NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.b2b_warehouse_configs OWNER TO postgres;

--
-- Name: bank_account_movements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bank_account_movements (
    id text NOT NULL,
    bank_account_id text NOT NULL,
    movement_type public."BankMovementType" NOT NULL,
    movement_sub_type public."BankMovementSubType",
    amount numeric(15,2) NOT NULL,
    commission_rate numeric(5,2),
    commission_amount numeric(15,2),
    net_amount numeric(15,2),
    balance numeric(15,2) NOT NULL,
    notes text,
    reference_no text,
    account_id text,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    tenant_id text,
    deleted_by text,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.bank_account_movements OWNER TO postgres;

--
-- Name: bank_accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bank_accounts (
    id text NOT NULL,
    bank_id text NOT NULL,
    code text NOT NULL,
    name text,
    account_no text,
    iban text,
    type public."BankAccountType" NOT NULL,
    balance numeric(15,2) DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    commission_rate numeric(5,2),
    credit_limit numeric(15,2),
    used_credit_limit numeric(15,2),
    card_limit numeric(15,2),
    statement_day integer,
    payment_due_day integer,
    terminal_no text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "tenantId" text
);


ALTER TABLE public.bank_accounts OWNER TO postgres;

--
-- Name: bank_loan_plans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bank_loan_plans (
    id text NOT NULL,
    loan_id text NOT NULL,
    installment_no integer NOT NULL,
    due_date timestamp(3) without time zone NOT NULL,
    amount numeric(15,2) NOT NULL,
    paid_amount numeric(15,2) DEFAULT 0 NOT NULL,
    status public."CreditPlanStatus" DEFAULT 'PENDING'::public."CreditPlanStatus" NOT NULL,
    "tenantId" text
);


ALTER TABLE public.bank_loan_plans OWNER TO postgres;

--
-- Name: bank_loans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bank_loans (
    id text NOT NULL,
    bank_account_id text NOT NULL,
    amount numeric(15,2) NOT NULL,
    total_repayment numeric(15,2) NOT NULL,
    total_interest numeric(15,2) NOT NULL,
    installment_count integer NOT NULL,
    start_date timestamp(3) without time zone NOT NULL,
    notes text,
    loan_type public."LoanType" DEFAULT 'EQUAL_INSTALLMENT'::public."LoanType" NOT NULL,
    status public."LoanStatus" DEFAULT 'ACTIVE'::public."LoanStatus" NOT NULL,
    annual_interest_rate numeric(5,2),
    payment_frequency integer DEFAULT 1 NOT NULL,
    "tenantId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.bank_loans OWNER TO postgres;

--
-- Name: bank_transfer_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bank_transfer_logs (
    id text NOT NULL,
    bank_transfer_id text NOT NULL,
    user_id text,
    action_type public."LogAction" NOT NULL,
    changes text,
    ip_address text,
    user_agent text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    tenant_id text
);


ALTER TABLE public.bank_transfer_logs OWNER TO postgres;

--
-- Name: bank_transfers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bank_transfers (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    transfer_type public."TransferType" NOT NULL,
    cashbox_id text,
    account_id text NOT NULL,
    amount numeric(15,2) NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    notes text,
    reference_no text,
    sender text,
    receiver text,
    created_by text,
    updated_by text,
    deleted_at timestamp(3) without time zone,
    deleted_by text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    bank_account_id text
);


ALTER TABLE public.bank_transfers OWNER TO postgres;

--
-- Name: banks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.banks (
    id text NOT NULL,
    "tenantId" text,
    name text NOT NULL,
    branch text,
    city text,
    contact_name text,
    phone text,
    logo text,
    is_active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone,
    deleted_by text
);


ALTER TABLE public.banks OWNER TO postgres;

--
-- Name: brands; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.brands (
    id text NOT NULL,
    tenant_id text NOT NULL,
    name text NOT NULL,
    slug text,
    logo_url text,
    is_active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.brands OWNER TO postgres;

--
-- Name: cashbox_movements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cashbox_movements (
    id text NOT NULL,
    cashbox_id text NOT NULL,
    movement_type public."CashboxMovementType" NOT NULL,
    amount numeric(15,2) NOT NULL,
    commission_amount numeric(15,2),
    bsmv_amount numeric(15,2),
    net_amount numeric(15,2),
    balance numeric(15,2) NOT NULL,
    document_type text,
    document_no text,
    account_id text,
    notes text,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_transferred boolean DEFAULT false NOT NULL,
    transfer_date timestamp(3) without time zone,
    created_by text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    deleted_by text,
    deleted_at timestamp(3) without time zone,
    tenant_id text
);


ALTER TABLE public.cashbox_movements OWNER TO postgres;

--
-- Name: cashboxes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cashboxes (
    id text NOT NULL,
    code text NOT NULL,
    "tenantId" text,
    name text NOT NULL,
    type public."CashboxType" NOT NULL,
    balance numeric(15,2) DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    is_retail boolean DEFAULT false NOT NULL,
    warehouse_id text,
    "createdBy" text,
    "updatedBy" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone,
    deleted_by text
);


ALTER TABLE public.cashboxes OWNER TO postgres;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id text NOT NULL,
    tenant_id text NOT NULL,
    name text NOT NULL,
    slug text,
    parent_id text,
    level integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: check_bill_approval_workflows; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.check_bill_approval_workflows (
    id text NOT NULL,
    tenant_id text NOT NULL,
    check_bill_id text,
    journal_id text,
    workflow_type public."CheckBillApprovalWorkflowType" NOT NULL,
    step integer NOT NULL,
    approver_id text NOT NULL,
    status public."CheckBillApprovalStepStatus" NOT NULL,
    action_at timestamp(3) without time zone,
    comments text,
    delegated_to_id text,
    amount_threshold numeric(15,2),
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.check_bill_approval_workflows OWNER TO postgres;

--
-- Name: check_bill_bank_submissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.check_bill_bank_submissions (
    id text NOT NULL,
    tenant_id text NOT NULL,
    check_bill_id text NOT NULL,
    bank_account_id text NOT NULL,
    submission_type public."CheckBillBankSubmissionType" NOT NULL,
    submitted_at timestamp(3) without time zone NOT NULL,
    submission_ref text,
    expected_date timestamp(3) without time zone,
    actual_date timestamp(3) without time zone,
    status public."CheckBillBankSubmissionStatus" NOT NULL,
    bank_fee numeric(15,2),
    rejection_reason text,
    created_by_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.check_bill_bank_submissions OWNER TO postgres;

--
-- Name: check_bill_collections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.check_bill_collections (
    id text NOT NULL,
    "tenantId" text,
    check_bill_id text NOT NULL,
    collected_amount numeric(15,2) NOT NULL,
    collection_date timestamp(3) without time zone NOT NULL,
    cashbox_id text,
    bank_account_id text,
    journal_id text NOT NULL,
    created_by_id text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    collection_method public."CheckBillCollectionMethod",
    bank_transaction_ref text,
    exchange_rate numeric(15,6),
    amount_try numeric(15,2),
    tax_withholding_amount numeric(15,2),
    net_amount numeric(15,2),
    gl_entry_id text,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.check_bill_collections OWNER TO postgres;

--
-- Name: check_bill_discounting; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.check_bill_discounting (
    id text NOT NULL,
    tenant_id text NOT NULL,
    check_bill_id text NOT NULL,
    bank_account_id text NOT NULL,
    face_value numeric(15,2) NOT NULL,
    discount_rate numeric(7,4) NOT NULL,
    discount_amount numeric(15,2) NOT NULL,
    banking_commission numeric(15,2),
    net_proceeds numeric(15,2) NOT NULL,
    discount_date timestamp(3) without time zone NOT NULL,
    maturity_date timestamp(3) without time zone NOT NULL,
    status public."CheckBillDiscountingStatus" NOT NULL,
    gl_entry_id text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.check_bill_discounting OWNER TO postgres;

--
-- Name: check_bill_endorsements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.check_bill_endorsements (
    id text NOT NULL,
    "tenantId" text,
    check_bill_id text NOT NULL,
    sequence integer NOT NULL,
    from_account_id text NOT NULL,
    to_account_id text NOT NULL,
    endorsed_at timestamp(3) without time zone NOT NULL,
    journal_id text NOT NULL,
    endorsement_type public."CheckBillEndorsementType",
    endorsed_amount numeric(15,2),
    endorsement_reason text,
    is_returned boolean DEFAULT false,
    returned_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.check_bill_endorsements OWNER TO postgres;

--
-- Name: check_bill_gl_entries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.check_bill_gl_entries (
    id text NOT NULL,
    tenant_id text NOT NULL,
    check_bill_id text NOT NULL,
    journal_id text,
    gl_journal_no text NOT NULL,
    accounting_date timestamp(3) without time zone NOT NULL,
    fiscal_year integer NOT NULL,
    fiscal_period integer NOT NULL,
    debit_account_code text NOT NULL,
    credit_account_code text NOT NULL,
    debit_amount numeric(15,2) NOT NULL,
    credit_amount numeric(15,2) NOT NULL,
    currency character(3) NOT NULL,
    exchange_rate numeric(15,6),
    description text NOT NULL,
    entry_type public."CheckBillGlEntryType" NOT NULL,
    status public."CheckBillGlEntryStatus" NOT NULL,
    reversal_of_id text,
    posted_by_id text,
    posted_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.check_bill_gl_entries OWNER TO postgres;

--
-- Name: check_bill_journal_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.check_bill_journal_items (
    id text NOT NULL,
    journal_id text NOT NULL,
    check_bill_id text NOT NULL,
    "tenantId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    line_amount numeric(15,2),
    line_note text
);


ALTER TABLE public.check_bill_journal_items OWNER TO postgres;

--
-- Name: check_bill_journals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.check_bill_journals (
    id text NOT NULL,
    journal_no text NOT NULL,
    type public."JournalType" NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    account_id text,
    notes text,
    "tenantId" text,
    created_by_id text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    bank_account_id text,
    cashbox_id text,
    accounting_date timestamp(3) without time zone,
    fiscal_period_id text,
    gl_journal_id text,
    total_amount numeric(15,2),
    total_count integer,
    status public."CheckBillJournalPostingStatus",
    approved_by_id text,
    approved_at timestamp(3) without time zone,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.check_bill_journals OWNER TO postgres;

--
-- Name: check_bill_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.check_bill_logs (
    id text NOT NULL,
    check_bill_id text NOT NULL,
    user_id text,
    action_type public."LogAction" NOT NULL,
    changes jsonb,
    ip_address text,
    user_agent text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "tenantId" text,
    from_status public."CheckBillStatus",
    journal_id text,
    notes text,
    performed_by_id text,
    to_status public."CheckBillStatus",
    session_id text,
    request_id text,
    duration integer,
    is_system boolean DEFAULT false
);


ALTER TABLE public.check_bill_logs OWNER TO postgres;

--
-- Name: check_bill_protest_tracking; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.check_bill_protest_tracking (
    id text NOT NULL,
    tenant_id text NOT NULL,
    check_bill_id text NOT NULL,
    protest_date timestamp(3) without time zone NOT NULL,
    protest_reason text NOT NULL,
    protesting_notary_id text,
    protest_no text,
    legal_status public."CheckBillLegalCaseStatus" NOT NULL,
    lawsuit_date timestamp(3) without time zone,
    lawsuit_no text,
    court_id text,
    judgment_date timestamp(3) without time zone,
    judgment_amount numeric(15,2),
    execution_date timestamp(3) without time zone,
    execution_no text,
    collected_via_legal numeric(15,2),
    lawyer_id text,
    notes text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.check_bill_protest_tracking OWNER TO postgres;

--
-- Name: check_bill_reconciliation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.check_bill_reconciliation (
    id text NOT NULL,
    tenant_id text NOT NULL,
    check_bill_id text NOT NULL,
    bank_account_id text NOT NULL,
    reconciliation_date timestamp(3) without time zone NOT NULL,
    bank_amount numeric(15,2) NOT NULL,
    system_amount numeric(15,2) NOT NULL,
    difference numeric(15,2) NOT NULL,
    status public."CheckBillReconciliationStatus" NOT NULL,
    bank_reference text,
    resolved_by_id text,
    resolved_at timestamp(3) without time zone,
    notes text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.check_bill_reconciliation OWNER TO postgres;

--
-- Name: check_bill_reminders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.check_bill_reminders (
    id text NOT NULL,
    tenant_id text NOT NULL,
    check_bill_id text NOT NULL,
    reminder_type public."CheckBillReminderType" NOT NULL,
    trigger_days_before integer NOT NULL,
    scheduled_at timestamp(3) without time zone NOT NULL,
    sent_at timestamp(3) without time zone,
    status public."CheckBillReminderDeliveryStatus" NOT NULL,
    channel public."CheckBillReminderChannel" NOT NULL,
    recipients jsonb NOT NULL,
    template_id text,
    retry_count integer DEFAULT 0,
    error_message text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.check_bill_reminders OWNER TO postgres;

--
-- Name: check_bill_risk_limits; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.check_bill_risk_limits (
    id text NOT NULL,
    tenant_id text NOT NULL,
    account_id text NOT NULL,
    limit_type public."CheckBillRiskLimitType" NOT NULL,
    limit_amount numeric(15,2),
    limit_days integer,
    current_exposure numeric(15,2) NOT NULL,
    utilization_rate numeric(5,2) NOT NULL,
    risk_rating public."CheckBillRiskRating",
    alert_threshold numeric(5,2),
    is_active boolean DEFAULT true NOT NULL,
    valid_from timestamp(3) without time zone NOT NULL,
    valid_until timestamp(3) without time zone,
    approved_by_id text,
    notes text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.check_bill_risk_limits OWNER TO postgres;

--
-- Name: checks_bills; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.checks_bills (
    id text NOT NULL,
    "tenantId" text,
    type public."CheckBillType" NOT NULL,
    portfolio_type public."PortfolioType" NOT NULL,
    account_id text NOT NULL,
    amount numeric(15,2) NOT NULL,
    remaining_amount numeric(15,2) DEFAULT 0 NOT NULL,
    due_date timestamp(3) without time zone NOT NULL,
    bank text,
    branch text,
    account_no text,
    check_no text,
    serial_no text,
    status public."CheckBillStatus",
    collection_date timestamp(3) without time zone,
    collection_cashbox_id text,
    is_endorsed boolean DEFAULT false NOT NULL,
    endorsement_date timestamp(3) without time zone,
    endorsed_to text,
    notes text,
    created_by text,
    updated_by text,
    deleted_at timestamp(3) without time zone,
    deleted_by text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    last_journal_id text,
    current_holder_id text,
    is_protested boolean DEFAULT false NOT NULL,
    protested_at timestamp(3) without time zone,
    currency character(3),
    exchange_rate numeric(15,6),
    amount_try numeric(15,2),
    issue_date timestamp(3) without time zone,
    presentation_date timestamp(3) without time zone,
    bank_code text,
    branch_code text,
    iban character varying(34),
    micr_line text,
    drawer_name text,
    drawer_tax_no text,
    payee_name text,
    risk_score integer,
    protest_reason text,
    legal_followup_started boolean DEFAULT false,
    legal_followup_date timestamp(3) without time zone,
    gl_entry_id text,
    is_reconciled boolean DEFAULT false,
    reconciled_at timestamp(3) without time zone,
    tax_withholding_rate numeric(5,2),
    tax_withholding_amount numeric(15,2),
    vat_rate numeric(5,2),
    vat_amount numeric(15,2),
    internal_ref text,
    external_ref text,
    attachment_urls jsonb,
    tags jsonb,
    approved_by text,
    approved_at timestamp(3) without time zone
);


ALTER TABLE public.checks_bills OWNER TO postgres;

--
-- Name: code_templates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.code_templates (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    module public."ModuleType" NOT NULL,
    name text NOT NULL,
    prefix text NOT NULL,
    "digitCount" integer DEFAULT 3 NOT NULL,
    "currentValue" integer DEFAULT 0 NOT NULL,
    "includeYear" boolean DEFAULT true NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.code_templates OWNER TO postgres;

--
-- Name: collections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.collections (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    account_id text NOT NULL,
    invoice_id text,
    service_invoice_id text,
    type public."CollectionType" NOT NULL,
    amount numeric(12,2) NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    payment_type public."PaymentMethod" NOT NULL,
    cashbox_id text,
    bank_account_id text,
    company_credit_card_id text,
    notes text,
    created_by text,
    deleted_at timestamp(3) without time zone,
    deleted_by text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    sales_agent_id text,
    installment_count integer
);


ALTER TABLE public.collections OWNER TO postgres;

--
-- Name: company_credit_card_movements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.company_credit_card_movements (
    id text NOT NULL,
    card_id text NOT NULL,
    amount numeric(15,2) NOT NULL,
    balance numeric(15,2) NOT NULL,
    notes text,
    account_id text,
    reference_no text,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "tenantId" text
);


ALTER TABLE public.company_credit_card_movements OWNER TO postgres;

--
-- Name: company_credit_card_reminders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.company_credit_card_reminders (
    id text NOT NULL,
    card_id text NOT NULL,
    type text NOT NULL,
    day integer NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "tenantId" text
);


ALTER TABLE public.company_credit_card_reminders OWNER TO postgres;

--
-- Name: company_credit_cards; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.company_credit_cards (
    id text NOT NULL,
    cashbox_id text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    bank_name text NOT NULL,
    card_type text,
    last_four_digits text,
    credit_limit numeric(15,2),
    balance numeric(15,2) DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    statement_date timestamp(3) without time zone,
    payment_due_date timestamp(3) without time zone,
    "tenantId" text
);


ALTER TABLE public.company_credit_cards OWNER TO postgres;

--
-- Name: company_vehicles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.company_vehicles (
    id text NOT NULL,
    "tenantId" text,
    plate text NOT NULL,
    brand text NOT NULL,
    model text NOT NULL,
    year integer,
    chassis_no text,
    engine_no text,
    registration_date timestamp(3) without time zone,
    vehicle_type text,
    fuel_type text,
    is_active boolean DEFAULT true NOT NULL,
    assigned_employee_id text,
    registration_image_url text,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    insurance_date timestamp(3) without time zone,
    last_inspection_date timestamp(3) without time zone,
    registration_serial_no text
);


ALTER TABLE public.company_vehicles OWNER TO postgres;

--
-- Name: coupon_redemptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coupon_redemptions (
    id text NOT NULL,
    coupon_id text NOT NULL,
    tenant_id text NOT NULL,
    subscription_id text,
    redeemed_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    discount_applied numeric(12,4) NOT NULL
);


ALTER TABLE public.coupon_redemptions OWNER TO postgres;

--
-- Name: coupons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coupons (
    id text NOT NULL,
    code text NOT NULL,
    description text,
    discount_type public."CouponDiscountType" NOT NULL,
    discount_value numeric(12,4) NOT NULL,
    currency text DEFAULT 'TRY'::text NOT NULL,
    max_uses integer,
    used_count integer DEFAULT 0 NOT NULL,
    valid_from timestamp(3) without time zone,
    valid_until timestamp(3) without time zone,
    applicable_plans text[] DEFAULT ARRAY[]::text[],
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    "tenantId" text
);


ALTER TABLE public.coupons OWNER TO postgres;

--
-- Name: customer_vehicles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer_vehicles (
    id text NOT NULL,
    "tenantId" text,
    account_id text NOT NULL,
    plate text NOT NULL,
    brand text NOT NULL,
    model text NOT NULL,
    year integer,
    chassis_no text,
    engine_power integer,
    engine_size text,
    fuel_type text,
    transmission text,
    color text,
    registration_date timestamp(3) without time zone,
    registration_no text,
    registration_owner text,
    mileage integer,
    notes text,
    service_status public."VehicleServiceStatus",
    vehicle_catalog_id text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.customer_vehicles OWNER TO postgres;

--
-- Name: deleted_bank_transfers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.deleted_bank_transfers (
    id text NOT NULL,
    original_id text NOT NULL,
    transfer_type public."TransferType" NOT NULL,
    cashbox_id text NOT NULL,
    cashbox_name text NOT NULL,
    account_id text NOT NULL,
    account_name text NOT NULL,
    amount numeric(15,2) NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    notes text,
    tenant_id text,
    reference_no text,
    sender text,
    receiver text,
    original_created_by text,
    original_updated_by text,
    original_created_at timestamp(3) without time zone NOT NULL,
    original_updated_at timestamp(3) without time zone NOT NULL,
    deleted_by text,
    deleted_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    delete_reason text
);


ALTER TABLE public.deleted_bank_transfers OWNER TO postgres;

--
-- Name: deleted_checks_bills; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.deleted_checks_bills (
    id text NOT NULL,
    original_id text NOT NULL,
    type public."CheckBillType" NOT NULL,
    portfolio_type public."PortfolioType" NOT NULL,
    account_id text NOT NULL,
    account_name text NOT NULL,
    amount numeric(15,2) NOT NULL,
    due_date timestamp(3) without time zone NOT NULL,
    bank text,
    branch text,
    account_no text,
    check_no text,
    serial_no text,
    status public."CheckBillStatus" NOT NULL,
    collection_date timestamp(3) without time zone,
    collection_cashbox_id text,
    is_endorsed boolean NOT NULL,
    endorsement_date timestamp(3) without time zone,
    endorsed_to text,
    notes text,
    original_created_by text,
    original_updated_by text,
    original_created_at timestamp(3) without time zone NOT NULL,
    original_updated_at timestamp(3) without time zone NOT NULL,
    deleted_by text,
    deleted_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    delete_reason text,
    "tenantId" text
);


ALTER TABLE public.deleted_checks_bills OWNER TO postgres;

--
-- Name: departments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.departments (
    id text NOT NULL,
    tenant_id text NOT NULL,
    name text NOT NULL,
    code text,
    manager_id text,
    parent_id text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.departments OWNER TO postgres;

--
-- Name: einvoice_inbox; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.einvoice_inbox (
    id integer NOT NULL,
    ettn text NOT NULL,
    "senderVkn" text NOT NULL,
    "senderTitle" text NOT NULL,
    "invoiceNo" text,
    "invoiceDate" timestamp(3) without time zone,
    "rawXml" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    tenant_id text,
    matched_invoice_id text,
    scenario character varying(50),
    receiver_vkn character varying(11),
    status character varying(20) DEFAULT 'UNPROCESSED'::character varying NOT NULL,
    processed_at timestamp(3) without time zone,
    processed_by text
);


ALTER TABLE public.einvoice_inbox OWNER TO postgres;

--
-- Name: einvoice_inbox_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.einvoice_inbox_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.einvoice_inbox_id_seq OWNER TO postgres;

--
-- Name: einvoice_inbox_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.einvoice_inbox_id_seq OWNED BY public.einvoice_inbox.id;


--
-- Name: einvoice_sends; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.einvoice_sends (
    id text NOT NULL,
    tenant_id text NOT NULL,
    invoice_id text NOT NULL,
    ettn text NOT NULL,
    scenario public."EInvoiceScenario" NOT NULL,
    profile_id text DEFAULT 'TR1.2'::text NOT NULL,
    sender_alias text NOT NULL,
    receiver_alias text,
    receiver_vkn text NOT NULL,
    xml_content text,
    status text DEFAULT 'DRAFT'::text NOT NULL,
    sent_at timestamp(3) without time zone,
    response_code text,
    response_description text,
    response_xml text,
    retry_count integer DEFAULT 0 NOT NULL,
    last_retry_at timestamp(3) without time zone,
    error_detail text,
    created_by text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.einvoice_sends OWNER TO postgres;

--
-- Name: einvoice_tenant_configs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.einvoice_tenant_configs (
    id text NOT NULL,
    tenant_id text NOT NULL,
    is_einvoice_user boolean DEFAULT false NOT NULL,
    is_earsiv_user boolean DEFAULT false NOT NULL,
    integration_vkn text,
    sender_alias text,
    api_username text,
    api_password_hash text,
    test_mode boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.einvoice_tenant_configs OWNER TO postgres;

--
-- Name: einvoice_xml; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.einvoice_xml (
    id text NOT NULL,
    invoice_id text NOT NULL,
    xml_data text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "tenantId" text
);


ALTER TABLE public.einvoice_xml OWNER TO postgres;

--
-- Name: employee_payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_payments (
    id text NOT NULL,
    employee_id text NOT NULL,
    type public."EmployeePaymentType" NOT NULL,
    amount numeric(10,2) NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    period text,
    notes text,
    cashbox_id text,
    created_by text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "tenantId" text
);


ALTER TABLE public.employee_payments OWNER TO postgres;

--
-- Name: employees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employees (
    id text NOT NULL,
    employee_code text NOT NULL,
    "tenantId" text,
    identity_number text,
    first_name text NOT NULL,
    last_name text NOT NULL,
    birth_date timestamp(3) without time zone,
    gender public."Gender",
    marital_status public."MaritalStatus",
    phone text,
    email text,
    address text,
    city text,
    district text,
    "position" text,
    department text,
    department_id text,
    start_date timestamp(3) without time zone,
    end_date timestamp(3) without time zone,
    is_active boolean DEFAULT true NOT NULL,
    salary numeric(10,2),
    salary_day integer,
    social_security_no text,
    iban text,
    balance numeric(10,2) DEFAULT 0 NOT NULL,
    notes text,
    created_by text,
    updated_by text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    bonus numeric(10,2)
);


ALTER TABLE public.employees OWNER TO postgres;

--
-- Name: equivalency_groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.equivalency_groups (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.equivalency_groups OWNER TO postgres;

--
-- Name: expense_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.expense_categories (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.expense_categories OWNER TO postgres;

--
-- Name: expenses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.expenses (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    category_id text NOT NULL,
    notes text,
    amount numeric(10,2) NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    payment_type public."PaymentMethod",
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    reference_no text
);


ALTER TABLE public.expenses OWNER TO postgres;

--
-- Name: feature_flags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.feature_flags (
    id text NOT NULL,
    tenant_id text NOT NULL,
    flag_key text NOT NULL,
    is_enabled boolean DEFAULT false NOT NULL,
    payload jsonb,
    enabled_at timestamp(3) without time zone,
    disabled_at timestamp(3) without time zone,
    enabled_by text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.feature_flags OWNER TO postgres;

--
-- Name: hizli_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hizli_tokens (
    id integer NOT NULL,
    token text NOT NULL,
    "loginHash" text NOT NULL,
    "generatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.hizli_tokens OWNER TO postgres;

--
-- Name: hizli_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hizli_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hizli_tokens_id_seq OWNER TO postgres;

--
-- Name: hizli_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hizli_tokens_id_seq OWNED BY public.hizli_tokens.id;


--
-- Name: inventory_transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory_transactions (
    id text NOT NULL,
    "tenantId" text,
    "partRequestId" text NOT NULL,
    product_id text NOT NULL,
    "warehouseId" text,
    quantity integer NOT NULL,
    "transactionType" public."InventoryTransactionType" DEFAULT 'DEDUCTION'::public."InventoryTransactionType" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.inventory_transactions OWNER TO postgres;

--
-- Name: invitations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invitations (
    id text NOT NULL,
    email text NOT NULL,
    "tenantId" text NOT NULL,
    "invitedBy" text NOT NULL,
    token text NOT NULL,
    status public."InvitationStatus" DEFAULT 'PENDING'::public."InvitationStatus" NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "acceptedAt" timestamp(3) without time zone,
    "acceptedBy" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.invitations OWNER TO postgres;

--
-- Name: invoice_collections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoice_collections (
    id text NOT NULL,
    invoice_id text NOT NULL,
    collection_id text NOT NULL,
    amount numeric(12,2) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "tenantId" text,
    installment_count integer
);


ALTER TABLE public.invoice_collections OWNER TO postgres;

--
-- Name: invoice_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoice_items (
    id text NOT NULL,
    invoice_id text NOT NULL,
    product_id text NOT NULL,
    quantity integer NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    vat_rate integer NOT NULL,
    vat_amount numeric(10,2) NOT NULL,
    amount numeric(10,2) NOT NULL,
    discount_rate numeric(10,2) DEFAULT 0,
    discount_amount numeric(10,2) DEFAULT 0,
    withholding_code text,
    withholding_rate numeric(5,2),
    sct_rate numeric(5,2),
    sct_amount numeric(10,2),
    vat_exemption_reason text,
    unit text,
    shelf text,
    purchase_order_item_id text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "tenantId" text,
    discount_type text DEFAULT 'pct'::text
);


ALTER TABLE public.invoice_items OWNER TO postgres;

--
-- Name: invoice_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoice_logs (
    id text NOT NULL,
    invoice_id text NOT NULL,
    user_id text,
    action_type public."LogAction" NOT NULL,
    changes text,
    ip_address text,
    user_agent text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "tenantId" text
);


ALTER TABLE public.invoice_logs OWNER TO postgres;

--
-- Name: invoice_payment_plans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoice_payment_plans (
    id text NOT NULL,
    invoice_id text NOT NULL,
    due_date timestamp(3) without time zone NOT NULL,
    amount numeric(12,2) NOT NULL,
    payment_type text,
    notes text,
    is_paid boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "tenantId" text
);


ALTER TABLE public.invoice_payment_plans OWNER TO postgres;

--
-- Name: invoice_profit; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoice_profit (
    id text NOT NULL,
    invoice_id text NOT NULL,
    invoice_item_id text,
    product_id text NOT NULL,
    "tenantId" text,
    quantity integer NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    unit_cost numeric(12,4) NOT NULL,
    total_sales_amount numeric(12,2) NOT NULL,
    total_cost numeric(12,2) NOT NULL,
    profit numeric(12,2) NOT NULL,
    profit_rate numeric(10,2) NOT NULL,
    computed_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.invoice_profit OWNER TO postgres;

--
-- Name: invoices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoices (
    id text NOT NULL,
    invoice_no text NOT NULL,
    invoice_type public."InvoiceType" NOT NULL,
    "tenantId" text,
    account_id text NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    due_date timestamp(3) without time zone,
    discount numeric(10,2) DEFAULT 0 NOT NULL,
    total_amount numeric(12,2) NOT NULL,
    vat_amount numeric(12,2) NOT NULL,
    sct_total numeric(12,2) DEFAULT 0 NOT NULL,
    withholding_total numeric(12,2) DEFAULT 0 NOT NULL,
    grand_total numeric(12,2) NOT NULL,
    foreign_total numeric(12,2),
    currency text DEFAULT 'TRY'::text NOT NULL,
    exchange_rate numeric(10,4) DEFAULT 1 NOT NULL,
    notes text,
    status public."InvoiceStatus" DEFAULT 'OPEN'::public."InvoiceStatus" NOT NULL,
    payable_amount numeric(12,2),
    paid_amount numeric(12,2) DEFAULT 0 NOT NULL,
    order_no text,
    purchase_order_id text,
    procurement_order_id text,
    delivery_note_id text,
    purchase_delivery_note_id text,
    einvoice_status public."EInvoiceStatus" DEFAULT 'PENDING'::public."EInvoiceStatus",
    einvoice_ettn text,
    e_scenario text,
    e_invoice_type text,
    gib_alias text,
    delivery_method text,
    created_by text,
    updated_by text,
    deleted_at timestamp(3) without time zone,
    deleted_by text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    sales_agent_id text,
    warehouse_id text,
    global_discount_type text DEFAULT 'pct'::text,
    global_discount_value numeric(10,2) DEFAULT 0,
    delivery_note_no_ref text
);


ALTER TABLE public.invoices OWNER TO postgres;

--
-- Name: journal_entries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.journal_entries (
    id text NOT NULL,
    "tenantId" text,
    "referenceType" text NOT NULL,
    "referenceId" text NOT NULL,
    "serviceInvoiceId" text,
    "entryDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdBy" text
);


ALTER TABLE public.journal_entries OWNER TO postgres;

--
-- Name: journal_entry_lines; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.journal_entry_lines (
    id text NOT NULL,
    "journalEntryId" text NOT NULL,
    "accountCode" text NOT NULL,
    "accountName" text NOT NULL,
    debit numeric(12,2) DEFAULT 0 NOT NULL,
    credit numeric(12,2) DEFAULT 0 NOT NULL,
    description text,
    "tenantId" text
);


ALTER TABLE public.journal_entry_lines OWNER TO postgres;

--
-- Name: leave_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.leave_requests (
    id text NOT NULL,
    tenant_id text NOT NULL,
    employee_id text NOT NULL,
    leave_type_id text NOT NULL,
    start_date timestamp(3) without time zone NOT NULL,
    end_date timestamp(3) without time zone NOT NULL,
    total_days numeric(5,1) NOT NULL,
    reason text,
    status public."LeaveStatus" DEFAULT 'PENDING'::public."LeaveStatus" NOT NULL,
    approved_by_id text,
    approved_at timestamp(3) without time zone,
    rejected_by_id text,
    rejected_at timestamp(3) without time zone,
    rejection_note text,
    created_by text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.leave_requests OWNER TO postgres;

--
-- Name: leave_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.leave_types (
    id text NOT NULL,
    tenant_id text NOT NULL,
    name text NOT NULL,
    code text NOT NULL,
    is_paid boolean DEFAULT true NOT NULL,
    default_days integer,
    carry_over boolean DEFAULT false NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.leave_types OWNER TO postgres;

--
-- Name: locations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.locations (
    id text NOT NULL,
    "warehouseId" text NOT NULL,
    layer integer NOT NULL,
    corridor text NOT NULL,
    side integer NOT NULL,
    section integer NOT NULL,
    level integer NOT NULL,
    code text NOT NULL,
    barcode text NOT NULL,
    name text,
    active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "tenantId" text
);


ALTER TABLE public.locations OWNER TO postgres;

--
-- Name: module_licenses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.module_licenses (
    id text NOT NULL,
    "subscriptionId" text NOT NULL,
    "moduleId" text NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.module_licenses OWNER TO postgres;

--
-- Name: modules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.modules (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    currency text DEFAULT 'TRY'::text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.modules OWNER TO postgres;

--
-- Name: order_pickings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_pickings (
    id text NOT NULL,
    order_id text NOT NULL,
    order_item_id text NOT NULL,
    location_id text NOT NULL,
    quantity integer NOT NULL,
    picked_by text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "tenantId" text
);


ALTER TABLE public.order_pickings OWNER TO postgres;

--
-- Name: overtime_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.overtime_records (
    id text NOT NULL,
    tenant_id text NOT NULL,
    employee_id text NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    hours numeric(5,2) NOT NULL,
    overtime_type public."OvertimeType" NOT NULL,
    rate numeric(5,2) DEFAULT 1.5 NOT NULL,
    amount numeric(12,2),
    status public."OvertimeStatus" DEFAULT 'PENDING'::public."OvertimeStatus" NOT NULL,
    approved_by_id text,
    approved_at timestamp(3) without time zone,
    notes text,
    created_by text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.overtime_records OWNER TO postgres;

--
-- Name: part_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.part_requests (
    id text NOT NULL,
    "tenantId" text,
    "workOrderId" text NOT NULL,
    "requestedBy" text NOT NULL,
    description text NOT NULL,
    product_id text,
    "requestedQty" integer DEFAULT 1 NOT NULL,
    "suppliedQty" integer,
    status public."PartRequestStatus" DEFAULT 'REQUESTED'::public."PartRequestStatus" NOT NULL,
    version integer DEFAULT 1 NOT NULL,
    "suppliedBy" text,
    "suppliedAt" timestamp(3) without time zone,
    "usedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.part_requests OWNER TO postgres;

--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id text NOT NULL,
    "subscriptionId" text NOT NULL,
    amount numeric(10,2) NOT NULL,
    currency text DEFAULT 'TRY'::text NOT NULL,
    status public."PaymentStatus" DEFAULT 'PENDING'::public."PaymentStatus" NOT NULL,
    "iyzicoPaymentId" text,
    "iyzicoToken" text,
    "conversationId" text,
    "invoiceNumber" text,
    "invoiceUrl" text,
    "paidAt" timestamp(3) without time zone,
    "failedAt" timestamp(3) without time zone,
    "refundedAt" timestamp(3) without time zone,
    "errorCode" text,
    "errorMessage" text,
    "paymentMethod" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "tenantId" text
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- Name: performance_reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.performance_reviews (
    id text NOT NULL,
    tenant_id text NOT NULL,
    employee_id text NOT NULL,
    reviewer_id text NOT NULL,
    period_start timestamp(3) without time zone NOT NULL,
    period_end timestamp(3) without time zone NOT NULL,
    overall_score numeric(3,1),
    goals jsonb,
    strengths text,
    improvements text,
    manager_notes text,
    status public."PerformanceStatus" DEFAULT 'DRAFT'::public."PerformanceStatus" NOT NULL,
    submitted_at timestamp(3) without time zone,
    acknowledged_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.performance_reviews OWNER TO postgres;

--
-- Name: permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permissions (
    id text NOT NULL,
    module text NOT NULL,
    action text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.permissions OWNER TO postgres;

--
-- Name: plans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plans (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    currency text DEFAULT 'TRY'::text NOT NULL,
    "billingPeriod" public."BillingPeriod" DEFAULT 'MONTHLY'::public."BillingPeriod" NOT NULL,
    "trialDays" integer DEFAULT 0 NOT NULL,
    "baseUserLimit" integer DEFAULT 1 NOT NULL,
    features jsonb,
    limits jsonb,
    "isActive" boolean DEFAULT true NOT NULL,
    "isPopular" boolean DEFAULT false NOT NULL,
    "isBasePlan" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.plans OWNER TO postgres;

--
-- Name: pos_payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pos_payments (
    id text NOT NULL,
    invoice_id text NOT NULL,
    payment_method public."PaymentMethod" NOT NULL,
    amount numeric(12,2) NOT NULL,
    change numeric(12,2),
    gift_card_id text,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "tenantId" text,
    created_by text,
    updated_by text
);


ALTER TABLE public.pos_payments OWNER TO postgres;

--
-- Name: pos_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pos_sessions (
    id text NOT NULL,
    session_no text NOT NULL,
    cashier_id text NOT NULL,
    cashbox_id text NOT NULL,
    opening_amount numeric(12,2) NOT NULL,
    closing_amount numeric(12,2),
    closing_notes text,
    status public."PosSessionStatus" NOT NULL,
    opened_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    closed_at timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "tenantId" text,
    created_by text,
    updated_by text
);


ALTER TABLE public.pos_sessions OWNER TO postgres;

--
-- Name: postal_codes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.postal_codes (
    id text NOT NULL,
    city text NOT NULL,
    district text NOT NULL,
    neighborhood text NOT NULL,
    "postalCode" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.postal_codes OWNER TO postgres;

--
-- Name: preventive_maintenances; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.preventive_maintenances (
    id text NOT NULL,
    tenant_id text NOT NULL,
    vehicle_id text,
    customer_vehicle_id text,
    maintenance_type public."MaintenanceType" NOT NULL,
    name text NOT NULL,
    description text,
    interval_days integer,
    interval_mileage integer,
    last_performed_at timestamp(3) without time zone,
    last_mileage integer,
    next_due_at timestamp(3) without time zone,
    next_mileage integer,
    is_active boolean DEFAULT true NOT NULL,
    created_by text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.preventive_maintenances OWNER TO postgres;

--
-- Name: price_cards; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.price_cards (
    id text NOT NULL,
    tenant_id text NOT NULL,
    product_id text NOT NULL,
    type public."PriceCardType" NOT NULL,
    price numeric(12,2) NOT NULL,
    currency text DEFAULT 'TRY'::text NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    effective_from timestamp(3) without time zone,
    effective_to timestamp(3) without time zone,
    vat_rate numeric(5,2) DEFAULT 20 NOT NULL,
    min_quantity numeric(12,2) DEFAULT 1 NOT NULL,
    note text,
    created_by text,
    updated_by text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.price_cards OWNER TO postgres;

--
-- Name: price_list_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.price_list_items (
    id text NOT NULL,
    price_list_id text NOT NULL,
    product_id text NOT NULL,
    price numeric(12,2) NOT NULL,
    discount_rate numeric(5,2) DEFAULT 0,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "tenantId" text
);


ALTER TABLE public.price_list_items OWNER TO postgres;

--
-- Name: price_lists; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.price_lists (
    id text NOT NULL,
    name text NOT NULL,
    "tenantId" text,
    start_date timestamp(3) without time zone,
    end_date timestamp(3) without time zone,
    is_active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.price_lists OWNER TO postgres;

--
-- Name: procurement_orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.procurement_orders (
    id text NOT NULL,
    order_no text NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "tenantId" text,
    account_id text NOT NULL,
    status public."PurchaseOrderLocalStatus" DEFAULT 'PENDING'::public."PurchaseOrderLocalStatus" NOT NULL,
    total_amount numeric(12,2) NOT NULL,
    vat_amount numeric(12,2) NOT NULL,
    grand_total numeric(12,2) NOT NULL,
    discount numeric(10,2) DEFAULT 0 NOT NULL,
    notes text,
    due_date timestamp(3) without time zone,
    invoice_no text,
    created_by text,
    updated_by text,
    deleted_by text,
    deleted_at timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deliveryNoteId" text
);


ALTER TABLE public.procurement_orders OWNER TO postgres;

--
-- Name: product_barcodes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_barcodes (
    id text NOT NULL,
    "productId" text NOT NULL,
    barcode text NOT NULL,
    symbology text NOT NULL,
    "isPrimary" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "tenantId" text
);


ALTER TABLE public.product_barcodes OWNER TO postgres;

--
-- Name: product_costing_configs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_costing_configs (
    id text NOT NULL,
    tenant_id text NOT NULL,
    product_id text NOT NULL,
    method public."CostingMethod" DEFAULT 'WEIGHTED_AVERAGE'::public."CostingMethod" NOT NULL,
    standard_cost numeric(12,4),
    effective_from timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.product_costing_configs OWNER TO postgres;

--
-- Name: product_equivalents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_equivalents (
    id text NOT NULL,
    product1_id text NOT NULL,
    product2_id text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "tenantId" text
);


ALTER TABLE public.product_equivalents OWNER TO postgres;

--
-- Name: product_location_stocks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_location_stocks (
    id text NOT NULL,
    "warehouseId" text NOT NULL,
    "locationId" text NOT NULL,
    "productId" text NOT NULL,
    "qtyOnHand" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "tenantId" text
);


ALTER TABLE public.product_location_stocks OWNER TO postgres;

--
-- Name: product_lots; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_lots (
    id text NOT NULL,
    tenant_id text NOT NULL,
    product_id text NOT NULL,
    warehouse_id text,
    lot_number text NOT NULL,
    serial_number text,
    expiry_date timestamp(3) without time zone,
    manufactured_date timestamp(3) without time zone,
    quantity numeric(12,4) DEFAULT 0 NOT NULL,
    notes text,
    is_active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.product_lots OWNER TO postgres;

--
-- Name: product_movements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_movements (
    id text NOT NULL,
    product_id text NOT NULL,
    movement_type public."MovementType" NOT NULL,
    quantity integer NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "warehouseId" text,
    invoice_item_id text,
    "tenantId" text,
    deleted_by text,
    deleted_at timestamp(3) without time zone,
    is_reversed boolean DEFAULT false NOT NULL,
    reversal_of_id text,
    record_type text
);


ALTER TABLE public.product_movements OWNER TO postgres;

--
-- Name: product_shelves; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_shelves (
    id text NOT NULL,
    product_id text NOT NULL,
    shelf_id text NOT NULL,
    quantity integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "tenantId" text
);


ALTER TABLE public.product_shelves OWNER TO postgres;

--
-- Name: product_vehicle_compatibilities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_vehicle_compatibilities (
    id text NOT NULL,
    tenant_id text NOT NULL,
    product_id text NOT NULL,
    vehicle_brand text NOT NULL,
    vehicle_model text,
    vehicle_engine_size text,
    vehicle_fuel_type text,
    year_from integer,
    year_to integer,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.product_vehicle_compatibilities OWNER TO postgres;

--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id text NOT NULL,
    code text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    description text,
    unit_text text NOT NULL,
    critical_qty integer DEFAULT 0 NOT NULL,
    category_text text,
    main_category text,
    sub_category text,
    brand_text text,
    model text,
    oem text,
    shelf text,
    barcode text,
    supplier_code text,
    equivalency_group_id text,
    vehicle_brand text,
    vehicle_model text,
    vehicle_engine_size text,
    vehicle_fuel_type text,
    is_category_only boolean DEFAULT false,
    is_brand_only boolean DEFAULT false,
    weight numeric(12,4),
    weight_unit text,
    dimensions text,
    country_of_origin text,
    warranty_months integer,
    internal_note text,
    min_order_qty integer,
    lead_time_days integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    unit_id text,
    vat_rate integer DEFAULT 20 NOT NULL,
    brand_id text,
    category_id text,
    is_b2b boolean DEFAULT false NOT NULL
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: purchase_delivery_note_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchase_delivery_note_items (
    id text NOT NULL,
    "tenantId" text,
    delivery_note_id text NOT NULL,
    product_id text NOT NULL,
    quantity integer NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    vat_rate integer NOT NULL,
    vat_amount numeric(10,2) NOT NULL,
    total_amount numeric(12,2) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.purchase_delivery_note_items OWNER TO postgres;

--
-- Name: purchase_delivery_note_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchase_delivery_note_logs (
    id text NOT NULL,
    "tenantId" text,
    delivery_note_id text NOT NULL,
    user_id text,
    action_type public."LogAction" NOT NULL,
    changes text,
    ip_address text,
    user_agent text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.purchase_delivery_note_logs OWNER TO postgres;

--
-- Name: purchase_delivery_notes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchase_delivery_notes (
    id text NOT NULL,
    delivery_note_no text NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "tenantId" text,
    account_id text NOT NULL,
    warehouse_id text,
    source_type public."DeliveryNoteSourceType" NOT NULL,
    source_id text,
    status public."DeliveryNoteStatus" DEFAULT 'NOT_INVOICED'::public."DeliveryNoteStatus" NOT NULL,
    total_amount numeric(12,2) NOT NULL,
    vat_amount numeric(12,2) NOT NULL,
    grand_total numeric(12,2) NOT NULL,
    discount numeric(10,2) DEFAULT 0 NOT NULL,
    notes text,
    created_by text,
    updated_by text,
    deleted_by text,
    deleted_at timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.purchase_delivery_notes OWNER TO postgres;

--
-- Name: purchase_order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchase_order_items (
    id text NOT NULL,
    purchase_order_id text NOT NULL,
    product_id text NOT NULL,
    ordered_quantity integer NOT NULL,
    received_quantity integer DEFAULT 0 NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    status public."OrderItemStatus" DEFAULT 'PENDING'::public."OrderItemStatus" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "tenantId" text
);


ALTER TABLE public.purchase_order_items OWNER TO postgres;

--
-- Name: purchase_order_local_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchase_order_local_items (
    id text NOT NULL,
    order_id text NOT NULL,
    product_id text NOT NULL,
    quantity integer NOT NULL,
    delivered_quantity integer DEFAULT 0 NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    vat_rate integer NOT NULL,
    vat_amount numeric(10,2) NOT NULL,
    amount numeric(10,2) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    discount_amount numeric(10,2) DEFAULT 0,
    discount_rate numeric(10,2) DEFAULT 0,
    discount_type text DEFAULT 'pct'::text,
    unit text
);


ALTER TABLE public.purchase_order_local_items OWNER TO postgres;

--
-- Name: purchase_order_local_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchase_order_local_logs (
    id text NOT NULL,
    order_id text NOT NULL,
    user_id text,
    action_type public."LogAction" NOT NULL,
    changes text,
    ip_address text,
    user_agent text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "tenantId" text
);


ALTER TABLE public.purchase_order_local_logs OWNER TO postgres;

--
-- Name: purchase_orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchase_orders (
    id text NOT NULL,
    "orderNumber" text NOT NULL,
    "tenantId" text,
    supplier_id text NOT NULL,
    order_date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expected_delivery_date timestamp(3) without time zone,
    status public."OrderStatus" DEFAULT 'PENDING'::public."OrderStatus" NOT NULL,
    total_amount numeric(12,2) NOT NULL,
    notes text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.purchase_orders OWNER TO postgres;

--
-- Name: quote_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quote_items (
    id text NOT NULL,
    quote_id text NOT NULL,
    product_id text NOT NULL,
    quantity integer NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    vat_rate integer NOT NULL,
    vat_amount numeric(10,2) NOT NULL,
    amount numeric(10,2) NOT NULL,
    discount_rate numeric(5,2),
    discount_amount numeric(10,2),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "tenantId" text
);


ALTER TABLE public.quote_items OWNER TO postgres;

--
-- Name: quote_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quote_logs (
    id text NOT NULL,
    quote_id text NOT NULL,
    user_id text,
    action_type public."LogAction" NOT NULL,
    changes text,
    ip_address text,
    user_agent text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "tenantId" text
);


ALTER TABLE public.quote_logs OWNER TO postgres;

--
-- Name: quotes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quotes (
    id text NOT NULL,
    quote_no text NOT NULL,
    "tenantId" text,
    quote_type public."QuoteType" NOT NULL,
    account_id text NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    valid_until timestamp(3) without time zone,
    discount numeric(10,2) DEFAULT 0 NOT NULL,
    total_amount numeric(12,2) NOT NULL,
    vat_amount numeric(12,2) NOT NULL,
    grand_total numeric(12,2) NOT NULL,
    notes text,
    status public."QuoteStatus" DEFAULT 'OFFERED'::public."QuoteStatus" NOT NULL,
    order_id text,
    created_by text,
    updated_by text,
    deleted_at timestamp(3) without time zone,
    deleted_by text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.quotes OWNER TO postgres;

--
-- Name: reconciliation_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reconciliation_logs (
    id text NOT NULL,
    tenant_id text NOT NULL,
    invoice_id text,
    account_id text,
    product_id text,
    check_type text NOT NULL,
    is_consistent boolean NOT NULL,
    discrepancy_data jsonb,
    checked_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    checked_by text
);


ALTER TABLE public.reconciliation_logs OWNER TO postgres;

--
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role_permissions (
    id text NOT NULL,
    "roleId" text NOT NULL,
    "permissionId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.role_permissions OWNER TO postgres;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "isSystemRole" boolean DEFAULT false NOT NULL,
    "tenantId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: salary_payment_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.salary_payment_details (
    id text NOT NULL,
    "tenantId" text,
    salary_payment_id text NOT NULL,
    cashbox_id text,
    bank_account_id text,
    amount numeric(12,2) NOT NULL,
    payment_method public."PaymentMethod" NOT NULL,
    reference_no text,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.salary_payment_details OWNER TO postgres;

--
-- Name: salary_payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.salary_payments (
    id text NOT NULL,
    "tenantId" text,
    employee_id text NOT NULL,
    plan_id text NOT NULL,
    month integer NOT NULL,
    year integer NOT NULL,
    total_amount numeric(12,2) NOT NULL,
    payment_date timestamp(3) without time zone,
    status public."SalaryStatus" DEFAULT 'PENDING'::public."SalaryStatus" NOT NULL,
    notes text,
    created_by text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    deleted_by text,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.salary_payments OWNER TO postgres;

--
-- Name: salary_plans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.salary_plans (
    id text NOT NULL,
    "tenantId" text,
    employee_id text NOT NULL,
    year integer NOT NULL,
    month integer NOT NULL,
    salary numeric(10,2) NOT NULL,
    bonus numeric(10,2) DEFAULT 0 NOT NULL,
    total numeric(10,2) NOT NULL,
    status public."SalaryStatus" DEFAULT 'UNPAID'::public."SalaryStatus" NOT NULL,
    paid_amount numeric(10,2) DEFAULT 0 NOT NULL,
    remaining_amount numeric(10,2) NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    deleted_by text,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.salary_plans OWNER TO postgres;

--
-- Name: sales_agents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sales_agents (
    id text NOT NULL,
    full_name text NOT NULL,
    phone text,
    email text,
    is_active boolean DEFAULT true NOT NULL,
    "tenantId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.sales_agents OWNER TO postgres;

--
-- Name: sales_delivery_note_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sales_delivery_note_items (
    id text NOT NULL,
    "tenantId" text,
    delivery_note_id text NOT NULL,
    product_id text NOT NULL,
    quantity integer NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    vat_rate integer NOT NULL,
    vat_amount numeric(10,2) NOT NULL,
    total_amount numeric(12,2) NOT NULL,
    invoiced_quantity integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.sales_delivery_note_items OWNER TO postgres;

--
-- Name: sales_delivery_note_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sales_delivery_note_logs (
    id text NOT NULL,
    delivery_note_id text NOT NULL,
    user_id text,
    action_type public."LogAction" NOT NULL,
    changes text,
    ip_address text,
    user_agent text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "tenantId" text
);


ALTER TABLE public.sales_delivery_note_logs OWNER TO postgres;

--
-- Name: sales_delivery_notes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sales_delivery_notes (
    id text NOT NULL,
    delivery_note_no text NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "tenantId" text,
    account_id text NOT NULL,
    warehouse_id text,
    source_type public."DeliveryNoteSourceType" NOT NULL,
    source_id text,
    status public."DeliveryNoteStatus" DEFAULT 'NOT_INVOICED'::public."DeliveryNoteStatus" NOT NULL,
    total_amount numeric(12,2) NOT NULL,
    vat_amount numeric(12,2) NOT NULL,
    grand_total numeric(12,2) NOT NULL,
    discount numeric(10,2) DEFAULT 0 NOT NULL,
    notes text,
    created_by text,
    updated_by text,
    deleted_at timestamp(3) without time zone,
    deleted_by text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "invoiceNos" text[] DEFAULT ARRAY[]::text[],
    order_no_ref text
);


ALTER TABLE public.sales_delivery_notes OWNER TO postgres;

--
-- Name: sales_order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sales_order_items (
    id text NOT NULL,
    "tenantId" text,
    order_id text NOT NULL,
    product_id text NOT NULL,
    quantity integer NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    vat_rate integer NOT NULL,
    vat_amount numeric(10,2) NOT NULL,
    total_amount numeric(12,2) NOT NULL,
    delivered_quantity integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    discount_amount numeric(10,2) DEFAULT 0,
    discount_rate numeric(10,2) DEFAULT 0,
    discount_type text DEFAULT 'pct'::text,
    unit text
);


ALTER TABLE public.sales_order_items OWNER TO postgres;

--
-- Name: sales_order_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sales_order_logs (
    id text NOT NULL,
    order_id text NOT NULL,
    user_id text,
    action_type public."LogAction" NOT NULL,
    changes text,
    ip_address text,
    user_agent text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "tenantId" text
);


ALTER TABLE public.sales_order_logs OWNER TO postgres;

--
-- Name: sales_orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sales_orders (
    id text NOT NULL,
    order_no text NOT NULL,
    type public."OrderType" NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "tenantId" text,
    account_id text NOT NULL,
    status public."SalesOrderStatus" DEFAULT 'PENDING'::public."SalesOrderStatus" NOT NULL,
    total_amount numeric(12,2) NOT NULL,
    vat_amount numeric(12,2) NOT NULL,
    grand_total numeric(12,2) NOT NULL,
    discount numeric(10,2) DEFAULT 0 NOT NULL,
    notes text,
    due_date timestamp(3) without time zone,
    invoice_no text,
    created_by text,
    updated_by text,
    deleted_by text,
    deleted_at timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deliveryNoteId" text
);


ALTER TABLE public.sales_orders OWNER TO postgres;

--
-- Name: service_invoices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.service_invoices (
    id text NOT NULL,
    "tenantId" text,
    "invoiceNo" text NOT NULL,
    "workOrderId" text NOT NULL,
    account_id text NOT NULL,
    "issueDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "dueDate" timestamp(3) without time zone,
    subtotal numeric(12,2) NOT NULL,
    "taxAmount" numeric(12,2) NOT NULL,
    "grandTotal" numeric(12,2) NOT NULL,
    currency text DEFAULT 'TRY'::text NOT NULL,
    "createdBy" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.service_invoices OWNER TO postgres;

--
-- Name: service_templates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.service_templates (
    id text NOT NULL,
    tenant_id text NOT NULL,
    name text NOT NULL,
    description text,
    estimated_hours numeric(6,2),
    labor_cost numeric(12,2),
    is_active boolean DEFAULT true NOT NULL,
    items jsonb,
    created_by text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.service_templates OWNER TO postgres;

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sessions (
    id text NOT NULL,
    "userId" text NOT NULL,
    token text NOT NULL,
    "refreshToken" text,
    "ipAddress" text,
    "userAgent" text,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.sessions OWNER TO postgres;

--
-- Name: shelves; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shelves (
    id text NOT NULL,
    warehouse_id text NOT NULL,
    code text NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "tenantId" text
);


ALTER TABLE public.shelves OWNER TO postgres;

--
-- Name: simple_orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.simple_orders (
    id text NOT NULL,
    "tenantId" text,
    company_id text NOT NULL,
    product_id text NOT NULL,
    quantity integer NOT NULL,
    status public."SimpleOrderStatus" DEFAULT 'AWAITING_APPROVAL'::public."SimpleOrderStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    supplied_quantity integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.simple_orders OWNER TO postgres;

--
-- Name: stock_cost_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_cost_history (
    id text NOT NULL,
    product_id text NOT NULL,
    cost numeric(12,4) NOT NULL,
    method text DEFAULT 'WEIGHTED_AVERAGE'::text NOT NULL,
    computed_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    brand text,
    main_category text,
    sub_category text,
    note text,
    "tenantId" text
);


ALTER TABLE public.stock_cost_history OWNER TO postgres;

--
-- Name: stock_moves; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_moves (
    id text NOT NULL,
    "productId" text NOT NULL,
    "fromWarehouseId" text,
    "fromLocationId" text,
    "toWarehouseId" text NOT NULL,
    "toLocationId" text NOT NULL,
    qty numeric(18,5) NOT NULL,
    "moveType" public."StockMoveType" NOT NULL,
    "refType" text,
    "refId" text,
    note text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdBy" text,
    "tenantId" text
);


ALTER TABLE public.stock_moves OWNER TO postgres;

--
-- Name: stocktake_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stocktake_items (
    id text NOT NULL,
    stocktake_id text NOT NULL,
    product_id text NOT NULL,
    location_id text,
    system_quantity integer NOT NULL,
    counted_quantity integer NOT NULL,
    difference integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "tenantId" text
);


ALTER TABLE public.stocktake_items OWNER TO postgres;

--
-- Name: stocktakes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stocktakes (
    id text NOT NULL,
    stocktake_no text NOT NULL,
    "tenantId" text,
    stocktake_type public."StocktakeType" NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status public."StocktakeStatus" DEFAULT 'DRAFT'::public."StocktakeStatus" NOT NULL,
    notes text,
    created_by text,
    updated_by text,
    approved_by text,
    approval_date timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.stocktakes OWNER TO postgres;

--
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subscriptions (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "planId" text NOT NULL,
    status public."SubscriptionStatus" DEFAULT 'TRIAL'::public."SubscriptionStatus" NOT NULL,
    "startDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    "trialEndsAt" timestamp(3) without time zone,
    "canceledAt" timestamp(3) without time zone,
    "nextBillingDate" timestamp(3) without time zone,
    "lastBillingDate" timestamp(3) without time zone,
    "autoRenew" boolean DEFAULT true NOT NULL,
    "iyzicoSubscriptionRef" text,
    "additionalUsers" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.subscriptions OWNER TO postgres;

--
-- Name: system_parameters; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.system_parameters (
    id text NOT NULL,
    "tenantId" text,
    key text NOT NULL,
    value jsonb NOT NULL,
    description text,
    category text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.system_parameters OWNER TO postgres;

--
-- Name: technician_metrics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.technician_metrics (
    id text NOT NULL,
    tenant_id text NOT NULL,
    technician_id text NOT NULL,
    period_start timestamp(3) without time zone NOT NULL,
    period_end timestamp(3) without time zone NOT NULL,
    total_work_orders integer DEFAULT 0 NOT NULL,
    completed_work_orders integer DEFAULT 0 NOT NULL,
    avg_completion_hours numeric(8,2) DEFAULT 0 NOT NULL,
    rework_count integer DEFAULT 0 NOT NULL,
    customer_satisfaction numeric(3,1),
    revenue_generated numeric(14,2) DEFAULT 0 NOT NULL,
    parts_efficiency numeric(5,2),
    on_time_delivery_rate numeric(5,2),
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.technician_metrics OWNER TO postgres;

--
-- Name: tenant_onboardings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tenant_onboardings (
    id text NOT NULL,
    tenant_id text NOT NULL,
    steps jsonb DEFAULT '{}'::jsonb NOT NULL,
    completed_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.tenant_onboardings OWNER TO postgres;

--
-- Name: tenant_purge_audits; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tenant_purge_audits (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "adminId" text NOT NULL,
    "adminEmail" text NOT NULL,
    "ipAddress" text NOT NULL,
    "deletedFiles" integer DEFAULT 0 NOT NULL,
    errors jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.tenant_purge_audits OWNER TO postgres;

--
-- Name: tenant_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tenant_settings (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "companyName" text,
    "taxNumber" text,
    address text,
    "logoUrl" text,
    features jsonb,
    limits jsonb,
    timezone text DEFAULT 'Europe/Istanbul'::text NOT NULL,
    locale text DEFAULT 'tr-TR'::text NOT NULL,
    currency text DEFAULT 'TRY'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    city text,
    "companyType" text DEFAULT 'COMPANY'::text,
    country text,
    district text,
    email text,
    "firstName" text,
    "lastName" text,
    "mersisNo" text,
    neighborhood text,
    phone text,
    "postalCode" text,
    "taxOffice" text,
    "tcNo" text,
    website text
);


ALTER TABLE public.tenant_settings OWNER TO postgres;

--
-- Name: tenant_usage_metrics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tenant_usage_metrics (
    id text NOT NULL,
    tenant_id text NOT NULL,
    metric_date date NOT NULL,
    api_call_count integer DEFAULT 0 NOT NULL,
    storage_bytes bigint DEFAULT 0 NOT NULL,
    active_users integer DEFAULT 0 NOT NULL,
    invoice_count integer DEFAULT 0 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.tenant_usage_metrics OWNER TO postgres;

--
-- Name: tenants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tenants (
    id text NOT NULL,
    uuid text NOT NULL,
    name text NOT NULL,
    subdomain text,
    domain text,
    status public."TenantStatus" DEFAULT 'TRIAL'::public."TenantStatus" NOT NULL,
    "cancelledAt" timestamp(3) without time zone,
    "purgedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "tenantType" public."TenantType" DEFAULT 'CORPORATE'::public."TenantType" NOT NULL
);


ALTER TABLE public.tenants OWNER TO postgres;

--
-- Name: unit_sets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.unit_sets (
    id text NOT NULL,
    tenant_id text,
    name text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    is_system boolean DEFAULT false NOT NULL
);


ALTER TABLE public.unit_sets OWNER TO postgres;

--
-- Name: units; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.units (
    id text NOT NULL,
    unit_set_id text NOT NULL,
    name text NOT NULL,
    code text,
    conversion_rate numeric(12,4) DEFAULT 1 NOT NULL,
    is_base_unit boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    is_divisible boolean DEFAULT true NOT NULL
);


ALTER TABLE public.units OWNER TO postgres;

--
-- Name: user_licenses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_licenses (
    id text NOT NULL,
    "userId" text NOT NULL,
    "licenseType" public."LicenseType" NOT NULL,
    "moduleId" text,
    "assignedBy" text,
    "assignedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "revokedAt" timestamp(3) without time zone,
    "revokedBy" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.user_licenses OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id text NOT NULL,
    uuid text NOT NULL,
    email text NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    "firstName" text,
    "lastName" text,
    "fullName" text NOT NULL,
    phone text,
    "avatarUrl" text,
    role public."UserRole" DEFAULT 'USER'::public."UserRole" NOT NULL,
    department text,
    status public."UserStatus" DEFAULT 'ACTIVE'::public."UserStatus" NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "refreshToken" text,
    "tokenVersion" integer DEFAULT 0 NOT NULL,
    "tenantId" text,
    "emailVerified" boolean DEFAULT false NOT NULL,
    "lastLoginAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "roleId" text
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: vehicle_catalog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vehicle_catalog (
    id text NOT NULL,
    brand text NOT NULL,
    model text NOT NULL,
    engine_volume text NOT NULL,
    fuel_type text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.vehicle_catalog OWNER TO postgres;

--
-- Name: vehicle_expenses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vehicle_expenses (
    id text NOT NULL,
    "tenantId" text,
    "vehicleId" text NOT NULL,
    expense_type public."VehicleExpenseType" NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    amount numeric(12,2) NOT NULL,
    notes text,
    document_no text,
    mileage integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public.vehicle_expenses OWNER TO postgres;

--
-- Name: warehouse_critical_stocks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.warehouse_critical_stocks (
    id text NOT NULL,
    "warehouseId" text NOT NULL,
    "productId" text NOT NULL,
    "criticalQty" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "tenantId" text
);


ALTER TABLE public.warehouse_critical_stocks OWNER TO postgres;

--
-- Name: warehouse_stock_thresholds; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.warehouse_stock_thresholds (
    id text NOT NULL,
    tenant_id text NOT NULL,
    warehouse_id text NOT NULL,
    product_id text NOT NULL,
    min_qty integer DEFAULT 0 NOT NULL,
    max_qty integer,
    reorder_qty integer,
    is_active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.warehouse_stock_thresholds OWNER TO postgres;

--
-- Name: warehouse_transfer_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.warehouse_transfer_items (
    id text NOT NULL,
    "transferId" text NOT NULL,
    product_id text NOT NULL,
    quantity integer NOT NULL,
    "fromLocationId" text,
    "toLocationId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "tenantId" text
);


ALTER TABLE public.warehouse_transfer_items OWNER TO postgres;

--
-- Name: warehouse_transfer_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.warehouse_transfer_logs (
    id text NOT NULL,
    "transferId" text NOT NULL,
    "userId" text,
    "actionType" public."LogAction" NOT NULL,
    changes text,
    "ipAddress" text,
    "userAgent" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "tenantId" text
);


ALTER TABLE public.warehouse_transfer_logs OWNER TO postgres;

--
-- Name: warehouse_transfers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.warehouse_transfers (
    id text NOT NULL,
    "transferNo" text NOT NULL,
    "tenantId" text,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "fromWarehouseId" text NOT NULL,
    "toWarehouseId" text NOT NULL,
    status public."TransferStatus" DEFAULT 'PREPARING'::public."TransferStatus" NOT NULL,
    "driverName" text,
    "vehiclePlate" text,
    notes text,
    prepared_by_id text,
    approved_by_id text,
    received_by_id text,
    shipping_date timestamp(3) without time zone,
    delivery_date timestamp(3) without time zone,
    "createdBy" text,
    "updatedBy" text,
    "deletedAt" timestamp(3) without time zone,
    "deletedBy" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.warehouse_transfers OWNER TO postgres;

--
-- Name: warehouses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.warehouses (
    id text NOT NULL,
    code text NOT NULL,
    "tenantId" text,
    name text NOT NULL,
    active boolean DEFAULT true NOT NULL,
    address text,
    phone text,
    manager text,
    manager_id text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "isDefault" boolean DEFAULT false NOT NULL
);


ALTER TABLE public.warehouses OWNER TO postgres;

--
-- Name: webhook_endpoints; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.webhook_endpoints (
    id text NOT NULL,
    tenant_id text NOT NULL,
    url text NOT NULL,
    events text[] DEFAULT ARRAY[]::text[],
    secret text NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    failure_count integer DEFAULT 0 NOT NULL,
    last_triggered timestamp(3) without time zone,
    created_by text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.webhook_endpoints OWNER TO postgres;

--
-- Name: work_order_activities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.work_order_activities (
    id text NOT NULL,
    "workOrderId" text NOT NULL,
    action text NOT NULL,
    "userId" text,
    metadata jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "tenantId" text
);


ALTER TABLE public.work_order_activities OWNER TO postgres;

--
-- Name: work_order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.work_order_items (
    id text NOT NULL,
    "workOrderId" text NOT NULL,
    type public."WorkOrderItemType" NOT NULL,
    description text NOT NULL,
    product_id text,
    quantity integer DEFAULT 1 NOT NULL,
    "unitPrice" numeric(12,2) NOT NULL,
    "taxRate" integer DEFAULT 20 NOT NULL,
    "taxAmount" numeric(12,2) DEFAULT 0 NOT NULL,
    "totalPrice" numeric(12,2) NOT NULL,
    version integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "tenantId" text
);


ALTER TABLE public.work_order_items OWNER TO postgres;

--
-- Name: work_order_warranties; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.work_order_warranties (
    id text NOT NULL,
    tenant_id text NOT NULL,
    work_order_id text NOT NULL,
    warranty_type text DEFAULT 'LABOR'::text NOT NULL,
    valid_until timestamp(3) without time zone NOT NULL,
    mileage_limit integer,
    description text,
    terms text,
    is_active boolean DEFAULT true NOT NULL,
    created_by text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.work_order_warranties OWNER TO postgres;

--
-- Name: work_orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.work_orders (
    id text NOT NULL,
    "workOrderNo" text NOT NULL,
    "tenantId" text,
    status public."WorkOrderStatus" DEFAULT 'WAITING_DIAGNOSIS'::public."WorkOrderStatus" NOT NULL,
    "partWorkflowStatus" public."PartWorkflowStatus" DEFAULT 'NOT_STARTED'::public."PartWorkflowStatus" NOT NULL,
    "vehicleWorkflowStatus" public."VehicleWorkflowStatus" DEFAULT 'WAITING'::public."VehicleWorkflowStatus" NOT NULL,
    "customerVehicleId" text NOT NULL,
    account_id text NOT NULL,
    "technicianId" text,
    description text,
    "diagnosisNotes" text,
    "supplyResponseNotes" text,
    "estimatedCompletionDate" timestamp(3) without time zone,
    "actualCompletionDate" timestamp(3) without time zone,
    "totalLaborCost" numeric(12,2) DEFAULT 0 NOT NULL,
    "totalPartsCost" numeric(12,2) DEFAULT 0 NOT NULL,
    "taxAmount" numeric(12,2) DEFAULT 0 NOT NULL,
    "grandTotal" numeric(12,2) DEFAULT 0 NOT NULL,
    version integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone,
    deleted_by text,
    updated_by text,
    service_template_id text
);


ALTER TABLE public.work_orders OWNER TO postgres;

--
-- Name: einvoice_inbox id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.einvoice_inbox ALTER COLUMN id SET DEFAULT nextval('public.einvoice_inbox_id_seq'::regclass);


--
-- Name: hizli_tokens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hizli_tokens ALTER COLUMN id SET DEFAULT nextval('public.hizli_tokens_id_seq'::regclass);


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
f3041561-f020-4d80-8658-34d7eb83a062	463c7a75121c4971c0559f1c5f6dfadd913df37305d1861a0d8236faddd0dfa3	2026-05-13 14:02:30.168906+03	20260318112749_add_pos_discount_fields	\N	\N	2026-05-13 14:02:25.697597+03	1
9dc3f80e-beaf-43c3-8c55-b13a4cdf9b92	aed4b3d773f0c8b75a28ac62ae2481cc558f5947ae225767c6afe4b3d9d59c61	2026-05-13 14:02:30.191818+03	20260318113303_add_pos_discount_fields_v2	\N	\N	2026-05-13 14:02:30.171624+03	1
12bbee5f-2331-4340-b3c6-4e8373c34fd2	c6429a8c3f06b61f5a30d9cdf75e544d771c665025dad4fde521b08499a45ebe	2026-05-13 14:02:30.201978+03	20260319120000_add_installment_count_to_collections	\N	\N	2026-05-13 14:02:30.194233+03	1
aedb19dc-172d-4e46-8ffd-673015bef0b3	900d20f98c6a009f8fd6a069fdd0ec9ff82a8ca30b3070432c441a9c24640ef1	2026-05-13 14:02:30.212581+03	20260320155000_unit_set_v2	\N	\N	2026-05-13 14:02:30.20442+03	1
c5819611-d59d-4aa9-a2af-a4026986cd19	5b3b414de3c12aee9a071dcf99c24e5db2728d9ec6cc6c0e587c0495d584ac47	2026-05-13 14:02:30.273596+03	20260321074919_add_tenant_id_to_purchase_order_item	\N	\N	2026-05-13 14:02:30.215333+03	1
030ee78a-a477-4524-a862-32f83b501277	e758d389bceb54b478b97c95feb994a661cfe7a501a59450e716e74db9983f06	2026-05-13 14:02:30.36088+03	20260321120226_enterprise_check_bill	\N	\N	2026-05-13 14:02:30.27615+03	1
dc2d78d4-79d8-44eb-855a-99a50eab527b	82b345333453f64954d1216a8c348c24dc3ed8318b99ce4319add4203f4e75f4	2026-05-13 14:02:30.370931+03	20260327172606_add_efatura_fields_to_account	\N	\N	2026-05-13 14:02:30.363323+03	1
d1a27f2e-af23-4c36-946b-5db3bf3e3545	54591dcf7ec12c87c5de3d88c015d75ad43bd67bcad718c4d33e53b46f67a7df	2026-05-13 14:02:30.381297+03	20260327191426_add_expense_reference_no_and_optional_payment	\N	\N	2026-05-13 14:02:30.373553+03	1
929b5df3-7b66-4f03-b871-25b36e9d99d3	eba9dc32e7c418c64356f8a884f51a5934fa580998f7677e8e6ea8aac096eb66	2026-05-13 14:02:30.643908+03	20260401130000_check_bill_v2_doc_alignment	\N	\N	2026-05-13 14:02:30.383978+03	1
b14ec3c7-cfaf-48e5-88ec-cdddbb0be58a	953a3b0f5d79681f041c7ae160518580d3afcad7e60ca23b85be2f7355872464	2026-05-13 14:02:30.654278+03	20260402100000_add_journal_type_return_from_bank	\N	\N	2026-05-13 14:02:30.646392+03	1
24386c91-98f8-4928-bc56-71c9918d30c8	981b4d59bbae1ab5ec70f6d3b856443a1a3e98239078124d3b03b3edbd0648e8	2026-05-13 20:05:48.134542+03	20260513170547_add_is_b2b_to_products	\N	\N	2026-05-13 20:05:47.781398+03	1
\.


--
-- Data for Name: account_addresses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.account_addresses (id, account_id, title, type, address, city, district, postal_code, is_default, "createdAt", "updatedAt", "tenantId") FROM stdin;
\.


--
-- Data for Name: account_banks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.account_banks (id, account_id, bank_name, branch_name, branch_code, account_no, iban, currency, notes, "createdAt", "updatedAt", "tenantId") FROM stdin;
\.


--
-- Data for Name: account_contacts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.account_contacts (id, account_id, full_name, title, phone, email, extension, is_default, notes, "createdAt", "updatedAt", "tenantId") FROM stdin;
\.


--
-- Data for Name: account_movements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.account_movements (id, account_id, type, amount, balance, document_type, document_no, date, notes, "createdAt", "updatedAt", "tenantId", deleted_by, deleted_at, invoice_id, is_reversed, reversal_of_id, is_reversal, record_type, check_bill_id) FROM stdin;
\.


--
-- Data for Name: account_transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.account_transactions (id, "tenantId", account_id, source_type, source_id, direction, amount, description, "createdAt") FROM stdin;
\.


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.accounts (id, code, "tenantId", title, type, company_type, tax_number, tax_office, national_id, full_name, phone, email, country, city, district, address, contact_name, balance, payment_term_days, is_active, "createdAt", "updatedAt", deleted_by, deleted_at, updated_by, sales_agent_id, credit_limit, credit_status, collateral_amount, sector, custom_code1, custom_code2, website, fax, due_days, currency, bank_info, price_list_id, efatura_gonderici_birim, efatura_posta_kutusu, block_on_risk) FROM stdin;
f31a574e-42fa-47f1-808c-091a13bfa31a	C0001	tenant-2f7n87stvjj	AZEM YAZILIM	CUSTOMER	CORPORATE	\N	\N	\N	\N	\N	\N	Türkiye	İstanbul	Kadıköy	\N	\N	0.00	\N	t	2026-05-13 19:31:34.255	2026-05-13 19:31:34.255	\N	\N	\N	\N	0.00	NORMAL	0.00	\N	\N	\N	\N	\N	30	TRY	\N	\N	\N	\N	f
\.


--
-- Data for Name: advance_settlements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.advance_settlements (id, "tenantId", advance_id, salary_plan_id, amount, date, description) FROM stdin;
\.


--
-- Data for Name: advances; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.advances (id, "tenantId", employee_id, cashbox_id, date, amount, settled_amount, remaining_amount, notes, status, created_by, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: api_keys; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.api_keys (id, tenant_id, name, key_hash, key_prefix, scopes, last_used_at, expires_at, revoked_at, revoked_by, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: asset_assignments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asset_assignments (id, tenant_id, employee_id, asset_name, asset_code, serial_number, description, assigned_at, returned_at, condition, notes, assigned_by, returned_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_logs (id, "userId", "tenantId", action, resource, "resourceId", metadata, "ipAddress", "userAgent", "createdAt") FROM stdin;
\.


--
-- Data for Name: b2b_account_movements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.b2b_account_movements (id, "tenantId", "erpMovementId", "customerId", date, type, description, debit, credit, balance, "erpInvoiceNo", "dueDate", "isPastDue", "createdAt") FROM stdin;
\.


--
-- Data for Name: b2b_advertisements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.b2b_advertisements (id, "tenantId", type, "imageUrl", "linkUrl", "displayOrder", "startsAt", "endsAt", "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: b2b_cart_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.b2b_cart_items (id, "tenantId", "cartId", "productId", quantity, "addedAt") FROM stdin;
\.


--
-- Data for Name: b2b_carts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.b2b_carts (id, "tenantId", "customerId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: b2b_customer_classes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.b2b_customer_classes (id, "tenantId", name, "discountRate", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: b2b_customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.b2b_customers (id, "tenantId", "erpNum", "erpAccountId", name, email, "passwordHash", "isActive", "customerClassId", "discountGroupId", "vatDays", "createdAt", "updatedAt", "lastLoginAt", city, district, "canUseVirtualPos", "blockOrderOnRisk", "customerGrade") FROM stdin;
\.


--
-- Data for Name: b2b_delivery_methods; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.b2b_delivery_methods (id, "tenantId", name, "isActive", "displayOrder", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: b2b_discount_groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.b2b_discount_groups (id, "tenantId", name, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: b2b_discounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.b2b_discounts (id, "tenantId", name, type, "targetValue", "discountRate", "startsAt", "endsAt", "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: b2b_domains; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.b2b_domains (id, domain, "tenantId", "isVerified", "createdAt") FROM stdin;
\.


--
-- Data for Name: b2b_licenses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.b2b_licenses (id, "tenantId", "isActive", "maxB2BCustomers", "expiresAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: b2b_notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.b2b_notifications (id, "tenantId", "customerId", type, message, "isRead", "orderId", "createdAt") FROM stdin;
\.


--
-- Data for Name: b2b_order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.b2b_order_items (id, "tenantId", "orderId", "productId", "stockCode", "productName", quantity, "listPrice", "customerClassDiscount", "campaignDiscount", "finalPrice", "createdAt") FROM stdin;
\.


--
-- Data for Name: b2b_orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.b2b_orders (id, "tenantId", "orderNumber", "customerId", "salespersonId", "placedBy", "placedByLabel", status, "deliveryBranchId", "deliveryBranchName", "deliveryMethodId", note, "totalListPrice", "totalDiscountAmount", "totalFinalPrice", "erpOrderId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: b2b_products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.b2b_products (id, "tenantId", "erpProductId", "stockCode", name, description, brand, category, "oemCode", "supplierCode", unit, "erpListPrice", "erpCreatedAt", "erpUpdatedAt", "isVisibleInB2B", "minOrderQuantity", "imageUrl", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: b2b_salesperson_customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.b2b_salesperson_customers ("salespersonId", "customerId", "assignedAt") FROM stdin;
\.


--
-- Data for Name: b2b_salespersons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.b2b_salespersons (id, "tenantId", name, email, "passwordHash", "isActive", "canViewAllCustomers", "canViewAllReports", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: b2b_stocks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.b2b_stocks (id, "tenantId", "productId", "warehouseId", "warehouseName", "isAvailable", quantity, "displayOrder", "updatedAt") FROM stdin;
\.


--
-- Data for Name: b2b_sync_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.b2b_sync_logs (id, "tenantId", "syncType", status, "startedAt", "finishedAt", "recordsProcessed", "recordsAdded", "recordsUpdated", "errorMessage", "createdAt") FROM stdin;
\.


--
-- Data for Name: b2b_sync_loops; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.b2b_sync_loops (id, tenant_id, sync_type, last_run_at, last_user_id) FROM stdin;
\.


--
-- Data for Name: b2b_tenant_configs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.b2b_tenant_configs (id, "tenantId", "schemaName", domain, "erpAdapterType", "erpConnectionString", "lastSyncedAt", "lastSyncRequestedAt", "syncIntervalMinutes", "orderApprovalMode", "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: b2b_warehouse_configs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.b2b_warehouse_configs (id, "tenantId", "warehouseId", "warehouseName", "displayMode", "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: bank_account_movements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bank_account_movements (id, bank_account_id, movement_type, movement_sub_type, amount, commission_rate, commission_amount, net_amount, balance, notes, reference_no, account_id, date, "createdAt", tenant_id, deleted_by, deleted_at) FROM stdin;
\.


--
-- Data for Name: bank_accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bank_accounts (id, bank_id, code, name, account_no, iban, type, balance, is_active, commission_rate, credit_limit, used_credit_limit, card_limit, statement_day, payment_due_day, terminal_no, "createdAt", "updatedAt", "tenantId") FROM stdin;
\.


--
-- Data for Name: bank_loan_plans; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bank_loan_plans (id, loan_id, installment_no, due_date, amount, paid_amount, status, "tenantId") FROM stdin;
\.


--
-- Data for Name: bank_loans; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bank_loans (id, bank_account_id, amount, total_repayment, total_interest, installment_count, start_date, notes, loan_type, status, annual_interest_rate, payment_frequency, "tenantId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: bank_transfer_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bank_transfer_logs (id, bank_transfer_id, user_id, action_type, changes, ip_address, user_agent, "createdAt", tenant_id) FROM stdin;
\.


--
-- Data for Name: bank_transfers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bank_transfers (id, "tenantId", transfer_type, cashbox_id, account_id, amount, date, notes, reference_no, sender, receiver, created_by, updated_by, deleted_at, deleted_by, "createdAt", "updatedAt", bank_account_id) FROM stdin;
\.


--
-- Data for Name: banks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.banks (id, "tenantId", name, branch, city, contact_name, phone, logo, is_active, "createdAt", "updatedAt", deleted_at, deleted_by) FROM stdin;
\.


--
-- Data for Name: brands; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.brands (id, tenant_id, name, slug, logo_url, is_active, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: cashbox_movements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cashbox_movements (id, cashbox_id, movement_type, amount, commission_amount, bsmv_amount, net_amount, balance, document_type, document_no, account_id, notes, date, is_transferred, transfer_date, created_by, "createdAt", "updatedAt", deleted_by, deleted_at, tenant_id) FROM stdin;
\.


--
-- Data for Name: cashboxes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cashboxes (id, code, "tenantId", name, type, balance, is_active, is_retail, warehouse_id, "createdBy", "updatedBy", "createdAt", "updatedAt", deleted_at, deleted_by) FROM stdin;
17da41a6-18fc-4df8-b173-e890ad2c7c23	K001	tenant-2f7n87stvjj	MERKEZ KASA	CASH	0.00	t	f	\N	user-admin-azemtarim	\N	2026-05-13 13:02:08.847	2026-05-13 13:02:08.847	\N	\N
d28b752a-2960-481d-859f-6d8da94f1ce4	K002	tenant-2f7n87stvjj	PK KASASI	CASH	0.00	t	t	\N	user-admin-azemtarim	\N	2026-05-13 13:02:18.815	2026-05-13 13:02:18.815	\N	\N
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, tenant_id, name, slug, parent_id, level, is_active, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: check_bill_approval_workflows; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.check_bill_approval_workflows (id, tenant_id, check_bill_id, journal_id, workflow_type, step, approver_id, status, action_at, comments, delegated_to_id, amount_threshold, created_at) FROM stdin;
\.


--
-- Data for Name: check_bill_bank_submissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.check_bill_bank_submissions (id, tenant_id, check_bill_id, bank_account_id, submission_type, submitted_at, submission_ref, expected_date, actual_date, status, bank_fee, rejection_reason, created_by_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: check_bill_collections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.check_bill_collections (id, "tenantId", check_bill_id, collected_amount, collection_date, cashbox_id, bank_account_id, journal_id, created_by_id, "createdAt", collection_method, bank_transaction_ref, exchange_rate, amount_try, tax_withholding_amount, net_amount, gl_entry_id, updated_at) FROM stdin;
\.


--
-- Data for Name: check_bill_discounting; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.check_bill_discounting (id, tenant_id, check_bill_id, bank_account_id, face_value, discount_rate, discount_amount, banking_commission, net_proceeds, discount_date, maturity_date, status, gl_entry_id, created_at) FROM stdin;
\.


--
-- Data for Name: check_bill_endorsements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.check_bill_endorsements (id, "tenantId", check_bill_id, sequence, from_account_id, to_account_id, endorsed_at, journal_id, endorsement_type, endorsed_amount, endorsement_reason, is_returned, returned_at, created_at) FROM stdin;
\.


--
-- Data for Name: check_bill_gl_entries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.check_bill_gl_entries (id, tenant_id, check_bill_id, journal_id, gl_journal_no, accounting_date, fiscal_year, fiscal_period, debit_account_code, credit_account_code, debit_amount, credit_amount, currency, exchange_rate, description, entry_type, status, reversal_of_id, posted_by_id, posted_at, created_at) FROM stdin;
\.


--
-- Data for Name: check_bill_journal_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.check_bill_journal_items (id, journal_id, check_bill_id, "tenantId", "createdAt", "updatedAt", line_amount, line_note) FROM stdin;
\.


--
-- Data for Name: check_bill_journals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.check_bill_journals (id, journal_no, type, date, account_id, notes, "tenantId", created_by_id, "createdAt", "updatedAt", bank_account_id, cashbox_id, accounting_date, fiscal_period_id, gl_journal_id, total_amount, total_count, status, approved_by_id, approved_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: check_bill_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.check_bill_logs (id, check_bill_id, user_id, action_type, changes, ip_address, user_agent, "createdAt", "tenantId", from_status, journal_id, notes, performed_by_id, to_status, session_id, request_id, duration, is_system) FROM stdin;
\.


--
-- Data for Name: check_bill_protest_tracking; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.check_bill_protest_tracking (id, tenant_id, check_bill_id, protest_date, protest_reason, protesting_notary_id, protest_no, legal_status, lawsuit_date, lawsuit_no, court_id, judgment_date, judgment_amount, execution_date, execution_no, collected_via_legal, lawyer_id, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: check_bill_reconciliation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.check_bill_reconciliation (id, tenant_id, check_bill_id, bank_account_id, reconciliation_date, bank_amount, system_amount, difference, status, bank_reference, resolved_by_id, resolved_at, notes, created_at) FROM stdin;
\.


--
-- Data for Name: check_bill_reminders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.check_bill_reminders (id, tenant_id, check_bill_id, reminder_type, trigger_days_before, scheduled_at, sent_at, status, channel, recipients, template_id, retry_count, error_message, created_at) FROM stdin;
\.


--
-- Data for Name: check_bill_risk_limits; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.check_bill_risk_limits (id, tenant_id, account_id, limit_type, limit_amount, limit_days, current_exposure, utilization_rate, risk_rating, alert_threshold, is_active, valid_from, valid_until, approved_by_id, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: checks_bills; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.checks_bills (id, "tenantId", type, portfolio_type, account_id, amount, remaining_amount, due_date, bank, branch, account_no, check_no, serial_no, status, collection_date, collection_cashbox_id, is_endorsed, endorsement_date, endorsed_to, notes, created_by, updated_by, deleted_at, deleted_by, "createdAt", "updatedAt", last_journal_id, current_holder_id, is_protested, protested_at, currency, exchange_rate, amount_try, issue_date, presentation_date, bank_code, branch_code, iban, micr_line, drawer_name, drawer_tax_no, payee_name, risk_score, protest_reason, legal_followup_started, legal_followup_date, gl_entry_id, is_reconciled, reconciled_at, tax_withholding_rate, tax_withholding_amount, vat_rate, vat_amount, internal_ref, external_ref, attachment_urls, tags, approved_by, approved_at) FROM stdin;
\.


--
-- Data for Name: code_templates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.code_templates (id, "tenantId", module, name, prefix, "digitCount", "currentValue", "includeYear", "isActive", "createdAt", "updatedAt") FROM stdin;
21e40276-09e3-4c22-b3f3-b86f8feb4b9b	tenant-2f7n87stvjj	WAREHOUSE	Depo Kodu	D	3	0	f	t	2026-05-13 12:55:33.697	2026-05-13 12:55:33.697
6be96e6b-61da-4a1c-aad8-469ab3d0fc99	tenant-2f7n87stvjj	CASHBOX	Kasa Kodu	K	3	0	f	t	2026-05-13 12:55:33.893	2026-05-13 12:55:33.893
85b549d7-8b6d-4876-8c10-3e19b3363a79	tenant-2f7n87stvjj	PERSONNEL	Personel Kodu	P	4	0	f	t	2026-05-13 12:55:33.919	2026-05-13 12:55:33.919
a3c96c95-7464-48f3-85fe-b663ce4decdc	tenant-2f7n87stvjj	INVOICE_SALES	Satış Fatura No	AZM	9	0	t	t	2026-05-13 12:55:34.282	2026-05-13 12:55:34.282
8cc6ebf0-9ba3-478c-b095-28fc4cc7cf92	tenant-2f7n87stvjj	INVOICE_PURCHASE	Alış Fatura No	AF	6	0	f	t	2026-05-13 12:55:34.309	2026-05-13 12:55:34.309
d2aa0236-4b1c-4b68-8378-483bca9f8915	tenant-2f7n87stvjj	ORDER_SALES	Satış Sipariş No	SS	6	0	f	t	2026-05-13 12:55:34.341	2026-05-13 12:55:34.341
b62540a8-adfc-482c-9c35-7d70cd4ea7df	tenant-2f7n87stvjj	ORDER_PURCHASE	Satın Alma Sipariş No	SAS	6	0	f	t	2026-05-13 12:55:34.367	2026-05-13 12:55:34.367
4acb3ee0-3807-483c-8e0b-242bba795e51	tenant-2f7n87stvjj	INVENTORY_COUNT	Sayım Kodu	SY	4	0	f	t	2026-05-13 12:55:34.396	2026-05-13 12:55:34.396
03ad1fda-aa72-4415-9e89-4e84a03fbe3e	tenant-2f7n87stvjj	QUOTE	Teklif No	TK	6	0	f	t	2026-05-13 12:55:34.42	2026-05-13 12:55:34.42
3ba6f17c-c001-48a2-b1c3-dde4510e5d65	tenant-2f7n87stvjj	DELIVERY_NOTE_SALES	Satış İrsaliye No	SI	6	0	f	t	2026-05-13 12:55:34.444	2026-05-13 12:55:34.444
f341f91a-75a4-40d1-94c3-2fd415a9bfca	tenant-2f7n87stvjj	DELIVERY_NOTE_PURCHASE	Alış İrsaliye No	AI	6	0	f	t	2026-05-13 12:55:34.467	2026-05-13 12:55:34.467
b71f9ba9-2d7e-4056-99cc-bf1ab26ecaa7	tenant-2f7n87stvjj	WAREHOUSE_TRANSFER	Depo Transfer No	DT	6	0	f	t	2026-05-13 12:55:34.489	2026-05-13 12:55:34.489
dedc0c14-92f7-481c-8fb1-1a407e27bd59	tenant-2f7n87stvjj	TECHNICIAN	Teknisyen Kodu	T	3	0	f	t	2026-05-13 12:55:34.511	2026-05-13 12:55:34.511
b37f206f-ca83-47dc-ac3d-0476ec44a987	tenant-2f7n87stvjj	WORK_ORDER	İş Emri No	IE	5	0	f	t	2026-05-13 12:55:34.528	2026-05-13 12:55:34.528
2cff638f-5b04-4820-80a6-736140f7d27f	tenant-2f7n87stvjj	SERVICE_INVOICE	Servis Fatura No	SF	6	0	f	t	2026-05-13 12:55:34.546	2026-05-13 12:55:34.546
e1bd4c0e-562e-4cf3-982c-8e88ad19884c	tenant-2f7n87stvjj	PRODUCT	Ürün Kodu	ST	4	1	f	t	2026-05-13 12:55:33.96	2026-05-13 17:17:02.947
9aea3884-0f9a-4248-9b23-278c9494fb2c	tenant-2f7n87stvjj	CUSTOMER	Cari Kodu	C	4	1	f	t	2026-05-13 12:55:34.238	2026-05-13 19:31:34.272
d1eb85c5-9027-4f5a-a955-cc7462ba43fa	tenant-2f7n87stvjj	CHECK_BILL_JOURNAL	Bordro Numaralandırma	BRD	6	0	f	t	2026-05-13 20:57:05.137	2026-05-13 20:57:05.137
9de7e1bd-41bc-4e89-a81c-7a05b4fc1a33	tenant-2f7n87stvjj	CHECK_BILL_DOCUMENT	Çek / Senet Evrak No	EVR	6	0	f	t	2026-05-13 20:57:05.168	2026-05-13 20:57:05.168
\.


--
-- Data for Name: collections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.collections (id, "tenantId", account_id, invoice_id, service_invoice_id, type, amount, date, payment_type, cashbox_id, bank_account_id, company_credit_card_id, notes, created_by, deleted_at, deleted_by, "createdAt", "updatedAt", sales_agent_id, installment_count) FROM stdin;
\.


--
-- Data for Name: company_credit_card_movements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.company_credit_card_movements (id, card_id, amount, balance, notes, account_id, reference_no, date, "createdAt", "tenantId") FROM stdin;
\.


--
-- Data for Name: company_credit_card_reminders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.company_credit_card_reminders (id, card_id, type, day, is_active, "createdAt", "updatedAt", "tenantId") FROM stdin;
\.


--
-- Data for Name: company_credit_cards; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.company_credit_cards (id, cashbox_id, code, name, bank_name, card_type, last_four_digits, credit_limit, balance, is_active, "createdAt", "updatedAt", statement_date, payment_due_date, "tenantId") FROM stdin;
\.


--
-- Data for Name: company_vehicles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.company_vehicles (id, "tenantId", plate, brand, model, year, chassis_no, engine_no, registration_date, vehicle_type, fuel_type, is_active, assigned_employee_id, registration_image_url, notes, "createdAt", "updatedAt", "deletedAt", insurance_date, last_inspection_date, registration_serial_no) FROM stdin;
\.


--
-- Data for Name: coupon_redemptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.coupon_redemptions (id, coupon_id, tenant_id, subscription_id, redeemed_at, discount_applied) FROM stdin;
\.


--
-- Data for Name: coupons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.coupons (id, code, description, discount_type, discount_value, currency, max_uses, used_count, valid_from, valid_until, applicable_plans, is_active, created_at, updated_at, "tenantId") FROM stdin;
\.


--
-- Data for Name: customer_vehicles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer_vehicles (id, "tenantId", account_id, plate, brand, model, year, chassis_no, engine_power, engine_size, fuel_type, transmission, color, registration_date, registration_no, registration_owner, mileage, notes, service_status, vehicle_catalog_id, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: deleted_bank_transfers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.deleted_bank_transfers (id, original_id, transfer_type, cashbox_id, cashbox_name, account_id, account_name, amount, date, notes, tenant_id, reference_no, sender, receiver, original_created_by, original_updated_by, original_created_at, original_updated_at, deleted_by, deleted_at, delete_reason) FROM stdin;
\.


--
-- Data for Name: deleted_checks_bills; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.deleted_checks_bills (id, original_id, type, portfolio_type, account_id, account_name, amount, due_date, bank, branch, account_no, check_no, serial_no, status, collection_date, collection_cashbox_id, is_endorsed, endorsement_date, endorsed_to, notes, original_created_by, original_updated_by, original_created_at, original_updated_at, deleted_by, deleted_at, delete_reason, "tenantId") FROM stdin;
\.


--
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.departments (id, tenant_id, name, code, manager_id, parent_id, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: einvoice_inbox; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.einvoice_inbox (id, ettn, "senderVkn", "senderTitle", "invoiceNo", "invoiceDate", "rawXml", "createdAt", tenant_id, matched_invoice_id, scenario, receiver_vkn, status, processed_at, processed_by) FROM stdin;
\.


--
-- Data for Name: einvoice_sends; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.einvoice_sends (id, tenant_id, invoice_id, ettn, scenario, profile_id, sender_alias, receiver_alias, receiver_vkn, xml_content, status, sent_at, response_code, response_description, response_xml, retry_count, last_retry_at, error_detail, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: einvoice_tenant_configs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.einvoice_tenant_configs (id, tenant_id, is_einvoice_user, is_earsiv_user, integration_vkn, sender_alias, api_username, api_password_hash, test_mode, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: einvoice_xml; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.einvoice_xml (id, invoice_id, xml_data, "createdAt", "updatedAt", "tenantId") FROM stdin;
\.


--
-- Data for Name: employee_payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee_payments (id, employee_id, type, amount, date, period, notes, cashbox_id, created_by, "createdAt", "tenantId") FROM stdin;
\.


--
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employees (id, employee_code, "tenantId", identity_number, first_name, last_name, birth_date, gender, marital_status, phone, email, address, city, district, "position", department, department_id, start_date, end_date, is_active, salary, salary_day, social_security_no, iban, balance, notes, created_by, updated_by, "createdAt", "updatedAt", bonus) FROM stdin;
\.


--
-- Data for Name: equivalency_groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.equivalency_groups (id, "tenantId", name, description, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: expense_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.expense_categories (id, "tenantId", name, notes, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: expenses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.expenses (id, "tenantId", category_id, notes, amount, date, payment_type, "createdAt", "updatedAt", reference_no) FROM stdin;
\.


--
-- Data for Name: feature_flags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.feature_flags (id, tenant_id, flag_key, is_enabled, payload, enabled_at, disabled_at, enabled_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: hizli_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hizli_tokens (id, token, "loginHash", "generatedAt", "expiresAt") FROM stdin;
\.


--
-- Data for Name: inventory_transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory_transactions (id, "tenantId", "partRequestId", product_id, "warehouseId", quantity, "transactionType", "createdAt") FROM stdin;
\.


--
-- Data for Name: invitations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invitations (id, email, "tenantId", "invitedBy", token, status, "expiresAt", "acceptedAt", "acceptedBy", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: invoice_collections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invoice_collections (id, invoice_id, collection_id, amount, "createdAt", "tenantId", installment_count) FROM stdin;
\.


--
-- Data for Name: invoice_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invoice_items (id, invoice_id, product_id, quantity, unit_price, vat_rate, vat_amount, amount, discount_rate, discount_amount, withholding_code, withholding_rate, sct_rate, sct_amount, vat_exemption_reason, unit, shelf, purchase_order_item_id, "createdAt", "tenantId", discount_type) FROM stdin;
\.


--
-- Data for Name: invoice_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invoice_logs (id, invoice_id, user_id, action_type, changes, ip_address, user_agent, "createdAt", "tenantId") FROM stdin;
\.


--
-- Data for Name: invoice_payment_plans; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invoice_payment_plans (id, invoice_id, due_date, amount, payment_type, notes, is_paid, "createdAt", "updatedAt", "tenantId") FROM stdin;
\.


--
-- Data for Name: invoice_profit; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invoice_profit (id, invoice_id, invoice_item_id, product_id, "tenantId", quantity, unit_price, unit_cost, total_sales_amount, total_cost, profit, profit_rate, computed_at, "updatedAt") FROM stdin;
\.


--
-- Data for Name: invoices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invoices (id, invoice_no, invoice_type, "tenantId", account_id, date, due_date, discount, total_amount, vat_amount, sct_total, withholding_total, grand_total, foreign_total, currency, exchange_rate, notes, status, payable_amount, paid_amount, order_no, purchase_order_id, procurement_order_id, delivery_note_id, purchase_delivery_note_id, einvoice_status, einvoice_ettn, e_scenario, e_invoice_type, gib_alias, delivery_method, created_by, updated_by, deleted_at, deleted_by, "createdAt", "updatedAt", sales_agent_id, warehouse_id, global_discount_type, global_discount_value, delivery_note_no_ref) FROM stdin;
\.


--
-- Data for Name: journal_entries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.journal_entries (id, "tenantId", "referenceType", "referenceId", "serviceInvoiceId", "entryDate", description, "createdAt", "createdBy") FROM stdin;
\.


--
-- Data for Name: journal_entry_lines; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.journal_entry_lines (id, "journalEntryId", "accountCode", "accountName", debit, credit, description, "tenantId") FROM stdin;
\.


--
-- Data for Name: leave_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.leave_requests (id, tenant_id, employee_id, leave_type_id, start_date, end_date, total_days, reason, status, approved_by_id, approved_at, rejected_by_id, rejected_at, rejection_note, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: leave_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.leave_types (id, tenant_id, name, code, is_paid, default_days, carry_over, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: locations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.locations (id, "warehouseId", layer, corridor, side, section, level, code, barcode, name, active, "createdAt", "updatedAt", "tenantId") FROM stdin;
\.


--
-- Data for Name: module_licenses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.module_licenses (id, "subscriptionId", "moduleId", quantity, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: modules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.modules (id, name, slug, description, price, currency, "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: order_pickings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_pickings (id, order_id, order_item_id, location_id, quantity, picked_by, "createdAt", "tenantId") FROM stdin;
\.


--
-- Data for Name: overtime_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.overtime_records (id, tenant_id, employee_id, date, hours, overtime_type, rate, amount, status, approved_by_id, approved_at, notes, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: part_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.part_requests (id, "tenantId", "workOrderId", "requestedBy", description, product_id, "requestedQty", "suppliedQty", status, version, "suppliedBy", "suppliedAt", "usedAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, "subscriptionId", amount, currency, status, "iyzicoPaymentId", "iyzicoToken", "conversationId", "invoiceNumber", "invoiceUrl", "paidAt", "failedAt", "refundedAt", "errorCode", "errorMessage", "paymentMethod", "createdAt", "updatedAt", "tenantId") FROM stdin;
\.


--
-- Data for Name: performance_reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.performance_reviews (id, tenant_id, employee_id, reviewer_id, period_start, period_end, overall_score, goals, strengths, improvements, manager_notes, status, submitted_at, acknowledged_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permissions (id, module, action, description, "createdAt") FROM stdin;
\.


--
-- Data for Name: plans; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plans (id, name, slug, description, price, currency, "billingPeriod", "trialDays", "baseUserLimit", features, limits, "isActive", "isPopular", "isBasePlan", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: pos_payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pos_payments (id, invoice_id, payment_method, amount, change, gift_card_id, notes, "createdAt", "updatedAt", "tenantId", created_by, updated_by) FROM stdin;
\.


--
-- Data for Name: pos_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pos_sessions (id, session_no, cashier_id, cashbox_id, opening_amount, closing_amount, closing_notes, status, opened_at, closed_at, "createdAt", "updatedAt", "tenantId", created_by, updated_by) FROM stdin;
\.


--
-- Data for Name: postal_codes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.postal_codes (id, city, district, neighborhood, "postalCode", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: preventive_maintenances; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.preventive_maintenances (id, tenant_id, vehicle_id, customer_vehicle_id, maintenance_type, name, description, interval_days, interval_mileage, last_performed_at, last_mileage, next_due_at, next_mileage, is_active, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: price_cards; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.price_cards (id, tenant_id, product_id, type, price, currency, is_active, effective_from, effective_to, vat_rate, min_quantity, note, created_by, updated_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: price_list_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.price_list_items (id, price_list_id, product_id, price, discount_rate, "createdAt", "updatedAt", "tenantId") FROM stdin;
\.


--
-- Data for Name: price_lists; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.price_lists (id, name, "tenantId", start_date, end_date, is_active, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: procurement_orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.procurement_orders (id, order_no, date, "tenantId", account_id, status, total_amount, vat_amount, grand_total, discount, notes, due_date, invoice_no, created_by, updated_by, deleted_by, deleted_at, "createdAt", "updatedAt", "deliveryNoteId") FROM stdin;
\.


--
-- Data for Name: product_barcodes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_barcodes (id, "productId", barcode, symbology, "isPrimary", "createdAt", "updatedAt", "tenantId") FROM stdin;
\.


--
-- Data for Name: product_costing_configs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_costing_configs (id, tenant_id, product_id, method, standard_cost, effective_from, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: product_equivalents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_equivalents (id, product1_id, product2_id, "createdAt", "tenantId") FROM stdin;
\.


--
-- Data for Name: product_location_stocks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_location_stocks (id, "warehouseId", "locationId", "productId", "qtyOnHand", "createdAt", "updatedAt", "tenantId") FROM stdin;
\.


--
-- Data for Name: product_lots; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_lots (id, tenant_id, product_id, warehouse_id, lot_number, serial_number, expiry_date, manufactured_date, quantity, notes, is_active, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: product_movements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_movements (id, product_id, movement_type, quantity, unit_price, notes, "createdAt", "warehouseId", invoice_item_id, "tenantId", deleted_by, deleted_at, is_reversed, reversal_of_id, record_type) FROM stdin;
\.


--
-- Data for Name: product_shelves; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_shelves (id, product_id, shelf_id, quantity, "createdAt", "updatedAt", "tenantId") FROM stdin;
\.


--
-- Data for Name: product_vehicle_compatibilities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_vehicle_compatibilities (id, tenant_id, product_id, vehicle_brand, vehicle_model, vehicle_engine_size, vehicle_fuel_type, year_from, year_to, notes, "createdAt") FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, code, "tenantId", name, description, unit_text, critical_qty, category_text, main_category, sub_category, brand_text, model, oem, shelf, barcode, supplier_code, equivalency_group_id, vehicle_brand, vehicle_model, vehicle_engine_size, vehicle_fuel_type, is_category_only, is_brand_only, weight, weight_unit, dimensions, country_of_origin, warranty_months, internal_note, min_order_qty, lead_time_days, "createdAt", "updatedAt", unit_id, vat_rate, brand_id, category_id, is_b2b) FROM stdin;
ec80ac1e-3372-474c-a990-69ea7d997946	ST0001	tenant-2f7n87stvjj	Deneme Ürünü	\N	Adet	0	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	kg	\N	\N	\N	\N	\N	\N	2026-05-13 17:17:02.935	2026-05-13 17:17:02.935	\N	20	\N	\N	f
\.


--
-- Data for Name: purchase_delivery_note_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchase_delivery_note_items (id, "tenantId", delivery_note_id, product_id, quantity, unit_price, vat_rate, vat_amount, total_amount, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: purchase_delivery_note_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchase_delivery_note_logs (id, "tenantId", delivery_note_id, user_id, action_type, changes, ip_address, user_agent, "createdAt") FROM stdin;
\.


--
-- Data for Name: purchase_delivery_notes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchase_delivery_notes (id, delivery_note_no, date, "tenantId", account_id, warehouse_id, source_type, source_id, status, total_amount, vat_amount, grand_total, discount, notes, created_by, updated_by, deleted_by, deleted_at, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: purchase_order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchase_order_items (id, purchase_order_id, product_id, ordered_quantity, received_quantity, unit_price, status, created_at, "tenantId") FROM stdin;
\.


--
-- Data for Name: purchase_order_local_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchase_order_local_items (id, order_id, product_id, quantity, delivered_quantity, unit_price, vat_rate, vat_amount, amount, "createdAt", discount_amount, discount_rate, discount_type, unit) FROM stdin;
\.


--
-- Data for Name: purchase_order_local_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchase_order_local_logs (id, order_id, user_id, action_type, changes, ip_address, user_agent, "createdAt", "tenantId") FROM stdin;
\.


--
-- Data for Name: purchase_orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchase_orders (id, "orderNumber", "tenantId", supplier_id, order_date, expected_delivery_date, status, total_amount, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: quote_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quote_items (id, quote_id, product_id, quantity, unit_price, vat_rate, vat_amount, amount, discount_rate, discount_amount, "createdAt", "tenantId") FROM stdin;
\.


--
-- Data for Name: quote_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quote_logs (id, quote_id, user_id, action_type, changes, ip_address, user_agent, "createdAt", "tenantId") FROM stdin;
\.


--
-- Data for Name: quotes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quotes (id, quote_no, "tenantId", quote_type, account_id, date, valid_until, discount, total_amount, vat_amount, grand_total, notes, status, order_id, created_by, updated_by, deleted_at, deleted_by, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: reconciliation_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reconciliation_logs (id, tenant_id, invoice_id, account_id, product_id, check_type, is_consistent, discrepancy_data, checked_at, checked_by) FROM stdin;
\.


--
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role_permissions (id, "roleId", "permissionId", "createdAt") FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name, description, "isSystemRole", "tenantId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: salary_payment_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.salary_payment_details (id, "tenantId", salary_payment_id, cashbox_id, bank_account_id, amount, payment_method, reference_no, notes, "createdAt") FROM stdin;
\.


--
-- Data for Name: salary_payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.salary_payments (id, "tenantId", employee_id, plan_id, month, year, total_amount, payment_date, status, notes, created_by, "createdAt", "updatedAt", deleted_by, deleted_at) FROM stdin;
\.


--
-- Data for Name: salary_plans; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.salary_plans (id, "tenantId", employee_id, year, month, salary, bonus, total, status, paid_amount, remaining_amount, is_active, description, "createdAt", "updatedAt", deleted_by, deleted_at) FROM stdin;
\.


--
-- Data for Name: sales_agents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sales_agents (id, full_name, phone, email, is_active, "tenantId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: sales_delivery_note_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sales_delivery_note_items (id, "tenantId", delivery_note_id, product_id, quantity, unit_price, vat_rate, vat_amount, total_amount, invoiced_quantity, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: sales_delivery_note_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sales_delivery_note_logs (id, delivery_note_id, user_id, action_type, changes, ip_address, user_agent, "createdAt", "tenantId") FROM stdin;
\.


--
-- Data for Name: sales_delivery_notes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sales_delivery_notes (id, delivery_note_no, date, "tenantId", account_id, warehouse_id, source_type, source_id, status, total_amount, vat_amount, grand_total, discount, notes, created_by, updated_by, deleted_at, deleted_by, "createdAt", "updatedAt", "invoiceNos", order_no_ref) FROM stdin;
\.


--
-- Data for Name: sales_order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sales_order_items (id, "tenantId", order_id, product_id, quantity, unit_price, vat_rate, vat_amount, total_amount, delivered_quantity, "createdAt", "updatedAt", discount_amount, discount_rate, discount_type, unit) FROM stdin;
\.


--
-- Data for Name: sales_order_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sales_order_logs (id, order_id, user_id, action_type, changes, ip_address, user_agent, "createdAt", "tenantId") FROM stdin;
\.


--
-- Data for Name: sales_orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sales_orders (id, order_no, type, date, "tenantId", account_id, status, total_amount, vat_amount, grand_total, discount, notes, due_date, invoice_no, created_by, updated_by, deleted_by, deleted_at, "createdAt", "updatedAt", "deliveryNoteId") FROM stdin;
\.


--
-- Data for Name: service_invoices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.service_invoices (id, "tenantId", "invoiceNo", "workOrderId", account_id, "issueDate", "dueDate", subtotal, "taxAmount", "grandTotal", currency, "createdBy", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: service_templates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.service_templates (id, tenant_id, name, description, estimated_hours, labor_cost, is_active, items, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sessions (id, "userId", token, "refreshToken", "ipAddress", "userAgent", "expiresAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: shelves; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shelves (id, warehouse_id, code, notes, "createdAt", "updatedAt", "tenantId") FROM stdin;
\.


--
-- Data for Name: simple_orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.simple_orders (id, "tenantId", company_id, product_id, quantity, status, "createdAt", "updatedAt", supplied_quantity) FROM stdin;
\.


--
-- Data for Name: stock_cost_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_cost_history (id, product_id, cost, method, computed_at, brand, main_category, sub_category, note, "tenantId") FROM stdin;
\.


--
-- Data for Name: stock_moves; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_moves (id, "productId", "fromWarehouseId", "fromLocationId", "toWarehouseId", "toLocationId", qty, "moveType", "refType", "refId", note, "createdAt", "createdBy", "tenantId") FROM stdin;
\.


--
-- Data for Name: stocktake_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stocktake_items (id, stocktake_id, product_id, location_id, system_quantity, counted_quantity, difference, "createdAt", "tenantId") FROM stdin;
\.


--
-- Data for Name: stocktakes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stocktakes (id, stocktake_no, "tenantId", stocktake_type, date, status, notes, created_by, updated_by, approved_by, approval_date, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subscriptions (id, "tenantId", "planId", status, "startDate", "endDate", "trialEndsAt", "canceledAt", "nextBillingDate", "lastBillingDate", "autoRenew", "iyzicoSubscriptionRef", "additionalUsers", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: system_parameters; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.system_parameters (id, "tenantId", key, value, description, category, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: technician_metrics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.technician_metrics (id, tenant_id, technician_id, period_start, period_end, total_work_orders, completed_work_orders, avg_completion_hours, rework_count, customer_satisfaction, revenue_generated, parts_efficiency, on_time_delivery_rate, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: tenant_onboardings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tenant_onboardings (id, tenant_id, steps, completed_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: tenant_purge_audits; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tenant_purge_audits (id, "tenantId", "adminId", "adminEmail", "ipAddress", "deletedFiles", errors, "createdAt") FROM stdin;
\.


--
-- Data for Name: tenant_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tenant_settings (id, "tenantId", "companyName", "taxNumber", address, "logoUrl", features, limits, timezone, locale, currency, "createdAt", "updatedAt", city, "companyType", country, district, email, "firstName", "lastName", "mersisNo", neighborhood, phone, "postalCode", "taxOffice", "tcNo", website) FROM stdin;
cmp3yd9l60001ro2ac1ajnskk	tenant-2f7n87stvjj	\N	\N	\N	\N	\N	\N	Europe/Istanbul	tr-TR	TRY	2026-05-13 11:04:52.936	2026-05-13 11:04:52.936	\N	COMPANY	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: tenant_usage_metrics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tenant_usage_metrics (id, tenant_id, metric_date, api_call_count, storage_bytes, active_users, invoice_count, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: tenants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tenants (id, uuid, name, subdomain, domain, status, "cancelledAt", "purgedAt", "createdAt", "updatedAt", "tenantType") FROM stdin;
tenant-2f7n87stvjj	19e01615-c8bc-4bba-b4a2-b974425f93a4	Azem Tarim Demo	\N	\N	ACTIVE	\N	\N	2026-05-13 14:04:22.206	2026-05-13 14:04:22.206	CORPORATE
\.


--
-- Data for Name: unit_sets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.unit_sets (id, tenant_id, name, description, "createdAt", "updatedAt", is_system) FROM stdin;
\.


--
-- Data for Name: units; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.units (id, unit_set_id, name, code, conversion_rate, is_base_unit, "createdAt", "updatedAt", is_divisible) FROM stdin;
\.


--
-- Data for Name: user_licenses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_licenses (id, "userId", "licenseType", "moduleId", "assignedBy", "assignedAt", "revokedAt", "revokedBy", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, uuid, email, username, password, "firstName", "lastName", "fullName", phone, "avatarUrl", role, department, status, "isActive", "refreshToken", "tokenVersion", "tenantId", "emailVerified", "lastLoginAt", "createdAt", "updatedAt", "roleId") FROM stdin;
user-admin-azemtarim	9bde7e6c-c905-4326-ba84-69a7254de862	info@azemyazilim.com	azem-admin	$2b$10$wAaZDpA96a/jIAqUd10Ee.tN7edlLEtJ77YZgGSCi4XNjoVQnJU0.	\N	\N	Azem Admin	\N	\N	SUPER_ADMIN	\N	ACTIVE	t	$2b$10$rGRKoHVcULW3xroO8hApFeO4FgXFYSz91gJCJVJAILCTQNU85YxO.	0	tenant-2f7n87stvjj	t	2026-05-14 10:22:05.132	2026-05-13 14:04:27.561	2026-05-14 10:22:05.133	\N
\.


--
-- Data for Name: vehicle_catalog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vehicle_catalog (id, brand, model, engine_volume, fuel_type, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: vehicle_expenses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vehicle_expenses (id, "tenantId", "vehicleId", expense_type, date, amount, notes, document_no, mileage, "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: warehouse_critical_stocks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.warehouse_critical_stocks (id, "warehouseId", "productId", "criticalQty", "createdAt", "updatedAt", "tenantId") FROM stdin;
\.


--
-- Data for Name: warehouse_stock_thresholds; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.warehouse_stock_thresholds (id, tenant_id, warehouse_id, product_id, min_qty, max_qty, reorder_qty, is_active, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: warehouse_transfer_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.warehouse_transfer_items (id, "transferId", product_id, quantity, "fromLocationId", "toLocationId", "createdAt", "tenantId") FROM stdin;
\.


--
-- Data for Name: warehouse_transfer_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.warehouse_transfer_logs (id, "transferId", "userId", "actionType", changes, "ipAddress", "userAgent", "createdAt", "tenantId") FROM stdin;
\.


--
-- Data for Name: warehouse_transfers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.warehouse_transfers (id, "transferNo", "tenantId", date, "fromWarehouseId", "toWarehouseId", status, "driverName", "vehiclePlate", notes, prepared_by_id, approved_by_id, received_by_id, shipping_date, delivery_date, "createdBy", "updatedBy", "deletedAt", "deletedBy", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: warehouses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.warehouses (id, code, "tenantId", name, active, address, phone, manager, manager_id, "createdAt", "updatedAt", "isDefault") FROM stdin;
\.


--
-- Data for Name: webhook_endpoints; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.webhook_endpoints (id, tenant_id, url, events, secret, is_active, failure_count, last_triggered, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: work_order_activities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.work_order_activities (id, "workOrderId", action, "userId", metadata, "createdAt", "tenantId") FROM stdin;
\.


--
-- Data for Name: work_order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.work_order_items (id, "workOrderId", type, description, product_id, quantity, "unitPrice", "taxRate", "taxAmount", "totalPrice", version, "createdAt", "updatedAt", "tenantId") FROM stdin;
\.


--
-- Data for Name: work_order_warranties; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.work_order_warranties (id, tenant_id, work_order_id, warranty_type, valid_until, mileage_limit, description, terms, is_active, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: work_orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.work_orders (id, "workOrderNo", "tenantId", status, "partWorkflowStatus", "vehicleWorkflowStatus", "customerVehicleId", account_id, "technicianId", description, "diagnosisNotes", "supplyResponseNotes", "estimatedCompletionDate", "actualCompletionDate", "totalLaborCost", "totalPartsCost", "taxAmount", "grandTotal", version, "createdAt", "updatedAt", deleted_at, deleted_by, updated_by, service_template_id) FROM stdin;
\.


--
-- Name: einvoice_inbox_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.einvoice_inbox_id_seq', 1, false);


--
-- Name: hizli_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hizli_tokens_id_seq', 1, false);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: account_addresses account_addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_addresses
    ADD CONSTRAINT account_addresses_pkey PRIMARY KEY (id);


--
-- Name: account_banks account_banks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_banks
    ADD CONSTRAINT account_banks_pkey PRIMARY KEY (id);


--
-- Name: account_contacts account_contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_contacts
    ADD CONSTRAINT account_contacts_pkey PRIMARY KEY (id);


--
-- Name: account_movements account_movements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_movements
    ADD CONSTRAINT account_movements_pkey PRIMARY KEY (id);


--
-- Name: account_transactions account_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_transactions
    ADD CONSTRAINT account_transactions_pkey PRIMARY KEY (id);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- Name: advance_settlements advance_settlements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.advance_settlements
    ADD CONSTRAINT advance_settlements_pkey PRIMARY KEY (id);


--
-- Name: advances advances_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.advances
    ADD CONSTRAINT advances_pkey PRIMARY KEY (id);


--
-- Name: api_keys api_keys_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_pkey PRIMARY KEY (id);


--
-- Name: asset_assignments asset_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_assignments
    ADD CONSTRAINT asset_assignments_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: b2b_account_movements b2b_account_movements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_account_movements
    ADD CONSTRAINT b2b_account_movements_pkey PRIMARY KEY (id);


--
-- Name: b2b_advertisements b2b_advertisements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_advertisements
    ADD CONSTRAINT b2b_advertisements_pkey PRIMARY KEY (id);


--
-- Name: b2b_cart_items b2b_cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_cart_items
    ADD CONSTRAINT b2b_cart_items_pkey PRIMARY KEY (id);


--
-- Name: b2b_carts b2b_carts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_carts
    ADD CONSTRAINT b2b_carts_pkey PRIMARY KEY (id);


--
-- Name: b2b_customer_classes b2b_customer_classes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_customer_classes
    ADD CONSTRAINT b2b_customer_classes_pkey PRIMARY KEY (id);


--
-- Name: b2b_customers b2b_customers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_customers
    ADD CONSTRAINT b2b_customers_pkey PRIMARY KEY (id);


--
-- Name: b2b_delivery_methods b2b_delivery_methods_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_delivery_methods
    ADD CONSTRAINT b2b_delivery_methods_pkey PRIMARY KEY (id);


--
-- Name: b2b_discount_groups b2b_discount_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_discount_groups
    ADD CONSTRAINT b2b_discount_groups_pkey PRIMARY KEY (id);


--
-- Name: b2b_discounts b2b_discounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_discounts
    ADD CONSTRAINT b2b_discounts_pkey PRIMARY KEY (id);


--
-- Name: b2b_domains b2b_domains_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_domains
    ADD CONSTRAINT b2b_domains_pkey PRIMARY KEY (id);


--
-- Name: b2b_licenses b2b_licenses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_licenses
    ADD CONSTRAINT b2b_licenses_pkey PRIMARY KEY (id);


--
-- Name: b2b_notifications b2b_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_notifications
    ADD CONSTRAINT b2b_notifications_pkey PRIMARY KEY (id);


--
-- Name: b2b_order_items b2b_order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_order_items
    ADD CONSTRAINT b2b_order_items_pkey PRIMARY KEY (id);


--
-- Name: b2b_orders b2b_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_orders
    ADD CONSTRAINT b2b_orders_pkey PRIMARY KEY (id);


--
-- Name: b2b_products b2b_products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_products
    ADD CONSTRAINT b2b_products_pkey PRIMARY KEY (id);


--
-- Name: b2b_salesperson_customers b2b_salesperson_customers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_salesperson_customers
    ADD CONSTRAINT b2b_salesperson_customers_pkey PRIMARY KEY ("salespersonId", "customerId");


--
-- Name: b2b_salespersons b2b_salespersons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_salespersons
    ADD CONSTRAINT b2b_salespersons_pkey PRIMARY KEY (id);


--
-- Name: b2b_stocks b2b_stocks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_stocks
    ADD CONSTRAINT b2b_stocks_pkey PRIMARY KEY (id);


--
-- Name: b2b_sync_logs b2b_sync_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_sync_logs
    ADD CONSTRAINT b2b_sync_logs_pkey PRIMARY KEY (id);


--
-- Name: b2b_sync_loops b2b_sync_loops_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_sync_loops
    ADD CONSTRAINT b2b_sync_loops_pkey PRIMARY KEY (id);


--
-- Name: b2b_tenant_configs b2b_tenant_configs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_tenant_configs
    ADD CONSTRAINT b2b_tenant_configs_pkey PRIMARY KEY (id);


--
-- Name: b2b_warehouse_configs b2b_warehouse_configs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_warehouse_configs
    ADD CONSTRAINT b2b_warehouse_configs_pkey PRIMARY KEY (id);


--
-- Name: bank_account_movements bank_account_movements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_account_movements
    ADD CONSTRAINT bank_account_movements_pkey PRIMARY KEY (id);


--
-- Name: bank_accounts bank_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_accounts
    ADD CONSTRAINT bank_accounts_pkey PRIMARY KEY (id);


--
-- Name: bank_loan_plans bank_loan_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_loan_plans
    ADD CONSTRAINT bank_loan_plans_pkey PRIMARY KEY (id);


--
-- Name: bank_loans bank_loans_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_loans
    ADD CONSTRAINT bank_loans_pkey PRIMARY KEY (id);


--
-- Name: bank_transfer_logs bank_transfer_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_transfer_logs
    ADD CONSTRAINT bank_transfer_logs_pkey PRIMARY KEY (id);


--
-- Name: bank_transfers bank_transfers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_transfers
    ADD CONSTRAINT bank_transfers_pkey PRIMARY KEY (id);


--
-- Name: banks banks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.banks
    ADD CONSTRAINT banks_pkey PRIMARY KEY (id);


--
-- Name: brands brands_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_pkey PRIMARY KEY (id);


--
-- Name: cashbox_movements cashbox_movements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cashbox_movements
    ADD CONSTRAINT cashbox_movements_pkey PRIMARY KEY (id);


--
-- Name: cashboxes cashboxes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cashboxes
    ADD CONSTRAINT cashboxes_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: check_bill_approval_workflows check_bill_approval_workflows_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_approval_workflows
    ADD CONSTRAINT check_bill_approval_workflows_pkey PRIMARY KEY (id);


--
-- Name: check_bill_bank_submissions check_bill_bank_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_bank_submissions
    ADD CONSTRAINT check_bill_bank_submissions_pkey PRIMARY KEY (id);


--
-- Name: check_bill_collections check_bill_collections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_collections
    ADD CONSTRAINT check_bill_collections_pkey PRIMARY KEY (id);


--
-- Name: check_bill_discounting check_bill_discounting_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_discounting
    ADD CONSTRAINT check_bill_discounting_pkey PRIMARY KEY (id);


--
-- Name: check_bill_endorsements check_bill_endorsements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_endorsements
    ADD CONSTRAINT check_bill_endorsements_pkey PRIMARY KEY (id);


--
-- Name: check_bill_gl_entries check_bill_gl_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_gl_entries
    ADD CONSTRAINT check_bill_gl_entries_pkey PRIMARY KEY (id);


--
-- Name: check_bill_journal_items check_bill_journal_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_journal_items
    ADD CONSTRAINT check_bill_journal_items_pkey PRIMARY KEY (id);


--
-- Name: check_bill_journals check_bill_journals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_journals
    ADD CONSTRAINT check_bill_journals_pkey PRIMARY KEY (id);


--
-- Name: check_bill_logs check_bill_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_logs
    ADD CONSTRAINT check_bill_logs_pkey PRIMARY KEY (id);


--
-- Name: check_bill_protest_tracking check_bill_protest_tracking_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_protest_tracking
    ADD CONSTRAINT check_bill_protest_tracking_pkey PRIMARY KEY (id);


--
-- Name: check_bill_reconciliation check_bill_reconciliation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_reconciliation
    ADD CONSTRAINT check_bill_reconciliation_pkey PRIMARY KEY (id);


--
-- Name: check_bill_reminders check_bill_reminders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_reminders
    ADD CONSTRAINT check_bill_reminders_pkey PRIMARY KEY (id);


--
-- Name: check_bill_risk_limits check_bill_risk_limits_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_risk_limits
    ADD CONSTRAINT check_bill_risk_limits_pkey PRIMARY KEY (id);


--
-- Name: checks_bills checks_bills_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.checks_bills
    ADD CONSTRAINT checks_bills_pkey PRIMARY KEY (id);


--
-- Name: code_templates code_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.code_templates
    ADD CONSTRAINT code_templates_pkey PRIMARY KEY (id);


--
-- Name: collections collections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.collections
    ADD CONSTRAINT collections_pkey PRIMARY KEY (id);


--
-- Name: company_credit_card_movements company_credit_card_movements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_credit_card_movements
    ADD CONSTRAINT company_credit_card_movements_pkey PRIMARY KEY (id);


--
-- Name: company_credit_card_reminders company_credit_card_reminders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_credit_card_reminders
    ADD CONSTRAINT company_credit_card_reminders_pkey PRIMARY KEY (id);


--
-- Name: company_credit_cards company_credit_cards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_credit_cards
    ADD CONSTRAINT company_credit_cards_pkey PRIMARY KEY (id);


--
-- Name: company_vehicles company_vehicles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_vehicles
    ADD CONSTRAINT company_vehicles_pkey PRIMARY KEY (id);


--
-- Name: coupon_redemptions coupon_redemptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupon_redemptions
    ADD CONSTRAINT coupon_redemptions_pkey PRIMARY KEY (id);


--
-- Name: coupons coupons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT coupons_pkey PRIMARY KEY (id);


--
-- Name: customer_vehicles customer_vehicles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_vehicles
    ADD CONSTRAINT customer_vehicles_pkey PRIMARY KEY (id);


--
-- Name: deleted_bank_transfers deleted_bank_transfers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.deleted_bank_transfers
    ADD CONSTRAINT deleted_bank_transfers_pkey PRIMARY KEY (id);


--
-- Name: deleted_checks_bills deleted_checks_bills_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.deleted_checks_bills
    ADD CONSTRAINT deleted_checks_bills_pkey PRIMARY KEY (id);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- Name: einvoice_inbox einvoice_inbox_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.einvoice_inbox
    ADD CONSTRAINT einvoice_inbox_pkey PRIMARY KEY (id);


--
-- Name: einvoice_sends einvoice_sends_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.einvoice_sends
    ADD CONSTRAINT einvoice_sends_pkey PRIMARY KEY (id);


--
-- Name: einvoice_tenant_configs einvoice_tenant_configs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.einvoice_tenant_configs
    ADD CONSTRAINT einvoice_tenant_configs_pkey PRIMARY KEY (id);


--
-- Name: einvoice_xml einvoice_xml_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.einvoice_xml
    ADD CONSTRAINT einvoice_xml_pkey PRIMARY KEY (id);


--
-- Name: employee_payments employee_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_payments
    ADD CONSTRAINT employee_payments_pkey PRIMARY KEY (id);


--
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (id);


--
-- Name: equivalency_groups equivalency_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equivalency_groups
    ADD CONSTRAINT equivalency_groups_pkey PRIMARY KEY (id);


--
-- Name: expense_categories expense_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expense_categories
    ADD CONSTRAINT expense_categories_pkey PRIMARY KEY (id);


--
-- Name: expenses expenses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_pkey PRIMARY KEY (id);


--
-- Name: feature_flags feature_flags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feature_flags
    ADD CONSTRAINT feature_flags_pkey PRIMARY KEY (id);


--
-- Name: hizli_tokens hizli_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hizli_tokens
    ADD CONSTRAINT hizli_tokens_pkey PRIMARY KEY (id);


--
-- Name: inventory_transactions inventory_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_transactions
    ADD CONSTRAINT inventory_transactions_pkey PRIMARY KEY (id);


--
-- Name: invitations invitations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invitations
    ADD CONSTRAINT invitations_pkey PRIMARY KEY (id);


--
-- Name: invoice_collections invoice_collections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_collections
    ADD CONSTRAINT invoice_collections_pkey PRIMARY KEY (id);


--
-- Name: invoice_items invoice_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_items
    ADD CONSTRAINT invoice_items_pkey PRIMARY KEY (id);


--
-- Name: invoice_logs invoice_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_logs
    ADD CONSTRAINT invoice_logs_pkey PRIMARY KEY (id);


--
-- Name: invoice_payment_plans invoice_payment_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_payment_plans
    ADD CONSTRAINT invoice_payment_plans_pkey PRIMARY KEY (id);


--
-- Name: invoice_profit invoice_profit_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_profit
    ADD CONSTRAINT invoice_profit_pkey PRIMARY KEY (id);


--
-- Name: invoices invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);


--
-- Name: journal_entries journal_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journal_entries
    ADD CONSTRAINT journal_entries_pkey PRIMARY KEY (id);


--
-- Name: journal_entry_lines journal_entry_lines_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journal_entry_lines
    ADD CONSTRAINT journal_entry_lines_pkey PRIMARY KEY (id);


--
-- Name: leave_requests leave_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_requests
    ADD CONSTRAINT leave_requests_pkey PRIMARY KEY (id);


--
-- Name: leave_types leave_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_types
    ADD CONSTRAINT leave_types_pkey PRIMARY KEY (id);


--
-- Name: locations locations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_pkey PRIMARY KEY (id);


--
-- Name: module_licenses module_licenses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.module_licenses
    ADD CONSTRAINT module_licenses_pkey PRIMARY KEY (id);


--
-- Name: modules modules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT modules_pkey PRIMARY KEY (id);


--
-- Name: order_pickings order_pickings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_pickings
    ADD CONSTRAINT order_pickings_pkey PRIMARY KEY (id);


--
-- Name: overtime_records overtime_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.overtime_records
    ADD CONSTRAINT overtime_records_pkey PRIMARY KEY (id);


--
-- Name: part_requests part_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.part_requests
    ADD CONSTRAINT part_requests_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: performance_reviews performance_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.performance_reviews
    ADD CONSTRAINT performance_reviews_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: plans plans_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plans
    ADD CONSTRAINT plans_pkey PRIMARY KEY (id);


--
-- Name: pos_payments pos_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pos_payments
    ADD CONSTRAINT pos_payments_pkey PRIMARY KEY (id);


--
-- Name: pos_sessions pos_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pos_sessions
    ADD CONSTRAINT pos_sessions_pkey PRIMARY KEY (id);


--
-- Name: postal_codes postal_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postal_codes
    ADD CONSTRAINT postal_codes_pkey PRIMARY KEY (id);


--
-- Name: preventive_maintenances preventive_maintenances_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.preventive_maintenances
    ADD CONSTRAINT preventive_maintenances_pkey PRIMARY KEY (id);


--
-- Name: price_cards price_cards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_cards
    ADD CONSTRAINT price_cards_pkey PRIMARY KEY (id);


--
-- Name: price_list_items price_list_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_list_items
    ADD CONSTRAINT price_list_items_pkey PRIMARY KEY (id);


--
-- Name: price_lists price_lists_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_lists
    ADD CONSTRAINT price_lists_pkey PRIMARY KEY (id);


--
-- Name: procurement_orders procurement_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procurement_orders
    ADD CONSTRAINT procurement_orders_pkey PRIMARY KEY (id);


--
-- Name: product_barcodes product_barcodes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_barcodes
    ADD CONSTRAINT product_barcodes_pkey PRIMARY KEY (id);


--
-- Name: product_costing_configs product_costing_configs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_costing_configs
    ADD CONSTRAINT product_costing_configs_pkey PRIMARY KEY (id);


--
-- Name: product_equivalents product_equivalents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_equivalents
    ADD CONSTRAINT product_equivalents_pkey PRIMARY KEY (id);


--
-- Name: product_location_stocks product_location_stocks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_location_stocks
    ADD CONSTRAINT product_location_stocks_pkey PRIMARY KEY (id);


--
-- Name: product_lots product_lots_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_lots
    ADD CONSTRAINT product_lots_pkey PRIMARY KEY (id);


--
-- Name: product_movements product_movements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_movements
    ADD CONSTRAINT product_movements_pkey PRIMARY KEY (id);


--
-- Name: product_shelves product_shelves_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_shelves
    ADD CONSTRAINT product_shelves_pkey PRIMARY KEY (id);


--
-- Name: product_vehicle_compatibilities product_vehicle_compatibilities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_vehicle_compatibilities
    ADD CONSTRAINT product_vehicle_compatibilities_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: purchase_delivery_note_items purchase_delivery_note_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_delivery_note_items
    ADD CONSTRAINT purchase_delivery_note_items_pkey PRIMARY KEY (id);


--
-- Name: purchase_delivery_note_logs purchase_delivery_note_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_delivery_note_logs
    ADD CONSTRAINT purchase_delivery_note_logs_pkey PRIMARY KEY (id);


--
-- Name: purchase_delivery_notes purchase_delivery_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_delivery_notes
    ADD CONSTRAINT purchase_delivery_notes_pkey PRIMARY KEY (id);


--
-- Name: purchase_order_items purchase_order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order_items
    ADD CONSTRAINT purchase_order_items_pkey PRIMARY KEY (id);


--
-- Name: purchase_order_local_items purchase_order_local_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order_local_items
    ADD CONSTRAINT purchase_order_local_items_pkey PRIMARY KEY (id);


--
-- Name: purchase_order_local_logs purchase_order_local_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order_local_logs
    ADD CONSTRAINT purchase_order_local_logs_pkey PRIMARY KEY (id);


--
-- Name: purchase_orders purchase_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_pkey PRIMARY KEY (id);


--
-- Name: quote_items quote_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quote_items
    ADD CONSTRAINT quote_items_pkey PRIMARY KEY (id);


--
-- Name: quote_logs quote_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quote_logs
    ADD CONSTRAINT quote_logs_pkey PRIMARY KEY (id);


--
-- Name: quotes quotes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quotes
    ADD CONSTRAINT quotes_pkey PRIMARY KEY (id);


--
-- Name: reconciliation_logs reconciliation_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reconciliation_logs
    ADD CONSTRAINT reconciliation_logs_pkey PRIMARY KEY (id);


--
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: salary_payment_details salary_payment_details_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary_payment_details
    ADD CONSTRAINT salary_payment_details_pkey PRIMARY KEY (id);


--
-- Name: salary_payments salary_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary_payments
    ADD CONSTRAINT salary_payments_pkey PRIMARY KEY (id);


--
-- Name: salary_plans salary_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary_plans
    ADD CONSTRAINT salary_plans_pkey PRIMARY KEY (id);


--
-- Name: sales_agents sales_agents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_agents
    ADD CONSTRAINT sales_agents_pkey PRIMARY KEY (id);


--
-- Name: sales_delivery_note_items sales_delivery_note_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_delivery_note_items
    ADD CONSTRAINT sales_delivery_note_items_pkey PRIMARY KEY (id);


--
-- Name: sales_delivery_note_logs sales_delivery_note_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_delivery_note_logs
    ADD CONSTRAINT sales_delivery_note_logs_pkey PRIMARY KEY (id);


--
-- Name: sales_delivery_notes sales_delivery_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_delivery_notes
    ADD CONSTRAINT sales_delivery_notes_pkey PRIMARY KEY (id);


--
-- Name: sales_order_items sales_order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_order_items
    ADD CONSTRAINT sales_order_items_pkey PRIMARY KEY (id);


--
-- Name: sales_order_logs sales_order_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_order_logs
    ADD CONSTRAINT sales_order_logs_pkey PRIMARY KEY (id);


--
-- Name: sales_orders sales_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_orders
    ADD CONSTRAINT sales_orders_pkey PRIMARY KEY (id);


--
-- Name: service_invoices service_invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_invoices
    ADD CONSTRAINT service_invoices_pkey PRIMARY KEY (id);


--
-- Name: service_templates service_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_templates
    ADD CONSTRAINT service_templates_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: shelves shelves_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shelves
    ADD CONSTRAINT shelves_pkey PRIMARY KEY (id);


--
-- Name: simple_orders simple_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.simple_orders
    ADD CONSTRAINT simple_orders_pkey PRIMARY KEY (id);


--
-- Name: stock_cost_history stock_cost_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_cost_history
    ADD CONSTRAINT stock_cost_history_pkey PRIMARY KEY (id);


--
-- Name: stock_moves stock_moves_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_moves
    ADD CONSTRAINT stock_moves_pkey PRIMARY KEY (id);


--
-- Name: stocktake_items stocktake_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stocktake_items
    ADD CONSTRAINT stocktake_items_pkey PRIMARY KEY (id);


--
-- Name: stocktakes stocktakes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stocktakes
    ADD CONSTRAINT stocktakes_pkey PRIMARY KEY (id);


--
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (id);


--
-- Name: system_parameters system_parameters_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_parameters
    ADD CONSTRAINT system_parameters_pkey PRIMARY KEY (id);


--
-- Name: technician_metrics technician_metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.technician_metrics
    ADD CONSTRAINT technician_metrics_pkey PRIMARY KEY (id);


--
-- Name: tenant_onboardings tenant_onboardings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenant_onboardings
    ADD CONSTRAINT tenant_onboardings_pkey PRIMARY KEY (id);


--
-- Name: tenant_purge_audits tenant_purge_audits_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenant_purge_audits
    ADD CONSTRAINT tenant_purge_audits_pkey PRIMARY KEY (id);


--
-- Name: tenant_settings tenant_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenant_settings
    ADD CONSTRAINT tenant_settings_pkey PRIMARY KEY (id);


--
-- Name: tenant_usage_metrics tenant_usage_metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenant_usage_metrics
    ADD CONSTRAINT tenant_usage_metrics_pkey PRIMARY KEY (id);


--
-- Name: tenants tenants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_pkey PRIMARY KEY (id);


--
-- Name: unit_sets unit_sets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit_sets
    ADD CONSTRAINT unit_sets_pkey PRIMARY KEY (id);


--
-- Name: units units_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.units
    ADD CONSTRAINT units_pkey PRIMARY KEY (id);


--
-- Name: user_licenses user_licenses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_licenses
    ADD CONSTRAINT user_licenses_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: vehicle_catalog vehicle_catalog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_catalog
    ADD CONSTRAINT vehicle_catalog_pkey PRIMARY KEY (id);


--
-- Name: vehicle_expenses vehicle_expenses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_expenses
    ADD CONSTRAINT vehicle_expenses_pkey PRIMARY KEY (id);


--
-- Name: warehouse_critical_stocks warehouse_critical_stocks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouse_critical_stocks
    ADD CONSTRAINT warehouse_critical_stocks_pkey PRIMARY KEY (id);


--
-- Name: warehouse_stock_thresholds warehouse_stock_thresholds_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouse_stock_thresholds
    ADD CONSTRAINT warehouse_stock_thresholds_pkey PRIMARY KEY (id);


--
-- Name: warehouse_transfer_items warehouse_transfer_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouse_transfer_items
    ADD CONSTRAINT warehouse_transfer_items_pkey PRIMARY KEY (id);


--
-- Name: warehouse_transfer_logs warehouse_transfer_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouse_transfer_logs
    ADD CONSTRAINT warehouse_transfer_logs_pkey PRIMARY KEY (id);


--
-- Name: warehouse_transfers warehouse_transfers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouse_transfers
    ADD CONSTRAINT warehouse_transfers_pkey PRIMARY KEY (id);


--
-- Name: warehouses warehouses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouses
    ADD CONSTRAINT warehouses_pkey PRIMARY KEY (id);


--
-- Name: webhook_endpoints webhook_endpoints_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.webhook_endpoints
    ADD CONSTRAINT webhook_endpoints_pkey PRIMARY KEY (id);


--
-- Name: work_order_activities work_order_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_order_activities
    ADD CONSTRAINT work_order_activities_pkey PRIMARY KEY (id);


--
-- Name: work_order_items work_order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_order_items
    ADD CONSTRAINT work_order_items_pkey PRIMARY KEY (id);


--
-- Name: work_order_warranties work_order_warranties_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_order_warranties
    ADD CONSTRAINT work_order_warranties_pkey PRIMARY KEY (id);


--
-- Name: work_orders work_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_orders
    ADD CONSTRAINT work_orders_pkey PRIMARY KEY (id);


--
-- Name: account_addresses_account_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX account_addresses_account_id_idx ON public.account_addresses USING btree (account_id);


--
-- Name: account_addresses_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "account_addresses_tenantId_idx" ON public.account_addresses USING btree ("tenantId");


--
-- Name: account_banks_account_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX account_banks_account_id_idx ON public.account_banks USING btree (account_id);


--
-- Name: account_banks_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "account_banks_tenantId_idx" ON public.account_banks USING btree ("tenantId");


--
-- Name: account_contacts_account_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX account_contacts_account_id_idx ON public.account_contacts USING btree (account_id);


--
-- Name: account_contacts_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "account_contacts_tenantId_idx" ON public.account_contacts USING btree ("tenantId");


--
-- Name: account_movements_account_id_date_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX account_movements_account_id_date_idx ON public.account_movements USING btree (account_id, date);


--
-- Name: account_movements_invoice_id_is_reversed_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX account_movements_invoice_id_is_reversed_idx ON public.account_movements USING btree (invoice_id, is_reversed);


--
-- Name: account_movements_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "account_movements_tenantId_idx" ON public.account_movements USING btree ("tenantId");


--
-- Name: account_transactions_account_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX account_transactions_account_id_idx ON public.account_transactions USING btree (account_id);


--
-- Name: account_transactions_source_type_source_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX account_transactions_source_type_source_id_idx ON public.account_transactions USING btree (source_type, source_id);


--
-- Name: account_transactions_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "account_transactions_tenantId_idx" ON public.account_transactions USING btree ("tenantId");


--
-- Name: accounts_code_tenantId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "accounts_code_tenantId_key" ON public.accounts USING btree (code, "tenantId");


--
-- Name: accounts_tenantId_code_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "accounts_tenantId_code_idx" ON public.accounts USING btree ("tenantId", code);


--
-- Name: accounts_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "accounts_tenantId_idx" ON public.accounts USING btree ("tenantId");


--
-- Name: advance_settlements_advance_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX advance_settlements_advance_id_idx ON public.advance_settlements USING btree (advance_id);


--
-- Name: advance_settlements_salary_plan_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX advance_settlements_salary_plan_id_idx ON public.advance_settlements USING btree (salary_plan_id);


--
-- Name: advance_settlements_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "advance_settlements_tenantId_idx" ON public.advance_settlements USING btree ("tenantId");


--
-- Name: advances_date_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX advances_date_idx ON public.advances USING btree (date);


--
-- Name: advances_employee_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX advances_employee_id_idx ON public.advances USING btree (employee_id);


--
-- Name: advances_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "advances_tenantId_idx" ON public.advances USING btree ("tenantId");


--
-- Name: api_keys_key_hash_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX api_keys_key_hash_key ON public.api_keys USING btree (key_hash);


--
-- Name: api_keys_key_prefix_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_keys_key_prefix_idx ON public.api_keys USING btree (key_prefix);


--
-- Name: api_keys_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX api_keys_tenant_id_idx ON public.api_keys USING btree (tenant_id);


--
-- Name: asset_assignments_employee_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX asset_assignments_employee_id_idx ON public.asset_assignments USING btree (employee_id);


--
-- Name: asset_assignments_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX asset_assignments_tenant_id_idx ON public.asset_assignments USING btree (tenant_id);


--
-- Name: audit_logs_action_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX audit_logs_action_idx ON public.audit_logs USING btree (action);


--
-- Name: audit_logs_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "audit_logs_createdAt_idx" ON public.audit_logs USING btree ("createdAt");


--
-- Name: audit_logs_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "audit_logs_tenantId_idx" ON public.audit_logs USING btree ("tenantId");


--
-- Name: audit_logs_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "audit_logs_userId_idx" ON public.audit_logs USING btree ("userId");


--
-- Name: b2b_account_movements_tenantId_customerId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "b2b_account_movements_tenantId_customerId_idx" ON public.b2b_account_movements USING btree ("tenantId", "customerId");


--
-- Name: b2b_account_movements_tenantId_date_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "b2b_account_movements_tenantId_date_idx" ON public.b2b_account_movements USING btree ("tenantId", date);


--
-- Name: b2b_account_movements_tenantId_erpMovementId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "b2b_account_movements_tenantId_erpMovementId_key" ON public.b2b_account_movements USING btree ("tenantId", "erpMovementId");


--
-- Name: b2b_advertisements_tenantId_isActive_displayOrder_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "b2b_advertisements_tenantId_isActive_displayOrder_idx" ON public.b2b_advertisements USING btree ("tenantId", "isActive", "displayOrder");


--
-- Name: b2b_cart_items_cartId_productId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "b2b_cart_items_cartId_productId_key" ON public.b2b_cart_items USING btree ("cartId", "productId");


--
-- Name: b2b_cart_items_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "b2b_cart_items_tenantId_idx" ON public.b2b_cart_items USING btree ("tenantId");


--
-- Name: b2b_carts_tenantId_customerId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "b2b_carts_tenantId_customerId_key" ON public.b2b_carts USING btree ("tenantId", "customerId");


--
-- Name: b2b_carts_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "b2b_carts_tenantId_idx" ON public.b2b_carts USING btree ("tenantId");


--
-- Name: b2b_customer_classes_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "b2b_customer_classes_tenantId_idx" ON public.b2b_customer_classes USING btree ("tenantId");


--
-- Name: b2b_customer_classes_tenantId_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "b2b_customer_classes_tenantId_name_key" ON public.b2b_customer_classes USING btree ("tenantId", name);


--
-- Name: b2b_customers_tenantId_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "b2b_customers_tenantId_email_key" ON public.b2b_customers USING btree ("tenantId", email);


--
-- Name: b2b_customers_tenantId_erpAccountId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "b2b_customers_tenantId_erpAccountId_key" ON public.b2b_customers USING btree ("tenantId", "erpAccountId");


--
-- Name: b2b_customers_tenantId_isActive_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "b2b_customers_tenantId_isActive_idx" ON public.b2b_customers USING btree ("tenantId", "isActive");


--
-- Name: b2b_delivery_methods_tenantId_isActive_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "b2b_delivery_methods_tenantId_isActive_idx" ON public.b2b_delivery_methods USING btree ("tenantId", "isActive");


--
-- Name: b2b_discount_groups_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "b2b_discount_groups_tenantId_idx" ON public.b2b_discount_groups USING btree ("tenantId");


--
-- Name: b2b_discount_groups_tenantId_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "b2b_discount_groups_tenantId_name_key" ON public.b2b_discount_groups USING btree ("tenantId", name);


--
-- Name: b2b_discounts_tenantId_isActive_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "b2b_discounts_tenantId_isActive_idx" ON public.b2b_discounts USING btree ("tenantId", "isActive");


--
-- Name: b2b_domains_domain_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX b2b_domains_domain_key ON public.b2b_domains USING btree (domain);


--
-- Name: b2b_domains_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "b2b_domains_tenantId_idx" ON public.b2b_domains USING btree ("tenantId");


--
-- Name: b2b_licenses_tenantId_isActive_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "b2b_licenses_tenantId_isActive_idx" ON public.b2b_licenses USING btree ("tenantId", "isActive");


--
-- Name: b2b_licenses_tenantId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "b2b_licenses_tenantId_key" ON public.b2b_licenses USING btree ("tenantId");


--
-- Name: b2b_notifications_tenantId_customerId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "b2b_notifications_tenantId_customerId_idx" ON public.b2b_notifications USING btree ("tenantId", "customerId");


--
-- Name: b2b_order_items_tenantId_orderId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "b2b_order_items_tenantId_orderId_idx" ON public.b2b_order_items USING btree ("tenantId", "orderId");


--
-- Name: b2b_orders_tenantId_customerId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "b2b_orders_tenantId_customerId_idx" ON public.b2b_orders USING btree ("tenantId", "customerId");


--
-- Name: b2b_orders_tenantId_orderNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "b2b_orders_tenantId_orderNumber_key" ON public.b2b_orders USING btree ("tenantId", "orderNumber");


--
-- Name: b2b_orders_tenantId_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "b2b_orders_tenantId_status_idx" ON public.b2b_orders USING btree ("tenantId", status);


--
-- Name: b2b_products_tenantId_erpProductId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "b2b_products_tenantId_erpProductId_key" ON public.b2b_products USING btree ("tenantId", "erpProductId");


--
-- Name: b2b_products_tenantId_isVisibleInB2B_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "b2b_products_tenantId_isVisibleInB2B_idx" ON public.b2b_products USING btree ("tenantId", "isVisibleInB2B");


--
-- Name: b2b_products_tenantId_stockCode_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "b2b_products_tenantId_stockCode_key" ON public.b2b_products USING btree ("tenantId", "stockCode");


--
-- Name: b2b_salespersons_tenantId_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "b2b_salespersons_tenantId_email_key" ON public.b2b_salespersons USING btree ("tenantId", email);


--
-- Name: b2b_salespersons_tenantId_isActive_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "b2b_salespersons_tenantId_isActive_idx" ON public.b2b_salespersons USING btree ("tenantId", "isActive");


--
-- Name: b2b_stocks_tenantId_productId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "b2b_stocks_tenantId_productId_idx" ON public.b2b_stocks USING btree ("tenantId", "productId");


--
-- Name: b2b_stocks_tenantId_productId_warehouseId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "b2b_stocks_tenantId_productId_warehouseId_key" ON public.b2b_stocks USING btree ("tenantId", "productId", "warehouseId");


--
-- Name: b2b_sync_logs_tenantId_syncType_status_startedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "b2b_sync_logs_tenantId_syncType_status_startedAt_idx" ON public.b2b_sync_logs USING btree ("tenantId", "syncType", status, "startedAt");


--
-- Name: b2b_sync_loops_tenant_id_sync_type_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX b2b_sync_loops_tenant_id_sync_type_key ON public.b2b_sync_loops USING btree (tenant_id, sync_type);


--
-- Name: b2b_tenant_configs_domain_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX b2b_tenant_configs_domain_key ON public.b2b_tenant_configs USING btree (domain);


--
-- Name: b2b_tenant_configs_schemaName_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "b2b_tenant_configs_schemaName_key" ON public.b2b_tenant_configs USING btree ("schemaName");


--
-- Name: b2b_tenant_configs_tenantId_isActive_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "b2b_tenant_configs_tenantId_isActive_idx" ON public.b2b_tenant_configs USING btree ("tenantId", "isActive");


--
-- Name: b2b_tenant_configs_tenantId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "b2b_tenant_configs_tenantId_key" ON public.b2b_tenant_configs USING btree ("tenantId");


--
-- Name: b2b_warehouse_configs_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "b2b_warehouse_configs_tenantId_idx" ON public.b2b_warehouse_configs USING btree ("tenantId");


--
-- Name: b2b_warehouse_configs_tenantId_warehouseId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "b2b_warehouse_configs_tenantId_warehouseId_key" ON public.b2b_warehouse_configs USING btree ("tenantId", "warehouseId");


--
-- Name: bank_account_movements_bank_account_id_date_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX bank_account_movements_bank_account_id_date_idx ON public.bank_account_movements USING btree (bank_account_id, date);


--
-- Name: bank_account_movements_movement_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX bank_account_movements_movement_type_idx ON public.bank_account_movements USING btree (movement_type);


--
-- Name: bank_account_movements_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX bank_account_movements_tenant_id_idx ON public.bank_account_movements USING btree (tenant_id);


--
-- Name: bank_accounts_bank_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX bank_accounts_bank_id_idx ON public.bank_accounts USING btree (bank_id);


--
-- Name: bank_accounts_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX bank_accounts_code_key ON public.bank_accounts USING btree (code);


--
-- Name: bank_accounts_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "bank_accounts_tenantId_idx" ON public.bank_accounts USING btree ("tenantId");


--
-- Name: bank_accounts_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX bank_accounts_type_idx ON public.bank_accounts USING btree (type);


--
-- Name: bank_loan_plans_loan_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX bank_loan_plans_loan_id_idx ON public.bank_loan_plans USING btree (loan_id);


--
-- Name: bank_loan_plans_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "bank_loan_plans_tenantId_idx" ON public.bank_loan_plans USING btree ("tenantId");


--
-- Name: bank_loans_bank_account_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX bank_loans_bank_account_id_idx ON public.bank_loans USING btree (bank_account_id);


--
-- Name: bank_loans_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "bank_loans_tenantId_idx" ON public.bank_loans USING btree ("tenantId");


--
-- Name: bank_transfer_logs_bank_transfer_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX bank_transfer_logs_bank_transfer_id_idx ON public.bank_transfer_logs USING btree (bank_transfer_id);


--
-- Name: bank_transfer_logs_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX bank_transfer_logs_user_id_idx ON public.bank_transfer_logs USING btree (user_id);


--
-- Name: bank_transfers_account_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX bank_transfers_account_id_idx ON public.bank_transfers USING btree (account_id);


--
-- Name: bank_transfers_cashbox_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX bank_transfers_cashbox_id_idx ON public.bank_transfers USING btree (cashbox_id);


--
-- Name: bank_transfers_date_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX bank_transfers_date_idx ON public.bank_transfers USING btree (date);


--
-- Name: bank_transfers_tenantId_date_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "bank_transfers_tenantId_date_idx" ON public.bank_transfers USING btree ("tenantId", date);


--
-- Name: bank_transfers_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "bank_transfers_tenantId_idx" ON public.bank_transfers USING btree ("tenantId");


--
-- Name: bank_transfers_transfer_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX bank_transfers_transfer_type_idx ON public.bank_transfers USING btree (transfer_type);


--
-- Name: banks_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "banks_tenantId_idx" ON public.banks USING btree ("tenantId");


--
-- Name: brands_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX brands_tenant_id_idx ON public.brands USING btree (tenant_id);


--
-- Name: brands_tenant_id_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX brands_tenant_id_name_key ON public.brands USING btree (tenant_id, name);


--
-- Name: brands_tenant_id_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX brands_tenant_id_slug_key ON public.brands USING btree (tenant_id, slug);


--
-- Name: cashbox_movements_account_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX cashbox_movements_account_id_idx ON public.cashbox_movements USING btree (account_id);


--
-- Name: cashbox_movements_cashbox_id_date_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX cashbox_movements_cashbox_id_date_idx ON public.cashbox_movements USING btree (cashbox_id, date);


--
-- Name: cashbox_movements_is_transferred_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX cashbox_movements_is_transferred_idx ON public.cashbox_movements USING btree (is_transferred);


--
-- Name: cashbox_movements_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX cashbox_movements_tenant_id_idx ON public.cashbox_movements USING btree (tenant_id);


--
-- Name: cashboxes_code_tenantId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "cashboxes_code_tenantId_key" ON public.cashboxes USING btree (code, "tenantId");


--
-- Name: cashboxes_is_active_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX cashboxes_is_active_idx ON public.cashboxes USING btree (is_active);


--
-- Name: cashboxes_tenantId_code_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "cashboxes_tenantId_code_idx" ON public.cashboxes USING btree ("tenantId", code);


--
-- Name: cashboxes_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "cashboxes_tenantId_idx" ON public.cashboxes USING btree ("tenantId");


--
-- Name: cashboxes_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX cashboxes_type_idx ON public.cashboxes USING btree (type);


--
-- Name: categories_parent_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX categories_parent_id_idx ON public.categories USING btree (parent_id);


--
-- Name: categories_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX categories_tenant_id_idx ON public.categories USING btree (tenant_id);


--
-- Name: categories_tenant_id_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX categories_tenant_id_slug_key ON public.categories USING btree (tenant_id, slug);


--
-- Name: check_bill_approval_workflows_tenant_id_check_bill_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX check_bill_approval_workflows_tenant_id_check_bill_id_idx ON public.check_bill_approval_workflows USING btree (tenant_id, check_bill_id);


--
-- Name: check_bill_approval_workflows_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX check_bill_approval_workflows_tenant_id_idx ON public.check_bill_approval_workflows USING btree (tenant_id);


--
-- Name: check_bill_approval_workflows_tenant_id_journal_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX check_bill_approval_workflows_tenant_id_journal_id_idx ON public.check_bill_approval_workflows USING btree (tenant_id, journal_id);


--
-- Name: check_bill_bank_submissions_tenant_id_check_bill_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX check_bill_bank_submissions_tenant_id_check_bill_id_idx ON public.check_bill_bank_submissions USING btree (tenant_id, check_bill_id);


--
-- Name: check_bill_bank_submissions_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX check_bill_bank_submissions_tenant_id_idx ON public.check_bill_bank_submissions USING btree (tenant_id);


--
-- Name: check_bill_collections_check_bill_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX check_bill_collections_check_bill_id_idx ON public.check_bill_collections USING btree (check_bill_id);


--
-- Name: check_bill_collections_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "check_bill_collections_tenantId_idx" ON public.check_bill_collections USING btree ("tenantId");


--
-- Name: check_bill_discounting_tenant_id_check_bill_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX check_bill_discounting_tenant_id_check_bill_id_idx ON public.check_bill_discounting USING btree (tenant_id, check_bill_id);


--
-- Name: check_bill_discounting_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX check_bill_discounting_tenant_id_idx ON public.check_bill_discounting USING btree (tenant_id);


--
-- Name: check_bill_endorsements_check_bill_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX check_bill_endorsements_check_bill_id_idx ON public.check_bill_endorsements USING btree (check_bill_id);


--
-- Name: check_bill_endorsements_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "check_bill_endorsements_tenantId_idx" ON public.check_bill_endorsements USING btree ("tenantId");


--
-- Name: check_bill_gl_entries_tenant_id_check_bill_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX check_bill_gl_entries_tenant_id_check_bill_id_idx ON public.check_bill_gl_entries USING btree (tenant_id, check_bill_id);


--
-- Name: check_bill_gl_entries_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX check_bill_gl_entries_tenant_id_idx ON public.check_bill_gl_entries USING btree (tenant_id);


--
-- Name: check_bill_gl_entries_tenant_id_journal_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX check_bill_gl_entries_tenant_id_journal_id_idx ON public.check_bill_gl_entries USING btree (tenant_id, journal_id);


--
-- Name: check_bill_gl_entries_tenant_id_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX check_bill_gl_entries_tenant_id_status_idx ON public.check_bill_gl_entries USING btree (tenant_id, status);


--
-- Name: check_bill_journal_items_check_bill_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX check_bill_journal_items_check_bill_id_idx ON public.check_bill_journal_items USING btree (check_bill_id);


--
-- Name: check_bill_journal_items_journal_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX check_bill_journal_items_journal_id_idx ON public.check_bill_journal_items USING btree (journal_id);


--
-- Name: check_bill_journal_items_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "check_bill_journal_items_tenantId_idx" ON public.check_bill_journal_items USING btree ("tenantId");


--
-- Name: check_bill_journals_tenantId_date_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "check_bill_journals_tenantId_date_idx" ON public.check_bill_journals USING btree ("tenantId", date);


--
-- Name: check_bill_journals_tenantId_journal_no_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "check_bill_journals_tenantId_journal_no_key" ON public.check_bill_journals USING btree ("tenantId", journal_no);


--
-- Name: check_bill_journals_tenantId_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "check_bill_journals_tenantId_status_idx" ON public.check_bill_journals USING btree ("tenantId", status);


--
-- Name: check_bill_logs_check_bill_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX check_bill_logs_check_bill_id_idx ON public.check_bill_logs USING btree (check_bill_id);


--
-- Name: check_bill_logs_tenantId_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "check_bill_logs_tenantId_createdAt_idx" ON public.check_bill_logs USING btree ("tenantId", "createdAt");


--
-- Name: check_bill_logs_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "check_bill_logs_tenantId_idx" ON public.check_bill_logs USING btree ("tenantId");


--
-- Name: check_bill_logs_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX check_bill_logs_user_id_idx ON public.check_bill_logs USING btree (user_id);


--
-- Name: check_bill_protest_tracking_tenant_id_check_bill_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX check_bill_protest_tracking_tenant_id_check_bill_id_idx ON public.check_bill_protest_tracking USING btree (tenant_id, check_bill_id);


--
-- Name: check_bill_protest_tracking_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX check_bill_protest_tracking_tenant_id_idx ON public.check_bill_protest_tracking USING btree (tenant_id);


--
-- Name: check_bill_reconciliation_tenant_id_check_bill_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX check_bill_reconciliation_tenant_id_check_bill_id_idx ON public.check_bill_reconciliation USING btree (tenant_id, check_bill_id);


--
-- Name: check_bill_reconciliation_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX check_bill_reconciliation_tenant_id_idx ON public.check_bill_reconciliation USING btree (tenant_id);


--
-- Name: check_bill_reminders_tenant_id_check_bill_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX check_bill_reminders_tenant_id_check_bill_id_idx ON public.check_bill_reminders USING btree (tenant_id, check_bill_id);


--
-- Name: check_bill_reminders_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX check_bill_reminders_tenant_id_idx ON public.check_bill_reminders USING btree (tenant_id);


--
-- Name: check_bill_reminders_tenant_id_scheduled_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX check_bill_reminders_tenant_id_scheduled_at_idx ON public.check_bill_reminders USING btree (tenant_id, scheduled_at);


--
-- Name: check_bill_risk_limits_tenant_id_account_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX check_bill_risk_limits_tenant_id_account_id_idx ON public.check_bill_risk_limits USING btree (tenant_id, account_id);


--
-- Name: check_bill_risk_limits_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX check_bill_risk_limits_tenant_id_idx ON public.check_bill_risk_limits USING btree (tenant_id);


--
-- Name: checks_bills_account_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX checks_bills_account_id_idx ON public.checks_bills USING btree (account_id);


--
-- Name: checks_bills_due_date_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX checks_bills_due_date_idx ON public.checks_bills USING btree (due_date);


--
-- Name: checks_bills_portfolio_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX checks_bills_portfolio_type_idx ON public.checks_bills USING btree (portfolio_type);


--
-- Name: checks_bills_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX checks_bills_status_idx ON public.checks_bills USING btree (status);


--
-- Name: checks_bills_tenantId_currency_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "checks_bills_tenantId_currency_idx" ON public.checks_bills USING btree ("tenantId", currency);


--
-- Name: checks_bills_tenantId_due_date_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "checks_bills_tenantId_due_date_idx" ON public.checks_bills USING btree ("tenantId", due_date);


--
-- Name: checks_bills_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "checks_bills_tenantId_idx" ON public.checks_bills USING btree ("tenantId");


--
-- Name: checks_bills_tenantId_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "checks_bills_tenantId_status_idx" ON public.checks_bills USING btree ("tenantId", status);


--
-- Name: checks_bills_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX checks_bills_type_idx ON public.checks_bills USING btree (type);


--
-- Name: code_templates_module_tenantId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "code_templates_module_tenantId_key" ON public.code_templates USING btree (module, "tenantId");


--
-- Name: collections_tenantId_date_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "collections_tenantId_date_idx" ON public.collections USING btree ("tenantId", date);


--
-- Name: collections_tenantId_deleted_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "collections_tenantId_deleted_at_idx" ON public.collections USING btree ("tenantId", deleted_at);


--
-- Name: collections_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "collections_tenantId_idx" ON public.collections USING btree ("tenantId");


--
-- Name: company_credit_card_movements_card_id_date_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX company_credit_card_movements_card_id_date_idx ON public.company_credit_card_movements USING btree (card_id, date);


--
-- Name: company_credit_card_movements_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "company_credit_card_movements_tenantId_idx" ON public.company_credit_card_movements USING btree ("tenantId");


--
-- Name: company_credit_card_reminders_card_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX company_credit_card_reminders_card_id_idx ON public.company_credit_card_reminders USING btree (card_id);


--
-- Name: company_credit_card_reminders_card_id_type_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX company_credit_card_reminders_card_id_type_key ON public.company_credit_card_reminders USING btree (card_id, type);


--
-- Name: company_credit_card_reminders_day_is_active_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX company_credit_card_reminders_day_is_active_idx ON public.company_credit_card_reminders USING btree (day, is_active);


--
-- Name: company_credit_card_reminders_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "company_credit_card_reminders_tenantId_idx" ON public.company_credit_card_reminders USING btree ("tenantId");


--
-- Name: company_credit_cards_cashbox_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX company_credit_cards_cashbox_id_idx ON public.company_credit_cards USING btree (cashbox_id);


--
-- Name: company_credit_cards_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX company_credit_cards_code_key ON public.company_credit_cards USING btree (code);


--
-- Name: company_credit_cards_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "company_credit_cards_tenantId_idx" ON public.company_credit_cards USING btree ("tenantId");


--
-- Name: company_vehicles_assigned_employee_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX company_vehicles_assigned_employee_id_idx ON public.company_vehicles USING btree (assigned_employee_id);


--
-- Name: company_vehicles_plate_tenantId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "company_vehicles_plate_tenantId_key" ON public.company_vehicles USING btree (plate, "tenantId");


--
-- Name: company_vehicles_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "company_vehicles_tenantId_idx" ON public.company_vehicles USING btree ("tenantId");


--
-- Name: coupon_redemptions_coupon_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX coupon_redemptions_coupon_id_idx ON public.coupon_redemptions USING btree (coupon_id);


--
-- Name: coupon_redemptions_coupon_id_tenant_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX coupon_redemptions_coupon_id_tenant_id_key ON public.coupon_redemptions USING btree (coupon_id, tenant_id);


--
-- Name: coupon_redemptions_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX coupon_redemptions_tenant_id_idx ON public.coupon_redemptions USING btree (tenant_id);


--
-- Name: coupons_code_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX coupons_code_idx ON public.coupons USING btree (code);


--
-- Name: coupons_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX coupons_code_key ON public.coupons USING btree (code);


--
-- Name: coupons_is_active_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX coupons_is_active_idx ON public.coupons USING btree (is_active);


--
-- Name: coupons_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "coupons_tenantId_idx" ON public.coupons USING btree ("tenantId");


--
-- Name: customer_vehicles_account_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX customer_vehicles_account_id_idx ON public.customer_vehicles USING btree (account_id);


--
-- Name: customer_vehicles_chassis_no_tenantId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "customer_vehicles_chassis_no_tenantId_key" ON public.customer_vehicles USING btree (chassis_no, "tenantId");


--
-- Name: customer_vehicles_plate_tenantId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "customer_vehicles_plate_tenantId_key" ON public.customer_vehicles USING btree (plate, "tenantId");


--
-- Name: customer_vehicles_service_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX customer_vehicles_service_status_idx ON public.customer_vehicles USING btree (service_status);


--
-- Name: customer_vehicles_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "customer_vehicles_tenantId_idx" ON public.customer_vehicles USING btree ("tenantId");


--
-- Name: customer_vehicles_vehicle_catalog_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX customer_vehicles_vehicle_catalog_id_idx ON public.customer_vehicles USING btree (vehicle_catalog_id);


--
-- Name: deleted_bank_transfers_account_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX deleted_bank_transfers_account_id_idx ON public.deleted_bank_transfers USING btree (account_id);


--
-- Name: deleted_bank_transfers_cashbox_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX deleted_bank_transfers_cashbox_id_idx ON public.deleted_bank_transfers USING btree (cashbox_id);


--
-- Name: deleted_bank_transfers_deleted_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX deleted_bank_transfers_deleted_at_idx ON public.deleted_bank_transfers USING btree (deleted_at);


--
-- Name: deleted_bank_transfers_original_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX deleted_bank_transfers_original_id_idx ON public.deleted_bank_transfers USING btree (original_id);


--
-- Name: deleted_checks_bills_account_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX deleted_checks_bills_account_id_idx ON public.deleted_checks_bills USING btree (account_id);


--
-- Name: deleted_checks_bills_deleted_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX deleted_checks_bills_deleted_at_idx ON public.deleted_checks_bills USING btree (deleted_at);


--
-- Name: deleted_checks_bills_original_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX deleted_checks_bills_original_id_idx ON public.deleted_checks_bills USING btree (original_id);


--
-- Name: deleted_checks_bills_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "deleted_checks_bills_tenantId_idx" ON public.deleted_checks_bills USING btree ("tenantId");


--
-- Name: departments_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX departments_tenant_id_idx ON public.departments USING btree (tenant_id);


--
-- Name: departments_tenant_id_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX departments_tenant_id_name_key ON public.departments USING btree (tenant_id, name);


--
-- Name: einvoice_inbox_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "einvoice_inbox_createdAt_idx" ON public.einvoice_inbox USING btree ("createdAt");


--
-- Name: einvoice_inbox_ettn_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX einvoice_inbox_ettn_key ON public.einvoice_inbox USING btree (ettn);


--
-- Name: einvoice_inbox_matched_invoice_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX einvoice_inbox_matched_invoice_id_idx ON public.einvoice_inbox USING btree (matched_invoice_id);


--
-- Name: einvoice_inbox_senderVkn_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "einvoice_inbox_senderVkn_idx" ON public.einvoice_inbox USING btree ("senderVkn");


--
-- Name: einvoice_inbox_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX einvoice_inbox_status_idx ON public.einvoice_inbox USING btree (status);


--
-- Name: einvoice_inbox_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX einvoice_inbox_tenant_id_idx ON public.einvoice_inbox USING btree (tenant_id);


--
-- Name: einvoice_sends_ettn_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX einvoice_sends_ettn_idx ON public.einvoice_sends USING btree (ettn);


--
-- Name: einvoice_sends_ettn_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX einvoice_sends_ettn_key ON public.einvoice_sends USING btree (ettn);


--
-- Name: einvoice_sends_invoice_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX einvoice_sends_invoice_id_key ON public.einvoice_sends USING btree (invoice_id);


--
-- Name: einvoice_sends_sent_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX einvoice_sends_sent_at_idx ON public.einvoice_sends USING btree (sent_at);


--
-- Name: einvoice_sends_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX einvoice_sends_status_idx ON public.einvoice_sends USING btree (status);


--
-- Name: einvoice_sends_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX einvoice_sends_tenant_id_idx ON public.einvoice_sends USING btree (tenant_id);


--
-- Name: einvoice_tenant_configs_tenant_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX einvoice_tenant_configs_tenant_id_key ON public.einvoice_tenant_configs USING btree (tenant_id);


--
-- Name: einvoice_xml_invoice_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX einvoice_xml_invoice_id_key ON public.einvoice_xml USING btree (invoice_id);


--
-- Name: einvoice_xml_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "einvoice_xml_tenantId_idx" ON public.einvoice_xml USING btree ("tenantId");


--
-- Name: employee_payments_date_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX employee_payments_date_idx ON public.employee_payments USING btree (date);


--
-- Name: employee_payments_employee_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX employee_payments_employee_id_idx ON public.employee_payments USING btree (employee_id);


--
-- Name: employee_payments_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "employee_payments_tenantId_idx" ON public.employee_payments USING btree ("tenantId");


--
-- Name: employee_payments_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX employee_payments_type_idx ON public.employee_payments USING btree (type);


--
-- Name: employees_department_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX employees_department_idx ON public.employees USING btree (department);


--
-- Name: employees_employee_code_tenantId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "employees_employee_code_tenantId_key" ON public.employees USING btree (employee_code, "tenantId");


--
-- Name: employees_identity_number_tenantId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "employees_identity_number_tenantId_key" ON public.employees USING btree (identity_number, "tenantId");


--
-- Name: employees_is_active_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX employees_is_active_idx ON public.employees USING btree (is_active);


--
-- Name: employees_tenantId_employee_code_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "employees_tenantId_employee_code_idx" ON public.employees USING btree ("tenantId", employee_code);


--
-- Name: employees_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "employees_tenantId_idx" ON public.employees USING btree ("tenantId");


--
-- Name: equivalency_groups_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "equivalency_groups_tenantId_idx" ON public.equivalency_groups USING btree ("tenantId");


--
-- Name: expense_categories_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "expense_categories_tenantId_idx" ON public.expense_categories USING btree ("tenantId");


--
-- Name: expense_categories_tenantId_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "expense_categories_tenantId_name_key" ON public.expense_categories USING btree ("tenantId", name);


--
-- Name: expenses_tenantId_date_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "expenses_tenantId_date_idx" ON public.expenses USING btree ("tenantId", date);


--
-- Name: expenses_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "expenses_tenantId_idx" ON public.expenses USING btree ("tenantId");


--
-- Name: feature_flags_tenant_id_flag_key_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX feature_flags_tenant_id_flag_key_key ON public.feature_flags USING btree (tenant_id, flag_key);


--
-- Name: feature_flags_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX feature_flags_tenant_id_idx ON public.feature_flags USING btree (tenant_id);


--
-- Name: hizli_tokens_expiresAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "hizli_tokens_expiresAt_idx" ON public.hizli_tokens USING btree ("expiresAt");


--
-- Name: hizli_tokens_loginHash_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "hizli_tokens_loginHash_idx" ON public.hizli_tokens USING btree ("loginHash");


--
-- Name: inventory_transactions_partRequestId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "inventory_transactions_partRequestId_idx" ON public.inventory_transactions USING btree ("partRequestId");


--
-- Name: inventory_transactions_product_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX inventory_transactions_product_id_idx ON public.inventory_transactions USING btree (product_id);


--
-- Name: inventory_transactions_tenantId_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "inventory_transactions_tenantId_createdAt_idx" ON public.inventory_transactions USING btree ("tenantId", "createdAt");


--
-- Name: inventory_transactions_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "inventory_transactions_tenantId_idx" ON public.inventory_transactions USING btree ("tenantId");


--
-- Name: invitations_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX invitations_email_idx ON public.invitations USING btree (email);


--
-- Name: invitations_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX invitations_status_idx ON public.invitations USING btree (status);


--
-- Name: invitations_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "invitations_tenantId_idx" ON public.invitations USING btree ("tenantId");


--
-- Name: invitations_token_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX invitations_token_idx ON public.invitations USING btree (token);


--
-- Name: invitations_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX invitations_token_key ON public.invitations USING btree (token);


--
-- Name: invoice_collections_invoice_id_collection_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX invoice_collections_invoice_id_collection_id_key ON public.invoice_collections USING btree (invoice_id, collection_id);


--
-- Name: invoice_collections_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "invoice_collections_tenantId_idx" ON public.invoice_collections USING btree ("tenantId");


--
-- Name: invoice_items_invoice_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX invoice_items_invoice_id_idx ON public.invoice_items USING btree (invoice_id);


--
-- Name: invoice_items_product_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX invoice_items_product_id_idx ON public.invoice_items USING btree (product_id);


--
-- Name: invoice_items_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "invoice_items_tenantId_idx" ON public.invoice_items USING btree ("tenantId");


--
-- Name: invoice_logs_invoice_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX invoice_logs_invoice_id_idx ON public.invoice_logs USING btree (invoice_id);


--
-- Name: invoice_logs_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "invoice_logs_tenantId_idx" ON public.invoice_logs USING btree ("tenantId");


--
-- Name: invoice_logs_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX invoice_logs_user_id_idx ON public.invoice_logs USING btree (user_id);


--
-- Name: invoice_payment_plans_invoice_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX invoice_payment_plans_invoice_id_idx ON public.invoice_payment_plans USING btree (invoice_id);


--
-- Name: invoice_payment_plans_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "invoice_payment_plans_tenantId_idx" ON public.invoice_payment_plans USING btree ("tenantId");


--
-- Name: invoice_profit_invoice_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX invoice_profit_invoice_id_idx ON public.invoice_profit USING btree (invoice_id);


--
-- Name: invoice_profit_invoice_item_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX invoice_profit_invoice_item_id_idx ON public.invoice_profit USING btree (invoice_item_id);


--
-- Name: invoice_profit_product_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX invoice_profit_product_id_idx ON public.invoice_profit USING btree (product_id);


--
-- Name: invoice_profit_tenantId_invoice_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "invoice_profit_tenantId_invoice_id_idx" ON public.invoice_profit USING btree ("tenantId", invoice_id);


--
-- Name: invoices_account_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX invoices_account_id_idx ON public.invoices USING btree (account_id);


--
-- Name: invoices_delivery_note_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX invoices_delivery_note_id_idx ON public.invoices USING btree (delivery_note_id);


--
-- Name: invoices_einvoice_ettn_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX invoices_einvoice_ettn_key ON public.invoices USING btree (einvoice_ettn);


--
-- Name: invoices_invoice_no_tenantId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "invoices_invoice_no_tenantId_key" ON public.invoices USING btree (invoice_no, "tenantId");


--
-- Name: invoices_procurement_order_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX invoices_procurement_order_id_key ON public.invoices USING btree (procurement_order_id);


--
-- Name: invoices_purchase_delivery_note_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX invoices_purchase_delivery_note_id_key ON public.invoices USING btree (purchase_delivery_note_id);


--
-- Name: invoices_purchase_order_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX invoices_purchase_order_id_key ON public.invoices USING btree (purchase_order_id);


--
-- Name: invoices_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX invoices_status_idx ON public.invoices USING btree (status);


--
-- Name: invoices_tenantId_account_id_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "invoices_tenantId_account_id_status_idx" ON public.invoices USING btree ("tenantId", account_id, status);


--
-- Name: invoices_tenantId_date_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "invoices_tenantId_date_idx" ON public.invoices USING btree ("tenantId", date);


--
-- Name: invoices_tenantId_date_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "invoices_tenantId_date_status_idx" ON public.invoices USING btree ("tenantId", date, status);


--
-- Name: invoices_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "invoices_tenantId_idx" ON public.invoices USING btree ("tenantId");


--
-- Name: invoices_tenantId_invoice_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "invoices_tenantId_invoice_type_idx" ON public.invoices USING btree ("tenantId", invoice_type);


--
-- Name: invoices_tenantId_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "invoices_tenantId_status_idx" ON public.invoices USING btree ("tenantId", status);


--
-- Name: invoices_warehouse_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX invoices_warehouse_id_idx ON public.invoices USING btree (warehouse_id);


--
-- Name: journal_entries_entryDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "journal_entries_entryDate_idx" ON public.journal_entries USING btree ("entryDate");


--
-- Name: journal_entries_serviceInvoiceId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "journal_entries_serviceInvoiceId_key" ON public.journal_entries USING btree ("serviceInvoiceId");


--
-- Name: journal_entries_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "journal_entries_tenantId_idx" ON public.journal_entries USING btree ("tenantId");


--
-- Name: journal_entries_tenantId_referenceType_referenceId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "journal_entries_tenantId_referenceType_referenceId_idx" ON public.journal_entries USING btree ("tenantId", "referenceType", "referenceId");


--
-- Name: journal_entry_lines_journalEntryId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "journal_entry_lines_journalEntryId_idx" ON public.journal_entry_lines USING btree ("journalEntryId");


--
-- Name: journal_entry_lines_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "journal_entry_lines_tenantId_idx" ON public.journal_entry_lines USING btree ("tenantId");


--
-- Name: leave_requests_employee_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX leave_requests_employee_id_idx ON public.leave_requests USING btree (employee_id);


--
-- Name: leave_requests_start_date_end_date_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX leave_requests_start_date_end_date_idx ON public.leave_requests USING btree (start_date, end_date);


--
-- Name: leave_requests_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX leave_requests_status_idx ON public.leave_requests USING btree (status);


--
-- Name: leave_requests_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX leave_requests_tenant_id_idx ON public.leave_requests USING btree (tenant_id);


--
-- Name: leave_types_tenant_id_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX leave_types_tenant_id_code_key ON public.leave_types USING btree (tenant_id, code);


--
-- Name: leave_types_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX leave_types_tenant_id_idx ON public.leave_types USING btree (tenant_id);


--
-- Name: locations_barcode_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX locations_barcode_idx ON public.locations USING btree (barcode);


--
-- Name: locations_barcode_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX locations_barcode_key ON public.locations USING btree (barcode);


--
-- Name: locations_code_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX locations_code_idx ON public.locations USING btree (code);


--
-- Name: locations_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX locations_code_key ON public.locations USING btree (code);


--
-- Name: locations_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "locations_tenantId_idx" ON public.locations USING btree ("tenantId");


--
-- Name: locations_warehouseId_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "locations_warehouseId_code_key" ON public.locations USING btree ("warehouseId", code);


--
-- Name: locations_warehouseId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "locations_warehouseId_idx" ON public.locations USING btree ("warehouseId");


--
-- Name: module_licenses_moduleId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "module_licenses_moduleId_idx" ON public.module_licenses USING btree ("moduleId");


--
-- Name: module_licenses_subscriptionId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "module_licenses_subscriptionId_idx" ON public.module_licenses USING btree ("subscriptionId");


--
-- Name: modules_isActive_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "modules_isActive_idx" ON public.modules USING btree ("isActive");


--
-- Name: modules_slug_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX modules_slug_idx ON public.modules USING btree (slug);


--
-- Name: modules_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX modules_slug_key ON public.modules USING btree (slug);


--
-- Name: order_pickings_location_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX order_pickings_location_id_idx ON public.order_pickings USING btree (location_id);


--
-- Name: order_pickings_order_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX order_pickings_order_id_idx ON public.order_pickings USING btree (order_id);


--
-- Name: order_pickings_order_item_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX order_pickings_order_item_id_idx ON public.order_pickings USING btree (order_item_id);


--
-- Name: order_pickings_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "order_pickings_tenantId_idx" ON public.order_pickings USING btree ("tenantId");


--
-- Name: overtime_records_date_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX overtime_records_date_idx ON public.overtime_records USING btree (date);


--
-- Name: overtime_records_employee_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX overtime_records_employee_id_idx ON public.overtime_records USING btree (employee_id);


--
-- Name: overtime_records_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX overtime_records_tenant_id_idx ON public.overtime_records USING btree (tenant_id);


--
-- Name: part_requests_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX part_requests_status_idx ON public.part_requests USING btree (status);


--
-- Name: part_requests_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "part_requests_tenantId_idx" ON public.part_requests USING btree ("tenantId");


--
-- Name: part_requests_workOrderId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "part_requests_workOrderId_idx" ON public.part_requests USING btree ("workOrderId");


--
-- Name: payments_conversationId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "payments_conversationId_idx" ON public.payments USING btree ("conversationId");


--
-- Name: payments_conversationId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "payments_conversationId_key" ON public.payments USING btree ("conversationId");


--
-- Name: payments_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "payments_createdAt_idx" ON public.payments USING btree ("createdAt");


--
-- Name: payments_iyzicoPaymentId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "payments_iyzicoPaymentId_idx" ON public.payments USING btree ("iyzicoPaymentId");


--
-- Name: payments_iyzicoPaymentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "payments_iyzicoPaymentId_key" ON public.payments USING btree ("iyzicoPaymentId");


--
-- Name: payments_iyzicoToken_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "payments_iyzicoToken_key" ON public.payments USING btree ("iyzicoToken");


--
-- Name: payments_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payments_status_idx ON public.payments USING btree (status);


--
-- Name: payments_subscriptionId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "payments_subscriptionId_idx" ON public.payments USING btree ("subscriptionId");


--
-- Name: payments_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "payments_tenantId_idx" ON public.payments USING btree ("tenantId");


--
-- Name: performance_reviews_employee_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX performance_reviews_employee_id_idx ON public.performance_reviews USING btree (employee_id);


--
-- Name: performance_reviews_period_start_period_end_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX performance_reviews_period_start_period_end_idx ON public.performance_reviews USING btree (period_start, period_end);


--
-- Name: performance_reviews_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX performance_reviews_tenant_id_idx ON public.performance_reviews USING btree (tenant_id);


--
-- Name: permissions_module_action_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX permissions_module_action_key ON public.permissions USING btree (module, action);


--
-- Name: plans_isActive_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "plans_isActive_idx" ON public.plans USING btree ("isActive");


--
-- Name: plans_isBasePlan_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "plans_isBasePlan_idx" ON public.plans USING btree ("isBasePlan");


--
-- Name: plans_slug_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX plans_slug_idx ON public.plans USING btree (slug);


--
-- Name: plans_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX plans_slug_key ON public.plans USING btree (slug);


--
-- Name: pos_payments_invoice_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX pos_payments_invoice_id_idx ON public.pos_payments USING btree (invoice_id);


--
-- Name: pos_payments_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "pos_payments_tenantId_idx" ON public.pos_payments USING btree ("tenantId");


--
-- Name: pos_sessions_cashier_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX pos_sessions_cashier_id_idx ON public.pos_sessions USING btree (cashier_id);


--
-- Name: pos_sessions_session_no_tenantId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "pos_sessions_session_no_tenantId_key" ON public.pos_sessions USING btree (session_no, "tenantId");


--
-- Name: pos_sessions_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX pos_sessions_status_idx ON public.pos_sessions USING btree (status);


--
-- Name: pos_sessions_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "pos_sessions_tenantId_idx" ON public.pos_sessions USING btree ("tenantId");


--
-- Name: postal_codes_city_district_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX postal_codes_city_district_idx ON public.postal_codes USING btree (city, district);


--
-- Name: postal_codes_city_district_neighborhood_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX postal_codes_city_district_neighborhood_idx ON public.postal_codes USING btree (city, district, neighborhood);


--
-- Name: postal_codes_city_district_neighborhood_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX postal_codes_city_district_neighborhood_key ON public.postal_codes USING btree (city, district, neighborhood);


--
-- Name: postal_codes_city_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX postal_codes_city_idx ON public.postal_codes USING btree (city);


--
-- Name: postal_codes_district_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX postal_codes_district_idx ON public.postal_codes USING btree (district);


--
-- Name: postal_codes_neighborhood_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX postal_codes_neighborhood_idx ON public.postal_codes USING btree (neighborhood);


--
-- Name: postal_codes_postalCode_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "postal_codes_postalCode_idx" ON public.postal_codes USING btree ("postalCode");


--
-- Name: preventive_maintenances_next_due_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX preventive_maintenances_next_due_at_idx ON public.preventive_maintenances USING btree (next_due_at);


--
-- Name: preventive_maintenances_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX preventive_maintenances_tenant_id_idx ON public.preventive_maintenances USING btree (tenant_id);


--
-- Name: preventive_maintenances_vehicle_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX preventive_maintenances_vehicle_id_idx ON public.preventive_maintenances USING btree (vehicle_id);


--
-- Name: price_cards_product_id_type_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX price_cards_product_id_type_created_at_idx ON public.price_cards USING btree (product_id, type, created_at);


--
-- Name: price_cards_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX price_cards_tenant_id_idx ON public.price_cards USING btree (tenant_id);


--
-- Name: price_cards_tenant_id_updated_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX price_cards_tenant_id_updated_at_idx ON public.price_cards USING btree (tenant_id, updated_at);


--
-- Name: price_list_items_price_list_id_product_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX price_list_items_price_list_id_product_id_key ON public.price_list_items USING btree (price_list_id, product_id);


--
-- Name: price_list_items_product_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX price_list_items_product_id_idx ON public.price_list_items USING btree (product_id);


--
-- Name: price_list_items_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "price_list_items_tenantId_idx" ON public.price_list_items USING btree ("tenantId");


--
-- Name: price_lists_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "price_lists_tenantId_idx" ON public.price_lists USING btree ("tenantId");


--
-- Name: procurement_orders_account_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX procurement_orders_account_id_idx ON public.procurement_orders USING btree (account_id);


--
-- Name: procurement_orders_date_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX procurement_orders_date_idx ON public.procurement_orders USING btree (date);


--
-- Name: procurement_orders_deliveryNoteId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "procurement_orders_deliveryNoteId_key" ON public.procurement_orders USING btree ("deliveryNoteId");


--
-- Name: procurement_orders_order_no_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX procurement_orders_order_no_idx ON public.procurement_orders USING btree (order_no);


--
-- Name: procurement_orders_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX procurement_orders_status_idx ON public.procurement_orders USING btree (status);


--
-- Name: procurement_orders_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "procurement_orders_tenantId_idx" ON public.procurement_orders USING btree ("tenantId");


--
-- Name: product_barcodes_barcode_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX product_barcodes_barcode_idx ON public.product_barcodes USING btree (barcode);


--
-- Name: product_barcodes_barcode_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX product_barcodes_barcode_key ON public.product_barcodes USING btree (barcode);


--
-- Name: product_barcodes_productId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "product_barcodes_productId_idx" ON public.product_barcodes USING btree ("productId");


--
-- Name: product_barcodes_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "product_barcodes_tenantId_idx" ON public.product_barcodes USING btree ("tenantId");


--
-- Name: product_costing_configs_product_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX product_costing_configs_product_id_key ON public.product_costing_configs USING btree (product_id);


--
-- Name: product_costing_configs_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX product_costing_configs_tenant_id_idx ON public.product_costing_configs USING btree (tenant_id);


--
-- Name: product_equivalents_product1_id_product2_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX product_equivalents_product1_id_product2_id_key ON public.product_equivalents USING btree (product1_id, product2_id);


--
-- Name: product_equivalents_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "product_equivalents_tenantId_idx" ON public.product_equivalents USING btree ("tenantId");


--
-- Name: product_location_stocks_locationId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "product_location_stocks_locationId_idx" ON public.product_location_stocks USING btree ("locationId");


--
-- Name: product_location_stocks_productId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "product_location_stocks_productId_idx" ON public.product_location_stocks USING btree ("productId");


--
-- Name: product_location_stocks_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "product_location_stocks_tenantId_idx" ON public.product_location_stocks USING btree ("tenantId");


--
-- Name: product_location_stocks_warehouseId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "product_location_stocks_warehouseId_idx" ON public.product_location_stocks USING btree ("warehouseId");


--
-- Name: product_location_stocks_warehouseId_locationId_productId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "product_location_stocks_warehouseId_locationId_productId_key" ON public.product_location_stocks USING btree ("warehouseId", "locationId", "productId");


--
-- Name: product_lots_expiry_date_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX product_lots_expiry_date_idx ON public.product_lots USING btree (expiry_date);


--
-- Name: product_lots_product_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX product_lots_product_id_idx ON public.product_lots USING btree (product_id);


--
-- Name: product_lots_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX product_lots_tenant_id_idx ON public.product_lots USING btree (tenant_id);


--
-- Name: product_lots_tenant_id_lot_number_product_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX product_lots_tenant_id_lot_number_product_id_key ON public.product_lots USING btree (tenant_id, lot_number, product_id);


--
-- Name: product_lots_warehouse_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX product_lots_warehouse_id_idx ON public.product_lots USING btree (warehouse_id);


--
-- Name: product_movements_invoice_item_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX product_movements_invoice_item_id_idx ON public.product_movements USING btree (invoice_item_id);


--
-- Name: product_movements_is_reversed_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX product_movements_is_reversed_idx ON public.product_movements USING btree (is_reversed);


--
-- Name: product_movements_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "product_movements_tenantId_idx" ON public.product_movements USING btree ("tenantId");


--
-- Name: product_shelves_product_id_shelf_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX product_shelves_product_id_shelf_id_key ON public.product_shelves USING btree (product_id, shelf_id);


--
-- Name: product_shelves_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "product_shelves_tenantId_idx" ON public.product_shelves USING btree ("tenantId");


--
-- Name: product_vehicle_compatibilities_product_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX product_vehicle_compatibilities_product_id_idx ON public.product_vehicle_compatibilities USING btree (product_id);


--
-- Name: product_vehicle_compatibilities_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX product_vehicle_compatibilities_tenant_id_idx ON public.product_vehicle_compatibilities USING btree (tenant_id);


--
-- Name: product_vehicle_compatibilities_tenant_id_vehicle_brand_veh_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX product_vehicle_compatibilities_tenant_id_vehicle_brand_veh_idx ON public.product_vehicle_compatibilities USING btree (tenant_id, vehicle_brand, vehicle_model);


--
-- Name: products_barcode_tenantId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "products_barcode_tenantId_key" ON public.products USING btree (barcode, "tenantId");


--
-- Name: products_brand_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX products_brand_id_idx ON public.products USING btree (brand_id);


--
-- Name: products_category_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX products_category_id_idx ON public.products USING btree (category_id);


--
-- Name: products_code_tenantId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "products_code_tenantId_key" ON public.products USING btree (code, "tenantId");


--
-- Name: products_tenantId_barcode_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "products_tenantId_barcode_idx" ON public.products USING btree ("tenantId", barcode);


--
-- Name: products_tenantId_code_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "products_tenantId_code_idx" ON public.products USING btree ("tenantId", code);


--
-- Name: products_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "products_tenantId_idx" ON public.products USING btree ("tenantId");


--
-- Name: purchase_delivery_note_items_delivery_note_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX purchase_delivery_note_items_delivery_note_id_idx ON public.purchase_delivery_note_items USING btree (delivery_note_id);


--
-- Name: purchase_delivery_note_items_product_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX purchase_delivery_note_items_product_id_idx ON public.purchase_delivery_note_items USING btree (product_id);


--
-- Name: purchase_delivery_note_items_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "purchase_delivery_note_items_tenantId_idx" ON public.purchase_delivery_note_items USING btree ("tenantId");


--
-- Name: purchase_delivery_note_logs_delivery_note_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX purchase_delivery_note_logs_delivery_note_id_idx ON public.purchase_delivery_note_logs USING btree (delivery_note_id);


--
-- Name: purchase_delivery_note_logs_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "purchase_delivery_note_logs_tenantId_idx" ON public.purchase_delivery_note_logs USING btree ("tenantId");


--
-- Name: purchase_delivery_note_logs_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX purchase_delivery_note_logs_user_id_idx ON public.purchase_delivery_note_logs USING btree (user_id);


--
-- Name: purchase_delivery_notes_account_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX purchase_delivery_notes_account_id_idx ON public.purchase_delivery_notes USING btree (account_id);


--
-- Name: purchase_delivery_notes_date_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX purchase_delivery_notes_date_idx ON public.purchase_delivery_notes USING btree (date);


--
-- Name: purchase_delivery_notes_delivery_note_no_tenantId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "purchase_delivery_notes_delivery_note_no_tenantId_key" ON public.purchase_delivery_notes USING btree (delivery_note_no, "tenantId");


--
-- Name: purchase_delivery_notes_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX purchase_delivery_notes_status_idx ON public.purchase_delivery_notes USING btree (status);


--
-- Name: purchase_delivery_notes_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "purchase_delivery_notes_tenantId_idx" ON public.purchase_delivery_notes USING btree ("tenantId");


--
-- Name: purchase_order_items_product_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX purchase_order_items_product_id_idx ON public.purchase_order_items USING btree (product_id);


--
-- Name: purchase_order_items_purchase_order_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX purchase_order_items_purchase_order_id_idx ON public.purchase_order_items USING btree (purchase_order_id);


--
-- Name: purchase_order_items_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "purchase_order_items_tenantId_idx" ON public.purchase_order_items USING btree ("tenantId");


--
-- Name: purchase_order_local_items_order_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX purchase_order_local_items_order_id_idx ON public.purchase_order_local_items USING btree (order_id);


--
-- Name: purchase_order_local_items_product_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX purchase_order_local_items_product_id_idx ON public.purchase_order_local_items USING btree (product_id);


--
-- Name: purchase_order_local_logs_order_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX purchase_order_local_logs_order_id_idx ON public.purchase_order_local_logs USING btree (order_id);


--
-- Name: purchase_order_local_logs_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "purchase_order_local_logs_tenantId_idx" ON public.purchase_order_local_logs USING btree ("tenantId");


--
-- Name: purchase_order_local_logs_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX purchase_order_local_logs_user_id_idx ON public.purchase_order_local_logs USING btree (user_id);


--
-- Name: purchase_orders_orderNumber_tenantId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "purchase_orders_orderNumber_tenantId_key" ON public.purchase_orders USING btree ("orderNumber", "tenantId");


--
-- Name: purchase_orders_order_date_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX purchase_orders_order_date_idx ON public.purchase_orders USING btree (order_date);


--
-- Name: purchase_orders_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX purchase_orders_status_idx ON public.purchase_orders USING btree (status);


--
-- Name: purchase_orders_supplier_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX purchase_orders_supplier_id_idx ON public.purchase_orders USING btree (supplier_id);


--
-- Name: purchase_orders_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "purchase_orders_tenantId_idx" ON public.purchase_orders USING btree ("tenantId");


--
-- Name: purchase_orders_tenantId_orderNumber_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "purchase_orders_tenantId_orderNumber_idx" ON public.purchase_orders USING btree ("tenantId", "orderNumber");


--
-- Name: quote_items_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "quote_items_tenantId_idx" ON public.quote_items USING btree ("tenantId");


--
-- Name: quote_logs_quote_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX quote_logs_quote_id_idx ON public.quote_logs USING btree (quote_id);


--
-- Name: quote_logs_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "quote_logs_tenantId_idx" ON public.quote_logs USING btree ("tenantId");


--
-- Name: quote_logs_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX quote_logs_user_id_idx ON public.quote_logs USING btree (user_id);


--
-- Name: quotes_quote_no_tenantId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "quotes_quote_no_tenantId_key" ON public.quotes USING btree (quote_no, "tenantId");


--
-- Name: quotes_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "quotes_tenantId_idx" ON public.quotes USING btree ("tenantId");


--
-- Name: quotes_tenantId_quote_no_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "quotes_tenantId_quote_no_idx" ON public.quotes USING btree ("tenantId", quote_no);


--
-- Name: reconciliation_logs_invoice_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX reconciliation_logs_invoice_id_idx ON public.reconciliation_logs USING btree (invoice_id);


--
-- Name: reconciliation_logs_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX reconciliation_logs_tenant_id_idx ON public.reconciliation_logs USING btree (tenant_id);


--
-- Name: role_permissions_roleId_permissionId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "role_permissions_roleId_permissionId_key" ON public.role_permissions USING btree ("roleId", "permissionId");


--
-- Name: roles_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "roles_tenantId_idx" ON public.roles USING btree ("tenantId");


--
-- Name: roles_tenantId_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "roles_tenantId_name_key" ON public.roles USING btree ("tenantId", name);


--
-- Name: salary_payment_details_bank_account_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX salary_payment_details_bank_account_id_idx ON public.salary_payment_details USING btree (bank_account_id);


--
-- Name: salary_payment_details_cashbox_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX salary_payment_details_cashbox_id_idx ON public.salary_payment_details USING btree (cashbox_id);


--
-- Name: salary_payment_details_salary_payment_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX salary_payment_details_salary_payment_id_idx ON public.salary_payment_details USING btree (salary_payment_id);


--
-- Name: salary_payment_details_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "salary_payment_details_tenantId_idx" ON public.salary_payment_details USING btree ("tenantId");


--
-- Name: salary_payments_employee_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX salary_payments_employee_id_idx ON public.salary_payments USING btree (employee_id);


--
-- Name: salary_payments_plan_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX salary_payments_plan_id_idx ON public.salary_payments USING btree (plan_id);


--
-- Name: salary_payments_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "salary_payments_tenantId_idx" ON public.salary_payments USING btree ("tenantId");


--
-- Name: salary_plans_employee_id_year_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX salary_plans_employee_id_year_idx ON public.salary_plans USING btree (employee_id, year);


--
-- Name: salary_plans_employee_id_year_month_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX salary_plans_employee_id_year_month_key ON public.salary_plans USING btree (employee_id, year, month);


--
-- Name: salary_plans_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX salary_plans_status_idx ON public.salary_plans USING btree (status);


--
-- Name: salary_plans_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "salary_plans_tenantId_idx" ON public.salary_plans USING btree ("tenantId");


--
-- Name: salary_plans_year_month_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX salary_plans_year_month_idx ON public.salary_plans USING btree (year, month);


--
-- Name: sales_agents_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "sales_agents_tenantId_idx" ON public.sales_agents USING btree ("tenantId");


--
-- Name: sales_delivery_note_items_delivery_note_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sales_delivery_note_items_delivery_note_id_idx ON public.sales_delivery_note_items USING btree (delivery_note_id);


--
-- Name: sales_delivery_note_items_product_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sales_delivery_note_items_product_id_idx ON public.sales_delivery_note_items USING btree (product_id);


--
-- Name: sales_delivery_note_items_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "sales_delivery_note_items_tenantId_idx" ON public.sales_delivery_note_items USING btree ("tenantId");


--
-- Name: sales_delivery_note_logs_delivery_note_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sales_delivery_note_logs_delivery_note_id_idx ON public.sales_delivery_note_logs USING btree (delivery_note_id);


--
-- Name: sales_delivery_note_logs_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "sales_delivery_note_logs_tenantId_idx" ON public.sales_delivery_note_logs USING btree ("tenantId");


--
-- Name: sales_delivery_note_logs_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sales_delivery_note_logs_user_id_idx ON public.sales_delivery_note_logs USING btree (user_id);


--
-- Name: sales_delivery_notes_account_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sales_delivery_notes_account_id_idx ON public.sales_delivery_notes USING btree (account_id);


--
-- Name: sales_delivery_notes_date_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sales_delivery_notes_date_idx ON public.sales_delivery_notes USING btree (date);


--
-- Name: sales_delivery_notes_delivery_note_no_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sales_delivery_notes_delivery_note_no_idx ON public.sales_delivery_notes USING btree (delivery_note_no);


--
-- Name: sales_delivery_notes_delivery_note_no_tenantId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "sales_delivery_notes_delivery_note_no_tenantId_key" ON public.sales_delivery_notes USING btree (delivery_note_no, "tenantId");


--
-- Name: sales_delivery_notes_source_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sales_delivery_notes_source_id_idx ON public.sales_delivery_notes USING btree (source_id);


--
-- Name: sales_delivery_notes_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sales_delivery_notes_status_idx ON public.sales_delivery_notes USING btree (status);


--
-- Name: sales_delivery_notes_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "sales_delivery_notes_tenantId_idx" ON public.sales_delivery_notes USING btree ("tenantId");


--
-- Name: sales_order_items_order_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sales_order_items_order_id_idx ON public.sales_order_items USING btree (order_id);


--
-- Name: sales_order_items_product_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sales_order_items_product_id_idx ON public.sales_order_items USING btree (product_id);


--
-- Name: sales_order_items_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "sales_order_items_tenantId_idx" ON public.sales_order_items USING btree ("tenantId");


--
-- Name: sales_order_logs_order_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sales_order_logs_order_id_idx ON public.sales_order_logs USING btree (order_id);


--
-- Name: sales_order_logs_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "sales_order_logs_tenantId_idx" ON public.sales_order_logs USING btree ("tenantId");


--
-- Name: sales_order_logs_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sales_order_logs_user_id_idx ON public.sales_order_logs USING btree (user_id);


--
-- Name: sales_orders_account_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sales_orders_account_id_idx ON public.sales_orders USING btree (account_id);


--
-- Name: sales_orders_date_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sales_orders_date_idx ON public.sales_orders USING btree (date);


--
-- Name: sales_orders_deliveryNoteId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "sales_orders_deliveryNoteId_key" ON public.sales_orders USING btree ("deliveryNoteId");


--
-- Name: sales_orders_order_no_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sales_orders_order_no_idx ON public.sales_orders USING btree (order_no);


--
-- Name: sales_orders_order_no_tenantId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "sales_orders_order_no_tenantId_key" ON public.sales_orders USING btree (order_no, "tenantId");


--
-- Name: sales_orders_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sales_orders_status_idx ON public.sales_orders USING btree (status);


--
-- Name: sales_orders_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "sales_orders_tenantId_idx" ON public.sales_orders USING btree ("tenantId");


--
-- Name: service_invoices_account_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX service_invoices_account_id_idx ON public.service_invoices USING btree (account_id);


--
-- Name: service_invoices_invoiceNo_tenantId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "service_invoices_invoiceNo_tenantId_key" ON public.service_invoices USING btree ("invoiceNo", "tenantId");


--
-- Name: service_invoices_issueDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "service_invoices_issueDate_idx" ON public.service_invoices USING btree ("issueDate");


--
-- Name: service_invoices_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "service_invoices_tenantId_idx" ON public.service_invoices USING btree ("tenantId");


--
-- Name: service_invoices_workOrderId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "service_invoices_workOrderId_key" ON public.service_invoices USING btree ("workOrderId");


--
-- Name: service_templates_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX service_templates_tenant_id_idx ON public.service_templates USING btree (tenant_id);


--
-- Name: service_templates_tenant_id_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX service_templates_tenant_id_name_key ON public.service_templates USING btree (tenant_id, name);


--
-- Name: sessions_expiresAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "sessions_expiresAt_idx" ON public.sessions USING btree ("expiresAt");


--
-- Name: sessions_refreshToken_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "sessions_refreshToken_idx" ON public.sessions USING btree ("refreshToken");


--
-- Name: sessions_refreshToken_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "sessions_refreshToken_key" ON public.sessions USING btree ("refreshToken");


--
-- Name: sessions_token_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sessions_token_idx ON public.sessions USING btree (token);


--
-- Name: sessions_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX sessions_token_key ON public.sessions USING btree (token);


--
-- Name: sessions_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "sessions_userId_idx" ON public.sessions USING btree ("userId");


--
-- Name: shelves_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "shelves_tenantId_idx" ON public.shelves USING btree ("tenantId");


--
-- Name: shelves_warehouse_id_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX shelves_warehouse_id_code_key ON public.shelves USING btree (warehouse_id, code);


--
-- Name: simple_orders_company_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX simple_orders_company_id_idx ON public.simple_orders USING btree (company_id);


--
-- Name: simple_orders_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "simple_orders_createdAt_idx" ON public.simple_orders USING btree ("createdAt");


--
-- Name: simple_orders_product_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX simple_orders_product_id_idx ON public.simple_orders USING btree (product_id);


--
-- Name: simple_orders_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX simple_orders_status_idx ON public.simple_orders USING btree (status);


--
-- Name: simple_orders_tenantId_company_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "simple_orders_tenantId_company_id_idx" ON public.simple_orders USING btree ("tenantId", company_id);


--
-- Name: simple_orders_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "simple_orders_tenantId_idx" ON public.simple_orders USING btree ("tenantId");


--
-- Name: simple_orders_tenantId_product_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "simple_orders_tenantId_product_id_idx" ON public.simple_orders USING btree ("tenantId", product_id);


--
-- Name: stock_cost_history_product_id_computed_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX stock_cost_history_product_id_computed_at_idx ON public.stock_cost_history USING btree (product_id, computed_at);


--
-- Name: stock_cost_history_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "stock_cost_history_tenantId_idx" ON public.stock_cost_history USING btree ("tenantId");


--
-- Name: stock_moves_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "stock_moves_createdAt_idx" ON public.stock_moves USING btree ("createdAt");


--
-- Name: stock_moves_fromWarehouseId_fromLocationId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "stock_moves_fromWarehouseId_fromLocationId_idx" ON public.stock_moves USING btree ("fromWarehouseId", "fromLocationId");


--
-- Name: stock_moves_moveType_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "stock_moves_moveType_idx" ON public.stock_moves USING btree ("moveType");


--
-- Name: stock_moves_productId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "stock_moves_productId_idx" ON public.stock_moves USING btree ("productId");


--
-- Name: stock_moves_refType_refId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "stock_moves_refType_refId_idx" ON public.stock_moves USING btree ("refType", "refId");


--
-- Name: stock_moves_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "stock_moves_tenantId_idx" ON public.stock_moves USING btree ("tenantId");


--
-- Name: stock_moves_toWarehouseId_toLocationId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "stock_moves_toWarehouseId_toLocationId_idx" ON public.stock_moves USING btree ("toWarehouseId", "toLocationId");


--
-- Name: stocktake_items_location_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX stocktake_items_location_id_idx ON public.stocktake_items USING btree (location_id);


--
-- Name: stocktake_items_product_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX stocktake_items_product_id_idx ON public.stocktake_items USING btree (product_id);


--
-- Name: stocktake_items_stocktake_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX stocktake_items_stocktake_id_idx ON public.stocktake_items USING btree (stocktake_id);


--
-- Name: stocktake_items_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "stocktake_items_tenantId_idx" ON public.stocktake_items USING btree ("tenantId");


--
-- Name: stocktakes_stocktake_no_tenantId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "stocktakes_stocktake_no_tenantId_key" ON public.stocktakes USING btree (stocktake_no, "tenantId");


--
-- Name: stocktakes_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "stocktakes_tenantId_idx" ON public.stocktakes USING btree ("tenantId");


--
-- Name: stocktakes_tenantId_stocktake_no_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "stocktakes_tenantId_stocktake_no_idx" ON public.stocktakes USING btree ("tenantId", stocktake_no);


--
-- Name: subscriptions_endDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "subscriptions_endDate_idx" ON public.subscriptions USING btree ("endDate");


--
-- Name: subscriptions_iyzicoSubscriptionRef_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "subscriptions_iyzicoSubscriptionRef_key" ON public.subscriptions USING btree ("iyzicoSubscriptionRef");


--
-- Name: subscriptions_nextBillingDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "subscriptions_nextBillingDate_idx" ON public.subscriptions USING btree ("nextBillingDate");


--
-- Name: subscriptions_planId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "subscriptions_planId_idx" ON public.subscriptions USING btree ("planId");


--
-- Name: subscriptions_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX subscriptions_status_idx ON public.subscriptions USING btree (status);


--
-- Name: subscriptions_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "subscriptions_tenantId_idx" ON public.subscriptions USING btree ("tenantId");


--
-- Name: subscriptions_tenantId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "subscriptions_tenantId_key" ON public.subscriptions USING btree ("tenantId");


--
-- Name: system_parameters_category_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX system_parameters_category_idx ON public.system_parameters USING btree (category);


--
-- Name: system_parameters_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "system_parameters_tenantId_idx" ON public.system_parameters USING btree ("tenantId");


--
-- Name: system_parameters_tenantId_key_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "system_parameters_tenantId_key_key" ON public.system_parameters USING btree ("tenantId", key);


--
-- Name: technician_metrics_technician_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX technician_metrics_technician_id_idx ON public.technician_metrics USING btree (technician_id);


--
-- Name: technician_metrics_technician_id_period_start_period_end_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX technician_metrics_technician_id_period_start_period_end_key ON public.technician_metrics USING btree (technician_id, period_start, period_end);


--
-- Name: technician_metrics_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX technician_metrics_tenant_id_idx ON public.technician_metrics USING btree (tenant_id);


--
-- Name: tenant_onboardings_tenant_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX tenant_onboardings_tenant_id_key ON public.tenant_onboardings USING btree (tenant_id);


--
-- Name: tenant_purge_audits_adminId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "tenant_purge_audits_adminId_idx" ON public.tenant_purge_audits USING btree ("adminId");


--
-- Name: tenant_purge_audits_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "tenant_purge_audits_createdAt_idx" ON public.tenant_purge_audits USING btree ("createdAt");


--
-- Name: tenant_purge_audits_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "tenant_purge_audits_tenantId_idx" ON public.tenant_purge_audits USING btree ("tenantId");


--
-- Name: tenant_settings_tenantId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "tenant_settings_tenantId_key" ON public.tenant_settings USING btree ("tenantId");


--
-- Name: tenant_usage_metrics_metric_date_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX tenant_usage_metrics_metric_date_idx ON public.tenant_usage_metrics USING btree (metric_date);


--
-- Name: tenant_usage_metrics_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX tenant_usage_metrics_tenant_id_idx ON public.tenant_usage_metrics USING btree (tenant_id);


--
-- Name: tenant_usage_metrics_tenant_id_metric_date_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX tenant_usage_metrics_tenant_id_metric_date_key ON public.tenant_usage_metrics USING btree (tenant_id, metric_date);


--
-- Name: tenants_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "tenants_createdAt_idx" ON public.tenants USING btree ("createdAt");


--
-- Name: tenants_domain_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX tenants_domain_idx ON public.tenants USING btree (domain);


--
-- Name: tenants_domain_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX tenants_domain_key ON public.tenants USING btree (domain);


--
-- Name: tenants_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX tenants_status_idx ON public.tenants USING btree (status);


--
-- Name: tenants_subdomain_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX tenants_subdomain_idx ON public.tenants USING btree (subdomain);


--
-- Name: tenants_subdomain_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX tenants_subdomain_key ON public.tenants USING btree (subdomain);


--
-- Name: tenants_uuid_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX tenants_uuid_key ON public.tenants USING btree (uuid);


--
-- Name: unit_sets_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX unit_sets_tenant_id_idx ON public.unit_sets USING btree (tenant_id);


--
-- Name: units_unit_set_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX units_unit_set_id_idx ON public.units USING btree (unit_set_id);


--
-- Name: user_licenses_licenseType_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "user_licenses_licenseType_idx" ON public.user_licenses USING btree ("licenseType");


--
-- Name: user_licenses_moduleId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "user_licenses_moduleId_idx" ON public.user_licenses USING btree ("moduleId");


--
-- Name: user_licenses_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "user_licenses_userId_idx" ON public.user_licenses USING btree ("userId");


--
-- Name: user_licenses_userId_licenseType_moduleId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "user_licenses_userId_licenseType_moduleId_key" ON public.user_licenses USING btree ("userId", "licenseType", "moduleId");


--
-- Name: users_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX users_email_idx ON public.users USING btree (email);


--
-- Name: users_email_tenantId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "users_email_tenantId_key" ON public.users USING btree (email, "tenantId");


--
-- Name: users_role_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX users_role_idx ON public.users USING btree (role);


--
-- Name: users_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX users_status_idx ON public.users USING btree (status);


--
-- Name: users_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "users_tenantId_idx" ON public.users USING btree ("tenantId");


--
-- Name: users_username_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX users_username_idx ON public.users USING btree (username);


--
-- Name: users_uuid_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_uuid_key ON public.users USING btree (uuid);


--
-- Name: vehicle_catalog_brand_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX vehicle_catalog_brand_idx ON public.vehicle_catalog USING btree (brand);


--
-- Name: vehicle_catalog_brand_model_engine_volume_fuel_type_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX vehicle_catalog_brand_model_engine_volume_fuel_type_key ON public.vehicle_catalog USING btree (brand, model, engine_volume, fuel_type);


--
-- Name: vehicle_catalog_fuel_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX vehicle_catalog_fuel_type_idx ON public.vehicle_catalog USING btree (fuel_type);


--
-- Name: vehicle_catalog_model_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX vehicle_catalog_model_idx ON public.vehicle_catalog USING btree (model);


--
-- Name: vehicle_expenses_date_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX vehicle_expenses_date_idx ON public.vehicle_expenses USING btree (date);


--
-- Name: vehicle_expenses_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "vehicle_expenses_tenantId_idx" ON public.vehicle_expenses USING btree ("tenantId");


--
-- Name: vehicle_expenses_vehicleId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "vehicle_expenses_vehicleId_idx" ON public.vehicle_expenses USING btree ("vehicleId");


--
-- Name: warehouse_critical_stocks_productId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "warehouse_critical_stocks_productId_idx" ON public.warehouse_critical_stocks USING btree ("productId");


--
-- Name: warehouse_critical_stocks_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "warehouse_critical_stocks_tenantId_idx" ON public.warehouse_critical_stocks USING btree ("tenantId");


--
-- Name: warehouse_critical_stocks_warehouseId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "warehouse_critical_stocks_warehouseId_idx" ON public.warehouse_critical_stocks USING btree ("warehouseId");


--
-- Name: warehouse_critical_stocks_warehouseId_productId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "warehouse_critical_stocks_warehouseId_productId_key" ON public.warehouse_critical_stocks USING btree ("warehouseId", "productId");


--
-- Name: warehouse_stock_thresholds_product_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX warehouse_stock_thresholds_product_id_idx ON public.warehouse_stock_thresholds USING btree (product_id);


--
-- Name: warehouse_stock_thresholds_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX warehouse_stock_thresholds_tenant_id_idx ON public.warehouse_stock_thresholds USING btree (tenant_id);


--
-- Name: warehouse_stock_thresholds_tenant_id_warehouse_id_product_i_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX warehouse_stock_thresholds_tenant_id_warehouse_id_product_i_key ON public.warehouse_stock_thresholds USING btree (tenant_id, warehouse_id, product_id);


--
-- Name: warehouse_stock_thresholds_warehouse_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX warehouse_stock_thresholds_warehouse_id_idx ON public.warehouse_stock_thresholds USING btree (warehouse_id);


--
-- Name: warehouse_transfer_items_product_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX warehouse_transfer_items_product_id_idx ON public.warehouse_transfer_items USING btree (product_id);


--
-- Name: warehouse_transfer_items_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "warehouse_transfer_items_tenantId_idx" ON public.warehouse_transfer_items USING btree ("tenantId");


--
-- Name: warehouse_transfer_items_transferId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "warehouse_transfer_items_transferId_idx" ON public.warehouse_transfer_items USING btree ("transferId");


--
-- Name: warehouse_transfer_logs_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "warehouse_transfer_logs_tenantId_idx" ON public.warehouse_transfer_logs USING btree ("tenantId");


--
-- Name: warehouse_transfer_logs_transferId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "warehouse_transfer_logs_transferId_idx" ON public.warehouse_transfer_logs USING btree ("transferId");


--
-- Name: warehouse_transfer_logs_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "warehouse_transfer_logs_userId_idx" ON public.warehouse_transfer_logs USING btree ("userId");


--
-- Name: warehouse_transfers_fromWarehouseId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "warehouse_transfers_fromWarehouseId_idx" ON public.warehouse_transfers USING btree ("fromWarehouseId");


--
-- Name: warehouse_transfers_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "warehouse_transfers_tenantId_idx" ON public.warehouse_transfers USING btree ("tenantId");


--
-- Name: warehouse_transfers_tenantId_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "warehouse_transfers_tenantId_status_idx" ON public.warehouse_transfers USING btree ("tenantId", status);


--
-- Name: warehouse_transfers_toWarehouseId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "warehouse_transfers_toWarehouseId_idx" ON public.warehouse_transfers USING btree ("toWarehouseId");


--
-- Name: warehouse_transfers_transferNo_tenantId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "warehouse_transfers_transferNo_tenantId_key" ON public.warehouse_transfers USING btree ("transferNo", "tenantId");


--
-- Name: warehouses_code_tenantId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "warehouses_code_tenantId_key" ON public.warehouses USING btree (code, "tenantId");


--
-- Name: warehouses_manager_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX warehouses_manager_id_idx ON public.warehouses USING btree (manager_id);


--
-- Name: warehouses_tenantId_code_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "warehouses_tenantId_code_idx" ON public.warehouses USING btree ("tenantId", code);


--
-- Name: warehouses_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "warehouses_tenantId_idx" ON public.warehouses USING btree ("tenantId");


--
-- Name: webhook_endpoints_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX webhook_endpoints_tenant_id_idx ON public.webhook_endpoints USING btree (tenant_id);


--
-- Name: work_order_activities_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "work_order_activities_tenantId_idx" ON public.work_order_activities USING btree ("tenantId");


--
-- Name: work_order_activities_workOrderId_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "work_order_activities_workOrderId_createdAt_idx" ON public.work_order_activities USING btree ("workOrderId", "createdAt");


--
-- Name: work_order_activities_workOrderId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "work_order_activities_workOrderId_idx" ON public.work_order_activities USING btree ("workOrderId");


--
-- Name: work_order_items_product_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX work_order_items_product_id_idx ON public.work_order_items USING btree (product_id);


--
-- Name: work_order_items_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "work_order_items_tenantId_idx" ON public.work_order_items USING btree ("tenantId");


--
-- Name: work_order_items_workOrderId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "work_order_items_workOrderId_idx" ON public.work_order_items USING btree ("workOrderId");


--
-- Name: work_order_warranties_tenant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX work_order_warranties_tenant_id_idx ON public.work_order_warranties USING btree (tenant_id);


--
-- Name: work_order_warranties_valid_until_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX work_order_warranties_valid_until_idx ON public.work_order_warranties USING btree (valid_until);


--
-- Name: work_order_warranties_work_order_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX work_order_warranties_work_order_id_idx ON public.work_order_warranties USING btree (work_order_id);


--
-- Name: work_orders_account_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX work_orders_account_id_idx ON public.work_orders USING btree (account_id);


--
-- Name: work_orders_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "work_orders_createdAt_idx" ON public.work_orders USING btree ("createdAt");


--
-- Name: work_orders_service_template_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX work_orders_service_template_id_idx ON public.work_orders USING btree (service_template_id);


--
-- Name: work_orders_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX work_orders_status_idx ON public.work_orders USING btree (status);


--
-- Name: work_orders_technicianId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "work_orders_technicianId_idx" ON public.work_orders USING btree ("technicianId");


--
-- Name: work_orders_tenantId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "work_orders_tenantId_idx" ON public.work_orders USING btree ("tenantId");


--
-- Name: work_orders_workOrderNo_tenantId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "work_orders_workOrderNo_tenantId_key" ON public.work_orders USING btree ("workOrderNo", "tenantId");


--
-- Name: account_addresses account_addresses_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_addresses
    ADD CONSTRAINT account_addresses_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: account_banks account_banks_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_banks
    ADD CONSTRAINT account_banks_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: account_contacts account_contacts_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_contacts
    ADD CONSTRAINT account_contacts_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: account_movements account_movements_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_movements
    ADD CONSTRAINT account_movements_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: account_movements account_movements_check_bill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_movements
    ADD CONSTRAINT account_movements_check_bill_id_fkey FOREIGN KEY (check_bill_id) REFERENCES public.checks_bills(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: account_movements account_movements_deleted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_movements
    ADD CONSTRAINT account_movements_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: account_movements account_movements_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_movements
    ADD CONSTRAINT account_movements_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: account_movements account_movements_reversal_of_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_movements
    ADD CONSTRAINT account_movements_reversal_of_id_fkey FOREIGN KEY (reversal_of_id) REFERENCES public.account_movements(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: account_movements account_movements_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_movements
    ADD CONSTRAINT "account_movements_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: account_transactions account_transactions_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_transactions
    ADD CONSTRAINT account_transactions_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: account_transactions account_transactions_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_transactions
    ADD CONSTRAINT "account_transactions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: accounts accounts_deleted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: accounts accounts_price_list_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_price_list_id_fkey FOREIGN KEY (price_list_id) REFERENCES public.price_lists(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: accounts accounts_sales_agent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_sales_agent_id_fkey FOREIGN KEY (sales_agent_id) REFERENCES public.sales_agents(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: accounts accounts_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT "accounts_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: accounts accounts_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: advance_settlements advance_settlements_advance_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.advance_settlements
    ADD CONSTRAINT advance_settlements_advance_id_fkey FOREIGN KEY (advance_id) REFERENCES public.advances(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: advance_settlements advance_settlements_salary_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.advance_settlements
    ADD CONSTRAINT advance_settlements_salary_plan_id_fkey FOREIGN KEY (salary_plan_id) REFERENCES public.salary_plans(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: advance_settlements advance_settlements_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.advance_settlements
    ADD CONSTRAINT "advance_settlements_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: advances advances_cashbox_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.advances
    ADD CONSTRAINT advances_cashbox_id_fkey FOREIGN KEY (cashbox_id) REFERENCES public.cashboxes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: advances advances_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.advances
    ADD CONSTRAINT advances_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: advances advances_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.advances
    ADD CONSTRAINT advances_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: advances advances_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.advances
    ADD CONSTRAINT "advances_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: api_keys api_keys_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: api_keys api_keys_revoked_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_revoked_by_fkey FOREIGN KEY (revoked_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: api_keys api_keys_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: asset_assignments asset_assignments_assigned_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_assignments
    ADD CONSTRAINT asset_assignments_assigned_by_fkey FOREIGN KEY (assigned_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: asset_assignments asset_assignments_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_assignments
    ADD CONSTRAINT asset_assignments_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: asset_assignments asset_assignments_returned_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_assignments
    ADD CONSTRAINT asset_assignments_returned_by_fkey FOREIGN KEY (returned_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: asset_assignments asset_assignments_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_assignments
    ADD CONSTRAINT asset_assignments_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: audit_logs audit_logs_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT "audit_logs_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: b2b_account_movements b2b_account_movements_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_account_movements
    ADD CONSTRAINT "b2b_account_movements_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public.b2b_customers(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: b2b_account_movements b2b_account_movements_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_account_movements
    ADD CONSTRAINT "b2b_account_movements_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: b2b_advertisements b2b_advertisements_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_advertisements
    ADD CONSTRAINT "b2b_advertisements_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: b2b_cart_items b2b_cart_items_cartId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_cart_items
    ADD CONSTRAINT "b2b_cart_items_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES public.b2b_carts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: b2b_cart_items b2b_cart_items_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_cart_items
    ADD CONSTRAINT "b2b_cart_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.b2b_products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: b2b_cart_items b2b_cart_items_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_cart_items
    ADD CONSTRAINT "b2b_cart_items_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: b2b_carts b2b_carts_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_carts
    ADD CONSTRAINT "b2b_carts_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public.b2b_customers(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: b2b_carts b2b_carts_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_carts
    ADD CONSTRAINT "b2b_carts_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: b2b_customer_classes b2b_customer_classes_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_customer_classes
    ADD CONSTRAINT "b2b_customer_classes_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: b2b_customers b2b_customers_customerClassId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_customers
    ADD CONSTRAINT "b2b_customers_customerClassId_fkey" FOREIGN KEY ("customerClassId") REFERENCES public.b2b_customer_classes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: b2b_customers b2b_customers_discountGroupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_customers
    ADD CONSTRAINT "b2b_customers_discountGroupId_fkey" FOREIGN KEY ("discountGroupId") REFERENCES public.b2b_discount_groups(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: b2b_customers b2b_customers_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_customers
    ADD CONSTRAINT "b2b_customers_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: b2b_delivery_methods b2b_delivery_methods_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_delivery_methods
    ADD CONSTRAINT "b2b_delivery_methods_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: b2b_discount_groups b2b_discount_groups_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_discount_groups
    ADD CONSTRAINT "b2b_discount_groups_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: b2b_discounts b2b_discounts_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_discounts
    ADD CONSTRAINT "b2b_discounts_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: b2b_domains b2b_domains_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_domains
    ADD CONSTRAINT "b2b_domains_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: b2b_licenses b2b_licenses_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_licenses
    ADD CONSTRAINT "b2b_licenses_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: b2b_notifications b2b_notifications_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_notifications
    ADD CONSTRAINT "b2b_notifications_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public.b2b_customers(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: b2b_notifications b2b_notifications_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_notifications
    ADD CONSTRAINT "b2b_notifications_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public.b2b_orders(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: b2b_notifications b2b_notifications_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_notifications
    ADD CONSTRAINT "b2b_notifications_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: b2b_order_items b2b_order_items_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_order_items
    ADD CONSTRAINT "b2b_order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public.b2b_orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: b2b_order_items b2b_order_items_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_order_items
    ADD CONSTRAINT "b2b_order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.b2b_products(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: b2b_order_items b2b_order_items_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_order_items
    ADD CONSTRAINT "b2b_order_items_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: b2b_orders b2b_orders_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_orders
    ADD CONSTRAINT "b2b_orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public.b2b_customers(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: b2b_orders b2b_orders_deliveryMethodId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_orders
    ADD CONSTRAINT "b2b_orders_deliveryMethodId_fkey" FOREIGN KEY ("deliveryMethodId") REFERENCES public.b2b_delivery_methods(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: b2b_orders b2b_orders_salespersonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_orders
    ADD CONSTRAINT "b2b_orders_salespersonId_fkey" FOREIGN KEY ("salespersonId") REFERENCES public.b2b_salespersons(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: b2b_orders b2b_orders_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_orders
    ADD CONSTRAINT "b2b_orders_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: b2b_products b2b_products_erpProductId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_products
    ADD CONSTRAINT "b2b_products_erpProductId_fkey" FOREIGN KEY ("erpProductId") REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: b2b_products b2b_products_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_products
    ADD CONSTRAINT "b2b_products_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: b2b_salesperson_customers b2b_salesperson_customers_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_salesperson_customers
    ADD CONSTRAINT "b2b_salesperson_customers_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public.b2b_customers(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: b2b_salesperson_customers b2b_salesperson_customers_salespersonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_salesperson_customers
    ADD CONSTRAINT "b2b_salesperson_customers_salespersonId_fkey" FOREIGN KEY ("salespersonId") REFERENCES public.b2b_salespersons(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: b2b_salespersons b2b_salespersons_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_salespersons
    ADD CONSTRAINT "b2b_salespersons_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: b2b_stocks b2b_stocks_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_stocks
    ADD CONSTRAINT "b2b_stocks_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.b2b_products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: b2b_stocks b2b_stocks_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_stocks
    ADD CONSTRAINT "b2b_stocks_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: b2b_sync_logs b2b_sync_logs_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_sync_logs
    ADD CONSTRAINT "b2b_sync_logs_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: b2b_sync_loops b2b_sync_loops_last_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_sync_loops
    ADD CONSTRAINT b2b_sync_loops_last_user_id_fkey FOREIGN KEY (last_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: b2b_sync_loops b2b_sync_loops_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_sync_loops
    ADD CONSTRAINT b2b_sync_loops_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: b2b_tenant_configs b2b_tenant_configs_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_tenant_configs
    ADD CONSTRAINT "b2b_tenant_configs_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: b2b_warehouse_configs b2b_warehouse_configs_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.b2b_warehouse_configs
    ADD CONSTRAINT "b2b_warehouse_configs_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: bank_account_movements bank_account_movements_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_account_movements
    ADD CONSTRAINT bank_account_movements_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: bank_account_movements bank_account_movements_bank_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_account_movements
    ADD CONSTRAINT bank_account_movements_bank_account_id_fkey FOREIGN KEY (bank_account_id) REFERENCES public.bank_accounts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: bank_account_movements bank_account_movements_deleted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_account_movements
    ADD CONSTRAINT bank_account_movements_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: bank_account_movements bank_account_movements_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_account_movements
    ADD CONSTRAINT bank_account_movements_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: bank_accounts bank_accounts_bank_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_accounts
    ADD CONSTRAINT bank_accounts_bank_id_fkey FOREIGN KEY (bank_id) REFERENCES public.banks(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: bank_accounts bank_accounts_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_accounts
    ADD CONSTRAINT "bank_accounts_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: bank_loan_plans bank_loan_plans_loan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_loan_plans
    ADD CONSTRAINT bank_loan_plans_loan_id_fkey FOREIGN KEY (loan_id) REFERENCES public.bank_loans(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: bank_loan_plans bank_loan_plans_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_loan_plans
    ADD CONSTRAINT "bank_loan_plans_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: bank_loans bank_loans_bank_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_loans
    ADD CONSTRAINT bank_loans_bank_account_id_fkey FOREIGN KEY (bank_account_id) REFERENCES public.bank_accounts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: bank_loans bank_loans_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_loans
    ADD CONSTRAINT "bank_loans_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: bank_transfer_logs bank_transfer_logs_bank_transfer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_transfer_logs
    ADD CONSTRAINT bank_transfer_logs_bank_transfer_id_fkey FOREIGN KEY (bank_transfer_id) REFERENCES public.bank_transfers(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: bank_transfer_logs bank_transfer_logs_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_transfer_logs
    ADD CONSTRAINT bank_transfer_logs_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: bank_transfer_logs bank_transfer_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_transfer_logs
    ADD CONSTRAINT bank_transfer_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: bank_transfers bank_transfers_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_transfers
    ADD CONSTRAINT bank_transfers_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: bank_transfers bank_transfers_bank_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_transfers
    ADD CONSTRAINT bank_transfers_bank_account_id_fkey FOREIGN KEY (bank_account_id) REFERENCES public.bank_accounts(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: bank_transfers bank_transfers_cashbox_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_transfers
    ADD CONSTRAINT bank_transfers_cashbox_id_fkey FOREIGN KEY (cashbox_id) REFERENCES public.cashboxes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: bank_transfers bank_transfers_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_transfers
    ADD CONSTRAINT bank_transfers_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: bank_transfers bank_transfers_deleted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_transfers
    ADD CONSTRAINT bank_transfers_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: bank_transfers bank_transfers_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_transfers
    ADD CONSTRAINT "bank_transfers_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: bank_transfers bank_transfers_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_transfers
    ADD CONSTRAINT bank_transfers_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: banks banks_deleted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.banks
    ADD CONSTRAINT banks_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: banks banks_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.banks
    ADD CONSTRAINT "banks_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: brands brands_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cashbox_movements cashbox_movements_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cashbox_movements
    ADD CONSTRAINT cashbox_movements_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: cashbox_movements cashbox_movements_cashbox_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cashbox_movements
    ADD CONSTRAINT cashbox_movements_cashbox_id_fkey FOREIGN KEY (cashbox_id) REFERENCES public.cashboxes(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: cashbox_movements cashbox_movements_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cashbox_movements
    ADD CONSTRAINT cashbox_movements_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: cashbox_movements cashbox_movements_deleted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cashbox_movements
    ADD CONSTRAINT cashbox_movements_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: cashbox_movements cashbox_movements_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cashbox_movements
    ADD CONSTRAINT cashbox_movements_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: cashboxes cashboxes_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cashboxes
    ADD CONSTRAINT "cashboxes_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: cashboxes cashboxes_deleted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cashboxes
    ADD CONSTRAINT cashboxes_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: cashboxes cashboxes_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cashboxes
    ADD CONSTRAINT "cashboxes_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cashboxes cashboxes_updatedBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cashboxes
    ADD CONSTRAINT "cashboxes_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: categories categories_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: categories categories_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: check_bill_approval_workflows check_bill_approval_workflows_approver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_approval_workflows
    ADD CONSTRAINT check_bill_approval_workflows_approver_id_fkey FOREIGN KEY (approver_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: check_bill_approval_workflows check_bill_approval_workflows_check_bill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_approval_workflows
    ADD CONSTRAINT check_bill_approval_workflows_check_bill_id_fkey FOREIGN KEY (check_bill_id) REFERENCES public.checks_bills(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: check_bill_approval_workflows check_bill_approval_workflows_delegated_to_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_approval_workflows
    ADD CONSTRAINT check_bill_approval_workflows_delegated_to_id_fkey FOREIGN KEY (delegated_to_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: check_bill_approval_workflows check_bill_approval_workflows_journal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_approval_workflows
    ADD CONSTRAINT check_bill_approval_workflows_journal_id_fkey FOREIGN KEY (journal_id) REFERENCES public.check_bill_journals(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: check_bill_approval_workflows check_bill_approval_workflows_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_approval_workflows
    ADD CONSTRAINT check_bill_approval_workflows_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: check_bill_bank_submissions check_bill_bank_submissions_bank_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_bank_submissions
    ADD CONSTRAINT check_bill_bank_submissions_bank_account_id_fkey FOREIGN KEY (bank_account_id) REFERENCES public.bank_accounts(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: check_bill_bank_submissions check_bill_bank_submissions_check_bill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_bank_submissions
    ADD CONSTRAINT check_bill_bank_submissions_check_bill_id_fkey FOREIGN KEY (check_bill_id) REFERENCES public.checks_bills(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: check_bill_bank_submissions check_bill_bank_submissions_created_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_bank_submissions
    ADD CONSTRAINT check_bill_bank_submissions_created_by_id_fkey FOREIGN KEY (created_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: check_bill_bank_submissions check_bill_bank_submissions_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_bank_submissions
    ADD CONSTRAINT check_bill_bank_submissions_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: check_bill_collections check_bill_collections_bank_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_collections
    ADD CONSTRAINT check_bill_collections_bank_account_id_fkey FOREIGN KEY (bank_account_id) REFERENCES public.bank_accounts(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: check_bill_collections check_bill_collections_cashbox_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_collections
    ADD CONSTRAINT check_bill_collections_cashbox_id_fkey FOREIGN KEY (cashbox_id) REFERENCES public.cashboxes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: check_bill_collections check_bill_collections_check_bill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_collections
    ADD CONSTRAINT check_bill_collections_check_bill_id_fkey FOREIGN KEY (check_bill_id) REFERENCES public.checks_bills(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: check_bill_collections check_bill_collections_created_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_collections
    ADD CONSTRAINT check_bill_collections_created_by_id_fkey FOREIGN KEY (created_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: check_bill_collections check_bill_collections_journal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_collections
    ADD CONSTRAINT check_bill_collections_journal_id_fkey FOREIGN KEY (journal_id) REFERENCES public.check_bill_journals(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: check_bill_collections check_bill_collections_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_collections
    ADD CONSTRAINT "check_bill_collections_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: check_bill_discounting check_bill_discounting_bank_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_discounting
    ADD CONSTRAINT check_bill_discounting_bank_account_id_fkey FOREIGN KEY (bank_account_id) REFERENCES public.bank_accounts(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: check_bill_discounting check_bill_discounting_check_bill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_discounting
    ADD CONSTRAINT check_bill_discounting_check_bill_id_fkey FOREIGN KEY (check_bill_id) REFERENCES public.checks_bills(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: check_bill_discounting check_bill_discounting_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_discounting
    ADD CONSTRAINT check_bill_discounting_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: check_bill_endorsements check_bill_endorsements_check_bill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_endorsements
    ADD CONSTRAINT check_bill_endorsements_check_bill_id_fkey FOREIGN KEY (check_bill_id) REFERENCES public.checks_bills(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: check_bill_endorsements check_bill_endorsements_from_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_endorsements
    ADD CONSTRAINT check_bill_endorsements_from_account_id_fkey FOREIGN KEY (from_account_id) REFERENCES public.accounts(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: check_bill_endorsements check_bill_endorsements_journal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_endorsements
    ADD CONSTRAINT check_bill_endorsements_journal_id_fkey FOREIGN KEY (journal_id) REFERENCES public.check_bill_journals(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: check_bill_endorsements check_bill_endorsements_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_endorsements
    ADD CONSTRAINT "check_bill_endorsements_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: check_bill_endorsements check_bill_endorsements_to_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_endorsements
    ADD CONSTRAINT check_bill_endorsements_to_account_id_fkey FOREIGN KEY (to_account_id) REFERENCES public.accounts(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: check_bill_gl_entries check_bill_gl_entries_check_bill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_gl_entries
    ADD CONSTRAINT check_bill_gl_entries_check_bill_id_fkey FOREIGN KEY (check_bill_id) REFERENCES public.checks_bills(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: check_bill_gl_entries check_bill_gl_entries_journal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_gl_entries
    ADD CONSTRAINT check_bill_gl_entries_journal_id_fkey FOREIGN KEY (journal_id) REFERENCES public.check_bill_journals(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: check_bill_gl_entries check_bill_gl_entries_posted_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_gl_entries
    ADD CONSTRAINT check_bill_gl_entries_posted_by_id_fkey FOREIGN KEY (posted_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: check_bill_gl_entries check_bill_gl_entries_reversal_of_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_gl_entries
    ADD CONSTRAINT check_bill_gl_entries_reversal_of_id_fkey FOREIGN KEY (reversal_of_id) REFERENCES public.check_bill_gl_entries(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: check_bill_gl_entries check_bill_gl_entries_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_gl_entries
    ADD CONSTRAINT check_bill_gl_entries_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: check_bill_journal_items check_bill_journal_items_check_bill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_journal_items
    ADD CONSTRAINT check_bill_journal_items_check_bill_id_fkey FOREIGN KEY (check_bill_id) REFERENCES public.checks_bills(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: check_bill_journal_items check_bill_journal_items_journal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_journal_items
    ADD CONSTRAINT check_bill_journal_items_journal_id_fkey FOREIGN KEY (journal_id) REFERENCES public.check_bill_journals(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: check_bill_journal_items check_bill_journal_items_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_journal_items
    ADD CONSTRAINT "check_bill_journal_items_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: check_bill_journals check_bill_journals_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_journals
    ADD CONSTRAINT check_bill_journals_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: check_bill_journals check_bill_journals_approved_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_journals
    ADD CONSTRAINT check_bill_journals_approved_by_id_fkey FOREIGN KEY (approved_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: check_bill_journals check_bill_journals_bank_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_journals
    ADD CONSTRAINT check_bill_journals_bank_account_id_fkey FOREIGN KEY (bank_account_id) REFERENCES public.bank_accounts(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: check_bill_journals check_bill_journals_cashbox_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_journals
    ADD CONSTRAINT check_bill_journals_cashbox_id_fkey FOREIGN KEY (cashbox_id) REFERENCES public.cashboxes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: check_bill_journals check_bill_journals_created_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_journals
    ADD CONSTRAINT check_bill_journals_created_by_id_fkey FOREIGN KEY (created_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: check_bill_journals check_bill_journals_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_journals
    ADD CONSTRAINT "check_bill_journals_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: check_bill_logs check_bill_logs_check_bill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_logs
    ADD CONSTRAINT check_bill_logs_check_bill_id_fkey FOREIGN KEY (check_bill_id) REFERENCES public.checks_bills(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: check_bill_logs check_bill_logs_journal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_logs
    ADD CONSTRAINT check_bill_logs_journal_id_fkey FOREIGN KEY (journal_id) REFERENCES public.check_bill_journals(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: check_bill_logs check_bill_logs_performed_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_logs
    ADD CONSTRAINT check_bill_logs_performed_by_id_fkey FOREIGN KEY (performed_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: check_bill_logs check_bill_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_logs
    ADD CONSTRAINT check_bill_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: check_bill_protest_tracking check_bill_protest_tracking_check_bill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_protest_tracking
    ADD CONSTRAINT check_bill_protest_tracking_check_bill_id_fkey FOREIGN KEY (check_bill_id) REFERENCES public.checks_bills(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: check_bill_protest_tracking check_bill_protest_tracking_lawyer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_protest_tracking
    ADD CONSTRAINT check_bill_protest_tracking_lawyer_id_fkey FOREIGN KEY (lawyer_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: check_bill_protest_tracking check_bill_protest_tracking_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_protest_tracking
    ADD CONSTRAINT check_bill_protest_tracking_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: check_bill_reconciliation check_bill_reconciliation_bank_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_reconciliation
    ADD CONSTRAINT check_bill_reconciliation_bank_account_id_fkey FOREIGN KEY (bank_account_id) REFERENCES public.bank_accounts(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: check_bill_reconciliation check_bill_reconciliation_check_bill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_reconciliation
    ADD CONSTRAINT check_bill_reconciliation_check_bill_id_fkey FOREIGN KEY (check_bill_id) REFERENCES public.checks_bills(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: check_bill_reconciliation check_bill_reconciliation_resolved_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_reconciliation
    ADD CONSTRAINT check_bill_reconciliation_resolved_by_id_fkey FOREIGN KEY (resolved_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: check_bill_reconciliation check_bill_reconciliation_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_reconciliation
    ADD CONSTRAINT check_bill_reconciliation_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: check_bill_reminders check_bill_reminders_check_bill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_reminders
    ADD CONSTRAINT check_bill_reminders_check_bill_id_fkey FOREIGN KEY (check_bill_id) REFERENCES public.checks_bills(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: check_bill_reminders check_bill_reminders_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_reminders
    ADD CONSTRAINT check_bill_reminders_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: check_bill_risk_limits check_bill_risk_limits_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_risk_limits
    ADD CONSTRAINT check_bill_risk_limits_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: check_bill_risk_limits check_bill_risk_limits_approved_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_risk_limits
    ADD CONSTRAINT check_bill_risk_limits_approved_by_id_fkey FOREIGN KEY (approved_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: check_bill_risk_limits check_bill_risk_limits_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.check_bill_risk_limits
    ADD CONSTRAINT check_bill_risk_limits_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: checks_bills checks_bills_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.checks_bills
    ADD CONSTRAINT checks_bills_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: checks_bills checks_bills_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.checks_bills
    ADD CONSTRAINT checks_bills_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: checks_bills checks_bills_collection_cashbox_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.checks_bills
    ADD CONSTRAINT checks_bills_collection_cashbox_id_fkey FOREIGN KEY (collection_cashbox_id) REFERENCES public.cashboxes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: checks_bills checks_bills_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.checks_bills
    ADD CONSTRAINT checks_bills_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: checks_bills checks_bills_current_holder_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.checks_bills
    ADD CONSTRAINT checks_bills_current_holder_id_fkey FOREIGN KEY (current_holder_id) REFERENCES public.accounts(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: checks_bills checks_bills_deleted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.checks_bills
    ADD CONSTRAINT checks_bills_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: checks_bills checks_bills_last_journal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.checks_bills
    ADD CONSTRAINT checks_bills_last_journal_id_fkey FOREIGN KEY (last_journal_id) REFERENCES public.check_bill_journals(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: checks_bills checks_bills_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.checks_bills
    ADD CONSTRAINT "checks_bills_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: checks_bills checks_bills_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.checks_bills
    ADD CONSTRAINT checks_bills_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: code_templates code_templates_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.code_templates
    ADD CONSTRAINT "code_templates_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: collections collections_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.collections
    ADD CONSTRAINT collections_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: collections collections_bank_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.collections
    ADD CONSTRAINT collections_bank_account_id_fkey FOREIGN KEY (bank_account_id) REFERENCES public.bank_accounts(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: collections collections_cashbox_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.collections
    ADD CONSTRAINT collections_cashbox_id_fkey FOREIGN KEY (cashbox_id) REFERENCES public.cashboxes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: collections collections_company_credit_card_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.collections
    ADD CONSTRAINT collections_company_credit_card_id_fkey FOREIGN KEY (company_credit_card_id) REFERENCES public.company_credit_cards(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: collections collections_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.collections
    ADD CONSTRAINT collections_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: collections collections_deleted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.collections
    ADD CONSTRAINT collections_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: collections collections_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.collections
    ADD CONSTRAINT collections_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: collections collections_sales_agent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.collections
    ADD CONSTRAINT collections_sales_agent_id_fkey FOREIGN KEY (sales_agent_id) REFERENCES public.sales_agents(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: collections collections_service_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.collections
    ADD CONSTRAINT collections_service_invoice_id_fkey FOREIGN KEY (service_invoice_id) REFERENCES public.service_invoices(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: collections collections_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.collections
    ADD CONSTRAINT "collections_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: company_credit_card_movements company_credit_card_movements_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_credit_card_movements
    ADD CONSTRAINT company_credit_card_movements_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: company_credit_card_movements company_credit_card_movements_card_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_credit_card_movements
    ADD CONSTRAINT company_credit_card_movements_card_id_fkey FOREIGN KEY (card_id) REFERENCES public.company_credit_cards(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: company_credit_card_reminders company_credit_card_reminders_card_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_credit_card_reminders
    ADD CONSTRAINT company_credit_card_reminders_card_id_fkey FOREIGN KEY (card_id) REFERENCES public.company_credit_cards(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: company_credit_cards company_credit_cards_cashbox_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_credit_cards
    ADD CONSTRAINT company_credit_cards_cashbox_id_fkey FOREIGN KEY (cashbox_id) REFERENCES public.cashboxes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: company_vehicles company_vehicles_assigned_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_vehicles
    ADD CONSTRAINT company_vehicles_assigned_employee_id_fkey FOREIGN KEY (assigned_employee_id) REFERENCES public.employees(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: company_vehicles company_vehicles_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_vehicles
    ADD CONSTRAINT "company_vehicles_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: coupon_redemptions coupon_redemptions_coupon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupon_redemptions
    ADD CONSTRAINT coupon_redemptions_coupon_id_fkey FOREIGN KEY (coupon_id) REFERENCES public.coupons(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: coupon_redemptions coupon_redemptions_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupon_redemptions
    ADD CONSTRAINT coupon_redemptions_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: customer_vehicles customer_vehicles_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_vehicles
    ADD CONSTRAINT customer_vehicles_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: customer_vehicles customer_vehicles_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_vehicles
    ADD CONSTRAINT "customer_vehicles_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: deleted_bank_transfers deleted_bank_transfers_deleted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.deleted_bank_transfers
    ADD CONSTRAINT deleted_bank_transfers_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: deleted_bank_transfers deleted_bank_transfers_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.deleted_bank_transfers
    ADD CONSTRAINT deleted_bank_transfers_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: deleted_checks_bills deleted_checks_bills_deleted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.deleted_checks_bills
    ADD CONSTRAINT deleted_checks_bills_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: departments departments_manager_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_manager_id_fkey FOREIGN KEY (manager_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: departments departments_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.departments(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: departments departments_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: einvoice_inbox einvoice_inbox_matched_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.einvoice_inbox
    ADD CONSTRAINT einvoice_inbox_matched_invoice_id_fkey FOREIGN KEY (matched_invoice_id) REFERENCES public.invoices(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: einvoice_inbox einvoice_inbox_processed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.einvoice_inbox
    ADD CONSTRAINT einvoice_inbox_processed_by_fkey FOREIGN KEY (processed_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: einvoice_inbox einvoice_inbox_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.einvoice_inbox
    ADD CONSTRAINT einvoice_inbox_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: einvoice_sends einvoice_sends_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.einvoice_sends
    ADD CONSTRAINT einvoice_sends_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: einvoice_sends einvoice_sends_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.einvoice_sends
    ADD CONSTRAINT einvoice_sends_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: einvoice_sends einvoice_sends_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.einvoice_sends
    ADD CONSTRAINT einvoice_sends_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: einvoice_tenant_configs einvoice_tenant_configs_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.einvoice_tenant_configs
    ADD CONSTRAINT einvoice_tenant_configs_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: einvoice_xml einvoice_xml_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.einvoice_xml
    ADD CONSTRAINT einvoice_xml_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: employee_payments employee_payments_cashbox_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_payments
    ADD CONSTRAINT employee_payments_cashbox_id_fkey FOREIGN KEY (cashbox_id) REFERENCES public.cashboxes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: employee_payments employee_payments_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_payments
    ADD CONSTRAINT employee_payments_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: employee_payments employee_payments_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_payments
    ADD CONSTRAINT employee_payments_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: employees employees_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: employees employees_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: employees employees_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT "employees_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: employees employees_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: equivalency_groups equivalency_groups_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equivalency_groups
    ADD CONSTRAINT "equivalency_groups_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: expense_categories expense_categories_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expense_categories
    ADD CONSTRAINT "expense_categories_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: expenses expenses_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.expense_categories(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: expenses expenses_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT "expenses_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: feature_flags feature_flags_enabled_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feature_flags
    ADD CONSTRAINT feature_flags_enabled_by_fkey FOREIGN KEY (enabled_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: feature_flags feature_flags_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feature_flags
    ADD CONSTRAINT feature_flags_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: inventory_transactions inventory_transactions_partRequestId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_transactions
    ADD CONSTRAINT "inventory_transactions_partRequestId_fkey" FOREIGN KEY ("partRequestId") REFERENCES public.part_requests(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: inventory_transactions inventory_transactions_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_transactions
    ADD CONSTRAINT inventory_transactions_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: inventory_transactions inventory_transactions_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_transactions
    ADD CONSTRAINT "inventory_transactions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: inventory_transactions inventory_transactions_warehouseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_transactions
    ADD CONSTRAINT "inventory_transactions_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES public.warehouses(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: invitations invitations_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invitations
    ADD CONSTRAINT "invitations_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: invoice_collections invoice_collections_collection_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_collections
    ADD CONSTRAINT invoice_collections_collection_id_fkey FOREIGN KEY (collection_id) REFERENCES public.collections(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: invoice_collections invoice_collections_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_collections
    ADD CONSTRAINT invoice_collections_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: invoice_collections invoice_collections_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_collections
    ADD CONSTRAINT "invoice_collections_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: invoice_items invoice_items_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_items
    ADD CONSTRAINT invoice_items_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: invoice_items invoice_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_items
    ADD CONSTRAINT invoice_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: invoice_items invoice_items_purchase_order_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_items
    ADD CONSTRAINT invoice_items_purchase_order_item_id_fkey FOREIGN KEY (purchase_order_item_id) REFERENCES public.purchase_order_items(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: invoice_logs invoice_logs_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_logs
    ADD CONSTRAINT invoice_logs_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: invoice_logs invoice_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_logs
    ADD CONSTRAINT invoice_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: invoice_payment_plans invoice_payment_plans_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_payment_plans
    ADD CONSTRAINT invoice_payment_plans_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: invoice_profit invoice_profit_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_profit
    ADD CONSTRAINT invoice_profit_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: invoice_profit invoice_profit_invoice_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_profit
    ADD CONSTRAINT invoice_profit_invoice_item_id_fkey FOREIGN KEY (invoice_item_id) REFERENCES public.invoice_items(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: invoice_profit invoice_profit_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_profit
    ADD CONSTRAINT invoice_profit_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: invoice_profit invoice_profit_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_profit
    ADD CONSTRAINT "invoice_profit_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: invoices invoices_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: invoices invoices_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: invoices invoices_deleted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: invoices invoices_delivery_note_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_delivery_note_id_fkey FOREIGN KEY (delivery_note_id) REFERENCES public.sales_delivery_notes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: invoices invoices_procurement_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_procurement_order_id_fkey FOREIGN KEY (procurement_order_id) REFERENCES public.procurement_orders(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: invoices invoices_purchase_delivery_note_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_purchase_delivery_note_id_fkey FOREIGN KEY (purchase_delivery_note_id) REFERENCES public.purchase_delivery_notes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: invoices invoices_purchase_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_purchase_order_id_fkey FOREIGN KEY (purchase_order_id) REFERENCES public.purchase_orders(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: invoices invoices_sales_agent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_sales_agent_id_fkey FOREIGN KEY (sales_agent_id) REFERENCES public.sales_agents(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: invoices invoices_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT "invoices_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: invoices invoices_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: invoices invoices_warehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_warehouse_id_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: journal_entries journal_entries_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journal_entries
    ADD CONSTRAINT "journal_entries_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: journal_entries journal_entries_serviceInvoiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journal_entries
    ADD CONSTRAINT "journal_entries_serviceInvoiceId_fkey" FOREIGN KEY ("serviceInvoiceId") REFERENCES public.service_invoices(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: journal_entries journal_entries_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journal_entries
    ADD CONSTRAINT "journal_entries_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: journal_entry_lines journal_entry_lines_journalEntryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journal_entry_lines
    ADD CONSTRAINT "journal_entry_lines_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES public.journal_entries(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: leave_requests leave_requests_approved_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_requests
    ADD CONSTRAINT leave_requests_approved_by_id_fkey FOREIGN KEY (approved_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: leave_requests leave_requests_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_requests
    ADD CONSTRAINT leave_requests_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: leave_requests leave_requests_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_requests
    ADD CONSTRAINT leave_requests_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: leave_requests leave_requests_leave_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_requests
    ADD CONSTRAINT leave_requests_leave_type_id_fkey FOREIGN KEY (leave_type_id) REFERENCES public.leave_types(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: leave_requests leave_requests_rejected_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_requests
    ADD CONSTRAINT leave_requests_rejected_by_id_fkey FOREIGN KEY (rejected_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: leave_requests leave_requests_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_requests
    ADD CONSTRAINT leave_requests_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: leave_types leave_types_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_types
    ADD CONSTRAINT leave_types_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: locations locations_warehouseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT "locations_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES public.warehouses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: module_licenses module_licenses_moduleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.module_licenses
    ADD CONSTRAINT "module_licenses_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES public.modules(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: module_licenses module_licenses_subscriptionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.module_licenses
    ADD CONSTRAINT "module_licenses_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES public.subscriptions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_pickings order_pickings_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_pickings
    ADD CONSTRAINT order_pickings_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: order_pickings order_pickings_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_pickings
    ADD CONSTRAINT order_pickings_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.sales_orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_pickings order_pickings_order_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_pickings
    ADD CONSTRAINT order_pickings_order_item_id_fkey FOREIGN KEY (order_item_id) REFERENCES public.sales_order_items(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_pickings order_pickings_picked_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_pickings
    ADD CONSTRAINT order_pickings_picked_by_fkey FOREIGN KEY (picked_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: overtime_records overtime_records_approved_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.overtime_records
    ADD CONSTRAINT overtime_records_approved_by_id_fkey FOREIGN KEY (approved_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: overtime_records overtime_records_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.overtime_records
    ADD CONSTRAINT overtime_records_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: overtime_records overtime_records_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.overtime_records
    ADD CONSTRAINT overtime_records_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: overtime_records overtime_records_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.overtime_records
    ADD CONSTRAINT overtime_records_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: part_requests part_requests_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.part_requests
    ADD CONSTRAINT part_requests_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: part_requests part_requests_requestedBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.part_requests
    ADD CONSTRAINT "part_requests_requestedBy_fkey" FOREIGN KEY ("requestedBy") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: part_requests part_requests_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.part_requests
    ADD CONSTRAINT "part_requests_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: part_requests part_requests_workOrderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.part_requests
    ADD CONSTRAINT "part_requests_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES public.work_orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: payments payments_subscriptionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES public.subscriptions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: performance_reviews performance_reviews_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.performance_reviews
    ADD CONSTRAINT performance_reviews_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: performance_reviews performance_reviews_reviewer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.performance_reviews
    ADD CONSTRAINT performance_reviews_reviewer_id_fkey FOREIGN KEY (reviewer_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: performance_reviews performance_reviews_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.performance_reviews
    ADD CONSTRAINT performance_reviews_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: pos_payments pos_payments_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pos_payments
    ADD CONSTRAINT pos_payments_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: pos_payments pos_payments_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pos_payments
    ADD CONSTRAINT "pos_payments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: pos_sessions pos_sessions_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pos_sessions
    ADD CONSTRAINT "pos_sessions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: preventive_maintenances preventive_maintenances_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.preventive_maintenances
    ADD CONSTRAINT preventive_maintenances_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: preventive_maintenances preventive_maintenances_customer_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.preventive_maintenances
    ADD CONSTRAINT preventive_maintenances_customer_vehicle_id_fkey FOREIGN KEY (customer_vehicle_id) REFERENCES public.customer_vehicles(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: preventive_maintenances preventive_maintenances_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.preventive_maintenances
    ADD CONSTRAINT preventive_maintenances_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: preventive_maintenances preventive_maintenances_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.preventive_maintenances
    ADD CONSTRAINT preventive_maintenances_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.company_vehicles(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: price_cards price_cards_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_cards
    ADD CONSTRAINT price_cards_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: price_cards price_cards_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_cards
    ADD CONSTRAINT price_cards_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: price_cards price_cards_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_cards
    ADD CONSTRAINT price_cards_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: price_cards price_cards_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_cards
    ADD CONSTRAINT price_cards_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: price_list_items price_list_items_price_list_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_list_items
    ADD CONSTRAINT price_list_items_price_list_id_fkey FOREIGN KEY (price_list_id) REFERENCES public.price_lists(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: price_list_items price_list_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_list_items
    ADD CONSTRAINT price_list_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: price_lists price_lists_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_lists
    ADD CONSTRAINT "price_lists_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: procurement_orders procurement_orders_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procurement_orders
    ADD CONSTRAINT procurement_orders_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: procurement_orders procurement_orders_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procurement_orders
    ADD CONSTRAINT procurement_orders_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: procurement_orders procurement_orders_deleted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procurement_orders
    ADD CONSTRAINT procurement_orders_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: procurement_orders procurement_orders_deliveryNoteId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procurement_orders
    ADD CONSTRAINT "procurement_orders_deliveryNoteId_fkey" FOREIGN KEY ("deliveryNoteId") REFERENCES public.purchase_delivery_notes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: procurement_orders procurement_orders_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procurement_orders
    ADD CONSTRAINT "procurement_orders_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: procurement_orders procurement_orders_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procurement_orders
    ADD CONSTRAINT procurement_orders_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: product_barcodes product_barcodes_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_barcodes
    ADD CONSTRAINT "product_barcodes_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_costing_configs product_costing_configs_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_costing_configs
    ADD CONSTRAINT product_costing_configs_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_costing_configs product_costing_configs_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_costing_configs
    ADD CONSTRAINT product_costing_configs_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_equivalents product_equivalents_product1_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_equivalents
    ADD CONSTRAINT product_equivalents_product1_id_fkey FOREIGN KEY (product1_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_equivalents product_equivalents_product2_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_equivalents
    ADD CONSTRAINT product_equivalents_product2_id_fkey FOREIGN KEY (product2_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_location_stocks product_location_stocks_locationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_location_stocks
    ADD CONSTRAINT "product_location_stocks_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES public.locations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_location_stocks product_location_stocks_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_location_stocks
    ADD CONSTRAINT "product_location_stocks_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_location_stocks product_location_stocks_warehouseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_location_stocks
    ADD CONSTRAINT "product_location_stocks_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES public.warehouses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_lots product_lots_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_lots
    ADD CONSTRAINT product_lots_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_lots product_lots_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_lots
    ADD CONSTRAINT product_lots_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_lots product_lots_warehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_lots
    ADD CONSTRAINT product_lots_warehouse_id_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: product_movements product_movements_deleted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_movements
    ADD CONSTRAINT product_movements_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: product_movements product_movements_invoice_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_movements
    ADD CONSTRAINT product_movements_invoice_item_id_fkey FOREIGN KEY (invoice_item_id) REFERENCES public.invoice_items(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: product_movements product_movements_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_movements
    ADD CONSTRAINT product_movements_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_movements product_movements_reversal_of_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_movements
    ADD CONSTRAINT product_movements_reversal_of_id_fkey FOREIGN KEY (reversal_of_id) REFERENCES public.product_movements(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: product_movements product_movements_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_movements
    ADD CONSTRAINT "product_movements_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_movements product_movements_warehouseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_movements
    ADD CONSTRAINT "product_movements_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES public.warehouses(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: product_shelves product_shelves_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_shelves
    ADD CONSTRAINT product_shelves_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_shelves product_shelves_shelf_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_shelves
    ADD CONSTRAINT product_shelves_shelf_id_fkey FOREIGN KEY (shelf_id) REFERENCES public.shelves(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_vehicle_compatibilities product_vehicle_compatibilities_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_vehicle_compatibilities
    ADD CONSTRAINT product_vehicle_compatibilities_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_vehicle_compatibilities product_vehicle_compatibilities_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_vehicle_compatibilities
    ADD CONSTRAINT product_vehicle_compatibilities_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: products products_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: products products_equivalency_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_equivalency_group_id_fkey FOREIGN KEY (equivalency_group_id) REFERENCES public.equivalency_groups(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: products products_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "products_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: products products_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: purchase_delivery_note_items purchase_delivery_note_items_delivery_note_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_delivery_note_items
    ADD CONSTRAINT purchase_delivery_note_items_delivery_note_id_fkey FOREIGN KEY (delivery_note_id) REFERENCES public.purchase_delivery_notes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: purchase_delivery_note_items purchase_delivery_note_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_delivery_note_items
    ADD CONSTRAINT purchase_delivery_note_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: purchase_delivery_note_logs purchase_delivery_note_logs_delivery_note_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_delivery_note_logs
    ADD CONSTRAINT purchase_delivery_note_logs_delivery_note_id_fkey FOREIGN KEY (delivery_note_id) REFERENCES public.purchase_delivery_notes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: purchase_delivery_note_logs purchase_delivery_note_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_delivery_note_logs
    ADD CONSTRAINT purchase_delivery_note_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: purchase_delivery_notes purchase_delivery_notes_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_delivery_notes
    ADD CONSTRAINT purchase_delivery_notes_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: purchase_delivery_notes purchase_delivery_notes_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_delivery_notes
    ADD CONSTRAINT purchase_delivery_notes_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: purchase_delivery_notes purchase_delivery_notes_deleted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_delivery_notes
    ADD CONSTRAINT purchase_delivery_notes_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: purchase_delivery_notes purchase_delivery_notes_source_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_delivery_notes
    ADD CONSTRAINT purchase_delivery_notes_source_id_fkey FOREIGN KEY (source_id) REFERENCES public.procurement_orders(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: purchase_delivery_notes purchase_delivery_notes_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_delivery_notes
    ADD CONSTRAINT "purchase_delivery_notes_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: purchase_delivery_notes purchase_delivery_notes_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_delivery_notes
    ADD CONSTRAINT purchase_delivery_notes_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: purchase_delivery_notes purchase_delivery_notes_warehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_delivery_notes
    ADD CONSTRAINT purchase_delivery_notes_warehouse_id_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: purchase_order_items purchase_order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order_items
    ADD CONSTRAINT purchase_order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: purchase_order_items purchase_order_items_purchase_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order_items
    ADD CONSTRAINT purchase_order_items_purchase_order_id_fkey FOREIGN KEY (purchase_order_id) REFERENCES public.purchase_orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: purchase_order_local_items purchase_order_local_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order_local_items
    ADD CONSTRAINT purchase_order_local_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.procurement_orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: purchase_order_local_items purchase_order_local_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order_local_items
    ADD CONSTRAINT purchase_order_local_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: purchase_order_local_logs purchase_order_local_logs_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order_local_logs
    ADD CONSTRAINT purchase_order_local_logs_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.procurement_orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: purchase_order_local_logs purchase_order_local_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order_local_logs
    ADD CONSTRAINT purchase_order_local_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: purchase_orders purchase_orders_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.accounts(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: purchase_orders purchase_orders_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT "purchase_orders_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: quote_items quote_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quote_items
    ADD CONSTRAINT quote_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: quote_items quote_items_quote_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quote_items
    ADD CONSTRAINT quote_items_quote_id_fkey FOREIGN KEY (quote_id) REFERENCES public.quotes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: quote_logs quote_logs_quote_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quote_logs
    ADD CONSTRAINT quote_logs_quote_id_fkey FOREIGN KEY (quote_id) REFERENCES public.quotes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: quote_logs quote_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quote_logs
    ADD CONSTRAINT quote_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: quotes quotes_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quotes
    ADD CONSTRAINT quotes_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: quotes quotes_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quotes
    ADD CONSTRAINT quotes_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: quotes quotes_deleted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quotes
    ADD CONSTRAINT quotes_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: quotes quotes_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quotes
    ADD CONSTRAINT quotes_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.sales_orders(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: quotes quotes_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quotes
    ADD CONSTRAINT "quotes_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: quotes quotes_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quotes
    ADD CONSTRAINT quotes_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: role_permissions role_permissions_permissionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES public.permissions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: roles roles_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT "roles_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: salary_payment_details salary_payment_details_bank_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary_payment_details
    ADD CONSTRAINT salary_payment_details_bank_account_id_fkey FOREIGN KEY (bank_account_id) REFERENCES public.bank_accounts(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: salary_payment_details salary_payment_details_cashbox_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary_payment_details
    ADD CONSTRAINT salary_payment_details_cashbox_id_fkey FOREIGN KEY (cashbox_id) REFERENCES public.cashboxes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: salary_payment_details salary_payment_details_salary_payment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary_payment_details
    ADD CONSTRAINT salary_payment_details_salary_payment_id_fkey FOREIGN KEY (salary_payment_id) REFERENCES public.salary_payments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: salary_payment_details salary_payment_details_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary_payment_details
    ADD CONSTRAINT "salary_payment_details_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: salary_payments salary_payments_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary_payments
    ADD CONSTRAINT salary_payments_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: salary_payments salary_payments_deleted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary_payments
    ADD CONSTRAINT salary_payments_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: salary_payments salary_payments_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary_payments
    ADD CONSTRAINT salary_payments_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: salary_payments salary_payments_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary_payments
    ADD CONSTRAINT salary_payments_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.salary_plans(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: salary_payments salary_payments_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary_payments
    ADD CONSTRAINT "salary_payments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: salary_plans salary_plans_deleted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary_plans
    ADD CONSTRAINT salary_plans_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: salary_plans salary_plans_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary_plans
    ADD CONSTRAINT salary_plans_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: salary_plans salary_plans_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary_plans
    ADD CONSTRAINT "salary_plans_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sales_agents sales_agents_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_agents
    ADD CONSTRAINT "sales_agents_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sales_delivery_note_items sales_delivery_note_items_delivery_note_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_delivery_note_items
    ADD CONSTRAINT sales_delivery_note_items_delivery_note_id_fkey FOREIGN KEY (delivery_note_id) REFERENCES public.sales_delivery_notes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sales_delivery_note_items sales_delivery_note_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_delivery_note_items
    ADD CONSTRAINT sales_delivery_note_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: sales_delivery_note_logs sales_delivery_note_logs_delivery_note_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_delivery_note_logs
    ADD CONSTRAINT sales_delivery_note_logs_delivery_note_id_fkey FOREIGN KEY (delivery_note_id) REFERENCES public.sales_delivery_notes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sales_delivery_note_logs sales_delivery_note_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_delivery_note_logs
    ADD CONSTRAINT sales_delivery_note_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: sales_delivery_notes sales_delivery_notes_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_delivery_notes
    ADD CONSTRAINT sales_delivery_notes_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: sales_delivery_notes sales_delivery_notes_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_delivery_notes
    ADD CONSTRAINT sales_delivery_notes_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: sales_delivery_notes sales_delivery_notes_deleted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_delivery_notes
    ADD CONSTRAINT sales_delivery_notes_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: sales_delivery_notes sales_delivery_notes_source_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_delivery_notes
    ADD CONSTRAINT sales_delivery_notes_source_id_fkey FOREIGN KEY (source_id) REFERENCES public.sales_orders(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: sales_delivery_notes sales_delivery_notes_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_delivery_notes
    ADD CONSTRAINT "sales_delivery_notes_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sales_delivery_notes sales_delivery_notes_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_delivery_notes
    ADD CONSTRAINT sales_delivery_notes_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: sales_delivery_notes sales_delivery_notes_warehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_delivery_notes
    ADD CONSTRAINT sales_delivery_notes_warehouse_id_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: sales_order_items sales_order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_order_items
    ADD CONSTRAINT sales_order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.sales_orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sales_order_items sales_order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_order_items
    ADD CONSTRAINT sales_order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: sales_order_logs sales_order_logs_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_order_logs
    ADD CONSTRAINT sales_order_logs_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.sales_orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sales_order_logs sales_order_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_order_logs
    ADD CONSTRAINT sales_order_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: sales_orders sales_orders_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_orders
    ADD CONSTRAINT sales_orders_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: sales_orders sales_orders_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_orders
    ADD CONSTRAINT sales_orders_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: sales_orders sales_orders_deleted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_orders
    ADD CONSTRAINT sales_orders_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: sales_orders sales_orders_deliveryNoteId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_orders
    ADD CONSTRAINT "sales_orders_deliveryNoteId_fkey" FOREIGN KEY ("deliveryNoteId") REFERENCES public.sales_delivery_notes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: sales_orders sales_orders_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_orders
    ADD CONSTRAINT "sales_orders_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sales_orders sales_orders_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_orders
    ADD CONSTRAINT sales_orders_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: service_invoices service_invoices_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_invoices
    ADD CONSTRAINT service_invoices_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: service_invoices service_invoices_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_invoices
    ADD CONSTRAINT "service_invoices_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: service_invoices service_invoices_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_invoices
    ADD CONSTRAINT "service_invoices_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: service_invoices service_invoices_workOrderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_invoices
    ADD CONSTRAINT "service_invoices_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES public.work_orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: service_templates service_templates_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_templates
    ADD CONSTRAINT service_templates_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: service_templates service_templates_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_templates
    ADD CONSTRAINT service_templates_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sessions sessions_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: shelves shelves_warehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shelves
    ADD CONSTRAINT shelves_warehouse_id_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: simple_orders simple_orders_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.simple_orders
    ADD CONSTRAINT simple_orders_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.accounts(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: simple_orders simple_orders_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.simple_orders
    ADD CONSTRAINT simple_orders_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: simple_orders simple_orders_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.simple_orders
    ADD CONSTRAINT "simple_orders_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: stock_cost_history stock_cost_history_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_cost_history
    ADD CONSTRAINT stock_cost_history_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: stock_moves stock_moves_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_moves
    ADD CONSTRAINT "stock_moves_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: stock_moves stock_moves_fromLocationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_moves
    ADD CONSTRAINT "stock_moves_fromLocationId_fkey" FOREIGN KEY ("fromLocationId") REFERENCES public.locations(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: stock_moves stock_moves_fromWarehouseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_moves
    ADD CONSTRAINT "stock_moves_fromWarehouseId_fkey" FOREIGN KEY ("fromWarehouseId") REFERENCES public.warehouses(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: stock_moves stock_moves_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_moves
    ADD CONSTRAINT "stock_moves_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: stock_moves stock_moves_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_moves
    ADD CONSTRAINT "stock_moves_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: stock_moves stock_moves_toLocationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_moves
    ADD CONSTRAINT "stock_moves_toLocationId_fkey" FOREIGN KEY ("toLocationId") REFERENCES public.locations(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: stock_moves stock_moves_toWarehouseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_moves
    ADD CONSTRAINT "stock_moves_toWarehouseId_fkey" FOREIGN KEY ("toWarehouseId") REFERENCES public.warehouses(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: stocktake_items stocktake_items_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stocktake_items
    ADD CONSTRAINT stocktake_items_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: stocktake_items stocktake_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stocktake_items
    ADD CONSTRAINT stocktake_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: stocktake_items stocktake_items_stocktake_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stocktake_items
    ADD CONSTRAINT stocktake_items_stocktake_id_fkey FOREIGN KEY (stocktake_id) REFERENCES public.stocktakes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: stocktakes stocktakes_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stocktakes
    ADD CONSTRAINT stocktakes_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: stocktakes stocktakes_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stocktakes
    ADD CONSTRAINT stocktakes_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: stocktakes stocktakes_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stocktakes
    ADD CONSTRAINT "stocktakes_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: stocktakes stocktakes_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stocktakes
    ADD CONSTRAINT stocktakes_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: subscriptions subscriptions_planId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT "subscriptions_planId_fkey" FOREIGN KEY ("planId") REFERENCES public.plans(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: subscriptions subscriptions_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT "subscriptions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: system_parameters system_parameters_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_parameters
    ADD CONSTRAINT "system_parameters_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: technician_metrics technician_metrics_technician_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.technician_metrics
    ADD CONSTRAINT technician_metrics_technician_id_fkey FOREIGN KEY (technician_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: technician_metrics technician_metrics_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.technician_metrics
    ADD CONSTRAINT technician_metrics_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tenant_onboardings tenant_onboardings_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenant_onboardings
    ADD CONSTRAINT tenant_onboardings_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tenant_purge_audits tenant_purge_audits_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenant_purge_audits
    ADD CONSTRAINT "tenant_purge_audits_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tenant_settings tenant_settings_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenant_settings
    ADD CONSTRAINT "tenant_settings_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tenant_usage_metrics tenant_usage_metrics_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenant_usage_metrics
    ADD CONSTRAINT tenant_usage_metrics_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: unit_sets unit_sets_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit_sets
    ADD CONSTRAINT unit_sets_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: units units_unit_set_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.units
    ADD CONSTRAINT units_unit_set_id_fkey FOREIGN KEY (unit_set_id) REFERENCES public.unit_sets(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_licenses user_licenses_moduleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_licenses
    ADD CONSTRAINT "user_licenses_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES public.modules(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: user_licenses user_licenses_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_licenses
    ADD CONSTRAINT "user_licenses_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users users_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: users users_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: vehicle_expenses vehicle_expenses_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_expenses
    ADD CONSTRAINT "vehicle_expenses_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: vehicle_expenses vehicle_expenses_vehicleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_expenses
    ADD CONSTRAINT "vehicle_expenses_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES public.company_vehicles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: warehouse_critical_stocks warehouse_critical_stocks_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouse_critical_stocks
    ADD CONSTRAINT "warehouse_critical_stocks_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: warehouse_critical_stocks warehouse_critical_stocks_warehouseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouse_critical_stocks
    ADD CONSTRAINT "warehouse_critical_stocks_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES public.warehouses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: warehouse_stock_thresholds warehouse_stock_thresholds_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouse_stock_thresholds
    ADD CONSTRAINT warehouse_stock_thresholds_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: warehouse_stock_thresholds warehouse_stock_thresholds_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouse_stock_thresholds
    ADD CONSTRAINT warehouse_stock_thresholds_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: warehouse_stock_thresholds warehouse_stock_thresholds_warehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouse_stock_thresholds
    ADD CONSTRAINT warehouse_stock_thresholds_warehouse_id_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: warehouse_transfer_items warehouse_transfer_items_fromLocationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouse_transfer_items
    ADD CONSTRAINT "warehouse_transfer_items_fromLocationId_fkey" FOREIGN KEY ("fromLocationId") REFERENCES public.locations(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: warehouse_transfer_items warehouse_transfer_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouse_transfer_items
    ADD CONSTRAINT warehouse_transfer_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: warehouse_transfer_items warehouse_transfer_items_toLocationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouse_transfer_items
    ADD CONSTRAINT "warehouse_transfer_items_toLocationId_fkey" FOREIGN KEY ("toLocationId") REFERENCES public.locations(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: warehouse_transfer_items warehouse_transfer_items_transferId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouse_transfer_items
    ADD CONSTRAINT "warehouse_transfer_items_transferId_fkey" FOREIGN KEY ("transferId") REFERENCES public.warehouse_transfers(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: warehouse_transfer_logs warehouse_transfer_logs_transferId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouse_transfer_logs
    ADD CONSTRAINT "warehouse_transfer_logs_transferId_fkey" FOREIGN KEY ("transferId") REFERENCES public.warehouse_transfers(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: warehouse_transfer_logs warehouse_transfer_logs_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouse_transfer_logs
    ADD CONSTRAINT "warehouse_transfer_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: warehouse_transfers warehouse_transfers_approved_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouse_transfers
    ADD CONSTRAINT warehouse_transfers_approved_by_id_fkey FOREIGN KEY (approved_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: warehouse_transfers warehouse_transfers_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouse_transfers
    ADD CONSTRAINT "warehouse_transfers_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: warehouse_transfers warehouse_transfers_deletedBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouse_transfers
    ADD CONSTRAINT "warehouse_transfers_deletedBy_fkey" FOREIGN KEY ("deletedBy") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: warehouse_transfers warehouse_transfers_fromWarehouseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouse_transfers
    ADD CONSTRAINT "warehouse_transfers_fromWarehouseId_fkey" FOREIGN KEY ("fromWarehouseId") REFERENCES public.warehouses(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: warehouse_transfers warehouse_transfers_prepared_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouse_transfers
    ADD CONSTRAINT warehouse_transfers_prepared_by_id_fkey FOREIGN KEY (prepared_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: warehouse_transfers warehouse_transfers_received_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouse_transfers
    ADD CONSTRAINT warehouse_transfers_received_by_id_fkey FOREIGN KEY (received_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: warehouse_transfers warehouse_transfers_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouse_transfers
    ADD CONSTRAINT "warehouse_transfers_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: warehouse_transfers warehouse_transfers_toWarehouseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouse_transfers
    ADD CONSTRAINT "warehouse_transfers_toWarehouseId_fkey" FOREIGN KEY ("toWarehouseId") REFERENCES public.warehouses(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: warehouse_transfers warehouse_transfers_updatedBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouse_transfers
    ADD CONSTRAINT "warehouse_transfers_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: warehouses warehouses_manager_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouses
    ADD CONSTRAINT warehouses_manager_id_fkey FOREIGN KEY (manager_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: warehouses warehouses_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouses
    ADD CONSTRAINT "warehouses_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: webhook_endpoints webhook_endpoints_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.webhook_endpoints
    ADD CONSTRAINT webhook_endpoints_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: webhook_endpoints webhook_endpoints_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.webhook_endpoints
    ADD CONSTRAINT webhook_endpoints_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: work_order_activities work_order_activities_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_order_activities
    ADD CONSTRAINT "work_order_activities_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: work_order_activities work_order_activities_workOrderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_order_activities
    ADD CONSTRAINT "work_order_activities_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES public.work_orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: work_order_items work_order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_order_items
    ADD CONSTRAINT work_order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: work_order_items work_order_items_workOrderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_order_items
    ADD CONSTRAINT "work_order_items_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES public.work_orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: work_order_warranties work_order_warranties_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_order_warranties
    ADD CONSTRAINT work_order_warranties_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: work_order_warranties work_order_warranties_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_order_warranties
    ADD CONSTRAINT work_order_warranties_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: work_order_warranties work_order_warranties_work_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_order_warranties
    ADD CONSTRAINT work_order_warranties_work_order_id_fkey FOREIGN KEY (work_order_id) REFERENCES public.work_orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: work_orders work_orders_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_orders
    ADD CONSTRAINT work_orders_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: work_orders work_orders_customerVehicleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_orders
    ADD CONSTRAINT "work_orders_customerVehicleId_fkey" FOREIGN KEY ("customerVehicleId") REFERENCES public.customer_vehicles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: work_orders work_orders_deleted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_orders
    ADD CONSTRAINT work_orders_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: work_orders work_orders_service_template_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_orders
    ADD CONSTRAINT work_orders_service_template_id_fkey FOREIGN KEY (service_template_id) REFERENCES public.service_templates(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: work_orders work_orders_technicianId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_orders
    ADD CONSTRAINT "work_orders_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: work_orders work_orders_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_orders
    ADD CONSTRAINT "work_orders_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: work_orders work_orders_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_orders
    ADD CONSTRAINT work_orders_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict xQb6EJOwmevcNW935EJO9b43fUmznVrwSnYHnfoLgVLT0Oal4WcVzWLetZuI0na

