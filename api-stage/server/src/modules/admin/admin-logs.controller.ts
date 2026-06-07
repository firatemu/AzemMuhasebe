import {
  Controller,
  ForbiddenException,
  Get,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { UserRole } from '../../common/enums/user-role.enum';

@Controller('admin/logs')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AdminLogsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @RequirePermissions({ module: 'settings', action: 'view' })
  async getLogs(
    @Req() request: { user?: { role?: string; tenantId?: string } },
    @Query('page') page = '1',
    @Query('limit') limit = '50',
    @Query('action') action?: string,
    @Query('userId') userId?: string,
    @Query('resource') resource?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(200, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const where = this.buildScopedWhere(request.user);
    if (action) where.action = { contains: action, mode: 'insensitive' };
    if (userId) where.userId = { contains: userId, mode: 'insensitive' };
    if (resource) where.resource = { contains: resource, mode: 'insensitive' };
    if (startDate || endDate) {
      const createdAt: Prisma.DateTimeFilter = {};
      if (startDate) createdAt.gte = new Date(startDate);
      if (endDate) createdAt.lte = new Date(endDate);
      where.createdAt = createdAt;
    }

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
        include: {
          tenant: {
            select: { id: true, name: true },
          },
        },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      data: logs,
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
    };
  }

  @Get('stats')
  @RequirePermissions({ module: 'settings', action: 'view' })
  async getStats(
    @Req() request: { user?: { role?: string; tenantId?: string } },
  ) {
    const where = this.buildScopedWhere(request.user);

    const [total, last24h, byAction] = await Promise.all([
      this.prisma.auditLog.count({ where }),
      this.prisma.auditLog.count({
        where: {
          ...where,
          createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
      }),
      this.prisma.auditLog.groupBy({
        by: ['action'],
        where,
        _count: { action: true },
        orderBy: { _count: { action: 'desc' } },
        take: 10,
      }),
    ]);

    return { total, last24h, byAction };
  }

  private buildScopedWhere(user?: {
    role?: string;
    tenantId?: string;
  }): Prisma.AuditLogWhereInput {
    const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN;
    if (isSuperAdmin) {
      return {};
    }

    if (!user?.tenantId) {
      throw new ForbiddenException('Tenant kapsamı belirlenemedi');
    }

    return { tenantId: user.tenantId };
  }
}
