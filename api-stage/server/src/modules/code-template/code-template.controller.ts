import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { CodeTemplateService } from './code-template.service';
import { CreateCodeTemplateDto } from './dto/create-code-template.dto';
import { UpdateCodeTemplateDto } from './dto/update-code-template.dto';
import { GetNextCodeDto } from './dto/get-next-code.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { ModuleType } from './code-template.enums';

@ApiTags('code-template')
@Controller('code-templates')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CodeTemplateController {
  constructor(private readonly codeTemplateService: CodeTemplateService) {}

  @Post()
  @RequirePermissions({ module: 'settings', action: 'create' })
  create(@Body() createDto: CreateCodeTemplateDto) {
    return this.codeTemplateService.create(createDto);
  }

  @Get('next-code/:module')
  @RequirePermissions({ module: 'settings', action: 'view' })
  @ApiParam({ name: 'module', enum: ModuleType })
  async getNextCode(@Param('module') module: string) {
    const code = await this.codeTemplateService.getNextCode(
      module as ModuleType,
    );
    return { nextCode: code };
  }

  @Get('preview-code/:module')
  @RequirePermissions({ module: 'settings', action: 'view' })
  @ApiParam({ name: 'module', enum: ModuleType })
  async getPreviewCode(@Param('module') module: string) {
    const code = await this.codeTemplateService.getPreviewCode(
      module as ModuleType,
    );
    return { nextCode: code };
  }

  @Get('by-module/:module')
  @RequirePermissions({ module: 'settings', action: 'view' })
  @ApiParam({ name: 'module', enum: ModuleType })
  findByModule(@Param('module') module: string) {
    return this.codeTemplateService.findByModule(module as ModuleType);
  }

  @Get()
  @RequirePermissions({ module: 'settings', action: 'list' })
  findAll() {
    return this.codeTemplateService.findAll();
  }

  @Get(':id')
  @RequirePermissions({ module: 'settings', action: 'view' })
  findOne(@Param('id') id: string) {
    return this.codeTemplateService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions({ module: 'settings', action: 'update' })
  update(@Param('id') id: string, @Body() updateDto: UpdateCodeTemplateDto) {
    return this.codeTemplateService.update(id, updateDto);
  }

  @Delete(':id')
  @RequirePermissions({ module: 'settings', action: 'delete' })
  remove(@Param('id') id: string) {
    return this.codeTemplateService.remove(id);
  }

  @Post('reset-counter/:module')
  @RequirePermissions({ module: 'settings', action: 'update' })
  @ApiParam({ name: 'module', enum: ModuleType })
  resetCounter(
    @Param('module') module: string,
    @Body('newValue') newValue?: number,
  ) {
    return this.codeTemplateService.resetCounter(
      module as ModuleType,
      newValue,
    );
  }

  @Post('save-manual-code/:module')
  @RequirePermissions({ module: 'settings', action: 'update' })
  @ApiParam({ name: 'module', enum: ModuleType })
  saveManualCode(@Param('module') module: string, @Body('code') code: string) {
    return this.codeTemplateService.saveLastCode(module as ModuleType, code);
  }
}
