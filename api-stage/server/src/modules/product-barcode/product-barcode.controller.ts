import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ProductBarcodeService } from './product-barcode.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { CreateProductBarcodeDto } from './dto/create-product-barcode.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('product-barcode')
export class ProductBarcodeController {
  constructor(private readonly productBarcodeService: ProductBarcodeService) {}

  @Get('product/:productId')
  @RequirePermissions({ module: 'product', action: 'view' })
  findByProduct(@Param('productId') productId: string) {
    return this.productBarcodeService.findByProduct(productId);
  }

  @Get('barcode/:barcode')
  @RequirePermissions({ module: 'product', action: 'view' })
  findByBarcode(@Param('barcode') barcode: string) {
    return this.productBarcodeService.findByBarcode(barcode);
  }

  @Post()
  @RequirePermissions({ module: 'product', action: 'create' })
  create(@Body() createDto: CreateProductBarcodeDto) {
    return this.productBarcodeService.create(createDto);
  }

  @Put(':id/set-primary')
  @RequirePermissions({ module: 'product', action: 'update' })
  setPrimary(@Param('id') id: string) {
    return this.productBarcodeService.setPrimary(id);
  }

  @Delete(':id')
  @RequirePermissions({ module: 'product', action: 'delete' })
  remove(@Param('id') id: string) {
    return this.productBarcodeService.remove(id);
  }
}
