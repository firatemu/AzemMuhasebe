import {
    IsString,
    IsOptional,
    IsArray,
    ValidateNested,
    IsNumber,
    IsBoolean,
    IsNotEmpty,
    Min,
    ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUnitDto {
    @IsNotEmpty({ message: 'Birim adı zorunludur.' })
    @IsString({ message: 'Birim adı metin olmalıdır.' })
    name: string;

    @IsOptional()
    @IsString({ message: 'GİB kodu metin olmalıdır.' })
    code?: string;

    @IsOptional()
    @IsNumber({}, { message: 'Katsayı sayı olmalıdır.' })
    @Min(0.0001, { message: 'Katsayı 0\'dan büyük olmalıdır.' })
    conversionRate?: number;

    @IsOptional()
    @IsBoolean({ message: 'Ana birim alanı boolean olmalıdır.' })
    isBaseUnit?: boolean;

    @IsOptional()
    @IsBoolean({ message: 'Bölünebilirlik alanı boolean olmalıdır.' })
    isDivisible?: boolean;
}

export class CreateUnitSetDto {
    @IsNotEmpty({ message: 'Birim seti adı zorunludur.' })
    @IsString({ message: 'Birim seti adı metin olmalıdır.' })
    name: string;

    @IsOptional()
    @IsString({ message: 'Açıklama metin olmalıdır.' })
    description?: string;

    @IsArray({ message: 'Birimler dizi olmalıdır.' })
    @ValidateNested({ each: true })
    @Type(() => CreateUnitDto)
    @ArrayMinSize(1, { message: 'En az bir birim tanımlanmalıdır.' })
    @IsOptional()
    units?: CreateUnitDto[];
}

export class UpdateUnitSetDto extends CreateUnitSetDto { }
