import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PriceCardService } from './price-card.service';
import { PriceCardExportService } from './price-card-export.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { CreatePriceCardDto, PriceType } from './dto/create-price-card.dto';
import { UpdatePriceCardDto } from './dto/update-price-card.dto';
import { BulkUpdatePriceCardDto } from './dto/bulk-update-price-card.dto';
import {
  FindAllPriceCardsDto,
  FindPriceCardsDto,
  LatestPriceQueryDto,
} from './dto/find-price-cards.dto';
import { type Request, type Response } from 'express';

@Controller('price-cards')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PriceCardController {
  constructor(
    private readonly priceCardService: PriceCardService,
    private readonly priceCardExportService: PriceCardExportService,
  ) {}

  @Post('bulk-update')
  @RequirePermissions({ module: 'product', action: 'update' })
  bulkUpdate(
    @Body() bulkUpdateDto: BulkUpdatePriceCardDto,
    @Req() req: Request,
  ) {
    const userId = (req as any)?.user?.id as string | undefined;
    return this.priceCardService.bulkUpdatePrices(bulkUpdateDto, userId);
  }

  @Post()
  @RequirePermissions({ module: 'product', action: 'create' })
  create(@Body() createDto: CreatePriceCardDto, @Req() req: Request) {
    const userId = (req as any)?.user?.id as string | undefined;
    return this.priceCardService.create(createDto, userId);
  }

  @Get('export/excel')
  @RequirePermissions({ module: 'product', action: 'export' })
  async exportExcel(
    @Query('type') type: string,
    @Query('status') status: string,
    @Query('search') search: string,
    @Res() res: Response,
  ) {
    const buffer = await this.priceCardExportService.generateExcel(
      type || undefined,
      status || undefined,
      search || undefined,
    );

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=fiyat_kartlari_${new Date().toISOString().split('T')[0]}.xlsx`,
    );
    res.send(buffer);
  }

  @Get()
  @RequirePermissions({ module: 'product', action: 'list' })
  findAll(@Query() query: FindAllPriceCardsDto) {
    return this.priceCardService.findAll(query);
  }

  @Get('product/:productId')
  @RequirePermissions({ module: 'product', action: 'view' })
  findByStok(
    @Param('productId') productId: string,
    @Query() query: FindPriceCardsDto,
  ) {
    return this.priceCardService.findByStok(productId, query);
  }

  @Get('product/:productId/latest')
  @RequirePermissions({ module: 'product', action: 'view' })
  findLatest(
    @Param('productId') productId: string,
    @Query() query: LatestPriceQueryDto,
  ) {
    const type = query.type ?? PriceType.SALE;
    return this.priceCardService.findLatest(productId, type);
  }

  @Get(':id')
  @RequirePermissions({ module: 'product', action: 'view' })
  findOne(@Param('id') id: string) {
    return this.priceCardService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions({ module: 'product', action: 'update' })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdatePriceCardDto,
    @Req() req: Request,
  ) {
    const userId = (req as any)?.user?.id as string | undefined;
    return this.priceCardService.update(id, updateDto, userId);
  }

  @Delete(':id')
  @RequirePermissions({ module: 'product', action: 'delete' })
  remove(@Param('id') id: string) {
    return this.priceCardService.remove(id);
  }
}
