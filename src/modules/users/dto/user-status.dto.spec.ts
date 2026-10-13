import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { UpdateUserRoleDto } from './update-user-role.dto.js';
import { UpdateUserStatusDto } from './update-user-status.dto.js';

describe('Dedicated user role and status validation', () => {
  const pipe = new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  });

  it('accepts canonical employee role changes and rejects the old role', async () => {
    const transform = (user_role: unknown) =>
      pipe.transform(
        { user_role },
        {
          type: 'body',
          metatype: UpdateUserRoleDto,
        },
      );
    await expect(transform('EMPLOYEE')).resolves.toBeDefined();
    await expect(transform('WAITER')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it.each([true, false, 'true', 'false'])(
    'accepts explicit boolean user status values',
    async (is_active) => {
      const result = await pipe.transform(
        { is_active },
        {
          type: 'body',
          metatype: UpdateUserStatusDto,
        },
      );
      expect(typeof result.is_active).toBe('boolean');
    },
  );

  it.each(['inactive', '', null, 0])(
    'rejects invalid user status values instead of converting them to false',
    async (is_active) => {
      await expect(
        pipe.transform(
          { is_active },
          {
            type: 'body',
            metatype: UpdateUserStatusDto,
          },
        ),
      ).rejects.toBeInstanceOf(BadRequestException);
    },
  );
});
