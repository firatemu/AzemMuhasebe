import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { InvoiceProfitService } from './invoice-profit.service';
import { GetProfitQueryDto } from './dto/get-profit-query.dto';

@Controller('invoice-profits')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class InvoiceProfitController {
  constructor(private readonly invoiceProfitService: InvoiceProfitService) {}

  @Get('by-invoice/:invoiceId')
  @RequirePermissions({ module: 'reporting', action: 'view' })
  async getProfitByInvoice(@Param('invoiceId') invoiceId: string) {
    return this.invoiceProfitService.getProfitByInvoice(invoiceId);
  }

  @Get('list')
  @RequirePermissions({ module: 'reporting', action: 'list' })
  async getProfitList(@Query() query: GetProfitQueryDto) {
    return this.invoiceProfitService.getProfitList({
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
      accountId: query.accountId,
      status: query.status,
    });
  }

  @Get('by-product')
  @RequirePermissions({ module: 'reporting', action: 'view' })
  async getProfitByProduct(@Query() query: GetProfitQueryDto) {
    return this.invoiceProfitService.getProfitByProduct({
      productId: query.productId,
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
    });
  }

  @Get('detail/:invoiceId')
  @RequirePermissions({ module: 'reporting', action: 'view' })
  async getProfitDetail(@Param('invoiceId') invoiceId: string) {
    return this.invoiceProfitService.getProfitDetailByInvoice(invoiceId);
  }

  @Post('recalculate/:invoiceId')
  @RequirePermissions({ module: 'reporting', action: 'update' })
  async recalculateProfit(
    @Param('invoiceId') invoiceId: string,
    @Request() req: any,
  ) {
    await this.invoiceProfitService.recalculateProfit(invoiceId, req.user?.id);
    return { message: 'Kar hesaplaması başarıyla güncellendi' };
  }
}
