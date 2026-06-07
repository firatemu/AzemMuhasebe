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
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { mkdirSync, existsSync } from 'fs';
import { CustomerVehicleService } from './customer-vehicle.service';
import { CreateCustomerVehicleDto, UpdateCustomerVehicleDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import {
  editFileName,
  imageFileFilter,
} from '../../common/utils/file-upload.utils';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('customer-vehicles')
export class CustomerVehicleController {
  constructor(
    private readonly customerVehicleService: CustomerVehicleService,
  ) {}

  @Post('upload-ruhsat')
  @RequirePermissions({ module: 'vehicle', action: 'create' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const dir = './uploads/ruhsat';
          if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
          cb(null, dir);
        },
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadRuhsatPhoto(@UploadedFile() file: Express.Multer.File) {
    const url = `/api/uploads/ruhsat/${file.filename}`;
    return { url };
  }

  @Post()
  @RequirePermissions({ module: 'vehicle', action: 'create' })
  create(@Body() dto: CreateCustomerVehicleDto) {
    return this.customerVehicleService.create(dto);
  }

  @Get()
  @RequirePermissions({ module: 'vehicle', action: 'list' })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('accountId') accountId?: string,
  ) {
    return this.customerVehicleService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 50,
      search,
      accountId,
    );
  }

  @Get(':id')
  @RequirePermissions({ module: 'vehicle', action: 'view' })
  findOne(@Param('id') id: string) {
    return this.customerVehicleService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions({ module: 'vehicle', action: 'update' })
  update(@Param('id') id: string, @Body() dto: UpdateCustomerVehicleDto) {
    return this.customerVehicleService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermissions({ module: 'vehicle', action: 'delete' })
  remove(@Param('id') id: string) {
    return this.customerVehicleService.remove(id);
  }
}
