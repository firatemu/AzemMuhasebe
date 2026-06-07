import { IsOptional, IsEnum, IsArray, ValidateNested, IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '@prisma/client';
import { Type } from 'class-transformer';

export enum DiscountType {
  PCT = 'pct',
  FIXED = 'fixed',
}

export class PosSaleItemDto {
  @ApiProperty()
  @IsString()
  productId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  productName?: string;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  quantity: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  unitPrice: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  vatRate: number;

  @ApiProperty({ enum: DiscountType, default: DiscountType.PCT })
  @IsOptional()
  @IsEnum(DiscountType)
  discountType?: DiscountType;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  discountRate?: number;

  @ApiProperty({ description: 'Indirim tutarı veya yüzde değeri (Frontend uyumluluğu için)' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  discountValue?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  variantId?: string;
}

export class PosPaymentDto {
  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  amount: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  giftCardId?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  cashboxId?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  bankAccountId?: string;

  @ApiProperty({ required: false, description: 'Kredi karti taksit sayisi' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  installmentCount?: number;
}

export class GlobalDiscountDto {
  @ApiProperty({ enum: DiscountType })
  @IsEnum(DiscountType)
  type: DiscountType;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  value: number;
}

export class CreatePosSaleDto {
  @ApiProperty({ description: 'Müşteri ID' })
  @IsOptional()
  @IsString()
  accountId?: string;

  @ApiProperty({ description: 'Sales Agent ID (Backend tablosuyla uyumlu)' })
  @IsOptional()
  @IsString()
  salesAgentId?: string;

  @ApiProperty({ description: 'Salesperson ID (Frontend alanı)' })
  @IsOptional()
  @IsString()
  salespersonId?: string;

  @ApiProperty({ description: 'Sepetteki ürünler', type: [PosSaleItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PosSaleItemDto)
  items: PosSaleItemDto[];

  @ApiProperty({ description: 'Ödemeler', type: [PosPaymentDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PosPaymentDto)
  payments?: PosPaymentDto[];

  @ApiProperty({ description: 'Global indirim nesnesi (Frontend uyumlu)' })
  @IsOptional()
  @ValidateNested()
  @Type(() => GlobalDiscountDto)
  globalDiscount?: GlobalDiscountDto;

  @ApiProperty({ description: 'Global indirim türü', enum: DiscountType })
  @IsOptional()
  @IsEnum(DiscountType)
  globalDiscountType?: DiscountType;

  @ApiProperty({ description: 'Global indirim tutarı (yüzde veya sabit)' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  globalDiscountValue?: number;

  @ApiProperty({ description: 'Kasa ID (opsiyonel)' })
  @IsOptional()
  @IsString()
  cashboxId?: string;

  @ApiProperty({ description: 'Depo ID (opsiyonel)' })
  @IsOptional()
  @IsString()
  warehouseId?: string;

  @ApiProperty({ description: 'Notlar' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'Tekil Not (Frontend alanı)' })
  @IsOptional()
  @IsString()
  note?: string;
}
