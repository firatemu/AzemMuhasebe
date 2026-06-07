import { Module } from '@nestjs/common';
import { SalesWaybillService } from './sales-waybill.service';
import { SalesWaybillController } from './sales-waybill.controller';
import { PrismaModule } from '../../common/prisma.module';
import { TenantContextModule } from '../../common/services/tenant-context.module';
import { CodeTemplateModule } from '../code-template/code-template.module';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [PrismaModule, TenantContextModule, CodeTemplateModule, SharedModule],
  controllers: [SalesWaybillController],
  providers: [SalesWaybillService],
  exports: [SalesWaybillService],
})
export class SalesWaybillModule { }
