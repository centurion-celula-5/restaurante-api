import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto.js';
import { UpdateUserDto } from './update-user.dto.js';

describe('User payload validation', () => {
  const pipe = new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  });
  const body = {
    identification_number: '1043215678',
    name_user: 'Gabriel Rodríguez',
    email_user: 'gabriel@riwi.io',
    password: 'securePassword123',
  };
  const create = (payload: unknown) =>
    pipe.transform(payload, { type: 'body', metatype: CreateUserDto });
  const update = (payload: unknown) =>
    pipe.transform(payload, { type: 'body', metatype: UpdateUserDto });

  it('trims strings and normalizes the email address', async () => {
    const user = await create({
      ...body,
      name_user: '  Gabriel Rodríguez  ',
      email_user: '  GABRIEL@RIWI.IO  ',
    });
    expect(user.name_user).toBe(body.name_user);
    expect(user.email_user).toBe(body.email_user);
  });

  it.each(['ADMIN', 'EMPLOYEE'])(
    'accepts canonical user role %s',
    async (user_role) => {
      await expect(create({ ...body, user_role })).resolves.toBeDefined();
    },
  );

  it.each(['WAITER', null])(
    'rejects an invalid user role',
    async (user_role) => {
      await expect(create({ ...body, user_role })).rejects.toBeInstanceOf(
        BadRequestException,
      );
    },
  );

  it.each(['identification_number', 'name_user', 'email_user', 'phone_user'])(
    'returns a validation error for a non-string %s',
    async (field) => {
      await expect(create({ ...body, [field]: 123 })).rejects.toBeInstanceOf(
        BadRequestException,
      );
    },
  );

  it.each(['identification_number', 'name_user'])(
    'rejects blank %s after trimming',
    async (field) => {
      await expect(create({ ...body, [field]: '   ' })).rejects.toBeInstanceOf(
        BadRequestException,
      );
    },
  );

  it.each(['identification_number', 'name_user', 'email_user'])(
    'rejects clearing required %s during an update',
    async (field) => {
      await expect(update({ [field]: null })).rejects.toBeInstanceOf(
        BadRequestException,
      );
    },
  );

  it('allows clearing nullable contact fields', async () => {
    await expect(
      update({ birthday: null, phone_user: null }),
    ).resolves.toBeDefined();
  });

  it('rejects a short password', async () => {
    await expect(create({ ...body, password: 'short' })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('keeps password and role updates outside the general user DTO', async () => {
    await expect(update({ password: body.password })).rejects.toBeInstanceOf(
      BadRequestException,
    );
    await expect(update({ user_role: 'ADMIN' })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
