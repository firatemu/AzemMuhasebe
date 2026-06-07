import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class BulkUpdatePriceCardDto {
    @IsOptional()
    @IsString()
    marka?: string;

    @IsOptional()
    @IsString()
    anaKategori?: string;

    @IsOptional()
    @IsString()
    altKategori?: string;

    @IsEnum(['percentage', 'fixed'])
    adjustmentType!: 'percentage' | 'fixed';

    @IsOptional()
    @IsEnum(['SALE', 'PURCHASE'])
    basePriceType?: 'SALE' | 'PURCHASE' = 'SALE';

    @IsNumber()
    @Type(() => Number)
    adjustmentValue!: number;

    @IsOptional()
    @IsString()
    note?: string;
}
