import { ArrayMinSize, IsArray, IsEnum, IsUUID } from 'class-validator';

export class CheckBillBulkActionDto {
    @IsArray()
    @ArrayMinSize(1)
    @IsUUID('4', { each: true })
    checkBillIds: string[];

    @IsEnum(['soft_delete'])
    action: 'soft_delete';
}
