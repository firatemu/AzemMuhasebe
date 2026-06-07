import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Res,
} from '@nestjs/common';
import { ProductExportService } from './product-export.service';
import type { Response } from 'express';
import { TenantResolverService } from '../../common/services/tenant-resolver.service';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto, FindAllProductDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly productExportService: ProductExportService,
    private readonly tenantResolver: TenantResolverService,
  ) { }

  @Get('export/eslesme')
  @RequirePermissions({ module: 'product', action: 'list' })
  async exportEslesme(@Res() res: Response) {
    const tenantId = await this.tenantResolver.resolveForQuery();
    if (!tenantId) {
      throw new Error('Tenant ID not found');
    }
    const buffer = await this.productExportService.generateEslesmeExcel(tenantId);

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=urun-eslesmeleri.xlsx',
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }

  @Post()
  @RequirePermissions({ module: 'product', action: 'create' })
  create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @Get()
  @RequirePermissions({ module: 'product', action: 'list' })
  findAll(@Query() query: FindAllProductDto) {
    return this.productService.findAll(
      query.page,
      query.limit,
      query.search,
      query.isActive,
      query.brand,
      query.mainCategory,
      query.subCategory,
    );
  }

  @Post('match')
  @RequirePermissions({ module: 'product', action: 'create' })
  match(@Body() dto: { mainProductId: string; equivalentProductIds: string[] }) {
    return this.productService.matchProducts(dto.mainProductId, dto.equivalentProductIds);
  }

  @Post('match-oem')
  @RequirePermissions({ module: 'product', action: 'create' })
  matchOem() {
    return this.productService.matchOemIle();
  }

  @Get(':id/can-delete')
    @RequirePermissions({ module: 'product', action: 'view' })
    canDelete(@Param('id') id: string) {
    return this.productService.canDelete(id);
  }

  @Get(':id/stock-movements')
  @RequirePermissions({ module: 'product', action: 'view' })
  getHareketler(
    @Param('id') id: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.productService.getStockMovements(
      id,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 50,
    );
  }

  @Get(':id/esdegerler')
  @RequirePermissions({ module: 'product', action: 'view' })
  getEsdegerler(@Param('id') id: string) {
    return this.productService.getEsdegerUrunler(id);
  }

  @Post(':product1Id/esdeger/:product2Id')
  @RequirePermissions({ module: 'product', action: 'create' })
  addEsdeger(
    @Param('product1Id') product1Id: string,
    @Param('product2Id') product2Id: string,
  ) {
    return this.productService.addEsdeger(product1Id, product2Id);
  }

  @Delete(':id/eslesme/:eslesikId')
  @RequirePermissions({ module: 'product', action: 'delete' })
  matchmeCiftiKaldir(
    @Param('id') id: string,
    @Param('eslesikId') eslesikId: string,
  ) {
    return this.productService.matchmeCiftiKaldir(id, eslesikId);
  }

  @Delete(':id/match')
  @RequirePermissions({ module: 'product', action: 'delete' })
  matchmeKaldir(@Param('id') id: string) {
    return this.productService.matchmeKaldir(id);
  }

  @Get(':id/last-purchase-price')
  @RequirePermissions({ module: 'product', action: 'view' })
  getLastPurchasePrice(@Param('id') id: string) {
    return this.productService.getLastPurchasePrice(id);
  }

  @Get(':id')
  @RequirePermissions({ module: 'product', action: 'view' })
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions({ module: 'product', action: 'update' })
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermissions({ module: 'product', action: 'delete' })
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
