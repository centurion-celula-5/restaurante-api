import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { OrderStatus } from '../enums/order-status.enum.js';
import { CreateOrderItemDto } from './create-order-item.dto.js';

export class CreateOrderDto {
  @ApiProperty({
    example: '7d2a1f60-4b3c-4e8a-9f15-6c1d0b5e2a44',
    description: 'Table where the order is placed',
    format: 'uuid',
  })
  @IsUUID()
  table_id: string;

  @ApiPropertyOptional({
    example: 'b91e4c07-5a2d-4f3b-8e6c-1d7a9b0c4f28',
    description: 'Reservation the order comes from. Omit it for walk-in orders',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  reservation_id?: string;

  @ApiPropertyOptional({
    enum: OrderStatus,
    default: OrderStatus.PENDING,
    description:
      'Status assigned to the order; the server defaults it to pending',
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiProperty({
    type: [CreateOrderItemDto],
    description: 'Products included in the order',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
