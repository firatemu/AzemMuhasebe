import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
  Query,
  ForbiddenException,
} from '@nestjs/common';
import { TenantPurgeService } from './tenant-purge.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { UserRole } from '../../common/enums/user-role.enum';

@Controller('admin/tenants')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AdminTenantController {
  constructor(private purgeService: TenantPurgeService) {}

  /**
   * List all tenants eligible for purging
   * Only SUPER_ADMIN can access
   */
  @Get('purgeable')
  @RequirePermissions({ module: 'settings', action: 'list' })
  async listPurgeable(@Req() request: any) {
    if (request.user.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException(
        'Only super admins can access this endpoint',
      );
    }
    return this.purgeService.listPurgeableTenants();
  }

  /**
   * Manually purge a tenant's data (IRREVERSIBLE)
   * Only SUPER_ADMIN can access
   * Requires tenant to be in CANCELLED/SUSPENDED/EXPIRED status
   */
  @Post('purge')
  @RequirePermissions({ module: 'settings', action: 'delete' })
  async purgeTenant(@Body('tenantId') tenantId: string, @Req() request: any) {
    if (request.user.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Only super admins can purge tenants');
    }

    const admin = request.user;
    const ipAddress = request.ip || request.connection.remoteAddress;

    await this.purgeService.purgeTenantData({
      tenantId,
      adminId: admin.id,
      adminEmail: admin.email,
      ipAddress,
    });

    return {
      success: true,
      message: 'Tenant data purged successfully',
    };
  }

  /**
   * Get purge audit log
   * Only SUPER_ADMIN can access
   */
  @Get('purge-audit')
  @RequirePermissions({ module: 'settings', action: 'view' })
  async getPurgeAudit(
    @Query('tenantId') tenantId: string | undefined,
    @Req() request: any,
  ) {
    if (request.user.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Only super admins can view audit logs');
    }
    return this.purgeService.getPurgeAuditLog(tenantId);
  }
}
