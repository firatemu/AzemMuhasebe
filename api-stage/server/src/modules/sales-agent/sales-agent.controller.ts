import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { SalesAgentService } from './sales-agent.service';
import { CreateSalesAgentDto } from './dto/create-sales-agent.dto';
import { UpdateSalesAgentDto } from './dto/update-sales-agent.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';

@Controller('sales-agent')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class SalesAgentController {
  constructor(private readonly salesAgentService: SalesAgentService) {}

  @Post()
  @RequirePermissions({ module: 'sales-agent', action: 'create' })
  create(@Body() createDto: CreateSalesAgentDto, @Req() req: any) {
    return this.salesAgentService.create(createDto, req.user?.id);
  }

  @Get()
  @RequirePermissions({ module: 'sales-agent', action: 'list' })
  findAll() {
    return this.salesAgentService.findAll();
  }

  @Get(':id')
  @RequirePermissions({ module: 'sales-agent', action: 'view' })
  findOne(@Param('id') id: string) {
    return this.salesAgentService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions({ module: 'sales-agent', action: 'update' })
  update(@Param('id') id: string, @Body() updateDto: UpdateSalesAgentDto) {
    return this.salesAgentService.update(id, updateDto);
  }

  @Delete(':id')
  @RequirePermissions({ module: 'sales-agent', action: 'delete' })
  remove(@Param('id') id: string) {
    return this.salesAgentService.remove(id);
  }
}
