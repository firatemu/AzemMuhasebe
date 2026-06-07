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
import { SalesWaybillService } from './sales-waybill.service';
import { CreateSalesWaybillDto } from './dto/create-sales-waybill.dto';
import { UpdateSalesWaybillDto } from './dto/update-sales-waybill.dto';
import { FilterSalesWaybillDto } from './dto/filter-sales-waybill.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller(['sales-waybills', 'delivery-notes', 'satis-irsaliyesi'])
export class SalesWaybillController {
  constructor(private readonly salesWaybillService: SalesWaybillService) {}

  @Get('stats')
  @RequirePermissions({ module: 'order', action: 'list' })
  async getStats() {
    return this.salesWaybillService.getStats();
  }

  @Get()
  @RequirePermissions({ module: 'order', action: 'list' })
  async findAll(@Query() filterDto: FilterSalesWaybillDto) {
    const result = await this.salesWaybillService.findAll(filterDto);
    return {
      success: true,
      data: result.data,
      meta: result.meta,
    };
  }

  @Get('pending/:accountId')
  @RequirePermissions({ module: 'order', action: 'list' })
  async getPendingByAccount(@Param('accountId') accountId: string) {
    return this.salesWaybillService.getPendingByAccount(accountId);
  }

  @Get(':id')
  @RequirePermissions({ module: 'order', action: 'view' })
  async findOne(@Param('id') id: string) {
    return this.salesWaybillService.findOne(id);
  }

  @Post()
  @RequirePermissions({ module: 'order', action: 'create' })
  async create(@Body() createDto: CreateSalesWaybillDto, @Request() req) {
    const userId = req.user?.id;
    return this.salesWaybillService.create(createDto, userId);
  }

  @Put(':id')
  @RequirePermissions({ module: 'order', action: 'update' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateSalesWaybillDto,
    @Request() req,
  ) {
    const userId = req.user?.id;
    return this.salesWaybillService.update(id, updateDto, userId);
  }

  @Delete(':id')
  @RequirePermissions({ module: 'order', action: 'delete' })
  async remove(@Param('id') id: string, @Request() req) {
    const userId = req.user?.id;
    return this.salesWaybillService.remove(id, userId);
  }
}
