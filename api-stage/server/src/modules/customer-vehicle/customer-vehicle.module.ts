import { Module } from '@nestjs/common';
import { CustomerVehicleService } from './customer-vehicle.service';
import { CustomerVehicleController } from './customer-vehicle.controller';
import { PrismaModule } from '../../common/prisma.module';
import { TenantContextModule } from '../../common/services/tenant-context.module';

@Module({
  imports: [PrismaModule, TenantContextModule],
  controllers: [CustomerVehicleController],
  providers: [CustomerVehicleService],
  exports: [CustomerVehicleService],
})
export class CustomerVehicleModule {}
