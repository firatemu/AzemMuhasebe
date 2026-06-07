import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @RequirePermissions({ module: 'analytics', action: 'view' })
  getDashboardMetrics() {
    return this.analyticsService.getDashboardMetrics();
  }

  @Get('revenue')
  @RequirePermissions({ module: 'analytics', action: 'view' })
  getRevenue(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const start = startDate
      ? new Date(startDate)
      : new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();
    return this.analyticsService.getRevenueOverTime(start, end);
  }

  @Get('users-growth')
  @RequirePermissions({ module: 'analytics', action: 'view' })
  getUserGrowth(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const start = startDate
      ? new Date(startDate)
      : new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();
    return this.analyticsService.getUserGrowth(start, end);
  }

  @Get('churn')
  @RequirePermissions({ module: 'analytics', action: 'view' })
  getChurnAnalysis() {
    return this.analyticsService.getChurnAnalysis();
  }

  @Get('subscriptions/distribution')
  @RequirePermissions({ module: 'analytics', action: 'view' })
  getSubscriptionDistribution() {
    return this.analyticsService.getSubscriptionDistribution();
  }

  @Get('plans/distribution')
  @RequirePermissions({ module: 'analytics', action: 'view' })
  getPlanDistribution() {
    return this.analyticsService.getPlanDistribution();
  }

  @Get('payments/recent')
  @RequirePermissions({ module: 'analytics', action: 'view' })
  getRecentPayments(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.analyticsService.getRecentPayments(limitNum);
  }
}
