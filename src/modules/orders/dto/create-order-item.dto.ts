import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID, Max, Min } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({
    example: '3f1c9a52-8e4b-4d7a-9c10-2b6e5d8a7f31',
    description: 'Menu item that the line item refers to',
    format: 'uuid',
  })
  @IsUUID()
  menu_item_id: string;

  @ApiProperty({
    example: 2,
    description: 'Number of units of the product',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  @Max(2_147_483_647)
  quantity: number;
}
