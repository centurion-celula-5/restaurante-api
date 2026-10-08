import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdatePaymentDto } from './dto/update-payment.dto.js';
import { UpdateNotificationDto } from '../notifications/dto/update-notification.dto.js';
import { CreatePaymentDto } from './dto/create-payment.dto.js';
import { PaymentMethod } from './enums/payment-method.enum.js';
import { CreateNotificationDto } from '../notifications/dto/create-notification.dto.js';
import { NotificationType } from '../notifications/enums/notification-type.enum.js';

describe('payments and notifications persistence model', () => {
  it('should expose payment and notification enums', () => {
    expect(Object.values(PaymentMethod)).toEqual(['CASH', 'CARD', 'TRANSFER']);
    expect(Object.values(NotificationType)).toEqual([
      'RESERVATION',
      'ORDER',
      'INVENTORY',
      'SYSTEM',
    ]);
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
    dto.recipient_user_id = '';
    dto.title = '';
    dto.message = '';

    const errors = validateSync(dto);

    expect(errors.length).toBeGreaterThan(0);
  });

  it.each([10_000_000_000, 0.001])(
    'should reject amounts that cannot be stored in numeric(12,2)',
    (amount) => {
      const dto = plainToInstance(CreatePaymentDto, {
        order_id: '3d0a1c42-cc7b-4d44-8f09-1a0a5ce8f7a4',
        amount,
        payment_method: PaymentMethod.CARD,
      });
      expect(
        validateSync(dto).some((error) => error.property === 'amount'),
      ).toBe(true);
    },
  );

  it('should accept the maximum valid payment amount', () => {
    const dto = plainToInstance(CreatePaymentDto, {
      order_id: '3d0a1c42-cc7b-4d44-8f09-1a0a5ce8f7a4',
      amount: 9_999_999_999.99,
      payment_method: PaymentMethod.CARD,
    });
    expect(validateSync(dto)).toHaveLength(0);
  });

  it.each(['order_id', 'amount', 'payment_method'])(
    'should reject null for required payment field %s on update',
    (field) => {
      const dto = plainToInstance(UpdatePaymentDto, { [field]: null });
      expect(validateSync(dto).some((error) => error.property === field)).toBe(
        true,
      );
    },
  );

  it.each(['recipient_user_id', 'title', 'message', 'type'])(
    'should reject null for required notification field %s on update',
    (field) => {
      const dto = plainToInstance(UpdateNotificationDto, { [field]: null });
      expect(validateSync(dto).some((error) => error.property === field)).toBe(
        true,
      );
    },
  );

  it('should accept partial updates and an omitted notification type', () => {
    expect(
      validateSync(plainToInstance(UpdatePaymentDto, { amount: 100 })),
    ).toHaveLength(0);
    expect(
      validateSync(plainToInstance(UpdateNotificationDto, { title: 'Aviso' })),
    ).toHaveLength(0);
    const dto = plainToInstance(CreateNotificationDto, {
      recipient_user_id: '3f2b8c1e-5a4d-4e6f-9b7a-1c2d3e4f5a6b',
      title: 'Aviso',
      message: 'Mensaje',
    });
    expect(validateSync(dto)).toHaveLength(0);
    dto.type = null as unknown as NotificationType;
    expect(validateSync(dto).some((error) => error.property === 'type')).toBe(
      true,
    );
  });
});
