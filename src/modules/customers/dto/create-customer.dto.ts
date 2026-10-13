import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ example: 'Carlos Perez', maxLength: 150 })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nameCustomer: string;

  @ApiProperty({ example: '3023828158', maxLength: 30 })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  phoneCustomer: string;

  @ApiProperty({ example: 'pepe@gmail.com', maxLength: 150 })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsString()
  @IsNotEmpty()
  @IsEmail({}, { message: 'emailCustomer debe ser un correo valido' })
  @MaxLength(150)
  emailCustomer: string;
}

/*Guia para la elaboración del DTO para customer, usarlo como guía

    /*@ApiProperty({example: 'Carlos Pérez', maxLength: 150,})
    @Transform(({value})=>typeof value === 'string' ? value.trim(): value,)
    @IsString()@IsNotEmpty()@MaxLength(150)
    nameCustomer: string;

    @ApiProperty({example: '+573001234567', maxLength: 30,})
    @Transform(({value})=>typeof value === 'string' ? value.trim(): value,)
    @IsString()@IsNotEmpty()@MaxLength(30)
    phoneCustomer: string;

    @ApiProperty({example: 'carlos@gmail.com', maxLength: 150})
    @Transform(({value})=>typeof value === 'string' ? value.trim().toLowerCase(): value,)
    @IsString()@IsNotEmpty()@IsEmail({}, {message: 'Email customer debe ser un correo valido'})@MaxLength(150)
    emailCustomer: string;*/
