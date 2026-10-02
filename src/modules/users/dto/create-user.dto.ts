import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  MinLength,
  MaxLength,
  IsDateString,
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
  @Transform(({ value }) => value?.trim())
  @IsString()
  @MaxLength(50)
  identification_number: string;

  @ApiProperty({
    example: 'Gabriel Rodríguez',
    description: 'Full name of the user',
    maxLength: 150,
  })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @MaxLength(150)
  name_user: string;

  @ApiProperty({
    example: 'gabriel@riwi.io',
    description: 'Unique email address, used to log in',
  })
  @Transform(({ value }) => value?.trim().toLowerCase())
  @IsEmail()
  @MaxLength(150)
  email_user: string;

  @ApiProperty({
    example: 'securePassword123',
    description: 'Plain text password; it gets hashed before being stored',
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
  birthday?: string;

  @ApiPropertyOptional({
    example: '3001234567',
    description: 'Contact phone number',
  })
  @Transform(({ value }) => value?.trim())
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone_user?: string;

  @ApiPropertyOptional({
    enum: UserRole,
    example: UserRole.WAITER,
    description: 'Role assigned to the user within the system',
  })
  @IsOptional()
  @IsEnum(UserRole)
  user_role?: UserRole;
}