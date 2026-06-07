import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { ReportingService } from './reporting.service';
import { OverviewQueryDto } from './dto/overview-query.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('reporting')
export class ReportingController {
  constructor(private readonly reportingService: ReportingService) {}

  @Get('overview')
  @RequirePermissions({ module: 'reporting', action: 'view' })
  getOverview(@Query() query: OverviewQueryDto) {
    return this.reportingService.getOverview(query);
  }

  @Get('salesperson-performance')
  @RequirePermissions({ module: 'reporting', action: 'view' })
  getSalespersonPerformance(@Query() query: OverviewQueryDto) {
    return this.reportingService.getSalespersonPerformance(query);
  }
}
