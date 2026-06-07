import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BankService } from './bank.service';
import { CreateBankDto, UpdateBankDto } from './dto/create-bank.dto';
import {
  BankAccountCreateDto,
  BankAccountUpdateDto,
} from './dto/create-account.dto';
import {
  CreateBankMovementDto,
  CreatePosMovementDto,
} from './dto/create-movement.dto';
import { CreateLoanUsageDto } from './dto/create-loan.dto';
import { PayCreditInstallmentDto } from './dto/pay-credit-installment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';

@Controller('banks')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @Get('ping')
  ping() {
    return 'pong';
  }

  // ============ BANK ENDPOINTS ============

  @Post()
  @RequirePermissions({ module: 'bank', action: 'create' })
  create(@Body() createBankDto: CreateBankDto) {
    return this.bankService.create(createBankDto);
  }

  @Get()
  @RequirePermissions({ module: 'bank', action: 'list' })
  findAll() {
    return this.bankService.findAll();
  }

  @Get('summary')
  @RequirePermissions({ module: 'bank', action: 'list' })
  getBanksSummary() {
    return this.bankService.getBanksSummary();
  }

  @Get('ozet')
  @RequirePermissions({ module: 'bank', action: 'list' })
  getBanksOzet() {
    return this.bankService.getBanksSummary();
  }

  // ============ HAREKET ENDPOINTS ============

  @Get('accounts/:accountId/movements')
  @RequirePermissions({ module: 'bank', action: 'view' })
  getMovements(
    @Param('accountId') accountId: string,
    @Query('start') start?: string,
    @Query('end') end?: string,
    @Query('limit') limit?: string,
  ) {
    return this.bankService.getMovements(accountId, {
      startDate: start ? new Date(start) : undefined,
      endDate: end ? new Date(end) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    });
  }

  @Post('accounts/:accountId/movements')
  @RequirePermissions({ module: 'bank', action: 'create' })
  createMovement(
    @Param('accountId') accountId: string,
    @Body() dto: CreateBankMovementDto,
  ) {
    return this.bankService.createMovement(accountId, dto);
  }

  @Post('accounts/:accountId/pos-payments')
  @RequirePermissions({ module: 'bank', action: 'create' })
  createPosMovement(
    @Param('accountId') accountId: string,
    @Body() dto: CreatePosMovementDto,
  ) {
    return this.bankService.createPosMovement(accountId, dto);
  }

  // ============ KREDİ İŞLEMLERİ ============

  @Get('loans')
  @RequirePermissions({ module: 'bank', action: 'list' })
  getAllLoans() {
    return this.bankService.getAllLoans();
  }

  @Post('accounts/:accountId/loans/use')
  @RequirePermissions({ module: 'bank', action: 'create' })
  useLoan(
    @Param('accountId') accountId: string,
    @Body() dto: CreateLoanUsageDto,
  ) {
    return this.bankService.useLoan(accountId, dto);
  }

  @Get('accounts/:accountId/loans')
  @RequirePermissions({ module: 'bank', action: 'view' })
  getLoans(@Param('accountId') accountId: string) {
    return this.bankService.getLoans(accountId);
  }

  @Get('loans/:loanId')
  @RequirePermissions({ module: 'bank', action: 'view' })
  getLoanDetail(@Param('loanId') loanId: string) {
    return this.bankService.getLoanDetail(loanId);
  }

  @Get('credit-cards/upcoming')
  @RequirePermissions({ module: 'bank', action: 'list' })
  getUpcomingCreditCardDates(
    @Query('start') start?: string,
    @Query('end') end?: string,
  ) {
    return this.bankService.getUpcomingCreditCardDates(
      start ? new Date(start) : new Date(),
      end ? new Date(end) : new Date(),
    );
  }

  @Get('installments/upcoming')
  @RequirePermissions({ module: 'bank', action: 'list' })
  getUpcomingInstallments(
    @Query('start') start?: string,
    @Query('end') end?: string,
  ) {
    return this.bankService.getUpcomingInstallments(
      start ? new Date(start) : new Date(),
      end ? new Date(end) : new Date(),
    );
  }

  @Post('loans/:loanId/plans')
  @RequirePermissions({ module: 'bank', action: 'create' })
  addLoanPlan(
    @Param('loanId') loanId: string,
    @Body() dto: { amount: number; dueDate: Date | string },
  ) {
    return this.bankService.addLoanPlan(loanId, {
      amount: dto.amount,
      dueDate: new Date(dto.dueDate),
    });
  }

  @Put('loan-plans/:id')
  @RequirePermissions({ module: 'bank', action: 'update' })
  updateLoanPlan(
    @Param('id') id: string,
    @Body() dto: { amount?: number; dueDate?: Date | string },
  ) {
    return this.bankService.updateLoanPlan(id, {
      amount: dto.amount,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
    });
  }

  @Delete('loan-plans/:id')
  @RequirePermissions({ module: 'bank', action: 'delete' })
  deleteLoanPlan(@Param('id') id: string) {
    return this.bankService.deleteLoanPlan(id);
  }

  @Post('loan-plans/:id/payments')
  @RequirePermissions({ module: 'bank', action: 'approve' })
  payInstallment(
    @Param('id') id: string,
    @Body() dto: PayCreditInstallmentDto,
  ) {
    return this.bankService.payInstallment(id, dto);
  }

  // ============ HESAP İŞLEMLERİ ============

  @Get('accounts')
  @RequirePermissions({ module: 'bank', action: 'list' })
  findAllAccounts() {
    return this.bankService.findAllAccounts();
  }

  @Post(':id/accounts')
  @RequirePermissions({ module: 'bank', action: 'create' })
  createAccount(@Param('id') id: string, @Body() dto: BankAccountCreateDto) {
    return this.bankService.createAccount(id, dto);
  }

  @Get('accounts/:id')
  @RequirePermissions({ module: 'bank', action: 'view' })
  findAccount(@Param('id') id: string) {
    return this.bankService.findAccount(id);
  }

  @Put('accounts/:id')
  @RequirePermissions({ module: 'bank', action: 'update' })
  updateAccount(@Param('id') id: string, @Body() dto: BankAccountUpdateDto) {
    return this.bankService.updateAccount(id, dto);
  }

  @Delete('accounts/:id')
  @RequirePermissions({ module: 'bank', action: 'delete' })
  removeAccount(@Param('id') id: string) {
    return this.bankService.removeAccount(id);
  }

  // ============ GENERIC BANK ENDPOINTS ============

  @Get(':id')
  @RequirePermissions({ module: 'bank', action: 'view' })
  findOne(@Param('id') id: string) {
    return this.bankService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions({ module: 'bank', action: 'update' })
  update(@Param('id') id: string, @Body() updateBankDto: UpdateBankDto) {
    return this.bankService.update(id, updateBankDto);
  }

  @Delete(':id')
  @RequirePermissions({ module: 'bank', action: 'delete' })
  remove(@Param('id') id: string) {
    return this.bankService.remove(id);
  }
}
