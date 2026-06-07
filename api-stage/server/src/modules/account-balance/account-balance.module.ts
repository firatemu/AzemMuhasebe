import { Module } from '@nestjs/common';
import { AccountBalanceService } from './account-balance.service';

@Module({
  providers: [AccountBalanceService],
  exports: [AccountBalanceService],
})
export class AccountBalanceModule {}