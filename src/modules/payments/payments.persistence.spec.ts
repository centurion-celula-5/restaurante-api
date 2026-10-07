import { validateSync } from 'class-validator';
import { CreatePaymentDto } from './dto/create-payment.dto.js';
import { PaymentMethod } from './enums/payment-method.enum.js';
import { CreateNotificationDto } from '../notifications/dto/create-notification.dto.js';
import { NotificationType } from '../notifications/enums/notification-type.enum.js';

describe('payments and notifications persistence model', () => {
  it('should expose payment and notification enums', () => {
    expect(PaymentMethod.CARD).toBe('CARD');
    expect(NotificationType.EMAIL).toBe('EMAIL');
  });

  it('should reject invalid payment payloads', () => {
    const dto = new CreatePaymentDto();
    dto.order_id = '';
    dto.amount = -10;
    dto.payment_method = 'UNKNOWN' as PaymentMethod;

    const errors = validateSync(dto);

    expect(errors.length).toBeGreaterThan(0);
  });

  it('should reject invalid notification payloads', () => {
    const dto = new CreateNotificationDto();
    dto.type = 'UNKNOWN' as NotificationType;
    dto.recipient = '';
    dto.message = '';

    const errors = validateSync(dto);

    expect(errors.length).toBeGreaterThan(0);
  });
});
