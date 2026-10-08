import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsDateString, IsInt, IsUUID, Min, Max } from 'class-validator';

export class CreateReservationDto {
  @ApiProperty({ example: '3f1c2a9e-8b7d-4c1e-9a55-2d6f0b7e4a10' })
  @IsUUID()
  customerId: string;

  @ApiProperty({ example: '9f1c2a9e-8b7d-4c1e-9a55-2d6f0b7e4a10' })
  @IsUUID()
  tableId: string;

  @ApiProperty({ example: '2026-10-20T20:00:00-5:00' })
  @IsDateString()
  reservationId: string;

  @ApiProperty({ example: '4, minimmun: 1, Maximun: 32727' })
  @IsInt()
  @Min(1)
  @Max(32727)
  partySize: number;
}
