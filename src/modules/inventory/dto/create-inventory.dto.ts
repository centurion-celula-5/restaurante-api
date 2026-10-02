import { ApiProperty } from "@nestjs/swagger";

import { Transform, Type } from 'class-transformer' 
import { IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength, Min } from "class-validator";
import { UnitBase } from "../enums/unit-base.enum.js";


export class CreateInventoryDto {
    @ApiProperty({example: 'INV-001', maxLength: 50,})

    @Transform(({value}) => typeof value === 'string' ? value.trim() : value,)
    @IsString()@IsNotEmpty()@MaxLength(50)
    codeProduct: string;

    @ApiProperty({example: 'Carne molida', maxLength: 100})
    @Transform(({value}) => typeof value === 'string' ? value.trim() : value,)
    @IsString()@IsNotEmpty()@MaxLength(100)
    nameProduct: string;

    @ApiProperty({enum: UnitBase, example: UnitBase.GR})
    @IsEnum(UnitBase)
    unitBase: UnitBase;

    @ApiProperty({example: 2000, minimum: 0,})
    @Type(()=>Number)@IsNumber({maxDecimalPlaces: 3}, {message: 'minimo stock debe ser un número con maximo 3 decimales'})
    @Min(0)
    currentStop: number;
}

    
