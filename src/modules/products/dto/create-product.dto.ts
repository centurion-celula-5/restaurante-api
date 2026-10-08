import { Transform } from 'class-transformer';

import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { MenuItemStatus } from '../enums/menu-item-status.enum.js';

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
  @IsEnum(MenuItemStatus)
  @IsOptional()
  status?: MenuItemStatus;

  //@IsNumber()
  //@IsOptional()
  //available_quantity?: number;
}
