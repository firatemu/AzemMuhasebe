import { IsOptional, IsEnum, IsUUID, IsDateString, IsInt, Min, Max, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { CheckBillType, PortfolioType, CheckBillStatus } from '@prisma/client';

export class CheckBillFilterDto {
    @IsOptional()
    @IsEnum(CheckBillType)
    type?: CheckBillType;

    @IsOptional()
    @IsEnum(PortfolioType)
    portfolioType?: PortfolioType;

    @IsOptional()
    @IsEnum(CheckBillStatus)
    status?: CheckBillStatus;

    @IsOptional()
    @IsUUID()
    accountId?: string;

    @IsOptional()
    @IsDateString()
    dueDateFrom?: string;

    @IsOptional()
    @IsDateString()
    dueDateTo?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    skip?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(50000)
    take?: number;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsEnum(['dueDate', 'amount', 'createdAt'])
    sortBy?: 'dueDate' | 'amount' | 'createdAt';

    @IsOptional()
    @IsEnum(['asc', 'desc'])
    sortOrder?: 'asc' | 'desc';
}
