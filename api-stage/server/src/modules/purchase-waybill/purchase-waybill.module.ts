import { Module } from '@nestjs/common';
import { PurchaseWaybillService } from './purchase-waybill.service';
import { PurchaseWaybillController } from './purchase-waybill.controller';
import { PrismaModule } from '../../common/prisma.module';
import { TenantContextModule } from '../../common/services/tenant-context.module';
import { CodeTemplateModule } from '../code-template/code-template.module';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [PrismaModule, TenantContextModule, CodeTemplateModule, SharedModule],
  controllers: [PurchaseWaybillController],
  providers: [PurchaseWaybillService],
  exports: [PurchaseWaybillService],
})
export class PurchaseWaybillModule { }

