import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export enum PriceType {
  SALE = 'SALE',
  CAMPAIGN = 'CAMPAIGN',
  LIST = 'LIST',
}

export enum PriceCardStatus {
  ACTIVE = 'ACTIVE',
  PASSIVE = 'PASSIVE',
  EXPIRED = 'EXPIRED',
}

export class CreatePriceCardDto {
  @IsUUID()
  productId!: string;

  @IsEnum(PriceType)
  @IsOptional()
  priceType?: PriceType = PriceType.SALE;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  salePrice?: number;


  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  vatRate?: number = 20;

  @IsBoolean()
  @IsOptional()
  priceIncludesVat?: boolean = false;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  minQuantity?: number = 1;

  @IsString()
  @IsOptional()
  @MaxLength(3)
  currency?: string = 'TRY';

  @IsString()
  @IsOptional()
  effectiveFrom?: string | null;

  @IsString()
  @IsOptional()
  effectiveTo?: string | null;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  notes?: string | null;

  @IsEnum(PriceCardStatus)
  @IsOptional()
  status?: PriceCardStatus = PriceCardStatus.ACTIVE;
}