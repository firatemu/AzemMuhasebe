import { Module, forwardRef } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PrismaModule } from '../../common/prisma.module';
import { TenantContextModule } from '../../common/services/tenant-context.module';
import { SalesWaybillModule } from '../sales-waybill/sales-waybill.module';
import { CodeTemplateModule } from '../code-template/code-template.module';
import { UnitSetModule } from '../unit-set/unit-set.module';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    PrismaModule,
    TenantContextModule,
    forwardRef(() => SalesWaybillModule),
    CodeTemplateModule,
    UnitSetModule,
    SharedModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule { }
