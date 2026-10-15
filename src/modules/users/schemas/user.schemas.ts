import * as z from 'zod';
import { UserRole } from '../enums/user-role.enum.js';

const identificationNumber = z.string().trim().min(1).max(50);

const nameUser = z.string().trim().min(1).max(150);

// Normalized like the DTO: trimmed and lower-cased before validating.
const emailUser = z.string().trim().toLowerCase().pipe(z.email().max(150));

const password = z.string().min(8);

// `date` column: calendar date only (YYYY-MM-DD), no time part.
const birthday = z.iso.date();

const phoneUser = z.string().trim().max(50);

const userRole = z.enum(UserRole);

// ---- Inputs ---------------------------------------------------------------

/** POST /users — role is optional (the database defaults to EMPLOYEE). */
export const createUserSchema = z.strictObject({
  identification_number: identificationNumber,
  name_user: nameUser,
  email_user: emailUser,
  password,
  birthday: birthday.nullish(),
  phone_user: phoneUser.nullish(),
  user_role: userRole.optional(),
});

/**
 * PATCH /users/:id — personal data only. Required columns can be omitted
 * but never set to null; nullable columns can be cleared with null.
 * It does not accept password, role or status.
 */
export const updateUserSchema = z.strictObject({
  identification_number: identificationNumber.optional(),
  name_user: nameUser.optional(),
  email_user: emailUser.optional(),
  birthday: birthday.nullish(),
  phone_user: phoneUser.nullish(),
});

/** PATCH /users/:id/role */
export const updateUserRoleSchema = z.strictObject({
  user_role: userRole,
});

/** PATCH /users/:id/status — accepts real booleans or "true"/"false". */
export const updateUserStatusSchema = z.strictObject({
  is_active: z.union([
    z.boolean(),
    z.enum(['true', 'false']).transform((value) => value === 'true'),
  ]),
});

/** Path parameter `:id` of every operation on a single user. */
export const userIdParamSchema = z.strictObject({
  id: z.uuid(),
});

/** GET /users — optional filters (query strings arrive as text). */
export const listUsersQuerySchema = z.strictObject({
  user_role: userRole.optional(),
  is_active: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  search: z.string().trim().min(1).max(150).optional(),
});

// ---- Inferred types --------------------------------------------------------

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;
export type UserIdParam = z.infer<typeof userIdParamSchema>;
export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;