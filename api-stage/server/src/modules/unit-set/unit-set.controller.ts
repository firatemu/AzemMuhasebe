import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { UnitSetService } from './unit-set.service';
import { CreateUnitSetDto, UpdateUnitSetDto } from './dto/unit-set.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';

@ApiTags('Unit Sets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('unit-sets')
export class UnitSetController {
  constructor(private readonly unitSetService: UnitSetService) {}

  @Get()
  @RequirePermissions({ module: 'unit-set', action: 'list' })
  @ApiOperation({ summary: 'Tüm birim setlerini listele (sistem + tenant)' })
  findAll() {
    return this.unitSetService.findAll();
  }

  @Post()
  @RequirePermissions({ module: 'unit-set', action: 'create' })
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Yeni birim seti oluştur (yalnızca tenant)' })
  create(@Body() dto: CreateUnitSetDto) {
    return this.unitSetService.create(dto);
  }

  @Post('ensure-defaults')
  @RequirePermissions({ module: 'unit-set', action: 'create' })
  @ApiOperation({
    summary: 'Sistem varsayılan birim setlerini oluştur',
    description:
      'Adet, Ağırlık, Hacim, Uzunluk, Alan ve Ambalaj birim setlerini sistem için oluşturur',
  })
  async ensureDefaults() {
    await this.unitSetService.ensureSystemDefaults();
    return {
      success: true,
      message: 'Sistem varsayılan birim setleri oluşturuldu',
    };
  }

  @Post('bulk-from-templates')
  @RequirePermissions({ module: 'unit-set', action: 'create' })
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Tüm şablon birim setlerini otomatik oluştur',
    description:
      'Sistem varsayılanlarını oluşturur; Adet, Paket, Koli, uzunluk, ağırlık vb. şablon setlerinden eksik olanları tenant için ekler',
  })
  bulkFromTemplates() {
    return this.unitSetService.bulkCreateFromTemplates();
  }

  @Get(':id')
  @RequirePermissions({ module: 'unit-set', action: 'view' })
  @ApiOperation({ summary: 'Tek birim setini getir' })
  @ApiParam({ name: 'id', description: 'Birim seti UUID' })
  findOne(@Param('id') id: string) {
    return this.unitSetService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions({ module: 'unit-set', action: 'update' })
  @ApiOperation({ summary: 'Birim setini güncelle (yalnızca tenant)' })
  @ApiParam({ name: 'id', description: 'Birim seti UUID' })
  update(@Param('id') id: string, @Body() dto: UpdateUnitSetDto) {
    return this.unitSetService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermissions({ module: 'unit-set', action: 'delete' })
  @ApiOperation({
    summary: 'Birim setini sil (yalnızca tenant, ürün bağlantısı yoksa)',
  })
  @ApiParam({ name: 'id', description: 'Birim seti UUID' })
  remove(@Param('id') id: string) {
    return this.unitSetService.remove(id);
  }
}
