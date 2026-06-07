import {
  Controller,
  ForbiddenException,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { KpiService } from './kpi.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { GetCurrentUser } from '../../common/decorators/get-current-user.decorator';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DashboardController {
  constructor(private readonly kpiService: KpiService) {}

  @Get('kpis/:tenantId')
  @RequirePermissions({ module: 'analytics', action: 'view' })
  async getKpis(
    @Param('tenantId') tenantId: string,
    @GetCurrentUser('tenantId') currentTenantId?: string,
  ) {
    // TenantMiddleware normalde x-tenant-id ile çalışır ancak burada doğrudan Param üzerinden O(1) okuma (veya hesaplama) sağlıyoruz.
    const resolvedTenantId = currentTenantId || tenantId;
    if (currentTenantId && tenantId !== currentTenantId) {
      throw new ForbiddenException('Cannot access another tenant dashboard');
    }
    return this.kpiService.getKpis(resolvedTenantId);
  }

  @Get('cash-trend/:tenantId')
  @RequirePermissions({ module: 'analytics', action: 'view' })
  async getCashTrend(
    @Param('tenantId') tenantId: string,
    @GetCurrentUser('tenantId') currentTenantId?: string,
  ) {
    const resolvedTenantId = currentTenantId || tenantId;
    if (currentTenantId && tenantId !== currentTenantId) {
      throw new ForbiddenException('Cannot access another tenant dashboard');
    }
    return this.kpiService.getCashTrend(resolvedTenantId);
  }
}
