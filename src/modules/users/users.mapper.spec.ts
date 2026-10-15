import { User } from './entities/user.entity.js';
import { UserRole } from './enums/user-role.enum.js';
import { toUserResponseDto, toUserResponseDtoList } from './users.mapper.js';

const entity = {
  id_user: '7d2a1f60-4b3c-4e8a-9f15-6c1d0b5e2a44',
  identification_number: '1043215678',
  name_user: 'Gabriel Rodríguez',
  email_user: 'gabriel@riwi.io',
  password_hash: 'secret-hash',
  birthday: '1998-05-12',
  phone_user: '3001234567',
  user_role: UserRole.EMPLOYEE,
  is_active: true,
  created_at: new Date('2026-10-05T20:58:23.000Z'),
  updated_at: new Date('2026-10-05T20:58:23.000Z'),
} as User;

const expectedResponse = {
  id_user: '7d2a1f60-4b3c-4e8a-9f15-6c1d0b5e2a44',
  identification_number: '1043215678',
  name_user: 'Gabriel Rodríguez',
  email_user: 'gabriel@riwi.io',
  birthday: '1998-05-12',
  phone_user: '3001234567',
  user_role: 'EMPLOYEE',
  is_active: true,
  created_at: new Date('2026-10-05T20:58:23.000Z'),
  updated_at: new Date('2026-10-05T20:58:23.000Z'),
};

describe('users mapper', () => {
  it('returns exactly the fields of the output DTO (sample response)', () => {
    expect(toUserResponseDto(entity)).toStrictEqual(expectedResponse);
  });

  it('never includes password or password_hash', () => {
    const result = toUserResponseDto({
      ...entity,
      password: 'plain-text',
    } as User);

    expect(result).not.toHaveProperty('password');
    expect(result).not.toHaveProperty('password_hash');
  });

  it('does not include relations even when they are loaded', () => {
    const result = toUserResponseDto({
      ...entity,
      orders: [{ id_order: 'o1' }],
      notifications: [{ id_notification: 'n1' }],
      inventoryMovements: [{ id_movement: 'm1' }],
      auditLogs: [{ id_audit_log: 'a1' }],
    } as unknown as User);

    expect(Object.keys(result).sort()).toEqual(
      Object.keys(expectedResponse).sort(),
    );
  });

  it('keeps nullable fields as null', () => {
    const result = toUserResponseDto({
      ...entity,
      birthday: null,
      phone_user: null,
    } as User);

    expect(result.birthday).toBeNull();
    expect(result.phone_user).toBeNull();
  });

  it('serializes timestamps as ISO 8601 and the birthday as YYYY-MM-DD', () => {
    const json = JSON.parse(JSON.stringify(toUserResponseDto(entity)));

    expect(json.created_at).toBe('2026-10-05T20:58:23.000Z');
    expect(json.updated_at).toBe('2026-10-05T20:58:23.000Z');
    expect(json.birthday).toBe('1998-05-12');
  });

  it('maps lists, including an empty one', () => {
    expect(toUserResponseDtoList([entity, entity])).toStrictEqual([
      expectedResponse,
      expectedResponse,
    ]);
    expect(toUserResponseDtoList([])).toStrictEqual([]);
  });
});