import { ApiProperty } from '@nestjs/swagger';

export class CustomerResponseDto {
  @ApiProperty({
    format: 'uuid',
    example: '3f1c2a9e-8b7d-4c1e-9a55-2d6f0b7e4a10',
  })
  idCustomer: string;

  @ApiProperty({ example: 'Carlos Perez' })
  nameCustomer: string;

  @ApiProperty({ example: '3023828158' })
  phoneCustomer: string;

  @ApiProperty({ example: 'carlos@example.test' })
  emailCustomer: string;

  @ApiProperty({ format: 'date-time', example: '2026-10-18T15:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ format: 'date-time', example: '2026-10-18T15:00:00.000Z' })
  updatedAt: string;
}
