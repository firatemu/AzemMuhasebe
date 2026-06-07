import { Module, forwardRef } from '@nestjs/common';
import { PosController } from './pos.controller';
import { PosService } from './pos.service';
import { PrismaModule } from '../../common/prisma.module';
import { TenantContextModule } from '../../common/services/tenant-context.module';
import { CodeTemplateModule } from '../code-template/code-template.module';
import { InvoiceModule } from '../invoice/invoice.module';
import { CollectionModule } from '../collection/collection.module';
import { CashboxModule } from '../cashbox/cashbox.module';

@Module({
  imports: [
    PrismaModule,
    TenantContextModule,
    forwardRef(() => CodeTemplateModule),
    InvoiceModule,
    CollectionModule,
    CashboxModule,
  ],
  controllers: [PosController],
  providers: [PosService],
  exports: [PosService],
})
export class PosModule { }
