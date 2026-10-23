import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '../enums/payment-method.enum.js';

export class PaymentResponseDto {
  @ApiProperty({
    format: 'uuid',
    example: '9f20d9b2-c84e-4a8d-8ea9-28a61f2a3f15',
  })
  id_payment: string;

  @ApiProperty({
    format: 'uuid',
    example: '3d0a1c42-cc7b-4d44-8f09-1a0a5ce8f7a4',
  })
  order_id: string;

  @ApiProperty({
    type: String,
    example: '150000.00',
    description:
      'Payment amount represented as a decimal string with two places',
    pattern: '^\\d+\\.\\d{2}$',
  })
  amount: string;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.CARD })
  payment_method: PaymentMethod;

  @ApiProperty({
    format: 'date-time',
    example: '2026-10-20T16:45:00.000Z',
  })
  paid_at: string;

  @ApiProperty({
    format: 'date-time',
    example: '2026-10-20T16:45:01.000Z',
  })
  created_at: string;
}
