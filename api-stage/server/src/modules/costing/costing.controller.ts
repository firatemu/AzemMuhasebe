import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CostingService } from './costing.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { CalculateBulkCostDto } from './dto/calculate-bulk-cost.dto';
import { CalculateCostDto } from './dto/calculate-cost.dto';
import { GetCostingQueryDto } from './dto/get-costing-query.dto';

@Controller('costings')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CostingController {
  constructor(private readonly costingService: CostingService) {}

  @Get('latest')
  @RequirePermissions({ module: 'product', action: 'view' })
  getLatest(@Query() query: GetCostingQueryDto) {
    return this.costingService.getLatestCosts(query);
  }

  @Post('calculate')
  @RequirePermissions({ module: 'product', action: 'update' })
  calculate(@Body() body: CalculateCostDto) {
    return this.costingService.calculateWeightedAverageCost(body.productId);
  }

  @Post('calculate-bulk')
  @RequirePermissions({ module: 'product', action: 'update' })
  calculateBulk(@Body() body: CalculateBulkCostDto) {
    return this.costingService.calculateWeightedAverageCostBulk(
      body.productIds,
    );
  }
}
