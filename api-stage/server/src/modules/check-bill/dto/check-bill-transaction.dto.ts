import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsDateString, Min } from 'class-validator';
import { CheckBillStatus } from '@prisma/client';

export type CheckBillPaymentMethod = 'KASA' | 'BANKA' | 'ELDEN';

export class CheckBillActionDto {
    @IsString()
    @IsNotEmpty()
    checkBillId: string;

    @IsEnum(CheckBillStatus)
    newStatus: CheckBillStatus;

    @IsDateString()
    date: string;

    @IsString()
    @IsOptional()
    notes?: string;

    @IsNumber()
    @Min(0)
    @IsOptional()
    transactionAmount?: number;

    /**
     * KASA  → cashboxMovement oluşturulur
     * BANKA → bankAccountMovement oluşturulur
     * ELDEN → hareket oluşturulmaz; sadece accountTransaction kaydedilir
     */
    @IsOptional()
    @IsString()
    paymentMethod?: CheckBillPaymentMethod;

    @IsOptional()
    @IsString()
    cashboxId?: string;

    @IsOptional()
    @IsString()
    bankAccountId?: string;

    /**
     * Ciro (ENDORSED) işlemi için hedef cari hesap ID'si
     */
    @IsOptional()
    @IsString()
    toAccountId?: string;
}
