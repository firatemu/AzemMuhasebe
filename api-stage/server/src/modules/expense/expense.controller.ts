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
import { ExpenseService } from './expense.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('expenses')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Get('stats')
  @RequirePermissions({ module: 'expense', action: 'list' })
  getStats(
    @Query('categoryId') categoryId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.expenseService.getStats(categoryId, startDate, endDate);
  }

  @Get('categoryler')
  @RequirePermissions({ module: 'expense', action: 'list' })
  findAllCategoryler() {
    return this.expenseService.findAllCategoryler();
  }

  @Get()
  @RequirePermissions({ module: 'expense', action: 'list' })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('categoryId') categoryId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.expenseService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 50,
      categoryId,
      startDate,
      endDate,
    );
  }

  @Get(':id')
  @RequirePermissions({ module: 'expense', action: 'view' })
  findOne(@Param('id') id: string) {
    return this.expenseService.findOne(id);
  }

  @Post()
  @RequirePermissions({ module: 'expense', action: 'create' })
  create(@Body() createDto: CreateExpenseDto) {
    return this.expenseService.create(createDto);
  }

  @Post('categoryler')
  @RequirePermissions({ module: 'expense', action: 'create' })
  createCategory(@Body() body: { name: string; notes?: string }) {
    return this.expenseService.createCategory(body.name, body.notes);
  }

  @Put('categoryler/:id')
  @RequirePermissions({ module: 'expense', action: 'update' })
  updateCategory(
    @Param('id') id: string,
    @Body() body: { name: string; notes?: string },
  ) {
    return this.expenseService.updateCategory(id, body.name, body.notes);
  }

  @Delete('categoryler/:id')
  @RequirePermissions({ module: 'expense', action: 'delete' })
  removeCategory(@Param('id') id: string) {
    return this.expenseService.removeCategory(id);
  }

  @Put(':id')
  @RequirePermissions({ module: 'expense', action: 'update' })
  update(@Param('id') id: string, @Body() updateDto: UpdateExpenseDto) {
    return this.expenseService.update(id, updateDto);
  }

  @Delete(':id')
  @RequirePermissions({ module: 'expense', action: 'delete' })
  remove(@Param('id') id: string) {
    return this.expenseService.remove(id);
  }
}
