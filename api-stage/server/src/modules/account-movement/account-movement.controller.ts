import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Res,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { AccountMovementService } from './account-movement.service';
import { CreateAccountMovementDto, StatementQueryDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';

@Controller('account-movements')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AccountMovementController {
  constructor(
    private readonly accountMovementService: AccountMovementService,
  ) {}

  @Post()
  @RequirePermissions({ module: 'account', action: 'create' })
  async create(@Body() dto: CreateAccountMovementDto) {
    return this.accountMovementService.create(dto);
  }

  @Get()
  @RequirePermissions({ module: 'account', action: 'list' })
  async findAll(
    @Query('accountId') accountId: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.accountMovementService.findAll(
      accountId,
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 100,
    );
  }

  @Get('statement')
  @RequirePermissions({ module: 'account', action: 'view' })
  async getStatement(@Query() query: StatementQueryDto) {
    return this.accountMovementService.getStatement(query);
  }

  private normalizeStatementDates(query: Record<string, string | undefined>) {
    return {
      startDate: query.startDate || query.baslangicTarihi,
      endDate: query.endDate || query.bitisTarihi,
    };
  }

  private extractIncludeQuery(query: Record<string, string | undefined>) {
    return {
      invoiceLines: query.invoiceLines,
      collections: query.collections,
      checks: query.checks,
    };
  }

  @Get('statement/detailed')
  @RequirePermissions({ module: 'account', action: 'view' })
  getDetailedStatement(@Query() query: Record<string, string | undefined>) {
    const accountId = query.accountId;
    const dates = this.normalizeStatementDates(query);
    return this.accountMovementService.getDetailedStatement(
      { accountId, ...dates },
      this.extractIncludeQuery(query),
    );
  }

  @Get('statement/detailed/export/excel')
  @RequirePermissions({ module: 'account', action: 'export' })
  async exportDetailedExcel(
    @Query() query: Record<string, string | undefined>,
    @Res() res: Response,
  ) {
    try {
      const dates = this.normalizeStatementDates(query);
      const buffer = await this.accountMovementService.exportDetailedExcel(
        { accountId: query.accountId, ...dates },
        this.extractIncludeQuery(query),
      );
      res.set({
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="account-statement-detailed-${Date.now()}.xlsx"`,
        'Content-Length': buffer.length,
      });
      res.send(buffer);
    } catch (error) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message || 'Excel oluşturulurken hata oluştu',
      });
    }
  }

  @Get('statement/detailed/export/pdf')
  @RequirePermissions({ module: 'account', action: 'export' })
  async exportDetailedPdf(
    @Query() query: Record<string, string | undefined>,
    @Res() res: Response,
  ) {
    try {
      const dates = this.normalizeStatementDates(query);
      const buffer = await this.accountMovementService.exportDetailedPdf(
        { accountId: query.accountId, ...dates },
        this.extractIncludeQuery(query),
      );
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="account-statement-detailed-${Date.now()}.pdf"`,
        'Content-Length': buffer.length,
      });
      res.send(buffer);
    } catch (error) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message || 'PDF oluşturulurken hata oluştu',
      });
    }
  }

  @Get('statement/excel')
  @RequirePermissions({ module: 'account', action: 'export' })
  async exportExcel(@Query() query: StatementQueryDto, @Res() res: Response) {
    try {
      const buffer = await this.accountMovementService.exportExcel(query);

      res.set({
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="account-statement-${Date.now()}.xlsx"`,
        'Content-Length': buffer.length,
      });

      res.send(buffer);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Excel oluşturulurken hata oluştu',
        error: error.message,
      });
    }
  }

  @Get('statement/pdf')
  @RequirePermissions({ module: 'account', action: 'export' })
  async exportPdf(@Query() query: StatementQueryDto, @Res() res: Response) {
    try {
      const buffer = await this.accountMovementService.exportPdf(query);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="account-statement-${Date.now()}.pdf"`,
        'Content-Length': buffer.length,
      });

      res.send(buffer);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'PDF oluşturulurken hata oluştu',
        error: error.message,
      });
    }
  }

  @Delete(':id')
  @RequirePermissions({ module: 'account', action: 'delete' })
  async delete(@Param('id') id: string) {
    return this.accountMovementService.delete(id);
  }
}
