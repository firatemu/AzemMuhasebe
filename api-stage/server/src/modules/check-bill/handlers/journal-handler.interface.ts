import { PrismaClient } from '@prisma/client';

export type TransactionClient = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>;

export interface JournalHandlerContext {
    tx: TransactionClient;
    journalId: string;
    tenantId: string;
    performedById: string;
}

export interface IJournalHandler {
    handle(dto: any, context: JournalHandlerContext): Promise<void>;
}
