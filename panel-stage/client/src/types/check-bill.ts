export enum CheckBillType {
    CHECK = 'CHECK',
    PROMISSORY = 'PROMISSORY',
}

export enum PortfolioType {
    CREDIT = 'CREDIT',
    DEBIT = 'DEBIT',
}

export enum CheckBillStatus {
    IN_PORTFOLIO = 'IN_PORTFOLIO',
    UNPAID = 'UNPAID',
    /** Doc v2: bankaya tevdi (DB: eski GIVEN_TO_BANK) */
    SENT_TO_BANK = 'SENT_TO_BANK',
    COLLECTED = 'COLLECTED',
    PAID = 'PAID',
    ENDORSED = 'ENDORSED',
    RETURNED = 'RETURNED',
    WITHOUT_COVERAGE = 'WITHOUT_COVERAGE',
    IN_BANK_COLLECTION = 'IN_BANK_COLLECTION',
    IN_BANK_GUARANTEE = 'IN_BANK_GUARANTEE',
    PARTIAL_PAID = 'PARTIAL_PAID',
    PROTESTED = 'PROTESTED',
    DISCOUNTED = 'DISCOUNTED',
    LEGAL_FOLLOWUP = 'LEGAL_FOLLOWUP',
    WRITTEN_OFF = 'WRITTEN_OFF',
    CANCELLED = 'CANCELLED',
    RECOURSE = 'RECOURSE',
    GIVEN_TO_CUSTOMER = 'GIVEN_TO_CUSTOMER',
}

export enum JournalType {
    ENTRY_PAYROLL = 'ENTRY_PAYROLL',
    EXIT_PAYROLL = 'EXIT_PAYROLL',
    CUSTOMER_DOCUMENT_ENTRY = 'CUSTOMER_DOCUMENT_ENTRY',
    CUSTOMER_DOCUMENT_EXIT = 'CUSTOMER_DOCUMENT_EXIT',
    OWN_DOCUMENT_ENTRY = 'OWN_DOCUMENT_ENTRY',
    OWN_DOCUMENT_EXIT = 'OWN_DOCUMENT_EXIT',
    BANK_COLLECTION_ENDORSEMENT = 'BANK_COLLECTION_ENDORSEMENT',
    BANK_GUARANTEE_ENDORSEMENT = 'BANK_GUARANTEE_ENDORSEMENT',
    ACCOUNT_DOCUMENT_ENDORSEMENT = 'ACCOUNT_DOCUMENT_ENDORSEMENT',
    DEBIT_DOCUMENT_EXIT = 'DEBIT_DOCUMENT_EXIT',
    RETURN_PAYROLL = 'RETURN_PAYROLL',
    BANK_DISCOUNT_SUBMISSION = 'BANK_DISCOUNT_SUBMISSION',
    PARTIAL_COLLECTION = 'PARTIAL_COLLECTION',
    PROTEST_ENTRY = 'PROTEST_ENTRY',
    LEGAL_TRANSFER = 'LEGAL_TRANSFER',
    WRITE_OFF = 'WRITE_OFF',
    REVERSAL = 'REVERSAL',
    RETURN_FROM_BANK = 'RETURN_FROM_BANK',
}

export enum BankAccountType {
    DEMAND_DEPOSIT = 'DEMAND_DEPOSIT',
    LOAN = 'LOAN',
    POS = 'POS',
    COMPANY_CREDIT_CARD = 'COMPANY_CREDIT_CARD',
    TIME_DEPOSIT = 'TIME_DEPOSIT',
    INVESTMENT = 'INVESTMENT',
    GOLD = 'GOLD',
    CURRENCY = 'CURRENCY',
}

export interface Account {
    id: string;
    title: string;
    code?: string;
}

export interface BankAccount {
    id: string;
    name: string;
    bankName: string;
    iban?: string;
    type?: BankAccountType;
}

export interface Cashbox {
    id: string;
    name: string;
    isRetail?: boolean;
}

export interface CheckBillLog {
    id: string;
    checkBillId: string;
    fromStatus?: CheckBillStatus;
    toStatus: CheckBillStatus;
    journalId?: string;
    performedById?: string;
    notes?: string;
    createdAt: string;
}

export interface CheckBillEndorsement {
    id: string;
    checkBillId: string;
    sequence: number;
    fromAccountId: string;
    fromAccount: Account;
    toAccountId: string;
    toAccount: Account;
    endorsedAt: string;
    journalId: string;
}

export interface CheckBillCollection {
    id: string;
    checkBillId: string;
    collectedAmount: number;
    collectionDate: string;
    cashboxId?: string;
    cashbox?: Cashbox;
    bankAccountId?: string;
    bankAccount?: BankAccount;
    journalId: string;
    createdAt: string;
}

export interface CheckBill {
    id: string;
    tenantId: string;
    type: CheckBillType;
    portfolioType: PortfolioType;
    accountId: string;
    account: Account;
    amount: number;
    remainingAmount: number;
    dueDate: string;
    issueDate?: string;
    bank?: string;
    branch?: string;
    accountNo?: string;
    checkNo?: string;
    serialNo?: string;
    status: CheckBillStatus;
    currentHolderId?: string;
    currentHolder?: Account;
    isProtested: boolean;
    protestedAt?: string;
    isEndorsed: boolean;
    endorsementDate?: string;
    endorsedTo?: string;
    collectionDate?: string;
    notes?: string;
    lastJournalId?: string;
    /** Risk skoru (at-risk listesi) */
    riskScore?: number | null;
    createdAt: string;
    updatedAt: string;
    endorsements?: CheckBillEndorsement[];
    collections?: CheckBillCollection[];
    logs?: CheckBillLog[];
}

export interface CheckBillJournal {
    id: string;
    journalNo: string;
    type: JournalType;
    date: string;
    accountId?: string;
    account?: Account;
    bankAccountId?: string;
    bankAccount?: BankAccount;
    cashboxId?: string;
    cashbox?: Cashbox;
    notes?: string;
    totalAmount?: number;
    documentCount?: number;
    checkBills?: CheckBill[];
    createdAt: string;
}

export interface CheckBillFilters {
    type?: CheckBillType;
    portfolioType?: PortfolioType;
    status?: CheckBillStatus | CheckBillStatus[];
    accountId?: string;
    dueDateFrom?: string;
    dueDateTo?: string;
    isProtested?: boolean;
    search?: string;
    skip?: number;
    take?: number;
    sortBy?: 'dueDate' | 'amount' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}

export interface JournalFilters {
    type?: JournalType;
    dateFrom?: string;
    dateTo?: string;
    accountId?: string;
    search?: string;
}

export interface ChecksListResponse {
    items: CheckBill[];
    total: number;
    skip: number;
    take: number;
}

export interface CheckBillTimelineEvent {
    at: string;
    kind: string;
    title: string;
    payload?: Record<string, unknown>;
}

export interface CheckBillTimelineResponse {
    checkBillId: string;
    events: CheckBillTimelineEvent[];
}

export interface CheckBillGlEntryRow {
    id: string;
    checkBillId: string;
    accountingDate: string;
    debitAmount?: unknown;
    creditAmount?: unknown;
    debitAccountCode?: string;
    creditAccountCode?: string;
    description?: string | null;
    glJournalNo?: string;
}

export interface CheckBillDocumentsResponse {
    checkBillId: string;
    attachmentUrls?: string[] | null;
    tags?: string[] | null;
    internalRef?: string | null;
    externalRef?: string | null;
}
