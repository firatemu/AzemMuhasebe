import {
  IsArray,
  IsNumber,
  IsString,
  IsNotEmpty,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ShipOrderItemDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  itemId: string;

  @IsNumber()
  @Min(1)
  @ApiProperty()
  shippedQuantity: number;
}

export class ShipOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ShipOrderItemDto)
  @ApiProperty({ type: [ShipOrderItemDto] })
  items: ShipOrderItemDto[];

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  warehouseId?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  notes?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  deliveryNoteNo?: string;
}
