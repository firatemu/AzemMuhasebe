import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { CheckBillService } from './check-bill.service';
import { PrismaService } from '../../common/prisma.service';
import { TenantResolverService } from '../../common/services/tenant-resolver.service';
import { buildTenantWhereClause } from '../../common/utils/staging.util';
import { CheckBillStatus } from '@prisma/client';

/**
 * Doc §5.3 — rapor uçları (özet / yaşlandırma / nakit akışı vb.).
 * JWT + rol: finans / yönetim profili.
 */
@Controller('check-bill-reports')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Roles(UserRole.TENANT_ADMIN, UserRole.ADMIN, UserRole.MANAGER, UserRole.USER)
@RequirePermissions({ module: 'check-bill', action: 'view' })
export class CheckBillReportsController {
  constructor(
    private readonly checkBillService: CheckBillService,
    private readonly prisma: PrismaService,
    private readonly tenantResolver: TenantResolverService,
  ) {}

  @Get('portfolio-summary')
  portfolioSummary() {
    return this.checkBillService.getStatsSummary();
  }

  @Get('aging-report')
  agingReport() {
    return this.checkBillService.getStatsAging();
  }

  @Get('cashflow-forecast')
  cashflowForecast() {
    return this.checkBillService.getStatsCashflow();
  }

  @Get('bank-position')
  async bankPosition() {
    const tenantId = await this.tenantResolver.resolveForQuery();
    const rows = await this.prisma.checkBill.groupBy({
      by: ['status'],
      where: {
        ...buildTenantWhereClause(tenantId ?? undefined),
        deletedAt: null,
        status: {
          in: [
            CheckBillStatus.IN_BANK_COLLECTION,
            CheckBillStatus.IN_BANK_GUARANTEE,
            CheckBillStatus.SENT_TO_BANK,
            CheckBillStatus.DISCOUNTED,
          ],
        },
      },
      _count: true,
      _sum: { remainingAmount: true },
    });
    return { byStatus: rows };
  }

  @Get('protest-report')
  async protestReport() {
    const tenantId = await this.tenantResolver.resolveForQuery();
    return this.prisma.checkBillProtestTracking.findMany({
      where: { ...buildTenantWhereClause(tenantId ?? undefined) },
      orderBy: { protestDate: 'desc' },
      take: 500,
    });
  }

  @Get('risk-exposure')
  async riskExposure() {
    const tenantId = await this.tenantResolver.resolveForQuery();
    return this.prisma.checkBillRiskLimit.findMany({
      where: {
        ...buildTenantWhereClause(tenantId ?? undefined),
        isActive: true,
      },
      include: { account: { select: { id: true, title: true, code: true } } },
    });
  }

  @Get('endorsement-chain/:id')
  async endorsementChain(@Param('id') id: string) {
    return this.checkBillService.getEndorsements(id);
  }

  @Get('reconciliation-status')
  async reconciliationStatus() {
    const tenantId = await this.tenantResolver.resolveForQuery();
    return this.prisma.checkBillReconciliation.groupBy({
      by: ['status'],
      where: { ...buildTenantWhereClause(tenantId ?? undefined) },
      _count: true,
    });
  }

  @Get('fiscal-period/:year/:month')
  fiscalPeriod(
    @Param('year', ParseIntPipe) year: number,
    @Param('month', ParseIntPipe) month: number,
    @Query('currency') currency?: string,
  ) {
    void currency;
    return {
      year,
      month,
      message: 'Mali dönem özeti: GL fişleri bağlandığında genişletilecek',
      summary: null as null,
    };
  }
}
