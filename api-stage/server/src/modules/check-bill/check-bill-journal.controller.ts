import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards, Request } from '@nestjs/common';
import { CheckBillJournalService } from './check-bill-journal.service';
import { CreateCheckBillJournalDto, UpdateCheckBillJournalDto } from './dto/create-check-bill-journal.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

/** Doc v2: `/check-bill-journals`; `payroll` geriye dönük alias */
@Controller(['check-bill-journals', 'payroll'])
@UseGuards(JwtAuthGuard)
export class CheckBillJournalController {
    constructor(private readonly checkBillJournalService: CheckBillJournalService) { }

    @Get()
    findAll() {
        return this.checkBillJournalService.findAll();
    }

    @Get(':id/items')
    findItems(@Param('id') id: string) {
        return this.checkBillJournalService.findItems(id);
    }

    @Get(':id/gl-preview')
    glPreview(@Param('id') id: string) {
        return this.checkBillJournalService.glPreview(id);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.checkBillJournalService.findOne(id);
    }

    @Post()
    create(@Body() dto: CreateCheckBillJournalDto, @Request() req) {
        return this.checkBillJournalService.create(dto, req.user);
    }

    @Post(':id/post')
    post(@Param('id') id: string, @Request() req) {
        return this.checkBillJournalService.postJournal(id, req.user?.id);
    }

    @Post(':id/approve')
    approve(@Param('id') id: string, @Request() req) {
        return this.checkBillJournalService.approveJournal(id, req.user?.id);
    }

    @Post(':id/cancel')
    cancel(@Param('id') id: string) {
        return this.checkBillJournalService.cancelJournal(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateCheckBillJournalDto) {
        return this.checkBillJournalService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.checkBillJournalService.remove(id);
    }
}
