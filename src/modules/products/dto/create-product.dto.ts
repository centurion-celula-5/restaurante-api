import { Transform } from 'class-transformer';

import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsInt,
  IsEnum,
  IsOptional,
  MaxLength,
  Min,
  Max,
  ValidateIf,
} from 'class-validator';
import { MenuItemState } from '../enums/menu-item-state.enum.js';
import { MenuItemAvailability } from '../enums/menu-item-availability.enum.js';

export class CreateProductDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name_dish: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsOptional()
  @IsString()
  description?: string | null;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  @Min(0)
  @Max(9_999_999_999.99)
  unit_price: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @Max(2_147_483_647)
  category_id: number;

  @IsEnum(MenuItemState)
  @ValidateIf((_object, value) => value !== undefined)
  state?: MenuItemState;

  @ValidateIf((_object, value) => value !== undefined)
  @IsEnum(MenuItemAvailability)
  availability?: MenuItemAvailability;
}
