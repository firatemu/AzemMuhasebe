import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
  Request,
  Res,
  BadRequestException,
} from '@nestjs/common';
import type { Response } from 'express';
import { CheckBillService } from './check-bill.service';
import {
  CreateCheckBillDto,
  UpdateCheckBillDto,
} from './dto/create-check-bill.dto';
import { CheckBillActionDto } from './dto/check-bill-transaction.dto';
import { CheckBillFilterDto } from './dto/check-bill-filter.dto';
import { CheckBillBulkActionDto } from './dto/check-bill-bulk.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';

@Controller('checks-promissory-notes')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CheckBillController {
  constructor(private readonly checkBillService: CheckBillService) {}

  @Get('stats/summary')
  @RequirePermissions({ module: 'check-bill', action: 'list' })
  getStatsSummary() {
    return this.checkBillService.getStatsSummary();
  }

  @Get('stats/aging')
  @RequirePermissions({ module: 'check-bill', action: 'list' })
  getStatsAging() {
    return this.checkBillService.getStatsAging();
  }

  @Get('stats/cashflow')
  @RequirePermissions({ module: 'check-bill', action: 'list' })
  getStatsCashflow() {
    return this.checkBillService.getStatsCashflow();
  }

  @Get('export/excel')
  @RequirePermissions({ module: 'check-bill', action: 'list' })
  async exportExcel(@Query() filter: CheckBillFilterDto, @Res() res: Response) {
    const buffer = await this.checkBillService.exportExcel(filter);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="cek-senet-listesi.xlsx"',
    );
    res.send(buffer);
  }

  @Get('export/pdf')
  @RequirePermissions({ module: 'check-bill', action: 'list' })
  async exportPdf(@Query() filter: CheckBillFilterDto, @Res() res: Response) {
    const buffer = await this.checkBillService.exportExcel(filter);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="cek-senet-listesi.pdf"',
    );
    res.send(buffer);
  }

  @Get('health')
  @RequirePermissions({ module: 'check-bill', action: 'view' })
  async healthCheck() {
    try {
      await this.checkBillService.getOverdue();
      return { status: 'ok', message: 'Database connection working' };
    } catch (error: any) {
      console.error('[CheckBillController] health check error:', error);
      return { status: 'error', message: error.message };
    }
  }

  @Get()
  @RequirePermissions({ module: 'check-bill', action: 'list' })
  findAll(@Query() filter: CheckBillFilterDto) {
    return this.checkBillService.findAll(filter);
  }

  @Post()
  @RequirePermissions({ module: 'check-bill', action: 'create' })
  create(
    @Body() dto: CreateCheckBillDto,
    @Request() req: { user: { id: string } },
  ) {
    return this.checkBillService.create(dto, undefined, req.user.id);
  }

  @Post('bulk-action')
  @RequirePermissions({ module: 'check-bill', action: 'approve' })
  bulkAction(
    @Body() dto: CheckBillBulkActionDto,
    @Request() req: { user: { id: string } },
  ) {
    if (dto.action !== 'soft_delete') {
      throw new BadRequestException('Desteklenmeyen aksiyon');
    }
    return this.checkBillService.bulkSoftDelete(dto.checkBillIds, req.user.id);
  }

  @Get('upcoming')
  @RequirePermissions({ module: 'check-bill', action: 'list' })
  async getUpcomingChecks(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    try {
      let start = startDate ? new Date(startDate) : new Date();
      let end = endDate ? new Date(endDate) : new Date();
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        throw new BadRequestException('Geçersiz startDate veya endDate');
      }
      if (start.getTime() > end.getTime()) {
        const t = start;
        start = end;
        end = t;
      }
      return await this.checkBillService.getUpcomingChecks(start, end);
    } catch (error: any) {
      console.error('[CheckBillController] getUpcomingChecks error:', error);
      throw error;
    }
  }

  @Get('overdue')
  @RequirePermissions({ module: 'check-bill', action: 'list' })
  async getOverdue() {
    try {
      return await this.checkBillService.getOverdue();
    } catch (error: any) {
      console.error('[CheckBillController] getOverdue error:', error);
      throw error;
    }
  }

  @Get('at-risk')
  @RequirePermissions({ module: 'check-bill', action: 'list' })
  async getAtRisk(@Query('minScore') minScore?: string) {
    try {
      const n = minScore ? parseInt(minScore, 10) : 70;
      return await this.checkBillService.getAtRisk(Number.isFinite(n) ? n : 70);
    } catch (error: any) {
      console.error('[CheckBillController] getAtRisk error:', error);
      throw error;
    }
  }

  @Get([':id/endorsements', 'endorsements/:id'])
  @RequirePermissions({ module: 'check-bill', action: 'view' })
  getEndorsements(@Param('id') id: string) {
    return this.checkBillService.getEndorsements(id);
  }

  @Get([':id/collections', 'collections/:id'])
  @RequirePermissions({ module: 'check-bill', action: 'view' })
  getCollectionHistory(@Param('id') id: string) {
    return this.checkBillService.getCollectionHistory(id);
  }

  @Get(':id/timeline')
  @RequirePermissions({ module: 'check-bill', action: 'view' })
  getTimeline(@Param('id') id: string) {
    return this.checkBillService.getTimeline(id);
  }

  @Get(':id/gl-entries')
  @RequirePermissions({ module: 'check-bill', action: 'view' })
  getGlEntries(@Param('id') id: string) {
    return this.checkBillService.getGlEntriesForCheckBill(id);
  }

  @Get(':id/documents')
  @RequirePermissions({ module: 'check-bill', action: 'view' })
  getDocuments(@Param('id') id: string) {
    return this.checkBillService.getDocuments(id);
  }

  @Get(':id')
  @RequirePermissions({ module: 'check-bill', action: 'view' })
  findOne(@Param('id') id: string) {
    return this.checkBillService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions({ module: 'check-bill', action: 'update' })
  update(@Param('id') id: string, @Body() dto: UpdateCheckBillDto) {
    return this.checkBillService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermissions({ module: 'check-bill', action: 'delete' })
  remove(@Param('id') id: string) {
    return this.checkBillService.remove(id);
  }

  @Post('action')
  @RequirePermissions({ module: 'check-bill', action: 'approve' })
  processAction(
    @Body() dto: CheckBillActionDto,
    @Request() req: { user: { id: string } },
  ) {
    return this.checkBillService.processAction(dto, req.user.id);
  }
}
