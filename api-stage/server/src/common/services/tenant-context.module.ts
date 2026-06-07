import { Global, Module } from '@nestjs/common';
import { TenantContextService } from './tenant-context.service';
import { TenantResolverService } from './tenant-resolver.service';
import { PrismaModule } from '../prisma.module';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [TenantContextService, TenantResolverService],
  exports: [TenantContextService, TenantResolverService],
})
export class TenantContextModule { }

