import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Put,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PurchaseOrdersService } from './purchase-orders.service';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
import { QueryPurchaseOrderDto } from './dto/query-purchase-order.dto';
import { ShippedPurchaseOrderDto } from './dto/shipped-purchase-order.dto';
import { InvoicedPurchaseOrderDto } from './dto/invoiced-purchase-order.dto';
import { ReceivePurchaseOrderDto } from './dto/receive-purchase-order.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PurchaseOrderLocalStatus } from '@prisma/client';

@Controller('purchase-orders')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PurchaseOrdersController {
  constructor(private readonly service: PurchaseOrdersService) {}

  @Get('stats')
  @RequirePermissions({ module: 'order', action: 'list' })
  async getStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('status') status?: string,
    @Query('accountId') accountId?: string,
  ) {
    const parsedStartDate = startDate ? new Date(startDate) : undefined;
    const parsedEndDate = endDate ? new Date(endDate) : undefined;

    return this.service.getStats(
      parsedStartDate,
      parsedEndDate,
      status,
      accountId,
    );
  }

  @Get('for-invoice')
  @RequirePermissions({ module: 'order', action: 'list' })
  async getOrdersForInvoice(@Query() query: any) {
    return this.service.findOrdersForInvoice(query.accountId, query.search);
  }

  @Get('receiving-orders')
  @RequirePermissions({ module: 'order', action: 'list' })
  async getOrdersForReceiving(@Query() query: any) {
    return this.service.findOrdersForReceiving(query.accountId, query.search);
  }

  @Get()
  @RequirePermissions({ module: 'order', action: 'list' })
  async findAll(@Query() query: QueryPurchaseOrderDto) {
    return this.service.findAll(query);
  }

  @Get('deleted')
  @RequirePermissions({ module: 'order', action: 'list' })
  async findDeleted(@Query() query: QueryPurchaseOrderDto) {
    return this.service.findDeleted(query);
  }

  @Get(':id')
  @RequirePermissions({ module: 'order', action: 'view' })
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @RequirePermissions({ module: 'order', action: 'create' })
  async create(
    @Body() dto: CreatePurchaseOrderDto,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    return this.service.create(
      dto,
      user?.userId,
      req.ip,
      req.headers['user-agent'],
    );
  }

  @Put(':id')
  @RequirePermissions({ module: 'order', action: 'update' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePurchaseOrderDto,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    return this.service.update(
      id,
      dto,
      user?.userId,
      req.ip,
      req.headers['user-agent'],
    );
  }

  @Delete(':id')
  @RequirePermissions({ module: 'order', action: 'delete' })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    return this.service.remove(
      id,
      user?.userId,
      req.ip,
      req.headers['user-agent'],
    );
  }

  @Put(':id/cancel')
  @RequirePermissions({ module: 'order', action: 'approve' })
  async cancel(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    return this.service.cancel(
      id,
      user?.userId,
      req.ip,
      req.headers['user-agent'],
    );
  }

  @Put(':id/status')
  @RequirePermissions({ module: 'order', action: 'approve' })
  async changeStatus(
    @Param('id') id: string,
    @Body('status') status: PurchaseOrderLocalStatus,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    return this.service.changeStatus(
      id,
      status,
      user?.userId,
      req.ip,
      req.headers['user-agent'],
    );
  }

  @Put(':id/restore')
  @RequirePermissions({ module: 'order', action: 'approve' })
  async restore(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    return this.service.restore(
      id,
      user?.userId,
      req.ip,
      req.headers['user-agent'],
    );
  }

  @Put(':id/invoiced')
  @RequirePermissions({ module: 'order', action: 'approve' })
  async invoiced(
    @Param('id') id: string,
    @Body() dto: InvoicedPurchaseOrderDto,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    return this.service.markAsInvoiced(
      id,
      dto.invoiceNo,
      user?.userId,
      req.ip,
      req.headers['user-agent'],
    );
  }

  @Post(':id/receive')
  @RequirePermissions({ module: 'order', action: 'approve' })
  async receive(
    @Param('id') id: string,
    @Body() dto: ReceivePurchaseOrderDto,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    return this.service.receive(
      id,
      dto.items,
      user?.userId,
      req.ip,
      req.headers['user-agent'],
      dto.warehouseId,
      dto.notes,
      dto.deliveryNoteNo,
    );
  }

  @Post(':id/create-waybill')
  @RequirePermissions({ module: 'order', action: 'create' })
  async createWaybill(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    return this.service.createWaybill(
      id,
      user?.userId,
      req.ip,
      req.headers['user-agent'],
    );
  }
}
