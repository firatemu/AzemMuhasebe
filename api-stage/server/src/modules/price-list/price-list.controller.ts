import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PriceListService } from './price-list.service';
import { CreatePriceListDto } from './dto/create-price-list.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';

@Controller('price-lists')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PriceListController {
  constructor(private readonly priceListService: PriceListService) {}

  @Post()
  @RequirePermissions({ module: 'product', action: 'create' })
  create(@Body() createDto: CreatePriceListDto) {
    return this.priceListService.create(createDto);
  }

  @Get()
  @RequirePermissions({ module: 'product', action: 'list' })
  findAll(@Req() req: any) {
    return this.priceListService.findAll(req.user?.tenantId);
  }

  @Get('product/:productId')
  @RequirePermissions({ module: 'product', action: 'view' })
  findStokPrice(
    @Param('productId') productId: string,
    @Query('accountId') accountId?: string,
  ) {
    return this.priceListService.findStokPrice(productId, accountId);
  }

  @Get(':id')
  @RequirePermissions({ module: 'product', action: 'view' })
  findOne(@Param('id') id: string) {
    return this.priceListService.findOne(id);
  }
}
