import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { NotificationType } from '../enums/notification-type.enum.js';

export class CreateNotificationDto {
  @ApiPropertyOptional({
    description: 'Type of notification (defaults to SYSTEM)',
    enum: NotificationType,
    example: NotificationType.SYSTEM,
  })
  @ValidateIf((_object, value) => value !== undefined)
  @IsEnum(NotificationType)
  type?: NotificationType;

  @ApiProperty({
    description: 'Id of the user who receives the notification',
    example: '3f2b8c1e-5a4d-4e6f-9b7a-1c2d3e4f5a6b',
  })
  @IsNotEmpty()
  @IsUUID()
  recipient_user_id: string;

  @ApiProperty({
    description: 'Title of the notification',
    example: 'Reservation confirmed',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  title: string;

  @ApiProperty({
    description: 'Body content of the notification message',
    example: 'Your reservation for table 4 was confirmed.',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty()
  @IsString()
  message: string;
}

export class UpdateNotificationDto extends PartialType(CreateNotificationDto, {
  skipNullProperties: false,
}) {}
