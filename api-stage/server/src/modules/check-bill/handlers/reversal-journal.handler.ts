import { Injectable, Logger } from '@nestjs/common';
import { IJournalHandler, JournalHandlerContext } from './journal-handler.interface';
import { CreateCheckBillJournalDto } from '../dto/create-check-bill-journal.dto';

/**
 * Doc: REVERSAL — ters kayıt. Evrak durumu değiştirmeden bordro iptali / düzeltme akışı için yer tutucu;
 * tam entegrasyon GLIntegrationService ile yapılacak.
 */
@Injectable()
export class ReversalJournalHandler implements IJournalHandler {
    private readonly logger = new Logger(ReversalJournalHandler.name);

    async handle(dto: CreateCheckBillJournalDto, context: JournalHandlerContext): Promise<void> {
        this.logger.warn(
            `[tenantId=${context.tenantId}] REVERSAL bordrosu — iş mantığı GL katmanında tamamlanacak (journal ${context.journalId})`,
        );
        void dto;
    }
}
