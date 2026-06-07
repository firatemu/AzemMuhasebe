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
import { CompanyCreditCardService } from './company-credit-card.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { CreateCompanyCreditCardDto } from './dto/create-company-credit-card.dto';
import { UpdateCompanyCreditCardDto } from './dto/update-company-credit-card.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('company-credit-cards')
export class CompanyCreditCardController {
  constructor(
    private readonly companyCreditCardService: CompanyCreditCardService,
  ) {}

  @Post()
  @RequirePermissions({ module: 'cashbox', action: 'create' })
  create(@Body() createDto: CreateCompanyCreditCardDto) {
    return this.companyCreditCardService.create(createDto);
  }

  @Get()
  @RequirePermissions({ module: 'cashbox', action: 'list' })
  findAll(@Query('cashboxId') cashboxId?: string) {
    return this.companyCreditCardService.findAll(cashboxId);
  }

  @Get(':id')
  @RequirePermissions({ module: 'cashbox', action: 'view' })
  findOne(@Param('id') id: string) {
    return this.companyCreditCardService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions({ module: 'cashbox', action: 'update' })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateCompanyCreditCardDto,
  ) {
    return this.companyCreditCardService.update(id, updateDto);
  }

  @Delete(':id')
  @RequirePermissions({ module: 'cashbox', action: 'delete' })
  remove(@Param('id') id: string) {
    return this.companyCreditCardService.remove(id);
  }
}
