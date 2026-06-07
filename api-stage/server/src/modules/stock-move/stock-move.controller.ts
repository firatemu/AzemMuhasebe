import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { StockMoveService } from './stock-move.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { PutAwayDto } from './dto/put-away.dto';
import { BulkPutAwayDto } from './dto/bulk-put-away.dto';
import { TransferDto } from './dto/transfer.dto';
import { AssignLocationDto } from './dto/assign-location.dto';
import { StockMoveType } from './dto/create-stock-move.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('stock-move')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('stock-movements')
export class StockMoveController {
  constructor(private readonly stockMoveService: StockMoveService) {}

  @Get()
  @RequirePermissions({ module: 'warehouse', action: 'list' })
  @ApiQuery({ name: 'moveType', enum: StockMoveType, required: false })
  findAll(
    @Query('productId') productId?: string,
    @Query('warehouseId') warehouseId?: string,
    @Query('locationId') locationId?: string,
    @Query('moveType') moveType?: StockMoveType,
    @Query('limit') limit?: number,
  ) {
    const limitValue = limit ? parseInt(limit.toString(), 10) : undefined;
    return this.stockMoveService.findAll(
      productId,
      warehouseId,
      locationId,
      moveType,
      limitValue,
    );
  }

  @Get(':id')
  @RequirePermissions({ module: 'warehouse', action: 'view' })
  findOne(@Param('id') id: string) {
    return this.stockMoveService.findOne(id);
  }

  @Post('assign-location')
  @RequirePermissions({ module: 'warehouse', action: 'update' })
  assignLocation(
    @Body() assignLocationDto: AssignLocationDto,
    @CurrentUser() user: any,
  ) {
    return this.stockMoveService.assignLocation(
      assignLocationDto,
      user?.userId,
    );
  }

  @Post('put-away')
  @RequirePermissions({ module: 'warehouse', action: 'update' })
  putAway(@Body() putAwayDto: PutAwayDto, @CurrentUser() user: any) {
    return this.stockMoveService.putAway(putAwayDto, user?.userId);
  }

  @Post('put-away/bulk')
  @RequirePermissions({ module: 'warehouse', action: 'update' })
  bulkPutAway(
    @Body() bulkPutAwayDto: BulkPutAwayDto,
    @CurrentUser() user: any,
  ) {
    return this.stockMoveService.bulkPutAway(bulkPutAwayDto, user?.userId);
  }

  @Post('transfer')
  @RequirePermissions({ module: 'warehouse', action: 'update' })
  transfer(@Body() transferDto: TransferDto, @CurrentUser() user: any) {
    return this.stockMoveService.transfer(transferDto, user?.userId);
  }
}
