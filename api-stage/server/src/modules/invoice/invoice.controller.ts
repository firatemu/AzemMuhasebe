import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, Res, UseGuards } from '@nestjs/common';
import { ApiQuery, ApiTags, ApiParam } from '@nestjs/swagger';
import { InvoiceType, InvoiceStatus } from './invoice.enums';
import type { Response } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { CreateInvoicePaymentPlanDto } from './dto/create-invoice-payment-plan.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoiceService } from './invoice.service';
import { InvoiceExportService } from './invoice-export.service';

@ApiTags('Invoices')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('invoices')
export class InvoiceController {
  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly invoiceExportService: InvoiceExportService,
  ) { }

  @Get('stats')
  @RequirePermissions({ module: 'invoice', action: 'list' })
  @ApiQuery({ name: 'invoiceType', enum: InvoiceType, required: false })
  async getStats(@Query('invoiceType') invoiceType?: string) {
    return this.invoiceService.getSalesStats(invoiceType as InvoiceType);
  }

  @Get('due-date-analysis')
  @RequirePermissions({ module: 'invoice', action: 'list' })
  async getDueDateAnalysis(@Query('accountId') accountId?: string) {
    return this.invoiceService.getDueDateAnalysis(accountId);
  }

  @Get('vade-analiz')
  @RequirePermissions({ module: 'invoice', action: 'list' })
  async getVadeAnaliz(@Query('accountId') accountId?: string) {
    return this.invoiceService.getVadeAnaliz(accountId);
  }

  @Get('price-history')
  @RequirePermissions({ module: 'invoice', action: 'list' })
  async getPriceHistory(
    @Query('accountId') accountId: string,
    @Query('productId') productId: string,
  ) {
    return this.invoiceService.getPriceHistory(accountId, productId);
  }

  @Get('exchange-rate')
  @RequirePermissions({ module: 'invoice', action: 'list' })
  async getExchangeRate(@Query('currency') currency: string) {
    const rate = await this.invoiceService.getExchangeRate(currency);
    return { rate };
  }

  @Get('export/excel')
  @RequirePermissions({ module: 'invoice', action: 'list' })
  async exportExcel(
    @Query('invoiceType') type: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('status') status: string,
    @Query('search') search: string,
    @Query('salesAgentId') salesAgentId: string,
    @Res() res: Response,
  ) {
    const buffer = await this.invoiceExportService.generateSalesInvoiceExcel(
      type as InvoiceType || undefined,
      startDate || undefined,
      endDate || undefined,
      status || undefined,
      search || undefined,
      salesAgentId || undefined,
    );

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=faturalar_${new Date().toISOString().split('T')[0]}.xlsx`);
    res.send(buffer);
  }

  @Get()
  @RequirePermissions({ module: 'invoice', action: 'list' })
  @ApiQuery({ name: 'type', enum: InvoiceType, required: false })
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('type') type?: string,
    @Query('search') search?: string,
    @Query('accountId') accountId?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('status') status?: string,
    @Query('salesAgentId') salesAgentId?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 50;

    try {
      const result = await this.invoiceService.findAllAdvanced(
        pageNum,
        limitNum,
        type as InvoiceType | undefined,
        search,
        accountId,
        sortBy,
        sortOrder,
        startDate,
        endDate,
        status as any,
        salesAgentId,
      );

      return {
        data: result.data,
        meta: result.meta,
      };
    } catch (error) {
      throw error;
    }
  }

  @Post()
  @RequirePermissions({ module: 'invoice', action: 'create' })
  async create(
    @Body() createFaturaDto: CreateInvoiceDto,
    @Request() req,
  ) {
    const userId = req.user?.id;
    return this.invoiceService.create(createFaturaDto, userId);
  }

  @Get(':id')
  @RequirePermissions({ module: 'invoice', action: 'view' })
  async findOne(@Param('id') id: string) {
    return this.invoiceService.findOne(id);
  }

  @Put('bulk/status')
  @RequirePermissions({ module: 'invoice', action: 'approve' })
  async bulkUpdateDurum(
    @Body() body: { ids: string[]; status: InvoiceStatus },
    @Request() req,
  ) {
    const userId = req.user?.id;
    return this.invoiceService.bulkUpdateStatus(body.ids, body.status, userId);
  }

  @Put(':id')
  @RequirePermissions({ module: 'invoice', action: 'update' })
  async update(
    @Param('id') id: string,
    @Body() updateFaturaDto: UpdateInvoiceDto,
    @Request() req,
  ) {
    const userId = req.user?.id;
    return this.invoiceService.update(id, updateFaturaDto, userId);
  }

  @Delete(':id')
  @RequirePermissions({ module: 'invoice', action: 'delete' })
  async remove(
    @Param('id') id: string,
    @Request() req,
  ) {
    const userId = req.user?.id;
    return this.invoiceService.remove(id, userId);
  }

  @Put(':id/status')
  @RequirePermissions({ module: 'invoice', action: 'approve' })
  async changeDurum(
    @Param('id') id: string,
    @Body() body: { status: InvoiceStatus },
    @Request() req,
  ) {
    const userId = req.user?.id;
    return this.invoiceService.changeStatus(id, body.status, userId);
  }

  @Put(':id/cancel')
  @RequirePermissions({ module: 'invoice', action: 'approve' })
  async cancel(
    @Param('id') id: string,
    @Body() body: { deliveryNoteIptal?: boolean },
    @Request() req,
  ) {
    const userId = req.user?.id;
    return this.invoiceService.cancel(id, userId, undefined, undefined, body.deliveryNoteIptal);
  }

  @Get(':id/material-preparation')
  @RequirePermissions({ module: 'invoice', action: 'view' })
  async getMaterialPreparation(@Param('id') id: string) {
    return this.invoiceService.getMaterialPreparationSlip(id);
  }

  @Post(':id/payment-plan')
  @RequirePermissions({ module: 'invoice', action: 'create' })
  async addPaymentPlan(
    @Param('id') id: string,
    @Body() body: CreateInvoicePaymentPlanDto[],
  ) {
    return this.invoiceService.createPaymentPlan(id, body);
  }

  @Get(':id/payment-plan')
  @RequirePermissions({ module: 'invoice', action: 'view' })
  async getPaymentPlan(@Param('id') id: string) {
    return this.invoiceService.getPaymentPlan(id);
  }

  @Put('payment-plan/:planId')
  @RequirePermissions({ module: 'invoice', action: 'update' })
  async updatePaymentPlanItem(
    @Param('planId') planId: string,
    @Body() body: { isPaid: boolean },
  ) {
    return this.invoiceService.updatePaymentPlanItem(planId, body.isPaid);
  }

  @Post('recalculate-balances')
  @RequirePermissions({ module: 'invoice', action: 'create' })
  async recalculateBalances(@Query('accountId') accountId?: string) {
    return this.invoiceService.recalculateCariBakiyeler(accountId);
  }
}
