import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { WarehouseCriticalStockService } from './warehouse-critical-stock.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';

@Controller('warehouse-critical-stock')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class WarehouseCriticalStockController {
  constructor(private readonly service: WarehouseCriticalStockService) {}

  @Put(':warehouseId/:productId')
  @RequirePermissions({ module: 'warehouse', action: 'update' })
  updateCriticalStock(
    @Param('warehouseId') warehouseId: string,
    @Param('productId') productId: string,
    @Body('criticalQty') criticalQty: number,
  ) {
    return this.service.updateCriticalStock(
      warehouseId,
      productId,
      criticalQty,
    );
  }

  @Get('report')
  @RequirePermissions({ module: 'warehouse', action: 'view' })
  getCriticalStockReport() {
    return this.service.getCriticalStockReport();
  }

  @Put('bulk-update')
  @RequirePermissions({ module: 'warehouse', action: 'update' })
  bulkUpdate(
    @Body() data: { code: string; ambarKodu: string; criticalQty: number }[],
  ) {
    return this.service.bulkUpdateFromExcel(data);
  }
}
