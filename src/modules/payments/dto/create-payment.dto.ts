import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';
import { PaymentMethod } from '../enums/payment-method.enum.js';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'Order identifier associated with the payment',
    example: '3d0a1c42-cc7b-4d44-8f09-1a0a5ce8f7a4',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty()
  @IsUUID()
  order_id: string;

  @ApiProperty({
    description: 'Amount paid for the transaction',
    example: 150000,
  })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amount: number;

  @ApiProperty({
    description: 'Payment method used by the customer',
    enum: PaymentMethod,
    example: PaymentMethod.CARD,
  })
  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  payment_method: PaymentMethod;
}

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {}
