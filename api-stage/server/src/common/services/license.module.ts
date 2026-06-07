import { Global, Module } from '@nestjs/common';
import { PrismaModule } from '../prisma.module';
import { LicenseService } from './license.service';
import { RedisModule } from './redis.module';

@Global()
@Module({
  imports: [PrismaModule, RedisModule],
  providers: [LicenseService],
  exports: [LicenseService],
})
export class LicenseModule {}


