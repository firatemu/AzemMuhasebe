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
    Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { AccountService } from './account.service';
import { AccountMovementService } from '../account-movement/account-movement.service';
import { CreateAccountDto, UpdateAccountDto, DebitCreditReportQueryDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('account')
export class AccountController {
    constructor(
        private readonly accountService: AccountService,
        private readonly accountMovementService: AccountMovementService,
    ) { }

    @Get('report/debit-credit')
    @RequirePermissions({ module: 'account', action: 'list' })
    getDebitCreditReport(@Query() query: DebitCreditReportQueryDto) {
        return this.accountService.getDebitCreditReport(query);
    }

    @Get('report/debit-credit/export/excel')
    @RequirePermissions({ module: 'account', action: 'list' })
    async exportDebitCreditReportExcel(@Query() query: DebitCreditReportQueryDto, @Res() res: Response) {
        const buffer = await this.accountService.exportDebitCreditReportExcel(query);
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename=debit-credit-report.xlsx',
            'Content-Length': buffer.length,
        });
        res.end(buffer);
    }

    @Get('report/debit-credit/export/pdf')
    @RequirePermissions({ module: 'account', action: 'list' })
    async exportDebitCreditReportPdf(@Query() query: DebitCreditReportQueryDto, @Res() res: Response) {
        const buffer = await this.accountService.exportDebitCreditReportPdf(query);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=debit-credit-report.pdf',
            'Content-Length': buffer.length,
        });
        res.end(buffer);
    }

    @Get('report/credit-limits')
    @RequirePermissions({ module: 'account', action: 'list' })
    getCreditLimitReport(@Query() query: DebitCreditReportQueryDto) {
        return this.accountService.getCreditLimitReport(query);
    }

    @Get('report/credit-limits/export/excel')
    @RequirePermissions({ module: 'account', action: 'list' })
    async exportCreditLimitReportExcel(@Query() query: DebitCreditReportQueryDto, @Res() res: Response) {
        const buffer = await this.accountService.exportCreditLimitReportExcel(query);
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename=credit-limits-report.xlsx',
            'Content-Length': buffer.length,
        });
        res.end(buffer);
    }

    @Get('report/credit-limits/export/pdf')
    @RequirePermissions({ module: 'account', action: 'list' })
    async exportCreditLimitReportPdf(@Query() query: DebitCreditReportQueryDto, @Res() res: Response) {
        const buffer = await this.accountService.exportCreditLimitReportPdf(query);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=credit-limits-report.pdf',
            'Content-Length': buffer.length,
        });
        res.end(buffer);
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

    @Get(':id/statement/detailed')
    @RequirePermissions({ module: 'account', action: 'view' })
    getDetailedStatement(
        @Param('id') id: string,
        @Query() query: Record<string, string | undefined>,
    ) {
        const dates = this.normalizeStatementDates(query);
        return this.accountMovementService.getDetailedStatement(
            { accountId: id, ...dates },
            this.extractIncludeQuery(query),
        );
    }

    @Get(':id/statement/detailed/export/excel')
    @RequirePermissions({ module: 'account', action: 'view' })
    async exportDetailedStatementExcel(
        @Param('id') id: string,
        @Query() query: Record<string, string | undefined>,
        @Res() res: Response,
    ) {
        const dates = this.normalizeStatementDates(query);
        const buffer = await this.accountMovementService.exportDetailedExcel(
            { accountId: id, ...dates },
            this.extractIncludeQuery(query),
        );
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename=account-statement-detailed.xlsx',
            'Content-Length': buffer.length,
        });
        res.end(buffer);
    }

    @Get(':id/statement/detailed/export/pdf')
    @RequirePermissions({ module: 'account', action: 'view' })
    async exportDetailedStatementPdf(
        @Param('id') id: string,
        @Query() query: Record<string, string | undefined>,
        @Res() res: Response,
    ) {
        const dates = this.normalizeStatementDates(query);
        const buffer = await this.accountMovementService.exportDetailedPdf(
            { accountId: id, ...dates },
            this.extractIncludeQuery(query),
        );
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=account-statement-detailed.pdf',
            'Content-Length': buffer.length,
        });
        res.end(buffer);
    }

    @Get(':id/statement/export/excel')
    @RequirePermissions({ module: 'account', action: 'view' })
    async exportStatementExcel(
        @Param('id') id: string,
        @Query() query: Record<string, string | undefined>,
        @Res() res: Response
    ) {
        const dates = this.normalizeStatementDates(query);
        const buffer = await this.accountMovementService.exportExcel({
            accountId: id,
            ...dates,
        });
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename=account-statement.xlsx',
            'Content-Length': buffer.length,
        });
        res.end(buffer);
    }

    @Get(':id/statement/export/pdf')
    @RequirePermissions({ module: 'account', action: 'view' })
    async exportStatementPdf(
        @Param('id') id: string,
        @Query() query: Record<string, string | undefined>,
        @Res() res: Response
    ) {
        const dates = this.normalizeStatementDates(query);
        const buffer = await this.accountMovementService.exportPdf({
            accountId: id,
            ...dates,
        });
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=account-statement.pdf',
            'Content-Length': buffer.length,
        });
        res.end(buffer);
    }

    @Post()
    @RequirePermissions({ module: 'account', action: 'create' })
    create(@Body() dto: CreateAccountDto) {
        return this.accountService.create(dto);
    }

    @Get()
    @RequirePermissions({ module: 'account', action: 'list' })
    findAll(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('search') search?: string,
        @Query('type') type?: string,
        @Query('isActive') isActive?: string,
    ) {
        const isActiveBool = isActive === 'true' ? true : isActive === 'false' ? false : undefined;
        return this.accountService.findAll(
            page ? parseInt(page) : 1,
            limit ? parseInt(limit) : 50,
            search,
            type,
            isActiveBool,
        );
    }

    @Get(':id')
    @RequirePermissions({ module: 'account', action: 'view' })
    findOne(@Param('id') id: string) {
        return this.accountService.findOne(id);
    }

    @Patch(':id')
    @RequirePermissions({ module: 'account', action: 'update' })
    update(@Param('id') id: string, @Body() dto: UpdateAccountDto) {
        return this.accountService.update(id, dto);
    }

    @Delete(':id')
    @RequirePermissions({ module: 'account', action: 'delete' })
    remove(@Param('id') id: string) {
        return this.accountService.remove(id);
    }

    @Get(':id/movements')
    @RequirePermissions({ module: 'account', action: 'view' })
    getMovements(
        @Param('id') id: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return this.accountService.getMovements(
            id,
            page ? parseInt(page) : 1,
            limit ? parseInt(limit) : 50,
        );
    }
}
