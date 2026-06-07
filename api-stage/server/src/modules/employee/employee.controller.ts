import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { CreateEmployeeOdemeDto } from './dto/create-employee-payment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';

@Controller('employees')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  // Özel route'lar önce tanımlanmalı

  @Get('stats')
  @RequirePermissions({ module: 'hr', action: 'list' })
  async getStats(
    @Query('department') department?: string,
    @Query('isActive') isActive?: string,
  ) {
    const isActiveBoolean =
      isActive === 'true' ? true : isActive === 'false' ? false : undefined;
    return this.employeeService.getStats(department, isActiveBoolean);
  }

  @Get('departmentlar')
  @RequirePermissions({ module: 'hr', action: 'list' })
  async getDepartmanlar() {
    return this.employeeService.getDepartmanlar();
  }

  // Genel listele endpoint'i
  @Get()
  @RequirePermissions({ module: 'hr', action: 'list' })
  async findAll(
    @Query('isActive') isActive?: string,
    @Query('department') department?: string,
  ) {
    const isActiveBoolean =
      isActive === 'true' ? true : isActive === 'false' ? false : undefined;
    return this.employeeService.findAll(isActiveBoolean, department);
  }

  @Post()
  @RequirePermissions({ module: 'hr', action: 'create' })
  async create(@Body() createDto: CreateEmployeeDto, @Request() req) {
    return this.employeeService.create(createDto, req.user.userId);
  }

  // Parametrik route'lar en sona konmalı
  @Get(':id')
  @RequirePermissions({ module: 'hr', action: 'view' })
  async findOne(@Param('id') id: string) {
    return this.employeeService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions({ module: 'hr', action: 'update' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateEmployeeDto,
    @Request() req,
  ) {
    return this.employeeService.update(id, updateDto, req.user.userId);
  }

  @Delete(':id')
  @RequirePermissions({ module: 'hr', action: 'delete' })
  async remove(@Param('id') id: string) {
    return this.employeeService.remove(id);
  }

  // Ödeme işlemleri
  @Post('odeme')
  @RequirePermissions({ module: 'hr', action: 'approve' })
  async createOdeme(
    @Body() createOdemeDto: CreateEmployeeOdemeDto,
    @Request() req,
  ) {
    return this.employeeService.createOdeme(createOdemeDto, req.user.userId);
  }

  @Get(':id/payments')
  @RequirePermissions({ module: 'hr', action: 'view' })
  async getOdemeler(@Param('id') employeeId: string) {
    return this.employeeService.getOdemeler(employeeId);
  }
}
