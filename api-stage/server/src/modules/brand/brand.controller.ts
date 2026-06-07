import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get()
  @RequirePermissions({ module: 'product', action: 'list' })
  findAll() {
    return this.brandService.findAll();
  }

  @Post()
  @RequirePermissions({ module: 'product', action: 'create' })
  create(@Body('brandName') brandName: string) {
    return this.brandService.create(brandName);
  }

  @Get(':brandName')
  @RequirePermissions({ module: 'product', action: 'view' })
  findOne(@Param('brandName') brandName: string) {
    return this.brandService.findOne(brandName);
  }

  @Put(':brandName')
  @RequirePermissions({ module: 'product', action: 'update' })
  update(
    @Param('brandName') brandName: string,
    @Body('newBrandName') newBrandName: string,
  ) {
    return this.brandService.update(brandName, newBrandName);
  }

  @Delete(':brandName')
  @RequirePermissions({ module: 'product', action: 'delete' })
  remove(@Param('brandName') brandName: string) {
    return this.brandService.remove(brandName);
  }
}
