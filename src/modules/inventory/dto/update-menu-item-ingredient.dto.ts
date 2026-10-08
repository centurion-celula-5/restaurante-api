import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateMenuItemIngredientDto } from './create-menu-item-ingredient.dto.js';

export class UpdateMenuItemIngredientDto extends PartialType(
  OmitType(CreateMenuItemIngredientDto, [
    'menuItemId',
    'inventoryItemId',
  ] as const),
  { skipNullProperties: false },
) {}
