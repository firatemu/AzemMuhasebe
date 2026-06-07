import { Module } from '@nestjs/common';
import { CodeTemplateModule } from '../code-template/code-template.module';
import { AccountBalanceModule } from '../account-balance/account-balance.module';
import { CheckBillService } from './check-bill.service';
import { CheckBillController } from './check-bill.controller';
import { CheckBillJournalService } from './check-bill-journal.service';
import { CheckBillJournalController } from './check-bill-journal.controller';
import { CheckBillReportsController } from './check-bill-reports.controller';
import { ReminderTaskService } from './reminder-task.service';
import { TenantContextModule } from '../../common/services/tenant-context.module';
import { CheckBillLogService } from './services/check-bill-log.service';
import { CheckBillCollectionService } from './services/check-bill-collection.service';
import { HandlerRegistry } from './handlers/handler-registry';
import { CreditEntryHandler } from './handlers/credit-entry.handler';
import { DebitEntryHandler } from './handlers/debit-entry.handler';
import { BankCollectionHandler } from './handlers/bank-collection.handler';
import { BankGuaranteeHandler } from './handlers/bank-guarantee.handler';
import { EndorsementHandler } from './handlers/endorsement.handler';
import { CollectionHandler } from './handlers/collection.handler';
import { DocumentExitHandler } from './handlers/document-exit.handler';
import { ReturnHandler } from './handlers/return.handler';
import { DiscountHandler } from './handlers/discount.handler';
import { ProtestHandler } from './handlers/protest.handler';
import { WriteOffHandler } from './handlers/write-off.handler';
import { ReversalJournalHandler } from './handlers/reversal-journal.handler';
import { LegalTransferHandler } from './handlers/legal-transfer.handler';
import { GlIntegrationService } from './services/gl-integration.service';

@Module({
    imports: [TenantContextModule, AccountBalanceModule, CodeTemplateModule],
    controllers: [CheckBillController, CheckBillJournalController, CheckBillReportsController],
    providers: [
        CheckBillService,
        CheckBillJournalService,
        ReminderTaskService,
        CheckBillLogService,
        CheckBillCollectionService,
        HandlerRegistry,
        CreditEntryHandler,
        DebitEntryHandler,
        BankCollectionHandler,
        BankGuaranteeHandler,
        EndorsementHandler,
        CollectionHandler,
        DocumentExitHandler,
        ReturnHandler,
        DiscountHandler,
        ProtestHandler,
        WriteOffHandler,
        ReversalJournalHandler,
        LegalTransferHandler,
        GlIntegrationService,
    ],
    exports: [CheckBillService, CheckBillJournalService, ReturnHandler, GlIntegrationService],
})
export class CheckBillModule { }