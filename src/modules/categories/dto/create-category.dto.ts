import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreateCategoryDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  parent_category_id?: number;

  @IsOptional()
  @IsString()
  status?: string;
}
