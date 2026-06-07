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
} from '@nestjs/common';
import { LocationService } from './location.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  @RequirePermissions({ module: 'warehouse', action: 'list' })
  findAll(
    @Query('warehouseId') warehouseId?: string,
    @Query('active') active?: string,
    @Query('layer') layer?: number,
    @Query('corridor') corridor?: string,
  ) {
    const activeValue = active === undefined ? undefined : active === 'true';
    const layerValue = layer ? parseInt(layer.toString(), 10) : undefined;
    return this.locationService.findAll(
      warehouseId,
      activeValue,
      layerValue,
      corridor,
    );
  }

  @Get('code/:code')
  @RequirePermissions({ module: 'warehouse', action: 'view' })
  findByCode(@Param('code') code: string) {
    return this.locationService.findByCode(code);
  }

  @Get('barcode/:barcode')
  @RequirePermissions({ module: 'warehouse', action: 'view' })
  findByBarcode(@Param('barcode') barcode: string) {
    return this.locationService.findByBarcode(barcode);
  }

  @Get(':id')
  @RequirePermissions({ module: 'warehouse', action: 'view' })
  findOne(@Param('id') id: string) {
    return this.locationService.findOne(id);
  }

  @Post()
  @RequirePermissions({ module: 'warehouse', action: 'create' })
  create(@Body() createDto: CreateLocationDto) {
    return this.locationService.create(createDto);
  }

  @Put(':id')
  @RequirePermissions({ module: 'warehouse', action: 'update' })
  update(@Param('id') id: string, @Body() updateDto: UpdateLocationDto) {
    return this.locationService.update(id, updateDto);
  }

  @Post('bulk/grid')
  @RequirePermissions({ module: 'warehouse', action: 'create' })
  createBulkGrid(
    @Body()
    body: {
      locations: Array<{
        warehouseId: string;
        layer: number;
        corridor: string;
        side: number;
        section: number;
        level: number;
        active: boolean;
      }>;
    },
  ) {
    return this.locationService.createBulkGrid(body.locations);
  }

  @Post('bulk/sections')
  @RequirePermissions({ module: 'warehouse', action: 'create' })
  createBulkSections(
    @Body()
    body: {
      warehouseId: string;
      layer: number;
      corridor: string;
      side: number;
      sectionCount: number;
    },
  ) {
    return this.locationService.createBulkSections(
      body.warehouseId,
      body.layer,
      body.corridor,
      body.side,
      body.sectionCount,
    );
  }

  @Post('bulk/levels')
  @RequirePermissions({ module: 'warehouse', action: 'create' })
  createBulkLevels(
    @Body()
    body: {
      warehouseId: string;
      layer: number;
      corridor: string;
      side: number;
      section: number;
      levelCount: number;
    },
  ) {
    return this.locationService.createBulkLevels(
      body.warehouseId,
      body.layer,
      body.corridor,
      body.side,
      body.section,
      body.levelCount,
    );
  }

  @Delete('all/delete-all')
  @RequirePermissions({ module: 'warehouse', action: 'delete' })
  deleteAll() {
    return this.locationService.deleteAll();
  }

  @Delete(':id')
  @RequirePermissions({ module: 'warehouse', action: 'delete' })
  remove(@Param('id') id: string) {
    return this.locationService.remove(id);
  }
}
