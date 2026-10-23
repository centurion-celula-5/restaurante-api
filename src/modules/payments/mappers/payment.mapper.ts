import { Payment } from '../entities/payment.entity.js';
import { PaymentResponseDto } from '../dto/payment-response.dto.js';

export class PaymentMapper {
  static toResponseDto(payment: Payment): PaymentResponseDto {
    return {
      id_payment: payment.id_payment,
      order_id: payment.order_id,
      amount: this.toDecimalString(payment.amount),
      payment_method: payment.payment_method,
      paid_at: payment.paid_at.toISOString(),
      created_at: payment.created_at.toISOString(),
    };
  }

  private static toDecimalString(amount: number): string {
    const decimal = String(amount);
    const [integerPart, fractionalPart = ''] = decimal.split('.');

    if (fractionalPart.length > 2 || !/^\d+$/.test(integerPart)) {
      throw new Error(`Invalid payment amount for numeric(12,2): ${decimal}`);
    }

    return `${integerPart}.${fractionalPart.padEnd(2, '0')}`;
  }
}
