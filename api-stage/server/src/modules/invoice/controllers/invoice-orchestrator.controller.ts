import {
  Controller,
  Post,
  Param,
  Body,
  Request,
  UseGuards,
  Get,
  Logger,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { RequirePermissions } from '../../../common/decorators/require-permissions.decorator';
import { InvoiceOrchestratorService } from '../services/invoice-orchestrator.service';
import { ReconciliationService } from '../services/reconciliation.service';
import { ApproveInvoiceDto, CancelInvoiceDto } from '../dto/orchestrator.dto';
import { InvoiceOperationType } from '../types/invoice-orchestrator.types';
import { TenantResolverService } from '../../../common/services/tenant-resolver.service';

@ApiTags('Invoice Orchestrator')
@Controller('invoice-orchestrator')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class InvoiceOrchestratorController {
  private readonly logger = new Logger(InvoiceOrchestratorController.name);

  constructor(
    private readonly orchestratorService: InvoiceOrchestratorService,
    private readonly reconciliationService: ReconciliationService,
    private readonly tenantResolver: TenantResolverService,
  ) {}

  @Post(':id/approve')
  @RequirePermissions({ module: 'invoice', action: 'approve' })
  @ApiOperation({ summary: 'Faturayı onaylar ve stok/cari etkilerini uygular' })
  async approve(
    @Param('id') id: string,
    @Body() dto: ApproveInvoiceDto,
    @Request() req,
  ) {
    const tenantId = await this.tenantResolver.resolveForQuery();
    if (!tenantId) throw new BadRequestException('Tenant context not found');
    const userId = req.user.id;

    await this.orchestratorService.approveInvoice(id, {
      invoiceId: id,
      tenantId,
      userId,
      operationType: InvoiceOperationType.APPROVE,
    });

    return { message: 'Invoice approved and effects applied successfully' };
  }

  @Post(':id/cancel')
  @RequirePermissions({ module: 'invoice', action: 'approve' })
  @ApiOperation({ summary: 'Faturayı iptal eder ve etkileri tersine çevirir' })
  async cancel(
    @Param('id') id: string,
    @Body() dto: CancelInvoiceDto,
    @Request() req,
  ) {
    const tenantId = await this.tenantResolver.resolveForQuery();
    if (!tenantId) throw new BadRequestException('Tenant context not found');
    const userId = req.user.id;

    await this.orchestratorService.cancelInvoice(
      id,
      {
        invoiceId: id,
        tenantId,
        userId,
        operationType: InvoiceOperationType.CANCEL,
      },
      dto.reason,
    );

    return { message: 'Invoice cancelled and effects reversed successfully' };
  }

  @Patch(':id/sync-effects')
  @RequirePermissions({ module: 'invoice', action: 'update' })
  @ApiOperation({
    summary: 'Fatura kalemleri değişikliği sonrası etkileri senkronize eder',
  })
  async syncEffects(@Param('id') id: string, @Request() req) {
    const tenantId = await this.tenantResolver.resolveForQuery();
    if (!tenantId) throw new BadRequestException('Tenant context not found');
    const userId = req.user.id;

    await this.orchestratorService.updateInvoiceItems(id, {
      invoiceId: id,
      tenantId,
      userId,
      operationType: InvoiceOperationType.UPDATE,
    });

    return { message: 'Invoice effects synchronized successfully' };
  }

  @Get(':id/reconciliation')
  @RequirePermissions({ module: 'invoice', action: 'view' })
  @ApiOperation({ summary: 'Fatura tutarlılık (mutabakat) raporunu getirir' })
  async getReconciliation(@Param('id') id: string) {
    const tenantId = await this.tenantResolver.resolveForQuery();
    if (!tenantId) throw new BadRequestException('Tenant context not found');
    return this.reconciliationService.verifyInvoiceConsistency(id, tenantId);
  }

  @Get('reconciliation/run-all')
  @RequirePermissions({ module: 'invoice', action: 'view' })
  @ApiOperation({
    summary: 'Tüm onaylı faturalar için mutabakat taraması başlatır',
  })
  async runFullReconciliation() {
    const tenantId = await this.tenantResolver.resolveForQuery();
    if (!tenantId) throw new BadRequestException('Tenant context not found');
    return this.reconciliationService.runFullTenantReconciliation(tenantId);
  }

  @Post('accounts/:accountId/repair-balance')
  @RequirePermissions({ module: 'account', action: 'update' })
  @ApiOperation({
    summary: 'Hatalı cari bakiyesini hareket kayıtlarından yola çıkarak onarır',
  })
  async repairBalance(@Param('accountId') accountId: string) {
    const tenantId = await this.tenantResolver.resolveForQuery();
    if (!tenantId) throw new BadRequestException('Tenant context not found');
    return this.reconciliationService.repairAccountBalance(accountId, tenantId);
  }
}
