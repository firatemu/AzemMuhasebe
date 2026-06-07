import { Module } from '@nestjs/common';
import { StatusCalculatorService } from './status-calculator/status-calculator.service';
import { PurchaseStatusCalculatorService } from './purchase-status-calculator/purchase-status-calculator.service';
import { PrismaModule } from '../../common/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [StatusCalculatorService, PurchaseStatusCalculatorService],
    exports: [StatusCalculatorService, PurchaseStatusCalculatorService],
})
export class SharedModule { }
