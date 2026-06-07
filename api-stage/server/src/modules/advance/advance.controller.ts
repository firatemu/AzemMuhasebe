import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AdvanceService } from './advance.service';
import { CreateAdvanceDto } from './dto/create-advance.dto';
import { MahsuplastirAdvanceDto } from './dto/mahsuplastir-advance.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';

@Controller('advances')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AdvanceController {
  constructor(private readonly advanceService: AdvanceService) {}

  @Post('create')
  @RequirePermissions({ module: 'hr', action: 'create' })
  create(@Body() createDto: CreateAdvanceDto, @Request() req) {
    return this.advanceService.createAdvance(createDto, req.user.userId);
  }

  @Post('mahsuplastir')
  @RequirePermissions({ module: 'hr', action: 'approve' })
  mahsuplastir(@Body() mahsupDto: MahsuplastirAdvanceDto) {
    return this.advanceService.mahsuplastir(mahsupDto);
  }

  @Get('employee/:employeeId')
  @RequirePermissions({ module: 'hr', action: 'view' })
  getAdvanceByEmployee(@Param('employeeId') employeeId: string) {
    return this.advanceService.getAdvanceByEmployee(employeeId);
  }

  @Get(':id')
  @RequirePermissions({ module: 'hr', action: 'view' })
  getAdvanceDetay(@Param('id') id: string) {
    return this.advanceService.getAdvanceDetay(id);
  }
}
