import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { PaymentMethod } from '../enums/payment-method.enum.js';

export class CreatePaymentDto {
  @ApiPropertyOptional({
    description: 'Order identifier associated with the payment',
    example: '3d0a1c42-cc7b-4d44-8f09-1a0a5ce8f7a4',
  })
  @IsOptional()
  @IsUUID()
  order_id?: string;

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

  @ApiPropertyOptional({
    description: 'Optional transaction or authorization reference code',
    example: 'PAY-1023-REF',
  })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  transaction_reference?: string;

  @ApiPropertyOptional({
    description: 'Current payment status',
    example: 'PAID',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  status?: string;
}

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {}
