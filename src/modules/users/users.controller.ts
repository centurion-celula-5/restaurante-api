import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UserResponseDto } from './dto/user-response.dto.js';

@ApiTags('users')
@Controller('users')
@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un usuario sin registros relacionados',
    description:
      'Eliminación física y administrativa. Solo procede si ninguna orden, movimiento de inventario, registro de auditoría o notificación referencia al usuario. Para conservar el historial, desactiva al usuario (is_active = false) en lugar de eliminarlo.',
  })
  @ApiParam({ name: 'id', format: 'uuid', description: 'UUID del usuario' })
  @ApiOkResponse({
    type: UserResponseDto,
    description: 'Usuario eliminado.',
  })
  @ApiBadRequestResponse({ description: 'El id no es un UUID válido.' })
  @ApiNotFoundResponse({ description: 'El usuario no existe.' })
  @ApiConflictResponse({
    description:
      'El usuario tiene órdenes, movimientos, auditoría o notificaciones asociadas.',
  })
  remove(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<UserResponseDto> {
    return this.usersService.remove(id);
  }
}