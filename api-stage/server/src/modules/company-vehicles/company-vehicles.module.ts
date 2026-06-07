import { Module } from '@nestjs/common';
import { CompanyVehiclesService } from './company-vehicles.service';
import { CompanyVehiclesController } from './company-vehicles.controller';
import { PrismaModule } from '../../common/prisma.module';
import { TenantContextModule } from '../../common/services/tenant-context.module';

@Module({
    imports: [PrismaModule, TenantContextModule],
    controllers: [CompanyVehiclesController],
    providers: [CompanyVehiclesService],
    exports: [CompanyVehiclesService],
})
export class CompanyVehiclesModule { }
