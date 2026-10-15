import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../enums/user-role.enum.js';

/**
 * Shape of a user in API responses.
 * It never includes `password_hash` or the entity relations.
 */
export class UserResponseDto {
  @ApiProperty({ example: '7d2a1f60-4b3c-4e8a-9f15-6c1d0b5e2a44' })
  id_user: string;

  @ApiProperty({ example: '1043215678' })
  identification_number: string;

  @ApiProperty({ example: 'Gabriel Rodríguez' })
  name_user: string;

  @ApiProperty({ example: 'gabriel@riwi.io' })
  email_user: string;

  @ApiProperty({ example: '1998-05-12', nullable: true, type: String })
  birthday: string | null;

  @ApiProperty({ example: '3001234567', nullable: true, type: String })
  phone_user: string | null;

  @ApiProperty({ enum: UserRole, example: UserRole.EMPLOYEE })
  user_role: UserRole;

  @ApiProperty({ example: true })
  is_active: boolean;

  @ApiProperty({ example: '2026-10-05T20:58:23.000Z' })
  created_at: Date;

  @ApiProperty({ example: '2026-10-05T20:58:23.000Z' })
  updated_at: Date;
}