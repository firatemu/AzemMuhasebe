import { IsEnum, IsNotEmpty, IsOptional, IsString, IsDateString, ValidateNested, IsArray, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCheckBillLineDto } from './create-check-bill.dto';
import { JournalType } from '@prisma/client';

export class CreateCheckBillJournalDto {
    @IsEnum(JournalType)
    type: JournalType;

    @IsString()
    @IsOptional()
    journalNo?: string;

    @IsDateString()
    date: string;

    @IsString()
    @IsOptional()
    accountId?: string;

    @IsString()
    @IsOptional()
    bankAccountId?: string;

    @IsOptional()
    @IsUUID()
    cashboxId?: string;

    @IsString()
    @IsOptional()
    notes?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateCheckBillLineDto)
    @IsOptional()
    newDocuments?: CreateCheckBillLineDto[];

    @IsArray()
    @IsUUID('4', { each: true })
    @IsOptional()
    selectedDocumentIds?: string[];
}

export class UpdateCheckBillJournalDto {
    @IsDateString()
    @IsOptional()
    date?: string;

    @IsString()
    @IsOptional()
    notes?: string;
}
