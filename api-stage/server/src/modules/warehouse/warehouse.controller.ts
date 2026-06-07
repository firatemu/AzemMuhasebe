import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('warehouses')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Get()
  @RequirePermissions({ module: 'warehouse', action: 'list' })
  findAll(@Query('active') active?: string) {
    const activeValue = active === undefined ? undefined : active === 'true';
    return this.warehouseService.findAll(activeValue);
  }

  @Get('code/:code')
  @RequirePermissions({ module: 'warehouse', action: 'view' })
  findByCode(@Param('code') code: string) {
    return this.warehouseService.findByCode(code);
  }

  @Get('default/get')
  @RequirePermissions({ module: 'warehouse', action: 'view' })
  getDefault() {
    return this.warehouseService.getDefaultWarehouse();
  }

  @Get('product/:productId/stock-history')
  @RequirePermissions({ module: 'warehouse', action: 'view' })
  getProductStockHistory(
    @Param('productId') productId: string,
    @Query('date') date: string,
  ) {
    const targetDate = date ? new Date(date) : new Date();
    return this.warehouseService.getProductStockHistory(productId, targetDate);
  }

  @Get('all/universal-stock-report')
  @RequirePermissions({ module: 'warehouse', action: 'list' })
  getUniversalStockReport(@Query('date') date: string) {
    const targetDate = date ? new Date(date) : new Date();
    return this.warehouseService.getUniversalStockReport(targetDate);
  }

  @Get(':id')
  @RequirePermissions({ module: 'warehouse', action: 'view' })
  findOne(@Param('id') id: string) {
    return this.warehouseService.findOne(id);
  }

  @Get(':id/inventory')
  @RequirePermissions({ module: 'warehouse', action: 'view' })
  getInventory(@Param('id') id: string) {
    return this.warehouseService.getWarehouseStock(id);
  }

  @Post()
  @RequirePermissions({ module: 'warehouse', action: 'create' })
  create(@Body() createDto: CreateWarehouseDto) {
    return this.warehouseService.create(createDto);
  }

  @Put(':id')
  @RequirePermissions({ module: 'warehouse', action: 'update' })
  update(@Param('id') id: string, @Body() updateDto: UpdateWarehouseDto) {
    return this.warehouseService.update(id, updateDto);
  }

  @Delete(':id')
  @RequirePermissions({ module: 'warehouse', action: 'delete' })
  remove(@Param('id') id: string) {
    return this.warehouseService.remove(id);
  }

  @Get(':id/stock-report')
  @RequirePermissions({ module: 'warehouse', action: 'view' })
  getStockReport(@Param('id') id: string) {
    return this.warehouseService.getStockReport(id);
  }
}
