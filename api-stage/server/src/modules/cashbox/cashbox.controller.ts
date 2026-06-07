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
import { CashboxService } from './cashbox.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { CreateCashboxDto } from './dto/create-cashbox.dto';
import { UpdateCashboxDto } from './dto/update-cashbox.dto';
import { CreateCashboxMovementDto } from './dto/create-cashbox-movement.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CashboxType } from './cashbox.enums';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('cashbox')
export class CashboxController {
    constructor(private readonly cashboxService: CashboxService) { }

    @Get()
    @RequirePermissions({ module: 'cashbox', action: 'list' })
    findAll(
        @Query('type') type?: CashboxType,
        @Query('isActive') isActive?: string,
        @Query('isRetail') isRetail?: string,
    ) {
        const isActiveValue = isActive === undefined ? undefined : isActive === 'true';
        const isRetailValue = isRetail === undefined ? undefined : isRetail === 'true';
        return this.cashboxService.findAll(type, isActiveValue, isRetailValue);
    }

    @Get(':id')
    @RequirePermissions({ module: 'cashbox', action: 'view' })
    findOne(@Param('id') id: string) {
        return this.cashboxService.findOne(id);
    }

    @Post()
    @RequirePermissions({ module: 'cashbox', action: 'create' })
    create(@Body() dto: CreateCashboxDto, @CurrentUser() user: any) {
        return this.cashboxService.create(dto, user?.userId);
    }

    @Put(':id')
    @RequirePermissions({ module: 'cashbox', action: 'update' })
    update(
        @Param('id') id: string,
        @Body() dto: UpdateCashboxDto,
        @CurrentUser() user: any,
    ) {
        return this.cashboxService.update(id, dto, user?.userId);
    }

    @Delete(':id')
    @RequirePermissions({ module: 'cashbox', action: 'delete' })
    remove(@Param('id') id: string) {
        return this.cashboxService.remove(id);
    }

    @Post('movement')
    @RequirePermissions({ module: 'cashbox', action: 'create' })
    createMovement(
        @Body() dto: CreateCashboxMovementDto,
        @CurrentUser() user: any,
    ) {
        return this.cashboxService.createMovement(dto, user?.userId);
    }

    @Delete('movement/:id')
    @RequirePermissions({ module: 'cashbox', action: 'delete' })
    deleteMovement(@Param('id') id: string) {
        return this.cashboxService.deleteMovement(id);
    }

    @Get(':id/pending-transfers')
    @RequirePermissions({ module: 'cashbox', action: 'view' })
    getPendingTransfers(@Param('id') id: string) {
        return this.cashboxService.getPendingPOSTransfers(id);
    }
}
