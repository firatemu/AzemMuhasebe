import { IsUUID, IsNumber, IsPositive, IsDateString, IsOptional, IsString } from 'class-validator';

export class CollectionActionDto {
    @IsUUID()
    checkBillId: string;

    @IsNumber()
    @IsPositive()
    transactionAmount: number;

    @IsDateString()
    date: string;

    @IsOptional()
    @IsUUID()
    cashboxId?: string;

    @IsOptional()
    @IsUUID()
    bankAccountId?: string;

    @IsOptional()
    @IsString()
    notes?: string;
}
