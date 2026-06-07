import { Injectable } from '@nestjs/common';
import { JournalType } from '@prisma/client';
import { IJournalHandler } from './journal-handler.interface';
import { CreditEntryHandler } from './credit-entry.handler';
import { DebitEntryHandler } from './debit-entry.handler';
import { BankCollectionHandler } from './bank-collection.handler';
import { BankGuaranteeHandler } from './bank-guarantee.handler';
import { EndorsementHandler } from './endorsement.handler';
import { CollectionHandler } from './collection.handler';
import { DocumentExitHandler } from './document-exit.handler';
import { ReturnHandler } from './return.handler';
import { DiscountHandler } from './discount.handler';
import { ProtestHandler } from './protest.handler';
import { WriteOffHandler } from './write-off.handler';
import { ReversalJournalHandler } from './reversal-journal.handler';
import { LegalTransferHandler } from './legal-transfer.handler';

@Injectable()
export class HandlerRegistry {
    private readonly registry: Partial<Record<JournalType, IJournalHandler>>;

    constructor(
        private readonly creditEntryHandler: CreditEntryHandler,
        private readonly debitEntryHandler: DebitEntryHandler,
        private readonly bankCollectionHandler: BankCollectionHandler,
        private readonly bankGuaranteeHandler: BankGuaranteeHandler,
        private readonly endorsementHandler: EndorsementHandler,
        private readonly collectionHandler: CollectionHandler,
        private readonly documentExitHandler: DocumentExitHandler,
        private readonly returnHandler: ReturnHandler,
        private readonly discountHandler: DiscountHandler,
        private readonly protestHandler: ProtestHandler,
        private readonly writeOffHandler: WriteOffHandler,
        private readonly reversalJournalHandler: ReversalJournalHandler,
        private readonly legalTransferHandler: LegalTransferHandler,
    ) {
        this.registry = {
            [JournalType.CUSTOMER_DOCUMENT_ENTRY]: this.creditEntryHandler,
            [JournalType.OWN_DOCUMENT_ENTRY]: this.debitEntryHandler,
            [JournalType.BANK_COLLECTION_ENDORSEMENT]: this.bankCollectionHandler,
            [JournalType.BANK_GUARANTEE_ENDORSEMENT]: this.bankGuaranteeHandler,
            [JournalType.ACCOUNT_DOCUMENT_ENDORSEMENT]: this.endorsementHandler,
            [JournalType.CUSTOMER_DOCUMENT_EXIT]: this.documentExitHandler,
            [JournalType.OWN_DOCUMENT_EXIT]: this.documentExitHandler,
            [JournalType.DEBIT_DOCUMENT_EXIT]: this.documentExitHandler,
            [JournalType.RETURN_PAYROLL]: this.returnHandler,
            [JournalType.PARTIAL_COLLECTION]: this.collectionHandler,
            [JournalType.BANK_DISCOUNT_SUBMISSION]: this.discountHandler,
            [JournalType.PROTEST_ENTRY]: this.protestHandler,
            [JournalType.WRITE_OFF]: this.writeOffHandler,
            [JournalType.REVERSAL]: this.reversalJournalHandler,
            [JournalType.LEGAL_TRANSFER]: this.legalTransferHandler,
            [JournalType.RETURN_FROM_BANK]: this.returnHandler,
        };
    }

    resolve(type: JournalType): IJournalHandler | null {
        return this.registry[type] ?? null;
    }
}
