import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID, Min } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({
    example: '3f1c9a52-8e4b-4d7a-9c10-2b6e5d8a7f31',
    description: 'Product that the line item refers to',
    format: 'uuid',
  })
  @IsUUID()
  product_id: string;

  @ApiProperty({
    example: 2,
    description: 'Number of units of the product',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  quantity: number;
}
