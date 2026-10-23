import { z } from 'zod';
import { PaymentMethod } from '../enums/payment-method.enum.js';

const positiveIntegerQuery = (maximum: number) =>
  z
    .string()
    .regex(/^[1-9]\d*$/)
    .transform(Number)
    .pipe(z.number().int().min(1).max(maximum));

const paymentDateQuery = z.iso.datetime({ offset: true });

export const paymentIdParamsSchema = z
  .object({
    id: z.uuid(),
  })
  .strict();

export const paymentQuerySchema = z
  .object({
    order_id: z.uuid().optional(),
    payment_method: z.enum(PaymentMethod).optional(),
    paid_at_from: paymentDateQuery.optional(),
    paid_at_to: paymentDateQuery.optional(),
    page: positiveIntegerQuery(Number.MAX_SAFE_INTEGER).optional().default(1),
    limit: positiveIntegerQuery(100).optional().default(20),
  })
  .strict()
  .refine(
    ({ paid_at_from, paid_at_to }) =>
      !paid_at_from ||
      !paid_at_to ||
      Date.parse(paid_at_from) <= Date.parse(paid_at_to),
    {
      message: 'paid_at_from must be earlier than or equal to paid_at_to',
      path: ['paid_at_to'],
    },
  );

export type PaymentIdParams = z.infer<typeof paymentIdParamsSchema>;
export type PaymentQuery = z.infer<typeof paymentQuerySchema>;
