import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { ProductMovementService } from './product-movement.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

export enum MovementType {
  ENTRY = 'ENTRY',
  EXIT = 'EXIT',
  SALE = 'SALE',
  RETURN = 'RETURN',
  CANCELLATION_ENTRY = 'CANCELLATION_ENTRY',
  CANCELLATION_EXIT = 'CANCELLATION_EXIT',
  COUNT = 'COUNT',
  COUNT_SURPLUS = 'COUNT_SURPLUS',
  COUNT_SHORTAGE = 'COUNT_SHORTAGE',
}

@ApiTags('product-movement')
@Controller('product-movements')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProductMovementController {
  constructor(
    private readonly productMovementService: ProductMovementService,
  ) {}

  @Get()
  @RequirePermissions({ module: 'product', action: 'list' })
  @ApiQuery({ name: 'movementType', enum: MovementType, required: false })
  async findAll(
    @CurrentUser() user: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('productId') productId?: string,
    @Query('movementType') movementType?: string,
  ) {
    return this.productMovementService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 100,
      productId,
      movementType as MovementType | undefined,
      user?.tenantId || user?.userId, // Adjusted for safety
    );
  }
}
