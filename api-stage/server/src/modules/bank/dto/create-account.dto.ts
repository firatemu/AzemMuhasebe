import { IsString, IsNotEmpty, IsEnum, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { BankAccountType } from '@prisma/client';

export class BankAccountCreateDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  code?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  accountNo?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  iban?: string;

  @IsEnum(BankAccountType)
  @ApiProperty({ enum: BankAccountType })
  type: BankAccountType;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  commissionRate?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  creditLimit?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  cardLimit?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  statementDay?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  paymentDueDay?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  terminalNo?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false, default: true })
  isActive?: boolean;
}

export class BankAccountUpdateDto {
  @IsString()
  @IsOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  accountNo?: string;

  @IsString()
  @IsOptional()
  iban?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsOptional()
  commissionRate?: number;

  @IsNumber()
  @IsOptional()
  creditLimit?: number;

  @IsNumber()
  @IsOptional()
  cardLimit?: number;

  @IsNumber()
  @IsOptional()
  statementDay?: number;

  @IsNumber()
  @IsOptional()
  paymentDueDay?: number;

  @IsString()
  @IsOptional()
  terminalNo?: string;
}
