import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Public } from '../../common/decorators/public.decorator';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { IyzicoService } from './iyzico/iyzico.service';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly iyzicoService: IyzicoService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions({ module: 'payment', action: 'create' })
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions({ module: 'payment', action: 'list' })
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get('history')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions({ module: 'payment', action: 'list' })
  findHistory(@Query('subscriptionId') subscriptionId: string) {
    if (!subscriptionId) {
      throw new BadRequestException('subscriptionId is required');
    }
    return this.paymentsService.findBySubscriptionId(subscriptionId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions({ module: 'payment', action: 'view' })
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions({ module: 'payment', action: 'update' })
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(id, updatePaymentDto);
  }

  @Post(':id/refund')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions({ module: 'payment', action: 'approve' })
  async refund(@Param('id') id: string) {
    const payment = await this.paymentsService.findOne(id);
    if (!payment.iyzicoPaymentId) {
      throw new Error('Payment does not have iyzico payment ID');
    }
    return this.iyzicoService.refund(
      payment.iyzicoPaymentId,
      Number(payment.amount),
    );
  }

  @Post('webhooks/iyzico')
  @Public() // Public endpoint - no auth required
  async handleIyzicoWebhook(@Body() payload: any) {
    return this.iyzicoService.handleWebhook(payload);
  }

  @Post('callback')
  @Public() // Public endpoint - no auth required
  async handleCallback(@Query('token') token: string) {
    // İyzico callback işleme
    return this.iyzicoService.handleCallback(token);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions({ module: 'payment', action: 'delete' })
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(id);
  }
}
