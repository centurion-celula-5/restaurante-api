import { Transform } from 'class-transformer';

import {
    IsNotEmpty,
    IsString,
    IsNumber,
    IsOptional,
    MaxLength,
} from 'class-validator';

export class CreateProductDto {
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name_dish: string;

    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsOptional()
    @IsString()
    description?: string;

    @IsNumber()
    @IsNotEmpty()
    unit_price: number;

    @IsNumber()
    @IsNotEmpty()
    id_category: number;

    @IsString()
    @IsOptional()
    status?: string;

    @IsNumber()
    @IsOptional()
    available_quantity?: number;
}
