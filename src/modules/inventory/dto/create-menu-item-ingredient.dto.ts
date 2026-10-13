import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsUUID, Max, Min } from 'class-validator';

export class CreateMenuItemIngredientDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  menuItemId: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  inventoryItemId: string;

  @ApiProperty({ example: 125.5, minimum: 0.001 })
  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0.001)
  @Max(999_999_999.999)
  quantityRequired: number;
}
