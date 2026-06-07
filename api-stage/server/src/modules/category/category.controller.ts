import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @RequirePermissions({ module: 'product', action: 'list' })
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':mainCategory/subcategories')
  @RequirePermissions({ module: 'product', action: 'view' })
  findSubCategories(@Param('mainCategory') mainCategory: string) {
    return this.categoryService.findSubCategories(mainCategory);
  }

  @Post(':mainCategory/subcategory')
  @RequirePermissions({ module: 'product', action: 'create' })
  addSubCategory(
    @Param('mainCategory') mainCategory: string,
    @Body('subCategory') subCategory: string,
  ) {
    return this.categoryService.addSubCategory(mainCategory, subCategory);
  }

  @Post('main-category')
  @RequirePermissions({ module: 'product', action: 'create' })
  addMainCategory(@Body('mainCategory') mainCategory: string) {
    return this.categoryService.addMainCategory(mainCategory);
  }

  @Delete(':mainCategory/subcategory/:subCategory')
  @RequirePermissions({ module: 'product', action: 'delete' })
  removeSubCategory(
    @Param('mainCategory') mainCategory: string,
    @Param('subCategory') subCategory: string,
  ) {
    return this.categoryService.removeSubCategory(mainCategory, subCategory);
  }

  @Delete(':mainCategory')
  @RequirePermissions({ module: 'product', action: 'delete' })
  removeMainCategory(@Param('mainCategory') mainCategory: string) {
    return this.categoryService.removeMainCategory(mainCategory);
  }
}
