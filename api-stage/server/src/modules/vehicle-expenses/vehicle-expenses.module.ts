import { Module } from '@nestjs/common';
import { VehicleExpensesService } from './vehicle-expenses.service';
import { VehicleExpensesController } from './vehicle-expenses.controller';
import { PrismaModule } from '../../common/prisma.module';
import { TenantContextModule } from '../../common/services/tenant-context.module';

@Module({
    imports: [PrismaModule, TenantContextModule],
    controllers: [VehicleExpensesController],
    providers: [VehicleExpensesService],
    exports: [VehicleExpensesService],
})
export class VehicleExpensesModule { }
