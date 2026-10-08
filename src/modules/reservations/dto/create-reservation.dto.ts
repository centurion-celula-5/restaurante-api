import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Min,
  Max,
  Validate,
  ValidateIf,
} from 'class-validator';
import { ReservationStatus } from '../entities/enum/reservation-estatus.enum.js';
import { ReservationInterval } from './reservation-interval.validator.js';

export class CreateReservationDto {
  @ApiProperty({ example: '3f1c2a9e-8b7d-4c1e-9a55-2d6f0b7e4a10' })
  @IsUUID()
  customerId: string;

  @ApiProperty({ example: '9f1c2a9e-8b7d-4c1e-9a55-2d6f0b7e4a10' })
  @IsUUID()
  tableId: string;

  @ApiProperty({ example: '2026-10-20T20:00:00-05:00', format: 'date-time' })
  @IsDateString({ strict: true })
  @Matches(/(Z|[+-]\d{2}:\d{2})$/, {
    message: 'startsAt debe incluir la zona horaria',
  })
  startsAt: string;

  @ApiProperty({ example: '2026-10-20T21:00:00-05:00', format: 'date-time' })
  @IsDateString({ strict: true })
  @Matches(/(Z|[+-]\d{2}:\d{2})$/, {
    message: 'endsAt debe incluir la zona horaria',
  })
  @Validate(ReservationInterval)
  endsAt: string;

  @ApiProperty({ example: 4, minimum: 1, maximum: 32767 })
  @IsInt()
  @Min(1)
  @Max(32767)
  partySize: number;

  @ApiPropertyOptional({
    enum: ReservationStatus,
    default: ReservationStatus.PENDING,
  })
  @ValidateIf((_object, value) => value !== undefined)
  @IsEnum(ReservationStatus)
  status?: ReservationStatus;

  @ApiPropertyOptional({ nullable: true, example: 'Mesa junto a la ventana' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsOptional()
  @IsString()
  notes?: string | null;

  @ApiPropertyOptional({ nullable: true, format: 'date-time' })
  @IsOptional()
  @IsDateString({ strict: true })
  @Matches(/(Z|[+-]\d{2}:\d{2})$/)
  cancelledAt?: string | null;
}
