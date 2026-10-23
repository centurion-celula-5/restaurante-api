import { PaymentMapper } from './mappers/payment.mapper.js';
import { Payment } from './entities/payment.entity.js';
import {
  paymentIdParamsSchema,
  paymentQuerySchema,
} from './dto/payment-query.schema.js';
import { PaymentMethod } from './enums/payment-method.enum.js';

describe('payment query contracts', () => {
  const orderId = '3d0a1c42-cc7b-4d44-8f09-1a0a5ce8f7a4';
  const paymentId = '9f20d9b2-c84e-4a8d-8ea9-28a61f2a3f15';

  it('accepts a UUID path parameter and query filters with pagination', () => {
    expect(paymentIdParamsSchema.parse({ id: paymentId })).toEqual({
      id: paymentId,
    });
    expect(
      paymentQuerySchema.parse({
        order_id: orderId,
        payment_method: PaymentMethod.CARD,
        paid_at_from: '2026-10-01T00:00:00.000Z',
        paid_at_to: '2026-10-31T23:59:59.999Z',
        page: '2',
        limit: '25',
      }),
    ).toEqual({
      order_id: orderId,
      payment_method: PaymentMethod.CARD,
      paid_at_from: '2026-10-01T00:00:00.000Z',
      paid_at_to: '2026-10-31T23:59:59.999Z',
      page: 2,
      limit: 25,
    });
  });

  it('applies pagination defaults when the parameters are omitted', () => {
    expect(paymentQuerySchema.parse({})).toEqual({ page: 1, limit: 20 });
  });

  it.each([{ id: 'not-a-uuid' }, { id: paymentId, extra: true }])(
    'rejects invalid payment path parameters: %o',
    (params) => {
      expect(paymentIdParamsSchema.safeParse(params).success).toBe(false);
    },
  );

  it.each([
    { payment_method: 'UNKNOWN' },
    { order_id: 'not-a-uuid' },
    { page: '' },
    { page: '0' },
    { limit: '101' },
    { limit: null },
    { paid_at_from: '2026-10-20' },
    {
      paid_at_from: '2026-10-21T00:00:00.000Z',
      paid_at_to: '2026-10-20T00:00:00.000Z',
    },
    { unexpected_filter: 'value' },
  ])('rejects invalid payment query filters: %o', (query) => {
    expect(paymentQuerySchema.safeParse(query).success).toBe(false);
  });
});

describe('PaymentMapper', () => {
  it('maps only the explicit response fields without loading relations', () => {
    const payment = Object.assign(new Payment(), {
      id_payment: '9f20d9b2-c84e-4a8d-8ea9-28a61f2a3f15',
      order_id: '3d0a1c42-cc7b-4d44-8f09-1a0a5ce8f7a4',
      amount: 150000,
      payment_method: PaymentMethod.CARD,
      paid_at: new Date('2026-10-20T16:45:00.000Z'),
      created_at: new Date('2026-10-20T16:45:01.000Z'),
      order: { payments: ['not included'] },
    });

    const result = PaymentMapper.toResponseDto(payment);

    expect(result).toEqual({
      id_payment: '9f20d9b2-c84e-4a8d-8ea9-28a61f2a3f15',
      order_id: '3d0a1c42-cc7b-4d44-8f09-1a0a5ce8f7a4',
      amount: '150000.00',
      payment_method: PaymentMethod.CARD,
      paid_at: '2026-10-20T16:45:00.000Z',
      created_at: '2026-10-20T16:45:01.000Z',
    });
    expect(Object.keys(result)).toEqual([
      'id_payment',
      'order_id',
      'amount',
      'payment_method',
      'paid_at',
      'created_at',
    ]);
  });

  it('preserves decimal scale when formatting numeric values', () => {
    const payment = Object.assign(new Payment(), {
      id_payment: '9f20d9b2-c84e-4a8d-8ea9-28a61f2a3f15',
      order_id: '3d0a1c42-cc7b-4d44-8f09-1a0a5ce8f7a4',
      amount: 1.25,
      payment_method: PaymentMethod.CASH,
      paid_at: new Date('2026-10-20T16:45:00.000Z'),
      created_at: new Date('2026-10-20T16:45:01.000Z'),
    });

    expect(PaymentMapper.toResponseDto(payment).amount).toBe('1.25');
  });
});
