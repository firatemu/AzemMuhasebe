import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsDateString, Min, IsUUID } from 'class-validator';
import { CheckBillType, PortfolioType } from '@prisma/client';

/** Bordro sihirbazı kalem satırı — cari `journal.accountId` üzerinden bağlanır */
export class CreateCheckBillLineDto {
    @IsEnum(CheckBillType)
    type: CheckBillType;

    @IsString()
    @IsNotEmpty()
    checkNo: string;

    @IsDateString()
    @IsOptional()
    issueDate?: string;

    @IsDateString()
    dueDate: string;

    @IsString()
    @IsOptional()
    serialNo?: string;

    @IsNumber()
    @Min(0)
    amount: number;

    @IsString()
    @IsOptional()
    debtor?: string;

    @IsString()
    @IsOptional()
    bank?: string;

    @IsString()
    @IsOptional()
    branch?: string;

    @IsString()
    @IsOptional()
    accountNo?: string;

    @IsString()
    @IsOptional()
    notes?: string;
}

/** Doğrudan API ile evrak oluşturma (POST /checks-promissory-notes) */
export class CreateCheckBillDto extends CreateCheckBillLineDto {
    @IsUUID()
    accountId: string;

    @IsEnum(PortfolioType)
    portfolioType: PortfolioType;
}

export class UpdateCheckBillDto {
    @IsString()
    @IsOptional()
    checkNo?: string;

    @IsDateString()
    @IsOptional()
    issueDate?: string;

    @IsDateString()
    @IsOptional()
    dueDate?: string;

    @IsString()
    @IsOptional()
    debtor?: string;

    @IsString()
    @IsOptional()
    bank?: string;

    @IsString()
    @IsOptional()
    branch?: string;

    @IsString()
    @IsOptional()
    accountNo?: string;

    @IsString()
    @IsOptional()
    notes?: string;

    @IsNumber()
    @Min(0)
    @IsOptional()
    amount?: number;
}
