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
  Request,
} from '@nestjs/common';
import { SalaryPlanService } from './salary-plan.service';
import { CreateSalaryPlanDto } from './dto/create-salary-plan.dto';
import { UpdateSalaryPlanDto } from './dto/update-salary-plan.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';

@Controller('salary-plans')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class SalaryPlanController {
  constructor(private readonly salaryPlanService: SalaryPlanService) {}

  @Post('create')
  @RequirePermissions({ module: 'hr', action: 'create' })
  create(@Body() createDto: CreateSalaryPlanDto) {
    return this.salaryPlanService.createPlanForEmployee(createDto);
  }

  @Get('employee/:employeeId/:year')
  @RequirePermissions({ module: 'hr', action: 'view' })
  getPlanByEmployee(
    @Param('employeeId') employeeId: string,
    @Param('year') year: string,
  ) {
    return this.salaryPlanService.getPlanByEmployee(employeeId, parseInt(year));
  }

  @Get('odenecek/:year/:month')
  @RequirePermissions({ module: 'hr', action: 'list' })
  getOdenecekMaaslar(
    @Param('year') year: string,
    @Param('month') month: string,
  ) {
    return this.salaryPlanService.getOdenecekMaaslar(
      parseInt(year),
      parseInt(month),
    );
  }

  @Get(':id')
  @RequirePermissions({ module: 'hr', action: 'view' })
  getPlanById(@Param('id') id: string) {
    return this.salaryPlanService.getPlanById(id);
  }

  @Patch(':id')
  @RequirePermissions({ module: 'hr', action: 'update' })
  update(@Param('id') id: string, @Body() updateDto: UpdateSalaryPlanDto) {
    return this.salaryPlanService.updatePlan(id, updateDto);
  }

  @Delete(':id')
  @RequirePermissions({ module: 'hr', action: 'delete' })
  delete(@Param('id') id: string) {
    return this.salaryPlanService.deletePlan(id);
  }

  @Delete('yearlik/:employeeId/:year')
  @RequirePermissions({ module: 'hr', action: 'delete' })
  deleteYillikPlan(
    @Param('employeeId') employeeId: string,
    @Param('year') year: string,
  ) {
    return this.salaryPlanService.deleteYillikPlan(employeeId, parseInt(year));
  }
}
