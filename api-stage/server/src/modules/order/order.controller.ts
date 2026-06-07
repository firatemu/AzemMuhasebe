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
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { MarkInvoicedDto } from './dto/faturalandi-order.dto';
import { PrepareOrderDto } from './dto/hazirla-order.dto';
import { ShipOrderDto } from './dto/sevk-order.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @RequirePermissions({ module: 'order', action: 'list' })
  findAll(@Query() query: QueryOrderDto) {
    return this.orderService.findAll(
      query.page ? parseInt(query.page) : 1,
      query.limit ? parseInt(query.limit) : 50,
      query.orderType,
      query.search,
      query.accountId,
      query.status,
    );
  }

  @Get('deleted')
  @RequirePermissions({ module: 'order', action: 'list' })
  findDeleted(@Query() query: QueryOrderDto) {
    return this.orderService.findDeleted(
      query.page ? parseInt(query.page) : 1,
      query.limit ? parseInt(query.limit) : 50,
      query.orderType,
      query.search,
    );
  }

  @Get('for-invoice')
  @RequirePermissions({ module: 'order', action: 'list' })
  getOrdersForInvoice(@Query() query: any) {
    return this.orderService.findOrdersForInvoice(
      query.accountId,
      query.search,
      query.orderType,
    );
  }

  @Get('stats')
  @RequirePermissions({ module: 'order', action: 'list' })
  async getStats(
    @Query('siparisTipi') siparisTipi: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('durum') durum?: string,
    @Query('accountId') accountId?: string,
  ) {
    const orderType = siparisTipi === 'SATIS' ? 'SALE' : 'PURCHASE';
    const parsedStartDate = startDate ? new Date(startDate) : undefined;
    const parsedEndDate = endDate ? new Date(endDate) : undefined;

    return this.orderService.getStats(
      orderType as any,
      parsedStartDate,
      parsedEndDate,
      durum,
      accountId,
    );
  }

  @Get('delivery-note-orders')
  @RequirePermissions({ module: 'order', action: 'list' })
  getOrdersForDeliveryNote(@Query() query: any) {
    return this.orderService.findOrdersForDeliveryNote(
      query.accountId,
      query.search,
      query.orderType,
    );
  }

  @Get(':id')
  @RequirePermissions({ module: 'order', action: 'view' })
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Post()
  @RequirePermissions({ module: 'order', action: 'create' })
  create(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    return this.orderService.create(
      createOrderDto,
      user?.userId,
      req.ip,
      req.headers['user-agent'],
    );
  }

  @Put(':id')
  @RequirePermissions({ module: 'order', action: 'update' })
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    return this.orderService.update(
      id,
      updateOrderDto,
      user?.userId,
      req.ip,
      req.headers['user-agent'],
    );
  }

  @Delete(':id')
  @RequirePermissions({ module: 'order', action: 'delete' })
  remove(@Param('id') id: string, @CurrentUser() user: any, @Req() req: any) {
    return this.orderService.remove(
      id,
      user?.userId,
      req.ip,
      req.headers['user-agent'],
    );
  }

  @Put(':id/cancel')
  @RequirePermissions({ module: 'order', action: 'approve' })
  cancel(@Param('id') id: string, @CurrentUser() user: any, @Req() req: any) {
    return this.orderService.cancel(
      id,
      user?.userId,
      req.ip,
      req.headers['user-agent'],
    );
  }

  @Put(':id/status')
  @RequirePermissions({ module: 'order', action: 'approve' })
  changeStatus(
    @Param('id') id: string,
    @Body('status') status: any,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    return this.orderService.changeStatus(
      id,
      status,
      user?.userId,
      req.ip,
      req.headers['user-agent'],
    );
  }

  @Put(':id/restore')
  @RequirePermissions({ module: 'order', action: 'approve' })
  restore(@Param('id') id: string, @CurrentUser() user: any, @Req() req: any) {
    return this.orderService.restore(
      id,
      user?.userId,
      req.ip,
      req.headers['user-agent'],
    );
  }

  @Post(':id/delivery-note')
  @RequirePermissions({ module: 'order', action: 'create' })
  createDeliveryNote(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    return this.orderService.createDeliveryNoteFromOrder(
      id,
      user?.userId,
      req.ip,
      req.headers['user-agent'],
    );
  }

  @Put(':id/mark-invoiced')
  @RequirePermissions({ module: 'order', action: 'approve' })
  markInvoiced(
    @Param('id') id: string,
    @Body() dto: MarkInvoicedDto,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    return this.orderService.markInvoiced(
      id,
      dto.invoiceNo,
      user?.userId,
      req.ip,
      req.headers['user-agent'],
    );
  }

  @Get(':id/preparation-details')
  @RequirePermissions({ module: 'order', action: 'view' })
  getPreparationDetails(@Param('id') id: string) {
    return this.orderService.getPreparationDetails(id);
  }

  @Post(':id/prepare')
  @RequirePermissions({ module: 'order', action: 'approve' })
  prepare(
    @Param('id') id: string,
    @Body() dto: PrepareOrderDto,
    @CurrentUser() user: any,
  ) {
    return this.orderService.prepare(id, dto.items, user?.userId);
  }

  @Post(':id/ship')
  @RequirePermissions({ module: 'order', action: 'approve' })
  ship(
    @Param('id') id: string,
    @Body() dto: ShipOrderDto,
    @CurrentUser() user: any,
    @Req() req: any,
  ) {
    return this.orderService.ship(
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
}
