import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { GetCurrentUser } from '../../common/decorators/get-current-user.decorator';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  @RequirePermissions({ module: 'subscription', action: 'create' })
  create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionsService.create(createSubscriptionDto);
  }

  @Get()
  @RequirePermissions({ module: 'subscription', action: 'list' })
  findAll() {
    return this.subscriptionsService.findAll();
  }

  @Get('current')
  @RequirePermissions({ module: 'subscription', action: 'view' })
  findCurrent(@GetCurrentUser('tenantId') tenantId: string) {
    if (!tenantId) {
      throw new BadRequestException('tenantId is required');
    }
    return this.subscriptionsService.findByTenantId(tenantId);
  }

  // Özel route'lar dinamik route'lardan ÖNCE olmalı
  @Post('start-trial')
  @RequirePermissions({ module: 'subscription', action: 'create' })
  startTrial(@GetCurrentUser('userId') userId: string) {
    return this.subscriptionsService.startTrial(userId);
  }

  @Post('upgrade')
  @RequirePermissions({ module: 'subscription', action: 'update' })
  upgrade(
    @GetCurrentUser('userId') userId: string,
    @Body() body: { planName: string },
  ) {
    return this.subscriptionsService.upgradeFromTrial(userId, body.planName);
  }

  // Özel POST route'ları (cancel, reactivate gibi) dinamik route'lardan ÖNCE olmalı
  @Post(':id/cancel')
  @RequirePermissions({ module: 'subscription', action: 'update' })
  cancel(@Param('id') id: string) {
    return this.subscriptionsService.cancel(id);
  }

  @Post(':id/reactivate')
  @RequirePermissions({ module: 'subscription', action: 'update' })
  reactivate(@Param('id') id: string) {
    return this.subscriptionsService.reactivate(id);
  }

  // Dinamik route'lar en sonda
  @Get(':id')
  @RequirePermissions({ module: 'subscription', action: 'view' })
  findOne(@Param('id') id: string) {
    return this.subscriptionsService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions({ module: 'subscription', action: 'update' })
  update(
    @Param('id') id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionsService.update(id, updateSubscriptionDto);
  }

  @Delete(':id')
  @RequirePermissions({ module: 'subscription', action: 'delete' })
  remove(@Param('id') id: string) {
    return this.subscriptionsService.remove(id);
  }
}
