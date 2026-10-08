import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  Min,
  Max,
  ValidateIf,
} from 'class-validator';
import { TableZone, TableStatus } from '../enums/table-zone.enum.js';
import { Transform } from 'class-transformer';

export class CreateTableDto {
  @ApiProperty({ example: 'T-01', maxLength: 50 })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  tableNumber: string;

  @ApiProperty({ example: 4, minimum: 1, maximum: 32767 })
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @Max(32767)
  capacity: number;

  @ApiProperty({ enum: TableZone, example: TableZone.PLANTA1 })
  @IsEnum(TableZone, { message: ' zone debe ser PLANTA1 o PLANTA2' })
  zone: TableZone;

  @ApiPropertyOptional({ enum: TableStatus, default: TableStatus.AVAILABLE })
  @ValidateIf((_object, value) => value !== undefined)
  @IsEnum(TableStatus)
  status?: TableStatus;
}
