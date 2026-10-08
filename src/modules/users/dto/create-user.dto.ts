import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  MinLength,
  MaxLength,
  IsDateString,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../enums/user-role.enum.js';

export class CreateUserDto {
  @ApiProperty({
    example: '1043215678',
    description: 'User identification number',
    maxLength: 50,
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  identification_number: string;

  @ApiProperty({
    example: 'Gabriel Rodríguez',
    description: 'Full name of the user',
    maxLength: 150,
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(1)
  @MaxLength(150)
  name_user: string;

  @ApiProperty({
    example: 'gabriel@riwi.io',
    description: 'Unique email address, used to log in',
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail()
  @MaxLength(150)
  email_user: string;

  @ApiProperty({
    example: 'securePassword123',
    description: 'User password',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({
    example: '1998-05-12',
    description: 'Date of birth in ISO format (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  birthday?: string | null;

  @ApiPropertyOptional({
    example: '3001234567',
    description: 'Contact phone number',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone_user?: string | null;

  @ApiPropertyOptional({
    enum: UserRole,
    example: UserRole.EMPLOYEE,
    default: UserRole.EMPLOYEE,
    description: 'Role assigned to the user within the system',
  })
  @ValidateIf((_object, value) => value !== undefined)
  @IsEnum(UserRole)
  user_role?: UserRole;
}
