import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { MovementType } from '../enums/movement-type.enum.js';
import { MovementSource } from '../enums/movement-source.enum.js';

export class CreateInventoryMovementDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  inventoryItemId: string;

  @ApiProperty({ enum: MovementType })
  @IsEnum(MovementType)
  movementType: MovementType;

  @ApiProperty({ enum: MovementSource })
  @IsEnum(MovementSource)
  movementSource: MovementSource;

  @ApiProperty({
    example: 250.125,
    description: 'Quantity with at most three decimal places',
  })
  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(-999_999_999.999)
  @Max(999_999_999.999)
  quantity: number;

  @ApiPropertyOptional({ format: 'uuid', nullable: true })
  @IsOptional()
  @IsUUID()
  orderItemId?: string | null;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  performedByUserId: string;

  @ApiPropertyOptional({ nullable: true })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsOptional()
  @IsString()
  reason?: string | null;
}
