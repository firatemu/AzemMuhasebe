import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { BankAccountService } from './bank-account.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('bank-accounts')
export class BankAccountController {
  constructor(private readonly bankAccountService: BankAccountService) {}

  @Post()
  @RequirePermissions({ module: 'bank', action: 'create' })
  create(@Body() createDto: CreateBankAccountDto) {
    return this.bankAccountService.create(createDto);
  }

  @Get()
  @RequirePermissions({ module: 'bank', action: 'list' })
  findAll(@Query('bankId') bankId?: string, @Query('type') type?: string) {
    return this.bankAccountService.findAll(bankId, type);
  }

  @Get(':id')
  @RequirePermissions({ module: 'bank', action: 'view' })
  findOne(@Param('id') id: string) {
    return this.bankAccountService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions({ module: 'bank', action: 'update' })
  update(@Param('id') id: string, @Body() updateDto: UpdateBankAccountDto) {
    return this.bankAccountService.update(id, updateDto);
  }

  @Delete(':id')
  @RequirePermissions({ module: 'bank', action: 'delete' })
  remove(@Param('id') id: string) {
    return this.bankAccountService.remove(id);
  }
}
