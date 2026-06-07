import { IsOptional, IsArray, ValidateNested, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PosPaymentDto } from './create-pos-sale.dto';

export class CompleteSaleDto {
    @ApiProperty({ description: 'Ödemeler', type: [PosPaymentDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PosPaymentDto)
    payments: PosPaymentDto[];

    @ApiProperty({ description: 'Kasa ID (opsiyonel)' })
    @IsOptional()
    @IsString()
    cashboxId?: string;
}
