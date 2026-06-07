import { Module } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CollectionExportService } from './collection-export.service';
import { CollectionController } from './collection.controller';
import { PrismaModule } from '../../common/prisma.module';
import { SystemParameterModule } from '../system-parameter/system-parameter.module';
import { TenantContextModule } from '../../common/services/tenant-context.module';
import { AccountBalanceModule } from '../account-balance/account-balance.module';
import { InvoiceModule } from '../invoice/invoice.module';
import { PaymentPlanHelperService } from '../invoice/services/payment-plan-helper.service';
import { CodeTemplateModule } from '../code-template/code-template.module';

@Module({
  imports: [
    PrismaModule,
    SystemParameterModule,
    TenantContextModule,
    AccountBalanceModule,
    InvoiceModule,
    CodeTemplateModule,
  ],
  controllers: [CollectionController],
  providers: [CollectionService, CollectionExportService, PaymentPlanHelperService],
  exports: [CollectionService],
})
export class CollectionModule { }

