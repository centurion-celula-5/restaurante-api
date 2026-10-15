import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryFailedError } from 'typeorm';
import { User } from './entities/user.entity.js';
import { UserRole } from './enums/user-role.enum.js';
import { UsersService } from './users.service.js';

describe('UsersService', () => {
  let service: UsersService;
  const repository = { findOneBy: vi.fn(), delete: vi.fn() };

  const id = '7d2a1f60-4b3c-4e8a-9f15-6c1d0b5e2a44';
  const user = {
    id_user: id,
    identification_number: '1043215678',
    name_user: 'Gabriel Rodríguez',
    email_user: 'gabriel@riwi.io',
    password_hash: 'secret-hash',
    birthday: null,
    phone_user: null,
    user_role: UserRole.EMPLOYEE,
    is_active: true,
    created_at: new Date('2026-10-05T20:58:23.000Z'),
    updated_at: new Date('2026-10-05T20:58:23.000Z'),
  } as User;

  const referenceError = (constraint?: string, code = '23503') =>
    new QueryFailedError(
      'DELETE FROM "users"',
      [id],
      Object.assign(new Error('violates foreign key constraint'), {
        code,
        constraint,
      }),
    );

  beforeEach(async () => {
    vi.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: repository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('remove', () => {
    it('deletes the user and returns the output DTO without password_hash', async () => {
      repository.findOneBy.mockResolvedValue(user);
      repository.delete.mockResolvedValue({ affected: 1, raw: [] });

      const result = await service.remove(id);

      expect(repository.delete).toHaveBeenCalledWith({ id_user: id });
      expect(result.id_user).toBe(id);
      expect(result.email_user).toBe('gabriel@riwi.io');
      expect(result).not.toHaveProperty('password_hash');
    });

    it('responds 404 when the user does not exist', async () => {
      repository.findOneBy.mockResolvedValue(null);

      await expect(service.remove(id)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(repository.delete).not.toHaveBeenCalled();
    });

    it('responds 404 when the user disappears before the delete', async () => {
      repository.findOneBy.mockResolvedValue(user);
      repository.delete.mockResolvedValue({ affected: 0, raw: [] });

      await expect(service.remove(id)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it.each([
      ['fk_orders_users', 'órdenes asociadas'],
      ['fk_inventory_movements_users', 'movimientos de inventario asociados'],
      ['fk_audit_logs_users', 'registros de auditoría asociados'],
      ['fk_notifications_users', 'notificaciones asociadas'],
    ])(
      'responds 409 when %s references the user',
      async (constraint, label) => {
        repository.findOneBy.mockResolvedValue(user);
        repository.delete.mockRejectedValue(referenceError(constraint));

        const error = await service.remove(id).catch((e: unknown) => e);

        expect(error).toBeInstanceOf(ConflictException);
        expect((error as ConflictException).message).toContain(label);
      },
    );

    it('responds 409 for a restrict violation from an unknown constraint', async () => {
      repository.findOneBy.mockResolvedValue(user);
      repository.delete.mockRejectedValue(
        referenceError('fk_future_table_users', '23001'),
      );

      await expect(service.remove(id)).rejects.toBeInstanceOf(
        ConflictException,
      );
    });

    it('does not hide unexpected database errors', async () => {
      const failure = new Error('connection lost');
      repository.findOneBy.mockResolvedValue(user);
      repository.delete.mockRejectedValue(failure);

      await expect(service.remove(id)).rejects.toBe(failure);
    });
  });
});