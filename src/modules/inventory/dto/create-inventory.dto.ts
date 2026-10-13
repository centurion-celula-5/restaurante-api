import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
  Max,
  ValidateIf,
} from 'class-validator';
import { UnitBase } from '../enums/unit-base.enum.js';

export class CreateInventoryDto {
  @ApiProperty({ example: 'INV-001', maxLength: 50 })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  codeProduct: string;

  @ApiProperty({ example: 'Carne molida', maxLength: 100 })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nameProduct: string;

  @ApiProperty({ enum: UnitBase, example: UnitBase.GR })
  @IsEnum(UnitBase)
  unitBase: UnitBase;

  @ApiPropertyOptional({ example: 2000, minimum: 0, default: 0 })
  @ValidateIf((_object, value) => value !== undefined)
  @IsNumber(
    { maxDecimalPlaces: 3 },
    { message: 'currentStock debe ser un número con máximo 3 decimales' },
  )
  @Min(0)
  @Max(999_999_999.999)
  currentStock?: number;

  @ApiProperty({ example: 500, minimum: 0 })
  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0)
  @Max(999_999_999.999)
  minimumStock: number;

  @ApiPropertyOptional({ default: true })
  @ValidateIf((_object, value) => value !== undefined)
  @IsBoolean()
  isActive?: boolean;
}
