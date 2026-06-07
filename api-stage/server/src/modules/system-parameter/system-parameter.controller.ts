import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { SystemParameterService } from './system-parameter.service';
import { CreateParameterDto } from './dto/create-parameter.dto';
import { UpdateParameterDto } from './dto/update-parameter.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('system-parameters')
export class SystemParameterController {
  constructor(
    private readonly systemParameterService: SystemParameterService,
  ) {}

  @Get()
  @RequirePermissions({ module: 'settings', action: 'list' })
  getAll(@Query('category') category?: string) {
    if (category) {
      return this.systemParameterService.getParametersByCategory(category);
    }
    return this.systemParameterService.getAllParameters();
  }

  @Get(':key')
  @RequirePermissions({ module: 'settings', action: 'view' })
  getOne(@Param('key') key: string) {
    return this.systemParameterService.getParameter(key);
  }

  @Post()
  @RequirePermissions({ module: 'settings', action: 'create' })
  create(@Body() createParameterDto: CreateParameterDto) {
    return this.systemParameterService.create(createParameterDto);
  }

  @Put(':key')
  @RequirePermissions({ module: 'settings', action: 'update' })
  update(
    @Param('key') key: string,
    @Body() updateParameterDto: UpdateParameterDto,
  ) {
    return this.systemParameterService.update(key, updateParameterDto);
  }

  @Delete(':key')
  @RequirePermissions({ module: 'settings', action: 'delete' })
  remove(@Param('key') key: string) {
    return this.systemParameterService.remove(key);
  }
}
