import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ErpProductLiveMetricsService } from './services/erp-product-live-metrics.service';

export const EXTENDED_PRISMA = 'EXTENDED_PRISMA';

@Global()
@Module({
  providers: [
    PrismaService,
    ErpProductLiveMetricsService,
    {
      provide: EXTENDED_PRISMA,
      useFactory: (prisma: PrismaService) => prisma.extended,
      inject: [PrismaService],
    },
  ],
  exports: [PrismaService, ErpProductLiveMetricsService, EXTENDED_PRISMA],
})
export class PrismaModule { }
