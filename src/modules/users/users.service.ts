import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UserResponseDto } from './dto/user-response.dto.js';
import { User } from './entities/user.entity.js';
import { toUserResponseDto } from './users.mapper.js';

// PostgreSQL error codes that mean "this row is still referenced":
// 23503 = foreign key violation, 23001 = restrict violation.
const REFERENCE_ERROR_CODES = new Set(['23503', '23001']);

// Foreign keys that point to users.id_user.
// We use the key name to explain what is blocking the delete.
const REFERENCE_LABELS: Record<string, string> = {
  fk_orders_users: 'órdenes asociadas',
  fk_inventory_movements_users: 'movimientos de inventario asociados',
  fk_audit_logs_users: 'registros de auditoría asociados',
  fk_notifications_users: 'notificaciones asociadas',
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: string) {
    return `This action returns a #${id} user`;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  /**
   * Permanently deletes a user, but only if nothing else points to it.
   * - 404 if the user does not exist.
   * - 409 if orders, inventory movements, audit logs or notifications
   *   reference the user. The foreign keys use ON DELETE RESTRICT,
   *   so the database refuses the delete and nothing is removed.
   */
  async remove(id: string): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOneBy({ id_user: id });
    if (!user) {
      throw new NotFoundException(`Usuario ${id} no encontrado.`);
    }

    // Build the response BEFORE deleting, because TypeORM clears the id
    // of an entity after it is removed.
    const deletedUser = toUserResponseDto(user);

    try {
      const result = await this.usersRepository.delete({ id_user: id });
      if (!result.affected) {
        // Someone else deleted the user between our search and our delete.
        throw new NotFoundException(`Usuario ${id} no encontrado.`);
      }
    } catch (error) {
      // The database blocked the delete because of a reference -> 409.
      if (this.isReferenceViolation(error)) {
        throw new ConflictException(this.buildConflictMessage(error));
      }
      // Any other error is unexpected, so we do not hide it.
      throw error;
    }

    return deletedUser;
  }

  /** True if the error means "another table still references this user". */
  private isReferenceViolation(error: unknown): error is QueryFailedError {
    if (!(error instanceof QueryFailedError)) return false;
    const { code } = error.driverError as { code?: string };
    return code !== undefined && REFERENCE_ERROR_CODES.has(code);
  }

  /** Builds the 409 message, naming what blocks the delete when we know it. */
  private buildConflictMessage(error: QueryFailedError): string {
    const { constraint } = error.driverError as { constraint?: string };
    const label = constraint ? REFERENCE_LABELS[constraint] : undefined;
    return `No se puede eliminar el usuario porque tiene ${label ?? 'registros asociados'}. Desactívalo para conservar el historial.`;
  }
}