import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ReceivePurchaseOrderItemDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    productId: string;

    @IsNumber()
    @Min(1)
    @ApiProperty()
    quantity: number;
}

export class ReceivePurchaseOrderDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ReceivePurchaseOrderItemDto)
    @ApiProperty({ type: [ReceivePurchaseOrderItemDto] })
    items: ReceivePurchaseOrderItemDto[];

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    warehouseId?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    notes?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    deliveryNoteNo?: string;
}
