import { Module, forwardRef } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { InvoiceExportService } from './invoice-export.service';
import { PrismaModule } from '../../common/prisma.module';
import { TenantContextModule } from '../../common/services/tenant-context.module';
import { TcmbService } from '../../common/services/tcmb.service';
import { CodeTemplateModule } from '../code-template/code-template.module';
import { SalesWaybillModule } from '../sales-waybill/sales-waybill.module';
import { InvoiceProfitModule } from '../invoice-profit/invoice-profit.module';
import { CostingModule } from '../costing/costing.module';
import { SystemParameterModule } from '../system-parameter/system-parameter.module';
import { WarehouseModule } from '../warehouse/warehouse.module';
import { DeletionProtectionModule } from '../../common/services/deletion-protection.module';
import { AccountBalanceModule } from '../account-balance/account-balance.module';
import { UnitSetModule } from '../unit-set/unit-set.module';
import { SharedModule } from '../shared/shared.module';

import { BullModule } from '@nestjs/bullmq';
import { StockEffectService } from './services/stock-effect.service';
import { AccountEffectService } from './services/account-effect.service';
import { InvoiceOrchestratorService } from './services/invoice-orchestrator.service';
import { ReconciliationService } from './services/reconciliation.service';
import { InvoiceEffectsProcessor } from './processors/invoice-effects.processor';
import { InvoiceOrchestratorController } from './controllers/invoice-orchestrator.controller';

@Module({
  imports: [
    PrismaModule,
    TenantContextModule,
    CodeTemplateModule,
    forwardRef(() => SalesWaybillModule),
    InvoiceProfitModule,
    CostingModule,
    SystemParameterModule,
    WarehouseModule,
    DeletionProtectionModule,
    AccountBalanceModule,
    UnitSetModule,
    SharedModule,
    BullModule.registerQueue({
      name: 'invoice-effects',
    }),
  ],
  controllers: [InvoiceController, InvoiceOrchestratorController],
  providers: [
    InvoiceService,
    InvoiceExportService,
    TcmbService,
    StockEffectService,
    AccountEffectService,
    InvoiceOrchestratorService,
    ReconciliationService,
    InvoiceEffectsProcessor,
  ],
  exports: [InvoiceService, InvoiceOrchestratorService, ReconciliationService],
})
export class InvoiceModule { }