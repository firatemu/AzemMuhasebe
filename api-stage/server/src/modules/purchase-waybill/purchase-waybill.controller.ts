import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { PurchaseWaybillService } from './purchase-waybill.service';
import { CreatePurchaseWaybillDto } from './dto/create-purchase-waybill.dto';
import { UpdatePurchaseWaybillDto } from './dto/update-purchase-waybill.dto';
import { FilterPurchaseWaybillDto } from './dto/filter-purchase-waybill.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller(['purchase-waybill', 'satin-alma-irsaliyesi'])
export class PurchaseWaybillController {
  constructor(
    private readonly purchaseWaybillService: PurchaseWaybillService,
  ) {}

  @Get('stats')
  @RequirePermissions({ module: 'order', action: 'list' })
  async getStats() {
    return this.purchaseWaybillService.getStats();
  }

  @Get()
  @RequirePermissions({ module: 'order', action: 'list' })
  async findAll(@Query() filterDto: FilterPurchaseWaybillDto) {
    const result = await this.purchaseWaybillService.findAll(filterDto);
    return {
      success: true,
      data: result.data,
      meta: result.meta,
    };
  }

  @Get('pending/:accountId')
  @RequirePermissions({ module: 'order', action: 'list' })
  async getPendingByAccount(@Param('accountId') accountId: string) {
    return this.purchaseWaybillService.getPendingByAccount(accountId);
  }

  @Get(':id')
  @RequirePermissions({ module: 'order', action: 'view' })
  async findOne(@Param('id') id: string) {
    return this.purchaseWaybillService.findOne(id);
  }

  @Post()
  @RequirePermissions({ module: 'order', action: 'create' })
  async create(@Body() createDto: CreatePurchaseWaybillDto, @Request() req) {
    const userId = req.user?.id;
    return this.purchaseWaybillService.create(createDto, userId);
  }

  @Put(':id')
  @RequirePermissions({ module: 'order', action: 'update' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdatePurchaseWaybillDto,
    @Request() req,
  ) {
    const userId = req.user?.id;
    return this.purchaseWaybillService.update(id, updateDto, userId);
  }

  @Delete(':id')
  @RequirePermissions({ module: 'order', action: 'delete' })
  async remove(@Param('id') id: string, @Request() req) {
    const userId = req.user?.id;
    return this.purchaseWaybillService.remove(id, userId);
  }
}
