import * as z from 'zod';
import { CUSTOMER_LIMITS } from '../customer.constants.js';

export const createCustomerSchema = z.strictObject({
  nameCustomer: z.string().trim().min(1).max(CUSTOMER_LIMITS.name),
  phoneCustomer: z.string().trim().min(1).max(CUSTOMER_LIMITS.phone),
  emailCustomer: z
    .string()
    .trim()
    .toLowerCase()
    .max(CUSTOMER_LIMITS.email)
    .pipe(z.email()),
});

export const updateCustomerSchema = createCustomerSchema.partial();

export const customerIdSchema = z.uuid();

export const listCustomersQuerySchema = z.strictObject({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  nameCustomer: z.string().trim().min(1).max(CUSTOMER_LIMITS.name).optional(),
  phoneCustomer: z.string().trim().min(1).max(CUSTOMER_LIMITS.phone).optional(),
  emailCustomer: z.string().trim().min(1).max(CUSTOMER_LIMITS.email).optional(),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
export type ListCustomersQuery = z.infer<typeof listCustomersQuerySchema>;
