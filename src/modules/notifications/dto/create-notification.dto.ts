import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { NotificationType } from '../enums/notification-type.enum.js';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'Type of notification to emit',
    enum: NotificationType,
    example: NotificationType.EMAIL,
  })
  @IsNotEmpty()
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({
    description: 'Recipient of the notification',
    example: 'customer@example.com',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  recipient: string;

  @ApiPropertyOptional({
    description: 'Optional subject line for the notification',
    example: 'Payment confirmation',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  subject?: string;

  @ApiProperty({
    description: 'Body content of the notification message',
    example: 'Your payment was processed successfully.',
  })
  @IsNotEmpty()
  @IsString()
  message: string;
}

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {}
