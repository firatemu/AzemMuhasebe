import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ApproveInvoiceDto {
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    notes?: string;
}

export class CancelInvoiceDto {
    @ApiProperty({ required: true, example: 'Hatalı miktar girişi' })
    @IsString()
    @IsNotEmpty()
    reason: string;
}

export class UpdateInvoiceItemsDto {
    @ApiProperty({ description: 'İşlem sonrası otomatik mutabakat yapılsın mı?', default: true })
    @IsOptional()
    runReconciliation?: boolean;
}
