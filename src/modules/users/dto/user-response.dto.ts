import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../enums/user-role.enum.js';
export class UserResponseDto {
  @ApiProperty({ example: '7d2a1f60-4b3c-4e8a-9f15-6c1d0b5e2a44' })
  id_user: string;

  @ApiProperty({ example: '1043215678' })
  identification_number: string;

  @ApiProperty({ example: 'Gabriel Rodríguez' })
  name_user: string;

  @ApiProperty({ example: 'gabriel@riwi.io' })
  email_user: string;

  @ApiProperty({
    example: '1998-05-12',
    nullable: true,
    type: String,
    description: 'Date of birth (YYYY-MM-DD) or null',
  })
  birthday: string | null;

  @ApiProperty({
    example: '3001234567',
    nullable: true,
    type: String,
    description: 'Contact phone number or null',
  })
  phone_user: string | null;

  @ApiProperty({ enum: UserRole, example: UserRole.EMPLOYEE })
  user_role: UserRole;

  @ApiProperty({ example: true })
  is_active: boolean;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2026-10-05T20:58:23.000Z',
    description: 'Creation instant (ISO 8601, UTC)',
  })
  created_at: Date;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2026-10-05T20:58:23.000Z',
    description: 'Last update instant (ISO 8601, UTC)',
  })
  updated_at: Date;
}