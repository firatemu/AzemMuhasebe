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
  Req,
} from '@nestjs/common';
import { WarehouseTransferService } from './warehouse-transfer.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { CreateWarehouseTransferDto } from './dto/create-warehouse-transfer.dto';
import { UpdateWarehouseTransferDto } from './dto/update-warehouse-transfer.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('warehouse-transfer')
export class WarehouseTransferController {
  constructor(
    private readonly warehouseTransferService: WarehouseTransferService,
  ) {}

  @Get()
  @RequirePermissions({ module: 'warehouse', action: 'list' })
  findAll(@Query('status') status?: string) {
    return this.warehouseTransferService.findAll(status);
  }

  @Get(':id')
  @RequirePermissions({ module: 'warehouse', action: 'view' })
  findOne(@Param('id') id: string) {
    return this.warehouseTransferService.findOne(id);
  }

  @Post()
  @RequirePermissions({ module: 'warehouse', action: 'create' })
  create(@Body() dto: CreateWarehouseTransferDto, @Req() req: any) {
    dto.userId = req.user?.id;
    return this.warehouseTransferService.create(dto);
  }

  @Put(':id')
  @RequirePermissions({ module: 'warehouse', action: 'update' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateWarehouseTransferDto,
    @Req() req: any,
  ) {
    dto.userId = req.user?.id;
    return this.warehouseTransferService.update(id, dto);
  }

  @Put(':id/approve')
  @RequirePermissions({ module: 'warehouse', action: 'approve' })
  approve(@Param('id') id: string, @Req() req: any) {
    return this.warehouseTransferService.approve(id, req.user?.id);
  }

  @Put(':id/complete')
  @RequirePermissions({ module: 'warehouse', action: 'approve' })
  complete(@Param('id') id: string, @Req() req: any) {
    return this.warehouseTransferService.complete(id, req.user?.id);
  }

  @Put(':id/cancel')
  @RequirePermissions({ module: 'warehouse', action: 'approve' })
  cancel(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @Req() req: any,
  ) {
    return this.warehouseTransferService.cancel(id, req.user?.id, reason);
  }

  @Delete(':id')
  @RequirePermissions({ module: 'warehouse', action: 'delete' })
  remove(@Param('id') id: string) {
    return this.warehouseTransferService.remove(id);
  }
}
