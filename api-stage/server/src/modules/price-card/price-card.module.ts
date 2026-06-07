import { PrismaModule } from '../../common/prisma.module';
import { Module } from '@nestjs/common';
import { PriceCardService } from './price-card.service';
import { PriceCardExportService } from './price-card-export.service';
import { PriceCardController } from './price-card.controller';
import { TenantContextModule } from '../../common/services/tenant-context.module';
import { ProductModule } from '../product/product.module';
import { forwardRef } from '@nestjs/common';

@Module({
  imports: [PrismaModule, TenantContextModule, forwardRef(() => ProductModule)],
  controllers: [PriceCardController],
  providers: [PriceCardService, PriceCardExportService],
  exports: [PriceCardService],
})
export class PriceCardModule { }
