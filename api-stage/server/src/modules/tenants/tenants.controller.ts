import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
  Req,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  editFileName,
  imageFileFilter,
} from '../../common/utils/file-upload.utils';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { UpdateTenantSettingsDto } from './dto/update-tenant-settings.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  @RequirePermissions({ module: 'settings', action: 'create' })
  create(@Body() createTenantDto: CreateTenantDto) {
    return this.tenantsService.create(createTenantDto);
  }

  @Get()
  @RequirePermissions({ module: 'settings', action: 'list' })
  findAll() {
    return this.tenantsService.findAll();
  }

  @Get('current')
  @RequirePermissions({ module: 'settings', action: 'view' })
  async getCurrent(@Req() req: any) {
    const tenantId = await (
      this.tenantsService as any
    ).tenantResolver.resolveForQuery();
    return this.tenantsService.getCurrent(tenantId);
  }

  @Get('settings')
  @RequirePermissions({ module: 'settings', action: 'view' })
  async getSettings(@Req() req: any) {
    const tenantId = await (
      this.tenantsService as any
    ).tenantResolver.resolveForQuery();
    return this.tenantsService.getSettings(tenantId);
  }

  @Put('settings')
  @RequirePermissions({ module: 'settings', action: 'update' })
  async updateSettings(
    @Req() req: any,
    @Body() updateSettingsDto: UpdateTenantSettingsDto,
  ) {
    const tenantId = await (
      this.tenantsService as any
    ).tenantResolver.resolveForCreate();
    return this.tenantsService.updateSettings(tenantId, updateSettingsDto);
  }

  @Post('settings/logo')
  @RequirePermissions({ module: 'settings', action: 'update' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadLogo(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    const tenantId = req.user?.tenantId;
    // URL'yi oluştur - main.ts'de /api/uploads olarak sunuluyor
    const logoUrl = `/api/uploads/${file.filename}`;
    return this.tenantsService.updateLogo(tenantId, logoUrl);
  }

  @Get(':id')
  @RequirePermissions({ module: 'settings', action: 'view' })
  findOne(@Param('id') id: string) {
    return this.tenantsService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions({ module: 'settings', action: 'update' })
  update(@Param('id') id: string, @Body() updateTenantDto: UpdateTenantDto) {
    return this.tenantsService.update(id, updateTenantDto);
  }

  @Delete(':id')
  @RequirePermissions({ module: 'settings', action: 'delete' })
  remove(@Param('id') id: string) {
    return this.tenantsService.remove(id);
  }

  @Post(':id/approve-trial')
  @RequirePermissions({ module: 'settings', action: 'approve' })
  approveTrial(@Param('id') id: string) {
    return this.tenantsService.approveTrial(id);
  }
}
